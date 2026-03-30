<template>
  <div class="flex-1 flex flex-col h-full bg-[#F4F7FE] relative" @click="activeTooltipId = null">
      
      <div class="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 p-3 md:p-4 shadow-sm z-30 shrink-0 relative">
          <div class="flex flex-col gap-4">
              
              <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                      <button @click="$router.back()" class="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors shrink-0">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                      </button>
                      <div>
                          <h1 class="text-lg md:text-xl font-black text-slate-800 leading-tight flex items-center gap-2 font-khmer">
                              <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                              ប្រព័ន្ធបញ្ជូលការលក់ (POS)
                          </h1>
                          <p class="text-slate-500 text-[9px] md:text-[10px] font-bold uppercase tracking-wider mt-0.5">Smart Auto-Pricing POS</p>
                      </div>
                  </div>

                  <div class="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
                      <button @click="viewMode = 'card'" class="p-1.5 rounded-lg transition-all" :class="viewMode === 'card' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'">
                          <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                      </button>
                      <button @click="viewMode = 'compact'" class="p-1.5 rounded-lg transition-all" :class="viewMode === 'compact' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'">
                          <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                      </button>
                  </div>
              </div>

              <div class="flex flex-col xl:flex-row gap-3 xl:items-center font-khmer">
                  <div class="relative w-full xl:w-80 shrink-0">
                      <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                      </span>
                      <input v-model="searchQuery" type="text" placeholder="ស្វែងរកឈ្មោះ ឬ បាកូដ..." class="w-full bg-slate-50 border border-slate-200/80 rounded-full pl-11 pr-4 py-2 text-[13px] md:text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all shadow-inner">
                  </div>

                  <div class="flex flex-wrap items-center gap-2">
                      <button @click="activeFilter = 'ALL'" :class="activeFilter === 'ALL' ? 'bg-slate-800 text-white shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'" class="px-4 py-2 border rounded-full font-black text-xs transition-all active:scale-95 shrink-0">
                          ទាំងអស់
                      </button>
                      <button @click="activeFilter = 'BIOAOUA'" :class="activeFilter === 'BIOAOUA' ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-100'" class="px-4 py-2 border rounded-full font-black text-xs transition-all active:scale-95 shrink-0 uppercase">
                          BIOAOUA
                      </button>
                      <button @click="activeFilter = 'DR+'" :class="activeFilter === 'DR+' ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20' : 'bg-sky-50 text-sky-600 border-sky-100 hover:bg-sky-100'" class="px-4 py-2 border rounded-full font-black text-xs transition-all active:scale-95 shrink-0 uppercase">
                          DR+
                      </button>
                      <button @click="activeFilter = 'MASK'" :class="activeFilter === 'MASK' ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20' : 'bg-rose-50 text-rose-500 border-rose-100 hover:bg-rose-100'" class="px-4 py-2 border rounded-full font-black text-xs transition-all active:scale-95 shrink-0 uppercase">
                          ម៉ាស់ (MASK)
                      </button>
                      <button @click="activeFilter = 'OTHER'" :class="activeFilter === 'OTHER' ? 'bg-slate-500 text-white shadow-md' : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'" class="px-4 py-2 border rounded-full font-black text-xs transition-all active:scale-95 shrink-0">
                          ផ្សេងៗ
                      </button>

                      <div class="w-px h-6 bg-slate-200 mx-1 hidden sm:block"></div>

                      <button @click="activeFilter = 'COMBO'" :class="activeFilter === 'COMBO' ? 'bg-amber-100 text-amber-700 border-amber-300' : 'bg-amber-50 text-amber-600 border border-amber-100 hover:bg-amber-100'" class="px-4 py-2 rounded-full font-black text-xs transition-all flex items-center gap-1.5 active:scale-95 shadow-sm sm:ml-1">
                          🎁 បង្ហាញទំនិញឈុតទាំងអស់
                      </button>
                  </div>
              </div>
          </div>
      </div>

      <div class="flex-1 overflow-y-auto p-3 md:p-4 custom-scrollbar relative z-10 pb-28 md:pb-24 touch-pan-y font-khmer">
          
          <div v-if="isLoadingProducts" class="flex flex-col items-center justify-center h-full opacity-60">
              <div class="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-indigo-600 mb-4"></div>
              <p class="text-sm font-bold text-slate-500">កំពុងទាញយកទំនិញ...</p>
          </div>
          
          <div v-else-if="paginatedProducts.length === 0" class="flex flex-col items-center justify-center h-full text-slate-400 bg-white/50 m-4 rounded-[2rem] border-2 border-dashed border-slate-200">
              <div class="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                  <svg class="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
              </div>
              <p class="font-black text-base text-slate-500">រកមិនឃើញទំនិញទេ</p>
              <p class="text-xs mt-1 text-slate-400 font-bold">សូមសាកល្បងស្វែងរកម្ដងទៀត ឬផ្លាស់ប្តូរ Filter</p>
          </div>
          
          <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-5 max-w-[100rem] mx-auto animate-fade-in pb-10">
              
              <div v-for="product in paginatedProducts" :key="product.id" @click="$emit('add-to-cart', product)" 
                  class="bg-white border border-slate-200 shadow-sm transition-all cursor-pointer group flex flex-col select-none relative" 
                  :class="[
                      getTotalRetailStock(product) > 0 ? 'hover:shadow-xl hover:-translate-y-1 hover:border-indigo-300 active:scale-95' : 'opacity-60 cursor-not-allowed grayscale-[50%]',
                      viewMode === 'card' ? 'rounded-[1.25rem] p-2.5 md:p-3 h-full' : 'rounded-xl p-3 justify-between h-[120px] md:h-32',
                      activeTooltipId === product.id ? 'z-[100]' : 'z-10'
                  ]">
                  
                  <template v-if="viewMode === 'card'">
                      
                      <div class="relative w-full mb-3">
                          
                          <div v-if="product.isCombo" 
                               class="absolute top-2 left-2 z-20"
                               @mouseenter="activeTooltipId = product.id"
                               @mouseleave="activeTooltipId = null">
                              
                              <div class="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] md:text-[11px] font-black px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1 border border-orange-200 cursor-help">
                                  🎁 ឈុត
                              </div>

                              <transition enter-active-class="transition duration-200 ease-out" enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
                                  <div v-if="activeTooltipId === product.id" class="absolute top-full left-0 mt-2 w-64 md:w-72 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl shadow-2xl p-4 z-[9999] origin-top-left pointer-events-auto" @click.stop>
                                      
                                      <div class="absolute -top-1.5 left-5 w-3 h-3 bg-slate-900 border-l border-t border-slate-700 rotate-45"></div>
                                      
                                      <h4 class="text-[11px] font-black text-white uppercase tracking-widest mb-3 border-b border-slate-700 pb-2 flex items-center gap-2">
                                          <svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
                                          ទំនិញក្នុងឈុតនេះ
                                      </h4>
                                      <ul class="space-y-3 max-h-[430px] overflow-y-auto custom-scrollbar-dark pr-1 relative z-10">
                                          <li v-for="(detail, i) in getComboDetails(product)" :key="i" class="flex items-start justify-between gap-3">
                                              <div class="flex items-start gap-2 flex-1 min-w-0">
                                                  <span class="text-amber-400 mt-1 shrink-0 text-xs">•</span>
                                                  <span class="font-bold text-slate-200 text-[11px] leading-snug break-words" :title="detail.name">{{ detail.name }}</span>
                                              </div>
                                              <div class="bg-slate-800 text-amber-400 text-[10px] font-black px-2 py-1 rounded-md shrink-0 border border-slate-700 flex items-center gap-1 shadow-sm h-fit">
                                                  <span>x{{ detail.qty }}</span>
                                                  <span class="text-[8px] text-slate-400 uppercase">{{ detail.unit }}</span>
                                              </div>
                                          </li>
                                      </ul>
                                  </div>
                              </transition>
                          </div>
                          
                          <div v-else-if="product.category" class="absolute top-2 left-2 bg-indigo-500/90 backdrop-blur-md text-white text-[9px] font-black px-2 py-0.5 rounded shadow-sm z-10 uppercase border border-indigo-400 pointer-events-none">
                              {{ product.category }}
                          </div>
                          
                          <div class="w-full aspect-[4/3] rounded-xl bg-slate-50 border border-slate-100 relative flex items-center justify-center shrink-0 overflow-hidden">
                              <img v-if="product.image && (product.image.startsWith('http') || product.image.startsWith('data:image'))" :src="product.image" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                              <div v-else class="text-slate-300 text-4xl font-black opacity-40">{{ product.name.charAt(0) }}</div>
                              
                              <div class="absolute top-1.5 right-1.5 md:top-2 md:right-2 px-2 py-1 rounded text-[9px] md:text-[10px] font-black bg-white/95 backdrop-blur-sm border shadow-sm pointer-events-none" :class="getTotalRetailStock(product) > 0 ? 'text-emerald-600 border-emerald-100' : 'text-rose-600 border-rose-100'">
                                  {{ formatComplexStock(product) }}
                              </div>

                              <div v-if="getTotalRetailStock(product) <= 0" class="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center pointer-events-none"><span class="bg-rose-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-md">អស់ស្តុក</span></div>
                          </div>
                      </div>
                      
                      <div class="flex-1 flex flex-col">
                          <h3 class="font-black text-xs md:text-sm text-slate-800 leading-snug mb-1 line-clamp-2 group-hover:text-indigo-600 transition-colors" :title="product.name">{{ product.name }}</h3>
                          
                          <div v-if="(product.colors && product.colors.length > 0) || (product.sizes && product.sizes.length > 0)" class="flex flex-wrap gap-1 mb-1.5">
                              <span v-for="(color, cIdx) in (product.colors || [])" :key="'c'+cIdx" class="bg-sky-50 text-sky-500 text-[8px] font-bold px-1 rounded border border-sky-100">{{ color }}</span>
                              <span v-for="(size, sIdx) in (product.sizes || [])" :key="'s'+sIdx" class="bg-pink-50 text-pink-500 text-[8px] font-bold px-1 rounded border border-pink-100 uppercase">{{ size }}</span>
                          </div>

                          <p class="text-[8px] md:text-[9px] text-slate-400 font-mono mb-2 line-clamp-1">{{ product.barcode || 'NO-BARCODE' }}</p>
                          
                          <div class="mt-auto pt-2 border-t border-slate-100 flex flex-col gap-1">
                              <div v-if="!product.isCombo && product.itemsPerCase && product.itemsPerCase > 1" class="text-[8px] md:text-[9px] text-slate-500 font-bold bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 w-fit">
                                  <span class="text-slate-600">
                                      ១{{ translateHardcodedUnit(product.unit) }} = 
                                      {{ product.itemsPerCase }} {{ (product.category === 'ម៉ាស់' || product.category === 'POL') ? 'ប្រអប់' : translateRetailUnit(product) }}
                                  </span>
                              </div>
                              <div class="flex items-end justify-between mt-0.5">
                                  <div class="text-[9px] md:text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                      <span>1 {{ translateRetailUnit(product) }}</span>
                                  </div>
                                  <div class="text-right"><p class="text-[14px] md:text-[16px] font-black text-indigo-600">{{ formatPrice(product.retailPrice, product.currency) }}</p></div>
                              </div>
                          </div>
                      </div>
                  </template>

                  <template v-else>
                      <div class="flex justify-between items-start gap-2 relative w-full h-full">
                           
                          <div class="flex-1 min-w-0">
                              <h3 class="font-black text-[12px] md:text-[13px] text-slate-800 leading-tight mb-1 line-clamp-2 group-hover:text-indigo-600 transition-colors">{{ product.name }}</h3>
                              
                              <div v-if="(product.colors && product.colors.length > 0) || (product.sizes && product.sizes.length > 0)" class="flex flex-wrap gap-1 mb-1">
                                  <span v-for="(color, cIdx) in (product.colors || [])" :key="'c'+cIdx" class="bg-sky-50 text-sky-500 text-[8px] font-bold px-1 rounded border border-sky-100">{{ color }}</span>
                                  <span v-for="(size, sIdx) in (product.sizes || [])" :key="'s'+sIdx" class="bg-pink-50 text-pink-500 text-[8px] font-bold px-1 rounded border border-pink-100 uppercase">{{ size }}</span>
                              </div>

                              <div class="flex items-center gap-1.5 mt-1">
                                  <span class="text-[8px] md:text-[9px] text-slate-400 font-mono line-clamp-1">{{ product.barcode || 'NO-BARCODE' }}</span>
                                  
                                  <div v-if="product.isCombo" 
                                       class="relative z-30"
                                       @mouseenter="activeTooltipId = product.id"
                                       @mouseleave="activeTooltipId = null">
                                      <span class="bg-amber-100 text-amber-700 px-1.5 py-[1px] rounded text-[8px] font-black shrink-0 cursor-help">🎁 ឈុត</span>
                                      
                                      <transition enter-active-class="transition duration-200 ease-out" enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
                                          <div v-if="activeTooltipId === product.id" class="absolute bottom-full left-0 mb-2 w-64 md:w-72 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl shadow-2xl p-4 z-[9999] origin-bottom-left pointer-events-auto" @click.stop>
                                              <div class="absolute -bottom-1.5 left-5 w-3 h-3 bg-slate-900 border-b border-r border-slate-700 rotate-45"></div>
                                              <h4 class="text-[11px] font-black text-white uppercase tracking-widest mb-3 border-b border-slate-700 pb-2 flex items-center gap-2">
                                                  <svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
                                                  ទំនិញក្នុងឈុតនេះ
                                              </h4>
                                              <ul class="space-y-3 max-h-[430px] overflow-y-auto custom-scrollbar-dark pr-1 relative z-10">
                                                  <li v-for="(detail, i) in getComboDetails(product)" :key="i" class="flex items-start justify-between gap-3">
                                                      <div class="flex items-start gap-2 flex-1 min-w-0">
                                                          <span class="text-amber-400 mt-1 shrink-0 text-xs">•</span>
                                                          <span class="font-bold text-slate-200 text-[11px] leading-snug break-words" :title="detail.name">{{ detail.name }}</span>
                                                      </div>
                                                      <div class="bg-slate-800 text-amber-400 text-[10px] font-black px-2 py-1 rounded-md shrink-0 border border-slate-700 flex items-center gap-1 shadow-sm h-fit">
                                                          <span>x{{ detail.qty }}</span>
                                                          <span class="text-[8px] text-slate-400 uppercase">{{ detail.unit }}</span>
                                                      </div>
                                                  </li>
                                              </ul>
                                          </div>
                                      </transition>
                                  </div>
                              </div>
                          </div>
                      </div>

                      <div class="flex justify-between items-end mt-2 pt-2 border-t border-slate-100/60 pointer-events-none">
                          <div class="text-[9px] md:text-[10px] font-black" :class="getTotalRetailStock(product) > 0 ? 'text-emerald-600' : 'text-rose-600'">
                              <span v-if="getTotalRetailStock(product) <= 0" class="bg-rose-100 px-1.5 py-0.5 rounded">អស់ស្តុក</span>
                              <span v-else>{{ formatComplexStock(product) }}</span>
                          </div>
                          <div class="text-[13px] md:text-[15px] font-black text-indigo-600">{{ formatPrice(product.retailPrice, product.currency) }}</div>
                      </div>
                  </template>

              </div>
          </div>
      </div>

      <div v-if="totalProductsCount > ITEMS_PER_PAGE" class="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 md:p-4 flex items-center justify-between z-30 shadow-[0_-10px_30px_rgb(0,0,0,0.03)] font-khmer">
          <p class="text-xs font-bold text-slate-500 hidden sm:block">
              បង្ហាញ {{ Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, totalProductsCount) }} ដល់ {{ Math.min(currentPage * ITEMS_PER_PAGE, totalProductsCount) }} នៃ {{ totalProductsCount }} ទំនិញ
          </p>
          <div class="flex items-center justify-center sm:justify-end gap-2 w-full sm:w-auto">
              <button @click="currentPage--" :disabled="currentPage === 1" class="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-black text-xs hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors bg-white shadow-sm flex items-center gap-1 active:scale-95">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/></svg>
                  ថយក្រោយ
              </button>
              
              <div class="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 font-black text-xs border border-indigo-100 shadow-inner">
                  ទំព័រ {{ currentPage }} / {{ Math.ceil(totalProductsCount / ITEMS_PER_PAGE) || 1 }}
              </div>
              
              <button @click="currentPage++" :disabled="currentPage === Math.ceil(totalProductsCount / ITEMS_PER_PAGE)" class="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-black text-xs hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors bg-white shadow-sm flex items-center gap-1 active:scale-95">
                  បន្ទាប់
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
              </button>
          </div>
      </div>

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  products: { type: Array, required: true },
  isLoadingProducts: Boolean,
  getTotalRetailStock: Function,
  formatComplexStock: Function,
  translateHardcodedUnit: Function,
  translateRetailUnit: Function, 
  formatPrice: Function,
  getComboDetails: Function 
});

defineEmits(['add-to-cart']);

// 🌟 Local States for UI Controls 🌟
const viewMode = ref('card'); 
const activeFilter = ref('ALL');
const searchQuery = ref('');
const currentPage = ref(1);
const ITEMS_PER_PAGE = 20;

const activeTooltipId = ref(null); 

watch([searchQuery, activeFilter], () => {
  currentPage.value = 1;
});

const filteredProducts = computed(() => {
  let result = props.products || [];

  if (activeFilter.value === 'COMBO') {
      result = result.filter(p => p.isCombo);
  } else {
      if (activeFilter.value !== 'ALL') {
          result = result.filter(p => !p.isCombo); 
      }

      if (activeFilter.value === 'BIOAOUA') {
          result = result.filter(p => p.name && p.name.toUpperCase().includes('BIOAOUA'));
      } else if (activeFilter.value === 'DR+') {
          result = result.filter(p => p.name && p.name.toUpperCase().includes('DR+'));
      } else if (activeFilter.value === 'MASK') {
          result = result.filter(p => p.name && p.name.toUpperCase().includes('MASK'));
      } else if (activeFilter.value === 'OTHER') {
          result = result.filter(p => {
              if (!p.name) return true;
              const upper = p.name.toUpperCase();
              return !upper.includes('BIOAOUA') && !upper.includes('DR+') && !upper.includes('MASK');
          });
      }
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

const totalProductsCount = computed(() => filteredProducts.value.length);

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE;
  return filteredProducts.value.slice(start, start + ITEMS_PER_PAGE);
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;500;600;700;900&display=swap');
.font-khmer { font-family: 'Kantumruy Pro', sans-serif; }

.custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #94a3b8; }

.custom-scrollbar-dark::-webkit-scrollbar { width: 4px; }
.custom-scrollbar-dark::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 4px; }
.custom-scrollbar-dark::-webkit-scrollbar-thumb { background: #475569; border-radius: 4px; }
.custom-scrollbar-dark:hover::-webkit-scrollbar-thumb { background: #64748b; }

.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

/* 🌟 Tooltip Animation 🌟 */
.animate-fade-in-up { animation: fadeInUp 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes fadeInUp { 
    from { opacity: 0; transform: translateY(10px) scale(0.95); } 
    to { opacity: 1; transform: translateY(0) scale(1); } 
}
</style>