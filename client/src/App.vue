<script setup>
import { useRegisterSW } from 'virtual:pwa-register/vue'

// 🌟 មុខងារចាប់យក Update ថ្មីពី PWA 🌟
const {
  needRefresh,
  updateServiceWorker,
} = useRegisterSW({
  // 🌟 បញ្ជាក់ផ្លូវទៅកាន់ sw.js ឱ្យប្រាកដ 🌟
  immediate: true,
  onRegistered(r) {
    if (r) {
      // ឆែករក Update ថ្មីរៀងរាល់ ១ ម៉ោងម្តង
      setInterval(() => {
        r.update()
      }, 60 * 60 * 1000)
    }
  },
  onRegisterError(error) {
    console.error('PWA registration error:', error); // ជួយប្រាប់ Error ក្នុង Console បើវា Fail
  }
})

// ពេលចុច Update
const handleUpdate = async () => {
  // ប្រាប់ Service Worker ឱ្យ Update និង Reload ទំព័រ
  await updateServiceWorker(true);
}

const closeUpdate = () => {
  needRefresh.value = false
}
</script>

<template>
  <router-view />

  <transition 
    enter-active-class="duration-400 ease-out" 
    enter-from-class="opacity-0 scale-95" 
    enter-to-class="opacity-100 scale-100" 
    leave-active-class="duration-300 ease-in" 
    leave-from-class="opacity-100 scale-100" 
    leave-to-class="opacity-0 scale-95"
  >
    <div v-if="needRefresh" class="fixed inset-0 z-[9999999] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm font-khmer">
      
      <div class="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl relative overflow-hidden animate-fade-in-up text-center border border-white/20">
        
        <div class="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/30">
          <svg class="w-10 h-10 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
        </div>

        <h3 class="text-2xl font-black text-slate-800 mb-2">កំណែអាប់ដេតថ្មី!</h3>
        <p class="text-sm font-bold text-slate-500 mb-6 leading-relaxed">
          ប្រព័ន្ធទើបតែបានបញ្ចេញកំណែថ្មី ដើម្បីធ្វើឱ្យការប្រើប្រាស់កាន់តែរលូន និងមានសុវត្ថិភាពជាងមុន។
        </p>

        <div class="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-5 text-left mb-8">
          <p class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-3 flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
            មុខងារថ្មីៗរួមមាន៖
          </p>
          <ul class="space-y-2.5 text-sm font-bold text-slate-700">
            <li class="flex items-start gap-2.5">
              <svg class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
              <span>បន្ថែមឈុតមុខ DR+ ថ្មី</span>
            </li>
            <li class="flex items-start gap-2.5">
              <svg class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
              <span>បញ្ជូលទំនិញថ្មី និងកំណត់តម្លៃលក់ចេញ</span>
            </li>
            <li class="flex items-start gap-2.5">
              <svg class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
              <span>Update ការបញ្ចូលទិន្នន័យលក់ fixed ឈុត ថ្មីបន់បែនច្រើន មានលក្ខខ័ណ្ឌស្មុគ្រស្មាញ</span>
            </li>
            <li class="flex items-start gap-2.5">
              <svg class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
              <span>Update ការគ្រប់គ្រង stock</span>
            </li>
          </ul>
        </div>

        <div class="flex gap-3">
          <button @click="handleUpdate" class="flex-[1.5] bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3.5 rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex justify-center items-center gap-2 active:scale-95 text-sm">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            អាប់ដេតឥឡូវនេះ
          </button>
        </div>

      </div>
    </div>
  </transition>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Battambong:wght@400;700;900&family=Kantumruy+Pro:wght@400;700;900&display=swap');
.font-khmer { font-family: 'Kantumruy Pro', 'Battambong', sans-serif; }
.animate-fade-in-up { animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
</style>