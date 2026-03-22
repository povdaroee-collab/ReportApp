<template>
  <div class="min-h-[100dvh] bg-[#F4F7FE] font-khmer flex flex-col print:bg-white">
    
    <div class="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50 shadow-sm print:hidden">
      <div class="max-w-[95rem] mx-auto px-4 md:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div class="flex items-center gap-4 w-full sm:w-auto">
          <button @click="$router.back()" class="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors shrink-0">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/></svg>
          </button>
          
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center overflow-hidden shrink-0">
               <img v-if="sellerInfo.photoUrl" :src="sellerInfo.photoUrl" class="w-full h-full object-cover" />
               <svg v-else class="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            </div>
            <div>
              <h1 class="text-lg font-black text-slate-800 leading-tight">{{ sellerInfo.fullName || 'កំពុងទាញយក...' }}</h1>
              <p class="text-[11px] font-bold text-slate-500 flex items-center gap-1 mt-0.5">
                <span class="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">ID: {{ sellerInfo.idNumber || 'N/A' }}</span>
                <span v-if="sellerInfo.role === 'admin'" class="bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded">Admin</span>
              </p>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button @click="handlePrint" class="bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold text-sm shadow-md transition-all active:scale-95">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2-2v4h10z"></path></svg>
                Print
            </button>
        </div>

      </div>
    </div>

    <div class="max-w-[95rem] mx-auto w-full px-4 md:px-6 mt-6 mb-4 print:hidden">
      <div class="bg-white p-3 md:p-4 rounded-[20px] shadow-sm border border-slate-200 flex flex-col lg:flex-row gap-4 justify-between items-center relative z-40">
          
          <div class="relative w-full lg:w-80">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </span>
              <input v-model="searchQuery" type="text" placeholder="ស្វែងរក វិក្កយបត្រ, អតិថិជន, ទំនិញ..." class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all shadow-inner" />
          </div>

          <div class="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto overflow-x-auto no-scrollbar">
              <div class="bg-slate-100/80 p-1 rounded-xl flex shadow-inner border border-slate-200 shrink-0">
                  <button @click="dateFilter = 'all'" class="px-4 py-2 rounded-lg text-[11px] font-black transition-all whitespace-nowrap" :class="dateFilter === 'all' ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-800'">ទាំងអស់</button>
                  <button @click="dateFilter = 'today'" class="px-4 py-2 rounded-lg text-[11px] font-black transition-all whitespace-nowrap" :class="dateFilter === 'today' ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-800'">ថ្ងៃនេះ</button>
                  <button @click="dateFilter = 'month'" class="px-4 py-2 rounded-lg text-[11px] font-black transition-all whitespace-nowrap" :class="dateFilter === 'month' ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-800'">ខែនេះ</button>
                  <button @click="dateFilter = 'specific'" class="px-4 py-2 rounded-lg text-[11px] font-black transition-all whitespace-nowrap" :class="dateFilter === 'specific' ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-800'">ជ្រើសថ្ងៃ</button>
                  <button @click="dateFilter = 'range'" class="px-4 py-2 rounded-lg text-[11px] font-black transition-all whitespace-nowrap" :class="dateFilter === 'range' ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-800'">ចន្លោះថ្ងៃ</button>
              </div>

              <div class="flex items-center gap-2 animate-fade-in shrink-0" v-if="dateFilter === 'specific' || dateFilter === 'range'">
                  <input v-if="dateFilter === 'specific'" v-model="specificDate" type="date" class="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 outline-none cursor-pointer shadow-sm" />
                  <div v-if="dateFilter === 'range'" class="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-2 py-1 shadow-sm">
                      <input v-model="startDate" type="date" class="bg-transparent border-none text-xs font-bold text-slate-700 focus:ring-0 outline-none cursor-pointer p-1" />
                      <span class="text-slate-300">-</span>
                      <input v-model="endDate" type="date" class="bg-transparent border-none text-xs font-bold text-slate-700 focus:ring-0 outline-none cursor-pointer p-1" />
                  </div>
              </div>
          </div>

      </div>
    </div>

    <div v-if="isLoading" class="flex-1 flex flex-col items-center justify-center opacity-60 print:hidden">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-indigo-600 mb-4"></div>
        <p class="text-slate-500 font-bold text-sm">កំពុងទាញយកទិន្នន័យលម្អិត...</p>
    </div>

    <div v-else class="max-w-[95rem] mx-auto w-full px-4 md:px-6 flex-1 flex flex-col pb-10 print:px-0 print:pb-0">
      
      <div class="mb-4 flex items-end justify-between px-2 print:hidden">
         <h2 class="text-slate-600 font-black">បញ្ជីមុខទំនិញដែលបានលក់សរុប</h2>
         <div class="text-right">
             <p class="text-xs font-bold text-slate-400 mb-0.5">សរុបទឹកប្រាក់ (Total)</p>
             <p class="text-2xl font-black text-emerald-600 leading-none">{{ formatCurrency(totalAmountUSD) }}</p>
         </div>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col print:border-none print:shadow-none print:rounded-none">
        <div class="overflow-x-auto flex-1">
          <table class="w-full text-left border-collapse">
            <thead class="bg-slate-50 text-[11px] font-black text-slate-500 uppercase tracking-wider sticky top-0 z-10 print:bg-transparent print:text-black">
              <tr>
                <th class="px-4 py-3 text-center border-b border-slate-200 w-12">#</th>
                <th class="px-4 py-3 border-b border-slate-200 min-w-[120px]">កាលបរិច្ឆេទ</th>
                <th class="px-4 py-3 border-b border-slate-200 min-w-[150px]">វិក្កយបត្រ / អតិថិជន</th>
                <th class="px-4 py-3 border-b border-slate-200 min-w-[250px]">ឈ្មោះទំនិញ</th>
                <th class="px-4 py-3 text-center border-b border-slate-200 w-[100px]">ប្រភេទ</th>
                <th class="px-4 py-3 text-center border-b border-slate-200 w-[100px]">បរិមាណ</th>
                <th class="px-4 py-3 text-right border-b border-slate-200 min-w-[120px]">សរុប (Total)</th>
              </tr>
            </thead>
            <tbody class="text-xs">
              <tr v-if="paginatedData.length === 0" class="print:hidden">
                  <td colspan="7" class="py-16 text-center text-slate-400">
                      <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3"><svg class="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg></div>
                      <p class="font-black text-sm text-slate-500">មិនមានប្រវត្តិលក់ទេ</p>
                  </td>
              </tr>
              
              <tr v-for="(item, index) in (isPrinting ? filteredData : paginatedData)" :key="item.id" class="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group">
                <td class="px-4 py-3.5 text-center font-bold text-slate-400">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                <td class="px-4 py-3.5 font-bold text-slate-600">{{ formatDate(item.date) }}</td>
                <td class="px-4 py-3.5">
                    <div class="font-black text-indigo-600 flex items-center gap-1"><span class="text-slate-400">#</span>{{ item.receiptId }}</div>
                    <div class="text-[10px] text-slate-500 font-bold mt-0.5 truncate max-w-[150px]">{{ item.customerName || 'អតិថិជនទូទៅ' }}</div>
                </td>
                <td class="px-4 py-3.5">
                    <div class="font-black text-slate-800 line-clamp-2">{{ item.productName }}</div>
                </td>
                <td class="px-4 py-3.5 text-center">
                    <span class="px-2 py-0.5 rounded text-[10px] font-black border" :class="item.category === 'បោះដុំ' ? 'bg-purple-50 text-purple-600 border-purple-200' : 'bg-slate-100 text-slate-600 border-slate-200'">
                        {{ item.category }}
                    </span>
                </td>
                <td class="px-4 py-3.5 text-center">
                    <span class="font-black text-slate-700 bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-200">{{ item.qty }} {{ translateUnit(item.unit) }}</span>
                </td>
                <td class="px-4 py-3.5 text-right font-black text-emerald-600 text-sm">
                    {{ formatCurrency(item.totalPrice) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div v-if="totalPages > 1 && !isPrinting" class="bg-white border-t border-slate-200 px-5 py-3 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
            <p class="text-xs font-bold text-slate-500">
                បង្ហាញ <span class="text-slate-800">{{ ((currentPage - 1) * itemsPerPage) + 1 }}</span> - <span class="text-slate-800">{{ Math.min(currentPage * itemsPerPage, filteredData.length) }}</span> នៃ <span class="text-indigo-600">{{ filteredData.length }}</span> មុខទំនិញ
            </p>
            <div class="flex items-center gap-1.5">
                <button @click="currentPage--" :disabled="currentPage === 1" class="px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1" :class="currentPage === 1 ? 'text-slate-400 bg-slate-50 cursor-not-allowed' : 'text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm'">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/></svg> មុន
                </button>
                <span class="px-3 py-1.5 text-[11px] font-black text-slate-600 bg-slate-100 rounded-lg border border-slate-200">
                    {{ currentPage }} / {{ totalPages }}
                </span>
                <button @click="currentPage++" :disabled="currentPage === totalPages" class="px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1" :class="currentPage === totalPages ? 'text-slate-400 bg-slate-50 cursor-not-allowed' : 'text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm'">
                    បន្ទាប់ <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
                </button>
            </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { db } from '@/firebaseConfig';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

const route = useRoute();
const sellerId = route.params.id;

// States
const isLoading = ref(true);
const isPrinting = ref(false);
const sellerInfo = ref({});
const allSalesItems = ref([]);

// Filter States
const searchQuery = ref('');
// 🌟 ដោះស្រាយការស៊ី Reads ពេល Load ដំបូង ដោយប្តូរ Default ពី 'all' ទៅ 'month' 🌟
const dateFilter = ref('month'); 

const getTodayString = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const specificDate = ref(getTodayString());
const startDate = ref(getTodayString());
const endDate = ref(getTodayString());

// Pagination States
const currentPage = ref(1);
const itemsPerPage = 50;

// Utilities
const formatCurrency = (val) => Number(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " $";
const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).format(new Date(dateStr));
};
const translateUnit = (unit) => {
    const u = String(unit).toLowerCase().trim();
    if (u === "bottle" || u === "bottles") return "ដប";
    if (u === "pack" || u === "packs") return "កញ្ចប់";
    if (u === "case" || u === "cases") return "កេះ";
    if (u === "set" || u === "sets" || u === "ឈុត") return "ឈុត";
    return unit;
};

// 🌟 Server-Side Date Scope Logic 🌟
const getDateRangeISO = () => {
    let start, end;
    const createDateBounds = (dateString) => {
        const base = new Date(dateString);
        const startDay = new Date(base.getFullYear(), base.getMonth(), base.getDate(), 0, 0, 0);
        const endDay = new Date(base.getFullYear(), base.getMonth(), base.getDate(), 23, 59, 59, 999);
        return { startDay, endDay };
    };

    if (dateFilter.value === 'today') {
        const { startDay, endDay } = createDateBounds(getTodayString());
        start = startDay; end = endDay;
    } else if (dateFilter.value === 'month') {
        const today = new Date();
        start = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
    } else if (dateFilter.value === 'specific') {
        const { startDay, endDay } = createDateBounds(specificDate.value);
        start = startDay; end = endDay;
    } else if (dateFilter.value === 'range') {
        const boundsStart = createDateBounds(startDate.value);
        const boundsEnd = createDateBounds(endDate.value);
        start = boundsStart.startDay; end = boundsEnd.endDay;
    }
    
    return { startStr: start?.toISOString(), endStr: end?.toISOString() };
};

// 🌟 Fetch Sales Data Logic (សន្សំសំចៃ Reads វៃឆ្លាត) 🌟
const fetchSellerSales = async () => {
    isLoading.value = true;
    try {
        const salesRef = collection(db, 'sales_reports');
        let q1, q2;

        if (dateFilter.value === 'all') {
            // ទាញទាំងអស់បើសិនជា Admin ជ្រើសរើសយក "ទាំងអស់"
            q1 = query(salesRef, where('uid', '==', sellerId));
            q2 = query(salesRef, where('sellerId', '==', sellerId));
        } else {
            // ទាញយកតែក្នុងចន្លោះថ្ងៃដែលបានជ្រើសរើស (ជួយសន្សំ Reads កប់ផ្លាត)
            const { startStr, endStr } = getDateRangeISO();
            q1 = query(salesRef, where('uid', '==', sellerId), where('createdAt', '>=', startStr), where('createdAt', '<=', endStr));
            q2 = query(salesRef, where('sellerId', '==', sellerId), where('createdAt', '>=', startStr), where('createdAt', '<=', endStr));
        }

        const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);
        
        // Combine and unique
        const uniqueDocs = new Map();
        snap1.docs.forEach(d => uniqueDocs.set(d.id, d.data()));
        snap2.docs.forEach(d => uniqueDocs.set(d.id, d.data()));

        let flatItems = [];
        uniqueDocs.forEach((data, docId) => {
            if (data.paymentStatus === 'CANCELED') return; // Skip canceled
            const dateStr = data.createdAt || data.date;
            
            if (data.items && Array.isArray(data.items)) {
                data.items.forEach((item, index) => {
                    let typeStr = String(item.type || '').toLowerCase();
                    let isWholesale = typeStr.includes('បោះដុំ') || typeStr.includes('wholesale');
                    // Smart detection for combo
                    let isCombo = item.isCombo || typeStr.includes('ឈុត') || String(item.name).includes('ឈុត');

                    flatItems.push({
                        id: `${docId}_${index}`,
                        receiptId: data.receiptId || docId,
                        customerName: data.customerName,
                        date: dateStr,
                        productName: item.name,
                        category: isWholesale ? 'បោះដុំ' : 'លក់រាយ',
                        qty: Number(item.qty),
                        unit: isCombo ? 'set' : item.unit,
                        totalPrice: (data.currency === 'KHR' || data.currency === '៛') ? (Number(item.price * item.qty) / 4000) : Number(item.price * item.qty)
                    });
                });
            }
        });

        // Sort latest first
        allSalesItems.value = flatItems.sort((a, b) => new Date(b.date) - new Date(a.date));

    } catch (error) {
        console.error("Error fetching detail:", error);
    } finally {
        isLoading.value = false;
    }
};

// Fetch Initial Data
onMounted(async () => {
    try {
        // 1. Fetch Seller Info
        if (sellerId === 'admin_direct') {
            sellerInfo.value = { fullName: 'ទិញផ្ទាល់ / មិនមានអ្នកលក់', idNumber: 'DIRECT', role: 'admin', photoUrl: '' };
        } else {
            const sellerDoc = await getDoc(doc(db, 'users', sellerId));
            if (sellerDoc.exists()) sellerInfo.value = sellerDoc.data();
            else sellerInfo.value = { fullName: 'អ្នកលក់មិនស្គាល់', idNumber: 'N/A' };
        }

        // 2. Fetch Sales Reports
        await fetchSellerSales();

    } catch (error) {
        console.error("Error loading seller info:", error);
        isLoading.value = false;
    }
});

// Reset page and Refetch when Date Filters change
watch([dateFilter, specificDate, startDate, endDate], () => {
    currentPage.value = 1;
    fetchSellerSales();
});

// Watch Search Query
watch(searchQuery, () => {
    currentPage.value = 1;
});

// Since we filter mostly on server now, this local filter acts as a fallback/search filter
const filteredData = computed(() => {
    let result = allSalesItems.value;

    if (searchQuery.value.trim()) {
        const q = searchQuery.value.toLowerCase().trim();
        result = result.filter(item => 
            (item.productName && item.productName.toLowerCase().includes(q)) || 
            (item.receiptId && item.receiptId.toLowerCase().includes(q)) ||
            (item.customerName && item.customerName.toLowerCase().includes(q))
        );
    }
    return result;
});

// Computed Pagination & Totals
const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage) || 1);

const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    return filteredData.value.slice(start, start + itemsPerPage);
});

const totalAmountUSD = computed(() => {
    return filteredData.value.reduce((sum, item) => sum + (Number(item.totalPrice) || 0), 0);
});

// Print Function (Native Browser Print customized via CSS)
const handlePrint = () => {
    isPrinting.value = true;
    setTimeout(() => {
        window.print();
        isPrinting.value = false;
    }, 300);
};

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Battambang:wght@400;700;900&display=swap');
.font-khmer { font-family: 'Battambang', sans-serif; }
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.animate-fade-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }

/* Print Specific Styles */
@media print {
    @page { margin: 10mm; size: A4 portrait; }
    body { background-color: white !important; }
    .print\:hidden { display: none !important; }
    .print\:bg-white { background-color: white !important; }
    .print\:border-none { border: none !important; }
    .print\:shadow-none { box-shadow: none !important; }
    table { width: 100%; border-collapse: collapse; page-break-inside: auto; }
    tr { page-break-inside: avoid; page-break-after: auto; }
    thead { display: table-header-group; }
    tfoot { display: table-footer-group; }
}
</style>