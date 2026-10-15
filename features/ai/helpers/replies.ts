import type { WalletAsset } from "@/features/wallet"
import { SENTIMENT_ZONES } from "../constants"
import type { AiAssetQuote, AiBlock, AiReply } from "../types"

const USD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

const MOCK_CHANGES: Record<string, number> = {
  BTC: 2.4,
  ETH: -1.8,
  SOL: 0.3,
  BNB: 1.1,
  USDT: 0,
  USDC: 0,
}

const quote = (asset: WalletAsset): AiAssetQuote => ({
  symbol: asset.symbol,
  name: asset.name,
  price: asset.price,
  change: MOCK_CHANGES[asset.symbol] ?? 0,
})

const portfolioReply = (assets: WalletAsset[]): AiBlock[] => {
  const held = assets
    .map((asset) => ({ asset, value: asset.balance * asset.price }))
    .filter(({ value }) => value > 0)
    .sort((a, b) => b.value - a.value)
  const total = held.reduce((sum, { value }) => sum + value, 0)
  const top = held[0]
  const topShare = Math.round((top.value / total) * 100)
  const stables = held
    .filter(({ asset }) => asset.price === 1)
    .reduce((sum, { value }) => sum + value, 0)
  const stableShare = Math.round((stables / total) * 100)

  return [
    {
      type: "text",
      text: `Here's a quick read of your wallet. You hold **${USD.format(total)}** across **${held.length} assets**, and **${top.asset.symbol}** alone is **${topShare}%** of it.`,
    },
    {
      type: "allocation",
      items: held.map(({ asset, value }) => ({
        symbol: asset.symbol,
        share: value / total,
      })),
    },
    {
      type: "text",
      text: `A few things stand out:\n- **Concentration:** a ${topShare}% position means a 10% ${top.asset.symbol} drop costs you about ${USD.format(top.value * 0.1)}.\n- **Stablecoin buffer:** ${stableShare}% is in stablecoins. Many traders keep 10-20% to buy dips calmly.\n- **Idea:** swapping a slice of ${top.asset.symbol} into USDT would lower your risk without leaving the market.`,
    },
  ]
}

const marketReply = (assets: WalletAsset[]): AiBlock[] => {
  const pick = (symbol: string) =>
    assets.find((asset) => asset.symbol === symbol)
  const majors = ["BTC", "ETH", "SOL"]
    .map(pick)
    .filter((asset): asset is WalletAsset => Boolean(asset))
    .map(quote)

  return [
    {
      type: "text",
      text: "**Bitcoin is up 2.4% today**, leading a broad but uneven market. Three things are driving it:\n- **ETF inflows** picked up again, with steady buying during US hours.\n- **Funding rates** are positive but not extreme, so the move isn't only leverage.\n- **ETH is lagging** (-1.8%) as traders rotate into BTC.",
    },
    { type: "assets", items: majors },
    {
      type: "text",
      text: "Short-term signals lean **bullish (78% confidence)**, but resistance sits close to recent highs. A pullback of 3-5% would be normal even in an uptrend.",
    },
  ]
}

const tradePlanReply = (
  assets: WalletAsset[],
  symbol: string,
  tightStop: boolean
): AiBlock[] => {
  const coin = assets.find((asset) => asset.symbol === symbol)
  if (!coin) return FALLBACK_REPLY
  const wallet = assets.reduce(
    (sum, asset) => sum + asset.balance * asset.price,
    0
  )
  const stopPercent = tightStop ? 0.02 : 0.035
  const entry = coin.price * 0.985
  const stop = entry * (1 - stopPercent)
  const target1 = entry * 1.045
  const target2 = entry * 1.09
  const risk = wallet * 0.01
  const size = risk / (entry - stop)
  const ratio = (target: number) =>
    ((target - entry) / (entry - stop)).toFixed(1)

  return [
    {
      type: "text",
      text: tightStop
        ? `Same **${symbol} plan with a tighter stop**. A 2% stop raises the reward-to-risk, but normal volatility can shake you out, so expect more stopped-out trades.`
        : `Here's ${symbol === "ETH" ? "an" : "a"} **${symbol} swing plan** built on the 4h structure. ${symbol} trades at **${USD.format(coin.price)}**, just above a support zone, so the plan waits for a small pullback instead of chasing.`,
    },
    { type: "assets", items: [quote(coin)] },
    {
      type: "text",
      text: `- **Entry:** around ${USD.format(entry)}, a 1.5% pullback into support.\n- **Stop-loss:** ${USD.format(stop)}, ${Math.round(stopPercent * 1000) / 10}% below entry.\n- **Take-profit 1:** ${USD.format(target1)}, reward-to-risk **${ratio(target1)}**. Close half here.\n- **Take-profit 2:** ${USD.format(target2)}, reward-to-risk **${ratio(target2)}**.\n- **Position size:** **${size.toFixed(symbol === "BTC" ? 4 : 2)} ${symbol}**, so hitting the stop costs **${USD.format(risk)}**, 1% of your wallet.`,
    },
    {
      type: "text",
      text: "Move the stop to entry once take-profit 1 fills. That way the rest of the trade can't lose money.",
    },
  ]
}

const sentimentReply = (assets: WalletAsset[]): AiBlock[] => [
  {
    type: "text",
    text: "The **Fear & Greed index is at 72 (Greed)**, up from 48 a week ago. Greed means buyers are confident, but it also means fewer people are left to buy.\n- **What it usually means:** strong trends, but sharper pullbacks when news disappoints.\n- **Funding rates** are positive on most majors, so leverage is building on the long side.\n- **Stablecoin inflows** to exchanges are still rising, which supports prices for now.",
  },
  {
    type: "assets",
    items: ["BTC", "ETH", "SOL"]
      .map((symbol) => assets.find((asset) => asset.symbol === symbol))
      .filter((asset): asset is WalletAsset => Boolean(asset))
      .map(quote),
  },
  {
    type: "text",
    text: "In greed phases, many traders **take partial profits on the way up** and keep cash ready for dips rather than adding at the highs.",
  },
]

const dcaReply = (assets: WalletAsset[], symbol: string): AiBlock[] => {
  const coin = assets.find((asset) => asset.symbol === symbol)
  const weekly = 100
  const yearly = weekly * 52
  return [
    {
      type: "text",
      text: `**DCA (dollar-cost averaging)** means buying a fixed amount on a schedule, whatever the price. You never have to time the market, and dips simply buy you more ${symbol}.`,
    },
    ...(coin ? [{ type: "assets" as const, items: [quote(coin)] }] : []),
    {
      type: "text",
      text: `A simple plan for **${symbol}**:\n- **Amount:** ${USD.format(weekly)} every Monday, ${USD.format(yearly)} a year.\n- **Today that buys:** about ${coin ? (weekly / coin.price).toFixed(symbol === "BTC" ? 5 : 3) : "—"} ${symbol} per week.\n- **Funding:** keep 4 weeks in USDT so a busy month never breaks the streak.\n- **Rule:** never stop buying because the price dropped; that's when DCA works best.`,
    },
  ]
}

const STAKING_REPLY: AiBlock[] = [
  {
    type: "text",
    text: "Here's where your idle assets could earn yield on Raxon Earn:\n- **SOL staking:** about **6.8% APY**, paid every epoch (~2 days). Unstaking takes 2-3 days.\n- **ETH staking:** about **3.4% APY**, liquid through stETH, so you can still sell any time.\n- **USDT flexible savings:** about **5.1% APY**, withdraw instantly.",
  },
  {
    type: "text",
    text: "On your wallet, staking your **14.2 SOL** and **1,204 USDT** would earn roughly **$205 a year** combined. Yields change daily and staking has smart-contract and lock-up risks, so only stake what you won't need to trade this week.",
  },
]

const compareReply = (assets: WalletAsset[]): AiBlock[] => {
  const pick = (symbol: string) =>
    assets.find((asset) => asset.symbol === symbol)
  const pair = [pick("BTC"), pick("ETH")]
    .filter((asset): asset is WalletAsset => Boolean(asset))
    .map(quote)
  return [
    {
      type: "text",
      text: "**This week BTC is leading ETH by about 4 points.** BTC is up **2.4%** while ETH is down **1.8%**, so the ETH/BTC ratio keeps falling.",
    },
    { type: "assets", items: pair },
    {
      type: "text",
      text: "- **Why BTC leads:** ETF inflows go almost entirely to BTC, and it's the first stop when traders get cautious.\n- **Why ETH lags:** gas fees are low, which signals quieter on-chain activity.\n- **What could flip it:** a pickup in DeFi and stablecoin volume on Ethereum usually comes before ETH outperforms.",
    },
  ]
}

const walletValue = (assets: WalletAsset[]) =>
  assets.reduce((sum, asset) => sum + asset.balance * asset.price, 0)

const rebalanceReply = (assets: WalletAsset[]): AiBlock[] => {
  const total = walletValue(assets)
  const stables = assets
    .filter((asset) => asset.price === 1)
    .reduce((sum, asset) => sum + asset.balance, 0)
  const needed = Math.max(0, total * 0.2 - stables)
  const btc = assets.find((asset) => asset.symbol === "BTC")
  const btcToSell = btc ? needed / btc.price : 0
  const after = assets
    .map((asset) => {
      const value = asset.balance * asset.price
      if (asset.symbol === "BTC")
        return { symbol: asset.symbol, value: value - needed }
      if (asset.symbol === "USDT")
        return { symbol: asset.symbol, value: value + needed }
      return { symbol: asset.symbol, value }
    })
    .filter(({ value }) => value > 0)
    .sort((a, b) => b.value - a.value)

  return [
    {
      type: "text",
      text: `To reach **20% in stablecoins**, swap about **${btcToSell.toFixed(4)} BTC** (${USD.format(needed)}) into USDT. BTC stays your largest position, but a 10% drop would now cost far less.`,
    },
    {
      type: "allocation",
      items: after.map(({ symbol, value }) => ({
        symbol,
        share: value / total,
      })),
    },
    {
      type: "text",
      text:
        "- **Do it in 2-3 steps** over a few days to avoid selling a local low.\n- **Swap fees:** about 0.1%, roughly " +
        USD.format(needed * 0.001) +
        " here.\n- **Keep the USDT working:** flexible savings pay about 5% while you wait for dips.",
    },
  ]
}

const riskReply = (assets: WalletAsset[]): AiBlock[] => {
  const total = walletValue(assets)
  const btc = assets.find((asset) => asset.symbol === "BTC")
  const btcShare = btc
    ? Math.round(((btc.balance * btc.price) / total) * 100)
    : 0
  return [
    {
      type: "text",
      text: `By **size**, your riskiest position is **BTC**: it's ${btcShare}% of your wallet, so it drives most of your swings. By **volatility**, it's **SOL**, which moves about 1.8× more than BTC on a typical day.`,
    },
    {
      type: "assets",
      items: ["BTC", "SOL", "ETH"]
        .map((symbol) => assets.find((asset) => asset.symbol === symbol))
        .filter((asset): asset is WalletAsset => Boolean(asset))
        .map(quote),
    },
    {
      type: "text",
      text: "- **BTC:** ~3% average daily move, but your biggest weight.\n- **SOL:** ~5.5% average daily move, a small slice of the wallet.\n- **ETH:** ~4% average daily move, currently in a downtrend vs BTC.\n- **Stablecoins:** no price risk, only 5% of the wallet.",
    },
  ]
}

const FUNDING_NOW_REPLY: AiBlock[] = [
  {
    type: "text",
    text: "Funding is **positive but moderate** right now, which means longs are paying shorts:\n- **BTC:** 0.012% every 8h, about 13% a year if it stayed there.\n- **ETH:** 0.009% every 8h.\n- **SOL:** 0.021% every 8h, the most crowded long of the three.",
  },
  {
    type: "text",
    text: "Above **0.03%** traders usually call it overheated. We're not there yet, but SOL is the one to watch.",
  },
]

const AVOID_FUNDING_REPLY: AiBlock[] = [
  {
    type: "text",
    text: "A few ways to pay less funding:\n- **Trade spot instead of perps** when you don't need leverage. Spot has no funding at all.\n- **Close or reduce before funding time** (every 8h: 00:00, 08:00, 16:00 UTC) if your trade is short-term.\n- **Be on the receiving side:** when funding is positive, shorts get paid.\n- **Use lower leverage:** funding is charged on position size, not on your margin.",
  },
]

const PERPETUALS_REPLY: AiBlock[] = [
  {
    type: "text",
    text: "**Perpetual futures** are contracts that track a coin's price but never expire. You can go **long** (bet it rises) or **short** (bet it falls), usually with leverage.\n- **Margin:** you only put up part of the position, e.g. $1,000 for a $10,000 trade at 10×.\n- **Liquidation:** if the price moves too far against you, the position is closed automatically.\n- **Funding:** a small fee between longs and shorts every 8 hours keeps the price in line with spot.",
  },
]

const MARGIN_MODE_REPLY: AiBlock[] = [
  {
    type: "text",
    text: "For most traders, **isolated margin** is the safer default:\n- **Isolated:** each position only risks the margin you give it. A bad trade can't touch the rest of your account.\n- **Cross:** your whole futures balance backs every position. Fewer liquidations, but one big loss can drain everything.\n- **When cross makes sense:** hedged positions (a long and a short) that offset each other.",
  },
]

const ETH_STAKING_REPLY: AiBlock[] = [
  {
    type: "text",
    text: "Staking ETH pays about **3.4% a year**. On your **2.1 ETH**, that's roughly **0.07 ETH**, about $245 at today's price.\n- **Worth it if** you plan to hold ETH for months anyway: it's yield on top of the price exposure.\n- **Less worth it if** you trade ETH often: liquid staking adds a small spread when you sell.\n- **Risks:** smart-contract risk, and stETH can trade slightly below ETH in a panic.",
  },
]

const alertReply = (assets: WalletAsset[], text: string): AiBlock[] => {
  const symbol = /\bbtc|bitcoin/.test(text)
    ? "BTC"
    : /\bsol/.test(text)
      ? "SOL"
      : "ETH"
  const coin = assets.find((asset) => asset.symbol === symbol)
  const typed = text.match(/(\d[\d,]*)/)?.[1]
  const level = typed
    ? Number(typed.replaceAll(",", ""))
    : Math.round((coin?.price ?? 0) * 0.9)
  const distance = coin ? Math.round((1 - level / coin.price) * 100) : 0
  return [
    {
      type: "text",
      text: `Got it. I'll notify you if **${symbol} drops below ${USD.format(level)}**. That's about **${distance}% below** the current price, so it would take a meaningful sell-off to trigger.`,
    },
  ]
}

const FUNDING_REPLY: AiBlock[] = [
  {
    type: "text",
    text: "A **funding rate** is a small payment exchanged between traders on perpetual futures, usually every 8 hours. It keeps the contract price close to the real market price.\n- **Positive rate:** longs pay shorts. Most traders are betting on a rise.\n- **Negative rate:** shorts pay longs. The crowd is betting on a drop.\n- **Why it matters:** very high rates often mean the market is overcrowded on one side, which can end in a sharp move the other way.",
  },
  {
    type: "text",
    text: "Example: holding a **$10,000 long** at a 0.01% rate costs you **$1 every 8 hours**, about $3 a day.",
  },
]

const FALLBACK_REPLY: AiBlock[] = [
  {
    type: "text",
    text: "I'm running in **demo mode** for now, so I can only answer a few topics. Try asking me to **analyze your portfolio**, explain **what's moving BTC**, explain **funding rates**, or **set a price alert**.",
  },
]

export const buildReply = (prompt: string, assets: WalletAsset[]): AiReply => {
  const text = prompt.toLowerCase()
  if (/rebalanc/.test(text)) {
    return {
      blocks: rebalanceReply(assets),
      reasoning: [
        "Measuring your current stablecoin share",
        "Computing the BTC amount to swap",
        "Projecting the new allocation",
      ],
      followUps: [
        "Which asset is my riskiest?",
        "Where can I earn yield on my SOL and USDT?",
      ],
    }
  }
  if (/riskiest|most risky/.test(text)) {
    return {
      blocks: riskReply(assets),
      reasoning: [
        "Ranking positions by size",
        "Comparing daily volatility",
        "Combining size and volatility",
      ],
      followUps: [
        "Rebalance into 20% stablecoins",
        "Compare BTC and ETH performance this week",
      ],
    }
  }
  if (/funding.*(high|now|current)|(high|now|current).*funding/.test(text)) {
    return {
      blocks: FUNDING_NOW_REPLY,
      reasoning: [
        "Reading live funding rates",
        "Comparing with overheated levels",
      ],
      followUps: [
        "How do I avoid paying funding?",
        "What's the market sentiment right now?",
      ],
    }
  }
  if (/avoid.*funding/.test(text)) {
    return {
      blocks: AVOID_FUNDING_REPLY,
      reasoning: [
        "Listing when funding is charged",
        "Finding cheaper alternatives",
      ],
      followUps: [
        "How do perpetual futures work?",
        "Should I use cross or isolated margin on futures?",
      ],
    }
  }
  if (/how do perp|perpetual futures work/.test(text)) {
    return {
      blocks: PERPETUALS_REPLY,
      reasoning: [
        "Explaining long and short",
        "Covering margin and liquidation",
      ],
      followUps: [
        "How do I avoid paying funding?",
        "Should I use cross or isolated margin on futures?",
      ],
    }
  }
  if (/cross|isolated/.test(text)) {
    return {
      blocks: MARGIN_MODE_REPLY,
      reasoning: [
        "Comparing cross and isolated margin",
        "Matching the mode to your style",
      ],
      followUps: [
        "Explain funding rates",
        "Plan a BTC trade with entry, stop-loss and take-profit",
      ],
    }
  }
  if (/stak.*eth|eth.*stak/.test(text)) {
    return {
      blocks: ETH_STAKING_REPLY,
      reasoning: [
        "Checking the ETH staking rate",
        "Estimating yield on your 2.1 ETH",
      ],
      followUps: [
        "Where can I earn yield on my SOL and USDT?",
        "Analyze my portfolio",
      ],
    }
  }
  if (/portfolio|allocation|rebalanc|wallet|holding|riskiest/.test(text)) {
    return {
      blocks: portfolioReply(assets),
      reasoning: [
        "Reading your wallet balances",
        "Pricing every asset in USD",
        "Measuring concentration and stablecoin share",
        "Drafting rebalancing ideas",
      ],
      followUps: [
        "Rebalance into 20% stablecoins",
        "Which asset is my riskiest?",
        "Compare with last month",
      ],
    }
  }
  if (/sentiment|fear|greed/.test(text)) {
    return {
      blocks: sentimentReply(assets),
      reasoning: [
        "Reading the Fear & Greed index",
        "Checking funding rates across majors",
        "Measuring stablecoin inflows",
      ],
      followUps: [
        "Is it a good time to buy BTC?",
        "Set up a weekly DCA plan for BTC",
      ],
    }
  }
  if (/\bdca\b|dollar.?cost|recurring|weekly buy/.test(text)) {
    const symbol = /\beth/.test(text)
      ? "ETH"
      : /\bsol/.test(text)
        ? "SOL"
        : "BTC"
    return {
      blocks: dcaReply(assets, symbol),
      reasoning: [
        `Pricing ${symbol} at today's level`,
        "Sizing a weekly budget",
        "Planning the stablecoin buffer",
      ],
      followUps: ["What if I DCA into ETH too?", "Analyze my portfolio"],
    }
  }
  if (/stak|yield|\bearn\b|apy|savings/.test(text)) {
    return {
      blocks: STAKING_REPLY,
      reasoning: [
        "Checking Raxon Earn rates",
        "Matching rates to your idle assets",
        "Estimating yearly yield",
      ],
      followUps: ["Is staking ETH worth it?", "Analyze my portfolio"],
    }
  }
  if (/compare|\bvs\b|versus/.test(text)) {
    return {
      blocks: compareReply(assets),
      reasoning: [
        "Pulling 7-day BTC and ETH performance",
        "Checking the ETH/BTC ratio",
        "Looking at ETF and on-chain flows",
      ],
      followUps: [
        "Plan an ETH trade with entry and stop-loss",
        "Is it a good time to buy BTC?",
      ],
    }
  }
  if (/plan|stop.?loss|take.?profit|entry|tighter stop/.test(text)) {
    const symbol = /\bsol/.test(text)
      ? "SOL"
      : /\beth/.test(text)
        ? "ETH"
        : "BTC"
    return {
      blocks: tradePlanReply(assets, symbol, /tight/.test(text)),
      reasoning: [
        `Reading ${symbol} structure on the 4h chart`,
        "Locating support and resistance",
        "Sizing the position to 1% risk",
        "Setting the stop-loss and targets",
      ],
      followUps: [
        "Use a tighter stop",
        "What's my risk if it hits the stop?",
        "Alert me if BTC drops below 60,000",
      ],
    }
  }
  if (/funding|perp|futures/.test(text)) {
    return {
      blocks: FUNDING_REPLY,
      reasoning: [
        "Recalling how perpetual futures work",
        "Checking current funding levels",
        "Finding a simple worked example",
      ],
      followUps: [
        "Are funding rates high right now?",
        "How do I avoid paying funding?",
      ],
    }
  }
  if (/alert|notify|drops? below/.test(text)) {
    return {
      blocks: alertReply(assets, text),
      reasoning: [
        "Reading the live price",
        "Measuring the distance to your level",
        "Preparing the price alert",
      ],
      followUps: ["Alert me on BTC too", "What's moving BTC today?"],
    }
  }
  if (
    /btc|bitcoin|moving|market|signal|bullish|bearish|sol|eth|buy/.test(text)
  ) {
    return {
      blocks: marketReply(assets),
      reasoning: [
        "Pulling BTC, ETH and SOL prices",
        "Scanning ETF flows and funding rates",
        "Comparing with the 7-day trend",
        "Weighing the AI signals",
      ],
      followUps: [
        "Is it a good time to buy BTC?",
        "Explain funding rates",
        "Alert me if BTC drops below 60,000",
      ],
    }
  }
  return {
    blocks: FALLBACK_REPLY,
    reasoning: [
      "Understanding your question",
      "Checking what demo mode can answer",
    ],
    followUps: ["Analyze my portfolio", "What's moving BTC today?"],
  }
}

export const enhancePrompt = (prompt: string) => {
  const base = prompt.trim().replace(/[.?!]+$/, "")
  return `${base}. Explain the key drivers in plain words, point out the main risks, and suggest 2-3 concrete actions I can take on Raxon.`
}

export const sentimentZone = (score: number) =>
  SENTIMENT_ZONES.find((zone) => score <= zone.max) ?? SENTIMENT_ZONES[4]
