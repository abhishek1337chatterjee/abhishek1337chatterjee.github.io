import { ExternalLink } from 'lucide-react';
import { useHomelab } from '../../hooks/useSanityData';
import type { HomelabFeature } from '../../lib/sanity';
import Reveal from '../ui/Reveal';
import SectionHeader from '../ui/SectionHeader';
import Tag from '../ui/Tag';

const tagCls = 'rounded bg-base-300/50 px-2 py-0.5 font-mono text-[11px] text-muted';
const linkCls =
  'inline-flex items-center gap-1.5 font-mono text-sm text-muted transition-colors hover:text-[color:var(--primary)]';

function LiveDot() {
  return (
    <span
      className="size-2 rounded-full"
      style={{
        background: 'var(--primary)',
        boxShadow: '0 0 6px color-mix(in srgb, var(--primary) 80%, transparent)',
      }}
    />
  );
}

function SideBuild({ build }: { build: HomelabFeature }) {
  return (
    <div className="rounded-xl border border-line bg-base-200/40 p-6">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-display text-lg font-semibold text-ink">{build.title}</h3>
        {build.githubUrl && <Tag color="var(--primary)">open source</Tag>}
      </div>
      {build.description && (
        <p className="mt-3 text-sm leading-relaxed text-muted">{build.description}</p>
      )}
      {build.techStack && build.techStack.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {build.techStack.slice(0, 6).map((t) => (
            <span key={t} className={tagCls}>
              {t.trim()}
            </span>
          ))}
        </div>
      )}
      {build.githubUrl && (
        <a href={build.githubUrl} target="_blank" rel="noreferrer" className={`mt-4 ${linkCls}`}>
          <ExternalLink size={14} />
          github
        </a>
      )}
    </div>
  );
}

export default function Homelab() {
  const { homelab } = useHomelab();
  const center = homelab?.centerpiece;
  if (!homelab || !center) return null;

  const builds = homelab.sideProjects ?? [];

  return (
    <section id="homelab" className="content-defer px-5 py-16 sm:px-8 lg:px-16">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal>
          <SectionHeader num="06" label="self-hosted" title={homelab.heading ?? 'Side builds'} />
          {center.deployedUrl && (
            <a
              href={center.deployedUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 font-mono text-sm transition-opacity hover:opacity-80"
            >
              <LiveDot />
              <span style={{ color: 'var(--primary)' }}>{center.title.toLowerCase()} live</span>
              <span className="text-muted">· render</span>
            </a>
          )}
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {/* centerpiece: the always-on dashboard */}
          <Reveal className="lg:col-span-2">
            <div className="flex h-full flex-col rounded-xl border border-line bg-base-200/40 p-6 sm:p-8">
              {center.image && (
                <div className="relative mb-5 overflow-hidden rounded-lg border border-line">
                  <img
                    src={center.image}
                    alt={center.title}
                    loading="lazy"
                    decoding="async"
                    className="max-h-52 w-full object-cover"
                  />
                  {center.deployedUrl && (
                    <span className="absolute right-2 bottom-2 inline-flex items-center gap-1.5 rounded bg-base-100/80 px-2 py-0.5 font-mono text-[10px] text-muted backdrop-blur-sm">
                      <LiveDot />
                      live · render
                    </span>
                  )}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-display text-xl font-semibold text-ink">{center.title}</h3>
                <Tag color="var(--secondary)">centerpiece</Tag>
              </div>

              {center.description && (
                <p className="mt-4 text-sm leading-relaxed text-muted">{center.description}</p>
              )}

              {center.features && center.features.length > 0 && (
                <ul className="mt-4 space-y-1.5 text-sm text-muted">
                  {center.features.slice(0, 4).map((f) => (
                    <li key={f} className="flex gap-2">
                      <span style={{ color: 'var(--primary)' }}>›</span>
                      {f}
                    </li>
                  ))}
                </ul>
              )}

              {center.techStack && center.techStack.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {center.techStack.slice(0, 9).map((t) => (
                    <span key={t} className={tagCls}>
                      {t.trim()}
                    </span>
                  ))}
                </div>
              )}

              {center.deployedUrl && (
                <a
                  href={center.deployedUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-auto inline-flex items-center gap-1.5 pt-6 font-mono text-sm transition-opacity hover:opacity-80"
                  style={{ color: 'var(--primary)' }}
                >
                  <ExternalLink size={14} />
                  open dashboard <span className="text-muted">· live</span>
                </a>
              )}
            </div>
          </Reveal>

          {/* right column: every other side project from the CMS */}
          {builds.length > 0 && (
            <Reveal delay={0.1}>
              <div className="flex h-full flex-col gap-6">
                {builds.map((b) => (
                  <SideBuild key={b.title} build={b} />
                ))}
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
