import "server-only"

import { getMarketMovers, getMarketNews } from "@/features/markets/api/markets"
import { getWalletAssets } from "@/features/wallet/api/wallet"
import { getCoinMarkets } from "@/shared/api/coingecko"
import { getFearGreedHistory } from "@/shared/api/fear-greed"
import { type GroqMessage, groqStream } from "@/shared/api/groq"
import { NON_TRADABLE_SYMBOLS } from "@/shared/config/coins"
import type { ChatTool } from "../types"

const MARKET_CONTEXT_SIZE = 12
const HISTORY_LIMIT = 8

export type ChatRequest = {
  messages: GroqMessage[]
  tools: ChatTool[]
}

const SYSTEM_PROMPT = `You are Raxon AI, the friendly trading companion inside the Raxon crypto app.
Talk like a sharp, warm analyst chatting with a friend: natural sentences, a little context on why things move, never a dry list of numbers.
Answer in the user's language. Match the length to the question: a greeting gets a short, warm reply and an offer to help, without any data.
Only bring up the portfolio or market figures when the question calls for them, and weave the key numbers into the explanation in bold.
Use Markdown sparingly: short paragraphs, a bullet list when comparing several items, a table only when the user asks for one or compares many assets.
Ground every number in the live data below; if it does not cover the question, say so instead of guessing.
For trade ideas give entry, stop-loss and take-profit levels with the reasoning, and end with a brief reminder that this is not financial advice.`

const compact = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 2,
})

const price = (value: number) =>
  value >= 1 ? value.toFixed(2) : value.toPrecision(4)

const pct = (value: number | null | undefined) =>
  `${(value ?? 0) >= 0 ? "+" : ""}${(value ?? 0).toFixed(1)}%`

const marketLines = async () => {
  const [coins, fearGreed] = await Promise.all([
    getCoinMarkets(),
    getFearGreedHistory(1),
  ])
  const lines = coins
    .filter((coin) => !NON_TRADABLE_SYMBOLS.has(coin.symbol.toUpperCase()))
    .slice(0, MARKET_CONTEXT_SIZE)
    .map(
      (coin) =>
        `${coin.symbol.toUpperCase()} $${price(coin.current_price)} 24h ${pct(coin.price_change_percentage_24h)} 7d ${pct(coin.price_change_percentage_7d_in_currency)} cap $${compact.format(coin.market_cap)}`
    )
  return [`Fear & Greed: ${fearGreed[0]}/100`, ...lines]
}

const portfolioLines = async () =>
  (await getWalletAssets())
    .filter((asset) => asset.balance > 0)
    .map(
      (asset) =>
        `${asset.symbol} ${asset.balance} ($${compact.format(asset.balance * asset.price)})`
    )

const moverLines = async () => {
  const movers = await getMarketMovers()
  return Object.entries(movers).map(
    ([tab, items]) =>
      `${tab}: ${items.map((item) => `${item.symbol} ${pct(item.changePercent)}`).join(", ")}`
  )
}

const newsLines = async () =>
  (await getMarketNews()).map((item) => `${item.source}: ${item.title}`)

const buildContext = async (tools: ChatTool[]) => {
  const [market, portfolio, movers, news] = await Promise.all([
    marketLines(),
    portfolioLines(),
    tools.includes("scan") ? moverLines() : [],
    tools.includes("web") ? newsLines() : [],
  ])
  return [
    `Now: ${new Date().toISOString()}`,
    "## Market",
    ...market,
    "## Portfolio",
    ...(portfolio.length ? portfolio : ["Empty"]),
    ...(movers.length ? ["## Movers 24h", ...movers] : []),
    ...(news.length ? ["## Headlines", ...news] : []),
  ].join("\n")
}

export const streamChat = async (
  { messages, tools }: ChatRequest,
  signal: AbortSignal
) => {
  const context = await buildContext(tools)
  return groqStream(
    [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "system", content: `Live data:\n${context}` },
      ...messages.slice(-HISTORY_LIMIT),
    ],
    { reasoningEffort: tools.includes("reason") ? "high" : "low", signal }
  )
}
