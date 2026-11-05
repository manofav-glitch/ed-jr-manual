import type { BedsideTopic } from '../bedsideTypes.ts';
import { FIRST_LOOK, RESP_EXAM } from './shared.ts';

export const feverChest: BedsideTopic = {
  id: 'fever-cough-breathless',
  title: 'Fever with cough or breathlessness',
  flowcharts: ['13.3', '13.5'],
  reviewed: false,
  history: [
    FIRST_LOOK,
    {
      heading: 'The fever',
      refs: [{ chapter: 45, pages: '835', label: 'Questions box 45.1' }],
      points: [
        { text: 'How long, how high, measured or felt?' },
        { text: 'Shaking chills (rigors)?', urgent: true, hint: 'Bacteraemia' },
        { text: 'Anyone else ill with the same?' },
        { text: 'Recent illness, operation or procedure' },
        { text: 'Travel: where, when; malaria prophylaxis and vaccines' },
        { text: 'Pets or animals, and are they unwell? Birds?', hint: 'Psittacosis, Q fever' },
      ],
    },
    {
      heading: 'The cough and chest',
      refs: [
        { chapter: 9, pages: '163–168', label: 'Questions box 9.1, Table 9.1' },
        { chapter: 9, pages: '168' },
      ],
      points: [
        { text: 'Cough: how long; dry or productive; what colour; how much?' },
        { text: 'Blood in the sputum?', urgent: true },
        { text: 'Pleuritic chest pain' },
        { text: 'Breathless: how far can they walk; at rest?' },
        { text: 'How did it start: short prodrome of hours (bacterial) or longer illness of days (viral)?' },
        { text: 'Night sweats, weight loss, a cough for weeks', urgent: true, hint: 'TB, lymphoma' },
        { text: 'Sinus or throat symptoms first' },
        { text: 'Confusion (ask the family)', urgent: true },
      ],
    },
    {
      heading: 'Other systems (where else could the fever come from?)',
      refs: [{ chapter: 45, pages: '835' }],
      points: [
        { text: 'Headache, neck stiffness, rash', urgent: true, hint: 'Meningitis, meningococcal sepsis' },
        { text: 'Burning urine, loin pain' },
        { text: 'Abdominal pain, diarrhoea, jaundice' },
        { text: 'Heart murmur known, recent dental work', hint: 'Endocarditis' },
        { text: 'Joint pain, rash, back pain' },
      ],
    },
    {
      heading: 'Risk',
      refs: [
        { chapter: 9, pages: '169–173' },
        { chapter: 45, pages: '835' },
      ],
      points: [
        { text: 'Lung disease: COPD, asthma, bronchiectasis' },
        { text: 'Weak immunity: steroids, chemotherapy, HIV, diabetes', urgent: true, hint: 'TB, Pneumocystis and unusual infections' },
        { text: 'Smoking; alcohol (aspiration, pneumococcal or Klebsiella pneumonia)' },
        { text: 'Injecting drugs', hint: 'Lung abscess, endocarditis' },
        { text: 'TB before, or contact with TB' },
        { text: 'Hospital stay in the last few weeks', hint: 'Hospital-acquired organisms' },
        { text: 'Medicines and allergies (especially to antibiotics)' },
      ],
    },
  ],
  exam: [
    {
      heading: 'How sick?',
      refs: [
        { chapter: 47, pages: '870–871', label: 'List 47.2' },
        { chapter: 11, pages: '190–191', label: 'Good signs guide 11.1' },
      ],
      points: [
        { text: 'Temperature, pulse, BP, respiratory rate, SpO₂' },
        { text: 'Respiratory rate 22 or more, systolic BP 100 or less, altered mentation', urgent: true, hint: 'Two or more (qSOFA): poor outcome in sepsis' },
        { text: 'Exhausted, cyanosed, confused', urgent: true },
        { text: 'Capillary refill longer than 2 seconds, cold peripheries', urgent: true },
      ],
    },
    ...RESP_EXAM,
    {
      heading: 'Look specifically for',
      refs: [
        { chapter: 11, pages: '190–197', label: 'Table 11.1' },
        { chapter: 45, pages: '835–836' },
        { chapter: 7, pages: '123' },
      ],
      points: [
        { text: 'Consolidation: reduced expansion, dull (not stony), bronchial breathing, crackles, increased vocal resonance' },
        { text: 'Effusion or empyema: stony dull, absent breath sounds' },
        { text: 'Murmur, splinter haemorrhages, injection marks', hint: 'Endocarditis' },
        { text: 'Rash: petechial or purpuric', urgent: true, hint: 'Meningococcal' },
        { text: 'Neck stiffness' },
        { text: 'Lymph nodes, liver and spleen' },
        { text: 'Mouth: candida (immunosuppression), teeth' },
      ],
    },
  ],
  differentials: [
    {
      heading: 'Can’t miss',
      items: [
        {
          name: 'Sepsis from a chest source',
          urgent: true,
          for: ['Fever or low temperature, pulse above 90, RR above 20', 'Low BP, confusion, poor perfusion'],
          refs: [{ chapter: 47, pages: '871' }],
        },
        {
          name: 'Severe pneumonia with respiratory failure',
          urgent: true,
          for: ['Cyanosis, exhaustion, can’t speak, confusion'],
          refs: [
            { chapter: 11, pages: '190–191' },
          ],
        },
        {
          name: 'Pulmonary embolism with infarction',
          urgent: true,
          for: ['Low-grade fever with sudden breathlessness, pleuritic pain, haemoptysis', 'Risk factors, DVT signs'],
          refs: [{ chapter: 11, pages: '199–200' }],
        },
        {
          name: 'Infective endocarditis',
          urgent: true,
          for: ['Murmur, splinter haemorrhages, splenomegaly, blood in urine', 'Injecting drugs, valve disease, dental work'],
          refs: [{ chapter: 7, pages: '123–124' }],
        },
      ],
    },
    {
      heading: 'Common',
      items: [
        {
          name: 'Community-acquired pneumonia',
          for: [
            'Fever, rigors; cough dry then productive; pleuritic pain; breathless',
            'Temperature above 37.8 °C, pulse above 100, RR above 25',
            'Dullness, bronchial breathing, crackles, aegophony',
          ],
          refs: [{ chapter: 11, pages: '190–192', label: 'Good signs guide 11.1' }],
        },
        {
          name: 'Acute bronchitis or viral chest infection',
          for: ['Cough for less than 3 weeks after a cold', 'No signs of consolidation'],
          refs: [{ chapter: 9, pages: '164', label: 'List 9.2' }],
        },
        {
          name: 'Infective exacerbation of COPD or asthma',
          for: ['Known airways disease, more sputum, more wheeze'],
          refs: [
            { chapter: 9, pages: '164', label: 'List 9.2' },
            { chapter: 11, pages: '194–195' },
          ],
        },
        {
          name: 'Tuberculosis',
          for: ['Weeks of cough, haemoptysis, weight loss, night sweats', 'Contact, previous TB, HIV; often no chest signs'],
          refs: [{ chapter: 11, pages: '197' }],
        },
        {
          name: 'Parapneumonic effusion or empyema',
          for: ['Pneumonia not settling; stony dull base'],
          refs: [{ chapter: 11, pages: '192–193' }],
        },
        {
          name: 'Bronchiectasis exacerbation',
          for: ['Lifelong daily purulent sputum, now more; coarse crackles'],
          refs: [{ chapter: 11, pages: '194' }],
        },
        {
          name: 'Allergic alveolitis',
          for: ['Flu-like fever, dry cough and breathlessness a few hours after exposure to birds, mouldy hay or a humidifier'],
          refs: [{ chapter: 9, pages: '172', label: 'Table 9.6' }],
        },
      ],
    },
  ],
  plan: [
    {
      heading: 'Extend the examination',
      refs: [
        { chapter: 12, pages: '205–206' },
        { chapter: 47, pages: '871' },
      ],
      points: [
        { text: 'SpO₂; blood gas if hypoxic or drowsy' },
        { text: 'Chest X-ray, read systematically' },
        { text: 'If febrile: blood cultures and urine culture' },
        { text: 'Sputum for culture; AFB if TB is possible', extra: true },
        { text: 'Blood sugar' },
      ],
    },
    {
      heading: 'Decide',
      refs: [
        { chapter: 47, pages: '871' },
        { chapter: 9, pages: '172' },
      ],
      points: [
        { text: 'Sepsis: antibiotics early save lives', urgent: true },
        { text: 'Home or hospital: how sick, home support, and the social history' },
        { text: 'TB possible: isolate the patient', extra: true },
        { text: 'Then follow the hospital’s fever flowchart and checklist below' },
      ],
    },
  ],
};
