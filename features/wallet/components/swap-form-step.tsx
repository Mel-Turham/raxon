"use client"

import {
  ArrowDataTransferVerticalIcon,
  ArrowRight02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { DialogBody, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Kbd } from "@/components/ui/kbd"
import { AnimatedNumber } from "@/shared/components/atoms/animated-number"
import {
  CRYPTO_AMOUNT,
  CRYPTO_AMOUNT_FORMAT,
  USD_FORMAT,
} from "@/shared/lib/format"
import { cn } from "@/shared/lib/utils"
import { SWAP_FEE_RATE } from "../constants"
import { RATE, swapPreview, validateSwapAmount } from "../helpers/swap"
import type { WalletAsset } from "../types"
import { AmountPresets, AssetChip } from "./amount-controls"
import { DialogHints } from "@/shared/components/molecules/dialog-hints"

const PANEL = "flex flex-col gap-3 border border-foreground/10 p-3"

export type SwapDraft = {
  from: WalletAsset
  to: WalletAsset
  amount: string
}

type SwapFormStepProps = {
  draft: SwapDraft
  error: string | null
  isQuoting: boolean
  onChange: (draft: SwapDraft) => void
  onPick: (side: "from" | "to") => void
  onPreview: () => void
}

const PanelLabel = ({
  children,
  balance,
}: {
  children: ReactNode
  balance: ReactNode
}) => (
  <div className="flex items-center justify-between text-xs text-muted-foreground">
    <span>{children}</span>
    <span>{balance}</span>
  </div>
)

export function SwapFormStep({
  draft,
  error,
  isQuoting,
  onChange,
  onPick,
  onPreview,
}: SwapFormStepProps) {
  const { from, to, amount } = draft
  const numericAmount = Number.parseFloat(amount) || 0
  const amountError = amount ? validateSwapAmount(numericAmount, from) : null
  const { rate, fee, receive } = swapPreview(numericAmount, from, to)
  const canPreview = Boolean(amount) && !amountError && !isQuoting

  return (
    <>
      <DialogHeader>
        <HugeiconsIcon
          className="text-muted-foreground"
          icon={ArrowDataTransferVerticalIcon}
          size={18}
        />
        <DialogTitle className="flex-1">Swap</DialogTitle>
        <Kbd>Esc</Kbd>
      </DialogHeader>

      <DialogBody className="flex flex-col gap-4 p-4">
        <div className="relative flex flex-col gap-1">
          <div
            className={cn(
              PANEL,
              "transition-colors focus-within:border-primary",
              amountError &&
                "border-destructive focus-within:border-destructive"
            )}
          >
            <PanelLabel
              balance={
                <>
                  Available{" "}
                  <span className="font-mono text-foreground tabular-nums">
                    {CRYPTO_AMOUNT.format(from.balance)} {from.symbol}
                  </span>
                </>
              }
            >
              <label htmlFor="swap-amount">From</label>
            </PanelLabel>
            <div className="flex items-center gap-3">
              <AssetChip
                asset={from}
                label="Change asset to swap from"
                onClick={() => onPick("from")}
              />
              <input
                aria-invalid={Boolean(amountError)}
                autoComplete="off"
                autoFocus
                className="min-w-0 flex-1 bg-transparent text-right font-mono text-xl tabular-nums outline-none placeholder:text-muted-foreground/50"
                id="swap-amount"
                inputMode="decimal"
                onChange={(event) =>
                  onChange({
                    ...draft,
                    amount: event.target.value.replace(/[^\d.]/g, ""),
                  })
                }
                placeholder="0.00"
                value={amount}
              />
            </div>
            <div className="flex h-5 items-center justify-between gap-3">
              <AmountPresets
                balance={from.balance}
                onSelect={(next) => onChange({ ...draft, amount: next })}
              />
              <AnimatedNumber
                className="text-xs text-muted-foreground"
                format={USD_FORMAT}
                prefix="≈ "
                value={numericAmount * from.price}
              />
            </div>
          </div>

          <Button
            aria-label="Flip assets"
            className="absolute top-1/2 left-1/2 z-10 size-9 -translate-x-1/2 -translate-y-1/2 border-4 border-card bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground"
            onClick={() => onChange({ from: to, to: from, amount: "" })}
            size="icon"
            variant="ghost"
          >
            <HugeiconsIcon icon={ArrowDataTransferVerticalIcon} size={16} />
          </Button>

          <div className={PANEL}>
            <PanelLabel
              balance={
                <>
                  Balance{" "}
                  <span className="font-mono text-foreground tabular-nums">
                    {CRYPTO_AMOUNT.format(to.balance)} {to.symbol}
                  </span>
                </>
              }
            >
              To
            </PanelLabel>
            <div className="flex items-center gap-3">
              <AssetChip
                asset={to}
                label="Change asset to receive"
                onClick={() => onPick("to")}
              />
              <AnimatedNumber
                className={cn(
                  "min-w-0 flex-1 truncate text-right font-mono text-xl tabular-nums",
                  !receive && "text-muted-foreground/50"
                )}
                format={CRYPTO_AMOUNT_FORMAT}
                value={receive}
              />
            </div>
            <div className="flex h-5 items-center justify-end">
              <AnimatedNumber
                className="text-xs text-muted-foreground"
                format={USD_FORMAT}
                prefix="≈ "
                value={receive * to.price}
              />
            </div>
          </div>
        </div>

        {(amountError ?? error) && (
          <p aria-live="polite" className="text-xs text-destructive">
            {amountError ?? error}
          </p>
        )}

        <dl className="flex flex-col gap-2.5 border border-foreground/10 p-3 text-xs">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Rate</dt>
            <dd className="font-mono tabular-nums">
              1 {from.symbol} ≈ {RATE.format(rate)} {to.symbol}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">
              Fee · {SWAP_FEE_RATE * 100}%
            </dt>
            <dd className="font-mono tabular-nums">
              {CRYPTO_AMOUNT.format(fee)} {to.symbol}
            </dd>
          </div>
        </dl>
      </DialogBody>

      <DialogHints
        action={
          <Button
            className="h-8 px-4"
            disabled={!canPreview}
            loading={isQuoting}
            onClick={onPreview}
          >
            Preview
            <HugeiconsIcon icon={ArrowRight02Icon} size={14} />
          </Button>
        }
        hints={[{ keys: ["Esc"], label: "Close" }]}
      />
    </>
  )
}
