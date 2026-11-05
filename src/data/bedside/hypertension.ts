import type { BedsideTopic } from '../bedsideTypes.ts';

export const hypertension: BedsideTopic = {
  id: 'hypertension',
  title: 'High blood pressure',
  flowcharts: ['18.2'],
  reviewed: false,
  history: [
    {
      heading: 'Is there damage now? (complications)',
      refs: [{ chapter: 7, pages: '125', label: 'Complications of hypertension' }],
      points: [
        { text: 'Chest pain, especially tearing or going to the back', urgent: true, hint: 'Dissection, ischaemia' },
        { text: 'Breathless, orthopnoea, PND', urgent: true, hint: 'Left ventricular failure' },
        { text: 'Weakness, numbness, speech or face changes', urgent: true, hint: 'Stroke' },
        { text: 'Blurred vision, headache, confusion, fits', urgent: true, hint: 'Malignant hypertension' },
        { text: 'Less urine, blood in the urine, ankle swelling', urgent: true, hint: 'Kidney damage' },
        { text: 'Pregnant or recently delivered?', urgent: true, hint: 'Toxaemia of pregnancy' },
      ],
    },
    {
      heading: 'The blood pressure',
      refs: [{ chapter: 4, pages: '70', label: 'Questions box 4.5' }],
      points: [
        { text: 'When was it first found high? Readings at home?' },
        { text: 'Tablets now and before: which, side effects, missed or stopped doses?' },
        { text: 'Salt and salty processed food' },
        { text: 'Weight gain' },
        { text: 'Alcohol: how much?' },
        { text: 'Exercise' },
      ],
    },
    {
      heading: 'Drugs that raise BP',
      refs: [
        { chapter: 4, pages: '70', label: 'Questions box 4.5' },
        { chapter: 7, pages: '125' },
      ],
      points: [
        { text: 'NSAIDs, steroids' },
        { text: 'Oral contraceptive pill' },
        { text: 'Cocaine, amphetamines' },
      ],
    },
    {
      heading: 'Clues to a secondary cause',
      refs: [{ chapter: 7, pages: '124–125', label: 'Causes of systemic hypertension' }],
      points: [
        { text: 'Kidney disease, diabetes, polycystic kidneys in the family' },
        { text: 'Episodes of headache, sweating and palpitations', hint: 'Phaeochromocytoma', extra: true },
        { text: 'Weight gain round the middle, easy bruising', hint: 'Cushing’s', extra: true },
        { text: 'Weakness or cramps (low potassium)', hint: 'Conn’s', extra: true },
        { text: 'Heat or cold intolerance, weight change', hint: 'Thyroid', extra: true },
        { text: 'Loud snoring, daytime sleepiness', hint: 'Sleep apnoea' },
        { text: 'High BP found before age 30', hint: 'Coarctation, kidney cause' },
      ],
    },
    {
      heading: 'Cardiovascular risk',
      refs: [{ chapter: 4, pages: '68–69', label: 'Questions box 4.4' }],
      points: [
        { text: 'Angina or heart attack, stroke, claudication' },
        { text: 'Diabetes, cholesterol, smoking' },
        { text: 'Family history of heart disease before 60' },
      ],
    },
  ],
  exam: [
    {
      heading: 'Blood pressure, properly',
      refs: [
        { chapter: 5, pages: '84–88' },
        { chapter: 7, pages: '124' },
      ],
      points: [
        { text: 'Right-sized cuff; repeat after rest' },
        { text: 'Lying and standing' },
        { text: 'Both arms', hint: 'Different by 20 mmHg: think dissection' },
      ],
    },
    {
      heading: 'General inspection',
      refs: [{ chapter: 7, pages: '124' }],
      points: [
        { text: 'Cushingoid features, acromegaly, plethora (polycythaemia)' },
        { text: 'Signs of chronic kidney disease (sallow, uraemic)' },
      ],
    },
    {
      heading: 'Pulses',
      refs: [{ chapter: 7, pages: '124' }],
      points: [
        { text: 'Radio-femoral delay', hint: 'Coarctation' },
        { text: 'BP in the legs if coarctation is possible or severe hypertension before 30' },
        { text: 'Carotid bruits' },
      ],
    },
    {
      heading: 'Fundi',
      refs: [{ chapter: 7, pages: '124–125', label: 'Figs 7.4, 7.5' }],
      points: [
        { text: 'Grade 1: silver wiring of the arteries' },
        { text: 'Grade 2: plus arteriovenous nipping' },
        { text: 'Grade 3: plus flame haemorrhages and exudates', urgent: true, hint: 'Malignant hypertension' },
        { text: 'Grade 4: plus papilloedema', urgent: true, hint: 'Malignant hypertension' },
        { text: 'Describe what you see, not just the grade' },
      ],
    },
    {
      heading: 'Heart',
      refs: [{ chapter: 7, pages: '125' }],
      points: [
        { text: 'Apex beat: sustained, not displaced (pressure-loaded)' },
        { text: 'S4 (common if BP above 180/110)' },
        { text: 'Signs of left ventricular failure: crackles, S3, raised JVP' },
        { text: 'Murmur of aortic regurgitation (dissection)' },
      ],
    },
    {
      heading: 'Abdomen, nervous system, urine',
      refs: [{ chapter: 7, pages: '125' }],
      points: [
        { text: 'Kidney or adrenal masses; enlarged polycystic kidneys' },
        { text: 'Aortic aneurysm' },
        { text: 'Renal bruit (loud, in systole and diastole, in the epigastrium)' },
        { text: 'Signs of stroke, old or new' },
        { text: 'Urine dipstick: blood and protein' },
      ],
    },
  ],
  differentials: [
    {
      heading: 'Emergencies with high BP',
      items: [
        {
          name: 'Malignant (accelerated) hypertension',
          urgent: true,
          for: ['Flame haemorrhages, cotton-wool spots or papilloedema (grade 3 or 4 retina)', 'Headache, blurred vision, confusion'],
          refs: [{ chapter: 7, pages: '125' }],
        },
        {
          name: 'Aortic dissection',
          urgent: true,
          for: ['Tearing chest or back pain', 'Pulse or BP different between the arms; aortic regurgitation'],
          refs: [{ chapter: 7, pages: '122, 125' }],
        },
        {
          name: 'Left ventricular failure or acute coronary syndrome',
          urgent: true,
          for: ['Breathless, crackles, S3', 'Chest pain, ECG changes'],
          refs: [{ chapter: 7, pages: '119–121, 125' }],
        },
        {
          name: 'Stroke or intracranial bleed',
          urgent: true,
          for: ['New focal signs, reduced consciousness', 'Raised intracranial pressure can itself raise the BP'],
          refs: [{ chapter: 7, pages: '125' }],
        },
        {
          name: 'Toxaemia of pregnancy (pre-eclampsia)',
          urgent: true,
          for: ['Pregnant (or just delivered), protein in urine, oedema, headache, fits'],
          refs: [{ chapter: 7, pages: '125' }],
        },
        {
          name: 'Kidney injury',
          urgent: true,
          for: ['Less urine, blood and protein on dipstick'],
          refs: [{ chapter: 7, pages: '125' }],
        },
        {
          name: 'Drugs: cocaine, amphetamines',
          urgent: true,
          for: ['Use of cocaine or amphetamines'],
          refs: [{ chapter: 7, pages: '125' }],
        },
      ],
    },
    {
      heading: 'Cause of the hypertension',
      items: [
        {
          name: 'Essential hypertension (more than 95%)',
          for: ['Salt, alcohol, obesity, little exercise, family history', 'No features of a secondary cause'],
          refs: [
            { chapter: 7, pages: '125' },
            { chapter: 4, pages: '70–71', label: 'Questions box 4.5' },
          ],
        },
        {
          name: 'Missed or stopped tablets, NSAIDs, steroids',
          for: ['Drug history'],
          refs: [{ chapter: 4, pages: '70–71', label: 'Questions box 4.5' }],
        },
        {
          name: 'Kidney disease (renal artery stenosis, glomerulonephritis, polycystic, diabetic)',
          for: ['Abnormal urine, kidney masses, renal bruit'],
          refs: [{ chapter: 7, pages: '125' }],
        },
        {
          name: 'Endocrine (Cushing’s, Conn’s, phaeochromocytoma, thyroid, acromegaly)',
          for: ['Typical features on inspection or history'],
          refs: [{ chapter: 7, pages: '124–125' }],
        },
        {
          name: 'Coarctation of the aorta',
          for: ['Young; radio-femoral delay; lower BP in the legs'],
          refs: [{ chapter: 7, pages: '124–125' }],
        },
      ],
    },
  ],
  plan: [
    {
      heading: 'Extend the examination',
      refs: [{ chapter: 7, pages: '124–125' }],
      points: [
        { text: 'Repeat BP after rest, with the right cuff; both arms' },
        { text: 'Urine dipstick' },
        { text: 'ECG (left ventricular hypertrophy, ischaemia)' },
        { text: 'Fundoscopy recorded' },
      ],
    },
    {
      heading: 'Decide',
      refs: [{ chapter: 7, pages: '125' }],
      points: [
        { text: 'Grade 3 or 4 retinal changes: malignant hypertension, admit for urgent treatment', urgent: true },
        { text: 'Any other end-organ damage now (heart, brain, kidney, aorta, pregnancy)? Treat that emergency', urgent: true },
        { text: 'No damage: high BP alone; look for the cause and risk factors' },
        { text: 'Then follow the hospital’s hypertension flowchart and checklist below' },
      ],
    },
  ],
};
