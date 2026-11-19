import type { ReactNode } from 'react';

export const controlCls = (bad: boolean, locked: boolean) =>
  `block w-full min-h-12 rounded-lg border py-3 pr-10 pl-3.5 text-base leading-[1.45] outline-none transition-colors placeholder:text-muted focus:border-[color:var(--primary)] lg:min-h-11 lg:py-2.5 lg:pr-[38px] lg:pl-[13px] lg:text-[15px] ${
    bad ? 'border-[color:var(--secondary)]' : 'border-line'
  } ${locked ? 'bg-[#101216] text-muted' : 'bg-base-200 text-ink'}`;

export const hintId = (id: string) => `${id}-hint`;

interface FieldProps {
  id: string;
  label: string;
  valid: boolean;
  hint: ReactNode;
  children: ReactNode;
}

// One labelled form row: label beside the control on desktop, above it on phones.
export default function Field({ id, label, valid, hint, children }: FieldProps) {
  return (
    <div className="pt-3.5 lg:grid lg:grid-cols-[112px_1fr] lg:items-start lg:pt-3">
      <label
        htmlFor={id}
        className="mb-[7px] block text-sm font-medium text-ink lg:mb-0 lg:pt-[11px]"
      >
        {label}
      </label>
      <div className="min-w-0">
        <div className="relative">
          {children}
          {valid && (
            <svg
              viewBox="0 0 16 16"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="pointer-events-none absolute top-[17px] right-3 text-[color:var(--primary)] lg:top-[15px]"
            >
              <path d="M3 8.5l3.2 3.2L13 4.8" />
            </svg>
          )}
        </div>
        {hint && (
          <p
            id={hintId(id)}
            className="mt-1.5 flex items-start gap-[7px] text-[13px] leading-[1.4] text-[color:var(--secondary)]"
          >
            <svg
              viewBox="0 0 16 16"
              width="13"
              height="13"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="mt-0.5 flex-none"
            >
              <path d="M8 2.5l6 10.5H2z" />
              <path d="M8 6.8v2.8M8 11.4v.2" />
            </svg>
            <span>{hint}</span>
          </p>
        )}
      </div>
    </div>
  );
}
