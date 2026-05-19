# fe-cfl visual diff report

- source: /Users/Shared/egonetics/main direct component harness
- target: /Users/Shared/codex-workspace/fe-cfl
- viewport: 1365x900
- threshold: 2.00% different pixels

| route | status | diff % | mean abs RGB | source | target | diff |
|---|---:|---:|---:|---|---|---|
| /prvse-world | FAIL | 100.000% | 65.512 | prvse-world.source.png | prvse-world.target.png | prvse-world.diff.png |
| /blog | FAIL | 99.994% | 230.238 | blog.source.png | blog.target.png | blog.diff.png |
| /theory | FAIL | 99.995% | 230.250 | theory.source.png | theory.target.png | theory.diff.png |
| /free-code | FAIL | 100.000% | 238.076 | free-code.source.png | free-code.target.png | free-code.diff.png |
| /login | FAIL | 99.963% | 233.714 | login.source.png | login.target.png | login.diff.png |
| /settings | FAIL | 100.000% | 242.883 | settings.source.png | settings.target.png | settings.diff.png |

Notes:
- `/blog` and `/theory` run against empty standalone page data during visual diff to avoid the source frontend historical nested React-DnD backend crash while still checking route shell and migrated view rendering.
- Source app files are not written; Vite cache is redirected under `fe-cfl/.visual-cache/`.
