<template>
  <div class="print-container">
    <div class="font-khmer h-[100dvh] flex flex-col relative bg-[#F4F7FE] overflow-hidden print:hidden">
      
      <div class="flex-none bg-white/80 backdrop-blur-2xl border-b border-slate-200/60 z-40 transition-all shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
        <div class="px-4 md:px-8 py-4 md:py-5">
          
          <div class="flex flex-col xl:flex-row xl:items-center justify-between gap-5 mb-5">
            <div class="flex items-center gap-4">
               <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white shrink-0">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012-2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
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
                 @click="handleTabClick(tab.key)"
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

      <div class="flex-1 overflow-y-auto custom-scrollbar scroll-smooth relative pb-40">
         <div class="px-4 md:px-8 py-6 max-w-[90rem] mx-auto w-full">
           
           <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
              <div class="bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 rounded-[24px] p-6 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden flex flex-col justify-between">
                  <div class="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                  
                  <div class="relative z-10">
                      <p class="text-indigo-100 text-[11px] font-black uppercase tracking-widest mb-2 flex items-center gap-2">ចំណូលសរុប (Total Revenue)</p>
                      <div class="flex items-baseline gap-2">
                         <span class="text-4xl font-black tracking-tight">{{ grandTotals.all.usd.toLocaleString() }}</span>
                         <span class="text-lg font-bold opacity-80">$</span>
                      </div>
                      <div class="text-sm font-bold mt-1 opacity-90 pb-2">{{ grandTotals.all.khr.toLocaleString() }} ៛</div>
                  </div>

                  <div v-if="activeCategory === 'all'" class="flex gap-2 border-t border-white/20 pt-3 mt-1 relative z-10">
                      <div class="flex-1 bg-black/10 rounded-lg p-2.5 border border-white/10 backdrop-blur-sm">
                          <div class="text-indigo-100 text-[10px] font-bold mb-1 uppercase">លក់រាយ (Retail)</div>
                          <div class="font-black text-sm">{{ grandTotals.retail.usd.toLocaleString() }} $</div>
                          <div class="font-bold text-[11px] opacity-90">{{ grandTotals.retail.khr.toLocaleString() }} ៛</div>
                      </div>
                      <div class="flex-1 bg-black/10 rounded-lg p-2.5 border border-white/10 backdrop-blur-sm">
                          <div class="text-indigo-100 text-[10px] font-bold mb-1 uppercase">បោះដុំ (Wholesale)</div>
                          <div class="font-black text-sm">{{ grandTotals.wholesale.usd.toLocaleString() }} $</div>
                          <div class="font-bold text-[11px] opacity-90">{{ grandTotals.wholesale.khr.toLocaleString() }} ៛</div>
                      </div>
                  </div>
              </div>
              
              <div class="bg-white rounded-[24px] p-6 border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:border-indigo-300 transition-colors flex flex-col justify-between">
                  <div class="relative z-10">
                      <p class="text-slate-400 text-[11px] font-black uppercase tracking-widest mb-1">បរិមាណលក់ (Units Sold)</p>
                      <h3 class="text-3xl font-black text-slate-800">{{ grandTotals.all.totalUnitsCount.toLocaleString() }}</h3>
                  </div>
                  
                  <div class="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-100 relative z-10">
                      <span v-for="(count, unit) in grandTotals.all.units" :key="unit" class="text-[10px] font-bold px-2 py-0.5 rounded border shadow-sm" :class="getUnitBadgeColor(unit)">
                          {{ count.toLocaleString() }} {{ translateUnit(unit) }}
                      </span>
                  </div>

                  <div v-if="activeCategory === 'all'" class="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 relative z-10">
                      <div class="bg-indigo-50/50 rounded-lg p-2.5 border border-indigo-100/60">
                          <p class="text-[10px] text-indigo-500 font-bold mb-1 uppercase tracking-widest">លក់រាយ</p>
                          <span class="text-lg font-black text-slate-700">{{ grandTotals.retail.totalUnitsCount.toLocaleString() }}</span>
                      </div>
                      <div class="bg-purple-50/50 rounded-lg p-2.5 border border-purple-100/60">
                          <p class="text-[10px] text-purple-600 font-bold mb-1 uppercase tracking-widest">បោះដុំ</p>
                          <span class="text-lg font-black text-slate-700">{{ grandTotals.wholesale.totalUnitsCount.toLocaleString() }}</span>
                      </div>
                  </div>
              </div>

              <div class="bg-white rounded-[24px] p-6 border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:border-amber-300 transition-colors flex flex-col justify-between">
                  <div class="relative z-10 flex justify-between items-start">
                      <div>
                          <p class="text-slate-400 text-[11px] font-black uppercase tracking-widest mb-1">អតិថិជនសរុប (Clients)</p>
                          <h3 class="text-3xl font-black text-slate-800">{{ grandTotals.all.clients.toLocaleString() }} <span class="text-sm text-slate-400 font-bold">នាក់</span></h3>
                      </div>
                      <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
                          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
                      </div>
                  </div>
                  
                  <div class="mt-3 pt-3 border-t border-slate-100 text-[11px] font-bold text-slate-500 relative z-10 flex justify-between items-center">
                      <span>តំណាងលក់សកម្ម:</span>
                      <span class="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-lg text-xs font-black">{{ activeSellersCount }} អ្នក</span>
                  </div>

                  <div v-if="activeCategory === 'all'" class="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 relative z-10">
                      <div class="bg-slate-50 rounded-lg p-2.5 border border-slate-200/60">
                          <p class="text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-widest">អតិថិជនរាយ</p>
                          <span class="text-base font-black text-slate-700">{{ grandTotals.retail.clients.toLocaleString() }} <span class="text-[10px] font-bold text-slate-400">នាក់</span></span>
                      </div>
                      <div class="bg-slate-50 rounded-lg p-2.5 border border-slate-200/60">
                          <p class="text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-widest">អតិថិជនដុំ</p>
                          <span class="text-base font-black text-slate-700">{{ grandTotals.wholesale.clients.toLocaleString() }} <span class="text-[10px] font-bold text-slate-400">នាក់</span></span>
                      </div>
                  </div>
              </div>
           </div>

           <div class="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
              <h3 class="text-lg font-black text-slate-800">បញ្ជីតំណាងលក់ <span class="text-slate-400 font-medium text-sm">({{ displayedData.length }})</span></h3>
              
              <div class="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                 
                 <div class="bg-slate-200/50 p-1.5 rounded-xl flex shadow-inner border border-slate-200 flex-1 sm:flex-none">
                    <button @click="activeCategory = 'all'" class="flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all" :class="activeCategory === 'all' ? 'bg-white text-slate-800 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'">ទាំងអស់</button>
                    <button @click="activeCategory = 'បោះដុំ'" class="flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5" :class="activeCategory === 'បោះដុំ' ? 'bg-white text-purple-700 shadow-sm ring-1 ring-purple-200' : 'text-slate-500 hover:text-purple-700'">
                      បោះដុំ
                    </button>
                    <button @click="activeCategory = 'លក់រាយ'" class="flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5" :class="activeCategory === 'លក់រាយ' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-indigo-200' : 'text-slate-500 hover:text-indigo-600'">
                      លក់រាយ
                    </button>
                 </div>

                 <div class="bg-slate-200/50 p-1.5 rounded-xl flex shadow-inner border border-slate-200 flex-1 sm:flex-none">
                    <button @click="activityFilter = 'all'" class="flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all" :class="activityFilter === 'all' ? 'bg-white text-slate-800 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'">សកម្មភាព</button>
                    <button @click="activityFilter = 'active'" class="flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5" :class="activityFilter === 'active' ? 'bg-white text-emerald-600 shadow-sm ring-1 ring-emerald-100' : 'text-slate-500 hover:text-emerald-600'">
                      <span class="w-2 h-2 rounded-full" :class="activityFilter === 'active' ? 'bg-emerald-500' : 'bg-slate-300'"></span> លក់បាន
                    </button>
                    <button @click="activityFilter = 'inactive'" class="flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5" :class="activityFilter === 'inactive' ? 'bg-white text-rose-600 shadow-sm ring-1 ring-rose-100' : 'text-slate-500 hover:text-rose-600'">
                      <span class="w-2 h-2 rounded-full" :class="activityFilter === 'inactive' ? 'bg-rose-500' : 'bg-slate-300'"></span> មិនបានលក់
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
              <p class="text-slate-500 font-bold tracking-wide">កំពុងទាញយកទិន្នន័យ...</p>
           </div>

           <div v-else-if="displayedData.length === 0" class="flex flex-col items-center justify-center py-24 bg-white/50 backdrop-blur-sm rounded-[2rem] border-2 border-dashed border-slate-200">
              <div class="w-20 h-20 bg-white shadow-sm rounded-full flex items-center justify-center mb-4 text-slate-300">
                 <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              </div>
              <p class="text-slate-600 font-bold text-lg">មិនមានទិន្នន័យទេ</p>
              <p class="text-slate-400 text-sm mt-1">សូមជ្រើសរើសប្រភេទលក់ ឬកាលបរិច្ឆេទផ្សេងទៀត។</p>
           </div>

           <div v-else>
              <SellerDataTable 
                  :data="displayedData"
                  :date-filter-type="dateFilterType"
                  :available-units="availableUnits"
                  :editing-sale-id="editingSaleId"
                  :edit-form="editForm"
                  :is-updating-sale="isUpdatingSale"
                  :expanded-row-ids="expandedRowIds"
                  @start-edit="startEdit"
                  @cancel-edit="cancelEdit"
                  @save-edit="saveEdit"
                  @toggle-expand="toggleRowExpand"
                  @row-click="goToSellerDetails"
              />
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
    </div>

    <transition enter-active-class="duration-300 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="processing.active" class="fixed inset-0 z-[999999] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
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
import { ref, reactive, onMounted, computed, watch, nextTick } from 'vue';
import { db, auth } from '@/firebaseConfig';
import { collection, query, where, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import CustomAlert from '../../components/shared/CustomAlert.vue';

// IMPORT USE ROUTER
import { useRouter } from 'vue-router';

// IMPORT THE NEW COMPONENT
import SellerDataTable from '../../components/SellerDataTable.vue';

const router = useRouter(); 

// --- STATE ---
const isLoading = ref(true);
const sellersList = ref([]);
const allSales = ref([]); 
const availableUnits = ref([]); 

// CATEGORY FILTER STATE
const activeCategory = ref('all'); 

const printStaging = ref(null);
const processing = ref({ active: false, message: '', progress: 0 });

const alert = reactive({ show: false, title: '', message: '', type: 'success' });
const triggerAlert = (type, title, message) => {
  alert.type = type; alert.title = title; alert.message = message; alert.show = true;
  setTimeout(() => alert.show = false, 3000);
};

// HELPER FOR LOCAL DATES
const getTodayString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
};

// Filters
const dateFilterType = ref('monthly'); 
const activityFilter = ref('all'); 
const selectedDate = ref(getTodayString()); 
const selectedYear = ref(new Date().getFullYear());
const selectedMonth = ref(new Date().getMonth());
const customStart = ref(getTodayString());
const customEnd = ref(getTodayString());

const handleTabClick = (key) => {
    dateFilterType.value = key;
    if (key === 'daily') {
        selectedDate.value = getTodayString(); 
    }
};

const filterTabs = [
 { key: 'daily', label: 'ប្រចាំថ្ងៃ' },
 { key: 'monthly', label: 'ប្រចាំខែ' },
 { key: 'yearly', label: 'ប្រចាំឆ្នាំ' },
 { key: 'custom', label: 'កំណត់ថ្ងៃ' },
];

const monthNames = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'];

// Expanded Rows Set
const expandedRowIds = ref(new Set());
const toggleRowExpand = (id) => {
    const newSet = new Set(expandedRowIds.value);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    expandedRowIds.value = newSet;
};

// --- INLINE EDIT STATE ---
const editingSaleId = ref(null);
const isUpdatingSale = ref(false);
const editForm = reactive({
 id: '',
 category: 'លក់រាយ', // Default
 totalClients: '',
 totalSold: '',
 unit: '', 
 totalPrice: '',
 currency: 'USD'
});

const goToSellerDetails = (item) => {
    if (item && item.originalSellerId) {
        router.push(`/admin/seller-detail/${item.originalSellerId}`);
    }
};

// --- FETCH DATA ---
onMounted(() => {
 onAuthStateChanged(auth, async (user) => {
  if (user) {
   try {
     
     // 1. Fetch user role to determine if owner or admin
     const userDoc = await getDoc(doc(db, "users", user.uid));
     const role = userDoc.exists() ? userDoc.data().role : 'user';

     // 2. Fetch SELLERS + DEALERS based on role
     let sellerQ;
     if (role === 'admin') {
         sellerQ = query(collection(db, 'users'), where('role', 'in', ['seller', 'dealer']), where('createdBy', '==', user.uid));
     } else {
         sellerQ = query(collection(db, 'users'), where('role', 'in', ['seller', 'dealer']));
     }

     const sellerSnap = await getDocs(sellerQ);
     sellersList.value = sellerSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter(s => s.isDeleted === false || s.isDeleted === "false" || !s.isDeleted);

     const unitSnap = await getDocs(collection(db, 'settings_units'));
     availableUnits.value = unitSnap.docs.map(doc => doc.data());

     const salesQ = query(collection(db, 'sales_reports'), where('createdBy', '==', user.uid));
     const salesSnap = await getDocs(salesQ);
     
     // ALL SALES PRE-SORTED NEWEST FIRST
     allSales.value = salesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a,b) => new Date(b.date) - new Date(a.date));

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
  const validSales = allSales.value.filter(s => s && s.date);
  if (validSales.length === 0) return [new Date().getFullYear()];
  const years = new Set(validSales.map(s => new Date(s.date).getFullYear()));
  return Array.from(years).sort((a, b) => b - a);
});

const availableMonths = computed(() => {
  const validSales = allSales.value.filter(s => s && s.date);
  if (validSales.length === 0) return [{ index: new Date().getMonth(), name: monthNames[new Date().getMonth()] }];
  const yearSales = validSales.filter(s => new Date(s.date).getFullYear() === parseInt(selectedYear.value));
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
 if (!dateStr) return false;
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

// 1. ✅ BASE DATA CALCULATION: SPLITS ROWS BY CATEGORY
const baseCalculatedData = computed(() => {
 if (sellersList.value.length === 0) return [];
 
 let rows = [];

 sellersList.value.forEach(seller => {
   const relevantSales = allSales.value.filter(s => s.sellerId === seller.id && isDateInScope(s.date));

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
        
        if (sale.currency === 'USD' || sale.currency === '$') {
          revenueUSD += Number(sale.totalPrice || 0);
        } else {
          revenueKHR += Number(sale.totalPrice || 0);
        }
       });

       const hasSales = salesList.length > 0;
       const rawSale = hasSales ? salesList[0] : null;

       rows.push({ 
           ...seller, 
           uniqueId: `${seller.id}_${catName === 'all' ? 'none' : catName}`, 
           originalSellerId: seller.id, 
           category: catName,
           unitCounts, 
           totalClients, 
           revenueUSD, 
           revenueKHR, 
           hasSales, 
           rawSale 
       });
   };

   if (activeCategory.value === 'all') {
       if (retailSales.length > 0) createRow('លក់រាយ', retailSales);
       if (wholesaleSales.length > 0) createRow('បោះដុំ', wholesaleSales);
       
       if (retailSales.length === 0 && wholesaleSales.length === 0) {
           createRow('-', []); 
       }
   } else if (activeCategory.value === 'លក់រាយ') {
       createRow('លក់រាយ', retailSales);
   } else if (activeCategory.value === 'បោះដុំ') {
       createRow('បោះដុំ', wholesaleSales);
   }
 });

 return rows.sort((a, b) => {
   if (a.hasSales && !b.hasSales) return -1;
   if (!a.hasSales && b.hasSales) return 1;
   return (b.revenueUSD + (b.revenueKHR/4000)) - (a.revenueUSD + (a.revenueKHR/4000));
 }); 
});

// 2. Counts for Insight Cards
const activeSellersCount = computed(() => {
    const uniqueIds = new Set(baseCalculatedData.value.filter(s => s.hasSales).map(s => s.originalSellerId));
    return uniqueIds.size;
});

// 3. Displayed Data
const displayedData = computed(() => {
  if (activityFilter.value === 'active') return baseCalculatedData.value.filter(s => s.hasSales);
  if (activityFilter.value === 'inactive') return baseCalculatedData.value.filter(s => !s.hasSales);
  return baseCalculatedData.value;
});

// 4. ✅ Grand Totals (SPLIT BY CATEGORY)
const grandTotals = computed(() => {
    let stats = {
        all: { usd: 0, khr: 0, clients: 0, totalUnitsCount: 0, units: {} },
        retail: { usd: 0, khr: 0, clients: 0, totalUnitsCount: 0, units: {} },
        wholesale: { usd: 0, khr: 0, clients: 0, totalUnitsCount: 0, units: {} }
    };

    baseCalculatedData.value.forEach(row => {
        if(row.hasSales) {
            const cat = row.category === 'បោះដុំ' ? 'wholesale' : 'retail';
            
            // Add to ALL
            stats.all.clients += row.totalClients;
            stats.all.usd += row.revenueUSD;
            stats.all.khr += row.revenueKHR;
            
            // Add to Specific
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
    const categoryName = activeCategory.value === 'all' ? 'សរុប (All)' : activeCategory.value;
    let dateStr = '';
    if (dateFilterType.value === 'daily') dateStr = new Intl.DateTimeFormat('km-KH', { dateStyle: 'long' }).format(new Date(selectedDate.value));
    if (dateFilterType.value === 'monthly') dateStr = `ខែ ${monthNames[selectedMonth.value]} ឆ្នាំ ${selectedYear.value}`;
    if (dateFilterType.value === 'yearly') dateStr = `ឆ្នាំ ${selectedYear.value}`;
    if (dateFilterType.value === 'custom') dateStr = `${selectedDateFormatter(customStart.value)} ដល់ ${selectedDateFormatter(customEnd.value)}`;
    return `${dateStr} - ${categoryName}`;
});

const selectedDateFormatter = (dateStr) => {
    if(!dateStr) return '';
    return new Intl.DateTimeFormat('km-KH', { dateStyle: 'medium' }).format(new Date(dateStr));
};

// --- INLINE EDIT LOGIC ---
const startEdit = (item) => {
 if (!item.rawSale) return;
 
 editingSaleId.value = item.rawSale.id;
 editForm.id = item.rawSale.id;
 editForm.category = item.rawSale.category || 'លក់រាយ';
 editForm.totalClients = item.rawSale.totalClients;
 editForm.totalSold = item.rawSale.totalSold;
 
 const unitExists = availableUnits.value.some(u => u.value === item.rawSale.unit);
 editForm.unit = unitExists ? item.rawSale.unit : (availableUnits.value[0]?.value || '');
 
 editForm.totalPrice = item.rawSale.totalPrice;
 editForm.currency = item.rawSale.currency || 'USD';
};

const cancelEdit = () => {
  editingSaleId.value = null;
};

const saveEdit = async () => {
 if (!editForm.totalClients || !editForm.totalSold || !editForm.totalPrice || !editForm.unit) {
   return triggerAlert('warning', 'សូមត្រួតពិនិត្យ', 'សូមបំពេញព័ត៌មានអោយបានគ្រប់គ្រាន់!');
 }

 isUpdatingSale.value = true;

 try {
   const saleRef = doc(db, 'sales_reports', editForm.id);
   const updatedData = {
     category: editForm.category,
     totalClients: parseInt(editForm.totalClients),
     totalSold: parseInt(editForm.totalSold),
     unit: editForm.unit,
     totalPrice: parseFloat(editForm.totalPrice),
     currency: editForm.currency
   };

   await updateDoc(saleRef, updatedData);

   const idx = allSales.value.findIndex(s => s.id === editForm.id);
   if (idx !== -1) {
     allSales.value[idx] = { ...allSales.value[idx], ...updatedData };
   }

   triggerAlert('success', 'ជោគជ័យ', 'ទិន្នន័យត្រូវបានកែប្រែរួចរាល់!');
   editingSaleId.value = null; 

 } catch (error) {
   console.error("Edit Error:", error);
   triggerAlert('error', 'បរាជ័យ', 'មិនអាចកែប្រែទិន្នន័យបានទេ');
 } finally {
   isUpdatingSale.value = false;
 }
};

// ---------------------------------------------------------
// NATIVE BROWSER PRINT LOGIC 
// ---------------------------------------------------------
const executeNativePrint = () => {
    const dataWithIndex = displayedData.value.map((item, idx) => ({ ...item, printIndex: idx + 1 }));
    const contentHTML = generatePageHTML(dataWithIndex, 1, 1, true);

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
            <title>Sales_Report_${dateFilterType.value}</title>
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
        <body>${contentHTML}</body>
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
// ✅ SMART HTML2CANVAS + JSPDF LOGIC 
// ---------------------------------------------------------
const generatePDF = async () => {
    processing.value = { active: true, message: 'កំពុងបំបែកទិន្នន័យ...', progress: 10 };
    
    try {
        const pages = [];
        let currentPage = [];
        
        const MAX_PAGE_HEIGHT = 1250; 
        const PAGE_TITLE_HEIGHT = 150; 
        const TABLE_HEADER_HEIGHT = 65;
        
        let grandTotalUnitCount = Object.keys(grandTotals.value.all.units || {}).length;
        let FOOTER_HEIGHT = 220 + (Math.ceil(grandTotalUnitCount / 2) * 50);
        if (activeCategory.value === 'all') {
            FOOTER_HEIGHT += 140; 
        }

        let currentHeight = PAGE_TITLE_HEIGHT + TABLE_HEADER_HEIGHT; 
        let rowCounter = 1;
        let allRows = [...displayedData.value];

        for (let i = 0; i < allRows.length; i++) {
            let row = allRows[i];
            let unitCount = row.hasSales && row.unitCounts ? Object.values(row.unitCounts).filter(c => c > 0).length : 0;
            let rowHeight = 90 + (Math.ceil(unitCount / 2) * 45); 

            if (currentHeight + rowHeight > MAX_PAGE_HEIGHT && currentPage.length > 0) {
                pages.push(currentPage);
                currentPage = [];
                currentHeight = 60 + TABLE_HEADER_HEIGHT; 
            }
            
            currentPage.push({ ...row, printIndex: rowCounter++ });
            currentHeight += rowHeight;
        }

        if (currentHeight + FOOTER_HEIGHT > MAX_PAGE_HEIGHT) {
            if (currentPage.length > 1) {
                let stolenRow = currentPage.pop();
                pages.push(currentPage);
                currentPage = [stolenRow]; 
            } else if (currentPage.length === 1) {
                pages.push(currentPage);
                currentPage = []; 
            }
        }
        
        if (currentPage.length === 0 && pages.length > 0) {
            let prevPage = pages[pages.length - 1];
            if (prevPage.length > 1) {
                let stolenRow = prevPage.pop();
                currentPage.push(stolenRow);
            }
        }

        if (currentPage.length > 0 || allRows.length === 0) {
            pages.push(currentPage);
        }

        const pdf = new jsPDF('p', 'mm', 'a4'); 
        const pdfWidth = 210; 
        const pdfHeightA4 = 297; 
        
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
            
            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeightA4);
            processing.value.progress = 10 + Math.round(((i + 1) / pages.length) * 80);
        }

        processing.value.message = 'កំពុងរក្សាទុកឯកសារ...';
        processing.value.progress = 100;
        pdf.save(`Sales_Report_${dateFilterType.value}.pdf`);
        
    } catch(e) {
        console.error(e);
        triggerAlert('error', 'បរាជ័យ', 'មិនអាចទាញយក PDF បានទេ');
    } finally {
        if(printStaging.value) printStaging.value.innerHTML = '';
        processing.value.active = false;
    }
};

const generatePageHTML = (rows, pageNum, totalPages, isNativePrint = false) => {
    
    let normalRows = rows;
    let lastRow = null;

    if (isNativePrint && rows.length > 0) {
        normalRows = rows.slice(0, rows.length - 1);
        lastRow = rows[rows.length - 1];
    }

    const renderRow = (item) => {
        let salesHTML = '';
        if (item.hasSales) {
            salesHTML = `<div style="overflow: hidden;">` + 
                Object.entries(item.unitCounts || {}).filter(([u, c]) => c > 0).map(([u, c]) => 
                    `<div style="float: left; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 4px 8px; margin: 0 6px 6px 0;">
                        <span style="font-weight: 900; color: #1e293b; font-size: 13px;">${c.toLocaleString()}</span>
                        <span style="color: #64748b; font-size: 11px; font-weight: bold; margin-left: 4px;">${translateUnit(u)}</span>
                     </div>`
                ).join('') + `<div style="clear: both;"></div></div>`;
        } else {
            salesHTML = `<span style="font-size: 13px; font-weight: bold; color: #94a3b8; background: #f1f5f9; padding: 4px 8px; border-radius: 6px; display: inline-block;">គ្មានការលក់</span>`;
        }

        let revenueHTML = '';
        if (item.hasSales) {
            revenueHTML = `
                <div style="text-align: right;">
                    <span style="color:#059669; font-size:15px; font-weight:900; background: #ecfdf5; padding: 2px 8px; border-radius: 6px; display: inline-block;">${item.revenueUSD.toLocaleString()} $</span><br/>
                    <span style="color:#2563eb; font-size:12px; font-weight:bold; padding-right: 4px; display: inline-block; margin-top: 4px;">${item.revenueKHR.toLocaleString()} ៛</span>
                </div>`;
        } else {
            revenueHTML = `<div style="text-align: right; color:#94a3b8; font-weight:bold; font-size:14px;">-</div>`;
        }

        const catBadge = item.category === 'បោះដុំ' 
            ? `<span style="background-color: #faf5ff; color: #7e22ce; border: 1px solid #e9d5ff; padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: bold;">បោះដុំ</span>`
            : `<span style="background-color: #f8fafc; color: #475569; border: 1px solid #e2e8f0; padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: bold;">លក់រាយ</span>`;

        // ✅ DEALER BADGE IN PDF
        const dealerBadge = item.role === 'dealer' 
            ? `<span style="background-color: #fffbeb; color: #d97706; border: 1px solid #fde68a; padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: 900; vertical-align: text-top; margin-left: 6px;">DEALER</span>` 
            : '';

        return `
            <tr style="break-inside: avoid; page-break-inside: avoid; ${!item.hasSales ? 'background-color: #f8fafc;' : 'border-bottom: 1px solid #f1f5f9;'}">
                <td style="padding: 16px 10px; text-align: center; vertical-align: top; font-weight: 900; color: #94a3b8; font-size: 14px;">${item.printIndex}</td>
                <td style="padding: 16px 10px; vertical-align: top;">
                    <p style="font-weight: bold; color: #1e293b; font-size: 16px; margin: 0; display: flex; align-items: center;">
                        ${item.fullName} ${dealerBadge}
                    </p>
                    <p style="font-family: monospace; color: #64748b; font-size: 12px; margin: 4px 0 0 0;">ID: ${item.idNumber || 'N/A'}</p>
                </td>
                <td style="padding: 16px 10px; vertical-align: top;">${item.hasSales ? catBadge : '-'}</td>
                <td style="padding: 16px 10px; vertical-align: top;">${salesHTML}</td>
                <td style="padding: 16px 10px; text-align: center; vertical-align: top; font-weight: bold; color: #334155; font-size: 16px;">
                    ${item.hasSales ? item.totalClients.toLocaleString() + ' នាក់' : '-'}
                </td>
                <td style="padding: 16px 10px; vertical-align: top;">${revenueHTML}</td>
            </tr>
        `;
    };

    const normalRowsHTML = normalRows.map(renderRow).join('');
    const lastRowHTML = lastRow ? renderRow(lastRow) : '';

    let summarySectionHTML = '';
    if (pageNum === totalPages || isNativePrint) {
        
        const unitsArray = Object.entries(grandTotals.value.all.units || {});
        let unitRows = '';
        for (let i = 0; i < unitsArray.length; i += 2) {
            const [u1, c1] = unitsArray[i];
            const item2 = unitsArray[i + 1];
            
            const cell1 = `
                <td style="width: 50%; padding: 4px 8px 4px 0; vertical-align: top;">
                    <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px 12px; overflow: hidden;">
                        <span style="color: #475569; font-size: 13px; font-weight: bold; float: left;">${translateUnit(u1)}</span>
                        <span style="font-weight: 900; color: #0f172a; font-size: 15px; float: right;">${c1.toLocaleString()}</span>
                        <div style="clear: both;"></div>
                    </div>
                </td>`;
                
            const cell2 = item2 ? `
                <td style="width: 50%; padding: 4px 0 4px 8px; vertical-align: top;">
                    <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px 12px; overflow: hidden;">
                        <span style="color: #475569; font-size: 13px; font-weight: bold; float: left;">${translateUnit(item2[0])}</span>
                        <span style="font-weight: 900; color: #0f172a; font-size: 15px; float: right;">${item2[1].toLocaleString()}</span>
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
                <div style="margin-top: 20px; border-top: 1px dashed #cbd5e1; padding-top: 20px; overflow: hidden; width: 100%;">
                    <div style="float: left; width: 48%; background: white; padding: 16px; border-radius: 12px; border: 1px solid #e2e8f0; box-sizing: border-box;">
                        <p style="font-size: 11px; color: #64748b; font-weight: 900; margin: 0 0 10px 0;">លក់រាយ (RETAIL)</p>
                        <p style="margin: 0; font-size: 18px; font-weight: 900; color: #059669;">${grandTotals.value.retail.usd.toLocaleString()} $</p>
                        <p style="margin: 4px 0 0 0; font-size: 13px; font-weight: bold; color: #2563eb;">${grandTotals.value.retail.khr.toLocaleString()} ៛</p>
                        <div style="margin-top: 10px; border-top: 1px solid #f1f5f9; padding-top: 10px;">
                            <p style="margin: 0; font-size: 12px; font-weight: bold; color: #475569;">អតិថិជន: ${grandTotals.value.retail.clients.toLocaleString()} នាក់</p>
                            <p style="margin: 4px 0 0 0; font-size: 12px; font-weight: bold; color: #475569;">បរិមាណលក់: ${grandTotals.value.retail.totalUnitsCount.toLocaleString()}</p>
                        </div>
                    </div>
                    <div style="float: right; width: 48%; background: white; padding: 16px; border-radius: 12px; border: 1px solid #e2e8f0; box-sizing: border-box;">
                        <p style="font-size: 11px; color: #64748b; font-weight: 900; margin: 0 0 10px 0;">បោះដុំ (WHOLESALE)</p>
                        <p style="margin: 0; font-size: 18px; font-weight: 900; color: #059669;">${grandTotals.value.wholesale.usd.toLocaleString()} $</p>
                        <p style="margin: 4px 0 0 0; font-size: 13px; font-weight: bold; color: #2563eb;">${grandTotals.value.wholesale.khr.toLocaleString()} ៛</p>
                        <div style="margin-top: 10px; border-top: 1px solid #f1f5f9; padding-top: 10px;">
                            <p style="margin: 0; font-size: 12px; font-weight: bold; color: #475569;">អតិថិជន: ${grandTotals.value.wholesale.clients.toLocaleString()} នាក់</p>
                            <p style="margin: 4px 0 0 0; font-size: 12px; font-weight: bold; color: #475569;">បរិមាណលក់: ${grandTotals.value.wholesale.totalUnitsCount.toLocaleString()}</p>
                        </div>
                    </div>
                    <div style="clear: both;"></div>
                </div>
            `;
        }

        const categoryLabel = activeCategory.value === 'all' ? '' : `- ${activeCategory.value}`;

        summarySectionHTML = `
            <div style="margin-top: 40px; border-top: 2px dashed #cbd5e1; padding-top: 30px; overflow: hidden; break-inside: avoid; page-break-inside: avoid; width: 100%; display: table;">
                
                <div style="display: table-cell; width: 60%; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; vertical-align: top;">
                    <div style="margin-bottom: 20px; overflow: hidden;">
                        <div style="float: left; width: 32px; height: 32px; background: #e0e7ff; color: #4f46e5; border-radius: 8px; text-align: center; line-height: 32px; margin-right: 10px;">
                            <svg style="width: 16px; height: 16px; display: inline-block; vertical-align: middle; margin-top: -2px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                        </div>
                        <h3 style="font-size: 16px; font-weight: 900; color: #1e293b; margin: 0; line-height: 32px; float: left;">សរុបបរិមាណលក់តាមប្រភេទ ${categoryLabel}</h3>
                        <div style="clear: both;"></div>
                    </div>
                    <div>
                        ${unitsTableHTML}
                    </div>
                </div>

                <div style="display: table-cell; width: 3%;"></div>

                <div style="display: table-cell; width: 37%; border: 1px solid #e2e8f0; border-radius: 16px; padding: 0; vertical-align: top; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                    <div style="background: #1e293b; padding: 16px 20px; border-top-left-radius: 15px; border-top-right-radius: 15px;">
                        <h3 style="font-size: 16px; font-weight: 900; color: white; margin: 0;">សរុបរួម (Grand Total) ${categoryLabel}</h3>
                    </div>
                    <div style="padding: 20px; background: #f8fafc; border-bottom-left-radius: 15px; border-bottom-right-radius: 15px;">
                        <table style="width: 100%; border-collapse: collapse; border: none;">
                            <tr>
                                <td style="padding-bottom: 12px; border-bottom: 1px dashed #cbd5e1; color: #64748b; font-size: 13px; font-weight: bold; border-top: none; border-left: none; border-right: none;">អតិថិជនសរុប:</td>
                                <td style="padding-bottom: 12px; border-bottom: 1px dashed #cbd5e1; text-align: right; border-top: none; border-left: none; border-right: none;">
                                    <span style="font-weight: 900; color: #0f172a; font-size: 16px; background: white; padding: 4px 10px; border-radius: 6px; border: 1px solid #e2e8f0;">${grandTotals.value.all.clients.toLocaleString()} នាក់</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding-top: 16px; padding-bottom: 8px; color: #64748b; font-size: 13px; font-weight: bold; border: none;">ចំណូល (USD):</td>
                                <td style="padding-top: 16px; padding-bottom: 8px; text-align: right; font-weight: 900; color: #059669; font-size: 22px; border: none;">${grandTotals.value.all.usd.toLocaleString()} $</td>
                            </tr>
                            <tr>
                                <td style="padding-top: 0; color: #64748b; font-size: 13px; font-weight: bold; border: none;">ចំណូល (KHR):</td>
                                <td style="padding-top: 0; text-align: right; font-weight: 900; color: #2563eb; font-size: 16px; border: none;">${grandTotals.value.all.khr.toLocaleString()} ៛</td>
                            </tr>
                        </table>
                        ${breakdownHTML}
                    </div>
                </div>
            </div>
        `;
    }

    let finalContentHTML = '';

    if (rows.length > 0) {
        if (isNativePrint) {
            finalContentHTML = `
                <table style="width: 100%; text-align: left; border-collapse: collapse; background-color: #ffffff;">
                    <thead style="color: #334155; font-size: 13px; font-weight: 900; display: table-header-group;">
                        <tr>
                            <th style="padding: 16px 10px; width: 5%; text-align: center; border-bottom: 2px solid #cbd5e1;">#</th>
                            <th style="padding: 16px 10px; width: 25%; border-bottom: 2px solid #cbd5e1;">តំណាងលក់</th>
                            <th style="padding: 16px 10px; width: 12%; border-bottom: 2px solid #cbd5e1;">ប្រភេទ</th>
                            <th style="padding: 16px 10px; width: 25%; border-bottom: 2px solid #cbd5e1;">ចំនួនលក់ (Units)</th>
                            <th style="padding: 16px 10px; width: 10%; text-align: center; border-bottom: 2px solid #cbd5e1;">អតិថិជន</th>
                            <th style="padding: 16px 10px; width: 23%; text-align: right; border-bottom: 2px solid #cbd5e1;">ចំណូល</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${normalRowsHTML}
                    </tbody>
                    <tbody style="break-inside: avoid; page-break-inside: avoid;">
                        ${lastRowHTML}
                        <tr>
                            <td colspan="6" style="padding: 0; border: none;">
                                ${summarySectionHTML}
                            </td>
                        </tr>
                    </tbody>
                </table>
            `;
        } else {
            finalContentHTML = `
                <table style="width: 100%; text-align: left; border-collapse: collapse; background-color: #ffffff;">
                    <thead style="color: #334155; font-size: 13px; font-weight: 900; display: table-header-group;">
                        <tr>
                            <th style="padding: 16px 10px; width: 5%; text-align: center; border-bottom: 2px solid #cbd5e1;">#</th>
                            <th style="padding: 16px 10px; width: 25%; border-bottom: 2px solid #cbd5e1;">តំណាងលក់</th>
                            <th style="padding: 16px 10px; width: 12%; border-bottom: 2px solid #cbd5e1;">ប្រភេទ</th>
                            <th style="padding: 16px 10px; width: 25%; border-bottom: 2px solid #cbd5e1;">ចំនួនលក់ (Units)</th>
                            <th style="padding: 16px 10px; width: 10%; text-align: center; border-bottom: 2px solid #cbd5e1;">អតិថិជន</th>
                            <th style="padding: 16px 10px; width: 23%; text-align: right; border-bottom: 2px solid #cbd5e1;">ចំណូល</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${normalRowsHTML}
                        ${lastRowHTML}
                    </tbody>
                </table>
                ${summarySectionHTML}
            `;
        }
    } else {
        finalContentHTML = summarySectionHTML;
    }

    const pageStyles = isNativePrint
        ? `width: 100%; box-sizing: border-box; font-family: 'Battambong', 'Kantumruy Pro', sans-serif; line-height: 1.6; padding: 20px;`
        : `width: 1000px; height: 1414px; background: white; padding: 40px; box-sizing: border-box; display: flex; flex-direction: column; font-family: 'Battambong', 'Kantumruy Pro', sans-serif; line-height: 1.6; position: relative; overflow: hidden;`;

    const mainTitle = pageNum === 1 || isNativePrint 
        ? `<div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #4f46e5;">
             <h1 style="font-size: 32px; font-weight: 900; color: #4338ca; margin: 0; text-align: center; width: 100%;">របាយការណ៍លក់សរុប</h1>
           </div>` 
        : '';

    return `
        <div class="print-page" style="${pageStyles}">
            ${mainTitle}
            <div style="flex: 1;">
                ${finalContentHTML}
            </div>
            <div style="position: absolute; bottom: 40px; left: 40px; right: 40px; border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 12px; font-weight: bold; color: #94a3b8; overflow: hidden;">
                <div style="float: left;">
                   <span style="display: inline-block; background-color: #f8fafc; padding: 4px 10px; border-radius: 6px; border: 1px solid #e2e8f0; color: #1e293b; font-size: 14px; font-weight: 900;">កាលបរិច្ឆេទ: ${reportDateLabel.value}</span>
                   &nbsp;&nbsp;ថ្ងៃបញ្ចេញរបាយការណ៍ • ${new Date().toLocaleString('km-KH')}
                </div>
                <div style="float: right;">
                   ${isNativePrint ? '' : `ទំព័រទី ${pageNum} នៃ ${totalPages}`}
                </div>
            </div>
        </div>
    `;
};


// --- HELPERS ---
const translateUnit = (unitVal) => {
  if (!unitVal) return '';
  const found = availableUnits.value.find(u => u.value === unitVal);
  if (found) return found.label;
  
  const u = unitVal.toLowerCase().trim();
  if (u === 'bottle' || u === 'bottles') return 'ដប';
  if (u === 'pack' || u === 'packs') return 'កញ្ចប់';
  return unitVal; 
};

// Use Database Colors for Badges
const getUnitBadgeColor = (unitVal) => {
  const found = availableUnits.value.find(u => u.value === unitVal);
  const color = found ? found.color : 'slate';
  
  const colorMap = {
    cyan: 'text-cyan-700 bg-cyan-50 border-cyan-200',
    blue: 'text-blue-700 bg-blue-50 border-blue-200',
    indigo: 'text-indigo-700 bg-indigo-50 border-indigo-200',
    purple: 'text-purple-700 bg-purple-50 border-purple-200',
    emerald: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    amber: 'text-amber-700 bg-amber-50 border-amber-200',
    rose: 'text-rose-700 bg-rose-50 border-rose-200',
    slate: 'text-slate-700 bg-slate-50 border-slate-200'
  };
  return colorMap[color] || colorMap['slate'];
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

@media print {
 .print\:hidden { display: none !important; }
}
</style>