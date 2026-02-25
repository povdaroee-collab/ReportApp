<template>
  <div class="min-h-screen bg-neutral-900 text-slate-200 font-khmer p-4 md:p-8">
    
    <Toast />
    <ConfirmDialog ref="confirmDialog" />

    <div class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
      <div>
        <h1 class="text-3xl font-bold bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
          📦 គ្រប់គ្រងស្តុកទំនិញ
        </h1>
        <p class="text-neutral-400 text-sm mt-1 flex items-center gap-2">
            ប្រព័ន្ធគ្រប់គ្រងឃ្លាំង និងតម្លៃទុន 
            <span class="flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Real-time
            </span>
        </p>
      </div>

      <div class="flex bg-neutral-800 p-1 rounded-xl border border-neutral-700">
        <button 
          @click="activeTab = 'add'"
          class="px-6 py-2 rounded-lg text-sm font-bold transition-all duration-300"
          :class="activeTab === 'add' ? 'bg-gradient-to-r from-amber-400 to-yellow-600 text-black shadow-lg shadow-amber-500/20' : 'text-neutral-400 hover:text-white'"
        >
          ➕ បញ្ចូលស្តុកថ្មី
        </button>
        <button 
          @click="activeTab = 'list'"
          class="px-6 py-2 rounded-lg text-sm font-bold transition-all duration-300"
          :class="activeTab === 'list' ? 'bg-gradient-to-r from-amber-400 to-yellow-600 text-black shadow-lg shadow-amber-500/20' : 'text-neutral-400 hover:text-white'"
        >
          📋 បញ្ជីស្តុក ({{ stockList.length }})
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
    </div>

    <div v-else-if="activeTab === 'add'" class="max-w-4xl mx-auto animate-fade-in">
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

        <form @submit.prevent="saveProduct" class="space-y-6">
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="col-span-1">
              <label class="block text-xs font-bold text-amber-500 mb-2 uppercase tracking-wider">រូបភាពផលិតផល (*)</label>
              <div 
                class="relative h-48 w-full rounded-xl border-2 border-dashed border-neutral-600 hover:border-amber-400 transition-colors flex flex-col items-center justify-center cursor-pointer bg-neutral-800 group overflow-hidden"
                @click="triggerFileInput"
              >
                <img v-if="form.imagePreview" :src="form.imagePreview" class="absolute inset-0 w-full h-full object-cover">
                <div v-else class="text-center p-4 group-hover:scale-105 transition-transform">
                  <div class="text-4xl mb-2">📷</div>
                  <span class="text-xs text-neutral-400">ចុចដើម្បី Upload (Max 1.5MB)</span>
                </div>
                <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleImageUpload">
              </div>
            </div>

            <div class="col-span-1 md:col-span-2 space-y-5">
              <div>
                <label class="block text-xs text-neutral-400 mb-1">ឈ្មោះផលិតផល (វាយឈ្មោះដើម្បីពិនិត្យ)</label>
                <input 
                  v-model="form.name" 
                  type="text" 
                  required 
                  class="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none text-white transition-all" 
                  placeholder="ឧទាហរណ៍: Coca Cola..."
                >
              </div>

              <div>
                <label class="block text-xs text-neutral-400 mb-1">Barcode (បង្កើតដោយប្រព័ន្ធ)</label>
                <div class="relative">
                  <input :value="form.barcode" type="text" readonly class="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-3 text-amber-400 font-mono font-bold tracking-widest cursor-not-allowed">
                  <span class="absolute right-3 top-3 text-lg">🔒</span>
                </div>
              </div>
            </div>
          </div>

          <div class="h-px bg-neutral-700 my-6"></div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-xs text-neutral-400 mb-1">ខ្នាត (Unit)</label>
              <select v-model="form.unit" class="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:border-amber-500 outline-none">
                <option value="bottle">ដប (Bottle)</option>
                <option value="pack">កញ្ចប់ (Pack)</option>
                <option value="case">កេះ (Case)</option>
                <option value="can">កំប៉ុង (Can)</option>
                <option value="kg">គីឡូ (Kg)</option>
              </select>
            </div>

             <div v-if="form.unit === 'case'" class="animate-slide-down">
              <label class="block text-xs text-amber-400 mb-1">ចំនួនរាយក្នុង ១ កេះ</label>
              <div class="flex gap-2">
                <input v-model.number="form.itemsPerCase" type="number" min="1" class="flex-1 bg-neutral-900 border border-amber-500/50 rounded-lg px-4 py-3 text-white focus:border-amber-500 outline-none">
                <div class="flex items-center px-3 bg-neutral-800 border border-neutral-700 rounded-lg text-sm">
                   ដប/កញ្ចប់
                </div>
              </div>
            </div>

            <div>
              <label class="block text-xs text-neutral-400 mb-1">ចំនួនស្តុកបច្ចុប្បន្ន</label>
              <input v-model.number="form.quantity" type="number" min="0" step="0.01" required class="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:border-amber-500 outline-none">
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
                     <input type="radio" v-model="form.currency" value="USD" class="accent-amber-500 w-5 h-5">
                     <span class="text-sm">ប្រាក់ដុល្លារ ($)</span>
                   </label>
                   <label class="flex items-center gap-2 cursor-pointer">
                     <input type="radio" v-model="form.currency" value="KHR" class="accent-amber-500 w-5 h-5">
                     <span class="text-sm">ប្រាក់រៀល (៛)</span>
                   </label>
                </div>

                <div class="flex flex-col gap-2">
                   <label class="text-xs text-neutral-400">ជម្រើសបញ្ចូលតម្លៃ៖</label>
                   <div class="flex gap-2 bg-neutral-800 p-1 rounded-lg w-fit">
                      <button type="button" @click="form.costMode = 'total'" :class="form.costMode === 'total' ? 'bg-neutral-600 text-white' : 'text-neutral-400'" class="px-3 py-1.5 rounded text-xs transition-all">បញ្ចូលតម្លៃសរុប</button>
                      <button type="button" @click="form.costMode = 'unit'" :class="form.costMode === 'unit' ? 'bg-neutral-600 text-white' : 'text-neutral-400'" class="px-3 py-1.5 rounded text-xs transition-all">បញ្ចូលតម្លៃក្នុង ១ ឯកតា</button>
                   </div>
                </div>
              </div>

              <div>
                <label class="block text-xs text-neutral-400 mb-1">
                  {{ form.costMode === 'total' ? 'តម្លៃទិញចូលសរុបទាំងអស់' : `តម្លៃទិញចូលក្នុង ១ ${translateUnit(form.unit)}` }}
                </label>
                <div class="relative">
                  <div class="absolute left-4 top-3 text-amber-500 font-bold">
                    {{ form.currency === 'USD' ? '$' : '៛' }}
                  </div>
                  <input v-model.number="form.inputCost" type="number" step="0.01" required class="w-full bg-neutral-800 border border-neutral-600 rounded-lg pl-8 pr-4 py-3 text-white focus:border-amber-500 outline-none font-bold text-lg">
                </div>
                
                <div class="mt-2 text-xs text-neutral-400 bg-neutral-800 p-2 rounded border border-neutral-700/50">
                   <div v-if="form.costMode === 'total'">
                      ធ្លាក់ថ្លៃដើម៖ <span class="text-emerald-400 font-bold">{{ calculateUnitCost }}</span> / {{ translateUnit(form.unit) }}
                   </div>
                   <div v-else>
                      តម្លៃសរុប៖ <span class="text-emerald-400 font-bold">{{ calculateTotalCost }}</span>
                   </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex gap-4 pt-4">
             <button type="button" @click="resetForm" class="flex-1 px-6 py-3 rounded-xl border border-neutral-600 text-neutral-300 hover:bg-neutral-800 font-bold transition-all">
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

    <div v-else-if="activeTab === 'list'" class="animate-fade-in">
      
      <div class="mb-4 flex flex-col md:flex-row justify-between items-center gap-4">
         <div class="relative w-full md:w-96">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">🔍</span>
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="ស្វែងរកឈ្មោះ ឬ Barcode..." 
              class="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:border-amber-500 outline-none transition-all focus:ring-1 focus:ring-amber-500/50"
            >
         </div>
         <span class="text-xs text-neutral-500">កំពុងបង្ហាញទំព័រទី {{ currentPage }} (សរុប {{ filteredStock.length }})</span>
      </div>

      <div v-if="filteredStock.length === 0" class="flex flex-col items-center justify-center h-64 text-neutral-500">
         <div class="text-4xl mb-3">😕</div>
         <p>រកមិនឃើញទិន្នន័យទេ</p>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        
        <div v-for="item in paginatedStock" :key="item.id" class="bg-neutral-800 rounded-xl border border-neutral-700/50 overflow-hidden hover:border-amber-500/50 transition-all group shadow-lg flex flex-col">
          
          <div class="relative h-40 bg-neutral-900 shrink-0">
             <img :src="item.image || 'https://via.placeholder.com/300x200?text=No+Image'" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity">
             <div class="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] text-white font-mono border border-white/10">
                {{ item.barcode }}
             </div>
             <div class="absolute bottom-2 left-2 bg-amber-500 text-black text-xs font-bold px-2 py-0.5 rounded">
                {{ item.currency === 'USD' ? '$' : '៛' }}
             </div>
          </div>

          <div class="p-4 flex-1 flex flex-col">
             <h3 class="text-lg font-bold text-white mb-1 truncate" :title="item.name">{{ item.name }}</h3>
             
             <div class="flex flex-col gap-1 text-sm text-neutral-400 mb-3 border-b border-neutral-700/50 pb-2">
               
               <div class="flex justify-between items-center">
                 <span>ស្តុកធំ (Bulk):</span>
                 <span class="text-emerald-400 font-bold bg-emerald-400/10 px-2 py-0.5 rounded text-xs" v-html="getFormattedBulkStock(item)">
                 </span>
               </div>

               <div class="flex justify-between items-center mt-1">
                 <span>ស្តុករាយសរុប (Total):</span>
                 <span class="text-blue-400 font-black bg-blue-400/10 px-2 py-0.5 rounded text-xs border border-blue-400/20">
                   {{ getExactRetailStock(item) }} {{ translateRetailUnit(item) }}
                 </span>
               </div>

               <div v-if="item.stock_reserved > 0" class="flex justify-end mt-1">
                 <span class="text-[10px] text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded font-bold" title="មានគេចុចបញ្ចូលកន្ត្រក តែមិនទាន់ទូទាត់ប្រាក់">
                   🔒 កំពុងជាប់កក់: {{ getExactReservedRetailStock(item) }} {{ translateRetailUnit(item) }}
                 </span>
               </div>
             </div>

             <div v-if="item.unit === 'case'" class="text-xs text-neutral-500 mb-3 bg-neutral-900 p-2 rounded">
                ១ កេះ = {{ item.itemsPerCase }} ដប/កញ្ចប់
             </div>

             <div class="mt-auto flex justify-between items-end pt-2">
                <div>
                   <p class="text-[10px] text-neutral-500">តម្លៃដើម/ឯកតា</p>
                   <p class="text-amber-400 font-bold">{{ formatPrice(item.unitCost, item.currency) }}</p>
                </div>
                
                <div class="flex gap-2">
                   <button @click="editItem(item)" class="p-2 bg-neutral-700 hover:bg-blue-600 text-white rounded-lg transition-colors" title="កែប្រែ">
                      ✏️
                   </button>
                   <button @click="confirmAndDelete(item)" class="p-2 bg-neutral-700 hover:bg-red-600 text-white rounded-lg transition-colors" title="លុប">
                      🗑️
                   </button>
                </div>
             </div>
          </div>

        </div>
      </div>
      
       <div v-if="totalPages > 1" class="flex justify-center gap-2 mt-8">
        <button 
           @click="currentPage--" :disabled="currentPage === 1"
           class="px-4 py-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 disabled:opacity-50 text-sm"
        >Previous</button>
        <span class="px-4 py-2 bg-neutral-900 rounded-lg border border-neutral-700 text-amber-500 font-bold">
           {{ currentPage }} / {{ totalPages }}
        </span>
        <button 
           @click="currentPage++" :disabled="currentPage === totalPages"
           class="px-4 py-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 disabled:opacity-50 text-sm"
        >Next</button>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch, onUnmounted } from 'vue';
import { db } from '@/firebaseConfig';
import { collection, addDoc, doc, updateDoc, deleteDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import Toast from '@/components/Toast.vue';
import ConfirmDialog from '@/components/shared/ConfirmDialog.vue';
import { useNotificationStore } from '@/stores/notification';

const notification = useNotificationStore();
const confirmDialog = ref(null);

// --- STATE ---
const activeTab = ref('add'); // 'add' or 'list'
const stockList = ref([]);
const isEditing = ref(false);
const duplicateDetected = ref(false); 
const fileInput = ref(null);
const currentPage = ref(1);
const itemsPerPage = 40;
const isLoading = ref(false);
const isSaving = ref(false);
const searchQuery = ref(''); 
let unsubscribeStocks = null; // ប្រើសម្រាប់បិទ Realtime Listener ពេលចាកចេញ

const form = reactive({
  id: null,
  name: '',
  barcode: '',
  imagePreview: null,
  quantity: 0,
  unit: 'bottle',
  itemsPerCase: 12,
  currency: 'USD',
  costMode: 'total',
  inputCost: 0
});

const generateBarcode = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `STK-${timestamp}${random}`;
};

// --- 🔥 REALTIME FIREBASE FETCH (onSnapshot) 🔥 ---
const fetchStocks = () => {
    isLoading.value = true;
    try {
        const q = collection(db, "stocks");
        // onSnapshot នឹងអានទិន្នន័យដោយស្វ័យប្រវត្តិរាល់ពេលមានអ្នក Update ស្តុក
        unsubscribeStocks = onSnapshot(q, (querySnapshot) => {
            stockList.value = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            stockList.value.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
            isLoading.value = false;
        }, (error) => {
            console.error("Error fetching stocks realtime: ", error);
            notification.error("បរាជ័យក្នុងការភ្ជាប់ទិន្នន័យស្តុក"); 
            isLoading.value = false;
        });
    } catch (error) {
        isLoading.value = false;
    }
};

onMounted(() => {
  fetchStocks();
  if (!isEditing.value) {
      form.barcode = generateBarcode();
  }
});

onUnmounted(() => {
    // ផ្តាច់ការភ្ជាប់ទិន្នន័យ Realtime ពេលបិទ Page ដើម្បីសន្សំសំចៃ Memory
    if (unsubscribeStocks) unsubscribeStocks();
});

// --- SMART DUPLICATE DETECTION ---
watch(() => form.name, (newName) => {
    if (activeTab.value !== 'add' || !newName) return;
    const trimmedName = newName.trim().toLowerCase();
    const existingProduct = stockList.value.find(item => item.name.toLowerCase() === trimmedName);

    if (existingProduct) {
        if (form.id !== existingProduct.id) {
            isEditing.value = true;
            duplicateDetected.value = true;
            
            form.id = existingProduct.id;
            form.barcode = existingProduct.barcode; 
            form.imagePreview = existingProduct.image;
            form.quantity = existingProduct.quantity;
            form.unit = existingProduct.unit;
            form.itemsPerCase = existingProduct.itemsPerCase || 12;
            form.currency = existingProduct.currency;
            form.costMode = 'unit';
            form.inputCost = existingProduct.unitCost;
        }
    } else {
        if (duplicateDetected.value) {
            isEditing.value = false;
            duplicateDetected.value = false;
            form.id = null;
            form.barcode = generateBarcode(); 
        }
    }
});

const saveProduct = async () => {
  isSaving.value = true;
  
  let finalUnitCost = 0;
  if (form.costMode === 'total') {
    finalUnitCost = form.quantity > 0 ? form.inputCost / form.quantity : 0;
  } else {
    finalUnitCost = form.inputCost;
  }

  const productData = {
    name: form.name,
    barcode: form.barcode, 
    image: form.imagePreview,
    quantity: form.quantity,
    unit: form.unit,
    itemsPerCase: form.unit === 'case' ? form.itemsPerCase : null,
    currency: form.currency,
    unitCost: finalUnitCost,
    totalCost: finalUnitCost * form.quantity,
    updatedAt: serverTimestamp()
  };

  try {
      if (isEditing.value && form.id) {
        const stockRef = doc(db, "stocks", form.id);
        await updateDoc(stockRef, productData);
        notification.success("បានកែប្រែព័ត៌មានស្តុកដោយជោគជ័យ!");
        isEditing.value = false;
        duplicateDetected.value = false;
      } else {
        productData.createdAt = serverTimestamp();
        productData.stock_reserved = 0; 
        await addDoc(collection(db, "stocks"), productData);
        notification.success("បានបង្កើតស្តុកថ្មីដោយជោគជ័យ!");
      }
      resetForm();
  } catch (error) {
      console.error("Error saving document: ", error);
      notification.error("មានបញ្ហាក្នុងការរក្សាទុកទិន្នន័យ");
  } finally {
      isSaving.value = false;
  }
};

const confirmAndDelete = async (item) => {
  const confirmed = await confirmDialog.value.open(
    "លុបស្តុក?", 
    `តើអ្នកពិតជាចង់លុប "${item.name}" ចេញពីបញ្ជីមែនទេ?`
  );

  if (confirmed) {
    try {
        await deleteDoc(doc(db, "stocks", item.id));
        notification.success("ទិន្នន័យស្តុកត្រូវបានលុបដោយជោគជ័យ!");
    } catch (error) {
        console.error("Error removing document: ", error);
        notification.error("បរាជ័យក្នុងការលុប");
    }
  }
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  if (file.size > 1.5 * 1024 * 1024) {
    notification.error("សូមមេត្តាជ្រើសរើសរូបភាពដែលមានទំហំក្រោម 1.5MB");
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => { form.imagePreview = e.target.result; };
  reader.readAsDataURL(file);
};

const triggerFileInput = () => { fileInput.value.click(); };

const calculateUnitCost = computed(() => {
  if (form.quantity <= 0) return 0;
  if (form.costMode === 'total') {
     return (form.inputCost / form.quantity).toFixed(2) + (form.currency === 'USD' ? ' $' : ' ៛');
  }
  return form.inputCost + (form.currency === 'USD' ? ' $' : ' ៛');
});

const calculateTotalCost = computed(() => {
  if (form.costMode === 'unit') {
     return (form.inputCost * form.quantity).toLocaleString() + (form.currency === 'USD' ? ' $' : ' ៛');
  }
  return form.inputCost.toLocaleString() + (form.currency === 'USD' ? ' $' : ' ៛');
});

const resetForm = () => {
  form.id = null;
  form.name = '';
  form.barcode = generateBarcode();
  form.imagePreview = null;
  form.quantity = 0;
  form.unit = 'bottle';
  form.itemsPerCase = 12;
  form.currency = 'USD';
  form.costMode = 'total';
  form.inputCost = 0;
  isEditing.value = false;
  duplicateDetected.value = false;
  if(fileInput.value) fileInput.value.value = '';
};

const editItem = (item) => {
  isEditing.value = true;
  duplicateDetected.value = false; 
  activeTab.value = 'add';
  
  form.id = item.id;
  form.name = item.name;
  form.barcode = item.barcode;
  form.imagePreview = item.image;
  form.quantity = item.quantity;
  form.unit = item.unit;
  form.itemsPerCase = item.itemsPerCase || 12;
  form.currency = item.currency;
  form.costMode = 'unit';
  form.inputCost = item.unitCost;
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const filteredStock = computed(() => {
    if (!searchQuery.value) return stockList.value;
    const lowerQuery = searchQuery.value.toLowerCase();
    return stockList.value.filter(item => 
        item.name.toLowerCase().includes(lowerQuery) || 
        (item.barcode && item.barcode.toLowerCase().includes(lowerQuery))
    );
});

const totalPages = computed(() => Math.ceil(filteredStock.value.length / itemsPerPage));

const paginatedStock = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredStock.value.slice(start, start + itemsPerPage);
});

watch(searchQuery, () => { currentPage.value = 1; });

// --- 🔥 FORMATTERS & CALCULATORS (FIXED FLOATING POINT) 🔥 ---

const translateUnit = (unit) => {
  const map = { bottle: 'ដប', case: 'កេះ', pack: 'កញ្ចប់', can: 'កំប៉ុង', kg: 'គីឡូ' };
  return map[unit] || unit;
};

const translateRetailUnit = (item) => {
    if (item.unit === 'case') return 'ដប/កញ្ចប់'; 
    return translateUnit(item.unit);
};

// ១. គណនាស្តុករាយសរុបពិតប្រាកដ ដោយប្រើ Math.round() បំបាត់លេខ 198.999999
const getExactRetailStock = (item) => {
    const qty = Number(item.quantity) || 0;
    if (item.unit === 'case') {
        const perCase = Number(item.itemsPerCase) || 1;
        return Math.round(qty * perCase); 
    }
    return Math.round(qty);
};

const getExactReservedRetailStock = (item) => {
    const reserved = Number(item.stock_reserved) || 0;
    if (item.unit === 'case') {
        const perCase = Number(item.itemsPerCase) || 1;
        return Math.round(reserved * perCase);
    }
    return Math.round(reserved);
};

// ២. បង្ហាញស្តុកធំងាយយល់៖ បើលក់ដាច់ ១ដប វានឹងបង្ហាញ "9.95 កេះ (៩ កេះ ១៩ ដប)"
const getFormattedBulkStock = (item) => {
    const qty = Number(item.quantity) || 0;
    
    if (item.unit !== 'case') {
        return `${Math.round(qty)} ${translateUnit(item.unit)}`;
    }

    const perCase = Number(item.itemsPerCase) || 1;
    const totalRetail = Math.round(qty * perCase);
    
    const fullCases = Math.floor(totalRetail / perCase);
    const remainingRetail = totalRetail % perCase;

    // លេខទសភាគដែល Fixed ចំនួន ២ ខ្ទង់ (ឧ. 9.95)
    const decimalDisplay = qty.toFixed(2).replace(/\.00$/, ''); 
    
    // បកប្រែជាភាសាខ្មែរ (៩ កេះ ១៩ ដប)
    let readableStr = `${fullCases} កេះ`;
    if (remainingRetail > 0) {
        readableStr += ` ${remainingRetail} ${translateRetailUnit(item)}`;
        return `${decimalDisplay} កេះ <span class="text-[10px] text-slate-500 font-normal ml-1 border-l border-slate-600 pl-1">(${readableStr})</span>`;
    }
    
    return `${decimalDisplay} កេះ`;
};

const formatPrice = (val, currency) => {
  return val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + (currency === 'USD' ? ' $' : ' ៛');
};

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@300;400;700&display=swap');

.font-khmer {
  font-family: 'Kantumruy Pro', sans-serif;
}

.animate-fade-in { animation: fadeIn 0.4s ease-out; }
.animate-slide-down { animation: slideDown 0.3s ease-out; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: #171717; }
::-webkit-scrollbar-thumb { background: #404040; border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: #f59e0b; }
</style>