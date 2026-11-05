import type { BedsideTopic } from '../bedsideTypes.ts';
import { NEURO_EXAM } from './shared.ts';

export const legWeakness: BedsideTopic = {
  id: 'leg-weakness',
  title: 'Weakness in both lower limbs',
  flowcharts: ['8.2'],
  reviewed: false,
  history: [
    {
      heading: 'Danger questions',
      refs: [
        { chapter: 35, pages: '583–588', label: 'List 35.7' },
        { chapter: 31, pages: '490' },
      ],
      points: [
        { text: 'How fast: sudden, over hours to days, or months?', hint: 'Sudden: vascular, trauma. Days: GBS, compression, myelitis' },
        { text: 'Back or neck pain; known cancer; fever; injection drug use; recent injury', urgent: true, hint: 'Cord compression: tumour, abscess, fracture, disc' },
        { text: 'Bladder: retention or incontinence; bowel change', urgent: true },
        { text: 'Numb saddle area', urgent: true, hint: 'Cauda equina' },
        { text: 'Numbness up to a level on the trunk', urgent: true, hint: 'Spinal cord' },
        { text: 'Weakness rising to the arms; breathless; trouble swallowing', urgent: true, hint: 'Guillain–Barré' },
        { text: 'Sudden severe back or chest pain, cold legs', urgent: true, hint: 'Aortic dissection or occlusion (spinal ischaemia)' },
      ],
    },
    {
      heading: 'Clues to the cause',
      refs: [
        { chapter: 35, pages: '583–592', label: 'Lists 35.4, 35.8' },
      ],
      points: [
        { text: 'Diarrhoea or infection a week or two ago', hint: 'Guillain–Barré' },
        { text: 'Vomiting, diarrhoea, diuretics; previous attacks', hint: 'Low potassium periodic paralysis' },
        { text: 'Numb, burning feet; diabetes, alcohol', hint: 'Peripheral neuropathy' },
        { text: 'Trouble rising from a chair or climbing stairs; muscle pain; statins, steroids', hint: 'Myopathy' },
        { text: 'Previous neurological episodes; vision loss', hint: 'Multiple sclerosis (transverse myelitis)' },
        { text: 'TB, cancer', hint: 'Vertebral collapse' },
        { text: 'Pain in the calves on walking, eased by sitting or bending forward', hint: 'Spinal stenosis (not vascular claudication)' },
      ],
    },
  ],
  exam: [
    {
      heading: 'First',
      refs: [
        { chapter: 35, pages: '584' },
        { chapter: 6, pages: '109–114' },
      ],
      points: [
        { text: 'Breathing: rate, effort; FVC if weakness is spreading', urgent: true },
        { text: 'Palpable bladder', urgent: true, hint: 'Painless retention: cord or cauda equina' },
        { text: 'Leg pulses and temperature', hint: 'Acute arterial occlusion: pain, pallor, pulseless, paraesthesia, cold, paralysed' },
      ],
    },
    ...NEURO_EXAM,
    {
      heading: 'Where is the lesion? (book List 35.7)',
      refs: [
        { chapter: 35, pages: '583–590', label: 'List 35.7, Table 35.2' },
      ],
      points: [
        { text: 'Upper motor neurone legs (stiff, brisk reflexes, upgoing plantars) with a sensory level', urgent: true, hint: 'Cord: lower motor neurone signs at the level, upper below' },
        { text: 'Arms affected too?', hint: 'Cervical cord or above' },
        { text: 'Flaccid, areflexic legs with saddle loss and absent anal reflex', urgent: true, hint: 'Cauda equina' },
        { text: 'Flaccid, areflexic, ascending, patchy sensory loss, sphincters spared', urgent: true, hint: 'Guillain–Barré' },
        { text: 'Proximal weakness, normal sensation, reflexes reduced', hint: 'Myopathy' },
        { text: 'Distal weakness with glove-and-stocking loss', hint: 'Neuropathy' },
        { text: 'Back: deformity, tenderness over a vertebra', urgent: true },
      ],
    },
  ],
  differentials: [
    {
      heading: 'Can’t miss',
      items: [
        {
          name: 'Spinal cord compression (metastases, abscess, disc, fracture, TB)',
          urgent: true,
          for: ['Back pain; sensory level; upper motor neurone legs; bladder change', 'Known cancer, fever, injury'],
          refs: [{ chapter: 35, pages: '585–587', label: 'List 35.7' }],
        },
        {
          name: 'Cauda equina syndrome',
          urgent: true,
          for: ['Saddle numbness, absent anal reflex, retention; lower motor neurone legs'],
          refs: [{ chapter: 35, pages: '586–590', label: 'Table 35.2' }],
        },
        {
          name: 'Guillain–Barré syndrome',
          urgent: true,
          for: ['Ascending flaccid weakness, areflexia, after infection; back pain common'],
          refs: [{ chapter: 35, pages: '583–584' }],
        },
        {
          name: 'Hypokalaemic periodic paralysis',
          urgent: true,
          for: ['Sudden flaccid weakness; low potassium; previous attacks'],
          refs: [{ chapter: 35, pages: '591', label: 'List 35.8' }],
        },
        {
          name: 'Anterior spinal artery occlusion or aortic dissection',
          urgent: true,
          for: ['Sudden paraplegia; pain and temperature lost, vibration kept; back or chest pain'],
          refs: [
            { chapter: 35, pages: '588–589' },
            { chapter: 7, pages: '122' },
          ],
        },
      ],
    },
    {
      heading: 'Other',
      items: [
        {
          name: 'Transverse myelitis or multiple sclerosis',
          for: ['Subacute; sensory level; previous episodes'],
          refs: [{ chapter: 35, pages: '584–585, 588' }],
        },
        {
          name: 'Subacute combined degeneration (B₁₂)',
          for: ['Vibration and position loss, upgoing plantars, absent ankle jerks'],
          refs: [{ chapter: 35, pages: '588–589' }],
        },
        {
          name: 'Peripheral neuropathy or myopathy',
          for: ['Distal (neuropathy) or proximal (myopathy) weakness; known cause'],
          refs: [{ chapter: 35, pages: '583–592', label: 'Lists 35.4, 35.8' }],
        },
        {
          name: 'Anterior cerebral artery stroke or another midline brain lesion',
          for: ['Upper motor neurone legs without a sensory level; incontinence'],
          refs: [{ chapter: 35, pages: '582', label: 'Table 35.1' }],
        },
      ],
    },
  ],
  plan: [
    {
      heading: 'Extend the examination',
      refs: [{ chapter: 35, pages: '584–587' }],
      points: [
        { text: 'Bladder scan or catheter for residual volume', extra: true },
        { text: 'Potassium, blood sugar, CK, inflammatory markers', extra: true },
        { text: 'FVC repeated if Guillain–Barré is possible' },
      ],
    },
    {
      heading: 'Decide',
      refs: [{ chapter: 35, pages: '584–586' }],
      points: [
        { text: 'Sensory level, saddle loss, sphincter change or back tenderness: urgent MRI of the spine', urgent: true, extra: true },
        { text: 'Falling FVC: ICU review', urgent: true, extra: true },
        { text: 'Then follow the hospital’s lower limb weakness flowchart below' },
      ],
    },
  ],
};
