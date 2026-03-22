<template>
  <div class="h-[100dvh] flex flex-col bg-[#F8FAFC] overflow-hidden font-khmer relative">
    <Teleport to="body">
        <div class="fixed top-4 right-4 z-[9999] w-full max-w-sm pointer-events-none flex flex-col gap-2">
            <div class="pointer-events-auto"><Toast /></div>
        </div>
    </Teleport>

    <div class="bg-white px-4 md:px-6 pt-3 pb-0 border-b border-slate-200/60 flex items-center gap-6 shadow-sm relative z-[40] shrink-0 overflow-x-auto no-scrollbar">
        <button @click="mainTab = 'pos'" class="pb-3 text-sm font-black border-b-2 transition-all flex items-center gap-2 whitespace-nowrap" :class="mainTab === 'pos' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg> ប្រព័ន្ធបញ្ជូលការលក់ (POS)
        </button>
        <button @click="mainTab = 'today'" class="pb-3 text-sm font-black border-b-2 transition-all flex items-center gap-2 whitespace-nowrap" :class="mainTab === 'today' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg> ព័ត៌មានលក់ថ្ងៃនេះ <span class="bg-rose-500 text-white text-[9px] px-1.5 py-0.5 rounded-full animate-pulse shadow-sm">Live</span>
        </button>

        <div class="ml-auto pb-3 flex items-center pr-1">
            <button @click="showFloatingReceipt = !showFloatingReceipt" class="flex items-center gap-1.5 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white px-3 md:px-4 py-1.5 rounded-xl font-black text-[11px] md:text-xs transition-all shadow-md active:scale-95 whitespace-nowrap">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                វិក្កយបត្រ Live
            </button>
        </div>
    </div>

    <div v-show="mainTab === 'pos'" class="flex-1 overflow-hidden flex relative">
        
        <PosProductGrid 
            :products="mixedProducts"
            :searchQuery="searchQuery"
            @update:searchQuery="searchQuery = $event"
            :isLoadingProducts="isLoadingProducts"
            :filteredProducts="paginatedProducts" 
            :totalProductsCount="filteredProducts.length" 
            :activeFilter="activeFilter"
            @update:activeFilter="updateActiveFilter"
            :currentPage="currentPage"
            @update:currentPage="currentPage = $event"
            :getTotalRetailStock="getTotalRetailStock"
            :formatComplexStock="formatComplexStock"
            :translateHardcodedUnit="translateHardcodedUnit"
            :translateRetailUnit="translateRetailUnit"
            :formatPrice="formatPrice"
            @add-to-cart="addToCart"
        />

        <PosCartSidebar 
            :cart="cart"
            :showMobileCart="showMobileCart"
            :timeLeft="timeLeft"
            :cartTotalUSD="cartTotalUSD"
            :getAutoCalculatedType="getAutoCalculatedType"
            :getBadgeClass="getBadgeClass"
            :calculateItemPrice="calculateItemPrice"
            :getSingleBasePrice="getSingleBasePrice"
            :formatPrice="formatPrice"
            :translateHardcodedUnit="translateHardcodedUnit"
            :translateRetailUnit="translateRetailUnit"
            :suggestedAddons="suggestedAddons"
            :autoOpenReceipt="autoOpenReceipt"
            @update:autoOpenReceipt="autoOpenReceipt = $event"
            @add-suggestion="addSuggestedItem"
            @open-mobile="showMobileCart = true"
            @close-mobile="showMobileCart = false"
            @remove="removeFromCart"
            @update-qty="updateQty"
            @commit-qty="commitQty"
            @unit-change="handleUnitChange"
            @manual-price-toggle="handleManualPriceToggle"
            @manual-type-change="handleManualTypeChange"
            @checkout="openCheckoutModal"
            @update-backend="updateActiveCartBackend"
        />

    </div>

    <div v-if="mainTab === 'today'" class="flex-1 overflow-y-auto custom-scrollbar p-0 md:p-6 animate-fade-in bg-[#F4F7FE]">
        <div class="max-w-[90rem] mx-auto w-full h-full">
            <POSTodaySales @triggerAlert="triggerAlert" />
        </div>
    </div>

    <PosFloatingReceipt 
        :show="showFloatingReceipt"
        @close="showFloatingReceipt = false"
        :cart="cart"
        :cartTotalUSD="cartTotalUSD"
        :calculateItemPrice="calculateItemPrice"
        :getSingleBasePrice="getSingleBasePrice"
        :formatPrice="formatPrice"
        :translateRetailUnit="translateRetailUnit"
    />

    <CheckoutModal ref="checkoutModalRef" :show="isCheckoutModalOpen" :cartLength="cart.length" :cartTotalUSD="cartTotalUSD" :sellers="sellers" :savedCustomers="savedCustomers" :isSubmitting="isSubmitting" @close="isCheckoutModalOpen = false" @confirm="submitSale" />
    <SuccessModal :show="isSuccessModalOpen" :isSendingToBot="isSendingToBot" @close="closeSuccessModal" @print="printInvoice" @download-pdf="downloadPDF" @share-app="shareToTelegramApp" @send-bot="sendToTelegramBotGroup" />

    <transition name="modal-fade">
        <div v-if="warningModal.show" class="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm font-khmer">
            <div class="bg-white rounded-3xl w-full max-w-sm p-6 text-center shadow-2xl relative overflow-hidden animate-slide-up border border-rose-100">
                <div class="absolute top-0 inset-x-0 h-2 bg-amber-500"></div>
                <div class="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-100">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                </div>
                <h3 class="text-lg font-black text-slate-800 mb-2">សារព្រមានចំណាំ!</h3>
                <p class="text-[13px] font-bold text-slate-600 leading-relaxed mb-6">
                    {{ warningModal.message }}
                </p>
                <button @click="warningModal.show = false" class="w-full bg-slate-800 hover:bg-slate-900 text-white font-black py-3 rounded-xl transition-all active:scale-95 shadow-md">
                    យល់ព្រម (ខ្ញុំបានដឹង)
                </button>
            </div>
        </div>
    </transition>

    <div ref="printStaging" class="fixed top-0 left-[-9999px] pointer-events-none z-[-1] opacity-0 print:opacity-100 bg-white"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';
import { db, auth } from '@/firebaseConfig';
// 🌟 បានបន្ថែម getDocs, orderBy និង limit នៅទីនេះ
import { collection, addDoc, query, where, onSnapshot, doc, updateDoc, increment, setDoc, deleteDoc, getDocs, orderBy, limit } from 'firebase/firestore'; 
import { onAuthStateChanged } from 'firebase/auth';
import Toast from '@/components/Toast.vue';
import { useNotificationStore } from '@/stores/notification';

import POSTodaySales from '../reports/pos/POSTodaySales.vue'; 
import CheckoutModal from './components/CheckoutModal.vue';
import SuccessModal from './components/SuccessModal.vue';
import PosProductGrid from './components/PosProductGrid.vue';
import PosCartSidebar from './components/PosCartSidebar.vue';
import PosFloatingReceipt from './components/PosFloatingReceipt.vue';

const router = useRouter();
const notification = useNotificationStore();

// --- STATE ---
const mainTab = ref('pos'); 
const showMobileCart = ref(false); 
const showFloatingReceipt = ref(false); 
const autoOpenReceipt = ref(true); 

const mixedProducts = ref([]); 
const originalStocks = ref([]); 
const combosGlobal = ref([]);
const sellers = ref([]);
const savedCustomers = ref([]); 
const isLoadingProducts = ref(true);

const searchQuery = ref('');
const activeFilter = ref('ALL'); 
const currentPage = ref(1);
const ITEMS_PER_PAGE = 20;

const warningModal = reactive({ show: false, message: '' });
const showWarning = (msg) => { warningModal.message = msg; warningModal.show = true; };

const cart = ref([]);

// --- MODAL STATES ---
const isCheckoutModalOpen = ref(false);
const checkoutModalRef = ref(null);
const isSubmitting = ref(false);
const isSendingToBot = ref(false);
const isSuccessModalOpen = ref(false);
const lastSavedSale = ref(null);
const printStaging = ref(null);

let unsubscribeProducts = null; 
let unsubscribeCombos = null;

const timeLeft = ref("");
const reservationTimer = ref(null);

// --- UTILS ---
const triggerAlert = (type, title, message) => { if (type === 'error') notification.error(message); else notification.success(message); };
const formatPrice = (val, currency = 'USD') => { 
    if (val === undefined || val === null) return '0.00'; 
    let formattedNum = Number(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 3 });
    return formattedNum + (currency === 'USD' ? ' $' : ' ៛');  
};
const translateHardcodedUnit = (unit) => { const map = { bottle: 'ដប', case: 'កេះ', pack: 'កញ្ចប់', can: 'កំប៉ុង', kg: 'គីឡូ', set: 'ឈុត', pair: 'គូ', pcs: 'PCS' }; return map[unit] || unit; };

const translateRetailUnit = (prod) => {
    if (!prod) return 'ដប';
    if (prod.isCombo) return 'ឈុត';
    if (prod.category === 'ម៉ាស់') return 'សន្លឹក';
    if (prod.category === 'ស្បែកជើង') return 'គូ';
    if (prod.category === 'ការបូប' || prod.category === 'ខោ' || prod.category === 'អាវ') return 'PCS';
    return translateHardcodedUnit(prod.retailUnit || 'bottle');
};

// --- FETCH DATA ---
onMounted(() => {
    const authListener = onAuthStateChanged(auth, async (user) => {
        if (user) {
            try {
                if (unsubscribeProducts) unsubscribeProducts();
                if (unsubscribeCombos) unsubscribeCombos();

                // 1. រក្សាទុក onSnapshot សម្រាប់ស្តុកដើម្បីការពារការលក់ជាន់គ្នា
                unsubscribeProducts = onSnapshot(collection(db, 'stocks'), (snapshot) => {
                    originalStocks.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), isCombo: false })).filter(i => !i.isDeleted);
                    combineProductsAndCombos();
                });

                unsubscribeCombos = onSnapshot(collection(db, 'combos'), (snapshot) => {
                    combosGlobal.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), isCombo: true }));
                    combineProductsAndCombos();
                });

                // 2. អាប់ដេតមុខងារទាញយក "អ្នកលក់" ដោយប្រើត្រឹម getDocs (សន្សំសំចៃ Read) 🌟
                const qSellers = query(collection(db, "users"), where("role", "in", ["seller", "dealer"]), where("createdBy", "==", user.uid));
                const sellerSnap = await getDocs(qSellers);
                sellers.value = sellerSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                
                // 3. អាប់ដេតមុខងារទាញយក "ឈ្មោះអតិថិជន" ដោយប្រើ getDocs, orderBy និងកំណត់ Limit ត្រឹម 50 🌟
                const qSales = query(
                    collection(db, 'sales_reports'), 
                    where('createdBy', '==', user.uid),
                    orderBy('createdAt', 'desc'),
                    limit(50)
                );
                const salesSnap = await getDocs(qSales);
                const uniqueCustomers = {};
                salesSnap.docs.forEach(doc => {
                    const data = doc.data();
                    if (data.customerName && !uniqueCustomers[data.customerName]) {
                        uniqueCustomers[data.customerName] = { name: data.customerName, phone: data.customerPhone || '', province: data.province || '', district: data.district || '' };
                    }
                });
                savedCustomers.value = Object.values(uniqueCustomers);

            } catch (error) { console.error("Setup Error:", error); }
        } else {
            router.push('/');
        }
    });

    onUnmounted(() => {
        if (authListener) authListener();
        if (unsubscribeProducts) unsubscribeProducts(); 
        if (unsubscribeCombos) unsubscribeCombos(); 
        if (reservationTimer.value) clearInterval(reservationTimer.value); 
    });
});

const combineProductsAndCombos = () => {
    mixedProducts.value = [...originalStocks.value, ...combosGlobal.value];
    cart.value = cart.value.map(cartItem => {
        const updatedProduct = mixedProducts.value.find(p => p.id === cartItem.product.id);
        if (updatedProduct) { cartItem.product = updatedProduct; }
        if (!cartItem.inputQty) cartItem.inputQty = cartItem.qty; 
        if (!cartItem.manualType) cartItem.manualType = 'auto'; 
        return cartItem;
    });
    isLoadingProducts.value = false;
};

const updateActiveFilter = (filterName) => {
    activeFilter.value = filterName;
    currentPage.value = 1; 
};

watch(searchQuery, () => {
    currentPage.value = 1;
});

const filteredProducts = computed(() => {
    let result = mixedProducts.value;

    if (activeFilter.value === 'BIOAOUA') {
        result = result.filter(p => !p.isCombo && p.name && p.name.toUpperCase().includes('BIOAOUA'));
    } else if (activeFilter.value === 'DR+') {
        result = result.filter(p => !p.isCombo && p.name && p.name.toUpperCase().includes('DR+'));
    } else if (activeFilter.value === 'MASK') {
        result = result.filter(p => !p.isCombo && p.name && p.name.toUpperCase().includes('MASK'));
    } else if (activeFilter.value === 'OTHER') {
        result = result.filter(p => {
            if (p.isCombo) return false; 
            if (!p.name) return true;
            const upperName = p.name.toUpperCase();
            return !upperName.includes('BIOAOUA') && !upperName.includes('DR+') && !upperName.includes('MASK');
        });
    }

    if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase().trim();
        result = result.filter(p => 
            (p.name && p.name.toLowerCase().includes(q)) || 
            (p.barcode && p.barcode.toLowerCase().includes(q))
        );
    }

    return result;
});

const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * ITEMS_PER_PAGE;
    return filteredProducts.value.slice(start, start + ITEMS_PER_PAGE);
});

const suggestedAddons = computed(() => {
    const hasTriggerItem = cart.value.some(item => item.product.name && item.product.name.toUpperCase().includes('ACF78'));
    if (!hasTriggerItem) return [];
    return mixedProducts.value.filter(p => p.name && p.name.toUpperCase().includes('AU001@P'));
});

// --- LOGIC FUNCTIONS ---
const getTotalRetailStock = (product) => {
    if (product.isCombo) {
        if (!product.items || product.items.length === 0) return 0;
        let minPossibleCombos = Infinity;
        for (const comboItem of product.items) {
            const stockItem = originalStocks.value.find(s => s.id === comboItem.productId);
            if (!stockItem) return 0; 
            let itemRetailStock = 0;
            if (stockItem.unit === 'case') {
                 const perCase = Number(stockItem.itemsPerCase) || 1;
                 const perBox = stockItem.category === 'ម៉ាស់' ? (Number(stockItem.itemsPerBox) || 1) : 1;
                 itemRetailStock = Math.floor((Number(stockItem.quantity) || 0) * perCase * perBox);
            } else {
                 itemRetailStock = Math.floor(Number(stockItem.quantity) || 0);
            }
            const canMake = Math.floor(itemRetailStock / (Number(comboItem.qty) || 1));
            if (canMake < minPossibleCombos) minPossibleCombos = canMake;
        }
        return minPossibleCombos === Infinity ? 0 : minPossibleCombos;
    } else {
        if (product.unit === 'case') {
             const perCase = Number(product.itemsPerCase) || 1;
             const perBox = product.category === 'ម៉ាស់' ? (Number(product.itemsPerBox) || 1) : 1;
             return Math.floor((Number(product.quantity) || 0) * perCase * perBox);
        }
        return Math.floor(Number(product.quantity) || 0);
    }
};

const formatComplexStock = (product) => {
    const retailTotal = Math.floor(getTotalRetailStock(product)); 
    if (retailTotal <= 0) return '0 ស្តុក';
    if (product.isCombo) return `${retailTotal.toLocaleString()} ឈុត`;
    
    if (product.unit === 'case') {
        const perCase = Number(product.itemsPerCase) || 1;
        const perBox = product.category === 'ម៉ាស់' ? (Number(product.itemsPerBox) || 1) : 1;
        
        const totalInBaseRetail = retailTotal;
        const cases = Math.floor(totalInBaseRetail / (perCase * perBox));
        let remainderText = '';
        
        if (product.category === 'ម៉ាស់') {
            const remainingPiecesAfterCases = totalInBaseRetail % (perCase * perBox);
            const boxes = Math.floor(remainingPiecesAfterCases / perBox);
            const sheets = remainingPiecesAfterCases % perBox;
            
            let parts = [];
            if (cases > 0) parts.push(`${cases} កេះ`);
            if (boxes > 0) parts.push(`${boxes} ប្រអប់`);
            if (sheets > 0) parts.push(`${sheets} សន្លឹក`);
            return parts.join(' ');
        } else {
            const retailRem = totalInBaseRetail % perCase;
            let parts = [];
            if (cases > 0) parts.push(`${cases} កេះ`);
            if (retailRem > 0) parts.push(`${retailRem} ${translateRetailUnit(product)}`);
            return parts.join(' ');
        }
    }
    
    return `${retailTotal.toLocaleString()} ${translateRetailUnit(product)}`;
};

const getRetailQtyEquivalent = (product, qty, selectedUnit) => {
    if (product.isCombo) return qty;
    if (selectedUnit === 'case') {
        const perCase = Number(product.itemsPerCase) || 1;
        const perBox = product.category === 'ម៉ាស់' ? (Number(product.itemsPerBox) || 1) : 1;
        return qty * perCase * perBox;
    }
    if (selectedUnit === 'box' && product.category === 'ម៉ាស់') {
        return qty * (Number(product.itemsPerBox) || 1);
    }
    return qty;
};

const getSingleBasePrice = (item) => {
    const { product, qty, selectedUnit } = item;
    let targetUnit = 'bottle';
    if (product.isCombo) targetUnit = 'set';
    else if (selectedUnit === 'case') targetUnit = 'case';
    else if (selectedUnit === 'box') targetUnit = 'box';

    if (product.wholesaleTiers && Array.isArray(product.wholesaleTiers) && product.wholesaleTiers.length > 0) {
        let unitTiers = product.wholesaleTiers.filter(t => t.unit === targetUnit);
        if (product.isCombo && unitTiers.length === 0) { unitTiers = product.wholesaleTiers; }
        if (unitTiers.length > 0) {
            const sorted = [...unitTiers].sort((a, b) => Number(b.minQty) - Number(a.minQty));
            const appliedTier = sorted.find(t => qty >= Number(t.minQty));
            if (appliedTier && Number(appliedTier.price) > 0) return Number(appliedTier.price);
        }
    }
    return Number(product.retailPrice) || 0;
};

const getSingleCasePrice = (item) => getSingleBasePrice(item) * (Number(item.product.itemsPerCase) || 1);

const calculateItemUnitPrice = (item) => {
    if (item.isManualPrice) return Number(item.manualPrice) || 0;
    if (item.product.isCombo) return getSingleBasePrice(item);
    
    const basePrice = getSingleBasePrice(item);
    if (item.selectedUnit === 'case') {
        const perCase = Number(item.product.itemsPerCase) || 1;
        const perBox = item.product.category === 'ម៉ាស់' ? (Number(item.product.itemsPerBox) || 1) : 1;
        const tierFound = item.product.wholesaleTiers?.find(t=>t.unit === 'case');
        return tierFound ? basePrice : (basePrice * perCase * perBox);
    }
    if (item.selectedUnit === 'box' && item.product.category === 'ម៉ាស់') {
         const perBox = Number(item.product.itemsPerBox) || 1;
         const tierFound = item.product.wholesaleTiers?.find(t=>t.unit === 'box');
         return tierFound ? basePrice : (basePrice * perBox);
    }

    return basePrice;
};

const calculateItemPrice = (item) => calculateItemUnitPrice(item) * item.qty;
const cartTotalUSD = computed(() => cart.value.reduce((total, item) => total + calculateItemPrice(item), 0));

const getAutoCalculatedType = (item) => {
    const { product, selectedUnit, isManualPrice, manualPrice, qty } = item;
    let targetUnit = 'bottle';
    if (product.isCombo) targetUnit = 'set';
    else if (selectedUnit === 'case') targetUnit = 'case';
    else if (selectedUnit === 'box') targetUnit = 'box';

    let sysWholesalePrice = null;
    if (product.wholesaleTiers && Array.isArray(product.wholesaleTiers) && product.wholesaleTiers.length > 0) {
        let unitTiers = product.wholesaleTiers.filter(t => t.unit === targetUnit);
        if (product.isCombo && unitTiers.length === 0) { unitTiers = product.wholesaleTiers; }
        if (unitTiers.length > 0) {
            const sorted = [...unitTiers].sort((a, b) => Number(b.minQty) - Number(a.minQty));
            if (isManualPrice) {
                const firstTier = [...unitTiers].sort((a,b) => Number(a.minQty) - Number(b.minQty))[0];
                if (firstTier && Number(firstTier.price) > 0) sysWholesalePrice = Number(firstTier.price);
            } else {
                const appliedTier = sorted.find(t => qty >= Number(t.minQty));
                if (appliedTier && Number(appliedTier.price) > 0) return 'លក់បោះដុំ'; 
            }
        }
    }
    if (isManualPrice) {
        const currentManualPrice = Number(manualPrice) || 0;
        if (sysWholesalePrice !== null && currentManualPrice > 0 && currentManualPrice <= sysWholesalePrice) return 'លក់បោះដុំ';
        return 'លក់រាយ';
    }
    return product.isCombo ? 'ឈុត' : 'លក់រាយ';
};

const getBadgeClass = (item) => {
    const label = (item.manualType && item.manualType !== 'auto') ? item.manualType : getAutoCalculatedType(item);
    if (item.manualType && item.manualType !== 'auto') return 'bg-amber-50 text-amber-700 border-amber-300 shadow-sm'; 
    if (label.includes('បោះដុំ')) return 'bg-purple-50 text-purple-600 border-purple-200';
    if (label.includes('ឈុត')) return 'bg-orange-50 text-orange-600 border-orange-200';
    return 'bg-indigo-50 text-indigo-600 border-indigo-200';
};

// --- ACTION LOGIC ---
const addSuggestedItem = async (product) => {
    const maxStock = getTotalRetailStock(product);
    if (maxStock <= 0) return notification.error("អស់ពីស្តុកហើយ!");
    
    const defaultUnit = 'retail';
    const retailQtyToAdd = getRetailQtyEquivalent(product, 1, defaultUnit);
    
    const existingIndex = cart.value.findIndex(item => item.product.id === product.id && item.selectedUnit === defaultUnit && item.isManualPrice && item.manualPrice === 0);
    
    if (existingIndex !== -1) {
        if (cart.value[existingIndex].qty + 1 > maxStock) return notification.error(`មានស្តុកត្រឹមតែ ${maxStock} ប៉ុណ្ណោះ`);
        cart.value[existingIndex].qty += 1;
        cart.value[existingIndex].inputQty = cart.value[existingIndex].qty;
    } else {
        if (retailQtyToAdd > maxStock) return notification.error(`មានស្តុកត្រឹមតែ ${maxStock} ប៉ុណ្ណោះ`);
        cart.value.push({ 
            product: product, 
            qty: 1, 
            inputQty: 1, 
            selectedUnit: defaultUnit, 
            isManualPrice: true,
            manualPrice: 0,
            manualType: 'ថែមជូន'
        });
    }
    
    await modifyStockReservation(product, retailQtyToAdd); 
    await updateActiveCartBackend();
    notification.success(`បានបន្ថែមទំនិញថែមជូនចូលកន្ត្រក!`);
};

const handleManualPriceToggle = (index) => {
    const item = cart.value[index];
    if (item.isManualPrice) {
        showWarning("ការបញ្ជូលតម្លៃដោយដៃ អាចមានផលប៉ះពាល់ធ្វើឱ្យខុសរបាយការណ៍របស់អ្នកទាំងមូល ដូច្នោះសូមផ្ទៀងផ្ទាត់ឱ្យច្បាស់លាស់!");
        if (item.manualPrice === 0) item.manualPrice = calculateItemUnitPrice({ ...item, isManualPrice: false });
    }
    updateActiveCartBackend();
};

const handleManualTypeChange = (index, event) => {
    if (event.target.value !== 'auto') showWarning("ការចុចជ្រើសរើសដោយដៃ អាចមានផលប៉ះពាល់ធ្វើឱ្យខុសរបាយការណ៍របស់អ្នកទាំងមូល ដូច្នោះសូមផ្ទៀងផ្ទាត់ឱ្យច្បាស់លាស់!");
    updateActiveCartBackend();
};

const startCartTimer = (expiresAt) => {
    if (reservationTimer.value) clearInterval(reservationTimer.value);
    reservationTimer.value = setInterval(async () => {
        const distance = expiresAt - new Date().getTime();
        if (distance <= 0) { clearInterval(reservationTimer.value); timeLeft.value = ""; await handleCartTimeout(); return; }
        timeLeft.value = `${String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0')}:${String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(2, '0')}`;
    }, 1000);
};

const handleCartTimeout = async () => {
    if (cart.value.length === 0) return;
    const itemsToReturn = [...cart.value];
    cart.value = []; 
    showMobileCart.value = false;
    isCheckoutModalOpen.value = false;
    notification.error("រយៈពេលកក់ស្តុកបានផុតកំណត់! កន្ត្រកត្រូវបានសម្អាត។");
    for (const item of itemsToReturn) {
        const retailQtyToReturn = getRetailQtyEquivalent(item.product, item.qty, item.selectedUnit);
        await modifyStockReservation(item.product, -retailQtyToReturn);
    }
    await updateActiveCartBackend();
};

const updateActiveCartBackend = async () => {
    if (!auth.currentUser) return;
    const adminId = auth.currentUser.uid;
    const cartRef = doc(db, 'active_carts', adminId);
    if (cart.value.length === 0) { await deleteDoc(cartRef).catch(e => {}); clearInterval(reservationTimer.value); timeLeft.value = ""; showMobileCart.value = false; return; }
    const expiresAt = new Date(Date.now() + 9 * 60 * 1000).getTime();
    const plainItems = cart.value.map(item => ({ 
        id: item.product.id, qty: item.qty, selectedUnit: item.selectedUnit, 
        isManualPrice: item.isManualPrice, manualPrice: item.manualPrice, manualType: item.manualType 
    }));
    await setDoc(cartRef, { uid: adminId, items: plainItems, expiresAt, status: "PENDING" }, { merge: true });
    startCartTimer(expiresAt);
};

const modifyStockReservation = async (product, retailQtyDelta) => {
    try {
        if (product.isCombo) {
            for (const subItem of product.items) {
                const stockRef = doc(db, 'stocks', subItem.productId);
                const originalStock = originalStocks.value.find(s => s.id === subItem.productId);
                
                let perCase = 1;
                let perBox = 1;
                if (originalStock && originalStock.unit === 'case') {
                    perCase = Number(originalStock.itemsPerCase) || 1;
                    if (originalStock.category === 'ម៉ាស់') perBox = Number(originalStock.itemsPerBox) || 1;
                }
                
                const bulkQtyDelta = (subItem.qty * retailQtyDelta) / (perCase * perBox); 
                await updateDoc(stockRef, { quantity: increment(-bulkQtyDelta), stock_reserved: increment(bulkQtyDelta) });
            }
        } else {
            const stockRef = doc(db, 'stocks', product.id);
            let perCase = 1;
            let perBox = 1;
            if (product.unit === 'case') {
                 perCase = Number(product.itemsPerCase) || 1;
                 if (product.category === 'ម៉ាស់') perBox = Number(product.itemsPerBox) || 1;
            }
            const bulkQtyDelta = retailQtyDelta / (perCase * perBox); 
            await updateDoc(stockRef, { quantity: increment(-bulkQtyDelta), stock_reserved: increment(bulkQtyDelta) });
        }
    } catch (e) { console.error(e); }
};

const addToCart = async (product) => {
    const maxStock = getTotalRetailStock(product);
    if (maxStock <= 0) return notification.error("អស់ពីស្តុកហើយ!");
    const defaultUnit = 'retail';
    const retailQtyToAdd = getRetailQtyEquivalent(product, 1, defaultUnit);
    const existingIndex = cart.value.findIndex(item => item.product.id === product.id && item.selectedUnit === defaultUnit && !item.isManualPrice);
    
    if (existingIndex !== -1) {
        if (cart.value[existingIndex].qty + 1 > maxStock) return notification.error(`មានស្តុកត្រឹមតែ ${formatComplexStock(product)} ប៉ុណ្ណោះ`);
        cart.value[existingIndex].qty += 1;
        cart.value[existingIndex].inputQty = cart.value[existingIndex].qty;
    } else {
        if (retailQtyToAdd > maxStock) return notification.error(`មានស្តុកត្រឹមតែ ${formatComplexStock(product)} ប៉ុណ្ណោះ`);
        cart.value.push({ product: product, qty: 1, inputQty: 1, selectedUnit: defaultUnit, isManualPrice: false, manualPrice: 0, manualType: 'auto' });
    }
    await modifyStockReservation(product, retailQtyToAdd); 
    await updateActiveCartBackend();

    // 🌟 បើកវិក្កយបត្រស្វ័យប្រវត្តិ ប្រសិនបើបានបើក AutoToggle 🌟
    if (autoOpenReceipt.value) {
        showFloatingReceipt.value = true;
    }
};

const handleUnitChange = async (index, event) => {
    const newUnit = event.target.value;
    const item = cart.value[index];
    const oldUnit = item.selectedUnit;
    if (oldUnit === newUnit) return;
    const oldRetailQty = getRetailQtyEquivalent(item.product, item.qty, oldUnit);
    const newRetailQty = getRetailQtyEquivalent(item.product, item.qty, newUnit);
    const retailDelta = newRetailQty - oldRetailQty;
    const maxRetailStock = getTotalRetailStock(item.product);

    if (retailDelta > maxRetailStock) {
        event.target.value = oldUnit; 
        return notification.error('ស្តុកមិនគ្រប់គ្រាន់សម្រាប់ប្តូរជាខ្នាតនេះទេ!');
    }
    item.selectedUnit = newUnit;
    await modifyStockReservation(item.product, retailDelta);
    await updateActiveCartBackend();
};

const updateQty = async (index, delta) => {
    const item = cart.value[index];
    const maxRetailStock = getTotalRetailStock(item.product);
    const newQty = item.qty + delta;
    if (newQty > 0) {
        const retailDelta = getRetailQtyEquivalent(item.product, delta, item.selectedUnit);
        if (retailDelta > 0 && retailDelta > maxRetailStock) return notification.error(`ស្តុកមិនគ្រប់គ្រាន់`);
        item.qty = newQty; item.inputQty = newQty; 
        await modifyStockReservation(item.product, retailDelta); 
        await updateActiveCartBackend();
    } else await removeFromCart(index);
};

const commitQty = async (index) => {
    const item = cart.value[index];
    let newQty = parseInt(item.inputQty); 
    if (isNaN(newQty) || newQty < 1) { item.inputQty = item.qty; return; }
    const delta = newQty - item.qty; 
    if (delta === 0) return;
    const maxRetailStock = getTotalRetailStock(item.product);
    const retailDelta = getRetailQtyEquivalent(item.product, delta, item.selectedUnit);
    if (retailDelta > 0 && retailDelta > maxRetailStock) { notification.error(`ស្តុកមានមិនគ្រប់គ្រាន់`); item.inputQty = item.qty; return; }
    item.qty = newQty; item.inputQty = newQty; 
    await modifyStockReservation(item.product, retailDelta); 
    await updateActiveCartBackend();
};

const removeFromCart = async (index) => {
    const item = cart.value[index];
    const retailQtyToReturn = getRetailQtyEquivalent(item.product, item.qty, item.selectedUnit);
    cart.value.splice(index, 1);
    await modifyStockReservation(item.product, -retailQtyToReturn); 
    await updateActiveCartBackend();
    
    if (cart.value.length === 0) {
        showFloatingReceipt.value = false;
    }
};

// 🌟 បិទវិក្កយបត្រស្វ័យប្រវត្តិ ពេលចុចប៊ូតុង បន្តការទូទាត់ 🌟
const openCheckoutModal = () => { 
    isCheckoutModalOpen.value = true; 
    showFloatingReceipt.value = false;
};

const submitSale = async (formData) => {
    isSubmitting.value = true;
    try {
        const adminId = auth.currentUser.uid;
        const receiptCode = `INV-${Date.now().toString().slice(-6)}`;
        let combinedLocation = formData.isDirectCustomer ? 'ទិញផ្ទាល់' : `${formData.district}, ${formData.province}`;

        const itemsToSave = cart.value.map((item, index) => {
            const finalType = item.manualType !== 'auto' ? item.manualType : getAutoCalculatedType(item);
            let correctUnit = item.product.isCombo ? 'set' : (item.selectedUnit === 'case' ? (item.product.unit || 'case') : (item.product.retailUnit || 'bottle'));
            let safeImage = item.product.image || '';
            if (safeImage.startsWith('data:image')) safeImage = ''; 
            
            let itemCost = 0;
            if (item.product.isCombo) {
                itemCost = item.product.totalBaseCost;
            } else {
                const perCase = Number(item.product.itemsPerCase) || 1;
                const perBox = item.product.category === 'ម៉ាស់' ? (Number(item.product.itemsPerBox) || 1) : 1;
                
                if (item.selectedUnit === 'case') itemCost = Number(item.product.unitCost);
                else if (item.selectedUnit === 'box' && item.product.category === 'ម៉ាស់') itemCost = Number(item.product.unitCost) / perCase;
                else itemCost = Number(item.product.unitCost) / (perCase * perBox);
            }

            return {
                id: item.product.id, cartItemId: `${item.product.id}_${Date.now()}_${index}`,
                name: item.product.name, image: safeImage, price: calculateItemUnitPrice(item), 
                qty: item.qty, type: finalType, isManualPriceApplied: Boolean(item.isManualPrice), 
                isManualTypeApplied: item.manualType !== 'auto', unit: correctUnit, 
                itemsPerCase: Number(item.product.itemsPerCase) || 1, isCombo: Boolean(item.product.isCombo),
                cost: itemCost
            };
        });

        const payload = {
            receiptId: receiptCode, createdAt: new Date(formData.date).toISOString(), createdBy: adminId,
            uid: formData.sellerId, sellerName: formData.sellerName, customerName: formData.customerName, 
            customerPhone: formData.customerPhone, location: combinedLocation, province: formData.province, 
            district: formData.district, paymentMethod: formData.paymentMethod, paymentNote: formData.paymentNote || '',
            paymentImage: '', paymentStatus: formData.paymentStatus, deliveryFee: formData.deliveryFee || 0, 
            deliveryCurrency: formData.deliveryCurrency, totalAmount: formData.finalTotalUSD, currency: 'USD',
            items: itemsToSave
        };

        const docRef = await addDoc(collection(db, 'sales_reports'), payload);
        lastSavedSale.value = { id: docRef.id, ...payload };

        for (const item of cart.value) {
            if (item.product.isCombo) {
                for (const subItem of item.product.items) {
                    const originalStock = originalStocks.value.find(s => s.id === subItem.productId);
                    let perCase = 1; let perBox = 1;
                    if (originalStock && originalStock.unit === 'case') {
                         perCase = Number(originalStock.itemsPerCase) || 1;
                         if (originalStock.category === 'ម៉ាស់') perBox = Number(originalStock.itemsPerBox) || 1;
                    }
                    const bulkQtyToDeduct = (subItem.qty * item.qty) / (perCase * perBox);
                    await updateDoc(doc(db, 'stocks', subItem.productId), { stock_reserved: increment(-bulkQtyToDeduct) });
                }
            } else {
                const retailQtyToDeduct = getRetailQtyEquivalent(item.product, item.qty, item.selectedUnit);
                let perCase = 1; let perBox = 1;
                if (item.product.unit === 'case') {
                     perCase = Number(item.product.itemsPerCase) || 1;
                     if (item.product.category === 'ម៉ាស់') perBox = Number(item.product.itemsPerBox) || 1;
                }
                const bulkQtyToDeduct = retailQtyToDeduct / (perCase * perBox);
                await updateDoc(doc(db, 'stocks', item.product.id), { stock_reserved: increment(-bulkQtyToDeduct) });
            }
        }

        await deleteDoc(doc(db, 'active_carts', adminId)).catch(e => {});
        clearInterval(reservationTimer.value); timeLeft.value = "";
        
        if (checkoutModalRef.value) checkoutModalRef.value.resetForm();

        if (formData.isFastInputMode) {
            isCheckoutModalOpen.value = false; showMobileCart.value = false; cart.value = []; mainTab.value = 'pos';
            notification.success("ទូទាត់ជោគជ័យ! រួចរាល់សម្រាប់បញ្ចូលបន្ត។");
        } else {
            isCheckoutModalOpen.value = false; showMobileCart.value = false; isSuccessModalOpen.value = true;
        }
    } catch (error) { notification.error("មានបញ្ហាក្នុងការរក្សាទុកទិន្នន័យ"); console.error(error); } 
    finally { isSubmitting.value = false; }
};

const closeSuccessModal = () => { cart.value = []; isSuccessModalOpen.value = false; lastSavedSale.value = null; mainTab.value = 'today'; };
const printInvoice = () => { console.log("Print Invoice Clicked"); };
const downloadPDF = () => { console.log("Download PDF Clicked"); };
const shareToTelegramApp = () => {
    if (!lastSavedSale.value) return;
    const text = encodeURIComponent(`មានវិក្កយបត្រថ្មី: ${lastSavedSale.value.receiptId}\nសរុបទឹកប្រាក់: $${lastSavedSale.value.totalAmount}`);
    window.open(`https://t.me/share/url?url=&text=${text}`, '_blank');
};
const sendToTelegramBotGroup = async () => { /* Logic */ };
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Battambong:wght@400;700;900&display=swap');
.font-khmer { font-family: 'Battambong', sans-serif; }
.custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #94a3b8; }
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
.animate-bounce-short { animation: bounceShort 1s ease-in-out infinite; }
@keyframes bounceShort { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15%); } }
.animate-slide-up { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0); } }
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.2s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
</style>