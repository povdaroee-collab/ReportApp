<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
      
      <div class="bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 rounded-[24px] p-6 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden flex flex-col justify-between">
          <div class="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          
          <div class="relative z-10">
              <p class="text-indigo-100 text-[11px] font-black uppercase tracking-widest mb-2 flex items-center gap-2">ចំណូលសរុប (Total Revenue)</p>
              
              <div class="flex items-baseline gap-2">
                  <span class="text-4xl font-black tracking-tight">{{ formatCurrency(displayStats?.usd || 0) }}</span>
                  <span class="text-lg font-bold opacity-80">$</span>
              </div>
              <div v-if="(displayStats?.khr || 0) > 0" class="text-sm font-bold mt-1 opacity-90 pb-2">{{ formatCurrency(displayStats.khr) }} ៛</div>
              
              <div class="mt-3 flex items-center gap-4 bg-black/20 rounded-xl p-3 border border-white/10 backdrop-blur-sm">
                  <div class="flex-1">
                      <p class="text-[10px] text-indigo-200 uppercase font-bold mb-1 tracking-wider">ថ្លៃទំនិញ (Products)</p>
                      <p class="text-base font-black leading-none">{{ formatCurrency(displayStats?.productUSD || 0) }} $</p>
                      <p v-if="(displayStats?.productKHR || 0) > 0" class="text-[10px] text-indigo-100 mt-1">{{ formatCurrency(displayStats.productKHR) }} ៛</p>
                  </div>
                  <div class="w-px h-10 bg-white/20"></div>
                  <div class="flex-1">
                      <p class="text-[10px] text-indigo-200 uppercase font-bold mb-1 tracking-wider">ដឹកជញ្ជូន (Delivery)</p>
                      <p class="text-base font-black leading-none text-amber-300">{{ formatCurrency(displayStats?.deliveryUSD || 0) }} $</p>
                      <p v-if="(displayStats?.deliveryKHR || 0) > 0" class="text-[10px] text-amber-200 mt-1">{{ formatCurrency(displayStats.deliveryKHR) }} ៛</p>
                  </div>
              </div>
          </div>

          <div v-if="activeCategory === 'all'" class="flex gap-2 border-t border-white/20 pt-3 mt-3 relative z-10">
              <div class="flex-1 bg-black/10 rounded-lg p-2.5 border border-white/10 backdrop-blur-sm">
                  <div class="text-indigo-100 text-[10px] font-bold mb-1 uppercase">លក់រាយ (RETAIL)</div>
                  <div class="font-black text-sm">{{ formatCurrency(grandTotals?.retail?.productUSD || 0) }} $</div>
                  <div v-if="(grandTotals?.retail?.productKHR || 0) > 0" class="font-bold text-[11px] opacity-90">{{ formatCurrency(grandTotals.retail.productKHR) }} ៛</div>
              </div>
              <div class="flex-1 bg-black/10 rounded-lg p-2.5 border border-white/10 backdrop-blur-sm">
                  <div class="text-indigo-100 text-[10px] font-bold mb-1 uppercase">បោះដុំ (WHOLESALE)</div>
                  <div class="font-black text-sm">{{ formatCurrency(grandTotals?.wholesale?.productUSD || 0) }} $</div>
                  <div v-if="(grandTotals?.wholesale?.productKHR || 0) > 0" class="font-bold text-[11px] opacity-90">{{ formatCurrency(grandTotals.wholesale.productKHR) }} ៛</div>
              </div>
          </div>
      </div>
      
      <div class="bg-white rounded-[24px] p-6 border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:border-indigo-300 transition-colors flex flex-col justify-between">
          <div class="relative z-10">
              <p class="text-slate-400 text-[11px] font-black uppercase tracking-widest mb-1">បរិមាណលក់ (Units Sold)</p>
              <h3 class="text-3xl font-black text-slate-800">{{ displayStats?.totalUnitsCount?.toLocaleString() || 0 }}</h3>
          </div>
          
          <div class="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-100 relative z-10">
              <span v-for="(count, unit) in displayStats?.units || {}" :key="unit" class="text-[10px] font-bold px-2 py-0.5 rounded border shadow-sm" :class="getUnitBadgeColor(unit)">
                  {{ count.toLocaleString() }} {{ translateUnit(unit) }}
              </span>
          </div>

          <div v-if="activeCategory === 'all'" class="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 relative z-10">
              <div class="bg-indigo-50/50 rounded-lg p-2.5 border border-indigo-100/60">
                  <p class="text-[10px] text-indigo-500 font-bold mb-1 uppercase tracking-widest">លក់រាយ</p>
                  <span class="text-lg font-black text-slate-700">{{ grandTotals?.retail?.totalUnitsCount?.toLocaleString() || 0 }}</span>
              </div>
              <div class="bg-purple-50/50 rounded-lg p-2.5 border border-purple-100/60">
                  <p class="text-[10px] text-purple-600 font-bold mb-1 uppercase tracking-widest">បោះដុំ</p>
                  <span class="text-lg font-black text-slate-700">{{ grandTotals?.wholesale?.totalUnitsCount?.toLocaleString() || 0 }}</span>
              </div>
          </div>
      </div>

      <div class="bg-white rounded-[24px] p-6 border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:border-amber-300 transition-colors flex flex-col justify-between">
          <div class="relative z-10 flex justify-between items-start">
              <div>
                  <p class="text-slate-400 text-[11px] font-black uppercase tracking-widest mb-1">អតិថិជនសរុប (CLIENTS)</p>
                  <h3 class="text-3xl font-black text-slate-800">{{ displayStats?.clients?.toLocaleString() || 0 }} <span class="text-sm text-slate-400 font-bold">នាក់</span></h3>
              </div>
              <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
              </div>
          </div>
          
          <div class="mt-3 pt-3 border-t border-slate-100 text-[11px] font-bold text-slate-500 relative z-10 flex justify-between items-center">
              <span>តំណាងលក់សកម្ម:</span>
              <span class="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-lg text-xs font-black">{{ activeSellersCount }} អ្នក</span>
          </div>

          <div v-if="activeCategory === 'all'" class="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 relative z-10">
              <div class="bg-slate-50 rounded-lg p-2.5 border border-slate-200/60">
                  <p class="text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-widest">អតិថិជនរាយ</p>
                  <span class="text-base font-black text-slate-700">{{ grandTotals?.retail?.clients?.toLocaleString() || 0 }} <span class="text-[10px] font-bold text-slate-400">នាក់</span></span>
              </div>
              <div class="bg-slate-50 rounded-lg p-2.5 border border-slate-200/60">
                  <p class="text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-widest">អតិថិជនដុំ</p>
                  <span class="text-base font-black text-slate-700">{{ grandTotals?.wholesale?.clients?.toLocaleString() || 0 }} <span class="text-[10px] font-bold text-slate-400">នាក់</span></span>
              </div>
          </div>
      </div>
  </div>
</template>

<script setup>
import { computed, defineProps } from 'vue';

const props = defineProps({
  grandTotals: { type: Object, required: true },
  activeCategory: { type: String, required: true },
  activeSellersCount: { type: Number, required: true },
  availableUnits: { type: Array, required: true }
});

const displayStats = computed(() => {
    if (!props.grandTotals) return {};
    if (props.activeCategory === 'all') return props.grandTotals.all;
    if (props.activeCategory === 'បោះដុំ') return props.grandTotals.wholesale;
    return props.grandTotals.retail;
});

const formatCurrency = (value) => {
    if (value === undefined || value === null || isNaN(value)) return '0';
    return Number(value).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 3 });
};

const translateUnit = (unitVal) => {
  if (!unitVal) return '';
  const safeVal = String(unitVal);
  const found = props.availableUnits.find(u => String(u.value) === safeVal);
  if (found) return found.label;
  const u = safeVal.toLowerCase().trim();
  if (u === 'bottle' || u === 'bottles') return 'ដប';
  if (u === 'pack' || u === 'packs') return 'កញ្ចប់';
  return unitVal; 
};

const getUnitBadgeColor = (unitVal) => {
  const safeVal = String(unitVal);
  const found = props.availableUnits.find(u => String(u.value) === safeVal);
  const color = found ? found.color : 'slate';
  const colorMap = {
      cyan: 'text-cyan-700 bg-cyan-50 border-cyan-200',
      blue: 'text-blue-700 bg-blue-50 border-blue-200',
      indigo: 'text-indigo-700 bg-indigo-50 border-indigo-200',
      purple: 'text-purple-700 bg-purple-50 border-purple-200',
      emerald: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      amber: 'text-amber-700 bg-amber-50 border-amber-200',
      rose: 'text-rose-700 bg-rose-50 border-rose-200',
      slate: 'text-slate-700 bg-slate-50 border-slate-200'
  };
  return colorMap[color] || colorMap['slate'];
};
</script>