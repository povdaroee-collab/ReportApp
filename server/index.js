require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const verifyToken = require('./middleware/authMiddleware');
const fs = require('fs');
const axios = require('axios'); 

const app = express();

// 🌟 1. UPDATE CORS POLICY (IMPORTANT) 🌟
app.use(cors({
    origin: function (origin, callback) {
        // អនុញ្ញាតឱ្យរាល់ Origin (Dynamic)
        callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'x-admin-uid'],
    credentials: true,
    optionsSuccessStatus: 204
}));

// បញ្ជាក់ឱ្យចាប់យក Preflight OPTIONS requests ទាំងអស់
app.options(/.*/, cors());

app.use(express.json());

// --- 2. FIREBASE CONNECTION ---
try {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  if (serviceAccount.private_key) {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
  }
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log("🔥 Firebase Admin Connected Successfully!");
} catch (error) {
  console.error("❌ Firebase Error:", error.message);
  process.exit(1);
}

const db = admin.firestore();

// --- 3. CLOUDINARY CONFIG ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// --- 4. MULTER ---
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// --- HELPER: Upload ---
const uploadToCloudinary = (buffer, folderName) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: folderName },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
};

// ================= ROUTES ================= //

// 1. CREATE ADMIN
app.post('/api/create-admin', verifyToken, upload.single('profileImage'), async (req, res) => {
  try {
    const { fullName, username, password, telegram } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ error: "Image is required!" });

    const imageResult = await uploadToCloudinary(file.buffer, "report_project/admins");
    const imageUrl = imageResult.secure_url;

    const email = `${username}@report-system.com`; 
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: fullName,
      photoURL: imageUrl
    });

    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      username: username,
      fullName: fullName,
      telegram: telegram || "", 
      role: 'admin',
      vipStatus: true,
      isBlocked: false,
      isDeleted: false,
      photoUrl: imageUrl,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(200).json({ success: true, message: 'Admin created successfully!' });

  } catch (error) {
    console.error("Error creating admin:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. UPDATE ADMIN
app.put('/api/update-admin/:uid', verifyToken, upload.single('profileImage'), async (req, res) => {
    try {
        const { uid } = req.params;
        const { fullName, username, telegram, password } = req.body;
        const file = req.file;

        const updateData = {
            fullName,
            username,
            telegram: telegram || ""
        };

        const authUpdates = {};

        if (file) {
            const imageResult = await uploadToCloudinary(file.buffer, "report_project/admins");
            updateData.photoUrl = imageResult.secure_url;
            authUpdates.photoURL = updateData.photoUrl;
        }

        if (fullName) authUpdates.displayName = fullName;
        if (username) authUpdates.email = `${username}@report-system.com`;
        if (password && password.trim().length >= 6) authUpdates.password = password;

        if (Object.keys(authUpdates).length > 0) {
            await admin.auth().updateUser(uid, authUpdates);
        }

        await db.collection('users').doc(uid).update(updateData);

        res.json({ success: true, message: "Admin updated successfully" });

    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// 3. DELETE ADMIN
app.delete('/api/delete-admin/:uid', verifyToken, async (req, res) => {
    try {
        const { uid } = req.params;
        
        await admin.auth().deleteUser(uid);

        const batch = db.batch();

        const adminDocRef = db.collection('users').doc(uid);
        batch.delete(adminDocRef);

        const sellersSnapshot = await db.collection('users')
            .where('role', '==', 'seller')
            .where('createdBy', '==', uid)
            .get();
        
        sellersSnapshot.forEach(doc => {
            batch.delete(doc.ref);
        });

        const salesSnapshot = await db.collection('sales_reports')
            .where('createdBy', '==', uid)
            .get();
        
        salesSnapshot.forEach(doc => {
            batch.delete(doc.ref);
        });

        await batch.commit();

        res.json({ 
            success: true, 
            message: "Admin and all related data (Sellers & Sales) deleted successfully" 
        });

    } catch (error) {
        console.error("Delete Admin Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// 4. CREATE SELLER
app.post('/api/create-seller', verifyToken, upload.fields([{ name: 'profileImage' }, { name: 'idCardImage' }]), async (req, res) => {
  try {
    const { fullName, address, username, telegram, phoneNumber, idNumber, password, role } = req.body;

    const assignedRole = role === 'dealer' ? 'dealer' : 'seller';
    
    // 🌟 ការពារ Error ដោយប្រើ Optional Chaining សម្រាប់ req.user
    const creatorUid = req.user?.uid || req.headers['x-admin-uid'] || 'Unknown_Admin'; 

    if (idNumber) {
        const idCheckQuery = await db.collection('users').where('idNumber', '==', idNumber).get();
        if (!idCheckQuery.empty) {
            return res.status(400).json({ 
                success: false, 
                error: "ID_EXISTS", 
                message: "លេខអត្តសញ្ញាណប័ណ្ណនេះមានក្នុងប្រព័ន្ធរួចហើយ! (ID Card already exists)" 
            });
        }
    }

    const userRecord = await admin.auth().createUser({
      email: username + "@seller.com",
      password: password, 
      displayName: fullName,
    });

    let photoUrl = "";
    let idCardUrl = "";

    if (req.files && req.files.profileImage) {
        const profileResult = await uploadToCloudinary(req.files.profileImage[0].buffer, "report_project/sellers");
        photoUrl = profileResult.secure_url;
    }

    if (req.files && req.files.idCardImage) {
        const idResult = await uploadToCloudinary(req.files.idCardImage[0].buffer, "report_project/sellers_id");
        idCardUrl = idResult.secure_url;
    }

    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid, 
      fullName,
      address,
      username,
      telegram,
      phoneNumber,
      idNumber, 
      password, 
      role: assignedRole, 
      photoUrl,
      idCardUrl,
      createdBy: creatorUid, 
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ success: true, message: "Seller created successfully" });

  } catch (error) {
    console.error("Create Seller Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5. UPDATE SELLER
app.put('/api/update-seller/:uid', verifyToken, upload.fields([{ name: 'profileImage' }, { name: 'idCardImage' }]), async (req, res) => {
    try {
        const { uid } = req.params;
        const { fullName, username, address, telegram, phoneNumber, idNumber, password, role } = req.body;
        
        const assignedRole = role === 'dealer' ? 'dealer' : 'seller';

        const updateData = {
            fullName,
            username,
            address,
            telegram,
            phoneNumber,
            idNumber,
            password, 
            role: assignedRole 
        };

        const authUpdates = {};

        if (req.files && req.files.profileImage) {
            const profileResult = await uploadToCloudinary(req.files.profileImage[0].buffer, "report_project/sellers");
            updateData.photoUrl = profileResult.secure_url;
            authUpdates.photoURL = updateData.photoUrl;
        }
        if (req.files && req.files.idCardImage) {
            const idResult = await uploadToCloudinary(req.files.idCardImage[0].buffer, "report_project/sellers_id");
            updateData.idCardUrl = idResult.secure_url;
        }

        if (fullName) authUpdates.displayName = fullName;
        if (username) authUpdates.email = `${username}@report-system.com`;
        
        if (password && password.trim().length >= 6) {
            authUpdates.password = password.trim();
        }

        if (Object.keys(authUpdates).length > 0) {
            await admin.auth().updateUser(uid, authUpdates);
        }

        await db.collection('users').doc(uid).update(updateData);

        res.json({ success: true, message: "Seller updated successfully" });

    } catch (error) {
        console.error("Update Seller Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// 6. DELETE SELLER 
app.delete('/api/delete-seller/:uid', verifyToken, async (req, res) => {
    try {
        const { uid } = req.params;
        await admin.auth().deleteUser(uid);
        await db.collection('users').doc(uid).delete();
        res.json({ success: true, message: "Seller deleted successfully" });
    } catch (error) {
        console.error("Delete Seller Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// 7. CREATE SALES REPORT
app.post('/api/sales/create', verifyToken, async (req, res) => {
  try {
    const { 
      sellerId, 
      sellerName, 
      sellerIdNumber,
      date, 
      category, 
      totalClients, 
      totalSold, 
      unit, 
      totalPrice, 
      currency 
    } = req.body;

    const safeCategory = category || 'លក់រាយ';
    const creatorUid = req.user?.uid || req.headers['x-admin-uid'] || 'Unknown_Admin'; 

    const existingReport = await db.collection('sales_reports')
      .where('sellerId', '==', sellerId)
      .where('date', '==', date)
      .where('unit', '==', unit) 
      .where('category', '==', safeCategory) 
      .get();

    if (!existingReport.empty) {
        return res.status(400).json({ 
            success: false, 
            error: "DUPLICATE_ENTRY", 
            message: "This seller already has a report for this date, unit, and category." 
        });
    }

    await db.collection('sales_reports').add({
      sellerId,
      sellerName,
      sellerIdNumber,
      date, 
      category: safeCategory, 
      totalClients,
      totalSold,
      unit,
      totalPrice,
      currency,
      createdBy: creatorUid, 
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ success: true, message: "Sales report saved successfully" });

  } catch (error) {
    console.error("Sales Save Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// 8. REQUEST FINANCE PASSWORD RESET VIA TELEGRAM
app.post('/api/request-finance-reset', verifyToken, async (req, res) => {
    try {
        const { name, email, uid } = req.body;
        
        const userDoc = await db.collection('users').doc(uid).get();
        let currentPassword = "មិនទាន់បានកំណត់ទេ";
        
        if (userDoc.exists && userDoc.data().financePassword) {
            currentPassword = userDoc.data().financePassword;
        }

        const message = `🚨 <b>សំណើសុំមើលលេខសម្ងាត់ហិរញ្ញវត្ថុ</b>\n\n👤 ឈ្មោះ: ${name}\n📧 អ៊ីមែល: ${email}\n🔑 UID: <code>${uid}</code>\n\n🔓 <b>លេខសម្ងាត់របស់អ្នកគឺ:</b> <code>${currentPassword}</code>`;
        
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        const devChatId = process.env.TELEGRAM_DEV_CHAT_ID;

        if (!botToken || !devChatId) {
            return res.status(500).json({ error: "Telegram Configuration Missing" });
        }

        await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            chat_id: devChatId,
            text: message,
            parse_mode: "HTML"
        });
        
        res.json({ success: true, message: "Request sent successfully" });

    } catch (error) {
        console.error("Telegram Error:", error);
        res.status(500).json({ error: "Failed to send telegram message" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});