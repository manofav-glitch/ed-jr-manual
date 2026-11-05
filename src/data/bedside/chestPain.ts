import type { BedsideTopic } from '../bedsideTypes.ts';
import { CVS_EXAM, FIRST_LOOK } from './shared.ts';

export const chestPain: BedsideTopic = {
  id: 'chest-pain',
  title: 'Chest pain',
  flowcharts: ['6.2'],
  reviewed: false,
  history: [
    FIRST_LOOK,
    {
      heading: 'The pain (SOCRATES)',
      refs: [
        { chapter: 1, pages: '7–8' },
        { chapter: 4, pages: '59–63', label: 'Questions box 4.1' },
      ],
      points: [
        { text: 'Ask about “discomfort”, not only “pain”', hint: 'Angina is often a dull ache or heaviness' },
        { text: 'Site: where exactly? Ask them to point. Central or to one side?' },
        { text: 'Onset: sudden (seconds) or building over minutes? At rest or on exertion?' },
        { text: 'Character: tight, heavy, crushing; sharp; tearing; burning' },
        { text: 'Radiation: jaw, arms (left, right or both), back, between the shoulder blades' },
        { text: 'Relief: rest, GTN (how quickly?), sitting forward, antacids, swallowing' },
        { text: 'Timing: how long does each episode last? Continuous?' },
        { text: 'Worse with: exertion, breathing in, coughing, lying flat, moving, pressing on the chest' },
        { text: 'Severity, and is it the worst ever?' },
      ],
    },
    {
      heading: 'Danger questions',
      refs: [
        { chapter: 4, pages: '62', label: 'Questions box 4.1' },
        { chapter: 4, pages: '63' },
      ],
      points: [
        { text: 'Coming on with less effort, or at rest?', urgent: true, hint: 'Unstable angina or acute coronary syndrome' },
        { text: 'Lasting more than 30 minutes?', urgent: true, hint: 'More likely acute coronary syndrome than stable angina' },
        { text: 'Instant onset, worst at the start, tearing, going to the back?', urgent: true, hint: 'Aortic dissection' },
        { text: 'Sudden breathlessness, collapse or blackout with the pain?', urgent: true, hint: 'Massive PE, dissection with tamponade, arrhythmia' },
        { text: 'Sharp one-sided pain with sudden breathlessness?', urgent: true, hint: 'Pneumothorax' },
      ],
    },
    {
      heading: 'With the pain',
      refs: [{ chapter: 4, pages: '62–63', label: 'Good symptoms guide 4.1' }],
      points: [
        { text: 'Sweating, nausea or vomiting, fear of dying', hint: 'Favour infarction' },
        { text: 'Breathlessness, palpitations, faintness' },
        { text: 'Fever, cough, sputum', hint: 'Pneumonia, pleurisy' },
        { text: 'Calf pain or swelling, recent immobility or surgery', hint: 'PE' },
        { text: 'Heartburn, sour taste, pain on swallowing', hint: 'Reflux, oesophageal spasm' },
        { text: 'Anxiety, tingling round the lips or fingers', hint: 'Panic, hyperventilation' },
        { text: 'Rash in a band on one side', hint: 'Herpes zoster (rash can follow the pain)' },
      ],
    },
    {
      heading: 'Risk factors and past history',
      refs: [
        { chapter: 4, pages: '61', label: 'List 4.1' },
        { chapter: 4, pages: '68–70', label: 'Questions box 4.4' },
      ],
      points: [
        { text: 'Angina or heart attack before; is this the same pain?', hint: 'A patient who says “this is my angina” is usually right' },
        { text: 'Previous stents, bypass, angiogram or stress test, and what they showed' },
        { text: 'Diabetes, high BP, cholesterol, kidney disease, rheumatoid arthritis' },
        { text: 'Smoking: pack-years, and when they stopped' },
        { text: 'Family: heart disease in a parent or sibling before 60, sudden deaths' },
        { text: 'Hypertension or a connective tissue disease (Marfan)', hint: 'Raise the risk of dissection' },
        { text: 'Previous DVT or PE, cancer, recent surgery or long travel' },
      ],
    },
    {
      heading: 'Drugs and social',
      refs: [
        { chapter: 4, pages: '70–71' },
        { chapter: 1, pages: '12–18' },
      ],
      points: [
        { text: 'Current medicines and allergies; GTN, aspirin or anticoagulant already taken today' },
        { text: 'Oral contraceptive or hormone therapy', hint: 'PE risk' },
        { text: 'Cocaine or amphetamines', hint: 'Infarction in young people' },
        { text: 'Alcohol' },
        { text: 'Occupation, and how the pain has limited work and daily life' },
      ],
    },
  ],
  exam: [
    ...CVS_EXAM,
    {
      heading: 'Look specifically for',
      refs: [
        { chapter: 7, pages: '121–123' },
        { chapter: 4, pages: '60', label: 'Table 4.2B' },
      ],
      points: [
        { text: 'Radial pulse weaker on one side, or BP 20 mmHg different between arms', urgent: true, hint: 'Dissection' },
        { text: 'Raised JVP, quiet heart sounds, falling BP, pulsus paradoxus', urgent: true, hint: 'Tamponade' },
        { text: 'Hypotension, cyanosis, raised JVP, right ventricular heave', urgent: true, hint: 'Massive PE' },
        { text: 'One side not moving, hyper-resonant, silent; trachea pushed away', urgent: true, hint: 'Tension pneumothorax' },
        { text: 'New murmur of aortic regurgitation, or new apical murmur (mitral regurgitation)' },
        { text: 'Pericardial rub: sit forward, breath held in expiration' },
        { text: 'Basal crackles and S3 (heart failure: Killip class)' },
        { text: 'Raised JVP that rises on inspiration after an inferior infarct', hint: 'Right ventricular infarction' },
        { text: 'Tenderness that reproduces the pain; costal cartilage tenderness' },
        { text: 'Right upper quadrant tenderness', hint: 'Cholecystitis mimicking infarction' },
        { text: 'Focal neurological signs', hint: 'Dissection involving the carotids' },
      ],
    },
  ],
  differentials: [
    {
      heading: 'Can’t miss',
      items: [
        {
          name: 'Acute coronary syndrome (infarction, unstable angina)',
          urgent: true,
          for: [
            'Central heavy or tight pain at rest, lasting longer than 30 minutes',
            'Going to the right arm, or both arms; or to the left arm or jaw',
            'Sweating, nausea or vomiting, fear',
            'Worse than previous angina; not relieved by GTN',
            'Known coronary or peripheral vascular disease',
          ],
          against: ['Sharp, positional or pleuritic pain', 'Pain reproduced by pressing on the chest wall'],
          refs: [
            { chapter: 4, pages: '60', label: 'Table 4.2A' },
            { chapter: 4, pages: '63', label: 'Good symptoms guide 4.1' },
            { chapter: 7, pages: '121' },
          ],
        },
        {
          name: 'Aortic dissection',
          urgent: true,
          for: [
            'Very severe pain, maximal at the moment it starts',
            'Tearing, going through to the back or between the shoulder blades',
            'History of hypertension; Marfan or Ehlers–Danlos',
            'Pulse or BP different between the arms; new aortic regurgitation; stroke signs',
          ],
          against: ['Pain building over minutes without back radiation'],
          refs: [
            { chapter: 4, pages: '60, 63', label: 'Table 4.2B' },
            { chapter: 7, pages: '122' },
          ],
        },
        {
          name: 'Pulmonary embolism',
          urgent: true,
          for: [
            'Sudden breathlessness; pleuritic pain or haemoptysis (if infarcted)',
            'Collapse, cyanosis or retrosternal pain if massive',
            'Tachycardia; risk factors (immobility, surgery, previous clot, cancer, oestrogens)',
            'Signs of DVT (absent in more than half)',
          ],
          refs: [
            { chapter: 4, pages: '63' },
            { chapter: 7, pages: '122' },
            { chapter: 11, pages: '199–200', label: 'List 11.4' },
          ],
        },
        {
          name: 'Tension or large pneumothorax',
          urgent: true,
          for: ['Sudden sharp one-sided pain with breathlessness', 'Tall young man, or known emphysema', 'Reduced expansion, hyper-resonance, absent breath sounds'],
          refs: [
            { chapter: 4, pages: '63' },
            { chapter: 11, pages: '193–194' },
          ],
        },
        {
          name: 'Cardiac tamponade',
          urgent: true,
          for: ['Breathless, very unwell, hypotensive, tachycardic', 'Raised JVP, quiet heart sounds, pulsus paradoxus'],
          refs: [{ chapter: 7, pages: '123' }],
        },
      ],
    },
    {
      heading: 'Common',
      items: [
        {
          name: 'Stable angina',
          for: ['Tight or heavy, brought on by a predictable amount of exertion', 'Settles within minutes of rest or GTN'],
          against: ['Pain at rest or with less and less effort (that is unstable)'],
          refs: [
            { chapter: 4, pages: '60–62', label: 'Tables 4.2A, 4.3' },
          ],
        },
        {
          name: 'Pericarditis',
          for: ['Sharp pain, worse lying flat and breathing in, better sitting forward', 'Fever; recent viral illness or infarction', 'Pericardial rub'],
          refs: [
            { chapter: 4, pages: '59–60', label: 'Tables 4.1, 4.2A' },
            { chapter: 7, pages: '122' },
          ],
        },
        {
          name: 'Pneumonia or pleurisy',
          for: ['Pleuritic pain with fever, cough and breathlessness', 'Signs of consolidation'],
          refs: [
            { chapter: 4, pages: '59, 63', label: 'Table 4.1' },
            { chapter: 11, pages: '190–192' },
          ],
        },
        {
          name: 'Reflux or oesophageal spasm',
          for: ['Burning, not related to exertion, may come on lying down', 'Spasm can ease with warm water or GTN'],
          against: ['Can sit alongside angina: both are common'],
          refs: [{ chapter: 4, pages: '59–63', label: 'Tables 4.1, 4.2A' }],
        },
        {
          name: 'Chest wall pain (muscle strain, costochondritis, rib fracture)',
          for: ['Small localised area, sharp, worse with movement or breathing', 'Tender; pressing reproduces the pain', 'Injury or persistent cough'],
          refs: [
            { chapter: 4, pages: '59, 63', label: 'Tables 4.1, 4.2B' },
          ],
        },
        {
          name: 'Herpes zoster',
          for: ['Severe one-sided pain in a band', 'Rash in a dermatome, sometimes days later'],
          refs: [{ chapter: 4, pages: '59, 63', label: 'Table 4.1' }],
        },
        {
          name: 'Panic attack',
          for: ['Anxiety first, then breathlessness, dizziness, tingling round the lips'],
          against: ['Diagnose only after the dangerous causes are excluded'],
          refs: [{ chapter: 4, pages: '60', label: 'Table 4.1' }],
        },
        {
          name: 'Biliary disease (cholecystitis)',
          for: ['Right upper quadrant tenderness', 'Can be confused with infarction'],
          refs: [{ chapter: 4, pages: '63' }],
        },
      ],
    },
  ],
  plan: [
    {
      heading: 'Extend the examination',
      refs: [
        { chapter: 7, pages: '121' },
        { chapter: 8, pages: '147–151' },
      ],
      points: [
        { text: 'ECG now, and repeat it if the pain changes' },
        { text: 'SpO₂, and BP in both arms recorded in the notes' },
        { text: 'Chest X-ray, read systematically (widened mediastinum, pneumothorax, consolidation, effusion, heart size)' },
        { text: 'Bedside echo if available (effusion, wall motion, right heart strain)', extra: true },
        { text: 'Record the findings at the start so later changes can be seen' },
      ],
    },
    {
      heading: 'Decide',
      refs: [
        { chapter: 7, pages: '121', label: 'Killip class' },
        { chapter: 11, pages: '200' },
      ],
      points: [
        { text: 'Any can’t-miss diagnosis still possible? Treat it as that until excluded', urgent: true },
        { text: 'If infarction: Killip class (I none, II basal crackles, III pulmonary oedema, IV shock)', hint: 'III or IV: much higher risk' },
        { text: 'If PE possible: score the clinical probability (score above 4: PE likely)' },
        { text: 'Then follow the hospital’s chest pain flowchart and checklist below' },
      ],
    },
  ],
};
