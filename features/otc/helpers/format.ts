import { CURRENCY_FORMAT, decimalFormat } from "@/shared/lib/format"

export const USD_FORMAT = CURRENCY_FORMAT
export const TOTAL_FORMAT = decimalFormat(2)
export const AMOUNT_FORMAT = decimalFormat(0, 4)
export const PERCENT_FORMAT = decimalFormat(2)
export const COUNTDOWN_FORMAT = { minimumIntegerDigits: 2 } as const
export const USD_COMPACT_FORMAT = {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
} as const satisfies Intl.NumberFormatOptions
