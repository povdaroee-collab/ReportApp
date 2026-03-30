<template>
    <div class="flex flex-col gap-4 relative z-40 print:hidden animate-fade-in-up font-khmer">
        
        <div class="bg-white p-3 md:p-4 rounded-[20px] shadow-sm border border-slate-200/80 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
            
            <div class="flex flex-wrap items-center gap-4 w-full xl:w-auto relative">
                
                <div class="relative" ref="dateDropdownRef">
                    <button @click="isDateDropdownOpen = !isDateDropdownOpen" class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-[14px] text-[13px] font-black transition-all shadow-md shadow-indigo-500/20 flex items-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        {{ filterLabel }}
                        <svg class="w-4 h-4 ml-1 transition-transform" :class="isDateDropdownOpen ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path></svg>
                    </button>

                    <transition enter-active-class="transition duration-200 ease-out" enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
                        <div v-if="isDateDropdownOpen" class="absolute top-full left-0 mt-2 w-[340px] bg-white rounded-[24px] shadow-[0_15px_40px_rgba(0,0,0,0.15)] border border-slate-100 p-5 z-50">
                            
                            <div class="mb-4 border-b border-slate-100 pb-4">
                                <button @click="applyQuickFilter('today')" class="w-full text-left px-4 py-3 rounded-xl text-[13px] font-black transition-colors" :class="filterType === 'today' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'">📅 ប្រចាំថ្ងៃនេះ (Today)</button>
                            </div>

                            <div class="mb-4 border-b border-slate-100 pb-4">
                                <label class="block text-[11px] font-black text-slate-400 uppercase mb-2">ជ្រើសរើសខែ (Specific Month)</label>
                                <div class="flex items-center gap-2">
                                    <select v-model="localMonth" class="flex-1 bg-slate-50 border border-slate-200 text-slate-700 text-[13px] font-bold rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-indigo-500/20 outline-none cursor-pointer">
                                        <option v-for="m in availableMonths" :key="m.index" :value="m.index">{{ m.name }}</option>
                                    </select>
                                    <select v-model="localYear" class="w-24 bg-slate-50 border border-slate-200 text-slate-700 text-[13px] font-bold rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-indigo-500/20 outline-none cursor-pointer">
                                        <option v-for="y in availableYears" :key="y" :value="y">{{ y }}</option>
                                    </select>
                                    <button @click="applyMonthDate" class="bg-indigo-100 text-indigo-700 px-3 py-2.5 rounded-xl font-black hover:bg-indigo-200 transition-colors">រក</button>
                                </div>
                            </div>

                            <div class="mb-5">
                                <label class="block text-[11px] font-black text-slate-400 uppercase mb-2">ជ្រើសរើសថ្ងៃមួយ (Specific Date)</label>
                                <div class="flex items-center gap-2">
                                    <input type="date" v-model="localSpecificDate" class="flex-1 w-full bg-slate-50 border border-slate-200 text-slate-700 text-[13px] font-bold rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500/20 outline-none cursor-pointer transition-all">
                                    <button @click="applySpecificDate" class="bg-indigo-100 text-indigo-700 px-3 py-2.5 rounded-xl font-black hover:bg-indigo-200 transition-colors">រក</button>
                                </div>
                            </div>

                            <div>
                                <label class="block text-[11px] font-black text-slate-400 uppercase mb-2">ចន្លោះថ្ងៃ (Date Range)</label>
                                <div class="flex items-center gap-2 mb-3">
                                    <input type="date" v-model="localStartDate" class="flex-1 w-full bg-slate-50 border border-slate-200 text-slate-700 text-[12px] font-bold rounded-lg px-2 py-2 focus:ring-2 focus:ring-indigo-500/20 outline-none cursor-pointer transition-all">
                                    <span class="text-slate-400 font-black">-</span>
                                    <input type="date" v-model="localEndDate" class="flex-1 w-full bg-slate-50 border border-slate-200 text-slate-700 text-[12px] font-bold rounded-lg px-2 py-2 focus:ring-2 focus:ring-indigo-500/20 outline-none cursor-pointer transition-all">
                                </div>
                                <button @click="applyRangeDate" class="w-full bg-slate-800 text-white text-[13px] font-black py-3 rounded-xl hover:bg-slate-900 transition-colors shadow-sm">ស្វែងរកតាមចន្លោះថ្ងៃ</button>
                            </div>
                        </div>
                    </transition>
                </div>

                <div class="w-px h-8 bg-slate-200 hidden xl:block mx-1"></div>

                <div class="flex bg-slate-50 p-1.5 rounded-[14px] border border-slate-100 shrink-0 overflow-x-auto no-scrollbar">
                    <button @click="$emit('updatePaymentFilter', 'ALL')" :class="paymentFilter === 'ALL' ? 'bg-white text-slate-800 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'" class="px-4 py-2 rounded-xl text-[12px] font-black transition-all whitespace-nowrap">ទាំងអស់</button>
                    <button @click="$emit('updatePaymentFilter', 'PAID')" :class="paymentFilter === 'PAID' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-500 hover:text-emerald-600'" class="px-4 py-2 rounded-xl text-[12px] font-black transition-all whitespace-nowrap">PAID</button>
                    <button @click="$emit('updatePaymentFilter', 'PENDING')" :class="paymentFilter === 'PENDING' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-500 hover:text-amber-600'" class="px-4 py-2 rounded-xl text-[12px] font-black transition-all whitespace-nowrap">PENDING</button>
                    <button @click="$emit('updatePaymentFilter', 'CANCELED')" :class="paymentFilter === 'CANCELED' ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-500 hover:text-rose-600'" class="px-4 py-2 rounded-xl text-[12px] font-black transition-all whitespace-nowrap">CANCELED</button>
                </div>
            </div>

            <div class="flex flex-wrap items-center gap-2 w-full xl:w-auto mt-2 xl:mt-0">
                <div class="relative flex-1 min-w-[200px]">
                    <svg class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                    <input :value="searchQuery" @input="$emit('update:searchQuery', $event.target.value)" type="text" placeholder="ស្វែងរកវិក្កយបត្រ, អតិថិជន..." class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-[13px] font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all">
                </div>
                
                <button @click="$emit('toggleSummaryCards')" class="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 px-4 py-2.5 rounded-xl font-bold text-[12px] shadow-sm transition-colors flex items-center justify-center gap-2 shrink-0 h-[42px]">
                    <svg v-if="!showSummaryCards" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    <span class="hidden sm:inline">{{ showSummaryCards ? 'លាក់កាតសរុប' : 'កាតសរុប' }}</span>
                </button>

                <div class="flex items-center gap-2">
                    <button @click="$emit('handlePrint')" :disabled="!hasData" class="bg-slate-800 text-white px-4 py-2.5 rounded-xl font-bold text-[12px] shadow-sm hover:bg-slate-900 transition-colors disabled:opacity-50 shrink-0 h-[42px]">Print</button>
                    <button @click="$emit('handlePDF')" :disabled="!hasData" class="bg-rose-50 text-rose-600 border border-rose-200 px-4 py-2.5 rounded-xl font-bold text-[12px] shadow-sm hover:bg-rose-100 transition-colors disabled:opacity-50 shrink-0 h-[42px]">PDF</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps({
    filterType: String,
    paymentFilter: String,
    specificDate: String,
    startDate: String,
    endDate: String,
    searchQuery: String,
    selectedMonth: Number,
    selectedYear: Number,
    availableMonths: Array,
    availableYears: Array,
    showSummaryCards: Boolean,
    hasData: Boolean,
    totalStats: Object,
    validSalesCount: Number
});

const emit = defineEmits([
    'updateFilterType', 'updatePaymentFilter', 
    'update:specificDate', 'update:startDate', 'update:endDate', 'update:searchQuery',
    'update:selectedMonth', 'update:selectedYear',
    'toggleSummaryCards', 'handlePrint', 'handlePDF'
]);

const isDateDropdownOpen = ref(false);
const localSpecificDate = ref(props.specificDate);
const localStartDate = ref(props.startDate);
const localEndDate = ref(props.endDate);
const localMonth = ref(props.selectedMonth);
const localYear = ref(props.selectedYear);
const dateDropdownRef = ref(null);

watch(() => props.specificDate, (val) => { localSpecificDate.value = val; });
watch(() => props.startDate, (val) => { localStartDate.value = val; });
watch(() => props.endDate, (val) => { localEndDate.value = val; });

const filterLabel = computed(() => {
    if (props.filterType === 'today') return 'ថ្ងៃនេះ';
    if (props.filterType === 'month') {
        const m = props.availableMonths.find(x => x.index === props.selectedMonth);
        return `ខែ ${m ? m.name : ''} ${props.selectedYear}`;
    }
    if (props.filterType === 'specific') {
        const d = new Date(props.specificDate);
        return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    }
    if (props.filterType === 'range') return 'ចន្លោះថ្ងៃកំនត់';
    return 'ជ្រើសរើសថ្ងៃ';
});

const applyQuickFilter = (type) => {
    emit('updateFilterType', type);
    isDateDropdownOpen.value = false;
};

const applyMonthDate = () => {
    emit('update:selectedMonth', localMonth.value);
    emit('update:selectedYear', localYear.value);
    emit('updateFilterType', 'month');
    isDateDropdownOpen.value = false;
};

const applySpecificDate = () => {
    if (localSpecificDate.value) {
        emit('update:specificDate', localSpecificDate.value);
        emit('updateFilterType', 'specific');
        isDateDropdownOpen.value = false;
    }
};

const applyRangeDate = () => {
    if (localStartDate.value && localEndDate.value) {
        emit('update:startDate', localStartDate.value);
        emit('update:endDate', localEndDate.value);
        emit('updateFilterType', 'range');
        isDateDropdownOpen.value = false;
    }
};

const handleClickOutside = (event) => {
    if (dateDropdownRef.value && !dateDropdownRef.value.contains(event.target)) {
        isDateDropdownOpen.value = false;
    }
};

onMounted(() => { document.addEventListener('mousedown', handleClickOutside); });
onUnmounted(() => { document.removeEventListener('mousedown', handleClickOutside); });
</script>