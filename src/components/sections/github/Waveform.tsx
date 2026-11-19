import { type CSSProperties, type KeyboardEvent, type PointerEvent, useState } from 'react';
import type { Bucket } from './buckets';

const W = 1000;
const H = 300;
const TOP_PAD = 36; // room above the busiest bucket for its label

interface Props {
  buckets: Bucket[];
  // Weeks read as a continuous trace; a month is a total, so it draws as a bar.
  mode: 'line' | 'bar';
  unit: 'wk' | 'mo';
  // hidden: waiting to scroll into view · play: first draw · switch: quick redraw after a
  // view change · static: reduced motion, show as-is
  phase: 'hidden' | 'play' | 'switch' | 'static';
}

// Contributions as an instrument: hero-style trace (or bars), plus a crosshair the visitor
// scrubs by pointer, touch or arrow keys to read any single bucket.
export default function Waveform({ buckets, mode, unit, phase }: Props) {
  const [at, setAt] = useState<number | null>(null);
  const n = buckets.length;

  if (n < 2) {
    return (
      <div className="grid h-full place-items-center font-mono text-xs text-muted">
        waiting for GitHub…
      </div>
    );
  }

  const values = buckets.map((b) => b.value);
  const max = Math.max(...values, 1);
  const bar = mode === 'bar';
  const slot = W / n;
  // Centre of bucket i, as a 0–100 share of the width.
  const pct = (i: number) => (bar ? ((i + 0.5) / n) * 100 : (i / (n - 1)) * 100);
  const y = (v: number) => H - (v / max) * (H - TOP_PAD);
  const top = (i: number) => `${(y(values[i]) / H) * 100}%`;
  const peak = values.indexOf(max);

  const line = values
    .map((v, i) => `${i ? 'L' : 'M'}${((i / (n - 1)) * W).toFixed(1)},${y(v).toFixed(1)}`)
    .join('');

  const waiting = phase !== 'static';
  const run = phase === 'play' || phase === 'switch';
  const dur = phase === 'play' ? 2.4 : 0.5;
  const lead = phase === 'play' ? 0.2 : 0;
  const ease = 'cubic-bezier(.4,0,.2,1)';
  const drawn = (
    waiting
      ? {
          '--len': 1,
          strokeDasharray: 1,
          strokeDashoffset: 1,
          animation: run ? `traceDraw ${dur}s ${ease} ${lead}s forwards` : undefined,
        }
      : {}
  ) as CSSProperties;
  const wiped: CSSProperties | undefined = waiting
    ? {
        clipPath: 'inset(0 100% 0 0)',
        animation: run ? `wipeIn ${dur}s ${ease} ${lead}s forwards` : undefined,
      }
    : undefined;
  const grow = (i: number): CSSProperties | undefined =>
    waiting
      ? {
          transformBox: 'fill-box',
          transformOrigin: 'bottom',
          transform: 'scaleY(0)',
          animation: run ? `barGrow 0.45s ${ease} ${lead + i * 0.025}s forwards` : undefined,
        }
      : undefined;
  const afterDraw: CSSProperties = waiting
    ? { opacity: 0, animation: run ? `fadeIn 0.4s ease ${lead + dur}s forwards` : undefined }
    : {};

  const scrub = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const f = (e.clientX - r.left) / r.width;
    const i = bar ? Math.floor(f * n) : Math.round(f * (n - 1));
    setAt(Math.min(n - 1, Math.max(0, i)));
  };
  const keys = (e: KeyboardEvent<HTMLDivElement>) => {
    const cur = at ?? n - 1;
    const next = { ArrowLeft: cur - 1, ArrowRight: cur + 1, Home: 0, End: n - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    setAt(Math.min(n - 1, Math.max(0, next)));
  };

  const sel = at;
  const shown = sel ?? n - 1;
  const tipRight = sel !== null && pct(sel) > 70;
  const ticks = buckets
    .map((b, i) => ({ i, label: b.tick }))
    .filter((t): t is { i: number; label: string } => !!t.label && (bar || pct(t.i) < 92));

  return (
    <div className="relative flex h-full flex-col">
      <div
        role="slider"
        tabIndex={0}
        aria-label={`GitHub contributions per ${unit === 'wk' ? 'week' : 'month'}, last 12 months`}
        aria-valuemin={0}
        aria-valuemax={n - 1}
        aria-valuenow={shown}
        aria-valuetext={`${buckets[shown].tip}: ${values[shown]} contributions`}
        onPointerMove={scrub}
        onPointerDown={scrub}
        onPointerLeave={() => setAt(null)}
        onKeyDown={keys}
        onBlur={() => setAt(null)}
        className="relative min-h-0 flex-1 cursor-crosshair touch-pan-y rounded-lg outline-offset-4"
      >
        <svg
          aria-hidden
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          className="absolute inset-0 size-full overflow-visible"
        >
          <defs>
            <linearGradient id="gh-wave-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--primary)" stopOpacity="0.28" />
              <stop offset="1" stopColor="var(--primary)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0.25, 0.5, 0.75].map((f) => (
            <line
              key={f}
              x1={0}
              x2={W}
              y1={H * f}
              y2={H * f}
              stroke="var(--color-line)"
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {bar ? (
            buckets.map((b, i) => (
              <rect
                key={b.tip}
                x={i * slot + slot * 0.16}
                width={slot * 0.68}
                y={y(b.value)}
                height={H - y(b.value)}
                fill="var(--primary)"
                fillOpacity={b.partial ? 0.22 : sel === null || sel === i ? 1 : 0.55}
                stroke={b.partial ? 'var(--primary)' : 'none'}
                strokeDasharray={b.partial ? '4 3' : undefined}
                vectorEffect="non-scaling-stroke"
                style={grow(i)}
              />
            ))
          ) : (
            <>
              <path d={`${line}L${W},${H}L0,${H}Z`} fill="url(#gh-wave-fill)" style={wiped} />
              <path
                d={line}
                pathLength={1}
                fill="none"
                stroke="var(--primary)"
                strokeWidth={2.5}
                strokeLinejoin="miter"
                strokeMiterlimit={10}
                vectorEffect="non-scaling-stroke"
                style={drawn}
              />
            </>
          )}
        </svg>

        {/* busiest bucket + now: plain DOM so text and dots never stretch with the SVG */}
        <div aria-hidden className="pointer-events-none absolute inset-0" style={afterDraw}>
          <span
            className="absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink"
            style={{ left: `${pct(peak)}%`, top: top(peak) }}
          />
          <span
            className={`absolute -translate-y-full pb-2 font-mono text-[11px] whitespace-nowrap text-muted ${pct(peak) > 80 ? '-translate-x-full' : pct(peak) < 20 ? '' : '-translate-x-1/2'}`}
            style={{ left: `${pct(peak)}%`, top: top(peak) }}
          >
            peak · {max} / {unit}
          </span>
          {!bar && (
            <span
              className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[color:var(--secondary)]"
              style={{ left: '100%', top: top(n - 1) }}
            />
          )}
        </div>

        {sel !== null && (
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <span className="absolute inset-y-0 w-px bg-ink/40" style={{ left: `${pct(sel)}%` }} />
            <span
              className="absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[color:var(--primary)] bg-base-100"
              style={{ left: `${pct(sel)}%`, top: top(sel) }}
            />
            <span
              className={`absolute top-0 rounded-md border border-line bg-base-100 px-2.5 py-1.5 font-mono text-xs whitespace-nowrap ${tipRight ? '-ml-3 -translate-x-full' : 'ml-3'}`}
              style={{ left: `${pct(sel)}%` }}
            >
              <span className="text-muted">{buckets[sel].tip} · </span>
              <span className="text-ink">{values[sel]}</span>
            </span>
          </div>
        )}
      </div>

      {/* axis: alternate labels drop on phones so they never collide */}
      <div aria-hidden className="relative mt-3 h-4 font-mono text-[11px] text-muted">
        {ticks.map((t, k) => {
          const last = bar && t.i === n - 1;
          return (
            <span
              key={t.label}
              className={`absolute whitespace-nowrap ${last ? '-translate-x-full text-[color:var(--secondary)]' : '-translate-x-1/2'} ${k % 2 && !last ? 'hidden sm:inline' : ''}`}
              style={{ left: last ? '100%' : `${pct(t.i)}%` }}
            >
              {t.label}
            </span>
          );
        })}
        {!bar && <span className="absolute right-0 text-[color:var(--secondary)]">now</span>}
      </div>
    </div>
  );
}
