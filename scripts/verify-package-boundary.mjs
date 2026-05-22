import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

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

const failures = []
const packageJson = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'))
const dependencies = packageJson.dependencies ?? {}

for (const packageName of cflPackages) {
  const spec = dependencies[packageName]
  if (!spec) {
    failures.push(`missing dependency: ${packageName}`)
    continue
  }
  if (!spec.startsWith('git+https://github.com/bornfly-detachment/')) {
    failures.push(`dependency must point at GitHub CFL repo: ${packageName} -> ${spec}`)
  }
  if (!/#[0-9a-f]{40}$/i.test(spec)) {
    failures.push(`dependency must pin an immutable commit: ${packageName} -> ${spec}`)
  }
}

for (const forbidden of [
  'src/cfl',
  'src/components',
  'src/design',
  'src/hooks',
  'src/kernel',
  'src/lib',
  'src/pages',
  'src/stores',
  'src/types',
  'server',
]) {
  if (existsSync(path.join(root, forbidden))) {
    failures.push(`copied implementation directory must not exist: ${forbidden}`)
  }
}

const app = readFileSync(path.join(root, 'src/App.tsx'), 'utf8')
if (app.includes("from './cfl") || app.includes('from "./cfl')) {
  failures.push('src/App.tsx still imports local CFL source')
}

for (const [scriptName, command] of Object.entries(packageJson.scripts ?? {})) {
  if (command.includes('verify-migration')) {
    failures.push(`script still uses copy-era verifier: ${scriptName}`)
  }
}

if (failures.length) {
  console.error('fe-cfl package boundary verification failed:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log(`fe-cfl package boundary verified: ${cflPackages.length} GitHub CFL dependencies, zero copied implementation directories`)
