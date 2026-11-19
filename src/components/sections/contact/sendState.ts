// Where the one observable hop (this page to getform.io) stands.
export type SendState =
  | { phase: 'idle' }
  | { phase: 'sending'; startedAt: number }
  | { phase: 'accepted'; status: number; ms: number; sentAt: Date; replyTo: string }
  | { phase: 'rejected'; status: number; ms: number }
  | { phase: 'timeout' }
  | { phase: 'network' };

export const hasFailed = (send: SendState) =>
  send.phase === 'rejected' || send.phase === 'timeout' || send.phase === 'network';
