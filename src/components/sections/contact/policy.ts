// Tunables and visitor wording for the contact section. Data only.

export const GETFORM_URL = 'https://getform.io/f/8775dab5-b30d-48fc-9d52-4900b095464c';

// After this long without an answer the send counts as lost.
export const SEND_TIMEOUT_MS = 10_000;

export const MY_ZONE = 'Asia/Kolkata';
// Older browsers still report the pre-rename zone id for India.
export const MY_ZONE_ALIASES = ['Asia/Kolkata', 'Asia/Calcutta'];

// Loose on purpose: only catches an email that cannot receive a reply.
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// "name@site" with no ending: enough to suggest the visitor's own address.
export const EMAIL_NO_ENDING = /^[^\s@]+@[^\s@.]+$/;

export const COPY_FEEDBACK_MS = 1800;

// Red is reserved for a send that did not arrive.
export const ERROR_RED = '#ff6b6b';

export const TEXT = {
  title: 'Send a span',
  meta: 'write to me · it lands in my inbox',
  nameGap: 'Add your name so I know who is writing.',
  emailGap: 'Add your email so I can reply.',
  emailUnfinished: 'This email looks unfinished. Add the ending, like',
  emailExample: 'name@site.dev',
  messageGap: 'Add a few words so I know what this is about.',
  send: 'Send message',
  sending: 'Sending…',
  retry: 'Try again',
  mailInstead: 'Email it instead',
  notSentYet: 'not sent yet',
  ready: 'ready to send',
  // A 200 means getform.io stored it in my submissions inbox; the email alert is extra.
  accepted: "· received · it's in my inbox",
  savedInInbox: 'saved in my getform.io inbox; an email alert follows',
  notDelivered: 'not delivered · message kept',
  noAnswer: 'no answer',
  noAnswerTimeout: `no answer after ${SEND_TIMEOUT_MS / 1000} s`,
  sameZone: 'same timezone as you',
  sameClock: 'same clock time as you',
} as const;
