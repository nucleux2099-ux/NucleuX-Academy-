import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const manifestPath = path.join(process.cwd(), '.next', 'server', 'app-paths-manifest.json')

test('build manifest includes /atom app route', () => {
  assert.equal(fs.existsSync(manifestPath), true, `Missing build manifest at ${manifestPath}. Run \`npm run build\` first.`)

  const manifestRaw = fs.readFileSync(manifestPath, 'utf8')
  const manifest = JSON.parse(manifestRaw) as Record<string, string>

  const hasAtomKey = Object.keys(manifest).some((key) => key === '/(app)/atom/page' || key.endsWith('/atom/page'))

  assert.equal(
    hasAtomKey,
    true,
    'Expected app-paths manifest to include the /atom page route (e.g. /(app)/atom/page).',
  )
})
