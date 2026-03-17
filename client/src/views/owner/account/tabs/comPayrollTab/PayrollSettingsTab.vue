<template>
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-6 animate-fade-in-up relative">
        
        <ConfirmDialog ref="confirmDialogRef" />

        <div v-if="isLoadingData" class="absolute inset-0 z-50 bg-[#F8FAFC]/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-3xl min-h-[400px]">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-indigo-600 mb-4"></div>
            <p class="text-slate-600 font-bold">កំពុងរៀបចំបញ្ជីឈ្មោះ Admin និង តំណាងលក់...</p>
        </div>

        <div class="xl:col-span-5 space-y-6">
            <form @submit.prevent="saveSettings" class="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm relative overflow-hidden">
                
                <div v-if="isSavingSettings" class="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
                    <div class="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-indigo-600"></div>
                </div>

                <div class="mb-6 flex justify-between items-center border-b border-slate-100 pb-4">
                    <h3 class="text-lg font-black text-slate-800 flex items-center gap-2">
                        <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        {{ isEditing ? 'កែប្រែការកំណត់' : 'បង្កើតការកំណត់ថ្មី' }}
                    </h3>
                    <button v-if="isEditing" @click="cancelEdit" type="button" class="text-xs font-bold text-rose-500 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors">បោះបង់</button>
                </div>

                <div class="space-y-6 mb-6">
                    <div class="bg-indigo-50/30 p-4 rounded-xl border border-indigo-100 transition-colors" :class="{'ring-2 ring-indigo-400': !settingForm.adminId}">
                        <label class="block text-[11px] font-black text-indigo-800 mb-2 uppercase tracking-wider">១. ជ្រើសរើស ADMIN (មេក្រុម) <span class="text-rose-500">*</span></label>
                        <select v-model="settingForm.adminId" @change="onAdminChange" :disabled="isEditing || isLoadingAdmins" class="w-full bg-white border border-indigo-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer disabled:opacity-50">
                            <option value="">{{ isLoadingAdmins ? 'កំពុងទាញយកទិន្នន័យ...' : '-- ជ្រើសរើស Admin --' }}</option>
                            <option v-for="admin in activeAdmins" :key="admin.id" :value="admin.id">{{ admin.name }}</option>
                        </select>
                        <p v-if="activeAdmins.length === 0 && !isLoadingData" class="text-[10px] text-rose-500 mt-2 font-bold">មិនមាន Admin ណាដែលមានតំណាងលក់ទេ!</p>
                    </div>

                    <div v-if="settingForm.adminId" class="animate-fade-in-up bg-slate-50 p-4 rounded-xl border border-slate-200" :class="{'ring-2 ring-slate-300': settingForm.selectedSellers.length === 0}">
                        <label class="flex justify-between items-center mb-3">
                            <span class="text-[11px] font-black text-slate-700 uppercase tracking-wider">២. ជ្រើសរើស តំណាងលក់ <span class="text-rose-500">*</span></span>
                            
                            <label v-if="!isEditing && availableSellers.length > 0" class="flex items-center gap-2 bg-indigo-100 hover:bg-indigo-200 transition-colors px-3 py-1.5 rounded cursor-pointer">
    <input type="checkbox" :checked="isAllSelected" @change="toggleSelectAllSellers" class="w-4 h-4 accent-indigo-600 cursor-pointer">
    <span class="text-[11px] font-bold text-indigo-700 mt-0.5">ជ្រើសរើសទាំងអស់</span>
</label>
                        </label>
                        
                        <div v-if="totalSellersForAdmin.length === 0" class="py-4 text-center text-xs text-rose-500 font-bold bg-white rounded-xl border border-rose-100 shadow-sm"> Admin នេះមិនមានទិន្នន័យតំណាងលក់ទេ</div>
                        
                        <div v-else-if="availableSellers.length === 0 && !isEditing" class="py-4 text-center bg-emerald-50 rounded-xl border border-emerald-200 shadow-sm flex flex-col items-center justify-center">
                            <div class="w-8 h-8 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-2">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            <p class="text-xs text-emerald-700 font-bold">តំណាងលក់ទាំងអស់របស់ Admin នេះ<br/>ត្រូវបានកំណត់រួចរាល់ហើយ!</p>
                        </div>
                        
                        <div v-else class="bg-white border border-slate-200 rounded-xl max-h-48 overflow-y-auto custom-scrollbar p-2 space-y-1 shadow-inner">
                            <label v-for="seller in availableSellers" :key="seller" class="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-slate-200" :class="{'opacity-50 pointer-events-none': isEditing && !settingForm.selectedSellers.includes(seller)}">
                                <input type="checkbox" :value="seller" v-model="settingForm.selectedSellers" :disabled="isEditing && !settingForm.selectedSellers.includes(seller)" class="w-4 h-4 accent-indigo-600 cursor-pointer">
                                <span class="text-sm font-bold text-slate-800">{{ seller }}</span>
                            </label>
                        </div>
                    </div>

                    <div v-if="settingForm.adminId && settingForm.selectedSellers.length > 0" class="space-y-4 animate-fade-in-up">
                        
                        <div class="bg-emerald-50 p-4 rounded-xl border border-emerald-100 shadow-sm relative overflow-hidden">
                            <div class="absolute right-0 top-0 w-16 h-16 bg-emerald-500/10 rounded-bl-full -mr-2 -mt-2"></div>
                            <label class="block text-[11px] font-black text-emerald-800 mb-2 uppercase tracking-wider">៣. ភាគរយចំណែកលក់ (SALES SHARE) <span class="text-rose-500">*</span></label>
                            <div class="relative">
                                <input v-model.number="settingForm.profitShare" type="number" step="0.001" min="0" max="100" placeholder="0.00" required class="w-full bg-white border border-emerald-200 rounded-xl pr-10 pl-4 py-3 text-base font-black text-emerald-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-inner">
                                <span class="absolute right-4 top-3 text-emerald-500 font-black text-lg">%</span>
                            </div>
                        </div>

                        <div class="bg-amber-50 p-4 rounded-xl border border-amber-100 shadow-sm relative overflow-hidden">
                            <div class="absolute right-0 top-0 w-16 h-16 bg-amber-500/10 rounded-bl-full -mr-2 -mt-2"></div>
                            <label class="block text-[11px] font-black text-amber-800 mb-3 uppercase tracking-wider">៤. ការកំណត់ថ្លៃដឹកជញ្ជូន <span class="text-rose-500">*</span></label>
                            
                            <div class="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label class="block text-[10px] font-black text-amber-700 mb-1.5 uppercase tracking-wider">ភ្នំពេញ (១កញ្ចប់)</label>
                                    <div class="relative">
                                        <span class="absolute left-3 top-2.5 text-amber-500 font-black">$</span>
                                        <input v-model.number="settingForm.deliveryPricePP" type="number" step="0.001" min="0" placeholder="0.00" required class="w-full bg-white border border-amber-200 rounded-lg pl-7 pr-3 py-2.5 text-sm font-black text-amber-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-inner">
                                    </div>
                                </div>
                                <div>
                                    <label class="block text-[10px] font-black text-amber-700 mb-1.5 uppercase tracking-wider">ខេត្ត (១កញ្ចប់)</label>
                                    <div class="relative">
                                        <span class="absolute left-3 top-2.5 text-amber-500 font-black">$</span>
                                        <input v-model.number="settingForm.deliveryPriceProv" type="number" step="0.001" min="0" placeholder="0.00" required class="w-full bg-white border border-amber-200 rounded-lg pl-7 pr-3 py-2.5 text-sm font-black text-amber-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-inner">
                                    </div>
                                </div>
                            </div>

                            <div class="border-t border-amber-200/50 pt-4">
                                <label class="block text-[10px] font-black text-amber-700 mb-3 uppercase">ភាគរយចែកចំណែកដឹក (SHARE)</label>
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-[10px] font-bold text-amber-600 mb-1.5">ភាគរយ: ភ្នំពេញ</label>
                                        <div class="relative">
                                            <input v-model.number="settingForm.deliverySharePP" type="number" step="0.001" min="0" max="100" placeholder="0.00" required class="w-full bg-white border border-amber-200 rounded-lg pr-7 pl-3 py-2.5 text-sm font-black text-amber-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-inner">
                                            <span class="absolute right-3 top-2.5 text-amber-500 font-black">%</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label class="block text-[10px] font-bold text-amber-600 mb-1.5">ភាគរយ: ខេត្ត</label>
                                        <div class="relative">
                                            <input v-model.number="settingForm.deliveryShareProv" type="number" step="0.001" min="0" max="100" placeholder="0.00" required class="w-full bg-white border border-amber-200 rounded-lg pr-7 pl-3 py-2.5 text-sm font-black text-amber-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-inner">
                                            <span class="absolute right-3 top-2.5 text-amber-500 font-black">%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <button type="submit" :disabled="isSavingSettings || settingForm.selectedSellers.length === 0" class="w-full py-4 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-black shadow-lg shadow-slate-900/20 transition-all active:scale-95 flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                    <span v-if="isSavingSettings" class="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                    {{ isEditing ? 'រក្សាទុកការកែប្រែ (UPDATE)' : 'រក្សាទុកការកំណត់ (SAVE)' }}
                </button>
            </form>
        </div>

        <div class="xl:col-span-7">
            <div class="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm h-full flex flex-col min-h-[500px]">
                <div class="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <h3 class="text-slate-700 font-black text-sm uppercase tracking-widest">បញ្ជីការកំណត់ដែលមានស្រាប់</h3>
                    <div class="relative w-full sm:w-72">
                        <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></span>
                        <input v-model="settingsSearchQuery" type="text" placeholder="ស្វែងរកឈ្មោះ Admin ឬ តំណាងលក់..." class="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all shadow-inner">
                    </div>
                </div>
                <div class="flex-1 overflow-x-auto custom-scrollbar p-2 bg-[#F8FAFC]">
                    <table class="w-full text-left border-collapse min-w-[800px] bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100">
                        <thead class="bg-slate-100 text-slate-500 text-[10px] uppercase font-black tracking-wider border-b border-slate-200">
                            <tr>
                                <th class="px-5 py-4">ADMIN -> តំណាងលក់</th>
                                <th class="px-5 py-4 text-center text-emerald-700 bg-emerald-50/50">ចំណែកលក់</th>
                                <th class="px-5 py-4 text-center text-amber-700 bg-amber-50/50">ដឹក ភ្នំពេញ ($ នឹង %)</th>
                                <th class="px-5 py-4 text-center text-amber-700 bg-amber-50/50">ដឹក ខេត្ត ($ នឹង %)</th>
                                <th class="px-5 py-4 w-16 text-center">សកម្មភាព</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            <tr v-if="filteredSettingsList.length === 0">
                                <td colspan="5" class="py-20 text-center text-slate-400">
                                    <svg class="w-12 h-12 mx-auto mb-2 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                    <p class="font-bold text-sm">មិនទាន់មានការកំណត់ទេ</p>
                                </td>
                            </tr>
                            <tr v-for="setting in filteredSettingsList" :key="setting.id" class="hover:bg-indigo-50/30 transition-colors group">
                                <td class="px-5 py-3.5">
                                    <div class="flex items-center gap-3">
                                        <div class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-xs font-black shadow-sm">
                                            {{ getUserName(setting.adminId).charAt(0) }}
                                        </div>
                                        <div>
                                            <p class="font-bold text-slate-400 text-[10px] mb-0.5 uppercase">{{ getUserName(setting.adminId) }}</p>
                                            <p class="font-black text-slate-800 text-sm">{{ setting.sellerName }}</p>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-5 py-3.5 text-center font-black text-emerald-600 bg-emerald-50/20 border-l border-r border-slate-50">{{ setting.profitShare }}%</td>
                                <td class="px-5 py-3.5 text-center bg-amber-50/10">
                                    <div class="font-black text-slate-700">{{ formatCurrency(setting.deliveryPricePP) }}</div>
                                    <div class="text-[10px] text-amber-500 font-bold mt-0.5 bg-amber-100/50 inline-block px-1.5 rounded">{{ setting.deliverySharePP || 0 }}%</div>
                                </td>
                                <td class="px-5 py-3.5 text-center bg-amber-50/10 border-l border-slate-50">
                                    <div class="font-black text-slate-700">{{ formatCurrency(setting.deliveryPriceProv) }}</div>
                                    <div class="text-[10px] text-amber-500 font-bold mt-0.5 bg-amber-100/50 inline-block px-1.5 rounded">{{ setting.deliveryShareProv || 0 }}%</div>
                                </td>
                                <td class="px-5 py-3.5 text-center">
                                    <div class="flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button @click="editSetting(setting)" class="p-2 text-indigo-500 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors shadow-sm" title="កែប្រែ">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                        </button>
                                        <button @click="promptDelete(setting)" class="p-2 text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors shadow-sm" title="លុបចោល">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>

    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { db } from '@/firebaseConfig';
import { collection, getDocs, doc, setDoc, deleteDoc, query, orderBy, limit } from 'firebase/firestore';
import { useNotificationStore } from '@/stores/notification';
import ConfirmDialog from '@/components/shared/ConfirmDialog.vue';

const props = defineProps({
    allUsersList: Array,
    usersMap: Object,
    settingsList: Array
});

const notification = useNotificationStore();
const confirmDialogRef = ref(null); 

const settingsSearchQuery = ref('');
const filterSelectedAdmin = ref('ALL');
const isSavingSettings = ref(false);
const isEditing = ref(false);

const isLoadingData = ref(true);
const isLoadingAdmins = ref(true); // 🌟 Fixed: Added missing ref 🌟
const adminSellersMap = ref({}); 

const settingForm = reactive({
    adminId: '',
    selectedSellers: [],
    profitShare: null,
    deliveryPricePP: null,
    deliveryPriceProv: null,
    deliverySharePP: null,   
    deliveryShareProv: null  
});

const formatCurrency = (val) => Number(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 3 }) + " $";
const getUserName = (uid) => { return props.usersMap[uid] || uid; };

const fetchAdminSellerRelationships = async () => {
    isLoadingData.value = true;
    isLoadingAdmins.value = true; // 🌟 Fix Loading state 🌟
    try {
        const q = query(collection(db, 'sales_reports'), orderBy('createdAt', 'desc'), limit(10000));
        const snap = await getDocs(q);
        const tempMap = {};

        snap.docs.forEach(doc => {
            const data = doc.data();
            const adminId = data.createdBy;
            const sellerName = data.sellerName;

            if (adminId && sellerName && sellerName !== 'undefined' && sellerName.trim() !== '') {
                if (!tempMap[adminId]) tempMap[adminId] = new Set();
                tempMap[adminId].add(sellerName.trim());
            }
        });

        const finalMap = {};
        for (const admin in tempMap) {
            finalMap[admin] = Array.from(tempMap[admin]).sort();
        }
        adminSellersMap.value = finalMap;

    } catch (e) {
        console.error("Error fetching relationships:", e);
    } finally {
        isLoadingData.value = false;
        isLoadingAdmins.value = false; // 🌟 Fix Loading state 🌟
    }
};

onMounted(() => { fetchAdminSellerRelationships(); });

const isSellerConfigured = (adminId, sellerName) => {
    return props.settingsList.some(s => s.adminId === adminId && s.sellerName === sellerName);
};

const totalSellersForAdmin = computed(() => {
    if (!settingForm.adminId) return [];
    return adminSellersMap.value[settingForm.adminId] || [];
});

const availableSellers = computed(() => {
    if (!settingForm.adminId) return [];
    if (isEditing.value) return [settingForm.selectedSellers[0]]; 
    return totalSellersForAdmin.value.filter(seller => !isSellerConfigured(settingForm.adminId, seller));
});

// 🌟 Check if ALL available sellers are currently selected 🌟
const isAllSelected = computed(() => {
    return availableSellers.value.length > 0 && settingForm.selectedSellers.length === availableSellers.value.length;
});

const activeAdmins = computed(() => {
    return props.allUsersList.filter(user => {
        return adminSellersMap.value[user.id] && adminSellersMap.value[user.id].length > 0;
    }).sort((a,b) => a.name.localeCompare(b.name));
});

const filteredSettingsList = computed(() => {
    let result = props.settingsList.filter(s => props.usersMap[s.adminId]); 

    if (filterSelectedAdmin.value !== 'ALL') {
        result = result.filter(s => s.adminId === filterSelectedAdmin.value);
    }
    if (settingsSearchQuery.value) {
        const q = settingsSearchQuery.value.toLowerCase();
        result = result.filter(s => 
            s.sellerName.toLowerCase().includes(q) || 
            getUserName(s.adminId).toLowerCase().includes(q)
        );
    }
    return result.sort((a, b) => getUserName(a.adminId).localeCompare(getUserName(b.adminId)));
});

const uniqueAdminsInSettings = computed(() => {
    const ids = new Set(filteredSettingsList.value.map(s => s.adminId));
    return Array.from(ids).map(id => ({ id, name: getUserName(id) })).sort((a,b) => a.name.localeCompare(b.name));
});

const onAdminChange = () => {
    if (!isEditing.value) settingForm.selectedSellers = [];
};

// 🌟 Toggle Select All Logic 🌟
const toggleSelectAllSellers = (event) => {
    const isChecked = event.target.checked;
    if (isChecked) {
        // បើធីក គឺចាប់យកឈ្មោះអ្នកលក់ដែលទំនេរទាំងអស់បញ្ចូលទៅក្នុងបញ្ជី
        settingForm.selectedSellers = [...availableSellers.value];
    } else {
        // បើដោះធីក គឺលុបចេញវិញទាំងអស់
        settingForm.selectedSellers = [];
    }
};

const saveSettings = async () => {
    isSavingSettings.value = true;
    try {
        const promises = settingForm.selectedSellers.map(sellerName => {
            const cleanSellerName = sellerName.replace(/\s+/g, '_'); 
            const docId = `${settingForm.adminId}___${cleanSellerName}`;
            
            const ref = doc(db, 'payroll_settings', docId);
            return setDoc(ref, {
                adminId: settingForm.adminId,
                sellerName: sellerName,
                profitShare: Number(settingForm.profitShare),
                deliveryPricePP: Number(settingForm.deliveryPricePP),
                deliveryPriceProv: Number(settingForm.deliveryPriceProv),
                deliverySharePP: Number(settingForm.deliverySharePP),     
                deliveryShareProv: Number(settingForm.deliveryShareProv), 
                updatedAt: new Date().toISOString()
            }, { merge: true });
        });

        await Promise.all(promises);
        notification.success(isEditing.value ? "កែប្រែទិន្នន័យបានជោគជ័យ!" : "បានបង្កើតការកំណត់ថ្មីជោគជ័យ!");
        cancelEdit();
    } catch(e) {
        notification.error("មានបញ្ហាក្នុងការរក្សាទុកទិន្នន័យ!");
        console.error(e);
    } finally {
        isSavingSettings.value = false;
    }
};

const editSetting = (setting) => {
    isEditing.value = true;
    settingForm.adminId = setting.adminId;
    settingForm.selectedSellers = [setting.sellerName];
    
    settingForm.profitShare = setting.profitShare;
    settingForm.deliveryPricePP = setting.deliveryPricePP;
    settingForm.deliveryPriceProv = setting.deliveryPriceProv;
    settingForm.deliverySharePP = setting.deliverySharePP || setting.deliveryShare || 0;
    settingForm.deliveryShareProv = setting.deliveryShareProv || setting.deliveryShare || 0;
};

const cancelEdit = () => {
    isEditing.value = false;
    settingForm.adminId = '';
    settingForm.selectedSellers = [];
    settingForm.profitShare = null;
    settingForm.deliveryPricePP = null;
    settingForm.deliveryPriceProv = null;
    settingForm.deliverySharePP = null;
    settingForm.deliveryShareProv = null;
};

const promptDelete = async (setting) => {
    const adminName = getUserName(setting.adminId);
    const confirmed = await confirmDialogRef.value.open(
        "លុបការកំណត់?", 
        `តើអ្នកពិតជាចង់លុបការកំណត់របស់តំណាងលក់ "${setting.sellerName}" ក្រោមការគ្រប់គ្រងរបស់ ${adminName} មែនទេ?`
    );

    if (confirmed) {
        executeDelete(setting.id);
    }
};

const executeDelete = async (id) => {
    try {
        await deleteDoc(doc(db, 'payroll_settings', id));
        notification.success("ការកំណត់ត្រូវបានលុបចេញពីប្រព័ន្ធ!");
        if(isEditing.value) cancelEdit();
    } catch(e) { 
        notification.error("មានបញ្ហាក្នុងការលុបការកំណត់នេះ!"); 
    }
};

</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.animate-fade-in-up { animation: fadeInUp 0.3s ease-out forwards; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>