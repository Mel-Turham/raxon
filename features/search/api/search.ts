import "server-only"

import { getMarketAssets } from "@/features/markets"
import { TRADE_PAIRS, tradePairHref } from "@/features/trade"
import { NAV_LINKS } from "@/shared/config"
import { SEARCH_QUOTE } from "../constants"
import {
  MOCK_RECENT_SEARCHES,
  MOCK_SEARCH_EXCHANGES,
} from "../mocks/search-data"
import type { SearchIndex } from "../types"

const assetHref = (symbol: string) => {
  const pair = `${symbol}/${SEARCH_QUOTE}`
  return TRADE_PAIRS.some((tradePair) => tradePair === pair)
    ? tradePairHref(pair)
    : "/markets"
}

export const getSearchIndex = async (): Promise<SearchIndex> => {
  const assets = await getMarketAssets()

  return {
    assets: assets.map((asset) => ({
      kind: "asset",
      id: asset.symbol,
      symbol: asset.symbol,
      name: asset.name,
      price: asset.price,
      changePercent: asset.changePercent,
      marketCap: asset.marketCap,
      volume: asset.volume,
      href: assetHref(asset.symbol),
    })),
    exchanges: MOCK_SEARCH_EXCHANGES,
    pages: NAV_LINKS.map((link) => ({
      kind: "page",
      id: link.href,
      label: link.label,
      href: link.href,
    })),
    recent: MOCK_RECENT_SEARCHES,
  }
}
