import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { test } from 'node:test'

test('fe-cfl consumes CFLs as pinned GitHub packages', () => {
  const result = spawnSync(process.execPath, ['scripts/verify-package-boundary.mjs'], { encoding: 'utf8' })
  assert.equal(result.status, 0, result.stderr || result.stdout)
  assert.match(result.stdout, /package boundary verified/)
})
