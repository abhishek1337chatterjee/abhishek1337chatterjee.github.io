import { useHomelab } from '../../hooks/useSanityData';
import type { HomelabFeature } from '../../lib/sanity';
import Reveal from '../ui/Reveal';
import FeedCachePanel from './homelab/FeedCachePanel';

const linkCls = 'font-mono text-xs text-[color:var(--primary)] transition-opacity hover:opacity-80';

function LiveDot() {
  return (
    <span
      className="inline-block size-2 rounded-full align-middle"
      style={{
        background: 'var(--primary)',
        boxShadow: '0 0 6px color-mix(in srgb, var(--primary) 80%, transparent)',
      }}
    />
  );
}

// One build in the strip under the panel; an image shows only when the CMS has one.
function Build({ build, centerpiece }: { build: HomelabFeature; centerpiece?: boolean }) {
  return (
    <li className="flex flex-col py-5 md:px-6 md:first:pl-0 md:last:pr-0">
      {build.image && !centerpiece && (
        <img
          src={build.image}
          alt={`${build.title}, screenshot`}
          loading="lazy"
          decoding="async"
          className="mb-4 h-auto max-h-40 w-full rounded-md border border-line object-cover object-left-top"
        />
      )}
      <h3 className="flex flex-wrap items-baseline gap-x-2 font-display text-lg font-semibold text-ink">
        {build.title}
        {centerpiece && (
          <span className="font-mono text-[11px] font-normal text-[color:var(--secondary)]">
            centerpiece
          </span>
        )}
      </h3>
      {build.description && (
        <p className="mt-2 text-sm leading-relaxed text-ink/70">{build.description}</p>
      )}
      <p className="mt-auto flex flex-wrap items-baseline gap-x-3 gap-y-1 pt-3 font-mono text-[11px] text-muted">
        {build.techStack && build.techStack.length > 0 && (
          <span>
            {build.techStack
              .slice(0, 6)
              .map((t) => t.trim())
              .join(' · ')}
          </span>
        )}
        {build.githubUrl && (
          <a href={build.githubUrl} target="_blank" rel="noreferrer" className={linkCls}>
            github ↗
          </a>
        )}
        {centerpiece && build.deployedUrl && (
          <a href={build.deployedUrl} target="_blank" rel="noreferrer" className={linkCls}>
            open dashboard ↗
          </a>
        )}
      </p>
    </li>
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
          <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
            <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              {homelab.heading ?? 'Side builds'}
            </h2>
            <p className="font-mono text-sm text-muted">
              <span>{builds.length + 1} builds</span>
              {center.deployedUrl && (
                <a
                  href={center.deployedUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-opacity hover:opacity-80"
                >
                  {' · '}
                  <LiveDot />{' '}
                  <span className="text-[color:var(--primary)]">
                    {center.title.toLowerCase()} live
                  </span>
                  {' · render free tier'}
                </a>
              )}
            </p>
          </div>
        </Reveal>

        <Reveal className="mt-8">
          <FeedCachePanel
            deployedUrl={center.deployedUrl}
            image={center.image}
            title={center.title}
          />
        </Reveal>

        <Reveal delay={0.05} className="mt-6">
          <ul className="grid divide-y divide-line border-t border-line md:auto-cols-fr md:grid-flow-col md:divide-x md:divide-y-0">
            <Build build={center} centerpiece />
            {builds.map((b) => (
              <Build key={b.title} build={b} />
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
