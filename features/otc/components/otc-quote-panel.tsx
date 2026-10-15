"use client"

import {
  CheckmarkCircle02Icon,
  Invoice03Icon,
  SecurityCheckIcon,
  Timer02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { useSecondsLeft } from "@/shared/hooks/use-seconds-left"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { IconBadge } from "@/shared/components/atoms/icon-badge"
import { IconTile } from "@/shared/components/atoms/icon-tile"
import { TokenAvatar } from "@/shared/components/atoms/token-avatar"
import { cn } from "@/shared/lib/utils"
import { OTC_QUOTE_TTL_SECONDS, OTC_SETTLEMENTS } from "../constants"
import type { OtcQuote } from "../types"
import { AnimatedNumber } from "@/shared/components/atoms/animated-number"
import {
  AMOUNT_FORMAT,
  COUNTDOWN_FORMAT,
  PERCENT_FORMAT,
  TOTAL_FORMAT,
  USD_FORMAT,
} from "../helpers/format"

export type OtcQuoteState =
  | { status: "idle" }
  | { status: "live"; quote: OtcQuote }
  | { status: "expired"; quote: OtcQuote }
  | { status: "settled"; quote: OtcQuote; reference: string }

const IDLE_POINTS = [
  "Price locked for 30 seconds",
  "No slippage, spread and fees included",
  "Nothing is executed until you confirm",
] as const

const PairBadge = ({ quote }: { quote: OtcQuote }) => (
  <span className="flex items-center gap-2 text-xs font-medium">
    <span className="flex -space-x-1.5">
      <TokenAvatar
        className="size-6 ring-2 ring-card"
        symbol={quote.baseAsset}
      />
      <TokenAvatar
        className="size-6 ring-2 ring-card"
        symbol={quote.quoteAsset}
      />
    </span>
    {quote.baseAsset} / {quote.quoteAsset}
  </span>
)

const QuoteRows = ({ quote }: { quote: OtcQuote }) => {
  const settlement = OTC_SETTLEMENTS.find(
    (option) => option.value === quote.settlement
  )
  const numericRows = [
    {
      label: quote.side === "Buy" ? "You buy" : "You sell",
      value: quote.amount,
      format: AMOUNT_FORMAT,
      suffix: ` ${quote.baseAsset}`,
    },
    { label: "Execution price", value: quote.price, format: USD_FORMAT },
    {
      label: "Market reference",
      value: quote.referencePrice,
      format: USD_FORMAT,
    },
    {
      label: "Desk spread",
      value: quote.spread,
      format: PERCENT_FORMAT,
      suffix: "%",
    },
  ]
  const textRows = [
    {
      label: "Settlement",
      value: settlement ? `${settlement.label} · ${settlement.eta}` : "—",
    },
    { label: "Quote ID", value: quote.id },
  ]

  return (
    <dl className="flex flex-col gap-2.5">
      {numericRows.map(({ label, value, format, suffix }) => (
        <div className="flex items-center justify-between gap-3" key={label}>
          <dt className="text-xs text-muted-foreground">{label}</dt>
          <dd className="text-right font-mono text-xs tabular-nums">
            <AnimatedNumber format={format} suffix={suffix} value={value} />
          </dd>
        </div>
      ))}
      {textRows.map(({ label, value }) => (
        <div className="flex items-center justify-between gap-3" key={label}>
          <dt className="text-xs text-muted-foreground">{label}</dt>
          <dd className="text-right font-mono text-xs tabular-nums">{value}</dd>
        </div>
      ))}
    </dl>
  )
}

const TotalBlock = ({ quote }: { quote: OtcQuote }) => (
  <div className="flex flex-col gap-1 rounded-(--card-radius) border border-border bg-muted/40 p-3 dark:bg-muted/30">
    <span className="text-[11px] text-muted-foreground">
      {quote.side === "Buy" ? "Total to pay" : "Total to receive"}
    </span>
    <span className="font-mono text-2xl tracking-tight tabular-nums">
      <AnimatedNumber format={TOTAL_FORMAT} value={quote.total} />{" "}
      <span className="text-base text-muted-foreground">
        {quote.quoteAsset}
      </span>
    </span>
  </div>
)

type OtcQuotePanelProps = {
  state: OtcQuoteState
  isConfirming: boolean
  error: string | null
  onConfirm: () => void
  onDismiss: () => void
}

export function OtcQuotePanel({
  state,
  isConfirming,
  error,
  onConfirm,
  onDismiss,
}: OtcQuotePanelProps) {
  const secondsLeft = useSecondsLeft(
    state.status === "live" ? state.quote.expiresAt : null
  )
  const progress = (secondsLeft / OTC_QUOTE_TTL_SECONDS) * 100
  const isUrgent = secondsLeft <= 10

  return (
    <Card className="gap-4">
      <CardHeader className="items-center">
        <CardTitle className="text-base">Quote</CardTitle>
        <CardDescription className="text-[11px]">
          {state.status === "live"
            ? "Firm price reserved by the desk"
            : "Your firm price appears here"}
        </CardDescription>
        {state.status !== "idle" && (
          <CardAction className="self-center">
            <PairBadge quote={state.quote} />
          </CardAction>
        )}
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {state.status === "idle" && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-center gap-3 rounded-(--card-radius) border border-dashed border-border px-4 py-6 text-center">
              <IconTile className="size-11" icon={Invoice03Icon} size={20} />
              <div className="space-y-1">
                <p className="text-sm font-medium">No active quote</p>
                <p className="text-xs text-muted-foreground">
                  Configure your trade and request a quote to see the firm
                  price.
                </p>
              </div>
            </div>
            <ul className="flex flex-col gap-2.5">
              {IDLE_POINTS.map((point) => (
                <li
                  className="flex items-center gap-2 text-xs text-muted-foreground"
                  key={point}
                >
                  <HugeiconsIcon
                    className="text-success"
                    icon={CheckmarkCircle02Icon}
                    size={15}
                  />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}

        {state.status === "live" && (
          <>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <HugeiconsIcon icon={Timer02Icon} size={14} />
                  Expires in
                </span>
                <span
                  className={cn(
                    "font-mono font-medium tabular-nums",
                    isUrgent ? "text-destructive" : "text-success"
                  )}
                >
                  <AnimatedNumber
                    format={COUNTDOWN_FORMAT}
                    prefix="00:"
                    value={secondsLeft}
                  />
                </span>
              </div>
              <div className="h-1 overflow-hidden bg-muted">
                <div
                  className={cn(
                    "h-full transition-[width] duration-300 ease-linear",
                    isUrgent ? "bg-destructive" : "bg-success"
                  )}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <TotalBlock quote={state.quote} />
            <QuoteRows quote={state.quote} />
            <div className="grid grid-cols-[auto_1fr] gap-2">
              <Button
                className="h-11 px-4"
                disabled={isConfirming}
                onClick={onDismiss}
                type="button"
                variant="outline"
              >
                Decline
              </Button>
              <Button
                className="h-11 text-sm font-semibold"
                disabled={secondsLeft === 0}
                loading={isConfirming}
                onClick={onConfirm}
                type="button"
              >
                Confirm {state.quote.side.toLowerCase()}
              </Button>
            </div>
          </>
        )}

        {state.status === "expired" && (
          <div className="flex flex-col items-center gap-3 rounded-(--card-radius) border border-dashed border-border px-4 py-6 text-center">
            <IconTile className="size-11" icon={Timer02Icon} size={20} />
            <div className="space-y-1">
              <p className="text-sm font-medium">Quote expired</p>
              <p className="text-xs text-muted-foreground">
                Prices move fast. Request a new quote to get an updated firm
                price.
              </p>
            </div>
          </div>
        )}

        {state.status === "settled" && (
          <>
            <div className="flex flex-col items-center gap-3 rounded-(--card-radius) border border-success/30 bg-success/5 px-4 py-5 text-center">
              <IconBadge
                accent="var(--success)"
                className="size-11"
                icon={CheckmarkCircle02Icon}
              />
              <div className="space-y-1">
                <p className="text-sm font-medium">Trade confirmed</p>
                <p className="text-xs text-muted-foreground">
                  Reference{" "}
                  <span className="font-mono text-foreground">
                    {state.reference}
                  </span>
                </p>
              </div>
            </div>
            <TotalBlock quote={state.quote} />
            <Button
              className="h-11"
              onClick={onDismiss}
              type="button"
              variant="outline"
            >
              New quote
            </Button>
          </>
        )}

        {error && (
          <p aria-live="polite" className="text-xs text-destructive">
            {error}
          </p>
        )}

        <p className="flex items-center gap-1.5 border-t border-border pt-3 text-[11px] text-muted-foreground">
          <HugeiconsIcon
            className="shrink-0"
            icon={SecurityCheckIcon}
            size={14}
          />
          Settled through regulated custody partners.
        </p>
      </CardContent>
    </Card>
  )
}
