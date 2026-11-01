import { useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { site } from '../../config/site.ts';
import type { Chapter, ChapterGroup } from '../../data/types.ts';
import { CloseIcon, InfoIcon, SearchIcon, StarIcon } from '../../components/Icons.tsx';
import { GROUP_LABEL, TAB_LABEL, chapterById, manual, shortTitle, tabsFor } from '../../lib/manual.ts';
import { buildDocs, createSearch, hitUrl, type SearchHit } from '../../lib/search.ts';
import { useApp } from '../../lib/store.ts';

const GROUPS: ChapterGroup[] = ['counter', 'presentation', 'drug'];

let searcher: ReturnType<typeof createSearch> | undefined;
const search = (q: string) => (searcher ??= createSearch(buildDocs(manual)))(q);

export function HomeScreen() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const pins = useApp((s) => s.pins);
  const pinned = pins.map((id) => chapterById(manual, id)).filter((c): c is Chapter => !!c);
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [q]);

  return (
    <>
      <header className="pt-safe sticky top-0 z-20 border-b border-line bg-canvas/95 backdrop-blur">
        <div className="px-safe mx-auto flex max-w-3xl items-center gap-2 py-2">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl leading-tight font-bold">ED Manual</h1>
            <p className="truncate text-sm text-muted">
              Junior residents · {site.name}
              {!site.verified && ' (draft)'}
            </p>
          </div>
          <Link to="/about" aria-label="About and credits" className="flex size-12 items-center justify-center text-muted">
            <InfoIcon className="size-7" />
          </Link>
        </div>
        <div className="px-safe mx-auto max-w-3xl pb-3">
          <label className="flex min-h-13 items-center gap-2 rounded-xl border-2 border-line bg-surface px-3 focus-within:border-accent">
            <SearchIcon className="size-6 shrink-0 text-muted" />
            <span className="sr-only">Search the manual</span>
            <input
              type="text"
              role="searchbox"
              enterKeyHint="search"
              value={q}
              onChange={(e) => setParams(e.target.value ? { q: e.target.value } : {}, { replace: true })}
              placeholder="Search the whole manual"
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
            {pinned.length > 0 && <ChapterList title="Pinned" chapters={pinned} pinnedList />}
            {GROUPS.map((g) => (
              <ChapterList key={g} title={GROUP_LABEL[g]} chapters={manual.chapters.filter((c) => c.group === g)} />
            ))}
          </>
        )}
      </main>
    </>
  );
}

function ChapterList({ title, chapters, pinnedList }: { title: string; chapters: Chapter[]; pinnedList?: boolean }) {
  const pins = useApp((s) => s.pins);
  return (
    <section className="mt-5">
      <h2 className="mb-2 text-sm font-bold tracking-wide text-muted uppercase">{title}</h2>
      <ul className="overflow-hidden rounded-xl border border-line bg-surface">
        {chapters.map((c) => (
          <li key={c.id} className="border-t border-line first:border-t-0">
            <Link to={`/p/${c.id}`} className="flex min-h-14 items-center gap-3 px-3 py-2">
              <span className="w-7 shrink-0 text-right font-bold text-muted">{c.number}</span>
              <span className="min-w-0 flex-1 text-lg">{shortTitle(c)}</span>
              {!pinnedList && pins.includes(c.id) && <StarIcon filled className="size-5 shrink-0 text-accent" aria-label="Pinned" />}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Results({ q }: { q: string }) {
  const hits = useMemo(() => search(q), [q]);
  if (!hits.length) return <p className="mt-6 text-lg text-muted">Nothing in the manual matches “{q}”.</p>;
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
  const ch = chapterById(manual, hit.doc.chapterId);
  const tabbed = ch && tabsFor(ch).length > 1;
  return (
    <Link to={hitUrl(manual, hit.doc)} className="block rounded-xl border border-line bg-surface px-3 py-2.5">
      <p className="text-sm text-muted">
        {hit.doc.chapterNumber}. {ch ? shortTitle(ch) : ''}
        {tabbed && ` › ${TAB_LABEL[hit.doc.tab]}`}
        {hit.doc.where && ` › ${hit.doc.where}`}
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
