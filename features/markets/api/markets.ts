import "server-only"

import { binanceGet, toUsdtSymbol } from "@/shared/api/binance"
import { binanceFuturesGet } from "@/shared/api/binance-futures"
import {
  type CoinMarket,
  getCoinCategories,
  getCoinMarkets,
  getGlobalMarket,
} from "@/shared/api/coingecko"
import { XMLParser } from "fast-xml-parser"

import { createHttpClient, revalidate } from "@/shared/api/http"
import { getFearGreedHistory } from "@/shared/api/fear-greed"
import { groqJson, isGroqConfigured } from "@/shared/api/groq"
import { serverEnvConfig } from "@/shared/config/env.server"
import { memoizeFor } from "@/shared/lib/memoize"
import { MINUTE } from "@/shared/lib/time"
import { NON_TRADABLE_SYMBOLS, STABLECOIN_SYMBOLS } from "@/shared/config/coins"
import {
  INSIGHT_SYMBOLS,
  MARKET_SECTORS,
  SENTIMENT_SYMBOLS,
  TICKER_SYMBOLS,
} from "../constants"
import { rankMovers, toMarketMover } from "../helpers/markets"
import type {
  MarketInsights,
  MarketNewsItem,
  MarketQuote,
  MarketSentimentOverview,
  MarketSignal,
  MarketStat,
  MarketTicker,
  SectorPerformance,
} from "../types"

const symbolOf = (coin: CoinMarket) => coin.symbol.toUpperCase()

const pct = (value: number | null | undefined) => value ?? 0

const findCoin = (coins: CoinMarket[], symbol: string) =>
  coins.find((coin) => symbolOf(coin) === symbol)

export const getMarketTickers = async (): Promise<MarketTicker[]> => {
  const coins = await getCoinMarkets()
  return TICKER_SYMBOLS.flatMap((symbol) => {
    const coin = findCoin(coins, symbol)
    return coin
      ? [
          {
            symbol,
            name: coin.name,
            price: coin.current_price,
            change: pct(coin.price_change_percentage_24h),
          },
        ]
      : []
  })
}

export const getMarketAssets = async () => {
  const coins = await getCoinMarkets()
  return coins.map((coin) =>
    toMarketMover({
      symbol: symbolOf(coin),
      name: coin.name,
      price: coin.current_price,
      changePercent: pct(coin.price_change_percentage_24h),
      volume: coin.total_volume,
      marketCap: coin.market_cap,
    })
  )
}

export const getMarketMovers = async () =>
  rankMovers(
    (await getMarketAssets()).filter(
      (asset) => !NON_TRADABLE_SYMBOLS.has(asset.symbol)
    )
  )

export const getSectorPerformance = async (): Promise<SectorPerformance[]> => {
  const [categories, coins] = await Promise.all([
    getCoinCategories(),
    getCoinMarkets(),
  ])
  const symbolById = new Map(coins.map((coin) => [coin.id, symbolOf(coin)]))

  return MARKET_SECTORS.flatMap(({ id, name }) => {
    const category = categories.find((item) => item.id === id)
    if (!category) return []
    return [
      {
        id,
        name,
        change24h: pct(category.market_cap_change_24h),
        marketCap: category.market_cap ?? 0,
        leaders: category.top_3_coins_id.map(
          (coinId) => symbolById.get(coinId) ?? coinId.toUpperCase()
        ),
      },
    ]
  })
}

type RawSpotTicker = {
  symbol: string
  bidPrice: string
  askPrice: string
  highPrice: string
  lowPrice: string
  openPrice: string
}

type RawFuturesTicker = Pick<
  RawSpotTicker,
  "symbol" | "highPrice" | "lowPrice" | "openPrice"
>

type RawBookTicker = Pick<RawSpotTicker, "symbol" | "bidPrice" | "askPrice">

const toQuote = (
  pair: string,
  base: string,
  ticker: Pick<RawSpotTicker, "highPrice" | "lowPrice" | "openPrice">,
  book: Pick<RawSpotTicker, "bidPrice" | "askPrice">
): MarketQuote => ({
  pair,
  base,
  bid: Number(book.bidPrice),
  ask: Number(book.askPrice),
  low: Number(ticker.lowPrice),
  high: Number(ticker.highPrice),
  previous: Number(ticker.openPrice),
})

const getSpotQuotes = async (bases: readonly string[]) => {
  const rows = await binanceGet<RawSpotTicker[]>("/ticker/24hr", {
    symbols: JSON.stringify(bases.map(toUsdtSymbol)),
  })
  return bases.flatMap((base) => {
    const row = rows.find((item) => item.symbol === toUsdtSymbol(base))
    return row ? [toQuote(`${base}/USDT`, base, row, row)] : []
  })
}

const getPerpetualQuotes = async (bases: readonly string[]) => {
  const [tickers, books] = await Promise.all([
    binanceFuturesGet<RawFuturesTicker[]>("/fapi/v1/ticker/24hr"),
    binanceFuturesGet<RawBookTicker[]>("/fapi/v1/ticker/bookTicker"),
  ])
  return bases.flatMap((base) => {
    const symbol = toUsdtSymbol(base)
    const ticker = tickers.find((item) => item.symbol === symbol)
    const book = books.find((item) => item.symbol === symbol)
    return ticker && book ? [toQuote(`${base}-PERP`, base, ticker, book)] : []
  })
}

export const getMarketInsights = async (): Promise<MarketInsights> => {
  const [spot, perpetuals, stablecoins, defi, layer2] = await Promise.all([
    getSpotQuotes(INSIGHT_SYMBOLS.Spot),
    getPerpetualQuotes(INSIGHT_SYMBOLS.Perpetuals),
    getSpotQuotes(INSIGHT_SYMBOLS.Stablecoins),
    getSpotQuotes(INSIGHT_SYMBOLS.DeFi),
    getSpotQuotes(INSIGHT_SYMBOLS["Layer 2"]),
  ])
  return {
    Spot: spot,
    Perpetuals: perpetuals,
    Stablecoins: stablecoins,
    DeFi: defi,
    "Layer 2": layer2,
  }
}

type RawLongShortRatio = {
  longAccount: string
  longShortRatio: string
  timestamp: number
}

const signalOf = (ratio: number): MarketSignal => {
  if (ratio >= 1.2) return "Bullish"
  if (ratio <= 0.9) return "Bearish"
  return "Neutral"
}

export const getMarketSentiment =
  async (): Promise<MarketSentimentOverview> => {
    const rows = await Promise.all(
      SENTIMENT_SYMBOLS.map(async (base) => {
        const [latest] = await binanceFuturesGet<RawLongShortRatio[]>(
          "/futures/data/globalLongShortAccountRatio",
          { symbol: toUsdtSymbol(base), period: "1h", limit: 1 }
        )
        return { base, latest }
      })
    )
    const items = rows.flatMap(({ base, latest }) => {
      if (!latest) return []
      const ratio = Number(latest.longShortRatio)
      return [
        {
          pair: `${base}/USDT`,
          base,
          signal: signalOf(ratio),
          longShortRatio: ratio,
          longPercent: Math.round(Number(latest.longAccount) * 100),
        },
      ]
    })
    const updatedAt = Math.max(
      ...rows.map(({ latest }) => latest?.timestamp ?? 0)
    )
    return { updatedAt: new Date(updatedAt).toISOString(), items }
  }

const FEAR_GREED_DAYS = { yesterday: 1, week: 7, month: 30 } as const

const dominanceChange = (
  share: number,
  partChange: number,
  totalChange: number
) => share - (share / (1 + partChange / 100)) * (1 + totalChange / 100)

export const getMarketStats = async (): Promise<MarketStat[]> => {
  const [global, coins, history] = await Promise.all([
    getGlobalMarket(),
    getCoinMarkets(),
    getFearGreedHistory(FEAR_GREED_DAYS.month + 1),
  ])

  const btc = findCoin(coins, "BTC")
  const eth = findCoin(coins, "ETH")
  const stablecoins = coins.filter((coin) =>
    STABLECOIN_SYMBOLS.has(symbolOf(coin))
  )
  const sum = (items: CoinMarket[], key: "market_cap" | "total_volume") =>
    items.reduce((total, coin) => total + coin[key], 0)

  const totalChange = global.market_cap_change_percentage_24h_usd
  const btcShare = global.market_cap_percentage.btc ?? 0
  const ethShare = global.market_cap_percentage.eth ?? 0
  const btcShareChange = dominanceChange(
    btcShare,
    pct(btc?.price_change_percentage_24h),
    totalChange
  )
  const ethShareChange = dominanceChange(
    ethShare,
    pct(eth?.price_change_percentage_24h),
    totalChange
  )

  const today = history[0] ?? 0

  return [
    {
      id: "market-cap",
      label: "Total market cap",
      value: global.total_market_cap.usd,
      change: totalChange,
      rows: [
        {
          label: "Bitcoin",
          value: btc?.market_cap ?? 0,
          change: pct(btc?.price_change_percentage_24h),
        },
        {
          label: "Ethereum",
          value: eth?.market_cap ?? 0,
          change: pct(eth?.price_change_percentage_24h),
        },
        {
          label: "Stablecoins",
          value: sum(stablecoins, "market_cap"),
          change: 0,
        },
      ],
    },
    {
      id: "volume",
      label: "24h volume",
      value: global.total_volume.usd,
      change: 0,
      rows: [
        { label: "Bitcoin", value: btc?.total_volume ?? 0, change: 0 },
        { label: "Ethereum", value: eth?.total_volume ?? 0, change: 0 },
        {
          label: "Stablecoins",
          value: sum(stablecoins, "total_volume"),
          change: 0,
        },
      ],
    },
    {
      id: "btc-dominance",
      label: "BTC dominance",
      value: btcShare,
      change: btcShareChange,
      rows: [
        { label: "Bitcoin", value: btcShare, change: btcShareChange },
        { label: "Ethereum", value: ethShare, change: ethShareChange },
        {
          label: "Others",
          value: 100 - btcShare - ethShare,
          change: -(btcShareChange + ethShareChange),
        },
      ],
    },
    {
      id: "fear-greed",
      label: "Fear & Greed",
      value: today,
      change: today - (history[FEAR_GREED_DAYS.yesterday] ?? today),
      rows: [
        {
          label: "Yesterday",
          value: history[FEAR_GREED_DAYS.yesterday] ?? 0,
          change: 0,
        },
        {
          label: "Last week",
          value: history[FEAR_GREED_DAYS.week] ?? 0,
          change: 0,
        },
        {
          label: "Last month",
          value: history[FEAR_GREED_DAYS.month] ?? 0,
          change: 0,
        },
      ],
    },
  ]
}

const NEWS_LIMIT = 4
const NEWS_TTL_MS = 10 * MINUTE
const NEWS_SYMBOL_POOL = 50

type RawFeedItem = {
  title: string
  link: string
  pubDate: string
  description?: string
}

const rss = createHttpClient("")
const xml = new XMLParser()

const plainText = (html = "") =>
  html
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim()

const getFeedItems = async ({
  source,
  url,
}: {
  source: string
  url: string
}) => {
  const { data } = await rss.get<string>(url, {
    responseType: "text",
    ...revalidate(600),
  })
  const items: RawFeedItem[] = [xml.parse(data).rss?.channel?.item ?? []].flat()
  return items.map((item) => ({ ...item, source }))
}

const wordPattern = (word: string, flags?: string) =>
  new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, flags)

const mentionedSymbols = (title: string, coins: CoinMarket[]) =>
  coins
    .slice(0, NEWS_SYMBOL_POOL)
    .filter((coin) => {
      const symbol = symbolOf(coin)
      return (
        wordPattern(coin.name, "i").test(title) ||
        (symbol.length >= 3 && wordPattern(symbol).test(title))
      )
    })
    .map(symbolOf)

const scoreHeadlines = async (titles: string[]) => {
  if (!isGroqConfigured()) return titles.map(() => 0.5)
  const { scores } = await groqJson<{ scores: number[] }>([
    {
      role: "system",
      content:
        'Rate how bullish each crypto headline is for the assets it mentions, from 0 (very bearish) to 1 (very bullish), 0.5 when neutral. Reply as JSON: {"scores": number[]} in the same order.',
    },
    { role: "user", content: JSON.stringify(titles) },
  ])
  return titles.map((_, index) => scores?.[index] ?? 0.5)
}

export const getMarketNews = memoizeFor(
  NEWS_TTL_MS,
  async (): Promise<MarketNewsItem[]> => {
    const [feeds, coins] = await Promise.all([
      Promise.allSettled(serverEnvConfig.newsFeeds.map(getFeedItems)),
      getCoinMarkets(),
    ])
    const latest = feeds
      .flatMap((feed) => (feed.status === "fulfilled" ? feed.value : []))
      .sort((a, b) => Date.parse(b.pubDate) - Date.parse(a.pubDate))
      .slice(0, NEWS_LIMIT)
    const scores = await scoreHeadlines(latest.map((item) => item.title)).catch(
      () => latest.map(() => 0.5)
    )

    return latest.map((item, index) => ({
      id: item.link,
      title: item.title,
      excerpt: plainText(item.description),
      source: item.source,
      publishedAt: new Date(item.pubDate).toISOString(),
      sentiment: scores[index],
      symbols: mentionedSymbols(item.title, coins),
    }))
  }
)
