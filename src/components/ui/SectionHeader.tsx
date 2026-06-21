// Numbered section header — "NN ──── LABEL" kicker + display title.
// Shared across every section so the 01–07 trace sequence stays consistent.
// The <h2> carries no bottom margin: each caller owns the spacing of whatever
// follows (a subtitle, a badge row, a grid).
export default function SectionHeader({
  num,
  label,
  title,
}: {
  num: string;
  label: string;
  title: string;
}) {
  return (
    <>
      <div className="mb-4 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.14em] text-muted">
        <span style={{ color: 'var(--primary)' }}>{num}</span>
        <span className="h-px w-6 bg-line" />
        <span>{label}</span>
      </div>
      <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        {title}
      </h2>
    </>
  );
}
