<template>
  <div v-if="displayedDataLength > 0 && activityFilter !== 'inactive'" class="absolute bottom-6 left-0 right-0 px-4 md:px-8 pointer-events-none flex justify-center z-50 animate-slide-up">
     <div class="bg-white/90 backdrop-blur-xl border border-white shadow-[0_10px_40px_rgba(0,0,0,0.1)] p-4 md:px-8 md:py-4 rounded-3xl md:rounded-[2rem] pointer-events-auto flex flex-col md:flex-row items-center gap-4 md:gap-8 max-w-5xl w-full">
        <div class="flex items-center gap-3 w-full md:w-auto border-b md:border-b-0 md:border-r border-slate-200 pb-3 md:pb-0 md:pr-8 shrink-0">
           <div class="w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-md shadow-indigo-500/30">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
           </div>
           <div>
              <p class="text-slate-400 text-[10px] font-black uppercase tracking-widest">សរុបរួម</p>
              <p class="text-slate-800 font-black text-sm uppercase">Grand Total</p>
           </div>
        </div>
        <div class="flex-1 flex justify-between md:justify-end items-center gap-6 w-full overflow-x-auto no-scrollbar">
           <div class="flex items-center gap-2">
                <template v-if="Object.keys(grandTotals.all.units).length > 0">
                    <template v-for="(count, unit) in grandTotals.all.units" :key="unit">
                        <span class="text-xs font-black text-slate-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm whitespace-nowrap">
                            {{ count.toLocaleString() }} {{ translateUnit(unit) }}
                        </span>
                    </template>
                </template>
            </div>
           <div class="h-10 w-px bg-slate-200 hidden md:block"></div>
           <div class="text-right shrink-0">
              <p class="text-xl md:text-2xl font-black text-emerald-600 leading-none">{{ grandTotals.all.usd.toLocaleString() }} <span class="text-sm opacity-80">$</span></p>
              <p class="text-xs font-bold text-blue-600 mt-1">{{ grandTotals.all.khr.toLocaleString() }} ៛</p>
           </div>
        </div>
     </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  grandTotals: { type: Object, required: true },
  activityFilter: { type: String, required: true },
  displayedDataLength: { type: Number, required: true },
  availableUnits: { type: Array, required: true }
});

const translateUnit = (unitVal) => {
  if (!unitVal) return '';
  const found = props.availableUnits.find(u => u.value === unitVal);
  if (found) return found.label;
  const u = unitVal.toLowerCase().trim();
  if (u === 'bottle' || u === 'bottles') return 'ដប';
  if (u === 'pack' || u === 'packs') return 'កញ្ចប់';
  return unitVal; 
};
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
</style>