# ED Manual — junior residents

A mobile-first, offline bedside app built from the **Manual for Junior Residents in Emergency
Medicine** (Department of Emergency Medicine, AIIMS New Delhi). Compiled under the guidance of
Dr Praveen Aggarwal; final compilation and editing by Dr Rachana; content by Dr Roshan Mathew,
Dr Ankit Sahu, Dr Brunda RL, Dr Sakshi Yadav, Dr Akshaya R, Dr Bharath G and Dr Prawal. The full
credits are on the app's About screen.

It is a decision aid. Nothing in it replaces the Senior Resident on shift.

- **Protocols**: every chapter, with presentations as a stepper (History → Exam → Tests → Red flags
  → Manage → Reference), tickable checklists, "Ask SR" badges, pinning and full-text search.
- **Hospital protocols**: the hospital's own ED protocols (44 presentations plus resuscitation,
  medication and reference chapters), in the same stepper.
- **Flowcharts**: 154 flowchart sheets for 78 presentations, as drawn.
- **Triage** (chapter 1), **Code blue** (chapter 13), **Doses** and the **case-sheet Note** (chapter 2).
- Works in airplane mode after the first load. No backend: everything stays in the phone's browser.

## Quick start

Needs Node 24.

```bash
npm ci
npm run dev        # http://localhost:5173
npm test           # unit tests (parser, triage, code blue, doses, note, notes/config)
npm run e2e        # browser smoke tests; first time: npx playwright install chromium
```

## How it fits together

```
content/manual.md            the AIIMS manual — source of its clinical text
content/hospital.md          the hospital protocols, imported from the hospital's .docx
scripts/parse-manual.ts      both .md files → src/data/manual.json and hospital.json (generated; never edit the JSON)
scripts/import-hospital.ts   hospital .docx → content/hospital.md
scripts/import-flowcharts.ts flowchart-sheet .docx → public/flowcharts/*.webp + src/data/flowcharts.json
src/data/reviewNotes.ts      "Check before use" corrections, shown next to the manual text
src/config/site.ts           hospital-specific details (AIIMS, local hospital)
src/lib/                     pure logic: triage, codeBlue, doses, note, search, anchors, quote
src/features/                screens: protocols, triage, codeblue, doses, note, about
tests/unit/                  Vitest
tests/e2e/                   Playwright, one smoke test per tab + offline
```

The app renders only from `manual.json`. The tools pull their labels from it too (the triage
check-boxes, the 5H & 5T list, the code-blue advice, each dose's "From the manual" line), so the
wording is never retyped.

## Updating the manual

1. Edit `content/manual.md`.
2. Run `npm run parse`. It rewrites `src/data/manual.json` and prints a summary, plus a warning for
   anything it could not place.
3. Run `npm test`. The parser tests count chapters, sections, sub-sections and list items straight
   from the markdown and compare them with the JSON, and check that no text was lost or changed.
4. Commit **both** `content/manual.md` and `src/data/manual.json`. The deploy fails if the JSON is
   out of date (`npm run parse -- --check`).

How the parser reads the markdown:

| Markdown | Becomes |
|---|---|
| `## 3. Title` | Chapter 3. Chapters 1–2 are "At the counter", 3–16 "Presentations", 17–21 "Drugs". |
| `### Heading` | A section. Its tab comes from the heading: *history*, *examination*, *investigations*, *red flag / warning signs*, *management / treatment*; *Quick…*, *Differential…* and the like are Reference. |
| `#### Heading` | A collapsible sub-section. |
| A paragraph that is only **bold** | A small heading inside a section. |
| `*` on a list item | An **Ask SR** badge — or **If indicated** in a section whose footnote says `*If indicated`. |
| `- > 250 …` | Kept as "> 250" (markdown would otherwise read it as a quote). |

Every presentation (except chapter 13) must keep exactly one History, Examination, Investigations,
Red flags and Management heading; the parser stops with an error otherwise. A new heading the
parser does not recognise is shown under Reference with a warning: if it belongs elsewhere, add a
pattern to `KIND_RULES` in `scripts/parse-manual.ts`.

## Updating the hospital protocols and flowcharts

Both come from Word files that are **not** committed (they carry the institution's cover page and
file details). To update them, run the importers on the new files, then parse and test:

```bash
node scripts/import-hospital.ts <manual.docx> --replace "<institution name>=this hospital"
node scripts/import-flowcharts.ts <sheets.docx>
npm run parse && npm test
```

- `import-hospital.ts` drops the cover page, contents, index and the flowchart captions, and carries
  every other word over. `--replace` (repeatable) swaps text everywhere, so the institution is not
  named; at the start of a sentence the replacement is capitalised. Asterisk pairs typed into the
  document (`*Do not lavage*`) are shown as italics, as the authors meant. The run fails if any
  text did not come through.
- `import-flowcharts.ts` takes titles from the document's contents list and pairs each "SHEET n of
  2" caption with the image after it, saving 1400 px WebP files (about 24 MB in all).
- `tests/unit/hospital.test.ts` fails if the institution's name appears in any file in the
  repository. It compares word hashes, so the test does not contain the name either.

Hospital protocols use the same tabs as the AIIMS manual, from their fixed column headings. They
have no "Ask SR" badges: the asterisks in that document are formatting, not a convention.

## Editing the "Check before use" notes

`src/data/reviewNotes.ts` lists the corrections. Each note has an `id`, a `title`, a `body`, an
optional `source`, and one or more `anchors`: the chapter number plus `match`, an exact piece of
the manual text the note belongs next to (copy it from `manual.md` without the `**` and `*`
marks). `npm test` fails if a `match` is not found, or is found in more than one place, which also
tells you when a manual edit has moved text a note points to. The notes are listed on the About
screen.

## Site config (AIIMS / local hospital)

`src/config/site.ts` holds two profiles. The active one is `ACTIVE_SITE` (or build with
`VITE_SITE=local`).

| Field | Used for |
|---|---|
| `senior`, `seniorLong` | "Ask SR" badges, the red-flag banner |
| `zones` | Red-flag banner, note disposition buttons, "At <site>" note on chapter 1 |
| `priorityRed` | AIIMS: "AIIMS EHS patient". `useInTriage: false` keeps it out of the triage logic; set `true` to add a check-box. |
| `calls.neurology`, `calls.gastro` | Notes next to "SR Neurology" (ch 4) and "SR Gastro" (ch 8, 19) |
| `codeBlue` | Note next to "ACTIVATE CODE BLUE" (ch 13) |
| `antibiotics` | Note at the top of chapter 21 |
| `tenecteplaseStroke` | Dose calculator (0.25 mg/kg, max 25 mg; change `mgPerKg` to 0.2 for the Indian label) |

With a profile other than AIIMS active, its values appear as "At <site>" notes next to the
AIIMS-specific lines; the manual text itself is unchanged. The local profile was drafted from the
hospital's emergency manual (Revision 02) and is marked `verified: false` (the app shows "draft")
until the department has checked it. The code-blue phone number is still to be added.

## How the tools read the manual

- **Triage**: RED for any compromised primary-survey criterion or time-sensitive emergency;
  YELLOW for a stable primary survey with a vulnerable group; GREEN otherwise.
  - SpO₂ 94–95 %, GCS 13 and SBP 90 fall between the Red and Yellow definitions; they triage up
    to RED and the screen says so.
  - "HR > 120 (without fever)": fever is > 38.0 °C (100.4 °F, chapter 11). Febrile HR > 120 is not
    Red on its own and comes out at least Yellow. With no temperature entered it counts as Red.
  - Yellow's "without tachycardia or bradycardia" has no numbers in the manual; the app uses the
    Red limits (HR 50–120).
- **Code blue**: 2-minute rhythm-check countdown (restarts at each shock or rhythm tap), adrenaline
  due 4 minutes after the last dose, amiodarone 300 then 150 mg. Everything is derived from the
  event log in `localStorage`, so a reload loses nothing.
- **Doses**: adult, weight-based, each quoting its manual line. Stroke tenecteplase uses the site
  config, not the manual's STEMI dose (see the review note).

## Deploying to GitHub Pages

1. Create a GitHub repository (e.g. `ed-jr-manual`). GitHub Pages sites are **public**, even from a
   private repository on a paid plan — make sure the department is happy for the manual to be online.
2. Push this folder to it:
   ```bash
   git remote add origin https://github.com/<user>/ed-jr-manual.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. Every push to `main` runs `.github/workflows/deploy.yml`: parse check, typecheck, unit tests,
   Playwright tests, build with `BASE_PATH=/<repo>/`, deploy. The site appears at
   `https://<user>.github.io/<repo>/`.

Phones that already have the app pick up a new version in the background and switch to it the
next time the app is opened.

## Offline and installing

The service worker (vite-plugin-pwa) precaches the whole app on the first visit: code, both parsed
manuals, fonts and icons. After that it works with no network. Flowchart sheets are kept once
opened; "Save all flowcharts for offline" on the Flowcharts list downloads all of them (about 24 MB). On Android, Chrome
offers "Install app"; on iPhone, use Share → Add to Home Screen.

The icons are generated from `public/icon.svg`: after changing it, run
`npx pwa-assets-generator` and commit the PNGs.

Lighthouse 12 no longer has a PWA category. Installability (manifest, icons, service worker
controlling the page) and offline use are checked by the Playwright offline test; Lighthouse is
still useful for performance, accessibility and best practices:

```bash
npm run build && npx vite preview --port 4173 &
npx lighthouse http://localhost:4173/ --form-factor=mobile --view
```
