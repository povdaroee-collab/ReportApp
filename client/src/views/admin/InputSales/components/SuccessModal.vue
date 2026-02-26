<template>
  <TransitionRoot appear :show="show" as="template">
    <Dialog as="div" @close="$emit('close')" class="relative z-[99999]">
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-slate-900/80 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95 translate-y-4" enter-to="opacity-100 scale-100 translate-y-0" leave="duration-200 ease-in" leave-from="opacity-100 scale-100 translate-y-0" leave-to="opacity-0 scale-95 translate-y-4">
            <DialogPanel class="w-full max-w-lg transform overflow-hidden rounded-[2rem] bg-white text-center align-middle shadow-2xl transition-all p-8 flex flex-col items-center">
              
              <div class="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-4 shadow-inner border-[6px] border-emerald-50">
                <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
              </div>
              
              <h3 class="text-2xl font-black text-slate-800 mb-1">ទូទាត់ជោគជ័យ!</h3>
              <p class="text-slate-500 font-bold mb-6 text-sm">ទិន្នន័យលក់ត្រូវបានរក្សាទុកក្នុងប្រព័ន្ធរួចរាល់។</p>

              <div class="w-full grid grid-cols-2 gap-3 mb-6">
                <button @click="$emit('print')" class="col-span-2 py-3 rounded-xl font-black text-sm bg-slate-800 hover:bg-slate-900 text-white shadow-md transition-all active:scale-95 flex justify-center items-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2-2v4h10z"></path></svg>
                  បោះពុម្ពវិក្កយបត្រ (Print)
                </button>

                <button @click="$emit('download-pdf')" class="py-3 rounded-xl font-black text-sm bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition-all active:scale-95 flex flex-col justify-center items-center gap-1">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  រក្សាទុកជា PDF
                </button>

                <button @click="$emit('share-app')" class="py-3 rounded-xl font-black text-sm bg-[#eaf4ff] text-[#0088cc] hover:bg-[#dbeafe] border border-[#bae6fd] transition-all active:scale-95 flex flex-col justify-center items-center gap-1">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.48-.94-2.4-1.54-1.06-.7-.37-1.09.23-1.72.16-.16 2.87-2.63 2.92-2.85.01-.03.01-.14-.06-.2-.06-.06-.17-.04-.25-.02-.11.02-1.91 1.2-5.39 3.55-.5.34-.95.51-1.35.5-.44-.01-1.29-.25-1.92-.42-.77-.21-1.37-.32-1.31-.68.03-.18.28-.37.76-.56 3.03-1.32 5.06-2.19 6.09-2.62 2.93-1.21 3.53-1.43 3.93-1.43.09 0 .28.01.4.04.1.03.24.1.33.25.08.16.07.32.07.33z"/></svg>
                  Share ចូល App
                </button>
                
                <button @click="$emit('send-bot')" :disabled="isSendingToBot" class="col-span-2 py-3 rounded-xl font-black text-sm bg-[#0088cc] hover:bg-[#0077b5] text-white shadow-md shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50 flex justify-center items-center gap-2">
                  <svg v-if="isSendingToBot" class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.48-.94-2.4-1.54-1.06-.7-.37-1.09.23-1.72.16-.16 2.87-2.63 2.92-2.85.01-.03.01-.14-.06-.2-.06-.06-.17-.04-.25-.02-.11.02-1.91 1.2-5.39 3.55-.5.34-.95.51-1.35.5-.44-.01-1.29-.25-1.92-.42-.77-.21-1.37-.32-1.31-.68.03-.18.28-.37.76-.56 3.03-1.32 5.06-2.19 6.09-2.62 2.93-1.21 3.53-1.43 3.93-1.43.09 0 .28.01.4.04.1.03.24.1.33.25.08.16.07.32.07.33z"/></svg>
                  Send ចូល Group (Bot)
                </button>
              </div>

              <button @click="$emit('close')" class="w-full py-3 rounded-xl font-bold text-sm text-slate-400 hover:bg-slate-100 transition-all">
                បិទ (បន្តការលក់ថ្មី)
              </button>

            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
<script setup>
import { TransitionRoot, TransitionChild, Dialog, DialogPanel } from '@headlessui/vue';
defineProps({ show: Boolean, isSendingToBot: Boolean });
defineEmits(['close', 'print', 'download-pdf', 'share-app', 'send-bot']);
</script>