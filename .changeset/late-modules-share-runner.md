---
"@cloudflare/vitest-plugin": patch
---

Fix concurrent dynamic imports from Durable Object handlers

Evaluate deferred imports in the Vitest runner's Durable Object so concurrent imports can share pending module evaluations. This prevents cross-object I/O errors when an imported module has dependencies of its own.
