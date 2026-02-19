<template>
  <div class="font-khmer h-full flex flex-col">
    
    <div class="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-800">
          សួស្តី, <span class="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">{{ adminName }}</span> 👋
        </h1>
        <p class="text-slate-500 mt-1">នេះគឺជាទិន្នន័យសង្ខេបសម្រាប់ការងាររបស់អ្នក</p>
      </div>
      <div class="bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
        <div class="p-2 bg-teal-50 text-teal-600 rounded-lg">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
        </div>
        <span class="text-slate-600 font-bold text-sm">{{ currentDate }}</span>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
      
      <div class="relative group bg-white rounded-[2rem] p-8 shadow-lg shadow-teal-100/50 border border-slate-100 overflow-hidden hover:-translate-y-1 transition-all duration-300">
        <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-500/10 to-emerald-500/10 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
        
        <div class="relative z-10">
          <div class="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-6 group-hover:bg-teal-600 group-hover:text-white transition-colors duration-300 shadow-sm">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          </div>
          
          <p class="text-slate-500 text-sm font-medium mb-1">តំណាងលក់សរុប (Your Sellers)</p>
          <div class="flex items-end gap-3">
            <h3 class="text-4xl font-bold text-slate-800">{{ loading ? '...' : stats.sellerCount }}</h3>
            <span class="text-xs text-teal-500 font-bold bg-teal-50 px-2 py-1 rounded-lg mb-1">Active</span>
          </div>
        </div>
      </div>

      <div class="relative group bg-white rounded-[2rem] p-8 shadow-lg shadow-blue-100/50 border border-slate-100 overflow-hidden hover:-translate-y-1 transition-all duration-300">
        <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
        
        <div class="relative z-10">
          <div class="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-sm">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
          </div>
          
          <p class="text-slate-500 text-sm font-medium mb-1">របាយការណ៍លក់សរុប (Your Reports)</p>
          <div class="flex items-end gap-3">
            <h3 class="text-4xl font-bold text-slate-800">{{ loading ? '...' : stats.salesCount }}</h3>
            <span class="text-xs text-blue-500 font-bold bg-blue-50 px-2 py-1 rounded-lg mb-1">Total</span>
          </div>
        </div>
      </div>

    </div>

    <div>
        <h3 class="text-lg font-bold text-slate-700 mb-6">ប្រតិបត្តិការរហ័ស (Quick Actions)</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <router-link to="/app/admin/sales" class="group flex items-center gap-4 p-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                <div class="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md group-hover:bg-white/30 transition-colors">
                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                </div>
                <div>
                    <h4 class="text-xl font-bold">បញ្ចូលការលក់</h4>
                    <p class="text-blue-100 text-sm opacity-90">កត់ត្រាការលក់ប្រចាំថ្ងៃ</p>
                </div>
            </router-link>

            <router-link to="/app/admin/sellers" class="group flex items-center gap-4 p-6 bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-lg hover:border-teal-200 hover:bg-teal-50/50 transition-all duration-300">
                <div class="w-16 h-16 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
                </div>
                <div>
                    <h4 class="text-xl font-bold text-slate-700 group-hover:text-teal-700">បន្ថែមតំណាងលក់</h4>
                    <p class="text-slate-500 text-sm group-hover:text-teal-600">បង្កើតគណនី Seller ថ្មី</p>
                </div>
            </router-link>

        </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { db, auth } from '@/firebaseConfig';
import { collection, getCountFromServer, query, where, doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const stats = ref({ sellerCount: 0, salesCount: 0 });
const adminName = ref('Admin');
const loading = ref(true);

const currentDate = computed(() => {
  const date = new Date();
  return date.toLocaleDateString('km-KH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
});

onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        // 1. Get Admin Name
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            adminName.value = userDoc.data().fullName || 'Admin';
        }

        // 2. Count Sellers (ADDED BY THIS ADMIN ONLY)
        const sellerQuery = query(
            collection(db, "users"), 
            where("role", "==", "seller"),
            where("createdBy", "==", user.uid) // <-- NEW FILTER
        );
        const sellerSnap = await getCountFromServer(sellerQuery);
        stats.value.sellerCount = sellerSnap.data().count;

        // 3. Count Total Sales Reports (CREATED BY THIS ADMIN ONLY)
        const salesQuery = query(
            collection(db, "sales_reports"),
            where("createdBy", "==", user.uid) // <-- NEW FILTER
        );
        const salesSnap = await getCountFromServer(salesQuery);
        stats.value.salesCount = salesSnap.data().count;

      } catch (error) {
        console.error("Error loading dashboard data", error);
      } finally {
        loading.value = false;
      }
    }
  });
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Battambong:wght@400;700&family=Kantumruy+Pro:wght@400;700&display=swap');
.font-khmer { font-family: 'Kantumruy Pro', 'Battambong', sans-serif; }
</style>