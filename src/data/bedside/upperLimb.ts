import type { BedsideTopic } from '../bedsideTypes.ts';
import { JOINT_EXAM } from './shared.ts';

export const upperLimb: BedsideTopic = {
  id: 'upper-limb-pain',
  title: 'Upper limb pain and swelling',
  flowcharts: ['9.2'],
  reviewed: false,
  history: [
    {
      heading: 'Danger questions',
      refs: [
        { chapter: 4, pages: '61–68', label: 'List 4.1' },
        { chapter: 23, pages: '367' },
      ],
      points: [
        { text: 'Left (or both) arm pain with chest tightness, sweating, on exertion', urgent: true, hint: 'Angina or myocardial infarction' },
        { text: 'Sudden severe pain; cold, pale, numb hand', urgent: true, hint: 'Acute arterial occlusion (6 Ps)' },
        { text: 'Whole arm swollen and aching, with prominent veins', urgent: true, hint: 'Venous thrombosis' },
        { text: 'Face and both arms swollen, headache, breathless', urgent: true, hint: 'Superior vena cava obstruction' },
        { text: 'Spreading redness, fever', urgent: true, hint: 'Cellulitis; necrotising infection if pain is severe and skin dusky' },
        { text: 'Pain out of proportion, tight swollen forearm after injury or a crush', urgent: true, hint: 'Compartment syndrome', extra: true },
      ],
    },
    {
      heading: 'Where does it come from?',
      refs: [
        { chapter: 23, pages: '366–367' },
        { chapter: 24, pages: '383–391' },
      ],
      points: [
        { text: 'Injury? How did it happen?' },
        { text: 'A joint: shoulder, elbow, wrist, fingers; one or several?' },
        { text: 'Shoulder pain on lifting the arm or reaching behind; older (over 50)', hint: 'Rotator cuff' },
        { text: 'Shoulder stiff in all directions', hint: 'Frozen shoulder or arthritis' },
        { text: 'Neck pain; pain or tingling in a strip down the arm', hint: 'Cervical root' },
        { text: 'Tingling in the thumb and fingers at night', hint: 'Carpal tunnel syndrome' },
        { text: 'Shoulder and hip girdle stiffness over 50', hint: 'Polymyalgia rheumatica' },
        { text: 'Smoker with shoulder pain and hand weakness', hint: 'Apical lung cancer (brachial plexus)' },
      ],
    },
    {
      heading: 'Swelling',
      refs: [
        { chapter: 6, pages: '109' },
        { chapter: 43, pages: '817' },
      ],
      points: [
        { text: 'Whole arm, or around one joint?' },
        { text: 'Pitting or non-pitting?', hint: 'Non-pitting: lymphoedema' },
        { text: 'After breast cancer surgery, node removal or radiotherapy', hint: 'Lymphoedema', extra: true },
        { text: 'Cannula, central line, dialysis fistula, injecting into the arm', hint: 'Thrombosis, infection', extra: true },
        { text: 'Recent insect bite, scratch or wound', hint: 'Cellulitis' },
      ],
    },
  ],
  exam: [
    {
      heading: 'Circulation and skin first',
      refs: [
        { chapter: 6, pages: '109–114' },
        { chapter: 4, pages: '68' },
        { chapter: 43, pages: '817–818' },
      ],
      points: [
        { text: 'Radial and brachial pulses; colour, temperature, capillary refill', urgent: true },
        { text: 'Compare both arms: size, swelling, veins' },
        { text: 'Redness: spreading edge (mark it), lymphangitis, tender axillary nodes', hint: 'Cellulitis' },
        { text: 'Severe pain, pale or dusky skin, signs of sepsis', urgent: true, hint: 'Necrotising fasciitis' },
        { text: 'Face, neck and chest veins', hint: 'SVC obstruction' },
      ],
    },
    ...JOINT_EXAM,
    {
      heading: 'Shoulder (book pp 384–388)',
      refs: [{ chapter: 24, pages: '384–388' }],
      points: [
        { text: 'Apley scratch test: over the shoulder, behind the neck, behind the back' },
        { text: 'Painful arc in mid abduction (45–135°)', hint: 'Rotator cuff' },
        { text: 'Drop-arm test', hint: 'Supraspinatus tear' },
        { text: 'Cross-arm test', hint: 'Acromioclavicular joint' },
        { text: 'Deltoid wasting (shoulder) vs trapezius wasting (neck)' },
      ],
    },
    {
      heading: 'Also',
      refs: [
        { chapter: 24, pages: '388–392' },
        { chapter: 12, pages: '201', label: 'Text box 12.1' },
      ],
      points: [
        { text: 'Neck movements; Spurling’s test' },
        { text: 'Axilla: nodes, mass' },
        { text: 'Hand: wasting of small muscles, Horner’s syndrome', hint: 'Apical lung tumour' },
        { text: 'ECG if the pain could be cardiac', extra: true },
      ],
    },
  ],
  differentials: [
    {
      heading: 'Can’t miss',
      items: [
        {
          name: 'Acute coronary syndrome',
          urgent: true,
          for: ['Arm pain (left, right or both) with chest discomfort, sweating, exertion'],
          refs: [{ chapter: 4, pages: '61–63', label: 'Good symptoms guide 4.1' }],
        },
        {
          name: 'Acute arterial occlusion',
          urgent: true,
          for: ['Pain, pallor, pulseless, paraesthesia, perishingly cold, paralysis', 'AF or recent MI (embolus)'],
          refs: [
            { chapter: 4, pages: '68' },
            { chapter: 23, pages: '367' },
          ],
        },
        {
          name: 'Upper limb venous thrombosis',
          urgent: true,
          for: ['Diffuse aching pain with swelling'],
          refs: [{ chapter: 23, pages: '367' }],
        },
        {
          name: 'Necrotising fasciitis or severe cellulitis',
          urgent: true,
          for: ['Severe pain, pale pink rather than red skin, sepsis'],
          refs: [{ chapter: 43, pages: '817–818' }],
        },
        {
          name: 'Compartment syndrome',
          urgent: true,
          extra: true,
          for: ['After a fracture or crush; pain on passive finger stretch; tense forearm'],
          refs: [],
        },
        {
          name: 'Superior vena cava obstruction',
          urgent: true,
          for: ['Face and arm swelling, distended neck and chest veins; lung cancer'],
          refs: [{ chapter: 11, pages: '197–198' }],
        },
      ],
    },
    {
      heading: 'Common',
      items: [
        {
          name: 'Cellulitis',
          for: ['Spreading redness, warmth, swelling; tender nodes; fever; entry point'],
          refs: [{ chapter: 43, pages: '817' }],
        },
        {
          name: 'Rotator cuff tendinitis or tear',
          for: ['Painful arc; pain reaching behind; drop-arm sign (tear); over 50 for tears'],
          refs: [
            { chapter: 24, pages: '384–386' },
            { chapter: 25, pages: '421–422' },
          ],
        },
        {
          name: 'Frozen shoulder (adhesive capsulitis) or shoulder arthritis',
          for: ['Painful limitation in all directions'],
          refs: [
            { chapter: 24, pages: '384–386' },
            { chapter: 25, pages: '422' },
          ],
        },
        {
          name: 'Cervical radiculopathy',
          for: ['Neck pain; dermatomal symptoms; positive Spurling’s'],
          refs: [{ chapter: 24, pages: '390–392' }],
        },
        {
          name: 'Carpal tunnel syndrome',
          for: ['Night tingling of the thumb, index, middle fingers; flick sign'],
          refs: [
            { chapter: 31, pages: '496' },
            { chapter: 24, pages: '380', label: 'List 24.4' },
          ],
        },
        {
          name: 'Arthritis of a joint (septic, gout, inflammatory)',
          for: ['Hot swollen joint; see the joint pain checklist'],
          refs: [{ chapter: 23, pages: '364–366', label: 'Lists 23.2, 23.3' }],
        },
        {
          name: 'Lymphoedema',
          for: ['Non-pitting swelling (lymphatic obstruction)'],
          refs: [{ chapter: 6, pages: '109' }],
        },
        {
          name: 'Polymyalgia rheumatica',
          for: ['Over 50; shoulder and hip girdle pain and stiffness'],
          refs: [{ chapter: 23, pages: '367' }],
        },
      ],
    },
  ],
  plan: [
    {
      heading: 'Extend the examination',
      refs: [{ chapter: 26, pages: '429–431' }],
      points: [
        { text: 'ECG if any chance of cardiac pain', extra: true },
        { text: 'Doppler ultrasound for venous thrombosis or arterial occlusion', extra: true },
        { text: 'X-ray after injury', extra: true },
        { text: 'Blood count, CRP; blood cultures if septic', extra: true },
      ],
    },
    {
      heading: 'Decide',
      refs: [{ chapter: 4, pages: '68' }],
      points: [
        { text: 'Cold pulseless arm: vascular surgery now', urgent: true, extra: true },
        { text: 'Necrotising infection or compartment syndrome: surgical emergency', urgent: true, extra: true },
        { text: 'Then follow the hospital’s upper limb pain and swelling flowchart below' },
      ],
    },
  ],
};
