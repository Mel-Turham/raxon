import type { SearchExchange } from "../types"

const INTEGRATIONS_PATH = "/ai/integrations"

export const MOCK_RECENT_SEARCHES = ["BTC", "SOL", "XRP", "DOGE"]

export const MOCK_SEARCH_EXCHANGES: SearchExchange[] = [
  {
    kind: "exchange",
    id: "binance",
    name: "Binance",
    logo: "binance",
    description: "Spot, futures and earn",
    href: INTEGRATIONS_PATH,
  },
  {
    kind: "exchange",
    id: "coinbase",
    name: "Coinbase",
    logo: "coinbase",
    description: "Spot and custody",
    href: INTEGRATIONS_PATH,
  },
  {
    kind: "exchange",
    id: "kraken",
    name: "Kraken",
    logo: "kraken",
    description: "Spot and margin",
    href: INTEGRATIONS_PATH,
  },
  {
    kind: "exchange",
    id: "okx",
    name: "OKX",
    logo: "okx",
    description: "Spot, perpetuals and options",
    href: INTEGRATIONS_PATH,
  },
  {
    kind: "exchange",
    id: "bybit",
    name: "Bybit",
    logo: "bybit",
    description: "Perpetuals and copy trading",
    href: INTEGRATIONS_PATH,
  },
]
