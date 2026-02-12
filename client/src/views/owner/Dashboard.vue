<template>
  <div class="font-khmer h-full flex flex-col">
    
    <div class="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-800">
          សួស្តី, <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">ម្ចាស់ប្រព័ន្ធ</span> 👋
        </h1>
        <p class="text-slate-500 mt-1">នេះគឺជាទិន្នន័យសរុបនៃប្រព័ន្ធអាជីវកម្មរបស់អ្នក</p>
      </div>
      <div class="bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
        <div class="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
        </div>
        <span class="text-slate-600 font-bold text-sm">{{ currentDate }}</span>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      
      <div class="relative group bg-white rounded-[2rem] p-8 shadow-lg shadow-indigo-100/50 border border-slate-100 overflow-hidden hover:-translate-y-1 transition-all duration-300">
        <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-500/10 to-indigo-500/10 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
        
        <div class="relative z-10">
          <div class="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 shadow-sm">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
          </div>
          
          <p class="text-slate-500 text-sm font-medium mb-1">ចំនួនអ្នកគ្រប់គ្រង (Admins)</p>
          <div class="flex items-end gap-3">
            <h3 class="text-4xl font-bold text-slate-800">{{ loading ? '...' : stats.admins }}</h3>
            <span class="text-xs text-emerald-500 font-bold bg-emerald-50 px-2 py-1 rounded-lg mb-1">+ Active</span>
          </div>
        </div>
      </div>

      <div class="relative group bg-gradient-to-br from-slate-800 to-slate-900 rounded-[2rem] p-8 shadow-xl shadow-slate-400/20 overflow-hidden hover:-translate-y-1 transition-all duration-300">
        <div class="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        
        <div class="relative z-10 h-full flex flex-col justify-between">
          <div class="flex justify-between items-start">
            <div class="w-14 h-14 rounded-2xl bg-white/10 text-white flex items-center justify-center backdrop-blur-sm">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            </div>
            <span class="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold border border-green-500/30 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Running
            </span>
          </div>
          
          <div>
            <p class="text-slate-400 text-sm font-medium mb-1">ស្ថានភាពប្រព័ន្ធ (System Status)</p>
            <h3 class="text-2xl font-bold text-white tracking-wide">Online</h3>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { db } from '../../firebaseConfig'; 
import { collection, query, where, getCountFromServer } from 'firebase/firestore';

// Only tracking Admins now
const stats = ref({ admins: 0 });
const loading = ref(true);

const currentDate = computed(() => {
  const date = new Date();
  return date.toLocaleDateString('km-KH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
});

onMounted(async () => {
  try {
    // Correct Logic: Count ONLY Users where role == 'admin'
    const adminsQuery = query(collection(db, "users"), where("role", "==", "admin"));
    const adminsSnap = await getCountFromServer(adminsQuery);
    
    stats.value.admins = adminsSnap.data().count;
  } catch (error) {
    console.error("Error loading stats", error);
  } finally {
    loading.value = false;
  }
});
</script>