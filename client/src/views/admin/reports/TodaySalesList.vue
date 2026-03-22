<template>
  <div class="w-full flex flex-col gap-6 animate-fade-in-up pb-24">
        
        <div class="bg-white p-2 rounded-[20px] shadow-sm border border-slate-200/80 flex flex-wrap lg:flex-nowrap items-center gap-2 print:hidden">
            <div class="flex flex-1 sm:flex-none overflow-x-auto no-scrollbar bg-slate-50 p-1.5 rounded-[14px] border border-slate-100">
                <button @click="setFilterType('today')" class="px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap" :class="filterType === 'today' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-800'">ថ្ងៃនេះ</button>
                <button @click="setFilterType('month')" class="px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap" :class="filterType === 'month' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-800'">ខែនេះ</button>
                <button @click="setFilterType('specific')" class="px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap" :class="filterType === 'specific' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-800'">ជ្រើសរើសថ្ងៃ</button>
                <button @click="setFilterType('range')" class="px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap" :class="filterType === 'range' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-800'">ចាប់ពីថ្ងៃ - ដល់ថ្ងៃ</button>
            </div>

            <div class="w-px h-8 bg-slate-200 hidden lg:block mx-2"></div>

            <div class="flex-1 flex items-center gap-3 animate-fade-in px-2" v-if="filterType !== 'today' && filterType !== 'month'">
                <div v-if="filterType === 'specific'" class="w-full sm:w-auto relative">
                    <input type="date" v-model="specificDate" class="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm font-bold rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500/20 outline-none">
                </div>
                <div v-if="filterType === 'range'" class="w-full flex items-center gap-2">
                    <input type="date" v-model="startDate" class="flex-1 bg-slate-50 border border-slate-200 text-slate-700 text-sm font-bold rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-indigo-500/20 outline-none">
                    <span class="text-slate-400 font-bold text-xs">-</span>
                    <input type="date" v-model="endDate" class="flex-1 bg-slate-50 border border-slate-200 text-slate-700 text-sm font-bold rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-indigo-500/20 outline-none">
                </div>
            </div>

            <div class="w-px h-8 bg-slate-200 hidden lg:block mx-2"></div>

            <div class="relative w-full lg:w-72 px-2 lg:px-0 mt-2 lg:mt-0 flex gap-2">
                <div class="relative flex-1">
                    <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                    <input v-model="searchQuery" type="text" placeholder="ស្វែងរកវិក្កយបត្រ, អតិថិជន..." class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all">
                </div>
                <button @click="handlePrint" :disabled="filteredSales.length === 0" class="bg-slate-800 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm hover:bg-slate-700 transition-colors disabled:opacity-50">Print</button>
                <button @click="handlePDF" :disabled="filteredSales.length === 0" class="bg-rose-50 text-rose-600 border border-rose-200 px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm hover:bg-rose-100 transition-colors disabled:opacity-50">PDF</button>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6 print:hidden">
            <div class="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-[20px] p-6 text-white shadow-lg shadow-blue-500/20 relative overflow-hidden">
                <div class="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
                <div class="relative z-10 flex flex-col h-full justify-between">
                    <p class="text-blue-100 text-[11px] font-black uppercase tracking-widest mb-1 flex items-center gap-2">ចំណូលទំនិញសុទ្ធ (Products)</p>
                    <h3 class="text-3xl font-black">{{ totalStats.productsUSD.toLocaleString() }} <span class="text-lg opacity-80">$</span></h3>
                    <p class="text-sm font-bold opacity-90 mt-1">{{ totalStats.productsKHR.toLocaleString() }} ៛</p>
                </div>
            </div>
            
            <div class="bg-gradient-to-br from-orange-400 to-rose-500 rounded-[20px] p-6 text-white shadow-lg shadow-rose-500/20 relative overflow-hidden">
                <div class="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
                <div class="relative z-10 flex flex-col h-full justify-between">
                    <p class="text-orange-100 text-[11px] font-black uppercase tracking-widest mb-1 flex items-center gap-2">ថ្លៃដឹកជញ្ជូនសរុប (Delivery)</p>
                    <h3 class="text-3xl font-black">{{ totalStats.deliveryUSD.toLocaleString() }} <span class="text-lg opacity-80">$</span></h3>
                    <p class="text-sm font-bold opacity-90 mt-1">{{ totalStats.deliveryKHR.toLocaleString() }} ៛</p>
                </div>
            </div>

            <div class="bg-white rounded-[20px] p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
                <div class="flex items-center justify-between mb-4">
                    <p class="text-slate-400 text-[11px] font-black uppercase tracking-widest">អតិថិជនសរុប (CLIENTS)</p>
                    <div class="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-[14px] flex items-center justify-center">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                    </div>
                </div>
                <div>
                    <h3 class="text-3xl font-black text-slate-800">{{ validSales.length }} <span class="text-sm text-slate-400 font-bold">នាក់ / វិក្កយបត្រ</span></h3>
                    
                    <div class="flex gap-2 mt-3 pt-3 border-t border-slate-100">
                        <span class="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                            រាជធានីភ្នំពេញ: <span class="text-indigo-600">{{ totalStats.ppClients }} នាក់</span>
                        </span>
                        <span class="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                            តាមបណ្តាខេត្ត: <span class="text-amber-600">{{ totalStats.provClients }} នាក់</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="isLoading" class="flex flex-col items-center justify-center py-24 opacity-60 print:hidden">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-indigo-600 mb-4"></div>
            <p class="text-slate-500 font-bold tracking-wide">កំពុងទាញយកទិន្នន័យ...</p>
        </div>

        <div v-else-if="paginatedSales.length === 0" class="py-24 bg-white/50 backdrop-blur-sm rounded-[24px] border-2 border-dashed border-slate-200 text-center animate-fade-in print:hidden">
            <div class="w-16 h-16 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            </div>
            <p class="text-lg font-black text-slate-600">មិនមានទិន្នន័យទេ</p>
            <p class="text-sm text-slate-400 mt-1">សូមសាកល្បងប្តូរការស្វែងរក ឬកាលបរិច្ឆេទ</p>
        </div>

        <div v-else class="flex flex-col gap-3 animate-fade-in print:hidden">
            <div v-for="(sale, index) in paginatedSales" :key="sale.id" class="bg-white rounded-[20px] border shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden group transition-all" :class="sale.paymentStatus === 'CANCELED' ? 'border-rose-200 bg-rose-50/30' : (isSaleIncomplete(sale) ? 'border-amber-300 bg-amber-50/10' : 'border-slate-200/80 hover:border-indigo-300')">
                
                <div class="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors" @click="toggleExpand(sale.id)">
                    
                    <div class="flex items-center gap-4 w-full sm:w-auto" :class="{'opacity-70': sale.paymentStatus === 'CANCELED'}">
                        <div class="w-12 h-12 rounded-[14px] flex items-center justify-center border shrink-0 transition-colors" :class="sale.paymentStatus === 'CANCELED' ? 'bg-slate-200 text-slate-500 border-slate-300' : (expandedRows.has(sale.id) ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/30' : 'bg-slate-50 text-indigo-500 border-slate-200 group-hover:bg-white')">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center gap-2 mb-1">
                                <h3 class="font-black text-sm sm:text-base line-clamp-1" :class="sale.paymentStatus === 'CANCELED' ? 'text-slate-500 line-through' : 'text-slate-800'">{{ sale.customerName || 'ទូទៅ / មិនមានឈ្មោះ' }}</h3>
                                
                                <span v-if="sale.paymentStatus === 'PAID'" class="bg-emerald-50 text-emerald-600 text-[9px] px-1.5 py-0.5 rounded border border-emerald-200 font-black shrink-0">PAID</span>
                                <span v-else-if="sale.paymentStatus === 'CANCELED'" class="bg-rose-100 text-rose-600 text-[9px] px-1.5 py-0.5 rounded border border-rose-200 font-black shrink-0">CANCELED</span>
                                <span v-else class="bg-amber-50 text-amber-600 text-[9px] px-1.5 py-0.5 rounded border border-amber-200 font-black shrink-0">PENDING</span>

                                <span v-if="isSaleIncomplete(sale) && sale.paymentStatus !== 'CANCELED'" class="bg-amber-100 text-amber-700 text-[9px] px-2 py-0.5 rounded-full border border-amber-300 font-black shrink-0 flex items-center gap-1 animate-pulse shadow-sm">
                                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg> មិនពេញលេញ
                                </span>
                            </div>
                            <div class="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                                <span class="font-mono px-1.5 rounded" :class="sale.paymentStatus === 'CANCELED' ? 'text-slate-500 bg-slate-200' : 'text-indigo-500 bg-indigo-50'">{{ sale.receiptId || 'N/A' }}</span>
                                <span class="w-1 h-1 rounded-full bg-slate-300 hidden sm:block"></span>
                                <span>{{ formatKhmerDateTime(sale.createdAt) }}</span>
                                <span class="w-1 h-1 rounded-full bg-slate-300 hidden sm:block"></span>
                                <span class="text-blue-500">{{ sale.sellerName || 'N/A' }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center justify-between w-full sm:w-auto gap-4 border-t sm:border-none border-slate-100 pt-3 sm:pt-0">
                        <div class="text-left sm:text-right flex-1 sm:flex-none">
                            <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">សរុប (Total)</p>
                            <p class="font-black text-lg leading-none flex flex-col sm:items-end gap-1" :class="sale.paymentStatus === 'CANCELED' ? 'text-slate-400 line-through' : 'text-emerald-600'">
                                <span>{{ Number(sale.totalAmount).toLocaleString() }} $</span>
                                <span v-if="Number(sale.deliveryFee) > 0" class="text-[9px] bg-orange-50 text-orange-500 border border-orange-200 px-1.5 py-0.5 rounded-md w-fit" title="ថ្លៃដឹកជញ្ជូន">
                                    ដឹកជញ្ជូន: {{ sale.deliveryFee }}{{ sale.deliveryCurrency === 'USD' ? '$' : '៛' }}
                                </span>
                            </p>
                        </div>
                        
                        <div class="flex items-center gap-1.5">
                            
                            <button @click.stop="openIdModal(sale.id)" class="p-2 bg-slate-50 hover:bg-fuchsia-50 text-slate-400 hover:text-fuchsia-600 border border-slate-100 hover:border-fuchsia-200 rounded-xl transition-all" title="មើល Database ID">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>
                            </button>

                            <button v-if="sale.paymentStatus === 'PENDING'" @click.stop="markAsPaid(sale)" class="p-2 bg-amber-50 hover:bg-emerald-100 text-amber-600 hover:text-emerald-700 border border-amber-200 hover:border-emerald-300 rounded-xl transition-all" title="គូសចំណាំថាបានទូទាត់ (Mark as Paid)">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                            </button>

                            <button v-if="sale.paymentStatus !== 'CANCELED'" @click.stop="openCancelModal(sale)" class="p-2 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-100 hover:border-rose-200 rounded-xl transition-all" title="បោះបង់វិក្កយបត្រ (Cancel)">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </button>

                            <button @click.stop="copyInvoiceText(sale)" class="p-2 bg-slate-50 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 border border-slate-100 hover:border-indigo-200 rounded-xl transition-all" title="ចម្លងអត្ថបទវិក្កយបត្រ">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                            </button>

                            <button @click.stop="shareToTelegram(sale)" class="p-2 bg-sky-50 hover:bg-sky-100 text-sky-500 hover:text-sky-700 border border-sky-100 hover:border-sky-300 rounded-xl transition-all" title="Share ទៅ Telegram">
                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.48-.94-2.4-1.54-1.06-.7-.37-1.09.23-1.72.16-.16 2.87-2.63 2.92-2.85.01-.03.01-.14-.06-.2-.06-.06-.17-.04-.25-.02-.11.02-1.91 1.2-5.39 3.55-.5.34-.95.51-1.35.5-.44-.01-1.29-.25-1.92-.42-.77-.21-1.37-.32-1.31-.68.03-.18.28-.37.76-.56 3.03-1.32 5.06-2.19 6.09-2.62 2.93-1.21 3.53-1.43 3.93-1.43.09 0 .28.01.4.04.1.03.24.1.33.25.08.16.07.32.07.33z"/></svg>
                            </button>

                            <button @click.stop="saveInvoiceAsImage(sale)" class="p-2 bg-slate-50 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 border border-slate-100 hover:border-emerald-200 rounded-xl transition-all" title="ទាញយករូបភាពវិក្កយបត្រ">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                            </button>

                            <button v-if="sale.paymentStatus !== 'CANCELED'" @click.stop="openEditModal(sale)" class="p-2 bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 border border-slate-100 hover:border-blue-200 rounded-xl transition-all" title="កែប្រែ">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                            </button>

                            <button @click.stop="openDeleteModal(sale)" class="p-2 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-100 hover:border-rose-200 rounded-xl transition-all" title="លុបចោល">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                            </button>
                            
                            <div class="w-px h-6 bg-slate-200 mx-1"></div>
                            <svg class="w-5 h-5 text-slate-400 transition-transform duration-300" :class="expandedRows.has(sale.id) ? 'rotate-180 text-indigo-500' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                        </div>
                    </div>
                </div>

                <div v-show="expandedRows.has(sale.id)" class="border-t border-slate-100 p-4 sm:p-5 animate-slide-down" :class="sale.paymentStatus === 'CANCELED' ? 'bg-rose-50/50' : 'bg-[#F8FAFC]'">
                    <div v-if="sale.paymentStatus === 'CANCELED'" class="mb-4 bg-white border border-rose-200 p-3 rounded-xl flex items-start gap-3 shadow-sm">
                        <svg class="w-5 h-5 text-rose-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <div>
                            <h4 class="text-[11px] font-black uppercase tracking-widest text-rose-700">មូលហេតុនៃការបោះបង់៖</h4>
                            <p class="text-sm font-bold text-rose-600 mt-1">{{ sale.cancelReason || 'មិនមានបញ្ជាក់' }}</p>
                            <p class="text-[10px] text-rose-400 mt-1 font-bold">កាលបរិច្ឆេទ: {{ formatTime(sale.canceledAt) }} ({{ formatKhmerDate(sale.canceledAt) }})</p>
                        </div>
                    </div>

                    <div class="flex items-center justify-between mb-3">
                        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">មុខទំនិញ ({{ sale.items?.length || 0 }})</p>
                        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">តម្លៃសរុប</p>
                    </div>
                    <div class="flex flex-col gap-2">
                        <div v-for="(item, i) in (sale.items || [])" :key="i" class="flex items-center justify-between bg-white p-2.5 rounded-xl border shadow-sm" :class="sale.paymentStatus === 'CANCELED' ? 'border-rose-100 opacity-80' : 'border-slate-200'">
                            <div class="flex items-center gap-3">
                                <img v-if="item.image" :src="item.image" class="w-10 h-10 rounded-lg object-cover border border-slate-100 bg-slate-50 shrink-0">
                                <div v-else class="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 shrink-0"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg></div>
                                <div>
                                    <p class="text-xs font-bold text-slate-800 line-clamp-1" :class="{'line-through': sale.paymentStatus === 'CANCELED'}">{{ item.name || 'មិនស្គាល់ទំនិញ' }}</p>
                                    <p class="text-[10px] font-black text-slate-400 mt-0.5 flex items-center gap-1">
                                        <span class="text-indigo-500">{{ item.price || 0 }} $</span> 
                                        <svg class="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"/></svg> 
                                        <span>{{ item.qty || 0 }} {{ translateUnit(item.unit) }}</span>
                                        <span class="bg-slate-100 px-1.5 py-0.5 rounded text-[8px] text-slate-500 ml-1">{{ item.type === 'wholesale' ? 'បោះដុំ' : 'លក់រាយ' }}</span>
                                    </p>
                                </div>
                            </div>
                            <div class="font-black text-sm pl-4" :class="sale.paymentStatus === 'CANCELED' ? 'text-slate-400 line-through' : 'text-slate-700'">
                                {{ (Number(item.price || 0) * Number(item.qty || 0)).toLocaleString() }} $
                            </div>
                        </div>
                    </div>
                    
                    <div class="mt-4 pt-3 border-t grid grid-cols-2 gap-4 text-xs font-bold text-slate-600" :class="sale.paymentStatus === 'CANCELED' ? 'border-rose-100' : 'border-slate-200'">
                        <div>
                            <span class="text-slate-400 text-[10px] uppercase block mb-0.5">ទីតាំងអតិថិជន</span>
                            <span :class="{'text-amber-500': !sale.location}">{{ sale.location || (sale.district && sale.province ? `${sale.district}, ${sale.province}` : 'មិនមានទីតាំង') }}</span>
                        </div>
                        <div class="text-right">
                            <span class="text-slate-400 text-[10px] uppercase block mb-0.5">ចំណាំការទូទាត់</span>
                            {{ sale.paymentNote || 'មិនមាន' }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="totalPages > 1" class="flex flex-col sm:flex-row items-center justify-between mt-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-200 print:hidden">
            <span class="text-xs font-bold text-slate-500">ទំព័រ {{ currentPage }} នៃ {{ totalPages }} (សរុប {{ filteredSales.length }})</span>
            <div class="flex gap-2">
                <button @click="currentPage--" :disabled="currentPage === 1" class="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed font-bold text-xs transition-colors">មុន</button>
                <button @click="currentPage++" :disabled="currentPage === totalPages" class="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed font-bold text-xs transition-colors">បន្ទាប់</button>
            </div>
        </div>
    </div>

    <div v-if="editModal.isOpen" class="fixed inset-0 z-[999] flex items-start justify-center p-4 pt-10 sm:pt-16 bg-slate-900/60 backdrop-blur-sm animate-fade-in print:hidden">
        <div class="bg-white rounded-[24px] w-full max-w-3xl shadow-2xl border border-white/20 overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
            <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
                <div>
                    <h3 class="font-black text-slate-800 text-lg flex items-center gap-2 leading-none">
                        <svg class="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                        កែប្រែវិក្កយបត្រ 
                    </h3>
                    <p class="text-xs font-bold text-indigo-500 font-mono mt-1">#{{ editModal.receiptId }}</p>
                </div>
                <button @click="editModal.isOpen = false" class="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
            </div>

            <div class="flex border-b border-slate-200 px-6 shrink-0 bg-white">
                <button @click="editModal.activeTab = 'info'" class="px-4 py-3 text-sm font-black border-b-2 transition-colors flex items-center gap-2" :class="editModal.activeTab === 'info' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    ព័ត៌មានអតិថិជន & ការទូទាត់
                </button>
                <button @click="editModal.activeTab = 'items'" class="px-4 py-3 text-sm font-black border-b-2 transition-colors flex items-center gap-2" :class="editModal.activeTab === 'items' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                    កែប្រែមុខទំនិញ <span class="bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded text-[10px] ml-1">{{ editForm.items.length }}</span>
                </button>
            </div>
            
            <div class="p-6 flex-1 overflow-y-auto custom-scrollbar bg-white">
                <div v-if="editModal.activeTab === 'info'" class="flex flex-col gap-5 animate-fade-in">
                    <div class="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 mb-2">
                        <label class="block text-[11px] font-black text-indigo-600 uppercase tracking-widest mb-2">តំណាងលក់ (Seller)</label>
                        <select v-model="editForm.sellerName" class="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none cursor-pointer">
                            <option value="">-- មិនមានតំណាងលក់ (លក់ផ្ទាល់) --</option>
                            <option v-for="s in sellers" :key="s.id" :value="s.fullName">{{ s.fullName }}</option>
                        </select>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5" :class="{'text-amber-500': !editForm.customerName}">ឈ្មោះអតិថិជន *</label>
                            <input v-model="editForm.customerName" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" :class="{'border-amber-300 bg-amber-50': !editForm.customerName}">
                        </div>
                        <div>
                            <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5" :class="{'text-amber-500': !editForm.customerPhone}">លេខទូរស័ព្ទ *</label>
                            <input v-model="editForm.customerPhone" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" :class="{'border-amber-300 bg-amber-50': !editForm.customerPhone}">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5" :class="{'text-amber-500': !editForm.province}">ខេត្ត/ក្រុង *</label>
                            <input v-model="editForm.province" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" :class="{'border-amber-300 bg-amber-50': !editForm.province}">
                        </div>
                        <div>
                            <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">សាខា (ស្រុក/ខណ្ឌ/ឃុំ)</label>
                            <input v-model="editForm.district" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all">
                        </div>
                    </div>

                    <div class="bg-orange-50/50 p-4 rounded-xl border border-orange-100">
                        <label class="block text-[11px] font-black text-orange-600 uppercase tracking-widest mb-2">ថ្លៃដឹកជញ្ជូន (Delivery Fee)</label>
                        <div class="flex items-center gap-3">
                            <input v-model.number="editForm.deliveryFee" type="number" step="any" min="0" class="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 outline-none transition-all">
                            <select v-model="editForm.deliveryCurrency" class="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 outline-none cursor-pointer">
                                <option value="USD">USD ($)</option>
                                <option value="KHR">KHR (៛)</option>
                            </select>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">វិធីទូទាត់</label>
                            <select v-model="editForm.paymentMethod" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all cursor-pointer">
                                <option value="CASH">សាច់ប្រាក់ (CASH)</option>
                                <option value="KHQR">វេរប្រាក់ (KHQR)</option>
                                <option value="BANK">ធនាគារ (BANK)</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">ស្ថានភាព</label>
                            <select v-model="editForm.paymentStatus" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all cursor-pointer">
                                <option value="PAID">ទូទាត់រួច (PAID)</option>
                                <option value="PENDING">ជំពាក់ (PENDING)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div v-if="editModal.activeTab === 'items'" class="flex flex-col gap-4 animate-fade-in">
                    <div class="bg-slate-50 border border-slate-200 p-4 rounded-xl shadow-sm mb-2 relative z-20">
                        <p class="text-[11px] font-black text-slate-600 mb-2 uppercase tracking-widest flex items-center gap-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                            បន្ថែមទំនិញថ្មី
                        </p>
                        <div class="relative">
                            <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                            <input v-model="miniPosSearchQuery" type="text" placeholder="ស្វែងរកឈ្មោះទំនិញ..." class="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-4 py-2 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none">
                            
                            <div v-if="miniPosSearchQuery && filteredMiniPosProducts.length > 0" class="absolute top-full left-0 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-48 overflow-y-auto z-50">
                                <div v-for="prod in filteredMiniPosProducts" :key="prod.id" @click="addItemToEditForm(prod)" class="p-2 border-b border-slate-100 hover:bg-indigo-50 cursor-pointer flex justify-between items-center transition-colors">
                                    <div class="flex items-center gap-2">
                                        <div class="w-8 h-8 bg-slate-100 rounded flex items-center justify-center overflow-hidden shrink-0">
                                            <img v-if="prod.image" :src="prod.image" class="w-full h-full object-cover">
                                            <span v-else class="text-xs text-slate-400 font-bold">{{ prod.name ? prod.name.charAt(0) : '?' }}</span>
                                        </div>
                                        <div>
                                            <p class="text-xs font-bold text-slate-800">{{ prod.name }}</p>
                                        </div>
                                    </div>
                                    <button class="bg-indigo-500 text-white px-2 py-1 rounded text-[10px] font-black hover:bg-indigo-600 transition-colors shadow-sm">បញ្ចូល</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="editForm.items.length === 0" class="text-center py-10 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                        <p class="text-slate-400 font-bold text-sm">វិក្កយបត្រនេះមិនមានទំនិញទេ!</p>
                    </div>

                    <div v-for="(item, index) in editForm.items" :key="index" class="bg-white border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:border-indigo-300 transition-colors relative group">
                        <button @click="removeItemFromEdit(index)" class="absolute -top-2 -right-2 w-6 h-6 bg-white border border-rose-200 text-rose-500 rounded-full shadow-sm flex items-center justify-center hover:bg-rose-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"/></svg></button>

                        <div class="flex-1 min-w-0">
                            <p class="font-black text-sm text-slate-800 leading-tight mb-1">{{ item.name }}</p>
                            <p class="text-[10px] font-bold text-slate-400 flex gap-2">
                                <span class="bg-slate-100 px-1.5 py-0.5 rounded">{{ item.type === 'wholesale' ? 'បោះដុំ' : 'លក់រាយ' }}</span>
                                <span class="uppercase">{{ translateUnit(item.unit) }}</span>
                            </p>
                        </div>
                        
                        <div class="flex flex-wrap items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                            <div class="flex items-center bg-slate-50 border border-slate-200 rounded-lg overflow-hidden h-9 w-28">
                                <span class="px-2 text-xs font-black text-slate-400 border-r border-slate-200">$</span>
                                <input v-model.number="item.price" type="number" step="any" min="0" class="w-full h-full bg-transparent border-none text-sm font-black text-slate-800 text-center focus:ring-0 px-1 outline-none">
                            </div>
                            <span class="text-slate-300 font-bold text-xs hidden sm:block">x</span>
                            <div class="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden h-9 shadow-sm w-28">
                                <button @click="item.qty = Math.max(1, item.qty - 1)" type="button" class="w-8 h-full bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition-colors flex items-center justify-center font-bold border-r border-slate-200">−</button>
                                <input v-model.number="item.qty" type="number" min="1" class="w-full h-full text-center bg-transparent border-none font-black text-sm text-slate-800 focus:ring-0 p-0 outline-none">
                                <button @click="item.qty++" type="button" class="w-8 h-full bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition-colors flex items-center justify-center font-bold border-l border-slate-200">+</button>
                            </div>
                            <div class="w-full sm:w-20 text-right sm:text-center mt-1 sm:mt-0">
                                <span class="font-black text-emerald-600">{{ (Number(item.price||0) * Number(item.qty||0)).toLocaleString() }} $</span>
                            </div>
                        </div>
                    </div>

                    <div class="mt-4 bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex flex-col gap-2">
                        <div class="flex justify-between items-center text-sm font-bold text-slate-600">
                            <span>តម្លៃទំនិញសរុប:</span>
                            <span>{{ editFormProductsTotal.toLocaleString() }} $</span>
                        </div>
                        <div class="flex justify-between items-center text-sm font-bold text-orange-600">
                            <span>ថ្លៃដឹកជញ្ជូន:</span>
                            <span>{{ (editForm.deliveryFee || 0).toLocaleString() }} {{ editForm.deliveryCurrency === 'USD' ? '$' : '៛' }}</span>
                        </div>
                        <div class="flex justify-between items-center border-t border-indigo-200 pt-2 mt-1">
                            <span class="font-black text-indigo-800 text-base">សរុបរួម (Grand Total):</span>
                            <span class="font-black text-xl text-indigo-700">
                                {{ (editFormProductsTotal + (editForm.deliveryCurrency === 'USD' ? Number(editForm.deliveryFee || 0) : 0)).toLocaleString() }} $
                                <span v-if="editForm.deliveryCurrency === 'KHR'" class="text-sm"> + {{ editForm.deliveryFee }} ៛</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 shrink-0">
                <button @click="editModal.isOpen = false" class="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-500 bg-white border border-slate-200 hover:bg-slate-100 transition-colors">បោះបង់</button>
                <button @click="saveEdit" :disabled="isSaving || editForm.items.length === 0" class="px-8 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/30 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2">
                    <svg v-if="isSaving" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    រក្សាទុកការកែប្រែ
                </button>
            </div>
        </div>
    </div>

    <transition enter-active-class="duration-300 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="showIdModal" class="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm print:hidden">
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

    <div v-if="cancelModal.isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in print:hidden">
        <div class="bg-white rounded-[24px] w-full max-w-md shadow-2xl overflow-hidden animate-slide-up flex flex-col">
            <div class="px-6 py-5 border-b border-rose-100 bg-rose-50 flex items-center justify-between">
                <h3 class="text-lg font-black text-rose-700">បញ្ជាក់ការបោះបង់វិក្កយបត្រ</h3>
                <button @click="closeCancelModal" class="text-rose-400 hover:text-rose-600"><svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <div class="p-6">
                <textarea v-model="cancelReason" rows="3" placeholder="មូលហេតុនៃការបោះបង់..." class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-bold text-sm focus:ring-2 focus:ring-rose-500/20 outline-none resize-none"></textarea>
            </div>
            <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                <button @click="closeCancelModal" class="px-6 py-2.5 rounded-xl font-bold text-slate-600 bg-white border border-slate-300">បិទវិញ</button>
                <button @click="confirmCancel" :disabled="isCanceling" class="px-6 py-2.5 rounded-xl font-black text-white bg-rose-600 hover:bg-rose-700">បាទ, បោះបង់</button>
            </div>
        </div>
    </div>

    <div v-if="deleteModal.isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in print:hidden">
        <div class="bg-white rounded-[24px] w-full max-w-sm shadow-2xl overflow-hidden animate-slide-up text-center p-6 md:p-8">
            <h3 class="text-xl font-black text-slate-800 mb-2">តើអ្នកពិតជាចង់លុបមែនទេ?</h3>
            <div class="flex items-center gap-3 mt-6">
                <button @click="deleteModal.isOpen = false" class="flex-1 py-3 rounded-xl font-bold text-slate-600 bg-slate-100">បោះបង់</button>
                <button @click="executeDelete" :disabled="isDeleting" class="flex-1 py-3 rounded-xl font-black text-white bg-rose-500">យល់ព្រមលុប</button>
            </div>
        </div>
    </div>

    <div ref="invoiceStaging" class="fixed top-0 left-[-9999px] pointer-events-none z-[-1] opacity-0 print:opacity-100 bg-white"></div>
    <div ref="printStaging" class="fixed top-0 left-[-9999px] pointer-events-none z-[-1] opacity-0 print:opacity-100 bg-white w-[1000px]"></div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch, reactive } from 'vue';
import { db, auth } from '@/firebaseConfig';
// 🌟 បន្ថែម getDocs មកទីនេះ
import { doc, getDoc, collection, query, where, onSnapshot, getDocs, updateDoc, increment, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const emit = defineEmits(['triggerAlert']);

const isLoading = ref(true);
const allSales = ref([]);
const availableUnits = ref([]);
const invoiceStaging = ref(null);
const printStaging = ref(null);
const processing = ref({ active: false, message: '', progress: 0 });

// Filters
const filterType = ref('today');
const searchQuery = ref('');
const specificDate = ref(new Date().toISOString().split('T')[0]);
const startDate = ref(new Date().toISOString().split('T')[0]);
const endDate = ref(new Date().toISOString().split('T')[0]);

// Pagination
const currentPage = ref(1);
const itemsPerPage = ref(50);

// Product data for Edit Modal
const sellers = ref([]); 
const availableProducts = ref([]);
const miniPosSearchQuery = ref('');

let unsubscribeSales = null;
let currentUserId = null; // ទុកចាំហៅ Fetch ម្តងទៀតពេលដូរថ្ងៃ

const setFilterType = (type) => {
    filterType.value = type;
    currentPage.value = 1;
};

const getTodayString = () => { 
    const today = new Date(); 
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`; 
};

// 🌟 SERVER-SIDE DATE FILTERING 🌟
const getDateRangeISO = () => {
    let start, end;
    
    const createDateBounds = (dateString) => {
        const base = new Date(dateString);
        const startDay = new Date(base.getFullYear(), base.getMonth(), base.getDate(), 0, 0, 0);
        const endDay = new Date(base.getFullYear(), base.getMonth(), base.getDate(), 23, 59, 59, 999);
        return { startDay, endDay };
    };

    if (filterType.value === 'today') {
        const { startDay, endDay } = createDateBounds(getTodayString());
        start = startDay; end = endDay;
    } else if (filterType.value === 'month') {
        const today = new Date();
        start = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
    } else if (filterType.value === 'specific') {
        const { startDay, endDay } = createDateBounds(specificDate.value);
        start = startDay; end = endDay;
    } else if (filterType.value === 'range') {
        const boundsStart = createDateBounds(startDate.value);
        const boundsEnd = createDateBounds(endDate.value);
        start = boundsStart.startDay; end = boundsEnd.endDay;
    }
    
    return { startStr: start.toISOString(), endStr: end.toISOString() };
};

// 🌟 អថេរសម្រាប់ការពារការហៅទិន្នន័យជាន់គ្នា (Race Condition) 🌟
let currentFetchId = 0;

// 🌟 HYBRID FETCH LOGIC (សន្សំសំចៃ Reads វៃឆ្លាត) 🌟
const fetchDynamicSalesData = async (userId) => {
    if (allSales.value.length === 0) isLoading.value = true;
    const { startStr, endStr } = getDateRangeISO();

    // ផ្តាច់ listener ចាស់ចោលជានិច្ច មុនទាញថ្មី
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

    // 🟢 លក្ខខណ្ឌទី ១៖ ប្រសិនបើមើល "ថ្ងៃនេះ" ឱ្យវា Realtime (ស្តាប់ការលក់ថ្មីៗ)
    if (filterType.value === 'today') {
        unsubscribeSales = onSnapshot(salesQ, (snapshot) => {
            if (thisFetchId !== currentFetchId) return;
            let fetched = [];
            snapshot.docs.forEach(docSnap => {
                fetched.push({ id: docSnap.id, ...docSnap.data() });
            });
            allSales.value = fetched.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
            isLoading.value = false;
        }, (error) => {
            console.error("Error fetching realtime sales:", error);
            if (thisFetchId === currentFetchId) isLoading.value = false;
        });
    } 
    // 🟡 លក្ខខណ្ឌទី ២៖ ប្រសិនបើមើល "ប្រវត្តិ" ប្រើ Static Fetch (getDocs) សន្សំ Reads កប់ផ្លាត!
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
        } catch (error) {
            console.error("Error fetching static sales:", error);
            if (thisFetchId === currentFetchId) isLoading.value = false;
        }
    }
};

onMounted(() => {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            currentUserId = user.uid;
            try {
                // Fetch static reference data once
                const unitSnap = await getDocs(collection(db, 'settings_units'));
                availableUnits.value = unitSnap.docs.map(d => d.data());

                const snapSellers = await getDocs(query(collection(db, "users"), where("role", "in", ["seller", "dealer"]), where("createdBy", "==", user.uid)));
                sellers.value = snapSellers.docs.map(d => ({ id: d.id, ...d.data() }));

                const snapStocks = await getDocs(collection(db, 'stocks'));
                const arrStocks = snapStocks.docs.map(d => ({ id: d.id, ...d.data(), isCombo: false })).filter(i => !i.isDeleted);
                const snapCombos = await getDocs(collection(db, 'combos'));
                const arrCombos = snapCombos.docs.map(d => ({ id: d.id, ...d.data(), isCombo: true }));
                availableProducts.value = [...arrStocks, ...arrCombos];

                // ហៅទាញទិន្នន័យពេលចូលដំបូង
                fetchDynamicSalesData(user.uid);

            } catch (error) {
                console.error("Error fetching data:", error);
                isLoading.value = false;
            }
        }
    });
});

// Watcher ចាំទាញថ្មីពេលដូរ filter ថ្ងៃខែ
watch([filterType, specificDate, startDate, endDate], () => {
    currentPage.value = 1;
    if (currentUserId) fetchDynamicSalesData(currentUserId);
});

onUnmounted(() => {
    if (unsubscribeSales) unsubscribeSales();
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

// Local filtering is now only for search text
const filteredSales = computed(() => {
    let result = allSales.value;

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

watch(searchQuery, () => {
    currentPage.value = 1;
});

// Summary Stats
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

        // Count PP and Prov clients
        if (sale.receiptId) {
            if (sale.province === 'រាជធានីភ្នំពេញ' || (sale.location && sale.location.includes('ភ្នំពេញ'))) {
                ppClients.add(sale.receiptId);
            } else if (sale.province || (sale.location && !sale.location.includes('ទិញផ្ទាល់'))) {
                provClients.add(sale.receiptId);
            }
        }
    });

    return { 
        productsUSD, productsKHR, 
        deliveryUSD, deliveryKHR, 
        items,
        ppClients: ppClients.size,
        provClients: provClients.size
    };
});

const isSaleIncomplete = (sale) => {
    return !sale.customerName || sale.customerName === 'ទូទៅ' || !sale.customerPhone || !sale.location;
};

const expandedRows = ref(new Set());
const toggleExpand = (id) => {
    const newSet = new Set(expandedRows.value);
    if (newSet.has(id)) newSet.delete(id); else newSet.add(id);
    expandedRows.value = newSet;
};

// Actions
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

const markAsPaid = async (sale) => {
    if (sale.paymentStatus !== 'PENDING') return;
    try {
        await updateDoc(doc(db, 'sales_reports', sale.id), { paymentStatus: 'PAID' });
        emit('triggerAlert', 'success', 'ជោគជ័យ', 'វិក្កយបត្រត្រូវបានប្តូរទៅជា បានទូទាត់ រួចរាល់!');
        // 🌟 Local State Update សម្រាប់ Static History
        if (filterType.value !== 'today') {
            const idx = allSales.value.findIndex(s => s.id === sale.id);
            if (idx !== -1) allSales.value[idx].paymentStatus = 'PAID';
        }
    } catch (error) { emit('triggerAlert', 'error', 'បរាជ័យ', 'មិនអាចប្តូរស្ថានភាពបានទេ'); }
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
        // 🌟 Local State Update សម្រាប់ Static History
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
        // 🌟 Local State Update សម្រាប់ Static History
        if (filterType.value !== 'today') {
            const idx = allSales.value.findIndex(s => s.id === saleId);
            if (idx !== -1) {
                allSales.value[idx].paymentStatus = 'CANCELED';
                allSales.value[idx].cancelReason = cancelReason.value;
                allSales.value[idx].canceledAt = cancelDate;
            }
        }
        closeCancelModal();
    } catch (error) { emit('triggerAlert', 'error', 'បរាជ័យ', 'មានបញ្ហាក្នុងការបោះបង់វិក្កយបត្រ'); } 
    finally { isCanceling.value = false; }
};

// 🌟 1. មុខងារចម្លងអត្ថបទ (រក្សាទុកនៅដដែល)
const copyInvoiceText = (sale) => {
    let text = `🛒 វិក្កយបត្រ (INVOICE)\nលេខ: ${sale.receiptId}\nកាលបរិច្ឆេទ: ${formatKhmerDate(sale.createdAt)}\n--------------------------------\n👤 អតិថិជន: ${sale.customerName}\n📞 ទូរស័ព្ទ: ${sale.customerPhone}\n📍 ទីតាំង: ${sale.location}\n👨‍💼 អ្នកលក់: ${sale.sellerName}\n--------------------------------\n`;
    sale.items.forEach((item, i) => { text += `${i+1}. ${item.name} (${item.type === 'wholesale' ? 'ដុំ' : 'រាយ'})\n   ➔ ${item.qty} ${translateUnit(item.unit)} x $${item.price} = $${item.price * item.qty}\n`; });
    text += `--------------------------------\n💰 សរុបទំនិញ: $${Number(sale.totalAmount) - (sale.deliveryCurrency === 'USD' ? Number(sale.deliveryFee || 0) : 0)}\n`;
    if(sale.deliveryFee > 0) text += `🛵 ថ្លៃដឹកជញ្ជូន: ${sale.deliveryFee} ${sale.deliveryCurrency === 'USD' ? '$' : '៛'}\n`;
    text += `💳 សរុបរួម: $${sale.totalAmount}\n`;
    if(sale.paymentNote) text += `📝 ចំណាំ: ${sale.paymentNote}\n`;
    if(sale.paymentStatus === 'CANCELED') text += `\n❌ វិក្កយបត្រនេះត្រូវបានបោះបង់ (CANCELED) ❌\nមូលហេតុ: ${sale.cancelReason}`;

    navigator.clipboard.writeText(text).then(() => {
        emit('triggerAlert', 'success', 'ជោគជ័យ', 'បានចម្លងអត្ថបទវិក្កយបត្ររួចរាល់!');
    });
};

// 🌟 2. មុខងារ Share ទៅ Telegram (Safely formatted)
const shareToTelegram = (sale) => {
    try {
        if (!sale) {
            emit('triggerAlert', 'error', 'បរាជ័យ', 'មិនមានទិន្នន័យវិក្កយបត្រទេ');
            return;
        }
        const receiptId = sale.receiptId || 'N/A';
        const dateStr = formatKhmerDate(sale.createdAt) || 'N/A';
        const customerName = sale.customerName || 'ទូទៅ';
        const customerPhone = sale.customerPhone || 'N/A';
        const location = sale.location || 'N/A';
        const sellerName = sale.sellerName || 'N/A';

        let text = `🛒 វិក្កយបត្រ (INVOICE)\nលេខ: ${receiptId}\nកាលបរិច្ឆេទ: ${dateStr}\n--------------------------------\n👤 អតិថិជន: ${customerName}\n📞 ទូរស័ព្ទ: ${customerPhone}\n📍 ទីតាំង: ${location}\n👨‍💼 អ្នកលក់: ${sellerName}\n--------------------------------\n`;

        const items = sale.items || [];
        items.forEach((item, i) => {
            const name = item.name || 'មិនស្គាល់ទំនិញ';
            const typeLabel = item.type === 'wholesale' ? 'ដុំ' : 'រាយ';
            const qty = item.qty || 0;
            const unit = translateUnit(item.unit) || '';
            const price = Number(item.price || 0);
            const total = price * qty;
            text += `${i+1}. ${name} (${typeLabel})\n   ➔ ${qty} ${unit} x $${price} = $${total}\n`;
        });

        const totalAmount = Number(sale.totalAmount || 0);
        let productsTotal = totalAmount;
        const deliveryFee = Number(sale.deliveryFee || 0);
        const deliveryCurrency = sale.deliveryCurrency === 'USD' ? '$' : '៛';

        if ((sale.deliveryCurrency === 'USD' || sale.deliveryCurrency === '$') && deliveryFee > 0) {
            productsTotal -= deliveryFee;
        }

        text += `--------------------------------\n💰 សរុបទំនិញ: $${productsTotal}\n`;
        if (deliveryFee > 0) text += `🛵 ថ្លៃដឹកជញ្ជូន: ${deliveryFee} ${deliveryCurrency}\n`;
        text += `💳 សរុបរួម: $${totalAmount}\n`;

        if (sale.paymentNote) text += `📝 ចំណាំ: ${sale.paymentNote}\n`;
        if (sale.paymentStatus === 'CANCELED') text += `\n❌ វិក្កយបត្រនេះត្រូវបានបោះបង់ (CANCELED) ❌\nមូលហេតុ: ${sale.cancelReason || 'មិនមានបញ្ជាក់'}`;

        const encodedText = encodeURIComponent(text);
        window.open(`https://t.me/share/url?url=&text=${encodedText}`, '_blank', 'noopener,noreferrer');
    } catch (error) {
        console.error("Error generating Telegram share link:", error);
        emit('triggerAlert', 'error', 'បរាជ័យ', 'មានបញ្ហាក្នុងការបង្កើតទម្រង់ចែករំលែក');
    }
};

// EDIT MODAL LOGIC
const editModal = reactive({ isOpen: false, activeTab: 'info', saleId: null, receiptId: '' });
const isSaving = ref(false);
const editForm = reactive({ 
    sellerName: '', customerName: '', customerPhone: '', 
    province: '', district: '', paymentMethod: 'CASH', paymentStatus: 'PAID', 
    paymentNote: '', createdAt: '', deliveryFee: 0, deliveryCurrency: 'USD',
    items: [] 
});

const openEditModal = (sale) => {
    editModal.saleId = sale.id;
    editModal.receiptId = sale.receiptId || '';
    editModal.activeTab = 'info'; 

    editForm.sellerName = sale.sellerName || '';
    editForm.customerName = sale.customerName || '';
    editForm.customerPhone = sale.customerPhone || '';
    editForm.province = sale.province || '';
    editForm.district = sale.district || '';
    editForm.paymentMethod = sale.paymentMethod || 'CASH';
    editForm.paymentStatus = sale.paymentStatus || 'PAID';
    editForm.paymentNote = sale.paymentNote || '';
    
    editForm.deliveryFee = sale.deliveryFee || 0;
    editForm.deliveryCurrency = sale.deliveryCurrency || 'USD';
    editForm.items = JSON.parse(JSON.stringify(sale.items || []));

    if (sale.createdAt) {
        const dateObj = new Date(sale.createdAt);
        const tzoffset = dateObj.getTimezoneOffset() * 60000;
        editForm.createdAt = (new Date(dateObj - tzoffset)).toISOString().slice(0, 16);
    } else { editForm.createdAt = ''; }
    
    editModal.isOpen = true;
    miniPosSearchQuery.value = '';
};

const filteredMiniPosProducts = computed(() => {
    if (!miniPosSearchQuery.value) return [];
    const q = miniPosSearchQuery.value.toLowerCase();
    return availableProducts.value.filter(p => p.name && p.name.toLowerCase().includes(q) || (p.barcode && p.barcode.toLowerCase().includes(q)));
});

const addItemToEditForm = (product) => {
    const newItem = {
        id: product.id, name: product.name, image: product.image || '',
        price: product.retailPrice || 0, qty: 1, type: 'លក់រាយ', 
        unit: product.isCombo ? 'set' : (product.retailUnit || 'bottle'),
        isCombo: !!product.isCombo, cost: product.unitCost || 0
    };
    editForm.items.push(newItem);
    miniPosSearchQuery.value = ''; 
    emit('triggerAlert', 'success', 'ជោគជ័យ', `បានបន្ថែម ${product.name}`);
};

const removeItemFromEdit = (index) => { editForm.items.splice(index, 1); };

const editFormProductsTotal = computed(() => {
    return editForm.items.reduce((sum, item) => sum + (Number(item.price||0) * Number(item.qty||0)), 0);
});

const saveEdit = async () => {
    isSaving.value = true;
    try {
        const payloadToUpdate = { ...editForm };
        if (editForm.createdAt) payloadToUpdate.createdAt = new Date(editForm.createdAt).toISOString();
        payloadToUpdate.location = `${editForm.district}, ${editForm.province}`;
        
        const productsSum = editFormProductsTotal.value;
        const dFee = Number(editForm.deliveryFee) || 0;
        if (editForm.deliveryCurrency === 'USD') {
            payloadToUpdate.totalAmount = productsSum + dFee;
        } else {
            payloadToUpdate.totalAmount = productsSum; 
        }

        await updateDoc(doc(db, 'sales_reports', editModal.saleId), payloadToUpdate);
        
        // 🌟 Local State Update សម្រាប់ Static History
        if (filterType.value !== 'today') {
            const idx = allSales.value.findIndex(s => s.id === editModal.saleId);
            if (idx !== -1) allSales.value[idx] = { ...allSales.value[idx], ...payloadToUpdate };
        }

        editModal.isOpen = false;
        emit('triggerAlert', 'success', 'ជោគជ័យ', 'កែប្រែព័ត៌មានបានជោគជ័យ');
    } catch (error) {
        emit('triggerAlert', 'error', 'បរាជ័យ', 'មិនអាចកែប្រែបានទេ');
    } finally { isSaving.value = false; }
};

const generateSingleInvoiceHTML = (sale) => {
    let itemsHTML = '';
    sale.items.forEach((item, index) => {
        itemsHTML += `
            <tr style="border-bottom: 1px dashed #e2e8f0; ${sale.paymentStatus === 'CANCELED' ? 'opacity: 0.6;' : ''}">
                <td style="padding: 12px 10px; text-align: center; color: #64748b; font-family: 'Battambong', sans-serif;">${index + 1}</td>
                <td style="padding: 12px 10px; font-weight: bold; color: #1e293b; font-family: 'Battambong', sans-serif;">
                    ${item.name} <span style="font-size: 10px; color: #94a3b8; font-weight: normal;">(${item.type === 'wholesale' ? 'ដុំ' : 'រាយ'})</span>
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

// --- PRINT / PDF LOGIC ---
const getReportDateTitle = () => {
    if (filterType.value === 'today') return 'ប្រចាំថ្ងៃនេះ';
    if (filterType.value === 'month') return 'ប្រចាំខែនេះ';
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
            `<span style="display:inline-block; margin-right:5px; font-size:10px;">• ${p.name||'ទំនិញ'} <strong style="color:#4f46e5;">(${p.qty} ${translateUnit(p.unit)})</strong> [${p.type==='wholesale'?'ដុំ':'រាយ'}]</span>`
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
        <div class="print-layout" style="width: 1000px; padding: 40px; background: white; font-family: 'Battambong', sans-serif; color: #1e293b;">
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
        <style>@page { size: A4 portrait; margin: 10mm; } body { font-family: 'Battambong', sans-serif; -webkit-print-color-adjust: exact !important; margin: 0; }</style>
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
        
        processing.value.progress = 60;
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
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Battambong:wght@400;700;900&display=swap');
.font-khmer { font-family: 'Battambong', sans-serif; }
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