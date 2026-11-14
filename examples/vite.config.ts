import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath } from "node:url";
export default defineConfig({
  root: fileURLToPath(new URL("./", import.meta.url)),
  cacheDir: fileURLToPath(
    new URL("../node_modules/.vite/examples", import.meta.url),
  ),
  plugins: [vue()],
  oxc: { jsx: { runtime: "automatic" } },
  server: { host: "127.0.0.1", port: 4319, strictPort: true },
  build: {
    outDir: "../dist/examples",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        vue: fileURLToPath(new URL("./vue/index.html", import.meta.url)),
        react: fileURLToPath(new URL("./react/index.html", import.meta.url)),
      },
    },
  },
});
