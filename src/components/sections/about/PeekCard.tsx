import { HOVER_HEX, type Peek } from './claims';

// Card height is fixed and reserved in the rail even when closed, so opening it
// only moves rows inside the rail, never the page below.
export const PEEK_H = '6.25rem';
const MAX_NODES = 3;

// The hovered claim's proof as a miniature: its nodes hang off a trace bus, the one
// the claim points at lit in the hover colour.
export default function PeekCard({ peek, target }: { peek: Peek; target: string }) {
  // keep the claimed node visible even when the list is longer than the card
  const ordered =
    peek.hot && peek.nodes.indexOf(peek.hot) >= MAX_NODES
      ? [peek.hot, ...peek.nodes.filter((n) => n !== peek.hot)]
      : peek.nodes;
  const shown = ordered.slice(0, MAX_NODES);
  const more = ordered.length - shown.length;

  return (
    <div
      aria-hidden
      className="overflow-hidden rounded-b-lg border border-t-0 px-3 pt-2 pb-2.5 font-mono"
      style={{
        height: PEEK_H,
        borderColor: `${HOVER_HEX}99`,
        background: `color-mix(in srgb, ${HOVER_HEX} 4%, #0b0c10)`,
      }}
    >
      <p className="flex justify-between text-[11px] text-muted">
        <span>peek · {peek.label}</span>
        <span>#{target}</span>
      </p>

      <div className="mt-2.5">
        <div className="flex min-w-0 gap-1.5 overflow-hidden">
          {shown.map((n) => {
            const hot = n === peek.hot;
            return (
              <span key={n} className="flex flex-none flex-col items-center">
                <span
                  className="max-w-[5.5rem] truncate rounded border px-1.5 py-0.5 text-[11px]"
                  style={
                    hot
                      ? { borderColor: HOVER_HEX, color: HOVER_HEX }
                      : { borderColor: '#262a33', color: '#b9bec9' }
                  }
                >
                  {n}
                </span>
                <span className="h-2 w-px" style={{ background: hot ? HOVER_HEX : '#2faf78' }} />
              </span>
            );
          })}
          {more > 0 && (
            <span className="flex-none self-start pt-0.5 text-[11px] text-muted">+{more}</span>
          )}
        </div>
        <div className="h-px bg-[color:var(--primary-deep)]" />
      </div>

      {peek.note && <p className="mt-2 line-clamp-1 text-[11px] text-ink/75">{peek.note}</p>}
    </div>
  );
}
