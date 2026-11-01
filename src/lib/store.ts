import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { safeStorage } from './persist.ts';

export type Theme = 'system' | 'light' | 'dark';
/** Which list the Protocols tab shows. */
export type Library = 'aiims' | 'hospital' | 'flowcharts';

interface AppState {
  /** Ticked checklist items, by item id. Cleared by "New patient". */
  ticks: Record<string, true>;
  /** Pinned chapter and flowchart ids, in the order they were pinned. */
  pins: string[];
  theme: Theme;
  library: Library;
  toggleTick: (id: string) => void;
  clearTicks: () => void;
  togglePin: (chapterId: string) => void;
  setTheme: (t: Theme) => void;
  setLibrary: (l: Library) => void;
}

export const useApp = create<AppState>()(
  persist(
    (set) => ({
      ticks: {},
      pins: [],
      theme: 'system',
      library: 'aiims',
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
      setLibrary: (library) => set({ library }),
    }),
    { name: 'ed-manual', version: 1, storage: safeStorage },
  ),
);
