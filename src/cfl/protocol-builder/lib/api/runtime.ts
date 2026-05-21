import { authFetch } from '@/lib/http'
import type {
  L2ControlSnapshot,
  RuntimeStatus,
  ControlInboxItem,
  ChronicleEntry,
  VVerdict,
  ResourceBudget,
  ResourceUsage,
  ResourceBudgetIntelligenceProvider,
  LifecycleEvent,
  RelationEvent,
  GoalControl,
  PrvseRuntimeState,
  PrvseCflRegistryItem,
  PrvseObsidianSyncStatus,
} from '@/types/runtime'

export const runtimeApi = {
  getControl: () => authFetch<L2ControlSnapshot>('/control'),

  getStatus: () => authFetch<RuntimeStatus>('/status'),

  getInbox: () => authFetch<ControlInboxItem[]>('/inbox'),

  getChronicle: () => authFetch<ChronicleEntry[]>('/chronicle'),

  getVVerdict: () => authFetch<VVerdict>('/v-verdict'),

  getBudget: () => authFetch<ResourceBudget>('/resources/budget'),

  getUsage: () => authFetch<ResourceUsage>('/resources/usage'),

  getProviders: () => authFetch<ResourceBudgetIntelligenceProvider[]>('/resources/intelligence/providers'),

  getLifecycles: (limit = 50) => authFetch<LifecycleEvent[]>(`/lifecycles?limit=${limit}`),

  getRelationEvents: (limit = 100) => authFetch<RelationEvent[]>(`/relation-events?limit=${limit}`),

  getPrvseState: () => authFetch<PrvseRuntimeState>('/prvse/state'),

  getCflRegistry: () => authFetch<{ items: PrvseCflRegistryItem[] }>('/prvse/cfl-registry'),

  getObsidianSync: () => authFetch<PrvseObsidianSyncStatus>('/prvse/obsidian-sync'),

  syncObsidian: () => authFetch<PrvseObsidianSyncStatus>('/prvse/obsidian-sync', { method: 'POST' }),

  setCflRuntime: (id: string, op: 'start' | 'stop' | 'replay') =>
    authFetch<{ ok: boolean; item?: PrvseCflRegistryItem; trace?: unknown }>(
      `/prvse/cfl-registry/${encodeURIComponent(id)}/${op}`,
      { method: 'POST' },
    ),

  activateLastStand: () =>
    authFetch<{ ok: boolean; mode: string; state?: PrvseRuntimeState }>('/prvse/resource', {
      method: 'POST',
      body: JSON.stringify({ mode: 'last_stand' }),
    }),

  startRuntime: () => authFetch<{ ok: boolean; harnessId?: string; state?: string }>('/runtime/start', { method: 'POST' }),

  stopRuntime: () => authFetch<{ ok: boolean; state?: string }>('/runtime/stop', { method: 'POST' }),

  restartRuntime: () => authFetch<{ ok: boolean; harnessId?: string; state?: string }>('/runtime/restart', { method: 'POST' }),

  saveGoal: (goal: Partial<GoalControl>) =>
    authFetch<{ ok: boolean }>('/control/goal', {
      method: 'PUT',
      body: JSON.stringify(goal),
    }),

  saveConstitution: (text: string) =>
    authFetch<{ ok: boolean }>('/control/constitution', {
      method: 'PUT',
      body: JSON.stringify({ text }),
    }),

  saveResources: (text: string) =>
    authFetch<{ ok: boolean }>('/control/resources', {
      method: 'PUT',
      body: JSON.stringify({ text }),
    }),

  resolveInbox: (id: string, decision: string, note?: string) =>
    authFetch<{ ok: boolean }>(`/inbox/${id}/resolve`, {
      method: 'POST',
      body: JSON.stringify({ decision, note }),
    }),

  addProvider: (input: { name: string; openai_url?: string; anthropic_url?: string; api_key?: string; api_key_env?: string }) =>
    authFetch<{ ok: boolean; provider?: ResourceBudgetIntelligenceProvider }>('/resources/intelligence/providers', {
      method: 'POST',
      body: JSON.stringify(input),
    }),

  deleteProvider: (name: string) =>
    authFetch<{ ok: boolean }>(`/resources/intelligence/providers/${encodeURIComponent(name)}`, {
      method: 'DELETE',
    }),

  speedProbe: (modelId: string) =>
    authFetch<{ ok: boolean; result?: unknown }>(`/resources/intelligence/speed-probe/${encodeURIComponent(modelId)}`, {
      method: 'POST',
    }),

  speedProbeAll: () =>
    authFetch<{ ok: boolean; message?: string }>('/resources/intelligence/speed-probe-all', {
      method: 'POST',
    }),
}
