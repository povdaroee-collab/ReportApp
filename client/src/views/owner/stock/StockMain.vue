<template>
  <div class="min-h-screen bg-neutral-900 text-slate-200 font-khmer p-4 md:p-8">
    
    <Toast />
    <ConfirmDialog ref="confirmDialogRef" />

    <div class="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 gap-4">
      <div>
        <h1 class="text-3xl font-bold bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
          📦 គ្រប់គ្រងស្តុកទំនិញ
        </h1>
        <p class="text-neutral-400 text-sm mt-1 flex items-center gap-2">
            ប្រព័ន្ធគ្រប់គ្រងឃ្លាំង និងតម្លៃទុន 
            <span class="flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Real-time
            </span>
        </p>
      </div>

      <div class="flex flex-wrap justify-center bg-neutral-800 p-1.5 rounded-xl border border-neutral-700 gap-1 shadow-inner">
        <button @click="activeTab = 'add'" :class="activeTab === 'add' ? 'bg-gradient-to-r from-amber-400 to-yellow-600 text-black shadow-lg' : 'text-neutral-400 hover:text-white hover:bg-neutral-700'" class="px-4 md:px-5 py-2.5 rounded-lg text-xs md:text-sm font-bold transition-all duration-300">
          ➕ បញ្ចូលស្តុកថ្មី
        </button>
        
        <button @click="activeTab = 'list'" :class="activeTab === 'list' ? 'bg-gradient-to-r from-amber-400 to-yellow-600 text-black shadow-lg' : 'text-neutral-400 hover:text-white hover:bg-neutral-700'" class="px-4 md:px-5 py-2.5 rounded-lg text-xs md:text-sm font-bold transition-all duration-300 flex items-center gap-2">
          📋 បញ្ជីស្តុក <span class="bg-neutral-900/50 px-2 py-0.5 rounded-md text-[10px]">{{ stockList.length }}</span>
        </button>
        
        <button @click="activeTab = 'inout'" :class="activeTab === 'inout' ? 'bg-gradient-to-r from-amber-400 to-yellow-600 text-black shadow-lg' : 'text-neutral-400 hover:text-white hover:bg-neutral-700'" class="px-4 md:px-5 py-2.5 rounded-lg text-xs md:text-sm font-bold transition-all duration-300 flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m-4 4l4-4m0 6H4m0 0l4 4m-4-4l-4 4"></path></svg>
          នាំចូល/ដកចេញ
        </button>

        <button @click="activeTab = 'trash'" :class="activeTab === 'trash' ? 'bg-rose-600 text-white shadow-lg' : 'text-rose-400 hover:text-rose-300 hover:bg-rose-500/10'" class="px-4 md:px-5 py-2.5 rounded-lg text-xs md:text-sm font-bold transition-all duration-300 flex items-center gap-2 ml-1 border border-rose-900/50">
          🗑️ ធុងសម្រាម <span v-if="deletedStocks.length > 0" class="bg-rose-500 text-white px-2 py-0.5 rounded-md text-[10px]">{{ deletedStocks.length }}</span>
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
    </div>

    <div v-else>
        <StockAdd 
            v-if="activeTab === 'add'" 
            v-model="form" 
            :isEditing="isEditing" 
            :duplicateDetected="duplicateDetected" 
            :isSaving="isSaving"
            @save="saveProduct" 
            @reset="resetForm" 
            @image-upload="handleImageUpload" 
            @go-to-stock-in="activeTab = 'inout'"
        />
        
        <StockList 
            v-else-if="activeTab === 'list'" 
            :filteredStock="filteredStock" 
            :paginatedStock="paginatedStock" 
            v-model:searchQuery="searchQuery" 
            :currentPage="currentPage" 
            :totalPages="totalPages" 
            @edit="editItem" 
            @delete="moveToTrash" 
            @update-image="handleUpdateImageOnly"
            @page-change="p => currentPage = p" 
        />

        <StockInOut 
            v-else-if="activeTab === 'inout'"
            :products="stockList"
        />

        <StockTrash 
            v-else-if="activeTab === 'trash'"
            :deletedStocks="deletedStocks"
            @restore="restoreFromTrash"
            @hard-delete="permanentDelete"
        />
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

// នាំចូលឯកសារតូចៗ
import StockAdd from './StockAdd.vue';
import StockList from './StockList.vue';
import StockInOut from './StockInOut.vue';
import StockTrash from './StockTrash.vue'; 

const notification = useNotificationStore();
const confirmDialogRef = ref(null);

const activeTab = ref('list'); 
const stockList = ref([]);
const deletedStocks = ref([]); 
const isEditing = ref(false);
const duplicateDetected = ref(false); 
const currentPage = ref(1);
const itemsPerPage = 40;
const isLoading = ref(false);
const isSaving = ref(false);
const searchQuery = ref(''); 
let unsubscribeStocks = null; 

// 🌟 បន្ថែម State ថ្មីៗចូលក្នុង Form (Category, itemsPerBox, colors, sizes) 🌟
const form = reactive({
  id: null, 
  name: '', 
  barcode: '', 
  imagePreview: null,
  category: 'DFG', // 👈 Default Category
  quantity: 0, 
  unit: 'case', 
  itemsPerCase: 12, 
  itemsPerBox: 50, // 👈 សម្រាប់ "ម៉ាស់" (១ប្រអប់មាន ៥០សន្លឹក)
  currency: 'USD',
  costMode: 'total', 
  inputCost: 0,
  mfgDate: '', 
  expDate: '',
  colors: [], // 👈 ពណ៌
  sizes: []   // 👈 ទំហំ
});

const generateBarcode = () => `STK-${Date.now().toString().slice(-6)}${Math.floor(1000 + Math.random() * 9000)}`;

const fetchStocks = () => {
    isLoading.value = true;
    unsubscribeStocks = onSnapshot(collection(db, "stocks"), (snap) => {
        const rawDocs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // ញែកទិន្នន័យជា ២ ចំណែក
        stockList.value = rawDocs.filter(item => item.isDeleted !== true).sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        deletedStocks.value = rawDocs.filter(item => item.isDeleted === true).sort((a, b) => (b.deletedAt?.seconds || 0) - (a.deletedAt?.seconds || 0));
        
        isLoading.value = false;
    }, () => {
        notification.error("បរាជ័យក្នុងការភ្ជាប់ទិន្នន័យស្តុក"); 
        isLoading.value = false;
    });
};

onMounted(() => { 
    fetchStocks(); 
    if (!isEditing.value) form.barcode = generateBarcode(); 
});

onUnmounted(() => { 
    if (unsubscribeStocks) unsubscribeStocks(); 
});

// Smart Duplicate Detection (Update to include new fields)
watch(() => form.name, (newName) => {
    if (activeTab.value !== 'add' || !newName) return;
    const existing = stockList.value.find(item => item.name.toLowerCase() === newName.trim().toLowerCase());
    if (existing) {
        if (form.id !== existing.id) {
            isEditing.value = true; duplicateDetected.value = true;
            Object.assign(form, { 
                id: existing.id, 
                name: existing.name,
                barcode: existing.barcode, 
                imagePreview: existing.image, 
                category: existing.category || 'DFG',
                quantity: existing.quantity, 
                unit: existing.unit || 'bottle', 
                itemsPerCase: existing.itemsPerCase || 12, 
                itemsPerBox: existing.itemsPerBox || 1,
                currency: existing.currency, 
                costMode: 'unit', 
                inputCost: existing.unitCost,
                mfgDate: existing.mfgDate || '', 
                expDate: existing.expDate || '',
                colors: existing.colors || [],
                sizes: existing.sizes || []
            });
        }
    } else if (duplicateDetected.value) {
        isEditing.value = false; 
        duplicateDetected.value = false; 
        form.id = null; 
        form.barcode = generateBarcode(); 
        form.mfgDate = ''; 
        form.expDate = '';
        form.colors = [];
        form.sizes = [];
    }
});

const saveProduct = async () => {
  isSaving.value = true;
  let finalUnitCost = form.costMode === 'total' ? (form.quantity > 0 ? form.inputCost / form.quantity : 0) : form.inputCost;

  // 🌟 បង្កើត Payload ទិន្នន័យលម្អិត 🌟
  const productData = {
    name: form.name, 
    barcode: form.barcode, 
    image: form.imagePreview, 
    category: form.category,
    quantity: form.quantity,
    unit: form.unit, 
    itemsPerCase: form.unit === 'case' ? form.itemsPerCase : null,
    itemsPerBox: (form.unit === 'case' && form.category === 'ម៉ាស់') ? form.itemsPerBox : null,
    currency: form.currency, 
    unitCost: finalUnitCost, 
    totalCost: finalUnitCost * form.quantity, 
    mfgDate: form.mfgDate || null, 
    expDate: form.expDate || null, 
    colors: (form.category === 'ខោ' || form.category === 'អាវ') ? form.colors : [],
    sizes: (form.category === 'ខោ' || form.category === 'អាវ') ? form.sizes : [],
    updatedAt: serverTimestamp(),
    isDeleted: false 
  };

  try {
      if (isEditing.value && form.id) {
        await updateDoc(doc(db, "stocks", form.id), productData);
        notification.success("បានកែប្រែព័ត៌មានស្តុកដោយជោគជ័យ!");
      } else {
        productData.createdAt = serverTimestamp(); 
        productData.stock_reserved = 0; 
        await addDoc(collection(db, "stocks"), productData);
        notification.success("បានបង្កើតស្តុកថ្មីដោយជោគជ័យ!");
      }
      resetForm();
  } catch (error) { 
      notification.error("មានបញ្ហាក្នុងការរក្សាទុកទិន្នន័យ"); 
  } finally { 
      isSaving.value = false; 
  }
};

const handleUpdateImageOnly = async ({ id, image }) => {
    try {
        await updateDoc(doc(db, "stocks", id), { image: image, updatedAt: serverTimestamp() });
        notification.success("រូបភាពត្រូវបានផ្លាស់ប្ដូរដោយជោគជ័យ!");
    } catch (error) {
        notification.error("បរាជ័យក្នុងការផ្លាស់ប្ដូររូបភាព");
    }
};

const moveToTrash = async (item) => {
  if (await confirmDialogRef.value.open("បញ្ជូនទៅធុងសម្រាម?", `តើអ្នកចង់បញ្ជូន "${item.name}" ទៅធុងសម្រាមមែនទេ? \n\n(ទំនិញនេះនឹងលែងអាចលក់បាន ប៉ុន្តែអ្នកអាចទាញយកមកវិញបាននៅផ្ទាំងធុងសម្រាម)`)) {
    try {
        await updateDoc(doc(db, "stocks", item.id), { 
            isDeleted: true,
            deletedAt: serverTimestamp() 
        });
        notification.success("ទំនិញត្រូវបានបញ្ជូនទៅធុងសម្រាម!");
    } catch (error) { notification.error("បរាជ័យក្នុងការបញ្ជូនទៅធុងសម្រាម"); }
  }
};

const restoreFromTrash = async (item) => {
    try {
        await updateDoc(doc(db, "stocks", item.id), { 
            isDeleted: false 
        });
        notification.success(`បានស្តារទំនិញ "${item.name}" មកវិញដោយជោគជ័យ!`);
    } catch (error) {
        notification.error("បរាជ័យក្នុងការទាញទិន្នន័យមកវិញ");
    }
};

const permanentDelete = async (item) => {
    if (await confirmDialogRef.value.open("⚠️ លុបជារៀងរហូត?", `តើអ្នកពិតជាចង់លុបទំនិញ "${item.name}" ជារៀងរហូតមែនទេ?\n\nទិន្នន័យដែលលុបហើយ មិនអាចទាញយកមកវិញបានឡើយ!`)) {
        try {
            await deleteDoc(doc(db, "stocks", item.id));
            notification.success("ទិន្នន័យត្រូវបានលុបចោលជារៀងរហូត!");
        } catch (error) {
            notification.error("បរាជ័យក្នុងការលុប");
        }
    }
};

const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  if (file.size > 1.5 * 1024 * 1024) return notification.error("សូមមេត្តាជ្រើសរើសរូបភាពដែលមានទំហំក្រោម 1.5MB");
  const reader = new FileReader();
  reader.onload = (e) => { form.imagePreview = e.target.result; };
  reader.readAsDataURL(file);
};

const resetForm = () => {
  Object.assign(form, { 
      id: null, name: '', barcode: generateBarcode(), imagePreview: null, 
      category: 'DFG', quantity: 0, unit: 'case', itemsPerCase: 12, itemsPerBox: 50, 
      currency: 'USD', costMode: 'total', inputCost: 0, mfgDate: '', expDate: '',
      colors: [], sizes: []
  });
  isEditing.value = false; duplicateDetected.value = false;
};

const editItem = (item) => {
  isEditing.value = true; duplicateDetected.value = false; activeTab.value = 'add';
  Object.assign(form, { 
      id: item.id, name: item.name, barcode: item.barcode, imagePreview: item.image, 
      category: item.category || 'DFG', quantity: item.quantity, unit: item.unit || 'bottle', 
      itemsPerCase: item.itemsPerCase || 12, itemsPerBox: item.itemsPerBox || 1, 
      currency: item.currency, costMode: 'unit', inputCost: item.unitCost, 
      mfgDate: item.mfgDate || '', expDate: item.expDate || '',
      colors: item.colors || [], sizes: item.sizes || []
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const filteredStock = computed(() => {
    if (!searchQuery.value) return stockList.value;
    const q = searchQuery.value.toLowerCase();
    return stockList.value.filter(item => item.name.toLowerCase().includes(q) || (item.barcode && item.barcode.toLowerCase().includes(q)));
});

const totalPages = computed(() => Math.ceil(filteredStock.value.length / itemsPerPage) || 1);
const paginatedStock = computed(() => filteredStock.value.slice((currentPage.value - 1) * itemsPerPage, currentPage.value * itemsPerPage));
watch(searchQuery, () => { currentPage.value = 1; });
</script>