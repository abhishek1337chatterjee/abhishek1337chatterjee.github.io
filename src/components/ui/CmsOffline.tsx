import { useSyncExternalStore } from 'react';
import { cmsStatus } from '../../lib/cmsStatus';
import { TAP_44 } from './tapArea';

// Shown only when a CMS request failed: says why sections are empty and offers a retry,
// instead of a page that silently stops halfway.
export default function CmsOffline() {
  const failed = useSyncExternalStore(cmsStatus.subscribe, cmsStatus.failed);
  if (!failed) return null;

  return (
    <div
      role="alert"
      className="fixed top-[4.25rem] left-1/2 z-30 flex w-max max-w-[calc(100%-2rem)] -translate-x-1/2 flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-2xl border border-[#ff6b6b]/60 bg-[#1a0d0d] px-4 py-2 font-mono text-xs text-ink shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
    >
      <span className="flex items-center gap-2">
        <span aria-hidden className="size-2 rounded-full bg-[#ff6b6b]" />
        content didn't load · the CMS didn't answer
      </span>
      <button
        type="button"
        onClick={cmsStatus.retry}
        className={`relative rounded-md border border-[color:var(--primary)]/50 px-2.5 py-1 text-[color:var(--primary)] transition-colors hover:bg-[color:var(--primary)]/10 ${TAP_44}`}
      >
        retry
      </button>
    </div>
  );
}
