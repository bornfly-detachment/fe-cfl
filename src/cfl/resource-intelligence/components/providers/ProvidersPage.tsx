import { useCallback, useEffect, useMemo, useState } from 'react'
import { authFetch } from '../../lib/http'

type ModelTier = 'T0' | 'T1' | 'T2'
type ModelStatus = 'active' | 'unauthorized' | 'rate_limited' | 'unreachable'

interface ModelCard {
  display_name: string
  model_id: string
  provider: string
  tier: ModelTier
  context_length: number
  multimodal_native: boolean
  multimodal_types: string[]
  latency_p50_ms: number | null
  tokens_per_sec: number | null
  usage_query_supported: boolean
  status: ModelStatus
  last_pinged_at: number | null
}

interface Provider {
  name: string
  openai_url?: string
  anthropic_url?: string
  api_key?: string
  api_key_env?: string
  protocol?: 'openai' | 'anthropic' | 'auto'
  models: ModelCard[]
}

interface NewProviderForm {
  name: string
  openai_url: string
  anthropic_url: string
  api_key: string
}

const EMPTY_FORM: NewProviderForm = {
  name: '',
  openai_url: '',
  anthropic_url: '',
  api_key: '',
}

// 宪法 §四 4.4：层级图标
function tierIcon(tier: ModelTier): { icon: string; label: string } {
  switch (tier) {
    case 'T0':
      return { icon: '🧠', label: '顶级推理' }
    case 'T1':
      return { icon: '⚡', label: '主力工作' }
    case 'T2':
      return { icon: '💨', label: '快速搜索' }
  }
}

// 宪法 §四 4.4：速度图标（<200ms 🚀 / <1s 🏃 / >1s 🐢）
function speedBadge(latency: number | null): { icon: string; label: string; tooltip: string } {
  if (latency === null) return { icon: '⏳', label: '未测速', tooltip: '点击 ⚡ 重测来测量延迟' }
  if (latency < 200) return { icon: '🚀', label: '很快', tooltip: `${latency}ms` }
  if (latency < 1000) return { icon: '🏃', label: '中等', tooltip: `${latency}ms` }
  return { icon: '🐢', label: '慢', tooltip: `${latency}ms` }
}

// 宪法 §四 4.4：多模态图标
function multimodalBadge(model: ModelCard): { icon: string; label: string } {
  if (model.multimodal_native) return { icon: '🖼', label: '会看图' }
  if (model.multimodal_types.includes('two-step')) return { icon: '🖼²', label: '两步看图' }
  return { icon: '📝', label: '纯文字' }
}

function formatContext(ctx: number): string {
  if (!ctx) return '未知'
  if (ctx >= 1_000_000) return `${(ctx / 1_000_000).toFixed(1)}M`
  if (ctx >= 1000) return `${Math.round(ctx / 1000)}K`
  return `${ctx}`
}

function statusBadge(status: ModelStatus): { color: string; label: string } {
  switch (status) {
    case 'active':
      return { color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', label: '可用' }
    case 'unauthorized':
      return { color: 'bg-rose-500/15 text-rose-300 border-rose-500/30', label: '需鉴权' }
    case 'rate_limited':
      return { color: 'bg-amber-500/15 text-amber-300 border-amber-500/30', label: '限流' }
    case 'unreachable':
      return { color: 'bg-slate-500/15 text-slate-400 border-slate-500/30', label: '不可达' }
  }
}

function ModelCardView({ model, onProbeSpeed }: { model: ModelCard; onProbeSpeed: (modelId: string) => void }) {
  const tier = tierIcon(model.tier)
  const speed = speedBadge(model.latency_p50_ms)
  const multi = multimodalBadge(model)
  const status = statusBadge(model.status)

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:bg-white/[0.05]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-base font-semibold text-white">
            <span title={tier.label} className="text-2xl leading-none">{tier.icon}</span>
            <span className="truncate">{model.display_name}</span>
          </div>
          <div className="mt-1 font-mono text-xs text-slate-500">{model.model_id}</div>
        </div>
        <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-medium ${status.color}`}>
          {status.label}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 text-sm">
        <div title={tier.label} className="flex flex-col items-center gap-1 rounded-lg bg-white/[0.04] py-2">
          <span className="text-xl leading-none">{tier.icon}</span>
          <span className="text-[10px] text-slate-400">{tier.label}</span>
        </div>
        <div title={multi.label} className="flex flex-col items-center gap-1 rounded-lg bg-white/[0.04] py-2">
          <span className="text-xl leading-none">{multi.icon}</span>
          <span className="text-[10px] text-slate-400">{multi.label}</span>
        </div>
        <div title={speed.tooltip} className="flex flex-col items-center gap-1 rounded-lg bg-white/[0.04] py-2">
          <span className="text-xl leading-none">{speed.icon}</span>
          <span className="text-[10px] text-slate-400">{speed.label}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
        <div>
          <span className="text-slate-500">上下文：</span>
          <span className="text-slate-300">{formatContext(model.context_length)}</span>
        </div>
        <button
          type="button"
          onClick={() => onProbeSpeed(model.model_id)}
          className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-slate-200 transition-colors hover:bg-white/[0.08]"
          title="重新测速（探测延迟和吞吐）"
        >
          ⚡ 重测
        </button>
      </div>
    </div>
  )
}

function ProviderSection({
  provider,
  onProbeSpeed,
  onDelete,
}: {
  provider: Provider
  onProbeSpeed: (modelId: string) => void
  onDelete: (name: string) => void
}) {
  const proto = provider.protocol === 'anthropic' ? 'Anthropic' : provider.protocol === 'openai' ? 'OpenAI 兼容' : 'Auto'
  return (
    <section className="rounded-3xl border border-white/10 bg-[#1f1f1d] px-8 py-7 shadow-[0_24px_60px_rgba(0,0,0,0.18)]">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-semibold tracking-tight text-white">{provider.name}</h2>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-xs text-slate-300">
              {proto}
            </span>
            <span className="text-xs text-slate-500">{provider.models.length} 个模型</span>
          </div>
          <div className="mt-2 space-y-0.5 text-xs text-slate-500">
            {provider.openai_url ? <div className="font-mono">openai: {provider.openai_url}</div> : null}
            {provider.anthropic_url ? <div className="font-mono">anthropic: {provider.anthropic_url}</div> : null}
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            if (window.confirm(`删除 provider "${provider.name}"？\n（chronicle 历史保留，宪法 §四 4.1）`)) {
              onDelete(provider.name)
            }
          }}
          className="shrink-0 rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-1.5 text-xs text-rose-200 transition-colors hover:bg-rose-500/20"
        >
          🗑 删除
        </button>
      </header>

      {provider.models.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] py-12 text-center text-sm text-slate-500">
          还没有探测到模型 — 点击 ⚡ 测速触发探测
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {provider.models.map((m) => (
            <ModelCardView key={m.model_id} model={m} onProbeSpeed={onProbeSpeed} />
          ))}
        </div>
      )}
    </section>
  )
}

function AddProviderForm({
  onSubmit,
  onCancel,
  submitting,
}: {
  onSubmit: (form: NewProviderForm) => Promise<void>
  onCancel: () => void
  submitting: boolean
}) {
  const [form, setForm] = useState<NewProviderForm>(EMPTY_FORM)
  const [error, setError] = useState<string | null>(null)

  const valid = form.name.trim() && form.api_key.trim() && (form.openai_url.trim() || form.anthropic_url.trim())

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!valid) {
      setError('必填：name + api_key + 至少一个 url')
      return
    }
    try {
      await onSubmit(form)
      setForm(EMPTY_FORM)
    } catch (err) {
      setError(err instanceof Error ? err.message : '提交失败')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-emerald-500/20 bg-emerald-500/[0.04] px-8 py-7"
    >
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">+ 添加 Provider</h3>
        <span className="text-xs text-slate-400">宪法 §三：4 个字段</span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <div className="mb-1 text-sm font-medium text-slate-300">name <span className="text-rose-400">*</span></div>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="如：deepseek、kimi-coding"
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-emerald-400/40 focus:outline-none"
          />
        </label>

        <label className="block">
          <div className="mb-1 text-sm font-medium text-slate-300">api_key <span className="text-rose-400">*</span></div>
          <input
            type="text"
            value={form.api_key}
            onChange={(e) => setForm({ ...form, api_key: e.target.value })}
            placeholder="sk-... 或环境变量名"
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 font-mono text-sm text-white placeholder:text-slate-600 focus:border-emerald-400/40 focus:outline-none"
          />
        </label>

        <label className="block md:col-span-2">
          <div className="mb-1 text-sm font-medium text-slate-300">openai_url <span className="text-slate-500 text-xs">（与 anthropic_url 至少填一个）</span></div>
          <input
            type="text"
            value={form.openai_url}
            onChange={(e) => setForm({ ...form, openai_url: e.target.value })}
            placeholder="https://api.deepseek.com"
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 font-mono text-sm text-white placeholder:text-slate-600 focus:border-emerald-400/40 focus:outline-none"
          />
        </label>

        <label className="block md:col-span-2">
          <div className="mb-1 text-sm font-medium text-slate-300">anthropic_url</div>
          <input
            type="text"
            value={form.anthropic_url}
            onChange={(e) => setForm({ ...form, anthropic_url: e.target.value })}
            placeholder="https://api.deepseek.com/anthropic"
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 font-mono text-sm text-white placeholder:text-slate-600 focus:border-emerald-400/40 focus:outline-none"
          />
        </label>
      </div>

      {error ? <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-sm text-rose-200">{error}</div> : null}

      <div className="mt-6 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-2 text-sm text-slate-300 hover:bg-white/[0.08]"
        >
          取消
        </button>
        <button
          type="submit"
          disabled={!valid || submitting}
          className="rounded-full bg-emerald-500/90 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-600"
        >
          {submitting ? '添加中…' : '添加 Provider'}
        </button>
      </div>
    </form>
  )
}

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [probing, setProbing] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      setError(null)
      const data = await authFetch<Provider[]>('/resources/intelligence/providers')
      setProviders(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载 providers 失败')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const handleAdd = async (form: NewProviderForm) => {
    setSubmitting(true)
    try {
      const payload: Record<string, string> = {
        name: form.name.trim(),
        api_key: form.api_key.trim(),
      }
      if (form.openai_url.trim()) payload.openai_url = form.openai_url.trim()
      if (form.anthropic_url.trim()) payload.anthropic_url = form.anthropic_url.trim()
      await authFetch('/resources/intelligence/providers', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      await load()
      setShowForm(false)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (name: string) => {
    try {
      await authFetch(`/resources/intelligence/providers/${encodeURIComponent(name)}`, { method: 'DELETE' })
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : '删除失败')
    }
  }

  const handleProbeSpeed = async (modelId: string) => {
    setProbing(modelId)
    try {
      await authFetch(`/resources/intelligence/speed-probe/${encodeURIComponent(modelId)}`, { method: 'POST' })
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : `测速 ${modelId} 失败`)
    } finally {
      setProbing(null)
    }
  }

  const totalModels = useMemo(() => providers.reduce((sum, p) => sum + p.models.length, 0), [providers])

  return (
    <div className="min-h-screen bg-[#1b1a18] text-slate-100">
      <div className="mx-auto w-full max-w-[1600px] px-8 py-10 lg:px-14">
        <header className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 text-[11px] uppercase tracking-[0.32em] text-slate-500">Resources / Intelligence</div>
            <h1 className="text-4xl font-semibold tracking-tight text-white">Providers</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
              你提供 4 个字段（name + url + key），系统自动探测模型 + 鉴定能力 + 测速。
              <br />
              卡片显示 🧠⚡💨 智能层级 · 🖼 多模态 · 🚀🏃🐢 速度。
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <span>{providers.length} providers · {totalModels} models</span>
            <button
              onClick={() => void load()}
              className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-slate-200 hover:bg-white/[0.08]"
            >
              刷新
            </button>
            {!showForm ? (
              <button
                onClick={() => setShowForm(true)}
                className="rounded-full bg-emerald-500/90 px-4 py-2 font-medium text-white hover:bg-emerald-500"
              >
                + 添加 Provider
              </button>
            ) : null}
          </div>
        </header>

        {error ? (
          <div className="mb-6 rounded-2xl border border-rose-500/25 bg-rose-500/10 px-5 py-4 text-sm text-rose-100">
            {error}
          </div>
        ) : null}

        {probing ? (
          <div className="mb-6 rounded-2xl border border-amber-500/25 bg-amber-500/10 px-5 py-3 text-sm text-amber-100">
            正在测速 <span className="font-mono">{probing}</span>… （延迟探测可能需要几秒）
          </div>
        ) : null}

        <div className="space-y-6">
          {showForm ? (
            <AddProviderForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} submitting={submitting} />
          ) : null}

          {loading && providers.length === 0 ? (
            <div className="rounded-3xl border border-white/8 bg-[#1f1f1d] px-8 py-20 text-center text-sm text-slate-400">
              加载中…
            </div>
          ) : providers.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/15 bg-[#1f1f1d] px-8 py-20 text-center">
              <div className="text-lg font-medium text-white">还没有 Provider</div>
              <div className="mt-2 text-sm text-slate-400">点击右上角「+ 添加 Provider」开始配置</div>
            </div>
          ) : (
            providers.map((p) => (
              <ProviderSection
                key={p.name}
                provider={p}
                onProbeSpeed={handleProbeSpeed}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>

        <footer className="mt-12 border-t border-white/8 pt-6 text-xs leading-6 text-slate-500">
          <div>宪法 §三：用户提供 4 字段（name / openai_url / anthropic_url / api_key）。</div>
          <div>宪法 §四 4.1：删除 provider 后 chronicle 历史保留。</div>
          <div>宪法 §四 4.4：🧠 顶级 / ⚡ 主力 / 💨 快速；🖼 会看图；🚀&lt;200ms / 🏃&lt;1s / 🐢≥1s。</div>
        </footer>
      </div>
    </div>
  )
}
