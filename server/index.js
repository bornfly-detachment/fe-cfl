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

const protocolRows = [
  {
    id: 'proto-human-ai-intent',
    category: 'E-ui',
    layer: 'L2',
    human_char: 'Human intent',
    ui_visual: 'Protocol Builder',
    machine_lang: '{"intent":"generate-ai-native-ui"}',
    notes: 'Standalone fixture for protocol-builder CFL validation.',
    sort_order: 10,
    anchor_tag_id: 'tag-e-infra',
  },
  {
    id: 'proto-prvse-state',
    category: 'S-l1',
    layer: 'L1',
    human_char: 'Runtime state',
    ui_visual: 'State lane',
    machine_lang: '{"state":"observable"}',
    notes: 'Keeps protocol view backed by real structured rows.',
    sort_order: 20,
    anchor_tag_id: 'tag-s-l1',
  },
]

const canvases = [
  {
    id: 'canvas-semantic-root',
    title: 'Semantic relation map',
    description: 'Standalone semantic canvas for CFL validation.',
    creator: 'standalone',
    canvas_type: 'semantic',
    task_ref_id: null,
    node_count: 3,
    created_at: now(),
    updated_at: now(),
  },
  {
    id: 'canvas-exec-root',
    title: 'Execution relation map',
    description: 'Task lifecycle canvas fixture.',
    creator: 'standalone',
    canvas_type: 'execution',
    task_ref_id: 'task-runtime',
    node_count: 2,
    created_at: now(),
    updated_at: now(),
  },
]

const kanbanColumns = [
  { id: 'todo', label: 'Todo', headerBg: 'bg-[#2E7DC5]', cardBg: 'bg-[#0a1f35]', accent: '#4A9DE0' },
  { id: 'doing', label: 'Doing', headerBg: 'bg-[#C27B2B]', cardBg: 'bg-[#251508]', accent: '#E09030' },
  { id: 'done', label: 'Done', headerBg: 'bg-[#2E9E6A]', cardBg: 'bg-[#0a2318]', accent: '#3DBF80' },
]

const kanbanTasks = [
  {
    id: 'task-runtime',
    name: 'Extract runtime CFL',
    icon: '⚙️',
    status: 'doing',
    columnId: 'doing',
    priority: 'high',
    sortOrder: 1000,
    created_at: now(),
    updated_at: now(),
    tags: ['runtime'],
  },
  {
    id: 'task-protocol',
    name: 'Validate protocol UI library',
    icon: '🧩',
    status: 'todo',
    columnId: 'todo',
    priority: 'medium',
    sortOrder: 900,
    created_at: now(),
    updated_at: now(),
    tags: ['protocol'],
  },
]

const memoryBoards = new Map([
  ['board-standalone', {
    id: 'board-standalone',
    title: 'Memory annotations',
    created_at: now(),
    updated_at: now(),
    blocks: [
      {
        id: 'mem-block-1',
        board_id: 'board-standalone',
        type: 'paragraph',
        content: { rich_text: [{ text: 'Memory chronicle CFL validation board.' }] },
        position: 1,
      },
    ],
  }],
])

const memorySessions = [
  {
    id: 'session-standalone',
    agent_name: 'Codex',
    agent_type: 'codex',
    model: 'standalone',
    started_at: now(),
    ended_at: null,
    annotation_title: 'CFL split review',
    token_input: 1200,
    token_output: 640,
    round_count: 1,
    chronicle_entry_id: 'entry-memory',
  },
]

const chronicleEntries = [
  {
    id: 'entry-memory',
    type: 'memory',
    source_id: 'session-standalone',
    title: 'CFL split review',
    summary: 'Standalone memory entry for visual validation.',
    start_time: now(),
    end_time: null,
    task_outcome: null,
    version_tag: 'v0',
    content: null,
    milestone_id: null,
    is_locked: 0,
    created_at: now(),
  },
]

const e0Lifecycles = [
  {
    id: 'e0',
    name: 'E0 control lifecycle',
    description: 'Standalone state controller fixture.',
    state: 'OBSERVING',
    enabled: 1,
    is_builtin: 1,
    updated_at: now(),
  },
]

const e0Components = [
  {
    id: 'comp-perceive',
    lifecycle_id: 'e0',
    layer: 'P',
    sub_id: 'scan',
    name: 'Perception scan',
    description: 'Collect UI/runtime signals.',
    status: 'running',
    config: {},
    is_builtin: 1,
  },
  {
    id: 'comp-state',
    lifecycle_id: 'e0',
    layer: 'S',
    sub_id: 'queue',
    name: 'State queue',
    description: 'Task lifecycle controller.',
    status: 'active',
    config: {},
    is_builtin: 1,
  },
]

const queueItems = [
  {
    id: 'queue-1',
    description: 'Validate FE CFL extraction',
    v_criteria: { pass_condition: 'PK screenshot logs are clean' },
    state: 'pending',
    assigned_node: null,
    output: null,
    v_score: null,
    error_msg: null,
    sort_order: 100,
    created_at: now(),
    started_at: null,
    completed_at: null,
    layer: 'S',
    task_ref_id: 'task-runtime',
    resource_cost: null,
    state_tags: '[]',
  },
]

function makeObsidianStatus() {
  return {
    vault_path: '/Users/Shared/egonetics-vault',
    vault_name: 'egonetics-vault',
    status: 'synced',
    last_synced_at: Date.now(),
    markdown_files: 7,
    syncing_files: 0,
    errors: [],
    obsidian_uri: 'obsidian://open?vault=egonetics-vault',
    graph_nodes: [
      { id: 'obs-protocol', title: 'Protocol Builder', layer: 'L2', path: 'protocol.md', backlinks: ['obs-runtime'] },
      { id: 'obs-runtime', title: 'Runtime S', layer: 'L1', path: 'runtime.md', backlinks: ['obs-protocol', 'obs-memory'] },
      { id: 'obs-memory', title: 'Memory Chronicle', layer: 'L0', path: 'memory.md', backlinks: ['obs-runtime'] },
    ],
    graph_edges: [
      { from: 'obs-runtime', to: 'obs-protocol', kind: 'backlink', evidence: 'standalone fixture' },
      { from: 'obs-memory', to: 'obs-runtime', kind: 'backlink', evidence: 'standalone fixture' },
    ],
  }
}

function makePrvseState() {
  const cflRegistry = [
    'fe-obsidian-cfl',
    'fe-protocol-builder-cfl',
    'fe-task-lifecycle-cfl',
    'fe-memory-chronicle-cfl',
  ].map((id, index) => ({
    id,
    tag_id: `tag-cfl-${index}`,
    kernel_primitive: 'frontend_cfl',
    compiler_source_grammar: 'tsx',
    input_pattern_schema: {},
    output_pattern_schema: {},
    value_validator_schema: {},
    sandbox_profile: {},
    startup_policy: 'visual',
    feedback_channel: 'fe-pk',
    chronicle_policy: {},
    runtime_status: index < 3 ? 'running' : 'stopped',
    created_at: Date.now(),
    updated_at: Date.now(),
  }))
  const cflNodes = cflRegistry.map((cfl, index) => ({
    id: cfl.id,
    name: cfl.id,
    tag_id: cfl.tag_id,
    layer: index === 0 ? 'L2' : index === 1 ? 'L1' : 'L0',
    runtime_status: cfl.runtime_status,
    gate_status: { visual: true },
  }))
  return {
    mode: 'last_stand',
    last_stand: {
      active: true,
      policy: 'visual-standalone',
      provider_plan: [
        { priority: 1, provider: 'codex', model: 'standalone', tier: 'T2', status: 'ready', calls: 1, prompt_tokens: 128, completion_tokens: 64, cached_tokens: 0, latency_p50_ms: 120, tokens_per_sec: 22 },
      ],
      provider_pool_exhausted: false,
    },
    governance: { path: 'docs/prd/README.md', loaded: true, hash: 'standalone', title: 'FE CFL PRD' },
    runtime_s: {
      state: 'alive',
      harness_id: 'fe-cfl-standalone',
      boot_sequencer: null,
      running_cfl_count: 3,
      v_pass: 7,
      v_fail: 0,
      v_strikes: 0,
      resources: { time_ms: 1200, time_max: 60000, tokens: 2048, token_max: 100000, storage: 512, storage_max: 1000000, attempts: 1, attempts_max: 3 },
    },
    control: {
      goal: { id: 'goal-fe-cfl', text: 'Extract FE CFLs', success_condition: 'PK clean', tag: 'fe-cfl', priority: 'high', l2_layer: 'L2', updated_at: Date.now(), submitted_by: 'standalone' },
      constitutionText: 'Reuse FE CFLs; do not rebuild wheels.',
      resourcesText: 'Minimal standalone resources.',
      session: null,
      files: { goalPath: 'docs/prd/README.md', constitutionPath: 'docs/prd/README.md', resourcesPath: 'docs/prd/README.md' },
    },
    cfl_registry: cflRegistry,
    cfl_nodes: cflNodes,
    inbox: { total: 1, unresolved: 0, items: [{ id: 'inbox-1', source: 'boot_degraded', reason: 'Standalone fixture booted without SEAI.', suggested_action: 'Use local visual fallback.', created_at: Date.now(), resolved: true }] },
    trace: {
      lifecycles: [{ type: 'start', harness_id: 'fe-cfl-standalone', timestamp: Date.now(), details: 'visual validation' }],
      relation_events: [
        { timestamp: Date.now(), type: 'obsidian_sync_updated', source: 'standalone', details: { id: 'obs-runtime' } },
        { timestamp: Date.now(), type: 'cfl_registry_runtime_changed', source: 'standalone', details: { id: 'fe-protocol-builder-cfl' } },
      ],
    },
    obsidian: makeObsidianStatus(),
    usage: {
      intelligence: { by_tier: { T2: { tokens_used: 2048, calls: 1 } }, total_tokens_used: 2048 },
      storage: { by_category: { visual: { bytes: 512 } }, total_bytes: 512 },
      spacetime: { wall_ms: 1200, cpu_ms: 100, turns: 1 },
    },
    layers: {
      L0: cflNodes.filter(node => node.layer === 'L0'),
      L1: cflNodes.filter(node => node.layer === 'L1'),
      L2: cflNodes.filter(node => node.layer === 'L2'),
    },
  }
}

function canonicalResourceStatus() {
  return {
    observedAt: Date.now(),
    canonical: {
      harnessResources: [
        { id: 'harness:claude-cli', binary: 'claude', status: 'unknown' },
        { id: 'harness:codex-cli', binary: 'codex', status: 'ready' },
        { id: 'harness:gemini-cli', binary: 'gemini', status: 'unknown' },
      ],
      namingContract: { note: 'standalone fallback' },
    },
  }
}

function queuePreconditions() {
  return {
    environment: { ok: true, detail: {} },
    goals: { ok: true, detail: {} },
    nodes: { ok: true, detail: {} },
    cognition: { ok: true, detail: {} },
    all_ok: true,
  }
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

app.get('/api/prvse/state', (_req, res) => sendJson(res, makePrvseState()))
app.get('/api/prvse/obsidian-sync', (_req, res) => sendJson(res, makeObsidianStatus()))
app.post('/api/prvse/obsidian-sync', (_req, res) => sendJson(res, makeObsidianStatus()))
app.get('/api/prvse/cfl-registry', (_req, res) => sendJson(res, { items: makePrvseState().cfl_registry }))
app.post('/api/prvse/cfl-registry/:id/:op', (req, res) => {
  const state = makePrvseState()
  const item = state.cfl_registry.find((cfl) => cfl.id === req.params.id) || state.cfl_registry[0]
  sendJson(res, { ok: true, item, trace: { op: req.params.op, at: now() } })
})
app.post('/api/prvse/resource', (_req, res) => sendJson(res, { ok: true, mode: 'last_stand', state: makePrvseState() }))
app.post('/api/runtime/start', (_req, res) => sendJson(res, { ok: true, harnessId: 'fe-cfl-standalone', state: 'alive' }))
app.post('/api/runtime/stop', (_req, res) => sendJson(res, { ok: true, state: 'dead' }))
app.post('/api/runtime/restart', (_req, res) => sendJson(res, { ok: true, harnessId: 'fe-cfl-standalone', state: 'alive' }))
app.post('/api/inbox/:id/resolve', (_req, res) => sendJson(res, { ok: true }))

app.get('/api/protocol', (req, res) => {
  const category = req.query.category ? String(req.query.category) : ''
  sendJson(res, category ? protocolRows.filter((row) => row.category === category) : protocolRows)
})
app.post('/api/protocol', (req, res) => {
  const row = {
    id: `proto-${Date.now().toString(36)}`,
    category: req.body?.category || 'E-ui',
    layer: req.body?.layer || 'L1',
    human_char: req.body?.human_char || '',
    ui_visual: req.body?.ui_visual || '',
    machine_lang: req.body?.machine_lang || '{}',
    notes: req.body?.notes || '',
    sort_order: req.body?.sort_order ?? protocolRows.length + 1,
    anchor_tag_id: req.body?.anchor_tag_id || 'tag-e-infra',
  }
  protocolRows.push(row)
  sendJson(res, row)
})
app.patch('/api/protocol/:id', (req, res) => {
  const row = protocolRows.find((item) => item.id === req.params.id)
  if (!row) return res.status(404).json({ error: 'protocol row not found' })
  Object.assign(row, req.body || {})
  sendJson(res, row)
})
app.delete('/api/protocol/:id', (req, res) => {
  const index = protocolRows.findIndex((item) => item.id === req.params.id)
  if (index >= 0) protocolRows.splice(index, 1)
  sendJson(res, { ok: true })
})
app.get('/api/protocol-rules', (_req, res) => sendJson(res, []))
app.post('/api/protocol-rules', (req, res) => sendJson(res, { id: `rule-${Date.now().toString(36)}`, ...(req.body || {}) }))
app.patch('/api/protocol-rules/:id', (req, res) => sendJson(res, { id: req.params.id, ...(req.body || {}) }))
app.delete('/api/protocol-rules/:id', (_req, res) => sendJson(res, { ok: true }))
app.post('/api/protocol-rules/:id/build', (req, res) => sendJson(res, { ok: true, id: req.params.id, generated: [] }))
app.post('/api/protocol-rules/:id/suggest', (req, res) => sendJson(res, { suggestions: [] }))
app.post('/api/protocol-rules/:id/publish', (req, res) => sendJson(res, { ok: true, id: req.params.id }))
app.get('/api/protocol-rules/constitution-tree', (_req, res) => sendJson(res, { nodes: [] }))

app.get('/api/canvases', (_req, res) => sendJson(res, canvases))
app.post('/api/canvases', (req, res) => {
  const canvas = {
    id: `canvas-${Date.now().toString(36)}`,
    title: req.body?.title || 'Untitled canvas',
    description: req.body?.description || '',
    creator: 'standalone',
    canvas_type: 'semantic',
    task_ref_id: null,
    node_count: 0,
    created_at: now(),
    updated_at: now(),
  }
  canvases.push(canvas)
  sendJson(res, canvas)
})
app.patch('/api/canvases/:id', (req, res) => {
  const canvas = canvases.find((item) => item.id === req.params.id)
  if (!canvas) return res.status(404).json({ error: 'canvas not found' })
  Object.assign(canvas, req.body || {}, { updated_at: now() })
  sendJson(res, canvas)
})
app.delete('/api/canvases/:id', (req, res) => {
  const index = canvases.findIndex((item) => item.id === req.params.id)
  if (index >= 0) canvases.splice(index, 1)
  sendJson(res, { ok: true })
})
app.get('/api/canvases/:id/nodes', (_req, res) => sendJson(res, []))
app.post('/api/canvases/:id/nodes', (req, res) => sendJson(res, { id: `node-${Date.now().toString(36)}`, canvas_id: req.params.id, entity_type: req.body?.entity_type || 'note', entity_id: req.body?.entity_id || 'entry-memory', x: req.body?.x ?? 0, y: req.body?.y ?? 0, expanded_level: req.body?.expanded_level ?? 0, collapsed: 0, tree_expanded: 0, created_at: now() }))
app.patch('/api/canvases/:id/nodes/:nodeId', (req, res) => sendJson(res, { id: req.params.nodeId, canvas_id: req.params.id, ...(req.body || {}) }))
app.delete('/api/canvases/:id/nodes/:nodeId', (_req, res) => sendJson(res, { ok: true }))

app.get('/api/tasks', (_req, res) => sendJson(res, { tasks: [] }))
app.post('/api/tasks', (_req, res) => sendJson(res, { ok: true, task: { id: `task-${Date.now().toString(36)}`, ...(_req.body || {}) } }))
app.get('/api/kanban', (_req, res) => sendJson(res, { columns: kanbanColumns, tasks: kanbanTasks }))
app.post('/api/kanban/tasks', (req, res) => {
  const task = {
    id: `task-${Date.now().toString(36)}`,
    name: req.body?.name || 'Untitled task',
    icon: req.body?.icon || '📝',
    status: req.body?.status || 'todo',
    columnId: req.body?.columnId || req.body?.status || 'todo',
    priority: req.body?.priority || 'medium',
    sortOrder: req.body?.sortOrder ?? Date.now(),
    created_at: now(),
    updated_at: now(),
    tags: req.body?.tags || [],
  }
  kanbanTasks.push(task)
  sendJson(res, task)
})
app.patch('/api/kanban/tasks/:id', (req, res) => {
  const task = kanbanTasks.find((item) => item.id === req.params.id)
  if (!task) return res.status(404).json({ error: 'task not found' })
  Object.assign(task, req.body || {}, { updated_at: now() })
  sendJson(res, task)
})
app.delete('/api/kanban/tasks/:id', (req, res) => {
  const index = kanbanTasks.findIndex((item) => item.id === req.params.id)
  if (index >= 0) kanbanTasks.splice(index, 1)
  sendJson(res, { ok: true })
})
app.put('/api/kanban/columns', (req, res) => sendJson(res, Array.isArray(req.body) ? req.body : kanbanColumns))
app.get('/api/kernel/state', (_req, res) => sendJson(res, { tick: 0, nodes: {}, contracts: [] }))
app.get('/api/kernel/effects', (_req, res) => sendJson(res, []))
app.get('/api/kernel/executions', (_req, res) => sendJson(res, []))
app.post('/api/kernel/tick', (_req, res) => sendJson(res, { ok: true }))
app.post('/api/kernel/reset', (_req, res) => sendJson(res, { ok: true }))
app.get('/api/kernel/seai/health', (_req, res) => sendJson(res, { available: false }))
app.get('/api/mq/messages', (_req, res) => sendJson(res, []))
app.get('/api/mq/stats', (_req, res) => sendJson(res, []))

app.get('/api/resources/graph', (_req, res) => sendJson(res, { nodes: [], edges: [] }))
app.get('/api/resources/status/canonical', (_req, res) => sendJson(res, canonicalResourceStatus()))
app.get('/api/resources/logs/summary', (_req, res) => sendJson(res, { date: now().slice(0, 10), tiers: { T2: { calls: 1, inputTokens: 512, outputTokens: 256, totalLatencyMs: 120, errors: 0, avgLatencyMs: 120 } } }))
app.get('/api/resources/runtime/status', (_req, res) => sendJson(res, { gate: { enabled: false, lastRunAt: now() }, jobs: [], snapshot: { at: now(), summary: { total: 3, alive: 1 } } }))
app.get('/api/resources/runtime/snapshot', (_req, res) => sendJson(res, { at: now(), summary: { total: 3, alive: 1 } }))
app.get('/api/resources/status', (_req, res) => sendJson(res, { mustReclaim: false, system: { ram: { totalMb: 32768, usedMb: 12288 }, pressure: { memory: 37 } }, sessions: { current: 1, max: 6 } }))
app.get('/api/resources/budget', (_req, res) => sendJson(res, makePrvseState().control.resourcesText))
app.get('/api/resources/usage', (_req, res) => sendJson(res, makePrvseState().usage))
app.get('/api/resources/intelligence/providers', (_req, res) => sendJson(res, []))
app.post('/api/resources/intelligence/providers', (req, res) => sendJson(res, { ok: true, provider: { name: req.body?.name || 'standalone', models: [] } }))
app.delete('/api/resources/intelligence/providers/:name', (_req, res) => sendJson(res, { ok: true }))
app.post('/api/resources/intelligence/speed-probe/:modelId', (req, res) => sendJson(res, { ok: true, result: { modelId: req.params.modelId, latencyMs: 120 } }))
app.post('/api/resources/intelligence/speed-probe-all', (_req, res) => sendJson(res, { ok: true, message: 'standalone' }))
app.post('/api/resources/runtime/start', (_req, res) => sendJson(res, { ok: true }))
app.post('/api/resources/runtime/stop', (_req, res) => sendJson(res, { ok: true }))
app.post('/api/resources/runtime/trigger', (_req, res) => sendJson(res, { ok: true }))

app.get('/api/tag-trees', (_req, res) => sendJson(res, []))
app.post('/api/tag-trees', (req, res) => sendJson(res, { id: `tag-${Date.now().toString(36)}`, name: req.body?.name || 'Tag', color: req.body?.color || '#6b7280', select_mode: req.body?.select_mode || 'multi' }))
app.get('/api/tags', (_req, res) => sendJson(res, [{ id: 'tag-s-n-sm-runtime', name: 'runtime', color: '#f97316' }]))
app.get('/api/prvse-classifications', (_req, res) => sendJson(res, null))
app.put('/api/prvse-classifications', (_req, res) => sendJson(res, { ok: true }))

app.get('/api/memory/boards', (_req, res) => sendJson(res, { boards: [...memoryBoards.values()].map(({ blocks: _blocks, ...board }) => board) }))
app.post('/api/memory/boards', (req, res) => {
  const id = `board-${Date.now().toString(36)}`
  const board = { id, title: req.body?.title || 'Memory board', created_at: now(), updated_at: now(), blocks: [] }
  memoryBoards.set(id, board)
  sendJson(res, board)
})
app.get('/api/memory/boards/:id', (req, res) => sendJson(res, { blocks: memoryBoards.get(req.params.id)?.blocks || [] }))
app.patch('/api/memory/boards/:id', (req, res) => {
  const board = memoryBoards.get(req.params.id)
  if (!board) return res.status(404).json({ error: 'board not found' })
  if (Array.isArray(req.body?.blocks)) board.blocks = req.body.blocks
  if (req.body?.title) board.title = req.body.title
  board.updated_at = now()
  sendJson(res, board)
})
app.delete('/api/memory/boards/:id', (req, res) => {
  memoryBoards.delete(req.params.id)
  sendJson(res, { ok: true })
})
app.post('/api/memory/boards/:id/send-to-chronicle', (req, res) => sendJson(res, { ok: true, entry_id: `entry-${req.params.id}`, ...(req.body || {}) }))
app.get('/api/memory/sessions', (req, res) => sendJson(res, { sessions: memorySessions, total: memorySessions.length, limit: Number(req.query.limit || 50), offset: Number(req.query.offset || 0) }))
app.get('/api/memory/sessions/:id', (req, res) => sendJson(res, memorySessions.find((session) => session.id === req.params.id) || memorySessions[0]))
app.patch('/api/memory/sessions/:id/annotate', (req, res) => sendJson(res, { ok: true, id: req.params.id, ...(req.body || {}) }))
app.delete('/api/memory/sessions/:id', (_req, res) => sendJson(res, { ok: true }))
app.get('/api/memory/sessions/:id/rounds', (req, res) => sendJson(res, { rounds: [{ id: `round-${req.params.id}`, session_id: req.params.id, round_num: 1, user_input: 'Review FE CFL split.', step_count: 1, token_input: 1200, token_output: 640, duration_ms: 1200 }] }))
app.get('/api/memory/rounds/:id/steps', (req, res) => sendJson(res, { steps: [{ id: `step-${req.params.id}`, round_id: req.params.id, step_num: 1, type: 'response', tool_name: null, content: { text: 'CFL boundary captured.' } }] }))
app.post('/api/memory/import', (_req, res) => sendJson(res, { ok: true, imported: 0 }))
app.post('/api/memory/tags', (req, res) => sendJson(res, { success: true, name: req.body?.name || 'tag' }))

app.get('/api/chronicle', (_req, res) => sendJson(res, { milestones: [], entries: chronicleEntries, collections: [], collection_links: [], entry_links: [] }))
app.get('/api/chronicle/entries', (_req, res) => sendJson(res, chronicleEntries))
app.get('/api/chronicle/entries/:id', (req, res) => sendJson(res, { ...(chronicleEntries.find((entry) => entry.id === req.params.id) || chronicleEntries[0]), annotations: [] }))
app.get('/api/chronicle/milestones', (_req, res) => sendJson(res, []))
app.post('/api/chronicle/milestones', (req, res) => sendJson(res, { id: `milestone-${Date.now().toString(36)}`, title: req.body?.title || 'Milestone', description: null, version: 1, cover_start: null, cover_end: null, is_published: 0, published_at: null, created_at: now() }))
app.post('/api/chronicle/milestones/:id/publish', (req, res) => sendJson(res, { ok: true, id: req.params.id }))
app.delete('/api/chronicle/milestones/:id', (_req, res) => sendJson(res, { ok: true }))
app.get('/api/chronicle/collections', (_req, res) => sendJson(res, []))
app.get('/api/chronicle/collections/:id', (_req, res) => sendJson(res, { items: [] }))
app.post('/api/chronicle/collections', (req, res) => sendJson(res, { id: `collection-${Date.now().toString(36)}`, name: req.body?.name || 'Collection', description: null, cover_icon: null, milestone_id: null, parent_id: null, color: req.body?.color || '#6366f1', content: null, position_x: 0, position_y: 0, sort_order: 0, is_locked: 0, created_at: now() }))
app.patch('/api/chronicle/collections/:id', (req, res) => sendJson(res, { id: req.params.id, ...(req.body || {}) }))
app.delete('/api/chronicle/collections/:id', (_req, res) => sendJson(res, { ok: true }))
app.post('/api/chronicle/collections/:id/items', (req, res) => sendJson(res, { id: `item-${Date.now().toString(36)}`, collection_id: req.params.id, entry_id: req.body?.entry_id || 'entry-memory' }))
app.delete('/api/chronicle/collections/:id/items/:entryId', (_req, res) => sendJson(res, { ok: true }))
app.post('/api/chronicle/entries/:id/annotations', (req, res) => sendJson(res, { id: `annotation-${Date.now().toString(36)}`, entry_id: req.params.id, version: 1, content: req.body?.content || '', milestone_version: null, created_at: now() }))
app.post('/api/chronicle/entry-links', (req, res) => sendJson(res, { id: `link-${Date.now().toString(36)}`, ...(req.body || {}), draft_content: '', content: '', current_content_id: '', created_at: now(), updated_at: now() }))
app.delete('/api/chronicle/entry-links/:id', (_req, res) => sendJson(res, { ok: true }))

app.get('/api/auth/me', (_req, res) => sendJson(res, { id: 0, username: 'standalone', role: 'admin' }))
app.post('/api/auth/login', (_req, res) => sendJson(res, { token: 'standalone-token', user: { id: 0, username: 'standalone', role: 'admin' } }))
app.post('/api/auth/register', (_req, res) => sendJson(res, { requiresVerification: false, token: 'standalone-token', user: { id: 0, username: 'standalone', role: 'admin' } }))
app.get('/api/auth/check-email', (_req, res) => sendJson(res, { available: true }))
app.get('/api/auth/check-username', (_req, res) => sendJson(res, { available: true }))
app.post('/api/auth/verify-email', (_req, res) => sendJson(res, { ok: true }))
app.post('/api/auth/resend-code', (_req, res) => sendJson(res, { ok: true }))

app.get(['/seai/queue', '/seai/queue/'], (req, res) => {
  const state = req.query.state ? String(req.query.state) : ''
  sendJson(res, state ? queueItems.filter((item) => item.state === state) : queueItems)
})
app.post(['/seai/queue', '/seai/queue/'], (req, res) => {
  const item = {
    id: `queue-${Date.now().toString(36)}`,
    description: req.body?.description || 'Standalone queue item',
    v_criteria: req.body?.v_criteria || {},
    state: 'pending',
    assigned_node: null,
    output: null,
    v_score: null,
    error_msg: null,
    sort_order: req.body?.sort_order ?? Date.now(),
    created_at: now(),
    started_at: null,
    completed_at: null,
    layer: 'S',
    task_ref_id: null,
    resource_cost: null,
    state_tags: '[]',
  }
  queueItems.push(item)
  sendJson(res, item)
})
app.patch('/seai/queue/:id', (req, res) => {
  const item = queueItems.find((row) => row.id === req.params.id)
  if (!item) return res.status(404).json({ detail: 'queue item not found' })
  Object.assign(item, req.body || {})
  sendJson(res, item)
})
app.delete('/seai/queue/:id', (req, res) => {
  const index = queueItems.findIndex((row) => row.id === req.params.id)
  if (index >= 0) queueItems.splice(index, 1)
  sendJson(res, { ok: true })
})
app.get('/seai/queue/preconditions', (_req, res) => sendJson(res, queuePreconditions()))
app.get('/seai/state-ctrl/status', (_req, res) => sendJson(res, { is_running: true, is_paused: false, active_tasks: [], active_count: 0, pending_count: queueItems.length, running_count: 0, poll_interval: 5, last_poll_at: now() }))
app.get('/seai/state-ctrl/events', (_req, res) => sendJson(res, []))
app.post('/seai/state-ctrl/pause', (_req, res) => sendJson(res, { ok: true, is_paused: true }))
app.post('/seai/state-ctrl/resume', (_req, res) => sendJson(res, { ok: true, is_paused: false }))
app.get('/seai/state-ctrl/stream', (_req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  })
  const writeStatus = () => {
    res.write(`data: ${JSON.stringify({ is_running: true, is_paused: false, active_count: 0, pending_count: queueItems.length, running_count: 0, last_poll_at: now() })}\n\n`)
  }
  writeStatus()
  const id = setInterval(writeStatus, 5000)
  res.on('close', () => clearInterval(id))
})
app.post('/seai/plan/generate', (_req, res) => sendJson(res, {
  regen_count: 1,
  nodes: [
    { id: 'n1', db_id: 'plan-1', label: 'Clarify intent', dependencies: [] },
    { id: 'n2', db_id: 'plan-2', label: 'Validate CFL output', dependencies: ['n1'] },
  ],
}))
app.post('/seai/plan/:id/refine', (req, res) => sendJson(res, { description: req.body?.feedback || 'Refined standalone node' }))
app.post('/seai/plan/confirm', (_req, res) => sendJson(res, { ok: true, created: queueItems.length }))
app.get('/seai/e0/lifecycles', (_req, res) => sendJson(res, e0Lifecycles))
app.post('/seai/e0/lifecycles', (req, res) => {
  const lifecycle = { id: req.body?.id || `lc-${Date.now().toString(36)}`, name: req.body?.name || 'Lifecycle', description: req.body?.description || '', state: 'IDLE', enabled: 1, is_builtin: 0, updated_at: now() }
  e0Lifecycles.push(lifecycle)
  sendJson(res, lifecycle)
})
app.patch('/seai/e0/lifecycles/:id', (req, res) => {
  const lifecycle = e0Lifecycles.find((item) => item.id === req.params.id)
  if (!lifecycle) return res.status(404).json({ detail: 'lifecycle not found' })
  Object.assign(lifecycle, req.body || {}, { updated_at: now() })
  sendJson(res, lifecycle)
})
app.delete('/seai/e0/lifecycles/:id', (_req, res) => sendJson(res, { ok: true }))
app.post('/seai/e0/lifecycles/:id/state/transition', (req, res) => {
  const lifecycle = e0Lifecycles.find((item) => item.id === req.params.id)
  if (lifecycle) lifecycle.state = req.body?.to_state || lifecycle.state
  sendJson(res, lifecycle || { ok: true })
})
app.get('/seai/e0/components', (_req, res) => sendJson(res, e0Components))
app.post('/seai/e0/components', (req, res) => {
  const comp = { id: `comp-${Date.now().toString(36)}`, lifecycle_id: req.body?.lifecycle_id || 'e0', layer: req.body?.layer || 'P', sub_id: req.body?.sub_id || 'new', name: req.body?.name || 'New component', description: req.body?.description || '', status: 'active', config: {}, is_builtin: 0 }
  e0Components.push(comp)
  sendJson(res, comp)
})
app.patch('/seai/e0/components/:id', (req, res) => {
  const comp = e0Components.find((item) => item.id === req.params.id)
  if (!comp) return res.status(404).json({ detail: 'component not found' })
  Object.assign(comp, req.body || {})
  sendJson(res, comp)
})
app.delete('/seai/e0/components/:id', (_req, res) => sendJson(res, { ok: true }))
app.all('/seai/*', (req, res) => {
  if (req.method === 'GET') return sendJson(res, {})
  return sendJson(res, { ok: true })
})

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
