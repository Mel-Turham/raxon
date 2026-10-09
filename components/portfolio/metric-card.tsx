import type { CSSProperties } from "react"

import { AnimatedNumber } from "@/components/shared/animated-number"
import { IconBadge } from "@/components/shared/icon-badge"
import { LazySparkline } from "@/components/shared/lazy-sparkline"
import { CardMenu } from "@/components/shared/list-card"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress"
import { PORTFOLIO_METRICS } from "@/constants"
import type { PortfolioMetric } from "@/lib/api/types"
import { decimalFormat } from "@/lib/format"

const ASSET_FORMAT = decimalFormat(7)
const VALUE_FORMAT = decimalFormat(2)

export const MetricCard = ({ metric }: { metric: PortfolioMetric }) => {
  const { label, icon, accent } = PORTFOLIO_METRICS[metric.key]

  return (
    <Card
      className="gap-4"
      // One accent drives the badge, the sparkline and the progress bar.
      style={{ "--metric-accent": accent } as CSSProperties}
    >
      <CardHeader className="items-center">
        <CardTitle className="flex items-center gap-2.5 text-sm font-medium">
          <IconBadge accent="var(--metric-accent)" icon={icon} />
          {label}
        </CardTitle>
        <CardAction>
          <CardMenu title={label} />
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-1">
            <span className="font-mono text-[11px] text-muted-foreground">
              <AnimatedNumber
                format={ASSET_FORMAT}
                suffix={` (${metric.asset})`}
                value={metric.assetAmount}
              />
            </span>
            <AnimatedNumber
              className="font-mono text-2xl tracking-tight tabular-nums"
              format={VALUE_FORMAT}
              value={metric.value}
            />
          </div>
          <LazySparkline
            className="h-10 w-24"
            color="var(--metric-accent)"
            seed={metric.key}
            trend={metric.change}
          />
        </div>

        <Progress
          className="gap-1.5 [&_[data-slot=progress-indicator]]:bg-(--metric-accent)"
          value={metric.ratio}
        >
          <ProgressLabel className="text-[11px] text-muted-foreground">
            Account limit used
          </ProgressLabel>
          <ProgressValue className="text-[11px] text-foreground/90" />
        </Progress>
      </CardContent>
    </Card>
  )
}

export const MetricCards = ({ metrics }: { metrics: PortfolioMetric[] }) => (
  <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
    {metrics.map((metric) => (
      <MetricCard key={metric.key} metric={metric} />
    ))}
  </div>
)
