<template>
  <transition name="toast">
    <div v-if="visible" :class="['fixed top-5 right-5 px-4 py-3 rounded-lg shadow-lg text-white flex items-center gap-3 z-50 min-w-[300px]', typeClass]">
      <span class="text-xl">
        <i v-if="type === 'success'" class="fas fa-check-circle"></i>
        <i v-else-if="type === 'error'" class="fas fa-exclamation-circle"></i>
        <i v-else class="fas fa-info-circle"></i>
      </span>
      <div>
        <h4 class="font-bold text-sm">{{ title }}</h4>
        <p class="text-xs">{{ message }}</p>
      </div>
      <button @click="hide" class="ml-auto text-white/80 hover:text-white">
        <i class="fas fa-times"></i>
      </button>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      message: '',
      title: '',
      type: 'success', // success, error, info
      timer: null
    };
  },
  computed: {
    typeClass() {
      switch (this.type) {
        case 'success': return 'bg-green-500';
        case 'error': return 'bg-red-500';
        default: return 'bg-blue-500';
      }
    }
  },
  methods: {
    show(msg, title = 'Notification', type = 'success', duration = 3000) {
      this.message = msg;
      this.title = title;
      this.type = type;
      this.visible = true;
      
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.hide();
      }, duration);
    },
    hide() {
      this.visible = false;
    }
  }
};
</script>

<style scoped>
.toast-enter-active, .toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from, .toast-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>