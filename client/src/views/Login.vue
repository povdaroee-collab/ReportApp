<template>
  <div class="min-h-screen flex items-center justify-center bg-[#0f172a] font-khmer relative overflow-hidden selection:bg-cyan-500 selection:text-white">
    
    <CustomAlert 
      :show="alert.show" 
      :title="alert.title" 
      :message="alert.message" 
      :type="alert.type" 
      @close="alert.show = false"
    />

    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/30 rounded-full blur-[120px] animate-pulse-slow"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/30 rounded-full blur-[120px] animate-pulse-slow delay-1000"></div>
      <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
    </div>

    <div class="relative w-full max-w-md mx-4 perspective-1000">
      
      <div class="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden group">
        <div class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

        <div class="text-center mb-10 relative z-10">
          <div class="inline-block p-3 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10 mb-4 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 tracking-wide">ចូលប្រព័ន្ធ</h1>
          <p class="text-slate-400 text-sm mt-2 font-medium">Report Management System</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6 relative z-10">
          
          <div class="group relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 group-focus-within:text-cyan-400 text-slate-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            <input v-model="username" type="text" class="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl py-3.5 pl-11 pr-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300 hover:border-slate-600" placeholder="ឈ្មោះគណនី (Username)" required />
          </div>

          <div class="group relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 group-focus-within:text-purple-400 text-slate-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <input v-model="password" type="password" class="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl py-3.5 pl-11 pr-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 hover:border-slate-600" placeholder="ពាក្យសម្ងាត់ (Password)" required />
          </div>

          <button type="submit" class="w-full relative overflow-hidden group bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-cyan-500/20 transform transition-all duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-70" :disabled="isLoading">
            <div class="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out skew-x-12"></div>
            <span v-if="!isLoading" class="relative z-10 flex items-center justify-center gap-2">
              ចូលប្រព័ន្ធ
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </span>
            <span v-else class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              កំពុងដំណើរការ...
            </span>
          </button>
        </form>
      </div>

      <p class="text-center text-slate-500 text-xs mt-6 font-medium">
        &copy; 2024 Report System. All rights reserved.
      </p>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import CustomAlert from '../components/shared/CustomAlert.vue';

// --- FIREBASE IMPORTS ---
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/firebaseConfig'; // Ensure this points to your firebaseConfig.js

const username = ref('');
const password = ref('');
const isLoading = ref(false);
const router = useRouter();

// Alert State Management
const alert = reactive({
  show: false,
  title: '',
  message: '',
  type: 'success'
});

const triggerAlert = (type, title, message) => {
  alert.show = true;
  alert.type = type;
  alert.title = title;
  alert.message = message;
  setTimeout(() => { alert.show = false; }, 3000);
};

// --- LOGIN LOGIC ---
const handleLogin = async () => {
  if (!username.value || !password.value) {
    return triggerAlert('error', 'បរាជ័យ', 'សូមបញ្ចូលឈ្មោះគណនី និងពាក្យសម្ងាត់!');
  }
  
  isLoading.value = true;

  try {
    // 1. Convert Username to Fake Email (Since Firebase uses Email)
    const email = `${username.value}@report-system.com`;

    // 2. Authenticate with Firebase Auth (Checks Password)
    const userCredential = await signInWithEmailAndPassword(auth, email, password.value);
    const user = userCredential.user;

    // 3. Query Firestore to get User Data (Checks Role)
    const userDocRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userDocRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();

      // A. Check if user is blocked
      if (userData.isBlocked) {
        triggerAlert('error', 'គណនីត្រូវបានបិទ', 'សូមទាក់ទងទៅកាន់ម្ចាស់ប្រព័ន្ធ');
        isLoading.value = false;
        return;
      }

      // B. Check Role and Redirect
      if (userData.role === 'owner') {
        triggerAlert('success', 'ជោគជ័យ', `ស្វាគមន៍ម្ចាស់ប្រព័ន្ធ ${userData.fullName}`);
        setTimeout(() => router.push('/app/owner/dashboard'), 1500);
      } 
      else if (userData.role === 'admin') {
        triggerAlert('success', 'ជោគជ័យ', `ស្វាគមន៍អ្នកគ្រប់គ្រង ${userData.fullName}`);
        setTimeout(() => router.push('/app/admin/dashboard'), 1500);
      } 
      else {
         triggerAlert('error', 'គ្មានសិទ្ធិ', 'តួនាទីរបស់អ្នកមិនត្រឹមត្រូវ!');
      }

    } else {
      triggerAlert('error', 'រកមិនឃើញ', 'មិនមានទិន្នន័យនៅក្នុងប្រព័ន្ធ');
    }

  } catch (error) {
    console.error("Login Error:", error.code);
    
    // Friendly Error Messages
    let msg = "មានបញ្ហាក្នុងការភ្ជាប់";
    if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      msg = "ឈ្មោះគណនី ឬ ពាក្យសម្ងាត់មិនត្រឹមត្រូវ";
    } else if (error.code === 'auth/too-many-requests') {
      msg = "ព្យាយាមច្រើនដងពេក សូមរង់ចាំបន្តិច";
    } else if (error.code === 'auth/configuration-not-found') {
        msg = "សូមបើក Email/Password Login នៅក្នុង Firebase Console ជាមុនសិន!";
    }
    
    triggerAlert('error', 'បរាជ័យ', msg);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@300;400;500;600;700&display=swap');
.font-khmer { font-family: 'Kantumruy Pro', sans-serif; }
@keyframes pulse-slow {
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.1); opacity: 0.2; }
}
.animate-pulse-slow { animation: pulse-slow 8s infinite ease-in-out; }
</style>