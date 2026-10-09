export type ChartPoint = { date: Date; value: number; plot: number }

/**
 * bklit charts always start the y-axis at 0. `plot` shifts each value so the
 * line uses the full height, leaving `bottomPadding` (share of the value
 * range) below the lowest point. Tooltips keep reading the real `value`.
 */
export const toChartPoints = (
  values: number[],
  {
    start,
    stepMs,
    bottomPadding,
  }: { start: number; stepMs: number; bottomPadding: number }
): ChartPoint[] => {
  const min = Math.min(...values)
  const baseline = min - (Math.max(...values) - min) * bottomPadding
  return values.map((value, i) => ({
    date: new Date(start + i * stepMs),
    value,
    plot: value - baseline,
  }))
}
