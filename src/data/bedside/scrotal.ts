import type { BedsideTopic } from '../bedsideTypes.ts';
import { MALE_GENITAL_EXAM } from './shared.ts';

export const scrotal: BedsideTopic = {
  id: 'scrotal-swelling',
  title: 'Penile and scrotal swelling',
  flowcharts: ['16.5'],
  reviewed: false,
  history: [
    {
      heading: 'Danger first',
      refs: [
        { chapter: 18, pages: '313–314' },
        { chapter: 17, pages: '301', label: 'List 17.5' },
      ],
      points: [
        { text: 'Sudden severe testicular pain, especially in a young man; nausea or vomiting', urgent: true, hint: 'Torsion: time matters', extra: true },
        { text: 'Foreskin pulled back and now stuck behind a swollen glans', urgent: true, hint: 'Paraphimosis' },
        { text: 'Erection that will not go down', urgent: true, hint: 'Priapism', extra: true },
        { text: 'Lump in the groin and scrotum that is painful, with vomiting', urgent: true, hint: 'Strangulated inguinal hernia' },
        { text: 'Unable to pass urine', urgent: true },
      ],
    },
    {
      heading: 'The swelling',
      refs: [
        { chapter: 18, pages: '313–315', label: 'Fig. 18.10' },
        { chapter: 1, pages: '7–8' },
      ],
      points: [
        { text: 'Sudden or gradual? Painful or painless?' },
        { text: 'Does it go away when lying down or get bigger with coughing?', hint: 'Hernia' },
        { text: 'A lump in the testis itself?', urgent: true, hint: 'Tumour until proven otherwise' },
        { text: 'Fever, burning, discharge', hint: 'Epididymo-orchitis' },
        { text: 'Mumps (swollen parotids) about 5 days before?', hint: 'Mumps orchitis' },
        { text: 'Injury' },
      ],
    },
    {
      heading: 'Background',
      refs: [
        { chapter: 18, pages: '314', label: 'List 18.4' },
        { chapter: 17, pages: '303' },
      ],
      points: [
        { text: 'Sexual history; new partner; STI', hint: 'Epididymitis, ulcers' },
        { text: 'Heart failure, nephrotic syndrome, liver disease with ascites', hint: 'Scrotal oedema' },
        { text: 'Undescended testis in childhood', hint: 'Higher risk of tumour' },
        { text: 'Recent catheter or urology procedure' },
      ],
    },
  ],
  exam: [
    MALE_GENITAL_EXAM,
    {
      heading: 'Work out the swelling (book Fig. 18.10)',
      refs: [
        { chapter: 18, pages: '314–315', label: 'Figs 18.10, 18.11' },
      ],
      points: [
        { text: 'Can’t get above it', hint: 'Inguinoscrotal hernia' },
        { text: 'Part of the testis, solid (doesn’t light up)', urgent: true, hint: 'Tumour' },
        { text: 'Surrounds the testis and lights up', hint: 'Hydrocele' },
        { text: 'Separate from the testis, above and behind, lights up', hint: 'Epididymal cyst' },
        { text: 'Separate, doesn’t light up, tender', hint: 'Epididymitis' },
        { text: '“Bag of worms” above the testis', hint: 'Varicocele (new left one: think of a kidney tumour)' },
        { text: 'Exquisitely tender, hard testis', hint: 'Orchitis' },
        { text: 'High-riding testis lying across; absent cremasteric reflex', urgent: true, hint: 'Torsion', extra: true },
      ],
    },
    {
      heading: 'Also',
      refs: [
        { chapter: 18, pages: '310, 314' },
      ],
      points: [
        { text: 'Abdomen: kidney mass (with a varicocele); ascites' },
        { text: 'Oedema elsewhere: legs, sacrum' },
        { text: 'Urine dipstick' },
      ],
    },
  ],
  differentials: [
    {
      heading: 'Can’t miss',
      items: [
        {
          name: 'Testicular torsion',
          urgent: true,
          for: ['Affected testis sits higher and lies more horizontally than normal', 'Sudden severe pain (the history matters most)'],
          refs: [{ chapter: 18, pages: '313–314' }],
        },
        {
          name: 'Strangulated inguinoscrotal hernia',
          urgent: true,
          for: ['Can’t get above the swelling; tender, irreducible; vomiting'],
          refs: [
            { chapter: 18, pages: '314', label: 'Fig. 18.9' },
            { chapter: 15, pages: '273' },
          ],
        },
        {
          name: 'Paraphimosis',
          urgent: true,
          for: ['Retracted foreskin stuck behind a swollen glans'],
          refs: [{ chapter: 17, pages: '301', label: 'List 17.5' }],
        },
        {
          name: 'Testicular tumour',
          urgent: true,
          for: ['Painless, hard lump that is part of the testis; does not transilluminate'],
          refs: [{ chapter: 18, pages: '314' }],
        },
        {
          name: 'Fournier’s gangrene',
          urgent: true,
          extra: true,
          for: ['Diabetic; dusky, crepitant, very painful scrotal skin; septic'],
          refs: [],
        },
      ],
    },
    {
      heading: 'Common',
      items: [
        {
          name: 'Epididymo-orchitis',
          for: ['Tender, swollen epididymis or testis', 'Urethral discharge or urinary symptoms'],
          refs: [{ chapter: 18, pages: '314' }],
        },
        {
          name: 'Mumps orchitis',
          for: ['Very tender testis about 5 days after parotitis'],
          refs: [{ chapter: 18, pages: '314' }],
        },
        {
          name: 'Hydrocele',
          for: ['Painless; testis within it; lights up'],
          refs: [{ chapter: 18, pages: '314–315', label: 'Fig. 18.10' }],
        },
        {
          name: 'Epididymal cyst',
          for: ['Separate from the testis; lights up'],
          refs: [{ chapter: 18, pages: '314–315', label: 'Fig. 18.10' }],
        },
        {
          name: 'Varicocele',
          for: ['Bag of worms; usually left'],
          refs: [{ chapter: 18, pages: '314' }],
        },
        {
          name: 'Scrotal oedema',
          for: ['Heart failure, nephrotic syndrome, ascites; oedema elsewhere'],
          refs: [{ chapter: 18, pages: '314' }],
        },
        {
          name: 'Balanitis or genital lesions',
          for: ['Inflamed glans; ulcers; warts'],
          refs: [{ chapter: 18, pages: '314', label: 'List 18.4' }],
        },
      ],
    },
  ],
  plan: [
    {
      heading: 'Extend the examination',
      refs: [
        { chapter: 19, pages: '319' },
      ],
      points: [
        { text: 'Ultrasound of the scrotum for a mass' },
        { text: 'Urine dipstick and culture; swab any discharge' },
      ],
    },
    {
      heading: 'Decide',
      refs: [{ chapter: 18, pages: '313–314' }],
      points: [
        { text: 'Torsion suspected: urgent urology, do not delay for imaging', urgent: true, extra: true },
        { text: 'Paraphimosis: reduce it now', urgent: true, extra: true },
        { text: 'Solid testicular lump: urgent referral (tumour)' },
        { text: 'Then follow the hospital’s penile and scrotal swelling flowchart below' },
      ],
    },
  ],
};
