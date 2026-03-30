<template>
  <div class="w-full flex flex-col gap-6 animate-fade-in-up pb-24 relative font-khmer">
        
        <PosTodayFilters 
            :filterType="filterType"
            :paymentFilter="paymentFilter"
            :specificDate="specificDate"
            :startDate="startDate"
            :endDate="endDate"
            :searchQuery="searchQuery"
            :selectedMonth="selectedMonth"
            :selectedYear="selectedYear"
            :availableMonths="availableMonths"
            :availableYears="availableYears"
            :showSummaryCards="showSummaryCards"
            :hasData="filteredSales.length > 0"
            :totalStats="totalStats"
            :validSalesCount="validSales.length"
            @updateFilterType="setFilterType"
            @updatePaymentFilter="setPaymentFilter"
            @update:specificDate="specificDate = $event"
            @update:startDate="startDate = $event"
            @update:endDate="endDate = $event"
            @update:searchQuery="searchQuery = $event"
            @update:selectedMonth="selectedMonth = $event"
            @update:selectedYear="selectedYear = $event"
            @toggleSummaryCards="showSummaryCards = !showSummaryCards"
            @handlePrint="handlePrint"
            @handlePDF="handlePDF"
        />

        <div v-if="isLoading && allSales.length === 0" class="flex flex-col items-center justify-center py-24 opacity-60 print:hidden">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-indigo-600 mb-4"></div>
            <p class="text-slate-500 font-bold tracking-wide text-sm">កំពុងទាញយកទិន្នន័យ...</p>
        </div>

        <div v-else-if="paginatedSales.length === 0" class="py-24 bg-white/50 backdrop-blur-sm rounded-[24px] border border-dashed border-slate-200 text-center animate-fade-in print:hidden shadow-sm">
            <div class="w-16 h-16 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            </div>
            <p class="text-lg font-black text-slate-600">មិនមានទិន្នន័យទេ</p>
            <p class="text-sm text-slate-400 mt-1 font-bold">សូមសាកល្បងប្តូរការស្វែងរក ស្ថានភាព ឬកាលបរិច្ឆេទ</p>
        </div>

        <div v-else class="flex flex-col gap-3 relative z-10">
            <PosTodaySalesList 
                :sales="paginatedSales"
                :totalAmountUSD="totalAmountUSD"
                @action="handleAction"
            />

            <div v-if="totalPages > 1" class="flex flex-col sm:flex-row items-center justify-between mt-4 bg-white p-4 rounded-[20px] shadow-sm border border-slate-200 print:hidden relative z-20">
                <span class="text-xs font-bold text-slate-500">
                    បង្ហាញ <span class="text-slate-800">{{ ((currentPage - 1) * itemsPerPage) + 1 }}</span> ទៅ <span class="text-slate-800">{{ Math.min(currentPage * itemsPerPage, filteredSales.length) }}</span> (ទំព័រ {{ currentPage }} នៃ {{ totalPages }})
                </span>
                <div class="flex gap-2 mt-3 sm:mt-0">
                    <button @click="prevPage" :disabled="currentPage === 1" class="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed font-black text-xs transition-colors">មុន</button>
                    <button @click="nextPage" :disabled="currentPage === totalPages" class="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed font-black text-xs transition-colors">បន្ទាប់</button>
                </div>
            </div>
        </div>

        <transition enter-active-class="transition duration-300 ease-out origin-top" enter-from-class="transform scale-y-95 opacity-0" enter-to-class="transform scale-y-100 opacity-100" leave-active-class="transition duration-200 ease-in origin-top" leave-from-class="transform scale-y-100 opacity-100" leave-to-class="transform scale-y-95 opacity-0">
            <div v-show="showSummaryCards" class="grid grid-cols-1 md:grid-cols-3 gap-5 print:hidden">
                <div class="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-[20px] p-6 text-white shadow-lg shadow-blue-500/20 relative overflow-hidden">
                    <div class="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
                    <div class="relative z-10 flex flex-col h-full justify-between">
                        <p class="text-blue-100 text-[12px] font-black uppercase tracking-widest mb-1 flex items-center gap-2">ចំណូលទំនិញសុទ្ធ (Products)</p>
                        <h3 class="text-3xl font-black">{{ formatCurrency(totalStats.productsUSD) }}</h3>
                        <p class="text-sm font-bold opacity-90 mt-1">{{ totalStats.productsKHR.toLocaleString() }} ៛</p>
                    </div>
                </div>
                <div class="bg-gradient-to-br from-orange-400 to-rose-500 rounded-[20px] p-6 text-white shadow-lg shadow-rose-500/20 relative overflow-hidden">
                    <div class="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
                    <div class="relative z-10 flex flex-col h-full justify-between">
                        <p class="text-orange-100 text-[12px] font-black uppercase tracking-widest mb-1 flex items-center gap-2">ថ្លៃដឹកជញ្ជូនសរុប (Delivery)</p>
                        <h3 class="text-3xl font-black">{{ formatCurrency(totalStats.deliveryUSD) }}</h3>
                        <p class="text-sm font-bold opacity-90 mt-1">{{ totalStats.deliveryKHR.toLocaleString() }} ៛</p>
                    </div>
                </div>
                <div class="bg-white rounded-[20px] p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
                    <div class="flex items-center justify-between mb-4">
                        <p class="text-slate-400 text-[12px] font-black uppercase tracking-widest">អតិថិជនសរុប (CLIENTS)</p>
                        <div class="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-[14px] flex items-center justify-center">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                        </div>
                    </div>
                    <div>
                        <h3 class="text-3xl font-black text-slate-800">{{ validSalesCount }} <span class="text-sm text-slate-400 font-bold">នាក់ / វិក្កយបត្រ</span></h3>
                        <div class="flex gap-2 mt-3 pt-3 border-t border-slate-100">
                            <span class="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">ភ្នំពេញ: <span class="text-indigo-600">{{ totalStats.ppClients }} នាក់</span></span>
                            <span class="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">តាមខេត្ត: <span class="text-amber-600">{{ totalStats.provClients }} នាក់</span></span>
                        </div>
                    </div>
                </div>
            </div>
        </transition>

        <Teleport to="body">
            
            <div v-if="paidModal.isOpen" class="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in font-khmer print:hidden">
                <div class="bg-white rounded-[24px] w-full max-w-md shadow-2xl overflow-hidden animate-slide-up flex flex-col m-auto border border-white/20">
                    <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
                        <h3 class="text-lg font-black text-emerald-600 flex items-center gap-2">
                            <div class="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center border border-emerald-100">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            បញ្ជាក់ការទទួលប្រាក់
                        </h3>
                        <button @click="paidModal.isOpen = false" class="text-slate-400 hover:text-rose-500 bg-slate-50 hover:bg-rose-50 w-8 h-8 flex items-center justify-center rounded-full transition-colors"><svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                    </div>
                    <div class="p-6 space-y-5 bg-[#f8fafc]">
                        <p class="text-sm font-bold text-slate-600 leading-relaxed">វិក្កយបត្រនេះនឹងត្រូវប្តូរស្ថានភាពទៅជា <span class="text-emerald-600 font-black">"បានទូទាត់រួច (PAID)"</span>។ សូមពិនិត្យកាលបរិច្ឆេទខាងក្រោម៖</p>
                        
                        <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                            <label class="block text-[12px] font-black text-slate-700 mb-2">កាលបរិច្ឆេទវិក្កយបត្រថ្មី</label>
                            <input type="datetime-local" v-model="paidModal.newDate" @change="checkPaidDate" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-black text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all">
                        </div>

                        <div v-if="paidModal.showWarning" class="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3 shadow-sm animate-fade-in">
                            <svg class="w-6 h-6 text-amber-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                            <div>
                                <h4 class="text-[12px] font-black text-amber-800 uppercase tracking-widest mb-1">ព្រមានការផ្លាស់ប្តូរ</h4>
                                <p class="text-[11px] font-bold text-amber-700 leading-relaxed">
                                    ការប្តូរកាលបរិច្ឆេទនឹងមានផលប៉ះពាល់ដល់របាយការណ៍សរុប។ តើអ្នកប្រាកដថាចង់ប្តូរមែនទេ?
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="px-6 py-4 bg-white border-t border-slate-100 flex justify-end gap-3">
                        <button @click="paidModal.isOpen = false" class="px-6 py-3 rounded-xl font-bold text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors">បោះបង់</button>
                        <button @click="confirmMarkAsPaid" :disabled="isUpdatingPaid" class="px-8 py-3 rounded-xl font-black text-white bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all active:scale-95 flex items-center gap-2">
                            <svg v-if="isUpdatingPaid" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            យល់ព្រម
                        </button>
                    </div>
                </div>
            </div>

            <div v-if="editModal.isOpen" class="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6 pt-[3vh] pb-[3vh] bg-slate-900/60 backdrop-blur-sm animate-fade-in font-khmer print:hidden">
                <div class="bg-[#f8fafc] rounded-[24px] w-full max-w-3xl shadow-2xl flex flex-col h-[90vh] overflow-hidden animate-slide-up border border-white/20">
                    
                    <div class="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-white shrink-0">
                        <div>
                            <h3 class="font-black text-slate-800 text-lg flex items-center gap-2">
                                <div class="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                                </div>
                                កែប្រែវិក្កយបត្រ 
                            </h3>
                            <p class="text-[11px] font-bold text-slate-500 font-mono mt-1 sm:ml-10">#{{ editModal.receiptId }}</p>
                        </div>
                        <button @click="editModal.isOpen = false" class="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg></button>
                    </div>

                    <div class="flex items-center justify-center px-6 py-3 border-b border-slate-100 bg-white shrink-0">
                        <div class="flex items-center gap-2" :class="editModal.step === 1 ? 'text-indigo-600' : 'text-slate-400'">
                            <span class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black transition-colors" :class="editModal.step === 1 ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30' : 'bg-slate-100 text-slate-500'">1</span>
                            <span class="text-[13px] font-black hidden sm:block">ព័ត៌មានទូទៅ</span>
                        </div>
                        <div class="w-12 sm:w-20 h-0.5 mx-4 rounded-full transition-colors" :class="editModal.step === 2 ? 'bg-indigo-500' : 'bg-slate-200'"></div>
                        <div class="flex items-center gap-2" :class="editModal.step === 2 ? 'text-indigo-600' : 'text-slate-400'">
                            <span class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black transition-colors" :class="editModal.step === 2 ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30' : 'bg-slate-100 text-slate-500'">2</span>
                            <span class="text-[13px] font-black hidden sm:block">ទំនិញ & ការទូទាត់</span>
                        </div>
                    </div>
                    
                    <div class="p-5 sm:p-6 flex-1 overflow-y-auto custom-scrollbar">
                        
                        <div v-show="editModal.step === 1" class="flex flex-col gap-4 animate-fade-in w-full max-w-2xl mx-auto">
                            <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                                <label class="block text-[12px] font-black text-indigo-600 mb-2 flex items-center gap-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> កាលបរិច្ឆេទវិក្កយបត្រ (Invoice Date)</label>
                                <input type="datetime-local" v-model="editForm.createdAt" @change="checkEditDate" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-black text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all">
                                
                                <div v-if="editModal.showDateWarning" class="mt-3 bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-start gap-3 animate-fade-in">
                                    <svg class="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                    <p class="text-[11px] font-bold text-amber-700 leading-relaxed">ព្រមាន៖ ការផ្លាស់ប្តូរកាលបរិច្ឆេទអាចធ្វើឲ្យរបាយការណ៍មានភាពរអាក់រអួល។ តើអ្នកប្រាកដទេ?</p>
                                </div>
                            </div>

                            <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
                                <div class="flex justify-between items-center border-b border-slate-100 pb-3 mb-1">
                                    <h4 class="font-black text-slate-800 text-sm">ព័ត៌មានអតិថិជន & អ្នកលក់</h4>
                                    <button @click="editForm.customerName = 'អតិថិជនទិញផ្ទាល់'; editForm.customerPhone = ''; editForm.province = ''; editForm.district = '';" type="button" class="text-[10px] font-black text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors border border-indigo-100">
                                        + ដាក់ជា "អតិថិជនទិញផ្ទាល់"
                                    </button>
                                </div>

                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div class="sm:col-span-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                                        <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">តំណាងលក់ (Seller)</label>
                                        <select v-model="editForm.sellerName" class="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500/20 outline-none cursor-pointer">
                                            <option value="">-- មិនមានតំណាងលក់ (លក់ផ្ទាល់) --</option>
                                            <option v-for="s in sellers" :key="s.id" :value="s.fullName">{{ s.fullName }}</option>
                                        </select>
                                    </div>

                                    <div v-if="editForm.customerName === 'អតិថិជនទិញផ្ទាល់' || editForm.customerName === 'ទូទៅ'" class="sm:col-span-2 bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center">
                                        <div class="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                        </div>
                                        <h4 class="font-black text-emerald-800 text-sm">អតិថិជនទិញផ្ទាល់ (Walk-in Customer)</h4>
                                        <p class="text-[11px] text-emerald-600 mt-1 font-bold">មិនតម្រូវឲ្យបញ្ជាក់ លេខទូរស័ព្ទ ឬ ទីតាំង នោះទេ។</p>
                                        <button @click="editForm.customerName = ''" type="button" class="mt-4 px-4 py-2 bg-white border border-emerald-300 text-emerald-700 text-[11px] font-black rounded-lg shadow-sm hover:bg-emerald-100 transition-colors">
                                            ប្តូរទៅជាអតិថិជនធម្មតា
                                        </button>
                                    </div>

                                    <template v-else>
                                        <div class="sm:col-span-2">
                                            <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5" :class="{'text-amber-500': !editForm.customerName}">ឈ្មោះអតិថិជន *</label>
                                            <input v-model="editForm.customerName" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" :class="{'border-amber-300 bg-amber-50': !editForm.customerName}">
                                        </div>
                                        <div class="sm:col-span-2">
                                            <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5" :class="{'text-amber-500': !editForm.customerPhone}">លេខទូរស័ព្ទ *</label>
                                            <input v-model="editForm.customerPhone" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" :class="{'border-amber-300 bg-amber-50': !editForm.customerPhone}">
                                        </div>
                                        <div>
                                            <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5" :class="{'text-amber-500': !editForm.province}">ខេត្ត/ក្រុង *</label>
                                            <input v-model="editForm.province" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" :class="{'border-amber-300 bg-amber-50': !editForm.province}">
                                        </div>
                                        <div>
                                            <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">សាខា (ស្រុក/ខណ្ឌ)</label>
                                            <input v-model="editForm.district" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all">
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </div>

                    <div v-show="editModal.step === 2" class="flex flex-col gap-4 animate-fade-in w-full mx-auto">
                        
                        <div class="bg-indigo-50/50 border border-indigo-100 p-4 sm:p-5 rounded-2xl shadow-sm relative z-20">
                            <p class="text-[12px] font-black text-indigo-700 mb-3 uppercase tracking-widest flex items-center gap-2">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
                                ស្វែងរកទំនិញបន្ថែម
                            </p>
                            <div class="relative">
                                <svg class="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                                <input v-model="miniPosSearchQuery" type="text" placeholder="ស្វែងរកឈ្មោះ ឬ Barcode..." class="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3.5 text-sm font-bold focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 outline-none shadow-sm transition-all">
                                
                                <div v-if="miniPosSearchQuery && filteredMiniPosProducts.length > 0" class="absolute top-full left-0 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl max-h-60 overflow-y-auto z-50 p-2 custom-scrollbar">
                                    <div v-for="prod in filteredMiniPosProducts" :key="prod.id" @click="addItemToEditForm(prod)" class="p-2.5 rounded-lg hover:bg-indigo-50 cursor-pointer flex justify-between items-center transition-colors mb-1 border border-transparent hover:border-indigo-100">
                                        <div class="flex items-center gap-3">
                                            <div class="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden shrink-0 border border-slate-200">
                                                <img v-if="prod.image" :src="prod.image" class="w-full h-full object-cover">
                                                <span v-else class="text-xs text-slate-400 font-bold">{{ prod.name ? prod.name.charAt(0) : '?' }}</span>
                                            </div>
                                            <div>
                                                <p class="text-sm font-black text-slate-800 line-clamp-1">{{ prod.name }}</p>
                                                <p class="text-[10px] font-bold text-slate-500">{{ prod.retailPrice }}$</p>
                                            </div>
                                        </div>
                                        <button class="bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-black hover:bg-indigo-600 transition-colors shadow-sm">បញ្ចូល</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div v-if="editForm.items.length === 0" class="text-center py-8 bg-white border border-dashed border-slate-200 rounded-2xl shadow-sm">
                            <p class="text-slate-400 font-black text-sm">មិនមានទំនិញទេ!</p>
                        </div>

                        <div class="flex flex-col gap-2">
                            <div v-for="(item, index) in editForm.items" :key="index" class="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 hover:border-indigo-300 transition-colors relative group shadow-sm">
                                <button @click="removeItemFromEdit(index)" class="absolute -top-2.5 -right-2.5 w-7 h-7 bg-white border border-rose-200 text-rose-500 rounded-full shadow-md flex items-center justify-center hover:bg-rose-500 hover:text-white transition-colors opacity-100 sm:opacity-0 group-hover:opacity-100 z-10"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg></button>

                                <div class="flex-1 min-w-0 w-full pr-4 sm:pr-0">
                                    <p class="font-black text-sm text-slate-800 leading-tight mb-1.5 line-clamp-1">{{ item.name }}</p>
                                    <p class="text-[11px] font-bold text-slate-500 flex gap-2">
                                        <span class="bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded-md">{{ checkIsWholesale(item.type) ? 'បោះដុំ' : 'លក់រាយ' }}</span>
                                        <span class="bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded-md uppercase">{{ translateUnit(item.unit) }}</span>
                                    </p>
                                </div>
                                
                                <div class="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                                    <div class="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden h-10 w-[100px]">
                                        <span class="px-2.5 text-xs font-black text-slate-400 border-r border-slate-200 bg-white">$</span>
                                        <input v-model.number="item.price" type="number" step="any" min="0" class="w-full h-full bg-transparent border-none text-sm font-black text-slate-800 text-center focus:ring-0 px-1 outline-none">
                                    </div>
                                    <span class="text-slate-300 font-bold text-xs hidden sm:block">x</span>
                                    <div class="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden h-10 shadow-sm w-[110px]">
                                        <button @click="decreaseEditQty(item)" type="button" class="w-10 h-full bg-slate-50 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center justify-center font-black border-r border-slate-200 text-lg">−</button>
                                        <input v-model.number="item.qty" @input="recalculateEditItem(item)" type="number" min="1" class="w-full h-full text-center bg-transparent border-none font-black text-sm text-slate-800 focus:ring-0 p-0 outline-none">
                                        <button @click="increaseEditQty(item)" type="button" class="w-10 h-full bg-slate-50 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center justify-center font-black border-l border-slate-200 text-lg">+</button>
                                    </div>
                                    <div class="w-full sm:w-[90px] text-right sm:text-center mt-2 sm:mt-0">
                                        <span class="font-black text-emerald-600 text-sm bg-emerald-50 px-2 py-1.5 rounded-lg border border-emerald-100 inline-block">{{ (Number(item.price||0) * Number(item.qty||0)).toLocaleString() }} $</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4 mt-2">
                            <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                <div>
                                    <label class="block text-[11px] font-black text-orange-600 uppercase tracking-widest mb-1.5">ថ្លៃដឹកជញ្ជូន</label>
                                    <div class="flex items-center gap-2">
                                        <input v-model.number="editForm.deliveryFee" type="number" step="any" min="0" class="w-full bg-orange-50/50 border border-orange-100 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all">
                                        <select v-model="editForm.deliveryCurrency" class="bg-orange-50/50 border border-orange-100 rounded-xl px-2 py-2.5 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-orange-500/20 outline-none cursor-pointer w-20">
                                            <option value="USD">USD</option>
                                            <option value="KHR">KHR</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">វិធីទូទាត់</label>
                                    <select v-model="editForm.paymentMethod" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none cursor-pointer">
                                        <option value="CASH">សាច់ប្រាក់</option>
                                        <option value="KHQR">វេរប្រាក់ (KHQR)</option>
                                        <option value="BANK">ធនាគារ</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">ស្ថានភាព</label>
                                    <select v-model="editForm.paymentStatus" class="w-full rounded-xl px-4 py-2.5 text-sm font-bold outline-none cursor-pointer border" :class="editForm.paymentStatus === 'PAID' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-amber-700 bg-amber-50 border-amber-200'">
                                        <option value="PAID">ទូទាត់រួច (PAID)</option>
                                        <option value="PENDING">ជំពាក់ (PENDING)</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">ចំណាំបន្ថែម (Note)</label>
                                <input v-model="editForm.paymentNote" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all">
                            </div>
                        </div>

                        <div class="bg-indigo-600 p-5 rounded-2xl shadow-lg shadow-indigo-500/30 flex flex-col gap-3 text-white mt-1">
                            <div class="flex justify-between items-center text-sm font-bold text-indigo-200">
                                <span>តម្លៃទំនិញសរុប:</span>
                                <span>{{ editFormProductsTotal.toLocaleString() }} $</span>
                            </div>
                            <div class="flex justify-between items-center text-sm font-bold text-orange-300">
                                <span>ថ្លៃដឹកជញ្ជូន:</span>
                                <span>{{ (editForm.deliveryFee || 0).toLocaleString() }} {{ editForm.deliveryCurrency === 'USD' ? '$' : '៛' }}</span>
                            </div>
                            <div class="flex justify-between items-end border-t border-indigo-500 pt-3 mt-1">
                                <span class="font-black text-indigo-100 text-sm uppercase tracking-widest">សរុបរួម (Grand Total)</span>
                                <span class="font-black text-3xl leading-none text-white">
                                    {{ (editFormProductsTotal + (editForm.deliveryCurrency === 'USD' ? Number(editForm.deliveryFee || 0) : 0)).toLocaleString() }} $
                                    <span v-if="editForm.deliveryCurrency === 'KHR' && editForm.deliveryFee > 0" class="text-sm font-bold text-orange-300 block text-right mt-1">+ {{ editForm.deliveryFee }} ៛</span>
                                </span>
                            </div>
                        </div>

                    </div>
                </div>
                
                <div class="px-6 py-4 border-t border-slate-200 bg-white shrink-0 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <button v-if="editModal.step === 1" @click="editModal.isOpen = false" class="w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-bold text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors">បោះបង់</button>
                    <button v-if="editModal.step === 2" @click="editModal.step = 1" class="w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-bold text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors flex items-center justify-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/></svg> ត្រឡប់ក្រោយ
                    </button>

                    <button v-if="editModal.step === 1" @click="editModal.step = 2" class="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-black text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all active:scale-95 flex items-center justify-center gap-2">
                        បន្ទាប់ទៀត (Next) <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
                    </button>
                    <button v-if="editModal.step === 2" @click="saveEdit" :disabled="isSaving || editForm.items.length === 0" class="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-black text-white bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/30 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
                        <svg v-if="isSaving" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                        រក្សាទុកការកែប្រែ (Save)
                    </button>
                </div>
            </div>
        </div>

        <transition enter-active-class="duration-300 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="showIdModal" class="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm print:hidden font-khmer">
                <div class="bg-white rounded-[24px] w-full max-w-sm p-6 shadow-2xl border border-slate-100 animate-slide-up relative overflow-hidden">
                    <div class="absolute -top-10 -right-10 w-32 h-32 bg-fuchsia-50 rounded-full blur-2xl"></div>
                    <div class="flex justify-between items-center mb-5 relative z-10">
                        <h3 class="font-black text-lg text-slate-800 flex items-center gap-2">
                            <svg class="w-5 h-5 text-fuchsia-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg> Database ID
                        </h3>
                        <button @click="showIdModal = false" class="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-1.5 rounded-xl transition-colors"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
                    </div>
                    <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 text-center shadow-inner relative z-10">
                        <p class="font-mono font-black text-fuchsia-600 text-[15px] break-all select-all">{{ selectedDatabaseId }}</p>
                    </div>
                    <div class="grid grid-cols-2 gap-3 relative z-10">
                        <button @click="copyDatabaseId" class="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold text-xs transition-colors active:scale-95 border border-slate-200"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg> ចំលង</button>
                        <button @click="shareIdToTelegram" class="flex items-center justify-center gap-2 bg-[#0088cc] hover:bg-[#0077b5] text-white py-3 rounded-xl font-bold text-xs transition-colors active:scale-95 shadow-md shadow-blue-500/20"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.48-.94-2.4-1.54-1.06-.7-.37-1.09.23-1.72.16-.16 2.87-2.63 2.92-2.85.01-.03.01-.14-.06-.2-.06-.06-.17-.04-.25-.02-.11.02-1.91 1.2-5.39 3.55-.5.34-.95.51-1.35.5-.44-.01-1.29-.25-1.92-.42-.77-.21-1.37-.32-1.31-.68.03-.18.28-.37.76-.56 3.03-1.32 5.06-2.19 6.09-2.62 2.93-1.21 3.53-1.43 3.93-1.43.09 0 .28.01.4.04.1.03.24.1.33.25.08.16.07.32.07.33z"/></svg> Telegram</button>
                    </div>
                </div>
            </div>
        </transition>

        <div v-if="cancelModal.isOpen" class="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in print:hidden font-khmer">
            <div class="bg-white rounded-[24px] w-full max-w-md shadow-2xl overflow-hidden animate-slide-up flex flex-col">
                <div class="px-6 py-5 border-b border-rose-100 bg-rose-50 flex items-center justify-between">
                    <h3 class="text-lg font-black text-rose-700">បញ្ជាក់ការបោះបង់វិក្កយបត្រ</h3>
                    <button @click="closeCancelModal" class="text-rose-400 hover:text-rose-600"><svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
                <div class="p-6">
                    <textarea v-model="cancelReason" rows="3" placeholder="មូលហេតុនៃការបោះបង់..." class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-bold text-sm focus:ring-2 focus:ring-rose-500/20 outline-none resize-none"></textarea>
                </div>
                <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                    <button @click="closeCancelModal" class="px-6 py-2.5 rounded-xl font-bold text-slate-600 bg-white border border-slate-300 hover:bg-slate-100 transition-colors">បិទវិញ</button>
                    <button @click="confirmCancel" :disabled="isCanceling" class="px-6 py-2.5 rounded-xl font-black text-white bg-rose-600 hover:bg-rose-700 transition-colors flex items-center gap-2">
                        <svg v-if="isCanceling" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        បាទ, បោះបង់
                    </button>
                </div>
            </div>
        </div>

        <div v-if="deleteModal.isOpen" class="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in print:hidden font-khmer">
            <div class="bg-white rounded-[24px] w-full max-w-sm shadow-2xl overflow-hidden animate-slide-up text-center p-6 md:p-8">
                <div class="w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </div>
                <h3 class="text-xl font-black text-slate-800 mb-2">តើអ្នកពិតជាចង់លុបមែនទេ?</h3>
                <p class="text-xs font-bold text-slate-500">ទិន្នន័យដែលលុបរួចមិនអាចទាញយកវិញបានទេ។</p>
                <div class="flex items-center gap-3 mt-6">
                    <button @click="deleteModal.isOpen = false" class="flex-1 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">បោះបង់</button>
                    <button @click="executeDelete" :disabled="isDeleting" class="flex-1 py-3 rounded-xl font-black text-white bg-rose-500 hover:bg-rose-600 transition-colors flex items-center justify-center gap-2">
                        <svg v-if="isDeleting" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        យល់ព្រមលុប
                    </button>
                </div>
            </div>
        </div>
        </Teleport>

        <transition enter-active-class="duration-300 ease-out" enter-from-class="opacity-0 translate-y-10" enter-to-class="opacity-100 translate-y-0" leave-active-class="duration-200 ease-in" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-10">
            <div v-if="fetchTimer.show" class="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] bg-slate-900/90 backdrop-blur-md border border-slate-700 text-white px-5 py-3.5 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] flex items-center gap-3 pointer-events-none print:hidden font-khmer">
                <div class="animate-spin h-5 w-5 border-2 border-indigo-400 border-t-transparent rounded-full"></div>
                <span class="text-sm font-bold tracking-wide">កំពុងទាញទិន្នន័យ...</span>
                <span class="text-[13px] text-indigo-300 font-mono font-black bg-slate-800 px-2 py-0.5 rounded border border-indigo-500/30 w-[45px] text-center">
                    {{ fetchTimer.seconds.toFixed(1) }}s
                </span>
            </div>
        </transition>

        <div ref="invoiceStaging" class="fixed top-0 left-[-9999px] pointer-events-none z-[-1] opacity-0 print:opacity-100 bg-white"></div>
        <div ref="printStaging" class="fixed top-0 left-[-9999px] pointer-events-none z-[-1] opacity-0 print:opacity-100 bg-white w-[1000px]"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, reactive, nextTick } from 'vue';
import { db, auth } from '@/firebaseConfig';
import { doc, getDoc, collection, query, where, onSnapshot, getDocs, updateDoc, increment, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

// 🌟 Import Child Components 🌟
import PosTodayFilters from './PosTodayFilters.vue';
import PosTodaySalesList from './PosTodaySalesList.vue';

const emit = defineEmits(['triggerAlert']);

const isLoading = ref(true);
const allSales = ref([]);
const availableUnits = ref([]);
const invoiceStaging = ref(null);
const printStaging = ref(null);
const processing = ref({ active: false, message: '', progress: 0 });

const showSummaryCards = ref(false);

const filterType = ref('today');
const paymentFilter = ref('ALL'); 
const searchQuery = ref('');
const specificDate = ref(new Date().toISOString().split('T')[0]);
const startDate = ref(new Date().toISOString().split('T')[0]);
const endDate = ref(new Date().toISOString().split('T')[0]);

const availableMonths = computed(() => ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'].map((name, index) => ({ index, name })));
const availableYears = computed(() => { const currentYear = new Date().getFullYear(); return [currentYear - 2, currentYear - 1, currentYear, currentYear + 1]; });
const selectedMonth = ref(new Date().getMonth());
const selectedYear = ref(new Date().getFullYear());

const currentPage = ref(1);
const itemsPerPage = computed(() => filterType.value === 'today' ? 5 : 20); 

const sellers = ref([]); 
const availableProducts = ref([]);
const miniPosSearchQuery = ref('');

let unsubscribeSales = null;
let currentUserId = null;

const formatCurrency = (val) => {
    return Number(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " $";
};

const setFilterType = (type) => {
    filterType.value = type;
    currentPage.value = 1;
};

const setPaymentFilter = (type) => {
    paymentFilter.value = type;
    currentPage.value = 1;
};

const getTodayString = () => { 
    const today = new Date(); 
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`; 
};

const checkIsWholesale = (typeStr) => {
    if (!typeStr) return false;
    const str = String(typeStr).toLowerCase();
    return str.includes('បោះដុំ') || str.includes('wholesale');
};

const fetchTimer = reactive({ show: false, seconds: 0, interval: null });

const startFetchTimer = () => {
    fetchTimer.show = true;
    fetchTimer.seconds = 0;
    if (fetchTimer.interval) clearInterval(fetchTimer.interval);
    fetchTimer.interval = setInterval(() => { fetchTimer.seconds += 0.1; }, 100);
};

const stopFetchTimer = () => {
    fetchTimer.show = false;
    if (fetchTimer.interval) clearInterval(fetchTimer.interval);
};

const getDateRangeISO = () => {
    let start, end;
    const createDateBounds = (dateString) => {
        const [year, month, day] = dateString.split('-').map(Number);
        const startDay = new Date(year, month - 1, day, 0, 0, 0);
        const endDay = new Date(year, month - 1, day, 23, 59, 59, 999);
        return { startDay, endDay };
    };

    if (filterType.value === 'today') {
        const { startDay, endDay } = createDateBounds(getTodayString());
        start = startDay; end = endDay;
    } else if (filterType.value === 'month') {
        start = new Date(selectedYear.value, selectedMonth.value, 1, 0, 0, 0);
        end = new Date(selectedYear.value, selectedMonth.value + 1, 0, 23, 59, 59, 999);
    } else if (filterType.value === 'specific') {
        const { startDay, endDay } = createDateBounds(specificDate.value);
        start = startDay; end = endDay;
    } else if (filterType.value === 'range') {
        const boundsStart = createDateBounds(startDate.value);
        const boundsEnd = createDateBounds(endDate.value);
        start = boundsStart.startDay; end = boundsEnd.endDay;
    } else {
        start = new Date(2000, 0, 1); end = new Date(2100, 0, 1);
    }
    return { startStr: start.toISOString(), endStr: end.toISOString() };
};

let currentFetchId = 0;
let safetyTimer = null;
let debounceTimeout = null;

const fetchDynamicSalesData = async (userId) => {
    if (allSales.value.length === 0) isLoading.value = true;
    const { startStr, endStr } = getDateRangeISO();

    if (unsubscribeSales) {
        unsubscribeSales();
        unsubscribeSales = null;
    }

    const salesQ = query(
        collection(db, 'sales_reports'), 
        where('createdBy', '==', userId),
        where('createdAt', '>=', startStr),
        where('createdAt', '<=', endStr)
    );

    currentFetchId++;
    const thisFetchId = currentFetchId;

    if (filterType.value === 'today') {
        unsubscribeSales = onSnapshot(salesQ, { includeMetadataChanges: true }, (snapshot) => {
            if (thisFetchId !== currentFetchId) return;
            let fetched = [];
            snapshot.docs.forEach(docSnap => {
                fetched.push({ id: docSnap.id, ...docSnap.data() });
            });
            allSales.value = fetched.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
            isLoading.value = false;

            if (!snapshot.metadata.fromCache) {
                stopFetchTimer();
                if (safetyTimer) clearTimeout(safetyTimer);
            }
        }, (error) => {
            console.error("Error fetching realtime sales:", error);
            if (thisFetchId === currentFetchId) { isLoading.value = false; stopFetchTimer(); }
        });

        if (safetyTimer) clearTimeout(safetyTimer);
        safetyTimer = setTimeout(() => {
            if (thisFetchId === currentFetchId) stopFetchTimer();
        }, 10000);
    } 
    else {
        try {
            const snapshot = await getDocs(salesQ);
            if (thisFetchId !== currentFetchId) return;

            let fetched = [];
            snapshot.docs.forEach(docSnap => {
                fetched.push({ id: docSnap.id, ...docSnap.data() });
            });
            allSales.value = fetched.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
            isLoading.value = false;
            stopFetchTimer();
            if (safetyTimer) clearTimeout(safetyTimer);
        } catch (error) {
            console.error("Error fetching static history:", error);
            if (thisFetchId === currentFetchId) { isLoading.value = false; stopFetchTimer(); }
        }
    }
};

watch([filterType, specificDate, startDate, endDate, selectedMonth, selectedYear], () => {
    if (currentUserId) {
        startFetchTimer();
        if (debounceTimeout) clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            currentPage.value = 1;
            fetchDynamicSalesData(currentUserId);
        }, 600);
    }
}, { deep: true });

onMounted(() => {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            currentUserId = user.uid;
            try {
                const unitSnap = await getDocs(collection(db, 'settings_units'));
                availableUnits.value = unitSnap.docs.map(d => d.data());

                const snapSellers = await getDocs(query(collection(db, "users"), where("role", "in", ["seller", "dealer"]), where("createdBy", "==", user.uid)));
                sellers.value = snapSellers.docs.map(d => ({ id: d.id, ...d.data() }));

                const snapStocks = await getDocs(collection(db, 'stocks'));
                const arrStocks = snapStocks.docs.map(d => ({ id: d.id, ...d.data(), isCombo: false })).filter(i => !i.isDeleted);
                const snapCombos = await getDocs(collection(db, 'combos'));
                const arrCombos = snapCombos.docs.map(d => ({ id: d.id, ...d.data(), isCombo: true }));
                availableProducts.value = [...arrStocks, ...arrCombos];

                fetchDynamicSalesData(user.uid);

            } catch (error) {
                console.error("Error fetching data:", error);
                isLoading.value = false;
            }
        }
    });
});

onUnmounted(() => {
    if (unsubscribeSales) unsubscribeSales();
    stopFetchTimer();
    if (safetyTimer) clearTimeout(safetyTimer);
    if (debounceTimeout) clearTimeout(debounceTimeout);
});

const translateUnit = (unitVal) => {
    if (!unitVal) return '';
    const safeVal = String(unitVal);
    const found = availableUnits.value.find(u => String(u.value) === safeVal);
    if (found) return found.label;
    const u = safeVal.toLowerCase().trim();
    if (u === 'bottle' || u === 'bottles') return 'ដប';
    if (u === 'pack' || u === 'packs') return 'កញ្ចប់';
    if (u === 'case' || u === 'cases') return 'កេះ';
    return safeVal; 
};

const formatKhmerDate = (dateStr) => {
    if(!dateStr) return '';
    const date = new Date(dateStr);
    const months = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'];
    return `${String(date.getDate()).padStart(2, '0')} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

const formatTime = (dateStr) => {
    if(!dateStr) return '';
    return new Date(dateStr).toLocaleTimeString('km-KH', { hour: '2-digit', minute: '2-digit' });
};

const formatKhmerDateTime = (dateStr) => {
    if(!dateStr) return '';
    return `${formatKhmerDate(dateStr)} - ${formatTime(dateStr)}`;
};

const filteredSales = computed(() => {
    let result = allSales.value;
    if (paymentFilter.value !== 'ALL') {
        result = result.filter(s => s.paymentStatus === paymentFilter.value);
    }
    if (searchQuery.value.trim()) {
        const q = searchQuery.value.toLowerCase().trim();
        result = result.filter(s => 
            (s.receiptId && s.receiptId.toLowerCase().includes(q)) ||
            (s.customerName && s.customerName.toLowerCase().includes(q)) ||
            (s.customerPhone && s.customerPhone.toLowerCase().includes(q)) ||
            (s.location && s.location.toLowerCase().includes(q))
        );
    }
    return result;
});

const totalPages = computed(() => Math.ceil(filteredSales.value.length / itemsPerPage.value) || 1);

const paginatedSales = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    return filteredSales.value.slice(start, start + itemsPerPage.value);
});

const prevPage = () => { if (currentPage.value > 1) currentPage.value--; };
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++; };

const totalAmountUSD = computed(() => {
    return filteredSales.value.reduce((sum, item) => sum + (Number(item.totalAmount) || 0), 0);
});

const validSales = computed(() => filteredSales.value.filter(s => s.paymentStatus !== 'CANCELED'));

const totalStats = computed(() => {
    let productsUSD = 0; let productsKHR = 0;
    let deliveryUSD = 0; let deliveryKHR = 0;
    let items = 0;
    let ppClients = new Set();
    let provClients = new Set();

    validSales.value.forEach(sale => {
        if (sale.items) {
            sale.items.forEach(item => {
                const itemTotal = Number(item.price) * Number(item.qty);
                if (sale.currency === 'USD' || !sale.currency) productsUSD += itemTotal;
                else productsKHR += itemTotal;
                items += Number(item.qty);
            });
        }
        
        const dFee = Number(sale.deliveryFee) || 0;
        if (sale.deliveryCurrency === 'USD' || !sale.deliveryCurrency) deliveryUSD += dFee;
        else deliveryKHR += dFee;

        if (sale.receiptId) {
            if (sale.province === 'រាជធានីភ្នំពេញ' || (sale.location && sale.location.includes('ភ្នំពេញ'))) {
                ppClients.add(sale.receiptId);
            } else if (sale.province || (sale.location && !sale.location.includes('ទិញផ្ទាល់'))) {
                provClients.add(sale.receiptId);
            }
        }
    });

    return { productsUSD, productsKHR, deliveryUSD, deliveryKHR, items, ppClients: ppClients.size, provClients: provClients.size };
});

const showIdModal = ref(false);
const selectedDatabaseId = ref('');
const openIdModal = (dbId) => { selectedDatabaseId.value = dbId; showIdModal.value = true; };
const copyDatabaseId = async () => {
    try {
        await navigator.clipboard.writeText(selectedDatabaseId.value);
        emit('triggerAlert', 'success', 'ជោគជ័យ', 'បានចម្លង ID ទុកដោយជោគជ័យ!'); 
    } catch (err) { emit('triggerAlert', 'error', 'បរាជ័យ', 'មិនអាចចម្លងបានទេ'); }
};

const shareIdToTelegram = () => {
    const text = encodeURIComponent(`នេះគឺជាលេខ Database ID នៃការបញ្ជាទិញ:\n\n${selectedDatabaseId.value}`);
    window.open(`https://t.me/share/url?url=&text=${text}`, '_blank');
};


// ==========================================
// 🌟 PAID CONFIRMATION LOGIC 🌟
// ==========================================
const isUpdatingPaid = ref(false);
const paidModal = reactive({ isOpen: false, sale: null, newDate: '', originalDate: '', showWarning: false });

const getLocalDatetimeLocalString = (dateObj) => {
    const tzoffset = dateObj.getTimezoneOffset() * 60000;
    return (new Date(dateObj - tzoffset)).toISOString().slice(0, 16);
};

const openPaidModal = (sale) => {
    paidModal.sale = sale;
    paidModal.showWarning = true; 
    paidModal.newDate = getLocalDatetimeLocalString(new Date()); 
    paidModal.originalDate = sale.createdAt;
    paidModal.isOpen = true;
};

const checkPaidDate = () => {
    paidModal.showWarning = new Date(paidModal.newDate).toISOString() !== new Date(paidModal.originalDate).toISOString();
};

const confirmMarkAsPaid = async () => {
    if (!paidModal.sale) return;
    isUpdatingPaid.value = true;
    try {
        const payload = { 
            paymentStatus: 'PAID',
            createdAt: new Date(paidModal.newDate).toISOString() 
        };

        await updateDoc(doc(db, 'sales_reports', paidModal.sale.id), payload);
        emit('triggerAlert', 'success', 'ជោគជ័យ', 'វិក្កយបត្រត្រូវបានប្តូរទៅជា បានទូទាត់ រួចរាល់!');
        
        if (filterType.value !== 'today') {
            const index = allSales.value.findIndex(s => s.id === paidModal.sale.id);
            if (index !== -1) {
                allSales.value[index].paymentStatus = 'PAID';
                allSales.value[index].createdAt = payload.createdAt;
            }
        }
        paidModal.isOpen = false;
    } catch (error) { 
        emit('triggerAlert', 'error', 'បរាជ័យ', 'មិនអាចប្តូរស្ថានភាពបានទេ'); 
    } finally {
        isUpdatingPaid.value = false;
    }
};

// ==========================================
// 🌟 EDIT MODAL LOGIC (WIZARD: STEP 1 & 2) 🌟
// ==========================================
const editModal = reactive({ isOpen: false, step: 1, saleId: null, receiptId: '', originalDate: '', showDateWarning: false });
const isSaving = ref(false);
const editForm = reactive({ 
    sellerName: '', customerName: '', customerPhone: '', province: '', district: '', paymentMethod: 'CASH', paymentStatus: 'PAID', paymentNote: '', createdAt: '', deliveryFee: 0, deliveryCurrency: 'USD', items: [] 
});

const openEditModal = (sale) => {
    editModal.saleId = sale.id; editModal.receiptId = sale.receiptId || ''; editModal.step = 1; 
    editForm.sellerName = sale.sellerName || ''; editForm.customerName = sale.customerName || ''; editForm.customerPhone = sale.customerPhone || '';
    editForm.province = sale.province || ''; editForm.district = sale.district || ''; editForm.paymentMethod = sale.paymentMethod || 'CASH';
    editForm.paymentStatus = sale.paymentStatus || 'PAID'; editForm.paymentNote = sale.paymentNote || '';
    editForm.deliveryFee = sale.deliveryFee || 0; editForm.deliveryCurrency = sale.deliveryCurrency || 'USD';
    editForm.items = JSON.parse(JSON.stringify(sale.items || []));
    
    if (sale.createdAt) {
        const dateObj = new Date(sale.createdAt);
        editForm.createdAt = getLocalDatetimeLocalString(dateObj);
        editModal.originalDate = editForm.createdAt;
    } else { 
        editForm.createdAt = ''; 
        editModal.originalDate = '';
    }
    editModal.showDateWarning = false;
    editModal.isOpen = true; 
    miniPosSearchQuery.value = '';
};

const checkEditDate = () => {
    editModal.showDateWarning = editForm.createdAt !== editModal.originalDate;
};

const filteredMiniPosProducts = computed(() => {
    if (!miniPosSearchQuery.value) return [];
    const q = miniPosSearchQuery.value.toLowerCase();
    return availableProducts.value.filter(p => p.name && p.name.toLowerCase().includes(q) || (p.barcode && p.barcode.toLowerCase().includes(q)));
});

const addItemToEditForm = (product) => {
    let isWholesale = false; let price = product.retailPrice || 0;
    if (product.wholesaleQty > 0 && 1 >= product.wholesaleQty) { isWholesale = true; price = product.wholesalePrice || 0; }
    editForm.items.push({ id: product.id, name: product.name, image: product.image || '', price: price, qty: 1, type: isWholesale ? 'តម្លៃបោះដុំ' : 'តម្លៃលក់រាយ', unit: product.isCombo ? 'set' : (product.retailUnit || 'bottle'), isCombo: !!product.isCombo, cost: product.unitCost || 0 });
    miniPosSearchQuery.value = ''; emit('triggerAlert', 'success', 'ជោគជ័យ', `បានបន្ថែម ${product.name}`);
};

const removeItemFromEdit = (index) => { editForm.items.splice(index, 1); };

const recalculateEditItem = (item) => {
    const product = availableProducts.value.find(p => p.id === item.id);
    if (product && !item.isCombo) {
        const wQty = Number(product.wholesaleQty) || 0; const currentQty = Number(item.qty) || 0;
        if (wQty > 0 && currentQty >= wQty) { item.price = Number(product.wholesalePrice) || Number(item.price); item.type = 'តម្លៃបោះដុំ'; } 
        else { item.price = Number(product.retailPrice) || Number(item.price); item.type = 'តម្លៃលក់រាយ'; }
    }
};

const increaseEditQty = (item) => { item.qty = Number(item.qty) + 1; recalculateEditItem(item); };
const decreaseEditQty = (item) => { if (Number(item.qty) > 1) { item.qty = Number(item.qty) - 1; recalculateEditItem(item); } };

const editFormProductsTotal = computed(() => { return editForm.items.reduce((sum, item) => sum + (Number(item.price||0) * Number(item.qty||0)), 0); });

const saveEdit = async () => {
    isSaving.value = true;
    try {
        const payloadToUpdate = { ...editForm };
        if (editForm.createdAt) payloadToUpdate.createdAt = new Date(editForm.createdAt).toISOString();
        payloadToUpdate.location = `${editForm.district}, ${editForm.province}`;
        const productsSum = editFormProductsTotal.value; const dFee = Number(editForm.deliveryFee) || 0;
        if (editForm.deliveryCurrency === 'USD') payloadToUpdate.totalAmount = productsSum + dFee; else payloadToUpdate.totalAmount = productsSum; 

        await updateDoc(doc(db, 'sales_reports', editModal.saleId), payloadToUpdate);
        
        if (filterType.value !== 'today') {
            const index = allSales.value.findIndex(s => s.id === editModal.saleId);
            if (index !== -1) allSales.value[index] = { ...allSales.value[index], ...payloadToUpdate };
        }

        editModal.isOpen = false;
        emit('triggerAlert', 'success', 'ជោគជ័យ', 'កែប្រែព័ត៌មានបានជោគជ័យ');
    } catch (error) { emit('triggerAlert', 'error', 'បរាជ័យ', 'មានបញ្ហាក្នុងការកែប្រែ'); } 
    finally { isSaving.value = false; }
};

const deleteModal = reactive({ isOpen: false, sale: null });
const isDeleting = ref(false);
const openDeleteModal = (sale) => { deleteModal.sale = sale; deleteModal.isOpen = true; };
const executeDelete = async () => {
    if (!deleteModal.sale) return;
    isDeleting.value = true;
    try {
        await deleteDoc(doc(db, 'sales_reports', deleteModal.sale.id));
        emit('triggerAlert', 'success', 'ជោគជ័យ', 'លុបវិក្កយបត្របានជោគជ័យ');
        
        if (filterType.value !== 'today') {
            allSales.value = allSales.value.filter(s => s.id !== deleteModal.sale.id);
        }
        deleteModal.isOpen = false;
    } catch (error) { emit('triggerAlert', 'error', 'បរាជ័យ', 'មិនអាចលុបបានទេ'); } 
    finally { isDeleting.value = false; }
};

const cancelModal = reactive({ isOpen: false, sale: null });
const cancelReason = ref('');
const isCanceling = ref(false);
const openCancelModal = (sale) => { cancelModal.sale = sale; cancelModal.isOpen = true; cancelReason.value = ''; };
const closeCancelModal = () => { cancelModal.isOpen = false; cancelModal.sale = null; cancelReason.value = ''; };
const confirmCancel = async () => {
    if (!cancelReason.value.trim()) { emit('triggerAlert', 'error', 'កំហុស', 'សូមបញ្ជាក់មូលហេតុនៃការបោះបង់!'); return; }
    isCanceling.value = true;
    try {
        const saleId = cancelModal.sale.id;
        const cancelDate = new Date().toISOString();
        await updateDoc(doc(db, 'sales_reports', saleId), {
            paymentStatus: 'CANCELED', cancelReason: cancelReason.value, canceledAt: cancelDate
        });
        for (const item of cancelModal.sale.items) {
            const stockRef = doc(db, 'stocks', item.id);
            const stockSnap = await getDoc(stockRef);
            if (stockSnap.exists()) {
                const stockData = stockSnap.data();
                const perCase = Number(stockData.itemsPerCase) || 1;
                const qtyToReturn = item.qty / perCase; 
                await updateDoc(stockRef, { quantity: increment(qtyToReturn) });
            }
        }
        emit('triggerAlert', 'success', 'ជោគជ័យ', 'វិក្កយបត្រត្រូវបានបោះបង់');
        
        if (filterType.value !== 'today') {
            const index = allSales.value.findIndex(s => s.id === saleId);
            if (index !== -1) {
                allSales.value[index].paymentStatus = 'CANCELED';
                allSales.value[index].cancelReason = cancelReason.value;
                allSales.value[index].canceledAt = cancelDate;
            }
        }
        closeCancelModal();
    } catch (error) { emit('triggerAlert', 'error', 'បរាជ័យ', 'មានបញ្ហាក្នុងការបោះបង់វិក្កយបត្រ'); } 
    finally { isCanceling.value = false; }
};

const copyInvoiceText = (sale) => {
    let text = `🛒 វិក្កយបត្រ (INVOICE)\nលេខ: ${sale.receiptId}\nកាលបរិច្ឆេទ: ${formatKhmerDate(sale.createdAt)}\n--------------------------------\n👤 អតិថិជន: ${sale.customerName}\n📞 ទូរស័ព្ទ: ${sale.customerPhone}\n📍 ទីតាំង: ${sale.location}\n👨‍💼 អ្នកលក់: ${sale.sellerName}\n--------------------------------\n`;
    sale.items.forEach((item, i) => { text += `${i+1}. ${item.name} (${checkIsWholesale(item.type) ? 'ដុំ' : 'រាយ'})\n   ➔ ${item.qty} ${translateUnit(item.unit)} x $${item.price} = $${item.price * item.qty}\n`; });
    text += `--------------------------------\n💰 សរុបទំនិញ: $${Number(sale.totalAmount) - (sale.deliveryCurrency === 'USD' ? Number(sale.deliveryFee || 0) : 0)}\n`;
    if(sale.deliveryFee > 0) text += `🛵 ថ្លៃដឹកជញ្ជូន: ${sale.deliveryFee} ${sale.deliveryCurrency === 'USD' ? '$' : '៛'}\n`;
    text += `💳 សរុបរួម: $${sale.totalAmount}\n`;
    if(sale.paymentNote) text += `📝 ចំណាំ: ${sale.paymentNote}\n`;
    if(sale.paymentStatus === 'CANCELED') text += `\n❌ វិក្កយបត្រនេះត្រូវបានបោះបង់ (CANCELED) ❌\nមូលហេតុ: ${sale.cancelReason}`;

    navigator.clipboard.writeText(text).then(() => {
        emit('triggerAlert', 'success', 'ជោគជ័យ', 'បានចម្លងអត្ថបទវិក្កយបត្ររួចរាល់!');
    });
};

const shareToTelegram = (sale) => {
    try {
        if (!sale) { emit('triggerAlert', 'error', 'បរាជ័យ', 'មិនមានទិន្នន័យវិក្កយបត្រទេ'); return; }
        let text = `🛒 វិក្កយបត្រ (INVOICE)\nលេខ: ${sale.receiptId || 'N/A'}\nកាលបរិច្ឆេទ: ${formatKhmerDate(sale.createdAt)}\n--------------------------------\n👤 អតិថិជន: ${sale.customerName || 'ទូទៅ'}\n📞 ទូរស័ព្ទ: ${sale.customerPhone || 'N/A'}\n📍 ទីតាំង: ${sale.location || 'N/A'}\n👨‍💼 អ្នកលក់: ${sale.sellerName || 'N/A'}\n--------------------------------\n`;
        (sale.items || []).forEach((item, i) => { text += `${i+1}. ${item.name} (${checkIsWholesale(item.type) ? 'ដុំ' : 'រាយ'})\n   ➔ ${item.qty} ${translateUnit(item.unit)} x $${item.price} = $${item.price * item.qty}\n`; });
        let productsTotal = Number(sale.totalAmount || 0);
        const deliveryFee = Number(sale.deliveryFee || 0);
        if ((sale.deliveryCurrency === 'USD' || sale.deliveryCurrency === '$') && deliveryFee > 0) { productsTotal -= deliveryFee; }
        text += `--------------------------------\n💰 សរុបទំនិញ: $${productsTotal}\n`;
        if (deliveryFee > 0) text += `🛵 ថ្លៃដឹកជញ្ជូន: ${deliveryFee} ${sale.deliveryCurrency === 'USD' ? '$' : '៛'}\n`;
        text += `💳 សរុបរួម: $${sale.totalAmount}\n`;
        if (sale.paymentNote) text += `📝 ចំណាំ: ${sale.paymentNote}\n`;
        if (sale.paymentStatus === 'CANCELED') text += `\n❌ វិក្កយបត្រនេះត្រូវបានបោះបង់ (CANCELED) ❌\nមូលហេតុ: ${sale.cancelReason || 'មិនមានបញ្ជាក់'}`;
        const encodedText = encodeURIComponent(text);
        window.open(`https://t.me/share/url?url=&text=${encodedText}`, '_blank', 'noopener,noreferrer');
    } catch (error) { emit('triggerAlert', 'error', 'បរាជ័យ', 'មានបញ្ហាក្នុងការបង្កើតទម្រង់ចែករំលែក'); }
};

// ==========================================
// 🌟 IN-FILE EXPORT LOGIC (NO EXTERNAL IMPORTS) 🌟
// ==========================================

const generateSingleInvoiceHTML = (sale) => {
    let itemsHTML = '';
    sale.items.forEach((item, index) => {
        itemsHTML += `
            <tr style="border-bottom: 1px dashed #e2e8f0; ${sale.paymentStatus === 'CANCELED' ? 'opacity: 0.6;' : ''}">
                <td style="padding: 12px 10px; text-align: center; color: #64748b; font-family: 'Battambong', sans-serif;">${index + 1}</td>
                <td style="padding: 12px 10px; font-weight: bold; color: #1e293b; font-family: 'Battambong', sans-serif;">
                    ${item.name} <span style="font-size: 10px; color: #94a3b8; font-weight: normal;">(${checkIsWholesale(item.type) ? 'ដុំ' : 'រាយ'})</span>
                </td>
                <td style="padding: 12px 10px; text-align: center; font-family: 'Battambong', sans-serif;">${item.qty} ${translateUnit(item.unit)}</td>
                <td style="padding: 12px 10px; text-align: right; font-family: 'Battambong', sans-serif;">${item.price} $</td>
                <td style="padding: 12px 10px; text-align: right; font-weight: bold; font-family: 'Battambong', sans-serif;">${item.price * item.qty} $</td>
            </tr>
        `;
    });

    const watermark = sale.paymentStatus === 'CANCELED' ? `<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 80px; font-weight: 900; color: rgba(225, 29, 72, 0.15); border: 8px solid rgba(225, 29, 72, 0.15); padding: 10px 40px; border-radius: 20px; z-index: 10; pointer-events: none;">CANCELED</div>` : '';

    return `
        <div class="invoice-container" style="width: 148mm; background: white; padding: 15mm; font-family: 'Battambong', sans-serif; color: #0f172a; box-sizing: border-box; margin: 0 auto; position: relative; overflow: hidden;">
            ${watermark}
            <div style="text-align: center; border-bottom: 2px solid #cbd5e1; padding-bottom: 15px; margin-bottom: 20px;">
                <h2 style="margin: 0; font-size: 26px; font-weight: 900; font-family: 'Battambong', sans-serif;">វិក្កយបត្រ (INVOICE)</h2>
            </div>
            
            <table style="width: 100%; font-size: 13px; margin-bottom: 25px; font-family: 'Battambong', sans-serif; border: none;">
                <tr>
                    <td style="width: 50%; vertical-align: top; line-height: 1.8;">
                        <div><strong>អតិថិជន:</strong> <span style="${sale.paymentStatus === 'CANCELED' ? 'text-decoration: line-through; color: #94a3b8;' : ''}">${sale.customerName}</span></div>
                        <div style="color: #475569;"><strong>ទូរស័ព្ទ:</strong> ${sale.customerPhone}</div>
                        <div style="color: #475569;"><strong>ទីតាំង:</strong> ${sale.location}</div>
                    </td>
                    <td style="width: 50%; vertical-align: top; text-align: right; line-height: 1.8;">
                        <div><strong>លេខ:</strong> ${sale.receiptId}</div>
                        <div style="color: #475569;"><strong>កាលបរិច្ឆេទ:</strong> ${formatKhmerDate(sale.createdAt)}</div>
                        <div style="color: #475569;"><strong>អ្នកលក់:</strong> ${sale.sellerName}</div>
                    </td>
                </tr>
            </table>

            <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px; font-family: 'Battambong', sans-serif; position: relative; z-index: 20;">
                <thead style="background: #f1f5f9; border-top: 2px solid #94a3b8; border-bottom: 2px solid #94a3b8;">
                    <tr>
                        <th style="padding: 12px 10px; text-align: center; width: 8%;">#</th>
                        <th style="padding: 12px 10px; text-align: left;">បរិយាយទំនិញ</th>
                        <th style="padding: 12px 10px; text-align: center; width: 15%;">ចំនួន</th>
                        <th style="padding: 12px 10px; text-align: right; width: 20%;">តម្លៃឯកតា</th>
                        <th style="padding: 12px 10px; text-align: right; width: 20%;">សរុប</th>
                    </tr>
                </thead>
                <tbody>${itemsHTML}</tbody>
            </table>

            <table style="width: 100%; font-family: 'Battambong', sans-serif; border: none; margin-top: 20px; position: relative; z-index: 20;">
                <tr>
                    <td style="width: 50%; vertical-align: top;">
                        <div style="font-size: 12px; color: #64748b; margin-bottom: 10px;">
                            ការបង់ប្រាក់: <strong>${sale.paymentMethod}</strong>
                        </div>
                        ${sale.paymentStatus === 'CANCELED' ? `<div style="background: #fff1f2; padding: 10px; border-left: 3px solid #e11d48; border-radius: 4px; font-size: 12px; display: inline-block; color: #be123c;"><strong>មួលហេតុ Cancel:</strong> ${sale.cancelReason}</div>` : (sale.paymentNote ? `<div style="background: #f8fafc; padding: 10px; border-left: 3px solid #059669; border-radius: 4px; font-size: 12px; display: inline-block;"><strong>ចំណាំ:</strong> ${sale.paymentNote}</div>` : '')}
                    </td>
                    <td style="width: 50%; vertical-align: bottom; text-align: right;">
                        <div style="display: inline-block; min-width: 200px; text-align: right;">
                            ${sale.deliveryFee > 0 ? `<div style="font-size: 12px; color: #ea580c; margin-bottom: 5px;">ថ្លៃដឹកជញ្ជូន: <strong>${sale.deliveryFee} ${sale.deliveryCurrency === 'USD' ? '$' : '៛'}</strong></div>` : ''}
                            <div style="border-top: 2px solid #cbd5e1; padding-top: 10px; font-size: 20px; font-weight: 900; ${sale.paymentStatus === 'CANCELED' ? 'text-decoration: line-through; color: #94a3b8;' : ''}">
                                <span style="font-size: 14px; color: #64748b; margin-right: 15px; text-decoration: none;">សរុបរួម:</span> 
                                <span style="${sale.paymentStatus === 'CANCELED' ? '' : 'color: #059669;'}">${sale.totalAmount} $</span>
                            </div>
                        </div>
                    </td>
                </tr>
            </table>

            <div style="text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px dashed #e2e8f0; padding-top: 15px; margin-top: 50px; font-family: 'Battambong', sans-serif;">
                <p style="margin: 0; font-weight: bold;">សូមអរគុណសម្រាប់ការគាំទ្រ!</p>
                <p style="margin: 4px 0 0 0;">ទំនិញដែលទិញរួចមិនអាចដូរវិញបានទេ</p>
            </div>
        </div>
    `;
};

const saveInvoiceAsImage = async (sale) => {
    processing.value = { active: true, message: 'កំពុងបង្កើតរូបភាពវិក្កយបត្រ...', progress: 50 };
    try {
        invoiceStaging.value.innerHTML = generateSingleInvoiceHTML(sale);
        await nextTick(); await document.fonts.ready; await new Promise(r => setTimeout(r, 600)); 
        const canvas = await html2canvas(invoiceStaging.value.querySelector('.invoice-container'), { scale: 3, useCORS: true, backgroundColor: "#ffffff" });
        const link = document.createElement('a');
        link.download = `Invoice_${sale.receiptId}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        emit('triggerAlert', 'success', 'ជោគជ័យ', 'ទាញយករូបភាពវិក្កយបត្របានជោគជ័យ');
    } catch (error) {
        emit('triggerAlert', 'error', 'បរាជ័យ', 'មិនអាចបង្កើតរូបភាពបានទេ');
    } finally {
        if(invoiceStaging.value) invoiceStaging.value.innerHTML = '';
        processing.value.active = false;
    }
};

const getReportDateTitle = () => {
    if (filterType.value === 'today') return 'ប្រចាំថ្ងៃនេះ';
    if (filterType.value === 'month') return `ប្រចាំខែ ${availableMonths.value[selectedMonth.value].name} ${selectedYear.value}`;
    if (filterType.value === 'specific') return `ប្រចាំថ្ងៃទី ${new Date(specificDate.value).toLocaleDateString('km-KH')}`;
    return `ចាប់ពី ${new Date(startDate.value).toLocaleDateString('km-KH')} ដល់ ${new Date(endDate.value).toLocaleDateString('km-KH')}`;
};

const generateReportHTML = () => {
    const stats = totalStats.value;
    const dateTitle = getReportDateTitle();

    let tableRows = '';
    filteredSales.value.forEach((sale, index) => {
        const isCanceled = sale.paymentStatus === 'CANCELED';
        let itemsHTML = (sale.items || []).map(p => 
            `<span style="display:inline-block; margin-right:5px; font-size:10px;">• ${p.name||'ទំនិញ'} <strong style="color:#4f46e5;">(${p.qty} ${translateUnit(p.unit)})</strong> [${checkIsWholesale(p.type) ? 'ដុំ' : 'រាយ'}]</span>`
        ).join('<br>');
        
        tableRows += `
            <tr style="border-bottom: 1px dashed #e2e8f0; break-inside: avoid; ${isCanceled ? 'opacity: 0.5; background-color: #f8fafc;' : ''}">
                <td style="padding: 8px; text-align: center;">${index + 1}</td>
                <td style="padding: 8px;">
                    <div style="font-weight: 900; color: #1e293b; ${isCanceled?'text-decoration:line-through;':''}">${sale.receiptId}</div>
                    <div style="font-size: 10px; color: #64748b;">${formatKhmerDateTime(sale.createdAt)}</div>
                </td>
                <td style="padding: 8px; ${isCanceled?'text-decoration:line-through;':''}">
                    <div style="font-weight: bold; color: #1e293b;">${sale.customerName || 'ទូទៅ'}</div>
                    <div style="font-size: 10px; color: #64748b;">${sale.location || '-'}</div>
                </td>
                <td style="padding: 8px;">${itemsHTML}</td>
                <td style="padding: 8px; text-align: right; color: #ea580c; font-weight: bold; font-size: 11px;">
                    ${Number(sale.deliveryFee) > 0 ? Number(sale.deliveryFee) + (sale.deliveryCurrency==='USD'?' $':' ៛') : '-'}
                </td>
                <td style="padding: 8px; text-align: right; font-weight: 900; color: ${isCanceled?'#94a3b8':'#059669'}; ${isCanceled?'text-decoration:line-through;':''}">
                    ${Number(sale.totalAmount).toLocaleString()} ${sale.currency==='USD'?'$':'៛'}
                </td>
            </tr>
        `;
    });

    return `
        <div class="print-layout" style="width: 1000px; padding: 40px; background: white; font-family: 'Battambang', sans-serif; color: #1e293b;">
            <div style="text-align: center; border-bottom: 2px solid #4f46e5; padding-bottom: 15px; margin-bottom: 20px;">
                <h1 style="margin: 0; font-size: 24px; font-weight: 900;">បញ្ជីវិក្កយបត្រ</h1>
                <p style="margin: 5px 0 0 0; color: #64748b; font-size: 13px;">កាលបរិច្ឆេទ: <strong>${dateTitle}</strong></p>
            </div>
            
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 15px; margin-bottom: 20px; display: flex; justify-content: space-between;">
                <div>
                    <p style="margin:0; font-size: 11px; color: #64748b; font-weight: bold; text-transform: uppercase;">សរុបតម្លៃទំនិញ</p>
                    <p style="margin:0; font-size: 20px; font-weight: 900; color: #059669;">${stats.productsUSD.toLocaleString()} $</p>
                </div>
                <div style="border-left: 1px solid #cbd5e1; padding-left: 15px;">
                    <p style="margin:0; font-size: 11px; color: #64748b; font-weight: bold; text-transform: uppercase;">ថ្លៃដឹកជញ្ជូនសរុប</p>
                    <p style="margin:0; font-size: 20px; font-weight: 900; color: #ea580c;">${stats.deliveryUSD.toLocaleString()} $</p>
                </div>
                <div style="border-left: 1px solid #cbd5e1; padding-left: 15px;">
                    <p style="margin:0; font-size: 11px; color: #64748b; font-weight: bold; text-transform: uppercase;">វិក្កយបត្រជោគជ័យ</p>
                    <p style="margin:0; font-size: 20px; font-weight: 900; color: #4f46e5;">${validSales.value.length}</p>
                </div>
            </div>

            <table style="width: 100%; text-align: left; border-collapse: collapse; font-size: 12px; margin-bottom: 30px;">
                <thead style="background: #f1f5f9; color: #64748b; text-transform: uppercase; font-size: 10px;">
                    <tr>
                        <th style="padding: 10px; width: 5%; text-align: center;">#</th>
                        <th style="padding: 10px; width: 20%;">វិក្កយបត្រ & កាលបរិច្ឆេទ</th>
                        <th style="padding: 10px; width: 20%;">អតិថិជន & ទីតាំង</th>
                        <th style="padding: 10px; width: 35%;">មុខទំនិញ</th>
                        <th style="padding: 10px; width: 10%; text-align: right;">ថ្លៃដឹក</th>
                        <th style="padding: 10px; width: 10%; text-align: right;">សរុប ($)</th>
                    </tr>
                </thead>
                <tbody>${tableRows}</tbody>
            </table>
        </div>
    `;
};

const handlePrint = () => {
    const html = generateReportHTML();
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute'; iframe.style.width = '0'; iframe.style.height = '0'; iframe.style.border = 'none';
    document.body.appendChild(iframe);
    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
        <html><head><title>Invoices List</title>
        <link href="https://fonts.googleapis.com/css2?family=Battambong:wght@400;700;900&display=swap" rel="stylesheet">
        <style>@page { size: A4 portrait; margin: 10mm; } body { font-family: 'Battambang', sans-serif; -webkit-print-color-adjust: exact !important; margin: 0; }</style>
        </head><body>${html}</body></html>
    `);
    doc.close();
    iframe.contentWindow.document.fonts.ready.then(() => {
        iframe.contentWindow.focus(); iframe.contentWindow.print();
        setTimeout(() => document.body.removeChild(iframe), 1000);
    });
};

const handlePDF = async () => {
    processing.value = { active: true, message: 'កំពុងរៀបចំឯកសារ PDF...', progress: 30 };
    try {
        printStaging.value.innerHTML = generateReportHTML();
        await nextTick(); await document.fonts.ready; await new Promise(r => setTimeout(r, 600)); 
        const canvas = await html2canvas(printStaging.value.querySelector('.print-layout'), { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const pdf = new jsPDF('p', 'mm', 'a4'); 
        const pdfWidth = 210; 
        const propsImg = pdf.getImageProperties(imgData);
        const pdfHeight = (propsImg.height * pdfWidth) / propsImg.width;
        processing.value.progress = 90;
        let position = 0; let leftHeight = pdfHeight; const pageHeight = 295; 

        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
        leftHeight -= pageHeight;

        while (leftHeight > 0) {
            position = leftHeight - pdfHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
            leftHeight -= pageHeight;
        }
        pdf.save(`Invoices_List_${getTodayString()}.pdf`);
    } catch(e) {
        emit('triggerAlert', 'error', 'បរាជ័យ', 'មិនអាចទាញយក PDF បានទេ');
    } finally {
        if(printStaging.value) printStaging.value.innerHTML = '';
        processing.value.active = false;
    }
};

const handleAction = async (actionType, sale) => {
    if (actionType === 'id') openIdModal(sale.id);
    else if (actionType === 'paid') openPaidModal(sale);
    else if (actionType === 'cancel') openCancelModal(sale);
    else if (actionType === 'copy') copyInvoiceText(sale);
    else if (actionType === 'telegram') shareToTelegram(sale);
    else if (actionType === 'image') await saveInvoiceAsImage(sale);
    else if (actionType === 'edit') openEditModal(sale);
    else if (actionType === 'delete') openDeleteModal(sale);
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Battambong:wght@400;700;900&family=Kantumruy+Pro:wght@400;700;900&display=swap');
.font-khmer { font-family: 'Kantumruy Pro', 'Battambong', sans-serif; }
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #94A3B8; }
.animate-fade-in-up { animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
.animate-slide-down { animation: slideDown 0.2s ease-out forwards; transform-origin: top; }
@keyframes slideDown { from { opacity: 0; transform: scaleY(0.95); } to { opacity: 1; transform: scaleY(1); } }
.animate-slide-up { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
.animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

input[type="number"]::-webkit-inner-spin-button, input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
input[type="number"] { -moz-appearance: textfield; }

@media print { .print\:hidden { display: none !important; } }
</style>