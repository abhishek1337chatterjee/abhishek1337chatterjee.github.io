import { Play } from 'lucide-react';
import { type CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useCareerPhases, useCaseStudies, useProjects } from '../../hooks/useSanityData';
import type { SanityCareerPhase } from '../../lib/sanity';

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
  const m = Math.min(12, Math.floor((t - y) * 12) + 1);
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

  // Drives the date under the playhead, the replay clock and which span the readout shows.
  // Text goes straight to the DOM so the 4 s sweep never re-renders the section per frame.
  // biome-ignore lint/correctness/useExhaustiveDependencies: spansKey stands in for rows
  useEffect(() => {
    if (!playing) return;
    const rowAt = (t: number) => {
      let best: number | null = null;
      rows.forEach((r, i) => {
        const inside = t >= r.span.start && t < r.span.end;
        if (inside && (best === null || r.span.start > rows[best].span.start)) best = i;
      });
      return best;
    };
    let raf = 0;
    let last: number | null | undefined;
    const t0 = performance.now();
    const tick = (ts: number) => {
      const p = Math.min(Math.max(((ts - t0) / 1000 - LEAD_S) / SWEEP_S, 0), 1);
      const t = min + p * (now - min);
      if (dateRef.current) dateRef.current.textContent = yearMonth(t);
      if (clockRef.current)
        clockRef.current.textContent = `00:${clock(p * SWEEP_S)} / ${SWEEP_LABEL}`;
      const idx = p >= 1 ? null : rowAt(t);
      if (idx !== last) {
        last = idx;
        setSweepIdx(idx);
      }
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    setPicked(null);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, run, min, now, spansKey]);

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
              onClick={() => setRun((r) => r + 1)}
              className="inline-flex items-center gap-2.5 rounded-lg border border-[color:var(--secondary)] bg-[#1a1205] px-4 py-2.5 font-mono text-sm text-[color:var(--secondary)] transition-colors hover:bg-[#2a1d08]"
            >
              <Play aria-hidden className="size-3.5 fill-current" />
              replay trace
              <span ref={clockRef} className="tabular-nums text-[color:var(--secondary-deep)]">
                00:00.0 / {SWEEP_LABEL}
              </span>
            </button>
          )}
        </div>

        {/* key={run} remounts the bars so their CSS wipes restart on replay */}
        <div key={run} className="relative mt-8 pb-8">
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
                <button
                  type="button"
                  aria-pressed={on}
                  aria-controls="journey-readout"
                  onClick={() => setPicked(idx)}
                  onMouseEnter={() => setPicked(idx)}
                  onFocus={() => setPicked(idx)}
                  className="grid w-full cursor-pointer items-center gap-3.5 rounded-lg text-left"
                  style={COLS}
                >
                  <span className="block min-w-0">
                    <span className="block font-mono text-[11px] text-muted">{p.period}</span>
                    <span
                      className={`block font-display text-[15px] font-semibold tracking-tight transition-colors ${on ? 'text-ink' : 'text-ink/70'}`}
                    >
                      {p.role}
                    </span>
                    <span className="block truncate text-xs text-muted">
                      {p.companyName ?? p.title}
                    </span>
                  </span>
                  <span
                    className={`relative block h-10 rounded-lg border transition-colors ${on ? 'border-[color:var(--secondary)]/45' : 'border-ink/5'}`}
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
                  </span>
                </button>

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

          {/* playhead: one amber line over every bar track, sweeping first year → now */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 grid gap-3.5"
            style={COLS}
          >
            <div />
            <div className="relative">
              <div
                className="absolute inset-y-0 left-0"
                style={{
                  width: `${nowPct}%`,
                  transform: reduce || !seen ? `translateX(${reduce ? 100 : 0}%)` : undefined,
                  animation: playing ? `playhead ${SWEEP_S}s linear ${LEAD_S}s both` : undefined,
                }}
              >
                <div className="absolute top-0 bottom-6 left-0 w-0.5 -translate-x-1/2 bg-[color:var(--secondary)]" />
                <span
                  ref={dateRef}
                  className="absolute bottom-0 left-0 -translate-x-1/2 font-mono text-xs whitespace-nowrap tabular-nums text-[color:var(--secondary)]"
                >
                  {yearMonth(reduce ? now : min)}
                </span>
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
                      · {p.companyName ?? p.title}
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
