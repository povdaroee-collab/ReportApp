<template>
  <div>
    <transition name="modal-fade">
      <div v-if="show" class="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-slate-900/80 backdrop-blur-sm overflow-y-auto custom-scrollbar font-khmer" @click.self="handleBackdropClick" @paste="handlePaste">
        
        <div class="w-full max-w-6xl bg-slate-50 text-left shadow-2xl transition-all rounded-[2rem] flex flex-col relative animate-slide-up my-auto border border-white/20 overflow-hidden" @click.stop>
          
          <div v-if="isExtracting" class="absolute inset-0 bg-white/95 backdrop-blur-md z-[999] flex flex-col items-center justify-center">
              <div class="relative w-24 h-24 mb-6">
                <div class="absolute inset-0 rounded-full border-4 border-indigo-100"></div>
                <div class="absolute inset-0 rounded-full border-4 border-t-indigo-600 border-r-indigo-600 animate-spin"></div>
                <div class="absolute inset-0 flex items-center justify-center">
                    <svg class="w-10 h-10 text-indigo-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                </div>
              </div>
              <p class="font-black text-indigo-900 text-2xl tracking-wide mb-2">ប្រព័ន្ធ AI កំពុងវិភាគទិន្នន័យ...</p>
              <p class="text-sm font-bold text-slate-500 bg-slate-100 px-4 py-2 rounded-full animate-pulse">សូមរង់ចាំបន្តិច វាចំណាយពេលតែប៉ុន្មានវិនាទីប៉ុណ្ណោះ!</p>
          </div>

          <div class="px-6 md:px-8 py-5 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
              </div>
              <div>
                <h3 class="text-xl md:text-2xl font-black text-slate-800 tracking-tight">បញ្ជាក់ការទូទាត់</h3>
                <p class="text-xs font-bold text-slate-500 mt-0.5 uppercase tracking-widest">Checkout Processing</p>
              </div>
            </div>
            <button type="button" @click="$emit('close')" class="w-10 h-10 rounded-full hover:bg-rose-50 text-slate-400 hover:text-rose-500 flex items-center justify-center transition-colors focus:outline-none border border-slate-200 bg-white shadow-sm active:scale-95">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          
          <div class="flex-1 flex flex-col lg:flex-row overflow-y-auto custom-scrollbar" @click="closeDropdowns">
            
            <div class="w-full lg:w-[55%] p-6 md:p-8 bg-white border-r border-slate-100 flex flex-col gap-6">
              
              <div class="flex bg-slate-100/80 p-1.5 rounded-[1.25rem] border border-slate-200/60 shadow-inner relative">
                  <button type="button" @click="activeTab = 'delivery'" class="flex-1 py-3 px-4 text-[13px] font-black rounded-xl transition-all flex items-center justify-center gap-2 z-10" :class="activeTab === 'delivery' ? 'bg-white text-blue-700 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
                      ផ្ញើតាមខេត្ត/ក្រុង
                  </button>
                  <button type="button" @click="activeTab = 'direct'" class="flex-1 py-3 px-4 text-[13px] font-black rounded-xl transition-all flex items-center justify-center gap-2 z-10" :class="activeTab === 'direct' ? 'bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-200' : 'text-slate-500 hover:text-slate-700'">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                      អតិថិជនទិញផ្ទាល់
                  </button>
              </div>

              <div v-if="activeTab === 'delivery'" class="space-y-4 animate-fade-in">
                  <div class="flex items-center justify-between">
                    <h4 class="text-sm font-black text-slate-800 flex items-center gap-2">
                        <div class="w-6 h-6 rounded bg-indigo-100 text-indigo-600 flex items-center justify-center"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg></div>
                        បំពេញស្វ័យប្រវត្តិ (AI)
                    </h4>
                    <div class="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                        <span class="text-[10px] font-black text-indigo-600">Credit: {{ Math.max(0, 180 - currentDailyUsage) }}/180</span>
                    </div>
                  </div>
                  
                  <div class="flex gap-3">
                      <button type="button" @click="inputMode = 'manual'" :class="inputMode === 'manual' ? 'bg-slate-800 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'" class="flex-1 py-3 rounded-xl text-xs font-black transition-all border border-transparent flex items-center justify-center gap-2">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg> បញ្ចូលដោយដៃ
                      </button>
                      <button type="button" @click="inputMode = 'smart'" :class="inputMode === 'smart' ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-sm ring-2 ring-indigo-500/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-transparent'" class="flex-1 py-3 rounded-xl text-xs font-black transition-all border flex items-center justify-center gap-2">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg> Paste រូបភាព (AI)
                      </button>
                  </div>

                  <div v-if="inputMode === 'smart'" class="relative overflow-hidden rounded-[1.25rem] border-2 border-dashed border-indigo-300 bg-indigo-50/50 p-6 text-center animate-fade-in hover:bg-indigo-50 transition-colors group">
                      <div class="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-indigo-100 group-hover:scale-110 transition-transform">
                          <svg class="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                      </div>
                      <p class="text-sm font-black text-indigo-900 mb-1">ចុច <kbd class="bg-white px-2 py-0.5 rounded shadow-sm border border-indigo-200 text-indigo-600 font-mono text-xs mx-1">Ctrl + V</kbd> នៅទីនេះ</p>
                      <p class="text-[11px] font-bold text-indigo-600/70">ដើម្បី Paste រូបភាពទាញយកព័ត៌មានអតិថិជនស្វ័យប្រវត្តិ</p>
                  </div>
              </div>

              <div class="space-y-5">
                  <div v-if="activeTab === 'delivery'" class="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fade-in">
                      <div class="relative customer-dropdown-container z-[55] md:col-span-2">
                          <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">ឈ្មោះអតិថិជន <span class="text-rose-500">*</span></label>
                          <div class="relative">
                            <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg></span>
                            <input v-model="form.customerName" @focus="showCustomerDropdown = true" @input="handleCustomerInput" @click.stop type="text" placeholder="បញ្ចូលឈ្មោះ..." class="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 text-slate-800 font-bold text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm">
                          </div>
                          <div v-if="showCustomerDropdown && filteredCustomers.length > 0" class="absolute z-[100] left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-2xl max-h-48 overflow-y-auto py-1.5 custom-scrollbar">
                              <div v-for="(cust, idx) in filteredCustomers" :key="idx" @click.stop="selectCustomer(cust)" class="px-4 py-2.5 hover:bg-blue-50 cursor-pointer border-b border-slate-50 last:border-0 transition-colors">
                                  <div class="text-sm font-black text-slate-800">{{ cust.name }}</div>
                                  <div class="text-[11px] text-slate-500 font-bold mt-0.5">{{ cust.phone }}</div>
                              </div>
                          </div>
                      </div>
                      
                      <div class="md:col-span-2">
                        <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">លេខទូរស័ព្ទ <span class="text-rose-500">*</span></label>
                        <div class="relative">
                          <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg></span>
                          <input v-model="form.customerPhone" type="text" placeholder="ឧ. 012 345 678..." class="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 text-slate-800 font-bold text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm">
                        </div>
                      </div>

                      <div class="relative z-[50]">
                        <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">ខេត្ត/ក្រុង <span class="text-rose-500">*</span></label>
                        <div class="relative">
                            <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg></span>
                            <input type="text" v-model="provinceSearch" @focus="showProvinceDropdown = true" @input="handleProvinceInput" @click.stop placeholder="ជ្រើសរើស..." class="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-11 pr-10 py-3.5 text-slate-800 font-bold text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm">
                            <svg class="w-5 h-5 absolute right-3 top-[14px] text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                        </div>
                        
                        <div v-if="showProvinceDropdown" class="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-2xl max-h-56 overflow-y-auto z-[100] p-1.5 custom-scrollbar">
                          <div v-if="filteredProvinces.length === 0" class="p-3 text-center text-sm text-slate-400 font-bold">រកមិនឃើញទិន្នន័យ</div>
                          <div v-else v-for="prov in filteredProvinces" :key="prov" @click.stop="selectProvince(prov)" class="px-4 py-2.5 hover:bg-blue-50 rounded-lg cursor-pointer text-sm font-bold text-slate-700 transition-colors">{{ prov }}</div>
                        </div>
                      </div>

                      <div class="relative z-[49]">
                        <div class="flex items-center justify-between mb-1.5">
                            <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest" :class="(!form.province) ? 'opacity-50' : ''">ទីតាំងលម្អិត</label>
                            <span v-if="inputMode === 'smart' && form.province" class="text-[9px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded flex items-center gap-1 border border-emerald-100"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg> AI</span>
                        </div>
                        <input v-model="form.district" @focus="showDistrictDropdown = true" @input="showDistrictDropdown = true" @click.stop :disabled="!form.province" type="text" :placeholder="(!form.province) ? 'សូមរើសខេត្តសិន...' : 'ខណ្ឌ ផ្លូវ ផ្ទះ...'" class="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-800 font-bold text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm disabled:bg-slate-100 disabled:cursor-not-allowed">
                        <div v-if="showDistrictDropdown && inputMode === 'manual' && form.province && filteredDistricts.length > 0" class="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-2xl max-h-48 overflow-y-auto z-[100] p-1.5 custom-scrollbar">
                          <div v-for="dist in filteredDistricts" :key="dist" @click.stop="selectDistrict(dist)" class="px-4 py-2.5 hover:bg-blue-50 rounded-lg cursor-pointer text-sm font-bold text-slate-700 transition-colors">{{ dist }}</div>
                        </div>
                      </div>
                  </div>

                  <div v-else class="bg-emerald-50/80 border border-emerald-200 rounded-[1.25rem] p-6 text-center animate-fade-in mt-4">
                      <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-emerald-100">
                        <svg class="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      </div>
                      <h4 class="text-lg font-black text-emerald-800 mb-2">អតិថិជនមកទិញផ្ទាល់ (Walk-in)</h4>
                      <p class="text-sm text-emerald-600/80 font-bold leading-relaxed px-4">ប្រព័ន្ធនឹងកំណត់ជា "អតិថិជនទិញផ្ទាល់" និងមិនមានការដឹកជញ្ជូនឡើយ។</p>
                  </div>
              </div>
            </div>

            <div class="w-full lg:w-[45%] flex flex-col bg-slate-50 relative">
              <div class="p-6 md:p-8 flex-1 space-y-6">
                
                <div class="relative z-[60] bg-white p-4 rounded-[1.25rem] border border-slate-200 shadow-sm">
                  <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">
                    អ្នកលក់ (SELLER) 
                    <span v-if="activeTab === 'delivery'" class="text-rose-500">*</span>
                    <span v-else class="text-slate-400 font-bold normal-case text-[10px] ml-1 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">(ជម្រើស)</span>
                  </label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <input type="text" v-model="sellerSearchQuery" @focus="showSellerDropdown = true" @input="showSellerDropdown = true" @click.stop :placeholder="activeTab === 'direct' ? 'មិនមានអ្នកលក់...' : 'ស្វែងរកឈ្មោះតំណាងលក់...'" class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-10 py-3 text-slate-800 font-bold text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all">
                    <button v-if="form.sellerId" type="button" @click.stop="clearSeller" class="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-rose-500 transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                  </div>
                  <div v-if="showSellerDropdown" class="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-56 overflow-y-auto z-[100] p-1.5 custom-scrollbar">
                    <div v-if="filteredSellers.length === 0" class="p-4 text-center text-sm font-bold text-slate-400">រកមិនឃើញតំណាងលក់ទេ</div>
                    <div v-else v-for="s in filteredSellers" :key="s.id" @click.stop="selectSeller(s)" class="flex items-center gap-3 p-2 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors group">
                      <img :src="s.photoUrl || `https://ui-avatars.com/api/?name=${s.fullName}`" class="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0">
                      <div class="flex-1 min-w-0">
                        <h4 class="font-black text-sm text-slate-800 truncate group-hover:text-blue-700">{{ s.fullName }}</h4>
                        <p class="text-[10px] text-slate-500 font-bold mt-0.5">ID: {{ s.idNumber || 'N/A' }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="space-y-5">
                  <div>
                    <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">កាលបរិច្ឆេទ <span class="text-rose-500">*</span></label>
                    <div class="relative">
                      <span class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></span>
                      <input v-model="form.date" type="datetime-local" class="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-slate-800 font-bold text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none cursor-pointer transition-all shadow-sm">
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">ការបង់ប្រាក់</label>
                      <div class="relative">
                        <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg></span>
                        <select v-model="form.paymentMethod" class="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-8 py-3 text-slate-800 font-bold text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none cursor-pointer transition-all shadow-sm">
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
                            <select v-model="form.paymentStatus" class="w-full bg-white border border-slate-200 rounded-xl pl-4 pr-8 py-3 text-sm font-black outline-none focus:ring-2 appearance-none cursor-pointer transition-all shadow-sm" :class="form.paymentStatus === 'PENDING' ? 'text-amber-600 focus:border-amber-500 focus:ring-amber-500/20 bg-amber-50/30' : 'text-emerald-600 focus:border-emerald-500 focus:ring-emerald-500/20 bg-emerald-50/30'">
                                <option value="PAID" class="text-emerald-600">ទូទាត់រួច</option>
                                <option value="PENDING" class="text-amber-600">ជំពាក់</option>
                            </select>
                            <svg class="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" :class="form.paymentStatus === 'PENDING' ? 'text-amber-500' : 'text-emerald-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                        </div>
                    </div>
                  </div>

                  <div v-if="activeTab === 'delivery'" class="animate-fade-in relative">
                      <div class="flex items-center justify-between mb-1.5">
                          <label class="block text-[11px] font-black text-sky-600 uppercase tracking-widest">ថ្លៃដឹកជញ្ជូន (DELIVERY FEE)</label>
                          <div class="flex items-center gap-2">
                             <span v-if="isManualDeliveryFee" @click="resetToAutoFee" class="text-[10px] font-bold text-sky-500 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded cursor-pointer hover:bg-sky-100 transition-colors">Reset (គណនាអូតូវិញ)</span>
                             <span v-else class="text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded shadow-sm">ស្វ័យប្រវត្តិ</span>
                          </div>
                      </div>
                      
                      <div class="flex bg-white border rounded-xl overflow-hidden focus-within:ring-2 transition-all shadow-sm relative"
                           :class="deliveryFeeError ? 'border-rose-500 focus-within:ring-rose-500/30' : 'border-sky-300 focus-within:ring-sky-500/30'">
                          <input :value="form.deliveryFee" @input="onManualFeeInput" type="number" step="any" min="0" placeholder="0.00" class="w-full bg-transparent px-4 py-3 text-sm font-black text-sky-700 outline-none">
                          <select v-model="form.deliveryCurrency" @change="onCurrencyChange" class="bg-sky-50 border-l border-sky-200 px-4 text-sm font-black text-sky-700 outline-none cursor-pointer hover:bg-sky-100 transition-colors">
                              <option value="USD">$ (USD)</option>
                              <option value="KHR">៛ (KHR)</option>
                          </select>
                      </div>

                      <p v-if="deliveryFeeError" class="text-[10px] text-rose-500 font-bold mt-1.5 flex items-center gap-1 animate-pulse">
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> {{ deliveryFeeError }}
                      </p>
                      <p v-else-if="freeDeliveryApplied" class="text-[10px] text-emerald-600 font-bold mt-1.5 flex items-center gap-1 animate-pulse">
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> អតិថិជនទទួលបានការហ្វ្រីសេវាដឹកជញ្ជូន!
                      </p>
                  </div>

                  <div>
                    <div class="flex items-center justify-between mb-1.5">
                        <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest">ចំណាំបញ្ជាក់ (NOTE)</label>
                        <button v-if="form.province === 'រាជធានីភ្នំពេញ' || form.province === 'ភ្នំពេញ'" type="button" @click="addDeliveryGuyNote" class="text-[9px] font-black bg-slate-200 text-slate-600 px-2 py-0.5 rounded border border-slate-300 hover:bg-slate-300 transition-colors">
                            + អ្នកដឹកជញ្ជូន
                        </button>
                    </div>
                    <div class="relative">
                      <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg></span>
                      <input v-model="form.paymentNote" type="text" list="payment-notes" placeholder="វាយបញ្ចូលចំណាំ..." class="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-3 text-slate-800 font-bold text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm">
                      <datalist id="payment-notes">
                        <option value="បានទូទាត់រួច"></option><option value="មិនទាន់ទូទាត់"></option><option value="ទូទាត់តាមអ្នកដឹកជញ្ជូន"></option>
                      </datalist>
                    </div>
                  </div>
                </div>
              </div>

              <div class="p-6 bg-slate-900 text-white shrink-0 relative overflow-hidden">
                <div class="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
                <div class="flex items-end justify-between relative z-10">
                  <div>
                    <p class="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">ទំនិញសរុបទាំងអស់</p>
                    <p class="text-xl font-black">{{ cartLength }} <span class="text-sm font-bold text-slate-500">មុខ</span></p>
                  </div>
                  <div class="text-right">
                    <p class="text-[11px] text-slate-300 font-bold uppercase tracking-wider mb-1.5">ទឹកប្រាក់សរុប (GRAND TOTAL)</p>
                    <p class="text-4xl font-black text-emerald-400 drop-shadow-md">{{ formatPrice(checkoutFinalTotalUSD, 'USD') }}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div class="px-6 md:px-8 py-5 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 rounded-b-[2rem]">
            
            <label class="flex items-center gap-2 cursor-pointer group select-none outline-none w-full sm:w-auto p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
                <input type="checkbox" v-model="isFastInputMode" class="hidden">
                <div class="flex items-center justify-center w-5 h-5 rounded border-2 transition-all duration-200" :class="isFastInputMode ? 'bg-indigo-600 border-indigo-600 shadow-sm' : 'bg-white border-slate-300 group-hover:border-indigo-400'">
                    <svg v-if="isFastInputMode" class="w-3.5 h-3.5 text-white animate-fade-in" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                </div>
                <span class="text-sm font-black transition-colors" :class="isFastInputMode ? 'text-indigo-700' : 'text-slate-600 group-hover:text-indigo-600'">បញ្ជូលទិន្នន័យលឿន (Fast Mode)</span>
            </label>

            <div class="flex items-center justify-end gap-3 w-full sm:w-auto">
                <button type="button" @click="clearForm" class="flex-1 sm:flex-none px-6 py-3.5 rounded-xl font-bold text-slate-600 bg-white border border-slate-300 hover:bg-slate-100 transition-colors text-sm shadow-sm active:scale-95">
                    សម្អាតទិន្នន័យ
                </button>

                <button 
                    type="button" 
                    @click="onSubmit" 
                    :disabled="!isFormValid || isSubmitting || deliveryFeeError !== ''" 
                    class="flex-1 sm:flex-none px-8 py-3.5 rounded-xl font-black text-white shadow-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-[15px]" 
                    :class="activeTab === 'delivery' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-indigo-500/30' : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-emerald-500/30'"
                >
                  <span v-if="isSubmitting" class="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
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
          <div class="w-full max-w-md transform bg-white rounded-[2rem] p-6 text-center shadow-2xl relative overflow-hidden animate-slide-up">
              <div class="absolute top-0 inset-x-0 h-2 bg-rose-500"></div>
              <div class="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-rose-100 mt-2">
                  <svg class="w-10 h-10 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              </div>
              <h3 class="text-xl font-black text-slate-800 mb-2">ឈានដល់ដែនកំណត់ប្រចាំថ្ងៃ!</h3>
              <p class="text-sm font-bold text-slate-600 leading-relaxed mb-6 px-4">
                  មុខងារ បញ្ជូលទិន្នន័យរហ័សសម្រាប់ថ្ងៃនេះអស់ Credit ហើយ! <br>
                  <span class="text-rose-500 mt-2 block bg-rose-50 p-2 rounded-lg border border-rose-100">សូមទាក់ទងអ្នកអភិវឌ្ឍន៍កម្មវិធីដើម្បី Upgrade មុខងារនេះទៅកាន់ Pro Version !</span>
              </p>
              <button @click="showUpgradeModal = false" class="w-full bg-slate-800 hover:bg-slate-900 text-white font-black py-4 rounded-xl transition-all active:scale-95 shadow-md text-sm">
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
import { auth, db } from '@/firebaseConfig'; 
import { doc, getDoc } from 'firebase/firestore'; 

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
    deliveryFee: null, deliveryCurrency: 'USD' // set default to null for auto-clear
});

// ==========================================
// 🚚 SMART DELIVERY FEE LOGIC (With Max Limit Validation)
// ==========================================
const deliverySettings = ref(null);
const isManualDeliveryFee = ref(false);
const freeDeliveryApplied = ref(false);
const deliveryFeeError = ref(''); // 🌟 សម្រាប់ផ្ទុកសារ Error

const fetchDeliverySettings = async () => {
    try {
        const snap = await getDoc(doc(db, 'settings', 'delivery_fees'));
        if (snap.exists()) {
            deliverySettings.value = snap.data();
            calculateAutoDeliveryFee(); 
        }
    } catch(e) {
        console.error("Error fetching delivery settings", e);
    }
};

const calculateAutoDeliveryFee = () => {
    if (isManualDeliveryFee.value) return; 
    if (!deliverySettings.value) return;
    freeDeliveryApplied.value = false;
    deliveryFeeError.value = ''; // ជម្រះ Error ពេលគិតអូតូ

    if (activeTab.value === 'direct') {
        form.deliveryFee = null;
        return;
    }

    let settingsToUse = null;
    if (form.province === 'រាជធានីភ្នំពេញ' || form.province === 'ភ្នំពេញ') {
        settingsToUse = deliverySettings.value.phnomPenh;
    } else if (form.province) {
        settingsToUse = deliverySettings.value.provincial;
    }

    if (settingsToUse) {
        form.deliveryCurrency = settingsToUse.currency || 'USD';
        const cartTotal = props.cartTotalUSD || 0;
        const minAmount = Number(settingsToUse.conditionMinAmount) || 0;

        if (settingsToUse.hasCondition && cartTotal >= minAmount) {
            form.deliveryFee = Number(settingsToUse.conditionFee) || 0;
            if(form.deliveryFee === 0) freeDeliveryApplied.value = true;
        } else {
            form.deliveryFee = Number(settingsToUse.baseFee || settingsToUse.amount || 0);
        }
    } else {
        form.deliveryFee = null;
    }
};

// 🌟 មុខងារចាប់តម្លៃពេលវាយញ្ចូល និងកាត់ចោលបើលើស
const onManualFeeInput = (e) => {
    isManualDeliveryFee.value = true;
    freeDeliveryApplied.value = false;
    let val = Number(e.target.value);
    
    if (form.deliveryCurrency === 'USD' && val > 16) {
        form.deliveryFee = null; // សម្អាតទិន្នន័យ
        e.target.value = '';     // សម្អាតពីប្រអប់បញ្ចូល
        deliveryFeeError.value = "តម្លៃដឹកជញ្ជូនមិនអាចលើសពី 16$ ទេ!";
    } else if (form.deliveryCurrency === 'KHR' && val > 64000) {
        form.deliveryFee = null; // សម្អាតទិន្នន័យ
        e.target.value = '';     // សម្អាតពីប្រអប់បញ្ចូល
        deliveryFeeError.value = "តម្លៃដឹកជញ្ជូនមិនអាចលើសពី 64,000៛ ទេ!";
    } else {
        form.deliveryFee = val;
        deliveryFeeError.value = ''; // បញ្ចូលត្រូវលក្ខខណ្ឌ លុប Error ចោល
    }
};

const onCurrencyChange = () => {
    isManualDeliveryFee.value = true; 
    freeDeliveryApplied.value = false;
    let val = Number(form.deliveryFee);
    
    if (form.deliveryCurrency === 'USD' && val > 16) {
        form.deliveryFee = null;
        deliveryFeeError.value = "តម្លៃដឹកជញ្ជូនមិនអាចលើសពី 16$ ទេ!";
    } else if (form.deliveryCurrency === 'KHR' && val > 64000) {
        form.deliveryFee = null;
        deliveryFeeError.value = "តម្លៃដឹកជញ្ជូនមិនអាចលើសពី 64,000៛ ទេ!";
    } else {
        deliveryFeeError.value = '';
    }
};

const resetToAutoFee = () => {
    isManualDeliveryFee.value = false;
    deliveryFeeError.value = '';
    calculateAutoDeliveryFee();
    notification.success("ប្រព័ន្ធបានគណនាតម្លៃដឹកស្វ័យប្រវត្តិឡើងវិញ!");
};

watch(() => props.show, (newVal) => {
    if (newVal) {
        form.date = getLocalISOString();
        fetchDeliverySettings(); 
    }
});

watch(() => props.cartTotalUSD, () => calculateAutoDeliveryFee());

watch(() => form.province, (newProv) => {
    if (!newProv) {
        form.paymentStatus = 'PAID';
        form.paymentNote = '';
    } else if (newProv === 'រាជធានីភ្នំពេញ' || newProv === 'ភ្នំពេញ') {
        form.paymentStatus = 'PENDING';
        form.paymentNote = 'ទូទាត់តាមអ្នកដឹកជញ្ជូន';
    } else {
        form.paymentStatus = 'PAID';
        form.paymentNote = 'បានទូទាត់រួច';
    }
    calculateAutoDeliveryFee();
});

watch(activeTab, () => calculateAutoDeliveryFee());

// ==========================================

const clearForm = () => {
    form.customerName = ''; form.customerPhone = ''; form.province = ''; form.district = '';
    form.paymentMethod = 'CASH'; form.paymentStatus = 'PAID'; form.paymentNote = ''; form.paymentImage = '';
    form.date = getLocalISOString();
    provinceSearch.value = '';
    
    // Reset Auto Fee & Errors
    isManualDeliveryFee.value = false;
    deliveryFeeError.value = '';
    calculateAutoDeliveryFee();
};

const resetForm = () => {
    activeTab.value = 'delivery';
    clearForm();
};
defineExpose({ resetForm });

const isFormValid = computed(() => {
    if (props.cartLength === 0) return false;
    if (!form.date) return false;
    if (deliveryFeeError.value !== '') return false; // មិនឱ្យចុច Save បើមាន Error តម្លៃដឹក

    if (activeTab.value === 'delivery') {
        if (!form.sellerId) return false; 
        if (!form.customerName || !form.customerPhone || !form.district || !form.province) return false;
        return true;
    } else if (activeTab.value === 'direct') {
        return true; 
    }
    return true; 
});

const checkoutFinalTotalUSD = computed(() => {
    let deliveryUSD = 0;
    if (activeTab.value === 'delivery' && form.deliveryFee > 0) {
        deliveryUSD = form.deliveryCurrency === 'USD' ? Number(form.deliveryFee) : (Number(form.deliveryFee) / 4000);
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

const showUpgradeModal = ref(false);
const MAX_DAILY_LIMIT = 180; 
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
// 💡 SUBMIT LOGIC 
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
@import url('https://fonts.googleapis.com/css2?family=Battambong:wght@400;700;900&family=Kantumruy+Pro:wght@400;700;900&display=swap');
.font-khmer { font-family: 'Kantumruy Pro', 'Battambong', sans-serif; }
.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #94a3b8; }
.animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes slideUp { from { opacity: 0; transform: translateY(30px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
.animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.3s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
input[type="number"]::-webkit-inner-spin-button, input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
input[type="number"] { -moz-appearance: textfield; }
select { -webkit-appearance: none; -moz-appearance: none; }
</style>