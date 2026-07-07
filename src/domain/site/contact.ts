/**
 * APA contact & social — single source of truth, used by the footer, the
 * Contact page and structured data. Edit here once; every page updates.
 */
export const APA_CONTACT = {
  entity: 'APA Sénégal SARL — Accountable Partners for Africa™',
  addressEn: 'Continental HQ · Dakar, Senegal',
  addressFr: 'Siège continental · Dakar, Sénégal',
  email: 'pape@theapaafrica.org',
  phone: '+221 78 839 15 84',
  phoneHref: '+221788391584',
  website: 'https://www.theapaafrica.org/',
} as const;

export const APA_SOCIALS: { key: string; label: string; href: string; glyph: string }[] = [
  { key: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/company/theapaafrica', glyph: 'in' },
  { key: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/@theapaafrica', glyph: '▶' },
  { key: 'x', label: 'X (Twitter)', href: 'https://x.com/ApaAfrica', glyph: '𝕏' },
];
