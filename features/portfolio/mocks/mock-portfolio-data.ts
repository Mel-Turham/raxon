import type {
  PortfolioAsset,
  PortfolioMetric,
  WalletHolding,
  WatchlistItem,
} from "@/features/portfolio/types"

export const MOCK_WATCHLIST: WatchlistItem[] = [
  { pair: "BTC/USD", base: "BTC", price: 43_324.03, change: 6.35 },
  { pair: "ETH/USD", base: "ETH", price: 3_124.5, change: -1.71 },
]

export const MOCK_WATCHLIST_CANDIDATES: WatchlistItem[] = [
  { pair: "SOL/USD", base: "SOL", price: 145.67, change: 5.46 },
  { pair: "XRP/USD", base: "XRP", price: 0.62, change: 4.03 },
  { pair: "QNT/USD", base: "QNT", price: 520.4, change: -2.18 },
]

export const MOCK_PORTFOLIO_METRICS: PortfolioMetric[] = [
  {
    key: "portfolioValue",
    value: 42_539,
    assetAmount: 2.4367467,
    asset: "BTC",
    ratio: 25,
    change: 3.2,
  },
  {
    key: "marginUsage",
    value: 74_649.9,
    assetAmount: 4.6478288,
    asset: "BNB",
    ratio: 50,
    change: 1.4,
  },
  {
    key: "buyingPower",
    value: 52_536.83,
    assetAmount: 5.6371813,
    asset: "SOL",
    ratio: 0,
    change: -0.8,
  },
  {
    key: "freeCollateral",
    value: 19_637.09,
    assetAmount: 7.6472836,
    asset: "ETH",
    ratio: 75,
    change: 2.1,
  },
]

export const MOCK_WALLET_HOLDINGS: WalletHolding[] = [
  { symbol: "BTC", amount: 0.4367, price: 12_290.44 },
  { symbol: "BNB", amount: 3.6478, price: 2_545.33 },
  { symbol: "ETH", amount: 7.4356, price: 287.11 },
  { symbol: "SOL", amount: 12.5, price: 145.67 },
  { symbol: "XRP", amount: 1_420, price: 0.62 },
]

export const MOCK_PORTFOLIO_ASSETS: PortfolioAsset[] = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    price: 53_647,
    change: 7.29,
    volume: 637_486.9e6,
  },
  {
    symbol: "MATIC",
    name: "Polygon",
    price: 0.7876,
    change: 9.37,
    volume: 412_908.4e6,
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    price: 1,
    change: -0.02,
    volume: 589_311.7e6,
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    price: 3_124.5,
    change: -1.71,
    volume: 298_115.2e6,
  },
  {
    symbol: "BNB",
    name: "BNB",
    price: 584.2,
    change: 2.46,
    volume: 104_772.8e6,
  },
  {
    symbol: "SOL",
    name: "Solana",
    price: 145.67,
    change: 5.46,
    volume: 88_390.1e6,
  },
]
