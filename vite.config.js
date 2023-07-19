import { defineConfig, splitVendorChunkPlugin } from "vite";
import preact from "@preact/preset-vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    splitVendorChunkPlugin(),
    preact(),
    // VitePWA({
    //   registerType: "autoUpdate",
    //   devOptions: {
    //     enabled: true,
    //   },
    //   workbox: {
    //     sourcemap: true,
    //     globPatterns: ["**/*.{js,css,html,ico,png,svg,webp}"],
    //   },
    // }),
  ],
});
