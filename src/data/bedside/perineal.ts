import type { BedsideTopic } from '../bedsideTypes.ts';
import { FIRST_LOOK, MALE_GENITAL_EXAM } from './shared.ts';

export const perineal: BedsideTopic = {
  id: 'perineal-pain',
  title: 'Pain and swelling in the perineal region',
  flowcharts: ['16.4'],
  reviewed: false,
  history: [
    FIRST_LOOK,
    {
      heading: 'The pain and swelling',
      refs: [
        { chapter: 14, pages: '264–266' },
        { chapter: 1, pages: '7–8' },
      ],
      points: [
        { text: 'Where exactly: around the anus, between anus and scrotum or vulva, the vulva itself, the scrotum?' },
        { text: 'How long; getting bigger; throbbing?' },
        { text: 'Fever, feeling unwell', urgent: true },
        { text: 'Pain out of proportion; skin turning dark; spreading fast', urgent: true, hint: 'Necrotising infection (Fournier’s gangrene)', extra: true },
        { text: 'Pain on opening the bowels; blood on the paper', hint: 'Fissure, haemorrhoids' },
        { text: 'Discharge of pus from near the anus', hint: 'Fistula' },
      ],
    },
    {
      heading: 'Urinary and sexual',
      refs: [
        { chapter: 17, pages: '297–300, 303', label: 'List 17.1' },
        { chapter: 18, pages: '314', label: 'List 18.4' },
      ],
      points: [
        { text: 'Burning, frequency, difficulty passing urine', hint: 'Prostatitis, retention' },
        { text: 'Urethral or vaginal discharge; genital ulcers or warts', hint: 'Sexually transmitted infection' },
        { text: 'Sexual history, with consent and privacy' },
      ],
    },
    {
      heading: 'Background',
      refs: [
        { chapter: 13, pages: '227' },
        { chapter: 17, pages: '299', label: 'List 17.4' },
      ],
      points: [
        { text: 'Diabetes, immunosuppression', urgent: true, hint: 'Severe infections' },
        { text: 'Crohn’s disease', hint: 'Perianal abscess and fistula' },
        { text: 'Recent injury, instrumentation or surgery' },
      ],
    },
  ],
  exam: [
    {
      heading: 'General',
      refs: [{ chapter: 47, pages: '871' }],
      points: [
        { text: 'Temperature, pulse, BP', hint: 'Sepsis' },
        { text: 'Blood sugar' },
      ],
    },
    {
      heading: 'Perianal area (gloves, chaperone, separate the buttocks)',
      refs: [
        { chapter: 14, pages: '264–266' },
      ],
      points: [
        { text: 'Tense, bluish, tender lump at the anal margin', hint: 'Thrombosed external haemorrhoid' },
        { text: 'Red, hot, fluctuant swelling beside the anus', hint: 'Perianal or ischiorectal abscess', extra: true },
        { text: 'Crack in the midline posteriorly, sentinel tag', hint: 'Fissure (may make rectal examination too painful)' },
        { text: 'Red pouting opening near the anus', hint: 'Fistula-in-ano' },
        { text: 'Prolapse, warts, skin tags' },
        { text: 'Crepitus or dusky skin spreading into the perineum', urgent: true, hint: 'Necrotising fasciitis', extra: true },
      ],
    },
    {
      heading: 'Rectal examination (if tolerated)',
      refs: [{ chapter: 14, pages: '266–267' }],
      points: [
        { text: 'Exquisite tenderness on one side', hint: 'Ischiorectal abscess' },
        { text: 'Prostate: tender, boggy, warm', hint: 'Prostatitis (do not massage)', extra: true },
      ],
    },
    MALE_GENITAL_EXAM,
    {
      heading: 'Women',
      refs: [{ chapter: 40, pages: '752–753' }],
      points: [
        { text: 'Vulva: swelling at the 4 or 8 o’clock position of the vaginal opening', hint: 'Bartholin’s abscess', extra: true },
        { text: 'Ulcers, discharge' },
      ],
    },
  ],
  differentials: [
    {
      heading: 'Can’t miss',
      items: [
        {
          name: 'Necrotising fasciitis of the perineum (Fournier’s gangrene)',
          urgent: true,
          extra: true,
          for: ['Diabetes; severe pain beyond the signs; dusky skin, crepitus; septic'],
          refs: [],
        },
        {
          name: 'Ischiorectal abscess',
          urgent: true,
          for: ['Severe anal pain; marked tenderness on rectal examination; fever'],
          refs: [{ chapter: 14, pages: '266' }],
        },
        {
          name: 'Acute prostatitis',
          for: ['Fever, perineal pain, dysuria, retention; tender prostate'],
          refs: [{ chapter: 17, pages: '299', label: 'List 17.3' }],
        },
      ],
    },
    {
      heading: 'Common',
      items: [
        {
          name: 'Perianal abscess or fistula',
          for: ['Painful swelling beside the anus; pus; Crohn’s'],
          refs: [{ chapter: 14, pages: '265' }],
        },
        {
          name: 'Thrombosed external haemorrhoid',
          for: ['Small, tense, bluish, very tender lump at the anal margin'],
          refs: [{ chapter: 14, pages: '264' }],
        },
        {
          name: 'Anal fissure',
          for: ['Sharp pain on defecation, blood on the paper; posterior midline crack'],
          refs: [{ chapter: 14, pages: '265–266' }],
        },
        {
          name: 'Bartholin’s abscess',
          extra: true,
          for: ['Painful swelling at the side of the vaginal opening'],
          refs: [],
        },
        {
          name: 'Genital infections (herpes, other STIs)',
          for: ['Painful ulcers or vesicles; discharge'],
          refs: [{ chapter: 18, pages: '314', label: 'List 18.4' }],
        },
        {
          name: 'Scrotal causes (epididymo-orchitis, hernia, torsion)',
          for: ['See the penile and scrotal swelling checklist'],
          refs: [{ chapter: 18, pages: '313–315' }],
        },
      ],
    },
  ],
  plan: [
    {
      heading: 'Extend the examination',
      refs: [
        { chapter: 19, pages: '319–322' },
      ],
      points: [
        { text: 'Blood sugar; urine dipstick' },
        { text: 'Swab any discharge; urine culture' },
        { text: 'Blood cultures if febrile', extra: true },
      ],
    },
    {
      heading: 'Decide',
      refs: [{ chapter: 47, pages: '871' }],
      points: [
        { text: 'Septic, dusky skin or crepitus: urgent surgical review and antibiotics', urgent: true, extra: true },
        { text: 'Abscess: needs drainage', extra: true },
        { text: 'Then follow the hospital’s perineal pain and swelling flowchart below' },
      ],
    },
  ],
};
