<template>
  <div class="font-khmer animate-fade-in-up flex flex-col h-full relative">
    
    <Teleport to="body">
      <transition enter-active-class="duration-200 ease-out" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100" leave-active-class="duration-150 ease-in" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
        <div v-if="confirmModal.show" class="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm font-khmer">
          <div class="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl relative overflow-hidden text-center">
            <div class="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-amber-100">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <h3 class="text-xl font-black text-slate-800 mb-2">បញ្ជាក់ការទូទាត់</h3>
            <p class="text-sm font-bold text-slate-500 mb-6">តើអ្នកពិតជាចង់បញ្ជាក់ថាវិក្កយបត្រ <span class="text-indigo-600">🧾 {{ getConfirmReceiptId() }}</span> នេះបានទូទាត់ប្រាក់រួចរាល់មែនទេ?</p>
            <div class="flex items-center gap-3">
              <button @click="closeConfirmModal" class="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-black text-sm transition-colors active:scale-95">បោះបង់</button>
              <button @click="proceedWithPayment" class="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-black text-sm transition-colors active:scale-95 shadow-md shadow-amber-500/30">យល់ព្រម</button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>

    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 shrink-0">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center shadow-sm">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <div>
          <h2 class="text-lg font-black text-slate-800">ទិន្នន័យជំពាក់ (PENDING)</h2>
          <p class="text-[11px] font-bold text-slate-500">វិក្កយបត្រដែលមិនទាន់ទូទាត់ប្រាក់សរុប: <span class="text-amber-600">{{ filteredSales.length }}</span></p>
        </div>
      </div>
      
      <div class="relative w-full md:w-72">
        <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        <input v-model="searchQuery" @input="currentPage = 1" type="text" placeholder="ស្វែងរកលេខបុង, អតិថិជន..." class="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm font-bold text-slate-700 focus:border-amber-400 outline-none transition-shadow shadow-sm focus:shadow-md">
      </div>
    </div>

    <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 opacity-60 flex-1">
      <div class="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-amber-500 mb-4"></div>
      <p class="text-sm font-bold text-slate-500">កំពុងទាញយកទិន្នន័យជំពាក់...</p>
    </div>

    <div v-else-if="filteredSales.length === 0" class="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 flex-1">
      <div class="text-6xl mb-4 opacity-40">🎉</div>
      <p class="font-black text-lg text-slate-600">អស្ចារ្យណាស់!</p>
      <p class="text-sm font-bold text-slate-400 mt-1">មិនមានអតិថិជនជំពាក់ប្រាក់នោះទេ</p>
    </div>

    <div v-else class="flex-1 pb-10">
      <div class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
        <div v-for="sale in paginatedSales" :key="sale.id" class="bg-white rounded-2xl border border-amber-200/60 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col transform-gpu will-change-transform">
          
          <div class="p-4 border-b border-slate-100 flex items-start justify-between bg-amber-50/30">
            <div class="flex items-start gap-3">
              <div class="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              </div>
              <div>
                <h3 class="font-black text-[15px] text-slate-800 leading-tight mb-1">{{ sale.customerName || 'អតិថិជនទូទៅ' }}</h3>
                <div class="flex items-center gap-2">
                  <span class="text-[10px] font-mono font-bold text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">🧾 {{ sale.receiptId || sale.id.slice(-6).toUpperCase() }}</span>
                  <span class="text-[10px] font-bold text-slate-400">{{ formatDate(sale.createdAt) }}</span>
                </div>
              </div>
            </div>
            <span class="bg-amber-100 text-amber-700 text-[10px] px-2 py-1 rounded-md font-black tracking-wider border border-amber-200">PENDING</span>
          </div>

          <div class="p-4 flex items-center justify-between">
            <div>
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">សរុបត្រូវទូទាត់</p>
              <p class="text-xl font-black text-emerald-600">{{ formatCurrency(sale.totalAmount, sale.currency) }}</p>
              <p v-if="sale.deliveryFee > 0" class="text-[11px] font-bold text-orange-500 mt-0.5">ថ្លៃដឹក: {{ formatCurrency(sale.deliveryFee, sale.deliveryCurrency) }}</p>
            </div>
            
            <div class="flex items-center gap-2">
              <button @click="openConfirmModal(sale.id)" :disabled="isUpdating === sale.id" class="w-12 h-12 flex items-center justify-center bg-white border-2 border-amber-400 text-amber-500 rounded-xl hover:bg-emerald-500 hover:border-emerald-500 hover:text-white transition-all duration-200 shadow-sm active:scale-95 disabled:opacity-50" title="ចុចដើម្បីបញ្ជាក់ថាបានទូទាត់រួច">
                <svg v-if="isUpdating === sale.id" class="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
              </button>
            </div>
          </div>

          <div class="mt-auto border-t border-slate-100 bg-slate-50/50">
            <button @click="toggleItems(sale.id)" class="w-full py-2.5 flex items-center justify-center gap-1 text-[11px] font-bold text-slate-500 hover:text-indigo-600 transition-colors">
              {{ expandedSales.has(sale.id) ? 'លាក់បញ្ជីទំនិញ' : `មើលបញ្ជីទំនិញ (${sale.items?.length || 0})` }}
              <svg class="w-3.5 h-3.5 transition-transform duration-300" :class="expandedSales.has(sale.id) ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            
            <div v-show="expandedSales.has(sale.id)" class="px-4 pb-4 overflow-y-auto custom-scrollbar max-h-48 border-t border-slate-100 pt-2">
                <div v-for="(item, idx) in sale.items" :key="idx" class="flex justify-between items-start py-2 border-b border-dashed border-slate-200 last:border-0">
                  <div class="flex-1 pr-2">
                    <p class="text-xs font-bold text-slate-700 leading-tight">{{ item.name }}</p>
                    <p class="text-[10px] text-slate-400 font-bold mt-0.5">{{ formatCurrency(item.price, sale.currency) }} × <span class="text-indigo-500">{{ item.qty }} {{ translateUnit(item.unit) }}</span></p>
                  </div>
                  <div class="font-black text-[13px] text-slate-800 whitespace-nowrap">
                    {{ formatCurrency(Number(item.price || 0) * Number(item.qty || 0), sale.currency) }}
                  </div>
                </div>
            </div>
          </div>

        </div>
      </div>

      <div v-if="totalPages > 1" class="flex flex-col sm:flex-row items-center justify-between bg-white px-5 py-3.5 rounded-2xl border border-slate-200 shadow-sm mt-6 gap-4 shrink-0">
          <p class="text-xs font-bold text-slate-500">
              បង្ហាញ <span class="text-slate-800">{{ ((currentPage - 1) * itemsPerPage) + 1 }}</span> - <span class="text-slate-800">{{ Math.min(currentPage * itemsPerPage, filteredSales.length) }}</span> នៃ <span class="text-amber-600">{{ filteredSales.length }}</span> បុង
          </p>
          
          <div class="flex items-center gap-1.5">
              <button @click="currentPage--" :disabled="currentPage === 1" class="px-3 py-2 rounded-lg text-xs font-black transition-colors flex items-center gap-1" :class="currentPage === 1 ? 'text-slate-400 bg-slate-50 cursor-not-allowed' : 'text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm'">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/></svg> មុន
              </button>
              <span class="px-3 py-2 text-[11px] font-black text-slate-600 bg-slate-100 rounded-lg border border-slate-200">
                {{ currentPage }} / {{ totalPages }}
              </span>
              <button @click="currentPage++" :disabled="currentPage === totalPages" class="px-3 py-2 rounded-lg text-xs font-black transition-colors flex items-center gap-1" :class="currentPage === totalPages ? 'text-slate-400 bg-slate-50 cursor-not-allowed' : 'text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm'">
                បន្ទាប់ <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
              </button>
          </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { db, auth } from '@/firebaseConfig';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { useNotificationStore } from '@/stores/notification';

const props = defineProps({
  unitSettings: { type: Array, default: () => [] }
});

const notification = useNotificationStore();

const pendingSales = ref([]);
const isLoading = ref(true);
const searchQuery = ref('');
const expandedSales = ref(new Set());
const isUpdating = ref(null);

// 🌟 Custom Confirm Modal State 🌟
const confirmModal = ref({
    show: false,
    saleId: null
});

// 🌟 Pagination State 🌟
const currentPage = ref(1);
const itemsPerPage = ref(9); 

let unsubscribe = null;

const fetchPendingSales = () => {
    if (!auth.currentUser) return;
    
    const q = query(
        collection(db, 'sales_reports'),
        where('createdBy', '==', auth.currentUser.uid),
        where('paymentStatus', '==', 'PENDING')
    );

    unsubscribe = onSnapshot(q, (snapshot) => {
        pendingSales.value = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        isLoading.value = false;
    }, (error) => {
        console.error("Error fetching pending sales:", error);
        notification.error('មានបញ្ហាក្នុងការទាញយកទិន្នន័យ!');
        isLoading.value = false;
    });
};

onMounted(() => {
    fetchPendingSales();
});

onUnmounted(() => {
    if (unsubscribe) unsubscribe();
});

const filteredSales = computed(() => {
    if (!searchQuery.value) return pendingSales.value;
    const q = searchQuery.value.toLowerCase().trim();
    return pendingSales.value.filter(sale => {
        const cName = String(sale.customerName || '').toLowerCase();
        const rId = String(sale.receiptId || '').toLowerCase();
        const sId = String(sale.id).toLowerCase();
        return cName.includes(q) || rId.includes(q) || sId.includes(q);
    });
});

const totalPages = computed(() => Math.ceil(filteredSales.value.length / itemsPerPage.value) || 1);

const paginatedSales = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return filteredSales.value.slice(start, end);
});

const toggleItems = (id) => {
    const newSet = new Set(expandedSales.value);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    expandedSales.value = newSet;
};

// 🌟 Custom Confirm Logic 🌟
const openConfirmModal = (saleId) => {
    confirmModal.value.saleId = saleId;
    confirmModal.value.show = true;
};

const closeConfirmModal = () => {
    confirmModal.value.show = false;
    confirmModal.value.saleId = null;
};

const getConfirmReceiptId = () => {
    if (!confirmModal.value.saleId) return '';
    const sale = pendingSales.value.find(s => s.id === confirmModal.value.saleId);
    return sale ? (sale.receiptId || sale.id.slice(-6).toUpperCase()) : '';
};

const proceedWithPayment = async () => {
    const saleId = confirmModal.value.saleId;
    if (!saleId) return;
    
    closeConfirmModal();
    isUpdating.value = saleId;
    
    try {
        const saleRef = doc(db, 'sales_reports', saleId);
        await updateDoc(saleRef, {
            paymentStatus: 'PAID',
            updatedAt: new Date().toISOString()
        });
        notification.success('បានប្តូរស្ថានភាពទៅជា បានទូទាត់រួច (PAID) ដោយជោគជ័យ!');
    } catch (error) {
        console.error("Error updating status:", error);
        notification.error('មានបញ្ហាក្នុងការរក្សាទុក!');
    } finally {
        isUpdating.value = null;
    }
};

const formatCurrency = (val, currency = 'USD') => {
    const num = Number(val || 0);
    return currency === 'KHR' ? num.toLocaleString('en-US') + ' ៛' : num.toLocaleString('en-US', { minimumFractionDigits: 2 }) + ' $';
};

const formatDate = (isoString) => {
    if (!isoString) return '';
    const d = new Date(isoString);
    return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
};

const translateUnit = (unitVal) => {
    if (!unitVal) return '';
    const safeVal = String(unitVal);
    const found = props.unitSettings.find(u => String(u.value) === safeVal);
    if (found) return found.label;
    
    const u = safeVal.toLowerCase().trim();
    if (u === 'bottle' || u === 'bottles') return 'ដប';
    if (u === 'pack' || u === 'packs') return 'កញ្ចប់';
    if (u === 'case' || u === 'cases') return 'កេះ';
    return safeVal;
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;500;600;700;900&family=Battambang:wght@400;700;900&display=swap');
.font-khmer { font-family: 'Kantumruy Pro', 'Battambang', sans-serif; }

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.animate-fade-in-up { animation: fadeInUp 0.3s ease-out forwards; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

/* GPU Acceleration */
.transform-gpu { transform: translateZ(0); }
</style>