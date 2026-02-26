<template>
    <div class="animate-fade-in">
        
        <div class="mb-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <div class="relative w-full md:w-96">
                <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">🔍</span>
                <input 
                    :value="searchQuery" 
                    @input="$emit('update:searchQuery', $event.target.value)"
                    type="text" 
                    placeholder="ស្វែងរកឈ្មោះ ឬ Barcode..." 
                    class="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:border-amber-500 outline-none transition-all focus:ring-1 focus:ring-amber-500/50"
                >
            </div>
            <span class="text-xs text-neutral-500">កំពុងបង្ហាញទំព័រទី {{ currentPage }} (សរុប {{ filteredStock.length }})</span>
        </div>

        <div v-if="filteredStock.length === 0" class="flex flex-col items-center justify-center h-64 text-neutral-500">
            <div class="text-4xl mb-3">😕</div>
            <p>រកមិនឃើញទិន្នន័យទេ</p>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div v-for="item in paginatedStock" :key="item.id" class="bg-neutral-800 rounded-xl border border-neutral-700/50 overflow-hidden hover:border-amber-500/50 transition-all group shadow-lg flex flex-col">
                
                <div class="relative h-40 bg-neutral-900 shrink-0">
                    <img :src="item.image || 'https://via.placeholder.com/300x200?text=No+Image'" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity">
                    <div class="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] text-white font-mono border border-white/10">
                        {{ item.barcode }}
                    </div>
                    <div class="absolute bottom-2 left-2 bg-amber-500 text-black text-xs font-bold px-2 py-0.5 rounded">
                        {{ item.currency === 'USD' ? '$' : '៛' }}
                    </div>
                </div>

                <div class="p-4 flex-1 flex flex-col">
                    <h3 class="text-lg font-bold text-white mb-1 truncate" :title="item.name">{{ item.name }}</h3>
                    
                    <div class="flex flex-col gap-1 text-sm text-neutral-400 mb-3 border-b border-neutral-700/50 pb-2">
                        <div class="flex justify-between items-center">
                            <span>ស្តុកធំ (Bulk):</span>
                            <span class="text-emerald-400 font-bold bg-emerald-400/10 px-2 py-0.5 rounded text-xs" v-html="getFormattedBulkStock(item)"></span>
                        </div>
                        <div class="flex justify-between items-center mt-1">
                            <span>ស្តុករាយសរុប (Total):</span>
                            <span class="text-blue-400 font-black bg-blue-400/10 px-2 py-0.5 rounded text-xs border border-blue-400/20">
                                {{ getExactRetailStock(item) }} {{ translateRetailUnit(item) }}
                            </span>
                        </div>
                        <div v-if="item.stock_reserved > 0" class="flex justify-end mt-1">
                            <span class="text-[10px] text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded font-bold" title="មានគេចុចបញ្ចូលកន្ត្រក តែមិនទាន់ទូទាត់ប្រាក់">
                                🔒 កំពុងជាប់កក់: {{ getExactReservedRetailStock(item) }} {{ translateRetailUnit(item) }}
                            </span>
                        </div>
                    </div>

                    <div v-if="item.unit === 'case'" class="text-xs text-neutral-500 mb-3 bg-neutral-900 p-2 rounded">
                        ១ កេះ = {{ item.itemsPerCase }} ដប/កញ្ចប់
                    </div>

                    <div class="mt-auto flex justify-between items-end pt-2">
                        <div>
                            <p class="text-[10px] text-neutral-500">តម្លៃដើម/ឯកតា</p>
                            <p class="text-amber-400 font-bold">{{ formatPrice(item.unitCost, item.currency) }}</p>
                        </div>
                        <div class="flex gap-2">
                            <button @click="$emit('edit', item)" class="p-2 bg-neutral-700 hover:bg-blue-600 text-white rounded-lg transition-colors" title="កែប្រែ">✏️</button>
                            <button @click="$emit('delete', item)" class="p-2 bg-neutral-700 hover:bg-red-600 text-white rounded-lg transition-colors" title="លុប">🗑️</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div v-if="totalPages > 1" class="flex justify-center gap-2 mt-8">
            <button @click="$emit('page-change', currentPage - 1)" :disabled="currentPage === 1" class="px-4 py-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 disabled:opacity-50 text-sm">Previous</button>
            <span class="px-4 py-2 bg-neutral-900 rounded-lg border border-neutral-700 text-amber-500 font-bold">{{ currentPage }} / {{ totalPages }}</span>
            <button @click="$emit('page-change', currentPage + 1)" :disabled="currentPage === totalPages" class="px-4 py-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 disabled:opacity-50 text-sm">Next</button>
        </div>

    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    filteredStock: Array,
    paginatedStock: Array,
    searchQuery: String,
    currentPage: Number,
    totalPages: Number
});

const emit = defineEmits(['update:searchQuery', 'edit', 'delete', 'page-change']);

const formatPrice = (val, currency) => {
    return val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + (currency === 'USD' ? ' $' : ' ៛');
};

const translateUnit = (unit) => {
    const map = { bottle: 'ដប', case: 'កេះ', pack: 'កញ្ចប់', can: 'កំប៉ុង', kg: 'គីឡូ' };
    return map[unit] || unit;
};

const translateRetailUnit = (item) => {
    if (item.unit === 'case') return 'ដប/កញ្ចប់'; 
    return translateUnit(item.unit);
};

const getExactRetailStock = (item) => {
    const qty = Number(item.quantity) || 0;
    if (item.unit === 'case') return Math.round(qty * (Number(item.itemsPerCase) || 1));
    return Math.round(qty);
};

const getExactReservedRetailStock = (item) => {
    const reserved = Number(item.stock_reserved) || 0;
    if (item.unit === 'case') return Math.round(reserved * (Number(item.itemsPerCase) || 1));
    return Math.round(reserved);
};

const getFormattedBulkStock = (item) => {
    const qty = Number(item.quantity) || 0;
    if (item.unit !== 'case') return `${Math.round(qty)} ${translateUnit(item.unit)}`;
    
    const perCase = Number(item.itemsPerCase) || 1;
    const totalRetail = Math.round(qty * perCase);
    const fullCases = Math.floor(totalRetail / perCase);
    const remainingRetail = totalRetail % perCase;
    const decimalDisplay = qty.toFixed(2).replace(/\.00$/, ''); 
    
    let readableStr = `${fullCases} កេះ`;
    if (remainingRetail > 0) {
        readableStr += ` ${remainingRetail} ${translateRetailUnit(item)}`;
        return `${decimalDisplay} កេះ <span class="text-[10px] text-neutral-400 font-normal ml-1 border-l border-neutral-600 pl-1">(${readableStr})</span>`;
    }
    return `${decimalDisplay} កេះ`;
};
</script>