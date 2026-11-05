import type { BedsideTopic } from '../bedsideTypes.ts';
import { ABDO_EXAM } from './shared.ts';

export const bloating: BedsideTopic = {
  id: 'bloating',
  title: 'Uneasiness and bloating',
  flowcharts: ['3.5'],
  reviewed: false,
  history: [
    {
      heading: 'What do they feel?',
      refs: [
        { chapter: 13, pages: '217–220, 225–226' },
      ],
      points: [
        { text: 'A feeling of swelling, or visibly bigger?', hint: 'Persistent visible swelling: think ascites, mass' },
        { text: 'Fullness after small meals; can’t finish a meal', hint: 'Gastric disease, functional dyspepsia' },
        { text: 'Upper abdominal discomfort or burning; heartburn; sour fluid in the mouth', hint: 'Dyspepsia, reflux' },
        { text: 'Comes and goes, linked to bowel habit and eased by opening the bowels?', hint: 'Irritable bowel syndrome' },
        { text: 'Ankle swelling too?', hint: 'Ascites, heart or kidney disease' },
      ],
    },
    {
      heading: 'Danger questions',
      refs: [
        { chapter: 13, pages: '218–220, 227', label: 'T&O’C essentials' },
      ],
      points: [
        { text: 'Vomiting, not passing flatus, colicky pain', urgent: true, hint: 'Obstruction' },
        { text: 'Weight loss, loss of appetite', urgent: true, hint: 'Cancer' },
        { text: 'Difficulty swallowing', urgent: true },
        { text: 'Vomiting blood or black stools', urgent: true },
        { text: 'Jaundice, alcohol, known liver disease', hint: 'Ascites' },
        { text: 'Could she be pregnant?' },
        { text: 'Chest discomfort with exertion, sweating, radiation to the arm or jaw', urgent: true, hint: 'Myocardial ischaemia presenting as “indigestion”' },
      ],
    },
    {
      heading: 'Background',
      refs: [{ chapter: 13, pages: '220, 223, 226–227' }],
      points: [
        { text: 'Medicines: NSAIDs, opioids, calcium channel blockers' },
        { text: 'Alcohol, caffeine, fatty meals (worsen reflux)' },
        { text: 'Bowel habit: constipation, diarrhoea' },
      ],
    },
  ],
  exam: [
    ...ABDO_EXAM,
    {
      heading: 'Look specifically for',
      refs: [
        { chapter: 14, pages: '245–246, 258–260', label: 'List 14.12' },
        { chapter: 14, pages: '255' },
      ],
      points: [
        { text: 'Distension: which F? Fat, fluid, flatus, faeces, fetus, a big mass' },
        { text: 'Bulging flanks, shifting dullness, everted umbilicus', hint: 'Ascites' },
        { text: 'Tympanic distension, obstructed bowel sounds', urgent: true, hint: 'Obstruction' },
        { text: 'Succussion splash', hint: 'Gastric outlet obstruction' },
        { text: 'Masses; epigastric mass; left supraclavicular node' },
        { text: 'Signs of chronic liver disease' },
      ],
    },
  ],
  differentials: [
    {
      heading: 'Can’t miss',
      items: [
        {
          name: 'Bowel obstruction',
          urgent: true,
          for: ['Distension with vomiting, colic, no flatus', 'Visible peristalsis, obstructed bowel sounds'],
          refs: [{ chapter: 15, pages: '273', label: 'Good signs guide 15.2' }],
        },
        {
          name: 'Ascites (liver disease, cancer, heart failure)',
          for: ['Persistent swelling; ankle oedema', 'Bulging flanks, shifting dullness; signs of liver disease'],
          refs: [
            { chapter: 13, pages: '225–226' },
            { chapter: 14, pages: '258–260', label: 'List 14.12' },
          ],
        },
        {
          name: 'Gastric cancer or another tumour',
          urgent: true,
          for: ['Early fullness, weight loss, anorexia', 'Mass; left supraclavicular node'],
          refs: [{ chapter: 13, pages: '218' }],
        },
        {
          name: 'Myocardial ischaemia',
          urgent: true,
          for: ['Upper abdominal or chest discomfort with exertion; risk factors'],
          refs: [{ chapter: 13, pages: '220', label: 'Questions box 13.2' }],
        },
      ],
    },
    {
      heading: 'Common',
      items: [
        {
          name: 'Functional dyspepsia',
          for: ['Fullness after meals, early fullness, epigastric discomfort', 'No alarm features'],
          refs: [{ chapter: 13, pages: '218' }],
        },
        {
          name: 'Gastro-oesophageal reflux',
          for: ['Heartburn after meals or lying down; acid regurgitation; relieved by antacids'],
          refs: [{ chapter: 13, pages: '219–220', label: 'Questions box 13.2' }],
        },
        {
          name: 'Peptic ulcer',
          for: ['Dull or burning epigastric pain, eased by food or antacids, at night'],
          refs: [{ chapter: 13, pages: '218' }],
        },
        {
          name: 'Irritable bowel syndrome',
          for: ['Bloating with pain related to defecation and a change in bowel habit'],
          refs: [{ chapter: 13, pages: '224–227', label: 'List 13.3' }],
        },
        {
          name: 'Constipation',
          for: ['Infrequent hard stools; palpable faeces'],
          refs: [{ chapter: 13, pages: '223' }],
        },
      ],
    },
  ],
  plan: [
    {
      heading: 'Extend the examination',
      refs: [{ chapter: 14, pages: '264–269' }],
      points: [
        { text: 'Rectal examination' },
        { text: 'Urine dipstick; pregnancy test if relevant' },
        { text: 'ECG if any feature of ischaemia', extra: true },
      ],
    },
    {
      heading: 'Decide',
      refs: [{ chapter: 13, pages: '220, 227', label: 'T&O’C essentials' }],
      points: [
        { text: 'Obstruction or ischaemia possible: urgent', urgent: true },
        { text: 'Alarm features (weight loss, dysphagia, bleeding): needs investigation' },
        { text: 'No alarm features: reflux, dyspepsia or IBS can be diagnosed from the history' },
        { text: 'Then follow the hospital’s bloating flowchart below' },
      ],
    },
  ],
};
