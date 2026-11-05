import type { BedsideTopic } from '../bedsideTypes.ts';
import { FIRST_LOOK, NEURO_EXAM } from './shared.ts';

export const stroke: BedsideTopic = {
  id: 'stroke',
  title: 'Paralysis and suspected stroke',
  flowcharts: ['8.3'],
  reviewed: false,
  history: [
    FIRST_LOOK,
    {
      heading: 'Time first',
      refs: [
        { chapter: 31, pages: '489–490', label: 'Questions box 31.1' },
      ],
      points: [
        { text: 'When were they last seen well? (if they woke with it, the time they went to sleep)', urgent: true, hint: 'Decides whether clot-busting treatment is possible' },
        { text: 'Seconds to minutes onset?', hint: 'Vascular (infarct or bleed)' },
        { text: 'Getting better, worse, or gone?', hint: 'Gone completely: TIA (still urgent)' },
      ],
    },
    {
      heading: 'What has happened?',
      refs: [
        { chapter: 31, pages: '489–490', label: 'Questions box 31.1' },
      ],
      points: [
        { text: 'Weakness or numbness: face, arm, leg; which side?' },
        { text: 'Speech: slurred, or wrong words, or can’t understand' },
        { text: 'Vision: loss in one eye, half the field, double vision' },
        { text: 'Dizziness, unsteadiness, swallowing trouble', hint: 'Posterior circulation' },
        { text: 'Sudden severe headache, vomiting, drowsiness', urgent: true, hint: 'Haemorrhage' },
      ],
    },
    {
      heading: 'Mimics to ask about',
      refs: [
        { chapter: 31, pages: '490, 494' },
        { chapter: 35, pages: '582' },
      ],
      points: [
        { text: 'Diabetes and its treatment', urgent: true, hint: 'Hypoglycaemia can mimic stroke' },
        { text: 'A fit before the weakness', hint: 'Todd’s palsy' },
        { text: 'Migraine with one-sided weakness before', hint: 'Hemiplegic migraine' },
        { text: 'Weeks of headache, weight loss, cancer', hint: 'Tumour' },
        { text: 'Fever, valve disease, injecting drugs', hint: 'Abscess, endocarditis with emboli' },
        { text: 'Recent fall or head injury', hint: 'Subdural haematoma', extra: true },
      ],
    },
    {
      heading: 'Risk factors and treatment',
      refs: [
        { chapter: 31, pages: '489–490, 497', label: 'List 31.1, Questions box 31.1' },
      ],
      points: [
        { text: 'Previous stroke or TIA; how it affected them' },
        { text: 'High BP, high cholesterol, diabetes, smoking' },
        { text: 'Palpitations or AF', hint: 'Embolic stroke' },
        { text: 'Anticoagulants or antiplatelets: which, last dose', urgent: true, hint: 'Bleeding risk; affects treatment' },
        { text: 'Heart valve problem, fever', hint: 'Endocarditis' },
        { text: 'Family history of stroke' },
        { text: 'Function before this: walking, living alone, work' },
      ],
    },
  ],
  exam: [
    {
      heading: 'First',
      refs: [
        { chapter: 47, pages: '867–870' },
        { chapter: 35, pages: '602', label: 'Table 35.4' },
      ],
      points: [
        { text: 'Blood sugar', urgent: true },
        { text: 'GCS; airway; gag reflex', urgent: true },
        { text: 'Nil by mouth until the swallow is assessed', extra: true },
        { text: 'BP in both arms; pulse rhythm (AF)' },
        { text: 'Temperature' },
      ],
    },
    ...NEURO_EXAM,
    {
      heading: 'Which territory? (book Table 35.1)',
      refs: [
        { chapter: 35, pages: '580–582', label: 'Table 35.1, List 35.1, List 35.2' },
      ],
      points: [
        { text: 'Face and arm weaker than leg; dysphasia or neglect; hemianopia', hint: 'Middle cerebral artery' },
        { text: 'Leg weaker than arm; incontinence', hint: 'Anterior cerebral artery' },
        { text: 'Hemianopia, one-sided sensory loss, no weakness', hint: 'Posterior cerebral artery' },
        { text: 'Pure weakness of face, arm and leg, no cortical signs', hint: 'Internal capsule (lacunar)' },
        { text: 'Crossed signs (face one side, limbs the other), cerebellar signs, Horner’s, lower cranial nerves', hint: 'Brainstem (vertebrobasilar)' },
        { text: 'Leg affected: lesion at L1 or above; arm: C3 or above; face: pons or above; double vision: midbrain or above' },
        { text: 'Carotid bruit; murmur', hint: 'Source of emboli' },
      ],
    },
  ],
  differentials: [
    {
      heading: 'Stroke',
      items: [
        {
          name: 'Ischaemic stroke (thrombosis or embolism)',
          urgent: true,
          for: ['Focal deficit over minutes in a vascular territory', 'AF, carotid disease, vascular risk factors'],
          refs: [{ chapter: 35, pages: '580–582', label: 'Table 35.1' }],
        },
        {
          name: 'Intracerebral or subarachnoid haemorrhage',
          urgent: true,
          for: ['Headache, vomiting, falling consciousness, very high BP; anticoagulants'],
          against: ['Cannot be told from infarction reliably without a scan'],
          refs: [
            { chapter: 35, pages: '581' },
            { chapter: 31, pages: '489' },
          ],
        },
        {
          name: 'Transient ischaemic attack',
          urgent: true,
          for: ['Focal symptoms that resolve fully, usually within an hour or two'],
          refs: [{ chapter: 35, pages: '580' }],
        },
        {
          name: 'Aortic dissection involving the carotids',
          urgent: true,
          for: ['Chest or back pain; pulse or BP difference between the arms'],
          refs: [{ chapter: 7, pages: '122' }],
        },
      ],
    },
    {
      heading: 'Mimics',
      items: [
        {
          name: 'Hypoglycaemia',
          urgent: true,
          for: ['Low sugar; diabetic on treatment'],
          refs: [{ chapter: 47, pages: '867' }],
        },
        {
          name: 'Todd’s palsy after a seizure',
          for: ['Witnessed fit; weakness fades over hours'],
          refs: [{ chapter: 31, pages: '494' }],
        },
        {
          name: 'Hemiplegic migraine',
          for: ['Weakness then headache; previous attacks'],
          against: ['In older patients there may be no headache, so it is hard to tell from TIA'],
          refs: [{ chapter: 31, pages: '490' }],
        },
        {
          name: 'Tumour, abscess, subdural haematoma',
          for: ['Gradual onset; headache; papilloedema; fever; fall'],
          refs: [{ chapter: 35, pages: '582, 601' }],
        },
        {
          name: 'Bell’s palsy',
          for: ['Whole of one side of the face, including the forehead; no limb signs'],
          refs: [{ chapter: 36, pages: '609' }],
        },
      ],
    },
  ],
  plan: [
    {
      heading: 'Extend the examination',
      refs: [{ chapter: 35, pages: '580–582' }],
      points: [
        { text: 'Blood sugar; ECG (AF)' },
        { text: 'Urgent CT head (bleed or not?)', urgent: true, extra: true },
        { text: 'Stroke score (e.g. NIHSS) recorded', extra: true },
        { text: 'Clotting if on anticoagulants', extra: true },
      ],
    },
    {
      heading: 'Decide',
      refs: [{ chapter: 31, pages: '489–490' }],
      points: [
        { text: 'Within the time window: stroke team now, for thrombolysis or clot retrieval', urgent: true, extra: true },
        { text: 'Swallow screen before any food, drink or tablets', extra: true },
        { text: 'TIA: still needs urgent assessment and secondary prevention', extra: true },
        { text: 'Then follow the hospital’s stroke flowchart and checklist below' },
      ],
    },
  ],
};
