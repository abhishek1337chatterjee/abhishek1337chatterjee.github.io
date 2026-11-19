import {
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useSiteSettings } from '../../hooks/useSanityData';
import Reveal from '../ui/Reveal';
import { clockTime, visitorZone } from './contact/clocks';
import Field, { controlCls, hintId } from './contact/Field';
import LiveMs from './contact/LiveMs';
import { EMAIL_NO_ENDING, EMAIL_PATTERN, MY_ZONE, ERROR_RED as RED, TEXT } from './contact/policy';
import Route from './contact/Route';
import SidePanel from './contact/SidePanel';
import { type ContactForm, mailtoHref, sendMessage } from './contact/sendMessage';
import { hasFailed, type SendState } from './contact/sendState';
import { useNow } from './contact/useNow';

type FieldName = keyof ContactForm;
const FIELD_ORDER: FieldName[] = ['name', 'email', 'message'];
const EMPTY: ContactForm = { name: '', email: '', message: '' };

const isValid = (field: FieldName, value: string) =>
  field === 'email' ? EMAIL_PATTERN.test(value.trim()) : value.trim() !== '';

const GAP_TEXT: Record<FieldName, string> = {
  name: TEXT.nameGap,
  email: TEXT.emailGap,
  message: TEXT.messageGap,
};

function emailHint(value: string): ReactNode {
  const typed = value.trim();
  // Finish the visitor's own address when only the ending is missing.
  const example = EMAIL_NO_ENDING.test(typed) ? `${typed}.com` : TEXT.emailExample;
  return (
    <>
      {TEXT.emailUnfinished} <b className="font-semibold">{example}</b>
    </>
  );
}

function hintFor(field: FieldName, value: string): ReactNode {
  if (isValid(field, value)) return null;
  if (field === 'email' && value.trim() !== '') return emailHint(value);
  return GAP_TEXT[field];
}

const primaryBtn =
  'inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-[9px] px-[18px] text-base font-semibold transition-[filter] lg:min-h-0 lg:py-3 lg:text-[14.5px]';

const isApple = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.userAgent);

export default function Contact() {
  const { settings } = useSiteSettings();
  const email = settings?.email ?? '';
  const phone = settings?.phone ?? '';

  const [form, setForm] = useState<ContactForm>(EMPTY);
  const [hints, setHints] = useState<Partial<Record<FieldName, ReactNode>>>({});
  const [send, setSend] = useState<SendState>({ phase: 'idle' });
  const [zone] = useState(visitorZone);
  const now = useNow();

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const controls = { name: nameRef, email: emailRef, message: messageRef };
  const cancelRef = useRef<AbortController | null>(null);

  // Leaving the page mid-send must not set state on an unmounted section.
  useEffect(() => () => cancelRef.current?.abort(), []);

  const sending = send.phase === 'sending';
  const failed = hasFailed(send);
  const ready = FIELD_ORDER.every((field) => isValid(field, form[field]));

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const field = e.target.name as FieldName;
    const value = e.target.value;
    setForm((old) => ({ ...old, [field]: value }));
    // A hint only ever disappears while typing; new ones wait for blur or Send.
    if (hints[field] && isValid(field, value)) setHints((old) => ({ ...old, [field]: null }));
    if (send.phase === 'accepted') setSend({ phase: 'idle' });
  };

  const checkEmailOnLeave = () => {
    if (form.email.trim() === '') return;
    setHints((old) => ({ ...old, email: hintFor('email', form.email) }));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (sending) return;

    const found = Object.fromEntries(FIELD_ORDER.map((f) => [f, hintFor(f, form[f])]));
    setHints(found);
    const firstGap = FIELD_ORDER.find((f) => found[f]);
    if (firstGap) {
      controls[firstGap].current?.focus();
      return;
    }

    const cancel = new AbortController();
    cancelRef.current = cancel;
    setSend({ phase: 'sending', startedAt: performance.now() });
    const result = await sendMessage(form, cancel.signal);
    if (result.kind === 'cancelled') return;

    if (result.kind === 'accepted') {
      setSend({
        phase: 'accepted',
        status: result.status,
        ms: result.ms,
        sentAt: new Date(),
        replyTo: form.email.trim(),
      });
      setForm(EMPTY);
    } else if (result.kind === 'rejected') {
      setSend({ phase: 'rejected', status: result.status, ms: result.ms });
    } else {
      setSend({ phase: result.kind });
    }
  };

  const sendOnCtrlEnter = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      e.currentTarget.requestSubmit();
    }
  };

  const fieldProps = (field: FieldName) => ({
    id: `contact-${field}`,
    name: field,
    required: true,
    readOnly: sending,
    value: form[field],
    onChange,
    'aria-invalid': hints[field] ? true : undefined,
    'aria-describedby': hints[field] ? hintId(`contact-${field}`) : undefined,
    className: controlCls(Boolean(hints[field]), sending),
  });

  const failureReason =
    send.phase === 'rejected'
      ? `${send.status} from getform.io`
      : send.phase === 'timeout'
        ? TEXT.noAnswerTimeout
        : TEXT.noAnswer;

  return (
    <section id="contact" className="content-defer px-5 py-16 sm:px-8 lg:px-16">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal>
          <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
            <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              {TEXT.title}
            </h2>
            <p className="font-mono text-sm text-muted">{TEXT.meta}</p>
          </div>
        </Reveal>

        <Reveal className="mt-5 grid gap-y-11 lg:mt-6 lg:grid-cols-[680fr_432fr] lg:gap-x-10 lg:gap-y-6">
          {/* The form leads in the DOM so phones get it first; desktop lifts the route above. */}
          <form
            aria-label="Contact form"
            noValidate
            onSubmit={submit}
            onKeyDown={sendOnCtrlEnter}
            className="min-w-0 border-t border-line pt-1 lg:row-start-2 lg:pt-0"
          >
            <Field
              id="contact-name"
              label="Name"
              valid={isValid('name', form.name)}
              hint={hints.name}
            >
              <input
                ref={nameRef}
                type="text"
                autoComplete="name"
                placeholder="Your name"
                {...fieldProps('name')}
              />
            </Field>
            <Field
              id="contact-email"
              label="Email"
              valid={isValid('email', form.email)}
              hint={hints.email}
            >
              <input
                ref={emailRef}
                type="email"
                inputMode="email"
                autoComplete="email"
                autoCapitalize="none"
                spellCheck={false}
                placeholder="you@company.com"
                onBlur={checkEmailOnLeave}
                {...fieldProps('email')}
              />
            </Field>
            <Field
              id="contact-message"
              label="Message"
              valid={isValid('message', form.message)}
              hint={hints.message}
            >
              <textarea
                ref={messageRef}
                rows={4}
                placeholder="What would you like to talk about?"
                {...fieldProps('message')}
                className={`${controlCls(Boolean(hints.message), sending)} h-[120px] resize-y lg:h-24`}
              />
            </Field>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-[18px] lg:py-3.5 lg:pl-28">
              {/* aria-disabled, not disabled: the button keeps focus through the send. */}
              <button
                type="submit"
                aria-disabled={sending || undefined}
                className={`${primaryBtn} flex-1 lg:flex-none ${
                  sending
                    ? 'cursor-default border border-line bg-base-300 text-muted'
                    : 'text-[#07140d] hover:brightness-110'
                }`}
                style={
                  sending
                    ? undefined
                    : { background: 'linear-gradient(180deg, var(--primary), var(--primary-deep))' }
                }
              >
                {sending ? (
                  <>
                    {TEXT.sending}
                    <span aria-hidden="true" className="font-mono text-[color:var(--secondary)]">
                      <LiveMs startedAt={send.startedAt} />
                    </span>
                  </>
                ) : failed ? (
                  <>
                    <Icon>
                      <path d="M13 8a5 5 0 1 1-1.6-3.7" />
                      <path d="M13 2.8v2.6h-2.6" />
                    </Icon>
                    {TEXT.retry}
                  </>
                ) : (
                  <>
                    {TEXT.send}
                    <Icon>
                      <path d="M3 8h10M9 4l4 4-4 4" />
                    </Icon>
                  </>
                )}
              </button>
              {failed && email && (
                <a
                  href={mailtoHref(email, form)}
                  className={`${primaryBtn} flex-1 border border-[color:var(--primary-deep)] text-[color:var(--primary)] transition-colors hover:border-[#34e5ff] hover:text-[#34e5ff] lg:flex-none`}
                >
                  <Icon>
                    <rect x="2" y="3.5" width="12" height="9" rx="1.5" />
                    <path d="M2.6 4.6L8 9l5.4-4.4" />
                  </Icon>
                  {TEXT.mailInstead}
                </a>
              )}
              {!failed && !sending && (
                <span className="hidden font-mono text-xs text-muted lg:inline">
                  <Key>{isApple ? '⌘' : 'Ctrl'}</Key> + <Key>Enter</Key> also sends
                </span>
              )}
            </div>

            {/* Always mounted so screen readers announce every change of send status. */}
            <div
              role="status"
              className="font-mono text-[12.5px] leading-[1.6] text-muted lg:pl-28"
            >
              {sending && <span className="sr-only">Sending your message</span>}
              {send.phase === 'accepted' && (
                <div className="pt-3.5 lg:pt-0">
                  <p className="text-[color:var(--primary)]">
                    ● {send.status} {TEXT.accepted}
                  </p>
                  <p>
                    sent {clockTime(send.sentAt, zone)} your time ·{' '}
                    {clockTime(send.sentAt, MY_ZONE)} mine
                  </p>
                  <p>
                    I'll reply to <span className="break-all text-ink">{send.replyTo}</span>
                  </p>
                  <p className="mt-1 text-[11px]">{TEXT.savedInInbox}</p>
                </div>
              )}
              {failed && (
                <p className="flex items-start gap-1.5 pt-3.5 lg:pt-0" style={{ color: RED }}>
                  <span className="mt-[3px] flex-none">
                    <Icon size={12}>
                      <path d="M4 4l8 8M12 4l-8 8" />
                    </Icon>
                  </span>
                  <span>
                    {failureReason} · {TEXT.notDelivered}
                  </span>
                </p>
              )}
            </div>
          </form>

          <div className="min-w-0 lg:col-span-2 lg:row-start-1">
            <Route send={send} ready={ready} now={now} zone={zone} />
          </div>

          <div className="min-w-0 lg:row-start-2">
            <SidePanel email={email} phone={phone} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Icon({ children, size = 15 }: { children: ReactNode; size?: number }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="flex-none"
    >
      {children}
    </svg>
  );
}

function Key({ children }: { children: ReactNode }) {
  return <kbd className="rounded border border-line px-[5px] py-px text-ink">{children}</kbd>;
}
