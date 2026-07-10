import Image from 'next/image';
import type { Resource } from '@/types/resource';
import { SOLUTION_LABEL, PILLAR_LABEL } from '@/types/resource';
import { APA_CONTACT, APA_OFFICES } from '@/domain/site/contact';

/**
 * APA Official Publication — the branded document template modeled on the
 * APA letterhead. Renders the on-screen "Read Online" experience and, via
 * print CSS (globals.css .apa-publication rules), the downloadable PDF:
 * chevron bands, letterhead header, APA watermark, offices footer,
 * version, publication date and copyright on every export.
 */

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

/** Pastel chevron band (the letterhead's zigzag motif). */
function ChevronBand({ flip = false }: { flip?: boolean }) {
  const chevrons = Array.from({ length: 24 });
  return (
    <div aria-hidden className={`flex justify-center overflow-hidden ${flip ? 'rotate-180' : ''}`}>
      <svg width="100%" height="18" viewBox="0 0 960 18" preserveAspectRatio="none" className="max-w-full">
        {chevrons.map((_, i) => (
          <path
            key={i}
            d={`M${i * 40} 18 L${i * 40 + 20} 4 L${i * 40 + 40} 18 Z`}
            fill={i % 2 === 0 ? '#d9efe2' : '#d6e9f7'}
          />
        ))}
      </svg>
    </div>
  );
}

/** Letterhead masthead: logo · divider · wordmark + tagline. */
function Masthead() {
  return (
    <div className="flex items-center justify-center gap-4 py-6">
      <Image src="/apa-logo.png" alt="APA" width={132} height={54} className="h-14 w-auto" />
      <div className="h-16 w-px bg-apa-ink/70" />
      <div>
        <div className="text-2xl font-bold leading-tight tracking-tight text-apa-ink" style={{ fontFamily: 'Georgia, serif' }}>
          Accountable<br />Partners<br />for Africa
        </div>
        <div className="mt-0.5 text-[10px] font-bold italic text-apa-green-mid">
          Building Trust Accountability &amp; Impact
        </div>
      </div>
    </div>
  );
}

/** Letterhead footer: website rule + the three offices with green pills. */
function OfficesFooter() {
  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-apa-ink/40" />
        <span className="text-[11px] font-semibold tracking-[0.25em] text-apa-ink">www.theapaafrica.org</span>
        <div className="h-px flex-1 bg-apa-ink/40" />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4 text-[10px] leading-relaxed text-apa-ink">
        {APA_OFFICES.map((o, i) => (
          <div key={o.country} className={i > 0 ? 'border-l border-apa-ink/30 pl-4' : ''}>
            <span className="inline-block rounded bg-[#22b14c] px-2.5 py-0.5 text-[9px] font-bold text-white">
              {o.country}
            </span>
            <div className="mt-1.5 space-y-0.5">
              {o.lines.map((l) => (
                <div key={l} className="flex gap-1">
                  <span className="text-[#22b14c]">📍</span>
                  <span>{l}</span>
                </div>
              ))}
              {o.isHQ ? (
                <>
                  <div className="flex gap-1"><span className="text-[#22b14c]">📞</span><span>Phone : {APA_CONTACT.phone}</span></div>
                  <div className="flex gap-1"><span className="text-[#22b14c]">✉️</span><span>Email : {APA_CONTACT.email}</span></div>
                </>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PubSection({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <section className="pub-section mt-8" style={{ breakInside: 'avoid-page' }}>
      <div className="flex items-center gap-3">
        <span className="apa-secnum text-xs">{num}</span>
        <h2 className="text-lg font-bold text-apa-navy">{title}</h2>
      </div>
      <div className="apa-rule my-2.5" style={{ width: 64 }} />
      <div className="text-[13.5px] leading-[1.75] text-apa-ink">{children}</div>
    </section>
  );
}

export function PublicationDocument({ resource }: { resource: Resource }) {
  const r = resource;
  const version = r.version ?? '1.0';
  const year = new Date(r.publishedAt).getFullYear();
  const docRef = `APA-PUB-${year}-${r.id.replace(/^r_/, '').toUpperCase().slice(0, 12)}`;

  return (
    <div className="apa-publication relative bg-white">
      {/* Watermark — fixed so it repeats on every printed page */}
      <div aria-hidden className="pub-watermark pointer-events-none fixed inset-0 z-0 flex items-center justify-center">
        <Image src="/apa-logo.png" alt="" width={640} height={260} className="w-[78%] max-w-2xl opacity-[0.05]" />
      </div>

      {/* Running print footer (repeats on every printed page) */}
      <div aria-hidden className="pub-running-footer">
        © {year} Accountable Partners for Africa™ · www.theapaafrica.org · {docRef} · Version {version} · Published {fmtDate(r.publishedAt)}
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-10 pb-10">
        {/* ── Cover / letterhead ── */}
        <ChevronBand />
        <Masthead />

        <div className="mt-10 text-center">
          <span className="apa-badge">{r.type} · Official APA Publication</span>
          <h1 className="mx-auto mt-6 max-w-2xl text-3xl font-bold leading-tight text-apa-navy" style={{ fontFamily: 'Georgia, serif' }}>
            {r.title}
          </h1>
          <div className="mx-auto mt-4 h-1 w-24 bg-apa-gold" />
          <p className="mx-auto mt-5 max-w-xl text-[13.5px] italic leading-relaxed text-apa-grey">{r.executiveSummary}</p>
        </div>

        <div className="mx-auto mt-8 max-w-md rounded-apa border border-apa-line bg-apa-soft/60 p-4 text-[11px] leading-relaxed">
          <div className="grid grid-cols-2 gap-x-6 gap-y-1">
            <div><span className="font-bold text-apa-navy">Author:</span> {r.author}</div>
            <div><span className="font-bold text-apa-navy">Publication date:</span> {fmtDate(r.publishedAt)}</div>
            <div><span className="font-bold text-apa-navy">Version:</span> {version}</div>
            <div><span className="font-bold text-apa-navy">Reference:</span> {docRef}</div>
            <div><span className="font-bold text-apa-navy">Language:</span> {[r.language, ...r.otherLanguages].join(' · ')}</div>
            <div><span className="font-bold text-apa-navy">Reading time:</span> {r.readingMinutes} min</div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="pub-body" style={{ breakBefore: 'page' }}>
          <PubSection num="01" title="Executive Overview"><p>{r.executiveOverview}</p></PubSection>
          <PubSection num="02" title="Purpose"><p>{r.purpose}</p></PubSection>
          <PubSection num="03" title="Business Value"><p>{r.businessValue}</p></PubSection>
          <PubSection num="04" title="Key Insights">
            <ul className="space-y-1.5">
              {r.keyInsights.map((k) => (
                <li key={k} className="flex gap-2"><span className="text-apa-gold">◆</span><span>{k}</span></li>
              ))}
            </ul>
          </PubSection>

          {r.stats?.length ? (
            <PubSection num="05" title="The Numbers">
              <div className="space-y-3">
                {r.stats.map((s) => (
                  <div key={s.label}>
                    <div className="flex items-baseline justify-between text-[12px]">
                      <span className="font-semibold">{s.label}</span>
                      <span className="font-bold text-apa-green">{s.value}</span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-apa-soft">
                      <div className="apa-gradient h-full" style={{ width: `${s.pct}%` }} />
                    </div>
                    {s.note ? <div className="mt-0.5 text-[10.5px] text-apa-grey">{s.note}</div> : null}
                  </div>
                ))}
              </div>
            </PubSection>
          ) : null}

          {r.fullContent?.map((sec, i) => (
            <PubSection key={sec.heading} num={String(i + (r.stats?.length ? 6 : 5)).padStart(2, '0')} title={sec.heading}>
              <div className="space-y-3">
                {sec.paragraphs.map((p) => <p key={p.slice(0, 40)}>{p}</p>)}
              </div>
            </PubSection>
          ))}

          {r.transcript?.length ? (
            <PubSection num="TR" title={r.type === 'Podcast' ? 'Episode Transcript' : 'Transcript'}>
              <div className="space-y-2.5">
                {r.transcript.map((t, i) => (
                  <p key={i}>
                    {t.time ? <span className="mr-2 font-mono text-[11px] text-apa-grey">[{t.time}]</span> : null}
                    {t.speaker ? <strong className="text-apa-navy">{t.speaker} — </strong> : null}
                    {t.text}
                  </p>
                ))}
              </div>
            </PubSection>
          ) : null}

          <PubSection num="◆" title="Connected in the APA Ecosystem">
            <div className="space-y-1.5 text-[12.5px]">
              {r.relatedSolutions.length ? <p><strong className="text-apa-navy">Solutions:</strong> {r.relatedSolutions.map((s) => SOLUTION_LABEL[s] ?? s).join(' · ')}</p> : null}
              {r.relatedFrameworks.length ? <p><strong className="text-apa-navy">Frameworks:</strong> {r.relatedFrameworks.map((f) => PILLAR_LABEL[f] ?? f).join(' · ')}</p> : null}
              {r.relatedTools.length ? <p><strong className="text-apa-navy">Tools:</strong> {r.relatedTools.map((t) => `#${t}`).join(' · ')}</p> : null}
              {r.relatedCertifications.length ? <p><strong className="text-apa-navy">Certifications:</strong> {r.relatedCertifications.join(' · ')}</p> : null}
            </div>
          </PubSection>
        </div>

        {/* ── Closing letterhead footer ── */}
        <div className="mt-14" style={{ breakInside: 'avoid-page' }}>
          <div className="mb-6 rounded-apa border border-apa-line bg-apa-soft/50 p-4 text-center text-[10px] leading-relaxed text-apa-grey">
            © {year} Accountable Partners for Africa™ (APA). All rights reserved. This publication is issued under the
            APA Knowledge &amp; Resource Center. Reference {docRef} · Version {version} · Published {fmtDate(r.publishedAt)}.
            No part may be reproduced without attribution to APA — www.theapaafrica.org.
          </div>
          <OfficesFooter />
          <div className="mt-6"><ChevronBand flip /></div>
        </div>
      </div>
    </div>
  );
}
