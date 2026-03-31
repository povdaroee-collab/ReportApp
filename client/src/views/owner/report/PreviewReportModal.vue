<template>
    <transition enter-active-class="duration-300 ease-out" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100" leave-active-class="duration-200 ease-in" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
        <div v-if="show" class="fixed inset-0 z-[999999] flex items-center justify-center p-2 sm:p-6 bg-slate-900/80 backdrop-blur-md font-khmer overflow-hidden">
            
            <div class="bg-white rounded-[24px] w-full h-full max-w-[1800px] shadow-2xl relative flex flex-col xl:flex-row overflow-hidden border border-white/20">
                
                <div class="w-full xl:w-[460px] bg-slate-50 flex flex-col shrink-0 border-r border-slate-200 z-20">
                    
                    <div class="px-6 py-5 bg-white border-b border-slate-200 shrink-0">
                        <div class="flex items-center justify-between mb-1">
                            <h2 class="font-black text-xl text-indigo-900 flex items-center gap-3">
                                <div class="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-sm">
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                                </div>
                                កំណត់របាយការណ៍
                            </h2>
                            <button @click="$emit('close')" class="xl:hidden w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
                            </button>
                        </div>
                        <p class="text-[13px] font-bold text-slate-500 pl-[52px]">{{ dateLabel }}</p>
                    </div>

                    <div class="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6">
                        
                        <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                            <div class="bg-indigo-50/50 px-4 py-3 border-b border-indigo-100 flex items-center gap-2 cursor-pointer hover:bg-indigo-50 transition-colors" @click="uiState.showAdminGroup = !uiState.showAdminGroup">
                                <span class="w-6 h-6 rounded-full bg-indigo-200 text-indigo-700 flex items-center justify-center text-[11px] font-black shrink-0">1</span>
                                <h4 class="text-[13px] font-black text-indigo-800 uppercase tracking-widest flex-1">ជ្រើសរើសអ្នកគ្រប់គ្រង</h4>
                                <svg class="w-5 h-5 text-indigo-400 transition-transform duration-300" :class="uiState.showAdminGroup ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                            
                            <transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="opacity-0 max-h-0" enter-to-class="opacity-100 max-h-[400px]" leave-active-class="transition-all duration-200 ease-in" leave-from-class="opacity-100 max-h-[400px]" leave-to-class="opacity-0 max-h-0">
                                <div v-show="uiState.showAdminGroup" class="p-2 overflow-hidden">
                                    <label class="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-indigo-50/50 transition-colors border border-transparent hover:border-indigo-100 group">
                                        <input type="checkbox" :checked="isAllAdminsSelected" @change="toggleAllAdmins" class="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 border-slate-300 cursor-pointer">
                                        <span class="font-black text-sm text-slate-700 group-hover:text-indigo-700 transition-colors">👉 ទាំងអស់ (All Admins)</span>
                                    </label>
                                    <div class="h-px bg-slate-100 mx-3 my-1"></div>
                                    <div class="max-h-[160px] overflow-y-auto custom-scrollbar px-1 py-1">
                                        <div v-if="adminsWithSalesOnly.length === 0" class="text-center p-4 text-xs font-bold text-slate-400">
                                            មិនមានអ្នកគ្រប់គ្រងដែលមានរបាយការណ៍លក់ទេ
                                        </div>
                                        <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            <label v-for="admin in adminsWithSalesOnly" :key="admin.id" class="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 cursor-pointer hover:bg-white hover:border-indigo-200 hover:shadow-sm transition-all">
                                                <input type="checkbox" :value="admin.originalAdminId" v-model="localSelectedAdmins" class="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 border-slate-300 cursor-pointer">
                                                <span class="font-bold text-[13px] text-slate-700 truncate">{{ admin.fullName }}</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </transition>
                        </div>

                        <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden relative">
                            <div class="px-4 py-3 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
                                <span class="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[11px] font-black shrink-0">2</span>
                                <h4 class="text-[13px] font-black text-slate-600 uppercase tracking-widest">កំណត់ទិន្នន័យបង្ហាញ (9 Options)</h4>
                            </div>

                            <div class="border-b border-slate-100">
                                <div class="px-4 py-3 bg-indigo-50/20 flex items-center justify-between cursor-pointer hover:bg-indigo-50/50 transition-colors" @click="toggleTableGroupUI">
                                    <div class="flex items-center gap-2 flex-1">
                                        <span class="font-black text-[13px] text-indigo-700 tracking-wider">ផ្នែកតារាងចំណូលតំណាងលក់</span>
                                    </div>
                                    <div class="flex items-center gap-3">
                                        <div class="relative inline-flex items-center h-5 rounded-full w-9 shrink-0 transition-colors duration-200 cursor-pointer" :class="isAllTableGroupChecked ? 'bg-indigo-600' : 'bg-slate-300'" @click.stop="toggleTableGroupOptions">
                                            <span class="inline-block w-3.5 h-3.5 transform bg-white rounded-full transition duration-200 shadow-sm pointer-events-none" :class="isAllTableGroupChecked ? 'translate-x-4.5' : 'translate-x-1'"></span>
                                        </div>
                                        <svg class="w-5 h-5 text-indigo-400 transition-transform duration-300" :class="uiState.showTableGroup ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                                
                                <transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="opacity-0 max-h-0" enter-to-class="opacity-100 max-h-[500px]" leave-active-class="transition-all duration-200 ease-in" leave-from-class="opacity-100 max-h-[500px]" leave-to-class="opacity-0 max-h-0">
                                    <div v-show="uiState.showTableGroup" class="p-3 bg-white grid grid-cols-1 sm:grid-cols-2 gap-2.5 overflow-hidden">
                                        <label class="relative flex items-start justify-between p-3 rounded-xl border-2 transition-all cursor-pointer select-none" :class="exportConfig.showAdminTable ? 'bg-indigo-50 border-indigo-400 shadow-sm' : 'bg-white border-slate-200 hover:border-indigo-200'" @click="resetInactivityTimer">
                                            <div class="flex-1 pr-2">
                                                <h5 class="font-black text-[12px] mb-0.5 leading-tight" :class="exportConfig.showAdminTable ? 'text-indigo-900' : 'text-slate-700'">តារាងមេ សរុប</h5>
                                            </div>
                                            <div class="relative inline-flex items-center h-4 rounded-full w-8 shrink-0 transition-colors duration-200" :class="exportConfig.showAdminTable ? 'bg-indigo-500' : 'bg-slate-300'">
                                                <input type="checkbox" v-model="exportConfig.showAdminTable" class="sr-only">
                                                <span class="inline-block w-3 h-3 transform bg-white rounded-full transition duration-200 shadow-sm" :class="exportConfig.showAdminTable ? 'translate-x-4' : 'translate-x-0.5'"></span>
                                            </div>
                                        </label>

                                        <label class="relative flex items-start justify-between p-3 rounded-xl border-2 transition-all cursor-pointer select-none" :class="[exportConfig.showSubSellers ? 'bg-blue-50 border-blue-400 shadow-sm' : 'bg-white border-slate-200 hover:border-blue-200', !exportConfig.showAdminTable ? 'opacity-50 pointer-events-none grayscale' : '']" @click="resetInactivityTimer">
                                            <div class="flex-1 pr-2">
                                                <h5 class="font-black text-[12px] mb-0.5 leading-tight" :class="exportConfig.showSubSellers ? 'text-blue-900' : 'text-slate-700'">ទិន្នន័យកូនចៅ</h5>
                                            </div>
                                            <div class="relative inline-flex items-center h-4 rounded-full w-8 shrink-0 transition-colors duration-200" :class="exportConfig.showSubSellers ? 'bg-blue-500' : 'bg-slate-300'">
                                                <input type="checkbox" v-model="exportConfig.showSubSellers" class="sr-only">
                                                <span class="inline-block w-3 h-3 transform bg-white rounded-full transition duration-200 shadow-sm" :class="exportConfig.showSubSellers ? 'translate-x-4' : 'translate-x-0.5'"></span>
                                            </div>
                                        </label>

                                        <label class="relative flex items-start justify-between p-3 rounded-xl border-2 transition-all cursor-pointer select-none" :class="[exportConfig.showInvoices ? 'bg-sky-50 border-sky-400 shadow-sm' : 'bg-white border-slate-200 hover:border-sky-200', (!exportConfig.showAdminTable || !exportConfig.showSubSellers) ? 'opacity-50 pointer-events-none grayscale' : '']" @click="resetInactivityTimer">
                                            <div class="flex-1 pr-2">
                                                <h5 class="font-black text-[12px] mb-0.5 leading-tight" :class="exportConfig.showInvoices ? 'text-sky-900' : 'text-slate-700'">លេខបុង & ថ្លៃដឹក</h5>
                                            </div>
                                            <div class="relative inline-flex items-center h-4 rounded-full w-8 shrink-0 transition-colors duration-200" :class="exportConfig.showInvoices ? 'bg-sky-500' : 'bg-slate-300'">
                                                <input type="checkbox" v-model="exportConfig.showInvoices" class="sr-only">
                                                <span class="inline-block w-3 h-3 transform bg-white rounded-full transition duration-200 shadow-sm" :class="exportConfig.showInvoices ? 'translate-x-4' : 'translate-x-0.5'"></span>
                                            </div>
                                        </label>

                                        <label class="relative flex items-start justify-between p-3 rounded-xl border-2 transition-all cursor-pointer select-none" :class="[exportConfig.showProducts ? 'bg-cyan-50 border-cyan-400 shadow-sm' : 'bg-white border-slate-200 hover:border-cyan-200', !exportConfig.showAdminTable ? 'opacity-50 pointer-events-none grayscale' : '']" @click="resetInactivityTimer">
                                            <div class="flex-1 pr-2">
                                                <h5 class="font-black text-[12px] mb-0.5 leading-tight" :class="exportConfig.showProducts ? 'text-cyan-900' : 'text-slate-700'">បញ្ជីទំនិញលម្អិត</h5>
                                            </div>
                                            <div class="relative inline-flex items-center h-4 rounded-full w-8 shrink-0 transition-colors duration-200" :class="exportConfig.showProducts ? 'bg-cyan-500' : 'bg-slate-300'">
                                                <input type="checkbox" v-model="exportConfig.showProducts" class="sr-only">
                                                <span class="inline-block w-3 h-3 transform bg-white rounded-full transition duration-200 shadow-sm" :class="exportConfig.showProducts ? 'translate-x-4' : 'translate-x-0.5'"></span>
                                            </div>
                                        </label>
                                    </div>
                                </transition>
                            </div>

                            <div>
                                <div class="px-4 py-3 bg-emerald-50/20 flex items-center justify-between cursor-pointer hover:bg-emerald-50/50 transition-colors" @click="toggleRegionGroupUI">
                                    <div class="flex items-center gap-2 flex-1">
                                        <span class="font-black text-[13px] text-emerald-700 tracking-wider">ផ្នែករបាយការណ៍តំបន់ & ចំណាយ</span>
                                    </div>
                                    <div class="flex items-center gap-3">
                                        <div class="relative inline-flex items-center h-5 rounded-full w-9 shrink-0 transition-colors duration-200 cursor-pointer" :class="isAllRegionGroupChecked ? 'bg-emerald-600' : 'bg-slate-300'" @click.stop="toggleRegionGroupOptions">
                                            <span class="inline-block w-3.5 h-3.5 transform bg-white rounded-full transition duration-200 shadow-sm pointer-events-none" :class="isAllRegionGroupChecked ? 'translate-x-4.5' : 'translate-x-1'"></span>
                                        </div>
                                        <svg class="w-5 h-5 text-emerald-400 transition-transform duration-300" :class="uiState.showRegionGroup ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                                
                                <transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="opacity-0 max-h-0" enter-to-class="opacity-100 max-h-[500px]" leave-active-class="transition-all duration-200 ease-in" leave-from-class="opacity-100 max-h-[500px]" leave-to-class="opacity-0 max-h-0">
                                    <div v-show="uiState.showRegionGroup" class="p-3 bg-white grid grid-cols-1 sm:grid-cols-2 gap-2.5 overflow-hidden">
                                        
                                        <label class="relative flex items-start justify-between p-3 rounded-xl border-2 transition-all cursor-pointer select-none" :class="exportConfig.showGrandTotal ? 'bg-emerald-50 border-emerald-400 shadow-sm' : 'bg-white border-slate-200 hover:border-emerald-200'" @click="resetInactivityTimer">
                                            <div class="flex-1 pr-2">
                                                <h5 class="font-black text-[12px] mb-0.5 leading-tight" :class="exportConfig.showGrandTotal ? 'text-emerald-900' : 'text-slate-700'">ទិន្នន័យរួមសរុប</h5>
                                            </div>
                                            <div class="relative inline-flex items-center h-4 rounded-full w-8 shrink-0 transition-colors duration-200" :class="exportConfig.showGrandTotal ? 'bg-emerald-500' : 'bg-slate-300'">
                                                <input type="checkbox" v-model="exportConfig.showGrandTotal" class="sr-only">
                                                <span class="inline-block w-3 h-3 transform bg-white rounded-full transition duration-200 shadow-sm" :class="exportConfig.showGrandTotal ? 'translate-x-4' : 'translate-x-0.5'"></span>
                                            </div>
                                        </label>

                                        <label class="relative flex items-start justify-between p-3 rounded-xl border-2 transition-all cursor-pointer select-none" :class="exportConfig.showPhnomPenh ? 'bg-teal-50 border-teal-400 shadow-sm' : 'bg-white border-slate-200 hover:border-teal-200'" @click="resetInactivityTimer">
                                            <div class="flex-1 pr-2">
                                                <h5 class="font-black text-[12px] mb-0.5 leading-tight" :class="exportConfig.showPhnomPenh ? 'text-teal-900' : 'text-slate-700'">តំបន់ភ្នំពេញ</h5>
                                            </div>
                                            <div class="relative inline-flex items-center h-4 rounded-full w-8 shrink-0 transition-colors duration-200" :class="exportConfig.showPhnomPenh ? 'bg-teal-500' : 'bg-slate-300'">
                                                <input type="checkbox" v-model="exportConfig.showPhnomPenh" class="sr-only">
                                                <span class="inline-block w-3 h-3 transform bg-white rounded-full transition duration-200 shadow-sm" :class="exportConfig.showPhnomPenh ? 'translate-x-4' : 'translate-x-0.5'"></span>
                                            </div>
                                        </label>

                                        <label class="relative flex items-start justify-between p-3 rounded-xl border-2 transition-all cursor-pointer select-none" :class="exportConfig.showProvince ? 'bg-orange-50 border-orange-400 shadow-sm' : 'bg-white border-slate-200 hover:border-orange-200'" @click="resetInactivityTimer">
                                            <div class="flex-1 pr-2">
                                                <h5 class="font-black text-[12px] mb-0.5 leading-tight" :class="exportConfig.showProvince ? 'text-orange-900' : 'text-slate-700'">តំបន់ខេត្ត</h5>
                                            </div>
                                            <div class="relative inline-flex items-center h-4 rounded-full w-8 shrink-0 transition-colors duration-200" :class="exportConfig.showProvince ? 'bg-orange-500' : 'bg-slate-300'">
                                                <input type="checkbox" v-model="exportConfig.showProvince" class="sr-only">
                                                <span class="inline-block w-3 h-3 transform bg-white rounded-full transition duration-200 shadow-sm" :class="exportConfig.showProvince ? 'translate-x-4' : 'translate-x-0.5'"></span>
                                            </div>
                                        </label>

                                        <label class="relative flex items-start justify-between p-3 rounded-xl border-2 transition-all cursor-pointer select-none" :class="[exportConfig.showExpenses ? 'bg-rose-50 border-rose-400 shadow-sm' : 'bg-white border-slate-200 hover:border-rose-200', !exportConfig.showGrandTotal ? 'opacity-50 pointer-events-none grayscale' : '']" @click="resetInactivityTimer">
                                            <div class="flex-1 pr-2">
                                                <h5 class="font-black text-[12px] mb-0.5 leading-tight" :class="exportConfig.showExpenses ? 'text-rose-900' : 'text-slate-700'">ការចំណាយ</h5>
                                            </div>
                                            <div class="relative inline-flex items-center h-4 rounded-full w-8 shrink-0 transition-colors duration-200" :class="exportConfig.showExpenses ? 'bg-rose-500' : 'bg-slate-300'">
                                                <input type="checkbox" v-model="exportConfig.showExpenses" class="sr-only">
                                                <span class="inline-block w-3 h-3 transform bg-white rounded-full transition duration-200 shadow-sm" :class="exportConfig.showExpenses ? 'translate-x-4' : 'translate-x-0.5'"></span>
                                            </div>
                                        </label>

                                        <label class="sm:col-span-2 relative flex items-center justify-between p-3 rounded-xl border-2 transition-all cursor-pointer select-none" :class="[exportConfig.showRegionProducts ? 'bg-purple-50 border-purple-400 shadow-sm' : 'bg-white border-slate-200 hover:border-purple-200', (!exportConfig.showGrandTotal && !exportConfig.showPhnomPenh && !exportConfig.showProvince) ? 'opacity-50 pointer-events-none grayscale' : '']" @click="resetInactivityTimer">
                                            <div class="flex-1 pr-2">
                                                <h5 class="font-black text-[12px] mb-0.5 leading-tight" :class="exportConfig.showRegionProducts ? 'text-purple-900' : 'text-slate-700'">បង្ហាញទិន្នន័យលម្អិត (តំបន់នីមួយៗ)</h5>
                                                <p class="text-[9px] font-bold text-slate-500 leading-snug">បង្ហាញបញ្ជីទំនិញ WHOLESALE & RETAIL លម្អិតនៅក្នុងរបាយការណ៍តំបន់។</p>
                                            </div>
                                            <div class="relative inline-flex items-center h-4 rounded-full w-8 shrink-0 transition-colors duration-200" :class="exportConfig.showRegionProducts ? 'bg-purple-500' : 'bg-slate-300'">
                                                <input type="checkbox" v-model="exportConfig.showRegionProducts" class="sr-only">
                                                <span class="inline-block w-3 h-3 transform bg-white rounded-full transition duration-200 shadow-sm" :class="exportConfig.showRegionProducts ? 'translate-x-4' : 'translate-x-0.5'"></span>
                                            </div>
                                        </label>
                                    </div>
                                </transition>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white p-5 border-t border-slate-200 shrink-0 flex gap-3 z-30 justify-center relative">
                        <div class="absolute inset-x-0 -top-8 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
                        <!-- <button @click="handleAction('print')" title="បោះពុម្ព (Print)" :disabled="localSelectedAdmins.length === 0 || processingState.active" class="flex-1 flex items-center justify-center py-3.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl transition-all active:scale-95 disabled:opacity-50 shadow-md">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                        </button> -->
                        <button @click="handleAction('pdf')" title="ទាញយក PDF" :disabled="localSelectedAdmins.length === 0 || processingState.active" class="flex-1 flex items-center justify-center py-3.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl transition-all active:scale-95 disabled:opacity-50 shadow-md shadow-rose-500/30">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        </button>
                        <button @click="handleAction('excel')" title="ទាញយក Excel" :disabled="localSelectedAdmins.length === 0 || processingState.active" class="flex-1 flex items-center justify-center py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-all active:scale-95 disabled:opacity-50 shadow-md shadow-emerald-500/30">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        </button>
                    </div>
                </div>

                <div class="hidden xl:flex flex-1 flex-col bg-slate-200/80 relative min-w-0">
                    
                    <div class="px-6 py-4 border-b border-slate-200 bg-white/80 backdrop-blur-md shrink-0 flex items-center justify-between z-10 shadow-sm">
                        <h3 class="font-black text-slate-700 text-sm uppercase tracking-wider flex items-center gap-2">
                            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            ទិដ្ឋភាពតារាងពិតប្រាកដ (LIVE PREVIEW)
                        </h3>
                        <button @click="$emit('close')" class="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-rose-100 hover:text-rose-500 transition-colors flex items-center justify-center">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                    </div>

                    <div class="flex-1 overflow-y-auto custom-scrollbar p-6 bg-slate-200">
                        <div class="max-w-[1100px] mx-auto bg-white rounded-lg shadow-xl border border-slate-200 p-8 md:p-12 space-y-10 pb-20 min-h-[1122px]">
                            
                            <div v-if="localSelectedAdmins.length === 0" class="text-center py-32 text-slate-400 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-300">
                                <div class="text-6xl mb-4 opacity-30">👤</div>
                                <p class="font-black text-xl text-slate-500">មិនទាន់ជ្រើសរើសអ្នកលក់ទេ!</p>
                                <p class="text-base mt-2 font-bold">សូមជ្រើសរើសអ្នកគ្រប់គ្រងយ៉ាងហោចណាស់ម្នាក់ ដើម្បីមើលរបាយការណ៍។</p>
                            </div>

                            <template v-else>
                                <div v-if="exportConfig.showAdminTable">
                                    <h3 class="font-black text-xl text-slate-800 mb-4 border-b-2 border-slate-800 pb-3 flex items-center gap-2">
                                        <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg> 
                                        បញ្ជីអ្នកគ្រប់គ្រង និងចំណូលលម្អិត
                                    </h3>

                                    <div v-if="isGeneratingPreview" class="py-20 flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-300">
                                        <div class="animate-spin w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full mb-4"></div>
                                        <p class="text-base font-bold text-slate-500">កំពុងគណនាទិន្នន័យតារាង...</p>
                                    </div>
                                    
                                    <div v-else class="bg-white border border-slate-300 rounded-2xl overflow-hidden shadow-sm">
                                        <table class="w-full text-left border-collapse">
                                            <thead class="bg-slate-800 text-white text-[12px] font-black uppercase tracking-wide">
                                                <tr>
                                                    <th class="p-3 text-center w-12 border-b-2 border-slate-900 border-r border-slate-700">ល.រ</th>
                                                    <th class="p-3 border-b-2 border-slate-900 border-r border-slate-700">តំណាងលក់ (SELLER)</th>
                                                    <th class="p-3 text-center border-b-2 border-slate-900 border-r border-slate-700">ចំនួនវិក្កយបត្រ</th>
                                                    <th class="p-3 text-right border-b-2 border-slate-900 border-r border-slate-700">ប្រាក់ទំនិញសុទ្ធ</th>
                                                    <th class="p-3 text-right border-b-2 border-slate-900 border-r border-slate-700">ថ្លៃដឹក(ភ្នំពេញ)</th>
                                                    <th class="p-3 text-right border-b-2 border-slate-900 border-r border-slate-700">ថ្លៃដឹក(ខេត្ត)</th>
                                                    <th class="p-3 text-right border-b-2 border-slate-900">សរុបរួម</th>
                                                </tr>
                                            </thead>
                                            <tbody v-for="row in livePreviewRows" :key="row.id" class="border-b-[3px] border-slate-400">
                                                <tr :class="!row.hasSales ? 'bg-slate-50' : 'bg-white'">
                                                    <td class="p-3 text-center font-black text-slate-500 text-[13px] border-b border-slate-200 border-r border-slate-200">{{ row.printIndex }}</td>
                                                    <td class="p-3 font-black text-slate-800 text-[14px] border-b border-slate-200 border-r border-slate-200">{{ row.fullName }}</td>
                                                    <td class="p-3 text-center font-black text-indigo-700 text-[14px] border-b border-slate-200 border-r border-slate-200">{{ row.hasSales ? fQ(row.stats?.invoiceCount) + ' បុង' : '-' }}</td>
                                                    <td class="p-3 text-right font-black text-emerald-600 text-[14px] border-b border-slate-200 border-r border-slate-200">{{ row.hasSales ? fC(row.stats?.netProductUSD) + ' $' : '-' }}</td>
                                                    <td class="p-3 text-right font-black text-amber-600 text-[14px] border-b border-slate-200 border-r border-slate-200">{{ row.hasSales ? fC(row.stats?.deliveryPP_USD) + ' $' : '-' }}</td>
                                                    <td class="p-3 text-right font-black text-orange-600 text-[14px] border-b border-slate-200 border-r border-slate-200">{{ row.hasSales ? fC(row.stats?.deliveryProv_USD) + ' $' : '-' }}</td>
                                                    <td class="p-3 text-right font-black text-rose-600 text-[15px] border-b border-slate-200">{{ row.hasSales ? fC(row.stats?.grandTotal) + ' $' : '-' }}</td>
                                                </tr>
                                                
                                                <template v-if="exportConfig.showSubSellers && row.subSellers && row.subSellers.length > 0">
                                                    <template v-for="(sub, sIdx) in row.subSellers" :key="'sub'+sIdx">
                                                        <tr class="bg-slate-50 border-b border-slate-300">
                                                            <td class="border-r border-slate-200"></td>
                                                            <td class="py-2 px-3 font-bold text-[13px] border-r border-slate-200" :class="sub.isAdminDirect ? 'text-indigo-600' : 'text-slate-600'">↳ {{ sub.name }}</td>
                                                            <td class="py-2 px-3 text-center font-bold text-slate-600 text-[13px] border-r border-slate-200">{{ fQ(sub.invoiceCount) }} បុង</td>
                                                            <td class="py-2 px-3 text-right font-bold text-slate-600 text-[13px] border-r border-slate-200">{{ fC(sub.netProductUSD) }} $</td>
                                                            <td class="py-2 px-3 text-right font-bold text-amber-600 text-[13px] border-r border-slate-200">{{ fC(sub.deliveryPP_USD) }} $</td>
                                                            <td class="py-2 px-3 text-right font-bold text-orange-600 text-[13px] border-r border-slate-200">{{ fC(sub.deliveryProv_USD) }} $</td>
                                                            <td class="py-2 px-3 text-right font-black text-slate-700 text-[13px]">{{ fC(sub.grandTotal) }} $</td>
                                                        </tr>
                                                        <template v-if="exportConfig.showInvoices && sub.salesDetails && sub.salesDetails.length > 0">
                                                            <tr v-for="(inv, iIdx) in sub.salesDetails" :key="'inv'+iIdx" class="bg-white border-b border-slate-200 hover:bg-slate-50 transition-colors">
                                                                <td class="bg-slate-50 border-r border-slate-300"></td>
                                                                <td class="py-1.5 px-3 pl-8 text-[11px] font-mono text-slate-500 border-x border-slate-200">🧾 {{ inv.receiptId }}</td>
                                                                <td class="text-center text-slate-200 border-r border-slate-200">-</td>
                                                                <td class="text-right text-slate-200 border-r border-slate-200">-</td>
                                                                <td class="py-1.5 px-3 text-right text-[11px] text-amber-600 font-bold border-r border-slate-200 bg-amber-50/30">{{ inv.dPP > 0 ? fC(inv.dPP) + ' $' : '-' }}</td>
                                                                <td class="py-1.5 px-3 text-right text-[11px] text-orange-500 font-bold border-r border-slate-200 bg-orange-50/30">{{ inv.dProv > 0 ? fC(inv.dProv) + ' $' : '-' }}</td>
                                                                <td class="text-right text-slate-200">-</td>
                                                            </tr>
                                                        </template>
                                                    </template>
                                                </template>
                                                
                                                <tr v-if="exportConfig.showProducts && row.products && row.products.length > 0" class="bg-white">
                                                    <td class="border-r border-slate-200 bg-slate-50"></td>
                                                    <td colspan="6" class="p-4">
                                                        <div class="bg-slate-50 border border-slate-200 rounded-xl p-4">
                                                            <div class="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3 border-b border-slate-200 pb-2">បញ្ជីទំនិញលម្អិត (គិតជាដប)</div>
                                                            <div class="grid grid-cols-1 xl:grid-cols-2 gap-x-8 gap-y-2">
                                                                <div v-for="(p, pIdx) in row.products" :key="'p'+pIdx" class="flex justify-between items-start text-[13px] border-b border-dashed border-slate-200 pb-1">
                                                                    <span class="font-bold text-slate-700 pr-2 flex-1 leading-tight">• {{ p.name }}</span>
                                                                    <div class="flex flex-col items-end shrink-0">
                                                                        <span class="font-black text-slate-600">{{ fQ(p.qty) }} ដប <span class="font-bold text-[10px] text-slate-400 ml-1">({{ fC(p.unitPrice) }}$)</span></span>
                                                                        <span class="font-black text-emerald-600">{{ fC(p.usd) }} $</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div v-if="!exportConfig.showAdminTable && !exportConfig.showGrandTotal && !exportConfig.showPhnomPenh && !exportConfig.showProvince" class="text-center py-32 text-slate-400 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-300">
                                    <div class="text-6xl mb-4 opacity-30">👁️‍🗨️</div>
                                    <p class="font-black text-xl text-slate-500">អ្នកបានបិទការបង្ហាញទិន្នន័យទាំងអស់!</p>
                                    <p class="text-base mt-2 font-bold">សូមបើកជម្រើសយ៉ាងហោចណាស់មួយ ដើម្បីអាចទាញយករបាយការណ៍បាន។</p>
                                </div>

                                <div v-show="exportConfig.showGrandTotal" v-html="generateRegionHTML('📊 ទិន្នន័យរួមសរុប (រាជធានីភ្នំពេញ + ខេត្ត)', filteredStats.grand, true, stats.expensesList, unitSettings)"></div>
                                <div v-show="exportConfig.showPhnomPenh" v-html="generateRegionHTML('🏙️ ទិន្នន័យរាជធានីភ្នំពេញ (Phnom Penh)', filteredStats.pp, false, [], unitSettings)"></div>
                                <div v-show="exportConfig.showProvince" v-html="generateRegionHTML('🛣️ ទិន្នន័យតាមបណ្តាខេត្ត (Provinces)', filteredStats.prov, false, [], unitSettings)"></div>
                            </template>
                        </div>
                    </div>
                </div>

                <div v-if="processingState.active" class="absolute inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
                    <div class="bg-white rounded-3xl p-10 shadow-2xl flex flex-col items-center max-w-sm w-full animate-slide-up border border-white/20">
                        <div class="relative w-24 h-24 mb-8">
                            <svg class="animate-spin w-full h-full text-indigo-100" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            <div class="absolute inset-0 flex items-center justify-center text-indigo-600 font-black text-base">{{ processingState.progress }}%</div>
                        </div>
                        <h3 class="text-2xl font-black text-slate-800 mb-2">កំពុងដំណើរការ...</h3>
                        <p class="text-base font-bold text-slate-500">{{ processingState.message }}</p>
                    </div>
                </div>

            </div>
        </div>
    </transition>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

// 🌟 Import Helper Functions from Logic 🌟
import { calculateAdminStats, getSubSellersStats, getDetailedProductsSummary, fC, fQ, translateUnit } from './exportReportLogic.js';

const props = defineProps({
    show: Boolean,
    activeAdmins: { type: Array, default: () => [] },
    selectedAdmins: { type: Array, default: () => [] },
    stats: Object,
    allSales: { type: Array, default: () => [] },
    dateLabel: String,
    adminLabel: String,
    unitSettings: Array,
    processingState: Object 
});

const emit = defineEmits(['close', 'update:selectedAdmins', 'exportAction']);

const localSelectedAdmins = ref([]);

// 🌟 UI States for Accordion (Groups)
const uiState = ref({
    showAdminGroup: true,
    showTableGroup: false, // 👈 បិទពេលបើកដំបូង
    showRegionGroup: false // 👈 បិទពេលបើកដំបូង
});

// 🌟 Inactivity Timer Logic 🌟
let inactivityTimer = null;

const resetInactivityTimer = () => {
    if (inactivityTimer) clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
        // បិទ Groups បន្ទាប់ពីគ្មានសកម្មភាព 10 វិនាទី
        uiState.value.showTableGroup = false;
        uiState.value.showRegionGroup = false;
    }, 10000); // 10s
};

const toggleTableGroupUI = () => {
    uiState.value.showTableGroup = !uiState.value.showTableGroup;
    if (uiState.value.showTableGroup) resetInactivityTimer();
};

const toggleRegionGroupUI = () => {
    uiState.value.showRegionGroup = !uiState.value.showRegionGroup;
    if (uiState.value.showRegionGroup) resetInactivityTimer();
};

// 🌟 9 Dynamic Options Configuration (Default Values) 🌟
const exportConfig = ref({
    showAdminTable: true,
    showSubSellers: true,
    showInvoices: false,
    showProducts: false,
    showGrandTotal: false,
    showPhnomPenh: false,
    showProvince: false,
    showExpenses: false,
    showRegionProducts: false 
});

// Auto-toggle constraints
watch(() => exportConfig.value.showAdminTable, (val) => {
    if (!val) {
        exportConfig.value.showSubSellers = false;
        exportConfig.value.showInvoices = false;
        exportConfig.value.showProducts = false;
    }
});
watch(() => exportConfig.value.showSubSellers, (val) => {
    if (!val) exportConfig.value.showInvoices = false;
});
watch(() => exportConfig.value.showGrandTotal, (val) => {
    if (!val) exportConfig.value.showExpenses = false;
});

// Check/Uncheck all for Table Group
const isAllTableGroupChecked = computed(() => {
    return exportConfig.value.showAdminTable && 
           exportConfig.value.showSubSellers && 
           exportConfig.value.showInvoices && 
           exportConfig.value.showProducts;
});

const toggleTableGroupOptions = () => {
    const val = !isAllTableGroupChecked.value;
    exportConfig.value.showAdminTable = val;
    exportConfig.value.showSubSellers = val;
    exportConfig.value.showInvoices = val;
    exportConfig.value.showProducts = val;
    resetInactivityTimer();
};

// Check/Uncheck all for Region Group
const isAllRegionGroupChecked = computed(() => {
    return exportConfig.value.showGrandTotal && 
           exportConfig.value.showPhnomPenh && 
           exportConfig.value.showProvince && 
           exportConfig.value.showExpenses &&
           exportConfig.value.showRegionProducts;
});

const toggleRegionGroupOptions = () => {
    const val = !isAllRegionGroupChecked.value;
    exportConfig.value.showGrandTotal = val;
    exportConfig.value.showPhnomPenh = val;
    exportConfig.value.showProvince = val;
    exportConfig.value.showExpenses = val;
    exportConfig.value.showRegionProducts = val;
    resetInactivityTimer();
};

// Reset configurations when opening modal
watch(() => props.show, (newVal) => {
    if (newVal) {
        localSelectedAdmins.value = []; // Uncheck all by default
        exportConfig.value = {
            showAdminTable: true, showSubSellers: true, showInvoices: false, showProducts: false,
            showGrandTotal: false, showPhnomPenh: false, showProvince: false, showExpenses: false, showRegionProducts: false
        };
        
        // បិទ UI Groups ពេលបើកដំបូង
        uiState.value.showTableGroup = false;
        uiState.value.showRegionGroup = false;

        fetchCombosAndStocks(); 
        generateLivePreview();
    } else {
        if (inactivityTimer) clearTimeout(inactivityTimer);
    }
});

onUnmounted(() => {
    if (inactivityTimer) clearTimeout(inactivityTimer);
});

watch(localSelectedAdmins, (newVal) => {
    emit('update:selectedAdmins', newVal);
    generateLivePreview();
}, { deep: true });

watch(() => exportConfig.value, () => {
    generateLivePreview();
}, { deep: true });

// Filter out admins with no sales
const adminsWithSalesOnly = computed(() => {
    return (props.activeAdmins || []).filter(admin => admin.hasSales);
});

const isAllAdminsSelected = computed(() => {
    if (adminsWithSalesOnly.value.length === 0) return false;
    return localSelectedAdmins.value.length === adminsWithSalesOnly.value.length;
});

const toggleAllAdmins = (e) => {
    if (e.target.checked) localSelectedAdmins.value = adminsWithSalesOnly.value.map(a => a.originalAdminId);
    else localSelectedAdmins.value = [];
};

const handleAction = (type) => {
    emit('exportAction', { type, config: exportConfig.value });
};

// ==========================================
// 🌟 LIVE PREVIEW GENERATION LOGIC 🌟
// ==========================================
const allCombos = ref([]);
const allStocks = ref([]);
const isGeneratingPreview = ref(false);
const livePreviewRows = ref([]);

const fetchCombosAndStocks = async () => {
    if (allCombos.value.length > 0) return;
    const cSnap = await getDocs(collection(db, 'combos'));
    allCombos.value = cSnap.docs.map(d => ({id: d.id, ...d.data()}));
    const sSnap = await getDocs(collection(db, 'stocks'));
    allStocks.value = sSnap.docs.map(d => ({id: d.id, ...d.data()}));
};

let previewTimeout = null;
const generateLivePreview = async () => {
    if (!props.allSales || props.allSales.length === 0 || localSelectedAdmins.value.length === 0) {
        livePreviewRows.value = [];
        return;
    }
    isGeneratingPreview.value = true;
    
    // Debounce to prevent lag during rapid toggling
    if (previewTimeout) clearTimeout(previewTimeout);
    
    previewTimeout = setTimeout(async () => {
        let rows = [];
        let index = 1;
        
        for (const admin of props.activeAdmins) {
            if (!localSelectedAdmins.value.includes(admin.originalAdminId)) continue;
            
            const stats = calculateAdminStats(admin, props.allSales);
            const hasS = admin.hasSales;
            
            let subSellers = [];
            if (hasS && exportConfig.value.showSubSellers) {
                subSellers = await getSubSellersStats(admin, props.allSales);
            }
            
            let products = [];
            if (hasS && exportConfig.value.showProducts) {
                products = getDetailedProductsSummary(admin, { allSales: props.allSales }, allCombos.value, allStocks.value);
            }
            
            rows.push({
                ...admin,
                printIndex: index++,
                stats,
                subSellers,
                products
            });
        }
        
        livePreviewRows.value = rows;
        isGeneratingPreview.value = false;
    }, 400);
};

// ==========================================
// 🌟 Region Render Logic
const filteredStats = computed(() => {
    return { grand: props.stats?.grand, pp: props.stats?.pp, prov: props.stats?.prov };
});

const generateRegionHTML = (title, d, isGrand, expenses, unitSettings) => {
    if (!d) return '';
    const hasPaidData = (d.paid?.wholesale?.products?.length > 0) || (d.paid?.retail?.products?.length > 0);
    const hasUnpaidData = (d.unpaid?.wholesale?.products?.length > 0) || (d.unpaid?.retail?.products?.length > 0);
    if (!hasPaidData && !hasUnpaidData && (!isGrand || !expenses || expenses.length === 0)) return '';

    const renderGrid = (products) => {
        // 🌟 Hide products if Option 9 (showRegionProducts) is turned off 🌟
        if (!products || products.length === 0 || !exportConfig.value.showRegionProducts) return ''; 
        const cards = products.map(p => {
            const unitPrice = p.qty > 0 ? (p.usd / p.qty) : 0;
            return `
            <div class="border border-slate-200 rounded-xl p-4 bg-white shadow-sm flex flex-col justify-between">
                <div class="flex justify-between items-start mb-3 gap-3">
                    <span class="font-bold text-slate-800 text-[15px] leading-tight flex-1">📦 ${p.name}</span>
                    <span class="font-black text-emerald-600 text-[17px] whitespace-nowrap">${fC(p.usd)} $</span>
                </div>
                <div class="text-[13px] text-slate-500 flex flex-col xl:flex-row xl:justify-between xl:items-center border-t border-dashed border-slate-200 pt-3 gap-2">
                    <span>អតិថិជន: <span class="font-bold text-slate-800">${fQ(p.clients)}</span> នាក់</span>
                    <span class="flex items-center flex-wrap gap-1.5">
                        បរិមាណ: 
                        <span class="font-black text-sky-600 text-[15px]">${fQ(p.qty)} ${translateUnit(p.unit, unitSettings)}</span> 
                        <span class="text-slate-400 font-bold text-[11px]">(${fC(unitPrice)}$/១)</span>
                    </span>
                </div>
            </div>
        `}).join('');
        return `<div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">${cards}</div>`;
    };

    const renderCat = (catTitle, catData, colorClass, borderClass) => {
        if (!catData?.products || catData.products.length === 0) return '';
        return `
            <div class="mt-5 p-5 rounded-2xl border-2 ${borderClass} bg-white shadow-sm">
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center border-l-4 pl-4 mb-3 gap-3" style="border-color: ${colorClass}">
                    <span class="font-black text-[17px]" style="color: ${colorClass}">${catTitle}</span>
                    <span class="font-black text-slate-800 text-[15px]">តម្លៃទំនិញ: <span style="color: ${colorClass}">${fC(catData.itemPriceTotalUSD)} $</span></span>
                </div>
                ${renderGrid(catData.products)}
            </div>
        `;
    };

    let html = `
        <div class="bg-white rounded-[20px] shadow-sm border border-slate-200 overflow-hidden mb-8">
            <div class="bg-slate-800 text-white px-6 py-4 flex justify-between items-center">
                <h3 class="font-black text-lg flex items-center gap-3">
                    <svg class="w-6 h-6 text-indigo-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                    ${title}
                </h3>
                <span class="text-sm font-bold bg-white/20 px-4 py-1.5 rounded-full">អតិថិជន: ${fQ(d.totalClients)} នាក់</span>
            </div>
    `;

    if (hasPaidData) {
        html += `
            <div class="p-6 border-b border-slate-100 bg-emerald-50/10">
                <h4 class="font-black text-emerald-600 text-lg mb-3 flex items-center gap-2"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> ទំនិញបានទូទាត់រួច (PAID)</h4>
                ${renderCat('📦 លក់បោះដុំ (WHOLESALE)', d.paid?.wholesale, '#7e22ce', 'border-purple-100')}
                ${renderCat('🛍️ លក់រាយ (RETAIL)', d.paid?.retail, '#0ea5e9', 'border-sky-100')}
                <div class="text-right mt-5">
                    <span class="bg-emerald-50 text-emerald-700 font-bold text-base px-6 py-3 rounded-xl border border-emerald-200 inline-block shadow-sm">
                        ថ្លៃដឹកជញ្ជូនសរុប (Paid): <span class="font-black ml-2">${fC(d.paid?.deliveryFeeUSD)} $</span>
                    </span>
                </div>
            </div>
        `;
    }

    if (hasUnpaidData) {
        html += `
            <div class="p-6 bg-amber-50/20 border-b border-slate-100">
                <h4 class="font-black text-amber-600 text-lg mb-3 flex items-center gap-2"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> មិនទាន់បានទូទាត់ (PENDING)</h4>
                ${renderCat('📦 លក់បោះដុំ (WHOLESALE)', d.unpaid?.wholesale, '#b45309', 'border-amber-200')}
                ${renderCat('🛍️ លក់រាយ (RETAIL)', d.unpaid?.retail, '#ea580c', 'border-orange-200')}
                <div class="text-right mt-5">
                    <span class="bg-amber-100 text-amber-800 font-bold text-base px-6 py-3 rounded-xl border border-amber-300 inline-block shadow-sm">
                        ថ្លៃដឹកជញ្ជូនសរុប (Pending): <span class="font-black ml-2">${fC(d.unpaid?.deliveryFeeUSD)} $</span>
                    </span>
                </div>
            </div>
        `;
    }

    if (isGrand && expenses?.length > 0 && exportConfig.value.showExpenses) {
        const expRows = expenses.map((e, i) => `
            <tr class="border-b border-rose-100 last:border-0">
                <td class="py-3 text-rose-900 font-bold text-base">${i+1}. ${e.reason}</td>
                <td class="py-3 text-center text-rose-700 text-base">${e.requester}</td>
                <td class="py-3 text-right font-black text-rose-700 text-base">${fC(e.currency==='KHR'?e.amount/4000:e.amount)} $</td>
            </tr>
        `).join('');
        html += `
            <div class="p-6 bg-rose-50/40 border-b border-slate-100">
                <h4 class="font-black text-rose-700 text-lg mb-4 flex items-center gap-2"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> ការចំណាយទូទៅ (EXPENSES)</h4>
                <table class="w-full text-left">
                    <thead class="text-sm text-rose-600 uppercase border-b-2 border-rose-200">
                        <tr><th class="pb-3">បរិយាយ</th><th class="pb-3 text-center">អ្នកស្នើ</th><th class="pb-3 text-right">តម្លៃ (USD)</th></tr>
                    </thead>
                    <tbody>${expRows}</tbody>
                </table>
            </div>
        `;
    }

    if (isGrand) {
        const profitColor = d.summary?.netProfit >= 0 ? 'text-emerald-600 bg-emerald-50 border-emerald-200' : 'text-rose-600 bg-rose-50 border-rose-200';
        html += `
            <div class="p-6 sm:p-8 bg-slate-50 flex justify-end">
                <div class="w-full max-w-lg space-y-3 text-base font-bold text-slate-600">
                    <div class="flex justify-between"><span>ចំណូលសរុប (ទំនិញ PAID):</span><span class="text-slate-800">${fC(d.summary?.paidItemsTotal)} $</span></div>
                    <div class="flex justify-between"><span>ចំណូលសរុប (ថ្លៃដឹក PAID):</span><span class="text-slate-800">${fC(d.summary?.paidDeliveryTotal)} $</span></div>
                    <div class="flex justify-between text-emerald-700 border-b border-dashed border-slate-300 pb-3"><span>ចំណូលសរុប (ទំនិញ + ថ្លៃដឹក):</span><span class="font-black text-lg">${fC(d.summary?.paidTotal)} $</span></div>
                    <div class="flex justify-between text-amber-600 pt-2"><span>មិនទាន់ទូទាត់សរុប (PENDING):</span><span class="font-black">- ${fC(d.summary?.unpaidTotal)} $</span></div>
                    ${exportConfig.value.showExpenses ? `<div class="flex justify-between text-rose-600"><span>ចំណាយសរុប (Expenses):</span><span class="font-black">- ${fC(d.summary?.totalExpensesUSD)} $</span></div>` : ''}
                    <div class="flex justify-between text-slate-500 border-b-2 border-slate-300 pb-4 mb-4"><span>សរុបតម្លៃដើម (COGS):</span><span class="font-black">- ${fC(d.summary?.totalPaidCostUSD)} $</span></div>
                    <div class="flex justify-between items-center pt-2 text-slate-900">
                        <span class="font-black uppercase text-lg">ប្រាក់ចំណេញសុទ្ធ:</span>
                        <span class="font-black text-2xl px-4 py-2 rounded-xl border ${profitColor}">${fC(d.summary?.netProfit)} $</span>
                    </div>
                </div>
            </div>
        `;
    } else {
         html += `
            <div class="p-6 bg-slate-50 flex justify-end">
                <div class="w-full max-w-sm space-y-2 text-base font-bold text-slate-600">
                    <div class="flex justify-between"><span>ចំណូលទំនិញ (PAID):</span><span class="text-slate-800">${fC(d.summary?.paidItemsTotal)} $</span></div>
                    <div class="flex justify-between"><span>ចំណូលថ្លៃដឹក (PAID):</span><span class="text-slate-800">${fC(d.summary?.paidDeliveryTotal)} $</span></div>
                    <div class="flex justify-between text-emerald-700 border-t border-dashed border-slate-300 pt-2 mt-2"><span>ចំណូលសរុប (PAID):</span><span class="font-black">${fC(d.summary?.paidTotal)} $</span></div>
                    <div class="flex justify-between text-slate-500 border-t border-dashed border-slate-300 pt-2"><span>តម្លៃដើមសរុប (COGS):</span><span class="font-black">${fC(d.summary?.totalPaidCostUSD)} $</span></div>
                </div>
            </div>
        `;
    }

    html += `</div>`;
    return html;
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;500;600;700;900&family=Battambang:wght@400;700;900&display=swap');
.font-khmer { font-family: 'Kantumruy Pro', 'Battambang', sans-serif; }
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.custom-scrollbar-dark::-webkit-scrollbar { width: 6px; }
.custom-scrollbar-dark::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar-dark::-webkit-scrollbar-thumb { background: #64748b; border-radius: 10px; }
.animate-slide-up { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
.translate-x-4\.5 { transform: translateX(18px); }
</style>