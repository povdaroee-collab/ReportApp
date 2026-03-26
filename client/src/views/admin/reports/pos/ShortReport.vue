<template>
  <div class="font-khmer min-h-[80vh] flex flex-col relative pb-10 animate-fade-in">
      
      <div class="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-200 mb-6 flex flex-col xl:flex-row justify-between gap-5 relative z-10">
          
          <div class="flex items-center gap-4">
              <div class="w-14 h-14 bg-gradient-to-br from-rose-50 to-pink-50 text-rose-500 rounded-2xl flex items-center justify-center border border-rose-100 shadow-inner shrink-0 transform -rotate-3">
                  <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              </div>
              <div>
                  <h2 class="text-xl md:text-2xl font-black text-slate-800 leading-tight">របាយការណ៍ខ្លី (Short Report)</h2>
                  <p class="text-[11px] md:text-xs font-bold text-slate-500 mt-1">សេចក្តីសង្ខេបនៃទិន្នន័យលក់ប្រចាំថ្ងៃនីមួយៗ</p>
              </div>
          </div>

          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 xl:justify-end">
              
              <div class="bg-slate-100/80 p-1.5 rounded-xl flex shadow-inner border border-slate-200 w-full sm:w-auto">
                  <button @click="setFilterMode('month')" class="flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-black transition-all whitespace-nowrap" :class="filterMode === 'month' ? 'bg-white text-indigo-700 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-800'">ជ្រើសរើសខែ</button>
                  <button @click="setFilterMode('range')" class="flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-black transition-all whitespace-nowrap" :class="filterMode === 'range' ? 'bg-white text-indigo-700 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-800'">ចន្លោះថ្ងៃ (Range)</button>
              </div>

              <div class="flex items-center gap-2 w-full sm:w-auto animate-fade-in">
                  <div v-if="filterMode === 'month'" class="relative w-full sm:w-auto">
                      <input v-model="selectedMonth" @change="fetchGroupedSalesData" type="month" class="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 outline-none cursor-pointer shadow-sm">
                  </div>

                  <div v-if="filterMode === 'range'" class="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-2 py-1 shadow-sm w-full sm:w-auto">
                      <input v-model="startDate" @change="fetchGroupedSalesData" type="date" class="bg-transparent border-none text-xs font-bold text-slate-700 focus:ring-0 outline-none cursor-pointer px-2 py-1.5 w-full sm:w-auto" />
                      <span class="text-slate-300 font-bold px-1">ដល់</span>
                      <input v-model="endDate" @change="fetchGroupedSalesData" type="date" class="bg-transparent border-none text-xs font-bold text-slate-700 focus:ring-0 outline-none cursor-pointer px-2 py-1.5 w-full sm:w-auto" />
                  </div>
                  
                  <button @click="fetchGroupedSalesData" class="w-11 h-11 bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white rounded-xl flex items-center justify-center transition-all shadow-sm active:scale-95 shrink-0 border border-indigo-100" :class="isLoading ? 'animate-spin pointer-events-none' : ''" title="Refresh Data">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                  </button>
              </div>

          </div>
      </div>

      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 relative z-10 px-1">
          <div class="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200 w-full sm:w-auto">
              <button @click="displayFilter = 'all'" :class="displayFilter === 'all' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'" class="flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-black transition-all">
                  បង្ហាញទាំងអស់ ({{ groupedSales.length }})
              </button>
              <button @click="displayFilter = 'withSales'" :class="displayFilter === 'withSales' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'" class="flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-black transition-all">
                  មានការលក់ ({{ stats.daysWithSales }})
              </button>
              <button @click="displayFilter = 'noSales'" :class="displayFilter === 'noSales' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'" class="flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-black transition-all">
                  គ្មានការលក់ ({{ stats.daysNoSales }})
              </button>
          </div>

          <div class="flex items-center gap-4 bg-white px-5 py-2.5 rounded-xl border border-slate-200 shadow-sm w-full sm:w-auto justify-between sm:justify-end">
              <div class="text-right">
                  <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">វិក្កយបត្រសរុប</p>
                  <p class="text-sm font-black text-indigo-600">{{ stats.totalInvoices }}</p>
              </div>
              <div class="w-px h-8 bg-slate-200"></div>
              <div class="text-right">
                  <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">ចំណូលសរុបរួម</p>
                  <p class="text-sm font-black text-emerald-600">{{ formatCurrency(stats.totalRevenue) }}</p>
              </div>
          </div>
      </div>

      <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 opacity-60 flex-1">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-indigo-600 mb-4"></div>
          <p class="text-sm font-bold text-slate-500 tracking-wide">កំពុងទាញយកទិន្នន័យវៃឆ្លាត...</p>
      </div>

      <div v-else-if="filteredGroupedSales.length === 0" class="flex flex-col items-center justify-center py-24 bg-white/60 rounded-3xl border-2 border-dashed border-slate-300 shadow-sm animate-fade-in-up flex-1 mx-2">
          <div class="w-20 h-20 bg-slate-100 text-slate-300 rounded-full flex items-center justify-center mb-4 border border-slate-200">
              <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
          </div>
          <p class="text-slate-500 font-black text-lg">មិនមានទិន្នន័យកាលបរិច្ឆេទទេ</p>
          <p class="text-xs text-slate-400 font-bold mt-1">សូមផ្លាស់ប្តូរការស្វែងរក ឬចន្លោះកាលបរិច្ឆេទ</p>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 animate-fade-in-up px-1">
          <div v-for="(dayData, index) in filteredGroupedSales" :key="index" 
               class="rounded-2xl p-5 border shadow-sm transition-all duration-300 group flex flex-col justify-between min-h-[140px] relative overflow-hidden"
               :class="dayData.invoiceCount > 0 ? 'bg-white border-slate-200 hover:shadow-lg hover:border-indigo-200 hover:-translate-y-1' : 'bg-slate-50/50 border-slate-200 opacity-80 hover:opacity-100 grayscale-[20%]'">
              
              <div v-if="dayData.invoiceCount === 0" class="absolute inset-0 bg-slate-100/20 backdrop-blur-[1px] z-0 pointer-events-none"></div>

              <div class="flex items-start justify-between mb-4 border-b border-slate-100/80 pb-3 relative z-10">
                  <div class="flex items-center gap-3">
                      <div class="w-11 h-11 rounded-xl flex items-center justify-center transition-colors border"
                           :class="dayData.invoiceCount > 0 ? 'bg-indigo-50 text-indigo-500 border-indigo-100 group-hover:bg-indigo-500 group-hover:text-white' : 'bg-slate-100 text-slate-400 border-slate-200'">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                      </div>
                      <div class="flex flex-col">
                          <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">កាលបរិច្ឆេទ</span>
                          <h3 class="text-[13px] md:text-[14px] font-black text-slate-800">{{ formatDateKhmer(dayData.date) }}</h3>
                      </div>
                  </div>
              </div>

              <div class="flex items-end justify-between mt-auto relative z-10">
                  <div class="flex flex-col">
                      <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">ចំនួនវិក្កយបត្រ</span>
                      <span class="font-black text-xs px-2.5 py-1 rounded-lg w-fit border shadow-sm flex items-center gap-1.5"
                            :class="dayData.invoiceCount > 0 ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-slate-100 text-slate-500 border-slate-200'">
                          <span v-if="dayData.invoiceCount > 0" class="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
                          {{ dayData.invoiceCount }} វិក្កយបត្រ
                      </span>
                  </div>
                  
                  <div class="flex flex-col items-end">
                      <span class="text-[9px] font-black uppercase tracking-widest mb-1"
                            :class="dayData.invoiceCount > 0 ? 'text-emerald-500/70' : 'text-slate-400'">ចំណូលសរុប</span>
                      <h4 class="text-xl md:text-2xl font-black leading-none"
                          :class="dayData.invoiceCount > 0 ? 'text-emerald-600' : 'text-slate-400'">
                          {{ formatCurrency(dayData.totalRevenue) }}
                      </h4>
                  </div>
              </div>
          </div>
      </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { db, auth } from '@/firebaseConfig';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useNotificationStore } from '@/stores/notification';

const notification = useNotificationStore();
const isLoading = ref(true);

// States
const filterMode = ref('month'); // 'month' or 'range'
const displayFilter = ref('all'); // 'all', 'withSales', 'noSales'

// Date Inputs
const now = new Date();
const selectedMonth = ref(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`);
const startDate = ref(new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]);
const endDate = ref(new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]);

// Data
const groupedSales = ref([]);

let authListener = null;

// Helpers
const formatCurrency = (val) => Number(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " $";

const formatDateKhmer = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('km-KH', { dateStyle: 'long' }).format(date);
};

// Switch filter modes and correct dates
const setFilterMode = (mode) => {
    filterMode.value = mode;
    if (mode === 'month') {
        const [year, month] = selectedMonth.value.split('-');
        startDate.value = new Date(year, month - 1, 1).toISOString().split('T')[0];
        endDate.value = new Date(year, month, 0).toISOString().split('T')[0];
    }
    fetchGroupedSalesData();
};

// Generate an array of all dates between Start and End
const getDatesInRange = (startStr, endStr) => {
    const dates = [];
    let curr = new Date(startStr);
    const end = new Date(endStr);
    
    while (curr <= end) {
        dates.push(curr.toISOString().split('T')[0]);
        curr.setDate(curr.getDate() + 1);
    }
    return dates.sort((a, b) => new Date(b) - new Date(a)); // Descending order (Newest first)
};

// Main Fetch Logic
const fetchGroupedSalesData = async () => {
    if (!auth.currentUser) return;
    
    isLoading.value = true;
    groupedSales.value = [];

    try {
        const userId = auth.currentUser.uid;
        
        // 1. Calculate boundaries based on filter mode
        let queryStart, queryEnd;
        if (filterMode.value === 'month') {
            const [year, month] = selectedMonth.value.split('-');
            queryStart = new Date(year, month - 1, 1, 0, 0, 0);
            queryEnd = new Date(year, month, 0, 23, 59, 59, 999);
        } else {
            queryStart = new Date(startDate.value + 'T00:00:00');
            queryEnd = new Date(endDate.value + 'T23:59:59.999');
        }

        // 2. Create the array of all days in the range to display them even if 0 sales
        const allDatesInScope = getDatesInRange(
            queryStart.toISOString().split('T')[0], 
            queryEnd.toISOString().split('T')[0]
        );

        // 3. Query Database ONLY for the selected date range (Smart Reads optimization)
        const salesQ = query(
            collection(db, 'sales_reports'),
            where('createdBy', '==', userId),
            where('createdAt', '>=', queryStart.toISOString()),
            where('createdAt', '<=', queryEnd.toISOString())
        );

        const salesSnap = await getDocs(salesQ);
        const tempSalesMap = {};

        // 4. Aggregate data
        salesSnap.docs.forEach(doc => {
            const data = doc.data();
            if (data.paymentStatus === 'CANCELED') return;

            const dateObj = new Date(data.createdAt || data.date);
            if (isNaN(dateObj.getTime())) return;
            
            // Adjust to local date string matching
            const dateKey = dateObj.toISOString().split('T')[0]; 

            if (!tempSalesMap[dateKey]) {
                tempSalesMap[dateKey] = { invoiceCount: 0, totalRevenue: 0 };
            }

            tempSalesMap[dateKey].invoiceCount += 1;

            let dFee = Number(data.deliveryFee) || 0;
            if (data.deliveryCurrency === 'KHR' || dFee > 5) dFee = dFee / 4000;
            
            let itemsTotal = 0;
            if (data.items && Array.isArray(data.items)) {
                data.items.forEach(item => {
                    if (data.currency === 'USD' || data.currency === '$' || !data.currency) {
                        itemsTotal += (Number(item.qty || 0) * Number(item.price || 0));
                    }
                });
            }

            tempSalesMap[dateKey].totalRevenue += (itemsTotal + dFee);
        });

        // 5. Merge database data with the full calendar range
        groupedSales.value = allDatesInScope.map(dateStr => {
            if (tempSalesMap[dateStr]) {
                return { date: dateStr, invoiceCount: tempSalesMap[dateStr].invoiceCount, totalRevenue: tempSalesMap[dateStr].totalRevenue };
            } else {
                return { date: dateStr, invoiceCount: 0, totalRevenue: 0 };
            }
        });

    } catch (error) {
        console.error("Error fetching grouped sales:", error);
        notification.error("បរាជ័យក្នុងការទាញយកទិន្នន័យ (សូមប្រាកដថាអ្នកបានបង្កើត Index ក្នុង Firebase ប្រសិនបើលោត Error)");
    } finally {
        isLoading.value = false;
    }
};

// Computed Properties
const filteredGroupedSales = computed(() => {
    if (displayFilter.value === 'withSales') return groupedSales.value.filter(d => d.invoiceCount > 0);
    if (displayFilter.value === 'noSales') return groupedSales.value.filter(d => d.invoiceCount === 0);
    return groupedSales.value;
});

const stats = computed(() => {
    let daysWithSales = 0;
    let daysNoSales = 0;
    let totalInvoices = 0;
    let totalRevenue = 0;

    groupedSales.value.forEach(day => {
        if (day.invoiceCount > 0) {
            daysWithSales++;
            totalInvoices += day.invoiceCount;
            totalRevenue += day.totalRevenue;
        } else {
            daysNoSales++;
        }
    });

    return { daysWithSales, daysNoSales, totalInvoices, totalRevenue };
});

onMounted(() => {
    authListener = onAuthStateChanged(auth, (user) => {
        if (user) {
            // Setup initial range logic
            const [year, month] = selectedMonth.value.split('-');
            startDate.value = new Date(year, month - 1, 1).toISOString().split('T')[0];
            endDate.value = new Date(year, month, 0).toISOString().split('T')[0];
            
            fetchGroupedSalesData();
        }
    });
});

onUnmounted(() => {
    if (authListener) authListener();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Battambong:wght@400;700;900&family=Kantumruy+Pro:wght@400;700&display=swap');
.font-khmer { font-family: 'Battambang', 'Kantumruy Pro', sans-serif; }

.animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }

.animate-fade-in-up { animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes fadeInUp { 
    from { opacity: 0; transform: translateY(15px) scale(0.98); } 
    to { opacity: 1; transform: translateY(0) scale(1); } 
}
</style>