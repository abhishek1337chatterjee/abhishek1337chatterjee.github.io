import { ChevronRight } from 'lucide-react';
import { useEffect, useId, useState } from 'react';
import { QUEUED_NOTE, type StatusTone, statusText } from './statusMessages';
import { buildTrace, formatSeconds, type Span, type TraceTimings, traceSummary } from './trace';

const LABEL_COLOR: Record<StatusTone, string> = {
  ok: '#c9cdd6',
  warn: 'var(--secondary)',
  error: '#ff6b6b',
};

const BAR_FILL: Record<Span['kind'], string> = {
  done: 'var(--primary-deep)',
  live: 'var(--secondary)',
  wait: 'repeating-linear-gradient(90deg, var(--secondary) 0 6px, color-mix(in srgb, var(--secondary) 33%, transparent) 6px 11px)',
  bad: '#ff6b6b',
};

// Quarter ticks on the track, so every bar reads against the same time axis
const TRACK_STYLE = {
  background: '#17191f',
  backgroundImage: 'linear-gradient(90deg, #262a33 1px, transparent 1px)',
  backgroundSize: '25% 100%',
};

/**
 * The trace of one answer: each status is a span on a shared time axis. While the answer
 * runs the spans draw live; a finished answer folds them into one summary line.
 */
export default function SpanWaterfall({
  timings,
  live,
  failed,
  reduce,
}: {
  timings: TraceTimings;
  live: boolean;
  failed: boolean;
  reduce: boolean;
}) {
  // Reduced motion: one step a second keeps the countdown honest without animating bars
  const nowMs = useNow(live, reduce ? 1_000 : 100);
  const [expanded, setExpanded] = useState(false);
  const listId = useId();
  const trace = buildTrace(timings, live, nowMs);
  if (trace.spans.length === 0) return null;

  // A failed trace stays open: the red span is the explanation
  const foldable = !live && !failed;
  const showSpans = !foldable || expanded;
  const counting = trace.spans.find((span) => span.counting);
  const lastLine = timings.statusLines?.at(-1);
  // Screen readers hear each new status once; the ticking countdown stays visual only
  const announcement = lastLine ? statusText(lastLine, false, lastLine.waitSeconds ?? 0) : '';

  return (
    <div className="font-mono text-[12.5px] text-muted md:text-xs">
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
      {foldable && (
        <button
          type="button"
          onClick={() => setExpanded((open) => !open)}
          aria-expanded={expanded}
          aria-controls={listId}
          className="-my-2 mt-0 flex min-h-9 items-center gap-[7px] transition-colors hover:text-[#34e5ff]"
        >
          <span
            aria-hidden
            className="size-1.5 rounded-full"
            style={{ background: 'var(--primary)' }}
          />
          {traceSummary(trace)}
          <ChevronRight
            aria-hidden
            className={`size-3 ${reduce ? '' : 'transition-transform'} ${expanded ? 'rotate-90' : ''}`}
          />
        </button>
      )}
      {showSpans && (
        <ul id={listId} className="mt-2 grid gap-[7px]">
          {trace.spans.map((span) => (
            <li key={span.key}>
              <div className="flex justify-between gap-2 tabular-nums">
                <span style={{ color: LABEL_COLOR[span.tone] }}>{span.label}</span>
                <span>{formatSeconds(span.endMs)}</span>
              </div>
              <div className="relative mt-1 h-1.5 rounded-[3px]" style={TRACK_STYLE}>
                <span
                  className="absolute inset-y-0 min-w-[3px] rounded-[3px]"
                  style={{
                    left: `${(span.startMs / trace.axisMs) * 100}%`,
                    width: `${((span.endMs - span.startMs) / trace.axisMs) * 100}%`,
                    background: BAR_FILL[span.kind],
                    transition:
                      live && !reduce ? 'left 120ms linear, width 120ms linear' : undefined,
                  }}
                >
                  {span.kind === 'live' && (
                    <span
                      className="absolute -top-[5px] -right-px -bottom-[5px] w-0.5"
                      style={{ background: 'var(--secondary)' }}
                    />
                  )}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
      {counting && <p className="mt-1.5 leading-normal">{QUEUED_NOTE}</p>}
    </div>
  );
}

// Re-renders on an interval only while the trace is running
function useNow(active: boolean, everyMs: number): number {
  const [nowMs, setNowMs] = useState(() => Date.now());
  useEffect(() => {
    if (!active) return;
    setNowMs(Date.now());
    const timer = window.setInterval(() => setNowMs(Date.now()), everyMs);
    return () => window.clearInterval(timer);
  }, [active, everyMs]);
  return nowMs;
}
