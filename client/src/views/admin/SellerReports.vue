<template>
  <div class="print-container">
    <div class="font-khmer h-[100dvh] flex flex-col relative bg-[#F4F7FE] overflow-hidden print:hidden">
      
      <div class="bg-white px-4 md:px-8 pt-4 pb-0 border-b border-slate-200/60 flex items-center gap-6 shadow-sm relative z-50">
          <button @click="mainTab = 'analytics'" class="pb-3 text-sm font-black border-b-2 transition-all" :class="mainTab === 'analytics' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'">
              📊 របាយការណ៍សរុប (Analytics)
          </button>
          <button @click="mainTab = 'today'" class="pb-3 text-sm font-black border-b-2 transition-all flex items-center gap-1.5" :class="mainTab === 'today' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'">
              📝 ព័ត៌មានលក់ថ្ងៃនេះ 
              <span class="bg-rose-500 text-white text-[9px] px-1.5 py-0.5 rounded-full animate-pulse">Live</span>
          </button>
      </div>

      <div v-if="mainTab === 'today'" class="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8">
          <div class="max-w-[90rem] mx-auto w-full">
              <TodaySalesList @triggerAlert="triggerAlert" />
          </div>
      </div>

      <div v-show="mainTab === 'analytics'" class="flex-1 flex flex-col overflow-hidden">
          
          <div class="flex-none bg-white/80 backdrop-blur-2xl border-b border-slate-200/60 z-40 transition-all shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
            <div class="px-4 md:px-8 py-4 md:py-5">
              <div class="flex flex-col xl:flex-row xl:items-center justify-between gap-5 mb-5">
                <div class="flex items-center gap-4">
                   <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white shrink-0">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012-2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                   </div>
                   <div>
                     <h1 class="text-2xl md:text-3xl font-black text-slate-800 tracking-tight leading-tight">របាយការណ៍លក់</h1>
                     <p class="text-slate-500 text-[11px] md:text-xs font-bold uppercase tracking-wider mt-0.5">Sales Analytics Center</p>
                   </div>
                </div>

                <div class="bg-slate-100/80 p-1.5 rounded-2xl flex overflow-x-auto no-scrollbar w-full xl:w-auto shadow-inner border border-slate-200/50 shrink-0">
                   <button v-for="tab in filterTabs" :key="tab.key" @click="handleTabClick(tab.key)" class="flex-1 xl:flex-none px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all duration-300 whitespace-nowrap relative" :class="dateFilterType === tab.key ? 'text-indigo-600 shadow-md bg-white' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'">
                     {{ tab.label }}
                   </button>
                </div>
              </div>

              <div class="flex flex-wrap items-center gap-3 animate-fade-in min-h-[42px]">
                  <div v-if="isLoading" class="text-xs text-indigo-500 font-bold flex items-center gap-2 bg-indigo-50 px-4 py-2.5 rounded-xl border border-indigo-100">
                      <div class="w-4 h-4 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                      កំពុងទាញយកទិន្នន័យ...
                  </div>
                  
                  <template v-else>
                      <div v-if="dateFilterType === 'daily'" class="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm w-full sm:w-auto">
                         <span class="text-slate-400 text-[10px] font-black uppercase tracking-wider">Date</span>
                         <input v-model="selectedDate" type="date" class="w-full bg-transparent border-none text-slate-700 font-bold text-sm focus:ring-0 outline-none p-0 cursor-pointer" />
                      </div>

                      <div v-if="dateFilterType === 'monthly'" class="flex gap-2 w-full sm:w-auto">
                         <select v-model="selectedMonth" class="bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm cursor-pointer min-w-[140px]">
                            <option v-for="m in availableMonths" :key="m.index" :value="m.index">{{ m.name }}</option>
                         </select>
                         <select v-model="selectedYear" class="bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm cursor-pointer">
                            <option v-for="y in availableYears" :key="y" :value="y">{{ y }}</option>
                         </select>
                      </div>

                      <div v-if="dateFilterType === 'yearly'" class="relative group w-full sm:w-auto">
                         <select v-model="selectedYear" class="bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm cursor-pointer min-w-[120px]">
                            <option v-for="y in availableYears" :key="y" :value="y">{{ y }}</option>
                         </select>
                      </div>

                       <div v-if="dateFilterType === 'custom'" class="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm w-full sm:w-auto">
                         <input v-model="customStart" type="date" class="w-full flex-1 bg-transparent border-none text-slate-700 font-bold text-sm focus:ring-0 outline-none p-0 cursor-pointer" />
                         <div class="w-4 h-px bg-slate-300"></div>
                         <input v-model="customEnd" type="date" class="w-full flex-1 bg-transparent border-none text-slate-700 font-bold text-sm focus:ring-0 outline-none p-0 cursor-pointer" />
                      </div>
                  </template>
              </div>
            </div>
          </div>

          <div class="flex-1 overflow-y-auto custom-scrollbar scroll-smooth relative pb-40">
             <div class="px-4 md:px-8 py-6 max-w-[90rem] mx-auto w-full">
               
               <ReportStatsCards 
                  :grand-totals="grandTotals" 
                  :active-category="activeCategory" 
                  :active-sellers-count="activeSellersCount" 
                  :available-units="availableUnits" 
               />

               <div class="flex flex-col lg:flex-row justify-between items-end lg:items-center gap-4 mb-6 mt-8">
                  
                  <div class="flex flex-col w-full lg:w-auto gap-2">
                     <h3 class="text-lg font-black text-slate-800 flex items-center gap-2">
                         បញ្ជីតំណាងលក់ 
                         <span class="text-xs font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-lg">{{ filteredSellers.length }} នាក់</span>
                     </h3>
                     
                     <div class="relative w-full lg:w-80">
                        <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </span>
                        <input v-model="searchQuery" type="text" placeholder="ស្វែងរកឈ្មោះ ឬ អត្តលេខ..." class="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all shadow-sm" />
                     </div>
                  </div>
                  
                  <div class="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                     
                     <div class="bg-slate-200/50 p-1.5 rounded-xl flex shadow-inner border border-slate-200">
                        <button @click="activeCategory = 'all'" class="px-4 py-1.5 rounded-lg text-xs font-bold transition-all" :class="activeCategory === 'all' ? 'bg-white text-slate-800 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'">ទាំងអស់</button>
                        <button @click="activeCategory = 'បោះដុំ'" class="px-4 py-1.5 rounded-lg text-xs font-bold transition-all" :class="activeCategory === 'បោះដុំ' ? 'bg-white text-purple-700 shadow-sm ring-1 ring-purple-200' : 'text-slate-500 hover:text-purple-700'">បោះដុំ</button>
                        <button @click="activeCategory = 'លក់រាយ'" class="px-4 py-1.5 rounded-lg text-xs font-bold transition-all" :class="activeCategory === 'លក់រាយ' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-indigo-200' : 'text-slate-500 hover:text-indigo-600'">លក់រាយ</button>
                     </div>

                     <div class="bg-slate-200/50 p-1.5 rounded-xl flex shadow-inner border border-slate-200">
                        <button @click="activityFilter = 'all'" class="px-4 py-1.5 rounded-lg text-xs font-bold transition-all" :class="activityFilter === 'all' ? 'bg-white text-slate-800 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'">សកម្មភាព</button>
                        <button @click="activityFilter = 'active'" class="px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5" :class="activityFilter === 'active' ? 'bg-white text-emerald-600 shadow-sm ring-1 ring-emerald-100' : 'text-slate-500 hover:text-emerald-600'"><span class="w-1.5 h-1.5 rounded-full" :class="activityFilter === 'active' ? 'bg-emerald-500' : 'bg-slate-300'"></span> លក់បាន</button>
                     </div>

                     <div class="bg-slate-200/50 p-1.5 rounded-xl flex shadow-inner border border-slate-200 hidden sm:flex">
                        <button @click="viewMode = 'list'" class="p-1.5 rounded-lg transition-all" :class="viewMode === 'list' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-700'" title="List View">
                           <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6h16M4 12h16M4 18h16"/></svg>
                        </button>
                        <button @click="viewMode = 'card'" class="p-1.5 rounded-lg transition-all" :class="viewMode === 'card' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-700'" title="Card View">
                           <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
                        </button>
                     </div>

                     <div class="flex gap-2">
                        <button @click="executeNativePrint" :disabled="processing.active || filteredSellers.length === 0" class="bg-slate-800 hover:bg-slate-900 text-white border border-slate-800 px-4 py-2 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 font-bold text-xs shadow-sm disabled:opacity-50">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2-2v4h10z"></path></svg>
                            <span>Print</span>
                        </button>
                        <button @click="generatePDF" :disabled="processing.active || filteredSellers.length === 0" class="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 px-4 py-2 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 font-bold text-xs disabled:opacity-50">
                            <svg v-if="processing.active" class="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            <span>PDF</span>
                        </button>
                     </div>
                  </div>
               </div>

               <div v-if="isLoading" class="flex flex-col items-center justify-center py-24 opacity-60">
                  <div class="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-indigo-600 mb-4"></div>
                  <p class="text-slate-500 font-bold tracking-wide">កំពុងទាញយកទិន្នន័យ...</p>
               </div>

               <div v-else-if="paginatedData.length === 0" class="flex flex-col items-center justify-center py-24 bg-white/50 backdrop-blur-sm rounded-[2rem] border-2 border-dashed border-slate-200">
                  <div class="w-20 h-20 bg-white shadow-sm rounded-full flex items-center justify-center mb-4 text-slate-300">
                     <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                  </div>
                  <p class="text-slate-600 font-bold text-lg">មិនមានទិន្នន័យទេ</p>
                  <p class="text-slate-400 text-sm mt-1">សូមសាកល្បងប្តូរការស្វែងរក ឬកាលបរិច្ឆេទ</p>
               </div>

               <div v-else class="flex flex-col gap-6">
                  
                  <SellerDataView 
                      :data="paginatedData"
                      :view-mode="viewMode"
                      :start-index="(currentPage - 1) * itemsPerPage"
                      :available-units="availableUnits"
                  />

                  <div v-if="totalPages > 1" class="flex flex-col sm:flex-row items-center justify-between bg-white px-6 py-4 rounded-[1.5rem] border border-slate-200 shadow-sm mt-2 gap-4">
                      <p class="text-xs font-bold text-slate-500">
                          កំពុងបង្ហាញ <span class="text-slate-800">{{ ((currentPage - 1) * itemsPerPage) + 1 }}</span> ដល់ <span class="text-slate-800">{{ Math.min(currentPage * itemsPerPage, filteredSellers.length) }}</span> នៃ <span class="text-indigo-600">{{ filteredSellers.length }}</span> តំណាងលក់
                      </p>
                      
                      <div class="flex items-center gap-2">
                         <button @click="currentPage--" :disabled="currentPage === 1" class="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1" :class="currentPage === 1 ? 'text-slate-400 bg-slate-50 cursor-not-allowed' : 'text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm'">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg> មុន
                         </button>
                         
                         <span class="px-4 py-2 text-xs font-black text-slate-700 bg-slate-50 rounded-xl border border-slate-100">
                            ទំព័រ {{ currentPage }} / {{ totalPages }}
                         </span>

                         <button @click="currentPage++" :disabled="currentPage === totalPages" class="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1" :class="currentPage === totalPages ? 'text-slate-400 bg-slate-50 cursor-not-allowed' : 'text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm'">
                            បន្ទាប់ <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                         </button>
                      </div>
                  </div>
               </div>

             </div>
          </div>

          <ReportBottomSummary 
              :grand-totals="grandTotals" 
              :activity-filter="activityFilter" 
              :displayed-data-length="filteredSellers.length" 
              :available-units="availableUnits" 
          />
      </div>

    </div>

    <div ref="printStaging" class="fixed top-0 left-[-9999px] pointer-events-none z-[-1]"></div>

    <transition enter-active-class="duration-300 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="processing.active" class="fixed inset-0 z-[999999] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
            <div class="w-full max-w-sm bg-[#18181b] border border-white/10 rounded-3xl p-10 shadow-2xl relative flex flex-col items-center text-center animate-fade-in-up">
                <div class="relative w-20 h-20 mb-8">
                    <div class="absolute inset-0 rounded-full border-4 border-white/5"></div>
                    <div class="absolute inset-0 rounded-full border-4 border-t-rose-500 border-r-rose-500 border-b-transparent border-l-transparent animate-spin"></div>
                    <div class="absolute inset-0 flex items-center justify-center font-bold text-white text-lg font-mono">{{ processing.progress }}%</div>
                </div>
                <h3 class="text-xl font-bold text-white mb-2">{{ processing.message }}</h3>
                <div class="w-full h-1.5 bg-black/50 rounded-full overflow-hidden border border-white/5">
                    <div class="h-full bg-gradient-to-r from-red-500 to-rose-600 transition-all duration-300 ease-out" :style="{ width: `${processing.progress}%` }"></div>
                </div>
            </div>
        </div>
    </transition>

    <CustomAlert v-if="alert.show" :type="alert.type" :title="alert.title" :message="alert.message" @close="alert.show = false" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch, nextTick } from 'vue';
import { db, auth } from '@/firebaseConfig';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

// 📦 Import Child Components
import CustomAlert from '../../components/shared/CustomAlert.vue';
import SellerDataView from './reports/SellerDataView.vue'; 
import ReportStatsCards from './reports/ReportStatsCards.vue'; 
import ReportBottomSummary from './reports/ReportBottomSummary.vue';
import TodaySalesList from './reports/pos/POSTodaySales.vue'; 

// --- STATE ---
const mainTab = ref('analytics'); // 'analytics' | 'today'
const isLoading = ref(true);
const sellersList = ref([]);
const allSales = ref([]); 
const availableUnits = ref([]); 
const printStaging = ref(null);
const processing = ref({ active: false, message: '', progress: 0 });

const alert = reactive({ show: false, title: '', message: '', type: 'success' });
const triggerAlert = (type, title, message) => { alert.type = type; alert.title = title; alert.message = message; alert.show = true; setTimeout(() => alert.show = false, 3000); };

// HELPER FOR LOCAL DATES
const getTodayString = () => { const today = new Date(); return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`; };

// 🎛️ FILTERS & TOGGLES STATE 🎛️
const dateFilterType = ref('monthly'); 
const activeCategory = ref('all'); 
const activityFilter = ref('all'); 
const selectedDate = ref(getTodayString()); 
const selectedYear = ref(new Date().getFullYear());
const selectedMonth = ref(new Date().getMonth());
const customStart = ref(getTodayString());
const customEnd = ref(getTodayString());

// 🔍 SEARCH & PAGINATION STATE 🔍
const searchQuery = ref('');
const viewMode = ref('list'); 
const currentPage = ref(1);
const itemsPerPage = ref(40);

const handleTabClick = (key) => { dateFilterType.value = key; if (key === 'daily') selectedDate.value = getTodayString(); };

const filterTabs = [
 { key: 'daily', label: 'ប្រចាំថ្ងៃ' }, { key: 'monthly', label: 'ប្រចាំខែ' }, { key: 'yearly', label: 'ប្រចាំឆ្នាំ' }, { key: 'custom', label: 'កំណត់ថ្ងៃ' },
];
const monthNames = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'];

// Reset Page to 1 when filters change
watch([searchQuery, activeCategory, activityFilter, dateFilterType, selectedMonth, selectedYear], () => {
    currentPage.value = 1;
});

// --- FETCH DATA ---
onMounted(() => {
 onAuthStateChanged(auth, async (user) => {
  if (user) {
   try {
     const userDoc = await getDoc(doc(db, "users", user.uid));
     const role = userDoc.exists() ? userDoc.data().role : 'user';

     let sellerQ = role === 'admin' 
        ? query(collection(db, 'users'), where('role', 'in', ['seller', 'dealer']), where('createdBy', '==', user.uid))
        : query(collection(db, 'users'), where('role', 'in', ['seller', 'dealer']));

     const sellerSnap = await getDocs(sellerQ);
     sellersList.value = sellerSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter(s => s.isDeleted === false || !s.isDeleted);

     const unitSnap = await getDocs(collection(db, 'settings_units'));
     availableUnits.value = unitSnap.docs.map(doc => doc.data());

     const salesQ = query(collection(db, 'sales_reports'), where('createdBy', '==', user.uid));
     const salesSnap = await getDocs(salesQ);
     
     let flatSales = [];
     salesSnap.docs.forEach(doc => {
         const data = doc.data();
         if (data.items && Array.isArray(data.items)) {
             data.items.forEach((item, index) => {
                 let typeStr = String(item.type || '');
                 let isWholesale = typeStr.includes('បោះដុំ');

                 flatSales.push({
                     ...data,                     
                     id: `${doc.id}_${index}`,    
                     category: isWholesale ? 'បោះដុំ' : 'លក់រាយ', // Fix Category Logic based on UI Labels
                     totalSold: Number(item.qty),
                     unit: item.unit,
                     totalPrice: Number(item.price) * Number(item.qty),
                     productName: item.name, 
                     totalClients: index === 0 ? 1 : 0 
                 });
             });
         }
     });

     allSales.value = flatSales.sort((a,b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));

   } catch (error) {
     console.error("Error fetching data", error);
   } finally {
     isLoading.value = false;
   }
  }
 });
});

// --- DYNAMIC DATES ---
const getValidDateStr = (sale) => sale.createdAt || sale.date;

const availableYears = computed(() => {
  const validSales = allSales.value.filter(s => getValidDateStr(s));
  if (validSales.length === 0) return [new Date().getFullYear()];
  const years = new Set(validSales.map(s => new Date(getValidDateStr(s)).getFullYear()));
  return Array.from(years).sort((a, b) => b - a);
});

const availableMonths = computed(() => {
  const validSales = allSales.value.filter(s => getValidDateStr(s));
  if (validSales.length === 0) return [{ index: new Date().getMonth(), name: monthNames[new Date().getMonth()] }];
  const yearSales = validSales.filter(s => new Date(getValidDateStr(s)).getFullYear() === parseInt(selectedYear.value));
  const months = new Set(yearSales.map(s => new Date(getValidDateStr(s)).getMonth()));
  return Array.from(months).sort((a, b) => a - b).map(mIndex => ({ index: mIndex, name: monthNames[mIndex] }));
});

watch(selectedYear, () => {
  const months = availableMonths.value;
  if (!months.find(m => m.index === selectedMonth.value) && months.length > 0) selectedMonth.value = months[months.length - 1].index;
});

const isDateInScope = (dateStr) => {
 if (!dateStr) return false;
 const date = new Date(dateStr);
 const localDateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

 if (dateFilterType.value === 'daily') return localDateStr === selectedDate.value;
 if (dateFilterType.value === 'monthly') return date.getMonth() === parseInt(selectedMonth.value) && date.getFullYear() === parseInt(selectedYear.value);
 if (dateFilterType.value === 'yearly') return date.getFullYear() === parseInt(selectedYear.value);
 if (dateFilterType.value === 'custom') return localDateStr >= customStart.value && localDateStr <= customEnd.value;
 return false;
};

// --- BASE DATA CALCULATION ---
const baseCalculatedData = computed(() => {
 if (sellersList.value.length === 0) return [];
 let rows = [];

 sellersList.value.forEach(seller => {
   const relevantSales = allSales.value.filter(s => (s.sellerId === seller.id || s.uid === seller.id) && isDateInScope(getValidDateStr(s)));

   const retailSales = relevantSales.filter(s => (s.category || 'លក់រាយ') === 'លក់រាយ');
   const wholesaleSales = relevantSales.filter(s => s.category === 'បោះដុំ');

   const createRow = (catName, salesList) => {
       let totalClients = 0; let revenueUSD = 0; let revenueKHR = 0; let unitCounts = {}; 
       let productsSet = new Set(); 
       let productAgg = {};

       salesList.forEach(sale => {
        const u = (sale.unit || 'unknown').toLowerCase().trim();
        if (!unitCounts[u]) unitCounts[u] = 0;
        unitCounts[u] += Number(sale.totalSold || 0);
        totalClients += Number(sale.totalClients || 0);
        if (sale.currency === 'USD' || sale.currency === '$') revenueUSD += Number(sale.totalPrice || 0);
        else revenueKHR += Number(sale.totalPrice || 0);
        
        if (sale.productName) {
            productsSet.add(sale.productName);
            let pName = sale.productName;
            let pUnit = sale.unit || '';
            let pKey = `${pName}_${pUnit}`;

            if (!productAgg[pKey]) {
                productAgg[pKey] = { name: pName, unit: pUnit, qty: 0 };
            }
            productAgg[pKey].qty += Number(sale.totalSold || 0);
        }
       });

       rows.push({ 
           ...seller, 
           uniqueId: `${seller.id}_${catName === 'all' ? 'none' : catName}`, 
           originalSellerId: seller.id, 
           category: catName,
           unitCounts, 
           totalClients, 
           revenueUSD, 
           revenueKHR, 
           hasSales: salesList.length > 0,
           productNames: Array.from(productsSet),
           productsList: Object.values(productAgg)
       });
   };

   if (activeCategory.value === 'all') {
       if (relevantSales.length > 0) createRow('សរុបរួម', relevantSales);
       else createRow('-', []); 
   } else if (activeCategory.value === 'លក់រាយ') {
       if (retailSales.length > 0) createRow('លក់រាយ', retailSales);
   } else if (activeCategory.value === 'បោះដុំ') {
       if (wholesaleSales.length > 0) createRow('បោះដុំ', wholesaleSales);
   }
 });

 return rows.sort((a, b) => (b.revenueUSD + (b.revenueKHR/4000)) - (a.revenueUSD + (a.revenueKHR/4000))); 
});

// --- FILTER & SEARCH ---
const filteredSellers = computed(() => {
  let result = baseCalculatedData.value;
  
  if (activityFilter.value === 'active') result = result.filter(s => s.hasSales);
  if (activityFilter.value === 'inactive') result = result.filter(s => !s.hasSales);

  if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim();
      result = result.filter(s => 
          (s.fullName && s.fullName.toLowerCase().includes(q)) || 
          (s.idNumber && s.idNumber.toLowerCase().includes(q))
      );
  }

  return result;
});

// --- ITEMIZED SUMMARY (សម្រាប់ PDF) ---
const itemizedSummary = computed(() => {
    let summary = { retail: {}, wholesale: {} };
    const activeSellerIds = new Set(filteredSellers.value.map(s => s.originalSellerId));

    allSales.value.forEach(sale => {
        if (!isDateInScope(getValidDateStr(sale))) return;
        if (!activeSellerIds.has(sale.sellerId) && !activeSellerIds.has(sale.uid)) return;

        const isWholesale = sale.category === 'បោះដុំ';
        if (activeCategory.value !== 'all') {
            if (activeCategory.value === 'លក់រាយ' && isWholesale) return;
            if (activeCategory.value === 'បោះដុំ' && !isWholesale) return;
        }

        const targetGroup = isWholesale ? summary.wholesale : summary.retail;
        
        const qty = Number(sale.totalSold) || 0;
        const total = Number(sale.totalPrice) || 0;
        const unitPrice = qty > 0 ? (total / qty) : 0;
        const currency = sale.currency === 'KHR' || sale.currency === '៛' ? 'KHR' : 'USD';
        
        const key = `${sale.productName}_${sale.unit}_${unitPrice}_${currency}`;

        if (!targetGroup[key]) {
            targetGroup[key] = {
                name: sale.productName || 'Unknown',
                unit: sale.unit || 'unit',
                unitPrice: unitPrice,
                currency: currency,
                qty: 0,
                total: 0
            };
        }

        targetGroup[key].qty += qty;
        targetGroup[key].total += total;
    });

    const toArray = (obj) => Object.values(obj).sort((a, b) => b.total - a.total);
    return {
        retail: toArray(summary.retail),
        wholesale: toArray(summary.wholesale)
    };
});

// --- PAGINATION ---
const totalPages = computed(() => Math.ceil(filteredSellers.value.length / itemsPerPage.value) || 1);

const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return filteredSellers.value.slice(start, end);
});

// --- STATS ---
const activeSellersCount = computed(() => new Set(baseCalculatedData.value.filter(s => s.hasSales).map(s => s.originalSellerId)).size);

const grandTotals = computed(() => {
    let stats = { all: { usd: 0, khr: 0, clients: 0, totalUnitsCount: 0, units: {} }, retail: { usd: 0, khr: 0, clients: 0, totalUnitsCount: 0, units: {} }, wholesale: { usd: 0, khr: 0, clients: 0, totalUnitsCount: 0, units: {} } };
    
    // We compute this from flatSales to be extremely accurate, independent of the combined row logic
    allSales.value.forEach(sale => {
        const isWholesale = sale.category === 'បោះដុំ';
        if (!isDateInScope(getValidDateStr(sale))) return;
        
        // Only count if seller is currently active in the view
        const activeSellerIds = new Set(filteredSellers.value.map(s => s.originalSellerId));
        if (!activeSellerIds.has(sale.sellerId) && !activeSellerIds.has(sale.uid)) return;

        const cat = isWholesale ? 'wholesale' : 'retail';
        const usdVal = (sale.currency === 'USD' || sale.currency === '$') ? Number(sale.totalPrice || 0) : 0;
        const khrVal = (sale.currency === 'KHR' || sale.currency === '៛') ? Number(sale.totalPrice || 0) : 0;
        const qty = Number(sale.totalSold || 0);
        const unit = (sale.unit || 'unknown').toLowerCase().trim();
        const clientVal = Number(sale.totalClients || 0);

        stats.all.usd += usdVal; stats.all.khr += khrVal; stats.all.clients += clientVal;
        stats[cat].usd += usdVal; stats[cat].khr += khrVal; stats[cat].clients += clientVal;
        
        if (qty > 0) {
            stats.all.units[unit] = (stats.all.units[unit] || 0) + qty; stats.all.totalUnitsCount += qty;
            stats[cat].units[unit] = (stats[cat].units[unit] || 0) + qty; stats[cat].totalUnitsCount += qty;
        }
    });

    return stats;
});

const reportDateLabel = computed(() => {
    let dateStr = '';
    if (dateFilterType.value === 'daily') dateStr = new Intl.DateTimeFormat('km-KH', { dateStyle: 'long' }).format(new Date(selectedDate.value));
    if (dateFilterType.value === 'monthly') dateStr = `ខែ ${monthNames[selectedMonth.value]} ឆ្នាំ ${selectedYear.value}`;
    if (dateFilterType.value === 'yearly') dateStr = `ឆ្នាំ ${selectedYear.value}`;
    if (dateFilterType.value === 'custom') dateStr = `${selectedDateFormatter(customStart.value)} ដល់ ${selectedDateFormatter(customEnd.value)}`;
    return `${dateStr} - ${activeCategory.value === 'all' ? 'សរុប (All)' : activeCategory.value}`;
});

const selectedDateFormatter = (dateStr) => {
    if(!dateStr) return '';
    return new Intl.DateTimeFormat('km-KH', { dateStyle: 'medium' }).format(new Date(dateStr));
};

// ---------------------------------------------------------
// 🖨️ PRINT & PDF LOGIC 🖨️
// ---------------------------------------------------------

const formatCurrency = (val, curr) => Number(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + (curr === 'USD' ? ' $' : ' ៛');

const executeNativePrint = () => {
    const dataWithIndex = filteredSellers.value.map((item, idx) => ({ ...item, printIndex: idx + 1 }));
    const contentHTML = generatePageHTML(dataWithIndex, 1, 1, true);

    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute'; iframe.style.width = '0'; iframe.style.height = '0'; iframe.style.border = 'none';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
        <html>
        <head>
            <title>Sales_Report_${dateFilterType.value}</title>
            <link href="https://fonts.googleapis.com/css2?family=Battambong:wght@400;700;900&family=Kantumruy+Pro:wght@400;700&display=swap" rel="stylesheet">
            <style>
                @page { size: A4 portrait; margin: 0; }
                body { font-family: 'Battambong', 'Kantumruy Pro', sans-serif; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; margin: 0; padding: 15mm; background-color: white; }
                table { width: 100%; border-collapse: collapse; }
                tr    { page-break-inside: avoid; page-break-after: auto; }
                thead { display: table-header-group; }
                tfoot { display: table-footer-group; }
            </style>
        </head>
        <body>${contentHTML}</body>
        </html>
    `);
    doc.close();

    iframe.contentWindow.document.fonts.ready.then(() => {
        iframe.contentWindow.focus(); iframe.contentWindow.print();
        setTimeout(() => { document.body.removeChild(iframe); }, 1000);
    });
};

const generatePDF = async () => {
    processing.value = { active: true, message: 'កំពុងបំបែកទិន្នន័យ...', progress: 10 };
    
    try {
        const pages = [];
        let currentPage = [];
        
        const MAX_PAGE_HEIGHT = 1250; 
        const PAGE_TITLE_HEIGHT = 150; 
        const TABLE_HEADER_HEIGHT = 65;
        
        let itemizedRowsCount = itemizedSummary.value.retail.length + itemizedSummary.value.wholesale.length;
        let tableHeadersCount = (itemizedSummary.value.retail.length > 0 ? 1 : 0) + (itemizedSummary.value.wholesale.length > 0 ? 1 : 0);
        let FOOTER_HEIGHT = 180 + (tableHeadersCount * 60) + (itemizedRowsCount * 35);

        let currentHeight = PAGE_TITLE_HEIGHT + TABLE_HEADER_HEIGHT; 
        let rowCounter = 1;
        let allRows = [...filteredSellers.value];

        for (let i = 0; i < allRows.length; i++) {
            let row = allRows[i];
            let unitCount = row.hasSales && row.unitCounts ? Object.values(row.unitCounts).filter(c => c > 0).length : 0;
            let rowHeight = 90 + (Math.ceil(unitCount / 2) * 45); 

            if (currentHeight + rowHeight > MAX_PAGE_HEIGHT && currentPage.length > 0) {
                pages.push(currentPage);
                currentPage = [];
                currentHeight = 60 + TABLE_HEADER_HEIGHT; 
            }
            
            currentPage.push({ ...row, printIndex: rowCounter++ });
            currentHeight += rowHeight;
        }

        if (currentHeight + FOOTER_HEIGHT > MAX_PAGE_HEIGHT) {
            if (currentPage.length > 1) {
                let stolenRow = currentPage.pop();
                pages.push(currentPage);
                currentPage = [stolenRow]; 
            } else if (currentPage.length === 1) {
                pages.push(currentPage);
                currentPage = []; 
            }
        }
        
        if (currentPage.length === 0 && pages.length > 0) {
            let prevPage = pages[pages.length - 1];
            if (prevPage.length > 1) {
                let stolenRow = prevPage.pop();
                currentPage.push(stolenRow);
            }
        }

        if (currentPage.length > 0 || allRows.length === 0) pages.push(currentPage);

        const pdf = new jsPDF('p', 'mm', 'a4'); 
        const pdfWidth = 210; 
        const pdfHeightA4 = 297; 
        
        for (let i = 0; i < pages.length; i++) {
            processing.value.message = `កំពុងថតចម្លងទំព័រទី ${i+1} នៃ ${pages.length}...`;
            printStaging.value.innerHTML = generatePageHTML(pages[i], i + 1, pages.length, false);
            
            await nextTick(); 
            await document.fonts.ready;
            await new Promise(r => setTimeout(r, 600)); 

            const canvas = await html2canvas(printStaging.value.querySelector('.print-page'), { 
                scale: 2, useCORS: true, logging: false, backgroundColor: "#ffffff", windowWidth: 1000
            });
            
            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            if (i > 0) pdf.addPage();
            
            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeightA4);
            processing.value.progress = 10 + Math.round(((i + 1) / pages.length) * 80);
        }

        processing.value.message = 'កំពុងរក្សាទុកឯកសារ...';
        processing.value.progress = 100;
        pdf.save(`Sales_Report_${dateFilterType.value}.pdf`);
        
    } catch(e) {
        console.error(e);
        triggerAlert('error', 'បរាជ័យ', 'មិនអាចទាញយក PDF បានទេ');
    } finally {
        if(printStaging.value) printStaging.value.innerHTML = '';
        processing.value.active = false;
    }
};

const generatePageHTML = (rows, pageNum, totalPages, isNativePrint = false) => {
    let normalRows = rows;
    let lastRow = null;

    if (isNativePrint && rows.length > 0) {
        normalRows = rows.slice(0, rows.length - 1);
        lastRow = rows[rows.length - 1];
    }

    const renderRow = (item) => {
        let salesHTML = '';
        if (item.hasSales) {
            salesHTML = `<div style="overflow: hidden;">` + 
                Object.entries(item.unitCounts || {}).filter(([u, c]) => c > 0).map(([u, c]) => 
                    `<div style="display: inline-block; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 3px 6px; margin: 0 4px 4px 0;">
                        <span style="font-weight: 900; color: #1e293b; font-size: 11px;">${c.toLocaleString()}</span>
                        <span style="color: #64748b; font-size: 10px; font-weight: bold; margin-left: 2px;">${translateUnit(u)}</span>
                     </div>`
                ).join('') + `</div>`;
        } else {
            salesHTML = `<span style="font-size: 11px; font-weight: bold; color: #94a3b8;">-</span>`;
        }

        // បង្ហាញឈ្មោះទំនិញភ្ជាប់ជាមួយចំនួនលក់
        let productsHTML = '';
        if (item.hasSales && item.productsList && item.productsList.length > 0) {
            productsHTML = `<div style="overflow: hidden;">` + 
                item.productsList.map(p => 
                    `<div style="display: inline-block; color: #4338ca; background-color: #eef2ff; border: 1px solid #e0e7ff; padding: 3px 6px; border-radius: 4px; font-size: 9px; margin: 0 4px 4px 0;">
                        <strong style="font-weight: 900;">${p.name}</strong> <span style="color: #6366f1;">• ${p.qty} ${translateUnit(p.unit)}</span>
                    </div>`
                ).join('') + `</div>`;
        } else {
            productsHTML = `<span style="font-size: 11px; font-weight: bold; color: #94a3b8;">-</span>`;
        }

        let revenueHTML = '';
        if (item.hasSales) {
            revenueHTML = `
                <div style="text-align: right;">
                    <span style="color:#059669; font-size:14px; font-weight:900; background: #ecfdf5; padding: 2px 6px; border-radius: 4px; display: inline-block;">${item.revenueUSD.toLocaleString()} $</span><br/>
                    <span style="color:#2563eb; font-size:10px; font-weight:bold; padding-right: 2px; display: inline-block; margin-top: 3px;">${item.revenueKHR.toLocaleString()} ៛</span>
                </div>`;
        } else {
            revenueHTML = `<div style="text-align: right; color:#94a3b8; font-weight:bold; font-size:12px;">-</div>`;
        }

        let catBadge = '';
        if (item.category === 'បោះដុំ') {
            catBadge = `<span style="background-color: #faf5ff; color: #7e22ce; border: 1px solid #e9d5ff; padding: 3px 6px; border-radius: 4px; font-size: 10px; font-weight: bold;">បោះដុំ</span>`;
        } else if (item.category === 'លក់រាយ') {
            catBadge = `<span style="background-color: #f8fafc; color: #475569; border: 1px solid #e2e8f0; padding: 3px 6px; border-radius: 4px; font-size: 10px; font-weight: bold;">លក់រាយ</span>`;
        } else if (item.category === 'សរុបរួម') {
            catBadge = `<span style="background-color: #f0fdf4; color: #166534; border: 1px solid #dcfce7; padding: 3px 6px; border-radius: 4px; font-size: 10px; font-weight: bold;">សរុបរួម</span>`;
        } else {
            catBadge = '-';
        }

        const dealerBadge = item.role === 'dealer' 
            ? `<span style="background-color: #fffbeb; color: #d97706; border: 1px solid #fde68a; padding: 1px 4px; border-radius: 3px; font-size: 8px; font-weight: 900; vertical-align: middle; margin-left: 4px;">DEALER</span>` 
            : '';

        return `
            <tr style="break-inside: avoid; page-break-inside: avoid; ${!item.hasSales ? 'background-color: #f8fafc;' : 'border-bottom: 1px solid #f1f5f9;'}">
                <td style="padding: 12px 8px; text-align: center; vertical-align: top; font-weight: 900; color: #94a3b8; font-size: 12px;">${item.printIndex}</td>
                <td style="padding: 12px 8px; vertical-align: top;">
                    <p style="font-weight: bold; color: #1e293b; font-size: 13px; margin: 0; display: flex; align-items: center;">
                        ${item.fullName} ${dealerBadge}
                    </p>
                    <p style="font-family: monospace; color: #64748b; font-size: 10px; margin: 2px 0 0 0;">ID: ${item.idNumber || 'N/A'}</p>
                </td>
                <td style="padding: 12px 8px; vertical-align: top; text-align: center;">${item.hasSales ? catBadge : '-'}</td>
                <td style="padding: 12px 8px; vertical-align: top;">${productsHTML}</td>
                <td style="padding: 12px 8px; vertical-align: top;">${salesHTML}</td>
                <td style="padding: 12px 8px; text-align: center; vertical-align: top; font-weight: bold; color: #334155; font-size: 12px;">
                    ${item.hasSales ? item.totalClients.toLocaleString() + ' នាក់' : '-'}
                </td>
                <td style="padding: 12px 8px; vertical-align: top;">${revenueHTML}</td>
            </tr>
        `;
    };

    const normalRowsHTML = normalRows.map(renderRow).join('');
    const lastRowHTML = lastRow ? renderRow(lastRow) : '';

    let summarySectionHTML = '';
    if (pageNum === totalPages || isNativePrint) {
        
        let retailHTML = '';
        if (itemizedSummary.value.retail.length > 0) {
            retailHTML = `
                <div style="margin-bottom: 20px;">
                    <h4 style="font-size: 13px; font-weight: 900; color: #475569; background: #f8fafc; padding: 6px 12px; border-left: 4px solid #6366f1; margin: 0 0 10px 0;">សរុបការលក់រាយ និងឈុត (Retail & Combo)</h4>
                    <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                        <thead style="background: #f1f5f9; border-bottom: 2px solid #cbd5e1; color: #475569;">
                            <tr>
                                <th style="padding: 8px; text-align: left;">មុខទំនិញ</th>
                                <th style="padding: 8px; text-align: center;">ចំនួន</th>
                                <th style="padding: 8px; text-align: right;">តម្លៃឯកតា (រាយ/ឈុត)</th>
                                <th style="padding: 8px; text-align: right;">តម្លៃសរុប</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemizedSummary.value.retail.map(item => `
                                <tr style="border-bottom: 1px dashed #e2e8f0;">
                                    <td style="padding: 8px; font-weight: bold; color: #1e293b;">${item.name}</td>
                                    <td style="padding: 8px; text-align: center; color: #475569;">${item.qty} ${translateUnit(item.unit)}</td>
                                    <td style="padding: 8px; text-align: right; color: #475569;">${formatCurrency(item.unitPrice, item.currency)}</td>
                                    <td style="padding: 8px; text-align: right; font-weight: bold; color: #059669;">${formatCurrency(item.total, item.currency)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }

        let wholesaleHTML = '';
        if (itemizedSummary.value.wholesale.length > 0) {
            wholesaleHTML = `
                <div style="margin-bottom: 20px;">
                    <h4 style="font-size: 13px; font-weight: 900; color: #475569; background: #f8fafc; padding: 6px 12px; border-left: 4px solid #8b5cf6; margin: 0 0 10px 0;">សរុបការបោះដុំ (Wholesale)</h4>
                    <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                        <thead style="background: #f1f5f9; border-bottom: 2px solid #cbd5e1; color: #475569;">
                            <tr>
                                <th style="padding: 8px; text-align: left;">មុខទំនិញ</th>
                                <th style="padding: 8px; text-align: center;">ចំនួន</th>
                                <th style="padding: 8px; text-align: right;">តម្លៃឯកតា (ដុំ)</th>
                                <th style="padding: 8px; text-align: right;">តម្លៃសរុប</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemizedSummary.value.wholesale.map(item => `
                                <tr style="border-bottom: 1px dashed #e2e8f0;">
                                    <td style="padding: 8px; font-weight: bold; color: #1e293b;">${item.name}</td>
                                    <td style="padding: 8px; text-align: center; color: #475569;">${item.qty} ${translateUnit(item.unit)}</td>
                                    <td style="padding: 8px; text-align: right; color: #475569;">${formatCurrency(item.unitPrice, item.currency)}</td>
                                    <td style="padding: 8px; text-align: right; font-weight: bold; color: #059669;">${formatCurrency(item.total, item.currency)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }

        summarySectionHTML = `
            <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #cbd5e1; break-inside: avoid; page-break-inside: avoid; width: 100%;">
                <h3 style="font-size: 18px; font-weight: 900; color: #1e293b; margin-bottom: 20px; text-align: center;">របាយការណ៍លម្អិតតាមមុខទំនិញ</h3>
                
                ${retailHTML}
                ${wholesaleHTML}

                <div style="margin-top: 20px; padding: 15px; background: #1e293b; border-radius: 12px; color: white; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 16px; font-weight: bold;">សរុបរួមទាំងអស់ (Grand Total)</span>
                    <div style="text-align: right;">
                        <span style="font-size: 24px; font-weight: 900; color: #10b981;">${grandTotals.value.all.usd.toLocaleString()} $</span>
                        ${grandTotals.value.all.khr > 0 ? `<br/><span style="font-size: 14px; font-weight: bold; color: #60a5fa;">${grandTotals.value.all.khr.toLocaleString()} ៛</span>` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    let finalContentHTML = '';
    
    const tableHeader = `
        <thead style="color: #334155; font-size: 11px; font-weight: 900; display: table-header-group;">
            <tr>
                <th style="padding: 12px 8px; width: 5%; text-align: center; border-bottom: 2px solid #cbd5e1;">#</th>
                <th style="padding: 12px 8px; width: 18%; border-bottom: 2px solid #cbd5e1;">តំណាងលក់</th>
                <th style="padding: 12px 8px; width: 8%; text-align: center; border-bottom: 2px solid #cbd5e1;">ប្រភេទ</th>
                <th style="padding: 12px 8px; width: 27%; border-bottom: 2px solid #cbd5e1;">មុខទំនិញ</th>
                <th style="padding: 12px 8px; width: 15%; border-bottom: 2px solid #cbd5e1;">បរិមាណលក់</th>
                <th style="padding: 12px 8px; width: 12%; text-align: center; border-bottom: 2px solid #cbd5e1;">អតិថិជន</th>
                <th style="padding: 12px 8px; width: 15%; text-align: right; border-bottom: 2px solid #cbd5e1;">ចំណូល</th>
            </tr>
        </thead>
    `;

    if (rows.length > 0) {
        if (isNativePrint) {
            finalContentHTML = `
                <table style="width: 100%; text-align: left; border-collapse: collapse; background-color: #ffffff;">
                    ${tableHeader}
                    <tbody>${normalRowsHTML}</tbody>
                    <tbody style="break-inside: avoid; page-break-inside: avoid;">
                        ${lastRowHTML}
                        <tr><td colspan="7" style="padding: 0; border: none;">${summarySectionHTML}</td></tr>
                    </tbody>
                </table>
            `;
        } else {
            finalContentHTML = `
                <table style="width: 100%; text-align: left; border-collapse: collapse; background-color: #ffffff;">
                    ${tableHeader}
                    <tbody>${normalRowsHTML}${lastRowHTML}</tbody>
                </table>
                ${summarySectionHTML}
            `;
        }
    } else {
        finalContentHTML = summarySectionHTML;
    }

    const pageStyles = isNativePrint
        ? `width: 100%; box-sizing: border-box; font-family: 'Battambong', 'Kantumruy Pro', sans-serif; line-height: 1.5; padding: 15px;`
        : `width: 1000px; height: 1414px; background: white; padding: 40px; box-sizing: border-box; display: flex; flex-direction: column; font-family: 'Battambong', 'Kantumruy Pro', sans-serif; line-height: 1.5; position: relative; overflow: hidden;`;

    const mainTitle = pageNum === 1 || isNativePrint 
        ? `<div style="text-align: center; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 3px solid #4f46e5;"><h1 style="font-size: 28px; font-weight: 900; color: #4338ca; margin: 0; text-align: center; width: 100%;">របាយការណ៍លក់សរុប</h1></div>` 
        : '';

    return `
        <div class="print-page" style="${pageStyles}">
            ${mainTitle}
            <div style="flex: 1;">${finalContentHTML}</div>
            <div style="position: absolute; bottom: 30px; left: 40px; right: 40px; border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 11px; font-weight: bold; color: #94a3b8; overflow: hidden;">
                <div style="float: left;">
                   <span style="display: inline-block; background-color: #f8fafc; padding: 3px 8px; border-radius: 4px; border: 1px solid #e2e8f0; color: #1e293b; font-size: 12px; font-weight: 900;">កាលបរិច្ឆេទ: ${reportDateLabel.value}</span>
                   &nbsp;&nbsp;ថ្ងៃបញ្ចេញរបាយការណ៍ • ${new Date().toLocaleString('km-KH')}
                </div>
                <div style="float: right;">${isNativePrint ? '' : `ទំព័រទី ${pageNum} នៃ ${totalPages}`}</div>
            </div>
        </div>
    `;
};

// --- HELPERS ---
const translateUnit = (unitVal) => {
  if (!unitVal) return '';
  const found = availableUnits.value.find(u => u.value === unitVal);
  if (found) return found.label;
  const u = unitVal.toLowerCase().trim();
  if (u === 'bottle' || u === 'bottles') return 'ដប';
  if (u === 'pack' || u === 'packs') return 'កញ្ចប់';
  if (u === 'case' || u === 'cases') return 'កេះ';
  if (u === 'set' || u === 'sets') return 'ឈុត';
  return unitVal; 
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Battambong:wght@400;700;900&family=Kantumruy+Pro:wght@400;700&display=swap');
.font-khmer { font-family: 'Battambong', 'Kantumruy Pro', sans-serif; }
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #94A3B8; }
.animate-fade-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
.animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
input[type="number"] { -moz-appearance: textfield; }
@media print { .print\:hidden { display: none !important; } }
</style>