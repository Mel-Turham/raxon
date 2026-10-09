// Plain module (no "use client"): Server Components can read these values.

/** Shared look of the compact list tables (Top Assets, Top Gainers, trades). */
export const LIST_TABLE = {
  header: "[&_tr]:border-0",
  head: "h-8 px-0 text-xs font-normal text-muted-foreground",
  row: "border-border/60 hover:bg-transparent",
  cell: "px-0 py-2",
} as const
