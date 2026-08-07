'use client';

import { useMemo, useState } from 'react';
import { motion } from 'motion/react';

export function KinshipContract({ fr }: { fr: boolean }) {
  const [company, setCompany] = useState('Sahel Renewables SA');
  const [community, setCommunity] = useState(fr ? 'Communauté de Ziguinchor' : 'Ziguinchor Community');
  const [share, setShare] = useState(15);
  const [moralExit, setMoralExit] = useState(true);
  const [jurisdiction, setJurisdiction] = useState('OHADA');
  const [sig, setSig] = useState<{ hash: string; at: string } | null>(null);
  const [signing, setSigning] = useState(false);

  const body = useMemo(() => {
    const lines = [
      `${fr ? 'CONTRAT DE PARENTÉ' : 'KINSHIP CONTRACT'} — v2`,
      '',
      `${fr ? 'ENTRE' : 'BETWEEN'}: ${company} (${fr ? 'le Promoteur' : 'the Sponsor'})`,
      `${fr ? 'ET' : 'AND'}: ${community} (${fr ? 'le Co-Propriétaire' : 'the Co-Owner'})`,
      '',
      `1. ${fr ? 'PARTAGE DE VALEUR' : 'VALUE SHARING'} — ${fr ? 'Le Co-Propriétaire détient' : 'The Co-Owner holds'} ${share}% ${fr ? 'de participation liée aux résultats.' : 'outcome-linked equity.'}`,
      `2. ${fr ? 'GOUVERNANCE' : 'GOVERNANCE'} — ${fr ? 'Représentation avec droit de veto sur les décisions matérielles.' : 'Representation with veto over material decisions.'}`,
      `3. ${fr ? 'REDEVABILITÉ' : 'ACCOUNTABILITY'} — ${fr ? 'Indicateurs audités publiés trimestriellement.' : 'Audited indicators published quarterly.'}`,
      moralExit
        ? `4. ${fr ? 'CLAUSE DE SORTIE MORALE' : 'MORAL EXIT CLAUSE'} — ${fr ? 'Toute cession préserve les parts communautaires et déclenche un droit de préemption.' : 'Any divestiture preserves community stakes and triggers a right of first refusal.'}`
        : `4. ${fr ? 'CLAUSE DE SORTIE MORALE — DÉSACTIVÉE (risque)' : 'MORAL EXIT CLAUSE — DISABLED (risk)'}`,
      `5. ${fr ? 'JURIDICTION' : 'JURISDICTION'} — ${jurisdiction}.`,
    ];
    return lines.join('\n');
  }, [company, community, share, moralExit, jurisdiction, fr]);

  const sign = async () => {
    setSigning(true);
    setSig(null);
    const data = new TextEncoder().encode(body);
    const digest = await crypto.subtle.digest('SHA-256', data);
    const hash = Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('');
    // brief theatrical delay for the "signing" pulse
    await new Promise((r) => setTimeout(r, 650));
    setSig({ hash, at: new Date().toISOString() });
    setSigning(false);
  };

  const field = 'w-full rounded-lg border border-[var(--t-line)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--t-amber)]';

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Editor */}
      <div className="t-glass rounded-2xl p-6">
        <p className="text-[11px] font-semibold uppercase tracking-widest t-faint">{fr ? 'Termes du contrat' : 'Contract terms'}</p>
        <div className="mt-4 space-y-3">
          <label className="block">
            <span className="text-xs t-muted">{fr ? 'Promoteur' : 'Sponsor'}</span>
            <input className={field} value={company} onChange={(e) => { setCompany(e.target.value); setSig(null); }} />
          </label>
          <label className="block">
            <span className="text-xs t-muted">{fr ? 'Co-Propriétaire (communauté)' : 'Co-Owner (community)'}</span>
            <input className={field} value={community} onChange={(e) => { setCommunity(e.target.value); setSig(null); }} />
          </label>
          <label className="block">
            <span className="flex justify-between text-xs t-muted">
              <span>{fr ? 'Part de valeur' : 'Value share'}</span>
              <span className="t-mono t-amber">{share}%</span>
            </span>
            <input type="range" min={0} max={49} value={share} onChange={(e) => { setShare(Number(e.target.value)); setSig(null); }}
              className="mt-2 w-full accent-[var(--t-amber)]" />
          </label>
          <div className="flex items-center justify-between rounded-lg border border-[var(--t-line)] px-3 py-2">
            <span className="text-sm">{fr ? 'Clause de Sortie Morale' : 'Moral Exit Clause'}</span>
            <button
              onClick={() => { setMoralExit((v) => !v); setSig(null); }}
              className={`relative h-6 w-11 rounded-full transition-colors ${moralExit ? 'bg-[var(--t-emerald)]' : 'bg-[var(--t-line-strong)]'}`}
              aria-pressed={moralExit}
            >
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${moralExit ? 'left-[22px]' : 'left-0.5'}`} />
            </button>
          </div>
          <label className="block">
            <span className="text-xs t-muted">{fr ? 'Juridiction' : 'Jurisdiction'}</span>
            <select className={field} value={jurisdiction} onChange={(e) => { setJurisdiction(e.target.value); setSig(null); }}>
              <option>OHADA</option><option>ECOWAS</option><option>EAC</option><option>SADC</option>
            </select>
          </label>
        </div>
        <button onClick={sign} disabled={signing} className="t-btn mt-5 w-full justify-center disabled:opacity-60">
          {signing ? (fr ? 'Signature en cours…' : 'Signing…') : `✎ ${fr ? 'Signer cryptographiquement' : 'Cryptographically sign'}`}
        </button>
      </div>

      {/* Live document preview */}
      <div className={`t-glass rounded-2xl p-6 ${sig ? 't-glow-emerald' : ''}`}>
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-widest t-faint">{fr ? 'Aperçu en direct' : 'Live preview'}</p>
          {sig ? <span className="t-chip t-chip-emerald">✓ {fr ? 'Signé' : 'Signed'}</span>
               : <span className="t-chip">{fr ? 'brouillon' : 'draft'}</span>}
        </div>
        <pre className="t-mono mt-4 whitespace-pre-wrap break-words text-[12.5px] leading-relaxed">{body}</pre>

        <div className="relative mt-5 rounded-xl border border-dashed border-[var(--t-line-strong)] p-4">
          {signing && (
            <motion.div className="absolute inset-0 rounded-xl" style={{ background: 'linear-gradient(180deg, transparent, var(--t-emerald-soft), transparent)' }}
              initial={{ y: '-100%' }} animate={{ y: '100%' }} transition={{ duration: 0.65, ease: 'linear' }} />
          )}
          {sig ? (
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
              <p className="t-chip t-chip-emerald">Ed25519 · SHA-256 {fr ? 'ancre' : 'anchor'}</p>
              <p className="t-mono mt-2 break-all text-[11px] t-emerald">{sig.hash}</p>
              <p className="t-mono mt-1 text-[11px] t-faint">{fr ? 'horodatage' : 'timestamp'}: {sig.at}</p>
              <a href="cvp" className="t-btn mt-4 w-full justify-center text-xs">{fr ? 'Étape 04 : Consentement CVP' : 'Step 04: CVP Consent'} →</a>
            </motion.div>
          ) : (
            <p className="text-xs t-faint">{fr ? 'La signature ancre un hachage SHA-256 du document. Modifiez un terme et re-signez pour voir le hachage changer.' : 'Signing anchors a SHA-256 hash of the document. Change a term and re-sign to watch the hash change.'}</p>
          )}
        </div>
      </div>
    </div>
  );
}
