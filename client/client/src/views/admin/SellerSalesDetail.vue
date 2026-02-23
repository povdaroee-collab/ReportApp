<template>
  <div class="font-khmer h-[100dvh] flex flex-col relative bg-[#F4F7FE] overflow-hidden">
      
      <div class="flex-none bg-white/80 backdrop-blur-2xl border-b border-slate-200/60 z-40 p-4 md:px-8 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
          <div class="flex flex-col xl:flex-row xl:items-center justify-between gap-5 max-w-7xl mx-auto w-full">
              
              <div class="flex items-center gap-4">
                  <button @click="router.back()" class="w-10 h-10 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center transition-all active:scale-95 shadow-sm shrink-0">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/></svg>
                  </button>
                  <div>
                      <h1 class="text-xl md:text-2xl font-black text-slate-800 tracking-tight">ប្រវត្តិលក់លម្អិត</h1>
                      <p class="text-slate-500 text-[10px] md:text-xs font-bold uppercase tracking-wider mt-0.5">
                          {{ seller?.role === 'dealer' ? 'Dealer Sales History' : 'Seller Sales History' }}
                      </p>
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

          <div class="flex flex-wrap items-center gap-3 animate-fade-in mt-4 max-w-7xl mx-auto w-full min-h-[42px]">
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
          </div>
      </div>

      <div class="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 relative">
          <div class="max-w-7xl mx-auto w-full space-y-6">
              
              <div v-if="isLoading" class="flex flex-col items-center justify-center py-32 opacity-60">
                  <div class="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-indigo-600 mb-4"></div>
                  <p class="text-slate-500 font-bold tracking-wide">កំពុងទាញយកទិន្នន័យ...</p>
              </div>

              <template v-else>
                  
                  <div v-if="seller" class="bg-white rounded-[24px] p-6 shadow-sm border border-slate-200/80 flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden">
                      <div class="absolute right-0 top-0 w-64 h-64 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                      
                      <div class="relative shrink-0">
                          <img :src="seller.photoUrl || `https://ui-avatars.com/api/?name=${seller.fullName}`" class="w-24 h-24 rounded-[1.5rem] object-cover border-4 border-white shadow-lg bg-slate-50">
                          <span class="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-white shadow-sm" :class="filteredSales.length > 0 ? 'bg-emerald-500' : 'bg-slate-300'"></span>
                      </div>
                      
                      <div class="flex-1 text-center sm:text-left z-10 flex flex-col justify-center py-1">
                          <div class="flex flex-col sm:flex-row items-center sm:items-end gap-2 sm:gap-4 mb-2">
                              <h2 class="text-2xl md:text-3xl font-black text-slate-800 tracking-tight leading-none">{{ seller.fullName }}</h2>
                              <span v-if="seller.role === 'dealer'" class="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-md flex items-center gap-1.5 mb-0.5">
                                  <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                  Dealer Account
                              </span>
                          </div>

                          <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mt-2">
                              <span class="bg-slate-100 border border-slate-200 text-slate-600 px-3 py-1 rounded-lg text-xs font-mono font-bold tracking-widest shadow-inner">ID: {{ seller.idNumber || 'N/A' }}</span>
                              
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

                  <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      
                      <div class="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[20px] p-5 text-white shadow-lg shadow-emerald-500/20 relative overflow-hidden flex flex-col justify-between">
                          <div class="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                          
                          <div class="relative z-10">
                              <p class="text-emerald-100 text-[11px] font-black uppercase tracking-widest mb-2 flex items-center gap-2">ចំណូលសរុប (Total Revenue)</p>
                              <div class="flex items-baseline gap-2">
                                 <span class="text-3xl font-black tracking-tight">{{ sellerStats.all.usd.toLocaleString() }}</span>
                                 <span class="text-lg font-bold opacity-80">$</span>
                              </div>
                              <div class="text-sm font-bold mt-1 opacity-90 pb-2">{{ sellerStats.all.khr.toLocaleString() }} ៛</div>
                          </div>

                          <div v-if="activeCategory === 'all'" class="flex gap-2 border-t border-white/20 pt-3 mt-1 relative z-10">
                              <div class="flex-1 bg-black/10 rounded-lg p-2.5 border border-white/10 backdrop-blur-sm">
                                  <div class="text-emerald-100 text-[10px] font-bold mb-1 uppercase">លក់រាយ (Retail)</div>
                                  <div class="font-black text-sm">{{ sellerStats.retail.usd.toLocaleString() }} $</div>
                                  <div class="font-bold text-[11px] opacity-90">{{ sellerStats.retail.khr.toLocaleString() }} ៛</div>
                              </div>
                              <div class="flex-1 bg-black/10 rounded-lg p-2.5 border border-white/10 backdrop-blur-sm">
                                  <div class="text-emerald-100 text-[10px] font-bold mb-1 uppercase">បោះដុំ (Wholesale)</div>
                                  <div class="font-black text-sm">{{ sellerStats.wholesale.usd.toLocaleString() }} $</div>
                                  <div class="font-bold text-[11px] opacity-90">{{ sellerStats.wholesale.khr.toLocaleString() }} ៛</div>
                              </div>
                          </div>
                      </div>
                      
                      <div class="bg-white rounded-[20px] p-5 border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-indigo-300 transition-colors">
                          <div class="relative z-10">
                              <p class="text-slate-400 text-[11px] font-black uppercase tracking-widest mb-1">បរិមាណលក់ (Units Sold)</p>
                              <h3 class="text-3xl font-black text-slate-800">{{ sellerStats.all.totalUnits.toLocaleString() }}</h3>
                          </div>
                          
                          <div class="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-100 relative z-10">
                              <span v-for="(count, unit) in sellerStats.all.units" :key="unit" class="text-[10px] font-bold px-2 py-0.5 rounded border shadow-sm" :class="getUnitBadgeColor(unit)">
                                  {{ count.toLocaleString() }} {{ translateUnit(unit) }}
                              </span>
                          </div>

                          <div v-if="activeCategory === 'all'" class="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 relative z-10">
                              <div class="bg-indigo-50/50 rounded-lg p-2.5 border border-indigo-100/60">
                                  <p class="text-[10px] text-indigo-500 font-bold mb-1 uppercase tracking-widest">លក់រាយ</p>
                                  <span class="text-lg font-black text-slate-700">{{ sellerStats.retail.totalUnits.toLocaleString() }}</span>
                              </div>
                              <div class="bg-purple-50/50 rounded-lg p-2.5 border border-purple-100/60">
                                  <p class="text-[10px] text-purple-600 font-bold mb-1 uppercase tracking-widest">បោះដុំ</p>
                                  <span class="text-lg font-black text-slate-700">{{ sellerStats.wholesale.totalUnits.toLocaleString() }}</span>
                              </div>
                          </div>
                      </div>

                      <div class="bg-white rounded-[20px] p-5 border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-amber-300 transition-colors">
                          <div class="relative z-10 flex justify-between items-start">
                              <div>
                                  <p class="text-slate-400 text-[11px] font-black uppercase tracking-widest mb-1">អតិថិជនសរុប (Clients)</p>
                                  <h3 class="text-3xl font-black text-slate-800">{{ sellerStats.all.clients.toLocaleString() }} <span class="text-sm text-slate-400 font-bold">នាក់</span></h3>
                              </div>
                              <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
                                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
                              </div>
                          </div>
                          
                          <div class="mt-3 pt-3 border-t border-slate-100 text-[11px] font-bold text-slate-500 relative z-10 flex justify-between items-center">
                              <span>ចំនួនប្រតិបត្តិការសរុប:</span>
                              <span class="bg-slate-100 text-slate-700 px-3 py-1 rounded-lg text-xs font-black">{{ filteredSales.length }}</span>
                          </div>

                          <div v-if="activeCategory === 'all'" class="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 relative z-10">
                              <div class="bg-slate-50 rounded-lg p-2.5 border border-slate-200/60">
                                  <p class="text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-widest">អតិថិជនរាយ</p>
                                  <span class="text-base font-black text-slate-700">{{ sellerStats.retail.clients.toLocaleString() }} <span class="text-[10px] font-bold text-slate-400">នាក់</span></span>
                              </div>
                              <div class="bg-slate-50 rounded-lg p-2.5 border border-slate-200/60">
                                  <p class="text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-widest">អតិថិជនដុំ</p>
                                  <span class="text-base font-black text-slate-700">{{ sellerStats.wholesale.clients.toLocaleString() }} <span class="text-[10px] font-bold text-slate-400">នាក់</span></span>
                              </div>
                          </div>
                      </div>
                  </div>

                  <div v-if="sellerSales.length > 0" class="flex flex-col sm:flex-row justify-between items-center gap-4 animate-fade-in mt-8 mb-2">
                      <h3 class="text-lg font-black text-slate-800 flex items-center gap-2">
                          ទិន្នន័យលម្អិត
                          <span class="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-lg border border-slate-200">{{ filteredAndPaginatedSales.length }} / {{ filteredSales.length }} កំណត់ត្រា</span>
                      </h3>
                      
                      <div class="bg-slate-200/50 p-1.5 rounded-xl flex w-full sm:w-auto shadow-inner border border-slate-200">
                         <button @click="activeCategory = 'all'" class="flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all" :class="activeCategory === 'all' ? 'bg-white text-slate-800 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'">ទាំងអស់</button>
                         <button @click="activeCategory = 'បោះដុំ'" class="flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5" :class="activeCategory === 'បោះដុំ' ? 'bg-white text-purple-700 shadow-sm ring-1 ring-purple-200' : 'text-slate-500 hover:text-purple-700'">
                           បោះដុំ
                         </button>
                         <button @click="activeCategory = 'លក់រាយ'" class="flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5" :class="activeCategory === 'លក់រាយ' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-indigo-200' : 'text-slate-500 hover:text-indigo-600'">
                           លក់រាយ
                         </button>
                      </div>
                  </div>

                  <div v-if="filteredSales.length === 0" class="bg-white rounded-[2rem] border-2 border-dashed border-slate-200 p-16 text-center animate-fade-in mt-8">
                      <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                          <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                      </div>
                      <p class="text-slate-600 font-bold text-lg">មិនមានប្រវត្តិលក់ទេ</p>
                      <p class="text-slate-400 text-sm mt-1">មិនមានទិន្នន័យសម្រាប់ជម្រើសនេះឡើយ។</p>
                  </div>

                  <div v-else class="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 overflow-hidden animate-fade-in mb-10">
                      
                      <div class="hidden md:block overflow-x-auto">
                          <table class="w-full text-left min-w-[900px] border-collapse">
                              <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] uppercase font-black tracking-widest">
                                  <tr>
                                      <th class="px-5 py-4 w-12 text-center border-r border-slate-200">
                                          <input type="checkbox" :checked="isAllVisibleSelected" @change="toggleSelectAllVisible" class="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer">
                                      </th>
                                      <th class="px-6 py-4 w-40">កាលបរិច្ឆេទ</th>
                                      <th class="px-6 py-4 w-32">ប្រភេទលក់</th>
                                      <th class="px-6 py-4 text-center w-28">អតិថិជន</th>
                                      <th class="px-6 py-4 w-40">បរិមាណលក់</th>
                                      <th class="px-6 py-4 text-right w-40">ចំណូល</th>
                                      <th class="px-6 py-4 text-center w-32">សកម្មភាព</th>
                                  </tr>
                              </thead>
                              <tbody class="divide-y divide-slate-100">
                                  <tr v-for="sale in filteredAndPaginatedSales" :key="sale.id" class="transition-colors group" :class="[editingSaleId === sale.id ? 'bg-indigo-50/40' : 'hover:bg-slate-50', selectedSales.has(sale.id) ? 'bg-indigo-50/30' : '']">
                                      
                                      <template v-if="editingSaleId !== sale.id">
                                          <td class="px-5 py-4 text-center border-r border-slate-100/50 cursor-pointer" @click.stop="toggleSelectRow(sale.id)">
                                              <input type="checkbox" :checked="selectedSales.has(sale.id)" class="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer transition-all pointer-events-none">
                                          </td>

                                          <td class="px-6 py-4 text-sm font-bold text-slate-700 cursor-pointer" @click="toggleSelectRow(sale.id)">{{ formatDate(sale.date) }}</td>
                                          
                                          <td class="px-6 py-4 cursor-pointer" @click="toggleSelectRow(sale.id)">
                                              <span class="px-2.5 py-1 rounded text-[11px] font-black border shadow-sm" :class="(sale.category || 'លក់រាយ') === 'បោះដុំ' ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-slate-100 border-slate-200 text-slate-600'">
                                                  {{ sale.category || 'លក់រាយ' }}
                                              </span>
                                          </td>

                                          <td class="px-6 py-4 text-center cursor-pointer" @click="toggleSelectRow(sale.id)">
                                              <span class="inline-flex items-center px-2.5 py-1 bg-amber-50 text-amber-600 rounded-lg text-xs font-bold border border-amber-100">{{ sale.totalClients }} នាក់</span>
                                          </td>
                                          <td class="px-6 py-4 cursor-pointer" @click="toggleSelectRow(sale.id)">
                                              <span class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border shadow-sm" :class="getUnitBadgeColor(sale.unit)">
                                                  {{ sale.totalSold.toLocaleString() }} {{ translateUnit(sale.unit) }}
                                              </span>
                                          </td>
                                          <td class="px-6 py-4 text-right cursor-pointer" @click="toggleSelectRow(sale.id)">
                                              <div class="flex flex-col items-end gap-0.5">
                                                  <span v-if="sale.currency === 'USD'" class="text-emerald-600 font-black text-sm bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">{{ sale.totalPrice.toLocaleString() }} $</span>
                                                  <span v-else class="text-blue-600 font-black text-xs">{{ sale.totalPrice.toLocaleString() }} ៛</span>
                                              </div>
                                          </td>
                                          <td class="px-6 py-4 text-center">
                                              <div class="flex items-center justify-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                                                  <button @click.stop="startEdit(sale)" class="p-2 bg-white border border-slate-200 shadow-sm text-slate-500 hover:text-indigo-600 hover:border-indigo-200 rounded-lg transition-all hover:shadow-md" title="កែប្រែ">
                                                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                                                  </button>
                                                  <button @click.stop="confirmDeleteDialog(sale.id)" class="p-2 bg-white border border-slate-200 shadow-sm text-slate-500 hover:text-rose-600 hover:border-rose-200 rounded-lg transition-all hover:shadow-md" title="លុប">
                                                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                                  </button>
                                              </div>
                                          </td>
                                      </template>

                                      <template v-else>
                                          <td class="px-5 py-4 border-r border-slate-100/50 bg-slate-50/30"></td>

                                          <td class="px-4 py-3">
                                              <input type="date" v-model="editForm.date" class="w-full bg-white border border-slate-200 rounded-lg px-2 py-2 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none shadow-sm transition-shadow">
                                          </td>
                                          
                                          <td class="px-4 py-3">
                                              <select v-model="editForm.category" class="w-full bg-white border border-slate-200 rounded-lg px-2 py-2 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 outline-none shadow-sm transition-shadow cursor-pointer">
                                                  <option value="លក់រាយ">លក់រាយ</option>
                                                  <option value="បោះដុំ">បោះដុំ</option>
                                              </select>
                                          </td>

                                          <td class="px-4 py-3">
                                              <div class="relative w-20 mx-auto">
                                                  <input type="number" v-model="editForm.totalClients" min="0" class="w-full bg-white border border-slate-200 rounded-lg pl-2 pr-6 py-2 text-center text-sm font-bold focus:ring-2 focus:ring-amber-500/20 outline-none shadow-sm transition-shadow">
                                                  <span class="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-slate-400 font-bold pointer-events-none">នាក់</span>
                                              </div>
                                          </td>
                                          <td class="px-4 py-3">
                                              <div class="flex gap-1.5">
                                                  <input type="number" v-model="editForm.totalSold" min="0" class="w-16 bg-white border border-slate-200 rounded-lg px-2 py-2 text-center text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none shadow-sm transition-shadow">
                                                  <select v-model="editForm.unit" class="flex-1 bg-white border border-slate-200 rounded-lg px-1 py-2 text-xs font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none shadow-sm cursor-pointer transition-shadow">
                                                      <option v-for="u in availableUnits" :key="u.value" :value="u.value">{{ u.label }}</option>
                                                  </select>
                                              </div>
                                          </td>
                                          <td class="px-4 py-3">
                                              <div class="flex gap-1.5">
                                                  <input type="number" step="0.01" min="0" v-model="editForm.totalPrice" class="w-full bg-white border border-slate-200 rounded-lg px-2 py-2 text-right text-sm font-black text-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none shadow-sm transition-shadow">
                                                  <select v-model="editForm.currency" class="w-16 bg-white border border-slate-200 rounded-lg px-1 py-2 text-[10px] font-black focus:ring-2 focus:ring-emerald-500/20 outline-none shadow-sm cursor-pointer transition-shadow">
                                                      <option value="USD">USD</option>
                                                      <option value="KHR">KHR</option>
                                                  </select>
                                              </div>
                                          </td>
                                          <td class="px-4 py-3 text-center">
                                              <div class="flex items-center justify-center gap-1.5">
                                                  <button @click.stop="saveEdit" :disabled="isUpdating" class="w-8 h-8 flex items-center justify-center bg-emerald-500 text-white rounded-lg shadow-md shadow-emerald-500/20 hover:bg-emerald-600 disabled:opacity-50 transition-all active:scale-95" title="រក្សាទុក">
                                                      <svg v-if="isUpdating" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                      <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                                                  </button>
                                                  <button @click.stop="cancelEdit" class="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 text-slate-500 rounded-lg shadow-sm hover:bg-slate-50 hover:text-rose-500 transition-all active:scale-95" title="បោះបង់">
                                                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                                                  </button>
                                              </div>
                                          </td>
                                      </template>
                                  </tr>
                              </tbody>
                          </table>
                      </div>

                      <div class="md:hidden flex flex-col divide-y divide-slate-100 pb-20">
                          <div class="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                              <label class="flex items-center gap-3 cursor-pointer">
                                  <input type="checkbox" :checked="isAllVisibleSelected" @change="toggleSelectAllVisible" class="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500">
                                  <span class="text-xs font-bold text-slate-600">ជ្រើសរើសទាំងអស់ទំព័រនេះ</span>
                              </label>
                          </div>

                          <div v-for="sale in filteredAndPaginatedSales" :key="'mob-'+sale.id" class="p-4 relative transition-colors cursor-pointer" :class="[editingSaleId === sale.id ? 'bg-indigo-50/30' : '', selectedSales.has(sale.id) ? 'bg-indigo-50/20' : '']" @click="toggleSelectRow(sale.id)">
                              <template v-if="editingSaleId !== sale.id">
                                  <div class="flex justify-between items-start mb-3">
                                      <div class="flex items-center gap-3">
                                          <input type="checkbox" :checked="selectedSales.has(sale.id)" class="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer pointer-events-none">
                                          
                                          <div class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0 relative">
                                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                              <span class="absolute -bottom-1.5 -right-1.5 text-[8px] font-black px-1 rounded" :class="(sale.category || 'លក់រាយ') === 'បោះដុំ' ? 'bg-purple-100 text-purple-700' : 'bg-slate-200 text-slate-600'">{{ (sale.category || 'លក់រាយ') === 'បោះដុំ' ? 'ដុំ' : 'រាយ' }}</span>
                                          </div>
                                          <span class="text-sm font-bold text-slate-800">{{ formatDate(sale.date) }}</span>
                                      </div>
                                      <div class="flex gap-1" @click.stop>
                                          <button @click="startEdit(sale)" class="p-1.5 bg-white border border-slate-200 shadow-sm text-slate-500 rounded-md active:scale-95 transition-transform"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg></button>
                                          <button @click="confirmDeleteDialog(sale.id)" class="p-1.5 bg-white border border-slate-200 shadow-sm text-rose-500 rounded-md active:scale-95 transition-transform"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
                                      </div>
                                  </div>
                                  <div class="grid grid-cols-2 gap-3 bg-slate-50 rounded-xl p-3 border border-slate-100 ml-11">
                                      <div>
                                          <p class="text-[10px] text-slate-400 font-bold uppercase mb-1">បរិមាណលក់</p>
                                          <span class="inline-flex items-center px-2 py-0.5 rounded border bg-white shadow-sm text-[11px] font-bold" :class="getUnitBadgeColor(sale.unit)">
                                              {{ sale.totalSold.toLocaleString() }} {{ translateUnit(sale.unit) }}
                                          </span>
                                      </div>
                                      <div class="text-right">
                                          <p class="text-[10px] text-slate-400 font-bold uppercase mb-1">អតិថិជន</p>
                                          <span class="text-sm font-bold text-slate-700">{{ sale.totalClients }} <span class="text-[10px] text-slate-400">នាក់</span></span>
                                      </div>
                                  </div>
                                  <div class="mt-3 flex justify-between items-end ml-11">
                                      <span class="text-[10px] text-slate-400 font-black uppercase tracking-widest">ចំណូល (Revenue)</span>
                                      <div class="text-right">
                                          <span v-if="sale.currency === 'USD'" class="text-emerald-600 font-black text-lg">{{ sale.totalPrice.toLocaleString() }} $</span>
                                          <span v-else class="text-blue-600 font-black text-sm">{{ sale.totalPrice.toLocaleString() }} ៛</span>
                                      </div>
                                  </div>
                              </template>

                              <template v-else>
                                  <div class="space-y-3 pl-8" @click.stop>
                                      <div>
                                          <label class="text-[10px] font-black text-slate-500 uppercase mb-1 block">កាលបរិច្ឆេទ</label>
                                          <input type="date" v-model="editForm.date" class="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none shadow-sm">
                                      </div>
                                      <div class="grid grid-cols-2 gap-3">
                                          <div>
                                              <label class="text-[10px] font-black text-slate-500 uppercase mb-1 block">ប្រភេទលក់</label>
                                              <select v-model="editForm.category" class="w-full bg-white border border-slate-200 rounded-lg px-2 py-2 text-xs font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none shadow-sm cursor-pointer">
                                                  <option value="លក់រាយ">លក់រាយ</option>
                                                  <option value="បោះដុំ">បោះដុំ</option>
                                              </select>
                                          </div>
                                          <div>
                                              <label class="text-[10px] font-black text-slate-500 uppercase mb-1 block">អតិថិជន (នាក់)</label>
                                              <input type="number" v-model="editForm.totalClients" min="0" class="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-center text-sm font-bold focus:ring-2 focus:ring-amber-500/20 outline-none shadow-sm">
                                          </div>
                                          <div>
                                              <label class="text-[10px] font-black text-slate-500 uppercase mb-1 block">បរិមាណលក់</label>
                                              <div class="flex gap-1">
                                                  <input type="number" v-model="editForm.totalSold" min="0" class="w-1/2 bg-white border border-slate-200 rounded-lg px-2 py-2 text-center text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none shadow-sm">
                                                  <select v-model="editForm.unit" class="w-1/2 bg-white border border-slate-200 rounded-lg px-1 py-2 text-xs font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none shadow-sm cursor-pointer">
                                                      <option v-for="u in availableUnits" :key="u.value" :value="u.value">{{ u.label }}</option>
                                                  </select>
                                              </div>
                                          </div>
                                          <div>
                                              <label class="text-[10px] font-black text-slate-500 uppercase mb-1 block">ចំណូលសរុប</label>
                                              <div class="flex gap-1">
                                                  <input type="number" step="0.01" min="0" v-model="editForm.totalPrice" class="w-2/3 bg-white border border-slate-200 rounded-lg px-2 py-2 text-right text-sm font-black text-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none shadow-sm">
                                                  <select v-model="editForm.currency" class="w-1/3 bg-white border border-slate-200 rounded-lg px-1 py-2 text-[10px] font-black focus:ring-2 focus:ring-emerald-500/20 outline-none shadow-sm cursor-pointer">
                                                      <option value="USD">USD</option>
                                                      <option value="KHR">KHR</option>
                                                  </select>
                                              </div>
                                          </div>
                                      </div>
                                      <div class="flex gap-2 pt-3 mt-1 border-t border-slate-200/60">
                                          <button @click="cancelEdit" class="flex-1 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold text-xs active:scale-95 transition-all shadow-sm">បោះបង់</button>
                                          <button @click="saveEdit" :disabled="isUpdating" class="flex-1 py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-xs flex items-center justify-center shadow-md shadow-emerald-500/20 active:scale-95 transition-all disabled:opacity-50">
                                              <svg v-if="isUpdating" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                              <span v-else>រក្សាទុក</span>
                                          </button>
                                      </div>
                                  </div>
                              </template>
                          </div>
                      </div>
                  </div>

                  <div v-if="totalPages > 1" class="flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-sm mt-4 mb-20 animate-fade-in">
                      <p class="text-xs font-bold text-slate-500">ទំព័រ {{ currentPage }} នៃ {{ totalPages }}</p>
                      <div class="flex gap-1 overflow-x-auto">
                          <button @click="currentPage--" :disabled="currentPage === 1" class="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                          </button>
                          <button v-for="p in visiblePages" :key="p" @click="currentPage = p" class="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg border text-xs font-bold transition-colors" :class="currentPage === p ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'">
                              {{ p }}
                          </button>
                          <button @click="currentPage++" :disabled="currentPage === totalPages" class="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7-7"/></svg>
                          </button>
                      </div>
                  </div>

              </template>
          </div>
      </div>

      <transition enter-active-class="duration-300 ease-out" enter-from-class="opacity-0 translate-y-10" enter-to-class="opacity-100 translate-y-0" leave-active-class="duration-200 ease-in" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-10">
          <div v-if="selectedSales.size > 0" class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/95 backdrop-blur-xl border border-white/10 text-white px-5 py-3 rounded-[20px] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] flex items-center gap-4 md:gap-6 z-[60] w-[90%] md:w-auto overflow-hidden">
              <div class="flex items-center gap-2">
                  <span class="bg-indigo-500 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs font-black">{{ selectedSales.size }}</span>
                  <span class="font-bold text-sm hidden md:block whitespace-nowrap">បានជ្រើសរើស</span>
              </div>
              <div class="w-px h-6 bg-white/20 hidden md:block shrink-0"></div>
              <div class="flex gap-2 w-full md:w-auto shrink-0">
                  <button @click="selectedSales.clear()" class="flex-1 md:flex-none px-4 py-2 hover:bg-white/10 rounded-xl text-sm font-bold transition-colors text-slate-300 hover:text-white">បោះបង់</button>
                  <button @click="confirmBulkDelete" class="flex-1 md:flex-none px-4 py-2 bg-rose-500 hover:bg-rose-600 rounded-xl text-sm font-bold shadow-md shadow-rose-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 text-white whitespace-nowrap">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      <span class="hidden md:inline">លុបទាំងអស់</span>
                      <span class="md:hidden">លុប</span>
                  </button>
              </div>
          </div>
      </transition>
      
      <TransitionRoot appear :show="confirmModal.isOpen" as="template">
        <Dialog as="div" @close="confirmModal.isOpen = false" class="relative z-[9999] font-khmer">
          <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
            <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />
          </TransitionChild>

          <div class="fixed inset-0 overflow-y-auto">
            <div class="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95 translate-y-4" enter-to="opacity-100 scale-100 translate-y-0" leave="duration-200 ease-in" leave-from="opacity-100 scale-100 translate-y-0" leave-to="opacity-0 scale-95 translate-y-4">
                <DialogPanel class="w-full max-w-sm transform overflow-hidden rounded-[24px] bg-white p-6 text-left align-middle shadow-2xl transition-all border border-slate-100">
                  
                  <div class="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4 border-4 border-rose-100/50">
                      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                  </div>

                  <DialogTitle as="h3" class="text-xl font-black text-center text-slate-800 mb-2">
                    បញ្ជាក់ការលុបទិន្នន័យ
                  </DialogTitle>
                  
                  <div class="mt-2 text-center">
                    <p class="text-sm text-slate-500 font-medium">
                      តើអ្នកពិតជាចង់លុបទិន្នន័យចំនួន <span class="font-bold text-rose-500">{{ confirmModal.targetIds.length }}</span> នេះមែនទេ? <br/> លុបហើយ <span class="font-bold text-rose-500">មិនអាចយកមកវិញបានទេ!</span>
                    </p>
                  </div>

                  <div class="mt-8 flex gap-3">
                    <button @click="confirmModal.isOpen = false" type="button" class="flex-1 inline-flex justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 focus:outline-none transition-all active:scale-95 shadow-sm">
                      បោះបង់
                    </button>
                    <button @click="executeDelete" type="button" :disabled="confirmModal.isProcessing" class="flex-1 inline-flex justify-center rounded-xl border border-transparent bg-rose-500 px-4 py-3 text-sm font-bold text-white hover:bg-rose-600 focus:outline-none transition-all active:scale-95 shadow-md shadow-rose-500/20 disabled:opacity-50">
                      <svg v-if="confirmModal.isProcessing" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      <span v-else>យល់ព្រមលុប</span>
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </TransitionRoot>

      <div class="fixed top-0 left-0 right-0 z-[999999] pointer-events-none">
         <CustomAlert v-if="alert.show" :type="alert.type" :title="alert.title" :message="alert.message" @close="alert.show = false" />
      </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { db } from '@/firebaseConfig';
import { doc, getDoc, collection, query, where, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue';
import CustomAlert from '../../components/shared/CustomAlert.vue';

const route = useRoute();
const router = useRouter();

const sellerId = route.params.id;
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
    all: { usd: 0, khr: 0, clients: 0, totalUnits: 0, count: 0, units: {} },
    retail: { usd: 0, khr: 0, clients: 0, totalUnits: 0, count: 0, units: {} },
    wholesale: { usd: 0, khr: 0, clients: 0, totalUnits: 0, count: 0, units: {} }
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
    stats.all.count += 1;
    stats.all.units[u] = (stats.all.units[u] || 0) + sAmt;

    // Add to SPECIFIC CAT
    stats[cat].usd += sUsd; stats[cat].khr += sKhr;
    stats[cat].clients += sClients; stats[cat].totalUnits += sAmt;
    stats[cat].count += 1;
    stats[cat].units[u] = (stats[cat].units[u] || 0) + sAmt;
  });

  return stats;
});

// --- PAGINATION ---
const currentPage = ref(1);
const itemsPerPage = 50;

watch([dateFilterType, selectedDate, selectedMonth, selectedYear, customStart, customEnd, activeCategory], () => {
  currentPage.value = 1;
  selectedSales.value.clear();
});

const totalPages = computed(() => Math.ceil(filteredSales.value.length / itemsPerPage));

const filteredAndPaginatedSales = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredSales.value.slice(start, start + itemsPerPage);
});

const visiblePages = computed(() => {
  let pages = [];
  for (let i = 1; i <= totalPages.value; i++) {
    pages.push(i);
  }
  return pages;
});


// --- MULTI-SELECT STATE ---
const selectedSales = ref(new Set());

// True if ALL items visible on the current page are selected
const isAllVisibleSelected = computed(() => {
  if (filteredAndPaginatedSales.value.length === 0) return false;
  return filteredAndPaginatedSales.value.every(sale => selectedSales.value.has(sale.id));
});

// Toggle only the items currently visible on the screen
const toggleSelectAllVisible = (e) => {
  if (e.target.checked) {
    filteredAndPaginatedSales.value.forEach(sale => {
      selectedSales.value.add(sale.id);
    });
  } else {
    filteredAndPaginatedSales.value.forEach(sale => {
      selectedSales.value.delete(sale.id);
    });
  }
};

const toggleSelectRow = (id) => {
  const newSet = new Set(selectedSales.value);
  if (newSet.has(id)) {
    newSet.delete(id);
  } else {
    newSet.add(id);
  }
  selectedSales.value = newSet;
};


// --- CUSTOM CONFIRM MODAL STATE ---
const confirmModal = reactive({
  isOpen: false,
  targetIds: [], // handles both single and bulk deletes
  isProcessing: false
});

const confirmDeleteDialog = (id) => {
  confirmModal.targetIds = [id];
  confirmModal.isOpen = true;
};

const confirmBulkDelete = () => {
  confirmModal.targetIds = Array.from(selectedSales.value);
  confirmModal.isOpen = true;
};

// Editing State
const editingSaleId = ref(null);
const isUpdating = ref(false);
const editForm = reactive({ id: '', date: '', category: 'លក់រាយ', totalClients: '', totalSold: '', unit: '', totalPrice: '', currency: 'USD' });

onMounted(async () => {
  if (!sellerId) return;

  try {
    // Fetch Seller Info
    const sellerSnap = await getDoc(doc(db, 'users', sellerId));
    if (sellerSnap.exists()) seller.value = sellerSnap.data();

    // Fetch Units Setup
    const unitSnap = await getDocs(collection(db, 'settings_units'));
    availableUnits.value = unitSnap.docs.map(doc => doc.data());

    // Fetch All Sales for this seller
    const q = query(collection(db, 'sales_reports'), where('sellerId', '==', sellerId));
    const salesSnap = await getDocs(q);
    sellerSales.value = salesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => new Date(b.date) - new Date(a.date));

    // Auto select current month logic
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
  return found ? found.label : unitVal;
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

// --- CRUD LOGIC ---
const startEdit = (sale) => {
  editingSaleId.value = sale.id;
  editForm.id = sale.id;
  editForm.date = sale.date;
  editForm.category = sale.category || 'លក់រាយ';
  editForm.totalClients = sale.totalClients;
  editForm.totalSold = sale.totalSold;
  
  // Ensure unit exists in dropdown, else default to first
  const unitExists = availableUnits.value.some(u => u.value === sale.unit);
  editForm.unit = unitExists ? sale.unit : (availableUnits.value[0]?.value || '');
  
  editForm.totalPrice = sale.totalPrice;
  editForm.currency = sale.currency || 'USD';
};

const cancelEdit = () => { editingSaleId.value = null; };

const saveEdit = async () => {
  if (!editForm.date || !editForm.totalSold || !editForm.totalPrice || !editForm.category) return triggerAlert('warning', 'សូមបំពេញ', 'សូមបំពេញព័ត៌មានអោយបានគ្រប់គ្រាន់!');
  
  isUpdating.value = true;
  try {
    const updatedData = {
      date: editForm.date,
      category: editForm.category,
      totalClients: parseInt(editForm.totalClients),
      totalSold: parseInt(editForm.totalSold),
      unit: editForm.unit,
      totalPrice: parseFloat(editForm.totalPrice),
      currency: editForm.currency
    };
    await updateDoc(doc(db, 'sales_reports', editForm.id), updatedData);
    
    // Update Local State
    const index = sellerSales.value.findIndex(s => s.id === editForm.id);
    if (index !== -1) sellerSales.value[index] = { ...sellerSales.value[index], ...updatedData };
    
    // Resort array by date just in case they changed the date
    sellerSales.value.sort((a, b) => new Date(b.date) - new Date(a.date));

    triggerAlert('success', 'ជោគជ័យ', 'ទិន្នន័យត្រូវបានកែប្រែ!');
    cancelEdit();
  } catch (err) {
    console.error(err);
    triggerAlert('error', 'បរាជ័យ', 'មិនអាចកែប្រែទិន្នន័យបានទេ!');
  } finally {
    isUpdating.value = false;
  }
};

const executeDelete = async () => {
  if (!confirmModal.targetIds || confirmModal.targetIds.length === 0) return;
  
  confirmModal.isProcessing = true;
  try {
    // Bulk delete from Firebase
    const deletePromises = confirmModal.targetIds.map(id => deleteDoc(doc(db, 'sales_reports', id)));
    await Promise.all(deletePromises);

    // Update local state
    sellerSales.value = sellerSales.value.filter(s => !confirmModal.targetIds.includes(s.id));
    selectedSales.value.clear(); // clear selections
    
    confirmModal.isOpen = false;
    
    // Trigger alert AFTER modal animation starts closing to ensure it's visible
    setTimeout(() => {
      triggerAlert('success', 'បានលុប', 'ទិន្នន័យត្រូវបានលុបដោយជោគជ័យ!');
      
      // Adjust pagination if they deleted the last items on a page
      if (filteredAndPaginatedSales.value.length === 0 && currentPage.value > 1) {
        currentPage.value--;
      }
    }, 300);

  } catch (err) {
    console.error(err);
    triggerAlert('error', 'បរាជ័យ', 'មិនអាចលុបទិន្នន័យបានទេ!');
  } finally {
    confirmModal.isProcessing = false;
    confirmModal.targetIds = [];
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Battambong:wght@400;700;900&family=Kantumruy+Pro:wght@400;700&display=swap');
.font-khmer { font-family: 'Battambong', 'Kantumruy Pro', sans-serif; }
.custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #94A3B8; }

.animate-fade-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
 -webkit-appearance: none;
 margin: 0;
}
input[type="number"] {
 -moz-appearance: textfield;
}
</style>