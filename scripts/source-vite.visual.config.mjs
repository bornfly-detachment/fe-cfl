import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const harnessRoot = path.join(root, 'visual-harness/source')

export default {
  root: harnessRoot,
  cacheDir: path.join(root, '.visual-cache/source-vite'),
  plugins: [react({ fastRefresh: false })],
  css: {
    postcss: {
      plugins: [
        tailwindcss({ config: path.join(root, 'tailwind.config.js') }),
        autoprefixer(),
      ],
    },
  },
  resolve: {
    alias: {
      '@/components': path.join(root, 'src/components'),
      '@/kernel/compiler': path.join(root, 'src/kernel/compiler/index.ts'),
      '@/lib/http': path.join(root, 'src/lib/http.ts'),
      '@/lib/translations': path.join(root, 'src/lib/translations.ts'),
      '@/lib/utils': path.join(root, 'src/lib/utils.ts'),
      '@/stores/useAuthStore': path.join(root, 'src/stores/useAuthStore.ts'),
      '@/stores/useChronicleStore': path.join(root, 'src/stores/useChronicleStore.ts'),
      '@/stores/useThemeStore': path.join(root, 'src/stores/useThemeStore.ts'),
      '@': '/Users/Shared/egonetics/main/src',
      '@prvse': '/Users/Shared/egonetics/prvse_world_workspace/src',
    },
  },
  server: {
    host: '127.0.0.1',
    fs: {
      allow: [root, '/Users/Shared/egonetics/main', '/Users/Shared/egonetics/prvse_world_workspace'],
    },
    proxy: {
      '/api': {
        target: process.env.FE_CFL_API_TARGET || 'http://127.0.0.1:3052',
        changeOrigin: true,
      },
      '/ws': {
        target: process.env.FE_CFL_WS_TARGET || 'ws://127.0.0.1:3052',
        ws: true,
        changeOrigin: true,
      },
    },
  },
}
