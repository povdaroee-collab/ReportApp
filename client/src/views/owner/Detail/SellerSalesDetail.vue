<template>
  <div class="min-h-[100dvh] bg-[#F4F7FE] font-khmer flex flex-col print:bg-white pb-20">
    
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
            <button @click="handlePrint" :disabled="filteredData.length === 0 || processing.active" class="bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold text-sm shadow-md transition-all active:scale-95 disabled:opacity-50">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                Print
            </button>
            <button @click="handlePDF" :disabled="filteredData.length === 0 || processing.active" class="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold text-sm shadow-sm transition-all active:scale-95 disabled:opacity-50">
                <svg v-if="processing.active" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                PDF
            </button>
        </div>

      </div>
    </div>

    <div class="max-w-[95rem] mx-auto w-full px-4 md:px-6 mt-6 mb-4 print:hidden">
      <div class="bg-white p-3 md:p-4 rounded-[20px] shadow-sm border border-slate-200 flex flex-col lg:flex-row gap-4 justify-between items-center relative z-40">
          
          <div class="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto overflow-x-auto no-scrollbar">
              <div class="bg-slate-100/80 p-1 rounded-xl flex shadow-inner border border-slate-200 shrink-0">
                  <button @click="setFilterType('today')" class="px-4 py-2 rounded-lg text-[11px] font-black transition-all whitespace-nowrap" :class="dateFilter === 'today' ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-800'">ថ្ងៃនេះ</button>
                  <button @click="setFilterType('month')" class="px-4 py-2 rounded-lg text-[11px] font-black transition-all whitespace-nowrap" :class="dateFilter === 'month' ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-800'">ខែនេះ</button>
                  <button @click="setFilterType('specific')" class="px-4 py-2 rounded-lg text-[11px] font-black transition-all whitespace-nowrap" :class="dateFilter === 'specific' ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-800'">ជ្រើសថ្ងៃ</button>
                  <button @click="setFilterType('range')" class="px-4 py-2 rounded-lg text-[11px] font-black transition-all whitespace-nowrap" :class="dateFilter === 'range' ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-800'">ចន្លោះថ្ងៃ</button>
                  <button @click="setFilterType('all')" class="px-4 py-2 rounded-lg text-[11px] font-black transition-all whitespace-nowrap" :class="dateFilter === 'all' ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-800'">ទាំងអស់</button>
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
          
          <div class="w-px h-8 bg-slate-200 hidden lg:block mx-2"></div>

          <div class="relative w-full lg:w-80">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </span>
              <input v-model="searchQuery" type="text" placeholder="ស្វែងរក វិក្កយបត្រ, អតិថិជន, ទំនិញ..." class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all shadow-inner" />
          </div>

      </div>
    </div>

    <div v-if="isLoading && allSalesItems.length === 0" class="flex-1 flex flex-col items-center justify-center opacity-60 print:hidden">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-indigo-600 mb-4"></div>
        <p class="text-slate-500 font-bold text-sm">កំពុងទាញយកទិន្នន័យ...</p>
    </div>

    <div v-else class="max-w-[95rem] mx-auto w-full px-4 md:px-6 flex-1 flex flex-col pb-10 print:px-0 print:pb-0 relative z-10">
      
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
              
              <tr v-for="(item, index) in paginatedData" :key="item.id" class="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group">
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
        
        <div v-if="totalPages > 1" class="bg-white border-t border-slate-200 px-5 py-3 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
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

    <transition enter-active-class="duration-300 ease-out" enter-from-class="opacity-0 translate-y-10" enter-to-class="opacity-100 translate-y-0" leave-active-class="duration-200 ease-in" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-10">
        <div v-if="fetchTimer.show" class="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] bg-slate-900/90 backdrop-blur-md border border-slate-700 text-white px-5 py-3.5 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] flex items-center gap-3 pointer-events-none">
            <div class="animate-spin h-5 w-5 border-2 border-indigo-400 border-t-transparent rounded-full"></div>
            <span class="text-sm font-bold tracking-wide">កំពុងទាញទិន្នន័យ...</span>
            <span class="text-[13px] text-indigo-300 font-mono font-black bg-slate-800 px-2 py-0.5 rounded border border-indigo-500/30 w-[45px] text-center">
                {{ fetchTimer.seconds.toFixed(1) }}s
            </span>
        </div>
    </transition>

    <div ref="printStaging" class="fixed top-0 left-[-9999px] pointer-events-none z-[-1] opacity-0 print:opacity-100 bg-white w-[1000px]"></div>

    <transition enter-active-class="duration-300 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="processing.active" class="fixed inset-0 z-[999999] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <div class="w-full max-w-sm bg-white border border-slate-200 rounded-[24px] p-8 shadow-2xl relative flex flex-col items-center text-center animate-slide-up">
                <div class="relative w-16 h-16 mb-6">
                    <div class="absolute inset-0 rounded-full border-4 border-slate-100"></div>
                    <div class="absolute inset-0 rounded-full border-4 border-t-indigo-600 border-r-indigo-600 border-b-transparent border-l-transparent animate-spin"></div>
                    <div class="absolute inset-0 flex items-center justify-center font-black text-slate-700 text-sm font-mono">{{ processing.progress }}%</div>
                </div>
                <h3 class="text-base font-black text-slate-800 mb-3">{{ processing.message }}</h3>
                <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div class="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 ease-out" :style="{ width: `${processing.progress}%` }"></div>
                </div>
            </div>
        </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { db } from '@/firebaseConfig';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const route = useRoute();
const sellerId = route.params.id;

// States
const isLoading = ref(true);
const sellerInfo = ref({});
const allSalesItems = ref([]);
const availableUnits = ref([]);

const printStaging = ref(null);
const processing = ref({ active: false, message: '', progress: 0 });

// Filter States
const searchQuery = ref('');
const dateFilter = ref('today'); 

const getTodayString = () => { 
    const d = new Date(); 
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; 
};
const specificDate = ref(getTodayString());
const startDate = ref(getTodayString());
const endDate = ref(getTodayString());

// Pagination States
const currentPage = ref(1);
const itemsPerPage = 50;

// 🌟 មុខងាររាប់វិនាទីអណ្តែតពីលើ (Smart Floating Timer) 🌟
const fetchTimer = reactive({ show: false, seconds: 0, interval: null });

const startFetchTimer = () => {
    fetchTimer.show = true;
    fetchTimer.seconds = 0;
    if (fetchTimer.interval) clearInterval(fetchTimer.interval);
    fetchTimer.interval = setInterval(() => { fetchTimer.seconds += 0.1; }, 100);
};

const stopFetchTimer = () => {
    fetchTimer.show = false;
    if (fetchTimer.interval) clearInterval(fetchTimer.interval);
};

// Utilities
const formatCurrency = (val) => Number(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " $";
const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(dateStr));
};
const translateUnit = (unit) => {
    const u = String(unit).toLowerCase().trim();
    const found = availableUnits.value.find(av => String(av.value).toLowerCase() === u);
    if (found) return found.label;

    if (u === "bottle" || u === "bottles") return "ដប";
    if (u === "pack" || u === "packs") return "កញ្ចប់";
    if (u === "case" || u === "cases") return "កេះ";
    if (u === "set" || u === "sets" || u === "ឈុត") return "ឈុត";
    return unit;
};

// 🌟 ដំណោះស្រាយការពន្យារពេល (Debounce Client-Side) 🌟
let debounceTimeout = null;

const setFilterType = (type) => {
    startFetchTimer(); // លោតនាឡិកាភ្លាមៗពេលចុច
    if (debounceTimeout) clearTimeout(debounceTimeout);
    
    debounceTimeout = setTimeout(() => {
        dateFilter.value = type;
        currentPage.value = 1;
        stopFetchTimer(); // បិទនាឡិកាវិញព្រោះការ Filter លើ Client លឿនណាស់ (Instant)
    }, 300);
};

const fetchSellerData = async () => {
    if (allSalesItems.value.length === 0) isLoading.value = true;
    startFetchTimer(); // ចាប់ផ្ដើមរាប់ពេលទាញទិន្នន័យពី Firebase
    
    try {
        const unitSnap = await getDocs(collection(db, 'settings_units'));
        availableUnits.value = unitSnap.docs.map(d => d.data());

        if (sellerId === 'admin_direct') {
            sellerInfo.value = { fullName: 'ទិញផ្ទាល់ / មិនមានអ្នកលក់', idNumber: 'DIRECT', role: 'admin', photoUrl: '' };
        } else if (!sellerInfo.value.fullName) {
            const sellerDoc = await getDoc(doc(db, 'users', sellerId));
            if (sellerDoc.exists()) sellerInfo.value = sellerDoc.data();
            else sellerInfo.value = { fullName: 'អ្នកលក់មិនស្គាល់', idNumber: 'N/A' };
        }

        const baseRef = collection(db, 'sales_reports');
        const q1 = query(baseRef, where('uid', '==', sellerId));
        const q2 = query(baseRef, where('sellerId', '==', sellerId));
        
        const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);
        
        const uniqueDocs = new Map();
        snap1.docs.forEach(d => uniqueDocs.set(d.id, d.data()));
        snap2.docs.forEach(d => uniqueDocs.set(d.id, d.data()));

        let flatItems = [];
        uniqueDocs.forEach((data, docId) => {
            if (data.paymentStatus === 'CANCELED') return; 
            const dateStr = data.createdAt || data.date;
            
            if (data.items && Array.isArray(data.items)) {
                data.items.forEach((item, index) => {
                    let typeStr = String(item.type || '').toLowerCase();
                    let isWholesale = typeStr.includes('បោះដុំ') || typeStr.includes('wholesale');

                    flatItems.push({
                        id: `${docId}_${index}`,
                        receiptId: data.receiptId || docId,
                        customerName: data.customerName,
                        date: dateStr,
                        productName: item.name,
                        category: isWholesale ? 'បោះដុំ' : 'លក់រាយ',
                        qty: Number(item.qty),
                        unit: item.unit,
                        totalPrice: (data.currency === 'KHR' || data.currency === '៛') ? (Number(item.price * item.qty) / 4000) : Number(item.price * item.qty)
                    });
                });
            }
        });

        allSalesItems.value = flatItems.sort((a, b) => new Date(b.date) - new Date(a.date));

    } catch (error) {
        console.error("Error fetching detail:", error);
    } finally {
        isLoading.value = false;
        stopFetchTimer(); // ទាញចប់បិទនាឡិកា
    }
};

onMounted(() => {
    fetchSellerData();
});

const isDateInScope = (dateStr) => {
    if (!dateStr) return false;
    
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return false; 

    const today = new Date();

    if (dateFilter.value === 'all') return true;

    if (dateFilter.value === 'today') {
        return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
    }
    if (dateFilter.value === 'month') {
        return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
    }
    if (dateFilter.value === 'specific') {
        if (!specificDate.value) return true;
        const s = new Date(specificDate.value);
        return d.getDate() === s.getDate() && d.getMonth() === s.getMonth() && d.getFullYear() === s.getFullYear();
    }
    if (dateFilter.value === 'range') {
        if (!startDate.value || !endDate.value) return true;
        const s = new Date(startDate.value);
        s.setHours(0, 0, 0, 0); 
        const e = new Date(endDate.value);
        e.setHours(23, 59, 59, 999); 
        return d >= s && d <= e;
    }
    return true;
};

// Computed Filtered Data
const filteredData = computed(() => {
    let result = allSalesItems.value.filter(item => isDateInScope(item.date));

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

const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage) || 1);

const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    return filteredData.value.slice(start, start + itemsPerPage);
});

const totalAmountUSD = computed(() => {
    return filteredData.value.reduce((sum, item) => sum + (Number(item.totalPrice) || 0), 0);
});

watch([searchQuery, dateFilter, specificDate, startDate, endDate], () => {
    currentPage.value = 1;
});


// ============================================================================
// 🚀 PRINT & PDF LOGIC (Professional Design)
// ============================================================================

const getReportDateTitle = () => {
    if (dateFilter.value === 'today') return 'ប្រចាំថ្ងៃនេះ';
    if (dateFilter.value === 'month') return 'ប្រចាំខែនេះ';
    if (dateFilter.value === 'all') return 'ប្រវត្តិលក់ទាំងអស់';
    if (dateFilter.value === 'specific') return `ប្រចាំថ្ងៃទី ${new Date(specificDate.value).toLocaleDateString('km-KH')}`;
    return `ចាប់ពី ${new Date(startDate.value).toLocaleDateString('km-KH')} ដល់ ${new Date(endDate.value).toLocaleDateString('km-KH')}`;
};

const generateReportHTML = () => {
    const dateTitle = getReportDateTitle();

    let tableRows = '';
    filteredData.value.forEach((item, index) => {
        tableRows += `
            <tr style="border-bottom: 1px dashed #e2e8f0; break-inside: avoid;">
                <td style="padding: 10px; text-align: center;">${index + 1}</td>
                <td style="padding: 10px;">
                    <div style="font-weight: 900; color: #1e293b;">${item.receiptId}</div>
                    <div style="font-size: 10px; color: #64748b;">${formatDate(item.date)}</div>
                </td>
                <td style="padding: 10px; font-weight: bold; color: #1e293b;">${item.customerName || 'អតិថិជនទូទៅ'}</td>
                <td style="padding: 10px;">${item.productName}</td>
                <td style="padding: 10px; text-align: center; font-size: 10px; color: #64748b;">${item.category}</td>
                <td style="padding: 10px; text-align: center; font-weight: bold; color: #0ea5e9;">${item.qty} ${translateUnit(item.unit)}</td>
                <td style="padding: 10px; text-align: right; font-weight: 900; color: #059669;">
                    ${formatCurrency(item.totalPrice)}
                </td>
            </tr>
        `;
    });

    return `
        <div class="print-layout" style="width: 1000px; padding: 40px; background: white; font-family: 'Battambong', sans-serif; color: #1e293b;">
            <div style="text-align: center; border-bottom: 2px solid #4f46e5; padding-bottom: 15px; margin-bottom: 25px;">
                <h1 style="margin: 0; font-size: 24px; font-weight: 900;">របាយការណ៍លក់លម្អិត</h1>
                <p style="margin: 5px 0 0 0; color: #64748b; font-size: 13px;">អ្នកលក់: <strong>${sellerInfo.value.fullName || 'N/A'}</strong> | កាលបរិច្ឆេទ: <strong>${dateTitle}</strong></p>
            </div>
            
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 15px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <p style="margin:0; font-size: 11px; color: #64748b; font-weight: bold; text-transform: uppercase;">ចំនួនមុខទំនិញសរុប</p>
                    <p style="margin:0; font-size: 20px; font-weight: 900; color: #4f46e5;">${filteredData.value.length} <span style="font-size: 12px;">មុខ</span></p>
                </div>
                <div style="text-align: right;">
                    <p style="margin:0; font-size: 11px; color: #64748b; font-weight: bold; text-transform: uppercase;">សរុបទឹកប្រាក់ (TOTAL REVENUE)</p>
                    <p style="margin:0; font-size: 24px; font-weight: 900; color: #059669;">${formatCurrency(totalAmountUSD.value)}</p>
                </div>
            </div>

            <table style="width: 100%; text-align: left; border-collapse: collapse; font-size: 12px; margin-bottom: 30px;">
                <thead style="background: #f1f5f9; color: #64748b; text-transform: uppercase; font-size: 10px;">
                    <tr>
                        <th style="padding: 10px; width: 5%; text-align: center;">#</th>
                        <th style="padding: 10px; width: 18%;">វិក្កយបត្រ & ថ្ងៃទី</th>
                        <th style="padding: 10px; width: 17%;">អតិថិជន</th>
                        <th style="padding: 10px; width: 30%;">ឈ្មោះទំនិញ</th>
                        <th style="padding: 10px; width: 10%; text-align: center;">ប្រភេទ</th>
                        <th style="padding: 10px; width: 10%; text-align: center;">បរិមាណ</th>
                        <th style="padding: 10px; width: 10%; text-align: right;">សរុប ($)</th>
                    </tr>
                </thead>
                <tbody>${tableRows}</tbody>
            </table>
        </div>
    `;
};

const handlePrint = () => {
    const html = generateReportHTML();
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute'; iframe.style.width = '0'; iframe.style.height = '0'; iframe.style.border = 'none';
    document.body.appendChild(iframe);
    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
        <html><head><title>Seller_Report_${sellerInfo.value.fullName}</title>
        <link href="https://fonts.googleapis.com/css2?family=Battambong:wght@400;700;900&display=swap" rel="stylesheet">
        <style>@page { size: A4 portrait; margin: 10mm; } body { font-family: 'Battambong', sans-serif; -webkit-print-color-adjust: exact !important; margin: 0; }</style>
        </head><body>${html}</body></html>
    `);
    doc.close();
    iframe.contentWindow.document.fonts.ready.then(() => {
        iframe.contentWindow.focus(); iframe.contentWindow.print();
        setTimeout(() => document.body.removeChild(iframe), 1000);
    });
};

const handlePDF = async () => {
    processing.value = { active: true, message: 'កំពុងរៀបចំឯកសារ PDF...', progress: 30 };
    try {
        printStaging.value.innerHTML = generateReportHTML();
        await nextTick(); await document.fonts.ready; await new Promise(r => setTimeout(r, 600)); 
        
        processing.value.progress = 60;
        const canvas = await html2canvas(printStaging.value.querySelector('.print-layout'), { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        
        const pdf = new jsPDF('p', 'mm', 'a4'); 
        const pdfWidth = 210; 
        const propsImg = pdf.getImageProperties(imgData);
        const pdfHeight = (propsImg.height * pdfWidth) / propsImg.width;
        
        processing.value.progress = 90;
        
        let position = 0; let leftHeight = pdfHeight; const pageHeight = 295; 

        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
        leftHeight -= pageHeight;

        while (leftHeight > 0) {
            position = leftHeight - pdfHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
            leftHeight -= pageHeight;
        }

        const safeName = (sellerInfo.value.fullName || 'Seller').replace(/[^a-zA-Z0-9]/g, '_');
        pdf.save(`Report_${safeName}_${getTodayString()}.pdf`);
    } catch(e) {
        console.error("PDF Error:", e);
        alert('មិនអាចទាញយក PDF បានទេ');
    } finally {
        if(printStaging.value) printStaging.value.innerHTML = '';
        processing.value.active = false;
    }
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
.animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }

@media print {
    .print\:hidden { display: none !important; }
    .print\:bg-white { background-color: white !important; }
    .print\:border-none { border: none !important; }
    .print\:shadow-none { box-shadow: none !important; }
    .print\:px-0 { padding-left: 0 !important; padding-right: 0 !important; }
    .print\:pb-0 { padding-bottom: 0 !important; }
    .print\:rounded-none { border-radius: 0 !important; }
}
</style>