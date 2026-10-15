"use client"

import { useState } from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowDataTransferVerticalIcon } from "@hugeicons/core-free-icons"

import { AnimatedNumber } from "@/shared/components/atoms/animated-number"
import { CardMenu } from "@/shared/components/molecules/list-card"
import { TokenAvatar } from "@/shared/components/atoms/token-avatar"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { PortfolioAsset } from "@/features/portfolio/types"
import { decimalFormat } from "@/shared/lib/format"
import { cn } from "@/shared/lib/utils"

const RESULT_FORMAT = decimalFormat(2, 6)
const RATE_FORMAT = decimalFormat(2, 4)
const DEFAULT_PAIR = { from: "ETH", to: "BNB", amount: "7.64774" }

const ROW_CLASS =
  "flex min-h-20 flex-1 items-center gap-3 border border-border bg-foreground/[0.03] px-4"

type TokenSelectProps = {
  value: string
  assets: PortfolioAsset[]
  label: string
  onChange: (symbol: string) => void
}

const TokenSelect = ({ value, assets, label, onChange }: TokenSelectProps) => (
  <Select value={value} onValueChange={(next) => onChange(next as string)}>
    <SelectTrigger
      aria-label={label}
      className="h-9 min-w-24 border-border bg-muted text-sm data-[size=default]:h-9 dark:bg-muted"
    >
      <SelectValue />
    </SelectTrigger>
    <SelectContent align="end">
      {assets.map((asset) => (
        <SelectItem key={asset.symbol} value={asset.symbol}>
          {asset.symbol}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
)

export const ConverterCard = ({ assets }: { assets: PortfolioAsset[] }) => {
  const [from, setFrom] = useState(DEFAULT_PAIR.from)
  const [to, setTo] = useState(DEFAULT_PAIR.to)
  const [amount, setAmount] = useState(DEFAULT_PAIR.amount)

  const priceOf = (symbol: string) =>
    assets.find((asset) => asset.symbol === symbol)?.price ?? 0
  const parsed = Number.parseFloat(amount.replace(/,/g, ""))
  const converted =
    Number.isFinite(parsed) && priceOf(to) > 0
      ? (parsed * priceOf(from)) / priceOf(to)
      : 0

  const invert = () => {
    setFrom(to)
    setTo(from)
    setAmount(converted ? String(Number(converted.toFixed(6))) : "")
  }

  return (
    <Card className="gap-4">
      <CardHeader className="items-center">
        <CardTitle className="text-base">Online crypto exchange</CardTitle>
        <CardAction>
          <CardMenu title="Online crypto exchange" />
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-3">
        <div className="relative flex flex-1 flex-col gap-2 border-t border-border pt-4">
          <div className={ROW_CLASS}>
            <TokenAvatar symbol={from} className="size-11" />
            <Input
              aria-label={`Amount of ${from}`}
              inputMode="decimal"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              className="h-12 flex-1 border-0 bg-transparent px-0 font-mono text-2xl md:text-2xl dark:bg-transparent"
            />
            <TokenSelect
              assets={assets.filter((asset) => asset.symbol !== to)}
              label="Convert from"
              value={from}
              onChange={setFrom}
            />
          </div>

          <button
            type="button"
            aria-label="Invert conversion"
            onClick={invert}
            className="absolute top-[calc(50%+0.5rem)] left-1/2 z-10 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-border bg-card text-foreground/90 shadow-(--icon-badge-shadow) transition-colors hover:text-foreground"
          >
            <HugeiconsIcon icon={ArrowDataTransferVerticalIcon} size={16} />
          </button>

          <div className={ROW_CLASS}>
            <TokenAvatar symbol={to} className="size-11" />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <AnimatedNumber
                className="font-mono text-2xl tabular-nums"
                format={RESULT_FORMAT}
                value={converted}
              />

              <span className="font-mono text-[11px] text-muted-foreground">
                1 {from} ≈{" "}
                <AnimatedNumber
                  format={RATE_FORMAT}
                  suffix={` ${to}`}
                  value={priceOf(to) > 0 ? priceOf(from) / priceOf(to) : 0}
                />
              </span>
            </div>
            <TokenSelect
              assets={assets.filter((asset) => asset.symbol !== from)}
              label="Convert to"
              value={to}
              onChange={setTo}
            />
          </div>
        </div>

        <Link
          href="/trade"
          className={cn(buttonVariants(), "h-11 text-sm font-semibold")}
        >
          View more
        </Link>
      </CardContent>
    </Card>
  )
}
