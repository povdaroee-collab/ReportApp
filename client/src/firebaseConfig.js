import { initializeApp } from "firebase/app";
// 🌟 ផ្លាស់ប្តូរការ Import ដោយប្រើ initializeFirestore និងមុខងារ Cache 🌟
import { 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager 
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

// usage of import.meta.env is how Vite reads the .env file
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

let db;

// 🌟 មុខងារការពារ Local Development សន្សំ Reads ១០០% 🌟
// បញ្ជាក់៖ typeof window !== 'undefined' ការពារកុំឱ្យ Error ពេល Vite កំពុង Build (SSR)
if (typeof window !== 'undefined' && window.location.hostname === "localhost") {
  console.log("🛠️ Local Development Detected: Firebase Local Cache Enabled (Saving Reads!)");
  db = initializeFirestore(app, {
    // បើកមុខងារយកទិន្នន័យពី Cache ក្នុងកុំព្យូទ័រ ជំនួសការទាញពី Server រាល់ពេល Save កូដ
    localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
  });
} else {
  // សម្រាប់លើ Production (GitHub Pages/Vercel) ឱ្យវាដំណើរការទាញទិន្នន័យធម្មតា
  db = initializeFirestore(app, {});
}

export { db, auth };