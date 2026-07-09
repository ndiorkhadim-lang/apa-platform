/**
 * APA contact & social — single source of truth, used by the footer, the
 * Contact page and structured data. Edit here once; every page updates.
 */
export const APA_CONTACT = {
  entity: 'APA Sénégal SARL — Accountable Partners for Africa™',
  email: 'pape@theapaafrica.org',
  phone: '(+221) 78 839 15 84',
  phoneHref: '+221788391584',
  website: 'https://www.theapaafrica.org/',
} as const;

/** The three official APA offices. */
export interface Office {
  country: string;
  flag: string;
  lines: string[];
  isHQ?: boolean;
}

export const APA_OFFICES: Office[] = [
  {
    country: 'Sénégal',
    flag: '🇸🇳',
    isHQ: true,
    lines: ['Liberté 5, N° 5486B, 4ème #10', 'Dakar, Sénégal'],
  },
  {
    country: 'Nigéria',
    flag: '🇳🇬',
    lines: ['90, Aminu Kano Crescent', 'Wuse, Abuja 904101', 'Federal Capital Territory, Nigeria'],
  },
  {
    country: 'Mauritius',
    flag: '🇲🇺',
    lines: [
      'C/o Nexus Global Financial Services Limited',
      '5th Floor, The Core Building, N° 62',
      'ICT Avenue, CyberCity, Ebene, Mauritius',
    ],
  },
];

export const APA_SOCIALS: { key: string; label: string; href: string; glyph: string }[] = [
  { key: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/company/theapaafrica', glyph: 'in' },
  { key: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/@theapaafrica', glyph: '▶' },
  { key: 'x', label: 'X (Twitter)', href: 'https://x.com/ApaAfrica', glyph: '𝕏' },
];
