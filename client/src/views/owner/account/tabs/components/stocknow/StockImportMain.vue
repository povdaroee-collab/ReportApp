<template>
  <div class="font-khmer min-h-[80vh] flex flex-col relative pb-10 animate-fade-in">
      
      <div class="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-200 mb-6 flex flex-col xl:flex-row justify-between gap-5 relative z-10">
          
          <div class="flex items-center gap-4">
              <div class="w-14 h-14 bg-gradient-to-br from-sky-50 to-indigo-50 text-sky-500 rounded-2xl flex items-center justify-center border border-sky-100 shadow-inner shrink-0">
                  <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
              </div>
              <div>
                  <h2 class="text-xl md:text-2xl font-black text-slate-800 leading-tight">ស្តុកថ្មី & នាំចូល</h2>
                  <p class="text-[11px] md:text-xs font-bold text-slate-500 mt-1">ប្រវត្តិ និងរបាយការណ៍ទិញស្តុកចូលឃ្លាំង</p>
              </div>
          </div>

          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 xl:justify-end">
              
              <div class="bg-slate-100/80 p-1.5 rounded-xl flex shadow-inner border border-slate-200 w-full sm:w-auto">
                  <button @click="setFilterMode('month')" class="flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-black transition-all whitespace-nowrap" :class="filterMode === 'month' ? 'bg-white text-indigo-700 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-800'">តាមខែ</button>
                  <button @click="setFilterMode('range')" class="flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-black transition-all whitespace-nowrap" :class="filterMode === 'range' ? 'bg-white text-indigo-700 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-800'">ចន្លោះថ្ងៃ</button>
              </div>

              <div class="flex items-center gap-2 w-full sm:w-auto animate-fade-in">
                  <div v-if="filterMode === 'month'" class="relative w-full sm:w-auto">
                      <input v-model="selectedMonth" type="month" class="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 outline-none cursor-pointer shadow-sm">
                  </div>

                  <div v-if="filterMode === 'range'" class="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-2 py-1 shadow-sm w-full sm:w-auto">
                      <input v-model="startDate" type="date" class="bg-transparent border-none text-xs font-bold text-slate-700 focus:ring-0 outline-none cursor-pointer px-2 py-1.5 w-full sm:w-auto" />
                      <span class="text-slate-300 font-bold px-1">-</span>
                      <input v-model="endDate" type="date" class="bg-transparent border-none text-xs font-bold text-slate-700 focus:ring-0 outline-none cursor-pointer px-2 py-1.5 w-full sm:w-auto" />
                  </div>
                  
                  <button @click="syncNewData" :disabled="isSyncing || !canSync" class="h-11 px-4 bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white rounded-xl flex items-center justify-center transition-all shadow-sm active:scale-95 shrink-0 border border-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed group" :title="canSync ? 'ទាញយកទិន្នន័យថ្មី' : 'ទិន្នន័យត្រូវបានធ្វើបច្ចុប្បន្នភាពរួចរាល់'">
                      <svg v-if="isSyncing" class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                      <span v-if="!canSync" class="hidden md:block ml-2 text-xs font-black">ថ្មីបំផុត</span>
                  </button>
              </div>
          </div>
      </div>

      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 mx-1 z-10 relative">
          <div class="flex bg-white p-1.5 rounded-2xl border border-slate-200 w-fit shadow-sm overflow-x-auto">
              <button @click="activeTab = 'IN'" :class="activeTab === 'IN' ? 'bg-sky-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'" class="px-6 py-2.5 rounded-xl text-sm font-black transition-all flex items-center gap-2 whitespace-nowrap">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                  ស្តុកនាំចូល (Restock)
              </button>
              <button @click="activeTab = 'NEW'" :class="activeTab === 'NEW' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'" class="px-6 py-2.5 rounded-xl text-sm font-black transition-all flex items-center gap-2 whitespace-nowrap">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"></path></svg>
                  ទំនិញថ្មី (New Products)
              </button>
          </div>

          <div class="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <div class="relative w-full sm:w-64 shrink-0">
                  <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></span>
                  <input v-model="searchQuery" type="text" placeholder="ស្វែងរកឈ្មោះ ឬ ចំណាំ..." class="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm">
              </div>

              <div class="flex items-center gap-2">
                  <button @click="downloadExcel" :disabled="groupedData.length === 0 || isExporting" class="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white border border-emerald-200 hover:border-emerald-500 rounded-xl text-sm font-black transition-all flex items-center gap-2 disabled:opacity-50 active:scale-95">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg> Excel
                  </button>
                  <button @click="downloadPDF" :disabled="groupedData.length === 0 || isExporting" class="px-4 py-2.5 bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-white border border-rose-200 hover:border-rose-500 rounded-xl text-sm font-black transition-all flex items-center gap-2 disabled:opacity-50 active:scale-95">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg> PDF
                  </button>
                  <button @click="printReport" :disabled="groupedData.length === 0 || isExporting" class="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-sm font-black transition-all flex items-center gap-2 disabled:opacity-50 active:scale-95">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2-2v4h10z"></path></svg> Print
                  </button>
              </div>
          </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 relative z-10 px-1 animate-fade-in">
          <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center border" :class="activeTab === 'IN' ? 'bg-sky-50 text-sky-500 border-sky-100' : 'bg-emerald-50 text-emerald-500 border-emerald-100'">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              </div>
              <div>
                  <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">ទំនិញសរុប (Qty)</p>
                  <h3 class="text-xl font-black text-slate-800">{{ stats.totalQuantity.toLocaleString() }} <span class="text-sm text-slate-500">ឯកតា</span></h3>
              </div>
          </div>

          <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center border border-rose-100">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <div>
                  <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">ចំណាយសរុប (Cost)</p>
                  <h3 class="text-xl font-black text-rose-600">{{ formatCurrency(stats.totalCost) }}</h3>
              </div>
          </div>
          
          <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center border border-purple-100">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
              </div>
              <div>
                  <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">ប្រតិបត្តិការសរុប</p>
                  <h3 class="text-xl font-black text-slate-800">{{ stats.totalTransactions }} <span class="text-sm text-slate-500">ដង</span></h3>
              </div>
          </div>
      </div>

      <div v-if="isSyncing && paginatedGroups.length === 0" class="flex flex-col items-center justify-center py-20 opacity-60 flex-1">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-indigo-600 mb-4"></div>
          <p class="text-sm font-bold text-slate-500 tracking-wide">កំពុងធ្វើសមកាលកម្មទិន្នន័យ...</p>
      </div>

      <div v-else-if="paginatedGroups.length === 0" class="flex flex-col items-center justify-center py-24 bg-white/60 rounded-3xl border-2 border-dashed border-slate-300 shadow-sm animate-fade-in-up flex-1 mx-2">
          <div class="w-20 h-20 bg-slate-100 text-slate-300 rounded-full flex items-center justify-center mb-4 border border-slate-200">
              <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
          </div>
          <p class="text-slate-500 font-black text-lg">មិនមានទិន្នន័យទេ</p>
          <p class="text-xs text-slate-400 font-bold mt-1">សូមផ្លាស់ប្តូរចន្លោះកាលបរិច្ឆេទ ឬស្វែងរកឈ្មោះផ្សេង</p>
      </div>

      <div v-else class="space-y-6 px-1 animate-fade-in-up flex-1">
          <div v-for="(dayGroup, index) in paginatedGroups" :key="index" class="bg-white rounded-[20px] border border-slate-200 shadow-sm overflow-hidden">
              
              <div class="bg-slate-50/80 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
                  <div class="flex items-center gap-3">
                      <div class="bg-white p-1.5 rounded-lg shadow-sm border border-slate-200 text-slate-500">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      </div>
                      <h3 class="font-black text-slate-800 text-[14px]">{{ formatDateKhmer(dayGroup.date) }}</h3>
                  </div>
                  <div class="text-right">
                      <p class="text-[10px] font-bold text-slate-400 uppercase">ចំណាយប្រចាំថ្ងៃ</p>
                      <p class="font-black text-rose-600 text-[15px]">{{ formatCurrency(dayGroup.totalCost) }}</p>
                  </div>
              </div>

              <div class="overflow-x-auto">
                  <table class="w-full text-left border-collapse">
                      <thead class="bg-white text-slate-400 text-[10px] uppercase font-black tracking-widest border-b border-slate-100">
                          <tr>
                              <th class="px-5 py-3">ឈ្មោះទំនិញ</th>
                              <th class="px-5 py-3 text-center">ចំនួន (Qty)</th>
                              <th class="px-5 py-3 text-right">តម្លៃដើម (Cost)</th>
                              <th class="px-5 py-3 text-right text-rose-500">សរុប (Total)</th>
                          </tr>
                      </thead>
                      <tbody class="divide-y divide-slate-50 text-sm">
                          <tr v-for="(item, iIdx) in dayGroup.items" :key="iIdx" class="hover:bg-slate-50/50 transition-colors">
                              <td class="px-5 py-3 font-bold text-slate-700">
                                  {{ item.name }}
                                  <span v-if="item.note" class="block text-[10px] text-slate-400 font-normal mt-0.5">Note: {{ item.note }}</span>
                              </td>
                              <td class="px-5 py-3 text-center">
                                  <span class="bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-bold text-[11px] border border-slate-200">
                                      + {{ item.qty }} {{ translateHardcodedUnit(item.unit) }}
                                  </span>
                              </td>
                              <td class="px-5 py-3 text-right text-slate-500 font-bold text-[12px]">
                                  {{ formatCurrency(item.unitCost) }}
                              </td>
                              <td class="px-5 py-3 text-right font-black text-rose-600 text-[13px]">
                                  {{ formatCurrency(item.totalCost) }}
                              </td>
                          </tr>
                      </tbody>
                  </table>
              </div>
          </div>
      </div>

      <div v-if="totalPages > 1" class="mt-6 flex flex-col sm:flex-row items-center justify-between bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm gap-4 mx-1">
          <p class="text-xs font-bold text-slate-500">
              បង្ហាញ <span class="text-slate-800">{{ ((currentPage - 1) * itemsPerPage) + 1 }}</span> - <span class="text-slate-800">{{ Math.min(currentPage * itemsPerPage, groupedData.length) }}</span> នៃ <span class="text-indigo-600">{{ groupedData.length }}</span> ថ្ងៃ
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

      <div ref="printStaging" class="fixed top-0 left-[-9999px] pointer-events-none z-[-1] opacity-0 print:opacity-100 bg-white w-[1000px]"></div>

      <transition enter-active-class="duration-300 ease-out" leave-active-class="duration-200 ease-in">
          <div v-if="exportProcessing.active" class="fixed inset-0 z-[999999] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
              <div class="w-full max-w-sm bg-white border border-slate-200 rounded-[24px] p-8 shadow-2xl relative flex flex-col items-center text-center">
                  <div class="relative w-16 h-16 mb-6">
                      <div class="absolute inset-0 rounded-full border-4 border-slate-100"></div>
                      <div class="absolute inset-0 rounded-full border-4 border-t-indigo-600 border-r-indigo-600 border-b-transparent border-l-transparent animate-spin"></div>
                  </div>
                  <h3 class="text-base font-black text-slate-800 mb-3">{{ exportProcessing.message }}</h3>
              </div>
          </div>
      </transition>

  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import { db, auth } from '@/firebaseConfig';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useNotificationStore } from '@/stores/notification';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const notification = useNotificationStore();

// UI States
const isSyncing = ref(false);
const activeTab = ref('IN'); // 'IN' = Restock, 'NEW' = New Stock
const filterMode = ref('month');
const searchQuery = ref(''); // 🌟 Search State
const now = new Date();
const selectedMonth = ref(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`);
const startDate = ref(new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]);
const endDate = ref(new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]);

const currentPage = ref(1);
const itemsPerPage = 10; 

// Export States
const isExporting = ref(false);
const exportProcessing = ref({ active: false, message: '' });
const printStaging = ref(null);

// Data States
const localCache = ref([]);
const lastSyncTime = ref(null);
const CACHE_KEY = 'stock_transactions_and_new_cache_v2';

// Helpers
const formatCurrency = (val) => Number(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " $";

const translateHardcodedUnit = (u) => { 
    const m = { bottle: 'ដប', case: 'កេះ', pack: 'កញ្ចប់', can: 'កំប៉ុង', kg: 'គីឡូ', set: 'ឈុត', sheet: 'សន្លឹក', box: 'ប្រអប់', dozen: 'ឡូ' }; 
    return m[u] || u; 
};

const formatDateKhmer = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('km-KH', { dateStyle: 'long' }).format(date);
};

// Local Cache
const loadFromCache = () => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
        try {
            const parsed = JSON.parse(cached);
            localCache.value = parsed.data || [];
            lastSyncTime.value = parsed.lastSync || null;
        } catch(e) {
            console.error("Cache Error:", e);
        }
    }
};

const saveToCache = (data, syncTime) => {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, lastSync: syncTime }));
};

const canSync = computed(() => {
    if (!lastSyncTime.value) return true;
    const lastSyncDate = new Date(lastSyncTime.value);
    const timeDiff = new Date() - lastSyncDate;
    return timeDiff > 60000; 
});

// Fetch Logic
const syncNewData = async () => {
    if (!auth.currentUser || !canSync.value) return;
    isSyncing.value = true;

    try {
        const transRef = collection(db, 'stock_transactions');
        const stocksRef = collection(db, 'stocks');
        
        let transQ, stocksQ;

        if (lastSyncTime.value && localCache.value.length > 0) {
            const lastTimestamp = Timestamp.fromDate(new Date(lastSyncTime.value));
            transQ = query(transRef, where('createdAt', '>', lastTimestamp));
            stocksQ = query(stocksRef, where('createdAt', '>', lastTimestamp));
        } else {
            transQ = query(transRef);
            stocksQ = query(stocksRef);
        }

        const [transSnap, stocksSnap] = await Promise.all([
            getDocs(transQ),
            getDocs(stocksQ)
        ]);

        let newItems = [];

        transSnap.forEach(doc => {
            const data = doc.data();
            if (data.type === 'IN') { 
                let dateStr = new Date().toISOString().split('T')[0];
                let timeVal = new Date().getTime();
                if (data.createdAt && data.createdAt.toDate) {
                    const d = data.createdAt.toDate();
                    dateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
                    timeVal = d.getTime();
                }
                newItems.push({
                    id: doc.id,
                    date: dateStr,
                    timestamp: timeVal,
                    name: data.productName || 'មិនស្គាល់ឈ្មោះ',
                    qty: Number(data.qty || 0),
                    unitCost: Number(data.unitCost || 0),
                    totalCost: Number(data.totalValue || 0),
                    unit: data.unitDisplay || 'bottle',
                    note: data.reason || 'នាំចូលស្តុកបន្ថែម',
                    type: 'IN' 
                });
            }
        });

        stocksSnap.forEach(doc => {
            const data = doc.data();
            let dateStr = new Date().toISOString().split('T')[0];
            let timeVal = new Date().getTime();
            if (data.createdAt && data.createdAt.toDate) {
                const d = data.createdAt.toDate();
                dateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
                timeVal = d.getTime();
            }
            newItems.push({
                id: `NEW_${doc.id}`,
                originalId: doc.id,
                date: dateStr,
                timestamp: timeVal,
                name: data.name || 'មិនស្គាល់ឈ្មោះ',
                qty: Number(data.quantity || 0),
                unitCost: Number(data.unitCost || 0),
                totalCost: Number(data.totalCost || (Number(data.quantity||0) * Number(data.unitCost||0))),
                unit: data.unit || 'case',
                note: 'បង្កើតទំនិញថ្មីដំបូងចូលប្រព័ន្ធ',
                type: 'NEW'
            });
        });

        if (newItems.length > 0) {
            const merged = [...newItems, ...localCache.value];
            const uniqueMap = new Map();
            merged.forEach(item => uniqueMap.set(item.id, item));
            
            localCache.value = Array.from(uniqueMap.values()).sort((a,b) => b.timestamp - a.timestamp);
            notification.success(`បានធ្វើបច្ចុប្បន្នភាពទិន្នន័យថ្មី ${newItems.length} រ៉េខត!`);
        }

        lastSyncTime.value = new Date().toISOString();
        saveToCache(localCache.value, lastSyncTime.value);

    } catch (error) {
        console.error("Sync Error:", error);
        notification.error("បរាជ័យក្នុងការទាញយកទិន្នន័យ");
    } finally {
        isSyncing.value = false;
    }
};

const setFilterMode = (mode) => {
    filterMode.value = mode;
    currentPage.value = 1;
    if (mode === 'month') {
        const [year, month] = selectedMonth.value.split('-');
        startDate.value = new Date(year, month - 1, 1).toISOString().split('T')[0];
        endDate.value = new Date(year, month, 0).toISOString().split('T')[0];
    }
};

watch([selectedMonth, startDate, endDate, activeTab, searchQuery], () => {
    currentPage.value = 1;
});

// Data Processing (Local) + Search Logic 🌟
const filteredData = computed(() => {
    let result = localCache.value.filter(item => item.type === activeTab.value);

    // Filter by Date
    let qStart, qEnd;
    if (filterMode.value === 'month') {
        const [year, month] = selectedMonth.value.split('-');
        qStart = new Date(year, month - 1, 1).getTime();
        qEnd = new Date(year, month, 0, 23, 59, 59, 999).getTime();
    } else {
        qStart = new Date(startDate.value + 'T00:00:00').getTime();
        qEnd = new Date(endDate.value + 'T23:59:59.999').getTime();
    }
    result = result.filter(item => item.timestamp >= qStart && item.timestamp <= qEnd);

    // Filter by Search Query
    if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase().trim();
        result = result.filter(item => 
            (item.name && item.name.toLowerCase().includes(q)) || 
            (item.note && item.note.toLowerCase().includes(q))
        );
    }

    return result;
});

const groupedData = computed(() => {
    const groups = {};
    filteredData.value.forEach(item => {
        if (!groups[item.date]) {
            groups[item.date] = { date: item.date, totalCost: 0, items: [] };
        }
        groups[item.date].items.push(item);
        groups[item.date].totalCost += item.totalCost;
    });
    return Object.values(groups).sort((a,b) => new Date(b.date) - new Date(a.date));
});

const stats = computed(() => {
    let totalCost = 0;
    let totalQuantity = 0;
    let totalTransactions = filteredData.value.length;

    filteredData.value.forEach(item => {
        totalCost += item.totalCost;
        totalQuantity += item.qty;
    });

    return { totalCost, totalQuantity, totalTransactions };
});

const totalPages = computed(() => Math.ceil(groupedData.value.length / itemsPerPage) || 1);

const paginatedGroups = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    return groupedData.value.slice(start, start + itemsPerPage);
});

// ==========================================
// 🌟 EXPORT LOGIC (Print, PDF, Excel) 🌟
// ==========================================
const getReportTitle = () => {
    const typeLabel = activeTab.value === 'IN' ? 'ស្តុកនាំចូល (Restock)' : 'ទំនិញថ្មី (New Products)';
    let dateLabel = '';
    if (filterMode.value === 'month') {
        dateLabel = `ខែ ${selectedMonth.value}`;
    } else {
        dateLabel = `ចាប់ពី ${startDate.value} ដល់ ${endDate.value}`;
    }
    return `របាយការណ៍ ${typeLabel} - ${dateLabel}`;
};

const buildExportHTML = (isExcel = false) => {
    const title = getReportTitle();
    let rowsHTML = '';
    
    groupedData.value.forEach(group => {
        const rowBg = isExcel ? '#f8fafc' : '#f8fafc';
        rowsHTML += `
            <tr style="background-color: ${rowBg}; page-break-inside: avoid;">
                <td colspan="4" style="padding: 10px; font-weight: bold; font-size: 13px; border: 1px solid #cbd5e1; color: #1e293b;">
                    📅 ថ្ងៃទី: ${formatDateKhmer(group.date)} | ចំណាយប្រចាំថ្ងៃ: <span style="color: #e11d48;">${formatCurrency(group.totalCost)}</span>
                </td>
            </tr>
        `;
        
        group.items.forEach(item => {
            rowsHTML += `
                <tr style="page-break-inside: avoid;">
                    <td style="padding: 8px 10px; font-size: 12px; border: 1px solid #cbd5e1; color: #334155;">
                        <b>${item.name}</b>
                        ${item.note ? `<br><span style="font-size: 10px; color: #94a3b8;">Note: ${item.note}</span>` : ''}
                    </td>
                    <td style="padding: 8px 10px; text-align: center; font-size: 12px; border: 1px solid #cbd5e1; color: #475569;">
                        + ${item.qty} ${translateHardcodedUnit(item.unit)}
                    </td>
                    <td style="padding: 8px 10px; text-align: right; font-size: 12px; border: 1px solid #cbd5e1; color: #475569;">
                        ${formatCurrency(item.unitCost)}
                    </td>
                    <td style="padding: 8px 10px; text-align: right; font-size: 12px; border: 1px solid #cbd5e1; font-weight: bold; color: #e11d48;">
                        ${formatCurrency(item.totalCost)}
                    </td>
                </tr>
            `;
        });
    });

    if (isExcel) {
        return `
            <html xmlns:x="urn:schemas-microsoft-com:office:excel">
            <head>
                <meta charset="utf-8">
                <style>
                    table { font-family: 'Battambang', sans-serif; border-collapse: collapse; width: 100%; }
                    th { background-color: #1e293b; color: #ffffff; font-weight: bold; border: 1px solid #0f172a; padding: 12px; text-align: center;}
                    td { border: 1px solid #cbd5e1; vertical-align: middle; }
                    .footer-row td { background-color: #f1f5f9; font-weight: bold; font-size: 14px; padding: 12px; border: 1px solid #94a3b8; }
                </style>
            </head>
            <body>
                <table>
                    <tr><td colspan="4" style="background-color: #4f46e5; color: white; font-size: 18pt; font-weight: bold; text-align: center; height: 50px; vertical-align: middle;">${title}</td></tr>
                    <tr><td colspan="4"></td></tr>
                    <tr>
                        <th style="width: 350px;">ឈ្មោះទំនិញ</th>
                        <th style="width: 150px;">ចំនួន (Qty)</th>
                        <th style="width: 150px;">តម្លៃដើម (Cost)</th>
                        <th style="width: 150px;">សរុប (Total)</th>
                    </tr>
                    ${rowsHTML}
                    <tr class="footer-row">
                        <td colspan="3" style="text-align: right; color: #1e293b;">ការចំណាយសរុបរួម (GRAND TOTAL COST):</td>
                        <td style="text-align: right; color: #e11d48;">${formatCurrency(stats.value.totalCost)}</td>
                    </tr>
                    <tr>
                        <td colspan="4" style="text-align: right; font-size: 10px; color: #94a3b8; border: none; padding-top: 10px;">
                            ទាញយកនៅ: ${new Date().toLocaleString('en-GB')}
                        </td>
                    </tr>
                </table>
            </body>
            </html>
        `;
    }

    // PDF/Print HTML Structure (បានដក Padding ខ្លះចេញការពារទំព័រទទេ)
    return `
        <div style="font-family: 'Battambang', sans-serif; color: #333; width: 100%; box-sizing: border-box;">
            <div style="text-align: center; border-bottom: 2px solid #4f46e5; padding-bottom: 10px; margin-bottom: 20px;">
                <h2 style="margin: 0; color: #1e293b; font-size: 20px;">${title}</h2>
                <p style="margin: 5px 0 0 0; color: #64748b; font-size: 12px;">ប្រតិបត្តិការសរុប: ${stats.value.totalTransactions} ដង | ទំនិញសរុប: ${stats.value.totalQuantity.toLocaleString()} ឯកតា</p>
            </div>
            <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                <thead style="background-color: #f1f5f9; color: #475569;">
                    <tr>
                        <th style="padding: 10px; border: 1px solid #cbd5e1; text-align: left;">ឈ្មោះទំនិញ</th>
                        <th style="padding: 10px; border: 1px solid #cbd5e1; text-align: center;">ចំនួន</th>
                        <th style="padding: 10px; border: 1px solid #cbd5e1; text-align: right;">តម្លៃដើម</th>
                        <th style="padding: 10px; border: 1px solid #cbd5e1; text-align: right;">សរុប</th>
                    </tr>
                </thead>
                <tbody>
                    ${rowsHTML}
                </tbody>
                <tfoot style="display: table-footer-group;">
                    <tr style="background-color: #f8fafc; page-break-inside: avoid;">
                        <td colspan="3" style="padding: 12px; text-align: right; font-weight: bold; border: 1px solid #cbd5e1;">ការចំណាយសរុបរួម:</td>
                        <td style="padding: 12px; text-align: right; font-weight: bold; border: 1px solid #cbd5e1; color: #e11d48; font-size: 14px;">${formatCurrency(stats.value.totalCost)}</td>
                    </tr>
                </tfoot>
            </table>
            <div style="margin-top: 20px; text-align: right; font-size: 10px; color: #94a3b8; page-break-inside: avoid;">
                ព្រីននៅ: ${new Date().toLocaleString('en-GB')}
            </div>
        </div>
    `;
};

const downloadExcel = () => {
    exportProcessing.value = { active: true, message: 'កំពុងទាញយក Excel...' };
    try {
        const html = buildExportHTML(true);
        const blob = new Blob(['\ufeff', html], { type: 'application/vnd.ms-excel' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Stock_Report_${new Date().getTime()}.xls`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch(e) { 
        console.error(e); 
    } finally {
        setTimeout(() => { exportProcessing.value.active = false; }, 500);
    }
};

const printReport = () => {
    exportProcessing.value = { active: true, message: 'កំពុងរៀបចំទម្រង់ព្រីន...' };
    const contentHTML = buildExportHTML(false);
    
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute"; iframe.style.width = "0"; iframe.style.height = "0"; iframe.style.border = "none";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    // 🌟 កែសម្រួល CSS កុំឱ្យចេញទំព័រទទេ 🌟
    doc.write(`
        <html>
        <head>
            <title>Print Report</title>
            <link href="https://fonts.googleapis.com/css2?family=Battambang:wght@400;700;900&display=swap" rel="stylesheet">
            <style>
                @page { size: A4 portrait; margin: 10mm; } 
                html, body { height: auto; margin: 0 !important; padding: 0 !important; overflow: visible !important; background-color: white; font-family: 'Battambang', sans-serif; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                table { page-break-inside: auto; width: 100%; border-collapse: collapse; }
                tr { page-break-inside: avoid; page-break-after: auto; }
                thead { display: table-header-group; }
                tfoot { display: table-footer-group; }
                ::-webkit-scrollbar { display: none; }
            </style>
        </head>
        <body>${contentHTML}</body>
        </html>
    `);
    doc.close();

    iframe.contentWindow.document.fonts.ready.then(() => {
        setTimeout(() => { 
            iframe.contentWindow.focus(); 
            iframe.contentWindow.print(); 
            exportProcessing.value.active = false;
            setTimeout(() => { document.body.removeChild(iframe); }, 1000); 
        }, 500);
    });
};

const downloadPDF = async () => {
    exportProcessing.value = { active: true, message: 'កំពុងបង្កើតឯកសារ PDF (អាចចំណាយពេលបន្តិច)...' };
    try {
        printStaging.value.innerHTML = `<div id="pdf-target" style="width: 800px; background: white; padding: 15px; box-sizing: border-box;">${buildExportHTML(false)}</div>`;
        await nextTick(); 
        await document.fonts.ready; 
        await new Promise(r => setTimeout(r, 600)); 
        
        const targetElement = document.getElementById('pdf-target');
        const canvas = await html2canvas(targetElement, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = 210; 
        const pdfHeight = 297;
        const margin = 10;
        const printWidth = pdfWidth - (margin * 2); 
        const printHeight = pdfHeight - (margin * 2);
        
        const imgHeight = (canvas.height * printWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = margin; // ចាប់ផ្តើមពីគម្លាតផ្នែកខាងលើ

        // 🌟 គូរទំព័រទី ១
        pdf.addImage(imgData, 'JPEG', margin, position, printWidth, imgHeight);
        heightLeft -= printHeight;

        // គូសប្រអប់សបាំង Margin ខាងក្រោម ដើម្បីកុំឱ្យអក្សរលៀន
        pdf.setFillColor(255, 255, 255);
        pdf.rect(0, pdfHeight - margin, pdfWidth, margin, 'F');

        // 🌟 Loop បង្កើតទំព័រថ្មីរហូតអស់ទិន្នន័យ
        while (heightLeft > 0) {
            position = position - printHeight; // រុញរូបភាពឡើងលើតាមកម្ពស់ទំព័រ
            pdf.addPage();
            pdf.addImage(imgData, 'JPEG', margin, position, printWidth, imgHeight);
            
            // គូសប្រអប់សបាំង Margin លើនិងក្រោម រាល់ពេលមានទំព័រថ្មី
            pdf.setFillColor(255, 255, 255);
            pdf.rect(0, 0, pdfWidth, margin, 'F'); 
            pdf.rect(0, pdfHeight - margin, pdfWidth, margin, 'F');

            heightLeft -= printHeight;
        }

        pdf.save(`Stock_Report_${new Date().getTime()}.pdf`);
        
    } catch(e) { 
        console.error(e); 
        notification.error("បរាជ័យក្នុងការទាញយក PDF");
    } finally { 
        exportProcessing.value.active = false;
        printStaging.value.innerHTML = '';
    }
};  

onMounted(async () => {
    loadFromCache();
    if (localCache.value.length === 0) {
        await syncNewData();
    }
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