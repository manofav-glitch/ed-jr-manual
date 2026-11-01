// Site details: the parts of the app that depend on which hospital it is used in.
//
// The manual is AIIMS New Delhi's and stays as written. When a profile other than AIIMS is
// active, its values appear as "At <site>" notes next to the AIIMS-specific lines of the manual,
// and in the app's own wording (badges, the red-flag banner).
//
// To switch hospital: change ACTIVE_SITE below (or build with VITE_SITE=patel).

import type { Anchor } from '../lib/anchors.ts';

export type SiteId = 'aiims' | 'patel';

export interface SiteProfile {
  id: SiteId;
  name: string;
  /** false until someone at the site has checked every value below. Shown as "Draft" in the app. */
  verified: boolean;
  /** Who a junior asks before acting: used in "Ask SR" badges. */
  senior: string;
  seniorLong: string;
  zones: { resus?: string; red: string; yellow: string; green: string; other?: string[] };
  /** Patients who are Red whatever their vitals (AIIMS: EHS patients). */
  priorityRed: { text: string; useInTriage: boolean } | null;
  calls: { neurology: string; gastro: string };
  codeBlue: string;
  /** Where antibiotic regimens come from at this site. */
  antibiotics: string;
  /**
   * Stroke tenecteplase used by the dose calculator. The manual's 0.5 mg/kg (max 50) is the STEMI
   * dose (see reviewNotes.ts). AHA/ASA: 0.25 mg/kg, max 25 mg; Indian stroke label: 0.2 mg/kg.
   */
  tenecteplaseStroke: { mgPerKg: number; maxMg: number; source: string };
}

const TNK_AHA = { mgPerKg: 0.25, maxMg: 25, source: 'AHA/ASA' };

const aiims: SiteProfile = {
  id: 'aiims',
  name: 'AIIMS New Delhi',
  verified: true,
  senior: 'SR',
  seniorLong: 'Senior Resident',
  zones: { red: 'Red area', yellow: 'Yellow area', green: 'Green' },
  // The manual makes AIIMS EHS patients priority Red. Left out of the triage tool unless switched on.
  priorityRed: { text: 'AIIMS EHS patient', useInTriage: false },
  calls: { neurology: 'SR Neurology', gastro: 'SR Gastro' },
  codeBlue: 'Activate CODE BLUE by informing the telephone operator at the counter.',
  antibiotics: 'Manual chapter 21.',
  tenecteplaseStroke: TNK_AHA,
};

// Drafted 2026-11-02 from the Patel Hospital Emergency Manual, Revision 02
// (PH/INT/QC/MAN/EMG/11680). Every value needs checking by the department.
const patel: SiteProfile = {
  id: 'patel',
  name: 'Patel Hospital, Jalandhar',
  verified: false,
  senior: 'Consultant',
  seniorLong: 'Consultant on call',
  zones: {
    resus: 'Resuscitation Bay',
    red: 'Red bed',
    yellow: 'Yellow bed',
    green: 'Green bed',
    other: ['White (day-care) bed'],
  },
  priorityRed: null,
  calls: {
    neurology: 'Consultant Neurology / Physician (activate the Stroke Alert at triage; inform before the CT)',
    gastro: 'Consultant Gastroenterology / Physician',
  },
  codeBlue: 'Announce CODE BLUE and send for the defibrillator and crash cart. (Add the local number.)',
  antibiotics: 'Patel Emergency Manual section 11.5 (syndromic antibiotic guide) — not yet in the app.',
  tenecteplaseStroke: TNK_AHA,
};

export const sites: Record<SiteId, SiteProfile> = { aiims, patel };

export const ACTIVE_SITE: SiteId = 'aiims';

const fromEnv = import.meta.env?.VITE_SITE as SiteId | undefined;
export const site: SiteProfile = sites[fromEnv && fromEnv in sites ? fromEnv : ACTIVE_SITE];

export function redArea(s: SiteProfile): string {
  return s.zones.resus ? `${s.zones.resus} / ${s.zones.red}` : s.zones.red;
}

/** "Any red flag → shift to Red area, inform SR." */
export function redFlagAction(s: SiteProfile): string {
  return `Any red flag → shift to ${redArea(s)}, inform ${s.senior}.`;
}

// ---- Where the manual is AIIMS-specific ----

export interface SiteNote {
  id: string;
  anchors: Anchor[];
  text: string;
}

/** Notes to show next to AIIMS-specific lines. None when the AIIMS profile is active. */
export function siteNotes(s: SiteProfile): SiteNote[] {
  if (s.id === 'aiims') return [];
  const zones = [s.zones.resus, s.zones.red, s.zones.yellow, s.zones.green, ...(s.zones.other ?? [])].filter(Boolean);
  return [
    {
      id: 'zones',
      anchors: [{ chapter: 1, match: 'The Department of Emergency Medicine is divided into four zones' }],
      text: `Zones: ${zones.join(', ')}.`,
    },
    {
      id: 'priority-red',
      anchors: [{ chapter: 1, match: 'Priority Red even without above criteria: AIIMS EHS patient' }],
      text: s.priorityRed ? `Priority Red: ${s.priorityRed.text}.` : 'The AIIMS EHS rule does not apply here.',
    },
    {
      id: 'neurology',
      anchors: [
        { chapter: 4, match: 'Time to call SR Neurology' },
        { chapter: 4, match: 'Inform SR Neurology ASAP in suspected stroke' },
        { chapter: 4, match: 'Inform SR EM & SR Neurology ASAP' },
      ],
      text: `Call ${s.calls.neurology}.`,
    },
    {
      id: 'gastro',
      anchors: [
        { chapter: 8, match: 'Inform SR Gastro for UGI scopy.' },
        { chapter: 19, match: 'Inform SR Gastroenterology for UGI endoscopy planning.' },
      ],
      text: `Call ${s.calls.gastro}.`,
    },
    {
      id: 'code-blue',
      anchors: [{ chapter: 13, match: 'ACTIVATE CODE BLUE (informing telephone operator in the counter)' }],
      text: s.codeBlue,
    },
    {
      id: 'antibiotics',
      anchors: [{ chapter: 21, match: 'To be prescribed after consulting SR on shift.' }],
      text: `Local antibiotic regimens: ${s.antibiotics}`,
    },
    {
      id: 'aiims-agents',
      anchors: [{ chapter: 12, match: 'Common agents encountered in AIIMS ER' }],
      text: 'This list is from AIIMS.',
    },
  ];
}
