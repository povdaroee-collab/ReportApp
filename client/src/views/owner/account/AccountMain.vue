<template>
  <div class="min-h-[100dvh] bg-[#F4F7FE] font-khmer flex flex-col pb-10">
    
    <div class="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div class="max-w-[90rem] mx-auto px-4 md:px-8 py-5">
            <h1 class="font-black text-slate-800 text-2xl flex items-center gap-3">
                <div class="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center border border-indigo-100">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                </div>
                គណនី និងហិរញ្ញវត្ថុ
            </h1>
            <p class="text-sm font-bold text-slate-500 mt-1 pl-13">គ្រប់គ្រងចំណូល ចំណាយ និងវិភាគទិន្នន័យហិរញ្ញវត្ថុ</p>
        </div>

        <div class="max-w-[90rem] mx-auto px-4 md:px-8 mt-2 flex gap-6 border-b border-transparent overflow-x-auto hide-scrollbar">
            <button 
                v-for="tab in tabs" :key="tab.id"
                @click="activeTab = tab.id"
                class="pb-4 px-1 text-sm font-black whitespace-nowrap transition-colors relative"
                :class="activeTab === tab.id ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'"
            >
                {{ tab.name }}
                <div v-if="activeTab === tab.id" class="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-t-full"></div>
            </button>
        </div>
    </div>

    <div class="flex-1 w-full max-w-[90rem] mx-auto p-4 md:p-8 animate-fade-in-up">
        <IncomeTab v-if="activeTab === 'income'" />
        <ExpenseTab v-else-if="activeTab === 'expense'" />
        <AnalysisTab v-else-if="activeTab === 'analysis'" />
        <PayrollTab v-else-if="activeTab === 'payroll'" />
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';

// នាំចូល (Import) ឯកសារ Tab ទាំង ៤
import IncomeTab from './tabs/IncomeTab.vue';
import ExpenseTab from './tabs/ExpenseTab.vue';
import AnalysisTab from './tabs/AnalysisTab.vue';
import PayrollTab from './tabs/PayrollTab.vue';

const activeTab = ref('income');

const tabs = [
    { id: 'income', name: 'ចំណូល (Net Profit)' },
    { id: 'expense', name: 'ចំណាយ' },
    { id: 'analysis', name: 'វិភាគទិន្នន័យ' },
    { id: 'payroll', name: 'ប្រាក់សម្រាប់បុគ្គលិក' }
];
</script>

<style scoped>
/* បន្ថែម Font Kantumruy Pro ដើម្បីឱ្យអក្សរខ្មែរស្អាតដូច MainLayout */
@import url('https://fonts.googleapis.com/css2?family=Battambong:wght@400;700;900&family=Kantumruy+Pro:wght@400;700&display=swap');
.font-khmer { font-family: 'Kantumruy Pro', 'Battambong', sans-serif; }
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.animate-fade-in-up { animation: fadeInUp 0.3s ease-out forwards; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>