# fe-task-lifecycle-cfl PRD

## Intent

Provide task lifecycle management: Kanban planning, task detail editing, execution console, checklist/resource state, and publishing completed task evidence.

Target repository: `https://github.com/bornfly-detachment/fe-task-lifecycle-cfl`

## First Principles

A task CFL is not a board widget. It is the loop from work intent to state transition, execution evidence, and chronicle publication.

## Main Contradiction

The current task UI mixes board movement, task detail, block content, execution runs, decisions, checklist, resources, and publication without a reusable CFL boundary.

## Source Scope

Source repo: `https://github.com/bornfly-detachment/egonetics`

Routes:

- `/tasks`
- `/tasks/:taskId`

Primary source files:

- `src/components/taskBoard/KanbanBoard.tsx`
- `src/components/taskBoard/TaskDetailPage.tsx`
- `src/components/taskBoard/ExecutionConsole.tsx`
- `src/lib/api/tasks.ts`

## Capability Contract

Inputs:

- Task list, columns, task detail, checklist, resource bindings, and execution decisions.
- User create, edit, delete, reorder, drag, publish, instantiate, execute, approve, or reject actions.

Outputs:

- Persisted task and column state.
- Task lifecycle state transitions.
- Execution run and decision evidence.
- Chronicle publication events.

Backend/API dependencies:

- `GET /api/kanban`
- `POST/PATCH/DELETE /api/kanban/tasks/:id`
- `PUT /api/kanban/columns`
- `GET/PATCH/DELETE /api/tasks/:id`
- `POST /api/tasks/:id/send-to-chronicle`
- `GET/POST /api/kernel/executions`
- `PATCH /api/kernel/decisions/:id`

## Acceptance

- The CFL is delivered as an independent GitHub repository with its own README, build command, test command, and source export surface.
- Board, detail, execution, checklist, and publish flows are mounted as one task lifecycle CFL.
- Drag/reorder remains optimistic but reconciles with backend state.
- Task evidence can be handed to Chronicle or Canvas without duplicating UI.

## Out Of Scope

- Memory session boards.
- Generic protocol generation.
