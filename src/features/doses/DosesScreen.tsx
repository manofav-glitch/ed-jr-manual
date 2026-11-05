import { useState } from 'react';
import { Link } from 'react-router-dom';
import { NumberField, ToolHeader, num } from '../../components/Fields.tsx';
import { InlineText } from '../../components/Inline.tsx';
import { NotesFor } from '../../components/Notes.tsx';
import { GROUPS, doseCards, weightWarning, type DoseCard } from '../../lib/doses.ts';
import { chapterById, manual, urlFor } from '../../lib/manual.ts';
import { quote } from '../../lib/quote.ts';
import { useWeight } from '../../lib/weight.ts';

export function DosesScreen() {
  const { weight, set } = useWeight();
  const [filter, setFilter] = useState('');
  const kg = num(weight);
  const warning = weightWarning(kg);
  const valid = kg !== undefined && kg > 0 && kg <= 300;
  const f = filter.trim().toLowerCase();
  const cards = doseCards(valid ? kg : 0).filter((c) => !f || c.drug.toLowerCase().includes(f));

  return (
    <>
      <ToolHeader title="Doses" />
      <div className="sticky top-[calc(3.5rem+env(safe-area-inset-top)+1px)] z-10 border-b border-line bg-canvas">
        <div className="px-safe mx-auto grid max-w-3xl grid-cols-2 gap-3 py-2">
          <NumberField label="Weight" unit="kg" value={weight} onChange={set} />
          <label className="block">
            <span className="text-sm font-bold text-muted">Find a drug</span>
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="e.g. levetiracetam"
              className="mt-0.5 min-h-14 w-full rounded-xl border-2 border-line bg-surface px-3 text-lg outline-none focus:border-accent"
            />
          </label>
          {warning && <p className="col-span-2 font-bold text-danger">{warning}</p>}
        </div>
      </div>
      <main className="px-safe mx-auto max-w-3xl pb-8">
        <p className="pt-3 text-sm text-muted">Adult weight-based doses from the hospital manual. Check every dose before giving it.</p>
        {GROUPS.map((g) => {
          const inGroup = cards.filter((c) => c.group === g);
          if (!inGroup.length) return null;
          return (
            <section key={g} className="mt-5">
              <h2 className="mb-2 text-sm font-bold tracking-wide text-muted uppercase">{g}</h2>
              <div className="space-y-3">
                {inGroup.map((c) => (
                  <Card key={c.id} card={c} show={valid} />
                ))}
              </div>
            </section>
          );
        })}
        {!cards.length && <p className="mt-6 text-lg text-muted">No drug matches “{filter}”.</p>}
      </main>
    </>
  );
}

function Card({ card, show }: { card: DoseCard; show: boolean }) {
  return (
    <section className="rounded-xl border border-line bg-surface px-3 py-3" aria-label={card.drug}>
      <h3 className="text-lg font-bold">{card.drug}</h3>
      <dl className="mt-1 space-y-1.5">
        {card.lines.map((l) => (
          <div key={l.label} className="flex flex-wrap items-baseline gap-x-3">
            <dt className="w-28 shrink-0 text-muted">{l.label}</dt>
            <dd className="text-2xl font-bold tabular-nums">{show ? l.value : '—'}</dd>
            {l.detail && <dd className="w-full pl-31 text-sm text-muted">{l.detail}</dd>}
          </div>
        ))}
      </dl>
      {show && card.capped && <p className="mt-2 font-bold">{card.capped}</p>}
      <details className="mt-2">
        <summary className="min-h-10 cursor-pointer py-2 text-sm font-bold text-accent">From the manual</summary>
        {card.source.map((a) => {
          const q = quote(manual, a);
          const ch = chapterById(q.chapter);
          return (
            <blockquote key={q.id} className="my-2 border-l-4 border-line pl-3">
              <Link to={urlFor(q.id)} className="text-sm text-muted underline">
                {ch ? `${ch.label} ${ch.title}`.trim() : q.chapter}
              </Link>
              <p>
                <InlineText runs={q.inline} />
              </p>
            </blockquote>
          );
        })}
      </details>
      {card.source.map((a) => (
        <NotesFor key={a.match} id={quote(manual, a).id} />
      ))}
    </section>
  );
}
