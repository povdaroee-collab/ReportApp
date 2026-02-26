<template>
  <div class="font-khmer relative">
    
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-32 opacity-60 print:hidden">
       <div class="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-rose-500 mb-4"></div>
       <p class="text-slate-500 font-bold">កំពុងទាញយកទិន្នន័យចំណាយ និងការខាតបង់...</p>
    </div>

    <div v-else class="space-y-6 animate-fade-in-up" ref="dashboardContent">
        
        <div class="bg-white p-4 rounded-[1.5rem] border border-slate-200 shadow-sm flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 print:hidden">
            
            <div class="flex flex-wrap items-center gap-3">
                <div class="flex items-center gap-2 text-rose-600 font-black text-sm bg-rose-50 px-4 py-2.5 rounded-xl border border-rose-100 shadow-sm">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    ចម្រោះទិន្នន័យ
                </div>
                
                <div class="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                    <button @click="filterType = 'today'" :class="filterType === 'today' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-600 hover:text-rose-600'" class="py-1.5 px-4 rounded-lg font-bold text-sm transition-all">ថ្ងៃនេះ</button>
                    <button @click="filterType = 'thisMonth'" :class="filterType === 'thisMonth' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-600 hover:text-rose-600'" class="py-1.5 px-4 rounded-lg font-bold text-sm transition-all">ខែនេះ</button>
                    <button @click="filterType = 'specificMonth'" :class="filterType === 'specificMonth' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-600 hover:text-rose-600'" class="py-1.5 px-4 rounded-lg font-bold text-sm transition-all">ជ្រើសរើសខែ</button>
                    <button @click="filterType = 'yearly'" :class="filterType === 'yearly' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-600 hover:text-rose-600'" class="py-1.5 px-4 rounded-lg font-bold text-sm transition-all">ប្រចាំឆ្នាំ</button>
                    <button @click="filterType = 'custom'" :class="filterType === 'custom' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-600 hover:text-rose-600'" class="py-1.5 px-4 rounded-lg font-bold text-sm transition-all">ជ្រើសរើសថ្ងៃ</button>
                </div>

                <div v-if="filterType === 'specificMonth'" class="flex items-center gap-2 animate-fade-in pl-2 xl:border-l border-slate-200">
                    <select v-model="selectedMonth" class="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-sm font-bold text-slate-700 outline-none focus:border-rose-500 cursor-pointer">
                        <option v-for="(m, idx) in khmerMonths" :key="idx" :value="idx">{{ m }}</option>
                    </select>
                    <select v-model="selectedYear" class="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-sm font-bold text-slate-700 outline-none focus:border-rose-500 cursor-pointer">
                        <option v-for="y in availableYears" :key="y" :value="y">ឆ្នាំ {{ y }}</option>
                    </select>
                </div>

                <div v-if="filterType === 'yearly'" class="flex items-center gap-2 animate-fade-in pl-2 xl:border-l border-slate-200">
                    <select v-model="selectedYear" class="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-sm font-bold text-slate-700 outline-none focus:border-rose-500 cursor-pointer">
                        <option v-for="y in availableYears" :key="y" :value="y">ឆ្នាំ {{ y }}</option>
                    </select>
                </div>

                <div v-if="filterType === 'custom'" class="flex items-center gap-2 animate-fade-in pl-2 xl:border-l border-slate-200">
                    <input type="date" v-model="customStart" class="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-sm font-bold text-slate-700 outline-none focus:border-rose-500">
                    <span class="text-slate-400 font-bold">-</span>
                    <input type="date" v-model="customEnd" class="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-sm font-bold text-slate-700 outline-none focus:border-rose-500">
                </div>
            </div>

            <div class="flex items-center gap-3 w-full xl:w-auto">
                <button @click="executePrint" class="flex-1 xl:flex-none flex items-center justify-center gap-2 bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-700 transition-colors shadow-sm">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                    Print
                </button>
                <button @click="generatePDF" class="flex-1 xl:flex-none flex items-center justify-center gap-2 bg-rose-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-rose-600 transition-colors shadow-sm">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    PDF
                </button>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 print:hidden">
            <div class="bg-emerald-50 p-5 rounded-[1.5rem] border border-emerald-200 shadow-sm relative overflow-hidden group hover:border-emerald-300 transition-colors">
                <div class="w-12 h-12 bg-white text-emerald-600 rounded-xl flex items-center justify-center mb-3 shadow-sm border border-emerald-100">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                </div>
                <p class="text-xs font-bold text-emerald-700 mb-1">ចំណាយទិញទំនិញចូល (Stock IN)</p>
                <h3 class="text-3xl font-black text-emerald-600">{{ summary.totalPurchaseUSD.toLocaleString(undefined, {minimumFractionDigits: 2}) }} $</h3>
                <p class="text-xs font-bold text-emerald-500 mt-1">ប្រតិបត្តិការសរុប: {{ summary.countIN }} ដង</p>
                <div class="absolute -right-4 -bottom-4 w-20 h-20 bg-emerald-500/10 rounded-full group-hover:scale-150 transition-transform"></div>
            </div>

            <div class="bg-rose-50 p-5 rounded-[1.5rem] border border-rose-200 shadow-sm relative overflow-hidden group hover:border-rose-400 transition-colors">
                <div class="w-12 h-12 bg-white text-rose-600 rounded-xl flex items-center justify-center mb-3 shadow-sm border border-rose-100">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <p class="text-xs font-bold text-rose-700 mb-1">ទឹកប្រាក់ខាតបង់ (Loss/Damage OUT)</p>
                <h3 class="text-3xl font-black text-rose-600">{{ summary.totalLossUSD.toLocaleString(undefined, {minimumFractionDigits: 2}) }} $</h3>
                <p class="text-xs font-bold text-rose-500 mt-1">ទំនិញខូចខាត: {{ summary.countOUT }} មុខ</p>
                <div class="absolute -right-4 -bottom-4 w-20 h-20 bg-rose-500/20 rounded-full group-hover:scale-150 transition-transform"></div>
            </div>

            <div class="bg-slate-800 p-5 rounded-[1.5rem] border border-slate-700 shadow-sm relative overflow-hidden group lg:col-span-1 md:col-span-2">
                <div class="w-12 h-12 bg-white/10 text-white rounded-xl flex items-center justify-center mb-3 border border-white/20">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <p class="text-xs font-bold text-slate-300 mb-1">ចំណាយទុន និងខាតបង់សរុប (Total Expense)</p>
                <h3 class="text-3xl font-black text-white">{{ (summary.totalPurchaseUSD + summary.totalLossUSD).toLocaleString(undefined, {minimumFractionDigits: 2}) }} $</h3>
                <p class="text-xs font-bold text-slate-400 mt-1">ផ្អែកតាមរយៈពេលដែលបានជ្រើសរើស</p>
                <div class="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full group-hover:scale-150 transition-transform"></div>
            </div>
        </div>

        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden print:hidden">
            
            <div class="p-4 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
                
                <div class="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto">
                    <button @click="viewType = 'ALL'" :class="viewType === 'ALL' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'" class="flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all">សរុបទាំងអស់</button>
                    <button @click="viewType = 'IN'" :class="viewType === 'IN' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-500'" class="flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all">ទិញចូល (IN)</button>
                    <button @click="viewType = 'OUT'" :class="viewType === 'OUT' ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-500'" class="flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all">ខាតបង់ (OUT)</button>
                </div>

                <div class="relative w-full md:w-80">
                    <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </span>
                    <input 
                        v-model="searchQuery" 
                        type="text" 
                        placeholder="ស្វែងរកទំនិញ ឬ មូលហេតុ..." 
                        class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-rose-400 transition-all"
                    >
                </div>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse min-w-[1000px]">
                    <thead class="bg-slate-50 text-slate-500 text-[11px] uppercase font-black tracking-widest border-b border-slate-200">
                        <tr>
                            <th class="px-5 py-4 w-12 text-center">#</th>
                            <th class="px-5 py-4">កាលបរិច្ឆេទ</th>
                            <th class="px-5 py-4 text-center">ប្រភេទ</th>
                            <th class="px-5 py-4 w-[25%]">ទំនិញ</th>
                            <th class="px-5 py-4 text-center">ចំនួន/ខ្នាត</th>
                            <th class="px-5 py-4 text-right">តម្លៃឯកតា</th>
                            <th class="px-5 py-4 text-right">សរុប (Total)</th>
                            <th class="px-5 py-4 w-[20%]">មូលហេតុ/ចំណាំ</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <tr v-if="paginatedTransactions.length === 0">
                            <td colspan="8" class="py-16 text-center">
                                <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 text-slate-300 mb-4">
                                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                                </div>
                                <p class="text-slate-400 font-bold">រកមិនឃើញទិន្នន័យទេ</p>
                            </td>
                        </tr>
                        <tr v-for="(tx, index) in paginatedTransactions" :key="tx.id" class="hover:bg-slate-50/80 transition-colors">
                            <td class="px-5 py-4 text-center text-xs font-bold text-slate-400">
                                {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                            </td>
                            <td class="px-5 py-4 text-xs font-bold text-slate-700 whitespace-nowrap">
                                {{ formatDate(tx.createdAt) }}
                            </td>
                            <td class="px-5 py-4 text-center">
                                <span class="px-2.5 py-1 rounded text-[10px] font-black tracking-widest shadow-sm" 
                                    :class="tx.type.includes('IN') ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'">
                                    {{ tx.type === 'IN_NEW' ? 'IN (ស្តុកថ្មី)' : (tx.type === 'IN' ? 'IN (បន្ថែម)' : 'OUT (ខាត)') }}
                                </span>
                            </td>
                            <td class="px-5 py-4">
                                <p class="text-sm font-bold text-slate-800 line-clamp-1" :title="tx.productName">{{ tx.productName }}</p>
                                <p class="text-[10px] text-slate-400 mt-0.5">ដោយ: {{ tx.createdBy }}</p>
                            </td>
                            <td class="px-5 py-4 text-center">
                                <span class="text-xs font-black text-slate-700">{{ formatQty(tx.qty) }} <span class="text-[10px] text-slate-500 font-bold">{{ translateUnit(tx.unitDisplay) }}</span></span>
                            </td>
                            <td class="px-5 py-4 text-right text-xs font-bold text-slate-600">
                                {{ formatPrice(tx.unitCost, tx.currency) }}
                            </td>
                            <td class="px-5 py-4 text-right">
                                <span class="inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-black border" 
                                    :class="tx.type.includes('IN') ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'">
                                    {{ formatPrice(tx.totalValue, tx.currency) }}
                                </span>
                            </td>
                            <td class="px-5 py-4">
                                <p class="text-[11px] font-bold text-slate-500 bg-slate-50 px-2 py-1.5 rounded border border-slate-100 line-clamp-2" :title="tx.reason">
                                    {{ tx.reason || '-' }}
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div v-if="totalPages > 1" class="bg-slate-50 p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p class="text-xs font-bold text-slate-500 pl-2">
                    បង្ហាញ {{ (currentPage - 1) * itemsPerPage + 1 }} ដល់ {{ Math.min(currentPage * itemsPerPage, filteredTransactions.length) }} នៃ {{ filteredTransactions.length }} ទិន្នន័យ
                </p>
                <div class="flex items-center gap-1.5">
                    <button @click="prevPage" :disabled="currentPage === 1" class="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-sm">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
                    </button>
                    <div class="flex gap-1 overflow-x-auto hide-scrollbar max-w-[200px]">
                        <button v-for="p in visiblePages" :key="p" @click="goToPage(p)" class="w-9 h-9 shrink-0 flex items-center justify-center rounded-xl font-bold text-sm transition-colors border shadow-sm" :class="currentPage === p ? 'bg-rose-500 text-white border-rose-500' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'">
                            {{ p }}
                        </button>
                    </div>
                    <button @click="nextPage" :disabled="currentPage === totalPages" class="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-sm">
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
            </div>
        </div>
    </transition>
    <div ref="printStaging" class="fixed top-0 left-[-9999px] w-[1122px] pointer-events-none z-[-1] opacity-0 print:opacity-100 bg-white"></div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue';
import { db } from '@/firebaseConfig';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const isLoading = ref(true);
const mixedTransactionsRaw = ref([]); // ផ្ទុកទិន្នន័យទាំង២បញ្ជូលគ្នា
const searchQuery = ref('');
const viewType = ref('ALL'); 

// Date Filters
const filterType = ref('today'); 
const today = new Date();
const selectedMonth = ref(today.getMonth());
const selectedYear = ref(today.getFullYear());
const availableYears = ref([today.getFullYear()]);
const customStart = ref(today.toISOString().split('T')[0]);
const customEnd = ref(today.toISOString().split('T')[0]);

// Pagination
const currentPage = ref(1);
const itemsPerPage = 60;

// Export Processing
const printStaging = ref(null);
const processing = ref({ active: false, message: '', progress: 0 });

const khmerMonths = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'];

const formatKhmerDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = khmerMonths[d.getMonth()];
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
};

const formatDate = (ts) => {
    if(!ts) return '';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return new Intl.DateTimeFormat('km-KH', { dateStyle: 'medium', timeStyle: 'short' }).format(d);
};

const formatQty = (val) => {
    if (!val) return '0';
    return Number(val).toFixed(2).replace(/\.00$/, ''); 
};

const formatPrice = (val, currency = '') => {
    const num = Number(val) || 0;
    const symbol = currency === 'USD' ? '$' : (currency === 'KHR' ? '៛' : '');
    return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + (symbol ? ' ' + symbol : '');
};

const translateUnit = (unit) => {
    const map = { bottle: 'ដប', case: 'កេះ', pack: 'កញ្ចប់', can: 'កំប៉ុង', kg: 'គីឡូ' };
    return map[unit] || unit;
};

// ================= DATA FETCHING =================
onMounted(async () => {
    try {
        const rawData = [];
        const yearsSet = new Set();

        // 1. ទាញយក Stock Transactions (ការថែមស្តុក / ដកចេញពីប្រព័ន្ធ)
        const qTx = query(collection(db, 'stock_transactions'), orderBy('createdAt', 'desc'));
        const snapTx = await getDocs(qTx);
        
        snapTx.forEach((doc) => {
            const data = doc.data();
            const dateObj = data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
            yearsSet.add(dateObj.getFullYear());
            
            let totalValueUSD = data.totalValue || 0;
            if (data.currency === 'KHR' || data.currency === '៛') totalValueUSD /= 4000;

            rawData.push({
                id: doc.id,
                ...data,
                dateObj,
                totalValueUSD
            });
        });

        // 2. ទាញយក Stocks ដើម (ទំនិញដែលបានបង្កើតដំបូង)
        const snapStocks = await getDocs(collection(db, 'stocks'));
        snapStocks.forEach((doc) => {
            const data = doc.data();
            if (data.createdAt) {
                const dateObj = data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
                yearsSet.add(dateObj.getFullYear());
                
                let totalCostUSD = data.totalCost || 0;
                if (data.currency === 'KHR' || data.currency === '៛') totalCostUSD /= 4000;

                rawData.push({
                    id: `new_${doc.id}`,
                    type: 'IN_NEW', // ប្រភេទពិសេសដើម្បីចំណាំថាជានាំចូលថ្មី
                    productId: doc.id,
                    productName: data.name,
                    qty: data.quantity, // បញ្ចូលក្នុងប្រព័ន្ធដំបូង
                    unitDisplay: data.unit,
                    unitCost: data.unitCost,
                    totalValue: data.totalCost,
                    currency: data.currency,
                    reason: 'បង្កើតស្តុកថ្មីដំបូង',
                    createdBy: 'Admin',
                    createdAt: data.createdAt,
                    dateObj,
                    totalValueUSD: totalCostUSD
                });
            }
        });

        // តម្រៀបទិន្នន័យចម្រុះបញ្ចូលគ្នា តាមកាលបរិច្ឆេទ (ថ្មីមុន)
        rawData.sort((a, b) => b.dateObj - a.dateObj);
        mixedTransactionsRaw.value = rawData;
        
        if(yearsSet.size > 0) availableYears.value = Array.from(yearsSet).sort((a,b)=>b-a);

    } catch (error) {
        console.error("Error fetching transactions:", error);
    } finally {
        isLoading.value = false;
    }
});

// ================= FILTER LOGIC =================
const isDateInScope = (dateObj) => {
    if (!dateObj) return false;
    
    const localDateStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    if (filterType.value === 'today') return localDateStr === todayStr;
    if (filterType.value === 'thisMonth') return dateObj.getMonth() === today.getMonth() && dateObj.getFullYear() === today.getFullYear();
    if (filterType.value === 'specificMonth') return dateObj.getMonth() === selectedMonth.value && dateObj.getFullYear() === selectedYear.value;
    if (filterType.value === 'yearly') return dateObj.getFullYear() === selectedYear.value;
    if (filterType.value === 'custom') return localDateStr >= customStart.value && localDateStr <= customEnd.value;
    return true;
};

const filteredTransactions = computed(() => {
    let result = mixedTransactionsRaw.value.filter(tx => isDateInScope(tx.dateObj));
    
    if (viewType.value === 'IN') {
        result = result.filter(tx => tx.type.includes('IN')); // រាប់បញ្ចូលទាំង IN ធម្មតា និង IN_NEW
    } else if (viewType.value === 'OUT') {
        result = result.filter(tx => tx.type === 'OUT');
    }

    if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase();
        result = result.filter(tx => 
            (tx.productName && tx.productName.toLowerCase().includes(q)) ||
            (tx.reason && tx.reason.toLowerCase().includes(q)) ||
            (tx.createdBy && tx.createdBy.toLowerCase().includes(q))
        );
    }
    
    currentPage.value = 1; 
    return result;
});

// ================= SUMMARY TOTALS =================
const summary = computed(() => {
    let totalPurchaseUSD = 0, countIN = 0;
    let totalLossUSD = 0, countOUT = 0;

    const dateFilteredData = mixedTransactionsRaw.value.filter(tx => isDateInScope(tx.dateObj));

    dateFilteredData.forEach(tx => {
        if (tx.type.includes('IN')) {
            totalPurchaseUSD += tx.totalValueUSD;
            countIN++;
        } else if (tx.type === 'OUT') {
            totalLossUSD += tx.totalValueUSD;
            countOUT++;
        }
    });

    return { totalPurchaseUSD, countIN, totalLossUSD, countOUT };
});

// ================= PAGINATION =================
const totalPages = computed(() => Math.ceil(filteredTransactions.value.length / itemsPerPage) || 1);
const paginatedTransactions = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    return filteredTransactions.value.slice(start, start + itemsPerPage);
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


// ================= EXPORT (PRINT / PDF) =================
const getFilterLabel = () => {
    if (filterType.value === 'today') return `ប្រចាំថ្ងៃនេះ (${formatKhmerDate(today)})`;
    if (filterType.value === 'thisMonth') return `ប្រចាំខែនេះ (${khmerMonths[today.getMonth()]})`;
    if (filterType.value === 'specificMonth') return `ប្រចាំខែ ${khmerMonths[selectedMonth.value]} ឆ្នាំ ${selectedYear.value}`;
    if (filterType.value === 'yearly') return `ប្រចាំឆ្នាំ ${selectedYear.value}`;
    
    const s = customStart.value.split('-');
    const e = customEnd.value.split('-');
    return `ចាប់ពីថ្ងៃទី ${s[2]}-${khmerMonths[parseInt(s[1])-1]}-${s[0]} ដល់ ${e[2]}-${khmerMonths[parseInt(e[1])-1]}-${e[0]}`;
};

const getCleanReportHTML = (itemsList, pageNum, totalPagesLength, isNativePrint = false) => {
    const renderRow = (item, idx) => `
        <tr style="border-bottom: 1px dashed #e2e8f0; break-inside: avoid;">
            <td style="padding: 10px; text-align: center; color: #94a3b8; font-weight: 900;">${idx + 1}</td>
            <td style="padding: 10px; font-size: 11px; color: #475569;">${formatDate(item.createdAt)}</td>
            <td style="padding: 10px; text-align: center;">
                <span style="font-size: 10px; font-weight: bold; color: ${item.type.includes('IN') ? '#059669' : '#e11d48'};">
                    ${item.type === 'IN_NEW' ? 'IN (ថ្មី)' : (item.type === 'IN' ? 'IN' : 'OUT')}
                </span>
            </td>
            <td style="padding: 10px; font-weight: bold; color: #1e293b; font-size: 13px;">${item.productName}</td>
            <td style="padding: 10px; text-align: center; font-weight: bold; color: #475569;">${formatQty(item.qty)} ${translateUnit(item.unitDisplay)}</td>
            <td style="padding: 10px; text-align: right; color: #64748b; font-size: 11px;">${formatPrice(item.unitCost, item.currency)}</td>
            <td style="padding: 10px; text-align: right; font-weight: 900; color: ${item.type.includes('IN') ? '#059669' : '#e11d48'};">${formatPrice(item.totalValue, item.currency)}</td>
            <td style="padding: 10px; font-size: 11px; color: #64748b;">${item.reason || '-'}</td>
        </tr>
    `;

    const rowsHTML = itemsList.map((item, i) => renderRow(item, i + (pageNum - 1) * (isNativePrint ? itemsList.length : 25))).join('');

    let headerHTML = '';
    if (pageNum === 1) {
        headerHTML = `
            <div style="text-align: center; margin-bottom: 25px;">
                <h1 style="font-size: 26px; font-weight: 900; margin: 0; text-transform: uppercase;">របាយការណ៍ ចំណាយ និងខាតបង់</h1>
                <p style="font-size: 14px; font-weight: bold; color: #64748b; margin-top: 5px;">ចម្រោះទិន្នន័យ៖ ${getFilterLabel()}</p>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 30px; border: 1px solid #e2e8f0; border-radius: 12px; padding: 15px; background: #f8fafc;">
                <div style="text-align: center; width: 48%;">
                    <p style="font-size: 12px; color: #059669; font-weight: bold; margin:0;">ចំណាយទិញទំនិញចូល (IN)</p>
                    <p style="font-size: 20px; color: #1e293b; font-weight: 900; margin: 5px 0 0 0;">${summary.value.totalPurchaseUSD.toLocaleString(undefined, {minimumFractionDigits:2})} $</p>
                </div>
                <div style="width: 2px; background: #e2e8f0;"></div>
                <div style="text-align: center; width: 48%;">
                    <p style="font-size: 12px; color: #e11d48; font-weight: bold; margin:0;">ទឹកប្រាក់ខាតបង់ (OUT)</p>
                    <p style="font-size: 20px; color: #1e293b; font-weight: 900; margin: 5px 0 0 0;">${summary.value.totalLossUSD.toLocaleString(undefined, {minimumFractionDigits:2})} $</p>
                </div>
            </div>
        `;
    }

    const thStyle = `padding: 12px 10px; border-bottom: 2px solid #cbd5e1; font-size: 12px; font-weight: 900; color: #334155; text-transform: uppercase; background: #f8fafc;`;
    const pageStyles = isNativePrint ? `width: 100%; box-sizing: border-box; font-family: 'Battambong', sans-serif; padding: 5mm;` : `width: 1122px; min-height: 793px; background: white; padding: 40px; box-sizing: border-box; font-family: 'Battambong', sans-serif; position: relative;`;

    return `
        <div class="print-page" style="${pageStyles}">
            ${headerHTML}
            <table style="width: 100%; text-align: left; border-collapse: collapse;">
                <thead>
                    <tr>
                        <th style="${thStyle} width:5%; text-align:center;">#</th>
                        <th style="${thStyle} width:15%;">កាលបរិច្ឆេទ</th>
                        <th style="${thStyle} width:10%; text-align:center;">ប្រភេទ</th>
                        <th style="${thStyle} width:25%;">ទំនិញ</th>
                        <th style="${thStyle} width:10%; text-align:center;">ចំនួន</th>
                        <th style="${thStyle} width:10%; text-align:right;">តម្លៃរាយ</th>
                        <th style="${thStyle} width:10%; text-align:right;">សរុប</th>
                        <th style="${thStyle} width:15%;">មូលហេតុ</th>
                    </tr>
                </thead>
                <tbody>${rowsHTML}</tbody>
            </table>
            <div style="margin-top: 30px; font-size: 11px; color: #94a3b8; text-align: right; border-top: 1px solid #e2e8f0; padding-top: 10px;">
                ${isNativePrint ? '' : `ទំព័រទី ${pageNum} នៃ ${totalPagesLength} | `} រៀបចំដោយប្រព័ន្ធ: ${new Date().toLocaleString('km-KH')}
            </div>
        </div>
    `;
};

const executePrint = async () => {
    if(filteredTransactions.value.length === 0) return alert('គ្មានទិន្នន័យសម្រាប់ Print ទេ');
    await nextTick();
    const contentHTML = getCleanReportHTML(filteredTransactions.value, 1, 1, true);
    
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute'; iframe.style.width = '0'; iframe.style.height = '0'; iframe.style.border = 'none';
    document.body.appendChild(iframe);
    
    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
        <html><head><title>របាយការណ៍ចំណាយ និងខាតបង់</title>
        <link href="https://fonts.googleapis.com/css2?family=Battambong:wght@400;700;900&display=swap" rel="stylesheet">
        <style>@page { size: A4 landscape; margin: 5mm; } body { margin: 0; padding: 0; background: white; -webkit-print-color-adjust: exact !important; display: flex; justify-content: center; overflow: hidden; }</style>
        </head><body><div style="width:100%; max-width:297mm; box-sizing:border-box;">${contentHTML}</div></body></html>
    `);
    doc.close();
    
    iframe.contentWindow.document.fonts.ready.then(() => {
        setTimeout(() => {
            iframe.contentWindow.focus(); iframe.contentWindow.print();
            setTimeout(() => document.body.removeChild(iframe), 1000);
        }, 500);
    });
};

const generatePDF = async () => {
    if(filteredTransactions.value.length === 0) return alert('គ្មានទិន្នន័យសម្រាប់ទាញយកទេ');
    processing.value = { active: true, message: 'កំពុងរៀបចំទិន្នន័យ PDF...', progress: 10 };
    
    try {
        const pLimit = 25; 
        const pages = [];
        let remaining = [...filteredTransactions.value];
        while (remaining.length > 0) { pages.push(remaining.slice(0, pLimit)); remaining = remaining.slice(pLimit); }

        const pdf = new jsPDF('l', 'mm', 'a4'); 
        const pdfWidth = 297; 

        for (let i = 0; i < pages.length; i++) {
            processing.value.message = `កំពុងថតចម្លងទំព័រទី ${i+1} នៃ ${pages.length}...`;
            
            const tempDiv = document.createElement('div');
            tempDiv.style.position = 'absolute'; tempDiv.style.top = '0'; tempDiv.style.left = '0'; tempDiv.style.width = '1122px'; tempDiv.style.background = '#ffffff'; tempDiv.style.zIndex = '-9999';
            tempDiv.innerHTML = getCleanReportHTML(pages[i], i + 1, pages.length, false);
            document.body.appendChild(tempDiv);
            
            await new Promise(r => setTimeout(r, 600)); 
            
            const canvas = await html2canvas(tempDiv, { scale: 2, useCORS: true, backgroundColor: "#ffffff", logging: false, windowWidth: 1122 });
            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            
            if (i > 0) pdf.addPage();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
            
            document.body.removeChild(tempDiv);
            processing.value.progress = 10 + Math.round(((i + 1) / pages.length) * 80);
        }
        
        processing.value.progress = 100;
        pdf.save(`Expense_Loss_Report_${new Date().getTime()}.pdf`);
        
    } catch (error) {
        console.error("PDF Error: ", error);
        alert("មានបញ្ហាក្នុងការទាញយក PDF");
    } finally {
        processing.value.active = false;
    }
};
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.animate-fade-in-up { animation: fadeInUp 0.4s ease-out forwards; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
</style>