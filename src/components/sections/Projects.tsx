import { useCallback, useState } from 'react';
import { useCareerPhases, useProjects } from '../../hooks/useSanityData';
import type { SanityCareerPhase } from '../../lib/sanity';
import SectionHeader from '../ui/SectionHeader';

type Span = { start: number; end: number; ongoing: boolean };
type Child = { name: string; sub: string };

const COLS = { gridTemplateColumns: 'clamp(108px,25vw,228px) 1fr' } as const;

// Non-confidential architecture patterns for the active role (from bio: event-driven,
// orchestration, idempotency, retries, replay). Swappable / seedable later.
const ACTIVE_CHILDREN: Child[] = [
  { name: 'event-orchestration', sub: 'Step Functions' },
  { name: 'idempotency-layer', sub: 'dedupe + retries' },
  { name: 'eventbridge-bus', sub: 'fan-out + replay' },
];

function parsePeriod(period: string, now: number): Span {
  const [a, b] = period.split(/[–-]/).map((s) => s.trim());
  const start = Number.parseInt(a, 10);
  const ongoing = /present|now|current/i.test(b ?? '');
  const parsedEnd = Number.parseInt(b ?? '', 10);
  const safeStart = Number.isNaN(start) ? now : start;
  const end = ongoing ? now : Number.isNaN(parsedEnd) ? safeStart + 1 : parsedEnd;
  return { start: safeStart, end: Math.max(end, safeStart + 1), ongoing };
}

export default function Journey() {
  const { careerPhases } = useCareerPhases();
  const { projects } = useProjects();
  const [seen, setSeen] = useState(false);
  // callback ref: fires when the node actually mounts (i.e. after Sanity data loads),
  // so the bars' grow-in reliably triggers on scroll into view.
  const observeRef = useCallback((el: HTMLDivElement | null) => {
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
  }, []);

  if (!careerPhases.length) return null;

  const d = new Date();
  const now = d.getFullYear() + d.getMonth() / 12; // fractional "now" → longer active bar
  const nowYear = d.getFullYear();
  const rows = careerPhases
    .map((p) => ({ p, span: parsePeriod(p.period, now) }))
    .sort((a, b) => b.span.start - a.span.start); // newest span on top

  const min = Math.min(...rows.map((r) => r.span.start));
  const max = Math.max(...rows.map((r) => r.span.end), now);
  const total = max - min || 1;
  const gridPct = 100 / total;
  const pct = (v: number) => ((v - min) / total) * 100;

  // ticks stop before the current year — the teal "now" marker stands in for it
  // (prevents the last tick colliding with "now" at narrow widths)
  const tickYears: number[] = [];
  for (let y = min; y < nowYear; y++) tickYears.push(y);

  const masai = projects.filter((p) => p.source === 'masai');

  const childrenOf = (p: SanityCareerPhase, span: Span): Child[] => {
    if (p.isEducation)
      return masai.map((m) => ({ name: m.title, sub: m.techStack?.[0]?.trim() ?? 'showcase' }));
    if (span.ongoing) return ACTIVE_CHILDREN;
    return (p.projects ?? []).map((pr) => ({
      name: pr.title,
      sub: (pr.techStack ?? []).slice(0, 2).join(' + ') || 'project',
    }));
  };

  return (
    <section id="journey" className="content-defer px-5 py-16 sm:px-8 lg:px-16">
      <div className="mx-auto w-full max-w-6xl" ref={observeRef}>
        <SectionHeader
          num="04"
          label="distributed trace · career.timeline"
          title="Trace waterfall"
        />

        {/* console card */}
        <div className="mt-6 rounded-2xl border border-line bg-base-300/50 p-4 sm:p-6">
          {/* meta + legend */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 font-mono text-[11.5px] text-muted">
            <span>
              trace_id <span className="text-ink">career·{min}→now</span>
            </span>
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2.5 rounded-[3px]" style={{ background: 'var(--primary)' }} />
                active
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span
                  className="size-2.5 rounded-[3px]"
                  style={{ background: 'var(--secondary)' }}
                />
                completed
              </span>
            </div>
          </div>

          {/* year axis */}
          <div className="grid gap-3.5" style={COLS}>
            <div />
            <div className="relative h-[18px] font-mono text-[10.5px] text-muted">
              {tickYears.map((y) => (
                <span key={y} className="absolute" style={{ left: `${pct(y)}%` }}>
                  {y}
                </span>
              ))}
              <span className="absolute right-0" style={{ color: 'var(--primary)' }}>
                now
              </span>
            </div>
          </div>

          {/* spans */}
          {rows.map(({ p, span }, idx) => {
            const active = span.ongoing;
            const left = pct(span.start);
            const rawWidth = pct(span.end) - pct(span.start);
            const width = Math.min(Math.max(rawWidth, 26), 100 - left); // keep bars "lengthy"
            // floor, not round: "2024 - Present" parses as Jan 2024, so rounding
            // would inflate an in-progress year (2.6y → 3y)
            const years = Math.floor(span.end - span.start);
            const dur = active ? `${years}y · active` : `${years}y`;
            const barBg = active
              ? 'linear-gradient(90deg, var(--primary-deep), var(--primary))'
              : 'linear-gradient(90deg, var(--secondary-deep), var(--secondary))';
            const ring = active
              ? 'color-mix(in srgb, var(--primary) 50%, transparent)'
              : 'color-mix(in srgb, var(--secondary) 45%, transparent)';
            const glow = active
              ? 'color-mix(in srgb, var(--primary) 22%, transparent)'
              : 'color-mix(in srgb, var(--secondary) 16%, transparent)';
            const childFill = active
              ? 'color-mix(in srgb, var(--primary) 34%, #15171d)'
              : 'color-mix(in srgb, var(--secondary) 34%, #15171d)';
            const childEdge = active
              ? 'color-mix(in srgb, var(--primary) 70%, transparent)'
              : 'color-mix(in srgb, var(--secondary) 70%, transparent)';
            const tags = p.keyTechnologies?.length ? p.keyTechnologies : (p.highlights ?? []);
            const kids = childrenOf(p, span);

            return (
              <div key={p._id}>
                {/* span row: meta + bar */}
                <div className="grid items-center gap-3.5 pb-1 pt-2.5" style={COLS}>
                  <div className="min-w-0">
                    <div className="mb-0.5 font-mono text-[10.5px] text-muted">{p.period}</div>
                    <div className="font-display text-[15px] font-semibold tracking-tight text-ink">
                      {p.role}
                    </div>
                    <div className="truncate text-xs text-muted">{p.companyName ?? p.title}</div>
                  </div>
                  <div
                    className="relative h-10 rounded-lg"
                    style={{
                      backgroundColor: '#13151A',
                      backgroundImage:
                        'linear-gradient(90deg, rgba(38,42,51,0.7) 1px, transparent 1px)',
                      backgroundSize: `${gridPct}% 100%`,
                      border: '1px solid rgba(237,239,243,0.05)',
                    }}
                  >
                    <div
                      className="absolute flex items-center overflow-hidden rounded-md"
                      style={{
                        top: 5,
                        bottom: 5,
                        left: `${left}%`,
                        width: seen ? `${width}%` : '0%',
                        background: barBg,
                        padding: '0 12px',
                        transition: 'width 1.15s cubic-bezier(.2,.7,.2,1)',
                        boxShadow: `0 0 0 1px ${ring}, 0 8px 26px ${glow}`,
                      }}
                    >
                      <span
                        className="whitespace-nowrap font-mono text-[11.5px] font-semibold"
                        style={{ color: '#0E0F13' }}
                      >
                        {/* compact on mobile (bar is narrow); full label sm+ */}
                        <span className="sm:hidden">{years}y</span>
                        <span className="hidden sm:inline">{dur}</span>
                      </span>
                      {active && (
                        <span
                          className="absolute size-[11px] animate-pulse rounded-full"
                          style={{
                            right: -4,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'var(--primary)',
                            boxShadow:
                              '0 0 0 4px color-mix(in srgb, var(--primary) 16%, transparent), 0 0 12px color-mix(in srgb, var(--primary) 80%, transparent)',
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* desc + tags */}
                <div className="mt-2 grid gap-3.5" style={COLS}>
                  <div />
                  <div>
                    {(p.nonConfidentialImpact || p.description) && (
                      <div className="mb-2 text-[13.5px] text-muted">
                        {p.nonConfidentialImpact ?? p.description}
                      </div>
                    )}
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {tags.map((t) => (
                          <span
                            key={t}
                            className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[11px] text-muted"
                            style={{ background: 'rgba(237,239,243,0.02)' }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* child sub-spans */}
                {kids.length > 0 && (
                  <div className="mt-3 flex flex-col gap-1.5">
                    {kids.map((c, ci) => {
                      const cw = width * 0.6;
                      const cl =
                        left + (width - cw) * (kids.length > 1 ? ci / (kids.length - 1) : 0);
                      return (
                        <div key={c.name} className="grid items-center gap-3.5" style={COLS}>
                          <div className="flex min-w-0 items-center gap-1.5 pl-2.5">
                            <span className="flex-none font-mono" style={{ color: '#262A33' }}>
                              └
                            </span>
                            <div className="min-w-0">
                              <div
                                className="truncate font-mono text-xs"
                                style={{ color: '#c9cdd6' }}
                              >
                                {c.name}
                              </div>
                              <div className="truncate text-[11px] text-muted">{c.sub}</div>
                            </div>
                          </div>
                          <div
                            className="relative h-[22px] rounded-md"
                            style={{
                              backgroundColor: '#101217',
                              backgroundImage:
                                'linear-gradient(90deg, rgba(38,42,51,0.5) 1px, transparent 1px)',
                              backgroundSize: `${gridPct}% 100%`,
                            }}
                          >
                            <div
                              className="absolute rounded-[5px]"
                              style={{
                                top: 4,
                                bottom: 4,
                                left: `${cl}%`,
                                width: seen ? `${cw}%` : '0%',
                                background: childFill,
                                transition: `width 1.15s cubic-bezier(.2,.7,.2,1) ${0.12 * ci}s`,
                                boxShadow: `inset 0 0 0 1px ${childEdge}`,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {idx < rows.length - 1 && (
                  <div className="my-3.5 h-px" style={{ background: 'rgba(237,239,243,0.06)' }} />
                )}
              </div>
            );
          })}

          {/* root footer */}
          <div className="mt-5 flex items-center gap-2 font-mono text-[11px] text-muted">
            <span
              className="size-[7px] animate-pulse rounded-full"
              style={{ background: 'var(--primary)' }}
            />
            root span still emitting · live
          </div>
        </div>
      </div>
    </section>
  );
}
