<template>
    <button v-if="cart.length > 0 && !showMobileCart" @click="$emit('open-mobile')" class="md:hidden fixed bottom-6 right-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white w-14 h-14 rounded-full shadow-2xl z-[45] flex items-center justify-center transition-transform active:scale-95 border-2 border-white">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
        <span class="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-bounce-short">{{ cart.length }}</span>
    </button>

    <transition enter-active-class="duration-300 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-show="showMobileCart" @click="$emit('close-mobile')" class="md:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[45]"></div>
    </transition>

    <div 
        :class="showMobileCart ? 'translate-y-0' : 'translate-y-full md:translate-y-0'"
        class="fixed md:static inset-x-0 bottom-0 h-[88vh] md:h-full w-full md:w-[360px] xl:w-[420px] bg-slate-50 md:border-l border-slate-200 shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.3)] md:shadow-[-10px_0_30px_rgba(0,0,0,0.04)] flex flex-col z-[50] md:z-30 transition-transform duration-300 ease-out rounded-t-[2rem] md:rounded-none shrink-0 will-change-transform"
    >
        <div class="p-4 md:p-5 border-b border-slate-200 flex items-center justify-between bg-white shrink-0 shadow-sm z-20 rounded-t-[2rem] md:rounded-none pt-6 md:pt-5 relative">
            <div class="absolute top-2.5 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-slate-200 rounded-full md:hidden"></div>
            <div class="flex flex-col">
                <h2 class="text-lg font-black text-slate-800 flex items-center gap-2"><svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg> កន្ត្រកទំនិញ</h2>
                <div v-if="timeLeft" class="mt-1 flex items-center gap-1 text-[10px] font-black text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-md w-fit animate-pulse"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> ផុតកំណត់ក្នុង: {{ timeLeft }}</div>
            </div>
            <div class="flex items-center gap-3">
                <span class="bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-lg text-[11px] font-black border border-blue-200">{{ cart.length }} មុខ</span>
                <button @click="$emit('close-mobile')" class="md:hidden w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors active:scale-95">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
        </div>

        <div class="flex-1 overflow-y-auto custom-scrollbar p-3 md:p-4 touch-pan-y">
            <div v-if="cart.length === 0" class="h-full flex flex-col items-center justify-center text-slate-400 opacity-60 min-h-[300px]">
                <svg class="w-20 h-20 mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                <p class="font-bold text-sm">មិនទាន់មានទំនិញទេ</p>
                <p class="text-[10px] mt-1">សូមចុចលើទំនិញដើម្បីបញ្ជូល</p>
            </div>
            
            <div v-else class="block pb-16 md:pb-4">
                <div class="space-y-3 mb-4">
                    <div v-for="(item, index) in cart" :key="item.product.id + item.selectedUnit" class="bg-white border border-slate-200 rounded-2xl p-3 md:p-4 shadow-sm flex flex-col relative group hover:border-blue-300 transition-colors">
                        
                        <button @click="$emit('remove', index)" class="absolute -top-2 -right-2 w-7 h-7 bg-white text-rose-500 hover:bg-rose-500 hover:text-white rounded-full flex items-center justify-center shadow-md border border-rose-100 transition-colors z-10"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg></button>
                        
                        <div class="flex justify-between items-start gap-2 mb-2">
                            <div class="flex-1 min-w-0">
                                <h4 class="font-bold text-sm text-slate-800 leading-tight pr-4 line-clamp-2">{{ item.product.name }}</h4>
                                
                                <div class="mt-1 flex items-center gap-2">
                                    <select v-model="item.manualType" @change="$emit('manual-type-change', index, $event)" class="px-2 py-0.5 rounded text-[10px] font-black border outline-none cursor-pointer appearance-none shadow-sm" :class="getBadgeClass(item)">
                                        <option value="auto">ស្វ័យប្រវត្តិ ({{ getAutoCalculatedType(item) }})</option>
                                        <option value="លក់រាយ">លក់រាយ</option>
                                        <option value="លក់បោះដុំ">លក់បោះដុំ</option>
                                    </select>
                                </div>
                            </div>
                            <span class="text-sm md:text-base font-black text-emerald-600 whitespace-nowrap bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100 shrink-0">{{ formatPrice(calculateItemPrice(item), item.product.currency) }}</span>
                        </div>
                        
                        <div class="flex flex-col sm:flex-row flex-wrap items-start sm:items-end justify-between mt-2 pt-2 border-t border-slate-100 gap-3">
                            <div class="flex flex-col gap-2 w-full sm:w-auto flex-1">
                                <div class="relative w-full sm:w-fit">
                                    <select :value="item.selectedUnit" @change="$emit('unit-change', index, $event)" class="w-full appearance-none bg-slate-100/80 border border-slate-200 text-slate-700 py-2 pl-3 pr-8 rounded-xl text-xs font-black focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none cursor-pointer transition-all">
                                        <option value="retail">{{ item.product.isCombo ? 'ឈុត' : translateHardcodedUnit(item.product.retailUnit || 'bottle') + ' (រាយ)' }}</option>
                                        <option v-if="!item.product.isCombo && item.product.itemsPerCase > 1" value="case">{{ translateHardcodedUnit(item.product.unit || 'case') }} (ដុំ)</option>
                                    </select>
                                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></div>
                                </div>
                                <div class="flex items-center gap-2">
                                    <label class="flex items-center gap-1.5 cursor-pointer select-none">
                                        <div class="relative inline-block w-7 h-4 rounded-full transition-colors duration-300" :class="item.isManualPrice ? 'bg-blue-500' : 'bg-slate-300'">
                                            <input type="checkbox" v-model="item.isManualPrice" class="sr-only" @change="$emit('manual-price-toggle', index)">
                                            <span class="absolute left-0.5 top-0.5 bg-white w-3 h-3 rounded-full transition-transform duration-300 shadow-sm" :class="item.isManualPrice ? 'translate-x-3' : 'translate-x-0'"></span>
                                        </div>
                                        <span class="text-[10px] font-bold text-slate-500">កែតម្លៃ</span>
                                    </label>
                                    <div v-if="item.isManualPrice" class="relative w-20 animate-fade-in">
                                        <span class="absolute inset-y-0 left-0 pl-1.5 flex items-center text-[10px] font-black text-blue-600">{{ item.product.currency === 'USD' ? '$' : '៛' }}</span>
                                        <input type="number" v-model.number="item.manualPrice" @change="$emit('update-backend')" step="any" min="0" class="w-full pl-5 pr-1 py-1 bg-blue-50 border border-blue-200 rounded-md text-xs font-black outline-none focus:border-blue-500 focus:bg-white text-blue-700">
                                    </div>
                                    <div v-else class="text-[9px] font-bold text-slate-400">
                                        <span v-if="!item.product.isCombo">១ដប: {{ formatPrice(getSingleBasePrice(item), item.product.currency) }}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="flex items-center justify-end w-full sm:w-auto shrink-0 mt-1 sm:mt-0">
                                <div class="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden h-9 shadow-sm w-[110px]">
                                    <button @click="$emit('update-qty', index, -1)" class="w-10 h-full flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors text-lg font-bold">−</button>
                                    <input v-model="item.inputQty" @change="$emit('commit-qty', index)" @keyup.enter="$event.target.blur()" type="number" min="1" class="w-full h-full bg-white text-center text-sm font-black border-x border-slate-200 outline-none p-0 focus:ring-inner">
                                    <button @click="$emit('update-qty', index, 1)" class="w-10 h-full flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors text-lg font-bold">+</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white p-4 md:p-5 border border-slate-200 shadow-sm rounded-2xl mt-4">
                    <div class="flex justify-between items-end mb-3">
                        <span class="text-xs font-black text-slate-500 uppercase tracking-widest">សរុប (Total)</span>
                        <span class="text-3xl font-black text-emerald-600 leading-none tracking-tight">{{ formatPrice(cartTotalUSD, 'USD') }}</span>
                    </div>
                    <button @click="$emit('checkout')" class="w-full py-3.5 rounded-xl font-black text-[15px] shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg> 
                        បន្តការទូទាត់ប្រាក់
                    </button>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    cart: Array,
    showMobileCart: Boolean,
    timeLeft: String,
    cartTotalUSD: Number,
    getAutoCalculatedType: Function,
    getBadgeClass: Function,
    calculateItemPrice: Function,
    getSingleBasePrice: Function,
    formatPrice: Function,
    translateHardcodedUnit: Function
});
defineEmits(['open-mobile', 'close-mobile', 'remove', 'update-qty', 'commit-qty', 'unit-change', 'manual-price-toggle', 'manual-type-change', 'checkout', 'update-backend']);
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #94a3b8; }
.animate-bounce-short { animation: bounceShort 1s ease-in-out infinite; }
@keyframes bounceShort { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15%); } }
.will-change-transform { will-change: transform; }
input[type="number"]::-webkit-inner-spin-button, input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
input[type="number"] { -moz-appearance: textfield; }
select { -webkit-appearance: none; -moz-appearance: none; }
</style>