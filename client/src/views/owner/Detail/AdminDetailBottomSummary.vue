<template>
  <div class="w-full flex justify-center mt-6 animate-slide-up print:hidden font-khmer">
    <div class="bg-white border border-slate-200 shadow-sm p-4 md:px-8 md:py-4 rounded-3xl flex flex-col md:flex-row items-center gap-4 md:gap-8 w-full transition-all hover:shadow-md">
        <div class="flex items-center gap-3 w-full md:w-auto border-b md:border-b-0 md:border-r border-slate-200 pb-3 md:pb-0 md:pr-8 shrink-0">
            <div class="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm border border-indigo-100 shrink-0">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
            </div>
            <div>
                <p class="text-slate-400 text-[11px] font-black uppercase tracking-widest">សរុបរួម</p>
                <p class="text-slate-800 font-black text-base uppercase">Grand Total</p>
            </div>
        </div>
        <div class="flex-1 flex justify-between md:justify-end items-center gap-6 w-full overflow-x-auto no-scrollbar">
            <div class="flex items-center gap-2">
                <template v-if="Object.keys(grandTotals.all.units).length > 0">
                    <template v-for="(count, unit, idx) in grandTotals.all.units" :key="unit">
                        <span v-if="idx < 3 || expandedRowIds.has('grandTotal')" class="text-sm font-black text-slate-700 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm whitespace-nowrap">
                            {{ count.toLocaleString() }} {{ translateUnit(unit) }}
                        </span>
                    </template>
                    <button 
                        v-if="Object.keys(grandTotals.all.units).length > 3" 
                        @click.stop="toggleRowExpand('grandTotal')" 
                        class="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-2 rounded-xl transition-colors flex items-center gap-1 border border-indigo-100 whitespace-nowrap shadow-sm"
                    >
                        <span v-if="!expandedRowIds.has('grandTotal')">+{{ Object.keys(grandTotals.all.units).length - 3 }} ទៀត</span>
                        <span v-else>បង្រួម</span>
                    </button>
                </template>
            </div>
            <div class="h-10 w-px bg-slate-200 hidden md:block shrink-0"></div>
            <div class="text-right shrink-0 flex items-center gap-5">
                <div>
                    <p class="text-[11px] text-slate-400 font-bold uppercase mb-0.5">អតិថិជនសរុប</p>
                    <p class="text-base font-black text-slate-700">{{ grandTotals.all.clients.toLocaleString() }} <span class="text-xs font-bold text-slate-400">នាក់</span></p>
                </div>
                <div class="h-10 w-px bg-slate-200 hidden md:block"></div>
                <div>
                    <p class="text-2xl font-black text-emerald-600 leading-none">{{ grandTotals.all.usd.toLocaleString() }} <span class="text-base opacity-80">$</span></p>
                    <p class="text-sm font-bold text-blue-600 mt-1">{{ grandTotals.all.khr.toLocaleString() }} ៛</p>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps } from 'vue';

const props = defineProps({
    grandTotals: Object,
    unitSettings: Array
});

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
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;500;600;700&family=Battambang:wght@400;700;900&display=swap');
.font-khmer { font-family: 'Kantumruy Pro', 'Battambang', sans-serif; }

.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
</style>