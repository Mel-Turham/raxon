import { DAY } from "@/shared/lib/time"

export const TRANSACTION_RANGES = ["1D", "7D", "1M", "1Y"] as const

export type TransactionRange = (typeof TRANSACTION_RANGES)[number]

export const TRANSACTION_DEFAULT_RANGE: TransactionRange = "1Y"

export const TRANSACTION_RANGE_DURATION: Record<TransactionRange, number> = {
  "1D": DAY,
  "7D": 7 * DAY,
  "1M": 30 * DAY,
  "1Y": 365 * DAY,
}

export const TRANSACTION_INTERVALS = ["1H", "24H", "7D"] as const

export type TransactionInterval = (typeof TRANSACTION_INTERVALS)[number]

export const TRANSACTION_DEFAULT_INTERVAL: TransactionInterval = "24H"

export const intervalLabel = (interval: TransactionInterval) =>
  interval.toLowerCase()
