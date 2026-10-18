"use client"

import { motion } from "motion/react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TokenAvatar } from "@/shared/components/atoms/token-avatar"
import { TrendBadge } from "@/shared/components/atoms/trend-badge"
import { withKeys } from "@/shared/lib/keys"
import { EASE_SOFT } from "@/shared/lib/motion"
import { cn } from "@/shared/lib/utils"
import { sentimentZone } from "../helpers/sentiment"
import type {
  AiSignal,
  MarketSentiment,
  PortfolioHealth,
  SignalBias,
} from "../types"

const GROW = { duration: 1.1, ease: EASE_SOFT }
const DAYS = [
  { id: "mon", label: "M" },
  { id: "tue", label: "T" },
  { id: "wed", label: "W" },
  { id: "thu", label: "T" },
  { id: "fri", label: "F" },
  { id: "sat", label: "S" },
  { id: "sun", label: "S" },
]

export function SentimentCard({ sentiment }: { sentiment: MarketSentiment }) {
  const zone = sentimentZone(sentiment.score)
  const max = Math.max(...sentiment.history)

  return (
    <Card className="gap-3">
      <CardHeader>
        <CardTitle>Market sentiment</CardTitle>
        <CardDescription>Fear & Greed index, updated hourly</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <div className="relative w-full max-w-56">
          <svg aria-hidden className="w-full" viewBox="0 0 160 88">
            <path
              className="stroke-muted"
              d="M 12 80 A 68 68 0 0 1 148 80"
              fill="none"
              strokeWidth={10}
            />
            <motion.path
              animate={{ pathLength: sentiment.score / 100 }}
              d="M 12 80 A 68 68 0 0 1 148 80"
              fill="none"
              initial={{ pathLength: 0 }}
              stroke={zone.color}
              strokeWidth={10}
              transition={GROW}
            />
          </svg>
          <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">
            <span className="font-mono text-3xl tracking-tight tabular-nums">
              {sentiment.score}
            </span>
            <span className="text-xs font-medium" style={{ color: zone.color }}>
              {zone.label}
            </span>
          </div>
        </div>

        <div className="flex w-full flex-col gap-1.5">
          <div className="flex h-10 items-end gap-1">
            {withKeys(sentiment.history, "day").map(
              ({ key, value }, position) => (
                <motion.span
                  animate={{ height: `${(value / max) * 100}%` }}
                  className={cn(
                    "flex-1",
                    position === sentiment.history.length - 1
                      ? "bg-primary"
                      : "bg-foreground/12"
                  )}
                  initial={{ height: 0 }}
                  key={key}
                  transition={{ ...GROW, delay: position * 0.04 }}
                />
              )
            )}
          </div>
          <div className="flex gap-1 text-center text-[10px] text-muted-foreground">
            {DAYS.map((day) => (
              <span className="flex-1" key={day.id}>
                {day.label}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const healthLabel = (score: number) =>
  score >= 80 ? "Strong" : score >= 60 ? "Fair" : "Needs attention"

export function HealthCard({ health }: { health: PortfolioHealth }) {
  return (
    <Card className="gap-3">
      <CardHeader>
        <CardTitle>Portfolio health</CardTitle>
        <CardDescription>Based on your current holdings</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-3xl tracking-tight tabular-nums">
            {health.score}
          </span>
          <span className="text-xs text-muted-foreground">/ 100</span>
          <span className="ml-auto bg-primary/10 px-1.5 py-0.5 text-[11px] text-primary">
            {healthLabel(health.score)}
          </span>
        </div>
        <div className="flex flex-col gap-3">
          {health.metrics.map((metric, index) => (
            <div className="flex flex-col gap-1.5" key={metric.label}>
              <div className="flex justify-between text-xs">
                <span>{metric.label}</span>
                <span className="font-mono text-muted-foreground tabular-nums">
                  {metric.value}%
                </span>
              </div>
              <div className="h-1 bg-muted">
                <motion.div
                  animate={{ width: `${metric.value}%` }}
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  transition={{ ...GROW, delay: index * 0.08 }}
                />
              </div>
              <p className="text-[11px] text-muted-foreground">{metric.hint}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

const BIAS_STYLE: Record<SignalBias, string> = {
  bullish: "bg-success/12 text-success",
  neutral: "bg-muted text-muted-foreground",
  bearish: "bg-destructive/12 text-destructive",
}

type SignalsCardProps = {
  signals: AiSignal[]
  onAsk: (prompt: string) => void
}

export function SignalsCard({ signals, onAsk }: SignalsCardProps) {
  return (
    <Card className="gap-2">
      <CardHeader>
        <CardTitle>AI signals</CardTitle>
        <CardDescription>Next 24h · tap a signal to ask why</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col divide-y divide-foreground/8 px-0">
        {signals.map((signal) => (
          <button
            className="group flex items-center gap-3 px-(--card-spacing) py-2.5 text-left transition-colors hover:bg-foreground/4"
            key={signal.symbol}
            onClick={() =>
              onAsk(`Why is the ${signal.symbol} signal ${signal.bias}?`)
            }
            type="button"
          >
            <TokenAvatar className="size-7" symbol={signal.symbol} />
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="text-sm font-medium">{signal.symbol}</span>
              <TrendBadge value={signal.change} />
            </span>
            <span
              className={cn(
                "px-1.5 py-0.5 text-[11px] capitalize",
                BIAS_STYLE[signal.bias]
              )}
            >
              {signal.bias}
            </span>
            <span className="w-9 text-right font-mono text-xs text-muted-foreground tabular-nums">
              {signal.confidence}%
            </span>
          </button>
        ))}
      </CardContent>
    </Card>
  )
}
