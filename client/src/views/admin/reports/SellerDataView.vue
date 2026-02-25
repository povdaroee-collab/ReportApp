<template>
  <div>
    <div v-if="viewMode === 'list'" class="bg-white rounded-[24px] shadow-sm border border-slate-200/60 overflow-hidden animate-fade-in">
      <div class="overflow-x-auto">
        <table class="w-full text-left min-w-[1000px]">
          <thead class="bg-slate-50/80 text-[11px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-100">
            <tr>
              <th class="px-6 py-5 w-16 text-center">#</th>
              <th class="px-6 py-5 w-[250px]">តំណាងលក់ (SELLER)</th>
              <th class="px-6 py-5 w-28 text-center">ប្រភេទ</th>
              <th class="px-6 py-5">មុខទំនិញ (PRODUCTS)</th>
              <th class="px-6 py-5 w-32 text-center">បរិមាណលក់</th>
              <th class="px-6 py-5 w-28 text-center">អតិថិជន</th>
              <th class="px-6 py-5 text-right w-36 pr-8">ចំណូល</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-sm">
            <tr v-for="(item, index) in data" :key="item.uniqueId" class="hover:bg-slate-50/50 transition-colors group">
              <td class="px-6 py-4 text-center text-slate-400 font-bold">{{ index + 1 + startIndex }}</td>
              
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <img :src="item.photoUrl || `https://ui-avatars.com/api/?name=${item.fullName}`" class="w-10 h-10 rounded-full object-cover shadow-sm border border-slate-200 shrink-0" />
                  <div>
                    <p class="font-black text-slate-800 flex items-center gap-1.5">
                      {{ item.fullName }}
                      <span v-if="item.role === 'dealer'" class="bg-amber-100 text-amber-700 text-[8px] px-1.5 py-0.5 rounded">DEALER</span>
                    </p>
                    <p class="text-[10px] text-slate-400 font-mono mt-0.5">{{ item.idNumber || 'N/A' }}</p>
                  </div>
                </div>
              </td>

              <td class="px-6 py-4 text-center">
                <span v-if="item.hasSales" class="px-2.5 py-1.5 rounded-lg text-[10px] font-black border uppercase"
                  :class="item.category === 'បោះដុំ' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-slate-50 text-slate-700 border-slate-200'">
                  {{ item.category }}
                </span>
                <span v-else class="text-[10px] font-bold text-slate-300">-</span>
              </td>

              <td class="px-6 py-4">
                <div v-if="item.hasSales && item.productNames && item.productNames.length > 0" class="flex flex-wrap gap-1.5 items-center">
                  <template v-for="(prod, pIdx) in getVisibleProducts(item)" :key="pIdx">
                    <span class="bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded text-[10px] font-bold truncate max-w-[120px]" :title="prod">
                      {{ prod }}
                    </span>
                  </template>
                  
                  <button v-if="item.productNames.length > 4" @click="toggleProducts(item.uniqueId)" class="text-[10px] font-black text-blue-500 hover:text-blue-700 hover:underline px-1">
                    {{ expandedRows.has(item.uniqueId) ? 'លាក់បាំង' : `+${item.productNames.length - 4} ផ្សេងទៀត...` }}
                  </button>
                </div>
                <div v-else class="text-xs text-slate-300 font-bold">-</div>
              </td>

              <td class="px-6 py-4 text-center">
                <div v-if="item.hasSales" class="flex flex-col gap-1 items-center">
                   <span v-for="(count, unit) in item.unitCounts" :key="unit" class="inline-flex items-center px-2 py-0.5 rounded bg-white border shadow-sm text-[10px] font-bold text-slate-700">
                      {{ count.toLocaleString() }} {{ translateUnit(unit) }}
                   </span>
                </div>
                <span v-else class="text-[10px] font-bold text-slate-300">-</span>
              </td>

              <td class="px-6 py-4 text-center">
                <span v-if="item.hasSales" class="bg-amber-50 text-amber-600 border border-amber-100 px-2 py-1 rounded text-xs font-bold">{{ item.totalClients.toLocaleString() }} នាក់</span>
                <span v-else class="text-[10px] font-bold text-slate-300">-</span>
              </td>

              <td class="px-6 py-4 text-right pr-8">
                <div v-if="item.hasSales" class="flex flex-col items-end">
                   <span class="font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 text-sm">{{ item.revenueUSD.toLocaleString() }} $</span>
                </div>
                <span v-else class="text-xs font-bold text-slate-300">-</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 animate-fade-in">
      <div v-for="(item, index) in data" :key="'card-'+item.uniqueId" class="bg-white rounded-[24px] p-5 shadow-sm border border-slate-200/80 flex flex-col hover:shadow-md hover:border-indigo-200 transition-all relative overflow-hidden">
        
        <div class="flex items-start gap-4 mb-4 border-b border-slate-50 pb-4">
          <img :src="item.photoUrl || `https://ui-avatars.com/api/?name=${item.fullName}`" class="w-14 h-14 rounded-full object-cover shadow-sm border border-slate-200 shrink-0" />
          <div class="flex-1">
            <h4 class="font-black text-slate-800 text-sm leading-tight flex items-center gap-1.5 mb-1">
               {{ item.fullName }}
               <span v-if="item.role === 'dealer'" class="bg-amber-100 text-amber-700 text-[8px] px-1.5 py-0.5 rounded">DEALER</span>
            </h4>
            <p class="text-[10px] text-slate-400 font-mono mb-2">ID: {{ item.idNumber || 'N/A' }}</p>
            <span v-if="item.hasSales" class="px-2 py-0.5 rounded text-[9px] font-black border uppercase" :class="item.category === 'បោះដុំ' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-slate-50 text-slate-700 border-slate-200'">
              {{ item.category }}
            </span>
          </div>
          <span class="absolute top-4 right-4 text-[10px] font-black text-slate-300">#{{ index + 1 + startIndex }}</span>
        </div>

        <div v-if="item.hasSales" class="flex flex-col flex-1">
           <div class="mb-4">
             <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">ទំនិញលក់បាន (Products)</p>
             <div class="flex flex-wrap gap-1">
                <template v-for="(prod, pIdx) in getVisibleProducts(item)" :key="pIdx">
                  <span class="bg-indigo-50 text-indigo-700 border border-indigo-100 px-1.5 py-0.5 rounded text-[9px] font-bold truncate max-w-[100px]" :title="prod">
                    {{ prod }}
                  </span>
                </template>
                <button v-if="item.productNames && item.productNames.length > 4" @click="toggleProducts(item.uniqueId)" class="text-[9px] font-black text-blue-500 hover:underline">
                  {{ expandedRows.has(item.uniqueId) ? 'លាក់បាំង' : `+${item.productNames.length - 4} ទៀត` }}
                </button>
             </div>
           </div>

           <div class="grid grid-cols-2 gap-2 mt-auto pt-3 border-t border-slate-100">
             <div>
               <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">បរិមាណ</p>
               <div class="flex flex-col gap-0.5">
                  <span v-for="(count, unit) in item.unitCounts" :key="unit" class="text-[10px] font-bold text-slate-700 leading-tight">
                    {{ count.toLocaleString() }} <span class="text-slate-500">{{ translateUnit(unit) }}</span>
                  </span>
               </div>
             </div>
             <div class="text-right">
               <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">អតិថិជន & ចំណូល</p>
               <div class="text-[10px] font-bold text-amber-600 mb-0.5">{{ item.totalClients.toLocaleString() }} នាក់</div>
               <div class="font-black text-emerald-600 text-sm">{{ item.revenueUSD.toLocaleString() }} $</div>
             </div>
           </div>
        </div>
        
        <div v-else class="flex-1 flex flex-col items-center justify-center py-6 opacity-50">
           <svg class="w-8 h-8 text-slate-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
           <p class="text-xs font-bold text-slate-400">មិនមានលក់ទេ</p>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, defineProps } from 'vue';

const props = defineProps({
  data: { type: Array, required: true },
  viewMode: { type: String, required: true, default: 'list' },
  startIndex: { type: Number, required: true, default: 0 },
  availableUnits: { type: Array, required: true }
});

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
  return item.productNames.slice(0, 4); 
};

const translateUnit = (unitVal) => {
  if (!unitVal) return '';
  const found = props.availableUnits.find(u => u.value === unitVal);
  if (found) return found.label;
  const u = unitVal.toLowerCase().trim();
  if (u === 'bottle' || u === 'bottles') return 'ដប';
  if (u === 'pack' || u === 'packs') return 'កញ្ចប់';
  return unitVal; 
};
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
</style>