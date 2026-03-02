<template>
    <div class="bg-white rounded-[24px] shadow-sm border border-slate-200 p-8 flex flex-col items-center justify-center text-center animate-fade-in min-h-[60vh] font-khmer">
        <div class="w-24 h-24 bg-rose-50 rounded-[24px] flex items-center justify-center text-rose-500 mb-6 shadow-sm border border-rose-100 transform -rotate-6 transition-transform hover:rotate-0 duration-300">
            <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
        </div>
        
        <h2 class="text-2xl font-black text-slate-800 mb-3">គណនាហិរញ្ញវត្ថុ & ប្រាក់លើកទឹកចិត្ត</h2>
        <p class="text-slate-500 max-w-lg mb-8 leading-relaxed font-bold text-sm">
            ទីតាំងនេះត្រូវបានត្រៀមទុកសម្រាប់រៀបចំ និងបញ្ចូលទិន្នន័យដោយដៃ ដើម្បីគណនាលក្ខខណ្ឌផ្តល់ប្រាក់លើកទឹកចិត្ត (Incentive/Bonus) ជូនដល់ Admin និង តំណាងលក់។
        </p>
        
        <div class="inline-flex items-center gap-3 px-5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 font-bold text-sm shadow-inner">
            <span class="relative flex h-3 w-3">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-3 w-3 bg-slate-500"></span>
            </span>
            មុខងារនេះនឹងរួចរាល់នៅពេលក្រោយ... (Coming Soon)
        </div>
    </div>
</template>

<script setup>
// កន្លែងនេះនឹងត្រូវសរសេរ Logic គណនាប្រាក់លើកទឹកចិត្តនៅពេលក្រោយ
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Battambong:wght@400;700;900&display=swap');
.font-khmer { font-family: 'Battambong', sans-serif; }
.animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>