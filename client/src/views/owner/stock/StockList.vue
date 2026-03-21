<template>
  <div class="animate-fade-in relative">
      
      <div class="mb-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div class="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <div class="relative w-full sm:w-80 z-10">
                  <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">🔍</span>
                  <input 
                      :value="searchQuery" 
                      @input="$emit('update:searchQuery', $event.target.value)"
                      type="text" 
                      placeholder="ស្វែងរកឈ្មោះ ឬ Barcode..." 
                      class="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:border-amber-500 outline-none transition-all focus:ring-1 focus:ring-amber-500/50 shadow-inner"
                  >
              </div>
              
              <button @click="generatePDF" :disabled="isGeneratingPDF || filteredStock.length === 0" class="w-full sm:w-auto shrink-0 px-5 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-neutral-900 rounded-lg text-sm font-black transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  <span v-if="isGeneratingPDF" class="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full"></span>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                  ទាញយក PDF រួម
              </button>
          </div>
          <span class="text-xs text-neutral-500 font-bold bg-neutral-800 px-3 py-1.5 rounded-lg border border-neutral-700">ទំព័រទី {{ currentPage }} (សរុប {{ filteredStock.length }})</span>
      </div>

      <div v-if="filteredStock.length === 0" class="flex flex-col items-center justify-center py-20 text-neutral-500 bg-neutral-800/30 rounded-2xl border-2 border-dashed border-neutral-700">
          <div class="text-5xl mb-4 opacity-50">📦</div>
          <p class="font-bold text-lg">មិនមានទិន្នន័យទេ</p>
          <p class="text-sm opacity-70 mt-1">សូមសាកល្បងស្វែងរកម្ដងទៀត</p>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div v-for="item in paginatedLocalStock" :key="item.id" class="bg-neutral-800/80 rounded-xl border border-neutral-700/50 overflow-hidden hover:border-amber-500/50 transition-all group shadow-lg flex flex-col relative">
              
              <div class="relative h-40 bg-neutral-900 shrink-0">
                  <img :src="item.image || 'https://via.placeholder.com/300x200?text=No+Image'" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity">
                  
                  <div class="absolute top-2 left-2 bg-amber-500/90 backdrop-blur-md px-2.5 py-1 rounded text-[10px] text-black font-black border border-amber-400 shadow-sm uppercase">
                      {{ item.category || 'DFG' }}
                  </div>

                  <div class="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded text-[10px] text-white font-mono border border-white/10 tracking-widest font-bold shadow-sm">
                      {{ item.barcode }}
                  </div>
                  <div class="absolute bottom-2 left-2 bg-amber-500 text-black text-xs font-black px-2 py-0.5 rounded shadow-md">
                      {{ item.currency === 'USD' ? '$' : '៛' }}
                  </div>
              </div>

              <div class="p-4 flex-1 flex flex-col">
                  <h3 class="text-base font-bold text-white mb-3 line-clamp-2 leading-snug" :title="item.name">{{ item.name }}</h3>
                  
                  <div v-if="(item.colors && item.colors.length > 0) || (item.sizes && item.sizes.length > 0)" class="flex flex-wrap gap-1.5 mb-3">
                      <span v-for="(color, cIdx) in (item.colors || [])" :key="'c'+cIdx" class="bg-sky-500/20 text-sky-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-sky-500/30">{{ color }}</span>
                      <span v-for="(size, sIdx) in (item.sizes || [])" :key="'s'+sIdx" class="bg-pink-500/20 text-pink-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-pink-500/30 uppercase">{{ size }}</span>
                  </div>

                  <div class="flex flex-col gap-1.5 text-[13px] text-neutral-400 mb-4 bg-neutral-900/50 p-3 rounded-lg border border-neutral-700/50">
                      <div class="flex justify-between items-center">
                          <span>ស្តុកធំ (Bulk):</span>
                          <span class="text-emerald-400 font-bold bg-emerald-400/10 px-2 py-0.5 rounded text-[11px]" v-html="getFormattedBulkStock(item)"></span>
                      </div>
                      
                      <template v-if="item.category === 'ម៉ាស់' && item.unit === 'case'">
                          <div class="w-full h-px bg-neutral-800 my-0.5"></div>
                          <div class="flex justify-between items-center">
                              <span>ស្តុកកណ្តាល (Box):</span>
                              <span class="text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded text-[11px]">
                                  {{ getExactBoxStock(item) }} ប្រអប់
                              </span>
                          </div>
                      </template>

                      <div class="w-full h-px bg-neutral-800 my-0.5"></div>
                      <div class="flex justify-between items-center">
                          <span>ស្តុករាយ (Retail):</span>
                          <span class="text-blue-400 font-black bg-blue-400/10 px-2 py-0.5 rounded text-[11px] border border-blue-400/20">
                              {{ getExactRetailStock(item) }} {{ translateRetailUnit(item) }}
                          </span>
                      </div>

                      <div v-if="item.stock_reserved > 0" class="flex justify-end mt-1">
                          <span class="text-[10px] text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded font-bold border border-amber-500/20" title="កំពុងជាប់កក់ក្នុងកន្ត្រក">
                              🔒 កំពុងកក់: {{ getExactReservedRetailStock(item) }} {{ translateRetailUnit(item) }}
                          </span>
                      </div>
                  </div>

                  <div v-if="item.unit === 'case'" class="text-[10px] text-neutral-500 mb-3 flex flex-col gap-1 font-bold bg-neutral-800/50 p-2 rounded-lg">
                      <div class="flex justify-between">
                          <span>១ កេះ ស្មើនឹង</span>
                          <span class="text-amber-400">{{ item.itemsPerCase }} {{ item.category === 'ម៉ាស់' ? 'ប្រអប់' : 'ដប/កញ្ចប់' }}</span>
                      </div>
                      <div v-if="item.category === 'ម៉ាស់'" class="flex justify-between border-t border-neutral-700/50 pt-1 mt-0.5">
                          <span>១ ប្រអប់ ស្មើនឹង</span>
                          <span class="text-sky-400">{{ item.itemsPerBox || 50 }} សន្លឹក</span>
                      </div>
                  </div>

                  <div class="mt-auto flex justify-between items-end pt-2 border-t border-neutral-700/50">
                      <div>
                          <p class="text-[10px] text-neutral-500 uppercase tracking-widest mb-0.5">តម្លៃដើម / ឯកតា</p>
                          <p class="text-amber-400 font-black">{{ formatPrice(item.unitCost, item.currency) }}</p>
                      </div>
                      <div class="flex gap-2">
                          <button @click="openEditModal(item)" class="p-2 bg-neutral-700 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-sm" title="កែប្រែរហ័ស">
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                          </button>
                          <button @click="$emit('delete', item)" class="p-2 bg-neutral-700 hover:bg-rose-600 text-rose-300 hover:text-white rounded-lg transition-colors shadow-sm" title="បញ្ជូនទៅធុងសម្រាម">
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      
      <div v-if="localTotalPages > 1" class="flex justify-center items-center gap-3 mt-8">
          <button @click="$emit('page-change', currentPage - 1)" :disabled="currentPage === 1" class="px-4 py-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 disabled:opacity-50 text-sm font-bold transition-colors">ថយក្រោយ</button>
          <span class="px-4 py-2 bg-neutral-900 rounded-lg border border-neutral-700 text-amber-500 font-black">{{ currentPage }} / {{ localTotalPages }}</span>
          <button @click="$emit('page-change', currentPage + 1)" :disabled="currentPage === localTotalPages" class="px-4 py-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 disabled:opacity-50 text-sm font-bold transition-colors">បន្ទាប់</button>
      </div>

      <transition name="modal-fade">
          <div v-if="isEditModalOpen" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" @click.self="closeEditModal">
              <div class="bg-neutral-900 border border-neutral-700 rounded-2xl w-full max-w-md shadow-2xl flex flex-col overflow-hidden animate-slide-up">
                  
                  <div class="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-800/50 shrink-0">
                      <h3 class="text-white font-bold flex items-center gap-2">
                          <svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                          កែប្រែទិន្នន័យរហ័ស
                      </h3>
                      <button @click="closeEditModal" class="text-neutral-400 hover:text-rose-500 bg-neutral-800 hover:bg-rose-500/10 p-1.5 rounded-lg transition-colors">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                  </div>

                  <div v-if="isCheckingHistory" class="p-3 bg-blue-500/10 text-blue-400 text-[11px] font-bold text-center border-b border-blue-500/20 flex justify-center items-center gap-2">
                      <span class="animate-spin h-3 w-3 border-2 border-blue-400 border-t-transparent rounded-full"></span> កំពុងត្រួតពិនិត្យប្រវត្តិស្តុក...
                  </div>
                  <div v-else-if="hasStockInHistory" class="p-3.5 bg-rose-500/10 border-b border-rose-500/30 flex gap-3 items-start text-rose-300 text-[11px] leading-relaxed shadow-inner">
                      <div class="bg-rose-500/20 p-1.5 rounded-md shrink-0 mt-0.5">
                          <svg class="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                      </div>
                      <p>
                          <strong class="text-rose-400 block mb-0.5">ប្រព័ន្ធការពារបានបិទការកែប្រែ (Locked):</strong>
                          ទំនិញនេះមានប្រវត្តិ "នាំចូល" ដូច្នេះអ្នកមិនអាចកែប្រែចំនួនស្តុក តម្លៃ ឬខ្នាតនៅទីនេះបានទេ។ អ្នកអាចកែបានតែរូបភាព និងកាលបរិច្ឆេទដែលនៅទទេប៉ុណ្ណោះ។
                      </p>
                  </div>

                  <div class="p-6 overflow-y-auto custom-scrollbar max-h-[70vh]">
                      <div class="mb-4">
                          <div class="flex justify-between items-center mb-1">
                              <p class="text-xs text-neutral-400">ឈ្មោះទំនិញ:</p>
                              <span class="bg-amber-500/20 text-amber-500 text-[10px] font-black px-2 py-0.5 rounded border border-amber-500/30 uppercase">{{ selectedItem?.category || 'DFG' }}</span>
                          </div>
                          <p class="text-sm text-amber-400 font-bold line-clamp-2 leading-relaxed bg-neutral-800 p-2.5 rounded-lg border border-neutral-700/50">{{ selectedItem?.name }}</p>
                      </div>
                      
                      <div 
                          class="relative h-40 w-full rounded-xl border-2 border-dashed border-neutral-600 hover:border-amber-400 transition-colors flex flex-col items-center justify-center cursor-pointer bg-neutral-800 group overflow-hidden mb-5 shadow-inner"
                          @click="$refs.fileInputModal.click()"
                      >
                          <img v-if="editForm.imagePreview" :src="editForm.imagePreview" class="absolute inset-0 w-full h-full object-cover">
                          <img v-else-if="selectedItem?.image" :src="selectedItem.image" class="absolute inset-0 w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all">
                          
                          <div class="text-center p-3 relative z-10 bg-black/50 rounded-xl backdrop-blur-sm group-hover:scale-105 transition-transform border border-white/10">
                              <div class="text-2xl mb-1">📷</div>
                              <span class="text-[10px] text-white font-bold drop-shadow-md">ប្តូររូបភាពថ្មី</span>
                          </div>
                          <input type="file" ref="fileInputModal" class="hidden" accept="image/*" @change="handleModalImageUpload">
                      </div>

                      <div v-if="selectedItem?.category === 'ខោ' || selectedItem?.category === 'អាវ'" class="mb-5 space-y-4">
                          <div class="bg-neutral-800 p-3 rounded-xl border border-neutral-700">
                              <label class="block text-[10px] font-black text-sky-400 mb-2 uppercase tracking-wider">ពណ៌ (ចុច Enter)</label>
                              <div class="flex flex-wrap gap-1.5 mb-2 min-h-[24px]">
                                  <span v-for="(color, index) in editForm.colors" :key="index" class="bg-sky-500/20 text-sky-300 border border-sky-500/30 px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                                      {{ color }}
                                      <button type="button" @click="removeEditTag('colors', index)" class="hover:text-rose-400"><svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                                  </span>
                              </div>
                              <input v-model="editColorInput" @keydown.enter.prevent="addEditTag('colors')" @keydown.comma.prevent="addEditTag('colors')" type="text" class="w-full bg-neutral-900 border border-neutral-600 rounded-lg px-2 py-1.5 text-xs text-white focus:border-sky-500 outline-none" placeholder="បន្ថែមពណ៌...">
                          </div>
                          <div class="bg-neutral-800 p-3 rounded-xl border border-neutral-700">
                              <label class="block text-[10px] font-black text-pink-400 mb-2 uppercase tracking-wider">ទំហំ (ចុច Enter)</label>
                              <div class="flex flex-wrap gap-1.5 mb-2 min-h-[24px]">
                                  <span v-for="(size, index) in editForm.sizes" :key="index" class="bg-pink-500/20 text-pink-300 border border-pink-500/30 px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 uppercase">
                                      {{ size }}
                                      <button type="button" @click="removeEditTag('sizes', index)" class="hover:text-rose-400"><svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                                  </span>
                              </div>
                              <input v-model="editSizeInput" @keydown.enter.prevent="addEditTag('sizes')" @keydown.comma.prevent="addEditTag('sizes')" @input="handleEditSizeInput" type="text" class="w-full bg-neutral-900 border border-neutral-600 rounded-lg px-2 py-1.5 text-xs text-white focus:border-pink-500 outline-none uppercase" placeholder="បន្ថែមទំហំ...">
                          </div>
                      </div>

                      <div class="grid grid-cols-2 gap-4 mb-5">
                          <div class="bg-neutral-800 p-3 rounded-xl border border-neutral-700 shadow-inner">
                              <label class="block text-[10px] font-black text-emerald-400 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                  MFG Date
                              </label>
                              <input 
                                  v-model="editForm.mfgDate" 
                                  type="date" 
                                  :disabled="hasStockInHistory && !!selectedItem?.mfgDate"
                                  class="w-full bg-neutral-900 border border-neutral-600 rounded-lg px-2.5 py-2 text-xs font-bold text-neutral-200 focus:border-amber-500 outline-none cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-neutral-800"
                              >
                          </div>
                          <div class="bg-neutral-800 p-3 rounded-xl border border-neutral-700 shadow-inner">
                              <label class="block text-[10px] font-black text-rose-400 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                  EXP Date
                              </label>
                              <input 
                                  v-model="editForm.expDate" 
                                  type="date" 
                                  :disabled="hasStockInHistory && !!selectedItem?.expDate"
                                  class="w-full bg-neutral-900 border border-neutral-600 rounded-lg px-2.5 py-2 text-xs font-bold text-neutral-200 focus:border-amber-500 outline-none cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-neutral-800"
                              >
                          </div>
                      </div>

                      <div v-if="selectedItem?.unit === 'case'" class="bg-neutral-800 p-4 rounded-xl border border-neutral-700 mb-5 shadow-inner" :class="{'opacity-50 grayscale pointer-events-none': hasStockInHistory}">
                          <label class="block text-[11px] font-bold text-neutral-400 mb-2 uppercase tracking-wider">📦 ចំនួនរាយក្នុង ១ កេះ (Items per Case)</label>
                          <div class="flex gap-2 mb-3">
                              <input v-model.number="editForm.itemsPerCase" type="number" min="1" :disabled="hasStockInHistory" class="w-full bg-neutral-900 border border-neutral-600 rounded-lg px-4 py-2.5 text-white font-bold focus:border-amber-500 outline-none transition-all disabled:bg-transparent disabled:border-neutral-700">
                              <div class="flex items-center px-4 bg-neutral-900 border border-neutral-600 rounded-lg text-sm text-neutral-400 shrink-0 font-bold">
                                  {{ selectedItem?.category === 'ម៉ាស់' ? 'ប្រអប់' : 'ដប/កញ្ចប់' }}
                              </div>
                          </div>
                          
                          <template v-if="selectedItem?.category === 'ម៉ាស់'">
                              <label class="block text-[11px] font-bold text-neutral-400 mb-2 uppercase tracking-wider">📦 ចំនួនសន្លឹកក្នុង ១ ប្រអប់ (Items per Box)</label>
                              <div class="flex gap-2">
                                  <input v-model.number="editForm.itemsPerBox" type="number" min="1" :disabled="hasStockInHistory" class="w-full bg-neutral-900 border border-neutral-600 rounded-lg px-4 py-2.5 text-white font-bold focus:border-amber-500 outline-none transition-all disabled:bg-transparent disabled:border-neutral-700">
                                  <div class="flex items-center px-4 bg-neutral-900 border border-neutral-600 rounded-lg text-sm text-neutral-400 shrink-0 font-bold">សន្លឹក</div>
                              </div>
                          </template>
                      </div>

                      <div class="bg-neutral-800 p-4 rounded-xl border border-neutral-700 mb-5 shadow-inner" :class="{'opacity-50 pointer-events-none': hasStockInHistory}">
                          <div class="flex justify-between items-center mb-3">
                              <label class="block text-[11px] font-bold text-blue-400 uppercase tracking-wider">📊 កែប្រែចំនួនស្តុក</label>
                              
                              <div v-if="selectedItem?.unit === 'case'" class="flex gap-1 bg-neutral-900 p-1 rounded-lg border border-neutral-700/50">
                                  <button type="button" @click="editForm.qtyMode = 'bulk'" :disabled="hasStockInHistory" :class="editForm.qtyMode === 'bulk' ? 'bg-blue-500/20 text-blue-400 shadow-sm' : 'text-neutral-500 hover:text-neutral-300'" class="px-2 py-1 rounded-md text-[10px] font-bold transition-all">កេះ (Bulk)</button>
                                  <button v-if="selectedItem?.category === 'ម៉ាស់'" type="button" @click="editForm.qtyMode = 'box'" :disabled="hasStockInHistory" :class="editForm.qtyMode === 'box' ? 'bg-blue-500/20 text-blue-400 shadow-sm' : 'text-neutral-500 hover:text-neutral-300'" class="px-2 py-1 rounded-md text-[10px] font-bold transition-all">ប្រអប់ (Box)</button>
                                  <button type="button" @click="editForm.qtyMode = 'retail'" :disabled="hasStockInHistory" :class="editForm.qtyMode === 'retail' ? 'bg-blue-500/20 text-blue-400 shadow-sm' : 'text-neutral-500 hover:text-neutral-300'" class="px-2 py-1 rounded-md text-[10px] font-bold transition-all">រាយ (Retail)</button>
                              </div>
                          </div>

                          <div class="relative mb-3">
                              <input v-model.number="editForm.inputQty" type="number" step="any" min="0" required :disabled="hasStockInHistory" class="w-full bg-neutral-900 border border-neutral-600 rounded-lg pl-4 pr-20 py-3 text-white font-bold text-lg focus:border-blue-500 outline-none transition-all disabled:bg-transparent disabled:border-neutral-700">
                              <div class="absolute right-4 top-3 text-neutral-500 font-black text-sm">
                                  {{ displayQtyUnit }}
                              </div>
                          </div>

                          <div class="text-[11px] text-neutral-400 bg-neutral-900/80 p-3 rounded-lg border border-neutral-700/50 flex flex-col gap-2">
                              <div class="flex justify-between items-center">
                                  <span>ស្មើនឹងស្តុកធំ (Bulk):</span>
                                  <span class="text-emerald-400 font-black text-sm">{{ smartCalculatedBulk }} {{ translateUnit(selectedItem?.unit) }}</span>
                              </div>
                              
                              <template v-if="selectedItem?.unit === 'case'">
                                  <template v-if="selectedItem?.category === 'ម៉ាស់'">
                                      <div class="w-full h-px bg-neutral-700/50"></div>
                                      <div class="flex justify-between items-center">
                                          <span>ស្មើនឹងស្តុកកណ្តាល (Box):</span>
                                          <span class="text-amber-400 font-black text-sm">{{ smartCalculatedBox }} ប្រអប់</span>
                                      </div>
                                  </template>
                                  
                                  <div class="w-full h-px bg-neutral-700/50"></div>
                                  <div class="flex justify-between items-center">
                                      <span>ស្មើនឹងស្តុករាយ (Retail):</span>
                                      <span class="text-blue-400 font-black text-sm">{{ smartCalculatedRetail }} {{ translateRetailUnit(selectedItem) }}</span>
                                  </div>
                              </template>
                          </div>
                      </div>

                      <div class="bg-neutral-800 p-4 rounded-xl border border-neutral-700 shadow-inner" :class="{'opacity-50 pointer-events-none': hasStockInHistory}">
                          <div class="flex justify-between items-center mb-3">
                              <label class="block text-[11px] font-bold text-amber-400 uppercase tracking-wider">💰 តម្លៃទិញចូល (Cost)</label>
                              <div class="flex gap-1 bg-neutral-900 p-1 rounded-lg border border-neutral-700/50">
                                  <button type="button" @click="editForm.costMode = 'unit'" :disabled="hasStockInHistory" :class="editForm.costMode === 'unit' ? 'bg-amber-500/20 text-amber-400 shadow-sm' : 'text-neutral-500 hover:text-neutral-300'" class="px-2 py-1 rounded-md text-[10px] font-bold transition-all">១ ឯកតា</button>
                                  <button type="button" @click="editForm.costMode = 'total'" :disabled="hasStockInHistory" :class="editForm.costMode === 'total' ? 'bg-amber-500/20 text-amber-400 shadow-sm' : 'text-neutral-500 hover:text-neutral-300'" class="px-2 py-1 rounded-md text-[10px] font-bold transition-all">សរុប</button>
                              </div>
                          </div>

                          <div class="relative mb-3">
                              <div class="absolute left-4 top-3 text-amber-500 font-black text-lg">
                                  {{ selectedItem?.currency === 'USD' ? '$' : '៛' }}
                              </div>
                              <input v-model.number="editForm.inputCost" type="number" step="any" min="0" required :disabled="hasStockInHistory" class="w-full bg-neutral-900 border border-neutral-600 rounded-lg pl-10 pr-4 py-3 text-white font-bold text-lg focus:border-amber-500 outline-none transition-all disabled:bg-transparent disabled:border-neutral-700">
                          </div>

                          <div class="text-[11px] text-neutral-400 bg-neutral-900/80 p-3 rounded-lg border border-neutral-700/50 flex flex-col gap-2">
                              <div class="flex justify-between items-center">
                                  <span>តម្លៃដើម/ឯកតា (Unit Cost):</span>
                                  <span class="text-amber-400 font-black text-sm">{{ formatPrice(editCalculatedUnitCost, selectedItem?.currency) }}</span>
                              </div>
                              <div class="w-full h-px bg-neutral-700/50"></div>
                              <div class="flex justify-between items-center">
                                  <span>តម្លៃសរុប (Total Cost):</span>
                                  <span class="text-emerald-400 font-black text-sm">{{ formatPrice(editCalculatedTotalCost, selectedItem?.currency) }}</span>
                              </div>
                          </div>
                      </div>

                  </div>

                  <div class="p-4 border-t border-neutral-800 bg-neutral-800/30 flex gap-3 shrink-0">
                      <button @click="closeEditModal" class="flex-1 py-3 rounded-xl text-neutral-400 font-bold bg-neutral-800 hover:text-white hover:bg-neutral-700 border border-neutral-700 transition-colors text-sm shadow-sm">បោះបង់</button>
                      <button @click="saveQuickEdit" :disabled="isSaving || (!hasStockInHistory && (selectedItem?.unit === 'case' && editForm.itemsPerCase < 1)) || (!hasStockInHistory && editForm.inputQty < 0)" class="flex-[2] py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-600 text-neutral-900 font-black hover:from-amber-500 hover:to-yellow-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 text-sm shadow-lg shadow-amber-500/20 active:scale-95">
                          <span v-if="isSaving" class="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full"></span>
                          រក្សាទុកការកែប្រែ
                      </button>
                  </div>

              </div>
          </div>
      </transition>

      <div ref="pdfStaging" class="fixed top-0 left-[-9999px] pointer-events-none opacity-0 bg-white z-[-1] w-[800px]"></div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, nextTick } from 'vue';
import { db } from '@/firebaseConfig';
import { doc, updateDoc, serverTimestamp, collection, query, where, onSnapshot } from 'firebase/firestore';
import { useNotificationStore } from '@/stores/notification';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const props = defineProps({
    filteredStock: Array,
    paginatedStock: Array, // <--- ចាស់ (លែងសូវសំខាន់ ព្រោះយើងបង្កើតថ្មីខាងក្រោម)
    searchQuery: String,
    currentPage: Number,
    totalPages: Number // <--- ចាស់
});

const emit = defineEmits(['update:searchQuery', 'delete', 'page-change']);
const notification = useNotificationStore();

// 🌟 Pagination Local កំណត់ 20 ក្នុង 1 ទំព័រ 🌟
const localItemsPerPage = 20;
const localTotalPages = computed(() => Math.ceil(props.filteredStock.length / localItemsPerPage) || 1);
const paginatedLocalStock = computed(() => {
    const start = (props.currentPage - 1) * localItemsPerPage;
    return props.filteredStock.slice(start, start + localItemsPerPage);
});

// --- PDF GENERATION LOGIC (UPDATED) ---
const isGeneratingPDF = ref(false);
const pdfStaging = ref(null);

const generatePDF = async () => {
    isGeneratingPDF.value = true;
    try {
        const items = props.filteredStock;
        let tableRows = '';
        
        items.forEach((item, index) => {
            const imgSrc = item.image ? `<img src="${item.image}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 6px; border: 1px solid #e2e8f0; display: block; margin: 0 auto;">` : `<div style="width: 40px; height: 40px; background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 6px; display: block; margin: 0 auto;"></div>`;

            // បង្ហាញ Category និង Tags ក្នុង PDF
            const catBadge = `<span style="display:inline-block; font-size:9px; background:#fef3c7; color:#b45309; padding:2px 4px; border-radius:4px; margin-bottom:2px; font-weight:bold;">${item.category || 'DFG'}</span>`;
            
            let tagsHtml = '';
            if (item.colors?.length > 0 || item.sizes?.length > 0) {
                tagsHtml = '<div style="margin-top:2px;">';
                (item.colors || []).forEach(c => tagsHtml += `<span style="font-size:8px; background:#e0f2fe; color:#0369a1; padding:1px 3px; border-radius:3px; margin-right:2px;">${c}</span>`);
                (item.sizes || []).forEach(s => tagsHtml += `<span style="font-size:8px; background:#fce7f3; color:#be185d; padding:1px 3px; border-radius:3px; margin-right:2px;">${s}</span>`);
                tagsHtml += '</div>';
            }

            tableRows += `
                <tr style="break-inside: avoid; page-break-inside: avoid;">
                    <td style="padding: 10px 8px; text-align: center; color: #64748b; font-weight: bold; width: 5%; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0;">${index + 1}</td>
                    <td style="padding: 10px 8px; text-align: center; width: 10%; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0;">${imgSrc}</td>
                    <td style="padding: 10px 12px; color: #0f172a; width: 40%; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; font-size: 12px; line-height: 1.4;">
                        ${catBadge}<br>
                        <strong>${item.name || 'មិនមានឈ្មោះ'}</strong>
                        ${tagsHtml}
                    </td>
                    <td style="padding: 10px 12px; text-align: center; font-family: monospace; font-weight: 900; color: #4f46e5; letter-spacing: 1px; font-size: 13px; width: 25%; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0;">${item.barcode || '-'}</td>
                    <td style="padding: 10px 12px; text-align: right; color: #0f172a; font-size: 11px; font-weight: bold; width: 20%; border-bottom: 1px solid #e2e8f0;">
                        Bulk: ${getFormattedBulkStock(item)}<br>
                        Retail: <span style="color:#2563eb;">${getExactRetailStock(item)} ${translateRetailUnit(item)}</span>
                    </td>
                </tr>
            `;
        });

        const htmlContent = `
            <div style="width: 800px; padding: 30px; background: white; font-family: 'Battambang', sans-serif; box-sizing: border-box;">
                <div style="text-align: center; margin-bottom: 25px; border-bottom: 2px solid #f59e0b; padding-bottom: 15px;">
                    <h1 style="font-size: 24px; font-weight: 900; color: #172554; margin: 0; text-transform: uppercase;">បញ្ជីទំនិញ និង បាកូដ</h1>
                    <p style="margin: 5px 0 0 0; color: #64748b; font-size: 12px; font-weight: bold;">កាលបរិច្ឆេទ: ${new Date().toLocaleDateString('km-KH')} | ចំនួនសរុប: ${items.length}</p>
                </div>
                <table style="width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0;">
                    <thead style="background-color: #f8fafc;">
                        <tr>
                            <th style="padding: 12px 8px; text-align: center; color: #334155; font-size: 12px; font-weight: 900; border-bottom: 2px solid #cbd5e1; border-right: 1px solid #e2e8f0;">#</th>
                            <th style="padding: 12px 8px; text-align: center; color: #334155; font-size: 12px; font-weight: 900; border-bottom: 2px solid #cbd5e1; border-right: 1px solid #e2e8f0;">រូបភាព</th>
                            <th style="padding: 12px 12px; text-align: left; color: #334155; font-size: 12px; font-weight: 900; border-bottom: 2px solid #cbd5e1; border-right: 1px solid #e2e8f0;">ឈ្មោះទំនិញ / ប្រភេទ</th>
                            <th style="padding: 12px 12px; text-align: center; color: #334155; font-size: 12px; font-weight: 900; border-bottom: 2px solid #cbd5e1; border-right: 1px solid #e2e8f0;">បាកូដ (Barcode)</th>
                            <th style="padding: 12px 12px; text-align: right; color: #334155; font-size: 12px; font-weight: 900; border-bottom: 2px solid #cbd5e1;">ស្តុកសរុប</th>
                        </tr>
                    </thead>
                    <tbody>${tableRows}</tbody>
                </table>
            </div>
        `;

        const iframe = document.createElement('iframe');
        iframe.style.position = 'absolute';
        iframe.style.width = '800px';
        iframe.style.height = '0';
        iframe.style.border = 'none';
        iframe.style.left = '-9999px';
        document.body.appendChild(iframe);

        const docIframe = iframe.contentWindow.document;
        docIframe.open();
        docIframe.write(`
            <html>
            <head>
                <link href="https://fonts.googleapis.com/css2?family=Battambang:wght@400;700;900&display=swap" rel="stylesheet">
                <style>body { font-family: 'Battambang', sans-serif; background: white; margin: 0; padding: 0; }</style>
            </head>
            <body>
                ${htmlContent}
            </body>
            </html>
        `);
        docIframe.close();

        await iframe.contentWindow.document.fonts.ready;
        await new Promise(r => setTimeout(r, 800)); 

        const targetElement = iframe.contentWindow.document.body;

        const canvas = await html2canvas(targetElement, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: "#ffffff",
            windowWidth: 800
        });

        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = 210;
        const pageHeight = 295;
        
        const propsImg = pdf.getImageProperties(imgData);
        const pdfHeight = (propsImg.height * pdfWidth) / propsImg.width;
        
        let position = 0;
        let leftHeight = pdfHeight;

        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
        leftHeight -= pageHeight;

        while (leftHeight > 0) {
            position = leftHeight - pdfHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
            leftHeight -= pageHeight;
        }

        pdf.save(`Stock_Barcodes_${new Date().getTime()}.pdf`);
        notification.success("ទាញយក PDF បានជោគជ័យ");
        
        document.body.removeChild(iframe);

    } catch (error) {
        console.error("PDF Gen Error:", error);
        notification.error("បរាជ័យក្នុងការបង្កើត PDF");
    } finally {
        isGeneratingPDF.value = false;
    }
};

// --- QUICK EDIT MODAL LOGIC WITH SMART LOCKDOWN & DYNAMIC TAGS ---
const isEditModalOpen = ref(false);
const selectedItem = ref(null);
const isSaving = ref(false);
const fileInputModal = ref(null);

const hasStockInHistory = ref(false);
const isCheckingHistory = ref(false);
let historyCheckUnsubscribe = null;

// 🌟 Added new fields for edit
const editForm = reactive({
    imagePreview: null,
    itemsPerCase: 1,
    itemsPerBox: 1,
    qtyMode: 'bulk', // bulk, box, retail
    inputQty: 0,
    costMode: 'unit',
    inputCost: 0,
    mfgDate: '', 
    expDate: '',
    colors: [],
    sizes: []
});

const editColorInput = ref('');
const editSizeInput = ref('');

const addEditTag = (type) => {
  const input = type === 'colors' ? editColorInput.value : editSizeInput.value;
  const val = input.trim();
  if (val) {
      if (!editForm[type]) editForm[type] = [];
      if (!editForm[type].includes(val)) {
          editForm[type].push(type === 'sizes' ? val.toUpperCase() : val);
      }
  }
  if (type === 'colors') editColorInput.value = '';
  else editSizeInput.value = '';
};

const removeEditTag = (type, index) => {
  editForm[type].splice(index, 1);
};

const handleEditSizeInput = (e) => {
  if (selectedItem.value?.category === 'អាវ') {
      const val = e.target.value;
      const englishOnly = val.replace(/[^a-zA-Z0-9]/g, '');
      if (val !== englishOnly) {
          editSizeInput.value = englishOnly;
      }
  }
};

const openEditModal = (item) => {
    selectedItem.value = item;
    
    // Reset Data
    editForm.imagePreview = null; 
    editForm.itemsPerCase = item.itemsPerCase || 1; 
    editForm.itemsPerBox = item.itemsPerBox || 1;
    editForm.qtyMode = 'bulk';
    editForm.inputQty = item.quantity || 0; 
    editForm.costMode = 'unit'; 
    editForm.inputCost = item.unitCost || 0; 
    editForm.mfgDate = item.mfgDate || ''; 
    editForm.expDate = item.expDate || ''; 
    editForm.colors = item.colors ? [...item.colors] : [];
    editForm.sizes = item.sizes ? [...item.sizes] : [];
    
    isEditModalOpen.value = true;
    
    isCheckingHistory.value = true;
    hasStockInHistory.value = false;
    
    const q = query(
        collection(db, 'stock_transactions'),
        where('productId', '==', item.id),
        where('type', '==', 'IN')
    );
    
    historyCheckUnsubscribe = onSnapshot(q, (snapshot) => {
        hasStockInHistory.value = !snapshot.empty; 
        isCheckingHistory.value = false;
    });
};

const closeEditModal = () => {
    if (historyCheckUnsubscribe) {
        historyCheckUnsubscribe();
        historyCheckUnsubscribe = null;
    }
    isEditModalOpen.value = false;
    selectedItem.value = null;
    editForm.imagePreview = null;
    editColorInput.value = '';
    editSizeInput.value = '';
};

// --- SMART QUANTITY CALCULATIONS ---
const displayQtyUnit = computed(() => {
    if (!selectedItem.value) return '';
    if (editForm.qtyMode === 'bulk') return translateUnit(selectedItem.value.unit);
    if (editForm.qtyMode === 'box') return 'ប្រអប់';
    return translateRetailUnit(selectedItem.value);
});

const smartCalculatedBulk = computed(() => {
    if (!selectedItem.value) return 0;
    let val = Number(editForm.inputQty) || 0;
    
    if (selectedItem.value.unit === 'case') {
        const perCase = Number(editForm.itemsPerCase) || 1;
        const perBox = Number(editForm.itemsPerBox) || 1;
        
        if (editForm.qtyMode === 'retail') {
            if (selectedItem.value.category === 'ម៉ាស់') {
                val = val / (perCase * perBox); // សន្លឹក -> កេះ
            } else {
                val = val / perCase; // ដប -> កេះ
            }
        } else if (editForm.qtyMode === 'box' && selectedItem.value.category === 'ម៉ាស់') {
            val = val / perCase; // ប្រអប់ -> កេះ
        }
    }
    return Number(val.toFixed(3));
});

const smartCalculatedBox = computed(() => {
    if (!selectedItem.value || selectedItem.value.category !== 'ម៉ាស់' || selectedItem.value.unit !== 'case') return 0;
    let val = Number(editForm.inputQty) || 0;
    
    if (editForm.qtyMode === 'bulk') {
        val = val * (Number(editForm.itemsPerCase) || 1); // កេះ -> ប្រអប់
    } else if (editForm.qtyMode === 'retail') {
        val = val / (Number(editForm.itemsPerBox) || 1); // សន្លឹក -> ប្រអប់
    }
    return Number(val.toFixed(2));
});

const smartCalculatedRetail = computed(() => {
    if (!selectedItem.value) return 0;
    let val = Number(editForm.inputQty) || 0;
    
    if (selectedItem.value.unit === 'case') {
        const perCase = Number(editForm.itemsPerCase) || 1;
        const perBox = Number(editForm.itemsPerBox) || 1;
        
        if (editForm.qtyMode === 'bulk') {
            if (selectedItem.value.category === 'ម៉ាស់') {
                val = val * (perCase * perBox); // កេះ -> សន្លឹក
            } else {
                val = val * perCase; // កេះ -> ដប
            }
        } else if (editForm.qtyMode === 'box' && selectedItem.value.category === 'ម៉ាស់') {
            val = val * perBox; // ប្រអប់ -> សន្លឹក
        }
    }
    return Math.round(val);
});

const editCalculatedUnitCost = computed(() => {
    if (!selectedItem.value || smartCalculatedBulk.value <= 0) return 0;
    if (editForm.costMode === 'total') {
        return editForm.inputCost / smartCalculatedBulk.value;
    }
    return editForm.inputCost;
});

const editCalculatedTotalCost = computed(() => {
    if (!selectedItem.value) return 0;
    if (editForm.costMode === 'unit') {
        return editForm.inputCost * smartCalculatedBulk.value;
    }
    return editForm.inputCost;
});

// --- IMAGE UPLOAD ---
const handleModalImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.match('image.*')) return notification.error('សូមជ្រើសរើសប្រភេទជារូបភាព');

    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            const MAX_WIDTH = 600;
            if (width > MAX_WIDTH) { height = Math.round((height * MAX_WIDTH) / width); width = MAX_WIDTH; }
            canvas.width = width; canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            editForm.imagePreview = canvas.toDataURL('image/jpeg', 0.8); 
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
    event.target.value = ''; 
};

// 🔥 SAVE TO FIREBASE WITH SMART CONDITIONS 🔥
const saveQuickEdit = async () => {
    if (!selectedItem.value) return;
    isSaving.value = true;
    
    try {
        const updateData = { 
            updatedAt: serverTimestamp()
        };
        
        if (editForm.imagePreview) {
            updateData.image = editForm.imagePreview;
        }

        // អនុញ្ញាតឱ្យ Update ពណ៌ និងទំហំ ទោះបីមានប្រវត្តិ IN ក៏ដោយ
        if (selectedItem.value.category === 'ខោ' || selectedItem.value.category === 'អាវ') {
            updateData.colors = editForm.colors;
            updateData.sizes = editForm.sizes;
        }

        if (!hasStockInHistory.value) {
            const finalBulkQty = Number(smartCalculatedBulk.value);
            updateData.quantity = finalBulkQty; 
            updateData.unitCost = Number(editCalculatedUnitCost.value);
            updateData.totalCost = Number(editCalculatedTotalCost.value);
            if (selectedItem.value.unit === 'case') {
                updateData.itemsPerCase = Number(editForm.itemsPerCase);
                if (selectedItem.value.category === 'ម៉ាស់') {
                    updateData.itemsPerBox = Number(editForm.itemsPerBox);
                }
            }
        }

        if (!hasStockInHistory.value || !selectedItem.value.mfgDate) {
            updateData.mfgDate = editForm.mfgDate || null;
        }
        if (!hasStockInHistory.value || !selectedItem.value.expDate) {
            updateData.expDate = editForm.expDate || null;
        }

        await updateDoc(doc(db, 'stocks', selectedItem.value.id), updateData);
        
        notification.success("ទិន្នន័យត្រូវបានកែប្រែដោយជោគជ័យ!");
        closeEditModal();
        
    } catch (error) {
        console.error("Error updating quick edit:", error);
        notification.error("មានបញ្ហាក្នុងការរក្សាទុកទិន្នន័យ");
    } finally {
        isSaving.value = false;
    }
};

// --- FORMATTERS ---
const formatPrice = (val, currency) => {
    return Number(val || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 3 }) + (currency === 'USD' ? ' $' : ' ៛');
};
const translateUnit = (unit) => {
    const map = { bottle: 'ដប', case: 'កេះ', pack: 'កញ្ចប់', can: 'កំប៉ុង', kg: 'គីឡូ', pair: 'គូ', pcs: 'PCS' };
    return map[unit] || unit;
};
const translateRetailUnit = (item) => {
    if (item.category === 'ម៉ាស់') return 'សន្លឹក';
    if (item.unit === 'case') return 'ដប/កញ្ចប់'; 
    return translateUnit(item.unit);
};
const getExactRetailStock = (item) => {
    const qty = Number(item.quantity) || 0;
    if (item.unit === 'case') {
        const perCase = Number(item.itemsPerCase) || 1;
        const perBox = item.category === 'ម៉ាស់' ? (Number(item.itemsPerBox) || 1) : 1;
        return Math.round(qty * perCase * perBox);
    }
    return Math.round(qty);
};
const getExactBoxStock = (item) => {
    const qty = Number(item.quantity) || 0;
    const perCase = Number(item.itemsPerCase) || 1;
    return Math.round(qty * perCase);
};
const getExactReservedRetailStock = (item) => {
    const reserved = Number(item.stock_reserved) || 0;
    if (item.unit === 'case') {
        const perCase = Number(item.itemsPerCase) || 1;
        const perBox = item.category === 'ម៉ាស់' ? (Number(item.itemsPerBox) || 1) : 1;
        return Math.round(reserved * perCase * perBox);
    }
    return Math.round(reserved);
};
const getFormattedBulkStock = (item) => {
    const qty = Number(item.quantity) || 0;
    if (item.unit !== 'case') return `${Math.round(qty)} ${translateUnit(item.unit)}`;
    
    const perCase = Number(item.itemsPerCase) || 1;
    const perBox = item.category === 'ម៉ាស់' ? (Number(item.itemsPerBox) || 1) : 1;
    
    const totalRetail = Math.round(qty * perCase * perBox);
    const fullCases = Math.floor(totalRetail / (perCase * perBox));
    
    let remainderStr = '';
    if (item.category === 'ម៉ាស់') {
        const totalRemainingPieces = totalRetail % (perCase * perBox);
        const remainingBoxes = Math.floor(totalRemainingPieces / perBox);
        const remainingPieces = totalRemainingPieces % perBox;
        
        if (remainingBoxes > 0) remainderStr += ` ${remainingBoxes} ប្រអប់`;
        if (remainingPieces > 0) remainderStr += ` ${remainingPieces} សន្លឹក`;
    } else {
        const remainingRetail = totalRetail % perCase;
        if (remainingRetail > 0) remainderStr += ` ${remainingRetail} ${translateRetailUnit(item)}`;
    }
    
    const decimalDisplay = qty.toFixed(3).replace(/\.?0+$/, ''); 
    
    if (remainderStr) {
        return `${decimalDisplay} កេះ <span class="text-[10px] text-neutral-400 font-normal ml-1 border-l border-neutral-600 pl-1">(${fullCases}កេះ${remainderStr})</span>`;
    }
    return `${decimalDisplay} កេះ`;
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Battambang:wght@400;700;900&display=swap');

.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #52525b; border-radius: 10px; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #71717a; }

.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.2s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.animate-slide-up { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
.animate-fade-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }

input[type="number"]::-webkit-inner-spin-button, 
input[type="number"]::-webkit-outer-spin-button { 
    -webkit-appearance: none; 
    margin: 0; 
}
input[type="number"] {
    -moz-appearance: textfield;
}
</style>