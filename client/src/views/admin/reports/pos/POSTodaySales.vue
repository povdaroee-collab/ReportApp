<template>
  <div class="min-h-[100dvh] bg-[#F4F7FE] font-khmer flex flex-col relative print-container print:bg-white pb-32">
    
    <div class="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm print:hidden">
        <div class="max-w-[90rem] mx-auto px-4 md:px-8 py-4 flex items-center justify-between gap-4">
            <div class="flex items-center gap-4">
                <button @click="goBack" class="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                </button>
                <div class="flex items-center gap-3" v-if="seller">
                    <img :src="seller.photoUrl || `https://ui-avatars.com/api/?name=${seller.fullName}`" class="w-10 h-10 rounded-full object-cover border border-slate-200">
                    <div>
                        <h1 class="font-black text-slate-800 text-lg leading-tight">{{ seller.fullName }}</h1>
                        <p class="text-xs font-bold text-slate-500">ID: {{ seller.idNumber || 'N/A' }} | លម្អិតការលក់</p>
                    </div>
                </div>
            </div>
            
            <div class="flex items-center gap-2" v-if="!isLoading">
                <button @click="executeNativePrint" class="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-slate-700 transition-colors shadow-sm">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2-2v4h10z"></path></svg>
                    Print
                </button>
                <button @click="generatePDF" class="flex items-center gap-2 bg-rose-500 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-rose-600 transition-colors shadow-sm">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    PDF
                </button>
            </div>
        </div>
    </div>

    <div v-if="isLoading" class="flex-1 flex flex-col items-center justify-center py-32 opacity-60 print:hidden">
       <div class="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-indigo-600 mb-4"></div>
       <p class="text-slate-500 font-bold tracking-wide">កំពុងទាញយកទិន្នន័យលម្អិត...</p>
    </div>

    <div v-else class="flex-1 w-full max-w-[90rem] mx-auto p-4 md:p-8 print:p-0 animate-fade-in-up">
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6 print:hidden">
            <div class="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-[20px] p-6 text-white shadow-lg shadow-blue-500/20 relative overflow-hidden">
                <div class="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
                <div class="relative z-10">
                    <p class="text-blue-100 text-[11px] font-black uppercase tracking-widest mb-1 flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> ចំណូលថ្ងៃនេះ
                    </p>
                    <h3 class="text-3xl font-black">{{ todayTotalUSD.toLocaleString() }} <span class="text-lg opacity-80">$</span></h3>
                    <p class="text-sm font-bold opacity-90 mt-1">{{ todayTotalKHR.toLocaleString() }} ៛</p>
                </div>
            </div>
            <div class="bg-white rounded-[20px] p-6 border border-slate-200/80 shadow-sm flex flex-col justify-center">
                <p class="text-slate-400 text-[11px] font-black uppercase tracking-widest mb-1">វិក្កយបត្រជោគជ័យសរុប</p>
                <div class="flex items-center justify-between">
                    <h3 class="text-3xl font-black text-slate-800">{{ validSales.length }} <span class="text-sm text-slate-400 font-bold">វិក្កយបត្រ</span></h3>
                    <div class="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-[14px] flex items-center justify-center">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    </div>
                </div>
            </div>
            <div class="bg-white rounded-[20px] p-6 border border-slate-200/80 shadow-sm flex flex-col justify-center">
                <p class="text-slate-400 text-[11px] font-black uppercase tracking-widest mb-1">បរិមាណទំនិញលក់ចេញ</p>
                <div class="flex items-center justify-between">
                    <h3 class="text-3xl font-black text-slate-800">{{ todayTotalItems }} <span class="text-sm text-slate-400 font-bold">ឯកតា</span></h3>
                    <div class="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-[14px] flex items-center justify-center">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex flex-col lg:flex-row items-end lg:items-center justify-between gap-4 mb-4 bg-white p-3 sm:pl-5 sm:pr-3 rounded-[16px] shadow-sm border border-slate-200/80 w-full print:hidden">
            <h2 class="text-base font-black text-slate-800 flex items-center gap-2 w-full lg:w-auto">
                បញ្ជីលក់ប្រចាំថ្ងៃ <span class="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-lg text-xs">{{ new Date().toLocaleDateString('km-KH') }}</span>
            </h2>
            
            <div class="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                <div class="relative w-full sm:w-64">
                    <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                    <input v-model="searchQuery" type="text" placeholder="ស្វែងរកអតិថិជន ឬ វិក្កយបត្រ..." class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all">
                </div>
            </div>
        </div>

        <div v-if="filteredSales.length === 0" class="py-24 bg-white/50 backdrop-blur-sm rounded-[24px] border-2 border-dashed border-slate-200 text-center animate-fade-in print:hidden">
            <div class="w-16 h-16 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            </div>
            <p class="text-lg font-black text-slate-600">មិនទាន់មានការលក់ទេ</p>
            <p class="text-sm text-slate-400 mt-1">រង់ចាំការបញ្ជាទិញថ្មីពីអតិថិជន...</p>
        </div>

        <div v-else class="flex flex-col gap-3 animate-fade-in print:hidden">
            <div v-for="sale in filteredSales" :key="sale.id" class="bg-white rounded-[20px] border shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden group transition-all" :class="sale.paymentStatus === 'CANCELED' ? 'border-rose-200 bg-rose-50/30' : 'border-slate-200/80 hover:border-indigo-300'">
                
                <div class="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors" @click="toggleExpand(sale.id)">
                    
                    <div class="flex items-center gap-4 w-full sm:w-auto" :class="{'opacity-70': sale.paymentStatus === 'CANCELED'}">
                        <div class="w-12 h-12 rounded-[14px] flex items-center justify-center border shrink-0 transition-colors" :class="sale.paymentStatus === 'CANCELED' ? 'bg-slate-200 text-slate-500 border-slate-300' : (expandedRows.has(sale.id) ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/30' : 'bg-slate-50 text-indigo-500 border-slate-200 group-hover:bg-white')">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center gap-2 mb-1">
                                <h3 class="font-black text-sm sm:text-base line-clamp-1" :class="sale.paymentStatus === 'CANCELED' ? 'text-slate-500 line-through' : 'text-slate-800'">{{ sale.customerName || 'អតិថិជនទូទៅ' }}</h3>
                                
                                <span v-if="sale.paymentStatus === 'PAID'" class="bg-emerald-50 text-emerald-600 text-[9px] px-1.5 py-0.5 rounded border border-emerald-200 font-black shrink-0">PAID</span>
                                <span v-else-if="sale.paymentStatus === 'CANCELED'" class="bg-rose-100 text-rose-600 text-[9px] px-1.5 py-0.5 rounded border border-rose-200 font-black shrink-0">CANCELED</span>
                                <span v-else class="bg-amber-50 text-amber-600 text-[9px] px-1.5 py-0.5 rounded border border-amber-200 font-black shrink-0">PENDING</span>
                            </div>
                            <div class="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                                <span class="font-mono px-1.5 rounded" :class="sale.paymentStatus === 'CANCELED' ? 'text-slate-500 bg-slate-200' : 'text-indigo-500 bg-indigo-50'">{{ sale.receiptId || 'N/A' }}</span>
                                <span class="w-1 h-1 rounded-full bg-slate-300 hidden sm:block"></span>
                                <span>{{ formatTime(sale.createdAt) }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center justify-between w-full sm:w-auto gap-4 border-t sm:border-none border-slate-100 pt-3 sm:pt-0">
                        <div class="text-left sm:text-right flex-1 sm:flex-none">
                            <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">សរុប (Total)</p>
                            <p class="font-black text-lg leading-none" :class="sale.paymentStatus === 'CANCELED' ? 'text-slate-400 line-through' : 'text-emerald-600'">{{ Number(sale.totalAmount).toLocaleString() }} $</p>
                        </div>
                        
                        <div class="flex items-center gap-1.5">
                            
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
                        <div v-for="(item, i) in sale.items" :key="i" class="flex items-center justify-between bg-white p-2.5 rounded-xl border shadow-sm" :class="sale.paymentStatus === 'CANCELED' ? 'border-rose-100 opacity-80' : 'border-slate-200'">
                            <div class="flex items-center gap-3">
                                <img v-if="item.image" :src="item.image" class="w-10 h-10 rounded-lg object-cover border border-slate-100 bg-slate-50 shrink-0">
                                <div v-else class="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 shrink-0"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg></div>
                                <div>
                                    <p class="text-xs font-bold text-slate-800 line-clamp-1" :class="{'line-through': sale.paymentStatus === 'CANCELED'}">{{ item.name }}</p>
                                    <p class="text-[10px] font-black text-slate-400 mt-0.5 flex items-center gap-1">
                                        <span class="text-indigo-500">{{ item.price }} $</span> 
                                        <svg class="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"/></svg> 
                                        <span>{{ item.qty }} {{ translateUnit(item.unit) }}</span>
                                        <span class="bg-slate-100 px-1.5 py-0.5 rounded text-[8px] text-slate-500 ml-1">{{ item.type === 'wholesale' ? 'បោះដុំ' : 'លក់រាយ' }}</span>
                                    </p>
                                </div>
                            </div>
                            <div class="font-black text-sm pl-4" :class="sale.paymentStatus === 'CANCELED' ? 'text-slate-400 line-through' : 'text-slate-700'">
                                {{ (Number(item.price) * Number(item.qty)).toLocaleString() }} $
                            </div>
                        </div>
                    </div>
                    
                    <div class="mt-4 pt-3 border-t grid grid-cols-2 gap-4 text-xs font-bold text-slate-600" :class="sale.paymentStatus === 'CANCELED' ? 'border-rose-100' : 'border-slate-200'">
                        <div>
                            <span class="text-slate-400 text-[10px] uppercase block mb-0.5">ទីតាំងអតិថិជន</span>
                            {{ sale.location || (sale.district && sale.province ? `${sale.district}, ${sale.province}` : 'មិនមាន') }}
                        </div>
                        <div class="text-right">
                            <span class="text-slate-400 text-[10px] uppercase block mb-0.5">ចំណាំការទូទាត់</span>
                            {{ sale.paymentNote || 'មិនមាន' }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div v-if="editModal.isOpen" class="fixed inset-0 z-[999] flex items-start justify-center p-4 pt-10 sm:pt-16 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
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
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">ឈ្មោះអតិថិជន</label>
                            <input v-model="editForm.customerName" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all">
                        </div>
                        <div>
                            <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">លេខទូរស័ព្ទ</label>
                            <input v-model="editForm.customerPhone" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">ខេត្ត/ក្រុង</label>
                            <input v-model="editForm.province" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all">
                        </div>
                        <div>
                            <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">សាខា (ស្រុក/ខណ្ឌ/ឃុំ)</label>
                            <input v-model="editForm.district" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">វិធីទូទាត់</label>
                            <select v-model="editForm.paymentMethod" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all cursor-pointer">
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

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">កាលបរិច្ឆេទ</label>
                            <input v-model="editForm.createdAt" type="datetime-local" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all cursor-pointer">
                        </div>
                        <div>
                            <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">ចំណាំបញ្ជាក់ការទូទាត់</label>
                            <input v-model="editForm.paymentNote" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all">
                        </div>
                    </div>
                </div>

                <div v-if="editModal.activeTab === 'items'" class="flex flex-col gap-3 animate-fade-in">
                    
                    <div v-if="editForm.items.length === 0" class="text-center py-10 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                        <p class="text-slate-400 font-bold text-sm">វិក្កយបត្រនេះមិនមានទំនិញទេ!</p>
                    </div>

                    <div v-for="(item, index) in editForm.items" :key="index" class="bg-white border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:border-indigo-300 transition-colors relative group">
                        
                        <button @click="removeItemFromEdit(index)" class="absolute -top-2 -right-2 w-6 h-6 bg-white border border-rose-200 text-rose-500 rounded-full shadow-sm flex items-center justify-center hover:bg-rose-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100" title="លុបទំនិញនេះចេញ">
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>

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
                                <input v-model.number="item.price" type="number" step="0.01" min="0" class="w-full h-full bg-transparent border-none text-sm font-black text-slate-800 text-center focus:ring-0 px-1 outline-none">
                            </div>
                            
                            <span class="text-slate-300 font-bold text-xs hidden sm:block">x</span>

                            <div class="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden h-9 shadow-sm w-28">
                                <button @click="item.qty = Math.max(1, item.qty - 1)" type="button" class="w-8 h-full bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition-colors flex items-center justify-center font-bold border-r border-slate-200">−</button>
                                <input v-model.number="item.qty" type="number" min="1" class="w-full h-full text-center bg-transparent border-none font-black text-sm text-slate-800 focus:ring-0 p-0 outline-none">
                                <button @click="item.qty++" type="button" class="w-8 h-full bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition-colors flex items-center justify-center font-bold border-l border-slate-200">+</button>
                            </div>

                            <div class="w-full sm:w-20 text-right sm:text-center mt-1 sm:mt-0">
                                <span class="font-black text-emerald-600">{{ (item.price * item.qty).toLocaleString() }} $</span>
                            </div>
                        </div>
                    </div>

                    <div class="mt-4 bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex justify-between items-center">
                        <span class="font-black text-indigo-800 text-sm">សរុបប្រាក់ថ្មី (New Total):</span>
                        <span class="font-black text-xl text-indigo-700">{{ editFormNewTotal.toLocaleString() }} $</span>
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

    <div v-if="deleteModal.isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in print:hidden">
        <div class="bg-white rounded-[24px] w-full max-w-sm shadow-2xl overflow-hidden animate-slide-up text-center p-6 md:p-8 relative">
            <div class="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner border-[6px] border-white ring-1 ring-rose-100">
                <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16M10 11v6M14 11v6"/></svg>
            </div>
            <h3 class="text-xl font-black text-slate-800 mb-2">តើអ្នកពិតជាចង់លុបមែនទេ?</h3>
            <p class="text-sm font-bold text-slate-500 mb-8 leading-relaxed">
                វិក្កយបត្រលេខ <span class="text-rose-500 font-mono bg-rose-50 px-1.5 py-0.5 rounded">{{ deleteModal.sale?.receiptId }}</span> នឹងត្រូវលុបចេញពីប្រព័ន្ធ។<br>សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។
            </p>
            <div class="flex items-center gap-3">
                <button @click="deleteModal.isOpen = false" class="flex-1 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">បោះបង់</button>
                <button @click="executeDelete" :disabled="isDeleting" class="flex-1 py-3 rounded-xl font-black text-white bg-rose-500 hover:bg-rose-600 shadow-md shadow-rose-500/30 transition-all active:scale-95 disabled:opacity-50 flex justify-center items-center gap-2">
                    <svg v-if="isDeleting" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <span>យល់ព្រមលុប</span>
                </button>
            </div>
        </div>
    </div>

    <div v-if="cancelModal.isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in print:hidden">
        <div class="bg-white rounded-[24px] w-full max-w-md shadow-2xl overflow-hidden animate-slide-up flex flex-col">
            <div class="px-6 py-5 border-b border-rose-100 bg-rose-50 flex items-center justify-between">
                <h3 class="text-lg font-black text-rose-700 flex items-center gap-2">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    បញ្ជាក់ការបោះបង់វិក្កយបត្រ
                </h3>
                <button @click="closeCancelModal" class="text-rose-400 hover:text-rose-600 transition-colors">
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
            
            <div class="p-6">
                <p class="text-sm font-bold text-slate-600 mb-4 leading-relaxed">
                    តើអ្នកពិតជាចង់បោះបង់វិក្កយបត្រ <span class="font-black text-slate-800 bg-slate-100 px-1.5 rounded">{{ cancelModal.sale?.receiptId }}</span> របស់អតិថិជន <span class="font-black text-slate-800">{{ cancelModal.sale?.customerName }}</span> មែនទេ? <br><br>
                    <span class="text-rose-600 bg-rose-50 px-2 py-1 rounded inline-block mt-1">ចំណាំ៖ ទំនិញចំនួន {{ cancelModal.sale?.items?.length }} មុខនឹងត្រូវបង្វិលចូលក្នុងស្តុកវិញដោយស្វ័យប្រវត្តិ។</span>
                </p>

                <div>
                    <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">មូលហេតុនៃការបោះបង់ <span class="text-rose-500">*</span></label>
                    <textarea 
                        v-model="cancelReason" 
                        rows="3" 
                        placeholder="ឧទាហរណ៍៖ អតិថិជនប្តូរចិត្ត, វាយបញ្ចូលទិន្នន័យខុស..." 
                        class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-bold text-sm focus:bg-white focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 outline-none transition-all resize-none"
                    ></textarea>
                </div>
            </div>

            <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                <button type="button" @click="closeCancelModal" class="px-6 py-2.5 rounded-xl font-bold text-slate-600 bg-white border border-slate-300 hover:bg-slate-100 transition-colors text-sm">បិទវិញ</button>
                <button type="button" @click="confirmCancel" :disabled="isCanceling" class="px-6 py-2.5 rounded-xl font-black text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-500/30 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2 text-sm">
                    <svg v-if="isCanceling" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    បាទ, បោះបង់ និងបង្វិលស្តុក
                </button>
            </div>
        </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive, defineEmits, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { db, auth } from '@/firebaseConfig';
import { doc, getDoc, collection, query, where, getDocs, deleteDoc, updateDoc, increment } from 'firebase/firestore'; 
import { onAuthStateChanged } from 'firebase/auth';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const emit = defineEmits(['triggerAlert']);

const route = useRoute();
const router = useRouter();
const sellerId = route.params.id; 

const isLoading = ref(true);
const seller = ref(null);
const allDetailItems = ref([]);
const unitSettings = ref([]);
const searchQuery = ref('');
const adminName = ref(''); 
const expandedRows = ref(new Set());
const todaySales = ref([]);

const printStaging = ref(null);
const invoiceStaging = ref(null);
const processing = ref({ active: false, message: '', progress: 0 });

const getTodayPrefix = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};

const fetchTodayData = async () => {
    isLoading.value = true;
    try {
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        adminName.value = currentUser.displayName || 'Admin';

        // 1. Fetch Seller Data if ID provided in route
        if (sellerId) {
            const sellerDoc = await getDoc(doc(db, 'users', sellerId));
            if (sellerDoc.exists()) seller.value = { id: sellerDoc.id, ...sellerDoc.data() };
        }

        // 2. Fetch Units
        const unitSnap = await getDocs(collection(db, 'settings_units'));
        unitSettings.value = unitSnap.docs.map(d => d.data());

        // 3. Fetch Sales Data
        const salesSnap = await getDocs(collection(db, 'sales_reports'));
        const todayStr = getTodayPrefix();
        
        let fetchedData = [];
        salesSnap.docs.forEach(docSnap => {
            const data = docSnap.data();
            
            // Allow if createdBy matches OR if sellerId matches
            let isRelevantSale = false;
            if (sellerId) {
                isRelevantSale = ((data.uid === sellerId) || (data.sellerId === sellerId) || (data.sellerName === seller.value?.fullName));
            } else {
                isRelevantSale = data.createdBy === currentUser.uid && data.createdAt && data.createdAt.startsWith(todayStr);
            }

            if (isRelevantSale) {
                fetchedData.push({ id: docSnap.id, ...data });
            }
        });

        todaySales.value = fetchedData.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
        allDetailItems.value = todaySales.value; // Map for legacy support in code if needed
        
    } catch (error) {
        emit('triggerAlert', 'error', 'បរាជ័យ', 'មិនអាចទាញយកទិន្នន័យបានទេ');
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    onAuthStateChanged(auth, (user) => { if (user) fetchTodayData(); });
});

const goBack = () => {
    router.back();
};

const formatDate = (dateStr) => {
    if(!dateStr) return '';
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('km-KH', { day: '2-digit', month: 'short', year: 'numeric' }).format(d);
};

const formatTime = (dateStr) => {
    if(!dateStr) return '';
    return new Date(dateStr).toLocaleTimeString('km-KH', { hour: '2-digit', minute: '2-digit' });
};

const formatKhmerDate = (dateStr) => {
    if(!dateStr) return '';
    const date = new Date(dateStr);
    const months = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'];
    return `${String(date.getDate()).padStart(2, '0')}-${months[date.getMonth()]}-${date.getFullYear()}`;
};

const translateUnit = (unitVal) => {
    if (!unitVal) return '';
    const safeVal = String(unitVal);
    const found = unitSettings.value.find(u => String(u.value) === safeVal);
    if (found) return found.label;
    const u = safeVal.toLowerCase().trim();
    if (u === 'bottle' || u === 'bottles') return 'ដប';
    if (u === 'pack' || u === 'packs') return 'កញ្ចប់';
    if (u === 'case' || u === 'cases') return 'កេះ';
    return safeVal; 
};

// ស្វែងរក
const filteredSales = computed(() => {
    if (!searchQuery.value) return todaySales.value;
    const q = searchQuery.value.toLowerCase().trim();
    return todaySales.value.filter(s => 
        (s.receiptId && s.receiptId.toLowerCase().includes(q)) || 
        (s.customerName && s.customerName.toLowerCase().includes(q)) ||
        (s.sellerName && s.sellerName.toLowerCase().includes(q))
    );
});

// សរុបរួម
const validSales = computed(() => todaySales.value.filter(s => s.paymentStatus !== 'CANCELED'));

const todayTotalUSD = computed(() => validSales.value.reduce((sum, s) => sum + (s.currency === 'USD' || !s.currency ? Number(s.totalAmount) : 0), 0));
const todayTotalKHR = computed(() => validSales.value.reduce((sum, s) => sum + (s.currency === 'KHR' || s.currency === '៛' ? Number(s.totalAmount) : 0), 0));
const todayTotalItems = computed(() => validSales.value.reduce((sum, s) => sum + (s.items?.reduce((qtySum, item) => qtySum + Number(item.qty), 0) || 0), 0));

const grandTotals = computed(() => {
    return { usd: todayTotalUSD.value, khr: todayTotalKHR.value };
});

const toggleExpand = (id) => {
    const newSet = new Set(expandedRows.value);
    if (newSet.has(id)) newSet.delete(id); else newSet.add(id);
    expandedRows.value = newSet;
};

// 🔥 --- NEW FEATURE: MARK AS PAID --- 🔥
const markAsPaid = async (sale) => {
    if (sale.paymentStatus !== 'PENDING') return;
    try {
        await updateDoc(doc(db, 'sales_reports', sale.id), {
            paymentStatus: 'PAID'
        });
        
        // Update local state instantly
        const index = todaySales.value.findIndex(s => s.id === sale.id);
        if (index !== -1) {
            todaySales.value[index].paymentStatus = 'PAID';
        }
        
        emit('triggerAlert', 'success', 'ជោគជ័យ', 'វិក្កយបត្រត្រូវបានប្តូរទៅជា បានទូទាត់ រួចរាល់!');
    } catch (error) {
        console.error("Error marking as paid: ", error);
        emit('triggerAlert', 'error', 'បរាជ័យ', 'មិនអាចប្តូរស្ថានភាពបានទេ សូមសាកល្បងម្តងទៀត។');
    }
};

// 🔥 --- NEW FEATURE: SHARE TO TELEGRAM --- 🔥
const shareToTelegram = (sale) => {
    let text = `🛒 វិក្កយបត្រ (INVOICE)\nលេខ: ${sale.receiptId}\nកាលបរិច្ឆេទ: ${formatKhmerDate(sale.createdAt)}\n--------------------------------\n👤 អតិថិជន: ${sale.customerName}\n📞 ទូរស័ព្ទ: ${sale.customerPhone}\n📍 ទីតាំង: ${sale.location}\n👨‍💼 អ្នកលក់: ${sale.sellerName}\n--------------------------------\n`;
    sale.items.forEach((item, i) => { text += `${i+1}. ${item.name} (${item.type === 'wholesale' ? 'ដុំ' : 'រាយ'})\n   ➔ ${item.qty} ${translateUnit(item.unit)} x $${item.price} = $${item.price * item.qty}\n`; });
    text += `--------------------------------\n💰 សរុបរួម: $${sale.totalAmount}\n💳 បង់ប្រាក់តាម: ${sale.paymentMethod} (${sale.paymentStatus === 'PAID' ? 'បានទូទាត់' : 'ជំពាក់'})\n`;
    if(sale.paymentNote) text += `📝 ចំណាំ: ${sale.paymentNote}\n`;
    
    // Create Telegram Share URL
    const encodedText = encodeURIComponent(text);
    const telegramUrl = `https://t.me/share/url?url=${encodedText}&text=`;
    
    window.open(telegramUrl, '_blank');
};


// --- DELETE ---
const deleteModal = reactive({ isOpen: false, sale: null });
const isDeleting = ref(false);

const openDeleteModal = (sale) => { deleteModal.sale = sale; deleteModal.isOpen = true; };

const executeDelete = async () => {
    if (!deleteModal.sale) return;
    isDeleting.value = true;
    try {
        await deleteDoc(doc(db, 'sales_reports', deleteModal.sale.id));
        todaySales.value = todaySales.value.filter(s => s.id !== deleteModal.sale.id);
        emit('triggerAlert', 'success', 'ជោគជ័យ', 'លុបវិក្កយបត្របានជោគជ័យ');
        deleteModal.isOpen = false;
    } catch (error) {
        emit('triggerAlert', 'error', 'បរាជ័យ', 'មិនអាចលុបបានទេ');
    } finally {
        isDeleting.value = false;
    }
};

// 🔥 --- ENHANCED EDIT (TABS + ITEMS EDITING) --- 🔥
const editModal = reactive({ isOpen: false, activeTab: 'info', saleId: null, receiptId: '' });
const isSaving = ref(false);
const editForm = reactive({ 
    customerName: '', customerPhone: '', 
    province: '', district: '', 
    paymentMethod: 'CASH', paymentStatus: 'PAID', 
    paymentNote: '', createdAt: '',
    items: [] // Deep copy array for editing
});

const openEditModal = (sale) => {
    editModal.saleId = sale.id;
    editModal.receiptId = sale.receiptId || '';
    editModal.activeTab = 'info'; // Default tab

    editForm.customerName = sale.customerName || '';
    editForm.customerPhone = sale.customerPhone || '';
    editForm.province = sale.province || '';
    editForm.district = sale.district || '';
    editForm.paymentMethod = sale.paymentMethod || 'CASH';
    editForm.paymentStatus = sale.paymentStatus || 'PAID';
    editForm.paymentNote = sale.paymentNote || '';
    
    // Create Deep Copy of Items so we don't mutate state before saving
    editForm.items = JSON.parse(JSON.stringify(sale.items || []));

    if (sale.createdAt) {
        const dateObj = new Date(sale.createdAt);
        const tzoffset = dateObj.getTimezoneOffset() * 60000;
        editForm.createdAt = (new Date(dateObj - tzoffset)).toISOString().slice(0, 16);
    } else {
        editForm.createdAt = '';
    }
    
    editModal.isOpen = true;
};

const removeItemFromEdit = (index) => {
    editForm.items.splice(index, 1);
};

const editFormNewTotal = computed(() => {
    return editForm.items.reduce((sum, item) => sum + (Number(item.price) * Number(item.qty)), 0);
});

const saveEdit = async () => {
    isSaving.value = true;
    try {
        const payloadToUpdate = { ...editForm };
        if (editForm.createdAt) payloadToUpdate.createdAt = new Date(editForm.createdAt).toISOString();
        payloadToUpdate.location = `${editForm.district}, ${editForm.province}`;
        
        // Recalculate Total based on edited items
        payloadToUpdate.totalAmount = editFormNewTotal.value;

        await updateDoc(doc(db, 'sales_reports', editModal.saleId), payloadToUpdate);
        
        // Update Local State
        const index = todaySales.value.findIndex(s => s.id === editModal.saleId);
        if(index !== -1) todaySales.value[index] = { ...todaySales.value[index], ...payloadToUpdate };
        
        editModal.isOpen = false;
        emit('triggerAlert', 'success', 'ជោគជ័យ', 'កែប្រែព័ត៌មានបានជោគជ័យ');
    } catch (error) {
        emit('triggerAlert', 'error', 'បរាជ័យ', 'មិនអាចកែប្រែបានទេ');
    } finally {
        isSaving.value = false;
    }
};

// 🔥 --- CANCEL LOGIC --- 🔥
const cancelModal = reactive({ isOpen: false, sale: null });
const cancelReason = ref('');
const isCanceling = ref(false);

const openCancelModal = (sale) => {
    cancelModal.sale = sale;
    cancelModal.isOpen = true;
    cancelReason.value = '';
};

const closeCancelModal = () => {
    cancelModal.isOpen = false;
    cancelModal.sale = null;
    cancelReason.value = '';
};

const confirmCancel = async () => {
    if (!cancelReason.value.trim()) {
        emit('triggerAlert', 'error', 'កំហុស', 'សូមបញ្ជាក់មូលហេតុនៃការបោះបង់!');
        return;
    }

    isCanceling.value = true;
    try {
        const saleId = cancelModal.sale.id;
        
        // 1. Update the sales_report document status to 'CANCELED'
        await updateDoc(doc(db, 'sales_reports', saleId), {
            paymentStatus: 'CANCELED',
            cancelReason: cancelReason.value,
            canceledAt: new Date().toISOString()
        });

        // 2. Return stock to the inventory for each item in the cart
        for (const item of cancelModal.sale.items) {
            const stockRef = doc(db, 'stocks', item.id);
            const stockSnap = await getDoc(stockRef);
            
            if (stockSnap.exists()) {
                const stockData = stockSnap.data();
                const perCase = Number(stockData.itemsPerCase) || 1;
                const qtyToReturn = item.qty / perCase; 

                await updateDoc(stockRef, {
                    quantity: increment(qtyToReturn)
                });
            }
        }

        // 3. Update the local Vue state directly to show immediate visual feedback
        const index = todaySales.value.findIndex(s => s.id === saleId);
        if (index !== -1) {
            todaySales.value[index].paymentStatus = 'CANCELED';
            todaySales.value[index].cancelReason = cancelReason.value;
            todaySales.value[index].canceledAt = new Date().toISOString();
        }

        emit('triggerAlert', 'success', 'ជោគជ័យ', 'វិក្កយបត្រត្រូវបានបោះបង់ និងស្តុកត្រូវបានបង្វិលវិញដោយជោគជ័យ');
        closeCancelModal();

    } catch (error) {
        console.error("Cancel Error:", error);
        emit('triggerAlert', 'error', 'បរាជ័យ', 'មានបញ្ហាក្នុងការបោះបង់វិក្កយបត្រ សូមសាកល្បងម្តងទៀត');
    } finally {
        isCanceling.value = false;
    }
};

// --- COPY INVOICE TEXT ---
const copyInvoiceText = (sale) => {
    let text = `🛒 វិក្កយបត្រ (INVOICE)\nលេខ: ${sale.receiptId}\nកាលបរិច្ឆេទ: ${formatKhmerDate(sale.createdAt)}\n--------------------------------\n👤 អតិថិជន: ${sale.customerName}\n📞 ទូរស័ព្ទ: ${sale.customerPhone}\n📍 ទីតាំង: ${sale.location}\n👨‍💼 អ្នកលក់: ${sale.sellerName}\n--------------------------------\n`;
    sale.items.forEach((item, i) => { text += `${i+1}. ${item.name} (${item.type === 'wholesale' ? 'ដុំ' : 'រាយ'})\n   ➔ ${item.qty} ${translateUnit(item.unit)} x $${item.price} = $${item.price * item.qty}\n`; });
    text += `--------------------------------\n💰 សរុបរួម: $${sale.totalAmount}\n💳 បង់ប្រាក់តាម: ${sale.paymentMethod}\n`;
    if(sale.paymentNote) text += `📝 ចំណាំ: ${sale.paymentNote}\n`;
    
    // Add Canceled note if applicable
    if(sale.paymentStatus === 'CANCELED') text += `\n❌ វិក្កយបត្រនេះត្រូវបានបោះបង់ (CANCELED) ❌\nមូលហេតុ: ${sale.cancelReason}`;

    navigator.clipboard.writeText(text).then(() => {
        emit('triggerAlert', 'success', 'ជោគជ័យ', 'បានចម្លងអត្ថបទវិក្កយបត្ររួចរាល់!');
    }).catch(() => {
        emit('triggerAlert', 'error', 'បរាជ័យ', 'មិនអាចចម្លងអត្ថបទបានទេ');
    });
};

// --- SAVE INVOICE AS IMAGE ---
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

    const watermark = sale.paymentStatus === 'CANCELED' 
        ? `<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 80px; font-weight: 900; color: rgba(225, 29, 72, 0.15); border: 8px solid rgba(225, 29, 72, 0.15); padding: 10px 40px; border-radius: 20px; z-index: 10; pointer-events: none;">CANCELED</div>` 
        : '';

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

            <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 30px; font-family: 'Battambong', sans-serif; position: relative; z-index: 20;">
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
                        <div style="border-top: 2px solid #cbd5e1; padding-top: 15px; display: inline-block; min-width: 200px;">
                            <div style="font-size: 20px; font-weight: 900; ${sale.paymentStatus === 'CANCELED' ? 'text-decoration: line-through; color: #94a3b8;' : ''}">
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
        invoiceStaging.value.innerHTML = '';
        processing.value.active = false;
    }
};

// --- PRINT & PDF REPORT LOGIC (FOR THE ENTIRE DAILY REPORT LIST) ---
const generateReportHTML = (isNativePrint = false) => {
    // Generate Report HTML Logic... (Kept identical to the original file)
    let rowsHTML = '';
    let totalRevenue = 0;

    filteredSales.value.forEach((sale, index) => {
        const isCanceled = sale.paymentStatus === 'CANCELED';
        if(!isCanceled) totalRevenue += Number(sale.totalAmount);
        
        let productsStr = '';
        if (sale.items && sale.items.length > 0) {
            productsStr = sale.items.map(p => 
                `<span style="display:inline-block; background:#eef2ff; color:#4338ca; border: 1px solid #e0e7ff; padding:2px 6px; border-radius:4px; font-size:10px; margin:2px; ${isCanceled ? 'opacity: 0.5; background: #f1f5f9; color: #64748b; border-color: #e2e8f0;' : ''}">
                    ${p.name} <span style="font-weight:900;">(${p.qty}${translateUnit(p.unit)})</span> <span style="color:#94a3b8;">[${p.type === 'wholesale' ? 'ដុំ' : 'រាយ'}]</span>
                </span>`
            ).join('');
        }

        let statusBadge = '';
        if (isCanceled) {
            statusBadge = `<span style="color:#e11d48; font-weight:bold; font-size: 10px; background: #fff1f2; padding: 2px 6px; border-radius: 4px;">CANCELED</span>`;
        } else if (sale.paymentStatus === 'PAID') {
            statusBadge = `<span style="color:#059669; font-weight:bold;">បានទូទាត់</span>`;
        } else {
            statusBadge = `<span style="color:#d97706; font-weight:bold;">ជំពាក់</span>`;
        }

        rowsHTML += `
            <tr style="border-bottom: 1px dashed #e2e8f0; break-inside: avoid; ${isCanceled ? 'background-color: #f8fafc;' : ''}">
                <td style="padding: 12px 10px; text-align: center; color: #64748b; font-weight: bold;">${index + 1}</td>
                <td style="padding: 12px 10px; ${isCanceled ? 'opacity: 0.6;' : ''}">
                    <div style="font-weight: 900; color: #1e293b; ${isCanceled ? 'text-decoration: line-through;' : ''}">${sale.receiptId}</div>
                    <div style="font-size: 11px; color: #64748b; margin-top: 2px;">${formatTime(sale.createdAt)}</div>
                    <div style="font-size: 11px; color: #3b82f6; font-weight: bold; margin-top: 2px;">អ្នកលក់: ${sale.sellerName || 'N/A'}</div>
                </td>
                <td style="padding: 12px 10px; ${isCanceled ? 'opacity: 0.6;' : ''}">
                    <div style="font-weight: bold; color: #1e293b; ${isCanceled ? 'text-decoration: line-through;' : ''}">${sale.customerName || 'ទូទៅ'}</div>
                    <div style="font-size: 11px; color: #64748b; margin-top: 2px;">${sale.customerPhone || ''}</div>
                </td>
                <td style="padding: 12px 10px;">${productsStr}</td>
                <td style="padding: 12px 10px; text-align: center;">${statusBadge}</td>
                <td style="padding: 12px 10px; text-align: right; font-weight: 900; font-size: 14px; ${isCanceled ? 'color: #94a3b8; text-decoration: line-through;' : 'color:#059669;'}">${Number(sale.totalAmount).toLocaleString()} $</td>
            </tr>
        `;
    });

    const pageStyles = isNativePrint
        ? `width: 100%; box-sizing: border-box; font-family: 'Battambong', sans-serif; line-height: 1.5; padding: 15px; background: white;`
        : `width: 1000px; padding: 40px; box-sizing: border-box; font-family: 'Battambong', sans-serif; line-height: 1.5; background: white;`;

    return `
        <div class="print-page" style="${pageStyles}">
            <div style="text-align: center; border-bottom: 2px solid #4f46e5; padding-bottom: 20px; margin-bottom: 25px;">
                <h1 style="font-size: 28px; font-weight: 900; color: #1e293b; margin: 0;">របាយការណ៍លក់ប្រចាំថ្ងៃ</h1>
                <div style="color: #64748b; font-size: 13px; margin: 8px 0 0 0; display: flex; justify-content: center; gap: 20px;">
                    <span>កាលបរិច្ឆេទ: <strong>${formatKhmerDate(new Date().toISOString())}</strong></span>
                    <span>•</span>
                    <span>ដោយ: <strong>${adminName.value}</strong></span>
                </div>
            </div>
            
            <table style="width: 100%; text-align: left; border-collapse: collapse; font-size: 12px; margin-bottom: 30px;">
                <thead style="background: #f1f5f9; color: #334155; font-size: 11px; text-transform: uppercase;">
                    <tr>
                        <th style="padding: 12px 10px; width: 5%; text-align: center; border-bottom: 2px solid #cbd5e1;">#</th>
                        <th style="padding: 12px 10px; width: 20%; border-bottom: 2px solid #cbd5e1;">វិក្កយបត្រ & តំណាងលក់</th>
                        <th style="padding: 12px 10px; width: 15%; border-bottom: 2px solid #cbd5e1;">អតិថិជន</th>
                        <th style="padding: 12px 10px; width: 35%; border-bottom: 2px solid #cbd5e1;">មុខទំនិញ (ប្រភេទ & ចំនួន)</th>
                        <th style="padding: 12px 10px; width: 10%; text-align: center; border-bottom: 2px solid #cbd5e1;">ស្ថានភាព</th>
                        <th style="padding: 12px 10px; width: 15%; text-align: right; border-bottom: 2px solid #cbd5e1;">សរុប ($)</th>
                    </tr>
                </thead>
                <tbody>
                    ${rowsHTML}
                </tbody>
            </table>

            <div style="border: 1px solid #e2e8f0; border-radius: 12px; background: #f8fafc; padding: 20px; text-align: right; width: 300px; margin-left: auto;">
                <div style="color: #64748b; font-size: 13px; font-weight: bold; margin-bottom: 5px;">សរុបចំណូលរួម (មិនរាប់បញ្ចូលវិក្កយបត្រ Canceled)</div>
                <div style="color: #059669; font-size: 24px; font-weight: 900;">${totalRevenue.toLocaleString()} $</div>
            </div>
        </div>
    `;
};

const executeNativePrint = () => {
    const contentHTML = generateReportHTML(true);
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute'; iframe.style.width = '0'; iframe.style.height = '0'; iframe.style.border = 'none';
    document.body.appendChild(iframe);
    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
        <html><head><title>Daily Report</title>
        <link href="https://fonts.googleapis.com/css2?family=Battambong:wght@400;700;900&display=swap" rel="stylesheet">
        <style>@page { size: A4 portrait; margin: 10mm; } body { font-family: 'Battambong', sans-serif; -webkit-print-color-adjust: exact !important; }</style>
        </head><body>${contentHTML}</body></html>
    `);
    doc.close();
    iframe.contentWindow.document.fonts.ready.then(() => {
        iframe.contentWindow.focus(); iframe.contentWindow.print();
        setTimeout(() => { document.body.removeChild(iframe); }, 1000);
    });
};

const generatePDF = async () => {
    processing.value = { active: true, message: 'កំពុងរៀបចំឯកសារ PDF...', progress: 30 };
    try {
        printStaging.value.innerHTML = generateReportHTML(false);
        await nextTick(); await document.fonts.ready; await new Promise(r => setTimeout(r, 500)); 
        
        processing.value.progress = 60;
        const canvas = await html2canvas(printStaging.value.querySelector('.print-page'), { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        
        const pdf = new jsPDF('p', 'mm', 'a4'); 
        const pdfWidth = 210; 
        const propsImg = pdf.getImageProperties(imgData);
        const pdfHeight = (propsImg.height * pdfWidth) / propsImg.width;
        
        processing.value.progress = 90;
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Daily_Sales_${getTodayPrefix()}.pdf`);
        
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
.animate-fade-in-up { animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
@media print { .print\:hidden { display: none !important; } }
</style>