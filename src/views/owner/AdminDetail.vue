<template>
  <div class="min-h-[100dvh] bg-[#F4F7FE] font-khmer flex flex-col relative print-container print:bg-white pb-32">
    
    <div class="bg-white/80 backdrop-blur-2xl border-b border-slate-200/60 sticky top-0 z-40 transition-all shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] print:hidden">
      <div class="px-4 md:px-8 py-4 md:py-5">
        
        <div class="flex flex-col xl:flex-row xl:items-center justify-between gap-5 mb-5">
          <div class="flex items-center gap-4">
             <button @click="router.back()" class="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
             </button>
             <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-700 to-indigo-900 flex items-center justify-center shadow-lg shadow-slate-500/30 text-white shrink-0">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
             </div>
             <div>
               <h1 class="text-xl md:text-2xl font-black text-slate-800 tracking-tight leading-tight">ព័ត៌មានលម្អិតអ្នកគ្រប់គ្រង</h1>
               <p class="text-slate-500 text-[11px] md:text-xs font-bold mt-0.5 uppercase tracking-wider">Admin Report Details</p>
             </div>
          </div>

          <div class="bg-slate-100/80 p-1.5 rounded-2xl flex overflow-x-auto no-scrollbar w-full xl:w-auto shadow-inner border border-slate-200/50 shrink-0">
             <button 
               v-for="tab in filterTabs" 
               :key="tab.key"
               @click="dateFilterType = tab.key"
               class="flex-1 xl:flex-none px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all duration-300 whitespace-nowrap relative"
               :class="dateFilterType === tab.key ? 'text-indigo-600 shadow-md bg-white' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'"
             >
               {{ tab.label }}
             </button>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-3 animate-fade-in min-h-[42px]">
            <template v-if="!isLoadingPage">
                <div v-if="dateFilterType === 'daily'" class="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm focus-within:border-indigo-500 w-full sm:w-auto">
                   <span class="text-slate-400 text-[10px] font-black uppercase tracking-wider">ថ្ងៃទី</span>
                   <input v-model="selectedDate" type="date" class="w-full bg-transparent border-none text-slate-700 font-bold text-sm focus:ring-0 outline-none p-0 cursor-pointer">
                </div>

                <div v-if="dateFilterType === 'monthly'" class="flex gap-2 w-full sm:w-auto">
                   <div class="relative group flex-1 sm:flex-none">
                      <select v-model="selectedMonth" class="w-full appearance-none bg-white border border-slate-200 pl-4 pr-10 py-2.5 rounded-xl text-sm font-bold text-slate-700 outline-none shadow-sm cursor-pointer min-w-[140px]">
                         <option v-for="m in availableMonths" :key="m.index" :value="m.index">{{ m.name }}</option>
                      </select>
                      <svg class="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                   </div>
                   <div class="relative group flex-1 sm:flex-none">
                      <select v-model="selectedYear" class="w-full appearance-none bg-white border border-slate-200 pl-4 pr-10 py-2.5 rounded-xl text-sm font-bold text-slate-700 outline-none shadow-sm cursor-pointer">
                         <option v-for="y in availableYears" :key="y" :value="y">{{ y }}</option>
                      </select>
                      <svg class="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                   </div>
                </div>

                <div v-if="dateFilterType === 'yearly'" class="relative group w-full sm:w-auto">
                   <select v-model="selectedYear" class="w-full appearance-none bg-white border border-slate-200 pl-4 pr-10 py-2.5 rounded-xl text-sm font-bold text-slate-700 outline-none shadow-sm cursor-pointer min-w-[120px]">
                      <option v-for="y in availableYears" :key="y" :value="y">{{ y }}</option>
                   </select>
                   <svg class="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                </div>

                 <div v-if="dateFilterType === 'custom'" class="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm focus-within:border-indigo-500 w-full sm:w-auto">
                   <input v-model="customStart" type="date" class="w-full flex-1 bg-transparent border-none text-slate-700 font-bold text-sm focus:ring-0 outline-none p-0 cursor-pointer">
                   <div class="w-4 h-px bg-slate-300"></div>
                   <input v-model="customEnd" type="date" class="w-full flex-1 bg-transparent border-none text-slate-700 font-bold text-sm focus:ring-0 outline-none p-0 cursor-pointer">
                </div>
            </template>
        </div>
      </div>
    </div>

    <div v-if="isLoadingPage" class="flex-1 flex flex-col items-center justify-center py-32 opacity-60 print:hidden">
       <div class="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-indigo-600 mb-4"></div>
       <p class="text-slate-500 font-bold tracking-wide">កំពុងទាញយកទិន្នន័យ...</p>
    </div>

    <div v-else class="flex-1 w-full max-w-[90rem] mx-auto p-4 md:p-8 print:p-0">
        
        <div class="bg-gradient-to-r from-slate-800 to-indigo-900 p-6 md:p-8 rounded-[2rem] text-white relative overflow-hidden shadow-lg mb-8 print:hidden">
            <div class="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            
            <div class="flex flex-col md:flex-row gap-6 relative z-10">
                <img :src="admin.photoUrl || `https://ui-avatars.com/api/?name=${admin.fullName}`" class="w-24 h-24 rounded-3xl object-cover border-4 border-white/20 shadow-xl shrink-0 bg-white">
                <div class="flex-1">
                  <h2 class="text-3xl font-black mb-1">{{ admin.fullName }}</h2>
                  <div class="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-300 mb-4">
                      <span class="bg-white/10 px-2.5 py-1 rounded-lg font-mono">@{{ admin.username }}</span>
                      <a v-if="admin.telegram" :href="'https://t.me/' + admin.telegram.replace('@', '')" target="_blank" class="flex items-center gap-1.5 text-sky-400 hover:text-sky-300 transition-colors">
                          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.48-.94-2.4-1.54-1.06-.7-.37-1.09.23-1.72.16-.16 2.87-2.63 2.92-2.85.01-.03.01-.14-.06-.2-.06-.06-.17-.04-.25-.02-.11.02-1.91 1.2-5.39 3.55-.5.34-.95.51-1.35.5-.44-.01-1.29-.25-1.92-.42-.77-.21-1.37-.32-1.31-.68.03-.18.28-.37.76-.56 3.03-1.32 5.06-2.19 6.09-2.62 2.93-1.21 3.53-1.43 3.93-1.43.09 0 .28.01.4.04.1.03.24.1.33.25.08.16.07.32.07.33z"/></svg>
                          {{ admin.telegram }}
                      </a>
                  </div>
                  
                  <div class="flex items-center gap-2">
                      <div class="bg-white/10 px-3 py-1.5 rounded-lg flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                        <span class="text-xs font-bold text-white">តំណាងលក់សរុប: {{ allSellers.length }} នាក់</span>
                      </div>
                  </div>
                </div>
            </div>
        </div>

        <div class="flex flex-col lg:flex-row justify-between items-center gap-4 mb-6 print:hidden">
            <div class="flex items-center gap-2 bg-white p-1.5 rounded-2xl w-full sm:w-fit border border-slate-200 shadow-sm shrink-0 relative z-30">
                <button 
                    @click="activeTab = 'sellers'" 
                    :class="activeTab === 'sellers' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:text-slate-800'" 
                    class="flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300"
                >
                    បញ្ជីតំណាងលក់
                </button>
                <button 
                    @click="activeTab = 'report'" 
                    :class="activeTab === 'report' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:text-slate-800'" 
                    class="flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300"
                >
                    របាយការណ៍លក់
                </button>
            </div>

            <div class="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto bg-white p-2 rounded-2xl shadow-sm border border-slate-200 shrink-0 z-20">
                <div class="relative w-full sm:w-64">
                    <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </span>
                    <input v-model="searchQuery" type="text" placeholder="ស្វែងរកឈ្មោះ ឬ អត្តលេខ..." class="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:font-normal">
                    <button v-if="searchQuery" @click="searchQuery = ''" class="absolute inset-y-0 right-2 flex items-center text-slate-400 hover:text-rose-500">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                
                <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
                    
                    <div v-if="activeTab === 'report'" class="bg-slate-100 p-1.5 rounded-xl flex border border-slate-200 animate-fade-in shrink-0">
                        <button @click="activeCategory = 'all'" :class="activeCategory === 'all' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'" class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all">
                            ទាំងអស់
                        </button>
                        <button @click="activeCategory = 'បោះដុំ'" :class="activeCategory === 'បោះដុំ' ? 'bg-white shadow-sm text-purple-700' : 'text-slate-500 hover:text-purple-700'" class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all">
                            បោះដុំ
                        </button>
                        <button @click="activeCategory = 'លក់រាយ'" :class="activeCategory === 'លក់រាយ' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-indigo-600'" class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all">
                            លក់រាយ
                        </button>
                    </div>

                    <div v-if="activeTab === 'sellers'" class="bg-slate-100 p-1 rounded-xl flex border border-slate-200 animate-fade-in shrink-0">
                        <button @click="viewMode = 'card'" :class="viewMode === 'card' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'" class="p-1.5 rounded-lg transition-all" title="Card View">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                        </button>
                        <button @click="viewMode = 'list'" :class="viewMode === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'" class="p-1.5 rounded-lg transition-all" title="List View">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
                        </button>
                    </div>

                    <button @click="executePrint" :disabled="filteredSellers.length === 0" class="bg-slate-800 hover:bg-slate-900 text-white px-3 py-2 rounded-xl text-xs font-bold shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5 shrink-0">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2-2v4h10z"></path></svg>
                        Print
                    </button>
                    <button @click="generatePDF" :disabled="filteredSellers.length === 0 || processing.active" class="bg-rose-500 hover:bg-rose-600 text-white px-3 py-2 rounded-xl text-xs font-bold shadow-md shadow-rose-500/30 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5 shrink-0">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        PDF
                    </button>
                </div>
            </div>
        </div>

        <div v-if="filteredSellers.length === 0" class="flex-1 flex items-center justify-center py-20 print:hidden">
            <div class="text-center bg-white p-12 rounded-[2rem] border-2 border-dashed border-slate-200">
                <div class="w-20 h-20 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <p class="text-slate-500 font-bold text-xl">មិនមានទិន្នន័យទេ</p>
                <p class="text-slate-400 text-sm mt-2">សូមព្យាយាមស្វែងរកម្ដងទៀត ឬផ្លាស់ប្តូរកាលបរិច្ឆេទ</p>
            </div>
        </div>

        <div v-else-if="viewMode === 'card' && activeTab === 'sellers'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in print:hidden">
            <div 
                v-for="seller in paginatedSellers" 
                :key="seller.id" 
                @click="goToSellerDetail(seller.id)"
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

        <div v-else-if="viewMode === 'list' || activeTab === 'report'" class="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm animate-fade-in print:hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse min-w-[800px]">
                    <thead class="bg-slate-50 text-slate-500 text-[11px] uppercase font-black tracking-widest border-b border-slate-200">
                        <tr>
                            <th class="px-6 py-5 text-center w-16 whitespace-nowrap">#</th>
                            <th class="px-6 py-5 whitespace-nowrap">តំណាងលក់</th>
                            
                            <template v-if="activeTab === 'sellers'">
                                <th class="px-6 py-5 text-center whitespace-nowrap">អត្តលេខ</th>
                                <th class="px-6 py-5 text-center whitespace-nowrap">លេខទូរស័ព្ទ</th>
                                <th class="px-6 py-5 text-center whitespace-nowrap">តេឡេក្រាម</th>
                            </template>
                            <template v-else>
                                <th class="px-6 py-5 text-center whitespace-nowrap">ប្រភេទ</th>
                                <th class="px-6 py-5 w-[30%] whitespace-nowrap">ចំនួនលក់ (Units)</th>
                                <th class="px-6 py-5 text-center whitespace-nowrap">អតិថិជន</th>
                                <th class="px-6 py-5 text-right whitespace-nowrap">ចំណូល</th>
                            </template>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <tr 
                            v-for="(seller, index) in paginatedSellers" 
                            :key="seller.uniqueId" 
                            @click="goToSellerDetail(seller.id)"
                            class="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                        >
                            <td class="px-6 py-4 text-center text-sm font-bold text-slate-400 align-top pt-6">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                            
                            <td class="px-6 py-4 align-top pt-5">
                                <div class="flex items-center gap-4">
                                    <img :src="seller.photoUrl || `https://ui-avatars.com/api/?name=${seller.fullName}`" class="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-sm shrink-0">
                                    <p class="font-bold text-base text-slate-800 group-hover:text-indigo-600 transition-colors">{{ seller.fullName }}</p>
                                </div>
                            </td>
                            
                            <template v-if="activeTab === 'sellers'">
                                <td class="px-6 py-4 text-center text-sm font-mono font-bold text-slate-500 align-top pt-6">{{ seller.idNumber || '-' }}</td>
                                <td class="px-6 py-4 text-center text-sm font-medium text-slate-600 align-top pt-6">{{ seller.phoneNumber || '-' }}</td>
                                <td class="px-6 py-4 text-center align-top pt-5">
                                    <a v-if="seller.telegram" :href="'https://t.me/' + seller.telegram.replace('@', '')" target="_blank" @click.stop class="text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 hover:bg-sky-500 hover:text-white transition-colors">
                                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.48-.94-2.4-1.54-1.06-.7-.37-1.09.23-1.72.16-.16 2.87-2.63 2.92-2.85.01-.03.01-.14-.06-.2-.06-.06-.17-.04-.25-.02-.11.02-1.91 1.2-5.39 3.55-.5.34-.95.51-1.35.5-.44-.01-1.29-.25-1.92-.42-.77-.21-1.37-.32-1.31-.68.03-.18.28-.37.76-.56 3.03-1.32 5.06-2.19 6.09-2.62 2.93-1.21 3.53-1.43 3.93-1.43.09 0 .28.01.4.04.1.03.24.1.33.25.08.16.07.32.07.33z"/></svg>
                                        @{{ seller.telegram.replace('@', '') }}
                                    </a>
                                    <span v-else class="text-sm text-slate-300 font-bold">-</span>
                                </td>
                            </template>
                            
                            <template v-else>
                                <td class="px-6 py-4 text-center align-top pt-6">
                                    <span v-if="seller.hasSales" :class="seller.category === 'បោះដុំ' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-slate-50 text-slate-700 border-slate-200'" class="px-2.5 py-1 rounded-md text-xs font-bold border">
                                        {{ seller.category }}
                                    </span>
                                    <span v-else class="text-slate-300 font-bold">-</span>
                                </td>

                                <td class="px-6 py-4 align-top pt-5">
                                    <div v-if="seller.hasSales" class="flex flex-wrap gap-2 items-center">
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
                                    <span v-else class="text-xs font-bold text-slate-300">គ្មានការលក់</span>
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
                            </template>
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
                <button @click="prevPage" :disabled="currentPage === 1" class="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
                </button>
                <button v-for="p in totalPages" :key="p" @click="goToPage(p)" class="w-9 h-9 flex items-center justify-center rounded-xl font-bold text-sm transition-colors border" :class="currentPage === p ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'">
                    {{ p }}
                </button>
                <button @click="nextPage" :disabled="currentPage === totalPages" class="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                </button>
            </div>
        </div>

    </div>

    <div v-if="!isLoadingPage && activeTab === 'report' && filteredSellers.some(s => s.hasSales)" class="fixed bottom-6 left-0 right-0 px-4 md:px-8 pointer-events-none flex justify-center z-50 animate-slide-up print:hidden">
        <div class="bg-white/95 backdrop-blur-xl border border-slate-200 shadow-[0_10px_40px_rgba(0,0,0,0.15)] p-4 md:px-8 md:py-4 rounded-3xl md:rounded-[2rem] pointer-events-auto flex flex-col md:flex-row items-center gap-4 md:gap-8 max-w-5xl w-full">
            <div class="flex items-center gap-3 w-full md:w-auto border-b md:border-b-0 md:border-r border-slate-200 pb-3 md:pb-0 md:pr-8 shrink-0">
                <div class="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 shrink-0">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
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

    <transition enter-active-class="duration-300 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="processing.active" class="fixed inset-0 z-[999999] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md print:hidden">
            <div class="w-full max-w-sm bg-[#18181b] border border-white/10 rounded-3xl p-10 shadow-2xl relative flex flex-col items-center text-center animate-fade-in-up">
                <div class="relative w-20 h-20 mb-8">
                    <div class="absolute inset-0 rounded-full border-4 border-white/5"></div>
                    <div class="absolute inset-0 rounded-full border-4 border-t-rose-500 border-r-rose-500 border-b-transparent border-l-transparent animate-spin"></div>
                    <div class="absolute inset-0 flex items-center justify-center font-bold text-white text-lg font-mono">{{ processing.progress }}%</div>
                </div>
                <h3 class="text-xl font-bold text-white mb-2">{{ processing.message }}</h3>
                <div class="w-full h-1.5 bg-black/50 rounded-full overflow-hidden border border-white/5 mt-4">
                    <div class="h-full bg-gradient-to-r from-red-500 to-rose-600 transition-all duration-300 ease-out" :style="{ width: `${processing.progress}%` }"></div>
                </div>
            </div>
        </div>
    </transition>
    
    <div ref="printStaging" class="fixed top-0 left-[-9999px] pointer-events-none z-[-1] opacity-0 print:opacity-100"></div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { db } from '@/firebaseConfig';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const route = useRoute();
const router = useRouter();
const adminId = route.params.id; 

const isLoadingPage = ref(true);
const admin = ref({});
const allSellers = ref([]);
const allSales = ref([]);
const unitSettings = ref([]);

const activeCategory = ref('all');

const dateFilterType = ref('monthly'); 
const selectedDate = ref(new Date().toISOString().split('T')[0]);
const selectedYear = ref(new Date().getFullYear());
const selectedMonth = ref(new Date().getMonth());
const customStart = ref(new Date().toISOString().split('T')[0]);
const customEnd = ref(new Date().toISOString().split('T')[0]);

const filterTabs = [
  { key: 'daily', label: 'ប្រចាំថ្ងៃ' },
  { key: 'monthly', label: 'ប្រចាំខែ' },
  { key: 'yearly', label: 'ប្រចាំឆ្នាំ' },
  { key: 'custom', label: 'កំណត់ថ្ងៃ' },
];
const monthNames = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'];

const activeTab = ref('sellers');
const viewMode = ref('list');
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 12;
const expandedRowIds = ref(new Set());
const printStaging = ref(null);
const processing = ref({ active: false, message: '', progress: 0 });

// --- ROUTING HANDLER ---
const goToSellerDetail = (sellerId) => {
    if (sellerId) {
        router.push({
            name: 'SellerSalesDetail', // ✅ Exactly matches your route name!
            params: { id: sellerId }
        });
    }
};
// --- FETCH DATA ---
onMounted(async () => {
    if (!adminId) {
        router.back();
        return;
    }
    try {
        const adminDoc = await getDoc(doc(db, 'users', adminId));
        if (adminDoc.exists()) {
            admin.value = { id: adminDoc.id, ...adminDoc.data() };
        } else {
            router.back();
            return;
        }

        const sellersQ = query(collection(db, 'users'), where('role', '==', 'seller'), where('createdBy', '==', adminId));
        const sellersSnap = await getDocs(sellersQ);
        allSellers.value = sellersSnap.docs
            .map(d => ({ id: d.id, ...d.data() }))
            .filter(s => s.isDeleted === false || s.isDeleted === "false" || !s.isDeleted);

        const salesSnap = await getDocs(collection(db, 'sales_reports'));
        allSales.value = salesSnap.docs.map(d => ({ id: d.id, ...d.data() }));

        const unitSnap = await getDocs(collection(db, 'settings_units'));
        unitSettings.value = unitSnap.docs.map(d => d.data());

        if (allSales.value.length > 0) {
            const validSales = allSales.value.filter(s => s.date);
            if (validSales.length > 0) {
                const latestDate = validSales.map(s => new Date(s.date)).sort((a,b) => b - a)[0];
                selectedYear.value = latestDate.getFullYear();
                selectedMonth.value = latestDate.getMonth();
                selectedDate.value = latestDate.toISOString().split('T')[0];
            }
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    } finally {
        isLoadingPage.value = false;
    }
});

// --- DATE LOGIC ---
const availableYears = computed(() => {
    if (allSales.value.length === 0) return [new Date().getFullYear()];
    const years = new Set(allSales.value.map(s => new Date(s.date).getFullYear()));
    return Array.from(years).sort((a, b) => b - a);
});

const availableMonths = computed(() => {
    if (allSales.value.length === 0) return [{ index: new Date().getMonth(), name: monthNames[new Date().getMonth()] }];
    const yearSales = allSales.value.filter(s => new Date(s.date).getFullYear() === parseInt(selectedYear.value));
    const months = new Set(yearSales.map(s => new Date(s.date).getMonth()));
    return Array.from(months).sort((a, b) => a - b).map(mIndex => ({ index: mIndex, name: monthNames[mIndex] }));
});

watch(selectedYear, () => {
    const months = availableMonths.value;
    if (!months.find(m => m.index === selectedMonth.value)) {
        if(months.length > 0) selectedMonth.value = months[months.length - 1].index;
    }
});

const isDateInScope = (dateStr) => {
   const date = new Date(dateStr);
   const dYear = date.getFullYear();
   const dMonth = date.getMonth();
   const dDateStr = dateStr; 
   if (dateFilterType.value === 'daily') return dDateStr === selectedDate.value;
   if (dateFilterType.value === 'monthly') return dMonth === parseInt(selectedMonth.value) && dYear === parseInt(selectedYear.value);
   if (dateFilterType.value === 'yearly') return dYear === parseInt(selectedYear.value);
   if (dateFilterType.value === 'custom') return dDateStr >= customStart.value && dDateStr <= customEnd.value;
   return false;
};

// 1. CALCULATE SELLERS (SPLIT BY CATEGORY)
const calculatedSellers = computed(() => {
    let rows = [];

    allSellers.value.forEach(seller => {
        const relevantSales = allSales.value.filter(sale => {
            const isMatch = sale.sellerId === seller.id || sale.createdBy === seller.id;
            return isMatch && isDateInScope(sale.date);
        });
        
        const retailSales = relevantSales.filter(s => (s.category || 'លក់រាយ') === 'លក់រាយ');
        const wholesaleSales = relevantSales.filter(s => s.category === 'បោះដុំ');

        const createRow = (catName, salesList) => {
            let totalClients = 0;
            let revenueUSD = 0;
            let revenueKHR = 0;
            let unitCounts = {}; 

            salesList.forEach(sale => {
                const u = (sale.unit || 'unknown').toLowerCase().trim();
                if (!unitCounts[u]) unitCounts[u] = 0;
                unitCounts[u] += Number(sale.totalSold || 0);
                totalClients += Number(sale.totalClients || 0);
                if (sale.currency === 'USD' || sale.currency === '$') revenueUSD += Number(sale.totalPrice || 0);
                else revenueKHR += Number(sale.totalPrice || 0);
            });

            rows.push({ 
                ...seller, 
                uniqueId: `${seller.id}_${catName === 'all' ? 'none' : catName}`, 
                category: catName,
                totalClients, 
                revenueUSD, 
                revenueKHR, 
                unitCounts, 
                hasSales: salesList.length > 0 
            });
        };

        if (activeTab.value === 'sellers') {
            createRow('all', relevantSales);
            return;
        }

        if (activeCategory.value === 'all') {
            if (retailSales.length > 0) createRow('លក់រាយ', retailSales);
            if (wholesaleSales.length > 0) createRow('បោះដុំ', wholesaleSales);
            if (retailSales.length === 0 && wholesaleSales.length === 0) createRow('-', []); 
        } else if (activeCategory.value === 'លក់រាយ') {
            createRow('លក់រាយ', retailSales);
        } else if (activeCategory.value === 'បោះដុំ') {
            createRow('បោះដុំ', wholesaleSales);
        }
    });

    return rows.sort((a, b) => {
        if (a.hasSales && !b.hasSales) return -1;
        if (!a.hasSales && b.hasSales) return 1;
        return (b.revenueUSD || 0) - (a.revenueUSD || 0);
    });
});

// --- FILTER & PAGINATE ---
watch(activeTab, (newTab) => {
    if (newTab === 'report') viewMode.value = 'list'; 
    currentPage.value = 1;
});

watch(activeCategory, () => {
    currentPage.value = 1;
});

watch(searchQuery, () => {
    currentPage.value = 1;
});

const filteredSellers = computed(() => {
    if (!searchQuery.value) return calculatedSellers.value;
    const q = searchQuery.value.toLowerCase();
    return calculatedSellers.value.filter(s => 
        (s.fullName && s.fullName.toLowerCase().includes(q)) || 
        (s.idNumber && s.idNumber.toLowerCase().includes(q))
    );
});

const totalPages = computed(() => Math.ceil(filteredSellers.value.length / itemsPerPage) || 1);

const paginatedSellers = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    return filteredSellers.value.slice(start, start + itemsPerPage);
});

const prevPage = () => { if (currentPage.value > 1) currentPage.value--; };
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++; };
const goToPage = (p) => { currentPage.value = p; };

const toggleRowExpand = (id) => {
    const newSet = new Set(expandedRowIds.value);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    expandedRowIds.value = newSet;
};

// 2. GRAND TOTALS (SPLIT BY CATEGORY)
const grandTotals = computed(() => {
    let stats = {
        all: { usd: 0, khr: 0, clients: 0, totalUnitsCount: 0, units: {} },
        retail: { usd: 0, khr: 0, clients: 0, totalUnitsCount: 0, units: {} },
        wholesale: { usd: 0, khr: 0, clients: 0, totalUnitsCount: 0, units: {} }
    };

    filteredSellers.value.forEach(row => {
        if(row.hasSales) {
            const cat = row.category === 'បោះដុំ' ? 'wholesale' : 'retail';
            
            stats.all.clients += row.totalClients;
            stats.all.usd += row.revenueUSD;
            stats.all.khr += row.revenueKHR;
            
            stats[cat].clients += row.totalClients;
            stats[cat].usd += row.revenueUSD;
            stats[cat].khr += row.revenueKHR;

            for (const [unit, count] of Object.entries(row.unitCounts)) {
                if(count > 0) {
                    stats.all.units[unit] = (stats.all.units[unit] || 0) + count;
                    stats.all.totalUnitsCount += count;
                    
                    stats[cat].units[unit] = (stats[cat].units[unit] || 0) + count;
                    stats[cat].totalUnitsCount += count;
                }
            }
        }
    });

    return stats;
});


const reportDateLabel = computed(() => {
   let dateStr = '';
   if (dateFilterType.value === 'daily') dateStr = new Intl.DateTimeFormat('km-KH', { dateStyle: 'long' }).format(new Date(selectedDate.value));
   if (dateFilterType.value === 'monthly') dateStr = `ខែ ${monthNames[selectedMonth.value]} ឆ្នាំ ${selectedYear.value}`;
   if (dateFilterType.value === 'yearly') dateStr = `ឆ្នាំ ${selectedYear.value}`;
   if (dateFilterType.value === 'custom') {
       const s = new Intl.DateTimeFormat('km-KH', { dateStyle: 'medium' }).format(new Date(customStart.value));
       const e = new Intl.DateTimeFormat('km-KH', { dateStyle: 'medium' }).format(new Date(customEnd.value));
       dateStr = `${s} ដល់ ${e}`;
   }
   
   const categoryName = activeCategory.value === 'all' ? 'សរុប (All)' : activeCategory.value;
   return activeTab.value === 'report' ? `${dateStr} - ${categoryName}` : dateStr;
});

// --- UTILITIES ---
const translateUnit = (unitVal) => {
    if (!unitVal) return '';
    const safeVal = String(unitVal);
    const found = unitSettings.value.find(u => String(u.value) === safeVal);
    if (found) return found.label;
    const u = safeVal.toLowerCase().trim();
    if (u === 'bottle' || u === 'bottles') return 'ដប';
    if (u === 'pack' || u === 'packs') return 'កញ្ចប់';
    return safeVal; 
};

const getAppBadgeClass = (unitVal) => {
    if (!unitVal) return 'text-slate-700 bg-slate-50 border-slate-200';
    const safeVal = String(unitVal);
    const found = unitSettings.value.find(u => String(u.value) === safeVal);
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


// --- PRINT & PDF ---
const executePrint = () => {
    const isReport = activeTab.value === 'report';
    const adminName = admin.value?.fullName || 'Admin';
    const title = isReport ? `Sales_Report_${adminName}` : `Sellers_List_${adminName}`;
    const dataWithIndex = filteredSellers.value.map((item, idx) => ({ ...item, printIndex: idx + 1 }));
    const contentHTML = generatePrintHTML(dataWithIndex, 1, 1, true);
    
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute'; iframe.style.width = '0'; iframe.style.height = '0'; iframe.style.border = 'none';
    document.body.appendChild(iframe);
    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
        <html>
        <head>
            <title>${title}</title>
            <link href="https://fonts.googleapis.com/css2?family=Battambong:wght@400;700;900&family=Kantumruy+Pro:wght@400;700&display=swap" rel="stylesheet">
            <style>
                @page { size: A4 portrait; margin: 0; }
                body { font-family: 'Battambong', 'Kantumruy Pro', sans-serif; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; margin: 0; padding: 15mm; background-color: white; }
                table { width: 100%; border-collapse: collapse; }
                tr { page-break-inside: avoid; page-break-after: auto; }
                thead { display: table-header-group; }
                tfoot { display: table-footer-group; }
            </style>
        </head>
        <body>${contentHTML}</body>
        </html>
    `);
    doc.close();
    iframe.contentWindow.document.fonts.ready.then(() => {
        iframe.contentWindow.focus(); iframe.contentWindow.print();
        setTimeout(() => { document.body.removeChild(iframe); }, 1000);
    });
};

const generatePDF = async () => {
    processing.value = { active: true, message: 'កំពុងបំបែកទិន្នន័យ...', progress: 10 };
    const isReport = activeTab.value === 'report';
    
    try {
        const pages = [];
        let remaining = [...filteredSellers.value];
        let rowCounter = 1;
        
        while (remaining.length > 0) {
            let chunkLimit = isReport ? 8 : 14; 
            if (isReport && remaining.length <= chunkLimit && remaining.length > 5) {
                chunkLimit = 5; 
            }
            pages.push(remaining.slice(0, chunkLimit).map(r => ({...r, printIndex: rowCounter++})));
            remaining = remaining.slice(chunkLimit);
        }

        const pdf = new jsPDF('p', 'mm', 'a4'); 
        const pdfWidth = 210; 
        
        for (let i = 0; i < pages.length; i++) {
            processing.value.message = `កំពុងថតចម្លងទំព័រទី ${i+1} នៃ ${pages.length}...`;
            printStaging.value.innerHTML = generatePrintHTML(pages[i], i + 1, pages.length, false);
            
            await nextTick(); await document.fonts.ready; await new Promise(r => setTimeout(r, 600)); 

            const canvas = await html2canvas(printStaging.value.querySelector('.print-page'), { 
                scale: 2, useCORS: true, logging: false, backgroundColor: "#ffffff", windowWidth: 1000
            });
            
            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            if (i > 0) pdf.addPage();
            
            const propsImg = pdf.getImageProperties(imgData);
            const pdfHeight = (propsImg.height * pdfWidth) / propsImg.width;
            
            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
            processing.value.progress = 10 + Math.round(((i + 1) / pages.length) * 80);
        }

        processing.value.message = 'កំពុងរក្សាទុកឯកសារ...';
        processing.value.progress = 100;
        const adminName = admin.value?.fullName || 'Admin';
        const fileName = isReport ? `Sales_Report_${adminName}.pdf` : `Sellers_List_${adminName}.pdf`;
        pdf.save(fileName);
        
    } catch(e) {
        console.error(e);
        alert("មិនអាចទាញយក PDF បានទេ");
    } finally {
        if(printStaging.value) printStaging.value.innerHTML = '';
        processing.value.active = false;
    }
};

const generatePrintHTML = (rows, pageNum, totalPages, isNativePrint = false) => {
    const isReport = activeTab.value === 'report';

    let normalRows = rows;
    let lastRow = null;
    if (isNativePrint && rows.length > 0 && isReport) {
        normalRows = rows.slice(0, rows.length - 1);
        lastRow = rows[rows.length - 1];
    }

    const renderRow = (item) => {
        if (isReport) {
            let salesHTML = item.hasSales ? 
                `<div style="overflow: hidden;">` + 
                Object.entries(item.unitCounts || {}).filter(([u, c]) => c > 0).map(([u, c]) => 
                    `<div style="float: left; margin: 0 12px 6px 0;">
                        <span style="font-weight: 900; color: #1e293b; font-size: 14px;">${c.toLocaleString()}</span>
                        <span style="color: #64748b; font-size: 12px; font-weight: bold; margin-left: 4px;">${translateUnit(u)}</span>
                     </div>`
                ).join('') + `<div style="clear: both;"></div></div>` 
                : `<span style="color:#94a3b8; font-size:12px; font-weight:bold;">គ្មានការលក់</span>`;
                
            let revHTML = item.hasSales ? 
                `<div style="text-align: right;">
                    <span style="color:#059669; font-size:16px; font-weight:900; display: inline-block;">${item.revenueUSD?.toLocaleString() || 0} $</span><br/>
                    <span style="color:#2563eb; font-size:13px; font-weight:bold; display: inline-block; margin-top: 2px;">${item.revenueKHR?.toLocaleString() || 0} ៛</span>
                </div>` : 
                `<div style="text-align: right; color:#94a3b8; font-weight:bold; font-size:14px;">-</div>`;

            const catBadge = item.category === 'បោះដុំ' 
                ? `<span style="color: #7e22ce; font-size: 13px; font-weight: bold;">បោះដុំ</span>`
                : `<span style="color: #475569; font-size: 13px; font-weight: bold;">លក់រាយ</span>`;

            return `
                <tr style="break-inside: avoid; page-break-inside: avoid; border-bottom: 1px dashed #e2e8f0;">
                    <td style="padding: 16px 10px; text-align: center; vertical-align: top; color: #94a3b8; font-weight: 900;">${item.printIndex}</td>
                    <td style="padding: 16px 10px; vertical-align: top;">
                        <p style="font-weight: bold; color: #1e293b; font-size: 15px; margin: 0;">${item.fullName}</p>
                        <p style="font-family: monospace; color: #64748b; font-size: 11px; margin: 4px 0 0 0;">ID: ${item.idNumber || 'N/A'}</p>
                    </td>
                    <td style="padding: 16px 10px; vertical-align: top; text-align: center;">${item.hasSales ? catBadge : '-'}</td>
                    <td style="padding: 16px 10px; vertical-align: top;">${salesHTML}</td>
                    <td style="padding: 16px 10px; text-align: center; vertical-align: top; font-weight: bold; color: #334155; font-size: 15px;">${item.hasSales ? (item.totalClients || 0) + ' នាក់' : '-'}</td>
                    <td style="padding: 16px 10px; vertical-align: top;">${revHTML}</td>
                </tr>
            `;
        } else {
            return `
                <tr style="border-bottom: 1px dashed #e2e8f0; break-inside: avoid; page-break-inside: avoid;">
                    <td style="padding: 16px 10px; text-align: center; vertical-align: middle; font-weight: 900; color: #94a3b8; font-size: 14px;">${item.printIndex}</td>
                    <td style="padding: 16px 10px; vertical-align: middle;">
                        <p style="font-weight: bold; color: #1e293b; font-size: 15px; margin: 0;">${item.fullName}</p>
                    </td>
                    <td style="padding: 16px 10px; text-align: center; vertical-align: middle; font-weight: bold; color: #475569; font-size: 13px;">${item.idNumber || '-'}</td>
                    <td style="padding: 16px 10px; text-align: center; vertical-align: middle; font-weight: bold; color: #475569; font-size: 13px;">${item.phoneNumber || '-'}</td>
                </tr>
            `;
        }
    };

    const normalRowsHTML = normalRows.map(renderRow).join('');
    const lastRowHTML = lastRow ? renderRow(lastRow) : '';

    let adminHeaderHTML = '';
    if (pageNum === 1) {
        adminHeaderHTML = `
            <div style="border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 25px; overflow: hidden;">
                <div style="float: left;">
                    <p style="font-size: 12px; color: #64748b; font-weight: bold; text-transform: uppercase; margin: 0 0 5px 0;">អ្នកគ្រប់គ្រង (Admin)</p>
                    <h2 style="font-size: 24px; font-weight: 900; color: #0f172a; margin: 0 0 8px 0;">${admin.value?.fullName || 'N/A'}</h2>
                    <span style="font-size: 14px; color: #475569; font-weight: bold;">@${admin.value?.username || 'N/A'} ${admin.value?.telegram ? `| Tel: ${admin.value.telegram}` : ''}</span>
                </div>
                <div style="float: right; margin-top: 15px;">
                    <span style="border: 2px solid #cbd5e1; color: #334155; padding: 8px 16px; border-radius: 8px; font-weight: bold; font-size: 14px;">
                        តំណាងលក់សរុប: ${allSellers.value?.length || 0} នាក់
                    </span>
                </div>
                <div style="clear: both;"></div>
            </div>
        `;
    }

    let summarySectionHTML = '';
    if (isReport && (pageNum === totalPages || isNativePrint)) {
        
        const unitsArray = Object.entries(grandTotals.value.all.units);
        let unitRows = '';
        for (let i = 0; i < unitsArray.length; i += 2) {
            const [u1, c1] = unitsArray[i];
            const item2 = unitsArray[i + 1];
            
            const cell1 = `
                <td style="width: 50%; padding: 6px 16px 6px 0; vertical-align: top;">
                    <div style="overflow: hidden; border-bottom: 1px dotted #e2e8f0; padding-bottom: 4px;">
                        <span style="color: #475569; font-size: 14px; font-weight: bold; float: left;">${translateUnit(u1)}</span>
                        <span style="font-weight: 900; color: #0f172a; font-size: 16px; float: right;">${c1.toLocaleString()}</span>
                        <div style="clear: both;"></div>
                    </div>
                </td>`;
                
            const cell2 = item2 ? `
                <td style="width: 50%; padding: 6px 0 6px 16px; vertical-align: top;">
                    <div style="overflow: hidden; border-bottom: 1px dotted #e2e8f0; padding-bottom: 4px;">
                        <span style="color: #475569; font-size: 14px; font-weight: bold; float: left;">${translateUnit(item2[0])}</span>
                        <span style="font-weight: 900; color: #0f172a; font-size: 16px; float: right;">${item2[1].toLocaleString()}</span>
                        <div style="clear: both;"></div>
                    </div>
                </td>` : `<td style="width: 50%;"></td>`;
                
            unitRows += `<tr>${cell1}${cell2}</tr>`;
        }
        
        const unitsTableHTML = unitsArray.length > 0 
            ? `<table style="width: 100%; border-collapse: collapse; border: none;"><tbody>${unitRows}</tbody></table>`
            : `<p style="color: #94a3b8; font-size: 14px; margin: 0;">គ្មានទិន្នន័យ</p>`;

        let breakdownHTML = '';
        if (activeCategory.value === 'all') {
            breakdownHTML = `
                <div style="margin-top: 20px; border-top: 1px solid #cbd5e1; padding-top: 20px; overflow: hidden; width: 100%;">
                    <div style="float: left; width: 48%; box-sizing: border-box; padding-right: 10px;">
                        <p style="font-size: 12px; color: #64748b; font-weight: 900; margin: 0 0 8px 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">លក់រាយ (RETAIL)</p>
                        <p style="margin: 0; font-size: 18px; font-weight: 900; color: #059669;">${grandTotals.value.retail.usd.toLocaleString()} $</p>
                        <p style="margin: 4px 0 0 0; font-size: 14px; font-weight: bold; color: #2563eb;">${grandTotals.value.retail.khr.toLocaleString()} ៛</p>
                        <div style="margin-top: 8px;">
                            <p style="margin: 0; font-size: 13px; font-weight: bold; color: #475569;">អតិថិជន: ${grandTotals.value.retail.clients.toLocaleString()} នាក់</p>
                            <p style="margin: 4px 0 0 0; font-size: 13px; font-weight: bold; color: #475569;">បរិមាណលក់: ${grandTotals.value.retail.totalUnitsCount.toLocaleString()}</p>
                        </div>
                    </div>
                    <div style="float: right; width: 48%; box-sizing: border-box; padding-left: 10px; border-left: 1px dashed #cbd5e1;">
                        <p style="font-size: 12px; color: #64748b; font-weight: 900; margin: 0 0 8px 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">បោះដុំ (WHOLESALE)</p>
                        <p style="margin: 0; font-size: 18px; font-weight: 900; color: #059669;">${grandTotals.value.wholesale.usd.toLocaleString()} $</p>
                        <p style="margin: 4px 0 0 0; font-size: 14px; font-weight: bold; color: #2563eb;">${grandTotals.value.wholesale.khr.toLocaleString()} ៛</p>
                        <div style="margin-top: 8px;">
                            <p style="margin: 0; font-size: 13px; font-weight: bold; color: #475569;">អតិថិជន: ${grandTotals.value.wholesale.clients.toLocaleString()} នាក់</p>
                            <p style="margin: 4px 0 0 0; font-size: 13px; font-weight: bold; color: #475569;">បរិមាណលក់: ${grandTotals.value.wholesale.totalUnitsCount.toLocaleString()}</p>
                        </div>
                    </div>
                    <div style="clear: both;"></div>
                </div>
            `;
        }

        const categoryLabel = activeCategory.value === 'all' ? '' : `- ${activeCategory.value}`;

        summarySectionHTML = `
            <div style="margin-top: 40px; border-top: 2px solid #cbd5e1; padding-top: 30px; overflow: hidden; break-inside: avoid; page-break-inside: avoid; width: 100%; display: table;">
                <div style="display: table-cell; width: 60%; padding-right: 30px; vertical-align: top;">
                    <div style="margin-bottom: 16px; overflow: hidden; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">
                        <h3 style="font-size: 16px; font-weight: 900; color: #1e293b; margin: 0; float: left;">សរុបបរិមាណលក់តាមប្រភេទ ${categoryLabel}</h3>
                        <div style="clear: both;"></div>
                    </div>
                    <div>${unitsTableHTML}</div>
                </div>

                <div style="display: table-cell; width: 40%; vertical-align: top; border-left: 1px solid #e2e8f0; padding-left: 30px;">
                    <div style="margin-bottom: 16px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">
                        <h3 style="font-size: 16px; font-weight: 900; color: #1e293b; margin: 0;">សរុបរួម (Grand Total) ${categoryLabel}</h3>
                    </div>
                    <div>
                        <table style="width: 100%; border-collapse: collapse; border: none;">
                            <tr>
                                <td style="padding-bottom: 12px; color: #64748b; font-size: 14px; font-weight: bold;">អតិថិជនសរុប:</td>
                                <td style="padding-bottom: 12px; text-align: right; font-weight: 900; color: #0f172a; font-size: 16px;">
                                    ${grandTotals.value.all.clients.toLocaleString()} នាក់
                                </td>
                            </tr>
                            <tr>
                                <td style="padding-top: 12px; padding-bottom: 8px; border-top: 1px dashed #cbd5e1; color: #64748b; font-size: 14px; font-weight: bold;">ចំណូល (USD):</td>
                                <td style="padding-top: 12px; padding-bottom: 8px; border-top: 1px dashed #cbd5e1; text-align: right; font-weight: 900; color: #059669; font-size: 22px;">${grandTotals.value.all.usd.toLocaleString()} $</td>
                            </tr>
                            <tr>
                                <td style="padding-top: 4px; color: #64748b; font-size: 14px; font-weight: bold;">ចំណូល (KHR):</td>
                                <td style="padding-top: 4px; text-align: right; font-weight: 900; color: #2563eb; font-size: 16px;">${grandTotals.value.all.khr.toLocaleString()} ៛</td>
                            </tr>
                        </table>
                        ${breakdownHTML}
                    </div>
                </div>
            </div>
        `;
    }

    const pageStyles = isNativePrint
        ? `width: 100%; box-sizing: border-box; font-family: 'Battambong', 'Kantumruy Pro', sans-serif; line-height: 1.6; padding: 20px;`
        : `width: 1000px; min-height: 1414px; background: white; padding: 40px; box-sizing: border-box; font-family: 'Battambong', 'Kantumruy Pro', sans-serif; line-height: 1.6; position: relative;`;

    const titleText = isReport ? 'របាយការណ៍លក់របស់តំណាងលក់' : 'បញ្ជីរាយនាមតំណាងលក់';

    const thHTML = isReport ? `
        <th style="padding: 16px 10px; width: 5%; text-align: center; border-bottom: 2px solid #cbd5e1;">#</th>
        <th style="padding: 16px 10px; width: 25%; border-bottom: 2px solid #cbd5e1;">តំណាងលក់</th>
        <th style="padding: 16px 10px; width: 10%; text-align: center; border-bottom: 2px solid #cbd5e1;">ប្រភេទ</th>
        <th style="padding: 16px 10px; width: 30%; border-bottom: 2px solid #cbd5e1;">ចំនួនលក់ (Units)</th>
        <th style="padding: 16px 10px; width: 10%; text-align: center; border-bottom: 2px solid #cbd5e1;">អតិថិជន</th>
        <th style="padding: 16px 10px; width: 20%; text-align: right; border-bottom: 2px solid #cbd5e1;">ចំណូល</th>
    ` : `
        <th style="padding: 16px 10px; width: 5%; text-align: center; border-bottom: 2px solid #cbd5e1;">#</th>
        <th style="padding: 16px 10px; border-bottom: 2px solid #cbd5e1;">តំណាងលក់</th>
        <th style="padding: 16px 10px; text-align: center; border-bottom: 2px solid #cbd5e1;">អត្តលេខ</th>
        <th style="padding: 16px 10px; text-align: center; border-bottom: 2px solid #cbd5e1;">លេខទូរស័ព្ទ</th>
    `;

    let contentInner = '';
    if (isNativePrint && isReport) {
        contentInner = `
            <table style="width: 100%; text-align: left; border-collapse: collapse; background-color: #ffffff;">
                <thead style="color: #334155; font-size: 13px; font-weight: 900; display: table-header-group; text-transform: uppercase; letter-spacing: 0.5px;">
                    <tr>${thHTML}</tr>
                </thead>
                <tbody>${normalRowsHTML}</tbody>
                <tbody style="break-inside: avoid; page-break-inside: avoid;">
                    ${lastRowHTML}
                    <tr><td colspan="6" style="padding: 0; border: none;">${summarySectionHTML}</td></tr>
                </tbody>
            </table>
        `;
    } else {
        contentInner = `
            <table style="width: 100%; text-align: left; border-collapse: collapse; background-color: #ffffff;">
                <thead style="color: #334155; font-size: 13px; font-weight: 900; display: table-header-group; text-transform: uppercase; letter-spacing: 0.5px;">
                    <tr>${thHTML}</tr>
                </thead>
                <tbody>${normalRowsHTML}${lastRowHTML}</tbody>
            </table>
            ${summarySectionHTML}
        `;
    }

    return `
        <div class="print-page" style="${pageStyles}">
            <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px;">
                <h1 style="font-size: 28px; font-weight: 900; color: #1e293b; margin: 0; text-align: center; width: 100%; text-transform: uppercase;">${titleText}</h1>
            </div>
            ${adminHeaderHTML}
            <div style="flex: 1;">${contentInner}</div>
            <div style="margin-top: 40px; padding-top: 15px; border-top: 1px solid #e2e8f0; font-size: 12px; font-weight: bold; color: #94a3b8; overflow: hidden;">
                <div style="float: left;">
                    <span style="color: #475569; font-size: 14px; font-weight: 900;">កាលបរិច្ឆេទ: ${reportDateLabel.value}</span>
                    &nbsp;&nbsp;|&nbsp;&nbsp;ថ្ងៃបញ្ចេញរបាយការណ៍: ${new Date().toLocaleString('km-KH')}
                </div>
                <div style="float: right;">${isNativePrint ? '' : `ទំព័រទី ${pageNum} នៃ ${totalPages}`}</div>
                <div style="clear: both;"></div>
            </div>
        </div>
    `;
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Battambong:wght@400;700;900&family=Kantumruy+Pro:wght@400;700&display=swap');
.font-khmer { font-family: 'Battambong', 'Kantumruy Pro', sans-serif; }

.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #94A3B8; }

.animate-fade-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }

.animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }

@media print {
 .print\:hidden { display: none !important; }
}
</style>