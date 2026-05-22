import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { existsSync, statSync } from 'node:fs'
import path from 'node:path'

const cacheKey = (process.env.FE_CFL_API_TARGET || 'default').replace(/[^a-z0-9.-]/gi, '-')

function cflPackageSourceAlias(): Plugin {
  const resolveSourceFile = (basePath: string) => {
    for (const candidate of [
      basePath,
      `${basePath}.ts`,
      `${basePath}.tsx`,
      `${basePath}.js`,
      `${basePath}.jsx`,
      path.join(basePath, 'index.ts'),
      path.join(basePath, 'index.tsx'),
    ]) {
      if (existsSync(candidate) && statSync(candidate).isFile()) return candidate
    }
    return basePath
  }

  return {
    name: 'cfl-package-source-alias',
    enforce: 'pre',
    resolveId(source, importer) {
      if (!importer) return null
      if (source !== '@egonetics/core/contract' && !source.startsWith('@/')) return null

      const normalized = importer.split(path.sep).join('/')
      const marker = '/node_modules/@bornfly-detachment/'
      const markerIndex = normalized.indexOf(marker)
      if (markerIndex === -1) return null

      const packageName = normalized.slice(markerIndex + marker.length).split('/')[0]
      if (!packageName.startsWith('fe-') || !packageName.endsWith('-cfl')) return null

      const packageRoot = normalized.slice(0, markerIndex + marker.length + packageName.length)
      if (source === '@egonetics/core/contract') {
        return resolveSourceFile(path.join(packageRoot, 'src/lib/egonetics-core-contract'))
      }
      return resolveSourceFile(path.join(packageRoot, 'src', source.slice(2)))
    },
  }
}

const cflPackages = [
  '@bornfly-detachment/fe-canvas-relation-cfl',
  '@bornfly-detachment/fe-cli-bridge-cfl',
  '@bornfly-detachment/fe-control-plane-cfl',
  '@bornfly-detachment/fe-login-cfl',
  '@bornfly-detachment/fe-memory-chronicle-cfl',
  '@bornfly-detachment/fe-obsidian-cfl',
  '@bornfly-detachment/fe-protocol-builder-cfl',
  '@bornfly-detachment/fe-prvse-world-cfl',
  '@bornfly-detachment/fe-resource-intelligence-cfl',
  '@bornfly-detachment/fe-rich-editor-cfl',
  '@bornfly-detachment/fe-task-lifecycle-cfl',
]

export default defineConfig({
  cacheDir: path.resolve(__dirname, '.visual-cache/target-vite', cacheKey),
  plugins: [cflPackageSourceAlias(), react()],
  optimizeDeps: {
    exclude: cflPackages,
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
