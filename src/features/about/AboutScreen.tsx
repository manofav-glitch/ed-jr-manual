import { Link } from 'react-router-dom';
import { reviewNotes } from '../../data/reviewNotes.ts';
import { BackIcon } from '../../components/Icons.tsx';
import { findAnchor } from '../../lib/anchors.ts';
import { allFlowcharts } from '../../lib/flowcharts.ts';
import { chapterById, linkedChapters, manual, urlFor } from '../../lib/manual.ts';
import { useApp, type Theme } from '../../lib/store.ts';

export function AboutScreen() {
  const theme = useApp((s) => s.theme);
  const setTheme = useApp((s) => s.setTheme);
  const sheets = allFlowcharts.reduce((n, f) => n + f.sheets.length, 0);
  return (
    <>
      <header className="pt-safe sticky top-0 z-20 border-b border-line bg-canvas/95 backdrop-blur">
        <div className="px-safe mx-auto flex max-w-3xl items-center gap-1 py-2">
          <Link to="/" aria-label="All protocols" className="-ml-2 flex size-12 items-center justify-center">
            <BackIcon className="size-7" />
          </Link>
          <h1 className="text-xl font-bold">About</h1>
        </div>
      </header>
      <main className="px-safe mx-auto max-w-3xl space-y-6 pt-4 pb-8">
        <section className="space-y-2">
          <h2 className="text-xl font-bold">The hospital's ED protocols</h2>
          <p>
            {allFlowcharts.length} presentations as {sheets} flowchart sheets, {linkedChapters.length} of them with a
            step-by-step checklist from the hospital's text manual, <em>{manual.title}</em>.
          </p>
          <p>
            The tools are built from the same manual: Triage (Triage chapter and section 9.1), Code blue (9.4 and
            9.6), Doses (the manual's weight-based doses) and the case-sheet Note (documentation guide).
          </p>
        </section>

        <section className="rounded-xl border border-line bg-surface px-3 py-2">
          <p>
            The text is shown exactly as written. Where it needs checking, a{' '}
            <strong className="text-review">Check before use</strong> note sits next to it; the manual itself is not
            changed.
          </p>
          <p className="mt-2">A decision aid. When the patient does not fit the protocol, escalate to the Consultant on call.</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold">Check before use ({reviewNotes.length})</h2>
          <ul className="space-y-2">
            {reviewNotes.map((n) => {
              const a = n.anchors[0]!;
              const ch = chapterById(a.chapter);
              const id = findAnchor(manual, a)[0];
              return (
                <li key={n.id}>
                  <Link to={id ? urlFor(id) : '/'} className="block rounded-xl border-2 border-dashed border-review bg-review-soft px-3 py-2">
                    <span className="text-sm text-muted">{ch ? `${ch.label} ${ch.title}`.trim() : ''}</span>
                    <span className="block font-bold">{n.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold">Display</h2>
          <div role="radiogroup" aria-label="Theme" className="flex gap-2">
            {(['system', 'light', 'dark'] as Theme[]).map((t) => (
              <button
                key={t}
                type="button"
                role="radio"
                aria-checked={theme === t}
                onClick={() => setTheme(t)}
                className={
                  'min-h-12 flex-1 rounded-xl border-2 font-bold capitalize ' +
                  (theme === t ? 'border-accent bg-accent text-accent-ink' : 'border-line bg-surface')
                }
              >
                {t}
              </button>
            ))}
          </div>
        </section>

        <section className="text-sm text-muted">
          <p>Manual version: {manual.sourceHash.slice(0, 12)}</p>
        </section>
      </main>
    </>
  );
}
