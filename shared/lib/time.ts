export const MINUTE = 60_000
export const HOUR = 60 * MINUTE
export const DAY = 24 * HOUR

export const MARKET_NOW = Date.UTC(2026, 5, 28)

const RELATIVE_FORMAT = new Intl.RelativeTimeFormat("en", {
  numeric: "auto",
  style: "short",
})

const RELATIVE_STEPS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["minute", MINUTE],
  ["hour", HOUR],
  ["day", DAY],
]

export const formatRelativeTime = (iso: string, now = Date.now()) => {
  const elapsed = now - Date.parse(iso)
  if (elapsed < MINUTE) return "just now"
  const [unit, size] =
    [...RELATIVE_STEPS].reverse().find(([, ms]) => elapsed >= ms) ??
    RELATIVE_STEPS[0]
  return RELATIVE_FORMAT.format(-Math.floor(elapsed / size), unit)
}
