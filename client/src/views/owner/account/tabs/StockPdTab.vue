<template>
    <div class="space-y-6 animate-fade-in-up relative font-khmer pb-32">
        
        <ConfirmDialog ref="confirmDialogRef" />

        <div class="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-20">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path></svg>
                </div>
                <div>
                    <h2 class="text-xl font-black text-slate-800 leading-tight">គ្រប់គ្រងស្តុក-PD</h2>
                    <p class="text-xs font-bold text-slate-500 mt-0.5">អីវ៉ាន់តំណាងលក់ខ្ចីតាំង / សង / លក់</p>
                </div>
            </div>

            <div class="flex items-center gap-3 w-full lg:w-auto">
                <button @click="downloadExcel" :disabled="isExporting || groupedList.length===0" class="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white px-4 py-2.5 rounded-xl font-black text-xs transition-all shadow-sm disabled:opacity-50">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    Excel
                </button>
                <button @click="downloadPDF" :disabled="isExporting || groupedList.length===0" class="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white px-4 py-2.5 rounded-xl font-black text-xs transition-all shadow-sm disabled:opacity-50">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    PDF
                </button>
                <button @click="openAddModal" class="flex-1 lg:flex-none bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 rounded-xl font-black text-sm shadow-lg shadow-slate-900/20 transition-all active:scale-95 flex items-center justify-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"></path></svg>
                    កាត់ស្តុកថ្មី
                </button>
            </div>
        </div>

        <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col xl:flex-row items-center justify-between gap-4 relative z-10">
            <div class="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
                <div class="w-full sm:w-48 relative">
                    <select v-model="filterAdmin" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-indigo-500 appearance-none cursor-pointer">
                        <option value="ALL">មើល Admin ទាំងអស់</option>
                        <option v-for="admin in admins" :key="admin.id" :value="admin.id">{{ admin.name }}</option>
                    </select>
                    <svg class="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
                
                <div v-if="filterAdmin !== 'ALL'" class="w-full sm:w-48 relative animate-fade-in">
                    <select v-model="filterSeller" class="w-full bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-2.5 text-sm font-bold text-indigo-700 outline-none focus:border-indigo-500 appearance-none cursor-pointer">
                        <option value="ALL">តំណាងលក់ទាំងអស់</option>
                        <option v-for="seller in getSellersByAdmin(filterAdmin)" :key="seller.id" :value="seller.id">{{ seller.fullName }}</option>
                    </select>
                    <svg class="w-4 h-4 text-indigo-400 absolute right-3 top-3 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>

                <div class="w-full sm:w-64 relative">
                    <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></span>
                    <input v-model="filterSearch" type="text" placeholder="ស្វែងរកឈ្មោះ ឬ ID..." class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-indigo-500 transition-colors">
                </div>
            </div>

            <div class="flex bg-slate-100 p-1 rounded-xl border border-slate-200 w-full xl:w-auto overflow-x-auto custom-scrollbar shrink-0">
                <button @click="filterStatus = 'ALL'" :class="filterStatus === 'ALL' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'" class="px-5 py-1.5 rounded-lg font-black text-xs transition-all whitespace-nowrap flex items-center gap-1.5">
                    ទាំងអស់ <span class="bg-slate-200 text-slate-600 px-1.5 rounded text-[10px]">{{ statusCounts.all }}</span>
                </button>
                <button @click="filterStatus = 'borrowed'" :class="filterStatus === 'borrowed' ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20' : 'text-amber-600 hover:bg-amber-50'" class="px-5 py-1.5 rounded-lg font-black text-xs transition-all whitespace-nowrap flex items-center gap-1.5">
                    កំពុងខ្ចី <span class="px-1.5 rounded text-[10px]" :class="filterStatus === 'borrowed' ? 'bg-amber-400 text-white' : 'bg-amber-100 text-amber-700'">{{ statusCounts.borrowed }}</span>
                </button>
                <button @click="filterStatus = 'sold'" :class="filterStatus === 'sold' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' : 'text-emerald-600 hover:bg-emerald-50'" class="px-5 py-1.5 rounded-lg font-black text-xs transition-all whitespace-nowrap flex items-center gap-1.5">
                    បានលក់ <span class="px-1.5 rounded text-[10px]" :class="filterStatus === 'sold' ? 'bg-emerald-400 text-white' : 'bg-emerald-100 text-emerald-700'">{{ statusCounts.sold }}</span>
                </button>
                <button @click="filterStatus = 'returned'" :class="filterStatus === 'returned' ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20' : 'text-blue-600 hover:bg-blue-50'" class="px-5 py-1.5 rounded-lg font-black text-xs transition-all whitespace-nowrap flex items-center gap-1.5">
                    បានសង <span class="px-1.5 rounded text-[10px]" :class="filterStatus === 'returned' ? 'bg-blue-400 text-white' : 'bg-blue-100 text-blue-700'">{{ statusCounts.returned }}</span>
                </button>
            </div>
        </div>

        <div class="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div v-if="isLoading" class="py-20 text-center opacity-60">
                <div class="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-indigo-600 mx-auto mb-3"></div>
                <p class="text-sm font-bold text-slate-500">កំពុងទាញយកទិន្នន័យ...</p>
            </div>
            <div class="overflow-x-auto custom-scrollbar" v-else>
                <table class="w-full text-left border-collapse min-w-[1050px]">
                    <thead class="bg-slate-50 text-slate-500 text-[11px] uppercase font-black tracking-widest border-b border-slate-200">
                        <tr>
                            <th class="px-5 py-4 w-12 text-center">ល.រ</th>
                            <th class="px-5 py-4">តំណាងលក់</th>
                            <th class="px-5 py-4">កាលបរិច្ឆេទ</th>
                            <th class="px-5 py-4 text-center">ទំនិញសរុប</th>
                            <th class="px-5 py-4 text-right">ទឹកប្រាក់សរុប</th>
                            <th class="px-5 py-4 text-center w-32">ស្ថានភាពរួម</th>
                            <th class="px-5 py-4 text-center w-[140px]">សកម្មភាព</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <tr v-if="paginatedGroupedList.length === 0">
                            <td colspan="7" class="py-16 text-center text-slate-400 font-bold">
                                <svg class="w-12 h-12 mx-auto mb-2 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                                មិនមានទិន្នន័យទេ
                            </td>
                        </tr>
                        
                        <template v-for="(group, index) in paginatedGroupedList" :key="group.id">
                            <tr @click="toggleGroup(group.id)" class="hover:bg-slate-50/80 transition-colors cursor-pointer group">
                                <td class="px-5 py-4 text-center text-xs font-bold text-slate-400">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                                <td class="px-5 py-4">
                                    <p class="font-black text-slate-800 text-sm">{{ group.sellerName }}</p>
                                    <p class="text-[10px] font-bold text-slate-500 mt-0.5">ID: {{ group.sellerIdNumber || 'N/A' }}</p>
                                </td>
                                <td class="px-5 py-4">
                                    <p class="font-black text-slate-700 text-sm">{{ formatDate(group.createdAt) }}</p>
                                    <span class="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[10px] font-black border border-indigo-100">
                                        ⏳ រយៈពេល: {{ getDurationDays(group.createdAt) }} ថ្ងៃ
                                    </span>
                                </td>
                                <td class="px-5 py-4 text-center">
                                    <span class="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-sm font-black border border-indigo-100 shadow-sm">
                                        {{ group.items.length }} មុខ
                                    </span>
                                </td>
                                <td class="px-5 py-4 text-right font-black text-rose-500 text-sm">
                                    {{ formatCurrency(group.totalAmount) }}
                                </td>
                                <td class="px-5 py-4 text-center">
                                    <span v-if="group.status === 'borrowed'" class="inline-flex items-center gap-1 bg-amber-50 text-amber-600 px-2.5 py-1 rounded-md text-[11px] font-black border border-amber-200">
                                        <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> កំពុងខ្ចី
                                    </span>
                                    <span v-else-if="group.status === 'sold'" class="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-md text-[11px] font-black border border-emerald-200">
                                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg> បានលក់
                                    </span>
                                    <span v-else class="inline-flex items-center gap-1 bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md text-[11px] font-black border border-blue-200">
                                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path></svg> បានសង
                                    </span>
                                </td>
                                <td class="px-5 py-4 text-center">
                                    <div class="flex items-center justify-center gap-1.5">
                                        <button @click.stop="openEditGroupModal(group)" class="p-2 bg-white hover:bg-indigo-500 hover:text-white text-slate-500 rounded-lg transition-colors shadow-sm border border-slate-200" title="កែប្រែបញ្ជីនេះ">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                        </button>
                                        <button @click.stop="promptDeleteGroup(group)" class="p-2 bg-white hover:bg-rose-500 hover:text-white text-rose-500 rounded-lg transition-colors shadow-sm border border-slate-200" title="លុបបញ្ជីនេះ">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                        </button>
                                        <button class="p-1.5 rounded-full text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-all ml-1">
                                            <svg :class="expandedGroups.includes(group.id) ? 'rotate-180 text-indigo-600' : ''" class="w-5 h-5 transform transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            
                            <tr v-if="expandedGroups.includes(group.id)" class="bg-slate-50/80 inset-shadow">
                                <td colspan="7" class="p-0 border-b border-slate-200">
                                    <div class="px-6 py-4 lg:pl-16 lg:pr-6 animate-fade-in">
                                        <table class="w-full text-left bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                                            <thead class="bg-slate-100 text-[10px] text-slate-500 font-black uppercase tracking-wider">
                                                <tr>
                                                    <th class="px-4 py-2.5 w-10 text-center">#</th>
                                                    <th class="px-4 py-2.5">មុខទំនិញលម្អិត</th>
                                                    <th class="px-4 py-2.5 text-center">ចំនួន</th>
                                                    <th class="px-4 py-2.5 text-right">តម្លៃឯកតា</th>
                                                    <th class="px-4 py-2.5 text-right">សរុប</th>
                                                    <th class="px-4 py-2.5 text-left">ចំណាំ</th>
                                                    <th class="px-4 py-2.5 text-center">ស្ថានភាព</th>
                                                </tr>
                                            </thead>
                                            <tbody class="divide-y divide-slate-100 text-xs font-bold text-slate-700">
                                                <tr v-for="(item, idx) in group.items" :key="item.id" class="hover:bg-slate-50 transition-colors">
                                                    <td class="px-4 py-3 text-center text-slate-400">{{ idx + 1 }}</td>
                                                    <td class="px-4 py-3 text-slate-800">{{ item.productName }}</td>
                                                    <td class="px-4 py-3 text-center text-indigo-600 font-black">{{ item.qty }} <span class="text-[10px] text-slate-500 font-bold">{{ item.unit === 'case' ? 'កេះ' : 'ដប' }}</span></td>
                                                    <td class="px-4 py-3 text-right">{{ formatCurrency(item.unitPrice || item.price) }}</td>
                                                    <td class="px-4 py-3 text-right text-rose-500 font-black">{{ formatCurrency(item.totalPrice || (item.qty * (item.unitPrice || item.price))) }}</td>
                                                    <td class="px-4 py-3 text-slate-500 font-normal"><p class="line-clamp-1 max-w-[120px]" :title="item.note">{{ item.note || '-' }}</p></td>
                                                    <td class="px-4 py-3 text-center">
                                                        <span v-if="item.status === 'borrowed'" class="text-amber-500 font-black text-[10px]">🟡 បានខ្ចី</span>
                                                        <span v-else-if="item.status === 'sold'" class="text-emerald-500 font-black text-[10px]">🟢 បានលក់</span>
                                                        <span v-else class="text-blue-500 font-black text-[10px]">🔵 បានសង</span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>

            <div v-if="totalPages > 1" class="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
                <button @click="currentPage--" :disabled="currentPage === 1" class="px-4 py-2 border border-slate-200 bg-white rounded-xl hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm font-bold text-slate-600 shadow-sm flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg> ថយក្រោយ
                </button>
                <span class="text-xs font-black text-slate-600 bg-slate-200/50 px-4 py-2 rounded-lg">ទំព័រ {{ currentPage }} នៃ {{ totalPages }}</span>
                <button @click="currentPage++" :disabled="currentPage === totalPages" class="px-4 py-2 border border-slate-200 bg-white rounded-xl hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm font-bold text-slate-600 shadow-sm flex items-center gap-1">
                    ទៅមុខ <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                </button>
            </div>
        </div>

        <div v-if="showModal" class="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div class="bg-white rounded-[1.5rem] w-full max-w-4xl shadow-2xl relative overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
                
                <div class="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                    <h3 class="font-black text-slate-800 text-lg flex items-center gap-3">
                        <div class="w-10 h-10 bg-[#4F46E5] text-white rounded-full flex items-center justify-center shadow-md">
                            <svg v-if="!isEditing" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4"></path></svg>
                            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                        </div>
                        {{ isEditing ? 'កែប្រែបញ្ជី PD រួម' : 'កាត់ស្តុកឱ្យខ្ចីថ្មី (PD) - ច្រើនមុខ' }}
                    </h3>
                    <button @click="closeModal" class="text-slate-400 hover:text-rose-500 transition-colors bg-slate-50 rounded-full p-2 border border-slate-200">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                
                <div class="p-6 bg-slate-50 overflow-y-auto custom-scrollbar flex-1">
                    
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                        <div>
                            <label class="block text-[11px] font-black text-slate-600 uppercase mb-1.5 tracking-wider">ជ្រើសរើស Admin <span class="text-rose-500">*</span></label>
                            <select v-model="form.adminId" @change="onAdminChange" :disabled="isEditing" class="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer disabled:opacity-60 shadow-sm">
                                <option value="">-- ជ្រើសរើស --</option>
                                <option v-for="admin in admins" :key="admin.id" :value="admin.id">{{ admin.name }}</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-[11px] font-black text-slate-600 uppercase mb-1.5 tracking-wider">ជ្រើសរើស តំណាងលក់ <span class="text-rose-500">*</span></label>
                            <select v-model="form.sellerId" :disabled="!form.adminId || isEditing" class="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer disabled:opacity-60 shadow-sm">
                                <option value="">-- ជ្រើសរើស --</option>
                                <option v-for="seller in formSellers" :key="seller.id" :value="seller.id">{{ seller.fullName }}</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-[11px] font-black text-slate-600 uppercase mb-1.5 tracking-wider">កាលបរិច្ឆេទ (DATE) <span class="text-rose-500">*</span></label>
                            <input v-model="form.transactionDate" type="date" class="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm cursor-pointer">
                        </div>
                    </div>

                    <div class="relative mb-6">
                        <label class="block text-[11px] font-black text-indigo-600 uppercase mb-1.5 tracking-wider">ស្វែងរក និងបន្ថែមមុខទំនិញ (ADD PRODUCTS) <span class="text-rose-500">*</span></label>
                        <div class="relative">
                            <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></span>
                            <input v-model="productSearch" @input="showProductDropdown = true" @focus="showProductDropdown = true" type="text" class="w-full bg-white border border-indigo-200 rounded-xl pl-11 pr-4 py-3 text-sm font-bold text-indigo-800 outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-[#4F46E5] shadow-sm transition-all" placeholder="វាយឈ្មោះទំនិញដើម្បីបញ្ជូលទៅក្នុងបញ្ជីខាងក្រោម...">
                        </div>
                        
                        <div v-if="showProductDropdown && filteredProducts.length > 0" class="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-56 overflow-y-auto custom-scrollbar">
                            <div v-for="prod in filteredProducts" :key="prod.id" @click="selectProduct(prod)" class="px-4 py-3 hover:bg-indigo-50 cursor-pointer border-b border-slate-50 last:border-0 transition-colors">
                                <p class="font-black text-sm text-slate-800">{{ prod.name }}</p>
                                <p class="text-[10px] text-slate-500 font-bold mt-0.5 flex gap-3">
                                    <span>Cost: <b class="text-rose-500">{{ prod.unitCost }}$</b></span>
                                    <span>Retail: <b class="text-emerald-600">{{ prod.retailPrice }}$</b></span>
                                    <span v-if="prod.wholesaleTiers && prod.wholesaleTiers.length > 0">Wholesale: <b class="text-indigo-600">{{ prod.wholesaleTiers.length }} Tiers</b></span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div v-if="cartItems.length > 0" class="space-y-4">
                        <div v-for="(item, idx) in cartItems" :key="item.tempId" class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm relative group animate-fade-in transition-all">
                            
                            <button @click="removeCartItem(idx)" class="absolute top-4 right-4 bg-rose-50 text-rose-400 hover:bg-rose-500 hover:text-white w-7 h-7 rounded-full flex items-center justify-center transition-colors shadow-sm z-10">
                               <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                            
                            <div class="flex items-center gap-3 mb-5 pr-10 border-b border-slate-100 pb-3">
                                <span class="bg-indigo-100 text-indigo-700 w-6 h-6 rounded flex items-center justify-center font-black text-xs">{{ idx + 1 }}</span>
                                <h4 class="font-black text-slate-800 text-sm">{{ item.productName }}</h4>
                            </div>
                            
                            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label class="block text-[10px] font-bold text-slate-500 mb-1">ចំនួន (QTY)</label>
                                    <div class="flex rounded-lg overflow-hidden border border-slate-200 bg-slate-50 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
                                        <input v-model.number="item.qty" @input="onItemQtyChange(item)" type="number" min="1" class="w-full bg-transparent px-3 py-2.5 text-sm font-black text-slate-800 outline-none">
                                        <select v-model="item.unit" @change="onItemQtyChange(item)" class="bg-slate-200/50 border-l border-slate-200 px-2 py-2.5 text-xs font-bold text-slate-700 outline-none cursor-pointer">
                                            <option value="bottle">ដប</option>
                                            <option value="case">កេះ</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div>
                                    <label class="block text-[10px] font-bold text-slate-500 mb-1">តម្លៃឯកតា</label>
                                    <div class="relative">
                                        <span class="absolute inset-y-0 left-0 pl-3 flex items-center font-bold text-slate-400 text-xs">$</span>
                                        <input v-model.number="item.unitPrice" @input="onItemUnitPriceChange(item)" type="number" step="0.001" min="0" class="w-full bg-slate-50 border border-slate-200 rounded-lg pl-6 pr-3 py-2.5 text-sm font-black text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all">
                                    </div>
                                </div>

                                <div>
                                    <label class="block text-[10px] font-bold text-slate-500 mb-1">តម្លៃសរុប</label>
                                    <div class="relative">
                                        <span class="absolute inset-y-0 left-0 pl-3 flex items-center font-bold text-indigo-500 text-xs">$</span>
                                        <input v-model.number="item.totalPrice" @input="onItemTotalPriceChange(item)" type="number" step="0.001" min="0" class="w-full bg-indigo-50 border border-indigo-200 rounded-lg pl-6 pr-3 py-2.5 text-sm font-black text-indigo-800 outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all">
                                    </div>
                                </div>

                                <div>
                                    <label class="block text-[10px] font-bold text-slate-500 mb-1">ស្ថានភាព</label>
                                    <select v-model="item.status" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs font-black text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer">
                                        <option value="borrowed">🟡 បានខ្ចី (Pending)</option>
                                        <option value="sold">🟢 បានលក់ (Sold)</option>
                                        <option value="returned">🔵 បានសង (Returned)</option>
                                    </select>
                                </div>

                                <div class="md:col-span-4 mt-1">
                                    <input v-model="item.note" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs font-bold text-slate-600 outline-none focus:border-indigo-500 transition-all placeholder:font-normal" placeholder="ចំណាំបន្ថែម (ស្រេចចិត្ត)...">
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div v-if="cartItems.length === 0" class="text-center py-10 opacity-50">
                        <svg class="w-16 h-16 mx-auto mb-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                        <p class="font-bold text-slate-600">មិនទាន់មានមុខទំនិញទេ</p>
                        <p class="text-xs mt-1">សូមស្វែងរកទំនិញនៅប្រអប់ខាងលើ ដើម្បីបញ្ចូលទីនេះ</p>
                    </div>

                </div>

                <div class="px-6 py-4 bg-white border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0 rounded-b-[1.5rem]">
                    <div class="text-left w-full sm:w-auto" v-if="cartItems.length > 0">
                        <p class="text-xs font-bold text-slate-500">សរុបប្រាក់ទំនិញ <span class="text-indigo-600 font-black">({{ cartItems.length }} មុខ)</span> :</p>
                        <p class="text-xl font-black text-slate-800">$ {{ cartTotalFormatted }}</p>
                    </div>
                    <div v-else></div>

                    <div class="flex gap-3 w-full sm:w-auto">
                        <button @click="closeModal" class="flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-bold text-sm text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm">បោះបង់</button>
                        <button @click="saveData" :disabled="isSaving || cartItems.length === 0" class="flex-1 sm:flex-none px-8 py-2.5 rounded-xl font-bold text-sm text-white bg-[#4F46E5] hover:bg-indigo-700 shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                            <span v-if="isSaving" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                            រក្សាទុកទិន្នន័យ
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div ref="printStaging" class="fixed top-0 left-[-9999px] pointer-events-none z-[-1] opacity-0"></div>

    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue';
import { db } from '@/firebaseConfig';
import { collection, getDocs, getDoc, doc, addDoc, updateDoc, deleteDoc, query, orderBy, increment } from 'firebase/firestore';
import { useNotificationStore } from '@/stores/notification';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import ConfirmDialog from '@/components/shared/ConfirmDialog.vue';

const notification = useNotificationStore();
const confirmDialogRef = ref(null);

// UI States
const isLoading = ref(true);
const isSaving = ref(false);
const showModal = ref(false);
const isEditing = ref(false);
const editId = ref(null);
const isExporting = ref(false);
const printStaging = ref(null);

// Expanding Rows
const expandedGroups = ref([]);

// Pagination
const currentPage = ref(1);
const itemsPerPage = 20;

// Data States
const admins = ref([]);
const sellers = ref([]);
const products = ref([]);
const masterData = ref([]);

// Filter States
const filterAdmin = ref('ALL');
const filterSeller = ref('ALL');
const filterSearch = ref('');
const filterStatus = ref('ALL'); 

// Modal Form States
const form = reactive({ adminId: '', sellerId: '', transactionDate: new Date().toISOString().split('T')[0] });
const formSellers = ref([]);
const productSearch = ref('');
const showProductDropdown = ref(false);

// Cart Array for Multiple Items & Editing Group
const cartItems = ref([]);
const originalGroupItems = ref([]); 

// 1. Fetch Global Data
const fetchGlobals = async () => {
    try {
        const uSnap = await getDocs(collection(db, 'users'));
        const adminList = [];
        const sellerList = [];
        uSnap.forEach(doc => {
            const data = doc.data();
            if (data.role === 'admin') {
                adminList.push({ id: doc.id, name: data.fullName || data.username || doc.id });
            } else if (data.role === 'seller' || data.role === 'dealer') {
                sellerList.push({ id: doc.id, ...data });
            }
        });
        admins.value = adminList;
        sellers.value = sellerList;

        const pSnap = await getDocs(collection(db, 'stocks'));
        products.value = pSnap.docs.map(doc => {
            const d = doc.data();
            return { 
                id: doc.id, 
                name: d.name || d.productName,
                unitCost: Number(d.unitCost || 0),
                itemsPerCase: Number(d.itemsPerCase || 1),
                retailPrice: Number(d.retailPrice || d.price || 0), 
                wholesaleTiers: Array.isArray(d.wholesaleTiers) ? d.wholesaleTiers : [] 
            };
        });

        await fetchMasterData();
    } catch (e) {
        console.error(e);
    } finally {
        isLoading.value = false;
    }
};

const fetchMasterData = async () => {
    try {
        const q = query(collection(db, 'stock_pd'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        masterData.value = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch(e) { console.error(e); }
};

onMounted(() => { fetchGlobals(); });

watch(filterAdmin, () => {
    filterSeller.value = 'ALL';
    currentPage.value = 1;
});

const getSellersByAdmin = (adminId) => {
    return sellers.value.filter(s => s.createdBy === adminId);
};

// Smart Product Search Logic
const filteredProducts = computed(() => {
    if(!productSearch.value) return products.value.slice(0, 10);
    const s = productSearch.value.toLowerCase();
    return products.value.filter(p => p.name.toLowerCase().includes(s)).slice(0, 10);
});

// Push Product to Cart
const selectProduct = (prod) => {
    const existing = cartItems.value.find(i => i.productId === prod.id);
    if (existing) {
        existing.qty += 1;
        applyItemPrice(existing);
    } else {
        const newItem = {
            tempId: Date.now() + Math.random(),
            docId: null, 
            productId: prod.id,
            productName: prod.name,
            qty: 1,
            unit: 'bottle',
            unitPrice: 0,
            totalPrice: 0,
            status: 'borrowed',
            note: '',
            baseData: prod
        };
        applyItemPrice(newItem);
        cartItems.value.push(newItem);
    }
    productSearch.value = '';
    showProductDropdown.value = false;
};

const removeCartItem = (index) => {
    cartItems.value.splice(index, 1);
};

const cartTotalFormatted = computed(() => {
    const total = cartItems.value.reduce((sum, item) => sum + (Number(item.totalPrice) || 0), 0);
    return Number(total).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
});

// SMART PRICING LOGIC
const applyItemPrice = (item) => {
    if(!item.baseData) return;
    const p = item.baseData;
    const q = Number(item.qty) || 1;

    const totalBottles = item.unit === 'case' ? q * p.itemsPerCase : q;
    let pricePerBottle = p.retailPrice > 0 ? p.retailPrice : (p.unitCost / p.itemsPerCase); 
    
    if (p.wholesaleTiers && p.wholesaleTiers.length > 0) {
        const sortedTiers = [...p.wholesaleTiers].sort((a, b) => b.minQty - a.minQty);
        const matchedTier = sortedTiers.find(tier => totalBottles >= tier.minQty);
        if (matchedTier && matchedTier.price) {
            pricePerBottle = Number(matchedTier.price);
        }
    }

    if (item.unit === 'case') {
        item.unitPrice = Number((pricePerBottle * p.itemsPerCase).toFixed(4));
    } else {
        item.unitPrice = Number(pricePerBottle.toFixed(4));
    }

    item.totalPrice = Number((item.unitPrice * q).toFixed(2));
};

const onItemQtyChange = (item) => applyItemPrice(item);
const onItemUnitPriceChange = (item) => {
    const q = Number(item.qty) || 0;
    item.totalPrice = Number((item.unitPrice * q).toFixed(2));
};
const onItemTotalPriceChange = (item) => {
    const q = Number(item.qty) || 0;
    if (q > 0) {
        item.unitPrice = Number((item.totalPrice / q).toFixed(4));
    }
};

const fetchSellersForForm = () => {
    formSellers.value = sellers.value.filter(s => s.createdBy === form.adminId);
};

const onAdminChange = () => {
    form.sellerId = '';
    fetchSellersForForm();
};

const getSellerDetails = (sellerId) => sellers.value.find(s => s.id === sellerId) || {};

// Filter Items 
const baseFilteredList = computed(() => {
    let result = masterData.value.map(item => {
        const seller = getSellerDetails(item.sellerId);
        return { ...item, sellerName: seller.fullName || 'Unknown', sellerIdNumber: seller.idNumber };
    });

    if (filterAdmin.value !== 'ALL') {
        result = result.filter(i => i.adminId === filterAdmin.value);
    }
    if (filterSeller.value !== 'ALL') {
        result = result.filter(i => i.sellerId === filterSeller.value);
    }
    if (filterSearch.value) {
        const s = filterSearch.value.toLowerCase();
        result = result.filter(i => 
            i.sellerName.toLowerCase().includes(s) || 
            (i.sellerIdNumber && i.sellerIdNumber.toLowerCase().includes(s)) ||
            (i.productName && i.productName.toLowerCase().includes(s))
        );
    }
    return result;
});

const statusCounts = computed(() => {
    const list = baseFilteredList.value;
    return {
        all: list.length,
        borrowed: list.filter(i => i.status === 'borrowed').length,
        sold: list.filter(i => i.status === 'sold').length,
        returned: list.filter(i => i.status === 'returned').length,
    };
});

const filteredList = computed(() => {
    if (filterStatus.value === 'ALL') return baseFilteredList.value;
    return baseFilteredList.value.filter(i => i.status === filterStatus.value);
});

// 🌟 Grouped List Logic 🌟
const groupedList = computed(() => {
    const groups = {};
    filteredList.value.forEach(item => {
        const dateKey = new Date(item.createdAt).toISOString().split('T')[0];
        const key = `${item.sellerId}_${dateKey}`;
        
        if (!groups[key]) {
            groups[key] = {
                id: key,
                sellerId: item.sellerId,
                sellerName: item.sellerName,
                sellerIdNumber: item.sellerIdNumber,
                createdAt: item.createdAt, 
                dateKey: dateKey,
                items: [],
                totalAmount: 0,
                status: 'returned'
            };
        }
        groups[key].items.push(item);
        groups[key].totalAmount += (item.totalPrice || (item.qty * (item.unitPrice || item.price)));
    });

    const resultArr = Object.values(groups);
    resultArr.forEach(group => {
        let hasBorrowed = false;
        let hasSold = false;
        group.items.forEach(i => {
            if(i.status === 'borrowed') hasBorrowed = true;
            if(i.status === 'sold') hasSold = true;
        });
        if(hasBorrowed) group.status = 'borrowed';
        else if(hasSold) group.status = 'sold';
        else group.status = 'returned';
    });

    return resultArr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
});

watch([filterAdmin, filterSeller, filterSearch, filterStatus], () => {
    currentPage.value = 1;
});

const totalPages = computed(() => Math.ceil(groupedList.value.length / itemsPerPage));
const paginatedGroupedList = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    return groupedList.value.slice(start, start + itemsPerPage);
});

const toggleGroup = (id) => {
    const index = expandedGroups.value.indexOf(id);
    if (index > -1) expandedGroups.value.splice(index, 1);
    else expandedGroups.value.push(id);
};

const openAddModal = () => {
    isEditing.value = false;
    editId.value = null;
    form.adminId = '';
    form.sellerId = '';
    form.transactionDate = new Date().toISOString().split('T')[0];
    cartItems.value = [];
    originalGroupItems.value = [];
    productSearch.value = '';
    formSellers.value = [];
    showModal.value = true;
};

// 🌟 Open Edit Group Modal 🌟
const openEditGroupModal = (group) => {
    isEditing.value = true;
    editId.value = group.id; 

    form.adminId = group.items[0].adminId;
    form.sellerId = group.sellerId;
    
    const dateObj = new Date(group.createdAt);
    form.transactionDate = dateObj.toISOString().split('T')[0];

    cartItems.value = group.items.map(item => {
        const uPrice = item.unitPrice || item.price || 0;
        const tPrice = item.totalPrice || (item.qty * uPrice) || 0;
        const baseProd = products.value.find(p => p.id === item.productId);
        
        return {
            tempId: item.id,
            docId: item.id, 
            productId: item.productId,
            productName: item.productName,
            qty: item.qty,
            oldQty: item.qty, 
            unit: item.unit || 'bottle',
            oldUnit: item.unit || 'bottle',
            unitPrice: uPrice,
            totalPrice: tPrice,
            status: item.status,
            oldStatus: item.status,
            note: item.note,
            baseData: baseProd
        };
    });

    originalGroupItems.value = JSON.parse(JSON.stringify(cartItems.value));
    
    fetchSellersForForm();
    showModal.value = true;
};

const closeModal = () => { showModal.value = false; showProductDropdown.value = false; };

// 🌟 SAVE GROUP DATA (Edit & Add) 🌟
const saveData = async () => {
    if(!form.sellerId) return notification.error("សូមជ្រើសរើសតំណាងលក់!");
    if(cartItems.value.length === 0) return notification.error("សូមជ្រើសរើសមុខទំនិញយ៉ាងហោចណាស់មួយ!");

    for(const item of cartItems.value) {
        if(!item.qty || item.qty <= 0 || item.unitPrice < 0) {
            return notification.error(`ទិន្នន័យទំនិញ "${item.productName}" មិនត្រឹមត្រូវ!`);
        }
    }

    isSaving.value = true;
    try {
        let saveDate = new Date();
        if (form.transactionDate) {
            const parts = form.transactionDate.split('-');
            saveDate.setFullYear(parts[0], parts[1] - 1, parts[2]);
        }
        const saveDateStr = saveDate.toISOString();

        if (isEditing.value) {
            // 1. Delete removed items
            const deletedItems = originalGroupItems.value.filter(orig => !cartItems.value.find(c => c.docId === orig.docId));
            const deletePromises = deletedItems.map(async (dItem) => {
                if (dItem.oldStatus !== 'returned') {
                    const p = products.value.find(x => x.id === dItem.productId);
                    const ipc = p ? p.itemsPerCase : 1;
                    const totalBottles = dItem.oldUnit === 'case' ? dItem.oldQty * ipc : dItem.oldQty;
                    if (p) {
                        const prodRef = doc(db, 'stocks', dItem.productId);
                        await updateDoc(prodRef, { quantity: increment(totalBottles) });
                    }
                }
                await deleteDoc(doc(db, 'stock_pd', dItem.docId));
            });
            await Promise.all(deletePromises);

            // 2. Update existing & Add new items
            const upsertPromises = cartItems.value.map(async (item) => {
                const p = item.baseData || products.value.find(x => x.id === item.productId);
                const itemsPerCase = p ? p.itemsPerCase : 1;
                const prodRef = doc(db, 'stocks', item.productId);

                const payload = {
                    adminId: form.adminId,
                    sellerId: form.sellerId,
                    productId: item.productId,
                    productName: item.productName,
                    qty: item.qty,
                    unit: item.unit,
                    unitPrice: item.unitPrice, 
                    totalPrice: item.totalPrice,
                    price: item.unitPrice, 
                    status: item.status,
                    note: item.note,
                    createdAt: saveDateStr, 
                    updatedAt: new Date().toISOString()
                };

                if (item.docId) {
                    const oldTotalBottles = item.oldUnit === 'case' ? item.oldQty * itemsPerCase : item.oldQty;
                    const oldDeducted = item.oldStatus !== 'returned' ? oldTotalBottles : 0;

                    const newTotalBottles = item.unit === 'case' ? item.qty * itemsPerCase : item.qty;
                    const newDeducted = item.status !== 'returned' ? newTotalBottles : 0;

                    const stockAdjustment = oldDeducted - newDeducted;
                    if (stockAdjustment !== 0 && p) {
                        await updateDoc(prodRef, { quantity: increment(stockAdjustment) });
                    }
                    await updateDoc(doc(db, 'stock_pd', item.docId), payload);
                } else {
                    const newTotalBottles = item.unit === 'case' ? item.qty * itemsPerCase : item.qty;
                    const newDeducted = item.status !== 'returned' ? newTotalBottles : 0;
                    if (newDeducted > 0 && p) {
                        await updateDoc(prodRef, { quantity: increment(-newDeducted) });
                    }
                    await addDoc(collection(db, 'stock_pd'), payload);
                }
            });
            await Promise.all(upsertPromises);
            
            notification.success("កែប្រែបញ្ជីទិន្នន័យបានជោគជ័យ!");
        } else {
            // Add New Group
            const savePromises = cartItems.value.map(async (item) => {
                const payload = {
                    adminId: form.adminId,
                    sellerId: form.sellerId,
                    productId: item.productId,
                    productName: item.productName,
                    qty: item.qty,
                    unit: item.unit,
                    unitPrice: item.unitPrice, 
                    totalPrice: item.totalPrice,
                    price: item.unitPrice, 
                    status: item.status,
                    note: item.note,
                    createdAt: saveDateStr,
                    updatedAt: saveDateStr
                };
                
                const prodRef = doc(db, 'stocks', item.productId);
                const p = item.baseData || products.value.find(x => x.id === item.productId);
                const itemsPerCase = p ? p.itemsPerCase : 1;
                
                const newTotalBottles = item.unit === 'case' ? item.qty * itemsPerCase : item.qty;
                const newDeducted = item.status !== 'returned' ? newTotalBottles : 0;

                if (newDeducted > 0 && p) {
                    await updateDoc(prodRef, { quantity: increment(-newDeducted) });
                }
                
                await addDoc(collection(db, 'stock_pd'), payload);
            });

            await Promise.all(savePromises);
            notification.success("កាត់ស្តុកឱ្យខ្ចីបានជោគជ័យ!");
        }

        closeModal();
        await fetchMasterData(); 
    } catch(e) {
        console.error(e);
        notification.error("បរាជ័យក្នុងការរក្សាទុក!");
    } finally {
        isSaving.value = false;
    }
};

// 🌟 DELETE GROUP 🌟
const promptDeleteGroup = async (group) => {
    const confirmed = await confirmDialogRef.value.open(
        "លុបបញ្ជីទាំងមូល?", 
        `តើអ្នកពិតជាចង់លុបបញ្ជីទំនិញទាំង ${group.items.length} មុខ របស់ "${group.sellerName}" មែនទេ? \n(ចំនួនទំនិញនឹងត្រូវបូកបញ្ចូលទៅក្នុងស្តុកវិញដោយស្វ័យប្រវត្តិ)`
    );
    if (confirmed) executeDeleteGroup(group);
};

const executeDeleteGroup = async (group) => {
    try {
        const deletePromises = group.items.map(async (item) => {
            if (item.status !== 'returned') {
                const p = products.value.find(x => x.id === item.productId);
                const ipc = p ? p.itemsPerCase : 1;
                const totalBottles = item.unit === 'case' ? item.qty * ipc : item.qty;
                if (p) {
                    const prodRef = doc(db, 'stocks', item.productId);
                    await updateDoc(prodRef, { quantity: increment(totalBottles) });
                }
            }
            await deleteDoc(doc(db, 'stock_pd', item.id));
        });

        await Promise.all(deletePromises);
        notification.success('លុបបញ្ជីទិន្នន័យ និងបូកស្តុកត្រឡប់វិញជោគជ័យ!');
        fetchMasterData();
    } catch(e) {
        console.error(e);
        notification.error('បរាជ័យក្នុងការលុបបញ្ជី!');
    }
};

const formatCurrency = (val) => Number(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 3 }) + "$";
const formatDate = (isoString) => isoString ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(isoString)) : '';

const getDurationDays = (dateStr) => {
    if (!dateStr) return 0;
    const past = new Date(dateStr);
    past.setHours(0,0,0,0);
    const now = new Date();
    now.setHours(0,0,0,0);
    const diffDays = Math.floor((now - past) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 ? diffDays : 0;
};

// ==========================================
// 🌟 EXPORT LOGIC (Grouped View - Polished) 🌟
// ==========================================
const getStatusLabel = (status) => {
    if(status === 'borrowed') return 'បានខ្ចី (Pending)';
    if(status === 'sold') return 'បានលក់ (Sold)';
    return 'បានសង (Returned)';
};

const getHTMLTemplate = (isExcel = false) => {
    let rowsHTML = '';
    
    groupedList.value.forEach((group, index) => {
        if(isExcel) {
            rowsHTML += `
                <tr style="background-color: #cbd5e1;">
                    <td colspan="8" style="padding: 10px; font-weight: bold; font-size: 14px;">
                        តំណាងលក់: ${group.sellerName} | កាលបរិច្ឆេទ: ${formatDate(group.createdAt)} | សរុបទំនិញ: ${group.items.length} មុខ | សរុបប្រាក់: ${formatCurrency(group.totalAmount)}
                    </td>
                </tr>
            `;
        } else {
            rowsHTML += `
                <tr style="background-color: #f8fafc; border-top: 2px solid #cbd5e1;">
                    <td colspan="8" style="padding: 12px 15px; font-weight: bold; font-size: 14px; color: #1e293b;">
                        🔹 តំណាងលក់: <span style="color:#4f46e5">${group.sellerName}</span> &nbsp;&nbsp;|&nbsp;&nbsp; 
                        📅 ថ្ងៃទី: ${formatDate(group.createdAt)} &nbsp;&nbsp;|&nbsp;&nbsp; 
                        📦 សរុបទំនិញ: ${group.items.length} មុខ &nbsp;&nbsp;|&nbsp;&nbsp; 
                        💰 សរុបទឹកប្រាក់: ${formatCurrency(group.totalAmount)}
                    </td>
                </tr>
            `;
        }

        group.items.forEach((item, iIdx) => {
            let statusColor = item.status === 'sold' ? '#059669' : item.status === 'returned' ? '#2563eb' : '#d97706';
            const uPrice = item.unitPrice || item.price || 0;
            const tPrice = item.totalPrice || (item.qty * uPrice) || 0;

            rowsHTML += `
            <tr style="background-color: #ffffff;">
                <td style="padding: 8px 10px; border: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #94a3b8;">${index + 1}.${iIdx + 1}</td>
                <td style="padding: 8px 10px; border: 1px solid #e2e8f0; font-weight: bold; color: #334155; font-size: 13px;">${item.productName}</td>
                <td style="padding: 8px 10px; border: 1px solid #e2e8f0; text-align: center; font-weight: bold; font-size: 13px;">${item.qty} ${item.unit==='case'?'កេះ':'ដប'}</td>
                <td style="padding: 8px 10px; border: 1px solid #e2e8f0; text-align: right; color: #475569; font-size: 13px;">${formatCurrency(uPrice)}</td>
                <td style="padding: 8px 10px; border: 1px solid #e2e8f0; text-align: right; font-weight: bold; color: #e11d48; font-size: 13px;">${formatCurrency(tPrice)}</td>
                <td style="padding: 8px 10px; border: 1px solid #e2e8f0; text-align: center; font-size: 12px; font-weight: bold; color: ${statusColor};">${getStatusLabel(item.status)}</td>
                <td style="padding: 8px 10px; border: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">${item.note || '-'}</td>
                <td style="padding: 8px 10px; border: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #64748b;">${getDurationDays(group.createdAt)} ថ្ងៃ</td>
            </tr>
            `;
        });
    });

    if (isExcel) {
        return `
            <html xmlns:x="urn:schemas-microsoft-com:office:excel">
            <head>
                <meta charset="utf-8">
                <style>
                    table { font-family: 'Battambong', sans-serif; border-collapse: collapse; }
                    th { background-color: #1e293b; color: white; font-weight: bold; border: 1px solid #000; padding: 10px; }
                    td { padding: 8px; border: 1px solid #000; vertical-align: middle; }
                </style>
            </head>
            <body>
                <table>
                    <tr><td colspan="8" style="font-size:18pt;font-weight:bold;text-align:center;height:40px;">របាយការណ៍ស្តុក-PD (អីវ៉ាន់ខ្ចី)</td></tr>
                    <tr><td colspan="8" style="font-size:11pt;text-align:center;">ទាញយកនៅ: ${new Date().toLocaleString('km-KH')}</td></tr>
                    <tr><td colspan="8"></td></tr>
                    <tr>
                        <th>ល.រ</th><th>មុខទំនិញលម្អិត</th><th>ចំនួន</th><th>តម្លៃឯកតា</th><th>តម្លៃសរុប</th><th>ស្ថានភាព</th><th>ចំណាំ</th><th>រយៈពេលខ្ចី</th>
                    </tr>
                    ${rowsHTML}
                </table>
            </body>
            </html>
        `;
    }

    return `
        <div id="stockpd-export-target" style="width: 1000px; padding: 40px; background-color: #ffffff; font-family: 'Battambong', sans-serif;">
            <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 25px; border-radius: 12px; color: white; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h1 style="margin:0 0 5px 0; font-size: 26px;">របាយការណ៍ស្តុក-PD លម្អិត</h1>
                    <p style="margin:0; font-size: 14px; color: #cbd5e1;">ប្រតិបត្តិការសរុប: ${groupedList.value.length} ក្រុម</p>
                </div>
                <div style="text-align: right;">
                    <p style="margin:0; font-size: 13px; color: #94a3b8;">កាលបរិច្ឆេទចេញឯកសារ:</p>
                    <p style="margin:0; font-size: 14px; font-weight:bold;">${new Date().toLocaleDateString('km-KH')} ${new Date().toLocaleTimeString('en-US')}</p>
                </div>
            </div>

            <table style="width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0;">
                <thead>
                    <tr style="background-color: #1e293b; color: white;">
                        <th style="padding: 12px; border: 1px solid #334155; font-size: 13px;">ល.រ</th>
                        <th style="padding: 12px; border: 1px solid #334155; text-align: left; font-size: 13px;">មុខទំនិញលម្អិត</th>
                        <th style="padding: 12px; border: 1px solid #334155; text-align: center; font-size: 13px;">ចំនួន</th>
                        <th style="padding: 12px; border: 1px solid #334155; text-align: right; font-size: 13px;">តម្លៃឯកតា</th>
                        <th style="padding: 12px; border: 1px solid #334155; text-align: right; font-size: 13px;">តម្លៃសរុប</th>
                        <th style="padding: 12px; border: 1px solid #334155; text-align: center; font-size: 13px;">ស្ថានភាព</th>
                        <th style="padding: 12px; border: 1px solid #334155; text-align: left; font-size: 13px;">ចំណាំ</th>
                        <th style="padding: 12px; border: 1px solid #334155; text-align: center; font-size: 13px;">រយៈពេលខ្ចី</th>
                    </tr>
                </thead>
                <tbody>${rowsHTML}</tbody>
            </table>
        </div>
    `;
};

const downloadPDF = async () => {
    isExporting.value = true;
    try {
        printStaging.value.innerHTML = getHTMLTemplate(false);
        await nextTick(); 
        await document.fonts.ready; 
        await new Promise(r => setTimeout(r, 400)); 
        
        const canvas = await html2canvas(document.getElementById('stockpd-export-target'), { scale: 2, useCORS: true });
        const pdf = new jsPDF('l', 'mm', 'a4'); 
        const pdfWidth = 297; 
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.addImage(canvas.toDataURL('image/jpeg', 1.0), 'JPEG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Stock_PD_Report_${new Date().getTime()}.pdf`);
        
        printStaging.value.innerHTML = '';
        notification.success("ទាញយក PDF បានជោគជ័យ!");
    } catch(e) { 
        console.error(e); 
        notification.error("បរាជ័យក្នុងការទាញយក PDF");
    } finally { 
        isExporting.value = false; 
    }
};

const downloadExcel = () => {
    try {
        const html = getHTMLTemplate(true);
        const blob = new Blob(['\ufeff', html], { type: 'application/vnd.ms-excel' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Stock_PD_Report_${new Date().getTime()}.xls`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch(e) { console.error(e); }
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.animate-fade-in-up { animation: fadeInUp 0.3s ease-out forwards; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in { animation: fadeIn 0.2s ease-out; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.inset-shadow { box-shadow: inset 0px 4px 6px -4px rgba(0, 0, 0, 0.1); }
</style>