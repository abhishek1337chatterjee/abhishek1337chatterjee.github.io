import { useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

// Observability boot screen — a short telemetry init sequence, then reveals the app.
// Under reduced-motion it skips straight through.
const BOOT_LINES = [
  'booting trace console',
  'region ap-south-1 · serverless tier',
  'loading service manifest',
  'attaching telemetry probes',
  'status: operational',
];

export default function Loader({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(0);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    if (reduce) {
      onDone();
      return;
    }
    const timers: number[] = [];
    BOOT_LINES.forEach((_, k) => {
      timers.push(window.setTimeout(() => setShown(k + 1), 240 * k));
    });
    const total = 240 * BOOT_LINES.length + 420;
    timers.push(window.setTimeout(() => setHide(true), total));
    timers.push(window.setTimeout(() => onDone(), total + 520));
    return () => {
      for (const t of timers) window.clearTimeout(t);
    };
  }, [reduce, onDone]);

  if (reduce) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-base-100 transition-opacity duration-500 ${
        hide ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <div className="w-full max-w-md px-6 font-mono text-sm">
        {/* console header */}
        <div className="mb-5 flex items-center gap-2">
          <span className="relative flex size-2">
            <span
              className="absolute inline-flex size-full animate-ping rounded-full opacity-75"
              style={{ background: 'var(--primary)' }}
            />
            <span
              className="relative inline-flex size-2 rounded-full"
              style={{ background: 'var(--primary)' }}
            />
          </span>
          <span className="text-ink">trace</span>
          <span className="text-muted">/console</span>
        </div>

        {/* boot log */}
        <div className="space-y-1.5">
          {BOOT_LINES.slice(0, shown).map((l) => (
            <div key={l} className="flex items-center gap-2 text-muted">
              <span style={{ color: 'var(--primary)' }}>▸</span>
              {l}
            </div>
          ))}
        </div>

        {/* sweeping progress bar */}
        <div className="relative mt-6 h-0.5 w-full overflow-hidden rounded bg-base-300">
          <div
            className="absolute inset-y-0 w-1/3"
            style={{
              background: 'linear-gradient(90deg, transparent, var(--primary), transparent)',
              animation: 'sheen 1.1s ease-in-out infinite',
            }}
          />
        </div>
      </div>
    </div>
  );
}
