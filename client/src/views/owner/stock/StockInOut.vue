<template>
    <div class="max-w-6xl mx-auto animate-fade-in space-y-6 pb-32 font-khmer">
        
        <div class="relative z-20 bg-neutral-800/50 border border-neutral-700/50 rounded-2xl p-6 shadow-2xl backdrop-blur-sm">
            
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 border-b border-neutral-700/80 pb-4">
                <div class="bg-neutral-900 p-1 rounded-xl flex border border-neutral-700 w-full sm:w-auto">
                    <button @click="mode = 'IN'" :class="mode === 'IN' ? 'bg-emerald-500/20 text-emerald-400 font-black shadow-sm' : 'text-neutral-400 hover:text-white'" class="flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm transition-all flex items-center justify-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M7 11l5-5m0 0l5 5m-5-5v12"></path></svg>
                        នាំចូលស្តុក (IN)
                    </button>
                    <button @click="mode = 'OUT'" :class="mode === 'OUT' ? 'bg-rose-500/20 text-rose-400 font-black shadow-sm' : 'text-neutral-400 hover:text-white'" class="flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm transition-all flex items-center justify-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 13l-5 5m0 0l-5-5m5 5V6"></path></svg>
                        ដកស្តុកចេញ (OUT)
                    </button>
                </div>
                <p class="text-xs font-bold text-neutral-500">ជ្រើសរើសទំនិញដើម្បីធ្វើបច្ចុប្បន្នភាព</p>
            </div>

            <div class="relative mb-8 z-[100]" v-click-outside="closeDropdown">
                <label class="block text-xs font-bold text-amber-500 mb-2 uppercase tracking-wider">ស្វែងរកទំនិញដែលមានស្រាប់</label>
                <div class="relative group">
                    <span class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-amber-500 transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </span>
                    <input 
                        v-model="searchQuery" 
                        @focus="showDropdown = true"
                        type="text" 
                        placeholder="វាយឈ្មោះទំនិញ ឬ លេខ Barcode ដើម្បីស្វែងរក..." 
                        class="w-full bg-neutral-900 border border-neutral-600 rounded-xl pl-12 pr-12 py-3.5 text-white font-bold focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all shadow-inner"
                    >
                    <button v-if="selectedProduct" @click="clearSelection" class="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-500 hover:text-rose-400 transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12"></path></svg>
                    </button>
                </div>
                
                <transition name="fade">
                    <div v-if="showDropdown && filteredProducts.length > 0" class="absolute left-0 right-0 mt-2 bg-neutral-800 border border-neutral-500 shadow-2xl shadow-black/60 rounded-xl max-h-72 overflow-y-auto custom-scrollbar p-2 z-[999]">
                        <div 
                            v-for="prod in filteredProducts" :key="prod.id" 
                            @click="selectProduct(prod)"
                            class="flex items-center gap-4 p-3 hover:bg-neutral-700 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-neutral-500 group"
                        >
                            <img :src="prod.image || 'https://via.placeholder.com/150'" class="w-12 h-12 rounded-lg object-cover border border-neutral-600 shrink-0 bg-neutral-900">
                            <div class="flex-1">
                                <h4 class="font-black text-sm text-white leading-tight mb-1 group-hover:text-amber-400 transition-colors">{{ prod.name }}</h4>
                                <div class="flex flex-wrap items-center gap-3 text-[11px] text-neutral-400 font-mono">
                                    <span class="bg-neutral-900 px-2 py-0.5 rounded text-neutral-300 border border-neutral-700">{{ prod.barcode || 'N/A' }}</span>
                                    <span>ស្តុកបច្ចុប្បន្ន: <span class="text-emerald-400 font-bold text-xs">{{ formatQty(prod.quantity) }} {{ translateUnit(prod.unit) }}</span></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </transition>
            </div>

            <div v-if="selectedProduct" class="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-slide-up relative z-10">
                
                <div class="lg:col-span-4 xl:col-span-3 bg-neutral-900 rounded-2xl p-5 border border-neutral-700 flex flex-col items-center text-center shadow-inner">
                    <img :src="selectedProduct.image || 'https://via.placeholder.com/150'" class="w-28 h-28 rounded-xl object-cover border-2 border-neutral-700 mb-4 shadow-md bg-neutral-800">
                    <h3 class="font-black text-white text-base leading-tight mb-4">{{ selectedProduct.name }}</h3>
                    
                    <div class="w-full space-y-2">
                        <div class="bg-neutral-800 px-4 py-2.5 rounded-xl border border-neutral-700/80 flex justify-between items-center">
                            <span class="text-[11px] text-neutral-400 uppercase font-bold">ស្តុកបច្ចុប្បន្ន</span>
                            <span class="font-black text-amber-400 text-base">
                                {{ formatQty(selectedProduct.quantity) }} <span class="text-xs">{{ translateUnit(selectedProduct.unit) }}</span>
                            </span>
                        </div>
                        <div class="bg-neutral-800 px-4 py-2.5 rounded-xl border border-neutral-700/80 flex justify-between items-center">
                            <span class="text-[11px] text-neutral-400 uppercase font-bold">ថ្លៃដើម (Cost)</span>
                            <span class="font-black text-emerald-400 text-base">
                                {{ formatPrice(selectedProduct.unitCost) }}{{ selectedProduct.currency === 'USD' ? '$' : '៛' }}
                            </span>
                        </div>
                    </div>
                </div>

                <form @submit.prevent="submitTransaction" class="lg:col-span-8 xl:col-span-9 bg-neutral-900 rounded-2xl p-5 md:p-6 border border-neutral-700 shadow-inner">
                    
                    <div class="flex items-center gap-3 mb-6 pb-4 border-b border-neutral-800">
                        <div class="w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl shadow-sm" :class="mode === 'IN' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'">
                            {{ mode === 'IN' ? '📥' : '📤' }}
                        </div>
                        <div>
                            <h4 class="font-black text-base uppercase tracking-wider" :class="mode === 'IN' ? 'text-emerald-400' : 'text-rose-400'">
                                {{ mode === 'IN' ? 'បញ្ចូលស្តុកថ្មី (STOCK IN)' : 'ដកស្តុកចេញ (STOCK OUT / LOSS)' }}
                            </h4>
                            <p class="text-[11px] text-neutral-500">{{ mode === 'IN' ? 'បន្ថែមចំនួន និងធ្វើបច្ចុប្បន្នភាពតម្លៃទុន' : 'ដកទំនិញខូចគុណភាព ឬបាត់បង់' }}</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                        
                        <div>
                            <label class="block text-[11px] font-black text-neutral-300 mb-1.5">
                                ចំនួនដែល{{ mode === 'IN' ? 'បញ្ជូល' : 'ដកចេញ' }} <span class="text-rose-500">*</span>
                            </label>
                            <div class="flex shadow-sm rounded-xl overflow-hidden focus-within:ring-1 focus-within:ring-amber-500 border border-neutral-600 focus-within:border-amber-500 transition-all bg-neutral-800">
                                <input 
                                    v-model.number="form.qty" 
                                    type="number" step="any" min="0.01" required 
                                    placeholder="បញ្ចូលចំនួន..." 
                                    class="w-full bg-transparent px-4 py-3 text-white font-black outline-none"
                                >
                                <select 
                                    v-if="selectedProduct.unit === 'case'" 
                                    v-model="form.transactionUnit" 
                                    class="bg-neutral-700 border-l border-neutral-600 px-3 py-3 text-white text-[11px] font-bold outline-none cursor-pointer hover:bg-neutral-600 transition-colors"
                                >
                                    <option value="bulk">កេះ ({{ translateUnit(selectedProduct.unit) }})</option>
                                    <option value="retail">ដប / រាយ ({{ translateRetailUnit(selectedProduct) }})</option>
                                </select>
                                <div v-else class="bg-neutral-700 border-l border-neutral-600 px-4 py-3 text-white text-[11px] font-bold flex items-center justify-center">
                                    {{ translateUnit(selectedProduct.unit) }}
                                </div>
                            </div>
                        </div>
                        
                        <div v-if="mode === 'IN'">
                            <label class="block text-[11px] font-black text-amber-400 mb-1.5">
                                ថ្លៃដើមទិញចូលថ្មី / ១ {{ form.transactionUnit === 'retail' ? 'ដប (រាយ)' : translateUnit(selectedProduct.unit) }} <span class="text-rose-500">*</span>
                            </label>
                            <div class="relative">
                                <span class="absolute left-4 top-3 text-emerald-500 font-black">{{ selectedProduct.currency === 'USD' ? '$' : '៛' }}</span>
                                <input v-model.number="form.cost" type="number" step="any" min="0" required class="w-full bg-neutral-800 border border-emerald-500/50 rounded-xl pl-8 pr-4 py-3 text-emerald-400 font-black outline-none focus:ring-1 focus:ring-emerald-500 transition-all">
                            </div>
                        </div>

                        <div v-if="mode === 'OUT'">
                            <label class="block text-[11px] font-black text-neutral-300 mb-1.5">គិតជាទឹកប្រាក់ខាតបង់សរុប</label>
                            <div class="bg-neutral-800/80 border border-rose-500/30 rounded-xl px-4 py-3 text-rose-400 font-black flex items-center gap-1 shadow-inner h-[46px]">
                                <span>{{ selectedProduct.currency === 'USD' ? '$' : '៛' }}</span>
                                {{ formatPrice(lossValue) }}
                            </div>
                        </div>

                    </div>

                    <div v-if="mode === 'IN'" class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5 animate-slide-down">
                        <div class="bg-neutral-800/80 p-3 rounded-xl border border-neutral-700 shadow-inner">
                            <label class="block text-[10px] font-black text-emerald-400 mb-1.5 flex items-center gap-1.5 uppercase tracking-wider">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                ថ្ងៃផលិត (MFG Date) <span class="text-neutral-500 lowercase ml-1">- អាចរំលង</span>
                            </label>
                            <input 
                                v-model="form.mfgDate" 
                                type="date" 
                                class="w-full bg-neutral-900 border border-neutral-600 rounded-lg px-3 py-2.5 text-xs font-bold text-neutral-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 outline-none transition-colors cursor-pointer"
                            >
                        </div>
                        <div class="bg-neutral-800/80 p-3 rounded-xl border border-neutral-700 shadow-inner">
                            <label class="block text-[10px] font-black text-rose-400 mb-1.5 flex items-center gap-1.5 uppercase tracking-wider">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                ថ្ងៃផុតកំណត់ (EXP Date) <span class="text-neutral-500 lowercase ml-1">- អាចរំលង</span>
                            </label>
                            <input 
                                v-model="form.expDate" 
                                type="date" 
                                class="w-full bg-neutral-900 border border-neutral-600 rounded-lg px-3 py-2.5 text-xs font-bold text-neutral-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 outline-none transition-colors cursor-pointer"
                            >
                        </div>
                    </div>

                    <div v-if="mode === 'IN' && form.qty > 0 && form.cost > 0" class="mb-5 text-[12px] bg-black/40 p-4 rounded-xl border border-neutral-700/50 shadow-inner space-y-3">
                        <div class="flex justify-between items-center border-b border-neutral-700/50 pb-2.5">
                            <span class="text-neutral-400 font-bold">តម្លៃសរុបទាំងអស់ (Total Cost):</span>
                            <span class="text-emerald-400 font-black text-[15px]">{{ calculateTotalCost() }} {{ selectedProduct.currency === 'USD' ? '$' : '៛' }}</span>
                        </div>
                        
                        <div v-if="selectedProduct.unit === 'case'" class="flex justify-between items-center">
                            <span class="text-neutral-400">ថ្លៃដើមធ្លាក់លើ <span class="text-white font-bold">១ កេះ</span>:</span>
                            <span class="text-amber-400 font-bold">{{ calculateCostPerCase() }} {{ selectedProduct.currency === 'USD' ? '$' : '៛' }}</span>
                        </div>
                        
                        <div v-if="selectedProduct.unit === 'case'" class="flex justify-between items-center">
                            <span class="text-neutral-400">ថ្លៃដើមធ្លាក់លើ <span class="text-white font-bold">១ ដប/រាយ</span>:</span>
                            <span class="text-sky-400 font-bold">{{ calculateCostPerRetail() }} {{ selectedProduct.currency === 'USD' ? '$' : '៛' }}</span>
                        </div>
                    </div>

                    <div class="mb-6">
                        <label class="block text-[11px] font-black text-neutral-300 mb-1.5">មូលហេតុ / ចំណាំ (Reason) <span v-if="mode==='OUT'" class="text-rose-500">*</span></label>
                        <input v-model="form.reason" type="text" :placeholder="mode === 'IN' ? 'ឧ. ទិញចូលពីក្រុមហ៊ុន...' : 'ឧ. ខូចគុណភាព, បែកបាក់, ហួសដឺឡេ...'" :required="mode === 'OUT'" class="w-full bg-neutral-800 border border-neutral-600 rounded-xl px-4 py-3 text-white text-[13px] outline-none focus:border-amber-500 transition-all font-bold">
                    </div>

                    <div class="flex justify-end pt-4 border-t border-neutral-800">
                        <button type="submit" :disabled="isSubmitting" class="px-8 py-3.5 rounded-xl font-black text-white shadow-lg transition-all active:scale-95 flex items-center gap-2 text-sm" :class="mode === 'IN' ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 shadow-emerald-500/20' : 'bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 shadow-rose-500/20'">
                            <span v-if="isSubmitting" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                            {{ mode === 'IN' ? 'បញ្ជាក់ការបញ្ជូល (Confirm IN)' : 'បញ្ជាក់ការដកចេញ (Confirm OUT)' }}
                        </button>
                    </div>

                </form>
            </div>
        </div>

        <div class="relative z-10 bg-neutral-800/50 border border-neutral-700/50 rounded-2xl p-6 shadow-2xl backdrop-blur-sm">
            
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div class="flex bg-neutral-900 p-1 rounded-xl border border-neutral-700">
                    <button @click="mode = 'IN'" :class="mode === 'IN' ? 'bg-emerald-500/20 text-emerald-400 shadow-sm' : 'text-neutral-400 hover:text-white'" class="px-5 py-2 rounded-lg text-[13px] font-bold transition-all flex items-center gap-2">
                        ប្រវត្តិនាំចូល (IN)
                    </button>
                    <button @click="mode = 'OUT'" :class="mode === 'OUT' ? 'bg-rose-500/20 text-rose-400 shadow-sm' : 'text-neutral-400 hover:text-white'" class="px-5 py-2 rounded-lg text-[13px] font-bold transition-all flex items-center gap-2">
                        ប្រវត្តិដកចេញ & ខាតបង់ (OUT)
                    </button>
                </div>
                
                <div v-if="mode === 'OUT'" class="bg-rose-500/10 border border-rose-500/30 px-5 py-2.5 rounded-xl text-rose-400 font-bold text-sm shadow-inner flex items-center gap-2 animate-fade-in">
                    ការខាតបង់សរុប (Loss): 
                    <span class="text-xl font-black">{{ formatPrice(totalLossUSD) }}$</span>
                </div>
            </div>

            <div class="overflow-x-auto custom-scrollbar rounded-xl border border-neutral-700">
                <table class="w-full text-left border-collapse min-w-[1000px]">
                    <thead class="bg-neutral-900 text-neutral-400 text-[11px] uppercase font-black tracking-widest border-b border-neutral-700">
                        <tr>
                            <th class="px-5 py-4">កាលបរិច្ឆេទ</th>
                            <th class="px-5 py-4 text-center">ប្រភេទ</th>
                            <th class="px-5 py-4">ទំនិញ</th>
                            <th class="px-5 py-4 text-center">ចំនួន (ខ្នាត)</th>
                            <th class="px-5 py-4 text-right">តម្លៃសរុប</th>
                            <th class="px-5 py-4">មូលហេតុ</th>
                            <th class="px-5 py-4 text-right">ដោយ</th>
                            <th class="px-5 py-4 text-center">សកម្មភាព</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-neutral-800 bg-neutral-800/30">
                        <tr v-if="isLoadingHistory">
                            <td colspan="8" class="py-12 text-center"><div class="animate-spin rounded-full h-8 w-8 border-2 border-amber-500 border-t-transparent mx-auto"></div></td>
                        </tr>
                        <tr v-else-if="filteredHistory.length === 0">
                            <td colspan="8" class="py-12 text-center text-neutral-500 font-bold">មិនទាន់មានប្រវត្តិប្រតិបត្តិការទេ</td>
                        </tr>
                        <tr v-else v-for="h in filteredHistory" :key="h.id" class="hover:bg-neutral-700/50 transition-colors">
                            <td class="px-5 py-3.5 text-xs font-bold text-neutral-300">{{ formatDate(h.createdAt) }}</td>
                            <td class="px-5 py-3.5 text-center">
                                <span class="px-2.5 py-1 rounded text-[10px] font-black tracking-widest shadow-sm" :class="h.type === 'IN' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'">
                                    {{ h.type === 'IN' ? 'IN' : 'OUT' }}
                                </span>
                            </td>
                            <td class="px-5 py-3.5 text-sm font-bold text-white">{{ h.productName }}</td>
                            <td class="px-5 py-3.5 text-center font-bold text-neutral-300">{{ formatQty(h.qty) }} {{ translateUnit(h.unitDisplay) }}</td>
                            <td class="px-5 py-3.5 text-right font-black" :class="h.type === 'IN' ? 'text-emerald-400' : 'text-rose-400'">
                                {{ h.type === 'IN' ? '+' : '-' }}{{ formatPrice(h.totalValue) }}{{ h.currency === 'USD' ? '$' : '៛' }}
                            </td>
                            <td class="px-5 py-3.5 text-xs font-bold text-neutral-400">{{ h.reason || '-' }}</td>
                            <td class="px-5 py-3.5 text-right text-[10px] text-neutral-500 font-bold">{{ h.createdBy }}</td>
                            
                            <td class="px-5 py-3.5">
                                <div class="flex items-center justify-center gap-2">
                                    <button @click="openDeleteModal(h)" class="p-1.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-transparent hover:border-rose-500/30 rounded-lg transition-all active:scale-95" title="លុបចោល">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <transition name="modal-fade">
            <div v-if="deleteModal.show" class="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm font-khmer">
                <div class="bg-neutral-900 border border-neutral-700 rounded-3xl w-full max-w-sm p-6 text-center shadow-2xl relative overflow-hidden animate-slide-up">
                    <div class="absolute top-0 inset-x-0 h-2 bg-rose-500"></div>
                    <div class="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </div>
                    <h3 class="text-lg font-black text-white mb-2">បញ្ជាក់ការលុបប្រវត្តិ</h3>
                    <p class="text-[13px] font-bold text-neutral-400 leading-relaxed mb-4">
                        តើអ្នកពិតជាចង់លុបប្រវត្តិ <span class="text-white">{{ deleteModal.data?.type === 'IN' ? 'នាំចូល' : 'ដកចេញ' }}</span> នេះមែនទេ? 
                    </p>
                    <div class="bg-rose-500/10 border border-rose-500/20 rounded-lg p-3 mb-6 text-left">
                        <p class="text-xs text-rose-400 font-bold mb-1">⚠️ ចំណាំ៖ ការលុបនេះនឹង៖</p>
                        <ul class="text-[11px] text-neutral-300 list-disc list-inside pl-4 space-y-1">
                            <li>លុបទិន្នន័យនេះចេញពីបញ្ជីប្រវត្តិ</li>
                            <li><strong class="text-white">ស្តារចំនួនស្តុក និងតម្លៃដើម</strong> ទៅសភាពដើមវិញដោយស្វ័យប្រវត្តិ។</li>
                        </ul>
                    </div>
                    <div class="flex gap-3">
                        <button @click="deleteModal.show = false" class="flex-1 py-3 rounded-xl font-bold text-neutral-300 bg-neutral-800 hover:bg-neutral-700 transition-all text-sm border border-neutral-600">
                            បោះបង់
                        </button>
                        <button @click="confirmDeleteTransaction" :disabled="deleteModal.isDeleting" class="flex-1 py-3 rounded-xl font-black text-white bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-500/20 transition-all active:scale-95 flex justify-center items-center gap-2 text-sm disabled:opacity-50">
                            <span v-if="deleteModal.isDeleting" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                            យល់ព្រមលុប
                        </button>
                    </div>
                </div>
            </div>
        </transition>

    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { db, auth } from '@/firebaseConfig';
import { collection, addDoc, doc, getDoc, updateDoc, serverTimestamp, query, orderBy, onSnapshot, deleteDoc } from 'firebase/firestore';
import { useNotificationStore } from '@/stores/notification';

const props = defineProps({
    products: { type: Array, required: true }
});

const notification = useNotificationStore();

// State
const mode = ref('IN'); 
const searchQuery = ref('');
const showDropdown = ref(false);
const selectedProduct = ref(null);
const isSubmitting = ref(false);

const history = ref([]);
const isLoadingHistory = ref(true);

const form = reactive({ 
    qty: null, 
    cost: null, 
    reason: '', 
    transactionUnit: 'bulk',
    mfgDate: '',
    expDate: ''
});

// Modals State
const deleteModal = reactive({ show: false, data: null, isDeleting: false });

const vClickOutside = {
    mounted(el, binding) {
        el.clickOutsideEvent = function (event) {
            if (!(el == event.target || el.contains(event.target))) { binding.value(event); }
        };
        document.body.addEventListener('click', el.clickOutsideEvent);
    },
    unmounted(el) { document.body.removeEventListener('click', el.clickOutsideEvent); }
};

// Computed
const filteredProducts = computed(() => {
    if (!searchQuery.value) return props.products.slice(0, 15);
    const q = searchQuery.value.toLowerCase();
    return props.products.filter(p => p.name.toLowerCase().includes(q) || (p.barcode && p.barcode.toLowerCase().includes(q)));
});

const filteredHistory = computed(() => {
    const activeProductIds = new Set(props.products.map(p => p.id));
    return history.value.filter(h => h.type === mode.value && activeProductIds.has(h.productId));
});

const lossValue = computed(() => {
    if (!selectedProduct.value || !form.qty || mode.value !== 'OUT') return 0;
    const unitCostBulk = Number(selectedProduct.value.unitCost) || 0;
    const itemsPerCase = Number(selectedProduct.value.itemsPerCase) || 1;

    if (form.transactionUnit === 'retail') {
        return form.qty * (unitCostBulk / itemsPerCase); 
    } else {
        return form.qty * unitCostBulk; 
    }
});

const totalLossUSD = computed(() => {
    const activeProductIds = new Set(props.products.map(p => p.id));
    return history.value
        .filter(h => h.type === 'OUT' && activeProductIds.has(h.productId))
        .reduce((sum, h) => {
            let val = h.totalValue;
            if(h.currency === 'KHR' || h.currency === '៛') val = val / 4000;
            return sum + val;
        }, 0);
});

const calculateTotalCost = () => {
    const q = Number(form.qty) || 0;
    const c = Number(form.cost) || 0;
    return (q * c).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 3 });
};

const calculateCostPerCase = () => {
    const c = Number(form.cost) || 0;
    const ipc = Number(selectedProduct.value?.itemsPerCase) || 1; 
    if (form.transactionUnit === 'bulk') {
        return c.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } else {
        return (c * ipc).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
};

const calculateCostPerRetail = () => {
    const c = Number(form.cost) || 0;
    const ipc = Number(selectedProduct.value?.itemsPerCase) || 1;
    if (form.transactionUnit === 'retail') {
        return c.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 3 });
    } else {
        return (c / ipc).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 3 });
    }
};

// 🌟 FIX: Auto-calculate cost when changing dropdown Unit 🌟
watch(() => form.transactionUnit, (newUnit) => {
    if (mode.value === 'IN' && selectedProduct.value) {
        const baseBulkCost = Number(selectedProduct.value.unitCost) || 0;
        const itemsPerCase = Number(selectedProduct.value.itemsPerCase) || 1;

        if (newUnit === 'retail') {
            form.cost = Number((baseBulkCost / itemsPerCase).toFixed(4));
        } else {
            form.cost = baseBulkCost;
        }
    }
});

watch(mode, (newMode) => {
    if (selectedProduct.value) {
        form.transactionUnit = 'bulk';
        if (newMode === 'IN') {
            form.cost = selectedProduct.value.unitCost;
        }
        form.reason = '';
    }
});

// Actions
const selectProduct = (prod) => {
    selectedProduct.value = prod;
    searchQuery.value = prod.name;
    showDropdown.value = false;
    form.qty = null;
    form.reason = '';
    form.transactionUnit = 'bulk';
    
    if (mode.value === 'IN') {
        form.cost = prod.unitCost; 
        form.mfgDate = prod.mfgDate || '';
        form.expDate = prod.expDate || '';
    } 
};

const clearSelection = () => {
    selectedProduct.value = null;
    searchQuery.value = '';
    form.qty = null; 
    form.cost = null; 
    form.reason = ''; 
    form.transactionUnit = 'bulk';
    form.mfgDate = ''; 
    form.expDate = ''; 
};

const closeDropdown = () => { showDropdown.value = false; };

const submitTransaction = async () => {
    if (!selectedProduct.value) return notification.warning("សូមជ្រើសរើសទំនិញសិន");
    if (!form.qty || form.qty <= 0) return notification.warning("ចំនួនត្រូវតែធំជាងសូន្យ");

    const currentQtyBulk = Number(selectedProduct.value.quantity) || 0;
    const itemsPerCase = Number(selectedProduct.value.itemsPerCase) || 1;

    let qtyDeltaBulk = 0;
    let inputCostBulk = 0;

    if (form.transactionUnit === 'retail') {
        qtyDeltaBulk = form.qty / itemsPerCase;
        inputCostBulk = form.cost * itemsPerCase; 
    } else {
        qtyDeltaBulk = form.qty;
        inputCostBulk = form.cost;
    }

    if (mode.value === 'OUT' && qtyDeltaBulk > currentQtyBulk) {
        return notification.error(`ស្តុកមិនគ្រប់គ្រាន់សម្រាប់ដកចេញ! ស្តុកធំមានតែ ${formatQty(currentQtyBulk)} ${translateUnit(selectedProduct.value.unit)}`);
    }

    if (mode.value === 'OUT' && !form.reason.trim()) {
        return notification.warning("សូមបញ្ជាក់មូលហេតុនៃការដកចេញ");
    }

    isSubmitting.value = true;
    try {
        const productRef = doc(db, 'stocks', selectedProduct.value.id);
        
        let newQtyBulk = 0;
        let newCostBulk = Number(selectedProduct.value.unitCost) || 0;
        let transactionTotalValue = 0;
        let historyUnitCost = 0; 
        
        const adminName = auth.currentUser?.displayName || 'Admin';

        const dataToUpdate = {};

        if (mode.value === 'IN') {
            const oldQty = currentQtyBulk;
            const oldUnitCost = newCostBulk; 
            const oldTotalValue = oldQty * oldUnitCost;

            const incomingQty = qtyDeltaBulk; 
            const incomingUnitCost = Number(inputCostBulk); 
            const incomingTotalValue = incomingQty * incomingUnitCost;

            newQtyBulk = oldQty + incomingQty;
            
            if (newQtyBulk > 0) {
                newCostBulk = (oldTotalValue + incomingTotalValue) / newQtyBulk;
            } else {
                newCostBulk = incomingUnitCost; 
            }

            transactionTotalValue = form.qty * form.cost; 
            historyUnitCost = form.cost; 

            if (form.mfgDate) dataToUpdate.mfgDate = form.mfgDate;
            if (form.expDate) dataToUpdate.expDate = form.expDate;

        } else {
            newQtyBulk = currentQtyBulk - qtyDeltaBulk;
            historyUnitCost = newCostBulk; 
            
            if (form.transactionUnit === 'retail') {
                transactionTotalValue = form.qty * (newCostBulk / itemsPerCase);
            } else {
                transactionTotalValue = form.qty * newCostBulk;
            }
        }

        Object.assign(dataToUpdate, {
            quantity: newQtyBulk,
            unitCost: newCostBulk, 
            totalCost: newQtyBulk * newCostBulk, 
            updatedAt: serverTimestamp()
        });

        await updateDoc(productRef, dataToUpdate);

        const displayUnitStr = form.transactionUnit === 'retail' ? (selectedProduct.value.retailUnit || 'bottle') : selectedProduct.value.unit;

        await addDoc(collection(db, 'stock_transactions'), {
            type: mode.value,
            productId: selectedProduct.value.id,
            productName: selectedProduct.value.name,
            qty: form.qty,
            unitDisplay: displayUnitStr,
            unitCost: historyUnitCost, 
            totalValue: transactionTotalValue,
            currency: selectedProduct.value.currency,
            reason: form.reason || (mode.value === 'IN' ? 'នាំចូលស្តុកបន្ថែម' : 'ដកចេញ'),
            createdBy: adminName,
            createdAt: serverTimestamp()
        });

        notification.success(`បាន${mode.value === 'IN' ? 'នាំចូល' : 'ដកចេញ'}ដោយជោគជ័យ!`);
        clearSelection();

    } catch (error) {
        console.error(error);
        notification.error("មានបញ្ហាក្នុងការរក្សាទុក");
    } finally {
        isSubmitting.value = false;
    }
};

const openDeleteModal = (transaction) => {
    deleteModal.data = transaction;
    deleteModal.show = true;
};

const confirmDeleteTransaction = async () => {
    if (!deleteModal.data) return;
    
    const trx = deleteModal.data;
    deleteModal.isDeleting = true;

    try {
        const productRef = doc(db, 'stocks', trx.productId);
        const productSnap = await getDoc(productRef);
        
        if (productSnap.exists()) {
            const prodData = productSnap.data();
            const currentQtyBulk = Number(prodData.quantity) || 0;
            const currentTotalCost = Number(prodData.totalCost) || 0; 
            const itemsPerCase = Number(prodData.itemsPerCase) || 1;

            const isRetailRecord = (trx.unitDisplay !== prodData.unit && trx.unitDisplay !== translateUnit(prodData.unit));
            
            let bulkQtyToReverse = Number(trx.qty) || 0;
            if (isRetailRecord) {
                bulkQtyToReverse = bulkQtyToReverse / itemsPerCase; 
            }

            let transactionUnitCostBulk = Number(trx.unitCost) || 0;
            if (isRetailRecord) {
                transactionUnitCostBulk = transactionUnitCostBulk * itemsPerCase;
            }
            const transactionTotalCostToReverse = bulkQtyToReverse * transactionUnitCostBulk;

            let newQtyBulk = currentQtyBulk;
            let newTotalCost = currentTotalCost;
            let newUnitCost = Number(prodData.unitCost) || 0;

            if (trx.type === 'IN') {
                newQtyBulk = currentQtyBulk - bulkQtyToReverse;
                newTotalCost = currentTotalCost - transactionTotalCostToReverse;
                
                if (newQtyBulk < 0) {
                    notification.error("មិនអាចលុបបានទេ! ស្តុកទំនិញនេះត្រូវបានលក់ ឬដកចេញខ្លះហើយ។");
                    deleteModal.isDeleting = false;
                    deleteModal.show = false;
                    return;
                }
            } else if (trx.type === 'OUT') {
                newQtyBulk = currentQtyBulk + bulkQtyToReverse;
                newTotalCost = currentTotalCost + transactionTotalCostToReverse;
            }

            if (newQtyBulk > 0) {
                newUnitCost = newTotalCost / newQtyBulk;
            } else {
                newUnitCost = 0; 
                newTotalCost = 0;
            }

            await updateDoc(productRef, {
                quantity: newQtyBulk,
                totalCost: newTotalCost,
                unitCost: newUnitCost,
                updatedAt: serverTimestamp()
            });
        }

        await deleteDoc(doc(db, 'stock_transactions', trx.id));
        
        notification.success("លុបប្រវត្តិ និងធ្វើបច្ចុប្បន្នភាពស្តុកដោយជោគជ័យ!");
        deleteModal.show = false;

    } catch (error) {
        console.error("Delete Error:", error);
        notification.error("មានបញ្ហាក្នុងការលុបប្រវត្តិ!");
    } finally {
        deleteModal.isDeleting = false;
    }
};

onMounted(() => {
    const q = query(collection(db, 'stock_transactions'), orderBy('createdAt', 'desc'));
    onSnapshot(q, (snap) => {
        history.value = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        isLoadingHistory.value = false;
    });
});

// Utils
const formatPrice = (val) => Number(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 });

const formatQty = (val) => {
    if (!val) return '0';
    return Number(val).toFixed(2).replace(/\.00$/, ''); 
};

const translateUnit = (unit) => {
    const map = { bottle: 'ដប', case: 'កេះ', pack: 'កញ្ចប់', can: 'កំប៉ុង', kg: 'គីឡូ' };
    return map[unit] || unit;
};

const translateRetailUnit = (prod) => {
    if (prod && prod.retailUnit) return translateUnit(prod.retailUnit);
    if (prod && prod.unit === 'case') return 'ដប/កញ្ចប់';
    return translateUnit(prod ? prod.unit : 'bottle');
};

const formatDate = (ts) => {
   if(!ts) return '';
   let date;
   if (typeof ts.toDate === 'function') date = ts.toDate();
   else date = new Date(ts);
   if (isNaN(date.getTime())) return '';
   
   return new Intl.DateTimeFormat('km-KH', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #52525b; border-radius: 10px; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #71717a; }

.animate-fade-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.animate-slide-up { animation: slideUp 0.3s ease-out forwards; }
@keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

.animate-slide-down { animation: slideDown 0.3s ease-out forwards; }
@keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.2s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }

input[type="number"]::-webkit-inner-spin-button, input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
input[type="number"] { -moz-appearance: textfield; }
</style>