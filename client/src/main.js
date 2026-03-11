import { createApp } from 'vue'
import { createPinia } from 'pinia' // ១. នាំចូល createPinia
import App from './App.vue'
import router from './router'

// Import Tailwind CSS (Make sure this file exists in src/assets/)
import './assets/main.css' 

// 🌟 ១. Import Firebase Auth ដែលបងបាន Setup នៅក្នុងគម្រោង
import { auth } from './firebaseConfig' // បញ្ជាក់៖ ត្រូវប្រាកដថា Path នេះត្រូវនឹង File firebaseConfig របស់បង
import { onAuthStateChanged } from 'firebase/auth'

let app;

// 🌟 ២. ប្រើ onAuthStateChanged ដើម្បីរង់ចាំ Firebase ឆែក User ឱ្យចប់សិន
onAuthStateChanged(auth, (user) => {
  // បើកកម្មវិធី (Mount) តែម្ដងគត់នៅពេលដែល Firebase ត្រៀមរួចរាល់
  if (!app) {
    app = createApp(App)

    app.use(createPinia()) // ២. ប្រើប្រាស់ Pinia (ដាក់ពីលើ router ក៏បាន)
    app.use(router)

    app.mount('#app')
  }
})