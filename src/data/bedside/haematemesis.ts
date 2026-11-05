import type { BedsideTopic } from '../bedsideTypes.ts';
import { ABDO_EXAM, FIRST_LOOK } from './shared.ts';

export const haematemesis: BedsideTopic = {
  id: 'haematemesis',
  title: 'Vomiting blood (haematemesis)',
  flowcharts: ['1.8'],
  reviewed: false,
  history: [
    FIRST_LOOK,
    {
      heading: 'Is it really from the gut?',
      refs: [
        { chapter: 13, pages: '224' },
        { chapter: 9, pages: '166', label: 'Table 9.3' },
      ],
      points: [
        { text: 'Mixed with vomit, after nausea or retching', hint: 'Haematemesis' },
        { text: 'Coughed up with sputum', hint: 'Haemoptysis' },
        { text: 'From the nose, or a tooth socket', hint: 'Swallowed blood' },
      ],
    },
    {
      heading: 'The bleed',
      refs: [{ chapter: 13, pages: '224–226', label: 'Questions box 13.6' }],
      points: [
        { text: 'Fresh red blood, or coffee grounds?', urgent: true },
        { text: 'How much: streaks, a cupful, more?', urgent: true },
        { text: 'Black tarry stools, or blood in the stools?', urgent: true },
        { text: 'Faint, dizzy, or collapsed?', urgent: true, hint: 'Large blood loss' },
        { text: 'Clear vomit first, then blood after hard retching?', hint: 'Mallory–Weiss tear' },
      ],
    },
    {
      heading: 'Clues to the cause',
      refs: [
        { chapter: 13, pages: '218, 224–226', label: 'Table 13.1, Questions box 13.6' },
      ],
      points: [
        { text: 'Burning or gnawing epigastric pain, eased by food or antacids, waking at night', hint: 'Peptic ulcer (ulcers often bleed painlessly)' },
        { text: 'Ulcer before, or treatment for one' },
        { text: 'Alcohol: how much, how long; known liver disease', hint: 'Varices (but half of these patients bleed from ulcers)' },
        { text: 'Heartburn, pain on swallowing', hint: 'Oesophagitis' },
        { text: 'Weight loss, poor appetite, early fullness', urgent: true, hint: 'Gastric cancer' },
        { text: 'Bleeding or bruising elsewhere', hint: 'Bleeding disorder, liver coagulopathy' },
        { text: 'Aortic graft surgery in the past', urgent: true, hint: 'Aorto-enteric fistula' },
      ],
    },
    {
      heading: 'Drugs',
      refs: [
        { chapter: 13, pages: '226', label: 'Questions box 13.6' },
      ],
      points: [
        { text: 'Aspirin, other NSAIDs, steroids' },
        { text: 'Anticoagulants and antiplatelets', extra: true },
        { text: 'Iron or bismuth (black stools without bleeding)', extra: true },
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
        { text: 'Cold blue peripheries, clammy, air hunger, anxious, little urine', urgent: true, hint: 'Shock: massive loss, resuscitate now' },
        { text: 'Remember: older patients and those with heart disease become shocked earlier' },
      ],
    },
    {
      heading: 'Where is it coming from?',
      refs: [{ chapter: 15, pages: '277' }],
      points: [
        { text: 'Signs of chronic liver disease and portal hypertension: spider naevi, palmar erythema, ascites, big spleen, abdominal veins' },
        { text: 'Rectal examination: melaena?', hint: 'Strongly favours an upper GI source' },
        { text: 'Look at the vomit' },
        { text: 'Bruising or petechiae', hint: 'Bleeding disorder' },
        { text: 'Epigastric mass, supraclavicular node', hint: 'Gastric cancer' },
      ],
    },
    ...ABDO_EXAM,
  ],
  differentials: [
    {
      heading: 'More common',
      items: [
        {
          name: 'Peptic ulcer (duodenal or gastric)',
          for: ['Epigastric pain eased by food or antacids, often at night', 'NSAIDs or aspirin; past ulcer', 'Often painless'],
          refs: [
            { chapter: 13, pages: '218, 224–225', label: 'Table 13.1' },
          ],
        },
        {
          name: 'Acute erosions (gastritis)',
          for: ['NSAIDs, alcohol, severe illness'],
          refs: [{ chapter: 13, pages: '225', label: 'Table 13.1' }],
        },
      ],
    },
    {
      heading: 'Less common',
      items: [
        {
          name: 'Oesophageal or gastric varices',
          urgent: true,
          for: ['Heavy alcohol use, known cirrhosis', 'Signs of chronic liver disease and portal hypertension', 'Often a large bleed'],
          against: ['Half of patients with liver disease who bleed have an ulcer, not varices'],
          refs: [
            { chapter: 13, pages: '225', label: 'Table 13.1' },
            { chapter: 15, pages: '275–277' },
          ],
        },
        {
          name: 'Mallory–Weiss tear',
          for: ['Repeated vomiting or retching first, then blood'],
          refs: [{ chapter: 13, pages: '224–225', label: 'Table 13.1' }],
        },
        {
          name: 'Oesophagitis',
          for: ['Heartburn, acid regurgitation, painful swallowing'],
          refs: [{ chapter: 13, pages: '225', label: 'Table 13.1' }],
        },
        {
          name: 'Gastric cancer',
          for: ['Weight loss, early fullness, anaemia', 'Epigastric mass, left supraclavicular node'],
          refs: [
            { chapter: 13, pages: '218, 225', label: 'Table 13.1' },
          ],
        },
        {
          name: 'Aorto-enteric fistula',
          urgent: true,
          for: ['Previous aortic surgery'],
          refs: [{ chapter: 13, pages: '225', label: 'Table 13.1' }],
        },
        {
          name: 'Bleeding disorder',
          for: ['Bleeding elsewhere; anticoagulants; liver disease'],
          refs: [{ chapter: 13, pages: '225', label: 'Table 13.1' }],
        },
        {
          name: 'Swallowed blood (nose or mouth)',
          for: ['Nosebleed or dental bleeding; blood appears in the mouth without retching'],
          refs: [
            { chapter: 13, pages: '224–225', label: 'Table 13.1' },
          ],
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
        { text: 'Pulse, BP and postural BP, repeated' },
        { text: 'Rectal examination and stool inspection recorded' },
        { text: 'Urine output' },
        { text: 'Haemoglobin, platelets, clotting, urea, cross-match', extra: true },
      ],
    },
    {
      heading: 'Decide',
      refs: [
        { chapter: 15, pages: '276–277' },
        { chapter: 13, pages: '227', label: 'T&O’C essentials' },
      ],
      points: [
        { text: 'Signs of shock: massive bleed, resuscitate urgently', urgent: true },
        { text: 'Signs of liver disease: think varices, but ulcer is just as likely' },
        { text: 'Bleeding is an alarm symptom: it needs investigation' },
        { text: 'Then follow the hospital’s haematemesis flowchart and checklist below' },
      ],
    },
  ],
};
