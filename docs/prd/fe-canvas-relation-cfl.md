# fe-canvas-relation-cfl PRD

## Intent

Provide semantic canvas and relation graph editing for pages, tasks, subjects, and cross-entity relations.

Target repository: `https://github.com/bornfly-detachment/fe-canvas-relation-cfl`

## First Principles

Knowledge work needs a manipulable graph, not only a list. The CFL boundary is the relation-making loop: place entities, expand context, connect nodes, edit relation metadata, and publish relation evidence.

## Main Contradiction

Canvas, relation detail, subject pages, and graph APIs form one operation loop but are currently scattered across several routes.

## Source Scope

Source repo: `https://github.com/bornfly-detachment/egonetics`

Routes:

- `/egonetics`
- `/egonetics/canvas/:canvasId`
- `/egonetics/:subjectId`
- `/relations/:relationId`

Primary source files:

- `src/components/EgoneticsView.tsx`
- `src/components/CanvasView.tsx`
- `src/components/EgoneticsSubjectPage.tsx`
- `src/components/RelationDetailView.tsx`
- `src/lib/api/canvas.ts`
- `src/lib/api/block-graph.ts`

## Capability Contract

Inputs:

- Canvas list and canvas node layout.
- Page, task, subject, or relation entities.
- User connect, fold, expand, move, edit, publish, and delete actions.

Outputs:

- Persisted canvas nodes and layout.
- Relation records with typed endpoints and metadata.
- Published relation/process versions.
- Navigation intents to source entity detail.

Backend/API dependencies:

- `GET/POST/PATCH/DELETE /api/canvases`
- `GET/POST/PATCH/DELETE /api/canvases/:id/nodes`
- `GET/POST/PATCH/DELETE /api/relations`
- `POST /api/relations/:id/publish`
- `GET /api/pages/:id/subtree`

## Acceptance

- The CFL is delivered as an independent GitHub repository with its own README, build command, test command, and source export surface.
- Canvas list, canvas editor, relation creation, relation detail, and publish flows run in one CFL.
- Graph layout changes persist without losing relation metadata.
- The CFL emits selected entity and selected relation events for other CFLs.

## Out Of Scope

- Rich document block editing.
- Protocol UI generation.
