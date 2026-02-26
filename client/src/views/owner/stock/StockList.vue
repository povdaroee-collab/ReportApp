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
                    </div>

                    <div v-if="item.unit === 'case'" class="text-xs text-neutral-500 mb-3 bg-neutral-900 p-2 rounded border border-neutral-800">
                        ១ កេះ = {{ item.itemsPerCase }} ដប/កញ្ចប់
                    </div>

                    <div class="mt-auto flex justify-between items-end pt-2">
                        <div>
                            <p class="text-[10px] text-neutral-500">តម្លៃដើម/ឯកតា</p>
                            <p class="text-amber-400 font-bold">{{ formatPrice(item.unitCost, item.currency) }}</p>
                        </div>
                        <div class="flex gap-2">
                            <button @click="openImageModal(item)" class="p-2 bg-neutral-700 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-sm" title="ប្ដូររូបភាព">
                                🖼️
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
            <div v-if="isImageModalOpen" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" @click.self="closeImageModal">
                <div class="bg-neutral-900 border border-neutral-700 rounded-2xl w-full max-w-md shadow-2xl flex flex-col overflow-hidden animate-slide-up">
                    
                    <div class="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-800/50">
                        <h3 class="text-white font-bold flex items-center gap-2">
                            🖼️ ប្ដូររូបភាពទំនិញ
                        </h3>
                        <button @click="closeImageModal" class="text-neutral-400 hover:text-rose-500 transition-colors">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>

                    <div class="p-6">
                        <p class="text-sm text-neutral-300 font-bold mb-4 line-clamp-1">ទំនិញ: <span class="text-amber-400">{{ selectedItemForImage?.name }}</span></p>
                        
                        <div 
                            class="relative h-48 w-full rounded-xl border-2 border-dashed border-neutral-600 hover:border-amber-400 transition-colors flex flex-col items-center justify-center cursor-pointer bg-neutral-800 group overflow-hidden"
                            @click="$refs.fileInputModal.click()"
                        >
                            <img v-if="newImagePreview" :src="newImagePreview" class="absolute inset-0 w-full h-full object-cover">
                            <img v-else-if="selectedItemForImage?.image" :src="selectedItemForImage.image" class="absolute inset-0 w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 transition-all">
                            
                            <div class="text-center p-4 relative z-10 bg-black/40 rounded-lg backdrop-blur-sm group-hover:scale-105 transition-transform">
                                <div class="text-3xl mb-1">📷</div>
                                <span class="text-xs text-white font-bold drop-shadow-md">ចុចជ្រើសរើសរូបភាពថ្មី</span>
                            </div>
                            <input type="file" ref="fileInputModal" class="hidden" accept="image/*" @change="handleModalImageUpload">
                        </div>
                    </div>

                    <div class="p-4 border-t border-neutral-800 bg-neutral-800/30 flex gap-3">
                        <button @click="closeImageModal" class="flex-1 py-2.5 rounded-xl text-neutral-400 font-bold bg-neutral-800 hover:text-white transition-colors">បោះបង់</button>
                        <button @click="saveNewImage" :disabled="!newImagePreview || isSavingImage" class="flex-1 py-2.5 rounded-xl bg-amber-500 text-black font-black hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2">
                            <span v-if="isSavingImage" class="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full"></span>
                            រក្សាទុករូបភាព
                        </button>
                    </div>

                </div>
            </div>
        </transition>

    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useNotificationStore } from '@/stores/notification';

const props = defineProps({
    filteredStock: Array,
    paginatedStock: Array,
    searchQuery: String,
    currentPage: Number,
    totalPages: Number
});

const emit = defineEmits(['update:searchQuery', 'delete', 'page-change', 'update-image']);
const notification = useNotificationStore();

// --- IMAGE MODAL LOGIC ---
const isImageModalOpen = ref(false);
const selectedItemForImage = ref(null);
const newImagePreview = ref(null);
const isSavingImage = ref(false);
const fileInputModal = ref(null);

const openImageModal = (item) => {
    selectedItemForImage.value = item;
    newImagePreview.value = null;
    isImageModalOpen.value = true;
};

const closeImageModal = () => {
    isImageModalOpen.value = false;
    selectedItemForImage.value = null;
    newImagePreview.value = null;
};

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
            const MAX_WIDTH = 500; // Resize to save DB space

            if (width > MAX_WIDTH) {
                height = Math.round((height * MAX_WIDTH) / width);
                width = MAX_WIDTH;
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            newImagePreview.value = canvas.toDataURL('image/webp', 0.8); 
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
    event.target.value = ''; // Reset input
};

const saveNewImage = () => {
    if (!newImagePreview.value || !selectedItemForImage.value) return;
    isSavingImage.value = true;
    
    // បាញ់ទិន្នន័យទៅឱ្យ StockMain.vue ដើម្បី Save ចូល Firebase
    emit('update-image', { 
        id: selectedItemForImage.value.id, 
        image: newImagePreview.value 
    });
    
    setTimeout(() => {
        isSavingImage.value = false;
        closeImageModal();
    }, 500); // Fake delay to show loading animation slightly
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
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.2s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.animate-slide-up { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
</style>