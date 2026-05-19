import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    host: true,
    port: Number(process.env.FE_CFL_PORT ?? 3040),
    strictPort: false,
    proxy: {
      '/api': {
        target: process.env.FE_CFL_API_TARGET || 'http://localhost:3052',
        changeOrigin: true,
      },
      '/ws': {
        target: process.env.FE_CFL_WS_TARGET || 'ws://localhost:3052',
        ws: true,
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
