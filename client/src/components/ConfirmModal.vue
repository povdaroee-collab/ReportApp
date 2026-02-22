<template>
  <transition name="modal">
    <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 transform transition-all scale-100">
        <div class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <i class="fas fa-exclamation-triangle text-red-600 text-xl"></i>
          </div>
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-2">{{ title }}</h3>
          <p class="text-sm text-gray-500 mb-6">
            {{ message }}
          </p>
        </div>
        <div class="flex gap-3 justify-center">
          <button 
            @click="cancel" 
            class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-lg transition-colors"
          >
            បោះបង់ (Cancel)
          </button>
          <button 
            @click="confirm" 
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg shadow-md transition-colors"
          >
            លុប (Delete)
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      title: '',
      message: '',
      resolve: null,
      reject: null
    };
  },
  methods: {
    open(title, message) {
      this.title = title;
      this.message = message;
      this.visible = true;
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    confirm() {
      this.visible = false;
      if (this.resolve) this.resolve(true);
    },
    cancel() {
      this.visible = false;
      if (this.resolve) this.resolve(false);
    }
  }
};
</script>

<style scoped>
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
}
</style>