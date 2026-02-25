<template>
  <div class="min-h-[100dvh] bg-[#F4F7FE] font-khmer flex flex-col relative print-container print:bg-white pb-32">
    
    <div class="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm print:hidden">
        <div class="max-w-[90rem] mx-auto px-4 md:px-8 py-4 flex items-center justify-between gap-4">
            <div class="flex items-center gap-4">
                <button @click="goBack" class="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                </button>
                <div class="flex items-center gap-3" v-if="seller">
                    <img :src="seller.photoUrl || `https://ui-avatars.com/api/?name=${seller.fullName}`" class="w-10 h-10 rounded-full object-cover border border-slate-200">
                    <div>
                        <h1 class="font-black text-slate-800 text-lg leading-tight">{{ seller.fullName }}</h1>
                        <p class="text-xs font-bold text-slate-500">ID: {{ seller.idNumber || 'N/A' }} | លម្អិតការលក់</p>
                    </div>
                </div>
            </div>
            
            <div class="flex items-center gap-2" v-if="!isLoading">
                <button @click="executePrint" class="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-slate-700 transition-colors shadow-sm">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                    Print
                </button>
                <button @click="generatePDF" class="flex items-center gap-2 bg-rose-500 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-rose-600 transition-colors shadow-sm">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    PDF
                </button>
            </div>
        </div>
    </div>

    <div v-if="isLoading" class="flex-1 flex flex-col items-center justify-center py-32 opacity-60 print:hidden">
       <div class="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-indigo-600 mb-4"></div>
       <p class="text-slate-500 font-bold tracking-wide">កំពុងទាញយកទិន្នន័យលម្អិត...</p>
    </div>

    <div v-else class="flex-1 w-full max-w-[90rem] mx-auto p-4 md:p-8 print:p-0 animate-fade-in-up">
        
        <div class="mb-6 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center print:hidden">
            <div class="pl-4 pr-2 text-slate-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input 
                v-model="searchQuery" 
                type="text" 
                placeholder="ស្វែងរកតាមលេខវិក្កយបត្រ, ឈ្មោះទំនិញ ឬ ឈ្មោះអតិថិជន..." 
                class="w-full bg-transparent border-none outline-none focus:ring-0 text-sm font-bold text-slate-700 py-2.5"
            >
            <button v-if="searchQuery" @click="searchQuery = ''" class="p-2 text-slate-400 hover:text-rose-500 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </div>

        <div class="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm print:hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse min-w-[900px]">
                    <thead class="bg-slate-50 text-slate-500 text-[11px] uppercase font-black tracking-widest border-b border-slate-200">
                        <tr>
                            <th class="px-6 py-5 text-center w-16 whitespace-nowrap">#</th>
                            <th class="px-6 py-5 whitespace-nowrap">កាលបរិច្ឆេទ</th>
                            <th class="px-6 py-5 whitespace-nowrap">វិក្កយបត្រ (អតិថិជន)</th>
                            <th class="px-6 py-5 whitespace-nowrap">ឈ្មោះទំនិញ</th>
                            <th class="px-6 py-5 text-center whitespace-nowrap">ប្រភេទការលក់</th>
                            <th class="px-6 py-5 text-center whitespace-nowrap">បរិមាណ</th>
                            <th class="px-6 py-5 text-right whitespace-nowrap">សរុប (Total)</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <tr v-if="filteredItems.length === 0">
                            <td colspan="7" class="py-12 text-center text-slate-400 font-bold">គ្មានទិន្នន័យលក់ទេ</td>
                        </tr>
                        <tr v-for="(item, index) in filteredItems" :key="index" class="hover:bg-slate-50/80 transition-colors">
                            <td class="px-6 py-4 text-center text-sm font-bold text-slate-400">{{ index + 1 }}</td>
                            <td class="px-6 py-4">
                                <span class="text-sm font-bold text-slate-700">{{ formatDate(item.date) }}</span>
                            </td>
                            <td class="px-6 py-4">
                                <p class="text-sm font-black text-indigo-600">#{{ item.receiptId || 'N/A' }}</p>
                                <p class="text-xs font-bold text-slate-500 mt-0.5">{{ item.clientName }}</p>
                            </td>
                            <td class="px-6 py-4">
                                <span class="font-bold text-slate-800 text-sm bg-slate-100 px-3 py-1.5 rounded-lg">{{ item.productName }}</span>
                            </td>
                            <td class="px-6 py-4 text-center">
                                <span :class="item.saleType === 'បោះដុំ' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-slate-50 text-slate-600 border-slate-200'" class="px-3 py-1 rounded-lg text-xs font-black border">
                                    {{ item.saleType }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-center">
                                <span class="inline-flex items-center px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg text-sm font-black border border-amber-200">
                                    {{ item.qty }} {{ translateUnit(item.unit) }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-right">
                                <div class="flex flex-col items-end leading-tight gap-1">
                                    <span v-if="item.totalUSD > 0" class="text-emerald-700 font-black text-sm">{{ item.totalUSD.toLocaleString() }} $</span>
                                    <span v-if="item.totalKHR > 0" class="text-blue-600 font-bold text-xs">{{ item.totalKHR.toLocaleString() }} ៛</span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="mt-6 bg-white rounded-3xl border border-slate-200 p-6 flex flex-wrap gap-6 items-center justify-between shadow-sm print:hidden">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center border border-indigo-100">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                </div>
                <div>
                    <p class="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">សរុបរួមប្រាក់ចំណូល</p>
                    <p class="text-lg font-black text-slate-800">Grand Total</p>
                </div>
            </div>
            
            <div class="flex flex-wrap items-center gap-6">
                <div class="text-right border-r border-slate-200 pr-6">
                    <p class="text-xs font-bold text-slate-500 mb-1">ចំនួនលក់សរុប (Items)</p>
                    <p class="text-xl font-black text-slate-700">{{ filteredItems.length }}</p>
                </div>
                <div class="text-right">
                    <p class="text-xs font-bold text-slate-500 mb-1">ចំណូល (USD)</p>
                    <p class="text-2xl font-black text-emerald-600">{{ grandTotals.usd.toLocaleString() }} $</p>
                </div>
                <div class="text-right">
                    <p class="text-xs font-bold text-slate-500 mb-1">ចំណូល (KHR)</p>
                    <p class="text-xl font-black text-blue-600">{{ grandTotals.khr.toLocaleString() }} ៛</p>
                </div>
            </div>
        </div>

    </div>

    <transition enter-active-class="duration-300 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="processing.active" class="fixed inset-0 z-[999999] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md print:hidden">
            <div class="w-full max-w-sm bg-[#18181b] border border-white/10 rounded-3xl p-10 shadow-2xl relative flex flex-col items-center text-center animate-fade-in-up">
                <div class="relative w-20 h-20 mb-8">
                    <div class="absolute inset-0 rounded-full border-4 border-white/5"></div>
                    <div class="absolute inset-0 rounded-full border-4 border-t-rose-500 border-r-rose-500 border-b-transparent border-l-transparent animate-spin"></div>
                    <div class="absolute inset-0 flex items-center justify-center font-bold text-white text-lg font-mono">{{ processing.progress }}%</div>
                </div>
                <h3 class="text-xl font-bold text-white mb-2">{{ processing.message }}</h3>
                <div class="w-full h-1.5 bg-black/50 rounded-full overflow-hidden border border-white/5 mt-4">
                    <div class="h-full bg-gradient-to-r from-red-500 to-rose-600 transition-all duration-300 ease-out" :style="{ width: `${processing.progress}%` }"></div>
                </div>
            </div>
        </div>
    </transition>
    <div ref="printStaging" class="fixed top-0 left-[-9999px] pointer-events-none z-[-1] opacity-0 print:opacity-100"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { db } from '@/firebaseConfig';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const route = useRoute();
const router = useRouter();
const sellerId = route.params.id; // ទាញយក ID ពី URL

const isLoading = ref(true);
const seller = ref(null);
const allDetailItems = ref([]);
const unitSettings = ref([]);
const searchQuery = ref('');

const printStaging = ref(null);
const processing = ref({ active: false, message: '', progress: 0 });

onMounted(async () => {
    if (!sellerId) {
        router.back();
        return;
    }
    
    try {
        // 1. ទាញយកព័ត៌មានអ្នកលក់
        const sellerDoc = await getDoc(doc(db, 'users', sellerId));
        if (sellerDoc.exists()) {
            seller.value = { id: sellerDoc.id, ...sellerDoc.data() };
        } else {
            router.back();
            return;
        }

        // 2. ទាញយក Unit Settings
        const unitSnap = await getDocs(collection(db, 'settings_units'));
        unitSettings.value = unitSnap.docs.map(d => d.data());

        // 3. ទាញយកការលក់ទាំងអស់របស់គាត់
        const salesSnap = await getDocs(collection(db, 'sales_reports'));
        let rawItems = [];
        
        salesSnap.docs.forEach(docSnap => {
            const sale = { id: docSnap.id, ...docSnap.data() };
            // ឆែកមើលតែវិក្កយបត្រដែលជារបស់អ្នកលក់នេះ និងមិនទាន់លុប/Cancel
            if (((sale.uid === sellerId) || (sale.sellerId === sellerId) || (sale.sellerName === seller.value.fullName)) && sale.paymentStatus !== 'CANCELED') {
                if (sale.items && sale.items.length > 0) {
                    sale.items.forEach(item => {
                        rawItems.push({
                            receiptId: sale.receiptId || sale.invoiceNumber || 'N/A',
                            date: sale.createdAt || sale.date || new Date().toISOString(),
                            clientName: sale.clientName || sale.customerName || 'អតិថិជនទូទៅ',
                            productName: item.name || 'មិនស្គាល់',
                            saleType: item.type === 'wholesale' ? 'បោះដុំ' : 'លក់រាយ',
                            qty: Number(item.qty || 0),
                            unit: item.unit || '',
                            price: Number(item.price || 0),
                            totalUSD: (sale.currency === 'USD' || sale.currency === '$') ? (Number(item.qty) * Number(item.price)) : 0,
                            totalKHR: (sale.currency === 'KHR' || sale.currency === '៛') ? (Number(item.qty) * Number(item.price)) : 0,
                        });
                    });
                }
            }
        });

        // តម្រៀបតាមថ្ងៃខែចុងក្រោយ
        allDetailItems.value = rawItems.sort((a, b) => new Date(b.date) - new Date(a.date));

    } catch (error) {
        console.error("Error fetching detail:", error);
    } finally {
        isLoading.value = false;
    }
});

const goBack = () => {
    router.back();
};

const formatDate = (dateStr) => {
    if(!dateStr) return '';
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('km-KH', { day: '2-digit', month: 'short', year: 'numeric' }).format(d);
};

const translateUnit = (unitVal) => {
    if (!unitVal) return '';
    const safeVal = String(unitVal);
    const found = unitSettings.value.find(u => String(u.value) === safeVal);
    if (found) return found.label;
    const u = safeVal.toLowerCase().trim();
    if (u === 'bottle' || u === 'bottles') return 'ដប';
    if (u === 'pack' || u === 'packs') return 'កញ្ចប់';
    if (u === 'case' || u === 'cases') return 'កេះ';
    return safeVal; 
};

// ស្វែងរក
const filteredItems = computed(() => {
    if (!searchQuery.value) return allDetailItems.value;
    const q = searchQuery.value.toLowerCase().trim();
    return allDetailItems.value.filter(item => 
        (item.receiptId && item.receiptId.toLowerCase().includes(q)) ||
        (item.productName && item.productName.toLowerCase().includes(q)) ||
        (item.clientName && item.clientName.toLowerCase().includes(q))
    );
});

// សរុបរួម
const grandTotals = computed(() => {
    let usd = 0;
    let khr = 0;
    filteredItems.value.forEach(item => {
        usd += item.totalUSD;
        khr += item.totalKHR;
    });
    return { usd, khr };
});

// ========================
// Print & PDF Logic
// ========================

const generatePrintHTML = (itemsList, pageNum, totalPages, isNativePrint = false) => {
    const renderRow = (item, idx) => {
        return `
            <tr style="border-bottom: 1px dashed #e2e8f0; break-inside: avoid; page-break-inside: avoid;">
                <td style="padding: 12px 10px; text-align: center; vertical-align: middle; color: #94a3b8; font-weight: 900;">${idx + 1}</td>
                <td style="padding: 12px 10px; vertical-align: middle; font-weight: bold; color: #475569; font-size: 13px;">${formatDate(item.date)}</td>
                <td style="padding: 12px 10px; vertical-align: middle;">
                    <p style="font-weight: 900; color: #1e293b; font-size: 14px; margin: 0;">#${item.receiptId}</p>
                    <p style="color: #64748b; font-size: 11px; margin: 2px 0 0 0;">${item.clientName}</p>
                </td>
                <td style="padding: 12px 10px; vertical-align: middle; font-weight: bold; color: #0f172a; font-size: 14px;">${item.productName}</td>
                <td style="padding: 12px 10px; text-align: center; vertical-align: middle; font-weight: bold; color: #475569; font-size: 12px;">${item.saleType}</td>
                <td style="padding: 12px 10px; text-align: center; vertical-align: middle; font-weight: 900; color: #d97706; font-size: 14px;">${item.qty} ${translateUnit(item.unit)}</td>
                <td style="padding: 12px 10px; text-align: right; vertical-align: middle;">
                    ${item.totalUSD > 0 ? `<div style="color:#059669; font-weight:900; font-size:15px;">${item.totalUSD.toLocaleString()} $</div>` : ''}
                    ${item.totalKHR > 0 ? `<div style="color:#2563eb; font-weight:bold; font-size:13px;">${item.totalKHR.toLocaleString()} ៛</div>` : ''}
                </td>
            </tr>
        `;
    };

    const rowsHTML = itemsList.map((item, i) => renderRow(item, i + (pageNum - 1) * 15)).join('');

    let headerHTML = '';
    if (pageNum === 1) {
        headerHTML = `
            <div style="border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 25px; overflow: hidden;">
                <div style="float: left;">
                    <p style="font-size: 12px; color: #64748b; font-weight: bold; text-transform: uppercase; margin: 0 0 5px 0;">តំណាងលក់</p>
                    <h2 style="font-size: 24px; font-weight: 900; color: #0f172a; margin: 0 0 8px 0;">${seller.value?.fullName || 'N/A'}</h2>
                    <span style="font-size: 14px; color: #475569; font-weight: bold;">ID: ${seller.value?.idNumber || 'N/A'} ${seller.value?.phoneNumber ? `| Tel: ${seller.value.phoneNumber}` : ''}</span>
                </div>
                <div style="clear: both;"></div>
            </div>
        `;
    }

    let summaryHTML = '';
    if (pageNum === totalPages || isNativePrint) {
        summaryHTML = `
            <div style="margin-top: 30px; border-top: 2px solid #cbd5e1; padding-top: 20px; text-align: right; break-inside: avoid;">
                <h3 style="font-size: 16px; font-weight: 900; color: #1e293b; margin: 0 0 10px 0;">សរុបរួមប្រាក់ចំណូល (Grand Total)</h3>
                <p style="font-size: 24px; font-weight: 900; color: #059669; margin: 0;">${grandTotals.value.usd.toLocaleString()} $</p>
                <p style="font-size: 18px; font-weight: bold; color: #2563eb; margin: 5px 0 0 0;">${grandTotals.value.khr.toLocaleString()} ៛</p>
            </div>
        `;
    }

    const thStyle = `padding: 12px 10px; border-bottom: 2px solid #cbd5e1; font-size: 12px; font-weight: 900; color: #334155; text-transform: uppercase;`;
    const pageStyles = isNativePrint ? `width: 100%; box-sizing: border-box; font-family: 'Battambong', sans-serif; padding: 20px;` : `width: 1000px; min-height: 1414px; background: white; padding: 40px; box-sizing: border-box; font-family: 'Battambong', sans-serif; position: relative;`;

    return `
        <div class="print-page" style="${pageStyles}">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="font-size: 24px; font-weight: 900; color: #1e293b; margin: 0; text-transform: uppercase;">របាយការណ៍លក់លម្អិត</h1>
            </div>
            ${headerHTML}
            <table style="width: 100%; text-align: left; border-collapse: collapse;">
                <thead>
                    <tr>
                        <th style="${thStyle} width:5%; text-align:center;">#</th>
                        <th style="${thStyle} width:15%;">កាលបរិច្ឆេទ</th>
                        <th style="${thStyle} width:20%;">វិក្កយបត្រ</th>
                        <th style="${thStyle} width:25%;">ទំនិញ</th>
                        <th style="${thStyle} width:10%; text-align:center;">ប្រភេទ</th>
                        <th style="${thStyle} width:10%; text-align:center;">បរិមាណ</th>
                        <th style="${thStyle} width:15%; text-align:right;">សរុប</th>
                    </tr>
                </thead>
                <tbody>${rowsHTML}</tbody>
            </table>
            ${summaryHTML}
            <div style="margin-top: 40px; padding-top: 15px; border-top: 1px solid #e2e8f0; font-size: 12px; font-weight: bold; color: #94a3b8; overflow: hidden;">
                <div style="float: left;">ថ្ងៃបញ្ចេញរបាយការណ៍: ${new Date().toLocaleString('km-KH')}</div>
                <div style="float: right;">${isNativePrint ? '' : `ទំព័រទី ${pageNum} នៃ ${totalPages}`}</div>
                <div style="clear: both;"></div>
            </div>
        </div>
    `;
};

const executePrint = () => {
    const title = `Detailed_Sales_${seller.value?.fullName}`;
    const contentHTML = generatePrintHTML(filteredItems.value, 1, 1, true);
    
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute'; iframe.style.width = '0'; iframe.style.height = '0'; iframe.style.border = 'none';
    document.body.appendChild(iframe);
    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
        <html><head><title>${title}</title><link href="https://fonts.googleapis.com/css2?family=Battambong:wght@400;700;900&display=swap" rel="stylesheet"><style>@page { size: A4 portrait; margin: 0; } body { font-family: 'Battambong', sans-serif; margin: 0; padding: 15mm; background-color: white; -webkit-print-color-adjust: exact !important; }</style></head>
        <body>${contentHTML}</body></html>
    `);
    doc.close();
    iframe.contentWindow.document.fonts.ready.then(() => {
        iframe.contentWindow.focus(); iframe.contentWindow.print();
        setTimeout(() => { document.body.removeChild(iframe); }, 1000);
    });
};

const generatePDF = async () => {
    processing.value = { active: true, message: 'កំពុងរៀបចំទិន្នន័យ...', progress: 10 };
    try {
        const itemsPerPage = 15;
        const pages = [];
        let remaining = [...filteredItems.value];
        
        while (remaining.length > 0) {
            pages.push(remaining.slice(0, itemsPerPage));
            remaining = remaining.slice(itemsPerPage);
        }

        const pdf = new jsPDF('p', 'mm', 'a4'); 
        const pdfWidth = 210; 
        
        for (let i = 0; i < pages.length; i++) {
            processing.value.message = `កំពុងថតចម្លងទំព័រទី ${i+1} នៃ ${pages.length}...`;
            printStaging.value.innerHTML = generatePrintHTML(pages[i], i + 1, pages.length, false);
            
            await nextTick(); await document.fonts.ready; await new Promise(r => setTimeout(r, 600)); 

            const canvas = await html2canvas(printStaging.value.querySelector('.print-page'), { 
                scale: 2, useCORS: true, logging: false, backgroundColor: "#ffffff", windowWidth: 1000
            });
            
            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            if (i > 0) pdf.addPage();
            
            const propsImg = pdf.getImageProperties(imgData);
            const pdfHeight = (propsImg.height * pdfWidth) / propsImg.width;
            
            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
            processing.value.progress = 10 + Math.round(((i + 1) / pages.length) * 80);
        }

        processing.value.message = 'កំពុងរក្សាទុកឯកសារ...';
        processing.value.progress = 100;
        pdf.save(`Detailed_Sales_${seller.value?.fullName}.pdf`);
        
    } catch(e) {
        alert("មិនអាចទាញយក PDF បានទេ");
    } finally {
        if(printStaging.value) printStaging.value.innerHTML = '';
        processing.value.active = false;
    }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Battambong:wght@400;700;900&display=swap');
.font-khmer { font-family: 'Battambong', sans-serif; }
.animate-fade-in-up { animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
@media print { .print\:hidden { display: none !important; } }
</style>