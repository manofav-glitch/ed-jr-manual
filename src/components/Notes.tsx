import { site } from '../config/site.ts';
import type { Marker } from '../data/types.ts';
import { reviewNotesById, siteNotesById } from '../lib/notes.ts';
import { AlertIcon } from './Icons.tsx';

/** "Check before use" corrections and local-site notes attached to this element of the manual. */
export function NotesFor({ id }: { id: string }) {
  const review = reviewNotesById.get(id) ?? [];
  const local = siteNotesById.get(id) ?? [];
  if (!review.length && !local.length) return null;
  return (
    <div className="mt-2 space-y-2">
      {review.map((n) => (
        <aside
          key={n.id}
          className="rounded-lg border-2 border-dashed border-review bg-review-soft px-3 py-2 text-review"
          aria-label="Check before use"
        >
          <p className="flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide">
            <AlertIcon className="shrink-0" /> Check before use
          </p>
          <p className="mt-0.5 font-bold text-ink">{n.title}</p>
          <p className="text-ink">{n.body}</p>
          {n.source && <p className="mt-1 text-sm text-muted">Source: {n.source}</p>}
        </aside>
      ))}
      {local.map((n) => (
        <aside key={n.id} className="rounded-lg border border-info bg-info-soft px-3 py-2 text-ink" aria-label={`At ${site.name}`}>
          <p className="text-sm font-bold text-info">
            At {site.name}
            {!site.verified && ' · draft, check locally'}
          </p>
          <p>{n.text}</p>
        </aside>
      ))}
    </div>
  );
}

export function MarkerBadge({ marker }: { marker: Marker | undefined }) {
  if (!marker) return null;
  const label = marker === 'askSr' ? `Ask ${site.senior}` : 'If indicated';
  return (
    <span
      className={
        'ml-2 inline-block whitespace-nowrap rounded-full px-2 py-0.5 align-middle text-sm font-bold ' +
        (marker === 'askSr' ? 'bg-info text-surface' : 'border border-info text-info')
      }
    >
      {label}
    </span>
  );
}
