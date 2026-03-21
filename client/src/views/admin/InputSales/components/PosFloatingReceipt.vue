<template>
  <div 
      v-show="show"
      class="fixed z-[99999] w-[320px] md:w-[340px] bg-slate-900 rounded-2xl shadow-[0_15px_50px_-12px_rgba(0,0,0,0.5)] border border-slate-700 font-khmer flex flex-col overflow-hidden antialiased will-change-transform"
      :style="{ left: `${position.x}px`, top: `${position.y}px` }"
      :class="{ 'opacity-90 scale-[1.02] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)]': isDragging, 'transition-all duration-200': !isDragging }"
  >
      <div 
          @mousedown="startDrag" 
          @touchstart.passive="startDrag"
          class="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700 p-3.5 flex items-center justify-between cursor-move select-none shrink-0"
          title="ចុចសង្កត់ដើម្បីអូស"
      >
          <div class="flex items-center gap-2 pointer-events-none text-teal-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17h6m-6-4h6m-6-4h6M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"/></svg>
              <h3 class="text-[13px] font-bold tracking-wide text-white">វិក្កយបត្របណ្ដោះអាសន្ន</h3>
          </div>
          
          <div class="flex items-center gap-3">
              <span class="flex h-2.5 w-2.5 relative">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
              </span>
              
              <button @click.stop="$emit('close')" class="text-slate-400 hover:text-rose-500 transition-colors p-1" title="បិទវិក្កយបត្រ">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
          </div>
      </div>

      <div class="p-0 bg-slate-900 flex-1 overflow-y-auto custom-scrollbar max-h-[50vh] min-h-[150px]">
          
          <div v-if="cart.length === 0" class="h-full flex flex-col items-center justify-center text-slate-500 py-12">
              <div class="w-14 h-14 bg-slate-800 rounded-full flex items-center justify-center mb-3 border border-slate-700">
                  <svg class="w-7 h-7 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
              </div>
              <p class="text-[12px] font-bold text-slate-400">មិនទាន់មានទំនិញទេ</p>
          </div>

          <div v-else class="px-4 py-2">
              <div v-for="(item, index) in cart" :key="index" class="py-3 border-b border-slate-800 last:border-0">
                  <div class="flex justify-between items-start gap-3 mb-1.5">
                      <div class="flex-1 min-w-0">
                          <h4 class="text-[13px] font-bold leading-snug break-words" :class="item.manualType === 'ថែមជូន' ? 'text-amber-400 font-black' : 'text-slate-200'">
                              {{ index + 1 }}. {{ item.product.name }}
                          </h4>
                      </div>
                      <div class="text-[14px] font-black shrink-0 text-right" :class="item.manualType === 'ថែមជូន' ? 'text-amber-500' : 'text-white'">
                          {{ formatPrice(calculateItemPrice(item), item.product.currency) }}
                      </div>
                  </div>
                  
                  <div class="flex justify-between items-center pl-3">
                      <div class="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                          <span class="font-black text-teal-400">{{ item.inputQty }}</span> 
                          <span>{{ translateRetailUnit(item.product) }}</span>
                          <span class="text-[9px] text-slate-500 mx-0.5">x</span>
                          <span class="font-mono font-bold">{{ formatPrice(getSingleBasePrice(item), item.product.currency) }}</span>
                      </div>
                      
                      <div class="flex items-center gap-1.5">
                          <span v-if="item.manualType === 'ថែមជូន'" class="bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border border-amber-500/30">Free</span>
                          <span v-if="item.isManualPrice && item.manualType !== 'ថែមជូន'" class="bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded text-[9px] font-bold border border-indigo-500/30">កែតម្លៃ</span>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      <div class="p-4 bg-slate-800/80 border-t border-slate-700 shrink-0 relative">
          <div class="absolute -top-1.5 left-0 right-0 h-3 bg-repeat-x" style="background-image: radial-gradient(circle at 50% 0, transparent 0, transparent 3px, #1E293B 4px); background-size: 10px 10px;"></div>

          <div class="flex justify-between items-center mb-1.5 pt-1">
              <span class="text-[11px] font-bold text-slate-400 tracking-wider">បរិមាណទំនិញ:</span>
              <span class="text-[12px] font-bold text-white bg-slate-700 border border-slate-600 px-2 py-0.5 rounded">{{ cart.length }} មុខ</span>
          </div>
          <div class="flex justify-between items-end pt-2 mt-1 border-t border-dashed border-slate-600">
              <span class="text-[13px] font-bold text-slate-300 tracking-wider mb-0.5">សរុបទឹកប្រាក់:</span>
              <span class="text-[24px] font-black text-teal-400 leading-none tracking-tight drop-shadow-[0_0_10px_rgba(45,212,191,0.4)]">{{ formatPrice(cartTotalUSD, 'USD') }}</span>
          </div>
      </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps({
show: Boolean,
cart: Array,
cartTotalUSD: Number,
calculateItemPrice: Function,
getSingleBasePrice: Function,
formatPrice: Function,
translateRetailUnit: Function
});

defineEmits(['close']);

// --- DRAGGABLE LOGIC ---
const position = ref({ x: 0, y: 0 });
const isDragging = ref(false);

let startX = 0;
let startY = 0;
let initialX = 0;
let initialY = 0;

const centerReceipt = () => {
const receiptWidth = window.innerWidth < 768 ? 320 : 340;
const receiptHeight = 400; // approximate
// Default position: Right side of the screen
position.value.x = Math.max(20, window.innerWidth - receiptWidth - 30);
position.value.y = Math.max(20, (window.innerHeight - receiptHeight) / 2);
};

watch(() => props.show, (newVal) => {
if (newVal && position.value.x === 0 && position.value.y === 0) {
    centerReceipt();
}
});

onMounted(() => {
if (props.show) centerReceipt();
window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
window.removeEventListener('resize', handleResize);
});

const handleResize = () => {
const receiptWidth = window.innerWidth < 768 ? 320 : 340;
const maxX = window.innerWidth - receiptWidth;
const maxY = window.innerHeight - 100;

if (position.value.x > maxX) position.value.x = Math.max(0, maxX);
if (position.value.y > maxY) position.value.y = Math.max(0, maxY);
};

const startDrag = (e) => {
isDragging.value = true;
const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;

startX = clientX;
startY = clientY;
initialX = position.value.x;
initialY = position.value.y;

document.addEventListener('mousemove', onDrag);
document.addEventListener('mouseup', stopDrag);
document.addEventListener('touchmove', onDrag, { passive: false });
document.addEventListener('touchend', stopDrag);
};

const onDrag = (e) => {
if (!isDragging.value) return;
if (e.type === 'touchmove') e.preventDefault(); 

const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;

const dx = clientX - startX;
const dy = clientY - startY;

const receiptWidth = window.innerWidth < 768 ? 320 : 340;
const maxX = window.innerWidth - receiptWidth;
const maxY = window.innerHeight - 50;

let newX = initialX + dx;
let newY = initialY + dy;

position.value.x = Math.max(0, Math.min(newX, maxX));
position.value.y = Math.max(0, Math.min(newY, maxY));
};

const stopDrag = () => {
isDragging.value = false;
document.removeEventListener('mousemove', onDrag);
document.removeEventListener('mouseup', stopDrag);
document.removeEventListener('touchmove', onDrag);
document.removeEventListener('touchend', stopDrag);
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;600;700&family=Battambang:wght@400;700;900&display=swap');

.font-khmer { 
    font-family: 'Kantumruy Pro', 'Battambang', sans-serif; 
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
}

.custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #475569; border-radius: 10px; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #64748b; }
</style>