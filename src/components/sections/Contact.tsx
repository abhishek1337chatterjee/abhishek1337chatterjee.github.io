import { useState } from 'react';
import { useSiteSettings } from '../../hooks/useSanityData';
import SectionHeader from '../ui/SectionHeader';

const GETFORM = 'https://getform.io/f/8775dab5-b30d-48fc-9d52-4900b095464c';

const inputCls =
  'rounded-lg border border-line bg-base-100 px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/50 outline-none transition-colors focus:border-[color:var(--primary)]';
const labelCls = 'font-mono text-[11px] uppercase tracking-[0.08em] text-muted';

export default function Contact() {
  const { settings } = useSiteSettings();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [phoneCopied, setPhoneCopied] = useState(false);

  // contact details come from Sanity (siteSettings) — not hardcoded
  const email = settings?.email ?? '';
  const phone = settings?.phone ?? '';
  const phoneTel = phone.replace(/[^\d+]/g, '');

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setStatus(null);
    try {
      const res = await fetch(GETFORM, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus({ ok: true, msg: '202 accepted · alert delivered' });
        setForm({ name: '', email: '', message: '' });
      } else {
        setStatus({ ok: false, msg: '500 · delivery failed, retry' });
      }
    } catch {
      setStatus({ ok: false, msg: '500 · delivery failed, retry' });
    } finally {
      setSending(false);
      setTimeout(() => setStatus(null), 6000);
    }
  };

  const copyTo = async (text: string, flag: (v: boolean) => void) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      flag(true);
      setTimeout(() => flag(false), 1800);
    } catch {
      /* clipboard blocked — no-op */
    }
  };

  return (
    <section id="contact" className="content-defer px-5 py-16 sm:px-8 lg:px-16">
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeader num="07" label="open an alert" title="Send a span" />

        <div className="mt-6 grid items-start gap-5 md:grid-cols-2">
          {/* form */}
          <form
            onSubmit={submit}
            className="flex flex-col gap-3.5 rounded-2xl border border-line bg-base-200/40 p-5 sm:p-6"
          >
            <label className="flex flex-col gap-1.5">
              <span className={labelCls}>name</span>
              <input
                name="name"
                type="text"
                required
                autoComplete="name"
                placeholder="your name"
                value={form.name}
                onChange={onChange}
                className={inputCls}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={labelCls}>email</span>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@domain.com"
                value={form.email}
                onChange={onChange}
                className={inputCls}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={labelCls}>message</span>
              <textarea
                name="message"
                rows={4}
                required
                placeholder="payload…"
                value={form.message}
                onChange={onChange}
                className={`${inputCls} resize-y`}
              />
            </label>
            <button
              type="submit"
              disabled={sending}
              className="mt-1 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 font-mono text-sm font-semibold text-[#07140d] transition-transform hover:-translate-y-0.5 disabled:opacity-60"
              style={{ background: 'linear-gradient(180deg, var(--primary), var(--primary-deep))' }}
            >
              {sending ? 'sending…' : 'POST /contact'}
            </button>
            <div aria-live="polite" className="min-h-[18px] font-mono text-xs">
              {status && (
                <span style={{ color: status.ok ? 'var(--primary)' : '#ff6b6b' }}>
                  {status.ok ? '● ' : '× '}
                  {status.msg}
                </span>
              )}
            </div>
          </form>

          {/* contact manifest — details from Sanity */}
          <div className="flex flex-col gap-4">
            {email && (
              <div className="rounded-2xl border border-line bg-base-200/40 p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <span className={labelCls}>email</span>
                  <button
                    type="button"
                    onClick={() => copyTo(email, setCopied)}
                    className="font-mono text-[11px] transition-colors hover:text-ink"
                    style={{ color: copied ? 'var(--primary)' : '#8a91a0' }}
                  >
                    {copied ? 'copied ✓' : 'copy'}
                  </button>
                </div>
                <a
                  href={`mailto:${email}`}
                  className="mt-2 block break-all font-mono text-sm text-ink transition-colors hover:text-[color:var(--primary)]"
                >
                  {email}
                </a>
              </div>
            )}

            {phone && (
              <div className="rounded-2xl border border-line bg-base-200/40 p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <span className={labelCls}>phone</span>
                  <button
                    type="button"
                    onClick={() => copyTo(phone, setPhoneCopied)}
                    className="font-mono text-[11px] transition-colors hover:text-ink"
                    style={{ color: phoneCopied ? 'var(--primary)' : '#8a91a0' }}
                  >
                    {phoneCopied ? 'copied ✓' : 'copy'}
                  </button>
                </div>
                <a
                  href={`tel:${phoneTel}`}
                  className="mt-2 block font-mono text-sm text-ink transition-colors hover:text-[color:var(--primary)]"
                >
                  {phone}
                </a>
              </div>
            )}

            <div className="rounded-2xl border border-line bg-base-200/40 p-5 font-mono text-[13px] sm:p-6">
              <div className="space-y-2 text-muted">
                <div>
                  region <span className="text-ink">ap-south-1</span>
                </div>
                <div>
                  timezone <span className="text-ink">IST · UTC+5:30</span>
                </div>
                <div>
                  response <span style={{ color: 'var(--primary)' }}>friendly &amp; fast</span>
                </div>
              </div>
              <div className="my-4 h-px bg-line" />
              <p className="text-xs text-muted/80">
                Or ask the <span style={{ color: 'var(--primary)' }}>trace ›</span> console below —
                it queries my telemetry.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
