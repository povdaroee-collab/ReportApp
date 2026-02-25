<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
      <div class="bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 rounded-[24px] p-6 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 cursor-default flex flex-col justify-between">
          <div class="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-500"></div>
          <div class="relative z-10">
              <p class="text-indigo-100 text-[11px] font-black uppercase tracking-widest mb-2 flex items-center gap-2">ចំណូលសរុប (Total Revenue)</p>
              <div class="flex items-baseline gap-2">
                  <span class="text-4xl font-black tracking-tight">{{ grandTotals.all.usd.toLocaleString() }}</span>
                  <span class="text-xl font-bold opacity-80">$</span>
              </div>
              <div class="text-sm font-bold mt-1 opacity-90 pb-2">{{ grandTotals.all.khr.toLocaleString() }} ៛</div>
          </div>

          <div v-if="activeCategory === 'all'" class="flex gap-2 border-t border-white/20 pt-3 mt-1 relative z-10">
              <div class="flex-1 bg-black/10 rounded-lg p-2.5 border border-white/10 backdrop-blur-sm">
                  <div class="text-indigo-100 text-[10px] font-bold mb-1 uppercase">លក់រាយ (Retail)</div>
                  <div class="font-black text-sm">{{ grandTotals.retail.usd.toLocaleString() }} $</div>
                  <div class="font-bold text-[11px] opacity-90">{{ grandTotals.retail.khr.toLocaleString() }} ៛</div>
              </div>
              <div class="flex-1 bg-black/10 rounded-lg p-2.5 border border-white/10 backdrop-blur-sm">
                  <div class="text-indigo-100 text-[10px] font-bold mb-1 uppercase">បោះដុំ (Wholesale)</div>
                  <div class="font-black text-sm">{{ grandTotals.wholesale.usd.toLocaleString() }} $</div>
                  <div class="font-bold text-[11px] opacity-90">{{ grandTotals.wholesale.khr.toLocaleString() }} ៛</div>
              </div>
          </div>
      </div>

      <div class="bg-white rounded-[24px] p-6 border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden flex flex-col justify-between group hover:border-blue-300 transition-colors">
          <div class="relative z-10 flex justify-between items-start mb-2">
              <div>
                  <p class="text-slate-400 text-[11px] font-black uppercase tracking-widest mb-1">អតិថិជនទូទាំងប្រព័ន្ធ</p>
                  <h3 class="text-3xl font-black text-slate-800">{{ grandTotals.all.clients.toLocaleString() }} <span class="text-sm font-bold text-slate-400">នាក់</span></h3>
              </div>
              <div class="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center shadow-inner">
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
              </div>
          </div>
          <div class="relative z-10 pt-3 border-t border-slate-100 flex flex-col gap-2">
              <div class="flex flex-wrap gap-1.5 items-center">
                  <template v-if="Object.keys(grandTotals.all.units).length > 0">
                      <span v-for="(count, unit) in grandTotals.all.units" :key="unit" class="text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 bg-white border shadow-sm text-slate-600">
                          {{ count.toLocaleString() }} {{ unit }}
                      </span>
                  </template>
              </div>
          </div>

          <div v-if="activeCategory === 'all'" class="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 relative z-10">
              <div class="bg-slate-50 rounded-lg p-2.5 border border-slate-200/60">
                  <p class="text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-widest">អតិថិជនរាយ</p>
                  <span class="text-base font-black text-slate-700">{{ grandTotals.retail.clients.toLocaleString() }} <span class="text-[10px] font-bold text-slate-400">នាក់</span></span>
              </div>
              <div class="bg-slate-50 rounded-lg p-2.5 border border-slate-200/60">
                  <p class="text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-widest">អតិថិជនដុំ</p>
                  <span class="text-base font-black text-slate-700">{{ grandTotals.wholesale.clients.toLocaleString() }} <span class="text-[10px] font-bold text-slate-400">នាក់</span></span>
              </div>
          </div>
      </div>

      <div class="bg-white rounded-[24px] p-6 border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden flex flex-col justify-center group hover:border-emerald-300 transition-colors">
          <p class="text-slate-400 text-[11px] font-black uppercase mb-4 tracking-widest">ស្ថិតិអ្នកគ្រប់គ្រង</p>
          <div class="space-y-3">
              <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span class="text-xs font-bold text-slate-600">អ្នកគ្រប់គ្រងសរុប</span>
                  <span class="font-black text-slate-800">{{ activeAdminsCount + inactiveAdminsCount }}</span>
              </div>
              <div class="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
                  <span class="text-xs font-bold text-emerald-700">មានការលក់</span>
                  <span class="font-black text-emerald-700">{{ activeAdminsCount }}</span>
              </div>
              <div class="flex items-center justify-between p-2.5 rounded-xl bg-rose-50 border border-rose-100">
                  <span class="text-xs font-bold text-rose-700">គ្មានការលក់</span>
                  <span class="font-black text-rose-700">{{ inactiveAdminsCount }}</span>
              </div>
          </div>
      </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  grandTotals: Object,
  activeCategory: String,
  activeAdminsCount: Number,
  inactiveAdminsCount: Number
});
</script>