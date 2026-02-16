<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="emit('close')" class="relative z-[100] font-khmer">
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-slate-900/80 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 md:p-8">
          <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95 translate-y-4" enter-to="opacity-100 scale-100 translate-y-0" leave="duration-200 ease-in" leave-from="opacity-100 scale-100 translate-y-0" leave-to="opacity-0 scale-95 translate-y-4">
            
            <DialogPanel class="w-full max-w-5xl bg-[#f8fafc] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
               
               <div class="bg-gradient-to-r from-slate-800 to-indigo-900 p-6 md:p-8 text-white relative overflow-hidden shrink-0 shadow-md z-30">
                  <div class="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                  
                  <button @click="emit('close')" class="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors z-10">
                     <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>

                  <div v-if="admin && Object.keys(admin).length" class="flex flex-col md:flex-row gap-6 relative z-10">
                     <img :src="admin.photoUrl || `https://ui-avatars.com/api/?name=${admin.fullName}`" class="w-24 h-24 rounded-3xl object-cover border-4 border-white/20 shadow-xl shrink-0 bg-white">
                     <div class="flex-1">
                        <h2 class="text-2xl font-black mb-1">{{ admin.fullName }}</h2>
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
                              <span class="text-xs font-bold text-white">តំណាងលក់សរុប: {{ sellers.length }} នាក់</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               <div class="p-4 md:p-6 flex-1 overflow-y-auto custom-scrollbar flex flex-col relative bg-slate-50/50">
                  
                  <div class="flex items-center gap-2 mb-6 bg-slate-200/60 p-1.5 rounded-2xl w-full sm:w-fit border border-slate-200 shadow-inner mx-auto sm:mx-0 shrink-0">
                      <button 
                          @click="modalActiveTab = 'sellers'" 
                          :class="modalActiveTab === 'sellers' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'" 
                          class="flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300"
                      >
                          បញ្ជីតំណាងលក់
                      </button>
                      <button 
                          @click="modalActiveTab = 'report'" 
                          :class="modalActiveTab === 'report' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'" 
                          class="flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300"
                      >
                          របាយការណ៍លក់
                      </button>
                  </div>

                  <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-4 bg-white p-3 rounded-2xl shadow-sm border border-slate-200 shrink-0 z-20 relative">
                      <div class="relative w-full md:w-64">
                          <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                          </span>
                          <input v-model="sellerSearchQuery" type="text" placeholder="ស្វែងរកឈ្មោះ ឬ អត្តលេខ..." class="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:font-normal">
                          <button v-if="sellerSearchQuery" @click="sellerSearchQuery = ''" class="absolute inset-y-0 right-2 flex items-center text-slate-400 hover:text-rose-500">
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                          </button>
                      </div>
                      
                      <div class="flex items-center gap-3 w-full md:w-auto">
                          <div v-if="modalActiveTab === 'sellers'" class="bg-slate-100 p-1 rounded-xl flex border border-slate-200 animate-fade-in">
                              <button @click="sellerViewMode = 'card'" :class="sellerViewMode === 'card' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'" class="p-1.5 rounded-lg transition-all" title="Card View">
                                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                              </button>
                              <button @click="sellerViewMode = 'list'" :class="sellerViewMode === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'" class="p-1.5 rounded-lg transition-all" title="List View">
                                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
                              </button>
                          </div>

                          <button @click="executeAdminPrint" :disabled="filteredModalSellers.length === 0" class="flex-1 md:flex-none bg-slate-800 hover:bg-slate-900 text-white px-3 py-2 rounded-xl text-xs font-bold shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5">
                              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2-2v4h10z"></path></svg>
                              Print
                          </button>
                          <button @click="generateAdminPDF" :disabled="filteredModalSellers.length === 0" class="flex-1 md:flex-none bg-rose-500 hover:bg-rose-600 text-white px-3 py-2 rounded-xl text-xs font-bold shadow-md shadow-rose-500/30 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5">
                              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                              PDF
                          </button>
                      </div>
                  </div>

                  <div v-if="filteredModalSellers.length === 0" class="flex-1 flex items-center justify-center py-10">
                      <div class="text-center bg-white p-10 rounded-[2rem] border-2 border-dashed border-slate-200">
                          <div class="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
                              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                          </div>
                          <p class="text-slate-500 font-bold text-lg">មិនមានទិន្នន័យទេ</p>
                      </div>
                  </div>

                  <div v-else-if="sellerViewMode === 'card' && modalActiveTab === 'sellers'" class="grid grid-cols-1 md:grid-cols-2 gap-4 content-start animate-fade-in">
                      <div v-for="seller in paginatedModalSellers" :key="seller.id" class="bg-white p-5 rounded-[20px] border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                          <div class="flex gap-4 items-center">
                              <img :src="seller.photoUrl || `https://ui-avatars.com/api/?name=${seller.fullName}`" class="w-14 h-14 rounded-2xl object-cover border shadow-sm group-hover:scale-105 transition-transform shrink-0">
                              <div class="flex-1 min-w-0">
                                  <h4 class="font-bold text-slate-800 text-base truncate leading-tight mb-1">{{ seller.fullName }}</h4>
                                  <a v-if="seller.telegram" :href="'https://t.me/' + seller.telegram.replace('@', '')" target="_blank" class="inline-flex items-center gap-1 text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded hover:bg-sky-500 hover:text-white transition-colors">
                                      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.48-.94-2.4-1.54-1.06-.7-.37-1.09.23-1.72.16-.16 2.87-2.63 2.92-2.85.01-.03.01-.14-.06-.2-.06-.06-.17-.04-.25-.02-.11.02-1.91 1.2-5.39 3.55-.5.34-.95.51-1.35.5-.44-.01-1.29-.25-1.92-.42-.77-.21-1.37-.32-1.31-.68.03-.18.28-.37.76-.56 3.03-1.32 5.06-2.19 6.09-2.62 2.93-1.21 3.53-1.43 3.93-1.43.09 0 .28.01.4.04.1.03.24.1.33.25.08.16.07.32.07.33z"/></svg>
                                      @{{ seller.telegram.replace('@', '') }}
                                  </a>
                              </div>
                          </div>
                          <div class="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2">
                              <div class="flex flex-wrap gap-2 text-[11px] font-bold text-slate-500">
                                  <span class="bg-slate-100 px-2 py-1 rounded font-mono border border-slate-200 text-slate-600">ID: {{ seller.idNumber || 'N/A' }}</span>
                                  <span class="bg-slate-50 px-2 py-1 rounded flex items-center gap-1 border border-slate-100">
                                      <svg class="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                                      {{ seller.phoneNumber || 'N/A' }}
                                  </span>
                              </div>
                          </div>
                      </div>
                  </div>

                  <div v-else-if="sellerViewMode === 'list' || modalActiveTab === 'report'" class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm animate-fade-in flex flex-col flex-1 min-h-0">
                      <div class="overflow-x-auto overflow-y-auto custom-scrollbar flex-1">
                          <table class="w-full text-left border-collapse min-w-[700px]">
                              <thead class="bg-slate-50/95 backdrop-blur-sm border-b border-slate-200 text-slate-500 text-[10px] uppercase font-black tracking-widest sticky top-0 z-10 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                                  <tr>
                                      <th class="px-4 py-4 text-center w-12 whitespace-nowrap">#</th>
                                      <th class="px-4 py-4 whitespace-nowrap">តំណាងលក់</th>
                                      
                                      <template v-if="modalActiveTab === 'sellers'">
                                          <th class="px-4 py-4 text-center whitespace-nowrap">អត្តលេខ</th>
                                          <th class="px-4 py-4 text-center whitespace-nowrap">លេខទូរស័ព្ទ</th>
                                          <th class="px-4 py-4 text-center whitespace-nowrap">តេឡេក្រាម</th>
                                      </template>
                                      <template v-else>
                                          <th class="px-4 py-4 w-[40%] whitespace-nowrap">ចំនួនលក់ (Units)</th>
                                          <th class="px-4 py-4 text-center whitespace-nowrap">អតិថិជន</th>
                                          <th class="px-4 py-4 text-right whitespace-nowrap">ចំណូល</th>
                                      </template>
                                  </tr>
                              </thead>
                              <tbody class="divide-y divide-slate-100">
                                  <tr v-for="(seller, index) in paginatedModalSellers" :key="seller.id" class="hover:bg-slate-50/80 transition-colors">
                                      <td class="px-4 py-3.5 text-center text-xs font-bold text-slate-400 align-top pt-4">{{ (sellerCurrentPage - 1) * sellerItemsPerPage + index + 1 }}</td>
                                      
                                      <td class="px-4 py-3.5 align-top">
                                          <div class="flex items-center gap-3">
                                              <img :src="seller.photoUrl || `https://ui-avatars.com/api/?name=${seller.fullName}`" class="w-9 h-9 rounded-xl object-cover border border-slate-200 shadow-sm shrink-0">
                                              <p class="font-bold text-[13px] text-slate-800">{{ seller.fullName }}</p>
                                          </div>
                                      </td>
                                      
                                      <template v-if="modalActiveTab === 'sellers'">
                                          <td class="px-4 py-3.5 text-center text-xs font-mono font-bold text-slate-500 align-top pt-5">{{ seller.idNumber || '-' }}</td>
                                          <td class="px-4 py-3.5 text-center text-xs font-medium text-slate-600 align-top pt-5">{{ seller.phoneNumber || '-' }}</td>
                                          <td class="px-4 py-3.5 text-center align-top pt-5">
                                              <a v-if="seller.telegram" :href="'https://t.me/' + seller.telegram.replace('@', '')" target="_blank" class="text-[10px] font-bold text-sky-600 bg-sky-50 px-2.5 py-1.5 rounded-lg inline-flex items-center gap-1 hover:bg-sky-500 hover:text-white transition-colors">
                                                  <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.48-.94-2.4-1.54-1.06-.7-.37-1.09.23-1.72.16-.16 2.87-2.63 2.92-2.85.01-.03.01-.14-.06-.2-.06-.06-.17-.04-.25-.02-.11.02-1.91 1.2-5.39 3.55-.5.34-.95.51-1.35.5-.44-.01-1.29-.25-1.92-.42-.77-.21-1.37-.32-1.31-.68.03-.18.28-.37.76-.56 3.03-1.32 5.06-2.19 6.09-2.62 2.93-1.21 3.53-1.43 3.93-1.43.09 0 .28.01.4.04.1.03.24.1.33.25.08.16.07.32.07.33z"/></svg>
                                                  @{{ seller.telegram.replace('@', '') }}
                                              </a>
                                              <span v-else class="text-xs text-slate-300 font-bold">-</span>
                                          </td>
                                      </template>
                                      
                                      <template v-else>
                                          <td class="px-4 py-3.5 align-top pt-4">
                                              <div v-if="seller.hasSales" class="flex flex-wrap gap-1.5 items-center">
                                                  <template v-for="(entry, idx) in Object.entries(seller.unitCounts || {})" :key="entry[0]">
                                                      <span v-if="idx < 3 || expandedRowIds.has('modalSellerUnitsList_'+seller.id)" class="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold shadow-sm border whitespace-nowrap" :class="getAppBadgeClass(entry[0])">
                                                          {{ entry[1].toLocaleString() }} {{ translateUnit(entry[0]) }}
                                                      </span>
                                                  </template>
                                                  <button v-if="Object.keys(seller.unitCounts || {}).length > 3" @click.stop="toggleRowExpand('modalSellerUnitsList_'+seller.id)" class="text-[10px] text-indigo-600 font-bold hover:text-indigo-800 bg-indigo-50 px-2 py-1 rounded-md transition-colors border border-indigo-100 whitespace-nowrap">
                                                      <span v-if="!expandedRowIds.has('modalSellerUnitsList_'+seller.id)">+{{ Object.keys(seller.unitCounts).length - 3 }} ទៀត</span>
                                                      <span v-else>បង្រួម</span>
                                                  </button>
                                              </div>
                                              <span v-else class="text-[11px] font-bold text-slate-300">គ្មានការលក់</span>
                                          </td>
                                          <td class="px-4 py-3.5 text-center align-top pt-5">
                                              <span v-if="seller.hasSales" class="inline-flex items-center px-2.5 py-1 bg-amber-50 text-amber-600 rounded-lg text-[11px] font-bold border border-amber-100 shadow-sm">{{ seller.totalClients?.toLocaleString() || 0 }} នាក់</span>
                                              <span v-else class="text-[11px] text-slate-300 font-bold">-</span>
                                          </td>
                                          <td class="px-4 py-3.5 text-right align-top pt-4">
                                              <div v-if="seller.hasSales" class="flex flex-col items-end leading-tight gap-1">
                                                  <span class="text-emerald-600 font-black text-xs bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 shadow-sm">{{ seller.revenueUSD?.toLocaleString() || 0 }} $</span>
                                                  <span class="text-blue-600 font-bold text-[10px]">{{ seller.revenueKHR?.toLocaleString() || 0 }} ៛</span>
                                              </div>
                                              <span v-else class="text-[11px] text-slate-300 font-bold">-</span>
                                          </td>
                                      </template>

                                  </tr>
                              </tbody>
                          </table>
                      </div>
                  </div>

                  <div v-if="modalTotalPages > 1" class="mt-4 flex justify-between items-center bg-white p-3 rounded-2xl border border-slate-200 shadow-sm shrink-0">
                      <p class="text-[11px] font-bold text-slate-500 pl-2">
                          បង្ហាញទំព័រ {{ sellerCurrentPage }} នៃ {{ modalTotalPages }}
                      </p>
                      <div class="flex items-center gap-1">
                          <button @click="prevPage" :disabled="sellerCurrentPage === 1" class="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
                          </button>
                          <button v-for="p in modalTotalPages" :key="p" @click="goToPage(p)" class="w-8 h-8 flex items-center justify-center rounded-lg font-bold text-xs transition-colors border" :class="sellerCurrentPage === p ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'">
                              {{ p }}
                          </button>
                          <button @click="nextPage" :disabled="sellerCurrentPage === modalTotalPages" class="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                          </button>
                      </div>
                  </div>

               </div>
               
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>

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
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue';
import { TransitionRoot, TransitionChild, Dialog, DialogPanel } from '@headlessui/vue';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

// --- THE CRITICAL FIX IS HERE ---
// Added default types and empty arrays so Vue doesn't crash on length/slice calls
const props = defineProps({
  isOpen: { type: Boolean, default: false },
  admin: { type: Object, default: () => ({}) },
  sellers: { type: Array, default: () => [] },
  unitSettings: { type: Array, default: () => [] }
});

const emit = defineEmits(['close', 'error']);

const sellerViewMode = ref('list');
const sellerSearchQuery = ref('');
const sellerCurrentPage = ref(1);
const sellerItemsPerPage = 10;
const expandedRowIds = ref(new Set());
const modalActiveTab = ref('sellers');
const printStaging = ref(null);
const processing = ref({ active: false, message: '', progress: 0 });

watch(() => props.isOpen, (val) => {
    if (val) {
        sellerSearchQuery.value = '';
        sellerCurrentPage.value = 1;
        modalActiveTab.value = 'sellers';
        sellerViewMode.value = 'list';
    }
});

watch(modalActiveTab, (newTab) => {
    if (newTab === 'report') {
        sellerViewMode.value = 'list'; 
    }
});

watch(sellerSearchQuery, () => {
    sellerCurrentPage.value = 1;
});

const toggleRowExpand = (id) => {
    const newSet = new Set(expandedRowIds.value);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    expandedRowIds.value = newSet;
};

const filteredModalSellers = computed(() => {
    // Failsafe: if somehow undefined, return empty array
    if (!props.sellers) return [];
    
    if (!sellerSearchQuery.value) return props.sellers;
    const q = sellerSearchQuery.value.toLowerCase();
    return props.sellers.filter(s => 
        (s.fullName && s.fullName.toLowerCase().includes(q)) || 
        (s.idNumber && s.idNumber.toLowerCase().includes(q))
    );
});

const modalTotalPages = computed(() => {
    if(!filteredModalSellers.value || filteredModalSellers.value.length === 0) return 1;
    return Math.ceil(filteredModalSellers.value.length / sellerItemsPerPage)
});

const paginatedModalSellers = computed(() => {
    if(!filteredModalSellers.value) return [];
    const start = (sellerCurrentPage.value - 1) * sellerItemsPerPage;
    return filteredModalSellers.value.slice(start, start + sellerItemsPerPage);
});

const prevPage = () => { if (sellerCurrentPage.value > 1) sellerCurrentPage.value--; };
const nextPage = () => { if (sellerCurrentPage.value < modalTotalPages.value) sellerCurrentPage.value++; };
const goToPage = (p) => { sellerCurrentPage.value = p; };

// --- UTILITIES ---
const translateUnit = (unitVal) => {
    if (!unitVal) return '';
    const safeVal = String(unitVal);
    // Failsafe if unitSettings is undefined
    const settings = props.unitSettings || [];
    const found = settings.find(u => String(u.value) === safeVal);
    if (found) return found.label;
    const u = safeVal.toLowerCase().trim();
    if (u === 'bottle' || u === 'bottles') return 'ដប';
    if (u === 'pack' || u === 'packs') return 'កញ្ចប់';
    return safeVal; 
};

const getAppBadgeClass = (unitVal) => {
    if (!unitVal) return 'text-slate-700 bg-slate-50 border-slate-200';
    const safeVal = String(unitVal);
    const settings = props.unitSettings || [];
    const found = settings.find(u => String(u.value) === safeVal);
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
const executeAdminPrint = () => {
    const isReport = modalActiveTab.value === 'report';
    const adminName = props.admin?.fullName || 'Admin';
    const title = isReport ? `Sales_Report_${adminName}` : `Sellers_List_${adminName}`;
    const contentHTML = generateAdminPageHTML(filteredModalSellers.value, 1, 1, true);
    triggerPrint(contentHTML, title);
};

const triggerPrint = (htmlContent, title) => {
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
        <body>${htmlContent}</body>
        </html>
    `);
    doc.close();
    iframe.contentWindow.document.fonts.ready.then(() => {
        iframe.contentWindow.focus(); iframe.contentWindow.print();
        setTimeout(() => { document.body.removeChild(iframe); }, 1000);
    });
};

const generateAdminPDF = async () => {
    processing.value = { active: true, message: 'កំពុងបំបែកទិន្នន័យ...', progress: 10 };
    const isReport = modalActiveTab.value === 'report';
    
    try {
        const rowsPerPage = isReport ? 16 : 20; 
        const pages = [];
        let remaining = [...filteredModalSellers.value];
        let rowCounter = 1;
        
        while(remaining.length > 0) {
            pages.push(remaining.slice(0, rowsPerPage).map(r => ({...r, index: rowCounter++})));
            remaining = remaining.slice(rowsPerPage);
        }

        const pdf = new jsPDF('p', 'mm', 'a4'); 
        const pdfWidth = 210; 
        
        for (let i = 0; i < pages.length; i++) {
            processing.value.message = `កំពុងថតចម្លងទំព័រទី ${i+1} នៃ ${pages.length}...`;
            printStaging.value.innerHTML = generateAdminPageHTML(pages[i], i + 1, pages.length, false);
            
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
        const adminName = props.admin?.fullName || 'Admin';
        const fileName = isReport ? `Sales_Report_${adminName}.pdf` : `Sellers_List_${adminName}.pdf`;
        pdf.save(fileName);
        
    } catch(e) {
        console.error(e);
        emit('error', 'បរាជ័យ', 'មិនអាចទាញយក PDF បានទេ');
    } finally {
        if(printStaging.value) printStaging.value.innerHTML = '';
        processing.value.active = false;
    }
};

const generateAdminPageHTML = (rows, pageNum, totalPages, isNativePrint = false) => {
    const isReport = modalActiveTab.value === 'report';

    const rowsHTML = rows.map((item) => {
        if (isReport) {
            let salesHTML = item.hasSales ? 
                `<div style="display: flex; flex-direction: column; gap: 4px;">` + 
                Object.entries(item.unitCounts || {}).map(([u, c]) => 
                    `<div style="display: flex; justify-content: space-between; font-size: 13px; border-bottom: 1px solid #f1f5f9; padding-bottom: 2px;">
                        <span style="color: #475569;">${translateUnit(u)}</span>
                        <span style="font-weight: 900; color: #1e293b;">${c.toLocaleString()}</span>
                     </div>`
                ).join('') + `</div>` : `<span style="color:#94a3b8; font-size:12px; font-weight:bold;">គ្មានការលក់</span>`;
                
            let revHTML = item.hasSales ? 
                `<div style="text-align: right; font-size:12px;"><b style="color:#059669; font-size:16px;">${item.revenueUSD?.toLocaleString() || 0} $</b><br/><b style="color:#2563eb; font-size:13px;">${item.revenueKHR?.toLocaleString() || 0} ៛</b></div>` : 
                `<div style="text-align: right; color:#94a3b8; font-weight:bold; font-size:16px;">-</div>`;

            return `
                <tr style="border-bottom: 1px solid #e2e8f0; break-inside: avoid; page-break-inside: avoid; ${!item.hasSales ? 'background-color: #f8fafc;' : ''}">
                    <td style="padding: 14px 10px; text-align: center; vertical-align: top; color: #94a3b8; font-weight: 900;">${item.index || rows.indexOf(item) + 1}</td>
                    <td style="padding: 14px 10px; vertical-align: top;">
                        <p style="font-weight: bold; color: #1e293b; font-size: 16px; margin: 0;">${item.fullName}</p>
                        <p style="font-family: monospace; color: #64748b; font-size: 12px; margin: 4px 0 0 0;">ID: ${item.idNumber || 'N/A'}</p>
                    </td>
                    <td style="padding: 14px 10px; vertical-align: top;">${salesHTML}</td>
                    <td style="padding: 14px 10px; text-align: center; vertical-align: top; font-weight: bold; color: #334155; font-size: 16px;">${item.hasSales ? (item.totalClients || 0) + ' នាក់' : '-'}</td>
                    <td style="padding: 14px 10px; vertical-align: top;">${revHTML}</td>
                </tr>
            `;
        } else {
            return `
                <tr style="border-bottom: 1px solid #e2e8f0; break-inside: avoid; page-break-inside: avoid;">
                    <td style="padding: 16px; text-align: center; vertical-align: middle; font-weight: 900; color: #94a3b8; font-size: 16px;">${item.index || rows.indexOf(item) + 1}</td>
                    <td style="padding: 16px; vertical-align: middle;">
                        <p style="font-weight: bold; color: #1e293b; font-size: 16px; margin: 0;">${item.fullName}</p>
                    </td>
                    <td style="padding: 16px; text-align: center; vertical-align: middle; font-weight: bold; color: #475569; font-size: 14px;">${item.idNumber || '-'}</td>
                    <td style="padding: 16px; text-align: center; vertical-align: middle; font-weight: bold; color: #475569; font-size: 14px;">${item.phoneNumber || '-'}</td>
                </tr>
            `;
        }
    }).join('');

    const pageStyles = isNativePrint
        ? `width: 100%; box-sizing: border-box; font-family: 'Battambong', 'Kantumruy Pro', sans-serif; line-height: 1.6; padding: 20px;`
        : `width: 1000px; min-height: 1414px; background: white; padding: 40px; box-sizing: border-box; display: flex; flex-direction: column; font-family: 'Battambong', 'Kantumruy Pro', sans-serif; line-height: 1.6;`;

    const titleText = isReport ? 'របាយការណ៍លក់របស់តំណាងលក់' : 'បញ្ជីរាយនាមតំណាងលក់';

    const thHTML = isReport ? `
        <th style="padding: 18px 16px; width: 40px; text-align: center;">#</th>
        <th style="padding: 18px 16px; width: 35%;">តំណាងលក់</th>
        <th style="padding: 18px 16px; width: 25%;">ចំនួនលក់ (Units)</th>
        <th style="padding: 18px 16px; width: 15%; text-align: center;">អតិថិជន</th>
        <th style="padding: 18px 16px; width: 25%; text-align: right;">ចំណូល</th>
    ` : `
        <th style="padding: 18px 16px; width: 40px; text-align: center;">#</th>
        <th style="padding: 18px 16px;">តំណាងលក់</th>
        <th style="padding: 18px 16px; text-align: center;">អត្តលេខ</th>
        <th style="padding: 18px 16px; text-align: center;">លេខទូរស័ព្ទ</th>
    `;

    return `
        <div class="print-page" style="${pageStyles}">
            
            <div style="text-align: center; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 3px solid #4f46e5;">
                <h1 style="font-size: 30px; font-weight: 900; color: #4338ca; margin: 0; text-align: center; width: 100%;">${titleText}</h1>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; background-color: #f8fafc; padding: 20px; border-radius: 12px; margin-bottom: 25px; border: 1px solid #e2e8f0; break-inside: avoid; page-break-inside: avoid;">
                <div style="display: flex; gap: 15px; align-items: center;">
                    <div>
                        <p style="font-size: 12px; color: #64748b; font-weight: bold; text-transform: uppercase; margin: 0 0 5px 0;">អ្នកគ្រប់គ្រង (Admin)</p>
                        <h2 style="font-size: 24px; font-weight: 900; color: #0f172a; margin: 0;">${props.admin?.fullName || 'N/A'}</h2>
                        <p style="font-size: 14px; color: #3b82f6; font-weight: bold; margin: 5px 0 0 0;">@${props.admin?.username || 'N/A'} ${props.admin?.telegram ? `| Tel: ${props.admin.telegram}` : ''}</p>
                    </div>
                </div>
            </div>

            <div style="flex: 1;">
                <table style="width: 100%; text-align: left; border-collapse: collapse; background-color: #ffffff;">
                    <thead style="color: #334155; font-size: 14px; font-weight: 900; border-bottom: 2px solid #cbd5e1; display: table-header-group;">
                        <tr>
                            ${thHTML}
                        </tr>
                    </thead>
                    <tbody>
                        ${rowsHTML}
                    </tbody>
                </table>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 25px; padding-top: 15px; font-size: 12px; font-weight: bold; color: #94a3b8; break-inside: avoid; page-break-inside: avoid;">
                <div>
                   ថ្ងៃបញ្ចេញរបាយការណ៍ • ${new Date().toLocaleString('km-KH')}
                </div>
                <div>
                   ${isNativePrint ? '' : `ទំព័រទី ${pageNum} នៃ ${totalPages}`}
                </div>
            </div>
        </div>
    `;
};
</script>