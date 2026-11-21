---
"miniflare": patch
---

Honor `start_after` when listing local R2 objects

Local Explorer now returns only keys strictly after the requested key. This lets `cf r2 objects list --local --start-after` resume a listing without returning the last processed object again.
