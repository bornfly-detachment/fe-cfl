import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { test } from 'node:test'

test('v2 mandatory files remain exact copies', () => {
  const result = spawnSync(process.execPath, ['scripts/verify-migration.mjs'], { encoding: 'utf8' })
  assert.equal(result.status, 0, result.stderr || result.stdout)
  assert.match(result.stdout, /mandatory migration verified/)
})
