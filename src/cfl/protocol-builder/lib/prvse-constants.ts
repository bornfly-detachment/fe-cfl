/**
 * Local runtime constants — maintained in web because contract is type-only (Option A).
 * Values copied from egonetics-core types.ts
 */

import type { PatternData, AuthorityLevel, AITier, PatternState } from '@egonetics/core/contract'

export function narrowingCount(p: PatternData): number {
  return [p.physical, p.level, p.communication].filter(n => n.resolved).length
}

export function derivedAuthority(p: PatternData): AuthorityLevel {
  const n = narrowingCount(p)
  if (n === 3) return 'A2'
  if (n >= 1) return 'A1'
  return 'A0'
}

export function derivedTier(p: PatternData): AITier {
  const level = p.level.resolved ? p.level.value : undefined
  if (level === 'L2') return 'T2'
  if (level === 'L1') return 'T1'
  return 'T0'
}

export const L_COLORS = {
  L0: { primary: '#94a3b8', bg: 'rgba(148,163,184,0.06)', border: 'rgba(148,163,184,0.25)', glow: 'rgba(148,163,184,0.12)', label: '信号层' },
  L1: { primary: '#60a5fa', bg: 'rgba(96,165,250,0.06)',  border: 'rgba(96,165,250,0.25)',  glow: 'rgba(96,165,250,0.12)',  label: '规律层' },
  L2: { primary: '#c084fc', bg: 'rgba(192,132,252,0.06)', border: 'rgba(192,132,252,0.25)', glow: 'rgba(192,132,252,0.12)', label: '认知层' },
} as const

export const STATE_VISUALS: Record<PatternState, { borderStyle: 'dashed' | 'solid'; borderWidth: number; opacity: number; label: string }> = {
  external:  { borderStyle: 'dashed',  borderWidth: 1, opacity: 0.7,  label: '外部' },
  candidate: { borderStyle: 'solid',   borderWidth: 1, opacity: 0.85, label: '候选' },
  internal:  { borderStyle: 'solid',   borderWidth: 2, opacity: 1.0,  label: '内部' },
}
