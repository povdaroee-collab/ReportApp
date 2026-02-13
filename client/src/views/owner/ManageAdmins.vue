<template>
  <div class="font-khmer h-full flex flex-col relative">
    
    <div class="fixed top-4 right-4 z-[100] w-full max-w-sm pointer-events-none">
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

    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">អ្នកគ្រប់គ្រង (Admins)</h1>
        <p class="text-slate-500 text-sm mt-1">គ្រប់គ្រងសិទ្ធិ កែប្រែ និងលុបគណនី Admin</p>
      </div>

      <div class="flex gap-3 w-full md:w-auto">
        <div class="relative flex-1 md:w-72">
           <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 pointer-events-none">
             <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
           </span>
           <input 
             v-model="searchQuery" 
             type="text" 
             class="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 shadow-sm transition-all"
             placeholder="ស្វែងរកឈ្មោះ..."
           />
        </div>

        <button @click="openCreateModal" class="bg-[#4F46E5] hover:bg-[#4338ca] text-white px-6 py-3 rounded-2xl shadow-lg shadow-indigo-500/30 flex items-center gap-2 transition-all active:scale-95 font-bold tracking-wide">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          <span class="hidden sm:inline">បង្កើតថ្មី</span>
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
       <div v-for="n in 3" :key="n" class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 animate-pulse flex items-center gap-4 h-48"></div>
    </div>

    <div v-else-if="filteredAdmins.length === 0" class="flex-1 flex flex-col items-center justify-center text-center p-12 bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-slate-300">
       <div class="w-24 h-24 bg-violet-50 rounded-full flex items-center justify-center mb-4 shadow-inner">
          <svg class="w-10 h-10 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
       </div>
       <h3 class="text-lg font-bold text-slate-700">មិនមានទិន្នន័យ</h3>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
       <div v-for="admin in filteredAdmins" :key="admin.id" class="group bg-white rounded-3xl p-6 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden border border-slate-100">
          
          <div class="absolute top-[-20%] right-[-20%] w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all"></div>
          
          <div class="absolute top-4 right-4 z-10 flex gap-2">
             <span v-if="admin.isBlocked" class="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-1 rounded-full border border-red-100 flex items-center gap-1 shadow-sm">
               <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> Blocked
             </span>
             <span v-else class="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-1 rounded-full border border-emerald-100 flex items-center gap-1 shadow-sm">
               <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Active
             </span>
             
             <button @click="confirmDelete(admin)" class="bg-white text-slate-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-full transition shadow-sm border border-slate-100" title="Move to Trash">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
             </button>
          </div>

          <div class="relative z-10 flex flex-col items-center text-center mt-2">
             <div class="relative group-hover:scale-105 transition-transform duration-300">
               <div class="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-violet-400 to-indigo-500 shadow-lg">
                  <img :src="admin.photoUrl || 'https://ui-avatars.com/api/?background=random&name='+admin.fullName" class="w-full h-full object-cover rounded-full border-2 border-white bg-white" :class="admin.isBlocked ? 'grayscale opacity-70' : ''">
               </div>
             </div>

             <h3 class="font-bold text-lg text-slate-800 mt-4 line-clamp-1">{{ admin.fullName }}</h3>
             <div class="flex flex-col gap-1 mt-1 items-center">
                <p class="text-sm text-slate-500 bg-slate-50 px-3 py-0.5 rounded-full inline-block">Username: {{ admin.username }}</p>
                <a v-if="admin.telegram" :href="getTelegramUrl(admin.telegram)" target="_blank" class="text-xs text-blue-500 hover:text-blue-600 hover:underline flex items-center justify-center gap-1 mt-1 font-medium transition-colors">
                   <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.48-.94-2.4-1.54-1.06-.7-.37-1.09.23-1.72.16-.16 2.87-2.63 2.92-2.85.01-.03.01-.14-.06-.2-.06-.06-.17-.04-.25-.02-.11.02-1.91 1.2-5.39 3.55-.5.34-.95.51-1.35.5-.44-.01-1.29-.25-1.92-.42-.77-.21-1.37-.32-1.31-.68.03-.18.28-.37.76-.56 3.03-1.32 5.06-2.19 6.09-2.62 2.93-1.21 3.53-1.43 3.93-1.43.09 0 .28.01.4.04.1.03.24.1.33.25.08.16.07.32.07.33z"/></svg>
                   Chat Telegram
                </a>
             </div>
             
             <div class="grid grid-cols-2 gap-3 mt-6 w-full">
                <button @click="openEditModal(admin)" class="py-2.5 rounded-xl text-xs font-bold bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-colors border border-slate-200">
                   កែប្រែ
                </button>
                <button 
                   @click="confirmToggleBlock(admin)"
                   class="py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-md active:scale-95"
                   :class="admin.isBlocked ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30' : 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/30'"
                >
                   {{ admin.isBlocked ? 'ដោះសោ' : 'បិទគណនី' }}
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
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-[2rem] bg-white shadow-2xl transition-all relative">
                
                <div class="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600">
                   <div class="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl transform translate-x-10 -translate-y-10"></div>
                   <div class="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-xl transform -translate-x-10 translate-y-10"></div>
                </div>

                <div class="relative px-8 pt-8 pb-6">
                  
                  <button @click="closeModal" class="absolute top-4 right-4 text-white/70 hover:text-white bg-black/10 hover:bg-black/20 rounded-full p-2 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>

                  <h3 class="text-2xl font-bold text-white mb-6 text-center drop-shadow-md">{{ isEditing ? 'កែប្រែព័ត៌មាន' : 'បន្ថែម Admin' }}</h3>

                  <div class="flex justify-center mb-8 relative z-10">
                     <div @click="$refs.fileInput.click()" class="relative group cursor-pointer">
                        <div class="absolute inset-0 bg-white rounded-full opacity-30 animate-ping group-hover:opacity-50"></div>
                        <div class="relative w-28 h-28 rounded-full border-4 border-white shadow-xl bg-slate-50 overflow-hidden flex items-center justify-center">
                           <img v-if="previewImage" :src="previewImage" class="w-full h-full object-cover">
                           <div v-else class="text-indigo-400 flex flex-col items-center">
                              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                           </div>
                        </div>
                        <div class="absolute bottom-1 right-1 bg-violet-600 text-white p-2 rounded-full shadow-lg border-2 border-white group-hover:scale-110 transition-transform">
                           <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        </div>
                        <input ref="fileInput" type="file" class="hidden" accept="image/*" @change="handleFile">
                     </div>
                  </div>

                  <div class="space-y-5">
                     <div class="relative group">
                        <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 pointer-events-none">
                           <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                        </span>
                        <input v-model="form.fullName" type="text" placeholder="ឈ្មោះពេញ (Full Name)" class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-12 py-3.5 text-slate-700 font-medium focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all duration-200 ease-in-out placeholder-slate-400">
                     </div>

                     <div class="relative group">
                        <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 pointer-events-none">
                           <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </span>
                        <input v-model="form.username" type="text" placeholder="Login Username (For Sign In)" class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-12 py-3.5 text-slate-700 font-medium focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all duration-200 ease-in-out placeholder-slate-400">
                     </div>

                     <div class="relative group">
                        <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 pointer-events-none">
                           <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                        </span>
                        <input v-model="form.telegram" type="text" placeholder="Telegram (Username or Link)" class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-12 py-3.5 text-slate-700 font-medium focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all duration-200 ease-in-out placeholder-slate-400">
                     </div>

                     <div class="relative group">
                        <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 pointer-events-none">
                           <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                        </span>
                        <input 
                           v-model="form.password" 
                           :type="showPassword ? 'text' : 'password'" 
                           :placeholder="isEditing ? 'លេខសម្ងាត់ថ្មី (ទុកទំនេរដើម្បីរក្សាចាស់)' : 'ពាក្យសម្ងាត់ (Password)'"
                           class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-12 py-3.5 pr-12 text-slate-700 font-medium focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all duration-200 ease-in-out placeholder-slate-400"
                        >
                        <button type="button" @click="showPassword = !showPassword" class="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-indigo-600 focus:outline-none transition-colors">
                           <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                           <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.05 10.05 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.057 10.057 0 01-1.564 3.029m-5.858-.908a3 3 0 11-4.243-4.243m4.242 4.242L21 21"></path></svg>
                        </button>
                     </div>
                  </div>

                  <div class="pt-6 flex gap-3">
                     <button @click="closeModal" class="flex-1 py-3.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition">បោះបង់</button>
                     <button @click="submitAdmin" :disabled="isSubmitting" class="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                        <svg v-if="isSubmitting" class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        <span>{{ isSubmitting ? 'រក្សាទុក' : (isEditing ? 'កែប្រែ' : 'បង្កើតគណនី') }}</span>
                     </button>
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
                <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full mb-4" :class="confirmModal.type === 'delete' ? 'bg-red-100 text-red-600' : (confirmModal.isBlockAction ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600')">
                   <svg v-if="confirmModal.type === 'delete'" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                   <svg v-else-if="confirmModal.isBlockAction" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                   <svg v-else class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg>
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-2">{{ confirmModal.title }}</h3>
                <p class="text-sm text-gray-500 mb-6">{{ confirmModal.message }}</p>
                <div class="grid grid-cols-2 gap-3">
                   <button @click="confirmModal.show = false" class="py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50">បោះបង់</button>
                   <button @click="executeConfirmation" class="py-2.5 rounded-xl text-white font-bold shadow-lg" :class="confirmModal.type === 'delete' ? 'bg-red-600 hover:bg-red-700' : (confirmModal.isBlockAction ? 'bg-rose-500 hover:bg-rose-600' : 'bg-emerald-500 hover:bg-emerald-600')">
                      យល់ព្រម
                   </button>
                </div>
             </DialogPanel>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { TransitionRoot, TransitionChild, Dialog, DialogPanel } from '@headlessui/vue';
import { db, auth } from '@/firebaseConfig';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import axios from 'axios';
import CustomAlert from '../../components/shared/CustomAlert.vue';

// State
const admins = ref([]);
const isLoading = ref(true);
const showModal = ref(false);
const isSubmitting = ref(false);
const searchQuery = ref('');
const previewImage = ref(null);
const showPassword = ref(false);
const isEditing = ref(false);
const currentAdminId = ref(null);

// Alert State
const alert = reactive({ show: false, title: '', message: '', type: 'success' });
const triggerAlert = (type, title, message) => {
 alert.type = type; alert.title = title; alert.message = message; alert.show = true;
 setTimeout(() => alert.show = false, 3000);
};

const confirmModal = reactive({ show: false, title: '', message: '', targetAdmin: null, isBlockAction: false, type: 'block' });

const form = reactive({ fullName: '', username: '', password: '', telegram: '', file: null });

// Fetch Data (Filter out Soft-Deleted Admins)
onMounted(() => {
 const q = query(
     collection(db, "users"), 
     where("role", "==", "admin"),
     where("isDeleted", "==", false) // ONLY SHOW ACTIVE ADMINS
 );
 onSnapshot(q, (snapshot) => {
  admins.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  isLoading.value = false;
 });
});

const filteredAdmins = computed(() => {
 if (!searchQuery.value) return admins.value;
 return admins.value.filter(a => a.fullName.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

// Helper: Smart Telegram Link
const getTelegramUrl = (input) => {
  if (!input) return '#';
  if (input.startsWith('http') || input.startsWith('t.me')) {
    return input.startsWith('http') ? input : `https://${input}`;
  }
  const cleanUsername = input.replace('@', '');
  return `https://t.me/${cleanUsername}`;
};

// Modal Logic
const openCreateModal = () => {
 isEditing.value = false;
 currentAdminId.value = null;
 Object.assign(form, { fullName: '', username: '', password: '', telegram: '', file: null });
 previewImage.value = null;
 showModal.value = true;
};

const openEditModal = (admin) => {
 isEditing.value = true;
 currentAdminId.value = admin.id;
 Object.assign(form, { 
   fullName: admin.fullName, 
   username: admin.username, 
   password: '', 
   telegram: admin.telegram || '', 
   file: null 
 });
 previewImage.value = admin.photoUrl;
 showModal.value = true;
};

const closeModal = () => {
 showModal.value = false;
 showPassword.value = false;
};

const handleFile = (e) => {
 const file = e.target.files[0];
 if (file) {
  form.file = file;
  previewImage.value = URL.createObjectURL(file);
 }
};

const submitAdmin = async () => {
 if (!auth.currentUser) {
  return triggerAlert('error', 'Authentication Error', 'You must be logged in to perform this action.');
 }

 if (!form.fullName || !form.username || (!isEditing.value && (!form.file || !form.password))) {
   return triggerAlert('error', 'បរាជ័យ', 'សូមបំពេញព័ត៌មានអោយបានគ្រប់គ្រាន់!');
 }

 isSubmitting.value = true;
 const formData = new FormData();
 formData.append('fullName', form.fullName);
 formData.append('username', form.username);
 formData.append('telegram', form.telegram);
 if(form.password) formData.append('password', form.password);
 if(form.file) formData.append('profileImage', form.file);

 try {
  const token = await auth.currentUser.getIdToken(true); 
  const url = isEditing.value 
    ? `https://reportapp-81vf.onrender.com/api/update-admin/${currentAdminId.value}`
    : 'https://reportapp-81vf.onrender.com/api/create-admin';
  
  const method = isEditing.value ? 'put' : 'post';

  const res = await axios({
    method: method,
    url: url,
    data: formData,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });

  if(res.data.success) {
    triggerAlert('success', 'ជោគជ័យ', isEditing.value ? 'បានកែប្រែព័ត៌មាន Admin!' : 'បានបង្កើត Admin ថ្មី!');
    closeModal();
  }
 } catch (e) {
  triggerAlert('error', 'បរាជ័យ', e.response?.data?.error || e.message);
 } finally {
  isSubmitting.value = false;
 }
};

const confirmToggleBlock = (admin) => {
  confirmModal.targetAdmin = admin;
  confirmModal.type = 'block';
  confirmModal.isBlockAction = !admin.isBlocked;
  confirmModal.title = confirmModal.isBlockAction ? 'បិទគណនី?' : 'ដោះសោ?';
  confirmModal.message = `តើអ្នកពិតជាចង់ ${confirmModal.title} សម្រាប់ ${admin.fullName} មែនទេ?`;
  confirmModal.show = true;
};

const confirmDelete = (admin) => {
  confirmModal.targetAdmin = admin;
  confirmModal.type = 'delete';
  confirmModal.title = 'បោះចូលធុងសម្រាម?';
  confirmModal.message = `តើអ្នកពិតជាចង់បោះគណនី ${admin.fullName} ចូលធុងសម្រាមមែនទេ? អ្នកអាចស្តារវាមកវិញបាននៅពេលក្រោយ។`;
  confirmModal.show = true;
};

const executeConfirmation = async () => {
  if(!confirmModal.targetAdmin) return;
  
  try {
    if (confirmModal.type === 'block') {
      await updateDoc(doc(db, "users", confirmModal.targetAdmin.id), { 
        isBlocked: !confirmModal.targetAdmin.isBlocked 
      });
      triggerAlert('success', 'ជោគជ័យ', `គណនីត្រូវបាន ${confirmModal.isBlockAction ? 'បិទ' : 'បើក'}!`);
    } 
    // SOFT DELETE: Move to Trash
    else if (confirmModal.type === 'delete') {
      await updateDoc(doc(db, "users", confirmModal.targetAdmin.id), { 
        isDeleted: true 
      });
      triggerAlert('success', 'ជោគជ័យ', 'គណនីត្រូវបានបោះចូលធុងសម្រាម!');
    }
  } catch (e) {
    triggerAlert('error', 'បរាជ័យ', 'មានបញ្ហាក្នុងការអនុវត្តសកម្មភាព');
    console.error(e);
  } finally {
    confirmModal.show = false;
  }
};
</script>