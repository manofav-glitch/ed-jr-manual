import { useEffect, useRef, type ReactNode } from 'react';
import { CheckRow, ConfirmButton, SectionTitle, ToolHeader } from '../../components/Fields.tsx';
import { CopyButton } from '../../components/CopyButton.tsx';
import { InlineText } from '../../components/Inline.tsx';
import { NotesFor } from '../../components/Notes.tsx';
import {
  RHYTHM_LABEL,
  adrenaline as adrenalineState,
  clock,
  cycleRemaining,
  eventFor,
  logText,
  view,
  type EventType,
  type Rhythm,
} from '../../lib/codeBlue.ts';
import { manual } from '../../lib/manual.ts';
import { listAfter, listIn, quote } from '../../lib/quote.ts';
import { num } from '../../lib/num.ts';
import { useWeight } from '../../lib/weight.ts';
import { fmt } from '../../lib/doses.ts';
import { alarm, unlockAudio, useMetronome, useNow, useWakeLock } from './device.ts';
import { useCode } from './store.ts';

const bls = (match: string) => quote(manual, { chapter: 'hp9-4', match });
const MANUAL = {
  activate: bls('Shout for help. Announce CODE BLUE'),
  start: bls('No breathing and no pulse → start CPR immediately'),
  noAirway: bls('Compression-to-ventilation ratio 30:2'),
  airway: bls('With an advanced airway: continuous compressions with 1 breath every 6 seconds'),
  rate: bls('Rate: 100–120 compressions per minute'),
  change: bls('Change the compressor every 2 minutes'),
  etco2: bls('an ETCO₂ below 10 mmHg indicates inadequate compressions'),
  bicarb: quote(manual, { chapter: 'hp9-6', match: 'Routine sodium bicarbonate is not recommended' }),
};
const SHOCKABLE = listIn(manual, 'hp9-6', 'Shockable rhythm');
const NON_SHOCKABLE = listIn(manual, 'hp9-6', 'Non-shockable rhythm');
const HS = listAfter(manual, 'hp9-6', 'H');
const TS = listAfter(manual, 'hp9-6', 'T');
const BPM = 110;

export function CodeBlueScreen() {
  const { events, considered, metronome, add, undo, toggleConsidered, setMetronome, reset } = useCode();
  const v = view(events);
  const now = useNow(v.running);
  const wake = useWakeLock(v.running);
  const beat = useMetronome(metronome && v.running, BPM);
  const cycle = cycleRemaining(v, now);
  const adr = adrenalineState(v, now);
  const rhythmDue = cycle !== null && cycle <= 0;
  const adrenalineDue = adr.state === 'due' || adr.state === 'overdue';
  const kg = num(useWeight((w) => w.weight));

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
            <Quoted q={MANUAL.start} />
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
                <p className={'col-span-2 rounded-xl px-3 py-2 text-lg font-bold ' + (adr.state === 'overdue' ? 'alert-flash' : 'bg-surface-2')}>
                  Adrenaline:{' '}
                  {adr.state === 'none' && 'not given yet'}
                  {adr.state === 'wait' && `due in ${clock(adr.in)}`}
                  {adr.state === 'due' && `DUE NOW (by ${clock(adr.left)})`}
                  {adr.state === 'overdue' && `OVERDUE (${clock(-adr.over)})`}
                  <span className="ml-2 text-sm font-normal">({v.adrenalineDoses} given · every 3–5 min)</span>
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
                {v.rhythm && (
                  <ol className="my-2 list-decimal space-y-1 border-l-4 border-line pl-8">
                    {(v.rhythm === 'vf' ? SHOCKABLE : NON_SHOCKABLE).map((i) => (
                      <li key={i.id}>
                        <InlineText runs={i.inline} />
                      </li>
                    ))}
                  </ol>
                )}

                <SectionTitle>Breaths</SectionTitle>
                <Quoted q={v.advancedAirway ? MANUAL.airway : MANUAL.noAirway} />

                <SectionTitle>Log</SectionTitle>
                <div className="grid grid-cols-2 gap-2">
                  <Action onClick={() => press('shock')} strong={v.rhythm === 'vf'}>
                    Shock 120–200 J{v.shocks > 0 && <Count n={v.shocks} />}
                  </Action>
                  <Action onClick={() => press('adrenaline')} strong={adrenalineDue || v.adrenalineDoses === 0}>
                    Adrenaline 1 mg{v.adrenalineDoses > 0 && <Count n={v.adrenalineDoses} />}
                  </Action>
                  <Action onClick={() => press('amiodarone')} disabled={!can('amiodarone')}>
                    {v.nextAmiodarone === 1 ? 'Amiodarone 300 mg' : v.nextAmiodarone === 2 ? 'Amiodarone 150 mg' : 'Amiodarone —'}
                  </Action>
                  <Action onClick={() => press('lignocaine')} disabled={!can('lignocaine')}>
                    {v.nextLignocaine === null ? 'Lignocaine —' : v.nextLignocaine === 1 ? 'Lignocaine 1–1.5 mg/kg' : 'Lignocaine 0.5–0.75 mg/kg'}
                    {v.nextLignocaine !== null && kg !== undefined && kg > 0 && (
                      <span className="block text-sm font-normal">
                        {v.nextLignocaine === 1 ? `${fmt(kg)}–${fmt(kg * 1.5)} mg` : `${fmt(kg * 0.5)}–${fmt(kg * 0.75)} mg`} at {fmt(kg)} kg
                      </span>
                    )}
                  </Action>
                  <Action onClick={() => press('airway')} disabled={!can('airway')}>
                    {v.advancedAirway ? 'Advanced airway ✓' : 'Advanced airway'}
                  </Action>
                  <Action onClick={() => press('calcium')}>Calcium given</Action>
                  <Action onClick={() => press('bicarb')}>Bicarbonate given</Action>
                  <Action onClick={() => press('iv')}>IV / IO access</Action>
                  <Action onClick={() => press('gas')}>Blood gas sent</Action>
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
                <Quoted q={MANUAL.change} />
                <Quoted q={MANUAL.etco2} />
                <p className="text-sm text-muted">
                  Screen: {wake === 'on' ? 'kept awake' : wake === 'unsupported' ? 'this browser cannot keep it awake' : 'may sleep'}
                </p>
              </>
            )}

            <SectionTitle>Reversible causes — the H’s and T’s</SectionTitle>
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

        <SectionTitle>Drugs</SectionTitle>
        <p className="mb-2 text-sm text-muted">From section 9.6. The calcium and bicarbonate buttons only log the time.</p>
        <Quoted q={MANUAL.bicarb} />
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
