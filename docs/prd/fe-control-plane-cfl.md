# fe-control-plane-cfl PRD

## Intent

Provide the operational control plane for agents, queues, controller state, and message bus visibility.

Target repository: `https://github.com/bornfly-detachment/fe-control-plane-cfl`

## First Principles

Control surfaces are valuable when they expose live system state plus safe intervention points. The CFL boundary is monitoring, routing, resolving, and operating control-plane entities.

## Main Contradiction

Agents, queue, controller, and MQ views are separate pages, but their shared purpose is operating the runtime/control plane.

## Source Scope

Source repo: `https://github.com/bornfly-detachment/egonetics`

Routes:

- `/agents`
- `/queue`
- `/controller`
- `/mq`

Primary source files:

- `src/components/AgentsView.tsx`
- `src/components/QueueView.tsx`
- `src/components/ControllerView.tsx`
- `src/components/MQView.tsx`

## Capability Contract

Inputs:

- Agent/component registry, lifecycle records, queue items, controller events, MQ messages, and channel stats.
- User create, edit, delete, resolve, skip, pause/resume, generate, confirm, filter, and inspect actions.

Outputs:

- Updated agent/component/lifecycle state.
- Queue/control decisions.
- MQ message inspection state.
- Control-plane intervention events.

Backend/API dependencies:

- SEAI endpoints used by `AgentsView`, `QueueView`, and `ControllerView`
- `GET /api/mq/messages`
- `GET /api/mq/stats`
- queue/controller endpoints used by `queueApi`

## Acceptance

- The CFL is delivered as an independent GitHub repository with its own README, build command, test command, and source export surface.
- Agents, queue, controller, and MQ views become one operator CFL.
- The CFL clearly separates read-only monitoring from mutating intervention actions.
- It can be embedded by Runtime or PRVSE World without copying operational widgets.

## Out Of Scope

- Obsidian graph synchronization.
- AI Native UI protocol generation.
