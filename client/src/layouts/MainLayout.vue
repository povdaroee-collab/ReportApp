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
                     <p class="text-sm text-slate-500">
                       តើអ្នកពិតជាចង់ចាកចេញពីគណនីនេះមែនទេ?
                     </p>
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

        <div v-else class="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all cursor-pointer group">
          <div class="relative">
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

          <button @click="isLogoutModalOpen = true" class="p-2 rounded-lg text-slate-500 hover:bg-red-500/20 hover:text-red-400 transition-colors" title="Logout">
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

const router = useRouter();
const isSidebarOpen = ref(false);
const isAuthLoading = ref(true);
const isLogoutModalOpen = ref(false);

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
const userName = ref('Loading...');
const userRole = ref('');
const rawRole = ref(''); 
const userPhoto = ref(null);

// DYNAMIC MENU ITEMS
const menuItems = computed(() => {
  if (isAuthLoading.value) return [];

  const commonItems = [
    { label: 'បញ្ចូលទិន្នន័យលក់ (Input Sales)', path: '/app/admin/sales', key: 'sales', icon: '📝', glowClass: 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]' }, 
    { label: 'តំណាង​លក់ (Sellers)', path: '/app/admin/sellers', key: 'sellers', icon: '👥', glowClass: 'bg-teal-500 shadow-[0_0_15px_rgba(20,184,166,0.6)]' },
    { label: 'របាយការណ៍លក់ (Reports)', path: '/app/admin/seller-reports', key: 'reports', icon: '📈', glowClass: 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.6)]' },
  ];

  if (rawRole.value === 'owner') {
    return [
      { label: 'ផ្ទាំងគ្រប់គ្រង (Dashboard)', path: '/app/owner/dashboard', key: 'dashboard', icon: '📊', glowClass: 'bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.6)]' },
      { label: 'គ្រប់គ្រង Admin', path: '/app/owner/admins', key: 'admins', icon: '🛡️', glowClass: 'bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.6)]' },
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

// CONFIRM LOGOUT
const confirmLogout = async () => {
    isLogoutModalOpen.value = false;
    try {
        await signOut(auth);
        triggerAlert('success', 'ជោគជ័យ', 'អ្នកបានចាកចេញដោយជោគជ័យ');
        // Wait a brief moment to show the alert before redirecting
        setTimeout(() => {
            router.push('/');
        }, 800);
    } catch (error) {
        triggerAlert('error', 'បរាជ័យ', 'មានបញ្ហាក្នុងការចាកចេញ');
    }
};
</script>

<style scoped>
.font-khmer { font-family: 'Kantumruy Pro', sans-serif; }

/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); }
</style>