import { describe, expect, it } from 'vitest';
import {
  ADRENALINE_MS,
  CYCLE_MS,
  LABEL,
  adrenalineDueIn,
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
import { quote } from '../../src/lib/quote.ts';

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

describe('code blue: doses and timings are the manual\'s', () => {
  it.each([
    ['Shockable rhythm (pulseless VT or VF): give DC shock (energy 200 J)'],
    ['Inj. Adrenaline to repeat every 4 minutes'],
    ['Rhythm (± pulse) check every 2 minutes of CPR'],
    ['Amiodarone: 1st 300 mg IV; 2nd 150 mg IV'],
    ['Inj. Calcium gluconate 10%, 30 mL, IV push'],
    ['Inj. NaHCO₃ (1.5 mEq/kg) — 100 mEq, IV push'],
    ['Advanced airway in place: one breath every 6 seconds'],
    ['No advanced airway: give 2 breaths after each 30 chest compressions'],
  ])('ch 13 says "%s"', (match) => {
    expect(quote(manual, { chapter: 13, match }).chapter).toBe(13);
  });

  it('uses 2-minute cycles and 4-minute adrenaline', () => {
    expect(CYCLE_MS).toBe(120_000);
    expect(ADRENALINE_MS).toBe(240_000);
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
      [1, 'adrenaline'],
      [2.6, 'rhythm', 'vf'],
      [2.7, 'shock'],
      [3, 'amiodarone'],
      [5, 'adrenaline'],
      [5.2, 'amiodarone'],
      [6, 'amiodarone'],
    ]);
    expect(ev.map((e) => e.label)).toEqual([
      LABEL.start,
      'Rhythm: VF / pVT',
      'DC shock 200 J (shock 1)',
      'Inj. Adrenaline 1 mg IV (dose 1)',
      'Rhythm check: VF / pVT',
      'DC shock 200 J (shock 2)',
      LABEL.amiodarone1,
      'Inj. Adrenaline 1 mg IV (dose 2)',
      LABEL.amiodarone2,
      // a third amiodarone is not offered
    ]);
    const v = view(ev);
    expect(v.shocks).toBe(2);
    expect(v.nextAmiodarone).toBeNull();
  });

  it('restarts the 2-minute cycle on start, each shock and each rhythm check', () => {
    let ev = play([[0, 'start']]);
    expect(cycleRemaining(view(ev), min(1.5))).toBe(30_000);
    expect(cycleRemaining(view(ev), min(2.5))).toBe(-30_000);
    ev = play([
      [0, 'start'],
      [1, 'shock'],
    ]);
    expect(cycleRemaining(view(ev), min(2))).toBe(60_000);
    ev = play([
      [0, 'start'],
      [2, 'rhythm', 'pea'],
    ]);
    expect(cycleRemaining(view(ev), min(2))).toBe(CYCLE_MS);
  });

  it('counts adrenaline due 4 minutes after the last dose', () => {
    const ev = play([
      [0, 'start'],
      [1, 'adrenaline'],
    ]);
    expect(adrenalineDueIn(view(ev), min(1))).toBe(ADRENALINE_MS);
    expect(adrenalineDueIn(view(ev), min(5))).toBe(0);
    expect(adrenalineDueIn(view(ev), min(6))).toBe(-60_000);
    expect(adrenalineDueIn(view(play([[0, 'start']])), min(1))).toBeNull();
  });

  it('switches to 1 breath every 6 s once, after an advanced airway', () => {
    const ev = play([
      [0, 'start'],
      [3, 'airway'],
      [4, 'airway'],
    ]);
    expect(ev.filter((e) => e.type === 'airway')).toHaveLength(1);
    expect(view(ev).advancedAirway).toBe(true);
  });

  it('stops the clock at ROSC and ignores later presses', () => {
    const ev = play([
      [0, 'start'],
      [6, 'rosc'],
      [7, 'shock'],
    ]);
    const v = view(ev);
    expect(v.running).toBe(false);
    expect(v.endedAt).toBe(min(6));
    expect(ev).toHaveLength(2);
    expect(cycleRemaining(v, min(7))).toBeNull();
  });

  it('undo is dropping the last event', () => {
    const ev = play([
      [0, 'start'],
      [1, 'shock'],
      [2, 'shock'],
    ]);
    expect(view(ev.slice(0, -1)).shocks).toBe(1);
  });
});

describe('code blue: copy to case sheet', () => {
  it('prints elapsed time, clock time and each event', () => {
    const ev = play([
      [0, 'start'],
      [0.5, 'rhythm', 'asystole'],
      [1, 'adrenaline'],
    ]);
    const text = logText(ev, ['Hypoxia']);
    expect(text.split('\n')[0]).toMatch(/^CODE BLUE — 02 Nov 2026, started \d\d:\d\d:00$/);
    expect(text).toContain(' 0:30');
    expect(text).toContain('Rhythm: Asystole');
    expect(text).toContain(' 1:00');
    expect(text).toContain('Reversible causes considered: Hypoxia');
  });

  it('formats clocks and overdue times', () => {
    expect(clock(65_000)).toBe('1:05');
    expect(clock(-5_000)).toBe('+0:05');
  });
});
