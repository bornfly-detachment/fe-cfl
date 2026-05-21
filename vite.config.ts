import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

const cacheKey = (process.env.FE_CFL_API_TARGET || 'default').replace(/[^a-z0-9.-]/gi, '-')

export default defineConfig({
  cacheDir: path.resolve(__dirname, '.visual-cache/target-vite', cacheKey),
  plugins: [react()],
  resolve: {
    alias: {
      '@egonetics/core/contract': path.resolve(__dirname, 'src/lib/egonetics-core-contract.ts'),
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
      '/seai': {
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
