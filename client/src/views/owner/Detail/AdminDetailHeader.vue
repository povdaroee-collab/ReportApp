<template>
  <div class="bg-white/90 backdrop-blur-2xl border-b border-slate-200/60 transition-all shadow-sm font-khmer print:hidden">
    <div class="px-4 md:px-8 py-3 md:py-5">
      
      <div class="flex flex-col xl:flex-row xl:items-center justify-between gap-3 md:gap-5 mb-3 md:mb-5">
        <div class="flex items-center gap-3 md:gap-4">
           <button @click="router.back()" class="w-9 h-9 md:w-10 md:h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors">
              <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
           </button>
           <div class="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-br from-slate-700 to-indigo-900 flex items-center justify-center shadow-lg shadow-slate-500/30 text-white shrink-0 relative overflow-hidden">
              <div class="absolute inset-0 bg-white/20 blur-md rounded-full -top-2 -left-2 w-6 h-6 md:w-8 h-8"></div>
              <svg class="w-5 h-5 md:w-6 md:h-6 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
           </div>
           <div>
             <h1 class="text-lg md:text-2xl font-black text-slate-800 tracking-tight leading-tight">ព័ត៌មានលម្អិតអ្នកគ្រប់គ្រង</h1>
             <p class="text-slate-500 text-[10px] md:text-[11px] font-bold mt-0.5 uppercase tracking-wider">Admin Report Details</p>
           </div>
        </div>

        <div class="bg-slate-100/80 p-1 md:p-1.5 rounded-xl md:rounded-2xl flex overflow-x-auto no-scrollbar w-full xl:w-auto shadow-inner border border-slate-200/50 shrink-0 snap-x">
           <button 
             v-for="tab in filterTabs" 
             :key="tab.key"
             @click="$emit('update:dateFilterType', tab.key)"
             class="flex-1 xl:flex-none px-3 md:px-5 py-2 md:py-2.5 rounded-lg md:rounded-xl text-[11px] md:text-sm font-bold transition-all duration-300 whitespace-nowrap relative snap-center"
             :class="dateFilterType === tab.key ? 'text-indigo-600 shadow-md bg-white' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'"
           >
             {{ tab.label }}
           </button>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-2 md:gap-3 animate-fade-in min-h-[38px] md:min-h-[42px]">
          <template v-if="!isLoadingPage">
              
              <div v-if="dateFilterType === 'daily'" class="flex items-center gap-2 md:gap-3 bg-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl border border-slate-200 shadow-sm focus-within:border-indigo-500 w-full sm:w-auto transition-colors">
                 <span class="text-slate-400 text-[10px] font-black uppercase tracking-wider">ថ្ងៃទី</span>
                 <input :value="selectedDate" @input="$emit('update:selectedDate', $event.target.value)" type="date" class="w-full bg-transparent border-none text-slate-700 font-bold text-xs md:text-sm focus:ring-0 outline-none p-0 cursor-pointer">
              </div>

              <div v-if="dateFilterType === 'monthly'" class="flex gap-2 w-full sm:w-auto">
                 <div class="relative group flex-1 sm:flex-none">
                    <select :value="selectedMonth" @change="$emit('update:selectedMonth', $event.target.value)" class="w-full appearance-none bg-white border border-slate-200 pl-3 md:pl-4 pr-8 md:pr-10 py-2 md:py-2.5 rounded-lg md:rounded-xl text-xs md:text-sm font-bold text-slate-700 outline-none shadow-sm cursor-pointer min-w-[120px] md:min-w-[140px] focus:border-indigo-500 transition-colors">
                       <option v-for="m in availableMonths" :key="m.index" :value="m.index">{{ m.name }}</option>
                    </select>
                    <svg class="w-3.5 h-3.5 md:w-4 md:h-4 absolute right-2.5 md:right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/></svg>
                 </div>
                 <div class="relative group flex-1 sm:flex-none">
                    <select :value="selectedYear" @change="$emit('update:selectedYear', $event.target.value)" class="w-full appearance-none bg-white border border-slate-200 pl-3 md:pl-4 pr-8 md:pr-10 py-2 md:py-2.5 rounded-lg md:rounded-xl text-xs md:text-sm font-bold text-slate-700 outline-none shadow-sm cursor-pointer focus:border-indigo-500 transition-colors">
                       <option v-for="y in availableYears" :key="y" :value="y">{{ y }}</option>
                    </select>
                    <svg class="w-3.5 h-3.5 md:w-4 md:h-4 absolute right-2.5 md:right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/></svg>
                 </div>
              </div>

              <div v-if="dateFilterType === 'yearly'" class="relative group w-full sm:w-auto">
                 <select :value="selectedYear" @change="$emit('update:selectedYear', $event.target.value)" class="w-full appearance-none bg-white border border-slate-200 pl-3 md:pl-4 pr-8 md:pr-10 py-2 md:py-2.5 rounded-lg md:rounded-xl text-xs md:text-sm font-bold text-slate-700 outline-none shadow-sm cursor-pointer min-w-[100px] md:min-w-[120px] focus:border-indigo-500 transition-colors">
                    <option v-for="y in availableYears" :key="y" :value="y">{{ y }}</option>
                 </select>
                 <svg class="w-3.5 h-3.5 md:w-4 md:h-4 absolute right-2.5 md:right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/></svg>
              </div>

              <div v-if="dateFilterType === 'custom'" class="flex items-center gap-2 md:gap-3 bg-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl border border-slate-200 shadow-sm focus-within:border-indigo-500 w-full sm:w-auto transition-colors">
                 <input :value="customStart" @input="$emit('update:customStart', $event.target.value)" type="date" class="w-full flex-1 bg-transparent border-none text-slate-700 font-bold text-[11px] md:text-sm focus:ring-0 outline-none p-0 cursor-pointer">
                 <div class="w-3 md:w-4 h-px bg-slate-300"></div>
                 <input :value="customEnd" @input="$emit('update:customEnd', $event.target.value)" type="date" class="w-full flex-1 bg-transparent border-none text-slate-700 font-bold text-[11px] md:text-sm focus:ring-0 outline-none p-0 cursor-pointer">
              </div>
          </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
  dateFilterType: String,
  selectedDate: String,
  selectedMonth: [String, Number],
  selectedYear: [String, Number],
  customStart: String,
  customEnd: String,
  availableYears: Array,
  availableMonths: Array,
  isLoadingPage: Boolean
});

const emit = defineEmits([
  'update:dateFilterType', 
  'update:selectedDate', 
  'update:selectedMonth', 
  'update:selectedYear', 
  'update:customStart', 
  'update:customEnd'
]);

const filterTabs = [
  { key: 'daily', label: 'ប្រចាំថ្ងៃ' },
  { key: 'monthly', label: 'ប្រចាំខែ' },
  { key: 'yearly', label: 'ប្រចាំឆ្នាំ' },
  { key: 'custom', label: 'កំណត់ថ្ងៃ' },
];
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;500;600;700&family=Battambang:wght@400;700;900&display=swap');
.font-khmer { font-family: 'Kantumruy Pro', 'Battambang', sans-serif; }

.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.animate-fade-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
</style>