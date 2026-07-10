import { Link } from '@/i18n/navigation';
import type { ProfileDashboard, WidgetKind } from '@/domain/onboarding/profiles';
import { pick } from '@/domain/onboarding/profiles';
import { getResourceBySlug } from '@/data/resources';
import { getJourneyBySlug } from '@/data/journeys';
import { SOLUTION_LABEL } from '@/types/resource';

/**
 * Role-Based Experience renderer — an app-shell dashboard whose layout, KPIs,
 * widgets, navigation and recommendations are entirely driven by the profile.
 * Each profile composes a distinct ordered set of widgets (profile.layout).
 */

const ACCENT_BAR: Record<string, string> = {
  green: 'apa-gradient',
  navy: 'bg-apa-navy',
  gold: 'bg-apa-gold-bright',
  teal: 'bg-apa-teal',
  bronze: 'bg-apa-bronze',
};
const NOTIF_DOT: Record<string, string> = {
  info: 'bg-apa-teal', success: 'bg-apa-green', warn: 'bg-apa-gold-bright', action: 'bg-apa-bronze',
};

export function RoleDashboard({
  profile,
  locale,
  userName,
  currentNav = '/app',
}: {
  profile: ProfileDashboard;
  locale: string;
  userName: string;
  currentNav?: string;
}) {
  const fr = locale !== 'en';

  return (
    <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
      {/* Profile-specific navigation */}
      <nav aria-label="Dashboard navigation" className="lg:sticky lg:top-24 lg:self-start">
        <div className="mb-3 flex items-center gap-2 px-2 text-xs font-bold uppercase tracking-wide text-apa-grey">
          <span>{profile.icon}</span> {pick(profile.group, fr)}
        </div>
        <ul className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
          {profile.nav.map((n) => {
            const active = n.href === currentNav;
            return (
              <li key={n.href + n.icon}>
                <Link
                  href={n.href}
                  className={`flex items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                    active ? 'bg-apa-green text-white' : 'text-apa-navy hover:bg-apa-soft'
                  }`}
                >
                  <span aria-hidden>{n.icon}</span>
                  <span>{pick(n.label, fr)}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Main column */}
      <div className="min-w-0 space-y-8">
        {profile.layout.map((kind) => (
          <Widget key={kind} kind={kind} profile={profile} fr={fr} userName={userName} />
        ))}
      </div>
    </div>
  );
}

function Widget({ kind, profile, fr, userName }: { kind: WidgetKind; profile: ProfileDashboard; fr: boolean; userName: string }) {
  switch (kind) {
    case 'kpis':
      return (
        <section aria-label="Key metrics" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {profile.kpis.map((k) => (
            <div key={k.label.en} className="rounded-apa-lg border border-apa-line bg-white p-4">
              <div className="text-[11px] font-bold uppercase tracking-wide text-apa-grey">{pick(k.label, fr)}</div>
              <div className="mt-1 text-2xl font-bold text-apa-navy">{k.value}</div>
              {k.delta ? (
                <div className={`mt-0.5 text-xs font-semibold ${k.up === false ? 'text-apa-bronze' : 'text-apa-green'}`}>
                  {k.up === false ? '▾' : '▴'} {k.delta}
                </div>
              ) : null}
            </div>
          ))}
        </section>
      );

    case 'quickActions':
      return (
        <section aria-label="Quick actions">
          <H fr={fr} en="Quick actions" frr="Actions rapides" />
          <div className="mt-3 flex flex-wrap gap-2.5">
            {profile.quickActions.map((a) => (
              <Link
                key={a.href + a.icon}
                href={a.href}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition-colors ${
                  a.primary ? 'apa-gradient text-white hover:opacity-95' : 'border border-apa-line bg-white text-apa-navy hover:border-apa-green'
                }`}
              >
                <span aria-hidden>{a.icon}</span> {pick(a.label, fr)}
              </Link>
            ))}
          </div>
        </section>
      );

    case 'certification': {
      const c = profile.certification;
      return (
        <section aria-label="Certification status" className="rounded-apa-lg border border-apa-line bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <H fr={fr} en="Certification status" frr="Statut de certification" inline />
            <span className="rounded-full bg-apa-green/10 px-3 py-1 text-xs font-bold text-apa-green">{pick(c.status, fr)}</span>
          </div>
          {c.progress > 0 ? (
            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-apa-soft">
              <div className="apa-gradient h-full" style={{ width: `${c.progress}%` }} />
            </div>
          ) : null}
          <p className="mt-2 text-sm text-apa-grey">{pick(c.note, fr)}</p>
        </section>
      );
    }

    case 'chart': {
      if (!profile.chart) return null;
      const max = Math.max(...profile.chart.bars.map((b) => b.value), 1);
      return (
        <section aria-label="Analytics" className="rounded-apa-lg border border-apa-line bg-white p-5">
          <H fr={fr} en={profile.chart.title.en} frr={profile.chart.title.fr} />
          <div className="mt-4 space-y-2.5">
            {profile.chart.bars.map((b) => (
              <div key={b.label} className="flex items-center gap-3 text-xs">
                <span className="w-36 shrink-0 font-semibold text-apa-navy">{b.label}</span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-apa-soft">
                  <div className={`h-full ${ACCENT_BAR[profile.accent]}`} style={{ width: `${(b.value / max) * 100}%` }} />
                </div>
                <span className="w-12 text-right font-bold text-apa-navy">{b.display}</span>
              </div>
            ))}
          </div>
        </section>
      );
    }

    case 'ai':
      return (
        <section aria-label="AI Concierge" className="overflow-hidden rounded-apa-lg border border-apa-gold bg-apa-gold/5">
          <div className="flex items-center gap-2 border-b border-apa-gold/40 px-5 py-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full apa-gradient text-white">✦</span>
            <span className="text-sm font-bold text-apa-navy">{fr ? 'Concierge IA — suggéré pour vous' : 'AI Concierge — suggested for you'}</span>
          </div>
          <div className="flex flex-col gap-2 p-4">
            {profile.ai.map((s) => (
              <Link
                key={s.en}
                href="/resources#assistant"
                className="flex items-center justify-between gap-3 rounded-lg border border-apa-line bg-white px-4 py-2.5 text-sm font-medium text-apa-ink transition-colors hover:border-apa-green"
              >
                <span>{pick(s, fr)}</span>
                <span className="shrink-0 text-apa-green">→</span>
              </Link>
            ))}
          </div>
        </section>
      );

    case 'notifications':
      return (
        <section aria-label="Notifications" className="rounded-apa-lg border border-apa-line bg-white p-5">
          <H fr={fr} en="Notifications" frr="Notifications" />
          <ul className="mt-3 space-y-3">
            {profile.notifications.map((n, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${NOTIF_DOT[n.kind]}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-apa-ink">{pick(n.text, fr)}</p>
                  <p className="text-[11px] text-apa-grey">{pick(n.when, fr)}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      );

    case 'journeys': {
      const journeys = profile.recJourneys.map((s) => getJourneyBySlug(s)).filter(Boolean);
      if (!journeys.length) return null;
      return (
        <section aria-label="Recommended journeys">
          <H fr={fr} en="Recommended journeys" frr="Journeys recommandés" />
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {journeys.map((j) => (
              <Link key={j!.id} href={`/journeys/${j!.slug}`} className="group flex items-center gap-3 rounded-apa-lg border border-apa-line bg-white p-4 hover:border-apa-green">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg apa-gradient text-xl">{j!.countryFlag}</span>
                <span className="min-w-0">
                  <span className="block truncate font-bold text-apa-navy group-hover:text-apa-green">{j!.title}</span>
                  <span className="block text-xs text-apa-grey">{j!.country} · {j!.durationDays} {fr ? 'jours' : 'days'}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      );
    }

    case 'solutions': {
      if (!profile.recSolutions.length) return null;
      return (
        <section aria-label="Recommended solutions">
          <H fr={fr} en="Recommended solutions" frr="Solutions recommandées" />
          <div className="mt-3 flex flex-wrap gap-2">
            {profile.recSolutions.map((s) => (
              <Link key={s} href="/solutions" className="rounded-full border border-apa-sage bg-apa-soft px-3.5 py-1.5 text-sm font-semibold text-apa-green hover:bg-apa-green hover:text-white">
                {SOLUTION_LABEL[s] ?? s}
              </Link>
            ))}
          </div>
        </section>
      );
    }

    case 'resources': {
      const resources = profile.recResources.map((s) => getResourceBySlug(s)).filter(Boolean);
      if (!resources.length) return null;
      return (
        <section aria-label="Recommended resources">
          <H fr={fr} en="Recommended reading" frr="Lectures recommandées" />
          <div className="mt-3 grid gap-4 sm:grid-cols-3">
            {resources.map((r) => (
              <Link key={r!.id} href={`/resources/${r!.slug}`} className="group rounded-apa-lg border border-apa-line bg-white p-4 hover:border-apa-green">
                <span className="text-[10px] font-bold uppercase text-apa-grey">{r!.type}</span>
                <span className="mt-1 block text-sm font-bold leading-snug text-apa-navy group-hover:text-apa-green">{r!.title}</span>
                <span className="mt-2 block text-[11px] text-apa-grey">{r!.readingMinutes} {fr ? 'min' : 'min'} · ★ {r!.rating.toFixed(1)}</span>
              </Link>
            ))}
          </div>
        </section>
      );
    }

    default:
      return null;
  }
}

function H({ en, frr, fr, inline }: { en: string; frr: string; fr: boolean; inline?: boolean }) {
  return (
    <h2 className={inline ? 'text-lg font-bold text-apa-navy' : 'text-lg font-bold text-apa-navy'}>
      {fr ? frr : en}
    </h2>
  );
}
