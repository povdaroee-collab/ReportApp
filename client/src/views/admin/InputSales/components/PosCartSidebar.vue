<template>
  <button v-if="cart.length > 0 && !showMobileCart" @click="$emit('open-mobile')" class="md:hidden fixed bottom-6 right-4 bg-indigo-600 text-white w-14 h-14 rounded-full shadow-2xl z-[45] flex items-center justify-center transition-transform active:scale-95 border-2 border-white">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
      <span class="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-bounce-short">{{ cart.length }}</span>
  </button>

  <transition enter-active-class="duration-300 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-show="showMobileCart" @click="$emit('close-mobile')" class="md:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[45]"></div>
  </transition>

  <div 
      :class="showMobileCart ? 'translate-y-0' : 'translate-y-full md:translate-y-0'"
      class="fixed md:static inset-x-0 bottom-0 h-[88vh] md:h-full w-full md:w-[380px] xl:w-[420px] bg-[#F8FAFC] md:border-l border-slate-200 shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.3)] md:shadow-none flex flex-col z-[50] md:z-30 transition-transform duration-300 ease-out rounded-t-[2rem] md:rounded-none shrink-0 font-khmer"
  >
      <div class="p-4 md:p-5 border-b border-slate-200 bg-white shrink-0 z-20 rounded-t-[2rem] md:rounded-none pt-6 md:pt-5 relative flex items-center justify-between">
          <div class="absolute top-2.5 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-slate-200 rounded-full md:hidden"></div>
          <div class="flex flex-col">
              <h2 class="text-lg font-black text-slate-800 flex items-center gap-2">
                  <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg> 
                  កន្ត្រកទំនិញ
              </h2>
              
              <div class="flex items-center gap-2 mt-1">
                  <div v-if="timeLeft" class="flex items-center gap-1 text-[10px] font-black text-rose-500 bg-rose-50 px-2 py-0.5 rounded border border-rose-100 w-fit animate-pulse">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> 
                      ផុតកំណត់: {{ timeLeft }}
                  </div>

                  <button @click="$emit('update:autoOpenReceipt', !autoOpenReceipt)" 
                          class="flex items-center justify-center w-5 h-5 rounded hover:bg-slate-100 transition-colors"
                          :class="autoOpenReceipt ? 'text-indigo-500' : 'text-slate-400'"
                          :title="autoOpenReceipt ? 'បិទការលោតវិក្កយបត្រស្វ័យប្រវត្តិ' : 'បើកការលោតវិក្កយបត្រស្វ័យប្រវត្តិ'">
                      <svg v-if="autoOpenReceipt" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                      <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 3l18 18"/>
                      </svg>
                  </button>
              </div>
          </div>
          
          <div class="flex items-center gap-2">
              <span class="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg text-[12px] font-black">{{ cart.length }} មុខ</span>
              <button @click="$emit('close-mobile')" class="md:hidden w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-500 rounded-full">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
          </div>
      </div>

      <div class="flex-1 overflow-y-auto custom-scrollbar p-4 touch-pan-y flex flex-col relative">
          
          <div v-if="cart.length === 0" class="flex flex-col items-center justify-center text-slate-400 opacity-60 h-full min-h-[300px] mt-auto mb-auto">
              <div class="w-20 h-20 bg-slate-200/50 rounded-full flex items-center justify-center mb-4">
                  <svg class="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
              </div>
              <p class="font-black text-sm text-slate-600">មិនទាន់មានទំនិញទេ</p>
              <p class="text-[11px] font-bold mt-1">សូមជ្រើសរើសទំនិញបញ្ជូលកន្ត្រក</p>
          </div>
          
          <template v-else>
              <div v-if="filteredSuggestions.length > 0" class="mb-5 animate-fade-in">
                  <div class="flex items-center gap-1.5 mb-2 px-1">
                      <span class="text-amber-500 text-base leading-none">🎁</span>
                      <h4 class="text-[11px] font-black text-amber-600 uppercase tracking-widest">អាចថែមជូន (Free Add-ons)</h4>
                  </div>
                  
                  <div class="flex flex-wrap gap-2">
                      <div v-for="item in filteredSuggestions" :key="item.id" 
                           class="bg-white border border-amber-200 hover:border-amber-400 rounded-lg pl-2.5 pr-1 py-1 flex items-center gap-2 shadow-sm transition-all w-fit max-w-full">
                          <span class="text-[11px] font-bold text-slate-700 truncate max-w-[150px] cursor-help" :title="item.name">{{ item.name }}</span>
                          <button @click="$emit('add-suggestion', item)" class="bg-amber-100 hover:bg-amber-500 text-amber-600 hover:text-white w-6 h-6 shrink-0 rounded flex items-center justify-center transition-colors shadow-sm" title="ចុចដើម្បីថែមជូន">
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4"/></svg>
                          </button>
                      </div>
                  </div>
              </div>

              <div class="flex flex-col gap-2.5 mb-6">
                  <div v-for="(item, index) in cart" :key="item._uiId" 
                       @dblclick="toggleExpand(item._uiId)"
                       class="bg-white border rounded-xl shadow-sm relative group transition-all duration-300 overflow-hidden select-none" 
                       :class="[
                           item.manualType === 'ថែមជូន' ? 'border-amber-300 bg-amber-50/30' : 'border-slate-200 hover:border-indigo-300',
                           expandedStates[item._uiId] ? 'p-3.5' : 'p-2.5 hover:bg-slate-50 cursor-pointer'
                       ]">
                      
                      <div v-if="expandedStates[item._uiId]" class="absolute top-0 inset-x-0 h-1" :class="item.manualType === 'ថែមជូន' ? 'bg-amber-400' : 'bg-indigo-500'"></div>

                      <div v-if="!expandedStates[item._uiId]" class="flex items-center justify-between gap-3">
                          <div class="flex-1 min-w-0 flex items-center gap-2.5">
                              
                              <div class="flex items-center rounded-md shrink-0 shadow-sm border bg-white" 
                                   :class="item.manualType === 'ថែមជូន' ? 'border-amber-200' : 'border-slate-200'" 
                                   @click.stop @dblclick.stop>
                                  
                                  <button v-if="item.inputQty > 1" @click.stop="$emit('update-qty', index, -1)" class="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors">
                                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M20 12H4"/></svg>
                                  </button>
                                  
                                  <input 
                                      v-model="item.inputQty" 
                                      @change="$emit('commit-qty', index)" 
                                      @keyup.enter="$event.target.blur()"
                                      type="number" min="1"
                                      class="h-6 w-8 text-center text-[11px] font-black outline-none p-0 focus:ring-inner" 
                                      :class="[item.manualType === 'ថែមជូន' ? 'text-amber-600 bg-amber-50' : 'text-indigo-600 bg-indigo-50/50', item.inputQty > 1 ? 'border-x border-slate-200/60' : 'border-r border-slate-200/60 rounded-l-md']"
                                  >

                                  <button @click.stop="$emit('update-qty', index, 1)" class="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors">
                                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4"/></svg>
                                  </button>
                              </div>

                              <div class="flex flex-col min-w-0">
                                  <h4 class="font-bold text-[12px] text-slate-800 truncate" :class="{'text-amber-700': item.manualType === 'ថែមជូន'}">{{ item.product.name }}</h4>
                                  
                                  <div class="flex items-center flex-wrap gap-1 mt-0.5">
                                      <span v-if="getUnitConversionText(item)" class="text-[8.5px] md:text-[9.5px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded truncate">
                                          {{ getUnitConversionText(item) }}
                                      </span>
                                      <span v-else class="text-[9px] text-slate-400 font-bold truncate">
                                          {{ translateRetailUnit(item.product) }}
                                      </span>
                                      <span class="text-[8.5px] md:text-[9px] text-slate-400 font-bold truncate">• {{ getAutoCalculatedType(item) }}</span>
                                  </div>
                              </div>
                          </div>
                          
                          <div class="flex items-center gap-3 shrink-0">
                              <div class="text-[13px] font-black" :class="item.manualType === 'ថែមជូន' ? 'text-amber-500' : 'text-emerald-600'">
                                  {{ formatPrice(calculateItemPrice(item), item.product.currency) }}
                              </div>
                              <button @click.stop="$emit('remove', index)" @dblclick.stop class="text-slate-300 hover:text-rose-500 p-1" title="លុបទំនិញ">
                                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
                              </button>
                          </div>
                      </div>

                      <div v-else class="flex flex-col animate-fade-in">
                          <button @click.stop="$emit('remove', index)" @dblclick.stop class="absolute top-3 right-3 w-6 h-6 text-slate-300 hover:text-rose-500 bg-white hover:bg-rose-50 rounded-md flex items-center justify-center transition-colors z-10" title="លុបទំនិញ">
                              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
                          </button>
                          
                          <div class="mb-2 pr-6">
                              <h4 class="font-black text-[13px] md:text-sm text-slate-800 leading-snug line-clamp-2" :class="{'text-amber-700': item.manualType === 'ថែមជូន'}">
                                  {{ item.product.name }}
                              </h4>
                              
                              <div v-if="getUnitConversionText(item)" class="text-[9px] md:text-[10px] text-indigo-700 font-black bg-indigo-50 border border-indigo-100 px-2 py-1 rounded mt-1.5 w-fit">
                                  🔄 {{ getUnitConversionText(item) }}
                              </div>
                          </div>
                          
                          <div class="flex flex-wrap items-center gap-2 mb-3 mt-1">
                              <div class="relative w-fit">
                                  <select :value="item.selectedUnit" @change="$emit('unit-change', index, $event)" @click.stop @dblclick.stop class="appearance-none bg-slate-100/80 border border-slate-200 text-slate-700 py-1.5 pl-2.5 pr-7 rounded-md text-[11px] font-black focus:bg-white outline-none cursor-pointer transition-colors shadow-sm">
                                      <option value="retail">{{ item.product.isCombo ? 'ឈុត' : translateRetailUnit(item.product) + ' (រាយ)' }}</option>
                                      
                                      <option v-if="!item.product.isCombo && item.product.enableWholesale !== false && item.product.enableBoxTiers !== false && (item.product.category === 'ម៉ាស់' || item.product.category === 'POL') && item.product.itemsPerBox > 1" value="box">
                                          ប្រអប់ (Box)
                                      </option>
                                      
                                      <option v-if="!item.product.isCombo && item.product.enableWholesale !== false && item.product.enableDozenTiers === true" value="dozen">
                                          ឡូ (Dozen)
                                      </option>

                                      <option v-if="!item.product.isCombo && item.product.enableWholesale !== false && item.product.enableCaseTiers !== false && item.product.itemsPerCase > 1" value="case">
                                          កេះ (ដុំ)
                                      </option>
                                  </select>
                                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-slate-400"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path></svg></div>
                              </div>

                              <div class="relative w-fit">
                                  <select v-model="item.manualType" @change="$emit('manual-type-change', index, $event)" @click.stop @dblclick.stop class="appearance-none py-1.5 pl-2.5 pr-7 rounded-md text-[11px] font-black border outline-none cursor-pointer shadow-sm" :class="getBadgeClass(item)">
                                      <option v-if="item.manualType !== 'ថែមជូន'" value="auto">ស្វ័យប្រវត្តិ ({{ getAutoCalculatedType(item) }})</option>
                                      <option v-if="item.manualType !== 'ថែមជូន'" value="លក់រាយ">លក់រាយ</option>
                                      <option v-if="item.manualType !== 'ថែមជូន'" value="លក់បោះដុំ">លក់បោះដុំ</option>
                                      <option v-if="item.manualType === 'ថែមជូន'" value="ថែមជូន">🎁 ថែមជូន (Free)</option>
                                  </select>
                                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5" :class="item.manualType === 'ថែមជូន' ? 'text-amber-500' : 'text-current opacity-60'"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path></svg></div>
                              </div>
                          </div>
                          
                          <div class="flex items-end justify-between border-t border-slate-100/80 pt-3 mt-1">
                              
                              <div class="flex flex-col gap-1 w-1/2">
                                  <label class="flex items-center gap-1.5 cursor-pointer w-fit group/toggle" title="កែតម្លៃដោយដៃ" @click.stop @dblclick.stop>
                                      <div class="relative inline-block w-6 h-3.5 rounded-full transition-colors duration-300" :class="item.isManualPrice ? 'bg-indigo-500' : 'bg-slate-200 border border-slate-300'">
                                          <input type="checkbox" v-model="item.isManualPrice" class="sr-only" @change="$emit('manual-price-toggle', index)">
                                          <span class="absolute left-[2px] top-[2px] bg-white w-2.5 h-2.5 rounded-full transition-transform duration-300 shadow-sm" :class="item.isManualPrice ? 'translate-x-2.5' : 'translate-x-0'"></span>
                                      </div>
                                      <span class="text-[9px] font-bold text-slate-400 group-hover/toggle:text-indigo-500 transition-colors uppercase tracking-widest">កែតម្លៃដោយដៃ</span>
                                  </label>

                                  <div v-if="item.isManualPrice" class="flex items-center gap-1 mt-0.5 animate-fade-in" @click.stop @dblclick.stop>
                                      <span class="text-[11px] font-black text-indigo-600">{{ item.product.currency === 'USD' ? '$' : '៛' }}</span>
                                      <input type="number" v-model.number="item.manualPrice" @change="$emit('update-backend')" step="any" min="0" class="w-16 bg-indigo-50 border border-indigo-200 rounded px-1.5 py-0.5 text-[13px] font-black text-indigo-700 outline-none focus:border-indigo-500 focus:bg-white text-center shadow-inner">
                                  </div>
                                  <div v-else class="text-[13px] md:text-[14px] font-black mt-0.5" :class="item.manualPrice === 0 && item.manualType === 'ថែមជូន' ? 'text-amber-500' : 'text-slate-800'">
                                      {{ formatPrice(calculateItemPrice(item) / item.qty, item.product.currency) }} <span class="text-[9px] text-slate-400 font-bold ml-0.5">/ឯកតា</span>
                                  </div>
                              </div>

                              <div class="flex flex-col items-end gap-1.5 w-1/2">
                                  <div class="text-[14px] md:text-[15px] font-black tracking-tight leading-none" :class="item.manualType === 'ថែមជូន' ? 'text-amber-500' : 'text-emerald-600'">
                                      {{ formatPrice(calculateItemPrice(item), item.product.currency) }}
                                  </div>
                                  
                                  <div class="flex items-center bg-slate-100 rounded-md p-0.5 w-[90px] border border-slate-200 mt-1" @click.stop @dblclick.stop>
                                      <button @click.stop="$emit('update-qty', index, -1)" class="w-7 h-6 flex items-center justify-center bg-white rounded text-slate-600 font-black shadow-sm hover:bg-slate-50 hover:text-rose-500 transition-colors">−</button>
                                      <input v-model="item.inputQty" @change="$emit('commit-qty', index)" @keyup.enter="$event.target.blur()" type="number" min="1" class="w-full h-full text-center text-[12px] font-black outline-none bg-transparent text-slate-800 p-0">
                                      <button @click.stop="$emit('update-qty', index, 1)" class="w-7 h-6 flex items-center justify-center bg-white rounded text-slate-600 font-black shadow-sm hover:bg-slate-50 hover:text-indigo-600 transition-colors">+</button>
                                  </div>
                              </div>
                          </div>
                          
                          <div class="text-[8px] text-center text-slate-300 font-bold mt-2 pt-1 border-t border-slate-50 opacity-0 group-hover:opacity-100 transition-opacity">Double-click លើកាតដើម្បីបង្រួម</div>
                      </div>
                  </div>
              </div>

              <div class="bg-indigo-600 rounded-2xl p-4 md:p-5 shadow-[0_10px_20px_rgb(79,70,229,0.2)] mt-2">
                  <div class="flex justify-between items-end mb-4 border-b border-indigo-500/50 pb-3">
                      <span class="text-xs font-black text-indigo-100 uppercase tracking-widest">សរុបទឹកប្រាក់</span>
                      <span class="text-3xl font-black text-white leading-none tracking-tight">{{ formatPrice(cartTotalUSD, 'USD') }}</span>
                  </div>
                  <button @click="$emit('checkout')" :disabled="cart.length === 0" class="w-full py-3.5 rounded-xl font-black text-[14px] flex items-center justify-center gap-2 transition-all active:scale-95 bg-white text-indigo-700 hover:bg-indigo-50 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg> 
                      បន្តការទូទាត់ប្រាក់
                  </button>
              </div>

          </template>
      </div>

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  cart: Array,
  showMobileCart: Boolean,
  timeLeft: String,
  cartTotalUSD: Number,
  getAutoCalculatedType: Function,
  getBadgeClass: Function,
  calculateItemPrice: Function,
  getSingleBasePrice: Function,
  formatPrice: Function,
  translateHardcodedUnit: Function,
  translateRetailUnit: Function, 
  suggestedAddons: Array,
  autoOpenReceipt: Boolean 
});

const emit = defineEmits([
  'open-mobile', 'close-mobile', 'remove', 'update-qty', 'commit-qty', 
  'unit-change', 'manual-price-toggle', 'manual-type-change', 'checkout', 
  'update-backend', 'add-suggestion', 'update:autoOpenReceipt' 
]);

// 🌟 SMART UNIT CONVERSION DISPLAY 🌟
const getUnitConversionText = (item) => {
    if (!item.product || item.product.isCombo) return '';

    let multiplier = 1;
    let label = '';
    const retailUnit = props.translateRetailUnit(item.product);

    if (item.selectedUnit === 'case') {
        const perCase = Number(item.product.itemsPerCase) || 1;
        const perBox = (item.product.category === 'ម៉ាស់' || item.product.category === 'POL') ? (Number(item.product.itemsPerBox) || 12) : 1;
        multiplier = perCase * perBox;
        label = '១កេះ';
    } else if (item.selectedUnit === 'box') {
        multiplier = Number(item.product.itemsPerBox) || 12;
        label = '១ប្រអប់';
    } else if (item.selectedUnit === 'dozen') {
        multiplier = 12;
        label = '១ឡូ';
    } else {
        return ''; // បើជាខ្នាតរាយ មិនបាច់បង្ហាញទេ
    }

    const currentQty = Number(item.inputQty) || Number(item.qty) || 1;
    let text = `${label} = ${multiplier} ${retailUnit}`;

    if (currentQty > 1) {
        text += ` | សរុប: ${multiplier * currentQty} ${retailUnit}`;
    }

    return text;
};

// 🌟 SMART AUTO-COLLAPSE LOGIC (10 seconds) 🌟
const expandedStates = ref({});
const timers = {};

watch(() => props.cart, (newCart) => {
    newCart.forEach(item => {
        if (!item._uiId) {
            Object.defineProperty(item, '_uiId', { value: Math.random().toString(36).substr(2, 9), writable: false });
        }
        
        if (expandedStates.value[item._uiId] === undefined) {
            expandedStates.value[item._uiId] = true;
            
            timers[item._uiId] = setTimeout(() => {
                expandedStates.value[item._uiId] = false;
            }, 3000); 
        }
    });
}, { deep: true, immediate: true });

const toggleExpand = (uiId) => {
    expandedStates.value[uiId] = !expandedStates.value[uiId];
    if (timers[uiId]) {
        clearTimeout(timers[uiId]);
        delete timers[uiId];
    }
};

const filteredSuggestions = computed(() => {
  if (!props.suggestedAddons || props.suggestedAddons.length === 0) return [];
  return props.suggestedAddons.filter(suggestedItem => {
      const isAlreadyAdded = props.cart.some(cartItem => 
          cartItem.product.id === suggestedItem.id && 
          cartItem.isManualPrice && 
          cartItem.manualPrice === 0
      );
      return !isAlreadyAdded;
  });
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Battambang:wght@400;700;900&family=Kantumruy+Pro:wght@400;600;700&display=swap');
.font-khmer { font-family: 'Kantumruy Pro', 'Battambang', sans-serif; }

.custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #94a3b8; }
.animate-bounce-short { animation: bounceShort 1s ease-in-out infinite; }
@keyframes bounceShort { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15%); } }
.will-change-transform { will-change: transform; }
input[type="number"]::-webkit-inner-spin-button, input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
input[type="number"] { -moz-appearance: textfield; }
select { -webkit-appearance: none; -moz-appearance: none; }
.animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
</style>