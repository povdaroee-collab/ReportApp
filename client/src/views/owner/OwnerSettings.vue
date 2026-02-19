<template>
  <div class="font-khmer h-[100dvh] flex flex-col relative bg-[#F4F7FE] overflow-hidden">
    
    <Teleport to="body">
      <div class="fixed top-4 right-4 z-[9999] w-full max-w-sm pointer-events-none flex flex-col gap-2">
        <div class="pointer-events-auto">
           <Toast />
        </div>
      </div>
    </Teleport>

    <div class="flex-none bg-white/80 backdrop-blur-2xl border-b border-slate-200/60 z-40 p-4 md:px-8 md:py-4 shadow-sm transition-all">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shadow-lg shadow-slate-900/20 text-white shrink-0">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          </div>
          <div>
            <h1 class="text-2xl md:text-3xl font-black text-slate-800 tracking-tight leading-tight">ការកំណត់ (Settings)</h1>
            <p class="text-slate-500 text-[11px] md:text-xs font-bold mt-0.5 uppercase tracking-wider">គ្រប់គ្រងប្រព័ន្ធទូទៅ</p>
          </div>
        </div>

        <div class="bg-slate-100/80 p-1.5 rounded-2xl flex overflow-x-auto no-scrollbar w-full md:w-auto shadow-inner border border-slate-200/50 shrink-0">
           <button 
             @click="activeTab = 'units'"
             class="flex-1 md:flex-none px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all duration-300 whitespace-nowrap relative"
             :class="activeTab === 'units' ? 'text-indigo-600 shadow-md bg-white' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'"
           >
             គ្រប់គ្រងឯកតា
           </button>
           <button 
             @click="switchTab('prices')"
             class="flex-1 md:flex-none px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all duration-300 whitespace-nowrap relative"
             :class="activeTab === 'prices' ? 'text-indigo-600 shadow-md bg-white' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'"
           >
             កំណត់តម្លៃ និងប្រាក់ទឹកចិត្ត
           </button>
        </div>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 relative">
      <div class="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-indigo-200/40 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      <div class="max-w-[95%] mx-auto space-y-4">
        
        <div v-if="activeTab === 'units'" class="animate-fade-in space-y-4">
            <div class="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex justify-between items-center max-w-5xl mx-auto">
               <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                     <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                  </div>
                  <div>
                     <h2 class="text-sm font-black text-slate-800">ឯកតាទំនិញ (Units)</h2>
                     <p class="text-xs font-bold text-slate-500">{{ units.length }} ឯកតាដែលមានស្រាប់</p>
                  </div>
               </div>
               
               <button @click="showAddModal = true" class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95 flex items-center gap-2">
                 <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                 បន្ថែមឯកតាថ្មី
               </button>
            </div>

            <div v-if="isLoadingUnits" class="py-20 text-center flex flex-col items-center">
                <div class="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-indigo-600 mb-4"></div>
            </div>

            <div v-else class="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 max-w-5xl mx-auto">
              <div 
                 v-for="(unit, index) in units" 
                 :key="unit.id" 
                 class="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm hover:shadow-md hover:border-indigo-300 transition-all group relative overflow-hidden animate-slide-up"
                 :style="{ animationDelay: `${index * 30}ms` }"
              >
                <div class="absolute left-0 top-0 bottom-0 w-1.5" :class="getColorClass(unit.color).bgHex"></div>

                <div class="flex items-center gap-3 pl-2">
                   <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border" :class="[getColorClass(unit.color).bgSoft, getColorClass(unit.color).textHex, getColorClass(unit.color).borderHex]">
                      <span class="font-black text-sm">{{ unit.label.charAt(0) }}</span>
                   </div>
                   <div>
                      <p class="font-black text-slate-800 text-sm leading-tight">{{ unit.label }}</p>
                   </div>
                </div>

                <button 
                  @click="confirmDeleteUnit(unit.id, unit.label)" 
                  class="w-7 h-7 rounded-lg bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </div>
            </div>
        </div>

        <div v-if="activeTab === 'prices'" class="animate-fade-in space-y-4">
            
            <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm relative z-20">
                <div class="flex flex-col md:flex-row gap-4 items-center">
                    <label class="shrink-0 text-sm font-black text-slate-600 uppercase tracking-wide">ស្វែងរកទំនិញ៖</label>
                    <div class="relative w-full">
                        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                        <input 
                            v-model="productSearchQuery" 
                            @focus="showProductDropdown = true"
                            type="text" 
                            placeholder="វាយឈ្មោះផលិតផល ឬ Barcode នៅទីនេះ..." 
                            class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-slate-800 font-bold focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                        >
                        
                        <div v-if="showProductDropdown && filteredProducts.length > 0" class="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-64 overflow-y-auto z-50 p-1.5">
                            <div 
                                v-for="prod in filteredProducts" 
                                :key="prod.id" 
                                @click="selectProduct(prod)"
                                class="flex items-center gap-3 p-2 hover:bg-indigo-50 rounded-lg cursor-pointer transition-colors"
                            >
                                <img :src="prod.image || 'https://via.placeholder.com/150'" class="w-10 h-10 rounded-md object-cover border border-slate-100 shrink-0">
                                <div>
                                    <h4 class="font-bold text-sm text-slate-800">{{ prod.name }}</h4>
                                    <p class="text-[10px] text-slate-500 font-mono">{{ prod.barcode }}</p>
                                </div>
                                <div class="ml-auto text-right">
                                    <span class="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{{ prod.quantity }} លក់ជា: {{ translateUnit(prod.unit) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="selectedProduct" class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden animate-slide-up">
                
                <div class="bg-slate-50 p-4 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <img :src="selectedProduct.image || 'https://via.placeholder.com/150'" class="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-sm">
                    <div class="flex-1 flex flex-col sm:flex-row sm:items-center justify-between w-full">
                        <div>
                            <h3 class="text-xl font-black text-slate-800">{{ selectedProduct.name }}</h3>
                            <div class="flex items-center gap-3 mt-1 text-xs font-bold text-slate-500">
                                <span class="font-mono bg-slate-200/50 px-1.5 py-0.5 rounded">{{ selectedProduct.barcode }}</span>
                                <span>| ក្នុងស្តុកមាន: <span class="text-emerald-600">{{ selectedProduct.quantity }} {{ translateUnit(selectedProduct.unit) }}</span></span>
                                <span v-if="selectedProduct.unit === 'case'">| (១កេះ = {{ selectedProduct.itemsPerCase }} ដប/កញ្ចប់)</span>
                            </div>
                        </div>
                        <div class="mt-2 sm:mt-0 text-right bg-rose-50 px-4 py-2 rounded-xl border border-rose-100">
                            <p class="text-[10px] uppercase font-black text-rose-400 tracking-wider mb-0.5">តម្លៃដើមទិញចូលសរុប (Base Cost)</p>
                            <p class="text-lg font-black text-rose-600">
                                {{ formatPrice(selectedProduct.unitCost, selectedProduct.currency) }} <span class="text-xs">/ 1{{ translateUnit(selectedProduct.unit) }}</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div class="p-5 md:p-6">
                    <form @submit.prevent="savePrices" class="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        
                        <div class="bg-indigo-50/40 p-5 rounded-2xl border border-indigo-100">
                            <div class="flex items-center gap-2 mb-4 border-b border-indigo-100 pb-3">
                                <div class="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center shadow-sm">🛍️</div>
                                <h4 class="text-base font-black text-indigo-900">តម្លៃលក់រាយ (Retail)</h4>
                            </div>
                            
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label class="block text-[11px] font-black text-indigo-600/80 mb-1.5">កំណត់តម្លៃលក់ចេញ និងខ្នាត</label>
                                    <div class="flex shadow-sm rounded-xl">
                                        <div class="bg-slate-100 border border-r-0 border-indigo-200 px-3 py-2.5 rounded-l-xl flex items-center font-black text-slate-500">
                                            {{ selectedProduct.currency === 'USD' ? '$' : '៛' }}
                                        </div>
                                        <input 
                                            v-model.number="priceForm.retailPrice" 
                                            type="number" step="0.01" min="0" required
                                            class="w-full bg-white border-y border-indigo-200 px-3 py-2.5 text-slate-800 font-bold text-sm outline-none focus:bg-indigo-50/30"
                                            placeholder="0.00"
                                        >
                                        <select v-model="priceForm.retailUnit" class="bg-white border border-l-0 border-indigo-200 rounded-r-xl px-2 py-2.5 text-sm font-bold text-indigo-700 outline-none cursor-pointer hover:bg-indigo-50">
                                            <option value="bottle">១ ដប</option>
                                            <option value="pack">១ កញ្ចប់</option>
                                            <option value="case">១ កេះ</option>
                                            <option value="can">១ កំប៉ុង</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label class="block text-[11px] font-black text-rose-500 mb-1.5">ប្រាក់លើកទឹកចិត្ត (Seller Bonus)</label>
                                    <div class="flex shadow-sm rounded-xl">
                                        <div class="bg-rose-50 border border-r-0 border-rose-200 px-3 py-2.5 rounded-l-xl flex items-center font-black text-rose-400">
                                            {{ selectedProduct.currency === 'USD' ? '$' : '៛' }}
                                        </div>
                                        <input 
                                            v-model.number="priceForm.sellerIncentive" 
                                            type="number" step="0.01" min="0"
                                            class="w-full bg-white border border-rose-200 rounded-r-xl px-3 py-2.5 text-rose-700 font-bold text-sm outline-none focus:bg-rose-50/30"
                                            placeholder="0.00"
                                        >
                                    </div>
                                </div>
                            </div>

                            <div class="flex justify-between items-center px-4 py-2.5 rounded-xl border bg-white shadow-sm" :class="retailProfit > 0 ? 'border-emerald-200' : 'border-slate-200'">
                                <div class="flex items-center gap-2">
                                    <span class="text-[10px] font-black uppercase tracking-wider" :class="retailProfit > 0 ? 'text-emerald-600' : 'text-slate-500'">ប្រាក់ចំណេញ (Profit)</span>
                                    <span class="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">ក្នុង ១{{ translateHardcodedUnit(priceForm.retailUnit) }}</span>
                                </div>
                                <p class="text-lg font-black" :class="retailProfit > 0 ? 'text-emerald-600' : (retailProfit < 0 ? 'text-rose-600' : 'text-slate-600')">
                                    {{ retailProfit > 0 ? '+' : '' }}{{ formatPrice(retailProfit, selectedProduct.currency) }}
                                </p>
                            </div>
                        </div>

                        <div class="bg-amber-50/40 p-5 rounded-2xl border border-amber-100">
                            <div class="flex items-center gap-2 mb-4 border-b border-amber-100 pb-3">
                                <div class="w-8 h-8 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center shadow-sm">📦</div>
                                <h4 class="text-base font-black text-amber-900">តម្លៃលក់ដុំ (Wholesale)</h4>
                            </div>
                            
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label class="block text-[11px] font-black text-amber-600/80 mb-1.5">កំណត់តម្លៃលក់ចេញ និងខ្នាត</label>
                                    <div class="flex shadow-sm rounded-xl">
                                        <div class="bg-slate-100 border border-r-0 border-amber-200 px-3 py-2.5 rounded-l-xl flex items-center font-black text-slate-500">
                                            {{ selectedProduct.currency === 'USD' ? '$' : '៛' }}
                                        </div>
                                        <input 
                                            v-model.number="priceForm.wholesalePrice" 
                                            type="number" step="0.01" min="0" required
                                            class="w-full bg-white border-y border-amber-200 px-3 py-2.5 text-slate-800 font-bold text-sm outline-none focus:bg-amber-50/30"
                                            placeholder="0.00"
                                        >
                                        <select v-model="priceForm.wholesaleUnit" class="bg-white border border-l-0 border-amber-200 rounded-r-xl px-2 py-2.5 text-sm font-bold text-amber-700 outline-none cursor-pointer hover:bg-amber-50">
                                            <option value="case">១ កេះ</option>
                                            <option value="bottle">១ ដប</option>
                                            <option value="pack">១ កញ្ចប់</option>
                                            <option value="can">១ កំប៉ុង</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label class="block text-[11px] font-black text-orange-500 mb-1.5">ប្រាក់លើកទឹកចិត្ត (Dealer Bonus)</label>
                                    <div class="flex shadow-sm rounded-xl">
                                        <div class="bg-orange-50 border border-r-0 border-orange-200 px-3 py-2.5 rounded-l-xl flex items-center font-black text-orange-400">
                                            {{ selectedProduct.currency === 'USD' ? '$' : '៛' }}
                                        </div>
                                        <input 
                                            v-model.number="priceForm.dealerIncentive" 
                                            type="number" step="0.01" min="0"
                                            class="w-full bg-white border border-orange-200 rounded-r-xl px-3 py-2.5 text-orange-700 font-bold text-sm outline-none focus:bg-orange-50/30"
                                            placeholder="0.00"
                                        >
                                    </div>
                                </div>
                            </div>

                            <div class="flex justify-between items-center px-4 py-2.5 rounded-xl border bg-white shadow-sm" :class="wholesaleProfit > 0 ? 'border-emerald-200' : 'border-slate-200'">
                                <div class="flex items-center gap-2">
                                    <span class="text-[10px] font-black uppercase tracking-wider" :class="wholesaleProfit > 0 ? 'text-emerald-600' : 'text-slate-500'">ប្រាក់ចំណេញ (Profit)</span>
                                    <span class="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">ក្នុង ១{{ translateHardcodedUnit(priceForm.wholesaleUnit) }}</span>
                                </div>
                                <p class="text-lg font-black" :class="wholesaleProfit > 0 ? 'text-emerald-600' : (wholesaleProfit < 0 ? 'text-rose-600' : 'text-slate-600')">
                                    {{ wholesaleProfit > 0 ? '+' : '' }}{{ formatPrice(wholesaleProfit, selectedProduct.currency) }}
                                </p>
                            </div>
                        </div>

                        <div class="xl:col-span-2 pt-4 border-t border-slate-200 flex justify-end gap-3 mt-2">
                            <button type="button" @click="cancelPriceEdit" class="px-6 py-2.5 rounded-xl border bg-white border-slate-300 text-slate-600 font-bold hover:bg-slate-50 transition-colors text-sm">បោះបង់ (Cancel)</button>
                            <button type="submit" :disabled="isSavingPrice" class="px-8 py-2.5 rounded-xl bg-slate-800 text-white font-bold shadow-md hover:bg-slate-900 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2 text-sm">
                                <svg v-if="isSavingPrice" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                                រក្សាទុកតម្លៃ (Save)
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div v-else class="text-center py-24 text-slate-400 animate-fade-in bg-white/40 rounded-3xl border-2 border-dashed border-slate-300">
                <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-slate-300">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <p class="font-bold text-lg text-slate-600">សូមស្វែងរកផលិតផលខាងលើ</p>
                <p class="text-sm mt-1">ដើម្បីកំណត់តម្លៃលក់រាយ តម្លៃដុំ និងប្រាក់ទឹកចិត្ត</p>
            </div>

        </div>

      </div>
    </div>

    <ConfirmDialog ref="confirmDialog" />

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, onUnmounted } from 'vue';
import { db } from '@/firebaseConfig';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query } from 'firebase/firestore';
import Toast from '@/components/Toast.vue'; 
import ConfirmDialog from '@/components/shared/ConfirmDialog.vue'; 
import { useNotificationStore } from '@/stores/notification';

// --- MAIN SETUP ---
const notification = useNotificationStore();
const confirmDialog = ref(null);
const activeTab = ref('units'); // 'units', 'prices'

// --- TAB 1: UNITS STATE & LOGIC (Unchanged) ---
const isLoadingUnits = ref(true);
const isSavingUnit = ref(false);
const isDeletingUnit = ref(false);
const showAddModal = ref(false);
const units = ref([]);
const deleteModal = reactive({ show: false, id: null, label: '' });
const newUnit = ref({ label: '', color: 'cyan' });
const availableColors = ['cyan', 'blue', 'indigo', 'purple', 'emerald', 'amber', 'rose', 'slate'];

const getColorClass = (color) => {
  const map = {
    cyan:    { bgHex: 'bg-cyan-400',    bgSoft: 'bg-cyan-50',    textHex: 'text-cyan-600',    borderHex: 'border-cyan-200' },
    blue:    { bgHex: 'bg-blue-500',    bgSoft: 'bg-blue-50',    textHex: 'text-blue-600',    borderHex: 'border-blue-200' },
    indigo:  { bgHex: 'bg-indigo-500',  bgSoft: 'bg-indigo-50',  textHex: 'text-indigo-600',  borderHex: 'border-indigo-200' },
    purple:  { bgHex: 'bg-purple-500',  bgSoft: 'bg-purple-50',  textHex: 'text-purple-600',  borderHex: 'border-purple-200' },
    emerald: { bgHex: 'bg-emerald-500', bgSoft: 'bg-emerald-50', textHex: 'text-emerald-600', borderHex: 'border-emerald-200' },
    amber:   { bgHex: 'bg-amber-500',   bgSoft: 'bg-amber-50',   textHex: 'text-amber-600',   borderHex: 'border-amber-200' },
    rose:    { bgHex: 'bg-rose-500',    bgSoft: 'bg-rose-50',    textHex: 'text-rose-600',    borderHex: 'border-rose-200' },
    slate:   { bgHex: 'bg-slate-500',   bgSoft: 'bg-slate-50',   textHex: 'text-slate-600',   borderHex: 'border-slate-200' }
  };
  return map[color] || map['slate'];
};

const fetchUnits = async () => {
  isLoadingUnits.value = true;
  try {
    const q = query(collection(db, 'settings_units'));
    const snap = await getDocs(q);
    units.value = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a,b) => a.label.localeCompare(b.label, 'km'));
  } catch (error) {
    console.error("Error fetching units", error);
    notification.error('មិនអាចទាញយកទិន្នន័យឯកតាបានទេ');
  } finally {
    isLoadingUnits.value = false;
  }
};

const saveUnit = async () => {
  if (!newUnit.value.label.trim()) {
      notification.error('ឈ្មោះឯកតាមិនអាចទទេបានទេ', 'សូមបំពេញព័ត៌មាន');
      return;
  }
  isSavingUnit.value = true;
  try {
    const unitName = newUnit.value.label.trim();
    const exists = units.value.find(u => u.value === unitName);
    if (exists) {
        notification.error('ឈ្មោះឯកតានេះមានក្នុងបញ្ជីរួចហើយ', 'មានរួចហើយ');
        isSavingUnit.value = false;
        return;
    }

    const unitData = { label: unitName, value: unitName, color: newUnit.value.color, createdAt: new Date().toISOString() };
    const docRef = await addDoc(collection(db, 'settings_units'), unitData);
    units.value.push({ id: docRef.id, ...unitData });
    units.value.sort((a,b) => a.label.localeCompare(b.label, 'km'));
    
    showAddModal.value = false;
    newUnit.value = { label: '', color: 'cyan' };
    notification.success('ឯកតាត្រូវបានបន្ថែម');
  } catch (error) {
    notification.error('មិនអាចរក្សាទុកបានទេ');
  } finally {
    isSavingUnit.value = false;
  }
};

const confirmDeleteUnit = async (id, label) => {
    const confirmed = await confirmDialog.value.open("លុបឯកតា?", `តើអ្នកពិតជាចង់លុបឯកតា "${label}" មែនទេ?`);
    if (confirmed) executeDeleteUnit(id);
};

const executeDeleteUnit = async (id) => {
  try {
    await deleteDoc(doc(db, 'settings_units', id));
    units.value = units.value.filter(u => u.id !== id);
    notification.success('ឯកតាត្រូវបានលុបចេញ');
  } catch (error) {
    notification.error('មិនអាចលុបទិន្នន័យបានទេ');
  }
};

// --- TAB 2: PRICES & INCENTIVES STATE & LOGIC ---
const products = ref([]);
const isFetchingProducts = ref(false);
const productSearchQuery = ref('');
const showProductDropdown = ref(false);
const selectedProduct = ref(null);
const isSavingPrice = ref(false);

const priceForm = reactive({
    retailPrice: 0,
    retailUnit: 'bottle',     // Hardcoded default
    wholesalePrice: 0,
    wholesaleUnit: 'case',    // Hardcoded default
    sellerIncentive: 0, 
    dealerIncentive: 0  
});

const fetchProducts = async () => {
    if (products.value.length > 0) return; 
    isFetchingProducts.value = true;
    try {
        const snap = await getDocs(collection(db, 'stocks'));
        products.value = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching products", error);
        notification.error('មិនអាចទាញយកទិន្នន័យស្តុកបានទេ');
    } finally {
        isFetchingProducts.value = false;
    }
};

const filteredProducts = computed(() => {
    if (!productSearchQuery.value) return products.value.slice(0, 10); 
    const q = productSearchQuery.value.toLowerCase();
    return products.value.filter(p => 
        p.name.toLowerCase().includes(q) || 
        (p.barcode && p.barcode.toLowerCase().includes(q))
    );
});

const selectProduct = (prod) => {
    selectedProduct.value = prod;
    productSearchQuery.value = prod.name;
    
    // Load existing values, or set smart defaults
    priceForm.retailPrice = prod.retailPrice || 0;
    // Default retail to bottle if not set
    priceForm.retailUnit = prod.retailUnit || 'bottle';
    
    priceForm.wholesalePrice = prod.wholesalePrice || 0;
    // Default wholesale to case if not set
    priceForm.wholesaleUnit = prod.wholesaleUnit || 'case';

    priceForm.sellerIncentive = prod.sellerIncentive || 0;
    priceForm.dealerIncentive = prod.dealerIncentive || 0;
    
    showProductDropdown.value = false;
};

// ✅ HELPER: Normalize Cost based on selected unit vs original bought unit
const getNormalizedCost = (sellingUnit) => {
    if (!selectedProduct.value) return 0;
    
    const baseCost = selectedProduct.value.unitCost || 0;
    const baseUnit = selectedProduct.value.unit; // The unit it was BOUGHT in
    const conversion = selectedProduct.value.itemsPerCase || 12; // Safeguard, default 12 if not set

    // 1. Same unit (Buy in Box, Sell in Box / Buy in Bottle, Sell in Bottle)
    if (sellingUnit === baseUnit) return baseCost;

    // 2. Bought by 'Case' (កេះ), but selling by 'Bottle/Pack/Can' (ដប/កញ្ចប់) => Divide cost by itemsPerCase
    if (baseUnit === 'case' && (sellingUnit === 'bottle' || sellingUnit === 'pack' || sellingUnit === 'can')) {
        return baseCost / conversion;
    }

    // 3. Bought by 'Bottle/Pack/Can' (ដប/កញ្ចប់), but selling by 'Case' (កេះ) => Multiply cost by itemsPerCase
    if ((baseUnit === 'bottle' || baseUnit === 'pack' || baseUnit === 'can') && sellingUnit === 'case') {
        return baseCost * conversion;
    }

    // Fallback
    return baseCost;
};

// ✅ Calculate NET Profits (Price - NormalizedCost - Incentive)
const retailProfit = computed(() => {
    if (!selectedProduct.value) return 0;
    const cost = getNormalizedCost(priceForm.retailUnit);
    const incentive = priceForm.sellerIncentive || 0;
    return priceForm.retailPrice - cost - incentive;
});

const wholesaleProfit = computed(() => {
    if (!selectedProduct.value) return 0;
    const cost = getNormalizedCost(priceForm.wholesaleUnit);
    const incentive = priceForm.dealerIncentive || 0;
    return priceForm.wholesalePrice - cost - incentive;
});

const cancelPriceEdit = () => {
    selectedProduct.value = null;
    productSearchQuery.value = '';
    priceForm.retailPrice = 0;
    priceForm.wholesalePrice = 0;
    priceForm.sellerIncentive = 0;
    priceForm.dealerIncentive = 0;
    priceForm.retailUnit = 'bottle';
    priceForm.wholesaleUnit = 'case';
};

const savePrices = async () => {
    if (!selectedProduct.value) return;
    isSavingPrice.value = true;
    
    try {
        const stockRef = doc(db, 'stocks', selectedProduct.value.id);
        const updates = {
            retailPrice: Number(priceForm.retailPrice),
            retailUnit: priceForm.retailUnit, // Save the hardcoded unit selected
            wholesalePrice: Number(priceForm.wholesalePrice),
            wholesaleUnit: priceForm.wholesaleUnit, // Save the hardcoded unit selected
            sellerIncentive: Number(priceForm.sellerIncentive),
            dealerIncentive: Number(priceForm.dealerIncentive), 
            priceUpdatedAt: new Date().toISOString()
        };
        
        await updateDoc(stockRef, updates);
        
        const idx = products.value.findIndex(p => p.id === selectedProduct.value.id);
        if (idx !== -1) {
            products.value[idx] = { ...products.value[idx], ...updates };
        }

        notification.success('ការកំណត់ត្រូវបានរក្សាទុកដោយជោគជ័យ');
        cancelPriceEdit(); 

    } catch (error) {
        console.error("Error updating price", error);
        notification.error('មិនអាចរក្សាទុកទិន្នន័យបានទេ');
    } finally {
        isSavingPrice.value = false;
    }
};

const closeDropdown = (e) => {
    if (!e.target.closest('.relative')) {
        showProductDropdown.value = false;
    }
};

const switchTab = (tabName) => {
    activeTab.value = tabName;
    if (tabName === 'prices') {
        fetchProducts();
    }
};

onMounted(() => {
    fetchUnits();
    document.addEventListener('click', closeDropdown);
});

onUnmounted(() => {
    document.removeEventListener('click', closeDropdown);
});

// --- FORMATTERS ---
const formatPrice = (val, currency) => {
    if (val === undefined || val === null) return '0.00';
    return Number(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + (currency === 'USD' ? ' $' : ' ៛');
};

const translateHardcodedUnit = (unit) => {
  const map = { bottle: 'ដប', case: 'កេះ', pack: 'កញ្ចប់', can: 'កំប៉ុង', kg: 'គីឡូ' };
  return map[unit] || unit;
};

// Original translator for the database units display
const translateUnit = (unit) => {
  const map = { bottle: 'ដប', case: 'កេះ', pack: 'កញ្ចប់', can: 'កំប៉ុង', kg: 'គីឡូ' };
  return map[unit] || unit;
};

</script>

<style scoped>
.font-khmer { font-family: 'Battambong', 'Kantumruy Pro', sans-serif; }

.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #94a3b8; }

.animate-slide-up { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes slideUp { 
    from { opacity: 0; transform: translateY(20px) scale(0.98); } 
    to { opacity: 1; transform: translateY(0) scale(1); } 
}

.animate-fade-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { 
    from { opacity: 0; } 
    to { opacity: 1; } 
}

.animate-slide-down { animation: slideDown 0.3s ease-out forwards; }
@keyframes slideDown { 
    from { opacity: 0; transform: translateY(-10px); } 
    to { opacity: 1; transform: translateY(0); } 
}
</style>