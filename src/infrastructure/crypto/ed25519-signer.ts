/**
 * Ed25519 credential signer — real cryptography behind the CredentialSigner
 * port. Signs the JCS-canonical bytes of the unsigned credential with a
 * node:crypto Ed25519 key and returns a W3C proof whose proofValue is the
 * signature encoded as multibase base58btc ('z' prefix).
 *
 * Offline-verifiable: verifyCredential() reconstructs the exact canonical bytes
 * and checks the signature against the issuer's public key — no third party.
 */

import { createPrivateKey, createPublicKey, sign as edSign, verify as edVerify, type KeyObject } from 'node:crypto';
import {
  signingPayload,
  canonicalize,
  type UnsignedCredential,
  type SignedCredential,
  type Proof,
} from '@/domain/certification/credential';
import type { CredentialSigner } from '@/application/ports/credential-ports';

const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

/** Encode bytes as base58btc (Bitcoin alphabet). */
export function base58btcEncode(bytes: Uint8Array): string {
  if (bytes.length === 0) return '';
  const digits = [0];
  for (const byte of bytes) {
    let carry = byte;
    for (let i = 0; i < digits.length; i++) {
      carry += digits[i] << 8;
      digits[i] = carry % 58;
      carry = (carry / 58) | 0;
    }
    while (carry > 0) {
      digits.push(carry % 58);
      carry = (carry / 58) | 0;
    }
  }
  let out = '';
  // Preserve leading zero bytes as '1'.
  for (let k = 0; k < bytes.length && bytes[k] === 0; k++) out += BASE58_ALPHABET[0];
  for (let i = digits.length - 1; i >= 0; i--) out += BASE58_ALPHABET[digits[i]];
  return out;
}

/** Decode a base58btc string back to bytes. */
export function base58btcDecode(str: string): Uint8Array {
  if (str.length === 0) return new Uint8Array();
  const bytes = [0];
  for (const ch of str) {
    const value = BASE58_ALPHABET.indexOf(ch);
    if (value === -1) throw new Error(`invalid base58 character: ${ch}`);
    let carry = value;
    for (let i = 0; i < bytes.length; i++) {
      carry += bytes[i] * 58;
      bytes[i] = carry & 0xff;
      carry >>= 8;
    }
    while (carry > 0) {
      bytes.push(carry & 0xff);
      carry >>= 8;
    }
  }
  for (let k = 0; k < str.length && str[k] === BASE58_ALPHABET[0]; k++) bytes.push(0);
  return Uint8Array.from(bytes.reverse());
}

// Ed25519 multicodec prefix (0xed 0x01) for did:key / publicKeyMultibase.
const ED25519_MULTICODEC = Uint8Array.from([0xed, 0x01]);
// Fixed DER SPKI header for an Ed25519 public key (12 bytes) + 32-byte raw key.
const ED25519_SPKI_HEADER = Buffer.from('302a300506032b6570032100', 'hex');

/** Encode an Ed25519 public key as W3C publicKeyMultibase ('z' + base58btc). */
export function publicKeyMultibase(publicKey: string | KeyObject): string {
  const key = typeof publicKey === 'string' ? createPublicKey(publicKey) : publicKey;
  const jwk = key.export({ format: 'jwk' }) as { kty?: string; crv?: string; x?: string };
  if (jwk.kty !== 'OKP' || jwk.crv !== 'Ed25519' || !jwk.x) throw new Error('not an Ed25519 public key');
  const raw = Buffer.from(jwk.x, 'base64url');
  const prefixed = new Uint8Array(ED25519_MULTICODEC.length + raw.length);
  prefixed.set(ED25519_MULTICODEC, 0);
  prefixed.set(raw, ED25519_MULTICODEC.length);
  return `z${base58btcEncode(prefixed)}`;
}

/** Resolve a publicKeyMultibase back to a usable Ed25519 public key (DID resolution). */
export function publicKeyFromMultibase(multibase: string): KeyObject {
  if (!multibase.startsWith('z')) throw new Error('expected base58btc multibase (z-prefixed)');
  const bytes = base58btcDecode(multibase.slice(1));
  if (bytes[0] !== 0xed || bytes[1] !== 0x01) throw new Error('not an Ed25519 multicodec key');
  const der = Buffer.concat([ED25519_SPKI_HEADER, Buffer.from(bytes.slice(2))]);
  return createPublicKey({ key: der, format: 'der', type: 'spki' });
}

export interface Ed25519SignerConfig {
  /** PEM-encoded Ed25519 private key, or a node KeyObject. */
  privateKey: string | KeyObject;
  /** e.g. did:web:apa-platform-five.vercel.app#key-1 */
  verificationMethod: string;
}

/** Create a CredentialSigner backed by a real Ed25519 key. */
export function createEd25519Signer(config: Ed25519SignerConfig): CredentialSigner {
  const key = typeof config.privateKey === 'string' ? createPrivateKey(config.privateKey) : config.privateKey;

  return {
    async sign(unsigned: UnsignedCredential): Promise<Proof> {
      const signature = edSign(null, Buffer.from(signingPayload(unsigned)), key);
      return {
        type: 'Ed25519Signature2020',
        created: unsigned.validFrom, // issuance time = validFrom
        verificationMethod: config.verificationMethod,
        proofPurpose: 'assertionMethod',
        proofValue: `z${base58btcEncode(signature)}`,
      };
    },
  };
}

/**
 * Verify a signed credential offline against a public key (PEM or KeyObject).
 * Rebuilds the canonical bytes from the credential minus its proof.
 */
export function verifyCredential(credential: SignedCredential, publicKey: string | KeyObject): boolean {
  const { proof, ...unsigned } = credential;
  if (!proof?.proofValue?.startsWith('z')) return false;
  const key = typeof publicKey === 'string' ? createPublicKey(publicKey) : publicKey;
  const signature = base58btcDecode(proof.proofValue.slice(1));
  return edVerify(null, Buffer.from(signingPayload(unsigned as UnsignedCredential)), key, signature);
}

// ─────────────────────────────────────────────
// Generic document signing — any JSON-LD credential (e.g. badge OB 3.0)
// ─────────────────────────────────────────────

/** Sign an arbitrary JSON-LD document (minus its proof) → a W3C Ed25519 proof. */
export function signDocument(
  doc: Record<string, unknown>,
  config: { privateKey: string | KeyObject; verificationMethod: string; created: string },
): Proof {
  const key = typeof config.privateKey === 'string' ? createPrivateKey(config.privateKey) : config.privateKey;
  const bytes = new TextEncoder().encode(canonicalize(doc));
  const signature = edSign(null, Buffer.from(bytes), key);
  return {
    type: 'Ed25519Signature2020',
    created: config.created,
    verificationMethod: config.verificationMethod,
    proofPurpose: 'assertionMethod',
    proofValue: `z${base58btcEncode(signature)}`,
  };
}

/** Verify any signed JSON-LD document offline against a public key. */
export function verifyDocument(signed: Record<string, unknown>, publicKey: string | KeyObject): boolean {
  const { proof, ...rest } = signed as { proof?: Proof } & Record<string, unknown>;
  if (!proof?.proofValue?.startsWith('z')) return false;
  const key = typeof publicKey === 'string' ? createPublicKey(publicKey) : publicKey;
  const signature = base58btcDecode(proof.proofValue.slice(1));
  return edVerify(null, Buffer.from(new TextEncoder().encode(canonicalize(rest))), key, signature);
}
