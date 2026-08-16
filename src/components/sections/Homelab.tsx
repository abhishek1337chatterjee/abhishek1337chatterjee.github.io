import { ExternalLink } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useHomelab } from '../../hooks/useSanityData';
import Reveal from '../ui/Reveal';
import SectionHeader from '../ui/SectionHeader';
import Tag from '../ui/Tag';

// Health-probe trace — beats green through the spikes, then flatlines grey past
// the last spike (node down). A dot rides it slowly and loops. Driven by `offline`.
function HealthProbe({ offline }: { offline: boolean }) {
  const reduced = useReducedMotion();
  const [play, setPlay] = useState(false);

  // start the dot once the probe scrolls into view — IO via callback-ref, since
  // framer useInView misfires under this section's content-visibility:auto
  const observe = useCallback((el: HTMLDivElement | null) => {
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setPlay(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
  }, []);

  // spikes live in x 0–144, then a flat tail to 300. Last spike ends at x=144.
  const path =
    'M0,18 L30,18 L36,6 L42,30 L48,18 L78,18 L84,6 L90,30 L96,18 L126,18 L132,6 L138,30 L144,18 L300,18';
  const GREEN = '#3ddc97';
  const GREY = '#8a91a0';
  const tail = offline ? GREY : GREEN; // down → tail greys out; up → all green

  return (
    <div ref={observe} className="relative h-9 w-full overflow-hidden">
      <svg
        viewBox="0 0 300 36"
        preserveAspectRatio="none"
        className="h-9 w-full"
        aria-hidden="true"
      >
        <defs>
          {/* hard split at x=144 (0.48): beats green, tail whatever the state is */}
          <linearGradient id="probeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset={0.48} stopColor={GREEN} />
            <stop offset={0.48} stopColor={tail} />
          </linearGradient>
        </defs>
        <path
          d={path}
          fill="none"
          stroke="url(#probeGrad)"
          strokeWidth="1.75"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={{
            opacity: reduced || play ? 1 : 0,
            transition: reduced ? undefined : 'opacity 0.6s ease',
            filter: 'drop-shadow(0 0 2px color-mix(in srgb, #3ddc97 35%, transparent))',
          }}
        />
        {/* dot rides slowly, looping — green over the beats, grey over the dead tail */}
        {play && !reduced && (
          <circle r="2.4" fill={GREEN} style={{ filter: `drop-shadow(0 0 4px ${GREEN})` }}>
            <animateMotion dur="4s" begin="0s" repeatCount="indefinite" rotate="0" path={path} />
            {offline && (
              <animate
                attributeName="fill"
                dur="4s"
                begin="0s"
                repeatCount="indefinite"
                values={`${GREEN};${GREEN};${GREY};${GREY}`}
                keyTimes="0;0.6;0.62;1"
              />
            )}
          </circle>
        )}
      </svg>
    </div>
  );
}

const tagCls = 'rounded bg-base-300/50 px-2 py-0.5 font-mono text-[11px] text-muted';

export default function Homelab() {
  const { homelab } = useHomelab();
  const center = homelab?.centerpiece;
  if (!homelab || !center) return null;

  const status = homelab.status ?? 'OFFLINE';
  const offline = status === 'OFFLINE';
  const { node, homeUrl, emergencyUrl, lastSeen, secondary: pulse } = homelab;

  return (
    <section id="homelab" className="content-defer px-5 py-16 sm:px-8 lg:px-16">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal>
          <SectionHeader num="06" label="node" title={homelab.heading ?? 'Homelab'} />
          {/* status strip — node + the two Glance instances, no contradiction */}
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-sm">
            {node && (
              <span className="text-muted">
                node <span className="text-ink">{node}</span>
              </span>
            )}
            <span className="inline-flex items-center gap-2">
              <span
                className="size-2 rounded-full"
                style={{ background: offline ? '#8a91a0' : 'var(--primary)' }}
              />
              <span className="text-muted">home</span>
              <span className="text-ink/80">{offline ? 'offline' : 'online'}</span>
              {offline && lastSeen && <span className="text-muted/70">· last seen {lastSeen}</span>}
            </span>
            {emergencyUrl && (
              <a
                href={emergencyUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 transition-opacity hover:opacity-80"
              >
                <span
                  className="size-2 rounded-full"
                  style={{
                    background: 'var(--primary)',
                    boxShadow: '0 0 6px color-mix(in srgb, var(--primary) 80%, transparent)',
                  }}
                />
                <span style={{ color: 'var(--primary)' }}>glance live</span>
                <span className="text-muted">· render</span>
              </a>
            )}
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {/* centerpiece — the Glance dashboard (dual-hosted) */}
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
                  {/* the dashboard itself is live (mirrored to Render) even while the home node is down */}
                  <span className="absolute right-2 bottom-2 inline-flex items-center gap-1.5 rounded bg-base-100/80 px-2 py-0.5 font-mono text-[10px] text-muted backdrop-blur-sm">
                    <span
                      className="size-1.5 rounded-full"
                      style={{
                        background: 'var(--primary)',
                        boxShadow: '0 0 6px color-mix(in srgb, var(--primary) 80%, transparent)',
                      }}
                    />
                    live · render
                  </span>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-display text-xl font-semibold text-ink">{center.title}</h3>
                <Tag color="var(--secondary)">centerpiece</Tag>
              </div>
              <p className="mt-1 font-mono text-xs text-muted">
                the observability dashboard that watches my node
              </p>

              {center.description && (
                <p className="mt-4 text-sm leading-relaxed text-muted">{center.description}</p>
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

              {/* dual-host explainer so the home/down vs render/live split is clear */}
              {(homeUrl || emergencyUrl) && (
                <div className="mt-auto pt-6">
                  <p className="font-mono text-[11px] text-muted/70">
                    Primary runs on the home node — currently down. An emergency copy stays live on
                    Render.
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-sm">
                    {homeUrl && (
                      <a
                        href={homeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-muted transition-colors hover:text-ink"
                      >
                        <ExternalLink size={14} />
                        home <span className="text-muted/60">· {offline ? 'offline' : 'live'}</span>
                      </a>
                    )}
                    {emergencyUrl && (
                      <a
                        href={emergencyUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 transition-opacity hover:opacity-80"
                        style={{ color: 'var(--primary)' }}
                      >
                        <ExternalLink size={14} />
                        emergency <span>· live</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Reveal>

          {/* right column — the second build (Pulse) + node heartbeat */}
          <Reveal delay={0.1}>
            <div className="flex h-full flex-col gap-6">
              {pulse && (
                <div className="rounded-xl border border-line bg-base-200/40 p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-lg font-semibold text-ink">{pulse.title}</h3>
                    <Tag color="var(--primary)">tooling</Tag>
                  </div>
                  <p className="mt-1 font-mono text-xs text-muted">local analytics · laptop-side</p>
                  {pulse.description && (
                    <p className="mt-4 text-sm leading-relaxed text-muted">{pulse.description}</p>
                  )}
                  {pulse.techStack && pulse.techStack.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {pulse.techStack.slice(0, 6).map((t) => (
                        <span key={t} className={tagCls}>
                          {t.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                  {pulse.githubUrl && (
                    <a
                      href={pulse.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-5 inline-flex items-center gap-1.5 font-mono text-sm text-muted transition-colors hover:text-[color:var(--primary)]"
                    >
                      <ExternalLink size={14} />
                      open source · github
                    </a>
                  )}
                </div>
              )}

              {/* node heartbeat — flatlines while the home node is offline */}
              <div className="flex flex-1 flex-col justify-end rounded-xl border border-line bg-base-200/40 p-6">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-[0.15em] text-muted">
                    node heartbeat
                  </span>
                  <span
                    className="font-mono text-[10px]"
                    style={{ color: offline ? '#8a91a0' : 'var(--primary)' }}
                  >
                    {offline ? 'stale' : 'nominal'}
                  </span>
                </div>
                <div className="mt-3">
                  <HealthProbe offline={offline} />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
