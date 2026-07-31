import 'server-only';

/**
 * Issuer identity for Verifiable Credential issuance & DID resolution.
 * Ratified default DID = did:web:apa-platform-five.vercel.app (Vercel domain
 * kept by explicit product decision; sovereignty caveat noted at design time).
 * Keys come from env — never hard-coded.
 */

const DEFAULT_DID = 'did:web:apa-platform-five.vercel.app';
const DEFAULT_NAME = 'African Public Administration Institute';
const KEY_FRAGMENT = 'key-1';

export interface IssuerConfig {
  did: string;
  name: string;
  keyFragment: string;
  verificationMethod: string; // did#key-1
  /** Domain segment of a did:web (for /.well-known/did.json host matching). */
  domain: string;
  privateKeyPem: string | null;
  publicKeyPem: string | null;
}

export function getIssuerConfig(): IssuerConfig {
  const did = process.env.APA_ISSUER_DID?.trim() || DEFAULT_DID;
  const domain = did.replace(/^did:web:/, '').split(':')[0];
  const priv = process.env.APA_ISSUER_PRIVATE_KEY_PEM;
  const pub = process.env.APA_ISSUER_PUBLIC_KEY_PEM;
  return {
    did,
    name: process.env.APA_ISSUER_NAME?.trim() || DEFAULT_NAME,
    keyFragment: KEY_FRAGMENT,
    verificationMethod: `${did}#${KEY_FRAGMENT}`,
    domain,
    privateKeyPem: priv && priv.trim() ? priv : null,
    publicKeyPem: pub && pub.trim() ? pub : null,
  };
}
