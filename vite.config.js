import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  base: './',
  root: '.',
  appType: 'mpa',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        settings: resolve(__dirname, 'index.html'),
        dangle: resolve(__dirname, 'dangle.html')
      }
    }
  },
  server: {
    port: 5173,
    strictPort: true
  }
});