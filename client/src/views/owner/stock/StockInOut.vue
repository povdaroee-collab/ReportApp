<template>
    <div class="max-w-6xl mx-auto animate-fade-in space-y-6 pb-32">
        
        <div class="relative z-20 bg-neutral-800/50 border border-neutral-700/50 rounded-2xl p-6 shadow-2xl backdrop-blur-sm">
            
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 border-b border-neutral-700/80 pb-4">
                <div class="bg-neutral-900 p-1 rounded-xl flex border border-neutral-700 w-full sm:w-auto">
                    <button @click="mode = 'IN'" :class="mode === 'IN' ? 'bg-emerald-500/20 text-emerald-400 font-black shadow-sm' : 'text-neutral-400 hover:text-white'" class="flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm transition-all flex items-center justify-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M7 11l5-5m0 0l5 5m-5-5v12"></path></svg>
                        នាំចូលស្តុក (IN)
                    </button>
                    <button @click="mode = 'OUT'" :class="mode === 'OUT' ? 'bg-rose-500/20 text-rose-400 font-black shadow-sm' : 'text-neutral-400 hover:text-white'" class="flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm transition-all flex items-center justify-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 13l-5 5m0 0l-5-5m5 5V6"></path></svg>
                        ដកស្តុកចេញ (OUT)
                    </button>
                </div>
                <p class="text-xs font-bold text-neutral-500">ជ្រើសរើសទំនិញដើម្បីធ្វើបច្ចុប្បន្នភាព</p>
            </div>

            <div class="relative mb-8 z-[100]" v-click-outside="closeDropdown">
                <label class="block text-xs font-bold text-amber-500 mb-2 uppercase tracking-wider">ស្វែងរកទំនិញដែលមានស្រាប់</label>
                <div class="relative group">
                    <span class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-amber-500 transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </span>
                    <input 
                        v-model="searchQuery" 
                        @focus="showDropdown = true"
                        type="text" 
                        placeholder="វាយឈ្មោះទំនិញ ឬ លេខ Barcode ដើម្បីស្វែងរក..." 
                        class="w-full bg-neutral-900 border border-neutral-600 rounded-xl pl-12 pr-12 py-3.5 text-white font-bold focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all shadow-inner"
                    >
                    <button v-if="selectedProduct" @click="clearSelection" class="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-500 hover:text-rose-400 transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                
                <transition name="fade">
                    <div v-if="showDropdown && filteredProducts.length > 0" class="absolute left-0 right-0 mt-2 bg-neutral-800 border border-neutral-500 shadow-2xl shadow-black/60 rounded-xl max-h-72 overflow-y-auto custom-scrollbar p-2 z-[999]">
                        <div 
                            v-for="prod in filteredProducts" :key="prod.id" 
                            @click="selectProduct(prod)"
                            class="flex items-center gap-4 p-3 hover:bg-neutral-700 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-neutral-500 group"
                        >
                            <img :src="prod.image || 'https://via.placeholder.com/150'" class="w-12 h-12 rounded-lg object-cover border border-neutral-600 shrink-0 bg-neutral-900">
                            <div class="flex-1">
                                <h4 class="font-black text-sm text-white leading-tight mb-1 group-hover:text-amber-400 transition-colors">{{ prod.name }}</h4>
                                <div class="flex flex-wrap items-center gap-3 text-[11px] text-neutral-400 font-mono">
                                    <span class="bg-neutral-900 px-2 py-0.5 rounded text-neutral-300 border border-neutral-700">{{ prod.barcode || 'N/A' }}</span>
                                    <span>ស្តុកបច្ចុប្បន្ន: <span class="text-emerald-400 font-bold text-xs">{{ formatQty(prod.quantity) }} {{ translateUnit(prod.unit) }}</span></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </transition>
            </div>

            <div v-if="selectedProduct" class="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-slide-up relative z-10">
                
                <div class="lg:col-span-4 xl:col-span-3 bg-neutral-900 rounded-2xl p-5 border border-neutral-700 flex flex-col items-center text-center shadow-inner">
                    <img :src="selectedProduct.image || 'https://via.placeholder.com/150'" class="w-28 h-28 rounded-xl object-cover border-2 border-neutral-700 mb-4 shadow-md bg-neutral-800">
                    <h3 class="font-black text-white text-base leading-tight mb-4">{{ selectedProduct.name }}</h3>
                    
                    <div class="w-full space-y-2">
                        <div class="bg-neutral-800 px-4 py-2.5 rounded-xl border border-neutral-700/80 flex justify-between items-center">
                            <span class="text-[11px] text-neutral-400 uppercase font-bold">ស្តុកបច្ចុប្បន្ន</span>
                            <span class="font-black text-amber-400 text-base">
                                {{ formatQty(selectedProduct.quantity) }} <span class="text-xs">{{ translateUnit(selectedProduct.unit) }}</span>
                            </span>
                        </div>
                        <div class="bg-neutral-800 px-4 py-2.5 rounded-xl border border-neutral-700/80 flex justify-between items-center">
                            <span class="text-[11px] text-neutral-400 uppercase font-bold">ថ្លៃដើម (Cost)</span>
                            <span class="font-black text-emerald-400 text-base">
                                {{ formatPrice(selectedProduct.unitCost) }}{{ selectedProduct.currency === 'USD' ? '$' : '៛' }}
                            </span>
                        </div>
                    </div>
                </div>

                <form @submit.prevent="submitTransaction" class="lg:col-span-8 xl:col-span-9 bg-neutral-900 rounded-2xl p-5 md:p-6 border border-neutral-700 shadow-inner">
                    
                    <div class="flex items-center gap-3 mb-6 pb-4 border-b border-neutral-800">
                        <div class="w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl shadow-sm" :class="mode === 'IN' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'">
                            {{ mode === 'IN' ? '📥' : '📤' }}
                        </div>
                        <div>
                            <h4 class="font-black text-base uppercase tracking-wider" :class="mode === 'IN' ? 'text-emerald-400' : 'text-rose-400'">
                                {{ mode === 'IN' ? 'បញ្ចូលស្តុកថ្មី (STOCK IN)' : 'ដកស្តុកចេញ (STOCK OUT / LOSS)' }}
                            </h4>
                            <p class="text-[11px] text-neutral-500">{{ mode === 'IN' ? 'បន្ថែមចំនួនជាកេះ និងធ្វើបច្ចុប្បន្នភាពតម្លៃទុន' : 'ដកទំនិញខូចគុណភាព ឬបាត់បង់' }}</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                        
                        <div>
                            <label class="block text-xs font-bold text-neutral-300 mb-1.5">
                                ចំនួនដែល{{ mode === 'IN' ? 'បញ្ជូល' : 'ដកចេញ' }} <span class="text-rose-500">*</span>
                            </label>
                            <div class="flex shadow-sm rounded-xl overflow-hidden focus-within:ring-1 focus-within:ring-amber-500 border border-neutral-600 focus-within:border-amber-500 transition-all">
                                <input 
                                    v-model.number="form.qty" 
                                    type="number" step="any" min="0.01" required 
                                    placeholder="បញ្ចូលចំនួន..." 
                                    class="w-full bg-neutral-800 px-4 py-3 text-white font-black outline-none"
                                >
                                <select v-if="mode === 'OUT'" v-model="form.transactionUnit" class="bg-neutral-700 border-l border-neutral-600 px-3 py-3 text-white text-[11px] font-bold outline-none cursor-pointer hover:bg-neutral-600 transition-colors">
                                    <option value="retail">រាយ ({{ translateRetailUnit(selectedProduct) }})</option>
                                    <option value="bulk" v-if="selectedProduct.unit === 'case'">ដុំ ({{ translateUnit(selectedProduct.unit) }})</option>
                                </select>
                                <div v-else class="bg-neutral-700 border-l border-neutral-600 px-4 py-3 text-white text-[11px] font-bold flex items-center justify-center">
                                    {{ translateUnit(selectedProduct.unit) }}
                                </div>
                            </div>
                        </div>
                        
                        <div v-if="mode === 'IN'">
                            <label class="block text-xs font-bold text-neutral-300 mb-1.5">
                                ថ្លៃដើមទិញចូលថ្មី / 1 {{ translateUnit(selectedProduct.unit) }} <span class="text-rose-500">*</span>
                            </label>
                            <div class="relative">
                                <span class="absolute left-4 top-3 text-emerald-500 font-black">{{ selectedProduct.currency === 'USD' ? '$' : '៛' }}</span>
                                <input v-model.number="form.cost" type="number" step="any" min="0" required class="w-full bg-neutral-800 border border-emerald-500/50 rounded-xl pl-8 pr-4 py-3 text-emerald-400 font-black outline-none focus:ring-1 focus:ring-emerald-500 transition-all">
                            </div>
                        </div>

                        <div v-if="mode === 'OUT'">
                            <label class="block text-xs font-bold text-neutral-300 mb-1.5">គិតជាទឹកប្រាក់ខាតបង់សរុប</label>
                            <div class="bg-neutral-800/80 border border-rose-500/30 rounded-xl px-4 py-3 text-rose-400 font-black flex items-center gap-1 shadow-inner h-[46px]">
                                <span>{{ selectedProduct.currency === 'USD' ? '$' : '៛' }}</span>
                                {{ formatPrice(lossValue) }}
                            </div>
                        </div>

                    </div>

                    <div class="mb-6">
                        <label class="block text-xs font-bold text-neutral-300 mb-1.5">មូលហេតុ / ចំណាំ (Reason) <span v-if="mode==='OUT'" class="text-rose-500">*</span></label>
                        <input v-model="form.reason" type="text" :placeholder="mode === 'IN' ? 'ឧ. ទិញចូលពីក្រុមហ៊ុន...' : 'ឧ. ខូចគុណភាព, បែកបាក់, ហួសដឺឡេ...'" :required="mode === 'OUT'" class="w-full bg-neutral-800 border border-neutral-600 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-amber-500 transition-all">
                    </div>

                    <div class="flex justify-end pt-4 border-t border-neutral-800">
                        <button type="submit" :disabled="isSubmitting" class="px-8 py-3.5 rounded-xl font-black text-white shadow-lg transition-all active:scale-95 flex items-center gap-2 text-sm" :class="mode === 'IN' ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 shadow-emerald-500/20' : 'bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 shadow-rose-500/20'">
                            <span v-if="isSubmitting" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                            {{ mode === 'IN' ? 'បញ្ជាក់ការបញ្ជូល (Confirm IN)' : 'បញ្ជាក់ការដកចេញ (Confirm OUT)' }}
                        </button>
                    </div>

                </form>
            </div>
        </div>

        <div class="relative z-10 bg-neutral-800/50 border border-neutral-700/50 rounded-2xl p-6 shadow-2xl backdrop-blur-sm">
            
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div class="flex bg-neutral-900 p-1 rounded-xl border border-neutral-700">
                    <button @click="mode = 'IN'" :class="mode === 'IN' ? 'bg-emerald-500/20 text-emerald-400 shadow-sm' : 'text-neutral-400 hover:text-white'" class="px-5 py-2 rounded-lg text-[13px] font-bold transition-all flex items-center gap-2">
                        ប្រវត្តិនាំចូល (IN)
                    </button>
                    <button @click="mode = 'OUT'" :class="mode === 'OUT' ? 'bg-rose-500/20 text-rose-400 shadow-sm' : 'text-neutral-400 hover:text-white'" class="px-5 py-2 rounded-lg text-[13px] font-bold transition-all flex items-center gap-2">
                        ប្រវត្តិដកចេញ & ខាតបង់ (OUT)
                    </button>
                </div>
                
                <div v-if="mode === 'OUT'" class="bg-rose-500/10 border border-rose-500/30 px-5 py-2.5 rounded-xl text-rose-400 font-bold text-sm shadow-inner flex items-center gap-2 animate-fade-in">
                    ការខាតបង់សរុប (Loss): 
                    <span class="text-xl font-black">{{ formatPrice(totalLossUSD) }}$</span>
                </div>
            </div>

            <div class="overflow-x-auto custom-scrollbar rounded-xl border border-neutral-700">
                <table class="w-full text-left border-collapse min-w-[900px]">
                    <thead class="bg-neutral-900 text-neutral-400 text-[11px] uppercase font-black tracking-widest border-b border-neutral-700">
                        <tr>
                            <th class="px-5 py-4">កាលបរិច្ឆេទ</th>
                            <th class="px-5 py-4 text-center">ប្រភេទ</th>
                            <th class="px-5 py-4">ទំនិញ</th>
                            <th class="px-5 py-4 text-center">ចំនួន (ខ្នាត)</th>
                            <th class="px-5 py-4 text-right">តម្លៃសរុប</th>
                            <th class="px-5 py-4">មូលហេតុ</th>
                            <th class="px-5 py-4 text-right">ដោយ</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-neutral-800 bg-neutral-800/30">
                        <tr v-if="isLoadingHistory">
                            <td colspan="7" class="py-12 text-center"><div class="animate-spin rounded-full h-8 w-8 border-2 border-amber-500 border-t-transparent mx-auto"></div></td>
                        </tr>
                        <tr v-else-if="filteredHistory.length === 0">
                            <td colspan="7" class="py-12 text-center text-neutral-500 font-bold">មិនទាន់មានប្រវត្តិប្រតិបត្តិការទេ</td>
                        </tr>
                        <tr v-else v-for="h in filteredHistory" :key="h.id" class="hover:bg-neutral-700/50 transition-colors">
                            <td class="px-5 py-3.5 text-xs font-bold text-neutral-300">{{ formatDate(h.createdAt) }}</td>
                            <td class="px-5 py-3.5 text-center">
                                <span class="px-2.5 py-1 rounded text-[10px] font-black tracking-widest shadow-sm" :class="h.type === 'IN' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'">
                                    {{ h.type === 'IN' ? 'IN' : 'OUT' }}
                                </span>
                            </td>
                            <td class="px-5 py-3.5 text-sm font-bold text-white">{{ h.productName }}</td>
                            <td class="px-5 py-3.5 text-center font-bold text-neutral-300">{{ formatQty(h.qty) }} {{ translateUnit(h.unitDisplay) }}</td>
                            <td class="px-5 py-3.5 text-right font-black" :class="h.type === 'IN' ? 'text-emerald-400' : 'text-rose-400'">
                                {{ h.type === 'IN' ? '+' : '-' }}{{ formatPrice(h.totalValue) }}{{ h.currency === 'USD' ? '$' : '៛' }}
                            </td>
                            <td class="px-5 py-3.5 text-xs font-bold text-neutral-400">{{ h.reason || '-' }}</td>
                            <td class="px-5 py-3.5 text-right text-[10px] text-neutral-500 font-bold">{{ h.createdBy }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { db, auth } from '@/firebaseConfig';
import { collection, addDoc, doc, updateDoc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useNotificationStore } from '@/stores/notification';

const props = defineProps({
    products: { type: Array, required: true }
});

const notification = useNotificationStore();

// State
const mode = ref('IN'); // 'IN' or 'OUT' (ទាញយកទៅប្រើទាំង Form ខាងលើ និង តារាងខាងក្រោម)
const searchQuery = ref('');
const showDropdown = ref(false);
const selectedProduct = ref(null);
const isSubmitting = ref(false);

const history = ref([]);
const isLoadingHistory = ref(true);

const form = reactive({ 
    qty: null, 
    cost: null, 
    reason: '', 
    transactionUnit: 'bulk' // Default
});

const vClickOutside = {
    mounted(el, binding) {
        el.clickOutsideEvent = function (event) {
            if (!(el == event.target || el.contains(event.target))) { binding.value(event); }
        };
        document.body.addEventListener('click', el.clickOutsideEvent);
    },
    unmounted(el) { document.body.removeEventListener('click', el.clickOutsideEvent); }
};

// Computed
const filteredProducts = computed(() => {
    if (!searchQuery.value) return props.products.slice(0, 15);
    const q = searchQuery.value.toLowerCase();
    return props.products.filter(p => p.name.toLowerCase().includes(q) || (p.barcode && p.barcode.toLowerCase().includes(q)));
});

// ត្រងយកតែប្រវត្តិណាដែលត្រូវនឹង mode ខាងលើ និងជាទំនិញដែលមិនទាន់ត្រូវបានលុប
const filteredHistory = computed(() => {
    // បង្កើតបញ្ជី ID ទំនិញដែលកំពុងមាន (Active)
    const activeProductIds = new Set(props.products.map(p => p.id));
    
    return history.value.filter(h => {
        // បង្ហាញតែប្រវត្តិណាដែលមាន type ត្រូវគ្នា និងមាន productId នៅក្នុងបញ្ជីទំនិញបច្ចុប្បន្ន
        return h.type === mode.value && activeProductIds.has(h.productId);
    });
});

// ការគណនា Loss ឆ្លាតវៃផ្អែកលើខ្នាតរាយ ឬ ដុំ
const lossValue = computed(() => {
    if (!selectedProduct.value || !form.qty || mode.value !== 'OUT') return 0;
    const unitCostBulk = Number(selectedProduct.value.unitCost) || 0;
    const itemsPerCase = Number(selectedProduct.value.itemsPerCase) || 1;

    if (form.transactionUnit === 'retail') {
        return form.qty * (unitCostBulk / itemsPerCase); // ថ្លៃខាតជាដប
    } else {
        return form.qty * unitCostBulk; // ថ្លៃខាតជាកេះ
    }
});

// ការគណនា Loss សរុប ដោយបូកបញ្ជូលតែទំនិញដែលមិនទាន់លុបប៉ុណ្ណោះ
const totalLossUSD = computed(() => {
    const activeProductIds = new Set(props.products.map(p => p.id));
    
    return history.value
        .filter(h => h.type === 'OUT' && activeProductIds.has(h.productId))
        .reduce((sum, h) => {
            let val = h.totalValue;
            if(h.currency === 'KHR' || h.currency === '៛') val = val / 4000;
            return sum + val;
        }, 0);
});

// Watch Mode changes to auto-adjust units AND sync history
watch(mode, (newMode) => {
    if (selectedProduct.value) {
        if (newMode === 'IN') {
            form.transactionUnit = 'bulk';
            form.cost = selectedProduct.value.unitCost;
            form.reason = '';
        } else {
            form.transactionUnit = 'retail';
            form.reason = '';
        }
    }
});

// Actions
const selectProduct = (prod) => {
    selectedProduct.value = prod;
    searchQuery.value = prod.name;
    showDropdown.value = false;
    form.qty = null;
    form.reason = '';
    
    if (mode.value === 'IN') {
        form.transactionUnit = 'bulk';
        form.cost = prod.unitCost; 
    } else {
        form.transactionUnit = 'retail';
    }
};

const clearSelection = () => {
    selectedProduct.value = null;
    searchQuery.value = '';
    form.qty = null; form.cost = null; form.reason = ''; 
    form.transactionUnit = mode.value === 'IN' ? 'bulk' : 'retail';
};

const closeDropdown = () => { showDropdown.value = false; };

const submitTransaction = async () => {
    if (!selectedProduct.value) return notification.warning("សូមជ្រើសរើសទំនិញសិន");
    if (!form.qty || form.qty <= 0) return notification.warning("ចំនួនត្រូវតែធំជាងសូន្យ");

    const currentQtyBulk = Number(selectedProduct.value.quantity) || 0;
    const itemsPerCase = Number(selectedProduct.value.itemsPerCase) || 1;

    // បម្លែងចំនួនដែលបញ្ចូល ទៅជាខ្នាតកេះ (Bulk) ដើម្បីកាត់/បូកក្នុង DB
    let qtyDeltaBulk = 0;
    if (form.transactionUnit === 'retail') {
        qtyDeltaBulk = form.qty / itemsPerCase;
    } else {
        qtyDeltaBulk = form.qty;
    }

    if (mode.value === 'OUT' && qtyDeltaBulk > currentQtyBulk) {
        return notification.error(`ស្តុកមិនគ្រប់គ្រាន់សម្រាប់ដកចេញ! ស្តុកធំមានតែ ${formatQty(currentQtyBulk)} ${translateUnit(selectedProduct.value.unit)}`);
    }

    if (mode.value === 'OUT' && !form.reason.trim()) {
        return notification.warning("សូមបញ្ជាក់មូលហេតុនៃការដកចេញ");
    }

    isSubmitting.value = true;
    try {
        const productRef = doc(db, 'stocks', selectedProduct.value.id);
        
        let newQtyBulk = 0;
        let newCostBulk = Number(selectedProduct.value.unitCost) || 0;
        let transactionTotalValue = 0;
        let historyUnitCost = 0; // បន្ថែមអញ្ញាតនេះសម្រាប់កត់ត្រាតម្លៃទិញចូលពិតប្រាកដក្នុងប្រវត្តិ
        
        const adminName = auth.currentUser?.displayName || 'Admin';

        if (mode.value === 'IN') {
            // ១. គណនាតម្លៃដើមមធ្យមភាគ (Moving Average Cost)
            const oldQty = currentQtyBulk;
            const oldUnitCost = newCostBulk; 
            const oldTotalValue = oldQty * oldUnitCost;

            const incomingQty = qtyDeltaBulk; 
            const incomingUnitCost = Number(form.cost);
            const incomingTotalValue = incomingQty * incomingUnitCost;

            newQtyBulk = oldQty + incomingQty;
            
            // ការពារការចែកនឹងសូន្យ ប្រសិនបើស្តុកសរុបធំជាង 0 ទើបគណនាមធ្យមភាគ
            if (newQtyBulk > 0) {
                newCostBulk = (oldTotalValue + incomingTotalValue) / newQtyBulk;
            } else {
                newCostBulk = incomingUnitCost; // ក្នុងករណីស្តុកមុន 0
            }

            transactionTotalValue = incomingTotalValue;
            historyUnitCost = incomingUnitCost; // កត់ត្រាតម្លៃដែលទិញចូលជាក់ស្តែងសម្រាប់ជើងនេះ

        } else {
            // Logic សម្រាប់ OUT (រក្សាទុកធម្មតា)
            newQtyBulk = currentQtyBulk - qtyDeltaBulk;
            historyUnitCost = newCostBulk; // យកតម្លៃមធ្យមភាគទៅកត់ត្រាជាការខាតបង់
            
            if (form.transactionUnit === 'retail') {
                transactionTotalValue = form.qty * (newCostBulk / itemsPerCase);
            } else {
                transactionTotalValue = form.qty * newCostBulk;
            }
        }

        // 1. Update Main Stock (Collection 'stocks')
        await updateDoc(productRef, {
            quantity: newQtyBulk,
            unitCost: newCostBulk, // នេះគឺជាតម្លៃមធ្យមភាគថ្មី
            totalCost: newQtyBulk * newCostBulk, // តម្លៃទុនសរុបប្រចាំស្តុក
            updatedAt: serverTimestamp()
        });

        // 2. Add Transaction to History (Collection 'stock_transactions')
        const displayUnitStr = form.transactionUnit === 'retail' ? (selectedProduct.value.retailUnit || 'bottle') : selectedProduct.value.unit;

        await addDoc(collection(db, 'stock_transactions'), {
            type: mode.value,
            productId: selectedProduct.value.id,
            productName: selectedProduct.value.name,
            qty: form.qty,
            unitDisplay: displayUnitStr,
            unitCost: historyUnitCost, // ប្រើប្រាស់តម្លៃជាក់ស្តែងនៃប្រតិបត្តិការ
            totalValue: transactionTotalValue,
            currency: selectedProduct.value.currency,
            reason: form.reason || (mode.value === 'IN' ? 'នាំចូលស្តុកបន្ថែម' : 'ដកចេញ'),
            createdBy: adminName,
            createdAt: serverTimestamp()
        });

        notification.success(`បាន${mode.value === 'IN' ? 'នាំចូល' : 'ដកចេញ'}ដោយជោគជ័យ!`);
        clearSelection();

    } catch (error) {
        console.error(error);
        notification.error("មានបញ្ហាក្នុងការរក្សាទុក");
    } finally {
        isSubmitting.value = false;
    }
};

// Fetch History
onMounted(() => {
    const q = query(collection(db, 'stock_transactions'), orderBy('createdAt', 'desc'));
    onSnapshot(q, (snap) => {
        history.value = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        isLoadingHistory.value = false;
    });
});

// Utils
const formatPrice = (val) => Number(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 });

const formatQty = (val) => {
    if (!val) return '0';
    return Number(val).toFixed(2).replace(/\.00$/, ''); 
};

const translateUnit = (unit) => {
    const map = { bottle: 'ដប', case: 'កេះ', pack: 'កញ្ចប់', can: 'កំប៉ុង', kg: 'គីឡូ' };
    return map[unit] || unit;
};

const translateRetailUnit = (prod) => {
    if (prod && prod.retailUnit) return translateUnit(prod.retailUnit);
    if (prod && prod.unit === 'case') return 'ដប/កញ្ចប់';
    return translateUnit(prod ? prod.unit : 'bottle');
};

const formatDate = (ts) => {
    if(!ts) return '';
    return new Intl.DateTimeFormat('km-KH', { dateStyle: 'medium', timeStyle: 'short' }).format(ts.toDate());
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #52525b; border-radius: 10px; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #71717a; }

.animate-fade-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.animate-slide-up { animation: slideUp 0.3s ease-out forwards; }
@keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

/* Vue Transition */
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

input[type="number"]::-webkit-inner-spin-button, input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
input[type="number"] { -moz-appearance: textfield; }
</style>