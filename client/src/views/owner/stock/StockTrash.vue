<template>
    <div class="animate-fade-in relative">
        
        <div class="mb-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <div class="relative w-full md:w-96 z-10">
                <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">🔍</span>
                <input 
                    v-model="searchQuery"
                    type="text" 
                    placeholder="ស្វែងរកទំនិញដែលបានលុប..." 
                    class="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:border-rose-500 outline-none transition-all focus:ring-1 focus:ring-rose-500/50"
                >
            </div>
            <span class="text-xs text-neutral-500">ទំនិញក្នុងធុងសម្រាមសរុប៖ {{ filteredTrash.length }}</span>
        </div>

        <div v-if="filteredTrash.length === 0" class="flex flex-col items-center justify-center h-64 text-neutral-500 bg-neutral-800/30 rounded-2xl border border-neutral-800 border-dashed mt-6">
            <div class="text-5xl mb-3 opacity-50">🗑️</div>
            <p class="font-bold">ធុងសម្រាមទទេស្អាត</p>
            <p class="text-xs mt-1 opacity-70">មិនមានទំនិញដែលត្រូវបានលុបនោះទេ</p>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
            <div v-for="item in filteredTrash" :key="item.id" class="bg-neutral-800/80 rounded-xl border border-rose-900/30 overflow-hidden hover:border-rose-500/50 transition-all group shadow-lg flex flex-col relative">
                
                <div class="absolute top-2 left-2 z-10 bg-rose-500 text-white text-[10px] font-black px-2 py-1 rounded shadow-md flex items-center gap-1">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    បានលុប
                </div>

                <div class="relative h-40 bg-neutral-900 shrink-0">
                    <img :src="item.image || 'https://via.placeholder.com/300x200?text=No+Image'" class="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-500">
                    <div class="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] text-white font-mono border border-white/10">
                        {{ item.barcode }}
                    </div>
                </div>

                <div class="p-4 flex-1 flex flex-col">
                    <h3 class="text-lg font-bold text-neutral-300 mb-1 line-clamp-1 opacity-80 line-through decoration-rose-500/50">{{ item.name }}</h3>
                    
                    <div class="text-xs text-neutral-500 mb-4 bg-neutral-900/50 p-2 rounded border border-neutral-800">
                        ស្តុកនៅសល់: <span class="text-amber-500 font-bold">{{ item.quantity }}</span> | ខ្នាត: <span class="text-amber-500 font-bold">{{ item.unit }}</span>
                    </div>

                    <div class="mt-auto grid grid-cols-2 gap-2 pt-2 border-t border-neutral-700/50">
                        <button @click="$emit('restore', item)" class="py-2.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white rounded-lg transition-all text-xs font-bold flex justify-center items-center gap-1 shadow-sm">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                            ទាញមកវិញ
                        </button>
                        <button @click="$emit('hard-delete', item)" class="py-2.5 bg-rose-500/10 hover:bg-rose-600 text-rose-500 hover:text-white rounded-lg transition-all text-xs font-bold flex justify-center items-center gap-1 shadow-sm">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            លុបរៀងរហូត
                        </button>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
    deletedStocks: {
        type: Array,
        required: true
    }
});

const emit = defineEmits(['restore', 'hard-delete']);

const searchQuery = ref('');

const filteredTrash = computed(() => {
    if (!searchQuery.value) return props.deletedStocks;
    const q = searchQuery.value.toLowerCase();
    return props.deletedStocks.filter(item => 
        item.name.toLowerCase().includes(q) || 
        (item.barcode && item.barcode.toLowerCase().includes(q))
    );
});
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
</style>