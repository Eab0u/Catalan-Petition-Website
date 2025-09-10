interface RateLimitEntry {
  count: number;
  start: number;
}

const rateLimits: Map<string, RateLimitEntry> = new Map();

/**
 * Check if a key is allowed under the rate limit
 * @param key - Typically user ID or IP
 * @param limit - Max allowed requests
 * @param windowMs - Time window in milliseconds
 * @returns true if allowed, false if rate limited
 */
export function isAllowed(key: string, limit = 10, windowMs = 60000): boolean {
  const now = Date.now();
  const entry = rateLimits.get(key) || { count: 0, start: now };

  if (now - entry.start > windowMs) {
    // Reset count if window has passed
    entry.count = 1;
    entry.start = now;
    rateLimits.set(key, entry);
    return true;
  }

  if (entry.count < limit) {
    entry.count += 1;
    rateLimits.set(key, entry);
    return true;
  }

  return false;
}