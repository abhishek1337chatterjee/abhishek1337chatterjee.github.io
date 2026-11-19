import { useEffect, useState } from 'react';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

// Reduced motion keeps the real clock but repaints it four times a second.
const CALM_STEP_MS = 250;

// Milliseconds since the send started, read from the real clock on every repaint.
export default function LiveMs({ startedAt }: { startedAt: number }) {
  const reduce = useReducedMotion();
  const [ms, setMs] = useState(0);

  useEffect(() => {
    const read = () => setMs(Math.round(performance.now() - startedAt));
    if (reduce) {
      const timer = setInterval(read, CALM_STEP_MS);
      return () => clearInterval(timer);
    }
    let frame = requestAnimationFrame(function tick() {
      read();
      frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [startedAt, reduce]);

  return <span className="tabular-nums">{ms} ms</span>;
}
