import { useContributions } from '../../hooks/useContributions';
import { useGitHubStats } from '../../hooks/useGitHubStats';
import Reveal from '../ui/Reveal';
import SectionHeader from '../ui/SectionHeader';

const GITHUB_USERNAME = 'abhishek1337chatterjee';

// contribution level (0–4) → teal ramp, matching the legend
const LEVEL_BG = [
  '#1a1d24',
  'color-mix(in srgb, var(--primary) 22%, transparent)',
  'color-mix(in srgb, var(--primary) 42%, transparent)',
  'color-mix(in srgb, var(--primary) 66%, transparent)',
  'var(--primary)',
];

const cardCls = 'min-w-0 rounded-2xl border border-line bg-base-300/40 p-5 sm:p-6';

// Language segments recolored to the Trace palette (teal → amber → cyan → deeps →
// muted tail) instead of GitHub's brand hues, to match the rest of the console.
const LANG_COLORS = [
  'var(--primary)',
  'var(--secondary)',
  '#34e5ff',
  'var(--primary-deep)',
  'var(--secondary-deep)',
  '#6b7280',
];
const langColor = (i: number) => LANG_COLORS[i % LANG_COLORS.length];

export default function GitHubStats() {
  const stats = useGitHubStats(GITHUB_USERNAME);
  const { total, cells } = useContributions(GITHUB_USERNAME);
  const primaryLang = stats.topLanguages[0]?.name ?? '—';

  return (
    <section id="github" className="content-defer px-5 py-16 sm:px-8 lg:px-16">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal>
          <SectionHeader num="07" label="telemetry dashboard" title="github.metrics" />
        </Reveal>

        <div className="mt-6 grid grid-cols-1 gap-4">
          {/* contributions + heatmap */}
          <Reveal>
            <div className={cardCls}>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2.5">
                <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
                  contributions · last 12 months
                </span>
                <span
                  className="font-mono text-[15px] font-semibold"
                  style={{ color: 'var(--primary)' }}
                >
                  {total ? total.toLocaleString() : '—'}
                </span>
              </div>

              <div className="overflow-x-auto pb-1 [scrollbar-width:thin]">
                <div
                  style={{
                    display: 'grid',
                    gridAutoFlow: 'column',
                    gridTemplateRows: 'repeat(7, 13px)',
                    gridAutoColumns: 'minmax(13px, 1fr)',
                    gap: '3px',
                    width: '100%',
                  }}
                >
                  {cells.map((c) => (
                    <div
                      key={c.date}
                      style={{ borderRadius: 2, background: LEVEL_BG[c.level] ?? LEVEL_BG[0] }}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-3.5 flex items-center gap-1.5 font-mono text-[10.5px] text-muted">
                less
                {LEVEL_BG.map((bg, i) => (
                  <span
                    key={bg}
                    className="inline-block size-[11px] rounded-[2px]"
                    style={{ background: bg, marginLeft: i === 0 ? 4 : 0 }}
                  />
                ))}
                more
              </div>
            </div>
          </Reveal>

          {/* language distribution + repo stats */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {stats.topLanguages.length > 0 && (
              <Reveal className="h-full">
                <div className={`${cardCls} h-full`}>
                  <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
                    language distribution
                  </span>
                  <div className="mt-4 flex h-4 overflow-hidden rounded-md bg-base-100">
                    {stats.topLanguages.map((lang, i) => (
                      <div
                        key={lang.name}
                        style={{ width: `${lang.percentage}%`, background: langColor(i) }}
                        title={`${lang.name} ${lang.percentage}%`}
                      />
                    ))}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                    {stats.topLanguages.map((lang, i) => (
                      <span key={lang.name} className="flex items-center gap-2 font-mono text-xs">
                        <span
                          className="size-2 rounded-full"
                          style={{ background: langColor(i) }}
                        />
                        <span className="text-muted">{lang.name}</span>
                        <span className="text-ink">{lang.percentage}%</span>
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            )}

            <Reveal delay={0.05} className="h-full">
              <div className={`${cardCls} grid h-full grid-cols-2 place-content-center gap-5`}>
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
                    public repos
                  </span>
                  <p className="mt-1.5 font-display text-3xl font-bold text-ink">
                    {stats.loading ? '—' : stats.publicRepos}
                  </p>
                </div>
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
                    primary language
                  </span>
                  <p className="mt-1.5 font-display text-3xl font-bold text-ink">{primaryLang}</p>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <a
              href={`https://github.com/${GITHUB_USERNAME}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-line bg-base-200/40 px-5 py-2.5 font-mono text-sm text-ink transition-colors hover:border-[color:var(--primary)] hover:text-[color:var(--primary)]"
            >
              view full profile →
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
