# fe-cfl

v2 frontend CFL extraction from `/Users/Shared/egonetics/main` at commit `d33562779ec6596aeadbc1bedb4efa28f0c114f2`.

This is a **code migration runtime**, not a rewrite. The four PRD routes are mounted in one minimal Vite runtime:

- `/prvse-world` → `src/cfl/prvse-world/PrvseWorldView.tsx`
- `/blog` → `src/cfl/rich-editor/BlogPage.tsx`
- `/theory` → `src/cfl/rich-editor/TheoryPageView.tsx`
- `/free-code` → `src/cfl/cli-bridge/FreeCodeTerminal.tsx`
- `/login` → `src/cfl/login/LoginPage.tsx`
- `/settings` → `src/cfl/login/settings/AppearancePage.tsx`

## Expansion PRDs

Additional functional CFL boundaries are defined in `docs/prd/`. These are not route-only splits; each PRD captures a reusable UI capability, data contract, source scope, and acceptance criteria.

Each CFL is intended to become its own GitHub repository under `bornfly-detachment`; this repo remains the integration and extraction reference.

## v2 migration rule

Mandatory PRD files are copied byte-for-byte from the source frontend. Run:

```bash
npm run verify:migration
npm run typecheck
npm run build
```

Only missing app-wide imports are replaced with local minimal equivalents:

- `@/lib/http` / stores copied or stubbed to keep the same public contract.
- PRVSE world `L1Panel` legacy routes use boundary placeholders except for `/blog` and `/theory`, which re-export the migrated rich-editor views.
- `@/kernel/compiler` is a local compatibility compiler facade for the panel; the full PRVSE compiler remains outside this FE extraction.

## Free-code backend

The PRD-required server files are copied to `server/routes/free-code.js` and `server/routes/free-code-ws.js`. A minimal mount exists at `server/index.js`:

```bash
npm run server:free-code
```

`node-pty` is optional. `server/index.js` first tries the exact copied websocket bridge; if the local native `node-pty` package cannot spawn on this machine, it falls back to a pipe-based `/bin/bash` websocket so the CLI bridge route still has a runnable closed loop for verification.
