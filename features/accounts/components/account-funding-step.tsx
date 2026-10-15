"use client"

import { ArrowRight02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import { DialogBody } from "@/components/ui/dialog"
import { AmountPresets, AssetChip, type WalletAsset } from "@/features/wallet"
import { AnimatedNumber } from "@/shared/components/atoms/animated-number"
import { DialogHints } from "@/shared/components/molecules/dialog-hints"
import { StepHeader } from "@/shared/components/molecules/step-header"
import { CRYPTO_AMOUNT, USD_FORMAT } from "@/shared/lib/format"
import { cn } from "@/shared/lib/utils"
import { validateFundingAmount } from "../helpers/account"
import type { AccountType } from "../types"
import { AccountBadge } from "./account-badge"

type AccountFundingStepProps = {
  type: AccountType
  color: string
  asset: WalletAsset
  amount: string
  pending: "skip" | "fund" | null
  onBack: () => void
  onAmountChange: (amount: string) => void
  onPickAsset: () => void
  onSkip: () => void
  onContinue: () => void
}

export function AccountFundingStep({
  type,
  color,
  asset,
  amount,
  pending,
  onBack,
  onAmountChange,
  onPickAsset,
  onSkip,
  onContinue,
}: AccountFundingStepProps) {
  const numericAmount = Number.parseFloat(amount) || 0
  const amountError = amount
    ? validateFundingAmount(numericAmount, asset.balance)
    : null

  return (
    <>
      <StepHeader
        backLabel="Back to account details"
        detail="Step 3 of 4"
        leading={
          <AccountBadge
            className="size-6"
            color={color}
            iconSize={14}
            shared
            type={type}
          />
        }
        onBack={pending ? undefined : onBack}
        title="Fund your account"
      />

      <DialogBody className="flex flex-col gap-5 p-4">
        <p className="text-xs leading-relaxed text-muted-foreground">
          Move funds from your Main account now, or skip and transfer them
          later. Internal transfers are free and instant.
        </p>

        <div className="flex flex-col gap-2">
          <div
            className={cn(
              "flex flex-col gap-3 border border-foreground/10 p-3 transition-colors focus-within:border-primary",
              amountError &&
                "border-destructive focus-within:border-destructive"
            )}
          >
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <label htmlFor="funding-amount">From Main account</label>
              <span>
                Available{" "}
                <span className="font-mono text-foreground tabular-nums">
                  {CRYPTO_AMOUNT.format(asset.balance)} {asset.symbol}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <AssetChip
                asset={asset}
                label="Change funding asset"
                onClick={onPickAsset}
              />
              <input
                aria-invalid={Boolean(amountError)}
                autoComplete="off"

                className="min-w-0 flex-1 bg-transparent text-right font-mono text-xl tabular-nums outline-none placeholder:text-muted-foreground/50"
                id="funding-amount"
                inputMode="decimal"
                onChange={(event) =>
                  onAmountChange(event.target.value.replace(/[^\d.]/g, ""))
                }
                placeholder="0.00"
                value={amount}
              />
            </div>
            <div className="flex h-5 items-center justify-between gap-3">
              <AmountPresets
                balance={asset.balance}
                onSelect={onAmountChange}
              />
              <AnimatedNumber
                className="text-xs text-muted-foreground"
                format={USD_FORMAT}
                prefix="≈ "
                value={numericAmount * asset.price}
              />
            </div>
          </div>
          {amountError && (
            <p aria-live="polite" className="text-xs text-destructive">
              {amountError}
            </p>
          )}
        </div>

        <dl className="flex flex-col gap-2.5 border border-foreground/10 p-3 text-xs">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Transfer fee</dt>
            <dd className="text-success">Free</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Arrival</dt>
            <dd>Instant</dd>
          </div>
        </dl>
      </DialogBody>

      <DialogHints
        action={
          <div className="flex gap-2">
            <Button
              className="h-8 px-3 text-muted-foreground"
              disabled={pending === "fund"}
              loading={pending === "skip"}
              onClick={onSkip}
              variant="ghost"
            >
              Skip, fund later
            </Button>
            <Button
              className="h-8 px-4"
              disabled={!amount || Boolean(amountError) || pending === "skip"}
              loading={pending === "fund"}
              onClick={onContinue}
            >
              Continue
              <HugeiconsIcon icon={ArrowRight02Icon} size={14} />
            </Button>
          </div>
        }
        hints={[{ keys: ["Esc"], label: "Close" }]}
      />
    </>
  )
}
