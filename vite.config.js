import { defineConfig } from 'vite';
import { resolve } from 'node:path';
export default defineConfig({
  base: './',
  build: {
    target: 'es2020',
    sourcemap: true,
    rollupOptions: { output: { manualChunks: { three: ['three'], motion: ['gsap', 'lenis', '@unseenco/taxi'] } }, input: { main: resolve(import.meta.dirname, 'index.html'), archive: resolve(import.meta.dirname, 'archive.html') } }
  },
  server: { port: 8766, strictPort: true },
  preview: { port: 8766, strictPort: true }
});
