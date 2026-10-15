"use client"

import { Card } from "@/components/ui/card"
import { AnimatedNumber } from "@/shared/components/atoms/animated-number"
import { PriceFlash } from "@/shared/components/atoms/price-flash"
import { TokenAvatar } from "@/shared/components/atoms/token-avatar"
import { TrendBadge } from "@/shared/components/atoms/trend-badge"
import { PRICE_FORMAT } from "@/shared/lib/format"
import { liveChangePercent } from "../helpers/markets"
import { useLivePrice } from "../state/live-prices"
import type { MarketTicker } from "../types"

const TickerCell = ({ ticker }: { ticker: MarketTicker }) => {
  const live = useLivePrice(ticker.symbol, ticker.price)

  return (
    <div className="flex min-w-44 flex-1 items-center gap-3 border-r border-border px-4 py-3 last:border-r-0">
      <TokenAvatar className="size-8" symbol={ticker.symbol} />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="flex items-baseline justify-between gap-2">
          <span className="text-sm font-medium">{ticker.symbol}</span>
          <TrendBadge
            digits={2}
            value={liveChangePercent(ticker.change, live.factor)}
          />
        </span>
        <span className="flex items-baseline justify-between gap-2">
          <span className="truncate text-[11px] text-muted-foreground">
            {ticker.name}
          </span>
          <PriceFlash delta={live.delta} flashKey={live.tick}>
            <AnimatedNumber
              className="font-mono text-xs tabular-nums"
              format={PRICE_FORMAT}
              value={live.price}
            />
          </PriceFlash>
        </span>
      </div>
    </div>
  )
}

export const TickerStrip = ({ tickers }: { tickers: MarketTicker[] }) => (
  <Card className="[scrollbar-width:none] flex-row gap-0 overflow-x-auto py-0">
    {tickers.map((ticker) => (
      <TickerCell key={ticker.symbol} ticker={ticker} />
    ))}
  </Card>
)
