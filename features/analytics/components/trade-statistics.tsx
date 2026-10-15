"use client"

import {
  ArrowDown01Icon,
  ArrowRight01Icon,
  ArrowUp01Icon,
  Award01Icon,
  Clock01Icon,
  ScaleIcon,
  ChartDownIcon,
  Target01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type HugeiconsIconProps } from "@hugeicons/react"
import Link from "next/link"
import type { ReactNode } from "react"

import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SIGNED_CURRENCY } from "@/features/analytics/helpers/format"
import type { TradeStatisticsData } from "@/features/analytics/types"
import { AnimatedNumber } from "@/shared/components/atoms/animated-number"
import { IconTile } from "@/shared/components/atoms/icon-tile"
import { decimalFormat } from "@/shared/lib/format"
import { cn } from "@/shared/lib/utils"

const RATIO_FORMAT = decimalFormat(2)

type StatRow = {
  label: string
  hint: string
  icon: HugeiconsIconProps["icon"]
  value: ReactNode
  tone?: "success" | "destructive"
}

const formatDuration = (minutes: number) =>
  `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, "0")}m`

type TradeStatisticsProps = {
  statistics: TradeStatisticsData
}

export function TradeStatistics({ statistics }: TradeStatisticsProps) {
  const rows: StatRow[] = [
    {
      label: "Average profit",
      hint: "Mean result of a winning trade",
      icon: ArrowUp01Icon,
      value: (
        <AnimatedNumber
          format={SIGNED_CURRENCY}
          value={statistics.averageProfit}
        />
      ),
      tone: "success",
    },
    {
      label: "Average loss",
      hint: "Mean result of a losing trade",
      icon: ArrowDown01Icon,
      value: (
        <AnimatedNumber
          format={SIGNED_CURRENCY}
          value={statistics.averageLoss}
        />
      ),
      tone: "destructive",
    },
    {
      label: "Reward / risk",
      hint: "Average profit divided by average loss",
      icon: ScaleIcon,
      value: (
        <AnimatedNumber
          format={RATIO_FORMAT}
          suffix="×"
          value={statistics.rewardRisk}
        />
      ),
    },
    {
      label: "Profit factor",
      hint: "Gross profit divided by gross loss, above 1 is profitable",
      icon: Target01Icon,
      value: (
        <AnimatedNumber format={RATIO_FORMAT} value={statistics.profitFactor} />
      ),
      tone: statistics.profitFactor >= 1 ? "success" : "destructive",
    },
    {
      label: "Average holding time",
      hint: "Time between opening and closing a trade",
      icon: Clock01Icon,
      value: formatDuration(statistics.averageHoldingMinutes),
    },
    {
      label: "Largest win",
      hint: "Best single trade",
      icon: Award01Icon,
      value: (
        <AnimatedNumber
          format={SIGNED_CURRENCY}
          value={statistics.largestWin}
        />
      ),
      tone: "success",
    },
    {
      label: "Largest loss",
      hint: "Worst single trade",
      icon: ChartDownIcon,
      value: (
        <AnimatedNumber
          format={SIGNED_CURRENCY}
          value={statistics.largestLoss}
        />
      ),
      tone: "destructive",
    },
  ]

  return (
    <Card className="min-w-0">
      <CardHeader className="items-center">
        <CardTitle className="text-base">Trade statistics</CardTitle>
        <CardAction>
          <Link
            className={cn(
              buttonVariants({ size: "sm", variant: "ghost" }),
              "h-7 px-2 text-muted-foreground hover:text-foreground"
            )}
            href="/trade"
          >
            <span className="hidden sm:inline">View trade history</span>
            <span className="sm:hidden">History</span>
            <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <dl className="divide-y divide-border/70">
          {rows.map(({ label, hint, icon, value, tone }) => (
            <div className="flex items-center gap-3 py-2.5" key={label}>
              <IconTile className="size-8" icon={icon} size={15} />
              <dt className="min-w-0 flex-1">
                <p className="text-sm">{label}</p>
                <p className="truncate text-[11px] text-muted-foreground">
                  {hint}
                </p>
              </dt>
              <dd
                className={cn(
                  "font-mono text-sm font-medium tabular-nums",
                  tone === "success" && "text-success",
                  tone === "destructive" && "text-destructive"
                )}
              >
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  )
}
