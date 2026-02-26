<template>
    <div class="max-w-4xl mx-auto animate-fade-in">
        <div class="bg-neutral-800/50 border border-neutral-700/50 rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-sm">
            
            <transition name="fade">
                <div v-if="duplicateDetected" class="mb-6 p-4 bg-amber-900/30 border border-amber-500/50 rounded-xl flex items-center gap-3 text-amber-200">
                    <div class="p-2 bg-amber-500/20 rounded-full">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                        <p class="font-bold text-sm">ផលិតផលនេះមានក្នុងប្រព័ន្ធរួចហើយ!</p>
                        <p class="text-xs opacity-80">ប្រព័ន្ធបានទាញទិន្នន័យចាស់មកបង្ហាញដើម្បីធ្វើបច្ចុប្បន្នភាព (Update)។ Barcode នៅដដែល។</p>
                    </div>
                </div>
            </transition>

            <form @submit.prevent="handleSave" class="space-y-6">
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="col-span-1">
                        <label class="block text-xs font-bold text-amber-500 mb-2 uppercase tracking-wider">រូបភាពផលិតផល (*)</label>
                        <div 
                            class="relative h-48 w-full rounded-xl border-2 border-dashed border-neutral-600 hover:border-amber-400 transition-colors flex flex-col items-center justify-center cursor-pointer bg-neutral-800 group overflow-hidden"
                            @click="triggerFileInput"
                        >
                            <img v-if="modelValue.imagePreview" :src="modelValue.imagePreview" class="absolute inset-0 w-full h-full object-cover">
                            <div v-else class="text-center p-4 group-hover:scale-105 transition-transform">
                                <div class="text-4xl mb-2">📷</div>
                                <span class="text-xs text-neutral-400">ចុចដើម្បី Upload (Max 1.5MB)</span>
                            </div>
                            <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="onImageUpload">
                        </div>
                    </div>

                    <div class="col-span-1 md:col-span-2 space-y-5">
                        <div>
                            <label class="block text-xs text-neutral-400 mb-1">ឈ្មោះផលិតផល (វាយឈ្មោះដើម្បីពិនិត្យ)</label>
                            <input 
                                v-model="modelValue.name" 
                                type="text" 
                                required 
                                class="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none text-white transition-all" 
                                placeholder="ឧទាហរណ៍: Coca Cola..."
                            >
                        </div>
                        <div>
                            <label class="block text-xs text-neutral-400 mb-1">Barcode (បង្កើតដោយប្រព័ន្ធ)</label>
                            <div class="relative">
                                <input :value="modelValue.barcode" type="text" readonly class="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-3 text-amber-400 font-mono font-bold tracking-widest cursor-not-allowed">
                                <span class="absolute right-3 top-3 text-lg">🔒</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="h-px bg-neutral-700 my-6"></div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="block text-xs text-neutral-400 mb-1">ខ្នាត (Unit)</label>
                        <select v-model="modelValue.unit" class="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:border-amber-500 outline-none">
                            <option value="bottle">ដប (Bottle)</option>
                            <option value="pack">កញ្ចប់ (Pack)</option>
                            <option value="case">កេះ (Case)</option>
                            <option value="can">កំប៉ុង (Can)</option>
                            <option value="kg">គីឡូ (Kg)</option>
                        </select>
                    </div>

                    <div v-if="modelValue.unit === 'case'" class="animate-slide-down">
                        <label class="block text-xs text-amber-400 mb-1">ចំនួនរាយក្នុង ១ កេះ</label>
                        <div class="flex gap-2">
                            <input v-model.number="modelValue.itemsPerCase" type="number" min="1" class="flex-1 bg-neutral-900 border border-amber-500/50 rounded-lg px-4 py-3 text-white focus:border-amber-500 outline-none">
                            <div class="flex items-center px-3 bg-neutral-800 border border-neutral-700 rounded-lg text-sm">
                                ដប/កញ្ចប់
                            </div>
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs text-neutral-400 mb-1">ចំនួនស្តុកបច្ចុប្បន្ន</label>
                        <input v-model.number="modelValue.quantity" type="number" min="0" step="0.01" required class="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:border-amber-500 outline-none">
                    </div>
                </div>

                <div class="bg-neutral-900/50 p-5 rounded-xl border border-neutral-700">
                    <h3 class="text-amber-500 font-bold mb-4 flex items-center gap-2">
                        💰 ព័ត៌មានតម្លៃទិញចូល (Cost Price)
                    </h3>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-4">
                            <div class="flex gap-4">
                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" v-model="modelValue.currency" value="USD" class="accent-amber-500 w-5 h-5">
                                    <span class="text-sm">ប្រាក់ដុល្លារ ($)</span>
                                </label>
                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" v-model="modelValue.currency" value="KHR" class="accent-amber-500 w-5 h-5">
                                    <span class="text-sm">ប្រាក់រៀល (៛)</span>
                                </label>
                            </div>

                            <div class="flex flex-col gap-2">
                                <label class="text-xs text-neutral-400">ជម្រើសបញ្ចូលតម្លៃ៖</label>
                                <div class="flex gap-2 bg-neutral-800 p-1 rounded-lg w-fit">
                                    <button type="button" @click="modelValue.costMode = 'total'" :class="modelValue.costMode === 'total' ? 'bg-neutral-600 text-white' : 'text-neutral-400'" class="px-3 py-1.5 rounded text-xs transition-all">បញ្ចូលតម្លៃសរុប</button>
                                    <button type="button" @click="modelValue.costMode = 'unit'" :class="modelValue.costMode === 'unit' ? 'bg-neutral-600 text-white' : 'text-neutral-400'" class="px-3 py-1.5 rounded text-xs transition-all">បញ្ចូលតម្លៃក្នុង ១ ឯកតា</button>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label class="block text-xs text-neutral-400 mb-1">
                                {{ modelValue.costMode === 'total' ? 'តម្លៃទិញចូលសរុបទាំងអស់' : `តម្លៃទិញចូលក្នុង ១ ${translateUnit(modelValue.unit)}` }}
                            </label>
                            <div class="relative">
                                <div class="absolute left-4 top-3 text-amber-500 font-bold">
                                    {{ modelValue.currency === 'USD' ? '$' : '៛' }}
                                </div>
                                <input v-model.number="modelValue.inputCost" type="number" step="0.01" required class="w-full bg-neutral-800 border border-neutral-600 rounded-lg pl-8 pr-4 py-3 text-white focus:border-amber-500 outline-none font-bold text-lg">
                            </div>
                            
                            <div class="mt-2 text-xs text-neutral-400 bg-neutral-800 p-2 rounded border border-neutral-700/50">
                                <div v-if="modelValue.costMode === 'total'">
                                    ធ្លាក់ថ្លៃដើម៖ <span class="text-emerald-400 font-bold">{{ calculateUnitCost }}</span> / {{ translateUnit(modelValue.unit) }}
                                </div>
                                <div v-else>
                                    តម្លៃសរុប៖ <span class="text-emerald-400 font-bold">{{ calculateTotalCost }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex gap-4 pt-4">
                    <button type="button" @click="$emit('reset')" class="flex-1 px-6 py-3 rounded-xl border border-neutral-600 text-neutral-300 hover:bg-neutral-800 font-bold transition-all">
                        សម្អាត
                    </button>
                    <button type="submit" :disabled="isSaving" class="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-600 text-black font-black text-lg shadow-lg hover:shadow-amber-500/40 hover:scale-[1.02] transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2">
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

const emit = defineEmits(['update:modelValue', 'save', 'reset', 'image-upload']);

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