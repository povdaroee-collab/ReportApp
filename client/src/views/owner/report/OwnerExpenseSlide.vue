<template>
  <div>
    <div v-if="show" class="fixed inset-0 z-[999998] bg-slate-900/40 backdrop-blur-sm transition-opacity" @click="$emit('close')"></div>

    <transition name="slide">
      <div v-if="show" class="fixed inset-y-0 right-0 z-[999999] w-full md:w-[550px] bg-slate-50 shadow-2xl flex flex-col font-khmer border-l border-slate-200">
        
        <div class="px-6 py-5 bg-white flex items-center justify-between shrink-0 z-20">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-rose-500 to-rose-600 text-white rounded-xl flex items-center justify-center shadow-md shadow-rose-500/20">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
            </div>
            <div>
              <h3 class="text-lg font-black text-slate-800 leading-tight">គណនីចំណាយ</h3>
              <p class="text-[11px] font-bold text-slate-500">គ្រប់គ្រងការចំណាយប្រចាំថ្ងៃ</p>
            </div>
          </div>
          <button @click="$emit('close')" class="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-colors active:scale-95">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div class="px-6 py-4 bg-white border-b border-slate-200 shrink-0 z-10 flex flex-col gap-3 shadow-sm">
            <div class="flex bg-slate-100 p-1.5 rounded-xl w-full">
                <button @click="$emit('update:dateFilterType', 'daily')" :class="dateFilterType === 'daily' ? 'bg-white shadow-sm text-indigo-600 font-black' : 'text-slate-500 font-bold hover:text-slate-700'" class="flex-1 py-1.5 text-xs rounded-lg transition-all">ប្រចាំថ្ងៃ</button>
                <button @click="$emit('update:dateFilterType', 'monthly')" :class="dateFilterType === 'monthly' ? 'bg-white shadow-sm text-indigo-600 font-black' : 'text-slate-500 font-bold hover:text-slate-700'" class="flex-1 py-1.5 text-xs rounded-lg transition-all">ប្រចាំខែ</button>
                <button @click="$emit('update:dateFilterType', 'yearly')" :class="dateFilterType === 'yearly' ? 'bg-white shadow-sm text-indigo-600 font-black' : 'text-slate-500 font-bold hover:text-slate-700'" class="flex-1 py-1.5 text-xs rounded-lg transition-all">ប្រចាំឆ្នាំ</button>
                <button @click="$emit('update:dateFilterType', 'custom')" :class="dateFilterType === 'custom' ? 'bg-white shadow-sm text-indigo-600 font-black' : 'text-slate-500 font-bold hover:text-slate-700'" class="flex-1 py-1.5 text-xs rounded-lg transition-all">កំណត់ថ្ងៃ</button>
            </div>

            <div class="flex gap-2">
                <input v-if="dateFilterType === 'daily'" type="date" :value="selectedDate" @input="$emit('update:selectedDate', $event.target.value)" class="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl px-4 py-2.5 outline-none focus:border-indigo-400 focus:bg-white transition-colors cursor-pointer">

                <template v-if="dateFilterType === 'monthly'">
                    <select :value="selectedMonth" @change="$emit('update:selectedMonth', parseInt($event.target.value))" class="flex-1 bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl px-4 py-2.5 outline-none focus:border-indigo-400 focus:bg-white transition-colors cursor-pointer appearance-none">
                        <option v-for="m in availableMonths" :key="m.index" :value="m.index">{{ m.name }}</option>
                    </select>
                    <select :value="selectedYear" @change="$emit('update:selectedYear', parseInt($event.target.value))" class="flex-1 bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl px-4 py-2.5 outline-none focus:border-indigo-400 focus:bg-white transition-colors cursor-pointer appearance-none">
                        <option v-for="y in availableYears" :key="y" :value="y">ឆ្នាំ {{ y }}</option>
                    </select>
                </template>

                <select v-if="dateFilterType === 'yearly'" :value="selectedYear" @change="$emit('update:selectedYear', parseInt($event.target.value))" class="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl px-4 py-2.5 outline-none focus:border-indigo-400 focus:bg-white transition-colors cursor-pointer appearance-none">
                    <option v-for="y in availableYears" :key="y" :value="y">ទិន្នន័យប្រចាំឆ្នាំ {{ y }}</option>
                </select>

                <template v-if="dateFilterType === 'custom'">
                     <input type="date" :value="customStart" @input="$emit('update:customStart', $event.target.value)" class="flex-1 bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-bold rounded-xl px-2 py-2.5 outline-none focus:border-indigo-400 focus:bg-white cursor-pointer">
                     <span class="flex items-center text-slate-400 font-bold">-</span>
                     <input type="date" :value="customEnd" @input="$emit('update:customEnd', $event.target.value)" class="flex-1 bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-bold rounded-xl px-2 py-2.5 outline-none focus:border-indigo-400 focus:bg-white cursor-pointer">
                </template>
            </div>
        </div>

        <div class="flex px-6 pt-3 bg-white border-b border-slate-200 shrink-0 gap-6">
            <button @click="activeTab = 'add'" class="pb-3 text-[13px] font-black border-b-[3px] transition-all" :class="activeTab === 'add' ? 'border-rose-500 text-rose-600' : 'border-transparent text-slate-400 hover:text-slate-600'">បញ្ជូលចំណាយថ្មី</button>
            <button @click="activeTab = 'list'" class="pb-3 text-[13px] font-black border-b-[3px] transition-all flex items-center gap-1.5" :class="activeTab === 'list' ? 'border-rose-500 text-rose-600' : 'border-transparent text-slate-400 hover:text-slate-600'">
                បញ្ជីចំណាយ 
                <span class="px-2 py-0.5 rounded-full text-[10px] font-black transition-colors" :class="activeTab === 'list' ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500'">{{ expensesList.length }}</span>
            </button>
        </div>

        <div v-if="formError" class="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 animate-fade-in-up">
            <svg class="w-5 h-5 text-rose-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            <p class="text-xs font-bold text-rose-700 leading-relaxed">{{ formError }}</p>
        </div>

        <div v-show="activeTab === 'add'" class="flex-1 overflow-y-auto p-6 bg-slate-50 custom-scrollbar space-y-5">
            <div v-for="(exp, index) in expenses" :key="index" class="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm relative animate-fade-in-up group hover:border-indigo-100 transition-colors">
                
                <button v-if="expenses.length > 1" @click="removeExpenseRow(index)" class="absolute -top-3 -right-3 w-8 h-8 bg-white text-rose-500 hover:bg-rose-500 hover:text-white rounded-full shadow-md border border-slate-100 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M20 12H4"/></svg>
                </button>

                <div class="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                    <span class="w-6 h-6 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center text-[10px] font-black">{{ index + 1 }}</span>
                    <h4 class="text-sm font-black text-slate-700">{{ editingId ? 'កែប្រែចំណាយ' : 'ការចំណាយ' }}</h4>
                </div>

                <div class="space-y-4">
                    <div>
                        <label class="block text-[11px] font-black text-slate-500 mb-1.5 uppercase">បរិយាយ / មូលហេតុ <span class="text-rose-500">*</span></label>
                        <input v-model="exp.reason" @input="formError = ''" type="text" placeholder="ឧ. ចាក់សាំង, ទិញសម្ភារៈ..." class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:bg-white focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all">
                    </div>

                    <div>
                        <label class="block text-[11px] font-black text-slate-500 mb-1.5 uppercase">ចំនួនទឹកប្រាក់ <span class="text-rose-500">*</span></label>
                        <div class="flex rounded-xl overflow-hidden focus-within:ring-4 focus-within:ring-rose-500/10 focus-within:border-rose-400 transition-all border border-slate-200 bg-slate-50 focus-within:bg-white">
                            <input v-model.number="exp.amount" @input="formError = ''" type="number" step="any" min="0" placeholder="0.00" class="flex-1 bg-transparent px-4 py-3 text-sm font-black text-slate-800 outline-none placeholder:font-normal">
                            <select v-model="exp.currency" class="bg-slate-100 border-l border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 outline-none cursor-pointer hover:bg-slate-200 transition-colors appearance-none">
                                <option value="USD">$ (USD)</option>
                                <option value="KHR">៛ (KHR)</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label class="block text-[11px] font-black text-slate-500 mb-1.5 uppercase">ឈ្មោះអ្នកស្នើប្រាក់</label>
                        <input v-model="exp.requester" type="text" placeholder="បញ្ជូលឈ្មោះអ្នកស្នើ..." class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:bg-white focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all">
                    </div>

                    <div class="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100/60">
                        <label class="block text-[11px] font-black text-indigo-800 mb-3 uppercase tracking-wide">កាត់កងចំណាយទៅលើអ្នកគ្រប់គ្រងណាខ្លះ?</label>
                        
                        <div v-if="!activeAdmins || activeAdmins.length === 0" class="text-xs text-rose-600 font-bold bg-white p-3 rounded-lg border border-rose-100 shadow-sm flex items-center gap-2">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                            មិនមានអ្នកគ្រប់គ្រងដែលមានចំណូលទេក្នុងកាលបរិច្ឆេទនេះ!
                        </div>
                        <div v-else class="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                            <label class="flex items-center gap-3 cursor-pointer group bg-white p-2.5 rounded-lg border border-transparent hover:border-indigo-200 transition-all shadow-sm">
                                <input type="checkbox" value="ALL" v-model="exp.targetAdmins" @change="handleAllToggle(index)" class="w-4 h-4 rounded border-slate-300 text-rose-500 focus:ring-rose-500 cursor-pointer">
                                <span class="text-xs font-black text-slate-800 group-hover:text-rose-600 transition-colors flex items-center gap-2">
                                    👉 រួមទាំងអស់ (Global Expense)
                                </span>
                            </label>
                            
                            <label v-for="admin in activeAdmins" :key="admin.originalAdminId" class="flex items-center gap-3 cursor-pointer group bg-white p-2.5 rounded-lg border border-slate-100 hover:border-indigo-200 transition-all">
                                <input type="checkbox" :value="admin.originalAdminId" v-model="exp.targetAdmins" @change="handleIndividualToggle(index)" class="w-4 h-4 rounded border-slate-300 text-indigo-500 focus:ring-indigo-500 cursor-pointer">
                                <span class="text-[13px] font-bold text-slate-600 group-hover:text-slate-900">{{ admin.fullName }}</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <button v-if="!editingId" type="button" @click="addExpenseRow" class="w-full py-4 border-2 border-dashed border-slate-300 rounded-2xl text-sm font-black text-slate-500 hover:bg-slate-100 hover:text-slate-700 hover:border-slate-400 transition-all flex items-center justify-center gap-2 mt-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                បន្ថែមចំណាយមួយទៀត
            </button>
        </div>

        <div v-show="activeTab === 'list'" class="flex-1 overflow-y-auto bg-slate-50 custom-scrollbar flex flex-col relative">
            
            <div class="px-6 py-4 bg-white border-b border-slate-200 flex justify-between items-center sticky top-0 z-10 shadow-sm">
                <div class="text-sm font-black text-slate-700 flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-rose-500"></span>
                    ចំនួនទិន្នន័យ: {{ expensesList.length }}
                </div>
                <div class="flex items-center gap-2">
                    <button @click="downloadExcel" :disabled="isExportingExcel || expensesList.length === 0" class="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-lg text-[11px] font-black transition-all disabled:opacity-50">
                        <span v-if="isExportingExcel" class="animate-spin h-3.5 w-3.5 border-2 border-current border-t-transparent rounded-full"></span>
                        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        Excel
                    </button>
                    <button @click="downloadPDF" :disabled="isExportingPDF || expensesList.length === 0" class="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white rounded-lg text-[11px] font-black transition-all disabled:opacity-50">
                        <span v-if="isExportingPDF" class="animate-spin h-3.5 w-3.5 border-2 border-current border-t-transparent rounded-full"></span>
                        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        PDF
                    </button>
                </div>
            </div>

            <div class="p-4 md:p-6 space-y-4">
                <div v-if="expensesList.length === 0" class="flex flex-col items-center justify-center py-20 text-slate-400 opacity-60">
                    <svg class="w-20 h-20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    <span class="font-bold text-[15px]">មិនទាន់មានទិន្នន័យចំណាយទេ</span>
                </div>
                
                <div v-else v-for="(item, index) in paginatedList" :key="item.id" class="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative animate-fade-in-up">
                    <div class="absolute top-0 right-0 px-3 py-1 bg-slate-100 text-slate-500 text-[11px] font-black rounded-bl-xl border-l border-b border-slate-200">#{{ (currentPage - 1) * itemsPerPage + index + 1 }}</div>
                    
                    <div class="pr-14">
                        <h4 class="font-black text-slate-800 text-[15px] mb-1">{{ item.reason }}</h4>
                        <div class="text-xl font-black text-rose-600 mb-4">{{ item.amount?.toLocaleString() }} {{ item.currency === 'USD' ? '$' : '៛' }}</div>
                    </div>
                    
                    <div class="grid grid-cols-1 gap-2.5 text-[12px] font-bold text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div class="flex items-center gap-2">
                            <svg class="w-4 h-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg> 
                            <span>ស្នើដោយ: <span class="text-slate-800">{{ item.requester }}</span></span>
                        </div>
                        <div class="flex items-center gap-2">
                            <svg class="w-4 h-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg> 
                            <span>កាលបរិច្ឆេទ: <span class="text-slate-800">{{ formatDate(item.createdAt || item.date) }}</span></span>
                        </div>
                        <div class="flex items-start gap-2 pt-1 border-t border-slate-200/60 mt-1">
                            <svg class="w-4 h-4 shrink-0 text-indigo-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg> 
                            <span class="leading-relaxed">កាត់ទៅលើ: <span class="text-indigo-600">{{ formatTargets(item.targetAdmins) }}</span></span>
                        </div>
                    </div>

                    <div class="absolute bottom-5 right-5 flex gap-2">
                        <button @click="editExpense(item)" class="w-9 h-9 bg-slate-100 hover:bg-blue-500 hover:text-white text-slate-500 rounded-xl flex items-center justify-center transition-all shadow-sm">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                        </button>
                        <button @click="confirmDelete(item.id)" class="w-9 h-9 bg-slate-100 hover:bg-rose-500 hover:text-white text-slate-500 rounded-xl flex items-center justify-center transition-all shadow-sm">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                    </div>
                </div>

                <div v-if="totalPages > 1" class="flex justify-between items-center bg-white p-3 rounded-2xl border border-slate-200 mt-6 shadow-sm">
                    <button @click="currentPage--" :disabled="currentPage === 1" class="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg></button>
                    <span class="text-[13px] font-black text-slate-600 bg-slate-100 px-4 py-1.5 rounded-lg">ទំព័រ {{ currentPage }} នៃ {{ totalPages }}</span>
                    <button @click="currentPage++" :disabled="currentPage === totalPages" class="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg></button>
                </div>
            </div>
        </div>

        <div v-if="activeTab === 'add'" class="p-6 border-t border-slate-200 bg-white shrink-0 z-10">
            <button @click="submitExpenses" :disabled="isSubmitting" class="w-full bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-black py-4 rounded-xl shadow-lg shadow-rose-500/30 transition-transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50">
                <span v-if="isSubmitting" class="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
                {{ editingId ? 'រក្សាទុកការកែប្រែ' : 'រក្សាទុកការចំណាយ' }}
            </button>
        </div>

      </div>
    </transition>

    <transition enter-active-class="duration-200 ease-out" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100" leave-active-class="duration-150 ease-in" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
        <div v-if="deleteAlert.show" class="fixed inset-0 z-[9999999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm font-khmer">
            <div class="bg-white rounded-3xl w-full max-w-sm p-6 text-center shadow-2xl relative overflow-hidden animate-slide-up border border-rose-100">
                <div class="absolute top-0 inset-x-0 h-2 bg-rose-500"></div>
                <div class="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-100">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </div>
                <h3 class="text-lg font-black text-slate-800 mb-2">បញ្ជាក់ការលុប!</h3>
                <p class="text-[13px] font-bold text-slate-500 leading-relaxed mb-6">តើអ្នកពិតជាចង់លុបការចំណាយនេះមែនទេ? ទិន្នន័យនេះមិនអាចទាញមកវិញបានឡើយ។</p>
                <div class="flex gap-3">
                    <button @click="deleteAlert.show = false" class="flex-1 bg-slate-100 text-slate-600 hover:bg-slate-200 font-black py-3 rounded-xl transition-all active:scale-95">បោះបង់</button>
                    <button @click="executeDelete" class="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-black py-3 rounded-xl transition-all shadow-md shadow-rose-500/30 active:scale-95">យល់ព្រមលុប</button>
                </div>
            </div>
        </div>
    </transition>

    <div ref="printStaging" class="fixed top-0 left-[-9999px] pointer-events-none z-[-1] opacity-0"></div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, reactive, nextTick } from 'vue';
import { db, auth } from '@/firebaseConfig';
import { collection, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const props = defineProps({ 
    show: Boolean, 
    activeAdmins: Array,
    expensesList: Array, 
    
    dateFilterType: String,
    selectedDate: String,
    selectedMonth: Number,
    selectedYear: Number,
    customStart: String,
    customEnd: String,
    availableYears: Array,
    availableMonths: Array
});

const emit = defineEmits([
    'close', 'expensesUpdated', 
    'update:dateFilterType', 'update:selectedDate', 'update:selectedMonth', 
    'update:selectedYear', 'update:customStart', 'update:customEnd'
]);

const activeTab = ref('add');
const isSubmitting = ref(false);
const defaultAdminName = ref('');
const formError = ref(''); 

// Export States
const isExportingPDF = ref(false);
const isExportingExcel = ref(false);
const printStaging = ref(null);

const expenses = ref([]);
const editingId = ref(null);

const currentPage = ref(1);
const itemsPerPage = 30;

const deleteAlert = reactive({ show: false, targetId: null });

const initDefaultRow = () => {
    expenses.value = [{ reason: '', amount: null, currency: 'USD', requester: defaultAdminName.value, targetAdmins: ['ALL'] }];
    editingId.value = null;
    formError.value = '';
};

onMounted(() => {
    defaultAdminName.value = auth.currentUser?.displayName || 'Admin';
    initDefaultRow();
});

watch(activeTab, (val) => {
    if (val === 'add' && !editingId.value) initDefaultRow();
    formError.value = '';
});

const totalPages = computed(() => Math.ceil(props.expensesList.length / itemsPerPage));
const paginatedList = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    return props.expensesList.slice(start, start + itemsPerPage);
});

const addExpenseRow = () => {
    expenses.value.push({ reason: '', amount: null, currency: 'USD', requester: defaultAdminName.value, targetAdmins: ['ALL'] });
};

const removeExpenseRow = (index) => { expenses.value.splice(index, 1); };

const handleAllToggle = (index) => {
    if (expenses.value[index].targetAdmins.includes('ALL')) {
        expenses.value[index].targetAdmins = ['ALL']; 
    }
};

const handleIndividualToggle = (index) => {
    const list = expenses.value[index].targetAdmins;
    if (list.includes('ALL') && list.length > 1) {
        expenses.value[index].targetAdmins = list.filter(a => a !== 'ALL');
    }
    if (expenses.value[index].targetAdmins.length === 0) {
        expenses.value[index].targetAdmins = ['ALL']; 
    }
};

const submitExpenses = async () => {
    formError.value = '';
    
    for (let i = 0; i < expenses.value.length; i++) {
        const exp = expenses.value[i];
        if (!exp.reason.trim()) {
            formError.value = `សូមបញ្ជូល "បរិយាយ / មូលហេតុ" នៅចំណាយទី ${i + 1}`;
            return;
        }
        if (!exp.amount || exp.amount <= 0) {
            formError.value = `សូមបញ្ជូល "ចំនួនទឹកប្រាក់" ឱ្យបានត្រឹមត្រូវ នៅចំណាយទី ${i + 1}`;
            return;
        }
    }

    isSubmitting.value = true;
    try {
        const saveDate = new Date();
        if (props.dateFilterType === 'daily' && props.selectedDate) {
            const [y, m, d] = props.selectedDate.split('-');
            saveDate.setFullYear(y, m - 1, d);
        }
        const createdAtStr = saveDate.toISOString();
        const justDateStr = createdAtStr.split('T')[0]; 

        if (editingId.value) {
            const exp = expenses.value[0];
            await updateDoc(doc(db, 'daily_expenses', editingId.value), {
                reason: exp.reason, amount: exp.amount, currency: exp.currency,
                requester: exp.requester || 'មិនបញ្ជាក់', targetAdmins: exp.targetAdmins
            });
        } else {
            const promises = expenses.value.map(exp => {
                return addDoc(collection(db, 'daily_expenses'), {
                    reason: exp.reason, amount: exp.amount, currency: exp.currency,
                    requester: exp.requester || defaultAdminName.value || 'មិនបញ្ជាក់',
                    targetAdmins: exp.targetAdmins,
                    createdBy: auth.currentUser?.uid, 
                    createdAt: createdAtStr,   
                    date: justDateStr          
                });
            });
            await Promise.all(promises);
        }
        
        emit('expensesUpdated'); 
        initDefaultRow(); 
        if(editingId.value) activeTab.value = 'list';
        else emit('close');
    } catch (e) {
        console.error(e);
        formError.value = "មានបញ្ហាក្នុងការរក្សាទុកទិន្នន័យ សូមព្យាយាមម្ដងទៀត!";
    } finally {
        isSubmitting.value = false;
    }
};

const editExpense = (item) => {
    editingId.value = item.id;
    expenses.value = [{
        reason: item.reason, amount: item.amount, currency: item.currency || 'USD',
        requester: item.requester, targetAdmins: item.targetAdmins || ['ALL']
    }];
    activeTab.value = 'add';
};

const confirmDelete = (id) => {
    deleteAlert.targetId = id;
    deleteAlert.show = true;
};

const executeDelete = async () => {
    if (!deleteAlert.targetId) return;
    try {
        await deleteDoc(doc(db, 'daily_expenses', deleteAlert.targetId));
        deleteAlert.show = false;
        deleteAlert.targetId = null;
        emit('expensesUpdated');
    } catch(e) { console.error(e); }
};

// 🌟 Safety Check Utility Functions 🌟
const formatDate = (dateInput) => {
   if(!dateInput) return '';
   try {
       let date;
       if (typeof dateInput.toDate === 'function') date = dateInput.toDate();
       else date = new Date(dateInput);
       if (isNaN(date.getTime())) return '';
       return new Intl.DateTimeFormat('km-KH', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
   } catch(e) { return ''; }
};

const formatTargets = (targets) => {
    if(!targets || !Array.isArray(targets) || targets.includes('ALL')) return 'រួមទាំងអស់';
    const names = targets.map(id => {
        const found = (props.activeAdmins || []).find(a => a.originalAdminId === id);
        return found ? found.fullName : 'មិនស្គាល់';
    });
    return names.join(', ');
};

const getFilterLabelForExport = () => {
    if (props.dateFilterType === 'daily') return `ប្រចាំថ្ងៃទី ${props.selectedDate}`;
    if (props.dateFilterType === 'monthly') return `ប្រចាំខែទី ${props.selectedMonth + 1} ឆ្នាំ ${props.selectedYear}`;
    if (props.dateFilterType === 'yearly') return `ប្រចាំឆ្នាំ ${props.selectedYear}`;
    return `ចាប់ពី ${props.customStart} ដល់ ${props.customEnd}`;
};


// ==========================================
// 🌟 SMART PDF PAGINATION LOGIC (FIXED PAGE BREAKS) 🌟
// ==========================================
const downloadPDF = async () => {
    isExportingPDF.value = true;
    try {
        const totalUSD = props.expensesList.filter(e => e.currency === 'USD').reduce((sum, e) => sum + (Number(e.amount)||0), 0);
        const totalKHR = props.expensesList.filter(e => e.currency !== 'USD').reduce((sum, e) => sum + (Number(e.amount)||0), 0);

        // ១. ចែកទិន្នន័យជាកញ្ចប់តូចៗ (Chunking 20 ជួរ ក្នុង ១ ទំព័រ A4)
        const rowsPerPage = 23; 
        const chunks = [];
        for (let i = 0; i < props.expensesList.length; i += rowsPerPage) {
            chunks.push(props.expensesList.slice(i, i + rowsPerPage));
        }

        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = 210;
        const pdfHeight = 297; 

        // ២. គូរទំព័រម្តងមួយៗ (Page by Page Render)
        for (let pageIndex = 0; pageIndex < chunks.length; pageIndex++) {
            const chunk = chunks[pageIndex];
            const startIndex = pageIndex * rowsPerPage;

            const rowsHTML = chunk.map((item, idx) => {
                const amountDisplay = `${Number(item.amount).toLocaleString()} ${item.currency === 'USD' ? '$' : '៛'}`;
                const amountColor = item.currency === 'USD' ? '#e11d48' : '#ea580c'; 
                return `
                <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'}; border-bottom: 1px solid #e2e8f0;">
                    <td style="padding: 12px; text-align: center; color: #64748b; font-size: 13px;">${startIndex + idx + 1}</td>
                    <td style="padding: 12px; font-weight: bold; color: #1e293b; font-size: 14px;">${item.reason}</td>
                    <td style="padding: 12px; text-align: center; color: #475569; font-size: 13px;">${item.requester || 'មិនបញ្ជាក់'}</td>
                    <td style="padding: 12px; text-align: right; font-weight: bold; color: ${amountColor}; font-size: 15px;">${amountDisplay}</td>
                    <td style="padding: 12px; text-align: center; color: #64748b; font-size: 12px;">${formatDate(item.createdAt || item.date)}</td>
                    <td style="padding: 12px; color: #4338ca; font-size: 12px;">${formatTargets(item.targetAdmins)}</td>
                </tr>
            `}).join('');

            // សរុបប្រាក់ (បង្ហាញតែនៅលើទំព័រចុងក្រោយប៉ុណ្ណោះ)
            const isLastPage = pageIndex === chunks.length - 1;
            const grandTotalHTML = isLastPage ? `
                <div style="display: flex; justify-content: flex-end; margin-top: 20px;">
                    <div style="background: linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%); border: 1px solid #fecdd3; border-radius: 16px; padding: 25px; width: 400px;">
                        <h3 style="margin: 0 0 15px 0; font-size: 18px; color: #be123c; border-bottom: 1px dashed #fda4af; padding-bottom: 10px;">សរុបការចំណាយ (Grand Total)</h3>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                            <span style="color: #9f1239; font-weight: bold; font-size: 15px;">សរុប (USD):</span>
                            <span style="font-size: 24px; font-weight: 900; color: #e11d48;">${totalUSD.toLocaleString(undefined, {minimumFractionDigits:2})} $</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="color: #9f1239; font-weight: bold; font-size: 15px;">សរុប (KHR):</span>
                            <span style="font-size: 24px; font-weight: 900; color: #ea580c;">${totalKHR.toLocaleString()} ៛</span>
                        </div>
                    </div>
                </div>
            ` : '';

            // តំណាងទំហំក្រដាស A4 (1000px គុណ 1414px)
            printStaging.value.innerHTML = `
                <div id="pdf-page-${pageIndex}" style="width: 1000px; height: 1414px; background: #ffffff; padding: 40px; box-sizing: border-box; font-family: 'Kantumruy Pro', 'Battambang', sans-serif; position: relative;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #1e293b; padding-bottom: 20px; margin-bottom: 30px;">
                        <div>
                            <h1 style="margin: 0 0 10px 0; font-size: 28px; color: #0f172a; font-weight: 900;">របាយការណ៍ចំណាយ</h1>
                            <div style="display: inline-block; background-color: #f1f5f9; padding: 6px 12px; border-radius: 6px; border: 1px solid #cbd5e1; font-size: 14px; color: #475569; font-weight: bold;">
                                📅 ${getFilterLabelForExport()}
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <p style="margin: 0 0 5px 0; font-size: 14px; color: #1e293b;">ទាញយកដោយ: <b style="color: #4f46e5;">${defaultAdminName.value || 'Admin'}</b></p>
                            <p style="margin: 0; font-size: 14px; color: #64748b;">ទំព័រទី ${pageIndex + 1} នៃ ${chunks.length}</p>
                        </div>
                    </div>

                    <table style="width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0;">
                        <thead>
                            <tr style="background-color: #1e293b; color: white;">
                                <th style="padding: 15px 12px; text-align: center; font-size: 13px;">ល.រ</th>
                                <th style="padding: 15px 12px; text-align: left; font-size: 13px;">បរិយាយ / មូលហេតុ</th>
                                <th style="padding: 15px 12px; text-align: center; font-size: 13px;">អ្នកស្នើប្រាក់</th>
                                <th style="padding: 15px 12px; text-align: right; font-size: 13px;">ទឹកប្រាក់</th>
                                <th style="padding: 15px 12px; text-align: center; font-size: 13px;">កាលបរិច្ឆេទ</th>
                                <th style="padding: 15px 12px; text-align: left; font-size: 13px;">កាត់លើអ្នកគ្រប់គ្រង</th>
                            </tr>
                        </thead>
                        <tbody>${rowsHTML}</tbody>
                    </table>
                    
                    <div style="position: absolute; bottom: 40px; left: 40px; right: 40px;">
                        ${grandTotalHTML}
                        <div style="border-top: 1px solid #cbd5e1; margin-top: 20px; padding-top: 15px; font-size: 12px; color: #94a3b8; display: flex; justify-content: space-between; font-weight: bold;">
                            <span>ដោយ: ${defaultAdminName.value}</span>
                            <span>កាលបរិច្ឆេទព្រីន: ${new Date().toLocaleString('km-KH')}</span>
                        </div>
                    </div>
                </div>
            `;

            await nextTick(); 
            await document.fonts.ready; 
            await new Promise(r => setTimeout(r, 400)); 

            const targetElement = document.getElementById(`pdf-page-${pageIndex}`);
            const canvas = await html2canvas(targetElement, { 
                scale: 2, 
                useCORS: true, 
                backgroundColor: "#ffffff"
            });
            
            const imgData = canvas.toDataURL('image/jpeg', 1.0);

            if (pageIndex > 0) pdf.addPage();
            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        }

        pdf.save(`Expense_Report_${new Date().getTime()}.pdf`);

    } catch(e) { 
        console.error(e); 
        alert("មានបញ្ហាក្នុងការទាញយក PDF");
    } finally { 
        printStaging.value.innerHTML = '';
        isExportingPDF.value = false; 
    }
};

// ==========================================
// 🌟 RESTORED & SAFE EXCEL EXPORT 🌟
// ==========================================
const downloadExcel = () => {
    isExportingExcel.value = true;
    try {
        const totalUSD = props.expensesList.filter(e => e.currency === 'USD').reduce((sum, e) => sum + (Number(e.amount)||0), 0);
        const totalKHR = props.expensesList.filter(e => e.currency !== 'USD').reduce((sum, e) => sum + (Number(e.amount)||0), 0);

        let rows = '';
        props.expensesList.forEach((item, index) => {
            const amountDisplay = `${Number(item.amount).toLocaleString()} ${item.currency === 'USD' ? '$' : '៛'}`;
            rows += `
                <tr>
                    <td style="text-align: center; border: 1px solid #000000; vertical-align: middle;">${index + 1}</td>
                    <td style="border: 1px solid #000000; vertical-align: middle;">${item.reason}</td>
                    <td style="text-align: center; border: 1px solid #000000; vertical-align: middle;">${item.requester || 'មិនបញ្ជាក់'}</td>
                    <td style="text-align: right; border: 1px solid #000000; vertical-align: middle; color: ${item.currency === 'USD' ? '#ff0000' : '#ff8800'}; font-weight: bold;">${amountDisplay}</td>
                    <td style="text-align: center; border: 1px solid #000000; vertical-align: middle;">${formatDate(item.createdAt || item.date)}</td>
                    <td style="border: 1px solid #000000; vertical-align: middle;">${formatTargets(item.targetAdmins)}</td>
                </tr>
            `;
        });

        const htmlContent = `
            <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
            <head>
                <meta charset="utf-8">
                <style>
                    table { font-family: 'Battambang', 'Kantumruy Pro', sans-serif; border-collapse: collapse; }
                    th { background-color: #1e293b; color: #ffffff; font-weight: bold; border: 1px solid #000000; padding: 10px; font-size: 12pt; }
                    td { padding: 8px; font-size: 11pt; }
                    .title { font-size: 18pt; font-weight: bold; text-align: center; background-color: #f1f5f9; height: 40px; vertical-align: middle;}
                    .subtitle { font-size: 12pt; font-weight: bold; text-align: center; background-color: #f1f5f9; height: 30px; vertical-align: middle;}
                    .total-label { font-weight: bold; text-align: right; background-color: #fff1f2; border: 1px solid #000000;}
                    .total-val { font-weight: bold; font-size: 14pt; background-color: #fff1f2; border: 1px solid #000000;}
                </style>
            </head>
            <body>
                <table>
                    <tr>
                        <td colspan="6" class="title">របាយការណ៍ចំណាយ (Expense Report)</td>
                    </tr>
                    <tr>
                        <td colspan="6" class="subtitle">កាលបរិច្ឆេទ: ${getFilterLabelForExport()} | ទាញយកនៅ: ${new Date().toLocaleString('km-KH')}</td>
                    </tr>
                    <tr><td colspan="6"></td></tr>
                    <tr>
                        <th width="50">ល.រ</th>
                        <th width="300">បរិយាយ / មូលហេតុ</th>
                        <th width="150">អ្នកស្នើប្រាក់</th>
                        <th width="120">ទឹកប្រាក់</th>
                        <th width="150">កាលបរិច្ឆេទ</th>
                        <th width="250">កាត់លើអ្នកគ្រប់គ្រង</th>
                    </tr>
                    ${rows}
                    <tr><td colspan="6"></td></tr>
                    <tr>
                        <td colspan="3" class="total-label">សរុបការចំណាយ (USD):</td>
                        <td colspan="3" class="total-val" style="color: #e11d48;">${totalUSD.toLocaleString()} $</td>
                    </tr>
                    <tr>
                        <td colspan="3" class="total-label">សរុបការចំណាយ (KHR):</td>
                        <td colspan="3" class="total-val" style="color: #ea580c;">${totalKHR.toLocaleString()} ៛</td>
                    </tr>
                </table>
            </body>
            </html>
        `;

        // Add UTF-8 BOM (\ufeff) to force Excel to read Khmer characters correctly
        const blob = new Blob(['\ufeff', htmlContent], { type: 'application/vnd.ms-excel;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Expense_Report_${new Date().getTime()}.xls`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (e) {
        console.error(e);
        alert("មានបញ្ហាក្នុងការទាញយក Excel សូមពិនិត្យមើល Console!");
    } finally {
        isExportingExcel.value = false;
    }
};

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;500;600;700;900&family=Battambang:wght@400;700;900&display=swap');
.font-khmer { font-family: 'Kantumruy Pro', 'Battambang', sans-serif; }
.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.animate-fade-in-up { animation: fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(15px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
.animate-slide-up { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
.slide-enter-active, .slide-leave-active { transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-enter-from, .slide-leave-to { transform: translateX(100%); }
</style>