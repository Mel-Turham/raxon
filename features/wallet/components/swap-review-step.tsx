"use client"

import {
  ArrowDown02Icon,
  CheckmarkCircle02Icon,
  Timer02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { useSecondsLeft } from "@/shared/hooks/use-seconds-left"
import { Button } from "@/components/ui/button"
import { DialogBody, DialogClose } from "@/components/ui/dialog"
import { AnimatedNumber } from "@/shared/components/atoms/animated-number"
import { IconBadge } from "@/shared/components/atoms/icon-badge"
import { TokenAvatar } from "@/shared/components/atoms/token-avatar"
import { SharedElement } from "@/shared/components/molecules/step-transition"
import { CRYPTO_AMOUNT, USD_FORMAT } from "@/shared/lib/format"
import { cn } from "@/shared/lib/utils"
import { SWAP_FEE_RATE } from "../constants"
import { RATE } from "../helpers/swap"
import type { SwapQuote, SwapReceipt, WalletAsset } from "../types"
import { DialogHints } from "@/shared/components/molecules/dialog-hints"
import { StepHeader } from "@/shared/components/molecules/step-header"
import { ReviewRow } from "@/shared/components/molecules/review-row"

const Leg = ({
  asset,
  label,
  amount,
}: {
  asset: WalletAsset
  label: string
  amount: number
}) => (
  <div className="flex items-center gap-3 p-3">
    <SharedElement id={`token:${asset.symbol}`}>
      <TokenAvatar className="size-8" symbol={asset.symbol} />
    </SharedElement>
    <div className="flex min-w-0 flex-1 flex-col">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="truncate font-mono text-lg tracking-tight tabular-nums">
        {CRYPTO_AMOUNT.format(amount)} {asset.symbol}
      </span>
    </div>
    <AnimatedNumber
      className="text-xs text-muted-foreground"
      format={USD_FORMAT}
      prefix="≈ "
      value={amount * asset.price}
    />
  </div>
)

type SwapReviewStepProps = {
  quote: SwapQuote
  from: WalletAsset
  to: WalletAsset
  error: string | null
  isPending: boolean
  onBack: () => void
  onConfirm: () => void
  onRefresh: () => void
}

export function SwapReviewStep({
  quote,
  from,
  to,
  error,
  isPending,
  onBack,
  onConfirm,
  onRefresh,
}: SwapReviewStepProps) {
  const secondsLeft = useSecondsLeft(quote.expiresAt)
  const isExpired = secondsLeft === 0

  return (
    <>
      <StepHeader
        backLabel="Back to swap"
        detail={`${from.symbol} → ${to.symbol}`}
        leading={<TokenAvatar className="size-6" symbol={from.symbol} />}
        onBack={isPending ? undefined : onBack}
        title="Review swap"
      />

      <DialogBody className="flex flex-col gap-4 p-4">
        <div className="relative flex flex-col divide-y divide-foreground/10 border border-foreground/10 bg-muted/40">
          <Leg amount={quote.amount} asset={from} label="You pay" />
          <Leg amount={quote.receive} asset={to} label="You receive" />
          <span className="absolute top-1/2 left-6 flex size-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-foreground/10 bg-muted text-muted-foreground">
            <HugeiconsIcon icon={ArrowDown02Icon} size={12} />
          </span>
        </div>

        <dl className="flex flex-col divide-y divide-foreground/8 text-xs">
          <ReviewRow label="Rate">
            <span className="font-mono tabular-nums">
              1 {from.symbol} = {RATE.format(quote.rate)} {to.symbol}
            </span>
          </ReviewRow>
          <ReviewRow label={`Fee · ${SWAP_FEE_RATE * 100}%`}>
            <span className="font-mono tabular-nums">
              {CRYPTO_AMOUNT.format(quote.fee)} {to.symbol}
            </span>
          </ReviewRow>
          <ReviewRow label="Settlement">Instant</ReviewRow>
        </dl>

        <p
          aria-live="polite"
          className={cn(
            "flex items-center gap-2.5 border p-3 text-xs",
            isExpired
              ? "border-destructive/30 bg-destructive/5"
              : "border-primary/25 bg-primary/5"
          )}
        >
          <HugeiconsIcon
            className={cn(
              "shrink-0",
              isExpired ? "text-destructive" : "text-primary"
            )}
            icon={Timer02Icon}
            size={15}
          />
          {isExpired ? (
            "Quote expired. Refresh to get the latest rate."
          ) : (
            <span>
              Rate locked for{" "}
              <span className="font-mono tabular-nums">{secondsLeft}s</span>
            </span>
          )}
        </p>

        {error && (
          <p aria-live="polite" className="text-xs text-destructive">
            {error}
          </p>
        )}
      </DialogBody>

      <DialogHints
        action={
          isExpired ? (
            <Button
              className="h-8 px-4"
              loading={isPending}
              onClick={onRefresh}
            >
              Refresh quote
            </Button>
          ) : (
            <Button
              className="h-8 px-4"
              loading={isPending}
              onClick={onConfirm}
            >
              Confirm swap
            </Button>
          )
        }
        hints={[{ keys: ["Esc"], label: "Cancel" }]}
      />
    </>
  )
}

type SwapSuccessStepProps = {
  from: WalletAsset
  to: WalletAsset
  amount: number
  receipt: SwapReceipt
}

export function SwapSuccessStep({
  from,
  to,
  amount,
  receipt,
}: SwapSuccessStepProps) {
  return (
    <>
      <StepHeader backLabel="" symbol={to.symbol} title="Swap completed" />

      <DialogBody className="flex flex-col items-center gap-4 px-4 py-8 text-center">
        <IconBadge
          accent="var(--success)"
          className="size-12"
          icon={CheckmarkCircle02Icon}
        />
        <div className="flex flex-col gap-1">
          <p className="font-mono text-2xl tracking-tight tabular-nums">
            {CRYPTO_AMOUNT.format(receipt.receive)} {to.symbol}
          </p>
          <p className="text-xs text-muted-foreground">
            Swapped from{" "}
            <span className="font-mono text-foreground">
              {CRYPTO_AMOUNT.format(amount)} {from.symbol}
            </span>
          </p>
        </div>
        <dl className="grid w-full grid-cols-2 border border-foreground/10 text-xs">
          <div className="flex flex-col gap-1 border-r border-foreground/10 p-3">
            <dt className="text-muted-foreground">Reference</dt>
            <dd className="font-mono">{receipt.reference}</dd>
          </div>
          <div className="flex flex-col gap-1 p-3">
            <dt className="text-muted-foreground">Status</dt>
            <dd className="text-success">Completed</dd>
          </div>
        </dl>
      </DialogBody>

      <DialogHints
        action={
          <DialogClose render={<Button className="h-8 px-4" />}>
            Done
          </DialogClose>
        }
        hints={[{ keys: ["Esc"], label: "Close" }]}
      />
    </>
  )
}
