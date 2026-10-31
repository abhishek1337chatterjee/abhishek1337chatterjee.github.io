import type { StatusCode, StatusLine } from '../../types/chat';

/** Visitor-facing chat status wording. Lower-case log style, never a model or provider name. */

export type StatusTone = 'ok' | 'warn' | 'error';

const FIXED_TEXT: Record<Exclude<StatusCode, 'queued'>, string> = {
  context: 'loaded portfolio context',
  composing: 'composing answer',
  fast_lane: 'high demand · switched to fast lane',
  failed: 'could not get an answer right now',
};

const TONE: Record<StatusCode, StatusTone> = {
  context: 'ok',
  composing: 'ok',
  fast_lane: 'warn',
  queued: 'warn',
  failed: 'error',
};

export const QUEUED_NOTE = 'Your question is kept. No need to send it again.';
export const TRY_AGAIN_LABEL = 'try again';
export const TRY_AGAIN_NOTE = 'or ask in a minute';
// Vercel Firewall rate limit (20 requests / 60 s per IP), hit before any streaming starts
export const FIREWALL_LIMIT_TEXT = 'too many messages · try again in a minute';

/** Text for one status row; a queued row counts down until a later status settles it. */
export function statusText(line: StatusLine, isSettled: boolean, secondsLeft: number): string {
  if (line.code !== 'queued') {
    return FIXED_TEXT[line.code];
  }
  return isSettled
    ? `high demand · waited ${line.waitSeconds ?? 0}s`
    : `high demand · starting in ${secondsLeft}s`;
}

export function statusTone(code: StatusCode): StatusTone {
  return TONE[code];
}
