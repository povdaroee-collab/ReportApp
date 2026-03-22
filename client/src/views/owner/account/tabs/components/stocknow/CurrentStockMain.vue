<template>
    <div class="space-y-6 font-khmer pb-20 relative">
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div class="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200 flex items-center gap-5 transition-transform hover:-translate-y-1">
                <div class="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-[1.25rem] flex items-center justify-center shrink-0 border border-indigo-100 shadow-inner">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                </div>
                <div>
                    <p class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">សរុបមុខទំនិញ</p>
                    <h3 class="text-3xl font-black text-slate-800">{{ summary.totalItems }} <span class="text-sm font-bold text-slate-500">មុខ</span></h3>
                </div>
            </div>

            <div class="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200 flex items-center gap-5 transition-transform hover:-translate-y-1">
                <div class="w-16 h-16 bg-rose-50 text-rose-500 rounded-[1.25rem] flex items-center justify-center shrink-0 border border-rose-100 shadow-inner">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                </div>
                <div>
                    <p class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">ដើមទុនស្តុកសរុប (CAPITAL)</p>
                    <h3 class="text-3xl font-black text-rose-500">{{ formatCurrency(summary.totalCapital) }}</h3>
                </div>
            </div>

            <div class="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200 flex items-center gap-5 transition-transform hover:-translate-y-1">
                <div class="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-[1.25rem] flex items-center justify-center shrink-0 border border-emerald-100 shadow-inner">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div>
                    <p class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">តម្លៃលក់សរុប (EST. REVENUE)</p>
                    <h3 class="text-3xl font-black text-emerald-500">{{ formatCurrency(summary.totalEstRevenue) }}</h3>
                </div>
            </div>
        </div>

        <div class="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            
            <div class="p-4 md:p-5 border-b border-slate-200 flex flex-col lg:flex-row justify-between items-center gap-4 bg-slate-50/50">
                <h3 class="text-lg font-black text-slate-800 flex items-center gap-2 whitespace-nowrap hidden xl:flex">
                    <svg class="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
                    បញ្ជីទំនិញក្នុងស្តុក
                </h3>
                
                <div class="flex flex-wrap items-center justify-end gap-3 w-full xl:w-auto">
                    
                    <div class="relative w-full sm:w-64 shrink-0">
                        <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></span>
                        <input v-model="searchQuery" type="text" placeholder="ស្វែងរកឈ្មោះ ឬ Barcode..." class="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm">
                    </div>

                    <button @click="showLowStockOnly = !showLowStockOnly" :class="showLowStockOnly ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30 border-rose-500' : 'bg-white text-slate-600 hover:text-rose-600 border-slate-200 hover:bg-rose-50 hover:border-rose-200'" class="px-4 py-2.5 rounded-xl text-sm font-black transition-all border flex items-center gap-2">
                        <svg class="w-4 h-4" :class="showLowStockOnly ? 'animate-pulse' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                        ជិតអស់ស្តុក (≤40)
                    </button>

                    <button @click="downloadExcel" :disabled="isExporting || filteredStocks.length === 0" class="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white border border-emerald-200 hover:border-emerald-500 rounded-xl text-sm font-black transition-all flex items-center gap-2 disabled:opacity-50">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        Excel
                    </button>

                    <button @click="downloadPDF" :disabled="isExporting || filteredStocks.length === 0" class="px-4 py-2.5 bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-white border border-rose-200 hover:border-rose-500 rounded-xl text-sm font-black transition-all flex items-center gap-2 disabled:opacity-50">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        PDF
                    </button>
                </div>
            </div>

            <div class="overflow-x-auto custom-scrollbar relative min-h-[400px]">
                <div v-if="isLoading" class="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                    <div class="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-indigo-600 mb-4"></div>
                    <p class="text-sm font-bold text-slate-500">កំពុងទាញទិន្នន័យស្តុក...</p>
                </div>

                <table class="w-full text-left border-collapse min-w-[1000px]">
                    <thead class="bg-slate-100 text-slate-500 text-[11px] uppercase font-black tracking-widest border-b border-slate-200 sticky top-0 z-20">
                        <tr>
                            <th class="px-6 py-4 w-12 text-center">#</th>
                            <th class="px-6 py-4">ព័ត៌មានទំនិញ</th>
                            <th class="px-6 py-4 text-center">ក្នុង១កេះ</th>
                            <th class="px-6 py-4 text-center">ស្តុកនៅសល់</th>
                            <th class="px-6 py-4 text-right text-rose-600">ដើមទុនសរុប (Cost)</th>
                            <th class="px-6 py-4 text-right text-emerald-600">តម្លៃលក់សរុប (Rev)</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 text-sm">
                        <tr v-if="paginatedStocks.length === 0 && !isLoading">
                            <td colspan="6" class="py-20 text-center text-slate-400 font-bold">
                                <svg class="w-16 h-16 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                                មិនមានទិន្នន័យទំនិញទេ
                            </td>
                        </tr>
                        <tr v-for="(item, index) in paginatedStocks" :key="item.id" class="hover:bg-slate-50/80 transition-colors" :class="item.isLowStock ? 'bg-rose-50/20' : ''">
                            <td class="px-6 py-5 text-center text-sm font-bold text-slate-400">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                            <td class="px-6 py-5">
                                <p class="font-black text-slate-800 leading-tight flex items-center gap-2">
                                    {{ item.name || item.productName }}
                                    <span v-if="item.isLowStock" class="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                                </p>
                                <p class="text-[10px] font-bold text-slate-400 mt-1 font-mono tracking-wider">{{ item.barcode || 'NO-BARCODE' }}</p>
                            </td>
                            <td class="px-6 py-5 text-center font-black text-slate-600">
                                {{ item.packingText }}
                            </td>
                            <td class="px-6 py-5 text-center">
                                <span class="px-3.5 py-1.5 rounded-lg text-sm font-black border shadow-sm inline-flex min-w-[100px] justify-center items-center gap-1.5"
                                      :class="item.isLowStock ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-indigo-50 text-indigo-700 border-indigo-100'">
                                    <svg v-if="item.isLowStock" class="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                    {{ item.retailQty > 0 ? item.stockText : 'អស់ស្តុក' }}
                                </span>
                            </td>
                            <td class="px-6 py-5 text-right font-black text-rose-600 bg-rose-50/30">
                                {{ formatCurrency(item.totalCapital) }}
                            </td>
                            <td class="px-6 py-5 text-right font-black text-emerald-600 bg-emerald-50/30">
                                {{ formatCurrency(item.totalEstRevenue) }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div v-if="totalPages > 1" class="p-4 md:p-5 bg-slate-50 border-t border-slate-200 flex justify-between items-center shrink-0">
                <p class="text-xs font-bold text-slate-500">ទំព័រ <span class="text-indigo-600 font-black">{{ currentPage }}</span> នៃ {{ totalPages }} <span class="hidden sm:inline">| សរុប {{ filteredStocks.length }} មុខ</span></p>
                <div class="flex gap-2">
                    <button @click="currentPage--" :disabled="currentPage === 1" class="flex items-center gap-1 px-4 py-2 bg-white rounded-xl border border-slate-200 text-sm font-black text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-sm">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"></path></svg> ថយក្រោយ
                    </button>
                    <button @click="currentPage++" :disabled="currentPage === totalPages" class="flex items-center gap-1 px-4 py-2 bg-white rounded-xl border border-slate-200 text-sm font-black text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-sm">
                        បន្ទាប់ <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"></path></svg>
                    </button>
                </div>
            </div>
        </div>

        <div ref="printStaging" class="fixed top-0 left-[-9999px] pointer-events-none z-[-1] opacity-0"></div>

    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { db } from '@/firebaseConfig';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useNotificationStore } from '@/stores/notification';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const notification = useNotificationStore();
const stocks = ref([]);
const isLoading = ref(true);
const searchQuery = ref('');
const showLowStockOnly = ref(false);
const isExporting = ref(false);
const printStaging = ref(null);

// Pagination States
const currentPage = ref(1);
const itemsPerPage = 20;

let unsubscribe = null;

onMounted(() => {
    const q = query(collection(db, 'stocks'), where('isDeleted', '!=', true));
    unsubscribe = onSnapshot(q, (snap) => {
        stocks.value = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        isLoading.value = false;
    }, (error) => {
        console.error("Error fetching stocks:", error);
        isLoading.value = false;
    });
});

onUnmounted(() => {
    if(unsubscribe) unsubscribe();
});

const formatCurrency = (val) => Number(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " $";
const translateUnit = (u) => { const m = { bottle: 'ដប', case: 'កេះ', pack: 'កញ្ចប់', can: 'កំប៉ុង', kg: 'គីឡូ', set: 'ឈុត' }; return m[u] || u; };

// រៀបចំទិន្នន័យ និងកំណត់ទំនិញជិតអស់ស្តុក (<= 40 កេះ)
const processedStocks = computed(() => {
    return stocks.value.map(item => {
        const category = item.category || '';
        const qtyBase = Number(item.quantity) || 0;
        const ipc = Number(item.itemsPerCase) || 1;
        
        const costPerBase = Number(item.unitCost) || 0;
        const totalCapital = qtyBase * costPerBase;
        const pricePerRetail = Number(item.retailPrice || item.price) || 0;
        
        let retailQty = 0;
        let cases = 0;
        let remainder = 0;
        let boxes = 0;
        let sheets = 0;
        let stockText = '';
        let packingText = ''; // សម្រាប់បង្ហាញក្នុងជួរឈរ "ក្នុង១កេះ"

        // 🌟 1. LOGIC គណនាស្តុកសម្រាប់ម៉ាស់ (3-Levels)
        if (category === 'ម៉ាស់') {
            const ipb = Number(item.itemsPerBox) || 1;
            const totalSheets = Math.floor(qtyBase * ipc * ipb);
            retailQty = totalSheets;
            
            cases = Math.floor(totalSheets / (ipc * ipb));
            const remainingAfterCases = totalSheets % (ipc * ipb);
            boxes = Math.floor(remainingAfterCases / ipb);
            sheets = remainingAfterCases % ipb;

            if (cases > 0) stockText += `${cases.toLocaleString()} កេះ `;
            if (boxes > 0) stockText += `${boxes.toLocaleString()} ប្រអប់ `;
            if (sheets > 0) stockText += `${sheets.toLocaleString()} សន្លឹក`;
            if (cases === 0 && boxes === 0 && sheets === 0) stockText = '0';
            
            packingText = `${ipc} ប្រអប់`; // ឧ. ១កេះ មាន ៥០ប្រអប់
        } 
        // 🌟 2. LOGIC គណនាស្តុកសម្រាប់ខោអាវ និងផ្សេងៗ (1-2 Levels)
        else {
            retailQty = Math.floor(qtyBase * ipc);
            cases = Math.floor(retailQty / ipc);
            remainder = retailQty % ipc;
            
            if (ipc > 1) {
                if (cases > 0) stockText += `${cases.toLocaleString()} ${translateUnit(item.unit || 'case')} `;
                if (remainder > 0) stockText += `${remainder.toLocaleString()} ${translateUnit(item.retailUnit || 'bottle')}`;
                if (cases === 0 && remainder === 0) stockText = '0';
            } else {
                stockText = `${retailQty.toLocaleString()} ${translateUnit(item.retailUnit || item.unit || 'bottle')}`;
            }
            
            packingText = `${ipc} ${translateUnit(item.retailUnit || 'bottle')}`;
        }

        const totalEstRevenue = retailQty * pricePerRetail;
        const isLowStock = retailQty <= 0 || cases <= 40;

        // 🌟 3. LOGIC បង្ហាញពណ៌ និង ទំហំ
        let displayName = item.name;
        if ((category === 'អាវ' || category === 'ខោ' || category === 'ស្បែកជើង' || category === 'ការបូប') && item.colors && item.colors.length > 0) {
             displayName += ` (ពណ៌: ${item.colors.join(', ')})`;
             if (item.sizes && item.sizes.length > 0) {
                 displayName += ` (ទំហំ: ${item.sizes.join(', ')})`;
             }
        }

        return { 
            ...item, 
            name: displayName, // Overwrite name ដើម ដើម្បីឱ្យ Excel/PDF ស្គាល់ឈ្មោះថ្មីស្វ័យប្រវត្តិ
            retailQty, 
            cases, 
            isLowStock, 
            totalCapital, 
            totalEstRevenue, 
            stockText: stockText.trim() || '0',
            packingText
        };
    }).sort((a, b) => {
        // រុញអ្នកជិតអស់ស្តុកមកលើគេបង្អស់ បន្ទាប់មកទើបតម្រៀបតាមទុន
        if (a.isLowStock && !b.isLowStock) return -1;
        if (!a.isLowStock && b.isLowStock) return 1;
        return b.totalCapital - a.totalCapital; 
    });
});

// ច្រោះទិន្នន័យតាម Search និង Filter ប៊ូតុង
const filteredStocks = computed(() => {
    let result = processedStocks.value;
    
    if (showLowStockOnly.value) {
        result = result.filter(s => s.isLowStock);
    }
    
    if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase();
        result = result.filter(s => (s.name || s.productName || '').toLowerCase().includes(q) || (s.barcode || '').toLowerCase().includes(q));
    }
    
    return result;
});

// Reset page ពេលមានការផ្លាស់ប្តូរ Filter
watch([searchQuery, showLowStockOnly], () => { currentPage.value = 1; });

// គណនា Pagination
const totalPages = computed(() => Math.ceil(filteredStocks.value.length / itemsPerPage) || 1);
const paginatedStocks = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    return filteredStocks.value.slice(start, start + itemsPerPage);
});

// សរុប
const summary = computed(() => {
    let totalCapital = 0, totalEstRevenue = 0;
    filteredStocks.value.forEach(s => { totalCapital += s.totalCapital; totalEstRevenue += s.totalEstRevenue; });
    return { totalItems: filteredStocks.value.length, totalCapital, totalEstRevenue };
});

// ==========================================
// 🌟 EXPORT EXCEL & PDF LOGIC (FIXED) 🌟
// ==========================================

const getExportHTML = (isExcel = false) => {
    let rowsHTML = filteredStocks.value.map((item, index) => {
        const isLow = item.isLowStock;
        const lowStockStyle = isLow ? 'color: #dc2626; font-weight: bold; background-color: #fef2f2;' : 'color: #334155;';
        const rowBg = index % 2 === 0 ? '#ffffff' : '#f8fafc';
        const packingDisplay = item.packingText || `${item.itemsPerCase || 1} ${translateUnit(item.retailUnit || 'bottle')}`;

        return `
        <tr style="background-color: ${rowBg}; border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 12px 8px; text-align: center; font-size: 13px; color: #64748b; border-right: 1px solid #e2e8f0;">${index + 1}</td>
            <td style="padding: 12px 10px; font-size: 14px; font-weight: bold; color: #1e293b; line-height: 1.5; border-right: 1px solid #e2e8f0;">
                ${item.name || item.productName} <br>
                <span style="font-size: 11px; color: #94a3b8; font-family: monospace;">${item.barcode || 'N/A'}</span>
            </td>
            <td style="padding: 12px 8px; text-align: center; font-size: 13px; color: #475569; border-right: 1px solid #e2e8f0;">${packingDisplay}</td>
            <td style="padding: 12px 8px; text-align: center; font-size: 14px; font-weight: bold; border-right: 1px solid #e2e8f0; ${lowStockStyle}">
                ${item.retailQty > 0 ? item.stockText : 'អស់ស្តុក'}
            </td>
            <td style="padding: 12px 10px; text-align: right; color: #e11d48; font-size: 14px; font-weight: bold; border-right: 1px solid #e2e8f0;">${formatCurrency(item.totalCapital)}</td>
            <td style="padding: 12px 10px; text-align: right; color: #059669; font-size: 14px; font-weight: bold;">${formatCurrency(item.totalEstRevenue)}</td>
        </tr>
    `}).join('');

    if (isExcel) {
        return `
            <html xmlns:x="urn:schemas-microsoft-com:office:excel">
            <head>
                <meta charset="utf-8">
                <style>
                    table { font-family: 'Battambang', sans-serif; border-collapse: collapse; }
                    th { background-color: #1e293b; color: #ffffff; font-weight: bold; border: 1px solid #0f172a; padding: 12px; text-transform: uppercase; }
                    td { padding: 8px; border: 1px solid #cbd5e1; vertical-align: middle; }
                    .footer-row td { background-color: #f1f5f9; font-weight: bold; font-size: 14px; padding: 15px; border: 1px solid #94a3b8; }
                </style>
            </head>
            <body>
                <table>
                    <tr><td colspan="6" style="background-color: #4f46e5; color: white; font-size: 20pt; font-weight: bold; text-align: center; height: 60px; vertical-align: middle;">របាយការណ៍ស្តុកទំនិញបច្ចុប្បន្ន</td></tr>
                    <tr><td colspan="6" style="font-size: 11pt; text-align: center; font-style: italic; background-color: #e0e7ff; height: 30px; vertical-align: middle;">ទាញយកនៅថ្ងៃទី: ${new Date().toLocaleString('km-KH')}</td></tr>
                    <tr><td colspan="6"></td></tr>
                    <tr>
                        <th style="width: 50px;">ល.រ</th><th style="width: 350px;">ព័ត៌មានទំនិញ</th><th style="width: 100px;">ក្នុង១កេះ</th><th style="width: 150px;">ស្តុកនៅសល់</th><th style="width: 150px;">ដើមទុនសរុប (USD)</th><th style="width: 150px;">តម្លៃលក់សរុប (USD)</th>
                    </tr>
                    ${rowsHTML}
                    <tr class="footer-row">
                        <td colspan="3" style="text-align: right;">សរុបរួមទាំងអស់ (GRAND TOTAL):</td>
                        <td style="text-align: center; color: #4f46e5;">${summary.value.totalItems} មុខ</td>
                        <td style="text-align: right; color: #e11d48;">${formatCurrency(summary.value.totalCapital)}</td>
                        <td style="text-align: right; color: #059669;">${formatCurrency(summary.value.totalEstRevenue)}</td>
                    </tr>
                </table>
            </body>
            </html>
        `;
    }

    return `
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Battambang:wght@400;700;900&display=swap');
            
            .pdf-container { width: 1000px; padding: 40px; background-color: #ffffff; font-family: 'Battambang', sans-serif; margin: 0 auto; box-sizing: border-box; }
            
            .header-box { background: #1e293b; padding: 25px 35px; border-radius: 12px 12px 0 0; color: white; display: flex; justify-content: space-between; align-items: center; border-bottom: 4px solid #4f46e5; }
            .header-title { margin: 0; font-size: 26px; font-weight: bold; color: #ffffff; line-height: 1.5; }
            .stats-badge { display: inline-block; background: rgba(255,255,255,0.1); padding: 6px 16px; border-radius: 20px; font-size: 14px; margin-top: 10px; border: 1px solid rgba(255,255,255,0.2); }
            
            .stock-table { width: 100%; border-collapse: collapse; border: 1px solid #cbd5e1; border-top: none; }
            .stock-table th { background-color: #f8fafc; color: #334155; font-weight: bold; font-size: 14px; text-transform: uppercase; padding: 14px 10px; border-bottom: 2px solid #cbd5e1; border-right: 1px solid #e2e8f0; }
            .stock-table th:last-child { border-right: none; }
            
            .summary-row td { background-color: #f1f5f9; padding: 18px 10px; font-size: 15px; border-top: 2px solid #94a3b8; }
            
            .footer-note { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px dashed #cbd5e1; font-size: 13px; color: #64748b; font-weight: bold; }
        </style>
        
        <div class="pdf-container" id="stocknow-export-target">
            <div class="header-box">
                <div>
                    <h1 class="header-title">របាយការណ៍ស្តុកបច្ចុប្បន្ន</h1>
                    <div class="stats-badge">មុខទំនិញសរុប: <b>${summary.value.totalItems}</b> មុខ</div>
                </div>
                <div style="text-align: right;">
                    <p style="margin: 0; font-size: 13px; color: #94a3b8; text-transform: uppercase;">កាលបរិច្ឆេទទាញយក</p>
                    <p style="margin: 5px 0 0 0; font-size: 16px; font-weight: bold; color: #f8fafc;">${new Date().toLocaleDateString('km-KH')}</p>
                    <p style="margin: 0; font-size: 13px; color: #cbd5e1;">${new Date().toLocaleTimeString('en-US')}</p>
                </div>
            </div>

            <table class="stock-table">
                <thead>
                    <tr>
                        <th style="width: 5%; text-align: center;">ល.រ</th>
                        <th style="width: 35%; text-align: left;">ព័ត៌មានទំនិញ</th>
                        <th style="width: 12%; text-align: center;">ក្នុង១កេះ</th>
                        <th style="width: 18%; text-align: center;">ស្តុកនៅសល់</th>
                        <th style="width: 15%; text-align: right;">ដើមទុនសរុប</th>
                        <th style="width: 15%; text-align: right;">តម្លៃលក់សរុប</th>
                    </tr>
                </thead>
                <tbody>
                    ${rowsHTML}
                </tbody>
                <tfoot>
                    <tr class="summary-row">
                        <td colspan="4" style="text-align: right; font-weight: bold; color: #1e293b;">សរុបរួម (GRAND TOTAL):</td>
                        <td style="text-align: right; font-weight: bold; color: #e11d48; font-size: 18px;">${formatCurrency(summary.value.totalCapital)}</td>
                        <td style="text-align: right; font-weight: bold; color: #059669; font-size: 18px;">${formatCurrency(summary.value.totalEstRevenue)}</td>
                    </tr>
                </tfoot>
            </table>

            <div class="footer-note">
                របាយការណ៍នេះត្រូវបានបង្កើតដោយប្រព័ន្ធស្វ័យប្រវត្តិ • ថ្ងៃទី ${new Date().toLocaleDateString('en-GB')} ម៉ោង ${new Date().toLocaleTimeString()}
            </div>
        </div>
    `;
};

const downloadPDF = async () => {
    isExporting.value = true;
    try {
        printStaging.value.innerHTML = getExportHTML(false);
        await nextTick(); 
        await document.fonts.ready; 
        await new Promise(r => setTimeout(r, 600)); 
        
        const targetElement = document.getElementById('stocknow-export-target');
        if (!targetElement) throw new Error("រកមិនឃើញកន្លែងត្រូវ Print");

        const canvas = await html2canvas(targetElement, { 
            scale: 2, 
            useCORS: true, 
            logging: false,
            backgroundColor: "#ffffff" 
        });
        
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const pdf = new jsPDF('p', 'mm', 'a4'); // A4 Portrait
        
        const pdfWidth = 210; 
        const pdfHeight = 297; 
        const margin = 10; // គម្លាតសងខាង និង លើក្រោម (10mm)
        const printWidth = pdfWidth - (margin * 2); 
        const printHeight = pdfHeight - (margin * 2); 
        
        const imgHeight = (canvas.height * printWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = margin; // រុញចុះ 10mm សម្រាប់ទំព័រទី១
        
        // 🌟 ទំព័រទី ១
        pdf.addImage(imgData, 'JPEG', margin, position, printWidth, imgHeight);
        heightLeft -= printHeight;
        
        // គូសប្រអប់ពណ៌សបាំង Footer Margin ទំព័រទី១ កុំឱ្យលៀនរូប
        pdf.setFillColor(255, 255, 255);
        pdf.rect(0, pdfHeight - margin, pdfWidth, margin, 'F');
        
        // 🌟 បង្កើតទំព័របន្តបន្ទាប់
        while (heightLeft > 0) {
            position = position - printHeight; 
            pdf.addPage();
            
            pdf.addImage(imgData, 'JPEG', margin, position, printWidth, imgHeight);
            
            // គូសប្រអប់ពណ៌សបាំង Header & Footer Margin គ្រប់ទំព័រថ្មី
            pdf.setFillColor(255, 255, 255);
            pdf.rect(0, 0, pdfWidth, margin, 'F'); 
            pdf.rect(0, pdfHeight - margin, pdfWidth, margin, 'F'); 
            
            heightLeft -= printHeight;
        }

        pdf.save(`Current_Stock_Report_${new Date().getTime()}.pdf`);
        
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
        const html = getExportHTML(true);
        const blob = new Blob(['\ufeff', html], { type: 'application/vnd.ms-excel' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Current_Stock_Report_${new Date().getTime()}.xls`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch(e) { console.error(e); }
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #94a3b8; }
</style>