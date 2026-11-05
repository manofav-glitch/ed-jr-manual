import { reviewNotes, type ReviewNote } from '../data/reviewNotes.ts';
import { indexNotes } from './anchors.ts';
import { manual } from './manual.ts';

export const reviewNotesById: Map<string, ReviewNote[]> = indexNotes(manual, reviewNotes);
