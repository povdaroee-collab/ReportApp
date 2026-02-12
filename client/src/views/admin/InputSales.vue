<template>
  <div class="font-khmer h-full flex flex-col relative" @click="handleClickOutside">
    
    <div class="fixed top-4 right-4 z-[100] w-full max-w-sm pointer-events-none">
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

    <div class="mb-8">
      <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">បញ្ចូលទិន្នន័យលក់ (Input Sales)</h1>
      <p class="text-slate-500 text-sm mt-1">កត់ត្រាការលក់ប្រចាំថ្ងៃរបស់តំណាងលក់</p>
    </div>

    <div class="flex-1 flex justify-center items-start pb-20">
      <div class="w-full max-w-5xl bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative">
        
        <div class="h-2 w-full bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500"></div>

        <div class="p-8 md:p-10">
          
          <form @submit.prevent="submitSale" class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            
            <div class="space-y-8">
              
              <div class="space-y-2 relative z-50">
                <label class="text-sm font-bold text-slate-700">ជ្រើសរើសតំណាងលក់ (Search Seller)</label>
                <p class="text-xs text-slate-400 mb-1">ស្វែងរកតាម ឈ្មោះ ឬ លេខអត្តសញ្ញាណប័ណ្ណ</p>
                
                <div class="relative group">
                  <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 pointer-events-none">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                  </span>
                  
                  <input 
                    type="text" 
                    v-model="sellerSearch"
                    @focus="showDropdown = true"
                    class="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-10 py-4 text-slate-700 font-medium focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                    placeholder="វាយឈ្មោះ ឬ លេខ ID..."
                  >
                  
                  <button v-if="sellerSearch" @click.stop="clearSellerSelection" type="button" class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-red-500 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>

                  <div v-if="showDropdown" class="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 max-h-60 overflow-y-auto z-50 animate-fadeIn">
                    <div v-if="loadingSellers" class="p-4 text-center text-slate-400 text-sm">កំពុងផ្ទុក...</div>
                    <div v-else-if="filteredSellers.length === 0" class="p-4 text-center text-slate-400 text-sm">រកមិនឃើញទិន្នន័យ</div>
                    
                    <ul v-else>
                      <li 
                        v-for="seller in filteredSellers" 
                        :key="seller.id" 
                        @click="selectSeller(seller)"
                        class="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-slate-50 last:border-none transition-colors flex items-center justify-between"
                      >
                        <div class="flex items-center gap-3">
                          <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                            {{ seller.fullName.charAt(0) }}
                          </div>
                          <div>
                            <p class="text-sm font-bold text-slate-700">{{ seller.fullName }}</p>
                            <p class="text-xs text-slate-500">ID: {{ seller.idNumber || 'N/A' }}</p>
                          </div>
                        </div>
                        <span v-if="form.sellerId === seller.id" class="text-blue-500 font-bold text-sm">✓</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div class="space-y-2">
                <label class="text-sm font-bold text-slate-700">កាលបរិច្ឆេទ (Date)</label>
                <div class="relative group">
                  <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 pointer-events-none group-focus-within:text-blue-500 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  </span>
                  <input 
                    v-model="form.date" 
                    type="date" 
                    class="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-slate-700 font-medium focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                  >
                </div>
              </div>

              <div class="space-y-2">
                <label class="text-sm font-bold text-slate-700">ចំនួនអតិថិជនសរុប (Total Clients)</label>
                <div class="relative group">
                  <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 pointer-events-none group-focus-within:text-cyan-500 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                  </span>
                  <input 
                    v-model="form.totalClients" 
                    type="number" 
                    min="0"
                    placeholder="0" 
                    class="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-slate-700 font-medium focus:bg-white focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none transition-all"
                  >
                </div>
              </div>

            </div>

            <div class="space-y-8">
              
              <div class="space-y-2">
                <label class="text-sm font-bold text-slate-700">ចំនួនផលិតផល (Product Qty & Unit)</label>
                <div class="flex gap-4">
                  <div class="relative flex-1 group">
                    <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 pointer-events-none group-focus-within:text-cyan-500 transition-colors">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                    </span>
                    <input 
                      v-model="form.totalSold" 
                      type="number" 
                      min="0"
                      placeholder="Qty" 
                      class="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-slate-700 font-medium focus:bg-white focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none transition-all"
                    >
                  </div>
                  
                  <div class="bg-slate-100 p-1 rounded-2xl flex items-center w-36">
                    <button 
                      type="button"
                      @click="form.unit = 'bottle'"
                      class="flex-1 py-3 text-sm font-bold rounded-xl transition-all shadow-sm"
                      :class="form.unit === 'bottle' ? 'bg-white text-blue-600 shadow' : 'text-slate-400 hover:text-slate-600'"
                    >
                      ដប
                    </button>
                    <button 
                      type="button"
                      @click="form.unit = 'pack'"
                      class="flex-1 py-3 text-sm font-bold rounded-xl transition-all shadow-sm"
                      :class="form.unit === 'pack' ? 'bg-white text-blue-600 shadow' : 'text-slate-400 hover:text-slate-600'"
                    >
                      កញ្ចប់
                    </button>
                  </div>
                </div>
              </div>

              <div class="space-y-2">
                <label class="text-sm font-bold text-slate-700">ទឹកប្រាក់សរុប (Total Revenue)</label>
                
                <div class="flex gap-4 mb-3">
                   <label 
                     class="flex-1 cursor-pointer border rounded-xl p-3 flex items-center justify-center gap-2 transition-all"
                     :class="form.currency === 'USD' ? 'border-green-500 bg-green-50 text-green-700 ring-2 ring-green-500/20' : 'border-slate-200 text-slate-500 hover:bg-slate-50'"
                   >
                      <input type="radio" v-model="form.currency" value="USD" class="hidden">
                      <span class="font-bold text-lg">$ (Dollar)</span>
                   </label>
                   
                   <label 
                     class="flex-1 cursor-pointer border rounded-xl p-3 flex items-center justify-center gap-2 transition-all"
                     :class="form.currency === 'KHR' ? 'border-orange-500 bg-orange-50 text-orange-700 ring-2 ring-orange-500/20' : 'border-slate-200 text-slate-500 hover:bg-slate-50'"
                   >
                      <input type="radio" v-model="form.currency" value="KHR" class="hidden">
                      <span class="font-bold text-lg">៛ (Riel)</span>
                   </label>
                </div>

                <div class="relative group">
                  <span class="absolute inset-y-0 left-0 pl-4 flex items-center font-bold pointer-events-none text-lg" :class="form.currency === 'USD' ? 'text-green-500' : 'text-orange-500'">
                    {{ form.currency === 'USD' ? '$' : '៛' }}
                  </span>
                  <input 
                    v-model="form.totalPrice" 
                    type="number" 
                    step="0.01"
                    min="0"
                    placeholder="0.00" 
                    class="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-slate-700 font-bold text-lg focus:bg-white focus:ring-4 outline-none transition-all"
                    :class="form.currency === 'USD' ? 'focus:ring-green-500/10 focus:border-green-500' : 'focus:ring-orange-500/10 focus:border-orange-500'"
                  >
                </div>
              </div>

              <div class="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
                 <svg class="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                 <div>
                    <p class="text-xs font-bold text-blue-800">ចំណាំ (Note)</p>
                    <p class="text-xs text-blue-600 mt-1">ទិន្នន័យនេះនឹងត្រូវកត់ត្រាទុកថាបញ្ចូលដោយគណនីរបស់អ្នក។ សូមពិនិត្យព័ត៌មានឱ្យបានត្រឹមត្រូវមុននឹងរក្សាទុក។</p>
                 </div>
              </div>

            </div>

            <div class="md:col-span-2 pt-6 border-t border-slate-100 flex items-center justify-end gap-4">
              <button 
                type="button" 
                @click="resetForm" 
                class="px-6 py-4 rounded-2xl text-slate-500 font-bold hover:bg-slate-100 transition-colors"
              >
                សម្អាត (Clear)
              </button>
              
              <button 
                type="submit" 
                :disabled="isSubmitting"
                class="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-500/30 flex items-center gap-3 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg v-if="isSubmitting" class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
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
import axios from 'axios';
import CustomAlert from '../../components/shared/CustomAlert.vue';

const sellers = ref([]);
const loadingSellers = ref(true);
const isSubmitting = ref(false);
const sellerSearch = ref(''); // Text input for search
const showDropdown = ref(false);

const alert = reactive({ show: false, title: '', message: '', type: 'success' });
const triggerAlert = (type, title, message) => {
  alert.type = type; alert.title = title; alert.message = message; alert.show = true;
  setTimeout(() => alert.show = false, 3000);
};

const form = reactive({
  sellerId: '',
  sellerName: '', // To store selected name
  sellerIdNumber: '', // To store selected ID Number
  date: new Date().toISOString().substr(0, 10),
  totalClients: '',
  totalSold: '',
  unit: 'bottle', // 'bottle' or 'pack'
  totalPrice: '',
  currency: 'USD' // 'USD' or 'KHR'
});

// 1. Fetch Sellers
onMounted(async () => {
  try {
    const q = query(collection(db, "users"), where("role", "==", "seller"));
    const snapshot = await getDocs(q);
    sellers.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    console.error("Error fetching sellers:", e);
    triggerAlert('error', 'Error', 'Failed to load sellers');
  } finally {
    loadingSellers.value = false;
  }
});

// 2. Computed Search Logic
const filteredSellers = computed(() => {
  if (!sellerSearch.value) return sellers.value;
  const lowerSearch = sellerSearch.value.toLowerCase();
  return sellers.value.filter(s => 
    s.fullName.toLowerCase().includes(lowerSearch) || 
    (s.idNumber && s.idNumber.toLowerCase().includes(lowerSearch))
  );
});

// 3. Dropdown Actions
const selectSeller = (seller) => {
  form.sellerId = seller.id;
  form.sellerName = seller.fullName;
  form.sellerIdNumber = seller.idNumber;
  
  // Set display text
  sellerSearch.value = `${seller.fullName} - ${seller.idNumber || 'No ID'}`;
  showDropdown.value = false;
};

const clearSellerSelection = () => {
  form.sellerId = '';
  form.sellerName = '';
  form.sellerIdNumber = '';
  sellerSearch.value = '';
};

// Close dropdown when clicking outside
const handleClickOutside = (e) => {
  // Simple check: if click target is not an input, close
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

// 4. Submit Data
const submitSale = async () => {
  if (!form.sellerId || !form.totalClients || !form.totalSold || !form.totalPrice) {
    return triggerAlert('error', 'បរាជ័យ', 'សូមបំពេញព័ត៌មានអោយបានគ្រប់គ្រាន់!');
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
      unit: form.unit, // 'bottle' or 'pack'
      totalPrice: parseFloat(form.totalPrice),
      currency: form.currency // 'USD' or 'KHR'
    };

    const token = await auth.currentUser.getIdToken();
    const res = await axios.post('http://localhost:5000/api/sales/create', payload, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (res.data.success) {
      triggerAlert('success', 'ជោគជ័យ', 'ទិន្នន័យលក់ត្រូវបានរក្សាទុក!');
      resetForm();
    }

  } catch (error) {
    console.error(error);
    triggerAlert('error', 'បរាជ័យ', 'មានបញ្ហាក្នុងការរក្សាទុកទិន្នន័យ');
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
/* Keyframe for Dropdown Animation */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.2s ease-out forwards;
}
</style>