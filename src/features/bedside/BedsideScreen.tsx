import { useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import type { BedsideTopic, BookRef, Differential, Point, PointGroup } from '../../data/bedsideTypes.ts';
import { AlertIcon, ArrowIcon, CheckIcon } from '../../components/Icons.tsx';
import { BEDSIDE_STEPS, BOOK, STEP_LABEL, groupsOf, pointId, pointIds, refText, topicById, type BedsideStep } from '../../lib/bedside.ts';
import { flowchartByLabel } from '../../lib/flowcharts.ts';
import { textFor } from '../../lib/manual.ts';
import { useApp } from '../../lib/store.ts';
import { BackButton, NewPatientButton } from '../protocols/ProtocolScreen.tsx';

export function BedsideScreen() {
  const { topicId, step } = useParams();
  const t = topicById(topicId);
  const current: BedsideStep = BEDSIDE_STEPS.includes(step as BedsideStep) ? (step as BedsideStep) : 'history';
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [topicId, current]);

  if (!t) {
    return (
      <main className="px-safe py-8">
        <p>That bedside checklist is not in the app.</p>
        <Link to="/" className="text-accent underline">
          Back to protocols
        </Link>
      </main>
    );
  }

  return (
    <>
      <Header t={t} current={current} />
      <main className="px-safe mx-auto max-w-3xl pb-8">
        <SourceNote t={t} />
        {current === 'ddx' ? (
          t.differentials.map((g) => (
            <section key={g.heading} className="mb-5">
              <h2 className="mt-4 mb-2 text-xl font-bold">{g.heading}</h2>
              <ul className="space-y-3">
                {g.items.map((d) => (
                  <DifferentialCard key={d.name} d={d} />
                ))}
              </ul>
            </section>
          ))
        ) : (
          groupsOf(t, current).map((g, gi) => <Group key={g.heading} t={t} step={current} g={g} gi={gi} />)
        )}
        {current === 'plan' && <HospitalLinks t={t} />}
        <NextStep t={t} current={current} />
      </main>
    </>
  );
}

function Header({ t, current }: { t: BedsideTopic; current: BedsideStep }) {
  const ticks = useApp((s) => s.ticks);
  const ids = pointIds(t, current);
  const done = ids.filter((id) => ticks[id]).length;
  return (
    <header className="pt-safe sticky top-0 z-20 border-b border-line bg-canvas/95 backdrop-blur">
      <div className="px-safe mx-auto flex max-w-3xl items-center gap-1 py-1">
        <BackButton />
        <h1 className="line-clamp-2 min-w-0 flex-1 text-lg leading-tight font-bold break-words">
          {t.title}
          <span className="block text-sm font-normal text-muted">Bedside: history, exam, differentials, plan</span>
        </h1>
      </div>
      <nav aria-label="Steps" className="px-safe mx-auto max-w-3xl overflow-x-auto">
        <ul className="flex gap-1.5 pb-2">
          {BEDSIDE_STEPS.map((k) => (
            <li key={k} className="shrink-0">
              <StepLink t={t} step={k} active={k === current} />
            </li>
          ))}
        </ul>
      </nav>
      {ids.length > 0 && (
        <div className="px-safe mx-auto flex max-w-3xl items-center gap-3 pb-2">
          <div
            role="progressbar"
            aria-label={`${STEP_LABEL[current]} progress`}
            aria-valuemin={0}
            aria-valuemax={ids.length}
            aria-valuenow={done}
            className="h-2.5 flex-1 overflow-hidden rounded-full bg-surface-2"
          >
            <div className="h-full rounded-full bg-accent transition-[width]" style={{ width: `${(done / ids.length) * 100}%` }} />
          </div>
          <p className="shrink-0 text-sm text-muted">
            {done} of {ids.length} done
          </p>
          <NewPatientButton />
        </div>
      )}
    </header>
  );
}

function StepLink({ t, step, active }: { t: BedsideTopic; step: BedsideStep; active: boolean }) {
  const ticks = useApp((s) => s.ticks);
  const ids = pointIds(t, step);
  const done = ids.filter((id) => ticks[id]).length;
  const ref = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    if (active) ref.current?.scrollIntoView({ inline: 'center', block: 'nearest' });
  }, [active]);
  return (
    <Link
      ref={ref}
      to={`/b/${t.id}/${step}`}
      replace
      aria-current={active ? 'step' : undefined}
      className={
        'flex min-h-12 items-center gap-1.5 rounded-full border-2 px-3.5 font-bold ' +
        (active ? 'border-accent bg-accent text-accent-ink' : 'border-line bg-surface')
      }
    >
      {STEP_LABEL[step]}
      {ids.length > 0 && (
        <span className="text-sm font-normal opacity-90">
          {done}/{ids.length}
        </span>
      )}
    </Link>
  );
}

function SourceNote({ t }: { t: BedsideTopic }) {
  return (
    <div className="mt-3 rounded-xl border-2 border-dashed border-review bg-review-soft px-3 py-2 text-sm">
      {!t.reviewed && <p className="font-bold text-review">Draft: not yet checked by a senior.</p>}
      <p>
        Written for this app following <em>{BOOK}</em>, in our own words. Each heading gives the book pages to check.
      </p>
    </div>
  );
}

function Refs({ refs }: { refs: BookRef[] }) {
  if (!refs.length) return null;
  return <p className="text-sm text-muted">Book: {refs.map(refText).join(' · ')}</p>;
}

function ExtraTag() {
  return <span className="ml-1 rounded bg-surface-2 px-1.5 py-0.5 align-middle text-xs font-bold whitespace-nowrap text-muted">Not in the book</span>;
}

function Group({ t, step, g, gi }: { t: BedsideTopic; step: BedsideStep; g: PointGroup; gi: number }) {
  return (
    <section className="mb-5">
      <h2 className="mt-4 text-xl font-bold">{g.heading}</h2>
      <Refs refs={g.refs} />
      <ul className="mt-2 space-y-2">
        {g.points.map((p, pi) => (
          <PointItem key={pi} id={pointId(t, step, gi, pi)} p={p} />
        ))}
      </ul>
    </section>
  );
}

function PointItem({ id, p }: { id: string; p: Point }) {
  const ticked = useApp((s) => !!s.ticks[id]);
  const toggle = useApp((s) => s.toggleTick);
  return (
    <li>
      <button
        type="button"
        role="checkbox"
        aria-checked={ticked}
        onClick={() => toggle(id)}
        className={
          'flex min-h-14 w-full items-start gap-3 rounded-xl border-2 px-3 py-3 text-left transition-colors ' +
          (ticked ? 'border-accent bg-surface-2' : p.urgent ? 'border-danger bg-danger-soft' : 'border-line bg-surface')
        }
      >
        <span
          aria-hidden="true"
          className={
            'mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md border-2 ' +
            (ticked ? 'border-accent bg-accent text-accent-ink' : 'border-muted')
          }
        >
          {ticked && <CheckIcon className="size-5" />}
        </span>
        <span className={'min-w-0 flex-1 ' + (ticked ? 'text-muted' : '')}>
          {p.urgent && (
            <span className="mr-1 inline-flex items-center gap-0.5 align-middle font-bold text-danger">
              <AlertIcon className="size-4" />
              <span className="sr-only">Danger:</span>
            </span>
          )}
          {p.text}
          {p.extra && <ExtraTag />}
          {p.hint && <span className="block text-sm text-muted">→ {p.hint}</span>}
        </span>
      </button>
    </li>
  );
}

function DifferentialCard({ d }: { d: Differential }) {
  return (
    <li
      aria-label={d.name}
      className={'rounded-xl border-2 px-3 py-2 ' + (d.urgent ? 'border-danger bg-danger-soft' : 'border-line bg-surface')}
    >
      <h3 className={'text-lg font-bold ' + (d.urgent ? 'text-danger' : '')}>
        {d.urgent && <AlertIcon className="mr-1 inline size-5 align-[-0.15em]" />}
        {d.name}
        {d.extra && <ExtraTag />}
      </h3>
      <p className="mt-1 text-sm font-bold">Points towards</p>
      <ul className="list-disc space-y-0.5 pl-5">
        {d.for.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>
      {d.against && d.against.length > 0 && (
        <>
          <p className="mt-1 text-sm font-bold">Points away, or watch out</p>
          <ul className="list-disc space-y-0.5 pl-5">
            {d.against.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </>
      )}
      <div className="mt-1">
        <Refs refs={d.refs} />
      </div>
    </li>
  );
}

/** The hospital's own flowchart(s) and checklists for this presentation. */
function HospitalLinks({ t }: { t: BedsideTopic }) {
  const charts = t.flowcharts.map(flowchartByLabel).filter((f) => f !== undefined);
  const texts = [...new Map(t.flowcharts.flatMap(textFor).map((c) => [c.id, c])).values()];
  return (
    <section className="mb-5">
      <h2 className="mt-4 mb-2 text-xl font-bold">Hospital protocol</h2>
      <div className="space-y-2">
        {charts.map((f) => (
          <Link key={f.id} to={`/f/${f.id}`} className="flex min-h-14 items-center justify-between gap-2 rounded-xl border-2 border-accent px-4 py-2 font-bold text-accent">
            <span>
              Flowchart {f.label} {f.title}
            </span>
            <span aria-hidden="true">→</span>
          </Link>
        ))}
        {texts.map((ch) => (
          <Link key={ch.id} to={`/p/${ch.id}`} className="flex min-h-14 items-center justify-between gap-2 rounded-xl border-2 border-accent px-4 py-2 font-bold text-accent">
            <span>
              Checklist {ch.label} {ch.title}
            </span>
            <span aria-hidden="true">→</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function NextStep({ t, current }: { t: BedsideTopic; current: BedsideStep }) {
  const navigate = useNavigate();
  const next = BEDSIDE_STEPS[BEDSIDE_STEPS.indexOf(current) + 1];
  if (!next) return null;
  return (
    <div className="mt-8">
      <button
        type="button"
        onClick={() => navigate(`/b/${t.id}/${next}`, { replace: true })}
        className="flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 text-lg font-bold text-accent-ink"
      >
        Next: {STEP_LABEL[next]} <ArrowIcon className="size-6" />
      </button>
    </div>
  );
}
