<template>
  <div>
    <div v-if="filteredSellers.length === 0" class="flex-1 flex items-center justify-center py-20 print:hidden">
        <div class="text-center bg-white p-12 rounded-[2rem] border-2 border-dashed border-slate-200">
            <div class="w-20 h-20 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <p class="text-slate-500 font-bold text-xl">មិនមានទិន្នន័យទេ</p>
            <p class="text-slate-400 text-sm mt-2">សូមព្យាយាមស្វែងរកម្ដងទៀត ឬផ្លាស់ប្តូរកាលបរិច្ឆេទ</p>
        </div>
    </div>

    <div v-else-if="activeTab === 'sellers'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in print:hidden">
        <div 
            v-for="seller in paginatedSellers" 
            :key="seller.id" 
            @click="$emit('goToSellerDetail', seller.id)"
            class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all flex flex-col justify-between group cursor-pointer"
        >
            <div class="flex gap-4 items-start">
                <img :src="seller.photoUrl || `https://ui-avatars.com/api/?name=${seller.fullName}`" class="w-16 h-16 rounded-2xl object-cover border border-slate-100 shadow-sm group-hover:scale-105 transition-transform shrink-0">
                <div class="flex-1 min-w-0">
                    <h4 class="font-black text-slate-800 text-lg truncate leading-tight mb-1 group-hover:text-indigo-600 transition-colors">{{ seller.fullName }}</h4>
                    <p class="text-xs font-mono text-slate-500 mb-2 truncate">ID: {{ seller.idNumber || 'N/A' }}</p>
                    <a v-if="seller.telegram" :href="'https://t.me/' + seller.telegram.replace('@', '')" target="_blank" @click.stop class="inline-flex items-center gap-1.5 text-[11px] font-bold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-lg hover:bg-sky-500 hover:text-white transition-colors">
                        <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.48-.94-2.4-1.54-1.06-.7-.37-1.09.23-1.72.16-.16 2.87-2.63 2.92-2.85.01-.03.01-.14-.06-.2-.06-.06-.17-.04-.25-.02-.11.02-1.91 1.2-5.39 3.55-.5.34-.95.51-1.35.5-.44-.01-1.29-.25-1.92-.42-.77-.21-1.37-.32-1.31-.68.03-.18.28-.37.76-.56 3.03-1.32 5.06-2.19 6.09-2.62 2.93-1.21 3.53-1.43 3.93-1.43.09 0 .28.01.4.04.1.03.24.1.33.25.08.16.07.32.07.33z"/></svg>
                        @{{ seller.telegram.replace('@', '') }}
                    </a>
                </div>
            </div>
            <div class="mt-5 pt-4 border-t border-slate-100 flex flex-col gap-2">
                <span class="bg-slate-50 px-3 py-2 rounded-xl flex items-center justify-center text-sm font-bold text-slate-600 gap-2 border border-slate-100">
                    <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                    {{ seller.phoneNumber || 'N/A' }}
                </span>
            </div>
        </div>
    </div>

    <div v-else-if="activeTab === 'report'" class="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm animate-fade-in print:hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse min-w-[900px]">
                <thead class="bg-slate-50 text-slate-500 text-[11px] uppercase font-black tracking-widest border-b border-slate-200">
                    <tr>
                        <th class="px-6 py-5 text-center w-16 whitespace-nowrap">#</th>
                        <th class="px-6 py-5 whitespace-nowrap">តំណាងលក់</th>
                        <th class="px-6 py-5 whitespace-nowrap w-48">ប្រភេទ (ទំនិញ)</th>
                        <th class="px-6 py-5 w-[25%] whitespace-nowrap">ចំនួនលក់ (UNITS)</th>
                        <th class="px-6 py-5 text-center whitespace-nowrap">ការលក់ (TYPE)</th>
                        <th class="px-6 py-5 text-center whitespace-nowrap">អតិថិជន</th>
                        <th class="px-6 py-5 text-right whitespace-nowrap">ចំណូល</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    <tr 
                        v-for="(seller, index) in paginatedSellers" 
                        :key="seller.uniqueId" 
                        @click="$emit('goToSellerDetail', seller.id)"
                        class="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    >
                        <td class="px-6 py-4 text-center text-sm font-bold text-slate-400 align-top pt-6">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                        
                        <td class="px-6 py-4 align-top pt-5">
                            <div class="flex items-center gap-4">
                                <img :src="seller.photoUrl || `https://ui-avatars.com/api/?name=${seller.fullName}`" class="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-sm shrink-0">
                                <p class="font-bold text-base text-slate-800 transition-colors group-hover:text-indigo-600">{{ seller.fullName }}</p>
                            </div>
                        </td>
                        
                        <td class="px-6 py-4 align-top pt-6">
                            <span v-if="seller.hasSales" class="font-bold text-slate-700 text-sm bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                                {{ seller.productName }}
                            </span>
                            <span v-else class="text-slate-300 font-bold">-</span>
                        </td>

                        <td class="px-6 py-4 align-top pt-5">
                            <div v-if="seller.hasSales" class="flex flex-wrap gap-2 items-center mt-1">
                                <template v-for="(count, unit, idx) in (seller.unitCounts || {})" :key="unit">
                                    <span v-if="idx < 3 || expandedRowIds.has(seller.uniqueId)" class="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold shadow-sm border whitespace-nowrap" :class="getAppBadgeClass(unit)">
                                        {{ count.toLocaleString() }} {{ translateUnit(unit) }}
                                    </span>
                                </template>
                                <button v-if="Object.keys(seller.unitCounts || {}).length > 3" @click.stop="toggleRowExpand(seller.uniqueId)" class="text-[11px] text-indigo-600 font-bold hover:text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-lg transition-colors border border-indigo-100 whitespace-nowrap">
                                    <span v-if="!expandedRowIds.has(seller.uniqueId)">+{{ Object.keys(seller.unitCounts).length - 3 }} ទៀត</span>
                                    <span v-else>បង្រួម</span>
                                </button>
                            </div>
                            <span v-else class="text-xs font-bold text-slate-300 mt-1 block">គ្មានការលក់</span>
                        </td>

                        <td class="px-6 py-4 text-center align-top pt-6">
                            <span v-if="seller.hasSales" :class="seller.saleType === 'បោះដុំ' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-indigo-50 text-indigo-600 border-indigo-200'" class="px-3 py-1.5 rounded-lg text-[11px] font-black border tracking-wider">
                                {{ seller.saleType }}
                            </span>
                            <span v-else class="text-slate-300 font-bold">-</span>
                        </td>

                        <td class="px-6 py-4 text-center align-top pt-6">
                            <span v-if="seller.hasSales" class="inline-flex items-center px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-xs font-bold border border-amber-100 shadow-sm">{{ seller.totalClients?.toLocaleString() || 0 }} នាក់</span>
                            <span v-else class="text-xs text-slate-300 font-bold">-</span>
                        </td>

                        <td class="px-6 py-4 text-right align-top pt-5">
                            <div v-if="seller.hasSales" class="flex flex-col items-end leading-tight gap-1.5">
                                <span class="text-emerald-700 font-black text-sm bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-100 shadow-sm">{{ seller.revenueUSD?.toLocaleString() || 0 }} $</span>
                                <span class="text-blue-600 font-bold text-xs">{{ seller.revenueKHR?.toLocaleString() || 0 }} ៛</span>
                            </div>
                            <span v-else class="text-sm text-slate-300 font-bold">-</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <div v-if="totalPages > 1" class="mt-6 flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm print:hidden">
        <p class="text-xs font-bold text-slate-500 pl-2">
            បង្ហាញទំព័រ {{ currentPage }} នៃ {{ totalPages }}
        </p>
        <div class="flex items-center gap-1.5">
            <button @click="$emit('prevPage')" :disabled="currentPage === 1" class="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <button v-for="p in totalPages" :key="p" @click="$emit('goToPage', p)" class="w-9 h-9 flex items-center justify-center rounded-xl font-bold text-sm transition-colors border" :class="currentPage === p ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'">
                {{ p }}
            </button>
            <button @click="$emit('nextPage')" :disabled="currentPage === totalPages" class="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
    activeTab: String,
    filteredSellers: Array,
    paginatedSellers: Array,
    currentPage: Number,
    totalPages: Number,
    itemsPerPage: Number,
    unitSettings: Array
});

const emit = defineEmits(['goToPage', 'prevPage', 'nextPage', 'goToSellerDetail']);

const expandedRowIds = ref(new Set());

const toggleRowExpand = (id) => {
    const newSet = new Set(expandedRowIds.value);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    expandedRowIds.value = newSet;
};

const translateUnit = (unitVal) => {
    if (!unitVal) return '';
    const safeVal = String(unitVal);
    const found = props.unitSettings.find(u => String(u.value) === safeVal);
    if (found) return found.label;
    const u = safeVal.toLowerCase().trim();
    if (u === 'bottle' || u === 'bottles') return 'ដប';
    if (u === 'pack' || u === 'packs') return 'កញ្ចប់';
    if (u === 'case' || u === 'cases') return 'កេះ';
    return safeVal; 
};

const getAppBadgeClass = (unitVal) => {
    if (!unitVal) return 'text-slate-700 bg-slate-50 border-slate-200';
    const safeVal = String(unitVal);
    const found = props.unitSettings.find(u => String(u.value) === safeVal);
    const color = found ? found.color : 'slate';
    const colorMap = {
        cyan: 'text-cyan-700 bg-cyan-50 border-cyan-200',
        purple: 'text-purple-700 bg-purple-50 border-purple-200',
        amber: 'text-amber-700 bg-amber-50 border-amber-200',
        rose: 'text-rose-700 bg-rose-50 border-rose-200',
        emerald: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        blue: 'text-blue-700 bg-blue-50 border-blue-200',
        slate: 'text-slate-700 bg-slate-50 border-slate-200'
    };
    return colorMap[color] || colorMap['slate'];
};
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }

/* បន្ថែម CSS ខាងក្រោមដើម្បីឱ្យ Font ខ្មែរដើរស្អាតពេល Print / Export PDF */
@media print {
    * {
        font-family: 'Battambang', 'Khmer OS Siemreap', sans-serif !important;
    }
}
</style>