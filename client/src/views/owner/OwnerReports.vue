<template>
  <div class="print-container">
    <div class="font-khmer h-[100dvh] flex flex-col relative bg-[#F4F7FE] overflow-hidden print:hidden">
      
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
                 @click="dateFilterType = tab.key"
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
                     <input v-model="selectedDate" type="date" class="w-full bg-transparent border-none text-slate-700 font-bold text-sm focus:ring-0 outline-none p-0 cursor-pointer">
                  </div>

                  <div v-if="dateFilterType === 'monthly'" class="flex gap-2 w-full sm:w-auto">
                     <div class="relative group flex-1 sm:flex-none">
                        <select v-model="selectedMonth" class="w-full appearance-none bg-white border border-slate-200 pl-4 pr-10 py-2.5 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm cursor-pointer min-w-[140px] hover:border-indigo-300 transition-all">
                           <option v-for="m in availableMonths" :key="m.index" :value="m.index">{{ m.name }}</option>
                        </select>
                        <svg class="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                     </div>
                     <div class="relative group flex-1 sm:flex-none">
                        <select v-model="selectedYear" class="w-full appearance-none bg-white border border-slate-200 pl-4 pr-10 py-2.5 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm cursor-pointer hover:border-indigo-300 transition-all">
                           <option v-for="y in availableYears" :key="y" :value="y">{{ y }}</option>
                        </select>
                        <svg class="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                     </div>
                  </div>

                  <div v-if="dateFilterType === 'yearly'" class="relative group w-full sm:w-auto">
                     <select v-model="selectedYear" class="w-full appearance-none bg-white border border-slate-200 pl-4 pr-10 py-2.5 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm cursor-pointer min-w-[120px] hover:border-indigo-300 transition-all">
                        <option v-for="y in availableYears" :key="y" :value="y">{{ y }}</option>
                     </select>
                     <svg class="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                  </div>

                   <div v-if="dateFilterType === 'custom'" class="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-colors focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 w-full sm:w-auto">
                     <input v-model="customStart" type="date" class="w-full flex-1 bg-transparent border-none text-slate-700 font-bold text-sm focus:ring-0 outline-none p-0 cursor-pointer">
                     <div class="w-4 h-px bg-slate-300"></div>
                     <input v-model="customEnd" type="date" class="w-full flex-1 bg-transparent border-none text-slate-700 font-bold text-sm focus:ring-0 outline-none p-0 cursor-pointer">
                  </div>
              </template>
          </div>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto custom-scrollbar scroll-smooth relative pb-40">
         <div class="px-4 md:px-8 py-6 max-w-[90rem] mx-auto w-full">
           
           <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
              <div class="bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 rounded-[24px] p-6 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 cursor-default">
                 <div class="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-500"></div>
                 <svg class="absolute right-4 bottom-4 w-24 h-24 text-white opacity-[0.07] group-hover:scale-110 transition-transform duration-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.15-1.46-3.27-3.04h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.57-4.15-1.63-4.15-3.81 0-1.89 1.4-3.26 3.09-3.57V4h2.67v1.9c1.7.35 2.96 1.48 3.16 2.95h-2.01c-.19-.94-.8-1.54-2.15-1.54-1.57 0-2.2.83-2.2 1.43 0 .74.45 1.43 2.79 2 2.48.59 4.03 1.77 4.03 3.86 0 1.94-1.4 3.32-3.23 3.65z"/></svg>
                 <div class="relative z-10">
                    <p class="text-indigo-100 text-[11px] font-black uppercase mb-3 flex items-center gap-2">
                       <span class="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                       ចំណូលទូទាំងប្រព័ន្ធ 
                    </p>
                    <div class="flex items-baseline gap-2">
                       <span class="text-4xl font-black tracking-tight">{{ grandTotals.usd.toLocaleString() }}</span>
                       <span class="text-xl font-bold opacity-80">$</span>
                    </div>
                    <div class="mt-2 pt-2 border-t border-white/20 flex items-baseline gap-2">
                       <span class="text-xl font-bold">{{ grandTotals.khr.toLocaleString() }}</span>
                       <span class="text-sm font-medium opacity-80">៛</span>
                    </div>
                 </div>
              </div>

              <div class="bg-white rounded-[24px] p-6 border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden flex flex-col justify-between group hover:border-blue-300 transition-colors">
                  <div class="relative z-10 flex justify-between items-start mb-4">
                     <div>
                        <p class="text-slate-400 text-[11px] font-black uppercase mb-1">អតិថិជនទូទាំងប្រព័ន្ធ</p>
                        <h3 class="text-3xl font-black text-slate-800">{{ grandTotals.clients.toLocaleString() }} <span class="text-sm font-bold text-slate-400">នាក់</span></h3>
                     </div>
                     <div class="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center shadow-inner">
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
                     </div>
                  </div>
                  <div class="relative z-10 pt-3 border-t border-slate-100 flex flex-col gap-2">
                     <p class="text-slate-400 text-[10px] font-black uppercase">បរិមាណលក់សរុប</p>
                     
                     <div class="flex flex-wrap gap-1.5 items-center">
                        <template v-if="Object.keys(grandTotals.units).length > 0">
                            <template v-for="(entry, idx) in Object.entries(grandTotals.units)" :key="entry[0]">
                                <span v-if="idx < 3 || expandedRowIds.has('mainGrandTotal')" class="text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 bg-white border shadow-sm" :class="getAppBadgeClass(entry[0])">
                                    {{ entry[1].toLocaleString() }} {{ translateUnit(entry[0]) }}
                                </span>
                            </template>
                            
                            <button 
                                v-if="Object.keys(grandTotals.units).length > 3" 
                                @click.stop="toggleRowExpand('mainGrandTotal')" 
                                class="text-[11px] font-bold text-indigo-500 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded-md transition-colors flex items-center gap-1 border border-indigo-100"
                            >
                                <span v-if="!expandedRowIds.has('mainGrandTotal')">+{{ Object.keys(grandTotals.units).length - 3 }} ទៀត</span>
                                <span v-else>បង្រួម</span>
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path v-if="!expandedRowIds.has('mainGrandTotal')" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
                                </svg>
                            </button>
                        </template>
                        <span v-else class="text-xs font-bold text-slate-300">០</span>
                     </div>
                  </div>
              </div>

              <div class="bg-white rounded-[24px] p-6 border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden flex flex-col justify-center group hover:border-emerald-300 transition-colors">
                  <p class="text-slate-400 text-[11px] font-black uppercase mb-4">ស្ថិតិអ្នកគ្រប់គ្រង</p>
                  <div class="space-y-3">
                     <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <span class="text-xs font-bold text-slate-600">អ្នកគ្រប់គ្រងសរុប</span>
                        <span class="font-black text-slate-800">{{ baseCalculatedData.length }}</span>
                     </div>
                     <div class="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
                        <span class="text-xs font-bold text-emerald-700">មានការលក់</span>
                        <span class="font-black text-emerald-700">{{ activeAdminsCount }}</span>
                     </div>
                     <div class="flex items-center justify-between p-2.5 rounded-xl bg-rose-50 border border-rose-100">
                        <span class="text-xs font-bold text-rose-700">គ្មានការលក់</span>
                        <span class="font-black text-rose-700">{{ inactiveAdminsCount }}</span>
                     </div>
                  </div>
              </div>
           </div>

           <div class="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
              <h3 class="text-lg font-black text-slate-800">បញ្ជីអ្នកគ្រប់គ្រង <span class="text-slate-400 font-medium text-sm">({{ displayedData.length }})</span></h3>
              
              <div class="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                 <div class="bg-slate-200/50 p-1.5 rounded-xl flex shadow-inner border border-slate-200 flex-1 sm:flex-none">
                    <button @click="activityFilter = 'all'" class="flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all" :class="activityFilter === 'all' ? 'bg-white text-slate-800 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'">ទាំងអស់</button>
                    <button @click="activityFilter = 'active'" class="flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5" :class="activityFilter === 'active' ? 'bg-white text-emerald-600 shadow-sm ring-1 ring-emerald-100' : 'text-slate-500 hover:text-emerald-600'">
                      <span class="w-2 h-2 rounded-full" :class="activityFilter === 'active' ? 'bg-emerald-500' : 'bg-slate-300'"></span> មានលក់
                    </button>
                    <button @click="activityFilter = 'inactive'" class="flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5" :class="activityFilter === 'inactive' ? 'bg-white text-rose-600 shadow-sm ring-1 ring-rose-100' : 'text-slate-500 hover:text-rose-600'">
                      <span class="w-2 h-2 rounded-full" :class="activityFilter === 'inactive' ? 'bg-rose-500' : 'bg-slate-300'"></span> គ្មានលក់
                    </button>
                 </div>

                 <div class="flex gap-2 w-full sm:w-auto">
                    <button 
                       @click="executeNativePrint" 
                       :disabled="displayedData.length === 0"
                       class="flex-1 sm:flex-none bg-slate-800 hover:bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2 transition-transform active:scale-95 font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                       <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2-2v4h10z"></path></svg>
                       <span>Print</span>
                    </button>

                    <button 
                       @click="generatePDF" 
                       :disabled="processing.active || displayedData.length === 0"
                       class="flex-1 sm:flex-none bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white px-4 py-2.5 rounded-xl shadow-lg shadow-rose-500/30 flex items-center justify-center gap-2 transition-transform active:scale-95 font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                       <svg v-if="processing.active" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                       <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                       <span>ទាញយក PDF</span>
                    </button>
                 </div>
              </div>
           </div>

           <div v-if="isLoading" class="flex flex-col items-center justify-center py-24 opacity-60">
              <div class="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-indigo-600 mb-4"></div>
           </div>
           <div v-else-if="displayedData.length === 0" class="flex flex-col items-center justify-center py-20 bg-white/50 backdrop-blur-sm rounded-[2rem] border-2 border-dashed border-slate-200">
              <p class="text-slate-600 font-bold text-lg">មិនមានទិន្នន័យទេ</p>
           </div>

           <div v-else>
              <div class="md:hidden flex flex-col gap-4">
                 <div 
                    v-for="(item, index) in displayedData" 
                    :key="item.id" 
                    @click="openAdminModal(item)"
                    class="bg-white p-5 rounded-[20px] shadow-sm border relative overflow-hidden transition-all cursor-pointer" 
                    :class="item.hasSales ? 'border-slate-100 hover:border-indigo-300' : 'border-rose-100/50 bg-slate-50/50 hover:border-rose-300'"
                 >
                    <div class="absolute top-0 right-0 px-3 py-1.5 rounded-bl-xl border-b border-l text-[10px] font-black" :class="item.hasSales ? 'bg-slate-50 text-slate-400 border-slate-100' : 'bg-rose-50 text-rose-400 border-rose-100'">#{{ index + 1 }}</div>
                    <div class="flex items-center gap-4 mb-4">
                       <div class="relative shrink-0">
                          <img :src="item.photoUrl || `https://ui-avatars.com/api/?name=${item.fullName}`" class="w-14 h-14 rounded-2xl object-cover shadow-sm border border-slate-100" :class="!item.hasSales ? 'grayscale-[40%] opacity-70' : ''">
                       </div>
                       <div class="flex-1 min-w-0 pr-6">
                          <h3 class="font-bold text-lg leading-tight truncate" :class="item.hasSales ? 'text-slate-800' : 'text-slate-500'">{{ item.fullName }}</h3>
                          <div class="flex items-center gap-2 mt-1">
                             <p class="text-[11px] text-indigo-500 font-mono font-bold">@{{ item.username }}</p>
                          </div>
                       </div>
                    </div>

                    <div class="flex justify-between items-center mt-3 pt-3 border-t border-slate-100">
                        <div class="flex gap-2">
                           <a v-if="item.telegram" @click.stop :href="'https://t.me/' + item.telegram.replace('@', '')" target="_blank" class="w-8 h-8 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-colors">
                               <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.48-.94-2.4-1.54-1.06-.7-.37-1.09.23-1.72.16-.16 2.87-2.63 2.92-2.85.01-.03.01-.14-.06-.2-.06-.06-.17-.04-.25-.02-.11.02-1.91 1.2-5.39 3.55-.5.34-.95.51-1.35.5-.44-.01-1.29-.25-1.92-.42-.77-.21-1.37-.32-1.31-.68.03-.18.28-.37.76-.56 3.03-1.32 5.06-2.19 6.09-2.62 2.93-1.21 3.53-1.43 3.93-1.43.09 0 .28.01.4.04.1.03.24.1.33.25.08.16.07.32.07.33z"/></svg>
                           </a>
                        </div>
                        <span class="text-xs font-bold text-slate-500">មើលបញ្ជីតំណាងលក់ &rarr;</span>
                    </div>
                 </div>
              </div>

              <div class="hidden md:block bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 overflow-hidden">
                 <table class="w-full text-left border-collapse">
                    <thead class="bg-slate-50/80 text-slate-500 text-[11px] uppercase font-black tracking-widest border-b border-slate-200">
                       <tr>
                          <th class="px-6 py-5 w-16 text-center">#</th>
                          <th class="px-6 py-5">អ្នកគ្រប់គ្រង</th>
                          <th class="px-6 py-5 text-center">តំណាងលក់សរុប</th>
                          <th class="px-6 py-5">ចំនួនលក់ (Units)</th>
                          <th class="px-6 py-5 text-center">អតិថិជនសរុប</th>
                          <th class="px-6 py-5 text-center">តេឡេក្រាម</th>
                          <th class="px-6 py-5 text-right">ចំណូល</th>
                       </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                       <tr 
                         v-for="(item, index) in displayedData" 
                         :key="item.id" 
                         @click="openAdminModal(item)"
                         class="transition-colors group cursor-pointer" 
                         :class="item.hasSales ? 'hover:bg-indigo-50/50' : 'bg-slate-50/30 hover:bg-slate-100/50'"
                       >
                          <td class="px-6 py-5 text-center"><span class="text-xs font-black" :class="item.hasSales ? 'text-slate-500' : 'text-slate-300'">{{ index + 1 }}</span></td>
                          
                          <td class="px-6 py-5">
                             <div class="flex items-center gap-4">
                                <img :src="item.photoUrl || `https://ui-avatars.com/api/?name=${item.fullName}`" class="w-11 h-11 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform" :class="!item.hasSales ? 'grayscale-[40%] opacity-70' : ''">
                                <div>
                                   <p class="font-bold text-sm mb-0.5 group-hover:text-indigo-600 transition-colors" :class="item.hasSales ? 'text-slate-800' : 'text-slate-500'">{{ item.fullName }}</p>
                                   <p class="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 font-mono font-bold inline-block">@{{ item.username }}</p>
                                </div>
                             </div>
                          </td>
                          
                          <td class="px-6 py-5 text-center">
                             <span class="inline-flex items-center px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold border border-slate-200 shadow-sm">{{ item.totalSellersCount }} នាក់</span>
                          </td>
                          
                          <td class="px-6 py-5">
                             <div v-if="item.hasSales" class="flex flex-wrap gap-2 items-center">
                                <template v-for="(entry, idx) in Object.entries(item.unitCounts)" :key="entry[0]">
                                   <span v-if="idx < 3 || expandedRowIds.has(item.id)" class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold shadow-sm border" :class="getAppBadgeClass(entry[0])">
                                      {{ entry[1].toLocaleString() }} {{ translateUnit(entry[0]) }}
                                   </span>
                                </template>
                                
                                <button 
                                   v-if="Object.keys(item.unitCounts).length > 3" 
                                   @click.stop="toggleRowExpand(item.id)" 
                                   class="text-[11px] font-bold text-indigo-500 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 border border-indigo-100"
                                >
                                   <span v-if="!expandedRowIds.has(item.id)">+{{ Object.keys(item.unitCounts).length - 3 }} ទៀត</span>
                                   <span v-else>បង្រួម</span>
                                   <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path v-if="!expandedRowIds.has(item.id)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                                      <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
                                   </svg>
                                </button>
                             </div>
                             <div v-else><span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-400">គ្មានការលក់</span></div>
                          </td>
                          
                          <td class="px-6 py-5 text-center">
                             <span v-if="item.hasSales" class="inline-flex items-center px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-sm font-bold border border-amber-100">{{ item.totalClients.toLocaleString() }} នាក់</span>
                             <span v-else class="text-slate-300 font-bold">-</span>
                          </td>

                          <td class="px-6 py-5 text-center" @click.stop>
                              <a v-if="item.telegram" :href="'https://t.me/' + item.telegram.replace('@', '')" target="_blank" class="text-sky-500 hover:text-white hover:bg-sky-500 w-9 h-9 rounded-xl inline-flex items-center justify-center transition-all bg-sky-50 shadow-sm hover:shadow-md mx-auto" title="ផ្ញើសារ Telegram">
                                 <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.48-.94-2.4-1.54-1.06-.7-.37-1.09.23-1.72.16-.16 2.87-2.63 2.92-2.85.01-.03.01-.14-.06-.2-.06-.06-.17-.04-.25-.02-.11.02-1.91 1.2-5.39 3.55-.5.34-.95.51-1.35.5-.44-.01-1.29-.25-1.92-.42-.77-.21-1.37-.32-1.31-.68.03-.18.28-.37.76-.56 3.03-1.32 5.06-2.19 6.09-2.62 2.93-1.21 3.53-1.43 3.93-1.43.09 0 .28.01.4.04.1.03.24.1.33.25.08.16.07.32.07.33z"/></svg>
                              </a>
                              <span v-else class="text-slate-300 font-bold">-</span>
                          </td>
                          
                          <td class="px-6 py-5 text-right">
                             <div v-if="item.hasSales" class="flex flex-col items-end gap-1">
                                <span class="text-emerald-700 font-black text-sm bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100/60 min-w-[90px] text-right shadow-sm">{{ item.revenueUSD.toLocaleString() }} $</span>
                                <span class="text-blue-700 font-bold text-xs bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100/60 min-w-[90px] text-right">{{ item.revenueKHR.toLocaleString() }} ៛</span>
                             </div>
                             <div v-else><span class="text-slate-300 font-bold">-</span></div>
                          </td>
                       </tr>
                    </tbody>
                 </table>
              </div>
           </div>
         </div>
      </div>

      <div v-if="displayedData.length > 0 && activityFilter !== 'inactive'" class="absolute bottom-6 left-0 right-0 px-4 md:px-8 pointer-events-none flex justify-center z-50 animate-slide-up">
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
                    <template v-if="Object.keys(grandTotals.units).length > 0">
                        <template v-for="(entry, idx) in Object.entries(grandTotals.units)" :key="entry[0]">
                            <span v-if="idx < 3 || expandedRowIds.has('mainGrandTotalFooter')" class="text-xs font-black text-slate-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm whitespace-nowrap">
                                {{ entry[1].toLocaleString() }} {{ translateUnit(entry[0]) }}
                            </span>
                        </template>

                        <button 
                            v-if="Object.keys(grandTotals.units).length > 3" 
                            @click.stop="toggleRowExpand('mainGrandTotalFooter')" 
                            class="text-[11px] font-bold text-indigo-500 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-md transition-colors flex items-center gap-1 border border-indigo-100 whitespace-nowrap"
                        >
                            <span v-if="!expandedRowIds.has('mainGrandTotalFooter')">+{{ Object.keys(grandTotals.units).length - 3 }} ទៀត</span>
                            <span v-else>បង្រួម</span>
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path v-if="!expandedRowIds.has('mainGrandTotalFooter')" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
                            </svg>
                        </button>
                    </template>
                </div>
               <div class="h-10 w-px bg-slate-200 hidden md:block"></div>
               <div class="text-right shrink-0">
                  <p class="text-xl md:text-2xl font-black text-emerald-600 leading-none">{{ grandTotals.usd.toLocaleString() }} <span class="text-sm opacity-80">$</span></p>
                  <p class="text-xs font-bold text-blue-600 mt-1">{{ grandTotals.khr.toLocaleString() }} ៛</p>
               </div>
            </div>
         </div>
      </div>
    </div>

    <AdminReportModal
      :is-open="isAdminModalOpen"
      :admin="selectedAdmin"
      :sellers="selectedAdminSellers"
      :unit-settings="unitSettings"
      @close="isAdminModalOpen = false"
      @error="(title, msg) => triggerAlert('error', title, msg)"
    />

    <transition enter-active-class="duration-300 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="processing.active" class="fixed inset-0 z-[99999] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
            <div class="w-full max-w-sm bg-[#18181b] border border-white/10 rounded-3xl p-10 shadow-2xl relative flex flex-col items-center text-center animate-fade-in-up">
                <div class="relative w-20 h-20 mb-8">
                    <div class="absolute inset-0 rounded-full border-4 border-white/5"></div>
                    <div class="absolute inset-0 rounded-full border-4 border-t-rose-500 border-r-rose-500 border-b-transparent border-l-transparent animate-spin"></div>
                    <div class="absolute inset-0 flex items-center justify-center font-bold text-white text-lg font-mono">{{ processing.progress }}%</div>
                </div>
                <h3 class="text-xl font-bold text-white mb-2">{{ processing.message }}</h3>
                <div class="w-full h-1.5 bg-black/50 rounded-full overflow-hidden border border-white/5">
                    <div class="h-full bg-gradient-to-r from-red-500 to-rose-600 transition-all duration-300 ease-out" :style="{ width: `${processing.progress}%` }"></div>
                </div>
            </div>
        </div>
    </transition>

    <div ref="printStaging" class="fixed top-0 left-[-9999px] pointer-events-none z-[-1]"></div>

    <CustomAlert 
       v-if="alert.show" 
       :type="alert.type" 
       :title="alert.title" 
       :message="alert.message" 
       @close="alert.show = false" 
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick, reactive } from 'vue';
import { db, auth } from '@/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import CustomAlert from '../../components/shared/CustomAlert.vue';

// IMPORT NEW MODAL
import AdminReportModal from '../../components/AdminReportModal.vue';

const isLoading = ref(true);
const adminsList = ref([]);
const allSales = ref([]); 
const allSellers = ref([]); 
const unitSettings = ref([]); 

const dateFilterType = ref('monthly'); 
const activityFilter = ref('all'); 
const selectedDate = ref(new Date().toISOString().split('T')[0]);
const selectedYear = ref(new Date().getFullYear());
const selectedMonth = ref(new Date().getMonth());
const customStart = ref(new Date().toISOString().split('T')[0]);
const customEnd = ref(new Date().toISOString().split('T')[0]);

const printStaging = ref(null);
const processing = ref({ active: false, message: '', progress: 0 });

const filterTabs = [
  { key: 'daily', label: 'ប្រចាំថ្ងៃ' },
  { key: 'monthly', label: 'ប្រចាំខែ' },
  { key: 'yearly', label: 'ប្រចាំឆ្នាំ' },
  { key: 'custom', label: 'កំណត់ថ្ងៃ' },
];

const monthNames = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'];

const isAdminModalOpen = ref(false);
const selectedAdmin = ref(null);
const expandedRowIds = ref(new Set()); 

const alert = reactive({ show: false, title: '', message: '', type: 'success' });
const triggerAlert = (type, title, message) => {
  alert.type = type; alert.title = title; alert.message = message; alert.show = true;
  setTimeout(() => alert.show = false, 3000);
};

onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
       try {
          const adminQ = query(collection(db, 'users'), where('role', '==', 'admin'));
          const adminSnap = await getDocs(adminQ);
          adminsList.value = adminSnap.docs
              .map(doc => ({ id: doc.id, ...doc.data() }))
              .filter(a => a.isDeleted === false || a.isDeleted === "false" || !a.isDeleted);

          const salesSnap = await getDocs(collection(db, 'sales_reports'));
          allSales.value = salesSnap.docs.map(doc => doc.data());

          const sellerQ = query(collection(db, 'users'), where('role', '==', 'seller'));
          const sellerSnap = await getDocs(sellerQ);
          allSellers.value = sellerSnap.docs.map(doc => doc.data());

          const unitSettingsSnap = await getDocs(collection(db, 'settings_units'));
          unitSettings.value = unitSettingsSnap.docs.map(doc => doc.data());

          if (allSales.value.length > 0) {
             const latestDate = allSales.value.map(s => new Date(s.date)).sort((a,b) => b - a)[0];
             selectedYear.value = latestDate.getFullYear();
             selectedMonth.value = latestDate.getMonth();
             selectedDate.value = latestDate.toISOString().split('T')[0];
          }
       } catch (error) {
          console.error("Error", error);
       } finally {
          isLoading.value = false;
       }
    }
  });
});

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

// Fixed data logic to properly grab both Admins and ALL their sellers' sales
const baseCalculatedData = computed(() => {
   if (adminsList.value.length === 0) return [];
   
   return adminsList.value.map(admin => {
      // Find all seller IDs belonging to this admin
      const adminSellersIds = allSellers.value.filter(seller => seller.createdBy === admin.id).map(s => s.id);

      // A sale belongs to the admin if the admin created it OR if any of their sellers created/owned it
      const relevantSales = allSales.value.filter(s => {
          const isMatch = s.createdBy === admin.id || adminSellersIds.includes(s.createdBy) || adminSellersIds.includes(s.sellerId);
          return isMatch && isDateInScope(s.date);
      });

      let totalClients = 0;
      let revenueUSD = 0;
      let revenueKHR = 0;
      let unitCounts = {}; 

      relevantSales.forEach(sale => {
         const u = (sale.unit || 'unknown').toLowerCase().trim();
         if (!unitCounts[u]) unitCounts[u] = 0;
         unitCounts[u] += Number(sale.totalSold || 0);
         totalClients += Number(sale.totalClients || 0);
         if (sale.currency === 'USD' || sale.currency === '$') revenueUSD += Number(sale.totalPrice || 0);
         else revenueKHR += Number(sale.totalPrice || 0);
      });

      const hasSales = totalClients > 0 || Object.keys(unitCounts).length > 0;
      const totalSellersCount = adminSellersIds.length;
      return { ...admin, unitCounts, totalClients, revenueUSD, revenueKHR, hasSales, totalSellersCount };
   }).sort((a, b) => {
       if (a.hasSales && !b.hasSales) return -1;
       if (!a.hasSales && b.hasSales) return 1;
       return (b.revenueUSD + (b.revenueKHR/4000)) - (a.revenueUSD + (a.revenueKHR/4000));
   }); 
});

const activeAdminsCount = computed(() => baseCalculatedData.value.filter(a => a.hasSales).length);
const inactiveAdminsCount = computed(() => baseCalculatedData.value.filter(a => !a.hasSales).length);

const displayedData = computed(() => {
    if (activityFilter.value === 'active') return baseCalculatedData.value.filter(a => a.hasSales);
    if (activityFilter.value === 'inactive') return baseCalculatedData.value.filter(a => !a.hasSales);
    return baseCalculatedData.value;
});

const grandTotals = computed(() => {
   let units = {};
   let clients = 0;
   let usd = 0; let khr = 0;

   baseCalculatedData.value.forEach(row => {
      if(row.hasSales) {
          for (const [unit, count] of Object.entries(row.unitCounts)) {
              if (count > 0) {
                  if (!units[unit]) units[unit] = 0;
                  units[unit] += count;
              }
          }
          clients += row.totalClients;
          usd += row.revenueUSD;
          khr += row.revenueKHR;
      }
   });
   return { units, clients, usd, khr };
});

const reportDateLabel = computed(() => {
   if (dateFilterType.value === 'daily') return new Intl.DateTimeFormat('km-KH', { dateStyle: 'long' }).format(new Date(selectedDate.value));
   if (dateFilterType.value === 'monthly') return `ខែ ${monthNames[selectedMonth.value]} ឆ្នាំ ${selectedYear.value}`;
   if (dateFilterType.value === 'yearly') return `ឆ្នាំ ${selectedYear.value}`;
   if (dateFilterType.value === 'custom') return `${selectedDateFormatter(customStart.value)} ដល់ ${selectedDateFormatter(customEnd.value)}`;
   return '';
});

const selectedDateFormatter = (dateStr) => {
    if(!dateStr) return '';
    return new Intl.DateTimeFormat('km-KH', { dateStyle: 'medium' }).format(new Date(dateStr));
};

const openAdminModal = (admin) => {
    selectedAdmin.value = admin;
    isAdminModalOpen.value = true;
};

const toggleRowExpand = (id) => {
    const newSet = new Set(expandedRowIds.value);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    expandedRowIds.value = newSet;
};

// ប្តូរអនុគមន៍នេះនៅក្នុង script setup នៃ OwnerReports.vue របស់អ្នក
const selectedAdminSellers = computed(() => {
   if (!selectedAdmin.value) return [];
   
   return allSellers.value
      .filter(s => s.createdBy === selectedAdmin.value.id)
      .map(seller => {
         // 🚀 ចំនុចសំខាន់៖ ទាញយកទិន្នន័យលក់របស់ Seller ម្នាក់ៗមកគណនាឡើងវិញក្នុង Modal
         const relevantSales = allSales.value.filter(sale => 
            sale.sellerId === seller.id && 
            isDateInScope(sale.date)
         );
         
         let totalClients = 0;
         let usd = 0;
         let khr = 0;
         let unitCounts = {}; // ប្រើឈ្មោះ unitCounts ឱ្យដូច Template
         
         relevantSales.forEach(sale => {
             totalClients += Number(sale.totalClients || 0);
             if (sale.currency === 'USD' || sale.currency === '$') {
                usd += Number(sale.totalPrice || 0);
             } else {
                khr += Number(sale.totalPrice || 0);
             }
             
             // រាប់ចំនួនដប/កេស តាមប្រភេទ
             const u = (sale.unit || 'unknown').toLowerCase().trim();
             unitCounts[u] = (unitCounts[u] || 0) + Number(sale.totalSold || 0);
         });

         const hasSales = relevantSales.length > 0;

         return { 
            ...seller, 
            totalClients, 
            revenueUSD: usd, // ប្រើឈ្មោះ revenueUSD ឱ្យដូច Template
            revenueKHR: khr, // ប្រើឈ្មោះ revenueKHR ឱ្យដូច Template
            unitCounts, 
            hasSales,
            rawSale: relevantSales.length > 0 ? relevantSales[0] : null // សម្រាប់ Inline Edit បើចង់ប្រើ
         };
      })
      .sort((a, b) => {
         if (a.hasSales && !b.hasSales) return -1;
         if (!a.hasSales && b.hasSales) return 1;
         return b.revenueUSD - a.revenueUSD;
      });
});


// ---------------------------------------------------------
// NATIVE BROWSER PRINT LOGIC (ALL ADMINS)
// ---------------------------------------------------------
const executeNativePrint = () => {
    const contentHTML = generatePageHTML(displayedData.value, 1, 1, true);
    triggerPrint(contentHTML, `Master_Sales_Report_${dateFilterType.value}`);
};

const triggerPrint = (htmlContent, title) => {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
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
                body { 
                    font-family: 'Battambong', 'Kantumruy Pro', sans-serif; 
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                    margin: 0; padding: 15mm;
                    background-color: white;
                }
                table { width: 100%; border-collapse: collapse; }
                tr    { page-break-inside: avoid; page-break-after: auto; }
                thead { display: table-header-group; }
                tfoot { display: table-footer-group; }
            </style>
        </head>
        <body>${htmlContent}</body>
        </html>
    `);
    doc.close();

    iframe.contentWindow.document.fonts.ready.then(() => {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
        setTimeout(() => { document.body.removeChild(iframe); }, 1000);
    });
};

// ---------------------------------------------------------
// PDF LOGIC (ALL ADMINS)
// ---------------------------------------------------------
const generatePDF = async () => {
    processing.value = { active: true, message: 'កំពុងបំបែកទិន្នន័យ...', progress: 10 };
    
    try {
        const rowsPerPage = 16; 
        const pages = [];
        let remaining = [...displayedData.value];
        let rowCounter = 1;
        
        while(remaining.length > 0) {
            pages.push(remaining.slice(0, rowsPerPage).map(r => ({...r, index: rowCounter++})));
            remaining = remaining.slice(rowsPerPage);
        }

        const pdf = new jsPDF('p', 'mm', 'a4'); 
        const pdfWidth = 210; 
        
        for (let i = 0; i < pages.length; i++) {
            processing.value.message = `កំពុងថតចម្លងទំព័រទី ${i+1} នៃ ${pages.length}...`;
            
            printStaging.value.innerHTML = generatePageHTML(pages[i], i + 1, pages.length, false);
            
            await nextTick(); 
            await document.fonts.ready;
            await new Promise(r => setTimeout(r, 600)); 

            const canvas = await html2canvas(printStaging.value.querySelector('.print-page'), { 
                scale: 2, 
                useCORS: true, 
                logging: false, 
                backgroundColor: "#ffffff",
                windowWidth: 1000
            });
            
            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            if (i > 0) pdf.addPage();
            
            const props = pdf.getImageProperties(imgData);
            const pdfHeight = (props.height * pdfWidth) / props.width;
            
            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
            processing.value.progress = 10 + Math.round(((i + 1) / pages.length) * 80);
        }

        processing.value.message = 'កំពុងរក្សាទុកឯកសារ...';
        processing.value.progress = 100;
        pdf.save(`Master_Sales_Report_${dateFilterType.value}.pdf`);
        
    } catch(e) {
        console.error(e);
        triggerAlert('error', 'បរាជ័យ', 'មិនអាចទាញយក PDF បានទេ');
    } finally {
        if(printStaging.value) printStaging.value.innerHTML = '';
        processing.value.active = false;
    }
};

const generatePageHTML = (rows, pageNum, totalPages, isNativePrint = false) => {
    const rowsHTML = rows.map((item) => {
        let salesHTML = '';
        if (item.hasSales) {
            salesHTML = `<div style="display: flex; flex-direction: column; gap: 6px;">` + 
                Object.entries(item.unitCounts || {}).map(([u, c]) => 
                    `<div style="display: flex; justify-content: space-between; font-size: 13px; border-bottom: 1px solid #f1f5f9; padding-bottom: 2px;">
                        <span style="color: #475569;">${translateUnit(u)}</span>
                        <span style="font-weight: 900; color: #1e293b;">${c.toLocaleString()}</span>
                     </div>`
                ).join('') + `</div>`;
        } else {
            salesHTML = `<span style="font-size: 13px; font-weight: bold; color: #94a3b8;">គ្មានការលក់</span>`;
        }

        let revenueHTML = '';
        if (item.hasSales) {
            revenueHTML = `
                <div style="text-align: right;">
                    <div style="font-weight: 900; color: #047857; font-size: 16px;">${item.revenueUSD.toLocaleString()} $</div>
                    <div style="font-weight: bold; color: #1d4ed8; font-size: 13px;">${item.revenueKHR.toLocaleString()} ៛</div>
                </div>`;
        } else {
            revenueHTML = `<div style="text-align: right; font-weight: bold; color: #94a3b8; font-size: 16px;">-</div>`;
        }

        return `
            <tr style="border-bottom: 1px solid #e2e8f0; break-inside: avoid; page-break-inside: avoid; ${!item.hasSales ? 'background-color: #f8fafc;' : ''}">
                <td style="padding: 14px 10px; text-align: center; vertical-align: middle; font-weight: 900; color: #94a3b8; font-size: 14px;">${item.index || rows.indexOf(item) + 1}</td>
                <td style="padding: 14px 10px; vertical-align: middle;">
                    <p style="font-weight: bold; color: #1e293b; font-size: 16px; margin: 0;">${item.fullName}</p>
                </td>
                <td style="padding: 14px 10px; text-align: center; vertical-align: middle; font-weight: bold; color: #475569; font-size: 16px;">${item.totalSellersCount}</td>
                <td style="padding: 14px 10px; vertical-align: middle;">${salesHTML}</td>
                <td style="padding: 14px 10px; text-align: center; vertical-align: middle; font-weight: bold; color: #334155; font-size: 16px;">
                    ${item.hasSales ? item.totalClients.toLocaleString() + ' នាក់' : '-'}
                </td>
                <td style="padding: 14px 10px; vertical-align: middle;">${revenueHTML}</td>
            </tr>
        `;
    }).join('');

    let summarySectionHTML = '';
    if (pageNum === totalPages || isNativePrint) {
        const unitsList = Object.entries(grandTotals.value.units || {}).map(([u, c]) => 
            `<div style="display: flex; justify-content: space-between; border-bottom: 1px dashed #cbd5e1; padding: 6px 0;">
                <span style="color: #475569; font-size: 14px;">${translateUnit(u)}</span>
                <span style="font-weight: 900; color: #0f172a; font-size: 14px;">${c.toLocaleString()}</span>
            </div>`
        ).join('');

        summarySectionHTML = `
            <div style="margin-top: 40px; display: flex; justify-content: space-between; align-items: flex-start; break-inside: avoid; page-break-inside: avoid;">
                <div style="width: 45%; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px;">
                    <h3 style="font-size: 16px; font-weight: 900; color: #1e293b; margin: 0 0 15px 0; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">សរុបបរិមាណលក់តាមប្រភេទ</h3>
                    ${unitsList || '<p style="color: #94a3b8; font-size: 14px;">គ្មានទិន្នន័យ</p>'}
                </div>

                <div style="width: 45%; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px;">
                    <h3 style="font-size: 16px; font-weight: 900; color: #1e293b; margin: 0 0 15px 0; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">សរុបរួម (Grand Total)</h3>
                    
                    <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                        <span style="color: #475569; font-size: 14px;">អតិថិជនសរុប:</span>
                        <span style="font-weight: 900; color: #0f172a; font-size: 16px;">${grandTotals.value.clients.toLocaleString()} នាក់</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                        <span style="color: #475569; font-size: 14px;">ចំណូល (USD):</span>
                        <span style="font-weight: 900; color: #059669; font-size: 20px;">${grandTotals.value.usd.toLocaleString()} $</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: #475569; font-size: 14px;">ចំណូល (KHR):</span>
                        <span style="font-weight: 900; color: #2563eb; font-size: 16px;">${grandTotals.value.khr.toLocaleString()} ៛</span>
                    </div>
                </div>
            </div>
        `;
    }

    const pageStyles = isNativePrint
        ? `width: 100%; box-sizing: border-box; font-family: 'Battambong', 'Kantumruy Pro', sans-serif; line-height: 1.6; padding: 20px;`
        : `width: 1000px; min-height: 1414px; background: white; padding: 40px; box-sizing: border-box; display: flex; flex-direction: column; font-family: 'Battambong', 'Kantumruy Pro', sans-serif; line-height: 1.6;`;

    return `
        <div class="print-page" style="${pageStyles}">
            
            <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #4f46e5;">
                <h1 style="font-size: 36px; font-weight: 900; color: #4338ca; margin: 0; text-align: center; width: 100%;">របាយការណ៍លក់សរុបរបស់ Admin</h1>
            </div>

            <div style="flex: 1;">
                <table style="width: 100%; text-align: left; border-collapse: collapse; background-color: #ffffff;">
                    <thead style="color: #334155; font-size: 14px; font-weight: 900; border-bottom: 2px solid #cbd5e1; display: table-header-group;">
                        <tr>
                            <th style="padding: 14px 10px; width: 5%; text-align: center; vertical-align: middle;">#</th>
                            <th style="padding: 14px 10px; width: 25%; vertical-align: middle;">អ្នកគ្រប់គ្រង</th>
                            <th style="padding: 14px 10px; width: 15%; text-align: center; vertical-align: middle;">តំណាងលក់សរុប</th>
                            <th style="padding: 14px 10px; width: 30%; vertical-align: middle;">ចំនួនលក់</th>
                            <th style="padding: 14px 10px; width: 10%; text-align: center; vertical-align: middle;">អតិថិជន</th>
                            <th style="padding: 14px 10px; width: 15%; text-align: right; vertical-align: middle;">ចំណូល</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rowsHTML}
                    </tbody>
                </table>
                ${summarySectionHTML}
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 25px; padding-top: 15px; font-size: 12px; font-weight: bold; color: #94a3b8; break-inside: avoid; page-break-inside: avoid;">
                <div>
                   <span style="display: inline-block; background-color: #f8fafc; padding: 4px 10px; border-radius: 6px; border: 1px solid #e2e8f0; color: #1e293b; font-size: 14px; font-weight: 900;">កាលបរិច្ឆេទ: ${reportDateLabel.value}</span>
                   &nbsp;&nbsp;ថ្ងៃបញ្ចេញរបាយការណ៍ • ${new Date().toLocaleString('km-KH')}
                </div>
                <div>
                   ${isNativePrint ? '' : `ទំព័រទី ${pageNum} នៃ ${totalPages}`}
                </div>
            </div>
        </div>
    `;
};

// Helpers
const translateUnit = (unitVal) => {
    if (!unitVal) return '';
    const safeVal = String(unitVal);
    const found = unitSettings.value.find(u => String(u.value) === safeVal);
    if (found) return found.label;
    
    // Fallbacks
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

</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Battambong:wght@400;700;900&family=Kantumruy+Pro:wght@400;700&display=swap');
</style>

<style scoped>
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

/* PDF PRINT STYLES */
@media print {
 .print\:hidden { display: none !important; }
}
</style>