import { clockTime, gapToMe, zoneCity } from './clocks';
import LiveMs from './LiveMs';
import { MY_ZONE, ERROR_RED as RED, TEXT } from './policy';
import { hasFailed, type SendState } from './sendState';

// The getform.io node sits two thirds along the wire, as on the design board.
const HOP_AT = '66%';

const node =
  'absolute top-[26px] size-[11px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] bg-base-100';
const HOLLOW = '#8a91a0';

function HopStatus({ send, ready }: { send: SendState; ready: boolean }) {
  switch (send.phase) {
    case 'sending':
      return (
        <span className="text-[color:var(--secondary)]">
          <LiveMs startedAt={send.startedAt} />
        </span>
      );
    case 'accepted':
      return <span className="tabular-nums text-[color:var(--primary)]">{send.ms} ms</span>;
    case 'rejected':
      return (
        <span className="tabular-nums" style={{ color: RED }}>
          {send.status} after {send.ms} ms
        </span>
      );
    case 'timeout':
      return <span style={{ color: RED }}>{TEXT.noAnswerTimeout}</span>;
    case 'network':
      return <span style={{ color: RED }}>{TEXT.noAnswer}</span>;
    default:
      return ready ? (
        <span className="text-ink">{TEXT.ready}</span>
      ) : (
        <span>{TEXT.notSentYet}</span>
      );
  }
}

function firstHopWire(send: SendState): string {
  if (send.phase === 'sending') {
    return 'bg-[repeating-linear-gradient(90deg,var(--secondary)_0_10px,transparent_10px_18px)] animate-[wireMarch_0.5s_linear_infinite]';
  }
  if (send.phase === 'accepted') return 'bg-[color:var(--primary)]';
  return hasFailed(send) ? 'bg-[#ff6b6b]' : 'bg-[#3a4050]';
}

function firstNodeColor(send: SendState, ready: boolean): { border: string; fill?: string } {
  if (send.phase === 'sending') return { border: 'var(--secondary)', fill: 'var(--secondary)' };
  if (send.phase === 'accepted') return { border: 'var(--primary)', fill: 'var(--primary)' };
  if (hasFailed(send)) return { border: RED };
  return ready ? { border: 'var(--primary)', fill: 'var(--primary)' } : { border: HOLLOW };
}

interface RouteProps {
  send: SendState;
  /** Every field is filled in and valid. */
  ready: boolean;
  now: Date;
  zone: string;
}

// Two clocks joined by the wire a message travels: page to getform.io to my inbox.
export default function Route({ send, ready, now, zone }: RouteProps) {
  const gap = gapToMe(now, zone);
  const first = firstNodeColor(send, ready);
  const accepted = send.phase === 'accepted';

  return (
    // biome-ignore lint/a11y/useSemanticElements: a fieldset is for form controls, this groups two clocks
    <div
      role="group"
      aria-label="Your time, my time and the route a message takes"
      data-prerender="skip"
      className="relative mt-[18px] h-24 font-mono text-xs text-muted lg:mt-0 lg:h-[72px]"
    >
      <p className="absolute top-2.5 left-0 flex items-baseline gap-2 whitespace-nowrap">
        <time className="text-2xl leading-7 font-medium tracking-[-0.5px] tabular-nums text-ink">
          {clockTime(now, zone)}
        </time>
        <span className="hidden text-[13px] lg:inline">your time</span>
        <span className="sr-only lg:hidden">your time</span>
      </p>
      <p className="absolute top-2.5 right-0 flex items-baseline gap-2 whitespace-nowrap">
        <span className="hidden text-[13px] lg:inline">my time</span>
        <span className="sr-only lg:hidden">my time</span>
        <time className="text-2xl leading-7 font-medium tracking-[-0.5px] tabular-nums text-ink">
          {clockTime(now, MY_ZONE)}
        </time>
      </p>

      <p className="absolute inset-x-0 -top-[18px] text-center whitespace-nowrap lg:top-0 lg:right-auto lg:left-[190px] lg:text-left">
        <span className="text-[color:var(--secondary)]">POST</span>{' '}
        <span className="text-ink">/contact</span> · <HopStatus send={send} ready={ready} />
      </p>

      <div className="absolute inset-y-0 right-[82px] left-[82px] lg:right-[180px] lg:left-[180px]">
        <span
          className={`absolute top-[25px] left-0 h-0.5 ${firstHopWire(send)}`}
          style={{ width: HOP_AT }}
        />
        <span
          className="absolute top-[25px] right-0 h-0.5 bg-[repeating-linear-gradient(90deg,#3a4050_0_6px,transparent_6px_12px)]"
          style={{ left: HOP_AT }}
        />
        {/* A 200 means getform.io already stored it in my inbox, so the last hop completes too. */}
        <span
          className="absolute top-[25px] right-0 h-0.5 origin-left bg-[color:var(--primary)] transition-transform delay-150 duration-400 ease-out motion-reduce:transition-none"
          style={{ left: HOP_AT, transform: `scaleX(${accepted ? 1 : 0})` }}
        />
        <i
          className={node}
          style={{ left: 0, borderColor: first.border, background: first.fill }}
        />
        <i
          className={node}
          style={{
            left: HOP_AT,
            borderColor: accepted ? 'var(--primary)' : HOLLOW,
            background: accepted ? 'var(--primary)' : undefined,
          }}
        />
        <i
          className={`${node} transition-colors delay-500 duration-200 motion-reduce:transition-none`}
          style={{
            left: '100%',
            borderColor: accepted ? 'var(--primary)' : HOLLOW,
            background: accepted ? 'var(--primary)' : undefined,
          }}
        />
        {hasFailed(send) && (
          <span
            className="absolute top-[26px] left-[33%] flex -translate-x-1/2 -translate-y-1/2 bg-base-100 px-[3px]"
            style={{ color: RED }}
          >
            <svg
              viewBox="0 0 16 16"
              width="10"
              height="10"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </span>
        )}
        <span
          className="absolute top-[34px] -translate-x-1/2 whitespace-nowrap lg:top-0"
          style={{ left: HOP_AT }}
        >
          getform.io
        </span>
        <span className="absolute top-0 right-2.5 hidden whitespace-nowrap lg:block">
          <span className="hidden xl:inline">email alert to </span>my inbox
        </span>
      </div>

      <p className="absolute top-[50px] left-0 whitespace-nowrap">
        you · <span className="lg:hidden">{zoneCity(zone)}</span>
        <span className="hidden lg:inline">{zone}</span>
      </p>
      <p className="absolute top-[50px] right-0 whitespace-nowrap">
        me · India
        <span className="hidden lg:inline">
          {' '}
          (IST), {gap.amount && <span className="text-ink">{gap.amount} </span>}
          {gap.relation}
        </span>
      </p>
      <p className="absolute inset-x-0 top-[74px] text-center lg:hidden">
        {gap.amount ? (
          <>
            I'm <span className="text-ink">{gap.amount}</span> {gap.relation}
          </>
        ) : (
          gap.relation
        )}
      </p>
    </div>
  );
}
