export const CURRENCY_FORMAT = {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
} as const satisfies Intl.NumberFormatOptions

/** Asset price: no trailing zeros, up to 4 decimals ($68,420 / $0.2724). */
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

/** Fixed decimals with an explicit sign; pair with a "%" suffix. */
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

/** $18,435.7B / $3,542.5T: billions up to 1,000T, as in the design. */
export const compactCurrencyParts = (value: number) => {
  const [divisor, unit] = value >= 1e15 ? [1e12, "T"] : [1e9, "B"]
  return { value: value / divisor, prefix: "$", suffix: unit }
}

/** Plain number with a fixed range of decimals. */
export const decimalFormat = (
  minimumFractionDigits: number,
  maximumFractionDigits = minimumFractionDigits
) =>
  ({
    minimumFractionDigits,
    maximumFractionDigits,
  }) as const satisfies Intl.NumberFormatOptions
