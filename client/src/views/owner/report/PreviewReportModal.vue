<template>
    <transition enter-active-class="duration-300 ease-out" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100" leave-active-class="duration-200 ease-in" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
        <div v-if="show" class="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm font-khmer">
            <div class="bg-white rounded-3xl w-full max-w-6xl max-h-[90vh] shadow-2xl relative overflow-hidden flex flex-col">
                
                <div class="bg-slate-800 text-white px-6 py-4 flex items-center justify-between shrink-0">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </div>
                        <div>
                            <h2 class="font-black text-lg">ទិដ្ឋភាពរបាយការណ៍លម្អិត</h2>
                            <p class="text-xs font-bold text-slate-300">{{ dateLabel }} | {{ adminLabel }}</p>
                        </div>
                    </div>
                    <button @click="$emit('close')" class="w-10 h-10 rounded-full bg-white/10 hover:bg-rose-500 hover:text-white transition-colors flex items-center justify-center">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                </div>

                <div class="p-4 border-b border-slate-200 bg-slate-50 shrink-0 relative z-50">
                    <div class="relative max-w-md">
                        <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </span>
                        
                        <input 
                            v-model="searchQuery" 
                            @focus="isDropdownOpen = true"
                            @blur="closeDropdown"
                            @keydown="handleKeyDown"
                            @input="highlightedIndex = -1"
                            type="text" 
                            placeholder="ស្វែងរក ឬជ្រើសរើសឈ្មោះទំនិញ..." 
                            class="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-10 py-2.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all shadow-sm" 
                        />
                        
                        <button v-if="searchQuery" @click="clearSearch" class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-rose-500 transition-colors cursor-pointer">
                            <svg class="w-5 h-5 bg-slate-100 rounded-full p-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>

                        <transition enter-active-class="transition duration-200 ease-out" enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100" leave-active-class="transition duration-100 ease-in" leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
                            <div v-show="isDropdownOpen && filteredDropdownItems.length > 0" class="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto custom-scrollbar z-[100]" ref="dropdownListRef">
                                <ul class="py-1">
                                    <li 
                                        v-for="(item, index) in filteredDropdownItems" 
                                        :key="index"
                                        @mousedown="selectProduct(item)"
                                        @mouseenter="highlightedIndex = index"
                                        class="px-4 py-2.5 text-sm font-bold cursor-pointer transition-colors"
                                        :class="highlightedIndex === index ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500' : 'text-slate-600 hover:bg-slate-50 border-l-4 border-transparent'"
                                    >
                                        {{ item }}
                                    </li>
                                </ul>
                            </div>
                        </transition>
                        
                        <div v-show="isDropdownOpen && filteredDropdownItems.length === 0" class="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl p-4 text-center text-sm font-bold text-slate-400 z-[100]">
                            មិនមានទំនិញឈ្មោះនេះទេ
                        </div>
                    </div>
                </div>

                <div class="flex-1 overflow-y-auto custom-scrollbar p-6 bg-slate-100 relative z-0">
                    <div class="max-w-4xl mx-auto space-y-6">
                        
                        <div v-html="generateRegionHTML('📊 ទិន្នន័យរួមសរុប (រាជធានីភ្នំពេញ + ខេត្ត)', filteredStats.grand, true, stats.expensesList, unitSettings)"></div>
                        
                        <div v-html="generateRegionHTML('🏙️ ទិន្នន័យរាជធានីភ្នំពេញ (Phnom Penh)', filteredStats.pp, false, [], unitSettings)"></div>
                        
                        <div v-html="generateRegionHTML('🛣️ ទិន្នន័យតាមបណ្តាខេត្ត (Provinces)', filteredStats.prov, false, [], unitSettings)"></div>

                    </div>
                </div>

            </div>
        </div>
    </transition>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue';

const props = defineProps({
    show: Boolean,
    stats: Object,
    dateLabel: String,
    adminLabel: String,
    unitSettings: Array
});

const emit = defineEmits(['close']);

// ==========================================
// 🌟 Smart Dropdown Logic 🌟
// ==========================================
const searchQuery = ref('');
const isDropdownOpen = ref(false);
const highlightedIndex = ref(-1);
const dropdownListRef = ref(null);

// ទាញយកឈ្មោះទំនិញទាំងអស់ដែលមិនជាន់គ្នា
const availableProductNames = computed(() => {
    const names = new Set();
    if (!props.stats) return [];

    const extractFromNode = (node) => {
        if(!node) return;
        const addNames = (productsObj) => {
            if(productsObj && Array.isArray(productsObj.products)) {
                productsObj.products.forEach(p => names.add(p.name));
            }
        };
        addNames(node.paid?.wholesale);
        addNames(node.paid?.retail);
        addNames(node.unpaid?.wholesale);
        addNames(node.unpaid?.retail);
    };

    extractFromNode(props.stats.grand);
    return Array.from(names).sort();
});

// ត្រងឈ្មោះទំនិញតាមការវាយបញ្ចូល
const filteredDropdownItems = computed(() => {
    if (!searchQuery.value) return availableProductNames.value;
    const q = searchQuery.value.toLowerCase().trim();
    return availableProductNames.value.filter(name => name.toLowerCase().includes(q));
});

const selectProduct = (name) => {
    searchQuery.value = name;
    isDropdownOpen.value = false;
};

const clearSearch = () => {
    searchQuery.value = '';
    isDropdownOpen.value = true;
    highlightedIndex.value = -1;
};

// ការពារការបិទ Dropdown លឿនពេកពេលចុច (mousedown រត់លឿនជាង blur)
const closeDropdown = () => {
    setTimeout(() => {
        isDropdownOpen.value = false;
    }, 200);
};

// ប្រើ Keyboard បញ្ជាឡើងចុះ និង Enter
const handleKeyDown = (e) => {
    if (!isDropdownOpen.value && e.key !== 'Escape') {
        isDropdownOpen.value = true;
        return;
    }
    
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (highlightedIndex.value < filteredDropdownItems.value.length - 1) {
            highlightedIndex.value++;
            scrollToHighlighted();
        }
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (highlightedIndex.value > 0) {
            highlightedIndex.value--;
            scrollToHighlighted();
        }
    } else if (e.key === 'Enter') {
        e.preventDefault();
        if (highlightedIndex.value >= 0 && highlightedIndex.value < filteredDropdownItems.value.length) {
            selectProduct(filteredDropdownItems.value[highlightedIndex.value]);
        }
    } else if (e.key === 'Escape') {
        isDropdownOpen.value = false;
    }
};

const scrollToHighlighted = () => {
    nextTick(() => {
        if (!dropdownListRef.value) return;
        const activeEl = dropdownListRef.value.querySelector('li:nth-child(' + (highlightedIndex.value + 1) + ')');
        if (activeEl) {
            activeEl.scrollIntoView({ block: 'nearest' });
        }
    });
};

// ==========================================
// 🌟 Report Generation Logic 🌟
// ==========================================
const fC = (val) => Number(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fQ = (val) => Number(val || 0).toLocaleString('en-US');
const translateUnit = (unitVal, availableUnits) => {
    if (!unitVal) return "";
    const safeVal = String(unitVal);
    const found = availableUnits ? availableUnits.find((u) => String(u.value) === safeVal) : null;
    if (found) return found.label;
    const u = safeVal.toLowerCase().trim();
    if (u === "bottle" || u === "bottles") return "ដប";
    if (u === "pack" || u === "packs") return "កញ្ចប់";
    if (u === "case" || u === "cases") return "កេះ";
    if (u === "set" || u === "sets" || u === "ឈុត") return "ឈុត";
    return safeVal;
};

// 🌟 Search Filter Logic សម្រាប់បង្ហាញ Card
const filteredStats = computed(() => {
    if (!searchQuery.value) return props.stats;
    const q = searchQuery.value.toLowerCase().trim();

    const filterProducts = (productsArr) => {
        return productsArr.filter(p => p.name && p.name.toLowerCase().includes(q));
    };

    const filterNode = (node) => {
        if(!node) return node;
        const newPaidWS = filterProducts(node.paid?.wholesale?.products || []);
        const newPaidRT = filterProducts(node.paid?.retail?.products || []);
        const newUnpaidWS = filterProducts(node.unpaid?.wholesale?.products || []);
        const newUnpaidRT = filterProducts(node.unpaid?.retail?.products || []);

        return {
            ...node,
            paid: {
                ...node.paid,
                wholesale: { ...node.paid?.wholesale, products: newPaidWS },
                retail: { ...node.paid?.retail, products: newPaidRT }
            },
            unpaid: {
                ...node.unpaid,
                wholesale: { ...node.unpaid?.wholesale, products: newUnpaidWS },
                retail: { ...node.unpaid?.retail, products: newUnpaidRT }
            }
        };
    };

    return {
        grand: filterNode(props.stats.grand),
        pp: filterNode(props.stats.pp),
        prov: filterNode(props.stats.prov)
    };
});

// 🌟 បង្កើត HTML String សម្រាប់ UI Card 🌟
const generateRegionHTML = (title, d, isGrand, expenses, unitSettings) => {
    if (!d) return '';

    const hasPaidData = (d.paid?.wholesale?.products?.length > 0) || (d.paid?.retail?.products?.length > 0);
    const hasUnpaidData = (d.unpaid?.wholesale?.products?.length > 0) || (d.unpaid?.retail?.products?.length > 0);
    
    if (!hasPaidData && !hasUnpaidData && (!isGrand || !expenses || expenses.length === 0)) return '';

    const renderGrid = (products) => {
        if (!products || products.length === 0) return '';
        const cards = products.map(p => {
            const unitPrice = p.qty > 0 ? (p.usd / p.qty) : 0;
            return `
            <div class="border border-slate-200 rounded-xl p-3 bg-white shadow-sm flex flex-col justify-between">
                <div class="flex justify-between items-start mb-2 gap-2">
                    <span class="font-bold text-slate-800 text-sm leading-tight flex-1">📦 ${p.name}</span>
                    <span class="font-black text-emerald-600 text-base whitespace-nowrap">${fC(p.usd)} $</span>
                </div>
                <div class="text-xs text-slate-500 flex flex-col sm:flex-row sm:justify-between sm:items-center border-t border-dashed border-slate-200 pt-2 gap-1">
                    <span>អតិថិជន: <span class="font-bold text-slate-700">${fQ(p.clients)}</span> នាក់</span>
                    <span class="flex items-center flex-wrap gap-1">
                        បរិមាណ: 
                        <span class="font-black text-sky-600 text-[13px]">${fQ(p.qty)} ${translateUnit(p.unit, unitSettings)}</span> 
                        <span class="text-slate-400 font-bold text-[10px]">(${fC(unitPrice)}$/១ឯកតា)</span>
                    </span>
                </div>
            </div>
        `}).join('');
        return `<div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">${cards}</div>`;
    };

    const renderCat = (catTitle, catData, colorClass, borderClass) => {
        if (!catData?.products || catData.products.length === 0) return '';
        return `
            <div class="mt-4 p-4 rounded-xl border ${borderClass} bg-slate-50/50">
                <div class="flex justify-between items-center border-l-4 pl-3 mb-2" style="border-color: ${colorClass}">
                    <span class="font-black text-[15px]" style="color: ${colorClass}">${catTitle}</span>
                    <span class="font-black text-slate-800 text-sm">តម្លៃទំនិញ: <span style="color: ${colorClass}">${fC(catData.itemPriceTotalUSD)} $</span></span>
                </div>
                ${renderGrid(catData.products)}
            </div>
        `;
    };

    let html = `
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div class="bg-slate-800 text-white px-5 py-3.5 flex justify-between items-center">
                <h3 class="font-black text-base">${title}</h3>
                <span class="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">អតិថិជនសរុប: ${fQ(d.totalClients)} នាក់</span>
            </div>
    `;

    if (hasPaidData) {
        html += `
            <div class="p-5 border-b border-slate-100">
                <h4 class="font-black text-emerald-600 text-base mb-2">✅ ទំនិញបានទូទាត់រួច (PAID)</h4>
                ${renderCat('📦 លក់បោះដុំ (WHOLESALE)', d.paid?.wholesale, '#7e22ce', 'border-purple-100')}
                ${renderCat('🛍️ លក់រាយ (RETAIL)', d.paid?.retail, '#0ea5e9', 'border-sky-100')}
                <div class="text-right mt-3">
                    <span class="bg-emerald-50 text-emerald-700 font-bold text-sm px-4 py-2 rounded-lg border border-emerald-200 inline-block">
                        ថ្លៃដឹកជញ្ជូនសរុប (Paid): <span class="font-black ml-1">${fC(d.paid?.deliveryFeeUSD)} $</span>
                    </span>
                </div>
            </div>
        `;
    }

    if (hasUnpaidData) {
        html += `
            <div class="p-5 bg-amber-50/30 border-b border-slate-100">
                <h4 class="font-black text-amber-600 text-base mb-2">⏳ មិនទាន់បានទូទាត់ (PENDING)</h4>
                ${renderCat('📦 លក់បោះដុំ (WHOLESALE)', d.unpaid?.wholesale, '#b45309', 'border-amber-200')}
                ${renderCat('🛍️ លក់រាយ (RETAIL)', d.unpaid?.retail, '#ea580c', 'border-orange-200')}
                <div class="text-right mt-3">
                    <span class="bg-amber-100 text-amber-800 font-bold text-sm px-4 py-2 rounded-lg border border-amber-300 inline-block">
                        ថ្លៃដឹកជញ្ជូនសរុប (Pending): <span class="font-black ml-1">${fC(d.unpaid?.deliveryFeeUSD)} $</span>
                    </span>
                </div>
            </div>
        `;
    }

    if (isGrand && expenses?.length > 0) {
        const expRows = expenses.map((e, i) => `
            <tr class="border-b border-rose-100 last:border-0">
                <td class="py-2 text-rose-900 font-bold text-sm">${i+1}. ${e.reason}</td>
                <td class="py-2 text-center text-rose-700 text-sm">${e.requester}</td>
                <td class="py-2 text-right font-black text-rose-700 text-sm">${fC(e.currency==='KHR'?e.amount/4000:e.amount)} $</td>
            </tr>
        `).join('');
        html += `
            <div class="p-5 bg-rose-50/50 border-b border-slate-100">
                <h4 class="font-black text-rose-700 text-base mb-3">💸 ការចំណាយទូទៅ (EXPENSES)</h4>
                <table class="w-full text-left">
                    <thead class="text-xs text-rose-600 uppercase border-b-2 border-rose-200">
                        <tr><th class="pb-2">បរិយាយ</th><th class="pb-2 text-center">អ្នកស្នើ</th><th class="pb-2 text-right">តម្លៃ (USD)</th></tr>
                    </thead>
                    <tbody>${expRows}</tbody>
                </table>
            </div>
        `;
    }

    if (isGrand) {
        const profitColor = d.summary?.netProfit >= 0 ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50';
        html += `
            <div class="p-6 bg-slate-50 flex justify-end">
                <div class="w-full max-w-md space-y-2 text-sm font-bold text-slate-600">
                    <div class="flex justify-between"><span>ចំណូលសរុប (ទំនិញ PAID):</span><span class="text-slate-800">${fC(d.summary?.paidItemsTotal)} $</span></div>
                    <div class="flex justify-between"><span>ចំណូលសរុប (ថ្លៃដឹក PAID):</span><span class="text-slate-800">${fC(d.summary?.paidDeliveryTotal)} $</span></div>
                    <div class="flex justify-between text-emerald-700 border-b border-dashed border-slate-300 pb-2"><span>ចំណូលសរុប (ទំនិញ + ថ្លៃដឹក):</span><span class="font-black text-base">${fC(d.summary?.paidTotal)} $</span></div>
                    <div class="flex justify-between text-amber-600 pt-1"><span>មិនទាន់ទូទាត់សរុប (PENDING):</span><span class="font-black">- ${fC(d.summary?.unpaidTotal)} $</span></div>
                    <div class="flex justify-between text-rose-600"><span>ចំណាយសរុប (Expenses):</span><span class="font-black">- ${fC(d.summary?.totalExpensesUSD)} $</span></div>
                    <div class="flex justify-between text-slate-500 border-b-2 border-slate-200 pb-3 mb-3"><span>សរុបតម្លៃដើម (COGS):</span><span class="font-black">- ${fC(d.summary?.totalPaidCostUSD)} $</span></div>
                    <div class="flex justify-between items-center pt-1 text-slate-900">
                        <span class="font-black uppercase">ប្រាក់ចំណេញសុទ្ធ:</span>
                        <span class="font-black text-xl px-3 py-1 rounded-lg ${profitColor}">${fC(d.summary?.netProfit)} $</span>
                    </div>
                </div>
            </div>
        `;
    } else {
         html += `
            <div class="p-5 bg-slate-50 flex justify-end">
                <div class="w-full max-w-xs space-y-1.5 text-sm font-bold text-slate-600">
                    <div class="flex justify-between"><span>ចំណូលទំនិញ (PAID):</span><span class="text-slate-800">${fC(d.summary?.paidItemsTotal)} $</span></div>
                    <div class="flex justify-between"><span>ចំណូលថ្លៃដឹក (PAID):</span><span class="text-slate-800">${fC(d.summary?.paidDeliveryTotal)} $</span></div>
                    <div class="flex justify-between text-emerald-700 border-t border-dashed border-slate-300 pt-1.5 mt-1.5"><span>ចំណូលសរុប (PAID):</span><span class="font-black">${fC(d.summary?.paidTotal)} $</span></div>
                    <div class="flex justify-between text-slate-500 border-t border-dashed border-slate-300 pt-1.5"><span>តម្លៃដើមសរុប (COGS):</span><span class="font-black">${fC(d.summary?.totalPaidCostUSD)} $</span></div>
                </div>
            </div>
        `;
    }

    html += `</div>`;
    return html;
};

</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
</style>