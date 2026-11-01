// Shape of src/data/flowcharts.json, produced by scripts/import-flowcharts.ts.

export interface FlowchartSheet {
  /** Path under the site root, e.g. "flowcharts/1-1-1.webp". */
  src: string;
  caption: string;
  width: number;
  height: number;
}

export interface FlowchartItem {
  id: string;
  /** "1.1" */
  label: string;
  title: string;
  sheets: FlowchartSheet[];
  /** "3.3 Loose Stools — see protocol 2.2": the label it points to. */
  seeAlso?: string;
}

export interface Flowcharts {
  parts: { label: string; title: string; items: FlowchartItem[] }[];
}
