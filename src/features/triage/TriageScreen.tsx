import { Link } from 'react-router-dom';
import { CheckRow, ConfirmButton, NumberField, Segmented, SectionTitle, ToolHeader } from '../../components/Fields.tsx';
import { InlineText } from '../../components/Inline.tsx';
import { NotesFor } from '../../components/Notes.tsx';
import { manual } from '../../lib/manual.ts';
import { listIn, quote } from '../../lib/quote.ts';
import { ZONE_NAME, type Reason, type Zone } from '../../lib/triage.ts';
import { LISTS, triageOf, useTriage, type VitalKey } from './store.ts';

const T = 'hp-triage';
const PRIORITY_RED = quote(manual, { chapter: T, match: 'Priority Red regardless of the above' });
const ANCHORED = [
  quote(manual, { chapter: T, match: 'Apnoea, agonal or gasping respiration' }),
  quote(manual, { chapter: T, match: 'Danger-zone vitals' }),
];

/** Ticking one of these shows the matching special alert from the Triage chapter. */
const ALERTS: { when: RegExp; alert: string }[] = [
  { when: /^Chest pain <24 h/, alert: 'STEMI alert' },
  { when: /^Suspected stroke within window/, alert: 'Stroke alert' },
  { when: /^Any evaluation suggestive of sepsis/, alert: 'Sepsis alert' },
  { when: /^Critical trauma/, alert: 'Trauma alert' },
];

export function TriageScreen() {
  const s = useTriage();
  const result = triageOf(s);
  const f = (k: VitalKey) => ({ value: s.fields[k] ?? '', onChange: (v: string) => s.setField(k, v) });
  const tickedTexts = LISTS.flatMap((l) => l.items.filter((i) => s.ticked.includes(i.id)).map((i) => i.text));
  const alerts = ALERTS.filter((a) => tickedTexts.some((t) => a.when.test(t))).map((a) => a.alert);

  return (
    <>
      <ToolHeader title="Triage">
        <ConfirmButton label="Clear" confirmLabel="Tap to clear" onConfirm={s.clear} />
      </ToolHeader>
      <ResultBar zone={result.zone} />

      <main className="px-safe mx-auto max-w-3xl pb-8">
        <p className="mt-3 text-sm text-muted">
          Triage chapter and section 9.1 of the hospital manual.{' '}
          <Link to={`/p/${T}`} className="text-accent underline">
            Read the triage chapter
          </Link>
        </p>

        <SectionTitle>Vitals</SectionTitle>
        <div className="grid grid-cols-2 gap-3">
          <NumberField label="RR" unit="/min" {...f('rr')} />
          <NumberField label="SpO₂" unit="%" {...f('spo2')} />
          <NumberField label="HR" unit="/min" {...f('hr')} />
          <NumberField label="GCS" unit="/15" {...f('gcs')} />
          <NumberField label="SBP" unit="mmHg" {...f('sbp')} />
          <NumberField label="DBP" unit="mmHg" {...f('dbp')} />
          <NumberField label="Temperature" unit={`°${s.tempUnit}`} {...f('temp')} />
          <div>
            <span className="text-sm font-bold text-muted">Unit</span>
            <div className="mt-0.5">
              <Segmented
                label="Temperature unit"
                options={[
                  { value: 'F', label: '°F' },
                  { value: 'C', label: '°C' },
                ]}
                value={s.tempUnit}
                onChange={s.setTempUnit}
              />
            </div>
          </div>
          <NumberField label="Blood sugar" unit="mg/dL" {...f('rbs')} />
        </div>
        <div className="mt-3">
          <CheckRow checked={s.onOxygen} onToggle={s.toggleOxygen}>
            SpO₂ measured on oxygen
          </CheckRow>
        </div>
        <p className="mt-3 rounded-xl bg-surface-2 px-3 py-2 text-lg">
          Shock index (HR÷SBP):{' '}
          <strong className={result.shockIndex !== undefined && result.shockIndex > 0.9 ? 'text-danger' : ''}>
            {result.shockIndex === undefined ? '—' : result.shockIndex.toFixed(2)}
          </strong>
        </p>

        {LISTS.map((l) => (
          <section key={l.title}>
            <SectionTitle>{l.title}</SectionTitle>
            <div className="space-y-2">
              {l.items.map((i) => (
                <CheckRow key={i.id} checked={s.ticked.includes(i.id)} onToggle={() => s.toggleItem(i.id)} tone={l.zone === 'RESUS' || l.zone === 'RED' ? 'danger' : 'accent'}>
                  <InlineText runs={i.inline} />
                </CheckRow>
              ))}
            </div>
          </section>
        ))}
        <div className="mt-4">
          <CheckRow checked={s.priorityRed} onToggle={s.togglePriorityRed} tone="danger">
            <InlineText runs={PRIORITY_RED.inline} />
          </CheckRow>
        </div>

        <section id="triage-result" className="mt-8 scroll-mt-32" aria-live="polite">
          <SectionTitle>Result</SectionTitle>
          <ResultCard zone={result.zone} />
          {result.missing.length > 0 && result.zone === null && <p className="mt-2 text-lg">Enter {result.missing.join(', ')} to finish triage.</p>}
          {result.gaps.length > 0 && (
            <ul className="mt-3 list-disc space-y-1 pl-6 font-bold text-danger">
              {result.gaps.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          )}
          <Reasons reasons={result.reasons} />
          {result.zone === 'GREEN' && !result.reasons.length && <p className="mt-2">Stable primary survey with no risk factors for deterioration.</p>}
          {alerts.map((a) => (
            <Alert key={a} title={a} />
          ))}
          <p className="mt-3 text-sm text-muted">Re-triage waiting patients: a Green patient can become Red.</p>
          {ANCHORED.map((q) => (
            <NotesFor key={q.id} id={q.id} />
          ))}
          <Link
            to="/note"
            className="mt-5 flex min-h-14 items-center justify-center rounded-xl border-2 border-accent px-4 text-lg font-bold text-accent"
          >
            Open the case-sheet note (imports these vitals)
          </Link>
        </section>
      </main>
    </>
  );
}

const STYLE: Record<Zone, string> = {
  RESUS: 'bg-ink text-canvas border-ink',
  RED: 'bg-danger text-surface border-danger',
  YELLOW: 'bg-warn-soft text-warn border-warn',
  GREEN: 'bg-ok-soft text-ok border-ok',
  WHITE: 'bg-surface text-ink border-line',
};

function ResultBar({ zone }: { zone: Zone | null }) {
  return (
    <a
      href="#triage-result"
      onClick={(e) => {
        e.preventDefault();
        document.getElementById('triage-result')?.scrollIntoView({ behavior: 'smooth' });
      }}
      className={
        'sticky top-[calc(3.5rem+env(safe-area-inset-top)+1px)] z-10 flex min-h-12 items-center justify-center border-b-2 text-lg font-bold ' +
        (zone ? STYLE[zone] : 'border-line bg-surface-2 text-muted')
      }
    >
      {zone ? ZONE_NAME[zone].toUpperCase() : 'Not triaged yet'} <span className="ml-2 text-sm font-normal underline">see why</span>
    </a>
  );
}

function ResultCard({ zone }: { zone: Zone | null }) {
  return (
    <p
      className={
        'rounded-xl border-2 px-4 py-4 text-center text-3xl font-bold tracking-wide ' + (zone ? STYLE[zone] : 'border-line bg-surface-2 text-muted')
      }
    >
      {zone ? ZONE_NAME[zone].toUpperCase() : 'Not triaged yet'}
    </p>
  );
}

function Reasons({ reasons }: { reasons: Reason[] }) {
  if (!reasons.length) return null;
  const zones = [...new Set(reasons.map((r) => r.zone))];
  return (
    <div className="mt-3 space-y-3">
      {zones.map((z) => (
        <div key={z}>
          <h3 className="font-bold">{ZONE_NAME[z]}</h3>
          <ul className="mt-1 list-disc space-y-1 pl-6">
            {reasons
              .filter((r) => r.zone === z)
              .map((r) => (
                <li key={r.text}>
                  {r.text}
                  {r.source !== 'Ticked' && <span className="ml-1 text-sm text-muted">({r.source === '9.1' ? 'section 9.1' : 'Triage chapter'})</span>}
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function Alert({ title }: { title: string }) {
  const items = listIn(manual, T, title);
  return (
    <div className="mt-4 rounded-xl border-2 border-danger bg-danger-soft px-3 py-2">
      <h3 className="font-bold text-danger">{title}</h3>
      <ul className="mt-1 list-disc space-y-1 pl-6">
        {items.map((i) => (
          <li key={i.id}>
            <InlineText runs={i.inline} />
          </li>
        ))}
      </ul>
    </div>
  );
}
