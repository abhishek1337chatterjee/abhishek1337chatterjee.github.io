import type { ChatEvent, StatusCode } from '../types/chat';

const STATUS_CODES: readonly StatusCode[] = [
  'context',
  'composing',
  'fast_lane',
  'queued',
  'failed',
];

/**
 * Turns streamed NDJSON text into chat events. Network chunks can split or join lines,
 * so it buffers until a newline; unknown or broken lines are skipped, never thrown.
 */
export function createNdjsonParser(onEvent: (event: ChatEvent) => void): {
  push(chunk: string): void;
  flush(): void;
} {
  let buffer = '';

  const handleLine = (line: string) => {
    const trimmed = line.trim();
    if (!trimmed) {
      return;
    }
    let value: unknown;
    try {
      value = JSON.parse(trimmed);
    } catch {
      return;
    }
    if (isChatEvent(value)) {
      onEvent(value);
    }
  };

  return {
    push(chunk) {
      buffer += chunk;
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';
      for (const line of lines) {
        handleLine(line);
      }
    },
    flush() {
      handleLine(buffer);
      buffer = '';
    },
  };
}

function isChatEvent(value: unknown): value is ChatEvent {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const event = value as Record<string, unknown>;
  if (event.type === 'text') {
    return typeof event.delta === 'string';
  }
  return (
    event.type === 'status' &&
    STATUS_CODES.includes(event.code as StatusCode) &&
    typeof event.elapsedMs === 'number'
  );
}
