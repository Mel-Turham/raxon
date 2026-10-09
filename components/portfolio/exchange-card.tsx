"use client"

import { useState, useTransition } from "react"

import { submitExchange } from "@/app/portfolio/actions"
import { AnimatedNumber } from "@/components/shared/animated-number"
import { CardMenu } from "@/components/shared/list-card"
import { SegmentedTabs } from "@/components/shared/segmented-tabs"
import { TokenAvatar } from "@/components/shared/token-avatar"
import { Button } from "@/components/ui/button"
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
import { EXCHANGE_MODES, type ExchangeMode } from "@/constants"
import type { WalletHolding } from "@/lib/api/types"
import { CURRENCY_FORMAT, decimalFormat } from "@/lib/format"
import { cn } from "@/lib/utils"

const ROW_COUNT = 3
const AMOUNT_FORMAT = decimalFormat(4)
const SOLD_VALUE_FORMAT = { ...CURRENCY_FORMAT, signDisplay: "always" } as const

type HoldingRowProps = {
  holding: WalletHolding
  /** Symbols selectable in this row (not used by the other rows). */
  options: WalletHolding[]
  onSymbolChange: (symbol: string) => void
}

/** One asset sold by the exchange: symbol picker, amount, USD value out. */
const HoldingRow = ({ holding, options, onSymbolChange }: HoldingRowProps) => (
  <div className="flex items-center gap-3 border border-border bg-foreground/[0.03] p-3">
    <TokenAvatar symbol={holding.symbol} className="size-10" />
    <div className="flex min-w-0 flex-1 flex-col">
      <Select
        value={holding.symbol}
        onValueChange={(value) => onSymbolChange(value as string)}
      >
        <SelectTrigger
          aria-label="Asset to sell"
          className="h-auto w-fit gap-1 border-0 bg-transparent p-0 text-base font-semibold dark:bg-transparent dark:hover:bg-transparent"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.symbol} value={option.symbol}>
              {option.symbol}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="text-xs text-muted-foreground">Sell position</span>
    </div>
    <div className="flex flex-col items-end gap-0.5">
      <AnimatedNumber
        className="font-mono text-lg tabular-nums"
        format={AMOUNT_FORMAT}
        value={holding.amount}
      />
      <AnimatedNumber
        className="font-mono text-xs text-destructive tabular-nums"
        format={SOLD_VALUE_FORMAT}
        value={-holding.amount * holding.price}
      />
    </div>
  </div>
)

export const ExchangeCard = ({ holdings }: { holdings: WalletHolding[] }) => {
  const [mode, setMode] = useState<ExchangeMode>("Swap")
  const [symbols, setSymbols] = useState(() =>
    holdings.slice(0, ROW_COUNT).map((holding) => holding.symbol)
  )
  const [limitPrice, setLimitPrice] = useState("")
  const [isSubmitting, startSubmit] = useTransition()
  const [feedback, setFeedback] = useState<{
    tone: "success" | "error"
    message: string
  } | null>(null)

  const bySymbol = new Map(holdings.map((holding) => [holding.symbol, holding]))

  const changeSymbol = (index: number, symbol: string) => {
    setSymbols((current) =>
      current.map((value, i) => (i === index ? symbol : value))
    )
    setFeedback(null)
  }

  const submit = () =>
    startSubmit(async () => {
      const result = await submitExchange({
        mode,
        symbols,
        limitPrice:
          mode === "Limit" ? Number.parseFloat(limitPrice) : undefined,
      })
      setFeedback(
        result.ok
          ? {
              tone: "success",
              message: `${mode} submitted (#${result.reference}).`,
            }
          : { tone: "error", message: result.error }
      )
    })

  return (
    <Card className="gap-4">
      <CardHeader className="items-center">
        <CardTitle className="text-base">Exchange</CardTitle>
        <CardAction>
          <CardMenu title="Exchange" />
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-3">
        <SegmentedTabs
          className="*:data-[slot=tabs-list]:w-full"
          options={EXCHANGE_MODES}
          value={mode}
          onValueChange={(next) => {
            setMode(next)
            setFeedback(null)
          }}
        />

        <div className="flex flex-col gap-2.5 border-t border-border pt-3">
          {symbols.map((symbol, index) => {
            const holding = bySymbol.get(symbol)
            if (!holding) return null
            return (
              <HoldingRow
                key={index}
                holding={holding}
                options={holdings.filter(
                  (option) =>
                    option.symbol === symbol || !symbols.includes(option.symbol)
                )}
                onSymbolChange={(next) => changeSymbol(index, next)}
              />
            )
          })}
        </div>

        {mode === "Limit" && (
          <label className="flex flex-col gap-2 text-xs text-muted-foreground">
            Limit price (USD)
            <Input
              inputMode="decimal"
              placeholder="0.00"
              value={limitPrice}
              onChange={(event) => {
                setLimitPrice(event.target.value)
                setFeedback(null)
              }}
              className="h-11 border-border bg-muted font-mono text-sm md:text-sm dark:bg-muted"
            />
          </label>
        )}

        <Button
          className="mt-auto h-11 text-sm font-semibold"
          disabled={isSubmitting}
          onClick={submit}
        >
          {isSubmitting
            ? "Submitting…"
            : mode === "Swap"
              ? "Swap"
              : "Place limit order"}
        </Button>
        <p
          aria-live="polite"
          className={cn(
            "min-h-4 text-xs",
            feedback?.tone === "error" ? "text-destructive" : "text-success"
          )}
        >
          {feedback?.message}
        </p>
      </CardContent>
    </Card>
  )
}
