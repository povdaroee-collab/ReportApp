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
              
              <div class="bg-neutral-900/50 p-4 rounded-2xl border border-neutral-700 mb-6">
                  <label class="block text-xs font-bold text-amber-500 mb-3 uppercase tracking-wider">📦 ប្រភេទទំនិញ (Category)</label>
                  <div class="flex flex-wrap gap-2">
                      <button 
                          v-for="cat in categories" :key="cat"
                          type="button"
                          @click="selectCategory(cat)"
                          :class="modelValue.category === cat ? 'bg-amber-500 text-neutral-900 shadow-md shadow-amber-500/20' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 border border-neutral-700'"
                          class="px-5 py-2.5 rounded-xl text-sm font-black transition-all active:scale-95"
                      >
                          {{ cat }}
                      </button>
                  </div>
              </div>

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
                              placeholder="ឧទាហរណ៍: ឈ្មោះទំនិញ..."
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

              <div class="bg-neutral-800/40 p-5 rounded-2xl border border-neutral-700/50 space-y-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      <div>
                          <label class="block text-xs font-bold text-emerald-400 mb-1.5">ខ្នាត (Unit)</label>
                          <div class="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3.5 text-white font-bold cursor-not-allowed flex items-center justify-between shadow-inner opacity-80">
                              <span>{{ translateUnit(modelValue.unit) }}</span>
                              <svg class="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                          </div>
                          <p class="text-[10px] text-neutral-500 mt-1 font-bold italic">※ ខ្នាតត្រូវបានកំណត់ដោយស្វ័យប្រវត្តិតាមប្រភេទទំនិញខាងលើ</p>
                      </div>

                      <div>
                          <label class="block text-xs font-bold text-emerald-400 mb-1.5">ចំនួនស្តុកបច្ចុប្បន្ន (ចំនួនដំបូង) - គិតជា {{ translateUnit(modelValue.unit) }}</label>
                          <input v-model.number="modelValue.quantity" type="number" min="0" step="any" required class="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3.5 text-white font-bold focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none shadow-inner">
                      </div>

                      <template v-if="modelValue.unit === 'case'">
                          <div class="col-span-1 md:col-span-2 bg-neutral-900/50 p-4 rounded-xl border border-neutral-700">
                              <label class="block text-xs font-bold text-amber-400 mb-2">ការបំបែកខ្នាតលក់រាយ (Sub-Units)</label>
                              
                              <div class="flex flex-col sm:flex-row gap-4">
                                  <div class="flex-1 flex gap-2 items-center">
                                      <span class="text-xs font-bold text-neutral-300 w-16 text-right">១ កេះ មាន:</span>
                                      <input v-model.number="modelValue.itemsPerCase" type="number" min="1" class="w-24 bg-neutral-800 border border-amber-500/50 rounded-xl px-3 py-2 text-white font-bold text-center focus:border-amber-500 outline-none">
                                      <span class="text-xs font-bold text-amber-400">{{ (modelValue.category === 'ម៉ាស់' || modelValue.category === 'POL') ? 'ប្រអប់' : 'ដប' }}</span>
                                  </div>

                                  <div v-if="modelValue.category === 'ម៉ាស់' || modelValue.category === 'POL'" class="flex-1 flex gap-2 items-center">
                                      <span class="text-xs font-bold text-neutral-300 w-16 text-right">១ ប្រអប់ មាន:</span>
                                      <input v-model.number="modelValue.itemsPerBox" type="number" min="1" class="w-24 bg-neutral-800 border border-amber-500/50 rounded-xl px-3 py-2 text-white font-bold text-center focus:border-amber-500 outline-none">
                                      <span class="text-xs font-bold text-amber-400">{{ modelValue.category === 'ម៉ាស់' ? 'សន្លឹក' : 'ដប' }}</span>
                                  </div>
                              </div>
                          </div>
                      </template>
                  </div>

                  <div v-if="modelValue.category === 'ខោ' || modelValue.category === 'អាវ'" class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-neutral-700/50 animate-slide-down">
                      
                      <div class="bg-neutral-900 p-4 rounded-xl border border-neutral-700">
                          <label class="block text-xs font-bold text-sky-400 mb-2">លេខកូដពណ៌ (ចុច Enter លោតបញ្ជូល)</label>
                          <div class="flex flex-wrap gap-2 mb-2 min-h-[32px]">
                              <span v-for="(color, index) in modelValue.colors" :key="index" class="bg-sky-500/20 text-sky-300 border border-sky-500/30 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 animate-fade-in">
                                  {{ color }}
                                  <button type="button" @click="removeTag('colors', index)" class="hover:text-rose-400 ml-1"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                              </span>
                          </div>
                          <input 
                              v-model="colorInput" 
                              @keydown.enter.prevent="addTag('colors')" 
                              @keydown.comma.prevent="addTag('colors')"
                              type="text" 
                              placeholder="វាយពណ៌ទីនេះ រួចចុច Enter..." 
                              class="w-full bg-neutral-800 border border-neutral-600 rounded-lg px-3 py-2.5 text-white font-bold text-sm focus:border-sky-500 outline-none"
                          >
                      </div>

                      <div class="bg-neutral-900 p-4 rounded-xl border border-neutral-700">
                          <label class="block text-xs font-bold text-pink-400 mb-2">
                              {{ modelValue.category === 'ខោ' ? 'លេខចង្កេះ (Ex: 28, 30, 32)' : 'ទំហំអាវ (Ex: S, M, L, XL)' }}
                          </label>
                          <div class="flex flex-wrap gap-2 mb-2 min-h-[32px]">
                              <span v-for="(size, index) in modelValue.sizes" :key="index" class="bg-pink-500/20 text-pink-300 border border-pink-500/30 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 animate-fade-in">
                                  <span class="uppercase">{{ size }}</span>
                                  <button type="button" @click="removeTag('sizes', index)" class="hover:text-rose-400 ml-1"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                              </span>
                          </div>
                          <input 
                              v-model="sizeInput" 
                              @keydown.enter.prevent="addTag('sizes')" 
                              @keydown.comma.prevent="addTag('sizes')"
                              @input="handleSizeInput"
                              type="text" 
                              placeholder="វាយទំហំទីនេះ រួចចុច Enter..." 
                              class="w-full bg-neutral-800 border border-neutral-600 rounded-lg px-3 py-2.5 text-white font-bold text-sm focus:border-pink-500 outline-none uppercase"
                          >
                      </div>
                  </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                      <label class="block text-[11px] font-black text-blue-400 mb-1.5 flex items-center gap-2 uppercase tracking-wider">
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
                  
                  <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
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
                              <div class="flex flex-wrap gap-2 bg-neutral-800 p-1.5 rounded-xl w-fit border border-neutral-700/50">
                                  <button type="button" @click="modelValue.costMode = 'total'" :class="modelValue.costMode === 'total' ? 'bg-neutral-600 text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200'" class="px-4 py-2 rounded-lg text-xs font-bold transition-all">បញ្ចូលតម្លៃសរុប</button>
                                  <button type="button" @click="modelValue.costMode = 'unit'" :class="modelValue.costMode === 'unit' ? 'bg-neutral-600 text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200'" class="px-4 py-2 rounded-lg text-xs font-bold transition-all">បញ្ចូលក្នុង ១ {{ translateUnit(modelValue.unit) }}</button>
                                  
                                  <button v-if="modelValue.unit === 'case'" type="button" @click="modelValue.costMode = 'retail_unit'" :class="modelValue.costMode === 'retail_unit' ? 'bg-neutral-600 text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200'" class="px-4 py-2 rounded-lg text-xs font-bold transition-all">បញ្ចូលក្នុង ១ {{ getRetailUnitName() }}</button>
                              </div>
                          </div>
                      </div>

                      <div>
                          <label class="block text-xs font-bold text-neutral-400 mb-2">
                              {{ getCostInputLabel() }}
                          </label>
                          <div class="relative">
                              <div class="absolute left-4 top-3.5 text-amber-500 font-black text-lg">
                                  {{ modelValue.currency === 'USD' ? '$' : '៛' }}
                              </div>
                              <input v-model.number="modelValue.inputCost" type="number" step="any" required class="w-full bg-neutral-800 border border-neutral-600 rounded-xl pl-10 pr-4 py-3.5 text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none font-black text-xl shadow-inner">
                          </div>
                          
                          <div class="mt-3 text-xs font-bold text-neutral-400 bg-neutral-800/80 p-3 rounded-xl border border-neutral-700/50 flex flex-col gap-2 justify-between">
                              <div v-if="modelValue.costMode === 'total'" class="flex justify-between items-center w-full">
                                  <span>ធ្លាក់ថ្លៃដើម១{{ translateUnit(modelValue.unit) }}៖ <span class="text-emerald-400 font-black text-sm ml-1">{{ calculateUnitCost }}</span></span>
                                  <span v-if="modelValue.unit === 'case'">ធ្លាក់ថ្លៃដើម១{{ getRetailUnitName() }}៖ <span class="text-emerald-400 font-black text-sm ml-1">{{ calculateRetailUnitCost }}</span></span>
                              </div>
                              <div v-else-if="modelValue.costMode === 'unit'" class="flex justify-between items-center w-full">
                                  <span>តម្លៃសរុប៖ <span class="text-emerald-400 font-black text-sm ml-1">{{ calculateTotalCost }}</span></span>
                                  <span v-if="modelValue.unit === 'case'">ធ្លាក់ថ្លៃដើម១{{ getRetailUnitName() }}៖ <span class="text-emerald-400 font-black text-sm ml-1">{{ calculateRetailUnitCost }}</span></span>
                              </div>
                              <div v-else-if="modelValue.costMode === 'retail_unit'" class="flex justify-between items-center w-full">
                                  <span>តម្លៃសរុប៖ <span class="text-emerald-400 font-black text-sm ml-1">{{ calculateTotalCost }}</span></span>
                                  <span>ធ្លាក់ថ្លៃដើម១{{ translateUnit(modelValue.unit) }}៖ <span class="text-emerald-400 font-black text-sm ml-1">{{ calculateUnitCost }}</span></span>
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
import { ref, computed, onMounted } from 'vue';

const props = defineProps({
  modelValue: {
      type: Object,
      default: () => ({
          name: '', category: 'DFG', unit: 'case', 
          quantity: 0, itemsPerCase: 1, itemsPerBox: 1,
          inputCost: 0, costMode: 'total', currency: 'USD',
          colors: [], sizes: []
      })
  },
  isEditing: Boolean,
  duplicateDetected: Boolean,
  isSaving: Boolean
});

const emit = defineEmits(['update:modelValue', 'save', 'reset', 'image-upload', 'go-to-stock-in']);

// 🌟 បន្ថែម Category "POL" 🌟
const categories = ['DFG', 'ម៉ាស់', 'ស្បែកជើង', 'ការបូប', 'អាវ', 'ខោ', 'POL'];

// 🌟 Category Logic 🌟
const selectCategory = (cat) => {
  props.modelValue.category = cat;
  
  if (cat === 'DFG' || cat === 'ម៉ាស់' || cat === 'POL') { 
      props.modelValue.unit = 'case'; 
  } else if (cat === 'ស្បែកជើង') { 
      props.modelValue.unit = 'pair'; 
  } else if (cat === 'ការបូប' || cat === 'ខោ' || cat === 'អាវ') { 
      props.modelValue.unit = 'pcs'; 
  } else { 
      props.modelValue.unit = 'bottle'; 
  }

  if (!props.modelValue.colors) props.modelValue.colors = [];
  if (!props.modelValue.sizes) props.modelValue.sizes = [];
  
  if (!props.modelValue.itemsPerCase) props.modelValue.itemsPerCase = 1;
  if (!props.modelValue.itemsPerBox) props.modelValue.itemsPerBox = 1;
};

// 🌟 Tags Input Logic (Colors & Sizes) 🌟
const colorInput = ref('');
const sizeInput = ref('');

const addTag = (type) => {
  const input = type === 'colors' ? colorInput.value : sizeInput.value;
  const tags = input.split(',').map(t => t.trim()).filter(t => t !== '');
  
  if (tags.length > 0) {
      if (!props.modelValue[type]) props.modelValue[type] = [];
      
      tags.forEach(val => {
          const formattedVal = type === 'sizes' ? val.toUpperCase() : val;
          if (!props.modelValue[type].includes(formattedVal)) {
              props.modelValue[type].push(formattedVal);
          }
      });
  }
  
  if (type === 'colors') colorInput.value = '';
  else sizeInput.value = '';
};

const removeTag = (type, index) => {
  props.modelValue[type].splice(index, 1);
};

// 🌟 Block ខ្មែរសម្រាប់ទំហំអាវ 🌟
const handleSizeInput = (e) => {
  if (props.modelValue.category === 'អាវ') {
      const val = e.target.value;
      const englishOnly = val.replace(/[^a-zA-Z0-9, ]/g, ''); 
      if (val !== englishOnly) {
          sizeInput.value = englishOnly;
      }
  }
};

// ===============================================

const fileInput = ref(null);
const triggerFileInput = () => { fileInput.value.click(); };
const onImageUpload = (e) => { emit('image-upload', e); };
const handleSave = () => { emit('save'); };

const translateUnit = (unit) => {
  const map = { bottle: 'ដប', case: 'កេះ', pack: 'កញ្ចប់', can: 'កំប៉ុង', kg: 'គីឡូ', pair: 'គូ', pcs: 'PCS' };
  return map[unit] || unit;
};

const getRetailUnitName = () => {
    if (props.modelValue.category === 'ម៉ាស់') return 'សន្លឹក';
    if (props.modelValue.category === 'POL') return 'ដប';
    return 'ដប';
};

const getCostInputLabel = () => {
    if (props.modelValue.costMode === 'total') return 'តម្លៃទិញចូលសរុបទាំងអស់';
    if (props.modelValue.costMode === 'unit') return `តម្លៃទិញចូលក្នុង ១ ${translateUnit(props.modelValue.unit)}`;
    if (props.modelValue.costMode === 'retail_unit') return `តម្លៃទិញចូលក្នុង ១ ${getRetailUnitName()}`;
    return 'បញ្ចូលតម្លៃ';
};

// គណនាតម្លៃដើមក្នុង ១ កេះ (Unit Cost)
const calculateUnitCost = computed(() => {
  let cost = 0;
  if (props.modelValue.costMode === 'total' && props.modelValue.quantity > 0) {
      cost = props.modelValue.inputCost / props.modelValue.quantity;
  } else if (props.modelValue.costMode === 'unit') {
      cost = props.modelValue.inputCost;
  } else if (props.modelValue.costMode === 'retail_unit') {
      // បើបញ្ចូលតម្លៃរាយ (ឧ. ១សន្លឹក ឬ ១ដប) ត្រូវគុណនឹងចំនួនក្នុងកេះដើម្បីរកតម្លៃ ១កេះ
      const totalItemsInCase = (props.modelValue.category === 'ម៉ាស់' || props.modelValue.category === 'POL') 
          ? (props.modelValue.itemsPerCase * props.modelValue.itemsPerBox) 
          : props.modelValue.itemsPerCase;
      cost = props.modelValue.inputCost * totalItemsInCase;
  }
  
  return Number(cost).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 3 }) + (props.modelValue.currency === 'USD' ? ' $' : ' ៛');
});

// គណនាតម្លៃសរុប (Total Cost)
const calculateTotalCost = computed(() => {
  let total = 0;
  if (props.modelValue.costMode === 'total') {
      total = props.modelValue.inputCost;
  } else if (props.modelValue.costMode === 'unit') {
      total = props.modelValue.inputCost * props.modelValue.quantity;
  } else if (props.modelValue.costMode === 'retail_unit') {
      // រកចំនួនរាយសរុប រួចគុណនឹងតម្លៃរាយដែលបញ្ចូល
      const totalItemsInCase = (props.modelValue.category === 'ម៉ាស់' || props.modelValue.category === 'POL') 
          ? (props.modelValue.itemsPerCase * props.modelValue.itemsPerBox) 
          : props.modelValue.itemsPerCase;
      const totalRetailItems = props.modelValue.quantity * totalItemsInCase;
      total = props.modelValue.inputCost * totalRetailItems;
  }
  
  return Number(total).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 3 }) + (props.modelValue.currency === 'USD' ? ' $' : ' ៛');
});

// គណនាតម្លៃដើមក្នុង ១ ខ្នាតរាយ (Retail Unit Cost)
const calculateRetailUnitCost = computed(() => {
    let cost = 0;
    const totalItemsInCase = (props.modelValue.category === 'ម៉ាស់' || props.modelValue.category === 'POL') 
          ? (props.modelValue.itemsPerCase * props.modelValue.itemsPerBox) 
          : props.modelValue.itemsPerCase;
          
    if (props.modelValue.costMode === 'total' && props.modelValue.quantity > 0 && totalItemsInCase > 0) {
        cost = (props.modelValue.inputCost / props.modelValue.quantity) / totalItemsInCase;
    } else if (props.modelValue.costMode === 'unit' && totalItemsInCase > 0) {
        cost = props.modelValue.inputCost / totalItemsInCase;
    } else if (props.modelValue.costMode === 'retail_unit') {
        cost = props.modelValue.inputCost;
    }
    
    return Number(cost).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 3 }) + (props.modelValue.currency === 'USD' ? ' $' : ' ៛');
});

onMounted(() => {
  if (!props.modelValue.category) selectCategory('DFG');
});

</script>