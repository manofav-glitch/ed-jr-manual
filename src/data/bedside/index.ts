import type { BedsideTopic } from '../bedsideTypes.ts';
import { abdominalPain } from './abdominalPain.ts';
import { appetite } from './appetite.ts';
import { backPain } from './backPain.ts';
import { bloating } from './bloating.ts';
import { breathlessness } from './breathlessness.ts';
import { chestPain } from './chestPain.ts';
import { constipation } from './constipation.ts';
import { diarrhoea } from './diarrhoea.ts';
import { dizziness } from './dizziness.ts';
import { drowsy } from './drowsy.ts';
import { dysphagia } from './dysphagia.ts';
import { dysuria } from './dysuria.ts';
import { elbowPain } from './elbowPain.ts';
import { feverChest } from './feverChest.ts';
import { feverHeadache } from './feverHeadache.ts';
import { feverJaundice } from './feverJaundice.ts';
import { flankPain } from './flankPain.ts';
import { haematemesis } from './haematemesis.ts';
import { haematuria } from './haematuria.ts';
import { haemoptysis } from './haemoptysis.ts';
import { headache } from './headache.ts';
import { hypertension } from './hypertension.ts';
import { jointPain } from './jointPain.ts';
import { legWeakness } from './legWeakness.ts';
import { lowUrineOutput } from './lowUrineOutput.ts';
import { neckPain } from './neckPain.ts';
import { numbness } from './numbness.ts';
import { perineal } from './perineal.ts';
import { rectalBleeding } from './rectalBleeding.ts';
import { scrotal } from './scrotal.ts';
import { seizure } from './seizure.ts';
import { stroke } from './stroke.ts';
import { syncope } from './syncope.ts';
import { unconscious } from './unconscious.ts';
import { upperLimb } from './upperLimb.ts';
import { urinaryRetention } from './urinaryRetention.ts';
import { vomiting } from './vomiting.ts';
import { weakness } from './weakness.ts';

export const bedsideTopics: BedsideTopic[] = [
  // Batch 1: heart and lungs (book sections 2 and 3).
  chestPain,
  breathlessness,
  syncope,
  haemoptysis,
  feverChest,
  hypertension,
  // Batch 2: gut (book section 4).
  haematemesis,
  rectalBleeding,
  vomiting,
  diarrhoea,
  abdominalPain,
  constipation,
  bloating,
  appetite,
  dysphagia,
  feverJaundice,
  // Batch 3: kidney and urine (book section 5).
  haematuria,
  urinaryRetention,
  lowUrineOutput,
  flankPain,
  perineal,
  scrotal,
  dysuria,
  // Batch 4: nervous system (book section 9).
  drowsy,
  unconscious,
  seizure,
  dizziness,
  weakness,
  headache,
  numbness,
  legWeakness,
  stroke,
  feverHeadache,
  // Batch 5: joints and back (book section 7).
  backPain,
  upperLimb,
  elbowPain,
  neckPain,
  jointPain,
];
