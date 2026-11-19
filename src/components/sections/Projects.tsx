import { Pause, Play, RotateCcw } from 'lucide-react';
import {
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useCareerPhases, useCaseStudies, useProjects } from '../../hooks/useSanityData';
import type { SanityCareerPhase } from '../../lib/sanity';
import { TAP_44 } from '../ui/tapArea';

type Span = { start: number; end: number; ongoing: boolean };
type Child = { name: string; sub: string };

const COLS = { gridTemplateColumns: 'clamp(108px,25vw,228px) 1fr' } as const;

// The active role's spans are its top case studies, so the timeline stays CMS-driven.
const ACTIVE_SPAN_COUNT = 3;
// One sweep from the first year to now; bars, playhead and readout all key off it.
const SWEEP_S = 4;
const LEAD_S = 0.3;
// How far the dashed "still running" tail reaches past now, in years.
const TAIL_Y = 0.35;

function parsePeriod(period: string, now: number): Span {
  const [a, b] = period.split(/[–-]/).map((s) => s.trim());
  const start = Number.parseInt(a, 10);
  const ongoing = /present|now|current/i.test(b ?? '');
  const parsedEnd = Number.parseInt(b ?? '', 10);
  const safeStart = Number.isNaN(start) ? now : start;
  const end = ongoing ? now : Number.isNaN(parsedEnd) ? safeStart + 1 : parsedEnd;
  return { start: safeStart, end: Math.max(end, safeStart + 1), ongoing };
}

// Fractional year → "2024-03".
function yearMonth(t: number) {
  const y = Math.floor(t);
  // epsilon: 2026 + 10/12 comes back as 9.9999… months and would floor to October
  const m = Math.min(12, Math.floor((t - y) * 12 + 1e-6) + 1);
  return `${y}-${String(m).padStart(2, '0')}`;
}

const clock = (s: number) => s.toFixed(1).padStart(4, '0');
const SWEEP_LABEL = `${clock(SWEEP_S)}s`;

const track = (gridPct: number): CSSProperties => ({
  backgroundColor: '#13151A',
  backgroundImage: 'linear-gradient(90deg, rgba(38,42,51,0.7) 1px, transparent 1px)',
  backgroundSize: `${gridPct}% 100%`,
});

export default function Journey() {
  const { careerPhases } = useCareerPhases();
  const { projects } = useProjects();
  const { caseStudies } = useCaseStudies();
  const reduce = useReducedMotion();
  const [now] = useState(() => {
    const d = new Date();
    return d.getFullYear() + d.getMonth() / 12;
  });
  const [seen, setSeen] = useState(false);
  const [run, setRun] = useState(0);
  const [sweepIdx, setSweepIdx] = useState<number | null>(null);
  const [picked, setPicked] = useState<number | null>(null);
  const dateRef = useRef<HTMLSpanElement>(null);
  const clockRef = useRef<HTMLSpanElement>(null);
  // Sweep time survives pauses: the loop adds frame deltas only while playing.
  const elapsedRef = useRef(0);
  const chartRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'playing' | 'paused' | 'done'>('playing');

  // callback ref: fires when the node actually mounts (i.e. after Sanity data loads),
  // so the sweep reliably starts on scroll into view.
  const observeRef = useCallback((el: HTMLDivElement | null) => {
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
  }, []);

  const rows = careerPhases
    .map((p) => ({ p, span: parsePeriod(p.period, now) }))
    .sort((a, b) => b.span.start - a.span.start); // newest span on top
  const min = rows.length ? Math.min(...rows.map((r) => r.span.start)) : now;
  const spansKey = rows.map((r) => `${r.span.start}-${r.span.end}`).join('|');
  const playing = seen && !reduce && rows.length > 0;

  // Newest span that contains time t (spans can touch at a year boundary).
  const rowAt = (t: number) => {
    let best: number | null = null;
    rows.forEach((r, i) => {
      const inside = t >= r.span.start && t < r.span.end;
      if (inside && (best === null || r.span.start > rows[best].span.start)) best = i;
    });
    return best;
  };
  // Shared by the playback loop and dragging: one place turns sweep time into text + readout.
  const paint = (elapsed: number) => {
    const p = Math.min(Math.max((elapsed - LEAD_S) / SWEEP_S, 0), 1);
    const t = min + p * (now - min);
    if (dateRef.current) dateRef.current.textContent = yearMonth(t);
    if (clockRef.current)
      clockRef.current.textContent = `00:${clock(p * SWEEP_S)} / ${SWEEP_LABEL}`;
    return { p, idx: p >= 1 ? null : rowAt(t) };
  };

  // Drives the date under the playhead, the replay clock and which span the readout shows.
  // Text goes straight to the DOM so the 4 s sweep never re-renders the section per frame.
  // Pausing stops this loop and freezes the CSS sweeps; resuming continues from elapsedRef.
  // biome-ignore lint/correctness/useExhaustiveDependencies: spansKey stands in for rows
  useEffect(() => {
    if (!playing || status !== 'playing') return;
    let raf = 0;
    let last: number | null | undefined;
    let prev = performance.now();
    const tick = (ts: number) => {
      elapsedRef.current += Math.max(0, ts - prev) / 1000;
      prev = ts;
      const { p, idx } = paint(elapsedRef.current);
      if (idx !== last) {
        last = idx;
        setSweepIdx(idx);
      }
      if (p < 1) raf = requestAnimationFrame(tick);
      else setStatus('done');
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, status, run, min, now, spansKey]);

  // Dragging the playhead seeks every CSS sweep to the same moment, then leaves it paused.
  const seek = (p: number) => {
    const elapsed = LEAD_S + Math.min(Math.max(p, 0), 1) * SWEEP_S;
    elapsedRef.current = elapsed;
    for (const a of chartRef.current?.getAnimations({ subtree: true }) ?? []) {
      if (a instanceof CSSAnimation) a.currentTime = elapsed * 1000;
    }
    setSweepIdx(paint(elapsed).idx);
    setPicked(null);
    setStatus('paused');
  };
  const nowShare = () => {
    const nowPctOf = (now - min) / (Math.max(...rows.map((r) => r.span.end), now) + TAIL_Y - min);
    return nowPctOf || 1;
  };
  const scrubFrom = (clientX: number) => {
    const r = trackRef.current?.getBoundingClientRect();
    if (r) seek((clientX - r.left) / (r.width * nowShare()));
  };
  const grab = {
    onPointerDown: (e: PointerEvent<HTMLElement>) => {
      if (!playing) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      scrubFrom(e.clientX);
    },
    onPointerMove: (e: PointerEvent<HTMLElement>) => {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) scrubFrom(e.clientX);
    },
  };
  const nudge = (e: KeyboardEvent<HTMLElement>) => {
    const step = { ArrowLeft: -0.05, ArrowRight: 0.05, Home: -1, End: 1 }[e.key];
    if (step === undefined || !playing) return;
    e.preventDefault();
    const p = (elapsedRef.current - LEAD_S) / SWEEP_S;
    seek(Math.abs(step) === 1 ? (step > 0 ? 1 : 0) : p + step);
  };

  const control = () => {
    if (status === 'playing') return setStatus('paused');
    if (status === 'paused') return setStatus('playing');
    elapsedRef.current = 0;
    setPicked(null);
    setRun((r) => r + 1);
    setStatus('playing');
  };

  if (!rows.length) return null;

  const nowYear = Math.floor(now);
  const max = Math.max(...rows.map((r) => r.span.end), now) + TAIL_Y;
  const total = max - min || 1;
  const gridPct = 100 / total;
  const pct = (v: number) => ((v - min) / total) * 100;
  const nowPct = pct(now);

  // Clip-wipe a bar in step with the playhead: it starts when the line reaches its left
  // edge and finishes when the line leaves its right edge (both linear).
  const sweep = (from: number, to: number): CSSProperties => {
    if (reduce) return {};
    return {
      clipPath: 'inset(0 100% 0 0)',
      animation: seen
        ? `wipeIn ${((to - from) / nowPct) * SWEEP_S}s linear ${LEAD_S + (from / nowPct) * SWEEP_S}s forwards`
        : undefined,
    };
  };
  const afterSweep: CSSProperties = reduce
    ? {}
    : {
        opacity: 0,
        animation: seen ? `fadeIn 0.6s ease ${LEAD_S + SWEEP_S}s forwards` : undefined,
      };

  // ticks stop before the current year — the teal "now" marker stands in for it
  const tickYears: number[] = [];
  for (let y = min; y < nowYear; y++) tickYears.push(y);

  const masai = projects.filter((p) => p.source === 'masai');
  const childrenOf = (p: SanityCareerPhase, span: Span): Child[] => {
    if (p.isEducation)
      return masai.map((m) => ({ name: m.title, sub: m.techStack?.[0]?.trim() ?? 'showcase' }));
    if (span.ongoing)
      return caseStudies.slice(0, ACTIVE_SPAN_COUNT).map((cs) => ({
        name: cs.slug,
        sub: cs.stack.slice(0, 2).join(' + '),
      }));
    return (p.projects ?? []).map((pr) => ({
      name: pr.title,
      sub: (pr.techStack ?? []).slice(0, 2).join(' + ') || 'project',
    }));
  };

  const activeIdx = Math.max(
    0,
    rows.findIndex((r) => r.span.ongoing),
  );
  const shown = picked ?? sweepIdx ?? activeIdx;

  return (
    <section id="journey" className="content-defer px-5 py-16 sm:px-8 lg:px-16">
      <div className="mx-auto w-full max-w-6xl" ref={observeRef}>
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
          <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
            <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Trace waterfall
            </h2>
            <p className="font-mono text-sm text-muted">
              trace_id <span className="text-ink">career·{min}→now</span>
            </p>
          </div>
          {!reduce && (
            <button
              type="button"
              onClick={control}
              className="inline-flex items-center gap-2.5 rounded-lg border border-[color:var(--secondary)] bg-[#1a1205] px-4 py-2.5 font-mono text-sm text-[color:var(--secondary)] transition-colors hover:bg-[#2a1d08]"
            >
              {status === 'playing' ? (
                <Pause aria-hidden className="size-3.5 fill-current" />
              ) : status === 'paused' ? (
                <Play aria-hidden className="size-3.5 fill-current" />
              ) : (
                <RotateCcw aria-hidden className="size-3.5" />
              )}
              <span className="w-[6.75rem] text-left">
                {status === 'playing' ? 'pause' : status === 'paused' ? 'resume' : 'replay'} trace
              </span>
              <span ref={clockRef} className="tabular-nums text-[color:var(--secondary-deep)]">
                00:00.0 / {SWEEP_LABEL}
              </span>
            </button>
          )}
        </div>

        {/* key={run} remounts the bars so their CSS wipes restart on replay; pausing
            freezes every sweep animation inside at the same moment as the clock */}
        <div
          key={run}
          ref={chartRef}
          className={`relative mt-8 pb-10 ${status === 'paused' ? 'sweep-paused' : ''}`}
        >
          {/* year axis */}
          <div className="grid gap-3.5" style={COLS}>
            <div />
            <div className="relative h-5 font-mono text-[11px] text-muted">
              {tickYears.map((y) => (
                <span key={y} className="absolute" style={{ left: `${pct(y)}%` }}>
                  {y}
                </span>
              ))}
              <span
                className="absolute -translate-x-1/2"
                style={{ left: `${nowPct}%`, color: 'var(--primary)' }}
              >
                now
              </span>
            </div>
          </div>

          {rows.map(({ p, span }, idx) => {
            const active = span.ongoing;
            const left = pct(span.start);
            const right = pct(span.end);
            // floor, not round: "2024 - Present" parses as Jan 2024, so rounding
            // would inflate an in-progress year (2.6y → 3y)
            const years = Math.floor(span.end - span.start);
            const fill = active
              ? 'var(--primary)'
              : p.isEducation
                ? 'var(--secondary-deep)'
                : 'var(--secondary)';
            const kidTint = active ? 'var(--primary)' : 'var(--secondary)';
            const kids = childrenOf(p, span);
            const on = idx === shown;

            return (
              <div key={p._id} className={idx ? 'mt-4 border-t border-ink/5 pt-4' : 'mt-2'}>
                {/* the company links out, so it sits beside the row's button, not inside it */}
                <div className="grid w-full items-center gap-3.5" style={COLS}>
                  <span className="block min-w-0">
                    <button
                      type="button"
                      aria-pressed={on}
                      aria-controls="journey-readout"
                      onClick={() => setPicked(idx)}
                      className="block w-full cursor-pointer rounded text-left"
                    >
                      <span className="block font-mono text-[11px] text-muted">{p.period}</span>
                      <span
                        className={`block font-display text-[15px] font-semibold tracking-tight transition-colors ${on ? 'text-ink' : 'text-ink/70'}`}
                      >
                        {p.role}
                      </span>
                    </button>
                    {p.companyWebsite ? (
                      <a
                        href={p.companyWebsite}
                        target="_blank"
                        rel="noreferrer"
                        className="relative block text-xs text-muted underline decoration-dotted underline-offset-4 transition-colors pointer-coarse:before:absolute pointer-coarse:before:inset-x-0 pointer-coarse:before:top-0 pointer-coarse:before:h-8 hover:text-[#34e5ff]"
                      >
                        {/* tap layer grows down only (the role button sits right above); truncate stays on
                            the inner span because overflow on the link would clip that layer */}
                        <span className="block truncate">{p.companyName ?? p.title} ↗</span>
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    ) : (
                      <span className="block truncate text-xs text-muted">
                        {p.companyName ?? p.title}
                      </span>
                    )}
                  </span>
                  {/* the bar picks the row too (pointer only; the label button is the keyboard path) */}
                  <button
                    type="button"
                    tabIndex={-1}
                    aria-hidden="true"
                    onClick={() => setPicked(idx)}
                    className={`relative block h-10 cursor-pointer rounded-lg border transition-colors ${on ? 'border-[color:var(--secondary)]/45' : 'border-ink/5'}`}
                    style={track(gridPct)}
                  >
                    <span
                      className="absolute inset-y-[5px] flex items-center overflow-hidden rounded-md px-2 sm:px-3"
                      style={{
                        left: `${left}%`,
                        width: `${right - left}%`,
                        background: fill,
                        ...sweep(left, right),
                      }}
                    >
                      <span className="whitespace-nowrap font-mono text-[11.5px] font-semibold text-base-100">
                        {/* compact on mobile (bar is narrow); full label sm+ */}
                        <span className="sm:hidden">{years}y</span>
                        <span className="hidden sm:inline">
                          {active ? `${years}y · active` : `${years}y`}
                        </span>
                      </span>
                    </span>
                    {active && (
                      <span
                        className="absolute inset-y-[5px] rounded-r-md border border-dashed border-[color:var(--primary)]/70 bg-[color:var(--primary)]/15"
                        style={{ left: `${right}%`, width: `${100 - right}%`, ...afterSweep }}
                      >
                        <span
                          className="absolute top-1/2 -left-1.5 size-[11px] -translate-y-1/2 animate-pulse rounded-full"
                          style={{ background: 'var(--primary)' }}
                        />
                      </span>
                    )}
                  </button>
                </div>

                {/* child sub-spans */}
                {kids.length > 0 && (
                  <div className="mt-3 flex flex-col gap-1.5">
                    {kids.map((c, ci) => {
                      const width = right - left;
                      const cw = width * 0.6;
                      const cl =
                        left + (width - cw) * (kids.length > 1 ? ci / (kids.length - 1) : 0);
                      return (
                        <div key={c.name} className="grid items-center gap-3.5" style={COLS}>
                          <div className="flex min-w-0 items-center gap-1.5 pl-2.5">
                            <span aria-hidden className="flex-none font-mono text-line">
                              └
                            </span>
                            <div className="min-w-0">
                              <div className="truncate font-mono text-xs text-[#c9cdd6]">
                                {c.name}
                              </div>
                              <div className="truncate text-[11px] text-muted">{c.sub}</div>
                            </div>
                          </div>
                          <div
                            className="relative h-[22px] rounded-md"
                            style={{ ...track(gridPct), backgroundColor: '#101217' }}
                          >
                            <div
                              className="absolute inset-y-1 rounded-[5px]"
                              style={{
                                left: `${cl}%`,
                                width: `${cw}%`,
                                background: `color-mix(in srgb, ${kidTint} 34%, #15171d)`,
                                boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${kidTint} 70%, transparent)`,
                                ...sweep(cl, cl + cw),
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* playhead: one amber line over every bar track, sweeping first year → now;
              the line and its date pill can be dragged to scrub the trace */}
          <div className="pointer-events-none absolute inset-0 grid gap-3.5" style={COLS}>
            <div />
            <div ref={trackRef} className="relative">
              <div
                className="absolute inset-y-0 left-0"
                style={{
                  width: `${nowPct}%`,
                  transform: reduce || !seen ? `translateX(${reduce ? 100 : 0}%)` : undefined,
                  animation: playing ? `playhead ${SWEEP_S}s linear ${LEAD_S}s both` : undefined,
                }}
              >
                <div
                  aria-hidden
                  className="absolute top-0 bottom-8 left-0 w-0.5 -translate-x-1/2 bg-[color:var(--secondary)]"
                />
                {playing && (
                  <div
                    aria-hidden
                    {...grab}
                    className="pointer-events-auto absolute top-0 bottom-8 left-0 w-5 -translate-x-1/2 cursor-ew-resize touch-none"
                  />
                )}
                {playing ? (
                  <span
                    role="slider"
                    tabIndex={0}
                    aria-label="Trace playhead, drag or use arrow keys"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(((elapsedRef.current - LEAD_S) / SWEEP_S) * 100)}
                    onKeyDown={nudge}
                    {...grab}
                    className={`pointer-events-auto absolute bottom-0 left-0 -translate-x-1/2 cursor-ew-resize touch-none ${TAP_44} rounded-md border border-[color:var(--secondary)]/50 bg-[#1a1205] px-1.5 py-0.5 font-mono text-xs whitespace-nowrap tabular-nums text-[color:var(--secondary)]`}
                  >
                    <span ref={dateRef}>{yearMonth(min)}</span>
                  </span>
                ) : (
                  <span className="absolute bottom-0 left-0 -translate-x-1/2 rounded-md border border-[color:var(--secondary)]/50 bg-[#1a1205] px-1.5 py-0.5 font-mono text-xs whitespace-nowrap tabular-nums text-[color:var(--secondary)]">
                    <span ref={dateRef}>{yearMonth(reduce ? now : min)}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* readout: every span is stacked in one cell so the box keeps the tallest height
            (no layout shift as the playhead moves) and crawlers still get every description */}
        <div
          id="journey-readout"
          className="mt-4 grid rounded-xl border border-line bg-base-200 p-5 sm:p-6"
        >
          {rows.map(({ p, span }, idx) => {
            const on = idx === shown;
            const tags = p.keyTechnologies?.length ? p.keyTechnologies : (p.highlights ?? []);
            const kidCount = childrenOf(p, span).length;
            return (
              <div
                key={p._id}
                aria-hidden={!on}
                className={`grid gap-3 [grid-area:1/1] sm:grid-cols-[13rem_1fr] sm:gap-6 ${on ? '' : 'invisible'}`}
              >
                <p className="font-mono text-xs leading-relaxed uppercase tracking-[0.12em] text-[color:var(--secondary)]">
                  span · {p.period}
                  {kidCount > 0 && (
                    <span className="block tracking-normal text-muted normal-case">
                      {kidCount} child spans{span.ongoing ? ' · live' : ''}
                    </span>
                  )}
                </p>
                <div>
                  <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                    {p.role}
                    <span className="font-sans text-sm font-normal text-muted">
                      {' '}
                      ·{' '}
                      {p.companyWebsite ? (
                        <a
                          href={p.companyWebsite}
                          target="_blank"
                          rel="noreferrer"
                          className="underline decoration-dotted underline-offset-4 transition-colors hover:text-[#34e5ff]"
                        >
                          {p.companyName ?? p.title} ↗
                          <span className="sr-only"> (opens in a new tab)</span>
                        </a>
                      ) : (
                        (p.companyName ?? p.title)
                      )}
                    </span>
                  </h3>
                  {(p.nonConfidentialImpact || p.description) && (
                    <p className="mt-1.5 max-w-[68ch] text-[15px] leading-relaxed text-ink/80">
                      {p.nonConfidentialImpact ?? p.description}
                    </p>
                  )}
                  {tags.length > 0 && (
                    <p className="mt-3 font-mono text-xs text-muted">{tags.join(' · ')}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
