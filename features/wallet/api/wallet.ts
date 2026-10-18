import "server-only"

import { getNetworks, getPricedHoldings } from "@/shared/account"
import { getCoinMarkets } from "@/shared/api/coingecko"
import { NETWORKS, POPULAR_ASSETS } from "../constants"
import type { WalletAsset } from "../types"

export const getWalletAssets = async (): Promise<WalletAsset[]> => {
  const [holdings, networks, coins] = await Promise.all([
    getPricedHoldings(),
    getNetworks(),
    getCoinMarkets(),
  ])
  const missing = POPULAR_ASSETS.filter(
    (symbol) => !holdings.some((holding) => holding.symbol === symbol)
  )

  return [
    ...holdings,
    ...missing.map((symbol) => {
      const coin = coins.find((item) => item.symbol.toUpperCase() === symbol)
      return {
        symbol,
        name: coin?.name ?? symbol,
        free: 0,
        price: coin?.current_price ?? 0,
      }
    }),
  ].map((holding) => ({
    symbol: holding.symbol,
    name: holding.name,
    balance: holding.free,
    price: holding.price,
    networks: (networks[holding.symbol] ?? []).map(
      ({ network, ...limits }) => ({ ...NETWORKS[network], ...limits })
    ),
  }))
}
