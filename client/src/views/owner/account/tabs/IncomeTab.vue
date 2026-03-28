<template>
  <div class="font-khmer relative print-container print:bg-white min-h-screen pb-10">
    
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-32 opacity-60 print:hidden">
       <div class="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-indigo-600 mb-4"></div>
       <p class="text-slate-500 font-bold">កំពុងទាញយកទិន្នន័យវៃឆ្លាត...</p>
    </div>

    <div v-else class="space-y-6 print:hidden animate-fade-in-up">
        
        <div v-show="activeSubTab === 'sold'" class="space-y-6 animate-fade-in">
            <div class="bg-white p-4 rounded-[1.5rem] border border-slate-200 shadow-sm flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 relative z-20">
                <div class="flex flex-wrap items-center gap-3 w-full xl:w-auto overflow-x-auto no-scrollbar">
                    <div class="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
                        <button @click="dateFilterType = 'day'" :class="dateFilterType === 'day' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:text-indigo-600'" class="py-1.5 px-4 rounded-lg font-bold text-sm transition-all whitespace-nowrap">ថ្ងៃ</button>
                        <button @click="dateFilterType = 'month'" :class="dateFilterType === 'month' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:text-indigo-600'" class="py-1.5 px-4 rounded-lg font-bold text-sm transition-all whitespace-nowrap">ខែ</button>
                        <button @click="dateFilterType = 'year'" :class="dateFilterType === 'year' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:text-indigo-600'" class="py-1.5 px-4 rounded-lg font-bold text-sm transition-all whitespace-nowrap">ឆ្នាំ</button>
                    </div>
                    <div class="flex items-center gap-2 shrink-0">
                        <input v-if="dateFilterType === 'day'" type="date" v-model="specificDate" class="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-sm font-bold text-slate-700 outline-none focus:border-indigo-500 cursor-pointer">
                        <template v-if="dateFilterType === 'month'">
                            <select v-model="selectedMonth" class="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-sm font-bold text-slate-700 outline-none cursor-pointer"><option v-for="(m, i) in khmerMonths" :key="i" :value="i">{{ m }}</option></select>
                            <select v-model="selectedYear" class="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-sm font-bold text-slate-700 outline-none cursor-pointer"><option v-for="y in availableYears" :key="y" :value="y">{{ y }}</option></select>
                        </template>
                    </div>
                </div>

                <div class="flex items-center gap-2 shrink-0">
                    <button @click="showSummaryModal = true" class="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm active:scale-95 transition-all">
                        របាយការណ៍សង្ខេប
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
                        <div><p class="text-sm font-bold text-slate-500">ចំណូលសរុប</p></div>
                    </div>
                    <h2 class="text-3xl font-black text-slate-800 relative z-10">{{ formatCurrency(summary.totalRevenueUSD) }}</h2>
                </div>
                <div class="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-bl-full -mr-4 -mt-4"></div>
                    <div class="flex items-center gap-4 mb-4 relative z-10">
                        <div class="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center border border-rose-100">
                            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                        </div>
                        <div><p class="text-sm font-bold text-slate-500">ថ្លៃដើមសរុប</p></div>
                    </div>
                    <h2 class="text-3xl font-black text-slate-800 relative z-10">{{ formatCurrency(summary.totalCostUSD) }}</h2>
                </div>
                <div class="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-200 shadow-sm relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-bl-full -mr-4 -mt-4"></div>
                    <div class="flex items-center gap-4 mb-4 relative z-10">
                        <div class="w-14 h-14 bg-white text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm">
                            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                        </div>
                        <div><p class="text-sm font-bold text-emerald-700">ចំណេញសុទ្ធ</p></div>
                    </div>
                    <h2 class="text-4xl font-black text-emerald-600 relative z-10">{{ formatCurrency(summary.netProfitUSD) }}</h2>
                </div>
            </div>

            <div class="space-y-4">
                <div class="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-4 print:hidden">
                    <div class="flex items-center bg-slate-50 rounded-xl px-3 py-1 flex-1 min-w-[200px]">
                        <svg class="w-5 h-5 text-slate-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        <input v-model="searchQuery" type="text" placeholder="ស្វែងរកឈ្មោះទំនិញ..." class="w-full bg-transparent border-none outline-none text-sm font-bold py-2">
                    </div>
                    
                    <label class="flex items-center gap-2 cursor-pointer bg-rose-50 px-4 py-2.5 rounded-xl border border-rose-200 hover:bg-rose-100 transition-colors">
                        <input type="checkbox" v-model="showLowStockOnly" class="w-4 h-4 accent-rose-600 cursor-pointer">
                        <span class="text-sm font-black text-rose-600 flex items-center gap-1.5">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                            បង្ហាញតែទំនិញជិតអស់ស្តុក
                        </span>
                    </label>
                </div>

                <div class="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                    <div class="overflow-x-auto custom-scrollbar min-h-[300px]">
                        <table class="w-full text-left border-collapse min-w-[1000px]">
                            <thead class="bg-slate-50 text-slate-500 text-[11px] uppercase font-black tracking-widest border-b border-slate-200">
                                <tr>
                                    <th class="px-6 py-4 whitespace-nowrap w-12 text-center">#</th>
                                    <th class="px-6 py-4 whitespace-nowrap">ឈ្មោះទំនិញ</th>
                                    <th class="px-6 py-4 text-center whitespace-nowrap text-indigo-600 bg-indigo-50/50">បរិមាណលក់សរុប</th>
                                    <th class="px-6 py-4 text-center whitespace-nowrap text-amber-600 bg-amber-50/50">សល់ក្នុងស្តុក</th>
                                    <th class="px-6 py-4 text-right whitespace-nowrap text-blue-600">ចំណូល (Rev)</th>
                                    <th class="px-6 py-4 text-right whitespace-nowrap text-rose-500">ថ្លៃដើម (Cost)</th>
                                    <th class="px-6 py-4 text-right whitespace-nowrap text-emerald-600 bg-emerald-50/50">ចំណេញសុទ្ធ</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                <tr v-if="paginatedProducts.length === 0">
                                    <td colspan="7" class="py-16 text-center text-slate-400 font-bold">មិនមានទិន្នន័យទេ</td>
                                </tr>
                                <tr v-for="(item, index) in paginatedProducts" :key="index" class="hover:bg-slate-50/80 transition-colors">
                                    <td class="px-6 py-4 text-center text-sm font-bold text-slate-400">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                                    <td class="px-6 py-4"><p class="text-sm font-bold text-slate-800">{{ item.name }}</p></td>
                                    <td class="px-6 py-4 text-center bg-indigo-50/30">
                                        <span class="inline-flex px-3 py-1 bg-white text-indigo-700 rounded-lg text-sm font-black border border-indigo-100">{{ item.qty.toLocaleString() }} {{ item.unitStr }}</span>
                                    </td>
                                    <td class="px-6 py-4 text-center bg-amber-50/30">
                                        <span class="inline-flex items-center px-3 py-1 rounded-lg text-[12px] font-black border transition-all" :class="item.stockInfo.isLow ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-white text-amber-700 border-amber-200'">
                                            <svg v-if="item.stockInfo.isLow" class="w-3.5 h-3.5 mr-1.5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                            {{ item.stockInfo.text }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 text-right font-black text-slate-800">{{ formatCurrency(item.revenue) }}</td>
                                    <td class="px-6 py-4 text-right font-bold text-rose-500">{{ formatCurrency(item.cost) }}</td>
                                    <td class="px-6 py-4 text-right bg-emerald-50/30">
                                        <span class="inline-flex px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-lg text-sm font-black">+ {{ formatCurrency(item.revenue - item.cost) }}</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div v-if="totalPages > 1" class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex justify-between">
                    <p class="text-xs font-bold text-slate-500">ទំព័រ {{ currentPage }} នៃ {{ totalPages }}</p>
                    <div class="flex gap-1.5">
                        <button @click="currentPage--" :disabled="currentPage === 1" class="w-8 h-8 rounded-lg border text-slate-600 disabled:opacity-30">&lt;</button>
                        <button @click="currentPage++" :disabled="currentPage === totalPages" class="w-8 h-8 rounded-lg border text-slate-600 disabled:opacity-30">&gt;</button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="activeSubTab === 'current'" class="animate-fade-in">
             <CurrentStockMain />
        </div>

        <div v-if="activeSubTab === 'supplier'" class="animate-fade-in">
             <RestockMain />
        </div>

        <div v-if="activeSubTab === 'import'" class="animate-fade-in">
            <StockImportMain />
        </div>

        <IncomeQuickModal 
            v-if="showSummaryModal"
            :is-open="showSummaryModal" 
            :stocks="originalStocksGlobal" 
            :combos="combosGlobal" 
            @close="showSummaryModal = false" 
        />

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, defineProps } from 'vue';
import { db } from '@/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';

import IncomeQuickModal from './components/IncomeQuickModal.vue';
import CurrentStockMain from './components/stocknow/CurrentStockMain.vue';
import RestockMain from './components/stocknow/RestockMain.vue'; 
import StockImportMain from './components/stocknow/StockImportMain.vue';

// 🌟 ទទួល State ពី File មេ AccountMain.vue
const props = defineProps({
    activeSubTab: {
        type: String,
        default: 'sold'
    }
});

// Existing States
const isLoading = ref(false);
const allSalesRaw = ref([]);
const searchQuery = ref('');
const showLowStockOnly = ref(false);

const dateFilterType = ref('today'); 
const specificDate = ref(new Date().toISOString().split('T')[0]);
const khmerMonths = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'];
const availableYears = computed(() => { const y = new Date().getFullYear(); return [y-2, y-1, y, y+1]; });
const selectedMonth = ref(new Date().getMonth());
const selectedYear = ref(new Date().getFullYear());

const currentPage = ref(1);
const itemsPerPage = 50;
const showSummaryModal = ref(false);

const originalStocksGlobal = ref([]);
const combosGlobal = ref([]);

const formatCurrency = (val) => Number(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " $";

const translateHardcodedUnit = (u) => { 
    const m = { bottle: 'ដប', case: 'កេះ', pack: 'កញ្ចប់', can: 'កំប៉ុង', kg: 'គីឡូ', set: 'ឈុត', sheet: 'សន្លឹក', box: 'ប្រអប់' }; 
    return m[u] || u; 
};

const getDateBounds = () => {
    let start, end;
    if (dateFilterType.value === 'today') {
        const now = new Date();
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    } else if (dateFilterType.value === 'day') {
        const d = new Date(specificDate.value);
        start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
        end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
    } else {
        start = new Date(selectedYear.value, selectedMonth.value, 1, 0, 0, 0);
        end = new Date(selectedYear.value, selectedMonth.value + 1, 0, 23, 59, 59, 999);
    }
    return { startStr: start.toISOString(), endStr: end.toISOString() };
};

const getDynamicStockInfo = (id) => {
    let product = originalStocksGlobal.value.find(s => s.id === id);
    if (!product) return { text: 'N/A', isLow: false };
    
    const category = product.category || '';
    const qtyBase = Number(product.quantity || 0);
    const ipc = Number(product.itemsPerCase || 1);
    
    let retailTotal = 0;
    let cases = 0;
    let isLow = false;
    let text = '';

    if (category === 'ម៉ាស់' || category === 'POL') {
        const ipb = Number(product.itemsPerBox) || 12; 
        retailTotal = Math.floor(qtyBase * ipc * ipb);
        cases = Math.floor(retailTotal / (ipc * ipb));
        
        isLow = cases <= 40 || retailTotal <= 0; 

        if (retailTotal <= 0) return { text: 'អស់ស្តុក', isLow: true };

        const remainder = retailTotal % (ipc * ipb);
        const boxes = Math.floor(remainder / ipb);
        const retailPieces = remainder % ipb;
        const retailLabel = category === 'ម៉ាស់' ? 'សន្លឹក' : 'ដប';

        let result = [];
        if (cases > 0) result.push(`${cases.toLocaleString()} កេះ`);
        if (boxes > 0) result.push(`${boxes.toLocaleString()} ប្រអប់`);
        if (retailPieces > 0) result.push(`${retailPieces.toLocaleString()} ${retailLabel}`);
        text = result.join(' ');
        
    } else {
        retailTotal = Math.floor(qtyBase * ipc);
        cases = Math.floor(retailTotal / ipc);
        
        if (ipc > 1) { isLow = cases <= 40 || retailTotal <= 0; } 
        else { isLow = retailTotal <= 200; }

        if (retailTotal <= 0) return { text: 'អស់ស្តុក', isLow: true };

        if (ipc <= 1 || !product.retailUnit) {
            text = `${retailTotal.toLocaleString()} ${translateHardcodedUnit(product.retailUnit || product.unit || 'bottle')}`;
        } else {
            const remainder = retailTotal % ipc;
            let result = [];
            if (cases > 0) result.push(`${cases.toLocaleString()} ${translateHardcodedUnit(product.unit || 'case')}`);
            if (remainder > 0) result.push(`${remainder.toLocaleString()} ${translateHardcodedUnit(product.retailUnit || 'bottle')}`);
            text = result.join(' ');
        }
    }

    return { text, isLow };
};

const fetchSalesData = async () => {
    isLoading.value = true;
    try {
        if (originalStocksGlobal.value.length === 0) {
            const stockSnap = await getDocs(collection(db, 'stocks'));
            originalStocksGlobal.value = stockSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        }
        if (combosGlobal.value.length === 0) {
            const comboSnap = await getDocs(collection(db, 'combos'));
            combosGlobal.value = comboSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        }

        const { startStr, endStr } = getDateBounds();
        const q = query(collection(db, 'sales_reports'), where('createdAt', '>=', startStr), where('createdAt', '<=', endStr));
        const querySnapshot = await getDocs(q);
        
        const rawSales = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.paymentStatus === 'CANCELED') return;
            
            let revenueUSD = 0, costUSD = 0;
            let dFee = Number(data.deliveryFee) || 0;
            if (data.deliveryCurrency === 'KHR' || dFee > 5) dFee = dFee / 4000;
            revenueUSD += dFee;

            if (data.items) {
                data.items.forEach(item => {
                    const qty = Number(item.qty || 0);
                    const price = Number(item.price || 0);
                    const unitCostToCalculate = Number(item.cost || 0);
                    if (data.currency === 'USD' || data.currency === '$' || !data.currency) {
                        revenueUSD += (qty * price); costUSD += (qty * unitCostToCalculate);
                    }
                });
            }
            rawSales.push({ id: doc.id, ...data, revenueUSD, costUSD });
        });
        allSalesRaw.value = rawSales;
    } catch (error) { console.error(error); } finally { isLoading.value = false; }
};

onMounted(() => fetchSalesData());
watch([dateFilterType, specificDate, selectedMonth, selectedYear], () => fetchSalesData());

const aggregatedMainProducts = computed(() => {
    const resultObj = {};
    
    const buildDisplayName = (baseProd, defaultName) => {
        let displayName = baseProd ? baseProd.name : defaultName;
        if (baseProd) {
            const cat = baseProd.category || '';
            if (['អាវ', 'ខោ', 'ស្បែកជើង', 'ការបូប', 'កាបូប'].includes(cat) && baseProd.colors && baseProd.colors.length > 0) {
                displayName += ` (ពណ៌: ${baseProd.colors.join(', ')})`;
                if (baseProd.sizes && baseProd.sizes.length > 0) {
                    displayName += ` (ទំហំ: ${baseProd.sizes.join(', ')})`;
                }
            }
        }
        return displayName;
    };

    const getRetailUnitLabel = (baseProd) => {
        if (!baseProd) return 'ដប';
        
        const cat = baseProd.category || '';
        
        if (cat === 'ម៉ាស់') return 'សន្លឹក';
        if (cat === 'POL') return 'ដប';
        if (cat === 'អាវ') return 'អាវ';
        if (cat === 'ខោ') return 'ខោ';
        if (cat === 'ស្បែកជើង') return 'គូ';
        if (cat === 'ការបូប' || cat === 'កាបូប') return 'កាបូប';
        
        if (baseProd.retailUnit) return translateHardcodedUnit(baseProd.retailUnit);
        
        return 'ដប'; 
    };

    allSalesRaw.value.forEach(inv => {
        if (inv.items) {
            inv.items.forEach(item => {
                const invoiceCurrencyMulti = (inv.currency === 'KHR') ? (1/4000) : 1;
                
                if (item.isCombo) {
                    const comboData = combosGlobal.value.find(c => c.id === item.id);
                    if (comboData && comboData.items) {
                        let totalComboCost = 0;
                        const comboItemsWithCost = comboData.items.map(subItem => {
                            const baseProd = originalStocksGlobal.value.find(s => s.id === subItem.productId);
                            const subIpc = baseProd ? (Number(baseProd.itemsPerCase) || 1) : 1;
                            const cost = baseProd ? (Number(baseProd.unitCost) / subIpc) * Number(subItem.qty) : 0;
                            totalComboCost += cost; 
                            return { ...subItem, baseProd, cost };
                        });
                        
                        const comboRevenue = Number(item.qty) * Number(item.price);
                        
                        comboItemsWithCost.forEach(subItem => {
                            if (subItem.baseProd) {
                                const key = subItem.baseProd.id;
                                const displayName = buildDisplayName(subItem.baseProd, subItem.baseProd.name);

                                if (!resultObj[key]) resultObj[key] = { 
                                    id: key, name: displayName, qty: 0, revenue: 0, cost: 0, 
                                    unitStr: getRetailUnitLabel(subItem.baseProd) 
                                };
                                
                                resultObj[key].qty += (Number(subItem.qty) * Number(item.qty));
                                const ratio = totalComboCost > 0 ? (subItem.cost / totalComboCost) : (1 / comboItemsWithCost.length);
                                resultObj[key].revenue += (comboRevenue * ratio * invoiceCurrencyMulti);
                                resultObj[key].cost += (subItem.cost * Number(item.qty));
                            }
                        });
                    }
                } else {
                    const key = item.id;
                    const baseProd = originalStocksGlobal.value.find(s => s.id === item.id);
                    const displayName = buildDisplayName(baseProd, item.name);

                    if (!resultObj[key]) resultObj[key] = { 
                        id: key, name: displayName, qty: 0, revenue: 0, cost: 0, 
                        unitStr: getRetailUnitLabel(baseProd) 
                    };
                    
                    let itemQty = Number(item.qty || 0);
                    const cat = baseProd?.category || '';
                    
                    if (cat === 'ម៉ាស់' || cat === 'POL') {
                        const ipc = Number(baseProd?.itemsPerCase || 1);
                        const ipb = Number(baseProd?.itemsPerBox) || 12; 
                        if (item.unit === 'case' || item.unit === 'កេះ') itemQty = itemQty * ipc * ipb;
                        else if (item.unit === 'box' || item.unit === 'ប្រអប់') itemQty = itemQty * ipb;
                        else if (item.unit === 'dozen' || item.unit === 'ឡូ') itemQty = itemQty * 12; 
                    } else {
                        if (item.unit === 'case' || item.unit === 'កេះ') itemQty = itemQty * (Number(baseProd?.itemsPerCase || item.itemsPerCase) || 1);
                        else if (item.unit === 'dozen' || item.unit === 'ឡូ') itemQty = itemQty * 12; 
                    }

                    resultObj[key].qty += itemQty;
                    resultObj[key].revenue += (Number(item.qty) * Number(item.price) * invoiceCurrencyMulti);
                    resultObj[key].cost += (Number(item.qty) * Number(item.cost || 0));
                }
            });
        }
    });

    let resArr = Object.values(resultObj).map(item => ({ ...item, stockInfo: getDynamicStockInfo(item.id) }));
    
    if (showLowStockOnly.value) resArr = resArr.filter(r => r.stockInfo.isLow);
    if (searchQuery.value) resArr = resArr.filter(r => r.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
    
    return resArr.sort((a, b) => {
        if (a.stockInfo.isLow && !b.stockInfo.isLow) return -1;
        if (!a.stockInfo.isLow && b.stockInfo.isLow) return 1;
        return b.qty - a.qty;
    });
});

watch([searchQuery, showLowStockOnly], () => { currentPage.value = 1; });

const summary = computed(() => {
    let totalRevenueUSD = 0, totalCostUSD = 0;
    allSalesRaw.value.forEach(sale => { totalRevenueUSD += Number(sale.revenueUSD)||0; totalCostUSD += Number(sale.costUSD)||0; });
    return { totalRevenueUSD, totalCostUSD, netProfitUSD: totalRevenueUSD - totalCostUSD };
});

const totalPages = computed(() => Math.ceil(aggregatedMainProducts.value.length / itemsPerPage) || 1);
const paginatedProducts = computed(() => { const start = (currentPage.value - 1) * itemsPerPage; return aggregatedMainProducts.value.slice(start, start + itemsPerPage); });
</script>