<template>
    <transition name="modal-fade">
        <div v-if="appState === 'expired'" class="fixed inset-0 z-[9999999] flex items-center justify-center p-4 bg-[#0f172a]/85 backdrop-blur-lg font-khmer">
            <div class="bg-white rounded-[32px] w-full max-w-[480px] p-8 md:p-10 text-center shadow-[0_0_80px_rgba(225,29,72,0.3)] relative overflow-hidden animate-scale-up border border-white/20">
                
                <div class="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-rose-500 via-red-600 to-rose-500"></div>
                <div class="absolute -top-24 -right-24 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div class="absolute -bottom-24 -left-24 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div class="w-28 h-28 bg-gradient-to-br from-rose-50 to-red-100 rounded-full flex items-center justify-center mx-auto mb-6 border-[6px] border-white shadow-[0_10px_30px_rgba(225,29,72,0.2)] relative z-10">
                    <div class="absolute inset-0 rounded-full border-4 border-rose-500/30 border-t-rose-600 animate-spin-slow"></div>
                    <svg class="w-12 h-12 text-rose-600 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                </div>
                
                <h2 class="text-[26px] font-black text-slate-800 mb-4 tracking-wide relative z-10">ប្រព័ន្ធត្រូវបានបិទ!</h2>
                
                <div class="bg-rose-50/80 border border-rose-100/80 rounded-2xl p-5 mb-8 relative z-10 shadow-inner">
                    <p class="text-[15px] font-bold text-slate-700 leading-[1.8]">
                        សូមអធ្យាស្រ័យ! ប្រព័ន្ធគ្រប់គ្រងស្តុក <span class="text-rose-600 font-black">ហួសសុពលភាពប្រើប្រាស់ហើយ!</span> <br>
                        សូមលោកអ្នកបង់សេវាកម្ម និង server clound សម្រាប់ខែបន្ទាប់ ឥឡូវនេះ
                        
                        
                        <!-- <span class="inline-block mt-1 font-black bg-rose-600 text-white px-3 py-1 rounded-lg shadow-sm text-sm tracking-wider">Upgrade ទៅ  Pro Version 💎</span>  -->
                        <br> ទើបអាចបន្តការប្រើប្រាស់បាន។ 
                    </p>
                </div>
                
                <a :href="developerContactLink" target="_blank" class="w-full bg-gradient-to-r from-[#0088cc] to-[#00a8ff] hover:from-[#0077b5] hover:to-[#0097e6] text-white font-black py-4 px-6 rounded-2xl transition-all duration-300 active:scale-[0.98] shadow-[0_10px_25px_rgba(0,136,204,0.4)] flex items-center justify-center gap-3 text-base relative z-10 hover:shadow-[0_15px_35px_rgba(0,136,204,0.5)]">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.223-.548.223l.188-2.85 5.18-4.68c.223-.198-.054-.31-.346-.11l-6.4 4.02-2.76-.86c-.6-.19-.61-.6.125-.9l10.81-4.17c.5-.19.93.11.75.815z"/></svg>
                    សូមទំនាក់ទំនងទៅអ្នកអភិវឌ្ឍន៍កម្មវិធី ! សូមអរគុណ!
                </a>
            </div>
        </div>
    </transition>

    <transition name="modal-fade">
        <div v-if="appState === 'warning' && showWarningModal" class="fixed inset-0 z-[9999999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm font-khmer" @click.self="showWarningModal = false">
            <div class="bg-white rounded-[32px] w-full max-w-[480px] p-8 md:p-10 text-center shadow-2xl relative overflow-hidden animate-scale-up">
                
                <div class="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-amber-400 to-orange-500"></div>
                <div class="absolute -top-20 -right-20 w-40 h-40 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
                
                <button @click="showWarningModal = false" class="absolute top-5 right-5 text-slate-400 hover:text-rose-500 bg-slate-100 hover:bg-rose-50 rounded-full p-2.5 transition-all duration-200">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>

                <div class="w-24 h-24 bg-gradient-to-br from-amber-50 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 border-[6px] border-white shadow-[0_10px_25px_rgba(245,158,11,0.2)]">
                    <svg class="w-11 h-11 text-orange-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                </div>
                
                <h2 class="text-2xl font-black text-slate-800 mb-3 tracking-wide">ជិតហួសសុពលភាពហើយ!</h2>
                
                <div class="bg-orange-50/50 border border-orange-100 rounded-2xl p-5 mb-8 shadow-inner">
                    <p class="text-[14.5px] font-bold text-slate-700 leading-relaxed mb-4">
                        ប្រព័ន្ធគ្រប់គ្រងស្តុក ជិតហួសសុពលភាពប្រើប្រាស់ហើយ។
                        ឥឡូវនេះអ្នកត្រូវ Upgrade ប្រព័ន្ធទៅជា Pro Version ទើបអាចបន្តប្រើប្រាស់បាន។
                    </p>
                    
                    <div class="flex flex-col items-center justify-center gap-1.5 bg-white border border-amber-200 py-3.5 px-4 rounded-xl shadow-sm mb-3">
                        <span class="text-xs font-black text-slate-500 uppercase tracking-widest">ពេលវេលានៅសល់</span>
                        <span class="text-2xl font-black text-orange-600">{{ remainingDays }} ថ្ងៃទៀត</span>
                    </div>
                    <p class="text-[11.5px] font-bold text-slate-500">
                        ប្រព័ន្ធនឹងបិទទាំងស្រុងនៅថ្ងៃទី៖ <span class="text-rose-500 font-black">{{ formattedExpiryDate }}</span>
                    </p>
                </div>
                
                <div class="flex flex-col sm:flex-row gap-3">
                    <button @click="showWarningModal = false" class="flex-1 py-3.5 rounded-xl font-bold text-slate-600 bg-white border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all text-sm">
                        រំលឹកខ្ញុំពេលក្រោយ
                    </button>
                    <a :href="developerContactLink" target="_blank" class="flex-1 py-3.5 rounded-xl font-black text-white bg-gradient-to-r from-[#0088cc] to-[#00a8ff] hover:from-[#0077b5] hover:to-[#0097e6] shadow-[0_8px_20px_rgba(0,136,204,0.3)] hover:shadow-[0_12px_25px_rgba(0,136,204,0.4)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm">
                        ទាក់ទង Developer
                    </a>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { db, auth } from '@/firebaseConfig';
import { collection, onSnapshot, limit, query, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

// ==========================================
// ⚙️ ការកំណត់ (CONFIGURATIONS) 
// ==========================================
// កំណត់ថ្ងៃផុតកំណត់ (Format: YYYY-MM-DDTHH:mm:ss) ត្រូវនឹង Rule: timestamp.date(2026, 3, 23)
const EXPIRY_DATE_STRING = '2026-03-23T00:00:00'; 
// 🔗 Link ទំនាក់ទំនងទៅ Telegram Developer ថ្មី
const developerContactLink = 'https://t.me/MMKDaro'; 

const appState = ref('active'); // 'active', 'warning', 'expired'
const showWarningModal = ref(true);
const remainingDays = ref(0);

let unsubscribeFirebasePing = null;
let recoveryInterval = null; // សម្រាប់ឆែក Real-time ពេលកំពុងបិទ (Blocked)
let authUnsubscribe = null;

const targetDate = new Date(EXPIRY_DATE_STRING).getTime();

const formattedExpiryDate = computed(() => {
    const d = new Date(EXPIRY_DATE_STRING);
    return d.toLocaleDateString('km-KH', { day: 'numeric', month: 'long', year: 'numeric' });
});

// មុខងារឆែកមើលថ្ងៃខែក្នុងកុំព្យូទ័រ
const checkDateWarning = () => {
    if (appState.value === 'expired') return; 

    const now = new Date().getTime();
    const diffTime = targetDate - now;
    
    if (diffTime <= 0) {
        appState.value = 'expired';
        remainingDays.value = 0;
        startRecoveryPolling(); // ក្រែងលោគាត់ទិញហើយ យើងបើកឱ្យវិញ
    } else {
        const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        remainingDays.value = days;
        if (days <= 3) {
            appState.value = 'warning';
        } else {
            appState.value = 'active';
        }
    }
};

// 🔄 ប្រព័ន្ធឆែកស្វ័យប្រវត្តិ (Polling) ពេលកុំព្យូទ័រត្រូវបិទ (Expired)
// ជួយឱ្យពេលបងដូរ Rule ទៅ true វិញ វាដកផ្ទាំងចេញភ្លាម!
const startRecoveryPolling = () => {
    if (recoveryInterval) clearInterval(recoveryInterval);
    
    // ឆែករាល់ ៣ វិនាទីម្តង
    recoveryInterval = setInterval(async () => {
        try {
            const q = query(collection(db, 'users'), limit(1));
            await getDocs(q); // សាកល្បងអានទិន្នន័យ
            
            // បើអានបានមានន័យថា Rule = true វិញហើយ (Access Restored!)
            clearInterval(recoveryInterval);
            recoveryInterval = null;
            appState.value = 'active'; // Reset ឱ្យដើរវិញ
            checkDateWarning(); // គណនាថ្ងៃខែម្តងទៀត
            listenToFirebaseRules(); // ភ្ជាប់ Real-time Listener ឡើងវិញ
            
        } catch (error) {
            // នៅតែ false ដដែល -> ទុកផ្ទាំងក្រហមដដែល (អត់ទាន់បើកឱ្យ)
        }
    }, 3000); 
};

// 📡 ប្រព័ន្ធស្តាប់ Real-time ចាប់ការផ្លាស់ប្តូរ Rule ភ្លាមៗ
const listenToFirebaseRules = () => {
    if (unsubscribeFirebasePing) unsubscribeFirebasePing();

    const pingQuery = query(collection(db, 'users'), limit(1));
    
    unsubscribeFirebasePing = onSnapshot(pingQuery, 
        (snapshot) => {
            // អនុញ្ញាតឱ្យចូល (Rule = true)
            if (recoveryInterval) {
                clearInterval(recoveryInterval);
                recoveryInterval = null;
            }
            checkDateWarning();
        },
        (error) => {
            // 🔴 ពេលបងដូរ Rule ទៅជា allow read: false វានឹងលោតចូលទីនេះភ្លាមៗ
            if (error.code === 'permission-denied') {
                console.error("🔥 SYSTEM BLOCKED BY FIREBASE RULES!");
                appState.value = 'expired';
                startRecoveryPolling(); // ចាប់ផ្តើមឆែករាល់ ៣វិ ម្តងក្រែងលោបើកឱ្យវិញ
            }
        }
    );
};

onMounted(() => {
    // រង់ចាំ Login សិន ទើបចាប់ផ្តើមឆែកសិទ្ធិ
    authUnsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            listenToFirebaseRules();
        }
    });
});

onUnmounted(() => {
    if (unsubscribeFirebasePing) unsubscribeFirebasePing();
    if (recoveryInterval) clearInterval(recoveryInterval);
    if (authUnsubscribe) authUnsubscribe();
});
</script>

<style scoped>
/* ប្រើហ្វុនថ្មី Kantumruy Pro ដែលមើលទៅ Premium ខ្លាំង */
@import url('https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;500;600;700&family=Battambang:wght@400;700;900&display=swap');

.font-khmer { 
    font-family: 'Kantumruy Pro', 'Battambang', sans-serif; 
}

/* Animations */
.animate-scale-up { 
    animation: scaleUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
}
@keyframes scaleUp { 
    from { opacity: 0; transform: translateY(30px) scale(0.9); } 
    to { opacity: 1; transform: translateY(0) scale(1); } 
}

.animate-spin-slow {
    animation: spin 3s linear infinite;
}

.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.3s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
</style>