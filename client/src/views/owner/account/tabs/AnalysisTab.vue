<template>
  <div class="font-khmer relative">
    
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-32 opacity-60 print:hidden">
       <div class="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-indigo-600 mb-4"></div>
       <p class="text-slate-500 font-bold">កំពុងវិភាគទិន្នន័យ និងរៀបចំក្រាហ្វិក...</p>
    </div>

    <div v-else class="space-y-6 animate-fade-in-up" ref="dashboardContent">
        
        <div class="bg-white p-4 rounded-[1.5rem] border border-slate-200 shadow-sm flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 print:hidden">
            
            <div class="flex flex-wrap items-center gap-3">
                <div class="flex items-center gap-2 text-indigo-600 font-black text-sm bg-indigo-50 px-4 py-2.5 rounded-xl border border-indigo-100 shadow-sm">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 01-2-2z"></path></svg>
                    វិភាគទិន្នន័យ
                </div>
                
                <div class="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                    <button @click="filterType = 'thisMonth'" :class="filterType === 'thisMonth' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:text-indigo-600'" class="py-1.5 px-4 rounded-lg font-bold text-sm transition-all">ខែនេះ</button>
                    <button @click="filterType = 'specificMonth'" :class="filterType === 'specificMonth' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:text-indigo-600'" class="py-1.5 px-4 rounded-lg font-bold text-sm transition-all">ជ្រើសរើសខែ</button>
                    <button @click="filterType = 'yearly'" :class="filterType === 'yearly' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:text-indigo-600'" class="py-1.5 px-4 rounded-lg font-bold text-sm transition-all">ប្រចាំឆ្នាំ</button>
                    <button @click="filterType = 'custom'" :class="filterType === 'custom' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:text-indigo-600'" class="py-1.5 px-4 rounded-lg font-bold text-sm transition-all">ជ្រើសរើសថ្ងៃ</button>
                </div>

                <div v-if="filterType === 'specificMonth'" class="flex items-center gap-2 animate-fade-in pl-2 xl:border-l border-slate-200">
                    <select v-model="selectedMonth" class="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-sm font-bold text-slate-700 outline-none focus:border-indigo-500 cursor-pointer">
                        <option v-for="(m, idx) in khmerMonths" :key="idx" :value="idx">{{ m }}</option>
                    </select>
                    <select v-model="selectedYear" class="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-sm font-bold text-slate-700 outline-none focus:border-indigo-500 cursor-pointer">
                        <option v-for="y in availableYears" :key="y" :value="y">ឆ្នាំ {{ y }}</option>
                    </select>
                </div>

                <div v-if="filterType === 'yearly'" class="flex items-center gap-2 animate-fade-in pl-2 xl:border-l border-slate-200">
                    <select v-model="selectedYear" class="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-sm font-bold text-slate-700 outline-none focus:border-indigo-500 cursor-pointer">
                        <option v-for="y in availableYears" :key="y" :value="y">ឆ្នាំ {{ y }}</option>
                    </select>
                </div>

                <div v-if="filterType === 'custom'" class="flex items-center gap-2 animate-fade-in pl-2 xl:border-l border-slate-200">
                    <input type="date" v-model="customStart" class="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-sm font-bold text-slate-700 outline-none focus:border-indigo-500">
                    <span class="text-slate-400 font-bold">-</span>
                    <input type="date" v-model="customEnd" class="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-sm font-bold text-slate-700 outline-none focus:border-indigo-500">
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

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
            <div class="bg-white p-5 rounded-[1.5rem] border border-slate-200 shadow-sm relative overflow-hidden group hover:border-blue-300 transition-colors">
                <div class="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-3">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <p class="text-xs font-bold text-slate-500 mb-1">ចំណូលសរុប (Revenue)</p>
                <h3 class="text-2xl font-black text-slate-800">{{ totals.revenue.toLocaleString(undefined, {maximumFractionDigits: 2}) }}$</h3>
            </div>

            <div class="bg-white p-5 rounded-[1.5rem] border border-slate-200 shadow-sm relative overflow-hidden group hover:border-rose-300 transition-colors">
                <div class="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mb-3">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                </div>
                <p class="text-xs font-bold text-slate-500 mb-1">ថ្លៃដើមទំនិញ (Cost)</p>
                <h3 class="text-2xl font-black text-slate-800">{{ totals.cost.toLocaleString(undefined, {maximumFractionDigits: 2}) }}$</h3>
            </div>

            <div class="bg-white p-5 rounded-[1.5rem] border border-slate-200 shadow-sm relative overflow-hidden group hover:border-amber-300 transition-colors">
                <div class="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-3">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                </div>
                <p class="text-xs font-bold text-slate-500 mb-1">ប្រាក់ខែបុគ្គលិក</p>
                <h3 class="text-2xl font-black text-slate-800">{{ totals.payroll.toLocaleString(undefined, {maximumFractionDigits: 2}) }}$</h3>
            </div>

            <div class="bg-emerald-50 p-5 rounded-[1.5rem] border border-emerald-200 shadow-sm relative overflow-hidden group">
                <div class="w-10 h-10 bg-white text-emerald-600 rounded-xl flex items-center justify-center shadow-sm mb-3 relative z-10">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                </div>
                <p class="text-xs font-bold text-emerald-700 mb-1 relative z-10">ចំណេញសុទ្ធ (Net Profit)</p>
                <h3 class="text-2xl font-black text-emerald-600 relative z-10">{{ totals.netProfit.toLocaleString(undefined, {maximumFractionDigits: 2}) }}$</h3>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 print:hidden">
            <div class="lg:col-span-2 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
                <h3 class="font-black text-slate-800 text-lg mb-6 flex items-center justify-between">
                    <span>និន្នាការ ចំណូល ធៀបនឹង ចំណេញសុទ្ធ</span>
                    <span class="text-xs font-bold bg-slate-100 text-slate-500 px-3 py-1 rounded-lg">{{ chartData.labels.length }} ឯកតា</span>
                </h3>
                <div class="h-[300px] w-full">
                    <Line id="mainLineChart" :data="lineChartData" :options="lineChartOptions" />
                </div>
            </div>

            <div class="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col">
                <h3 class="font-black text-slate-800 text-lg mb-2">ការបែងចែកហិរញ្ញវត្ថុ</h3>
                <p class="text-xs font-bold text-slate-500 mb-6">ភាគរយនៃចំណូលសរុប</p>
                <div class="flex-1 flex items-center justify-center relative">
                    <div class="h-[220px] w-[220px]">
                        <Doughnut id="mainDoughnutChart" :data="doughnutChartData" :options="doughnutOptions" />
                    </div>
                    <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span class="text-[10px] font-bold text-slate-400">ចំណូលសរុប</span>
                        <span class="text-sm font-black text-slate-800">{{ formatCompactNumber(totals.revenue) }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <transition enter-active-class="duration-300 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="processing.active" class="fixed inset-0 z-[999999] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
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

  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue';
import { db } from '@/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

// Import Chart.js & Vue-ChartJS
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line, Doughnut } from 'vue-chartjs';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler);

// ================= STATE =================
const isLoading = ref(true);
const allSalesRaw = ref([]); 
const availableYears = ref([new Date().getFullYear()]);

// Filters State
const filterType = ref('thisMonth'); 
const selectedMonth = ref(new Date().getMonth());
const selectedYear = ref(new Date().getFullYear());
const customStart = ref(new Date().toISOString().split('T')[0]);
const customEnd = ref(new Date().toISOString().split('T')[0]);

const dashboardContent = ref(null);
const processing = ref({ active: false, message: '', progress: 0 });

const khmerMonths = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'];

// ================= DATA FETCHING =================
onMounted(async () => {
    try {
        const stocksSnap = await getDocs(collection(db, 'stocks')); 
        const stockCostsMap = {};
        stocksSnap.forEach(doc => {
            const data = doc.data();
            const pName = data.name || data.productName;
            if (pName) {
                const unitCost = Number(data.unitCost || 0);
                const itemsPerCase = Number(data.itemsPerCase || 1);
                stockCostsMap[pName] = {
                    costPerCase: unitCost,
                    costPerItem: itemsPerCase > 0 ? unitCost / itemsPerCase : 0
                };
            }
        });

        const salesSnap = await getDocs(collection(db, 'sales_reports'));
        const rawSales = [];
        const yearsSet = new Set();

        salesSnap.forEach((doc) => {
            const data = doc.data();
            if (data.paymentStatus !== 'CANCELED') {
                const dateStr = data.createdAt || data.date;
                if (!dateStr) return;
                
                const d = new Date(dateStr);
                yearsSet.add(d.getFullYear());

                let revUSD = 0, costUSD = 0;
                if (data.items) {
                    data.items.forEach(item => {
                        const qty = Number(item.qty || 0);
                        const price = Number(item.price || 0);
                        let unitCost = Number(item.cost || 0);
                        
                        if (unitCost === 0 && item.name && stockCostsMap[item.name]) {
                            unitCost = item.type === 'wholesale' ? stockCostsMap[item.name].costPerCase : stockCostsMap[item.name].costPerItem;
                        }

                        let itemRev = qty * price;
                        let itemCost = qty * unitCost;
                        
                        if (data.currency === 'KHR' || data.currency === '៛') {
                            itemRev = itemRev / 4000;
                            itemCost = itemCost / 4000;
                        }

                        revUSD += itemRev;
                        costUSD += itemCost;
                    });
                }
                rawSales.push({ date: d, revenue: revUSD, cost: costUSD });
            }
        });

        allSalesRaw.value = rawSales;
        if(yearsSet.size > 0) availableYears.value = Array.from(yearsSet).sort((a,b)=>b-a);

    } catch (error) {
        console.error("Error fetching analysis data:", error);
    } finally {
        isLoading.value = false;
    }
});

// ================= DATA PROCESSING LOGIC =================
const chartData = computed(() => {
    let labels = [];
    let revenues = [];
    let costs = [];

    const today = new Date();
    
    const filteredRaw = allSalesRaw.value.filter(sale => {
        const d = sale.date;
        const localDateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

        if (filterType.value === 'thisMonth') return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
        if (filterType.value === 'specificMonth') return d.getMonth() === selectedMonth.value && d.getFullYear() === selectedYear.value;
        if (filterType.value === 'yearly') return d.getFullYear() === selectedYear.value;
        if (filterType.value === 'custom') return localDateStr >= customStart.value && localDateStr <= customEnd.value;
        return true;
    });

    if (filterType.value === 'yearly') {
        labels = khmerMonths;
        revenues = Array(12).fill(0);
        costs = Array(12).fill(0);
        filteredRaw.forEach(s => {
            const m = s.date.getMonth();
            revenues[m] += s.revenue;
            costs[m] += s.cost;
        });
    } 
    else if (filterType.value === 'thisMonth' || filterType.value === 'specificMonth') {
        const year = filterType.value === 'thisMonth' ? today.getFullYear() : selectedYear.value;
        const month = filterType.value === 'thisMonth' ? today.getMonth() : selectedMonth.value;
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        labels = Array.from({length: daysInMonth}, (_, i) => `${i + 1}`);
        revenues = Array(daysInMonth).fill(0);
        costs = Array(daysInMonth).fill(0);

        filteredRaw.forEach(s => {
            const d = s.date.getDate() - 1; 
            revenues[d] += s.revenue;
            costs[d] += s.cost;
        });
    } 
    else if (filterType.value === 'custom') {
        const map = {};
        filteredRaw.forEach(s => {
            const dStr = `${String(s.date.getDate()).padStart(2, '0')}-${khmerMonths[s.date.getMonth()]}`;
            if(!map[dStr]) map[dStr] = { rev: 0, cost: 0};
            map[dStr].rev += s.revenue;
            map[dStr].cost += s.cost;
        });
        
        labels = Object.keys(map);
        if(labels.length === 0) labels = ['គ្មានទិន្នន័យ'];
        
        revenues = labels.map(l => map[l] ? map[l].rev : 0);
        costs = labels.map(l => map[l] ? map[l].cost : 0);
    }

    const payrolls = revenues.map(() => 0); 
    const profits = revenues.map((rev, i) => rev - costs[i] - payrolls[i]);

    return { labels, revenues, costs, payrolls, profits };
});

const totals = computed(() => {
    let rev = 0, cost = 0, pay = 0;
    chartData.value.revenues.forEach(r => rev += r);
    chartData.value.costs.forEach(c => cost += c);
    chartData.value.payrolls.forEach(p => pay += p);
    
    return { revenue: rev, cost: cost, payroll: pay, netProfit: rev - cost - pay };
});

// ================= CHART CONFIGURATIONS =================
const lineChartData = computed(() => ({
    labels: chartData.value.labels,
    datasets: [
        { label: 'ចំណូល (Revenue)', data: chartData.value.revenues, borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderWidth: 3, tension: 0.4, fill: true, pointBackgroundColor: '#ffffff', pointBorderColor: '#3b82f6', pointRadius: 3 },
        { label: 'ចំណេញសុទ្ធ (Net Profit)', data: chartData.value.profits, borderColor: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.05)', borderWidth: 3, tension: 0.4, fill: true, pointBackgroundColor: '#ffffff', pointBorderColor: '#10b981', pointRadius: 3 }
    ]
}));

const lineChartOptions = {
    responsive: true, maintainAspectRatio: false, animation: false, // បិទ Animation ដើម្បីកុំឱ្យ html2canvas ថតខុស
    plugins: { legend: { position: 'top', labels: { font: { family: 'Battambong', size: 12 } } } },
    scales: {
        y: { beginAtZero: true, grid: { color: '#f1f5f9' }, border: { display: false } },
        x: { grid: { display: false }, border: { display: false }, ticks: { font: { family: 'Battambong', size: 10 } } }
    }
};

const doughnutChartData = computed(() => ({
    labels: ['ចំណេញសុទ្ធ', 'ថ្លៃដើមទំនិញ', 'ប្រាក់ខែបុគ្គលិក'],
    datasets: [{
        data: [Math.max(0, totals.value.netProfit), totals.value.cost, totals.value.payroll],
        backgroundColor: ['#10b981', '#f43f5e', '#e2e8f0'],
        borderWidth: 0, hoverOffset: 4
    }]
}));

const doughnutOptions = { responsive: true, maintainAspectRatio: false, cutout: '75%', animation: false, plugins: { legend: { position: 'bottom', labels: { font: { family: 'Battambong', size: 11 } } } } };

// ================= HELPERS & EXPORT (FIXED FOR CLEAN PRINT/PDF) =================
const formatCompactNumber = (number) => Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(number) + '$';

const getFilterLabel = () => {
    if (filterType.value === 'thisMonth') return `ប្រចាំខែនេះ (${khmerMonths[new Date().getMonth()]})`;
    if (filterType.value === 'specificMonth') return `ប្រចាំខែ ${khmerMonths[selectedMonth.value]} ឆ្នាំ ${selectedYear.value}`;
    if (filterType.value === 'yearly') return `ប្រចាំឆ្នាំ ${selectedYear.value}`;
    
    const s = customStart.value.split('-');
    const e = customEnd.value.split('-');
    return `ចាប់ពីថ្ងៃទី ${s[2]}-${khmerMonths[parseInt(s[1])-1]}-${s[0]} ដល់ ${e[2]}-${khmerMonths[parseInt(e[1])-1]}-${e[0]}`;
};

// បង្កើតទម្រង់ HTML ស្តង់ដារ (លុបបំបាត់បញ្ហាទំព័រលើស)
const getCleanReportHTML = () => {
    const canvases = document.querySelectorAll('canvas');
    const lineImg = canvases[0] ? canvases[0].toDataURL('image/png', 1.0) : '';
    const doughnutImg = canvases[1] ? canvases[1].toDataURL('image/png', 1.0) : '';

    return `
        <div style="font-family: 'Battambong', sans-serif; color: #1e293b; width: 100%; box-sizing: border-box; overflow: hidden;">
            <div style="text-align: center; margin-bottom: 25px; border-bottom: 2px solid #e2e8f0; padding-bottom: 15px;">
                <h1 style="font-size: 26px; font-weight: 900; margin: 0; text-transform: uppercase;">របាយការណ៍វិភាគហិរញ្ញវត្ថុ</h1>
                <p style="font-size: 14px; font-weight: bold; color: #64748b; margin-top: 5px;">ចម្រោះទិន្នន័យ៖ ${getFilterLabel()}</p>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <thead>
                    <tr style="background-color: #f8fafc; text-align: center;">
                        <th style="padding: 12px; border: 1px solid #cbd5e1; color: #3b82f6; font-size: 14px;">ចំណូលសរុប (Revenue)</th>
                        <th style="padding: 12px; border: 1px solid #cbd5e1; color: #f43f5e; font-size: 14px;">ថ្លៃដើមទំនិញ (Cost)</th>
                        <th style="padding: 12px; border: 1px solid #cbd5e1; color: #d97706; font-size: 14px;">ប្រាក់ខែបុគ្គលិក</th>
                        <th style="padding: 12px; border: 1px solid #cbd5e1; color: #10b981; font-size: 14px;">ចំណេញសុទ្ធ (Net Profit)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="text-align: center; font-size: 20px; font-weight: 900;">
                        <td style="padding: 15px; border: 1px solid #cbd5e1;">${totals.value.revenue.toLocaleString(undefined, {maximumFractionDigits: 2})} $</td>
                        <td style="padding: 15px; border: 1px solid #cbd5e1;">${totals.value.cost.toLocaleString(undefined, {maximumFractionDigits: 2})} $</td>
                        <td style="padding: 15px; border: 1px solid #cbd5e1;">${totals.value.payroll.toLocaleString(undefined, {maximumFractionDigits: 2})} $</td>
                        <td style="padding: 15px; border: 1px solid #cbd5e1;">${totals.value.netProfit.toLocaleString(undefined, {maximumFractionDigits: 2})} $</td>
                    </tr>
                </tbody>
            </table>

            <div style="display: flex; gap: 20px; align-items: flex-start;">
                <div style="flex: 2; border: 1px solid #e2e8f0; padding: 15px; border-radius: 12px; background: white;">
                    <h3 style="font-size: 15px; margin-top: 0; margin-bottom: 15px;">និន្នាការ ចំណូល ធៀបនឹង ចំណេញសុទ្ធ</h3>
                    ${lineImg ? `<img src="${lineImg}" style="width: 100%; height: auto;">` : ''}
                </div>
                <div style="flex: 1; border: 1px solid #e2e8f0; padding: 15px; border-radius: 12px; text-align: center; background: white;">
                    <h3 style="font-size: 15px; margin-top: 0; margin-bottom: 15px;">ការបែងចែកហិរញ្ញវត្ថុ</h3>
                    ${doughnutImg ? `<img src="${doughnutImg}" style="width: 100%; max-width: 200px; height: auto; margin: 0 auto;">` : ''}
                </div>
            </div>
            
            <div style="margin-top: 30px; font-size: 11px; color: #94a3b8; text-align: right; border-top: 1px solid #e2e8f0; padding-top: 10px;">
                រៀបចំដោយប្រព័ន្ធ: ${new Date().toLocaleString('km-KH')}
            </div>
        </div>
    `;
};

// PRINT FUNCTION (ដំណោះស្រាយទំព័រលើស)
const executePrint = async () => {
    await nextTick();
    const contentHTML = getCleanReportHTML();
    
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute'; iframe.style.width = '0'; iframe.style.height = '0'; iframe.style.border = 'none';
    document.body.appendChild(iframe);
    
    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
        <html>
        <head>
            <title>របាយការណ៍វិភាគ</title>
            <link href="https://fonts.googleapis.com/css2?family=Battambong:wght@400;700;900&display=swap" rel="stylesheet">
            <style>
                @page { size: A4 landscape; margin: 5mm; } 
                body { 
                    margin: 0; 
                    padding: 0; 
                    background: white; 
                    -webkit-print-color-adjust: exact !important; 
                    display: flex; 
                    justify-content: center; 
                    overflow: hidden; /* ការពារកុំឱ្យរុញធ្លាក់ទំព័រទី២ */
                }
                .report-container {
                    width: 100%;
                    max-width: 297mm;
                    box-sizing: border-box;
                    padding: 5mm;
                }
            </style>
        </head>
        <body>
            <div class="report-container">
                ${contentHTML}
            </div>
        </body>
        </html>
    `);
    doc.close();
    
    iframe.contentWindow.document.fonts.ready.then(() => {
        setTimeout(() => {
            iframe.contentWindow.focus(); 
            iframe.contentWindow.print();
            setTimeout(() => document.body.removeChild(iframe), 1000);
        }, 500);
    });
};

// PDF FUNCTION (ដំណោះស្រាយ PDF ចេញពណ៌ស/ទទេ)
const generatePDF = async () => {
    processing.value = { active: true, message: 'កំពុងរៀបចំទិន្នន័យ...', progress: 30 };
    try {
        await nextTick();
        const contentHTML = getCleanReportHTML();
        
        // បង្កើត Div បណ្ដោះអាសន្ន ដាក់ចូលក្នុង Body ដើម្បីឱ្យ html2canvas ថតបាន ១០០%
        const tempDiv = document.createElement('div');
        tempDiv.style.position = 'absolute';
        tempDiv.style.top = '0';
        tempDiv.style.left = '0';
        tempDiv.style.width = '1122px'; // ទំហំបណ្ដោយក្រដាស A4 Landscape
        tempDiv.style.background = '#ffffff';
        tempDiv.style.zIndex = '-9999'; // លាក់នៅពីក្រោយគេ
        tempDiv.innerHTML = contentHTML;
        
        document.body.appendChild(tempDiv);
        
        // រង់ចាំបន្តិចឱ្យ Font និង Image ដើរស្រួល
        await new Promise(r => setTimeout(r, 600));
        processing.value.progress = 60;
        
        const canvas = await html2canvas(tempDiv, { 
            scale: 2, 
            useCORS: true, 
            backgroundColor: "#ffffff",
            logging: false,
            windowWidth: 1122
        });
        
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        processing.value.progress = 80;
        
        const pdf = new jsPDF('l', 'mm', 'a4');
        const pdfWidth = 297; 
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Analysis_Report_${new Date().getTime()}.pdf`);
        
        // លុប Div បណ្ដោះអាសន្នចោលវិញ
        document.body.removeChild(tempDiv);
        
    } catch (error) {
        console.error("PDF Error: ", error);
        alert("មានបញ្ហាក្នុងការទាញយក PDF");
    } finally {
        processing.value.active = false;
    }
};
</script>

<style scoped>
.animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
</style>