import type { Inline } from '../data/types.ts';

export function plain(runs: Inline[]): string {
  return runs.map((r) => ('v' in r ? r.v : plain(r.c))).join('');
}
