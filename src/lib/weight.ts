import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { safeStorage } from './persist.ts';

/** The patient's weight, shared by Doses and Code blue. Raw text, so half-typed values survive. */
export const useWeight = create<{ weight: string; set: (w: string) => void }>()(
  persist((set) => ({ weight: '', set: (weight) => set({ weight }) }), { name: 'ed-doses', version: 1, storage: safeStorage }),
);
