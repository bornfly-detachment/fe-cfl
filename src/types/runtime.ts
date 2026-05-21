export interface GoalControl {
  id: string
  text: string
  success_condition: string
  tag: string
  priority: 'high' | 'medium' | 'low'
  l2_layer: 'L2'
  updated_at: number
  submitted_by: string
}

export interface SessionControl {
  harness_id: string
  state: 'dead' | 'born' | 'alive' | 'interrupted'
  started_at: number
  boot_sequencer_passed: boolean
  applied: {
    goal: string
    constitution_hash: string
    resources_hash: string
  }
  last_error: string | null
}

export interface ControlInboxItem {
  id: string
  source:
    | 'provider_unreachable'
    | 'provider_unauthorized'
    | 'resource_exhausted_intelligence'
    | 'resource_exhausted_storage'
    | 'resource_exhausted_time'
    | 'provider_pool_exhausted'
    | 'third_same_failure'
    | 'structural_contradiction'
    | 'cfl_registry_failure'
    | 'boot_degraded'
  reason: string
  suggested_action: string
  created_at: number
  resolved: boolean
  resolved_at?: number
  resolution?: string
}

export interface L2ControlSnapshot {
  goal: GoalControl
  constitutionText: string
  resourcesText: string
  session: SessionControl | null
  files: {
    goalPath: string
    constitutionPath: string
    resourcesPath: string
  }
}

export interface LifecycleEvent {
  type: 'start' | 'stop' | 'fail' | 'waiting'
  harness_id: string
  timestamp: number
  details?: string
}

export interface RelationEvent {
  timestamp: number
  type:
    | 'control_file_changed'
    | 'runtime_state_changed'
    | 'provider_added'
    | 'provider_removed'
    | 'goal_updated'
    | 'constitution_updated'
    | 'resources_updated'
    | 'inbox_resolved'
    | 'cfl_registry_updated'
    | 'cfl_registry_runtime_changed'
    | 'prvse_config_updated'
    | 'governance_loaded'
    | 'obsidian_sync_updated'
  source: string
  details: Record<string, unknown>
}

export interface VVerdict {
  verdict: 'constitution_compliant' | 'constitution_violation' | 'none'
  risk: 'high' | 'medium' | 'low' | 'unknown'
  turn_count: number
}

export interface RuntimeResources {
  time_ms: number
  time_max: number
  tokens: number
  token_max: number
  storage: number
  storage_max: number
  attempts: number
  attempts_max: number
}

export interface RuntimeStatus {
  state: string
  goal: string
  resources: RuntimeResources
  v_pass: number
  v_fail: number
  v_strikes: number
  session: SessionControl | null
  boot_sequencer: {
    ok: boolean
    steps: Array<{ label: string; passed: boolean; error?: string }>
  } | null
}

export interface ResourceBudgetIntelligenceProviderModel {
  model_id: string
  tier: 'T0' | 'T1' | 'T2'
  display_name?: string
  provider?: string
  role?: string
  latency_p50_ms?: number | null
  tokens_per_sec?: number | null
  context_length?: number
  context_window?: number
  multimodal_native?: boolean
  multimodal_types?: string[]
  usage_query_supported?: boolean
  status?: string
  last_pinged_at?: number | null
}

export interface ResourceBudgetIntelligenceProvider {
  name: string
  openai_url?: string
  anthropic_url?: string
  api_key?: string
  api_key_env?: string
  protocol?: 'openai' | 'anthropic' | 'auto'
  models: ResourceBudgetIntelligenceProviderModel[]
}

export interface ResourceBudget {
  $schema?: string
  intelligence: {
    budget_tokens?: number
    used_tokens?: number
    tier_ratios?: { T0: number; T1: number; T2: number }
    budgets?: Record<string, {
      token_budget: number
      currency_budget: number
      token_used?: number
      currency_used?: number
    }>
    providers: ResourceBudgetIntelligenceProvider[]
  }
  storage: {
    budget_bytes?: number
    used_bytes?: number
    categories?: Record<string, { budget: number; used: number }>
    context_window_max_tokens?: number
    pattern_cache_max_mb?: number
    chronicle_max_mb?: number
    memory_max_mb?: number
    artifacts_max_mb?: number
  }
  spacetime: {
    budget_wall_ms?: number
    used_wall_ms?: number
    budget_cpu_ms?: number
    used_cpu_ms?: number
    max_attempts?: number
    current_attempts?: number
    wall_clock_max_minutes?: number
    per_turn_timeout_ms?: number
    cpu_time_max_minutes?: number
    sandbox_required?: boolean
    network_access?: string
    os_capabilities?: string[]
    external_deps?: string[]
  }
}

export interface ResourceUsage {
  intelligence: {
    by_tier: Record<string, { tokens_used: number; calls?: number; requests?: number }>
    by_model?: Record<string, { calls: number; prompt_tokens: number; completion_tokens: number; cached_tokens: number }>
    total_tokens_used: number
  }
  storage: {
    by_category: Record<string, { bytes: number }>
    total_bytes: number
    chronicle_mb?: number
    memory_mb?: number
    artifacts_mb?: number
  }
  spacetime: {
    wall_ms: number
    cpu_ms: number
    turns: number
    elapsed_minutes?: number
    sandbox_state?: string
    network_state?: string
  }
}

export interface ChronicleEntry {
  id: string
  type: string
  content: string
  timestamp: number
}

export interface PrvseCflRegistryItem {
  id: string
  tag_id: string
  kernel_primitive: string
  compiler_source_grammar: string
  input_pattern_schema: Record<string, unknown>
  output_pattern_schema: Record<string, unknown>
  value_validator_schema: Record<string, unknown>
  sandbox_profile: Record<string, unknown>
  startup_policy: string
  feedback_channel: string
  chronicle_policy: Record<string, unknown>
  runtime_status: 'stopped' | 'running' | 'failed'
  created_at: number
  updated_at: number
  last_trace?: Record<string, unknown>
}

export interface PrvseProviderPlanItem {
  priority: number
  provider: string
  model: string
  tier: string
  status: string
  calls: number
  prompt_tokens: number
  completion_tokens: number
  cached_tokens: number
  latency_p50_ms: number | null
  tokens_per_sec: number | null
}

export interface PrvseObsidianGraphNode {
  id: string
  title: string
  layer: 'L0' | 'L1' | 'L2'
  path: string
  backlinks: string[]
}

export interface PrvseObsidianGraphEdge {
  from: string
  to: string
  kind: string
  evidence: string
}

export interface PrvseObsidianSyncStatus {
  vault_path: string
  vault_name: string
  status: 'synced' | 'degraded'
  last_synced_at: number
  markdown_files: number
  syncing_files: number
  errors: string[]
  obsidian_uri: string
  graph_nodes: PrvseObsidianGraphNode[]
  graph_edges: PrvseObsidianGraphEdge[]
}

export interface PrvseWorldGraphNode {
  id: string
  name: string
  layer: 'L0' | 'L1' | 'L2'
  parent_id: string | null
  tag_id: string
  prv: 'P' | 'R' | 'V' | 'S' | 'E'
  kind: string
  color: string
  source: string
  evidence: string
  gate_status?: Record<string, unknown>
  metrics?: Record<string, unknown>
}

export interface PrvseWorldGraphEdge {
  from: string
  to: string
  kind: string
  evidence: string
}

export interface PrvseWorldGraph {
  nodes: PrvseWorldGraphNode[]
  edges: PrvseWorldGraphEdge[]
}

export interface PrvseRuntimeState {
  mode: 'lifecycle' | 'adaptive' | 'last_stand'
  last_stand: {
    active: boolean
    policy: string
    provider_plan: PrvseProviderPlanItem[]
    provider_pool_exhausted: boolean
  }
  governance: {
    path: string
    loaded: boolean
    hash: string | null
    title: string | null
  }
  runtime_s: {
    state: string
    harness_id: string | null
    boot_sequencer: unknown
    running_cfl_count: number
    v_pass: number
    v_fail: number
    v_strikes: number
    resources: RuntimeResources | null
  }
  control: L2ControlSnapshot
  cfl_registry: PrvseCflRegistryItem[]
  cfl_nodes: Array<{
    id: string
    name: string
    tag_id: string
    layer: 'L0' | 'L1' | 'L2'
    runtime_status: string
    gate_status: Record<string, unknown>
  }>
  world_graph?: PrvseWorldGraph
  inbox: {
    total: number
    unresolved: number
    items: ControlInboxItem[]
  }
  trace: {
    lifecycles: LifecycleEvent[]
    relation_events: RelationEvent[]
  }
  obsidian: PrvseObsidianSyncStatus
  usage: ResourceUsage
  layers: Record<'L0' | 'L1' | 'L2', PrvseRuntimeState['cfl_nodes']>
}
