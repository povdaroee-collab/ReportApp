<template>
  <TransitionRoot appear :show="show" as="template">
    <Dialog as="div" @close="$emit('close')" class="relative z-[9999]" @click="closeDropdowns">
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto custom-scrollbar">
        <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-6">
          <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95 translate-y-4" enter-to="opacity-100 scale-100 translate-y-0" leave="duration-200 ease-in" leave-from="opacity-100 scale-100 translate-y-0" leave-to="opacity-0 scale-95 translate-y-4">
            <DialogPanel class="w-full max-w-2xl transform bg-white text-left align-middle shadow-2xl transition-all font-khmer rounded-[24px] flex flex-col" @click.stop>
              
              <div class="px-6 py-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between shrink-0 rounded-t-[24px]">
                <DialogTitle as="h3" class="text-xl font-black text-slate-800 flex items-center gap-2">បញ្ជាក់ការទូទាត់ទំនិញ</DialogTitle>
                <button @click="$emit('close')" class="p-2 rounded-full hover:bg-slate-200 text-slate-400 transition-colors focus:outline-none bg-white shadow-sm border border-slate-200">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              
              <div class="p-6 overflow-y-visible space-y-6">
                <div class="relative z-[60]">
                  <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">តំណាងលក់ (SELLER) <span class="text-rose-500">*</span></label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    <input type="text" v-model="sellerSearchQuery" @focus="showSellerDropdown = true" @input="showSellerDropdown = true" placeholder="ស្វែងរកឈ្មោះ ឬ អត្តលេខ..." class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-10 py-3.5 text-slate-800 font-bold text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 outline-none transition-all shadow-inner">
                    <button v-if="form.sellerId" @click.stop="clearSeller" class="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-rose-500 transition-colors">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                  </div>
                  <div v-if="showSellerDropdown" class="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl max-h-64 overflow-y-auto z-[100] p-2 custom-scrollbar">
                    <div v-if="filteredSellers.length === 0" class="p-4 text-center text-xs font-bold text-slate-400">រកមិនឃើញតំណាងលក់ទេ</div>
                    <div v-else v-for="s in filteredSellers" :key="s.id" @click.stop="selectSeller(s)" class="flex items-center gap-4 p-2.5 hover:bg-blue-50 rounded-xl cursor-pointer transition-colors group">
                      <img :src="s.photoUrl || `https://ui-avatars.com/api/?name=${s.fullName}`" class="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-sm shrink-0">
                      <div class="flex-1 min-w-0">
                        <h4 class="font-black text-sm text-slate-800 truncate group-hover:text-blue-700">{{ s.fullName }}</h4>
                        <p class="text-[11px] text-slate-500 font-mono mt-0.5 font-bold">ID: {{ s.idNumber || 'N/A' }}</p>
                      </div>
                      <div v-if="form.sellerId === s.id" class="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center shrink-0 shadow-md">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-slate-100">
                  <div>
                    <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">ឈ្មោះអតិថិជន <span class="text-rose-500">*</span></label>
                    <input v-model="form.customerName" type="text" placeholder="បញ្ចូលឈ្មោះ..." class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-bold text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 outline-none transition-all">
                  </div>
                  <div>
                    <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">លេខទូរស័ព្ទ <span class="text-rose-500">*</span></label>
                    <input v-model="form.customerPhone" type="text" placeholder="បញ្ចូលលេខ..." class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-bold text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 outline-none transition-all">
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 z-[50]">
                  <div class="relative">
                    <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">ខេត្ត/ក្រុង <span class="text-rose-500">*</span></label>
                    <input type="text" v-model="provinceSearch" @focus="showProvinceDropdown = true" @input="handleProvinceInput" placeholder="ជ្រើសរើសខេត្ត/ក្រុង..." class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-bold text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 outline-none transition-all">
                    <svg class="w-4 h-4 absolute right-4 top-[38px] text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                    <div v-if="showProvinceDropdown" class="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto z-[100] p-1 custom-scrollbar">
                      <div v-if="filteredProvinces.length === 0" class="p-3 text-center text-xs text-slate-400 font-bold">រកមិនឃើញទិន្នន័យ</div>
                      <div v-else v-for="prov in filteredProvinces" :key="prov" @click.stop="selectProvince(prov)" class="px-3 py-2 hover:bg-blue-50 rounded-lg cursor-pointer text-sm font-bold text-slate-700 transition-colors">{{ prov }}</div>
                    </div>
                  </div>
                  <div class="relative">
                    <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2" :class="!form.province ? 'opacity-50' : ''">សាខាទទួលអីវ៉ាន់ <span class="text-rose-500">*</span></label>
                    <input type="text" v-model="form.district" @focus="showDistrictDropdown = true" @input="showDistrictDropdown = true" :disabled="!form.province" :placeholder="!form.province ? 'សូមរើសខេត្តសិន...' : 'វាយបញ្ចូល ឬរើស...'" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-bold text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 outline-none transition-all disabled:bg-slate-100 disabled:cursor-not-allowed">
                    <div v-if="showDistrictDropdown && form.province && filteredDistricts.length > 0" class="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto z-[100] p-1 custom-scrollbar">
                      <div v-for="dist in filteredDistricts" :key="dist" @click.stop="selectDistrict(dist)" class="px-3 py-2 hover:bg-blue-50 rounded-lg cursor-pointer text-sm font-bold text-slate-700 transition-colors">{{ dist }}</div>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                  <div>
                    <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">កាលបរិច្ឆេទ</label>
                    <input v-model="form.date" type="datetime-local" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-bold text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 outline-none cursor-pointer transition-all">
                  </div>
                  <div>
                    <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">ការបង់ប្រាក់</label>
                    <div class="relative">
                      <select v-model="form.paymentMethod" class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-3 text-slate-800 font-bold text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 outline-none appearance-none cursor-pointer transition-all">
                        <option value="CASH">សាច់ប្រាក់ (CASH)</option>
                        <option value="KHQR">វេរប្រាក់ (KHQR)</option>
                      </select>
                      <svg class="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                  </div>
                </div>

                <div v-if="form.paymentMethod === 'KHQR'" class="pt-2">
                  <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">រូបភាពវិក្កយបត្រវេរប្រាក់ (ជម្រើស)</label>
                  <div class="flex items-center gap-4">
                    <div class="relative shrink-0">
                      <input type="file" accept="image/*" @change="handleImageUpload" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10">
                      <div class="w-20 h-20 bg-slate-50 border-2 border-dashed border-slate-300 hover:border-indigo-400 rounded-xl flex flex-col items-center justify-center text-slate-400 transition-colors">
                        <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                        <span class="text-[9px] font-bold">Upload</span>
                      </div>
                    </div>
                    <div v-if="form.paymentImage" class="relative w-20 h-20 rounded-xl border border-slate-200 shadow-sm overflow-hidden group">
                      <img :src="form.paymentImage" class="w-full h-full object-cover">
                      <button @click.stop="form.paymentImage = ''" class="absolute top-1 right-1 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                      </button>
                    </div>
                    <div v-if="isCompressing" class="text-[11px] font-bold text-indigo-500 flex items-center gap-2">
                        <svg class="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> កំពុងបង្រួមរូបភាព...
                    </div>
                  </div>
                </div>

                <div class="pt-2">
                  <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">ចំណាំបញ្ជាក់ការទូទាត់ (Payment Note)</label>
                  <input v-model="form.paymentNote" type="text" list="payment-notes" placeholder="ឧ. បានទូទាត់រួច, នៅខ្វះ..." class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-bold text-sm focus:bg-white focus:border-blue-400 outline-none transition-all">
                  <datalist id="payment-notes">
                    <option value="បានទូទាត់រួច"></option><option value="មិនទាន់ទូទាត់"></option><option value="កក់ប្រាក់ខ្លះ"></option><option value="បង់ពេលឥវ៉ាន់ដល់"></option>
                  </datalist>
                </div>

                <div class="bg-slate-800 text-white rounded-[1.25rem] p-5 mt-4 shadow-lg border border-slate-700 relative overflow-hidden">
                  <div class="flex justify-between items-center mb-2">
                    <span class="text-sm font-bold text-slate-300">ទំនិញសរុប:</span>
                    <span class="text-sm font-black bg-white/10 px-2 py-1 rounded-lg">{{ cartLength }} មុខ</span>
                  </div>
                  <div class="flex justify-between items-end border-t border-white/10 pt-3">
                    <span class="text-xs font-black uppercase tracking-widest text-slate-400">ទឹកប្រាក់សរុប (Total)</span>
                    <span class="text-3xl font-black text-emerald-400">{{ formatPrice(cartTotalUSD, 'USD') }}</span>
                  </div>
                </div>

              </div>

              <div class="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 shrink-0 rounded-b-[24px]">
                <button type="button" @click="$emit('close')" class="px-6 py-3 rounded-xl font-bold text-slate-600 bg-white border border-slate-300 hover:bg-slate-100 transition-colors text-sm">បោះបង់</button>
                <button type="button" @click="onSubmit" :disabled="isSubmitting" class="px-8 py-3 rounded-xl font-black text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/30 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2 text-sm">
                  <svg v-if="isSubmitting" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                  បញ្ជាក់ការទូទាត់
                </button>
              </div>

            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue';

const props = defineProps({
    show: Boolean,
    cartLength: Number,
    cartTotalUSD: Number,
    sellers: Array,
    isSubmitting: Boolean
});

const emit = defineEmits(['close', 'confirm']);

// Initial Form State
const getLocalISOString = () => {
    const tzoffset = (new Date()).getTimezoneOffset() * 60000;
    return (new Date(Date.now() - tzoffset)).toISOString().slice(0, 16);
};

const form = reactive({
    sellerId: '', sellerName: '', customerName: '', customerPhone: '',
    province: '', district: '', paymentMethod: 'CASH', paymentNote: '', 
    date: getLocalISOString(), paymentImage: '' 
});

// Location Logic
const locationData = {
    "រាជធានីភ្នំពេញ": ["ខណ្ឌចំការមន", "ខណ្ឌដូនពេញ", "ខណ្ឌ៧មករា", "ខណ្ឌទួលគោក", "ខណ្ឌដង្កោ", "ខណ្ឌមានជ័យ", "ខណ្ឌឫស្សីកែវ", "ខណ្ឌសែនសុខ", "ខណ្ឌពោធិ៍សែនជ័យ", "ខណ្ឌជ្រោយចង្វារ", "ខណ្ឌព្រែកព្នៅ", "ខណ្ឌច្បារអំពៅ", "ខណ្ឌបឹងកេងកង", "ខណ្ឌកំបូល"],
    "ខេត្តកណ្តាល": ["ក្រុងតាខ្មៅ", "ស្រុកកណ្តាលស្ទឹង", "ស្រុកគីវីស៊ុង", "ស្រុកខ្សាច់កណ្តាល", "ស្រុកកោះធំ", "ស្រុកលើកដែក", "ស្រុកល្វាឯម", "ស្រុកមុខកំពូល", "ស្រុកអង្គស្នួល", "ស្រុកពញាឮ", "ស្រុកស្អាង"],
    // ... add more if needed
};
const allProvinces = Object.keys(locationData);
const provinceSearch = ref('');
const showProvinceDropdown = ref(false);
const showDistrictDropdown = ref(false);

const filteredProvinces = computed(() => {
    if (!provinceSearch.value) return allProvinces;
    return allProvinces.filter(p => p.toLowerCase().includes(provinceSearch.value.toLowerCase()));
});
const filteredDistricts = computed(() => {
    if (!form.province || !locationData[form.province]) return [];
    if (!form.district) return locationData[form.province];
    const exactMatch = locationData[form.province].some(d => d === form.district);
    if(exactMatch && !showDistrictDropdown.value) return locationData[form.province];
    return locationData[form.province].filter(d => d.toLowerCase().includes(form.district.toLowerCase()));
});

const handleProvinceInput = () => {
    showProvinceDropdown.value = true;
    const exactMatch = allProvinces.find(p => p.toLowerCase() === provinceSearch.value.toLowerCase());
    if (exactMatch) selectProvince(exactMatch);
    else { form.province = ''; form.district = ''; }
};
const selectProvince = (prov) => { form.province = prov; provinceSearch.value = prov; form.district = ''; showProvinceDropdown.value = false; setTimeout(() => showDistrictDropdown.value = true, 100); };
const selectDistrict = (dist) => { form.district = dist; showDistrictDropdown.value = false; };

// Seller Logic
const sellerSearchQuery = ref('');
const showSellerDropdown = ref(false);
const filteredSellers = computed(() => {
    if (!sellerSearchQuery.value) return props.sellers;
    const q = sellerSearchQuery.value.toLowerCase();
    return props.sellers.filter(s => s.fullName.toLowerCase().includes(q) || (s.idNumber && s.idNumber.toLowerCase().includes(q)));
});
const selectSeller = (seller) => { form.sellerId = seller.id; form.sellerName = seller.fullName; sellerSearchQuery.value = seller.fullName; showSellerDropdown.value = false; };
const clearSeller = () => { form.sellerId = ''; form.sellerName = ''; sellerSearchQuery.value = ''; };

const closeDropdowns = () => { showSellerDropdown.value = false; showProvinceDropdown.value = false; showDistrictDropdown.value = false; };

// Image Compression
const isCompressing = ref(false);
const compressImage = (file, targetSizeKB) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader(); reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image(); img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width, height = img.height;
                if (width > height) { if (width > 1200) { height *= 1200 / width; width = 1200; } } else { if (height > 1200) { width *= 1200 / height; height = 1200; } }
                canvas.width = width; canvas.height = height;
                canvas.getContext('2d').drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', 0.5));
            };
        };
    });
};
const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !file.type.startsWith('image/')) return;
    isCompressing.value = true;
    try { form.paymentImage = await compressImage(file, 100); } 
    catch (error) { console.error(error); } 
    finally { isCompressing.value = false; event.target.value = ''; }
};

const onSubmit = () => { emit('confirm', form); };
const formatPrice = (val, currency = 'USD') => Number(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + (currency === 'USD' ? ' $' : ' ៛');
</script>