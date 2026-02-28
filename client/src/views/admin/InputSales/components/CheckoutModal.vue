<template>
  <TransitionRoot appear :show="show" as="template">
    <Dialog as="div" @close="$emit('close')" class="relative z-[9999]" @click="closeDropdowns">
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto custom-scrollbar">
        <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-6">
          <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95 translate-y-4" enter-to="opacity-100 scale-100 translate-y-0" leave="duration-200 ease-in" leave-from="opacity-100 scale-100 translate-y-0" leave-to="opacity-0 scale-95 translate-y-4">
            <DialogPanel class="w-full max-w-2xl transform bg-white text-left align-middle shadow-2xl transition-all font-khmer rounded-[24px] flex flex-col" @click.stop>
              
              <div class="px-6 py-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between shrink-0 rounded-t-[24px]">
                <DialogTitle as="h3" class="text-xl font-black text-slate-800 flex items-center gap-2">បញ្ជាក់ការទូទាត់ទំនិញ</DialogTitle>
                <button @click="$emit('close')" class="p-2 rounded-full hover:bg-slate-200 text-slate-400 transition-colors focus:outline-none bg-white shadow-sm border border-slate-200">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div class="flex border-b border-slate-200 px-6 pt-2 bg-slate-50 shrink-0">
                  <button @click="activeTab = 'delivery'" class="px-4 py-3 text-sm font-black border-b-2 transition-colors flex items-center gap-2" :class="activeTab === 'delivery' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
                      ផ្ញើតាមខេត្ត/ក្រុង
                  </button>
                  <button @click="activeTab = 'direct'" class="px-4 py-3 text-sm font-black border-b-2 transition-colors flex items-center gap-2" :class="activeTab === 'direct' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-400 hover:text-slate-600'">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                      ភ្ញៀវទិញផ្ទាល់
                  </button>
              </div>
              
              <div class="p-6 overflow-y-visible space-y-6">
                
                <div class="relative z-[60]">
                  <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">តំណាងលក់ (SELLER) <span class="text-rose-500">*</span></label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    <input type="text" v-model="sellerSearchQuery" @focus="showSellerDropdown = true" @input="showSellerDropdown = true" placeholder="ស្វែងរកឈ្មោះ ឬ អត្តលេខ..." class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-10 py-3.5 text-slate-800 font-bold text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 outline-none transition-all shadow-inner">
                    <button v-if="form.sellerId" @click.stop="clearSeller" class="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-rose-500 transition-colors">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                  </div>
                  <div v-if="showSellerDropdown" class="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl max-h-64 overflow-y-auto z-[100] p-2 custom-scrollbar">
                    <div v-if="filteredSellers.length === 0" class="p-4 text-center text-xs font-bold text-slate-400">រកមិនឃើញតំណាងលក់ទេ</div>
                    <div v-else v-for="s in filteredSellers" :key="s.id" @click.stop="selectSeller(s)" class="flex items-center gap-4 p-2.5 hover:bg-blue-50 rounded-xl cursor-pointer transition-colors group">
                      <img :src="s.photoUrl || `https://ui-avatars.com/api/?name=${s.fullName}`" class="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-sm shrink-0">
                      <div class="flex-1 min-w-0">
                        <h4 class="font-black text-sm text-slate-800 truncate group-hover:text-blue-700">{{ s.fullName }}</h4>
                        <p class="text-[11px] text-slate-500 font-mono mt-0.5 font-bold">ID: {{ s.idNumber || 'N/A' }}</p>
                      </div>
                      <div v-if="form.sellerId === s.id" class="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center shrink-0 shadow-md">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="activeTab === 'delivery'" class="space-y-6 animate-fade-in">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-slate-100">
                      <div class="relative customer-dropdown-container z-[55]">
                          <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">ឈ្មោះអតិថិជន <span class="text-rose-500">*</span></label>
                          <input 
                              v-model="form.customerName" 
                              @focus="showCustomerDropdown = true" 
                              @input="handleCustomerInput"
                              type="text" required placeholder="បញ្ចូលឈ្មោះអតិថិជន..." 
                              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-bold text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 outline-none transition-all"
                          >
                          <div v-if="showCustomerDropdown && filteredCustomers.length > 0" class="absolute z-[100] left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-48 overflow-y-auto py-1 custom-scrollbar">
                              <div 
                                  v-for="(cust, idx) in filteredCustomers" :key="idx" 
                                  @click.stop="selectCustomer(cust)"
                                  class="px-4 py-2 hover:bg-blue-50 cursor-pointer flex flex-col border-b border-slate-50 last:border-0 transition-colors"
                              >
                                  <span class="text-sm font-black text-slate-800">{{ cust.name }}</span>
                                  <span class="text-[10px] text-slate-500 font-bold mt-0.5">{{ cust.phone }} | {{ cust.province }}</span>
                              </div>
                          </div>
                      </div>
                      
                      <div>
                        <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">លេខទូរស័ព្ទ <span class="text-rose-500">*</span></label>
                        <input v-model="form.customerPhone" type="text" placeholder="បញ្ចូលលេខ..." class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-bold text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 outline-none transition-all">
                      </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 z-[50]">
                      <div class="relative">
                        <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">ខេត្ត/ក្រុង <span class="text-rose-500">*</span></label>
                        <input type="text" v-model="provinceSearch" @focus="showProvinceDropdown = true" @input="handleProvinceInput" placeholder="ជ្រើសរើសខេត្ត/ក្រុង..." class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-bold text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 outline-none transition-all">
                        <svg class="w-4 h-4 absolute right-4 top-[38px] text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                        <div v-if="showProvinceDropdown" class="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto z-[100] p-1 custom-scrollbar">
                          <div v-if="filteredProvinces.length === 0" class="p-3 text-center text-xs text-slate-400 font-bold">រកមិនឃើញទិន្នន័យ</div>
                          <div v-else v-for="prov in filteredProvinces" :key="prov" @click.stop="selectProvince(prov)" class="px-3 py-2 hover:bg-blue-50 rounded-lg cursor-pointer text-sm font-bold text-slate-700 transition-colors">{{ prov }}</div>
                        </div>
                      </div>
                      <div class="relative">
                        <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2" :class="!form.province ? 'opacity-50' : ''">សាខាទទួលអីវ៉ាន់ <span class="text-rose-500">*</span></label>
                        <input type="text" v-model="form.district" @focus="showDistrictDropdown = true" @input="showDistrictDropdown = true" :disabled="!form.province" :placeholder="!form.province ? 'សូមរើសខេត្តសិន...' : 'វាយបញ្ចូល ឬរើស...'" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-bold text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 outline-none transition-all disabled:bg-slate-100 disabled:cursor-not-allowed">
                        <div v-if="showDistrictDropdown && form.province && filteredDistricts.length > 0" class="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto z-[100] p-1 custom-scrollbar">
                          <div v-for="dist in filteredDistricts" :key="dist" @click.stop="selectDistrict(dist)" class="px-3 py-2 hover:bg-blue-50 rounded-lg cursor-pointer text-sm font-bold text-slate-700 transition-colors">{{ dist }}</div>
                        </div>
                      </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-slate-100">
                      <div>
                        <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">កាលបរិច្ឆេទ</label>
                        <input v-model="form.date" type="datetime-local" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-bold text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 outline-none cursor-pointer transition-all">
                      </div>
                      <div class="grid grid-cols-2 gap-3">
                          <div>
                            <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">ការបង់ប្រាក់</label>
                            <div class="relative">
                              <select v-model="form.paymentMethod" class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-8 py-3 text-slate-800 font-bold text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 outline-none appearance-none cursor-pointer transition-all">
                                <option value="CASH">សាច់ប្រាក់</option>
                                <option value="KHQR">វេរប្រាក់</option>
                                <option value="BANK">ធនាគារ</option>
                              </select>
                              <svg class="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                            </div>
                          </div>
                          <div>
                              <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">ស្ថានភាព</label>
                              <div class="relative">
                                  <select v-model="form.paymentStatus" class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-8 py-3 text-slate-800 font-bold text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 outline-none appearance-none cursor-pointer transition-all">
                                      <option value="PAID">ទូទាត់រួច (PAID)</option>
                                      <option value="PENDING">ជំពាក់ (PENDING)</option>
                                  </select>
                                  <svg class="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                              </div>
                          </div>
                      </div>
                    </div>

                    <div>
                        <label class="block text-[11px] font-black text-sky-600 uppercase tracking-widest mb-2">ថ្លៃដឹកជញ្ជូន (DELIVERY FEE)</label>
                        <div class="flex bg-slate-50 border border-sky-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-sky-500/20 focus-within:bg-white transition-all shadow-sm">
                            <input v-model.number="form.deliveryFee" type="number" step="any" min="0" placeholder="0.00" class="w-full bg-transparent px-4 py-3 text-sm font-black text-sky-700 outline-none">
                            <select v-model="form.deliveryCurrency" class="bg-sky-50 border-l border-sky-200 px-3 font-black text-sky-700 outline-none cursor-pointer">
                                <option value="USD">$ (USD)</option>
                                <option value="KHR">៛ (KHR)</option>
                            </select>
                        </div>
                    </div>

                    <div v-if="form.paymentMethod === 'KHQR'" class="pt-2">
                      <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">រូបភាពវិក្កយបត្រវេរប្រាក់ (ជម្រើស)</label>
                      <div class="flex items-center gap-4">
                        <div class="relative shrink-0">
                          <input type="file" accept="image/*" @change="handleImageUpload" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10">
                          <div class="w-20 h-20 bg-slate-50 border-2 border-dashed border-slate-300 hover:border-indigo-400 rounded-xl flex flex-col items-center justify-center text-slate-400 transition-colors">
                            <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                            <span class="text-[9px] font-bold">Upload</span>
                          </div>
                        </div>
                        <div v-if="form.paymentImage" class="relative w-20 h-20 rounded-xl border border-slate-200 shadow-sm overflow-hidden group">
                          <img :src="form.paymentImage" class="w-full h-full object-cover">
                          <button @click.stop="form.paymentImage = ''" class="absolute top-1 right-1 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                          </button>
                        </div>
                        <div v-if="isCompressing" class="text-[11px] font-bold text-indigo-500 flex items-center gap-2">
                            <svg class="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> កំពុងបង្រួមរូបភាព...
                        </div>
                      </div>
                    </div>

                    <div class="pt-2">
                      <div class="flex items-center justify-between mb-2">
                          <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest">ចំណាំបញ្ជាក់ការទូទាត់ (Payment Note)</label>
                          <button 
                              v-if="form.province === 'រាជធានីភ្នំពេញ'" 
                              type="button" 
                              @click="addDeliveryGuyNote"
                              class="text-[10px] font-bold bg-amber-50 text-amber-600 px-2.5 py-1 rounded border border-amber-200 hover:bg-amber-100 transition-colors"
                          >
                              + ទូទាត់តាមអ្នកដឹកជញ្ជូន
                          </button>
                      </div>
                      <input v-model="form.paymentNote" type="text" list="payment-notes" placeholder="ឧ. បានទូទាត់រួច, នៅខ្វះ..." class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-bold text-sm focus:bg-white focus:border-blue-400 outline-none transition-all shadow-inner">
                      <datalist id="payment-notes">
                        <option value="បានទូទាត់រួច"></option><option value="មិនទាន់ទូទាត់"></option><option value="កក់ប្រាក់ខ្លះ"></option><option value="បង់ពេលឥវ៉ាន់ដល់"></option>
                      </datalist>
                    </div>
                </div>

                <div v-if="activeTab === 'direct'" class="space-y-6 animate-fade-in pt-4 border-t border-slate-100">
                    
                    <div class="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-start gap-3">
                        <svg class="w-6 h-6 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <div>
                            <p class="text-sm font-black text-emerald-800 mb-1">អតិថិជនមកទិញផ្ទាល់ (Walk-in Customer)</p>
                            <p class="text-[11px] text-emerald-600 font-bold leading-relaxed">មិនចាំបាច់បញ្ចូលឈ្មោះ លេខទូរស័ព្ទ ឬទីតាំងទេ។ វានឹងកត់ត្រាចូលជា "អតិថិជនទូទៅ" និងទីតាំង "ទិញផ្ទាល់" ដោយស្វ័យប្រវត្តិ។</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">កាលបរិច្ឆេទ</label>
                        <input v-model="form.date" type="datetime-local" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-bold text-sm focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400 outline-none cursor-pointer transition-all">
                      </div>
                      <div class="grid grid-cols-2 gap-3">
                          <div>
                            <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">ការបង់ប្រាក់</label>
                            <div class="relative">
                              <select v-model="form.paymentMethod" class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-8 py-3 text-slate-800 font-bold text-sm focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400 outline-none appearance-none cursor-pointer transition-all">
                                <option value="CASH">សាច់ប្រាក់ (CASH)</option>
                                <option value="KHQR">វេរប្រាក់ (KHQR)</option>
                                <option value="BANK">ធនាគារ (BANK)</option>
                              </select>
                              <svg class="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                            </div>
                          </div>
                          <div>
                              <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">ស្ថានភាព</label>
                              <div class="relative">
                                  <select v-model="form.paymentStatus" class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-8 py-3 text-slate-800 font-bold text-sm focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400 outline-none appearance-none cursor-pointer transition-all">
                                      <option value="PAID">ទូទាត់រួច (PAID)</option>
                                      <option value="PENDING">ជំពាក់ (PENDING)</option>
                                  </select>
                                  <svg class="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                              </div>
                          </div>
                      </div>
                    </div>

                    <div v-if="form.paymentMethod === 'KHQR'">
                      <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">រូបភាពវិក្កយបត្រវេរប្រាក់ (ជម្រើស)</label>
                      <div class="flex items-center gap-4">
                        <div class="relative shrink-0">
                          <input type="file" accept="image/*" @change="handleImageUpload" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10">
                          <div class="w-20 h-20 bg-slate-50 border-2 border-dashed border-slate-300 hover:border-emerald-400 rounded-xl flex flex-col items-center justify-center text-slate-400 transition-colors">
                            <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                            <span class="text-[9px] font-bold">Upload</span>
                          </div>
                        </div>
                        <div v-if="form.paymentImage" class="relative w-20 h-20 rounded-xl border border-slate-200 shadow-sm overflow-hidden group">
                          <img :src="form.paymentImage" class="w-full h-full object-cover">
                          <button @click.stop="form.paymentImage = ''" class="absolute top-1 right-1 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                          </button>
                        </div>
                        <div v-if="isCompressing" class="text-[11px] font-bold text-emerald-500 flex items-center gap-2">
                            <svg class="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> កំពុងបង្រួមរូបភាព...
                        </div>
                      </div>
                    </div>

                    <div>
                      <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">ចំណាំបញ្ជាក់ការទូទាត់ (Payment Note)</label>
                      <input v-model="form.paymentNote" type="text" list="payment-notes" placeholder="ឧ. បានទូទាត់រួច, នៅខ្វះ..." class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-bold text-sm focus:bg-white focus:border-emerald-400 outline-none transition-all shadow-inner">
                      <datalist id="payment-notes">
                        <option value="បានទូទាត់រួច"></option><option value="មិនទាន់ទូទាត់"></option><option value="កក់ប្រាក់ខ្លះ"></option>
                      </datalist>
                    </div>
                </div>
                <div class="bg-slate-800 text-white rounded-[1.25rem] p-5 mt-4 shadow-lg border border-slate-700 relative overflow-hidden">
                  <div class="flex justify-between items-center mb-2">
                    <span class="text-sm font-bold text-slate-300">ទំនិញសរុប:</span>
                    <span class="text-sm font-black bg-white/10 px-2 py-1 rounded-lg">{{ cartLength }} មុខ</span>
                  </div>
                  <div class="flex justify-between items-end border-t border-white/10 pt-3 mt-2">
                    <span class="text-xs font-black uppercase tracking-widest text-slate-400">ទឹកប្រាក់សរុប (Total)</span>
                    <span class="text-3xl font-black text-emerald-400">{{ formatPrice(checkoutFinalTotalUSD, 'USD') }}</span>
                  </div>
                </div>

              </div>

              <div class="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 shrink-0 rounded-b-[24px]">
                <button type="button" @click="$emit('close')" class="px-6 py-3 rounded-xl font-bold text-slate-600 bg-white border border-slate-300 hover:bg-slate-100 transition-colors text-sm">បោះបង់</button>
                <button type="button" @click="onSubmit" :disabled="isSubmitting" class="px-8 py-3 rounded-xl font-black text-white bg-gradient-to-r shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2 text-sm" :class="activeTab === 'delivery' ? 'from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/30' : 'from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-emerald-500/30'">
                  <svg v-if="isSubmitting" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                  បញ្ជាក់ការទូទាត់
                </button>
              </div>

            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue';

const props = defineProps({
    show: Boolean,
    cartLength: Number,
    cartTotalUSD: Number,
    sellers: Array,
    savedCustomers: { type: Array, default: () => [] },
    isSubmitting: Boolean
});

const emit = defineEmits(['close', 'confirm']);

// Tabs State
const activeTab = ref('delivery'); // 'delivery' or 'direct'

// Initial Form State
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

// Watch 'show' to Auto set DateTime when opened
watch(() => props.show, (newVal) => {
    if (newVal) {
        form.date = getLocalISOString();
        // Reset tab logic slightly if needed, but keeping user's last tab preference is nice
    }
});

// Method to expose form reset to parent
const resetForm = () => {
    form.sellerId = ''; form.sellerName = '';
    form.customerName = ''; form.customerPhone = '';
    form.province = ''; form.district = '';
    form.paymentMethod = 'CASH'; form.paymentStatus = 'PAID'; form.paymentNote = '';
    form.paymentImage = '';
    form.deliveryFee = 0; form.deliveryCurrency = 'USD';
    form.date = getLocalISOString();
    provinceSearch.value = '';
    sellerSearchQuery.value = '';
    activeTab.value = 'delivery'; // Reset to default
};
defineExpose({ resetForm });

// Calculate Final Total including Delivery Fee (Delivery fee only applies to Delivery Tab)
const checkoutFinalTotalUSD = computed(() => {
    let deliveryUSD = 0;
    if (activeTab.value === 'delivery' && form.deliveryFee > 0) {
        deliveryUSD = form.deliveryCurrency === 'USD' ? form.deliveryFee : (form.deliveryFee / 4000);
    }
    return props.cartTotalUSD + deliveryUSD;
});

// Location Data
const locationData = {
    "រាជធានីភ្នំពេញ": ["ខណ្ឌចំការមន", "ខណ្ឌដូនពេញ", "ខណ្ឌ៧មករា", "ខណ្ឌទួលគោក", "ខណ្ឌដង្កោ", "ខណ្ឌមានជ័យ", "ខណ្ឌឫស្សីកែវ", "ខណ្ឌសែនសុខ", "ខណ្ឌពោធិ៍សែនជ័យ", "ខណ្ឌជ្រោយចង្វារ", "ខណ្ឌព្រែកព្នៅ", "ខណ្ឌច្បារអំពៅ", "ខណ្ឌបឹងកេងកង", "ខណ្ឌកំបូល"],
            "ខេត្តកណ្តាល": ["ក្រុងតាខ្មៅ", "ស្រុកកណ្តាលស្ទឹង", "ស្រុកគីវីស៊ុង", "ស្រុកខ្សាច់កណ្តាល", "ស្រុកកោះធំ", "ស្រុកលើកដែក", "ស្រុកល្វាឯម", "ស្រុកមុខកំពូល", "ស្រុកអង្គស្នួល", "ស្រុកពញាឮ", "ស្រុកស្អាង"],
            "ខេត្តសៀមរាប": ["ក្រុងសៀមរាប", "ស្រុកអង្គរធំ", "ស្រុកអង្គរជុំ", "ស្រុកបន្ទាយស្រី", "ស្រុកជីក្រែង", "ស្រុកក្រឡាញ់", "ស្រុកពួក", "ស្រុកប្រាសាទបាគង", "ស្រុកស្រីស្នំ", "ស្រុកស្វាយលើ", "ស្រុកវ៉ារិន", "ស្រុកសូទ្រនិគម"],
            "ខេត្តបាត់ដំបង": ["ក្រុងបាត់ដំបង", "ស្រុកបាណន់", "ស្រុកថ្មគោល", "ស្រុកបវេល", "ស្រុកឯកភ្នំ", "ស្រុកមោងឫស្សី", "ស្រុករតនមណ្ឌល", "ស្រុកសង្កែ", "ស្រុកសំឡូត", "ស្រុកសំពៅលូន", "ស្រុកភ្នំព្រឹក", "ស្រុកកំរៀង", "ស្រុកគាស់ក្រឡ", "ស្រុករុក្ខគិរី"],
            "ខេត្តព្រះសីហនុ": ["ក្រុងព្រះសីហនុ", "ស្រុកព្រៃនប់", "ស្រុកស្ទឹងហាវ", "ស្រុកកំពង់សិលា", "ក្រុងកោះរ៉ុង"],
            "ខេត្តកំពង់ចាម": ["ក្រុងកំពង់ចាម", "ស្រុកចំការលើ", "ស្រុកជើងព្រៃ", "ស្រុកកំពង់សៀម", "ស្រុកកងមាស", "ស្រុកកោះសូទិន", "ស្រុកព្រៃឈរ", "ស្រុកស្រីសន្ធរ", "ស្រុកស្ទឹងត្រង់", "ស្រុកបាធាយ"],
            "ខេត្តត្បូងឃ្មុំ": ["ក្រុងសួង", "ស្រុកត្បូងឃ្មុំ", "ស្រុកអូររាំងឪ", "ស្រុកក្រូចឆ្មារ", "ស្រុកតំបែរ", "ស្រុកពញាក្រែក", "ស្រុកមេមត់"],
            "ខេត្តកំពង់ឆ្នាំង": ["ក្រុងកំពង់ឆ្នាំង", "ស្រុកបរិបូរណ៍", "ស្រុកជលគីរី", "ស្រុកកំពង់លែង", "ស្រុកកំពង់ត្រឡាច", "ស្រុកតួនឡីសាប", "ស្រុកសាមគ្គីមានជ័យ", "ស្រុកទឹកផុស"],
            "ខេត្តកំពង់ស្ពឺ": ["ក្រុងច្បារមន", "ស្រុកបរសេដ្ឋ", "ស្រុកគងពិសី", "ស្រុកភ្នំស្រួច", "ស្រុកឧដុង្គ", "ស្រុកសាមគ្គីមុនីជ័យ", "ស្រុកភ្នំស្រួច", "ស្រុកថ្ពង", "ស្រុកឱរ៉ាល់"],
            "ខេត្តកំពង់ធំ": ["ក្រុងស្ទឹងសែន", "ស្រុកបារាយណ៍", "ស្រុកកំពង់ស្វាយ", "ស្រុកប្រាសាទបល្ល័ង្ក", "ស្រុកប្រាសាទសំបូរ", "ស្រុកសណ្តាន់", "ស្រុកសន្ទុក", "ស្រុកស្ទោង", "ស្រុកតាំងគោក"],
            "ខេត្តកំពត": ["ក្រុងកំពត", "ស្រុកអង្គរជ័យ", "ស្រុកបន្ទាយមាស", "ស្រុកឈូក", "ស្រុកជុំគីរី", "ស្រុកដងទង់", "ស្រុកកំពង់ត្រាច", "ស្រុកទឹកឈូ"],
            "ខេត្តកែប": ["ក្រុងកែប", "ស្រុកដំណាក់ចង្អើរ"],
            "ខេត្តកោះកុង": ["ក្រុងខេមរភូមិន្ទ", "ស្រុកបូទុមសាគរ", "ស្រុកគិរីសាគរ", "ស្រុកកោះកុង", "ស្រុកមណ្ឌលសីមា", "ស្រុកស្រែអំបិល", "ស្រុកថ្មបាំង"],
            "ខេត្តក្រចេះ": ["ក្រុងក្រចេះ", "ស្រុកឆ្លូង", "ស្រុកព្រែកប្រសប់", "ស្រុកសំបូរ", "ស្រុកស្នួល", "ស្រុកចិត្តបុរី"],
            "ខេត្តមណ្ឌលគីរី": ["ក្រុងសែនមនោរម្យ", "ស្រុកកែវសីមា", "ស្រុកកោះញែក", "ស្រុកអូររាំង", "ស្រុកពេជ្រាដា"],
            "ខេត្តរតនគីរី": ["ក្រុងបានលុង", "ស្រុកអណ្តូងមាស", "ស្រុកបរកែវ", "ស្រុកកូនមុំ", "ស្រុកលំផាត់", "ស្រុកអូរជុំ", "ស្រុកអូរយ៉ាដាវ", "ស្រុកតាវែង", "ស្រុកវើនសៃ"],
            "ខេត្តស្ទឹងត្រែង": ["ក្រុងស្ទឹងត្រែង", "ស្រុកសេសាន", "ស្រុកសៀមបូក", "ស្រុកសៀមប៉ាង", "ស្រុកថាឡាបរិវ៉ាត់", "ស្រុកបុរីអូរស្វាយសែនជ័យ"],
            "ខេត្តព្រះវិហារ": ["ក្រុងព្រះវិហារ", "ស្រុកជ័យសែន", "ស្រុកឆែប", "ស្រុកជាំក្សាន្ត", "ស្រុកគូលែន", "ស្រុកភ្នំត្បែងមានជ័យ", "ស្រុកសង្គមថ្មី", "ស្រុកត្បែងមានជ័យ"],
            "ខេត្តឧត្តរមានជ័យ": ["ក្រុងសំរោង", "ស្រុកអន្លង់វែង", "ស្រុកបន្ទាយអំពិល", "ស្រុកចុងកាល់", "ស្រុកត្រពាំងប្រាសាទ"],
            "ខេត្តបន្ទាយមានជ័យ": ["ក្រុងសិរីសោភ័ណ", "ក្រុងប៉ោយប៉ែត", "ស្រុកមង្គលបុរី", "ស្រុកភ្នំស្រុក", "ស្រុកព្រះនេត្រព្រះ", "ស្រុកអូរជ្រៅ", "ស្រុកថ្មពួក", "ស្រុកស្វាយចេក", "ស្រុកម៉ាឡៃ"],
            "ខេត្តប៉ៃលិន": ["ក្រុងប៉ៃលិន", "ស្រុកសាលាក្រៅ"],
            "ខេត្តពោធិ៍សាត់": ["ក្រុងពោធិ៍សាត់", "ស្រុកបាកាន", "ស្រុកកណ្តៀង", "ស្រុកភ្នំក្រវ៉ាញ", "ស្រុកវាលវែង", "ស្រុកតាលោសែនជ័យ"],
            "ខេត្តព្រៃវែង": ["ក្រុងព្រៃវែង", "ស្រុកបាភ្នំ", "ស្រុកកំចាយមារ", "ស្រុកកញ្ជ្រៀច", "ស្រុកកោះស្រែទៀប", "ស្រុកពាមជរ", "ស្រុកពាមរ", "ស្រុកពារាំង", "ស្រុកព្រះស្តេច", "ស្រុកស្វាយអន្ទរ", "ស្រុកស៊ីធរកណ្តាល", "ស្រុកមេសាង"],
            "ខេត្តស្វាយរៀង": ["ក្រុងស្វាយរៀង", "ក្រុងបាវិត", "ស្រុកចន្ទ្រា", "ស្រុកកំពង់រោទ៍", "ស្រុក រំដួល", "ស្រុក រមាសហែក", "ស្រុក ស្វាយជ្រំ", "ស្រុក ស្វាយទាប"],
            "ខេត្តតាកែវ": ["ក្រុងដូនកែវ", "ស្រុកអង្គរបុរី", "ស្រុកបាទី", "ស្រុកបូរីជលសារ", "ស្រុកគិរីវង់", "ស្រុកកោះអណ្តែត", "ស្រុកព្រៃកប្បាស", "ស្រុកសំរោង", "ស្រុកត្រាំកក់", "ស្រុកទ្រាំង"]
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
    else { form.province = ''; form.district = ''; }
};
const selectProvince = (prov) => { form.province = prov; provinceSearch.value = prov; form.district = ''; showProvinceDropdown.value = false; setTimeout(() => showDistrictDropdown.value = true, 100); };
const selectDistrict = (dist) => { form.district = dist; showDistrictDropdown.value = false; };

// --- Seller Logic ---
const sellerSearchQuery = ref('');
const showSellerDropdown = ref(false);
const filteredSellers = computed(() => {
    if (!sellerSearchQuery.value) return props.sellers;
    const q = sellerSearchQuery.value.toLowerCase();
    return props.sellers.filter(s => s.fullName.toLowerCase().includes(q) || (s.idNumber && s.idNumber.toLowerCase().includes(q)));
});
const selectSeller = (seller) => { form.sellerId = seller.id; form.sellerName = seller.fullName; sellerSearchQuery.value = seller.fullName; showSellerDropdown.value = false; };
const clearSeller = () => { form.sellerId = ''; form.sellerName = ''; sellerSearchQuery.value = ''; };

// --- Smart Customer Logic ---
const showCustomerDropdown = ref(false);

const filteredCustomers = computed(() => {
    if (!form.customerName) return props.savedCustomers;
    return props.savedCustomers.filter(c => c.name.toLowerCase().includes(form.customerName.toLowerCase()));
});

const handleCustomerInput = () => {
    showCustomerDropdown.value = true;
    if (!form.customerName.trim()) {
        form.customerPhone = '';
        form.province = '';
        form.district = '';
        provinceSearch.value = '';
    }
};

const selectCustomer = (cust) => {
    form.customerName = cust.name;
    form.customerPhone = cust.phone;
    form.province = cust.province;
    provinceSearch.value = cust.province; 
    form.district = cust.district;
    showCustomerDropdown.value = false;
};

// --- Note Shortcut Logic ---
const addDeliveryGuyNote = () => {
    const note = form.paymentNote;
    if (!note.includes('ទូទាត់តាមអ្នកដឹកជញ្ជូន')) {
        form.paymentNote = note ? note + '\n- ទូទាត់តាមអ្នកដឹកជញ្ជូន' : 'ទូទាត់តាមអ្នកដឹកជញ្ជូន';
    }
};

const closeDropdowns = () => { 
    showSellerDropdown.value = false; 
    showProvinceDropdown.value = false; 
    showDistrictDropdown.value = false; 
    showCustomerDropdown.value = false;
};

// --- Image Compression ---
const isCompressing = ref(false);
const compressImage = (file, targetSizeKB) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader(); reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image(); img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width, height = img.height;
                if (width > height) { if (width > 1200) { height *= 1200 / width; width = 1200; } } else { if (height > 1200) { width *= 1200 / height; height = 1200; } }
                canvas.width = width; canvas.height = height;
                canvas.getContext('2d').drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', 0.5));
            };
        };
    });
};
const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !file.type.startsWith('image/')) return;
    isCompressing.value = true;
    try { form.paymentImage = await compressImage(file, 100); } 
    catch (error) { console.error(error); } 
    finally { isCompressing.value = false; event.target.value = ''; }
};

const onSubmit = () => { 
    // Format data based on active tab before submitting
    const payload = { ...form, finalTotalUSD: checkoutFinalTotalUSD.value };
    
    if (activeTab.value === 'direct') {
        payload.customerName = 'អតិថិជនទូទៅ';
        payload.customerPhone = '';
        payload.province = '';
        payload.district = '';
        payload.deliveryFee = 0;
        payload.isDirectCustomer = true; // special flag for parent to know
    } else {
        payload.isDirectCustomer = false;
    }

    emit('confirm', payload); 
};

const formatPrice = (val, currency = 'USD') => Number(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 3 }) + (currency === 'USD' ? ' $' : ' ៛');
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #94a3b8; }
input[type="number"]::-webkit-inner-spin-button, input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
input[type="number"] { -moz-appearance: textfield; }
select { -webkit-appearance: none; -moz-appearance: none; }
.animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
</style>