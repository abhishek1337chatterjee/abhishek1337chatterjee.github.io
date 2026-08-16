import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useCaseStudies } from '../../hooks/useSanityData';
import type { SanityCaseStudy } from '../../lib/sanity';
import SectionHeader from '../ui/SectionHeader';

// Fired by the "ask the chatbot about this" link; ChatBot listens and prefills.
export function askChatAbout(question: string) {
  window.dispatchEvent(new CustomEvent('tm-ask-chat', { detail: { question } }));
}

function StatusDot() {
  return (
    <span
      className="size-[7px] flex-none rounded-full"
      style={{
        background: 'var(--primary)',
        boxShadow: '0 0 6px color-mix(in srgb, var(--primary) 70%, transparent)',
      }}
    />
  );
}

function DetailPane({ study }: { study: SanityCaseStudy }) {
  return (
    <div
      className="rounded-xl border bg-base-200 p-5 sm:p-6"
      style={{
        borderColor: 'color-mix(in srgb, var(--primary) 40%, var(--color-line))',
        boxShadow:
          '0 0 0 1px color-mix(in srgb, var(--primary) 12%, transparent), 0 10px 34px -20px color-mix(in srgb, var(--primary) 40%, transparent)',
      }}
    >
      <div className="mb-2.5 flex items-center gap-2 font-mono text-[12.5px]">
        <StatusDot />
        <span className="text-ink">
          <span className="text-muted">svc/</span>
          {study.slug}
        </span>
        {study.flagship && (
          <span
            className="ml-auto rounded-full border px-2 py-0.5 font-mono text-[10.5px] uppercase tracking-[0.1em]"
            style={{
              color: 'var(--primary)',
              borderColor: 'color-mix(in srgb, var(--primary) 40%, transparent)',
            }}
          >
            flagship
          </span>
        )}
      </div>

      <h3 className="font-display text-xl font-semibold tracking-tight text-ink">{study.title}</h3>
      <p className="mt-1.5 max-w-2xl text-sm text-muted">{study.oneLiner}</p>

      {study.domainTags && study.domainTags.length > 0 && (
        <div className="mt-3.5 flex flex-wrap gap-1.5">
          {study.domainTags.map((t) => (
            <span
              key={t}
              className="rounded-md border px-1.5 py-0.5 font-mono text-[10.5px]"
              style={{
                color: 'var(--secondary)',
                borderColor: 'color-mix(in srgb, var(--secondary) 35%, transparent)',
                background: 'color-mix(in srgb, var(--secondary) 8%, transparent)',
              }}
            >
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 grid gap-5 border-t border-line pt-4 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <h4 className="mb-2 font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted">
            Engineering highlights
          </h4>
          <ul className="flex flex-col gap-2">
            {study.highlights.map((h) => (
              <li key={h} className="relative pl-4 text-[13.5px] text-ink">
                <span className="absolute left-0 font-mono" style={{ color: 'var(--primary)' }}>
                  ›
                </span>
                {h}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-2 font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted">
            Stack
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {study.stack.map((s) => (
              <span
                key={s}
                className="rounded-md border px-1.5 py-0.5 font-mono text-[10.5px]"
                style={{
                  color: 'var(--primary)',
                  borderColor: 'color-mix(in srgb, var(--primary) 30%, transparent)',
                  background: 'color-mix(in srgb, var(--primary) 7%, transparent)',
                }}
              >
                {s}
              </span>
            ))}
          </div>
          <button
            type="button"
            onClick={() =>
              askChatAbout(study.chatPrompt ?? `Tell me about the "${study.title}" case study`)
            }
            className="mt-3.5 font-mono text-[12.5px] text-muted transition-colors hover:text-ink"
          >
            → <span style={{ color: 'var(--primary)' }}>ask the chatbot about this</span>
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap justify-between gap-2 border-t border-line pt-3 font-mono text-[11px] text-muted">
        <span>{study.timeline}</span>
        <span>{study.role}</span>
      </div>
    </div>
  );
}

export default function ServiceMap() {
  const { caseStudies } = useCaseStudies();
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Default selection: first flagship, else first study
  const selected = useMemo(() => {
    if (!caseStudies.length) return null;
    return (
      caseStudies.find((c) => c._id === selectedId) ??
      caseStudies.find((c) => c.flagship) ??
      caseStudies[0]
    );
  }, [caseStudies, selectedId]);

  // ↑↓ browsing while the list has focus (desktop)
  useEffect(() => {
    if (!caseStudies.length || !selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (!(e.target as HTMLElement)?.closest?.('[data-svc-list]')) return;
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      e.preventDefault();
      const idx = caseStudies.findIndex((c) => c._id === selected._id);
      const next = e.key === 'ArrowDown' ? idx + 1 : idx - 1;
      const target = caseStudies[(next + caseStudies.length) % caseStudies.length];
      setSelectedId(target._id);
      document.querySelector<HTMLButtonElement>(`[data-svc-row="${target._id}"]`)?.focus();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [caseStudies, selected]);

  if (!caseStudies.length || !selected) return null;

  const row = (c: SanityCaseStudy, active: boolean) => (
    <button
      type="button"
      data-svc-row={c._id}
      onClick={() => setSelectedId(active && isMobile ? '' : c._id)}
      aria-current={active}
      aria-expanded={isMobile ? active : undefined}
      className={`flex w-full items-center gap-2.5 rounded-[10px] border px-3.5 py-2.5 text-left font-mono text-[12.5px] transition-colors ${
        active
          ? 'border-[color-mix(in_srgb,var(--primary)_50%,var(--color-line))] bg-base-200 text-ink'
          : 'border-transparent text-muted hover:border-line hover:bg-base-200'
      }`}
    >
      {active && (
        <span
          className="-ml-1 h-[18px] w-[3px] flex-none rounded-sm"
          style={{ background: 'linear-gradient(180deg, var(--primary), var(--primary-deep))' }}
        />
      )}
      <StatusDot />
      <span className="truncate">
        <span className="opacity-60">svc/</span>
        {c.slug}
      </span>
      <span className="ml-auto flex items-center gap-2">
        {c.flagship && (
          <span className="text-[11px]" style={{ color: 'var(--primary)' }}>
            ⭐
          </span>
        )}
        {isMobile && (
          <span className="text-[10px] text-muted">{active ? '▴' : '▾'}</span>
        )}
      </span>
    </button>
  );

  return (
    <section id="work" className="content-defer px-5 py-16 sm:px-8 lg:px-16">
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeader num="05" label="service map · work.timemoney" title="Service map" />
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Two years of production engineering at time.money — six case studies, told at the
          architecture level. Select a service, or ask the chatbot about any of them.
        </p>

        {/* console card */}
        <div className="mt-6 rounded-2xl border border-line bg-base-300/50 p-4 sm:p-6">
          {/* meta + legend */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 font-mono text-[11.5px] text-muted">
            <span>
              trace_id <span className="text-ink">work·2024→now</span>
            </span>
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5">
                <span style={{ color: 'var(--primary)' }}>⭐</span> flagship
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span
                  className="size-2.5 rounded-[3px]"
                  style={{ background: 'var(--secondary)' }}
                />
                domain
              </span>
              <span>{caseStudies.length} services · 30+ lambdas</span>
            </div>
          </div>

          {isMobile ? (
            /* mobile: accordion — detail expands inline under the tapped row,
               so switching services never requires scrolling back up */
            <div data-svc-list className="flex flex-col gap-1.5">
              {caseStudies.map((c) => {
                const active = c._id === selected._id && selectedId !== '';
                return (
                  <div key={c._id} className="flex flex-col gap-1.5">
                    {row(c, active)}
                    <AnimatePresence initial={false}>
                      {active && (
                        <motion.div
                          initial={reducedMotion ? false : { height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={reducedMotion ? undefined : { height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <DetailPane study={c} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          ) : (
            /* desktop: master–detail — list left, always-filled detail right */
            <div className="grid items-start gap-4 md:grid-cols-[minmax(250px,320px)_1fr]">
              <nav data-svc-list className="flex flex-col gap-1.5" aria-label="Case studies">
                {caseStudies.map((c) => row(c, c._id === selected._id))}
                <div className="hidden px-3.5 pt-2 font-mono text-[10.5px] text-muted/70 md:block">
                  ↑↓ to browse · enter to select
                </div>
              </nav>
              <AnimatePresence mode="wait" initial={false}>
                <motion.article
                  key={selected._id}
                  initial={reducedMotion ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reducedMotion ? undefined : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                >
                  <DetailPane study={selected} />
                </motion.article>
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
