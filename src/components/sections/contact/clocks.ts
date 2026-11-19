import { MY_ZONE, MY_ZONE_ALIASES, TEXT } from './policy';

export function visitorZone(): string {
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  return MY_ZONE_ALIASES.includes(zone) ? MY_ZONE : zone;
}

export function clockTime(at: Date, zone: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: zone,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(at);
}

// Minutes the zone's wall clock is ahead of UTC at that instant (DST included).
export function offsetMinutes(at: Date, zone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: zone,
    hourCycle: 'h23',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).formatToParts(at);
  const part = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  const wallClock = Date.UTC(
    part('year'),
    part('month') - 1,
    part('day'),
    part('hour'),
    part('minute'),
  );
  const instant = Math.floor(at.getTime() / 60_000) * 60_000;
  return Math.round((wallClock - instant) / 60_000);
}

function duration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest}m`;
  return rest === 0 ? `${hours}h` : `${hours}h ${rest}m`;
}

export interface Gap {
  /** Empty when both clocks read the same. */
  amount: string;
  /** Text after the amount, or the whole sentence when there is no amount. */
  relation: string;
}

// How far my clock is from the visitor's, in the visitor's terms.
export function gapToMe(at: Date, zone: string): Gap {
  const minutes = offsetMinutes(at, MY_ZONE) - offsetMinutes(at, zone);
  if (minutes === 0) {
    return { amount: '', relation: zone === MY_ZONE ? TEXT.sameZone : TEXT.sameClock };
  }
  return {
    amount: duration(Math.abs(minutes)),
    relation: minutes > 0 ? 'ahead of you' : 'behind you',
  };
}

// "America/Argentina/Buenos_Aires" reads as "Buenos Aires" where space is tight.
export function zoneCity(zone: string): string {
  return (zone.split('/').pop() ?? zone).replaceAll('_', ' ');
}
