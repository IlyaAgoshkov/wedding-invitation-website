import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const buildVersion = new Date().toISOString().slice(0, 16).replace('T', ' ')

export default defineConfig({
  root: 'admin',
  plugins: [react()],
  define: {
    __APP_BUILD_VERSION__: JSON.stringify(buildVersion),
  },
  build: {
    outDir: '../dist-admin',
    emptyOutDir: true,
  },
  server: {
    host: '0.0.0.0',
    port: 5174,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
      },
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 5174,
    strictPort: true,
  },
})
