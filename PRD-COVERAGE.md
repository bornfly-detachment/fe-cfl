# fe-cfl PRD Coverage

`fe-cfl` no longer proves coverage by copying files from egonetics. Coverage now comes from the 11 independent CFL repositories and their own PRDs, CI checks, and package entrypoints.

This repo verifies only the integration boundary:

- CFL implementation source is absent locally.
- Every mounted CFL is a package dependency under `@bornfly-detachment/*`.
- Every CFL dependency is pinned to a GitHub commit.
- Route wiring imports package entrypoints, not `./src/cfl`.

Run:

```bash
npm run verify:boundary
```

Historical visual-diff evidence remains under `docs/evidence/`, but new L0 correctness must be proven in the owning CFL repository.
