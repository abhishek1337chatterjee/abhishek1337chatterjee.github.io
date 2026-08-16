import { useAbout } from '../../hooks/useSanityData';
import type { HighlightedPhrase } from '../../lib/sanity';
import type { ExploringItem } from '../../types';
import Reveal from '../ui/Reveal';
import SectionHeader from '../ui/SectionHeader';
import Tag from '../ui/Tag';

// Sanity color names → theme-friendly hexes (green=teal, orange=amber match the scheme).
const COLOR_HEX: Record<string, string> = {
  cyan: '#34e5ff',
  pink: '#ff7ac6',
  green: '#3ddc97',
  orange: '#f5a623',
  purple: '#a78bfa',
};

// Tint the highlighted phrases inside the bio (longest-first to avoid partial matches).
function highlightBio(text: string, phrases: HighlightedPhrase[] = []) {
  if (!phrases.length) return text;
  const sorted = [...phrases].sort((a, b) => b.text.length - a.text.length);
  const pattern = sorted.map((p) => p.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  if (!pattern) return text;
  const regex = new RegExp(`(${pattern})`, 'g');
  return text.split(regex).map((part, i) => {
    const hit = sorted.find((p) => p.text === part);
    if (!hit) return part;
    return (
      <span
        key={`${part}-${i}`}
        className="font-medium"
        style={{ color: COLOR_HEX[hit.color] ?? 'var(--primary)' }}
      >
        {part}
      </span>
    );
  });
}

export default function About() {
  const { about } = useAbout();
  if (!about) return null;

  const bioParagraphs = about.bio?.split('\n\n').filter(Boolean) ?? [];

  // service.manifest — operational descriptor (status colored teal = available)
  const role = about.title?.split('|')[0]?.trim() || 'Serverless Engineer';
  const manifest: { k: string; v: string; live?: boolean }[] = [
    { k: 'name', v: about.name },
    { k: 'role', v: role },
    { k: 'based', v: about.location ?? 'India' },
    { k: 'region', v: 'ap-south-1' },
    { k: 'runtime', v: 'node24' },
    { k: 'status', v: 'available', live: true },
  ];

  return (
    <section id="about" className="content-defer px-5 py-16 sm:px-8 lg:px-16">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal>
          <SectionHeader num="02" label="whoami" title="About" />
        </Reveal>

        {/* service.manifest — full-width operational spec bar */}
        <Reveal delay={0.05}>
          <div className="mt-8 rounded-xl border border-line bg-base-200/40 px-5 py-4">
            <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              service.manifest
            </div>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 font-mono text-[13px] sm:grid-cols-3 lg:grid-cols-6">
              {manifest.map(({ k, v, live }) => (
                <div key={k} className="flex flex-col gap-0.5">
                  <dt className="text-[10px] uppercase tracking-wider text-muted/70">{k}</dt>
                  <dd
                    className="flex items-center gap-1.5 text-ink/90"
                    style={live ? { color: 'var(--primary)' } : undefined}
                  >
                    {live && (
                      <span
                        className="size-1.5 rounded-full"
                        style={{ background: 'var(--primary)' }}
                      />
                    )}
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-3">
          {/* bio + highlight tags */}
          <Reveal className="lg:col-span-2">
            <div className="rounded-xl border border-line bg-base-200/40 p-6 sm:p-8">
              <div className="space-y-4 leading-relaxed text-muted">
                {bioParagraphs.map((p) => (
                  <p key={p.slice(0, 32)}>{highlightBio(p, about.highlightedPhrases)}</p>
                ))}
              </div>
              {about.highlights && about.highlights.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {about.highlights.map((h) => (
                    <Tag key={h}>{h}</Tag>
                  ))}
                </div>
              )}
            </div>
          </Reveal>

          {/* currently exploring + interests */}
          <Reveal delay={0.1}>
            <div className="flex flex-col gap-6">
              {about.currentlyExploring && about.currentlyExploring.length > 0 && (
                <div className="rounded-xl border border-line bg-base-200/40 p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="relative flex size-2">
                      <span
                        className="absolute inline-flex size-full animate-ping rounded-full opacity-75"
                        style={{ background: 'var(--primary)' }}
                      />
                      <span
                        className="relative inline-flex size-2 rounded-full"
                        style={{ background: 'var(--primary)' }}
                      />
                    </span>
                    <h3 className="font-mono text-xs uppercase tracking-[0.15em] text-muted">
                      currently exploring
                    </h3>
                  </div>
                  <div className="space-y-2.5">
                    {about.currentlyExploring.map((item: ExploringItem) => {
                      const c = COLOR_HEX[item.color] ?? '#34e5ff';
                      return (
                        <div
                          key={item.name}
                          className="rounded-lg border-l-2 bg-base-300/40 px-3 py-2"
                          style={{ borderColor: c }}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-medium text-ink">{item.name}</span>
                            <span
                              className="font-mono text-[10px] uppercase tracking-wider"
                              style={{ color: c, opacity: 0.8 }}
                            >
                              {item.category}
                            </span>
                          </div>
                          {item.description && (
                            <p className="mt-0.5 text-xs text-muted">{item.description}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {about.interests && about.interests.length > 0 && (
                <div className="rounded-xl border border-line bg-base-200/40 p-5">
                  <h3 className="mb-3 font-mono text-xs uppercase tracking-[0.15em] text-muted">
                    interests
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {about.interests.map((it) => (
                      <span
                        key={it}
                        className="rounded-md bg-base-300/50 px-2.5 py-1 font-mono text-xs text-muted"
                      >
                        {it}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
