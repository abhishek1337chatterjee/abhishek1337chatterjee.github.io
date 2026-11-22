import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useContributions } from '../../hooks/useContributions';
import { useAbout, useSiteSettings, useSocials } from '../../hooks/useSanityData';
import { getProfileImageUrl } from '../../lib/sanity';
import { focusTarget } from '../../utils/focusTarget';
import { downloadResume } from '../../utils/resume';
import Breadcrumb from '../ui/Breadcrumb';
import TelemetryBadge from '../ui/TelemetryBadge';

const GH_USER = 'abhishek1337chatterjee';

// Toggle to preview the optional theme-matched "operator" avatar (compare with/without).
const SHOW_AVATAR = true;

// Hero tagline lives in Sanity (about.tagline*); these only cover a missing field.
const TAGLINE_FALLBACK = {
  lead: 'Backend engineer building ',
  accent: 'event-driven systems on AWS',
  tail: ' — and the AI agents and React frontends on top.',
};

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

// Share of the width the trace covers; the gap to the right is "the future".
const TRACE_END = 92;
// The line draws in over DRAW_S; the "now" playhead + projection fade in once it lands.
const DRAW_S = 4;
const DRAW_DELAY_S = 0.15;

// The real contribution series as a monitoring band; its floor is the strip's top line.
function TraceBand({ weeks, count, play }: { weeks: number[]; count: string; play: boolean }) {
  const W = 1000;
  const H = 300;
  const max = Math.max(...weeks, 1);
  const pts = weeks.map((v, i) => {
    const x = (i / Math.max(weeks.length - 1, 1)) * W;
    const y = H - (v / max) * (H - 24);
    return [x, y] as const;
  });
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const area = `${line} L${W},${H} L0,${H} Z`;
  const nowTop = pts.length ? (pts[pts.length - 1][1] / H) * 100 : 100;
  // dashed projection past "now" = the last 4 weeks' average pace, not invented data
  const recent = weeks.slice(-4);
  const pace = recent.reduce((a, b) => a + b, 0) / Math.max(recent.length, 1);
  const paceY = H - (pace / max) * (H - 24);

  return (
    // outer box holds the band's height so the page never shifts (CLS), lower on short
    // laptop screens so the stat strip fits; the live drawing stays out of the snapshot
    <div
      aria-hidden="true"
      className="relative ml-[calc(50%-50vw)] min-h-28 w-screen flex-1 sm:min-h-44 lg:-mt-14 lg:min-h-56 lg:[@media(max-height:860px)]:min-h-24"
    >
      {weeks.length > 1 && (
        <div data-prerender="skip" className="pointer-events-none absolute inset-0">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
            className="absolute inset-y-0 left-0 h-full"
            style={{ width: `${TRACE_END}%` }}
          >
            <defs>
              <linearGradient id="hero-trace" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.22" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* the shading wipes in left to right with the line, so it never shows the shape early */}
            <path
              d={area}
              fill="url(#hero-trace)"
              style={{
                clipPath: 'inset(0 100% 0 0)',
                animation: play ? `wipeIn ${DRAW_S}s ease ${DRAW_DELAY_S}s forwards` : undefined,
              }}
            />
            {/* pathLength=1 normalises the line so traceDraw can run from --len: 1 to 0 */}
            <path
              d={line}
              pathLength={1}
              fill="none"
              stroke="var(--primary)"
              strokeWidth="2.5"
              strokeLinejoin="miter"
              strokeMiterlimit={10}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              style={
                {
                  '--len': 1,
                  strokeDasharray: 1,
                  strokeDashoffset: 1,
                  animation: play
                    ? `traceDraw ${DRAW_S}s ease ${DRAW_DELAY_S}s forwards`
                    : undefined,
                  filter:
                    'drop-shadow(0 0 4px color-mix(in srgb, var(--primary) 55%, transparent))',
                } as React.CSSProperties
              }
            />
          </svg>
          {/* reveal layer: waits for the line to reach "now" (instant under reduced motion) */}
          <div
            className="absolute inset-0 opacity-0 [--reveal-delay:var(--draw-end)] motion-reduce:[--reveal-delay:0s]"
            style={
              {
                '--draw-end': `${DRAW_S + DRAW_DELAY_S}s`,
                animation: play ? 'fadeIn 0.6s ease var(--reveal-delay) forwards' : undefined,
              } as React.CSSProperties
            }
          >
            <svg
              viewBox={`0 0 100 ${H}`}
              preserveAspectRatio="none"
              className="absolute inset-y-0 h-full"
              style={{ left: `${TRACE_END}%`, width: `${100 - TRACE_END}%` }}
            >
              <path
                d={`M0,${pts[pts.length - 1][1].toFixed(1)} L100,${paceY.toFixed(1)}`}
                fill="none"
                stroke="var(--primary)"
                strokeOpacity="0.4"
                strokeWidth="2"
                strokeDasharray="4 6"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            {/* "now" playhead at the last real data point */}
            <span
              className="absolute inset-y-0 w-0.5"
              style={{ left: `${TRACE_END}%`, background: 'var(--secondary)' }}
            />
            <span
              className="absolute size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                left: `${TRACE_END}%`,
                top: `${nowTop}%`,
                background: 'var(--secondary)',
                boxShadow: '0 0 0 7px color-mix(in srgb, var(--secondary) 25%, transparent)',
              }}
            />
            {/* label rides on top of the playhead, right-aligned so it never leaves the column */}
            <span
              className="absolute -top-6 right-5 font-mono text-xs whitespace-nowrap sm:right-8"
              style={{ color: 'var(--secondary)' }}
            >
              now · {count}
              <span className="hidden sm:inline"> contributions / 12 mo</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// Honest-mapped telemetry strip — real where it can be, never fabricated.
function TelemetryStrip({ count, region, tier }: { count: string; region: string; tier: string }) {
  const items = [
    { label: 'uptime', value: 'since 2024', sub: 'serverless' },
    { label: 'contributions', value: count, sub: '/ 12 mo' },
    { label: 'region', value: region, sub: `${tier} tier` },
    { label: 'status', value: 'operational', sub: 'all systems', accent: true },
  ];
  // dividers sit between columns: every 2nd item on phones, all but the 1st on desktop
  const divider = ['', 'border-l pl-5', 'lg:border-l lg:pl-5', 'border-l pl-5'];

  return (
    <dl className="grid grid-cols-2 lg:grid-cols-4" data-prerender="skip">
      {items.map((it, i) => (
        <div key={it.label} className={`border-line py-4 pr-5 ${divider[i]}`}>
          <dt className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
            {it.label}
          </dt>
          <dd
            className="mt-1 font-display text-xl font-bold text-ink sm:text-2xl"
            style={it.accent ? { color: 'var(--primary)' } : undefined}
          >
            {it.value} <span className="font-mono text-xs font-normal text-muted">{it.sub}</span>
          </dd>
        </div>
      ))}
    </dl>
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
    .map((s) =>
      s
        .trim()
        .toLowerCase()
        .replace(/[\s-]+/g, '.'),
    )
    .filter(Boolean);
  const tokens = [surname, ...titleTokens.filter((t) => t !== surname)];
  const typed = useTypedSuffix(!reduce, tokens);
  // longest token → invisible sizer reserves the h1 height so cycling can't reflow (CLS)
  const longestToken = tokens.reduce((a, b) => (b.length > a.length ? b : a), '');
  const github = findSocial(socials, 'GitHub');
  const linkedin = findSocial(socials, 'LinkedIn');
  const resume = settings?.resumeUrl;
  const avatarUrl = SHOW_AVATAR ? getProfileImageUrl(about?.profileImage, 160) : undefined;
  const region = 'ap-south-1';
  const tier = 'serverless';
  const { total, weeks } = useContributions(GH_USER);
  const count = total ? total.toLocaleString() : '—';

  const scrollTo = (id: string) => () => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    focusTarget(el);
  };

  const ctaSecondary =
    'rounded-lg border border-line bg-base-200 px-5 py-2.5 text-ink transition-colors hover:border-[#34e5ff] hover:text-[#34e5ff]';

  return (
    // phones can't fit the 2×2 stat strip, so the graph fills the screen and the strip
    // starts on the first scroll instead of being cut through its first row
    <section
      id="top"
      className="relative flex min-h-[calc(100svh-3.5rem)] flex-col px-5 pt-14 pb-4 max-sm:min-h-[calc(100svh-3.5rem+14.75rem)] sm:px-8 lg:px-16"
    >
      <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
          className="flex flex-1 flex-col gap-5"
        >
          {/* status row; min-h holds the avatar's 64px before Sanity returns its URL (CLS) */}
          <div className={`flex items-center gap-3.5 ${SHOW_AVATAR ? 'min-h-16' : ''}`}>
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

          {/* name on two lines, the second token types like a terminal cursor. The 6rem cap
              keeps "serverless.engineer" on one desktop line; zero-width spaces after
              dots give phones wrap points (dots alone aren't breakable). */}
          <h1 className="grid font-display text-5xl font-bold leading-[0.95] tracking-[-0.04em] text-ink [overflow-wrap:anywhere] sm:text-7xl lg:text-[6rem]">
            {/* invisible sizer: reserves height for the longest token so the cycling
                typewriter never re-wraps the block and shifts the page (CLS) */}
            {/* the visible name types and cycles; screen readers get it once, whole */}
            <span className="sr-only">{about?.name ?? 'Abhishek Chatterjee'}</span>
            <span aria-hidden className="invisible [grid-area:1/1]">
              {firstName}.
              <br />
              {longestToken.replace(/\./g, '.\u200b')}
            </span>
            <span aria-hidden className="[grid-area:1/1]">
              {firstName}
              <span style={{ color: 'var(--primary)' }}>.</span>
              <br />
              {typed.replace(/\./g, '.\u200b')}
              <span
                className="ml-1 inline-block h-[0.78em] w-[0.5ch] translate-y-[0.06em] animate-pulse align-baseline"
                style={{ background: 'var(--primary)' }}
              />
            </span>
          </h1>

          {/* tagline */}
          <p className="max-w-2xl text-lg leading-relaxed text-ink/75 sm:text-xl">
            {about?.taglineLead ?? TAGLINE_FALLBACK.lead}
            <span className="font-medium" style={{ color: 'var(--primary)' }}>
              {about?.taglineAccent ?? TAGLINE_FALLBACK.accent}
            </span>
            {about?.taglineTail ?? TAGLINE_FALLBACK.tail}
          </p>

          {/* CTAs */}
          {/* z-10 + solid buttons: on desktop the graph peaks rise behind this row */}
          <div className="relative z-10 flex flex-wrap items-center gap-3 pt-2 font-mono text-sm">
            <button
              type="button"
              onClick={scrollTo('work')}
              className="rounded-lg px-5 py-2.5 font-medium text-[#07140d] transition-transform hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(180deg, var(--primary), var(--primary-deep))' }}
            >
              View work →
            </button>
            {resume && (
              <a
                href={resume}
                target="_blank"
                rel="noreferrer"
                onClick={() => downloadResume(resume)}
                className={ctaSecondary}
              >
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

          <TraceBand weeks={weeks} count={count} play={booted} />
          {/* the strip's top line runs edge to edge as the graph's floor; min-h holds its
              height before the live numbers render (CLS); -mt-5 cancels the column gap */}
          <div className="-mt-5 ml-[calc(50%-50vw)] w-screen border-t border-line px-5 sm:px-8 lg:px-16">
            <div className="mx-auto min-h-[13.75rem] max-w-6xl lg:min-h-[5.5rem]">
              <TelemetryStrip count={count} region={region} tier={tier} />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
