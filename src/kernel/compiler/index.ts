export type PInternalOriginType = 'user_input' | 'model_call' | 'module_output' | 'system_event' | 'process_memory'
export type PExternalOriginType = 'computable' | 'verifiable' | 'narrative' | 'sensor'
export type PermissionTier = 'T0' | 'T1' | 'T2' | 'T3'
export type InfoLevel = 'L0_signal' | 'L1_objective_law' | 'L2_subjective'
export type POrigin =
  | { domain: 'internal'; type: PInternalOriginType }
  | { domain: 'external'; type: PExternalOriginType }

export interface PatternToken {
  id: string
  rawContent: string
  origin: POrigin
  state: string
  physical: { resolved: boolean; value?: string }
  level: { resolved: boolean; value?: string }
  communication: { resolved: boolean; value?: string }
}

export interface ConstitutionViolation {
  ruleId: string
  severity: 'block' | 'downgrade' | 'warn'
  message: string
}

export interface EvolutionEvent {
  id: string
  mutationType: string
  actor: string
  executor: string
  diff?: { before: unknown; after: unknown }
}

export interface CompileResult {
  success: boolean
  highIR: PatternToken
  midIR: {
    tokens: PatternToken[]
    edges: unknown[]
    gates: unknown[]
    constitutionBindings: unknown[]
  }
  lowIR: {
    permissionLevel: PermissionTier
    instructions: unknown[]
    violations: ConstitutionViolation[]
  }
  events: EvolutionEvent[]
  violations: ConstitutionViolation[]
}

export interface CompileInput {
  inputs: readonly { content: string; origin: POrigin }[]
  actor: PermissionTier
  infoLevel: InfoLevel
}

export function compile(input: CompileInput): CompileResult {
  const primary = input.inputs[0] ?? { content: '', origin: { domain: 'internal' as const, type: 'user_input' as const } }
  const token: PatternToken = {
    id: `local-token-${Date.now().toString(36)}`,
    rawContent: primary.content,
    origin: primary.origin,
    state: primary.content.trim() ? 'resolved' : 'empty',
    physical: { resolved: true, value: 'text' },
    level: { resolved: true, value: input.infoLevel },
    communication: { resolved: true, value: 'local' },
  }
  const violations: ConstitutionViolation[] = primary.content.trim()
    ? []
    : [{ ruleId: 'local.empty_input', severity: 'block', message: '输入不能为空' }]
  return {
    success: violations.length === 0,
    highIR: token,
    midIR: { tokens: [token], edges: [], gates: [], constitutionBindings: [] },
    lowIR: { permissionLevel: input.actor, instructions: [], violations },
    events: primary.content.trim()
      ? [{ id: `local-event-${Date.now().toString(36)}`, mutationType: 'local_compile', actor: input.actor, executor: 'fe-cfl', diff: { before: null, after: primary.content } }]
      : [],
    violations,
  }
}
