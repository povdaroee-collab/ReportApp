<template>
  <div class="font-khmer min-h-[100dvh] flex flex-col relative bg-[#F4F7FE]" @click="handleClickOutside">
    
    <Teleport to="body">
      <div class="fixed top-4 right-4 z-[9999] w-full max-w-sm pointer-events-none flex flex-col gap-2">
        <div class="pointer-events-auto">
          <CustomAlert 
            :show="alert.show" 
            :title="alert.title" 
            :message="alert.message" 
            :type="alert.type" 
            @close="alert.show = false"
          />
        </div>
      </div>
    </Teleport>

    <div class="px-4 md:px-8 pt-8 pb-4 max-w-6xl mx-auto w-full">
      <div class="flex items-center gap-4">
         <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 text-white shrink-0">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
         </div>
         <div>
           <h1 class="text-2xl md:text-3xl font-black text-slate-800 tracking-tight leading-tight">បញ្ចូលទិន្នន័យលក់</h1>
           <p class="text-slate-500 text-[11px] md:text-xs font-bold uppercase tracking-wider mt-0.5">Input Daily Sales</p>
         </div>
      </div>
    </div>

    <div class="flex-1 px-4 md:px-8 pb-20 max-w-6xl mx-auto w-full flex flex-col md:flex-row gap-6">
      
      <div class="w-full bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 overflow-hidden relative">
        
        <div class="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 absolute top-0 left-0"></div>

        <div class="p-6 md:p-10">
          
          <form @submit.prevent="submitSale" class="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
            
            <div class="space-y-6">
              
              <div class="space-y-2.5 relative z-50">
                <label class="text-[11px] font-black text-slate-400 uppercase tracking-widest">ជ្រើសរើសតំណាងលក់ <span class="text-rose-500">*</span></label>
                
                <div class="relative group">
                  <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 pointer-events-none group-focus-within:text-indigo-500 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                  </span>
                  
                  <input 
                    type="text" 
                    v-model="sellerSearch"
                    @focus="showDropdown = true"
                    class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-10 py-3.5 text-slate-700 font-bold text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 placeholder:font-medium"
                    placeholder="វាយឈ្មោះ ឬ លេខ ID..."
                  >
                  
                  <button v-if="sellerSearch" @click.stop="clearSellerSelection" type="button" class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-rose-500 transition-colors">
                    <div class="bg-slate-100 hover:bg-rose-100 p-1 rounded-full">
                       <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </div>
                  </button>

                  <Transition 
                    enter-active-class="transition duration-200 ease-out"
                    enter-from-class="transform scale-95 opacity-0"
                    enter-to-class="transform scale-100 opacity-100"
                    leave-active-class="transition duration-75 ease-in"
                    leave-from-class="transform scale-100 opacity-100"
                    leave-to-class="transform scale-95 opacity-0"
                  >
                     <div v-if="showDropdown" class="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 max-h-64 overflow-y-auto z-50 custom-scrollbar">
                       <div v-if="loadingSellers" class="p-6 text-center text-slate-400 text-sm font-bold flex flex-col items-center gap-2">
                          <div class="w-5 h-5 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin"></div>
                          កំពុងទាញយក...
                       </div>
                       <div v-else-if="filteredSellers.length === 0" class="p-6 text-center text-slate-400 text-sm font-bold">
                          រកមិនឃើញតំណាងលក់នេះទេ
                       </div>
                       
                       <ul v-else class="p-2 space-y-1">
                         <li 
                           v-for="seller in filteredSellers" 
                           :key="seller.id" 
                           @click="selectSeller(seller)"
                           class="px-3 py-2.5 rounded-xl hover:bg-indigo-50 cursor-pointer border border-transparent hover:border-indigo-100 transition-all flex items-center justify-between group"
                         >
                           <div class="flex items-center gap-3">
                             <img :src="seller.photoUrl || `https://ui-avatars.com/api/?name=${seller.fullName}&background=random`" class="w-10 h-10 rounded-full object-cover shadow-sm border border-white group-hover:scale-105 transition-transform">
                             <div>
                               <p class="text-sm font-bold text-slate-800 leading-tight">{{ seller.fullName }}</p>
                               <p class="text-[10px] text-slate-400 font-mono mt-0.5 font-bold">ID: {{ seller.idNumber || 'N/A' }}</p>
                             </div>
                           </div>
                           <div v-if="form.sellerId === seller.id" class="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-md">
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                           </div>
                         </li>
                       </ul>
                     </div>
                  </Transition>
                </div>
              </div>

              <div class="space-y-2.5">
                <label class="text-[11px] font-black text-slate-400 uppercase tracking-widest">កាលបរិច្ឆេទ (Date) <span class="text-rose-500">*</span></label>
                <div class="relative group">
                  <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 pointer-events-none group-focus-within:text-indigo-500 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  </span>
                  <input 
                    v-model="form.date" 
                    type="date" 
                    class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3.5 text-slate-700 font-bold text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all cursor-pointer"
                  >
                </div>
              </div>

              <div class="space-y-2.5">
                <label class="text-[11px] font-black text-slate-400 uppercase tracking-widest">អតិថិជនសរុប (Total Clients) <span class="text-rose-500">*</span></label>
                <div class="relative group">
                  <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 pointer-events-none group-focus-within:text-amber-500 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                  </span>
                  <input 
                    v-model="form.totalClients" 
                    type="number" 
                    min="0"
                    placeholder="ឧ. 15" 
                    class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3.5 text-slate-700 font-bold text-sm focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all placeholder:font-medium placeholder:text-slate-300"
                  >
                </div>
              </div>

            </div>

            <div class="space-y-6">
              
              <div class="space-y-2.5">
                <label class="text-[11px] font-black text-slate-400 uppercase tracking-widest">បរិមាណលក់ (Qty & Unit) <span class="text-rose-500">*</span></label>
                <div class="flex flex-col sm:flex-row gap-3">
                  <div class="relative flex-1 group">
                    <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 pointer-events-none group-focus-within:text-indigo-500 transition-colors">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                    </span>
                    <input 
                      v-model="form.totalSold" 
                      type="number" 
                      min="0"
                      placeholder="ឧ. 100" 
                      class="w-full h-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3.5 text-slate-700 font-bold text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:font-medium placeholder:text-slate-300"
                    >
                  </div>
                  
                  <div class="bg-slate-100 p-1.5 rounded-xl flex items-center sm:w-48 shrink-0 shadow-inner border border-slate-200/60">
                    <button 
                      type="button"
                      @click="form.unit = 'bottle'"
                      class="flex-1 py-2 text-sm font-bold rounded-lg transition-all"
                      :class="form.unit === 'bottle' ? 'bg-white text-cyan-600 shadow-sm ring-1 ring-slate-200/50' : 'text-slate-400 hover:text-slate-600'"
                    >
                      ដប
                    </button>
                    <button 
                      type="button"
                      @click="form.unit = 'pack'"
                      class="flex-1 py-2 text-sm font-bold rounded-lg transition-all"
                      :class="form.unit === 'pack' ? 'bg-white text-purple-600 shadow-sm ring-1 ring-slate-200/50' : 'text-slate-400 hover:text-slate-600'"
                    >
                      កញ្ចប់
                    </button>
                  </div>
                </div>
              </div>

              <div class="space-y-2.5">
                <div class="flex justify-between items-end">
                   <label class="text-[11px] font-black text-slate-400 uppercase tracking-widest">ចំណូលសរុប (Revenue) <span class="text-rose-500">*</span></label>
                   
                   <div class="bg-slate-100 p-1 rounded-lg flex shadow-inner border border-slate-200/60">
                      <button 
                         type="button"
                         @click="form.currency = 'USD'"
                         class="px-3 py-1 text-[11px] font-black rounded-md transition-all uppercase tracking-wider"
                         :class="form.currency === 'USD' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'"
                      >USD</button>
                      <button 
                         type="button"
                         @click="form.currency = 'KHR'"
                         class="px-3 py-1 text-[11px] font-black rounded-md transition-all uppercase tracking-wider"
                         :class="form.currency === 'KHR' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'"
                      >KHR</button>
                   </div>
                </div>

                <div class="relative group">
                  <span class="absolute inset-y-0 left-0 pl-4 flex items-center font-black pointer-events-none text-lg" :class="form.currency === 'USD' ? 'text-emerald-500' : 'text-blue-500'">
                    {{ form.currency === 'USD' ? '$' : '៛' }}
                  </span>
                  <input 
                    v-model="form.totalPrice" 
                    type="number" 
                    step="0.01"
                    min="0"
                    placeholder="0.00" 
                    class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-4 text-slate-800 font-black text-xl focus:bg-white outline-none transition-all placeholder:text-slate-300"
                    :class="form.currency === 'USD' ? 'focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500' : 'focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'"
                  >
                </div>
              </div>

              <div class="bg-indigo-50/50 border border-indigo-100/50 rounded-xl p-4 flex items-start gap-3">
                 <div class="p-1.5 bg-indigo-100 rounded-lg text-indigo-600 shrink-0">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                 </div>
                 <div>
                    <p class="text-xs font-black text-indigo-800">ចំណាំ (Note)</p>
                    <p class="text-[11px] font-medium text-indigo-600 mt-1 leading-relaxed">
                       តំណាងលក់ម្នាក់អាចមានទិន្នន័យលក់តែ <strong class="text-indigo-800">១ដង</strong> ប៉ុណ្ណោះក្នុងមួយថ្ងៃ។ សូមត្រួតពិនិត្យឱ្យបានត្រឹមត្រូវមុនពេលរក្សាទុក។
                    </p>
                 </div>
              </div>

            </div>

            <div class="lg:col-span-2 pt-6 mt-2 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 sm:gap-4">
              <button 
                type="button" 
                @click="resetForm" 
                class="w-full sm:w-auto px-6 py-3.5 rounded-xl text-slate-500 font-bold hover:bg-slate-100 hover:text-slate-700 transition-colors text-sm"
              >
                សម្អាត (Clear)
              </button>
              
              <button 
                type="submit" 
                :disabled="isSubmitting"
                class="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-10 py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <svg v-if="isSubmitting" class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/></svg>
                <span>{{ isSubmitting ? 'កំពុងរក្សាទុក...' : 'រក្សាទុកទិន្នន័យ (Save)' }}</span>
              </button>
            </div>

          </form>

        </div>
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { db, auth } from '@/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';
import CustomAlert from '../../components/shared/CustomAlert.vue';

// State
const sellers = ref([]);
const loadingSellers = ref(true);
const isSubmitting = ref(false);
const sellerSearch = ref('');
const showDropdown = ref(false);

const alert = reactive({ show: false, title: '', message: '', type: 'success' });
const triggerAlert = (type, title, message) => {
  alert.type = type; alert.title = title; alert.message = message; alert.show = true;
  setTimeout(() => alert.show = false, 3000);
};

const form = reactive({
  sellerId: '',
  sellerName: '',
  sellerIdNumber: '',
  date: new Date().toISOString().substr(0, 10),
  totalClients: '',
  totalSold: '',
  unit: 'bottle',
  totalPrice: '',
  currency: 'USD'
});

// Fetch Sellers based on Admin UID
onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const q = query(
            collection(db, "users"), 
            where("role", "==", "seller"),
            where("createdBy", "==", user.uid) 
        );
        const snapshot = await getDocs(q);
        sellers.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (e) {
        console.error("Error fetching sellers:", e);
        triggerAlert('error', 'បរាជ័យ', 'មិនអាចទាញយកទិន្នន័យតំណាងលក់បានទេ');
      } finally {
        loadingSellers.value = false;
      }
    }
  });
});

const filteredSellers = computed(() => {
  if (!sellerSearch.value) return sellers.value;
  const lowerSearch = sellerSearch.value.toLowerCase();
  return sellers.value.filter(s => 
    s.fullName.toLowerCase().includes(lowerSearch) || 
    (s.idNumber && s.idNumber.toLowerCase().includes(lowerSearch))
  );
});

// Dropdown Logic
const selectSeller = (seller) => {
  form.sellerId = seller.id;
  form.sellerName = seller.fullName;
  form.sellerIdNumber = seller.idNumber;
  sellerSearch.value = `${seller.fullName} - ID: ${seller.idNumber || 'N/A'}`;
  showDropdown.value = false;
};

const clearSellerSelection = () => {
  form.sellerId = '';
  form.sellerName = '';
  form.sellerIdNumber = '';
  sellerSearch.value = '';
};

const handleClickOutside = (e) => {
  if(e.target.tagName !== 'INPUT') {
    showDropdown.value = false;
  }
};

const resetForm = () => {
  clearSellerSelection();
  form.totalClients = '';
  form.totalSold = '';
  form.totalPrice = '';
  form.unit = 'bottle';
  form.currency = 'USD';
  form.date = new Date().toISOString().substr(0, 10);
};

// Submit Logic
const submitSale = async () => {
  if (!form.sellerId || !form.totalClients || !form.totalSold || !form.totalPrice) {
    return triggerAlert('warning', 'សូមត្រួតពិនិត្យ', 'សូមបំពេញព័ត៌មានដែលមានសញ្ញាផ្កាយ (*) អោយបានគ្រប់គ្រាន់!');
  }

  isSubmitting.value = true;

  try {
    const payload = {
      sellerId: form.sellerId,
      sellerName: form.sellerName,
      sellerIdNumber: form.sellerIdNumber,
      date: form.date,
      totalClients: parseInt(form.totalClients),
      totalSold: parseInt(form.totalSold),
      unit: form.unit,
      totalPrice: parseFloat(form.totalPrice),
      currency: form.currency
    };

    const token = await auth.currentUser.getIdToken();
    const res = await axios.post('https://reportapp-81vf.onrender.com/api/sales/create', payload, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (res.data.success) {
      triggerAlert('success', 'ជោគជ័យ', 'ទិន្នន័យលក់ត្រូវបានរក្សាទុក!');
      resetForm();
    }

  } catch (error) {
    console.error(error);
    if (error.response && error.response.data && error.response.data.error === "DUPLICATE_ENTRY") {
        triggerAlert('error', 'ទិន្នន័យជាន់គ្នា', 'តំណាងលក់នេះមានទិន្នន័យសម្រាប់ថ្ងៃនេះរួចហើយ!');
    } else {
        triggerAlert('error', 'បរាជ័យ', 'មានបញ្ហាក្នុងការរក្សាទុកទិន្នន័យ');
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Battambong:wght@400;700;900&family=Kantumruy+Pro:wght@400;700&display=swap');
.font-khmer { font-family: 'Kantumruy Pro', 'Battambong', sans-serif; }

/* Custom Webkit Scrollbar for Dropdown */
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #94A3B8; }

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>