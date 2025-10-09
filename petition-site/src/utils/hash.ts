/**
 * Hash a string using SHA-256 (browser-compatible)
 * @param input - The string to hash
 * @returns Promise that resolves to the hexadecimal hash
 */
export async function hash(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}