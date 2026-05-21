# fe-obsidian-cfl PRD

## Intent

Provide the reusable Obsidian knowledge graph frontend: vault sync status, backlink graph visualization, Obsidian deep link, and manual sync action.

Target repository: `https://github.com/bornfly-detachment/fe-obsidian-cfl`

## First Principles

The product value is not a runtime status panel. The value is turning an Obsidian vault into a navigable PRVSE knowledge galaxy that other CFLs can reference as evidence, memory, and context.

## Main Contradiction

The current code hides Obsidian inside a PRVSE World runtime overlay. That makes the backlink galaxy unavailable as an independent frontend CFL even though it has its own domain model and user action loop.

## Source Scope

Source repo: `https://github.com/bornfly-detachment/egonetics`

Primary source files:

- `src/components/prvse-world/overlay/RuntimeSOverlay.tsx`
- `src/types/runtime.ts`
- `src/lib/api/runtime.ts`
- `src/components/prvse-world/useControlTree.ts`

Current entry surfaces:

- `/prvse-world` overlay: Obsidian 双链 Graph
- `/runtime` may reuse this CFL when runtime context wants Obsidian graph evidence

## Capability Contract

Inputs:

- Current vault sync state.
- Obsidian graph nodes and edges.
- User request to sync, open, inspect, or navigate Obsidian evidence.

Outputs:

- Backlink galaxy visualization.
- Sync status, markdown counts, error list.
- `obsidian://` URI affordance.
- Selected node or evidence event for upstream CFLs.

Backend/API dependencies:

- `GET /api/prvse/state`
- `GET /api/prvse/obsidian-sync`
- `POST /api/prvse/obsidian-sync`

## Acceptance

- The CFL is delivered as an independent GitHub repository with its own README, build command, test command, and source export surface.
- The graph renders outside `RuntimeSOverlay` as a standalone CFL component.
- The CFL can be mounted by PRVSE World and Runtime views without duplicating UI.
- Manual sync updates graph status and preserves error visibility.
- It exposes typed props/events for selected node, sync result, and open-vault intent.

## Out Of Scope

- General runtime control actions such as start, stop, restart, or last-stand activation.
- Generic graph editing; that belongs to `fe-canvas-relation-cfl`.
