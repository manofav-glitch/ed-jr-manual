import { Link } from 'react-router-dom';
import { site } from '../../config/site.ts';
import { CheckRow, ConfirmButton, NumberField, Segmented, SectionTitle, ToolHeader } from '../../components/Fields.tsx';
import { InlineText } from '../../components/Inline.tsx';
import { FINDINGS, type Category } from '../../lib/triage.ts';
import { EMERGENCIES, VULNERABLE, triageOf, useTriage, type VitalKey } from './store.ts';

const PARTS = { A: 'A — Airway', B: 'B — Breathing', C: 'C — Circulation', D: 'D — Disability' } as const;

export function TriageScreen() {
  const s = useTriage();
  const useEhs = !!site.priorityRed?.useInTriage;
  const result = triageOf(s);
  const f = (k: VitalKey) => ({ value: s.fields[k] ?? '', onChange: (v: string) => s.setField(k, v) });

  return (
    <>
      <ToolHeader title="Triage">
        <ConfirmButton label="Clear" confirmLabel="Tap to clear" onConfirm={s.clear} />
      </ToolHeader>
      <ResultBar category={result.category} />

      <main className="px-safe mx-auto max-w-3xl pb-8">
        <p className="mt-3 text-sm text-muted">
          Chapter 1 criteria.{' '}
          <Link to="/p/ch1?focus=ch1-reference-3" className="text-accent underline">
            Read the triage section
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
          <NumberField label="Temperature" unit={`°${s.tempUnit}`} {...f('tempC')} />
          <div>
            <span className="text-sm font-bold text-muted">Unit</span>
            <div className="mt-0.5">
              <Segmented
                label="Temperature unit"
                options={[
                  { value: 'C', label: '°C' },
                  { value: 'F', label: '°F' },
                ]}
                value={s.tempUnit}
                onChange={s.setTempUnit}
              />
            </div>
          </div>
        </div>
        <p className="mt-3 rounded-xl bg-surface-2 px-3 py-2 text-lg">
          Shock index (pulse rate / SBP):{' '}
          <strong className={result.shockIndex !== undefined && result.shockIndex > 1 ? 'text-danger' : ''}>
            {result.shockIndex === undefined ? '—' : result.shockIndex.toFixed(2)}
          </strong>
        </p>

        <SectionTitle>Primary survey</SectionTitle>
        <div className="space-y-2">
          {FINDINGS.map((x) => (
            <CheckRow key={x.id} checked={s.findings.includes(x.id)} onToggle={() => s.toggleFinding(x.id)} tone="danger">
              <span className="block text-sm font-bold text-muted">{PARTS[x.part]}</span>
              {cap(x.match)}
            </CheckRow>
          ))}
        </div>

        <SectionTitle>Time-sensitive emergencies</SectionTitle>
        <div className="space-y-2">
          {EMERGENCIES.map((i) => (
            <CheckRow key={i.id} checked={s.ticked.includes(i.id)} onToggle={() => s.toggleItem(i.id)} tone="danger">
              <InlineText runs={i.inline} />
            </CheckRow>
          ))}
          {useEhs && (
            <CheckRow checked={s.priorityRed} onToggle={s.togglePriorityRed} tone="danger">
              {site.priorityRed!.text} (priority Red)
            </CheckRow>
          )}
        </div>

        <SectionTitle>Vulnerable population / risk for early deterioration</SectionTitle>
        <div className="space-y-2">
          {VULNERABLE.map((i) => (
            <CheckRow key={i.id} checked={s.ticked.includes(i.id)} onToggle={() => s.toggleItem(i.id)}>
              <InlineText runs={i.inline} />
            </CheckRow>
          ))}
        </div>

        <section id="triage-result" className="mt-8 scroll-mt-32" aria-live="polite">
          <SectionTitle>Result</SectionTitle>
          <ResultCard category={result.category} />
          {result.missing.length > 0 && result.category === null && (
            <p className="mt-2 text-lg">Enter {result.missing.join(', ')} to finish triage.</p>
          )}
          <Reasons title="Red because" items={[...result.gaps, ...result.red]} tone="danger" />
          <Reasons title={result.category === 'RED' ? 'Also' : 'Yellow because'} items={result.yellow} tone="warn" />
          {result.category === 'GREEN' && <p className="mt-2">Stable primary survey and no risk factors for deterioration.</p>}
          {result.notes.length > 0 && (
            <ul className="mt-3 space-y-1.5 text-muted">
              {result.notes.map((n) => (
                <li key={n}>ⓘ {n}</li>
              ))}
            </ul>
          )}
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

const STYLE: Record<Category, string> = {
  RED: 'bg-danger text-surface border-danger',
  YELLOW: 'bg-warn-soft text-warn border-warn',
  GREEN: 'bg-ok-soft text-ok border-ok',
};

function ResultBar({ category }: { category: Category | null }) {
  return (
    <a
      href="#triage-result"
      onClick={(e) => {
        e.preventDefault();
        document.getElementById('triage-result')?.scrollIntoView({ behavior: 'smooth' });
      }}
      className={
        'sticky top-[calc(3.5rem+env(safe-area-inset-top)+1px)] z-10 flex min-h-12 items-center justify-center border-b-2 text-lg font-bold ' +
        (category ? STYLE[category] : 'border-line bg-surface-2 text-muted')
      }
    >
      {category ?? 'Not triaged yet'} <span className="ml-2 text-sm font-normal underline">see why</span>
    </a>
  );
}

function ResultCard({ category }: { category: Category | null }) {
  return (
    <p
      className={
        'rounded-xl border-2 px-4 py-4 text-center text-3xl font-bold tracking-wide ' +
        (category ? STYLE[category] : 'border-line bg-surface-2 text-muted')
      }
    >
      {category ?? 'Not triaged yet'}
    </p>
  );
}

function Reasons({ title, items, tone }: { title: string; items: string[]; tone: 'danger' | 'warn' }) {
  if (!items.length) return null;
  return (
    <div className="mt-3">
      <h3 className={'font-bold ' + (tone === 'danger' ? 'text-danger' : 'text-warn')}>{title}</h3>
      <ul className="mt-1 list-disc space-y-1 pl-6">
        {items.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>
    </div>
  );
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
