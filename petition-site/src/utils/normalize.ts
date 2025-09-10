/**
 * Normalize a string: trim, lowercase, and replace multiple spaces with a single space
 * @param str - The string to normalize
 * @returns Normalized string
 */
export function normalize(str: string): string {
  return str.trim().replace(/\s+/g, ' ').toLowerCase();
}