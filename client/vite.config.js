import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa' // 🌟 1. Import PWA Plugin

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [
      vue(),
      vueDevTools(),
      
      // 🌟 2. បន្ថែម PWA Configuration សម្រាប់មុខងារ Smart Update
      VitePWA({
        registerType: 'prompt', // ប្រើ Prompt ដើម្បីអាចគ្រប់គ្រងពេលណាត្រូវ Refresh 
        devOptions: {
          enabled: true // អនុញ្ញាតឱ្យតេស្តមុខងារនេះបានពេល Run Local (npm run dev)
        },
        workbox: {
          cleanupOutdatedCaches: true, // លុប File ចាស់ៗ (Cache) ចោលពេលមាន Update ថ្មី
          globPatterns: ['**/*.{js,css,html,ico,png,svg,json,vue}']
        }
      })
    ],
    
    // ដូរមកជា '/' ធម្មតាវិញ ព្រោះអ្នកភ្ជាប់ Custom Domain រួចហើយ
    base: '/', 
    
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },

    server: {
      proxy: {
        '/api': {
          target: 'https://api.sellerorder.fyi',
          changeOrigin: true,
          secure: true,
        }
      }
    }
  }
})