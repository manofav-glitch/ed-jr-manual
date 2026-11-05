// Which text protocol(s) describe the same presentation as each flowchart.
//
// Navigation only: the flowcharts and the text are both the hospital's own documents, numbered
// differently. Key: flowchart number. Value: text protocol numbers, shown as step-by-step
// checklists from the flowchart page. Text protocols not listed here are not shown in the app.
// `npm test` checks that every number exists.

export const SHEET_TEXT: Record<string, string[]> = {
  '1.1': ['6.2', '6.3'], // Bleeding P/V → early pregnancy bleeding; abnormal uterine bleeding
  '1.2': ['7.2'], // Haematuria
  '1.4': ['3.3'], // Bleeding per rectum → lower GI bleed
  '1.5': ['1.3'], // Blood at the meatus → urethral injury
  '1.8': ['3.2'], // Haematemesis → upper GI bleed
  '2.1': ['3.4'], // Fever, nausea and vomiting → vomiting (undifferentiated)
  '2.2': ['3.5'], // Loose stools → acute gastroenteritis
  '3.1': ['3.1'], // Abdominal pain
  '3.2': ['7.1'], // Urinary retention
  '3.3': ['3.5'], // Loose stools (see 2.2)
  '4.2': ['4.1'], // The unconscious patient
  '5.1': ['4.2'], // Seizure → status epilepticus
  '6.1': ['2.2'], // Shortness of breath
  '6.2': ['2.1'], // Chest pain
  '6.3': ['7.5'], // Anxiety and panic attack
  '7.1': ['4.6'], // Dizziness → vertigo and dizziness
  '7.3': ['2.4'], // Syncope
  '8.0': ['4.7'], // Headache
  '8.3': ['4.4'], // Paralysis and suspected stroke
  '11.1': ['1.1', '1.2'], // RTA with facial trauma and head injury → polytrauma; head injury
  '12': ['1.2'], // Head injury
  '13.1': ['7.3'], // Fever presentations → fever
  '13.2': ['7.3'],
  '13.3': ['7.3'],
  '13.4': ['7.3'],
  '13.5': ['7.3'],
  '13.6': ['7.3'],
  '16.2': ['7.1'], // Urinary retention (see 3.2)
  '17.1': ['6.1'], // Labour pain → labour and obstetric emergency
  '17.2': ['6.2'], // Termination of pregnancy and post-procedure bleeding
  '18.1': ['4.3'], // Hypoglycaemia → metabolic and glycaemic emergencies
  '18.2': ['8.6'], // Hypertension → hypertensive emergency and urgency
  '18.3': ['4.3'], // Hyperglycaemia
  '19.1': ['5.2'], // Animal bite
  '19.3': ['5.1'], // Snake bite → poisoning, general approach
  '20.1': ['5.1'], // Poisoning
  '20.2': ['5.1'], // Phenyl and hydrocarbon ingestion
  '20.4': ['5.1'], // Corrosive and acid ingestion
  '21.2': ['9.4', '9.6'], // Gasping patient and cardiac arrest → BLS; ACLS
  '21.3': ['8.11'], // Brought dead
};
