import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const sourceRepo = process.env.FE_CFL_SOURCE_REPO || '/Users/Shared/egonetics-opencode'
const sourceRef = process.env.FE_CFL_SOURCE_REF || 'd33562779ec6596aeadbc1bedb4efa28f0c114f2'

const mandatory = [
  ['src/components/prvse-world/PrvseWorldView.tsx', 'src/cfl/prvse-world/PrvseWorldView.tsx'],
  ['src/components/prvse-world/types.ts', 'src/cfl/prvse-world/types.ts'],
  ['src/components/prvse-world/constants.ts', 'src/cfl/prvse-world/constants.ts'],
  ['src/components/prvse-world/sphere-pages.ts', 'src/cfl/prvse-world/sphere-pages.ts'],
  ['src/components/prvse-world/useControlTree.ts', 'src/cfl/prvse-world/useControlTree.ts'],
  ['src/components/prvse-world/panels/ResourcePanel.tsx', 'src/cfl/prvse-world/panels/ResourcePanel.tsx'],
  ['src/components/prvse-world/panels/TierManagePanel.tsx', 'src/cfl/prvse-world/panels/TierManagePanel.tsx'],
  ['src/components/prvse-world/panels/EmbeddedTerminal.tsx', 'src/cfl/prvse-world/panels/EmbeddedTerminal.tsx'],
  ['src/components/prvse-world/panels/CompilerPanel.tsx', 'src/cfl/prvse-world/panels/CompilerPanel.tsx'],
  ['src/components/prvse-world/overlay/FocusPanel.tsx', 'src/cfl/prvse-world/overlay/FocusPanel.tsx'],
  ['src/components/prvse-world/overlay/HumanQueuePanel.tsx', 'src/cfl/prvse-world/overlay/HumanQueuePanel.tsx'],
  ['src/components/prvse-world/overlay/KernelOverlay.tsx', 'src/cfl/prvse-world/overlay/KernelOverlay.tsx'],
  ['src/components/prvse-world/overlay/L1Panel.tsx', 'src/cfl/prvse-world/overlay/L1Panel.tsx'],
  ['src/components/prvse-world/overlay/L3AIInput.tsx', 'src/cfl/prvse-world/overlay/L3AIInput.tsx'],
  ['src/components/prvse-world/overlay/Minimap.tsx', 'src/cfl/prvse-world/overlay/Minimap.tsx'],
  ['src/components/prvse-world/overlay/NodeInteractionPanel.tsx', 'src/cfl/prvse-world/overlay/NodeInteractionPanel.tsx'],
  ['src/components/prvse-world/overlay/PMessageCard.tsx', 'src/cfl/prvse-world/overlay/PMessageCard.tsx'],
  ['src/components/prvse-world/overlay/WorldSpherePanel.tsx', 'src/cfl/prvse-world/overlay/WorldSpherePanel.tsx'],
  ['src/components/prvse-world/engine/entities.ts', 'src/cfl/prvse-world/engine/entities.ts'],
  ['src/components/prvse-world/engine/interaction.ts', 'src/cfl/prvse-world/engine/interaction.ts'],
  ['src/components/prvse-world/engine/layout-solver.ts', 'src/cfl/prvse-world/engine/layout-solver.ts'],
  ['src/components/prvse-world/engine/scene.ts', 'src/cfl/prvse-world/engine/scene.ts'],
  ['src/components/prvse-world/engine/three-body.ts', 'src/cfl/prvse-world/engine/three-body.ts'],
  ['src/components/prvse-world/engine/zoom-engine.ts', 'src/cfl/prvse-world/engine/zoom-engine.ts'],
  ['src/components/BlogPage.tsx', 'src/cfl/rich-editor/BlogPage.tsx'],
  ['src/components/TheoryPageView.tsx', 'src/cfl/rich-editor/TheoryPageView.tsx'],
  ['src/components/PageManager.tsx', 'src/cfl/rich-editor/PageManager.tsx'],
  ['src/components/apiClient.ts', 'src/cfl/rich-editor/apiClient.ts'],
  ['src/components/types.ts', 'src/cfl/rich-editor/types.ts'],
  ['src/components/FreeCodeTerminal.tsx', 'src/cfl/cli-bridge/FreeCodeTerminal.tsx'],
  ['server/routes/free-code.js', 'server/routes/free-code.js'],
  ['server/routes/free-code-ws.js', 'server/routes/free-code-ws.js'],
  ['src/components/LoginPage.tsx', 'src/cfl/login/LoginPage.tsx'],
  ['src/components/settings/AppearancePage.tsx', 'src/cfl/login/settings/AppearancePage.tsx'],
  ['src/stores/useAuthStore.ts', 'src/stores/useAuthStore.ts'],
  ['src/stores/useThemeStore.ts', 'src/stores/useThemeStore.ts'],
  ['src/lib/translations.ts', 'src/lib/translations.ts'],
  ['src/lib/utils.ts', 'src/lib/utils.ts'],
]

function shaFromFile(file) {
  return createHash('sha256').update(readFileSync(file)).digest('hex')
}

function shaFromGit(repo, ref, filePath) {
  const output = execSync(`git -C "${repo}" show ${ref}:${filePath}`, { encoding: 'utf-8' })
  return createHash('sha256').update(output).digest('hex')
}

const failures = []
for (const [srcRel, dstRel] of mandatory) {
  let srcHash
  try {
    srcHash = shaFromGit(sourceRepo, sourceRef, srcRel)
  } catch (e) {
    console.error(`Cannot read source from git: ${sourceRepo} ${sourceRef}:${srcRel}`)
    process.exit(1)
  }
  const dst = path.join(root, dstRel)
  const dstHash = shaFromFile(dst)
  if (srcHash !== dstHash) failures.push({ srcRel, dstRel, srcHash, dstHash })
}

if (failures.length) {
  console.error('fe-cfl v2 mandatory migration verification failed:')
  for (const f of failures) {
    console.error(`- ${f.srcRel} -> ${f.dstRel}: ${f.srcHash} != ${f.dstHash}`)
  }
  process.exit(1)
}

console.log(`fe-cfl v2 mandatory migration verified: ${mandatory.length} files are exact copies from ${sourceRepo}@${sourceRef}`)
