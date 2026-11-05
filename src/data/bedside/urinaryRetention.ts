import type { BedsideTopic } from '../bedsideTypes.ts';

export const urinaryRetention: BedsideTopic = {
  id: 'urinary-retention',
  title: 'Urinary retention',
  flowcharts: ['3.2', '16.2'],
  reviewed: false,
  history: [
    {
      heading: 'The retention',
      refs: [
        { chapter: 17, pages: '297, 300', label: 'List 17.1' },
      ],
      points: [
        { text: 'When did they last pass urine? Painful urge, or painless?', hint: 'Painless: chronic retention, or a neurological cause' },
        { text: 'Dribbling or leaking all the time?', hint: 'Overflow incontinence' },
        { text: 'Before this: hesitancy, weak stream, terminal dribbling, double voiding', hint: 'Bladder outflow obstruction (prostate)' },
        { text: 'Blood or clots in the urine?', hint: 'Clot retention' },
        { text: 'Burning, frequency, fever', hint: 'Infection (more common with obstruction)' },
      ],
    },
    {
      heading: 'Danger questions',
      refs: [
        { chapter: 18, pages: '312' },
        { chapter: 17, pages: '301', label: 'List 17.5' },
      ],
      points: [
        { text: 'New back pain, leg weakness or numbness, numb saddle area, loss of bowel control', urgent: true, hint: 'Cord compression or cauda equina', extra: true },
        { text: 'Back pain with kidney failure', urgent: true, hint: 'Think of myeloma' },
        { text: 'Drowsy, vomiting, little urine for days', urgent: true, hint: 'Obstructive kidney failure' },
      ],
    },
    {
      heading: 'Causes to ask about',
      refs: [
        { chapter: 17, pages: '300–301', label: 'List 17.5' },
      ],
      points: [
        { text: 'Known prostate enlargement or cancer' },
        { text: 'Recent operation, anaesthetic, immobility', extra: true },
        { text: 'Drugs: anticholinergics, antihistamines, opioids, antidepressants, decongestants', extra: true },
        { text: 'Constipation or impacted stool', extra: true },
        { text: 'Tight foreskin; recent catheter; urethral injury', hint: 'Phimosis, paraphimosis, stricture' },
        { text: 'Pelvic surgery, radiotherapy or a pelvic mass in women' },
        { text: 'Diabetes, multiple sclerosis, spinal disease', hint: 'Neurogenic bladder' },
      ],
    },
  ],
  exam: [
    {
      heading: 'Bladder and abdomen',
      refs: [
        { chapter: 18, pages: '310–312' },
      ],
      points: [
        { text: 'Palpable bladder rising out of the pelvis' },
        { text: 'Percuss for the bladder (dull above the pubis); auscultatory percussion if obese' },
        { text: 'Kidneys: enlarged (hydronephrosis)?' },
        { text: 'Faecal loading' },
      ],
    },
    {
      heading: 'Penis, rectum and pelvis',
      refs: [
        { chapter: 18, pages: '312–313' },
        { chapter: 17, pages: '301', label: 'List 17.5' },
      ],
      points: [
        { text: 'Foreskin: phimosis, paraphimosis; meatus: blood, stricture' },
        { text: 'Rectal examination: prostate size, hardness, tenderness; anal tone' },
        { text: 'Women: pelvic mass, prolapse' },
      ],
    },
    {
      heading: 'Neurological screen',
      refs: [
        { chapter: 18, pages: '312' },
      ],
      points: [
        { text: 'Spinal tenderness' },
        { text: 'Leg power, reflexes, sensation; perianal sensation and anal tone', urgent: true, extra: true },
      ],
    },
  ],
  differentials: [
    {
      heading: 'Can’t miss',
      items: [
        {
          name: 'Spinal cord compression or cauda equina syndrome',
          urgent: true,
          extra: true,
          for: ['Back pain, leg weakness, saddle numbness, reduced anal tone'],
          refs: [],
        },
        {
          name: 'Obstruction causing kidney failure',
          urgent: true,
          for: ['Long-standing retention; drowsy, vomiting; high creatinine', 'Big bladder, may have big kidneys'],
          refs: [{ chapter: 17, pages: '300–301', label: 'List 17.5' }],
        },
        {
          name: 'Clot retention',
          urgent: true,
          for: ['Haematuria with clots, then unable to pass urine'],
          refs: [{ chapter: 17, pages: '301', label: 'List 17.5' }],
        },
      ],
    },
    {
      heading: 'Common',
      items: [
        {
          name: 'Benign prostatic enlargement',
          for: ['Older man; months of hesitancy, weak stream, dribbling', 'Smooth enlarged prostate'],
          refs: [
            { chapter: 17, pages: '300' },
            { chapter: 18, pages: '312' },
          ],
        },
        {
          name: 'Prostate cancer',
          for: ['Hard, irregular prostate on rectal examination'],
          refs: [
            { chapter: 17, pages: '301', label: 'List 17.5' },
            { chapter: 18, pages: '312' },
          ],
        },
        {
          name: 'Drugs, anaesthesia, constipation',
          extra: true,
          for: ['After surgery; anticholinergic or opioid; impacted stool'],
          refs: [],
        },
        {
          name: 'Urethral stricture, stone, phimosis or paraphimosis',
          for: ['Previous catheter or injury; tight or swollen foreskin'],
          refs: [{ chapter: 17, pages: '301', label: 'List 17.5' }],
        },
        {
          name: 'Infection (prostatitis, UTI)',
          for: ['Fever, burning; tender prostate'],
          refs: [
            { chapter: 17, pages: '299–300', label: 'List 17.3' },
          ],
        },
        {
          name: 'Pelvic mass, prolapse or tumour (women)',
          for: ['Pelvic mass on examination; previous pelvic cancer'],
          refs: [
            { chapter: 17, pages: '301', label: 'List 17.5' },
            { chapter: 18, pages: '312' },
          ],
        },
      ],
    },
  ],
  plan: [
    {
      heading: 'Extend the examination',
      refs: [
        { chapter: 19, pages: '319–322' },
      ],
      points: [
        { text: 'Bladder scan or catheter to measure the volume', extra: true },
        { text: 'Urine dipstick and culture' },
        { text: 'Kidney function and electrolytes' },
        { text: 'Ultrasound of the kidneys if the creatinine is high', extra: true },
      ],
    },
    {
      heading: 'Decide',
      refs: [{ chapter: 17, pages: '300–301' }],
      points: [
        { text: 'Any neurological signs: urgent spinal imaging', urgent: true, extra: true },
        { text: 'Relieve the retention (catheter); watch for a large urine output afterwards', extra: true },
        { text: 'Then follow the hospital’s urinary retention flowchart and checklist below' },
      ],
    },
  ],
};
