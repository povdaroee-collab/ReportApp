import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [
      vue(),
      vueDevTools(),
    ],
    // នេះគឺជាកន្លែងវេទមន្ត! 🌟
    // Netlify តែងតែមាន variable ឈ្មោះ NETLIFY=true ពេលកំពុង Build
    // ដូច្នេះបើ Deploy លើ Netlify វាប្រើ '/' រីឯ GitHub Pages ប្រើ '/ReportApp/'
    base: process.env.NETLIFY ? '/' : '/ReportApp/',
    
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
  }
})