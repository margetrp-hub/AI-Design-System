import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'
export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: fileURLToPath(new URL('./dist', import.meta.url)), emptyOutDir: true,
    lib: {entry:fileURLToPath(new URL('./src/index.ts', import.meta.url)), formats:['es'], fileName:'design-ui'},
    rollupOptions: {external:['vue','reka-ui']}
  }
})
