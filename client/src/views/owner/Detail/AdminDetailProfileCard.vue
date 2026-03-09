<template>
  <div>
    <div class="bg-gradient-to-r from-slate-800 to-indigo-900 p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] text-white relative overflow-hidden shadow-lg mb-6 md:mb-8 print:hidden">
        <div class="absolute -right-10 -top-10 w-32 h-32 md:w-40 md:h-40 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div class="flex flex-row gap-4 md:gap-6 relative z-10 items-center md:items-start">
            <img :src="admin.photoUrl || `https://ui-avatars.com/api/?name=${admin.fullName}`" class="w-16 h-16 md:w-24 md:h-24 rounded-2xl md:rounded-3xl object-cover border-2 md:border-4 border-white/20 shadow-xl shrink-0 bg-white">
            
            <div class="flex-1 min-w-0">
                <h2 class="text-xl md:text-3xl font-black mb-1 md:mb-2 truncate">{{ admin.fullName }}</h2>
                <div class="flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm font-medium text-slate-300 mb-2 md:mb-4">
                    <span class="bg-white/10 px-2 py-0.5 md:px-2.5 md:py-1 rounded-md md:rounded-lg font-mono">@{{ admin.username }}</span>
                    <a v-if="admin.telegram" :href="'https://t.me/' + admin.telegram.replace('@', '')" target="_blank" class="flex items-center gap-1 md:gap-1.5 text-sky-400 hover:text-sky-300 transition-colors">
                        <svg class="w-3.5 h-3.5 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.48-.94-2.4-1.54-1.06-.7-.37-1.09.23-1.72.16-.16 2.87-2.63 2.92-2.85.01-.03.01-.14-.06-.2-.06-.06-.17-.04-.25-.02-.11.02-1.91 1.2-5.39 3.55-.5.34-.95.51-1.35.5-.44-.01-1.29-.25-1.92-.42-.77-.21-1.37-.32-1.31-.68.03-.18.28-.37.76-.56 3.03-1.32 5.06-2.19 6.09-2.62 2.93-1.21 3.53-1.43 3.93-1.43.09 0 .28.01.4.04.1.03.24.1.33.25.08.16.07.32.07.33z"/></svg>
                        {{ admin.telegram }}
                    </a>
                </div>
                
                <div class="flex items-center gap-2">
                    <div class="bg-white/10 px-2.5 py-1 md:px-3 md:py-1.5 rounded-lg flex items-center gap-1.5 md:gap-2 w-fit">
                    <span class="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-400"></span>
                    <span class="text-[10px] md:text-xs font-bold text-white whitespace-nowrap">តំណាងលក់សរុប: {{ totalSellersCount }} នាក់</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 print:hidden">
        
        <div class="flex items-center gap-2 bg-white p-1.5 rounded-xl md:rounded-2xl w-full lg:w-fit border border-slate-200 shadow-sm shrink-0 relative z-30">
            <button 
                @click="$emit('update:activeTab', 'sellers')" 
                :class="activeTab === 'sellers' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:text-slate-800'" 
                class="flex-1 lg:flex-none px-4 md:px-6 py-2 md:py-2.5 rounded-lg md:rounded-xl text-[11px] md:text-sm font-bold transition-all duration-300 whitespace-nowrap"
            >
                បញ្ជីតំណាងលក់
            </button>
            <button 
                @click="$emit('update:activeTab', 'report')" 
                :class="activeTab === 'report' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:text-slate-800'" 
                class="flex-1 lg:flex-none px-4 md:px-6 py-2 md:py-2.5 rounded-lg md:rounded-xl text-[11px] md:text-sm font-bold transition-all duration-300 whitespace-nowrap"
            >
                របាយការណ៍លក់
            </button>
        </div>

        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto bg-white p-2 rounded-xl md:rounded-2xl shadow-sm border border-slate-200 shrink-0 z-20">
            
            <div class="relative w-full sm:w-56 md:w-64 shrink-0">
                <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </span>
                <input :value="searchQuery" @input="$emit('update:searchQuery', $event.target.value)" type="text" placeholder="ស្វែងរកឈ្មោះ ឬ អត្តលេខ..." class="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg md:rounded-xl text-xs md:text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:font-normal">
                <button v-if="searchQuery" @click="$emit('update:searchQuery', '')" class="absolute inset-y-0 right-2 flex items-center text-slate-400 hover:text-rose-500">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
            
            <div class="flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
                
                <div v-if="activeTab === 'report'" class="bg-slate-100 p-1 rounded-lg md:rounded-xl flex flex-1 sm:flex-none border border-slate-200 animate-fade-in shrink-0 overflow-x-auto no-scrollbar">
                    <button @click="$emit('update:activeCategory', 'all')" :class="activeCategory === 'all' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'" class="flex-1 sm:flex-none px-3 py-1.5 rounded-md md:rounded-lg text-[10px] md:text-xs font-bold transition-all whitespace-nowrap">ទាំងអស់</button>
                    <button @click="$emit('update:activeCategory', 'បោះដុំ')" :class="activeCategory === 'បោះដុំ' ? 'bg-white shadow-sm text-purple-700' : 'text-slate-500 hover:text-purple-700'" class="flex-1 sm:flex-none px-3 py-1.5 rounded-md md:rounded-lg text-[10px] md:text-xs font-bold transition-all whitespace-nowrap">បោះដុំ</button>
                    <button @click="$emit('update:activeCategory', 'លក់រាយ')" :class="activeCategory === 'លក់រាយ' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-indigo-600'" class="flex-1 sm:flex-none px-3 py-1.5 rounded-md md:rounded-lg text-[10px] md:text-xs font-bold transition-all whitespace-nowrap">លក់រាយ</button>
                </div>

                <div class="flex items-center gap-2 shrink-0">
                    <button @click="$emit('print')" :disabled="filteredSellersLength === 0" class="bg-slate-800 hover:bg-slate-900 text-white px-3 py-2 md:py-2 rounded-lg md:rounded-xl text-[10px] md:text-xs font-bold shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5 min-w-[70px]">
                        <svg class="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2-2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2-2v4h10z"></path></svg>
                        Print
                    </button>
                    <button @click="$emit('pdf')" :disabled="filteredSellersLength === 0 || processing.active" class="bg-rose-500 hover:bg-rose-600 text-white px-3 py-2 md:py-2 rounded-lg md:rounded-xl text-[10px] md:text-xs font-bold shadow-md shadow-rose-500/30 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5 min-w-[70px]">
                        <svg class="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        PDF
                    </button>
                </div>
            </div>

        </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    admin: Object,
    totalSellersCount: Number,
    activeTab: String,
    searchQuery: String,
    activeCategory: String,
    filteredSellersLength: Number,
    processing: Object
});

const emit = defineEmits([
    'update:activeTab', 
    'update:searchQuery', 
    'update:activeCategory', 
    'print', 
    'pdf'
]);
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }

/* Hide scrollbar for category filter on tiny screens */
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>