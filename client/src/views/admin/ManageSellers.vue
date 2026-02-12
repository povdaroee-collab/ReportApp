<template>
  <div class="font-khmer h-full flex flex-col relative">
    
    <Teleport to="body">
      <div class="fixed top-4 right-4 z-[9999] w-full max-w-sm pointer-events-none">
        <div class="pointer-events-auto">
          <CustomAlert 
            :show="alert.show" 
            :title="alert.title" 
            :message="alert.message" 
            :type="alert.type" 
            @close="alert.show = false"
          />
        </div>
      </div>
    </Teleport>

    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">តំណាងលក់ (Sellers)</h1>
        <p class="text-slate-500 text-sm mt-1">គ្រប់គ្រងបញ្ជីអ្នកលក់ និងព័ត៌មានលម្អិត</p>
      </div>

      <div class="flex gap-3 w-full md:w-auto">
        <div class="relative flex-1 md:w-72">
           <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 pointer-events-none">
             <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
           </span>
           <input 
             v-model="searchQuery" 
             type="text" 
             class="w-full pl-11 pr-4 py-3 bg-white border-none ring-1 ring-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 shadow-sm transition-all"
             placeholder="ស្វែងរកឈ្មោះ..."
           />
        </div>

        <button @click="openCreateModal" class="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white px-6 py-3 rounded-2xl shadow-lg shadow-teal-500/30 flex items-center gap-2 transition-all active:scale-95 font-bold tracking-wide">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          <span class="hidden sm:inline">បន្ថែមថ្មី</span>
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
       <div v-for="n in 4" :key="n" class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 animate-pulse h-64"></div>
    </div>

    <div v-else-if="filteredSellers.length === 0" class="flex-1 flex flex-col items-center justify-center text-center p-12 bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-slate-300">
       <div class="w-24 h-24 bg-teal-50 rounded-full flex items-center justify-center mb-4 shadow-inner">
          <svg class="w-10 h-10 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
       </div>
       <h3 class="text-lg font-bold text-slate-700">មិនមានទិន្នន័យ</h3>
       <p class="text-slate-500 text-sm mt-1">
         {{ isOwner ? 'មិនមានតំណាងលក់នៅក្នុងប្រព័ន្ធ' : 'អ្នកមិនទាន់បានបង្កើតតំណាងលក់នៅឡើយទេ' }}
       </p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
       <div 
         v-for="seller in filteredSellers" 
         :key="seller.id" 
         @dblclick="openDetailModal(seller)"
         class="group bg-white rounded-3xl p-6 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden border border-slate-100 cursor-pointer"
       >
          
          <div class="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-teal-400 to-emerald-500"></div>
          
          <div class="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
             <button @click.stop="confirmDelete(seller)" class="bg-white text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full shadow-sm border border-slate-100 transition-colors" title="Delete">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
             </button>
          </div>

          <div class="flex flex-col items-center text-center mt-4">
             <div class="relative group-hover:scale-105 transition-transform duration-300">
               <div class="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-teal-400 to-emerald-500 shadow-md">
                  <img :src="seller.photoUrl || 'https://ui-avatars.com/api/?background=random&name='+seller.fullName" class="w-full h-full object-cover rounded-full border-2 border-white bg-white" alt="Profile">
               </div>
               <span class="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center">
                  <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
               </span>
             </div>

             <h3 class="font-bold text-lg text-slate-800 mt-4">{{ seller.fullName }}</h3>
             <p class="text-sm text-slate-500 line-clamp-1">{{ seller.address }}</p>

             <div class="flex flex-wrap justify-center gap-2 mt-4 w-full">
                <div v-if="seller.phoneNumber" class="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                   <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                   {{ seller.phoneNumber }}
                </div>
                <div class="flex items-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                   <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.48-.94-2.4-1.54-1.06-.7-.37-1.09.23-1.72.16-.16 2.87-2.63 2.92-2.85.01-.03.01-.14-.06-.2-.06-.06-.17-.04-.25-.02-.11.02-1.91 1.2-5.39 3.55-.5.34-.95.51-1.35.5-.44-.01-1.29-.25-1.92-.42-.77-.21-1.37-.32-1.31-.68.03-.18.28-.37.76-.56 3.03-1.32 5.06-2.19 6.09-2.62 2.93-1.21 3.53-1.43 3.93-1.43.09 0 .28.01.4.04.1.03.24.1.33.25.08.16.07.32.07.33z"/></svg>
                   {{ seller.telegram || 'N/A' }}
                </div>
             </div>
             
             <div class="w-full border-t border-slate-100 mt-5 pt-4 flex justify-between items-center">
                <button @click.stop="openDetailModal(seller)" class="text-xs font-bold text-slate-500 hover:text-teal-600 flex items-center gap-1 transition-colors">
                   <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                   មើលលម្អិត
                </button>
                <button @click.stop="openEditModal(seller)" class="text-xs font-bold text-blue-500 hover:text-blue-700 flex items-center gap-1 transition-colors">
                   <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                   កែប្រែ
                </button>
             </div>
          </div>
       </div>
    </div>

    <TransitionRoot appear :show="showModal" as="template">
      <Dialog as="div" @close="closeModal" class="relative z-50">
        <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-md" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95 translate-y-8" enter-to="opacity-100 scale-100 translate-y-0" leave="duration-200 ease-in" leave-from="opacity-100 scale-100 translate-y-0" leave-to="opacity-0 scale-95 translate-y-8">
              <DialogPanel class="w-full max-w-3xl transform overflow-hidden rounded-[2rem] bg-white shadow-2xl transition-all relative">
                
                <div class="bg-gradient-to-r from-teal-600 to-emerald-600 px-8 py-6 flex justify-between items-center relative overflow-hidden">
                  <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl transform translate-x-10 -translate-y-10"></div>
                  <div>
                    <h3 class="text-xl font-bold text-white">{{ isEditing ? 'កែប្រែព័ត៌មាន' : 'ចុះឈ្មោះតំណាងលក់ថ្មី' }}</h3>
                    <p class="text-teal-100 text-sm mt-1">បំពេញព័ត៌មាន និងឯកសារដែលត្រូវការ</p>
                  </div>
                  <button @click="closeModal" class="bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition z-10">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>

                <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div class="space-y-6">
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-2">ឈ្មោះពេញ (Full Name)</label>
                        <input ref="nameInput" v-model="form.fullName" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:bg-white focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 outline-none transition-all placeholder-slate-400" placeholder="បញ្ចូលឈ្មោះ...">
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-2">អាសយដ្ឋាន (Address)</label>
                        <input v-model="form.address" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:bg-white focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 outline-none transition-all placeholder-slate-400" placeholder="បញ្ចូលអាសយដ្ឋាន...">
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-bold text-slate-700 mb-2">Telegram</label>
                            <div class="relative">
                                <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">@</span>
                                <input v-model="form.telegram" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 py-3 text-slate-700 focus:bg-white focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 outline-none transition-all placeholder-slate-400" placeholder="username">
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-bold text-slate-700 mb-2">លេខទូរស័ព្ទ (Phone)</label>
                            <input v-model="form.phoneNumber" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:bg-white focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 outline-none transition-all placeholder-slate-400" placeholder="012 345 678">
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-2">លេខអត្តសញ្ញាណប័ណ្ណ (ID Number)</label>
                        <input v-model="form.idNumber" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:bg-white focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 outline-none transition-all placeholder-slate-400 font-mono tracking-wide" placeholder="XXXXXXXXX">
                    </div>
                  </div>

                  <div class="space-y-6">
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-2">រូបភាពផ្ទាល់ខ្លួន (Profile)</label>
                        <div @click="$refs.profileInput.click()" class="border-2 border-dashed border-slate-300 hover:border-teal-500 hover:bg-teal-50/50 rounded-2xl h-36 flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative group">
                           <input ref="profileInput" type="file" accept="image/*" class="hidden" @change="e => handleFile(e, 'profile')">
                           <img v-if="previews.profile" :src="previews.profile" class="w-full h-full object-cover">
                           <div v-else class="text-center p-4 group-hover:scale-105 transition-transform">
                              <div class="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-2 text-slate-400 group-hover:bg-teal-100 group-hover:text-teal-600 transition-colors">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                              </div>
                              <p class="text-xs text-slate-500 font-medium">ចុចដើម្បីដាក់រូបភាព</p>
                           </div>
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-2">អត្តសញ្ញាណប័ណ្ណ (ID Card Image)</label>
                        <div @click="$refs.idInput.click()" class="border-2 border-dashed border-slate-300 hover:border-teal-500 hover:bg-teal-50/50 rounded-2xl h-36 flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative group">
                           <input ref="idInput" type="file" accept="image/*" class="hidden" @change="e => handleFile(e, 'id')">
                           <img v-if="previews.id" :src="previews.id" class="w-full h-full object-cover">
                           <div v-else class="text-center p-4 group-hover:scale-105 transition-transform">
                              <div class="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-2 text-slate-400 group-hover:bg-teal-100 group-hover:text-teal-600 transition-colors">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0c0 .884-.5 2-2 2h4c-1.5 0-2-1.116-2-2z"></path></svg>
                              </div>
                              <p class="text-xs text-slate-500 font-medium">រូបភាពអត្តសញ្ញាណប័ណ្ណ</p>
                           </div>
                        </div>
                    </div>
                  </div>
                </div>

                <div class="bg-slate-50 px-8 py-5 flex justify-end gap-3 border-t border-slate-100">
                  <button @click="closeModal" class="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-white hover:border-slate-300 transition-all">បោះបង់</button>
                  <button @click="submitSeller" :disabled="isSubmitting" class="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-teal-500/30 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-95">
                     <svg v-if="isSubmitting" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                     <span>{{ isSubmitting ? 'រក្សាទុក' : (isEditing ? 'កែប្រែ' : 'បង្កើតគណនី') }}</span>
                  </button>
                </div>

              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <TransitionRoot appear :show="showDetailModal" as="template">
      <Dialog as="div" @close="closeDetailModal" class="relative z-50">
        <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-md" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95 translate-y-8" enter-to="opacity-100 scale-100 translate-y-0" leave="duration-200 ease-in" leave-from="opacity-100 scale-100 translate-y-0" leave-to="opacity-0 scale-95 translate-y-8">
              <DialogPanel class="w-full max-w-4xl transform overflow-hidden rounded-[2rem] bg-white shadow-2xl transition-all relative">
                
                <div class="bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-6 relative overflow-hidden">
                   <div class="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
                   <div class="flex justify-between items-start relative z-10">
                      <div class="flex items-center gap-5">
                         <div class="w-20 h-20 rounded-full p-1 bg-white/20 shadow-lg">
                            <img :src="selectedSeller?.photoUrl || `https://ui-avatars.com/api/?name=${selectedSeller?.fullName}&background=random`" class="w-full h-full object-cover rounded-full border-2 border-white bg-white">
                         </div>
                         <div>
                            <h3 class="text-2xl font-bold text-white">{{ selectedSeller?.fullName }}</h3>
                            <p class="text-indigo-100 text-sm mt-1">@{{ selectedSeller?.username }}</p>
                            <span class="inline-block mt-2 px-3 py-1 bg-white/20 text-white text-[10px] font-bold rounded-full border border-white/30 backdrop-blur-sm">
                               SELLER ACCOUNT
                            </span>
                         </div>
                      </div>
                      <button @click="closeDetailModal" class="bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition">
                         <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                      </button>
                   </div>
                </div>

                <div class="p-8">
                   <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div class="space-y-6">
                         <h4 class="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">ព័ត៌មានផ្ទាល់ខ្លួន</h4>
                         
                         <div class="grid grid-cols-1 gap-4">
                            <div class="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                               <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                               </div>
                               <div>
                                  <p class="text-xs text-slate-500">លេខទូរស័ព្ទ</p>
                                  <p class="font-bold text-slate-700">{{ selectedSeller?.phoneNumber || 'N/A' }}</p>
                               </div>
                            </div>

                            <div class="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                               <div class="w-10 h-10 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center">
                                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.48-.94-2.4-1.54-1.06-.7-.37-1.09.23-1.72.16-.16 2.87-2.63 2.92-2.85.01-.03.01-.14-.06-.2-.06-.06-.17-.04-.25-.02-.11.02-1.91 1.2-5.39 3.55-.5.34-.95.51-1.35.5-.44-.01-1.29-.25-1.92-.42-.77-.21-1.37-.32-1.31-.68.03-.18.28-.37.76-.56 3.03-1.32 5.06-2.19 6.09-2.62 2.93-1.21 3.53-1.43 3.93-1.43.09 0 .28.01.4.04.1.03.24.1.33.25.08.16.07.32.07.33z"/></svg>
                               </div>
                               <div>
                                  <p class="text-xs text-slate-500">Telegram</p>
                                  <a :href="'https://t.me/'+selectedSeller?.telegram" target="_blank" class="font-bold text-sky-600 hover:underline">{{ selectedSeller?.telegram || 'N/A' }}</a>
                               </div>
                            </div>

                            <div class="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                               <div class="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                               </div>
                               <div>
                                  <p class="text-xs text-slate-500">អាសយដ្ឋាន</p>
                                  <p class="font-bold text-slate-700 text-sm">{{ selectedSeller?.address || 'N/A' }}</p>
                               </div>
                            </div>

                            <div class="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                               <div class="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0c0 .884-.5 2-2 2h4c-1.5 0-2-1.116-2-2z"/></svg>
                               </div>
                               <div>
                                  <p class="text-xs text-slate-500">លេខអត្តសញ្ញាណប័ណ្ណ</p>
                                  <p class="font-bold text-slate-700 font-mono">{{ selectedSeller?.idNumber || 'N/A' }}</p>
                               </div>
                            </div>
                         </div>
                      </div>

                      <div class="space-y-6">
                         <h4 class="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">ឯកសារភ្ជាប់</h4>
                         
                         <div class="bg-slate-100 rounded-xl overflow-hidden border border-slate-200 aspect-video flex items-center justify-center relative group">
                            <img v-if="selectedSeller?.idCardUrl" :src="selectedSeller.idCardUrl" class="w-full h-full object-cover">
                            <div v-else class="text-slate-400 flex flex-col items-center">
                               <svg class="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                               <span>មិនមានរូបភាព</span>
                            </div>
                            
                            <div v-if="selectedSeller?.idCardUrl" class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                               <a :href="selectedSeller.idCardUrl" target="_blank" class="px-4 py-2 bg-white rounded-full text-sm font-bold shadow-lg hover:scale-105 transition-transform">
                                  មើលរូបភាពពេញ
                               </a>
                            </div>
                         </div>

                         <div class="pt-4 flex gap-3">
                            <button @click="openEditModal(selectedSeller); closeDetailModal()" class="flex-1 py-3 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-100 transition">
                               កែប្រែព័ត៌មាន
                            </button>
                            <button @click="confirmDelete(selectedSeller); closeDetailModal()" class="flex-1 py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition">
                               លុបគណនី
                            </button>
                         </div>
                      </div>
                   </div>
                </div>

              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <TransitionRoot appear :show="confirmModal.show" as="template">
      <Dialog as="div" @close="confirmModal.show = false" class="relative z-50">
        <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" />
        </TransitionChild>
        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
             <DialogPanel class="w-full max-w-sm transform overflow-hidden rounded-3xl bg-white p-6 shadow-2xl transition-all text-center">
                <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-4 text-red-600">
                   <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-2">លុបគណនី?</h3>
                <p class="text-sm text-gray-500 mb-6">តើអ្នកពិតជាចង់លុបគណនីនេះមែនទេ? សកម្មភាពនេះមិនអាចត្រឡប់ក្រោយបានទេ។</p>
                <div class="grid grid-cols-2 gap-3">
                   <button @click="confirmModal.show = false" class="py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50">បោះបង់</button>
                   <button @click="executeDelete" class="py-2.5 rounded-xl text-white font-bold shadow-lg bg-red-600 hover:bg-red-700">យល់ព្រម</button>
                </div>
             </DialogPanel>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, nextTick } from 'vue';
import { TransitionRoot, TransitionChild, Dialog, DialogPanel } from '@headlessui/vue';
import { db, auth } from '@/firebaseConfig';
import { collection, query, where, onSnapshot, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth'; 
import axios from 'axios';
import CustomAlert from '../../components/shared/CustomAlert.vue';

const sellers = ref([]);
const isLoading = ref(true);
const showModal = ref(false);
const showDetailModal = ref(false); // New State
const selectedSeller = ref(null); // Data for Detail Modal
const isSubmitting = ref(false);
const searchQuery = ref('');
const isOwner = ref(false);
const isEditing = ref(false);
const currentSellerId = ref(null);
const nameInput = ref(null);

const alert = reactive({ show: false, title: '', message: '', type: 'success' });
const triggerAlert = (type, title, message) => {
  alert.type = type; alert.title = title; alert.message = message; alert.show = true;
  setTimeout(() => alert.show = false, 3000);
};

const confirmModal = reactive({ show: false, targetSeller: null });

const form = reactive({
  fullName: '', address: '', telegram: '', phoneNumber: '', idNumber: '', profileFile: null, idCardFile: null
});
const previews = reactive({ profile: null, id: null });

onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const role = userDoc.exists() ? userDoc.data().role : 'user';
        isOwner.value = (role === 'owner');

        let q = (role === 'admin')
           ? query(collection(db, "users"), where("role", "==", "seller"), where("createdBy", "==", user.uid))
           : query(collection(db, "users"), where("role", "==", "seller"));

        onSnapshot(q, (snapshot) => {
          sellers.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          isLoading.value = false;
        });
      } catch (e) { console.error(e); isLoading.value = false; }
    } else { isLoading.value = false; }
  });
});

const filteredSellers = computed(() => {
  if (!searchQuery.value) return sellers.value;
  const lowerSearch = searchQuery.value.toLowerCase();
  return sellers.value.filter(s => s.fullName.toLowerCase().includes(lowerSearch) || (s.telegram && s.telegram.toLowerCase().includes(lowerSearch)));
});

// DETAIL MODAL LOGIC
const openDetailModal = (seller) => {
    selectedSeller.value = seller;
    showDetailModal.value = true;
};
const closeDetailModal = () => {
    showDetailModal.value = false;
    selectedSeller.value = null;
};

// CREATE/EDIT CONTROLS
const openCreateModal = () => {
  isEditing.value = false;
  currentSellerId.value = null;
  resetForm();
  showModal.value = true;
};

const openEditModal = (seller) => {
  isEditing.value = true;
  currentSellerId.value = seller.id;
  Object.assign(form, {
    fullName: seller.fullName, address: seller.address, telegram: seller.telegram,
    phoneNumber: seller.phoneNumber, idNumber: seller.idNumber, profileFile: null, idCardFile: null
  });
  previews.profile = seller.photoUrl;
  previews.id = seller.idCardUrl;
  showModal.value = true;
};

const closeModal = () => { showModal.value = false; resetForm(); };

const resetForm = () => {
  Object.assign(form, { fullName: '', address: '', telegram: '', phoneNumber: '', idNumber: '', profileFile: null, idCardFile: null });
  Object.assign(previews, { profile: null, id: null });
};

const handleFile = (e, type) => {
  const file = e.target.files[0];
  if (!file) return;
  if (type === 'profile') { form.profileFile = file; previews.profile = URL.createObjectURL(file); } 
  else { form.idCardFile = file; previews.id = URL.createObjectURL(file); }
};

// SUBMIT
const submitSeller = async () => {
  if (!auth.currentUser) return;
  if (!form.fullName || !form.telegram || (!isEditing.value && !form.profileFile)) {
     return triggerAlert('error', 'បរាជ័យ', 'សូមបំពេញព័ត៌មាន និងរូបភាព');
  }

  isSubmitting.value = true;
  const formData = new FormData();
  formData.append('fullName', form.fullName);
  formData.append('address', form.address);
  formData.append('username', form.telegram);
  formData.append('telegram', form.telegram);
  formData.append('phoneNumber', form.phoneNumber);
  formData.append('idNumber', form.idNumber);
  if (form.profileFile) formData.append('profileImage', form.profileFile);
  if (form.idCardFile) formData.append('idCardImage', form.idCardFile);

  if (!isEditing.value) formData.append('password', '123456');

  try {
     const token = await auth.currentUser.getIdToken(true);
     const url = isEditing.value 
        ? `http://localhost:5000/api/update-seller/${currentSellerId.value}`
        : 'http://localhost:5000/api/create-seller';
     const method = isEditing.value ? 'put' : 'post';

     const res = await axios({
        method: method, url: url, data: formData,
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
     });

     if (res.data.success) {
        triggerAlert('success', 'ជោគជ័យ', isEditing.value ? 'បានកែប្រែទិន្នន័យ' : 'បានបង្កើតគណនី');
        if (isEditing.value) {
            closeModal();
        } else {
            resetForm();
            nextTick(() => { if (nameInput.value) nameInput.value.focus(); });
        }
     }
  } catch (error) {
     console.error(error);
     triggerAlert('error', 'បរាជ័យ', error.response?.data?.error || 'មានបញ្ហា');
  } finally {
     isSubmitting.value = false;
  }
};

const confirmDelete = (seller) => {
    confirmModal.targetSeller = seller;
    confirmModal.show = true;
};

const executeDelete = async () => {
    if (!confirmModal.targetSeller) return;
    try {
        const token = await auth.currentUser.getIdToken(true);
        await axios.delete(`http://localhost:5000/api/delete-seller/${confirmModal.targetSeller.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        triggerAlert('success', 'ជោគជ័យ', 'គណនីត្រូវបានលុប');
    } catch (e) {
        console.error(e);
        triggerAlert('error', 'បរាជ័យ', 'មិនអាចលុបគណនីបាន');
    } finally {
        confirmModal.show = false;
    }
};
</script>