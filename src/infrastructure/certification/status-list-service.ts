/**
 * StatusList2021 encoding service — GZIP + base64url envelope around the pure
 * bitstring. `encodedList` is what the status-list credential publishes and
 * what /verify decodes to read a single credential's revocation bit.
 */

import { gzipSync, gunzipSync } from 'node:zlib';
import { buildBitstring, getBit, STATUS_LIST_MIN_BITS } from '@/domain/certification/status-list';

/** GZIP-compress a bitstring and base64url-encode it (the `encodedList`). */
export function encodeBitstring(bytes: Uint8Array): string {
  return gzipSync(bytes).toString('base64url');
}

/** Reverse of encodeBitstring: base64url-decode then GZIP-inflate. */
export function decodeBitstring(encodedList: string): Uint8Array {
  return new Uint8Array(gunzipSync(Buffer.from(encodedList, 'base64url')));
}

/** Build the published `encodedList` from the set of revoked indices. */
export function buildEncodedStatusList(
  revokedIndices: number[],
  lengthBits: number = STATUS_LIST_MIN_BITS,
): string {
  return encodeBitstring(buildBitstring(revokedIndices, lengthBits));
}

/** Decode an `encodedList` and read whether `index` is revoked (bit = 1). */
export function isRevoked(encodedList: string, index: number): boolean {
  if (!Number.isInteger(index) || index < 0) return false;
  return getBit(decodeBitstring(encodedList), index);
}
