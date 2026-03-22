import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  return {
    // កំណត់ Base URL ឱ្យត្រូវ។ បើអ្នកប្រើ Custom Domain (sellerorder.fyi) ទុក '/' គឺត្រឹមត្រូវហើយ។
    // តែបើមិនប្រើ Custom Domain ទេ ត្រូវដាក់ '/ReportApp/'
    base: "/", 

    plugins: [
      vue(),
      vueDevTools(),

      VitePWA({
        registerType: "prompt",
        injectRegister: 'auto',
        
        workbox: {
          cleanupOutdatedCaches: true,
          globPatterns: ["**/*.{js,css,html,ico,png,svg,json,vue,txt,woff2}"], // បន្ថែម woff2 បើមានប្រើ Font
          maximumFileSizeToCacheInBytes: 5000000,
          // 🌟 ត្រូវប្រាកដថា Service Worker មិនរង់ចាំ (Skip Waiting) ទើបវាអាច Activate Update ថ្មីបាន 🌟
          skipWaiting: true,
          clientsClaim: true,
        },
        
        devOptions: {
          enabled: true,
          type: 'module',
        },
        
        manifest: {
          name: "ប្រព័ន្ធគ្រប់គ្រងការលក់",
          short_name: "SaleSystem",
          description: "ប្រព័ន្ធគ្រប់គ្រងការលក់ និងស្តុក",
          theme_color: "#4F46E5",
          background_color: "#F4F7FE",
          display: "standalone",
          start_url: "/", // 🌟 កំណត់ Start URL ឱ្យច្បាស់លាស់
        },
      }),
    ],

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