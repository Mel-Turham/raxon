export const createKeys = (count: number, prefix = "item") =>
  Array.from(
    { length: Math.max(0, count) },
    (_, position) => `${prefix}-${position}`
  )

export const withKeys = <T>(items: readonly T[], prefix = "item") =>
  items.map((value, position) => ({ key: `${prefix}-${position}`, value }))
