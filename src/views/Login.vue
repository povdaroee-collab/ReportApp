<template>
  <div class="min-h-screen flex items-center justify-center bg-[#0a0a0a] font-khmer relative overflow-hidden selection:bg-amber-500 selection:text-black">
    
    <Teleport to="body">
      <div class="fixed top-4 right-4 z-[9999] w-full max-w-sm pointer-events-none flex flex-col gap-2">
        <div class="pointer-events-auto">
           <Toast />
        </div>
      </div>
    </Teleport>

    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-amber-600/10 rounded-full blur-[120px] animate-pulse-slow"></div>
      <div class="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-yellow-500/10 rounded-full blur-[120px] animate-pulse-slow delay-1000"></div>
      <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
    </div>

    <div class="relative w-full max-w-md mx-4 perspective-1000">
      
      <div class="relative bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[2rem] p-8 md:p-10 shadow-[0_0_60px_-15px_rgba(245,158,11,0.15)] overflow-hidden group">
        
        <div class="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

        <div class="text-center mb-10 relative z-10">
          <div class="inline-flex p-3 rounded-2xl bg-gradient-to-br from-amber-500/10 to-yellow-500/5 border border-amber-500/20 mb-5 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-100 to-white tracking-wide">ចូលប្រព័ន្ធ</h1>
          <p class="text-amber-500/70 text-[11px] uppercase tracking-[0.2em] font-black mt-2">Report Management System</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5 relative z-10">
          
          <div class="group relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 group-focus-within:text-amber-400 text-neutral-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            <input 
              v-model="username" 
              type="text" 
              class="w-full bg-[#171717] border border-neutral-800 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-300 hover:border-neutral-700 font-medium" 
              placeholder="ឈ្មោះគណនី (Username)" 
              required 
            />
          </div>

          <div class="group relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 group-focus-within:text-amber-400 text-neutral-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            
            <input 
              v-model="password" 
              :type="showPassword ? 'text' : 'password'" 
              class="w-full bg-[#171717] border border-neutral-800 rounded-xl py-3.5 pl-11 pr-12 text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-300 hover:border-neutral-700 font-medium font-mono tracking-wider" 
              placeholder="ពាក្យសម្ងាត់ (Password)" 
              required 
            />
            
            <button 
              type="button" 
              @click="showPassword = !showPassword" 
              class="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-500 hover:text-amber-400 transition-colors focus:outline-none"
              tabindex="-1"
            >
              <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
            </button>
          </div>

          <div class="flex justify-end">
             <a href="https://t.me/MMKDaro" target="_blank" class="text-xs font-bold text-neutral-500 hover:text-amber-400 transition-colors flex items-center gap-1">
                ភ្លេចពាក្យសម្ងាត់?
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
             </a>
          </div>

          <button type="submit" class="w-full relative overflow-hidden group bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-black py-3.5 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.3)] transform transition-all duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-70 mt-4" :disabled="isLoading">
            <div class="absolute inset-0 bg-white/30 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out skew-x-12"></div>
            <span v-if="!isLoading" class="relative z-10 flex items-center justify-center gap-2">
              ចូលប្រព័ន្ធ (LOGIN)
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </span>
            <span v-else class="flex items-center justify-center gap-2 relative z-10">
              <svg class="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              កំពុងដំណើរការ...
            </span>
          </button>

        </form>
      </div>

      <p class="text-center text-neutral-600 text-[10px] mt-8 font-black uppercase tracking-widest">
        &copy; 2026 Report System. All rights reserved.
      </p>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'; 
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/firebaseConfig';

// ✅ ប្រើប្រាស់ Notification Store ថ្មី
import Toast from '@/components/Toast.vue';
import { useNotificationStore } from '@/stores/notification';

const username = ref('');
const password = ref('');
const showPassword = ref(false); // State for toggling password visibility
const isLoading = ref(false);
const router = useRouter();
const notification = useNotificationStore();

// --- LOGIN LOGIC ---
const handleLogin = async () => {
  if (!username.value || !password.value) {
    return notification.error('សូមបញ្ចូលឈ្មោះគណនី និងពាក្យសម្ងាត់!', 'បរាជ័យ');
  }
  
  isLoading.value = true;

  try {
    // 1. Convert Username to Fake Email
    const email = `${username.value}@report-system.com`;

    // 2. Authenticate with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password.value);
    const user = userCredential.user;

    // 3. Query Firestore to get User Data
    const userDocRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userDocRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();

      // A. Check if user is soft-deleted (In Trash)
      if (userData.isDeleted === true || userData.isDeleted === "true") {
        await signOut(auth); // Immediately log them back out
        notification.error('គណនីនេះត្រូវបានលុបចេញពីប្រព័ន្ធហើយ។', 'គណនីមិនមានសុពលភាព');
        isLoading.value = false;
        return;
      }

      // B. Check if user is blocked
      if (userData.isBlocked) {
        await signOut(auth); // Immediately log them back out
        notification.error('សូមទាក់ទងទៅកាន់ម្ចាស់ប្រព័ន្ធ', 'គណនីត្រូវបានបិទ');
        isLoading.value = false;
        return;
      }

      // C. Check Role and Redirect
      if (userData.role === 'owner') {
        notification.success(`ស្វាគមន៍ម្ចាស់ប្រព័ន្ធ ${userData.fullName}`, 'ជោគជ័យ');
        setTimeout(() => router.push('/app/owner/dashboard'), 1000);
      } 
      else if (userData.role === 'admin') {
        notification.success(`ស្វាគមន៍អ្នកគ្រប់គ្រង ${userData.fullName}`, 'ជោគជ័យ');
        setTimeout(() => router.push('/app/admin/dashboard'), 1000);
      } 
      else {
         await signOut(auth);
         notification.error('តួនាទីរបស់អ្នកមិនមានសិទ្ធិចូលប្រព័ន្ធនេះទេ!', 'គ្មានសិទ្ធិ');
      }

    } else {
      await signOut(auth);
      notification.error('មិនមានទិន្នន័យនៅក្នុងប្រព័ន្ធ', 'រកមិនឃើញ');
    }

  } catch (error) {
    console.error("Login Error:", error.code);
    
    // Friendly Error Messages
    let msg = "មានបញ្ហាក្នុងការភ្ជាប់";
    let title = "បរាជ័យ";

    if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      msg = "ឈ្មោះគណនី ឬ ពាក្យសម្ងាត់មិនត្រឹមត្រូវ";
    } else if (error.code === 'auth/too-many-requests') {
      msg = "ព្យាយាមច្រើនដងពេក សូមរង់ចាំបន្តិច";
    } else if (error.code === 'auth/configuration-not-found') {
      msg = "សូមបើក Email/Password Login នៅក្នុង Firebase Console ជាមុនសិន!";
    }
    
    notification.error(msg, title);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@300;400;500;600;700;900&display=swap');
.font-khmer { font-family: 'Kantumruy Pro', sans-serif; }

@keyframes pulse-slow {
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.1); opacity: 0.2; }
}
.animate-pulse-slow { animation: pulse-slow 8s infinite ease-in-out; }
</style>