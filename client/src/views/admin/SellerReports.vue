<template>
  <div class="print-container">
    
    <div class="font-khmer h-[100dvh] flex flex-col relative bg-[#F8FAFC] overflow-hidden print:hidden">
      
      <div class="bg-white border-b border-slate-200 flex items-center px-3 py-1.5 shadow-sm relative z-[100] shrink-0">
          
          <div class="relative">
              <button @click="isTabMenuOpen = !isTabMenuOpen" 
                      class="px-3 py-1 rounded-md transition-colors duration-150 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      :class="isTabMenuOpen ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'">
                  View (ទិដ្ឋភាព)
              </button>

              <div v-if="isTabMenuOpen" @click="isTabMenuOpen = false" class="fixed inset-0 z-40 cursor-default"></div>

              <div v-if="isTabMenuOpen" class="absolute left-0 top-full mt-1 w-64 bg-white border border-slate-200 shadow-xl rounded-lg py-1.5 z-50 animate-fade-in origin-top-left">
                  
                  <button @click="selectMainTab('analytics')" class="w-full text-left px-4 py-2 text-xs font-bold transition-colors flex items-center justify-between group" :class="mainTab === 'analytics' ? 'bg-indigo-50/50 text-indigo-700' : 'text-slate-700 hover:bg-indigo-50 hover:text-indigo-600'">
                      <span class="flex items-center gap-2">
                          <svg class="w-4 h-4 opacity-70 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> 
                          របាយការណ៍សរុប (Analytics)
                      </span>
                      <svg v-if="mainTab === 'analytics'" class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                  </button>
                  
                  <div class="h-px w-full bg-slate-100 my-1"></div>
                  
                  <button @click="selectMainTab('today')" class="w-full text-left px-4 py-2 text-xs font-bold transition-colors flex items-center justify-between group" :class="mainTab === 'today' ? 'bg-emerald-50/50 text-emerald-700' : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-600'">
                      <span class="flex items-center gap-2">
                          <svg class="w-4 h-4 opacity-70 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg> 
                          ព័ត៌មានលក់ថ្ងៃនេះ 
                          <span class="bg-rose-500 text-white text-[9px] px-1.5 py-0.5 rounded-full animate-pulse shadow-sm shadow-rose-500/30 ml-1">Live</span>
                      </span>
                      <svg v-if="mainTab === 'today'" class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                  </button>

                  <div class="h-px w-full bg-slate-100 my-1"></div>

                  <button @click="selectMainTab('finance')" class="w-full text-left px-4 py-2 text-xs font-bold transition-colors flex items-center justify-between group" :class="mainTab === 'finance' ? 'bg-rose-50/50 text-rose-700' : 'text-slate-700 hover:bg-rose-50 hover:text-rose-600'">
                      <span class="flex items-center gap-2">
                          <svg class="w-4 h-4 opacity-70 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                          គណនាហិរញ្ញវត្ថុ
                          <span class="bg-rose-100 text-rose-600 text-[9px] px-1.5 py-0.5 rounded-md border border-rose-200 ml-1">ថ្មី</span>
                      </span>
                      <svg v-if="mainTab === 'finance'" class="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                  </button>

              </div>
          </div>
          
          <div class="h-4 w-px bg-slate-300 mx-2"></div>
          <span class="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
             <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
             / System / <span class="text-slate-600">{{ mainTab === 'analytics' ? 'Analytics' : (mainTab === 'finance' ? 'Finance Calculator' : 'Today Sales POS') }}</span>
          </span>
      </div>

      <div v-show="mainTab === 'today'" class="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6">
        <div class="max-w-[95rem] mx-auto w-full">
            <TodaySalesList @triggerAlert="triggerAlert" />
        </div>
      </div>

      <div v-show="mainTab === 'finance'" class="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 bg-[#F8FAFC]">
        <div class="max-w-[95rem] mx-auto w-full h-full">
            <FinanceCalculator />
        </div>
      </div>

      <div v-show="mainTab === 'analytics'" class="flex-1 flex flex-col overflow-hidden relative">
          
          <div class="flex-none bg-white border-b border-slate-200 z-40 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
            <div class="px-4 md:px-6 py-4 max-w-[95rem] mx-auto w-full flex flex-col lg:flex-row justify-between lg:items-center gap-4">
                
                <div class="flex flex-col sm:flex-row sm:items-center gap-4 w-full lg:w-auto">
                    <div class="hidden sm:block bg-indigo-50 w-10 h-10 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    </div>
                    
                    <div class="bg-slate-100/80 p-1 rounded-xl flex overflow-x-auto no-scrollbar shadow-inner border border-slate-200 w-full sm:w-auto shrink-0">
                        <button @click="setFilterType('today')" class="px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap" :class="dateFilterType === 'today' ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-800'">ថ្ងៃនេះ</button>
                        <button @click="setFilterType('month')" class="px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap" :class="dateFilterType === 'month' ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-800'">ខែនេះ</button>
                        <button @click="setFilterType('specific')" class="px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap" :class="dateFilterType === 'specific' ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-800'">ជ្រើសរើសថ្ងៃ</button>
                        <button @click="setFilterType('range')" class="px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap" :class="dateFilterType === 'range' ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-800'">Range</button>
                    </div>

                    <div class="flex items-center gap-2 animate-fade-in" v-if="dateFilterType === 'specific' || dateFilterType === 'range'">
                        <input v-if="dateFilterType === 'specific'" v-model="specificDate" type="date" class="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 outline-none cursor-pointer shadow-sm" />
                        <div v-if="dateFilterType === 'range'" class="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-2 py-1 shadow-sm">
                            <input v-model="startDate" type="date" class="bg-transparent border-none text-xs font-bold text-slate-700 focus:ring-0 outline-none cursor-pointer p-1" />
                            <span class="text-slate-300">-</span>
                            <input v-model="endDate" type="date" class="bg-transparent border-none text-xs font-bold text-slate-700 focus:ring-0 outline-none cursor-pointer p-1" />
                        </div>
                    </div>
                </div>

                <div class="flex items-center gap-2 lg:gap-3 w-full lg:w-auto justify-end border-t lg:border-none border-slate-100 pt-3 lg:pt-0">
                    <button @click="showSummaryCards = !showSummaryCards" class="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border shadow-sm" :class="showSummaryCards ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'">
                        <svg v-if="showSummaryCards" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
                        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        <span class="hidden sm:block">{{ showSummaryCards ? 'លាក់ទិន្នន័យសរុប' : 'បង្ហាញទិន្នន័យសរុប' }}</span>
                        <span class="sm:hidden">Stats</span>
                    </button>

                    <div class="w-px h-6 bg-slate-200 mx-1 hidden sm:block"></div>

                    <button @click="handlePrint" :disabled="processing.active || filteredSellers.length === 0" class="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 font-bold text-xs shadow-sm disabled:opacity-50">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2-2v4h10z"></path></svg>
                        <span class="hidden sm:block">Print</span>
                    </button>
                    
                    <button @click="handlePDF" :disabled="processing.active || filteredSellers.length === 0" class="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 px-4 py-2 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 font-bold text-xs shadow-sm disabled:opacity-50">
                        <svg v-if="processing.active" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        <span class="hidden sm:block">PDF</span>
                    </button>
                </div>
            </div>
          </div>

          <div class="flex-1 overflow-y-auto custom-scrollbar scroll-smooth bg-[#F8FAFC] pb-40">
             <div class="px-4 md:px-6 py-6 max-w-[95rem] mx-auto w-full">
               
               <transition enter-active-class="transition duration-300 ease-out origin-top" enter-from-class="transform scale-y-95 opacity-0" enter-to-class="transform scale-y-100 opacity-100" leave-active-class="transition duration-200 ease-in origin-top" leave-from-class="transform scale-y-100 opacity-100" leave-to-class="transform scale-y-95 opacity-0">
                   <div v-show="showSummaryCards" class="mb-6">
                       <ReportStatsCards 
                          :grand-totals="grandTotals" 
                          :active-category="activeCategory" 
                          :active-sellers-count="activeSellersCount" 
                          :available-units="availableUnits" 
                       />
                   </div>
               </transition>

               <div class="bg-white p-3 rounded-2xl shadow-sm border border-slate-200 mb-4 flex flex-col lg:flex-row justify-between items-center gap-4">
                  <div class="relative w-full lg:w-1/3 min-w-[250px]">
                      <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                      </span>
                      <input v-model="searchQuery" type="text" placeholder="ស្វែងរកឈ្មោះ / អត្តលេខ..." class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" />
                  </div>
                  
                  <div class="flex flex-wrap items-center justify-center gap-2 w-full lg:w-auto">
                     <div class="bg-slate-100/80 p-1 rounded-xl flex shadow-inner border border-slate-200">
                        <button @click="activeCategory = 'all'" class="px-4 py-2 rounded-lg text-[11px] font-black transition-all" :class="activeCategory === 'all' ? 'bg-white text-slate-800 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'">ទាំងអស់</button>
                        <button @click="activeCategory = 'បោះដុំ'" class="px-4 py-2 rounded-lg text-[11px] font-black transition-all" :class="activeCategory === 'បោះដុំ' ? 'bg-white text-purple-700 shadow-sm ring-1 ring-purple-200' : 'text-slate-500 hover:text-slate-700'">បោះដុំ</button>
                        <button @click="activeCategory = 'លក់រាយ'" class="px-4 py-2 rounded-lg text-[11px] font-black transition-all" :class="activeCategory === 'លក់រាយ' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-indigo-200' : 'text-slate-500 hover:text-slate-700'">លក់រាយ</button>
                     </div>

                     <div class="bg-slate-100/80 p-1 rounded-xl flex shadow-inner border border-slate-200">
                        <button @click="activityFilter = 'all'" class="px-4 py-2 rounded-lg text-[11px] font-black transition-all" :class="activityFilter === 'all' ? 'bg-white text-slate-800 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'">All</button>
                        <button @click="activityFilter = 'active'" class="px-4 py-2 rounded-lg text-[11px] font-black transition-all flex items-center gap-1.5" :class="activityFilter === 'active' ? 'bg-white text-emerald-600 shadow-sm ring-1 ring-emerald-200' : 'text-slate-500 hover:text-emerald-600'"><span class="w-1.5 h-1.5 rounded-full" :class="activityFilter === 'active' ? 'bg-emerald-500' : 'bg-slate-300'"></span> លក់បាន</button>
                     </div>

                     <div class="bg-slate-100/80 p-1 rounded-xl flex shadow-inner border border-slate-200 hidden sm:flex">
                        <button @click="viewMode = 'list'" class="p-1.5 rounded-lg transition-all" :class="viewMode === 'list' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-700'">
                           <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6h16M4 12h16M4 18h16"/></svg>
                        </button>
                        <button @click="viewMode = 'card'" class="p-1.5 rounded-lg transition-all" :class="viewMode === 'card' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-700'">
                           <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
                        </button>
                     </div>
                  </div>
               </div>

               <div v-if="isLoading" class="flex flex-col items-center justify-center py-24 opacity-60">
                  <div class="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-indigo-600 mb-4"></div>
                  <p class="text-slate-500 font-bold tracking-wide text-sm">កំពុងទាញយកទិន្នន័យ...</p>
               </div>

               <div v-else-if="paginatedData.length === 0" class="flex flex-col items-center justify-center py-20 bg-white/60 backdrop-blur-sm rounded-3xl border-2 border-dashed border-slate-200">
                  <div class="w-16 h-16 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center mb-3 text-slate-300">
                     <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                  </div>
                  <p class="text-slate-600 font-black text-lg">មិនមានទិន្នន័យទេ</p>
                  <p class="text-slate-400 text-xs mt-1 font-bold">សូមសាកល្បងប្តូរការស្វែងរក ឬកាលបរិច្ឆេទ</p>
               </div>

               <div v-else class="flex flex-col gap-4 animate-fade-in">
                  <SellerDataView 
                      :data="paginatedData"
                      :view-mode="viewMode"
                      :start-index="(currentPage - 1) * itemsPerPage"
                      :available-units="availableUnits"
                      @goToSellerDetail="openSellerDetail"
                  />

                  <div v-if="totalPages > 1" class="flex flex-col sm:flex-row items-center justify-between bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm mt-2 gap-4">
                      <p class="text-xs font-bold text-slate-500">
                          បង្ហាញ <span class="text-slate-800">{{ ((currentPage - 1) * itemsPerPage) + 1 }}</span> - <span class="text-slate-800">{{ Math.min(currentPage * itemsPerPage, filteredSellers.length) }}</span> នៃ <span class="text-indigo-600">{{ filteredSellers.length }}</span> តំណាងលក់
                      </p>
                      
                      <div class="flex items-center gap-1.5">
                         <button @click="currentPage--" :disabled="currentPage === 1" class="px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1" :class="currentPage === 1 ? 'text-slate-400 bg-slate-50 cursor-not-allowed' : 'text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm'">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/></svg> មុន
                         </button>
                         <span class="px-3 py-1.5 text-[11px] font-black text-slate-600 bg-slate-100 rounded-lg border border-slate-200">
                            {{ currentPage }} / {{ totalPages }}
                         </span>
                         <button @click="currentPage++" :disabled="currentPage === totalPages" class="px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1" :class="currentPage === totalPages ? 'text-slate-400 bg-slate-50 cursor-not-allowed' : 'text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm'">
                            បន្ទាប់ <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
                         </button>
                      </div>
                  </div>
               </div>

             </div>
          </div>

          <ReportBottomSummary 
              :grand-totals="grandTotals" 
              :activity-filter="activityFilter" 
              :displayed-data-length="filteredSellers.length" 
              :available-units="availableUnits" 
          />
      </div>

    </div>

    <div ref="printStaging" class="fixed top-0 left-[-9999px] pointer-events-none z-[-1] opacity-0 print:opacity-100 bg-white w-[1000px]"></div>

    <transition enter-active-class="duration-300 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="processing.active" class="fixed inset-0 z-[999999] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <div class="w-full max-w-sm bg-white border border-slate-200 rounded-[24px] p-8 shadow-2xl relative flex flex-col items-center text-center animate-slide-up">
                <div class="relative w-16 h-16 mb-6">
                    <div class="absolute inset-0 rounded-full border-4 border-slate-100"></div>
                    <div class="absolute inset-0 rounded-full border-4 border-t-indigo-600 border-r-indigo-600 border-b-transparent border-l-transparent animate-spin"></div>
                    <div class="absolute inset-0 flex items-center justify-center font-black text-slate-700 text-sm font-mono">{{ processing.progress }}%</div>
                </div>
                <h3 class="text-base font-black text-slate-800 mb-3">{{ processing.message }}</h3>
                <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div class="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 ease-out" :style="{ width: `${processing.progress}%` }"></div>
                </div>
            </div>
        </div>
    </transition>

    <CustomAlert v-if="alert.show" :type="alert.type" :title="alert.title" :message="alert.message" @close="alert.show = false" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch, onUnmounted } from 'vue';
import { db, auth } from '@/firebaseConfig';
import { collection, query, where, getDocs, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'vue-router'; 

import CustomAlert from '@/components/shared/CustomAlert.vue';
import SellerDataView from './reports/SellerDataView.vue'; 
import ReportStatsCards from './reports/ReportStatsCards.vue'; 
import ReportBottomSummary from './reports/ReportBottomSummary.vue';
import TodaySalesList from './reports/pos/POSTodaySales.vue'; 
import FinanceCalculator from './reports/pos/FinanceCalculator.vue'; // ✅ Import File ថ្មី
import { executeNativePrint, generatePDF } from './printPdfLogic.js';

const router = useRouter(); 

const mainTab = ref('analytics'); 
const isTabMenuOpen = ref(false);
const selectMainTab = (tab) => { 
    mainTab.value = tab; 
    isTabMenuOpen.value = false; 
};

const isLoading = ref(true);
const sellersList = ref([]);
const allSales = ref([]); 
const availableUnits = ref([]); 
const printStaging = ref(null);
const processing = ref({ active: false, message: '', progress: 0 });

const showSummaryCards = ref(false);

const alert = reactive({ show: false, title: '', message: '', type: 'success' });
const triggerAlert = (type, title, message) => { alert.type = type; alert.title = title; alert.message = message; alert.show = true; setTimeout(() => alert.show = false, 3000); };

const openSellerDetail = (payload) => {
    const id = typeof payload === 'object' ? (payload.originalSellerId || payload.id) : payload;
    if (id) {
        router.push({ name: 'SellerSalesDetail', params: { id: String(id) } });
    }
};

const getTodayString = () => { const today = new Date(); return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`; };

const dateFilterType = ref('today'); 
const activeCategory = ref('all'); 
const activityFilter = ref('all'); 

const specificDate = ref(getTodayString());
const startDate = ref(getTodayString());
const endDate = ref(getTodayString());
const selectedDate = ref(getTodayString()); 
const selectedYear = ref(new Date().getFullYear());
const selectedMonth = ref(new Date().getMonth());

const searchQuery = ref('');
const viewMode = ref('list'); 
const currentPage = ref(1);
const itemsPerPage = ref(50); 

const setFilterType = (type) => {
    dateFilterType.value = type;
    currentPage.value = 1;
};

const monthNames = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'];

watch([searchQuery, activeCategory, activityFilter, dateFilterType, specificDate, startDate, endDate], () => {
    currentPage.value = 1;
});

let unsubscribeSales = null;
let unsubscribeSellers = null;

onMounted(() => {
 onAuthStateChanged(auth, async (user) => {
  if (user) {
   try {
     const userDoc = await getDoc(doc(db, "users", user.uid));
     const role = userDoc.exists() ? userDoc.data().role : 'user';

     const unitSnap = await getDocs(collection(db, 'settings_units'));
     availableUnits.value = unitSnap.docs.map(doc => doc.data());

     let sellerQ = role === 'admin' 
        ? query(collection(db, 'users'), where('role', 'in', ['seller', 'dealer']), where('createdBy', '==', user.uid))
        : query(collection(db, 'users'), where('role', 'in', ['seller', 'dealer']));

     unsubscribeSellers = onSnapshot(sellerQ, (sellerSnap) => {
         let fetchedSellers = sellerSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter(s => s.isDeleted === false || !s.isDeleted);
         fetchedSellers.push({
             id: 'admin_direct', fullName: 'ទិញផ្ទាល់ / មិនមានអ្នកលក់', idNumber: 'DIRECT', role: 'admin', photoUrl: ''
         });
         sellersList.value = fetchedSellers;
     });

     const salesQ = query(collection(db, 'sales_reports'), where('createdBy', '==', user.uid));
     
     unsubscribeSales = onSnapshot(salesQ, (salesSnap) => {
         let flatSales = [];
         salesSnap.docs.forEach(doc => {
             const data = doc.data();
             
             if (data.items && Array.isArray(data.items)) {
                 data.items.forEach((item, index) => {
                     let typeStr = String(item.type || '').toLowerCase();
                     let isWholesale = typeStr.includes('បោះដុំ') || typeStr.includes('wholesale');

                     flatSales.push({
                         ...data,                     
                         id: `${doc.id}_${index}`, 
                         originalReceiptId: data.receiptId || doc.id, 
                         sellerId: data.sellerId || data.uid || 'admin_direct',
                         uid: data.uid || data.sellerId || 'admin_direct',
                         category: isWholesale ? 'បោះដុំ' : 'លក់រាយ',
                         totalSold: Number(item.qty),
                         unit: item.unit,
                         totalPrice: Number(item.price) * Number(item.qty),
                         productName: item.name, 
                         isFirstItemOfReceipt: index === 0 
                     });
                 });
             }
         });

         allSales.value = flatSales.sort((a,b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
         isLoading.value = false;
     }, (error) => {
         console.error("Error in realtime sales stream:", error);
         isLoading.value = false;
     });

   } catch (error) {
     console.error("Error setting up data:", error);
     isLoading.value = false;
   }
  }
 });
});

onUnmounted(() => {
    if (unsubscribeSales) unsubscribeSales();
    if (unsubscribeSellers) unsubscribeSellers();
});

const getValidDateStr = (sale) => sale.createdAt || sale.date;

const isDateInScope = (dateStr) => {
 if (!dateStr) return false;
 const date = new Date(dateStr);
 const today = new Date();

 if (dateFilterType.value === 'today') {
    return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
 } else if (dateFilterType.value === 'month') {
    return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
 } else if (dateFilterType.value === 'specific') {
    const sDate = new Date(specificDate.value);
    return date.getDate() === sDate.getDate() && date.getMonth() === sDate.getMonth() && date.getFullYear() === sDate.getFullYear();
 } else if (dateFilterType.value === 'range') {
    const sDate = new Date(startDate.value);
    const eDate = new Date(endDate.value);
    eDate.setHours(23, 59, 59, 999); 
    return date >= sDate && date <= eDate;
 }
 return false;
};

const baseCalculatedData = computed(() => {
    let rows = [];
    const sellerMap = new Map();
    sellersList.value.forEach(s => sellerMap.set(s.id, s));

    const salesBySeller = {};
    allSales.value.forEach(sale => {
        if (!isDateInScope(getValidDateStr(sale))) return;
        const sId = sale.sellerId || sale.uid || 'admin_direct';
        if (!salesBySeller[sId]) salesBySeller[sId] = [];
        salesBySeller[sId].push(sale);
    });

    const processedSellerIds = new Set();

    const generateRowsForSeller = (sellerId, sales) => {
        processedSellerIds.add(sellerId);
        
        let sellerInfo = sellerMap.get(sellerId);
        if (!sellerInfo) {
            if (sellerId === 'admin_direct') sellerInfo = { id: 'admin_direct', fullName: 'ទិញផ្ទាល់ / មិនមានអ្នកលក់', idNumber: 'DIRECT', role: 'admin' };
            else sellerInfo = { id: sellerId, fullName: sales[0]?.sellerName || 'អ្នកលក់ដែលបានលុប', idNumber: 'DELETED', role: 'seller' };
        }

        const retailSales = sales.filter(s => (s.category || 'លក់រាយ') === 'លក់រាយ');
        const wholesaleSales = sales.filter(s => s.category === 'បោះដុំ');

        const createRow = (catName, salesList) => {
           let revenueUSD = 0; let revenueKHR = 0; let unitCounts = {}; 
           let productsSet = new Set(); let productAgg = {};
           let uniqueClientsSet = new Set(); 
           let processedDeliveryInvoices = new Set();

           salesList.forEach(sale => {
            const u = (sale.unit || 'unknown').toLowerCase().trim();
            if (!unitCounts[u]) unitCounts[u] = 0;
            unitCounts[u] += Number(sale.totalSold || 0);
            
            if (sale.originalReceiptId) uniqueClientsSet.add(sale.originalReceiptId);
            
            if (sale.paymentStatus !== 'CANCELED') {
                if (sale.currency === 'USD' || sale.currency === '$') revenueUSD += Number(sale.totalPrice || 0);
                else revenueKHR += Number(sale.totalPrice || 0);

                if (sale.originalReceiptId && sale.isFirstItemOfReceipt && !processedDeliveryInvoices.has(sale.originalReceiptId)) {
                    const dFee = Number(sale.deliveryFee || 0);
                    const dCurr = sale.deliveryCurrency || 'USD';
                    if (dCurr === 'USD' || dCurr === '$') revenueUSD += dFee;
                    else revenueKHR += dFee;
                    processedDeliveryInvoices.add(sale.originalReceiptId);
                }
            }
            
            if (sale.productName) {
                productsSet.add(sale.productName);
                let pKey = `${sale.productName}_${sale.unit}`;
                if (!productAgg[pKey]) productAgg[pKey] = { name: sale.productName, unit: sale.unit, qty: 0 };
                productAgg[pKey].qty += Number(sale.totalSold || 0);
            }
           });

           rows.push({ 
               ...sellerInfo, 
               uniqueId: `${sellerInfo.id}_${catName === 'all' ? 'none' : catName}`, 
               originalSellerId: sellerInfo.id, 
               category: catName,
               unitCounts, 
               totalClients: uniqueClientsSet.size, 
               revenueUSD, revenueKHR, 
               hasSales: salesList.length > 0,
               productNames: Array.from(productsSet),
               productsList: Object.values(productAgg)
           });
        };

        if (activeCategory.value === 'all') {
            if (sales.length > 0) createRow('សរុបរួម', sales);
            else createRow('-', []); 
        } else if (activeCategory.value === 'លក់រាយ') {
            if (retailSales.length > 0) createRow('លក់រាយ', retailSales);
        } else if (activeCategory.value === 'បោះដុំ') {
            if (wholesaleSales.length > 0) createRow('បោះដុំ', wholesaleSales);
        }
    };

    sellersList.value.forEach(seller => {
        const sales = salesBySeller[seller.id] || [];
        generateRowsForSeller(seller.id, sales);
    });

    for (const [sId, sales] of Object.entries(salesBySeller)) {
        if (!processedSellerIds.has(sId)) generateRowsForSeller(sId, sales);
    }

    return rows.sort((a, b) => (b.revenueUSD + (b.revenueKHR/4000)) - (a.revenueUSD + (a.revenueKHR/4000))); 
});

const filteredSellers = computed(() => {
  let result = baseCalculatedData.value;
  if (activityFilter.value === 'active') result = result.filter(s => s.hasSales);
  if (activityFilter.value === 'inactive') result = result.filter(s => !s.hasSales);
  if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim();
      result = result.filter(s => (s.fullName && s.fullName.toLowerCase().includes(q)) || (s.idNumber && s.idNumber.toLowerCase().includes(q)));
  }
  return result;
});

const regionalReportSummary = computed(() => {
    const createDataNode = () => ({
        wholesaleUSD: 0, wholesaleClients: new Set(), wholesaleItems: {},
        retailUSD: 0, retailClients: new Set(), retailItems: {}
    });

    let result = {
        overall: { paid: createDataNode(), pending: createDataNode(), total: createDataNode(), deliveryUSD: 0 },
        phnomPenh: { paid: createDataNode(), pending: createDataNode(), direct: createDataNode(), total: createDataNode(), deliveryUSD: 0 },
        provinces: { paid: createDataNode(), pending: createDataNode(), total: createDataNode(), deliveryUSD: 0 }
    };

    const activeSellerIds = new Set(filteredSellers.value.map(s => s.originalSellerId));
    const processedDelivery = new Set();
    const invoiceClassification = {};

    allSales.value.forEach(sale => {
        if (!isDateInScope(getValidDateStr(sale))) return;
        const mappedSellerId = sale.sellerId || sale.uid || 'admin_direct';
        if (!activeSellerIds.has(mappedSellerId) || sale.paymentStatus === 'CANCELED') return;

        if (sale.originalReceiptId) {
            if (!invoiceClassification[sale.originalReceiptId]) invoiceClassification[sale.originalReceiptId] = sale.category === 'បោះដុំ' ? 'wholesale' : 'retail';
            else if (sale.category === 'បោះដុំ') invoiceClassification[sale.originalReceiptId] = 'wholesale';
        }
    });

    allSales.value.forEach(sale => {
        if (!isDateInScope(getValidDateStr(sale))) return;
        if (sale.paymentStatus === 'CANCELED') return;
        const mappedSellerId = sale.sellerId || sale.uid || 'admin_direct';
        if (!activeSellerIds.has(mappedSellerId)) return;

        const isWholesale = sale.category === 'បោះដុំ';
        if (activeCategory.value !== 'all') {
            if (activeCategory.value === 'លក់រាយ' && isWholesale) return;
            if (activeCategory.value === 'បោះដុំ' && !isWholesale) return;
        }

        let isDirect = (!sale.location || sale.location.includes('ទិញផ្ទាល់'));
        let isPP = (sale.province === 'រាជធានីភ្នំពេញ' || (sale.location && sale.location.includes('ភ្នំពេញ')));
        let regionKey = (isDirect || isPP) ? 'phnomPenh' : 'provinces';

        let statusKey = sale.paymentStatus === 'PAID' ? 'paid' : 'pending';
        if (isDirect && regionKey === 'phnomPenh') statusKey = 'direct';

        const currency = sale.currency === 'KHR' || sale.currency === '៛' ? 'KHR' : 'USD';

        if (sale.originalReceiptId && sale.isFirstItemOfReceipt && !processedDelivery.has(sale.originalReceiptId)) {
            const dFee = Number(sale.deliveryFee) || 0;
            const dUsdEquiv = (sale.deliveryCurrency === 'KHR' || sale.deliveryCurrency === '៛') ? (dFee / 4000) : dFee;
            result[regionKey].deliveryUSD += dUsdEquiv;
            result.overall.deliveryUSD += dUsdEquiv;
            processedDelivery.add(sale.originalReceiptId);
        }

        const iType = isWholesale ? 'wholesale' : 'retail';
        const iQty = Number(sale.totalSold) || 0;
        const iTotalUSD = currency === 'KHR' ? (Number(sale.totalPrice) / 4000) : Number(sale.totalPrice);
        const iPrice = iQty > 0 ? (Number(sale.totalPrice) / iQty) : 0;
        const itemKey = `${sale.productName}_${sale.unit}_${iPrice}`;

        const addDataToNode = (node) => {
            if (iType === 'wholesale') {
                node.wholesaleUSD += iTotalUSD;
                if (sale.originalReceiptId) node.wholesaleClients.add(sale.originalReceiptId);
                if (!node.wholesaleItems[itemKey]) node.wholesaleItems[itemKey] = { name: sale.productName, unit: sale.unit, unitPrice: iPrice, qty: 0, total: 0 };
                node.wholesaleItems[itemKey].qty += iQty;
                node.wholesaleItems[itemKey].total += iTotalUSD;
            } else {
                node.retailUSD += iTotalUSD;
                if (sale.originalReceiptId) node.retailClients.add(sale.originalReceiptId);
                if (!node.retailItems[itemKey]) node.retailItems[itemKey] = { name: sale.productName, unit: sale.unit, unitPrice: iPrice, qty: 0, total: 0 };
                node.retailItems[itemKey].qty += iQty;
                node.retailItems[itemKey].total += iTotalUSD;
            }
        };

        addDataToNode(result[regionKey][statusKey]);
        addDataToNode(result[regionKey].total);
        
        let overallStatus = statusKey === 'direct' ? 'paid' : statusKey; 
        addDataToNode(result.overall[overallStatus]);
        addDataToNode(result.overall.total);
    });

    const formatNode = (node) => ({
        wholesaleUSD: node.wholesaleUSD,
        wholesaleClients: node.wholesaleClients.size,
        wholesaleItems: Object.values(node.wholesaleItems).sort((a,b) => b.total - a.total),
        retailUSD: node.retailUSD,
        retailClients: node.retailClients.size,
        retailItems: Object.values(node.retailItems).sort((a,b) => b.total - a.total)
    });

    return {
        overall: { paid: formatNode(result.overall.paid), pending: formatNode(result.overall.pending), total: formatNode(result.overall.total), deliveryUSD: result.overall.deliveryUSD },
        phnomPenh: { paid: formatNode(result.phnomPenh.paid), pending: formatNode(result.phnomPenh.pending), direct: formatNode(result.phnomPenh.direct), total: formatNode(result.phnomPenh.total), deliveryUSD: result.phnomPenh.deliveryUSD },
        provinces: { paid: formatNode(result.provinces.paid), pending: formatNode(result.provinces.pending), total: formatNode(result.provinces.total), deliveryUSD: result.provinces.deliveryUSD }
    };
});

const totalPages = computed(() => Math.ceil(filteredSellers.value.length / itemsPerPage.value) || 1);

const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return filteredSellers.value.slice(start, end);
});

const activeSellersCount = computed(() => new Set(baseCalculatedData.value.filter(s => s.hasSales).map(s => s.originalSellerId)).size);

const grandTotals = computed(() => {
    let stats = { 
        all: { usd: 0, khr: 0, productUSD: 0, productKHR: 0, deliveryUSD: 0, deliveryKHR: 0, clientsSet: new Set(), clients: 0, totalUnitsCount: 0, units: {} }, 
        retail: { usd: 0, khr: 0, productUSD: 0, productKHR: 0, deliveryUSD: 0, deliveryKHR: 0, clientsSet: new Set(), clients: 0, totalUnitsCount: 0, units: {} }, 
        wholesale: { usd: 0, khr: 0, productUSD: 0, productKHR: 0, deliveryUSD: 0, deliveryKHR: 0, clientsSet: new Set(), clients: 0, totalUnitsCount: 0, units: {} } 
    };
    
    const processedDeliveryInvoices = new Set();
    const activeSellerIds = new Set(filteredSellers.value.map(s => s.originalSellerId));

    const invoiceClassification = {}; 
    allSales.value.forEach(sale => {
        if (!isDateInScope(getValidDateStr(sale))) return;
        const mappedSellerId = sale.sellerId || sale.uid || 'admin_direct';
        if (!activeSellerIds.has(mappedSellerId)) return;
        if (sale.originalReceiptId) {
            if (!invoiceClassification[sale.originalReceiptId]) {
                invoiceClassification[sale.originalReceiptId] = sale.category === 'បោះដុំ' ? 'wholesale' : 'retail';
            } else if (sale.category === 'បោះដុំ') {
                invoiceClassification[sale.originalReceiptId] = 'wholesale';
            }
        }
    });

    allSales.value.forEach(sale => {
        const isWholesaleItem = sale.category === 'បោះដុំ';
        if (!isDateInScope(getValidDateStr(sale))) return;
        
        const mappedSellerId = sale.sellerId || sale.uid || 'admin_direct';
        if (!activeSellerIds.has(mappedSellerId)) return;

        const cat = isWholesaleItem ? 'wholesale' : 'retail';
        const usdVal = (sale.currency === 'USD' || sale.currency === '$') ? Number(sale.totalPrice || 0) : 0;
        const khrVal = (sale.currency === 'KHR' || sale.currency === '៛') ? Number(sale.totalPrice || 0) : 0;
        const qty = Number(sale.totalSold || 0);
        const unit = (sale.unit || 'unknown').toLowerCase().trim();

        if (sale.paymentStatus !== 'CANCELED') {
            if (sale.originalReceiptId) {
                stats.all.clientsSet.add(sale.originalReceiptId);
                const clientType = invoiceClassification[sale.originalReceiptId] || 'retail';
                if (clientType === 'wholesale') stats.wholesale.clientsSet.add(sale.originalReceiptId);
                else stats.retail.clientsSet.add(sale.originalReceiptId);
            }

            let dUsd = 0; let dKhr = 0;
            if (sale.originalReceiptId && sale.isFirstItemOfReceipt && !processedDeliveryInvoices.has(sale.originalReceiptId)) {
                const dFee = Number(sale.deliveryFee) || 0;
                const dCurr = sale.deliveryCurrency || 'USD';
                if (dCurr === 'USD' || dCurr === '$') dUsd = dFee;
                else dKhr = dFee;
                processedDeliveryInvoices.add(sale.originalReceiptId);
            }

            stats.all.productUSD += usdVal; stats.all.productKHR += khrVal;
            stats.all.deliveryUSD += dUsd; stats.all.deliveryKHR += dKhr;
            stats.all.usd += (usdVal + dUsd); stats.all.khr += (khrVal + dKhr);

            stats[cat].productUSD += usdVal; stats[cat].productKHR += khrVal;
            stats[cat].deliveryUSD += dUsd; stats[cat].deliveryKHR += dKhr;
            stats[cat].usd += (usdVal + dUsd); stats[cat].khr += (khrVal + dKhr);
            
            if (qty > 0) {
                stats.all.units[unit] = (stats.all.units[unit] || 0) + qty; stats.all.totalUnitsCount += qty;
                stats[cat].units[unit] = (stats[cat].units[unit] || 0) + qty; stats[cat].totalUnitsCount += qty;
            }
        }
    });

    stats.all.clients = stats.all.clientsSet.size;
    stats.retail.clients = stats.retail.clientsSet.size;
    stats.wholesale.clients = stats.wholesale.clientsSet.size;
    return stats;
});

const reportDateLabel = computed(() => {
    let dateStr = '';
    if (dateFilterType.value === 'today') dateStr = new Intl.DateTimeFormat('km-KH', { dateStyle: 'long' }).format(new Date(selectedDate.value));
    if (dateFilterType.value === 'month') dateStr = `ខែ ${monthNames[selectedMonth.value]} ឆ្នាំ ${selectedYear.value}`;
    if (dateFilterType.value === 'yearly') dateStr = `ឆ្នាំ ${selectedYear.value}`;
    if (dateFilterType.value === 'custom') dateStr = `${selectedDateFormatter(customStart.value)} ដល់ ${selectedDateFormatter(customEnd.value)}`;
    if (dateFilterType.value === 'specific') dateStr = new Intl.DateTimeFormat('km-KH', { dateStyle: 'long' }).format(new Date(specificDate.value));
    if (dateFilterType.value === 'range') dateStr = `${selectedDateFormatter(startDate.value)} ដល់ ${selectedDateFormatter(endDate.value)}`;

    return `${dateStr} - ${activeCategory.value === 'all' ? 'សរុប (All)' : activeCategory.value}`;
});

const selectedDateFormatter = (dateStr) => {
    if(!dateStr) return '';
    return new Intl.DateTimeFormat('km-KH', { dateStyle: 'medium' }).format(new Date(dateStr));
};

const getPrintDataPayload = () => ({
    filteredSellers: filteredSellers.value,
    regionalReportSummary: regionalReportSummary.value, 
    grandTotals: grandTotals.value,
    reportDateLabel: reportDateLabel.value,
    activeCategory: activeCategory.value,
    dateFilterType: dateFilterType.value,
    availableUnits: availableUnits.value
});

const handlePrint = () => { executeNativePrint(getPrintDataPayload()); };
const handlePDF = async () => { await generatePDF(getPrintDataPayload(), printStaging.value, processing); };

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Battambang:wght@400;700;900&family=Kantumruy+Pro:wght@400;700&display=swap');
.font-khmer { font-family: 'Battambang', 'Kantumruy Pro', sans-serif; }
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
input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
input[type="number"] { -moz-appearance: textfield; }
@media print { .print\:hidden { display: none !important; } }
</style>