require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const verifyToken = require('./middleware/authMiddleware');

const app = express();
app.use(cors());
app.use(express.json());

// --- 1. FIREBASE CONNECTION ---
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

// --- 2. CLOUDINARY CONFIG ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// --- 3. MULTER ---
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
        await db.collection('users').doc(uid).delete();
        res.json({ success: true, message: "Admin deleted successfully" });
    } catch (error) {
        console.error("Delete Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// 4. CREATE SELLER
app.post('/api/create-seller', verifyToken, upload.fields([{ name: 'profileImage' }, { name: 'idCardImage' }]), async (req, res) => {
  try {
    const { fullName, username, password, address, telegram, idNumber, phoneNumber } = req.body; 
    
    if (!req.files || !req.files.profileImage) {
        return res.status(400).json({ error: "Profile image is required!" });
    }

    // Upload Profile
    const profileResult = await uploadToCloudinary(req.files.profileImage[0].buffer, "report_project/sellers");
    const profileUrl = profileResult.secure_url;

    // Upload ID
    let idCardUrl = "";
    if (req.files.idCardImage) {
        const idResult = await uploadToCloudinary(req.files.idCardImage[0].buffer, "report_project/sellers_id");
        idCardUrl = idResult.secure_url;
    }

    const email = `${username}@report-system.com`; 
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: fullName,
      photoURL: profileUrl
    });

    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      username: username,
      fullName: fullName,
      role: 'seller', 
      address: address || "",
      telegram: telegram || "",
      phoneNumber: phoneNumber || "",
      idNumber: idNumber || "", 
      photoUrl: profileUrl,
      idCardUrl: idCardUrl,
      isBlocked: false,
      createdBy: req.user.uid,
      joinedDate: new Date().toISOString().split('T')[0], 
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ success: true, message: "Seller created successfully!" });

  } catch (error) {
    console.error("Create Seller Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// 5. UPDATE SELLER (NEW ROUTE)
app.put('/api/update-seller/:uid', verifyToken, upload.fields([{ name: 'profileImage' }, { name: 'idCardImage' }]), async (req, res) => {
    try {
        const { uid } = req.params;
        const { fullName, username, address, telegram, phoneNumber, idNumber, password } = req.body;
        
        const updateData = {
            fullName,
            username,
            address,
            telegram,
            phoneNumber,
            idNumber
        };

        const authUpdates = {};

        // Update Profile Image if provided
        if (req.files && req.files.profileImage) {
            const profileResult = await uploadToCloudinary(req.files.profileImage[0].buffer, "report_project/sellers");
            updateData.photoUrl = profileResult.secure_url;
            authUpdates.photoURL = updateData.photoUrl;
        }

        // Update ID Card Image if provided
        if (req.files && req.files.idCardImage) {
            const idResult = await uploadToCloudinary(req.files.idCardImage[0].buffer, "report_project/sellers_id");
            updateData.idCardUrl = idResult.secure_url;
        }

        // Prepare Auth Updates
        if (fullName) authUpdates.displayName = fullName;
        if (username) authUpdates.email = `${username}@report-system.com`;
        if (password && password.trim().length >= 6) authUpdates.password = password;

        // Apply Auth Updates
        if (Object.keys(authUpdates).length > 0) {
            await admin.auth().updateUser(uid, authUpdates);
        }

        // Apply Firestore Updates
        await db.collection('users').doc(uid).update(updateData);

        res.json({ success: true, message: "Seller updated successfully" });

    } catch (error) {
        console.error("Update Seller Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// 6. DELETE SELLER (NEW ROUTE)
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
    const { sellerId, sellerName, sellerIdNumber, date, totalClients, totalSold, unit, totalPrice, currency } = req.body;

    await db.collection('sales_reports').add({
      sellerId,
      sellerName,
      sellerIdNumber,
      date, 
      totalClients,
      totalSold,
      unit,
      totalPrice,
      currency,
      createdBy: req.user.uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ success: true, message: "Sales report saved successfully" });

  } catch (error) {
    console.error("Sales Save Error:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});