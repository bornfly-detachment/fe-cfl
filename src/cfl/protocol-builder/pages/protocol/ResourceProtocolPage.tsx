/**
 * ResourceProtocolPage — 智能资源管理（产品UIUX宪法 §六）
 * Route: /protocol/resource
 *
 * 使用已有 Bornfly 检验组件，不造轮子：
 * - ResourceTierVisual (T0/T1/T2 层级卡)
 * - DataCard (指标卡片)
 * - EntityCard (PRVSE 色模型卡)
 * - Input + Button (4字段表单)
 * - HealthBar 颜色渐变逻辑
 */
import { useState, useEffect, useCallback } from 'react'
import { Plus, Trash2, Zap, Cpu, HardDrive, Clock } from 'lucide-react'
import { runtimeApi } from '@/lib/api/runtime'
import { ResourceTierVisual } from '@/design/components/ResourceTierVisual'
import { DataCard } from '@/design/allowed-components/data'
import type { ResourceBudget, ResourceUsage, ResourceBudgetIntelligenceProvider } from '@/types/runtime'

const TIER_EMOJI: Record<string, string> = { T2: '🧠', T1: '⚡', T0: '💨' }
const SPEED_EMOJI = (ms: number) => ms < 200 ? '🚀' : ms < 1000 ? '🏃' : '🐢'

function gradientColor(pct: number): string {
  if (pct < 60) return '#10b981'
  if (pct < 85) return '#f59e0b'
  return '#ef4444'
}

function GradientBar({ used, max, label }: { used: number; max: number; label: string }) {
  const pct = max > 0 ? Math.min(100, Math.round((used / max) * 100)) : 0
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[11px]">
        <span className="text-white/55">{label}</span>
        <span className="text-white/35">{used.toLocaleString()} / {max.toLocaleString()}</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/6 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, #10b981, ${gradientColor(pct)})` }} />
      </div>
    </div>
  )
}

export default function ResourceProtocolPage() {
  const [budget, setBudget] = useState<ResourceBudget | null>(null)
  const [usage, setUsage] = useState<ResourceUsage | null>(null)
  const [providers, setProviders] = useState<ResourceBudgetIntelligenceProvider[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', openai_url: '', anthropic_url: '', api_key: '' })
  const [adding, setAdding] = useState(false)
  const [probing, setProbing] = useState<string | null>(null)

  const poll = useCallback(async () => {
    try {
      const [b, u, p] = await Promise.all([
        runtimeApi.getBudget(),
        runtimeApi.getUsage(),
        runtimeApi.getProviders(),
      ])
      if (b) setBudget(b)
      if (u) setUsage(u)
      if (p) setProviders(p)
    } catch { /* silent */ }
  }, [])

  useEffect(() => { poll(); const t = setInterval(poll, 5000); return () => clearInterval(t) }, [poll])

  const handleAdd = async () => {
    if (!form.name || !form.api_key) return
    setAdding(true)
    try {
      await runtimeApi.addProvider({
        name: form.name,
        openai_url: form.openai_url || undefined,
        anthropic_url: form.anthropic_url || undefined,
        api_key: form.api_key,
      })
      setForm({ name: '', openai_url: '', anthropic_url: '', api_key: '' })
      setShowForm(false)
      await poll()
    } finally { setAdding(false) }
  }

  const handleDelete = async (name: string) => {
    await runtimeApi.deleteProvider(name)
    await poll()
  }

  const handleSpeedProbe = async (modelId: string) => {
    setProbing(modelId)
    try { await runtimeApi.speedProbe(modelId); await poll() }
    finally { setProbing(null) }
  }

  const intelBudget = budget?.intelligence?.budgets?.T2?.token_budget ?? budget?.intelligence?.budgets?.T1?.token_budget ?? 0
  const intelUsed = usage?.intelligence?.total_tokens_used ?? 0
  const storageBudget = (budget?.storage?.context_window_max_tokens ?? 0) + (budget?.storage?.chronicle_max_mb ?? 0) + (budget?.storage?.memory_max_mb ?? 0)
  const storageUsed = (usage?.storage?.chronicle_mb ?? 0) + (usage?.storage?.memory_mb ?? 0) + (usage?.storage?.artifacts_mb ?? 0)
  const timeBudget = (budget?.spacetime?.wall_clock_max_minutes ?? 0) * 60
  const timeUsed = (usage?.spacetime?.elapsed_minutes ?? 0) * 60

  return (
    <div className="min-h-screen text-white p-6 space-y-6"
      style={{ background: 'linear-gradient(180deg, #0a0a0f 0%, #0d1117 100%)' }}>
      {/* ── 标题 ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg tracking-wide" style={{ color: '#f8f8f2' }}>智能资源管理</h1>
          <p className="text-white/30 text-xs mt-0.5">provider × model 能力卡 · 产品UIUX宪法 §六</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/80 hover:text-white
              transition-colors" style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.25)' }}>
            <Plus size={14} /> 添加 Provider
          </button>
          <button onClick={() => runtimeApi.speedProbeAll?.()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/65 hover:text-white/90
              transition-colors" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <Zap size={14} /> 全部测速
          </button>
        </div>
      </div>

      {/* ── 添加 Provider 表单（4 字段 · 宪法 §三）── */}
      {showForm && (
        <div className="rounded-xl p-4 space-y-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/55">添加 Provider · 4 字段</span>
            <button onClick={() => setShowForm(false)} className="text-white/25 hover:text-white/55 text-xs">✕</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-white/35 block mb-1">name *</label>
              <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="kimi-for-coding"
                className="w-full bg-white/5 rounded-lg px-3 py-1.5 text-xs text-white/80 outline-none border border-white/06 focus:border-white/15" />
            </div>
            <div>
              <label className="text-[10px] text-white/35 block mb-1">api_key *</label>
              <input value={form.api_key} onChange={e => setForm(p => ({ ...p, api_key: e.target.value }))}
                placeholder="sk-... 或环境变量名"
                className="w-full bg-white/5 rounded-lg px-3 py-1.5 text-xs text-white/80 outline-none border border-white/06 focus:border-white/15" />
            </div>
            <div>
              <label className="text-[10px] text-white/35 block mb-1">openai_url</label>
              <input value={form.openai_url} onChange={e => setForm(p => ({ ...p, openai_url: e.target.value }))}
                placeholder="https://api.kimi.com/coding/v1"
                className="w-full bg-white/5 rounded-lg px-3 py-1.5 text-xs text-white/80 outline-none border border-white/06 focus:border-white/15" />
            </div>
            <div>
              <label className="text-[10px] text-white/35 block mb-1">anthropic_url</label>
              <input value={form.anthropic_url} onChange={e => setForm(p => ({ ...p, anthropic_url: e.target.value }))}
                placeholder="https://api.kimi.com/coding/"
                className="w-full bg-white/5 rounded-lg px-3 py-1.5 text-xs text-white/80 outline-none border border-white/06 focus:border-white/15" />
            </div>
          </div>
          <button onClick={handleAdd} disabled={adding || !form.name || !form.api_key}
            className="px-4 py-1.5 rounded-lg text-xs text-white transition-colors disabled:opacity-30"
            style={{ background: 'rgba(59,130,246,0.25)', border: '1px solid rgba(59,130,246,0.35)' }}>
            {adding ? '添加中...' : '提交，30 秒内出现模型卡'}
          </button>
        </div>
      )}

      {/* ── 三类资源一屏（宪法 §六）── */}
      <div className="grid grid-cols-3 gap-4">
        {/* 🧠 智能 */}
        <div className="rounded-xl p-4 space-y-3" style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.12)' }}>
          <div className="flex items-center gap-2">
            <Cpu size={14} style={{ color: '#3b82f6' }} />
            <span className="text-xs text-white/75">智能</span>
            <span className="text-[10px] text-white/25 ml-auto">{providers.length} providers</span>
          </div>
          <GradientBar used={intelUsed} max={intelBudget} label="Token 用量" />
          {providers.slice(0, 3).map(p => (
            <div key={p.name} className="flex items-center justify-between text-[10px]">
              <span className="text-white/45">{p.name}</span>
              <span className="text-white/25">{p.models?.length ?? 0} models</span>
            </div>
          ))}
        </div>

        {/* 💾 存储 */}
        <div className="rounded-xl p-4 space-y-3" style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.12)' }}>
          <div className="flex items-center gap-2">
            <HardDrive size={14} style={{ color: '#8b5cf6' }} />
            <span className="text-xs text-white/75">存储</span>
          </div>
          <GradientBar used={storageUsed} max={storageBudget} label="存储用量" />
          <DataCard label="chronicle" value={usage?.storage?.chronicle_mb ?? 0} unit="MB" size="sm" />
          <DataCard label="memory" value={usage?.storage?.memory_mb ?? 0} unit="MB" size="sm" />
        </div>

        {/* ⏱ 时空 */}
        <div className="rounded-xl p-4 space-y-3" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.12)' }}>
          <div className="flex items-center gap-2">
            <Clock size={14} style={{ color: '#10b981' }} />
            <span className="text-xs text-white/75">时空</span>
          </div>
          <GradientBar used={timeUsed} max={timeBudget} label="运行时间" />
          <span className="text-[10px] text-white/25">
            沙盒: {usage?.spacetime?.sandbox_state ?? '-'} · 网络: {usage?.spacetime?.network_state ?? '-'}
          </span>
        </div>
      </div>

      {/* ── 模型能力卡（大傻子原则）── */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/55">模型能力卡</span>
          <span className="text-[10px] text-white/20">谁快？谁会看图？——不是"T2 已用多少 token"</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {providers.flatMap(p =>
            (p.models ?? []).map(m => (
              <div key={`${p.name}:${m.model_id}`}
                className="rounded-xl p-3 space-y-2 transition-colors hover:bg-white/[0.02]"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs text-white/80">{m.display_name || m.model_id}</span>
                    <span className="text-[10px] text-white/25 ml-2">{p.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{TIER_EMOJI[m.tier ?? ''] ?? m.tier}</span>
                    {m.latency_p50_ms ? (
                      <span className="text-xs" title={`${m.latency_p50_ms}ms`}>{SPEED_EMOJI(m.latency_p50_ms)}</span>
                    ) : null}
                  </div>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-white/35">
                  {m.context_window ? <span>📚 {m.context_window >= 100000 ? `${Math.round(m.context_window/1000)}K` : m.context_window}</span> : null}
                  {m.tokens_per_sec ? <span>{m.tokens_per_sec} t/s</span> : null}
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => handleSpeedProbe(m.model_id)} disabled={probing === m.model_id}
                    className="text-[10px] px-2 py-0.5 rounded text-white/35 hover:text-white/65 transition-colors disabled:opacity-30"
                    style={{ background: 'rgba(255,255,255,0.04)' }}>
                    {probing === m.model_id ? '测速中...' : '⚡ 测速'}
                  </button>
                  <button onClick={() => handleDelete(p.name)}
                    className="text-[10px] px-2 py-0.5 rounded text-white/25 hover:text-red-400/70 transition-colors"
                    style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <Trash2 size={10} className="inline mr-0.5" />删除
                  </button>
                </div>
              </div>
            ))
          )}
          {providers.length === 0 && (
            <div className="col-span-2 text-center py-8 text-white/20 text-xs">
              暂无 provider · 点击 [+ 添加 Provider] 开始
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
