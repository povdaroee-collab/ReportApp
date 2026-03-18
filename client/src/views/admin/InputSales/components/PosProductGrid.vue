<template>
    <div class="flex-1 flex flex-col h-full bg-[#F4F7FE] relative overflow-hidden">
        <div class="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 p-3 md:p-4 shadow-sm z-20 shrink-0">
            <div class="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-3 md:gap-4">
                
                <div class="flex items-center gap-3 w-full xl:w-auto">
                    <button @click="$router.back()" class="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors shrink-0">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                    </button>
                    <div>
                        <h1 class="text-lg md:text-xl font-black text-slate-800 leading-tight">ប្រព័ន្ធបញ្ជូលការលក់ (POS)</h1>
                        <p class="text-slate-500 text-[9px] md:text-[10px] font-bold uppercase tracking-wider mt-0.5">Smart Auto-Pricing POS</p>
                    </div>
                </div>

                <div class="flex items-center justify-between sm:justify-start gap-2 w-full xl:w-auto">
                    <div class="relative flex-1 sm:w-64 md:w-80 shrink-0">
                        <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </span>
                        <input :value="searchQuery" @input="$emit('update:searchQuery', $event.target.value)" type="text" placeholder="ស្វែងរកទំនិញ ឬ ឈុត..." class="w-full bg-slate-100/80 border border-slate-200/60 rounded-xl pl-9 pr-4 py-2 text-[13px] md:text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none transition-all shadow-inner">
                    </div>

                   <button @click="showOnlyCombos = !showOnlyCombos" 
                        class="px-3 py-2 border rounded-xl flex items-center gap-1.5 font-black text-xs md:text-sm transition-all shadow-sm shrink-0"
                        :class="showOnlyCombos ? 'bg-orange-50 text-orange-600 border-orange-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'">
                        <span v-if="!showOnlyCombos">🎁</span>
                        <span v-else><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg></span>
                        <span class="hidden sm:inline">{{ showOnlyCombos ? 'បង្ហាញទំនិញទាំងអស់' : 'បង្ហាញទំនិញឈុត' }}</span>
                        <span class="sm:hidden">{{ showOnlyCombos ? 'ទាំងអស់' : 'ឈុត' }}</span>
                    </button>

                    <div class="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
                        <button @click="viewMode = 'card'" class="p-1.5 rounded-lg transition-all" :class="viewMode === 'card' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                        </button>
                        <button @click="viewMode = 'compact'" class="p-1.5 rounded-lg transition-all" :class="viewMode === 'compact' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        </button>
                    </div>
                </div>

            </div>
        </div>

        <div class="flex-1 overflow-y-auto p-3 md:p-6 custom-scrollbar relative pb-28 md:pb-6 touch-pan-y">
            
            <div v-if="isLoadingProducts" class="flex flex-col items-center justify-center h-full opacity-60">
                <div class="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-blue-600 mb-4"></div>
                <p class="text-xs font-bold text-slate-500">កំពុងទាញយកទំនិញ និងឈុត...</p>
            </div>
            
            <div v-else-if="finalProducts.length === 0" class="flex flex-col items-center justify-center h-full text-slate-400">
                <svg class="w-16 h-16 mb-2 opacity-50 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                <p class="font-bold text-sm">រកមិនឃើញទំនិញទេ</p>
                <p class="text-[10px] mt-1 text-slate-400">សូមសាកល្បងស្វែងរកម្ដងទៀត ឬដក Filter ចេញ</p>
            </div>
            
            <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-5 max-w-[100rem] mx-auto animate-fade-in">
                
                <div v-for="product in finalProducts" :key="product.id" @click="$emit('add-to-cart', product)" 
                    class="bg-white border border-slate-200 shadow-sm transition-all cursor-pointer group relative flex flex-col select-none" 
                    :class="[
                        getTotalRetailStock(product) > 0 ? 'hover:shadow-md hover:border-blue-400 active:scale-95' : 'opacity-60 cursor-not-allowed grayscale-[50%]',
                        viewMode === 'card' ? 'rounded-2xl md:rounded-[1.25rem] p-2.5 md:p-3 h-full' : 'rounded-xl p-3 justify-between h-24 md:h-28'
                    ]">
                    
                    <template v-if="viewMode === 'card'">
                        <div v-if="product.isCombo" class="absolute -top-2 -left-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[9px] md:text-[10px] font-black px-2 py-1 rounded-lg shadow-md z-10 flex items-center gap-1 border border-orange-200">🎁 ឈុត</div>
                        <div class="w-full aspect-square rounded-xl bg-slate-50 mb-2.5 md:mb-3 overflow-hidden border border-slate-100 relative flex items-center justify-center shrink-0">
                            <img v-if="product.image && (product.image.startsWith('http') || product.image.startsWith('data:image'))" :src="product.image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                            <div v-else class="text-slate-300 text-3xl font-black">{{ product.name.charAt(0) }}</div>
                            
                            <div class="absolute top-1.5 right-1.5 md:top-2 md:right-2 px-2 py-1 rounded text-[9px] md:text-[10px] font-black bg-white/95 backdrop-blur-sm border shadow-sm" :class="getTotalRetailStock(product) > 0 ? 'text-emerald-600 border-emerald-100' : 'text-rose-600 border-rose-100'">
                                {{ formatComplexStock(product) }}
                            </div>

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
                    </template>

                    <template v-else>
                        <div class="flex justify-between items-start gap-2">
                            <div class="flex-1 min-w-0">
                                <h3 class="font-black text-[11px] md:text-[13px] text-slate-800 leading-tight mb-0.5 line-clamp-2 group-hover:text-blue-600 transition-colors">{{ product.name }}</h3>
                                <div class="flex items-center gap-1.5">
                                    <span class="text-[8px] md:text-[9px] text-slate-400 font-mono line-clamp-1">{{ product.barcode || 'NO-BARCODE' }}</span>
                                    <span v-if="product.isCombo" class="bg-orange-100 text-orange-600 px-1.5 py-[1px] rounded text-[8px] font-black shrink-0">🎁 ឈុត</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="flex justify-between items-end mt-2 pt-2 border-t border-slate-100/60">
                            <div class="text-[9px] md:text-[10px] font-black" :class="getTotalRetailStock(product) > 0 ? 'text-emerald-600' : 'text-rose-600'">
                                <span v-if="getTotalRetailStock(product) <= 0" class="bg-rose-100 px-1.5 py-0.5 rounded">អស់ស្តុក</span>
                                <span v-else>{{ formatComplexStock(product) }}</span>
                            </div>
                            <div class="text-[12px] md:text-[14px] font-black text-indigo-600">{{ formatPrice(product.retailPrice, product.currency) }}</div>
                        </div>
                    </template>

                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
    searchQuery: String,
    isLoadingProducts: Boolean,
    filteredProducts: Array,
    getTotalRetailStock: Function,
    formatComplexStock: Function,
    translateHardcodedUnit: Function,
    formatPrice: Function
});

defineEmits(['update:searchQuery', 'add-to-cart']);

// 🌟 Local States for UI Controls 🌟
const viewMode = ref('card'); // 'card' or 'compact'
const showOnlyCombos = ref(false);

// 🌟 Compute final product list based on local Combo filter 🌟
const finalProducts = computed(() => {
    let list = props.filteredProducts;
    if (showOnlyCombos.value) {
        list = list.filter(p => p.isCombo);
    }
    return list;
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #94a3b8; }
.animate-fade-in { animation: fadeIn 0.2s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
</style>