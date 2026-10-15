import {
  CURRENCY_FORMAT,
  ONE_DECIMAL_FORMAT,
  signedPercentFormat,
} from "@/shared/lib/format"

export const SIGNED_CURRENCY = {
  ...CURRENCY_FORMAT,
  signDisplay: "exceptZero",
} as const satisfies Intl.NumberFormatOptions

export const SIGNED_PERCENT = signedPercentFormat(2)

export const ONE_DECIMAL = ONE_DECIMAL_FORMAT

export const COMPACT_CURRENCY = {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
} as const satisfies Intl.NumberFormatOptions

const currencyFormatter = new Intl.NumberFormat("en-US", CURRENCY_FORMAT)
const signedCurrencyFormatter = new Intl.NumberFormat("en-US", SIGNED_CURRENCY)

export const formatCurrency = (value: number) => currencyFormatter.format(value)

export const formatSignedCurrency = (value: number) =>
  signedCurrencyFormatter.format(value)
