import { describe, expect, it } from 'vitest';
import {
  ADRENALINE_BY_MS,
  ADRENALINE_FROM_MS,
  CYCLE_MS,
  LABEL,
  adrenaline,
  clock,
  cycleRemaining,
  eventFor,
  logText,
  view,
  type CodeEvent,
  type EventType,
  type Rhythm,
} from '../../src/lib/codeBlue.ts';
import { manual } from '../../src/lib/manual.ts';
import { listAfter, listIn, quote } from '../../src/lib/quote.ts';

const T0 = Date.UTC(2026, 10, 2, 3, 0, 0);
const min = (m: number) => T0 + m * 60_000;

function play(steps: [number, EventType, Rhythm?][]): CodeEvent[] {
  const events: CodeEvent[] = [];
  for (const [m, type, rhythm] of steps) {
    const e = eventFor(type, view(events), min(m), rhythm);
    if (e) events.push(e);
  }
  return events;
}

describe('code blue: doses and timings are the manual\'s (9.4, 9.6)', () => {
  it.each([
    ['hp9-6', 'Shock (biphasic 120–200 J, or maximum if unknown)'],
    ['hp9-6', 'Inj. Adrenaline 1 mg IV/IO, then every 3–5 minutes'],
    ['hp9-6', 'Inj. Amiodarone 300 mg IV/IO bolus'],
    ['hp9-6', 'Inj. Lignocaine 1–1.5 mg/kg'],
    ['hp9-6', 'Rhythm check every 2 minutes'],
    ['hp9-4', 'Rate: 100–120 compressions per minute'],
    ['hp9-4', 'Compression-to-ventilation ratio 30:2'],
    ['hp9-4', 'With an advanced airway: continuous compressions with 1 breath every 6 seconds'],
  ])('%s says "%s"', (chapter, match) => {
    expect(() => quote(manual, { chapter, match })).not.toThrow();
  });

  it('the shock energy and the antiarrhythmic second doses are as written', () => {
    const shockable = listIn(manual, 'hp9-6', 'Shockable rhythm').map((i) => i.text);
    expect(shockable).toContain('Shock (biphasic 120–200 J, or maximum if unknown)');
    expect(shockable.find((t) => t.includes('Amiodarone'))).toContain('(second dose 150 mg)');
    expect(shockable.find((t) => t.includes('Lignocaine'))).toContain('(second dose 0.5–0.75 mg/kg)');
  });

  it('uses 2-minute cycles and a 3–5 minute adrenaline window', () => {
    expect(CYCLE_MS).toBe(120_000);
    expect([ADRENALINE_FROM_MS, ADRENALINE_BY_MS]).toEqual([180_000, 300_000]);
  });

  it('lists 6 H’s and 5 T’s', () => {
    expect(listAfter(manual, 'hp9-6', 'H')).toHaveLength(6);
    expect(listAfter(manual, 'hp9-6', 'T')).toHaveLength(5);
  });
});

describe('code blue: event log', () => {
  it('nothing happens before CPR starts', () => {
    expect(play([[0, 'shock']])).toEqual([]);
  });

  it('logs a VF arrest in order with numbered shocks and doses', () => {
    const ev = play([
      [0, 'start'],
      [0.5, 'rhythm', 'vf'],
      [0.6, 'shock'],
      [2.6, 'rhythm', 'vf'],
      [2.7, 'shock'],
      [3, 'adrenaline'],
      [4.7, 'shock'],
      [5, 'amiodarone'],
      [7, 'amiodarone'],
      [8, 'amiodarone'],
    ]);
    expect(ev.map((e) => e.label)).toEqual([
      LABEL.start,
      'Rhythm: VF / pVT',
      'Shock (biphasic 120–200 J) (shock 1)',
      'Rhythm check: VF / pVT',
      'Shock (biphasic 120–200 J) (shock 2)',
      'Inj. Adrenaline 1 mg IV/IO (dose 1)',
      'Shock (biphasic 120–200 J) (shock 3)',
      LABEL.amiodarone1,
      LABEL.amiodarone2,
      // no third dose
    ]);
  });

  it('amiodarone or lignocaine, not both', () => {
    const amio = view(play([[0, 'start'], [1, 'amiodarone']]));
    expect(amio.nextLignocaine).toBeNull();
    expect(amio.nextAmiodarone).toBe(2);
    const lig = view(play([[0, 'start'], [1, 'lignocaine'], [3, 'lignocaine']]));
    expect(lig.nextAmiodarone).toBeNull();
    expect(lig.nextLignocaine).toBeNull();
    expect(play([[0, 'start'], [1, 'lignocaine'], [2, 'amiodarone']]).map((e) => e.type)).toEqual(['start', 'lignocaine']);
  });

  it('restarts the 2-minute cycle on start, each shock and each rhythm check', () => {
    expect(cycleRemaining(view(play([[0, 'start']])), min(1.5))).toBe(30_000);
    expect(cycleRemaining(view(play([[0, 'start']])), min(2.5))).toBe(-30_000);
    expect(cycleRemaining(view(play([[0, 'start'], [1, 'shock']])), min(2))).toBe(60_000);
    expect(cycleRemaining(view(play([[0, 'start'], [2, 'rhythm', 'pea']])), min(2))).toBe(CYCLE_MS);
  });

  it('adrenaline: wait until 3 min, due 3–5 min, overdue after 5', () => {
    const v = view(play([[0, 'start'], [1, 'adrenaline']]));
    expect(adrenaline(v, min(2))).toEqual({ state: 'wait', in: 120_000 });
    expect(adrenaline(v, min(4))).toEqual({ state: 'due', left: 120_000 });
    expect(adrenaline(v, min(6))).toEqual({ state: 'due', left: 0 });
    expect(adrenaline(v, min(7))).toEqual({ state: 'overdue', over: 60_000 });
    expect(adrenaline(view(play([[0, 'start']])), min(1))).toEqual({ state: 'none' });
  });

  it('logs the advanced airway once', () => {
    const ev = play([[0, 'start'], [3, 'airway'], [4, 'airway']]);
    expect(ev.filter((e) => e.type === 'airway')).toHaveLength(1);
    expect(view(ev).advancedAirway).toBe(true);
  });

  it('stops the clock at ROSC and ignores later presses', () => {
    const ev = play([[0, 'start'], [6, 'rosc'], [7, 'shock']]);
    const v = view(ev);
    expect(v.running).toBe(false);
    expect(v.endedAt).toBe(min(6));
    expect(ev).toHaveLength(2);
    expect(cycleRemaining(v, min(7))).toBeNull();
  });

  it('undo is dropping the last event', () => {
    const ev = play([[0, 'start'], [1, 'shock'], [2, 'shock']]);
    expect(view(ev.slice(0, -1)).shocks).toBe(1);
  });
});

describe('code blue: copy to case sheet', () => {
  it('prints elapsed time, clock time and each event', () => {
    const ev = play([[0, 'start'], [0.5, 'rhythm', 'asystole'], [1, 'adrenaline']]);
    const text = logText(ev, ['Hypoglycaemia — dextrose']);
    expect(text.split('\n')[0]).toMatch(/^CODE BLUE — 02 Nov 2026, started \d\d:\d\d:00$/);
    expect(text).toContain(' 0:30');
    expect(text).toContain('Rhythm: Asystole');
    expect(text).toContain('Reversible causes considered: Hypoglycaemia — dextrose');
  });

  it('formats clocks and overdue times', () => {
    expect(clock(65_000)).toBe('1:05');
    expect(clock(-5_000)).toBe('+0:05');
  });
});
