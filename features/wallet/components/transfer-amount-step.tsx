"use client"

import { ArrowRight02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import { DialogBody } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { AnimatedNumber } from "@/shared/components/atoms/animated-number"
import { CRYPTO_AMOUNT, USD_FORMAT } from "@/shared/lib/format"
import { cn } from "@/shared/lib/utils"
import { TRANSFER_NOTE_MAX } from "../constants"
import { validateTransferAmount } from "../helpers/transfer"
import type { TransferRecipient, WalletAsset } from "../types"
import { SharedElement } from "@/shared/components/molecules/step-transition"
import { AmountPresets, AssetChip } from "./amount-controls"
import { DialogHints } from "@/shared/components/molecules/dialog-hints"
import { RecipientAvatar } from "./recipient-avatar"
import { StepHeader } from "@/shared/components/molecules/step-header"

export type TransferDraft = {
  asset: WalletAsset
  amount: string
  note: string
}

type TransferAmountStepProps = {
  recipient: TransferRecipient
  draft: TransferDraft
  onBack: () => void
  onChange: (draft: TransferDraft) => void
  onPickAsset: () => void
  onContinue: () => void
}

export function TransferAmountStep({
  recipient,
  draft,
  onBack,
  onChange,
  onPickAsset,
  onContinue,
}: TransferAmountStepProps) {
  const { asset, amount, note } = draft
  const numericAmount = Number.parseFloat(amount) || 0
  const amountError = amount
    ? validateTransferAmount(numericAmount, asset)
    : null
  const canContinue = Boolean(amount) && !amountError

  return (
    <>
      <StepHeader
        backLabel="Back to recipients"
        detail={recipient.handle}
        leading={
          <SharedElement id={`recipient:${recipient.id}`}>
            <RecipientAvatar className="size-6" recipient={recipient} />
          </SharedElement>
        }
        onBack={onBack}
        title={`Send to ${recipient.name}`}
      />

      <DialogBody className="flex flex-col gap-5 p-4">
        <div className="flex flex-col gap-2">
          <div
            className={cn(
              "flex flex-col gap-3 border border-foreground/10 p-3 transition-colors focus-within:border-primary",
              amountError &&
                "border-destructive focus-within:border-destructive"
            )}
          >
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <label htmlFor="transfer-amount">Amount</label>
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
                label="Change asset to send"
                onClick={onPickAsset}
              />
              <input
                aria-invalid={Boolean(amountError)}
                autoComplete="off"
                autoFocus
                className="min-w-0 flex-1 bg-transparent text-right font-mono text-xl tabular-nums outline-none placeholder:text-muted-foreground/50"
                id="transfer-amount"
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
                balance={asset.balance}
                onSelect={(next) => onChange({ ...draft, amount: next })}
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

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <label htmlFor="transfer-note">Note (optional)</label>
            <span className="font-mono tabular-nums">
              {note.length}/{TRANSFER_NOTE_MAX}
            </span>
          </div>
          <Input
            autoComplete="off"
            className="h-11 border-foreground/10 bg-muted text-sm md:text-sm dark:bg-muted"
            id="transfer-note"
            maxLength={TRANSFER_NOTE_MAX}
            onChange={(event) =>
              onChange({ ...draft, note: event.target.value })
            }
            placeholder="What's it for?"
            value={note}
          />
        </div>

        <dl className="flex flex-col gap-2.5 border border-foreground/10 p-3 text-xs">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Fee</dt>
            <dd className="text-success">Free</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Arrival</dt>
            <dd>Instant</dd>
          </div>
          <div className="flex items-center gap-3 border-t border-foreground/10 pt-2.5">
            <dt className="flex-1 text-muted-foreground">Recipient</dt>
            <dd className="flex items-center gap-2">
              <RecipientAvatar className="size-5" recipient={recipient} />
              {recipient.name}
              <span className="font-mono text-muted-foreground tabular-nums">
                · ID {recipient.id}
              </span>
            </dd>
          </div>
        </dl>
      </DialogBody>

      <DialogHints
        action={
          <Button
            className="h-8 px-4"
            disabled={!canContinue}
            onClick={onContinue}
          >
            Continue
            <HugeiconsIcon icon={ArrowRight02Icon} size={14} />
          </Button>
        }
        hints={[{ keys: ["Esc"], label: "Close" }]}
      />
    </>
  )
}
