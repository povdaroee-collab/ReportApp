<template>
    <div class="space-y-6 animate-fade-in-up relative">
        
        <div class="bg-white p-4 rounded-[1.5rem] border border-slate-200 shadow-sm flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 relative z-20">
            
            <div class="flex flex-wrap items-center gap-3 w-full xl:w-auto">
                <div class="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
                    <button @click="dateFilterType = 'day'" :class="dateFilterType === 'day' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:text-indigo-600'" class="py-1.5 px-4 rounded-lg font-bold text-sm transition-all whitespace-nowrap">ថ្ងៃ</button>
                    <button @click="dateFilterType = 'month'" :class="dateFilterType === 'month' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:text-indigo-600'" class="py-1.5 px-4 rounded-lg font-bold text-sm transition-all whitespace-nowrap">ខែ</button>
                    <button @click="dateFilterType = 'year'" :class="dateFilterType === 'year' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:text-indigo-600'" class="py-1.5 px-4 rounded-lg font-bold text-sm transition-all whitespace-nowrap">ឆ្នាំ</button>
                    <button @click="dateFilterType = 'range'" :class="dateFilterType === 'range' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:text-indigo-600'" class="py-1.5 px-4 rounded-lg font-bold text-sm transition-all whitespace-nowrap">ចន្លោះ</button>
                </div>

                <div class="flex items-center gap-2 shrink-0">
                    <input v-if="dateFilterType === 'day'" type="date" v-model="specificDate" class="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-sm font-bold text-slate-700 outline-none focus:border-indigo-500 cursor-pointer h-10">
                    <template v-if="dateFilterType === 'month'">
                        <select v-model="selectedMonth" class="bg-slate-50 border border-slate-200 rounded-xl px-3 h-10 text-sm font-bold text-slate-700 outline-none cursor-pointer"><option v-for="(m, i) in khmerMonths" :key="i" :value="i">{{ m }}</option></select>
                        <select v-model="selectedYear" class="bg-slate-50 border border-slate-200 rounded-xl px-3 h-10 text-sm font-bold text-slate-700 outline-none cursor-pointer"><option v-for="y in availableYears" :key="y" :value="y">{{ y }}</option></select>
                    </template>
                    <select v-if="dateFilterType === 'year'" v-model="selectedYear" class="bg-slate-50 border border-slate-200 rounded-xl px-3 h-10 text-sm font-bold text-slate-700 outline-none cursor-pointer"><option v-for="y in availableYears" :key="y" :value="y">{{ y }}</option></select>
                    <template v-if="dateFilterType === 'range'">
                        <input type="date" v-model="customStart" class="bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-sm font-bold text-slate-700 outline-none h-10">
                        <span class="text-slate-400 font-bold">-</span>
                        <input type="date" v-model="customEnd" class="bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-sm font-bold text-slate-700 outline-none h-10">
                    </template>
                </div>
            </div>

            <div class="flex flex-wrap items-center gap-3 w-full xl:w-auto">
                <div class="flex items-center bg-indigo-50 border border-indigo-200 rounded-xl px-3 h-10 shrink-0 w-full md:w-auto">
                    <select v-model="selectedAdmin" class="bg-transparent border-none outline-none text-sm font-black text-indigo-700 w-full cursor-pointer min-w-[150px]" :disabled="activeAdminsList.length === 0">
                        <option value="">{{ activeAdminsList.length === 0 ? 'គ្មានទិន្នន័យទេ' : '១. ជ្រើសរើស Admin' }}</option>
                        <option v-for="admin in activeAdminsList" :key="admin.id" :value="admin.id">{{ admin.name }}</option>
                    </select>
                </div>
                <div v-if="selectedAdmin" class="flex items-center bg-emerald-50 border border-emerald-200 rounded-xl px-3 h-10 shrink-0 w-full md:w-auto animate-fade-in">
                    <select v-model="selectedSeller" class="bg-transparent border-none outline-none text-sm font-black text-emerald-700 w-full cursor-pointer min-w-[180px]">
                        <option value="ALL">២. តំណាងលក់ទាំងអស់</option>
                        <option v-for="seller in activeSellersList" :key="seller" :value="seller">{{ seller }}</option>
                    </select>
                </div>

                <div class="flex items-center bg-slate-50 p-1 rounded-xl border border-slate-200 shrink-0 h-10 gap-1 pl-1 pr-2">
                    <div class="flex bg-white rounded-lg border border-slate-100 overflow-hidden shadow-sm">
                        <button @click="displayCurrency = 'USD'" :class="displayCurrency === 'USD' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-50'" class="px-3 py-1 text-[11px] font-black transition-colors">$</button>
                        <button @click="displayCurrency = 'KHR'" :class="displayCurrency === 'KHR' ? 'bg-rose-500 text-white' : 'text-slate-500 hover:bg-slate-50'" class="px-3 py-1 text-[11px] font-black transition-colors">៛</button>
                    </div>
                    <div class="flex items-center pl-1">
                        <span class="text-[10px] text-slate-400 font-bold mr-1">Rate:</span>
                        <input type="number" v-model.number="exchangeRate" :disabled="displayCurrency === 'USD'" class="w-14 bg-transparent border-b border-slate-300 text-xs font-black text-slate-700 outline-none focus:border-indigo-500 text-center pb-0.5 disabled:opacity-50">
                    </div>
                </div>

                <div class="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-[14px] border border-slate-100 shrink-0 h-10">
                    <span v-if="isExporting" class="px-2 text-xs font-bold text-amber-500 animate-pulse">ទាញយក...</span>
                    <button @click="handleCopyText" :disabled="!selectedAdmin || isExporting || aggregatedSales.length === 0" class="w-8 h-8 flex items-center justify-center bg-white text-slate-500 hover:text-indigo-600 rounded-xl shadow-sm border border-slate-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed" title="Copy អត្ថបទ">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                    </button>
                    <button @click="handleExport('image')" :disabled="!selectedAdmin || isExporting || aggregatedSales.length === 0" class="w-8 h-8 flex items-center justify-center bg-white text-slate-500 hover:text-sky-600 rounded-xl shadow-sm border border-slate-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed" title="Save រូបភាព">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    </button>
                    <button @click="handleExport('pdf')" :disabled="!selectedAdmin || isExporting || aggregatedSales.length === 0" class="w-8 h-8 flex items-center justify-center bg-white text-slate-500 hover:text-rose-600 rounded-xl shadow-sm border border-slate-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed" title="ទាញយក PDF">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    </button>
                </div>
            </div>
        </div>

        <div v-if="isLoadingData" class="py-20 text-center opacity-60">
            <div class="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-indigo-600 mx-auto mb-3"></div>
            <p class="text-sm font-bold text-slate-500">កំពុងទាញយកទិន្នន័យ...</p>
        </div>
        
        <div v-else-if="!selectedAdmin" class="py-20 text-center bg-white rounded-[2rem] border border-slate-200 border-dashed">
            <div class="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-3"><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg></div>
            <p class="text-slate-500 font-bold">សូមជ្រើសរើស Admin នៅខាងលើដើម្បីបង្ហាញទិន្នន័យ</p>
        </div>

        <div v-else class="space-y-6">
            
            <div class="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                <div class="bg-slate-800 px-6 py-4 flex items-center justify-between">
                    <h3 class="text-white font-black text-lg flex items-center gap-2">
                        <div class="w-8 h-8 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        ទិន្នន័យលក់ទំនិញ (គិតជាខ្នាតដបសុទ្ធ)
                    </h3>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse min-w-[1000px]">
                        <thead class="bg-slate-50 text-slate-500 text-[11px] uppercase font-black tracking-widest border-b border-slate-200">
                            <tr>
                                <th class="px-5 py-4 w-12 text-center">ល.រ</th>
                                <th class="px-5 py-4">ឈ្មោះមុខទំនិញ</th>
                                <th class="px-5 py-4 text-right" title="តម្លៃមធ្យមភាគ">តម្លៃដើម (មធ្យម)</th>
                                <th class="px-5 py-4 text-right" title="តម្លៃមធ្យមភាគ">តម្លៃលក់ (មធ្យម)</th>
                                <th class="px-5 py-4 text-center text-indigo-600 bg-indigo-50/50">ចំនួនលក់បាន</th>
                                <th class="px-5 py-4 text-right text-rose-500">សរុបថ្លៃដើម</th>
                                <th class="px-5 py-4 text-right text-blue-600">សរុបលក់បាន</th>
                                <th class="px-5 py-4 text-right text-emerald-600 bg-emerald-50/50">ប្រាក់ចំណេញ</th>
                                <th class="px-5 py-4 text-right text-amber-600 bg-amber-50/50">ចំណែកលក់ដែលត្រូវទទួលបាន</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            <tr v-if="aggregatedSales.length === 0">
                                <td colspan="9" class="py-10 text-center text-slate-400 font-bold">មិនមានទិន្នន័យលក់ទេ</td>
                            </tr>
                            <tr v-for="(item, index) in aggregatedSales" :key="index" class="hover:bg-slate-50/50">
                                <td class="px-5 py-3 text-center text-xs font-bold text-slate-400">{{ index + 1 }}</td>
                                <td class="px-5 py-3 font-bold text-slate-800 text-sm">{{ item.name }}</td>
                                <td class="px-5 py-3 text-right text-slate-500 text-sm">{{ formatCurrency(item.unitCostAvg) }}</td>
                                <td class="px-5 py-3 text-right font-black text-slate-800 text-sm">{{ formatCurrency(item.sellingPriceAvg) }}</td>
                                <td class="px-5 py-3 text-center bg-indigo-50/30">
                                    <span class="inline-flex px-3 py-1 bg-white text-indigo-700 rounded-lg text-sm font-black border border-indigo-100 shadow-sm">{{ item.qty.toLocaleString() }} ដប</span>
                                </td>
                                <td class="px-5 py-3 text-right font-bold text-rose-500 text-sm">{{ formatCurrency(item.totalCost) }}</td>
                                <td class="px-5 py-3 text-right font-black text-blue-600 text-sm">{{ formatCurrency(item.totalRevenue) }}</td>
                                <td class="px-5 py-3 text-right font-black text-emerald-600 bg-emerald-50/30 text-sm">+ {{ formatCurrency(item.profit) }}</td>
                                <td class="px-5 py-3 text-right font-black text-amber-600 bg-amber-50/30 text-base border-l border-amber-100">{{ formatCurrency(item.profitShareAmount) }}</td>
                            </tr>
                        </tbody>
                        <tfoot v-if="aggregatedSales.length > 0" class="bg-slate-800 text-white font-black text-sm">
                            <tr>
                                <td colspan="5" class="px-5 py-4 text-right text-slate-300 uppercase tracking-widest text-xs">សរុបរួម:</td>
                                <td class="px-5 py-4 text-right text-rose-400">{{ formatCurrency(salesSummary.totalCost) }}</td>
                                <td class="px-5 py-4 text-right text-blue-400">{{ formatCurrency(salesSummary.totalRevenue) }}</td>
                                <td class="px-5 py-4 text-right text-emerald-400">+ {{ formatCurrency(salesSummary.totalProfit) }}</td>
                                <td class="px-5 py-4 text-right text-amber-400 text-lg">{{ formatCurrency(salesSummary.totalShare) }}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            <div class="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                <div class="bg-slate-800 px-6 py-4 flex items-center justify-between">
                    <h3 class="text-white font-black text-lg flex items-center gap-2">
                        <div class="w-8 h-8 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        </div>
                        ទិន្នន័យសេវាដឹកជញ្ជូន
                    </h3>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse min-w-[800px]">
                        <thead class="bg-slate-50 text-slate-500 text-[11px] uppercase font-black tracking-widest border-b border-slate-200">
                            <tr>
                                <th class="px-5 py-4 w-12 text-center">ល.រ</th>
                                <th class="px-5 py-4">ទីតាំង / តំបន់</th>
                                <th class="px-5 py-4 text-center text-indigo-600 bg-indigo-50/50">ចំនួនកញ្ចប់ (វិក្កយបត្រ)</th>
                                <th class="px-5 py-4 text-right">តម្លៃ</th> 
                                <th class="px-5 py-4 text-right text-blue-600">សរុបថ្លៃដឹក</th>
                                <th class="px-5 py-4 text-right text-amber-600 bg-amber-50/50">ចំណែកដឹកដែលត្រូវទទួលបាន</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            <tr v-if="aggregatedDelivery.length === 0">
                                <td colspan="6" class="py-10 text-center text-slate-400 font-bold">មិនមានទិន្នន័យដឹកជញ្ជូនទេ</td>
                            </tr>
                            <tr v-for="(item, index) in aggregatedDelivery" :key="index" class="hover:bg-slate-50/50">
                                <td class="px-5 py-3 text-center text-xs font-bold text-slate-400">{{ index + 1 }}</td>
                                <td class="px-5 py-3 font-black text-slate-800 text-sm">
                                    <span class="inline-flex items-center gap-2 px-3 py-1 rounded-lg" :class="item.location === 'រាជធានីភ្នំពេញ' ? 'bg-blue-50 text-blue-700' : 'bg-indigo-50 text-indigo-700'">
                                        {{ item.location }}
                                    </span>
                                </td>
                                <td class="px-5 py-3 text-center bg-indigo-50/30">
                                    <span class="inline-flex px-3 py-1 bg-white text-indigo-700 rounded-lg text-sm font-black border border-indigo-100 shadow-sm">{{ item.packageCount }} កញ្ចប់</span>
                                </td>
                                <td class="px-5 py-3 text-right text-slate-500 font-bold">{{ formatCurrency(item.unitBonus) }}</td>
                                <td class="px-5 py-3 text-right font-black text-blue-600 text-sm">{{ formatCurrency(item.totalFee) }}</td>
                                <td class="px-5 py-3 text-right font-black text-amber-600 bg-amber-50/30 text-base border-l border-amber-100">
                                    {{ formatCurrency(item.shareAmount) }}
                                    <span class="text-[10px] text-amber-500 font-bold ml-1">({{ item.sharePercent }}%)</span>
                                </td>
                            </tr>
                        </tbody>
                        <tfoot v-if="aggregatedDelivery.length > 0" class="bg-slate-800 text-white font-black text-sm">
                            <tr>
                                <td colspan="2" class="px-5 py-4 text-right text-slate-300 uppercase tracking-widest text-xs">សរុបរួម:</td>
                                <td class="px-5 py-4 text-center">{{ deliverySummary.totalPackages }} កញ្ចប់</td>
                                <td class="px-5 py-4"></td>
                                <td class="px-5 py-4 text-right text-blue-400">{{ formatCurrency(deliverySummary.totalFee) }}</td>
                                <td class="px-5 py-4 text-right text-amber-400 text-lg">{{ formatCurrency(deliverySummary.totalShare) }}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            <div class="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between border border-slate-700">
                <div class="text-white mb-4 sm:mb-0">
                    <h2 class="text-3xl font-black mb-1">ប្រាក់សរុបរួមដែលត្រូវបើក</h2>
                    <p class="text-slate-400 text-sm">ចំណែកលក់ + ចំណែកដឹកជញ្ជូន</p>
                </div>
                <div class="text-5xl font-black text-emerald-400 tracking-tight">
                    {{ formatCurrency(salesSummary.totalShare + deliverySummary.totalShare) }}
                </div>
            </div>

        </div>

        <div ref="printStaging" class="fixed top-0 left-[-9999px] pointer-events-none z-[-1] opacity-0"></div>

    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { db } from '@/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useNotificationStore } from '@/stores/notification';
import { exportToPDF, exportToImage } from '../components/exportReport';

const props = defineProps({
    usersMap: Object,
    settingsList: Array,
    originalStocks: Array,
    originalCombos: Array
});

const notification = useNotificationStore();

// Filters & States
const dateFilterType = ref('day'); 
const specificDate = ref(new Date().toISOString().split('T')[0]);
const customStart = ref(new Date().toISOString().split('T')[0]);
const customEnd = ref(new Date().toISOString().split('T')[0]);
const khmerMonths = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'];
const availableYears = computed(() => { const y = new Date().getFullYear(); return [y-2, y-1, y, y+1]; });
const selectedMonth = ref(new Date().getMonth());
const selectedYear = ref(new Date().getFullYear());

const selectedAdmin = ref('');
const selectedSeller = ref('ALL'); 

// 🌟 Currency State 🌟
const displayCurrency = ref('USD');
const exchangeRate = ref(4000);

const isLoadingData = ref(false);
const isExporting = ref(false);
const printStaging = ref(null);
const allSalesInRange = ref([]); 

// 🌟 Smart Currency Formatter 🌟
const formatCurrency = (val) => {
    if (displayCurrency.value === 'KHR') {
        const khrValue = Math.round(val * exchangeRate.value);
        return khrValue.toLocaleString('en-US') + " ៛";
    } else {
        return Number(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 3 }) + " $";
    }
};

const formatKhmerDate = (dStr) => { const d = new Date(dStr); return `${String(d.getDate()).padStart(2,'0')}-${khmerMonths[d.getMonth()]}-${d.getFullYear()}`; };

const getDateBounds = () => {
    let start, end;
    if (dateFilterType.value === 'day') {
        const d = new Date(specificDate.value);
        start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
        end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
    } else if (dateFilterType.value === 'month') {
        start = new Date(selectedYear.value, selectedMonth.value, 1, 0, 0, 0);
        end = new Date(selectedYear.value, selectedMonth.value + 1, 0, 23, 59, 59, 999);
    } else if (dateFilterType.value === 'year') {
        start = new Date(selectedYear.value, 0, 1, 0, 0, 0);
        end = new Date(selectedYear.value, 11, 31, 23, 59, 59, 999);
    } else { 
        start = new Date(customStart.value); start.setHours(0,0,0,0);
        end = new Date(customEnd.value); end.setHours(23, 59, 59, 999);
    }
    return { startStr: start.toISOString(), endStr: end.toISOString() };
};

const getLabelForExport = () => {
    if (dateFilterType.value === 'day') return `ប្រចាំថ្ងៃទី ${formatKhmerDate(specificDate.value)}`;
    if (dateFilterType.value === 'month') return `ប្រចាំខែ ${khmerMonths[selectedMonth.value]} ${selectedYear.value}`;
    if (dateFilterType.value === 'year') return `ប្រចាំឆ្នាំ ${selectedYear.value}`;
    return `ចាប់ពី ${formatKhmerDate(customStart.value)} ដល់ ${formatKhmerDate(customEnd.value)}`;
};

const fetchAllSalesForDateRange = async () => {
    isLoadingData.value = true;
    try {
        const { startStr, endStr } = getDateBounds();

        // 🌟 1. បង្កើត Cache Key ចំណាំទិន្នន័យ (តាមកាលបរិច្ឆេទ និង Admin)
        const cacheKey = `sales_${startStr}_${endStr}_${selectedAdmin.value || 'ALL'}`;

        // 🌟 2. បង្កើតកន្លែងផ្ទុក Local បើមិនទាន់មាន
        if (!window.__PAYROLL_CACHE__) {
            window.__PAYROLL_CACHE__ = new Map();
        }

        // 🌟 3. ពិនិត្យមើលទិន្នន័យក្នុង Local មុននឹងទាញពី Firebase
        if (window.__PAYROLL_CACHE__.has(cacheKey)) {
            const cachedData = window.__PAYROLL_CACHE__.get(cacheKey);
            allSalesInRange.value = cachedData;
            
            if (selectedAdmin.value) {
                const hasSales = cachedData.some(s => s.sellerName && s.sellerName !== 'undefined' && s.sellerName.trim() !== '');
                if (!hasSales) selectedAdmin.value = '';
            }
            selectedSeller.value = 'ALL';
            isLoadingData.value = false;
            return; // 🛑 បញ្ឈប់កុំឱ្យទាញយកពី Firebase ទៀត
        }

        // បើគ្មានក្នុង Cache ទេ ទើបទាញពី Firebase ធម្មតា
        const constraints = [
            where('createdAt', '>=', startStr), 
            where('createdAt', '<=', endStr)
        ];
        
        if (selectedAdmin.value) {
            constraints.push(where('createdBy', '==', selectedAdmin.value));
        }

        const q = query(collection(db, 'sales_reports'), ...constraints);
        
        const snap = await getDocs(q);
        
        // យកតែវិក្កយបត្រណាដែលមានការទូទាត់រួច (PAID) ប៉ុណ្ណោះ
        const validSales = snap.docs
            .map(d => ({ id: d.id, ...d.data() }))
            .filter(s => s.paymentStatus === 'PAID'); 
            
        allSalesInRange.value = validSales;

        // 🌟 4. ក្រោយពេលទាញយកបានពី Firebase ហើយ ត្រូវរក្សាទុកវាចូល Local Cache
        window.__PAYROLL_CACHE__.set(cacheKey, validSales);

        if (selectedAdmin.value) {
            const hasSales = validSales.some(s => s.sellerName && s.sellerName !== 'undefined' && s.sellerName.trim() !== '');
            if (!hasSales) selectedAdmin.value = '';
        }
        selectedSeller.value = 'ALL';

    } catch (e) {
        console.error(e);
    } finally {
        isLoadingData.value = false;
    }
};

watch([dateFilterType, specificDate, selectedMonth, selectedYear, customStart, customEnd, selectedAdmin], () => {
    fetchAllSalesForDateRange();
});

onMounted(() => { fetchAllSalesForDateRange(); });

const activeAdminsList = computed(() => {
    const activeIds = new Set();
    allSalesInRange.value.forEach(sale => {
        if (sale.createdBy && sale.sellerName && sale.sellerName !== 'undefined' && sale.sellerName.trim() !== '') {
            activeIds.add(sale.createdBy);
        }
    });
    return Array.from(activeIds).map(id => ({
        id: id,
        name: props.usersMap[id] || id
    })).sort((a, b) => a.name.localeCompare(b.name));
});

const activeSellersList = computed(() => {
    if (!selectedAdmin.value) return [];
    const sellers = new Set();
    allSalesInRange.value.forEach(s => {
        if (s.createdBy === selectedAdmin.value && s.sellerName && s.sellerName !== 'undefined' && s.sellerName.trim() !== '') {
            sellers.add(s.sellerName);
        }
    });
    return Array.from(sellers).sort();
});

watch(selectedAdmin, () => { selectedSeller.value = 'ALL'; });

const filteredSales = computed(() => {
    if (!selectedAdmin.value) return [];
    return allSalesInRange.value.filter(s => {
        const matchAdmin = s.createdBy === selectedAdmin.value;
        const hasValidSeller = s.sellerName && s.sellerName !== 'undefined' && s.sellerName.trim() !== '';
        if (!hasValidSeller) return false;

        const matchSeller = selectedSeller.value === 'ALL' || s.sellerName === selectedSeller.value;
        return matchAdmin && matchSeller;
    });
});

const getSettingForSeller = (adminId, sellerName) => {
    const setting = props.settingsList.find(s => s.adminId === adminId && s.sellerName === sellerName);
    let fallbackShare = setting ? (setting.deliveryShare || 0) : 0;
    return setting || { 
        profitShare: 0, 
        deliveryPricePP: 0, 
        deliveryPriceProv: 0, 
        deliverySharePP: fallbackShare, 
        deliveryShareProv: fallbackShare 
    };
};

const aggregatedSales = computed(() => {
    if (!selectedAdmin.value) return [];
    
    const resultObj = {};

    filteredSales.value.forEach(inv => {
        const currencyMulti = (inv.currency === 'KHR') ? (1/4000) : 1;
        const sellerSetting = getSettingForSeller(inv.createdBy, inv.sellerName);
        const profitPercent = (sellerSetting.profitShare || 0) / 100;

        if (inv.items) {
            inv.items.forEach(item => {
                if (item.isCombo) {
                    const comboData = props.originalCombos.find(c => c.id === item.id);
                    if (comboData && comboData.items) {
                        let totalComboCost = 0;
                        const comboItemsWithCost = comboData.items.map(subItem => {
                            const baseProd = props.originalStocks.find(s => s.id === subItem.productId);
                            const subIpc = baseProd ? (Number(baseProd.itemsPerCase) || 1) : 1;
                            const costPerBottle = baseProd ? (Number(baseProd.unitCost) / subIpc) : 0;
                            totalComboCost += costPerBottle * Number(subItem.qty);
                            return { ...subItem, baseProd, costPerBottle };
                        });

                        const comboRevenue = Number(item.qty) * Number(item.price) * currencyMulti;

                        comboItemsWithCost.forEach(subItem => {
                            if (subItem.baseProd) {
                                const baseProdId = subItem.baseProd.id;
                                const ratio = totalComboCost > 0 ? ((subItem.costPerBottle * Number(subItem.qty)) / totalComboCost) : (1 / comboItemsWithCost.length);
                                const allocatedRevenue = comboRevenue * ratio;
                                const totalBottlesSold = Number(subItem.qty) * Number(item.qty);
                                
                                const key = baseProdId;

                                if (!resultObj[key]) {
                                    resultObj[key] = { id: baseProdId, name: subItem.baseProd.name, qty: 0, totalCost: 0, totalRevenue: 0, profitShareAmount: 0 };
                                }

                                const itemTotalCost = totalBottlesSold * subItem.costPerBottle;
                                const itemProfit = allocatedRevenue - itemTotalCost;

                                resultObj[key].qty += totalBottlesSold;
                                resultObj[key].totalCost += itemTotalCost;
                                resultObj[key].totalRevenue += allocatedRevenue;
                                resultObj[key].profitShareAmount += (itemProfit * profitPercent); 
                            }
                        });
                    }
                } else {
                    const baseProd = props.originalStocks.find(s => s.id === item.id);
                    const ipc = Number(baseProd?.itemsPerCase || 1);
                    
                    let recordedCost = Number(item.cost || 0);
                    let recordedPrice = Number(item.price || 0) * currencyMulti;
                    let baseSellingPrice = recordedPrice;
                    let baseCost = recordedCost;
                    let itemQty = Number(item.qty || 0);

                    if (item.unit === 'case') {
                        itemQty = itemQty * ipc;
                        baseSellingPrice = recordedPrice / ipc;
                        baseCost = recordedCost / ipc;
                    } 
                    
                    const key = item.id;

                    if (!resultObj[key]) {
                        resultObj[key] = { id: item.id, name: item.name, qty: 0, totalCost: 0, totalRevenue: 0, profitShareAmount: 0 };
                    }

                    const itemTotalCost = itemQty * baseCost;
                    const itemTotalRev = itemQty * baseSellingPrice;
                    const itemProfit = itemTotalRev - itemTotalCost;

                    resultObj[key].qty += itemQty;
                    resultObj[key].totalCost += itemTotalCost;
                    resultObj[key].totalRevenue += itemTotalRev;
                    resultObj[key].profitShareAmount += (itemProfit * profitPercent); 
                }
            });
        }
    });

    return Object.values(resultObj).map(row => {
        return { 
            ...row, 
            unitCostAvg: row.totalCost / row.qty,
            sellingPriceAvg: row.totalRevenue / row.qty,
            profit: row.totalRevenue - row.totalCost 
        };
    }).sort((a, b) => b.qty - a.qty);
});

const salesSummary = computed(() => {
    return aggregatedSales.value.reduce((acc, row) => {
        acc.totalCost += row.totalCost;
        acc.totalRevenue += row.totalRevenue;
        acc.totalProfit += row.profit;
        acc.totalShare += row.profitShareAmount;
        return acc;
    }, { totalCost: 0, totalRevenue: 0, totalProfit: 0, totalShare: 0 });
});

// 🌟 Delivery Logic Updated 🌟
const aggregatedDelivery = computed(() => {
    if (!selectedAdmin.value) return [];
    
    const result = {
        'PP': { location: 'រាជធានីភ្នំពេញ', packageCount: 0, totalFee: 0, shareAmount: 0, sharePercent: 0, unitBonus: 0 }, 
        'PROV': { location: 'តាមបណ្តាខេត្ត', packageCount: 0, totalFee: 0, shareAmount: 0, sharePercent: 0, unitBonus: 0 }
    };

    filteredSales.value.forEach(inv => {
        let dFee = Number(inv.deliveryFee) || 0;
        if (dFee <= 0 && (!inv.province || inv.province === '')) return; 

        const sellerSetting = getSettingForSeller(inv.createdBy, inv.sellerName);
        
        let isPP = inv.province === 'រាជធានីភ្នំពេញ' || (inv.location && inv.location.includes('ភ្នំពេញ'));
        
        const appliedPercent = (sellerSetting.profitShare || 0) / 100; 
        
        const appliedPrice = isPP ? Number(sellerSetting.deliveryPricePP || 0) 
                                  : Number(sellerSetting.deliveryPriceProv || 0);

        let bucketKey = isPP ? 'PP' : 'PROV';

        result[bucketKey].packageCount += 1; 
        result[bucketKey].totalFee += appliedPrice;
        result[bucketKey].shareAmount += (appliedPrice * appliedPercent);
        
        result[bucketKey].sharePercent = sellerSetting.profitShare || 0; 
        result[bucketKey].unitBonus = appliedPrice; 
    });

    const finalArray = [];
    if (result['PP'].packageCount > 0) finalArray.push(result['PP']);
    if (result['PROV'].packageCount > 0) finalArray.push(result['PROV']);

    return finalArray.sort((a,b) => b.packageCount - a.packageCount);
});

const deliverySummary = computed(() => {
    return aggregatedDelivery.value.reduce((acc, row) => {
        acc.totalPackages += row.packageCount;
        acc.totalFee += row.totalFee;
        acc.totalShare += row.shareAmount;
        return acc;
    }, { totalPackages: 0, totalFee: 0, totalShare: 0 });
});

// ==========================================
// 🌟 EXPORT LOGIC 🌟
// ==========================================

const handleCopyText = () => {
    let adminName = props.usersMap[selectedAdmin.value] || selectedAdmin.value;
    let sellerName = selectedSeller.value === 'ALL' ? 'ទាំងអស់' : selectedSeller.value;

    let text = `📊 របាយការណ៍ ចែកភាគរយតំណាងលក់\n📅 ${getLabelForExport()}\n`;
    text += `👤 Admin: ${adminName} | តំណាងលក់: ${sellerName}\n`;
    if (displayCurrency.value === 'KHR') {
        text += `💱 អត្រាប្តូរប្រាក់: 1$ = ${exchangeRate.value.toLocaleString()} ៛\n`;
    }
    text += `\n=== ទិន្នន័យលក់ទំនិញ ===\n`;
    
    aggregatedSales.value.forEach((item, i) => { 
        text += `${i+1}. ${item.name} | ${item.qty} ដប | ចំណែក: ${formatCurrency(item.profitShareAmount)}\n`; 
    });
    
    if(aggregatedDelivery.value.length > 0) {
        text += `\n=== ទិន្នន័យដឹកជញ្ជូន ===\n`;
        aggregatedDelivery.value.forEach((item, i) => { 
            text += `- ${item.location} | ${item.packageCount} កញ្ចប់ | ចំណែក: ${formatCurrency(item.shareAmount)}\n`; 
        });
    }

    text += `\n-----------------------------------\n`;
    text += `💰 ចំណែកលក់សរុប: ${formatCurrency(salesSummary.value.totalShare)}\n`;
    text += `🛵 ចំណែកដឹកសរុប: ${formatCurrency(deliverySummary.value.totalShare)}\n`;
    text += `✅ ប្រាក់សរុបរួមត្រូវបើក: ${formatCurrency(salesSummary.value.totalShare + deliverySummary.value.totalShare)}\n`;
    
    navigator.clipboard.writeText(text);
    notification.success("បានចម្លងអត្ថបទដោយជោគជ័យ!");
};

const getHTMLTemplate = () => {
    let adminName = props.usersMap[selectedAdmin.value] || selectedAdmin.value;
    let sellerName = selectedSeller.value === 'ALL' ? 'ទាំងអស់' : selectedSeller.value;

    const sellerSetting = selectedSeller.value !== 'ALL' ? getSettingForSeller(selectedAdmin.value, selectedSeller.value) : null;
    const profitShareDisplay = sellerSetting ? `(${sellerSetting.profitShare}%)` : '';

    const salesRowsHTML = aggregatedSales.value.map((item, i) => `
        <tr style="background-color: ${i % 2 === 0 ? '#ffffff' : '#f8fafc'};">
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center; color: #64748b; font-size: 13px;">${i + 1}</td>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #1e293b; font-size: 13px;">${item.name}</td>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right; color: #64748b; font-size: 13px;">${formatCurrency(item.unitCostAvg)}</td>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: bold; color: #1e293b; font-size: 13px;">${formatCurrency(item.sellingPriceAvg)}</td>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center; font-weight: bold; color: #4338ca; font-size: 13px; background-color: #eef2ff;">${item.qty.toLocaleString()} ដប</td>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: bold; color: #ef4444; font-size: 13px;">${formatCurrency(item.totalCost)}</td>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: bold; color: #3b82f6; font-size: 13px;">${formatCurrency(item.totalRevenue)}</td>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: bold; color: #10b981; font-size: 13px;">+ ${formatCurrency(item.profit)}</td>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 900; color: #d97706; font-size: 14px; background-color: #fffbeb;">${formatCurrency(item.profitShareAmount)}</td>
        </tr>
    `).join('');

    const deliveryRowsHTML = aggregatedDelivery.value.map((item, i) => `
        <tr style="background-color: ${i % 2 === 0 ? '#ffffff' : '#f8fafc'};">
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center; color: #64748b; font-size: 13px;">${i + 1}</td>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #1e293b; font-size: 13px;">${item.location}</td>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center; font-weight: bold; color: #4338ca; font-size: 13px; background-color: #eef2ff;">${item.packageCount} កញ្ចប់</td>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right; color: #64748b; font-size: 13px;">${formatCurrency(item.unitBonus)}</td>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: bold; color: #3b82f6; font-size: 13px;">${formatCurrency(item.totalFee)}</td>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 900; color: #d97706; font-size: 14px; background-color: #fffbeb;">
                ${formatCurrency(item.shareAmount)} <span style="font-size: 10px; color:#f59e0b;">(${item.sharePercent}%)</span>
            </td>
        </tr>
    `).join('');

    return `
        <div id="payroll-export-content" style="width: 1050px; padding: 50px; background-color: #ffffff; font-family: 'Battambong', 'Khmer OS Battambong', sans-serif; position: relative;">
            
            <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #1e293b; padding-bottom: 20px; margin-bottom: 30px;">
                <div>
                    <h1 style="margin: 0 0 10px 0; font-size: 28px; color: #0f172a; font-weight: 900; letter-spacing: 1px;">របាយការណ៍ ចែកភាគរយតំណាងលក់</h1>
                    <div style="display: inline-block; background-color: #f1f5f9; padding: 6px 12px; border-radius: 6px; border: 1px solid #cbd5e1; font-size: 14px; color: #475569; font-weight: bold;">
                        📅 ${getLabelForExport()}
                    </div>
                </div>
                <div style="text-align: right; border: 1px solid #e2e8f0; border-radius: 12px; padding: 15px; background: #f8fafc; min-width: 250px;">
                    <p style="margin: 0 0 8px 0; font-size: 13px; color: #64748b; font-weight: bold; text-transform: uppercase;">ព័ត៌មានបុគ្គលិក</p>
                    <p style="margin: 0 0 5px 0; font-size: 15px; color: #1e293b;">Admin: <b style="color: #4f46e5;">${adminName}</b></p>
                    <p style="margin: 0; font-size: 15px; color: #1e293b;">តំណាងលក់: <b style="color: #10b981;">${sellerName}</b></p>
                    ${displayCurrency.value === 'KHR' ? `<p style="margin: 5px 0 0 0; font-size: 13px; color: #d97706; border-top: 1px dashed #cbd5e1; padding-top: 5px;">អត្រាប្តូរប្រាក់: 1$ = ${exchangeRate.value.toLocaleString()} ៛</p>` : ''}
                </div>
            </div>

            <div style="margin-bottom: 40px;">
                <div style="background-color: #10b981; color: white; padding: 12px 15px; border-radius: 8px 8px 0 0; display: flex; align-items: center; gap: 10px;">
                    <h3 style="margin: 0; font-size: 16px;">១. ទិន្នន័យលក់ទំនិញ (ខ្នាតដប)</h3>
                </div>
                <table style="width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0;">
                    <thead>
                        <tr style="background-color: #f1f5f9; border-bottom: 2px solid #cbd5e1;">
                            <th style="padding: 12px 10px; text-align: center; font-size: 12px; color: #475569;">#</th>
                            <th style="padding: 12px 10px; text-align: left; font-size: 12px; color: #475569;">ឈ្មោះមុខទំនិញ</th>
                            <th style="padding: 12px 10px; text-align: right; font-size: 12px; color: #475569;">តម្លៃដើម</th>
                            <th style="padding: 12px 10px; text-align: right; font-size: 12px; color: #475569;">តម្លៃលក់</th>
                            <th style="padding: 12px 10px; text-align: center; font-size: 12px; color: #4338ca;">ចំនួនលក់បាន</th>
                            <th style="padding: 12px 10px; text-align: right; font-size: 12px; color: #ef4444;">សរុបថ្លៃដើម</th>
                            <th style="padding: 12px 10px; text-align: right; font-size: 12px; color: #3b82f6;">សរុបលក់បាន</th>
                            <th style="padding: 12px 10px; text-align: right; font-size: 12px; color: #10b981;">ប្រាក់ចំណេញ</th>
                            <th style="padding: 12px 10px; text-align: right; font-size: 12px; color: #d97706;">ចំណែកលក់ ${profitShareDisplay}</th>
                        </tr>
                    </thead>
                    <tbody>${salesRowsHTML}</tbody>
                    <tfoot>
                        <tr style="background-color: #1e293b; color: white;">
                            <td colspan="5" style="padding: 12px 10px; text-align: right; font-weight: bold; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">សរុបរួម:</td>
                            <td style="padding: 12px 10px; text-align: right; font-weight: bold; font-size: 14px; color: #f87171;">${formatCurrency(salesSummary.value.totalCost)}</td>
                            <td style="padding: 12px 10px; text-align: right; font-weight: bold; font-size: 14px; color: #60a5fa;">${formatCurrency(salesSummary.value.totalRevenue)}</td>
                            <td style="padding: 12px 10px; text-align: right; font-weight: bold; font-size: 14px; color: #34d399;">+ ${formatCurrency(salesSummary.value.totalProfit)}</td>
                            <td style="padding: 12px 10px; text-align: right; font-weight: 900; font-size: 16px; color: #fbbf24;">${formatCurrency(salesSummary.value.totalShare)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div style="margin-bottom: 40px;">
                <div style="background-color: #f59e0b; color: white; padding: 12px 15px; border-radius: 8px 8px 0 0; display: flex; align-items: center; gap: 10px;">
                    <h3 style="margin: 0; font-size: 16px;">២. ទិន្នន័យសេវាដឹកជញ្ជូន</h3>
                </div>
                ${aggregatedDelivery.value.length > 0 ? `
                <table style="width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0;">
                    <thead>
                        <tr style="background-color: #f1f5f9; border-bottom: 2px solid #cbd5e1;">
                            <th style="padding: 12px 10px; text-align: center; font-size: 12px; color: #475569;">#</th>
                            <th style="padding: 12px 10px; text-align: left; font-size: 12px; color: #475569;">ទីតាំង / តំបន់</th>
                            <th style="padding: 12px 10px; text-align: center; font-size: 12px; color: #4338ca;">ចំនួនកញ្ចប់</th>
                            <th style="padding: 12px 10px; text-align: right; font-size: 12px; color: #475569;">តម្លៃ</th>
                            <th style="padding: 12px 10px; text-align: right; font-size: 12px; color: #3b82f6;">សរុបថ្លៃដឹក</th>
                            <th style="padding: 12px 10px; text-align: right; font-size: 12px; color: #d97706;">ចំណែកដឹក ${profitShareDisplay}</th>
                        </tr>
                    </thead>
                    <tbody>${deliveryRowsHTML}</tbody>
                    <tfoot>
                        <tr style="background-color: #1e293b; color: white;">
                            <td colspan="2" style="padding: 12px 10px; text-align: right; font-weight: bold; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">សរុបរួម:</td>
                            <td style="padding: 12px 10px; text-align: center; font-weight: bold; font-size: 14px;">${deliverySummary.value.totalPackages} កញ្ចប់</td>
                            <td></td>
                            <td style="padding: 12px 10px; text-align: right; font-weight: bold; font-size: 14px; color: #60a5fa;">${formatCurrency(deliverySummary.value.totalFee)}</td>
                            <td style="padding: 12px 10px; text-align: right; font-weight: 900; font-size: 16px; color: #fbbf24;">${formatCurrency(deliverySummary.value.totalShare)}</td>
                        </tr>
                    </tfoot>
                </table>
                ` : '<div style="border: 1px dashed #cbd5e1; border-top: none; padding: 30px; text-align: center; color: #94a3b8; font-size: 14px; font-weight: bold; background: #f8fafc; border-radius: 0 0 8px 8px;">មិនមានទិន្នន័យដឹកជញ្ជូនទេ</div>'}
            </div>

            <div style="display: flex; justify-content: flex-end;">
                <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); width: 450px; border-radius: 16px; padding: 25px; color: white; display: flex; flex-direction: column; align-items: flex-end; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);">
                    <div style="display: flex; justify-content: space-between; width: 100%; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px; margin-bottom: 10px;">
                        <span style="color: #cbd5e1; font-size: 14px;">សរុបចំណែកលក់:</span>
                        <span style="font-weight: bold; font-size: 15px;">${formatCurrency(salesSummary.value.totalShare)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; width: 100%; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px; margin-bottom: 15px;">
                        <span style="color: #cbd5e1; font-size: 14px;">សរុបចំណែកដឹកជញ្ជូន:</span>
                        <span style="font-weight: bold; font-size: 15px;">${formatCurrency(deliverySummary.value.totalShare)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
                        <div>
                            <h3 style="margin: 0; font-size: 18px; color: #ffffff;">ប្រាក់ត្រូវបើកសរុប</h3>
                            <p style="margin: 0; font-size: 11px; color: #94a3b8;">GRAND TOTAL</p>
                        </div>
                        <div style="font-size: 34px; font-weight: 900; color: #34d399; letter-spacing: -0.5px;">
                            ${formatCurrency(salesSummary.value.totalShare + deliverySummary.value.totalShare)}
                        </div>
                    </div>
                </div>
            </div>

            <div style="margin-top: 50px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #f1f5f9; padding-top: 20px;">
                របាយការណ៍នេះត្រូវបានបង្កើតដោយប្រព័ន្ធស្វ័យប្រវត្តិ • ថ្ងៃទី ${new Date().toLocaleDateString('en-GB')} ម៉ោង ${new Date().toLocaleTimeString()}
            </div>
        </div>
    `;
};

const handleExport = async (type) => {
    isExporting.value = true;
    try {
        printStaging.value.innerHTML = getHTMLTemplate();
        await nextTick(); 
        await document.fonts.ready; 
        await new Promise(r => setTimeout(r, 400));
        
        let filename = `Payroll_${props.usersMap[selectedAdmin.value]}_${new Date().getTime()}`;

        if (type === 'image') {
            await exportToImage('payroll-export-content', filename);
            notification.success("ទាញយករូបភាពបានជោគជ័យ!");
        } else if (type === 'pdf') {
            await exportToPDF('payroll-export-content', filename);
            notification.success("ទាញយក PDF បានជោគជ័យ!");
        }
        
        printStaging.value.innerHTML = '';
    } catch(e) { 
        console.error(e); 
        notification.error("បរាជ័យក្នុងការទាញយក!");
    } finally { 
        isExporting.value = false; 
    }
};

</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }

.animate-fade-in-up { animation: fadeInUp 0.3s ease-out forwards; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
</style>