import type { BedsideTopic } from '../bedsideTypes.ts';
import { ABDO_EXAM, FIRST_LOOK } from './shared.ts';

export const rectalBleeding: BedsideTopic = {
  id: 'rectal-bleeding',
  title: 'Bleeding per rectum and melaena',
  flowcharts: ['1.4'],
  reviewed: false,
  history: [
    FIRST_LOOK,
    {
      heading: 'What is being passed?',
      refs: [{ chapter: 13, pages: '224–225' }],
      points: [
        { text: 'Black, tarry, sticky stool?', urgent: true, hint: 'Melaena: usually an upper GI bleed' },
        { text: 'Bright red blood: on the paper or on top of the stool, or mixed in?', hint: 'On top: haemorrhoids, fissure. Mixed in: colon' },
        { text: 'A large amount of red blood or clots?', urgent: true, hint: 'Major lower bleed, or a brisk upper bleed' },
        { text: 'Faint, dizzy, breathless?', urgent: true },
        { text: 'Vomited blood as well?', urgent: true },
      ],
    },
    {
      heading: 'Clues to the cause',
      refs: [
        { chapter: 13, pages: '222–225', label: 'Questions boxes 13.4, 13.5; Table 13.1' },
      ],
      points: [
        { text: 'Pain on passing stool', hint: 'Fissure' },
        { text: 'Recent change in bowel habit', urgent: true, hint: 'Colon cancer' },
        { text: 'Weight loss', urgent: true },
        { text: 'Diarrhoea with blood, mucus or pus; urgency; waking at night', hint: 'Colitis (inflammatory or infective)' },
        { text: 'Sudden left-sided pain then bloody diarrhoea in an older patient', hint: 'Ischaemic colitis', extra: true },
        { text: 'Mucus without blood', hint: 'Villous adenoma, IBS, solitary rectal ulcer' },
        { text: 'Known diverticular disease, polyps, IBD, or previous bowel surgery' },
        { text: 'Peptic ulcer symptoms, alcohol, liver disease', hint: 'Upper source of melaena' },
        { text: 'Family history of colon cancer, polyps or IBD' },
      ],
    },
    {
      heading: 'Drugs',
      refs: [{ chapter: 13, pages: '226' }],
      points: [
        { text: 'Aspirin, other NSAIDs' },
        { text: 'Anticoagulants and antiplatelets', extra: true },
        { text: 'Iron tablets (black but not tarry stool)', extra: true },
      ],
    },
  ],
  exam: [
    {
      heading: 'How much blood has been lost?',
      refs: [{ chapter: 15, pages: '276–277' }],
      points: [
        { text: 'Pulse and BP lying and sitting' },
        { text: 'Pulse above 100, systolic below 100, or a postural fall of 15 mmHg', urgent: true, hint: 'Severe recent blood loss' },
        { text: 'Cold, clammy, air hunger, little urine', urgent: true, hint: 'Shock' },
        { text: 'Pallor' },
      ],
    },
    ...ABDO_EXAM,
    {
      heading: 'Rectal examination (essential)',
      refs: [
        { chapter: 14, pages: '264–268', label: 'List 14.14' },
        { chapter: 15, pages: '277' },
      ],
      points: [
        { text: 'Look: tags, haemorrhoids, fissure, fistula, blood, mucus' },
        { text: 'Feel: a mass in the rectum' },
        { text: 'Glove: melaena, red blood, clots', hint: 'Clots point to the colon; melaena to an upper source' },
      ],
    },
  ],
  differentials: [
    {
      heading: 'Melaena',
      items: [
        {
          name: 'Upper GI bleed (peptic ulcer, varices, and others)',
          urgent: true,
          for: ['Black tarry stool', 'Ulcer symptoms, NSAIDs, alcohol, liver disease'],
          against: ['Occasionally the right colon or small bowel'],
          refs: [
            { chapter: 13, pages: '224–225', label: 'Table 13.1' },
            { chapter: 15, pages: '277' },
          ],
        },
      ],
    },
    {
      heading: 'Red blood: more common',
      items: [
        {
          name: 'Haemorrhoids or anal fissure',
          for: ['Small amounts on the paper or on top of the stool', 'Pain on defecation (fissure)'],
          against: ['Still look for a higher cause if there is a change in bowel habit or weight loss'],
          refs: [{ chapter: 13, pages: '224–225', label: 'Table 13.1' }],
        },
        {
          name: 'Diverticular disease',
          for: ['A substantial lower GI bleed', 'Bleeds more often from right-sided diverticula, although they are commoner on the left'],
          refs: [{ chapter: 13, pages: '225', label: 'Table 13.1' }],
        },
        {
          name: 'Angiodysplasia',
          for: ['A substantial lower GI bleed'],
          refs: [{ chapter: 13, pages: '225', label: 'Table 13.1' }],
        },
        {
          name: 'Colon cancer or polyp',
          urgent: true,
          for: ['Blood mixed in the stool', 'Change in bowel habit, weight loss, anaemia', 'Mass on rectal examination'],
          refs: [{ chapter: 13, pages: '223–225', label: 'Table 13.1' }],
        },
      ],
    },
    {
      heading: 'Red blood: less common',
      items: [
        {
          name: 'Massive upper GI bleed',
          urgent: true,
          for: ['Large red bleed with shock'],
          refs: [{ chapter: 13, pages: '225', label: 'Table 13.1' }],
        },
        {
          name: 'Inflammatory bowel disease or infective colitis',
          for: ['Bloody diarrhoea with mucus, urgency, fever'],
          refs: [
            { chapter: 13, pages: '222–223', label: 'Questions box 13.4' },
            { chapter: 15, pages: '274, 277' },
          ],
        },
        {
          name: 'Ischaemic colitis or mesenteric ischaemia',
          urgent: true,
          for: ['Older patient, vascular disease, AF; pain then blood'],
          refs: [
            { chapter: 13, pages: '225', label: 'Table 13.1' },
            { chapter: 15, pages: '274' },
          ],
        },
        {
          name: 'Meckel’s diverticulum and other small-bowel causes',
          for: ['Less common: think of it when the common causes are excluded'],
          refs: [{ chapter: 13, pages: '225', label: 'Table 13.1' }],
        },
      ],
    },
  ],
  plan: [
    {
      heading: 'Extend the examination',
      refs: [
        { chapter: 15, pages: '276–277' },
        { chapter: 14, pages: '264–268' },
      ],
      points: [
        { text: 'Repeat pulse, BP and postural BP' },
        { text: 'Rectal examination and stool appearance recorded' },
        { text: 'Haemoglobin, clotting, urea, cross-match', extra: true },
      ],
    },
    {
      heading: 'Decide',
      refs: [
        { chapter: 15, pages: '276–277' },
        { chapter: 13, pages: '227', label: 'T&O’C essentials' },
      ],
      points: [
        { text: 'Shock: resuscitate, and remember a brisk upper bleed can present red', urgent: true },
        { text: 'Melaena: manage as an upper GI bleed' },
        { text: 'Bleeding with weight loss or a change in bowel habit: needs investigation for cancer' },
        { text: 'Then follow the hospital’s bleeding per rectum flowchart and checklist below' },
      ],
    },
  ],
};
