<template>
  <div class="seller-data-table-wrapper">
    
    <div class="md:hidden flex flex-col gap-4">
       <div v-for="(item, index) in data" :key="item.uniqueId" @click="emit('row-click', item)" class="bg-white p-5 rounded-[20px] shadow-[0_4px_15px_rgb(0,0,0,0.03)] border relative overflow-hidden group transition-all cursor-pointer" :class="item.hasSales ? 'border-slate-100' : 'border-rose-100/50 bg-slate-50/50'">
          
          <div class="absolute top-0 right-0 bg-gradient-to-bl from-slate-100 to-white px-3 py-1.5 rounded-bl-xl border-b border-l border-slate-100">
             <span class="text-slate-400 font-black text-xs">#{{ index + 1 }}</span>
          </div>

          <div class="flex items-center gap-4 mb-5">
             <div class="relative">
                <img :src="item.photoUrl || `https://ui-avatars.com/api/?name=${item.fullName}`" class="w-14 h-14 rounded-2xl object-cover border border-slate-100 shadow-sm" :class="item.hasSales ? '' : 'grayscale-[30%] opacity-80'">
                <span class="absolute -bottom-1 -left-1 w-4 h-4 rounded-full border-2 border-white shadow-sm" :class="item.hasSales ? 'bg-emerald-500' : 'bg-rose-500'"></span>
                
                <div v-if="editingSaleId !== item.rawSale?.id" class="absolute -bottom-2 -right-2 flex gap-1 z-10">
                   <button v-if="dateFilterType === 'daily' && item.hasSales" @click.stop="emit('start-edit', item)" class="bg-white p-1 rounded-full shadow-sm hover:scale-110 transition-transform">
                      <div class="bg-amber-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center">
                         <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                      </div>
                   </button>
                   <a v-if="item.telegram" :href="'https://t.me/'+item.telegram" target="_blank" @click.stop class="bg-white p-1 rounded-full shadow-sm hover:scale-110 transition-transform">
                     <div class="bg-sky-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center">
                        <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.48-.94-2.4-1.54-1.06-.7-.37-1.09.23-1.72.16-.16 2.87-2.63 2.92-2.85.01-.03.01-.14-.06-.2-.06-.06-.17-.04-.25-.02-.11.02-1.91 1.2-5.39 3.55-.5.34-.95.51-1.35.5-.44-.01-1.29-.25-1.92-.42-.77-.21-1.37-.32-1.31-.68.03-.18.28-.37.76-.56 3.03-1.32 5.06-2.19 6.09-2.62 2.93-1.21 3.53-1.43 3.93-1.43.09 0 .28.01.4.04.1.03.24.1.33.25.08.16.07.32.07.33z"/></svg>
                     </div>
                   </a>
                </div>
             </div>
             <div class="flex-1 min-w-0 pr-6">
                <h3 class="font-bold text-lg leading-tight truncate flex items-center gap-2" :class="item.hasSales ? 'text-slate-800' : 'text-slate-500'">
                   {{ item.fullName }}
                   <span v-if="item.role === 'dealer'" class="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border border-amber-200">Dealer</span>
                </h3>
                <div class="flex items-center gap-2 mt-1">
                   <span class="text-[11px] text-slate-400 font-mono font-bold">ID: {{ item.idNumber || 'N/A' }}</span>
                   <span v-if="item.hasSales" class="px-2 py-0.5 rounded text-[9px] font-black border uppercase" :class="item.category === 'បោះដុំ' ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-slate-100 border-slate-200 text-slate-600'">
                       {{ item.category }}
                   </span>
                </div>
             </div>
          </div>

          <div v-if="editingSaleId !== item.rawSale?.id">
              <div v-if="item.hasSales" class="bg-slate-50/80 rounded-xl p-4 grid grid-cols-2 gap-4 border border-slate-100/80">
                 <div>
                    <p class="text-[10px] text-slate-400 font-black uppercase tracking-wider mb-2">បរិមាណលក់</p>
                    <div class="flex flex-col gap-1.5 items-start">
                       <template v-for="(entry, idx) in Object.entries(item.unitCounts)" :key="entry[0]">
                          <span v-if="idx < 3 || expandedRowIds.has(item.id)" class="text-[11px] font-bold px-2.5 py-1 rounded-md border bg-white shadow-sm w-fit" :class="getUnitBadgeColor(entry[0])">
                             {{ entry[1].toLocaleString() }} {{ translateUnit(entry[0]) }}
                          </span>
                       </template>
                       <button 
                          v-if="Object.keys(item.unitCounts).length > 3" 
                          @click.stop="emit('toggle-expand', item.id)" 
                          class="text-[10px] font-bold text-indigo-500 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded-md transition-colors flex items-center gap-1 border border-indigo-100 mt-1"
                       >
                          <span v-if="!expandedRowIds.has(item.id)">+{{ Object.keys(item.unitCounts).length - 3 }} ទៀត</span>
                          <span v-else>បង្រួម</span>
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path v-if="!expandedRowIds.has(item.id)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                             <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
                          </svg>
                       </button>
                    </div>
                 </div>
                 <div class="text-right flex flex-col justify-between">
                    <div>
                       <p class="text-[10px] text-slate-400 font-black uppercase tracking-wider mb-1">អតិថិជនសរុប</p>
                       <p class="text-sm font-bold text-slate-700"><span class="text-orange-500">{{ item.totalClients }}</span> នាក់</p>
                    </div>
                    <div class="mt-2 pt-2 border-t border-slate-200/60">
                       <p class="text-base font-black text-emerald-600 leading-none">{{ item.revenueUSD.toLocaleString() }} $</p>
                       <p class="text-[11px] font-bold text-blue-600 mt-1">{{ item.revenueKHR.toLocaleString() }} ៛</p>
                    </div>
                 </div>
              </div>
              <div v-else class="bg-rose-50/50 rounded-xl p-3 border border-rose-100/50 flex items-center justify-center gap-2">
                  <span class="text-xs font-bold text-rose-500">គ្មានការលក់ទេ</span>
              </div>
          </div>

          <div v-else class="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100 animate-fade-in space-y-4 mt-4" @click.stop>
              <div>
                  <label class="text-[10px] font-black text-slate-500 uppercase mb-1 block">ប្រភេទលក់</label>
                  <select v-model="editForm.category" class="w-full bg-white border border-slate-200 rounded-lg px-2 py-2 text-xs font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none shadow-sm cursor-pointer">
                      <option value="លក់រាយ">លក់រាយ</option>
                      <option value="បោះដុំ">បោះដុំ</option>
                  </select>
              </div>
              <div>
                 <p class="text-[10px] text-slate-500 font-black uppercase mb-1">បរិមាណលក់</p>
                 <div class="flex gap-2">
                    <input type="number" v-model="editForm.totalSold" min="0" class="w-full px-3 py-2 text-sm font-bold text-slate-800 border border-indigo-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/30">
                    <select v-model="editForm.unit" class="w-full px-2 py-2 text-sm font-bold text-slate-800 border border-indigo-200 rounded-lg outline-none bg-white focus:ring-2 focus:ring-indigo-500/30">
                       <option v-for="u in availableUnits" :key="u.value" :value="u.value">{{ u.label }}</option>
                    </select>
                 </div>
              </div>
              <div>
                 <p class="text-[10px] text-slate-500 font-black uppercase mb-1">អតិថិជនសរុប</p>
                 <div class="flex items-center gap-2">
                    <input type="number" v-model="editForm.totalClients" class="w-full px-3 py-2 text-sm font-bold text-slate-800 border border-amber-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-500/30">
                    <span class="text-xs font-bold text-slate-500 shrink-0">នាក់</span>
                 </div>
              </div>
              <div>
                 <p class="text-[10px] text-slate-500 font-black uppercase mb-1">ចំណូលសរុប</p>
                 <div class="flex gap-2">
                    <input type="number" step="0.01" v-model="editForm.totalPrice" class="w-full px-3 py-2 text-sm font-black text-slate-800 border border-emerald-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/30">
                    <select v-model="editForm.currency" class="w-24 px-2 py-2 text-xs font-black text-slate-800 border border-emerald-200 rounded-lg outline-none bg-white focus:ring-2 focus:ring-emerald-500/30">
                       <option value="USD">USD</option>
                       <option value="KHR">KHR</option>
                    </select>
                 </div>
              </div>
              <div class="flex gap-2 pt-2 mt-2 border-t border-indigo-100/60">
                 <button @click.stop="emit('cancel-edit')" class="flex-1 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs transition-colors">បោះបង់</button>
                 <button @click.stop="emit('save-edit')" :disabled="isUpdatingSale" class="flex-1 py-2 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20 active:scale-95 transition-all">
                     <svg v-if="isUpdatingSale" class="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                     <span v-else>រក្សាទុក</span>
                 </button>
              </div>
          </div>
       </div>
    </div>

    <div class="hidden md:block bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 overflow-hidden">
       <table class="w-full text-left border-collapse">
          <thead class="bg-slate-50/80 text-slate-500 text-[11px] uppercase font-black tracking-widest border-b border-slate-200">
             <tr>
                <th class="px-6 py-5 w-16 text-center">#</th>
                <th class="px-6 py-5 w-64">តំណាងលក់ (Seller)</th>
                <th class="px-6 py-5 w-24">ប្រភេទ</th>
                <th class="px-6 py-5 w-56">បរិមាណលក់ (Units Sold)</th>
                <th class="px-6 py-5 text-center">អតិថិជន</th>
                <th class="px-6 py-5 text-right w-40">ចំណូល (Revenue)</th>
                <th class="px-6 py-5 text-center w-32">សកម្មភាព (Actions)</th>
             </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
             <tr v-for="(item, index) in data" :key="item.uniqueId" @click="emit('row-click', item)" class="transition-colors group cursor-pointer" :class="[item.hasSales ? 'hover:bg-indigo-50/30' : 'bg-slate-50/30', editingSaleId === item.rawSale?.id ? 'bg-indigo-50/40 border-l-4 border-l-indigo-500' : '']">
                
                <td class="px-6 py-5 text-center align-top">
                   <span class="text-xs font-black" :class="item.hasSales ? 'text-indigo-500' : 'text-slate-400'">{{ index + 1 }}</span>
                </td>
                
                <td class="px-6 py-5 align-top">
                   <div class="flex items-center gap-4">
                      <div class="relative shrink-0">
                         <img :src="item.photoUrl || `https://ui-avatars.com/api/?name=${item.fullName}`" class="w-11 h-11 rounded-2xl object-cover border border-slate-200 shadow-sm transition-transform duration-300" :class="item.hasSales ? 'group-hover:scale-105' : 'grayscale-[40%] opacity-70'">
                         <span class="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm" :class="item.hasSales ? 'bg-emerald-500' : 'bg-rose-400'"></span>
                      </div>
                      <div class="min-w-0">
                         <h3 class="font-bold text-sm mb-0.5 group-hover:text-teal-600 transition-colors truncate flex items-center" :class="item.hasSales ? 'text-slate-800' : 'text-slate-500'">
                             {{ item.fullName }}
                             <span v-if="item.role === 'dealer'" class="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ml-2 border border-amber-200">Dealer</span>
                         </h3>
                         <div class="flex items-center gap-2">
                            <span class="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 font-mono font-bold">{{ item.idNumber || 'N/A' }}</span>
                            <span class="text-[10px] text-slate-400 font-medium truncate">{{ item.phoneNumber }}</span>
                         </div>
                      </div>
                   </div>
                </td>

                <td class="px-6 py-5 align-top">
                   <div v-if="editingSaleId !== item.rawSale?.id">
                       <span v-if="item.hasSales" class="px-2.5 py-1 rounded text-[11px] font-black border shadow-sm whitespace-nowrap" :class="item.category === 'បោះដុំ' ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-slate-100 border-slate-200 text-slate-600'">
                           {{ item.category }}
                       </span>
                       <span v-else class="text-slate-300 font-bold">-</span>
                   </div>
                   <div v-else @click.stop class="animate-fade-in">
                       <select v-model="editForm.category" class="w-24 px-2 py-1.5 text-xs font-bold text-slate-800 border border-indigo-200 rounded-lg outline-none bg-white shadow-sm cursor-pointer">
                          <option value="លក់រាយ">លក់រាយ</option>
                          <option value="បោះដុំ">បោះដុំ</option>
                       </select>
                   </div>
                </td>

                <td class="px-6 py-5 align-top" @click.stop>
                   <div v-if="editingSaleId !== item.rawSale?.id">
                       <div v-if="item.hasSales" class="flex flex-wrap gap-1.5 items-center">
                          <template v-for="(entry, idx) in Object.entries(item.unitCounts)" :key="entry[0]">
                             <span v-if="idx < 3 || expandedRowIds.has(item.id)" 
                                   class="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-white shadow-sm border whitespace-nowrap"
                                   :class="getUnitBadgeColor(entry[0])">
                                {{ entry[1].toLocaleString() }} {{ translateUnit(entry[0]) }}
                             </span>
                          </template>
                          <button 
                             v-if="Object.keys(item.unitCounts).length > 3" 
                             @click.stop="emit('toggle-expand', item.id)" 
                             class="text-[10px] font-bold text-indigo-500 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded transition-colors flex items-center gap-1 border border-indigo-100"
                          >
                             <span v-if="!expandedRowIds.has(item.id)">+{{ Object.keys(item.unitCounts).length - 3 }}</span>
                             <span v-else>បង្រួម</span>
                          </button>
                       </div>
                       <div v-else>
                          <span class="inline-flex items-center px-2 py-1 rounded-md text-[11px] font-bold bg-rose-50 text-rose-500 border border-rose-100">
                             គ្មានការលក់
                          </span>
                       </div>
                   </div>
                   <div v-else class="flex flex-col gap-2 animate-fade-in" @click.stop>
                       <input type="number" v-model="editForm.totalSold" min="0" class="w-20 px-3 py-1.5 text-sm font-bold text-slate-800 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none shadow-sm">
                       <select v-model="editForm.unit" class="w-full px-2 py-1.5 text-sm font-bold text-slate-800 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none bg-white shadow-sm cursor-pointer">
                          <option v-for="u in availableUnits" :key="u.value" :value="u.value">{{ u.label }}</option>
                       </select>
                   </div>
                </td>

                <td class="px-6 py-5 text-center align-top" @click.stop>
                   <div v-if="editingSaleId !== item.rawSale?.id">
                       <span v-if="item.hasSales" class="inline-flex items-center px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-sm font-bold border border-amber-100 whitespace-nowrap">
                          {{ item.totalClients.toLocaleString() }} នាក់
                       </span>
                       <span v-else class="text-slate-300 font-bold">-</span>
                   </div>
                   <div v-else class="flex items-center justify-center gap-1 animate-fade-in" @click.stop>
                       <input type="number" v-model="editForm.totalClients" min="0" class="w-16 px-2 py-1.5 text-sm font-bold text-center text-slate-800 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500/20 outline-none shadow-sm">
                       <span class="text-[10px] font-bold text-slate-500">នាក់</span>
                   </div>
                </td>

                <td class="px-6 py-5 text-right align-top" @click.stop>
                   <div v-if="editingSaleId !== item.rawSale?.id">
                       <div v-if="item.hasSales" class="flex flex-col items-end gap-1">
                          <span class="text-emerald-700 font-black text-sm bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100/60 min-w-[90px] text-right shadow-sm">
                             {{ item.revenueUSD.toLocaleString() }} $
                          </span>
                          <span class="text-blue-700 font-bold text-xs bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100/60 min-w-[90px] text-right">
                             {{ item.revenueKHR.toLocaleString() }} ៛
                          </span>
                       </div>
                       <div v-else>
                           <span class="text-slate-300 font-bold">-</span>
                       </div>
                   </div>
                   <div v-else class="flex items-center justify-end gap-1.5 animate-fade-in" @click.stop>
                       <input type="number" step="0.01" min="0" v-model="editForm.totalPrice" class="w-20 px-2 py-1.5 text-sm font-black text-right text-slate-800 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 outline-none shadow-sm">
                       <select v-model="editForm.currency" class="w-16 px-1 py-1.5 text-[10px] font-black text-slate-800 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 outline-none bg-white shadow-sm cursor-pointer">
                          <option value="USD">USD</option>
                          <option value="KHR">KHR</option>
                       </select>
                   </div>
                </td>

                <td class="px-6 py-5 text-center align-top" @click.stop>
                   <div class="flex items-center justify-center gap-1.5">
                      <template v-if="editingSaleId !== item.rawSale?.id">
                          <a v-if="item.telegram" :href="'https://t.me/' + item.telegram" target="_blank" @click.stop class="text-sky-500 hover:text-white hover:bg-sky-500 w-9 h-9 rounded-xl inline-flex items-center justify-center transition-all bg-sky-50 shadow-sm hover:shadow-md" :class="!item.hasSales ? 'opacity-60 grayscale' : ''">
                             <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.48-.94-2.4-1.54-1.06-.7-.37-1.09.23-1.72.16-.16 2.87-2.63 2.92-2.85.01-.03.01-.14-.06-.2-.06-.06-.17-.04-.25-.02-.11.02-1.91 1.2-5.39 3.55-.5.34-.95.51-1.35.5-.44-.01-1.29-.25-1.92-.42-.77-.21-1.37-.32-1.31-.68.03-.18.28-.37.76-.56 3.03-1.32 5.06-2.19 6.09-2.62 2.93-1.21 3.53-1.43 3.93-1.43.09 0 .28.01.4.04.1.03.24.1.33.25.08.16.07.32.07.33z"/></svg>
                          </a>
                          <span v-else-if="!item.hasSales" class="text-slate-300 font-black">-</span>

                          <button v-if="dateFilterType === 'daily' && item.hasSales" @click.stop="emit('start-edit', item)" class="text-amber-500 hover:text-white hover:bg-amber-500 w-9 h-9 rounded-xl inline-flex items-center justify-center transition-all bg-amber-50 shadow-sm hover:shadow-md" title="កែប្រែទិន្នន័យ (Edit)">
                             <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                          </button>
                      </template>
                      <template v-else>
                          <button @click.stop="emit('save-edit')" :disabled="isUpdatingSale" class="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 hover:bg-emerald-500 hover:text-white flex items-center justify-center shadow-sm transition-all active:scale-95" title="រក្សាទុក (Save)">
                              <svg v-if="isUpdatingSale" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                          </button>
                          <button @click.stop="emit('cancel-edit')" :disabled="isUpdatingSale" class="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 text-rose-500 hover:bg-rose-500 hover:text-white flex items-center justify-center shadow-sm transition-all active:scale-95" title="បោះបង់ (Cancel)">
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                          </button>
                      </template>
                   </div>
                </td>
             </tr>
          </tbody>
       </table>
    </div>

  </div>
</template>

<script setup>
const props = defineProps({
  data: { type: Array, required: true },
  dateFilterType: { type: String, required: true },
  availableUnits: { type: Array, required: true },
  editingSaleId: { type: String, default: null },
  editForm: { type: Object, required: true },
  isUpdatingSale: { type: Boolean, default: false },
  expandedRowIds: { type: Set, required: true }
});

const emit = defineEmits(['start-edit', 'cancel-edit', 'save-edit', 'toggle-expand', 'row-click']);

// Helpers
const translateUnit = (unitVal) => {
  if (!unitVal) return '';
  const found = props.availableUnits.find(u => u.value === unitVal);
  if (found) return found.label;
  
  const u = unitVal.toLowerCase().trim();
  if (u === 'bottle' || u === 'bottles') return 'ដប';
  if (u === 'pack' || u === 'packs') return 'កញ្ចប់';
  return unitVal; 
};

const getUnitBadgeColor = (unitVal) => {
  const found = props.availableUnits.find(u => u.value === unitVal);
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

<style scoped>
.animate-fade-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
 -webkit-appearance: none;
 margin: 0;
}
input[type="number"] {
 -moz-appearance: textfield;
}
</style>