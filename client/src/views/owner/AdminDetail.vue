<template>
  <div class="min-h-screen bg-[#F4F7FE] font-khmer flex flex-col print-container print:bg-white">
    
    <AdminDetailHeader 
        v-model:dateFilterType="dateFilterType"
        v-model:selectedDate="selectedDate"
        v-model:selectedMonth="selectedMonth"
        v-model:selectedYear="selectedYear"
        v-model:customStart="customStart"
        v-model:customEnd="customEnd"
        :availableYears="availableYears"
        :availableMonths="availableMonths"
        :isLoadingPage="isLoadingPage"
    />

    <div v-if="isLoadingPage && allSales.length === 0" class="flex flex-col items-center justify-center py-32 opacity-60 print:hidden">
       <div class="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-indigo-600 mb-4"></div>
       <p class="text-slate-500 font-bold tracking-wide">កំពុងទាញយកទិន្នន័យដំបូង...</p>
    </div>

    <div v-else class="w-full max-w-[90rem] mx-auto p-4 md:p-8 print:p-0 flex-1 relative z-10">
        
        <AdminDetailProfileCard 
            :admin="admin"
            :totalSellersCount="allSellers.length"
            v-model:activeTab="activeTab"
            v-model:searchQuery="searchQuery"
            v-model:activeCategory="activeCategory"
            :filteredSellersLength="filteredSellers.length"
            :processing="processing"
            @print="executePrint"
            @pdf="generatePDF"
        />

        <AdminDetailList 
            :activeTab="activeTab"
            :filteredSellers="filteredSellers"
            :paginatedSellers="paginatedSellers"
            :currentPage="currentPage"
            :totalPages="totalPages"
            :itemsPerPage="itemsPerPage"
            :unitSettings="unitSettings"
            v-model:viewMode="viewMode"
            @goToPage="goToPage"
            @prevPage="prevPage"
            @nextPage="nextPage"
            @goToSellerDetail="goToSellerDetail"
        />

    </div>

    <div class="w-full max-w-[90rem] mx-auto px-4 md:px-8 pb-10">
        <AdminDetailBottomSummary 
            v-if="!isLoadingPage && activeTab === 'report' && filteredSellers.some(s => s.hasSales)"
            :grandTotals="grandTotals"
            :unitSettings="unitSettings"
        />
    </div>

    <transition enter-active-class="duration-300 ease-out" enter-from-class="opacity-0 translate-y-10" enter-to-class="opacity-100 translate-y-0" leave-active-class="duration-200 ease-in" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-10">
        <div v-if="fetchTimer.show" class="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] bg-slate-900/90 backdrop-blur-md border border-slate-700 text-white px-5 py-3.5 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] flex items-center gap-3 pointer-events-none">
            <div class="animate-spin h-5 w-5 border-2 border-indigo-400 border-t-transparent rounded-full"></div>
            <span class="text-sm font-bold tracking-wide">កំពុងទាញទិន្នន័យ...</span>
            <span class="text-[13px] text-indigo-300 font-mono font-black bg-slate-800 px-2 py-0.5 rounded border border-indigo-500/30 w-[45px] text-center">
                {{ fetchTimer.seconds.toFixed(1) }}s
            </span>
        </div>
    </transition>

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
import { ref, computed, watch, onMounted, onUnmounted, nextTick, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { db } from '@/firebaseConfig';
import { doc, getDoc, collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

// 📦 នាំចូល Child Components
import AdminDetailHeader from './Detail/AdminDetailHeader.vue';
import AdminDetailProfileCard from './Detail/AdminDetailProfileCard.vue';
import AdminDetailList from './Detail/AdminDetailList.vue';
import AdminDetailBottomSummary from './Detail/AdminDetailBottomSummary.vue';

const route = useRoute();
const router = useRouter();
const adminId = route.params.id; 

const isLoadingPage = ref(true);
const admin = ref({});
const allSellers = ref([]);
const allSales = ref([]);
const unitSettings = ref([]);

const activeCategory = ref('all');
const dateFilterType = ref('daily'); 

const today = new Date();
const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

const selectedDate = ref(todayStr);
const selectedYear = ref(today.getFullYear());
const selectedMonth = ref(today.getMonth());
const customStart = ref(todayStr);
const customEnd = ref(todayStr);

const monthNames = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'];
const availableMonths = computed(() => monthNames.map((name, index) => ({ index, name })));
const availableYears = computed(() => {
    const currentYear = new Date().getFullYear();
    return [currentYear - 2, currentYear - 1, currentYear, currentYear + 1];
});

const activeTab = ref('sellers');
const viewMode = ref('list');
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 12;

const printStaging = ref(null);
const processing = ref({ active: false, message: '', progress: 0 });

let unsubscribeSales = null;

// 🌟 មុខងាររាប់វិនាទីអណ្តែតពីលើ (Smart Floating Timer) 🌟
const fetchTimer = reactive({ show: false, seconds: 0, interval: null });

const startFetchTimer = () => {
    fetchTimer.show = true;
    fetchTimer.seconds = 0;
    if (fetchTimer.interval) clearInterval(fetchTimer.interval);
    fetchTimer.interval = setInterval(() => { fetchTimer.seconds += 0.1; }, 100);
};

const stopFetchTimer = () => {
    fetchTimer.show = false;
    if (fetchTimer.interval) clearInterval(fetchTimer.interval);
};

// 🌟 Date Logic for Server Query (Safe Parsing) 🌟
const getDateRangeISO = () => {
    try {
        let start, end;
        const createDateBounds = (dateString) => {
            const base = new Date(dateString);
            if (isNaN(base.getTime())) throw new Error("Invalid Date");
            const startDay = new Date(base.getFullYear(), base.getMonth(), base.getDate(), 0, 0, 0);
            const endDay = new Date(base.getFullYear(), base.getMonth(), base.getDate(), 23, 59, 59, 999);
            return { startDay, endDay };
        };

        if (dateFilterType.value === 'daily') {
            const { startDay, endDay } = createDateBounds(selectedDate.value);
            start = startDay; end = endDay;
        } else if (dateFilterType.value === 'monthly') {
            start = new Date(parseInt(selectedYear.value), parseInt(selectedMonth.value), 1, 0, 0, 0);
            end = new Date(parseInt(selectedYear.value), parseInt(selectedMonth.value) + 1, 0, 23, 59, 59, 999);
        } else if (dateFilterType.value === 'yearly') {
            start = new Date(parseInt(selectedYear.value), 0, 1, 0, 0, 0);
            end = new Date(parseInt(selectedYear.value), 11, 31, 23, 59, 59, 999);
        } else if (dateFilterType.value === 'custom') {
            const boundsStart = createDateBounds(customStart.value);
            const boundsEnd = createDateBounds(customEnd.value);
            start = boundsStart.startDay; end = boundsEnd.endDay;
        }
        
        return { startStr: start.toISOString(), endStr: end.toISOString() };
    } catch (error) {
        console.warn("Date Parsing Warning, using today's fallback:", error);
        const todayStart = new Date(); todayStart.setHours(0,0,0,0);
        const todayEnd = new Date(); todayEnd.setHours(23,59,59,999);
        return { startStr: todayStart.toISOString(), endStr: todayEnd.toISOString() };
    }
};

// 🌟 Tracking ID និង Safety Timer 🌟
let currentFetchId = 0; 
let safetyTimer = null;

const fetchDynamicSalesData = () => {
    if (allSales.value.length === 0) isLoadingPage.value = true;
    
    const { startStr, endStr } = getDateRangeISO();

    if (unsubscribeSales) unsubscribeSales();

    const salesQ = query(
        collection(db, 'sales_reports'),
        where('createdBy', '==', adminId), 
        where('createdAt', '>=', startStr),
        where('createdAt', '<=', endStr)
    );

    currentFetchId++;
    const thisFetchId = currentFetchId;

    unsubscribeSales = onSnapshot(salesQ, { includeMetadataChanges: true }, (snapshot) => {
        if (thisFetchId !== currentFetchId) return;

        allSales.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        isLoadingPage.value = false;
        
        if (!snapshot.metadata.fromCache) {
            stopFetchTimer();
            if (safetyTimer) clearTimeout(safetyTimer);
        }
    }, (error) => {
        console.error("Error fetching sales data:", error);
        if (thisFetchId === currentFetchId) {
            isLoadingPage.value = false;
            stopFetchTimer();
        }
    });

    if (safetyTimer) clearTimeout(safetyTimer);
    safetyTimer = setTimeout(() => {
        if (thisFetchId === currentFetchId) stopFetchTimer();
    }, 20000);
};

onMounted(async () => {
    if (!adminId) {
        router.back();
        return;
    }
    try {
        const adminDoc = await getDoc(doc(db, 'users', adminId));
        if (adminDoc.exists()) {
            admin.value = { id: adminDoc.id, ...adminDoc.data() };
        } else {
            router.back();
            return;
        }

        const sellersQ = query(collection(db, 'users'), where('role', 'in', ['seller', 'dealer']), where('createdBy', '==', adminId));
        const sellersSnap = await getDocs(sellersQ);
        allSellers.value = sellersSnap.docs
            .map(d => ({ id: d.id, ...d.data() }))
            .filter(s => s.isDeleted === false || s.isDeleted === "false" || !s.isDeleted);

        const unitSnap = await getDocs(collection(db, 'settings_units'));
        unitSettings.value = unitSnap.docs.map(d => d.data());

        fetchDynamicSalesData();

    } catch (error) {
        console.error("Error fetching static data:", error);
        isLoadingPage.value = false;
    }
});

onUnmounted(() => {
    if (unsubscribeSales) unsubscribeSales();
    stopFetchTimer();
    if (safetyTimer) clearTimeout(safetyTimer);
});

// 🌟 ដំណោះស្រាយការពន្យារពេល (Debounce) 🌟
let debounceTimeout = null;
watch([dateFilterType, selectedDate, selectedMonth, selectedYear, customStart, customEnd], () => {
    if (activeTab.value === 'report') {
        startFetchTimer();
        if (debounceTimeout) clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            fetchDynamicSalesData();
        }, 600);
    }
}, { deep: true });

watch(activeTab, (newTab) => { 
    if (newTab === 'report') {
        viewMode.value = 'list'; 
        startFetchTimer();
        if (debounceTimeout) clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            fetchDynamicSalesData(); 
        }, 300);
    }
    currentPage.value = 1; 
});

const isDateInScope = (dateStr) => {
    return true; 
};

const calculatedSellers = computed(() => {
    const relevantSales = allSales.value.filter(sale => sale.paymentStatus !== 'CANCELED');

    if (activeTab.value === 'sellers') {
        return allSellers.value.map(seller => ({ ...seller, uniqueId: seller.id }));
    }

    let rows = [];

    allSellers.value.forEach(seller => {
        const sellerSales = relevantSales.filter(s => (s.uid || s.sellerId) === seller.id || s.sellerName === seller.fullName);

        let hasValidSales = false;
        
        let sellerSummary = {
            productNames: new Set(),
            saleTypes: new Set(),
            unitCounts: {},
            revenueUSD: 0,
            revenueKHR: 0,
            clients: new Set()
        };

        sellerSales.forEach(sale => {
            if (sale.items && sale.items.length > 0) {
                sale.items.forEach(item => {
                    const safeType = String(item.type || '').trim();
                    const isItemWholesale = safeType.includes('បោះដុំ');
                    let itemCategory = isItemWholesale ? 'បោះដុំ' : 'លក់រាយ';
                    
                    if (activeCategory.value === 'all' || activeCategory.value === itemCategory) {
                        hasValidSales = true;
                        let pName = item.name || 'មិនស្គាល់ឈ្មោះ';
                        
                        sellerSummary.productNames.add(pName);
                        sellerSummary.saleTypes.add(itemCategory);

                        const u = (item.unit || 'unknown').toLowerCase().trim();
                        if (!sellerSummary.unitCounts[u]) sellerSummary.unitCounts[u] = 0;
                        sellerSummary.unitCounts[u] += Number(item.qty || 0);

                        const itemRevenue = Number(item.qty || 0) * Number(item.price || 0);
                        if (sale.currency === 'USD' || sale.currency === '$') {
                            sellerSummary.revenueUSD += itemRevenue;
                        } else {
                            sellerSummary.revenueKHR += itemRevenue;
                        }

                        sellerSummary.clients.add(sale.receiptId);
                    }
                });
            }
        });

        if (hasValidSales) {
            rows.push({
                ...seller,
                uniqueId: `${seller.id}_report`,
                productName: Array.from(sellerSummary.productNames).join(', '),
                saleType: Array.from(sellerSummary.saleTypes).join(' & '), 
                totalClients: sellerSummary.clients.size,
                revenueUSD: sellerSummary.revenueUSD,
                revenueKHR: sellerSummary.revenueKHR,
                unitCounts: sellerSummary.unitCounts,
                hasSales: true
            });
        } else if (activeCategory.value === 'all') {
            rows.push({ ...seller, uniqueId: `${seller.id}_empty`, hasSales: false });
        }
    });

    return rows.sort((a, b) => {
        if (a.hasSales && !b.hasSales) return -1;
        if (!a.hasSales && b.hasSales) return 1;
        return (b.revenueUSD || 0) - (a.revenueUSD || 0);
    });
});

watch(activeCategory, () => { currentPage.value = 1; });
watch(searchQuery, () => { currentPage.value = 1; });

const filteredSellers = computed(() => {
    if (!searchQuery.value) return calculatedSellers.value;
    const q = searchQuery.value.toLowerCase().trim();
    return calculatedSellers.value.filter(s => 
        (s.fullName && s.fullName.toLowerCase().includes(q)) || 
        (s.idNumber && s.idNumber.toLowerCase().includes(q)) ||
        (s.productName && s.productName.toLowerCase().includes(q))
    );
});

const totalPages = computed(() => Math.ceil(filteredSellers.value.length / itemsPerPage) || 1);
const paginatedSellers = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    return filteredSellers.value.slice(start, start + itemsPerPage);
});

const prevPage = () => { if (currentPage.value > 1) currentPage.value--; };
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++; };
const goToPage = (p) => { currentPage.value = p; };
const goToSellerDetail = (sellerId) => {
    if (sellerId) router.push({ name: 'SellerSalesDetail', params: { id: sellerId } });
};

const grandTotals = computed(() => {
    let stats = { all: { usd: 0, khr: 0, clients: 0, totalUnitsCount: 0, units: {} } };
    if (activeTab.value === 'sellers') return stats; 

    filteredSellers.value.forEach(row => {
        if(row.hasSales) {
            stats.all.clients += row.totalClients || 0;
            stats.all.usd += row.revenueUSD || 0;
            stats.all.khr += row.revenueKHR || 0;
            for (const [unit, count] of Object.entries(row.unitCounts || {})) {
                if(count > 0) {
                    stats.all.units[unit] = (stats.all.units[unit] || 0) + count;
                    stats.all.totalUnitsCount += count;
                }
            }
        }
    });
    return stats;
});

const reportDateLabel = computed(() => {
   let dateStr = '';
   if (dateFilterType.value === 'daily') {
       dateStr = new Intl.DateTimeFormat('km-KH', { dateStyle: 'long' }).format(new Date(selectedDate.value));
   } else if (dateFilterType.value === 'monthly') {
       dateStr = `ខែ ${monthNames[selectedMonth.value]} ឆ្នាំ ${selectedYear.value}`;
   } else if (dateFilterType.value === 'yearly') {
       dateStr = `ឆ្នាំ ${selectedYear.value}`;
   } else if (dateFilterType.value === 'custom') {
       dateStr = `${customStart.value} ដល់ ${customEnd.value}`;
   }
   const categoryName = activeCategory.value === 'all' ? 'សរុប (All)' : activeCategory.value;
   return activeTab.value === 'report' ? `${dateStr} - ${categoryName}` : dateStr;
});

const translateUnit = (unitVal) => {
    if (!unitVal) return '';
    const safeVal = String(unitVal);
    const found = unitSettings.value.find(u => String(u.value) === safeVal);
    if (found) return found.label;
    const u = safeVal.toLowerCase().trim();
    if (u === 'bottle' || u === 'bottles') return 'ដប';
    if (u === 'pack' || u === 'packs') return 'កញ្ចប់';
    if (u === 'case' || u === 'cases') return 'កេះ';
    if (u === 'set' || u === 'sets') return 'ឈុត';
    return safeVal; 
};

// --- NATIVE PRINT LOGIC ---
const executePrint = () => {
    const isReport = activeTab.value === 'report';
    const title = isReport ? `Sales_Report_${admin.value?.fullName}` : `Sellers_List_${admin.value?.fullName}`;
    const dataWithIndex = filteredSellers.value.map((item, idx) => ({ ...item, printIndex: idx + 1 }));
    const contentHTML = generatePrintHTML(dataWithIndex, 1, 1, true);
    
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute'; iframe.style.width = '0'; iframe.style.height = '0'; iframe.style.border = 'none';
    document.body.appendChild(iframe);
    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
        <html>
        <head>
            <title>${title}</title>
            <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;500;600;700&family=Battambang:wght@400;700;900&display=swap" rel="stylesheet">
            <style>
                @page { size: A4 portrait; margin: 0; }
                body { font-family: 'Kantumruy Pro', 'Battambang', sans-serif; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; margin: 0; padding: 15mm; background-color: white; }
                table { width: 100%; border-collapse: collapse; }
                tr { page-break-inside: avoid; page-break-after: auto; }
                thead { display: table-header-group; }
            </style>
        </head>
        <body>${contentHTML}</body>
        </html>
    `);
    doc.close();
    iframe.contentWindow.document.fonts.ready.then(() => {
        iframe.contentWindow.focus(); iframe.contentWindow.print();
        setTimeout(() => { document.body.removeChild(iframe); }, 1000);
    });
};

// --- PDF GENERATION LOGIC ---
const generatePDF = async () => {
    processing.value = { active: true, message: 'កំពុងបំបែកទិន្នន័យ...', progress: 10 };
    const isReport = activeTab.value === 'report';
    
    try {
        const pages = [];
        let remaining = [...filteredSellers.value];
        let rowCounter = 1;
        
        while (remaining.length > 0) {
            let chunkLimit = isReport ? 8 : 14; 
            if (isReport && remaining.length <= chunkLimit && remaining.length > 5) chunkLimit = 5; 
            pages.push(remaining.slice(0, chunkLimit).map(r => ({...r, printIndex: rowCounter++})));
            remaining = remaining.slice(chunkLimit);
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
        const fileName = isReport ? `Sales_Report_${admin.value?.fullName}.pdf` : `Sellers_List_${admin.value?.fullName}.pdf`;
        pdf.save(fileName);
        
    } catch(e) {
        alert("មិនអាចទាញយក PDF បានទេ");
    } finally {
        if(printStaging.value) printStaging.value.innerHTML = '';
        processing.value.active = false;
    }
};

const generatePrintHTML = (rows, pageNum, totalPages, isNativePrint = false) => {
    const isReport = activeTab.value === 'report';
    let normalRows = rows;
    let lastRow = null;
    if (isNativePrint && rows.length > 0 && isReport) {
        normalRows = rows.slice(0, rows.length - 1);
        lastRow = rows[rows.length - 1];
    }

    const renderRow = (item) => {
        if (isReport) {
            let salesHTML = item.hasSales ? 
                `<div style="overflow: hidden;">` + 
                Object.entries(item.unitCounts || {}).filter(([u, c]) => c > 0).map(([u, c]) => 
                    `<div style="float: left; margin: 0 12px 6px 0;">
                        <span style="font-weight: 900; color: #1e293b; font-size: 14px;">${c.toLocaleString()}</span>
                        <span style="color: #64748b; font-size: 12px; font-weight: bold; margin-left: 4px;">${translateUnit(u)}</span>
                     </div>`
                ).join('') + `<div style="clear: both;"></div></div>` 
                : `<span style="color:#94a3b8; font-size:12px; font-weight:bold;">គ្មានការលក់</span>`;
                
            let revHTML = item.hasSales ? 
                `<div style="text-align: right;">
                    <span style="color:#059669; font-size:16px; font-weight:900; display: inline-block;">${item.revenueUSD?.toLocaleString() || 0} $</span><br/>
                    <span style="color:#2563eb; font-size:13px; font-weight:bold; display: inline-block; margin-top: 2px;">${item.revenueKHR?.toLocaleString() || 0} ៛</span>
                </div>` : 
                `<div style="text-align: right; color:#94a3b8; font-weight:bold; font-size:14px;">-</div>`;

            const catBadge = `<span style="color: #475569; font-size: 13px; font-weight: bold;">${item.saleType}</span>`;

            return `
                <tr style="break-inside: avoid; page-break-inside: avoid; border-bottom: 1px dashed #e2e8f0;">
                    <td style="padding: 16px 10px; text-align: center; vertical-align: top; color: #94a3b8; font-weight: 900;">${item.printIndex}</td>
                    <td style="padding: 16px 10px; vertical-align: top;">
                        <p style="font-weight: bold; color: #1e293b; font-size: 15px; margin: 0;">${item.fullName}</p>
                        <p style="font-family: monospace; color: #64748b; font-size: 11px; margin: 4px 0 0 0;">ID: ${item.idNumber || 'N/A'}</p>
                    </td>
                    <td style="padding: 16px 10px; vertical-align: top; font-weight: bold; color: #1e293b; font-size: 14px;">${item.hasSales ? item.productName : '-'}</td>
                    <td style="padding: 16px 10px; vertical-align: top;">${salesHTML}</td>
                    <td style="padding: 16px 10px; vertical-align: top; text-align: center;">${item.hasSales ? catBadge : '-'}</td>
                    <td style="padding: 16px 10px; text-align: center; vertical-align: top; font-weight: bold; color: #334155; font-size: 15px;">${item.hasSales ? (item.totalClients || 0) + ' នាក់' : '-'}</td>
                    <td style="padding: 16px 10px; vertical-align: top;">${revHTML}</td>
                </tr>
            `;
        } else {
            return `
                <tr style="border-bottom: 1px dashed #e2e8f0; break-inside: avoid; page-break-inside: avoid;">
                    <td style="padding: 16px 10px; text-align: center; vertical-align: middle; font-weight: 900; color: #94a3b8; font-size: 14px;">${item.printIndex}</td>
                    <td style="padding: 16px 10px; vertical-align: middle;"><p style="font-weight: bold; color: #1e293b; font-size: 15px; margin: 0;">${item.fullName}</p></td>
                    <td style="padding: 16px 10px; text-align: center; vertical-align: middle; font-weight: bold; color: #475569; font-size: 13px;">${item.idNumber || '-'}</td>
                    <td style="padding: 16px 10px; text-align: center; vertical-align: middle; font-weight: bold; color: #475569; font-size: 13px;">${item.phoneNumber || '-'}</td>
                </tr>
            `;
        }
    };

    const normalRowsHTML = normalRows.map(renderRow).join('');
    const lastRowHTML = lastRow ? renderRow(lastRow) : '';

    let adminHeaderHTML = '';
    if (pageNum === 1) {
        adminHeaderHTML = `
            <div style="border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 25px; overflow: hidden;">
                <div style="float: left;">
                    <p style="font-size: 12px; color: #64748b; font-weight: bold; text-transform: uppercase; margin: 0 0 5px 0;">អ្នកគ្រប់គ្រង (Admin)</p>
                    <h2 style="font-size: 24px; font-weight: 900; color: #0f172a; margin: 0 0 8px 0;">${admin.value?.fullName || 'N/A'}</h2>
                    <span style="font-size: 14px; color: #475569; font-weight: bold;">@${admin.value?.username || 'N/A'} ${admin.value?.telegram ? `| Tel: ${admin.value.telegram}` : ''}</span>
                </div>
                <div style="float: right; margin-top: 15px;">
                    <span style="border: 2px solid #cbd5e1; color: #334155; padding: 8px 16px; border-radius: 8px; font-weight: bold; font-size: 14px;">តំណាងលក់សរុប: ${allSellers.value?.length || 0} នាក់</span>
                </div>
                <div style="clear: both;"></div>
            </div>
        `;
    }

    let summarySectionHTML = '';
    if (isReport && (pageNum === totalPages || isNativePrint)) {
        const unitsArray = Object.entries(grandTotals.value.all.units);
        let unitRows = '';
        for (let i = 0; i < unitsArray.length; i += 2) {
            const [u1, c1] = unitsArray[i];
            const item2 = unitsArray[i + 1];
            const cell1 = `<td style="width: 50%; padding: 6px 16px 6px 0; vertical-align: top;"><div style="overflow: hidden; border-bottom: 1px dotted #e2e8f0; padding-bottom: 4px;"><span style="color: #475569; font-size: 14px; font-weight: bold; float: left;">${translateUnit(u1)}</span><span style="font-weight: 900; color: #0f172a; font-size: 16px; float: right;">${c1.toLocaleString()}</span><div style="clear: both;"></div></div></td>`;
            const cell2 = item2 ? `<td style="width: 50%; padding: 6px 0 6px 16px; vertical-align: top;"><div style="overflow: hidden; border-bottom: 1px dotted #e2e8f0; padding-bottom: 4px;"><span style="color: #475569; font-size: 14px; font-weight: bold; float: left;">${translateUnit(item2[0])}</span><span style="font-weight: 900; color: #0f172a; font-size: 16px; float: right;">${item2[1].toLocaleString()}</span><div style="clear: both;"></div></div></td>` : `<td style="width: 50%;"></td>`;
            unitRows += `<tr>${cell1}${cell2}</tr>`;
        }
        const unitsTableHTML = unitsArray.length > 0 ? `<table style="width: 100%; border-collapse: collapse; border: none;"><tbody>${unitRows}</tbody></table>` : `<p style="color: #94a3b8; font-size: 14px; margin: 0;">គ្មានទិន្នន័យ</p>`;
        const categoryLabel = activeCategory.value === 'all' ? '' : `- ${activeCategory.value}`;

        summarySectionHTML = `
            <div style="margin-top: 40px; border-top: 2px solid #cbd5e1; padding-top: 30px; overflow: hidden; break-inside: avoid; page-break-inside: avoid; width: 100%; display: table;">
                <div style="display: table-cell; width: 60%; padding-right: 30px; vertical-align: top;">
                    <div style="margin-bottom: 16px; overflow: hidden; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">
                        <h3 style="font-size: 16px; font-weight: 900; color: #1e293b; margin: 0; float: left;">សរុបបរិមាណលក់តាមប្រភេទ ${categoryLabel}</h3>
                        <div style="clear: both;"></div>
                    </div>
                    <div>${unitsTableHTML}</div>
                </div>
                <div style="display: table-cell; width: 40%; vertical-align: top; border-left: 1px solid #e2e8f0; padding-left: 30px;">
                    <div style="margin-bottom: 16px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">
                        <h3 style="font-size: 16px; font-weight: 900; color: #1e293b; margin: 0;">សរុបរួម (Grand Total) ${categoryLabel}</h3>
                    </div>
                    <div>
                        <table style="width: 100%; border-collapse: collapse; border: none;">
                            <tr><td style="padding-bottom: 12px; color: #64748b; font-size: 14px; font-weight: bold;">អតិថិជនសរុប:</td><td style="padding-bottom: 12px; text-align: right; font-weight: 900; color: #0f172a; font-size: 16px;">${grandTotals.value.all.clients.toLocaleString()} នាក់</td></tr>
                            <tr><td style="padding-top: 12px; padding-bottom: 8px; border-top: 1px dashed #cbd5e1; color: #64748b; font-size: 14px; font-weight: bold;">ចំណូល (USD):</td><td style="padding-top: 12px; padding-bottom: 8px; border-top: 1px dashed #cbd5e1; text-align: right; font-weight: 900; color: #059669; font-size: 22px;">${grandTotals.value.all.usd.toLocaleString()} $</td></tr>
                            <tr><td style="padding-top: 4px; color: #64748b; font-size: 14px; font-weight: bold;">ចំណូល (KHR):</td><td style="padding-top: 4px; text-align: right; font-weight: 900; color: #2563eb; font-size: 16px;">${grandTotals.value.all.khr.toLocaleString()} ៛</td></tr>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    const pageStyles = isNativePrint ? `width: 100%; box-sizing: border-box; font-family: 'Kantumruy Pro', 'Battambang', sans-serif; line-height: 1.6; padding: 20px;` : `width: 1000px; min-height: 1414px; background: white; padding: 40px; box-sizing: border-box; font-family: 'Kantumruy Pro', 'Battambang', sans-serif; line-height: 1.6; position: relative;`;
    const titleText = isReport ? 'របាយការណ៍លក់តាមតំណាងលក់' : 'បញ្ជីរាយនាមតំណាងលក់';
    const thHTML = isReport ? `<th style="padding: 16px 10px; width: 5%; text-align: center; border-bottom: 2px solid #cbd5e1;">#</th><th style="padding: 16px 10px; width: 25%; border-bottom: 2px solid #cbd5e1;">តំណាងលក់</th><th style="padding: 16px 10px; width: 20%; border-bottom: 2px solid #cbd5e1;">ប្រភេទ (ទំនិញ)</th><th style="padding: 16px 10px; width: 15%; border-bottom: 2px solid #cbd5e1;">ចំនួនលក់</th><th style="padding: 16px 10px; width: 10%; text-align: center; border-bottom: 2px solid #cbd5e1;">ការលក់</th><th style="padding: 16px 10px; width: 10%; text-align: center; border-bottom: 2px solid #cbd5e1;">អតិថិជនសរុប</th><th style="padding: 16px 10px; width: 15%; text-align: right; border-bottom: 2px solid #cbd5e1;">ចំណូល</th>` : `<th style="padding: 16px 10px; width: 5%; text-align: center; border-bottom: 2px solid #cbd5e1;">#</th><th style="padding: 16px 10px; border-bottom: 2px solid #cbd5e1;">តំណាងលក់</th><th style="padding: 16px 10px; text-align: center; border-bottom: 2px solid #cbd5e1;">អត្តលេខ</th><th style="padding: 16px 10px; text-align: center; border-bottom: 2px solid #cbd5e1;">លេខទូរស័ព្ទ</th>`;

    let contentInner = '';
    if (isNativePrint && isReport) {
        contentInner = `<table style="width: 100%; text-align: left; border-collapse: collapse; background-color: #ffffff;"><thead style="color: #334155; font-size: 13px; font-weight: 900; display: table-header-group; text-transform: uppercase;"><tr>${thHTML}</tr></thead><tbody>${normalRowsHTML}</tbody><tbody style="break-inside: avoid; page-break-inside: avoid;">${lastRowHTML}<tr><td colspan="7" style="padding: 0; border: none;">${summarySectionHTML}</td></tr></tbody></table>`;
    } else {
        contentInner = `<table style="width: 100%; text-align: left; border-collapse: collapse; background-color: #ffffff;"><thead style="color: #334155; font-size: 13px; font-weight: 900; display: table-header-group; text-transform: uppercase;"><tr>${thHTML}</tr></thead><tbody>${normalRowsHTML}${lastRowHTML}</tbody></table>${summarySectionHTML}`;
    }

    return `
        <div class="print-page" style="${pageStyles}">
            <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px;">
                <h1 style="font-size: 28px; font-weight: 900; color: #1e293b; margin: 0; text-transform: uppercase;">${titleText}</h1>
            </div>
            ${adminHeaderHTML}
            <div style="flex: 1;">${contentInner}</div>
            <div style="margin-top: 40px; padding-top: 15px; border-top: 1px solid #e2e8f0; font-size: 12px; font-weight: bold; color: #94a3b8; overflow: hidden;">
                <div style="float: left;"><span style="color: #475569; font-size: 14px; font-weight: 900;">កាលបរិច្ឆេទ: ${reportDateLabel.value}</span> &nbsp;&nbsp;|&nbsp;&nbsp;ថ្ងៃបញ្ចេញរបាយការណ៍: ${new Date().toLocaleString('km-KH')}</div>
                <div style="float: right;">${isNativePrint ? '' : `ទំព័រទី ${pageNum} នៃ ${totalPages}`}</div><div style="clear: both;"></div>
            </div>
        </div>
    `;
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;500;600;700&family=Battambang:wght@400;700;900&display=swap');
.font-khmer { font-family: 'Kantumruy Pro', 'Battambang', sans-serif; }
.animate-fade-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in-up { animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
@media print { .print\:hidden { display: none !important; } }
</style>

