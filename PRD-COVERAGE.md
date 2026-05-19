# fe-cfl PRD v2 coverage

Source PRD: `/Users/Shared/product-docs/prd-core/fe-cfl/`.

## Exact migration

`npm run verify:migration` verifies every mandatory v2 file with SHA-256 against `/Users/Shared/egonetics/main`.

- `fe-prvse-world-cfl`: 25 listed runtime files copied into `src/cfl/prvse-world/`.
- `fe-rich-editor-cfl`: 5 listed files copied into `src/cfl/rich-editor/`; additional editor transitive dependencies are copied so the runtime builds.
- `fe-cli-bridge-cfl`: `FreeCodeTerminal.tsx` plus `server/routes/free-code.js` and `server/routes/free-code-ws.js` copied exactly.
- `fe-login-cfl`: `LoginPage.tsx`, `AppearancePage.tsx`, auth/theme stores, translations, and utils copied exactly.

## Minimal runtime adaptations

The source frontend remains read-only. Adaptations are local compatibility boundaries only: route shell, Vite/Tailwind config, app-wide store/compiler stubs, and legacy-route placeholders for views outside the four PRDs.

## Browser evidence

Local browser smoke evidence is stored under `docs/evidence/`:

- `fe-cfl-prvse-world.png`
- `fe-cfl-free-code-connected.png`

The browser pass used Vite on `127.0.0.1:3041` plus the standalone API/free-code bridge on `127.0.0.1:3052`.
