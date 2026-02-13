<template>
  <div class="font-khmer h-[100dvh] flex flex-col relative bg-[#F4F7FE] overflow-hidden">
    
    <Teleport to="body">
      <div class="fixed top-4 right-4 z-[9999] w-full max-w-sm pointer-events-none flex flex-col gap-2">
        <div class="pointer-events-auto">
          <CustomAlert 
            :show="alert.show" 
            :title="alert.title" 
            :message="alert.message" 
            :type="alert.type" 
            @close="alert.show = false"
          />
        </div>
      </div>
    </Teleport>

    <div class="flex-none bg-white/80 backdrop-blur-2xl border-b border-slate-200/60 z-40 transition-all shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
      <div class="px-4 md:px-8 py-4 md:py-5">
        
        <div class="flex flex-col xl:flex-row xl:items-center justify-between gap-5 mb-5">
          <div class="flex items-center gap-4">
             <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white shrink-0">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
             </div>
             <div>
               <h1 class="text-2xl md:text-3xl font-black text-slate-800 tracking-tight leading-tight">របាយការណ៍លក់</h1>
               <p class="text-slate-500 text-[11px] md:text-xs font-bold uppercase tracking-wider mt-0.5">Sales Analytics Center</p>
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
                   <span class="text-slate-400 text-[10px] font-black uppercase tracking-wider">Date</span>
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

    <div class="flex-1 overflow-y-auto custom-scrollbar scroll-smooth relative pb-32">
       
       <div class="px-4 md:px-8 py-6 max-w-7xl mx-auto w-full">
         
         <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
            <div class="bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 rounded-[24px] p-6 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 cursor-default">
               <div class="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-500"></div>
               <svg class="absolute right-4 bottom-4 w-24 h-24 text-white opacity-[0.07] group-hover:scale-110 transition-transform duration-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.15-1.46-3.27-3.04h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.57-4.15-1.63-4.15-3.81 0-1.89 1.4-3.26 3.09-3.57V4h2.67v1.9c1.7.35 2.96 1.48 3.16 2.95h-2.01c-.19-.94-.8-1.54-2.15-1.54-1.57 0-2.2.83-2.2 1.43 0 .74.45 1.43 2.79 2 2.48.59 4.03 1.77 4.03 3.86 0 1.94-1.4 3.32-3.23 3.65z"/></svg>
               <div class="relative z-10">
                  <p class="text-indigo-100 text-[11px] font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                     <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                     ចំណូលសរុប (Revenue)
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

            <div class="bg-white rounded-[24px] p-6 border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                <div class="flex justify-between items-start mb-4">
                   <div>
                      <p class="text-slate-400 text-[11px] font-black uppercase tracking-widest mb-1">ចំនួនលក់សរុប (Units)</p>
                      <h3 class="text-3xl font-black text-slate-800">{{ grandTotals.totalUnitsCount.toLocaleString() }}</h3>
                   </div>
                   <div class="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-500 flex items-center justify-center">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                   </div>
                </div>
                <div class="flex flex-wrap gap-2 pt-3 border-t border-slate-100">
                   <template v-if="Object.keys(grandTotals.units).length > 0">
                       <span v-for="(count, unit) in grandTotals.units" :key="unit" class="text-xs font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1.5" :class="getUnitBadgeColor(unit)">
                          {{ count.toLocaleString() }} {{ translateUnit(unit) }}
                       </span>
                   </template>
                   <span v-else class="text-xs font-bold text-slate-300">គ្មានទិន្នន័យ</span>
                </div>
            </div>

            <div class="bg-white rounded-[24px] p-6 border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                <div class="flex justify-between items-start mb-4">
                   <div>
                      <p class="text-slate-400 text-[11px] font-black uppercase tracking-widest mb-1">អតិថិជន (Clients)</p>
                      <h3 class="text-3xl font-black text-slate-800">{{ grandTotals.clients.toLocaleString() }} <span class="text-sm font-bold text-slate-400">នាក់</span></h3>
                   </div>
                   <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
                      <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
                   </div>
                </div>
                <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
                   <p class="text-xs font-bold text-slate-500">តំណាងលក់សកម្ម</p>
                   <span class="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-lg text-xs font-black">{{ activeSellersCount }} អ្នក</span>
                </div>
            </div>
         </div>

         <div class="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <h3 class="text-lg font-black text-slate-800">បញ្ជីតំណាងលក់ <span class="text-slate-400 font-medium text-sm">({{ displayedData.length }})</span></h3>
            
            <div class="bg-slate-200/50 p-1.5 rounded-xl flex w-full sm:w-auto shadow-inner border border-slate-200">
               <button 
                 @click="activityFilter = 'all'"
                 class="flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all"
                 :class="activityFilter === 'all' ? 'bg-white text-slate-800 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'"
               >ទាំងអស់</button>
               <button 
                 @click="activityFilter = 'active'"
                 class="flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                 :class="activityFilter === 'active' ? 'bg-white text-emerald-600 shadow-sm ring-1 ring-emerald-100' : 'text-slate-500 hover:text-emerald-600'"
               >
                 <span class="w-2 h-2 rounded-full" :class="activityFilter === 'active' ? 'bg-emerald-500' : 'bg-slate-300'"></span> លក់បាន
               </button>
               <button 
                 @click="activityFilter = 'inactive'"
                 class="flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                 :class="activityFilter === 'inactive' ? 'bg-white text-rose-600 shadow-sm ring-1 ring-rose-100' : 'text-slate-500 hover:text-rose-600'"
               >
                 <span class="w-2 h-2 rounded-full" :class="activityFilter === 'inactive' ? 'bg-rose-500' : 'bg-slate-300'"></span> មិនបានលក់
               </button>
            </div>
         </div>

         <div v-if="isLoading" class="flex flex-col items-center justify-center py-24 opacity-60">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-indigo-600 mb-4"></div>
            <p class="text-slate-500 font-bold tracking-wide">កំពុងទាញយកទិន្នន័យ...</p>
         </div>

         <div v-else-if="displayedData.length === 0" class="flex flex-col items-center justify-center py-24 bg-white/50 backdrop-blur-sm rounded-[2rem] border-2 border-dashed border-slate-200">
            <div class="w-20 h-20 bg-white shadow-sm rounded-full flex items-center justify-center mb-4 text-slate-300">
               <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            </div>
            <p class="text-slate-600 font-bold text-lg">មិនមានទិន្នន័យទេ</p>
            <p class="text-slate-400 text-sm mt-1">សូមជ្រើសរើសកាលបរិច្ឆេទផ្សេងទៀត។</p>
         </div>

         <div v-else>
            
            <div class="md:hidden flex flex-col gap-4">
               <div v-for="(item, index) in displayedData" :key="item.id" class="bg-white p-5 rounded-[20px] shadow-[0_4px_15px_rgb(0,0,0,0.03)] border relative overflow-hidden group transition-all" :class="item.hasSales ? 'border-slate-100' : 'border-rose-100/50 bg-slate-50/50'">
                  
                  <div class="absolute top-0 right-0 bg-gradient-to-bl from-slate-100 to-white px-3 py-1.5 rounded-bl-xl border-b border-l border-slate-100">
                     <span class="text-slate-400 font-black text-xs">#{{ index + 1 }}</span>
                  </div>

                  <div class="flex items-center gap-4 mb-5">
                     <div class="relative">
                        <img :src="item.photoUrl || `https://ui-avatars.com/api/?name=${item.fullName}`" class="w-14 h-14 rounded-2xl object-cover border border-slate-100 shadow-sm" :class="item.hasSales ? '' : 'grayscale-[30%] opacity-80'">
                        <span class="absolute -bottom-1 -left-1 w-4 h-4 rounded-full border-2 border-white shadow-sm" :class="item.hasSales ? 'bg-emerald-500' : 'bg-rose-500'"></span>
                        
                        <div class="absolute -bottom-2 -right-2 flex gap-1 z-10">
                           <button v-if="dateFilterType === 'daily' && item.hasSales" @click="openEditModal(item)" class="bg-white p-1 rounded-full shadow-sm hover:scale-110 transition-transform">
                              <div class="bg-amber-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center">
                                 <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                              </div>
                           </button>
                           <a v-if="item.telegram" :href="'https://t.me/'+item.telegram" target="_blank" class="bg-white p-1 rounded-full shadow-sm hover:scale-110 transition-transform">
                             <div class="bg-sky-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center">
                                <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.48-.94-2.4-1.54-1.06-.7-.37-1.09.23-1.72.16-.16 2.87-2.63 2.92-2.85.01-.03.01-.14-.06-.2-.06-.06-.17-.04-.25-.02-.11.02-1.91 1.2-5.39 3.55-.5.34-.95.51-1.35.5-.44-.01-1.29-.25-1.92-.42-.77-.21-1.37-.32-1.31-.68.03-.18.28-.37.76-.56 3.03-1.32 5.06-2.19 6.09-2.62 2.93-1.21 3.53-1.43 3.93-1.43.09 0 .28.01.4.04.1.03.24.1.33.25.08.16.07.32.07.33z"/></svg>
                             </div>
                          </a>
                        </div>
                     </div>
                     <div class="flex-1 min-w-0 pr-6">
                        <h3 class="font-bold text-lg leading-tight truncate" :class="item.hasSales ? 'text-slate-800' : 'text-slate-500'">{{ item.fullName }}</h3>
                        <p class="text-[11px] text-slate-400 font-mono mt-0.5 font-bold">ID: {{ item.idNumber || 'N/A' }}</p>
                     </div>
                  </div>

                  <div v-if="item.hasSales" class="bg-slate-50/80 rounded-xl p-4 grid grid-cols-2 gap-4 border border-slate-100/80">
                     <div>
                        <p class="text-[10px] text-slate-400 font-black uppercase tracking-wider mb-2">បរិមាណលក់</p>
                        <div class="flex flex-col gap-1.5">
                           <span v-for="(count, unit) in item.unitCounts" :key="unit" class="text-[11px] font-bold px-2.5 py-1 rounded-md bg-white border shadow-sm w-fit" :class="getUnitBadgeColor(unit)">
                              {{ count.toLocaleString() }} {{ translateUnit(unit) }}
                           </span>
                        </div>
                     </div>
                     <div class="text-right flex flex-col justify-between">
                        <div>
                           <p class="text-[10px] text-slate-400 font-black uppercase tracking-wider mb-1">អតិថិជន</p>
                           <p class="text-sm font-bold text-slate-700"><span class="text-orange-500">{{ item.totalClients }}</span> នាក់</p>
                        </div>
                        <div class="mt-3 pt-3 border-t border-slate-200/60">
                           <p class="text-base font-black text-emerald-600 leading-none">{{ item.revenueUSD.toLocaleString() }} $</p>
                           <p class="text-[11px] font-bold text-blue-600 mt-1">{{ item.revenueKHR.toLocaleString() }} ៛</p>
                        </div>
                     </div>
                  </div>

                  <div v-else class="bg-rose-50/50 rounded-xl p-3 border border-rose-100/50 flex items-center justify-center gap-2">
                      <svg class="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                      <span class="text-xs font-bold text-rose-500">មិនមានទិន្នន័យលក់ទេ</span>
                  </div>
               </div>
            </div>

            <div class="hidden md:block bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 overflow-hidden">
               <table class="w-full text-left border-collapse">
                  <thead class="bg-slate-50/80 text-slate-500 text-[11px] uppercase font-black tracking-widest border-b border-slate-200">
                     <tr>
                        <th class="px-6 py-5 w-16 text-center">#</th>
                        <th class="px-6 py-5">តំណាងលក់ (Seller)</th>
                        <th class="px-6 py-5">ចំនួនលក់ (Units Sold)</th>
                        <th class="px-6 py-5 text-center">ចំនួនភ្ញៀវ</th>
                        <th class="px-6 py-5 text-right">ចំណូលសរុប (Revenue)</th>
                        <th class="px-6 py-5 text-center w-32">សកម្មភាព (Actions)</th>
                     </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100">
                     <tr v-for="(item, index) in displayedData" :key="item.id" class="transition-colors group" :class="item.hasSales ? 'hover:bg-indigo-50/30' : 'bg-slate-50/30'">
                        <td class="px-6 py-5 text-center">
                           <span class="text-xs font-black" :class="item.hasSales ? 'text-indigo-500' : 'text-slate-400'">{{ index + 1 }}</span>
                        </td>
                        
                        <td class="px-6 py-5">
                           <div class="flex items-center gap-4">
                              <div class="relative">
                                 <img :src="item.photoUrl || `https://ui-avatars.com/api/?name=${item.fullName}`" class="w-11 h-11 rounded-2xl object-cover border border-slate-200 shadow-sm transition-transform duration-300" :class="item.hasSales ? 'group-hover:scale-105' : 'grayscale-[40%] opacity-70'">
                                 <span class="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm" :class="item.hasSales ? 'bg-emerald-500' : 'bg-rose-400'"></span>
                              </div>
                              <div>
                                 <p class="font-bold text-sm mb-0.5" :class="item.hasSales ? 'text-slate-800' : 'text-slate-500'">{{ item.fullName }}</p>
                                 <div class="flex items-center gap-2">
                                    <span class="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 font-mono font-bold">{{ item.idNumber || 'N/A' }}</span>
                                    <span class="text-[10px] text-slate-400 font-medium">{{ item.phoneNumber }}</span>
                                 </div>
                              </div>
                           </div>
                        </td>

                        <td class="px-6 py-5">
                           <div v-if="item.hasSales" class="flex flex-wrap gap-2">
                              <span v-for="(count, unit) in item.unitCounts" :key="unit" 
                                    class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border cursor-default bg-white shadow-sm"
                                    :class="getUnitBadgeColor(unit)">
                                 {{ count.toLocaleString() }} {{ translateUnit(unit) }}
                              </span>
                           </div>
                           <div v-else>
                              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-50 text-rose-500 border border-rose-100">
                                 គ្មានការលក់
                              </span>
                           </div>
                        </td>

                        <td class="px-6 py-5 text-center">
                           <span v-if="item.hasSales" class="inline-flex items-center px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-sm font-bold border border-amber-100">
                              {{ item.totalClients.toLocaleString() }}
                           </span>
                           <span v-else class="text-slate-300 font-bold">-</span>
                        </td>

                        <td class="px-6 py-5 text-right">
                           <div v-if="item.hasSales" class="flex flex-col items-end gap-1">
                              <span class="text-emerald-700 font-black text-sm bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100/60 min-w-[90px] text-right shadow-sm">
                                 {{ item.revenueUSD.toLocaleString() }} $
                              </span>
                              <span class="text-blue-700 font-bold text-xs bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100/60 min-w-[90px] text-right">
                                 {{ item.revenueKHR.toLocaleString() }} ៛
                              </span>
                           </div>
                           <div v-else>
                               <span class="text-slate-300 font-bold">-</span>
                           </div>
                        </td>

                        <td class="px-6 py-5 text-center">
                           <div class="flex items-center justify-center gap-2">
                              <a v-if="item.telegram" :href="'https://t.me/' + item.telegram" target="_blank" class="text-sky-500 hover:text-white hover:bg-sky-500 w-9 h-9 rounded-xl inline-flex items-center justify-center transition-all bg-sky-50 shadow-sm hover:shadow-md" :class="!item.hasSales ? 'opacity-60 grayscale' : ''">
                                 <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.48-.94-2.4-1.54-1.06-.7-.37-1.09.23-1.72.16-.16 2.87-2.63 2.92-2.85.01-.03.01-.14-.06-.2-.06-.06-.17-.04-.25-.02-.11.02-1.91 1.2-5.39 3.55-.5.34-.95.51-1.35.5-.44-.01-1.29-.25-1.92-.42-.77-.21-1.37-.32-1.31-.68.03-.18.28-.37.76-.56 3.03-1.32 5.06-2.19 6.09-2.62 2.93-1.21 3.53-1.43 3.93-1.43.09 0 .28.01.4.04.1.03.24.1.33.25.08.16.07.32.07.33z"/></svg>
                              </a>
                              <span v-else-if="!item.hasSales" class="text-slate-300 font-black">-</span>

                              <button v-if="dateFilterType === 'daily' && item.hasSales" @click="openEditModal(item)" class="text-amber-500 hover:text-white hover:bg-amber-500 w-9 h-9 rounded-xl inline-flex items-center justify-center transition-all bg-amber-50 shadow-sm hover:shadow-md">
                                 <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                              </button>
                           </div>
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
                    <span v-for="(count, unit) in grandTotals.units" :key="unit" class="text-xs font-black text-slate-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm whitespace-nowrap">
                       {{ count.toLocaleString() }} {{ translateUnit(unit) }}
                    </span>
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

    <TransitionRoot appear :show="isEditModalOpen" as="template">
      <Dialog as="div" @close="isEditModalOpen = false" class="relative z-[100] font-khmer">
        <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95 translate-y-4" enter-to="opacity-100 scale-100 translate-y-0" leave="duration-200 ease-in" leave-from="opacity-100 scale-100 translate-y-0" leave-to="opacity-0 scale-95 translate-y-4">
              <DialogPanel class="w-full max-w-lg transform overflow-hidden rounded-[2rem] bg-white text-left align-middle shadow-2xl transition-all relative">
                
                <div class="bg-amber-500 px-8 py-6 relative overflow-hidden">
                   <div class="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
                   <div class="flex justify-between items-center relative z-10">
                      <div>
                         <h3 class="text-xl font-bold text-white">កែប្រែទិន្នន័យលក់</h3>
                         <p class="text-amber-100 text-sm mt-1">សម្រាប់ថ្ងៃ: {{ formatDate(selectedDate) }}</p>
                      </div>
                      <button @click="isEditModalOpen = false" class="bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition">
                         <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                      </button>
                   </div>
                </div>

                <form @submit.prevent="submitEditSale" class="p-8 space-y-5">
                   
                   <div class="bg-slate-50 p-4 rounded-xl flex items-center gap-4 border border-slate-100 mb-2">
                      <div class="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-lg">
                         {{ editForm.sellerName.charAt(0) }}
                      </div>
                      <div>
                         <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">តំណាងលក់</p>
                         <p class="font-bold text-slate-800 text-lg">{{ editForm.sellerName }}</p>
                      </div>
                   </div>

                   <div class="grid grid-cols-2 gap-4">
                      <div class="space-y-2">
                        <label class="text-[11px] font-black text-slate-500 uppercase tracking-widest">អតិថិជនសរុប</label>
                        <input v-model="editForm.totalClients" type="number" min="0" class="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-bold focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all">
                      </div>
                      <div class="space-y-2">
                        <label class="text-[11px] font-black text-slate-500 uppercase tracking-widest">បរិមាណលក់ (Qty)</label>
                        <input v-model="editForm.totalSold" type="number" min="0" class="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-bold focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all">
                      </div>
                   </div>

                   <div class="space-y-2">
                      <label class="text-[11px] font-black text-slate-500 uppercase tracking-widest">ប្រភេទ (Unit)</label>
                      <div class="bg-slate-100 p-1.5 rounded-xl flex items-center shadow-inner border border-slate-200/60">
                        <button type="button" @click="editForm.unit = 'bottle'" class="flex-1 py-2 text-sm font-bold rounded-lg transition-all" :class="editForm.unit === 'bottle' ? 'bg-white text-amber-600 shadow-sm ring-1 ring-slate-200/50' : 'text-slate-400 hover:text-slate-600'">ដប</button>
                        <button type="button" @click="editForm.unit = 'pack'" class="flex-1 py-2 text-sm font-bold rounded-lg transition-all" :class="editForm.unit === 'pack' ? 'bg-white text-amber-600 shadow-sm ring-1 ring-slate-200/50' : 'text-slate-400 hover:text-slate-600'">កញ្ចប់</button>
                      </div>
                   </div>

                   <div class="space-y-2">
                      <div class="flex justify-between items-end">
                         <label class="text-[11px] font-black text-slate-500 uppercase tracking-widest">ចំណូលសរុប (Revenue)</label>
                         <div class="bg-slate-100 p-1 rounded-lg flex shadow-inner border border-slate-200/60">
                            <button type="button" @click="editForm.currency = 'USD'" class="px-3 py-1 text-[11px] font-black rounded-md transition-all uppercase tracking-wider" :class="editForm.currency === 'USD' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'">USD</button>
                            <button type="button" @click="editForm.currency = 'KHR'" class="px-3 py-1 text-[11px] font-black rounded-md transition-all uppercase tracking-wider" :class="editForm.currency === 'KHR' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'">KHR</button>
                         </div>
                      </div>
                      <div class="relative group">
                        <span class="absolute inset-y-0 left-0 pl-4 flex items-center font-black pointer-events-none text-lg" :class="editForm.currency === 'USD' ? 'text-emerald-500' : 'text-blue-500'">
                          {{ editForm.currency === 'USD' ? '$' : '៛' }}
                        </span>
                        <input v-model="editForm.totalPrice" type="number" step="0.01" min="0" class="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-4 text-slate-800 font-black text-xl focus:ring-2 outline-none transition-all" :class="editForm.currency === 'USD' ? 'focus:ring-emerald-500/20 focus:border-emerald-500' : 'focus:ring-blue-500/20 focus:border-blue-500'">
                      </div>
                      
                      <div v-if="editForm.totalPrice" class="animate-fade-in mt-1">
                         <span class="text-xs font-bold text-slate-500 inline-flex items-center gap-1.5">
                            សរុប: 
                            <span :class="editForm.currency === 'USD' ? 'text-emerald-600' : 'text-blue-600'">
                               {{ Number(editForm.totalPrice).toLocaleString() }} {{ editForm.currency === 'USD' ? '$' : '៛' }}
                            </span>
                         </span>
                      </div>
                   </div>

                   <div class="pt-6 mt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                      <button type="button" @click="isEditModalOpen = false" class="px-5 py-3 rounded-xl text-slate-500 font-bold hover:bg-slate-100 transition-colors text-sm">បោះបង់</button>
                      <button type="submit" :disabled="isUpdatingSale" class="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50">
                        <svg v-if="isUpdatingSale" class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        <span>{{ isUpdatingSale ? 'កំពុងកែប្រែ...' : 'រក្សាទុកការកែប្រែ' }}</span>
                      </button>
                   </div>
                </form>

              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { db, auth } from '@/firebaseConfig';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { TransitionRoot, TransitionChild, Dialog, DialogPanel } from '@headlessui/vue';
import CustomAlert from '../../components/shared/CustomAlert.vue';

// --- STATE ---
const isLoading = ref(true);
const sellers = ref([]);
const allSales = ref([]); 

const alert = reactive({ show: false, title: '', message: '', type: 'success' });
const triggerAlert = (type, title, message) => {
  alert.type = type; alert.title = title; alert.message = message; alert.show = true;
  setTimeout(() => alert.show = false, 3000);
};

// Filters
const dateFilterType = ref('daily'); // Default changed to daily
const activityFilter = ref('all'); 

const selectedDate = ref(new Date().toISOString().split('T')[0]);
const selectedYear = ref(new Date().getFullYear());
const selectedMonth = ref(new Date().getMonth());
const customStart = ref(new Date().toISOString().split('T')[0]);
const customEnd = ref(new Date().toISOString().split('T')[0]);

const filterTabs = [
  { key: 'daily', label: 'ប្រចាំថ្ងៃ (Daily)' },
  { key: 'monthly', label: 'ប្រចាំខែ (Monthly)' },
  { key: 'yearly', label: 'ប្រចាំឆ្នាំ (Yearly)' },
  { key: 'custom', label: 'កំណត់ថ្ងៃ (Custom)' },
];

const monthNames = ['មករា (Jan)', 'កុម្ភៈ (Feb)', 'មីនា (Mar)', 'មេសា (Apr)', 'ឧសភា (May)', 'មិថុនា (Jun)', 'កក្កដា (Jul)', 'សីហា (Aug)', 'កញ្ញា (Sep)', 'តុលា (Oct)', 'វិច្ឆិកា (Nov)', 'ធ្នូ (Dec)'];

// --- EDIT MODAL STATE ---
const isEditModalOpen = ref(false);
const isUpdatingSale = ref(false);
const editForm = reactive({
   id: '',
   sellerName: '',
   totalClients: '',
   totalSold: '',
   unit: 'bottle',
   totalPrice: '',
   currency: 'USD'
});

// --- FETCH DATA ---
onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
       try {
          // 1. Fetch Sellers
          const sellerQ = query(collection(db, 'users'), where('role', '==', 'seller'), where('createdBy', '==', user.uid));
          const sellerSnap = await getDocs(sellerQ);
          sellers.value = sellerSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

          // 2. Fetch All Sales
          const salesQ = query(collection(db, 'sales_reports'), where('createdBy', '==', user.uid));
          const salesSnap = await getDocs(salesQ);
          // Include ID for editing purposes
          allSales.value = salesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

          // 3. Auto-select latest data if available
          if (allSales.value.length > 0) {
             const latestDate = allSales.value.map(s => new Date(s.date)).sort((a,b) => b - a)[0];
             selectedYear.value = latestDate.getFullYear();
             selectedMonth.value = latestDate.getMonth();
             selectedDate.value = latestDate.toISOString().split('T')[0];
          }
       } catch (error) {
          console.error("Error fetching data", error);
       } finally {
          isLoading.value = false;
       }
    }
  });
});

// --- DYNAMIC DATE DROPDOWNS ---
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

// --- CALCULATION LOGIC ---
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

// 1. Base Data: Maps ALL sellers to their stats in the selected date scope
const baseCalculatedData = computed(() => {
   if (sellers.value.length === 0) return [];

   return sellers.value.map(seller => {
      // Find sales for this seller in this time period
      const relevantSales = allSales.value.filter(s => s.sellerId === seller.id && isDateInScope(s.date));

      let totalClients = 0;
      let revenueUSD = 0;
      let revenueKHR = 0;
      let unitCounts = {}; 

      relevantSales.forEach(sale => {
         const u = (sale.unit || 'unknown').toLowerCase().trim();
         if (!unitCounts[u]) unitCounts[u] = 0;
         unitCounts[u] += Number(sale.totalSold || 0);

         totalClients += Number(sale.totalClients || 0);
         
         if (sale.currency === 'USD' || sale.currency === '$') {
            revenueUSD += Number(sale.totalPrice || 0);
         } else {
            revenueKHR += Number(sale.totalPrice || 0);
         }
      });

      const hasSales = totalClients > 0 || Object.keys(unitCounts).length > 0;
      
      // Store the raw sale object if it's daily view, so we can edit it
      const rawSale = relevantSales.length > 0 ? relevantSales[0] : null;

      return { ...seller, unitCounts, totalClients, revenueUSD, revenueKHR, hasSales, rawSale };
   }).sort((a, b) => {
       if (a.hasSales && !b.hasSales) return -1;
       if (!a.hasSales && b.hasSales) return 1;
       return (b.revenueUSD + (b.revenueKHR/4000)) - (a.revenueUSD + (a.revenueKHR/4000));
   }); 
});

// 2. Counts for Insight Cards
const activeSellersCount = computed(() => baseCalculatedData.value.filter(s => s.hasSales).length);
const inactiveSellersCount = computed(() => baseCalculatedData.value.filter(s => !s.hasSales).length);

// 3. Displayed Data: Filters the Base Data based on "All / Active / Inactive"
const displayedData = computed(() => {
    if (activityFilter.value === 'active') return baseCalculatedData.value.filter(s => s.hasSales);
    if (activityFilter.value === 'inactive') return baseCalculatedData.value.filter(s => !s.hasSales);
    return baseCalculatedData.value;
});

// 4. Grand Totals 
const grandTotals = computed(() => {
   let units = {};
   let clients = 0;
   let usd = 0;
   let khr = 0;
   let totalUnitsCount = 0;

   baseCalculatedData.value.forEach(row => {
      if(row.hasSales) {
          for (const [unit, count] of Object.entries(row.unitCounts)) {
              if (count > 0) {
                  if (!units[unit]) units[unit] = 0;
                  units[unit] += count;
                  totalUnitsCount += count;
              }
          }
          clients += row.totalClients;
          usd += row.revenueUSD;
          khr += row.revenueKHR;
      }
   });

   return { units, clients, usd, khr, totalUnitsCount };
});

// --- EDIT LOGIC ---
const openEditModal = (item) => {
   if (!item.rawSale) return;
   
   editForm.id = item.rawSale.id;
   editForm.sellerName = item.fullName;
   editForm.totalClients = item.rawSale.totalClients;
   editForm.totalSold = item.rawSale.totalSold;
   editForm.unit = item.rawSale.unit || 'bottle';
   editForm.totalPrice = item.rawSale.totalPrice;
   editForm.currency = item.rawSale.currency || 'USD';
   
   isEditModalOpen.value = true;
};

const submitEditSale = async () => {
   if (!editForm.totalClients || !editForm.totalSold || !editForm.totalPrice) {
       return triggerAlert('warning', 'សូមត្រួតពិនិត្យ', 'សូមបំពេញព័ត៌មានអោយបានគ្រប់គ្រាន់!');
   }

   isUpdatingSale.value = true;

   try {
       const saleRef = doc(db, 'sales_reports', editForm.id);
       const updatedData = {
           totalClients: parseInt(editForm.totalClients),
           totalSold: parseInt(editForm.totalSold),
           unit: editForm.unit,
           totalPrice: parseFloat(editForm.totalPrice),
           currency: editForm.currency
       };

       // Update in Firestore
       await updateDoc(saleRef, updatedData);

       // Update Local State so UI refreshes without reload
       const idx = allSales.value.findIndex(s => s.id === editForm.id);
       if (idx !== -1) {
           allSales.value[idx] = { ...allSales.value[idx], ...updatedData };
       }

       triggerAlert('success', 'ជោគជ័យ', 'ទិន្នន័យត្រូវបានកែប្រែរួចរាល់!');
       isEditModalOpen.value = false;

   } catch (error) {
       console.error("Edit Error:", error);
       triggerAlert('error', 'បរាជ័យ', 'មិនអាចកែប្រែទិន្នន័យបានទេ');
   } finally {
       isUpdatingSale.value = false;
   }
};

// --- HELPERS ---
const translateUnit = (unit) => {
    if (!unit || unit === 'unknown') return 'ផ្សេងៗ';
    const u = unit.toLowerCase().trim();
    if (u === 'bottle' || u === 'bottles') return 'ដប';
    if (u === 'pack' || u === 'packs') return 'កញ្ចប់';
    if (u === 'can' || u === 'cans') return 'កំប៉ុង';
    if (u === 'box' || u === 'boxes') return 'កេស';
    return unit; 
};

const getUnitBadgeColor = (unit) => {
    const u = unit.toLowerCase().trim();
    if (u === 'bottle' || u === 'bottles') return 'text-cyan-600 border-cyan-200 bg-white';
    if (u === 'pack' || u === 'packs') return 'text-purple-600 border-purple-200 bg-white';
    if (u === 'can' || u === 'cans') return 'text-amber-600 border-amber-200 bg-white';
    if (u === 'box' || u === 'boxes') return 'text-rose-600 border-rose-200 bg-white';
    return 'text-slate-600 border-slate-200 bg-white';
};

const formatDate = (dateString) => {
   if(!dateString) return '';
   return new Intl.DateTimeFormat('km-KH', { dateStyle: 'medium' }).format(new Date(dateString));
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

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>