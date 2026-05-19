'use strict'

const http = require('http')
const express = require('express')
const WebSocket = require('ws')
const { spawn } = require('child_process')
const freeCodeRoutes = require('./routes/free-code')

function canUseNodePty() {
  try {
    const pty = require('node-pty')
    const proc = pty.spawn('/bin/bash', ['-lc', 'exit 0'], { name: 'xterm-256color', cols: 80, rows: 24, cwd: process.cwd(), env: process.env })
    try { proc.kill() } catch {}
    return true
  } catch {
    return false
  }
}

function attachPipeWs(httpServer) {
  const wss = new WebSocket.Server({ noServer: true })
  const WS_PATH = '/ws/free-code'
  httpServer.on('upgrade', (req, socket, head) => {
    const url = new URL(req.url, 'http://localhost')
    if (url.pathname !== WS_PATH) return
    wss.handleUpgrade(req, socket, head, (ws) => wss.emit('connection', ws, req))
  })
  wss.on('connection', (ws) => {
    let child = null
    const send = (obj) => { if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(obj)) }
    ws.on('message', (raw) => {
      let msg
      try { msg = JSON.parse(String(raw)) } catch { return }
      if (msg.type === 'start') {
        if (child) return
        const cwd = msg.cwd && typeof msg.cwd === 'string' ? msg.cwd.replace(/^~/, process.env.HOME || '') : process.cwd()
        child = spawn('/bin/bash', ['-i'], { cwd: cwd.startsWith('/Users/Shared/codex-workspace/fe-cfl') ? cwd : process.cwd(), env: { ...process.env, TERM: 'xterm-256color' }, stdio: 'pipe' })
        child.stdout.on('data', (data) => send({ type: 'output', data: data.toString() }))
        child.stderr.on('data', (data) => send({ type: 'output', data: data.toString() }))
        child.on('exit', (code, signal) => send({ type: 'exit', code, signal }))
        send({ type: 'ready', cwd: process.cwd(), session: 'fe-cfl-pipe-shell', tier: { id: 'T2', label: 'Standalone Shell' }, isolation: { isolated: false, user: process.env.USER || 'unknown', fallbackReason: 'node-pty unavailable; using pipe shell' } })
        return
      }
      if (msg.type === 'input' && child) child.stdin.write(msg.data || '')
      if (msg.type === 'resize') return
      if (msg.type === 'kill' && child) { child.kill(); child = null }
      if (msg.type === 'ping') send({ type: 'pong' })
    })
    ws.on('close', () => { if (child) child.kill() })
  })
  console.warn('[fe-cfl] node-pty spawn unavailable; using pipe-based standalone websocket fallback')
  return wss
}

const freeCodeWs = canUseNodePty() ? require('./routes/free-code-ws') : { attach: attachPipeWs }

const app = express()
app.use(express.json({ limit: '10mb' }))

const now = () => new Date().toISOString()
const visualEmptyPages = process.env.FE_CFL_VISUAL_EMPTY_PAGES === '1'
const pages = new Map(visualEmptyPages ? [] : [
  ['page-blog-root', { id: 'page-blog-root', parentId: null, title: 'Blog', icon: '✍️', position: 1, pageType: 'blog', refId: null, createdAt: now(), updatedAt: now() }],
  ['page-theory-root', { id: 'page-theory-root', parentId: null, title: 'Theory', icon: '🧠', position: 1, pageType: 'theory', refId: null, createdAt: now(), updatedAt: now() }],
])
const blocks = new Map(visualEmptyPages ? [] : [
  ['page-blog-root', [{ id: 'block-blog-1', parentId: null, type: 'paragraph', content: { rich_text: [{ text: 'fe-rich-editor-cfl v2 migrated runtime.' }] }, position: 1, metadata: {} }]],
  ['page-theory-root', [{ id: 'block-theory-1', parentId: null, type: 'paragraph', content: { rich_text: [{ text: 'Theory page migrated from the source frontend.' }] }, position: 1, metadata: {} }]],
])

function pageList(req) {
  const type = req.query.type
  const refId = req.query.refId
  return [...pages.values()].filter((page) => {
    if (type && page.pageType !== type) return false
    if (refId && String(page.refId || '') !== String(refId)) return false
    return true
  })
}

function sendJson(res, value) {
  res.setHeader('Content-Type', 'application/json')
  res.json(value)
}

app.use('/api/free-code', freeCodeRoutes)

app.get('/api/pages', (req, res) => sendJson(res, pageList(req)))
app.post('/api/pages', (req, res) => {
  const body = req.body || {}
  const id = body.id || `page-${Date.now().toString(36)}`
  const page = {
    id,
    parentId: body.parentId ?? null,
    title: body.title || 'Untitled',
    icon: body.icon || '📄',
    position: body.position ?? Date.now(),
    pageType: body.pageType || 'page',
    refId: body.refId ?? null,
    createdAt: now(),
    updatedAt: now(),
  }
  pages.set(id, page)
  blocks.set(id, [])
  sendJson(res, page)
})
app.patch('/api/pages/:id', (req, res) => {
  const old = pages.get(req.params.id)
  if (!old) return res.status(404).json({ error: 'page not found' })
  const page = { ...old, ...req.body, updatedAt: now() }
  pages.set(page.id, page)
  sendJson(res, page)
})
app.delete('/api/pages/:id', (req, res) => {
  pages.delete(req.params.id)
  blocks.delete(req.params.id)
  sendJson(res, { ok: true })
})
app.post('/api/pages/:id/move', (req, res) => {
  const old = pages.get(req.params.id)
  if (!old) return res.status(404).json({ error: 'page not found' })
  const page = { ...old, parentId: req.body?.newParentId ?? null, position: req.body?.newPosition ?? old.position, updatedAt: now() }
  pages.set(page.id, page)
  sendJson(res, page)
})
app.get('/api/pages/:id/blocks', (req, res) => sendJson(res, blocks.get(req.params.id) || []))
app.put('/api/pages/:id/blocks', (req, res) => {
  const next = Array.isArray(req.body) ? req.body : []
  blocks.set(req.params.id, next)
  sendJson(res, next)
})

app.get('/api/signals/queue/counts', (_req, res) => sendJson(res, { counts: { L0: 0, L1: 0, L2: 0, L3: 0 }, total: 0 }))
app.get('/api/signals/diffs', (_req, res) => sendJson(res, { items: [] }))
app.get('/api/signals/queue', (_req, res) => sendJson(res, { items: [] }))
app.post('/api/signals/diffs/:id/arbitrate', (_req, res) => sendJson(res, { ok: true }))
app.post('/api/signals/queue/:id/resolve', (_req, res) => sendJson(res, { ok: true }))

app.get('/api/tasks', (_req, res) => sendJson(res, { tasks: [] }))
app.post('/api/tasks', (_req, res) => sendJson(res, { ok: true, task: { id: `task-${Date.now().toString(36)}`, ...(_req.body || {}) } }))
app.get('/api/kernel/state', (_req, res) => sendJson(res, { tick: 0, nodes: {}, contracts: [] }))
app.get('/api/kernel/effects', (_req, res) => sendJson(res, []))
app.get('/api/kernel/executions', (_req, res) => sendJson(res, []))
app.post('/api/kernel/tick', (_req, res) => sendJson(res, { ok: true }))
app.post('/api/kernel/reset', (_req, res) => sendJson(res, { ok: true }))
app.get('/api/kernel/seai/health', (_req, res) => sendJson(res, { available: false }))
app.get('/api/mq/stats', (_req, res) => sendJson(res, []))

app.get('/api/resources/graph', (_req, res) => sendJson(res, { nodes: [], edges: [] }))
app.get('/api/resources/runtime/status', (_req, res) => sendJson(res, { gate: { enabled: false, reason: 'standalone fallback' }, jobs: [], snapshot: {} }))
app.get('/api/resources/runtime/snapshot', (_req, res) => sendJson(res, {}))
app.get('/api/resources/status', (_req, res) => sendJson(res, { ok: true, standalone: true }))
app.post('/api/resources/runtime/start', (_req, res) => sendJson(res, { ok: true }))
app.post('/api/resources/runtime/stop', (_req, res) => sendJson(res, { ok: true }))
app.post('/api/resources/runtime/trigger', (_req, res) => sendJson(res, { ok: true }))

app.get('/api/tag-trees', (_req, res) => sendJson(res, []))
app.post('/api/tag-trees', (req, res) => sendJson(res, { id: `tag-${Date.now().toString(36)}`, name: req.body?.name || 'Tag', color: req.body?.color || '#6b7280', select_mode: req.body?.select_mode || 'multi' }))
app.get('/api/prvse-classifications', (_req, res) => sendJson(res, null))
app.put('/api/prvse-classifications', (_req, res) => sendJson(res, { ok: true }))

app.get('/api/auth/me', (_req, res) => sendJson(res, { id: 0, username: 'standalone', role: 'admin' }))
app.post('/api/auth/login', (_req, res) => sendJson(res, { token: 'standalone-token', user: { id: 0, username: 'standalone', role: 'admin' } }))
app.post('/api/auth/register', (_req, res) => sendJson(res, { requiresVerification: false, token: 'standalone-token', user: { id: 0, username: 'standalone', role: 'admin' } }))
app.get('/api/auth/check-email', (_req, res) => sendJson(res, { available: true }))
app.get('/api/auth/check-username', (_req, res) => sendJson(res, { available: true }))
app.post('/api/auth/verify-email', (_req, res) => sendJson(res, { ok: true }))
app.post('/api/auth/resend-code', (_req, res) => sendJson(res, { ok: true }))

app.all('/api/*', (req, res) => {
  if (req.method === 'GET') return sendJson(res, {})
  return sendJson(res, { ok: true })
})

const server = http.createServer(app)
freeCodeWs.attach?.(server)

const port = Number(process.env.PORT || 3052)
server.listen(port, () => {
  console.log(`[fe-cfl] standalone API/free-code bridge listening on http://localhost:${port}`)
})
