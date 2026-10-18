import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { RelativeTime } from "@/shared/components/atoms/relative-time"
import { TokenAvatar } from "@/shared/components/atoms/token-avatar"
import { TRADE_PAIRS, tradePairHref } from "@/features/trade/constants"
import { cn } from "@/shared/lib/utils"
import { signalTone } from "../helpers/markets"
import type { MarketSentimentOverview } from "../types"
import { MarketCard } from "./market-card"
import { ToneBadge } from "./tone-badge"

const TRADE_BUTTON = cn(
  buttonVariants({ size: "sm", variant: "outline" }),
  "text-xs"
)

const isTradable = (pair: string) =>
  TRADE_PAIRS.some((tradePair) => tradePair === pair)

export const MarketSentiment = ({
  sentiment,
}: {
  sentiment: MarketSentimentOverview
}) => (
  <MarketCard
    action={
      <span className="text-[11px] text-muted-foreground">
        Updated <RelativeTime value={sentiment.updatedAt} />
      </span>
    }
    title="Market Sentiment"
  >
    {sentiment.items.length === 0 && (
      <p className="flex flex-1 items-center justify-center py-10 text-sm text-muted-foreground">
        Sentiment data is unavailable right now.
      </p>
    )}
    <ul className="flex flex-1 flex-col">
      {sentiment.items.map((item) => (
        <li
          className="grid min-h-14 flex-1 grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_auto] items-center gap-4 border-b border-border/60 last:border-b-0"
          key={item.pair}
        >
          <div className="flex min-w-0 items-center gap-2.5">
            <TokenAvatar className="size-7" symbol={item.base} />
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="truncate text-sm font-medium">{item.pair}</span>
              <ToneBadge className="self-start" tone={signalTone(item.signal)}>
                {item.signal}
              </ToneBadge>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex justify-between font-mono text-[11px] tabular-nums">
              <span className="text-success">Long {item.longPercent}%</span>
              <span className="text-muted-foreground">
                L/S {item.longShortRatio.toFixed(2)}
              </span>
              <span className="text-destructive">
                {100 - item.longPercent}% Short
              </span>
            </div>
            <div className="flex h-1.5 gap-0.5">
              <span
                className="bg-success"
                style={{ width: `${item.longPercent}%` }}
              />
              <span className="flex-1 bg-destructive" />
            </div>
          </div>

          {isTradable(item.pair) ? (
            <Link className={TRADE_BUTTON} href={tradePairHref(item.pair)}>
              Trade
            </Link>
          ) : (
            <span
              aria-disabled
              className={cn(TRADE_BUTTON, "pointer-events-none opacity-50")}
              title="Not listed on Raxon Trade yet"
            >
              Trade
            </span>
          )}
        </li>
      ))}
    </ul>
  </MarketCard>
)
