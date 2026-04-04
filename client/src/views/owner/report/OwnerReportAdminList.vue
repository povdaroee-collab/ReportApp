<template>
  <div>
    <div class="mb-6 space-y-4">
        
        <h3 class="text-lg font-black text-slate-800">
            បញ្ជីអ្នកគ្រប់គ្រង 
            <span class="text-slate-400 font-medium text-sm">({{ filteredList.length }})</span>
        </h3>
        
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div class="flex items-center gap-3 w-full md:w-auto">
                <div class="relative flex-1 md:w-64">
                    <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                    <input v-model="searchQuery" type="text" placeholder="ស្វែងរកឈ្មោះ..." class="w-full bg-white border border-slate-200/80 rounded-xl pl-9 pr-4 py-2.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all shadow-sm">
                </div>

                <div class="relative md:hidden user-dropdown-container">
                    <button 
                        @click.stop="isSmartMenuOpen = !isSmartMenuOpen" 
                        class="w-11 h-11 rounded-xl flex items-center justify-center shadow-sm border transition-colors active:scale-95"
                        :class="isSmartMenuOpen ? 'bg-indigo-600 text-white border-indigo-700 shadow-indigo-200' : 'bg-white text-indigo-600 border-slate-200/80 hover:bg-slate-50'"
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"/></svg>
                    </button>
                    
                    <transition 
                        enter-active-class="transition ease-out duration-200" 
                        enter-from-class="opacity-0 translate-y-2 scale-95" 
                        enter-to-class="opacity-100 translate-y-0 scale-100" 
                        leave-active-class="transition ease-in duration-150" 
                        leave-from-class="opacity-100 translate-y-0 scale-100" 
                        leave-to="opacity-0 translate-y-2 scale-95"
                    >
                        <div v-if="isSmartMenuOpen" class="absolute right-0 top-14 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 flex flex-col gap-4" @click.stop>
                            
                            <button 
                                @click="$emit('toggleMobileFilters')"
                                class="w-full bg-indigo-50 text-indigo-600 border border-indigo-100 font-bold px-4 py-2.5 rounded-xl shadow-sm flex justify-center items-center gap-2 text-xs transition-all active:scale-95"
                            >
                                <svg v-if="!showMobileFilters" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                {{ showMobileFilters ? 'លាក់ផ្ទាំងកំណត់ & សរុប' : 'បង្ហាញផ្ទាំងកំណត់ & សរុប' }}
                            </button>

                            <div class="h-px w-full bg-slate-100"></div>

                            <div class="bg-slate-100 p-1.5 rounded-xl flex flex-col gap-1 shadow-inner border border-slate-200">
                                <button @click="$emit('update:activeCategory', 'all'); closeSmartMenu()" class="px-4 py-2 rounded-lg text-xs font-bold transition-all" :class="activeCategory === 'all' ? 'bg-white text-slate-800 shadow-sm ring-1 ring-slate-200' : 'text-slate-500'">ទាំងអស់</button>
                                <button @click="$emit('update:activeCategory', 'បោះដុំ'); closeSmartMenu()" class="px-4 py-2 rounded-lg text-xs font-bold transition-all" :class="activeCategory === 'បោះដុំ' ? 'bg-white text-purple-700 shadow-sm ring-1 ring-purple-200' : 'text-slate-500'">បោះដុំ</button>
                                <button @click="$emit('update:activeCategory', 'លក់រាយ'); closeSmartMenu()" class="px-4 py-2 rounded-lg text-xs font-bold transition-all" :class="activeCategory === 'លក់រាយ' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-indigo-200' : 'text-slate-500'">លក់រាយ</button>
                            </div>

                            <div class="bg-slate-100 p-1.5 rounded-xl flex flex-col gap-1 shadow-inner border border-slate-200">
                                <button @click="$emit('update:activityFilter', 'all'); closeSmartMenu()" class="px-4 py-2 rounded-lg text-xs font-bold transition-all" :class="activityFilter === 'all' ? 'bg-white text-slate-800 shadow-sm ring-1 ring-slate-200' : 'text-slate-500'">ទាំងអស់</button>
                                <button @click="$emit('update:activityFilter', 'active'); closeSmartMenu()" class="px-4 py-2 rounded-lg text-xs font-bold transition-all" :class="activityFilter === 'active' ? 'bg-white text-emerald-600 shadow-sm ring-1 ring-emerald-100' : 'text-slate-500'">មានលក់</button>
                                <button @click="$emit('update:activityFilter', 'inactive'); closeSmartMenu()" class="px-4 py-2 rounded-lg text-xs font-bold transition-all" :class="activityFilter === 'inactive' ? 'bg-white text-rose-600 shadow-sm ring-1 ring-rose-100' : 'text-slate-500'">គ្មានលក់</button>
                            </div>

                            <div class="grid grid-cols-2 gap-2">
                                <button @click="handlePrint" :disabled="filteredList.length === 0" class="col-span-2 bg-slate-800 hover:bg-slate-900 text-white py-2.5 rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-95 font-bold text-xs disabled:opacity-50">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                                    Print
                                </button>
                                <button @click="handlePDF" :disabled="filteredList.length === 0" class="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white py-2.5 rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-95 font-bold text-xs disabled:opacity-50">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                    PDF
                                </button>
                                <button @click="handleExcel" :disabled="filteredList.length === 0" class="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white py-2.5 rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-95 font-bold text-xs disabled:opacity-50">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                    Excel
                                </button>
                            </div>
                        </div>
                    </transition>
                </div>
            </div>

            <div class="hidden md:flex flex-wrap items-center gap-3">
                <div class="bg-slate-200/50 p-1.5 rounded-xl flex shadow-inner border border-slate-200">
                    <button @click="$emit('update:activeCategory', 'all')" class="px-4 py-2 rounded-lg text-xs font-bold transition-all" :class="activeCategory === 'all' ? 'bg-white text-slate-800 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'">ទាំងអស់</button>
                    <button @click="$emit('update:activeCategory', 'បោះដុំ')" class="px-4 py-2 rounded-lg text-xs font-bold transition-all" :class="activeCategory === 'បោះដុំ' ? 'bg-white text-purple-700 shadow-sm ring-1 ring-purple-200' : 'text-slate-500 hover:text-purple-700'">បោះដុំ</button>
                    <button @click="$emit('update:activeCategory', 'លក់រាយ')" class="px-4 py-2 rounded-lg text-xs font-bold transition-all" :class="activeCategory === 'លក់រាយ' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-indigo-200' : 'text-slate-500 hover:text-indigo-600'">លក់រាយ</button>
                </div>

                <div class="bg-slate-200/50 p-1.5 rounded-xl flex shadow-inner border border-slate-200">
                    <button @click="$emit('update:activityFilter', 'all')" class="px-4 py-2 rounded-lg text-xs font-bold transition-all" :class="activityFilter === 'all' ? 'bg-white text-slate-800 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'">ទាំងអស់</button>
                    <button @click="$emit('update:activityFilter', 'active')" class="px-4 py-2 rounded-lg text-xs font-bold transition-all" :class="activityFilter === 'active' ? 'bg-white text-emerald-600 shadow-sm ring-1 ring-emerald-100' : 'text-slate-500 hover:text-emerald-600'">មានលក់</button>
                    <button @click="$emit('update:activityFilter', 'inactive')" class="px-4 py-2 rounded-lg text-xs font-bold transition-all" :class="activityFilter === 'inactive' ? 'bg-white text-rose-600 shadow-sm ring-1 ring-rose-100' : 'text-slate-500 hover:text-rose-600'">គ្មានលក់</button>
                </div>

                <button v-if="currentUserRole === 'superadmin'" @click="$emit('preview')" class="flex items-center gap-1.5 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 rounded-xl font-bold text-[12px] transition-all shadow-sm active:scale-95">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    Preview
                </button>

                <button 
    @click="$emit('preview')" 
    class="group relative flex items-center justify-center gap-2.5 px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-black text-[13px] transition-all active:scale-95 shadow-lg shadow-slate-900/20 overflow-hidden shrink-0"
>
    <div class="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
    
    <svg class="w-4 h-4 md:w-5 md:h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
    </svg>
    
    <span class="relative z-10 tracking-wide">កំណត់របាយការណ៍ (Export)</span>
</button>
            </div>
        </div>
    </div>

    <div v-if="isLoading" class="flex flex-col items-center justify-center py-24 opacity-60">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-indigo-600 mb-4"></div>
    </div>
    <div v-else-if="filteredList.length === 0" class="flex flex-col items-center justify-center py-20 bg-white/50 backdrop-blur-sm rounded-[2rem] border-2 border-dashed border-slate-200">
        <p class="text-slate-600 font-bold text-lg">មិនមានទិន្នន័យទេ</p>
    </div>

    <div v-else>
        <div class="hidden md:block bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 overflow-hidden">
            <table class="w-full text-left border-collapse">
                <thead class="bg-slate-50/80 text-slate-500 text-[11px] uppercase font-black tracking-widest border-b border-slate-200">
                    <tr>
                        <th class="px-6 py-5 w-16 text-center">#</th>
                        <th class="px-6 py-5">អ្នកគ្រប់គ្រង</th>
                        <th class="px-6 py-5 text-center">ប្រភេទ</th>
                        <th class="px-6 py-5 text-center">តំណាងលក់សរុប</th>
                        <th class="px-6 py-5">ចំនួនលក់ (Units)</th>
                        <th class="px-6 py-5 text-center">អតិថិជនសរុប</th>
                        <th class="px-6 py-5 text-right">ចំណូល</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    <tr 
                        v-for="(item, index) in filteredList" 
                        :key="item.uniqueId" 
                        @click="goToAdminDetail(item)"
                        class="transition-colors group cursor-pointer" 
                        :class="item.hasSales ? 'hover:bg-indigo-50/50' : 'bg-slate-50/30 hover:bg-slate-100/50'"
                    >
                        <td class="px-6 py-5 text-center"><span class="text-xs font-black" :class="item.hasSales ? 'text-slate-500' : 'text-slate-300'">{{ index + 1 }}</span></td>
                        
                        <td class="px-6 py-5">
                            <div class="flex items-center gap-4">
                            <img :src="item.photoUrl || `https://ui-avatars.com/api/?name=${item.fullName}`" class="w-11 h-11 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform" :class="!item.hasSales ? 'grayscale-[40%] opacity-70' : ''">
                            <div>
                                <p class="font-bold text-sm mb-0.5 group-hover:text-indigo-600 transition-colors" :class="item.hasSales ? 'text-slate-800' : 'text-slate-500'">{{ item.fullName }}</p>
                                <p class="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 font-mono font-bold inline-block">@{{ item.username }}</p>
                            </div>
                            </div>
                        </td>
                        
                        <td class="px-6 py-5 text-center">
                            <span v-if="item.hasSales" :class="item.category === 'បោះដុំ' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-slate-50 text-slate-700 border-slate-200'" class="px-2.5 py-1 rounded-md text-[11px] font-bold border">
                                {{ item.category }}
                            </span>
                            <span v-else class="text-slate-300 font-bold">-</span>
                        </td>

                        <td class="px-6 py-5 text-center">
                            <span class="inline-flex items-center px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold border border-slate-200 shadow-sm">{{ item.totalSellersCount }} នាក់</span>
                        </td>
                        
                        <td class="px-6 py-5">
                            <div v-if="item.hasSales" class="flex flex-wrap gap-2 items-center">
                            <template v-for="(count, unit, idx) in item.unitCounts" :key="unit">
                                <span v-if="idx < 3 || expandedRowIds.has(item.uniqueId)" class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold shadow-sm border text-slate-600 bg-slate-50">
                                    {{ count.toLocaleString() }} {{ translateUnit(unit) }}
                                </span>
                            </template>
                            
                            <button 
                                v-if="Object.keys(item.unitCounts).length > 3" 
                                @click.stop="toggleRowExpand(item.uniqueId)" 
                                class="text-[11px] font-bold text-indigo-500 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 border border-indigo-100"
                            >
                                <span v-if="!expandedRowIds.has(item.uniqueId)">+{{ Object.keys(item.unitCounts).length - 3 }} ទៀត</span>
                                <span v-else>បង្រួម</span>
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path v-if="!expandedRowIds.has(item.uniqueId)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
                                </svg>
                            </button>
                            </div>
                            <div v-else><span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-400">គ្មានការលក់</span></div>
                        </td>
                        
                        <td class="px-6 py-5 text-center">
                            <span v-if="item.hasSales" class="inline-flex items-center px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-sm font-bold border border-amber-100">{{ item.totalClients.toLocaleString() }} នាក់</span>
                            <span v-else class="text-slate-300 font-bold">-</span>
                        </td>
                        
                        <td class="px-6 py-5 text-right">
                            <div v-if="item.hasSales" class="flex flex-col items-end gap-1">
                            <span class="text-emerald-700 font-black text-sm bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100/60 min-w-[90px] text-right shadow-sm">{{ item.revenueUSD.toLocaleString() }} $</span>
                            <span class="text-blue-700 font-bold text-xs bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100/60 min-w-[90px] text-right">{{ item.revenueKHR.toLocaleString() }} ៛</span>
                            </div>
                            <div v-else><span class="text-slate-300 font-bold">-</span></div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="md:hidden flex flex-col gap-4">
            <div 
                v-for="(item, index) in filteredList" 
                :key="item.uniqueId" 
                @click="goToAdminDetail(item)"
                class="bg-white p-5 rounded-[20px] shadow-sm border relative overflow-hidden transition-all cursor-pointer" 
                :class="item.hasSales ? 'border-slate-100 hover:border-indigo-300' : 'border-rose-100/50 bg-slate-50/50 hover:border-rose-300'"
            >
                <div class="absolute top-0 right-0 px-3 py-1.5 rounded-bl-xl border-b border-l text-[10px] font-black" :class="item.hasSales ? 'bg-slate-50 text-slate-400 border-slate-100' : 'bg-rose-50 text-rose-400 border-rose-100'">#{{ index + 1 }}</div>
                <div class="flex items-center gap-4 mb-4">
                    <div class="relative shrink-0">
                        <img :src="item.photoUrl || `https://ui-avatars.com/api/?name=${item.fullName}`" class="w-14 h-14 rounded-2xl object-cover shadow-sm border border-slate-100" :class="!item.hasSales ? 'grayscale-[40%] opacity-70' : ''">
                    </div>
                    <div class="flex-1 min-w-0 pr-6">
                        <h3 class="font-bold text-lg leading-tight truncate" :class="item.hasSales ? 'text-slate-800' : 'text-slate-500'">{{ item.fullName }}</h3>
                        <div class="flex items-center gap-2 mt-1">
                            <span v-if="item.hasSales" :class="item.category === 'បោះដុំ' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-slate-50 text-slate-700 border-slate-200'" class="px-2 py-0.5 rounded text-[10px] font-bold border">
                                {{ item.category }}
                            </span>
                        </div>
                    </div>
                </div>

                <div class="flex justify-between items-center mt-3 pt-3 border-t border-slate-100">
                    <div class="flex gap-2">
                        <a v-if="item.telegram" @click.stop :href="'https://t.me/' + item.telegram.replace('@', '')" target="_blank" class="w-8 h-8 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-colors">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.48-.94-2.4-1.54-1.06-.7-.37-1.09.23-1.72.16-.16 2.87-2.63 2.92-2.85.01-.03.01-.14-.06-.2-.06-.06-.17-.04-.25-.02-.11.02-1.91 1.2-5.39 3.55-.5.34-.95.51-1.35.5-.44-.01-1.29-.25-1.92-.42-.77-.21-1.37-.32-1.31-.68.03-.18.28-.37.76-.56 3.03-1.32 5.06-2.19 6.09-2.62 2.93-1.21 3.53-1.43 3.93-1.43.09 0 .28.01.4.04.1.03.24.1.33.25.08.16.07.32.07.33z"/></svg>
                        </a>
                    </div>
                    <span class="text-xs font-bold text-slate-500">មើលបញ្ជីតំណាងលក់ &rarr;</span>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  displayedData: Array,
  isLoading: Boolean,
  unitSettings: Array,
  activeCategory: String,
  activityFilter: String,
  showMobileFilters: Boolean ,
  currentUserRole: String // 🌟 បន្ថែមបន្ទាត់នេះ 🌟
});

// Added 'excel' to emitted events
const emit = defineEmits(['update:activeCategory', 'update:activityFilter', 'print', 'pdf', 'excel', 'toggleMobileFilters','preview']);
const router = useRouter();

const searchQuery = ref('');
const expandedRowIds = ref(new Set());
const isSmartMenuOpen = ref(false); 

const closeSmartMenu = () => {
    isSmartMenuOpen.value = false;
};

const handlePrint = () => {
    closeSmartMenu();
    emit('print');
};

const handlePDF = () => {
    closeSmartMenu();
    emit('pdf');
};

// Added handleExcel method
const handleExcel = () => {
    closeSmartMenu();
    emit('excel');
};

const handleClickOutside = (event) => {
    const container = document.querySelector('.user-dropdown-container');
    if (isSmartMenuOpen.value && container && !container.contains(event.target)) {
        isSmartMenuOpen.value = false;
    }
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});

const filteredList = computed(() => {
    if (!searchQuery.value) return props.displayedData;
    const q = searchQuery.value.toLowerCase().trim();
    return props.displayedData.filter(item => item.fullName.toLowerCase().includes(q));
});

// const goToAdminDetail = (admin) => {
//     if (admin && admin.originalAdminId) {
//         router.push({ name: 'OwnerAdminDetail', params: { id: admin.originalAdminId } });
//     }
// };

const toggleRowExpand = (id) => {
    const newSet = new Set(expandedRowIds.value);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    expandedRowIds.value = newSet;
};

const translateUnit = (unitVal) => {
    if (!unitVal) return '';
    const safeVal = String(unitVal);
    const found = props.unitSettings.find(u => String(u.value) === safeVal);
    if (found) return found.label;
    
    const u = safeVal.toLowerCase().trim();
    if (u === 'bottle' || u === 'bottles') return 'ដប';
    if (u === 'pack' || u === 'packs') return 'កញ្ចប់';
    return safeVal; 
};
</script>