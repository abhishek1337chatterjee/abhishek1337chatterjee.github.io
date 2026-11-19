import { useState } from 'react';
import { useSlashShortcut } from '../../../lib/slashShortcut';
import { COPY_FEEDBACK_MS } from './policy';

const row = 'border-t border-line py-3.5';
const rowLabel =
  'flex items-center justify-between text-[11px] tracking-[0.8px] text-muted uppercase';
// The pseudo-element stretches the tap area to 44 px without moving the text.
const valueLink =
  'relative mt-1.5 inline-block text-[15px] break-all text-ink transition-colors after:absolute after:inset-x-0 after:top-0 after:-bottom-[21px] hover:text-[#34e5ff]';

function CopyButton({ text, what }: { text: string; what: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), COPY_FEEDBACK_MS);
    } catch {
      // Clipboard blocked: the value stays on screen to select by hand.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy ${what}`}
      className={`relative z-10 -my-3.5 inline-flex min-h-11 items-center gap-1.5 pl-4 tracking-[0.8px] uppercase transition-colors ${
        copied ? 'text-[color:var(--primary)]' : 'text-muted hover:text-[#34e5ff]'
      }`}
    >
      <svg
        viewBox="0 0 16 16"
        width="12"
        height="12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
        <path d="M10.5 5.5v-2a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2" />
      </svg>
      <span aria-live="polite">{copied ? 'copied ✓' : 'copy'}</span>
    </button>
  );
}

// The chat's own open event, so this still works when the "/" shortcut is switched off.
const openChat = () => window.dispatchEvent(new CustomEvent('tm-ask-chat', { detail: {} }));

// Direct ways to reach me. Email and phone come from Sanity site settings.
export default function SidePanel({ email, phone }: { email: string; phone: string }) {
  const slashKey = useSlashShortcut();
  const phoneDigits = phone.replace(/[^\d+]/g, '');

  return (
    <aside aria-label="Other ways to reach me" className="font-mono">
      {email && (
        <div className={row}>
          <div className={rowLabel}>
            <span>email</span>
            <CopyButton text={email} what="email address" />
          </div>
          <a href={`mailto:${email}`} className={valueLink}>
            {email}
          </a>
        </div>
      )}
      {phone && (
        <div className={row}>
          <div className={rowLabel}>
            <span>phone</span>
            <CopyButton text={phone} what="phone number" />
          </div>
          <a href={`tel:${phoneDigits}`} className={valueLink}>
            {phone}
          </a>
        </div>
      )}
      <div className={row}>
        <div className={rowLabel}>
          <span>response</span>
        </div>
        <p className="mt-1.5 text-[15px] text-[color:var(--primary)]">friendly &amp; fast</p>
      </div>
      <div className="border-y border-line">
        <button
          type="button"
          onClick={openChat}
          className="group min-h-11 w-full py-3.5 text-left text-[13px] leading-[1.55] text-muted transition-colors hover:text-[#34e5ff]"
        >
          or{' '}
          {slashKey && (
            <span className="hidden lg:inline">
              press{' '}
              <kbd className="rounded border border-line px-[5px] py-px font-mono text-xs text-ink">
                /
              </kbd>{' '}
              to{' '}
            </span>
          )}
          ask the{' '}
          <span className="text-[color:var(--primary)] transition-colors group-hover:text-[#34e5ff]">
            trace ❯
          </span>{' '}
          console; it answers from my content
        </button>
      </div>
    </aside>
  );
}
