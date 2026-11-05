import type { BedsideTopic } from '../bedsideTypes.ts';
import { ABDO_EXAM } from './shared.ts';

export const constipation: BedsideTopic = {
  id: 'constipation',
  title: 'Constipation',
  flowcharts: ['3.4'],
  reviewed: false,
  history: [
    {
      heading: 'What do they mean by constipation?',
      refs: [
        { chapter: 13, pages: '223–224', label: 'Questions box 13.5' },
      ],
      points: [
        { text: 'How often do the bowels open (fewer than three times a week is infrequent)?' },
        { text: 'Hard stools, pellets, straining?' },
        { text: 'A feeling of blockage at the anus, or needing a finger to help', hint: 'Pelvic floor or anorectal problem' },
        { text: 'New, or long-standing?' },
      ],
    },
    {
      heading: 'Danger questions',
      refs: [
        { chapter: 13, pages: '223–224', label: 'Questions box 13.5' },
        { chapter: 13, pages: '218' },
      ],
      points: [
        { text: 'Not passing flatus; vomiting; distension; colicky pain', urgent: true, hint: 'Bowel obstruction' },
        { text: 'Recent change in bowel habit', urgent: true, hint: 'Colon cancer' },
        { text: 'Blood in the stools', urgent: true },
        { text: 'Weight loss', urgent: true },
        { text: 'Past colon polyps or cancer; colon cancer in the family', urgent: true },
        { text: 'New back pain, leg weakness, numbness in the saddle area, urinary retention', urgent: true, hint: 'Spinal cord or cauda equina', extra: true },
      ],
    },
    {
      heading: 'Causes to ask about',
      refs: [{ chapter: 13, pages: '223–224' }],
      points: [
        { text: 'Medicines: codeine and other opioids, antidepressants, aluminium or calcium antacids; any recent change' },
        { text: 'Bed rest, recent operation, diet change, poor intake' },
        { text: 'Pregnancy' },
        { text: 'Hypothyroidism, diabetes, high calcium' },
        { text: 'Neurological disease: spinal cord injury, multiple sclerosis, autonomic neuropathy' },
        { text: 'Alternating with diarrhoea; pain eased by opening the bowels', hint: 'Irritable bowel syndrome' },
      ],
    },
  ],
  exam: [
    {
      heading: 'First',
      refs: [{ chapter: 15, pages: '272–273', label: 'Good signs guide 15.2' }],
      points: [
        { text: 'Pulse, BP, temperature; hydration' },
        { text: 'Distension, visible peristalsis, obstructed bowel sounds, vomiting', urgent: true, hint: 'Obstruction' },
      ],
    },
    ...ABDO_EXAM,
    {
      heading: 'Look specifically for',
      refs: [
        { chapter: 14, pages: '256, 264–268', label: 'List 14.14' },
      ],
      points: [
        { text: 'Palpable sigmoid colon full of faeces (indents, unlike a tumour)' },
        { text: 'Rectal examination: hard stool, mass, fissure, blood' },
        { text: 'Hernias' },
        { text: 'Neurological examination of the legs and perianal sensation if any back or leg symptoms', extra: true },
      ],
    },
  ],
  differentials: [
    {
      heading: 'Can’t miss',
      items: [
        {
          name: 'Bowel obstruction (including colon cancer, hernia)',
          urgent: true,
          for: ['No flatus, vomiting, colicky pain, distension', 'Change in bowel habit, blood, weight loss'],
          refs: [
            { chapter: 13, pages: '218, 224' },
            { chapter: 15, pages: '273', label: 'Good signs guide 15.2' },
          ],
        },
        {
          name: 'Spinal cord compression or cauda equina',
          urgent: true,
          extra: true,
          for: ['Back pain, leg weakness, saddle numbness, urinary retention'],
          refs: [],
        },
      ],
    },
    {
      heading: 'Common',
      items: [
        {
          name: 'Drugs',
          for: ['Opioids, antidepressants, antacids; recent change'],
          refs: [{ chapter: 13, pages: '223' }],
        },
        {
          name: 'Habit, diet, bed rest, after surgery',
          for: ['Long-standing; low fibre or intake; immobile'],
          refs: [{ chapter: 13, pages: '223–224' }],
        },
        {
          name: 'Irritable bowel syndrome',
          for: ['Recurrent pain related to defecation and a change in stool form or frequency', 'No alarm features'],
          refs: [{ chapter: 13, pages: '224', label: 'List 13.3' }],
        },
        {
          name: 'Metabolic or endocrine (hypothyroidism, high calcium, diabetes, low potassium)',
          for: ['Systemic symptoms; known disease'],
          refs: [{ chapter: 13, pages: '223' }],
        },
        {
          name: 'Anorectal (fissure, pelvic floor problems)',
          for: ['Pain on defecation; straining; feeling of blockage'],
          refs: [{ chapter: 13, pages: '224' }],
        },
        {
          name: 'Pregnancy',
          for: ['Common, especially late in pregnancy'],
          refs: [{ chapter: 13, pages: '224' }],
        },
      ],
    },
  ],
  plan: [
    {
      heading: 'Extend the examination',
      refs: [{ chapter: 14, pages: '264–268' }],
      points: [
        { text: 'Rectal examination recorded' },
        { text: 'Abdominal X-ray if obstruction is suspected', extra: true },
      ],
    },
    {
      heading: 'Decide',
      refs: [
        { chapter: 13, pages: '224, 227', label: 'T&O’C essentials' },
      ],
      points: [
        { text: 'Obstruction suspected: surgical review', urgent: true },
        { text: 'Recent change in bowel habit, blood or weight loss: needs investigation for cancer' },
        { text: 'Otherwise look for a drug or other cause' },
        { text: 'Then follow the hospital’s constipation flowchart below' },
      ],
    },
  ],
};
