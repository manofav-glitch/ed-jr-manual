# ED Protocols

A mobile-first, offline bedside app for the hospital's Emergency Department protocols.

- **Protocols**: the 78 presentations of the protocol sheets, each as its two flowchart sheets.
  Where the hospital's text manual covers the same presentation (40 of them), a step-by-step
  checklist opens from the flowchart: History → Exam → Tests → Red flags → Manage → Reference,
  with tickable steps, progress, pins and full-text search.
- **Bedside**: for presentations the textbook covers, a tickable history, examination, differentials
  and plan following Talley & O'Connor, *Clinical Examination* (8th edition), in our own words with
  the book's page numbers. Batch 1 (heart and lungs) covers flowcharts 6.1, 6.2, 7.3, 1.3, 13.3,
  13.5 and 18.2.
- **Triage**, **Code blue**, **Doses** and the case-sheet **Note**, all built from the same text manual.
- Works in airplane mode after the first load. No backend: everything stays in the phone's browser.

It is a decision aid. When the patient does not fit the protocol, escalate to the Consultant on call.

## Quick start

Needs Node 24.

```bash
npm ci
npm run dev        # http://localhost:5173
npm test           # unit tests (parser, links, triage, code blue, doses, note)
npm run e2e        # browser smoke tests; first time: npx playwright install chromium
```

## How it fits together

```
content/hospital.md          the text manual, imported from the hospital's .docx
scripts/import-hospital.ts   text manual .docx → content/hospital.md
scripts/import-flowcharts.ts protocol-sheet .docx → public/flowcharts/*.webp + src/data/flowcharts.json
scripts/parse-manual.ts      content/hospital.md → src/data/hospital.json (generated; never edit the JSON)
src/data/sheetLinks.ts       which text protocol(s) go with each flowchart
src/data/reviewNotes.ts      "Check before use" notes, shown next to the manual text
src/lib/                     pure logic: triage, codeBlue, doses, note, search, anchors, quote
src/features/                screens: protocols, flowcharts, triage, codeblue, doses, note, about
tests/unit/                  Vitest
tests/e2e/                   Playwright, one smoke test per tab + flowcharts + offline
```

The app renders only from the generated data. The tools take their wording from the manual too
(the triage tick-boxes, the arrest pathway and H's and T's, each dose's "From the manual" line), so
nothing clinical is retyped.

## Updating the protocols

Both sources are Word files that are **not** committed (they carry the institution's cover page and
file details). Run the importers on the new files, then parse and test:

```bash
node scripts/import-hospital.ts <manual.docx> --replace "<institution name>=this hospital"
node scripts/import-flowcharts.ts <sheets.docx>
npm run parse && npm test
```

- `import-hospital.ts` drops the cover page, contents, index and the flowchart captions, and carries
  every other word over. `--replace` (repeatable) swaps text everywhere, so the institution is not
  named; at the start of a sentence the replacement is capitalised. Asterisk pairs typed into the
  document (`*Do not lavage*`) are shown as italics, as the authors meant. The run fails if any text
  did not come through.
- `import-flowcharts.ts` takes titles from the document's contents list and pairs each "SHEET n of 2"
  caption with the image after it, saving 1400 px WebP files (about 24 MB in all).
- `npm run parse` rebuilds `src/data/hospital.json`. Commit `content/hospital.md` and the JSON
  together; the deploy fails if the JSON is out of date (`npm run parse -- --check`).
- `tests/unit/hospital.test.ts` fails if the institution's name appears in any file in the
  repository. It compares word hashes, so the test does not contain the name either.

How the parser reads `content/hospital.md`:

| Markdown | Becomes |
|---|---|
| `# 2.0 Part` | A part, with its introduction (shown as "About 2.0 …" on its protocols) |
| `## 2.1 Title` | A protocol; `## 10.0 Title` or an unnumbered `## Title` is a chapter on its own |
| `### Salient history to be taken`, `### Salient clinical examination`, `### Point-of-care investigations`, `### RED FLAG SIGNS…`, `### Basic initial management` | The History, Exam, Tests, Red flags and Manage steps. A protocol with any of them must have all five. |
| any other `###` | Reference (collapsible) |
| `#### Heading` | A collapsible sub-section |

## Linking flowcharts and checklists

`src/data/sheetLinks.ts` maps each flowchart number to the text protocol number(s) for the same
presentation, e.g. `'6.2': ['2.1']` (flowchart Chest Pain → text Chest Pain). Only linked text
protocols appear in the app. `npm test` checks every number exists.

## Editing the bedside checklists

`src/data/bedside/*.ts` holds one presentation per file (types in `src/data/bedsideTypes.ts`;
shared exam sequences in `shared.ts`; the list in `index.ts`). Unlike the protocols, these are
written by hand: the book is copyrighted and the site is public, so nothing is quoted from it.
Instead every heading and differential cites the book (`{ chapter, pages, label }`), and anything
added that is not in the book is marked `extra: true` (shown as "Not in the book"). Set
`reviewed: true` once a senior has checked a presentation against the book; until then it shows as
a draft. `npm test` checks that every flowchart number exists, every heading cites the book, and
every page number is inside the chapter it names. The PDF is not committed.

## Editing the "Check before use" notes

`src/data/reviewNotes.ts` holds notes shown next to the manual text, e.g. where the Triage chapter
and the section 9.1 table disagree. Each note has an `id`, a `title`, a `body`, an optional
`source`, and `anchors`: a chapter id (`hp-triage`, `hp5-1`, …) and `match`, an exact piece of the
manual text it belongs next to. `npm test` fails if a `match` is not found exactly once.

## How the tools read the manual

- **Triage** (Triage chapter and section 9.1). Five zones: Resuscitation Bay, Red, Yellow, Green,
  White. The two tables disagree in places (e.g. Red SpO₂ <92% vs <90%, HR >100 vs >130); the more
  urgent zone wins and every reason names its table. SpO₂ 92–95 % and GCS 9–13 fall between Red and
  a stable survey in both, so they triage up to Red and the screen says so. Tick-boxes are the
  chapter's own lists; ticking chest pain, stroke, sepsis or critical trauma shows the matching
  special alert.
- **Code blue** (9.4 BLS, 9.6 ACLS). 2-minute rhythm-check countdown (restarts at each shock or
  rhythm tap); adrenaline due 3–5 minutes after the last dose; shocks "biphasic 120–200 J";
  amiodarone 300 then 150 mg **or** lignocaine 1–1.5 then 0.5–0.75 mg/kg (in mg once a weight is
  entered in Doses); the H's and T's; 110/min metronome; screen wake lock; a log that survives a
  reload and copies to the case sheet.
- **Doses**: about 40 adult weight-based doses from the manual (seizures, stroke lysis, raised ICP,
  poisoning, anticoagulation, fluids and vasopressors, antibiotics, analgesia, RSI, rabies
  immunoglobulin), with stated maximums applied. Each card quotes its manual line.
- **Note**: the documentation guide's "Standard format for the ED case sheet". Drug allergies print
  in CAPITALS; GCS is written as E_V_M_ = total; vitals and the triage zone import from Triage.
  Name, UHID and contact number are not stored.

## Deploying to GitHub Pages

The repository is `manofav-glitch/ed-jr-manual`, deployed by `.github/workflows/deploy.yml` on every
push to `main`: parse check, typecheck, unit tests, Playwright tests, build with
`BASE_PATH=/<repo>/`, deploy. The site is at https://manofav-glitch.github.io/ed-jr-manual/.
Pages sites are public. Pushing a change to the workflow file needs a token with the `workflow`
scope.

Phones that already have the app pick up a new version in the background and switch to it the
next time the app is opened.

## Offline and installing

The service worker (vite-plugin-pwa) precaches the whole app on the first visit: code, the parsed
manual, fonts and icons. After that it works with no network. Flowchart sheets are kept once
opened; "Save all flowcharts for offline" at the top of the list downloads all of them (about 24 MB).
On Android, Chrome offers "Install app"; on iPhone, use Share → Add to Home Screen.

The icons are generated from `public/icon.svg`: after changing it, run `npx pwa-assets-generator`
and commit the PNGs.

Lighthouse 12 no longer has a PWA category. Installability and offline use are checked by the
Playwright offline test; Lighthouse is still useful for performance and accessibility.
