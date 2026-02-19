<template>
  <Transition name="fade">
    <div v-if="show" class="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-sm" @click.self="cancel">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-up border border-slate-100">
        
        <div class="p-6 text-center">
            <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-rose-50 mb-5 border-4 border-rose-100">
                <svg class="h-8 w-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </div>
            <h3 class="text-xl font-bold text-slate-800 font-khmer mb-2">{{ title }}</h3>
            <p class="text-sm text-slate-500 font-khmer leading-relaxed">
              {{ message }} <br>
              <span class="text-rose-500 font-bold text-xs mt-1 block">សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ!</span>
            </p>
        </div>

        <div class="bg-slate-50 px-6 py-4 flex gap-3">
            <button @click="cancel" class="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200 font-khmer">
               បោះបង់
            </button>
            <button @click="confirm" class="flex-1 bg-rose-500 text-white font-bold py-2.5 px-4 rounded-xl hover:bg-rose-600 shadow-lg shadow-rose-500/30 transition-all transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-rose-500 font-khmer">
               លុបចេញ
            </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref } from 'vue';

const show = ref(false);
const title = ref('');
const message = ref('');
let resolvePromise;
let rejectPromise;

const open = (titleText, messageText) => {
    title.value = titleText;
    message.value = messageText;
    show.value = true;
    return new Promise((resolve, reject) => {
        resolvePromise = resolve;
        rejectPromise = reject;
    });
};

const confirm = () => {
    show.value = false;
    resolvePromise(true);
};

const cancel = () => {
    show.value = false;
    resolvePromise(false);
};

defineExpose({ open });
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@300;400;700&display=swap');
.font-khmer { font-family: 'Kantumruy Pro', sans-serif; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.animate-scale-up { animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes scaleUp {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
}
</style>