import { Link } from 'react-router-dom';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CheckRow, ConfirmButton, NumberField, Segmented, SectionTitle, TextField, ToolHeader } from '../../components/Fields.tsx';
import { CopyButton } from '../../components/CopyButton.tsx';
import { CloseIcon } from '../../components/Icons.tsx';
import {
  ARRIVAL_MODES,
  DISPOSITIONS,
  EMPTY_NOTE,
  buildNote,
  hhmm,
  importVitals,
  noteShockIndex,
  nowLocal,
  type Consult,
  type NoteData,
  type Timed,
} from '../../lib/note.ts';
import { num } from '../../lib/num.ts';
import { safeStorage } from '../../lib/persist.ts';
import { ZONE_NAME } from '../../lib/triage.ts';
import { triageOf, useTriage } from '../triage/store.ts';

const useNote = create<{ n: NoteData; set: (p: Partial<NoteData>) => void; clear: () => void }>()(
  persist(
    (set) => ({
      n: EMPTY_NOTE,
      set: (p) => set((s) => ({ n: { ...s.n, ...p } })),
      // Your own name stays for the next patient.
      clear: () => set((s) => ({ n: { ...EMPTY_NOTE, seenBy: s.n.seenBy } })),
    }),
    // Version 2: the hospital's case-sheet format.
    { name: 'ed-note', version: 2, storage: safeStorage },
  ),
);

type Text = (k: keyof NoteData) => { value: string; onChange: (v: string) => void };

export function NoteScreen() {
  const { n, set, clear } = useNote();
  const text = buildNote(n);
  const t: Text = (k) => ({ value: n[k] as string, onChange: (v: string) => set({ [k]: v }) });

  return (
    <>
      <ToolHeader title="Case-sheet note">
        <ConfirmButton label="New note" confirmLabel="Tap to clear" onConfirm={clear} />
      </ToolHeader>
      <main className="px-safe mx-auto max-w-3xl pb-8">
        <p className="mt-3 text-sm text-muted">
          The manual's standard format for the ED case sheet.{' '}
          <Link to="/p/hp-how-to-use-this-manual" className="text-accent underline">
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

        <SectionTitle>Front sheet</SectionTitle>
        <p className="mb-2 text-sm text-muted">Name, UHID and contact number go on the case sheet itself; they are not stored here.</p>
        <div className="grid grid-cols-2 gap-3">
          <NumberField label="Age" unit="y" {...t('age')} />
          <div>
            <span className="text-sm font-bold text-muted">Sex</span>
            <div className="mt-0.5">
              <Segmented
                label="Sex"
                options={(['M', 'F', 'Other'] as const).map((v) => ({ value: v, label: v }))}
                value={n.sex || null}
                onChange={(sex) => set({ sex })}
              />
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-end gap-2">
          <TimeField label="Time of arrival" value={n.arrivedAt} onChange={(arrivedAt) => set({ arrivedAt })} />
        </div>
        <div className="mt-3">
          <span className="text-sm font-bold text-muted">Mode of arrival</span>
          <div className="mt-0.5 grid grid-cols-2 gap-1.5">
            {ARRIVAL_MODES.map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={n.arrivalMode === m}
                onClick={() => set({ arrivalMode: n.arrivalMode === m ? '' : m })}
                className={'min-h-12 rounded-xl border-2 px-2 font-bold ' + (n.arrivalMode === m ? 'border-accent bg-accent text-accent-ink' : 'border-line bg-surface')}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-3 space-y-3">
          <TextField label="MLC number (where applicable)" {...t('mlcNumber')} />
          <TextField multiline label="Known co-morbid illness (malignancy: site, stage, last chemotherapy date and regimen)" {...t('comorbid')} />
          <TextField multiline label="Current medications (antiplatelets, anticoagulants, insulin, steroids, immunosuppressants, chemotherapy)" {...t('medications')} />
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
          <TextField label="Case seen by (your name & designation)" placeholder="Dr ABC, EMO" {...t('seenBy')} />
          <TextField label="Chief complaint (with duration)" {...t('complaint')} />
        </div>

        <PrimarySurvey n={n} set={set} t={t} />

        <SectionTitle>History & examination</SectionTitle>
        <div className="space-y-3">
          <TextField multiline label="Focused history" {...t('history')} />
          <TextField multiline label="Relevant negatives" {...t('negatives')} />
          <TextField multiline label="Focused systemic examination" {...t('systemic')} />
        </div>

        <SectionTitle>Investigations</SectionTitle>
        <TimedRows rows={n.investigations} onChange={(investigations) => set({ investigations })} nameLabel="Investigation" timeLabel="Time sent" addLabel="Add investigation" />
        <div className="mt-3">
          <TextField multiline label="Salient findings — ECG interpretation, ABG values, RBS, POCUS findings" {...t('findings')} />
        </div>

        <SectionTitle>Consultations</SectionTitle>
        <ConsultRows rows={n.consults} onChange={(consults) => set({ consults })} />

        <SectionTitle>Treatment</SectionTitle>
        <p className="mb-2 text-sm text-muted">Number each drug: name, formulation, dose, route, and the time given.</p>
        <TimedRows
          rows={n.treatment}
          onChange={(treatment) => set({ treatment })}
          nameLabel="Inj. Paracetamol 1 g IV"
          timeLabel="Time given"
          addLabel="Add drug"
          numbered
        />
        <div className="mt-3 space-y-3">
          <TextField multiline label="Procedures — NG tube, Foley's, catheter size, cannula gauge, intubation (tube size, grade of view, confirmation)" {...t('procedures')} />
          <TextField multiline label="Blood products, consent taken, counselling done and by whom" {...t('bloodConsent')} />
        </div>

        <SectionTitle>Disposition</SectionTitle>
        <div className="grid grid-cols-2 gap-1.5">
          {DISPOSITIONS.map((d) => (
            <button
              key={d}
              type="button"
              aria-pressed={n.disposition === d}
              onClick={() => set({ disposition: n.disposition === d ? '' : d })}
              className={'min-h-12 rounded-xl border-2 px-2 font-bold ' + (n.disposition === d ? 'border-accent bg-accent text-accent-ink' : 'border-line bg-surface')}
            >
              {d}
            </button>
          ))}
        </div>
        <div className="mt-3">
          <TextField label="Details (zone, consultant, advice, reason for referral, LAMA signature)" {...t('dispositionDetail')} />
        </div>

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

function PrimarySurvey({ n, set, t }: { n: NoteData; set: (p: Partial<NoteData>) => void; t: Text }) {
  const tri = useTriage();
  const hasTriage = Object.values(tri.fields).some((v) => v?.trim());
  const si = noteShockIndex(n);
  const doImport = () => {
    const f = tri.fields;
    const next = importVitals(n, {
      rr: num(f.rr),
      spo2: num(f.spo2),
      onOxygen: tri.onOxygen,
      hr: num(f.hr),
      sbp: num(f.sbp),
      dbp: num(f.dbp),
      gcs: num(f.gcs),
      rbs: num(f.rbs),
      temp: num(f.temp),
      tempUnit: tri.tempUnit,
    });
    // Disposition follows the triage zone, unless one is already written.
    const zone = triageOf(tri).zone;
    const shift = !n.disposition && !n.dispositionDetail && zone ? { disposition: 'Shifted to' as const, dispositionDetail: ZONE_NAME[zone] } : {};
    set({ ...next, ...shift });
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
        <TextField label="Intervention done" {...t('airwayIntervention')} />
      </div>

      <h3 className="mt-4 mb-1 font-bold">B — Breathing</h3>
      <div className="grid grid-cols-2 gap-3">
        <NumberField label="RR" unit="/min" {...t('rr')} />
        <NumberField label="SpO₂" unit="%" {...t('spo2')} />
      </div>
      <div className="mt-2 space-y-2">
        <TextField label="FiO₂ / device" placeholder="room air" {...t('oxygen')} />
        <TextField label="Bilateral air entry" placeholder="equal" {...t('airEntry')} />
        <TextField label="Added sounds" {...t('addedSounds')} />
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
      <p className="mt-2 rounded-xl bg-surface-2 px-3 py-2">
        Shock index: <strong>{si === undefined ? '—' : si.toFixed(2)}</strong>
      </p>
      <div className="mt-2 grid grid-cols-2 gap-3">
        <TextField label="Capillary refill" placeholder="<2 s" {...t('crt')} />
        <TextField label="Peripheral perfusion" {...t('perfusion')} />
      </div>

      <h3 className="mt-4 mb-1 font-bold">D — Disability</h3>
      <div className="grid grid-cols-3 gap-3">
        <NumberField label="GCS E" {...t('gcsE')} />
        <NumberField label="V" {...t('gcsV')} />
        <NumberField label="M" {...t('gcsM')} />
      </div>
      {n.gcsTotal && !(n.gcsE || n.gcsV || n.gcsM) && <p className="mt-1 text-sm text-muted">GCS {n.gcsTotal} from triage; record E, V and M.</p>}
      <div className="mt-2 space-y-2">
        <TextField label="Pupil size and reaction" {...t('pupils')} />
        <TextField label="Focal deficit" {...t('focalDeficit')} />
        <TextField label="Plantars" {...t('plantars')} />
        <NumberField label="RBS" unit="mg/dL" {...t('rbs')} />
      </div>

      <h3 className="mt-4 mb-1 font-bold">E — Exposure</h3>
      <div className="grid grid-cols-2 items-end gap-3">
        <NumberField label="Temperature" unit={`°${n.tempUnit}`} {...t('temp')} />
        <Segmented
          label="Temperature unit"
          options={[
            { value: 'F' as const, label: '°F' },
            { value: 'C' as const, label: '°C' },
          ]}
          value={n.tempUnit}
          onChange={(tempUnit) => set({ tempUnit })}
        />
      </div>
      <div className="mt-2">
        <TextField multiline label="Head-to-toe findings, rash, injuries, log roll findings" {...t('exposure')} />
      </div>
    </>
  );
}

function TimeField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <>
      <label className="block min-w-0 flex-1">
        <span className="text-sm font-bold text-muted">{label}</span>
        <input
          type="time"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-0.5 min-h-13 w-full rounded-xl border-2 border-line bg-surface px-3 text-lg"
        />
      </label>
      <NowButton onClick={() => onChange(hhmm())} />
    </>
  );
}

function TimedRows({
  rows,
  onChange,
  nameLabel,
  timeLabel,
  addLabel,
  numbered,
}: {
  rows: Timed[];
  onChange: (rows: Timed[]) => void;
  nameLabel: string;
  timeLabel: string;
  addLabel: string;
  numbered?: boolean;
}) {
  const update = (i: number, p: Partial<Timed>) => onChange(rows.map((r, j) => (j === i ? { ...r, ...p } : r)));
  return (
    <>
      <ul className="space-y-3">
        {rows.map((r, i) => (
          <li key={i} className="rounded-xl border border-line bg-surface p-2">
            <div className="flex items-center gap-2">
              {numbered && <span className="w-7 shrink-0 text-right font-bold">{i + 1})</span>}
              <input
                value={r.name}
                aria-label={numbered ? `Treatment ${i + 1}` : nameLabel}
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

function ConsultRows({ rows, onChange }: { rows: Consult[]; onChange: (rows: Consult[]) => void }) {
  const update = (i: number, p: Partial<Consult>) => onChange(rows.map((r, j) => (j === i ? { ...r, ...p } : r)));
  return (
    <>
      <ul className="space-y-3">
        {rows.map((r, i) => (
          <li key={i} className="space-y-2 rounded-xl border border-line bg-surface p-2">
            <div className="flex items-center gap-2">
              <input
                value={r.name}
                aria-label="Consultant"
                placeholder="Name of consultant"
                onChange={(e) => update(i, { name: e.target.value })}
                className="min-h-13 min-w-0 flex-1 rounded-lg border-2 border-line bg-canvas px-3 text-lg"
              />
              <RemoveButton label={`Remove ${r.name || 'consultation'}`} onClick={() => onChange(rows.filter((_, j) => j !== i))} />
            </div>
            {(['informed', 'seen'] as const).map((k) => (
              <div key={k} className="flex items-center gap-2">
                <span className="w-20 shrink-0 text-sm font-bold text-muted">Time {k}</span>
                <input
                  type="time"
                  value={r[k]}
                  aria-label={`Time ${k}`}
                  onChange={(e) => update(i, { [k]: e.target.value })}
                  className="min-h-12 min-w-0 flex-1 rounded-lg border-2 border-line bg-canvas px-3 text-lg"
                />
                <NowButton onClick={() => update(i, { [k]: hhmm() })} />
              </div>
            ))}
            <input
              value={r.advice}
              aria-label="Advice received"
              placeholder="Advice received"
              onChange={(e) => update(i, { advice: e.target.value })}
              className="min-h-13 w-full rounded-lg border-2 border-line bg-canvas px-3 text-lg"
            />
          </li>
        ))}
      </ul>
      <AddButton onClick={() => onChange([...rows, { name: '', informed: hhmm(), seen: '', advice: '' }])}>Add consultation</AddButton>
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
