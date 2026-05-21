# FE CFL expansion PRDs

These PRDs define the next frontend CFL split from `bornfly-detachment/egonetics`.

The boundary rule is functional: a frontend CFL must provide a reusable user capability with a data contract and an operation loop. Routes are entry points only; static demos and UI fragments must merge into the capability that owns their semantics.

Repository rule: every frontend CFL is an independent GitHub project, not a folder-only module inside this integration repository. This `fe-cfl` repo is the extraction/integration reference; each PRD below should become its own repository under `bornfly-detachment`.

Existing extracted CFLs:

- `fe-prvse-world-cfl` — PRVSE world view repository.
- `fe-rich-editor-cfl` — `/blog`, `/theory` editor runtime repository.
- `fe-cli-bridge-cfl` — `/free-code` terminal bridge repository.
- `fe-login-cfl` — login, auth-facing settings repository.

New PRDs:

- `fe-obsidian-cfl` — Obsidian sync and backlink galaxy.
- `fe-protocol-builder-cfl` — human-AI UIUX protocol and AI Native UI generation library.
- `fe-canvas-relation-cfl` — semantic canvas and relation graph editing.
- `fe-task-lifecycle-cfl` — task lifecycle, Kanban, task detail, execution console.
- `fe-resource-intelligence-cfl` — provider, model, quota, and harness resource intelligence.
- `fe-memory-chronicle-cfl` — memory boards, session evidence, chronicle publishing.
- `fe-control-plane-cfl` — agents, queues, controller, and message bus operations.
