# fe-resource-intelligence-cfl PRD

## Intent

Provide AI resource intelligence: provider registry, model inventory, quota/usage telemetry, speed probes, harness resource status, and runtime budget visibility.

Target repository: `https://github.com/bornfly-detachment/fe-resource-intelligence-cfl`

## First Principles

AI capability is constrained by available providers, quota, latency, and runtime state. The user-facing CFL should expose those constraints as actionable resource intelligence.

## Main Contradiction

Provider setup, usage limits, Codex/Gemini resource views, and runtime resource panels are currently separate routes even though they model one resource layer.

## Source Scope

Source repo: `https://github.com/bornfly-detachment/egonetics`

Routes:

- `/providers`
- `/resources`
- `/resources_codex`
- `/resources_claude`
- `/resources_gemini`

Primary source files:

- `src/components/providers/ProvidersPage.tsx`
- `src/components/resources/ResourcesConsolePage.tsx`
- `src/components/resources/CodexUsagePage.tsx`
- `src/components/UsageLimitsView.tsx`
- `src/components/ai-resources/ResourcesGeminiView.tsx`
- `src/components/prvse-world/panels/ResourcePanel.tsx`

## Capability Contract

Inputs:

- Provider configs, model cards, usage probes, quota snapshots, runtime status, and harness projections.
- User add/delete provider, probe speed, refresh, and inspect actions.

Outputs:

- Provider/model inventory.
- Usage/quota status with freshness metadata.
- Speed probe results.
- Canonical resource health projection for other CFLs.

Backend/API dependencies:

- `GET/POST/DELETE /api/resources/intelligence/providers`
- `POST /api/resources/intelligence/speed-probe/:modelId`
- `GET /api/resources/status`
- `GET /api/resources/status/canonical`
- `GET /api/resources/runtime/status`
- `GET /api/resources/runtime/snapshot`
- `GET /api/codex-usage/snapshot`
- usage probe endpoints used by `UsageLimitsView`

## Acceptance

- The CFL is delivered as an independent GitHub repository with its own README, build command, test command, and source export surface.
- Provider management and usage telemetry are one CFL, not separate dashboards.
- The CFL exposes provider status, quota state, and speed probe results for scheduling UI.
- Existing Codex, Claude, and Gemini resource views become provider-specific panels.

## Out Of Scope

- Free-code terminal execution.
- Login/auth settings.
