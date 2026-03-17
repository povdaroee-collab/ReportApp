<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-[99999]">
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-slate-900/70 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto custom-scrollbar">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95 translate-y-8" enter-to="opacity-100 scale-100 translate-y-0" leave="duration-200 ease-in" leave-from="opacity-100 scale-100 translate-y-0" leave-to="opacity-0 scale-95 translate-y-8">
            <DialogPanel class="w-full max-w-6xl transform overflow-hidden rounded-[2rem] bg-[#F8FAFC] text-left align-middle shadow-2xl transition-all font-khmer flex flex-col max-h-[95vh]">
              
              <div class="px-6 py-5 bg-white border-b border-slate-200 flex justify-between items-center shrink-0">
                <div>
                  <DialogTitle as="h3" class="text-xl font-black text-slate-800 flex items-center gap-2">
                    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 01-2-2z"></path></svg>
                    របាយការណ៍សង្ខេបលម្អិត
                  </DialogTitle>
                </div>
                <button @click="closeModal" class="p-2 rounded-full bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-600 transition-colors">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div class="p-4 md:px-6 md:pt-5 bg-white border-b border-slate-200 flex flex-col gap-4 shrink-0">
                
                <div class="flex flex-col xl:flex-row justify-between gap-4">
                  <div class="flex flex-wrap items-center gap-3 w-full xl:w-auto overflow-x-auto no-scrollbar">
                    <div class="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
                      <button @click="modalDateType = 'day'" :class="modalDateType === 'day' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'" class="px-4 py-2 rounded-lg text-xs font-bold transition-all">ថ្ងៃ</button>
                      <button @click="modalDateType = 'month'" :class="modalDateType === 'month' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'" class="px-4 py-2 rounded-lg text-xs font-bold transition-all">ខែ</button>
                      <button @click="modalDateType = 'year'" :class="modalDateType === 'year' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'" class="px-4 py-2 rounded-lg text-xs font-bold transition-all">ឆ្នាំ</button>
                      <button @click="modalDateType = 'range'" :class="modalDateType === 'range' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'" class="px-4 py-2 rounded-lg text-xs font-bold transition-all">ចន្លោះ</button>
                    </div>

                    <div class="flex items-center gap-2 shrink-0">
                      <input v-if="modalDateType === 'day'" type="date" v-model="modalSpecificDate" class="bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-bold outline-none focus:border-blue-500 cursor-pointer">
                      
                      <template v-if="modalDateType === 'month'">
                        <select v-model="modalSelectedMonth" class="bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-bold outline-none focus:border-blue-500 cursor-pointer">
                          <option v-for="(m, i) in khmerMonths" :key="i" :value="i">{{ m }}</option>
                        </select>
                        <select v-model="modalSelectedYear" class="bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-bold outline-none focus:border-blue-500 cursor-pointer">
                          <option v-for="y in availableYears" :key="y" :value="y">{{ y }}</option>
                        </select>
                      </template>

                      <select v-if="modalDateType === 'year'" v-model="modalSelectedYear" class="bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-bold outline-none focus:border-blue-500 cursor-pointer">
                        <option v-for="y in availableYears" :key="y" :value="y">{{ y }}</option>
                      </select>

                      <template v-if="modalDateType === 'range'">
                        <input type="date" v-model="modalCustomStart" class="bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-bold outline-none focus:border-blue-500 cursor-pointer">
                        <span class="text-slate-400 font-bold">-</span>
                        <input type="date" v-model="modalCustomEnd" class="bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-bold outline-none focus:border-blue-500 cursor-pointer">
                      </template>
                    </div>
                  </div>

                  <div class="flex items-center gap-2 bg-slate-50 p-1.5 rounded-[14px] border border-slate-100 shrink-0">
                    <span v-if="isExporting" class="px-3 text-xs font-bold text-amber-500 animate-pulse">កំពុងដំណើរការ...</span>
                    <button @click="handleModalCopy" :disabled="aggregatedModalProducts.length === 0 || isExporting" title="ចម្លងទិន្នន័យ (Copy)" class="w-9 h-9 flex items-center justify-center bg-white text-slate-500 hover:text-indigo-600 rounded-xl shadow-sm border border-slate-200 transition-all disabled:opacity-50 active:scale-95">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                    </button>
                    <button @click="executeExport('image')" :disabled="aggregatedModalProducts.length === 0 || isExporting" title="ទាញយករូបភាព (Image)" class="w-9 h-9 flex items-center justify-center bg-white text-slate-500 hover:text-sky-600 rounded-xl shadow-sm border border-slate-200 transition-all disabled:opacity-50 active:scale-95">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    </button>
                    <button @click="executeExport('pdf')" :disabled="aggregatedModalProducts.length === 0 || isExporting" title="ទាញយក PDF" class="w-9 h-9 flex items-center justify-center bg-white text-rose-500 hover:text-rose-700 rounded-xl shadow-sm border border-rose-200 transition-all disabled:opacity-50 active:scale-95">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    </button>
                    <button @click="executeExport('excel')" :disabled="aggregatedModalProducts.length === 0 || isExporting" title="ទាញយក Excel" class="w-9 h-9 flex items-center justify-center bg-emerald-500 text-white hover:bg-emerald-600 rounded-xl shadow-sm transition-all disabled:opacity-50 active:scale-95">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    </button>
                  </div>
                </div>

                <div class="flex flex-col lg:flex-row items-center gap-3">
                  
                  <div class="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 w-full lg:w-auto h-[38px] shrink-0">
                    <svg class="w-4 h-4 text-slate-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    <select v-model="modalSelectedAdmin" class="bg-transparent border-none outline-none text-xs font-bold text-slate-700 w-full cursor-pointer">
                      <option value="ALL">Admin ទាំងអស់</option>
                      <option v-for="admin in modalAdminsList" :key="admin.id" :value="admin.id">{{ admin.name }}</option>
                    </select>
                  </div>

                  <div class="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0 w-full lg:w-auto">
                    <button @click="modalPaymentFilter = 'ALL'" :class="modalPaymentFilter === 'ALL' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'" class="flex-1 lg:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-all">ទាំងអស់</button>
                    <button @click="modalPaymentFilter = 'PAID'" :class="modalPaymentFilter === 'PAID' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-500 hover:text-emerald-600'" class="flex-1 lg:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-all">PAID</button>
                    <button @click="modalPaymentFilter = 'PENDING'" :class="modalPaymentFilter === 'PENDING' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-500 hover:text-amber-600'" class="flex-1 lg:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-all">PENDING</button>
                  </div>

                  <div class="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0 w-full lg:w-auto">
                    <button @click="modalLocationFilter = 'ALL'" :class="modalLocationFilter === 'ALL' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'" class="flex-1 lg:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-all">ទាំងអស់</button>
                    <button @click="modalLocationFilter = 'PP'" :class="modalLocationFilter === 'PP' ? 'bg-blue-500 text-white shadow-sm' : 'text-slate-500 hover:text-blue-600'" class="flex-1 lg:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-all">ភ្នំពេញ</button>
                    <button @click="modalLocationFilter = 'PROV'" :class="modalLocationFilter === 'PROV' ? 'bg-indigo-500 text-white shadow-sm' : 'text-slate-500 hover:text-indigo-600'" class="flex-1 lg:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-all">ខេត្ត</button>
                  </div>

                  <div class="relative flex-1 w-full min-w-[200px]">
                    <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></span>
                    <input v-model="modalSearchQuery" type="text" placeholder="ស្វែងរកឈ្មោះទំនិញ..." class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm font-bold text-slate-700 outline-none h-[38px]">
                  </div>
                </div>
              </div>

              <div id="modal-report-wrapper" class="flex-1 p-4 md:p-6 overflow-y-auto custom-scrollbar relative bg-[#F8FAFC]">
                <div v-if="modalIsLoading" class="text-center py-20 opacity-60">
                  <div class="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-blue-600 mx-auto mb-3"></div>
                  <p class="text-sm font-bold text-slate-500">កំពុងទាញទិន្នន័យ (Real-time)...</p>
                </div>
                <div v-else-if="aggregatedModalProducts.length === 0" class="flex flex-col items-center justify-center py-20 text-slate-400">
                  <svg class="w-16 h-16 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                  <p class="font-bold">មិនមានទិន្នន័យលក់ទេ</p>
                </div>
                <div v-else class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <table class="w-full text-left border-collapse min-w-[600px]">
                    <thead class="bg-slate-50 text-slate-500 text-xs uppercase font-black tracking-widest border-b border-slate-200">
                      <tr>
                        <th class="px-5 py-4 w-10 text-center">#</th>
                        <th class="px-5 py-4">ឈ្មោះទំនិញ</th>
                        <th class="px-5 py-4 text-center">បរិមាណសរុប (រាយ)</th>
                        <th class="px-5 py-4 text-right text-blue-600">ចំណូល (Rev)</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                      <tr v-for="(item, index) in aggregatedModalProducts" :key="index" class="hover:bg-slate-50/50">
                        <td class="px-5 py-4 text-center text-xs font-bold text-slate-400">{{ index + 1 }}</td>
                        <td class="px-5 py-4 font-bold text-slate-800 text-sm">
                          {{ item.name }}
                          <span v-if="item.isCombo" class="ml-2 text-[9px] bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded border border-amber-200">ឈុត</span>
                        </td>
                        <td class="px-5 py-4 text-center text-indigo-600 font-black">{{ item.qty.toLocaleString() }} {{ item.unitStr }}</td>
                        <td class="px-5 py-4 text-right font-black text-slate-800">{{ formatCurrency(item.revenue) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div class="bg-slate-800 p-4 md:p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 rounded-b-[2rem]">
                <div class="flex items-center gap-6">
                  <div><p class="text-[10px] text-slate-400 mb-1">តម្លៃទំនិញ</p><p class="text-xl font-black">{{ formatCurrency(modalSummary.productsTotal) }}</p></div>
                  <div class="w-px h-8 bg-slate-600"></div>
                  <div><p class="text-[10px] text-slate-400 mb-1">ថ្លៃដឹក</p><p class="text-xl font-black text-amber-400">{{ formatCurrency(modalSummary.deliveryTotal) }}</p></div>
                </div>
                <div class="text-right bg-slate-900/50 px-5 py-3 rounded-xl border border-slate-700 w-full sm:w-auto">
                  <p class="text-xs text-slate-300 font-bold mb-0.5">សរុបរួម (GRAND TOTAL)</p>
                  <p class="text-2xl font-black text-emerald-400">{{ formatCurrency(modalSummary.grandTotal) }}</p>
                </div>
              </div>

            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
  <div ref="printStaging" class="fixed top-0 left-[-9999px] pointer-events-none z-[-1] opacity-0 print:opacity-100"></div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { db } from '@/firebaseConfig';
import { collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue';
import { exportToImage, exportToPDF, exportToExcel } from './exportReport'; 
import { useNotificationStore } from '@/stores/notification';

const props = defineProps({
  isOpen: Boolean,
  stocks: Array,
  combos: Array
});
const emit = defineEmits(['close']);
const notification = useNotificationStore();

// រៀបចំកាលបរិច្ឆេទ
const modalDateType = ref('day'); 
const modalSpecificDate = ref(new Date().toISOString().split('T')[0]);
const modalSelectedMonth = ref(new Date().getMonth());
const modalSelectedYear = ref(new Date().getFullYear());
const modalCustomStart = ref(new Date().toISOString().split('T')[0]);
const modalCustomEnd = ref(new Date().toISOString().split('T')[0]);

// 🌟 តម្រង (Filters) Default ឈរលើ 'ALL'
const modalPaymentFilter = ref('ALL');
const modalLocationFilter = ref('ALL');
const modalSearchQuery = ref('');
const modalSelectedAdmin = ref('ALL'); 

// ទិន្នន័យ
const modalRawData = ref([]);
const modalIsLoading = ref(false);
let modalUnsubscribe = null;
const usersMap = ref({});

const khmerMonths = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'];
const availableYears = computed(() => { const y = new Date().getFullYear(); return [y-2, y-1, y, y+1]; });

// មុខងារ Format
const formatCurrency = (val) => Number(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " $";
const formatKhmerDate = (dStr) => { const d=new Date(dStr); return `${String(d.getDate()).padStart(2,'0')}-${khmerMonths[d.getMonth()]}-${d.getFullYear()}`; };
const translateHardcodedUnit = (u) => { const m={ bottle: 'ដប', case: 'កេះ', pack: 'កញ្ចប់', can: 'កំប៉ុង', kg: 'គីឡូ', set: 'ឈុត' }; return m[u]||u; };

const closeModal = () => emit('close');

// ទាញថ្ងៃចាប់ផ្តើម និងថ្ងៃបញ្ចប់
const getDateBounds = () => {
  let start, end;
  if (modalDateType.value === 'day') {
    const d = new Date(modalSpecificDate.value);
    start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
    end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
  } else if (modalDateType.value === 'month') {
    start = new Date(modalSelectedYear.value, modalSelectedMonth.value, 1, 0, 0, 0);
    end = new Date(modalSelectedYear.value, modalSelectedMonth.value + 1, 0, 23, 59, 59, 999);
  } else if (modalDateType.value === 'year') {
    start = new Date(modalSelectedYear.value, 0, 1, 0, 0, 0);
    end = new Date(modalSelectedYear.value, 11, 31, 23, 59, 59, 999);
  } else { // range
    start = new Date(modalCustomStart.value); start.setHours(0,0,0,0);
    end = new Date(modalCustomEnd.value); end.setHours(23, 59, 59, 999);
  }
  return { startStr: start.toISOString(), endStr: end.toISOString() };
};

// ទាញឈ្មោះ Users
const fetchUsersMapping = async () => {
  try {
    const snap = await getDocs(collection(db, 'users'));
    const map = {};
    snap.forEach(doc => {
      const data = doc.data();
      map[doc.id] = data.fullName || data.username || data.name || doc.id; 
    });
    usersMap.value = map;
  } catch (e) {
    console.error("Error fetching users map:", e);
  }
};

// ទាញទិន្នន័យ (Real-time) ផ្អែកលើថ្ងៃ
const setupModalRealtime = () => {
  modalIsLoading.value = true;
  if (modalUnsubscribe) modalUnsubscribe();
  const { startStr, endStr } = getDateBounds();
  const q = query(collection(db, 'sales_reports'), where('createdAt', '>=', startStr), where('createdAt', '<=', endStr));
  modalUnsubscribe = onSnapshot(q, (snapshot) => {
    modalRawData.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    modalIsLoading.value = false;
  });
};

onMounted(() => {
  fetchUsersMapping(); 
  if (props.isOpen) setupModalRealtime();
});

watch(() => props.isOpen, (val) => { if(val) setupModalRealtime(); else if(modalUnsubscribe) modalUnsubscribe(); });
watch([modalDateType, modalSpecificDate, modalSelectedMonth, modalSelectedYear, modalCustomStart, modalCustomEnd], () => { if(props.isOpen) setupModalRealtime(); });

// ==========================================
// 🌟 មុខងារថ្មី៖ ការច្រោះទិន្នន័យយ៉ាងឆ្លាតវៃ 🌟
// ==========================================

// មុខងារកណ្តាលដើម្បីពិនិត្យលក្ខខណ្ឌ Filter ទាំងអស់
const isInvoiceMatchingFilters = (inv, checkAdmin = true) => {
  // ១. ដកចេញវិក្កយបត្រដែល CANCELED
  if (inv.paymentStatus === 'CANCELED') return false;
  
  // ២. ត្រួតពិនិត្យ Admin 
  if (checkAdmin && modalSelectedAdmin.value !== 'ALL' && inv.createdBy !== modalSelectedAdmin.value) return false;
  
  // ៣. ត្រួតពិនិត្យ Payment 
  if (modalPaymentFilter.value !== 'ALL' && inv.paymentStatus !== modalPaymentFilter.value) return false;

  // ៤. ត្រួតពិនិត្យ Location 
  if (modalLocationFilter.value === 'PP') {
    const isPP = inv.province === 'រាជធានីភ្នំពេញ' || (inv.location && inv.location.includes('ភ្នំពេញ'));
    if (!isPP) return false;
  }
  if (modalLocationFilter.value === 'PROV') {
    const isProv = inv.province && inv.province !== 'រាជធានីភ្នំពេញ' && (!inv.location || !inv.location.includes('ទិញផ្ទាល់'));
    if (!isProv) return false;
  }

  return true;
};

// បង្ហាញតែ Admin ដែលមានទិន្នន័យលក់ស្របតាម Filter Payment & Location
const modalAdminsList = computed(() => {
  const adminIds = new Set();
  modalRawData.value.forEach(inv => { 
    // មិនបាច់ពិនិត្យ Admin ខ្លួនឯងទេកន្លែងនេះ (checkAdmin = false)
    if (isInvoiceMatchingFilters(inv, false)) {
      if (inv.createdBy) adminIds.add(inv.createdBy); 
    }
  });
  return Array.from(adminIds).map(id => ({
    id: id,
    name: usersMap.value[id] || id 
  }));
});

// រុញទៅ ALL វិញ បើ Admin ដែលធ្លាប់ជ្រើសរើសលែងមានឈ្មោះ (ឧ. ដូរថ្ងៃទៅថ្ងៃដែលគាត់អត់មានលក់សោះ)
watch(modalAdminsList, (newList) => {
  if (modalSelectedAdmin.value !== 'ALL') {
    const exists = newList.some(a => a.id === modalSelectedAdmin.value);
    if (!exists) {
      modalSelectedAdmin.value = 'ALL';
    }
  }
});

// វិក្កយបត្រចុងក្រោយដែលឆ្លងកាត់ Filter ទាំងអស់
const validInvoices = computed(() => {
  return modalRawData.value.filter(inv => isInvoiceMatchingFilters(inv, true));
});

// ==========================================

// សរុបបូកទំនិញសម្រាប់តារាង
const aggregatedModalProducts = computed(() => {
  const resultObj = {};
  validInvoices.value.forEach(inv => {
    if (inv.items) {
      inv.items.forEach(item => {
        const invoiceCurrencyMulti = (inv.currency === 'KHR') ? (1/4000) : 1;
        if (item.isCombo) {
          const comboData = props.combos.find(c => c.id === item.id);
          if (comboData && comboData.items) {
            let totalComboCost = 0;
            const comboItemsWithCost = comboData.items.map(subItem => {
              const baseProd = props.stocks.find(s => s.id === subItem.productId);
              const subIpc = baseProd ? (Number(baseProd.itemsPerCase) || 1) : 1;
              const cost = baseProd ? (Number(baseProd.unitCost) / subIpc) * Number(subItem.qty) : 0;
              totalComboCost += cost; return { ...subItem, baseProd, cost };
            });
            const comboRev = Number(item.qty) * Number(item.price);
            comboItemsWithCost.forEach(subItem => {
              if (subItem.baseProd) {
                const key = subItem.baseProd.id;
                if (!resultObj[key]) resultObj[key] = { name: subItem.baseProd.name, qty: 0, revenue: 0, unitStr: translateHardcodedUnit(subItem.baseProd.retailUnit || 'bottle'), isCombo: false };
                resultObj[key].qty += (Number(subItem.qty) * Number(item.qty));
                const ratio = totalComboCost > 0 ? (subItem.cost / totalComboCost) : (1 / comboItemsWithCost.length);
                resultObj[key].revenue += (comboRev * ratio * invoiceCurrencyMulti);
              }
            });
          } else {
            const key = item.id;
            if (!resultObj[key]) resultObj[key] = { name: item.name, qty: 0, revenue: 0, unitStr: 'ឈុត', isCombo: true };
            resultObj[key].qty += Number(item.qty);
            resultObj[key].revenue += (Number(item.qty) * Number(item.price) * invoiceCurrencyMulti);
          }
        } else {
          const key = item.id;
          const baseProd = props.stocks.find(s => s.id === item.id);
          if (!resultObj[key]) resultObj[key] = { name: item.name, qty: 0, revenue: 0, unitStr: translateHardcodedUnit(baseProd?.retailUnit || 'bottle'), isCombo: false };
          let itemQty = Number(item.qty || 0);
          if (item.unit === 'case') itemQty = itemQty * (Number(item.itemsPerCase) || 1);
          resultObj[key].qty += itemQty;
          resultObj[key].revenue += (Number(item.qty) * Number(item.price) * invoiceCurrencyMulti);
        }
      });
    }
  });

  let resArr = Object.values(resultObj);
  if (modalSearchQuery.value) resArr = resArr.filter(r => r.name.toLowerCase().includes(modalSearchQuery.value.toLowerCase()));
  return resArr.sort((a,b) => b.qty - a.qty);
});

// សរុបបូកតម្លៃខាងក្រោម (Footer)
const modalSummary = computed(() => {
  let productsTotal = 0, deliveryTotal = 0;
  validInvoices.value.forEach(inv => {
    let dFee = Number(inv.deliveryFee) || 0;
    if (inv.deliveryCurrency === 'KHR' || dFee > 5) dFee = dFee / 4000; 
    deliveryTotal += dFee;
    const invoiceCurrencyMulti = (inv.currency === 'KHR') ? (1/4000) : 1;
    if (inv.items) inv.items.forEach(item => { productsTotal += (Number(item.qty || 0) * Number(item.price || 0) * invoiceCurrencyMulti); });
  });
  return { productsTotal, deliveryTotal, grandTotal: productsTotal + deliveryTotal };
});

// ==========================================
// 🌟 មុខងារ Export (Copy, PDF, Image, Excel) 🌟
// ==========================================

const isExporting = ref(false);
const printStaging = ref(null);

const getLabel = () => {
  if (modalDateType.value === 'day') return `ប្រចាំថ្ងៃទី ${formatKhmerDate(modalSpecificDate.value)}`;
  if (modalDateType.value === 'month') return `ប្រចាំខែ ${khmerMonths[modalSelectedMonth.value]} ${modalSelectedYear.value}`;
  if (modalDateType.value === 'year') return `ប្រចាំឆ្នាំ ${modalSelectedYear.value}`;
  return `ចាប់ពី ${formatKhmerDate(modalCustomStart.value)} ដល់ ${formatKhmerDate(modalCustomEnd.value)}`;
};

const getAdminLabelForExport = () => {
  if (modalSelectedAdmin.value === 'ALL') return 'ទាំងអស់';
  return usersMap.value[modalSelectedAdmin.value] || modalSelectedAdmin.value;
};

const getStatusLabelForExport = () => {
  let parts = [];
  if (modalPaymentFilter.value === 'PAID') parts.push('PAID');
  else if (modalPaymentFilter.value === 'PENDING') parts.push('PENDING');
  else parts.push('ស្ថានភាពទាំងអស់'); 
  
  if (modalLocationFilter.value === 'PP') parts.push('ភ្នំពេញ');
  else if (modalLocationFilter.value === 'PROV') parts.push('ខេត្ត');
  else parts.push('ទីតាំងទាំងអស់'); 
  
  if (parts.length === 0) return 'ទាំងអស់';
  return parts.join(' | ');
};

const handleModalCopy = () => {
  let text = `📊 របាយការណ៍សង្ខេប\n📅 ${getLabel()}\n`;
  text += `👤 អ្នកលក់: ${getAdminLabelForExport()} | ${getStatusLabelForExport()}\n\n`;
  text += `💰 ចំណូលទំនិញ: ${formatCurrency(modalSummary.value.productsTotal)}\n`;
  text += `🛵 ថ្លៃដឹកជញ្ជូន: ${formatCurrency(modalSummary.value.deliveryTotal)}\n`;
  text += `💳 សរុបរួម: ${formatCurrency(modalSummary.value.grandTotal)}\n\n`;
  text += `-----------------------------------\n`;
  
  aggregatedModalProducts.value.forEach((item, i) => {
    text += `${i+1}. ${item.name} ${item.isCombo ? '(ឈុត)' : ''} | ${item.qty} ${item.unitStr} | ${formatCurrency(item.revenue)}\n`;
  });

  navigator.clipboard.writeText(text).then(() => {
    notification.success("បានចម្លងអត្ថបទដោយជោគជ័យ!");
  });
};

const getHTMLTemplate = () => {
  const rowsHTML = aggregatedModalProducts.value.map((item, i) => `
    <tr style="background-color: ${i % 2 === 0 ? '#ffffff' : '#f8fafc'}; border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 12px 15px; text-align: center; color: #64748b; font-size: 13px;">${i + 1}</td>
      <td style="padding: 12px 15px; font-weight: 600; color: #1e293b; font-size: 14px;">${item.name} ${item.isCombo ? '<span style="color:#d97706; font-size:11px;">(ឈុត)</span>' : ''}</td>
      <td style="padding: 12px 15px; text-align: center; font-weight: bold; color: #4338ca; font-size: 14px;">${item.qty.toLocaleString()} ${item.unitStr}</td>
      <td style="padding: 12px 15px; text-align: right; color: #0f172a; font-weight: bold; font-size: 14px;">${formatCurrency(item.revenue)}</td>
    </tr>
  `).join('');

  return `
    <div id="clean-export-target" style="width: 800px; padding: 40px; background-color: #ffffff; font-family: 'Battambong', sans-serif; position: relative;">
      <div style="background: #1e293b; border-radius: 12px; padding: 20px; margin-bottom: 20px; color: white; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h2 style="margin: 0 0 5px 0;">របាយការណ៍សង្ខេបលម្អិត</h2>
          <p style="margin: 0; font-size: 14px; opacity:0.9;">${getLabel()}</p>
        </div>
        <div style="text-align: right; font-size: 13px;">
          <p style="margin: 0 0 4px 0;">អ្នកលក់: <b>${getAdminLabelForExport()}</b></p>
          <p style="margin: 0;"><b>${getStatusLabelForExport()}</b></p>
        </div>
      </div>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #f1f5f9; border-bottom: 2px solid #cbd5e1;">
            <th style="padding: 12px; text-align: center;">#</th>
            <th style="padding: 12px; text-align: left;">ឈ្មោះទំនិញ</th>
            <th style="padding: 12px; text-align: center;">បរិមាណសរុប</th>
            <th style="padding: 12px; text-align: right;">ចំណូល (USD)</th>
          </tr>
        </thead>
        <tbody>${rowsHTML}</tbody>
      </table>
      <div style="text-align: right; background-color: #f8fafc; padding: 15px; border-radius: 10px; border: 1px solid #e2e8f0;">
        <p style="margin: 0 0 5px 0;">សរុបតម្លៃទំនិញ: <b>${formatCurrency(modalSummary.value.productsTotal)}</b></p>
        <p style="margin: 0 0 10px 0; border-bottom: 1px solid #cbd5e1; padding-bottom: 10px;">ថ្លៃដឹកជញ្ជូនសរុប: <b style="color: #d97706;">${formatCurrency(modalSummary.value.deliveryTotal)}</b></p>
        <p style="margin: 0; font-size: 18px;">សរុបរួម: <b style="color: #059669;">${formatCurrency(modalSummary.value.grandTotal)}</b></p>
      </div>
    </div>
  `;
};

const executeExport = async (type) => {
  isExporting.value = true;
  try {
    if (type === 'excel') {
      const tableStr = `
        <tr><th colspan="4" style="font-size:20px; font-weight:bold; height:50px;">របាយការណ៍សង្ខេបលម្អិត</th></tr>
        <tr><td colspan="4" style="text-align:center;">${getLabel()} | អ្នកលក់: ${getAdminLabelForExport()} | ${getStatusLabelForExport()}</td></tr>
        <tr style="background-color:#cbd5e1; font-weight:bold;">
          <th style="border:1px solid #94a3b8;">#</th>
          <th style="border:1px solid #94a3b8; width: 300px;">ឈ្មោះទំនិញ</th>
          <th style="border:1px solid #94a3b8;">បរិមាណសរុប</th>
          <th style="border:1px solid #94a3b8;">ចំណូល (USD)</th>
        </tr>
        ${aggregatedModalProducts.value.map((item, i) => `<tr><td style="border:1px solid #94a3b8; text-align:center;">${i+1}</td><td style="border:1px solid #94a3b8;">${item.name} ${item.isCombo ? '(ឈុត)' : ''}</td><td style="border:1px solid #94a3b8; text-align:center;">${item.qty} ${item.unitStr}</td><td style="border:1px solid #94a3b8; text-align:right;">${item.revenue.toFixed(2)}</td></tr>`).join('')}
        <tr><td colspan="4"></td></tr>
        <tr><td colspan="3" style="text-align:right; font-weight:bold;">សរុបតម្លៃទំនិញ:</td><td style="text-align:right; font-weight:bold; color:blue;">${modalSummary.value.productsTotal.toFixed(2)} $</td></tr>
        <tr><td colspan="3" style="text-align:right; font-weight:bold;">ថ្លៃដឹកជញ្ជូនសរុប:</td><td style="text-align:right; font-weight:bold; color:orange;">${modalSummary.value.deliveryTotal.toFixed(2)} $</td></tr>
        <tr><td colspan="3" style="text-align:right; font-weight:bold;">សរុបរួម:</td><td style="text-align:right; font-weight:bold; color:green;">${modalSummary.value.grandTotal.toFixed(2)} $</td></tr>
      `;
      exportToExcel(tableStr, `Quick_Summary_${new Date().getTime()}`);
      notification.success("ទាញយក Excel បានជោគជ័យ!");
    } else {
      printStaging.value.innerHTML = getHTMLTemplate();
      await nextTick(); await document.fonts.ready; await new Promise(r => setTimeout(r, 400));
      if (type === 'image') {
        await exportToImage('clean-export-target', `Quick_Summary_${new Date().getTime()}`);
        notification.success("ទាញយករូបភាពបានជោគជ័យ!");
      }
      if (type === 'pdf') {
        await exportToPDF('clean-export-target', `Quick_Summary_${new Date().getTime()}`);
        notification.success("ទាញយក PDF បានជោគជ័យ!");
      }
      printStaging.value.innerHTML = '';
    }
  } catch(e) { 
    console.error(e); 
    notification.error("មានបញ្ហាក្នុងការទាញយក!");
  } finally { 
    isExporting.value = false; 
  }
};
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
</style>