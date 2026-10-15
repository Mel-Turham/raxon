import {
  ArrowLeftRightIcon,
  Coins01Icon,
  Timer02Icon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons"
import type { CSSProperties } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedNumber } from "@/shared/components/atoms/animated-number"
import { ChangePill } from "@/shared/components/atoms/change-pill"
import { IconBadge } from "@/shared/components/atoms/icon-badge"
import { TokenAvatar } from "@/shared/components/atoms/token-avatar"
import { OTC_BASE_ASSETS, OTC_QUOTE_ASSETS } from "../constants"
import {
  PERCENT_FORMAT,
  USD_COMPACT_FORMAT,
  USD_FORMAT,
} from "../helpers/format"
import type { OtcDashboardData } from "../types"

type OtcOverviewProps = {
  data: OtcDashboardData
}

export function OtcOverview({ data }: OtcOverviewProps) {
  const { balances, prices, desk } = data
  const tradableBalance =
    OTC_BASE_ASSETS.reduce(
      (sum, asset) => sum + balances[asset] * prices[asset],
      0
    ) + OTC_QUOTE_ASSETS.reduce((sum, asset) => sum + balances[asset], 0)

  const items = [
    {
      label: "Tradable balance",
      icon: Wallet01Icon,
      accent: "var(--primary)",
      value: <AnimatedNumber format={USD_FORMAT} value={tradableBalance} />,
      footer: (
        <div className="flex items-center gap-2">
          <div className="flex -space-x-1.5">
            {[...OTC_BASE_ASSETS, ...OTC_QUOTE_ASSETS].map((asset) => (
              <TokenAvatar
                className="size-5 ring-2 ring-card"
                key={asset}
                symbol={asset}
              />
            ))}
          </div>
          <span className="text-[11px] text-muted-foreground">
            Across 4 OTC-eligible assets
          </span>
        </div>
      ),
    },
    {
      label: "OTC volume · 30d",
      icon: Coins01Icon,
      accent: "var(--token-btc)",
      value: <AnimatedNumber format={USD_FORMAT} value={desk.volume30d} />,
      footer: (
        <div className="flex items-center gap-2">
          <ChangePill value={desk.volumeChange} />
          <span className="text-[11px] text-muted-foreground">
            <AnimatedNumber
              format={{ maximumFractionDigits: 0 }}
              suffix=" settled trades"
              value={desk.completedTrades}
            />
          </span>
        </div>
      ),
    },
    {
      label: "Desk spread",
      icon: ArrowLeftRightIcon,
      accent: "var(--success)",
      value: (
        <AnimatedNumber
          format={PERCENT_FORMAT}
          suffix="%"
          value={data.spread}
        />
      ),
      footer: (
        <p className="text-[11px] text-muted-foreground">
          Applied on top of the market reference price
        </p>
      ),
    },
    {
      label: "Avg. settlement",
      icon: Timer02Icon,
      accent: "var(--token-usdt)",
      value: (
        <AnimatedNumber
          format={{ maximumFractionDigits: 0 }}
          suffix=" min"
          value={desk.avgSettlementMinutes}
        />
      ),
      footer: (
        <p className="text-[11px] text-muted-foreground">
          Minimum ticket{" "}
          <AnimatedNumber format={USD_COMPACT_FORMAT} value={desk.minTicket} />
        </p>
      ),
    },
  ]

  return (
    <section
      aria-label="OTC overview"
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
    >
      {items.map(({ label, icon, accent, value, footer }) => (
        <Card
          className="gap-4"
          key={label}
          style={{ "--metric-accent": accent } as CSSProperties}
        >
          <CardHeader className="items-center pb-0">
            <CardTitle className="flex items-center gap-2.5 text-sm font-medium">
              <IconBadge accent="var(--metric-accent)" icon={icon} />
              {label}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex min-h-16 flex-col justify-between gap-3">
            <span className="font-mono text-2xl tracking-tight tabular-nums">
              {value}
            </span>
            {footer}
          </CardContent>
        </Card>
      ))}
    </section>
  )
}
