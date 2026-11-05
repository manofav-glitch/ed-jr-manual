import type { BedsideTopic } from '../bedsideTypes.ts';
import { ABDO_EXAM, FIRST_LOOK } from './shared.ts';

export const feverJaundice: BedsideTopic = {
  id: 'fever-jaundice',
  title: 'Fever with yellowing of the skin (jaundice)',
  flowcharts: ['13.4'],
  reviewed: false,
  history: [
    FIRST_LOOK,
    {
      heading: 'The jaundice',
      refs: [
        { chapter: 13, pages: '225–226', label: 'Questions box 13.7' },
      ],
      points: [
        { text: 'When did the family notice the yellow eyes or skin?' },
        { text: 'Dark urine, pale stools?', hint: 'Obstructive (cholestatic) jaundice' },
        { text: 'Itching', hint: 'Cholestasis' },
        { text: 'Abdominal pain: biliary pain (severe, constant, epigastric or right upper quadrant)?', hint: 'Gallstones' },
        { text: 'Loss of appetite or weight', urgent: true, hint: 'Cancer (pancreas, bile duct, liver)' },
        { text: 'Vomiting blood or black stools', urgent: true },
        { text: 'Confusion or drowsiness', urgent: true, hint: 'Hepatic encephalopathy' },
        { text: 'Bleeding gums, bruising, nosebleeds', urgent: true, hint: 'Liver coagulopathy' },
      ],
    },
    {
      heading: 'The fever',
      refs: [
        { chapter: 13, pages: '226', label: 'Questions box 13.7' },
        { chapter: 45, pages: '835', label: 'Questions box 45.1' },
      ],
      points: [
        { text: 'Fever with jaundice', urgent: true, hint: 'Think cholangitis' },
        { text: 'Rigors', urgent: true, hint: 'Bacteraemia' },
        { text: 'How long; pattern; measured?' },
        { text: 'Travel; contact with others who were jaundiced or ill' },
        { text: 'Mosquito exposure, flood water or animal urine', hint: 'Malaria, leptospirosis', extra: true },
      ],
    },
    {
      heading: 'Liver risks',
      refs: [
        { chapter: 13, pages: '226–227', label: 'Questions box 13.7' },
      ],
      points: [
        { text: 'Alcohol: how much, for how long (CAGE)' },
        { text: 'Injecting drugs, tattoos, blood transfusion, unsafe sex', hint: 'Hepatitis B or C' },
        { text: 'Hepatitis B vaccinated?' },
        { text: 'New medicines; paracetamol overdose', hint: 'Drug-induced hepatitis or cholestasis' },
        { text: 'Gallstones, biliary or pancreatic surgery' },
        { text: 'Inflammatory bowel disease', hint: 'Primary sclerosing cholangitis' },
        { text: 'Occupation (healthcare work, toxins)' },
        { text: 'Pregnancy', hint: 'Cholestasis of pregnancy' },
        { text: 'Family history of liver disease, jaundice, anaemia, splenectomy or gallbladder removal', hint: 'Haemolysis, inherited causes' },
      ],
    },
  ],
  exam: [
    {
      heading: 'How sick?',
      refs: [
        { chapter: 47, pages: '870–871', label: 'List 47.2' },
        { chapter: 15, pages: '275' },
      ],
      points: [
        { text: 'Temperature, pulse, BP, respiratory rate, SpO₂' },
        { text: 'Low BP, tachycardia, confusion', urgent: true, hint: 'Sepsis (cholangitis)' },
        { text: 'Grade any encephalopathy: 1 subtle changes, 2 drowsy and disorientated, 3 stupor, 4 coma', urgent: true },
      ],
    },
    ...ABDO_EXAM,
    {
      heading: 'Look specifically for',
      refs: [
        { chapter: 14, pages: '253–254', label: 'List 14.10' },
        { chapter: 15, pages: '274–275', label: 'Good signs guide 15.4' },
        { chapter: 45, pages: '835–836' },
      ],
      points: [
        { text: 'Signs of chronic liver disease: spider naevi, palmar erythema, ascites, firm liver, abdominal veins', hint: 'Two or more strongly suggest cirrhosis' },
        { text: 'Tender liver; Murphy’s sign', hint: 'Hepatitis; cholecystitis' },
        { text: 'Palpable gallbladder in a jaundiced patient', urgent: true, hint: 'Unlikely to be stones (Courvoisier): think pancreatic or bile duct cancer' },
        { text: 'Splenomegaly', hint: 'Portal hypertension, haemolysis, malaria' },
        { text: 'Pallor', hint: 'Haemolysis' },
        { text: 'Flapping tremor, fetor', hint: 'Liver failure' },
        { text: 'Rash, lymph nodes' },
      ],
    },
  ],
  differentials: [
    {
      heading: 'Can’t miss',
      items: [
        {
          name: 'Cholangitis (infected obstructed bile duct)',
          urgent: true,
          for: ['Fever and jaundice; biliary pain; gallstones or previous biliary surgery', 'Dark urine, pale stools; may be septic'],
          refs: [
            { chapter: 13, pages: '225–226', label: 'Questions box 13.7' },
            { chapter: 14, pages: '270', label: 'Table 14.2' },
          ],
        },
        {
          name: 'Acute liver failure (viral, drugs, paracetamol)',
          urgent: true,
          for: ['Jaundice with confusion or drowsiness, bleeding'],
          refs: [
            { chapter: 13, pages: '227' },
            { chapter: 15, pages: '275' },
          ],
        },
        {
          name: 'Malaria, leptospirosis, severe sepsis',
          urgent: true,
          extra: true,
          for: ['Fever with jaundice in an endemic area; mosquito or flood-water exposure'],
          refs: [],
        },
      ],
    },
    {
      heading: 'Hepatocellular',
      items: [
        {
          name: 'Viral hepatitis (A, B, C)',
          for: ['Loss of appetite, change in taste (smokers may stop smoking)', 'Travel, contacts, injecting, tattoos, sexual risk'],
          refs: [
            { chapter: 13, pages: '218, 226–227', label: 'Questions box 13.7' },
            { chapter: 14, pages: '270', label: 'Table 14.2' },
          ],
        },
        {
          name: 'Alcoholic hepatitis',
          for: ['Heavy drinking; fever; tender liver; signs of chronic liver disease'],
          refs: [
            { chapter: 13, pages: '227' },
            { chapter: 15, pages: '275' },
          ],
        },
        {
          name: 'Drug-induced liver injury',
          for: ['New medicine; paracetamol overdose'],
          refs: [{ chapter: 13, pages: '227' }],
        },
      ],
    },
    {
      heading: 'Obstructive',
      items: [
        {
          name: 'Gallstones in the bile duct',
          for: ['Biliary pain; dark urine, pale stools; gallbladder usually not palpable'],
          refs: [
            { chapter: 13, pages: '225' },
            { chapter: 14, pages: '253–254, 270', label: 'Table 14.2' },
          ],
        },
        {
          name: 'Cancer of the pancreas head, ampulla or bile duct',
          urgent: true,
          for: ['Jaundice with a palpable gallbladder (Courvoisier)', 'Weight loss, loss of appetite'],
          refs: [
            { chapter: 14, pages: '253–254', label: 'List 14.10' },
          ],
        },
      ],
    },
    {
      heading: 'Haemolytic',
      items: [
        {
          name: 'Haemolysis (including malaria)',
          for: ['Pallor; normal-coloured stools; no bilirubin in the urine', 'Family history of anaemia, splenectomy, gallstones'],
          refs: [
            { chapter: 13, pages: '227' },
            { chapter: 14, pages: '269–270', label: 'Table 14.2' },
          ],
        },
      ],
    },
  ],
  plan: [
    {
      heading: 'Extend the examination',
      refs: [{ chapter: 14, pages: '269–270', label: 'Table 14.2' }],
      points: [
        { text: 'Urine dipstick: bilirubin and urobilinogen', hint: 'Bilirubin but no urobilinogen: obstruction. Urobilinogen without bilirubin: haemolysis' },
        { text: 'Look at the stool colour' },
        { text: 'Blood cultures if febrile' },
        { text: 'Blood sugar; malaria test; liver tests and clotting; ultrasound of the bile ducts', extra: true },
      ],
    },
    {
      heading: 'Decide',
      refs: [
        { chapter: 13, pages: '226' },
        { chapter: 47, pages: '871' },
      ],
      points: [
        { text: 'Fever with jaundice and septic: treat as cholangitis, antibiotics early', urgent: true },
        { text: 'Confusion or bleeding: acute liver failure, urgent', urgent: true },
        { text: 'Then follow the hospital’s fever with jaundice flowchart and checklist below' },
      ],
    },
  ],
};
