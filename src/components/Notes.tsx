import { reviewNotesById } from '../lib/notes.ts';
import { AlertIcon } from './Icons.tsx';

/** "Check before use" notes attached to this element of the manual. */
export function NotesFor({ id }: { id: string }) {
  const review = reviewNotesById.get(id) ?? [];
  if (!review.length) return null;
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
    </div>
  );
}
