<template>
    <div class="space-y-6 font-khmer pb-20 relative animate-fade-in">
        
        <div class="bg-gradient-to-r from-purple-700 to-indigo-700 rounded-[2rem] p-6 md:p-8 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div class="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            
            <div class="flex items-center gap-5 relative z-10 text-white w-full md:w-auto">
                <div class="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shrink-0">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"></path></svg>
                </div>
                <div>
                    <h3 class="text-2xl font-black mb-1">បញ្ជីស្នើសុំទំនិញចូលស្តុក</h3>
                    <p class="text-sm font-bold text-purple-200">ទាញយកតែទំនិញជិតអស់ពីស្តុកស្វ័យប្រវត្តិ (≤ 40កេះ)</p>
                </div>
            </div>

            <div class="flex items-center gap-3 relative z-10 w-full md:w-auto bg-black/20 p-2 rounded-2xl backdrop-blur-sm border border-white/10">
                <button @click="downloadExcel" :disabled="isExporting || requestedItems.length === 0" class="flex-1 md:flex-none px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg> Excel
                </button>
                <button @click="downloadPDF" :disabled="isExporting || requestedItems.length === 0" class="flex-1 md:flex-none px-5 py-2.5 bg-rose-500 hover:bg-rose-400 text-white rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg> PDF
                </button>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex items-center gap-4">
                <div class="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center border border-purple-100">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                </div>
                <div>
                    <p class="text-xs font-bold text-slate-500 uppercase">ទំនិញត្រូវកម្ម៉ង់សរុប</p>
                    <h3 class="text-2xl font-black text-slate-800">{{ requestedItems.length }} <span class="text-sm font-bold">មុខ</span></h3>
                </div>
            </div>
            <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex items-center gap-4">
                <div class="w-12 h-12 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center border border-rose-100">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                </div>
                <div>
                    <p class="text-xs font-bold text-slate-500 uppercase">ទឹកប្រាក់ប៉ាន់ស្មានទិញចូល (Est. Cost)</p>
                    <h3 class="text-2xl font-black text-rose-600">{{ formatCurrency(totalEstimatedCost) }}</h3>
                </div>
            </div>
        </div>

        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[400px] relative">
            <div v-if="isLoading" class="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                <div class="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-purple-600 mb-3"></div>
                <p class="text-sm font-bold text-slate-500">កំពុងស្វែងរកទំនិញជិតអស់ស្តុក...</p>
            </div>

            <div class="overflow-x-auto custom-scrollbar">
                <table class="w-full text-left border-collapse min-w-[900px]">
                    <thead class="bg-slate-50 text-slate-500 text-[11px] uppercase font-black tracking-widest border-b border-slate-200 sticky top-0 z-20">
                        <tr>
                            <th class="px-5 py-4 w-12 text-center">
                                <input type="checkbox" :checked="isAllSelected" @change="toggleSelectAll" class="w-4 h-4 accent-purple-600 cursor-pointer">
                            </th>
                            <th class="px-5 py-4">ព័ត៌មានទំនិញ</th>
                            <th class="px-5 py-4 text-center">ស្តុកនៅសល់</th>
                            <th class="px-5 py-4 text-center w-40 text-purple-600">បរិមាណស្នើសុំ (កេះ)</th>
                            <th class="px-5 py-4 text-right">តម្លៃដើម១កេះ</th>
                            <th class="px-5 py-4 text-right text-rose-600">សរុបប្រាក់</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 text-sm">
                        <tr v-if="lowStockItems.length === 0 && !isLoading">
                            <td colspan="6" class="py-20 text-center text-slate-400 font-bold">
                                <svg class="w-16 h-16 mx-auto mb-3 opacity-30 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                មិនមានទំនិញជិតអស់ស្តុកទេ គ្រប់យ៉ាងល្អប្រសើរ!
                            </td>
                        </tr>
                        <tr v-for="(item, index) in lowStockItems" :key="item.id" class="hover:bg-slate-50 transition-colors" :class="item.selected ? 'bg-purple-50/20' : 'opacity-50 grayscale-[50%]'">
                            <td class="px-5 py-4 text-center">
                                <input type="checkbox" v-model="item.selected" class="w-4 h-4 accent-purple-600 cursor-pointer">
                            </td>
                            <td class="px-5 py-4 cursor-pointer" @click="item.selected = !item.selected">
                                <p class="font-black text-slate-800">{{ item.name || item.productName }}</p>
                                <p class="text-[10px] font-bold text-slate-400 mt-1 font-mono tracking-wider">{{ item.barcode || 'NO-BARCODE' }} | 1កេះ = {{ item.itemsPerCase || 1 }} {{ translateUnit(item.retailUnit) }}</p>
                            </td>
                            <td class="px-5 py-4 text-center">
                                <span class="px-3 py-1 rounded-lg text-xs font-black border shadow-sm inline-flex bg-rose-50 text-rose-600 border-rose-200">
                                    {{ item.retailQty > 0 ? item.stockText : 'អស់រលីង' }}
                                </span>
                            </td>
                            <td class="px-5 py-4 text-center">
                                <input v-model.number="item.requestCases" :disabled="!item.selected" type="number" min="0" class="w-24 text-center bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-black focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all disabled:bg-slate-100 disabled:text-slate-400">
                            </td>
                            <td class="px-5 py-4 text-right font-black text-slate-600">
                                {{ formatCurrency(item.caseCost) }}
                            </td>
                            <td class="px-5 py-4 text-right font-black text-rose-600 bg-rose-50/30">
                                {{ formatCurrency(item.selected ? (item.requestCases * item.caseCost) : 0) }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { db } from '@/firebaseConfig';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useNotificationStore } from '@/stores/notification';

const notification = useNotificationStore();
const isLoading = ref(true);
const lowStockItems = ref([]);
const isExporting = ref(false);
let unsubscribe = null;

// Functions
const formatCurrency = (val) => Number(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " $";
const translateUnit = (u) => { const m = { bottle: 'ដប', case: 'កេះ', pack: 'កញ្ចប់', can: 'កំប៉ុង', kg: 'គីឡូ', set: 'ឈុត' }; return m[u] || u; };

onMounted(() => {
    const q = query(collection(db, 'stocks'), where('isDeleted', '!=', true));
    unsubscribe = onSnapshot(q, (snap) => {
        let allLow = [];
        
        snap.docs.forEach(doc => {
            const data = doc.data();
            const qtyBase = Number(data.quantity) || 0;
            const ipc = Number(data.itemsPerCase) || 1;
            const retailQty = Math.floor(qtyBase * ipc);
            const cases = Math.floor(retailQty / ipc);
            
            // 🌟 លក្ខខណ្ឌជិតអស់ស្តុក (<= 40 កេះ) 🌟
            if (cases <= 40 || retailQty <= 0) {
                const remainder = retailQty % ipc;
                let stockText = '';
                if (ipc > 1) {
                    if (cases > 0) stockText += `${cases.toLocaleString()} ${translateUnit(data.unit || 'case')} `;
                    if (remainder > 0) stockText += `${remainder.toLocaleString()} ${translateUnit(data.retailUnit || 'bottle')}`;
                    if (cases === 0 && remainder === 0) stockText = '0';
                } else {
                    stockText = `${retailQty.toLocaleString()} ${translateUnit(data.retailUnit || data.unit || 'bottle')}`;
                }

                allLow.push({
                    id: doc.id,
                    ...data,
                    retailQty,
                    stockText: stockText.trim(),
                    caseCost: (Number(data.unitCost) || 0) * ipc,
                    selected: true,
                    requestCases: 0
                });
            }
        });

        // តម្រៀបអ្នកដែលអស់រលីង ឬតិចបំផុតឱ្យនៅខាងលើ
        lowStockItems.value = allLow.sort((a, b) => a.retailQty - b.retailQty);
        isLoading.value = false;
    });
});

onUnmounted(() => {
    if(unsubscribe) unsubscribe();
});

// Select All Logic
const isAllSelected = computed(() => {
    if (lowStockItems.value.length === 0) return false;
    return lowStockItems.value.every(i => i.selected);
});

const toggleSelectAll = (e) => {
    const checked = e.target.checked;
    lowStockItems.value.forEach(i => i.selected = checked);
};

// Summary Computations
const requestedItems = computed(() => {
    return lowStockItems.value.filter(i => i.selected && i.requestCases > 0);
});

const totalEstimatedCost = computed(() => {
    return requestedItems.value.reduce((sum, item) => sum + (item.requestCases * item.caseCost), 0);
});

// ==========================================
// 🌟 EXPORT HTML GENERATOR 🌟
// ==========================================
const getExportHTML = (isExcel = false) => {
    if (isExcel) {
        let excelRowsHTML = requestedItems.value.map((item, index) => {
            return `
            <tr>
                <td style="padding: 10px; border: 1px solid #000; text-align: center;">${index + 1}</td>
                <td style="padding: 10px; border: 1px solid #000;">${item.name || item.productName} <br><span style="font-size:11px; color:#64748b;">${item.barcode || 'N/A'}</span></td>
                <td style="padding: 10px; border: 1px solid #000; text-align: center;">${item.retailQty > 0 ? item.stockText : 'អស់ស្តុក'}</td>
                <td style="padding: 10px; border: 1px solid #000; text-align: center;">${item.requestCases} កេះ</td>
                <td style="padding: 10px; border: 1px solid #000; text-align: right;">${formatCurrency(item.caseCost)}</td>
                <td style="padding: 10px; border: 1px solid #000; text-align: right;">${formatCurrency(item.requestCases * item.caseCost)}</td>
            </tr>
            `;
        }).join('');

        return `
            <html xmlns:x="urn:schemas-microsoft-com:office:excel">
            <head>
                <meta charset="utf-8">
                <style>
                    table { font-family: 'Battambang', sans-serif; border-collapse: collapse; }
                    th { background-color: #4f46e5; color: #ffffff; font-weight: bold; border: 1px solid #000; padding: 12px; }
                    td { border: 1px solid #000; vertical-align: middle; }
                </style>
            </head>
            <body>
                <table>
                    <tr><td colspan="6" style="font-size:18pt; font-weight:bold; text-align:center; height:50px;">ឯកសារស្នើសុំទិញទំនិញចូលស្តុក (Purchase Request)</td></tr>
                    <tr><td colspan="6" style="font-size:11pt; text-align:center;">កាលបរិច្ឆេទ: ${new Date().toLocaleDateString('en-US')}</td></tr>
                    <tr><td colspan="6"></td></tr>
                    <tr>
                        <th style="width:50px;">ល.រ</th><th style="width:300px;">ឈ្មោះទំនិញ</th><th style="width:150px;">ស្តុកសល់ជាក់ស្តែង</th><th style="width:150px;">ចំនួនស្នើសុំ (កេះ)</th><th style="width:150px;">តម្លៃប៉ាន់ស្មាន១កេះ</th><th style="width:150px;">សរុបប៉ាន់ស្មាន</th>
                    </tr>
                    ${excelRowsHTML}
                    <tr>
                        <td colspan="5" style="text-align:right; font-weight:bold; background-color:#f1f5f9;">សរុបទឹកប្រាក់ត្រូវចំណាយប៉ាន់ស្មាន (Est. Total Cost):</td>
                        <td style="text-align:right; font-weight:bold; color:red; background-color:#f1f5f9;">${formatCurrency(totalEstimatedCost.value)}</td>
                    </tr>
                </table>
            </body>
            </html>
        `;
    }

    let pdfRowsHTML = requestedItems.value.map((item, index) => {
        return `
        <tr>
            <td style="text-align: center;">${index + 1}</td>
            <td>
                <strong>${item.name || item.productName}</strong>
                <span style="display: block; font-size: 12px; color: #64748b; margin-top: 4px; font-family: Arial, sans-serif;">${item.barcode || 'N/A'}</span>
            </td>
            <td style="text-align: center; color: #dc2626; font-weight: bold;">${item.retailQty > 0 ? item.stockText : 'អស់ស្តុក'}</td>
            <td style="text-align: center; color: #2563eb; font-weight: bold;">${item.requestCases} កេះ</td>
            <td style="text-align: right;">${formatCurrency(item.caseCost)}</td>
            <td style="text-align: right; color: #dc2626; font-weight: bold;">${formatCurrency(item.requestCases * item.caseCost)}</td>
        </tr>
        `;
    }).join('');

    return `
        <style>
            #restock-export-target { width: 100%; margin: 0 auto; box-sizing: border-box; font-family: 'Battambang', sans-serif; color: #333; }
            .pdf-header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #cbd5e1; padding-bottom: 20px; }
            .pdf-header h1 { font-family: 'Moul', cursive; font-size: 24px; color: #1e293b; margin: 0 0 10px 0; letter-spacing: 1px; }
            .pdf-header h2 { font-size: 14px; color: #64748b; margin: 0; text-transform: uppercase; font-family: Arial, sans-serif; font-weight: bold; }
            .pdf-info { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 14px; line-height: 1.8; }
            .pdf-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 14px; }
            .pdf-table th { background-color: #1e293b; color: #ffffff; font-weight: normal; padding: 10px 8px; border: 1px solid #cbd5e1; text-align: center; }
            .pdf-table td { padding: 10px 8px; border: 1px solid #cbd5e1; vertical-align: middle; }
            .pdf-total { background-color: #f1f5f9; font-weight: bold; }
            .pdf-signatures { display: flex; justify-content: space-between; margin-top: 50px; text-align: center; }
            .pdf-signature-box { width: 250px; }
        </style>
        <div id="restock-export-target">
            <div class="pdf-header">
                <h1>ឯកសារស្នើសុំទិញទំនិញចូលស្តុក</h1>
                <h2>Purchase Request Form (PR)</h2>
            </div>
            <div class="pdf-info">
                <div>
                    <div><strong>អ្នករៀបចំ:</strong> ផ្នែកគ្រប់គ្រងស្តុក / Admin</div>
                    <div><strong>ចំនួនទំនិញស្នើសុំ:</strong> <span style="color: #2563eb; font-weight: bold;">${requestedItems.value.length} មុខ</span></div>
                </div>
                <div style="text-align: right;">
                    <div><strong>កាលបរិច្ឆេទ:</strong> ${new Date().toLocaleDateString('km-KH')}</div>
                    <div><strong>ឯកសារលេខ:</strong> <strong>PR-${Date.now().toString().slice(-6)}</strong></div>
                </div>
            </div>
            <table class="pdf-table">
                <thead>
                    <tr>
                        <th width="5%">ល.រ</th>
                        <th width="35%" style="text-align: left;">ឈ្មោះទំនិញ</th>
                        <th width="15%">ស្តុកសល់ជាក់ស្តែង</th>
                        <th width="15%">ចំនួនស្នើសុំ (កេះ)</th>
                        <th width="15%" style="text-align: right;">តម្លៃ១កេះ</th>
                        <th width="15%" style="text-align: right;">សរុបប្រាក់</th>
                    </tr>
                </thead>
                <tbody>${pdfRowsHTML}</tbody>
                <tr class="pdf-total">
                    <td colspan="5" style="text-align: right; padding: 15px 8px;">ទឹកប្រាក់ត្រូវចំណាយប៉ាន់ស្មាន (EST. COST):</td>
                    <td style="text-align: right; padding: 15px 8px; color: #dc2626; font-size: 16px;">${formatCurrency(totalEstimatedCost.value)}</td>
                </tr>
            </table>
            <div class="pdf-signatures">
                <div class="pdf-signature-box">
                    <div style="font-weight: bold; margin-bottom: 60px;">ហត្ថលេខាអ្នកស្នើសុំ</div>
                    <div style="border-bottom: 1px dashed #94a3b8; margin-bottom: 10px;"></div>
                    <div style="color: #64748b; font-size: 14px;">ឈ្មោះ: ............................................</div>
                </div>
                <div class="pdf-signature-box">
                    <div style="font-weight: bold; margin-bottom: 60px;">ហត្ថលេខាអ្នកអនុម័ត (Director)</div>
                    <div style="border-bottom: 1px dashed #94a3b8; margin-bottom: 10px;"></div>
                    <div style="color: #64748b; font-size: 14px;">ឈ្មោះ: ............................................</div>
                </div>
            </div>
        </div>
    `;
};

// ==========================================
// 🌟 I-FRAME PDF PRINT 🌟
// ==========================================
const downloadPDF = async () => {
    isExporting.value = true;
    try {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        const htmlContent = getExportHTML(false);
        const iframeDoc = iframe.contentWindow.document;

        iframeDoc.open();
        iframeDoc.write(`
            <!DOCTYPE html>
            <html lang="km">
            <head>
                <meta charset="UTF-8">
                <title>Purchase_Request_Form</title>
                <link href="https://fonts.googleapis.com/css2?family=Battambang:wght@400;700&family=Moul&display=swap" rel="stylesheet">
                <style>
                    body { margin: 0; padding: 0; background-color: #ffffff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    @page { size: A4 portrait; margin: 15mm; }
                    @media print { header, footer, nav, aside { display: none !important; } }
                </style>
            </head>
            <body>
                ${htmlContent}
            </body>
            </html>
        `);
        iframeDoc.close();

        iframe.onload = () => {
            setTimeout(() => {
                iframe.contentWindow.focus();
                iframe.contentWindow.print();
                
                document.body.removeChild(iframe); 
                isExporting.value = false;
                notification.success("រៀបចំឯកសារ PDF ជោគជ័យ!");
            }, 1000); 
        };

    } catch (error) {
        console.error("PDF Export Error:", error);
        isExporting.value = false;
        notification.error("មានបញ្ហាក្នុងការបង្កើត PDF");
    }
};

const downloadExcel = () => {
    try {
        const html = getExportHTML(true);
        const blob = new Blob(['\ufeff', html], { type: 'application/vnd.ms-excel' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Purchase_Request_Form_${new Date().getTime()}.xls`;
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
.animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>