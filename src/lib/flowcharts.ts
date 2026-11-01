import data from '../data/flowcharts.json';
import type { FlowchartItem, Flowcharts } from '../data/flowchartTypes.ts';

export const flowcharts = data as Flowcharts;

export const allFlowcharts: FlowchartItem[] = flowcharts.parts.flatMap((p) => p.items);

export function flowchartById(id: string | undefined): FlowchartItem | undefined {
  return allFlowcharts.find((f) => f.id === id);
}

export function flowchartByLabel(label: string): FlowchartItem | undefined {
  return allFlowcharts.find((f) => f.label === label);
}

/** Absolute URL of a sheet image under the site's base path. */
export function sheetUrl(src: string): string {
  return `${import.meta.env?.BASE_URL ?? '/'}${src}`;
}

/** The runtime cache the service worker keeps sheets in (vite.config.ts uses the same name). */
export const SHEET_CACHE = 'flowcharts';

/** Download every sheet into the offline cache. Already-cached sheets are skipped. */
export async function saveAllSheets(onProgress: (done: number, total: number) => void): Promise<number> {
  const urls = allFlowcharts.flatMap((f) => f.sheets.map((s) => sheetUrl(s.src)));
  const cache = await caches.open(SHEET_CACHE);
  let done = 0;
  for (const url of urls) {
    if (!(await cache.match(url))) await cache.add(url);
    onProgress(++done, urls.length);
  }
  return done;
}

export async function countSavedSheets(): Promise<number> {
  try {
    const cache = await caches.open(SHEET_CACHE);
    return (await cache.keys()).length;
  } catch {
    return 0;
  }
}
