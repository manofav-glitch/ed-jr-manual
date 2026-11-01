import { Link } from 'react-router-dom';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { redArea, site } from '../../config/site.ts';
import { CheckRow, ConfirmButton, NumberField, Segmented, SectionTitle, TextField, ToolHeader } from '../../components/Fields.tsx';
import { CopyButton } from '../../components/CopyButton.tsx';
import { CloseIcon } from '../../components/Icons.tsx';
import { EMPTY_NOTE, buildNote, hhmm, importVitals, nowLocal, type NoteData, type Timed } from '../../lib/note.ts';
import { num } from '../../lib/num.ts';
import { safeStorage } from '../../lib/persist.ts';
import { triageOf, useTriage } from '../triage/store.ts';

const useNote = create<{ n: NoteData; set: (p: Partial<NoteData>) => void; clear: () => void }>()(
  persist(
    (set) => ({
      n: EMPTY_NOTE,
      set: (p) => set((s) => ({ n: { ...s.n, ...p } })),
      // Your own name stays for the next patient.
      clear: () => set((s) => ({ n: { ...EMPTY_NOTE, seenBy: s.n.seenBy } })),
    }),
    { name: 'ed-note', version: 1, storage: safeStorage },
  ),
);

export function NoteScreen() {
  const { n, set, clear } = useNote();
  const text = buildNote(n);
  const t = (k: keyof NoteData) => ({ value: n[k] as string, onChange: (v: string) => set({ [k]: v }) });

  return (
    <>
      <ToolHeader title="Case-sheet note">
        <ConfirmButton label="New note" confirmLabel="Tap to clear" onConfirm={clear} />
      </ToolHeader>
      <main className="px-safe mx-auto max-w-3xl pb-8">
        <p className="mt-3 text-sm text-muted">
          Chapter 2 format.{' '}
          <Link to="/p/ch2" className="text-accent underline">
            Read the documentation guide
          </Link>
        </p>

        <SectionTitle>Drug allergies (front sheet)</SectionTitle>
        <TextField label="Known drug allergies — printed in CAPITALS" placeholder="e.g. penicillin" {...t('allergies')} />
        <div className="mt-2">
          <CheckRow checked={n.noKnownAllergies} onToggle={() => set({ noKnownAllergies: !n.noKnownAllergies })}>
            No known drug allergies
          </CheckRow>
        </div>

        <SectionTitle>Examined</SectionTitle>
        <div className="flex items-end gap-2">
          <label className="block min-w-0 flex-1">
            <span className="text-sm font-bold text-muted">Date & time</span>
            <input
              type="datetime-local"
              value={n.examinedAt}
              onChange={(e) => set({ examinedAt: e.target.value })}
              className="mt-0.5 min-h-13 w-full rounded-xl border-2 border-line bg-surface px-3 text-lg"
            />
          </label>
          <NowButton onClick={() => set({ examinedAt: nowLocal() })} />
        </div>
        <div className="mt-3 space-y-3">
          <TextField label="Case seen by (your name & designation)" placeholder="Dr ABC, JR" {...t('seenBy')} />
          <TextField label="Previous known co-morbid illness" {...t('comorbid')} />
          <TextField label="Chief complaint (with duration)" {...t('complaint')} />
        </div>

        <PrimarySurvey n={n} set={set} t={t} />

        <SectionTitle>History & examination</SectionTitle>
        <div className="space-y-3">
          <TextField multiline label="Brief history as per the presenting complaint" {...t('history')} />
          <TextField multiline label="Relevant negative history" {...t('negatives')} />
          <TextField multiline label="Relevant focussed systemic examination findings" {...t('systemic')} />
        </div>

        <SectionTitle>POC investigations</SectionTitle>
        <TimedRows rows={n.investigations} onChange={(investigations) => set({ investigations })} nameLabel="Investigation sent" timeLabel="Time sent" addLabel="Add investigation" />
        <div className="mt-3 space-y-3">
          <TextField multiline label="Salient findings (ECG, blood gas…)" {...t('findings')} />
          <NumberField label="RBS" unit="mg/dL" {...t('rbs')} />
        </div>

        <SectionTitle>Emergency treatment advised / given</SectionTitle>
        <ol className="space-y-2">
          {n.treatment.map((line, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="w-7 shrink-0 text-right font-bold">{i + 1})</span>
              <input
                value={line}
                aria-label={`Treatment ${i + 1}`}
                placeholder="Inj. Paracetamol 1 g i.v. stat"
                onChange={(e) => set({ treatment: n.treatment.map((x, j) => (j === i ? e.target.value : x)) })}
                className="min-h-13 min-w-0 flex-1 rounded-xl border-2 border-line bg-surface px-3 text-lg"
              />
              <RemoveButton label={`Remove treatment ${i + 1}`} onClick={() => set({ treatment: n.treatment.filter((_, j) => j !== i) })} />
            </li>
          ))}
        </ol>
        <AddButton onClick={() => set({ treatment: [...n.treatment, ''] })}>Add drug / treatment</AddButton>
        <div className="mt-3">
          <TextField label="Other interventions (NG lavage, Foley's…)" {...t('interventions')} />
        </div>

        <SectionTitle>Disposition & communication</SectionTitle>
        <Segmented
          label="Shift to"
          options={[redArea(site), site.zones.yellow, site.zones.green].map((z) => ({ value: z, label: z }))}
          value={n.shiftTo || null}
          onChange={(shiftTo) => set({ shiftTo })}
        />
        <div className="mt-3 space-y-3">
          <TextField label="Shift to (or type another area)" {...t('shiftTo')} />
          <TextField label="Handover note" {...t('handover')} />
        </div>
        <h3 className="mt-4 mb-2 font-bold">Consultations</h3>
        <TimedRows rows={n.consults} onChange={(consults) => set({ consults })} nameLabel="Who was informed" timeLabel="Time informed" addLabel="Add consultation" />

        <SectionTitle>Other specific documentation</SectionTitle>
        <TextField multiline label="Blood products arranged, investigations to review…" {...t('other')} />

        <SectionTitle>Note</SectionTitle>
        <pre className="max-h-[60vh] overflow-auto rounded-xl border border-line bg-surface px-3 py-2 font-sans text-base whitespace-pre-wrap">
          {text || 'Fill in the form; the note appears here.'}
        </pre>
        <div className="mt-3">
          <CopyButton text={text} />
        </div>
      </main>
    </>
  );
}

function PrimarySurvey({
  n,
  set,
  t,
}: {
  n: NoteData;
  set: (p: Partial<NoteData>) => void;
  t: (k: keyof NoteData) => { value: string; onChange: (v: string) => void };
}) {
  const tri = useTriage();
  const hasTriage = Object.values(tri.fields).some((v) => v?.trim());
  const doImport = () => {
    const f = tri.fields;
    const next = importVitals(n, {
      rr: num(f.rr),
      spo2: num(f.spo2),
      hr: num(f.hr),
      sbp: num(f.sbp),
      dbp: num(f.dbp),
      gcs: num(f.gcs),
      temp: num(f.tempC),
      tempUnit: tri.tempUnit,
    });
    // Disposition follows the triage category (ch 2), unless one is already written.
    const cat = triageOf(tri).category;
    const zone = cat === 'RED' ? redArea(site) : cat === 'YELLOW' ? site.zones.yellow : cat === 'GREEN' ? site.zones.green : '';
    set({ ...next, shiftTo: n.shiftTo || zone });
  };

  return (
    <>
      <SectionTitle>Primary survey</SectionTitle>
      <button
        type="button"
        disabled={!hasTriage}
        onClick={doImport}
        className="mb-3 min-h-13 w-full rounded-xl border-2 border-accent px-3 font-bold text-accent disabled:opacity-40"
      >
        {hasTriage ? `Import vitals from triage (entered ${tri.updatedAt ? hhmm(new Date(tri.updatedAt)) : '—'})` : 'No triage vitals to import'}
      </button>

      <h3 className="mb-1 font-bold">A — Airway</h3>
      <Segmented
        label="Airway"
        options={(['Patent', 'Threatened', 'Obstructed'] as const).map((v) => ({ value: v, label: v }))}
        value={n.airway || null}
        onChange={(airway) => set({ airway })}
      />
      <div className="mt-2">
        <TextField label="Intervention" {...t('airwayIntervention')} />
      </div>

      <h3 className="mt-4 mb-1 font-bold">B — Breathing</h3>
      <div className="grid grid-cols-2 gap-3">
        <NumberField label="RR" unit="/min" {...t('rr')} />
        <NumberField label="SpO₂" unit="%" {...t('spo2')} />
      </div>
      <div className="mt-2 space-y-2">
        <TextField label="On (room air / O₂ L/min)" {...t('oxygen')} />
        <TextField label="Bilateral air entry" placeholder="equal" {...t('airEntry')} />
      </div>

      <h3 className="mt-4 mb-1 font-bold">C — Circulation</h3>
      <div className="grid grid-cols-2 gap-3">
        <NumberField label="Pulse rate" unit="/min" {...t('pulse')} />
        <TextField label="BP (mmHg)" placeholder="120/80" {...t('bp')} />
      </div>
      <div className="mt-2">
        <Segmented
          label="Pulse rhythm"
          options={(['regular', 'irregular'] as const).map((v) => ({ value: v, label: v }))}
          value={n.pulseRhythm || null}
          onChange={(pulseRhythm) => set({ pulseRhythm })}
        />
      </div>
      <div className="mt-2">
        <TextField label="Capillary refill time / peripheral perfusion" {...t('perfusion')} />
      </div>

      <h3 className="mt-4 mb-1 font-bold">D — Disability</h3>
      <div className="grid grid-cols-3 gap-3">
        <NumberField label="GCS E" {...t('gcsE')} />
        <NumberField label="V" {...t('gcsV')} />
        <NumberField label="M" {...t('gcsM')} />
      </div>
      {n.gcsTotal && !(n.gcsE || n.gcsV || n.gcsM) && <p className="mt-1 text-sm text-muted">GCS {n.gcsTotal}/15 from triage; add E, V, M if known.</p>}
      <div className="mt-2 space-y-2">
        <TextField label="Any focal neurologic deficit" {...t('focalDeficit')} />
        <TextField label="Pupils / meningeal signs / plantar reflexes" {...t('pupils')} />
      </div>

      <h3 className="mt-4 mb-1 font-bold">E — Exposure</h3>
      <div className="grid grid-cols-2 items-end gap-3">
        <NumberField label="Temperature" unit={`°${n.tempUnit}`} {...t('temp')} />
        <Segmented
          label="Temperature unit"
          options={[
            { value: 'C' as const, label: '°C' },
            { value: 'F' as const, label: '°F' },
          ]}
          value={n.tempUnit}
          onChange={(tempUnit) => set({ tempUnit })}
        />
      </div>
      <div className="mt-2">
        <TextField multiline label="Salient head-to-toe findings" {...t('exposure')} />
      </div>
    </>
  );
}

function TimedRows({
  rows,
  onChange,
  nameLabel,
  timeLabel,
  addLabel,
}: {
  rows: Timed[];
  onChange: (rows: Timed[]) => void;
  nameLabel: string;
  timeLabel: string;
  addLabel: string;
}) {
  const update = (i: number, p: Partial<Timed>) => onChange(rows.map((r, j) => (j === i ? { ...r, ...p } : r)));
  return (
    <>
      <ul className="space-y-3">
        {rows.map((r, i) => (
          <li key={i} className="rounded-xl border border-line bg-surface p-2">
            <div className="flex items-center gap-2">
              <input
                value={r.name}
                aria-label={nameLabel}
                placeholder={nameLabel}
                onChange={(e) => update(i, { name: e.target.value })}
                className="min-h-13 min-w-0 flex-1 rounded-lg border-2 border-line bg-canvas px-3 text-lg"
              />
              <RemoveButton label={`Remove ${r.name || 'row'}`} onClick={() => onChange(rows.filter((_, j) => j !== i))} />
            </div>
            <div className="mt-2 flex items-center gap-2">
              <input
                type="time"
                value={r.time}
                aria-label={timeLabel}
                onChange={(e) => update(i, { time: e.target.value })}
                className="min-h-12 min-w-0 flex-1 rounded-lg border-2 border-line bg-canvas px-3 text-lg"
              />
              <NowButton onClick={() => update(i, { time: hhmm() })} />
            </div>
          </li>
        ))}
      </ul>
      <AddButton onClick={() => onChange([...rows, { name: '', time: hhmm() }])}>{addLabel}</AddButton>
    </>
  );
}

function NowButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="min-h-12 shrink-0 rounded-xl border-2 border-line px-4 font-bold">
      Now
    </button>
  );
}

function AddButton({ onClick, children }: { onClick: () => void; children: string }) {
  return (
    <button type="button" onClick={onClick} className="mt-2 min-h-12 w-full rounded-xl border-2 border-dashed border-line font-bold">
      + {children}
    </button>
  );
}

function RemoveButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" aria-label={label} onClick={onClick} className="flex size-12 shrink-0 items-center justify-center text-muted">
      <CloseIcon className="size-6" />
    </button>
  );
}
