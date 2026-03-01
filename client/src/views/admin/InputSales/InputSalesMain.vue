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
    </div>

    <div v-show="mainTab === 'pos'" class="flex-1 overflow-hidden flex relative">
        
        <div class="flex-1 flex flex-col h-full bg-[#F4F7FE] relative overflow-hidden">
            
            <div class="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 p-3 md:p-4 shadow-sm z-20 shrink-0">
                <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4">
                    <div class="flex items-center gap-3 w-full sm:w-auto">
                        <button @click="$router.back()" class="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors shrink-0"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg></button>
                        <div>
                            <h1 class="text-lg md:text-xl font-black text-slate-800 leading-tight">ប្រព័ន្ធបញ្ជូលការលក់ (POS)</h1>
                            <p class="text-slate-500 text-[9px] md:text-[10px] font-bold uppercase tracking-wider mt-0.5">Smart Auto-Pricing POS</p>
                        </div>
                    </div>
                    <div class="relative w-full sm:w-72 md:w-80 shrink-0">
                        <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></span>
                        <input v-model="searchQuery" type="text" placeholder="ស្វែងរកទំនិញ ឬ ឈុត..." class="w-full bg-slate-100/80 border border-slate-200/60 rounded-xl pl-9 pr-4 py-2.5 text-[13px] md:text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none transition-all shadow-inner">
                    </div>
                </div>
            </div>

            <div class="flex-1 overflow-y-auto p-3 md:p-6 custom-scrollbar relative pb-28 md:pb-6 touch-pan-y">
                <div v-if="isLoadingProducts" class="flex flex-col items-center justify-center h-full opacity-60">
                    <div class="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-blue-600 mb-4"></div>
                    <p class="text-xs font-bold text-slate-500">កំពុងទាញយកទំនិញ និងឈុត...</p>
                </div>
                <div v-else-if="filteredProducts.length === 0" class="flex flex-col items-center justify-center h-full text-slate-400">
                    <svg class="w-16 h-16 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                    <p class="font-bold">រកមិនឃើញទំនិញទេ</p>
                </div>
                <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-5 max-w-[100rem] mx-auto">
                    <div v-for="product in filteredProducts" :key="product.id" @click="addToCart(product)" class="bg-white rounded-2xl md:rounded-[1.25rem] p-2.5 md:p-3 border border-slate-200 shadow-sm transition-all cursor-pointer group relative flex flex-col h-full select-none" :class="getTotalRetailStock(product) > 0 ? 'hover:shadow-lg hover:border-blue-300 active:scale-95' : 'opacity-60 cursor-not-allowed grayscale-[50%]' ">
                        <div v-if="product.isCombo" class="absolute -top-2 -left-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[9px] md:text-[10px] font-black px-2 py-1 rounded-lg shadow-md z-10 flex items-center gap-1 border border-orange-200">🎁 ឈុត</div>
                        
                        <div class="w-full aspect-square rounded-xl bg-slate-50 mb-2.5 md:mb-3 overflow-hidden border border-slate-100 relative flex items-center justify-center shrink-0">
                            <img v-if="product.image && (product.image.startsWith('http') || product.image.startsWith('data:image'))" :src="product.image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                            <div v-else class="text-slate-300 text-3xl font-black">{{ product.name.charAt(0) }}</div>
                            <div class="absolute top-1.5 right-1.5 md:top-2 md:right-2 px-1.5 py-0.5 rounded text-[9px] md:text-[10px] font-black bg-white/95 backdrop-blur-sm border shadow-sm" :class="getTotalRetailStock(product) > 0 ? 'text-emerald-600 border-emerald-100' : 'text-rose-600 border-rose-100'">ស្តុក: {{ getTotalRetailStock(product).toLocaleString() }}</div>
                            <div v-if="getTotalRetailStock(product) <= 0" class="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center"><span class="bg-rose-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-md">អស់ស្តុក</span></div>
                        </div>
                        
                        <div class="flex-1 flex flex-col">
                            <h3 class="font-black text-xs md:text-sm text-slate-800 leading-tight mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">{{ product.name }}</h3>
                            <p class="text-[8px] md:text-[9px] text-slate-400 font-mono mb-1.5 line-clamp-1">{{ product.barcode || 'NO-BARCODE' }}</p>
                            
                            <div class="mt-auto pt-2 border-t border-slate-100 flex flex-col gap-1.5">
                                <div v-if="!product.isCombo && product.itemsPerCase && product.itemsPerCase > 1" class="text-[8px] md:text-[9px] text-slate-500 font-bold bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 w-fit"><span class="text-slate-600">១{{ translateHardcodedUnit(product.unit) }} = {{ product.itemsPerCase }}{{ translateHardcodedUnit(product.retailUnit) }}</span></div>
                                <div class="flex items-end justify-between mt-0.5">
                                    <div class="text-[9px] md:text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded"><span>1 {{ translateHardcodedUnit(product.isCombo ? 'set' : (product.retailUnit || 'bottle')) }}</span></div>
                                    <div class="text-right"><p class="text-[13px] md:text-[15px] font-black text-indigo-600">{{ formatPrice(product.retailPrice, product.currency) }}</p></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <button v-if="cart.length > 0 && !showMobileCart" @click="showMobileCart = true" class="md:hidden fixed bottom-6 right-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white w-14 h-14 rounded-full shadow-2xl z-[45] flex items-center justify-center transition-transform active:scale-95 border-2 border-white">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                <span class="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-bounce-short">{{ cart.length }}</span>
            </button>
        </div>

        <transition enter-active-class="duration-300 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-show="showMobileCart" @click="showMobileCart = false" class="md:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[45]"></div>
        </transition>

        <div 
            :class="showMobileCart ? 'translate-y-0' : 'translate-y-full md:translate-y-0'"
            class="fixed md:static inset-x-0 bottom-0 h-[88vh] md:h-full w-full md:w-[360px] xl:w-[420px] bg-slate-50 md:border-l border-slate-200 shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.3)] md:shadow-[-10px_0_30px_rgba(0,0,0,0.04)] flex flex-col z-[50] md:z-30 transition-transform duration-300 ease-out rounded-t-[2rem] md:rounded-none shrink-0 will-change-transform"
        >
            <div class="p-4 md:p-5 border-b border-slate-200 flex items-center justify-between bg-white shrink-0 shadow-sm z-20 rounded-t-[2rem] md:rounded-none pt-6 md:pt-5 relative">
                <div class="absolute top-2.5 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-slate-200 rounded-full md:hidden"></div>
                <div class="flex flex-col">
                    <h2 class="text-lg font-black text-slate-800 flex items-center gap-2"><svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg> កន្ត្រកទំនិញ</h2>
                    <div v-if="timeLeft" class="mt-1 flex items-center gap-1 text-[10px] font-black text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-md w-fit animate-pulse"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> ផុតកំណត់ក្នុង: {{ timeLeft }}</div>
                </div>
                
                <div class="flex items-center gap-3">
                    <span class="bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-lg text-[11px] font-black border border-blue-200">{{ cart.length }} មុខ</span>
                    <button @click="showMobileCart = false" class="md:hidden w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors active:scale-95">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                </div>
            </div>

            <div class="flex-1 overflow-y-auto custom-scrollbar p-3 md:p-4 touch-pan-y">
                
                <div v-if="cart.length === 0" class="h-full flex flex-col items-center justify-center text-slate-400 opacity-60 min-h-[300px]">
                    <svg class="w-20 h-20 mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                    <p class="font-bold text-sm">មិនទាន់មានទំនិញទេ</p>
                    <p class="text-[10px] mt-1">សូមចុចលើទំនិញដើម្បីបញ្ជូល</p>
                </div>
                
                <div v-else class="block pb-16 md:pb-4">
                    <div class="space-y-3 mb-4">
                        <div v-for="(item, index) in cart" :key="item.product.id + item.selectedUnit" class="bg-white border border-slate-200 rounded-2xl p-3 md:p-4 shadow-sm flex flex-col relative group hover:border-blue-300 transition-colors">
                            
                            <button @click="removeFromCart(index)" class="absolute -top-2 -right-2 w-7 h-7 bg-white text-rose-500 hover:bg-rose-500 hover:text-white rounded-full flex items-center justify-center shadow-md border border-rose-100 transition-colors z-10"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg></button>
                            
                            <div class="flex justify-between items-start gap-2 mb-2">
                                <div class="flex-1 min-w-0">
                                    <h4 class="font-bold text-sm text-slate-800 leading-tight pr-4 line-clamp-2">{{ item.product.name }}</h4>
                                    <span class="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-black border" :class="getBadgeClass(item)">{{ getBadgeLabel(item) }}</span>
                                </div>
                                <span class="text-sm md:text-base font-black text-emerald-600 whitespace-nowrap bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100 shrink-0">{{ formatPrice(calculateItemPrice(item), item.product.currency) }}</span>
                            </div>
                            
                            <div class="flex flex-col sm:flex-row flex-wrap items-start sm:items-end justify-between mt-2 pt-2 border-t border-slate-100 gap-3">
                                <div class="flex flex-col gap-2 w-full sm:w-auto flex-1">
                                    <div class="relative w-full sm:w-fit">
                                        <select :value="item.selectedUnit" @change="handleUnitChange(index, $event)" class="w-full appearance-none bg-slate-100/80 border border-slate-200 text-slate-700 py-2 pl-3 pr-8 rounded-xl text-xs font-black focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none cursor-pointer transition-all">
                                            <option value="retail">{{ item.product.isCombo ? 'ឈុត' : translateHardcodedUnit(item.product.retailUnit || 'bottle') + ' (រាយ)' }}</option>
                                            <option v-if="!item.product.isCombo && item.product.itemsPerCase > 1" value="case">{{ translateHardcodedUnit(item.product.unit || 'case') }} (ដុំ)</option>
                                        </select>
                                        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></div>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <label class="flex items-center gap-1.5 cursor-pointer select-none">
                                            <div class="relative inline-block w-7 h-4 rounded-full transition-colors duration-300" :class="item.isManualPrice ? 'bg-blue-500' : 'bg-slate-300'">
                                                <input type="checkbox" v-model="item.isManualPrice" class="sr-only" @change="handleManualPriceToggle(index)">
                                                <span class="absolute left-0.5 top-0.5 bg-white w-3 h-3 rounded-full transition-transform duration-300 shadow-sm" :class="item.isManualPrice ? 'translate-x-3' : 'translate-x-0'"></span>
                                            </div>
                                            <span class="text-[10px] font-bold text-slate-500">កែតម្លៃ</span>
                                        </label>
                                        <div v-if="item.isManualPrice" class="relative w-20 animate-fade-in">
                                            <span class="absolute inset-y-0 left-0 pl-1.5 flex items-center text-[10px] font-black text-blue-600">{{ item.product.currency === 'USD' ? '$' : '៛' }}</span>
                                            <input type="number" v-model.number="item.manualPrice" step="any" min="0" class="w-full pl-5 pr-1 py-1 bg-blue-50 border border-blue-200 rounded-md text-xs font-black outline-none focus:border-blue-500 focus:bg-white text-blue-700">
                                        </div>
                                        <div v-else class="text-[9px] font-bold text-slate-400">
                                            <span v-if="!item.product.isCombo">១ដប: {{ formatPrice(getSingleBasePrice(item), item.product.currency) }}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex items-center justify-end w-full sm:w-auto shrink-0 mt-1 sm:mt-0">
                                    <div class="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden h-9 shadow-sm w-[110px]">
                                        <button @click="updateQty(index, -1)" class="w-10 h-full flex items-center justify-center text-slate-500 hover:bg-slate-200 active:bg-slate-300 transition-colors text-lg font-bold">−</button>
                                        <input v-model="item.inputQty" @change="commitQty(index)" @keyup.enter="$event.target.blur()" type="number" min="1" class="w-full h-full bg-white text-center text-sm font-black border-x border-slate-200 outline-none p-0 focus:ring-inner">
                                        <button @click="updateQty(index, 1)" class="w-10 h-full flex items-center justify-center text-slate-500 hover:bg-slate-200 active:bg-slate-300 transition-colors text-lg font-bold">+</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white p-4 md:p-5 border border-slate-200 shadow-sm rounded-2xl mt-4">
                        <div class="flex justify-between items-end mb-3">
                            <span class="text-xs font-black text-slate-500 uppercase tracking-widest">សរុប (Total)</span>
                            <span class="text-3xl font-black text-emerald-600 leading-none tracking-tight">{{ formatPrice(cartTotalUSD, 'USD') }}</span>
                        </div>
                        <button @click="openCheckoutModal" class="w-full py-3.5 rounded-xl font-black text-[15px] shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg> 
                            បន្តការទូទាត់ប្រាក់
                        </button>
                    </div>

                </div>
            </div>

        </div>

        <CheckoutModal ref="checkoutModalRef" :show="isCheckoutModalOpen" :cartLength="cart.length" :cartTotalUSD="cartTotalUSD" :sellers="sellers" :savedCustomers="savedCustomers" :isSubmitting="isSubmitting" @close="isCheckoutModalOpen = false" @confirm="submitSale" />
        <SuccessModal :show="isSuccessModalOpen" :isSendingToBot="isSendingToBot" @close="closeSuccessModal" @print="printInvoice" @download-pdf="downloadPDF" @share-app="shareToTelegramApp" @send-bot="sendToTelegramBotGroup" />
    </div>

    <div v-if="mainTab === 'today'" class="flex-1 overflow-y-auto custom-scrollbar p-0 md:p-6 animate-fade-in bg-[#F4F7FE]">
        <div class="max-w-[90rem] mx-auto w-full h-full">
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

// 📦 ការ Import Components ខាងក្រៅ
import POSTodaySales from '../reports/pos/POSTodaySales.vue'; 
import CheckoutModal from './components/CheckoutModal.vue';
import SuccessModal from './components/SuccessModal.vue';

const router = useRouter();
const notification = useNotificationStore();

// --- STATE ---
const mainTab = ref('pos'); 
const showMobileCart = ref(false); 

const mixedProducts = ref([]); 
const originalStocks = ref([]); 
const combosGlobal = ref([]);
const sellers = ref([]);
const savedCustomers = ref([]); 
const isLoadingProducts = ref(true);
const searchQuery = ref('');

// Cart Item Structure: { product, qty, inputQty, selectedUnit: 'retail' | 'case', isManualPrice: false, manualPrice: 0 }
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
let unsubscribeSellers = null; // ថ្មី
let unsubscribeSales = null;   // ថ្មី

const timeLeft = ref("");
const reservationTimer = ref(null);

// --- UTILS ---
const triggerAlert = (type, title, message) => { if (type === 'error') notification.error(message); else notification.success(message); };

const formatPrice = (val, currency = 'USD') => { 
    if (val === undefined || val === null) return '0.00'; 
    let formattedNum = Number(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 3 });
    return formattedNum + (currency === 'USD' ? ' $' : ' ៛'); 
};

const translateHardcodedUnit = (unit) => { const map = { bottle: 'ដប', case: 'កេះ', pack: 'កញ្ចប់', can: 'កំប៉ុង', kg: 'គីឡូ', set: 'ឈុត' }; return map[unit] || unit; };

// --- FETCH DATA (REALTIME & CUSTOMERS) ---
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
                const qSellers = query(collection(db, "users"), where("role", "in", ["seller", "dealer"]), where("createdBy", "==", user.uid));
unsubscribeSellers = onSnapshot(qSellers, (snapshot) => {
    sellers.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
});

// 4. ប្រវត្តិអតិថិជន (Realtime)
const qSales = query(collection(db, 'sales_reports'), where('createdBy', '==', user.uid));
unsubscribeSales = onSnapshot(qSales, (snapshot) => {
    const uniqueCustomers = {};
    snapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.customerName && !uniqueCustomers[data.customerName]) {
            uniqueCustomers[data.customerName] = {
                name: data.customerName,
                phone: data.customerPhone || '',
                province: data.province || '',
                district: data.district || ''
            };
        }
    });
    savedCustomers.value = Object.values(uniqueCustomers);
});

            } catch (error) { console.error(error); }
        } else router.push('/');
    });
});

onUnmounted(() => { 
    if (unsubscribeProducts) unsubscribeProducts(); 
    if (unsubscribeCombos) unsubscribeCombos(); 
    if (unsubscribeSellers) unsubscribeSellers(); // ថ្មី
    if (unsubscribeSales) unsubscribeSales();     // ថ្មី
});

const combineProductsAndCombos = () => {
    mixedProducts.value = [...originalStocks.value, ...combosGlobal.value];
    cart.value = cart.value.map(cartItem => {
        const updatedProduct = mixedProducts.value.find(p => p.id === cartItem.product.id);
        if (updatedProduct) { cartItem.product = updatedProduct; }
        if (!cartItem.inputQty) cartItem.inputQty = cartItem.qty; 
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

const getRetailQtyEquivalent = (product, qty, selectedUnit) => {
    if (product.isCombo) return qty;
    return selectedUnit === 'case' ? qty * (Number(product.itemsPerCase) || 1) : qty;
};

const filteredProducts = computed(() => {
    if (!searchQuery.value) return mixedProducts.value;
    const q = searchQuery.value.toLowerCase();
    return mixedProducts.value.filter(p => p.name.toLowerCase().includes(q) || (p.barcode && p.barcode.toLowerCase().includes(q)));
});

const getSingleBasePrice = (item) => {
    const { product, qty, selectedUnit } = item;
    const targetUnit = product.isCombo ? 'set' : (selectedUnit === 'case' ? 'case' : 'bottle');
    
    if (product.wholesaleTiers && Array.isArray(product.wholesaleTiers) && product.wholesaleTiers.length > 0) {
        let unitTiers = product.wholesaleTiers.filter(t => t.unit === targetUnit);
        if (product.isCombo && unitTiers.length === 0) { unitTiers = product.wholesaleTiers; }

        if (unitTiers.length > 0) {
            const sorted = [...unitTiers].sort((a, b) => Number(b.minQty) - Number(a.minQty));
            const appliedTier = sorted.find(t => qty >= Number(t.minQty));
            if (appliedTier && Number(appliedTier.price) > 0) {
                return Number(appliedTier.price);
            }
        }
    }
    return Number(product.retailPrice) || 0;
};

const getSingleCasePrice = (item) => {
    const basePrice = getSingleBasePrice(item);
    return basePrice * (Number(item.product.itemsPerCase) || 1);
};

const calculateItemUnitPrice = (item) => {
    if (item.isManualPrice) return Number(item.manualPrice) || 0;
    if (item.product.isCombo) return getSingleBasePrice(item);
    return item.selectedUnit === 'case' ? getSingleCasePrice(item) : getSingleBasePrice(item);
};

const calculateItemPrice = (item) => calculateItemUnitPrice(item) * item.qty;

const cartTotalUSD = computed(() => cart.value.reduce((total, item) => total + calculateItemPrice(item), 0));

// ✅ Smart Logic បង្ហាញពាក្យ "បោះដុំ" ឬ "លក់រាយ" ករណីបញ្ចូលតម្លៃដោយដៃ
const getBadgeLabel = (item) => {
    const { product, selectedUnit, isManualPrice, manualPrice, qty } = item;
    const targetUnit = product.isCombo ? 'set' : (selectedUnit === 'case' ? 'case' : 'bottle');
    
    // ១. ស្វែងរកតម្លៃបោះដុំខ្ពស់បំផុត (Wholesale Price) ដែលបានកំណត់ក្នុងប្រព័ន្ធ
    let sysWholesalePrice = null;
    
    if (product.wholesaleTiers && Array.isArray(product.wholesaleTiers) && product.wholesaleTiers.length > 0) {
        let unitTiers = product.wholesaleTiers.filter(t => t.unit === targetUnit);
        if (product.isCombo && unitTiers.length === 0) { unitTiers = product.wholesaleTiers; }
        
        if (unitTiers.length > 0) {
            const sorted = [...unitTiers].sort((a, b) => Number(b.minQty) - Number(a.minQty));
            
            // បើកែតម្លៃដោយដៃ (Manual Price): ចាប់យកតម្លៃ Wholesale គោល យកមកប្រៀបធៀប
            if (isManualPrice) {
                // យកតម្លៃបោះដុំដំបូងគេបង្អស់ (តម្លៃដែលថោកជាងគេ តែត្រូវការ Qty តិច) ជាគោល
                const firstTier = [...unitTiers].sort((a,b) => Number(a.minQty) - Number(b.minQty))[0];
                if (firstTier && Number(firstTier.price) > 0) {
                    sysWholesalePrice = Number(firstTier.price);
                }
            } 
            // បើអត់កែតម្លៃដោយដៃ: ប្រើលក្ខខណ្ឌ Qty ធម្មតា
            else {
                const appliedTier = sorted.find(t => qty >= Number(t.minQty));
                if (appliedTier && Number(appliedTier.price) > 0) {
                    if (product.isCombo) return 'តម្លៃបោះដុំ (ឈុត)';
                    return targetUnit === 'case' ? 'តម្លៃបោះដុំ (កេះ)' : 'តម្លៃបោះដុំ (រាយ)';
                }
            }
        }
    }

    // ២. ប្រៀបធៀបតម្លៃបញ្ចូលដោយដៃ (Manual) ជាមួយតម្លៃប្រព័ន្ធ
    if (isManualPrice) {
        const currentManualPrice = Number(manualPrice) || 0;
        
        // បើតម្លៃវាយបញ្ចូល តិចជាង ឬស្មើ តម្លៃបោះដុំក្នុងប្រព័ន្ធ -> ចាត់ទុកជាបោះដុំ
        if (sysWholesalePrice !== null && currentManualPrice > 0 && currentManualPrice <= sysWholesalePrice) {
             return targetUnit === 'case' ? 'តម្លៃបោះដុំ (កេះ)' : 'តម្លៃបោះដុំ (រាយ)';
        }
        
        return 'តម្លៃលក់រាយ (កែដោយដៃ)';
    }

    // ៣. លក្ខខណ្ឌដើម
    return product.isCombo ? 'តម្លៃឈុត' : 'តម្លៃលក់រាយ';
};

const getBadgeClass = (item) => {
    const label = getBadgeLabel(item);
    if (label.includes('បោះដុំ')) return 'bg-purple-50 text-purple-600 border-purple-200';
    if (label.includes('ឈុត')) return 'bg-orange-50 text-orange-600 border-orange-200';
    if (label.includes('ដោយដៃ')) return 'bg-slate-100 text-slate-600 border-slate-300';
    return 'bg-indigo-50 text-indigo-600 border-indigo-200';
};

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
    const itemsToReturn = [...cart.value];
    cart.value = []; 
    showMobileCart.value = false;
    isCheckoutModalOpen.value = false;
    notification.warning("រយៈពេលកក់ស្តុកបានផុតកំណត់! កន្ត្រកត្រូវបានសម្អាត។");
    
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
        isManualPrice: item.isManualPrice, manualPrice: item.manualPrice 
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
                const perCase = originalStock ? (Number(originalStock.itemsPerCase) || 1) : 1;
                const bulkQtyDelta = (subItem.qty * retailQtyDelta) / perCase; 
                await updateDoc(stockRef, { quantity: increment(-bulkQtyDelta), stock_reserved: increment(bulkQtyDelta) });
            }
        } else {
            const stockRef = doc(db, 'stocks', product.id);
            const bulkQtyDelta = retailQtyDelta / (Number(product.itemsPerCase) || 1); 
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
        if (retailQtyToAdd > maxStock) return notification.error(`មានស្តុកត្រឹមតែ ${maxStock} ប៉ុណ្ណោះ`);
        cart.value[existingIndex].qty += 1;
        cart.value[existingIndex].inputQty = cart.value[existingIndex].qty;
    } else {
        if (retailQtyToAdd > maxStock) return notification.error(`មានស្តុកត្រឹមតែ ${maxStock} ប៉ុណ្ណោះ`);
        cart.value.push({ product: product, qty: 1, inputQty: 1, selectedUnit: defaultUnit, isManualPrice: false, manualPrice: 0 });
    }
    
    await modifyStockReservation(product, retailQtyToAdd); 
    await updateActiveCartBackend();
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

const handleManualPriceToggle = (index) => {
    const item = cart.value[index];
    if (item.isManualPrice && item.manualPrice === 0) {
        item.manualPrice = calculateItemUnitPrice({ ...item, isManualPrice: false });
    }
};

const updateQty = async (index, delta) => {
    const item = cart.value[index];
    const maxRetailStock = getTotalRetailStock(item.product);
    const newQty = item.qty + delta;
    
    if (newQty > 0) {
        const retailDelta = getRetailQtyEquivalent(item.product, delta, item.selectedUnit);
        if (retailDelta > 0 && retailDelta > maxRetailStock) return notification.error(`ស្តុកមិនគ្រប់គ្រាន់`);
        item.qty = newQty; 
        item.inputQty = newQty; 
        await modifyStockReservation(item.product, retailDelta); 
        await updateActiveCartBackend();
    } else await removeFromCart(index);
};

const commitQty = async (index) => {
    const item = cart.value[index];
    let newQty = parseInt(item.inputQty); 
    
    if (isNaN(newQty) || newQty < 1) {
        item.inputQty = item.qty; 
        return;
    }

    const delta = newQty - item.qty; 
    if (delta === 0) return;
    
    const maxRetailStock = getTotalRetailStock(item.product);
    const retailDelta = getRetailQtyEquivalent(item.product, delta, item.selectedUnit);
    
    if (retailDelta > 0 && retailDelta > maxRetailStock) {
        notification.error(`ស្តុកមានត្រឹមតែ ${maxRetailStock} ប៉ុណ្ណោះ`);
        item.inputQty = item.qty; 
        return;
    }
    
    item.qty = newQty; 
    item.inputQty = newQty; 
    await modifyStockReservation(item.product, retailDelta); 
    await updateActiveCartBackend();
};

const removeFromCart = async (index) => {
    const item = cart.value[index];
    const retailQtyToReturn = getRetailQtyEquivalent(item.product, item.qty, item.selectedUnit);
    cart.value.splice(index, 1);
    await modifyStockReservation(item.product, -retailQtyToReturn); 
    await updateActiveCartBackend();
};

// --- CHECKOUT LOGIC ---
const openCheckoutModal = () => { isCheckoutModalOpen.value = true; };

const submitSale = async (formData) => {
    isSubmitting.value = true;
    try {
        const adminId = auth.currentUser.uid;
        const receiptCode = `INV-${Date.now().toString().slice(-6)}`;
        
        let combinedLocation = '';
        if (formData.isDirectCustomer) {
            combinedLocation = 'ទិញផ្ទាល់'; 
        } else {
            combinedLocation = `${formData.district}, ${formData.province}`;
        }

        const itemsToSave = cart.value.map((item, index) => ({
            id: item.product.id, cartItemId: `${item.product.id}_${Date.now()}_${index}`,
            name: item.product.name, image: item.product.image || '',
            price: calculateItemUnitPrice(item), qty: item.qty,
            type: getBadgeLabel(item), 
            unit: item.selectedUnit === 'case' ? (item.product.unit || 'case') : (item.product.retailUnit || 'bottle'),
            isCombo: Boolean(item.product.isCombo),
            cost: item.product.isCombo ? item.product.totalBaseCost : (item.selectedUnit === 'case' ? Number(item.product.unitCost) : (Number(item.product.unitCost)/Number(item.product.itemsPerCase || 1)))
        }));

        const payload = {
            receiptId: receiptCode, createdAt: new Date(formData.date).toISOString(), createdBy: adminId,
            uid: formData.sellerId, sellerName: formData.sellerName,
            customerName: formData.customerName, customerPhone: formData.customerPhone,
            location: combinedLocation, province: formData.province, district: formData.district,
            paymentMethod: formData.paymentMethod, paymentNote: formData.paymentNote || '',
            paymentImage: '', paymentStatus: formData.paymentStatus, 
            deliveryFee: formData.deliveryFee || 0, deliveryCurrency: formData.deliveryCurrency,
            totalAmount: formData.finalTotalUSD, currency: 'USD',
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
                const retailQtyToDeduct = getRetailQtyEquivalent(item.product, item.qty, item.selectedUnit);
                const bulkQtyToDeduct = retailQtyToDeduct / (Number(item.product.itemsPerCase) || 1);
                await updateDoc(doc(db, 'stocks', item.product.id), { stock_reserved: increment(-bulkQtyToDeduct) });
            }
        }

        await deleteDoc(doc(db, 'active_carts', adminId)).catch(e => {});
        clearInterval(reservationTimer.value); timeLeft.value = "";
        
        if (checkoutModalRef.value) checkoutModalRef.value.resetForm();

        isCheckoutModalOpen.value = false; showMobileCart.value = false; isSuccessModalOpen.value = true;

    } catch (error) { notification.error("មានបញ្ហាក្នុងការរក្សាទុកទិន្នន័យ"); } 
    finally { isSubmitting.value = false; }
};

const closeSuccessModal = () => {
    cart.value = []; isSuccessModalOpen.value = false; lastSavedSale.value = null; mainTab.value = 'today'; 
};

// ==========================================
// មុខងារសម្រាប់ផ្ទាំង Success Modal (កុំឱ្យ Error ពណ៌លឿង)
// ==========================================

const printInvoice = () => {
    console.log("Print Invoice Clicked");
};

const downloadPDF = () => {
    console.log("Download PDF Clicked");
};

const shareToTelegramApp = () => {
    if (!lastSavedSale.value) return;
    const text = encodeURIComponent(`មានវិក្កយបត្រថ្មី: ${lastSavedSale.value.receiptId}\nសរុបទឹកប្រាក់: $${lastSavedSale.value.totalAmount}`);
    window.open(`https://t.me/share/url?url=&text=${text}`, '_blank');
};

const sendToTelegramBotGroup = async () => {
    if (!lastSavedSale.value) return;
    isSendingToBot.value = true;
    try {
        console.log("Sending to Bot Group...");
    } catch (error) {
        console.error(error);
    } finally {
        isSendingToBot.value = false;
    }
};
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

input[type="number"]::-webkit-inner-spin-button, input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
input[type="number"] { -moz-appearance: textfield; }
select { -webkit-appearance: none; -moz-appearance: none; }
.will-change-transform { will-change: transform; }
</style>