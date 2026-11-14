import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath } from "node:url";

export default defineConfig({
  root: "apps/catalog",
  base: process.env.BASE_PATH || "/",
  cacheDir: fileURLToPath(
    new URL("./node_modules/.vite/catalog", import.meta.url),
  ),
  plugins: [vue()],
  resolve: {
    alias: {
      "@ai-design-system/ui": fileURLToPath(
        new URL("./packages/ui/src/index.ts", import.meta.url),
      ),
    },
  },
  build: { outDir: "../../dist/catalog", emptyOutDir: true },
  server: { host: "127.0.0.1", port: 4318, strictPort: true },
  preview: { host: "127.0.0.1", port: 4318, strictPort: true },
});
