import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  Activity,
  Braces,
  CheckCircle2,
  CircleDot,
  Database,
  ExternalLink,
  GitBranch,
  Pause,
  Play,
  RotateCcw,
  ShieldCheck,
  Square,
  TimerReset,
  Workflow,
  XCircle,
} from 'lucide-react'
import { runtimeApi } from '@/lib/api/runtime'
import type { ControlInboxItem, PrvseObsidianGraphNode, PrvseRuntimeState, RelationEvent } from '@/types/runtime'

const POLL_MS = 5000

const UI = {
  bg: '#050508',
  white: '#f8f8f2',
  dim: '#6272a4',
  sep: '#44475a',
  l2: '#d4614e',
  l2Dark: '#C0341D',
  l1: '#8B62B8',
  l1Dark: '#6B3FA0',
  l0: '#2BC9A0',
  l0Dark: '#007A62',
  ok: '#50fa7b',
  warn: '#ffb86c',
  error: '#ff5555',
}

function stateColor(state: string) {
  if (state === 'alive') return UI.l0
  if (state === 'born') return UI.warn
  if (state === 'interrupted' || state === 'failed') return UI.error
  return UI.dim
}

function gateLabel(state: PrvseRuntimeState | null) {
  if (!state) return 'core offline'
  if (!state.governance.loaded) return '三思未加载'
  if (state.last_stand.provider_pool_exhausted) return 'provider exhausted'
  if (state.runtime_s.v_strikes >= 3) return 'third failure'
  return 'last stand open'
}

function eventToNodeId(event: RelationEvent) {
  const details = event.details ?? {}
  return String(details.id ?? details.tag_id ?? details.file ?? event.source)
}

function inboxRoute(item: ControlInboxItem) {
  if (item.source.includes('resource_exhausted')) return 'ResourceTierVisual + BudgetFormVisual'
  if (item.source.includes('provider')) return 'EntityCard + SpeedProbe'
  if (item.source === 'boot_degraded') return 'SStepList'
  if (item.source === 'third_same_failure') return 'VNotificationCard'
  if (item.source === 'structural_contradiction') return 'VRewardVisual'
  return 'VQueue'
}

export default function RuntimeSOverlay() {
  const [state, setState] = useState<PrvseRuntimeState | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [selectedInbox, setSelectedInbox] = useState<ControlInboxItem | null>(null)
  const [selectedTrace, setSelectedTrace] = useState<RelationEvent | null>(null)
  const [paused, setPaused] = useState(false)
  const [speed, setSpeed] = useState(1)

  const poll = useCallback(async () => {
    if (paused) return
    try {
      setState(await runtimeApi.getPrvseState())
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'runtime S unavailable')
    }
  }, [paused])

  useEffect(() => {
    poll()
    const id = window.setInterval(poll, POLL_MS)
    return () => window.clearInterval(id)
  }, [poll])

  const run = async (label: string, fn: () => Promise<unknown>) => {
    setBusy(label)
    try {
      await fn()
      await poll()
    } catch (e) {
      setError(e instanceof Error ? e.message : `${label} failed`)
    } finally {
      setBusy(null)
    }
  }

  const status = state?.runtime_s.state ?? 'dead'
  const cfls = state?.cfl_registry ?? []
  const providers = state?.last_stand.provider_plan ?? []
  const unresolved = state?.inbox.unresolved ?? 0
  const running = cfls.filter(cfl => cfl.runtime_status === 'running').length
  const trace = useMemo(() => {
    let syncSeen = false
    return (state?.trace.relation_events ?? [])
      .filter(event => {
        if (event.type !== 'obsidian_sync_updated') return true
        if (syncSeen) return false
        syncSeen = true
        return true
      })
      .slice(0, 16)
  }, [state])
  const gates = useMemo(() => {
    const anyRunning = running > 0 || status === 'alive'
    return [
      { id: 'Shape', label: 'Shape', ok: cfls.length > 0, color: UI.l2 },
      { id: 'Type', label: 'Type', ok: cfls.every(cfl => cfl.tag_id.startsWith('tag-')), color: UI.l1 },
      { id: 'Execution', label: 'Execution', ok: anyRunning, color: anyRunning ? UI.l0 : UI.warn },
      { id: 'Value', label: 'Value', ok: (state?.runtime_s.v_strikes ?? 0) < 3, color: (state?.runtime_s.v_strikes ?? 0) < 3 ? UI.ok : UI.error },
    ]
  }, [cfls, running, state, status])

  return (
    <>
      <div className="absolute left-4 top-[58px] z-20 w-[min(380px,calc(100vw-2rem))] select-none">
        <Panel>
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Activity size={13} style={{ color: stateColor(status) }} />
                <span className="text-[11px] font-mono text-white/70">runtime S</span>
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: stateColor(status) }} />
              </div>
              <div className="mt-0.5 truncate text-[10px] font-mono text-white/25">
                {status} · {gateLabel(state)}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <IconButton title="Activate last stand" onClick={() => run('activate', runtimeApi.activateLastStand)}><Play size={12} /></IconButton>
              <IconButton title="Restart runtime" onClick={() => run('restart', runtimeApi.restartRuntime)}><RotateCcw size={12} /></IconButton>
              <IconButton title="Stop runtime" onClick={() => run('stop', runtimeApi.stopRuntime)}><Square size={12} /></IconButton>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-4 gap-2">
            <Metric icon={<CircleDot size={12} />} label="CFL" value={`${running}/${cfls.length}`} color={UI.l0} />
            <Metric icon={<ShieldCheck size={12} />} label="V" value={`${state?.runtime_s.v_pass ?? 0}/${state?.runtime_s.v_fail ?? 0}`} color={UI.l1} />
            <button onClick={() => setSelectedInbox(state?.inbox.items.find(i => !i.resolved) ?? state?.inbox.items[0] ?? null)}>
              <Metric icon={<Database size={12} />} label="Inbox" value={String(unresolved)} color={unresolved ? UI.error : UI.dim} />
            </button>
            <Metric icon={<Activity size={12} />} label="API" value={String(providers.length)} color={UI.warn} />
          </div>

          <div className="mt-3 grid grid-cols-4 gap-1.5">
            {gates.map(gate => (
              <div key={gate.id} className="border px-2 py-1.5" style={{ borderColor: `${gate.color}35`, background: `${gate.color}10` }}>
                <div className="flex items-center gap-1">
                  {gate.ok ? <CheckCircle2 size={10} style={{ color: gate.color }} /> : <XCircle size={10} style={{ color: UI.error }} />}
                  <span className="truncate text-[9px] font-mono text-white/45">{gate.label}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 space-y-1.5">
            {cfls.slice(0, 4).map(cfl => (
              <div key={cfl.id} className="flex items-center justify-between gap-2 text-[10px] font-mono">
                <span className="min-w-0 truncate text-white/35">[[{cfl.id}]]</span>
                <span style={{ color: stateColor(cfl.runtime_status === 'running' ? 'alive' : cfl.runtime_status) }}>{cfl.runtime_status}</span>
              </div>
            ))}
          </div>

          {(busy || error) && (
            <div className="mt-2 truncate text-[10px] font-mono" style={{ color: error ? UI.error : UI.warn }}>
              {busy ? `${busy}...` : error}
            </div>
          )}
        </Panel>
      </div>

      <div className="absolute right-4 top-[96px] z-20 w-[min(390px,calc(100vw-2rem))] select-none">
        <Panel>
          <div className="mb-2 flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-white/70">
                <GitBranch size={13} style={{ color: UI.l1 }} />
                Obsidian 双链 Graph
              </div>
              <div className="mt-0.5 truncate text-[10px] font-mono text-white/25">{state?.obsidian.vault_path ?? 'vault pending'}</div>
            </div>
            {state?.obsidian.obsidian_uri && (
              <a href={state.obsidian.obsidian_uri} className="flex h-7 w-7 items-center justify-center border border-white/[0.08] bg-white/[0.04] text-white/45 hover:text-white/75" title="Open Obsidian">
                <ExternalLink size={12} />
              </a>
            )}
          </div>
          <ObsidianGraph nodes={state?.obsidian.graph_nodes ?? []} />
          <div className="mt-2 flex items-center justify-between gap-2 text-[10px] font-mono">
            <span style={{ color: state?.obsidian.status === 'synced' ? UI.ok : UI.warn }}>
              {state?.obsidian.status ?? 'pending'} · {state?.obsidian.markdown_files ?? 0} md
            </span>
            <button onClick={() => run('obsidian-sync', runtimeApi.syncObsidian)} className="text-white/35 hover:text-white/70">
              sync
            </button>
          </div>
        </Panel>
      </div>

      <div className="absolute bottom-4 left-1/2 z-20 w-[min(760px,calc(100vw-2rem))] -translate-x-1/2 select-none">
        <Panel>
          <div className="mb-2 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[11px] font-mono text-white/70">
              <TimerReset size={13} style={{ color: UI.l0 }} />
              Chronicle trace replay
            </div>
            <div className="flex items-center gap-1">
              <IconButton title={paused ? 'Resume trace' : 'Pause trace'} onClick={() => setPaused(v => !v)}>{paused ? <Play size={11} /> : <Pause size={11} />}</IconButton>
              {[1, 2, 4].map(value => (
                <button key={value} onClick={() => setSpeed(value)} className="h-6 px-2 text-[10px] font-mono" style={{ color: speed === value ? UI.l0 : UI.dim }}>
                  {value}x
                </button>
              ))}
            </div>
          </div>
          <div className="relative h-14 overflow-hidden">
            <div className="absolute left-0 right-0 top-7 h-px" style={{ background: `${UI.sep}99` }} />
            <div className="flex h-full items-center gap-3 overflow-x-auto pb-1">
              {trace.map((event, index) => (
                <button key={`${event.timestamp}-${index}`} onClick={() => setSelectedTrace(event)} className="group relative flex min-w-[96px] flex-col items-center">
                  <span className="h-2.5 w-2.5 rounded-full border" style={{ borderColor: UI.l0, background: selectedTrace === event ? UI.l0 : UI.bg }} />
                  <span className="mt-2 max-w-[92px] truncate text-[9px] font-mono text-white/35 group-hover:text-white/70">{event.type}</span>
                  <span className="max-w-[92px] truncate text-[8px] font-mono text-white/20">[[{eventToNodeId(event)}]]</span>
                </button>
              ))}
              {trace.length === 0 && <span className="text-[10px] font-mono text-white/25">waiting for chronicle events</span>}
            </div>
          </div>
        </Panel>
      </div>

      {selectedInbox && (
        <FloatingCard title="Inbox overlay route" onClose={() => setSelectedInbox(null)}>
          <div className="text-[11px] font-mono text-white/60">[[{selectedInbox.source}]]</div>
          <div className="mt-2 text-[10px] leading-relaxed text-white/35">{selectedInbox.reason}</div>
          <div className="mt-3 border px-2 py-2 text-[10px] font-mono" style={{ borderColor: `${UI.l2}40`, color: UI.l2 }}>
            {inboxRoute(selectedInbox)}
          </div>
          <button
            onClick={() => run('resolve-inbox', () => runtimeApi.resolveInbox(selectedInbox.id, 'continue', 'resolved from PRVSE World overlay')).then(() => setSelectedInbox(null))}
            className="mt-3 w-full border px-3 py-2 text-[10px] font-mono text-white/65 hover:text-white"
            style={{ borderColor: `${UI.l0}40`, background: `${UI.l0}10` }}
          >
            resolve → core
          </button>
        </FloatingCard>
      )}

      {selectedTrace && (
        <FloatingCard title="R evidence trace" onClose={() => setSelectedTrace(null)}>
          <div className="text-[11px] font-mono" style={{ color: UI.l0 }}>{selectedTrace.type}</div>
          <div className="mt-1 text-[10px] font-mono text-white/35">[[{eventToNodeId(selectedTrace)}]] · {selectedTrace.source}</div>
          <pre className="mt-3 max-h-40 overflow-auto whitespace-pre-wrap border border-white/[0.08] bg-black/25 p-2 text-[10px] text-white/45">
            {JSON.stringify(selectedTrace.details, null, 2)}
          </pre>
        </FloatingCard>
      )}
    </>
  )
}

function Panel({ children }: { children: ReactNode }) {
  return (
    <div className="border bg-[#050508]/90 p-3 shadow-2xl backdrop-blur-md" style={{ borderColor: 'rgba(248,248,242,0.08)' }}>
      {children}
    </div>
  )
}

function IconButton({ children, title, onClick }: { children: ReactNode; title: string; onClick: () => void }) {
  return (
    <button onClick={onClick} title={title} className="flex h-7 w-7 items-center justify-center border border-white/[0.08] bg-white/[0.04] text-white/40 hover:text-white/70">
      {children}
    </button>
  )
}

function Metric({ icon, label, value, color }: { icon: ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="min-w-0 border border-white/[0.06] bg-white/[0.025] px-2 py-1.5 text-left">
      <div className="flex items-center gap-1" style={{ color }}>
        {icon}
        <span className="text-[9px] font-mono">{label}</span>
      </div>
      <div className="mt-1 truncate text-[11px] font-mono text-white/65">{value}</div>
    </div>
  )
}

function ObsidianGraph({ nodes }: { nodes: PrvseObsidianGraphNode[] }) {
  const visible = nodes.slice(0, 10)
  const center = { x: 180, y: 88 }
  const placed = visible.map((node, index) => {
    const layerRadius = node.layer === 'L2' ? 48 : node.layer === 'L1' ? 78 : 108
    const angle = (index / Math.max(visible.length, 1)) * Math.PI * 2 - Math.PI / 2
    return {
      node,
      x: center.x + Math.cos(angle) * layerRadius,
      y: center.y + Math.sin(angle) * layerRadius * 0.62,
      color: node.layer === 'L2' ? UI.l2 : node.layer === 'L1' ? UI.l1 : UI.l0,
    }
  })
  return (
    <svg viewBox="0 0 360 176" className="h-[176px] w-full border border-white/[0.06] bg-black/20">
      <ellipse cx={center.x} cy={center.y} rx="55" ry="33" fill="none" stroke={UI.l2} strokeOpacity="0.22" />
      <ellipse cx={center.x} cy={center.y} rx="86" ry="53" fill="none" stroke={UI.l1} strokeOpacity="0.18" />
      <ellipse cx={center.x} cy={center.y} rx="118" ry="73" fill="none" stroke={UI.l0} strokeOpacity="0.14" />
      {placed.map(({ node, x, y, color }) => (
        <g key={`edge-${node.id}`}>
          <line x1={center.x} y1={center.y} x2={x} y2={y} stroke={color} strokeOpacity="0.18" />
        </g>
      ))}
      <circle cx={center.x} cy={center.y} r="11" fill={UI.l1Dark} stroke={UI.l1} strokeOpacity="0.8" />
      <text x={center.x} y={center.y + 25} textAnchor="middle" fontSize="8" fill={UI.dim} fontFamily="monospace">[[Runtime S]]</text>
      {placed.map(({ node, x, y, color }) => (
        <g key={node.id}>
          <circle cx={x} cy={y} r={node.layer === 'L2' ? 8 : node.layer === 'L1' ? 6 : 4} fill={color} fillOpacity="0.8" />
          <text x={x} y={y + 14} textAnchor="middle" fontSize="7" fill={UI.white} fillOpacity="0.46" fontFamily="monospace">
            {node.title.length > 16 ? `${node.title.slice(0, 15)}…` : node.title}
          </text>
        </g>
      ))}
    </svg>
  )
}

function FloatingCard({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return (
    <div className="absolute left-1/2 top-1/2 z-40 w-[min(420px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2">
      <div className="border bg-[#050508]/95 p-4 shadow-2xl backdrop-blur-md" style={{ borderColor: `${UI.l1}55` }}>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] font-mono text-white/70">
            <Workflow size={13} style={{ color: UI.l1 }} />
            {title}
          </div>
          <button onClick={onClose} className="text-white/35 hover:text-white/70"><Braces size={13} /></button>
        </div>
        {children}
      </div>
    </div>
  )
}
