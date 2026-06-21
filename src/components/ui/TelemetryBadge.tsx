import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

type Status = 'HEALTHY' | 'OFFLINE' | 'STANDBY';

interface TelemetryBadgeProps {
  status?: Status;
  lastSeen?: string;
  /** stretch the graph to fill the row (aligns its right edge with the line below) */
  wide?: boolean;
}

const ACCENT: Record<Status, string> = {
  HEALTHY: 'var(--primary)',
  STANDBY: 'var(--secondary)',
  OFFLINE: '#8a91a0',
};

const CYCLE_MS = 6000;
const DRAW_END = 0.62; // line fully drawn by 62% of the cycle
const HOLD_END = 0.82; // holds until 82%, then fades out
const FLAT = 'M0,7 L80,7';

interface Pt {
  x: number;
  y: number;
  cum: number;
}

// Random jagged polyline (points + cumulative length) across the 0–80 viewBox.
function genGraph() {
  const n = 9;
  const W = 80;
  const pts: Pt[] = [];
  let len = 0;
  for (let i = 0; i < n; i++) {
    const x = (i / (n - 1)) * W;
    const y = 2 + Math.random() * 10;
    if (i > 0) len += Math.hypot(x - pts[i - 1].x, y - pts[i - 1].y);
    pts.push({ x, y, cum: len });
  }
  return { pts, len };
}

// The polyline drawn up to length-fraction r, plus its leading point (the dot).
function partialPath(pts: Pt[], len: number, r: number) {
  const target = r * len;
  let d = `M${pts[0].x.toFixed(2)},${pts[0].y.toFixed(2)}`;
  let lead = pts[0];
  for (let i = 1; i < pts.length; i++) {
    if (pts[i].cum <= target) {
      d += ` L${pts[i].x.toFixed(2)},${pts[i].y.toFixed(2)}`;
      lead = pts[i];
    } else {
      const prev = pts[i - 1];
      const seg = pts[i].cum - prev.cum;
      const f = seg > 0 ? (target - prev.cum) / seg : 0;
      const x = prev.x + (pts[i].x - prev.x) * f;
      const y = prev.y + (pts[i].y - prev.y) * f;
      d += ` L${x.toFixed(2)},${y.toFixed(2)}`;
      lead = { x, y, cum: target };
      break;
    }
  }
  return { d, lead };
}

// Live telemetry graph (single rAF clock): the line is built point-by-point up to
// the dot's leading edge, holds, fades out, then redraws fresh random points.
function LiveGraph({ accent, live, grow }: { accent: string; live: boolean; grow: boolean }) {
  const pathRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const groupRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    const dot = dotRef.current;
    const group = groupRef.current;
    if (!path || !dot || !group) return;

    if (!live) {
      path.setAttribute('d', FLAT);
      group.style.opacity = '1';
      dot.style.display = 'none';
      return;
    }

    dot.style.display = '';
    let raf = 0;
    let cur = genGraph();
    let t0 = performance.now();

    const draw = (r: number) => {
      const { d, lead } = partialPath(cur.pts, cur.len, r);
      path.setAttribute('d', d);
      dot.setAttribute('cx', String(lead.x));
      dot.setAttribute('cy', String(lead.y));
    };

    const frame = (now: number) => {
      let e = (now - t0) / CYCLE_MS;
      if (e >= 1) {
        cur = genGraph();
        t0 = now;
        e = 0;
      }
      if (e <= DRAW_END) {
        draw(e / DRAW_END);
        group.style.opacity = '1';
      } else if (e <= HOLD_END) {
        draw(1);
        group.style.opacity = '1';
      } else {
        group.style.opacity = String(1 - (e - HOLD_END) / (1 - HOLD_END));
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [live]);

  const glow = `drop-shadow(0 0 2px color-mix(in srgb, ${accent} 55%, transparent))`;

  return (
    <svg
      viewBox="0 0 80 14"
      preserveAspectRatio="none"
      className={grow ? 'h-3.5 min-w-[48px] flex-1' : 'h-3.5 w-[44px] flex-none'}
      aria-hidden="true"
    >
      <g ref={groupRef}>
        <path
          ref={pathRef}
          d={FLAT}
          fill="none"
          stroke={accent}
          strokeWidth="1.4"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={{ filter: glow }}
        />
        <circle
          ref={dotRef}
          cx="0"
          cy="7"
          r="1.7"
          fill={accent}
          style={{ filter: `drop-shadow(0 0 3px ${accent})` }}
        />
      </g>
    </svg>
  );
}

// Status row. HEALTHY (hero) shows a live telemetry graph; OFFLINE/STANDBY flatline.
export default function TelemetryBadge({
  status = 'HEALTHY',
  lastSeen,
  wide = false,
}: TelemetryBadgeProps) {
  const reduced = useReducedMotion();
  const accent = ACCENT[status];
  const live = status === 'HEALTHY' && !reduced;

  return (
    <span
      className={`items-center gap-2 font-mono text-xs tracking-wide ${wide ? 'flex w-full' : 'inline-flex'}`}
      style={{ color: accent }}
    >
      <span className="flex-none">{status}</span>
      <LiveGraph accent={accent} live={live} grow={wide} />
      {lastSeen && status !== 'HEALTHY' && (
        <span className="flex-none text-muted">· last seen {lastSeen}</span>
      )}
    </span>
  );
}
