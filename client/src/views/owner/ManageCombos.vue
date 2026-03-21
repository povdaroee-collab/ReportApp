<template>
  <div class="font-khmer animate-fade-in pb-10">
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        <div class="xl:col-span-4 bg-white rounded-3xl p-6 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-slate-100 sticky top-4">
            <div class="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <div class="w-10 h-10 bg-indigo-50/50 text-indigo-600 rounded-xl flex items-center justify-center border border-indigo-100/50">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                </div>
                <h2 class="text-lg font-black text-slate-800">{{ isEditing ? 'កែប្រែឈុតទំនិញ' : 'បង្កើតឈុតទំនិញថ្មី' }}</h2>
            </div>

            <form @submit.prevent="saveCombo" class="space-y-5">
                
                <div class="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-2xl transition-colors cursor-pointer relative group" :class="comboImage ? 'border-indigo-200 bg-indigo-50/30' : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'" @click="$refs.fileInput.click()">
                    <input type="file" ref="fileInput" accept="image/*" class="hidden" @change="handleImageUpload">
                    <template v-if="comboImage">
                        <img :src="comboImage" class="h-24 w-auto object-contain rounded-lg shadow-sm" />
                        <div class="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span class="text-white font-bold text-xs flex items-center gap-1"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg> ផ្លាស់ប្ដូររូបភាព</span>
                        </div>
                    </template>
                    <template v-else>
                        <div class="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-2">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        </div>
                        <p class="text-xs font-bold text-slate-500">ចុចទីនេះដើម្បី Upload រូបភាព (មិនដាក់ក៏បាន)</p>
                    </template>
                </div>

                <div>
                    <label class="block text-xs font-black text-slate-500 mb-1.5">ឈ្មោះឈុតទំនិញ <span class="text-rose-500">*</span></label>
                    <input v-model="form.name" type="text" required placeholder="ឧ. ឈុតសែនព្រេនទី១" class="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-bold focus:border-indigo-500 outline-none transition-all shadow-sm">
                </div>

                <div class="p-4 bg-slate-50/50 rounded-2xl border border-slate-200/60 shadow-inner relative">
                    <label class="block text-[11px] font-black text-indigo-600 uppercase tracking-widest mb-3">ជ្រើសរើសទំនិញចូលឈុត <span class="text-rose-500">*</span></label>
                    
                    <div class="flex gap-2 relative" v-click-outside="() => showProductDropdown = false">
                        <div class="relative flex-1">
                            <input 
                                type="text" 
                                v-model="productSearchTerm"
                                @focus="showProductDropdown = true"
                                placeholder="-- វាយស្វែងរកទំនិញសកម្ម --" 
                                class="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:border-indigo-500 shadow-sm"
                            >
                            <div v-if="showProductDropdown && filteredProducts.length > 0" class="absolute z-50 left-0 right-0 mt-1 bg-white border border-slate-200 shadow-xl rounded-xl max-h-48 overflow-y-auto custom-scrollbar p-1">
                                <div 
                                    v-for="prod in filteredProducts" 
                                    :key="prod.id"
                                    @click="selectProductForCombo(prod)"
                                    class="p-2 hover:bg-indigo-50 rounded-lg cursor-pointer transition-colors"
                                >
                                    <div class="text-xs font-bold text-slate-800">{{ prod.name }}</div>
                                    <div class="text-[10px] text-slate-500 font-mono">ថ្លៃដើម: {{ prod.unitCost.toFixed(3) }}$ | ស្តុក: {{ prod.retailQty }}</div>
                                </div>
                            </div>
                        </div>
                        <input v-model.number="qtyToAdd" type="number" min="1" class="w-16 bg-white border border-slate-200 rounded-xl px-2 py-2 text-center text-sm font-bold outline-none focus:border-indigo-500 shadow-sm">
                        <button type="button" @click="addProductToCombo" class="bg-indigo-100 hover:bg-indigo-600 text-indigo-600 hover:text-white px-3 py-2 rounded-xl font-bold transition-colors">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"></path></svg>
                        </button>
                    </div>

                    <div v-if="form.items.length > 0" class="space-y-2 mt-4 max-h-[150px] overflow-y-auto custom-scrollbar pr-1">
                        <div v-for="(item, idx) in form.items" :key="idx" class="flex justify-between items-center bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm animate-slide-up">
                            <div class="flex-1 min-w-0 pr-2">
                                <p class="text-xs font-black text-slate-800 truncate">{{ item.name }}</p>
                                <p class="text-[10px] text-slate-500 font-mono">{{ item.qty }} x {{ item.unitCost.toFixed(3) }}$ = <span class="text-rose-500 font-bold">{{ (item.qty * item.unitCost).toFixed(2) }}$</span></p>
                            </div>
                            <button type="button" @click="removeProductFromCombo(idx)" class="w-7 h-7 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-lg flex items-center justify-center transition-colors shrink-0">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                    </div>
                    
                    <div v-if="form.items.length === 0" class="mt-3 pt-3 border-t border-slate-200 flex justify-center items-center px-1">
                        <span class="text-[10px] font-black text-slate-400 uppercase">មិនទាន់មានទំនិញក្នុងឈុតទេ</span>
                    </div>

                    <div v-if="form.items.length > 0" class="mt-3 text-center text-rose-500 text-xs font-black bg-rose-50 py-1.5 rounded-lg border border-rose-100">
                        ថ្លៃដើមឈុតសរុប (Base Cost): {{ totalComboBaseCost }}$
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-[10px] font-black text-emerald-600 uppercase mb-1.5">តម្លៃលក់ ១ឈុត (Retail)</label>
                        <div class="flex shadow-sm rounded-xl overflow-hidden border border-emerald-200 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
                            <div class="bg-emerald-50 px-3 py-2.5 font-black text-emerald-500 flex items-center justify-center">$</div>
                            <input v-model.number="form.retailPrice" type="number" step="any" min="0" required class="w-full bg-white px-3 py-2 text-emerald-700 font-bold text-sm outline-none">
                        </div>
                    </div>
                    <div>
                        <label class="block text-[10px] font-black text-amber-600 uppercase mb-1.5">ប្រាក់ទឹកចិត្ត (Bonus)</label>
                        <div class="flex shadow-sm rounded-xl overflow-hidden border border-amber-200 focus-within:ring-2 focus-within:ring-amber-100 transition-all">
                            <div class="bg-amber-50 px-3 py-2.5 font-black text-amber-500 flex items-center justify-center">$</div>
                            <input v-model.number="form.sellerIncentive" type="number" step="any" min="0" class="w-full bg-white px-3 py-2 text-amber-700 font-bold text-sm outline-none">
                        </div>
                    </div>
                </div>

                <div class="pt-4 border-t border-slate-100">
                    <div class="flex justify-between items-center mb-3">
                        <div class="flex items-center gap-3">
                            <label class="block text-[11px] font-black text-slate-600 uppercase">លក្ខខណ្ឌលក់ដុំ (WHOLESALE)</label>
                            <label class="relative inline-flex items-center cursor-pointer" title="បិទ ឬ បើកការលក់ដុំ">
                                <input type="checkbox" v-model="form.enableWholesale" class="sr-only peer">
                                <div class="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-indigo-500"></div>
                            </label>
                        </div>
                        <button v-if="form.enableWholesale" type="button" @click="addTier" class="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded font-bold hover:bg-indigo-100 flex items-center gap-1 transition-opacity">
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                            បន្ថែម
                        </button>
                    </div>
                    
                    <div :class="!form.enableWholesale ? 'opacity-50 pointer-events-none grayscale' : ''" class="space-y-3 max-h-48 overflow-y-auto custom-scrollbar pr-1 transition-all duration-300">
                        <div v-for="(tier, idx) in form.wholesaleTiers" :key="idx" class="bg-white p-3 rounded-xl border border-slate-200 shadow-sm relative animate-slide-up group hover:border-indigo-300 transition-colors">
                            <button v-if="form.wholesaleTiers.length > 1" type="button" @click="removeTier(idx)" class="absolute -top-2 -right-2 w-5 h-5 bg-rose-100 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors rounded-full flex justify-center items-center shadow-sm opacity-0 group-hover:opacity-100"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                            <div class="grid grid-cols-3 gap-3">
                                <div>
                                    <span class="text-[9px] text-slate-500 font-black tracking-wide uppercase block text-center mb-1">ទិញចាប់ពី (ឈុត)</span>
                                    <input v-model.number="tier.minQty" type="number" min="1" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-xs font-bold outline-none focus:border-indigo-400 text-center">
                                </div>
                                <div>
                                    <span class="text-[9px] text-slate-500 font-black tracking-wide uppercase block text-center mb-1">តម្លៃ/ឈុត ($)</span>
                                    <input v-model.number="tier.price" type="number" step="any" min="0" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-xs font-bold outline-none focus:border-indigo-400 text-center">
                                </div>
                                <div>
                                    <span class="text-[9px] text-slate-500 font-black tracking-wide uppercase block text-center mb-1">Bonus ($)</span>
                                    <input v-model.number="tier.incentive" type="number" step="any" min="0" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-xs font-bold outline-none focus:border-indigo-400 text-center">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="pt-4">
                    <button type="button" v-if="isEditing" @click="resetForm" class="w-full py-3 mb-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors">បោះបង់ (Cancel)</button>
                    <button type="submit" :disabled="isSaving || form.items.length < 2" class="w-full py-3.5 rounded-xl bg-slate-800 text-white font-black text-sm shadow-md hover:bg-slate-900 transition-colors disabled:opacity-50 uppercase tracking-wide">
                        <span v-if="isSaving" class="flex items-center justify-center gap-2">
                            <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            កំពុងរក្សាទុក...
                        </span>
                        <span v-else>{{ isEditing ? 'រក្សាទុកការកែប្រែ' : 'បង្កើតឈុតថ្មី' }}</span>
                    </button>
                </div>
            </form>
        </div>

        <div class="xl:col-span-8 space-y-4">
            
            <div class="bg-white rounded-3xl p-5 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 sticky top-4 z-10">
                <h3 class="font-black text-slate-800 text-lg flex items-center gap-2">
                    បញ្ជីឈុតទំនិញ <span class="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-lg">{{ filteredCombos.length }}</span>
                </h3>
                
                <div class="relative w-full sm:w-64">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    <input 
                        v-model="comboSearchQuery" 
                        type="text" 
                        placeholder="ស្វែងរកឈ្មោះឈុត..." 
                        class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-indigo-400 transition-all"
                    >
                </div>
            </div>

            <div v-if="isLoadingCombos" class="py-20 text-center">
                <div class="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-indigo-600 mx-auto mb-3"></div>
            </div>

            <div v-else-if="filteredCombos.length === 0" class="bg-white/50 border-2 border-dashed border-slate-300 rounded-[2rem] p-16 text-center text-slate-400 mt-6">
                <div class="text-5xl mb-4">🎁</div>
                <p class="font-bold text-lg text-slate-600">មិនទាន់មានឈុតទំនិញនៅឡើយទេ</p>
                <p class="text-sm mt-1">សូមបង្កើតឈុតថ្មីនៅផ្ទាំងខាងឆ្វេង</p>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
                <div v-for="combo in paginatedCombos" :key="combo.id" 
                     class="bg-white rounded-3xl border shadow-sm overflow-hidden flex flex-col group relative transition-all"
                     :class="isComboUsable(combo) ? 'border-slate-100 hover:shadow-md' : 'border-rose-300 bg-rose-50/30'">
                    
                    <div v-if="!isComboUsable(combo)" class="absolute top-0 left-0 right-0 bg-rose-500 text-white text-[10px] font-black tracking-widest text-center py-1 z-10 flex items-center justify-center gap-1 shadow-sm">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                        ឈុតនេះមិនអាចប្រើបានទេ (សូមពិនិត្យទំនិញ)
                    </div>

                    <div class="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-start relative z-0" :class="{'pt-7': !isComboUsable(combo)}">
                        <div class="flex items-center gap-3">
                            <img v-if="combo.image" :src="combo.image" class="w-12 h-12 rounded-xl object-cover border border-slate-200 bg-white" />
                            <div v-else class="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-300 flex items-center justify-center border border-indigo-100/50"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>
                            <div>
                                <h4 class="font-black text-indigo-900 text-base mb-0.5 line-clamp-1" :title="combo.name">{{ combo.name }}</h4>
                                <span class="text-[10px] font-bold text-slate-400">{{ combo.items.length }} មុខទំនិញ</span>
                            </div>
                        </div>
                        <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button @click="editCombo(combo)" class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-colors"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg></button>
                            <button @click="openDeleteModal(combo)" class="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-colors"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                        </div>
                    </div>
                    
                    <div class="p-4 flex-1">
                        <ul class="space-y-2 mb-4 h-24 overflow-y-auto custom-scrollbar">
                            <li v-for="(item, i) in combo.items" :key="i" class="flex flex-col border-b border-slate-50 pb-1.5 last:border-0">
                                <div class="flex justify-between items-start w-full">
                                    <span class="text-[11px] font-bold text-slate-600 truncate pr-2" :title="item.name">- {{ item.name }}</span>
                                    <span class="text-[11px] font-bold text-slate-400 shrink-0">x{{ item.qty }}</span>
                                </div>
                                
                                <div v-if="!checkComboItemStatus(item).isValid" class="mt-0.5 ml-2">
                                    <span class="inline-flex items-center gap-1 text-[9px] font-black px-1.5 py-0.5 rounded"
                                          :class="{
                                              'bg-rose-100 text-rose-600 border border-rose-200': checkComboItemStatus(item).type === 'HARD_DELETE' || checkComboItemStatus(item).type === 'SOFT_DELETE_NO_STOCK',
                                              'bg-amber-100 text-amber-700 border border-amber-200': checkComboItemStatus(item).type === 'SOFT_DELETE_STOCK' || checkComboItemStatus(item).type === 'OUT_OF_STOCK'
                                          }">
                                        <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                        {{ checkComboItemStatus(item).text }}
                                    </span>
                                </div>
                            </li>
                        </ul>
                        
                        <div class="bg-indigo-50/50 rounded-xl p-3 border border-indigo-50 relative">
                            <div class="flex justify-between items-end mb-2">
                                <span class="text-[9px] font-black text-indigo-400 uppercase tracking-widest">តម្លៃលក់រាយ (Retail)</span>
                                <span class="text-base font-black text-indigo-600">{{ combo.retailPrice }}$</span>
                            </div>
                            <div class="flex justify-between text-[10px] font-bold text-slate-500 border-t border-indigo-100/50 pt-2">
                                <span>ប្រាក់ចំណេញ (Profit):</span>
                                <span class="text-emerald-600">+{{ (combo.retailPrice - combo.totalBaseCost - (combo.sellerIncentive || 0)).toFixed(2) }}$</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-slate-800 text-white px-5 py-3 flex justify-between items-center text-xs font-bold" :class="{'bg-rose-900': !isComboUsable(combo)}">
                        <span>ថ្លៃដើមសរុប (Cost):</span>
                        <span class="font-black text-sm" :class="!isComboUsable(combo) ? 'text-rose-200' : 'text-rose-300'">{{ combo.totalBaseCost }}$</span>
                    </div>
                </div>
            </div>

            <div v-if="totalPages > 1" class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between mt-6">
                <p class="text-xs font-bold text-slate-500 pl-2">
                    ទំព័រទី {{ currentPage }} នៃ {{ totalPages }} (សរុប {{ filteredCombos.length }})
                </p>
                <div class="flex items-center gap-1.5">
                    <button @click="currentPage--" :disabled="currentPage === 1" class="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg></button>
                    <button @click="currentPage++" :disabled="currentPage === totalPages" class="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></button>
                </div>
            </div>

        </div>
    </div>

    <transition enter-active-class="duration-300 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="showDeleteModal" class="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div class="bg-white rounded-[2rem] p-6 md:p-8 max-w-sm w-full shadow-2xl animate-slide-up relative overflow-hidden border border-slate-100">
                <div class="absolute -top-12 -right-12 w-40 h-40 bg-rose-500/10 rounded-full blur-2xl pointer-events-none"></div>

                <div class="flex flex-col items-center text-center relative z-10">
                    <div class="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-5 shadow-inner border border-rose-100">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16M10 11v6m4-6v6"></path></svg>
                    </div>
                    <h3 class="text-xl font-black text-slate-800 mb-2">បញ្ជាក់ការលុប</h3>
                    <p class="text-sm font-bold text-slate-500 mb-8 leading-relaxed">
                        តើអ្នកពិតជាចង់លុបឈុត <span class="text-rose-600 bg-rose-50 px-1 rounded">"{{ comboToDelete?.name }}"</span> នេះមែនទេ? <br/>
                        <span class="text-[11px] font-normal text-slate-400 mt-2 block">ទិន្នន័យដែលលុបហើយ មិនអាចទាញយកមកវិញបានទេ។</span>
                    </p>

                    <div class="flex gap-3 w-full">
                        <button @click="closeDeleteModal" class="flex-1 py-3.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors text-sm">បោះបង់</button>
                        <button @click="executeDelete" :disabled="isDeleting" class="flex-1 py-3.5 rounded-xl bg-rose-500 text-white font-bold shadow-md shadow-rose-500/30 hover:bg-rose-600 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 text-sm">
                            <svg v-if="isDeleting" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            <span v-else>លុបឈុតនេះ</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { db } from '@/firebaseConfig';
import { collection, getDocs, doc, setDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { useNotificationStore } from '@/stores/notification';

const notification = useNotificationStore();

// ================= STATE =================
const allProductsDict = ref({}); 
const availableProducts = ref([]); 
const combos = ref([]);
const isLoadingCombos = ref(true);
const isSaving = ref(false);
const isEditing = ref(false);

// Search & Pagination
const comboSearchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 60;

// Image Upload
const comboImage = ref(null);
const fileInput = ref(null);

// Smart Dropdown
const showProductDropdown = ref(false);
const productSearchTerm = ref('');
const qtyToAdd = ref(1);

// Delete Modal State
const showDeleteModal = ref(false);
const comboToDelete = ref(null);
const isDeleting = ref(false);

// Form Data (🌟 Added enableWholesale Toggle 🌟)
const form = reactive({
    id: null,
    name: '',
    items: [],
    retailPrice: 0,
    sellerIncentive: 0,
    enableWholesale: true, // 👈 New State for Toggle
    wholesaleTiers: [{ minQty: 2, price: 0, incentive: 0 }]
});

const vClickOutside = {
    mounted(el, binding) {
        el.clickOutsideEvent = function (event) {
            if (!(el == event.target || el.contains(event.target))) { binding.value(event); }
        };
        document.body.addEventListener('click', el.clickOutsideEvent);
    },
    unmounted(el) { document.body.removeEventListener('click', el.clickOutsideEvent); }
};

// ================= COMPUTED =================
const totalComboBaseCost = computed(() => {
    return form.items.reduce((sum, item) => sum + (item.qty * item.unitCost), 0).toFixed(2);
});

const filteredProducts = computed(() => {
    if (!productSearchTerm.value) return availableProducts.value.slice(0, 50); 
    const q = productSearchTerm.value.toLowerCase();
    return availableProducts.value.filter(p => p.name.toLowerCase().includes(q));
});

const filteredCombos = computed(() => {
    if (!comboSearchQuery.value) return combos.value;
    const q = comboSearchQuery.value.toLowerCase();
    return combos.value.filter(c => c.name.toLowerCase().includes(q));
});

const totalPages = computed(() => Math.ceil(filteredCombos.value.length / itemsPerPage) || 1);
const paginatedCombos = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    return filteredCombos.value.slice(start, start + itemsPerPage);
});

// ================= ACTIONS =================
onMounted(async () => {
    try {
        const pSnap = await getDocs(collection(db, 'stocks'));
        const tempDict = {};
        const available = [];

        pSnap.docs.forEach(d => {
            const data = d.data();
            const baseCost = Number(data.unitCost || 0) / Number(data.itemsPerCase || 1);
            const retailQty = Math.round((Number(data.quantity) || 0) * Number(data.itemsPerCase || 1));

            const productObj = {
                id: d.id,
                name: data.name || data.productName,
                unitCost: baseCost,
                isDeleted: data.isDeleted || false, 
                retailQty: retailQty
            };

            tempDict[d.id] = productObj;

            if (!productObj.isDeleted) {
                available.push(productObj);
            }
        });

        allProductsDict.value = tempDict;
        availableProducts.value = available;

        const cSnap = await getDocs(collection(db, 'combos'));
        combos.value = cSnap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a,b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } catch (e) {
        notification.error("បញ្ហាក្នុងការទាញយកទិន្នន័យ");
    } finally {
        isLoadingCombos.value = false;
    }
});

const checkComboItemStatus = (item) => {
    const prod = allProductsDict.value[item.productId];

    if (!prod) {
        return { isValid: false, type: 'HARD_DELETE', text: 'លុបជាអចិន្ត្រៃយ៍ (គ្មានទិន្នន័យ)' };
    }

    if (prod.isDeleted) {
        if (prod.retailQty > 0) {
            return { isValid: false, type: 'SOFT_DELETE_STOCK', text: `លុបបណ្ដោះអាសន្ន (សល់ ${prod.retailQty})` };
        } else {
            return { isValid: false, type: 'SOFT_DELETE_NO_STOCK', text: 'លុបបណ្ដោះអាសន្ន (អស់ស្តុក)' };
        }
    }

    if (prod.retailQty <= 0) { 
         return { isValid: false, type: 'OUT_OF_STOCK', text: 'អស់ពីស្តុក' };
    }

    return { isValid: true };
};

const isComboUsable = (combo) => {
    return combo.items.every(item => checkComboItemStatus(item).isValid);
};

const handleImageUpload = (event) => {
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
            const MAX_WIDTH = 400; 

            if (width > MAX_WIDTH) {
                height = Math.round((height * MAX_WIDTH) / width);
                width = MAX_WIDTH;
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            comboImage.value = canvas.toDataURL('image/webp', 0.8); 
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
};

const selectProductForCombo = (prod) => {
    productSearchTerm.value = prod.name;
    showProductDropdown.value = false;
};

const addProductToCombo = () => {
    const selectedProd = availableProducts.value.find(p => p.name === productSearchTerm.value);
    
    if (!selectedProd || qtyToAdd.value < 1) return notification.warning("សូមស្វែងរក និងជ្រើសរើសទំនិញសកម្មឱ្យបានត្រឹមត្រូវ");
    
    const existing = form.items.find(i => i.productId === selectedProd.id);
    if (existing) {
        existing.qty += qtyToAdd.value;
    } else {
        form.items.push({
            productId: selectedProd.id,
            name: selectedProd.name,
            unitCost: selectedProd.unitCost,
            qty: qtyToAdd.value
        });
    }
    
    productSearchTerm.value = '';
    qtyToAdd.value = 1;
};

const removeProductFromCombo = (index) => form.items.splice(index, 1);
const addTier = () => form.wholesaleTiers.push({ minQty: 0, price: 0, incentive: 0 });
const removeTier = (index) => form.wholesaleTiers.splice(index, 1);

const resetForm = () => {
    isEditing.value = false;
    form.id = null;
    form.name = '';
    form.items = [];
    form.retailPrice = 0;
    form.sellerIncentive = 0;
    form.enableWholesale = true; // 🌟 Reset Toggle to True
    form.wholesaleTiers = [{ minQty: 2, price: 0, incentive: 0 }];
    comboImage.value = null;
    productSearchTerm.value = '';
};

const editCombo = (combo) => {
    isEditing.value = true;
    form.id = combo.id;
    form.name = combo.name;
    form.items = JSON.parse(JSON.stringify(combo.items));
    form.retailPrice = combo.retailPrice;
    form.sellerIncentive = combo.sellerIncentive || 0;
    form.enableWholesale = combo.enableWholesale !== false; // 🌟 Load Toggle State
    form.wholesaleTiers = JSON.parse(JSON.stringify(combo.wholesaleTiers));
    comboImage.value = combo.image || null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

const saveCombo = async () => {
    if (form.items.length < 2) return notification.error("ឈុតត្រូវមានទំនិញយ៉ាងតិច ២មុខ");
    isSaving.value = true;
    
    try {
        const comboData = {
            name: form.name,
            items: form.items,
            totalBaseCost: Number(totalComboBaseCost.value),
            retailPrice: Number(form.retailPrice),
            sellerIncentive: Number(form.sellerIncentive),
            enableWholesale: form.enableWholesale, // 🌟 Save Toggle State
            wholesaleTiers: form.wholesaleTiers,
            image: comboImage.value,
            updatedAt: new Date().toISOString()
        };

        if (isEditing.value && form.id) {
            await setDoc(doc(db, 'combos', form.id), comboData, { merge: true });
            const idx = combos.value.findIndex(c => c.id === form.id);
            if (idx > -1) combos.value[idx] = { id: form.id, ...comboData, createdAt: combos.value[idx].createdAt };
            notification.success("កែប្រែឈុតបានជោគជ័យ");
        } else {
            comboData.createdAt = new Date().toISOString();
            const docRef = await addDoc(collection(db, 'combos'), comboData);
            combos.value.unshift({ id: docRef.id, ...comboData });
            notification.success("បង្កើតឈុតថ្មីបានជោគជ័យ");
        }
        resetForm();
    } catch (error) {
        notification.error("មិនអាចរក្សាទុកឈុតនេះបានទេ");
    } finally {
        isSaving.value = false;
    }
};

const openDeleteModal = (combo) => {
    comboToDelete.value = combo;
    showDeleteModal.value = true;
};

const closeDeleteModal = () => {
    showDeleteModal.value = false;
    comboToDelete.value = null;
};

const executeDelete = async () => {
    if (!comboToDelete.value) return;
    isDeleting.value = true;
    try {
        await deleteDoc(doc(db, 'combos', comboToDelete.value.id));
        combos.value = combos.value.filter(c => c.id !== comboToDelete.value.id);
        notification.success("ឈុតត្រូវបានលុបចេញពីប្រព័ន្ធ");
        closeDeleteModal();
    } catch (e) {
        notification.error("មានបញ្ហាក្នុងការលុប");
    } finally {
        isDeleting.value = false;
    }
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.animate-fade-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.animate-slide-up { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }

/* 🌟 បន្ថែម CSS ធ្វើឱ្យពណ៌ស្លេកពេលបិទ Toggle 🌟 */
.grayscale { filter: grayscale(100%); }
</style>