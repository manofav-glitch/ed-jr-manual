import type { BedsideTopic } from '../bedsideTypes.ts';
import { FIRST_LOOK, KIDNEY_EXAM } from './shared.ts';

export const lowUrineOutput: BedsideTopic = {
  id: 'low-urine-output',
  title: 'Decreased urine output',
  flowcharts: ['16.1'],
  reviewed: false,
  history: [
    FIRST_LOOK,
    {
      heading: 'How little, and for how long?',
      refs: [
        { chapter: 17, pages: '301–302', label: 'List 17.5' },
      ],
      points: [
        { text: 'How much urine in the last 24 hours? (oliguria: under 400 mL a day; anuria: under 50 mL)' },
        { text: 'No urine at all?', urgent: true, hint: 'Think obstruction first' },
        { text: 'Sudden (days) or over weeks?', hint: 'AKI, or rapidly progressive kidney failure' },
        { text: 'Known kidney disease, dialysis or transplant? Usual creatinine?' },
        { text: 'Is the bladder full but they cannot pass it?', hint: 'Retention' },
      ],
    },
    {
      heading: 'Pre-renal: fluid in, fluid out',
      refs: [{ chapter: 17, pages: '301', label: 'List 17.5' }],
      points: [
        { text: 'Vomiting, diarrhoea, poor intake', hint: 'Fluid loss' },
        { text: 'Bleeding: vomit, stools, trauma', urgent: true },
        { text: 'Fever, rigors, a source of infection', urgent: true, hint: 'Septic shock' },
        { text: 'Chest pain, breathlessness', urgent: true, hint: 'MI, heart failure' },
        { text: 'Liver disease with ascites', hint: 'Hepatorenal syndrome' },
      ],
    },
    {
      heading: 'Renal: what could damage the kidneys?',
      refs: [
        { chapter: 17, pages: '298, 301, 304', label: 'Questions box 17.1, List 17.5' },
      ],
      points: [
        { text: 'NSAIDs, ACE inhibitors, ARBs, diuretics; new medicines' },
        { text: 'Aminoglycosides; recent contrast scan' },
        { text: 'Muscle injury, crush, prolonged lying, fits; snake bite', urgent: true, hint: 'Rhabdomyolysis' },
        { text: 'Dark or red urine; rash; joint pain; coughing blood', hint: 'Glomerulonephritis, vasculitis, lupus' },
        { text: 'Back or bone pain, older patient', hint: 'Myeloma' },
        { text: 'Bloody diarrhoea first', hint: 'Haemolytic uraemic syndrome', extra: true },
      ],
    },
    {
      heading: 'Post-renal: is something blocking it?',
      refs: [{ chapter: 17, pages: '300–301', label: 'List 17.5' }],
      points: [
        { text: 'Poor stream, prostate trouble, catheter blocked' },
        { text: 'Colicky loin pain; known stones; single kidney' },
        { text: 'Pelvic or abdominal cancer, surgery or radiotherapy' },
      ],
    },
    {
      heading: 'Symptoms of uraemia',
      refs: [{ chapter: 17, pages: '297, 302', label: 'List 17.1' }],
      points: [
        { text: 'Loss of appetite, metallic taste, vomiting, hiccups, itch, tiredness' },
        { text: 'Swelling, breathlessness (fluid overload)', urgent: true },
        { text: 'Confusion, drowsiness, twitching', urgent: true },
        { text: 'Chest pain worse lying flat', urgent: true, hint: 'Uraemic pericarditis' },
      ],
    },
  ],
  exam: [
    {
      heading: 'Fluid status first',
      refs: [
        { chapter: 18, pages: '306, 310, 313' },
        { chapter: 3, pages: '46–47', label: 'Hydration' },
      ],
      points: [
        { text: 'Pulse, BP lying and standing, capillary refill', hint: 'Dry: pre-renal' },
        { text: 'JVP, basal crackles, oedema', urgent: true, hint: 'Overloaded: careful with fluids' },
        { text: 'Weight' },
        { text: 'Palpable bladder', urgent: true, hint: 'Retention: catheterise' },
      ],
    },
    ...KIDNEY_EXAM,
    {
      heading: 'Look specifically for',
      refs: [
        { chapter: 18, pages: '310, 312' },
        { chapter: 47, pages: '870', label: 'List 47.2' },
      ],
      points: [
        { text: 'Pericardial rub or signs of tamponade', urgent: true },
        { text: 'Tender, swollen muscles; pressure areas', hint: 'Rhabdomyolysis', extra: true },
        { text: 'Purpura, livedo, rash', hint: 'Vasculitis' },
        { text: 'Ulcers on the toes', hint: 'Atheroembolic disease' },
      ],
    },
  ],
  differentials: [
    {
      heading: 'Pre-renal',
      items: [
        {
          name: 'Fluid loss or bleeding',
          urgent: true,
          for: ['Vomiting, diarrhoea, haemorrhage; dry, postural drop'],
          refs: [{ chapter: 17, pages: '301', label: 'List 17.5' }],
        },
        {
          name: 'Low blood pressure (sepsis, MI, drugs)',
          urgent: true,
          for: ['Shocked; source of infection; chest pain'],
          refs: [{ chapter: 17, pages: '301', label: 'List 17.5' }],
        },
        {
          name: 'Renal artery problem (embolus, dissection) or hepatorenal syndrome',
          for: ['AF, aortic disease; liver failure'],
          refs: [{ chapter: 17, pages: '301', label: 'List 17.5' }],
        },
      ],
    },
    {
      heading: 'Renal',
      items: [
        {
          name: 'Acute tubular necrosis (ischaemia, toxins, contrast, rhabdomyolysis)',
          for: ['After shock, nephrotoxic drug, contrast or muscle injury'],
          refs: [{ chapter: 17, pages: '301', label: 'List 17.5' }],
        },
        {
          name: 'Acute-on-chronic kidney failure',
          for: ['Known CKD, with infection, dehydration, obstruction or a new drug'],
          refs: [{ chapter: 17, pages: '301', label: 'List 17.5' }],
        },
        {
          name: 'Glomerulonephritis or vasculitis',
          for: ['Blood and protein in the urine; hypertension; rash'],
          refs: [{ chapter: 17, pages: '299, 301', label: 'Table 17.1, List 17.5' }],
        },
        {
          name: 'Interstitial nephritis, myeloma, malignant hypertension',
          for: ['New drug (PPI, antibiotic); bone pain; very high BP'],
          refs: [{ chapter: 17, pages: '301', label: 'List 17.5' }],
        },
      ],
    },
    {
      heading: 'Post-renal (obstruction)',
      items: [
        {
          name: 'Bladder outflow obstruction (prostate, clot, stricture, blocked catheter)',
          urgent: true,
          for: ['Palpable bladder; anuria'],
          refs: [{ chapter: 17, pages: '301', label: 'List 17.5' }],
        },
        {
          name: 'Both ureters blocked (or a stone in a single kidney)',
          for: ['Loin pain; pelvic cancer or surgery; hydronephrosis'],
          refs: [{ chapter: 17, pages: '301', label: 'List 17.5' }],
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
        { text: 'Urine output measured (catheter if needed)' },
        { text: 'Urine: dipstick (blood, protein), microscopy, specific gravity' },
        { text: 'Creatinine, urea, potassium, bicarbonate; blood count' },
        { text: 'ECG for hyperkalaemia', urgent: true, extra: true },
        { text: 'Ultrasound for obstruction and kidney size (small: chronic)' },
      ],
    },
    {
      heading: 'Decide',
      refs: [{ chapter: 17, pages: '301' }],
      points: [
        { text: 'Exclude obstruction first in anuria', urgent: true },
        { text: 'Dry: fluids. Overloaded: no more fluid', extra: true },
        { text: 'High potassium, acidosis, overload or uraemic signs: urgent nephrology (dialysis)', urgent: true, extra: true },
        { text: 'Stop nephrotoxic drugs' },
        { text: 'Then follow the hospital’s decreased urine output flowchart below' },
      ],
    },
  ],
};
