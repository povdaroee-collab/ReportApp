<template>
  <div class="h-[100dvh] flex flex-col bg-[#F8FAFC] overflow-hidden font-khmer relative">
    
    <Teleport to="body">
      <div class="fixed top-4 right-4 z-[9999] w-full max-w-sm pointer-events-none flex flex-col gap-2">
        <div class="pointer-events-auto">
           <Toast />
        </div>
      </div>
    </Teleport>

    <div class="bg-white px-4 md:px-6 pt-3 pb-0 border-b border-slate-200/60 flex items-center gap-6 shadow-sm relative z-50 shrink-0">
        <button @click="mainTab = 'pos'" class="pb-3 text-sm font-black border-b-2 transition-all flex items-center gap-2" :class="mainTab === 'pos' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'">
           <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
           ប្រព័ន្ធបញ្ជូលការលក់ (POS)
        </button>
        <button @click="mainTab = 'today'" class="pb-3 text-sm font-black border-b-2 transition-all flex items-center gap-2" :class="mainTab === 'today' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'">
           <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
           ព័ត៌មានលក់ថ្ងៃនេះ 
           <span class="bg-rose-500 text-white text-[9px] px-1.5 py-0.5 rounded-full animate-pulse shadow-sm">Live</span>
        </button>
    </div>

    <div v-show="mainTab === 'pos'" class="flex-1 overflow-hidden flex flex-col md:flex-row relative">
        
        <div class="flex-1 flex flex-col h-full bg-[#F4F7FE] relative overflow-hidden">
            
            <div class="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 p-4 shadow-sm z-20 shrink-0">
                <div class="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div class="flex items-center gap-3 w-full md:w-auto">
                        <button @click="$router.back()" class="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors shrink-0">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                        </button>
                        <div>
                            <h1 class="text-xl font-black text-slate-800 leading-tight">ប្រព័ន្ធបញ្ជូលការលក់ (POS)</h1>
                            <p class="text-slate-500 text-[10px] font-bold uppercase tracking-wider mt-0.5">Smart Auto-Pricing POS</p>
                        </div>
                    </div>
                    
                    <div class="flex items-center gap-3 w-full md:w-auto">
                        <div class="relative w-full md:w-80">
                            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </span>
                            <input v-model="searchQuery" type="text" placeholder="ស្វែងរកទំនិញ ឬ ឈុត..." class="w-full bg-slate-100 border border-slate-200/60 rounded-xl pl-9 pr-4 py-2.5 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none transition-all shadow-inner">
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar bg-slate-50/50 relative">
                <div v-if="isLoadingProducts" class="flex flex-col items-center justify-center h-full opacity-60">
                    <div class="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-blue-600 mb-4"></div>
                    <p class="text-xs font-bold text-slate-500">កំពុងទាញយកទំនិញ និងឈុត...</p>
                </div>

                <div v-else-if="filteredProducts.length === 0" class="flex flex-col items-center justify-center h-full text-slate-400">
                    <svg class="w-16 h-16 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                    <p class="font-bold">រកមិនឃើញទំនិញទេ</p>
                </div>

                <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5 pb-20 max-w-[100rem] mx-auto">
                    <div 
                        v-for="product in filteredProducts" 
                        :key="product.id"
                        @click="addToCart(product)"
                        class="bg-white rounded-[1.25rem] p-3 border border-slate-200 shadow-sm transition-all cursor-pointer group relative flex flex-col h-full"
                        :class="getTotalRetailStock(product) > 0 ? 'hover:shadow-lg hover:border-blue-300' : 'opacity-60 cursor-not-allowed grayscale-[50%]'"
                    >
                        <div v-if="product.isCombo" class="absolute -top-2 -left-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-md z-10 flex items-center gap-1 border border-orange-200">
                            🎁 ឈុត
                        </div>

                        <div class="w-full aspect-square rounded-xl bg-slate-50 mb-3 overflow-hidden border border-slate-100 relative flex items-center justify-center shrink-0">
                            <img v-if="product.image && (product.image.startsWith('http') || product.image.startsWith('data:image'))" :src="product.image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                            <div v-else class="text-slate-300 text-3xl font-black">{{ product.name.charAt(0) }}</div>
                            
                            <div class="absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-black bg-white/95 backdrop-blur-sm border shadow-sm" :class="getTotalRetailStock(product) > 0 ? 'text-emerald-600 border-emerald-100' : 'text-rose-600 border-rose-100'">
                                ស្តុក: {{ getTotalRetailStock(product).toLocaleString() }} {{ translateHardcodedUnit(product.isCombo ? 'set' : (product.retailUnit || 'bottle')) }}
                            </div>

                            <div v-if="getTotalRetailStock(product) <= 0" class="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                                <span class="bg-rose-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-md">អស់ពីស្តុក</span>
                            </div>
                        </div>
                        
                        <div class="flex-1 flex flex-col">
                            <h3 class="font-black text-sm text-slate-800 leading-tight mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">{{ product.name }}</h3>
                            <p class="text-[9px] text-slate-400 font-mono mb-2">{{ product.barcode || 'NO-BARCODE' }}</p>
                            
                            <div class="mt-auto pt-2 border-t border-slate-100 flex flex-col gap-1.5">
                                
                                <div v-if="!product.isCombo && product.itemsPerCase && product.itemsPerCase > 1" class="text-[9px] text-slate-500 font-bold bg-slate-50 px-2 py-1 rounded border border-slate-100">
                                    <span class="text-slate-600">១{{ translateHardcodedUnit(product.unit) }} = {{ product.itemsPerCase }} {{ translateHardcodedUnit(product.retailUnit) }}</span>
                                </div>

                                <div class="flex items-end justify-between mt-1">
                                    <div class="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                        <span>1 {{ translateHardcodedUnit(product.isCombo ? 'set' : (product.retailUnit || 'bottle')) }}</span>
                                    </div>
                                    <div class="text-right">
                                        <p class="text-[15px] font-black text-indigo-600">
                                            {{ formatPrice(product.retailPrice, product.currency) }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="w-[360px] xl:w-[420px] bg-slate-50 border-l border-slate-200 shadow-[-10px_0_30px_rgba(0,0,0,0.04)] flex flex-col h-full z-30 relative shrink-0">
            
            <div class="p-4 border-b border-slate-200 flex items-center justify-between bg-white shrink-0 shadow-sm z-20">
                <div class="flex flex-col">
                    <h2 class="text-lg font-black text-slate-800 flex items-center gap-2">
                        <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                        កន្ត្រកទំនិញ
                    </h2>
                    <div v-if="timeLeft" class="mt-1 flex items-center gap-1.5 text-[10px] font-black text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-md w-fit animate-pulse">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        ផុតកំណត់ក្នុង: {{ timeLeft }}
                    </div>
                    <p v-else class="text-[9px] font-bold text-indigo-500 mt-0.5">ចំនួនខាងក្រោមគិតជាខ្នាតរាយ ឬឈុត</p>
                </div>
                <span class="bg-blue-100 text-blue-600 px-2.5 py-0.5 rounded-lg text-xs font-black border border-blue-200">{{ cart.length }}</span>
            </div>

            <div class="flex-1 overflow-y-auto custom-scrollbar p-4">
                
                <div v-if="cart.length === 0" class="h-full flex flex-col items-center justify-center text-slate-400 opacity-60 min-h-[300px]">
                    <svg class="w-20 h-20 mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                    <p class="font-bold text-sm">មិនទាន់មានទំនិញក្នុងកន្ត្រកទេ</p>
                    <p class="text-[10px] mt-1">សូមចុចលើទំនិញខាងឆ្វេងដើម្បីបញ្ជូល</p>
                </div>

                <div v-else class="block">
                    <div class="space-y-3 mb-4">
                        <div v-for="(item, index) in cart" :key="item.product.id" class="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-2 relative group hover:border-blue-400 transition-colors animate-slide-down">
                            
                            <button @click="removeFromCart(index)" class="absolute -top-2.5 -right-2.5 w-7 h-7 bg-rose-100 text-rose-600 hover:bg-rose-500 hover:text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md border-2 border-white z-10">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"/></svg>
                            </button>

                            <div class="flex justify-between items-start gap-2">
                                <div class="flex-1">
                                    <h4 class="font-bold text-sm text-slate-800 leading-tight">
                                        {{ item.product.name }}
                                        <span v-if="item.product.isCombo" class="text-[10px] text-orange-500 ml-1">🎁 ឈុត</span>
                                    </h4>
                                    <span class="inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-black border" :class="getAutoSaleType(item.product, item.qty) === 'wholesale' ? 'bg-purple-50 text-purple-600 border-purple-200' : 'bg-indigo-50 text-indigo-600 border-indigo-200'">
                                        {{ getAutoSaleType(item.product, item.qty) === 'wholesale' ? 'តម្លៃបោះដុំ' : 'តម្លៃលក់រាយ' }}
                                    </span>
                                </div>
                                <span class="text-base font-black text-emerald-600 whitespace-nowrap bg-emerald-50/50 px-2 py-1 rounded-lg border border-emerald-100 mt-0.5">
                                    {{ formatPrice(calculateItemPrice(item.product, item.qty), item.product.currency) }}
                                </span>
                            </div>

                            <div class="flex items-center justify-between mt-2 pt-3 border-t border-slate-100">
                                <div class="text-[11px] font-bold text-slate-500">
                                    {{ formatPrice(calculateItemUnitPrice(item.product, item.qty), item.product.currency) }} <span class="opacity-70">/ 1 {{ translateHardcodedUnit(item.product.isCombo ? 'set' : (item.product.retailUnit || 'bottle')) }}</span>
                                </div>
                                
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
                        <div class="flex justify-between items-end mb-4">
                            <span class="text-sm font-black text-slate-500 uppercase tracking-widest">សរុបប្រាក់ (Total)</span>
                            <span class="text-3xl font-black text-emerald-600 leading-none">{{ formatPrice(cartTotalUSD, 'USD') }}</span>
                        </div>

                        <button 
                            @click="openCheckoutModal"
                            :disabled="cart.length === 0"
                            class="w-full py-4 rounded-xl font-black text-base shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                        >
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                            បន្តការទូទាត់ប្រាក់
                        </button>
                    </div>
                </div>
                
            </div>
        </div>

        <TransitionRoot appear :show="isCheckoutModalOpen" as="template">
            <Dialog as="div" @close="closeCheckoutModal" class="relative z-[9999]" @click="closeDropdowns">
                <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
                    <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />
                </TransitionChild>

                <div class="fixed inset-0 overflow-y-auto custom-scrollbar">
                    <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-6">
                        <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95 translate-y-4" enter-to="opacity-100 scale-100 translate-y-0" leave="duration-200 ease-in" leave-from="opacity-100 scale-100 translate-y-0" leave-to="opacity-0 scale-95 translate-y-4">
                            <DialogPanel class="w-full max-w-2xl transform bg-white text-left align-middle shadow-2xl transition-all font-khmer rounded-[24px] flex flex-col" @click.stop>
                                
                                <div class="px-6 py-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between shrink-0 rounded-t-[24px]">
                                    <DialogTitle as="h3" class="text-xl font-black text-slate-800 flex items-center gap-2">
                                        បញ្ជាក់ការទូទាត់ទំនិញ
                                    </DialogTitle>
                                    <button @click="closeCheckoutModal" class="p-2 rounded-full hover:bg-slate-200 text-slate-400 transition-colors focus:outline-none bg-white shadow-sm border border-slate-200">
                                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                                
                                <div class="p-6 overflow-y-visible space-y-6">
                                    
                                    <div class="relative z-[60]">
                                        <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">តំណាងលក់ (SELLER) <span class="text-rose-500">*</span></label>
                                        
                                        <div class="relative">
                                            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                            </div>
                                            <input 
                                                type="text" 
                                                v-model="sellerSearchQuery"
                                                @focus="showSellerDropdown = true"
                                                @input="showSellerDropdown = true"
                                                placeholder="ស្វែងរកឈ្មោះ ឬ អត្តលេខ..."
                                                class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-10 py-3.5 text-slate-800 font-bold text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 outline-none transition-all shadow-inner"
                                            >
                                            <button v-if="checkoutForm.sellerId" @click.stop="clearSeller" class="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-rose-500 transition-colors">
                                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                            </button>
                                        </div>

                                        <div v-if="showSellerDropdown" class="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.15)] max-h-64 overflow-y-auto z-[100] p-2 custom-scrollbar animate-fade-in">
                                            <div v-if="filteredSellersForDropdown.length === 0" class="p-4 text-center text-xs font-bold text-slate-400">រកមិនឃើញតំណាងលក់ទេ</div>
                                            <div 
                                                v-else
                                                v-for="s in filteredSellersForDropdown" 
                                                :key="s.id"
                                                @click.stop="selectSeller(s)"
                                                class="flex items-center gap-4 p-2.5 hover:bg-blue-50 rounded-xl cursor-pointer transition-colors group"
                                            >
                                                <img :src="s.photoUrl || `https://ui-avatars.com/api/?name=${s.fullName}`" class="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-sm shrink-0">
                                                <div class="flex-1 min-w-0">
                                                    <h4 class="font-black text-sm text-slate-800 truncate group-hover:text-blue-700">{{ s.fullName }}</h4>
                                                    <p class="text-[11px] text-slate-500 font-mono mt-0.5 font-bold">ID: {{ s.idNumber || 'N/A' }}</p>
                                                </div>
                                                <div v-if="checkoutForm.sellerId === s.id" class="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center shrink-0 shadow-md">
                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-slate-100">
                                        <div>
                                            <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">ឈ្មោះអតិថិជន <span class="text-rose-500">*</span></label>
                                            <input v-model="checkoutForm.customerName" type="text" placeholder="បញ្ចូលឈ្មោះ..." class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-bold text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 outline-none transition-all">
                                        </div>
                                        <div>
                                            <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">លេខទូរស័ព្ទ <span class="text-rose-500">*</span></label>
                                            <input v-model="checkoutForm.customerPhone" type="text" placeholder="បញ្ចូលលេខ..." class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-bold text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 outline-none transition-all">
                                        </div>
                                    </div>

                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 z-[50]">
                                        <div class="relative">
                                            <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">ខេត្ត/ក្រុង <span class="text-rose-500">*</span></label>
                                            <input 
                                                type="text" 
                                                v-model="provinceSearch"
                                                @focus="showProvinceDropdown = true"
                                                @input="handleProvinceInput"
                                                placeholder="ជ្រើសរើសខេត្ត/ក្រុង..."
                                                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-bold text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 outline-none transition-all"
                                            >
                                            <svg class="w-4 h-4 absolute right-4 top-[38px] text-slate-400 pointer-events-none transition-transform" :class="{'rotate-180': showProvinceDropdown}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                                            
                                            <div v-if="showProvinceDropdown" class="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto z-[100] p-1 custom-scrollbar animate-fade-in">
                                                <div v-if="filteredProvinces.length === 0" class="p-3 text-center text-xs text-slate-400 font-bold">រកមិនឃើញទិន្នន័យ</div>
                                                <div 
                                                    v-else
                                                    v-for="prov in filteredProvinces" 
                                                    :key="prov"
                                                    @click.stop="selectProvince(prov)"
                                                    class="px-3 py-2 hover:bg-blue-50 rounded-lg cursor-pointer text-sm font-bold text-slate-700 transition-colors"
                                                >
                                                    {{ prov }}
                                                </div>
                                            </div>
                                        </div>

                                        <div class="relative">
                                            <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2" :class="!checkoutForm.province ? 'opacity-50' : ''">សាខាទទួលអីវ៉ាន់ (ស្រុក/ខណ្ឌ/ឃុំ) <span class="text-rose-500">*</span></label>
                                            <input 
                                                type="text" 
                                                v-model="checkoutForm.district"
                                                @focus="showDistrictDropdown = true"
                                                @input="showDistrictDropdown = true"
                                                :disabled="!checkoutForm.province"
                                                :placeholder="!checkoutForm.province ? 'សូមរើសខេត្តសិន...' : 'វាយបញ្ចូល ឬរើស...'"
                                                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-bold text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 outline-none transition-all disabled:bg-slate-100 disabled:cursor-not-allowed"
                                            >
                                            
                                            <div v-if="showDistrictDropdown && checkoutForm.province && filteredDistricts.length > 0" class="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto z-[100] p-1 custom-scrollbar animate-fade-in">
                                                <div 
                                                    v-for="dist in filteredDistricts" 
                                                    :key="dist"
                                                    @click.stop="selectDistrict(dist)"
                                                    class="px-3 py-2 hover:bg-blue-50 rounded-lg cursor-pointer text-sm font-bold text-slate-700 transition-colors"
                                                >
                                                    {{ dist }}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                                        <div>
                                            <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">កាលបរិច្ឆេទ</label>
                                            <input v-model="checkoutForm.date" type="datetime-local" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-bold text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 outline-none cursor-pointer transition-all">
                                        </div>
                                        <div>
                                            <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">ការបង់ប្រាក់</label>
                                            <div class="relative">
                                                <select v-model="checkoutForm.paymentMethod" class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-3 text-slate-800 font-bold text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 outline-none appearance-none cursor-pointer transition-all">
                                                    <option value="CASH">សាច់ប្រាក់ (CASH)</option>
                                                    <option value="KHQR">វេរប្រាក់ (KHQR)</option>
                                                </select>
                                                <svg class="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div v-if="checkoutForm.paymentMethod === 'KHQR'" class="pt-2 animate-fade-in">
                                        <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">រូបភាពវិក្កយបត្រវេរប្រាក់ (ជម្រើស)</label>
                                        <div class="flex items-center gap-4">
                                            <div class="relative shrink-0">
                                                <input type="file" accept="image/*" @change="handlePaymentImageUpload" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10">
                                                <div class="w-20 h-20 bg-slate-50 border-2 border-dashed border-slate-300 hover:border-indigo-400 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:text-indigo-500 transition-colors">
                                                    <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                                                    <span class="text-[9px] font-bold">Upload</span>
                                                </div>
                                            </div>
                                            <div v-if="checkoutForm.paymentImage" class="relative w-20 h-20 rounded-xl border border-slate-200 shadow-sm overflow-hidden group">
                                                <img :src="checkoutForm.paymentImage" class="w-full h-full object-cover">
                                                <button @click.stop="checkoutForm.paymentImage = ''" class="absolute top-1 right-1 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                                                </button>
                                            </div>
                                            <div v-if="isCompressing" class="text-[11px] font-bold text-indigo-500 flex items-center gap-2">
                                                <svg class="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> កំពុងបង្រួមរូបភាព...
                                            </div>
                                        </div>
                                    </div>

                                    <div class="pt-2">
                                        <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">ចំណាំបញ្ជាក់ការទូទាត់ (Payment Note)</label>
                                        <input 
                                            v-model="checkoutForm.paymentNote" 
                                            type="text" 
                                            list="payment-notes"
                                            placeholder="ឧ. បានទូទាត់រួច, នៅខ្វះ..." 
                                            class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-bold text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 outline-none transition-all"
                                        >
                                        <datalist id="payment-notes">
                                            <option value="បានទូទាត់រួច"></option>
                                            <option value="មិនទាន់ទូទាត់"></option>
                                            <option value="កក់ប្រាក់ខ្លះ"></option>
                                            <option value="បង់ពេលឥវ៉ាន់ដល់"></option>
                                        </datalist>
                                    </div>

                                    <div class="bg-slate-800 text-white rounded-[1.25rem] p-5 mt-4 shadow-lg border border-slate-700 relative overflow-hidden">
                                        <div class="flex justify-between items-center mb-2">
                                            <span class="text-sm font-bold text-slate-300">ទំនិញសរុប:</span>
                                            <span class="text-sm font-black bg-white/10 px-2 py-1 rounded-lg">{{ cart.length }} មុខ</span>
                                        </div>
                                        <div class="flex justify-between items-end border-t border-white/10 pt-3">
                                            <span class="text-xs font-black uppercase tracking-widest text-slate-400">ទឹកប្រាក់សរុប (Total)</span>
                                            <span class="text-3xl font-black text-emerald-400">{{ formatPrice(cartTotalUSD, 'USD') }}</span>
                                        </div>
                                    </div>

                                </div>

                                <div class="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 shrink-0 rounded-b-[24px]">
                                    <button type="button" @click="closeCheckoutModal" class="px-6 py-3 rounded-xl font-bold text-slate-600 bg-white border border-slate-300 hover:bg-slate-100 transition-colors text-sm">បោះបង់</button>
                                    
                                    <button type="button" @click="submitSale" :disabled="isSubmitting" class="px-8 py-3 rounded-xl font-black text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/30 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2 text-sm">
                                        <svg v-if="isSubmitting" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                                        បញ្ជាក់ការទូទាត់
                                    </button>
                                </div>

                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </TransitionRoot>

        <TransitionRoot appear :show="isSuccessModalOpen" as="template">
            <Dialog as="div" @close="closeSuccessModal" class="relative z-[99999]">
                <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
                    <div class="fixed inset-0 bg-slate-900/80 backdrop-blur-sm" />
                </TransitionChild>

                <div class="fixed inset-0 overflow-y-auto">
                    <div class="flex min-h-full items-center justify-center p-4 text-center">
                        <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95 translate-y-4" enter-to="opacity-100 scale-100 translate-y-0" leave="duration-200 ease-in" leave-from="opacity-100 scale-100 translate-y-0" leave-to="opacity-0 scale-95 translate-y-4">
                            <DialogPanel class="w-full max-w-lg transform overflow-hidden rounded-[2rem] bg-white text-center align-middle shadow-2xl transition-all p-8 flex flex-col items-center">
                                
                                <div class="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-4 shadow-inner border-[6px] border-emerald-50">
                                    <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                                </div>
                                
                                <h3 class="text-2xl font-black text-slate-800 mb-1">ទូទាត់ជោគជ័យ!</h3>
                                <p class="text-slate-500 font-bold mb-6 text-sm">ទិន្នន័យលក់ត្រូវបានរក្សាទុកក្នុងប្រព័ន្ធរួចរាល់។</p>

                                <div class="w-full grid grid-cols-2 gap-3 mb-6">
                                    <button @click="printInvoice" class="col-span-2 py-3 rounded-xl font-black text-sm bg-slate-800 hover:bg-slate-900 text-white shadow-md transition-all active:scale-95 flex justify-center items-center gap-2">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                                        បោះពុម្ពវិក្កយបត្រ (Print)
                                    </button>

                                    <button @click="downloadPDF" class="py-3 rounded-xl font-black text-sm bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition-all active:scale-95 flex flex-col justify-center items-center gap-1">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                        រក្សាទុកជា PDF
                                    </button>

                                    <button @click="shareToTelegramApp" class="py-3 rounded-xl font-black text-sm bg-[#eaf4ff] text-[#0088cc] hover:bg-[#dbeafe] border border-[#bae6fd] transition-all active:scale-95 flex flex-col justify-center items-center gap-1">
                                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.48-.94-2.4-1.54-1.06-.7-.37-1.09.23-1.72.16-.16 2.87-2.63 2.92-2.85.01-.03.01-.14-.06-.2-.06-.06-.17-.04-.25-.02-.11.02-1.91 1.2-5.39 3.55-.5.34-.95.51-1.35.5-.44-.01-1.29-.25-1.92-.42-.77-.21-1.37-.32-1.31-.68.03-.18.28-.37.76-.56 3.03-1.32 5.06-2.19 6.09-2.62 2.93-1.21 3.53-1.43 3.93-1.43.09 0 .28.01.4.04.1.03.24.1.33.25.08.16.07.32.07.33z"/></svg>
                                        Share ចូល App
                                    </button>
                                    
                                    <button @click="sendToTelegramBotGroup" :disabled="isSendingToBot" class="col-span-2 py-3 rounded-xl font-black text-sm bg-[#0088cc] hover:bg-[#0077b5] text-white shadow-md shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50 flex justify-center items-center gap-2">
                                        <svg v-if="isSendingToBot" class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.48-.94-2.4-1.54-1.06-.7-.37-1.09.23-1.72.16-.16 2.87-2.63 2.92-2.85.01-.03.01-.14-.06-.2-.06-.06-.17-.04-.25-.02-.11.02-1.91 1.2-5.39 3.55-.5.34-.95.51-1.35.5-.44-.01-1.29-.25-1.92-.42-.77-.21-1.37-.32-1.31-.68.03-.18.28-.37.76-.56 3.03-1.32 5.06-2.19 6.09-2.62 2.93-1.21 3.53-1.43 3.93-1.43.09 0 .28.01.4.04.1.03.24.1.33.25.08.16.07.32.07.33z"/></svg>
                                        Send ចូល Group (Bot)
                                    </button>
                                </div>

                                <button @click="closeSuccessModal" class="w-full py-3 rounded-xl font-bold text-sm text-slate-400 hover:bg-slate-100 transition-all">
                                    បិទ (បន្តការលក់ថ្មី)
                                </button>

                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </TransitionRoot>

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
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { db, auth } from '@/firebaseConfig';
import { collection, getDocs, addDoc, query, where, onSnapshot, doc, updateDoc, increment, setDoc, deleteDoc } from 'firebase/firestore'; 
import { onAuthStateChanged } from 'firebase/auth';
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue';
import Toast from '@/components/Toast.vue';
import { useNotificationStore } from '@/stores/notification';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

// 📦 ការ Import
import POSTodaySales from './reports/pos/POSTodaySales.vue'; 

const router = useRouter();
const notification = useNotificationStore();

// --- STATE ---
const mainTab = ref('pos'); 

// ប្ដូរពីការទុកតែ stocks មកជាលាយបញ្ចូលគ្នា
const mixedProducts = ref([]); 
const originalStocks = ref([]); 

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

// 🔥 --- NEW STATE FOR RESERVATION --- 🔥
const timeLeft = ref("");
const reservationTimer = ref(null);

// --- UTILS ---
const triggerAlert = (type, title, message) => {
    if (type === 'error') notification.error(message);
    else notification.success(message);
};

const getLocalISOString = () => {
    const tzoffset = (new Date()).getTimezoneOffset() * 60000;
    return (new Date(Date.now() - tzoffset)).toISOString().slice(0, 16);
};

const formatDate = (dateStr) => {
    if(!dateStr) return '';
    return new Intl.DateTimeFormat('km-KH', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(dateStr));
};

const formatPrice = (val, currency = 'USD') => {
    if (val === undefined || val === null) return '0.00';
    return Number(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + (currency === 'USD' ? ' $' : ' ៛');
};

const translateHardcodedUnit = (unit) => {
  const map = { bottle: 'ដប', case: 'កេះ', pack: 'កញ្ចប់', can: 'កំប៉ុង', kg: 'គីឡូ', set: 'ឈុត' };
  return map[unit] || unit;
};

// --- SMART LOCATION LOGIC ---
const locationData = { /* រក្សាទុកកូដចាស់ */
    "រាជធានីភ្នំពេញ": ["ខណ្ឌចំការមន", "ខណ្ឌដូនពេញ", "ខណ្ឌ៧មករា", "ខណ្ឌទួលគោក", "ខណ្ឌដង្កោ", "ខណ្ឌមានជ័យ", "ខណ្ឌឫស្សីកែវ", "ខណ្ឌសែនសុខ", "ខណ្ឌពោធិ៍សែនជ័យ", "ខណ្ឌជ្រោយចង្វារ", "ខណ្ឌព្រែកព្នៅ", "ខណ្ឌច្បារអំពៅ", "ខណ្ឌបឹងកេងកង", "ខណ្ឌកំបូល"],
            "ខេត្តកណ្តាល": ["ក្រុងតាខ្មៅ", "ស្រុកកណ្តាលស្ទឹង", "ស្រុកគីវីស៊ុង", "ស្រុកខ្សាច់កណ្តាល", "ស្រុកកោះធំ", "ស្រុកលើកដែក", "ស្រុកល្វាឯម", "ស្រុកមុខកំពូល", "ស្រុកអង្គស្នួល", "ស្រុកពញាឮ", "ស្រុកស្អាង"],
            "ខេត្តសៀមរាប": ["ក្រុងសៀមរាប", "ស្រុកអង្គរធំ", "ស្រុកអង្គរជុំ", "ស្រុកបន្ទាយស្រី", "ស្រុកជីក្រែង", "ស្រុកក្រឡាញ់", "ស្រុកពួក", "ស្រុកប្រាសាទបាគង", "ស្រុកស្រីស្នំ", "ស្រុកស្វាយលើ", "ស្រុកវ៉ារិន", "ស្រុកសូទ្រនិគម"],
            "ខេត្តបាត់ដំបង": ["ក្រុងបាត់ដំបង", "ស្រុកបាណន់", "ស្រុកថ្មគោល", "ស្រុកបវេល", "ស្រុកឯកភ្នំ", "ស្រុកមោងឫស្សី", "ស្រុករតនមណ្ឌល", "ស្រុកសង្កែ", "ស្រុកសំឡូត", "ស្រុកសំពៅលូន", "ស្រុកភ្នំព្រឹក", "ស្រុកកំរៀង", "ស្រុកគាស់ក្រឡ", "ស្រុករុក្ខគិរី"],
            "ខេត្តព្រះសីហនុ": ["ក្រុងព្រះសីហនុ", "ស្រុកព្រៃនប់", "ស្រុកស្ទឹងហាវ", "ស្រុកកំពង់សិលា", "ក្រុងកោះរ៉ុង"],
            "ខេត្តកំពង់ចាម": ["ក្រុងកំពង់ចាម", "ស្រុកចំការលើ", "ស្រុកជើងព្រៃ", "ស្រុកកំពង់សៀម", "ស្រុកកងមាស", "ស្រុកកោះសូទិន", "ស្រុកព្រៃឈរ", "ស្រុកស្រីសន្ធរ", "ស្រុកស្ទឹងត្រង់", "ស្រុកបាធាយ"],
            "ខេត្តត្បូងឃ្មុំ": ["ក្រុងសួង", "ស្រុកត្បូងឃ្មុំ", "ស្រុកអូររាំងឪ", "ស្រុកក្រូចឆ្មារ", "ស្រុកតំបែរ", "ស្រុកពញាក្រែក", "ស្រុកមេមត់"],
            "ខេត្តកំពង់ឆ្នាំង": ["ក្រុងកំពង់ឆ្នាំង", "ស្រុកបរិបូរណ៍", "ស្រុកជលគីរី", "ស្រុកកំពង់លែង", "ស្រុកកំពង់ត្រឡាច", "ស្រុកតួនឡីសាប", "ស្រុកសាមគ្គីមានជ័យ", "ស្រុកទឹកផុស"],
            "ខេត្តកំពង់ស្ពឺ": ["ក្រុងច្បារមន", "ស្រុកបរសេដ្ឋ", "ស្រុកគងពិសី", "ស្រុកភ្នំស្រួច", "ស្រុកឧដុង្គ", "ស្រុកសាមគ្គីមុនីជ័យ", "ស្រុកភ្នំស្រួច", "ស្រុកថ្ពង", "ស្រុកឱរ៉ាល់"],
            "ខេត្តកំពង់ធំ": ["ក្រុងស្ទឹងសែន", "ស្រុកបារាយណ៍", "ស្រុកកំពង់ស្វាយ", "ស្រុកប្រាសាទបល្ល័ង្ក", "ស្រុកប្រាសាទសំបូរ", "ស្រុកសណ្តាន់", "ស្រុកសន្ទុក", "ស្រុកស្ទោង", "ស្រុកតាំងគោក"],
            "ខេត្តកំពត": ["ក្រុងកំពត", "ស្រុកអង្គរជ័យ", "ស្រុកបន្ទាយមាស", "ស្រុកឈូក", "ស្រុកជុំគីរី", "ស្រុកដងទង់", "ស្រុកកំពង់ត្រាច", "ស្រុកទឹកឈូ"],
            "ខេត្តកែប": ["ក្រុងកែប", "ស្រុកដំណាក់ចង្អើរ"],
            "ខេត្តកោះកុង": ["ក្រុងខេមរភូមិន្ទ", "ស្រុកបូទុមសាគរ", "ស្រុកគិរីសាគរ", "ស្រុកកោះកុង", "ស្រុកមណ្ឌលសីមា", "ស្រុកស្រែអំបិល", "ស្រុកថ្មបាំង"],
            "ខេត្តក្រចេះ": ["ក្រុងក្រចេះ", "ស្រុកឆ្លូង", "ស្រុកព្រែកប្រសប់", "ស្រុកសំបូរ", "ស្រុកស្នួល", "ស្រុកចិត្តបុរី"],
            "ខេត្តមណ្ឌលគីរី": ["ក្រុងសែនមនោរម្យ", "ស្រុកកែវសីមា", "ស្រុកកោះញែក", "ស្រុកអូររាំង", "ស្រុកពេជ្រាដា"],
            "ខេត្តរតនគីរី": ["ក្រុងបានលុង", "ស្រុកអណ្តូងមាស", "ស្រុកបរកែវ", "ស្រុកកូនមុំ", "ស្រុកលំផាត់", "ស្រុកអូរជុំ", "ស្រុកអូរយ៉ាដាវ", "ស្រុកតាវែង", "ស្រុកវើនសៃ"],
            "ខេត្តស្ទឹងត្រែង": ["ក្រុងស្ទឹងត្រែង", "ស្រុកសេសាន", "ស្រុកសៀមបូក", "ស្រុកសៀមប៉ាង", "ស្រុកថាឡាបរិវ៉ាត់", "ស្រុកបុរីអូរស្វាយសែនជ័យ"],
            "ខេត្តព្រះវិហារ": ["ក្រុងព្រះវិហារ", "ស្រុកជ័យសែន", "ស្រុកឆែប", "ស្រុកជាំក្សាន្ត", "ស្រុកគូលែន", "ស្រុកភ្នំត្បែងមានជ័យ", "ស្រុកសង្គមថ្មី", "ស្រុកត្បែងមានជ័យ"],
            "ខេត្តឧត្តរមានជ័យ": ["ក្រុងសំរោង", "ស្រុកអន្លង់វែង", "ស្រុកបន្ទាយអំពិល", "ស្រុកចុងកាល់", "ស្រុកត្រពាំងប្រាសាទ"],
            "ខេត្តបន្ទាយមានជ័យ": ["ក្រុងសិរីសោភ័ណ", "ក្រុងប៉ោយប៉ែត", "ស្រុកមង្គលបុរី", "ស្រុកភ្នំស្រុក", "ស្រុកព្រះនេត្រព្រះ", "ស្រុកអូរជ្រៅ", "ស្រុកថ្មពួក", "ស្រុកស្វាយចេក", "ស្រុកម៉ាឡៃ"],
            "ខេត្តប៉ៃលិន": ["ក្រុងប៉ៃលិន", "ស្រុកសាលាក្រៅ"],
            "ខេត្តពោធិ៍សាត់": ["ក្រុងពោធិ៍សាត់", "ស្រុកបាកាន", "ស្រុកកណ្តៀង", "ស្រុកភ្នំក្រវ៉ាញ", "ស្រុកវាលវែង", "ស្រុកតាលោសែនជ័យ"],
            "ខេត្តព្រៃវែង": ["ក្រុងព្រៃវែង", "ស្រុកបាភ្នំ", "ស្រុកកំចាយមារ", "ស្រុកកញ្ជ្រៀច", "ស្រុកកោះស្រែទៀប", "ស្រុកពាមជរ", "ស្រុកពាមរ", "ស្រុកពារាំង", "ស្រុកព្រះស្តេច", "ស្រុកស្វាយអន្ទរ", "ស្រុកស៊ីធរកណ្តាល", "ស្រុកមេសាង"],
            "ខេត្តស្វាយរៀង": ["ក្រុងស្វាយរៀង", "ក្រុងបាវិត", "ស្រុកចន្ទ្រា", "ស្រុកកំពង់រោទ៍", "ស្រុក រំដួល", "ស្រុក រមាសហែក", "ស្រុក ស្វាយជ្រំ", "ស្រុក ស្វាយទាប"],
            "ខេត្តតាកែវ": ["ក្រុងដូនកែវ", "ស្រុកអង្គរបុរី", "ស្រុកបាទី", "ស្រុកបូរីជលសារ", "ស្រុកគិរីវង់", "ស្រុកកោះអណ្តែត", "ស្រុកព្រៃកប្បាស", "ស្រុកសំរោង", "ស្រុកត្រាំកក់", "ស្រុកទ្រាំង"]
};

const allProvinces = Object.keys(locationData);
const provinceSearch = ref('');
const showProvinceDropdown = ref(false);
const showDistrictDropdown = ref(false);

const filteredProvinces = computed(() => {
    if (!provinceSearch.value) return allProvinces;
    const q = provinceSearch.value.toLowerCase();
    return allProvinces.filter(p => p.toLowerCase().includes(q));
});

const filteredDistricts = computed(() => {
    if (!checkoutForm.province || !locationData[checkoutForm.province]) return [];
    if (!checkoutForm.district) return locationData[checkoutForm.province];
    const q = checkoutForm.district.toLowerCase();
    const exactMatch = locationData[checkoutForm.province].some(d => d === checkoutForm.district);
    if(exactMatch && !showDistrictDropdown.value) return locationData[checkoutForm.province];
    return locationData[checkoutForm.province].filter(d => d.toLowerCase().includes(q));
});

const handleProvinceInput = () => {
    showProvinceDropdown.value = true;
    const exactMatch = allProvinces.find(p => p.toLowerCase() === provinceSearch.value.toLowerCase());
    if (exactMatch) { selectProvince(exactMatch); } 
    else { checkoutForm.province = ''; checkoutForm.district = ''; }
};

const selectProvince = (prov) => {
    checkoutForm.province = prov;
    provinceSearch.value = prov;
    checkoutForm.district = ''; 
    showProvinceDropdown.value = false;
    setTimeout(() => { showDistrictDropdown.value = true; }, 100);
};

const selectDistrict = (dist) => { checkoutForm.district = dist; showDistrictDropdown.value = false; };

// --- FILE UPLOAD LOGIC ---
const isCompressing = ref(false);

const handlePaymentImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return notification.error('សូម Upload តែឯកសាររូបភាពប៉ុណ្ណោះ');

    isCompressing.value = true;
    try {
        checkoutForm.paymentImage = await compressImage(file, 100); 
    } catch (error) {
        notification.error('មានបញ្ហាក្នុងការ Upload រូបភាព');
    } finally {
        isCompressing.value = false;
        event.target.value = ''; 
    }
};

const compressImage = (file, targetSizeKB) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                const MAX_WIDTH = 1200;
                const MAX_HEIGHT = 1200;
                if (width > height) { if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; } } 
                else { if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; } }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                resolve(canvas.toDataURL('image/jpeg', 0.5));
            };
            img.onerror = (e) => reject(e);
        };
        reader.onerror = (e) => reject(e);
    });
};


// --- FORM STATE ---
const checkoutForm = reactive({
    sellerId: '', sellerName: '', customerName: '', customerPhone: '',
    province: '', district: '', paymentMethod: 'CASH', paymentNote: '', date: getLocalISOString(),
    paymentImage: '' 
});

const sellerSearchQuery = ref('');
const showSellerDropdown = ref(false);
const selectedSellerPhoto = ref('');

const filteredSellersForDropdown = computed(() => {
    if (!sellerSearchQuery.value) return sellers.value;
    const q = sellerSearchQuery.value.toLowerCase();
    return sellers.value.filter(s => s.fullName.toLowerCase().includes(q) || (s.idNumber && s.idNumber.toLowerCase().includes(q)));
});

const selectSeller = (seller) => {
    checkoutForm.sellerId = seller.id; checkoutForm.sellerName = seller.fullName;
    selectedSellerPhoto.value = seller.photoUrl || ''; sellerSearchQuery.value = seller.fullName;
    showSellerDropdown.value = false;
};

const clearSeller = () => {
    checkoutForm.sellerId = ''; checkoutForm.sellerName = '';
    selectedSellerPhoto.value = ''; sellerSearchQuery.value = '';
};

const closeDropdowns = () => { 
    showSellerDropdown.value = false; 
    showProvinceDropdown.value = false;
    showDistrictDropdown.value = false;
};

// --- FETCH DATA (REALTIME) រួមទាំង COMBOS ផង ---
onMounted(() => {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            try {
                // 1. ស្តាប់បម្រែបម្រួល Stocks (ទំនិញរាយ)
                const qProducts = collection(db, 'stocks');
                unsubscribeProducts = onSnapshot(qProducts, (snapshot) => {
                    originalStocks.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), isCombo: false }));
                    combineProductsAndCombos();
                });

                // 2. ស្តាប់បម្រែបម្រួល Combos (ឈុត)
                const qCombos = collection(db, 'combos');
                unsubscribeCombos = onSnapshot(qCombos, (snapshot) => {
                    const comboData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), isCombo: true }));
                    combosGlobal.value = comboData;
                    combineProductsAndCombos();
                });

                const qSellers = query(collection(db, "users"), where("role", "in", ["seller", "dealer"]), where("createdBy", "==", user.uid));
                const snapSellers = await getDocs(qSellers);
                sellers.value = snapSellers.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            } catch (error) { console.error(error); }
        } else router.push('/');
    });
});

onUnmounted(() => { 
    if (unsubscribeProducts) unsubscribeProducts(); 
    if (unsubscribeCombos) unsubscribeCombos(); 
});

const combosGlobal = ref([]);

// បញ្ចូលទំនិញធម្មតា និងឈុតចូលគ្នា
const combineProductsAndCombos = () => {
    mixedProducts.value = [...originalStocks.value, ...combosGlobal.value];
    
    // ធ្វើបច្ចុប្បន្នភាពទិន្នន័យក្នុង Cart (បើមានបម្រែបម្រួលតម្លៃ ឬឈ្មោះ)
    cart.value = cart.value.map(cartItem => {
        const updatedProduct = mixedProducts.value.find(p => p.id === cartItem.product.id);
        if (updatedProduct) { cartItem.product = updatedProduct; }
        return cartItem;
    });

    isLoadingProducts.value = false;
};

// --- SMART POS LOGIC (AUTO-PRICING & COMBO CALCULATION) ---

// គណនាស្តុកដែលអាចលក់បាន សម្រាប់ឈុត វាត្រូវផ្អែកលើស្តុកទំនិញរាយនីមួយៗ
const getTotalRetailStock = (product) => {
    if (product.isCombo) {
        // បើជាឈុត ត្រូវឆែកមើល item ទាំងអស់ក្នុងឈុត ថាតើអាចផ្សំបានប៉ុន្មានឈុត?
        if (!product.items || product.items.length === 0) return 0;
        
        let minPossibleCombos = Infinity;

        for (const item of product.items) {
            // ស្វែងរកស្តុកពិតប្រាកដរបស់ item នោះនៅក្នុង originalStocks
            const stockItem = originalStocks.value.find(s => s.id === item.productId);
            if (!stockItem) return 0; // បើមានអីវ៉ាន់ណាមួយបាត់ពីស្តុក ឈុតនេះលក់លែងបានហើយ
            
            const retailStock = (Number(stockItem.quantity) || 0) * (Number(stockItem.itemsPerCase) || 1);
            // ចំនួនឈុតដែលអាចផ្សំបាន = ស្តុករាយសរុប / ចំនួនដែលត្រូវប្រើក្នុង១ឈុត
            const possibleForThisItem = Math.floor(retailStock / item.qty);
            
            if (possibleForThisItem < minPossibleCombos) {
                minPossibleCombos = possibleForThisItem;
            }
        }
        
        return minPossibleCombos === Infinity ? 0 : minPossibleCombos;
    } else {
        // បើជាទំនិញរាយធម្មតា
        return (Number(product.quantity) || 0) * (Number(product.itemsPerCase) || 1);
    }
};

const getTierMinRetailQty = (tier, product) => {
    const minQty = Number(tier.minQty) || 0;
    if (product.isCombo) return minQty; // ឈុតគិតជារាយស្រាប់
    const perCase = Number(product.itemsPerCase) || 1;
    return tier.unit === product.unit ? minQty * perCase : minQty;
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

const getApplicableUnit = (product, qty) => {
    if(product.isCombo) return 'set';
    return product.retailUnit || 'bottle';
};

const calculateItemPrice = (product, qty) => calculateItemUnitPrice(product, qty) * qty;


// 🔥 --- HYBRID RESERVATION LOGIC --- 🔥
const startCartTimer = (expiresAt) => {
    if (reservationTimer.value) clearInterval(reservationTimer.value);
    reservationTimer.value = setInterval(async () => {
        const now = new Date().getTime();
        const distance = expiresAt - now;
        if (distance <= 0) {
            clearInterval(reservationTimer.value);
            timeLeft.value = "";
            await handleCartTimeout(); 
            return;
        }
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        timeLeft.value = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);
};

const handleCartTimeout = async () => {
    if (cart.value.length === 0) return;
    notification.warning("រយៈពេលកក់ស្តុកបានផុតកំណត់! កន្ត្រកត្រូវបានសម្អាត និងស្តុកត្រូវបានបង្វិលវិញ។");
    for (const item of cart.value) { await modifyStockReservation(item.product, -item.qty); }
    cart.value = [];
    await updateActiveCartBackend();
};

const updateActiveCartBackend = async () => {
    if (!auth.currentUser) return;
    const adminId = auth.currentUser.uid;
    const cartRef = doc(db, 'active_carts', adminId);

    if (cart.value.length === 0) {
        await deleteDoc(cartRef).catch(e => {});
        clearInterval(reservationTimer.value);
        timeLeft.value = "";
        return;
    }
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000).getTime();
    await setDoc(cartRef, {
        uid: adminId,
        items: cart.value.map(item => ({ id: item.product.id, qty: item.qty })),
        expiresAt: expiresAt,
        status: "PENDING"
    }, { merge: true });

    startCartTimer(expiresAt);
};

// កែប្រែឱ្យ Support ការកាត់ស្តុករបស់ ឈុត (Combo)
const modifyStockReservation = async (product, qtyDelta) => {
    try {
        if (product.isCombo) {
            // បើជាឈុត ត្រូវ Loop ទៅកាត់/បង្វិលស្តុក គ្រប់ item ដែលមានក្នុងឈុតនោះ
            for (const subItem of product.items) {
                const stockRef = doc(db, 'stocks', subItem.productId);
                
                // ត្រូវរក itemsPerCase របស់ទំនិញដើម ដើម្បីបំបែកខ្នាតកេះ ឱ្យត្រូវ
                const originalStock = originalStocks.value.find(s => s.id === subItem.productId);
                const perCase = originalStock ? (Number(originalStock.itemsPerCase) || 1) : 1;
                
                // ចំនួនសរុបរាយដែលត្រូវកាត់ = (ចំនួនដែលប្រើក្នុង១ឈុត * ចំនួនឈុត)
                const totalRetailQtyDelta = subItem.qty * qtyDelta;
                const bulkQtyDelta = totalRetailQtyDelta / perCase; // បម្លែងទៅជាកេះក្នុង DB

                await updateDoc(stockRef, {
                    quantity: increment(-bulkQtyDelta),
                    stock_reserved: increment(bulkQtyDelta)
                });
            }
        } else {
            // បើជាទំនិញធម្មតា កាត់ធម្មតា
            const stockRef = doc(db, 'stocks', product.id);
            const perCase = Number(product.itemsPerCase) || 1;
            const bulkQtyDelta = qtyDelta / perCase; 

            await updateDoc(stockRef, {
                quantity: increment(-bulkQtyDelta),
                stock_reserved: increment(bulkQtyDelta)
            });
        }
    } catch (e) {
        console.error("Error updating stock reservation", e);
    }
};

const addToCart = async (product) => {
    const maxStock = getTotalRetailStock(product);
    if (maxStock <= 0) return notification.error("សុំទោស ទំនិញនេះអស់ពីស្តុកហើយ!");

    const existingIndex = cart.value.findIndex(item => item.product.id === product.id);
    
    if (existingIndex !== -1) {
        if (1 > maxStock) return notification.error(`ស្តុកមានត្រឹមតែ ${maxStock} បន្ថែមទៀតប៉ុណ្ណោះ`);
        cart.value[existingIndex].qty += 1;
    } else {
        if (1 > maxStock) return notification.error(`ស្តុកមានត្រឹមតែ ${maxStock} ប៉ុណ្ណោះ`);
        cart.value.push({ product: product, qty: 1 });
    }

    await modifyStockReservation(product, 1);
    await updateActiveCartBackend();
};

const updateQty = async (index, delta) => {
    const item = cart.value[index];
    const maxStock = getTotalRetailStock(item.product);
    const newQty = item.qty + delta;

    if (newQty > 0) {
        if (delta > 0 && delta > maxStock) return notification.error(`ស្តុកមានត្រឹមតែ ${maxStock} បន្ថែមទៀតប៉ុណ្ណោះ`);
        item.qty = newQty;
        await modifyStockReservation(item.product, delta);
        await updateActiveCartBackend();
    } else {
        await removeFromCart(index);
    }
};

const setQty = async (index, newQtyStr) => {
    let newQty = parseInt(newQtyStr);
    if (isNaN(newQty) || newQty < 1) newQty = 1;

    const item = cart.value[index];
    const oldQty = item.qty;
    const delta = newQty - oldQty;

    if (delta === 0) return;

    const maxStock = getTotalRetailStock(item.product);
    
    if (delta > 0 && delta > maxStock) {
        notification.error(`ស្តុកមានត្រឹមតែ ${maxStock} បន្ថែមទៀតប៉ុណ្ណោះ`);
        item.qty = oldQty + maxStock; 
        if (maxStock > 0) {
            await modifyStockReservation(item.product, maxStock);
            await updateActiveCartBackend();
        }
        return;
    }

    item.qty = newQty;
    await modifyStockReservation(item.product, delta);
    await updateActiveCartBackend();
};

const removeFromCart = async (index) => {
    const item = cart.value[index];
    const qtyToReturn = item.qty;
    cart.value.splice(index, 1);
    await modifyStockReservation(item.product, -qtyToReturn); 
    await updateActiveCartBackend();
};

const cartTotalUSD = computed(() => cart.value.reduce((total, item) => total + calculateItemPrice(item.product, item.qty), 0));

const openCheckoutModal = () => { if (cart.value.length > 0) isCheckoutModalOpen.value = true; };
const closeCheckoutModal = () => { isCheckoutModalOpen.value = false; };

// --- CHECKOUT SAVE ---
const submitSale = async () => {
    if (!checkoutForm.sellerId) return notification.error("សូមជ្រើសរើសតំណាងលក់!");
    if (!checkoutForm.customerName) return notification.error("សូមបញ្ចូលឈ្មោះអតិថិជន!");
    if (!checkoutForm.customerPhone) return notification.error("សូមបញ្ចូលលេខទូរស័ព្ទ!");
    if (!checkoutForm.province) return notification.error("សូមជ្រើសរើសខេត្ត/ក្រុង!");
    if (!checkoutForm.district) return notification.error("សូមបញ្ចូលសាខាទទួលអីវ៉ាន់!");
    
    isSubmitting.value = true;
    try {
        const adminId = auth.currentUser.uid;
        const finalDate = new Date(checkoutForm.date).toISOString();
        const receiptCode = `INV-${Date.now().toString().slice(-6)}`;
        const combinedLocation = `${checkoutForm.district}, ${checkoutForm.province}`;

        const itemsToSave = cart.value.map((item, index) => ({
            id: item.product.id,
            cartItemId: `${item.product.id}_${Date.now()}_${index}`,
            name: item.product.name,
            image: item.product.image || '',
            price: calculateItemUnitPrice(item.product, item.qty),
            qty: item.qty,
            type: getAutoSaleType(item.product, item.qty), 
            unit: getApplicableUnit(item.product, item.qty),
            isCombo: Boolean(item.product.isCombo),
            cost: item.product.isCombo ? item.product.totalBaseCost : (Number(item.product.unitCost)/Number(item.product.itemsPerCase || 1)) // រក្សាទុកថ្លៃដើមសម្រាប់វិភាគ
        }));

        const payload = {
            receiptId: receiptCode, createdAt: finalDate, createdBy: adminId,
            uid: checkoutForm.sellerId, sellerName: checkoutForm.sellerName,
            customerName: checkoutForm.customerName, customerPhone: checkoutForm.customerPhone,
            location: combinedLocation, province: checkoutForm.province, district: checkoutForm.district,
            paymentMethod: checkoutForm.paymentMethod, paymentNote: checkoutForm.paymentNote || '',
            paymentImage: checkoutForm.paymentImage || '', 
            paymentStatus: 'PAID', totalAmount: cartTotalUSD.value, currency: 'USD',
            items: itemsToSave
        };

        const docRef = await addDoc(collection(db, 'sales_reports'), payload);
        lastSavedSale.value = { id: docRef.id, ...payload };

        // 🔥 លុប Field stock_reserved ចោល (ព្រោះ quantity ត្រូវបានកាត់តាំងពីពេលកក់ម៉្លេះ)
        for (const item of cart.value) {
            if (item.product.isCombo) {
                for (const subItem of item.product.items) {
                    const productRef = doc(db, 'stocks', subItem.productId);
                    const originalStock = originalStocks.value.find(s => s.id === subItem.productId);
                    const perCase = originalStock ? (Number(originalStock.itemsPerCase) || 1) : 1;
                    
                    const totalRetailQtyDelta = subItem.qty * item.qty;
                    await updateDoc(productRef, { 
                        stock_reserved: increment(-(totalRetailQtyDelta / perCase)) 
                    });
                }
            } else {
                const productRef = doc(db, 'stocks', item.product.id);
                const perCase = Number(item.product.itemsPerCase) || 1;
                await updateDoc(productRef, { 
                    stock_reserved: increment(-(item.qty / perCase)) 
                });
            }
        }

        await deleteDoc(doc(db, 'active_carts', adminId)).catch(e => {});

        clearInterval(reservationTimer.value);
        timeLeft.value = "";
        
        isCheckoutModalOpen.value = false;
        isSuccessModalOpen.value = true;

    } catch (error) { notification.error("មានបញ្ហាក្នុងការរក្សាទុកទិន្នន័យ"); } 
    finally { isSubmitting.value = false; }
};

const closeSuccessModal = () => {
    cart.value = [];
    checkoutForm.customerName = ''; checkoutForm.customerPhone = '';
    checkoutForm.province = ''; checkoutForm.district = ''; checkoutForm.paymentNote = '';
    checkoutForm.paymentImage = ''; 
    provinceSearch.value = '';
    checkoutForm.date = getLocalISOString();
    clearSeller();
    isSuccessModalOpen.value = false;
    lastSavedSale.value = null;
    mainTab.value = 'today'; 
};

// --- TELEGRAM & PRINT LOGIC ---
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
        const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
        const chatId = import.meta.env.VITE_TELEGRAM_GROUP_ID;
        if (!botToken || !chatId) return notification.error("សូមកំណត់ Bot Token និង Group ID នៅក្នុង File .env");

        const textResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: decodeURIComponent(generateTelegramText()), parse_mode: 'Markdown' })
        });
        
        if (textResponse.ok) {
            notification.success("បានផ្ញើទៅកាន់ Telegram ជោគជ័យ!");
            
            if (lastSavedSale.value && lastSavedSale.value.paymentMethod === 'KHQR' && lastSavedSale.value.paymentImage) {
                 const base64Data = lastSavedSale.value.paymentImage.split(',')[1];
                 const byteCharacters = atob(base64Data);
                 const byteNumbers = new Array(byteCharacters.length);
                 for (let i = 0; i < byteCharacters.length; i++) {
                     byteNumbers[i] = byteCharacters.charCodeAt(i);
                 }
                 const byteArray = new Uint8Array(byteNumbers);
                 const blob = new Blob([byteArray], {type: 'image/jpeg'});

                 const formData = new FormData();
                 formData.append('chat_id', chatId);
                 formData.append('photo', blob, 'payment_receipt.jpg');
                 formData.append('caption', `👆 វិក្កយបត្រវេរប្រាក់សម្រាប់: ${lastSavedSale.value.receiptId}`);

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
        itemsHTML += `
            <tr style="border-bottom: 1px dashed #e2e8f0;">
                <td style="padding: 12px 10px; text-align: center; color: #64748b; font-family: 'Battambong', sans-serif;">${index + 1}</td>
                <td style="padding: 12px 10px; font-weight: bold; color: #1e293b; font-family: 'Battambong', sans-serif;">${item.name} <span style="font-size: 10px; color: #94a3b8;">${item.isCombo ? '(ឈុត)' : `(${item.type === 'wholesale' ? 'ដុំ' : 'រាយ'})`}</span></td>
                <td style="padding: 12px 10px; text-align: center; font-family: 'Battambong', sans-serif;">${item.qty} ${translateHardcodedUnit(item.unit)}</td>
                <td style="padding: 12px 10px; text-align: right; font-family: 'Battambong', sans-serif;">${formatPrice(item.price, 'USD')}</td>
                <td style="padding: 12px 10px; text-align: right; font-weight: bold; font-family: 'Battambong', sans-serif;">${formatPrice(item.price * item.qty, 'USD')}</td>
            </tr>`;
    });

    return `
        <div class="print-page" style="width: 148mm; min-height: 210mm; background: white; padding: 15mm; font-family: 'Battambong', sans-serif; color: #0f172a; box-sizing: border-box; margin: 0 auto; position: relative;">
            <div style="text-align: center; border-bottom: 2px solid #cbd5e1; padding-bottom: 15px; margin-bottom: 20px;">
                <h2 style="margin: 0; font-size: 26px; font-weight: 900;">វិក្កយបត្រ (INVOICE)</h2>
            </div>
            <table style="width: 100%; font-size: 13px; margin-bottom: 25px; border: none;">
                <tr>
                    <td style="width: 50%; vertical-align: top; line-height: 1.8;">
                        <div><strong>អតិថិជន:</strong> ${sale.customerName}</div>
                        <div style="color: #475569;"><strong>ទូរស័ព្ទ:</strong> ${sale.customerPhone}</div>
                        <div style="color: #475569;"><strong>ទីតាំង:</strong> ${sale.location}</div>
                    </td>
                    <td style="width: 50%; vertical-align: top; text-align: right; line-height: 1.8;">
                        <div><strong>លេខ:</strong> ${sale.receiptId}</div>
                        <div style="color: #475569;"><strong>កាលបរិច្ឆេទ:</strong> ${formatDate(sale.createdAt)}</div>
                        <div style="color: #475569;"><strong>អ្នកលក់:</strong> ${sale.sellerName}</div>
                    </td>
                </tr>
            </table>
            <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 30px;">
                <thead style="background: #f1f5f9; border-top: 2px solid #94a3b8; border-bottom: 2px solid #94a3b8;">
                    <tr><th style="padding: 12px 10px;">#</th><th style="padding: 12px 10px; text-align: left;">បរិយាយទំនិញ</th><th style="padding: 12px 10px;">ចំនួន</th><th style="padding: 12px 10px; text-align: right;">តម្លៃឯកតា</th><th style="padding: 12px 10px; text-align: right;">សរុប</th></tr>
                </thead>
                <tbody>${itemsHTML}</tbody>
            </table>
            <table style="width: 100%; border: none; margin-top: 20px;">
                <tr>
                    <td style="width: 50%; vertical-align: top;">
                        <div style="font-size: 12px; color: #64748b; margin-bottom: 10px;">ការបង់ប្រាក់: <strong>${sale.paymentMethod}</strong></div>
                        ${sale.paymentNote ? `<div style="background: #f8fafc; padding: 10px; border-left: 3px solid #059669; border-radius: 4px; font-size: 12px;"><strong>ចំណាំ:</strong> ${sale.paymentNote}</div>` : ''}
                    </td>
                    <td style="width: 50%; vertical-align: bottom; text-align: right;">
                        <div style="border-top: 2px solid #cbd5e1; padding-top: 15px; display: inline-block; min-width: 200px;">
                            <div style="font-size: 20px; font-weight: 900;"><span style="font-size: 14px; color: #64748b; margin-right: 15px;">សរុបរួម:</span><span style="color: #059669;">${formatPrice(sale.totalAmount, 'USD')}</span></div>
                        </div>
                    </td>
                </tr>
            </table>
            <div style="position: absolute; bottom: 15mm; left: 15mm; right: 15mm; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px dashed #e2e8f0; padding-top: 15px;">
                <p style="margin: 0; font-weight: bold;">សូមអរគុណសម្រាប់ការគាំទ្រ!</p>
                <p style="margin: 4px 0 0 0;">ទំនិញដែលទិញរួចមិនអាចដូរវិញបានទេ</p>
            </div>
        </div>`;
};

const printInvoice = () => {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute'; iframe.style.width = '0'; iframe.style.height = '0'; iframe.style.border = 'none';
    document.body.appendChild(iframe);
    iframe.contentWindow.document.open();
    iframe.contentWindow.document.write(`<html><head><title>Invoice</title><link href="https://fonts.googleapis.com/css2?family=Battambong:wght@400;700;900&display=swap" rel="stylesheet"><style>@page { size: A5 portrait; margin: 0; } body { font-family: 'Battambong', sans-serif; margin: 0; padding: 0; background-color: white; display: flex; justify-content: center; }</style></head><body>${generateInvoiceHTML()}</body></html>`);
    iframe.contentWindow.document.close();
    iframe.contentWindow.document.fonts.ready.then(() => {
        iframe.contentWindow.focus(); iframe.contentWindow.print();
        setTimeout(() => { document.body.removeChild(iframe); closeSuccessModal(); }, 1000);
    });
};

const downloadPDF = async () => {
    printStaging.value.innerHTML = generateInvoiceHTML();
    await nextTick(); await document.fonts.ready; await new Promise(r => setTimeout(r, 500)); 
    const canvas = await html2canvas(printStaging.value.querySelector('.print-page'), { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const pdf = new jsPDF('p', 'mm', 'a5'); 
    const propsImg = pdf.getImageProperties(imgData);
    pdf.addImage(imgData, 'JPEG', 0, 0, 148, (propsImg.height * 148) / propsImg.width);
    pdf.save(`Invoice_${lastSavedSale.value.receiptId}.pdf`);
    printStaging.value.innerHTML = '';
    closeSuccessModal();
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