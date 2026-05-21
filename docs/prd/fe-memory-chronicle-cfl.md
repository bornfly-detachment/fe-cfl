# fe-memory-chronicle-cfl PRD

## Intent

Provide memory and chronicle evidence management: session review, annotation, memory boards, import, and publication into Chronicle.

Target repository: `https://github.com/bornfly-detachment/fe-memory-chronicle-cfl`

## First Principles

Memory is useful only when it can become traceable evidence. The CFL boundary is the loop from session artifact to curated board to chronicle publication.

## Main Contradiction

Memory sessions, boards, annotations, imports, and Chronicle publication are related evidence operations but are not packaged as a reusable frontend CFL.

## Source Scope

Source repo: `https://github.com/bornfly-detachment/egonetics`

Routes:

- `/memory`
- `/chronicle`

Primary source files:

- `src/components/MemoryView.tsx`
- `src/components/ChronicleView.tsx`
- `src/components/ChroniclePageView.tsx`
- `src/lib/api/memory.ts`

## Capability Contract

Inputs:

- Memory sessions, rounds, steps, annotations, tags, and boards.
- Chronicle entries, collections, milestones, and publication targets.
- User annotate, drag session reference, create board, delete, import, and publish actions.

Outputs:

- Curated memory boards.
- Session annotations and tags.
- Chronicle entries or publication requests.
- Evidence references for tasks, canvas, and protocol flows.

Backend/API dependencies:

- `GET /api/memory/sessions`
- `GET /api/memory/sessions/:id/rounds`
- `GET /api/memory/rounds/:id/steps`
- `GET/POST/PATCH/DELETE /api/memory/boards`
- `POST /api/memory/boards/:id/send-to-chronicle`
- `POST /api/memory/import`
- Chronicle endpoints under `/api/chronicle`

## Acceptance

- The CFL is delivered as an independent GitHub repository with its own README, build command, test command, and source export surface.
- Memory board and Chronicle publishing flows operate as one evidence CFL.
- The CFL can emit selected evidence references for Canvas, Task, and Protocol CFLs.
- Session annotations remain durable and inspectable.

## Out Of Scope

- Rich editor block authoring.
- Task lifecycle execution.
