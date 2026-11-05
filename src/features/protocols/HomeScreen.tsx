import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CloseIcon, InfoIcon, SearchIcon, StarIcon } from '../../components/Icons.tsx';
import { allFlowcharts, countSavedSheets, flowchartById, flowcharts, saveAllSheets } from '../../lib/flowcharts.ts';
import { bedsideTopics, topicsFor } from '../../lib/bedside.ts';
import { chapterById, linkedChapters, textFor } from '../../lib/manual.ts';
import { SOURCE_LABEL, buildDocs, createSearch, type SearchHit } from '../../lib/search.ts';
import { useApp } from '../../lib/store.ts';

let searcher: ReturnType<typeof createSearch> | undefined;
const search = (q: string) => (searcher ??= createSearch(buildDocs(flowcharts, linkedChapters, bedsideTopics)))(q);

interface Row {
  id: string;
  to: string;
  num: string;
  title: string;
  checklist?: boolean;
  bedside?: boolean;
}

export function HomeScreen() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const pins = useApp((s) => s.pins);
  const pinned = pins.flatMap((id): Row[] => {
    const f = flowchartById(id);
    if (f) return [{ id: f.id, to: `/f/${f.id}`, num: f.label, title: f.title }];
    const ch = chapterById(id);
    return ch ? [{ id: ch.id, to: `/p/${ch.id}`, num: ch.label, title: `${ch.title} (checklist)` }] : [];
  });
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [q]);

  return (
    <>
      <header className="pt-safe sticky top-0 z-20 border-b border-line bg-canvas/95 backdrop-blur">
        <div className="px-safe mx-auto flex max-w-3xl items-center gap-2 py-2">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl leading-tight font-bold">ED Protocols</h1>
            <p className="truncate text-sm text-muted">Emergency Department · works offline</p>
          </div>
          <Link to="/about" aria-label="About" className="flex size-12 items-center justify-center text-muted">
            <InfoIcon className="size-7" />
          </Link>
        </div>
        <div className="px-safe mx-auto max-w-3xl pb-3">
          <label className="flex min-h-13 items-center gap-2 rounded-xl border-2 border-line bg-surface px-3 focus-within:border-accent">
            <SearchIcon className="size-6 shrink-0 text-muted" />
            <span className="sr-only">Search the protocols</span>
            <input
              type="text"
              role="searchbox"
              enterKeyHint="search"
              value={q}
              onChange={(e) => setParams(e.target.value ? { q: e.target.value } : {}, { replace: true })}
              placeholder="Search the protocols"
              autoComplete="off"
              className="min-w-0 flex-1 bg-transparent py-2 text-lg outline-none placeholder:text-muted"
            />
            {q && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setParams({}, { replace: true })}
                className="flex size-10 items-center justify-center"
              >
                <CloseIcon className="size-6" />
              </button>
            )}
          </label>
        </div>
      </header>

      <main className="px-safe mx-auto max-w-3xl pb-8">
        {q.trim().length >= 2 ? (
          <Results q={q} />
        ) : (
          <>
            {pinned.length > 0 && <RowList title="Pinned" rows={pinned} />}
            <SaveOffline />
            {flowcharts.parts.map((p) => (
              <RowList
                key={p.label}
                title={`${p.label} ${p.title}`}
                rows={p.items.map((f) => ({
                  id: f.id,
                  to: `/f/${f.id}`,
                  num: f.label,
                  title: f.title,
                  checklist: textFor(f.label).length > 0,
                  bedside: topicsFor(f.label).length > 0,
                }))}
              />
            ))}
          </>
        )}
      </main>
    </>
  );
}

/** Flowchart sheets are saved as they are opened; this saves them all at once. */
function SaveOffline() {
  const total = allFlowcharts.reduce((n, f) => n + f.sheets.length, 0);
  const [saved, setSaved] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    void countSavedSheets().then(setSaved);
  }, []);
  if (!('caches' in window)) return null;
  const all = saved !== null && saved >= total;
  return (
    <div className="mt-4 rounded-xl border border-line bg-surface px-3 py-2">
      <p className="text-sm text-muted">
        {all
          ? 'All flowcharts are saved for offline use.'
          : `${saved ?? 0} of ${total} flowchart sheets saved for offline use. Opened sheets are saved automatically.`}
      </p>
      {!all && (
        <button
          type="button"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              await saveAllSheets((done) => setSaved(done));
            } finally {
              setBusy(false);
              setSaved(await countSavedSheets());
            }
          }}
          className="mt-2 min-h-12 w-full rounded-xl border-2 border-accent font-bold text-accent disabled:opacity-60"
        >
          {busy ? `Saving… ${saved ?? 0} / ${total}` : 'Save all flowcharts for offline (about 24 MB)'}
        </button>
      )}
    </div>
  );
}

function RowList({ title, rows }: { title: string; rows: Row[] }) {
  const pins = useApp((s) => s.pins);
  return (
    <section className="mt-5">
      <h2 className="mb-2 text-sm font-bold tracking-wide text-muted uppercase">{title}</h2>
      <ul className="overflow-hidden rounded-xl border border-line bg-surface">
        {rows.map((r) => (
          <li key={r.id} className="border-t border-line first:border-t-0">
            <Link to={r.to} className="flex min-h-14 items-center gap-3 px-3 py-2">
              <span className="w-11 shrink-0 text-right font-bold text-muted tabular-nums">{r.num}</span>
              <span className="min-w-0 flex-1 text-lg">
                {r.title}
                {r.checklist && <span className="ml-2 align-middle text-sm font-bold whitespace-nowrap text-info">+ checklist</span>}
                {r.bedside && <span className="ml-2 align-middle text-sm font-bold whitespace-nowrap text-info">+ bedside</span>}
              </span>
              {title !== 'Pinned' && pins.includes(r.id) && <StarIcon filled className="size-5 shrink-0 text-accent" aria-label="Pinned" />}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Results({ q }: { q: string }) {
  const hits = useMemo(() => search(q), [q]);
  if (!hits.length) return <p className="mt-6 text-lg text-muted">Nothing matches “{q}”.</p>;
  return (
    <section className="mt-3" aria-label="Search results">
      <p className="mb-2 text-sm text-muted">
        {hits.length} {hits.length === 1 ? 'result' : 'results'}
      </p>
      <ul className="space-y-2">
        {hits.map((h, i) => (
          <li key={`${h.doc.id}-${i}`}>
            <Hit hit={h} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function Hit({ hit }: { hit: SearchHit }) {
  return (
    <Link to={hit.doc.url} className="block rounded-xl border border-line bg-surface px-3 py-2.5">
      <p className="text-sm text-muted">
        <span className="mr-1.5 rounded bg-surface-2 px-1.5 py-0.5 font-bold">{SOURCE_LABEL[hit.doc.source]}</span>
        {hit.doc.where}
      </p>
      <p className="mt-0.5">
        <Highlighted text={hit.doc.text} ranges={hit.ranges} />
      </p>
    </Link>
  );
}

function Highlighted({ text, ranges }: { text: string; ranges: [number, number][] }) {
  const parts: React.ReactNode[] = [];
  let at = 0;
  for (const [a, b] of [...ranges].sort((x, y) => x[0] - y[0])) {
    if (a < at) continue;
    parts.push(text.slice(at, a), <mark key={a} className="rounded bg-focus/40 text-ink">{text.slice(a, b + 1)}</mark>);
    at = b + 1;
  }
  parts.push(text.slice(at));
  return <>{parts}</>;
}
