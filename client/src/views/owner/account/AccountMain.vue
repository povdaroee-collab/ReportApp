<template>
  <div class="relative min-h-[100dvh] bg-[#F4F7FE] font-khmer flex flex-col pb-10">

    <Toast />

    <div v-if="!isUnlocked" class="fixed inset-0 z-[999999] bg-[#0F172A] flex items-center justify-center p-4">
        
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
            <div class="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px]"></div>
            <div class="absolute bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-rose-500/10 blur-[120px]"></div>
            <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02]"></div>
        </div>

        <div v-if="isCheckingStatus" class="relative z-10 flex flex-col items-center">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-slate-800 border-t-indigo-500 mb-4"></div>
            <p class="text-slate-500 font-bold animate-pulse text-sm">កំពុងពិនិត្យសុវត្ថិភាព...</p>
        </div>

        <div v-else class="bg-slate-900/60 backdrop-blur-3xl border border-slate-800 p-8 md:p-10 rounded-[3rem] shadow-2xl w-full max-w-md relative z-10 animate-fade-in-up text-center overflow-hidden">
            <div class="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>

            <div class="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-indigo-500/20 rotate-3">
                <svg class="w-10 h-10 text-white -rotate-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            </div>

            <h2 class="text-2xl font-black text-white mb-2 tracking-wide">ផ្ទៀងផ្ទាត់សុវត្ថិភាព</h2>
            <p class="text-sm font-bold text-slate-400 mb-8">សូមបញ្ចូលលេខសម្ងាត់ហិរញ្ញវត្ថុដើម្បីបន្ត</p>

            <form @submit.prevent="verifyPassword" class="space-y-6">
                <div class="relative group">
                    <input 
                        :type="showPassword ? 'text' : 'password'" 
                        v-model="inputPassword"
                        class="w-full bg-slate-950 border border-slate-700 group-focus-within:border-indigo-500 rounded-2xl px-5 py-4 text-center text-2xl font-black text-white outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all tracking-[0.3em] shadow-inner"
                        placeholder="••••••"
                        autofocus
                    >
                    <button type="button" @click="showPassword = !showPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                        <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                        <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
                    </button>
                </div>

                <div class="flex items-center justify-between px-1">
                    <label class="flex items-center gap-2 cursor-pointer group">
                        <input type="checkbox" v-model="rememberMe" class="w-4 h-4 rounded border-slate-700 bg-slate-950 text-indigo-500 focus:ring-indigo-500/50 cursor-pointer">
                        <span class="text-xs font-bold text-slate-500 group-hover:text-slate-300 transition-colors">រក្សាការចូលប្រើ</span>
                    </label>

                    <button type="button" @click="showHelpConfirm = true" class="text-xs font-black text-indigo-400 hover:text-indigo-300 transition-colors">
                        ភ្លេចលេខសម្ងាត់?
                    </button>
                </div>

                <button type="submit" :disabled="!inputPassword || isUnlocking" class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50">
                    <span v-if="isUnlocking" class="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                    <span v-else>ចូលគណនី (Unlock)</span>
                </button>
            </form>

            <div v-if="!hasPasswordSet" class="mt-8 pt-6 border-t border-slate-800/50">
                <button @click="showSetupModal = true" class="text-xs font-black text-emerald-400 hover:text-emerald-300 transition-colors">
                    + បង្កើតលេខសម្ងាត់ហិរញ្ញវត្ថុថ្មី
                </button>
            </div>
        </div>
    </div>

    <div v-else class="flex flex-col h-full animate-fade-in">
        <div class="bg-white border-b border-slate-200 shadow-sm">
            <div class="max-w-[90rem] mx-auto px-4 md:px-8 py-5 flex justify-between items-center">
                <div>
                    <h1 class="font-black text-slate-800 text-2xl flex items-center gap-3">
                        <div class="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center border border-indigo-100">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                        </div>
                        គណនី និងហិរញ្ញវត្ថុ
                    </h1>
                    <p class="text-sm font-bold text-slate-500 mt-1 pl-13">គ្រប់គ្រងចំណូល ចំណាយ និងវិភាគទិន្នន័យ</p>
                </div>
                
                <button @click="lockAccount" class="hidden md:flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-500 px-4 py-2 rounded-xl font-bold text-xs transition-colors border border-slate-200 shadow-sm">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                    ចាក់សោរវិញ
                </button>
            </div>

            <div class="max-w-[90rem] mx-auto px-4 md:px-8 mt-2 flex gap-6 border-b border-transparent overflow-x-auto hide-scrollbar">
                <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" class="pb-4 px-1 text-sm font-black whitespace-nowrap transition-colors relative" :class="activeTab === tab.id ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'">
                    {{ tab.name }}
                    <div v-if="activeTab === tab.id" class="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-t-full"></div>
                </button>
            </div>
        </div>

        <div class="flex-1 w-full max-w-[90rem] mx-auto p-4 md:p-8 animate-fade-in-up">
            <IncomeTab v-if="activeTab === 'income'" />
            <AnalysisTab v-else-if="activeTab === 'analysis'" />
            <PayrollTab v-else-if="activeTab === 'payroll'" />
            <StockPdTab v-else-if="activeTab === 'stock_pd'" />
            <MyAccountTab v-else-if="activeTab === 'my-account'" />
        </div>
    </div>

    <transition enter-active-class="duration-300 ease-out" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100" leave-active-class="duration-200 ease-in" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
        <div v-if="showHelpConfirm" class="fixed inset-0 z-[9999999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-khmer">
            <div class="bg-[#1E293B] rounded-[2.5rem] w-full max-w-sm p-8 text-center shadow-2xl border border-slate-700 relative overflow-hidden">
                <div class="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                <div class="w-20 h-20 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-indigo-500/20">
                    <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <h3 class="text-xl font-black text-white mb-3 tracking-wide">ស្នើសុំជំនួយ?</h3>
                <p class="text-sm font-bold text-slate-400 leading-relaxed mb-8 px-2">ប្រព័ន្ធនឹងផ្ញើសារសុំជំនួយទៅកាន់តេឡេក្រាមរបស់អ្នកអភិវឌ្ឍន៍ ដើម្បីជួយអ្នកប្តូរលេខសម្ងាត់ថ្មី។</p>
                <div class="flex flex-col gap-3">
                    <button @click="requestHelp" :disabled="isRequestingHelp" class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2">
                        <span v-if="isRequestingHelp" class="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                        <span v-else>យល់ព្រម ផ្ញើសារស្នើសុំ</span>
                    </button>
                    <button @click="showHelpConfirm = false" class="w-full bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold py-3.5 rounded-2xl transition-colors">បោះបង់</button>
                </div>
            </div>
        </div>
    </transition>

    <div v-if="showSetupModal" class="fixed inset-0 z-[9999999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <div class="bg-white rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl animate-fade-in-up">
            <h3 class="text-xl font-black text-slate-800 mb-6">កំណត់លេខសម្ងាត់ថ្មី</h3>
            <form @submit.prevent="saveNewPassword" class="space-y-4">
                <input v-model="setupData.pwd1" type="password" required class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-black text-slate-800 outline-none focus:ring-4 focus:ring-indigo-500/10" placeholder="លេខសម្ងាត់ថ្មី...">
                <input v-model="setupData.pwd2" type="password" required class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-black text-slate-800 outline-none focus:ring-4 focus:ring-indigo-500/10" placeholder="បញ្ជាក់លេខសម្ងាត់...">
                <div v-if="setupError" class="text-xs font-bold text-rose-500 bg-rose-50 p-3 rounded-xl border border-rose-100">{{ setupError }}</div>
                <div class="pt-4 flex gap-3">
                    <button type="button" @click="closeSetupModal" class="flex-1 bg-slate-100 text-slate-500 font-black py-4 rounded-2xl">បោះបង់</button>
                    <button type="submit" :disabled="isSavingPwd" class="flex-1 bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-lg">
                        {{ isSavingPwd ? 'រក្សាទុក...' : 'រក្សាទុក' }}
                    </button>
                </div>
            </form>
        </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { db, auth } from '@/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useNotificationStore } from '@/stores/notification';
import Toast from '@/components/Toast.vue';
import axios from 'axios';
import MyAccountTab from './tabs/MyAccountTab.vue';

// Tabs Components
import IncomeTab from './tabs/IncomeTab.vue';
import AnalysisTab from './tabs/AnalysisTab.vue';
import PayrollTab from './tabs/PayrollTab.vue';
import StockPdTab from './tabs/StockPdTab.vue';

const notification = useNotificationStore();

// Security States
const isUnlocked = ref(false);
const isCheckingStatus = ref(true);
const hasPasswordSet = ref(true);
const inputPassword = ref('');
const showPassword = ref(false);
const isUnlocking = ref(false);

const rememberMe = ref(false); // ទម្រង់ដើមមិនបាច់ធីក
const showHelpConfirm = ref(false); 
const isRequestingHelp = ref(false);

// Setup Modal States
const showSetupModal = ref(false);
const isSavingPwd = ref(false);
const setupError = ref('');
const setupData = reactive({ pwd1: '', pwd2: '' });

let currentUserUid = null;

// Tabs Logic
const activeTab = ref('income');
const tabs = [
    { id: 'income', name: 'ទិន្នន័យស្តុក' },
    { id: 'analysis', name: 'វិភាគទិន្នន័យ' },
    { id: 'payroll', name: 'ចែកភាគរយតំណាងលក់' },
    { id: 'stock_pd', name: 'កាត់ស្តុក-PD' },
    { id: 'my-account', name: 'គណនីរបស់ខ្ញុំ' }
];

let authUnsubscribe;

onMounted(() => {
    authUnsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
            currentUserUid = user.uid;

            // 🌟 ឆែក Session Storage និងផ្ទៀងផ្ទាត់ជាមួយម៉ោង Login ចុងក្រោយ
            const storedSession = sessionStorage.getItem(`finance_unlocked_${currentUserUid}`);
            const currentSessionTime = user.metadata.lastSignInTime;

            // បើគាត់មិនទាន់ Logout ទេ ម៉ោង lastSignInTime គឺនៅដដែល
            if (storedSession === currentSessionTime) {
                isUnlocked.value = true;
                isCheckingStatus.value = false;
                return;
            }

            try {
                const userDocRef = doc(db, 'users', currentUserUid);
                const userSnap = await getDoc(userDocRef);
                if (userSnap.exists()) {
                    hasPasswordSet.value = !!userSnap.data().financePassword;
                }
            } catch (error) { console.error(error); } 
            finally { isCheckingStatus.value = false; }
        } else {
            // 🌟 បើ Auth ធ្លាក់ដល់ null (បានន័យថា Logout) លុបចោលការចងចាំទាំងអស់
            isUnlocked.value = false;
            isCheckingStatus.value = false;
            if (currentUserUid) {
                sessionStorage.removeItem(`finance_unlocked_${currentUserUid}`);
                localStorage.removeItem(`finance_unlocked_${currentUserUid}`); // លុប localStorage ចាស់ៗការពារ Error
                currentUserUid = null;
            }
        }
    });
});

const verifyPassword = async () => {
    if (!inputPassword.value || !currentUserUid) return;
    isUnlocking.value = true;
    try {
        const userDocRef = doc(db, 'users', currentUserUid);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
            if (inputPassword.value === userSnap.data().financePassword) {
                notification.success("ផ្ទៀងផ្ទាត់ជោគជ័យ!");
                isUnlocked.value = true;
                
                // 🌟 បើចុច Remember Me រក្សាទុកម៉ោង Login បច្ចុប្បន្នចូល sessionStorage
                if (rememberMe.value && auth.currentUser) {
                    sessionStorage.setItem(`finance_unlocked_${currentUserUid}`, auth.currentUser.metadata.lastSignInTime);
                }
                inputPassword.value = ''; 
            } else {
                notification.error("លេខសម្ងាត់មិនត្រឹមត្រូវ!");
                inputPassword.value = '';
            }
        }
    } catch (e) { notification.error("បញ្ហាបណ្តាញ"); } 
    finally { isUnlocking.value = false; }
};

const lockAccount = () => {
    isUnlocked.value = false;
    if (currentUserUid) {
        sessionStorage.removeItem(`finance_unlocked_${currentUserUid}`);
        localStorage.removeItem(`finance_unlocked_${currentUserUid}`);
    }
    notification.success("បានចាក់សោរវិញជោគជ័យ!");
};

// Function បាញ់ទៅកាន់ Backend
const requestHelp = async () => {
    if (!currentUserUid) return;
    
    isRequestingHelp.value = true;
    try {
        const token = await auth.currentUser.getIdToken(true);
        
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const BASE_URL = isLocalhost ? 'http://localhost:3000' : 'https://reportapp-81vf.onrender.com';
        
        await axios.post(`${BASE_URL}/api/request-finance-reset`, {
            uid: currentUserUid,
            email: auth.currentUser.email,
            name: auth.currentUser.displayName || 'Owner Account'
        }, { headers: { Authorization: `Bearer ${token}` } });
        
        notification.success("សារត្រូវបានផ្ញើទៅកាន់តេឡេក្រាមជោគជ័យ!");
        showHelpConfirm.value = false; 
    } catch(e) {
        console.error("API Error:", e);
        notification.error("បរាជ័យក្នុងការផ្ញើសារ! សូមពិនិត្យមើលការតភ្ជាប់។");
    } finally { 
        isRequestingHelp.value = false; 
    }
};

const saveNewPassword = async () => {
    if (setupData.pwd1.length < 4) return setupError.value = "យ៉ាងតិច ៤ ខ្ទង់!";
    if (setupData.pwd1 !== setupData.pwd2) return setupError.value = "មិនផ្ទៀងផ្ទាត់!";
    isSavingPwd.value = true;
    try {
        await updateDoc(doc(db, 'users', currentUserUid), { financePassword: setupData.pwd1 });
        notification.success("ជោគជ័យ!");
        hasPasswordSet.value = true;
        closeSetupModal();
    } catch (e) { setupError.value = "Error!"; } 
    finally { isSavingPwd.value = false; }
};

const closeSetupModal = () => { showSetupModal.value = false; setupError.value = ''; };
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Battambong:wght@400;700;900&family=Kantumruy+Pro:wght@400;700;900&display=swap');
.font-khmer { font-family: 'Kantumruy Pro', 'Battambong', sans-serif; }
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.animate-fade-in-up { animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
.animate-fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
</style>