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

          <div v-if="showMobileFilters" class="md:hidden grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-slate-100 px-6">
              <button @click="openPrintModal('print'); showMobileFilters = false" class="flex items-center justify-center gap-2 py-3.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-sm active:scale-95 transition-all shadow-md">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                  បោះពុម្ព
              </button>
              <button @click="openPrintModal('pdf'); showMobileFilters = false" class="flex items-center justify-center gap-2 py-3.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold text-sm active:scale-95 transition-all shadow-md shadow-rose-500/30">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                  ទាញយក PDF
              </button>
          </div>
      </div>

      <div class="px-4 md:px-8 max-w-[90rem] mx-auto w-full">
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
                v-model:activeCategory="activeCategory"
                v-model:activityFilter="activityFilter"
                :showMobileFilters="showMobileFilters"
                @toggleMobileFilters="showMobileFilters = !showMobileFilters"
                @print="openPrintModal('print')"
                @pdf="openPrintModal('pdf')"
            />
        </div>
      </div>

      <OwnerReportBottomSummary 
         v-if="displayedData.length > 0 && activityFilter !== 'inactive'"
         :grandTotals="grandTotals"
         :unitSettings="unitSettings"
         class="px-4 md:px-8 max-w-[90rem] mx-auto w-full mt-6"
      />

    </div>

    <transition enter-active-class="duration-200 ease-out" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100" leave-active-class="duration-150 ease-in" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
        <div v-if="printModal.show" class="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm font-khmer">
            <div class="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
                <div class="flex items-center gap-3 mb-4 shrink-0">
                    <div class="w-12 h-12 rounded-full flex items-center justify-center" :class="printModal.type === 'pdf' ? 'bg-rose-50 text-rose-500' : 'bg-slate-100 text-slate-700'">
                        <svg v-if="printModal.type === 'pdf'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                        <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                    </div>
                    <div>
                        <h3 class="font-black text-slate-800 text-lg">កំណត់របាយការណ៍</h3>
                        <p class="text-xs font-bold text-slate-500">ទាញយកជាទម្រង់ {{ printModal.type === 'pdf' ? 'ឯកសារ PDF' : 'បោះពុម្ព (Print)' }}</p>
                    </div>
                </div>

                <div class="mb-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 flex-1 overflow-y-auto custom-scrollbar">
                    <label class="block text-[11px] font-black text-slate-500 mb-3 uppercase tracking-wide border-b border-slate-200 pb-2">ជ្រើសរើសទិន្នន័យអ្នកគ្រប់គ្រង</label>
                    <div class="space-y-1.5">
                        <label class="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors" :class="printModal.selectAll ? 'bg-indigo-100 border-indigo-200 border text-indigo-800' : 'hover:bg-slate-100 border border-transparent'">
                            <input type="checkbox" v-model="printModal.selectAll" @change="toggleSelectAllAdmins" class="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500">
                            <span class="font-black text-[14px]">👉 ទាំងអស់ (All Admins)</span>
                        </label>
                        <div class="h-px bg-slate-200 my-2"></div>
                        <label v-for="admin in displayedData" :key="admin.originalAdminId" class="flex items-center gap-3 p-2.5 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200">
                            <input type="checkbox" :value="admin.originalAdminId" v-model="printModal.selectedAdmins" @change="checkSelectAllStatus" class="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500">
                            <div class="flex flex-col">
                                <span class="font-bold text-[13px] text-slate-700">{{ admin.fullName }}</span>
                                <span v-if="!admin.hasSales" class="text-[10px] text-slate-400 font-bold">គ្មានការលក់</span>
                            </div>
                        </label>
                    </div>
                </div>

                <div class="flex gap-3 shrink-0 pt-2">
                    <button @click="printModal.show = false" class="flex-1 py-3.5 rounded-xl font-bold text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 transition-colors shadow-sm">បោះបង់</button>
                    <button @click="confirmPrintAction" :disabled="printModal.selectedAdmins.length === 0" class="flex-[1.5] py-3.5 rounded-xl font-black text-white shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed" :class="printModal.type === 'pdf' ? 'bg-gradient-to-r from-red-500 to-rose-600 shadow-rose-500/30' : 'bg-slate-800 hover:bg-slate-900 shadow-slate-900/20'">
                        បន្តការទាញយក
                    </button>
                </div>
            </div>
        </div>
    </transition>

    <OwnerExpenseSlide 
        v-if="showExpenseSlide" 
        :show="showExpenseSlide" 
        :activeAdmins="adminsWithSales"
        :expensesList="expensesInScope"
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

    <transition enter-active-class="duration-300 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="processing.active" class="fixed inset-0 z-[999999] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md font-khmer">
            <div class="w-full max-w-sm bg-[#18181b] border border-white/10 rounded-3xl p-10 shadow-2xl relative flex flex-col items-center text-center animate-fade-in-up">
                <div class="relative w-20 h-20 mb-8">
                    <div class="absolute inset-0 rounded-full border-4 border-white/5"></div>
                    <div class="absolute inset-0 rounded-full border-4 border-t-rose-500 border-r-rose-500 border-b-transparent border-l-transparent animate-spin"></div>
                    <div class="absolute inset-0 flex items-center justify-center font-black text-white text-lg font-mono">{{ processing.progress }}%</div>
                </div>
                <h3 class="text-xl font-bold text-white mb-2">{{ processing.message }}</h3>
                <div class="w-full h-1.5 bg-black/50 rounded-full overflow-hidden border border-white/5 mt-2">
                    <div class="h-full bg-gradient-to-r from-red-500 to-rose-600 transition-all duration-300 ease-out" :style="{ width: `${processing.progress}%` }"></div>
                </div>
            </div>
        </div>
    </transition>

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
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

import OwnerReportHeader from './report/OwnerReportHeader.vue';
import OwnerReportSummaryCards from './report/OwnerReportSummaryCards.vue';
import OwnerReportAdminList from './report/OwnerReportAdminList.vue';
import OwnerReportBottomSummary from './report/OwnerReportBottomSummary.vue';
import CustomAlert from '@/components/shared/CustomAlert.vue'; 
import OwnerExpenseSlide from './report/OwnerExpenseSlide.vue'; 

const isLoading = ref(true);
const adminName = ref('Owner');
const adminsList = ref([]);
const allSales = ref([]); 
const allSellers = ref([]); 
const unitSettings = ref([]); 
const allExpenses = ref([]); 

// Listeners for Realtime updates
let unsubscribeAdmins = null;
let unsubscribeSales = null;
let unsubscribeSellers = null;
let unsubscribeSettings = null;
let unsubscribeExpenses = null;

const showMobileFilters = ref(false);
const showSummaryCards = ref(false); 
const showExpenseSlide = ref(false); 

const printModal = reactive({ 
    show: false, 
    type: 'pdf', 
    selectAll: true,
    selectedAdmins: [] 
});

const activeCategory = ref('all'); 
const dateFilterType = ref('monthly'); 
const activityFilter = ref('all'); 
const selectedDate = ref(new Date().toISOString().split('T')[0]);
const selectedYear = ref(new Date().getFullYear());
const selectedMonth = ref(new Date().getMonth());
const customStart = ref(new Date().toISOString().split('T')[0]);
const customEnd = ref(new Date().toISOString().split('T')[0]);

const printStaging = ref(null);
const processing = ref({ active: false, message: '', progress: 0 });
const monthNames = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'];

const alert = reactive({ show: false, title: '', message: '', type: 'success' });
const triggerAlert = (type, title, message) => {
  alert.type = type; alert.title = title; alert.message = message; alert.show = true;
  setTimeout(() => alert.show = false, 3000);
};

// 🌟 Realtime Data Fetching 🌟
onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
       adminName.value = user.displayName || 'Owner';
       try {
          const adminQ = query(collection(db, 'users'), where('role', '==', 'admin'));
          unsubscribeAdmins = onSnapshot(adminQ, (snapshot) => {
              adminsList.value = snapshot.docs
                  .map(doc => ({ id: doc.id, ...doc.data() }))
                  .filter(a => a.isDeleted === false || a.isDeleted === "false" || !a.isDeleted);
          });

          unsubscribeSales = onSnapshot(collection(db, 'sales_reports'), (snapshot) => {
              allSales.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
              
              if (allSales.value.length > 0 && isLoading.value) {
                 const validSales = allSales.value.filter(s => s.createdAt || s.date);
                 if (validSales.length > 0) {
                     const latestDate = validSales.map(s => new Date(s.createdAt || s.date)).sort((a,b) => b - a)[0];
                     selectedYear.value = latestDate.getFullYear();
                     selectedMonth.value = latestDate.getMonth();
                     selectedDate.value = latestDate.toISOString().split('T')[0];
                 }
              }
              isLoading.value = false;
          });

          const sellerQ = query(collection(db, 'users'), where('role', '==', 'seller'));
          unsubscribeSellers = onSnapshot(sellerQ, (snapshot) => {
              allSellers.value = snapshot.docs
                  .map(doc => ({ id: doc.id, ...doc.data() }))
                  .filter(s => s.isDeleted === false || s.isDeleted === "false" || !s.isDeleted);
          });

          unsubscribeSettings = onSnapshot(collection(db, 'settings_units'), (snapshot) => {
              unitSettings.value = snapshot.docs.map(doc => doc.data());
          });

          unsubscribeExpenses = onSnapshot(collection(db, 'daily_expenses'), (snapshot) => {
              allExpenses.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          });

       } catch (error) {
          console.error("Error", error);
          isLoading.value = false;
       }
    }
  });
});

onUnmounted(() => {
    if (unsubscribeAdmins) unsubscribeAdmins();
    if (unsubscribeSales) unsubscribeSales();
    if (unsubscribeSellers) unsubscribeSellers();
    if (unsubscribeSettings) unsubscribeSettings();
    if (unsubscribeExpenses) unsubscribeExpenses();
});

const isDateInScope = (dateInput) => {
   if(!dateInput) return false;
   let date;
   if (typeof dateInput.toDate === 'function') date = dateInput.toDate();
   else date = new Date(dateInput);
   if (isNaN(date.getTime())) return false;

   const dYear = date.getFullYear();
   const dMonth = date.getMonth();
   const year = date.getFullYear();
   const month = String(date.getMonth() + 1).padStart(2, '0');
   const day = String(date.getDate()).padStart(2, '0');
   const dDateStr = `${year}-${month}-${day}`; 
   
   if (dateFilterType.value === 'daily') return dDateStr === selectedDate.value;
   if (dateFilterType.value === 'monthly') return dMonth === parseInt(selectedMonth.value) && dYear === parseInt(selectedYear.value);
   if (dateFilterType.value === 'yearly') return dYear === parseInt(selectedYear.value);
   if (dateFilterType.value === 'custom') return dDateStr >= customStart.value && dDateStr <= customEnd.value;
   return false;
};

const expensesInScope = computed(() => {
    return allExpenses.value.filter(exp => isDateInScope(exp.createdAt || exp.date));
});

const availableYears = computed(() => {
    if (allSales.value.length === 0) return [new Date().getFullYear()];
    const years = new Set(allSales.value.map(s => new Date(s.createdAt || s.date).getFullYear()));
    return Array.from(years).sort((a, b) => b - a);
});

const availableMonths = computed(() => {
    if (allSales.value.length === 0) return [{ index: new Date().getMonth(), name: monthNames[new Date().getMonth()] }];
    const yearSales = allSales.value.filter(s => new Date(s.createdAt || s.date).getFullYear() === parseInt(selectedYear.value));
    const months = new Set(yearSales.map(s => new Date(s.createdAt || s.date).getMonth()));
    return Array.from(months).sort((a, b) => a - b).map(mIndex => ({ index: mIndex, name: monthNames[mIndex] }));
});

watch(selectedYear, () => {
    const months = availableMonths.value;
    if (!months.find(m => m.index === selectedMonth.value)) {
        if(months.length > 0) selectedMonth.value = months[months.length - 1].index;
    }
});

// 🌟 ធ្វើបច្ចុប្បន្នភាព baseCalculatedData ឱ្យរួមបញ្ចូលទិន្នន័យជាជួរតែមួយ មិនឱ្យស្ទួនឈ្មោះ Admin 🌟
const baseCalculatedData = computed(() => {
   if (adminsList.value.length === 0) return [];
   let rows = [];

   adminsList.value.forEach(admin => {
      const adminSellersIds = allSellers.value.filter(seller => seller.createdBy === admin.id).map(s => s.id);

      const relevantSales = allSales.value.filter(s => {
          const isMatch = s.createdBy === admin.id || adminSellersIds.includes(s.createdBy) || adminSellersIds.includes(s.uid);
          const isValid = s.paymentStatus !== 'CANCELED';
          return isMatch && isValid && isDateInScope(s.createdAt || s.date);
      });

      // Filter តាម Active Category (ដុំ ឬ រាយ ឬ ទាំងអស់)
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
      
      // បង្កើត Object តែមួយសម្រាប់ Admin ម្នាក់!
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

// 🌟 ធ្វើបច្ចុប្បន្នភាព grandTotals ដោយចាប់យកពី allSales ផ្ទាល់ដើម្បីឱ្យត្រូវ ១០០% 🌟
const grandTotals = computed(() => {
    let stats = {
        all: { usd: 0, khr: 0, clients: 0, totalUnitsCount: 0, units: {} },
        retail: { usd: 0, khr: 0, clients: 0, totalUnitsCount: 0, units: {} },
        wholesale: { usd: 0, khr: 0, clients: 0, totalUnitsCount: 0, units: {} }
    };

    const validSales = allSales.value.filter(s => s.paymentStatus !== 'CANCELED' && isDateInScope(s.createdAt || s.date));

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


// =========================================================================
// 🚀 DYNAMIC PRINT/PDF LOGIC
// =========================================================================

const openPrintModal = (type) => {
    printModal.type = type;
    printModal.selectAll = true;
    printModal.selectedAdmins = displayedData.value.map(a => a.originalAdminId);
    printModal.show = true;
};

const toggleSelectAllAdmins = () => {
    if (printModal.selectAll) {
        printModal.selectedAdmins = displayedData.value.map(a => a.originalAdminId);
    } else {
        printModal.selectedAdmins = [];
    }
};

const checkSelectAllStatus = () => {
    printModal.selectAll = printModal.selectedAdmins.length === displayedData.value.length;
};

const confirmPrintAction = () => {
    printModal.show = false;
    if (printModal.type === 'print') executeNativePrint();
    else generatePDF();
};

const rowsToPrint = computed(() => {
    return displayedData.value
        .filter(a => printModal.selectedAdmins.includes(a.originalAdminId))
        .map((item, idx) => ({ ...item, printIndex: idx + 1 }));
});

const filteredExpensesToPrint = computed(() => {
    return expensesInScope.value.filter(exp => {
        if (printModal.selectAll) return true;
        const targets = exp.targetAdmins || [];
        if (targets.includes('ALL')) return true;
        return targets.some(targetId => printModal.selectedAdmins.includes(targetId));
    });
});

const advancedPrintStats = computed(() => {
    const createEmptyStat = () => ({
        allClients: new Set(),
        paid: {
            wholesale: { products: {}, itemPriceTotalUSD: 0, clients: new Set() },
            retail: { products: {}, itemPriceTotalUSD: 0, clients: new Set() },
            deliveryFeeUSD: 0
        },
        unpaid: {
            wholesale: { products: {}, itemPriceTotalUSD: 0, clients: new Set() },
            retail: { products: {}, itemPriceTotalUSD: 0, clients: new Set() },
            deliveryFeeUSD: 0
        },
        totalExpensesUSD: 0 
    });

    const stats = {
        grand: createEmptyStat(),
        pp: createEmptyStat(),
        prov: createEmptyStat()
    };

    let filteredValidSales = allSales.value.filter(s => s.paymentStatus !== 'CANCELED' && isDateInScope(s.createdAt || s.date));

    if (!printModal.selectAll) {
        const targetAdminSellersIds = allSellers.value.filter(s => printModal.selectedAdmins.includes(s.createdBy)).map(s => s.id);
        filteredValidSales = filteredValidSales.filter(s => {
            return printModal.selectedAdmins.includes(s.createdBy) || targetAdminSellersIds.includes(s.createdBy) || targetAdminSellersIds.includes(s.uid);
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

                    // 🌟 ប្រើប្រាស់ type ពី Database ផ្ទាល់ដើម្បីញែកតាម Item Level 🌟
                    const safeType = String(item.type || '').trim();
                    const isItemWholesale = safeType.includes('បោះដុំ');

                    const cat = isItemWholesale ? 'wholesale' : 'retail';
                    
                    if (isItemWholesale) hasWholesale = true;
                    else hasRetail = true;

                    if (!target[payType][cat].products[productKey]) {
                        target[payType][cat].products[productKey] = { name: pName, unit: unit, qty: 0, usd: 0, clients: new Set() };
                    }
                    
                    target[payType][cat].products[productKey].qty += itemQty;
                    target[payType][cat].products[productKey].usd += itemTotalUSD;
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

        const unpaidItemsTotal = target.unpaid.wholesale.itemPriceTotalUSD + target.unpaid.retail.itemPriceTotalUSD;
        const unpaidDeliveryTotal = target.unpaid.deliveryFeeUSD;
        const unpaidTotal = unpaidItemsTotal + unpaidDeliveryTotal;

        const totalExpensesUSD = target.totalExpensesUSD || 0;
        const netProfit = paidTotal - totalExpensesUSD;

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
   if (dateFilterType.value === 'daily') dateStr = new Intl.DateTimeFormat('km-KH', { dateStyle: 'long' }).format(new Date(selectedDate.value));
   if (dateFilterType.value === 'monthly') dateStr = `ខែ ${monthNames[selectedMonth.value]} ឆ្នាំ ${selectedYear.value}`;
   if (dateFilterType.value === 'yearly') dateStr = `ឆ្នាំ ${selectedYear.value}`;
   if (dateFilterType.value === 'custom') dateStr = `${selectedDateFormatter(customStart.value)} ដល់ ${selectedDateFormatter(customEnd.value)}`;
   return `${dateStr} - ${categoryName}`;
});

const reportAdminLabel = computed(() => {
    if (printModal.selectAll) return 'ទិន្នន័យរួមទាំងអស់ (All Admins)';
    if (printModal.selectedAdmins.length === 1) {
        const found = adminsList.value.find(a => a.id === printModal.selectedAdmins[0]);
        return found ? found.fullName : 'អ្នកគ្រប់គ្រង ១ នាក់';
    }
    return `អ្នកគ្រប់គ្រង ${printModal.selectedAdmins.length} នាក់`;
});

const selectedDateFormatter = (dateStr) => {
    if(!dateStr) return '';
    return new Intl.DateTimeFormat('km-KH', { dateStyle: 'medium' }).format(new Date(dateStr));
};

const translateUnit = (unitVal) => {
    if (!unitVal) return '';
    const safeVal = String(unitVal);
    const found = unitSettings.value.find(u => String(u.value) === safeVal);
    if (found) return found.label;
    const u = safeVal.toLowerCase().trim();
    if (u === 'bottle' || u === 'bottles') return 'ដប';
    if (u === 'pack' || u === 'packs') return 'កញ្ចប់';
    if (u === 'case' || u === 'cases') return 'កេះ';
    if (u === 'set' || u === 'sets') return 'ឈុត';
    return safeVal; 
};

const fC = (val) => Number(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fQ = (val) => Number(val).toLocaleString('en-US');

// =========================================================================
// 🖨️ PDF & NATIVE PRINT GENERATOR
// =========================================================================

const generateMainTableHTML = (rows) => {
    if (rows.length === 0) return '';
    
    const renderRow = (item) => {
        let salesHTML = '';
        if (item.hasSales) {
            salesHTML = `<div style="display: flex; flex-wrap: wrap; gap: 8px;">` + 
                Object.entries(item.unitCounts || {}).filter(([u, c]) => c > 0).map(([u, c]) => 
                    `<div style="white-space: nowrap;">
                        <span style="font-weight: 900; color: #1e293b; font-size: 14px;">${c.toLocaleString()}</span>
                        <span style="color: #475569; font-size: 12px; font-weight: bold; margin-left: 2px;">${translateUnit(u)}</span>
                     </div>`
                ).join('') + `</div>`;
        } else {
            salesHTML = `<span style="font-size: 13px; font-weight: bold; color: #94a3b8;">គ្មានការលក់</span>`;
        }

        let revenueHTML = item.hasSales ? `
            <div style="text-align: right;">
                <span style="color:#059669; font-size:16px; font-weight:900; display: block;">${item.revenueUSD.toLocaleString()} $</span>
                <span style="color:#2563eb; font-size:13px; font-weight:bold; display: block; margin-top: 2px;">${item.revenueKHR.toLocaleString()} ៛</span>
            </div>` : `<div style="text-align: right; color:#94a3b8; font-weight:bold; font-size:14px;">-</div>`;

        let catBadge = '';
        if (item.category === 'ដុំ និង រាយ') {
            catBadge = `<span style="color: #0ea5e9; font-size: 11px; font-weight: bold; background: #e0f2fe; padding: 2px 6px; border-radius: 4px;">ដុំ + រាយ</span>`;
        } else if (item.category === 'បោះដុំ') {
            catBadge = `<span style="color: #7e22ce; font-size: 11px; font-weight: bold; background: #f3e8ff; padding: 2px 6px; border-radius: 4px;">បោះដុំ</span>`;
        } else if (item.hasSales) {
            catBadge = `<span style="color: #475569; font-size: 11px; font-weight: bold; background: #f1f5f9; padding: 2px 6px; border-radius: 4px;">លក់រាយ</span>`;
        } else {
            catBadge = `-`;
        }

        return `
            <tr style="break-inside: avoid; page-break-inside: avoid; border-bottom: 1px dashed #e2e8f0;">
                <td style="padding: 14px 10px; text-align: center; vertical-align: top; font-weight: 900; color: #94a3b8; font-size: 14px;">${item.printIndex}</td>
                <td style="padding: 14px 10px; vertical-align: top;"><p style="font-weight: bold; color: #1e293b; font-size: 15px; margin: 0;">${item.fullName}</p></td>
                <td style="padding: 14px 10px; vertical-align: top; text-align: center;">${catBadge}</td>
                <td style="padding: 14px 10px; vertical-align: top;">${salesHTML}</td>
                <td style="padding: 14px 10px; text-align: center; vertical-align: top; font-weight: bold; color: #334155; font-size: 15px;">${item.hasSales ? item.totalClients.toLocaleString() + ' នាក់' : '-'}</td>
                <td style="padding: 14px 10px; vertical-align: top;">${revenueHTML}</td>
            </tr>
        `;
    };

    const tableRows = rows.map(renderRow).join('');

    return `
        <table style="width: 100%; text-align: left; border-collapse: collapse; margin-bottom: 40px; font-family: 'Kantumruy Pro', 'Battambang', sans-serif;">
            <thead style="color: #475569; font-size: 13px; font-weight: 900; display: table-header-group; background: #f8fafc;">
                <tr>
                    <th style="padding: 12px 10px; width: 5%; text-align: center; border-bottom: 2px solid #cbd5e1;">#</th>
                    <th style="padding: 12px 10px; width: 25%; border-bottom: 2px solid #cbd5e1;">អ្នកគ្រប់គ្រង</th>
                    <th style="padding: 12px 10px; width: 12%; border-bottom: 2px solid #cbd5e1; text-align: center;">ប្រភេទ</th>
                    <th style="padding: 12px 10px; width: 30%; border-bottom: 2px solid #cbd5e1;">ចំនួនលក់សរុប</th>
                    <th style="padding: 12px 10px; width: 10%; text-align: center; border-bottom: 2px solid #cbd5e1;">អតិថិជន</th>
                    <th style="padding: 12px 10px; width: 18%; text-align: right; border-bottom: 2px solid #cbd5e1;">ចំណូល</th>
                </tr>
            </thead>
            <tbody>${tableRows}</tbody>
        </table>
    `;
};

const renderProductGrid = (productsArray) => {
    if (!productsArray || productsArray.length === 0) {
        return `<div style="width: 100%; text-align: center; padding: 15px; color: #94a3b8; font-size: 13px; font-weight: bold; border: 1px dashed #cbd5e1; border-radius: 8px;">គ្មានទិន្នន័យ</div>`;
    }
    
    const cards = productsArray.map((p, index) => {
        const unitPrice = p.qty > 0 ? (p.usd / p.qty) : 0;
        const isEven = index % 2 === 0;
        
        return `
        <div style="width: calc(50% - 6px); border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; background: #fff; box-sizing: border-box; margin-bottom: 12px; float: left; margin-right: ${isEven ? '12px' : '0'};">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
                <span style="font-weight: 700; color: #1e293b; font-size: 13px; line-height: 1.4; padding-right: 10px; flex: 1;">📦 ${p.name}</span>
                <span style="font-weight: 900; color: #0f172a; font-size: 14px;">${fC(p.usd)} $</span>
            </div>
            <div style="font-size: 12px; color: #475569; display: flex; justify-content: space-between; border-top: 1px dashed #e2e8f0; padding-top: 6px;">
                <span>អតិថិជន: <span style="font-weight:700; color:#334155;">${fQ(p.clients)}</span> នាក់</span>
                <span>បរិមាណ: <span style="font-weight:900; color:#0ea5e9; font-size:13px;">${fQ(p.qty)} ${translateUnit(p.unit)}</span> <span style="color:#94a3b8; font-weight:bold;">(${fC(unitPrice)}$)</span></span>
            </div>
        </div>
        `;
    }).join('');

    return `<div style="overflow: hidden; width: 100%;">${cards}</div>`;
};

const renderCategoryBlock = (title, dataObj, accentColor) => {
    if (dataObj.products.length === 0) return '';
    return `
        <div style="margin-bottom: 15px; background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #f1f5f9;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-left: 4px solid ${accentColor}; padding: 0 0 0 10px; margin-bottom: 12px;">
                <span style="font-weight: 900; color: ${accentColor}; font-size: 15px;">${title} <span style="font-size:12px; color:#64748b; margin-left: 8px; font-weight: bold;">(អតិថិជនសរុប: ${fQ(dataObj.clients)} នាក់)</span></span>
                <span style="font-weight: 900; color: #0f172a; font-size: 14px;">សរុបតម្លៃទំនិញសុទ្ធ: <span style="color: ${accentColor};">${fC(dataObj.itemPriceTotalUSD)} $</span></span>
            </div>
            ${renderProductGrid(dataObj.products)}
        </div>
    `;
};

const generateAccountingSectionHTML = (title, data, isGrandTotal = false, expensesList = []) => {
    
    let expensesHTML = '';
    let footerSummaryHTML = '';

    if (isGrandTotal) {
        if (expensesList.length > 0) {
            const expRows = expensesList.map((exp, idx) => {
                let expUSD = Number(exp.amount || 0);
                if (exp.currency === 'KHR') expUSD = expUSD / 4000;
                return `
                    <tr>
                        <td style="padding: 8px 10px; border-bottom: 1px solid #fecdd3; font-weight: bold; color: #881337;">${idx + 1}. ${exp.reason}</td>
                        <td style="padding: 8px 10px; border-bottom: 1px solid #fecdd3; text-align: center; color: #9f1239;">${exp.requester}</td>
                        <td style="padding: 8px 10px; border-bottom: 1px solid #fecdd3; text-align: right; font-weight: 900; color: #be123c;">${fC(expUSD)} $</td>
                    </tr>
                `;
            }).join('');

            expensesHTML = `
                <div style="padding: 20px; border-bottom: 2px solid #e2e8f0; background: #fff1f2;">
                    <h4 style="color: #be123c; margin: 0 0 12px 0; font-size: 16px; font-weight: 900;">💸 ការចំណាយទូទៅ (EXPENSES)</h4>
                    <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                        <thead>
                            <tr style="border-bottom: 2px solid #fecdd3;">
                                <th style="padding: 10px; text-align: left; color: #9f1239;">បរិយាយការចំណាយ</th>
                                <th style="padding: 10px; text-align: center; color: #9f1239;">អ្នកស្នើ</th>
                                <th style="padding: 10px; text-align: right; color: #9f1239;">តម្លៃ (USD)</th>
                            </tr>
                        </thead>
                        <tbody>${expRows}</tbody>
                    </table>
                </div>
            `;
        }

        const profitColor = data.summary.netProfit >= 0 ? '#059669' : '#e11d48';
        
        footerSummaryHTML = `
            <div style="background: #f8fafc; padding: 25px 30px; display: flex; flex-direction: column; align-items: flex-end; page-break-inside: avoid;">
                <div style="width: 450px; font-size: 14px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #334155;">
                        <span>ចំណូលសរុប (ទំនិញ PAID):</span>
                        <span style="font-weight: 700;">${fC(data.summary.paidItemsTotal)} $</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #334155;">
                        <span>ចំណូលសរុប (ថ្លៃដឹក PAID):</span>
                        <span style="font-weight: 700;">${fC(data.summary.paidDeliveryTotal)} $</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 12px; color: #059669; font-weight: bold; border-bottom: 1px dashed #cbd5e1; padding-bottom: 12px;">
                        <span>ចំណូលសរុប (ទំនិញ + ថ្លៃដឹក):</span>
                        <span style="font-size: 16px; font-weight: 900;">${fC(data.summary.paidTotal)} $</span>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #d97706; font-weight: bold;">
                        <span>មិនទាន់ទូទាត់សរុប (ទំនិញ+ថ្លៃដឹក PENDING):</span>
                        <span style="font-size: 15px; font-weight: 900;">- ${fC(data.summary.unpaidTotal)} $</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 15px; color: #be123c; font-weight: bold; border-bottom: 2px solid #e2e8f0; padding-bottom: 15px;">
                        <span>ចំណាយសរុប (Expenses):</span>
                        <span style="font-size: 15px; font-weight: 900;">- ${fC(data.summary.totalExpensesUSD)} $</span>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; color: #0f172a;">
                        <span style="font-weight: 900; text-transform: uppercase;">ប្រាក់ចំណេញសុទ្ធ (Net Profit):</span>
                        <span style="font-size: 24px; font-weight: 900; background: #e2e8f0; padding: 4px 12px; border-radius: 8px; color: ${profitColor};">${fC(data.summary.netProfit)} $</span>
                    </div>
                </div>
            </div>
        `;
    } else {
        footerSummaryHTML = `
            <div style="padding: 20px; background: #f8fafc; text-align: right; display: flex; justify-content: flex-end; align-items: center; page-break-inside: avoid; border-top: 1px solid #e2e8f0;">
                <div style="width: 350px; font-size: 13px; text-align: left;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 6px; color: #334155;">
                        <span>ចំណូលទំនិញ (PAID):</span>
                        <span style="font-weight: 700;">${fC(data.summary.paidItemsTotal)} $</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 6px; color: #334155;">
                        <span>ចំណូលថ្លៃដឹក (PAID):</span>
                        <span style="font-weight: 700;">${fC(data.summary.paidDeliveryTotal)} $</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-top: 6px; color: #059669; font-weight: bold; border-top: 1px dashed #cbd5e1; padding-top: 6px;">
                        <span>ចំណូលសរុប (ទូទាត់រួច):</span>
                        <span style="font-size: 16px; font-weight: 900;">${fC(data.summary.paidTotal)} $</span>
                    </div>
                </div>
            </div>
        `;
    }

    return `
        <div style="margin-bottom: 30px; border: 1px solid #cbd5e1; border-radius: 12px; overflow: hidden; background: white; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); font-family: 'Kantumruy Pro', 'Battambang', sans-serif;">
            
            <div style="background: #1e293b; color: white; padding: 14px 20px; display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 16px; font-weight: 900;">${title}</span>
                <span style="font-size: 13px; font-weight: bold; background: rgba(255,255,255,0.15); padding: 4px 12px; border-radius: 20px;">អតិថិជនសរុប: ${fQ(data.totalClients)} នាក់</span>
            </div>

            <div style="padding: 20px; border-bottom: 2px dashed #e2e8f0; page-break-inside: auto;">
                <h4 style="color: #059669; margin: 0 0 15px 0; font-size: 16px; font-weight: 900;">✅ ទំនិញបានទូទាត់រួច (PAID)</h4>
                
                ${renderCategoryBlock('📦 លក់បោះដុំ (WHOLESALE)', data.paid.wholesale, '#7e22ce')}
                ${renderCategoryBlock('🛍️ លក់រាយ (RETAIL)', data.paid.retail, '#0ea5e9')}
                
                <div style="text-align: right; font-size: 14px; color: #475569; background: #ecfdf5; padding: 10px 16px; border-radius: 8px; display: inline-block; float: right; border: 1px solid #a7f3d0; margin-top: 5px;">
                    ថ្លៃដឹកជញ្ជូនសរុប (Delivery Paid): <span style="color: #059669; font-weight: 900; margin-left: 8px; font-size: 15px;">${fC(data.summary.paidDeliveryTotal)} $</span>
                </div>
                <div style="clear: both;"></div>
            </div>

            <div style="padding: 20px; border-bottom: 2px solid #e2e8f0; background: #fffcf2; page-break-inside: auto;">
                <h4 style="color: #d97706; margin: 0 0 15px 0; font-size: 16px; font-weight: 900;">⏳ មិនទាន់បានទូទាត់ (PENDING)</h4>
                
                ${renderCategoryBlock('📦 លក់បោះដុំ (WHOLESALE)', data.unpaid.wholesale, '#b45309')}
                ${renderCategoryBlock('🛍️ លក់រាយ (RETAIL)', data.unpaid.retail, '#ea580c')}

                <div style="text-align: right; font-size: 14px; color: #92400e; background: #fef3c7; padding: 10px 16px; border-radius: 8px; display: inline-block; float: right; border: 1px solid #fde68a; margin-top: 5px;">
                    ថ្លៃដឹកជញ្ជូនសរុប (Delivery Pending): <span style="color: #d97706; font-weight: 900; margin-left: 8px; font-size: 15px;">${fC(data.summary.unpaidDeliveryTotal)} $</span>
                </div>
                <div style="clear: both;"></div>
            </div>

            ${expensesHTML}
            ${footerSummaryHTML}
        </div>
    `;
};


const executeNativePrint = () => {
    const stats = advancedPrintStats.value;
    
    const contentHTML = 
        generateMainTableHTML(rowsToPrint.value) +
        generateAccountingSectionHTML('📊 ទិន្នន័យរួមសរុប (រាជធានីភ្នំពេញ + ខេត្ត)', stats.grand, true, stats.expensesList) +
        generateAccountingSectionHTML('🏙️ ទិន្នន័យរាជធានីភ្នំពេញ (Phnom Penh)', stats.pp) +
        generateAccountingSectionHTML('🛣️ ទិន្នន័យតាមបណ្តាខេត្ត (Provinces)', stats.prov);

    triggerPrint(contentHTML, `Master_Sales_Report_${dateFilterType.value}`);
};

const triggerPrint = (htmlContent, title) => {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
        <html>
        <head>
            <title>${title}</title>
            <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;500;600;700&family=Battambang:wght@400;700;900&display=swap" rel="stylesheet">
            <style>
                @page { size: A4 portrait; margin: 10mm; }
                body { 
                    font-family: 'Kantumruy Pro', 'Battambang', sans-serif; 
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                    margin: 0; padding: 0;
                    background-color: white;
                }
            </style>
        </head>
        <body>
            <div style="text-align: center; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 2px solid #e2e8f0; font-family: 'Kantumruy Pro', sans-serif;">
                <h1 style="font-size: 22px; font-weight: 900; margin: 0; color: #0f172a;">របាយការណ៍គណនេយ្យលម្អិត</h1>
                <p style="font-size: 13px; color: #64748b; margin: 6px 0 0 0; font-weight: bold;">កាលបរិច្ឆេទ: <span style="color: #334155; font-weight: 900;">${reportDateLabel.value}</span> &nbsp;|&nbsp; សម្រាប់: <span style="color: #334155; font-weight: 900;">${reportAdminLabel.value}</span></p>
            </div>
            ${htmlContent}
        </body>
        </html>
    `);
    doc.close();

    iframe.contentWindow.document.fonts.ready.then(() => {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
        setTimeout(() => { document.body.removeChild(iframe); }, 1000);
    });
};

const generatePDF = async () => {
    processing.value = { active: true, message: 'កំពុងបំបែកទិន្នន័យ...', progress: 10 };
    
    try {
        const stats = advancedPrintStats.value;
        const pdfPagesContent = [];
        
        if (rowsToPrint.value.length > 0) {
            pdfPagesContent.push(generateMainTableHTML(rowsToPrint.value));
        }

        pdfPagesContent.push(generateAccountingSectionHTML('📊 ទិន្នន័យរួមសរុប (រាជធានីភ្នំពេញ + ខេត្ត)', stats.grand, true, stats.expensesList));
        pdfPagesContent.push(generateAccountingSectionHTML('🏙️ ទិន្នន័យរាជធានីភ្នំពេញ (Phnom Penh)', stats.pp));
        pdfPagesContent.push(generateAccountingSectionHTML('🛣️ ទិន្នន័យតាមបណ្តាខេត្ត (Provinces)', stats.prov));

        const pdf = new jsPDF('p', 'mm', 'a4'); 
        const pdfWidth = 210; 
        const pdfHeightA4 = 297;
        
        for (let i = 0; i < pdfPagesContent.length; i++) {
            processing.value.message = `កំពុងថតចម្លងទំព័រទី ${i+1} នៃ ${pdfPagesContent.length}...`;
            
            printStaging.value.innerHTML = `
                <div class="print-page" style="width: 1000px; min-height: 1414px; background: white; padding: 40px; box-sizing: border-box; display: flex; flex-direction: column; font-family: 'Kantumruy Pro', 'Battambang', sans-serif; line-height: 1.6; position: relative;">
                    ${i === 0 ? `
                    <div style="text-align: center; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 2px solid #e2e8f0;">
                        <h1 style="font-size: 26px; font-weight: 900; margin: 0; color: #0f172a;">របាយការណ៍គណនេយ្យលម្អិត</h1>
                        <p style="font-size: 15px; color: #64748b; margin: 8px 0 0 0; font-weight: bold;">កាលបរិច្ឆេទ: <span style="color: #334155; font-weight: 900;">${reportDateLabel.value}</span> &nbsp;|&nbsp; សម្រាប់: <span style="color: #334155; font-weight: 900;">${reportAdminLabel.value}</span></p>
                    </div>` : ''}
                    
                    <div style="flex: 1;">${pdfPagesContent[i]}</div>
                    
                    <div style="position: absolute; bottom: 40px; left: 40px; right: 40px; border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 13px; font-weight: bold; color: #94a3b8; display: flex; justify-content: space-between;">
                        <span>ដោយ: ${adminName.value}</span>
                        <span>ទំព័រទី ${i+1} នៃ ${pdfPagesContent.length}</span>
                    </div>
                </div>
            `;
            
            await nextTick(); 
            await document.fonts.ready;
            await new Promise(r => setTimeout(r, 600)); 

            const canvas = await html2canvas(printStaging.value.querySelector('.print-page'), { 
                scale: 2, useCORS: true, logging: false, backgroundColor: "#ffffff", windowWidth: 1000
            });
            
            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            if (i > 0) pdf.addPage();
            
            const imgProps = pdf.getImageProperties(imgData);
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            
            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
            processing.value.progress = 10 + Math.round(((i + 1) / pdfPagesContent.length) * 80);
        }

        processing.value.message = 'កំពុងរក្សាទុកឯកសារ...';
        processing.value.progress = 100;
        pdf.save(`Accounting_Report_${dateFilterType.value}.pdf`);
        
    } catch(e) {
        console.error(e);
        triggerAlert('error', 'បរាជ័យ', 'មិនអាចទាញយក PDF បានទេ');
    } finally {
        if(printStaging.value) printStaging.value.innerHTML = '';
        processing.value.active = false;
    }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;500;600;700&family=Battambang:wght@400;700;900&display=swap');

.font-khmer { 
    font-family: 'Kantumruy Pro', 'Battambang', sans-serif; 
}
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
.animate-fade-in-up { animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }

@media print { .print\:hidden { display: none !important; } }
</style>