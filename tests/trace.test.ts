import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { buildTrace, matchStudies, traceSummary } from '../src/components/chat/trace.ts';

const T0 = 1_000_000;

describe('buildTrace', () => {
  it('chains status spans on one axis and closes the stream span at the last word', () => {
    const trace = buildTrace(
      {
        statusLines: [
          { code: 'context', elapsedMs: 400, receivedAtMs: T0 + 400 },
          { code: 'composing', elapsedMs: 1_100, receivedAtMs: T0 + 1_100 },
        ],
        streamStartMs: T0 + 1_100,
        streamLastMs: T0 + 4_200,
      },
      false,
      T0 + 99_000,
    );
    assert.deepEqual(
      trace.spans.map((s) => [s.label, s.kind, s.startMs, s.endMs]),
      [
        ['loaded portfolio context', 'done', 0, 400],
        ['composing answer', 'done', 400, 1_100],
        ['streaming answer', 'done', 1_100, 4_200],
      ],
    );
    assert.equal(trace.axisMs, 4_200);
    assert.equal(traceSummary(trace), '3 spans · 4.2s');
  });

  it('grows the stream span with the clock while live, on a wider axis', () => {
    const trace = buildTrace(
      {
        statusLines: [{ code: 'composing', elapsedMs: 1_000, receivedAtMs: T0 + 1_000 }],
        streamStartMs: T0 + 1_000,
        streamLastMs: T0 + 1_500,
      },
      true,
      T0 + 2_600,
    );
    const stream = trace.spans.at(-1);
    assert.equal(stream?.kind, 'live');
    assert.equal(stream?.endMs, 2_600);
    assert.equal(trace.axisMs, 4_000);
  });

  it('counts a queued span down, then settles it at the end of the wait', () => {
    const lines = [
      { code: 'fast_lane' as const, elapsedMs: 900, receivedAtMs: T0 + 900 },
      { code: 'queued' as const, elapsedMs: 1_000, waitSeconds: 12, receivedAtMs: T0 + 1_000 },
    ];
    const waiting = buildTrace({ statusLines: lines }, true, T0 + 4_500);
    const queued = waiting.spans[1];
    assert.equal(queued.label, 'high demand · starting in 9s');
    assert.equal(queued.counting, true);
    assert.equal(queued.endMs, 4_500);
    // the axis already reaches the promised start, so the bar grows toward a real point
    assert.equal(waiting.axisMs, 16_000);

    const settled = buildTrace(
      { statusLines: lines, streamStartMs: T0 + 13_400, streamLastMs: T0 + 15_000 },
      false,
      T0,
    );
    assert.equal(settled.spans[1].label, 'high demand · waited 12s');
    assert.equal(settled.spans[1].endMs, 13_000);
    assert.equal(settled.spans[2].startMs, 13_400);
  });

  it('puts text that started before a failure ahead of the failed span', () => {
    const trace = buildTrace(
      {
        statusLines: [
          { code: 'composing', elapsedMs: 500, receivedAtMs: T0 + 500 },
          { code: 'failed', elapsedMs: 3_000, receivedAtMs: T0 + 3_000 },
        ],
        streamStartMs: T0 + 600,
        streamLastMs: T0 + 2_000,
      },
      false,
      T0,
    );
    assert.deepEqual(
      trace.spans.map((s) => [s.kind, s.startMs, s.endMs]),
      [
        ['done', 0, 500],
        ['done', 600, 2_000],
        ['bad', 2_000, 3_000],
      ],
    );
  });
});

describe('matchStudies', () => {
  const studies = [
    { slug: 'account-deletion-saga', title: 'Cross-Account Account-Deletion Saga' },
    { slug: 'assessment-scoring', title: 'Assessment & Scoring Platform' },
    { slug: 'platform-engineering', title: 'Platform Engineering & DX' },
  ];

  it('matches a full title, ignoring case, markdown and "&" versus "and"', () => {
    const hits = matchStudies('He built the **assessment and scoring platform**.', studies);
    assert.deepEqual(
      hits.map((s) => s.slug),
      ['assessment-scoring'],
    );
  });

  it('matches the slug words as a phrase', () => {
    const hits = matchStudies('Tell me about the account-deletion saga', studies);
    assert.deepEqual(
      hits.map((s) => s.slug),
      ['account-deletion-saga'],
    );
  });

  it('returns nothing when the answer names no study', () => {
    assert.deepEqual(matchStudies('He knows TypeScript and a platform or two.', studies), []);
  });
});
