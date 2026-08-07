/**
 * Authenticity Premium™ telemetry — pure projection of a C-SPA composite into
 * the financial signals the board cares about: cost-of-capital compression
 * (basis points) and valuation uplift (USD). Deterministic, no I/O.
 *
 * Anchors (APA doctrine): a CERTIFIED enterprise (composite ≥ 70 gate) saves
 * 300–500 bps of cost of capital and carries a ~$2.5M valuation uplift. Below
 * the gate the premium is provisional and scales toward the gate.
 */

import { CSPA_PASS } from '@/domain/cspa/engine';

export const MAX_BPS = 500;
export const GATE_BPS = 300;
export const MAX_VALUATION_USD = 2_500_000;

export interface PremiumTelemetry {
  composite: number; // 0..100 (clamped)
  gatePassed: boolean;
  /** Cost-of-capital compression in basis points. */
  bpsCompression: number;
  /** Valuation uplift in USD (rounded to nearest 10k). */
  valuationUpliftUsd: number;
  /** 0..100 executive trust index (== clamped composite). */
  trustIndex: number;
}

function clamp(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, n));
}

export function computePremiumTelemetry(compositeRaw: number): PremiumTelemetry {
  const composite = clamp(compositeRaw);
  const gatePassed = composite >= CSPA_PASS;

  const bpsCompression = gatePassed
    ? Math.round(GATE_BPS + ((composite - CSPA_PASS) / (100 - CSPA_PASS)) * (MAX_BPS - GATE_BPS))
    : Math.round((composite / CSPA_PASS) * GATE_BPS);

  // Reward the certified band: quadratic-ish easing toward the $2.5M ceiling.
  const ratio = composite / 100;
  const valuationUpliftUsd = Math.round((ratio ** 1.15 * MAX_VALUATION_USD) / 10_000) * 10_000;

  return {
    composite,
    gatePassed,
    bpsCompression,
    valuationUpliftUsd,
    trustIndex: composite,
  };
}
