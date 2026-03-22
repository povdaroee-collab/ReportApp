import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      vue(),
      vueDevTools(),

      VitePWA({
        // 🌟 ទី១៖ ប្តូរមកជា 'prompt' វិញ ដើម្បីឱ្យ Popup ក្នុង App.vue ដំណើរការ
        registerType: "prompt", 
        
        // 🌟 ទី២៖ បន្ថែមការកំណត់នេះ ដើម្បីឱ្យ Service Worker ដើរបានត្រឹមត្រូវ
        injectRegister: 'auto',
        workbox: {
          cleanupOutdatedCaches: true,
          globPatterns: ["**/*.{js,css,html,ico,png,svg,json,vue}"],
          maximumFileSizeToCacheInBytes: 5000000,
        },
        
        devOptions: {
          enabled: true,
        },
        manifest: {
          name: "ប្រព័ន្ធគ្រប់គ្រងការលក់",
          short_name: "SaleSystem",
          description: "ប្រព័ន្ធគ្រប់គ្រងការលក់ និងស្តុក",
          theme_color: "#4F46E5",
          background_color: "#F4F7FE",
          display: "standalone",
        },
      }),
    ],

    base: "/",

    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },

    server: {
      proxy: {
        "/api": {
          target: "https://api.sellerorder.fyi",
          changeOrigin: true,
          secure: true,
        },
      },
    },
  };
});