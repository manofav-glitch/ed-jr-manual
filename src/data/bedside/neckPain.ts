import type { BedsideTopic } from '../bedsideTypes.ts';
import { NEURO_EXAM } from './shared.ts';

export const neckPain: BedsideTopic = {
  id: 'neck-pain',
  title: 'Neck pain',
  flowcharts: ['9.4'],
  reviewed: false,
  history: [
    {
      heading: 'Danger questions',
      refs: [
        { chapter: 24, pages: '389' },
        { chapter: 31, pages: '491–492', label: 'Questions box 31.3' },
        { chapter: 23, pages: '367' },
      ],
      points: [
        { text: 'Injury: fall, road accident, whiplash, manipulation?', urgent: true, hint: 'Possible spinal cord injury: immobilise' },
        { text: 'Weakness or numbness in the arms or legs; bladder or bowel trouble', urgent: true, hint: 'Cord compression' },
        { text: 'Fever, headache, light sensitivity, rash', urgent: true, hint: 'Meningitis' },
        { text: 'Sudden severe headache with neck pain', urgent: true, hint: 'Subarachnoid haemorrhage' },
        { text: 'Rheumatoid arthritis with occipital headache and shooting pains in the arms', urgent: true, hint: 'Atlanto-axial subluxation' },
        { text: 'Pain in the front of the neck with exertion, sweating or breathlessness', urgent: true, hint: 'Referred cardiac pain' },
        { text: 'Fever with pain on swallowing, neck swelling', urgent: true, hint: 'Deep neck infection', extra: true },
        { text: 'Weight loss, night pain, known cancer', urgent: true, hint: 'Metastases', extra: true },
      ],
    },
    {
      heading: 'The pain',
      refs: [{ chapter: 24, pages: '389–391' }],
      points: [
        { text: 'Back of the neck (spine, muscles, nerve roots) or front (oesophagus, trachea, thyroid, muscles)?' },
        { text: 'Sudden (disc) or gradual (degeneration, posture)?' },
        { text: 'Pain or pins and needles down one arm', hint: 'Nerve root (radiculopathy)' },
        { text: 'Work or hobbies with long neck extension; phone held on the shoulder', hint: 'Postural strain' },
        { text: 'Twisted neck that can’t be straightened', hint: 'Torticollis (dystonia, root problem)' },
        { text: 'Stiff neck with an occipital headache', hint: 'Cervical spondylosis' },
      ],
    },
    {
      heading: 'Background',
      refs: [
        { chapter: 23, pages: '367–369' },
        { chapter: 31, pages: '498', label: 'List 31.4' },
      ],
      points: [
        { text: 'Rheumatoid arthritis, ankylosing spondylitis' },
        { text: 'Major tranquillisers (antipsychotics)', hint: 'Dystonia' },
        { text: 'Occupation' },
      ],
    },
  ],
  exam: [
    {
      heading: 'First',
      refs: [
        { chapter: 24, pages: '389' },
        { chapter: 32, pages: '501' },
      ],
      points: [
        { text: 'If injured: keep the neck still and assess for cord injury before moving it', urgent: true },
        { text: 'Temperature' },
        { text: 'Neck stiffness to flexion (with free rotation) and Kernig’s sign', urgent: true, hint: 'Meningism. Stiffness in all directions: spondylosis, Parkinson’s' },
      ],
    },
    {
      heading: 'The neck',
      refs: [{ chapter: 24, pages: '391–392', label: 'Figs 24.25–24.27' }],
      points: [
        { text: 'Look: posture, head tilt, deformity' },
        { text: 'Move actively: flexion and extension (45°), side bending (45°), rotation (70°)' },
        { text: 'Feel spinous processes and facet joints (a finger’s breadth from the midline)' },
        { text: 'Spurling’s test: extend and rotate towards the painful side', hint: 'Reproduces root pain' },
        { text: 'Relief with the hand on the head', hint: 'Root compression' },
        { text: 'Front of the neck: thyroid, lymph nodes, swelling' },
      ],
    },
    ...NEURO_EXAM.slice(3, 4),
    {
      heading: 'Also',
      refs: [
        { chapter: 24, pages: '388–392' },
      ],
      points: [
        { text: 'Shoulders (pain can come from either)' },
        { text: 'Legs: upper motor neurone signs', urgent: true, hint: 'Cervical myelopathy' },
        { text: 'Heart and ECG if the pain is anterior and exertional', extra: true },
      ],
    },
  ],
  differentials: [
    {
      heading: 'Can’t miss',
      items: [
        {
          name: 'Spinal cord injury or compression (trauma, disc, tumour, abscess, RA)',
          urgent: true,
          for: ['Injury; arm or leg weakness; sensory level; sphincter change'],
          refs: [
            { chapter: 24, pages: '389' },
            { chapter: 35, pages: '585–587', label: 'List 35.7' },
          ],
        },
        {
          name: 'Meningitis or subarachnoid haemorrhage',
          urgent: true,
          for: ['Neck stiffness to flexion with headache; fever; sudden onset (SAH)'],
          refs: [
            { chapter: 32, pages: '501' },
            { chapter: 31, pages: '491–492' },
          ],
        },
        {
          name: 'Atlanto-axial subluxation in rheumatoid arthritis',
          urgent: true,
          for: ['RA; occipital headache; shooting paraesthesias in the arms; neck flexion dangerous'],
          refs: [{ chapter: 23, pages: '367' }],
        },
        {
          name: 'Referred cardiac pain',
          urgent: true,
          for: ['Front of the neck or jaw; exertional; risk factors'],
          refs: [
            { chapter: 24, pages: '389' },
            { chapter: 4, pages: '61–62' },
          ],
        },
        {
          name: 'Vertebral or carotid artery dissection',
          urgent: true,
          extra: true,
          for: ['Neck pain after minor trauma or manipulation, with headache, Horner’s or stroke signs'],
          refs: [],
        },
      ],
    },
    {
      heading: 'Common',
      items: [
        {
          name: 'Muscle and postural strain',
          for: ['Overuse, posture; stiffness and spasm; no neurological signs'],
          refs: [{ chapter: 24, pages: '390' }],
        },
        {
          name: 'Cervical radiculopathy (disc or spondylosis)',
          for: ['Arm pain or paraesthesia in a root distribution; positive Spurling’s'],
          refs: [{ chapter: 24, pages: '390–392' }],
        },
        {
          name: 'Cervical spondylosis',
          for: ['Older; gradual; stiffness; occipital headache'],
          refs: [
            { chapter: 31, pages: '491' },
            { chapter: 24, pages: '390' },
          ],
        },
        {
          name: 'Torticollis (muscle spasm, dystonia)',
          for: ['Twisted neck; major tranquillisers'],
          refs: [{ chapter: 24, pages: '391' }],
        },
        {
          name: 'Thyroid, oesophagus or lymph nodes (front of the neck)',
          for: ['Pain in the front of the neck; swallowing pain'],
          refs: [{ chapter: 24, pages: '389' }],
        },
      ],
    },
  ],
  plan: [
    {
      heading: 'Extend the examination',
      refs: [{ chapter: 26, pages: '429–431' }],
      points: [
        { text: 'Cervical spine imaging after injury, by a decision rule', extra: true },
        { text: 'MRI if neurological signs', extra: true },
        { text: 'ECG if the pain could be cardiac', extra: true },
      ],
    },
    {
      heading: 'Decide',
      refs: [{ chapter: 24, pages: '389' }],
      points: [
        { text: 'After injury, consider cord injury and protect the neck', urgent: true },
        { text: 'Neurological signs or meningism: urgent', urgent: true },
        { text: 'Then follow the hospital’s neck pain flowchart below' },
      ],
    },
  ],
};
