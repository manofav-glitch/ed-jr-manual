import { describe, expect, it } from 'vitest';
import { EMPTY_NOTE, buildNote, formatWhen, importVitals, nowLocal, type NoteData } from '../../src/lib/note.ts';

const note = (n: Partial<NoteData>) => buildNote({ ...EMPTY_NOTE, ...n });

describe('case-sheet note (chapter 2 format)', () => {
  it('is empty for an empty form', () => {
    expect(note({})).toBe('');
  });

  it('prints drug allergies in CAPITALS at the top', () => {
    const text = note({ allergies: 'penicillin, sulfa', complaint: 'Chest pain 2 h' });
    expect(text.split('\n')[0]).toBe('DRUG ALLERGY: PENICILLIN, SULFA');
  });

  it('can record no known drug allergies', () => {
    expect(note({ noKnownAllergies: true })).toBe('NO KNOWN DRUG ALLERGIES');
    // A written allergy wins over the tick box.
    expect(note({ noKnownAllergies: true, allergies: 'aspirin' })).toBe('DRUG ALLERGY: ASPIRIN');
  });

  it('records date, time and who saw the case', () => {
    const text = note({ examinedAt: '2026-11-02T03:12', seenBy: 'Dr ABC, JR' });
    expect(text).toBe('Date & time examined: 02/11/2026 03:12\nCase seen by Dr ABC, JR');
  });

  it('writes the primary survey as A to E, leaving out what was not recorded', () => {
    const text = note({
      airway: 'Patent',
      rr: '22',
      spo2: '95',
      oxygen: 'room air',
      airEntry: 'equal',
      pulse: '110',
      pulseRhythm: 'regular',
      bp: '130/80',
      gcsE: '4',
      gcsV: '5',
      gcsM: '6',
      pupils: 'pupils NSRL',
      temp: '37.2',
    });
    expect(text).toBe(
      [
        'PRIMARY SURVEY',
        'A: Patent',
        'B: RR 22/min, SpO₂ 95% on room air, B/L air entry equal',
        'C: PR 110/min regular, BP 130/80 mmHg',
        'D: GCS E4V5M6 (15/15), pupils NSRL',
        'E: Temp 37.2 °C',
      ].join('\n'),
    );
  });

  it('shows a partial GCS without a wrong total', () => {
    expect(note({ gcsE: '3', gcsM: '5' })).toContain('D: GCS E3V?M5');
    expect(note({ gcsE: '3', gcsM: '5' })).not.toContain('/15');
    expect(note({ gcsTotal: '14' })).toContain('D: GCS 14/15');
  });

  it('lists investigations with the time sent', () => {
    const text = note({
      investigations: [
        { name: 'CBC, RFT', time: '03:20' },
        { name: 'ECG', time: '' },
        { name: ' ', time: '03:30' },
      ],
      findings: 'ECG: sinus tachycardia',
      rbs: '140',
    });
    expect(text).toBe(['POC INVESTIGATIONS', '- CBC, RFT — sent 03:20', '- ECG', 'Findings: ECG: sinus tachycardia', 'RBS: 140 mg/dL'].join('\n'));
  });

  it('numbers the treatment lines, skipping blanks', () => {
    const text = note({ treatment: ['Inj. Paracetamol 1 g i.v. stat', '', 'Inj. Ondansetron 4 mg i.v.'], interventions: "Foley's catheter" });
    expect(text).toBe(
      ['TREATMENT', '1) Inj. Paracetamol 1 g i.v. stat', '2) Inj. Ondansetron 4 mg i.v.', "Other interventions: Foley's catheter"].join('\n'),
    );
  });

  it('records disposition, handover and consults with time informed', () => {
    const text = note({ shiftTo: 'Red area', handover: 'to Dr XYZ', consults: [{ name: 'SR Neurology', time: '03:40' }] });
    expect(text).toBe(['DISPOSITION', 'Shift to Red area', 'Handover: to Dr XYZ', 'Consult: SR Neurology — informed at 03:40'].join('\n'));
  });

  it('separates sections with one blank line', () => {
    const text = note({ complaint: 'Fever 3 days', airway: 'Patent', treatment: ['Tab PCM 650 mg PO'] });
    expect(text).toBe(['Chief complaint: Fever 3 days', '', 'PRIMARY SURVEY', 'A: Patent', '', 'TREATMENT', '1) Tab PCM 650 mg PO'].join('\n'));
  });
});

describe('import from triage', () => {
  it('fills RR, SpO₂, pulse, BP, GCS and temperature', () => {
    const n = importVitals(EMPTY_NOTE, { rr: 22, spo2: 95, hr: 130, sbp: 140, dbp: 85, gcs: 15, temp: 101.2, tempUnit: 'F' });
    expect([n.rr, n.spo2, n.pulse, n.bp, n.gcsTotal, n.temp, n.tempUnit]).toEqual(['22', '95', '130', '140/85', '15', '101.2', 'F']);
  });

  it('keeps what the note already had where triage has nothing', () => {
    const n = importVitals({ ...EMPTY_NOTE, rr: '18', bp: '120/80' }, { spo2: 97, tempUnit: 'C' });
    expect([n.rr, n.spo2, n.bp]).toEqual(['18', '97', '120/80']);
  });
});

describe('times', () => {
  it('formats local date-times', () => {
    expect(formatWhen('2026-11-02T03:12')).toBe('02/11/2026 03:12');
    expect(formatWhen('')).toBe('');
    expect(nowLocal(new Date(2026, 10, 2, 3, 7))).toBe('2026-11-02T03:07');
  });
});
