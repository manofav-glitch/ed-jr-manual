import { Link } from 'react-router-dom';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { site } from '../../config/site.ts';
import { NumberField, ToolHeader, num } from '../../components/Fields.tsx';
import { InlineText } from '../../components/Inline.tsx';
import { NotesFor } from '../../components/Notes.tsx';
import { doseCards, weightWarning, type DoseCard } from '../../lib/doses.ts';
import { manual, urlFor } from '../../lib/manual.ts';
import { safeStorage } from '../../lib/persist.ts';
import { quote } from '../../lib/quote.ts';

const useWeight = create<{ weight: string; set: (w: string) => void }>()(
  persist((set) => ({ weight: '', set: (weight) => set({ weight }) }), { name: 'ed-doses', version: 1, storage: safeStorage }),
);

export function DosesScreen() {
  const { weight, set } = useWeight();
  const kg = num(weight);
  const warning = weightWarning(kg);
  const valid = kg !== undefined && kg > 0 && kg <= 300;
  const cards = doseCards(valid ? kg : 0, site.tenecteplaseStroke);

  return (
    <>
      <ToolHeader title="Doses" />
      <div className="sticky top-[calc(3.5rem+env(safe-area-inset-top)+1px)] z-10 border-b border-line bg-canvas">
        <div className="px-safe mx-auto max-w-3xl py-2">
          <NumberField label="Weight" unit="kg" value={weight} onChange={set} />
          {warning && <p className="mt-1 font-bold text-danger">{warning}</p>}
        </div>
      </div>
      <main className="px-safe mx-auto max-w-3xl space-y-3 pt-3 pb-8">
        <p className="text-sm text-muted">Adult doses from the manual. Check every dose before giving it.</p>
        {cards.map((c) => (
          <Card key={c.id} card={c} show={valid} />
        ))}
      </main>
    </>
  );
}

function Card({ card, show }: { card: DoseCard; show: boolean }) {
  return (
    <section className="rounded-xl border border-line bg-surface px-3 py-3" aria-label={card.drug}>
      <h2 className="text-lg font-bold">{card.drug}</h2>
      <dl className="mt-1 space-y-1.5">
        {card.lines.map((l) => (
          <div key={l.label} className="flex flex-wrap items-baseline gap-x-3">
            <dt className="w-28 shrink-0 text-muted">{l.label}</dt>
            <dd className="text-2xl font-bold tabular-nums">{show || !/\d/.test(l.value) ? l.value : '—'}</dd>
            {l.detail && <dd className="w-full pl-31 text-sm text-muted">{l.detail}</dd>}
          </div>
        ))}
      </dl>
      {show && card.capped && <p className="mt-2 font-bold">{card.capped}</p>}
      <details className="mt-2">
        <summary className="min-h-10 cursor-pointer py-2 text-sm font-bold text-accent">From the manual</summary>
        {card.source.map((a) => {
          const q = quote(manual, a);
          return (
            <blockquote key={q.id} className="my-2 border-l-4 border-line pl-3">
              <Link to={urlFor(manual, q.id)} className="text-sm text-muted underline">
                Chapter {q.chapter}
              </Link>
              <p>
                <InlineText runs={q.inline} />
              </p>
            </blockquote>
          );
        })}
      </details>
      {/* Corrections that change the calculation are shown open, not hidden in the quote. */}
      {card.source.map((a) => (
        <OpenNotes key={a.match} anchor={a} />
      ))}
    </section>
  );
}

function OpenNotes({ anchor }: { anchor: DoseCard['source'][number] }) {
  const q = quote(manual, anchor);
  return <NotesFor id={q.id} />;
}
