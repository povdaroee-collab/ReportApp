<template>
  <div class="font-khmer h-[100dvh] flex flex-col relative bg-[#F4F7FE] overflow-hidden">
    
    <Teleport to="body">
      <div class="fixed top-4 right-4 z-[9999] w-full max-w-sm pointer-events-none flex flex-col gap-2">
        <div class="pointer-events-auto">
           <Toast />
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="showDeleteModal" class="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
        <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-slide-up border border-slate-100">
          <div class="p-6 md:p-8 text-center relative">
            <div class="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-rose-500/10 blur-2xl rounded-full pointer-events-none"></div>
            
            <div class="w-20 h-20 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-rose-500 shadow-sm border border-rose-100 relative z-10 rotate-3">
              <svg class="w-10 h-10 -rotate-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            </div>
            
            <h3 class="text-xl md:text-2xl font-black text-slate-800 mb-3 tracking-tight">បញ្ជាក់ការលុបតម្លៃ</h3>
            <p class="text-sm text-slate-500 font-bold leading-relaxed px-2">
              តើអ្នកពិតជាចង់លុបការកំណត់តម្លៃនៃទំនិញនេះមែនទេ?
              <br/>
              <span class="text-rose-600 bg-rose-50 px-3 py-1 rounded-lg mt-3 inline-block border border-rose-100 shadow-inner">
                ទំនិញនេះនឹងត្រលប់ទៅជាស្ថានភាពមិនទាន់កំណត់តម្លៃវិញ!
              </span>
            </p>
          </div>
          <div class="bg-slate-50 p-5 md:px-8 md:py-5 border-t border-slate-100 flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button @click="showDeleteModal = false" :disabled="isDeletingPrice" class="w-full sm:w-auto px-6 py-3 rounded-xl border bg-white border-slate-300 text-slate-600 font-bold shadow-sm hover:bg-slate-100 transition-all text-sm active:scale-95">
              បោះបង់ (Cancel)
            </button>
            <button @click="executeDeletePrice" :disabled="isDeletingPrice" class="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 text-white font-black shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 hover:from-rose-500 hover:to-rose-400 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 text-sm border border-rose-600">
              <svg v-if="isDeletingPrice" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              យល់ព្រមលុប
            </button>
          </div>
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
             @click="switchTab('prices')"
             class="flex-1 md:flex-none px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all duration-300 whitespace-nowrap relative"
             :class="activeTab === 'prices' ? 'text-indigo-600 shadow-md bg-white' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'"
           >
             កំណត់តម្លៃ និងប្រាក់ទឹកចិត្ត
           </button>
           <button 
             @click="switchTab('combos')"
             class="flex-1 md:flex-none px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all duration-300 whitespace-nowrap relative"
             :class="activeTab === 'combos' ? 'text-indigo-600 shadow-md bg-white' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'"
           >
             គ្រប់គ្រងការលក់ (ឈុត)
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
                            class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-12 py-3 text-slate-800 font-bold focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                        >
                        
                        <button 
                            v-if="productSearchQuery" 
                            @click.stop="clearSearch" 
                            class="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-rose-500 transition-colors"
                            title="លុបការស្វែងរក"
                        >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                        
                        <div v-if="showProductDropdown" class="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden flex flex-col max-h-[400px]">
                            
                            <div class="p-2 border-b border-slate-100 bg-slate-50/50 flex gap-2 shrink-0">
                                <button 
                                    @click.stop="priceFilterStatus = 'all'"
                                    :class="priceFilterStatus === 'all' ? 'bg-indigo-100 text-indigo-700 font-bold border-indigo-200' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'"
                                    class="px-3 py-1.5 rounded-lg text-xs border transition-colors flex-1"
                                >
                                    ទាំងអស់
                                </button>
                                <button 
                                    @click.stop="priceFilterStatus = 'set'"
                                    :class="priceFilterStatus === 'set' ? 'bg-emerald-100 text-emerald-700 font-bold border-emerald-200' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'"
                                    class="px-3 py-1.5 rounded-lg text-xs border transition-colors flex-1"
                                >
                                    បានកំណត់តម្លៃ
                                </button>
                                <button 
                                    @click.stop="priceFilterStatus = 'unset'"
                                    :class="priceFilterStatus === 'unset' ? 'bg-rose-100 text-rose-700 font-bold border-rose-200' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'"
                                    class="px-3 py-1.5 rounded-lg text-xs border transition-colors flex-1"
                                >
                                    មិនទាន់កំណត់
                                </button>
                            </div>

                            <div class="overflow-y-auto p-1.5 custom-scrollbar flex-1">
                                <div v-if="filteredProducts.length === 0" class="p-4 text-center text-slate-400 text-sm font-bold">
                                    រកមិនឃើញទំនិញទេ
                                </div>
                                <div 
                                    v-else
                                    v-for="prod in filteredProducts" 
                                    :key="prod.id" 
                                    @click="selectProduct(prod)"
                                    class="flex items-center gap-3 p-2 hover:bg-indigo-50 rounded-lg cursor-pointer transition-colors"
                                >
                                    <img :src="prod.image || 'https://via.placeholder.com/150'" class="w-10 h-10 rounded-md object-cover border border-slate-100 shrink-0 bg-white">
                                    
                                    <div class="flex-1 min-w-0">
                                        <h4 class="font-bold text-sm text-slate-800 truncate">{{ prod.name }}</h4>
                                        <p class="text-[10px] text-slate-500 font-mono truncate">{{ prod.barcode }}</p>
                                    </div>

                                    <div class="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-md border" 
                                         :class="hasPriceSet(prod) ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-500'">
                                        <div class="w-1.5 h-1.5 rounded-full" :class="hasPriceSet(prod) ? 'bg-emerald-500' : 'bg-rose-500'"></div>
                                        <span class="text-[10px] font-bold whitespace-nowrap">{{ hasPriceSet(prod) ? 'បានកំណត់តម្លៃ' : 'មិនទាន់កំណត់' }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="selectedProduct" class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden animate-slide-up">
                
                <div class="bg-slate-50 p-4 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <img :src="selectedProduct.image || 'https://via.placeholder.com/150'" class="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-sm bg-white">
                    <div class="flex-1 flex flex-col sm:flex-row sm:items-center justify-between w-full">
                        <div>
                            <h3 class="text-xl font-black text-slate-800">{{ selectedProduct.name }}</h3>
                            <div class="flex items-center gap-3 mt-1 text-xs font-bold text-slate-500">
                                <span class="font-mono bg-slate-200/50 px-1.5 py-0.5 rounded">{{ selectedProduct.barcode }}</span>
                                <span>| ក្នុងស្តុកមាន: <span class="text-emerald-600">{{ formatQty(selectedProduct.quantity) }} ឯកតា</span></span>
                            </div>
                        </div>
                        <div class="mt-2 sm:mt-0 text-right bg-rose-50 px-4 py-2 rounded-xl border border-rose-100">
                            <p class="text-[10px] uppercase font-black text-rose-400 tracking-wider mb-0.5">តម្លៃដើមទិញចូល (កេះ/ធុង)</p>
                            <p class="text-lg font-black text-rose-600">
                                {{ formatPrice(selectedProduct.unitCost) }}{{ selectedProduct.currency === 'USD' ? '$' : '៛' }} 
                            </p>
                        </div>
                    </div>
                </div>

                <div class="p-5 md:p-6">
                    <form @submit.prevent="savePrices" class="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                        
                        <div class="xl:col-span-5 bg-indigo-50/40 p-5 rounded-2xl border border-indigo-100 h-full flex flex-col">
                            <div class="flex items-center justify-between mb-4 border-b border-indigo-100 pb-3">
                                <div class="flex items-center gap-2">
                                    <div class="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center shadow-sm">🛍️</div>
                                    <h4 class="text-base font-black text-indigo-900">តម្លៃលក់រាយ (Retail)</h4>
                                </div>
                            </div>
                            
                            <p class="text-[10px] font-bold text-indigo-500 bg-indigo-100/50 px-2 py-1 rounded mb-4 inline-block">
                                ※ ការកំណត់នេះគិតជា <span class="font-black text-indigo-700">ខ្នាត ដប (រាយ)</span>
                            </p>

                            <div class="space-y-4">
                                <div>
                                    <label class="block text-[11px] font-black text-indigo-600/80 mb-1.5">តម្លៃលក់ចេញ / 1ដប</label>
                                    <div class="flex shadow-sm rounded-xl">
                                        <div class="bg-slate-100 border border-r-0 border-indigo-200 px-3 py-2.5 rounded-l-xl flex items-center font-black text-slate-500">
                                            {{ selectedProduct.currency === 'USD' ? '$' : '៛' }}
                                        </div>
                                        <input 
                                            v-model.number="priceForm.retailPrice" 
                                            type="number" step="any" min="0" required
                                            class="w-full bg-white border border-indigo-200 rounded-r-xl px-3 py-2.5 text-slate-800 font-bold text-sm outline-none focus:bg-indigo-50/30"
                                            placeholder="0.00"
                                        >
                                    </div>
                                </div>
                                <div>
                                    <label class="block text-[11px] font-black text-rose-500 mb-1.5">ប្រាក់ទឹកចិត្ត (Bonus) / 1ដប</label>
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
                        </div>

                        <div class="xl:col-span-7 bg-amber-50/40 p-5 rounded-2xl border border-amber-100 h-full flex flex-col relative">
                            <div class="flex items-center gap-2 mb-5 border-b border-amber-100 pb-3">
                                <div class="w-8 h-8 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center shadow-sm">📦</div>
                                <h4 class="text-base font-black text-amber-900">តម្លៃលក់ដុំ (Wholesale Tiers)</h4>
                            </div>
                            
                            <div class="space-y-6 max-h-[550px] overflow-y-auto custom-scrollbar pr-2">
                                
                                <div class="bg-white p-4 rounded-xl border border-amber-200 shadow-sm relative">
                                    <div class="flex items-center justify-between mb-4 border-b border-amber-100 pb-2">
                                        <p class="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded">
                                            ※ លក្ខខណ្ឌទី១៖ បោះដុំជា <span class="font-black text-amber-800">ខ្នាត ដប</span>
                                        </p>
                                        <button type="button" @click="addBottleTier" class="text-[10px] bg-amber-100 text-amber-700 px-3 py-1.5 rounded-lg font-bold hover:bg-amber-500 hover:text-white transition-colors flex items-center gap-1">
                                            + បន្ថែម
                                        </button>
                                    </div>

                                    <div class="space-y-3">
                                        <div v-for="(tier, idx) in priceForm.bottleTiers" :key="tier.id" class="grid grid-cols-12 gap-3 relative bg-slate-50/50 p-3 rounded-lg border border-slate-200 shadow-sm group hover:border-amber-300 transition-colors">
                                            
                                            <button v-if="priceForm.bottleTiers.length > 1" type="button" @click="removeBottleTier(idx)" class="absolute -top-2.5 -right-2.5 w-6 h-6 bg-rose-100 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors rounded-full flex justify-center items-center shadow-sm z-10 opacity-0 group-hover:opacity-100">
                                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                            </button>

                                            <div class="col-span-12 sm:col-span-4">
                                                <label class="block text-[10px] font-black text-slate-500 mb-1 uppercase tracking-widest text-center">លក់ចាប់ពី (ដប)</label>
                                                <input v-model.number="tier.minQty" type="number" min="1" step="any" class="w-full bg-white border border-slate-200 rounded-lg px-2 py-2 text-xs font-black text-slate-800 outline-none text-center focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20">
                                            </div>
                                            <div class="col-span-6 sm:col-span-4">
                                                <label class="block text-[10px] font-black text-amber-600 mb-1 uppercase tracking-widest text-center">តម្លៃ / 1ដប</label>
                                                <div class="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden focus-within:border-amber-400 focus-within:ring-1 focus-within:ring-amber-400/20">
                                                    <span class="pl-2 text-[10px] font-black text-slate-400">{{ selectedProduct.currency === 'USD' ? '$' : '៛' }}</span>
                                                    <input v-model.number="tier.price" type="number" step="any" min="0" required class="w-full bg-transparent px-2 py-2 text-xs font-black text-slate-800 outline-none text-center">
                                                </div>
                                            </div>
                                            <div class="col-span-6 sm:col-span-4">
                                                <label class="block text-[10px] font-black text-orange-500 mb-1 uppercase tracking-widest text-center">Bonus / 1ដប</label>
                                                <div class="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden focus-within:border-orange-400 focus-within:ring-1 focus-within:ring-orange-400/20">
                                                    <span class="pl-2 text-[10px] font-black text-slate-400">{{ selectedProduct.currency === 'USD' ? '$' : '៛' }}</span>
                                                    <input v-model.number="tier.incentive" type="number" step="any" min="0" class="w-full bg-transparent px-2 py-2 text-xs font-black text-orange-600 outline-none text-center">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="bg-white p-4 rounded-xl border border-blue-200 shadow-sm relative">
                                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-blue-100 pb-2">
                                        <div class="flex flex-wrap items-center gap-2">
                                            <p class="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded">
                                                ※ លក្ខខណ្ឌទី២៖ បោះដុំជា <span class="font-black text-blue-800">ខ្នាត កេះ</span>
                                            </p>
                                            <p class="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                                                <span class="text-blue-600">១កេះ</span> = <span class="text-emerald-600">{{ selectedProduct.itemsPerCase || 1 }} ដប</span>
                                            </p>
                                        </div>
                                        <button type="button" @click="addCaseTier" class="text-[10px] bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg font-bold hover:bg-blue-600 hover:text-white transition-colors flex items-center gap-1 shrink-0">
                                            + បន្ថែម
                                        </button>
                                    </div>

                                    <div class="space-y-3">
                                        <div v-for="(tier, idx) in priceForm.caseTiers" :key="tier.id" class="grid grid-cols-12 gap-3 relative bg-slate-50/50 p-3 rounded-lg border border-slate-200 shadow-sm group hover:border-blue-300 transition-colors">
                                            
                                            <button v-if="priceForm.caseTiers.length > 1" type="button" @click="removeCaseTier(idx)" class="absolute -top-2.5 -right-2.5 w-6 h-6 bg-rose-100 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors rounded-full flex justify-center items-center shadow-sm z-10 opacity-0 group-hover:opacity-100">
                                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                            </button>

                                            <div class="col-span-12 sm:col-span-4">
                                                <label class="block text-[10px] font-black text-slate-500 mb-1 uppercase tracking-widest text-center">លក់ចាប់ពី (កេះ)</label>
                                                <input v-model.number="tier.minQty" type="number" min="1" step="any" class="w-full bg-white border border-slate-200 rounded-lg px-2 py-2 text-xs font-black text-slate-800 outline-none text-center focus:border-blue-400 focus:ring-1 focus:ring-blue-400/20">
                                            </div>
                                            <div class="col-span-6 sm:col-span-4 flex flex-col">
                                                <label class="block text-[10px] font-black text-blue-600 mb-1 uppercase tracking-widest text-center">តម្លៃ / 1ដប</label>
                                                <div class="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400/20">
                                                    <span class="pl-2 text-[10px] font-black text-slate-400">{{ selectedProduct.currency === 'USD' ? '$' : '៛' }}</span>
                                                    <input v-model.number="tier.price" type="number" step="any" min="0" required class="w-full bg-transparent px-2 py-2 text-xs font-black text-slate-800 outline-none text-center">
                                                </div>
                                                <span class="text-[9px] text-blue-500 font-bold text-center mt-1">(= {{ ((tier.price || 0) * (selectedProduct.itemsPerCase || 1)).toLocaleString() }}$ ក្នុង១កេះ)</span>
                                            </div>
                                            <div class="col-span-6 sm:col-span-4 flex flex-col">
                                                <label class="block text-[10px] font-black text-orange-500 mb-1 uppercase tracking-widest text-center">Bonus / 1ដប</label>
                                                <div class="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden focus-within:border-orange-400 focus-within:ring-1 focus-within:ring-orange-400/20">
                                                    <span class="pl-2 text-[10px] font-black text-slate-400">{{ selectedProduct.currency === 'USD' ? '$' : '៛' }}</span>
                                                    <input v-model.number="tier.incentive" type="number" step="any" min="0" class="w-full bg-transparent px-2 py-2 text-xs font-black text-orange-600 outline-none text-center">
                                                </div>
                                                <span class="text-[9px] text-orange-500 font-bold text-center mt-1">(= {{ ((tier.incentive || 0) * (selectedProduct.itemsPerCase || 1)).toLocaleString() }}$ ក្នុង១កេះ)</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div class="xl:col-span-12 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center gap-3 mt-2">
                            <button 
                                v-if="hasPriceSet(selectedProduct)" 
                                type="button" 
                                @click="showDeleteModal = true" 
                                class="w-full sm:w-auto sm:mr-auto px-6 py-2.5 rounded-xl border bg-white border-rose-200 text-rose-500 font-bold hover:bg-rose-50 hover:border-rose-300 hover:text-rose-600 shadow-sm transition-all text-sm flex items-center justify-center gap-2 active:scale-95"
                            >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                លុបការកំណត់នេះចោល
                            </button>

                            <div class="flex gap-3 w-full sm:w-auto">
                                <button type="button" @click="cancelPriceEdit" class="flex-1 sm:flex-none px-6 py-2.5 rounded-xl border bg-white border-slate-300 text-slate-600 font-bold shadow-sm hover:bg-slate-50 transition-colors text-sm">បោះបង់ (Cancel)</button>
                                <button type="submit" :disabled="isSavingPrice" class="flex-1 sm:flex-none px-8 py-2.5 rounded-xl bg-slate-800 text-white font-bold shadow-md hover:bg-slate-900 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 text-sm">
                                    <svg v-if="isSavingPrice" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                                    រក្សាទុកការកំណត់
                                </button>
                            </div>
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

        <div v-if="activeTab === 'combos'" class="animate-fade-in">
             <ManageCombos />
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
                </div>

                <form v-else @submit.prevent="saveDeliverySettings" class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        <div class="bg-sky-50/30 rounded-3xl p-6 border-2 border-sky-100 relative shadow-sm">
                            <div class="absolute -top-3 -right-3 w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center text-xl shadow-sm border border-white">🏙️</div>
                            <h3 class="font-black text-lg text-sky-900 leading-tight mb-1">ទីតាំង ភ្នំពេញ</h3>
                            
                            <div class="mb-5 flex items-center gap-3 mt-4">
                                <span class="text-xs font-black text-slate-500 uppercase tracking-widest">រូបិយប័ណ្ណ៖</span>
                                <div class="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                                    <button type="button" @click="deliveryForm.phnomPenh.currency = 'USD'" :class="deliveryForm.phnomPenh.currency === 'USD' ? 'bg-white shadow-sm text-sky-600' : 'text-slate-500'" class="px-4 py-1.5 rounded-md text-xs font-bold transition-all">USD ($)</button>
                                    <button type="button" @click="deliveryForm.phnomPenh.currency = 'KHR'" :class="deliveryForm.phnomPenh.currency === 'KHR' ? 'bg-white shadow-sm text-sky-600' : 'text-slate-500'" class="px-4 py-1.5 rounded-md text-xs font-bold transition-all">KHR (៛)</button>
                                </div>
                            </div>
                            
                            <div class="space-y-4">
                                <div class="bg-white p-4 rounded-2xl border border-sky-100 shadow-sm border-l-4 border-l-sky-400">
                                    <p class="text-xs font-black text-slate-600 mb-2">១. ថ្លៃដឹកជញ្ជូនស្តង់ដារ</p>
                                    <div class="flex items-center gap-2">
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
                                    <p class="text-xs font-black text-amber-600 mb-3">២. លក្ខខណ្ឌទី២ (ទិញច្រើនចុះថ្លៃដឹក)</p>
                                    <div class="space-y-3">
                                        <div class="flex items-center gap-2">
                                            <span class="text-xs font-bold text-slate-600 w-24">ទិញចាប់ពី</span>
                                            <div class="relative flex-1">
                                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none font-black text-amber-500">{{ deliveryForm.phnomPenh.currency === 'USD' ? '$' : '៛' }}</div>
                                                <input v-model.number="deliveryForm.phnomPenh.conditionMinAmount" type="number" step="any" min="0" class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-slate-800 font-bold focus:border-amber-400 outline-none">
                                            </div>
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <span class="text-xs font-bold text-slate-600 w-24">ថ្លៃដឹកគិតត្រឹម</span>
                                            <div class="relative flex-1">
                                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none font-black text-emerald-500">{{ deliveryForm.phnomPenh.currency === 'USD' ? '$' : '៛' }}</div>
                                                <input v-model.number="deliveryForm.phnomPenh.conditionFee" type="number" step="any" min="0" class="w-full bg-emerald-50 border border-emerald-200 rounded-xl pl-8 pr-3 py-2 text-emerald-700 font-black focus:border-emerald-400 outline-none">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="bg-emerald-50/30 rounded-3xl p-6 border-2 border-emerald-100 relative shadow-sm">
                            <div class="absolute -top-3 -right-3 w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-xl shadow-sm border border-white">🗺️</div>
                            <h3 class="font-black text-lg text-emerald-900 leading-tight mb-1">ទីតាំង តាមបណ្ដាខេត្ត</h3>
                            
                            <div class="mb-5 flex items-center gap-3 mt-4">
                                <span class="text-xs font-black text-slate-500 uppercase tracking-widest">រូបិយប័ណ្ណ៖</span>
                                <div class="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                                    <button type="button" @click="deliveryForm.provincial.currency = 'USD'" :class="deliveryForm.provincial.currency === 'USD' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500'" class="px-4 py-1.5 rounded-md text-xs font-bold transition-all">USD ($)</button>
                                    <button type="button" @click="deliveryForm.provincial.currency = 'KHR'" :class="deliveryForm.provincial.currency === 'KHR' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500'" class="px-4 py-1.5 rounded-md text-xs font-bold transition-all">KHR (៛)</button>
                                </div>
                            </div>
                            
                            <div class="space-y-4">
                                <div class="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm border-l-4 border-l-emerald-400">
                                    <p class="text-xs font-black text-slate-600 mb-2">១. ថ្លៃដឹកជញ្ជូនស្តង់ដារ</p>
                                    <div class="flex items-center gap-2">
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
                                    <p class="text-xs font-black text-amber-600 mb-3">២. លក្ខខណ្ឌទី២ (ទិញច្រើនចុះថ្លៃដឹក)</p>
                                    <div class="space-y-3">
                                        <div class="flex items-center gap-2">
                                            <span class="text-xs font-bold text-slate-600 w-24">ទិញចាប់ពី</span>
                                            <div class="relative flex-1">
                                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none font-black text-amber-500">{{ deliveryForm.provincial.currency === 'USD' ? '$' : '៛' }}</div>
                                                <input v-model.number="deliveryForm.provincial.conditionMinAmount" type="number" step="any" min="0" class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-slate-800 font-bold focus:border-amber-400 outline-none">
                                            </div>
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <span class="text-xs font-bold text-slate-600 w-24">ថ្លៃដឹកគិតត្រឹម</span>
                                            <div class="relative flex-1">
                                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none font-black text-emerald-500">{{ deliveryForm.provincial.currency === 'USD' ? '$' : '៛' }}</div>
                                                <input v-model.number="deliveryForm.provincial.conditionFee" type="number" step="any" min="0" class="w-full bg-emerald-50 border border-emerald-200 rounded-xl pl-8 pr-3 py-2 text-emerald-700 font-black focus:border-emerald-400 outline-none">
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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, onUnmounted } from 'vue';
import { db } from '@/firebaseConfig';
import { collection, doc, updateDoc, setDoc, getDoc, query, where, onSnapshot, deleteField } from 'firebase/firestore';
import Toast from '@/components/Toast.vue'; 
import { useNotificationStore } from '@/stores/notification';
import ManageCombos from './ManageCombos.vue';

const notification = useNotificationStore();
const activeTab = ref('prices'); 

const switchTab = (tabName) => {
    activeTab.value = tabName;
    if (tabName === 'prices') fetchProducts();
    if (tabName === 'delivery') fetchDeliverySettings();
};

// --- TAB 1: PRICES & INCENTIVES ---
const products = ref([]);
const isFetchingProducts = ref(false);
const productSearchQuery = ref('');
const showProductDropdown = ref(false);
const selectedProduct = ref(null);
const isSavingPrice = ref(false);

const isDeletingPrice = ref(false);
const showDeleteModal = ref(false);

const priceFilterStatus = ref('all'); // 'all', 'set', 'unset'

const priceForm = reactive({
    retailPrice: 0,
    retailUnit: 'bottle',     
    sellerIncentive: 0, 
    bottleTiers: [], 
    caseTiers: [] 
});

let unsubscribeProducts = null;

const fetchProducts = () => {
    if (unsubscribeProducts) return; 
    isFetchingProducts.value = true;
    try {
        const q = query(collection(db, 'stocks'), where('isDeleted', '==', false));
        unsubscribeProducts = onSnapshot(q, (snap) => {
            products.value = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            isFetchingProducts.value = false;

            if (selectedProduct.value) {
                const updatedProd = products.value.find(p => p.id === selectedProduct.value.id);
                if (!updatedProd) cancelPriceEdit();
                else {
                    selectedProduct.value.quantity = updatedProd.quantity;
                    selectedProduct.value.unitCost = updatedProd.unitCost;
                }
            }
        }, (error) => {
            console.error(error);
            notification.error('មិនអាចទាញយកទិន្នន័យស្តុកបានទេ');
            isFetchingProducts.value = false;
        });
    } catch (error) { 
        console.error(error);
        isFetchingProducts.value = false; 
    }
};

// មុខងារសម្រាប់ឆែកមើលថា ទំនិញនោះត្រូវបានកំណត់តម្លៃរួចឬនៅ
const hasPriceSet = (prod) => {
    if (!prod) return false;
    return !!prod.priceUpdatedAt || Number(prod.retailPrice) > 0 || (prod.wholesaleTiers && prod.wholesaleTiers.length > 0);
};

// មុខងារសម្រាប់លុបអក្សរក្នុងប្រអប់ស្វែងរកភ្លាមៗ
const clearSearch = () => {
    productSearchQuery.value = '';
    showProductDropdown.value = true; 
};

const filteredProducts = computed(() => {
    let result = products.value;

    if (priceFilterStatus.value === 'set') {
        result = result.filter(p => hasPriceSet(p));
    } else if (priceFilterStatus.value === 'unset') {
        result = result.filter(p => !hasPriceSet(p));
    }

    if (productSearchQuery.value) {
        const q = productSearchQuery.value.toLowerCase();
        result = result.filter(p => p.name.toLowerCase().includes(q) || (p.barcode && p.barcode.toLowerCase().includes(q)));
    } else {
        result = result.slice(0, 15);
    }

    return result;
});

const selectProduct = (prod) => {
    selectedProduct.value = prod;
    productSearchQuery.value = prod.name;
    
    priceForm.retailPrice = prod.retailPrice || 0;
    priceForm.retailUnit = 'bottle';
    priceForm.sellerIncentive = prod.sellerIncentive || 0;
    
    priceForm.bottleTiers = [];
    priceForm.caseTiers = [];

    if (prod.wholesaleTiers && Array.isArray(prod.wholesaleTiers)) {
        prod.wholesaleTiers.forEach(t => {
            if (t.unit === 'case') priceForm.caseTiers.push({ ...t, id: t.id || Date.now() + Math.random() });
            else priceForm.bottleTiers.push({ ...t, id: t.id || Date.now() + Math.random() });
        });
    }
    
    if (priceForm.bottleTiers.length === 0) priceForm.bottleTiers.push({ id: Date.now(), minQty: 1, price: 0, incentive: 0, unit: 'bottle' });
    if (priceForm.caseTiers.length === 0) priceForm.caseTiers.push({ id: Date.now() + 1, minQty: 1, price: 0, incentive: 0, unit: 'case' });
    
    showProductDropdown.value = false;
};

const addBottleTier = () => { priceForm.bottleTiers.push({ id: Date.now() + Math.random(), minQty: 1, price: 0, incentive: 0, unit: 'bottle' }); };
const removeBottleTier = (index) => { priceForm.bottleTiers.splice(index, 1); };
const addCaseTier = () => { priceForm.caseTiers.push({ id: Date.now() + Math.random(), minQty: 1, price: 0, incentive: 0, unit: 'case' }); };
const removeCaseTier = (index) => { priceForm.caseTiers.splice(index, 1); };

const cancelPriceEdit = () => {
    selectedProduct.value = null; productSearchQuery.value = '';
    Object.assign(priceForm, { retailPrice: 0, sellerIncentive: 0, retailUnit: 'bottle', bottleTiers: [], caseTiers: [] });
};

const savePrices = async () => {
    if (!selectedProduct.value) return;
    isSavingPrice.value = true;
    try {
        const combinedTiers = [
            ...priceForm.bottleTiers.map(t => ({ ...t, unit: 'bottle' })),
            ...priceForm.caseTiers.map(t => ({ ...t, unit: 'case' }))
        ];

        const updates = {
            retailPrice: Number(priceForm.retailPrice), 
            retailUnit: 'bottle', 
            sellerIncentive: Number(priceForm.sellerIncentive), 
            wholesaleTiers: combinedTiers, 
            priceUpdatedAt: new Date().toISOString()
        };
        await updateDoc(doc(db, 'stocks', selectedProduct.value.id), updates);
        
        notification.success('ការកំណត់តម្លៃត្រូវបានរក្សាទុកដោយជោគជ័យ');
        cancelPriceEdit(); 
    } catch (error) { notification.error('មិនអាចរក្សាទុកទិន្នន័យបានទេ'); } 
    finally { isSavingPrice.value = false; }
};

// មុខងារប្រតិបត្តិការលុបការកំណត់តម្លៃ (ហៅចេញពី Custom Modal)
const executeDeletePrice = async () => {
    if (!selectedProduct.value) return;
    
    isDeletingPrice.value = true;
    try {
        const updates = {
            retailPrice: 0, 
            retailUnit: 'bottle', 
            sellerIncentive: 0, 
            wholesaleTiers: [], 
            priceUpdatedAt: deleteField() 
        };
        await updateDoc(doc(db, 'stocks', selectedProduct.value.id), updates);
        
        notification.success('បានលុបតម្លៃចេញដោយជោគជ័យ!');
        showDeleteModal.value = false; // បិទ Modal ក្រោយជោគជ័យ
        cancelPriceEdit(); 
    } catch (error) { 
        console.error(error);
        notification.error('មានបញ្ហាក្នុងការលុបតម្លៃ'); 
    } finally { 
        isDeletingPrice.value = false; 
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
            phnomPenh: { ...deliveryForm.phnomPenh, updatedAt: new Date().toISOString() },
            provincial: { ...deliveryForm.provincial, updatedAt: new Date().toISOString() }
        }, { merge: true });

        notification.success('លក្ខខណ្ឌសេវាដឹកជញ្ជូនត្រូវបានរក្សាទុក');
    } catch (error) { notification.error("មិនអាចរក្សាទុកការកំណត់នេះបានទេ"); } 
    finally { isSavingDelivery.value = false; }
};

const formatQty = (val) => {
    if (!val) return '0';
    return Number(val).toFixed(2).replace(/\.00$/, ''); 
};

// --- GENERAL UTILS ---
const closeDropdown = (e) => { if (!e.target.closest('.relative')) showProductDropdown.value = false; };

onMounted(() => { 
    fetchProducts(); 
    document.addEventListener('click', closeDropdown); 
});

onUnmounted(() => { 
    document.removeEventListener('click', closeDropdown); 
    if (unsubscribeProducts) unsubscribeProducts(); 
});

const formatPrice = (val) => {
    if (val === undefined || val === null) return '0.00';
    return Number(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 3 }); 
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