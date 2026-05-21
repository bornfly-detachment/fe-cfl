export type AuthorityLevel = 'A0' | 'A1' | 'A2' | string
export type AITier = 'T0' | 'T1' | 'T2' | string
export type PatternState = 'external' | 'candidate' | 'internal'
export type CheckResult = 'pass' | 'fail' | 'warn' | 'pending'
export type RelationLevel = 'L0_logic' | 'L1_conditional' | 'L2_existential'
export type EdgeType =
  | 'directed'
  | 'contains'
  | 'constraint'
  | 'mutual_constraint'
  | 'signal'
  | 'derives'
  | string

export interface Origin {
  domain: string
  source: string
  label: string
  chain?: Origin[]
}

export interface ProvenanceData {
  origin: Origin
  version: number
  frozen: boolean
  parentId?: string
  chronicle?: {
    designRationale?: string
    functionalSpec?: string
    dependencies: any[]
    constitutionBindings: any[]
    sourceRef?: string
    [key: string]: any
  }
}

export interface ResourceData {
  filePath: string
  authority: AuthorityLevel
  aiTier: AITier
  storage: number
  memoryUsage?: number
  dependencies: any[]
  [key: string]: any
}

export interface MountData {
  aopHooks: Array<{ id: string; active: boolean; type: string; target: string; [key: string]: any }>
  constitutionBindings: Array<{ ruleId: string; status: CheckResult; description: string; [key: string]: any }>
  ports: Array<{ direction: 'in' | 'out' | string; targetType: string; target: string; edgeType: string; [key: string]: any }>
  skills: Array<{ id: string; active: boolean; name?: string; type?: string; [key: string]: any }>
  [key: string]: any
}

export interface PatternData {
  id: string
  timestamp?: number
  label?: string
  rawContent: string
  state: PatternState
  physical: { resolved: boolean; value?: string; source?: string }
  level: { resolved: boolean; value?: 'L0' | 'L1' | 'L2'; source?: string }
  communication: { resolved: boolean; value?: string; source?: string }
  origin?: Origin
  version?: number
  frozen?: boolean
  parentId?: string
  [key: string]: any
}

export interface RelationEdge {
  id: string
  sourceNode: string
  targetNode: string
  infoLevel: RelationLevel
  edgeType: EdgeType
  direction?: string
  certainty?: string
  temporal?: string
  strength?: string
  propagation?: string
  priority?: number
  [key: string]: any
}

export interface RelationData {
  id?: string
  timestamp?: number
  label?: string
  infoLevel: RelationLevel
  viewLevel: 'L0' | 'L1' | 'L2'
  nodes: string[]
  edges: RelationEdge[]
  [key: string]: any
}

export interface ChecklistItem {
  id: string
  type: string
  description: string
  result: CheckResult
  evidence?: string
  [key: string]: any
}

export interface Metric {
  type: string
  label?: string
  value: number
  threshold?: number
  unit?: string
  [key: string]: any
}

export interface RewardFunction {
  type: string
  label?: string
  value: number
  formula?: string
  [key: string]: any
}

export interface ValueData {
  id?: string
  timestamp?: number
  label?: string
  verdictLevel?: string
  metrics: Metric[]
  checklist: ChecklistItem[]
  rewards: RewardFunction[]
  lifecycle?: Record<string, any>
  verdict: CheckResult
  independence: {
    neutral: boolean
    antiInfiltration: boolean
    kernelDirect: boolean
    [key: string]: any
  }
  [key: string]: any
}
