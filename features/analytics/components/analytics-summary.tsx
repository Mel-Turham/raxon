import {
  ChartDownIcon,
  ChartUpIcon,
  Coins01Icon,
  Target01Icon,
} from "@hugeicons/core-free-icons"
import type { HugeiconsIconProps } from "@hugeicons/react"
import type { CSSProperties, ReactNode } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress"
import {
  ONE_DECIMAL,
  SIGNED_CURRENCY,
  SIGNED_PERCENT,
} from "@/features/analytics/helpers/format"
import type { AnalyticsSummaryData } from "@/features/analytics/types"
import { AnimatedNumber } from "@/shared/components/atoms/animated-number"
import { ChangePill } from "@/shared/components/atoms/change-pill"
import { IconBadge } from "@/shared/components/atoms/icon-badge"
import { CURRENCY_FORMAT } from "@/shared/lib/format"
import { cn } from "@/shared/lib/utils"

type SummaryCard = {
  label: string
  icon: HugeiconsIconProps["icon"]
  accent: string
  value: ReactNode
  footer: ReactNode
}

type AnalyticsSummaryProps = {
  summary: AnalyticsSummaryData
}

export function AnalyticsSummary({ summary }: AnalyticsSummaryProps) {
  const cards: SummaryCard[] = [
    {
      label: "Net P&L",
      icon: ChartUpIcon,
      accent: summary.netPnl >= 0 ? "var(--success)" : "var(--destructive)",
      value: <AnimatedNumber format={SIGNED_CURRENCY} value={summary.netPnl} />,
      footer: (
        <div className="flex items-center gap-2">
          <ChangePill value={summary.roi} />
          <span className="text-[11px] text-muted-foreground">
            return on portfolio
          </span>
        </div>
      ),
    },
    {
      label: "Trading volume",
      icon: Coins01Icon,
      accent: "var(--token-btc)",
      value: (
        <AnimatedNumber
          format={CURRENCY_FORMAT}
          value={summary.tradingVolume}
        />
      ),
      footer: (
        <div className="flex flex-wrap items-center gap-2">
          <ChangePill value={summary.tradingVolumeChange} />
          <span className="text-[11px] text-muted-foreground">
            Fees{" "}
            <AnimatedNumber
              className="text-foreground/90"
              format={CURRENCY_FORMAT}
              value={summary.feesPaid}
            />
          </span>
        </div>
      ),
    },
    {
      label: "Win rate",
      icon: Target01Icon,
      accent: "var(--primary)",
      value: (
        <AnimatedNumber
          format={ONE_DECIMAL}
          suffix="%"
          value={summary.winRate}
        />
      ),
      footer: (
        <Progress className="gap-1.5" value={summary.winRate}>
          <ProgressLabel className="text-[11px] text-muted-foreground">
            {summary.wins} winning / {summary.losses} losing
          </ProgressLabel>
          <ProgressValue className="text-[11px] text-foreground/90" />
        </Progress>
      ),
    },
    {
      label: "Max drawdown",
      icon: ChartDownIcon,
      accent: "var(--destructive)",
      value: (
        <AnimatedNumber
          className={cn(summary.maxDrawdown < 0 && "text-destructive")}
          format={SIGNED_PERCENT}
          suffix="%"
          value={summary.maxDrawdown}
        />
      ),
      footer: (
        <p className="text-[11px] text-muted-foreground">
          Largest drop from a portfolio peak
        </p>
      ),
    },
  ]

  return (
    <section
      aria-label="Analytics overview"
      className="grid grid-cols-2 gap-3 xl:grid-cols-4"
    >
      {cards.map(({ label, icon, accent, value, footer }) => (
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
          <CardContent className="flex min-h-18 flex-col justify-between gap-3">
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
