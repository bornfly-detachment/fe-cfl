# fe-cfl v2 lock

The v1 shell implementation was rejected because it rewrote the UI instead of migrating the existing frontend. v2 locks the implementation to source-code migration:

1. Copy mandatory files exactly.
2. Copy transitive dependencies needed to preserve function.
3. Replace only missing app-wide imports with minimal local equivalents.
4. Verify exact mandatory copies before claiming completion.

Verification command: `npm run verify:migration`.
