/**
 * Safe localStorage JSON wrapper. Returns null (or no-ops on write) when:
 * - Running in a non-browser environment (SSR, tests without jsdom).
 * - localStorage access is blocked (Safari private mode, corporate policy).
 * - Stored payload is not valid JSON.
 * - Quota is exceeded on write.
 *
 * localStorage is a *convenience* mirror for the filter store; the URL is
 * authoritative. Callers should treat these as best-effort and
 * never block UI behavior on storage success.
 */

function hasStorage(): boolean {
  try {
    return typeof window !== 'undefined' && !!window.localStorage;
  } catch {
    // Accessing window.localStorage can throw in sandboxed contexts.
    return false;
  }
}

export function getJson<T>(key: string): T | null {
  if (!hasStorage()) return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function setJson(key: string, value: unknown): void {
  if (!hasStorage()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Swallow QuotaExceededError and any serialization/storage failures —
    // losing a filter mirror is strictly better than crashing a mutation.
  }
}

export function removeJson(key: string): void {
  if (!hasStorage()) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // same rationale as setJson
  }
}
