<template>
  <div class="relative min-h-[100dvh] bg-[#F4F7FE] font-khmer flex flex-col pb-10 md:pb-0 overflow-hidden">
    
    <Toast />

    <!-- 🌟 Main Dashboard Container 🌟 -->
    <div class="flex w-full h-[100dvh] overflow-hidden animate-fade-in relative">
      
      <!-- Mobile Sidebar Overlay -->
      <transition
        enter-active-class="duration-300 ease-out"
        leave-active-class="duration-200 ease-in"
      >
        <div
          v-if="isSidebarOpen"
          @click="isSidebarOpen = false"
          class="fixed inset-0 bg-slate-900/60 z-40 md:hidden backdrop-blur-sm"
        ></div>
      </transition>

      <!-- 🌟 SIDEBAR NAVIGATION 🌟 -->
      <aside
        :class="
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        "
        class="fixed md:static inset-y-0 left-0 z-50 w-[280px] bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none"
      >
        <div class="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 bg-indigo-50 text-indigo-600 rounded-[14px] flex items-center justify-center border border-indigo-100 shadow-inner">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
              </svg>
            </div>
            <div @click="activeTab = null" class="cursor-pointer">
              <h2 class="font-black text-slate-800 text-lg leading-tight">
                គណនី & ហិរញ្ញវត្ថុ
              </h2>
              <p class="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                Management
              </p>
            </div>
          </div>
          <button
            @click="isSidebarOpen = false"
            class="md:hidden w-8 h-8 flex items-center justify-center bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav class="flex-1 p-4 space-y-2 overflow-visible">
          <!-- 1. ទិន្នន័យស្តុក (Dropdown Menu) -->
          <div
            class="relative rounded-2xl transition-all duration-300"
            @mouseenter="hoverTab = 'income'"
            @mouseleave="hoverTab = null"
            :class="
              activeTab === 'income'
                ? 'bg-indigo-50/50 border border-indigo-100/50'
                : 'hover:bg-slate-50'
            "
          >
            <button
              class="w-full flex items-center justify-between p-3.5 rounded-2xl transition-all relative z-10"
              :class="
                activeTab === 'income' ? 'text-indigo-700' : 'text-slate-600'
              "
            >
              <div class="flex items-center gap-3 font-black text-[13px]">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
                ទិន្នន័យស្តុក
              </div>
              <svg
                class="w-4 h-4 transition-transform duration-300"
                :class="
                  hoverTab === 'income'
                    ? 'translate-x-1 text-indigo-500'
                    : 'text-slate-400'
                "
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <!-- Dropdown Items -->
            <div
              v-show="hoverTab === 'income'"
              class="absolute z-[100] top-full left-0 w-full pt-1 md:top-0 md:left-[100%] md:w-60 md:pt-0 md:pl-2"
            >
              <div class="bg-white border border-slate-200 shadow-xl md:shadow-2xl rounded-2xl p-2 space-y-1 relative animate-fade-in">
                <div class="hidden md:block absolute top-5 -left-1.5 w-3 h-3 bg-white border-l border-b border-slate-200 rotate-45"></div>

                <button
                  @click.stop="setActiveSubTab('sold')"
                  class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[12px] font-bold transition-all relative z-10"
                  :class="
                    activeSubTab === 'sold' && activeTab === 'income'
                      ? 'bg-indigo-50 text-indigo-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  "
                >
                  <div
                    class="w-1.5 h-1.5 rounded-full transition-colors"
                    :class="
                      activeSubTab === 'sold' && activeTab === 'income'
                        ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]'
                        : 'bg-slate-300'
                    "
                  ></div>
                  ស្តុកបានលក់ចេញ
                </button>
                <button
                  @click.stop="setActiveSubTab('current')"
                  class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[12px] font-bold transition-all relative z-10"
                  :class="
                    activeSubTab === 'current' && activeTab === 'income'
                      ? 'bg-emerald-50 text-emerald-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  "
                >
                  <div
                    class="w-1.5 h-1.5 rounded-full transition-colors"
                    :class="
                      activeSubTab === 'current' && activeTab === 'income'
                        ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]'
                        : 'bg-slate-300'
                    "
                  ></div>
                  ស្តុកបច្ចុប្បន្នជាក់ស្តែង
                </button>
                <button
                  @click.stop="setActiveSubTab('import')"
                  class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[12px] font-bold transition-all relative z-10"
                  :class="
                    activeSubTab === 'import' && activeTab === 'income'
                      ? 'bg-sky-50 text-sky-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  "
                >
                  <div
                    class="w-1.5 h-1.5 rounded-full transition-colors"
                    :class="
                      activeSubTab === 'import' && activeTab === 'income'
                        ? 'bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.6)]'
                        : 'bg-slate-300'
                    "
                  ></div>
                  ស្តុកថ្មី & នាំចូល
                </button>
                <button
                  @click.stop="setActiveSubTab('supplier')"
                  class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[12px] font-bold transition-all relative z-10"
                  :class="
                    activeSubTab === 'supplier' && activeTab === 'income'
                      ? 'bg-purple-50 text-purple-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  "
                >
                  <div
                    class="w-1.5 h-1.5 rounded-full transition-colors"
                    :class="
                      activeSubTab === 'supplier' && activeTab === 'income'
                        ? 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]'
                        : 'bg-slate-300'
                    "
                  ></div>
                  អ្នកផ្គត់ផ្គង់ (ស្នើទិញ)
                </button>
              </div>
            </div>
          </div>

          <div class="h-px bg-slate-100 mx-4 my-2"></div>

          <!-- 2. វិភាគទិន្នន័យ -->
          <button
            @click="setActiveTab('analysis')"
            class="w-full flex items-center gap-3 p-3.5 rounded-2xl font-black text-[13px] transition-all"
            :class="
              activeTab === 'analysis'
                ? 'bg-indigo-50/80 text-indigo-700 border border-indigo-100/50'
                : 'text-slate-600 hover:bg-slate-50'
            "
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            វិភាគទិន្នន័យ
          </button>

          <!-- 3. ចែកភាគរយតំណាងលក់ -->
          <button
            @click="setActiveTab('payroll')"
            class="w-full flex items-center gap-3 p-3.5 rounded-2xl font-black text-[13px] transition-all"
            :class="
              activeTab === 'payroll'
                ? 'bg-rose-50/80 text-rose-700 border border-rose-100/50'
                : 'text-slate-600 hover:bg-slate-50'
            "
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            ចែកភាគរយតំណាងលក់
          </button>

          <!-- 4. កាត់ស្តុក-PD -->
          <button
            @click="setActiveTab('stock_pd')"
            class="w-full flex items-center gap-3 p-3.5 rounded-2xl font-black text-[13px] transition-all"
            :class="
              activeTab === 'stock_pd'
                ? 'bg-amber-50/80 text-amber-700 border border-amber-100/50'
                : 'text-slate-600 hover:bg-slate-50'
            "
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            កាត់ស្តុក-PD
          </button>

          <!-- 5. គណនីរបស់ខ្ញុំ -->
          <button
            @click="setActiveTab('my-account')"
            class="w-full flex items-center gap-3 p-3.5 rounded-2xl font-black text-[13px] transition-all mt-auto"
            :class="
              activeTab === 'my-account'
                ? 'bg-slate-100 text-slate-800 border border-slate-200'
                : 'text-slate-600 hover:bg-slate-50'
            "
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            គណនីរបស់ខ្ញុំ
          </button>
        </nav>
      </aside>

      <!-- 🌟 MAIN CONTENT AREA 🌟 -->
      <main class="flex-1 flex flex-col min-w-0 h-[100dvh] overflow-hidden relative z-10">
        <!-- Mobile Header -->
        <header class="md:hidden bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between shrink-0 shadow-sm z-20">
          <div class="flex items-center gap-3">
            <button
              @click="isSidebarOpen = true"
              class="w-10 h-10 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center border border-slate-200 active:scale-95 transition-transform"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </button>
            <h1 class="font-black text-slate-800 text-base">
              {{ getTabTitle(activeTab) }}
            </h1>
          </div>
        </header>

        <!-- Dynamic Content (Tabs) -->
        <div class="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar bg-[#F4F7FE] relative">
          
          <!-- Welcome Screen (Default) -->
          <div
            v-if="activeTab === null"
            class="absolute inset-0 flex flex-col items-center justify-center p-6 text-center animate-fade-in-up"
          >
            <div class="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center border border-slate-100 mb-6">
              <div class="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center border border-indigo-100">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
            </div>
            <h2 class="text-3xl font-black text-slate-800 mb-2">
              សូមស្វាគមន៍មកកាន់ប្រព័ន្ធ
            </h2>
            <p class="text-slate-500 font-bold mb-8 max-w-md mx-auto">
              សូមជ្រើសរើសមឺនុយណាមួយពីរបារខាងឆ្វេង ដើម្បីចាប់ផ្តើមមើលរបាយការណ៍ និងគ្រប់គ្រងទិន្នន័យហិរញ្ញវត្ថុ។
            </p>

            <button
              @click="isSidebarOpen = true"
              class="md:hidden bg-indigo-600 text-white px-6 py-3 rounded-xl font-black shadow-lg shadow-indigo-600/20 active:scale-95 transition-all"
            >
              បើកមឺនុយឥឡូវនេះ
            </button>
          </div>

          <!-- Component Tabs -->
          <div v-else class="max-w-[90rem] mx-auto w-full h-full animate-fade-in-up">
            <IncomeTab
              v-if="activeTab === 'income'"
              :activeSubTab="activeSubTab"
            />
            <AnalysisTab v-else-if="activeTab === 'analysis'" />
            <PayrollTab v-else-if="activeTab === 'payroll'" />
            <StockPdTab v-else-if="activeTab === 'stock_pd'" />
            <MyAccountTab v-else-if="activeTab === 'my-account'" />
          </div>
        </div>
      </main>
    </div>

  </div>
</template>

<script setup>
import { ref } from "vue";
import { useNotificationStore } from "@/stores/notification";
import Toast from "@/components/Toast.vue";

// Tabs Components
import IncomeTab from "./tabs/IncomeTab.vue";
import AnalysisTab from "./tabs/AnalysisTab.vue";
import PayrollTab from "./tabs/PayrollTab.vue";
import StockPdTab from "./tabs/StockPdTab.vue";
import MyAccountTab from "./tabs/MyAccountTab.vue";

const notification = useNotificationStore();

// 🌟 Navigation Layout States 🌟
const isSidebarOpen = ref(false);
const activeTab = ref(null); // Welcome Screen is default
const activeSubTab = ref("sold");
const hoverTab = ref(null); 

const setActiveTab = (tabId, defaultSubTab = null) => {
  activeTab.value = tabId;
  if (defaultSubTab) activeSubTab.value = defaultSubTab;
  hoverTab.value = null; 
  if (window.innerWidth < 768) isSidebarOpen.value = false;
};

const setActiveSubTab = (subTabId) => {
  activeTab.value = "income";
  activeSubTab.value = subTabId;
  hoverTab.value = null; 
  if (window.innerWidth < 768) isSidebarOpen.value = false;
};

const getTabTitle = (tabId) => {
  const titles = {
    income: "ទិន្នន័យស្តុក",
    analysis: "វិភាគទិន្នន័យ",
    payroll: "ចែកភាគរយតំណាងលក់",
    stock_pd: "កាត់ស្តុក-PD",
    "my-account": "គណនីរបស់ខ្ញុំ",
  };
  return titles[tabId] || "គណនី & ហិរញ្ញវត្ថុ";
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Battambong:wght@400;700;900&family=Kantumruy+Pro:wght@400;700;900&display=swap");
.font-khmer {
  font-family: "Kantumruy Pro", "Battambong", sans-serif;
}
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background: #94a3b8;
}
.animate-fade-in-up {
  animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>