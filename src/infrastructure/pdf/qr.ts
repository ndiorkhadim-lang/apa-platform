import QRCode from 'qrcode';

/**
 * Render a QR code as an inline SVG string (crisp at any print DPI, no raster).
 * Pure JS — safe on serverless, no headless browser. Dark modules on a
 * transparent background so it drops onto either the paper sheet or the black
 * canvas. Used by the certificate deliverable to encode the /verify URL.
 */
export async function qrSvg(
  text: string,
  opts: { dark?: string; margin?: number } = {},
): Promise<string> {
  return QRCode.toString(text, {
    type: 'svg',
    errorCorrectionLevel: 'M',
    margin: opts.margin ?? 0,
    color: { dark: opts.dark ?? '#0a0a0a', light: '#00000000' },
  });
}
