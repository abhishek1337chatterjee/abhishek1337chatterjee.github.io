import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useContributions } from '../../hooks/useContributions';
import { useAbout, useSiteSettings, useSocials } from '../../hooks/useSanityData';
import { getProfileImageUrl } from '../../lib/sanity';
import Breadcrumb from '../ui/Breadcrumb';
import TelemetryBadge from '../ui/TelemetryBadge';

const GH_USER = 'abhishek1337chatterjee';

// Toggle to preview the optional theme-matched "operator" avatar (compare with/without).
const SHOW_AVATAR = true;

// Hero tagline. Brand copy — could move to Sanity later.
const TAGLINE_PREFIX = 'Serverless Engineer building ';
const TAGLINE_ACCENT = 'event-driven systems on AWS';
const TAGLINE_SUFFIX = ' — and the React frontends in front of them.';

// The name's second segment cycles like a typed terminal token, sourced from
// Sanity (about.title's `|`-separated segments). Starts as the real surname
// (paints first → LCP/SEO safe), then enhances after mount.
function useTypedSuffix(enabled: boolean, words: string[]): string {
  const [text, setText] = useState(words[0] ?? '');
  const key = words.join('|');

  // biome-ignore lint/correctness/useExhaustiveDependencies: `key` encodes `words`
  useEffect(() => {
    if (!enabled || words.length < 2) {
      setText(words[0] ?? '');
      return;
    }
    let wi = 0;
    let ci = words[0].length;
    let phase: 'pausing' | 'deleting' | 'typing' = 'pausing';
    let timer = 0;

    const step = () => {
      if (phase === 'pausing') {
        phase = 'deleting';
        timer = window.setTimeout(step, 1600);
        return;
      }
      if (phase === 'deleting') {
        ci -= 1;
        setText(words[wi].slice(0, ci));
        if (ci <= 0) {
          phase = 'typing';
          wi = (wi + 1) % words.length;
        }
        timer = window.setTimeout(step, 45);
        return;
      }
      ci += 1;
      setText(words[wi].slice(0, ci));
      if (ci >= words[wi].length) phase = 'pausing';
      timer = window.setTimeout(step, 75);
    };

    timer = window.setTimeout(step, 2500);
    return () => window.clearTimeout(timer);
  }, [enabled, key]);

  return text;
}

// Real contribution series → responsive area sparkline.
function Sparkline({ weeks, play }: { weeks: number[]; play: boolean }) {
  if (weeks.length < 2) return <div className="h-16 w-full" />;
  const W = 600;
  const H = 64;
  const max = Math.max(...weeks, 1);
  const pts = weeks.map((v, i) => {
    const x = (i / (weeks.length - 1)) * W;
    const y = H - (v / max) * (H - 6) - 3;
    return [x, y] as const;
  });
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const area = `${line} L${W},${H} L0,${H} Z`;
  // total polyline length → drives the stroke-dashoffset "draw-in"
  let len = 0;
  for (let i = 1; i < pts.length; i++) {
    len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  }
  const L = Math.round(len);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-16 w-full" aria-hidden="true">
      <defs>
        <linearGradient id="hero-spark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#hero-spark)" />
      <path
        d={line}
        fill="none"
        stroke="var(--primary)"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        style={
          {
            '--len': L,
            strokeDasharray: L,
            strokeDashoffset: L,
            animation: play ? 'traceDraw 2.4s ease 0.15s forwards' : undefined,
            filter: 'drop-shadow(0 0 4px color-mix(in srgb, var(--primary) 55%, transparent))',
          } as React.CSSProperties
        }
      />
    </svg>
  );
}

function StatTile({ label, value, sub, accent }: { label: string; value: string; sub: string; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-line bg-base-200/40 p-4">
      <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">{label}</span>
      <p
        className="mt-1.5 font-display text-xl font-bold text-ink"
        style={accent ? { color: 'var(--primary)' } : undefined}
      >
        {value}
      </p>
      <span className="font-mono text-[11px] text-muted">{sub}</span>
    </div>
  );
}

// Honest-mapped telemetry band — real where it can be, never fabricated.
function HeroStats({ region, tier, play }: { region: string; tier: string; play: boolean }) {
  const { total, weeks } = useContributions(GH_USER);
  const count = total ? total.toLocaleString() : '—';

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <StatTile label="uptime" value="since 2024" sub="building serverless" />
      <StatTile label="contributions" value={count} sub="last 12 months" />
      <StatTile label="region" value={region} sub={`${tier} tier`} />
      <StatTile label="status" value="operational" sub="all systems" accent />

      <div className="col-span-2 rounded-xl border border-line bg-base-200/40 p-4 lg:col-span-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
            contribution activity · last year
          </span>
          {total > 0 && (
            <span className="font-mono text-xs" style={{ color: 'var(--primary)' }}>
              {count} commits
            </span>
          )}
        </div>
        <div className="mt-3">
          <Sparkline weeks={weeks} play={play} />
        </div>
      </div>
    </div>
  );
}

function findSocial(socials: { name: string; url: string }[] | undefined, name: string) {
  return socials?.find((s) => s.name.toLowerCase() === name.toLowerCase())?.url;
}

export default function Hero({ booted = false }: { booted?: boolean }) {
  const { about } = useAbout();
  const { settings } = useSiteSettings();
  const { socials } = useSocials();
  const reduce = useReducedMotion();

  const displayName = (about?.name ?? 'Abhishek Chatterjee').toLowerCase().replace(/\s+/g, '.');
  const firstName = displayName.split('.')[0] ?? 'abhishek';
  const surname = displayName.split('.').slice(1).join('.') || 'chatterjee';
  // rotation tokens from Sanity: surname + each `|`-separated about.title segment.
  // spaces AND hyphens collapse to "." so tokens match the "abhishek." dot style
  const titleTokens = (about?.title ?? '')
    .split('|')
    .map((s) => s.trim().toLowerCase().replace(/[\s-]+/g, '.'))
    .filter(Boolean);
  const tokens = [surname, ...titleTokens.filter((t) => t !== surname)];
  const typed = useTypedSuffix(!reduce, tokens);
  const github = findSocial(socials, 'GitHub');
  const linkedin = findSocial(socials, 'LinkedIn');
  const resume = settings?.resumeUrl ?? '/Abhishek-Chatterjee-Resume.pdf';
  const avatarUrl = SHOW_AVATAR ? getProfileImageUrl(about?.profileImage, 160) : undefined;
  const region = 'ap-south-1';
  const tier = 'serverless';

  const scrollTo = (id: string) => () =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const ctaSecondary =
    'rounded-lg border border-line bg-base-200/40 px-5 py-2.5 text-ink transition-colors hover:border-[color:var(--primary)] hover:text-[color:var(--primary)]';

  return (
    <section id="top" className="relative flex min-h-[88vh] items-center px-5 py-16 sm:px-8 lg:px-16">
      <div className="mx-auto w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
          className="flex flex-col gap-5"
        >
          {/* status row */}
          <div className="flex items-center gap-3.5">
            {avatarUrl && (
              <img
                src={avatarUrl}
                alt={about?.name ?? ''}
                width={64}
                height={64}
                className="size-16 rounded-xl object-cover grayscale transition duration-300 hover:grayscale-0"
                style={{
                  outline: '2px solid color-mix(in srgb, var(--primary) 45%, transparent)',
                  outlineOffset: 3,
                }}
              />
            )}
            <div className="flex flex-col gap-1.5">
              <TelemetryBadge status="HEALTHY" wide />
              {avatarUrl && (
                <span className="font-mono text-xs text-muted">
                  operator: <span className="text-ink">{displayName}</span>
                </span>
              )}
            </div>
          </div>

          <Breadcrumb region={region} tier={tier} version={settings?.version ?? __APP_VERSION__} />

          {/* name — second token types like a terminal cursor. Font caps at 7xl
              so the longest token ("serverless.engineer") fits one desktop line;
              a zero-width space after every dot gives the browser wrap points
              (dots alone aren't breakable, so a long token would overflow/clip). */}
          <h1 className="font-display text-5xl font-bold leading-[1.02] tracking-tight text-ink [overflow-wrap:anywhere] sm:text-6xl lg:text-7xl">
            {firstName}
            <span style={{ color: 'var(--primary)' }}>.</span>
            {`\u200b${typed.replace(/\./g, '.\u200b')}`}
            <span
              className="ml-1 inline-block h-[0.78em] w-[0.5ch] translate-y-[0.06em] animate-pulse align-baseline"
              style={{ background: 'var(--primary)' }}
            />
          </h1>

          {/* tagline */}
          <p className="max-w-2xl text-lg leading-relaxed text-ink/75 sm:text-xl">
            {TAGLINE_PREFIX}
            <span className="font-medium" style={{ color: 'var(--primary)' }}>
              {TAGLINE_ACCENT}
            </span>
            {TAGLINE_SUFFIX}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2 font-mono text-sm">
            <button
              type="button"
              onClick={scrollTo('journey')}
              className="rounded-lg px-5 py-2.5 font-medium text-[#07140d] transition-transform hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(180deg, var(--primary), var(--primary-deep))' }}
            >
              View work →
            </button>
            {resume && (
              <a href={resume} target="_blank" rel="noreferrer" className={ctaSecondary}>
                Résumé
              </a>
            )}
            {github && (
              <a href={github} target="_blank" rel="noreferrer" className={ctaSecondary}>
                GitHub
              </a>
            )}
            {linkedin && (
              <a href={linkedin} target="_blank" rel="noreferrer" className={ctaSecondary}>
                LinkedIn
              </a>
            )}
          </div>

          {/* telemetry stat band */}
          <div className="mt-6">
            <HeroStats region={region} tier={tier} play={booted} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
