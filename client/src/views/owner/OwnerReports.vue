<template>
  <div class="print-container">
    <div class="font-khmer h-[100dvh] flex flex-col relative bg-[#F4F7FE] overflow-hidden print:hidden">
      
      <OwnerReportHeader 
        v-model:dateFilterType="dateFilterType"
        v-model:selectedDate="selectedDate"
        v-model:selectedMonth="selectedMonth"
        v-model:selectedYear="selectedYear"
        v-model:customStart="customStart"
        v-model:customEnd="customEnd"
        :availableYears="availableYears"
        :availableMonths="availableMonths"
        :isLoading="isLoading"
      />

      <div class="flex-1 overflow-y-auto custom-scrollbar scroll-smooth relative pb-40">
         <div class="px-4 md:px-8 py-6 max-w-[90rem] mx-auto w-full">
           
           <OwnerReportSummaryCards 
              :grandTotals="grandTotals"
              :activeCategory="activeCategory"
              :activeAdminsCount="activeAdminsCount"
              :inactiveAdminsCount="inactiveAdminsCount"
           />

           <OwnerReportAdminList 
              :displayedData="displayedData"
              :isLoading="isLoading"
              :unitSettings="unitSettings"
              v-model:activeCategory="activeCategory"
              v-model:activityFilter="activityFilter"
              @print="executeNativePrint"
              @pdf="generatePDF"
           />

         </div>
      </div>

      <OwnerReportBottomSummary 
         v-if="displayedData.length > 0 && activityFilter !== 'inactive'"
         :grandTotals="grandTotals"
         :unitSettings="unitSettings"
      />

    </div>

    <transition enter-active-class="duration-300 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="processing.active" class="fixed inset-0 z-[99999] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
            <div class="w-full max-w-sm bg-[#18181b] border border-white/10 rounded-3xl p-10 shadow-2xl relative flex flex-col items-center text-center animate-fade-in-up">
                <div class="relative w-20 h-20 mb-8">
                    <div class="absolute inset-0 rounded-full border-4 border-white/5"></div>
                    <div class="absolute inset-0 rounded-full border-4 border-t-rose-500 border-r-rose-500 border-b-transparent border-l-transparent animate-spin"></div>
                    <div class="absolute inset-0 flex items-center justify-center font-bold text-white text-lg font-mono">{{ processing.progress }}%</div>
                </div>
                <h3 class="text-xl font-bold text-white mb-2">{{ processing.message }}</h3>
                <div class="w-full h-1.5 bg-black/50 rounded-full overflow-hidden border border-white/5">
                    <div class="h-full bg-gradient-to-r from-red-500 to-rose-600 transition-all duration-300 ease-out" :style="{ width: `${processing.progress}%` }"></div>
                </div>
            </div>
        </div>
    </transition>

    <div ref="printStaging" class="fixed top-0 left-[-9999px] pointer-events-none z-[-1]"></div>

    <CustomAlert 
       v-if="alert.show" 
       :type="alert.type" 
       :title="alert.title" 
       :message="alert.message" 
       @close="alert.show = false" 
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick, reactive } from 'vue';
import { db, auth } from '@/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

// 📦 ការនាំចូល Components ទាំង ៤ (Child Components)
import OwnerReportHeader from './report/OwnerReportHeader.vue';
import OwnerReportSummaryCards from './report/OwnerReportSummaryCards.vue';
import OwnerReportAdminList from './report/OwnerReportAdminList.vue';
import OwnerReportBottomSummary from './report/OwnerReportBottomSummary.vue';
import CustomAlert from '@/components/shared/CustomAlert.vue'; // ផ្លាស់ប្តូរ Path ទៅតាម Project របស់អ្នក

// --- STATE ---
const isLoading = ref(true);
const adminName = ref('Owner');
const adminsList = ref([]);
const allSales = ref([]); 
const allSellers = ref([]); 
const unitSettings = ref([]); 

// --- FILTERS STATE ---
const activeCategory = ref('all'); 
const dateFilterType = ref('monthly'); 
const activityFilter = ref('all'); 
const selectedDate = ref(new Date().toISOString().split('T')[0]);
const selectedYear = ref(new Date().getFullYear());
const selectedMonth = ref(new Date().getMonth());
const customStart = ref(new Date().toISOString().split('T')[0]);
const customEnd = ref(new Date().toISOString().split('T')[0]);

const printStaging = ref(null);
const processing = ref({ active: false, message: '', progress: 0 });
const monthNames = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'];

const alert = reactive({ show: false, title: '', message: '', type: 'success' });
const triggerAlert = (type, title, message) => {
  alert.type = type; alert.title = title; alert.message = message; alert.show = true;
  setTimeout(() => alert.show = false, 3000);
};

// --- DATA FETCHING ---
onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
       adminName.value = user.displayName || 'Owner';
       try {
          // ទាញយក Admin ទាំងអស់
          const adminQ = query(collection(db, 'users'), where('role', '==', 'admin'));
          const adminSnap = await getDocs(adminQ);
          adminsList.value = adminSnap.docs
              .map(doc => ({ id: doc.id, ...doc.data() }))
              .filter(a => a.isDeleted === false || a.isDeleted === "false" || !a.isDeleted);

          // ទាញយករបាយការណ៍លក់ទាំងអស់
          const salesSnap = await getDocs(collection(db, 'sales_reports'));
          allSales.value = salesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

          // ទាញយក Seller ទាំងអស់
          const sellerQ = query(collection(db, 'users'), where('role', '==', 'seller'));
          const sellerSnap = await getDocs(sellerQ);
          allSellers.value = sellerSnap.docs
              .map(doc => ({ id: doc.id, ...doc.data() }))
              .filter(s => s.isDeleted === false || s.isDeleted === "false" || !s.isDeleted);

          // ទាញយកការកំណត់ខ្នាត
          const unitSettingsSnap = await getDocs(collection(db, 'settings_units'));
          unitSettings.value = unitSettingsSnap.docs.map(doc => doc.data());

          // កំណត់ថ្ងៃខែ Default ទៅកាន់ថ្ងៃដែលមានការលក់ចុងក្រោយគេ
          if (allSales.value.length > 0) {
             const validSales = allSales.value.filter(s => s.createdAt || s.date);
             if (validSales.length > 0) {
                 const latestDate = validSales.map(s => new Date(s.createdAt || s.date)).sort((a,b) => b - a)[0];
                 selectedYear.value = latestDate.getFullYear();
                 selectedMonth.value = latestDate.getMonth();
                 selectedDate.value = latestDate.toISOString().split('T')[0];
             }
          }
       } catch (error) {
          console.error("Error", error);
       } finally {
          isLoading.value = false;
       }
    }
  });
});

// --- DATE FILTER COMPUTED ---
const availableYears = computed(() => {
    if (allSales.value.length === 0) return [new Date().getFullYear()];
    const years = new Set(allSales.value.map(s => new Date(s.createdAt || s.date).getFullYear()));
    return Array.from(years).sort((a, b) => b - a);
});

const availableMonths = computed(() => {
    if (allSales.value.length === 0) return [{ index: new Date().getMonth(), name: monthNames[new Date().getMonth()] }];
    const yearSales = allSales.value.filter(s => new Date(s.createdAt || s.date).getFullYear() === parseInt(selectedYear.value));
    const months = new Set(yearSales.map(s => new Date(s.createdAt || s.date).getMonth()));
    return Array.from(months).sort((a, b) => a - b).map(mIndex => ({ index: mIndex, name: monthNames[mIndex] }));
});

watch(selectedYear, () => {
    const months = availableMonths.value;
    if (!months.find(m => m.index === selectedMonth.value)) {
        if(months.length > 0) selectedMonth.value = months[months.length - 1].index;
    }
});

const isDateInScope = (dateStr) => {
   if(!dateStr) return false;
   const date = new Date(dateStr);
   const dYear = date.getFullYear();
   const dMonth = date.getMonth();
   const dDateStr = date.toISOString().split('T')[0]; 
   
   if (dateFilterType.value === 'daily') return dDateStr === selectedDate.value;
   if (dateFilterType.value === 'monthly') return dMonth === parseInt(selectedMonth.value) && dYear === parseInt(selectedYear.value);
   if (dateFilterType.value === 'yearly') return dYear === parseInt(selectedYear.value);
   if (dateFilterType.value === 'custom') return dDateStr >= customStart.value && dDateStr <= customEnd.value;
   return false;
};

// --- CORE CALCULATION LOGIC ---
const baseCalculatedData = computed(() => {
   if (adminsList.value.length === 0) return [];
   let rows = [];

   adminsList.value.forEach(admin => {
      const adminSellersIds = allSellers.value.filter(seller => seller.createdBy === admin.id).map(s => s.id);

      // រកវិក្កយបត្រដែលទាក់ទងនឹង Admin នេះ និងមិនត្រូវជាវិក្កយបត្រដែលបាន Cancel
      const relevantSales = allSales.value.filter(s => {
          const isMatch = s.createdBy === admin.id || adminSellersIds.includes(s.createdBy) || adminSellersIds.includes(s.uid);
          const isValid = s.paymentStatus !== 'CANCELED';
          return isMatch && isValid && isDateInScope(s.createdAt || s.date);
      });

      const retailSales = relevantSales.filter(s => {
          return !s.items || s.items.some(item => (item.type || 'retail') !== 'wholesale');
      });
      const wholesaleSales = relevantSales.filter(s => {
          return s.items && s.items.some(item => item.type === 'wholesale');
      });

      const createRow = (catName, salesList) => {
         let totalClients = salesList.length; // រាប់ចំនួនវិក្កយបត្រជាអតិថិជន
         let revenueUSD = 0;
         let revenueKHR = 0;
         let unitCounts = {}; 

         salesList.forEach(sale => {
             // បូកចំណូល
             if (sale.currency === 'USD') revenueUSD += Number(sale.totalAmount || 0);
             else revenueKHR += Number(sale.totalAmount || 0);

             // បូកចំនួនទំនិញ
             if(sale.items && sale.items.length > 0) {
                 sale.items.forEach(item => {
                     const u = (item.unit || 'unknown').toLowerCase().trim();
                     if (!unitCounts[u]) unitCounts[u] = 0;
                     unitCounts[u] += Number(item.qty || 0);
                 });
             }
         });

         const hasSales = salesList.length > 0;
         const totalSellersCount = adminSellersIds.length;
         
         rows.push({ 
             ...admin, 
             uniqueId: `${admin.id}_${catName === 'all' ? 'none' : catName}`, 
             originalAdminId: admin.id, 
             category: catName,
             unitCounts, 
             totalClients, 
             revenueUSD, 
             revenueKHR, 
             hasSales, 
             totalSellersCount 
         });
      };

      if (activeCategory.value === 'all') {
          if (retailSales.length > 0) createRow('លក់រាយ', retailSales);
          if (wholesaleSales.length > 0) createRow('បោះដុំ', wholesaleSales);
          if (retailSales.length === 0 && wholesaleSales.length === 0) {
              createRow('-', []); 
          }
      } else if (activeCategory.value === 'លក់រាយ') {
          createRow('លក់រាយ', retailSales);
      } else if (activeCategory.value === 'បោះដុំ') {
          createRow('បោះដុំ', wholesaleSales);
      }
   });

   return rows.sort((a, b) => {
       if (a.hasSales && !b.hasSales) return -1;
       if (!a.hasSales && b.hasSales) return 1;
       return (b.revenueUSD + (b.revenueKHR/4000)) - (a.revenueUSD + (a.revenueKHR/4000));
   }); 
});

const activeAdminsCount = computed(() => new Set(baseCalculatedData.value.filter(a => a.hasSales).map(a => a.originalAdminId)).size);
const inactiveAdminsCount = computed(() => new Set(baseCalculatedData.value.filter(a => !a.hasSales).map(a => a.originalAdminId)).size);

const displayedData = computed(() => {
    if (activityFilter.value === 'active') return baseCalculatedData.value.filter(a => a.hasSales);
    if (activityFilter.value === 'inactive') return baseCalculatedData.value.filter(a => !a.hasSales);
    return baseCalculatedData.value;
});

const grandTotals = computed(() => {
    let stats = {
        all: { usd: 0, khr: 0, clients: 0, totalUnitsCount: 0, units: {} },
        retail: { usd: 0, khr: 0, clients: 0, totalUnitsCount: 0, units: {} },
        wholesale: { usd: 0, khr: 0, clients: 0, totalUnitsCount: 0, units: {} }
    };

    baseCalculatedData.value.forEach(row => {
        if(row.hasSales) {
            const cat = row.category === 'បោះដុំ' ? 'wholesale' : 'retail';
            
            stats.all.clients += row.totalClients;
            stats.all.usd += row.revenueUSD;
            stats.all.khr += row.revenueKHR;
            
            stats[cat].clients += row.totalClients;
            stats[cat].usd += row.revenueUSD;
            stats[cat].khr += row.revenueKHR;

            for (const [unit, count] of Object.entries(row.unitCounts)) {
                if(count > 0) {
                    stats.all.units[unit] = (stats.all.units[unit] || 0) + count;
                    stats.all.totalUnitsCount += count;
                    
                    stats[cat].units[unit] = (stats[cat].units[unit] || 0) + count;
                    stats[cat].totalUnitsCount += count;
                }
            }
        }
    });

    return stats;
});

// --- HELPER FUNCTIONS FOR PRINT/PDF ---
const reportDateLabel = computed(() => {
   const categoryName = activeCategory.value === 'all' ? 'សរុប (All)' : activeCategory.value;
   let dateStr = '';
   if (dateFilterType.value === 'daily') dateStr = new Intl.DateTimeFormat('km-KH', { dateStyle: 'long' }).format(new Date(selectedDate.value));
   if (dateFilterType.value === 'monthly') dateStr = `ខែ ${monthNames[selectedMonth.value]} ឆ្នាំ ${selectedYear.value}`;
   if (dateFilterType.value === 'yearly') dateStr = `ឆ្នាំ ${selectedYear.value}`;
   if (dateFilterType.value === 'custom') dateStr = `${selectedDateFormatter(customStart.value)} ដល់ ${selectedDateFormatter(customEnd.value)}`;
   return `${dateStr} - ${categoryName}`;
});

const selectedDateFormatter = (dateStr) => {
    if(!dateStr) return '';
    return new Intl.DateTimeFormat('km-KH', { dateStyle: 'medium' }).format(new Date(dateStr));
};

const translateUnit = (unitVal) => {
    if (!unitVal) return '';
    const safeVal = String(unitVal);
    const found = unitSettings.value.find(u => String(u.value) === safeVal);
    if (found) return found.label;
    const u = safeVal.toLowerCase().trim();
    if (u === 'bottle' || u === 'bottles') return 'ដប';
    if (u === 'pack' || u === 'packs') return 'កញ្ចប់';
    return safeVal; 
};

// --- NATIVE PRINT LOGIC ---
const executeNativePrint = () => {
    const dataWithIndex = displayedData.value.map((item, idx) => ({ ...item, printIndex: idx + 1 }));
    const contentHTML = generatePageHTML(dataWithIndex, 1, 1, true);
    triggerPrint(contentHTML, `Master_Sales_Report_${dateFilterType.value}`);
};

const triggerPrint = (htmlContent, title) => {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
        <html>
        <head>
            <title>${title}</title>
            <link href="https://fonts.googleapis.com/css2?family=Battambong:wght@400;700;900&display=swap" rel="stylesheet">
            <style>
                @page { size: A4 portrait; margin: 0; }
                body { 
                    font-family: 'Battambong', sans-serif; 
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                    margin: 0; padding: 15mm;
                    background-color: white;
                }
                table { width: 100%; border-collapse: collapse; }
                tr    { page-break-inside: avoid; page-break-after: auto; }
                thead { display: table-header-group; }
            </style>
        </head>
        <body>${htmlContent}</body>
        </html>
    `);
    doc.close();

    iframe.contentWindow.document.fonts.ready.then(() => {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
        setTimeout(() => { document.body.removeChild(iframe); }, 1000);
    });
};

// --- PDF GENERATION LOGIC ---
const generatePDF = async () => {
    processing.value = { active: true, message: 'កំពុងបំបែកទិន្នន័យ...', progress: 10 };
    
    try {
        const pages = [];
        let currentPage = [];
        const MAX_PAGE_HEIGHT = 1250; 
        const PAGE_TITLE_HEIGHT = 150; 
        const TABLE_HEADER_HEIGHT = 65;
        
        let grandTotalUnitCount = Object.keys(grandTotals.value.all.units || {}).length;
        let FOOTER_HEIGHT = 220 + (Math.ceil(grandTotalUnitCount / 2) * 50);
        if (activeCategory.value === 'all') FOOTER_HEIGHT += 140; 

        let currentHeight = PAGE_TITLE_HEIGHT + TABLE_HEADER_HEIGHT; 
        let rowCounter = 1;
        let allRows = [...displayedData.value];

        for (let i = 0; i < allRows.length; i++) {
            let row = allRows[i];
            let unitCount = row.hasSales && row.unitCounts ? Object.values(row.unitCounts).filter(c => c > 0).length : 0;
            let rowHeight = 90 + (Math.ceil(unitCount / 2) * 45); 

            if (currentHeight + rowHeight > MAX_PAGE_HEIGHT && currentPage.length > 0) {
                pages.push(currentPage);
                currentPage = [];
                currentHeight = 60 + TABLE_HEADER_HEIGHT; 
            }
            
            currentPage.push({ ...row, printIndex: rowCounter++ });
            currentHeight += rowHeight;
        }

        if (currentHeight + FOOTER_HEIGHT > MAX_PAGE_HEIGHT) {
            if (currentPage.length > 1) {
                let stolenRow = currentPage.pop();
                pages.push(currentPage);
                currentPage = [stolenRow]; 
            } else if (currentPage.length === 1) {
                pages.push(currentPage);
                currentPage = []; 
            }
        }
        
        if (currentPage.length === 0 && pages.length > 0) {
            let prevPage = pages[pages.length - 1];
            if (prevPage.length > 1) currentPage.push(prevPage.pop());
        }

        if (currentPage.length > 0 || allRows.length === 0) pages.push(currentPage);

        const pdf = new jsPDF('p', 'mm', 'a4'); 
        const pdfWidth = 210; 
        const pdfHeightA4 = 297;
        
        for (let i = 0; i < pages.length; i++) {
            processing.value.message = `កំពុងថតចម្លងទំព័រទី ${i+1} នៃ ${pages.length}...`;
            printStaging.value.innerHTML = generatePageHTML(pages[i], i + 1, pages.length, false);
            
            await nextTick(); 
            await document.fonts.ready;
            await new Promise(r => setTimeout(r, 600)); 

            const canvas = await html2canvas(printStaging.value.querySelector('.print-page'), { 
                scale: 2, useCORS: true, logging: false, backgroundColor: "#ffffff", windowWidth: 1000
            });
            
            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            if (i > 0) pdf.addPage();
            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeightA4);
            processing.value.progress = 10 + Math.round(((i + 1) / pages.length) * 80);
        }

        processing.value.message = 'កំពុងរក្សាទុកឯកសារ...';
        processing.value.progress = 100;
        pdf.save(`Master_Sales_Report_${dateFilterType.value}.pdf`);
        
    } catch(e) {
        triggerAlert('error', 'បរាជ័យ', 'មិនអាចទាញយក PDF បានទេ');
    } finally {
        if(printStaging.value) printStaging.value.innerHTML = '';
        processing.value.active = false;
    }
};

const generatePageHTML = (rows, pageNum, totalPages, isNativePrint = false) => {
    let normalRows = rows;
    let lastRow = null;

    if (isNativePrint && rows.length > 0) {
        normalRows = rows.slice(0, rows.length - 1);
        lastRow = rows[rows.length - 1];
    }

    const renderRow = (item) => {
        let salesHTML = '';
        if (item.hasSales) {
            salesHTML = `<div style="overflow: hidden;">` + 
                Object.entries(item.unitCounts || {}).filter(([u, c]) => c > 0).map(([u, c]) => 
                    `<div style="float: left; margin: 0 12px 6px 0;">
                        <span style="font-weight: 900; color: #1e293b; font-size: 14px;">${c.toLocaleString()}</span>
                        <span style="color: #64748b; font-size: 12px; font-weight: bold; margin-left: 4px;">${translateUnit(u)}</span>
                     </div>`
                ).join('') + `<div style="clear: both;"></div></div>`;
        } else {
            salesHTML = `<span style="font-size: 13px; font-weight: bold; color: #94a3b8;">គ្មានការលក់</span>`;
        }

        let revenueHTML = item.hasSales ? `
            <div style="text-align: right;">
                <span style="color:#059669; font-size:16px; font-weight:900; display: inline-block;">${item.revenueUSD.toLocaleString()} $</span><br/>
                <span style="color:#2563eb; font-size:13px; font-weight:bold; display: inline-block; margin-top: 2px;">${item.revenueKHR.toLocaleString()} ៛</span>
            </div>` : `<div style="text-align: right; color:#94a3b8; font-weight:bold; font-size:14px;">-</div>`;

        const catBadge = item.category === 'បោះដុំ' ? `<span style="color: #7e22ce; font-size: 13px; font-weight: bold;">បោះដុំ</span>` : `<span style="color: #475569; font-size: 13px; font-weight: bold;">លក់រាយ</span>`;

        return `
            <tr style="break-inside: avoid; page-break-inside: avoid; border-bottom: 1px dashed #e2e8f0;">
                <td style="padding: 16px 10px; text-align: center; vertical-align: top; font-weight: 900; color: #94a3b8; font-size: 14px;">${item.printIndex}</td>
                <td style="padding: 16px 10px; vertical-align: top;"><p style="font-weight: bold; color: #1e293b; font-size: 16px; margin: 0;">${item.fullName}</p></td>
                <td style="padding: 16px 10px; vertical-align: top; text-align: center;">${item.hasSales ? catBadge : '-'}</td>
                <td style="padding: 16px 10px; text-align: center; vertical-align: top; font-weight: bold; color: #334155; font-size: 16px;">${item.totalSellersCount}</td>
                <td style="padding: 16px 10px; vertical-align: top;">${salesHTML}</td>
                <td style="padding: 16px 10px; text-align: center; vertical-align: top; font-weight: bold; color: #334155; font-size: 16px;">${item.hasSales ? item.totalClients.toLocaleString() + ' នាក់' : '-'}</td>
                <td style="padding: 16px 10px; vertical-align: top;">${revenueHTML}</td>
            </tr>
        `;
    };

    const normalRowsHTML = normalRows.map(renderRow).join('');
    const lastRowHTML = lastRow ? renderRow(lastRow) : '';

    let summarySectionHTML = '';
    if (pageNum === totalPages || isNativePrint) {
        const unitsArray = Object.entries(grandTotals.value.all.units || {});
        let unitRows = '';
        for (let i = 0; i < unitsArray.length; i += 2) {
            const [u1, c1] = unitsArray[i];
            const item2 = unitsArray[i + 1];
            
            const cell1 = `<td style="width: 50%; padding: 6px 16px 6px 0; vertical-align: top;"><div style="overflow: hidden; border-bottom: 1px dotted #e2e8f0; padding-bottom: 4px;"><span style="color: #475569; font-size: 14px; font-weight: bold; float: left;">${translateUnit(u1)}</span><span style="font-weight: 900; color: #0f172a; font-size: 16px; float: right;">${c1.toLocaleString()}</span></div></td>`;
            const cell2 = item2 ? `<td style="width: 50%; padding: 6px 0 6px 16px; vertical-align: top;"><div style="overflow: hidden; border-bottom: 1px dotted #e2e8f0; padding-bottom: 4px;"><span style="color: #475569; font-size: 14px; font-weight: bold; float: left;">${translateUnit(item2[0])}</span><span style="font-weight: 900; color: #0f172a; font-size: 16px; float: right;">${item2[1].toLocaleString()}</span></div></td>` : `<td style="width: 50%;"></td>`;
                
            unitRows += `<tr>${cell1}${cell2}</tr>`;
        }
        
        const unitsTableHTML = unitsArray.length > 0 ? `<table style="width: 100%; border-collapse: collapse; border: none;"><tbody>${unitRows}</tbody></table>` : `<p style="color: #94a3b8; font-size: 14px; margin: 0;">គ្មានទិន្នន័យ</p>`;

        let breakdownHTML = '';
        if (activeCategory.value === 'all') {
            breakdownHTML = `
                <div style="margin-top: 20px; border-top: 1px solid #cbd5e1; padding-top: 20px; overflow: hidden; width: 100%;">
                    <div style="float: left; width: 48%; box-sizing: border-box; padding-right: 10px;">
                        <p style="font-size: 12px; color: #64748b; font-weight: 900; margin: 0 0 8px 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">លក់រាយ (RETAIL)</p>
                        <p style="margin: 0; font-size: 18px; font-weight: 900; color: #059669;">${grandTotals.value.retail.usd.toLocaleString()} $</p>
                        <p style="margin: 4px 0 0 0; font-size: 14px; font-weight: bold; color: #2563eb;">${grandTotals.value.retail.khr.toLocaleString()} ៛</p>
                    </div>
                    <div style="float: right; width: 48%; box-sizing: border-box; padding-left: 10px; border-left: 1px dashed #cbd5e1;">
                        <p style="font-size: 12px; color: #64748b; font-weight: 900; margin: 0 0 8px 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">បោះដុំ (WHOLESALE)</p>
                        <p style="margin: 0; font-size: 18px; font-weight: 900; color: #059669;">${grandTotals.value.wholesale.usd.toLocaleString()} $</p>
                        <p style="margin: 4px 0 0 0; font-size: 14px; font-weight: bold; color: #2563eb;">${grandTotals.value.wholesale.khr.toLocaleString()} ៛</p>
                    </div>
                </div>`;
        }

        const categoryLabel = activeCategory.value === 'all' ? '' : `- ${activeCategory.value}`;

        summarySectionHTML = `
            <div style="margin-top: 40px; border-top: 2px solid #cbd5e1; padding-top: 30px; overflow: hidden; break-inside: avoid; page-break-inside: avoid; width: 100%; display: table;">
                <div style="display: table-cell; width: 60%; padding-right: 30px; vertical-align: top;">
                    <div style="margin-bottom: 16px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;"><h3 style="font-size: 16px; font-weight: 900; margin: 0;">សរុបបរិមាណលក់ ${categoryLabel}</h3></div>
                    <div>${unitsTableHTML}</div>
                </div>
                <div style="display: table-cell; width: 40%; vertical-align: top; border-left: 1px solid #e2e8f0; padding-left: 30px;">
                    <div style="margin-bottom: 16px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;"><h3 style="font-size: 16px; font-weight: 900; margin: 0;">សរុបរួម (Grand Total)</h3></div>
                    <div>
                        <table style="width: 100%; border-collapse: collapse; border: none;">
                            <tr><td style="padding-bottom: 12px; color: #64748b; font-size: 14px; font-weight: bold;">អតិថិជនសរុប:</td><td style="padding-bottom: 12px; text-align: right; font-weight: 900; font-size: 16px;">${grandTotals.value.all.clients.toLocaleString()} នាក់</td></tr>
                            <tr><td style="padding-top: 12px; border-top: 1px dashed #cbd5e1; color: #64748b; font-size: 14px; font-weight: bold;">ចំណូល (USD):</td><td style="padding-top: 12px; border-top: 1px dashed #cbd5e1; text-align: right; font-weight: 900; color: #059669; font-size: 22px;">${grandTotals.value.all.usd.toLocaleString()} $</td></tr>
                            <tr><td style="padding-top: 4px; color: #64748b; font-size: 14px; font-weight: bold;">ចំណូល (KHR):</td><td style="padding-top: 4px; text-align: right; font-weight: 900; color: #2563eb; font-size: 16px;">${grandTotals.value.all.khr.toLocaleString()} ៛</td></tr>
                        </table>
                        ${breakdownHTML}
                    </div>
                </div>
            </div>`;
    }

    let finalContentHTML = '';
    if (rows.length > 0) {
        if (isNativePrint) {
            finalContentHTML = `<table style="width: 100%; text-align: left; border-collapse: collapse;"><thead style="color: #334155; font-size: 13px; font-weight: 900; display: table-header-group;"><tr><th style="padding: 16px 10px; width: 5%; text-align: center; border-bottom: 2px solid #cbd5e1;">#</th><th style="padding: 16px 10px; width: 22%; border-bottom: 2px solid #cbd5e1;">អ្នកគ្រប់គ្រង</th><th style="padding: 16px 10px; width: 10%; border-bottom: 2px solid #cbd5e1; text-align: center;">ប្រភេទ</th><th style="padding: 16px 10px; width: 12%; border-bottom: 2px solid #cbd5e1; text-align: center;">តំណាងលក់</th><th style="padding: 16px 10px; width: 23%; border-bottom: 2px solid #cbd5e1;">ចំនួនលក់ (Units)</th><th style="padding: 16px 10px; width: 10%; text-align: center; border-bottom: 2px solid #cbd5e1;">អតិថិជន</th><th style="padding: 16px 10px; width: 18%; text-align: right; border-bottom: 2px solid #cbd5e1;">ចំណូល</th></tr></thead><tbody>${normalRowsHTML}</tbody><tbody style="break-inside: avoid;">${lastRowHTML}<tr><td colspan="7" style="padding: 0; border: none;">${summarySectionHTML}</td></tr></tbody></table>`;
        } else {
            finalContentHTML = `<table style="width: 100%; text-align: left; border-collapse: collapse;"><thead style="color: #334155; font-size: 13px; font-weight: 900; display: table-header-group;"><tr><th style="padding: 16px 10px; width: 5%; text-align: center; border-bottom: 2px solid #cbd5e1;">#</th><th style="padding: 16px 10px; width: 22%; border-bottom: 2px solid #cbd5e1;">អ្នកគ្រប់គ្រង</th><th style="padding: 16px 10px; width: 10%; border-bottom: 2px solid #cbd5e1; text-align: center;">ប្រភេទ</th><th style="padding: 16px 10px; width: 12%; border-bottom: 2px solid #cbd5e1; text-align: center;">តំណាងលក់</th><th style="padding: 16px 10px; width: 23%; border-bottom: 2px solid #cbd5e1;">ចំនួនលក់ (Units)</th><th style="padding: 16px 10px; width: 10%; text-align: center; border-bottom: 2px solid #cbd5e1;">អតិថិជន</th><th style="padding: 16px 10px; width: 18%; text-align: right; border-bottom: 2px solid #cbd5e1;">ចំណូល</th></tr></thead><tbody>${normalRowsHTML}${lastRowHTML}</tbody></table>${summarySectionHTML}`;
        }
    } else {
        finalContentHTML = summarySectionHTML;
    }

    const pageStyles = isNativePrint
        ? `width: 100%; box-sizing: border-box; font-family: 'Battambong', sans-serif; line-height: 1.6; padding: 20px;`
        : `width: 1000px; height: 1414px; background: white; padding: 40px; box-sizing: border-box; display: flex; flex-direction: column; font-family: 'Battambong', sans-serif; line-height: 1.6; position: relative; overflow: hidden;`;

    const mainTitle = pageNum === 1 || isNativePrint 
        ? `<div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #e2e8f0;"><h1 style="font-size: 28px; font-weight: 900; margin: 0; text-transform: uppercase;">របាយការណ៍លក់សរុបអ្នកគ្រប់គ្រង</h1></div>` : '';

    return `
        <div class="print-page" style="${pageStyles}">
            ${mainTitle}
            <div style="flex: 1;">${finalContentHTML}</div>
            <div style="position: absolute; bottom: 40px; left: 40px; right: 40px; border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 12px; font-weight: bold; color: #94a3b8; overflow: hidden;">
                <div style="float: left;">កាលបរិច្ឆេទ: ${reportDateLabel.value} &nbsp;|&nbsp; ដោយ: ${adminName.value}</div>
                <div style="float: right;">${isNativePrint ? '' : `ទំព័រទី ${pageNum} នៃ ${totalPages}`}</div>
            </div>
        </div>
    `;
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
.animate-fade-in-up { animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
@media print { .print\:hidden { display: none !important; } }
</style>