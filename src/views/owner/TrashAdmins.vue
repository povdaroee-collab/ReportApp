<template>
  <div class="font-khmer h-full flex flex-col relative bg-[#F4F7FE]">
    
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

    <div class="px-4 md:px-8 pt-8 pb-6 max-w-7xl mx-auto w-full">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center shadow-lg shadow-rose-500/30 text-white shrink-0">
               <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </div>
            <div>
              <h1 class="text-2xl md:text-3xl font-black text-slate-800 tracking-tight leading-tight">ធុងសម្រាម (Trash)</h1>
              <p class="text-slate-500 text-[11px] md:text-xs font-bold uppercase tracking-wider mt-0.5">Deleted Admins Recovery</p>
            </div>
         </div>
         
         <div class="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 flex items-center gap-2 w-fit">
            <div class="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
            <span class="text-xs font-bold text-slate-600">គណនីបានលុប: <span class="text-rose-600">{{ trashedAdmins.length }}</span></span>
         </div>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto px-4 md:px-8 pb-20 custom-scrollbar">
       <div class="max-w-7xl mx-auto w-full">
          
          <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
             <div v-for="n in 4" :key="n" class="bg-white/50 h-64 rounded-[2rem] border border-slate-200 animate-pulse"></div>
          </div>

          <div v-else-if="trashedAdmins.length === 0" class="flex flex-col items-center justify-center py-32 bg-white/50 backdrop-blur-sm rounded-[2rem] border-2 border-dashed border-slate-300">
             <div class="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mb-5 shadow-inner">
                <svg class="w-12 h-12 text-rose-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/></svg>
             </div>
             <h3 class="text-xl font-black text-slate-700">ធុងសម្រាមទទេ</h3>
             <p class="text-slate-500 text-sm font-medium mt-1">មិនមានគណនី Admin ត្រូវបានលុបទេ (No deleted admins)</p>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
             <div 
               v-for="admin in trashedAdmins" 
               :key="admin.id"
               class="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-rose-100/50 relative overflow-hidden group transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
             >
                <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-rose-50 to-red-50 rounded-bl-[100px] -mr-8 -mt-8 opacity-50 pointer-events-none"></div>

                <div class="flex flex-col items-center text-center mt-2 relative z-10">
                   <div class="relative mb-4">
                      <div class="w-20 h-20 rounded-[1.25rem] p-1 bg-white shadow-md border border-slate-100 rotate-3 group-hover:rotate-0 transition-transform duration-300">
                         <img :src="admin.photoUrl || `https://ui-avatars.com/api/?name=${admin.fullName}&background=random`" class="w-full h-full object-cover rounded-xl grayscale opacity-70">
                      </div>
                      <div class="absolute -bottom-2 -right-2 bg-rose-100 text-rose-600 text-[10px] font-black px-2 py-0.5 rounded-md border border-rose-200 shadow-sm">
                         DELETED
                      </div>
                   </div>

                   <h3 class="font-bold text-lg text-slate-800 leading-tight">{{ admin.fullName }}</h3>
                   <p class="text-[11px] text-slate-400 font-mono mt-1 font-bold">@{{ admin.username }}</p>
                </div>

                <div class="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between gap-3 relative z-10">
                   
                   <button 
                     @click="confirmDelete(admin)" 
                     class="flex-1 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-white border border-rose-100 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                   >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      លុបចោល
                   </button>

                   <button 
                     @click="confirmRestore(admin)" 
                     class="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 transition-colors"
                   >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                      ស្តារឡើងវិញ
                   </button>
                   
                </div>
             </div>
          </div>

       </div>
    </div>

    <TransitionRoot appear :show="modals.restore" as="template">
      <Dialog as="div" @close="modals.restore = false" class="relative z-[100] font-khmer">
        <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95 translate-y-4" enter-to="opacity-100 scale-100 translate-y-0" leave="duration-200 ease-in" leave-from="opacity-100 scale-100 translate-y-0" leave-to="opacity-0 scale-95 translate-y-4">
              <DialogPanel class="w-full max-w-sm transform overflow-hidden rounded-[2rem] bg-white p-6 text-left align-middle shadow-2xl transition-all">
                <div class="flex flex-col items-center text-center mt-4">
                   <div class="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4 text-emerald-500 shadow-sm border border-emerald-100">
                      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                   </div>
                   <h3 class="text-xl font-bold leading-6 text-slate-800">ស្តារគណនី? (Restore)</h3>
                   <div class="mt-2 mb-6">
                     <p class="text-sm text-slate-500">តើអ្នកចង់អោយគណនី <b>{{ targetAdmin?.fullName }}</b> ដំណើរការឡើងវិញមែនទេ?</p>
                   </div>
                </div>

                <div class="grid grid-cols-2 gap-3 mt-4">
                  <button @click="modals.restore = false" class="w-full justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">បោះបង់</button>
                  <button @click="executeRestore" :disabled="isProcessing" class="w-full justify-center rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/30 transition-all active:scale-95 disabled:opacity-50">
                    <span v-if="!isProcessing">ស្តារឡើងវិញ</span>
                    <span v-else class="flex items-center justify-center gap-2"><svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> ដំណើរការ...</span>
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <TransitionRoot appear :show="modals.delete" as="template">
      <Dialog as="div" @close="modals.delete = false" class="relative z-[100] font-khmer">
        <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95 translate-y-4" enter-to="opacity-100 scale-100 translate-y-0" leave="duration-200 ease-in" leave-from="opacity-100 scale-100 translate-y-0" leave-to="opacity-0 scale-95 translate-y-4">
              <DialogPanel class="w-full max-w-sm transform overflow-hidden rounded-[2rem] bg-white p-6 text-left align-middle shadow-2xl transition-all border border-rose-100">
                <div class="flex flex-col items-center text-center mt-4">
                   <div class="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-4 text-rose-500 shadow-sm border border-rose-100">
                      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                   </div>
                   <h3 class="text-xl font-bold leading-6 text-slate-800">លុបជារៀងរហូត?</h3>
                   <div class="mt-2 mb-6 w-full">
                     <p class="text-sm text-rose-600 bg-rose-50 px-3 py-3 rounded-xl border border-rose-200 font-medium leading-relaxed">
                        ការព្រមាន: គណនី Admin នេះ រួមទាំង <b class="font-black text-rose-700">តំណាងលក់ទាំងអស់</b> និង <b class="font-black text-rose-700">របាយការណ៍លក់ទាំងអស់</b> ដែលគាត់បានបង្កើត នឹងត្រូវលុបចេញពីប្រព័ន្ធទាំងស្រុង។ អ្នកមិនអាចទាញយកវាមកវិញបានទេ!
                     </p>
                   </div>
                </div>

                <div class="grid grid-cols-2 gap-3 mt-4">
                  <button @click="modals.delete = false" class="w-full justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">បោះបង់</button>
                  <button @click="executePermanentDelete" :disabled="isProcessing" class="w-full justify-center rounded-xl bg-rose-600 px-4 py-3 text-sm font-bold text-white hover:bg-rose-700 shadow-lg shadow-rose-500/30 transition-all active:scale-95 disabled:opacity-50">
                    <span v-if="!isProcessing">លុបជារៀងរហូត</span>
                    <span v-else class="flex items-center justify-center gap-2"><svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> ដំណើរការ...</span>
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { db, auth } from '@/firebaseConfig';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';
import { TransitionRoot, TransitionChild, Dialog, DialogPanel } from '@headlessui/vue';
import CustomAlert from '../../components/shared/CustomAlert.vue';

// State
const isLoading = ref(true);
const isProcessing = ref(false);
const trashedAdmins = ref([]);
const targetAdmin = ref(null);

const modals = reactive({
  restore: false,
  delete: false
});

const alert = reactive({ show: false, title: '', message: '', type: 'success' });
const triggerAlert = (type, title, message) => {
  alert.type = type; alert.title = title; alert.message = message; alert.show = true;
  setTimeout(() => alert.show = false, 3000);
};

// Fetch Trashed Admins
onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // Query admins where isDeleted is true
      const q = query(
         collection(db, "users"), 
         where("role", "==", "admin"),
         where("isDeleted", "==", true)
      );
      
      onSnapshot(q, (snapshot) => {
        trashedAdmins.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        isLoading.value = false;
      }, (error) => {
        console.error("Error loading trash:", error);
        triggerAlert('error', 'បរាជ័យ', 'មិនអាចទាញយកទិន្នន័យបានទេ');
        isLoading.value = false;
      });
    }
  });
});

// RESTORE LOGIC
const confirmRestore = (admin) => {
   targetAdmin.value = admin;
   modals.restore = true;
};

const executeRestore = async () => {
   if (!targetAdmin.value) return;
   isProcessing.value = true;
   try {
      // Set isDeleted to false so it shows up in main admin list again
      await updateDoc(doc(db, "users", targetAdmin.value.id), {
         isDeleted: false
      });
      triggerAlert('success', 'ជោគជ័យ', 'គណនីត្រូវបានស្តារឡើងវិញដោយជោគជ័យ');
   } catch (error) {
      console.error(error);
      triggerAlert('error', 'បរាជ័យ', 'មានបញ្ហាក្នុងការស្តារគណនី');
   } finally {
      isProcessing.value = false;
      modals.restore = false;
   }
};

// PERMANENT DELETE LOGIC
const confirmDelete = (admin) => {
   targetAdmin.value = admin;
   modals.delete = true;
};

const executePermanentDelete = async () => {
   if (!targetAdmin.value) return;
   isProcessing.value = true;
   try {
      const token = await auth.currentUser.getIdToken(true);
      // Calls the newly updated backend API
      await axios.delete(`https://reportapp-81vf.onrender.com/api/delete-admin/${targetAdmin.value.id}`, {
         headers: { 'Authorization': `Bearer ${token}` }
      });
      triggerAlert('success', 'ជោគជ័យ', 'គណនី និងទិន្នន័យពាក់ព័ន្ធទាំងអស់ត្រូវបានលុបជារៀងរហូត');
   } catch (error) {
      console.error(error);
      triggerAlert('error', 'បរាជ័យ', 'មិនអាចលុបគណនីនេះបានទេ');
   } finally {
      isProcessing.value = false;
      modals.delete = false;
   }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Battambong:wght@400;700;900&family=Kantumruy+Pro:wght@400;700&display=swap');
.font-khmer { font-family: 'Kantumruy Pro', 'Battambong', sans-serif; }

.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #94A3B8; }
</style>