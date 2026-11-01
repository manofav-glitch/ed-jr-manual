import { useId, useState, type ReactNode } from 'react';
import { ChevronIcon } from './Icons.tsx';

export function Collapsible({
  id,
  title,
  initialOpen,
  level = 'section',
  children,
}: {
  id: string;
  title: ReactNode;
  initialOpen: boolean;
  level?: 'section' | 'subsection';
  children: ReactNode;
}) {
  const [open, setOpen] = useState(initialOpen);
  const regionId = useId();
  return (
    <section id={id} className={'scroll-mt-40 ' + (level === 'section' ? 'mt-3' : 'mt-2')}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={regionId}
        onClick={() => setOpen((o) => !o)}
        className={
          'flex min-h-14 w-full items-center gap-2 rounded-xl px-3 py-2 text-left font-bold ' +
          (level === 'section' ? 'bg-surface-2 text-lg' : 'border border-line bg-surface')
        }
      >
        <span className="min-w-0 flex-1">{title}</span>
        <ChevronIcon className={'size-6 shrink-0 transition-transform ' + (open ? 'rotate-180' : '')} />
      </button>
      <div id={regionId} hidden={!open} className="px-1 pt-1">
        {children}
      </div>
    </section>
  );
}
