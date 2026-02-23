<template>
  <div class="fixed top-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none pr-4 sm:pr-0">
    <transition-group 
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-x-full opacity-0 blur-sm"
      enter-to-class="translate-x-0 opacity-100 blur-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div 
        v-for="notification in notificationStore.notifications" 
        :key="notification.id"
        class="pointer-events-auto flex w-full max-w-sm overflow-hidden bg-slate-900/90 backdrop-blur-xl rounded-xl border shadow-lg ring-1 transition-all"
        :class="{
          'border-emerald-500/50 shadow-emerald-500/10': notification.type === 'success',
          'border-rose-500/50 shadow-rose-500/10': notification.type === 'error',
          'border-blue-500/50 shadow-blue-500/10': notification.type === 'info'
        }"
      >
        <div class="w-2" :class="{
          'bg-emerald-500': notification.type === 'success',
          'bg-rose-500': notification.type === 'error',
          'bg-blue-500': notification.type === 'info'
        }"></div>
        
        <div class="p-4 flex items-start gap-4">
           <div class="shrink-0 mt-0.5">
              <div v-if="notification.type === 'success'" class="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
              </div>
              <div v-else-if="notification.type === 'error'" class="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-500">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </div>
              <div v-else class="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
           </div>

           <div class="flex-1 pt-0.5">
              <h3 class="font-bold text-white font-khmer text-sm">{{ notification.title }}</h3>
              <p class="text-sm text-slate-300 mt-1 leading-relaxed">{{ notification.message }}</p>
           </div>

           <button @click="notificationStore.remove(notification.id)" class="text-slate-500 hover:text-white transition-colors">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
           </button>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { useNotificationStore } from '../stores/notification'; // ត្រូវប្រាកដថា path ត្រឹមត្រូវ
const notificationStore = useNotificationStore();
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@300;400;700&display=swap');
.font-khmer { font-family: 'Kantumruy Pro', sans-serif; }
</style>