import { GETFORM_URL, SEND_TIMEOUT_MS } from './policy';

export interface ContactForm {
  name: string;
  email: string;
  message: string;
}

// Only what the page observed: a status code exists only when getform.io answered.
export type SendResult =
  | { kind: 'accepted'; status: number; ms: number }
  | { kind: 'rejected'; status: number; ms: number }
  | { kind: 'timeout' }
  | { kind: 'network' }
  | { kind: 'cancelled' };

export async function sendMessage(form: ContactForm, cancel: AbortSignal): Promise<SendResult> {
  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, SEND_TIMEOUT_MS);
  const onCancel = () => controller.abort();
  cancel.addEventListener('abort', onCancel);

  const startedAt = performance.now();
  try {
    const res = await fetch(GETFORM_URL, {
      method: 'POST',
      // Accept asks getform.io for its JSON answer instead of a redirect page.
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(form),
      signal: controller.signal,
    });
    const ms = Math.round(performance.now() - startedAt);
    return { kind: res.ok ? 'accepted' : 'rejected', status: res.status, ms };
  } catch {
    if (timedOut) return { kind: 'timeout' };
    return cancel.aborted ? { kind: 'cancelled' } : { kind: 'network' };
  } finally {
    clearTimeout(timer);
    cancel.removeEventListener('abort', onCancel);
  }
}

export function mailtoHref(to: string, form: ContactForm): string {
  const name = form.name.trim();
  const subject = name ? `Message from ${name} via your portfolio` : 'Message via your portfolio';
  const signature = [name, form.email.trim()].filter(Boolean).join(' · ');
  const body = signature ? `${form.message.trim()}\n\n${signature}` : form.message.trim();
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
