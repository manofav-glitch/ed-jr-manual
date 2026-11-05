import { describe, expect, it } from 'vitest';
import { EMPTY_NOTE, buildNote, formatWhen, importVitals, noteShockIndex, nowLocal, type NoteData } from '../../src/lib/note.ts';
import { manual } from '../../src/lib/manual.ts';
import { listIn } from '../../src/lib/quote.ts';

const note = (n: Partial<NoteData>) => buildNote({ ...EMPTY_NOTE, ...n });

describe('case-sheet note: the manual\'s standard format', () => {
  it('follows the documentation guide headings', () => {
    const doc = 'hp-how-to-use-this-manual';
    expect(listIn(manual, doc, 'Front sheet').map((i) => i.text)).toContain('Known drug allergies written in CAPITALS on the front sheet');
    expect(listIn(manual, doc, 'Primary survey').map((i) => i.text)[3]).toBe('D – Disability: GCS E_V_M_, pupil size and reaction, focal deficit, plantars, RBS');
    expect(listIn(manual, doc, 'Investigations, consults').map((i) => i.text)).toContain(
      'Consultation: name of consultant, time informed, time seen, advice received',
    );
  });

  it('is empty for an empty form', () => {
    expect(note({})).toBe('');
  });

  it('prints drug allergies in CAPITALS at the top', () => {
    expect(note({ allergies: 'penicillin, sulfa', complaint: 'Chest pain 2 h' }).split('\n')[0]).toBe('DRUG ALLERGY: PENICILLIN, SULFA');
    expect(note({ noKnownAllergies: true })).toBe('NO KNOWN DRUG ALLERGIES');
    expect(note({ noKnownAllergies: true, allergies: 'aspirin' })).toBe('DRUG ALLERGY: ASPIRIN');
  });

  it('records the front sheet: when, who, age/sex, arrival, MLC', () => {
    const text = note({
      examinedAt: '2026-11-02T03:12',
      seenBy: 'Dr ABC, EMO',
      age: '45',
      sex: 'M',
      arrivedAt: '03:05',
      arrivalMode: 'ambulance',
      mlcNumber: '1234',
    });
    expect(text).toBe(
      ['Date & time examined: 02/11/2026 03:12', 'Case seen by Dr ABC, EMO', 'Age/Sex: 45/M · Arrived 03:05 (ambulance) · MLC No. 1234'].join('\n'),
    );
  });

  it('writes the primary survey A to E, with shock index and GCS as E_V_M_ = total', () => {
    const text = note({
      airway: 'Patent',
      rr: '22',
      spo2: '95',
      oxygen: 'room air',
      airEntry: 'equal',
      addedSounds: 'basal crepitations',
      pulse: '110',
      pulseRhythm: 'regular',
      bp: '130/80',
      gcsE: '4',
      gcsV: '5',
      gcsM: '6',
      plantars: 'flexor',
      rbs: '140',
      temp: '99.2',
    });
    expect(text).toBe(
      [
        'PRIMARY SURVEY',
        'A: Patent',
        'B: RR 22/min, SpO₂ 95% on room air, B/L air entry equal, added sounds: basal crepitations',
        'C: PR 110/min regular, BP 130/80 mmHg, shock index 0.85',
        'D: GCS E4V5M6 = 15, plantars flexor, RBS 140 mg/dL',
        'E: Temp 99.2 °F',
      ].join('\n'),
    );
  });

  it('never writes GCS as a bare number', () => {
    expect(note({ gcsE: '3', gcsM: '5' })).toContain('D: GCS E3V_M5');
    expect(note({ gcsE: '3', gcsM: '5' })).not.toContain('=');
    expect(note({ gcsTotal: '14' })).toContain('D: GCS 14 (E, V, M not recorded)');
  });

  it('lists investigations with the time sent, and consultations with times and advice', () => {
    const text = note({
      investigations: [
        { name: 'CBC, RFT', time: '03:20' },
        { name: ' ', time: '03:30' },
      ],
      findings: 'ECG: sinus tachycardia',
      consults: [{ name: 'Dr X, Cardiology', informed: '03:30', seen: '03:50', advice: 'admit CCU' }],
    });
    expect(text).toBe(
      [
        'INVESTIGATIONS',
        '- CBC, RFT — sent 03:20',
        'Findings: ECG: sinus tachycardia',
        '',
        'CONSULTATIONS',
        '- Dr X, Cardiology — informed 03:30 — seen 03:50 — advice: admit CCU',
      ].join('\n'),
    );
  });

  it('numbers the treatment with the time given, then procedures and consent', () => {
    const text = note({
      treatment: [
        { name: 'Inj. Paracetamol 1 g IV', time: '03:15' },
        { name: '', time: '03:16' },
        { name: 'Inj. Ondansetron 4 mg IV', time: '' },
      ],
      procedures: '18G cannula left forearm',
      bloodConsent: 'consent taken from wife',
    });
    expect(text).toBe(
      [
        'TREATMENT',
        '1) Inj. Paracetamol 1 g IV — 03:15',
        '2) Inj. Ondansetron 4 mg IV',
        'Procedures: 18G cannula left forearm',
        'Blood products / consent / counselling: consent taken from wife',
      ].join('\n'),
    );
  });

  it('records the disposition', () => {
    expect(note({ disposition: 'Shifted to', dispositionDetail: 'Red bed' })).toBe('DISPOSITION\nShifted to Red bed');
    expect(note({ disposition: 'LAMA', dispositionDetail: 'signature taken' })).toBe('DISPOSITION\nLAMA signature taken');
  });
});

describe('import from triage and shock index', () => {
  it('fills RR, SpO₂ (on oxygen), pulse, BP, GCS, RBS and temperature', () => {
    const n = importVitals(EMPTY_NOTE, { rr: 22, spo2: 95, onOxygen: true, hr: 130, sbp: 140, dbp: 85, gcs: 15, rbs: 90, temp: 101.2, tempUnit: 'F' });
    expect([n.rr, n.spo2, n.oxygen, n.pulse, n.bp, n.gcsTotal, n.rbs, n.temp, n.tempUnit]).toEqual(['22', '95', 'oxygen', '130', '140/85', '15', '90', '101.2', 'F']);
  });

  it('keeps what the note already had', () => {
    const n = importVitals({ ...EMPTY_NOTE, rr: '18', bp: '120/80', oxygen: '4 L/min nasal prongs' }, { spo2: 97, onOxygen: true, tempUnit: 'C' });
    expect([n.rr, n.spo2, n.bp, n.oxygen]).toEqual(['18', '97', '120/80', '4 L/min nasal prongs']);
  });

  it('works out the shock index from pulse and BP', () => {
    expect(noteShockIndex({ ...EMPTY_NOTE, pulse: '120', bp: '100/60' })).toBeCloseTo(1.2);
    expect(noteShockIndex({ ...EMPTY_NOTE, pulse: '120' })).toBeUndefined();
  });

  it('formats local date-times', () => {
    expect(formatWhen('2026-11-02T03:12')).toBe('02/11/2026 03:12');
    expect(nowLocal(new Date(2026, 10, 2, 3, 7))).toBe('2026-11-02T03:07');
  });
});
