import type { BedsideTopic } from '../bedsideTypes.ts';
import { FIRST_LOOK, RESP_EXAM } from './shared.ts';

export const haemoptysis: BedsideTopic = {
  id: 'haemoptysis',
  title: 'Coughing blood (haemoptysis)',
  flowcharts: ['1.3'],
  reviewed: false,
  history: [
    FIRST_LOOK,
    {
      heading: 'Is it really from the lungs?',
      refs: [{ chapter: 9, pages: '165–166', label: 'Table 9.3' }],
      points: [
        { text: 'Coughed up straight after coughing, mixed with sputum', hint: 'Haemoptysis' },
        { text: 'Came after nausea or retching, mixed with vomit', hint: 'Haematemesis' },
        { text: 'Blood just appears in the mouth; nosebleed', hint: 'Nasopharyngeal bleeding' },
      ],
    },
    {
      heading: 'How much, and for how long',
      refs: [{ chapter: 9, pages: '165' }],
      points: [
        { text: 'Streaks in sputum, or frank blood? Estimate in cups or spoonfuls' },
        { text: 'More than about 250 mL in 24 hours?', urgent: true, hint: 'Massive haemoptysis: an emergency' },
        { text: 'First time, or recurrent? Getting worse?' },
        { text: 'Breathless or dizzy with it?', urgent: true },
      ],
    },
    {
      heading: 'Clues to the cause',
      refs: [
        { chapter: 9, pages: '163–165', label: 'Questions box 9.1, Table 9.2' },
      ],
      points: [
        { text: 'Cough: how long, and has it changed?', hint: 'A new change in a chronic cough: infection or cancer' },
        { text: 'Sputum: large volumes of pus every day', hint: 'Bronchiectasis' },
        { text: 'Fever, short history, breathlessness', hint: 'Pneumonia' },
        { text: 'Weight loss, night sweats, malaise', urgent: true, hint: 'TB, cancer' },
        { text: 'Hoarse voice', urgent: true, hint: 'Lung cancer' },
        { text: 'Sudden pleuritic pain and breathlessness', urgent: true, hint: 'Pulmonary infarction (PE)' },
        { text: 'Choking or inhalation episode', hint: 'Foreign body' },
        { text: 'Blood in the urine, sinus trouble, rash, joint pain', hint: 'Vasculitis, anti-GBM disease, lupus' },
        { text: 'Orthopnoea, PND, known valve disease', hint: 'Mitral stenosis, left ventricular failure' },
        { text: 'Easy bruising, bleeding elsewhere', hint: 'Bleeding disorder' },
      ],
    },
    {
      heading: 'Past, drugs, social and family',
      refs: [
        { chapter: 9, pages: '171–173' },
        { chapter: 9, pages: '173', label: 'T&O’C essentials' },
      ],
      points: [
        { text: 'Smoking: pack-years', urgent: true, hint: 'Haemoptysis in a smoker: rule out lung cancer' },
        { text: 'Previous TB, TB contact, HIV' },
        { text: 'Previous lung disease, chest X-rays, bronchoscopy' },
        { text: 'Anticoagulants, antiplatelets' },
        { text: 'Occupation: asbestos, dusts' },
        { text: 'Family: TB, lung cancer' },
      ],
    },
  ],
  exam: [
    {
      heading: 'First',
      refs: [
        { chapter: 11, pages: '190' },
        { chapter: 12, pages: '201', label: 'Text box 12.1' },
      ],
      points: [
        { text: 'Respiratory rate, SpO₂, pulse, BP: is the patient losing a lot of blood or failing to oxygenate?', urgent: true },
        { text: 'Look at what has been coughed up (sputum mug)' },
        { text: 'Look in the nose and mouth for a bleeding source' },
      ],
    },
    ...RESP_EXAM,
    {
      heading: 'Look specifically for',
      refs: [
        { chapter: 11, pages: '194, 197–198' },
        { chapter: 7, pages: '126–128' },
      ],
      points: [
        { text: 'Clubbing', hint: 'Lung cancer, bronchiectasis' },
        { text: 'Cachexia, supraclavicular or cervical nodes, Horner’s syndrome, hoarseness', hint: 'Lung cancer' },
        { text: 'Coarse crackles over one area', hint: 'Bronchiectasis' },
        { text: 'Pleural rub; signs of DVT', hint: 'Pulmonary infarction' },
        { text: 'Malar flush, tapping apex, mid-diastolic murmur', hint: 'Mitral stenosis' },
        { text: 'Saddle nose, rash, urine dipstick for blood', hint: 'Vasculitis' },
        { text: 'Bruises, petechiae' },
      ],
    },
  ],
  differentials: [
    {
      heading: 'Most common (about 80%)',
      items: [
        {
          name: 'Bronchitis',
          for: ['Small amounts of blood with sputum', 'Acute cough, often a smoker'],
          refs: [{ chapter: 9, pages: '165', label: 'Table 9.2' }],
        },
        {
          name: 'Lung cancer',
          urgent: true,
          for: ['Frank blood', 'Smoker; hoarseness, weight loss', 'Clubbing, nodes, Horner’s syndrome'],
          refs: [
            { chapter: 9, pages: '165', label: 'Table 9.2' },
            { chapter: 11, pages: '197–198' },
          ],
        },
        {
          name: 'Bronchiectasis',
          for: ['Large daily volumes of purulent sputum with blood', 'Since childhood; coarse crackles, clubbing'],
          refs: [
            { chapter: 9, pages: '165', label: 'Table 9.2' },
            { chapter: 11, pages: '194' },
          ],
        },
        {
          name: 'Pneumonia',
          for: ['Fever, recent onset, breathlessness', 'Signs of consolidation'],
          refs: [{ chapter: 9, pages: '165', label: 'Table 9.2' }],
        },
      ],
    },
    {
      heading: 'Also think of',
      items: [
        {
          name: 'Pulmonary embolism with infarction',
          urgent: true,
          for: ['Pleuritic pain and breathlessness', 'Risk factors; tachycardia; DVT'],
          refs: [
            { chapter: 9, pages: '165', label: 'Table 9.2' },
            { chapter: 11, pages: '199–200' },
          ],
        },
        {
          name: 'Tuberculosis',
          urgent: true,
          for: ['Cough, weight loss, night sweats, malaise', 'Previous TB, contact, HIV'],
          refs: [
            { chapter: 9, pages: '165', label: 'Table 9.2' },
            { chapter: 11, pages: '197' },
          ],
        },
        {
          name: 'Lung abscess',
          for: ['Fever, foul purulent sputum', 'Alcohol, aspiration, injecting drug use'],
          refs: [{ chapter: 9, pages: '165, 172', label: 'Table 9.2' }],
        },
        {
          name: 'Acute left ventricular failure or severe mitral stenosis',
          for: ['Pink frothy secretions; orthopnoea', 'Murmur, raised JVP, crackles'],
          refs: [{ chapter: 9, pages: '165', label: 'Table 9.2' }],
        },
        {
          name: 'Vasculitis (granulomatosis with polyangiitis), anti-GBM disease, lupus',
          for: ['Blood in the urine; sinusitis or saddle nose; multisystem illness'],
          refs: [{ chapter: 9, pages: '165', label: 'Table 9.2' }],
        },
        {
          name: 'Bleeding disorder or anticoagulants',
          for: ['Bleeding elsewhere, bruising', 'Drug history'],
          refs: [{ chapter: 9, pages: '165', label: 'Table 9.2' }],
        },
        {
          name: 'Foreign body',
          for: ['Inhalation history, cough, stridor'],
          refs: [{ chapter: 9, pages: '165', label: 'Table 9.2' }],
        },
        {
          name: 'Bleeding from a small vessel after hard coughing',
          for: ['A bout of severe coughing just before'],
          refs: [{ chapter: 9, pages: '165', label: 'Table 9.2' }],
        },
      ],
    },
    {
      heading: 'Not from the lungs',
      items: [
        {
          name: 'Haematemesis or nose bleed',
          for: ['Followed nausea or retching; or blood appears in the mouth without coughing'],
          refs: [{ chapter: 9, pages: '166', label: 'Table 9.3' }],
        },
      ],
    },
  ],
  plan: [
    {
      heading: 'Extend the examination',
      refs: [
        { chapter: 12, pages: '205–206' },
        { chapter: 9, pages: '165' },
      ],
      points: [
        { text: 'SpO₂; quantify and record the blood seen' },
        { text: 'Chest X-ray, read systematically (mass, cavity, consolidation, collapse)' },
        { text: 'Urine dipstick for blood' },
        { text: 'Sputum for microscopy, culture and AFB if TB is possible', extra: true },
      ],
    },
    {
      heading: 'Decide',
      refs: [
        { chapter: 9, pages: '165' },
        { chapter: 9, pages: '173', label: 'T&O’C essentials' },
      ],
      points: [
        { text: 'Massive (more than about 250 mL a day) or with breathlessness or low SpO₂: emergency', urgent: true },
        { text: 'Haemoptysis must always be investigated; in a smoker, rule out lung cancer' },
        { text: 'TB possible: isolate the patient', extra: true },
        { text: 'Then follow the hospital’s haemoptysis flowchart below' },
      ],
    },
  ],
};
