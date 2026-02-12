import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Import Tailwind CSS (Make sure this file exists in src/assets/)
import './assets/main.css' 

const app = createApp(App)

app.use(router)

app.mount('#app')