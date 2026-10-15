export const CURRENCY_FORMAT = {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
} as const satisfies Intl.NumberFormatOptions

export const PRICE_FORMAT = {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 4,
} as const satisfies Intl.NumberFormatOptions

export const PERCENT_FORMAT = {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
} as const satisfies Intl.NumberFormatOptions

export const signedPercentFormat = (digits: number) =>
  ({
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
    signDisplay: "exceptZero",
  }) as const satisfies Intl.NumberFormatOptions

export const ONE_DECIMAL_FORMAT = {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
} as const satisfies Intl.NumberFormatOptions

export const compactCurrencyParts = (value: number) => {
  const [divisor, unit] = value >= 1e15 ? [1e12, "T"] : [1e9, "B"]
  return { value: value / divisor, prefix: "$", suffix: unit }
}

export const decimalFormat = (
  minimumFractionDigits: number,
  maximumFractionDigits = minimumFractionDigits
) =>
  ({
    minimumFractionDigits,
    maximumFractionDigits,
  }) as const satisfies Intl.NumberFormatOptions

export const USD_FORMAT = {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
} as const satisfies Intl.NumberFormatOptions

export const COMPACT_CURRENCY_FORMAT = {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 2,
} as const satisfies Intl.NumberFormatOptions

export const CRYPTO_AMOUNT_FORMAT = decimalFormat(0, 8)

export const CRYPTO_AMOUNT = new Intl.NumberFormat(
  "en-US",
  CRYPTO_AMOUNT_FORMAT
)

export const PRICE = new Intl.NumberFormat("en-US", PRICE_FORMAT)

export const shortenAddress = (address: string) =>
  `${address.slice(0, 8)}…${address.slice(-6)}`
