# fe-cfl visual diff report

- source: /Users/Shared/egonetics/main direct component harness
- target: /Users/Shared/codex-workspace/fe-cfl
- viewport: 1365x900
- threshold: 2.00% different pixels

| route | status | diff % | mean abs RGB | source | target | diff |
|---|---:|---:|---:|---|---|---|
| /prvse-world | FAIL | 99.101% | 16.986 | prvse-world.source.png | prvse-world.target.png | prvse-world.diff.png |
| /blog | PASS | 0.000% | 0.000 | blog.source.png | blog.target.png | blog.diff.png |
| /theory | PASS | 0.133% | 2.051 | theory.source.png | theory.target.png | theory.diff.png |
| /free-code | FAIL | 9.711% | 3.013 | free-code.source.png | free-code.target.png | free-code.diff.png |
| /login | PASS | 0.518% | 0.307 | login.source.png | login.target.png | login.diff.png |
| /settings | FAIL | 90.587% | 15.166 | settings.source.png | settings.target.png | settings.diff.png |

Notes:
- `/blog` and `/theory` run against empty standalone page data during visual diff to avoid the source frontend historical nested React-DnD backend crash while still checking route shell and migrated view rendering.
- Source app files are not written; Vite cache is redirected under `fe-cfl/.visual-cache/`.
