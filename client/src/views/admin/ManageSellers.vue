<template>
  <div class="font-khmer h-full flex flex-col relative bg-[#F4F7FE] min-h-[100dvh]">
    
    <Toast />

    <ConfirmDialog ref="confirmDialogRef" />

    <div class="sticky top-0 z-40 bg-[#F4F7FE]/80 backdrop-blur-2xl border-b border-slate-200/60 transition-all px-4 md:px-8 py-5">
      <div class="max-w-[90rem] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
        
        <div class="flex items-center gap-4">
           <div class="w-14 h-14 rounded-[1.25rem] bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-teal-500/20 text-white shrink-0 relative overflow-hidden group">
              <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 group-hover:scale-110 transition-transform duration-500"></div>
              <svg class="w-7 h-7 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
           </div>
           <div>
             <h1 class="text-2xl md:text-3xl font-black text-slate-800 tracking-tight leading-tight">តំណាងលក់</h1>
             <p class="text-slate-500 text-[11px] md:text-xs font-bold uppercase tracking-wider mt-0.5">Sellers Management</p>
           </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div class="relative w-full sm:w-80 group">
             <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-500 transition-colors">
               <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
             </div>
             <input 
               v-model="searchQuery" 
               type="text" 
               class="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200/80 rounded-[1.25rem] text-sm font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-400 shadow-sm transition-all placeholder:text-slate-400"
               placeholder="ស្វែងរក ឈ្មោះ, Telegram, ឬ ID..."
             />
             <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                 <span class="bg-slate-100 text-slate-400 text-[10px] font-black px-2 py-1 rounded-md border border-slate-200 shadow-sm">SEARCH</span>
             </div>
          </div>

          <button @click="openCreateModal" class="bg-slate-800 hover:bg-slate-900 text-white px-6 py-3.5 rounded-[1.25rem] shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2.5 transition-all active:scale-95 font-bold text-sm shrink-0 group">
            <div class="bg-white/20 p-1 rounded-lg group-hover:rotate-90 transition-transform duration-300">
               <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4"></path></svg>
            </div>
            <span>បញ្ចូលថ្មី (Add)</span>
          </button>
        </div>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8">
      <div class="max-w-[90rem] mx-auto w-full pb-20">
          
        <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
           <div v-for="n in 8" :key="n" class="bg-white rounded-[2rem] p-2 shadow-sm border border-slate-100 animate-pulse h-[320px] flex flex-col">
              <div class="h-28 bg-slate-200 rounded-[1.5rem]"></div>
              <div class="px-6 relative flex justify-center -mt-12">
                 <div class="w-24 h-24 rounded-full bg-slate-300 border-4 border-white"></div>
              </div>
              <div class="flex-1 p-6 pt-4 flex flex-col items-center gap-3">
                 <div class="h-4 w-32 bg-slate-200 rounded-full"></div>
                 <div class="h-3 w-20 bg-slate-100 rounded-full"></div>
              </div>
           </div>
        </div>

        <div v-else-if="filteredSellers.length === 0" class="flex flex-col items-center justify-center text-center py-32 bg-white/40 backdrop-blur-sm rounded-[2.5rem] border-2 border-dashed border-slate-200 shadow-sm">
           <div class="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-5 text-slate-300 shadow-md">
              <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
           </div>
           <h3 class="text-2xl font-black text-slate-800">មិនមានទិន្នន័យ</h3>
           <p class="text-slate-500 font-bold mt-2">
             {{ searchQuery ? `គ្មានលទ្ធផលសម្រាប់ "${searchQuery}"` : (isOwner ? 'មិនមានតំណាងលក់នៅក្នុងប្រព័ន្ធទេ' : 'អ្នកមិនទាន់បានបង្កើតតំណាងលក់នៅឡើយទេ') }}
           </p>
        </div>

        <TransitionGroup 
            v-else 
            tag="div" 
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            enter-active-class="transition duration-500 ease-out"
            enter-from-class="opacity-0 translate-y-8 scale-95"
            enter-to-class="opacity-100 translate-y-0 scale-100"
            leave-active-class="transition duration-300 ease-in absolute"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
            move-class="transition duration-500 ease-in-out"
        >
           <div 
             v-for="seller in filteredSellers" 
             :key="seller.id" 
             @dblclick="openDetailModal(seller)"
             class="group bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 relative flex flex-col border border-slate-100 overflow-hidden cursor-pointer"
           >
              <div class="h-28 relative p-3">
                  <div class="absolute inset-0 bg-gradient-to-br from-teal-400 via-emerald-500 to-teal-600 rounded-t-[1.75rem] rounded-b-2xl">
                      <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                      <div class="absolute -right-4 -top-4 w-24 h-24 bg-white/20 rounded-full blur-xl"></div>
                  </div>
                  
                  <div class="absolute top-4 left-4 z-10">
                      <span v-if="seller.role === 'dealer'" class="bg-amber-400 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-md border border-amber-300 flex items-center gap-1">
                          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                          Dealer
                      </span>
                  </div>

                  <button @click.stop="promptDelete(seller)" class="absolute top-4 right-4 bg-white/20 hover:bg-rose-500 text-white backdrop-blur-md p-2 rounded-full transition-all duration-300 shadow-sm border border-white/30 z-10" title="លុបគណនី">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
              </div>
              
              <div class="px-6 relative flex justify-center -mt-14 z-10 pointer-events-none">
                 <div class="w-[100px] h-[100px] rounded-full p-1.5 bg-white shadow-lg group-hover:scale-105 transition-transform duration-500 pointer-events-auto">
                    <img :src="seller.photoUrl || 'https://ui-avatars.com/api/?background=random&name='+seller.fullName" class="w-full h-full object-cover rounded-full bg-slate-50" alt="Profile">
                 </div>
              </div>

              <div class="px-6 py-4 text-center flex-1 flex flex-col items-center">
                 <h3 class="font-black text-xl text-slate-800 leading-tight mb-1 group-hover:text-teal-600 transition-colors">{{ seller.fullName }}</h3>
                 <div class="inline-flex items-center gap-1.5 bg-slate-100 text-slate-500 px-3 py-1 rounded-lg border border-slate-200/60 shadow-inner">
                     <svg class="w-3.5 h-3.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0c0 .884-.5 2-2 2h4c-1.5 0-2-1.116-2-2z"></path></svg>
                     <span class="text-[11px] font-mono font-black tracking-widest">{{ seller.idNumber || 'N/A' }}</span>
                 </div>
                 
                 <div class="flex flex-wrap justify-center gap-2 mt-5 w-full">
                    <div v-if="seller.phoneNumber" class="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-white shadow-sm px-3 py-1.5 rounded-xl border border-slate-100 w-full justify-center">
                       <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                       {{ seller.phoneNumber }}
                    </div>
                    <a v-if="seller.telegram" :href="'https://t.me/'+seller.telegram" target="_blank" @click.stop class="flex items-center gap-1.5 text-xs font-bold text-sky-600 bg-sky-50 shadow-sm px-3 py-1.5 rounded-xl border border-sky-100 hover:bg-sky-500 hover:text-white transition-colors w-full justify-center">
                       <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.48-.94-2.4-1.54-1.06-.7-.37-1.09.23-1.72.16-.16 2.87-2.63 2.92-2.85.01-.03.01-.14-.06-.2-.06-.06-.17-.04-.25-.02-.11.02-1.91 1.2-5.39 3.55-.5.34-.95.51-1.35.5-.44-.01-1.29-.25-1.92-.42-.77-.21-1.37-.32-1.31-.68.03-.18.28-.37.76-.56 3.03-1.32 5.06-2.19 6.09-2.62 2.93-1.21 3.53-1.43 3.93-1.43.09 0 .28.01.4.04.1.03.24.1.33.25.08.16.07.32.07.33z"/></svg>
                       @{{ seller.telegram }}
                    </a>
                 </div>
              </div>
              
              <div class="p-3 border-t border-slate-100 bg-slate-50/80 flex gap-2">
                 <button @click.stop="openDetailModal(seller)" class="flex-1 py-3 text-[11px] font-black text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-800 hover:text-white transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-95 group/btn">
                    <svg class="w-4 h-4 opacity-70 group-hover/btn:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    ព័ត៌មានលម្អិត
                 </button>
                 <button @click.stop="openEditModal(seller)" class="w-12 h-12 flex items-center justify-center text-blue-600 bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95" title="កែប្រែ">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                 </button>
              </div>
           </div>
        </TransitionGroup>
      </div>
    </div>

    <TransitionRoot appear :show="showModal" as="template">
      <Dialog as="div" @close="closeModal" class="relative z-[90]">
        <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto custom-scrollbar">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild as="template" enter="duration-400 ease-out" enter-from="opacity-0 scale-95 translate-y-10" enter-to="opacity-100 scale-100 translate-y-0" leave="duration-200 ease-in" leave-from="opacity-100 scale-100 translate-y-0" leave-to="opacity-0 scale-95 translate-y-10">
              <DialogPanel class="w-full max-w-5xl transform overflow-hidden rounded-[2rem] bg-white shadow-2xl transition-all relative">
                
                <div class="px-8 py-6 flex justify-between items-center relative overflow-hidden border-b border-slate-100" :class="isEditing ? 'bg-gradient-to-r from-amber-50 to-orange-50' : 'bg-gradient-to-r from-teal-50 to-emerald-50'">
                  <div class="relative z-10 flex items-center gap-4">
                    <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md" :class="isEditing ? 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-orange-500/30' : 'bg-gradient-to-br from-teal-500 to-emerald-600 shadow-teal-500/30'">
                        <svg v-if="isEditing" class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                        <svg v-else class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
                    </div>
                    <div>
                      <h3 class="text-2xl font-black text-slate-800 tracking-tight">{{ isEditing ? 'កែប្រែព័ត៌មានតំណាងលក់' : 'ចុះឈ្មោះតំណាងលក់ថ្មី' }}</h3>
                      <p class="text-slate-500 text-xs font-bold uppercase tracking-widest mt-0.5">{{ isEditing ? 'UPDATE SELLER PROFILE' : 'REGISTER NEW SELLER' }}</p>
                    </div>
                  </div>
                  <button @click="closeModal" class="bg-white hover:bg-slate-100 border border-slate-200 text-slate-500 rounded-full p-2.5 transition-all z-10 active:scale-95 shadow-sm">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>

                <div class="p-8 bg-slate-50/50">
                  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    <div class="lg:col-span-8 space-y-6">
                        
                        <div class="flex items-center justify-between bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                                </div>
                                <div>
                                    <p class="text-sm font-black text-slate-800">កំណត់សិទ្ធិជា Dealer (អ្នកបោះដុំធំ)</p>
                                    <p class="text-[11px] font-bold text-slate-500 mt-0.5">បើកមុខងារនេះដើម្បីផ្តល់សិទ្ធិជា Dealer ជំនួសឱ្យ Seller ធម្មតា</p>
                                </div>
                            </div>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" v-model="form.isDealer" class="sr-only peer">
                                <div class="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-amber-500"></div>
                            </label>
                        </div>

                        <div class="bg-white p-6 rounded-[24px] border border-slate-200/60 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-5">
                            
                            <div class="sm:col-span-2">
                                <label class="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2 ml-1">ឈ្មោះពេញ (Full Name) <span class="text-rose-500">*</span></label>
                                <input ref="nameInput" v-model="form.fullName" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-bold text-sm focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all placeholder-slate-400" placeholder="បញ្ចូលឈ្មោះពេញ...">
                            </div>

                            <div>
                                <label class="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2 ml-1">ឈ្មោះគណនី (Username) <span class="text-rose-500">*</span></label>
                                <div class="relative group">
                                    <span class="absolute inset-y-0 left-0 pl-4 flex items-center font-bold text-slate-400 group-focus-within:text-teal-500 transition-colors">@</span>
                                    <input v-model="form.username" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-3 text-slate-800 font-bold text-sm focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all placeholder-slate-400" placeholder="username">
                                </div>
                            </div>

                            <div>
                                <label class="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2 ml-1">លេខសម្ងាត់ (Password) <span class="text-rose-500">*</span></label>
                                <input v-model="form.password" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-bold text-sm focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all placeholder-slate-400 font-mono" placeholder="យ៉ាងតិច ៦ ខ្ទង់">
                            </div>

                            <div>
                                <label class="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2 ml-1">តេឡេក្រាម (Telegram) <span class="text-rose-500">*</span></label>
                                <div class="relative group">
                                    <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 group-focus-within:text-sky-500 transition-colors">
                                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.48-.94-2.4-1.54-1.06-.7-.37-1.09.23-1.72.16-.16 2.87-2.63 2.92-2.85.01-.03.01-.14-.06-.2-.06-.06-.17-.04-.25-.02-.11.02-1.91 1.2-5.39 3.55-.5.34-.95.51-1.35.5-.44-.01-1.29-.25-1.92-.42-.77-.21-1.37-.32-1.31-.68.03-.18.28-.37.76-.56 3.03-1.32 5.06-2.19 6.09-2.62 2.93-1.21 3.53-1.43 3.93-1.43.09 0 .28.01.4.04.1.03.24.1.33.25.08.16.07.32.07.33z"/></svg>
                                    </span>
                                    <input v-model="form.telegram" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-slate-800 font-bold text-sm focus:bg-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all placeholder-slate-400" placeholder="username">
                                </div>
                            </div>

                            <div>
                                <label class="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2 ml-1">លេខទូរស័ព្ទ (Phone)</label>
                                <div class="relative group">
                                    <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 group-focus-within:text-teal-500 transition-colors">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                    </span>
                                    <input v-model="form.phoneNumber" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-slate-800 font-bold text-sm focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all placeholder-slate-400" placeholder="012 345 678">
                                </div>
                            </div>

                            <div class="sm:col-span-2">
                                <label class="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2 ml-1">អត្តសញ្ញាណប័ណ្ណ (ID Number) <span class="text-rose-500">*</span></label>
                                <div class="relative group">
                                    <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 group-focus-within:text-teal-500 transition-colors">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0c0 .884-.5 2-2 2h4c-1.5 0-2-1.116-2-2z"></path></svg>
                                    </span>
                                    <input v-model="form.idNumber" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-slate-800 font-bold text-sm focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all placeholder-slate-400 font-mono tracking-widest" placeholder="XXXXXXXXX">
                                </div>
                            </div>

                            <div class="sm:col-span-2">
                                <label class="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2 ml-1">អាសយដ្ឋាន (Address)</label>
                                <input v-model="form.address" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-bold text-sm focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all placeholder-slate-400" placeholder="ផ្ទះលេខ, ផ្លូវ, សង្កាត់, ខណ្ឌ, រាជធានី/ខេត្ត...">
                            </div>

                        </div>
                    </div>

                    <div class="lg:col-span-4 space-y-6">
                        
                        <div class="bg-white p-5 rounded-[24px] border border-slate-200/60 shadow-sm flex flex-col h-[230px]">
                            <label class="block text-[11px] font-black text-slate-600 uppercase tracking-widest mb-3 flex items-center justify-between">
                                <span>រូបថតផ្ទាល់ខ្លួន <span v-if="!isEditing" class="text-rose-500">*</span></span>
                                <span v-if="previews.profile" @click.stop="clearImage('profile')" class="text-rose-500 hover:text-rose-700 cursor-pointer flex items-center gap-1"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg> លុប</span>
                            </label>
                            <div @click="$refs.profileInput.click()" class="flex-1 border-2 border-dashed border-slate-300 hover:border-teal-400 bg-slate-50 hover:bg-teal-50/50 rounded-[1.25rem] flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative group">
                                <input ref="profileInput" type="file" accept="image/*" class="hidden" @change="e => handleFile(e, 'profile')">
                                <img v-if="previews.profile" :src="previews.profile" class="w-full h-full object-cover absolute inset-0">
                                <div v-else class="text-center p-4 group-hover:scale-105 transition-transform">
                                    <div class="w-12 h-12 bg-white shadow-sm rounded-full flex items-center justify-center mx-auto mb-2 text-slate-400 group-hover:text-teal-500 transition-colors">
                                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                    </div>
                                    <p class="text-[11px] text-slate-500 font-bold uppercase tracking-widest">Profile Image</p>
                                </div>
                            </div>
                        </div>

                        <div class="bg-white p-5 rounded-[24px] border border-slate-200/60 shadow-sm flex flex-col h-[230px]">
                            <label class="block text-[11px] font-black text-slate-600 uppercase tracking-widest mb-3 flex items-center justify-between">
                                <span>រូបថតអត្តសញ្ញាណប័ណ្ណ</span>
                                <span v-if="previews.id" @click.stop="clearImage('id')" class="text-rose-500 hover:text-rose-700 cursor-pointer flex items-center gap-1"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg> លុប</span>
                            </label>
                            <div @click="$refs.idInput.click()" class="flex-1 border-2 border-dashed border-slate-300 hover:border-teal-400 bg-slate-50 hover:bg-teal-50/50 rounded-[1.25rem] flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative group">
                                <input ref="idInput" type="file" accept="image/*" class="hidden" @change="e => handleFile(e, 'id')">
                                <img v-if="previews.id" :src="previews.id" class="w-full h-full object-cover absolute inset-0">
                                <div v-else class="text-center p-4 group-hover:scale-105 transition-transform">
                                    <div class="w-12 h-12 bg-white shadow-sm rounded-full flex items-center justify-center mx-auto mb-2 text-slate-400 group-hover:text-teal-500 transition-colors">
                                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0c0 .884-.5 2-2 2h4c-1.5 0-2-1.116-2-2z"></path></svg>
                                    </div>
                                    <p class="text-[11px] text-slate-500 font-bold uppercase tracking-widest">ID Card Image</p>
                                </div>
                            </div>
                        </div>

                    </div>
                  </div>
                </div>

                <div class="bg-white px-8 py-5 flex items-center justify-end gap-3 border-t border-slate-200/60">
                  <button @click="closeModal" class="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all text-sm">បោះបង់ (Cancel)</button>
                  <button @click="submitSeller" :disabled="isSubmitting" class="text-white px-8 py-3 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 text-sm min-w-[160px]" :class="isEditing ? 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-orange-500/30 hover:shadow-orange-500/50' : 'bg-gradient-to-r from-teal-500 to-emerald-600 shadow-teal-500/30 hover:shadow-teal-500/50'">
                      <svg v-if="isSubmitting" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      <span v-else>{{ isEditing ? 'រក្សាទុកការកែប្រែ' : 'បង្កើតគណនីឥឡូវនេះ' }}</span>
                  </button>
                </div>

              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <TransitionRoot appear :show="showDetailModal" as="template">
      <Dialog as="div" @close="closeDetailModal" class="relative z-[90]">
        <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-md" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto custom-scrollbar">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild as="template" enter="duration-400 ease-out" enter-from="opacity-0 scale-95 translate-y-10" enter-to="opacity-100 scale-100 translate-y-0" leave="duration-200 ease-in" leave-from="opacity-100 scale-100 translate-y-0" leave-to="opacity-0 scale-95 translate-y-10">
              <DialogPanel class="w-full max-w-2xl transform overflow-hidden rounded-[2.5rem] bg-slate-50 shadow-2xl transition-all relative border border-white">
                
                <div class="h-44 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 relative overflow-hidden">
                   <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                   <div class="absolute -right-10 -top-10 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
                   
                   <button @click="closeDetailModal" class="absolute top-5 right-5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full p-2.5 transition backdrop-blur-sm z-10 active:scale-95">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
                   </button>
                   
                   <div class="absolute top-6 left-8">
                      <p class="text-white/50 text-[10px] font-black uppercase tracking-[0.2em] mb-1.5">Official Seller Profile</p>
                      <div class="flex items-center gap-2 bg-white/10 w-fit px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-sm">
                         <span class="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse"></span>
                         <span class="text-white font-bold text-xs">{{ selectedSeller?.role === 'dealer' ? 'Dealer Account' : 'Active Account' }}</span>
                      </div>
                   </div>
                </div>

                <div class="px-8 relative flex flex-col sm:flex-row justify-between sm:items-end -mt-16 mb-6 gap-4">
                   <div class="w-32 h-32 rounded-[2rem] p-1.5 bg-white shadow-xl rotate-3 relative z-10 border border-slate-100">
                      <img :src="selectedSeller?.photoUrl || `https://ui-avatars.com/api/?name=${selectedSeller?.fullName}&background=random`" class="w-full h-full object-cover rounded-[1.5rem] bg-slate-50">
                   </div>
                   
                   <div class="flex gap-2.5 relative z-10 w-full sm:w-auto">
                      <button @click="openEditModal(selectedSeller); closeDetailModal()" class="flex-1 sm:flex-none px-5 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors shadow-sm flex items-center justify-center gap-2 text-sm active:scale-95">
                         <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                         កែប្រែ
                      </button>
                      <button @click="navigateToSalesHistory(selectedSeller)" class="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 text-sm active:scale-95">
                         <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012-2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                         ប្រវត្តិលក់
                      </button>
                   </div>
                </div>

                <div class="px-8 pb-8">
                   <div class="mb-8">
                      <div class="flex items-center gap-3">
                        <h2 class="text-3xl font-black text-slate-800 tracking-tight">{{ selectedSeller?.fullName }}</h2>
                        <span v-if="selectedSeller?.role === 'dealer'" class="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-black uppercase tracking-widest border border-amber-200">Dealer</span>
                      </div>
                      <div class="flex flex-wrap items-center gap-2.5 mt-3">
                         <span class="bg-slate-200 text-slate-600 px-3 py-1 rounded-lg text-xs font-mono font-bold tracking-widest border border-slate-300">ID: {{ selectedSeller?.idNumber || 'N/A' }}</span>
                         <span v-if="selectedSeller?.username" class="text-slate-600 font-bold text-sm bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">@{{ selectedSeller.username }}</span>
                      </div>
                   </div>

                   <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                      <div class="bg-[#F8FAFC] p-4 rounded-2xl border border-slate-200/60 flex items-center gap-4">
                         <div class="w-12 h-12 bg-white text-teal-600 rounded-xl flex items-center justify-center border border-slate-100 shadow-sm">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                         </div>
                         <div>
                            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">លេខទូរស័ព្ទ</p>
                            <p class="font-bold text-slate-800">{{ selectedSeller?.phoneNumber || 'N/A' }}</p>
                         </div>
                      </div>

                      <div class="bg-[#F8FAFC] p-4 rounded-2xl border border-slate-200/60 flex items-center gap-4">
                         <div class="w-12 h-12 bg-white text-orange-500 rounded-xl flex items-center justify-center border border-slate-100 shadow-sm">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                         </div>
                         <div>
                            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">អាសយដ្ឋាន</p>
                            <p class="font-bold text-slate-800 text-sm line-clamp-1">{{ selectedSeller?.address || 'N/A' }}</p>
                         </div>
                      </div>
                      
                      <div class="bg-[#F8FAFC] p-4 rounded-2xl border border-slate-200/60 flex items-center gap-4">
                         <div class="w-12 h-12 bg-white text-sky-500 rounded-xl flex items-center justify-center border border-slate-100 shadow-sm">
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.48-.94-2.4-1.54-1.06-.7-.37-1.09.23-1.72.16-.16 2.87-2.63 2.92-2.85.01-.03.01-.14-.06-.2-.06-.06-.17-.04-.25-.02-.11.02-1.91 1.2-5.39 3.55-.5.34-.95.51-1.35.5-.44-.01-1.29-.25-1.92-.42-.77-.21-1.37-.32-1.31-.68.03-.18.28-.37.76-.56 3.03-1.32 5.06-2.19 6.09-2.62 2.93-1.21 3.53-1.43 3.93-1.43.09 0 .28.01.4.04.1.03.24.1.33.25.08.16.07.32.07.33z"/></svg>
                         </div>
                         <div>
                            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Telegram</p>
                            <p class="font-bold text-slate-800 font-mono tracking-widest">{{ selectedSeller?.telegram || 'N/A' }}</p>
                         </div>
                      </div>

                      <div v-if="selectedSeller?.password" class="bg-[#F8FAFC] p-4 rounded-2xl border border-slate-200/60 flex items-center gap-4">
                         <div class="w-12 h-12 bg-white text-indigo-500 rounded-xl flex items-center justify-center border border-slate-100 shadow-sm">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                         </div>
                         <div>
                            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">លេខសម្ងាត់ (Password)</p>
                            <p class="font-bold text-slate-800 font-mono tracking-widest">{{ selectedSeller?.password }}</p>
                         </div>
                      </div>
                   </div>

                   <div>
                      <h4 class="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                         <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0c0 .884-.5 2-2 2h4c-1.5 0-2-1.116-2-2z"></path></svg>
                         អត្តសញ្ញាណប័ណ្ណ
                      </h4>
                      <div class="bg-[#F8FAFC] rounded-2xl p-2 border border-slate-200/60 relative group overflow-hidden">
                         <div v-if="selectedSeller?.idCardUrl" class="aspect-[16/9] sm:aspect-[21/9] w-full relative rounded-xl overflow-hidden shadow-sm">
                            <img :src="selectedSeller.idCardUrl" class="w-full h-full object-cover">
                            <div class="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                               <a :href="selectedSeller.idCardUrl" target="_blank" class="px-5 py-2.5 bg-white text-slate-800 rounded-full text-sm font-bold shadow-xl hover:scale-105 transition-transform flex items-center gap-2">
                                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg>
                                  មើលរូបភាពពេញ
                               </a>
                            </div>
                         </div>
                         <div v-else class="aspect-[16/9] sm:aspect-[21/9] w-full bg-white rounded-xl flex flex-col items-center justify-center text-slate-400 border border-dashed border-slate-200">
                            <svg class="w-10 h-10 mb-2 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                            <span class="text-xs font-bold uppercase tracking-widest">មិនមានរូបភាព</span>
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

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, nextTick } from 'vue';
import { useRouter } from 'vue-router'; 
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue';
import { db, auth } from '@/firebaseConfig';
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth'; 
import axios from 'axios';

// ✅ នាំចូល Toast និង Store
import Toast from '@/components/Toast.vue';
import ConfirmDialog from '@/components/shared/ConfirmDialog.vue';
import { useNotificationStore } from '@/stores/notification';

const router = useRouter(); 
const notification = useNotificationStore(); // ប្រើ Store សម្រាប់ Notification

const sellers = ref([]);
const isLoading = ref(true);
const showModal = ref(false);
const showDetailModal = ref(false); 
const selectedSeller = ref(null); 
const isSubmitting = ref(false);
const searchQuery = ref('');
const isOwner = ref(false);
const isEditing = ref(false);
const currentSellerId = ref(null);
const nameInput = ref(null);
const confirmDialogRef = ref(null); // Ref ទៅ ConfirmDialog

// ✅ UPDATED FORM: Added 'username' field
const form = reactive({
  fullName: '', 
  username: '', // ថ្មី
  address: '', 
  telegram: '', 
  phoneNumber: '', 
  idNumber: '', 
  password: '', 
  isDealer: false, 
  profileFile: null, 
  idCardFile: null
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
           ? query(collection(db, "users"), where("role", "in", ["seller", "dealer"]), where("createdBy", "==", user.uid))
           : query(collection(db, "users"), where("role", "in", ["seller", "dealer"]));

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
  return sellers.value.filter(s => 
    s.fullName.toLowerCase().includes(lowerSearch) || 
    (s.telegram && s.telegram.toLowerCase().includes(lowerSearch)) ||
    (s.idNumber && s.idNumber.toLowerCase().includes(lowerSearch))
  );
});

const navigateToSalesHistory = (seller) => {
    closeDetailModal();
    router.push(`/admin/seller-detail/${seller.id}`);
};

const openDetailModal = (seller) => {
    selectedSeller.value = seller;
    showDetailModal.value = true;
};
const closeDetailModal = () => {
    showDetailModal.value = false;
    setTimeout(() => { selectedSeller.value = null; }, 300);
};

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
    fullName: seller.fullName, 
    username: seller.username || '', // ទាញ username ចាស់មកបង្ហាញ
    address: seller.address, 
    telegram: seller.telegram,
    phoneNumber: seller.phoneNumber, 
    idNumber: seller.idNumber, 
    password: seller.password || '', 
    isDealer: seller.role === 'dealer', 
    profileFile: null, 
    idCardFile: null
  });
  previews.profile = seller.photoUrl;
  previews.id = seller.idCardUrl;
  showModal.value = true;
};

const closeModal = () => { showModal.value = false; setTimeout(() => { resetForm(); }, 300); };

const resetForm = () => {
  Object.assign(form, { fullName: '', username: '', address: '', telegram: '', phoneNumber: '', idNumber: '', password: '', isDealer: false, profileFile: null, idCardFile: null });
  Object.assign(previews, { profile: null, id: null });
};

const handleFile = (e, type) => {
  const file = e.target.files[0];
  if (!file) return;
  if (type === 'profile') { form.profileFile = file; previews.profile = URL.createObjectURL(file); } 
  else { form.idCardFile = file; previews.id = URL.createObjectURL(file); }
};

const clearImage = (type) => {
    if (type === 'profile') {
        form.profileFile = null;
        previews.profile = null;
    } else {
        form.idCardFile = null;
        previews.id = null;
    }
};

const submitSeller = async () => {
  if (!auth.currentUser) return;
  
  // Update validation check to include username
  if (!form.fullName || !form.username || !form.telegram || (!isEditing.value && !form.profileFile) || !form.idNumber || !form.password) {
     return notification.error('សូមបំពេញព័ត៌មានដែលមានសញ្ញាផ្កាយ (*) ទាំងអស់ឱ្យបានត្រឹមត្រូវ!', 'សូមត្រួតពិនិត្យ');
  }

  isSubmitting.value = true;
  const formData = new FormData();
  formData.append('fullName', form.fullName);
  formData.append('username', form.username); // បញ្ជូន username
  formData.append('address', form.address);
  formData.append('telegram', form.telegram);
  formData.append('phoneNumber', form.phoneNumber);
  formData.append('idNumber', form.idNumber);
  formData.append('password', form.password); 
  formData.append('role', form.isDealer ? 'dealer' : 'seller'); 
  
  if (form.profileFile) formData.append('profileImage', form.profileFile);
  if (form.idCardFile) formData.append('idCardImage', form.idCardFile);

  try {
     const token = await auth.currentUser.getIdToken(true);
     const url = isEditing.value 
        ? `https://reportapp-81vf.onrender.com/api/update-seller/${currentSellerId.value}`
        : 'https://reportapp-81vf.onrender.com/api/create-seller';
     const method = isEditing.value ? 'put' : 'post';

     const res = await axios({
        method: method, url: url, data: formData,
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
     });

     if (res.data.success) {
        notification.success(isEditing.value ? 'បានកែប្រែទិន្នន័យដោយជោគជ័យ' : 'បានបង្កើតគណនីថ្មីដោយជោគជ័យ');
        if (isEditing.value) {
            closeModal();
        } else {
            resetForm();
            nextTick(() => { if (nameInput.value) nameInput.value.focus(); });
        }
     }
  } catch (error) {
     console.error(error);
     if (error.response && error.response.data && error.response.data.error === "ID_EXISTS") {
         notification.error('លេខអត្តសញ្ញាណប័ណ្ណនេះមានក្នុងប្រព័ន្ធរួចហើយ!', 'បដិសេធ');
     } else if (error.response && error.response.data && error.response.data.error === "USERNAME_EXISTS") {
         notification.error('ឈ្មោះគណនី (Username) នេះមានអ្នកប្រើប្រាស់រួចហើយ!', 'បដិសេធ');
     } else {
         notification.error(error.response?.data?.message || 'មានបញ្ហាក្នុងការរក្សាទុកទិន្នន័យ');
     }
  } finally {
     isSubmitting.value = false;
  }
};

const promptDelete = async (seller) => {
    const confirmed = await confirmDialogRef.value.open(
        "លុបគណនី?", 
        `តើអ្នកពិតជាចង់លុបគណនី "${seller.fullName}" មែនទេ?`
    );

    if (confirmed) {
        executeDelete(seller.id);
    }
};

const executeDelete = async (id) => {
    try {
        const token = await auth.currentUser.getIdToken(true);
        await axios.delete(`https://reportapp-81vf.onrender.com/api/delete-seller/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        notification.success('គណនីត្រូវបានលុបចេញពីប្រព័ន្ធ');
    } catch (e) {
        console.error(e);
        notification.error('មានបញ្ហាក្នុងការលុបគណនី');
    }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Battambong:wght@400;700;900&family=Kantumruy+Pro:wght@400;700&display=swap');
.font-khmer { font-family: 'Kantumruy Pro', 'Battambong', sans-serif; }

.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #94A3B8; }

.animate-fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}
</style>     