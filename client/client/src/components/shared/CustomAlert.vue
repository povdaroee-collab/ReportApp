<template>
  <Transition name="slide-fade">
    <div v-if="show" class="fixed top-6 right-6 z-[9999] max-w-sm w-full pointer-events-none">
      <div 
        class="relative overflow-hidden rounded-2xl shadow-2xl backdrop-blur-xl border border-white/10 p-4 flex items-start gap-4 pointer-events-auto"
        :class="bgClass"
      >
        <div class="absolute -top-10 -left-10 w-20 h-20 rounded-full blur-2xl opacity-40 bg-white"></div>

        <div class="flex-shrink-0 mt-1">
          <div v-if="type === 'success'" class="w-8 h-8 rounded-full bg-green-400/20 flex items-center justify-center text-green-400 border border-green-400/30 shadow-[0_0_10px_rgba(74,222,128,0.4)]">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
          </div>
          <div v-else class="w-8 h-8 rounded-full bg-red-400/20 flex items-center justify-center text-red-400 border border-red-400/30 shadow-[0_0_10px_rgba(248,113,113,0.4)]">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </div>
        </div>

        <div class="flex-1 pt-0.5">
          <h3 class="font-bold font-khmer text-white text-lg leading-tight">{{ title }}</h3>
          <p class="text-white/70 text-sm font-khmer mt-1 leading-relaxed">{{ message }}</p>
        </div>

        <button @click="$emit('close')" class="text-white/40 hover:text-white transition-colors">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>

        <div class="absolute bottom-0 left-0 h-1 bg-white/20 w-full">
          <div class="h-full bg-white/80 animate-progress origin-left"></div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  show: Boolean,
  title: String,
  message: String,
  type: { type: String, default: 'success' }
});

const emit = defineEmits(['close']);

const bgClass = computed(() => {
  return props.type === 'success' 
    ? 'bg-gradient-to-br from-green-900/90 to-emerald-900/90' 
    : 'bg-gradient-to-br from-red-900/90 to-pink-900/90';
});
</script>

<style scoped>
.font-khmer { font-family: 'Kantumruy Pro', sans-serif; }

/* Slide Animation */
.slide-fade-enter-active { transition: all 0.4s ease-out; }
.slide-fade-leave-active { transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1); }
.slide-fade-enter-from, .slide-fade-leave-to { transform: translateX(20px); opacity: 0; }

/* Progress Bar Animation */
.animate-progress { animation: progress 3s linear forwards; }
@keyframes progress { from { width: 100%; } to { width: 0%; } }
</style>