// Mirrors abhishek-api lib/chat-events.ts — the NDJSON events the chat API streams
export type StatusCode = 'context' | 'composing' | 'fast_lane' | 'queued' | 'failed';

export type ChatEvent =
  | { type: 'status'; code: StatusCode; elapsedMs: number; waitSeconds?: number }
  | { type: 'text'; delta: string };

/** One row of an answer's status log. */
export interface StatusLine {
  code: StatusCode;
  elapsedMs: number;
  waitSeconds?: number;
}
