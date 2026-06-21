import type { ReactNode } from 'react';

interface TagProps {
  children: ReactNode;
  color?: string;
}

// Mono pill, tinted to the scheme primary by default (or an explicit color).
export default function Tag({ children, color }: TagProps) {
  const c = color ?? 'var(--primary)';
  return (
    <span
      className="inline-flex items-center rounded-md border px-2.5 py-1 font-mono text-xs"
      style={{
        color: c,
        borderColor: `color-mix(in srgb, ${c} 30%, transparent)`,
        background: `color-mix(in srgb, ${c} 8%, transparent)`,
      }}
    >
      {children}
    </span>
  );
}
