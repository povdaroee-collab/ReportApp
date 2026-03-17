<template>
  <div class="my-account-tab flex flex-col gap-6 animate-fade-in pb-10">
    
    <div class="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hide-on-print">
      
      <div class="flex flex-wrap items-center gap-3">
        <div class="flex items-center gap-2">
          <span class="text-sm font-bold text-slate-500 font-khmer">ទិន្នន័យខែ៖</span>
          <input type="month" v-model="currentPeriod" class="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block px-3 py-2 font-khmer font-bold outline-none transition-colors" />
        </div>
        
        <div class="flex items-center gap-2">
          <span class="text-sm font-bold text-slate-500 font-khmer">ប្រៀបធៀបនឹង៖</span>
          <input type="month" v-model="comparePeriod" class="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block px-3 py-2 font-khmer font-bold outline-none transition-colors" />
        </div>
      </div>

      <button @click="downloadPDF" class="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-5 py-2.5 rounded-xl font-black text-sm transition-all shadow-sm border border-indigo-200 active:scale-95">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
        <span class="font-khmer">ទាញយក PDF / Print</span>
      </button>
    </div>

    <div id="pdf-report-content" class="bg-[#F4F7FE] p-2 md:p-6 rounded-3xl flex flex-col gap-6">
      
      <div class="hidden print-header text-center mb-4">
        <h1 class="text-3xl font-black text-slate-800 font-khmer mb-2">របាយការណ៍ហិរញ្ញវត្ថុប្រចាំខែ</h1>
        <p class="text-slate-500 font-bold font-khmer">
          ខែ {{ formatMonthKhmer(currentPeriod) }} ប្រៀបធៀបនឹង ខែ {{ formatMonthKhmer(comparePeriod) }}
        </p>
      </div>

      <div class="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[2rem] p-8 shadow-xl shadow-emerald-500/20 flex flex-col md:flex-row items-center justify-between relative overflow-hidden text-white">
        <div class="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        <div class="absolute left-10 -bottom-10 w-32 h-32 bg-teal-900/20 rounded-full blur-xl"></div>
        
        <div class="flex items-center gap-5 relative z-10 mb-6 md:mb-0">
          <div class="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-inner">
            <svg class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <h2 class="text-white/90 text-lg font-black font-khmer">ប្រាក់ចំណេញដុលសរុប (Gross Profit)</h2>
            <p class="text-sm text-emerald-100 font-bold font-khmer">ចំណូល - (ថ្លៃដើម + ចំណាយ + ភាគរយ + ថ្លៃដឹក)</p>
          </div>
        </div>
        <div class="text-right relative z-10 flex flex-col items-end">
          <span class="text-5xl font-black tracking-tight mb-2">
            $ {{ formatCurrency(currentData.grossProfit) }}
          </span>
          <div v-html="renderGrowthBadge(growthData.grossProfit, 'badge', false, true)"></div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <p class="text-slate-500 text-sm font-bold font-khmer mb-1">ចំណូលសរុប</p>
          <p class="text-xl font-black text-slate-800 mb-2">$ {{ formatCurrency(currentData.revenue) }}</p>
          <div v-html="renderGrowthBadge(growthData.revenue, 'text')"></div>
        </div>
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <p class="text-slate-500 text-sm font-bold font-khmer mb-1">ថ្លៃដើម (COGS)</p>
          <p class="text-xl font-black text-slate-800 mb-2">$ {{ formatCurrency(currentData.costOfGoods) }}</p>
          <div v-html="renderGrowthBadge(growthData.costOfGoods, 'text', true)"></div>
        </div>
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <p class="text-slate-500 text-sm font-bold font-khmer mb-1">ចំណាយទូទៅ</p>
          <p class="text-xl font-black text-slate-800 mb-2">$ {{ formatCurrency(currentData.expenses) }}</p>
          <div v-html="renderGrowthBadge(growthData.expenses, 'text', true)"></div>
        </div>
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <p class="text-slate-500 text-sm font-bold font-khmer mb-1">ភាគរយលក់</p>
          <p class="text-xl font-black text-slate-800 mb-2">$ {{ formatCurrency(currentData.commissions) }}</p>
          <div v-html="renderGrowthBadge(growthData.commissions, 'text', true)"></div>
        </div>
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <p class="text-slate-500 text-sm font-bold font-khmer mb-1">ថ្លៃដឹក</p>
          <p class="text-xl font-black text-slate-800 mb-2">$ {{ formatCurrency(currentData.deliveryShares) }}</p>
          <div v-html="renderGrowthBadge(growthData.deliveryShares, 'text', true)"></div>
        </div>
      </div>

      <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mt-2">
        <h3 class="text-lg font-black text-slate-800 font-khmer mb-6 flex items-center gap-2">
          <svg class="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
          ក្រាហ្វិកវិភាគ និងប្រៀបធៀបទិន្នន័យ
        </h3>
        <apexchart type="bar" height="380" :options="chartOptions" :series="chartSeries"></apexchart>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import VueApexCharts from 'vue3-apexcharts'; // Import ក្រាហ្វិក

// --- រៀបចំកាលបរិច្ឆេទ ---
const today = new Date();
const currentPeriod = ref(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`);
const lastMonth = new Date(today.setMonth(today.getMonth() - 1));
const comparePeriod = ref(`${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}`);

// --- ទិន្នន័យគំរូ (Mock Data) ---
const currentData = ref({ revenue: 25000, costOfGoods: 8500, expenses: 1200, commissions: 3000, deliveryShares: 500, grossProfit: 11800 });
const compareData = ref({ revenue: 20000, costOfGoods: 7000, expenses: 1000, commissions: 2500, deliveryShares: 400, grossProfit: 9100 });

// --- ការគណនាកំណើន ---
const calculatePercentage = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return (((current - previous) / previous) * 100).toFixed(1);
};

const growthData = computed(() => {
  return {
    revenue: calculatePercentage(currentData.value.revenue, compareData.value.revenue),
    costOfGoods: calculatePercentage(currentData.value.costOfGoods, compareData.value.costOfGoods),
    expenses: calculatePercentage(currentData.value.expenses, compareData.value.expenses),
    commissions: calculatePercentage(currentData.value.commissions, compareData.value.commissions),
    deliveryShares: calculatePercentage(currentData.value.deliveryShares, compareData.value.deliveryShares),
    grossProfit: calculatePercentage(currentData.value.grossProfit, compareData.value.grossProfit)
  };
});

// --- Chart Configuration (ApexCharts) ---
const chartSeries = computed(() => [
  {
    name: `ខែ ${formatMonthKhmer(currentPeriod.value)}`,
    data: [currentData.value.revenue, currentData.value.costOfGoods, currentData.value.expenses, currentData.value.commissions, currentData.value.deliveryShares]
  },
  {
    name: `ខែ ${formatMonthKhmer(comparePeriod.value)}`,
    data: [compareData.value.revenue, compareData.value.costOfGoods, compareData.value.expenses, compareData.value.commissions, compareData.value.deliveryShares]
  }
]);

const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    fontFamily: 'Kantumruy Pro, sans-serif',
    toolbar: { show: false },
    animations: { enabled: true, easing: 'easeinout', speed: 800 }
  },
  plotOptions: {
    bar: { horizontal: false, columnWidth: '45%', borderRadius: 6 }
  },
  dataLabels: { enabled: false },
  stroke: { show: true, width: 3, colors: ['transparent'] },
  xaxis: {
    categories: ['ចំណូលសរុប', 'ថ្លៃដើម', 'ចំណាយទូទៅ', 'ភាគរយលក់', 'ថ្លៃដឹក'],
    labels: { style: { fontSize: '13px', fontWeight: 700, colors: '#64748B' } }
  },
  yaxis: {
    labels: { formatter: (val) => `$${val.toLocaleString()}`, style: { fontWeight: 700, colors: '#64748B' } }
  },
  fill: { opacity: 1 },
  colors: ['#4F46E5', '#CBD5E1'], // ពណ៌ខៀវ(ខែថ្មី) និង ពណ៌ប្រផេះ(ខែចាស់)
  tooltip: {
    theme: 'light',
    y: { formatter: (val) => `$ ${val.toLocaleString()}` }
  },
  legend: { position: 'top', horizontalAlign: 'right', fontWeight: 700 }
}));

// --- UI Helpers ---
const formatCurrency = (val) => Number(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const formatMonthKhmer = (yyyy_mm) => {
  if (!yyyy_mm) return '';
  const [year, month] = yyyy_mm.split('-');
  return `${month}/${year}`;
};

// បង្កើត Badge បង្ហាញភាគរយ
const renderGrowthBadge = (percentage, style = 'badge', isExpense = false, isDarkBg = false) => {
  const isPositive = percentage >= 0;
  const num = Math.abs(percentage);
  let colorClass = ''; let icon = '';

  if (isPositive) {
    colorClass = isExpense ? 'text-rose-500' : (isDarkBg ? 'text-emerald-100 bg-white/20' : 'text-emerald-600 bg-emerald-50');
    icon = '↑';
  } else {
    colorClass = isExpense ? (isDarkBg ? 'text-emerald-100 bg-white/20' : 'text-emerald-600 bg-emerald-50') : 'text-rose-500';
    icon = '↓';
  }

  if (style === 'text') {
    return `<span class="text-xs font-bold ${colorClass.split(' ')[0]} flex items-center gap-1 font-khmer mt-1">
              <span class="bg-current/10 px-1.5 py-0.5 rounded-md">${icon} ${num}%</span> <span class="text-slate-400">ធៀបខែមុន</span>
            </span>`;
  }

  return `<div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${colorClass} border border-white/10 backdrop-blur-sm">
            <span class="text-sm font-black">${icon} ${num}%</span>
            <span class="text-xs font-bold font-khmer opacity-90">ធៀបនឹង ${formatMonthKhmer(comparePeriod.value)}</span>
          </div>`;
};

// --- PDF Print Logic ថ្មី (ប្រើ Native Browser Print ធានាអត់ Error) ---
const downloadPDF = () => {
  window.print();
};
</script>

<script>
export default {
  components: {
    apexchart: VueApexCharts,
  },
};
</script>

<style scoped>
.font-khmer { font-family: 'Kantumruy Pro', 'Battambong', sans-serif; }
.animate-fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

/* === CSS សម្រាប់ Print PDF ដោយរក្សាពណ៌ទាំងស្រុង === */
@media print {
  @page { size: A4 landscape; margin: 10mm; }
  
  /* លាក់អ្វីដែលមិនចាំបាច់ពេល Print */
  body * { visibility: hidden; }
  .hide-on-print { display: none !important; }
  
  /* បង្ហាញតែទិន្នន័យរបាយការណ៍ */
  #pdf-report-content, #pdf-report-content * { visibility: visible; }
  #pdf-report-content {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    margin: 0;
    padding: 0;
    background: white !important;
  }

  /* បង្ខំឱ្យ Browser បង្ហាញពណ៌ Background និងកាត */
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  /* បង្ហាញ Header */
  .print-header { display: block !important; }
}
</style>