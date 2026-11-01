import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CodeEvent } from '../../lib/codeBlue.ts';
import { safeStorage } from '../../lib/persist.ts';

interface CodeState {
  events: CodeEvent[];
  /** Ids of 5H & 5T items ticked as considered. */
  considered: string[];
  metronome: boolean;
  add: (e: CodeEvent) => void;
  undo: () => void;
  toggleConsidered: (id: string) => void;
  setMetronome: (on: boolean) => void;
  reset: () => void;
}

// Persisted on every change, so a reload mid-arrest loses nothing.
export const useCode = create<CodeState>()(
  persist(
    (set) => ({
      events: [],
      considered: [],
      metronome: false,
      add: (e) => set((s) => ({ events: [...s.events, e] })),
      undo: () => set((s) => ({ events: s.events.slice(0, -1) })),
      toggleConsidered: (id) =>
        set((s) => ({ considered: s.considered.includes(id) ? s.considered.filter((x) => x !== id) : [...s.considered, id] })),
      setMetronome: (metronome) => set({ metronome }),
      reset: () => set({ events: [], considered: [], metronome: false }),
    }),
    { name: 'ed-code', version: 1, storage: safeStorage },
  ),
);
