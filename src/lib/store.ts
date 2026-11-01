import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';

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

// localStorage can be missing or throw (private mode, blocked storage): the app still works, it just forgets.
const safeStorage: StateStorage = {
  getItem: (k) => {
    try {
      return localStorage.getItem(k);
    } catch {
      return null;
    }
  },
  setItem: (k, v) => {
    try {
      localStorage.setItem(k, v);
    } catch {
      // ignore
    }
  },
  removeItem: (k) => {
    try {
      localStorage.removeItem(k);
    } catch {
      // ignore
    }
  },
};

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
    { name: 'ed-manual', version: 1, storage: createJSONStorage(() => safeStorage) },
  ),
);
