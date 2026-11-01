import { createJSONStorage, type StateStorage } from 'zustand/middleware';

// localStorage can be missing or throw (private mode, blocked storage): the app still works, it just forgets.
const safe: StateStorage = {
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

export const safeStorage = createJSONStorage(() => safe);
