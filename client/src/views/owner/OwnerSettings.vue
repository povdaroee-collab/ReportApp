<template>
  <div class="font-khmer h-[100dvh] flex flex-col relative bg-[#F4F7FE] overflow-hidden">
    
    <Teleport to="body">
      <div class="fixed top-4 right-4 z-[9999] w-full max-w-sm pointer-events-none flex flex-col gap-2">
        <div class="pointer-events-auto">
           <CustomAlert 
             :show="alert.show" 
             :type="alert.type" 
             :title="alert.title" 
             :message="alert.message" 
             @close="alert.show = false"
           />
        </div>
      </div>
    </Teleport>

    <div class="flex-none bg-white/80 backdrop-blur-2xl border-b border-slate-200/60 z-40 p-4 md:px-8 md:py-5 shadow-sm transition-all">
      <div class="flex items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shadow-lg shadow-slate-900/20 text-white shrink-0">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          </div>
          <div>
            <h1 class="text-2xl md:text-3xl font-black text-slate-800 tracking-tight leading-tight">ការកំណត់ (Settings)</h1>
            <p class="text-slate-500 text-[11px] md:text-xs font-bold mt-0.5 uppercase tracking-wider">គ្រប់គ្រងប្រភេទឯកតាលក់ (Unit Types)</p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 relative">
      <div class="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-indigo-200/40 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      <div class="max-w-5xl mx-auto space-y-6">
        
        <div class="bg-white rounded-[24px] p-4 border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex justify-between items-center animate-fade-in">
           <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                 <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
              </div>
              <div>
                 <h2 class="text-sm font-black text-slate-800">ឯកតាទំនិញ (Units)</h2>
                 <p class="text-xs font-bold text-slate-500">{{ units.length }} ឯកតាដែលមានស្រាប់</p>
              </div>
           </div>
           
           <button @click="showAddModal = true" class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-indigo-600/20 transition-all active:scale-95 flex items-center gap-2">
             <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
             បន្ថែមឯកតាថ្មី
           </button>
        </div>

        <div v-if="isLoading" class="py-20 text-center flex flex-col items-center">
            <div class="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-indigo-600 mb-4"></div>
            <p class="text-sm font-bold text-slate-400">កំពុងទាញយកទិន្នន័យ...</p>
        </div>

        <div v-else-if="units.length === 0" class="bg-white/60 backdrop-blur-md border-2 border-dashed border-slate-300 rounded-[2rem] p-16 text-center animate-fade-in">
           <div class="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
           </div>
           <h3 class="text-lg font-black text-slate-700 mb-1">មិនទាន់មានឯកតាទំនិញទេ</h3>
           <p class="text-sm font-medium text-slate-500 mb-6">សូមចុចប៊ូតុងខាងលើដើម្បីបន្ថែមឯកតាថ្មី ដូចជា ដប, កេស...</p>
           <button @click="showAddModal = true" class="bg-slate-800 hover:bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg transition-all active:scale-95">
             ចាប់ផ្តើមបង្កើត
           </button>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 animate-fade-in">
          <div 
             v-for="(unit, index) in units" 
             :key="unit.id" 
             class="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-[0_4px_15px_rgb(0,0,0,0.02)] hover:shadow-lg hover:border-indigo-300 transition-all group relative overflow-hidden animate-slide-up"
             :style="{ animationDelay: `${index * 50}ms` }"
          >
            <div class="absolute left-0 top-0 bottom-0 w-1.5" :class="getColorClass(unit.color).bgHex"></div>

            <div class="flex items-center gap-4 pl-2">
               <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border" :class="[getColorClass(unit.color).bgSoft, getColorClass(unit.color).textHex, getColorClass(unit.color).borderHex]">
                  <span class="font-black text-lg">{{ unit.label.charAt(0) }}</span>
               </div>
               <div>
                  <p class="font-black text-slate-800 text-base leading-tight">{{ unit.label }}</p>
                  <p class="text-[10px] text-slate-400 font-mono uppercase font-bold mt-0.5">Value: {{ unit.value }}</p>
               </div>
            </div>

            <button 
              @click="confirmDelete(unit.id, unit.label)" 
              class="w-8 h-8 rounded-xl bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              title="លុបឯកតា"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
          </div>
        </div>

      </div>
    </div>

    <div v-if="showAddModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div class="bg-white w-full max-w-md rounded-[2rem] p-8 shadow-2xl animate-slide-up relative">
        <button @click="showAddModal = false" class="absolute top-5 right-5 p-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <div class="mb-8 text-center">
            <div class="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            </div>
            <h3 class="text-2xl font-black text-slate-800">បន្ថែមឯកតាថ្មី</h3>
            <p class="text-xs font-bold text-slate-500 mt-1">បង្កើតប្រភេទឯកតាសម្រាប់ឱ្យ Admin បញ្ចូលការលក់</p>
        </div>
        
        <div class="space-y-6">
          <div>
            <label class="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">ឈ្មោះឯកតា (ឧ: ដប, កេស, កញ្ចប់)</label>
            <input 
               v-model="newUnit.label" 
               type="text" 
               placeholder="បញ្ចូលឈ្មោះឯកតា..." 
               class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-base font-bold text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-300 placeholder:font-normal"
               @keyup.enter="saveUnit"
               autofocus
            >
          </div>
          
          <div>
            <label class="block text-xs font-black text-slate-500 uppercase tracking-wider mb-3">ជ្រើសរើសពណ៌សម្រាប់បង្ហាញ</label>
            <div class="flex flex-wrap gap-3">
              <button 
                v-for="color in availableColors" 
                :key="color" 
                @click="newUnit.color = color" 
                class="w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center relative focus:outline-none focus:ring-2 focus:ring-offset-2" 
                :class="[
                    getColorClass(color).bgHex, 
                    newUnit.color === color ? 'border-slate-800 scale-110 shadow-md ring-slate-800' : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'
                ]"
              >
                 <svg v-if="newUnit.color === color" class="w-5 h-5 text-white drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
              </button>
            </div>
            
            <div class="mt-6 p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between">
                <span class="text-xs font-bold text-slate-500 uppercase">Preview:</span>
                <span class="inline-flex items-center px-3 py-1 rounded-md text-xs font-bold shadow-sm" :class="getAppBadgeClass(newUnit.color)">
                    {{ newUnit.label || 'ឈ្មោះឯកតា' }}
                </span>
            </div>
          </div>
        </div>

        <div class="flex gap-3 mt-8">
          <button @click="showAddModal = false" class="flex-1 py-3.5 bg-white border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all active:scale-95">បោះបង់</button>
          <button @click="saveUnit" :disabled="isSaving || !newUnit.label" class="flex-1 py-3.5 bg-indigo-600 border-2 border-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 hover:border-indigo-700 transition-all disabled:opacity-50 active:scale-95">
            {{ isSaving ? 'កំពុងរក្សាទុក...' : 'រក្សាទុក (Save)' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="deleteModal.show" class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div class="bg-white w-full max-w-sm rounded-[2rem] p-6 shadow-2xl animate-slide-up text-center">
         <div class="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-100">
             <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
         </div>
         <h3 class="text-xl font-black text-slate-800 mb-2">បញ្ជាក់ការលុប</h3>
         <p class="text-sm font-bold text-slate-500 mb-6 leading-relaxed">
            តើអ្នកពិតជាចង់លុបឯកតា <span class="text-rose-500">"{{ deleteModal.label }}"</span> មែនទេ?
         </p>
         
         <div class="flex gap-3">
          <button @click="deleteModal.show = false" class="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all active:scale-95">ទេ (No)</button>
          <button @click="executeDelete" :disabled="isDeleting" class="flex-1 py-3 bg-rose-500 text-white font-bold rounded-xl shadow-lg shadow-rose-500/30 hover:bg-rose-600 transition-all disabled:opacity-50 active:scale-95">
            {{ isDeleting ? 'កំពុងលុប...' : 'បាទ/ចាស លុប' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { db } from '@/firebaseConfig';
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
// Make sure this path exactly matches your project structure
import CustomAlert from '../../components/shared/CustomAlert.vue';

// State
const isLoading = ref(true);
const isSaving = ref(false);
const isDeleting = ref(false);
const showAddModal = ref(false);
const units = ref([]);

// Alert State (Properly initialized for CustomAlert)
const alert = reactive({ show: false, type: 'success', title: '', message: '' });
const triggerAlert = (type, title, message) => {
    alert.type = type;
    alert.title = title;
    alert.message = message;
    alert.show = true;
    setTimeout(() => alert.show = false, 3000);
};

// Delete Modal State
const deleteModal = reactive({ show: false, id: null, label: '' });

// Form State
const newUnit = ref({ label: '', color: 'cyan' });
const availableColors = ['cyan', 'blue', 'indigo', 'purple', 'emerald', 'amber', 'rose', 'slate'];

// Unified color mappings for Tailwind classes
const getColorClass = (color) => {
  const map = {
    cyan:    { bgHex: 'bg-cyan-400',    bgSoft: 'bg-cyan-50',    textHex: 'text-cyan-600',    borderHex: 'border-cyan-200' },
    blue:    { bgHex: 'bg-blue-500',    bgSoft: 'bg-blue-50',    textHex: 'text-blue-600',    borderHex: 'border-blue-200' },
    indigo:  { bgHex: 'bg-indigo-500',  bgSoft: 'bg-indigo-50',  textHex: 'text-indigo-600',  borderHex: 'border-indigo-200' },
    purple:  { bgHex: 'bg-purple-500',  bgSoft: 'bg-purple-50',  textHex: 'text-purple-600',  borderHex: 'border-purple-200' },
    emerald: { bgHex: 'bg-emerald-500', bgSoft: 'bg-emerald-50', textHex: 'text-emerald-600', borderHex: 'border-emerald-200' },
    amber:   { bgHex: 'bg-amber-500',   bgSoft: 'bg-amber-50',   textHex: 'text-amber-600',   borderHex: 'border-amber-200' },
    rose:    { bgHex: 'bg-rose-500',    bgSoft: 'bg-rose-50',    textHex: 'text-rose-600',    borderHex: 'border-rose-200' },
    slate:   { bgHex: 'bg-slate-500',   bgSoft: 'bg-slate-50',   textHex: 'text-slate-600',   borderHex: 'border-slate-200' }
  };
  return map[color] || map['slate'];
};

// Live Preview Badge Class generator
const getAppBadgeClass = (color) => {
    const c = getColorClass(color);
    return `${c.textHex} ${c.bgSoft} border ${c.borderHex}`;
};

// Data Fetching
const fetchUnits = async () => {
  try {
    const q = query(collection(db, 'settings_units'));
    const snap = await getDocs(q);
    units.value = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a,b) => a.label.localeCompare(b.label, 'km'));
  } catch (error) {
    console.error("Error fetching units", error);
    triggerAlert('error', 'បរាជ័យ', 'មិនអាចទាញយកទិន្នន័យបានទេ');
  } finally {
    isLoading.value = false;
  }
};

// Save Data
const saveUnit = async () => {
  if (!newUnit.value.label.trim()) {
      triggerAlert('warning', 'សូមបំពេញព័ត៌មាន', 'ឈ្មោះឯកតាមិនអាចទទេបានទេ');
      return;
  }
  
  isSaving.value = true;
  try {
    const unitName = newUnit.value.label.trim();
    
    // Check for duplicates locally
    const exists = units.value.find(u => u.value === unitName);
    if (exists) {
        triggerAlert('warning', 'មានរួចហើយ', 'ឈ្មោះឯកតានេះមានក្នុងបញ្ជីរួចហើយ');
        isSaving.value = false;
        return;
    }

    const unitData = {
      label: unitName,
      value: unitName, // Khmer text is the value
      color: newUnit.value.color,
      createdAt: new Date().toISOString()
    };
    
    const docRef = await addDoc(collection(db, 'settings_units'), unitData);
    units.value.push({ id: docRef.id, ...unitData });
    
    // Sort array again
    units.value.sort((a,b) => a.label.localeCompare(b.label, 'km'));
    
    showAddModal.value = false;
    newUnit.value = { label: '', color: 'cyan' };
    
    triggerAlert('success', 'ជោគជ័យ', 'ឯកតាត្រូវបានបន្ថែម');
  } catch (error) {
    triggerAlert('error', 'បរាជ័យ', 'មិនអាចរក្សាទុកបានទេ');
  } finally {
    isSaving.value = false;
  }
};

// Delete Logic
const confirmDelete = (id, label) => {
    deleteModal.id = id;
    deleteModal.label = label;
    deleteModal.show = true;
};

const executeDelete = async () => {
  isDeleting.value = true;
  try {
    await deleteDoc(doc(db, 'settings_units', deleteModal.id));
    units.value = units.value.filter(u => u.id !== deleteModal.id);
    deleteModal.show = false;
    triggerAlert('success', 'ជោគជ័យ', 'ឯកតាត្រូវបានលុបចេញ');
  } catch (error) {
    triggerAlert('error', 'បរាជ័យ', 'មិនអាចលុបទិន្នន័យបានទេ');
  } finally {
    isDeleting.value = false;
  }
};

onMounted(() => {
  fetchUnits();
});
</script>

<style scoped>
.font-khmer { font-family: 'Battambong', 'Kantumruy Pro', sans-serif; }

.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #94a3b8; }

.animate-slide-up { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes slideUp { 
    from { opacity: 0; transform: translateY(20px) scale(0.98); } 
    to { opacity: 1; transform: translateY(0) scale(1); } 
}

.animate-fade-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { 
    from { opacity: 0; } 
    to { opacity: 1; } 
}
</style>