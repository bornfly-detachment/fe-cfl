# fe-cfl

`fe-cfl` is now only a package-consumer shell. L0 implementation code lives in the independent GitHub CFL repositories under `bornfly-detachment`.

The shell mounts package entrypoints for:

- `@bornfly-detachment/fe-prvse-world-cfl`
- `@bornfly-detachment/fe-obsidian-cfl`
- `@bornfly-detachment/fe-protocol-builder-cfl`
- `@bornfly-detachment/fe-canvas-relation-cfl`
- `@bornfly-detachment/fe-task-lifecycle-cfl`
- `@bornfly-detachment/fe-resource-intelligence-cfl`
- `@bornfly-detachment/fe-memory-chronicle-cfl`
- `@bornfly-detachment/fe-control-plane-cfl`
- `@bornfly-detachment/fe-rich-editor-cfl`
- `@bornfly-detachment/fe-cli-bridge-cfl`
- `@bornfly-detachment/fe-login-cfl`

## Boundary Rule

This repo must not contain copied CFL implementation directories such as `src/cfl`, `src/components`, `src/lib`, or `server`. Dependency updates happen by bumping pinned GitHub commit specs in `package.json` and `package-lock.json`.

```bash
npm run verify:boundary
npm run typecheck
npm run build
```

`scripts/verify-package-boundary.mjs` is the guardrail: it fails when local copied implementation directories reappear or CFL dependencies are not pinned to immutable GitHub commits.

GitHub Actions reads private CFL dependencies through `BORNFLY_CFL_READ_TOKEN`. That token needs read access to the 11 owning CFL repositories.
