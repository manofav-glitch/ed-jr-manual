import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import type { Chapter, Section, SectionKind } from '../../data/types.ts';
import { Blocks } from '../../components/Blocks.tsx';
import { Collapsible } from '../../components/Collapsible.tsx';
import { AlertIcon, ArrowIcon, BackIcon, StarIcon } from '../../components/Icons.tsx';
import { InlineText } from '../../components/Inline.tsx';
import { NotesFor } from '../../components/Notes.tsx';
import {
  CHECKLIST_KINDS,
  TAB_LABEL,
  chapterById,
  chapterLine,
  checkItems,
  introFor,
  partFor,
  sectionsFor,
  sheetLabelsFor,
  tabsFor,
} from '../../lib/manual.ts';
import { flowchartByLabel } from '../../lib/flowcharts.ts';
import { useApp } from '../../lib/store.ts';

/** Back to wherever the checklist was opened from (usually its flowchart), else to the list. */
export function BackButton() {
  const navigate = useNavigate();
  const canGoBack = (window.history.state as { idx?: number } | null)?.idx;
  return (
    <button
      type="button"
      aria-label="Back"
      onClick={() => (canGoBack ? navigate(-1) : navigate('/'))}
      className="-ml-2 flex size-12 shrink-0 items-center justify-center"
    >
      <BackIcon className="size-7" />
    </button>
  );
}

export function ProtocolScreen() {
  const { chapterId, tab } = useParams();
  const [params] = useSearchParams();
  const focus = params.get('focus') ?? '';
  const ch = chapterById(chapterId);

  if (!ch) {
    return (
      <main className="px-safe py-8">
        <p>That protocol is not in the manual.</p>
        <Link to="/" className="text-accent underline">
          Back to protocols
        </Link>
      </main>
    );
  }

  const tabs = tabsFor(ch);
  const current: SectionKind = tabs.includes(tab as SectionKind) ? (tab as SectionKind) : tabs[0]!;

  return (
    <>
      <ProtocolHeader ch={ch} tabs={tabs} current={current} />
      <main className="px-safe mx-auto max-w-3xl pb-8">
        <p className="pt-3 text-sm text-muted">
          {chapterLine(ch)}
          {sheetLabelsFor(ch).map((label) => {
            const f = flowchartByLabel(label);
            return f ? (
              <Link key={f.id} to={`/f/${f.id}`} className="ml-2 font-bold whitespace-nowrap text-accent underline">
                Flowchart {f.label}
              </Link>
            ) : null;
          })}
        </p>
        {/* Remount on every jump so collapsed sections open around the search target. */}
        <TabContent key={`${ch.id}/${current}/${focus}`} ch={ch} kind={current} focus={focus} />
        <NextStep ch={ch} tabs={tabs} current={current} />
      </main>
    </>
  );
}

function ProtocolHeader({ ch, tabs, current }: { ch: Chapter; tabs: SectionKind[]; current: SectionKind }) {
  const pinned = useApp((s) => s.pins.includes(ch.id));
  const togglePin = useApp((s) => s.togglePin);
  const ticks = useApp((s) => s.ticks);
  const done = checkItems(ch, current).filter((i) => ticks[i.id]).length;
  const total = checkItems(ch, current).length;

  return (
    <header className="pt-safe sticky top-0 z-20 border-b border-line bg-canvas/95 backdrop-blur">
      <div className="px-safe mx-auto flex max-w-3xl items-center gap-1 py-1">
        <BackButton />
        <h1 className="line-clamp-2 min-w-0 flex-1 text-lg leading-tight font-bold break-words">{ch.title}</h1>
        <button
          type="button"
          onClick={() => togglePin(ch.id)}
          aria-pressed={pinned}
          aria-label={pinned ? 'Unpin' : 'Pin to top'}
          className={'flex size-12 shrink-0 items-center justify-center ' + (pinned ? 'text-accent' : 'text-muted')}
        >
          <StarIcon filled={pinned} className="size-7" />
        </button>
      </div>

      {tabs.length > 1 && (
        <nav aria-label="Steps" className="px-safe mx-auto max-w-3xl overflow-x-auto">
          <ul className="flex gap-1.5 pb-2">
            {tabs.map((k) => (
              <li key={k} className="shrink-0">
                <TabLink ch={ch} kind={k} active={k === current} />
              </li>
            ))}
          </ul>
        </nav>
      )}

      {total > 0 && (
        <div className="px-safe mx-auto flex max-w-3xl items-center gap-3 pb-2">
          <div
            role="progressbar"
            aria-label={`${TAB_LABEL[current]} progress`}
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={done}
            className="h-2.5 flex-1 overflow-hidden rounded-full bg-surface-2"
          >
            <div className="h-full rounded-full bg-accent transition-[width]" style={{ width: `${(done / total) * 100}%` }} />
          </div>
          <p className="shrink-0 text-sm text-muted">
            {done} of {total} done
          </p>
          <NewPatientButton />
        </div>
      )}
    </header>
  );
}

function TabLink({ ch, kind, active }: { ch: Chapter; kind: SectionKind; active: boolean }) {
  const ticks = useApp((s) => s.ticks);
  const list = checkItems(ch, kind);
  const done = list.filter((i) => ticks[i.id]).length;
  const red = kind === 'redflags';
  const style = active
    ? red
      ? 'border-danger bg-danger text-surface'
      : 'border-accent bg-accent text-accent-ink'
    : red
      ? 'border-danger text-danger'
      : 'border-line bg-surface';
  // Keep the current step visible in the scrolling strip.
  const ref = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    if (active) ref.current?.scrollIntoView({ inline: 'center', block: 'nearest' });
  }, [active]);
  return (
    <Link
      ref={ref}
      to={`/p/${ch.id}/${kind}`}
      replace
      aria-current={active ? 'step' : undefined}
      className={'flex min-h-12 items-center gap-1.5 rounded-full border-2 px-3.5 font-bold ' + style}
    >
      {red && <AlertIcon className="size-4" />}
      {TAB_LABEL[kind]}
      {list.length > 0 && (
        <span className="text-sm font-normal opacity-90">
          {done}/{list.length}
        </span>
      )}
    </Link>
  );
}

export function NewPatientButton() {
  const clear = useApp((s) => s.clearTicks);
  const any = useApp((s) => Object.keys(s.ticks).length > 0);
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (!armed) return;
    const t = setTimeout(() => setArmed(false), 3000);
    return () => clearTimeout(t);
  }, [armed]);
  return (
    <button
      type="button"
      disabled={!any}
      onClick={() => {
        if (armed) {
          clear();
          setArmed(false);
        } else setArmed(true);
      }}
      className={
        'min-h-12 shrink-0 rounded-xl border-2 px-3 text-sm font-bold disabled:opacity-40 ' +
        (armed ? 'border-accent bg-accent text-accent-ink' : 'border-line')
      }
    >
      {armed ? 'Tap to clear all' : 'New patient'}
    </button>
  );
}

function TabContent({ ch, kind, focus }: { ch: Chapter; kind: SectionKind; focus: string }) {
  useEffect(() => {
    if (!focus) {
      window.scrollTo({ top: 0 });
      return;
    }
    const el = document.getElementById(focus);
    if (!el) return;
    el.scrollIntoView({ block: 'center' });
    el.classList.add('flash');
  }, [focus]);

  const sections = sectionsFor(ch, kind);
  const first = kind === tabsFor(ch)[0];
  const part = first ? partFor(ch) : undefined;
  const intro = first ? introFor(ch) : [];
  return (
    <div className="pt-2">
      {part && part.intro.length > 0 && (
        <Collapsible id={`${ch.id}-part`} level="subsection" title={`About ${part.title}`} initialOpen={false}>
          <Blocks blocks={part.intro} mode="read" />
        </Collapsible>
      )}
      {intro.map((s) => (
        <div key={s.id} id={s.id} className="my-3 scroll-mt-40 rounded-xl bg-surface-2 px-3 py-1">
          {s.subsections.map((sub) => (
            <div key={sub.id} id={sub.id}>
              <Blocks blocks={sub.blocks} mode="read" />
            </div>
          ))}
        </div>
      ))}
      {sections.map((s) =>
        kind === 'reference' ? (
          <ReferenceSection key={s.id} s={s} focus={focus} only={sections.length === 1} />
        ) : (
          <PlainSection key={s.id} s={s} kind={kind} />
        ),
      )}
    </div>
  );
}

function PlainSection({ s, kind }: { s: Section; kind: SectionKind }) {
  const red = kind === 'redflags';
  return (
    <section
      id={s.id}
      className={'mb-5 scroll-mt-40 ' + (red ? 'rounded-xl border-2 border-danger bg-danger-soft px-3 py-2' : '')}
    >
      {s.heading && (
        <h2 className={'mt-2 mb-1 text-xl font-bold ' + (red ? 'text-danger' : '')}>
          <InlineText runs={s.heading} />
        </h2>
      )}
      <NotesFor id={s.id} />
      {s.subsections.map((sub) => (
        <div key={sub.id} id={sub.id} className="scroll-mt-40">
          {sub.heading && (
            <h3 className="mt-4 mb-1 text-lg font-bold">
              <InlineText runs={sub.heading} />
            </h3>
          )}
          <NotesFor id={sub.id} />
          <Blocks blocks={sub.blocks} mode={CHECKLIST_KINDS.has(kind) ? 'check' : 'read'} />
        </div>
      ))}
    </section>
  );
}

function ReferenceSection({ s, focus, only }: { s: Section; focus: string; only: boolean }) {
  const inside = (id: string) => focus === id || focus.startsWith(`${id}.`);
  const body = s.subsections.map((sub) =>
    sub.heading ? (
      <Collapsible
        key={sub.id}
        id={sub.id}
        level="subsection"
        title={<InlineText runs={sub.heading} />}
        initialOpen={inside(sub.id)}
      >
        <NotesFor id={sub.id} />
        <Blocks blocks={sub.blocks} mode="read" />
      </Collapsible>
    ) : (
      <div key={sub.id} id={sub.id} className="scroll-mt-40">
        <Blocks blocks={sub.blocks} mode="read" />
      </div>
    ),
  );

  // Text before a chapter's first heading (e.g. ch 1's introduction) is shown open.
  if (!s.heading) return <section className="mb-4">{body}</section>;

  return (
    <Collapsible id={s.id} title={<InlineText runs={s.heading} />} initialOpen={only || inside(s.id)}>
      <NotesFor id={s.id} />
      {body}
    </Collapsible>
  );
}

function NextStep({ ch, tabs, current }: { ch: Chapter; tabs: SectionKind[]; current: SectionKind }) {
  const navigate = useNavigate();
  const next = tabs[tabs.indexOf(current) + 1];
  return (
    <div className="mt-8">
      {next ? (
        <button
          type="button"
          onClick={() => navigate(`/p/${ch.id}/${next}`, { replace: true })}
          className="flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 text-lg font-bold text-accent-ink"
        >
          Next: {TAB_LABEL[next]} <ArrowIcon className="size-6" />
        </button>
      ) : (
        <Link
          to="/"
          className="flex min-h-14 w-full items-center justify-center rounded-xl border-2 border-line px-4 text-lg font-bold"
        >
          Back to all protocols
        </Link>
      )}
    </div>
  );
}
