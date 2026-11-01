import type { Block, Item } from '../data/types.ts';
import { isLeaf } from '../lib/manual.ts';
import { useApp } from '../lib/store.ts';
import { CheckIcon } from './Icons.tsx';
import { InlineText } from './Inline.tsx';
import { MarkerBadge, NotesFor } from './Notes.tsx';

/** 'check': items without sub-points are tickable steps. 'read': plain bullets. */
export type Mode = 'check' | 'read';

export function Blocks({ blocks, mode }: { blocks: Block[]; mode: Mode }) {
  return (
    <>
      {blocks.map((b, i) => (
        <BlockView key={'id' in b ? b.id : i} block={b} mode={mode} />
      ))}
    </>
  );
}

function BlockView({ block: b, mode }: { block: Block; mode: Mode }) {
  switch (b.type) {
    case 'paragraph':
      return (
        <div id={b.id} className="my-2 scroll-mt-40">
          <p>
            <InlineText runs={b.inline} />
          </p>
          <NotesFor id={b.id} />
        </div>
      );
    case 'subhead':
      return (
        <div id={b.id} className="mt-4 mb-1 scroll-mt-40">
          <h4 className="font-bold">
            <InlineText runs={b.inline} />
          </h4>
          <NotesFor id={b.id} />
        </div>
      );
    case 'callout':
      return (
        <div id={b.id} className="my-3 scroll-mt-40 rounded-lg border-l-4 border-info bg-info-soft px-3 py-1">
          <Blocks blocks={b.blocks} mode="read" />
        </div>
      );
    case 'table':
      return (
        <div id={b.id} className="my-3 scroll-mt-40 overflow-x-auto rounded-lg border border-line">
          <table className="w-full border-collapse text-left">
            {b.header.some((c) => c.length) && (
              <thead className="bg-surface-2">
                <tr>
                  {b.header.map((c, i) => (
                    <th key={i} className="border-b border-line px-3 py-2 align-top font-bold">
                      <InlineText runs={c} />
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {b.rows.map((row, r) => (
                <tr key={r} className="border-t border-line first:border-t-0">
                  {row.map((c, i) => (
                    <td key={i} className="min-w-28 px-3 py-2 align-top">
                      <InlineText runs={c} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'list': {
      const Tag = b.ordered ? 'ol' : 'ul';
      return (
        <Tag className={mode === 'check' ? 'my-2 space-y-2' : 'my-2 space-y-1.5'}>
          {b.items.map((it) =>
            mode === 'check' && isLeaf(it) ? (
              <CheckItem key={it.id} item={it} />
            ) : (
              <ReadItem key={it.id} item={it} ordered={b.ordered} mode={mode} />
            ),
          )}
        </Tag>
      );
    }
  }
}

function ReadItem({ item, ordered, mode }: { item: Item; ordered: boolean; mode: Mode }) {
  const isGroup = mode === 'check';
  return (
    <li id={item.id} className={'scroll-mt-40 ' + (isGroup ? 'pt-2' : 'flex gap-2')}>
      {!isGroup && (
        <span aria-hidden="true" className="w-6 shrink-0 text-right font-bold text-muted">
          {ordered ? `${item.n}.` : '•'}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <span className={isGroup ? 'font-bold' : ''}>
          {ordered && isGroup && `${item.n}. `}
          <InlineText runs={item.inline} />
        </span>
        <MarkerBadge marker={item.marker} />
        <NotesFor id={item.id} />
        <div className={isGroup ? 'mt-1 border-l-2 border-line pl-3' : ''}>
          <Blocks blocks={item.children} mode={mode} />
        </div>
      </div>
    </li>
  );
}

function CheckItem({ item }: { item: Item }) {
  const ticked = useApp((s) => !!s.ticks[item.id]);
  const toggle = useApp((s) => s.toggleTick);
  return (
    <li id={item.id} className="scroll-mt-40">
      <button
        type="button"
        role="checkbox"
        aria-checked={ticked}
        onClick={() => toggle(item.id)}
        className={
          'flex min-h-14 w-full items-start gap-3 rounded-xl border-2 px-3 py-3 text-left transition-colors ' +
          (ticked ? 'border-accent bg-surface-2' : 'border-line bg-surface')
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
          {item.n !== undefined && <span className="font-bold">{item.n}. </span>}
          <InlineText runs={item.inline} />
          <MarkerBadge marker={item.marker} />
        </span>
      </button>
      <NotesFor id={item.id} />
      {item.children.length > 0 && (
        <div className="mt-1 pl-10">
          <Blocks blocks={item.children} mode="read" />
        </div>
      )}
    </li>
  );
}
