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
             @click="switchTab('units')"
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
           <button 
             @click="switchTab('delivery')"
             class="flex-1 md:flex-none px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all duration-300 whitespace-nowrap relative"
             :class="activeTab === 'delivery' ? 'text-indigo-600 shadow-md bg-white' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'"
           >
             តម្លៃដឹកជញ្ជូន
           </button>
        </div>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 relative">
      <div class="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-indigo-200/40 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      <div class="max-w-[95%] xl:max-w-[85rem] mx-auto space-y-4 pb-20">
        
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
                        
                        <div v-if="showProductDropdown && filteredProducts.length > 0" class="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-64 overflow-y-auto z-50 p-1.5 custom-scrollbar">
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
                    <form @submit.prevent="savePrices" class="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                        
                        <div class="bg-indigo-50/40 p-5 rounded-2xl border border-indigo-100 h-full flex flex-col">
                            <div class="flex items-center justify-between mb-4 border-b border-indigo-100 pb-3">
                                <div class="flex items-center gap-2">
                                    <div class="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center shadow-sm">🛍️</div>
                                    <h4 class="text-base font-black text-indigo-900">តម្លៃលក់រាយ (Retail)</h4>
                                </div>
                            </div>
                            
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label class="block text-[11px] font-black text-indigo-600/80 mb-1.5">តម្លៃលក់ចេញ & ខ្នាត</label>
                                    <div class="flex shadow-sm rounded-xl">
                                        <div class="bg-slate-100 border border-r-0 border-indigo-200 px-3 py-2.5 rounded-l-xl flex items-center font-black text-slate-500">
                                            {{ selectedProduct.currency === 'USD' ? '$' : '៛' }}
                                        </div>
                                        <input 
                                            v-model.number="priceForm.retailPrice" 
                                            type="number" step="any" min="0" required
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
                                    <label class="block text-[11px] font-black text-rose-500 mb-1.5">ប្រាក់ទឹកចិត្ត (Seller Bonus)</label>
                                    <div class="flex shadow-sm rounded-xl">
                                        <div class="bg-rose-50 border border-r-0 border-rose-200 px-3 py-2.5 rounded-l-xl flex items-center font-black text-rose-400">
                                            {{ selectedProduct.currency === 'USD' ? '$' : '៛' }}
                                        </div>
                                        <input 
                                            v-model.number="priceForm.sellerIncentive" 
                                            type="number" step="any" min="0"
                                            class="w-full bg-white border border-rose-200 rounded-r-xl px-3 py-2.5 text-rose-700 font-bold text-sm outline-none focus:bg-rose-50/30"
                                            placeholder="0.00"
                                        >
                                    </div>
                                </div>
                            </div>

                            <div class="mt-auto flex justify-between items-center px-4 py-2.5 rounded-xl border bg-white shadow-sm" :class="retailProfit > 0 ? 'border-emerald-200' : 'border-slate-200'">
                                <div class="flex items-center gap-2">
                                    <span class="text-[10px] font-black uppercase tracking-wider" :class="retailProfit > 0 ? 'text-emerald-600' : 'text-slate-500'">ប្រាក់ចំណេញ (Profit)</span>
                                    <span class="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">ក្នុង ១{{ translateHardcodedUnit(priceForm.retailUnit) }}</span>
                                </div>
                                <p class="text-lg font-black" :class="retailProfit > 0 ? 'text-emerald-600' : (retailProfit < 0 ? 'text-rose-600' : 'text-slate-600')">
                                    {{ retailProfit > 0 ? '+' : '' }}{{ formatPrice(retailProfit, selectedProduct.currency) }}
                                </p>
                            </div>
                        </div>

                        <div class="bg-amber-50/40 p-5 rounded-2xl border border-amber-100 h-full flex flex-col relative">
                            
                            <div class="flex items-center justify-between mb-4 border-b border-amber-100 pb-3">
                                <div class="flex items-center gap-2">
                                    <div class="w-8 h-8 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center shadow-sm">📦</div>
                                    <h4 class="text-base font-black text-amber-900">តម្លៃលក់ដុំ (Wholesale)</h4>
                                </div>
                            </div>
                            
                            <div class="space-y-3 mb-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                                <div v-for="(tier, index) in priceForm.wholesaleTiers" :key="tier.id" class="bg-white p-3 rounded-xl border relative shadow-sm transition-all" :class="index === 0 ? 'border-amber-300' : 'border-slate-200'">
                                    
                                    <button v-if="priceForm.wholesaleTiers.length > 1" type="button" @click="removeWholesaleTier(index)" class="absolute -top-2 -right-2 w-5 h-5 bg-rose-100 hover:bg-rose-500 text-rose-500 hover:text-white rounded-full flex items-center justify-center shadow-sm transition-colors border border-white z-10">
                                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                    </button>

                                    <div class="grid grid-cols-12 gap-2">
                                        <div class="col-span-12 xl:col-span-4">
                                            <label class="block text-[9px] font-black text-slate-500 mb-1 tracking-wider uppercase">{{ index === 0 ? 'លក់ចាប់ពី' : 'លក្ខខណ្ឌទី ' + (index+1) + ' (ចាប់ពី)' }}</label>
                                            <div class="flex items-center shadow-sm rounded-lg overflow-hidden border border-slate-200 focus-within:border-amber-400 focus-within:ring-1 focus-within:ring-amber-400/20 transition-all">
                                                <input 
                                                    v-model.number="tier.minQty" 
                                                    type="number" min="0" step="any"
                                                    class="w-full bg-slate-50 px-2 py-2 text-xs font-black text-slate-800 outline-none text-center focus:bg-white" 
                                                >
                                                <select v-model="tier.unit" class="bg-slate-100 border-l border-slate-200 px-1 py-2 text-[11px] font-bold text-slate-600 outline-none cursor-pointer hover:bg-slate-200 transition-colors">
                                                    <option value="case">កេះ</option>
                                                    <option value="bottle">ដប</option>
                                                    <option value="pack">កញ្ចប់</option>
                                                    <option value="can">កំប៉ុង</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div class="col-span-6 xl:col-span-4">
                                            <label class="block text-[9px] font-black text-amber-600 mb-1 tracking-wider uppercase">តម្លៃ / {{ translateHardcodedUnit(tier.unit) }}</label>
                                            <div class="flex items-center bg-slate-50 border border-slate-200 rounded-lg overflow-hidden focus-within:border-amber-400 focus-within:ring-1 focus-within:ring-amber-400/20 transition-all shadow-sm">
                                                <span class="pl-2 text-[10px] font-black text-slate-400">{{ selectedProduct.currency === 'USD' ? '$' : '៛' }}</span>
                                                <input v-model.number="tier.price" type="number" step="any" min="0" required class="w-full bg-transparent px-2 py-2 text-xs font-black text-slate-800 outline-none">
                                            </div>
                                        </div>

                                        <div class="col-span-6 xl:col-span-4">
                                            <label class="block text-[9px] font-black text-orange-500 mb-1 tracking-wider uppercase">Bonus / {{ translateHardcodedUnit(tier.unit) }}</label>
                                            <div class="flex items-center bg-slate-50 border border-slate-200 rounded-lg overflow-hidden focus-within:border-orange-400 focus-within:ring-1 focus-within:ring-orange-400/20 transition-all shadow-sm">
                                                <span class="pl-2 text-[10px] font-black text-slate-400">{{ selectedProduct.currency === 'USD' ? '$' : '៛' }}</span>
                                                <input v-model.number="tier.incentive" type="number" step="any" min="0" class="w-full bg-transparent px-2 py-2 text-xs font-black text-orange-600 outline-none">
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="mt-2 pt-2 border-t border-slate-100 flex justify-between items-center">
                                        <span class="text-[9px] font-black uppercase text-slate-400">ប្រាក់ចំណេញ ក្នុង១{{ translateHardcodedUnit(tier.unit) }} :</span>
                                        <span class="text-xs font-black bg-slate-50 px-2 py-0.5 rounded shadow-sm" :class="calculateTierProfit(tier) > 0 ? 'text-emerald-600 border border-emerald-100' : 'text-rose-600 border border-rose-100'">
                                            {{ calculateTierProfit(tier) > 0 ? '+' : '' }}{{ formatPrice(calculateTierProfit(tier), selectedProduct.currency) }}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div class="mt-auto pt-2 border-t border-amber-200 flex justify-center">
                                <button type="button" @click="addWholesaleTier" class="px-5 py-2 bg-white border border-amber-300 text-amber-600 rounded-xl text-xs font-bold hover:bg-amber-50 hover:text-amber-700 shadow-sm transition-colors flex items-center gap-1.5 active:scale-95">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                                    បន្ថែមលក្ខខណ្ឌថ្មី
                                </button>
                            </div>

                        </div>

                        <div class="xl:col-span-2 pt-4 border-t border-slate-200 flex justify-end gap-3 mt-2">
                            <button type="button" @click="cancelPriceEdit" class="px-6 py-2.5 rounded-xl border bg-white border-slate-300 text-slate-600 font-bold hover:bg-slate-50 transition-colors text-sm">បោះបង់ (Cancel)</button>
                            <button type="submit" :disabled="isSavingPrice" class="px-8 py-2.5 rounded-xl bg-slate-800 text-white font-bold shadow-md hover:bg-slate-900 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2 text-sm">
                                <svg v-if="isSavingPrice" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                                រក្សាទុកការកំណត់
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

        <div v-if="activeTab === 'delivery'" class="animate-fade-in space-y-4">
            
            <div class="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-md max-w-4xl mx-auto">
                <div class="flex items-center gap-4 mb-6 border-b border-slate-100 pb-4">
                    <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                    </div>
                    <div>
                        <h2 class="text-lg font-black text-slate-800">តម្លៃសេវាដឹកជញ្ជូន (Delivery Fees)</h2>
                        <p class="text-xs font-bold text-slate-500 mt-0.5">កំណត់តម្លៃដឹកជញ្ជូនទៅកាន់អតិថិជនតាមតំបន់</p>
                    </div>
                </div>

                <div v-if="isLoadingDelivery" class="py-10 text-center flex flex-col items-center">
                    <div class="animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-blue-600 mb-4"></div>
                    <p class="text-xs font-bold text-slate-400">កំពុងទាញយក...</p>
                </div>

                <form v-else @submit.prevent="saveDeliverySettings" class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        <div class="bg-sky-50/30 rounded-3xl p-6 border-2 border-sky-100 relative shadow-sm hover:shadow-md transition-shadow">
                            <div class="absolute -top-3 -right-3 w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center text-xl shadow-sm border border-white">🏙️</div>
                            <h3 class="font-black text-lg text-sky-900 leading-tight mb-1">ទីតាំង ភ្នំពេញ</h3>
                            <p class="text-[10px] text-sky-600/70 font-bold mb-4">តម្លៃដឹកក្នុងរាជធានី</p>
                            
                            <div class="mb-5 flex items-center gap-3">
                                <span class="text-xs font-black text-slate-500 uppercase tracking-widest">រូបិយប័ណ្ណ៖</span>
                                <div class="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                                    <button type="button" @click="deliveryForm.phnomPenh.currency = 'USD'" :class="deliveryForm.phnomPenh.currency === 'USD' ? 'bg-white shadow-sm text-sky-600' : 'text-slate-500'" class="px-4 py-1.5 rounded-md text-xs font-bold transition-all">USD ($)</button>
                                    <button type="button" @click="deliveryForm.phnomPenh.currency = 'KHR'" :class="deliveryForm.phnomPenh.currency === 'KHR' ? 'bg-white shadow-sm text-sky-600' : 'text-slate-500'" class="px-4 py-1.5 rounded-md text-xs font-bold transition-all">KHR (៛)</button>
                                </div>
                            </div>
                            
                            <div class="space-y-4">
                                <div class="bg-white p-4 rounded-2xl border border-sky-100 shadow-sm border-l-4 border-l-sky-400">
                                    <p class="text-xs font-black text-slate-600 mb-2">១. ថ្លៃដឹកជញ្ជូនស្តង់ដារ (ធម្មតា)</p>
                                    <div class="flex items-center gap-2">
                                        <span class="text-sm font-bold text-slate-500 w-24">រាល់ការកម្ម៉ង់</span>
                                        <div class="relative flex-1">
                                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none font-black text-sky-500">{{ deliveryForm.phnomPenh.currency === 'USD' ? '$' : '៛' }}</div>
                                            <input v-model.number="deliveryForm.phnomPenh.baseFee" type="number" step="any" min="0" required class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-slate-800 font-bold focus:bg-white focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 outline-none">
                                        </div>
                                    </div>
                                </div>

                                <div class="flex items-center justify-between pl-1 mt-2">
                                    <span class="text-xs font-black text-sky-700">បើកលក្ខខណ្ឌប្រូម៉ូសិនទី២</span>
                                    <label class="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" v-model="deliveryForm.phnomPenh.hasCondition" class="sr-only peer">
                                        <div class="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-sky-500"></div>
                                    </label>
                                </div>

                                <div v-if="deliveryForm.phnomPenh.hasCondition" class="bg-white p-4 rounded-2xl border border-amber-100 shadow-sm border-l-4 border-l-amber-400 animate-slide-down">
                                    <p class="text-xs font-black text-amber-600 mb-3">២. លក្ខខណ្ឌទី២ (ឧ. ទិញច្រើន ដឹកហ្វ្រី)</p>
                                    <div class="space-y-3">
                                        <div class="flex items-center gap-2">
                                            <span class="text-xs font-bold text-slate-600 w-24">ទិញចាប់ពី</span>
                                            <div class="relative flex-1">
                                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none font-black text-amber-500">{{ deliveryForm.phnomPenh.currency === 'USD' ? '$' : '៛' }}</div>
                                                <input v-model.number="deliveryForm.phnomPenh.conditionMinAmount" type="number" step="any" min="0" required class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-slate-800 font-bold focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none">
                                            </div>
                                            <span class="text-xs font-bold text-slate-500">ឡើង</span>
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <span class="text-xs font-bold text-slate-600 w-24">ថ្លៃដឹកគិតត្រឹម</span>
                                            <div class="relative flex-1">
                                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none font-black text-emerald-500">{{ deliveryForm.phnomPenh.currency === 'USD' ? '$' : '៛' }}</div>
                                                <input v-model.number="deliveryForm.phnomPenh.conditionFee" type="number" step="any" min="0" required class="w-full bg-emerald-50 border border-emerald-200 rounded-xl pl-8 pr-3 py-2 text-emerald-700 font-black focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="bg-emerald-50/30 rounded-3xl p-6 border-2 border-emerald-100 relative shadow-sm hover:shadow-md transition-shadow">
                            <div class="absolute -top-3 -right-3 w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-xl shadow-sm border border-white">🗺️</div>
                            <h3 class="font-black text-lg text-emerald-900 leading-tight mb-1">ទីតាំង តាមបណ្ដាខេត្ត</h3>
                            <p class="text-[10px] text-emerald-600/70 font-bold mb-4">តម្លៃដឹកក្រៅរាជធានី</p>
                            
                            <div class="mb-5 flex items-center gap-3">
                                <span class="text-xs font-black text-slate-500 uppercase tracking-widest">រូបិយប័ណ្ណ៖</span>
                                <div class="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                                    <button type="button" @click="deliveryForm.provincial.currency = 'USD'" :class="deliveryForm.provincial.currency === 'USD' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500'" class="px-4 py-1.5 rounded-md text-xs font-bold transition-all">USD ($)</button>
                                    <button type="button" @click="deliveryForm.provincial.currency = 'KHR'" :class="deliveryForm.provincial.currency === 'KHR' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500'" class="px-4 py-1.5 rounded-md text-xs font-bold transition-all">KHR (៛)</button>
                                </div>
                            </div>
                            
                            <div class="space-y-4">
                                <div class="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm border-l-4 border-l-emerald-400">
                                    <p class="text-xs font-black text-slate-600 mb-2">១. ថ្លៃដឹកជញ្ជូនស្តង់ដារ (ធម្មតា)</p>
                                    <div class="flex items-center gap-2">
                                        <span class="text-sm font-bold text-slate-500 w-24">រាល់ការកម្ម៉ង់</span>
                                        <div class="relative flex-1">
                                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none font-black text-emerald-500">{{ deliveryForm.provincial.currency === 'USD' ? '$' : '៛' }}</div>
                                            <input v-model.number="deliveryForm.provincial.baseFee" type="number" step="any" min="0" required class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-slate-800 font-bold focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none">
                                        </div>
                                    </div>
                                </div>

                                <div class="flex items-center justify-between pl-1 mt-2">
                                    <span class="text-xs font-black text-emerald-700">បើកលក្ខខណ្ឌប្រូម៉ូសិនទី២</span>
                                    <label class="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" v-model="deliveryForm.provincial.hasCondition" class="sr-only peer">
                                        <div class="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                                    </label>
                                </div>

                                <div v-if="deliveryForm.provincial.hasCondition" class="bg-white p-4 rounded-2xl border border-amber-100 shadow-sm border-l-4 border-l-amber-400 animate-slide-down">
                                    <p class="text-xs font-black text-amber-600 mb-3">២. លក្ខខណ្ឌទី២ (ឧ. ទិញច្រើន ចុះថ្លៃដឹក)</p>
                                    <div class="space-y-3">
                                        <div class="flex items-center gap-2">
                                            <span class="text-xs font-bold text-slate-600 w-24">ទិញចាប់ពី</span>
                                            <div class="relative flex-1">
                                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none font-black text-amber-500">{{ deliveryForm.provincial.currency === 'USD' ? '$' : '៛' }}</div>
                                                <input v-model.number="deliveryForm.provincial.conditionMinAmount" type="number" step="any" min="0" required class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-slate-800 font-bold focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none">
                                            </div>
                                            <span class="text-xs font-bold text-slate-500">ឡើង</span>
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <span class="text-xs font-bold text-slate-600 w-24">ថ្លៃដឹកគិតត្រឹម</span>
                                            <div class="relative flex-1">
                                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none font-black text-emerald-500">{{ deliveryForm.provincial.currency === 'USD' ? '$' : '៛' }}</div>
                                                <input v-model.number="deliveryForm.provincial.conditionFee" type="number" step="any" min="0" required class="w-full bg-emerald-50 border border-emerald-200 rounded-xl pl-8 pr-3 py-2 text-emerald-700 font-black focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div class="flex justify-end pt-6 border-t border-slate-200">
                        <button type="submit" :disabled="isSavingDelivery" class="px-10 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3 text-base">
                            <svg v-if="isSavingDelivery" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                            រក្សាទុកការកំណត់
                        </button>
                    </div>
                </form>
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
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, setDoc, getDoc, query } from 'firebase/firestore';
import Toast from '@/components/Toast.vue'; 
import ConfirmDialog from '@/components/shared/ConfirmDialog.vue'; 
import { useNotificationStore } from '@/stores/notification';

// --- MAIN SETUP ---
const notification = useNotificationStore();
const confirmDialog = ref(null);
const activeTab = ref('units'); 

const switchTab = (tabName) => {
    activeTab.value = tabName;
    if (tabName === 'prices') fetchProducts();
    if (tabName === 'delivery') fetchDeliverySettings();
};

// --- TAB 1: UNITS ---
const isLoadingUnits = ref(true);
const isSavingUnit = ref(false);
const showAddModal = ref(false);
const units = ref([]);
const newUnit = ref({ label: '', color: 'cyan' });

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
    notification.error('មិនអាចទាញយកទិន្នន័យឯកតាបានទេ');
  } finally {
    isLoadingUnits.value = false;
  }
};

const saveUnit = async () => {
  if (!newUnit.value.label.trim()) return notification.error('ឈ្មោះឯកតាមិនអាចទទេបានទេ', 'សូមបំពេញព័ត៌មាន');
  isSavingUnit.value = true;
  try {
    const unitName = newUnit.value.label.trim();
    if (units.value.find(u => u.value === unitName)) {
        isSavingUnit.value = false;
        return notification.error('ឈ្មោះឯកតានេះមានក្នុងបញ្ជីរួចហើយ', 'មានរួចហើយ');
    }
    const unitData = { label: unitName, value: unitName, color: newUnit.value.color, createdAt: new Date().toISOString() };
    const docRef = await addDoc(collection(db, 'settings_units'), unitData);
    units.value.push({ id: docRef.id, ...unitData });
    units.value.sort((a,b) => a.label.localeCompare(b.label, 'km'));
    
    showAddModal.value = false;
    newUnit.value = { label: '', color: 'cyan' };
    notification.success('ឯកតាត្រូវបានបន្ថែម');
  } catch (error) { notification.error('មិនអាចរក្សាទុកបានទេ'); } 
  finally { isSavingUnit.value = false; }
};

const confirmDeleteUnit = async (id, label) => {
    if (await confirmDialog.value.open("លុបឯកតា?", `តើអ្នកពិតជាចង់លុបឯកតា "${label}" មែនទេ?`)) {
        try {
            await deleteDoc(doc(db, 'settings_units', id));
            units.value = units.value.filter(u => u.id !== id);
            notification.success('ឯកតាត្រូវបានលុបចេញ');
        } catch (error) { notification.error('មិនអាចលុបទិន្នន័យបានទេ'); }
    }
};

// --- TAB 2: PRICES & INCENTIVES (TIERED WHOLESALE) ---
const products = ref([]);
const isFetchingProducts = ref(false);
const productSearchQuery = ref('');
const showProductDropdown = ref(false);
const selectedProduct = ref(null);
const isSavingPrice = ref(false);

const priceForm = reactive({
    retailPrice: 0,
    retailUnit: 'bottle',     
    sellerIncentive: 0, 
    
    // Updated for Tiers
    wholesaleTiers: [] 
});

const fetchProducts = async () => {
    if (products.value.length > 0) return; 
    isFetchingProducts.value = true;
    try {
        const snap = await getDocs(collection(db, 'stocks'));
        products.value = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) { notification.error('មិនអាចទាញយកទិន្នន័យស្តុកបានទេ'); } 
    finally { isFetchingProducts.value = false; }
};

const filteredProducts = computed(() => {
    if (!productSearchQuery.value) return products.value.slice(0, 10); 
    const q = productSearchQuery.value.toLowerCase();
    return products.value.filter(p => p.name.toLowerCase().includes(q) || (p.barcode && p.barcode.toLowerCase().includes(q)));
});

const selectProduct = (prod) => {
    selectedProduct.value = prod;
    productSearchQuery.value = prod.name;
    
    priceForm.retailPrice = prod.retailPrice || 0;
    priceForm.retailUnit = prod.retailUnit || 'bottle';
    priceForm.sellerIncentive = prod.sellerIncentive || 0;
    
    if (prod.wholesaleTiers && Array.isArray(prod.wholesaleTiers) && prod.wholesaleTiers.length > 0) {
        priceForm.wholesaleTiers = JSON.parse(JSON.stringify(prod.wholesaleTiers));
    } else {
        priceForm.wholesaleTiers = [{
            id: Date.now(),
            minQty: 1, 
            price: prod.wholesalePrice || 0,
            incentive: prod.dealerIncentive || 0,
            unit: prod.wholesaleUnit || 'case' 
        }];
    }
    
    showProductDropdown.value = false;
};

// Functions for managing tiers
const addWholesaleTier = () => {
    priceForm.wholesaleTiers.push({
        id: Date.now() + Math.random(),
        minQty: 2, 
        price: 0,
        incentive: 0,
        unit: 'case' 
    });
};

const removeWholesaleTier = (index) => {
    priceForm.wholesaleTiers.splice(index, 1);
    if (priceForm.wholesaleTiers.length === 0) {
        priceForm.wholesaleTiers.push({ id: Date.now(), minQty: 1, price: 0, incentive: 0, unit: 'case' });
    }
};

const getNormalizedCost = (sellingUnit) => {
    if (!selectedProduct.value) return 0;
    const baseCost = selectedProduct.value.unitCost || 0;
    const baseUnit = selectedProduct.value.unit; 
    const conversion = selectedProduct.value.itemsPerCase || 12; 

    if (sellingUnit === baseUnit) return baseCost;
    if (baseUnit === 'case' && ['bottle','pack','can'].includes(sellingUnit)) return baseCost / conversion;
    if (['bottle','pack','can'].includes(baseUnit) && sellingUnit === 'case') return baseCost * conversion;
    return baseCost;
};

const retailProfit = computed(() => {
    return priceForm.retailPrice - getNormalizedCost(priceForm.retailUnit) - (priceForm.sellerIncentive || 0);
});

// Calculate profit for a specific tier using its specific unit
const calculateTierProfit = (tier) => {
    const cost = getNormalizedCost(tier.unit);
    return (tier.price || 0) - cost - (tier.incentive || 0);
};

const cancelPriceEdit = () => {
    selectedProduct.value = null; productSearchQuery.value = '';
    Object.assign(priceForm, { retailPrice: 0, sellerIncentive: 0, retailUnit: 'bottle', wholesaleTiers: [] });
};

const savePrices = async () => {
    if (!selectedProduct.value) return;
    isSavingPrice.value = true;
    
    try {
        const sortedTiers = [...priceForm.wholesaleTiers];
        
        const updates = {
            retailPrice: Number(priceForm.retailPrice), 
            retailUnit: priceForm.retailUnit, 
            sellerIncentive: Number(priceForm.sellerIncentive), 
            
            wholesaleTiers: sortedTiers, 
            
            priceUpdatedAt: new Date().toISOString()
        };

        await updateDoc(doc(db, 'stocks', selectedProduct.value.id), updates);
        
        const idx = products.value.findIndex(p => p.id === selectedProduct.value.id);
        if (idx !== -1) products.value[idx] = { ...products.value[idx], ...updates };

        notification.success('ការកំណត់ត្រូវបានរក្សាទុកដោយជោគជ័យ');
        cancelPriceEdit(); 
    } catch (error) {
        console.error(error);
        notification.error('មិនអាចរក្សាទុកទិន្នន័យបានទេ');
    } finally {
        isSavingPrice.value = false;
    }
};

// --- TAB 3: DELIVERY SETTINGS ---
const isLoadingDelivery = ref(false);
const isSavingDelivery = ref(false);
const deliveryForm = reactive({
    phnomPenh: { currency: 'USD', baseFee: 1.5, hasCondition: false, conditionMinAmount: 50, conditionFee: 0 },
    provincial: { currency: 'USD', baseFee: 2.0, hasCondition: false, conditionMinAmount: 100, conditionFee: 1.0 }
});

const fetchDeliverySettings = async () => {
    isLoadingDelivery.value = true;
    try {
        const docRef = doc(db, 'settings', 'delivery_fees');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.phnomPenh) Object.assign(deliveryForm.phnomPenh, data.phnomPenh);
            if (data.provincial) Object.assign(deliveryForm.provincial, data.provincial);
        }
    } catch (error) { notification.error("មិនអាចទាញយកទិន្នន័យសេវាដឹកជញ្ជូនបានទេ"); } 
    finally { isLoadingDelivery.value = false; }
};

const saveDeliverySettings = async () => {
    isSavingDelivery.value = true;
    try {
        await setDoc(doc(db, 'settings', 'delivery_fees'), {
            phnomPenh: {
                currency: deliveryForm.phnomPenh.currency,
                baseFee: Number(deliveryForm.phnomPenh.baseFee) || 0,
                hasCondition: Boolean(deliveryForm.phnomPenh.hasCondition),
                conditionMinAmount: Number(deliveryForm.phnomPenh.conditionMinAmount) || 0,
                conditionFee: Number(deliveryForm.phnomPenh.conditionFee) || 0
            },
            provincial: {
                currency: deliveryForm.provincial.currency,
                baseFee: Number(deliveryForm.provincial.baseFee) || 0,
                hasCondition: Boolean(deliveryForm.provincial.hasCondition),
                conditionMinAmount: Number(deliveryForm.provincial.conditionMinAmount) || 0,
                conditionFee: Number(deliveryForm.provincial.conditionFee) || 0
            },
            updatedAt: new Date().toISOString()
        }, { merge: true });

        notification.success('លក្ខខណ្ឌសេវាដឹកជញ្ជូនត្រូវបានរក្សាទុក');
    } catch (error) { notification.error("មិនអាចរក្សាទុកការកំណត់នេះបានទេ"); } 
    finally { isSavingDelivery.value = false; }
};


// --- GENERAL UTILS ---
const closeDropdown = (e) => { if (!e.target.closest('.relative')) showProductDropdown.value = false; };
onMounted(() => { fetchUnits(); document.addEventListener('click', closeDropdown); });
onUnmounted(() => { document.removeEventListener('click', closeDropdown); });

const formatPrice = (val, currency) => {
    if (val === undefined || val === null) return '0.0000';
    return Number(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 }); 
};
const translateHardcodedUnit = (unit) => {
  const map = { bottle: 'ដប', case: 'កេះ', pack: 'កញ្ចប់', can: 'កំប៉ុង', kg: 'គីឡូ' };
  return map[unit] || unit;
};

const translateUnit = (unit) => {
  const map = { bottle: 'ដប', case: 'កេះ', pack: 'កញ្ចប់', can: 'កំប៉ុង', kg: 'គីឡូ' };
  if (units.value && units.value.length > 0) {
      const found = units.value.find(u => u.value === unit);
      if (found) return found.label;
  }
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
@keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
.animate-fade-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.animate-slide-down { animation: slideDown 0.3s ease-out forwards; transform-origin: top; }
@keyframes slideDown { from { opacity: 0; transform: scaleY(0.9); } to { opacity: 1; transform: scaleY(1); } }
</style>