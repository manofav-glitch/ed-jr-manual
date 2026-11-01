/** Parse a typed number; empty or invalid → undefined. Accepts "," as the decimal mark. */
export function num(s: string | undefined): number | undefined {
  if (s === undefined || s.trim() === '') return undefined;
  const n = Number(s.replace(',', '.'));
  return Number.isFinite(n) ? n : undefined;
}
