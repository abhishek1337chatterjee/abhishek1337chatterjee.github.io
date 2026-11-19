import { type KeyboardEvent, useCallback, useMemo, useState } from 'react';
import { useContributions } from '../../hooks/useContributions';
import { useGitHubStats } from '../../hooks/useGitHubStats';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import Reveal from '../ui/Reveal';
import { monthly, weekly } from './github/buckets';
import Waveform from './github/Waveform';

const GITHUB_USERNAME = 'abhishek1337chatterjee';

// Language segments recolored to the Trace palette instead of GitHub's brand hues.
const LANG_COLORS = [
  'var(--primary)',
  'var(--secondary)',
  '#34e5ff',
  'var(--primary-deep)',
  'var(--secondary-deep)',
  '#6b7280',
];
const langColor = (i: number) => LANG_COLORS[i % LANG_COLORS.length];

const label = 'font-mono text-xs uppercase tracking-[0.14em] text-muted';

const RANGES = [
  { id: 'week', name: 'weekly', unit: 'wk', mode: 'line' },
  { id: 'month', name: 'monthly', unit: 'mo', mode: 'bar' },
] as const;
type Range = (typeof RANGES)[number]['id'];

export default function GitHubStats() {
  const stats = useGitHubStats(GITHUB_USERNAME);
  const { total, days } = useContributions(GITHUB_USERNAME);
  const reduce = useReducedMotion();
  const [seen, setSeen] = useState(false);
  const [range, setRange] = useState<Range>('week');
  const [switched, setSwitched] = useState(false);
  const view = RANGES.find((r) => r.id === range) ?? RANGES[0];
  const buckets = useMemo(() => (range === 'week' ? weekly(days) : monthly(days)), [days, range]);

  const pickRange = (id: Range) => {
    if (id === range) return;
    setSwitched(true);
    setRange(id);
  };
  // Tablist keyboard model: arrows move between tabs and select them.
  const tabKeys = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const i = RANGES.findIndex((r) => r.id === range);
    const next = RANGES[(i + (e.key === 'ArrowRight' ? 1 : -1) + RANGES.length) % RANGES.length];
    pickRange(next.id);
    document.getElementById(`gh-tab-${next.id}`)?.focus();
  };
  const phase = reduce
    ? 'static'
    : switched
      ? 'switch'
      : seen && buckets.length > 1
        ? 'play'
        : 'hidden';
  const primaryLang = stats.topLanguages[0]?.name ?? '—';
  // Rounding leaves tiny languages at 0%; a 0% chip reads as noise.
  const langs = stats.topLanguages.filter((l) => l.percentage > 0);

  // Draw the waveform when the panel first scrolls into view (and data has arrived).
  const observeRef = useCallback((el: HTMLDivElement | null) => {
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
  }, []);

  return (
    <section id="github" className="content-defer px-5 py-16 sm:px-8 lg:px-16">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
            <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
              <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                github.metrics
              </h2>
              <p className="font-mono text-sm text-muted">
                contributions / {range} · last 12 months
              </p>
            </div>
            <p className="flex items-baseline gap-2">
              <span className="font-display text-4xl leading-none font-bold tabular-nums text-[color:var(--primary)] sm:text-5xl">
                {total ? total.toLocaleString() : '—'}
              </span>
              <span className="font-mono text-sm text-muted">contributions</span>
            </p>
          </div>
        </Reveal>

        <Reveal className="mt-8">
          <div
            ref={observeRef}
            className="rounded-xl border border-line bg-base-200/60 px-4 pt-5 pb-4 sm:px-6"
          >
            <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-3">
              <span className={label}>contributions / {range}</span>
              <span className="flex items-center gap-1.5 font-mono text-xs text-[color:var(--primary)]">
                <span className="size-1.5 rounded-full bg-[color:var(--primary)]" />
                live from GitHub
              </span>
              <div
                role="tablist"
                aria-label="Graph range"
                onKeyDown={tabKeys}
                className="ml-auto flex rounded-lg border border-line bg-base-100 p-1"
              >
                {RANGES.map((r) => {
                  const on = r.id === range;
                  return (
                    <button
                      key={r.id}
                      id={`gh-tab-${r.id}`}
                      type="button"
                      role="tab"
                      aria-selected={on}
                      aria-controls="gh-graph"
                      tabIndex={on ? 0 : -1}
                      onClick={() => pickRange(r.id)}
                      className={`flex min-h-10 items-center gap-1.5 rounded-md px-3 font-mono text-xs uppercase tracking-[0.12em] transition-colors sm:min-h-8 ${on ? 'bg-base-300 text-ink' : 'text-muted hover:text-ink'}`}
                    >
                      {on && <span className="size-1.5 rounded-full bg-[color:var(--primary)]" />}
                      {r.name}
                    </button>
                  );
                })}
              </div>
            </div>
            <div
              id="gh-graph"
              role="tabpanel"
              aria-labelledby={`gh-tab-${range}`}
              className="h-56 sm:h-72"
            >
              <Waveform
                key={range}
                buckets={buckets}
                mode={view.mode}
                unit={view.unit}
                phase={phase}
              />
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.05} className="mt-6">
          <div className="grid divide-y divide-line border-t border-line md:grid-cols-[auto_auto_minmax(0,1fr)] md:divide-x md:divide-y-0">
            <div className="py-5 md:pr-8">
              <p className={label}>public repos</p>
              <p className="mt-1.5 font-display text-3xl font-bold tabular-nums text-ink">
                {stats.loading ? '—' : stats.publicRepos}
              </p>
            </div>
            <div className="py-5 md:px-8">
              <p className={label}>primary language</p>
              <p className="mt-1.5 font-display text-3xl font-bold text-ink">{primaryLang}</p>
            </div>
            <div className="py-5 md:pl-8">
              <p className={label}>language split</p>
              {langs.length > 0 && (
                <>
                  <div className="mt-3 flex h-2.5 overflow-hidden rounded-full bg-base-300">
                    {langs.map((lang, i) => (
                      <span
                        key={lang.name}
                        style={{ width: `${lang.percentage}%`, background: langColor(i) }}
                      />
                    ))}
                  </div>
                  <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 font-mono text-xs">
                    {langs.map((lang, i) => (
                      <li key={lang.name} className="flex items-center gap-2">
                        <span
                          className="size-2 rounded-full"
                          style={{ background: langColor(i) }}
                        />
                        <span className="text-ink/80">{lang.name}</span>
                        <span className="tabular-nums text-muted">{lang.percentage}%</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
          <a
            href={`https://github.com/${GITHUB_USERNAME}`}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex items-center gap-2 font-mono text-sm text-muted transition-colors hover:text-[color:var(--primary)]"
          >
            view full profile on GitHub →
          </a>
        </Reveal>
      </div>
    </section>
  );
}
