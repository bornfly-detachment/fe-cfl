import { spawn } from 'node:child_process'
import WebSocket from 'ws'
import { createWriteStream, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const chrome = process.env.CHROME_BIN || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const portBase = 31000 + Math.floor(Math.random() * 20000)
const apiPort = Number(process.env.FE_CFL_VISUAL_API_PORT || portBase)
const targetPort = Number(process.env.FE_CFL_VISUAL_TARGET_PORT || (portBase + 1))
const sourcePort = Number(process.env.FE_CFL_VISUAL_SOURCE_PORT || (portBase + 2))
const width = Number(process.env.FE_CFL_VISUAL_WIDTH || 1365)
const height = Number(process.env.FE_CFL_VISUAL_HEIGHT || 900)
const threshold = Number(process.env.FE_CFL_VISUAL_THRESHOLD || 0.02)
const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
const outDir = path.join(root, 'docs/evidence/visual-diff', timestamp)
const routes = ['/prvse-world', '/blog', '/theory', '/free-code', '/login', '/settings']

if (!existsSync(chrome)) throw new Error(`Chrome not found: ${chrome}`)
mkdirSync(outDir, { recursive: true })

const children = []
function spawnLogged(name, command, args, options = {}) {
  const log = createWriteStream(path.join(outDir, `${name}.log`))
  const child = spawn(command, args, {
    cwd: options.cwd || root,
    env: { ...process.env, ...options.env },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  child.stdout.pipe(log, { end: false })
  child.stderr.pipe(log, { end: false })
  child.on('exit', (code, signal) => log.end(`\n[${name}] exited code=${code} signal=${signal}\n`))
  children.push(child)
  return child
}

async function waitFor(url, name) {
  const deadline = Date.now() + 45_000
  let last = null
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url)
      if (res.ok || res.status < 500) return
      last = new Error(`HTTP ${res.status}`)
    } catch (err) {
      last = err
    }
    await new Promise((r) => setTimeout(r, 500))
  }
  throw new Error(`Timed out waiting for ${name} at ${url}: ${last?.message || 'unknown'}`)
}

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: options.cwd || root, env: { ...process.env, ...options.env }, stdio: ['ignore', 'pipe', 'pipe'] })
    const timer = options.timeoutMs ? setTimeout(() => { child.kill('SIGKILL') }, options.timeoutMs) : null
    let stdout = ''
    let stderr = ''
    child.stdout.on('data', (d) => { stdout += d })
    child.stderr.on('data', (d) => { stderr += d })
    child.on('exit', (code) => {
      if (timer) clearTimeout(timer)
      return code === 0 ? resolve({ stdout, stderr }) : reject(new Error(`${command} ${args.join(' ')} failed (${code})\n${stdout}\n${stderr}`))
    })
  })
}

async function waitForCdp(port) {
  const deadline = Date.now() + 10_000
  let last = null
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/list`)
      if (res.ok) {
        const targets = await res.json()
        const page = targets.find((t) => t.type === 'page' && t.webSocketDebuggerUrl)
        if (page) return page
      }
    } catch (err) { last = err }
    await new Promise((r) => setTimeout(r, 100))
  }
  throw new Error(`Timed out waiting for Chrome CDP page on ${port}: ${last?.message || 'unknown'}`)
}

function cdpConnect(wsUrl) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl)
    let nextId = 1
    const pending = new Map()
    const listeners = new Map()
    const api = {
      send(method, params = {}) {
        const id = nextId++
        ws.send(JSON.stringify({ id, method, params }))
        return new Promise((res, rej) => pending.set(id, { res, rej, method }))
      },
      waitEvent(method, timeoutMs = 10_000) {
        return new Promise((res, rej) => {
          const timer = setTimeout(() => rej(new Error(`Timed out waiting for CDP event ${method}`)), timeoutMs)
          const arr = listeners.get(method) || []
          arr.push((msg) => { clearTimeout(timer); res(msg.params || {}) })
          listeners.set(method, arr)
        })
      },
      close() { try { ws.close() } catch {} },
    }
    ws.on('open', () => resolve(api))
    ws.on('error', reject)
    ws.on('message', (raw) => {
      const msg = JSON.parse(String(raw))
      if (msg.id && pending.has(msg.id)) {
        const p = pending.get(msg.id)
        pending.delete(msg.id)
        if (msg.error) p.rej(new Error(`${p.method}: ${msg.error.message}`))
        else p.res(msg.result)
        return
      }
      if (msg.method && listeners.has(msg.method)) {
        const arr = listeners.get(msg.method)
        const fn = arr.shift()
        if (arr.length === 0) listeners.delete(msg.method)
        if (fn) fn(msg)
      }
    })
  })
}

async function waitForRendered(cdp, route) {
  const routeNeedle = route === '/prvse-world'
    ? 'PRVSE World'
    : route === '/free-code'
      ? 'free-code'
      : route === '/login'
        ? 'Egonetics'
        : route === '/settings'
          ? 'Appearance'
          : route === '/blog'
            ? 'Blog'
            : route === '/theory'
              ? 'Theory'
              : ''
  const deadline = Date.now() + 20_000
  while (Date.now() < deadline) {
    const expr = `(() => {
      const text = document.body ? document.body.innerText : '';
      const ready = document.readyState === 'complete' || document.readyState === 'interactive';
      return { ready, text, ok: ready && text.includes(${JSON.stringify(routeNeedle)}) };
    })()`
    const result = await cdp.send('Runtime.evaluate', { expression: expr, returnByValue: true })
    if (result.result?.value?.ok) return
    await new Promise((r) => setTimeout(r, 250))
  }
  throw new Error(`Timed out waiting for rendered route ${route}`)
}

async function screenshot(url, file) {
  const profile = mkdtempSync(path.join(tmpdir(), 'fe-cfl-chrome-'))
  const port = 39000 + Math.floor(Math.random() * 20000)
  const child = spawn(chrome, [
    '--headless=new',
    '--enable-unsafe-swiftshader',
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--hide-scrollbars',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-background-networking',
    '--disable-extensions',
    '--force-device-scale-factor=1',
    `--window-size=${width},${height}`,
    `--user-data-dir=${profile}`,
    `--remote-debugging-port=${port}`,
    'about:blank',
  ], { stdio: ['ignore', 'ignore', 'ignore'] })
  let cdp
  try {
    const pageTarget = await waitForCdp(port)
    cdp = await cdpConnect(pageTarget.webSocketDebuggerUrl)
    await cdp.send('Page.enable')
    await cdp.send('Runtime.enable')
    await cdp.send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false })
    const loaded = cdp.waitEvent('Page.loadEventFired', 20_000).catch(() => null)
    await cdp.send('Page.navigate', { url })
    await loaded
    await waitForRendered(cdp, new URL(url).pathname)
    await new Promise((r) => setTimeout(r, 1_500))
    const shot = await cdp.send('Page.captureScreenshot', { format: 'png', fromSurface: true, captureBeyondViewport: false })
    writeFileSync(file, Buffer.from(shot.data, 'base64'))
  } finally {
    if (cdp) cdp.close()
    child.kill('SIGKILL')
    rmSync(profile, { recursive: true, force: true })
  }
}

async function diffImages(source, target, diff) {
  const py = String.raw`
import json, sys
from PIL import Image, ImageChops
src_path, tgt_path, diff_path = sys.argv[1:4]
src = Image.open(src_path).convert('RGBA')
tgt = Image.open(tgt_path).convert('RGBA')
w = min(src.width, tgt.width)
h = min(src.height, tgt.height)
src = src.crop((0, 0, w, h))
tgt = tgt.crop((0, 0, w, h))
d = ImageChops.difference(src, tgt)
pix = d.load()
out = Image.new('RGBA', (w, h), (0,0,0,255))
out_pix = out.load()
diff_pixels = 0
total_abs = 0
for y in range(h):
  for x in range(w):
    r,g,b,a = pix[x,y]
    m = max(r,g,b,a)
    total_abs += r + g + b
    if m > 12:
      diff_pixels += 1
      out_pix[x,y] = (255, 0, 80, 255)
    else:
      base = src.getpixel((x,y))
      shade = int((base[0] + base[1] + base[2]) / 9)
      out_pix[x,y] = (shade, shade, shade, 255)
out.save(diff_path)
print(json.dumps({
  'width': w,
  'height': h,
  'pixels': w*h,
  'differentPixels': diff_pixels,
  'ratio': diff_pixels / (w*h),
  'meanAbsRgb': total_abs / (w*h*3),
}, ensure_ascii=False))
`
  const result = await run('/usr/bin/python3', ['-c', py, source, target, diff])
  return JSON.parse(result.stdout)
}

function mdReport(results) {
  const lines = [
    '# fe-cfl visual diff report',
    '',
    `- source: /Users/Shared/egonetics/main direct component harness`,
    `- target: /Users/Shared/codex-workspace/fe-cfl`,
    `- viewport: ${width}x${height}`,
    `- threshold: ${(threshold * 100).toFixed(2)}% different pixels`,
    '',
    '| route | status | diff % | mean abs RGB | source | target | diff |',
    '|---|---:|---:|---:|---|---|---|',
  ]
  for (const r of results) {
    lines.push(`| ${r.route} | ${r.pass ? 'PASS' : 'FAIL'} | ${(r.ratio * 100).toFixed(3)}% | ${r.meanAbsRgb.toFixed(3)} | ${path.basename(r.source)} | ${path.basename(r.target)} | ${path.basename(r.diff)} |`)
  }
  lines.push('', 'Notes:', '- `/blog` and `/theory` run against empty standalone page data during visual diff to avoid the source frontend historical nested React-DnD backend crash while still checking route shell and migrated view rendering.', '- Source app files are not written; Vite cache is redirected under `fe-cfl/.visual-cache/`.')
  return lines.join('\n') + '\n'
}

try {
  spawnLogged('api', process.execPath, ['server/index.js'], { env: { PORT: String(apiPort), FE_CFL_VISUAL_EMPTY_PAGES: '1' } })
  await waitFor(`http://127.0.0.1:${apiPort}/api/free-code/tiers`, 'standalone API')

  spawnLogged('target-vite', path.join(root, 'node_modules/.bin/vite'), ['--host', '127.0.0.1', '--port', String(targetPort), '--strictPort', '--clearScreen', 'false'], { env: { FE_CFL_API_TARGET: `http://127.0.0.1:${apiPort}`, FE_CFL_WS_TARGET: `ws://127.0.0.1:${apiPort}` } })
  await waitFor(`http://127.0.0.1:${targetPort}/`, 'target Vite')

  spawnLogged('source-vite', path.join(root, 'node_modules/.bin/vite'), ['--config', path.join(root, 'scripts/source-vite.visual.config.mjs'), '--host', '127.0.0.1', '--port', String(sourcePort), '--strictPort', '--clearScreen', 'false'], { env: { FE_CFL_API_TARGET: `http://127.0.0.1:${apiPort}`, FE_CFL_WS_TARGET: `ws://127.0.0.1:${apiPort}`, VITE_DEV_MODE: 'true' } })
  await waitFor(`http://127.0.0.1:${sourcePort}/`, 'source Vite harness')

  // Warm Vite dependency optimization and WebGL initialization before measured captures.
  await screenshot(`http://127.0.0.1:${sourcePort}/prvse-world`, path.join(outDir, '_warmup.source.png'))
  await screenshot(`http://127.0.0.1:${targetPort}/prvse-world?visual=1`, path.join(outDir, '_warmup.target.png'))

  const results = []
  for (const route of routes) {
    const slug = route.replace(/^\//, '').replace(/[^a-z0-9-]/gi, '-')
    const sourceFile = path.join(outDir, `${slug}.source.png`)
    const targetFile = path.join(outDir, `${slug}.target.png`)
    const diffFile = path.join(outDir, `${slug}.diff.png`)
    await screenshot(`http://127.0.0.1:${sourcePort}${route}`, sourceFile)
    await screenshot(`http://127.0.0.1:${targetPort}${route}?visual=1`, targetFile)
    const stats = await diffImages(sourceFile, targetFile, diffFile)
    results.push({ route, source: sourceFile, target: targetFile, diff: diffFile, ...stats, pass: stats.ratio <= threshold })
  }

  writeFileSync(path.join(outDir, 'report.json'), JSON.stringify({ threshold, width, height, results }, null, 2))
  writeFileSync(path.join(outDir, 'REPORT.md'), mdReport(results))
  const latest = path.join(root, 'docs/evidence/visual-diff/latest.json')
  writeFileSync(latest, JSON.stringify({ outDir, threshold, width, height, results }, null, 2))
  console.log(mdReport(results))
  if (results.some((r) => !r.pass)) process.exitCode = 1
} finally {
  for (const child of children.reverse()) {
    if (!child.killed) child.kill('SIGINT')
  }
}
