export const PORTFOLIO_RANGES = ["12H", "2H", "1D", "7D", "1M", "1Y"] as const

export type PortfolioRange = (typeof PORTFOLIO_RANGES)[number]

export const PORTFOLIO_DEFAULT_RANGE: PortfolioRange = "7D"

/** Portfolio value shown on the default range (from the design). */
export const PORTFOLIO_CURRENT_VALUE = 83_727.9
