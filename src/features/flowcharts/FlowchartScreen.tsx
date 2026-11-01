import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BackIcon, StarIcon } from '../../components/Icons.tsx';
import { flowchartById, flowchartByLabel, sheetUrl } from '../../lib/flowcharts.ts';
import { useApp } from '../../lib/store.ts';

export function FlowchartScreen() {
  const { id } = useParams();
  const f = flowchartById(id);
  const pinned = useApp((s) => !!f && s.pins.includes(f.id));
  const togglePin = useApp((s) => s.togglePin);
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [id]);

  if (!f) {
    return (
      <main className="px-safe py-8">
        <p>That flowchart is not in the set.</p>
        <Link to="/" className="text-accent underline">
          Back
        </Link>
      </main>
    );
  }
  const see = f.seeAlso ? flowchartByLabel(f.seeAlso) : undefined;

  return (
    <>
      <header className="pt-safe sticky top-0 z-20 border-b border-line bg-canvas/95 backdrop-blur">
        <div className="px-safe mx-auto flex max-w-3xl items-center gap-1 py-1">
          <Link to="/" aria-label="All flowcharts" className="-ml-2 flex size-12 shrink-0 items-center justify-center">
            <BackIcon className="size-7" />
          </Link>
          <h1 className="line-clamp-2 min-w-0 flex-1 text-lg leading-tight font-bold break-words">
            {f.label} {f.title}
          </h1>
          <button
            type="button"
            onClick={() => togglePin(f.id)}
            aria-pressed={pinned}
            aria-label={pinned ? 'Unpin' : 'Pin to top'}
            className={'flex size-12 shrink-0 items-center justify-center ' + (pinned ? 'text-accent' : 'text-muted')}
          >
            <StarIcon filled={pinned} className="size-7" />
          </button>
        </div>
      </header>
      <main className="px-safe mx-auto max-w-3xl space-y-5 pt-3 pb-8">
        {see && (
          <Link to={`/f/${see.id}`} className="block rounded-xl border-2 border-accent px-3 py-3 font-bold text-accent">
            See {see.label} {see.title} →
          </Link>
        )}
        <p className="text-sm text-muted">Tap a sheet to open it full size and zoom.</p>
        {f.sheets.map((s) => (
          <figure key={s.src}>
            <figcaption className="mb-1 font-bold">{s.caption}</figcaption>
            <a href={sheetUrl(s.src)} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-xl border border-line bg-white">
              <img
                src={sheetUrl(s.src)}
                width={s.width}
                height={s.height}
                alt={`${f.label} ${f.title}, ${s.caption.toLowerCase()}`}
                className="h-auto w-full"
                loading="lazy"
                decoding="async"
              />
            </a>
          </figure>
        ))}
      </main>
    </>
  );
}
