import type { BedsideTopic } from '../bedsideTypes.ts';
import { FIRST_LOOK, RESP_EXAM } from './shared.ts';

export const breathlessness: BedsideTopic = {
  id: 'breathlessness',
  title: 'Shortness of breath',
  flowcharts: ['6.1'],
  reviewed: false,
  history: [
    FIRST_LOOK,
    {
      heading: 'The breathlessness',
      refs: [
        { chapter: 9, pages: '165–168', label: 'Questions box 9.2, List 9.4' },
        { chapter: 4, pages: '63–64' },
      ],
      points: [
        { text: 'How long, and how fast did it come on: seconds, hours to days, or weeks?' },
        { text: 'Instant or very sudden?', urgent: true, hint: 'Pneumothorax (instant), PE (very quick), anaphylaxis, foreign body' },
        { text: 'How far can they walk, how many stairs, before stopping? (more useful than a grade)' },
        { text: 'Better or worse from day to day or hour to hour?', hint: 'Variable: asthma' },
        { text: 'Woken at night gasping, or needs to sleep propped up?', urgent: true, hint: 'PND and orthopnoea favour heart failure' },
        { text: 'Wheeze; cough and sputum (colour, blood, frothy pink)' },
        { text: 'Pain on a deep breath?', hint: 'Pleurisy, pericarditis, PE, pneumothorax' },
        { text: 'Tightness in the chest with it?', urgent: true, hint: 'Angina' },
        { text: 'Fever?', urgent: true, hint: 'Pneumonia' },
        { text: 'Can’t take a satisfying breath, tingling lips or fingers, sighing, at rest', hint: 'Anxiety and hyperventilation' },
        { text: 'Ankle swelling, weight gain' },
        { text: 'Possible allergen, new drug, sting; lip or tongue swelling', urgent: true, hint: 'Anaphylaxis' },
        { text: 'Choking episode or something inhaled', urgent: true, hint: 'Foreign body' },
      ],
    },
    {
      heading: 'Past history',
      refs: [
        { chapter: 9, pages: '171' },
        { chapter: 4, pages: '64, 70' },
      ],
      points: [
        { text: 'Asthma or COPD: past admissions, ICU or ventilation, steroids, home oxygen' },
        { text: 'Heart attacks, heart failure, valve disease, rheumatic fever' },
        { text: 'Previous DVT or PE; recent surgery, immobility, long travel; cancer' },
        { text: 'TB, pneumonia, previous chest X-ray findings' },
        { text: 'Diabetes (ketoacidosis), kidney disease, anaemia' },
      ],
    },
    {
      heading: 'Drugs',
      refs: [{ chapter: 9, pages: '169–171', label: 'List 9.8' }],
      points: [
        { text: 'Inhalers: which, how often, and is use going up?', hint: 'Rising reliever use: poorly controlled asthma' },
        { text: 'Beta-blockers (including eye drops), aspirin, NSAIDs', hint: 'Bronchospasm' },
        { text: 'Oestrogens, tamoxifen', hint: 'PE' },
        { text: 'Amiodarone, methotrexate, nitrofurantoin', hint: 'Lung fibrosis' },
        { text: 'Diuretics and fluid advice in heart failure; missed doses' },
        { text: 'Street drugs, especially inhaled or injected' },
      ],
    },
    {
      heading: 'Social and family',
      refs: [
        { chapter: 9, pages: '171–173', label: 'Tables 9.5, 9.6' },
      ],
      points: [
        { text: 'Smoking: pack-years; passive smoking' },
        { text: 'Occupation, past and present: dusts, asbestos, fumes; better on days off?' },
        { text: 'Birds, animals, mouldy hay' },
        { text: 'Alcohol (aspiration, heart muscle disease)' },
        { text: 'Family: asthma or allergies, emphysema at a young age, TB contacts' },
      ],
    },
  ],
  exam: [
    {
      heading: 'Signs of respiratory failure: act now',
      refs: [
        { chapter: 11, pages: '190' },
        { chapter: 11, pages: '195', label: 'Severe asthma' },
      ],
      points: [
        { text: 'Cyanosis or low SpO₂', urgent: true },
        { text: 'Can’t speak; using accessory muscles; exhausted', urgent: true },
        { text: 'Very fast or very slow breathing', urgent: true },
        { text: 'Drowsy', urgent: true, hint: 'Rising CO₂' },
        { text: 'Silent chest', urgent: true },
        { text: 'Stridor', urgent: true, hint: 'Upper airway obstruction' },
        { text: 'Tachycardia (above 130 in asthma), pulsus paradoxus', urgent: true },
      ],
    },
    ...RESP_EXAM,
    {
      heading: 'Heart',
      refs: [
        { chapter: 7, pages: '119–120', label: 'List 7.1, Good signs guide 7.1' },
        { chapter: 8, pages: '145–147', label: 'Text box 8.1' },
      ],
      points: [
        { text: 'JVP raised; abdominojugular reflux', hint: 'Heart failure' },
        { text: 'Displaced apex, S3 gallop, mitral regurgitation murmur', hint: 'Left ventricular failure' },
        { text: 'Basal crackles; peripheral and sacral oedema; tender liver' },
        { text: 'Murmurs of valve disease; muffled heart sounds (effusion)' },
      ],
    },
    {
      heading: 'Elsewhere',
      refs: [
        { chapter: 9, pages: '167', label: 'List 9.5' },
        { chapter: 9, pages: '170', label: 'Table 9.4' },
      ],
      points: [
        { text: 'Deep sighing breathing: Kussmaul (acidosis) or anxiety; check blood sugar and ketones' },
        { text: 'Pallor (anaemia)' },
        { text: 'Calves: swelling, tenderness' },
        { text: 'Hives, lip or tongue swelling (anaphylaxis)' },
        { text: 'Forced expiratory time: more than 3 seconds suggests airflow obstruction; more than 9 seconds, strongly' },
      ],
    },
  ],
  differentials: [
    {
      heading: 'Seconds to minutes',
      items: [
        {
          name: 'Tension pneumothorax',
          urgent: true,
          for: ['Instant onset, sharp one-sided pain', 'Tachypnoea, cyanosis, falling BP', 'Trachea pushed away, hyper-resonant, silent side'],
          refs: [{ chapter: 11, pages: '193–194' }],
        },
        {
          name: 'Pulmonary embolism',
          urgent: true,
          for: ['Very sudden, unexplained', 'Pleuritic pain or haemoptysis if infarcted; collapse if massive', 'Tachycardia; risk factors; DVT signs (often absent)'],
          refs: [
            { chapter: 9, pages: '167–168', label: 'Lists 9.4, 9.6' },
            { chapter: 11, pages: '199–200', label: 'List 11.4' },
          ],
        },
        {
          name: 'Acute pulmonary oedema',
          urgent: true,
          for: ['Orthopnoea, PND, frothy pink sputum', 'Past infarction or heart failure', 'Raised JVP, S3, crackles; no chest pain or central chest pain'],
          against: ['Wheeze alone without other heart signs favours airways disease'],
          refs: [
            { chapter: 4, pages: '63–64' },
            { chapter: 7, pages: '119–120', label: 'List 7.1' },
          ],
        },
        {
          name: 'Severe asthma',
          urgent: true,
          for: ['Wheeze and cough; known asthma; variable symptoms', 'Can’t speak, exhausted, silent chest, pulse above 130'],
          refs: [
            { chapter: 9, pages: '167–168', label: 'Lists 9.4, 9.6' },
            { chapter: 11, pages: '194–195' },
          ],
        },
        {
          name: 'Anaphylaxis',
          urgent: true,
          for: ['Minutes after a food, drug or sting', 'Wheeze or stridor, hives, lip and tongue swelling, low BP'],
          refs: [
            { chapter: 9, pages: '167', label: 'List 9.4' },
            { chapter: 47, pages: '871' },
          ],
        },
        {
          name: 'Inhaled foreign body',
          urgent: true,
          for: ['Choking episode', 'Stridor or one-sided wheeze'],
          refs: [
            { chapter: 9, pages: '167', label: 'List 9.4' },
            { chapter: 11, pages: '190', label: 'List 11.1' },
          ],
        },
        {
          name: 'Myocardial infarction with heart failure',
          urgent: true,
          for: ['Central chest pain with the breathlessness'],
          refs: [{ chapter: 9, pages: '168', label: 'List 9.6' }],
        },
      ],
    },
    {
      heading: 'Hours to days',
      items: [
        {
          name: 'Pneumonia',
          for: ['Fever, rigors, cough (dry then productive), pleuritic pain', 'Dull (not stony), bronchial breathing, crackles'],
          refs: [{ chapter: 11, pages: '190–192', label: 'Good signs guide 11.1' }],
        },
        {
          name: 'COPD exacerbation',
          for: ['Heavy smoker (over 40 pack-years), known COPD', 'Hyperinflated, pursed lips, reduced breath sounds, wheeze'],
          refs: [{ chapter: 11, pages: '195', label: 'Good signs guide 11.2' }],
        },
        {
          name: 'Heart failure',
          for: ['Orthopnoea, PND, cough only lying down, ankle swelling', 'Past infarction; raised JVP, S3, displaced apex'],
          refs: [{ chapter: 7, pages: '119–120', label: 'List 7.1' }],
        },
        {
          name: 'Pleural effusion',
          for: ['Stony dull, absent breath sounds over the fluid', 'Reduced expansion on that side'],
          refs: [{ chapter: 11, pages: '192' }],
        },
        {
          name: 'Metabolic acidosis (diabetic ketoacidosis, kidney failure)',
          for: ['Deep rapid (Kussmaul) breathing with a clear chest', 'Diabetes, vomiting, high blood sugar or ketones'],
          refs: [
            { chapter: 9, pages: '167, 170', label: 'List 9.4, Table 9.4' },
            { chapter: 11, pages: '190', label: 'List 11.1' },
          ],
        },
      ],
    },
    {
      heading: 'Weeks or longer',
      items: [
        {
          name: 'Interstitial lung disease',
          for: ['Slowly progressive; dry cough', 'Fine late crackles; clubbing; dust or drug exposure'],
          refs: [
            { chapter: 9, pages: '167', label: 'List 9.4' },
            { chapter: 11, pages: '196', label: 'List 11.2' },
          ],
        },
        {
          name: 'Anaemia',
          for: ['Breathless on exertion, tired, pale', 'Bleeding history'],
          refs: [{ chapter: 9, pages: '166–167', label: 'Lists 9.3, 9.4' }],
        },
        {
          name: 'Anxiety and hyperventilation',
          for: ['Can’t get a satisfying breath, sighing, at rest', 'Tingling lips and fingers, light-headed'],
          against: ['Diagnose only when the chest, SpO₂ and heart are normal'],
          refs: [
            { chapter: 9, pages: '168–169' },
            { chapter: 4, pages: '64' },
          ],
        },
      ],
    },
  ],
  plan: [
    {
      heading: 'Extend the examination',
      refs: [
        { chapter: 12, pages: '203–206' },
        { chapter: 8, pages: '147–151' },
      ],
      points: [
        { text: 'SpO₂ on air and on oxygen; record the flow' },
        { text: 'Peak flow (if able) or forced expiratory time' },
        { text: 'ECG' },
        { text: 'Blood sugar; blood gas if drowsy, very breathless or on long-term oxygen' },
        { text: 'Chest X-ray, read systematically' },
        { text: 'Bedside ultrasound or echo if available', extra: true },
      ],
    },
    {
      heading: 'Decide',
      refs: [
        { chapter: 11, pages: '190, 200' },
        { chapter: 47, pages: '870', label: 'List 47.2' },
      ],
      points: [
        { text: 'Signs of respiratory failure? Resuscitate first, history later', urgent: true },
        { text: 'COPD with drowsiness on oxygen: think CO₂ retention', urgent: true },
        { text: 'Sudden unexplained breathlessness with risk factors: score for PE (above 4: likely)' },
        { text: 'Heart or lung? Use the findings that favour heart failure (PND, orthopnoea, S3, raised JVP, past infarction)' },
        { text: 'Then follow the hospital’s shortness of breath flowchart and checklist below' },
      ],
    },
  ],
};
