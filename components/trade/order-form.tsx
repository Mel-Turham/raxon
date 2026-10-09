"use client"

import { type ReactNode, useState, useTransition } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowDown01Icon, ArrowUp01Icon } from "@hugeicons/core-free-icons"

import { placeOrder } from "@/app/trade/actions"
import { AnimatedNumber } from "@/components/shared/animated-number"
import { SegmentedTabs } from "@/components/shared/segmented-tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import {
  ORDER_FORM_DEFAULTS,
  ORDER_SIDES,
  type OrderSide,
  SIZE_MARKS,
  TIME_IN_FORCE,
  type TimeInForce,
} from "@/constants"
import type { MarketTicker, TradingAccount } from "@/lib/api/types"
import { CURRENCY_FORMAT } from "@/lib/format"
import { cn } from "@/lib/utils"

import { useTradePair } from "./trade-pair-context"

const FIELD_CONTROL =
  "h-11 border-border bg-muted text-sm md:text-sm dark:bg-muted"

// Slider snaps to a mark within this many percent.
const MARK_SNAP = 2

const roundTo = (value: number, digits: number) =>
  Math.round(value * 10 ** digits) / 10 ** digits

const inputFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/** Accepts "1,234.5" as typed by the user. */
const parseAmount = (text: string) => Number.parseFloat(text.replace(/,/g, ""))

/** Stop sits below the price for a buy, above it for a sell. */
const defaultStop = (price: number, side: OrderSide) =>
  roundTo(
    price *
      (side === "Buy"
        ? 1 - ORDER_FORM_DEFAULTS.stopDistance
        : 1 + ORDER_FORM_DEFAULTS.stopDistance),
    2
  )

type FieldProps = {
  label: string
  htmlFor?: string
  hint?: ReactNode
  children: ReactNode
}

/** Label (+ optional right hint) above a control. */
const Field = ({ label, htmlFor, hint, children }: FieldProps) => (
  <div className="flex flex-col gap-2">
    <div className="flex items-center justify-between text-xs">
      <label htmlFor={htmlFor} className="text-muted-foreground">
        {label}
      </label>
      {hint && <span className="text-foreground/90">{hint}</span>}
    </div>
    {children}
  </div>
)

const SummaryRow = ({ label, value }: { label: string; value: number }) => (
  <div className="flex items-center justify-between text-sm">
    <dt className="text-muted-foreground">{label}</dt>
    <dd className="font-medium tabular-nums">
      <AnimatedNumber value={value} />
    </dd>
  </div>
)

type OrderFormFieldsProps = {
  ticker: MarketTicker
  account: TradingAccount
}

const OrderFormFields = ({ ticker, account }: OrderFormFieldsProps) => {
  const price = ticker.lastPrice
  const [side, setSide] = useState<OrderSide>(ORDER_FORM_DEFAULTS.side)
  const [size, setSize] = useState(ORDER_FORM_DEFAULTS.size)
  const [sizeDraft, setSizeDraft] = useState<string | null>(null)
  const [timeInForce, setTimeInForce] = useState<TimeInForce>(
    ORDER_FORM_DEFAULTS.timeInForce
  )
  const [stopPrice, setStopPrice] = useState(() =>
    defaultStop(price, ORDER_FORM_DEFAULTS.side)
  )
  const [stopDraft, setStopDraft] = useState<string | null>(null)
  const [isSubmitting, startSubmit] = useTransition()
  const [feedback, setFeedback] = useState<{
    tone: "success" | "error"
    message: string
  } | null>(null)

  const isBuy = side === "Buy"
  // Everything is expressed in quote currency (e.g. USDT).
  const available = isBuy
    ? (account.balances[ticker.quote] ?? 0)
    : (account.balances[ticker.base] ?? 0) * price
  const percent = available > 0 ? Math.min(100, (size / available) * 100) : 0
  const fees = size * account.feeRate
  const total = isBuy ? size + fees : size - fees
  const estimatedLoss = Math.max(
    0,
    isBuy ? size * (1 - stopPrice / price) : size * (stopPrice / price - 1)
  )
  const error =
    size <= 0
      ? "Enter an order size."
      : size > available
        ? `Size exceeds your available ${ticker.quote}.`
        : null

  const updateSize = (next: number) => {
    setSize(roundTo(Math.max(0, next), 2))
    setFeedback(null)
  }

  const submit = () =>
    startSubmit(async () => {
      const result = await placeOrder({
        pair: ticker.pair,
        side,
        size,
        stopPrice,
        timeInForce,
      })
      setFeedback(
        result.ok
          ? {
              tone: "success",
              message: `${side} order placed (#${result.orderId.slice(0, 8)}).`,
            }
          : { tone: "error", message: result.error }
      )
    })

  return (
    <Card className="h-full gap-4">
      <CardHeader>
        <SegmentedTabs
          className="*:data-[slot=tabs-list]:w-full"
          options={ORDER_SIDES}
          value={side}
          onValueChange={(next) => {
            setSide(next)
            setStopPrice(defaultStop(price, next))
            setFeedback(null)
          }}
        />
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4">
        <Field
          label="Size"
          htmlFor="order-size"
          hint={
            <>
              Available:{" "}
              <AnimatedNumber
                format={{ ...CURRENCY_FORMAT, style: "decimal" }}
                suffix={` ${ticker.quote}`}
                value={available}
              />
            </>
          }
        >
          <div className="relative">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
              $
            </span>
            <Input
              id="order-size"
              inputMode="decimal"
              value={sizeDraft ?? inputFormatter.format(size)}
              onChange={(event) => {
                setSizeDraft(event.target.value)
                const parsed = parseAmount(event.target.value)
                updateSize(Number.isFinite(parsed) ? parsed : 0)
              }}
              onBlur={() => setSizeDraft(null)}
              aria-invalid={Boolean(error)}
              className={cn(FIELD_CONTROL, "pr-24 pl-6 font-mono")}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
              {ticker.base} {ticker.quote}
            </span>
          </div>
        </Field>

        {/* Size as % of the available balance; snaps to the marks. */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-1/2 z-10 flex -translate-y-1/2 justify-between"
            >
              {SIZE_MARKS.map((mark) => (
                <span
                  key={mark}
                  className={cn(
                    "size-2.5 rounded-full",
                    mark <= percent ? "bg-primary" : "bg-foreground/20"
                  )}
                />
              ))}
            </div>
            <Slider
              aria-label="Order size (% of available)"
              value={[percent]}
              onValueChange={(value) => {
                const raw = Array.isArray(value) ? value[0] : value
                const mark = SIZE_MARKS.find(
                  (candidate) => Math.abs(candidate - raw) <= MARK_SNAP
                )
                updateSize(((mark ?? raw) / 100) * available)
              }}
              className="**:data-[slot=slider-thumb]:z-20 **:data-[slot=slider-thumb]:size-4 **:data-[slot=slider-thumb]:rounded-full **:data-[slot=slider-thumb]:border-primary **:data-[slot=slider-thumb]:bg-primary"
            />
          </div>
          <span className="w-10 text-right text-xs text-foreground/90 tabular-nums">
            {Math.round(percent)}%
          </span>
        </div>

        <Field label="Time in force" htmlFor="time-in-force">
          <Select
            value={timeInForce}
            onValueChange={(value) => setTimeInForce(value as TimeInForce)}
          >
            <SelectTrigger
              id="time-in-force"
              className={cn(FIELD_CONTROL, "w-full data-[size=default]:h-11")}
            >
              <SelectValue>
                {(value: TimeInForce) =>
                  TIME_IN_FORCE.find((option) => option.value === value)?.label
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {TIME_IN_FORCE.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Stop Price" htmlFor="stop-price">
          <div className="relative">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
              $
            </span>
            <Input
              id="stop-price"
              inputMode="decimal"
              value={stopDraft ?? inputFormatter.format(stopPrice)}
              onChange={(event) => {
                setStopDraft(event.target.value)
                const parsed = parseAmount(event.target.value)
                if (Number.isFinite(parsed)) setStopPrice(parsed)
              }}
              onBlur={() => setStopDraft(null)}
              className={cn(FIELD_CONTROL, "pr-10 pl-6 font-mono")}
            />
            <div className="absolute inset-y-0 right-2 flex flex-col justify-center">
              {[
                { label: "Increase", icon: ArrowUp01Icon, delta: 1 },
                { label: "Decrease", icon: ArrowDown01Icon, delta: -1 },
              ].map(({ label, icon, delta }) => (
                <button
                  key={label}
                  type="button"
                  aria-label={`${label} stop price`}
                  onClick={() =>
                    setStopPrice((value) =>
                      roundTo(Math.max(0, value + delta), 2)
                    )
                  }
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  <HugeiconsIcon icon={icon} size={14} />
                </button>
              ))}
            </div>
          </div>
        </Field>

        <p className="text-sm text-muted-foreground">
          Est. Loss:{" "}
          <AnimatedNumber
            className="font-medium text-destructive"
            value={estimatedLoss}
          />
        </p>

        <dl className="flex flex-col gap-3 border-t border-dashed border-border pt-4">
          <SummaryRow
            label={isBuy ? "Buying Power" : "Selling Power"}
            value={size}
          />
          <SummaryRow label="Transaction Fees" value={fees} />
          <SummaryRow label="Estimated Total" value={total} />
        </dl>

        <Button
          className={cn(
            "mt-auto h-11 text-sm font-semibold tracking-wide uppercase"
          )}
          disabled={Boolean(error) || isSubmitting}
          onClick={submit}
        >
          {isSubmitting ? "Placing order…" : side}
        </Button>

        <p
          aria-live="polite"
          className={cn(
            "min-h-4 text-xs",
            (feedback?.tone ?? (error && "error")) === "error"
              ? "text-destructive"
              : "text-success"
          )}
        >
          {feedback?.message ?? error}
        </p>
      </CardContent>
    </Card>
  )
}

type OrderFormProps = {
  tickers: MarketTicker[]
  account: TradingAccount
}

export const OrderForm = ({ tickers, account }: OrderFormProps) => {
  const { pair } = useTradePair()
  const ticker = tickers.find((item) => item.pair === pair) ?? tickers[0]

  // Remount on pair change: size and stop price reset to the new market.
  return <OrderFormFields key={ticker.pair} account={account} ticker={ticker} />
}
