import { reviewNotes, type ReviewNote } from '../data/reviewNotes.ts';
import { site, siteNotes, type SiteNote } from '../config/site.ts';
import { indexNotes } from './anchors.ts';
import { manual } from './manual.ts';

export const reviewNotesById: Map<string, ReviewNote[]> = indexNotes(manual, reviewNotes);
export const siteNotesById: Map<string, SiteNote[]> = indexNotes(manual, siteNotes(site));
