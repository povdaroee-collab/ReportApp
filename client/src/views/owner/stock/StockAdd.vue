<template>
    <div class="max-w-4xl mx-auto animate-fade-in">
        <div class="bg-neutral-800/50 border border-neutral-700/50 rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-sm min-h-[400px] flex flex-col justify-center">
            
            <div v-if="duplicateDetected" class="w-full flex flex-col items-center justify-center text-center py-10 animate-slide-up">
                <div class="w-24 h-24 bg-amber-500/10 text-amber-400 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(245,158,11,0.15)] border border-amber-500/30">
                    <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                
                <h3 class="text-2xl md:text-3xl font-black text-amber-400 mb-4 tracking-tight">ទំនិញនេះមានក្នុងប្រព័ន្ធរួចហើយ!</h3>
                <p class="text-neutral-300 text-sm md:text-base max-w-lg mx-auto mb-10 leading-relaxed font-bold">
                    ឈ្មោះផលិតផល <strong class="text-white bg-neutral-800 px-3 py-1.5 rounded-lg mx-1 border border-neutral-600">"{{ modelValue.name }}"</strong> មានរួចហើយ។ អ្នកមិនអាចបង្កើតថ្មី ឬកែប្រែនៅទីនេះបានទេ។ <br><br>
                    <span class="text-neutral-400">សូមចូលទៅកាន់ផ្ទាំង <span class="text-amber-400 underline decoration-amber-500/50 underline-offset-4">"នាំចូល/ដកចេញ"</span> ដើម្បីបន្ថែមចំនួនស្តុកពីលើ។</span>
                </p>

                <div class="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                    <button @click="$emit('reset')" type="button" class="flex-1 px-6 py-4 rounded-xl border-2 border-neutral-600 text-neutral-300 hover:text-white hover:bg-neutral-700 font-bold transition-all flex items-center justify-center gap-2 shadow-sm">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                        ថយក្រោយ
                    </button>
                    <button @click="$emit('go-to-stock-in')" type="button" class="flex-1 px-6 py-4 bg-gradient-to-r from-amber-400 to-yellow-600 hover:from-amber-500 hover:to-yellow-700 text-neutral-900 font-black rounded-xl transition-all shadow-lg shadow-amber-500/20 transform active:scale-95 flex items-center justify-center gap-2">
                        ទៅបញ្ជូលស្តុក
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                    </button>
                </div>
            </div>

            <form v-else @submit.prevent="handleSave" class="space-y-6 animate-fade-in">
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="col-span-1">
                        <label class="block text-xs font-bold text-amber-500 mb-2 uppercase tracking-wider">រូបភាពផលិតផល (*)</label>
                        <div 
                            class="relative h-48 w-full rounded-xl border-2 border-dashed border-neutral-600 hover:border-amber-400 transition-colors flex flex-col items-center justify-center cursor-pointer bg-neutral-800 group overflow-hidden shadow-inner"
                            @click="triggerFileInput"
                        >
                            <img v-if="modelValue.imagePreview" :src="modelValue.imagePreview" class="absolute inset-0 w-full h-full object-cover">
                            <div v-else class="text-center p-4 group-hover:scale-105 transition-transform">
                                <div class="text-4xl mb-2">📷</div>
                                <span class="text-xs text-neutral-400 font-bold">ចុចដើម្បី Upload (Max 1.5MB)</span>
                            </div>
                            <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="onImageUpload">
                        </div>
                    </div>

                    <div class="col-span-1 md:col-span-2 space-y-5">
                        <div>
                            <label class="block text-xs font-bold text-neutral-400 mb-1.5">ឈ្មោះផលិតផល (វាយឈ្មោះដើម្បីពិនិត្យ)</label>
                            <input 
                                v-model="modelValue.name" 
                                type="text" 
                                required 
                                class="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3.5 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-white font-bold transition-all shadow-inner" 
                                placeholder="ឧទាហរណ៍: Coca Cola..."
                            >
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-neutral-400 mb-1.5">Barcode (បង្កើតដោយប្រព័ន្ធ)</label>
                            <div class="relative">
                                <input :value="modelValue.barcode" type="text" readonly class="w-full bg-neutral-900/50 border border-neutral-700/50 rounded-xl px-4 py-3.5 text-amber-500/70 font-mono font-black tracking-widest cursor-not-allowed shadow-inner">
                                <span class="absolute right-4 top-3.5 text-lg opacity-50">🔒</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="h-px bg-neutral-700/50 my-8"></div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="block text-xs font-bold text-neutral-400 mb-1.5">ខ្នាត (Unit)</label>
                        <select v-model="modelValue.unit" class="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3.5 text-white font-bold focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none shadow-inner cursor-pointer appearance-none">
                            <option value="bottle">ដប (Bottle)</option>
                            <option value="pack">កញ្ចប់ (Pack)</option>
                            <option value="case">កេះ (Case)</option>
                            <option value="can">កំប៉ុង (Can)</option>
                            <option value="kg">គីឡូ (Kg)</option>
                        </select>
                    </div>

                    <div v-if="modelValue.unit === 'case'" class="animate-slide-down">
                        <label class="block text-xs font-bold text-amber-400 mb-1.5">ចំនួនរាយក្នុង ១ កេះ</label>
                        <div class="flex gap-2">
                            <input v-model.number="modelValue.itemsPerCase" type="number" min="1" class="flex-1 bg-neutral-900 border border-amber-500/50 rounded-xl px-4 py-3.5 text-white font-bold focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none shadow-inner">
                            <div class="flex items-center px-4 bg-neutral-800 border border-neutral-700 rounded-xl text-sm font-bold text-neutral-300">
                                ដប/កញ្ចប់
                            </div>
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-neutral-400 mb-1.5">ចំនួនស្តុកបច្ចុប្បន្ន (ចំនួនដំបូង)</label>
                        <input v-model.number="modelValue.quantity" type="number" min="0" step="0.01" required class="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3.5 text-white font-bold focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none shadow-inner">
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div>
                        <label class="block text-[11px] font-black text-emerald-400 mb-1.5 flex items-center gap-2 uppercase tracking-wider">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                            កាលបរិច្ឆេទផលិត (MFG Date) <span class="text-neutral-500 lowercase">- អាចរំលង</span>
                        </label>
                        <input 
                            v-model="modelValue.mfgDate" 
                            type="date" 
                            class="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3.5 text-sm font-bold text-neutral-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all cursor-pointer shadow-inner"
                        >
                    </div>

                    <div>
                        <label class="block text-[11px] font-black text-rose-400 mb-1.5 flex items-center gap-2 uppercase tracking-wider">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            កាលបរិច្ឆេទផុតកំណត់ (EXP Date) <span class="text-neutral-500 lowercase">- អាចរំលង</span>
                        </label>
                        <input 
                            v-model="modelValue.expDate" 
                            type="date" 
                            class="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3.5 text-sm font-bold text-neutral-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all cursor-pointer shadow-inner"
                        >
                    </div>
                </div>

                <div class="bg-neutral-900/40 p-5 md:p-6 rounded-[20px] border border-neutral-700 mt-8 shadow-inner">
                    <h3 class="text-amber-500 font-black mb-5 flex items-center gap-2 text-sm uppercase tracking-wider">
                        💰 ព័ត៌មានតម្លៃទិញចូល (Cost Price)
                    </h3>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div class="space-y-5">
                            <div class="flex gap-6 bg-neutral-800 p-2 rounded-xl w-fit border border-neutral-700/50">
                                <label class="flex items-center gap-2 cursor-pointer px-2">
                                    <input type="radio" v-model="modelValue.currency" value="USD" class="accent-amber-500 w-5 h-5 cursor-pointer">
                                    <span class="text-sm font-bold text-neutral-200">ប្រាក់ដុល្លារ ($)</span>
                                </label>
                                <div class="w-px h-6 bg-neutral-700"></div>
                                <label class="flex items-center gap-2 cursor-pointer px-2">
                                    <input type="radio" v-model="modelValue.currency" value="KHR" class="accent-amber-500 w-5 h-5 cursor-pointer">
                                    <span class="text-sm font-bold text-neutral-200">ប្រាក់រៀល (៛)</span>
                                </label>
                            </div>

                            <div class="flex flex-col gap-2.5">
                                <label class="text-xs font-bold text-neutral-400">ជម្រើសបញ្ចូលតម្លៃ៖</label>
                                <div class="flex gap-2 bg-neutral-800 p-1.5 rounded-xl w-fit border border-neutral-700/50">
                                    <button type="button" @click="modelValue.costMode = 'total'" :class="modelValue.costMode === 'total' ? 'bg-neutral-600 text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200'" class="px-4 py-2 rounded-lg text-xs font-bold transition-all">បញ្ចូលតម្លៃសរុប</button>
                                    <button type="button" @click="modelValue.costMode = 'unit'" :class="modelValue.costMode === 'unit' ? 'bg-neutral-600 text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200'" class="px-4 py-2 rounded-lg text-xs font-bold transition-all">បញ្ចូលតម្លៃក្នុង ១ ឯកតា</button>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-neutral-400 mb-2">
                                {{ modelValue.costMode === 'total' ? 'តម្លៃទិញចូលសរុបទាំងអស់' : `តម្លៃទិញចូលក្នុង ១ ${translateUnit(modelValue.unit)}` }}
                            </label>
                            <div class="relative">
                                <div class="absolute left-4 top-3.5 text-amber-500 font-black text-lg">
                                    {{ modelValue.currency === 'USD' ? '$' : '៛' }}
                                </div>
                                <input v-model.number="modelValue.inputCost" type="number" step="0.01" required class="w-full bg-neutral-800 border border-neutral-600 rounded-xl pl-10 pr-4 py-3.5 text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none font-black text-xl shadow-inner">
                            </div>
                            
                            <div class="mt-3 text-xs font-bold text-neutral-400 bg-neutral-800/80 p-3 rounded-xl border border-neutral-700/50 flex justify-between items-center">
                                <div v-if="modelValue.costMode === 'total'">
                                    ធ្លាក់ថ្លៃដើម៖ <span class="text-emerald-400 font-black text-sm ml-1">{{ calculateUnitCost }}</span> / {{ translateUnit(modelValue.unit) }}
                                </div>
                                <div v-else>
                                    តម្លៃសរុប៖ <span class="text-emerald-400 font-black text-sm ml-1">{{ calculateTotalCost }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col sm:flex-row gap-4 pt-6">
                    <button type="button" @click="$emit('reset')" class="flex-1 px-6 py-4 rounded-xl border-2 border-neutral-600 text-neutral-300 hover:text-white hover:bg-neutral-700 font-bold transition-all text-sm uppercase tracking-wider">
                        សម្អាត
                    </button>
                    <button type="submit" :disabled="isSaving" class="flex-[2] px-6 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-600 text-black font-black text-base shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:scale-[1.02] transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2">
                        <span v-if="isSaving" class="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full"></span>
                        {{ isEditing ? 'រក្សាទុកការកែប្រែ' : 'រក្សាទុកស្តុក' }}
                    </button>
                </div>

            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
    modelValue: Object,
    isEditing: Boolean,
    duplicateDetected: Boolean,
    isSaving: Boolean
});

// Event អនុញ្ញាតឱ្យរត់ទៅ Tab 'inout'
const emit = defineEmits(['update:modelValue', 'save', 'reset', 'image-upload', 'go-to-stock-in']);

const fileInput = ref(null);

const triggerFileInput = () => { fileInput.value.click(); };

const onImageUpload = (e) => { emit('image-upload', e); };

const handleSave = () => { emit('save'); };

const translateUnit = (unit) => {
    const map = { bottle: 'ដប', case: 'កេះ', pack: 'កញ្ចប់', can: 'កំប៉ុង', kg: 'គីឡូ' };
    return map[unit] || unit;
};

const calculateUnitCost = computed(() => {
    if (props.modelValue.quantity <= 0) return 0;
    if (props.modelValue.costMode === 'total') {
        return (props.modelValue.inputCost / props.modelValue.quantity).toFixed(2) + (props.modelValue.currency === 'USD' ? ' $' : ' ៛');
    }
    return props.modelValue.inputCost + (props.modelValue.currency === 'USD' ? ' $' : ' ៛');
});

const calculateTotalCost = computed(() => {
    if (props.modelValue.costMode === 'unit') {
        return (props.modelValue.inputCost * props.modelValue.quantity).toLocaleString() + (props.modelValue.currency === 'USD' ? ' $' : ' ៛');
    }
    return props.modelValue.inputCost.toLocaleString() + (props.modelValue.currency === 'USD' ? ' $' : ' ៛');
});
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

.animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }

.animate-slide-down { animation: slideDown 0.3s ease-out; transform-origin: top; }
@keyframes slideDown { from { opacity: 0; transform: scaleY(0); } to { opacity: 1; transform: scaleY(1); } }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: scale(0.98); }
</style>