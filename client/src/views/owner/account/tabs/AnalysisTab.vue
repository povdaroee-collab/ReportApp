<template>
    <div class="space-y-6 animate-fade-in-up font-khmer pb-32 relative">
        
        <div class="bg-white p-4 rounded-[1.5rem] border border-slate-200 shadow-sm flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 relative z-20">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                </div>
                <div>
                    <h2 class="text-base font-black text-slate-800 leading-tight">វិភាគទិន្នន័យលក់</h2>
                    <p class="text-[11px] font-bold text-slate-500">ចំណាត់ថ្នាក់ Admin និង តំណាងលក់</p>
                </div>
            </div>
            
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
        </div>

        <div v-if="isLoading" class="py-32 text-center opacity-60">
            <div class="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-indigo-600 mx-auto mb-3"></div>
            <p class="text-sm font-bold text-slate-500">កំពុងវិភាគទិន្នន័យ...</p>
        </div>

        <div v-else-if="totalInvoices === 0" class="py-32 text-center bg-white rounded-[2rem] border border-slate-200 border-dashed">
            <div class="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
            </div>
            <p class="text-slate-500 font-bold">មិនមានទិន្នន័យលក់ទេ ក្នុងកំឡុងពេលនេះ</p>
        </div>

        <div v-else class="space-y-6">
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div class="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-[2rem] text-white shadow-lg relative overflow-hidden">
                    <div class="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                    <p class="text-indigo-100 font-bold text-sm mb-1 uppercase tracking-wider">វិក្កយបត្រសរុប</p>
                    <h2 class="text-4xl font-black">{{ totalInvoices.toLocaleString() }} <span class="text-lg font-bold text-indigo-200">វិក្កយបត្រ</span></h2>
                </div>
                
                <div class="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-4">
                    <div class="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center text-xl font-black">
                        1
                    </div>
                    <div>
                        <p class="text-slate-400 font-bold text-xs uppercase tracking-wider mb-0.5">Admin ឆ្នើម</p>
                        <h3 class="text-lg font-black text-slate-800">{{ topAdmin.name }}</h3>
                        <p class="text-emerald-500 font-bold text-sm">{{ topAdmin.count }} វិក្កយបត្រ ({{ topAdmin.percentage }}%)</p>
                    </div>
                </div>

                <div class="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-4">
                    <div class="w-14 h-14 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center text-xl font-black">
                        1
                    </div>
                    <div>
                        <p class="text-slate-400 font-bold text-xs uppercase tracking-wider mb-0.5">តំណាងលក់ឆ្នើម</p>
                        <h3 class="text-lg font-black text-slate-800">{{ topSeller.name }}</h3>
                        <p class="text-amber-500 font-bold text-sm">{{ topSeller.count }} វិក្កយបត្រ ({{ topSeller.percentage }}%)</p>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                <div class="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
                    <h3 class="font-black text-slate-800 text-base mb-6 flex items-center justify-between">
                        <span>ចំណាត់ថ្នាក់ Admin (ក្រុមកាងាររួម)</span>
                        <span class="text-xs font-bold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg">Top 10</span>
                    </h3>
                    <div class="h-[250px] w-full relative">
                        <Bar :data="adminChartData" :options="adminChartOptions" />
                    </div>
                </div>

                <div class="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
                    <h3 class="font-black text-slate-800 text-base mb-6 flex items-center justify-between">
                        <span>ចំណាត់ថ្នាក់ តំណាងលក់ឆ្នើម</span>
                        <span class="text-xs font-bold bg-amber-50 text-amber-600 px-3 py-1 rounded-lg">Top 10</span>
                    </h3>
                    <div class="h-[250px] w-full relative">
                        <Bar :data="sellerChartData" :options="sellerChartOptions" />
                    </div>
                </div>

            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                <div class="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col max-h-[500px]">
                    <div class="bg-slate-50 px-6 py-4 border-b border-slate-200">
                        <h3 class="text-slate-700 font-black text-sm uppercase tracking-widest flex items-center gap-2">
                            <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                            បញ្ជី Admin ទាំងអស់
                        </h3>
                    </div>
                    <div class="flex-1 overflow-y-auto custom-scrollbar p-2">
                        <table class="w-full text-left border-collapse">
                            <thead class="text-slate-400 text-[10px] uppercase font-black tracking-wider border-b border-slate-100">
                                <tr>
                                    <th class="px-4 py-3 w-10 text-center">#</th>
                                    <th class="px-4 py-3">ឈ្មោះ Admin</th>
                                    <th class="px-4 py-3 text-center">វិក្កយបត្រ</th>
                                    <th class="px-4 py-3 w-32 text-right">ភាគរយជោគជ័យ</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-50">
                                <tr v-for="(admin, index) in adminPerformance" :key="index" class="hover:bg-slate-50 transition-colors">
                                    <td class="px-4 py-3 text-center">
                                        <span v-if="index === 0" class="text-amber-500 text-lg">🥇</span>
                                        <span v-else-if="index === 1" class="text-slate-400 text-lg">🥈</span>
                                        <span v-else-if="index === 2" class="text-amber-700 text-lg">🥉</span>
                                        <span v-else class="text-xs font-bold text-slate-400">{{ index + 1 }}</span>
                                    </td>
                                    <td class="px-4 py-3 font-bold text-slate-800 text-sm">{{ admin.name }}</td>
                                    <td class="px-4 py-3 text-center font-black text-indigo-600">{{ admin.count.toLocaleString() }}</td>
                                    <td class="px-4 py-3">
                                        <div class="flex items-center gap-2 justify-end">
                                            <span class="text-xs font-bold text-slate-600 w-10 text-right">{{ admin.percentage }}%</span>
                                            <div class="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div class="h-full bg-indigo-500 rounded-full" :style="`width: ${admin.percentage}%`"></div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col max-h-[500px]">
                    <div class="bg-slate-50 px-6 py-4 border-b border-slate-200">
                        <h3 class="text-slate-700 font-black text-sm uppercase tracking-widest flex items-center gap-2">
                            <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                            បញ្ជី តំណាងលក់ ទាំងអស់
                        </h3>
                    </div>
                    <div class="flex-1 overflow-y-auto custom-scrollbar p-2">
                        <table class="w-full text-left border-collapse">
                            <thead class="text-slate-400 text-[10px] uppercase font-black tracking-wider border-b border-slate-100">
                                <tr>
                                    <th class="px-4 py-3 w-10 text-center">#</th>
                                    <th class="px-4 py-3">ឈ្មោះ តំណាងលក់</th>
                                    <th class="px-4 py-3 text-center">វិក្កយបត្រ</th>
                                    <th class="px-4 py-3 w-32 text-right">ភាគរយជោគជ័យ</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-50">
                                <tr v-for="(seller, index) in sellerPerformance" :key="index" class="hover:bg-slate-50 transition-colors">
                                    <td class="px-4 py-3 text-center">
                                        <span v-if="index === 0" class="text-amber-500 text-lg">🥇</span>
                                        <span v-else-if="index === 1" class="text-slate-400 text-lg">🥈</span>
                                        <span v-else-if="index === 2" class="text-amber-700 text-lg">🥉</span>
                                        <span v-else class="text-xs font-bold text-slate-400">{{ index + 1 }}</span>
                                    </td>
                                    <td class="px-4 py-3">
                                        <p class="font-bold text-slate-800 text-sm leading-tight">{{ seller.name }}</p>
                                        <p class="text-[10px] text-slate-400 font-bold mt-0.5">Admin: {{ seller.adminName }}</p>
                                    </td>
                                    <td class="px-4 py-3 text-center font-black text-amber-600">{{ seller.count.toLocaleString() }}</td>
                                    <td class="px-4 py-3">
                                        <div class="flex items-center gap-2 justify-end">
                                            <span class="text-xs font-bold text-slate-600 w-10 text-right">{{ seller.percentage }}%</span>
                                            <div class="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div class="h-full bg-amber-500 rounded-full" :style="`width: ${seller.percentage}%`"></div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { db } from '@/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'vue-chartjs';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Filters State
const dateFilterType = ref('month'); 
const specificDate = ref(new Date().toISOString().split('T')[0]);
const customStart = ref(new Date().toISOString().split('T')[0]);
const customEnd = ref(new Date().toISOString().split('T')[0]);
const khmerMonths = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'];
const availableYears = computed(() => { const y = new Date().getFullYear(); return [y-2, y-1, y, y+1]; });
const selectedMonth = ref(new Date().getMonth());
const selectedYear = ref(new Date().getFullYear());

const isLoading = ref(false);
const validSales = ref([]);
const usersMap = ref({});

// Fetch Users for Admin Name Mapping
const fetchUsersMap = async () => {
    try {
        const snap = await getDocs(collection(db, 'users'));
        const map = {};
        snap.forEach(doc => {
            const data = doc.data();
            map[doc.id] = data.fullName || data.username || data.name || doc.id;
        });
        usersMap.value = map;
    } catch(e) { console.error(e); }
};

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

const fetchData = async () => {
    isLoading.value = true;
    try {
        const { startStr, endStr } = getDateBounds();
        const q = query(
            collection(db, 'sales_reports'), 
            where('createdAt', '>=', startStr), 
            where('createdAt', '<=', endStr)
        );
        
        const snap = await getDocs(q);
        validSales.value = snap.docs
            .map(d => ({ id: d.id, ...d.data() }))
            .filter(s => s.paymentStatus !== 'CANCELED'); 

    } catch (e) {
        console.error(e);
    } finally {
        isLoading.value = false;
    }
};

onMounted(async () => {
    await fetchUsersMap();
    fetchData();
});

watch([dateFilterType, specificDate, selectedMonth, selectedYear, customStart, customEnd], () => {
    fetchData();
});

// ================= DATA PROCESSING =================

const totalInvoices = computed(() => validSales.value.length);

const adminPerformance = computed(() => {
    if(totalInvoices.value === 0) return [];
    
    const counts = {};
    validSales.value.forEach(sale => {
        const adminId = sale.createdBy || 'Unknown';
        if (!counts[adminId]) counts[adminId] = 0;
        counts[adminId]++;
    });

    return Object.keys(counts).map(id => {
        const count = counts[id];
        return {
            id,
            name: usersMap.value[id] || id,
            count,
            percentage: ((count / totalInvoices.value) * 100).toFixed(1)
        };
    }).sort((a, b) => b.count - a.count);
});

const topAdmin = computed(() => {
    return adminPerformance.value.length > 0 ? adminPerformance.value[0] : { name: 'គ្មាន', count: 0, percentage: 0 };
});

const sellerPerformance = computed(() => {
    if(totalInvoices.value === 0) return [];
    
    const counts = {};
    validSales.value.forEach(sale => {
        // Only count if sellerName exists and isn't undefined
        if (sale.sellerName && sale.sellerName !== 'undefined' && sale.sellerName.trim() !== '') {
            const key = `${sale.createdBy}___${sale.sellerName}`;
            if (!counts[key]) {
                counts[key] = {
                    adminId: sale.createdBy,
                    sellerName: sale.sellerName,
                    count: 0
                };
            }
            counts[key].count++;
        }
    });

    return Object.values(counts).map(item => {
        return {
            name: item.sellerName,
            adminName: usersMap.value[item.adminId] || item.adminId,
            count: item.count,
            percentage: ((item.count / totalInvoices.value) * 100).toFixed(1)
        };
    }).sort((a, b) => b.count - a.count);
});

const topSeller = computed(() => {
    return sellerPerformance.value.length > 0 ? sellerPerformance.value[0] : { name: 'គ្មាន', count: 0, percentage: 0 };
});


// ================= CHARTS CONFIGURATION =================

const adminChartData = computed(() => {
    const top10 = adminPerformance.value.slice(0, 10);
    return {
        labels: top10.map(a => a.name.length > 15 ? a.name.substring(0, 15) + '...' : a.name),
        datasets: [{
            label: 'ចំនួនវិក្កយបត្រ',
            data: top10.map(a => a.count),
            backgroundColor: '#6366f1', // Indigo-500
            borderRadius: 6,
            barThickness: 'flex',
            maxBarThickness: 40
        }]
    };
});

const adminChartOptions = {
    responsive: true, 
    maintainAspectRatio: false,
    plugins: { 
        legend: { display: false },
        tooltip: {
            callbacks: {
                label: (context) => ` លក់បាន: ${context.parsed.y} វិក្កយបត្រ`
            },
            titleFont: { family: 'Battambong', size: 13 },
            bodyFont: { family: 'Battambong', size: 12 }
        }
    },
    scales: {
        y: { beginAtZero: true, grid: { color: '#f1f5f9' }, border: { display: false } },
        x: { grid: { display: false }, border: { display: false }, ticks: { font: { family: 'Battambong', size: 10 } } }
    }
};

const sellerChartData = computed(() => {
    const top10 = sellerPerformance.value.slice(0, 10);
    return {
        labels: top10.map(s => s.name.length > 15 ? s.name.substring(0, 15) + '...' : s.name),
        datasets: [{
            label: 'ចំនួនវិក្កយបត្រ',
            data: top10.map(s => s.count),
            backgroundColor: '#f59e0b', // Amber-500
            borderRadius: 6,
            barThickness: 'flex',
            maxBarThickness: 40
        }]
    };
});

const sellerChartOptions = {
    responsive: true, 
    maintainAspectRatio: false,
    indexAxis: 'y', // Horizontal Bar for Sellers (since names can be long)
    plugins: { 
        legend: { display: false },
        tooltip: {
            callbacks: {
                label: (context) => ` លក់បាន: ${context.parsed.x} វិក្កយបត្រ`
            },
            titleFont: { family: 'Battambong', size: 13 },
            bodyFont: { family: 'Battambong', size: 12 }
        }
    },
    scales: {
        x: { beginAtZero: true, grid: { color: '#f1f5f9' }, border: { display: false } },
        y: { grid: { display: false }, border: { display: false }, ticks: { font: { family: 'Battambong', size: 10 } } }
    }
};

</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.animate-fade-in-up { animation: fadeInUp 0.3s ease-out forwards; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
</style>