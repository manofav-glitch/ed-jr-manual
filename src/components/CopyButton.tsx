import { useState } from 'react';
import { copyText } from '../lib/clipboard.ts';

export function CopyButton({ text, label = 'Copy to case sheet' }: { text: string; label?: string }) {
  const [state, setState] = useState<'idle' | 'done' | 'failed'>('idle');
  return (
    <button
      type="button"
      disabled={!text}
      onClick={async () => {
        setState((await copyText(text)) ? 'done' : 'failed');
        setTimeout(() => setState('idle'), 2000);
      }}
      className="flex min-h-14 w-full items-center justify-center rounded-xl bg-accent px-4 text-lg font-bold text-accent-ink disabled:opacity-40"
    >
      {state === 'done' ? 'Copied ✓' : state === 'failed' ? 'Copy failed — select the text below' : label}
    </button>
  );
}
