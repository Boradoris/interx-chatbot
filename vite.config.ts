import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import viteCompression from "vite-plugin-compression";
import { imageToWebpPlugin } from "vite-plugin-image-to-webp";

export default defineConfig({
  base: "/",
  plugins: [
    react(),
    imageToWebpPlugin({
      imageFormats: ["jpg", "jpeg", "png"],
      webpQuality: { quality: 80 },
      destinationFolder: "dist",
    }),

    viteCompression({
      algorithm: "gzip",
      ext: ".gz",
    }),
  ],
  server: {
    open: true,
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
