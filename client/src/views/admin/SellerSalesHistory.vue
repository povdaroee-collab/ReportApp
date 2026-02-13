<template>
  <div class="font-khmer h-full flex flex-col bg-[#F1F5F9] relative">
    
    <div class="bg-white/80 backdrop-blur-xl px-4 md:px-8 py-4 shadow-sm border-b border-slate-200 sticky top-0 z-30 transition-all">
      <div class="flex items-center gap-3">
        <button @click="$router.back()" class="p-2.5 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-200 shadow-sm active:scale-90 transition-all">
           <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        </button>
        
        <div class="flex items-center gap-3 flex-1 overflow-hidden" v-if="sellerInfo">
           <div class="relative shrink-0">
              <img 
                :src="sellerInfo.photoUrl || `https://ui-avatars.com/api/?name=${sellerInfo.fullName}&background=random`" 
                class="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border border-slate-100 shadow-sm"
              >
              <div class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
           </div>
           <div class="min-w-0">
              <h1 class="text-lg md:text-xl font-bold text-slate-800 truncate">{{ sellerInfo.fullName }}</h1>
              <p class="text-xs text-slate-500 font-mono truncate">ID: {{ sellerInfo.idNumber || 'N/A' }}</p>
           </div>
        </div>
        
        <div v-else class="flex items-center gap-3 animate-pulse flex-1">
           <div class="w-10 h-10 bg-slate-200 rounded-full"></div>
           <div class="space-y-1.5">
              <div class="h-3 w-24 bg-slate-200 rounded"></div>
              <div class="h-2 w-16 bg-slate-200 rounded"></div>
           </div>
        </div>
      </div>

      <div class="mt-4 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
         <button 
           v-for="filter in filters" 
           :key="filter.key"
           @click="activeFilter = filter.key"
           class="px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border"
           :class="activeFilter === filter.key ? 'bg-slate-800 text-white border-slate-800 shadow-lg shadow-slate-200' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'"
         >
           {{ filter.label }}
         </button>
      </div>

      <div v-if="activeFilter === 'custom'" class="mt-3 bg-slate-50 p-3 rounded-xl border border-slate-200 animate-slide-down">
         <div class="flex items-center gap-2">
            <input v-model="customStart" type="date" class="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-600 focus:ring-2 focus:ring-blue-500 outline-none">
            <span class="text-slate-300">➜</span>
            <input v-model="customEnd" type="date" class="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-600 focus:ring-2 focus:ring-blue-500 outline-none">
         </div>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
         <div class="bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl p-5 text-white shadow-xl shadow-blue-200 relative overflow-hidden">
            <div class="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
            <p class="text-blue-100 text-xs font-bold uppercase tracking-wider mb-2">ចំណូលសរុប (Revenue)</p>
            <div class="space-y-1">
               <div class="flex items-baseline gap-1">
                  <span class="text-2xl font-bold">{{ stats.revenueUSD }}</span>
                  <span class="text-sm font-medium opacity-80">$</span>
               </div>
               <div class="w-full h-px bg-white/20"></div>
               <div class="flex items-baseline gap-1">
                  <span class="text-xl font-bold">{{ stats.revenueKHR }}</span>
                  <span class="text-xs font-medium opacity-80">៛</span>
               </div>
            </div>
         </div>

         <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
             <div class="flex justify-between items-start">
                 <div>
                    <p class="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">លក់បាន (Sold)</p>
                    <h3 class="text-3xl font-bold text-slate-800">{{ stats.units }} <span class="text-sm text-slate-400 font-medium">Unit</span></h3>
                 </div>
                 <div class="p-2 bg-purple-50 text-purple-600 rounded-xl">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                 </div>
             </div>
         </div>

         <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
             <div class="flex justify-between items-start">
                 <div>
                    <p class="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">អតិថិជន (Clients)</p>
                    <h3 class="text-3xl font-bold text-slate-800">{{ stats.clients }} <span class="text-sm text-slate-400 font-medium">នាក់</span></h3>
                 </div>
                 <div class="p-2 bg-orange-50 text-orange-600 rounded-xl">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                 </div>
             </div>
         </div>
      </div>

      <div class="space-y-4">
         <div class="flex items-center justify-between px-1">
            <h3 class="font-bold text-slate-700">ប្រតិបត្តិការ (Transactions)</h3>
            <span class="text-xs font-bold bg-white px-2 py-1 rounded-md border border-slate-200 text-slate-500">{{ filteredData.length }}</span>
         </div>

         <div v-if="loading" class="space-y-3">
            <div v-for="n in 3" :key="n" class="bg-white h-24 rounded-2xl animate-pulse"></div>
         </div>

         <div v-else-if="filteredData.length === 0" class="py-12 text-center bg-white rounded-3xl border border-dashed border-slate-300">
            <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300">
               <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            </div>
            <p class="text-slate-500 font-medium text-sm">មិនមានទិន្នន័យសម្រាប់ពេលនេះទេ</p>
         </div>

         <div class="grid grid-cols-1 md:hidden gap-3">
            <div v-for="sale in filteredData" :key="sale.id" class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
               <div class="flex justify-between items-start mb-3 border-b border-slate-50 pb-3">
                  <div class="flex items-center gap-3">
                     <div class="bg-blue-50 text-blue-600 font-bold px-2.5 py-1.5 rounded-lg text-xs flex flex-col items-center leading-tight">
                        <span class="text-[10px] uppercase">{{ getMonthName(sale.date) }}</span>
                        <span class="text-lg">{{ getDay(sale.date) }}</span>
                     </div>
                     <div>
                        <p class="text-slate-400 text-[10px] font-bold uppercase">Date</p>
                        <p class="text-slate-700 text-sm font-bold">{{ formatDate(sale.date) }}</p>
                     </div>
                  </div>
                  <div class="text-right">
                     <p class="text-lg font-bold" :class="sale.currency === 'USD' ? 'text-emerald-600' : 'text-blue-600'">
                        {{ parseInt(sale.totalPrice).toLocaleString() }} 
                        <span class="text-xs">{{ sale.currency === 'USD' || sale.currency === '$' ? '$' : '៛' }}</span>
                     </p>
                  </div>
               </div>

               <div class="grid grid-cols-2 gap-2">
                  <div class="bg-slate-50 rounded-lg p-2 flex items-center gap-2">
                     <div class="p-1.5 bg-white rounded-md text-orange-500 shadow-sm">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                     </div>
                     <div>
                        <p class="text-[10px] text-slate-400">អតិថិជន</p>
                        <p class="text-xs font-bold text-slate-700">{{ sale.totalClients }} នាក់</p>
                     </div>
                  </div>
                  <div class="bg-slate-50 rounded-lg p-2 flex items-center gap-2">
                     <div class="p-1.5 bg-white rounded-md text-purple-500 shadow-sm">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                     </div>
                     <div>
                        <p class="text-[10px] text-slate-400">ចំនួនលក់</p>
                        <p class="text-xs font-bold text-slate-700">{{ sale.totalSold }} {{ translateUnit(sale.unit) }}</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <div class="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <table class="w-full text-left">
               <thead class="bg-slate-50 text-slate-500 text-xs uppercase font-bold border-b border-slate-200">
                  <tr>
                     <th class="px-6 py-4">កាលបរិច្ឆេទ</th>
                     <th class="px-6 py-4">អតិថិជន</th>
                     <th class="px-6 py-4">ចំនួនលក់ (Unit)</th>
                     <th class="px-6 py-4 text-right">ទឹកប្រាក់</th>
                  </tr>
               </thead>
               <tbody class="divide-y divide-slate-100">
                  <tr v-for="sale in filteredData" :key="sale.id" class="hover:bg-slate-50 transition-colors">
                     <td class="px-6 py-4 font-bold text-slate-600">{{ formatDate(sale.date) }}</td>
                     <td class="px-6 py-4 text-slate-600">{{ sale.totalClients }} នាក់</td>
                     <td class="px-6 py-4">
                        <span class="bg-purple-50 text-purple-700 px-3 py-1 rounded-lg text-xs font-bold">{{ sale.totalSold }} {{ translateUnit(sale.unit) }}</span>
                     </td>
                     <td class="px-6 py-4 text-right font-bold" :class="sale.currency === 'USD' ? 'text-emerald-600' : 'text-blue-600'">
                        {{ parseInt(sale.totalPrice).toLocaleString() }} {{ sale.currency === 'USD' || sale.currency === '$' ? '$' : '៛' }}
                     </td>
                  </tr>
               </tbody>
            </table>
         </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { db } from '@/firebaseConfig';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

const route = useRoute();
const sellerId = route.params.id;

const sellerInfo = ref(null);
const allSales = ref([]);
const loading = ref(true);

const activeFilter = ref('today');
const customStart = ref('');
const customEnd = ref('');

const filters = [
  { key: 'today', label: 'ថ្ងៃនេះ' },
  { key: 'month', label: 'ខែនេះ' },
  { key: 'year', label: 'ឆ្នាំនេះ' },
  { key: 'custom', label: 'កំណត់ថ្ងៃ' },
];

onMounted(async () => {
  try {
    const sellerSnap = await getDoc(doc(db, "users", sellerId));
    if (sellerSnap.exists()) sellerInfo.value = sellerSnap.data();

    const q = query(collection(db, "sales_reports"), where("sellerId", "==", sellerId));
    const querySnapshot = await getDocs(q);
    
    allSales.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const today = new Date().toISOString().split('T')[0];
    customStart.value = today;
    customEnd.value = today;

  } catch (error) {
    console.error("Error loading data:", error);
  } finally {
    loading.value = false;
  }
});

// FILTERING
const filteredData = computed(() => {
  if (!allSales.value.length) return [];
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const currentDateStr = today.toISOString().split('T')[0];

  return allSales.value.filter(sale => {
    const saleDate = sale.date; 
    const [sYear, sMonth, sDay] = saleDate.split('-').map(Number);

    if (activeFilter.value === 'today') return saleDate === currentDateStr;
    if (activeFilter.value === 'month') return sYear === currentYear && sMonth === currentMonth;
    if (activeFilter.value === 'year') return sYear === currentYear;
    if (activeFilter.value === 'custom') return saleDate >= customStart.value && saleDate <= customEnd.value;
    return true;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));
});

// STATS CALCULATION (Separated Currencies)
const stats = computed(() => {
   let khr = 0;
   let usd = 0;
   let units = 0;
   let clients = 0;

   filteredData.value.forEach(item => {
      // Check currency type
      if (item.currency === 'USD' || item.currency === '$') {
          usd += Number(item.totalPrice);
      } else {
          khr += Number(item.totalPrice);
      }
      
      units += Number(item.totalSold);
      clients += Number(item.totalClients);
   });

   return {
      revenueUSD: `${usd.toLocaleString()}`,
      revenueKHR: `${khr.toLocaleString()}`,
      units: units.toLocaleString(),
      clients: clients.toLocaleString()
   };
});

// HELPERS
const translateUnit = (unit) => {
    if (unit && (unit.toLowerCase() === 'bottle' || unit.toLowerCase() === 'bottles')) return 'ដប';
    if (unit && (unit.toLowerCase() === 'pack' || unit.toLowerCase() === 'packs')) return 'កញ្ចប់';
    if (unit && (unit.toLowerCase() === 'can' || unit.toLowerCase() === 'cans')) return 'កំប៉ុង';
    return unit;
};

const formatDate = (dateString) => {
   if(!dateString) return '';
   const date = new Date(dateString);
   return new Intl.DateTimeFormat('km-KH', { dateStyle: 'medium' }).format(date);
};

const getDay = (dateString) => {
   if(!dateString) return '';
   return new Date(dateString).getDate();
};

const getMonthName = (dateString) => {
   if(!dateString) return '';
   const date = new Date(dateString);
   return date.toLocaleDateString('en-US', { month: 'short' });
};
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.animate-slide-down { animation: slideDown 0.3s ease-out; }
@keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
</style>