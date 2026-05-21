# fe-protocol-builder-cfl PRD

## Intent

Provide the human-AI UIUX protocol library: protocol rules, UI component semantics, AI Native UI generation assets, PRVSE visual grammar, and validation surfaces used by downstream CFLs.

Target repository: `https://github.com/bornfly-detachment/fe-protocol-builder-cfl`

## First Principles

AI Native UI should not be hardcoded page by page. It should be generated from protocol, component semantics, interaction intent, and PRVSE state contracts.

## Main Contradiction

The UIUX assets needed by future CFLs are scattered across protocol, showcase, tag-tree, PRVSE demos, cybernetics, and lab routes. The system needs one protocol CFL that owns the dynamic UI generation grammar.

## Source Scope

Source repo: `https://github.com/bornfly-detachment/egonetics`

Routes to merge:

- `/protocol`
- `/protocol/builder`
- `/protocol/resource`
- `/protocol/tag-tree`
- `/protocol/lab`
- `/protocol/prv-demo`
- `/protocol/font-compare`
- `/protocol/prvse-ui`
- `/protocol/cybernetics`
- `/protocol/ui-showcase/*`
- `/protocol/ui-showcase-one-step/*`

Primary source files:

- `src/components/ProtocolView.tsx`
- `src/components/ProtocolBuilderView.tsx`
- `src/pages/protocol/ResourceProtocolPage.tsx`
- `src/components/TagTreeView.tsx`
- `src/components/CyberneticsSystemView.tsx`
- `src/components/LabView.tsx`
- `src/components/prvse/PRVDemo.tsx`
- `src/components/prvse/FontCompare.tsx`
- `src/components/PRVSEUIDemo.tsx`
- `src/pages/ui-showcase/**`
- `src/pages/ui-showcase-one-step/**`

## Capability Contract

Inputs:

- Human protocol rule intent.
- Component grammar and UI capability metadata.
- PRVSE tag taxonomy and protocol resources.
- AI-generated suggestions, build output, and validation feedback.

Outputs:

- Reusable AI Native UI component definitions.
- Protocol rules with human language, machine language, tests, build status, and publish state.
- UIUX patterns usable by downstream CFLs.
- Validation feedback and generated test cases.

Backend/API dependencies:

- `GET /api/protocol`
- `GET /api/protocol-rules`
- `POST /api/protocol-rules`
- `PATCH /api/protocol-rules/:id`
- `DELETE /api/protocol-rules/:id`
- `POST /api/protocol-rules/:id/build`
- `POST /api/protocol-rules/:id/suggest`
- `POST /api/protocol-rules/:id/publish`
- tag-tree APIs used by `useBlockTags`

## Acceptance

- The CFL is delivered as an independent GitHub repository with its own README, build command, test command, and source export surface.
- Showcase and PRVSE UI demo routes become protocol-library assets, not standalone dead pages.
- The CFL exposes a registry of reusable UIUX primitives and examples.
- Rule CRUD, build, suggest, publish, and test-case flows remain functional.
- Downstream CFLs can import protocol-defined UI patterns instead of copying route-specific components.

## Out Of Scope

- Runtime execution control.
- Semantic canvas persistence.
- Provider quota management.
