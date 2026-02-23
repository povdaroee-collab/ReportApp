<template>
  <div class="font-khmer h-[100dvh] flex flex-col relative bg-[#F4F7FE] overflow-hidden">
      
      <div class="flex-none bg-white/70 backdrop-blur-2xl border-b border-slate-200/60 z-40 p-4 md:px-8 shadow-sm relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 pointer-events-none"></div>
          
          <div class="max-w-[90rem] mx-auto relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-5">
              
              <div class="flex items-center gap-4">
                  <button @click="$router.back()" class="w-12 h-12 rounded-[1.25rem] bg-white border border-slate-200/80 text-slate-500 hover:text-indigo-600 hover:border-indigo-300 shadow-sm flex items-center justify-center transition-all active:scale-95 shrink-0 group">
                      <svg class="w-6 h-6 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/></svg>
                  </button>
                  <div>
                      <h1 class="text-xl md:text-2xl font-black text-slate-800 tracking-tight leading-tight">ប្រវត្តិលក់លម្អិត</h1>
                      <p class="text-slate-500 text-[10px] md:text-xs font-bold uppercase tracking-wider mt-0.5">Seller Sales History</p>
                  </div>
              </div>

              <div class="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
                 <div class="bg-white/80 p-1.5 rounded-2xl flex shadow-sm border border-slate-200/80 shrink-0">
                    <button @click="activeCategory = 'all'" class="px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap" :class="activeCategory === 'all' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'">ទាំងអស់</button>
                    <button @click="activeCategory = 'លក់រាយ'" class="px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap" :class="activeCategory === 'លក់រាយ' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'">លក់រាយ</button>
                    <button @click="activeCategory = 'បោះដុំ'" class="px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap" :class="activeCategory === 'បោះដុំ' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'">បោះដុំ</button>
                 </div>

                 <div class="bg-white/80 p-1.5 rounded-2xl flex overflow-x-auto no-scrollbar shadow-sm border border-slate-200/80 shrink-0">
                    <button 
                      v-for="tab in filterTabs" 
                      :key="tab.key"
                      @click="handleTabClick(tab.key)"
                      class="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all duration-300 whitespace-nowrap relative"
                      :class="dateFilterType === tab.key ? 'text-blue-600 shadow-md bg-white border-blue-200 border' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-transparent'"
                    >
                      {{ tab.label }}
                    </button>
                 </div>
              </div>
          </div>

          <div class="flex flex-wrap items-center gap-3 animate-fade-in mt-4 max-w-[90rem] mx-auto w-full min-h-[42px] relative z-10">
              <div v-if="dateFilterType === 'daily'" class="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition-colors focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 w-full sm:w-auto">
                 <span class="text-slate-400 text-[10px] font-black uppercase tracking-wider">Date</span>
                 <input v-model="selectedDate" type="date" class="w-full bg-transparent border-none text-slate-700 font-bold text-sm focus:ring-0 outline-none p-0 cursor-pointer">
              </div>

              <div v-if="dateFilterType === 'monthly'" class="flex gap-2 w-full sm:w-auto">
                 <div class="relative group flex-1 sm:flex-none">
                    <select v-model="selectedMonth" class="w-full appearance-none bg-white border border-slate-200 pl-4 pr-10 py-2.5 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm cursor-pointer min-w-[140px] hover:border-blue-300 transition-all">
                       <option v-for="m in availableMonths" :key="m.index" :value="m.index">{{ m.name }}</option>
                    </select>
                    <svg class="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                 </div>
                 <div class="relative group flex-1 sm:flex-none">
                    <select v-model="selectedYear" class="w-full appearance-none bg-white border border-slate-200 pl-4 pr-10 py-2.5 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm cursor-pointer hover:border-blue-300 transition-all">
                       <option v-for="y in availableYears" :key="y" :value="y">{{ y }}</option>
                    </select>
                    <svg class="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                 </div>
              </div>

              <div v-if="dateFilterType === 'yearly'" class="relative group w-full sm:w-auto">
                 <select v-model="selectedYear" class="w-full appearance-none bg-white border border-slate-200 pl-4 pr-10 py-2.5 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm cursor-pointer min-w-[120px] hover:border-blue-300 transition-all">
                    <option v-for="y in availableYears" :key="y" :value="y">{{ y }}</option>
                 </select>
                 <svg class="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
              </div>

               <div v-if="dateFilterType === 'custom'" class="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition-colors focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 w-full sm:w-auto">
                 <input v-model="customStart" type="date" class="w-full flex-1 bg-transparent border-none text-slate-700 font-bold text-sm focus:ring-0 outline-none p-0 cursor-pointer">
                 <div class="w-4 h-px bg-slate-300"></div>
                 <input v-model="customEnd" type="date" class="w-full flex-1 bg-transparent border-none text-slate-700 font-bold text-sm focus:ring-0 outline-none p-0 cursor-pointer">
              </div>
          </div>
      </div>

      <div class="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 relative">
          <div class="max-w-[90rem] mx-auto w-full pb-20">
              
              <div v-if="isLoading" class="flex flex-col items-center justify-center py-32 opacity-60">
                  <div class="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-indigo-600 mb-4"></div>
                  <p class="text-slate-500 font-bold tracking-wide">កំពុងទាញយកទិន្នន័យ...</p>
              </div>

              <template v-else>
                  
                  <div v-if="seller" class="bg-white rounded-[2rem] p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/80 flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden mb-8 group">
                      <div class="absolute right-0 top-0 w-64 h-64 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-full blur-3xl opacity-60 pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>
                      
                      <div class="relative shrink-0 z-10">
                          <div class="w-28 h-28 md:w-32 md:h-32 rounded-[2rem] p-1.5 bg-white shadow-xl rotate-3 group-hover:rotate-0 transition-transform duration-500 border border-slate-100">
                             <img :src="seller.photoUrl || `https://ui-avatars.com/api/?name=${seller.fullName}`" class="w-full h-full rounded-[1.5rem] object-cover bg-slate-50">
                          </div>
                          <span class="absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-4 border-white shadow-sm" :class="filteredSales.length > 0 ? 'bg-emerald-500' : 'bg-slate-300'"></span>
                      </div>
                      
                      <div class="flex-1 text-center md:text-left z-10 flex flex-col justify-center h-full pt-2">
                          <h2 class="text-3xl font-black text-slate-800 tracking-tight leading-none mb-3">{{ seller.fullName }}</h2>
                          <div class="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                              <span class="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-xs font-mono font-bold tracking-widest border border-slate-200 shadow-inner">ID: {{ seller.idNumber || 'N/A' }}</span>
                              
                              <span v-if="seller.phoneNumber" class="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-600 px-3 py-1 rounded-lg text-xs font-bold shadow-sm">
                                  <svg class="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                                  {{ seller.phoneNumber }}
                              </span>
                              
                              <a v-if="seller.telegram" :href="'https://t.me/' + seller.telegram.replace('@', '')" target="_blank" class="flex items-center gap-1.5 bg-sky-50 text-sky-600 hover:bg-sky-500 hover:text-white transition-colors border border-sky-100 px-3 py-1 rounded-lg text-xs font-bold shadow-sm">
                                  <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.48-.94-2.4-1.54-1.06-.7-.37-1.09.23-1.72.16-.16 2.87-2.63 2.92-2.85.01-.03.01-.14-.06-.2-.06-.06-.17-.04-.25-.02-.11.02-1.91 1.2-5.39 3.55-.5.34-.95.51-1.35.5-.44-.01-1.29-.25-1.92-.42-.77-.21-1.37-.32-1.31-.68.03-.18.28-.37.76-.56 3.03-1.32 5.06-2.19 6.09-2.62 2.93-1.21 3.53-1.43 3.93-1.43.09 0 .28.01.4.04.1.03.24.1.33.25.08.16.07.32.07.33z"/></svg>
                                  @{{ seller.telegram.replace('@', '') }}
                              </a>
                          </div>
                      </div>
                  </div>

                  <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
                      <div class="bg-gradient-to-br from-indigo-600 via-blue-600 to-sky-600 rounded-[24px] p-6 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden flex flex-col justify-between group hover:-translate-y-1 transition-transform duration-300">
                          <div class="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-500"></div>
                          
                          <div class="relative z-10">
                              <p class="text-blue-100 text-[11px] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                                 <span class="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                                 ចំណូលសរុប (Revenue)
                              </p>
                              <div class="flex items-baseline gap-2">
                                 <span class="text-4xl font-black tracking-tight">{{ sellerStats.all.usd.toLocaleString() }}</span>
                                 <span class="text-xl font-bold opacity-80">$</span>
                              </div>
                              <div class="text-sm font-bold mt-1 opacity-90 pb-2">{{ sellerStats.all.khr.toLocaleString() }} ៛</div>
                          </div>

                          <div v-if="activeCategory === 'all'" class="flex gap-2 border-t border-white/20 pt-3 mt-1 relative z-10">
                              <div class="flex-1 bg-black/10 rounded-lg p-3 border border-white/10 backdrop-blur-sm hover:bg-black/20 transition-colors">
                                  <div class="text-blue-100 text-[10px] font-bold mb-1 uppercase">លក់រាយ (Retail)</div>
                                  <div class="font-black text-sm">{{ sellerStats.retail.usd.toLocaleString() }} $</div>
                                  <div class="font-bold text-[11px] opacity-90">{{ sellerStats.retail.khr.toLocaleString() }} ៛</div>
                              </div>
                              <div class="flex-1 bg-black/10 rounded-lg p-3 border border-white/10 backdrop-blur-sm hover:bg-black/20 transition-colors">
                                  <div class="text-blue-100 text-[10px] font-bold mb-1 uppercase">បោះដុំ (Wholesale)</div>
                                  <div class="font-black text-sm">{{ sellerStats.wholesale.usd.toLocaleString() }} $</div>
                                  <div class="font-bold text-[11px] opacity-90">{{ sellerStats.wholesale.khr.toLocaleString() }} ៛</div>
                              </div>
                          </div>
                      </div>
                      
                      <div class="bg-white rounded-[24px] p-6 border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden flex flex-col justify-between group hover:border-blue-300 transition-colors">
                          <div class="relative z-10 flex justify-between items-start mb-4">
                             <div>
                                <p class="text-slate-400 text-[11px] font-black uppercase tracking-widest mb-1">ចំនួនលក់សរុប (Units)</p>
                                <h3 class="text-3xl font-black text-slate-800">{{ sellerStats.all.totalUnits.toLocaleString() }}</h3>
                             </div>
                             <div class="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-500 flex items-center justify-center">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                             </div>
                          </div>
                          
                          <div class="flex flex-wrap gap-1.5 mt-auto pt-3 border-t border-slate-100 relative z-10">
                              <span v-for="(count, unit) in sellerStats.all.units" :key="unit" class="text-[10px] font-bold px-2.5 py-1 rounded border shadow-sm" :class="getUnitBadgeColor(unit)">
                                  {{ count.toLocaleString() }} {{ translateUnit(unit) }}
                              </span>
                              <span v-if="Object.keys(sellerStats.all.units).length === 0" class="text-xs font-bold text-slate-300">គ្មានទិន្នន័យ</span>
                          </div>

                          <div v-if="activeCategory === 'all'" class="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 relative z-10">
                              <div class="bg-indigo-50/50 rounded-lg p-3 border border-indigo-100/60 transition-colors hover:bg-indigo-50">
                                  <p class="text-[10px] text-indigo-500 font-bold mb-1 uppercase tracking-widest">លក់រាយ</p>
                                  <span class="text-lg font-black text-slate-700">{{ sellerStats.retail.totalUnits.toLocaleString() }}</span>
                              </div>
                              <div class="bg-purple-50/50 rounded-lg p-3 border border-purple-100/60 transition-colors hover:bg-purple-50">
                                  <p class="text-[10px] text-purple-600 font-bold mb-1 uppercase tracking-widest">បោះដុំ</p>
                                  <span class="text-lg font-black text-slate-700">{{ sellerStats.wholesale.totalUnits.toLocaleString() }}</span>
                              </div>
                          </div>
                      </div>

                      <div class="bg-white rounded-[24px] p-6 border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden flex flex-col justify-between group hover:border-amber-300 transition-colors">
                          <div class="relative z-10 flex justify-between items-start">
                             <div>
                                <p class="text-slate-400 text-[11px] font-black uppercase tracking-widest mb-1">អតិថិជនសរុប (Clients)</p>
                                <h3 class="text-3xl font-black text-slate-800">{{ sellerStats.all.clients.toLocaleString() }} <span class="text-sm text-slate-400 font-bold">នាក់</span></h3>
                             </div>
                             <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
                                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
                             </div>
                          </div>
                          
                          <div class="mt-auto pt-3 border-t border-slate-100 text-[11px] font-bold text-slate-500 relative z-10 flex justify-between items-center">
                              <span>ចំនួនប្រតិបត្តិការសរុប:</span>
                              <span class="bg-slate-100 text-slate-700 px-3 py-1 rounded-lg text-xs font-black">{{ filteredSales.length }}</span>
                          </div>

                          <div v-if="activeCategory === 'all'" class="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 relative z-10">
                              <div class="bg-slate-50 rounded-lg p-3 border border-slate-200/60 hover:bg-slate-100 transition-colors">
                                  <p class="text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-widest">អតិថិជនរាយ</p>
                                  <span class="text-base font-black text-slate-700">{{ sellerStats.retail.clients.toLocaleString() }} <span class="text-[10px] font-bold text-slate-400">នាក់</span></span>
                              </div>
                              <div class="bg-slate-50 rounded-lg p-3 border border-slate-200/60 hover:bg-slate-100 transition-colors">
                                  <p class="text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-widest">អតិថិជនដុំ</p>
                                  <span class="text-base font-black text-slate-700">{{ sellerStats.wholesale.clients.toLocaleString() }} <span class="text-[10px] font-bold text-slate-400">នាក់</span></span>
                              </div>
                          </div>
                      </div>
                  </div>

                  <div class="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
                      <h3 class="text-lg font-black text-slate-800 flex items-center gap-2">
                          ទិន្នន័យលម្អិត
                          <span class="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-lg border border-slate-200">{{ filteredSales.length }} កំណត់ត្រា</span>
                      </h3>
                  </div>

                  <div v-if="filteredSales.length === 0" class="bg-white/60 backdrop-blur-sm rounded-[2rem] border-2 border-dashed border-slate-200 p-20 text-center animate-fade-in mb-8">
                      <div class="w-20 h-20 bg-white shadow-sm rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                          <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                      </div>
                      <p class="text-slate-600 font-bold text-lg">មិនមានទិន្នន័យទេ</p>
                      <p class="text-slate-400 text-sm mt-1">មិនមានទិន្នន័យសម្រាប់ជម្រើសនេះឡើយ។</p>
                  </div>

                  <div v-else class="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 overflow-hidden animate-fade-in mb-10">
                      
                      <div class="hidden md:block overflow-x-auto">
                          <table class="w-full text-left min-w-[900px] border-collapse">
                              <thead class="bg-slate-50/80 backdrop-blur-md border-b border-slate-200 text-slate-500 text-[11px] uppercase font-black tracking-widest sticky top-0">
                                  <tr>
                                      <th class="px-6 py-5 w-40">កាលបរិច្ឆេទ</th>
                                      <th class="px-6 py-5 w-32">ប្រភេទលក់</th>
                                      <th class="px-6 py-5 text-center w-28">អតិថិជន</th>
                                      <th class="px-6 py-5 w-40">បរិមាណលក់</th>
                                      <th class="px-6 py-5 text-right w-40">ចំណូល</th>
                                  </tr>
                              </thead>
                              <tbody class="divide-y divide-slate-100">
                                  <tr v-for="sale in filteredSales" :key="sale.id" class="hover:bg-slate-50/50 transition-colors group cursor-default">
                                      <td class="px-6 py-4 text-sm font-bold text-slate-700">{{ formatDate(sale.date) }}</td>
                                      
                                      <td class="px-6 py-4">
                                          <span class="px-2.5 py-1.5 rounded text-[11px] font-black border shadow-sm whitespace-nowrap" :class="(sale.category || 'លក់រាយ') === 'បោះដុំ' ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-indigo-50 border-indigo-200 text-indigo-700'">
                                              {{ sale.category || 'លក់រាយ' }}
                                          </span>
                                      </td>

                                      <td class="px-6 py-4 text-center">
                                          <span class="inline-flex items-center px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-sm font-bold border border-amber-100">
                                              {{ sale.totalClients }} នាក់
                                          </span>
                                      </td>

                                      <td class="px-6 py-4">
                                          <span class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border shadow-sm bg-white" :class="getUnitBadgeColor(sale.unit)">
                                              {{ Number(sale.totalSold).toLocaleString() }} {{ translateUnit(sale.unit) }}
                                          </span>
                                      </td>

                                      <td class="px-6 py-4 text-right">
                                          <div class="flex flex-col items-end gap-0.5">
                                              <span v-if="sale.currency === 'USD'" class="text-emerald-600 font-black text-base bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 shadow-sm">{{ Number(sale.totalPrice).toLocaleString() }} $</span>
                                              <span v-else class="text-blue-600 font-black text-sm bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 shadow-sm">{{ Number(sale.totalPrice).toLocaleString() }} ៛</span>
                                          </div>
                                      </td>
                                  </tr>
                              </tbody>
                          </table>
                      </div>

                      <div class="md:hidden flex flex-col gap-3 p-4 bg-slate-50/50">
                          <div v-for="sale in filteredSales" :key="'mob-'+sale.id" class="bg-white p-5 rounded-[20px] shadow-sm border border-slate-100 relative overflow-hidden">
                              <div class="flex justify-between items-start mb-4 border-b border-slate-50 pb-4">
                                  <div class="flex items-center gap-3">
                                      <div class="bg-blue-50 text-blue-600 font-bold w-12 h-12 rounded-xl flex flex-col items-center justify-center leading-tight shadow-sm border border-blue-100/50">
                                         <span class="text-[10px] uppercase opacity-80">{{ getMonthName(sale.date) }}</span>
                                         <span class="text-lg">{{ getDay(sale.date) }}</span>
                                      </div>
                                      <div>
                                         <p class="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-0.5">កាលបរិច្ឆេទ</p>
                                         <p class="text-slate-800 text-sm font-bold">{{ formatDate(sale.date) }}</p>
                                      </div>
                                  </div>
                                  <div class="text-right">
                                      <span class="px-2.5 py-1 rounded text-[9px] font-black border uppercase" :class="(sale.category || 'លក់រាយ') === 'បោះដុំ' ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-indigo-50 border-indigo-200 text-indigo-700'">
                                          {{ sale.category || 'លក់រាយ' }}
                                      </span>
                                  </div>
                              </div>

                              <div class="grid grid-cols-2 gap-3 mb-4">
                                  <div class="bg-slate-50/80 rounded-xl p-3 border border-slate-100/80 flex flex-col">
                                      <p class="text-[10px] text-slate-400 font-black uppercase tracking-wider mb-1">អតិថិជន</p>
                                      <p class="text-sm font-bold text-slate-700 mt-auto"><span class="text-orange-500">{{ sale.totalClients }}</span> នាក់</p>
                                  </div>
                                  <div class="bg-slate-50/80 rounded-xl p-3 border border-slate-100/80 flex flex-col">
                                      <p class="text-[10px] text-slate-400 font-black uppercase tracking-wider mb-1">បរិមាណលក់</p>
                                      <span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold border bg-white shadow-sm mt-auto w-fit" :class="getUnitBadgeColor(sale.unit)">
                                          {{ Number(sale.totalSold).toLocaleString() }} {{ translateUnit(sale.unit) }}
                                      </span>
                                  </div>
                              </div>

                              <div class="mt-4 pt-4 border-t border-slate-100 flex justify-between items-end">
                                  <span class="text-[10px] text-slate-400 font-black uppercase tracking-widest">ចំណូល (Revenue)</span>
                                  <div class="text-right">
                                      <span v-if="sale.currency === 'USD'" class="text-emerald-600 font-black text-xl">{{ Number(sale.totalPrice).toLocaleString() }} <span class="text-sm opacity-80">$</span></span>
                                      <span v-else class="text-blue-600 font-black text-lg">{{ Number(sale.totalPrice).toLocaleString() }} ៛</span>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>

              </template>
          </div>
      </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { db } from '@/firebaseConfig';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import CustomAlert from '../../components/shared/CustomAlert.vue';

const route = useRoute();
const router = useRouter();

const sellerId = route.params.id;
const sellerInfo = ref(null);
const seller = ref(null);
const sellerSales = ref([]);
const availableUnits = ref([]);
const isLoading = ref(true);

const alert = reactive({ show: false, type: 'success', title: '', message: '' });
const triggerAlert = (type, title, message) => {
    alert.show = false; 
    setTimeout(() => {
        alert.type = type; 
        alert.title = title; 
        alert.message = message; 
        alert.show = true;
        setTimeout(() => alert.show = false, 3000);
    }, 50);
};

// --- DYNAMIC FILTER TABS ---
const getTodayString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
};

const dateFilterType = ref('monthly'); 
const selectedDate = ref(getTodayString()); 
const selectedYear = ref(new Date().getFullYear());
const selectedMonth = ref(new Date().getMonth());
const customStart = ref(getTodayString());
const customEnd = ref(getTodayString());

const filterTabs = [
 { key: 'daily', label: 'ប្រចាំថ្ងៃ' },
 { key: 'monthly', label: 'ប្រចាំខែ' },
 { key: 'yearly', label: 'ប្រចាំឆ្នាំ' },
 { key: 'custom', label: 'កំណត់ថ្ងៃ' },
];

const monthNames = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'];

const handleTabClick = (key) => {
    dateFilterType.value = key;
    if (key === 'daily') {
        selectedDate.value = getTodayString(); 
    }
};

const availableYears = computed(() => {
  const validSales = sellerSales.value.filter(s => s && s.date);
  if (validSales.length === 0) return [new Date().getFullYear()];
  const years = new Set(validSales.map(s => new Date(s.date).getFullYear()));
  return Array.from(years).sort((a, b) => b - a);
});

const availableMonths = computed(() => {
  const validSales = sellerSales.value.filter(s => s && s.date);
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

// --- CATEGORY FILTER ---
const activeCategory = ref('all');

// --- DATA FILTERING ---
const filteredSales = computed(() => {
    return sellerSales.value.filter(sale => {
        const matchDate = isDateInScope(sale.date);
        const matchCat = activeCategory.value === 'all' || (sale.category || 'លក់រាយ') === activeCategory.value;
        return matchDate && matchCat;
    });
});

// --- COMPUTED TOTALS (Based on filter) ---
const sellerStats = computed(() => {
    let stats = {
        all: { usd: 0, khr: 0, clients: 0, totalUnits: 0, units: {} },
        retail: { usd: 0, khr: 0, clients: 0, totalUnits: 0, units: {} },
        wholesale: { usd: 0, khr: 0, clients: 0, totalUnits: 0, units: {} }
    };

    filteredSales.value.forEach(sale => {
        const cat = (sale.category || 'លក់រាយ') === 'បោះដុំ' ? 'wholesale' : 'retail';
        
        let sUsd = 0, sKhr = 0;
        if (sale.currency === 'USD' || sale.currency === '$') sUsd = Number(sale.totalPrice || 0);
        else sKhr = Number(sale.totalPrice || 0);

        const sClients = Number(sale.totalClients || 0);
        const sAmt = Number(sale.totalSold || 0);
        const u = (sale.unit || 'unknown').toLowerCase().trim();

        // Add to ALL
        stats.all.usd += sUsd; stats.all.khr += sKhr;
        stats.all.clients += sClients; stats.all.totalUnits += sAmt;
        stats.all.units[u] = (stats.all.units[u] || 0) + sAmt;

        // Add to SPECIFIC
        stats[cat].usd += sUsd; stats[cat].khr += sKhr;
        stats[cat].clients += sClients; stats[cat].totalUnits += sAmt;
        stats[cat].units[u] = (stats[cat].units[u] || 0) + sAmt;
    });

    return stats;
});


onMounted(async () => {
    if (!sellerId) return;

    try {
        const sellerSnap = await getDoc(doc(db, 'users', sellerId));
        if (sellerSnap.exists()) {
            seller.value = sellerSnap.data();
            sellerInfo.value = sellerSnap.data();
        }

        const unitSnap = await getDocs(collection(db, 'settings_units'));
        availableUnits.value = unitSnap.docs.map(doc => doc.data());

        const q = query(collection(db, 'sales_reports'), where('sellerId', '==', sellerId));
        const salesSnap = await getDocs(q);
        sellerSales.value = salesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => new Date(b.date) - new Date(a.date));

        if (sellerSales.value.length > 0) {
            const validSales = sellerSales.value.filter(s => s.date);
            if (validSales.length > 0) {
                const latestDate = validSales.map(s => new Date(s.date)).sort((a,b) => b - a)[0];
                selectedYear.value = latestDate.getFullYear();
                selectedMonth.value = latestDate.getMonth();
                
                const yyyy = latestDate.getFullYear();
                const mm = String(latestDate.getMonth() + 1).padStart(2, '0');
                const dd = String(latestDate.getDate()).padStart(2, '0');
                selectedDate.value = `${yyyy}-${mm}-${dd}`;
            }
        }

    } catch (err) {
        console.error(err);
        triggerAlert('error', 'បរាជ័យ', 'មិនអាចទាញយកទិន្នន័យបានទេ');
    } finally {
        isLoading.value = false;
    }
});


const translateUnit = (unitVal) => {
    if (!unitVal) return '';
    const found = availableUnits.value.find(u => u.value === unitVal);
    if (found) return found.label;
    const u = unitVal.toLowerCase().trim();
    if (u === 'bottle' || u === 'bottles') return 'ដប';
    if (u === 'pack' || u === 'packs') return 'កញ្ចប់';
    return unitVal;
};

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

const formatDate = (dateStr) => {
    if(!dateStr) return '';
    return new Intl.DateTimeFormat('km-KH', { dateStyle: 'long' }).format(new Date(dateStr));
};

const getDay = (dateString) => {
   if(!dateString) return '';
   return new Date(dateString).getDate();
};

const getMonthName = (dateString) => {
   if(!dateString) return '';
   const date = new Date(dateString);
   return date.toLocaleDateString('en-US', { month: 'short' });
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Battambong:wght@400;700;900&family=Kantumruy+Pro:wght@400;700&display=swap');
.font-khmer { font-family: 'Battambong', 'Kantumruy Pro', sans-serif; }
.custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #94A3B8; }

.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.animate-fade-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
.animate-slide-down { animation: slideDown 0.3s ease-out forwards; }
@keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>