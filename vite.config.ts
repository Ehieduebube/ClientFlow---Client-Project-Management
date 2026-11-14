import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  build: {
    // Vite 8 defaults to Safari/iOS 16.4+. Target 16.0 so older iPhones
    // (e.g. iOS 16.1) still get JS/CSS they can run.
    target: ['chrome107', 'edge107', 'firefox104', 'safari16', 'ios16'],
  },
})
