<template>
  <div>
    <transition name="modal-fade">
      <div v-if="show" class="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-slate-900/80 backdrop-blur-sm overflow-y-auto custom-scrollbar font-khmer" @click.self="handleBackdropClick" @paste="handlePaste">
        
        <div class="w-full max-w-4xl bg-white text-left shadow-2xl transition-all rounded-[24px] flex flex-col relative animate-slide-up my-auto border border-white/20" @click.stop>
          
          <div v-if="isExtracting" class="absolute inset-0 bg-white/95 backdrop-blur-md z-[999] flex flex-col items-center justify-center rounded-[24px]">
              <div class="relative w-20 h-20 mb-4">
                <div class="absolute inset-0 rounded-full border-4 border-indigo-100"></div>
                <div class="absolute inset-0 rounded-full border-4 border-t-indigo-600 border-r-indigo-600 animate-spin"></div>
                <div class="absolute inset-0 flex items-center justify-center">
                    <svg class="w-8 h-8 text-indigo-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                </div>
              </div>
              <p class="font-black text-indigo-800 text-xl tracking-wide">ប្រព័ន្ធ AI កំពុងវិភាគទិន្នន័យ...</p>
              <p class="text-sm font-bold text-slate-500 mt-2">សូមរង់ចាំបន្តិច វាចំណាយពេលតែប៉ុន្មានវិនាទីប៉ុណ្ណោះ!</p>
          </div>

          <div class="px-6 md:px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0 rounded-t-[24px]">
            <div class="flex items-center gap-3">
              <div class="w-11 h-11 bg-gradient-to-br from-indigo-50 to-blue-100 text-indigo-600 rounded-xl flex items-center justify-center shadow-sm border border-indigo-100">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
              </div>
              <h3 class="text-xl md:text-2xl font-black text-slate-800 tracking-tight">បញ្ជាក់ការទូទាត់ទំនិញ</h3>
            </div>
            <button type="button" @click="$emit('close')" class="w-10 h-10 rounded-full hover:bg-rose-50 text-slate-400 hover:text-rose-500 flex items-center justify-center transition-colors focus:outline-none border border-slate-200 shadow-sm bg-white">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div class="flex px-6 md:px-8 pt-2 border-b border-slate-100 bg-slate-50/50 shrink-0">
              <button type="button" @click="activeTab = 'delivery'" class="pb-3 px-4 text-sm font-black border-b-[3px] transition-colors flex items-center gap-2" :class="activeTab === 'delivery' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-400 hover:text-slate-600'">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
                  ផ្ញើតាមខេត្ត/ក្រុង
              </button>
              <button type="button" @click="activeTab = 'direct'" class="pb-3 px-4 text-sm font-black border-b-[3px] transition-colors flex items-center gap-2" :class="activeTab === 'direct' ? 'border-emerald-500 text-emerald-700' : 'border-transparent text-slate-400 hover:text-slate-600'">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                  អតិថិជនទិញផ្ទាល់
              </button>
          </div>
          
          <div class="p-6 md:p-8 overflow-y-visible space-y-6 flex-1 bg-white" @click="closeDropdowns">
            
            <div class="relative z-[60] bg-slate-50/50 p-4 rounded-[16px] border border-slate-100">
              <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">
                តំណាងលក់ (SELLER) 
                <span v-if="activeTab === 'delivery'" class="text-rose-500">*</span>
                <span v-else class="text-slate-400 font-bold normal-case text-[10px] ml-1 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">(ជម្រើស)</span>
              </label>
              
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input type="text" v-model="sellerSearchQuery" @focus="showSellerDropdown = true" @input="showSellerDropdown = true" @click.stop :placeholder="activeTab === 'direct' ? 'មិនមានអ្នកលក់ (អាចរំលងបាន)...' : 'ស្វែងរកឈ្មោះ ឬ អត្តលេខតំណាងលក់...'" class="w-full bg-white border border-slate-300 rounded-xl pl-12 pr-10 py-3.5 text-slate-800 font-bold text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm">
                <button v-if="form.sellerId" type="button" @click.stop="clearSeller" class="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-rose-500 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
              <div v-if="showSellerDropdown" class="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto z-[100] p-1.5 custom-scrollbar">
                <div v-if="filteredSellers.length === 0" class="p-4 text-center text-sm font-bold text-slate-400">រកមិនឃើញតំណាងលក់ទេ</div>
                <div v-else v-for="s in filteredSellers" :key="s.id" @click.stop="selectSeller(s)" class="flex items-center gap-3 p-2 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors group">
                  <img :src="s.photoUrl || `https://ui-avatars.com/api/?name=${s.fullName}`" class="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0 shadow-sm">
                  <div class="flex-1 min-w-0">
                    <h4 class="font-black text-sm text-slate-800 truncate group-hover:text-blue-700">{{ s.fullName }}</h4>
                    <p class="text-[11px] text-slate-500 font-bold mt-0.5">ID: {{ s.idNumber || 'N/A' }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="activeTab === 'delivery'" class="space-y-6 animate-fade-in">
                
                <div class="flex bg-slate-100 p-1.5 rounded-[16px] border border-slate-200 shadow-inner w-full md:w-3/4 lg:w-1/2 mx-auto relative overflow-hidden">
                    <button type="button" @click="inputMode = 'manual'" :class="inputMode === 'manual' ? 'bg-white text-slate-800 shadow border-slate-200' : 'text-slate-500 hover:text-slate-700 border-transparent'" class="flex-1 py-2.5 rounded-xl text-[13px] font-black transition-all border z-10">
                        បញ្ចូលដោយដៃ
                    </button>
                    <button type="button" @click="inputMode = 'smart'" :class="inputMode === 'smart' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30' : 'text-slate-500 hover:text-blue-600'" class="flex-1 py-2.5 rounded-xl text-[13px] font-black transition-all flex items-center justify-center gap-2 z-10">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg> 
                        Paste ស្វ័យប្រវត្តិ (AI)
                    </button>
                </div>

                <div v-if="inputMode === 'smart'" class="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-center gap-4 animate-fade-in">
                    <div class="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-indigo-200">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                    </div>
                    <div class="flex-1">
                        <p class="text-[15px] font-black text-indigo-900 mb-0.5">មុខងារ AI កំពុងរង់ចាំ...</p>
                        <p class="text-xs font-bold text-indigo-600/90">គ្រាន់តែចុច <span class="bg-white px-1.5 py-0.5 rounded shadow-sm font-mono border border-indigo-200 text-indigo-800">Ctrl + V</span> នៅទីនេះ ដើម្បី Paste រូបភាពពី Telegram ទាញទិន្នន័យអូតូ។</p>
                    </div>
                    <div class="hidden sm:flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-indigo-100 shadow-sm shrink-0">
                        <span class="relative flex h-2.5 w-2.5">
                          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                          <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
                        </span>
                        <span class="text-[11px] font-black text-indigo-600">Credit ថ្ងៃនេះ: {{ Math.max(0, 140 - currentDailyUsage) }}/140</span>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                  
                  <div class="relative customer-dropdown-container z-[55]">
                      <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">ឈ្មោះអតិថិជន <span class="text-rose-500">*</span></label>
                      <input 
                          v-model="form.customerName" 
                          @focus="showCustomerDropdown = true" 
                          @input="handleCustomerInput"
                          @click.stop
                          type="text" placeholder="បញ្ចូលឈ្មោះ..." 
                          class="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-800 font-bold text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
                      >
                      <div v-if="showCustomerDropdown && filteredCustomers.length > 0" class="absolute z-[100] left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-2xl max-h-48 overflow-y-auto py-1.5 custom-scrollbar">
                          <div v-for="(cust, idx) in filteredCustomers" :key="idx" @click.stop="selectCustomer(cust)" class="px-4 py-2.5 hover:bg-blue-50 cursor-pointer border-b border-slate-50 last:border-0 transition-colors">
                              <div class="text-sm font-black text-slate-800">{{ cust.name }}</div>
                              <div class="text-[11px] text-slate-500 font-bold mt-0.5">{{ cust.phone }}</div>
                          </div>
                      </div>
                  </div>
                  
                  <div>
                    <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">លេខទូរស័ព្ទ <span class="text-rose-500">*</span></label>
                    <input v-model="form.customerPhone" type="text" placeholder="បញ្ចូលលេខទូរស័ព្ទ..." class="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-800 font-bold text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm">
                  </div>

                  <div class="relative z-[50]">
                    <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">ខេត្ត/ក្រុង <span class="text-rose-500">*</span></label>
                    <div class="relative">
                        <input type="text" v-model="provinceSearch" @focus="showProvinceDropdown = true" @input="handleProvinceInput" @click.stop placeholder="ជ្រើសរើសខេត្ត/ក្រុង..." class="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-800 font-bold text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm">
                        <svg class="w-5 h-5 absolute right-3 top-[12px] text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                    
                    <div v-if="showProvinceDropdown" class="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-2xl max-h-56 overflow-y-auto z-[100] p-1.5 custom-scrollbar">
                      <div v-if="filteredProvinces.length === 0" class="p-3 text-center text-sm text-slate-400 font-bold">រកមិនឃើញទិន្នន័យ</div>
                      <div v-else v-for="prov in filteredProvinces" :key="prov" @click.stop="selectProvince(prov)" class="px-4 py-2.5 hover:bg-blue-50 rounded-lg cursor-pointer text-sm font-bold text-slate-700 transition-colors">{{ prov }}</div>
                    </div>
                  </div>

                  <div class="relative z-[49] md:col-span-2">
                    <div class="flex items-center justify-between mb-1.5">
                        <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest" :class="(!form.province) ? 'opacity-50' : ''">
                            ទីតាំងសាខាទទួលអីវ៉ាន់ និងព័ត៌មានបន្ថែម <span class="text-rose-500">*</span>
                        </label>
                        
                        <span v-if="inputMode === 'smart' && form.province" class="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-lg font-black border border-emerald-200 flex items-center gap-1 shadow-sm">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg> AI រកឃើញខេត្ត
                        </span>
                    </div>
                    
                    <textarea 
                        v-model="form.district" 
                        @focus="showDistrictDropdown = true" 
                        @input="showDistrictDropdown = true" 
                        @click.stop
                        :disabled="!form.province" 
                        rows="2"
                        :placeholder="(!form.province) ? 'សូមរើសខេត្តសិន...' : 'វាយបញ្ចូលទីតាំងលម្អិត...'" 
                        class="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-800 font-bold text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm disabled:bg-slate-100 disabled:cursor-not-allowed resize-none"
                    ></textarea>
                    
                    <div v-if="showDistrictDropdown && inputMode === 'manual' && form.province && filteredDistricts.length > 0" class="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-2xl max-h-48 overflow-y-auto z-[100] p-1.5 custom-scrollbar">
                      <div v-for="dist in filteredDistricts" :key="dist" @click.stop="selectDistrict(dist)" class="px-4 py-2.5 hover:bg-blue-50 rounded-lg cursor-pointer text-sm font-bold text-slate-700 transition-colors">{{ dist }}</div>
                    </div>
                  </div>

                  <div class="pt-2">
                    <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">កាលបរិច្ឆេទ</label>
                    <input v-model="form.date" type="datetime-local" class="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-800 font-bold text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none cursor-pointer transition-all shadow-sm">
                  </div>

                  <div class="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">ការបង់ប្រាក់</label>
                        <div class="relative">
                          <select v-model="form.paymentMethod" class="w-full bg-white border border-slate-300 rounded-xl pl-4 pr-8 py-3 text-slate-800 font-bold text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none cursor-pointer transition-all shadow-sm">
                            <option value="CASH">សាច់ប្រាក់</option>
                            <option value="KHQR">វេរប្រាក់</option>
                            <option value="BANK">ធនាគារ</option>
                          </select>
                          <svg class="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                        </div>
                      </div>
                      <div>
                          <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">ស្ថានភាព</label>
                          <div class="relative">
                              <select v-model="form.paymentStatus" class="w-full bg-white border border-slate-300 rounded-xl pl-4 pr-8 py-3 text-slate-800 font-bold text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none cursor-pointer transition-all shadow-sm" :class="form.paymentStatus === 'PENDING' ? 'text-amber-600 bg-amber-50 border-amber-300' : 'text-emerald-700 bg-emerald-50 border-emerald-300'">
                                  <option value="PAID">ទូទាត់រួច (PAID)</option>
                                  <option value="PENDING">ជំពាក់ (PENDING)</option>
                              </select>
                              <svg class="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                          </div>
                      </div>
                  </div>

                  <div>
                      <label class="block text-[11px] font-black text-sky-600 uppercase tracking-widest mb-1.5">ថ្លៃដឹកជញ្ជូន (DELIVERY FEE)</label>
                      <div class="flex bg-white border border-sky-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-sky-500/30 transition-all shadow-sm">
                          <input v-model.number="form.deliveryFee" type="number" step="any" min="0" placeholder="0.00" class="w-full bg-transparent px-4 py-3 text-sm font-black text-sky-700 outline-none">
                          <select v-model="form.deliveryCurrency" class="bg-sky-50 border-l border-sky-200 px-4 text-sm font-black text-sky-700 outline-none cursor-pointer">
                              <option value="USD">$ (USD)</option>
                              <option value="KHR">៛ (KHR)</option>
                          </select>
                      </div>
                  </div>

                  <div>
                    <div class="flex items-center justify-between mb-1.5">
                        <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest">ចំណាំបញ្ជាក់ (NOTE)</label>
                        <button v-if="form.province === 'រាជធានីភ្នំពេញ'" type="button" @click="addDeliveryGuyNote" class="text-[10px] font-bold bg-amber-50 text-amber-600 px-2.5 py-0.5 rounded border border-amber-200 hover:bg-amber-100 transition-colors">
                            + អ្នកដឹកជញ្ជូន
                        </button>
                    </div>
                    <input v-model="form.paymentNote" type="text" list="payment-notes" placeholder="ឧ. បានទូទាត់រួច..." class="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-800 font-bold text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm">
                    <datalist id="payment-notes">
                      <option value="បានទូទាត់រួច"></option><option value="មិនទាន់ទូទាត់"></option><option value="ទូទាត់តាមអ្នកដឹកជញ្ជូន"></option>
                    </datalist>
                  </div>

                </div>
            </div>

            <div v-if="activeTab === 'direct'" class="space-y-5 animate-fade-in pt-2">
                <div class="bg-emerald-50 border border-emerald-200 rounded-[16px] p-5 flex items-start gap-4 shadow-sm">
                    <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm border border-emerald-100">
                      <svg class="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <div>
                        <p class="text-base font-black text-emerald-800 mb-1">អតិថិជនមកទិញផ្ទាល់ (Walk-in Customer)</p>
                        <p class="text-xs text-emerald-600 font-bold leading-relaxed">ប្រព័ន្ធនឹងកត់ត្រាចូលជា "អតិថិជនទិញផ្ទាល់" និងទីតាំង "ទិញផ្ទាល់" ដោយស្វ័យប្រវត្តិ។</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">កាលបរិច្ឆេទ</label>
                    <input v-model="form.date" type="datetime-local" class="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-800 font-bold text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none cursor-pointer transition-all shadow-sm">
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">ការបង់ប្រាក់</label>
                        <div class="relative">
                          <select v-model="form.paymentMethod" class="w-full bg-white border border-slate-300 rounded-xl pl-4 pr-8 py-3 text-slate-800 font-bold text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none appearance-none cursor-pointer transition-all shadow-sm">
                            <option value="CASH">សាច់ប្រាក់</option>
                            <option value="KHQR">វេរប្រាក់</option>
                          </select>
                          <svg class="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                        </div>
                      </div>
                      <div>
                          <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">ស្ថានភាព</label>
                          <div class="relative">
                              <select v-model="form.paymentStatus" class="w-full bg-emerald-50 border border-emerald-300 rounded-xl pl-4 pr-8 py-3 text-emerald-700 font-black text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none appearance-none cursor-pointer transition-all shadow-sm">
                                  <option value="PAID">ទូទាត់រួច</option>
                              </select>
                              <svg class="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                          </div>
                      </div>
                  </div>
                </div>
            </div>

            <div class="bg-slate-900 text-white rounded-[20px] p-6 shadow-xl border border-slate-800 relative overflow-hidden mt-4">
              <div class="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
              
              <div class="flex justify-between items-center mb-3 relative z-10">
                <span class="text-sm font-bold text-slate-300">ទំនិញសរុបទាំងអស់:</span>
                <span class="text-sm font-black bg-white/10 px-3 py-1.5 rounded-lg shadow-sm border border-white/5">{{ cartLength }} មុខ</span>
              </div>
              <div class="w-full h-px bg-white/10 my-3 relative z-10"></div>
              <div class="flex justify-between items-end relative z-10">
                <span class="text-xs font-black uppercase tracking-widest text-slate-400">ទឹកប្រាក់សរុប (Grand Total)</span>
                <span class="text-4xl font-black text-emerald-400 drop-shadow-md">{{ formatPrice(checkoutFinalTotalUSD, 'USD') }}</span>
              </div>
            </div>

          </div>

          <div class="px-6 md:px-8 py-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 rounded-b-[24px]">
            
            <label class="flex items-center gap-3 cursor-pointer group select-none outline-none w-full sm:w-auto p-2 rounded-xl hover:bg-white transition-colors border border-transparent hover:border-slate-200">
                <input type="checkbox" v-model="isFastInputMode" class="hidden">
                <div class="flex items-center justify-center w-5 h-5 rounded border-2 transition-all duration-200" :class="isFastInputMode ? 'bg-blue-600 border-blue-600 shadow-sm' : 'bg-white border-slate-300 group-hover:border-blue-400'">
                    <svg v-if="isFastInputMode" class="w-3.5 h-3.5 text-white animate-fade-in" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                </div>
                <span class="text-[13px] font-black transition-colors" :class="isFastInputMode ? 'text-blue-700' : 'text-slate-600 group-hover:text-blue-600'">បញ្ជូលទិន្នន័យលឿន (Fast Mode)</span>
            </label>

            <div class="flex items-center justify-end gap-3 w-full sm:w-auto">
                <button type="button" @click="clearForm" class="flex-1 sm:flex-none px-6 py-3.5 rounded-xl font-bold text-slate-600 bg-white border border-slate-300 hover:bg-slate-100 transition-colors text-[14px] shadow-sm">
                    សម្អាត
                </button>

                <button 
                    type="button" 
                    @click="onSubmit" 
                    :disabled="!isFormValid || isSubmitting" 
                    class="flex-1 sm:flex-none px-8 py-3.5 rounded-xl font-black text-white shadow-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-[15px]" 
                    :class="activeTab === 'delivery' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/40' : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-emerald-500/40'"
                >
                  <svg v-if="isSubmitting" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                  បញ្ជាក់ការទូទាត់
                </button>
            </div>
          </div>

        </div>
      </div>
    </transition>

    <transition name="modal-fade">
      <div v-if="showUpgradeModal" class="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm font-khmer">
          <div class="w-full max-w-md transform bg-white rounded-3xl p-6 text-center shadow-2xl relative overflow-hidden animate-slide-up">
              <div class="absolute top-0 inset-x-0 h-2 bg-rose-500"></div>
              <div class="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-rose-100 mt-2">
                  <svg class="w-10 h-10 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              </div>
              <h3 class="text-xl font-black text-slate-800 mb-2">ឈានដល់ដែនកំណត់ប្រចាំថ្ងៃ!</h3>
              <p class="text-[13px] font-bold text-slate-600 leading-relaxed mb-6 px-4">
                  មុខងារ បញ្ជូលទិន្នន័យរហ័សសម្រាប់ថ្ងៃនេះអស់ Credit ហើយ! <br>
                  <span class="text-rose-500 mt-1 block">សូមអ្នកទាក់ទងអ្នកអភិវឌ្ឍន៍កម្មវិធីដើម្បី Upgrade មុខងារនេះទៅ Pro Version !</span>
              </p>
              <button @click="showUpgradeModal = false" class="w-full bg-slate-800 hover:bg-slate-900 text-white font-black py-3.5 rounded-xl transition-all active:scale-95 shadow-md">
                  យល់ព្រម
              </button>
          </div>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { useNotificationStore } from '@/stores/notification';
import Tesseract from 'tesseract.js';
import { auth } from '@/firebaseConfig';

const props = defineProps({
    show: Boolean,
    cartLength: Number,
    cartTotalUSD: Number,
    sellers: Array,
    savedCustomers: { type: Array, default: () => [] },
    isSubmitting: Boolean
});

const emitConfirm = defineEmits(['close', 'confirm']);
const notification = useNotificationStore();

const formatPrice = (val, currency = 'USD') => {
    const num = Number(val);
    if (isNaN(num)) return '0.00 ' + (currency === 'USD' ? '$' : '៛');
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 3 }) + (currency === 'USD' ? ' $' : ' ៛');
};

const activeTab = ref('delivery'); 
const inputMode = ref('manual'); 
const isExtracting = ref(false);

const isFastInputMode = ref(localStorage.getItem('pos_fast_input') === 'true');
watch(isFastInputMode, (newVal) => {
    localStorage.setItem('pos_fast_input', newVal);
});

const getLocalISOString = () => {
    const tzoffset = (new Date()).getTimezoneOffset() * 60000;
    return (new Date(Date.now() - tzoffset)).toISOString().slice(0, 16);
};

const form = reactive({
    sellerId: '', sellerName: '', customerName: '', customerPhone: '',
    province: '', district: '', paymentMethod: 'CASH', paymentStatus: 'PAID', paymentNote: '', 
    date: getLocalISOString(), paymentImage: '',
    deliveryFee: 0, deliveryCurrency: 'USD'
});

watch(() => props.show, (newVal) => {
    if (newVal) form.date = getLocalISOString();
});

const clearForm = () => {
    form.customerName = ''; form.customerPhone = ''; form.province = ''; form.district = '';
    form.paymentMethod = 'CASH'; form.paymentStatus = 'PAID'; form.paymentNote = ''; form.paymentImage = '';
    form.deliveryFee = 0; form.deliveryCurrency = 'USD'; form.date = getLocalISOString();
    provinceSearch.value = '';
};

const resetForm = () => {
    activeTab.value = 'delivery';
    clearForm();
};
defineExpose({ resetForm });

watch(() => form.province, (newProv) => {
    if (newProv === 'រាជធានីភ្នំពេញ' || newProv === 'ភ្នំពេញ') {
        form.paymentNote = 'ទូទាត់តាមអ្នកដឹកជញ្ជូន';
        form.paymentStatus = 'PENDING';
    }
});

// ✅ កែ Validation ឱ្យប៊ូតុង Save ភ្លឺ បើនៅ Tab "Direct" (មិនបាច់មានតំណាងលក់ក៏បាន)
const isFormValid = computed(() => {
    if (props.cartLength === 0) return false;
    if (!form.date) return false;

    if (activeTab.value === 'delivery') {
        if (!form.sellerId) return false; // Tab ផ្ញើខេត្ត ទាមទារអ្នកលក់
        if (!form.customerName || !form.customerPhone || !form.district || !form.province) return false;
        return true;
    } else if (activeTab.value === 'direct') {
        return true; // Tab ទិញផ្ទាល់ មិនទាមទារអីច្រើនទេ
    }
    return true; 
});

const checkoutFinalTotalUSD = computed(() => {
    let deliveryUSD = 0;
    if (activeTab.value === 'delivery' && form.deliveryFee > 0) {
        deliveryUSD = form.deliveryCurrency === 'USD' ? form.deliveryFee : (form.deliveryFee / 4000);
    }
    return props.cartTotalUSD + deliveryUSD;
});

const locationData = {
    "រាជធានីភ្នំពេញ": ["ចំការមន", "ដូនពេញ", "៧មករា", "ទួលគោក", "ដង្កោ", "មានជ័យ", "ឫស្សីកែវ", "សែនសុខ", "ពោធិ៍សែនជ័យ", "ជ្រោយចង្វារ", "ព្រែកព្នៅ", "ច្បារអំពៅ", "បឹងកេងកង", "កំបូល", "ភ្នំពេញ", "ព្រៃស", "ព្រៃ ស", "ចោមចៅ", "កាកាប"],
    "ខេត្តកណ្តាល": ["តាខ្មៅ", "កណ្តាលស្ទឹង", "គីវីស៊ុង", "ខ្សាច់កណ្តាល", "កោះធំ", "លើកដែក", "ល្វាឯម", "មុខកំពូល", "អង្គស្នួល", "ពញាឮ", "ស្អាង", "កណ្តាល", "ព្រែកអញ្ចាញ"],
    "ខេត្តសៀមរាប": ["សៀមរាប", "អង្គរធំ", "អង្គរជុំ", "បន្ទាយស្រី", "ជីក្រែង", "ក្រឡាញ់", "ពួក", "ប្រាសាទបាគង", "ស្រីស្នំ", "ស្វាយលើ", "វ៉ារិន", "សូទ្រនិគម", "ដំដែក"],
    "ខេត្តបាត់ដំបង": ["បាត់ដំបង", "បាណន់", "ថ្មគោល", "បវេល", "ឯកភ្នំ", "មោងឫស្សី", "រតនមណ្ឌល", "សង្កែ", "សំឡូត", "សំពៅលូន", "ភ្នំព្រឹក", "កំរៀង", "គាស់ក្រឡ", "រុក្ខគិរី"],
    "ខេត្តព្រះសីហនុ": ["ព្រះសីហនុ", "ព្រៃនប់", "ស្ទឹងហាវ", "កំពង់សិលា", "កោះរ៉ុង", "កំពង់សោម", "វាលរេញ"],
    "ខេត្តកំពង់ចាម": ["កំពង់ចាម", "ចំការលើ", "ជើងព្រៃ", "កំពង់សៀម", "កងមាស", "កោះសូទិន", "ព្រៃឈរ", "ស្រីសន្ធរ", "ស្ទឹងត្រង់", "បាធាយ", "ជីហែ", "ស្គន់"],
    "ខេត្តត្បូងឃ្មុំ": ["សួង", "ត្បូងឃ្មុំ", "អូររាំងឪ", "ក្រូចឆ្មារ", "តំបែរ", "ពញាក្រែក", "មេមត់"],
    "ខេត្តកំពង់ឆ្នាំង": ["កំពង់ឆ្នាំង", "បរិបូរណ៍", "ជលគីរី", "កំពង់លែង", "កំពង់ត្រឡាច", "តួនឡីសាប", "សាមគ្គីមានជ័យ", "ទឹកផុស", "ព្រៃខ្មែរ"],
    "ខេត្តកំពង់ស្ពឺ": ["ច្បារមន", "បរសេដ្ឋ", "គងពិសី", "ភ្នំស្រួច", "ឧដុង្គ", "សាមគ្គីមុនីជ័យ", "ថ្ពង", "ឱរ៉ាល់", "កំពង់ស្ពឺ", "ត្រែងត្រយឹង"],
    "ខេត្តកំពង់ធំ": ["ស្ទឹងសែន", "បារាយណ៍", "កំពង់ស្វាយ", "ប្រាសាទបល្ល័ង្ក", "ប្រាសាទសំបូរ", "សណ្តាន់", "សន្ទុក", "ស្ទោង", "តាំងគោក", "កំពង់ធំ"],
    "ខេត្តកំពត": ["កំពត", "អង្គរជ័យ", "បន្ទាយមាស", "ឈូក", "ជុំគីរី", "ដងទង់", "កំពង់ត្រាច", "ទឹកឈូ"],
    "ខេត្តកែប": ["កែប", "ដំណាក់ចង្អើរ"],
    "ខេត្តកោះកុង": ["ខេមរភូមិន្ទ", "បូទុមសាគរ", "គិរីសាគរ", "កោះកុង", "មណ្ឌលសីមា", "ស្រែអំបិល", "ថ្មបាំង", "ត្រពាំងរូង"],
    "ខេត្តក្រចេះ": ["ក្រចេះ", "ឆ្លូង", "ព្រែកប្រសប់", "សំបូរ", "ស្នួល", "ចិត្តបុរី"],
    "ខេត្តមណ្ឌលគីរី": ["សែនមនោរម្យ", "កែវសីមា", "កោះញែក", "អូររាំង", "ពេជ្រាដា", "មណ្ឌលគីរី", "ដាក់ដាំ"],
    "ខេត្តរតនគីរី": ["បានលុង", "អណ្តូងមាស", "បរកែវ", "កូនមុំ", "លំផាត់", "អូរជុំ", "អូរយ៉ាដាវ", "តាវែង", "វើនសៃ", "រតនគីរី"],
    "ខេត្តស្ទឹងត្រែង": ["ស្ទឹងត្រែង", "សេសាន", "សៀមបូក", "សៀមប៉ាង", "ថាឡាបរិវ៉ាត់", "បុរីអូរស្វាយសែនជ័យ"],
    "ខេត្តព្រះវិហារ": ["ព្រះវិហារ", "ជ័យសែន", "ឆែប", "ជាំក្សាន្ត", "គូលែន", "ភ្នំត្បែងមានជ័យ", "សង្គមថ្មី", "ត្បែងមានជ័យ"],
    "ខេត្តឧត្តរមានជ័យ": ["សំរោង", "អន្លង់វែង", "បន្ទាយអំពិល", "ចុងកាល់", "ត្រពាំងប្រាសាទ", "ឧត្តរមានជ័យ"],
    "ខេត្តបន្ទាយមានជ័យ": ["សិរីសោភ័ណ", "ប៉ោយប៉ែត", "មង្គលបុរី", "ភ្នំស្រុក", "ព្រះនេត្រព្រះ", "អូរជ្រៅ", "ថ្មពួក", "ស្វាយចេក", "ម៉ាឡៃ", "បន្ទាយមានជ័យ"],
    "ខេត្តប៉ៃលិន": ["ប៉ៃលិន", "សាលាក្រៅ"],
    "ខេត្តពោធិ៍សាត់": ["ពោធិ៍សាត់", "បាកាន", "កណ្តៀង", "ភ្នំក្រវ៉ាញ", "វាលវែង", "តាលោសែនជ័យ", "ថ្មដា"],
    "ខេត្តព្រៃវែង": ["ព្រៃវែង", "បាភ្នំ", "កំចាយមារ", "កញ្ជ្រៀច", "កោះស្រែទៀប", "ពាមជរ", "ពាមរ", "ពារាំង", "ព្រះស្តេច", "ស្វាយអន្ទរ", "ស៊ីធរកណ្តាល", "មេសាង", "អ្នកលឿង"],
    "ខេត្តស្វាយរៀង": ["ស្វាយរៀង", "បាវិត", "ចន្ទ្រា", "កំពង់រោទ៍", "រំដួល", "រមាសហែក", "ស្វាយជ្រំ", "ស្វាយទាប"],
    "ខេត្តតាកែវ": ["ដូនកែវ", "អង្គរបុរី", "បាទី", "បូរីជលសារ", "គិរីវង់", "កោះអណ្តែត", "ព្រៃកប្បាស", "សំរោង", "ត្រាំកក់", "ទ្រាំង", "តាកែវ", "តន់លាប់"]
};

const allProvinces = Object.keys(locationData);
const provinceSearch = ref('');
const showProvinceDropdown = ref(false);
const showDistrictDropdown = ref(false);

const filteredProvinces = computed(() => {
    if (!provinceSearch.value) return allProvinces;
    return allProvinces.filter(p => p.toLowerCase().includes(provinceSearch.value.toLowerCase()));
});
const filteredDistricts = computed(() => {
    if (!form.province || !locationData[form.province]) return [];
    if (!form.district) return locationData[form.province];
    const exactMatch = locationData[form.province].some(d => d === form.district);
    if(exactMatch && !showDistrictDropdown.value) return locationData[form.province];
    return locationData[form.province].filter(d => d.toLowerCase().includes(form.district.toLowerCase()));
});

const handleProvinceInput = () => {
    showProvinceDropdown.value = true;
    const exactMatch = allProvinces.find(p => p.toLowerCase() === provinceSearch.value.toLowerCase());
    if (exactMatch) selectProvince(exactMatch);
    else { 
        form.province = ''; 
        if (inputMode.value === 'manual') form.district = ''; 
    }
};

const selectProvince = (prov) => { 
    form.province = prov; 
    provinceSearch.value = prov; 
    if (inputMode.value === 'manual') { form.district = ''; }
    showProvinceDropdown.value = false; 
    if (inputMode.value === 'manual') { setTimeout(() => showDistrictDropdown.value = true, 100); }
};

const selectDistrict = (dist) => { form.district = dist; showDistrictDropdown.value = false; };

const sellerSearchQuery = ref('');
const showSellerDropdown = ref(false);
const filteredSellers = computed(() => {
    if (!sellerSearchQuery.value) return props.sellers;
    const q = sellerSearchQuery.value.toLowerCase();
    return props.sellers.filter(s => s.fullName.toLowerCase().includes(q) || (s.idNumber && s.idNumber.toLowerCase().includes(q)));
});
const selectSeller = (seller) => { form.sellerId = seller.id; form.sellerName = seller.fullName; sellerSearchQuery.value = seller.fullName; showSellerDropdown.value = false; };
const clearSeller = () => { form.sellerId = ''; form.sellerName = ''; sellerSearchQuery.value = ''; };

const showCustomerDropdown = ref(false);
const filteredCustomers = computed(() => {
    if (!form.customerName) return props.savedCustomers;
    return props.savedCustomers.filter(c => c.name.toLowerCase().includes(form.customerName.toLowerCase()));
});
const handleCustomerInput = () => {
    showCustomerDropdown.value = true;
    if (!form.customerName.trim()) { form.customerPhone = ''; form.province = ''; form.district = ''; provinceSearch.value = ''; }
};
const selectCustomer = (cust) => {
    form.customerName = cust.name; form.customerPhone = cust.phone; form.province = cust.province;
    provinceSearch.value = cust.province; form.district = cust.district; showCustomerDropdown.value = false;
};

const addDeliveryGuyNote = () => {
    const note = form.paymentNote;
    if (!note.includes('ទូទាត់តាមអ្នកដឹកជញ្ជូន')) {
        form.paymentNote = note ? note + '\n- ទូទាត់តាមអ្នកដឹកជញ្ជូន' : 'ទូទាត់តាមអ្នកដឹកជញ្ជូន';
    }
};

const closeDropdowns = () => { 
    showSellerDropdown.value = false; showProvinceDropdown.value = false; 
    showDistrictDropdown.value = false; showCustomerDropdown.value = false;
};

const handleBackdropClick = () => {
    emitConfirm('close');
};

// ==========================================
// 💡 SMART OCR LIMIT LOGIC ចំនួន Cridet Ai 
// ==========================================
const showUpgradeModal = ref(false);
const MAX_DAILY_LIMIT = 140; // ✅ Limit 140
const currentDailyUsage = ref(0);

const checkAndIncrementUsage = () => {
    const user = auth.currentUser;
    if (!user) return false;

    const today = new Date().toISOString().split('T')[0]; 
    const storageKey = `smart_paste_limit_${user.uid}_${today}`;
    
    let usage = parseInt(localStorage.getItem(storageKey)) || 0;
    currentDailyUsage.value = usage;

    if (usage >= MAX_DAILY_LIMIT) {
        return false; 
    }

    localStorage.setItem(storageKey, usage + 1);
    currentDailyUsage.value = usage + 1;
    return true; 
};

onMounted(() => {
    const user = auth.currentUser;
    if (user) {
        const today = new Date().toISOString().split('T')[0];
        currentDailyUsage.value = parseInt(localStorage.getItem(`smart_paste_limit_${user.uid}_${today}`)) || 0;
    }
});

const autoDetectProvince = (locationText) => {
    if (!locationText) return '';
    const text = locationText.toLowerCase().replace(/[\s\-\,\.\(\)]+/g, ''); 

    for (const province of allProvinces) {
        const simpleProv = province.replace(/ខេត្ត|រាជធានី/g, '').replace(/\s+/g, '');
        if (text.includes(simpleProv)) return province;
    }

    for (const [province, districts] of Object.entries(locationData)) {
        for (const district of districts) {
            const simpleDist = district.replace(/ស្រុក|ក្រុង|ខណ្ឌ/g, '').replace(/\s+/g, '');
            if (text.includes(simpleDist)) return province;
        }
    }
    return '';
};

const handlePaste = async (event) => {
    if (activeTab.value !== 'delivery') return;
    
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    let imageFile = null;

    for (const item of items) {
        if (item.type.indexOf('image') === 0) {
            imageFile = item.getAsFile();
            break;
        }
    }

    if (!imageFile) return;

    if (!checkAndIncrementUsage()) {
        showUpgradeModal.value = true;
        return; 
    }

    inputMode.value = 'smart'; 
    isExtracting.value = true;
    try {
        const result = await Tesseract.recognize(imageFile, 'khm+eng');
        parseExtractedText(result.data.text);
        notification.success('ទាញយកទិន្នន័យដោយស្វ័យប្រវត្តិជោគជ័យ!');
    } catch (error) {
        console.error(error);
        notification.error('អានរូបភាពបរាជ័យ សូមសាកល្បងម្ដងទៀត។');
    } finally {
        isExtracting.value = false;
    }
};

const parseExtractedText = (text) => {
    const lines = text.split('\n').map(l => l.replace(/[_*~`]/g, '').trim()).filter(l => l.length > 0);

    let capturingLocation = false;
    let locationParts = [];

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];

        if (/(?:ឈ្មោះ|អតិថិជន|ភ្ញៀវ)[^\:]*\:/i.test(line)) {
            let name = line.substring(line.indexOf(':') + 1).trim();
            if (name) form.customerName = name;
            capturingLocation = false;
            continue;
        }

        if (/អត្តលេខ/i.test(line)) {
            continue;
        }

        const phoneRegex = /(?:0|\+855)[0-9\s.-]{7,12}/g;
        const phonesMatches = line.match(phoneRegex);
        if (phonesMatches && !form.customerPhone) {
            let cleanPhone = phonesMatches[0].replace(/[^\d+]/g, '');
            if (cleanPhone.length >= 8 && cleanPhone.length <= 15) {
                form.customerPhone = cleanPhone;
                capturingLocation = false;
                continue;
            }
        }

        if (/ទីតាំង[^\:]*\:/i.test(line)) {
            capturingLocation = true;
            let loc = line.substring(line.indexOf(':') + 1).trim();
            if (loc) locationParts.push(loc);
            continue;
        }

        if (capturingLocation) {
            if (/^[-•*]/.test(line) || /\:/.test(line) || /(?:ផលិតផល|ទំនិញ|តម្លៃ|សរុប|ការទូទាត់)/i.test(line)) {
                capturingLocation = false;
            } else {
                locationParts.push(line);
            }
        }
    }

    if (locationParts.length > 0) {
        form.district = locationParts.join(' ').trim();
        const detectedProvince = autoDetectProvince(form.district);
        if (detectedProvince) {
            form.province = detectedProvince;
            provinceSearch.value = detectedProvince;
        } else {
            form.province = '';
            provinceSearch.value = '';
        }
    }
};

// ==========================================
// 💡 SUBMIT LOGIC (កែប្រែសម្រាប់ Tab ទិញផ្ទាល់)
// ==========================================
const onSubmit = () => { 
    const payload = { 
        ...form, 
        finalTotalUSD: checkoutFinalTotalUSD.value,
        isFastInputMode: isFastInputMode.value
    };
    
    if (activeTab.value === 'direct') {
        payload.customerName = 'អតិថិជនទិញផ្ទាល់';
        payload.customerPhone = '';
        payload.province = '';
        payload.district = '';
        payload.deliveryFee = 0;
        payload.isDirectCustomer = true; 
        
        // ✅ បើកន្លែងអ្នកលក់នៅទទេ គឺដាក់ "ទិញផ្ទាល់ / មិនមានអ្នកលក់" ដោយស្វ័យប្រវត្តិ
        if (!payload.sellerId) {
            payload.sellerId = 'DIRECT';
            payload.sellerName = 'ទិញផ្ទាល់ / មិនមានអ្នកលក់';
        }
    } else {
        payload.isDirectCustomer = false;
    }

    emitConfirm('confirm', payload); 
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Battambong:wght@400;700;900&display=swap');
.font-khmer { font-family: 'Battambong', sans-serif; }
.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #94a3b8; }
.animate-slide-up { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
.animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.2s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
input[type="number"]::-webkit-inner-spin-button, input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
input[type="number"] { -moz-appearance: textfield; }
select { -webkit-appearance: none; -moz-appearance: none; }
</style>