import { createApp } from 'vue'
import { createPinia } from 'pinia' // ១. នាំចូល createPinia
import App from './App.vue'
import router from './router'

// Import Tailwind CSS (Make sure this file exists in src/assets/)
import './assets/main.css' 

const app = createApp(App)

app.use(createPinia()) // ២. ប្រើប្រាស់ Pinia (ដាក់ពីលើ router ក៏បាន)
app.use(router)

app.mount('#app')