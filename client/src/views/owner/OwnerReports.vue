<template>
  <div class="print-container">
    <div class="font-khmer min-h-screen relative bg-[#F4F7FE] print:hidden pb-40">
      
      <transition enter-active-class="duration-300 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
          <div v-if="showMobileFilters" class="md:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[80]" @click="showMobileFilters = false"></div>
      </transition>

      <div :class="[
          'transition-transform duration-300 ease-in-out w-full hide-profile-on-mobile',
          'md:block md:relative md:z-auto md:translate-y-0',
          showMobileFilters ? 'fixed bottom-0 left-0 right-0 z-[90] bg-white rounded-t-[2rem] shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.3)] p-6 pb-10 translate-y-0' : 'hidden md:block'
      ]">
          <div v-if="showMobileFilters" class="md:hidden w-12 h-1.5 bg-slate-200 hover:bg-slate-300 transition-colors rounded-full mx-auto mb-6 cursor-pointer" @click="showMobileFilters = false"></div>
          
          <div class="flex flex-col xl:flex-row xl:items-center justify-between gap-4 px-4 md:px-8 pt-4 md:pt-6 max-w-[90rem] mx-auto">
              <div class="flex-1 w-full">
                  <OwnerReportHeader 
                    v-model:dateFilterType="dateFilterType"
                    v-model:selectedDate="selectedDate"
                    v-model:selectedMonth="selectedMonth"
                    v-model:selectedYear="selectedYear"
                    v-model:customStart="customStart"
                    v-model:customEnd="customEnd"
                    :availableYears="availableYears"
                    :availableMonths="availableMonths"
                    :isLoading="isLoading"
                  />
              </div>
              
              <div class="flex items-center gap-3 shrink-0 mt-4 xl:mt-0 pb-4 xl:pb-0 border-b xl:border-b-0 border-slate-200/60">
                  <button @click="showSummaryCards = !showSummaryCards" class="flex-1 xl:flex-none flex items-center justify-center gap-2 text-[12px] md:text-[13px] font-bold px-4 py-2.5 md:py-3 rounded-xl transition-all" :class="showSummaryCards ? 'bg-slate-200/60 text-slate-600 hover:bg-slate-200' : 'bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100 shadow-sm'">
                     <svg v-if="showSummaryCards" class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                     <svg v-else class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                     {{ showSummaryCards ? 'លាក់ផ្ទាំងសរុប' : 'បង្ហាញផ្ទាំងសរុប' }}
                  </button>

                  <button @click="showExpenseSlide = true" class="flex-1 xl:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 text-white text-[12px] md:text-[13px] font-bold px-4 py-2.5 md:py-3 rounded-xl transition-all shadow-md shadow-rose-500/30 active:scale-95">
                      <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                      ចំណាយប្រចាំថ្ងៃ
                  </button>
              </div>
          </div>

          <div v-if="showMobileFilters" class="md:hidden grid grid-cols-1 gap-3 mt-6 pt-6 border-t border-slate-100 px-6">
              <button @click="openReportConfig(); showMobileFilters = false" class="flex items-center justify-center gap-2 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm active:scale-95 transition-all shadow-md shadow-indigo-500/30">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                  កំណត់ & ទាញយករបាយការណ៍
              </button>
          </div>
      </div>

      <div class="px-4 md:px-8 max-w-[90rem] mx-auto w-full">
        <div v-if="isLoading && allSales.length === 0" class="flex flex-col items-center justify-center py-20 opacity-60">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-indigo-600 mb-4"></div>
            <p class="font-bold text-slate-500">កំពុងរៀបចំទិន្នន័យដំបូង...</p>
        </div>

        <template v-else>
            <div v-show="showSummaryCards" :class="{'hidden md:block': !showMobileFilters, 'block animate-fade-in-up my-4': showMobileFilters, 'animate-fade-in-up my-6': showSummaryCards}">
                <OwnerReportSummaryCards 
                    :grandTotals="grandTotals"
                    :activeCategory="activeCategory"
                    :activeAdminsCount="activeAdminsCount"
                    :inactiveAdminsCount="inactiveAdminsCount"
                />
            </div>

            <div class="mt-4 relative z-10">
                <OwnerReportAdminList 
                    :displayedData="displayedData"
                    :isLoading="isLoading"
                    :unitSettings="unitSettings"
                    :currentUserRole="currentUserRole" v-model:activeCategory="activeCategory"
                    v-model:activityFilter="activityFilter"
                    :showMobileFilters="showMobileFilters"
                    @toggleMobileFilters="showMobileFilters = !showMobileFilters"
                    @preview="openReportConfig" 
                    @print="openReportConfig"
                    @pdf="openReportConfig"
                    @excel="openReportConfig"
                />
            </div>
        </template>
      </div>

      <OwnerReportBottomSummary 
         v-if="!isLoading && displayedData.length > 0 && activityFilter !== 'inactive'"
         :grandTotals="grandTotals"
         :unitSettings="unitSettings"
         class="px-4 md:px-8 max-w-[90rem] mx-auto w-full mt-6"
      />

      <transition enter-active-class="duration-300 ease-out" enter-from-class="opacity-0 translate-y-10" enter-to-class="opacity-100 translate-y-0" leave-active-class="duration-200 ease-in" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-10">
          <div v-if="fetchTimer.show" class="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] bg-slate-900/90 backdrop-blur-md border border-slate-700 text-white px-5 py-3.5 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] flex items-center gap-3 pointer-events-none">
              <div class="animate-spin h-5 w-5 border-2 border-indigo-400 border-t-transparent rounded-full"></div>
              <span class="text-sm font-bold tracking-wide">កំពុងទាញទិន្នន័យ...</span>
              <span class="text-[13px] text-indigo-300 font-mono font-black bg-slate-800 px-2 py-0.5 rounded border border-indigo-500/30 w-[45px] text-center">
                  {{ fetchTimer.seconds.toFixed(1) }}s
              </span>
          </div>
      </transition>

    </div>

    <OwnerExpenseSlide 
        v-if="showExpenseSlide" 
        :show="showExpenseSlide" 
        :activeAdmins="adminsWithSales"
        :expensesList="allExpenses"
        v-model:dateFilterType="dateFilterType"
        v-model:selectedDate="selectedDate"
        v-model:selectedMonth="selectedMonth"
        v-model:selectedYear="selectedYear"
        v-model:customStart="customStart"
        v-model:customEnd="customEnd"
        :availableYears="availableYears"
        :availableMonths="availableMonths"
        @close="showExpenseSlide = false" 
    />

    <PreviewReportModal 
        :show="showPreviewModal"
        :activeAdmins="displayedData"
        :selectedAdmins="selectedAdminsForExport"
        :stats="advancedPrintStats"
        :allSales="allSales"  :dateLabel="reportDateLabel"
        :adminLabel="reportAdminLabel"
        :unitSettings="unitSettings"
        :processingState="processing"
        @close="showPreviewModal = false"
        @update:selectedAdmins="val => selectedAdminsForExport = val"
        @exportAction="executeExport"
    />​

    <div ref="printStaging" class="fixed top-0 left-[-9999px] pointer-events-none z-[-1]"></div>

    <CustomAlert 
       v-if="alert.show" 
       :type="alert.type" 
       :title="alert.title" 
       :message="alert.message" 
       @close="alert.show = false" 
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch, nextTick, reactive } from 'vue';
import { db, auth } from '@/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

import OwnerReportHeader from './report/OwnerReportHeader.vue';
import OwnerReportSummaryCards from './report/OwnerReportSummaryCards.vue';
import OwnerReportAdminList from './report/OwnerReportAdminList.vue';
import OwnerReportBottomSummary from './report/OwnerReportBottomSummary.vue';
import CustomAlert from '@/components/shared/CustomAlert.vue'; 
import OwnerExpenseSlide from './report/OwnerExpenseSlide.vue'; 
import PreviewReportModal from './report/PreviewReportModal.vue'; 
import { executeNativePrint, generatePDF, generateExcel } from './report/exportReportLogic.js';
import { doc, getDoc, collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';

const isLoading = ref(true);
const adminName = ref('Owner');
const currentUserRole = ref('');
const adminsList = ref([]);
const allSales = ref([]); 
const allSellers = ref([]); 
const unitSettings = ref([]); 
const allExpenses = ref([]); 
const allStocks = ref([]);

let unsubscribeSales = null;
let unsubscribeExpenses = null;

const showMobileFilters = ref(false);
const showSummaryCards = ref(false); 
const showExpenseSlide = ref(false); 
const showPreviewModal = ref(false); 

// 🌟 New Selection State for Export 🌟
const selectedAdminsForExport = ref([]);

const activeCategory = ref('all'); 
const dateFilterType = ref('daily'); 
const activityFilter = ref('all'); 

const today = new Date();
const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

const selectedDate = ref(todayStr);
const selectedYear = ref(today.getFullYear());
const selectedMonth = ref(today.getMonth());
const customStart = ref(todayStr);
const customEnd = ref(todayStr);

const printStaging = ref(null);
const processing = ref({ active: false, message: '', progress: 0 });

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

const monthNames = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'];
const availableMonths = computed(() => monthNames.map((name, index) => ({ index, name })));
const availableYears = computed(() => {
    const currentYear = new Date().getFullYear();
    return [currentYear - 2, currentYear - 1, currentYear, currentYear + 1];
});

const alert = reactive({ show: false, title: '', message: '', type: 'success' });
const triggerAlert = (type, title, message) => {
  alert.type = type; alert.title = title; alert.message = message; alert.show = true;
  setTimeout(() => alert.show = false, 3000);
};

const getDateRangeISO = () => {
    try {
        let start, end;
        const createDateBounds = (dateString) => {
            const base = new Date(dateString);
            if (isNaN(base.getTime())) throw new Error("Invalid Date");
            const startDay = new Date(base.getFullYear(), base.getMonth(), base.getDate(), 0, 0, 0);
            const endDay = new Date(base.getFullYear(), base.getMonth(), base.getDate(), 23, 59, 59, 999);
            return { startDay, endDay };
        };

        if (dateFilterType.value === 'daily') {
            const { startDay, endDay } = createDateBounds(selectedDate.value);
            start = startDay; end = endDay;
        } else if (dateFilterType.value === 'monthly') {
            start = new Date(parseInt(selectedYear.value), parseInt(selectedMonth.value), 1, 0, 0, 0);
            end = new Date(parseInt(selectedYear.value), parseInt(selectedMonth.value) + 1, 0, 23, 59, 59, 999);
        } else if (dateFilterType.value === 'yearly') {
            start = new Date(parseInt(selectedYear.value), 0, 1, 0, 0, 0);
            end = new Date(parseInt(selectedYear.value), 11, 31, 23, 59, 59, 999);
        } else { 
            const boundsStart = createDateBounds(customStart.value);
            const boundsEnd = createDateBounds(customEnd.value);
            start = boundsStart.startDay; end = boundsEnd.endDay;
        }
        
        return { startStr: start.toISOString(), endStr: end.toISOString() };
    } catch (error) {
        console.warn("Date Parsing Warning, using today's fallback:", error);
        const todayStart = new Date(); todayStart.setHours(0,0,0,0);
        const todayEnd = new Date(); todayEnd.setHours(23,59,59,999);
        return { startStr: todayStart.toISOString(), endStr: todayEnd.toISOString() };
    }
};

let currentFetchId = 0; 
let safetyTimer = null;

const fetchDynamicData = async () => {
    if (allSales.value.length === 0) isLoading.value = true;
    const { startStr, endStr } = getDateRangeISO();

    if (unsubscribeSales) { unsubscribeSales(); unsubscribeSales = null; }
    if (unsubscribeExpenses) { unsubscribeExpenses(); unsubscribeExpenses = null; }

    const salesQ = query(collection(db, 'sales_reports'), where('createdAt', '>=', startStr), where('createdAt', '<=', endStr));
    const expensesQ = query(collection(db, 'daily_expenses'), where('createdAt', '>=', startStr), where('createdAt', '<=', endStr));

    currentFetchId++;
    const thisFetchId = currentFetchId;

    const isTodayFilter = dateFilterType.value === 'daily' && selectedDate.value === todayStr;

    if (isTodayFilter) {
        let isSalesSynced = false;
        let isExpensesSynced = false;

        const checkCompletion = () => {
            if (thisFetchId === currentFetchId && isSalesSynced && isExpensesSynced) {
                stopFetchTimer();
                if (safetyTimer) clearTimeout(safetyTimer);
            }
        };

        unsubscribeSales = onSnapshot(salesQ, { includeMetadataChanges: true }, (snapshot) => {
            if (thisFetchId !== currentFetchId) return;
            allSales.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            isLoading.value = false; 
            if (!snapshot.metadata.fromCache) { isSalesSynced = true; checkCompletion(); }
        }, (error) => {
            console.error("Sales Subscription Error:", error);
            if (thisFetchId === currentFetchId) { isLoading.value = false; isSalesSynced = true; checkCompletion(); }
        });

        unsubscribeExpenses = onSnapshot(expensesQ, { includeMetadataChanges: true }, (snapshot) => {
            if (thisFetchId !== currentFetchId) return;
            allExpenses.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            if (!snapshot.metadata.fromCache) { isExpensesSynced = true; checkCompletion(); }
        }, (error) => {
            console.error("Expenses Subscription Error:", error);
            if (thisFetchId === currentFetchId) { isExpensesSynced = true; checkCompletion(); }
        });

        if (safetyTimer) clearTimeout(safetyTimer);
        safetyTimer = setTimeout(() => {
            if (thisFetchId === currentFetchId) { isSalesSynced = true; isExpensesSynced = true; checkCompletion(); }
        }, 30000); 

    } else {
        try {
            const [salesSnap, expensesSnap] = await Promise.all([getDocs(salesQ), getDocs(expensesQ)]);
            if (thisFetchId !== currentFetchId) return;

            allSales.value = salesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            allExpenses.value = expensesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            
            isLoading.value = false;
            stopFetchTimer();
            if (safetyTimer) clearTimeout(safetyTimer);
        } catch (error) {
            console.error("Static Fetch Error:", error);
            if (thisFetchId === currentFetchId) {
                isLoading.value = false;
                stopFetchTimer();
            }
        }
    }
};

onMounted(() => {
  onAuthStateChanged(auth, async (user) => { 
    if (user) {
       adminName.value = user.displayName || 'Owner';
       try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) currentUserRole.value = userDoc.data().role;

          const adminQ = query(collection(db, 'users'), where('role', '==', 'admin'));
          const adminSnap = await getDocs(adminQ);
          adminsList.value = adminSnap.docs
              .map(doc => ({ id: doc.id, ...doc.data() }))
              .filter(a => a.isDeleted === false || a.isDeleted === "false" || !a.isDeleted);

          const sellerQ = query(collection(db, 'users'), where('role', '==', 'seller'));
          const sellerSnap = await getDocs(sellerQ);
          allSellers.value = sellerSnap.docs
              .map(doc => ({ id: doc.id, ...doc.data() }))
              .filter(s => s.isDeleted === false || s.isDeleted === "false" || !s.isDeleted);

          const settingsSnap = await getDocs(collection(db, 'settings_units'));
          unitSettings.value = settingsSnap.docs.map(doc => doc.data());

          const stockSnap = await getDocs(collection(db, 'stocks'));
          allStocks.value = stockSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

          fetchDynamicData();

       } catch (error) {
          console.error("Error", error);
          isLoading.value = false;
       }
    }
  });
});

onUnmounted(() => {
    if (unsubscribeSales) unsubscribeSales();
    if (unsubscribeExpenses) unsubscribeExpenses();
    stopFetchTimer();
    if (safetyTimer) clearTimeout(safetyTimer);
});

let debounceTimeout = null;

watch([dateFilterType, selectedDate, selectedMonth, selectedYear, customStart, customEnd], () => {
    startFetchTimer();
    if (debounceTimeout) clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
        fetchDynamicData();
    }, 600); 
}, { deep: true });

const baseCalculatedData = computed(() => {
   if (adminsList.value.length === 0) return [];
   let rows = [];

   adminsList.value.forEach(admin => {
      const adminSellersIds = allSellers.value.filter(seller => seller.createdBy === admin.id).map(s => s.id);

      const relevantSales = allSales.value.filter(s => {
          const isMatch = s.createdBy === admin.id || adminSellersIds.includes(s.createdBy) || adminSellersIds.includes(s.uid);
          const isValid = s.paymentStatus !== 'CANCELED';
          return isMatch && isValid;
      });

      let filteredSales = relevantSales;
      if (activeCategory.value === 'លក់រាយ') {
          filteredSales = relevantSales.filter(s => !s.items || !s.items.some(i => String(i.type || '').trim().includes('បោះដុំ')));
      } else if (activeCategory.value === 'បោះដុំ') {
          filteredSales = relevantSales.filter(s => s.items && s.items.some(i => String(i.type || '').trim().includes('បោះដុំ')));
      }

      let totalClients = filteredSales.length; 
      let revenueUSD = 0;
      let revenueKHR = 0;
      let unitCounts = {}; 
      let hasWholesaleItem = false;
      let hasRetailItem = false;

      filteredSales.forEach(sale => {
          if (sale.currency === 'USD') revenueUSD += Number(sale.totalAmount || 0);
          else revenueKHR += Number(sale.totalAmount || 0);

          if(sale.items && sale.items.length > 0) {
              sale.items.forEach(item => {
                  const u = (item.unit || 'unknown').toLowerCase().trim();
                  if (!unitCounts[u]) unitCounts[u] = 0;
                  unitCounts[u] += Number(item.qty || 0);

                  if (String(item.type || '').trim().includes('បោះដុំ')) hasWholesaleItem = true;
                  else hasRetailItem = true;
              });
          }
      });

      let categoryLabel = '-';
      if (hasWholesaleItem && hasRetailItem) categoryLabel = 'ដុំ និង រាយ';
      else if (hasWholesaleItem) categoryLabel = 'បោះដុំ';
      else if (hasRetailItem) categoryLabel = 'លក់រាយ';

      const hasSales = filteredSales.length > 0;
      
      rows.push({ 
          ...admin, 
          uniqueId: admin.id, 
          originalAdminId: admin.id, 
          category: categoryLabel,
          unitCounts, 
          totalClients, 
          revenueUSD, 
          revenueKHR, 
          hasSales, 
          totalSellersCount: adminSellersIds.length 
      });
   });

   return rows.sort((a, b) => {
       if (a.hasSales && !b.hasSales) return -1;
       if (!a.hasSales && b.hasSales) return 1;
       return (b.revenueUSD + (b.revenueKHR/4000)) - (a.revenueUSD + (a.revenueKHR/4000));
   }); 
});

const activeAdminsCount = computed(() => new Set(baseCalculatedData.value.filter(a => a.hasSales).map(a => a.originalAdminId)).size);
const inactiveAdminsCount = computed(() => new Set(baseCalculatedData.value.filter(a => !a.hasSales).map(a => a.originalAdminId)).size);

const displayedData = computed(() => {
    if (activityFilter.value === 'active') return baseCalculatedData.value.filter(a => a.hasSales);
    if (activityFilter.value === 'inactive') return baseCalculatedData.value.filter(a => !a.hasSales);
    return baseCalculatedData.value;
});

const adminsWithSales = computed(() => {
    return displayedData.value.filter(a => a.hasSales);
});

const grandTotals = computed(() => {
    let stats = {
        all: { usd: 0, khr: 0, clients: 0, totalUnitsCount: 0, units: {} },
        retail: { usd: 0, khr: 0, clients: 0, totalUnitsCount: 0, units: {} },
        wholesale: { usd: 0, khr: 0, clients: 0, totalUnitsCount: 0, units: {} }
    };

    const validSales = allSales.value.filter(s => s.paymentStatus !== 'CANCELED');

    validSales.forEach(sale => {
        const hasWholesale = sale.items && sale.items.some(item => String(item.type || '').trim().includes('បោះដុំ'));
        const cat = hasWholesale ? 'wholesale' : 'retail';

        let usd = sale.currency === 'USD' ? Number(sale.totalAmount || 0) : 0;
        let khr = sale.currency !== 'USD' ? Number(sale.totalAmount || 0) : 0;

        stats.all.clients += 1;
        stats.all.usd += usd;
        stats.all.khr += khr;

        stats[cat].clients += 1;
        stats[cat].usd += usd;
        stats[cat].khr += khr;

        if (sale.items) {
            sale.items.forEach(item => {
                const u = (item.unit || 'unknown').toLowerCase().trim();
                const qty = Number(item.qty || 0);
                
                stats.all.units[u] = (stats.all.units[u] || 0) + qty;
                stats.all.totalUnitsCount += qty;
                
                stats[cat].units[u] = (stats[cat].units[u] || 0) + qty;
                stats[cat].totalUnitsCount += qty;
            });
        }
    });

    return stats;
});


const calculateItemCostUSD = (saleItem, saleCurrency) => {
    let itemCostPerUnit = Number(saleItem.cost || 0);

    if (saleCurrency === 'KHR' || saleCurrency === '៛') {
        itemCostPerUnit = itemCostPerUnit / 4000;
    }

    const saleQty = Number(saleItem.qty || 0);
    let totalItemCost = itemCostPerUnit * saleQty;

    if (totalItemCost === 0 && allStocks.value.length > 0) {
        let stockItem = allStocks.value.find(s => s.id === saleItem.id) || allStocks.value.find(s => s.name === saleItem.name);
        if (stockItem) {
            let baseUnitCost = Number(stockItem.unitCost || 0);
            if (stockItem.currency === 'KHR' || stockItem.currency === '៛') {
                baseUnitCost = baseUnitCost / 4000;
            }
            const itemsPerCase = Number(stockItem.itemsPerCase || 1);
            const saleUnit = String(saleItem.unit || '').toLowerCase().trim();
            const stockUnit = String(stockItem.unit || '').toLowerCase().trim();

            if (stockUnit === 'case' && saleUnit !== 'case' && saleUnit !== 'កេះ') {
                baseUnitCost = baseUnitCost / itemsPerCase; 
            }
            totalItemCost = baseUnitCost * saleQty;
        }
    }

    return totalItemCost;
};

// 🌟 Open Wizard Modal (replaced old function) 🌟
const openReportConfig = () => {
    selectedAdminsForExport.value = displayedData.value.map(a => a.originalAdminId);
    showPreviewModal.value = true;
};

const rowsToPrint = computed(() => {
    return displayedData.value
        .filter(a => selectedAdminsForExport.value.includes(a.originalAdminId))
        .map((item, idx) => ({ ...item, printIndex: idx + 1 }));
});

const filteredExpensesToPrint = computed(() => {
    return allExpenses.value.filter(exp => {
        const isAllSelected = selectedAdminsForExport.value.length === displayedData.value.length;
        if (isAllSelected) return true;
        const targets = exp.targetAdmins || [];
        if (targets.includes('ALL')) return true;
        return targets.some(targetId => selectedAdminsForExport.value.includes(targetId));
    });
});

const advancedPrintStats = computed(() => {
    const createEmptyStat = () => ({
        allClients: new Set(),
        paid: {
            wholesale: { products: {}, itemPriceTotalUSD: 0, clients: new Set() },
            retail: { products: {}, itemPriceTotalUSD: 0, clients: new Set() },
            deliveryFeeUSD: 0,
            itemCostTotalUSD: 0 
        },
        unpaid: {
            wholesale: { products: {}, itemPriceTotalUSD: 0, clients: new Set() },
            retail: { products: {}, itemPriceTotalUSD: 0, clients: new Set() },
            deliveryFeeUSD: 0,
            itemCostTotalUSD: 0 
        },
        totalExpensesUSD: 0 
    });

    const stats = {
        grand: createEmptyStat(),
        pp: createEmptyStat(),
        prov: createEmptyStat()
    };

    let filteredValidSales = allSales.value.filter(s => s.paymentStatus !== 'CANCELED');
    const isAllSelected = selectedAdminsForExport.value.length === displayedData.value.length;

    if (!isAllSelected) {
        const targetAdminSellersIds = allSellers.value.filter(s => selectedAdminsForExport.value.includes(s.createdBy)).map(s => s.id);
        filteredValidSales = filteredValidSales.filter(s => {
            return selectedAdminsForExport.value.includes(s.createdBy) || targetAdminSellersIds.includes(s.createdBy) || targetAdminSellersIds.includes(s.uid);
        });
    }

    filteredValidSales.forEach(sale => {
        const provClean = (sale.province || '').trim();
        const isPP = provClean === 'រាជធានីភ្នំពេញ' || provClean === 'ភ្នំពេញ';
        const isPaid = sale.paymentStatus === 'PAID';
        const payType = isPaid ? 'paid' : 'unpaid';
        
        const clientId = sale.customerId || sale.customerPhone || sale.customerName || sale.id;

        let deliveryUSD = Number(sale.deliveryFee || 0);
        if (sale.deliveryCurrency === 'KHR' || sale.deliveryCurrency === '៛') {
            deliveryUSD = deliveryUSD / 4000;
        }

        const updateStatObj = (target) => {
            target.allClients.add(clientId);
            target[payType].deliveryFeeUSD += deliveryUSD;

            let hasWholesale = false;
            let hasRetail = false;

            if (sale.items) {
                sale.items.forEach(item => {
                    const pName = item.name || 'មិនស្គាល់ឈ្មោះ';
                    const unit = item.unit || '';
                    const productKey = `${pName}_${unit}`;
                    
                    let price = Number(item.price || 0);
                    if (sale.currency === 'KHR' || sale.currency === '៛') price = price / 4000;
                    
                    const itemQty = Number(item.qty || 0);
                    const itemTotalUSD = price * itemQty;

                    const itemCostTotalUSD = calculateItemCostUSD(item, sale.currency);
                    target[payType].itemCostTotalUSD += itemCostTotalUSD;

                    const safeType = String(item.type || '').trim();
                    const isItemWholesale = safeType.includes('បោះដុំ');

                    const cat = isItemWholesale ? 'wholesale' : 'retail';
                    
                    if (isItemWholesale) hasWholesale = true;
                    else hasRetail = true;

                    if (!target[payType][cat].products[productKey]) {
                        target[payType][cat].products[productKey] = { name: pName, unit: unit, qty: 0, usd: 0, costUsd: 0, clients: new Set() };
                    }
                    
                    target[payType][cat].products[productKey].qty += itemQty;
                    target[payType][cat].products[productKey].usd += itemTotalUSD;
                    target[payType][cat].products[productKey].costUsd += itemCostTotalUSD;
                    target[payType][cat].products[productKey].clients.add(clientId);
                    
                    target[payType][cat].itemPriceTotalUSD += itemTotalUSD;
                });
            }

            if (hasWholesale) target[payType].wholesale.clients.add(clientId);
            if (hasRetail) target[payType].retail.clients.add(clientId);
        };

        updateStatObj(stats.grand);
        if (isPP) updateStatObj(stats.pp);
        else updateStatObj(stats.prov);
    });

    filteredExpensesToPrint.value.forEach(exp => {
        let expUSD = Number(exp.amount || 0);
        if (exp.currency === 'KHR') expUSD = expUSD / 4000;
        stats.grand.totalExpensesUSD += expUSD;
    });

    const formatStat = (target) => {
        const formatCat = (catData) => ({
            itemPriceTotalUSD: catData.itemPriceTotalUSD,
            clients: catData.clients.size,
            products: Object.values(catData.products)
                .map(data => ({ ...data, clients: data.clients.size }))
                .sort((a, b) => b.usd - a.usd) 
        });

        const paidItemsTotal = target.paid.wholesale.itemPriceTotalUSD + target.paid.retail.itemPriceTotalUSD;
        const paidDeliveryTotal = target.paid.deliveryFeeUSD;
        const paidTotal = paidItemsTotal + paidDeliveryTotal;
        const totalPaidCostUSD = target.paid.itemCostTotalUSD; 

        const unpaidItemsTotal = target.unpaid.wholesale.itemPriceTotalUSD + target.unpaid.retail.itemPriceTotalUSD;
        const unpaidDeliveryTotal = target.unpaid.deliveryFeeUSD;
        const unpaidTotal = unpaidItemsTotal + unpaidDeliveryTotal;

        const totalExpensesUSD = target.totalExpensesUSD || 0;
        
        const netProfit = paidTotal - totalExpensesUSD - totalPaidCostUSD;

        return {
            totalClients: target.allClients.size,
            paid: {
                wholesale: formatCat(target.paid.wholesale),
                retail: formatCat(target.paid.retail),
                deliveryFeeUSD: target.paid.deliveryFeeUSD
            },
            unpaid: {
                wholesale: formatCat(target.unpaid.wholesale),
                retail: formatCat(target.unpaid.retail),
                deliveryFeeUSD: target.unpaid.deliveryFeeUSD
            },
            summary: {
                paidItemsTotal,
                paidDeliveryTotal,
                paidTotal,
                unpaidTotal,
                totalExpensesUSD,
                totalPaidCostUSD, 
                netProfit
            }
        };
    };

    return {
        grand: formatStat(stats.grand),
        pp: formatStat(stats.pp),
        prov: formatStat(stats.prov),
        expensesList: filteredExpensesToPrint.value
    };
});

const reportDateLabel = computed(() => {
   const categoryName = activeCategory.value === 'all' ? 'សរុប (All)' : activeCategory.value;
   let dateStr = '';
   if (dateFilterType.value === 'daily') {
       dateStr = new Intl.DateTimeFormat('km-KH', { dateStyle: 'long' }).format(new Date(selectedDate.value));
   } else if (dateFilterType.value === 'monthly') {
       dateStr = `ខែ ${monthNames[selectedMonth.value]} ឆ្នាំ ${selectedYear.value}`;
   } else if (dateFilterType.value === 'yearly') {
       dateStr = `ឆ្នាំ ${selectedYear.value}`;
   } else if (dateFilterType.value === 'custom') {
       dateStr = `${customStart.value} ដល់ ${customEnd.value}`;
   }
   return `${dateStr} - ${categoryName}`;
});

const reportAdminLabel = computed(() => {
    const isAllSelected = selectedAdminsForExport.value.length === displayedData.value.length;
    if (isAllSelected) return 'ទិន្នន័យរួមទាំងអស់ (All Admins)';
    if (selectedAdminsForExport.value.length === 1) {
        const found = adminsList.value.find(a => a.id === selectedAdminsForExport.value[0]);
        return found ? found.fullName : 'អ្នកគ្រប់គ្រង ១ នាក់';
    }
    return `អ្នកគ្រប់គ្រង ${selectedAdminsForExport.value.length} នាក់`;
});

// 🌟 Receive Event from Preview Modal & Execute Dynamic Export 🌟
const executeExport = async ({ type, config }) => {
    // ❌ កុំទាន់បិទ Modal នៅទីនេះ (ដើម្បីឱ្យវាបង្ហាញ Loading UI)
    // showPreviewModal.value = false; 

    try {
        if (type === 'print') {
            executeNativePrint(rowsToPrint.value, allSales.value, advancedPrintStats.value, reportDateLabel.value, reportAdminLabel.value, unitSettings.value, config);
            // ទុកពេលបន្តិចសឹមបិទ Modal
            setTimeout(() => { showPreviewModal.value = false; }, 1000);
            
        } else if (type === 'excel') {
            // ត្រូវមាន await ដើម្បីរង់ចាំវាទាញយកចប់ ទើបបង្ហាញ Alert និងបិទ Modal
            await generateExcel(rowsToPrint.value, allSales.value, advancedPrintStats.value, reportDateLabel.value, reportAdminLabel.value, adminName.value, unitSettings.value, processing.value, config);
            triggerAlert('success', 'ជោគជ័យ', 'ទាញយក Excel បានជោគជ័យ!');
            showPreviewModal.value = false; 
            
        } else {
            await generatePDF(rowsToPrint.value, allSales.value, advancedPrintStats.value, reportDateLabel.value, reportAdminLabel.value, adminName.value, unitSettings.value, processing.value, printStaging.value, config);
            triggerAlert('success', 'ជោគជ័យ', 'ទាញយក PDF បានជោគជ័យ!');
            showPreviewModal.value = false; 
        }
    } catch (e) {
        console.error(e);
        triggerAlert('error', 'បរាជ័យ', 'មិនអាចបង្កើតរបាយការណ៍បានទេ');
        processing.value.active = false;
    }
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