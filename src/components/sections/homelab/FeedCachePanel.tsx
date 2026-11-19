import { Pause, Play, RotateCcw } from 'lucide-react';
import { type CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from '../../../hooks/useReducedMotion';
import { TAP_44 } from '../../ui/tapArea';
import {
  DEADLINE_S,
  FEEDS,
  type Job,
  MISS_WAIT_S,
  REFRESH_MIN,
  simulate,
  WORKERS,
} from './feedCache';

// Whole cold start squeezed into a few seconds of screen time.
const PLAY_S = 9;
const TEAL = 'var(--primary)';
const AMBER = 'var(--secondary)';
const FAIL = '#ff6b6b';

type Status = 'idle' | 'playing' | 'paused' | 'done';
type CellState = 'queued' | 'asked' | 'fetching' | 'fresh' | 'failed';

function cellState(job: Job, t: number): CellState {
  if (t >= job.end) return job.ok ? 'fresh' : 'failed';
  if (t >= job.start) return 'fetching';
  if (job.askedAt !== undefined && t >= job.askedAt) return 'asked';
  return 'queued';
}

const fmt = (s: number) => `${s.toFixed(1)} s`;

function describe(job: Job, t: number): string {
  const n = `feed ${job.feed + 1}`;
  const w = `w${job.worker + 1}`;
  const state = cellState(job, t);
  if (job.askedAt !== undefined) {
    const served = job.end - job.askedAt;
    if (state === 'asked') return `${n} · glance asked for it · jumps the queue`;
    if (state === 'fetching') return `${n} · glance asked for it · fetching on ${w}`;
    if (state === 'fresh')
      return served <= MISS_WAIT_S
        ? `${n} · glance asked · served in ${fmt(served)}, inside its ${MISS_WAIT_S} s wait`
        : `${n} · glance asked · took ${fmt(served)}, glance got a 503 and the next load is fresh`;
  }
  if (state === 'queued') return `${n} · queued, in config order`;
  if (state === 'fetching')
    return `${n} · fetching on ${w} · ${fmt(t - job.start)} of ${DEADLINE_S} s`;
  if (state === 'failed')
    return `${n} · slow site · cut off at ${DEADLINE_S} s · retried next minute`;
  return `${n} · fresh · ${w} took ${fmt(job.end - job.start)}`;
}

const CELL: Record<CellState, CSSProperties> = {
  queued: { border: '1px solid #262a33' },
  asked: { border: '1px dashed var(--color-ink, #edeff3)' },
  fetching: { background: AMBER },
  fresh: { background: `color-mix(in srgb, ${TEAL} 70%, transparent)` },
  failed: { border: `1px solid ${FAIL}` },
};

// The Go cache's real cold start, replayed: one cell per cached feed, five workers,
// a 20 s deadline. Timings are illustrative; the rules are the service's own.
export default function FeedCachePanel({
  deployedUrl,
  image,
  title,
}: {
  deployedUrl?: string;
  image?: string;
  title: string;
}) {
  const reduce = useReducedMotion();
  const { jobs, total } = useMemo(simulate, []);
  const byFeed = useMemo(() => {
    const m: Job[] = [];
    for (const j of jobs) m[j.feed] = j;
    return m;
  }, [jobs]);
  const speed = total / PLAY_S;

  const [t, setT] = useState(reduce ? total : 0);
  const [status, setStatus] = useState<Status>(reduce ? 'done' : 'idle');
  const [hoverFeed, setHoverFeed] = useState<number | null>(null);
  const elapsed = useRef(reduce ? total : 0);

  useEffect(() => {
    if (status !== 'playing') return;
    let raf = 0;
    let last = performance.now();
    const step = (now: number) => {
      elapsed.current = Math.min(total, elapsed.current + ((now - last) / 1000) * speed);
      last = now;
      setT(elapsed.current);
      if (elapsed.current >= total) setStatus('done');
      else raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [status, total, speed]);

  // Plays once, the first time the panel is mostly on screen.
  const observeRef = useCallback(
    (el: HTMLDivElement | null) => {
      if (!el || reduce) return;
      const io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            setStatus((s) => (s === 'idle' ? 'playing' : s));
            io.disconnect();
          }
        },
        { threshold: 0.5 },
      );
      io.observe(el);
    },
    [reduce],
  );

  const control = () => {
    if (status === 'playing') setStatus('paused');
    else if (status === 'done') {
      elapsed.current = 0;
      setT(0);
      setStatus('playing');
    } else setStatus('playing');
  };

  const fresh = jobs.filter((j) => j.ok && t >= j.end).length;
  const failed = jobs.filter((j) => !j.ok && t >= j.end).length;
  const asked = jobs.find((j) => j.askedAt !== undefined);
  const lanes = Array.from({ length: WORKERS }, (_, w) =>
    jobs.find((j) => j.worker === w && t >= j.start && t < j.end),
  );
  const readout =
    hoverFeed !== null
      ? describe(byFeed[hoverFeed], t)
      : asked && t >= (asked.askedAt ?? 0) && t < asked.end + 1.5
        ? describe(asked, t)
        : status === 'done'
          ? `cold start done · ${fresh} fresh${failed ? ` · ${failed} slow, retried` : ''} · next pass in ${REFRESH_MIN} min`
          : 'hover a cell to read it';
  const statusText =
    status === 'done'
      ? 'cold start · done'
      : status === 'paused'
        ? 'cold start · paused'
        : 'cold start · replaying';

  return (
    <div ref={observeRef} className="rounded-2xl border border-line bg-base-200/40 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <p className="flex items-center gap-2 font-mono text-xs text-muted">
          <span className="size-2 rounded-full" style={{ background: TEAL }} />
          <span className="text-ink">go feed cache</span>
          <span className="hidden sm:inline">
            · what sits in front of the dashboard · standard library only
          </span>
        </p>
        <div className="flex items-center gap-4">
          <p className="font-mono text-sm tabular-nums">
            <span className="text-ink">{fresh}</span>
            <span className="text-muted"> / {FEEDS} feeds fresh</span>
          </p>
          <button
            type="button"
            onClick={control}
            className={`relative inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 font-mono text-xs text-muted transition-colors hover:text-ink ${TAP_44}`}
          >
            {status === 'playing' ? (
              <Pause aria-hidden className="size-3.5" />
            ) : status === 'done' ? (
              <RotateCcw aria-hidden className="size-3.5" />
            ) : (
              <Play aria-hidden className="size-3.5" />
            )}
            {status === 'done' ? 'replay' : status === 'playing' ? 'pause' : 'play'}
            <span className="sr-only">the cold-start replay ({statusText})</span>
          </button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_16rem_13rem] lg:gap-8">
        {/* one cell per cached feed */}
        <div>
          <ul
            aria-label={`${FEEDS} cached feeds: ${fresh} fresh`}
            className="grid grid-cols-[repeat(auto-fill,minmax(1.1rem,1fr))] gap-1"
            onMouseLeave={() => setHoverFeed(null)}
          >
            {byFeed.map((job) => {
              const s = cellState(job, t);
              return (
                <li
                  key={job.feed}
                  aria-hidden
                  onMouseEnter={() => setHoverFeed(job.feed)}
                  className="aspect-square rounded-[3px] transition-colors duration-150"
                  style={{
                    ...CELL[s],
                    outline:
                      hoverFeed === job.feed ? '1px solid var(--color-ink, #edeff3)' : undefined,
                    outlineOffset: 1,
                  }}
                />
              );
            })}
          </ul>
          <p
            aria-live="off"
            className="mt-3 line-clamp-3 h-12 font-mono text-xs text-ink/80 sm:line-clamp-1 sm:h-5"
          >
            {readout}
          </p>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-muted">
            <li className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-[2px]" style={CELL.fresh} />
              fresh
            </li>
            <li className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-[2px]" style={CELL.fetching} />
              fetching
            </li>
            <li className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-[2px]" style={CELL.asked} />
              glance asked · jumps the queue
            </li>
            <li className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-[2px]" style={CELL.failed} />
              cut off at {DEADLINE_S} s
            </li>
          </ul>
        </div>

        {/* worker pool: each bar runs toward the fetch deadline */}
        <div>
          <p className="font-mono text-[11px] text-muted">worker pool · {WORKERS} at a time</p>
          <ul className="mt-3 space-y-2.5">
            {lanes.map((job, w) => {
              const p = job ? Math.min(1, (t - job.start) / DEADLINE_S) : 0;
              const late = job && !job.ok && p > 0.85;
              return (
                <li
                  key={w}
                  className="grid grid-cols-[1.75rem_minmax(0,1fr)_2.5rem] items-center gap-2 font-mono text-[11px]"
                >
                  <span className="text-muted">w{w + 1}</span>
                  <span className="relative h-2 rounded-sm bg-base-300">
                    <span
                      className="absolute inset-y-0 left-0 rounded-sm"
                      style={{ width: `${p * 100}%`, background: late ? FAIL : AMBER }}
                    />
                    <span className="absolute -top-1 right-0 h-4 w-px bg-[#5d6370]" />
                  </span>
                  <span className="tabular-nums text-muted">{job ? `#${job.feed + 1}` : '—'}</span>
                </li>
              );
            })}
          </ul>
          <p className="mt-3 font-mono text-[11px] text-muted">
            {DEADLINE_S} s per fetch · refresh every {REFRESH_MIN} min
          </p>
        </div>

        {/* the reader */}
        <div className="flex flex-col justify-center gap-2 border-t border-dashed border-line pt-4 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
          <p className="font-mono text-[11px] text-muted">glance · reads from the cache</p>
          {image && (
            <img
              src={image}
              alt={`${title}, the live page`}
              width={400}
              height={225}
              loading="lazy"
              decoding="async"
              className="aspect-video w-full max-w-64 rounded-md border border-line object-cover object-top"
            />
          )}
          {deployedUrl && (
            <a
              href={deployedUrl}
              target="_blank"
              rel="noreferrer"
              className={`relative whitespace-nowrap font-mono text-sm transition-opacity hover:opacity-80 ${TAP_44}`}
              style={{ color: TEAL }}
            >
              open dashboard ↗ <span className="text-muted">· live</span>
            </a>
          )}
          <p className="font-mono text-[11px] leading-relaxed text-muted">
            a miss waits ≤ {MISS_WAIT_S} s, under Glance's own 5 s timeout
          </p>
        </div>
      </div>

      <p className="mt-4 font-mono text-[11px] text-muted/80">
        replay of a cold start · timings illustrative · workers, deadline and queue rules are the
        service's own
      </p>
    </div>
  );
}
