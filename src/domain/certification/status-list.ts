/**
 * StatusList2021 bitstring — pure bit operations (no compression here).
 *
 * One bit per credential, addressed by its statusListIndex. Bit = 1 → revoked,
 * 0 → active. Bit ordering is MSB-first within each byte, per the W3C
 * StatusList2021 spec (index 0 is the most-significant bit of byte 0). The
 * GZIP/base64url envelope lives in the infrastructure service.
 */

/** Minimum list size mandated by the spec: 16KB → 131,072 entries. */
export const STATUS_LIST_MIN_BITS = 16 * 1024 * 8;

export function setBit(bytes: Uint8Array, index: number): void {
  bytes[index >> 3] |= 0x80 >> (index & 7);
}

export function getBit(bytes: Uint8Array, index: number): boolean {
  const byte = bytes[index >> 3];
  if (byte === undefined) return false;
  return (byte & (0x80 >> (index & 7))) !== 0;
}

/**
 * Build a bitstring with the given revoked indices set. Length is at least
 * STATUS_LIST_MIN_BITS, and always large enough to hold the highest index.
 */
export function buildBitstring(
  revokedIndices: number[],
  lengthBits: number = STATUS_LIST_MIN_BITS,
): Uint8Array {
  const maxIndex = revokedIndices.length ? Math.max(...revokedIndices) : 0;
  const needed = Math.max(lengthBits, maxIndex + 1);
  const bytes = new Uint8Array(Math.ceil(needed / 8));
  for (const i of revokedIndices) {
    if (i >= 0) setBit(bytes, i);
  }
  return bytes;
}
