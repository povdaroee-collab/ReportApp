<template>
  <div class="h-[100dvh] flex flex-col bg-[#F8FAFC] overflow-hidden font-khmer relative">
    <Teleport to="body"><div class="fixed top-4 right-4 z-[9999] w-full max-w-sm pointer-events-none flex flex-col gap-2"><div class="pointer-events-auto"><Toast /></div></div></Teleport>

    <div class="bg-white px-4 md:px-6 pt-3 pb-0 border-b border-slate-200/60 flex items-center gap-6 shadow-sm relative z-[40] shrink-0">
        <button @click="mainTab = 'pos'" class="pb-3 text-sm font-black border-b-2 transition-all flex items-center gap-2" :class="mainTab === 'pos' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg> ប្រព័ន្ធបញ្ជូលការលក់ (POS)
        </button>
        <button @click="mainTab = 'today'" class="pb-3 text-sm font-black border-b-2 transition-all flex items-center gap-2" :class="mainTab === 'today' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg> ព័ត៌មានលក់ថ្ងៃនេះ <span class="bg-rose-500 text-white text-[9px] px-1.5 py-0.5 rounded-full animate-pulse shadow-sm">Live</span>
        </button>
    </div>

    <div v-show="mainTab === 'pos'" class="flex-1 overflow-hidden flex relative">
        
        <div class="flex-1 flex flex-col h-full bg-[#F4F7FE] relative overflow-hidden">
            <div class="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 p-4 shadow-sm z-20 shrink-0">
                <div class="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div class="flex items-center gap-3 w-full md:w-auto">
                        <button @click="$router.back()" class="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors shrink-0"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg></button>
                        <div>
                            <h1 class="text-xl font-black text-slate-800 leading-tight">ប្រព័ន្ធបញ្ជូលការលក់ (POS)</h1>
                            <p class="text-slate-500 text-[10px] font-bold uppercase tracking-wider mt-0.5">Smart Auto-Pricing POS</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-3 w-full md:w-auto">
                        <div class="relative w-full md:w-80">
                            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></span>
                            <input v-model="searchQuery" type="text" placeholder="ស្វែងរកទំនិញ ឬ ឈុត..." class="w-full bg-slate-100 border border-slate-200/60 rounded-xl pl-9 pr-4 py-2.5 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none transition-all shadow-inner">
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar bg-slate-50/50 relative pb-24 md:pb-6">
                <div v-if="isLoadingProducts" class="flex flex-col items-center justify-center h-full opacity-60">
                    <div class="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-blue-600 mb-4"></div>
                    <p class="text-xs font-bold text-slate-500">កំពុងទាញយកទំនិញ និងឈុត...</p>
                </div>
                <div v-else-if="filteredProducts.length === 0" class="flex flex-col items-center justify-center h-full text-slate-400">
                    <svg class="w-16 h-16 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                    <p class="font-bold">រកមិនឃើញទំនិញទេ</p>
                </div>
                <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5 max-w-[100rem] mx-auto">
                    <div v-for="product in filteredProducts" :key="product.id" @click="addToCart(product)" class="bg-white rounded-[1.25rem] p-3 border border-slate-200 shadow-sm transition-all cursor-pointer group relative flex flex-col h-full" :class="getTotalRetailStock(product) > 0 ? 'hover:shadow-lg hover:border-blue-300 active:scale-95' : 'opacity-60 cursor-not-allowed grayscale-[50%]' ">
                        <div v-if="product.isCombo" class="absolute -top-2 -left-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-md z-10 flex items-center gap-1 border border-orange-200">🎁 ឈុត</div>
                        <div class="w-full aspect-square rounded-xl bg-slate-50 mb-3 overflow-hidden border border-slate-100 relative flex items-center justify-center shrink-0">
                            <img v-if="product.image && (product.image.startsWith('http') || product.image.startsWith('data:image'))" :src="product.image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                            <div v-else class="text-slate-300 text-3xl font-black">{{ product.name.charAt(0) }}</div>
                            <div class="absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-black bg-white/95 backdrop-blur-sm border shadow-sm" :class="getTotalRetailStock(product) > 0 ? 'text-emerald-600 border-emerald-100' : 'text-rose-600 border-rose-100'">ស្តុក: {{ getTotalRetailStock(product).toLocaleString() }} {{ translateHardcodedUnit(product.isCombo ? 'set' : (product.retailUnit || 'bottle')) }}</div>
                            <div v-if="getTotalRetailStock(product) <= 0" class="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center"><span class="bg-rose-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-md">អស់ពីស្តុក</span></div>
                        </div>
                        <div class="flex-1 flex flex-col">
                            <h3 class="font-black text-sm text-slate-800 leading-tight mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">{{ product.name }}</h3>
                            <p class="text-[9px] text-slate-400 font-mono mb-2">{{ product.barcode || 'NO-BARCODE' }}</p>
                            <div class="mt-auto pt-2 border-t border-slate-100 flex flex-col gap-1.5">
                                <div v-if="!product.isCombo && product.itemsPerCase && product.itemsPerCase > 1" class="text-[9px] text-slate-500 font-bold bg-slate-50 px-2 py-1 rounded border border-slate-100"><span class="text-slate-600">១{{ translateHardcodedUnit(product.unit) }} = {{ product.itemsPerCase }} {{ translateHardcodedUnit(product.retailUnit) }}</span></div>
                                <div class="flex items-end justify-between mt-1">
                                    <div class="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded"><span>1 {{ translateHardcodedUnit(product.isCombo ? 'set' : (product.retailUnit || 'bottle')) }}</span></div>
                                    <div class="text-right"><p class="text-[15px] font-black text-indigo-600">{{ formatPrice(product.retailPrice, product.currency) }}</p></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <transition enter-active-class="duration-300 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="showMobileCart" @click="showMobileCart = false" class="md:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[45]"></div>
        </transition>

        <div 
            :class="showMobileCart ? 'translate-y-0' : 'translate-y-full md:translate-y-0'"
            class="fixed md:static inset-x-0 bottom-0 h-[85vh] md:h-full w-full md:w-[360px] xl:w-[420px] bg-slate-50 md:border-l border-slate-200 shadow-[0_-15px_40px_-15px_rgba(0,0,0,0.2)] md:shadow-[-10px_0_30px_rgba(0,0,0,0.04)] flex flex-col z-[50] md:z-30 transition-transform duration-300 ease-in-out rounded-t-[2rem] md:rounded-none shrink-0"
        >
            <div class="p-4 md:p-4 border-b border-slate-200 flex items-center justify-between bg-white shrink-0 shadow-sm z-20 rounded-t-[2rem] md:rounded-none pt-6 md:pt-4">
                <div class="absolute top-2.5 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-slate-200 rounded-full md:hidden"></div>
                <div class="flex flex-col">
                    <h2 class="text-lg font-black text-slate-800 flex items-center gap-2"><svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg> កន្ត្រកទំនិញ</h2>
                    <div v-if="timeLeft" class="mt-1 flex items-center gap-1.5 text-[10px] font-black text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-md w-fit animate-pulse"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> ផុតកំណត់ក្នុង: {{ timeLeft }}</div>
                    <p v-else class="text-[9px] font-bold text-indigo-500 mt-0.5">ចំនួនខាងក្រោមគិតជាខ្នាតរាយ ឬឈុត</p>
                </div>
                
                <div class="flex items-center gap-3">
                    <span class="bg-blue-100 text-blue-600 px-2.5 py-0.5 rounded-lg text-xs font-black border border-blue-200">{{ cart.length }}</span>
                    <button @click="showMobileCart = false" class="md:hidden w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                </div>
            </div>

            <div class="flex-1 overflow-y-auto custom-scrollbar p-4">
                <div v-if="cart.length === 0" class="h-full flex flex-col items-center justify-center text-slate-400 opacity-60 min-h-[250px]">
                    <svg class="w-20 h-20 mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                    <p class="font-bold text-sm">មិនទាន់មានទំនិញក្នុងកន្ត្រកទេ</p>
                    <p class="text-[10px] mt-1">សូមចុចលើទំនិញដើម្បីបញ្ជូល</p>
                </div>
                <div v-else class="block">
                    <div class="space-y-3 mb-4">
                        <div v-for="(item, index) in cart" :key="item.product.id" class="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-2 relative group hover:border-blue-400 transition-colors">
                            <button @click="removeFromCart(index)" class="absolute -top-2.5 -right-2.5 w-7 h-7 bg-rose-100 text-rose-600 hover:bg-rose-500 hover:text-white rounded-full flex items-center justify-center shadow-md border-2 border-white z-10"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"/></svg></button>
                            <div class="flex justify-between items-start gap-2">
                                <div class="flex-1">
                                    <h4 class="font-bold text-sm text-slate-800 leading-tight">{{ item.product.name }} <span v-if="item.product.isCombo" class="text-[10px] text-orange-500 ml-1">🎁 ឈុត</span></h4>
                                    <span class="inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-black border" :class="getAutoSaleType(item.product, item.qty) === 'wholesale' ? 'bg-purple-50 text-purple-600 border-purple-200' : 'bg-indigo-50 text-indigo-600 border-indigo-200'">{{ getAutoSaleType(item.product, item.qty) === 'wholesale' ? 'តម្លៃបោះដុំ' : 'តម្លៃលក់រាយ' }}</span>
                                </div>
                                <span class="text-base font-black text-emerald-600 whitespace-nowrap bg-emerald-50/50 px-2 py-1 rounded-lg border border-emerald-100 mt-0.5">{{ formatPrice(calculateItemPrice(item.product, item.qty), item.product.currency) }}</span>
                            </div>
                            <div class="flex items-center justify-between mt-2 pt-3 border-t border-slate-100">
                                <div class="text-[11px] font-bold text-slate-500">{{ formatPrice(calculateItemUnitPrice(item.product, item.qty), item.product.currency) }} <span class="opacity-70">/ 1 {{ translateHardcodedUnit(item.product.isCombo ? 'set' : (item.product.retailUnit || 'bottle')) }}</span></div>
                                <div class="flex items-center gap-2 shrink-0">
                                    <div class="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden h-10 shadow-sm">
                                        <button @click="updateQty(index, -1)" class="w-10 h-full flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors text-xl font-bold">-</button>
                                        <input :value="item.qty" @change="setQty(index, $event.target.value)" type="number" min="1" class="w-16 h-full bg-white text-center text-base font-black border-x border-slate-200 outline-none p-0">
                                        <button @click="updateQty(index, 1)" class="w-10 h-full flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors text-xl font-bold">+</button>
                                    </div>
                                    <span class="text-xs font-black text-slate-600">{{ translateHardcodedUnit(item.product.isCombo ? 'set' : (item.product.retailUnit || 'bottle')) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white p-5 border border-slate-200 shadow-sm rounded-2xl mt-4">
                        <div class="flex justify-between items-end mb-4"><span class="text-sm font-black text-slate-500 uppercase tracking-widest">សរុបប្រាក់ (Total)</span><span class="text-3xl font-black text-emerald-600 leading-none">{{ formatPrice(cartTotalUSD, 'USD') }}</span></div>
                        <button @click="isCheckoutModalOpen = true" :disabled="cart.length === 0" class="w-full py-4 rounded-xl font-black text-base shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg> បន្តការទូទាត់ប្រាក់</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="md:hidden fixed bottom-6 left-0 right-0 px-4 flex justify-center pointer-events-none z-[35]">
            <transition enter-active-class="duration-300 ease-out" enter-from-class="opacity-0 translate-y-10" enter-to-class="opacity-100 translate-y-0" leave-active-class="duration-200 ease-in" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-10">
                <button 
                    v-if="!showMobileCart && cart.length > 0" 
                    @click="showMobileCart = true" 
                    class="pointer-events-auto w-full max-w-sm bg-slate-800 text-white p-4 rounded-[1.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.3)] flex items-center justify-between active:scale-95 transition-transform"
                >
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center relative">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                            <span class="absolute -top-2 -right-2 bg-rose-500 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs font-black border-2 border-slate-800 animate-pulse">{{ cart.length }}</span>
                        </div>
                        <div class="text-left">
                            <p class="text-[10px] text-slate-300 font-bold uppercase tracking-wider">មើលកន្ត្រកទំនិញ</p>
                            <p class="text-sm font-black">{{ formatPrice(cartTotalUSD, 'USD') }}</p>
                        </div>
                    </div>
                    <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path></svg>
                </button>
            </transition>
        </div>

        <CheckoutModal :show="isCheckoutModalOpen" :cartLength="cart.length" :cartTotalUSD="cartTotalUSD" :sellers="sellers" :isSubmitting="isSubmitting" @close="isCheckoutModalOpen = false" @confirm="submitSale" />
        <SuccessModal :show="isSuccessModalOpen" :isSendingToBot="isSendingToBot" @close="closeSuccessModal" @print="printInvoice" @download-pdf="downloadPDF" @share-app="shareToTelegramApp" @send-bot="sendToTelegramBotGroup" />
    </div>

    <div v-if="mainTab === 'today'" class="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 animate-fade-in bg-[#F4F7FE]">
        <div class="max-w-[90rem] mx-auto w-full">
            <POSTodaySales @triggerAlert="triggerAlert" />
        </div>
    </div>

    <div ref="printStaging" class="fixed top-0 left-[-9999px] pointer-events-none z-[-1] opacity-0 print:opacity-100 bg-white"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { db, auth } from '@/firebaseConfig';
import { collection, getDocs, addDoc, query, where, onSnapshot, doc, updateDoc, increment, setDoc, deleteDoc } from 'firebase/firestore'; 
import { onAuthStateChanged } from 'firebase/auth';
import Toast from '@/components/Toast.vue';
import { useNotificationStore } from '@/stores/notification';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

// 📦 ការ Import
import POSTodaySales from '../reports/pos/POSTodaySales.vue'; 
import CheckoutModal from './components/CheckoutModal.vue';
import SuccessModal from './components/SuccessModal.vue';

const router = useRouter();
const notification = useNotificationStore();

// --- STATE ---
const mainTab = ref('pos'); 
const showMobileCart = ref(false); // សម្រាប់បញ្ជា Drawer លើទូរស័ព្ទ

const mixedProducts = ref([]); 
const originalStocks = ref([]); 
const combosGlobal = ref([]);
const sellers = ref([]);
const isLoadingProducts = ref(true);
const searchQuery = ref('');

const cart = ref([]);
const isCheckoutModalOpen = ref(false);
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
const formatDate = (dateStr) => { if(!dateStr) return ''; return new Intl.DateTimeFormat('km-KH', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(dateStr)); };
const formatPrice = (val, currency = 'USD') => { if (val === undefined || val === null) return '0.00'; return Number(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + (currency === 'USD' ? ' $' : ' ៛'); };
const translateHardcodedUnit = (unit) => { const map = { bottle: 'ដប', case: 'កេះ', pack: 'កញ្ចប់', can: 'កំប៉ុង', kg: 'គីឡូ', set: 'ឈុត' }; return map[unit] || unit; };

// --- FETCH DATA (REALTIME) ---
onMounted(() => {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            try {
                unsubscribeProducts = onSnapshot(collection(db, 'stocks'), (snapshot) => {
                    originalStocks.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), isCombo: false })).filter(i => !i.isDeleted);
                    combineProductsAndCombos();
                });
                unsubscribeCombos = onSnapshot(collection(db, 'combos'), (snapshot) => {
                    combosGlobal.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), isCombo: true }));
                    combineProductsAndCombos();
                });
                const snapSellers = await getDocs(query(collection(db, "users"), where("role", "in", ["seller", "dealer"]), where("createdBy", "==", user.uid)));
                sellers.value = snapSellers.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            } catch (error) { console.error(error); }
        } else router.push('/');
    });
});

onUnmounted(() => { if (unsubscribeProducts) unsubscribeProducts(); if (unsubscribeCombos) unsubscribeCombos(); });

const combineProductsAndCombos = () => {
    mixedProducts.value = [...originalStocks.value, ...combosGlobal.value];
    cart.value = cart.value.map(cartItem => {
        const updatedProduct = mixedProducts.value.find(p => p.id === cartItem.product.id);
        if (updatedProduct) { cartItem.product = updatedProduct; }
        return cartItem;
    });
    isLoadingProducts.value = false;
};

// --- SMART POS LOGIC ---
const getTotalRetailStock = (product) => {
    if (product.isCombo) {
        if (!product.items || product.items.length === 0) return 0;
        let minPossibleCombos = Infinity;
        for (const item of product.items) {
            const stockItem = originalStocks.value.find(s => s.id === item.productId);
            if (!stockItem) return 0; 
            const retailStock = (Number(stockItem.quantity) || 0) * (Number(stockItem.itemsPerCase) || 1);
            const possibleForThisItem = Math.floor(retailStock / item.qty);
            if (possibleForThisItem < minPossibleCombos) minPossibleCombos = possibleForThisItem;
        }
        return minPossibleCombos === Infinity ? 0 : minPossibleCombos;
    } else {
        return (Number(product.quantity) || 0) * (Number(product.itemsPerCase) || 1);
    }
};

const getTierMinRetailQty = (tier, product) => {
    const minQty = Number(tier.minQty) || 0;
    if (product.isCombo) return minQty;
    return tier.unit === product.unit ? minQty * (Number(product.itemsPerCase) || 1) : minQty;
};

const filteredProducts = computed(() => {
    if (!searchQuery.value) return mixedProducts.value;
    const q = searchQuery.value.toLowerCase();
    return mixedProducts.value.filter(p => p.name.toLowerCase().includes(q) || (p.barcode && p.barcode.toLowerCase().includes(q)));
});

const getAutoSaleType = (product, cartQty) => {
    if (product.wholesaleTiers && product.wholesaleTiers.length > 0) {
        const sortedTiers = [...product.wholesaleTiers].sort((a, b) => getTierMinRetailQty(a, product) - getTierMinRetailQty(b, product));
        if (cartQty >= getTierMinRetailQty(sortedTiers[0], product)) return 'wholesale';
    }
    return 'retail';
};

const calculateItemUnitPrice = (product, cartQty) => {
    const type = getAutoSaleType(product, cartQty);
    if (type === 'retail') return Number(product.retailPrice) || 0;
    if (type === 'wholesale' && product.wholesaleTiers && product.wholesaleTiers.length > 0) {
        const sortedTiers = [...product.wholesaleTiers].sort((a, b) => getTierMinRetailQty(b, product) - getTierMinRetailQty(a, product));
        const appliedTier = sortedTiers.find(tier => cartQty >= getTierMinRetailQty(tier, product));
        if (appliedTier) return Number(appliedTier.price) || 0; 
    }
    return Number(product.retailPrice) || 0; 
};

const getApplicableUnit = (product, qty) => product.isCombo ? 'set' : (product.retailUnit || 'bottle');
const calculateItemPrice = (product, qty) => calculateItemUnitPrice(product, qty) * qty;
const cartTotalUSD = computed(() => cart.value.reduce((total, item) => total + calculateItemPrice(item.product, item.qty), 0));

// --- RESERVATION LOGIC ---
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
    notification.warning("រយៈពេលកក់ស្តុកបានផុតកំណត់! កន្ត្រកត្រូវបានសម្អាត។");
    for (const item of cart.value) await modifyStockReservation(item.product, -item.qty);
    cart.value = []; await updateActiveCartBackend();
};

const updateActiveCartBackend = async () => {
    if (!auth.currentUser) return;
    const adminId = auth.currentUser.uid;
    const cartRef = doc(db, 'active_carts', adminId);
    if (cart.value.length === 0) { await deleteDoc(cartRef).catch(e => {}); clearInterval(reservationTimer.value); timeLeft.value = ""; showMobileCart.value = false; return; }
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000).getTime();
    await setDoc(cartRef, { uid: adminId, items: cart.value.map(item => ({ id: item.product.id, qty: item.qty })), expiresAt, status: "PENDING" }, { merge: true });
    startCartTimer(expiresAt);
};

const modifyStockReservation = async (product, qtyDelta) => {
    try {
        if (product.isCombo) {
            for (const subItem of product.items) {
                const stockRef = doc(db, 'stocks', subItem.productId);
                const originalStock = originalStocks.value.find(s => s.id === subItem.productId);
                const perCase = originalStock ? (Number(originalStock.itemsPerCase) || 1) : 1;
                const bulkQtyDelta = (subItem.qty * qtyDelta) / perCase; 
                await updateDoc(stockRef, { quantity: increment(-bulkQtyDelta), stock_reserved: increment(bulkQtyDelta) });
            }
        } else {
            const stockRef = doc(db, 'stocks', product.id);
            const bulkQtyDelta = qtyDelta / (Number(product.itemsPerCase) || 1); 
            await updateDoc(stockRef, { quantity: increment(-bulkQtyDelta), stock_reserved: increment(bulkQtyDelta) });
        }
    } catch (e) { console.error(e); }
};

const addToCart = async (product) => {
    const maxStock = getTotalRetailStock(product);
    if (maxStock <= 0) return notification.error("អស់ពីស្តុកហើយ!");
    const existingIndex = cart.value.findIndex(item => item.product.id === product.id);
    if (existingIndex !== -1) {
        if (1 > maxStock) return notification.error(`មានត្រឹមតែ ${maxStock} បន្ថែមទៀតប៉ុណ្ណោះ`);
        cart.value[existingIndex].qty += 1;
    } else {
        if (1 > maxStock) return notification.error(`មានត្រឹមតែ ${maxStock} ប៉ុណ្ណោះ`);
        cart.value.push({ product: product, qty: 1 });
    }
    await modifyStockReservation(product, 1); await updateActiveCartBackend();
};

const updateQty = async (index, delta) => {
    const item = cart.value[index];
    const maxStock = getTotalRetailStock(item.product);
    const newQty = item.qty + delta;
    if (newQty > 0) {
        if (delta > 0 && delta > maxStock) return notification.error(`មានត្រឹមតែ ${maxStock} បន្ថែមទៀតប៉ុណ្ណោះ`);
        item.qty = newQty; await modifyStockReservation(item.product, delta); await updateActiveCartBackend();
    } else await removeFromCart(index);
};

const setQty = async (index, newQtyStr) => {
    let newQty = parseInt(newQtyStr); if (isNaN(newQty) || newQty < 1) newQty = 1;
    const item = cart.value[index];
    const delta = newQty - item.qty; if (delta === 0) return;
    const maxStock = getTotalRetailStock(item.product);
    if (delta > 0 && delta > maxStock) {
        notification.error(`មានត្រឹមតែ ${maxStock} បន្ថែមទៀតប៉ុណ្ណោះ`);
        item.qty += maxStock; if (maxStock > 0) { await modifyStockReservation(item.product, maxStock); await updateActiveCartBackend(); }
        return;
    }
    item.qty = newQty; await modifyStockReservation(item.product, delta); await updateActiveCartBackend();
};

const removeFromCart = async (index) => {
    const item = cart.value[index];
    const qtyToReturn = item.qty;
    cart.value.splice(index, 1);
    await modifyStockReservation(item.product, -qtyToReturn); 
    await updateActiveCartBackend();
};

// --- CHECKOUT SAVE ---
const submitSale = async (formData) => {
    isSubmitting.value = true;
    try {
        const adminId = auth.currentUser.uid;
        const receiptCode = `INV-${Date.now().toString().slice(-6)}`;
        const combinedLocation = `${formData.district}, ${formData.province}`;

        const itemsToSave = cart.value.map((item, index) => ({
            id: item.product.id, cartItemId: `${item.product.id}_${Date.now()}_${index}`,
            name: item.product.name, image: item.product.image || '',
            price: calculateItemUnitPrice(item.product, item.qty), qty: item.qty,
            type: getAutoSaleType(item.product, item.qty), unit: getApplicableUnit(item.product, item.qty),
            isCombo: Boolean(item.product.isCombo),
            cost: item.product.isCombo ? item.product.totalBaseCost : (Number(item.product.unitCost)/Number(item.product.itemsPerCase || 1))
        }));

        const payload = {
            receiptId: receiptCode, createdAt: new Date(formData.date).toISOString(), createdBy: adminId,
            uid: formData.sellerId, sellerName: formData.sellerName,
            customerName: formData.customerName, customerPhone: formData.customerPhone,
            location: combinedLocation, province: formData.province, district: formData.district,
            paymentMethod: formData.paymentMethod, paymentNote: formData.paymentNote || '',
            paymentImage: formData.paymentImage || '', paymentStatus: 'PAID', totalAmount: cartTotalUSD.value, currency: 'USD',
            items: itemsToSave
        };

        const docRef = await addDoc(collection(db, 'sales_reports'), payload);
        lastSavedSale.value = { id: docRef.id, ...payload };

        for (const item of cart.value) {
            if (item.product.isCombo) {
                for (const subItem of item.product.items) {
                    const originalStock = originalStocks.value.find(s => s.id === subItem.productId);
                    const perCase = originalStock ? (Number(originalStock.itemsPerCase) || 1) : 1;
                    await updateDoc(doc(db, 'stocks', subItem.productId), { stock_reserved: increment(-((subItem.qty * item.qty) / perCase)) });
                }
            } else {
                await updateDoc(doc(db, 'stocks', item.product.id), { stock_reserved: increment(-(item.qty / (Number(item.product.itemsPerCase) || 1))) });
            }
        }

        await deleteDoc(doc(db, 'active_carts', adminId)).catch(e => {});
        clearInterval(reservationTimer.value); timeLeft.value = "";
        isCheckoutModalOpen.value = false; showMobileCart.value = false; isSuccessModalOpen.value = true;

    } catch (error) { notification.error("មានបញ្ហាក្នុងការរក្សាទុកទិន្នន័យ"); } 
    finally { isSubmitting.value = false; }
};

const closeSuccessModal = () => {
    cart.value = []; isSuccessModalOpen.value = false; lastSavedSale.value = null; mainTab.value = 'today'; 
};

// --- PRINT / PDF / TELEGRAM ---
const generateTelegramText = () => {
    if (!lastSavedSale.value) return '';
    const sale = lastSavedSale.value;
    let text = `🛒 *វិក្កយបត្រថ្មី (INVOICE)*\nលេខ: \`${sale.receiptId}\`\nថ្ងៃទី: ${formatDate(sale.createdAt)}\n--------------------------------\n👤 *អតិថិជន:* ${sale.customerName}\n📞 *ទូរស័ព្ទ:* ${sale.customerPhone}\n📍 *ទីតាំង:* ${sale.location}\n👨‍💼 *អ្នកលក់:* ${sale.sellerName}\n--------------------------------\n`;
    sale.items.forEach((item, i) => { text += `${i+1}. ${item.name} ${item.isCombo ? '(🎁 ឈុត)' : `(${item.type === 'wholesale' ? 'ដុំ' : 'រាយ'})`}\n   ➔ ${item.qty} ${translateHardcodedUnit(item.unit)} x $${item.price} = *$${item.price * item.qty}*\n`; });
    text += `--------------------------------\n💰 *សរុបរួម:* *$${sale.totalAmount}*\n💳 *បង់ប្រាក់តាម:* ${sale.paymentMethod}\n`;
    if(sale.paymentNote) text += `📝 *ចំណាំ:* ${sale.paymentNote}\n`;
    return encodeURIComponent(text);
};

const shareToTelegramApp = () => window.open(`tg://msg_url?text=${generateTelegramText()}`, '_blank');

const sendToTelegramBotGroup = async () => {
    isSendingToBot.value = true;
    try {
        const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN; const chatId = import.meta.env.VITE_TELEGRAM_GROUP_ID;
        if (!botToken || !chatId) return notification.error("សូមកំណត់ Bot Token និង Group ID នៅក្នុង File .env");

        const textResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: decodeURIComponent(generateTelegramText()), parse_mode: 'Markdown' })
        });
        
        if (textResponse.ok) {
            notification.success("បានផ្ញើទៅកាន់ Telegram ជោគជ័យ!");
            if (lastSavedSale.value && lastSavedSale.value.paymentMethod === 'KHQR' && lastSavedSale.value.paymentImage) {
                 const base64Data = lastSavedSale.value.paymentImage.split(',')[1];
                 const byteArray = new Uint8Array(atob(base64Data).split('').map(char => char.charCodeAt(0)));
                 const formData = new FormData();
                 formData.append('chat_id', chatId); formData.append('photo', new Blob([byteArray], {type: 'image/jpeg'}), 'payment_receipt.jpg'); formData.append('caption', `👆 វិក្កយបត្រវេរប្រាក់សម្រាប់: ${lastSavedSale.value.receiptId}`);
                 await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, { method: 'POST', body: formData });
            }
        } else notification.error("បរាជ័យក្នុងការផ្ញើ");
    } catch (error) { notification.error("បរាជ័យភ្ជាប់ទៅម៉ាស៊ីនមេ"); } 
    finally { isSendingToBot.value = false; }
};

const generateInvoiceHTML = () => {
    if (!lastSavedSale.value) return '';
    const sale = lastSavedSale.value;
    let itemsHTML = '';
    sale.items.forEach((item, index) => {
        itemsHTML += `<tr style="border-bottom: 1px dashed #e2e8f0;">
            <td style="padding: 12px 10px; text-align: center; color: #64748b;">${index + 1}</td>
            <td style="padding: 12px 10px; font-weight: bold; color: #1e293b;">${item.name} <span style="font-size: 10px; color: #94a3b8;">${item.isCombo ? '(ឈុត)' : `(${item.type === 'wholesale' ? 'ដុំ' : 'រាយ'})`}</span></td>
            <td style="padding: 12px 10px; text-align: center;">${item.qty} ${translateHardcodedUnit(item.unit)}</td>
            <td style="padding: 12px 10px; text-align: right;">${formatPrice(item.price, 'USD')}</td>
            <td style="padding: 12px 10px; text-align: right; font-weight: bold;">${formatPrice(item.price * item.qty, 'USD')}</td>
        </tr>`;
    });
    return `<div class="print-page" style="width: 148mm; min-height: 210mm; background: white; padding: 15mm; font-family: 'Battambong', sans-serif; color: #0f172a; box-sizing: border-box; margin: 0 auto; position: relative;">
        <div style="text-align: center; border-bottom: 2px solid #cbd5e1; padding-bottom: 15px; margin-bottom: 20px;"><h2 style="margin: 0; font-size: 26px; font-weight: 900;">វិក្កយបត្រ (INVOICE)</h2></div>
        <table style="width: 100%; font-size: 13px; margin-bottom: 25px; border: none;"><tr><td style="width: 50%; vertical-align: top; line-height: 1.8;"><div><strong>អតិថិជន:</strong> ${sale.customerName}</div><div style="color: #475569;"><strong>ទូរស័ព្ទ:</strong> ${sale.customerPhone}</div><div style="color: #475569;"><strong>ទីតាំង:</strong> ${sale.location}</div></td><td style="width: 50%; vertical-align: top; text-align: right; line-height: 1.8;"><div><strong>លេខ:</strong> ${sale.receiptId}</div><div style="color: #475569;"><strong>កាលបរិច្ឆេទ:</strong> ${formatDate(sale.createdAt)}</div><div style="color: #475569;"><strong>អ្នកលក់:</strong> ${sale.sellerName}</div></td></tr></table>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 30px;"><thead style="background: #f1f5f9; border-top: 2px solid #94a3b8; border-bottom: 2px solid #94a3b8;"><tr><th style="padding: 12px 10px;">#</th><th style="padding: 12px 10px; text-align: left;">បរិយាយទំនិញ</th><th style="padding: 12px 10px;">ចំនួន</th><th style="padding: 12px 10px; text-align: right;">តម្លៃឯកតា</th><th style="padding: 12px 10px; text-align: right;">សរុប</th></tr></thead><tbody>${itemsHTML}</tbody></table>
        <table style="width: 100%; border: none; margin-top: 20px;"><tr><td style="width: 50%; vertical-align: top;"><div style="font-size: 12px; color: #64748b; margin-bottom: 10px;">ការបង់ប្រាក់: <strong>${sale.paymentMethod}</strong></div>${sale.paymentNote ? `<div style="background: #f8fafc; padding: 10px; border-left: 3px solid #059669; border-radius: 4px; font-size: 12px;"><strong>ចំណាំ:</strong> ${sale.paymentNote}</div>` : ''}</td><td style="width: 50%; vertical-align: bottom; text-align: right;"><div style="border-top: 2px solid #cbd5e1; padding-top: 15px; display: inline-block; min-width: 200px;"><div style="font-size: 20px; font-weight: 900;"><span style="font-size: 14px; color: #64748b; margin-right: 15px;">សរុបរួម:</span><span style="color: #059669;">${formatPrice(sale.totalAmount, 'USD')}</span></div></div></td></tr></table>
        <div style="position: absolute; bottom: 15mm; left: 15mm; right: 15mm; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px dashed #e2e8f0; padding-top: 15px;"><p style="margin: 0; font-weight: bold;">សូមអរគុណសម្រាប់ការគាំទ្រ!</p><p style="margin: 4px 0 0 0;">ទំនិញដែលទិញរួចមិនអាចដូរវិញបានទេ</p></div>
    </div>`;
};

const printInvoice = () => {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute'; iframe.style.width = '0'; iframe.style.height = '0'; iframe.style.border = 'none';
    document.body.appendChild(iframe); iframe.contentWindow.document.open();
    iframe.contentWindow.document.write(`<html><head><title>Invoice</title><link href="https://fonts.googleapis.com/css2?family=Battambong:wght@400;700;900&display=swap" rel="stylesheet"><style>@page { size: A5 portrait; margin: 0; } body { font-family: 'Battambong', sans-serif; margin: 0; padding: 0; background-color: white; display: flex; justify-content: center; }</style></head><body>${generateInvoiceHTML()}</body></html>`);
    iframe.contentWindow.document.close();
    iframe.contentWindow.document.fonts.ready.then(() => { iframe.contentWindow.focus(); iframe.contentWindow.print(); setTimeout(() => { document.body.removeChild(iframe); closeSuccessModal(); }, 1000); });
};

const downloadPDF = async () => {
    printStaging.value.innerHTML = generateInvoiceHTML(); await nextTick(); await document.fonts.ready; await new Promise(r => setTimeout(r, 500)); 
    const canvas = await html2canvas(printStaging.value.querySelector('.print-page'), { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
    const imgData = canvas.toDataURL('image/jpeg', 1.0); const pdf = new jsPDF('p', 'mm', 'a5'); 
    const propsImg = pdf.getImageProperties(imgData); pdf.addImage(imgData, 'JPEG', 0, 0, 148, (propsImg.height * 148) / propsImg.width);
    pdf.save(`Invoice_${lastSavedSale.value.receiptId}.pdf`); printStaging.value.innerHTML = ''; closeSuccessModal();
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Battambong:wght@400;700;900&family=Kantumruy+Pro:wght@400;700&display=swap');
.font-khmer { font-family: 'Battambong', 'Kantumruy Pro', sans-serif; }
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #94a3b8; }
.no-scrollbar::-webkit-scrollbar { display: none; }
.animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
.animate-slide-down { animation: slideDown 0.2s ease-out forwards; transform-origin: top; }
@keyframes slideDown { from { opacity: 0; transform: scaleY(0.95); } to { opacity: 1; transform: scaleY(1); } }
input[type="number"]::-webkit-inner-spin-button, input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
input[type="number"] { -moz-appearance: textfield; }
</style>