import type { BedsideTopic } from '../bedsideTypes.ts';
import { UNCONSCIOUS_EXAM } from './shared.ts';

export const unconscious: BedsideTopic = {
  id: 'unconscious',
  title: 'The unconscious patient',
  flowcharts: ['4.2'],
  reviewed: false,
  history: [
    {
      heading: 'Act first, ask while you act',
      refs: [
        { chapter: 47, pages: '867' },
        { chapter: 35, pages: '601' },
      ],
      points: [
        { text: 'Airway, breathing, circulation; start CPR if no breathing or pulse', urgent: true },
        { text: 'Blood sugar', urgent: true, hint: 'Never miss hypoglycaemia' },
        { text: 'Medical alert bracelet; medicine list or empty packets in the pockets' },
      ],
    },
    {
      heading: 'From the family, friends, ambulance staff',
      refs: [
        { chapter: 47, pages: '867', label: 'AMPLE' },
        { chapter: 31, pages: '489–490' },
      ],
      points: [
        { text: 'How was the patient found, and when last seen well?' },
        { text: 'Sudden collapse, or gradual drowsiness over hours or days?', hint: 'Sudden: vascular or seizure. Gradual: infection, metabolic, drugs' },
        { text: 'Headache, vomiting, weakness, or a fit before?', urgent: true },
        { text: 'Head injury or fall?', urgent: true },
        { text: 'Tablets, alcohol, drugs, chemicals nearby; previous overdoses; low mood', urgent: true },
        { text: 'Fever, rash, neck stiffness', urgent: true, hint: 'Meningitis, encephalitis' },
        { text: 'Charcoal stove, heater or car engine in a closed room', hint: 'Carbon monoxide', extra: true },
      ],
    },
    {
      heading: 'Background (COMA causes)',
      refs: [{ chapter: 35, pages: '601' }],
      points: [
        { text: 'Lung disease, home oxygen', hint: 'CO₂ narcosis' },
        { text: 'Diabetes and its treatment', hint: 'Hypoglycaemia, ketoacidosis' },
        { text: 'Liver or kidney failure, thyroid or adrenal disease' },
        { text: 'Epilepsy, previous stroke, atrial fibrillation, anticoagulants' },
        { text: 'Allergies and current medicines' },
      ],
    },
  ],
  exam: UNCONSCIOUS_EXAM,
  differentials: [
    {
      heading: 'COMA (book p 601)',
      items: [
        {
          name: 'C: CO₂ narcosis (respiratory failure)',
          urgent: true,
          for: ['COPD, oxygen given; warm hands, bounding pulse, flap'],
          refs: [
            { chapter: 35, pages: '601' },
            { chapter: 11, pages: '195' },
          ],
        },
        {
          name: 'O: Overdose (sedatives, opioids, alcohol, salicylates, antidepressants, carbon monoxide)',
          urgent: true,
          for: ['Empty packets, history; pinpoint pupils (opioids); cherry-red colour (CO)'],
          refs: [{ chapter: 35, pages: '601–603' }],
        },
        {
          name: 'M: Metabolic (hypoglycaemia, ketoacidosis, liver, kidney, thyroid, adrenal, high calcium)',
          urgent: true,
          for: ['Low or high sugar; ketones; jaundice; uraemic smell; hypothermia'],
          refs: [{ chapter: 35, pages: '601, 603–604' }],
        },
        {
          name: 'A: Apoplexy (head injury, stroke, bleed, subdural or extradural, meningitis, encephalitis, epilepsy)',
          urgent: true,
          for: ['Focal signs, unequal pupils, deviated eyes; head injury; neck stiffness; fever; bitten tongue'],
          refs: [{ chapter: 35, pages: '601–604' }],
        },
      ],
    },
    {
      heading: 'Don’t be misled',
      items: [
        {
          name: 'Alcohol plus something else',
          urgent: true,
          for: ['Smell of alcohol does not rule out head injury, hypoglycaemia or overdose'],
          refs: [{ chapter: 35, pages: '603–604' }],
        },
        {
          name: 'Non-convulsive status epilepticus',
          for: ['Reduced consciousness without obvious fitting'],
          refs: [{ chapter: 35, pages: '602' }],
        },
        {
          name: 'Locked-in syndrome',
          for: ['Awake, can move only the eyes'],
          refs: [{ chapter: 35, pages: '603' }],
        },
      ],
    },
  ],
  plan: [
    {
      heading: 'Extend the examination',
      refs: [{ chapter: 35, pages: '604' }],
      points: [
        { text: 'Blood sugar repeated; urine for glucose and ketones' },
        { text: 'Blood gas, electrolytes, kidney and liver tests', extra: true },
        { text: 'ECG; paracetamol and salicylate levels if overdose possible', extra: true },
        { text: 'CT head if no clear metabolic or toxic cause, or focal signs', extra: true },
      ],
    },
    {
      heading: 'Decide',
      refs: [
        { chapter: 35, pages: '602', label: 'Table 35.4' },
        { chapter: 47, pages: '870', label: 'List 47.2' },
      ],
      points: [
        { text: 'GCS below 10, or no gag reflex: the airway is at risk', urgent: true },
        { text: 'Record the GCS parts and repeat them: a falling score is an emergency' },
        { text: 'Then follow the hospital’s unconscious patient flowchart and checklist below' },
      ],
    },
  ],
};
