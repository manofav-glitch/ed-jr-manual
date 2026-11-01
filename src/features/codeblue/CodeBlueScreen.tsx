import { useEffect, useRef, type ReactNode } from 'react';
import { CheckRow, ConfirmButton, SectionTitle, ToolHeader } from '../../components/Fields.tsx';
import { CopyButton } from '../../components/CopyButton.tsx';
import { InlineText } from '../../components/Inline.tsx';
import { NotesFor } from '../../components/Notes.tsx';
import {
  RHYTHM_LABEL,
  adrenalineDueIn,
  clock,
  cycleRemaining,
  eventFor,
  logText,
  view,
  type EventType,
  type Rhythm,
} from '../../lib/codeBlue.ts';
import { manual } from '../../lib/manual.ts';
import { listAfter, quote } from '../../lib/quote.ts';
import { alarm, unlockAudio, useMetronome, useNow, useWakeLock } from './device.ts';
import { useCode } from './store.ts';

const q = (match: string) => quote(manual, { chapter: 13, match });
const MANUAL = {
  activate: q('ACTIVATE CODE BLUE'),
  cpr: q('BEGIN HIGH QUALITY CPR'),
  shockable: q('Shockable rhythm (pulseless VT or VF)'),
  nonShockable: q('Non-shockable (PEA or asystole)'),
  noAirway: q('No advanced airway: give 2 breaths after each 30 chest compressions'),
  airway: q('Advanced airway in place: one breath every 6 seconds'),
  rate: q('Rate: 100–120/min'),
  drugs: [
    q('Epinephrine: 1 mg IV stat'),
    q('Amiodarone: 1st 300 mg IV'),
    q('Hyperkalemic arrest'),
    q('Metabolic acidosis: Inj. NaHCO₃'),
  ],
};
const HS = listAfter(manual, 13, '5H');
const TS = listAfter(manual, 13, '5T');
const BPM = 110;

export function CodeBlueScreen() {
  const { events, considered, metronome, add, undo, toggleConsidered, setMetronome, reset } = useCode();
  const v = view(events);
  const now = useNow(v.running);
  const wake = useWakeLock(v.running);
  const beat = useMetronome(metronome && v.running, BPM);
  const cycle = cycleRemaining(v, now);
  const adrenaline = adrenalineDueIn(v, now);
  const rhythmDue = cycle !== null && cycle <= 0;
  const adrenalineDue = adrenaline !== null && adrenaline <= 0;

  // Alarm once each time a rhythm check or adrenaline dose falls due.
  const alerted = useRef({ cycle: 0, adrenaline: 0 });
  useEffect(() => {
    if (rhythmDue && v.cycleStart && alerted.current.cycle !== v.cycleStart) {
      alerted.current.cycle = v.cycleStart;
      alarm('rhythm');
    }
    if (adrenalineDue && v.lastAdrenaline && alerted.current.adrenaline !== v.lastAdrenaline) {
      alerted.current.adrenaline = v.lastAdrenaline;
      alarm('adrenaline');
    }
  }, [rhythmDue, adrenalineDue, v.cycleStart, v.lastAdrenaline]);

  const press = (type: EventType, rhythm?: Rhythm) => {
    unlockAudio();
    const e = eventFor(type, v, Date.now(), rhythm);
    if (e) add(e);
  };
  const can = (type: EventType) => eventFor(type, v, now) !== null;
  const consideredText = [...HS, ...TS].filter((i) => considered.includes(i.id)).map((i) => i.text);

  return (
    <>
      <ToolHeader title="Code blue">
        {events.length > 0 && <ConfirmButton label="New code" confirmLabel="Tap to clear log" onConfirm={reset} />}
      </ToolHeader>

      <main className="px-safe mx-auto max-w-3xl pb-8">
        {v.startedAt === null ? (
          <div className="pt-4">
            <Quoted q={MANUAL.activate} />
            <Quoted q={MANUAL.cpr} />
            <button
              type="button"
              onClick={() => press('start')}
              className="mt-4 flex min-h-24 w-full items-center justify-center rounded-2xl bg-accent text-3xl font-bold text-accent-ink"
            >
              Start CPR
            </button>
            <p className="mt-2 text-sm text-muted">Starts the total timer and the 2-minute rhythm-check countdown. Keep this screen open.</p>
          </div>
        ) : (
          <>
            {/* Timers */}
            <div className="sticky top-[calc(3.5rem+env(safe-area-inset-top)+1px)] z-10 -mx-4 grid grid-cols-2 gap-2 border-b border-line bg-canvas px-4 py-2">
              <Timer label="Total" value={clock((v.endedAt ?? now) - v.startedAt)} />
              {v.running ? (
                <div className={'rounded-xl px-3 py-1.5 ' + (rhythmDue ? 'alert-flash' : 'bg-surface-2')} role="timer" aria-live="assertive">
                  <p className="text-sm font-bold">{rhythmDue ? 'RHYTHM CHECK NOW' : 'Rhythm check in'}</p>
                  <p className="text-4xl font-bold tabular-nums">{clock(cycle ?? 0)}</p>
                </div>
              ) : (
                <div className="rounded-xl bg-surface-2 px-3 py-1.5">
                  <p className="text-sm font-bold">Stopped</p>
                  <p className="text-2xl font-bold">{events.at(-1)?.label}</p>
                </div>
              )}
              {v.running && (
                <p className={'col-span-2 rounded-xl px-3 py-2 text-lg font-bold ' + (adrenalineDue ? 'alert-flash' : 'bg-surface-2')}>
                  Adrenaline:{' '}
                  {adrenaline === null ? 'not given yet' : adrenalineDue ? `DUE NOW (${clock(adrenaline)})` : `next in ${clock(adrenaline)}`}
                  <span className="ml-2 text-sm font-normal">({v.adrenalineDoses} given)</span>
                </p>
              )}
            </div>

            {v.running && (
              <>
                <SectionTitle>Rhythm</SectionTitle>
                <div role="radiogroup" aria-label="Rhythm" className="grid grid-cols-3 gap-2">
                  {(['vf', 'pea', 'asystole'] as Rhythm[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      role="radio"
                      aria-checked={v.rhythm === r}
                      onClick={() => press('rhythm', r)}
                      className={
                        'min-h-16 rounded-xl border-2 text-lg font-bold ' +
                        (v.rhythm === r ? 'border-accent bg-accent text-accent-ink' : 'border-line bg-surface')
                      }
                    >
                      {RHYTHM_LABEL[r]}
                    </button>
                  ))}
                </div>
                <p className="mt-1 text-sm text-muted">Tap the rhythm at every check: it restarts the 2-minute countdown.</p>
                {v.rhythm && <Quoted q={v.rhythm === 'vf' ? MANUAL.shockable : MANUAL.nonShockable} />}

                <SectionTitle>Breaths</SectionTitle>
                <Quoted q={v.advancedAirway ? MANUAL.airway : MANUAL.noAirway} />

                <SectionTitle>Log</SectionTitle>
                <div className="grid grid-cols-2 gap-2">
                  <Action onClick={() => press('shock')} strong={v.rhythm === 'vf'}>
                    Shock 200 J{v.shocks > 0 && <Count n={v.shocks} />}
                  </Action>
                  <Action onClick={() => press('adrenaline')} strong={adrenalineDue || v.adrenalineDoses === 0}>
                    Adrenaline 1 mg{v.adrenalineDoses > 0 && <Count n={v.adrenalineDoses} />}
                  </Action>
                  <Action onClick={() => press('amiodarone')} disabled={!can('amiodarone')}>
                    {v.nextAmiodarone ? `Amiodarone ${v.nextAmiodarone} mg` : 'Amiodarone: both given'}
                  </Action>
                  <Action onClick={() => press('airway')} disabled={!can('airway')}>
                    {v.advancedAirway ? 'Advanced airway ✓' : 'Advanced airway'}
                  </Action>
                  <Action onClick={() => press('calcium')}>Ca gluconate 10% 30 mL</Action>
                  <Action onClick={() => press('bicarb')}>NaHCO₃ 100 mEq</Action>
                  <Action onClick={() => press('iv')}>IV access</Action>
                  <Action onClick={() => press('vbg')}>VBG sent</Action>
                  <Action onClick={() => press('rosc')} strong>
                    ROSC
                  </Action>
                  <ConfirmButton label="Stop resuscitation" confirmLabel="Tap to stop" onConfirm={() => press('end')} />
                </div>
                <button
                  type="button"
                  onClick={undo}
                  disabled={events.length <= 1}
                  className="mt-2 min-h-12 w-full rounded-xl border-2 border-line font-bold disabled:opacity-40"
                >
                  Undo last: {events.length > 1 ? events.at(-1)?.label : '—'}
                </button>

                <SectionTitle>Metronome</SectionTitle>
                <button
                  type="button"
                  aria-pressed={metronome}
                  onClick={() => {
                    unlockAudio();
                    setMetronome(!metronome);
                  }}
                  className={
                    'flex min-h-14 w-full items-center justify-center gap-3 rounded-xl border-2 text-lg font-bold ' +
                    (metronome ? 'border-accent bg-accent text-accent-ink' : 'border-line bg-surface')
                  }
                >
                  <span
                    aria-hidden="true"
                    className={'size-4 rounded-full ' + (metronome && beat % 2 ? 'bg-accent-ink' : 'bg-current opacity-30')}
                  />
                  {metronome ? `Metronome on · ${BPM}/min` : `Metronome ${BPM}/min`}
                </button>
                <Quoted q={MANUAL.rate} />
                <p className="text-sm text-muted">
                  Screen: {wake === 'on' ? 'kept awake' : wake === 'unsupported' ? 'this browser cannot keep it awake' : 'may sleep'}
                </p>
              </>
            )}

            <SectionTitle>Reversible causes (5H & 5T)</SectionTitle>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {[...HS, ...TS].map((i) => (
                <CheckRow key={i.id} checked={considered.includes(i.id)} onToggle={() => toggleConsidered(i.id)}>
                  <InlineText runs={i.inline} />
                </CheckRow>
              ))}
            </div>

            <SectionTitle>Event log</SectionTitle>
            <ol className="space-y-1 rounded-xl border border-line bg-surface px-3 py-2 font-mono text-base">
              {events.map((e, i) => (
                <li key={i} className="flex gap-3">
                  <span className="w-14 shrink-0 text-right text-muted tabular-nums">{clock(e.t - v.startedAt!)}</span>
                  <span>{e.label}</span>
                </li>
              ))}
            </ol>
            <div className="mt-3">
              <CopyButton text={logText(events, consideredText)} />
            </div>
          </>
        )}

        <SectionTitle>Drug doses (chapter 13)</SectionTitle>
        <ul className="space-y-1.5">
          {MANUAL.drugs.map((d) => (
            <li key={d.id} className="flex gap-2">
              <span aria-hidden="true">•</span>
              <span>
                <InlineText runs={d.inline} />
              </span>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}

function Timer({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-surface-2 px-3 py-1.5" role="timer">
      <p className="text-sm font-bold">{label}</p>
      <p className="text-4xl font-bold tabular-nums">{value}</p>
    </div>
  );
}

function Action({ onClick, children, disabled, strong }: { onClick: () => void; children: ReactNode; disabled?: boolean; strong?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={
        'min-h-16 rounded-xl border-2 px-2 text-lg leading-tight font-bold disabled:opacity-40 ' +
        (strong ? 'border-accent bg-accent text-accent-ink' : 'border-line bg-surface')
      }
    >
      {children}
    </button>
  );
}

function Count({ n }: { n: number }) {
  return <span className="ml-1.5 rounded-full bg-canvas px-2 text-base text-ink">×{n}</span>;
}

/** A line of the manual, with its "Check before use" / local-site notes. */
function Quoted({ q }: { q: { id: string; inline: Parameters<typeof InlineText>[0]['runs'] } }) {
  return (
    <blockquote className="my-2 border-l-4 border-line pl-3">
      <InlineText runs={q.inline} />
      <NotesFor id={q.id} />
    </blockquote>
  );
}
