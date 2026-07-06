import 'server-only';

/**
 * Transactional email — Resend-ready.
 * Without RESEND_API_KEY the send is logged (dev) so flows stay testable;
 * setting the key activates real delivery with zero code change.
 */
interface Mail {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(mail: Mail): Promise<{ sent: boolean }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log(`[email:dev] to=${mail.to} subject="${mail.subject}"`);
    return { sent: false };
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM ?? 'APA <no-reply@theapaafrica.org>',
      to: mail.to,
      subject: mail.subject,
      html: mail.html,
    }),
  });
  return { sent: res.ok };
}

const shell = (title: string, body: string) => `
<div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:560px;margin:0 auto">
  <div style="background:linear-gradient(157deg,#0A5C36,#0B5C4E 48%,#0D2B4E);padding:28px;border-radius:8px 8px 0 0">
    <span style="color:#D4AF37;font-weight:800;font-size:20px">APA™</span>
    <h1 style="color:#fff;font-size:20px;margin:12px 0 0">${title}</h1>
  </div>
  <div style="border:1px solid #d9e2df;border-top:0;padding:24px;border-radius:0 0 8px 8px;color:#1F2933;font-size:14px;line-height:1.6">
    ${body}
    <p style="margin-top:24px;color:#5b6b66;font-size:12px">APA™ — Accountable Partners for Africa · theapaafrica.org</p>
  </div>
</div>`;

export const emailTemplates = {
  championSubmitted: (name: string, locale: string) =>
    locale === 'fr'
      ? {
          subject: 'Candidature Champion APA™ bien reçue',
          html: shell(
            'Candidature reçue',
            `<p>Bonjour ${name},</p><p>Votre candidature au <b>Programme Champions APA™</b> a bien été soumise. Notre comité l'examine sous <b>10 jours ouvrés</b> ; vous suivrez chaque étape (présélection, entretien, décision) depuis votre espace.</p><p><i>« L'éthique en Alpha. La confiance comme monnaie. »</i></p>`
          ),
        }
      : {
          subject: 'APA™ Champion application received',
          html: shell(
            'Application received',
            `<p>Hello ${name},</p><p>Your <b>APA™ Champions Program</b> application has been submitted. Our committee reviews it within <b>10 business days</b>; you can track every stage (screening, interview, decision) from your workspace.</p><p><i>"Ethics into Alpha. Trust as Currency."</i></p>`
          ),
        },
  championStatusChange: (name: string, status: string, locale: string) =>
    locale === 'fr'
      ? {
          subject: `Programme Champions APA™ — votre dossier passe à l'étape : ${status}`,
          html: shell(
            'Mise à jour de votre candidature',
            `<p>Bonjour ${name},</p><p>Votre dossier Champion APA™ vient de passer à l'étape <b>${status}</b>. Connectez-vous à votre espace pour les détails.</p>`
          ),
        }
      : {
          subject: `APA™ Champions Program — your file moved to: ${status}`,
          html: shell(
            'Application update',
            `<p>Hello ${name},</p><p>Your APA™ Champion file just moved to <b>${status}</b>. Sign in to your workspace for details.</p>`
          ),
        },
};
