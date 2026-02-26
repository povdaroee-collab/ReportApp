<template>
  <div class="font-khmer relative print-container print:bg-white">
    
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-32 opacity-60 print:hidden">
       <div class="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-indigo-600 mb-4"></div>
       <p class="text-slate-500 font-bold">កំពុងទាញយកទិន្នន័យ និងគណនាថ្លៃដើម (បំបែកកេះទៅជាដប)...</p>
    </div>

    <div v-else class="space-y-6 print:hidden">
        
        <div class="bg-white p-4 rounded-[1.5rem] border border-slate-200 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-20">
            
            <div class="flex flex-wrap items-center gap-3">
                <div class="flex items-center gap-2 text-slate-500 font-bold text-sm bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                    <svg class="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    ចម្រោះ៖
                </div>
                
                <div class="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                    <button @click="dateFilterType = 'today'" :class="dateFilterType === 'today' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:text-indigo-600'" class="py-1.5 px-4 rounded-lg font-bold text-sm transition-all">ថ្ងៃនេះ</button>
                    <button @click="dateFilterType = 'monthly'" :class="dateFilterType === 'monthly' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:text-indigo-600'" class="py-1.5 px-4 rounded-lg font-bold text-sm transition-all">ខែនេះ</button>
                    <button @click="dateFilterType = 'yearly'" :class="dateFilterType === 'yearly' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:text-indigo-600'" class="py-1.5 px-4 rounded-lg font-bold text-sm transition-all">ឆ្នាំនេះ</button>
                    <button @click="dateFilterType = 'custom'" :class="dateFilterType === 'custom' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:text-indigo-600'" class="py-1.5 px-4 rounded-lg font-bold text-sm transition-all">ជ្រើសរើស</button>
                </div>

                <div v-if="dateFilterType === 'custom'" class="flex items-center gap-2 animate-fade-in pl-2 lg:border-l border-slate-200">
                    <input type="date" v-model="customStart" class="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-sm font-bold text-slate-700 outline-none focus:border-indigo-500">
                    <span class="text-slate-400 font-bold">-</span>
                    <input type="date" v-model="customEnd" class="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-sm font-bold text-slate-700 outline-none focus:border-indigo-500">
                </div>
            </div>

            <div class="flex items-center gap-3 w-full lg:w-auto">
                <button @click="executePrint" class="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-700 transition-colors shadow-sm">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                    Print
                </button>
                <button @click="generatePDF" class="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-rose-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-rose-600 transition-colors shadow-sm">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    ទាញ PDF
                </button>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div class="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden">
                <div class="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full -mr-4 -mt-4"></div>
                <div class="flex items-center gap-4 mb-4 relative z-10">
                    <div class="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100">
                        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <div>
                        <p class="text-sm font-bold text-slate-500">ចំណូលសរុប (Gross Revenue)</p>
                        <p class="text-xs text-slate-400 mt-0.5">លុយទទួលបានពីការលក់</p>
                    </div>
                </div>
                <div class="flex items-end gap-2 relative z-10">
                    <h2 class="text-3xl font-black text-slate-800">{{ summary.totalRevenueUSD.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 3}) }} $</h2>
                    <span v-if="summary.totalRevenueKHR > 0" class="text-lg font-bold text-blue-600 mb-1"> / {{ summary.totalRevenueKHR.toLocaleString() }} ៛</span>
                </div>
            </div>

            <div class="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden">
                <div class="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-bl-full -mr-4 -mt-4"></div>
                <div class="flex items-center gap-4 mb-4 relative z-10">
                    <div class="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center border border-rose-100">
                        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                    </div>
                    <div>
                        <p class="text-sm font-bold text-slate-500">ថ្លៃដើមសរុប (Total Cost)</p>
                        <p class="text-[10px] text-rose-400">ទាញយកពីស្តុកទំនិញ (គិតរាយ)</p>
                    </div>
                </div>
                <div class="flex items-end gap-2 relative z-10">
                    <h2 class="text-3xl font-black text-slate-800">{{ summary.totalCostUSD.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 3}) }} $</h2>
                    <span v-if="summary.totalCostKHR > 0" class="text-lg font-bold text-rose-600 mb-1"> / {{ summary.totalCostKHR.toLocaleString() }} ៛</span>
                </div>
            </div>

            <div class="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-200 shadow-sm relative overflow-hidden">
                <div class="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-bl-full -mr-4 -mt-4"></div>
                <div class="flex items-center gap-4 mb-4 relative z-10">
                    <div class="w-14 h-14 bg-white text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm">
                        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                    </div>
                    <div>
                        <p class="text-sm font-bold text-emerald-700">ចំណេញសុទ្ធ (Net Profit)</p>
                        <p class="text-[10px] text-emerald-600">ចំណូល ដក ថ្លៃដើម</p>
                    </div>
                </div>
                <div class="flex items-end gap-2 relative z-10">
                    <h2 class="text-4xl font-black text-emerald-600">{{ summary.netProfitUSD.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 3}) }} $</h2>
                    <span v-if="summary.netProfitKHR > 0" class="text-lg font-bold text-emerald-700 mb-1"> / {{ summary.netProfitKHR.toLocaleString() }} ៛</span>
                </div>
            </div>
        </div>

        <div class="space-y-4">
            
            <div class="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center">
                <div class="pl-4 pr-2 text-slate-400">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input 
                    v-model="searchQuery" 
                    type="text" 
                    placeholder="ស្វែងរកតាមលេខវិក្កយបត្រ, ឈ្មោះអតិថិជន ឬ ឈ្មោះទំនិញ..." 
                    class="w-full bg-transparent border-none outline-none focus:ring-0 text-sm font-bold text-slate-700 py-2.5"
                >
                <button v-if="searchQuery" @click="searchQuery = ''" class="p-2 text-slate-400 hover:text-rose-500 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>

            <div class="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse min-w-[1000px]">
                        <thead class="bg-slate-50 text-slate-500 text-[11px] uppercase font-black tracking-widest border-b border-slate-200">
                            <tr>
                                <th class="px-6 py-4 whitespace-nowrap w-12 text-center">#</th>
                                <th class="px-6 py-4 whitespace-nowrap">កាលបរិច្ឆេទ</th>
                                <th class="px-6 py-4 whitespace-nowrap">វិក្កយបត្រ / អតិថិជន</th>
                                <th class="px-6 py-4 whitespace-nowrap w-[25%]">ទំនិញ / បរិមាណ</th>
                                <th class="px-6 py-4 text-right whitespace-nowrap text-blue-600">ចំណូល (Rev)</th>
                                <th class="px-6 py-4 text-right whitespace-nowrap text-rose-500">ថ្លៃដើម (Cost)</th>
                                <th class="px-6 py-4 text-right whitespace-nowrap text-emerald-600 bg-emerald-50/50">ចំណេញ (Profit)</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            <tr v-if="paginatedSales.length === 0">
                                <td colspan="7" class="py-16 text-center">
                                    <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 text-slate-300 mb-4">
                                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                                    </div>
                                    <p class="text-slate-400 font-bold">រកមិនឃើញទិន្នន័យទេ</p>
                                </td>
                            </tr>
                            <tr v-for="(sale, index) in paginatedSales" :key="sale.id" class="hover:bg-slate-50/80 transition-colors">
                                <td class="px-6 py-4 text-center text-sm font-bold text-slate-400">
                                    {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                                </td>
                                <td class="px-6 py-4 text-sm font-bold text-slate-700 whitespace-nowrap">
                                    {{ formatKhmerDate(sale.date) }}
                                </td>
                                <td class="px-6 py-4">
                                    <p class="text-sm font-black text-indigo-600">#{{ sale.receiptId || 'N/A' }}</p>
                                    <p class="text-xs font-bold text-slate-500 mt-0.5">{{ sale.clientName || 'អតិថិជនទូទៅ' }}</p>
                                </td>
                                <td class="px-6 py-4">
                                    <p class="text-sm font-bold text-slate-800 line-clamp-2" :title="sale.productNames">{{ sale.productNames }}</p>
                                    <p class="text-xs font-bold text-slate-500 mt-1 inline-flex bg-slate-100 px-2 py-0.5 rounded">{{ sale.totalItemsCount }} មុខ</p>
                                </td>
                                <td class="px-6 py-4 text-right">
                                    <span class="text-sm font-black text-slate-800">{{ sale.revenueUSD.toLocaleString(undefined, {maximumFractionDigits: 3}) }}$</span>
                                </td>
                                <td class="px-6 py-4 text-right">
                                    <span class="text-sm font-bold text-rose-500">{{ sale.costUSD > 0 ? sale.costUSD.toLocaleString(undefined, {maximumFractionDigits: 3}) + '$' : '-' }}</span>
                                </td>
                                <td class="px-6 py-4 text-right bg-emerald-50/30">
                                    <span class="inline-flex items-center px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-lg text-sm font-black shadow-sm">
                                        + {{ sale.profitUSD.toLocaleString(undefined, {maximumFractionDigits: 3}) }}$
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div v-if="totalPages > 1" class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <p class="text-xs font-bold text-slate-500 pl-2">
                    បង្ហាញ {{ (currentPage - 1) * itemsPerPage + 1 }} ដល់ {{ Math.min(currentPage * itemsPerPage, filteredSales.length) }} នៃ {{ filteredSales.length }} ទិន្នន័យ
                </p>
                <div class="flex items-center gap-1.5">
                    <button @click="prevPage" :disabled="currentPage === 1" class="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
                    </button>
                    <div class="flex gap-1 overflow-x-auto hide-scrollbar max-w-[200px]">
                        <button v-for="p in visiblePages" :key="p" @click="goToPage(p)" class="w-9 h-9 shrink-0 flex items-center justify-center rounded-xl font-bold text-sm transition-colors border" :class="currentPage === p ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'">
                            {{ p }}
                        </button>
                    </div>
                    <button @click="nextPage" :disabled="currentPage === totalPages" class="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                    </button>
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
import { ref, onMounted, computed, nextTick } from 'vue';
import { db } from '@/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const isLoading = ref(true);
const allSalesRaw = ref([]);
const searchQuery = ref('');

// Date Filters
const dateFilterType = ref('today'); // today, monthly, yearly, custom
const customStart = ref(new Date().toISOString().split('T')[0]);
const customEnd = ref(new Date().toISOString().split('T')[0]);

// Pagination
const currentPage = ref(1);
const itemsPerPage = 50;

// Export Processing
const printStaging = ref(null);
const processing = ref({ active: false, message: '', progress: 0 });

const khmerMonths = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'];

// Format: 25-កុម្ភៈ-2026
const formatKhmerDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = khmerMonths[d.getMonth()];
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
};

onMounted(async () => {
    try {
        // ១. ទាញយក Stock (stocks collection) ដើម្បីយកថ្លៃដើម និងធ្វើការបំបែកខ្នាត (កេះ ទៅ ដប)
        const stocksSnap = await getDocs(collection(db, 'stocks')); 
        const stockCostsMap = {};
        
        stocksSnap.forEach(doc => {
            const data = doc.data();
            const pName = data.name || data.productName;
            
            if (pName) {
                const unitCost = Number(data.unitCost || 0); // ថ្លៃដើមក្នុង ១កេះ (Bulk/Case)
                const itemsPerCase = Number(data.itemsPerCase || 1); // ចំនួនដបក្នុង ១កេះ

                // គណនាថ្លៃដើមក្នុង ១ដប: Cost per Item = unitCost / itemsPerCase
                let retailUnitCost = 0;
                if (itemsPerCase > 0) {
                    retailUnitCost = unitCost / itemsPerCase;
                }

                stockCostsMap[pName] = {
                    costPerCase: unitCost,
                    costPerItem: retailUnitCost
                };
            }
        });

        // ២. ទាញយកការលក់ (sales_reports)
        const querySnapshot = await getDocs(collection(db, 'sales_reports'));
        const rawSales = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.paymentStatus !== 'CANCELED') {
                let revenueUSD = 0, revenueKHR = 0;
                let costUSD = 0, costKHR = 0;
                let itemsCount = 0;
                let namesArr = [];

                if (data.items && data.items.length > 0) {
                    itemsCount = data.items.length;
                    
                    data.items.forEach(item => {
                        const qty = Number(item.qty || 0);
                        const price = Number(item.price || 0);
                        
                        // ៣. ពិនិត្យមើល និងដាក់បញ្ចូលថ្លៃដើមឱ្យត្រូវនឹងការលក់ (លក់ដុំ ឬ លក់រាយ)
                        let unitCostToCalculate = 0;
                        if (item.name && stockCostsMap[item.name]) {
                            const stockInfo = stockCostsMap[item.name];
                            
                            // បើលក់ជា "ដុំ (wholesale)" យកថ្លៃកេះ, បើមិនមែន (retail) យកថ្លៃរាយ
                            if (item.type === 'wholesale') {
                                unitCostToCalculate = stockInfo.costPerCase;
                            } else {
                                unitCostToCalculate = stockInfo.costPerItem;
                            }
                        } else {
                            // Fallback ក្រែងលោក្នុងវិក្កយបត្រមានការកត់ត្រាថ្លៃដើមស្រាប់
                            unitCostToCalculate = Number(item.cost || 0);
                        }

                        const itemRev = qty * price;
                        const itemCost = qty * unitCostToCalculate;

                        if (item.name) namesArr.push(item.name);

                        if (data.currency === 'USD' || data.currency === '$') {
                            revenueUSD += itemRev;
                            costUSD += itemCost;
                        } else {
                            revenueKHR += itemRev;
                            costKHR += itemCost;
                        }
                    });
                }

                rawSales.push({
                    id: doc.id,
                    date: data.createdAt || data.date,
                    receiptId: data.receiptId || data.invoiceNumber,
                    clientName: data.clientName || data.customerName,
                    productNames: namesArr.join(', '),
                    totalItemsCount: itemsCount,
                    revenueUSD, revenueKHR, costUSD, costKHR,
                    profitUSD: revenueUSD - costUSD,
                    profitKHR: revenueKHR - costKHR
                });
            }
        });

        allSalesRaw.value = rawSales.sort((a, b) => new Date(b.date) - new Date(a.date));

    } catch (error) {
        console.error("Error fetching data:", error);
    } finally {
        isLoading.value = false;
    }
});

// ====== FILTER LOGIC ======
const isDateInScope = (dateStr) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return false;
    
    const today = new Date();
    const localDateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    if (dateFilterType.value === 'today') return localDateStr === todayStr;
    if (dateFilterType.value === 'monthly') return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
    if (dateFilterType.value === 'yearly') return d.getFullYear() === today.getFullYear();
    if (dateFilterType.value === 'custom') return localDateStr >= customStart.value && localDateStr <= customEnd.value;
    return true;
};

const filteredSales = computed(() => {
    let result = allSalesRaw.value.filter(sale => isDateInScope(sale.date));
    
    if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase();
        result = result.filter(s => 
            (s.receiptId && s.receiptId.toLowerCase().includes(q)) ||
            (s.clientName && s.clientName.toLowerCase().includes(q)) ||
            (s.productNames && s.productNames.toLowerCase().includes(q))
        );
    }
    
    currentPage.value = 1; 
    return result;
});

// ====== SUMMARY TOTALS ======
const summary = computed(() => {
    let totalRevenueUSD = 0, totalRevenueKHR = 0;
    let totalCostUSD = 0, totalCostKHR = 0;

    filteredSales.value.forEach(sale => {
        totalRevenueUSD += sale.revenueUSD;
        totalRevenueKHR += sale.revenueKHR;
        totalCostUSD += sale.costUSD;
        totalCostKHR += sale.costKHR;
    });

    return {
        totalRevenueUSD, totalRevenueKHR, totalCostUSD, totalCostKHR,
        netProfitUSD: totalRevenueUSD - totalCostUSD,
        netProfitKHR: totalRevenueKHR - totalCostKHR
    };
});

// ====== PAGINATION ======
const totalPages = computed(() => Math.ceil(filteredSales.value.length / itemsPerPage) || 1);
const paginatedSales = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    return filteredSales.value.slice(start, start + itemsPerPage);
});

const visiblePages = computed(() => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages.value, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
});

const prevPage = () => { if (currentPage.value > 1) currentPage.value--; };
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++; };
const goToPage = (p) => { currentPage.value = p; };

// ====== PRINT & PDF EXPORT ======
const getFilterLabel = () => {
    if (dateFilterType.value === 'today') return 'ប្រចាំថ្ងៃនេះ';
    if (dateFilterType.value === 'monthly') return 'ប្រចាំខែនេះ';
    if (dateFilterType.value === 'yearly') return 'ប្រចាំឆ្នាំនេះ';
    return `ចាប់ពី ${formatKhmerDate(customStart.value)} ដល់ ${formatKhmerDate(customEnd.value)}`;
};

const generatePrintHTML = (itemsList, pageNum, totalPagesLength, isNativePrint = false) => {
    const renderRow = (item, idx) => `
        <tr style="border-bottom: 1px dashed #e2e8f0; break-inside: avoid; page-break-inside: avoid;">
            <td style="padding: 12px 10px; text-align: center; color: #94a3b8; font-weight: 900;">${idx + 1}</td>
            <td style="padding: 12px 10px; font-weight: bold; color: #475569; font-size: 13px;">${formatKhmerDate(item.date)}</td>
            <td style="padding: 12px 10px;">
                <p style="font-weight: 900; color: #1e293b; font-size: 14px; margin: 0;">#${item.receiptId}</p>
                <p style="color: #64748b; font-size: 11px; margin: 2px 0 0 0;">${item.clientName || ''}</p>
            </td>
            <td style="padding: 12px 10px; font-weight: bold; color: #0f172a; font-size: 13px;">${item.productNames || 'N/A'}</td>
            <td style="padding: 12px 10px; text-align: right; font-weight: 900; color: #2563eb;">${item.revenueUSD.toLocaleString(undefined, {maximumFractionDigits: 3})} $</td>
            <td style="padding: 12px 10px; text-align: right; font-weight: bold; color: #e11d48;">${item.costUSD > 0 ? item.costUSD.toLocaleString(undefined, {maximumFractionDigits: 3}) + ' $' : '-'}</td>
            <td style="padding: 12px 10px; text-align: right; font-weight: 900; color: #059669;">+ ${item.profitUSD.toLocaleString(undefined, {maximumFractionDigits: 3})} $</td>
        </tr>
    `;

    const rowsHTML = itemsList.map((item, i) => renderRow(item, i + (pageNum - 1) * (isNativePrint ? itemsList.length : 20))).join('');

    let headerHTML = '';
    if (pageNum === 1) {
        headerHTML = `
            <div style="text-align: center; margin-bottom: 25px;">
                <h1 style="font-size: 26px; font-weight: 900; color: #1e293b; margin: 0; text-transform: uppercase;">របាយការណ៍ប្រាក់ចំណេញសុទ្ធ</h1>
                <p style="font-size: 14px; font-weight: bold; color: #64748b; margin-top: 8px;">ចម្រោះទិន្នន័យ៖ ${getFilterLabel()}</p>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 25px; border: 1px solid #e2e8f0; border-radius: 12px; padding: 15px; background: #f8fafc;">
                <div style="text-align: center; width: 33%;">
                    <p style="font-size: 12px; color: #64748b; font-weight: bold; margin:0;">ចំណូលសរុប (Revenue)</p>
                    <p style="font-size: 20px; color: #1e293b; font-weight: 900; margin: 5px 0 0 0;">${summary.value.totalRevenueUSD.toLocaleString(undefined, {maximumFractionDigits: 3})} $</p>
                </div>
                <div style="text-align: center; width: 33%; border-left: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0;">
                    <p style="font-size: 12px; color: #e11d48; font-weight: bold; margin:0;">ថ្លៃដើមសរុប (Cost)</p>
                    <p style="font-size: 20px; color: #1e293b; font-weight: 900; margin: 5px 0 0 0;">${summary.value.totalCostUSD.toLocaleString(undefined, {maximumFractionDigits: 3})} $</p>
                </div>
                <div style="text-align: center; width: 33%;">
                    <p style="font-size: 12px; color: #059669; font-weight: bold; margin:0;">ចំណេញសុទ្ធ (Net Profit)</p>
                    <p style="font-size: 20px; color: #059669; font-weight: 900; margin: 5px 0 0 0;">${summary.value.netProfitUSD.toLocaleString(undefined, {maximumFractionDigits: 3})} $</p>
                </div>
            </div>
        `;
    }

    const thStyle = `padding: 12px 10px; border-bottom: 2px solid #cbd5e1; font-size: 12px; font-weight: 900; color: #334155; text-transform: uppercase;`;
    const pageStyles = isNativePrint ? `width: 100%; box-sizing: border-box; font-family: 'Battambong', sans-serif; padding: 20px;` : `width: 1000px; min-height: 1414px; background: white; padding: 40px; box-sizing: border-box; font-family: 'Battambong', sans-serif; position: relative;`;

    return `
        <div class="print-page" style="${pageStyles}">
            ${headerHTML}
            <table style="width: 100%; text-align: left; border-collapse: collapse;">
                <thead style="display: table-header-group;">
                    <tr>
                        <th style="${thStyle} width:5%; text-align:center;">#</th>
                        <th style="${thStyle} width:15%;">កាលបរិច្ឆេទ</th>
                        <th style="${thStyle} width:20%;">វិក្កយបត្រ / អតិថិជន</th>
                        <th style="${thStyle} width:25%;">ទំនិញ</th>
                        <th style="${thStyle} width:12%; text-align:right; color:#2563eb;">ចំណូល</th>
                        <th style="${thStyle} width:11%; text-align:right; color:#e11d48;">ថ្លៃដើម</th>
                        <th style="${thStyle} width:12%; text-align:right; color:#059669;">ចំណេញ</th>
                    </tr>
                </thead>
                <tbody>${rowsHTML}</tbody>
            </table>
            <div style="margin-top: 40px; padding-top: 15px; border-top: 1px solid #e2e8f0; font-size: 12px; font-weight: bold; color: #94a3b8; overflow: hidden; page-break-inside: avoid;">
                <div style="float: left;">ថ្ងៃបញ្ចេញរបាយការណ៍: ${new Date().toLocaleString('km-KH')}</div>
                <div style="float: right;">${isNativePrint ? '' : `ទំព័រទី ${pageNum} នៃ ${totalPagesLength}`}</div>
                <div style="clear: both;"></div>
            </div>
        </div>
    `;
};

const executePrint = () => {
    if(filteredSales.value.length === 0) return alert('គ្មានទិន្នន័យសម្រាប់ Print ទេ');
    const contentHTML = generatePrintHTML(filteredSales.value, 1, 1, true);
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute'; iframe.style.width = '0'; iframe.style.height = '0'; iframe.style.border = 'none';
    document.body.appendChild(iframe);
    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`<html><head><title>របាយការណ៍ប្រាក់ចំណេញ</title><link href="https://fonts.googleapis.com/css2?family=Battambong:wght@400;700;900&display=swap" rel="stylesheet"><style>@page { size: A4 portrait; margin: 0; } body { font-family: 'Battambong', sans-serif; margin: 0; padding: 15mm; background-color: white; -webkit-print-color-adjust: exact !important; }</style></head><body>${contentHTML}</body></html>`);
    doc.close();
    iframe.contentWindow.document.fonts.ready.then(() => {
        iframe.contentWindow.focus(); iframe.contentWindow.print();
        setTimeout(() => { document.body.removeChild(iframe); }, 1000);
    });
};

const generatePDF = async () => {
    if(filteredSales.value.length === 0) return alert('គ្មានទិន្នន័យសម្រាប់ទាញយកទេ');
    processing.value = { active: true, message: 'កំពុងរៀបចំទិន្នន័យ...', progress: 10 };
    
    try {
        const pLimit = 20;
        const pages = [];
        let remaining = [...filteredSales.value];
        while (remaining.length > 0) { pages.push(remaining.slice(0, pLimit)); remaining = remaining.slice(pLimit); }

        const pdf = new jsPDF('p', 'mm', 'a4'); 
        for (let i = 0; i < pages.length; i++) {
            processing.value.message = `កំពុងថតចម្លងទំព័រទី ${i+1} នៃ ${pages.length}...`;
            printStaging.value.innerHTML = generatePrintHTML(pages[i], i + 1, pages.length, false);
            await nextTick(); await document.fonts.ready; await new Promise(r => setTimeout(r, 600)); 
            const canvas = await html2canvas(printStaging.value.querySelector('.print-page'), { scale: 2, useCORS: true, logging: false, backgroundColor: "#ffffff", windowWidth: 1000 });
            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            if (i > 0) pdf.addPage();
            const propsImg = pdf.getImageProperties(imgData);
            pdf.addImage(imgData, 'JPEG', 0, 0, 210, (propsImg.height * 210) / propsImg.width);
            processing.value.progress = 10 + Math.round(((i + 1) / pages.length) * 80);
        }
        processing.value.message = 'កំពុងរក្សាទុកឯកសារ...';
        processing.value.progress = 100;
        pdf.save(`Profit_Report_${new Date().getTime()}.pdf`);
    } catch(e) {
        alert("មានបញ្ហាក្នុងការទាញយក PDF");
    } finally {
        if(printStaging.value) printStaging.value.innerHTML = '';
        processing.value.active = false;
    }
};
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.animate-fade-in-up { animation: fadeInUp 0.3s ease-out forwards; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>