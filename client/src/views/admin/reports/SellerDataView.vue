<template>
  <div class="font-khmer">
    
    <div v-if="viewMode === 'list'" class="hidden md:block overflow-hidden bg-white rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/80">
      <div class="overflow-x-auto custom-scrollbar">
        <table class="w-full text-left min-w-[1100px] border-collapse">
          <thead class="bg-slate-50/80 text-[11px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200">
            <tr>
              <th class="px-6 py-5 w-16 text-center">#</th>
              <th class="px-6 py-5 w-[280px]">តំណាងលក់ (SELLER)</th>
              <th class="px-6 py-5 w-28 text-center">ប្រភេទ</th>
              <th class="px-6 py-5">មុខទំនិញ (PRODUCTS)</th>
              <th class="px-6 py-5 w-36 text-center">បរិមាណលក់</th>
              <th class="px-6 py-5 w-28 text-center">អតិថិជន</th>
              <th class="px-6 py-5 text-right w-36">ចំណូលសរុប</th>
              <th class="px-6 py-5 text-center w-24 border-l border-slate-100">សកម្មភាព</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-sm">
            <tr v-if="data.length === 0">
               <td colspan="8" class="px-6 py-16 text-center text-slate-400 font-bold">មិនមានទិន្នន័យបង្ហាញទេ</td>
            </tr>
            <tr v-for="(item, index) in data" :key="item.uniqueId" class="hover:bg-indigo-50/30 transition-colors group">
              
              <td class="px-6 py-4 text-center text-slate-400 font-black text-xs">{{ index + 1 + startIndex }}</td>
              
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="relative shrink-0">
                    <img :src="item.photoUrl || `https://ui-avatars.com/api/?name=${item.fullName}`" class="w-11 h-11 rounded-[14px] object-cover shadow-sm border border-slate-200 bg-slate-50" />
                    <div v-if="item.hasSales" class="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div class="min-w-0">
                    <p class="font-black text-slate-800 flex items-center gap-1.5 text-[13px] truncate">
                      {{ item.fullName }}
                      <span v-if="item.role === 'dealer'" class="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[8px] px-1.5 py-0.5 rounded shadow-sm tracking-wider">DEALER</span>
                    </p>
                    <p class="text-[10px] text-slate-400 font-mono mt-0.5 truncate">ID: {{ item.idNumber || 'N/A' }}</p>
                  </div>
                </div>
              </td>

              <td class="px-6 py-4 text-center">
                <span v-if="item.hasSales" class="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border shadow-sm"
                  :class="item.category === 'បោះដុំ' ? 'bg-purple-50 text-purple-700 border-purple-200' : (item.category === 'លក់រាយ' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-slate-50 text-slate-700 border-slate-200')">
                  {{ item.category }}
                </span>
                <span v-else class="text-[10px] font-bold text-slate-300">-</span>
              </td>

              <td class="px-6 py-4">
                <div v-if="item.hasSales && item.productNames && item.productNames.length > 0" class="flex flex-wrap gap-1.5 items-center">
                  <template v-for="(prod, pIdx) in getVisibleProducts(item)" :key="pIdx">
                    <span class="bg-white text-slate-700 border border-slate-200 shadow-sm px-2.5 py-1 rounded-md text-[10px] font-bold truncate max-w-[140px]" :title="prod">
                      {{ prod }}
                    </span>
                  </template>
                  <button v-if="item.productNames.length > 3" @click="toggleProducts(item.uniqueId)" class="text-[10px] font-black text-blue-500 hover:text-white hover:bg-blue-500 border border-blue-200 hover:border-blue-500 px-2 py-1 rounded-md transition-colors shadow-sm">
                    {{ expandedRows.has(item.uniqueId) ? 'បង្រួមវិញ' : `+${item.productNames.length - 3} ទៀត...` }}
                  </button>
                </div>
                <div v-else class="text-xs text-slate-300 font-bold">-</div>
              </td>

              <td class="px-6 py-4">
                <div v-if="item.hasSales" class="flex flex-col gap-1.5 items-center justify-center">
                   <span v-for="(count, unit) in item.unitCounts" :key="unit" class="inline-flex items-center justify-between w-full max-w-[100px] px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 shadow-sm text-[10px]">
                      <span class="font-black text-slate-700">{{ count.toLocaleString() }}</span>
                      <span class="font-bold text-slate-500 ml-1">{{ translateUnit(unit) }}</span>
                   </span>
                </div>
                <span v-else class="text-[10px] font-bold text-slate-300 flex justify-center">-</span>
              </td>

              <td class="px-6 py-4 text-center">
                <span v-if="item.hasSales" class="inline-flex items-center gap-1.5 bg-amber-50 text-amber-600 border border-amber-200 px-3 py-1.5 rounded-lg text-xs font-black shadow-sm">
                    <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
                    {{ item.totalClients.toLocaleString() }} នាក់
                </span>
                <span v-else class="text-[10px] font-bold text-slate-300">-</span>
              </td>

              <td class="px-6 py-4 text-right">
                <div v-if="item.hasSales" class="flex flex-col items-end gap-1">
                   <span v-if="item.revenueUSD > 0" class="font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 shadow-sm text-sm tracking-tight">{{ item.revenueUSD.toLocaleString() }} $</span>
                   <span v-if="item.revenueKHR > 0" class="font-black text-blue-600 text-xs mt-0.5">{{ item.revenueKHR.toLocaleString() }} ៛</span>
                </div>
                <span v-else class="text-xs font-bold text-slate-300">-</span>
              </td>

              <!-- <td class="px-6 py-4 text-center border-l border-slate-100 group-hover:border-indigo-100 transition-colors">
                <button @click.stop="$emit('goToSellerDetail', item.originalSellerId || item.id)" class="inline-flex items-center justify-center p-2.5 text-indigo-500 bg-indigo-50 border border-indigo-100 rounded-xl hover:bg-indigo-600 hover:text-white hover:shadow-md transition-all active:scale-95" title="មើលព័ត៌មានលម្អិត">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                </button>
              </td> -->

            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 animate-fade-in md:hidden lg:grid">
      <div v-if="data.length === 0" class="col-span-full py-10 text-center text-slate-400 font-bold text-sm bg-white rounded-2xl border border-slate-200">
          មិនមានទិន្នន័យបង្ហាញទេ
      </div>
      <div v-for="(item, index) in data" :key="'card-'+item.uniqueId" class="bg-white rounded-[24px] p-5 shadow-sm border border-slate-200/80 flex flex-col hover:shadow-md hover:border-indigo-300 transition-all relative overflow-hidden group">
        <span class="absolute top-4 right-4 text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">#{{ index + 1 + startIndex }}</span>
        
        <div class="flex items-start gap-4 mb-5 border-b border-slate-100 pb-4 pr-10">
          <img :src="item.photoUrl || `https://ui-avatars.com/api/?name=${item.fullName}`" class="w-14 h-14 rounded-[16px] object-cover shadow-sm border border-slate-200 bg-slate-50 shrink-0" />
          <div class="flex-1 min-w-0">
            <h4 class="font-black text-slate-800 text-[15px] leading-tight mb-1 truncate">{{ item.fullName }}</h4>
            <div class="flex flex-wrap items-center gap-2">
                <span class="text-[10px] text-slate-500 font-mono bg-slate-100 px-1.5 py-0.5 rounded">ID: {{ item.idNumber || 'N/A' }}</span>
                <span v-if="item.role === 'dealer'" class="bg-amber-100 text-amber-700 text-[8px] px-1.5 py-0.5 rounded font-black tracking-widest">DEALER</span>
            </div>
          </div>
        </div>

        <div v-if="item.hasSales" class="flex flex-col flex-1">
           <div class="flex items-center justify-between mb-4">
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">ប្រភេទលក់</span>
              <span class="px-2.5 py-1 rounded-md text-[10px] font-black border shadow-sm uppercase tracking-wider" :class="item.category === 'បោះដុំ' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-slate-50 text-slate-700 border-slate-200'">{{ item.category }}</span>
           </div>

           <div class="mb-4">
             <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">ទំនិញលក់បាន (Products)</p>
             <div class="flex flex-wrap gap-1.5">
                <template v-for="(prod, pIdx) in getVisibleProducts(item)" :key="pIdx">
                  <span class="bg-slate-50 text-slate-700 border border-slate-200 px-2 py-1 rounded-md text-[10px] font-bold truncate max-w-[120px]" :title="prod">{{ prod }}</span>
                </template>
                <button v-if="item.productNames && item.productNames.length > 3" @click="toggleProducts(item.uniqueId)" class="text-[9px] font-black text-blue-500 hover:underline">
                  {{ expandedRows.has(item.uniqueId) ? 'បង្រួម' : `+${item.productNames.length - 3} ទៀត` }}
                </button>
             </div>
           </div>

           <div class="grid grid-cols-2 gap-3 mt-auto pt-4 border-t border-slate-100">
             <div class="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
               <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">បរិមាណ (Qty)</p>
               <div class="flex flex-col gap-1">
                  <span v-for="(count, unit) in item.unitCounts" :key="unit" class="text-[11px] font-black text-slate-700 leading-none">
                    {{ count.toLocaleString() }} <span class="text-[10px] font-bold text-slate-500">{{ translateUnit(unit) }}</span>
                  </span>
               </div>
             </div>
             
             <div class="bg-amber-50/50 rounded-xl p-2.5 border border-amber-100/50 flex flex-col justify-center">
               <p class="text-[9px] font-black text-amber-600/70 uppercase tracking-widest mb-1">អតិថិជន</p>
               <div class="text-[15px] font-black text-amber-600 leading-none flex items-center gap-1.5">
                   {{ item.totalClients.toLocaleString() }} <span class="text-[10px] font-bold">នាក់</span>
               </div>
             </div>
           </div>

           <div class="mt-3 bg-emerald-50/50 rounded-xl p-3 border border-emerald-100/50 flex items-center justify-between">
               <p class="text-[10px] font-black text-emerald-600/70 uppercase tracking-widest">ចំណូលសរុប</p>
               <div class="text-right">
                   <div v-if="item.revenueUSD > 0" class="font-black text-emerald-600 text-lg leading-none tracking-tight">{{ item.revenueUSD.toLocaleString() }} $</div>
                   <div v-if="item.revenueKHR > 0" class="font-black text-blue-600 text-[11px] mt-1">{{ item.revenueKHR.toLocaleString() }} ៛</div>
               </div>
           </div>
        </div>
        
        <div v-else class="flex-1 flex flex-col items-center justify-center py-10 opacity-60 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 mt-2">
           <svg class="w-8 h-8 text-slate-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
           <p class="text-xs font-black text-slate-500">មិនទាន់មានការលក់ទេ</p>
        </div>

        <!-- <div class="mt-4 pt-4 border-t border-slate-100">
            <button @click.stop="$emit('goToSellerDetail', item.originalSellerId || item.id)" class="w-full flex items-center justify-center gap-2 py-3 text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-xl hover:bg-indigo-600 hover:text-white transition-all active:scale-95 text-xs font-black shadow-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                <span>មើលរបាយការណ៍លម្អិត</span>
            </button>
        </div> -->

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
  data: { type: Array, required: true },
  viewMode: { type: String, required: true, default: 'list' },
  startIndex: { type: Number, required: true, default: 0 },
  availableUnits: { type: Array, required: true }
});

defineEmits(['goToSellerDetail']);

const expandedRows = ref(new Set());

const toggleProducts = (id) => {
  const newSet = new Set(expandedRows.value);
  if (newSet.has(id)) newSet.delete(id);
  else newSet.add(id);
  expandedRows.value = newSet;
};

const getVisibleProducts = (item) => {
  if (!item.productNames) return [];
  if (expandedRows.value.has(item.uniqueId)) return item.productNames; 
  return item.productNames.slice(0, 3);
};

const translateUnit = (unitVal) => {
  if (!unitVal) return '';
  const found = props.availableUnits.find(u => u.value === unitVal);
  if (found) return found.label;
  const u = unitVal.toLowerCase().trim();
  if (u === 'bottle' || u === 'bottles') return 'ដប';
  if (u === 'pack' || u === 'packs') return 'កញ្ចប់';
  if (u === 'case' || u === 'cases') return 'កេះ';
  return unitVal; 
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #94A3B8; }
.animate-fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
</style>