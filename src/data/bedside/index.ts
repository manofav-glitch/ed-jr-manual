import type { BedsideTopic } from '../bedsideTypes.ts';
import { abdominalPain } from './abdominalPain.ts';
import { appetite } from './appetite.ts';
import { bloating } from './bloating.ts';
import { breathlessness } from './breathlessness.ts';
import { chestPain } from './chestPain.ts';
import { constipation } from './constipation.ts';
import { diarrhoea } from './diarrhoea.ts';
import { dysphagia } from './dysphagia.ts';
import { feverChest } from './feverChest.ts';
import { feverJaundice } from './feverJaundice.ts';
import { haematemesis } from './haematemesis.ts';
import { haemoptysis } from './haemoptysis.ts';
import { hypertension } from './hypertension.ts';
import { rectalBleeding } from './rectalBleeding.ts';
import { syncope } from './syncope.ts';
import { vomiting } from './vomiting.ts';

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
];
