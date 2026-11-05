import type { BedsideTopic } from '../bedsideTypes.ts';
import { CVS_EXAM, FIRST_LOOK } from './shared.ts';

export const syncope: BedsideTopic = {
  id: 'syncope',
  title: 'Syncope (blackout)',
  flowcharts: ['7.3'],
  reviewed: false,
  history: [
    FIRST_LOOK,
    {
      heading: 'Was it really a blackout?',
      refs: [
        { chapter: 4, pages: '66', label: 'List 4.3' },
        { chapter: 31, pages: '493', label: 'Questions box 31.4' },
      ],
      points: [
        { text: 'Did they lose consciousness completely, and for how long?' },
        { text: 'Or was the room spinning without losing consciousness?', hint: 'Vertigo, not syncope' },
        { text: 'Or a feeling of about to faint (presyncope)?' },
        { text: 'How many episodes, and how often?' },
        { text: 'Any injury?', hint: 'Unusual in a simple faint' },
      ],
    },
    {
      heading: 'Before',
      refs: [
        { chapter: 4, pages: '66–67', label: 'List 4.3' },
        { chapter: 31, pages: '493', label: 'Questions box 31.4' },
      ],
      points: [
        { text: 'What were they doing: standing long, standing up quickly, passing urine, coughing, emotional upset or the sight of blood?' },
        { text: 'During exertion?', urgent: true, hint: 'Aortic stenosis or hypertrophic cardiomyopathy' },
        { text: 'Lying down when it happened?', urgent: true, hint: 'Arrhythmia' },
        { text: 'Warning: nausea, sweating, yawning, hot stuffy room', hint: 'Vasovagal' },
        { text: 'Warning: strange smell, déjà vu', hint: 'Seizure aura' },
        { text: 'Fast palpitations first?', urgent: true, hint: 'Ventricular tachycardia' },
        { text: 'Chest pain or breathlessness first?', urgent: true, hint: 'Ischaemia, aortic stenosis, PE, dissection' },
        { text: 'No warning at all?', urgent: true, hint: 'Heart block (Stokes–Adams)' },
        { text: 'Headache first?', urgent: true, hint: 'Subarachnoid haemorrhage', extra: true },
      ],
    },
    {
      heading: 'During (ask the witness)',
      refs: [
        { chapter: 4, pages: '66', label: 'List 4.3' },
        { chapter: 31, pages: '492–493', label: 'Table 31.1, Questions box 31.4' },
      ],
      points: [
        { text: 'Colour: pale, or blue?' },
        { text: 'Jerking: how long, and did it start before or after falling?', hint: 'A few jerks can happen in syncope; prolonged jerking favours seizure' },
        { text: 'Head turning, tongue bitten, urine passed', hint: 'Seizure' },
        { text: 'Pulse felt by anyone? Video on a phone?' },
      ],
    },
    {
      heading: 'After',
      refs: [
        { chapter: 4, pages: '66–67', label: 'List 4.3' },
        { chapter: 31, pages: '493', label: 'Questions box 31.4' },
      ],
      points: [
        { text: 'Woke quickly and felt normal?', hint: 'Cardiac or vasovagal' },
        { text: 'Drowsy, confused, aching muscles?', hint: 'Seizure' },
        { text: 'Weakness, numbness, speech trouble afterwards?', urgent: true, hint: 'Neurological cause' },
      ],
    },
    {
      heading: 'Past, drugs and family',
      refs: [
        { chapter: 4, pages: '66–67', label: 'Lists 4.3, 4.4' },
        { chapter: 4, pages: '65', label: 'Questions box 4.2' },
      ],
      points: [
        { text: 'Heart disease: infarction, heart failure, valve disease, AF, pacemaker', urgent: true, hint: 'Ventricular arrhythmia more likely' },
        { text: 'Diabetes: insulin or sulphonylureas, last meal', hint: 'Hypoglycaemia' },
        { text: 'Epilepsy, stroke' },
        { text: 'BP tablets, nitrates, anti-Parkinson drugs', hint: 'Postural hypotension' },
        { text: 'Beta-blockers, verapamil or diltiazem, digoxin', hint: 'Bradycardia' },
        { text: 'Antiarrhythmics, macrolides, antipsychotics, domperidone', hint: 'Long QT' },
        { text: 'Fasting, vomiting or diarrhoea', hint: 'Low volume' },
        { text: 'Black stools, missed period', hint: 'Hidden bleeding, ectopic pregnancy', extra: true },
        { text: 'Alcohol and drugs' },
        { text: 'Sudden unexplained death in the family, especially young', urgent: true, hint: 'Long QT, Brugada, cardiomyopathy' },
        { text: 'Do they drive or work at heights?' },
      ],
    },
  ],
  exam: [
    {
      heading: 'Vital signs',
      refs: [
        { chapter: 5, pages: '83–88' },
        { chapter: 47, pages: '872', label: 'OSCE example' },
      ],
      points: [
        { text: 'Pulse rate and rhythm: slow, fast, irregular' },
        { text: 'BP lying, then standing (or sitting)', hint: 'Postural drop' },
        { text: 'Blood sugar now' },
        { text: 'Temperature; neck stiffness', hint: 'Sepsis, meningism' },
      ],
    },
    ...CVS_EXAM,
    {
      heading: 'Look specifically for',
      refs: [
        { chapter: 7, pages: '130–131, 137–139' },
        { chapter: 47, pages: '872', label: 'OSCE example' },
      ],
      points: [
        { text: 'Slow-rising pulse and ejection systolic murmur to the carotids', urgent: true, hint: 'Aortic stenosis' },
        { text: 'Systolic murmur that gets louder with Valsalva', urgent: true, hint: 'Hypertrophic cardiomyopathy' },
        { text: 'Carotid bruits' },
        { text: 'Signs of tamponade or new murmur' },
        { text: 'Tongue bitten (side of the tongue)', hint: 'Seizure' },
        { text: 'Injuries from the fall, especially the head' },
        { text: 'Pallor, melaena on rectal exam if bleeding suspected', extra: true },
      ],
    },
    {
      heading: 'Neurological screen',
      refs: [{ chapter: 47, pages: '872', label: 'OSCE example' }],
      points: [
        { text: 'Orientation in time, place and person' },
        { text: 'Gait, limbs and cranial nerves for focal signs' },
      ],
    },
  ],
  differentials: [
    {
      heading: 'Can’t miss',
      items: [
        {
          name: 'Cardiac arrhythmia (VT, heart block, sick sinus)',
          urgent: true,
          for: [
            'No warning, any posture, quick recovery',
            'Fast palpitations first',
            'Known heart disease or heart failure',
            'Antiarrhythmic or QT-prolonging drugs',
            'Family history of sudden death',
          ],
          refs: [
            { chapter: 4, pages: '65–67', label: 'Table 4.4, Lists 4.3, 4.4' },
          ],
        },
        {
          name: 'Outflow obstruction (aortic stenosis, hypertrophic cardiomyopathy)',
          urgent: true,
          for: ['Blackout on exertion', 'Ejection systolic murmur; slow-rising pulse (AS) or murmur louder with Valsalva (HCM)'],
          refs: [
            { chapter: 4, pages: '66–67', label: 'List 4.3' },
            { chapter: 7, pages: '130–131, 137–139' },
          ],
        },
        {
          name: 'Massive PE, dissection, tamponade',
          urgent: true,
          for: ['Chest pain or sudden breathlessness with the blackout', 'Low BP, raised JVP'],
          refs: [
            { chapter: 7, pages: '122–123' },
            { chapter: 11, pages: '199' },
          ],
        },
        {
          name: 'Hypovolaemia or hidden bleeding (GI bleed, ruptured ectopic, aortic aneurysm)',
          urgent: true,
          for: ['Postural drop, tachycardia, pallor', 'Black stools, missed period, abdominal or back pain'],
          refs: [],
          extra: true,
        },
        {
          name: 'Hypoglycaemia',
          urgent: true,
          for: ['Insulin or sulphonylureas; missed meal', 'Low blood sugar'],
          refs: [{ chapter: 4, pages: '66', label: 'List 4.3' }],
        },
      ],
    },
    {
      heading: 'Common',
      items: [
        {
          name: 'Vasovagal syncope',
          for: [
            'Teens or twenties; similar episodes before',
            'Triggered by emotion, pain, sight of blood, standing in a hot room',
            'Nausea, sweating, yawning first; brief; recovers fully',
          ],
          against: ['Exertional blackout or injury'],
          refs: [{ chapter: 4, pages: '66', label: 'List 4.3' }],
        },
        {
          name: 'Postural (orthostatic) hypotension',
          for: ['On standing up', 'Dehydrated or fasted; BP tablets; known low BP', 'BP falls on standing'],
          refs: [
            { chapter: 4, pages: '66–67', label: 'Lists 4.3, 4.4' },
          ],
        },
        {
          name: 'Situational syncope',
          for: ['While passing urine (often at night) or after a coughing fit'],
          refs: [{ chapter: 4, pages: '66', label: 'List 4.3' }],
        },
      ],
    },
    {
      heading: 'Not syncope',
      items: [
        {
          name: 'Seizure',
          for: [
            'Aura first; head turning, prolonged jerking, cyanosis',
            'Tongue bitten, urine passed',
            'Drowsy, confused and aching afterwards',
          ],
          refs: [
            { chapter: 4, pages: '66', label: 'List 4.3' },
            { chapter: 31, pages: '492–493', label: 'Table 31.1, Questions box 31.4' },
          ],
        },
        {
          name: 'Vertigo',
          for: ['Room spinning; no loss of consciousness', 'Worse turning the head'],
          refs: [{ chapter: 4, pages: '66–67', label: 'List 4.3' }],
        },
      ],
    },
  ],
  plan: [
    {
      heading: 'Extend the examination',
      refs: [
        { chapter: 4, pages: '65–67' },
        { chapter: 8, pages: '151' },
      ],
      points: [
        { text: 'ECG: heart block, long or short QT, Brugada pattern, ischaemia' },
        { text: 'Blood sugar' },
        { text: 'Postural BP recorded' },
        { text: 'Pregnancy test in women of child-bearing age', extra: true },
        { text: 'Echo if there is a murmur or known heart disease' },
      ],
    },
    {
      heading: 'Decide',
      refs: [{ chapter: 4, pages: '66–67', label: 'List 4.3' }],
      points: [
        { text: 'Exertional blackout, no warning, heart disease, abnormal ECG or family sudden death: treat as cardiac', urgent: true },
        { text: 'Clear vasovagal or postural story, normal exam and ECG: lower risk' },
        { text: 'Seizure features: follow the seizure protocol instead' },
        { text: 'Then follow the hospital’s syncope flowchart and checklist below' },
      ],
    },
  ],
};
