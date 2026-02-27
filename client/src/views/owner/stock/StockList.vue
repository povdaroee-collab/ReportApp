<template>
    <div class="animate-fade-in relative">
        
        <div class="mb-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <div class="relative w-full md:w-96 z-10">
                <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">🔍</span>
                <input 
                    :value="searchQuery" 
                    @input="$emit('update:searchQuery', $event.target.value)"
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
                    <div class="absolute bottom-2 left-2 bg-amber-500 text-black text-xs font-bold px-2 py-0.5 rounded shadow-md">
                        {{ item.currency === 'USD' ? '$' : '៛' }}
                    </div>
                </div>

                <div class="p-4 flex-1 flex flex-col">
                    <h3 class="text-lg font-bold text-white mb-1 truncate" :title="item.name">{{ item.name }}</h3>
                    
                    <div class="flex flex-col gap-1 text-sm text-neutral-400 mb-3 border-b border-neutral-700/50 pb-2">
                        <div class="flex justify-between items-center">
                            <span>ស្តុកធំ (Bulk):</span>
                            <span class="text-emerald-400 font-bold bg-emerald-400/10 px-2 py-0.5 rounded text-xs" v-html="getFormattedBulkStock(item)"></span>
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

                    <div v-if="item.unit === 'case'" class="text-xs text-neutral-500 mb-3 bg-neutral-900 p-2 rounded border border-neutral-800 flex justify-between">
                        <span>១ កេះ = <strong class="text-amber-400">{{ item.itemsPerCase }}</strong> ដប/កញ្ចប់</span>
                    </div>

                    <div class="mt-auto flex justify-between items-end pt-2">
                        <div>
                            <p class="text-[10px] text-neutral-500">តម្លៃដើម/ឯកតា</p>
                            <p class="text-amber-400 font-bold">{{ formatPrice(item.unitCost, item.currency) }}</p>
                        </div>
                        <div class="flex gap-2">
                            <button @click="openEditModal(item)" class="p-2 bg-neutral-700 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-sm" title="កែប្រែរហ័ស">
                                ✏️
                            </button>
                            <button @click="$emit('delete', item)" class="p-2 bg-neutral-700 hover:bg-rose-600 text-rose-300 hover:text-white rounded-lg transition-colors shadow-sm" title="បញ្ជូនទៅធុងសម្រាម">
                                🗑️
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div v-if="totalPages > 1" class="flex justify-center gap-2 mt-8">
            <button @click="$emit('page-change', currentPage - 1)" :disabled="currentPage === 1" class="px-4 py-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 disabled:opacity-50 text-sm">Previous</button>
            <span class="px-4 py-2 bg-neutral-900 rounded-lg border border-neutral-700 text-amber-500 font-bold">{{ currentPage }} / {{ totalPages }}</span>
            <button @click="$emit('page-change', currentPage + 1)" :disabled="currentPage === totalPages" class="px-4 py-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 disabled:opacity-50 text-sm">Next</button>
        </div>

        <transition name="modal-fade">
            <div v-if="isEditModalOpen" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" @click.self="closeEditModal">
                <div class="bg-neutral-900 border border-neutral-700 rounded-2xl w-full max-w-md shadow-2xl flex flex-col overflow-hidden animate-slide-up">
                    
                    <div class="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-800/50 shrink-0">
                        <h3 class="text-white font-bold flex items-center gap-2">
                            ✏️ កែប្រែទិន្នន័យរហ័ស
                        </h3>
                        <button @click="closeEditModal" class="text-neutral-400 hover:text-rose-500 transition-colors">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>

                    <div class="p-6 overflow-y-auto custom-scrollbar max-h-[70vh]">
                        <p class="text-sm text-neutral-300 font-bold mb-4 line-clamp-1">ទំនិញ: <span class="text-amber-400">{{ selectedItem?.name }}</span></p>
                        
                        <div 
                            class="relative h-48 w-full rounded-xl border-2 border-dashed border-neutral-600 hover:border-amber-400 transition-colors flex flex-col items-center justify-center cursor-pointer bg-neutral-800 group overflow-hidden mb-5"
                            @click="$refs.fileInputModal.click()"
                        >
                            <img v-if="editForm.imagePreview" :src="editForm.imagePreview" class="absolute inset-0 w-full h-full object-cover">
                            <img v-else-if="selectedItem?.image" :src="selectedItem.image" class="absolute inset-0 w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 transition-all">
                            
                            <div class="text-center p-4 relative z-10 bg-black/40 rounded-lg backdrop-blur-sm group-hover:scale-105 transition-transform">
                                <div class="text-3xl mb-1">📷</div>
                                <span class="text-xs text-white font-bold drop-shadow-md">ចុចជ្រើសរើសរូបភាពថ្មី</span>
                            </div>
                            <input type="file" ref="fileInputModal" class="hidden" accept="image/*" @change="handleModalImageUpload">
                        </div>

                        <div v-if="selectedItem?.unit === 'case'" class="bg-neutral-800 p-4 rounded-xl border border-neutral-700 mb-5">
                            <label class="block text-xs font-bold text-amber-500 mb-2">📦 ចំនួនរាយក្នុង ១ កេះ</label>
                            <div class="flex gap-2">
                                <input v-model.number="editForm.itemsPerCase" type="number" min="1" class="w-full bg-neutral-900 border border-neutral-600 rounded-lg px-4 py-3 text-white font-bold focus:border-amber-500 outline-none transition-all">
                                <div class="flex items-center px-4 bg-neutral-900 border border-neutral-600 rounded-lg text-sm text-neutral-400 shrink-0">
                                    ដប/កញ្ចប់
                                </div>
                            </div>
                        </div>

                        <div class="bg-neutral-800 p-4 rounded-xl border border-neutral-700">
                            <div class="flex justify-between items-center mb-3">
                                <label class="block text-xs font-bold text-emerald-400">💰 តម្លៃទិញចូល (Cost)</label>
                                <div class="flex gap-1 bg-neutral-900 p-1 rounded-lg">
                                    <button type="button" @click="editForm.costMode = 'unit'" :class="editForm.costMode === 'unit' ? 'bg-neutral-700 text-white' : 'text-neutral-500'" class="px-2 py-1.5 rounded text-[10px] font-bold transition-all">១ ឯកតា</button>
                                    <button type="button" @click="editForm.costMode = 'total'" :class="editForm.costMode === 'total' ? 'bg-neutral-700 text-white' : 'text-neutral-500'" class="px-2 py-1.5 rounded text-[10px] font-bold transition-all">សរុប</button>
                                </div>
                            </div>

                            <div class="relative mb-3">
                                <div class="absolute left-4 top-3 text-amber-500 font-bold">
                                    {{ selectedItem?.currency === 'USD' ? '$' : '៛' }}
                                </div>
                                <input v-model.number="editForm.inputCost" type="number" step="any" min="0" required class="w-full bg-neutral-900 border border-neutral-600 rounded-lg pl-8 pr-4 py-3 text-white font-bold focus:border-amber-500 outline-none transition-all">
                            </div>

                            <div class="text-[11px] text-neutral-400 bg-neutral-900/50 p-3 rounded-lg border border-neutral-700/50 flex flex-col gap-2">
                                <div class="flex justify-between items-center">
                                    <span>តម្លៃដើម/ឯកតា (Unit Cost):</span>
                                    <span class="text-amber-400 font-bold text-sm">{{ formatPrice(editCalculatedUnitCost, selectedItem?.currency) }}</span>
                                </div>
                                <div class="w-full h-px bg-neutral-700/50"></div>
                                <div class="flex justify-between items-center">
                                    <span>តម្លៃសរុប (Total Cost):</span>
                                    <span class="text-emerald-400 font-bold text-sm">{{ formatPrice(editCalculatedTotalCost, selectedItem?.currency) }}</span>
                                </div>
                                <p class="text-[9px] text-neutral-500 italic text-center mt-1">* ផ្អែកលើស្តុកបច្ចុប្បន្ន: {{ selectedItem?.quantity }} {{ translateUnit(selectedItem?.unit) }}</p>
                            </div>
                        </div>

                    </div>

                    <div class="p-4 border-t border-neutral-800 bg-neutral-800/30 flex gap-3 shrink-0">
                        <button @click="closeEditModal" class="flex-1 py-3 rounded-xl text-neutral-400 font-bold bg-neutral-800 hover:text-white transition-colors text-sm">បោះបង់</button>
                        <button @click="saveQuickEdit" :disabled="isSaving || (selectedItem?.unit === 'case' && editForm.itemsPerCase < 1)" class="flex-1 py-3 rounded-xl bg-amber-500 text-black font-black hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 text-sm shadow-md shadow-amber-500/20">
                            <span v-if="isSaving" class="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full"></span>
                            រក្សាទុកការកែប្រែ
                        </button>
                    </div>

                </div>
            </div>
        </transition>

    </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { db } from '@/firebaseConfig';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useNotificationStore } from '@/stores/notification';

const props = defineProps({
    filteredStock: Array,
    paginatedStock: Array,
    searchQuery: String,
    currentPage: Number,
    totalPages: Number
});

const emit = defineEmits(['update:searchQuery', 'delete', 'page-change']);
const notification = useNotificationStore();

// --- QUICK EDIT MODAL LOGIC ---
const isEditModalOpen = ref(false);
const selectedItem = ref(null);
const isSaving = ref(false);
const fileInputModal = ref(null);

const editForm = reactive({
    imagePreview: null,
    itemsPerCase: 1,
    costMode: 'unit', // 'unit' or 'total'
    inputCost: 0
});

const openEditModal = (item) => {
    selectedItem.value = item;
    
    // Reset Data
    editForm.imagePreview = null; 
    editForm.itemsPerCase = item.itemsPerCase || 1; 
    editForm.costMode = 'unit'; // Default view
    editForm.inputCost = item.unitCost || 0; // Load current unit cost
    
    isEditModalOpen.value = true;
};

const closeEditModal = () => {
    isEditModalOpen.value = false;
    selectedItem.value = null;
    editForm.imagePreview = null;
};

// Calculations for Cost Preview
const editCalculatedUnitCost = computed(() => {
    if (!selectedItem.value || selectedItem.value.quantity <= 0) return 0;
    if (editForm.costMode === 'total') {
        return editForm.inputCost / selectedItem.value.quantity;
    }
    return editForm.inputCost;
});

const editCalculatedTotalCost = computed(() => {
    if (!selectedItem.value) return 0;
    if (editForm.costMode === 'unit') {
        return editForm.inputCost * selectedItem.value.quantity;
    }
    return editForm.inputCost;
});

// Image Compression Logic
const handleModalImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.match('image.*')) {
        return notification.error('សូមជ្រើសរើសប្រភេទជារូបភាព');
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            const MAX_WIDTH = 600;

            if (width > MAX_WIDTH) {
                height = Math.round((height * MAX_WIDTH) / width);
                width = MAX_WIDTH;
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            editForm.imagePreview = canvas.toDataURL('image/jpeg', 0.8); 
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
    event.target.value = ''; 
};

// 🔥 Save Update to Firebase
const saveQuickEdit = async () => {
    if (!selectedItem.value) return;
    isSaving.value = true;
    
    try {
        const updateData = { updatedAt: serverTimestamp() };
        
        // ១. Update រូបភាពបើមានការដូរ
        if (editForm.imagePreview) {
            updateData.image = editForm.imagePreview;
        }
        
        // ២. Update ចំនួនរាយក្នុងកេះ (បើខ្នាតជាកេះ)
        if (selectedItem.value.unit === 'case') {
            updateData.itemsPerCase = Number(editForm.itemsPerCase);
        }

        // ៣. Update តម្លៃទិញចូល (Cost)
        updateData.unitCost = Number(editCalculatedUnitCost.value);
        updateData.totalCost = Number(editCalculatedTotalCost.value);

        // Save ចូល Database
        await updateDoc(doc(db, 'stocks', selectedItem.value.id), updateData);
        
        notification.success("ទិន្នន័យត្រូវបានកែប្រែដោយជោគជ័យ!");
        closeEditModal();
        
    } catch (error) {
        console.error("Error updating quick edit:", error);
        notification.error("មានបញ្ហាក្នុងការរក្សាទុកទិន្នន័យ");
    } finally {
        isSaving.value = false;
    }
};

// --- DISPLAY FORMATTERS ---
const formatPrice = (val, currency) => {
    return Number(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + (currency === 'USD' ? ' $' : ' ៛');
};

const translateUnit = (unit) => {
    const map = { bottle: 'ដប', case: 'កេះ', pack: 'កញ្ចប់', can: 'កំប៉ុង', kg: 'គីឡូ' };
    return map[unit] || unit;
};

const translateRetailUnit = (item) => {
    if (item.unit === 'case') return 'ដប/កញ្ចប់'; 
    return translateUnit(item.unit);
};

const getExactRetailStock = (item) => {
    const qty = Number(item.quantity) || 0;
    if (item.unit === 'case') return Math.round(qty * (Number(item.itemsPerCase) || 1));
    return Math.round(qty);
};

const getExactReservedRetailStock = (item) => {
    const reserved = Number(item.stock_reserved) || 0;
    if (item.unit === 'case') return Math.round(reserved * (Number(item.itemsPerCase) || 1));
    return Math.round(reserved);
};

const getFormattedBulkStock = (item) => {
    const qty = Number(item.quantity) || 0;
    if (item.unit !== 'case') return `${Math.round(qty)} ${translateUnit(item.unit)}`;
    
    const perCase = Number(item.itemsPerCase) || 1;
    const totalRetail = Math.round(qty * perCase);
    const fullCases = Math.floor(totalRetail / perCase);
    const remainingRetail = totalRetail % perCase;
    const decimalDisplay = qty.toFixed(2).replace(/\.00$/, ''); 
    
    let readableStr = `${fullCases} កេះ`;
    if (remainingRetail > 0) {
        readableStr += ` ${remainingRetail} ${translateRetailUnit(item)}`;
        return `${decimalDisplay} កេះ <span class="text-[10px] text-neutral-400 font-normal ml-1 border-l border-neutral-600 pl-1">(${readableStr})</span>`;
    }
    return `${decimalDisplay} កេះ`;
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #52525b; border-radius: 10px; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #71717a; }

.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.2s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.animate-slide-up { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
</style>