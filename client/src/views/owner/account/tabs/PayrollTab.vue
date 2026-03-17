<template>
    <div class="max-w-[95rem] mx-auto animate-fade-in space-y-6 pb-32 font-khmer">
        
        <div class="flex items-center justify-center mb-8 relative z-20">
            <div class="bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 inline-flex">
                <button @click="activeTab = 'data'" :class="activeTab === 'data' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'" class="px-8 py-2.5 rounded-xl font-black text-sm transition-all flex items-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 01-2-2z"></path></svg>
                    ទិន្នន័យ (Data)
                </button>
                <button @click="activeTab = 'settings'" :class="activeTab === 'settings' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'" class="px-8 py-2.5 rounded-xl font-black text-sm transition-all flex items-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    ការកំណត់ (Settings)
                </button>
            </div>
        </div>

        <PayrollDataTab 
            v-if="activeTab === 'data'" 
            :allUsersList="allUsersList" 
            :usersMap="usersMap" 
            :settingsList="settingsList" 
            :originalStocks="originalStocks" 
            :originalCombos="originalCombos" 
        />
        
        <PayrollSettingsTab 
            v-if="activeTab === 'settings'" 
            :allUsersList="allUsersList" 
            :usersMap="usersMap" 
            :settingsList="settingsList" 
        />

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { db } from '@/firebaseConfig';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';

// 🌟 Import ពី Folder ថ្មី comPayrollTab 🌟
import PayrollDataTab from './comPayrollTab/PayrollDataTab.vue';
import PayrollSettingsTab from './comPayrollTab/PayrollSettingsTab.vue';

const activeTab = ref('data'); 
const allUsersList = ref([]);
const usersMap = ref({});
const settingsList = ref([]);
const originalStocks = ref([]);
const originalCombos = ref([]);

const fetchGlobals = async () => {
    try {
        const uSnap = await getDocs(collection(db, 'users'));
        const map = {};
        allUsersList.value = uSnap.docs.map(d => {
            const name = d.data().fullName || d.data().username || d.data().name || d.id;
            map[d.id] = name;
            return { id: d.id, name };
        });
        usersMap.value = map;

        const sSnap = await getDocs(collection(db, 'stocks'));
        originalStocks.value = sSnap.docs.map(d => ({ id: d.id, ...d.data() }));

        const cSnap = await getDocs(collection(db, 'combos'));
        originalCombos.value = cSnap.docs.map(d => ({ id: d.id, ...d.data() }));

        onSnapshot(collection(db, 'payroll_settings'), (snap) => {
            settingsList.value = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        });
    } catch(e) { console.error(e); }
};

onMounted(() => { fetchGlobals(); });
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
</style>