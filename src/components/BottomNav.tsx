import type { ComponentType, SVGProps } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { BookIcon, HeartPulseIcon, NoteIcon, SyringeIcon, TriageIcon } from './Icons.tsx';

const TABS: { to: string; label: string; Icon: ComponentType<SVGProps<SVGSVGElement>> }[] = [
  { to: '/', label: 'Protocols', Icon: BookIcon },
  { to: '/triage', label: 'Triage', Icon: TriageIcon },
  { to: '/code', label: 'Code blue', Icon: HeartPulseIcon },
  { to: '/doses', label: 'Doses', Icon: SyringeIcon },
  { to: '/note', label: 'Note', Icon: NoteIcon },
];

export function BottomNav() {
  const { pathname } = useLocation();
  // Protocol pages and About belong to the Protocols tab.
  const inProtocols = pathname === '/' || pathname.startsWith('/p/') || pathname === '/about';
  return (
    <nav aria-label="Main" className="pb-safe fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface">
      <ul className="mx-auto flex max-w-3xl">
        {TABS.map(({ to, label, Icon }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              className={({ isActive }) => {
                const active = to === '/' ? inProtocols : isActive;
                return (
                  'flex min-h-16 flex-col items-center justify-center gap-0.5 text-sm ' +
                  (active ? 'font-bold text-accent' : 'text-muted')
                );
              }}
              aria-current={to === '/' && inProtocols ? 'page' : undefined}
            >
              <Icon className="size-6" />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
