import { useEffect, useState } from 'react';
import type { StatusLine } from '../../types/chat';
import { QUEUED_NOTE, type StatusTone, statusText, statusTone } from './statusMessages';

const DOT_COLOR: Record<StatusTone, string> = {
  ok: 'var(--primary)',
  warn: 'var(--secondary)',
  error: 'var(--color-error)',
};

const TEXT_COLOR: Record<StatusTone, string> = {
  ok: 'inherit',
  warn: 'color-mix(in srgb, var(--secondary) 75%, white)',
  error: 'color-mix(in srgb, var(--color-error) 80%, white)',
};

/** The "what is happening" log shown above an assistant answer. */
export default function StatusLog({ lines }: { lines: StatusLine[] }) {
  const lastLine = lines.at(-1);
  // Only a queued line that nothing has followed yet is still counting down
  const countingDown = lastLine?.code === 'queued' ? lastLine : undefined;
  const nowMs = useTicker(countingDown !== undefined);

  return (
    <div
      className="mb-2 flex flex-col gap-1.5 rounded-[10px] px-3 py-2.5 font-mono text-[11.5px] text-ink/80"
      style={{ background: 'rgba(237,239,243,0.03)', border: '1px solid rgba(237,239,243,0.08)' }}
      aria-live="polite"
    >
      {lines.map((line, index) => {
        const tone = statusTone(line.code);
        const isSettled = index < lines.length - 1;
        const left = secondsLeft(line, nowMs);
        return (
          <div key={`${line.code}-${line.elapsedMs}`} className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span
                className="size-[7px] flex-none rounded-full"
                style={{ background: DOT_COLOR[tone] }}
                aria-hidden="true"
              />
              <span className="flex-1" style={{ color: TEXT_COLOR[tone] }}>
                {statusText(line, isSettled, left)}
              </span>
              <span className="text-muted">{(line.elapsedMs / 1000).toFixed(1)}s</span>
            </div>
            {line === countingDown && (
              <>
                <div className="h-1 overflow-hidden rounded-sm bg-line">
                  <div
                    className="h-1 transition-[width] duration-1000 ease-linear"
                    style={{
                      width: `${waitProgress(line, left)}%`,
                      background: 'var(--secondary)',
                    }}
                  />
                </div>
                <p className="m-0 text-muted">{QUEUED_NOTE}</p>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Re-renders once a second while a countdown is visible, and not at all otherwise
function useTicker(active: boolean): number {
  const [nowMs, setNowMs] = useState(() => Date.now());
  useEffect(() => {
    if (!active) return;
    const timer = window.setInterval(() => setNowMs(Date.now()), 1_000);
    return () => window.clearInterval(timer);
  }, [active]);
  return nowMs;
}

function secondsLeft(line: StatusLine, nowMs: number): number {
  const waitSeconds = line.waitSeconds ?? 0;
  if (line.receivedAtMs === undefined) return waitSeconds;
  const passedSeconds = Math.floor((nowMs - line.receivedAtMs) / 1_000);
  return Math.max(0, waitSeconds - passedSeconds);
}

function waitProgress(line: StatusLine, left: number): number {
  const waitSeconds = line.waitSeconds ?? 0;
  if (waitSeconds === 0) return 100;
  return Math.round(((waitSeconds - left) / waitSeconds) * 100);
}
