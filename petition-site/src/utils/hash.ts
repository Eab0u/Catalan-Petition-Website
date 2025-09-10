import crypto from 'crypto';

/**
 * Hash a string using SHA-256
 * @param input - The string to hash
 * @returns Hexadecimal hash
 */
export function hash(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex');
}