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
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012-2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
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

    <div ref="printStaging" class="fixed top-0 left-[-9999px] pointer-events-none z-[-1] opacity-0 print:opacity-100 bg-white"></div>

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
                     totalClients: index === 0 ? 1 : 0,
                     isFirstItemOfReceipt: index === 0 // សម្រាប់ការពារបូកថ្លៃដឹកជាន់គ្នា
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
        
        // Product Revenue Only (No Delivery here to keep item values clean)
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

// --- ITEMIZED SUMMARY WITH REGIONAL LOGIC (FOR PDF) ---
const itemizedSummary = computed(() => {
    let summary = {
        overall: { retail: {}, wholesale: {} },
        phnomPenh: { retail: {}, wholesale: {}, clients: new Set(), usd: 0, khr: 0, deliveryUSD: 0, deliveryKHR: 0 },
        provinces: { retail: {}, wholesale: {}, clients: new Set(), usd: 0, khr: 0, deliveryUSD: 0, deliveryKHR: 0 }
    };

    const activeSellerIds = new Set(filteredSellers.value.map(s => s.originalSellerId));

    allSales.value.forEach(sale => {
        if (!isDateInScope(getValidDateStr(sale))) return;
        if (!activeSellerIds.has(sale.sellerId) && !activeSellerIds.has(sale.uid)) return;

        const isWholesale = sale.category === 'បោះដុំ';
        if (activeCategory.value !== 'all') {
            if (activeCategory.value === 'លក់រាយ' && isWholesale) return;
            if (activeCategory.value === 'បោះដុំ' && !isWholesale) return;
        }

        // Determine Region
        const isPP = sale.province === 'រាជធានីភ្នំពេញ';
        const regionGroup = isPP ? summary.phnomPenh : summary.provinces;

        if (sale.receiptId) {
            regionGroup.clients.add(sale.receiptId);
        }

        const overallGroupTarget = isWholesale ? summary.overall.wholesale : summary.overall.retail;
        const regionGroupTarget = isWholesale ? regionGroup.wholesale : regionGroup.retail;
        
        const qty = Number(sale.totalSold) || 0;
        const total = Number(sale.totalPrice) || 0; // Product only
        const unitPrice = qty > 0 ? (total / qty) : 0;
        const currency = sale.currency === 'KHR' || sale.currency === '៛' ? 'KHR' : 'USD';
        
        // Add Product Total to Regional Total
        if (currency === 'USD') regionGroup.usd += total;
        else regionGroup.khr += total;

        // Extract Delivery Fee (Only add once per receipt to regional totals)
        if (sale.isFirstItemOfReceipt) {
             const dFee = Number(sale.deliveryFee) || 0;
             const dCurr = sale.deliveryCurrency || 'USD';
             if (dCurr === 'USD' || dCurr === '$') regionGroup.deliveryUSD += dFee;
             else regionGroup.deliveryKHR += dFee;
        }

        const key = `${sale.productName}_${sale.unit}_${unitPrice}_${currency}`;

        if (!overallGroupTarget[key]) {
            overallGroupTarget[key] = {
                name: sale.productName || 'Unknown',
                unit: sale.unit || 'unit',
                unitPrice: unitPrice,
                currency: currency,
                qty: 0,
                total: 0
            };
        }
        overallGroupTarget[key].qty += qty;
        overallGroupTarget[key].total += total;

        if (!regionGroupTarget[key]) {
            regionGroupTarget[key] = {
                name: sale.productName || 'Unknown',
                unit: sale.unit || 'unit',
                unitPrice: unitPrice,
                currency: currency,
                qty: 0,
                total: 0
            };
        }
        regionGroupTarget[key].qty += qty;
        regionGroupTarget[key].total += total;
    });

    const toArray = (obj) => Object.values(obj).sort((a, b) => b.total - a.total);
    
    return {
        overall: {
            retail: toArray(summary.overall.retail),
            wholesale: toArray(summary.overall.wholesale)
        },
        phnomPenh: {
            retail: toArray(summary.phnomPenh.retail),
            wholesale: toArray(summary.phnomPenh.wholesale),
            clientCount: summary.phnomPenh.clients.size,
            usd: summary.phnomPenh.usd,
            khr: summary.phnomPenh.khr,
            deliveryUSD: summary.phnomPenh.deliveryUSD,
            deliveryKHR: summary.phnomPenh.deliveryKHR
        },
        provinces: {
            retail: toArray(summary.provinces.retail),
            wholesale: toArray(summary.provinces.wholesale),
            clientCount: summary.provinces.clients.size,
            usd: summary.provinces.usd,
            khr: summary.provinces.khr,
            deliveryUSD: summary.provinces.deliveryUSD,
            deliveryKHR: summary.provinces.deliveryKHR
        }
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
    let stats = { 
        all: { usd: 0, khr: 0, deliveryUSD: 0, deliveryKHR: 0, clients: 0, totalUnitsCount: 0, units: {} }, 
        retail: { usd: 0, khr: 0, deliveryUSD: 0, deliveryKHR: 0, clients: 0, totalUnitsCount: 0, units: {} }, 
        wholesale: { usd: 0, khr: 0, deliveryUSD: 0, deliveryKHR: 0, clients: 0, totalUnitsCount: 0, units: {} } 
    };
    
    allSales.value.forEach(sale => {
        const isWholesale = sale.category === 'បោះដុំ';
        if (!isDateInScope(getValidDateStr(sale))) return;
        
        const activeSellerIds = new Set(filteredSellers.value.map(s => s.originalSellerId));
        if (!activeSellerIds.has(sale.sellerId) && !activeSellerIds.has(sale.uid)) return;

        const cat = isWholesale ? 'wholesale' : 'retail';
        const usdVal = (sale.currency === 'USD' || sale.currency === '$') ? Number(sale.totalPrice || 0) : 0;
        const khrVal = (sale.currency === 'KHR' || sale.currency === '៛') ? Number(sale.totalPrice || 0) : 0;
        const qty = Number(sale.totalSold || 0);
        const unit = (sale.unit || 'unknown').toLowerCase().trim();
        const clientVal = Number(sale.totalClients || 0);

        let dUsd = 0;
        let dKhr = 0;
        if (sale.isFirstItemOfReceipt) {
            const dFee = Number(sale.deliveryFee) || 0;
            const dCurr = sale.deliveryCurrency || 'USD';
            if (dCurr === 'USD' || dCurr === '$') dUsd = dFee;
            else dKhr = dFee;
        }

        stats.all.usd += usdVal; stats.all.khr += khrVal; stats.all.clients += clientVal;
        stats.all.deliveryUSD += dUsd; stats.all.deliveryKHR += dKhr;

        stats[cat].usd += usdVal; stats[cat].khr += khrVal; stats[cat].clients += clientVal;
        stats[cat].deliveryUSD += dUsd; stats[cat].deliveryKHR += dKhr;
        
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
// 🖨️ PRINT & PDF LOGIC (ROBUST PAGINATION) 🖨️
// ---------------------------------------------------------

const formatCurrency = (val, curr) => Number(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + (curr === 'USD' ? ' $' : ' ៛');

const executeNativePrint = () => {
    const dataWithIndex = filteredSellers.value.map((item, idx) => ({ ...item, printIndex: idx + 1 }));
    // Native print handles pagination natively, so we just ask for 1 giant page rendering
    const contentHTML = generatePageHTML({ rows: dataWithIndex, summary: { top: true, overall: true, region: true } }, 1, 1, true);

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
        
        // កាត់បន្ថយកម្ពស់សរុបបន្តិច ដើម្បីកុំឱ្យជាន់ Footer
        const MAX_PAGE_HEIGHT = 920; 
        const PAGE_TITLE_HEIGHT = 120; 
        const TABLE_HEADER_HEIGHT = 60;

        let currentRows = [];
        let currentHeight = PAGE_TITLE_HEIGHT + TABLE_HEADER_HEIGHT; 
        let rowCounter = 1;
        let allRows = [...filteredSellers.value];

        // 1. Paginate Rows strictly based on exact height estimation
        for (let row of allRows) {
            let numProducts = row.productsList ? row.productsList.length : 1;
            let rowHeight = 70 + (numProducts * 30); 

            if (currentHeight + rowHeight > MAX_PAGE_HEIGHT && currentRows.length > 0) {
                pages.push({ rows: currentRows, summary: {} });
                currentRows = [];
                currentHeight = TABLE_HEADER_HEIGHT; 
            }
            
            currentRows.push({ ...row, printIndex: rowCounter++ });
            currentHeight += rowHeight;
        }

        // 2. Estimate Summary Section Heights
        let grandTotalUnitCount = Object.keys(grandTotals.value.all.units || {}).length;
        let hTop = 260 + (Math.ceil(grandTotalUnitCount / 2) * 45); // Top Grand Total Height

        let countOverallItems = itemizedSummary.value.overall.retail.length + itemizedSummary.value.overall.wholesale.length;
        let hOverall = countOverallItems === 0 ? 0 : 120 + (countOverallItems * 35); // Overall Breakdown Height

        let countPPItems = itemizedSummary.value.phnomPenh.retail.length + itemizedSummary.value.phnomPenh.wholesale.length;
        let hPP = countPPItems === 0 ? 0 : 130 + (countPPItems * 35); // PP Height

        let countProvItems = itemizedSummary.value.provinces.retail.length + itemizedSummary.value.provinces.wholesale.length;
        let hProv = countProvItems === 0 ? 0 : 130 + (countProvItems * 35); // Provinces Height

        let hRegion = hPP + hProv;
        if (hRegion > 0) hRegion += 60; // Added safety buffer

        let summaryObj = { top: false, overall: false, region: false };

        // Append Top Summary
        if (currentHeight + hTop <= MAX_PAGE_HEIGHT) {
            summaryObj.top = true;
            currentHeight += hTop;
        } else {
            pages.push({ rows: currentRows, summary: summaryObj });
            currentRows = [];
            summaryObj = { top: true, overall: false, region: false };
            currentHeight = hTop;
        }

        // Append Overall Items Summary
        if (hOverall > 0) {
            if (currentHeight + hOverall <= MAX_PAGE_HEIGHT) {
                summaryObj.overall = true;
                currentHeight += hOverall;
            } else {
                pages.push({ rows: currentRows, summary: summaryObj });
                currentRows = [];
                summaryObj = { top: false, overall: true, region: false };
                currentHeight = hOverall;
            }
        }

        // Append Region Summary
        if (hRegion > 0) {
            if (currentHeight + hRegion <= MAX_PAGE_HEIGHT) {
                summaryObj.region = true;
                currentHeight += hRegion;
            } else {
                pages.push({ rows: currentRows, summary: summaryObj });
                currentRows = [];
                summaryObj = { top: false, overall: false, region: true };
                currentHeight = hRegion;
            }
        }

        pages.push({ rows: currentRows, summary: summaryObj });

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
                scale: 2, useCORS: true, logging: false, backgroundColor: "#ffffff"
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

const generatePageHTML = (pageData, pageNum, totalPages, isNativePrint = false) => {
    
    const rows = isNativePrint ? pageData : (pageData.rows || []);
    const summary = isNativePrint ? { top: true, overall: true, region: true } : (pageData.summary || {});

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

    // 1. Build Top Grand Total
    let topGrandTotalHTML = '';
    if (summary.top) {
        const unitsArray = Object.entries(grandTotals.value.all.units || {});
        let unitRows = '';
        for (let i = 0; i < unitsArray.length; i += 2) {
            const [u1, c1] = unitsArray[i];
            const item2 = unitsArray[i + 1];
            const cell1 = `
                <td style="width: 50%; padding: 4px 8px 4px 0; vertical-align: top;">
                    <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px 12px; overflow: hidden;">
                        <span style="color: #475569; font-size: 12px; font-weight: bold; float: left;">${translateUnit(u1)}</span>
                        <span style="font-weight: 900; color: #0f172a; font-size: 14px; float: right;">${c1.toLocaleString()}</span>
                        <div style="clear: both;"></div>
                    </div>
                </td>`;
            const cell2 = item2 ? `
                <td style="width: 50%; padding: 4px 0 4px 8px; vertical-align: top;">
                    <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px 12px; overflow: hidden;">
                        <span style="color: #475569; font-size: 12px; font-weight: bold; float: left;">${translateUnit(item2[0])}</span>
                        <span style="font-weight: 900; color: #0f172a; font-size: 14px; float: right;">${item2[1].toLocaleString()}</span>
                        <div style="clear: both;"></div>
                    </div>
                </td>` : `<td style="width: 50%;"></td>`;
            unitRows += `<tr>${cell1}${cell2}</tr>`;
        }
        
        const unitsTableHTML = unitsArray.length > 0 
            ? `<table style="width: 100%; border-collapse: collapse; border: none;"><tbody>${unitRows}</tbody></table>`
            : `<p style="color: #94a3b8; font-size: 12px; margin: 0;">គ្មានទិន្នន័យ</p>`;

        let breakdownHTML = '';
        if (activeCategory.value === 'all') {
            breakdownHTML = `
                <table style="width: 100%; margin-top: 15px; border-top: 1px dashed #cbd5e1; padding-top: 15px;">
                    <tr>
                        <td style="width: 48%; background: white; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; vertical-align: top;">
                            <p style="font-size: 10px; color: #64748b; font-weight: 900; margin: 0 0 8px 0;">លក់រាយ (RETAIL)</p>
                            <p style="margin: 0; font-size: 16px; font-weight: 900; color: #059669;">${grandTotals.value.retail.usd.toLocaleString()} $</p>
                            <p style="margin: 2px 0 0 0; font-size: 11px; font-weight: bold; color: #2563eb;">${grandTotals.value.retail.khr.toLocaleString()} ៛</p>
                            <div style="margin-top: 8px; border-top: 1px solid #f1f5f9; padding-top: 8px;">
                                <p style="margin: 0; font-size: 10px; font-weight: bold; color: #475569;">អតិថិជន: ${grandTotals.value.retail.clients.toLocaleString()} នាក់</p>
                                <p style="margin: 2px 0 0 0; font-size: 10px; font-weight: bold; color: #475569;">បរិមាណលក់: ${grandTotals.value.retail.totalUnitsCount.toLocaleString()}</p>
                            </div>
                        </td>
                        <td style="width: 4%;"></td>
                        <td style="width: 48%; background: white; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; vertical-align: top;">
                            <p style="font-size: 10px; color: #64748b; font-weight: 900; margin: 0 0 8px 0;">បោះដុំ (WHOLESALE)</p>
                            <p style="margin: 0; font-size: 16px; font-weight: 900; color: #059669;">${grandTotals.value.wholesale.usd.toLocaleString()} $</p>
                            <p style="margin: 2px 0 0 0; font-size: 11px; font-weight: bold; color: #2563eb;">${grandTotals.value.wholesale.khr.toLocaleString()} ៛</p>
                            <div style="margin-top: 8px; border-top: 1px solid #f1f5f9; padding-top: 8px;">
                                <p style="margin: 0; font-size: 10px; font-weight: bold; color: #475569;">អតិថិជន: ${grandTotals.value.wholesale.clients.toLocaleString()} នាក់</p>
                                <p style="margin: 2px 0 0 0; font-size: 10px; font-weight: bold; color: #475569;">បរិមាណលក់: ${grandTotals.value.wholesale.totalUnitsCount.toLocaleString()}</p>
                            </div>
                        </td>
                    </tr>
                </table>
            `;
        }

        topGrandTotalHTML = `
            <table style="width: 100%; border: none; border-collapse: collapse; margin-bottom: 20px;">
                <tr>
                    <td style="width: 55%; vertical-align: top; padding-right: 15px;">
                        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 15px;">
                            <h3 style="font-size: 14px; font-weight: 900; color: #1e293b; margin: 0 0 15px 0;">
                                <span style="display:inline-block; background: #e0e7ff; color: #4f46e5; padding: 2px 6px; border-radius: 6px; margin-right: 5px;">📊</span> សរុបបរិមាណលក់តាមប្រភេទ
                            </h3>
                            ${unitsTableHTML}
                        </div>
                    </td>
                    <td style="width: 45%; vertical-align: top;">
                        <div style="border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                            <div style="background: #1e293b; padding: 12px 15px;">
                                <h3 style="font-size: 14px; font-weight: 900; color: white; margin: 0;">សរុបរួម (Grand Total)</h3>
                            </div>
                            <div style="padding: 15px; background: #f8fafc;">
                                <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                                    <tr>
                                        <td style="padding-bottom: 8px; border-bottom: 1px dashed #cbd5e1; color: #64748b; font-weight: bold;">អតិថិជនសរុប:</td>
                                        <td style="padding-bottom: 8px; border-bottom: 1px dashed #cbd5e1; text-align: right; font-weight: 900; color: #0f172a;">${grandTotals.value.all.clients.toLocaleString()} នាក់</td>
                                    </tr>
                                    <tr>
                                        <td style="padding-top: 8px; padding-bottom: 8px; border-bottom: 1px dashed #cbd5e1; color: #64748b; font-weight: bold;">សរុបទំនិញ (Products):</td>
                                        <td style="padding-top: 8px; padding-bottom: 8px; border-bottom: 1px dashed #cbd5e1; text-align: right; font-weight: 900; color: #059669; font-size: 14px;">
                                            ${grandTotals.value.all.usd.toLocaleString()} $
                                            ${grandTotals.value.all.khr > 0 ? `<br/><span style="color: #2563eb; font-size: 11px;">${grandTotals.value.all.khr.toLocaleString()} ៛</span>` : ''}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding-top: 8px; padding-bottom: 8px; border-bottom: 1px solid #cbd5e1; color: #64748b; font-weight: bold;">ថ្លៃដឹកជញ្ជូន (Delivery):</td>
                                        <td style="padding-top: 8px; padding-bottom: 8px; border-bottom: 1px solid #cbd5e1; text-align: right; font-weight: 900; color: #ea580c;">
                                            ${grandTotals.value.all.deliveryUSD > 0 ? grandTotals.value.all.deliveryUSD.toLocaleString() + ' $' : ''}
                                            ${grandTotals.value.all.deliveryUSD > 0 && grandTotals.value.all.deliveryKHR > 0 ? ' | ' : ''}
                                            ${grandTotals.value.all.deliveryKHR > 0 ? grandTotals.value.all.deliveryKHR.toLocaleString() + ' ៛' : ''}
                                            ${grandTotals.value.all.deliveryUSD === 0 && grandTotals.value.all.deliveryKHR === 0 ? '0 $' : ''}
                                        </td>
                                    </tr>
                                </table>
                                ${breakdownHTML}
                            </div>
                        </div>
                    </td>
                </tr>
            </table>
        `;
    }

    // 2. Build Overall Summary
    let overallHTML = '';
    if (summary.overall) {
        let retailHTML = '';
        if (itemizedSummary.value.overall.retail.length > 0) {
            retailHTML = `
                <div style="margin-bottom: 15px;">
                    <div style="background: #e0e7ff; color: #4f46e5; font-size: 12px; font-weight: bold; padding: 6px 12px; border-radius: 6px; display: inline-block; margin-bottom: 10px;">សរុបការលក់រាយ និងឈុត (Retail & Combo)</div>
                    <table style="width: 100%; border-collapse: collapse; font-size: 11px; background: white;">
                        <thead style="background: #f8fafc; border-bottom: 1px solid #cbd5e1; color: #64748b;">
                            <tr>
                                <th style="padding: 6px; text-align: left;">មុខទំនិញ</th>
                                <th style="padding: 6px; text-align: center;">ចំនួន</th>
                                <th style="padding: 6px; text-align: right;">តម្លៃឯកតា</th>
                                <th style="padding: 6px; text-align: right;">សរុប</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemizedSummary.value.overall.retail.map(item => `
                                <tr style="border-bottom: 1px dashed #e2e8f0;">
                                    <td style="padding: 6px; font-weight: bold; color: #334155;">${item.name}</td>
                                    <td style="padding: 6px; text-align: center; color: #475569;">${item.qty} ${translateUnit(item.unit)}</td>
                                    <td style="padding: 6px; text-align: right; color: #475569;">${formatCurrency(item.unitPrice, item.currency)}</td>
                                    <td style="padding: 6px; text-align: right; font-weight: bold; color: #059669;">${formatCurrency(item.total, item.currency)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }

        let wholesaleHTML = '';
        if (itemizedSummary.value.overall.wholesale.length > 0) {
            wholesaleHTML = `
                <div style="margin-bottom: 15px;">
                    <div style="background: #f3e8ff; color: #7e22ce; font-size: 12px; font-weight: bold; padding: 6px 12px; border-radius: 6px; display: inline-block; margin-bottom: 10px;">សរុបការបោះដុំ (Wholesale)</div>
                    <table style="width: 100%; border-collapse: collapse; font-size: 11px; background: white;">
                        <thead style="background: #f8fafc; border-bottom: 1px solid #cbd5e1; color: #64748b;">
                            <tr>
                                <th style="padding: 6px; text-align: left;">មុខទំនិញ</th>
                                <th style="padding: 6px; text-align: center;">ចំនួន</th>
                                <th style="padding: 6px; text-align: right;">តម្លៃឯកតា</th>
                                <th style="padding: 6px; text-align: right;">សរុប</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemizedSummary.value.overall.wholesale.map(item => `
                                <tr style="border-bottom: 1px dashed #e2e8f0;">
                                    <td style="padding: 6px; font-weight: bold; color: #334155;">${item.name}</td>
                                    <td style="padding: 6px; text-align: center; color: #475569;">${item.qty} ${translateUnit(item.unit)}</td>
                                    <td style="padding: 6px; text-align: right; color: #475569;">${formatCurrency(item.unitPrice, item.currency)}</td>
                                    <td style="padding: 6px; text-align: right; font-weight: bold; color: #059669;">${formatCurrency(item.total, item.currency)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }
        
        overallHTML = retailHTML + wholesaleHTML;
    }

    // 3. Build Regional Summary
    let regionHTML = '';
    if (summary.region) {
        const buildRegionHTML = (title, regionData, colorHex, bgColor) => {
            if (regionData.retail.length === 0 && regionData.wholesale.length === 0) return '';

            let html = `
                <div style="margin-top: 25px; padding: 15px; border-radius: 12px; border: 1px solid ${colorHex}40; background: ${bgColor}; break-inside: avoid; page-break-inside: avoid;">
                    <table style="width: 100%; margin-bottom: 15px; border-bottom: 2px solid ${colorHex}40; padding-bottom: 10px;">
                        <tr>
                            <td style="text-align: left;">
                                <h3 style="font-size: 15px; font-weight: 900; color: ${colorHex}; margin: 0;">📍 ${title}</h3>
                            </td>
                            <td style="text-align: right;">
                                <span style="background: white; color: #475569; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: bold; border: 1px solid #cbd5e1;">
                                    អតិថិជនសរុប: ${regionData.clientCount} នាក់
                                </span>
                            </td>
                        </tr>
                    </table>
            `;

            const buildTable = (typeTitle, items) => {
                if (items.length === 0) return '';
                return `
                    <div style="margin-bottom: 15px;">
                        <h4 style="font-size: 12px; font-weight: bold; color: #64748b; margin: 0 0 8px 0;">${typeTitle}</h4>
                        <table style="width: 100%; border-collapse: collapse; font-size: 11px; background: white;">
                            <thead style="background: #f8fafc; border-bottom: 1px solid #cbd5e1; color: #64748b;">
                                <tr>
                                    <th style="padding: 6px; text-align: left;">មុខទំនិញ</th>
                                    <th style="padding: 6px; text-align: center;">ចំនួន</th>
                                    <th style="padding: 6px; text-align: right;">តម្លៃឯកតា</th>
                                    <th style="padding: 6px; text-align: right;">សរុប</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${items.map(item => `
                                    <tr style="border-bottom: 1px dashed #e2e8f0;">
                                        <td style="padding: 6px; font-weight: bold; color: #334155;">${item.name}</td>
                                        <td style="padding: 6px; text-align: center; color: #475569;">${item.qty} ${translateUnit(item.unit)}</td>
                                        <td style="padding: 6px; text-align: right; color: #475569;">${formatCurrency(item.unitPrice, item.currency)}</td>
                                        <td style="padding: 6px; text-align: right; font-weight: bold; color: ${colorHex};">${formatCurrency(item.total, item.currency)}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `;
            };

            html += buildTable('លក់រាយ (Retail)', regionData.retail);
            html += buildTable('បោះដុំ (Wholesale)', regionData.wholesale);

            html += `
                    <div style="text-align: right; padding-top: 10px; font-size: 12px; color: ${colorHex}; border-top: 1px dashed ${colorHex}40;">
                        <table style="width: 100%; border: none;">
                            <tr>
                                <td style="text-align: right; color: #64748b; font-weight: bold; padding-bottom: 4px;">សរុបទំនិញតំបន់នេះ:</td>
                                <td style="text-align: right; font-weight: 900; color: ${colorHex}; padding-bottom: 4px; width: 180px;">${regionData.usd.toLocaleString()} $ ${regionData.khr > 0 ? `| ${regionData.khr.toLocaleString()} ៛` : ''}</td>
                            </tr>
                            <tr>
                                <td style="text-align: right; color: #64748b; font-weight: bold; padding-bottom: 4px;">ថ្លៃដឹកជញ្ជូន:</td>
                                <td style="text-align: right; font-weight: 900; color: #ea580c; padding-bottom: 4px;">${regionData.deliveryUSD > 0 ? regionData.deliveryUSD.toLocaleString() + ' $' : '0 $'} ${regionData.deliveryKHR > 0 ? `| ${regionData.deliveryKHR.toLocaleString()} ៛` : ''}</td>
                            </tr>
                        </table>
                    </div>
                </div>
            `;
            return html;
        };

        regionHTML += buildRegionHTML('រាជធានីភ្នំពេញ', itemizedSummary.value.phnomPenh, '#0284c7', '#f0f9ff');
        regionHTML += buildRegionHTML('តាមបណ្តាខេត្ត', itemizedSummary.value.provinces, '#ea580c', '#fff7ed');
    }

    let allSummariesCombined = '';
    if (summary.top || summary.overall || summary.region) {
        let titleHTML = '';
        if (summary.overall || summary.region) {
            titleHTML = `<h3 style="font-size: 18px; font-weight: 900; color: #1e293b; margin-bottom: 20px; text-align: center;">របាយការណ៍លម្អិតតាមមុខទំនិញ និងតំបន់</h3>`;
        }

        let topMargin = summary.top ? '30px' : '0px';
        let topPadding = summary.top ? '20px' : '0px';
        let topBorder = summary.top ? '2px solid #cbd5e1' : 'none';

        allSummariesCombined = `
            <div style="margin-top: ${topMargin}; padding-top: ${topPadding}; border-top: ${topBorder}; width: 100%;">
                ${topGrandTotalHTML}
                ${titleHTML}
                ${overallHTML}
                ${regionHTML}
            </div>
        `;
    }

    let tableHTML = '';
    if (rows.length > 0) {
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

        tableHTML = `
            <table style="width: 100%; text-align: left; border-collapse: collapse; background-color: #ffffff;">
                ${tableHeader}
                <tbody>${rows.map(renderRow).join('')}</tbody>
            </table>
        `;
    }

    // លុប Fixed Height ចេញ
    const pageStyles = isNativePrint
        ? `width: 100%; box-sizing: border-box; font-family: 'Battambang', 'Kantumruy Pro', sans-serif; line-height: 1.5; padding: 15px;`
        : `width: 794px; min-height: 1123px; height: auto; background: white; padding: 40px; box-sizing: border-box; display: flex; flex-direction: column; font-family: 'Battambang', 'Kantumruy Pro', sans-serif; line-height: 1.5; position: relative;`;

    const mainTitle = (pageNum === 1 || isNativePrint) 
        ? `<div style="text-align: center; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 3px solid #4f46e5;"><h1 style="font-size: 24px; font-weight: 900; color: #4338ca; margin: 0; text-align: center; width: 100%;">របាយការណ៍លក់សរុប</h1></div>` 
        : '';

    // ប្តូរ Footer ពី Absolute ទៅជា Flex Margin Auto ដើម្បីកុំឱ្យជាន់ទិន្នន័យពីលើ
    const footerHTML = isNativePrint ? '' : `
        <div style="margin-top: auto; border-top: 1px solid #e2e8f0; padding-top: 10px; font-size: 11px; font-weight: bold; color: #94a3b8; display: flex; justify-content: space-between; align-items: center; background: white; width: 100%;">
            <div>
                <span style="background-color: #f8fafc; padding: 3px 8px; border-radius: 4px; border: 1px solid #e2e8f0; color: #1e293b; font-size: 11px; font-weight: 900;">កាលបរិច្ឆេទ: ${reportDateLabel.value}</span>
                <span style="margin-left: 10px;">ថ្ងៃបញ្ចេញរបាយការណ៍ • ${new Date().toLocaleString('km-KH')}</span>
            </div>
            <div>ទំព័រទី ${pageNum} នៃ ${totalPages}</div>
        </div>
    `;

    return `
        <div class="print-page" style="${pageStyles}">
            <div style="padding-bottom: 60px;">
                ${mainTitle}
                ${tableHTML}
                ${allSummariesCombined}
            </div>
            ${footerHTML}
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
@import url('https://fonts.googleapis.com/css2?family=Battambang:wght@400;700;900&family=Kantumruy+Pro:wght@400;700&display=swap');
.font-khmer { font-family: 'Battambang', 'Kantumruy Pro', sans-serif; }
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