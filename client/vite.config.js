import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  return {
    base: "/",
    plugins: [
      vue(),
      vueDevTools(),

      VitePWA({
        // 🌟 ១. ប្តូរមក autoUpdate វិញ
        registerType: "autoUpdate", 
        injectRegister: "auto",
        workbox: {
          cleanupOutdatedCaches: true,
          globPatterns: ["**/*.{js,css,html,ico,png,svg,json,vue,woff2}"],
          maximumFileSizeToCacheInBytes: 5000000,
          // 🌟 ត្រូវដាក់ ២ ជួរនេះ ដើម្បីបង្ខំឱ្យវាលុបកូដចាស់ និងបញ្ចេញកូដថ្មីភ្លាមៗ 🌟
          skipWaiting: true,
          clientsClaim: true,
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