import type { BedsideTopic } from '../bedsideTypes.ts';
import { JOINT_EXAM } from './shared.ts';

export const jointPain: BedsideTopic = {
  id: 'joint-pain',
  title: 'Joint pain',
  flowcharts: ['10'],
  reviewed: false,
  history: [
    {
      heading: 'Which joints, and how?',
      refs: [
        { chapter: 23, pages: '363–365', label: 'Questions box 23.1, Lists 23.2, 23.3' },
      ],
      points: [
        { text: 'Which joints? Ask them to point', hint: 'Knee pain can come from the hip' },
        { text: 'One joint, a few (2–5), or many?', hint: 'Mono-, oligo- or polyarthritis' },
        { text: 'Swollen and red (arthritis), or painful only (arthralgia)?' },
        { text: 'Sudden or gradual onset? Getting better or worse?' },
        { text: 'Stiff in the morning for an hour or more?', hint: 'Inflammatory (e.g. rheumatoid arthritis)' },
        { text: 'Worse after use, better with rest; brief stiffness after sitting', hint: 'Osteoarthritis' },
        { text: 'Moves from joint to joint?', hint: 'Migratory arthritis (e.g. rheumatic fever)' },
        { text: 'Giving way, locking', hint: 'Mechanical, ligament' },
      ],
    },
    {
      heading: 'A single hot swollen joint',
      refs: [
        { chapter: 23, pages: '364–365', label: 'List 23.2, T&O’C essential' },
      ],
      points: [
        { text: 'Fever, rigors, feeling unwell', urgent: true, hint: 'Septic arthritis until proven otherwise' },
        { text: 'Rheumatoid arthritis, immunosuppressants, steroids, diabetes, a joint replacement', urgent: true, hint: 'Sepsis; signs may be masked' },
        { text: 'Injury or penetrating wound', hint: 'Traumatic, haemarthrosis, septic' },
        { text: 'Big toe, ankle or knee; heavy drinking; previous attacks', hint: 'Gout' },
        { text: 'Bleeding disorder, anticoagulants', hint: 'Haemarthrosis' },
      ],
    },
    {
      heading: 'Clues elsewhere',
      refs: [
        { chapter: 23, pages: '363, 367–369', label: 'List 23.1' },
      ],
      points: [
        { text: 'Recent diarrhoea, urethral discharge or new sexual partner', hint: 'Reactive or gonococcal arthritis' },
        { text: 'Sore throat a few weeks ago (in the young)', hint: 'Rheumatic fever' },
        { text: 'Rash, mouth ulcers, hair loss, Raynaud’s', hint: 'Lupus, connective tissue disease' },
        { text: 'Psoriasis (or in the family), nail pitting', hint: 'Psoriatic arthritis' },
        { text: 'Red eyes, back stiffness, bowel symptoms', hint: 'Spondyloarthritis, inflammatory bowel disease' },
        { text: 'Recent viral illness; travel to the tropics', hint: 'Viral arthritis (e.g. chikungunya, parvovirus)' },
        { text: 'Tick bite; TB contact', hint: 'Lyme; TB monoarthritis' },
      ],
    },
    {
      heading: 'Treatment and background',
      refs: [{ chapter: 23, pages: '368–369' }],
      points: [
        { text: 'Current and past arthritis drugs: NSAIDs, steroids, methotrexate, biologics', hint: 'Side effects; infection risk (TB)' },
        { text: 'Kidney disease, diabetes', hint: 'Gout' },
        { text: 'Family history: RA, gout, psoriasis, IBD, haemochromatosis, bleeding disorder' },
        { text: 'How it affects work and daily life' },
      ],
    },
  ],
  exam: [
    {
      heading: 'First',
      refs: [
        { chapter: 47, pages: '871' },
        { chapter: 23, pages: '365', label: 'T&O’C essential' },
      ],
      points: [
        { text: 'Temperature, pulse, BP', urgent: true, hint: 'Septic' },
        { text: 'Can they move the joint at all? (septic joints are often too painful to touch)' },
      ],
    },
    ...JOINT_EXAM,
    {
      heading: 'Look specifically for',
      refs: [
        { chapter: 25, pages: '408–413' },
        { chapter: 23, pages: '366', label: 'List 23.4' },
      ],
      points: [
        { text: 'Tophi: ear helix, olecranon, fingers, Achilles', hint: 'Chronic gout' },
        { text: 'Rheumatoid nodules; ulnar deviation, swan-neck fingers' },
        { text: 'Heberden’s and Bouchard’s nodes', hint: 'Osteoarthritis' },
        { text: 'Psoriasis, nail pitting, sausage digits', hint: 'Psoriatic arthritis' },
        { text: 'Pustules on the skin, tenosynovitis', hint: 'Gonococcal', extra: true },
        { text: 'Red eye, mouth ulcers, genital lesions', hint: 'Reactive arthritis, Behçet’s' },
        { text: 'Heart murmur', hint: 'Rheumatic fever, endocarditis' },
      ],
    },
  ],
  differentials: [
    {
      heading: 'One hot joint (book List 23.2)',
      items: [
        {
          name: 'Septic arthritis',
          urgent: true,
          for: ['Hot, very tender, can’t move it; fever', 'RA, immunosuppression, diabetes, prosthetic joint, wound'],
          against: ['Immunosuppressants mask the signs of sepsis'],
          refs: [{ chapter: 23, pages: '364–365', label: 'List 23.2' }],
        },
        {
          name: 'Gout',
          for: ['Big toe (75%), ankle, knee; sudden; alcohol, kidney disease; tophi'],
          refs: [
            { chapter: 23, pages: '364', label: 'List 23.2' },
            { chapter: 25, pages: '412–413' },
          ],
        },
        {
          name: 'Pseudogout (calcium pyrophosphate)',
          for: ['Older; knee or wrist'],
          refs: [{ chapter: 25, pages: '413' }],
        },
        {
          name: 'Trauma or haemarthrosis',
          for: ['Injury; anticoagulants or bleeding disorder; rapid swelling'],
          refs: [{ chapter: 23, pages: '364', label: 'List 23.2' }],
        },
        {
          name: 'Reactive arthritis',
          for: ['After gut or genital infection; knees, ankles; eyes, urethritis'],
          refs: [
            { chapter: 23, pages: '364–369', label: 'List 23.4' },
          ],
        },
      ],
    },
    {
      heading: 'Many joints (book Lists 23.3, 23.4)',
      items: [
        {
          name: 'Viral or bacterial (including gonococcal) infection',
          for: ['Acute; fever; rash; recent illness or travel'],
          refs: [
            { chapter: 23, pages: '365, 368', label: 'List 23.3' },
          ],
        },
        {
          name: 'Rheumatoid arthritis',
          for: ['Symmetrical small joints of hands and feet, wrists; morning stiffness over an hour'],
          refs: [
            { chapter: 23, pages: '365–366', label: 'Lists 23.3, 23.4' },
            { chapter: 25, pages: '408–409' },
          ],
        },
        {
          name: 'Osteoarthritis',
          for: ['Older; knees, hips, hands (DIP, PIP, thumb base); worse with use; bony swelling, crepitus'],
          refs: [
            { chapter: 23, pages: '366', label: 'List 23.4' },
            { chapter: 24, pages: '372', label: 'List 24.2' },
          ],
        },
        {
          name: 'Spondyloarthritis (ankylosing spondylitis, psoriatic, reactive, IBD)',
          for: ['Back and sacroiliac joints, large joints, asymmetrical; skin, eye, bowel clues'],
          refs: [{ chapter: 23, pages: '366', label: 'List 23.4' }],
        },
        {
          name: 'Connective tissue disease (lupus) or vasculitis',
          for: ['Rash, mouth ulcers, Raynaud’s, fever, kidney involvement'],
          refs: [
            { chapter: 23, pages: '365, 368', label: 'List 23.3' },
            { chapter: 25, pages: '414, 421', label: 'Table 25.1' },
          ],
        },
        {
          name: 'Acute rheumatic fever',
          for: ['Young; migratory large-joint arthritis after a sore throat; murmur'],
          refs: [
            { chapter: 23, pages: '369' },
            { chapter: 25, pages: '420' },
          ],
        },
      ],
    },
    {
      heading: 'Not the joint itself',
      items: [
        {
          name: 'Bursitis, tendinitis, enthesitis',
          for: ['Tender over a tendon or bursa; pain in one direction of movement only'],
          refs: [
            { chapter: 24, pages: '373' },
            { chapter: 25, pages: '421–424' },
          ],
        },
        {
          name: 'Cellulitis over a joint',
          for: ['Spreading redness of the skin'],
          refs: [{ chapter: 43, pages: '817' }],
        },
        {
          name: 'Referred pain or polymyalgia rheumatica',
          for: ['Hip disease felt in the knee; shoulder and hip girdle stiffness over 50'],
          refs: [{ chapter: 23, pages: '363, 367', label: 'Fig. 23.1' }],
        },
      ],
    },
  ],
  plan: [
    {
      heading: 'Extend the examination',
      refs: [
        { chapter: 23, pages: '365', label: 'T&O’C essential' },
        { chapter: 26, pages: '429–433', label: 'Table 26.1' },
      ],
      points: [
        { text: 'Aspirate a suspected septic joint: it is an emergency', urgent: true },
        { text: 'Joint fluid: cell count, Gram stain and culture, crystals' },
        { text: 'Blood count, CRP or ESR, urate, blood cultures if febrile', extra: true },
        { text: 'X-ray of the joint', extra: true },
      ],
    },
    {
      heading: 'Decide',
      refs: [{ chapter: 23, pages: '365', label: 'T&O’C essential' }],
      points: [
        { text: 'Single hot joint in a patient with RA, or on immunosuppressants: presume septic', urgent: true },
        { text: 'Septic arthritis: antibiotics after aspiration, and orthopaedic review', urgent: true, extra: true },
        { text: 'Then follow the hospital’s joint pain flowchart below' },
      ],
    },
  ],
};
