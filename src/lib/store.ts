import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { safeStorage } from './persist.ts';

export type Theme = 'system' | 'light' | 'dark';

interface AppState {
  /** Ticked checklist items, by item id. Cleared by "New patient". */
  ticks: Record<string, true>;
  /** Pinned chapter ids, in the order they were pinned. */
  pins: string[];
  theme: Theme;
  toggleTick: (id: string) => void;
  clearTicks: () => void;
  togglePin: (chapterId: string) => void;
  setTheme: (t: Theme) => void;
}

export const useApp = create<AppState>()(
  persist(
    (set) => ({
      ticks: {},
      pins: [],
      theme: 'system',
      toggleTick: (id) =>
        set((s) => {
          const ticks = { ...s.ticks };
          if (ticks[id]) delete ticks[id];
          else ticks[id] = true;
          return { ticks };
        }),
      clearTicks: () => set({ ticks: {} }),
      togglePin: (id) => set((s) => ({ pins: s.pins.includes(id) ? s.pins.filter((p) => p !== id) : [...s.pins, id] })),
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'ed-manual', version: 1, storage: safeStorage },
  ),
);
