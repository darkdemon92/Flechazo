import { defineConfig, splitVendorChunkPlugin } from "vite";
import million from 'million/compiler';
import preact from "@preact/preset-vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [splitVendorChunkPlugin(), million.vite({ auto: true }), preact()],
});
