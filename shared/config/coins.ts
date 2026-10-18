export const STABLECOIN_SYMBOLS = new Set([
  "USDT",
  "USDC",
  "USDE",
  "USDS",
  "DAI",
  "FDUSD",
  "USD1",
  "PYUSD",
  "TUSD",
  "RLUSD",
  "USDD",
  "BUSD",
  "USDTB",
  "USDF",
])

export const NON_TRADABLE_SYMBOLS = new Set([
  ...STABLECOIN_SYMBOLS,
  "WBTC",
  "WETH",
  "STETH",
  "WSTETH",
  "WEETH",
  "CBBTC",
  "WBETH",
  "RETH",
  "BSC-USD",
])
