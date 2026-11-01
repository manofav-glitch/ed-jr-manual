import { useEffect, useState, type ReactNode } from 'react';
import { CheckIcon } from './Icons.tsx';

export { num } from '../lib/num.ts';

export function NumberField({
  label,
  unit,
  value,
  onChange,
  hint,
}: {
  label: string;
  unit?: ReactNode;
  value: string;
  onChange: (v: string) => void;
  hint?: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-muted">{label}</span>
      <span className="mt-0.5 flex min-h-14 items-center rounded-xl border-2 border-line bg-surface px-3 focus-within:border-accent">
        <input
          aria-label={label}
          inputMode="decimal"
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^0-9.,]/g, ''))}
          className="w-full min-w-0 bg-transparent text-2xl font-bold outline-none"
        />
        {unit && <span className="shrink-0 pl-1 text-muted">{unit}</span>}
      </span>
      {hint && <span className="mt-0.5 block text-sm text-muted">{hint}</span>}
    </label>
  );
}

export function TextField({
  label,
  value,
  onChange,
  multiline,
  placeholder,
}: {
  label: ReactNode;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  placeholder?: string;
}) {
  const cls = 'mt-0.5 w-full rounded-xl border-2 border-line bg-surface px-3 py-2.5 text-lg outline-none focus:border-accent';
  return (
    <label className="block">
      <span className="text-sm font-bold text-muted">{label}</span>
      {multiline ? (
        <textarea rows={3} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={cls} />
      ) : (
        <input value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={cls + ' min-h-13'} />
      )}
    </label>
  );
}

export function CheckRow({
  checked,
  onToggle,
  children,
  tone = 'accent',
}: {
  checked: boolean;
  onToggle: () => void;
  children: ReactNode;
  tone?: 'accent' | 'danger';
}) {
  const on = tone === 'danger' ? 'border-danger bg-danger-soft' : 'border-accent bg-surface-2';
  const box = tone === 'danger' ? 'border-danger bg-danger text-surface' : 'border-accent bg-accent text-accent-ink';
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onToggle}
      className={'flex min-h-14 w-full items-start gap-3 rounded-xl border-2 px-3 py-3 text-left ' + (checked ? on : 'border-line bg-surface')}
    >
      <span
        aria-hidden="true"
        className={'mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md border-2 ' + (checked ? box : 'border-muted')}
      >
        {checked && <CheckIcon className="size-5" />}
      </span>
      <span className="min-w-0 flex-1">{children}</span>
    </button>
  );
}

export function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: ReactNode }[];
  value: T | null;
  onChange: (v: T) => void;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex gap-1.5">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={
            'min-h-12 flex-1 rounded-xl border-2 px-2 font-bold ' +
            (value === o.value ? 'border-accent bg-accent text-accent-ink' : 'border-line bg-surface')
          }
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** A button that needs a second tap within 3 s, for anything that throws work away. */
export function ConfirmButton({ label, confirmLabel, onConfirm, disabled }: { label: string; confirmLabel: string; onConfirm: () => void; disabled?: boolean }) {
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (!armed) return;
    const t = setTimeout(() => setArmed(false), 3000);
    return () => clearTimeout(t);
  }, [armed]);
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => {
        if (armed) {
          onConfirm();
          setArmed(false);
        } else setArmed(true);
      }}
      className={
        'min-h-12 shrink-0 rounded-xl border-2 px-3 text-sm font-bold disabled:opacity-40 ' +
        (armed ? 'border-accent bg-accent text-accent-ink' : 'border-line')
      }
    >
      {armed ? confirmLabel : label}
    </button>
  );
}

export function ToolHeader({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <header className="pt-safe sticky top-0 z-20 border-b border-line bg-canvas/95 backdrop-blur">
      <div className="px-safe mx-auto flex min-h-14 max-w-3xl items-center gap-2 py-1">
        <h1 className="min-w-0 flex-1 text-xl font-bold">{title}</h1>
        {children}
      </div>
    </header>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="mt-6 mb-2 text-lg font-bold">{children}</h2>;
}
