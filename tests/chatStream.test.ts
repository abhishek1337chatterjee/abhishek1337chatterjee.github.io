import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { statusText } from '../src/components/chat/statusMessages.ts';
import { createNdjsonParser } from '../src/lib/chatStream.ts';
import type { ChatEvent } from '../src/types/chat.ts';

function collect() {
  const events: ChatEvent[] = [];
  const parser = createNdjsonParser((event) => events.push(event));
  return { events, parser };
}

describe('createNdjsonParser', () => {
  it('parses a line split across two chunks', () => {
    const { events, parser } = collect();
    parser.push('{"type":"text","del');
    parser.push('ta":"hi"}\n');
    assert.deepEqual(events, [{ type: 'text', delta: 'hi' }]);
  });

  it('parses several lines in one chunk', () => {
    const { events, parser } = collect();
    parser.push(
      '{"type":"status","code":"context","elapsedMs":300}\n{"type":"text","delta":"a"}\n{"type":"text","delta":"b"}\n',
    );
    assert.deepEqual(events, [
      { type: 'status', code: 'context', elapsedMs: 300 },
      { type: 'text', delta: 'a' },
      { type: 'text', delta: 'b' },
    ]);
  });

  it('flush emits a final line without newline', () => {
    const { events, parser } = collect();
    parser.push('{"type":"text","delta":"end"}');
    assert.deepEqual(events, []);
    parser.flush();
    assert.deepEqual(events, [{ type: 'text', delta: 'end' }]);
  });

  it('ignores unknown codes and broken lines', () => {
    const { events, parser } = collect();
    parser.push(
      '{"type":"status","code":"teleport","elapsedMs":1}\nnot json\n\n{"type":"mystery"}\n',
    );
    parser.push('{"type":"status","code":"failed","elapsedMs":20}\n');
    assert.deepEqual(events, [{ type: 'status', code: 'failed', elapsedMs: 20 }]);
  });
});

describe('statusText', () => {
  it('queued counts down then reads waited', () => {
    const line = { code: 'queued', elapsedMs: 900, waitSeconds: 12 } as const;
    assert.equal(statusText(line, false, 7), 'high demand · starting in 7s');
    assert.equal(statusText(line, true, 0), 'high demand · waited 12s');
  });

  it('other codes use the fixed wording', () => {
    assert.equal(
      statusText({ code: 'context', elapsedMs: 0 }, false, 0),
      'loaded portfolio context',
    );
    assert.equal(
      statusText({ code: 'fast_lane', elapsedMs: 0 }, true, 0),
      'high demand · switched to fast lane',
    );
    assert.equal(
      statusText({ code: 'failed', elapsedMs: 0 }, true, 0),
      'could not get an answer right now',
    );
  });
});
