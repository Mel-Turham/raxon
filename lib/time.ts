export const MINUTE = 60_000
export const HOUR = 60 * MINUTE
export const DAY = 24 * HOUR

/**
 * "Now" for the mock market data. Fixed so server and client renders match;
 * switch to Date.now() once real API timestamps are used.
 */
export const MARKET_NOW = Date.UTC(2026, 5, 28)
