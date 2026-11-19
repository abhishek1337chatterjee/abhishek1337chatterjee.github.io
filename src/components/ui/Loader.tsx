import { useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

// Boot screen: a short telemetry init, then the app. Over a prerendered page it is a corner strip,
// because a full-screen cover hid the finished page for ~2 s; reduced motion skips it.
const BOOT_LINES = [
  'booting trace console',
  'region ap-south-1 · serverless tier',
  'loading service manifest',
  'attaching telemetry probes',
  'status: operational',
];

export default function Loader({
  onDone,
  snapshot = false,
}: {
  onDone: () => void;
  snapshot?: boolean;
}) {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(0);
  const [hide, setHide] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (reduce) {
      onDone();
      return;
    }
    // a painted page starts right away; the strip only narrates the boot beside it
    if (snapshot) onDone();
    const timers: number[] = [];
    BOOT_LINES.forEach((_, k) => {
      timers.push(window.setTimeout(() => setShown(k + 1), 240 * k));
    });
    const total = 240 * BOOT_LINES.length + 420;
    timers.push(window.setTimeout(() => setHide(true), total));
    timers.push(
      window.setTimeout(() => {
        setGone(true);
        if (!snapshot) onDone();
      }, total + 520),
    );
    return () => {
      for (const t of timers) window.clearTimeout(t);
    };
  }, [reduce, onDone, snapshot]);

  if (reduce || (snapshot && gone)) return null;
  if (snapshot) return <BootStrip shown={shown} hide={hide} />;

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

// Corner version for a prerendered page: same boot lines, one at a time, no cover.
function BootStrip({ shown, hide }: { shown: number; hide: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed top-[4.25rem] right-4 z-[60] w-[min(17rem,calc(100%-2rem))] rounded-lg border border-line bg-[rgba(19,21,26,0.94)] px-3 py-2 font-mono text-[11px] shadow-[0_10px_26px_rgba(0,0,0,0.5)] transition-opacity duration-500 ${
        hide ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="size-1.5 rounded-full" style={{ background: 'var(--primary)' }} />
        <span className="text-ink">trace</span>
        <span className="text-muted">/console</span>
        <span className="ml-auto tabular-nums text-muted">
          {shown}/{BOOT_LINES.length}
        </span>
      </div>
      <div className="mt-1 truncate text-muted">
        <span style={{ color: 'var(--primary)' }}>▸</span> {BOOT_LINES[Math.max(0, shown - 1)]}
      </div>
      <div className="relative mt-2 h-0.5 w-full overflow-hidden rounded bg-base-300">
        <div
          className="absolute inset-y-0 w-1/3"
          style={{
            background: 'linear-gradient(90deg, transparent, var(--primary), transparent)',
            animation: 'sheen 1.1s ease-in-out infinite',
          }}
        />
      </div>
    </div>
  );
}
