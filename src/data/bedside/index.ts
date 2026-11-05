import type { BedsideTopic } from '../bedsideTypes.ts';
import { breathlessness } from './breathlessness.ts';
import { chestPain } from './chestPain.ts';
import { feverChest } from './feverChest.ts';
import { haemoptysis } from './haemoptysis.ts';
import { hypertension } from './hypertension.ts';
import { syncope } from './syncope.ts';

/** Batch 1: heart and lungs (book sections 2 and 3). */
export const bedsideTopics: BedsideTopic[] = [chestPain, breathlessness, syncope, haemoptysis, feverChest, hypertension];
