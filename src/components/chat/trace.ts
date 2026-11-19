import type { StatusLine } from '../../types/chat';
import { STREAMING_LABEL, type StatusTone, statusText, statusTone } from './statusMessages.ts';

/** Timing facts one answer carries; every number comes from the API or the browser clock. */
export interface TraceTimings {
  statusLines?: StatusLine[];
  /** Browser clock when the question left. */
  sentAtMs?: number;
  /** Browser clock when the first answer text arrived. */
  streamStartMs?: number;
  /** Browser clock when the latest word was shown. */
  streamLastMs?: number;
}

export type SpanKind = 'done' | 'live' | 'wait' | 'bad';

/** One bar on the shared time axis. Times are milliseconds since the request started. */
export interface Span {
  key: string;
  label: string;
  tone: StatusTone;
  kind: SpanKind;
  startMs: number;
  endMs: number;
  /** A queued span that nothing has followed yet. */
  counting: boolean;
}

export interface Trace {
  spans: Span[];
  totalMs: number;
  /** Width of the time axis; wider than the total while the answer is still running. */
  axisMs: number;
}

// Doubling steps keep the live edge between half and full width, so bars rescale rarely
function liveAxis(ms: number): number {
  let axis = 1_000;
  while (axis < ms) axis *= 2;
  return axis;
}

/**
 * Lays status events and the client-side answer stream on one time axis. A status bar ends at
 * the moment its event was logged; a queued bar starts there and runs for the wait.
 */
export function buildTrace(timings: TraceTimings, live: boolean, nowMs: number): Trace {
  const lines = timings.statusLines ?? [];
  const first = lines[0];
  // Server times count from the request start; this pins that start on the browser clock
  const originMs =
    first?.receivedAtMs !== undefined
      ? first.receivedAtMs - first.elapsedMs
      : (timings.sentAtMs ?? timings.streamStartMs ?? nowMs);
  const sinceStart = (clockMs: number) => Math.max(0, clockMs - originMs);
  const nowElapsed = sinceStart(nowMs);

  const hasStream = timings.streamStartMs !== undefined;
  const streamStart = hasStream ? sinceStart(timings.streamStartMs as number) : 0;
  const streamLast = sinceStart(timings.streamLastMs ?? timings.streamStartMs ?? originMs);

  const spans: Span[] = [];
  let cursor = 0;
  let streamPlaced = false;
  let expectedEnd = 0;

  const placeStream = (closedAt?: number) => {
    streamPlaced = true;
    const startMs = Math.max(cursor, streamStart);
    const running = live && closedAt === undefined;
    const endMs = Math.max(startMs, running ? nowElapsed : streamLast);
    spans.push({
      key: 'stream',
      label: STREAMING_LABEL,
      tone: running ? 'warn' : 'ok',
      kind: running ? 'live' : 'done',
      startMs,
      endMs,
      counting: false,
    });
    cursor = endMs;
  };

  lines.forEach((line, index) => {
    const next = lines[index + 1];
    // The API only fails after text has started, so partial text sits before the failure
    if (hasStream && !streamPlaced && line.code === 'failed') {
      placeStream(line.elapsedMs);
    }
    const key = `${line.code}-${line.elapsedMs}`;
    const tone = statusTone(line.code);

    if (line.code === 'queued') {
      const waitMs = (line.waitSeconds ?? 0) * 1_000;
      const startMs = Math.max(cursor, line.elapsedMs);
      const followedBy = next?.elapsedMs ?? (hasStream && !streamPlaced ? streamStart : undefined);
      const settled = followedBy !== undefined;
      const counting = !settled && live;
      const endMs = settled
        ? Math.max(startMs, Math.min(startMs + waitMs, followedBy))
        : counting
          ? Math.max(startMs, nowElapsed)
          : startMs;
      const secondsLeft = Math.max(
        0,
        (line.waitSeconds ?? 0) - Math.floor((nowElapsed - startMs) / 1_000),
      );
      if (counting) expectedEnd = startMs + waitMs;
      spans.push({
        key,
        label: statusText(line, settled, counting ? secondsLeft : (line.waitSeconds ?? 0)),
        tone,
        kind: 'wait',
        startMs,
        endMs,
        counting,
      });
      cursor = endMs;
      return;
    }

    const endMs = Math.max(cursor, line.elapsedMs);
    spans.push({
      key,
      label: statusText(line, true, 0),
      tone,
      kind: line.code === 'failed' ? 'bad' : 'done',
      startMs: cursor,
      endMs,
      counting: false,
    });
    cursor = endMs;
  });

  if (hasStream && !streamPlaced) placeStream();

  const totalMs = spans.reduce((max, span) => Math.max(max, span.endMs), 0);
  const axisMs = live ? liveAxis(Math.max(nowElapsed, expectedEnd, totalMs)) : Math.max(totalMs, 1);
  return { spans, totalMs, axisMs };
}

export const formatSeconds = (ms: number) => `${(ms / 1_000).toFixed(1)}s`;

/** "3 spans · 4.2s": the folded form of a finished trace. */
export function traceSummary(trace: Trace): string {
  const count = trace.spans.length;
  return `${count} ${count === 1 ? 'span' : 'spans'} · ${formatSeconds(trace.totalMs)}`;
}

export interface PageRef {
  slug: string;
  title: string;
}

// "Assessment & Scoring" and "assessment and scoring" must compare equal
const normalize = (text: string) =>
  ` ${text
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()} `;

/**
 * Case studies an answer names: the full title, or the slug's words as one phrase.
 * No fuzzy scoring, so a row never points at a study the answer did not mention.
 */
export function matchStudies(answer: string, studies: PageRef[], limit = 3): PageRef[] {
  const haystack = normalize(answer);
  return studies
    .filter(({ slug, title }) => {
      const slugPhrase = normalize(slug);
      const slugIsPhrase = slugPhrase.trim().includes(' ');
      return haystack.includes(normalize(title)) || (slugIsPhrase && haystack.includes(slugPhrase));
    })
    .slice(0, limit);
}
