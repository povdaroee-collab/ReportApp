<template>
  <div class="flex-none bg-white/80 backdrop-blur-2xl border-b border-slate-200/60 z-40 transition-all shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
    <div class="px-4 md:px-8 py-4 md:py-5">
      
      <div class="flex flex-col xl:flex-row xl:items-center justify-between gap-5 mb-5">
        <div class="flex items-center gap-4">
           <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white shrink-0">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
           </div>
           <div>
             <h1 class="text-2xl md:text-3xl font-black text-slate-800 tracking-tight leading-tight">របាយការណ៍រួម</h1>
             <p class="text-slate-500 text-[11px] md:text-xs font-bold mt-0.5 uppercase tracking-wider">ទិន្នន័យការលក់របស់អ្នកគ្រប់គ្រង</p>
           </div>
        </div>

        <div class="bg-slate-100/80 p-1.5 rounded-2xl flex overflow-x-auto no-scrollbar w-full xl:w-auto shadow-inner border border-slate-200/50 shrink-0">
           <button 
             v-for="tab in filterTabs" 
             :key="tab.key"
             @click="$emit('update:dateFilterType', tab.key)"
             class="flex-1 xl:flex-none px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all duration-300 whitespace-nowrap relative"
             :class="dateFilterType === tab.key ? 'text-indigo-600 shadow-md bg-white' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'"
           >
             {{ tab.label }}
           </button>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-3 animate-fade-in min-h-[42px]">
          <div v-if="isLoading" class="text-xs text-indigo-500 font-bold flex items-center gap-2 bg-indigo-50 px-4 py-2.5 rounded-xl border border-indigo-100">
              <div class="w-4 h-4 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              កំពុងទាញយកទិន្នន័យ...
          </div>
          
          <template v-else>
              <div v-if="dateFilterType === 'daily'" class="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-colors focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 w-full sm:w-auto">
                 <span class="text-slate-400 text-[10px] font-black uppercase tracking-wider">ថ្ងៃទី</span>
                 <input :value="selectedDate" @input="$emit('update:selectedDate', $event.target.value)" type="date" class="w-full bg-transparent border-none text-slate-700 font-bold text-sm focus:ring-0 outline-none p-0 cursor-pointer">
              </div>

              <div v-if="dateFilterType === 'monthly'" class="flex gap-2 w-full sm:w-auto">
                 <div class="relative group flex-1 sm:flex-none">
                    <select :value="selectedMonth" @change="$emit('update:selectedMonth', $event.target.value)" class="w-full appearance-none bg-white border border-slate-200 pl-4 pr-10 py-2.5 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm cursor-pointer min-w-[140px] hover:border-indigo-300 transition-all">
                       <option v-for="m in availableMonths" :key="m.index" :value="m.index">{{ m.name }}</option>
                    </select>
                    <svg class="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                 </div>
                 <div class="relative group flex-1 sm:flex-none">
                    <select :value="selectedYear" @change="$emit('update:selectedYear', $event.target.value)" class="w-full appearance-none bg-white border border-slate-200 pl-4 pr-10 py-2.5 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm cursor-pointer hover:border-indigo-300 transition-all">
                       <option v-for="y in availableYears" :key="y" :value="y">{{ y }}</option>
                    </select>
                    <svg class="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                 </div>
              </div>

              <div v-if="dateFilterType === 'yearly'" class="relative group w-full sm:w-auto">
                 <select :value="selectedYear" @change="$emit('update:selectedYear', $event.target.value)" class="w-full appearance-none bg-white border border-slate-200 pl-4 pr-10 py-2.5 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm cursor-pointer min-w-[120px] hover:border-indigo-300 transition-all">
                    <option v-for="y in availableYears" :key="y" :value="y">{{ y }}</option>
                 </select>
                 <svg class="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
              </div>

               <div v-if="dateFilterType === 'custom'" class="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-colors focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 w-full sm:w-auto">
                 <input :value="customStart" @input="$emit('update:customStart', $event.target.value)" type="date" class="w-full flex-1 bg-transparent border-none text-slate-700 font-bold text-sm focus:ring-0 outline-none p-0 cursor-pointer">
                 <div class="w-4 h-px bg-slate-300"></div>
                 <input :value="customEnd" @input="$emit('update:customEnd', $event.target.value)" type="date" class="w-full flex-1 bg-transparent border-none text-slate-700 font-bold text-sm focus:ring-0 outline-none p-0 cursor-pointer">
              </div>
          </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  dateFilterType: String,
  selectedDate: String,
  selectedMonth: [String, Number],
  selectedYear: [String, Number],
  customStart: String,
  customEnd: String,
  availableYears: Array,
  availableMonths: Array,
  isLoading: Boolean
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
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.animate-fade-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
</style>