# Repo Shape

`fe-cfl` is a shell repo. It keeps only:

- `src/App.tsx` route aggregation.
- `src/main.tsx` browser bootstrap.
- `src/package-types/` shallow package type shims.
- `scripts/verify-package-boundary.mjs` boundary verification.
- Historical docs and evidence.

Implementation code belongs in the owning `@bornfly-detachment/fe-*-cfl` GitHub repositories and is consumed through pinned package dependencies.
