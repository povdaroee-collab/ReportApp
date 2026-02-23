<template>
  <div class="flex h-screen bg-[#F0F2F5] font-khmer overflow-hidden relative selection:bg-indigo-500 selection:text-white">
    
    <Teleport to="body">
      <div class="fixed top-4 right-4 z-[9999] w-full max-w-sm pointer-events-none flex flex-col gap-2">
        <div class="pointer-events-auto">
           <CustomAlert 
             :show="alert.show" 
             :type="alert.type" 
             :title="alert.title" 
             :message="alert.message" 
             @close="alert.show = false"
           />
        </div>
      </div>
    </Teleport>

    <div 
      v-if="isSidebarOpen" 
      @click="isSidebarOpen = false"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
    ></div>

    <aside 
      class="fixed inset-y-0 left-0 w-72 bg-[#0F172A] text-white z-50 transform transition-transform duration-300 ease-out shadow-[4px_0_24px_rgba(0,0,0,0.3)] flex flex-col border-r border-white/5"
      :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="absolute top-[-10%] left-[-10%] w-40 h-40 bg-purple-500/20 blur-[80px] rounded-full pointer-events-none"></div>
      <div class="absolute bottom-0 right-0 w-60 h-60 bg-blue-600/10 blur-[60px] rounded-full pointer-events-none"></div>

      <div class="relative px-6 py-8 flex items-center gap-4 z-10 border-b border-white/5">
        <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 relative overflow-hidden">
          <div class="absolute inset-0 bg-white/20 blur-md rounded-full -top-2 -left-2 w-8 h-8"></div>
          <svg class="h-6 w-6 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div>
          <h1 class="text-xl font-black tracking-wide text-white leading-tight">ប្រព័ន្ធគ្រប់គ្រង</h1>
          <p class="text-[11px] font-bold text-indigo-400 tracking-wider">របាយការណ៍លក់</p>
        </div>
        <button @click="isSidebarOpen = false" class="ml-auto text-slate-400 hover:text-white bg-white/5 p-2 rounded-xl">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar relative z-10">
        <div v-if="isAuthLoading" class="space-y-3">
           <div v-for="n in 3" :key="n" class="h-12 w-full bg-white/5 rounded-2xl animate-pulse border border-white/5"></div>
        </div>

        <div v-else>
            <router-link 
              v-for="item in menuItems" 
              :key="item.path"
              :to="item.path"
              @click="isSidebarOpen = false" 
              class="group relative flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all duration-300 overflow-hidden mb-2"
              active-class="bg-white/10 text-white shadow-lg backdrop-blur-md border border-white/10"
              :class="$route.path === item.path ? 'bg-white/10 text-white shadow-lg backdrop-blur-md border border-white/10' : 'text-slate-400 hover:bg-white/5 hover:text-white'"
            >
              <div v-if="$route.path === item.path" class="absolute left-0 top-1/2 -translate-y-1/2 h-2/3 w-1 rounded-r-full" :class="item.glowClass"></div>
              <div class="text-slate-400 group-hover:text-white transition-colors" :class="{'text-white': $route.path === item.path}" v-html="item.icon"></div>
              <span class="font-bold text-sm relative z-10 mt-0.5">{{ item.label }}</span>
              <div class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            </router-link>
        </div>
      </nav>

      <div class="p-4 border-t border-white/5 bg-slate-900/50 backdrop-blur-xl z-10 m-4 rounded-2xl relative overflow-hidden">
        <div v-if="isAuthLoading" class="flex items-center gap-3 p-2 animate-pulse">
            <div class="w-10 h-10 rounded-full bg-white/10"></div>
            <div class="flex-1 space-y-2">
                <div class="h-3 w-20 bg-white/10 rounded"></div>
                <div class="h-2 w-12 bg-white/10 rounded"></div>
            </div>
        </div>

        <div v-else class="flex items-center gap-2 group relative z-10">
          <div @click="openProfileModal" class="flex-1 flex items-center gap-3 cursor-pointer min-w-0 p-1.5 rounded-xl hover:bg-white/5 transition-colors">
             <div class="relative shrink-0">
               <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-[2px] group-hover:scale-105 transition-transform duration-300 shadow-md">
                  <img :src="userPhoto || `https://ui-avatars.com/api/?name=${userName}&background=random`" class="rounded-full w-full h-full object-cover border-2 border-slate-900" alt="Profile">
               </div>
               <span class="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
             </div>
             <div class="flex-1 min-w-0">
               <p class="text-sm font-bold text-white truncate">{{ userName }}</p>
               <p class="text-[10px] font-bold text-indigo-300 mt-0.5">{{ userRole }}</p>
             </div>
          </div>
          <button @click.stop="isLogoutModalOpen = true" class="p-2 shrink-0 rounded-xl text-slate-400 hover:bg-rose-500 hover:text-white transition-all shadow-sm" title="ចាកចេញ">
             <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          </button>
        </div>
      </div>
    </aside>

    <main class="flex-1 flex flex-col h-screen relative z-0 overflow-hidden w-full">
      
      <header class="h-[72px] px-4 md:px-8 flex items-center justify-between bg-white/70 backdrop-blur-2xl border-b border-slate-200/60 sticky top-0 z-30 transition-all shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
        
        <div 
          @click="isSidebarOpen = true" 
          class="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity select-none group"
        >
           <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all">
             <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
           </div>
           <div>
              <h2 class="text-lg md:text-xl font-black text-slate-800 tracking-wide leading-none">ប្រព័ន្ធគ្រប់គ្រង</h2>
              <p class="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Click to Open Menu</p>
           </div>
        </div>

        <div class="flex items-center gap-3 md:gap-5 ml-auto">
           <div class="hidden sm:flex px-4 py-1.5 bg-white border border-slate-200 rounded-xl shadow-sm items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.8)]"></span>
              <p class="text-xs font-bold text-slate-600 font-khmer mt-0.5">{{ currentDate }}</p>
           </div>
           <button class="relative p-2.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-indigo-600 transition-colors border border-transparent hover:border-slate-200">
              <span class="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
           </button>
        </div>
      </header>

      <div class="flex-1 overflow-y-auto p-4 md:p-8 relative scroll-smooth bg-slate-50/50">
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-indigo-200/20 blur-[120px] -z-10 rounded-full pointer-events-none"></div>

        <router-view v-slot="{ Component }">
          <transition 
            enter-active-class="transition-all duration-300 ease-out" 
            enter-from="opacity-0 translate-y-4 scale-[0.98]" 
            enter-to-class="opacity-100 translate-y-0 scale-100" 
            leave-active-class="transition-all duration-200 ease-in" 
            leave-from="opacity-100 translate-y-0 scale-100" 
            leave-to="opacity-0 -translate-y-2 scale-[0.98]"
            mode="out-in"
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </div>

    </main>
  </div>
</template>

<script setup>
// ... (Your existing imports and logic) ...
// Ensure isSidebarOpen is set to false by default

import { ref, computed, onMounted, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue';
import CustomAlert from '../components/shared/CustomAlert.vue'; 
import { auth, db } from '@/firebaseConfig'; 
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import axios from 'axios';

const router = useRouter();
const route = useRoute();
const isSidebarOpen = ref(false); // Default is CLOSED on all screens
const isAuthLoading = ref(true);

// ... (Rest of your script setup code remains the same) ...

// Modals
const isLogoutModalOpen = ref(false);
const isProfileModalOpen = ref(false);
const isUpdatingProfile = ref(false);

// Alert State
const alert = reactive({ show: false, type: 'success', title: '', message: '' });

const triggerAlert = (type, title, message) => {
    alert.type = type;
    alert.title = title;
    alert.message = message;
    alert.show = true;
    setTimeout(() => alert.show = false, 3000);
};

// Reactive User State
const currentUserData = ref({}); 
const userName = ref('កំពុងទាញយក...');
const userRole = ref('');
const rawRole = ref(''); 
const userPhoto = ref(null);

// Profile Form State
const profileForm = reactive({
   fullName: '',
   username: '',
   telegram: '',
   password: '',
   profileFile: null
});
const profilePreview = ref(null);

// SVG ICONS
const icons = {
  sales: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>`,
  users: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>`,
  chart: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 01-2-2z"/></svg>`,
  dashboard: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"/></svg>`,
  shield: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>`,
  cog: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`,
  trash: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>`,
  box: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>` // NEW ICON
};

// DYNAMIC MENU ITEMS
const menuItems = computed(() => {
  if (isAuthLoading.value) return [];

  const commonItems = [
    { label: 'បញ្ចូលទិន្នន័យលក់', path: '/app/admin/sales', key: 'sales', icon: icons.sales, glowClass: 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]' }, 
    { label: 'តំណាងលក់', path: '/app/admin/sellers', key: 'sellers', icon: icons.users, glowClass: 'bg-teal-500 shadow-[0_0_15px_rgba(20,184,166,0.6)]' },
    { label: 'របាយការណ៍លក់', path: '/app/admin/seller-reports', key: 'seller-reports', icon: icons.chart, glowClass: 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.6)]' },
  ];

  if (rawRole.value === 'owner') {
    return [
      { label: 'ផ្ទាំងគ្រប់គ្រង', path: '/app/owner/dashboard', key: 'dashboard', icon: icons.dashboard, glowClass: 'bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.6)]' },
      { label: 'គ្រប់គ្រង Admin', path: '/app/owner/admins', key: 'admins', icon: icons.shield, glowClass: 'bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.6)]' },
      { label: 'របាយការណ៍រួម', path: '/app/owner/reports', key: 'reports', icon: icons.chart, glowClass: 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.6)]' },
      { label: 'គ្រប់គ្រងស្តុក', path: '/app/owner/stock-management', key: 'stock', icon: icons.box, glowClass: 'bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.6)]' },
      { label: 'ការកំណត់', path: '/app/owner/settings', key: 'settings', icon: icons.cog, glowClass: 'bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.6)]' },
      { label: 'ធុងសម្រាម', path: '/app/owner/trash', key: 'trash', icon: icons.trash, glowClass: 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.6)]' },
    ];
  } else {
    return [
      { label: 'ផ្ទាំងគ្រប់គ្រង', path: '/app/admin/dashboard', key: 'dashboard', icon: icons.dashboard, glowClass: 'bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.6)]' },
      ...commonItems
    ];
  }
});

const currentDate = computed(() => {
  const date = new Date();
  return date.toLocaleDateString('km-KH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
});

// FETCH USER DATA
onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          currentUserData.value = data;
          
          userName.value = data.fullName || 'មិនមានឈ្មោះ';
          rawRole.value = data.role || 'user'; 
          userRole.value = data.role === 'owner' ? 'ម្ចាស់ប្រព័ន្ធ' : (data.role === 'admin' ? 'អ្នកគ្រប់គ្រង' : 'អ្នកប្រើប្រាស់');
          userPhoto.value = data.photoUrl || user.photoURL;
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        userName.value = "ភ្ញៀវ";
      } finally {
        isAuthLoading.value = false;
      }
    } else {
      router.push('/');
      isAuthLoading.value = false;
    }
  });
});

// --- PROFILE LOGIC ---
const openProfileModal = () => {
   profileForm.fullName = currentUserData.value.fullName || '';
   profileForm.username = currentUserData.value.username || '';
   profileForm.telegram = currentUserData.value.telegram || '';
   profileForm.password = '';
   profileForm.profileFile = null;
   profilePreview.value = currentUserData.value.photoUrl || userPhoto.value;
   
   isProfileModalOpen.value = true;
};

const handleProfileImage = (e) => {
   const file = e.target.files[0];
   if (!file) return;
   profileForm.profileFile = file;
   profilePreview.value = URL.createObjectURL(file);
};

const submitProfileUpdate = async () => {
   if (!profileForm.fullName || !profileForm.username) {
      return triggerAlert('warning', 'សូមបំពេញព័ត៌មាន', 'ឈ្មោះពេញ និងឈ្មោះគណនីមិនអាចទទេបានទេ');
   }

   isUpdatingProfile.value = true;
   try {
      const token = await auth.currentUser.getIdToken();
      const formData = new FormData();
      
      formData.append('fullName', profileForm.fullName);
      formData.append('username', profileForm.username);
      formData.append('telegram', profileForm.telegram);
      
      if (profileForm.password && profileForm.password.length >= 6) {
         formData.append('password', profileForm.password);
      }
      if (profileForm.profileFile) {
         formData.append('profileImage', profileForm.profileFile);
      }

      const res = await axios.put(`https://reportapp-81vf.onrender.com/api/update-admin/${auth.currentUser.uid}`, formData, {
         headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
         }
      });

      if (res.data.success) {
         triggerAlert('success', 'ជោគជ័យ', 'ព័ត៌មានគណនីត្រូវបានកែប្រែ');
         
         userName.value = profileForm.fullName;
         if (profileForm.profileFile) {
             userPhoto.value = profilePreview.value; 
         }
         
         currentUserData.value.fullName = profileForm.fullName;
         currentUserData.value.username = profileForm.username;
         currentUserData.value.telegram = profileForm.telegram;
         if (profileForm.profileFile) currentUserData.value.photoUrl = profilePreview.value;

         isProfileModalOpen.value = false;
      }
   } catch (error) {
      console.error("Profile Update Error:", error);
      triggerAlert('error', 'បរាជ័យ', error.response?.data?.error || 'មានបញ្ហាក្នុងការកែប្រែព័ត៌មាន');
   } finally {
      isUpdatingProfile.value = false;
   }
};

// CONFIRM LOGOUT
const confirmLogout = async () => {
    isLogoutModalOpen.value = false;
    try {
        await signOut(auth);
        triggerAlert('success', 'ជោគជ័យ', 'អ្នកបានចាកចេញដោយជោគជ័យ');
        setTimeout(() => {
            router.push('/');
        }, 800);
    } catch (error) {
        triggerAlert('error', 'បរាជ័យ', 'មានបញ្ហាក្នុងការចាកចេញ');
    }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Battambong:wght@400;700;900&family=Kantumruy+Pro:wght@400;700&display=swap');
.font-khmer { font-family: 'Kantumruy Pro', 'Battambong', sans-serif; }

/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(148, 163, 184, 0.3); border-radius: 10px; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background: rgba(148, 163, 184, 0.5); }
</style>