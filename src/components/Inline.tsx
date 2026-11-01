import type { Inline } from '../data/types.ts';

/** Manual text, exactly as written, with its bold and italic. */
export function InlineText({ runs }: { runs: Inline[] }) {
  return (
    <>
      {runs.map((r, i) => {
        switch (r.t) {
          case 'text':
            // A line break inside a markdown paragraph is a space.
            return r.v.replace(/\n/g, ' ');
          case 'strong':
            return (
              <strong key={i} className="font-bold">
                <InlineText runs={r.c} />
              </strong>
            );
          case 'em':
            return (
              <em key={i}>
                <InlineText runs={r.c} />
              </em>
            );
          case 'code':
            return <code key={i}>{r.v}</code>;
          case 'link':
            return (
              <span key={i}>
                <InlineText runs={r.c} />
              </span>
            );
        }
      })}
    </>
  );
}
