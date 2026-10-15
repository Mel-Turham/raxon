export type ChartPoint = { date: Date; value: number; plot: number }

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
