<template>
    <div class="flex flex-col gap-3 animate-fade-in print:hidden relative z-10">
        <!-- <div class="mb-2 flex flex-col sm:flex-row sm:items-end justify-between px-2 gap-3">
            <h2 class="text-slate-600 font-black text-sm uppercase tracking-widest bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm w-fit">បញ្ជីមុខទំនិញដែលបានលក់សរុប</h2>
            <div class="text-left sm:text-right bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200 shadow-sm w-fit">
                <p class="text-xs font-bold text-emerald-600 mb-0.5">សរុបទឹកប្រាក់ (Total)</p>
                <p class="text-xl font-black text-emerald-700 leading-none">{{ formatCurrency(totalAmountUSD) }}</p>
            </div>
        </div> -->

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5 items-start">
            
            <div v-for="(sale, index) in sales" :key="sale.id" class="bg-white rounded-[20px] border shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden group transition-all" :class="sale.paymentStatus === 'CANCELED' ? 'border-rose-200 bg-rose-50/30' : (isSaleIncomplete(sale) ? 'border-amber-300 bg-amber-50/10' : 'border-slate-200/80 hover:border-indigo-300')">
                
                <div class="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors" @click="toggleExpand(sale.id)">
                    
                    <div class="flex items-center gap-4 w-full sm:w-auto" :class="{'opacity-70': sale.paymentStatus === 'CANCELED'}">
                        <div class="w-12 h-12 rounded-[14px] flex items-center justify-center border shrink-0 transition-colors" :class="sale.paymentStatus === 'CANCELED' ? 'bg-slate-200 text-slate-500 border-slate-300' : (expandedRows.has(sale.id) ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/30' : 'bg-slate-50 text-indigo-500 border-slate-200 group-hover:bg-white')">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="flex flex-wrap items-center gap-2 mb-1">
                                <h3 class="font-black text-sm sm:text-base line-clamp-1" :class="sale.paymentStatus === 'CANCELED' ? 'text-slate-500 line-through' : 'text-slate-800'">{{ sale.customerName || 'ទូទៅ / មិនមានឈ្មោះ' }}</h3>
                                
                                <span v-if="sale.paymentStatus === 'PAID'" class="bg-emerald-50 text-emerald-600 text-[9px] px-1.5 py-0.5 rounded border border-emerald-200 font-black shrink-0">PAID</span>
                                <span v-else-if="sale.paymentStatus === 'CANCELED'" class="bg-rose-100 text-rose-600 text-[9px] px-1.5 py-0.5 rounded border border-rose-200 font-black shrink-0">CANCELED</span>
                                <span v-else class="bg-amber-50 text-amber-600 text-[9px] px-1.5 py-0.5 rounded border border-amber-200 font-black shrink-0">PENDING</span>

                                <span v-if="isSaleIncomplete(sale) && sale.paymentStatus !== 'CANCELED'" class="bg-amber-100 text-amber-700 text-[9px] px-2 py-0.5 rounded-full border border-amber-300 font-black shrink-0 flex items-center gap-1 animate-pulse shadow-sm">
                                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg> មិនពេញលេញ
                                </span>
                            </div>
                            <div class="flex flex-wrap items-center gap-2 text-[11px] font-bold text-slate-500">
                                <span class="font-mono px-1.5 rounded" :class="sale.paymentStatus === 'CANCELED' ? 'text-slate-500 bg-slate-200' : 'text-indigo-500 bg-indigo-50'">{{ sale.receiptId || 'N/A' }}</span>
                                <span class="w-1 h-1 rounded-full bg-slate-300 hidden sm:block"></span>
                                <span class="text-rose-500">{{ formatKhmerDateTime(sale.createdAt) }}</span>
                                <span class="w-1 h-1 rounded-full bg-slate-300 hidden sm:block"></span>
                                <span class="text-blue-500">{{ sale.sellerName || 'N/A' }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center justify-between w-full sm:w-auto gap-4 border-t sm:border-none border-slate-100 pt-3 sm:pt-0 shrink-0">
                        <div class="text-left sm:text-right flex-1 sm:flex-none">
                            <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">សរុប (Total)</p>
                            <p class="font-black text-lg leading-none flex flex-col sm:items-end gap-1" :class="sale.paymentStatus === 'CANCELED' ? 'text-slate-400 line-through' : 'text-emerald-600'">
                                <span>{{ Number(sale.totalAmount).toLocaleString() }} $</span>
                                <span v-if="Number(sale.deliveryFee) > 0" class="text-[9px] bg-orange-50 text-orange-500 border border-orange-200 px-1.5 py-0.5 rounded-md w-fit" title="ថ្លៃដឹកជញ្ជូន">
                                    ដឹកជញ្ជូន: {{ sale.deliveryFee }}{{ sale.deliveryCurrency === 'USD' ? '$' : '៛' }}
                                </span>
                            </p>
                        </div>
                        
                        <div class="flex items-center gap-1.5">
                            <button v-if="sale.paymentStatus === 'PENDING'" @click.stop="$emit('action', 'paid', sale)" class="p-2 bg-amber-50 hover:bg-emerald-100 text-amber-600 hover:text-emerald-700 border border-amber-200 hover:border-emerald-300 rounded-xl transition-all" title="គូសចំណាំថាបានទូទាត់ (Mark as Paid)">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                            </button>

                            <button v-if="sale.paymentStatus !== 'CANCELED'" @click.stop="$emit('action', 'edit', sale)" class="p-2 bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 border border-slate-100 hover:border-blue-200 rounded-xl transition-all" title="កែប្រែ">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                            </button>

                            <button @click.stop="$emit('action', 'telegram', sale)" class="p-2 bg-sky-50 hover:bg-sky-100 text-sky-500 hover:text-sky-700 border border-sky-100 hover:border-sky-300 rounded-xl transition-all hidden sm:block" title="Share ទៅ Telegram">
                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.48-.94-2.4-1.54-1.06-.7-.37-1.09.23-1.72.16-.16 2.87-2.63 2.92-2.85.01-.03.01-.14-.06-.2-.06-.06-.17-.04-.25-.02-.11.02-1.91 1.2-5.39 3.55-.5.34-.95.51-1.35.5-.44-.01-1.29-.25-1.92-.42-.77-.21-1.37-.32-1.31-.68.03-.18.28-.37.76-.56 3.03-1.32 5.06-2.19 6.09-2.62 2.93-1.21 3.53-1.43 3.93-1.43.09 0 .28.01.4.04.1.03.24.1.33.25.08.16.07.32.07.33z"/></svg>
                            </button>

                            <div class="w-px h-6 bg-slate-200 mx-1"></div>
                            <svg class="w-5 h-5 text-slate-400 transition-transform duration-300" :class="expandedRows.has(sale.id) ? 'rotate-180 text-indigo-500' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                        </div>
                    </div>
                </div>

                <div v-show="expandedRows.has(sale.id)" class="border-t border-slate-100 p-4 sm:p-5 animate-slide-down" :class="sale.paymentStatus === 'CANCELED' ? 'bg-rose-50/50' : 'bg-[#F8FAFC]'">
                    <div class="flex flex-wrap gap-2 mb-4 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                        <button @click.stop="$emit('action', 'id', sale)" class="flex-1 min-w-[80px] p-2 bg-slate-50 hover:bg-fuchsia-50 text-slate-500 hover:text-fuchsia-600 border border-slate-100 rounded-lg text-[10px] font-bold flex flex-col items-center justify-center gap-1 transition-all"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg> DB ID</button>
                        <button @click.stop="$emit('action', 'copy', sale)" class="flex-1 min-w-[80px] p-2 bg-slate-50 hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 border border-slate-100 rounded-lg text-[10px] font-bold flex flex-col items-center justify-center gap-1 transition-all"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg> Copy</button>
                        <button @click.stop="$emit('action', 'image', sale)" class="flex-1 min-w-[80px] p-2 bg-slate-50 hover:bg-emerald-50 text-slate-500 hover:text-emerald-600 border border-slate-100 rounded-lg text-[10px] font-bold flex flex-col items-center justify-center gap-1 transition-all"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg> Image</button>
                        <button v-if="sale.paymentStatus !== 'CANCELED'" @click.stop="$emit('action', 'cancel', sale)" class="flex-1 min-w-[80px] p-2 bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-100 rounded-lg text-[10px] font-bold flex flex-col items-center justify-center gap-1 transition-all"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Cancel</button>
                        <button @click.stop="$emit('action', 'delete', sale)" class="flex-1 min-w-[80px] p-2 bg-slate-50 hover:bg-red-50 text-slate-500 hover:text-red-600 border border-slate-100 rounded-lg text-[10px] font-bold flex flex-col items-center justify-center gap-1 transition-all"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg> Delete</button>
                    </div>

                    <div v-if="sale.paymentStatus === 'CANCELED'" class="mb-4 bg-white border border-rose-200 p-3 rounded-xl flex items-start gap-3 shadow-sm">
                        <svg class="w-5 h-5 text-rose-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <div>
                            <h4 class="text-[11px] font-black uppercase tracking-widest text-rose-700">មូលហេតុនៃការបោះបង់៖</h4>
                            <p class="text-sm font-bold text-rose-600 mt-1">{{ sale.cancelReason || 'មិនមានបញ្ជាក់' }}</p>
                        </div>
                    </div>

                    <div class="flex items-center justify-between mb-3">
                        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">មុខទំនិញ ({{ sale.items?.length || 0 }})</p>
                        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">តម្លៃសរុប</p>
                    </div>
                    <div class="flex flex-col gap-2">
                        <div v-for="(item, i) in (sale.items || [])" :key="i" class="flex items-center justify-between bg-white p-2.5 rounded-xl border shadow-sm" :class="sale.paymentStatus === 'CANCELED' ? 'border-rose-100 opacity-80' : 'border-slate-200'">
                            <div class="flex items-center gap-3">
                                <img v-if="item.image" :src="item.image" class="w-10 h-10 rounded-lg object-cover border border-slate-100 bg-slate-50 shrink-0">
                                <div v-else class="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 shrink-0"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg></div>
                                <div>
                                    <p class="text-xs font-bold text-slate-800 line-clamp-1" :class="{'line-through': sale.paymentStatus === 'CANCELED'}">{{ item.name || 'មិនស្គាល់ទំនិញ' }}</p>
                                    <p class="text-[10px] font-black text-slate-400 mt-0.5 flex flex-wrap items-center gap-1">
                                        <span class="text-indigo-500">{{ item.price || 0 }} $</span> 
                                        <svg class="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"/></svg> 
                                        <span>{{ item.qty || 0 }} {{ translateUnit(item.unit) }}</span>
                                        <span class="bg-slate-100 px-1.5 py-0.5 rounded text-[8px] text-slate-500">{{ checkIsWholesale(item.type) ? 'បោះដុំ' : 'លក់រាយ' }}</span>
                                    </p>
                                </div>
                            </div>
                            <div class="font-black text-sm pl-4 shrink-0" :class="sale.paymentStatus === 'CANCELED' ? 'text-slate-400 line-through' : 'text-slate-700'">
                                {{ (Number(item.price || 0) * Number(item.qty || 0)).toLocaleString() }} $
                            </div>
                        </div>
                    </div>
                    
                    <div class="mt-4 pt-3 border-t grid grid-cols-2 gap-4 text-xs font-bold text-slate-600" :class="sale.paymentStatus === 'CANCELED' ? 'border-rose-100' : 'border-slate-200'">
                        <div>
                            <span class="text-slate-400 text-[10px] uppercase block mb-0.5">ទីតាំងអតិថិជន</span>
                            <span :class="{'text-amber-500': !sale.location}">{{ sale.location || (sale.district && sale.province ? `${sale.district}, ${sale.province}` : 'មិនមានទីតាំង') }}</span>
                        </div>
                        <div class="text-right">
                            <span class="text-slate-400 text-[10px] uppercase block mb-0.5">ចំណាំការទូទាត់</span>
                            {{ sale.paymentNote || 'មិនមាន' }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    sales: Array,
    totalAmountUSD: Number
});

const emit = defineEmits(['action']);

const expandedRows = ref(new Set());

const toggleExpand = (id) => {
    const newSet = new Set(expandedRows.value);
    if (newSet.has(id)) newSet.delete(id); else newSet.add(id);
    expandedRows.value = newSet;
};

// Helpers Passed from Parent Context
const formatCurrency = (val) => Number(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " $";

const checkIsWholesale = (typeStr) => {
    if (!typeStr) return false;
    const str = String(typeStr).toLowerCase();
    return str.includes('បោះដុំ') || str.includes('wholesale');
};

const formatKhmerDate = (dateStr) => {
    if(!dateStr) return '';
    const date = new Date(dateStr);
    const months = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'];
    return `${String(date.getDate()).padStart(2, '0')} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

const formatTime = (dateStr) => {
    if(!dateStr) return '';
    return new Date(dateStr).toLocaleTimeString('km-KH', { hour: '2-digit', minute: '2-digit' });
};

const formatKhmerDateTime = (dateStr) => {
    if(!dateStr) return '';
    return `${formatKhmerDate(dateStr)} - ${formatTime(dateStr)}`;
};

const translateUnit = (unitVal) => {
    if (!unitVal) return '';
    const safeVal = String(unitVal).toLowerCase().trim();
    if (safeVal === 'bottle' || safeVal === 'bottles') return 'ដប';
    if (safeVal === 'pack' || safeVal === 'packs') return 'កញ្ចប់';
    if (safeVal === 'case' || safeVal === 'cases') return 'កេះ';
    return safeVal; 
};

const isSaleIncomplete = (sale) => {
    if (sale.customerName === 'អតិថិជនទិញផ្ទាល់' || sale.customerName === 'ទូទៅ') { return false; }
    return !sale.customerName || !sale.customerPhone || !sale.location;
};
</script>

<style scoped>
.animate-slide-down { animation: slideDown 0.2s ease-out forwards; transform-origin: top; }
@keyframes slideDown { from { opacity: 0; transform: scaleY(0.95); } to { opacity: 1; transform: scaleY(1); } }
</style>