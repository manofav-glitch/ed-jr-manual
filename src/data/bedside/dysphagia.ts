import type { BedsideTopic } from '../bedsideTypes.ts';

export const dysphagia: BedsideTopic = {
  id: 'dysphagia',
  title: 'Difficulty swallowing (dysphagia)',
  flowcharts: ['14.4'],
  reviewed: false,
  history: [
    {
      heading: 'Can they swallow at all?',
      refs: [
        { chapter: 13, pages: '221', label: 'List 13.2' },
        { chapter: 11, pages: '190', label: 'List 11.1' },
      ],
      points: [
        { text: 'Can they swallow their own saliva? Drooling?', urgent: true, hint: 'Complete obstruction, food bolus', extra: true },
        { text: 'Something stuck right now, after eating?', urgent: true, hint: 'Food impaction, foreign body' },
        { text: 'Noisy breathing, change in voice, fever, very sore throat', urgent: true, hint: 'Epiglottitis, quinsy' },
      ],
    },
    {
      heading: 'The dysphagia',
      refs: [
        { chapter: 13, pages: '220–222', label: 'Questions box 13.3' },
      ],
      points: [
        { text: 'Hard to swallow, or painful to swallow?', hint: 'Painful (odynophagia): inflammation of the oesophagus' },
        { text: 'Solids only, or solids and liquids?', hint: 'Solids only: mechanical. Both: motility problem' },
        { text: 'Where does it stick? Ask them to point' },
        { text: 'Trouble starting a swallow, coughing or choking, fluid coming out of the nose', hint: 'Oropharyngeal: often neurological' },
        { text: 'Comes and goes, or getting steadily worse?', urgent: true, hint: 'Progressive: stricture, cancer, achalasia' },
        { text: 'Weight loss', urgent: true, hint: 'Cancer' },
        { text: 'Heartburn, acid regurgitation', hint: 'Reflux, stricture' },
        { text: 'Asthma or hay fever; episodes of food sticking', hint: 'Eosinophilic oesophagitis' },
      ],
    },
    {
      heading: 'Background',
      refs: [
        { chapter: 13, pages: '220–221', label: 'List 13.2' },
        { chapter: 15, pages: '276' },
      ],
      points: [
        { text: 'Swallowed a caustic substance?', urgent: true, hint: 'Corrosive injury: see the hospital poisoning protocol' },
        { text: 'Smoking, alcohol' },
        { text: 'Stroke, motor neurone disease, myasthenia, muscle disease' },
        { text: 'Goitre or a lump in the neck' },
        { text: 'Weak immunity (HIV, steroids, chemotherapy)', hint: 'Candida or herpes oesophagitis' },
        { text: 'Tight skin, cold white fingers', hint: 'Scleroderma' },
        { text: 'Recurrent chest infections', hint: 'Aspiration' },
      ],
    },
  ],
  exam: [
    {
      heading: 'Airway and hydration first',
      refs: [
        { chapter: 47, pages: '867–870', label: 'List 47.2' },
        { chapter: 3, pages: '46–47', label: 'Hydration' },
      ],
      points: [
        { text: 'Stridor, drooling, unable to swallow saliva', urgent: true },
        { text: 'Hydration and nutrition' },
      ],
    },
    {
      heading: 'Examination for dysphagia (book order)',
      refs: [{ chapter: 15, pages: '276' }],
      points: [
        { text: 'General: weight loss' },
        { text: 'Hands: pale palmar creases, spoon-shaped nails (iron deficiency); signs of scleroderma' },
        { text: 'Mouth: ulcers, candida' },
        { text: 'Lower cranial nerves: palate, gag, tongue, speech', hint: 'Bulbar or pseudobulbar palsy' },
        { text: 'Neck: supraclavicular nodes, goitre, a gurgling left neck swelling (pouch)' },
        { text: 'Lungs: signs of aspiration' },
        { text: 'Abdomen: enlarged liver, epigastric mass; rectal for melaena' },
      ],
    },
    {
      heading: 'Watch them swallow',
      refs: [{ chapter: 13, pages: '220' }],
      points: [
        { text: 'A sip of water if safe: cough, choke, wet voice?', extra: true },
      ],
    },
  ],
  differentials: [
    {
      heading: 'Emergencies',
      items: [
        {
          name: 'Food bolus or foreign body',
          urgent: true,
          for: ['Food sticking during a meal; eosinophilic oesophagitis and lower oesophageal rings often cause it'],
          refs: [{ chapter: 13, pages: '221–222', label: 'List 13.2, Questions box 13.3' }],
        },
        {
          name: 'Epiglottitis or quinsy',
          urgent: true,
          for: ['Fever, severe sore throat, drooling, stridor, muffled voice'],
          refs: [{ chapter: 11, pages: '190', label: 'List 11.1' }],
        },
        {
          name: 'Caustic injury or oesophageal perforation',
          urgent: true,
          for: ['Swallowed acid or alkali', 'Severe pain on swallowing'],
          refs: [{ chapter: 13, pages: '220' }],
        },
      ],
    },
    {
      heading: 'Mechanical (solids, progressive)',
      items: [
        {
          name: 'Oesophageal or gastric cardia cancer',
          urgent: true,
          for: ['Progressive, solids first; weight loss', 'Supraclavicular node, enlarged liver'],
          refs: [
            { chapter: 13, pages: '221', label: 'List 13.2, Questions box 13.3' },
            { chapter: 15, pages: '276' },
          ],
        },
        {
          name: 'Peptic stricture',
          for: ['Long history of heartburn; slowly progressive'],
          refs: [{ chapter: 13, pages: '221', label: 'List 13.2' }],
        },
        {
          name: 'Lower oesophageal ring, web, eosinophilic oesophagitis',
          for: ['Intermittent; first few swallows; food impaction', 'Web: iron deficiency (Plummer–Vinson)'],
          refs: [
            { chapter: 13, pages: '221', label: 'List 13.2' },
            { chapter: 15, pages: '276' },
          ],
        },
        {
          name: 'Pressure from outside (goitre, mediastinal or lung tumour)',
          for: ['Neck or chest mass; smoker'],
          refs: [{ chapter: 13, pages: '221', label: 'List 13.2' }],
        },
      ],
    },
    {
      heading: 'Motility (solids and liquids, intermittent)',
      items: [
        {
          name: 'Achalasia, diffuse oesophageal spasm, scleroderma',
          for: ['Solids and liquids equally; regurgitation; chest pain in spasm'],
          refs: [{ chapter: 13, pages: '221', label: 'List 13.2' }],
        },
      ],
    },
    {
      heading: 'Oropharyngeal',
      items: [
        {
          name: 'Neurological (stroke, bulbar palsy, myasthenia, myopathy) or pharyngeal pouch',
          for: ['Trouble starting the swallow, choking, nasal regurgitation, aspiration', 'Cranial nerve signs'],
          refs: [
            { chapter: 13, pages: '220–221', label: 'List 13.2' },
          ],
        },
      ],
    },
    {
      heading: 'Painful swallowing',
      items: [
        {
          name: 'Oesophagitis (infection, peptic, pill or caustic)',
          for: ['Pain on swallowing; weak immunity (candida, herpes); reflux'],
          refs: [{ chapter: 13, pages: '220' }],
        },
      ],
    },
  ],
  plan: [
    {
      heading: 'Extend the examination',
      refs: [{ chapter: 15, pages: '276' }],
      points: [
        { text: 'Weight recorded' },
        { text: 'Chest X-ray if aspiration is possible', extra: true },
        { text: 'Haemoglobin (iron deficiency)', extra: true },
      ],
    },
    {
      heading: 'Decide',
      refs: [{ chapter: 13, pages: '227', label: 'T&O’C essentials' }],
      points: [
        { text: 'Can’t swallow saliva, or airway signs: urgent', urgent: true },
        { text: 'Dysphagia is an alarm symptom: it always needs investigation' },
        { text: 'Intermittent dysphagia with food sticking: think eosinophilic oesophagitis' },
        { text: 'Then follow the hospital’s dysphagia flowchart below' },
      ],
    },
  ],
};
