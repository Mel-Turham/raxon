"use client"

import {
  ArrowDataTransferVerticalIcon,
  ArrowRight02Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { type ReactNode, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
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
import { TokenAvatar } from "@/shared/components/atoms/token-avatar"
import { SegmentedTabs } from "@/shared/components/molecules/segmented-tabs"
import { cn } from "@/shared/lib/utils"
import {
  OTC_BASE_ASSETS,
  OTC_QUOTE_ASSETS,
  OTC_SETTLEMENTS,
  OTC_SIDES,
  OTC_SIZE_PRESETS,
} from "../constants"
import { executionPrice } from "../helpers/quote"
import type {
  OtcBaseAsset,
  OtcDashboardData,
  OtcQuoteAsset,
  OtcQuoteRequest,
  OtcSettlement,
  OtcSide,
} from "../types"
import { AnimatedNumber } from "@/shared/components/atoms/animated-number"
import {
  AMOUNT_FORMAT,
  PERCENT_FORMAT,
  TOTAL_FORMAT,
  USD_FORMAT,
} from "../helpers/format"

const USD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const PRICING_DELAY_MS = 600

type AssetSelectProps<T extends string> = {
  label: string
  value: T
  options: readonly T[]
  onChange: (value: T) => void
}

const AssetSelect = <T extends string>({
  label,
  value,
  options,
  onChange,
}: AssetSelectProps<T>) => (
  <Select value={value} onValueChange={(next) => next && onChange(next as T)}>
    <SelectTrigger
      aria-label={label}
      className="h-10 w-fit shrink-0 gap-2 border-border bg-card px-2 text-sm font-medium dark:bg-card dark:hover:bg-card"
    >
      <SelectValue>
        <span className="flex items-center gap-2">
          <TokenAvatar className="size-6" symbol={value} />
          {value}
        </span>
      </SelectValue>
    </SelectTrigger>
    <SelectContent>
      {options.map((asset) => (
        <SelectItem key={asset} value={asset}>
          <TokenAvatar className="size-5" symbol={asset} />
          {asset}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
)

type AmountPanelProps = {
  label: string
  meta?: ReactNode
  children: ReactNode
}

const AmountPanel = ({ label, meta, children }: AmountPanelProps) => (
  <div className="flex flex-col gap-2 rounded-(--card-radius) border border-border bg-muted/40 p-3 transition-colors focus-within:border-ring dark:bg-muted/30">
    <div className="flex items-center justify-between text-xs">
      <span className="text-muted-foreground">{label}</span>
      {meta}
    </div>
    <div className="flex items-center gap-3">{children}</div>
  </div>
)

type OtcTradeFormProps = {
  data: OtcDashboardData
  hasQuote: boolean
  onRequestQuote: (request: OtcQuoteRequest) => void
  onChange: () => void
}

export function OtcTradeForm({
  data,
  hasQuote,
  onRequestQuote,
  onChange,
}: OtcTradeFormProps) {
  const [side, setSide] = useState<OtcSide>("Buy")
  const [baseAsset, setBaseAsset] = useState<OtcBaseAsset>("BTC")
  const [quoteAsset, setQuoteAsset] = useState<OtcQuoteAsset>("USDT")
  const [amount, setAmount] = useState("2.5")
  const [settlement, setSettlement] = useState<OtcSettlement>("instant")
  const [isPricing, setIsPricing] = useState(false)

  const isBuy = side === "Buy"
  const numericAmount = Math.max(0, Number.parseFloat(amount) || 0)
  const referencePrice = data.prices[baseAsset]
  const price = executionPrice(referencePrice, data.spread, side)
  const total = numericAmount * price
  const maxAmount = isBuy
    ? data.balances[quoteAsset] / price
    : data.balances[baseAsset]
  const minAmount = data.desk.minTicket / referencePrice

  const error =
    numericAmount <= 0
      ? "Enter an amount to request a quote."
      : numericAmount > maxAmount
        ? `Insufficient ${isBuy ? quoteAsset : baseAsset} balance.`
        : numericAmount < minAmount
          ? `Minimum OTC ticket is ${USD.format(data.desk.minTicket)}.`
          : null

  const update =
    <T,>(setter: (value: T) => void) =>
    (value: T) => {
      setter(value)
      onChange()
    }

  const requestQuote = () => {
    setIsPricing(true)
    window.setTimeout(() => {
      setIsPricing(false)
      onRequestQuote({
        side,
        baseAsset,
        quoteAsset,
        amount: numericAmount,
        settlement,
      })
    }, PRICING_DELAY_MS)
  }

  return (
    <Card className="gap-4">
      <CardHeader className="items-center">
        <CardTitle className="text-base">Request for quote</CardTitle>
        <CardDescription className="text-[11px]">
          Get a firm, all-in price from our desk for large orders.
        </CardDescription>
        <CardAction className="hidden flex-col items-end gap-0.5 self-center sm:flex">
          <span className="text-[11px] text-muted-foreground">
            Market reference
          </span>
          <span className="font-mono text-sm tabular-nums">
            1 {baseAsset} ={" "}
            <AnimatedNumber format={USD_FORMAT} value={referencePrice} />
          </span>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <SegmentedTabs
          className="*:data-[slot=tabs-list]:w-full"
          options={OTC_SIDES}
          value={side}
          onValueChange={update(setSide)}
        />

        <div className="relative flex flex-col gap-1.5">
          <AmountPanel
            label={isBuy ? "You buy" : "You sell"}
            meta={
              <button
                className="text-foreground/90 transition-colors hover:text-primary"
                onClick={() =>
                  update(setAmount)(String(Math.floor(maxAmount * 1e4) / 1e4))
                }
                type="button"
              >
                Max{" "}
                <AnimatedNumber
                  format={AMOUNT_FORMAT}
                  suffix={` ${baseAsset}`}
                  value={maxAmount}
                />
              </button>
            }
          >
            <AssetSelect
              label="Asset to trade"
              onChange={update(setBaseAsset)}
              options={OTC_BASE_ASSETS}
              value={baseAsset}
            />
            <Input
              aria-invalid={Boolean(error) && numericAmount > 0}
              aria-label={`Amount in ${baseAsset}`}
              className="h-10 min-w-0 flex-1 border-0 bg-transparent px-0 text-right font-mono text-2xl tabular-nums shadow-none focus-visible:ring-0 md:text-2xl dark:bg-transparent"
              inputMode="decimal"
              onChange={(event) =>
                update(setAmount)(event.target.value.replace(/[^\d.]/g, ""))
              }
              placeholder="0.00"
              value={amount}
            />
          </AmountPanel>

          <Button
            aria-label="Switch between buy and sell"
            className="absolute top-1/2 left-1/2 z-10 size-9 -translate-x-1/2 -translate-y-1/2 rounded-full border-border bg-card text-muted-foreground hover:text-foreground dark:bg-card"
            onClick={() => update(setSide)(isBuy ? "Sell" : "Buy")}
            size="icon"
            type="button"
            variant="outline"
          >
            <HugeiconsIcon icon={ArrowDataTransferVerticalIcon} size={16} />
          </Button>

          <AmountPanel
            label={isBuy ? "You pay" : "You receive"}
            meta={
              <span className="text-muted-foreground">
                Balance{" "}
                <AnimatedNumber
                  format={TOTAL_FORMAT}
                  suffix={` ${quoteAsset}`}
                  value={data.balances[quoteAsset]}
                />
              </span>
            }
          >
            <AssetSelect
              label="Settlement currency"
              onChange={update(setQuoteAsset)}
              options={OTC_QUOTE_ASSETS}
              value={quoteAsset}
            />
            <output
              aria-label={`Estimated amount in ${quoteAsset}`}
              className="min-w-0 flex-1 truncate text-right font-mono text-2xl text-foreground/90 tabular-nums"
            >
              <AnimatedNumber format={TOTAL_FORMAT} prefix="≈ " value={total} />
            </output>
          </AmountPanel>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {OTC_SIZE_PRESETS.map((percent) => (
            <Button
              className="h-8 flex-1 border-border text-xs font-normal text-muted-foreground hover:text-foreground"
              key={percent}
              onClick={() =>
                update(setAmount)(
                  String(Math.floor(((maxAmount * percent) / 100) * 1e4) / 1e4)
                )
              }
              type="button"
              variant="outline"
            >
              {percent === 100 ? "Max" : `${percent}%`}
            </Button>
          ))}
        </div>

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-xs text-muted-foreground">
            Settlement
          </legend>
          <div className="grid gap-2 sm:grid-cols-3">
            {OTC_SETTLEMENTS.map((option) => {
              const isActive = option.value === settlement
              return (
                <button
                  aria-pressed={isActive}
                  className={cn(
                    "flex flex-col items-start gap-0.5 rounded-(--card-radius) border px-3 py-2.5 text-left transition-colors",
                    isActive
                      ? "border-primary/70 bg-primary/5"
                      : "border-border hover:border-foreground/20 hover:bg-muted/40"
                  )}
                  key={option.value}
                  onClick={() => update(setSettlement)(option.value)}
                  type="button"
                >
                  <span className="flex w-full items-center justify-between text-sm font-medium">
                    {option.label}
                    <span
                      className={cn(
                        "size-2 rounded-full",
                        isActive ? "bg-primary" : "bg-foreground/15"
                      )}
                    />
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {option.eta}
                  </span>
                </button>
              )
            })}
          </div>
        </fieldset>

        <dl className="grid gap-2 border-t border-dashed border-border pt-4 text-xs sm:grid-cols-3">
          <div className="flex justify-between gap-2 sm:flex-col">
            <dt className="text-muted-foreground">Indicative price</dt>
            <dd className="font-mono tabular-nums">
              <AnimatedNumber format={USD_FORMAT} value={price} />
            </dd>
          </div>
          <div className="flex justify-between gap-2 sm:flex-col">
            <dt className="text-muted-foreground">Desk spread</dt>
            <dd className="font-mono tabular-nums">
              <AnimatedNumber
                format={PERCENT_FORMAT}
                suffix="%"
                value={data.spread}
              />
            </dd>
          </div>
          <div className="flex justify-between gap-2 sm:flex-col">
            <dt className="text-muted-foreground">Network fees</dt>
            <dd className="font-mono text-success tabular-nums">Included</dd>
          </div>
        </dl>

        <div className="flex flex-col-reverse items-start gap-2">
          <p
            aria-live="polite"
            className={cn(
              "flex items-center gap-1.5 text-[11px]",
              error && numericAmount > 0
                ? "text-destructive"
                : "text-muted-foreground"
            )}
          >
            <HugeiconsIcon
              className="shrink-0"
              icon={InformationCircleIcon}
              size={14}
            />
            {error && numericAmount > 0
              ? error
              : "You only commit once you confirm the firm quote."}
          </p>
          <Button
            className="h-10 w-full px-5 text-sm font-semibold sm:w-auto sm:min-w-40"
            disabled={Boolean(error)}
            loading={isPricing}
            onClick={requestQuote}
            type="button"
          >
            {hasQuote ? "Refresh quote" : "Request quote"}
            <HugeiconsIcon icon={ArrowRight02Icon} size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
