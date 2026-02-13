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

    <TransitionRoot appear :show="isProfileModalOpen" as="template">
      <Dialog as="div" @close="isProfileModalOpen = false" class="relative z-[100] font-khmer">
        <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95 translate-y-4" enter-to="opacity-100 scale-100 translate-y-0" leave="duration-200 ease-in" leave-from="opacity-100 scale-100 translate-y-0" leave-to="opacity-0 scale-95 translate-y-4">
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-[2rem] bg-white text-left align-middle shadow-2xl transition-all relative">
                
                <div class="h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative">
                   <button @click="isProfileModalOpen = false" class="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-colors">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                   </button>
                </div>

                <form @submit.prevent="submitProfileUpdate" class="px-8 pb-8">
                   <div class="flex justify-center -mt-16 mb-6 relative">
                      <div class="relative group cursor-pointer" @click="$refs.profileInput.click()">
                         <div class="w-32 h-32 rounded-full p-1 bg-white shadow-lg">
                            <img :src="profilePreview || `https://ui-avatars.com/api/?name=${profileForm.fullName}&background=random`" class="w-full h-full object-cover rounded-full bg-slate-100">
                         </div>
                         <div class="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity m-1">
                            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                         </div>
                         <input ref="profileInput" type="file" accept="image/*" class="hidden" @change="handleProfileImage">
                      </div>
                   </div>

                   <div class="space-y-4">
                      <div>
                         <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">ឈ្មោះពេញ (Full Name)</label>
                         <input v-model="profileForm.fullName" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all">
                      </div>
                      
                      <div class="grid grid-cols-2 gap-4">
                         <div>
                            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">ឈ្មោះគណនី (Username)</label>
                            <input v-model="profileForm.username" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all">
                         </div>
                         <div>
                            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">តេឡេក្រាម (Telegram)</label>
                            <input v-model="profileForm.telegram" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" placeholder="@username">
                         </div>
                      </div>

                      <div>
                         <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">លេខសម្ងាត់ថ្មី (New Password)</label>
                         <input v-model="profileForm.password" type="password" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:font-normal placeholder:text-slate-400" placeholder="ទុកទទេប្រសិនបើមិនចង់ប្តូរ (Leave blank to keep)">
                      </div>
                   </div>

                   <button type="submit" :disabled="isUpdatingProfile" class="mt-8 w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed">
                      <svg v-if="isUpdatingProfile" class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                      <span>{{ isUpdatingProfile ? 'កំពុងរក្សាទុក...' : 'រក្សាទុកព័ត៌មាន (Save Changes)' }}</span>
                   </button>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <TransitionRoot appear :show="isLogoutModalOpen" as="template">
      <Dialog as="div" @close="isLogoutModalOpen = false" class="relative z-[100] font-khmer">
        <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95 translate-y-4" enter-to="opacity-100 scale-100 translate-y-0" leave="duration-200 ease-in" leave-from="opacity-100 scale-100 translate-y-0" leave-to="opacity-0 scale-95 translate-y-4">
              <DialogPanel class="w-full max-w-sm transform overflow-hidden rounded-[2rem] bg-white p-6 text-left align-middle shadow-2xl transition-all">
                <div class="flex flex-col items-center text-center mt-4">
                   <div class="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 text-red-500 shadow-sm border border-red-100">
                      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                   </div>
                   <DialogTitle as="h3" class="text-xl font-bold leading-6 text-slate-800">
                     ចាកចេញពីប្រព័ន្ធ?
                   </DialogTitle>
                   <div class="mt-2 mb-6">
                     <p class="text-sm text-slate-500">តើអ្នកពិតជាចង់ចាកចេញពីគណនីនេះមែនទេ?</p>
                   </div>
                </div>

                <div class="grid grid-cols-2 gap-3 mt-4">
                  <button type="button" class="w-full justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-800 focus:outline-none transition-colors" @click="isLogoutModalOpen = false">
                    ទេ (No)
                  </button>
                  <button type="button" class="w-full justify-center rounded-xl border border-transparent bg-red-500 px-4 py-3 text-sm font-bold text-white hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-500/20 shadow-lg shadow-red-500/30 transition-all active:scale-95" @click="confirmLogout">
                    បាទ/ចាស (Yes)
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <div 
      v-if="isSidebarOpen" 
      @click="isSidebarOpen = false"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
    ></div>

    <aside 
      class="fixed md:static inset-y-0 left-0 w-72 bg-[#0F172A] text-white z-50 transform transition-transform duration-300 ease-out shadow-[4px_0_24px_rgba(0,0,0,0.3)] flex flex-col border-r border-white/5"
      :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
    >
      <div class="absolute top-[-10%] left-[-10%] w-40 h-40 bg-purple-500/20 blur-[80px] rounded-full pointer-events-none"></div>
      <div class="absolute bottom-0 right-0 w-60 h-60 bg-blue-600/10 blur-[60px] rounded-full pointer-events-none"></div>

      <div class="relative p-6 flex items-center gap-3 z-10">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h1 class="text-xl font-bold tracking-wide text-white">REPORT<span class="text-indigo-400">APP</span></h1>
          <p class="text-[10px] text-slate-400 uppercase tracking-widest">Management System</p>
        </div>
        <button @click="isSidebarOpen = false" class="md:hidden ml-auto text-slate-400 hover:text-white">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar relative z-10">
        <p class="px-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Main Menu</p>

        <div v-if="isAuthLoading" class="space-y-3">
           <div v-for="n in 3" :key="n" class="h-12 w-full bg-white/5 rounded-xl animate-pulse border border-white/5"></div>
        </div>

        <div v-else>
            <router-link 
              v-for="item in menuItems" 
              :key="item.path"
              :to="item.path"
              @click="isSidebarOpen = false"
              class="group relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 overflow-hidden mb-2"
              active-class="bg-white/10 text-white shadow-lg backdrop-blur-md border border-white/5"
              :class="$route.path.includes(item.key) ? '' : 'text-slate-400 hover:bg-white/5 hover:text-white'"
            >
              <div v-if="$route.path.includes(item.key)" class="absolute left-0 top-0 bottom-0 w-1" :class="item.glowClass"></div>
              
              <span class="text-xl relative z-10 transition-transform group-hover:scale-110 duration-300">{{ item.icon }}</span>
              <span class="font-medium relative z-10">{{ item.label }}</span>
              
              <div class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            </router-link>
        </div>
      </nav>

      <div class="p-4 border-t border-white/5 bg-black/20 backdrop-blur-md z-10">
        <div v-if="isAuthLoading" class="flex items-center gap-3 p-3 rounded-xl bg-white/5 animate-pulse">
            <div class="w-10 h-10 rounded-full bg-white/10"></div>
            <div class="flex-1 space-y-2">
                <div class="h-3 w-20 bg-white/10 rounded"></div>
                <div class="h-2 w-12 bg-white/10 rounded"></div>
            </div>
        </div>

        <div v-else class="flex items-center p-2 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
          
          <div @click="openProfileModal" class="flex-1 flex items-center gap-3 cursor-pointer min-w-0 px-2 py-1 rounded-lg hover:bg-white/5 transition-colors">
             <div class="relative shrink-0">
               <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 p-[2px]">
                  <img 
                    :src="userPhoto || `https://ui-avatars.com/api/?name=${userName}&background=random`" 
                    class="rounded-full w-full h-full object-cover border-2 border-[#0F172A]" 
                    alt="Profile"
                  >
               </div>
               <span class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0F172A] rounded-full"></span>
             </div>
             
             <div class="flex-1 min-w-0">
               <p class="text-sm font-bold text-white truncate group-hover:text-indigo-300 transition-colors">{{ userName }}</p>
               <p class="text-[10px] text-slate-400 uppercase">{{ userRole }}</p>
             </div>
          </div>

          <button @click.stop="isLogoutModalOpen = true" class="p-2.5 shrink-0 rounded-xl text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-colors" title="Logout">
             <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          </button>
        </div>
      </div>
    </aside>

    <main class="flex-1 flex flex-col h-screen relative z-0">
      
      <header class="h-16 px-4 md:px-8 flex items-center justify-between bg-white/70 backdrop-blur-xl border-b border-gray-200/60 sticky top-0 z-30 transition-all">
        
        <button @click="isSidebarOpen = true" class="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>

        <h2 class="hidden md:block text-lg font-bold text-gray-700 bg-clip-text text-transparent bg-gradient-to-r from-slate-700 to-slate-500">
           Dashboard Overview
        </h2>

        <div class="flex items-center gap-3 md:gap-5 ml-auto">
           <div class="hidden sm:flex px-3 py-1 bg-white border border-gray-200 rounded-full shadow-sm items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              <p class="text-xs font-bold text-gray-600 font-khmer">{{ currentDate }}</p>
           </div>

           <button class="relative p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-indigo-600 transition-colors">
              <span class="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
           </button>
        </div>
      </header>

      <div class="flex-1 overflow-y-auto p-4 md:p-8 relative scroll-smooth">
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-indigo-200/30 blur-[100px] -z-10 rounded-full pointer-events-none"></div>

        <router-view v-slot="{ Component }">
          <transition 
            enter-active-class="transition-all duration-300 ease-out" 
            enter-from="opacity-0 translate-y-4 scale-95" 
            enter-to-class="opacity-100 translate-y-0 scale-100" 
            leave-active-class="transition-all duration-200 ease-in" 
            leave-from="opacity-100 translate-y-0" 
            leave-to-class="opacity-0 -translate-y-2"
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
import { ref, computed, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue';
import CustomAlert from '../components/shared/CustomAlert.vue'; 
import { auth, db } from '@/firebaseConfig'; 
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import axios from 'axios';

const router = useRouter();
const isSidebarOpen = ref(false);
const isAuthLoading = ref(true);

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
const currentUserData = ref({}); // Stores the raw firestore doc
const userName = ref('Loading...');
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

// DYNAMIC MENU ITEMS
const menuItems = computed(() => {
  if (isAuthLoading.value) return [];

  const commonItems = [
    { label: 'បញ្ចូលទិន្នន័យលក់ (Input Sales)', path: '/app/admin/sales', key: 'sales', icon: '📝', glowClass: 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]' }, 
    { label: 'តំណាង​លក់ (Sellers)', path: '/app/admin/sellers', key: 'sellers', icon: '👥', glowClass: 'bg-teal-500 shadow-[0_0_15px_rgba(20,184,166,0.6)]' },
    { label: 'របាយការណ៍លក់ (Reports)', path: '/app/admin/seller-reports', key: 'seller-reports', icon: '📈', glowClass: 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.6)]' },
  ];

  if (rawRole.value === 'owner') {
    return [
      { label: 'ផ្ទាំងគ្រប់គ្រង (Dashboard)', path: '/app/owner/dashboard', key: 'dashboard', icon: '📊', glowClass: 'bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.6)]' },
      { label: 'គ្រប់គ្រង Admin', path: '/app/owner/admins', key: 'admins', icon: '🛡️', glowClass: 'bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.6)]' },
      { label: 'របាយការណ៍រួម (Master Reports)', path: '/app/owner/reports', key: 'reports', icon: '📈', glowClass: 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.6)]' },
    ];
  } else {
    return [
      { label: 'ផ្ទាំងគ្រប់គ្រង (Dashboard)', path: '/app/admin/dashboard', key: 'dashboard', icon: '📊', glowClass: 'bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.6)]' },
      ...commonItems
    ];
  }
});

const currentDate = computed(() => {
  const date = new Date();
  return date.toLocaleDateString('km-KH', { weekday: 'short', day: 'numeric', month: 'long' });
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
          currentUserData.value = data; // Store full doc
          
          userName.value = data.fullName || 'User';
          rawRole.value = data.role || 'user'; 
          userRole.value = data.role ? data.role.toUpperCase() + ' ROLE' : 'USER';
          userPhoto.value = data.photoUrl || user.photoURL;
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        userName.value = "Guest";
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
   // Populate form with current user data
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

      // Reuse the existing update-admin API since it works for updating any user document by UID
      const res = await axios.put(`https://reportapp-81vf.onrender.com/api/update-admin/${auth.currentUser.uid}`, formData, {
         headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
         }
      });

      if (res.data.success) {
         triggerAlert('success', 'ជោគជ័យ', 'ព័ត៌មានគណនីត្រូវបានកែប្រែ');
         
         // Update Live UI
         userName.value = profileForm.fullName;
         if (profileForm.profileFile) {
             userPhoto.value = profilePreview.value; 
         }
         
         // Update Background Data
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
@import url('https://fonts.googleapis.com/css2?family=Battambong:wght@400;700&family=Kantumruy+Pro:wght@400;700&display=swap');
.font-khmer { font-family: 'Kantumruy Pro', 'Battambong', sans-serif; }

/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); }
</style>