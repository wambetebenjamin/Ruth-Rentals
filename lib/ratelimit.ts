import "server-only";

type Bucket = { count: number; resetAt: number };

declare global {
  var __rrBuckets: Map<string, Bucket> | undefined;
}

function buckets(): Map<string, Bucket> {
  if (!globalThis.__rrBuckets) globalThis.__rrBuckets = new Map();
  return globalThis.__rrBuckets;
}

export function rateLimit(
  key: string,
  limit = 10,
  windowMs = 5 * 60 * 1000,
): { ok: boolean; retryAfter: number } {
  const store = buckets();
  const now = Date.now();
  const bucket = store.get(key);

  if (!bucket || bucket.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    if (store.size > 500) {
      for (const [entryKey, entry] of store) {
        if (entry.resetAt < now) store.delete(entryKey);
      }
    }
    return { ok: true, retryAfter: 0 };
  }

  if (bucket.count >= limit) {
    return { ok: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  bucket.count += 1;
  return { ok: true, retryAfter: 0 };
}
