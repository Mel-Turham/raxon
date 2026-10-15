"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  formatSignedCurrency,
  SIGNED_CURRENCY,
} from "@/features/analytics/helpers/format"
import type { PnlBreakdown } from "@/features/analytics/types"
import {
  Background,
  Bar,
  BarChart,
  BarXAxis,
  ChartTooltip,
} from "@/shared/charts/bklit"
import { AnimatedNumber } from "@/shared/components/atoms/animated-number"
import { cn } from "@/shared/lib/utils"
import { LOSS_COLOR } from "@/features/analytics/constants"

const CHART_MARGIN = { top: 16, right: 8, bottom: 36, left: 8 }
const PROFIT_COLOR = "var(--success)"

const UNIT_COPY: Record<
  PnlBreakdown["unit"],
  { title: string; plural: string; best: string; worst: string }
> = {
  day: { title: "Daily", plural: "days", best: "Best day", worst: "Worst day" },
  week: {
    title: "Weekly",
    plural: "weeks",
    best: "Best week",
    worst: "Worst week",
  },
  month: {
    title: "Monthly",
    plural: "months",
    best: "Best month",
    worst: "Worst month",
  },
}

const pnlColor = (value: unknown) =>
  Number(value) >= 0 ? PROFIT_COLOR : LOSS_COLOR

type TradingPerformanceProps = {
  breakdown: PnlBreakdown
}

export function TradingPerformance({ breakdown }: TradingPerformanceProps) {
  const copy = UNIT_COPY[breakdown.unit]
  const { buckets, total, profitable, best, worst } = breakdown

  return (
    <Card className="h-full min-w-0 overflow-hidden">
      <CardHeader className="gap-1 pb-2">
        <CardTitle className="text-base">Trading performance</CardTitle>
        <p className="text-xs text-muted-foreground">
          {copy.title} realized profit and loss
        </p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3 pb-4">
        <div className="flex items-baseline gap-2">
          <AnimatedNumber
            className={cn(
              "font-mono text-2xl font-semibold tabular-nums",
              total >= 0 ? "text-success" : "text-destructive"
            )}
            format={SIGNED_CURRENCY}
            value={total}
          />
          <span className="text-xs text-muted-foreground">
            net over the period
          </span>
        </div>

        <BarChart
          aspectRatio="auto"
          className="h-64 w-full"
          data={buckets}
          margin={CHART_MARGIN}
          revealSignature={buckets
            .map(({ date, pnl }) => `${date.getTime()}:${pnl}`)
            .join(",")}
          xDataKey="date"
        >
          <Background
            color="var(--chart-grid)"
            fadeHorizontal={false}
            fadeVertical={false}
            opacity={0.45}
            pattern="dots"
            radius={1}
          />
          <Bar dataKey="pnl" fill={(point) => pnlColor(point.pnl)} />
          <BarXAxis maxLabels={7} tickerHalfWidth={28} />
          <ChartTooltip
            rows={(point) => [
              {
                color: pnlColor(point.pnl),
                label: `${copy.title} P/L`,
                value: formatSignedCurrency(Number(point.pnl)),
              },
            ]}
          />
        </BarChart>

        <dl className="mt-auto grid grid-cols-3 gap-4 border-t border-border pt-4">
          <div>
            <dt className="text-xs text-muted-foreground">
              Profitable {copy.plural}
            </dt>
            <dd className="mt-1 font-mono text-xl font-semibold tabular-nums">
              {profitable}/{buckets.length}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">{copy.best}</dt>
            <dd className="mt-1 font-mono text-xl font-semibold text-success tabular-nums">
              <AnimatedNumber format={SIGNED_CURRENCY} value={best} />
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">{copy.worst}</dt>
            <dd
              className={cn(
                "mt-1 font-mono text-xl font-semibold tabular-nums",
                worst < 0 ? "text-destructive" : "text-foreground"
              )}
            >
              <AnimatedNumber format={SIGNED_CURRENCY} value={worst} />
            </dd>
          </div>
        </dl>
        <p className="sr-only">
          Net performance over the period: {formatSignedCurrency(total)}.{" "}
          {profitable} of {buckets.length} {copy.plural} were profitable.
        </p>
      </CardContent>
    </Card>
  )
}
