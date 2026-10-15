"use client"

import { Alert02Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import { DialogBody, DialogClose } from "@/components/ui/dialog"
import { AnimatedNumber } from "@/shared/components/atoms/animated-number"
import { IconBadge } from "@/shared/components/atoms/icon-badge"
import {
  CRYPTO_AMOUNT,
  CRYPTO_AMOUNT_FORMAT,
  USD_FORMAT,
  shortenAddress,
} from "@/shared/lib/format"
import { networkLabel } from "../helpers/network"
import { withdrawalReceive } from "../helpers/withdraw"
import type { AssetNetwork, WalletAsset, WithdrawalReceipt } from "../types"
import { DialogHints } from "@/shared/components/molecules/dialog-hints"
import { StepHeader } from "@/shared/components/molecules/step-header"
import { ReviewRow } from "@/shared/components/molecules/review-row"

type WithdrawReviewStepProps = {
  asset: WalletAsset
  network: AssetNetwork
  address: string
  amount: number
  error: string | null
  isSubmitting: boolean
  onBack: () => void
  onConfirm: () => void
}

export function WithdrawReviewStep({
  asset,
  network,
  address,
  amount,
  error,
  isSubmitting,
  onBack,
  onConfirm,
}: WithdrawReviewStepProps) {
  const receive = withdrawalReceive(amount, network)

  return (
    <>
      <StepHeader
        backLabel="Back to details"
        detail={networkLabel(network)}
        onBack={isSubmitting ? undefined : onBack}
        symbol={asset.symbol}
        title="Review withdrawal"
      />

      <DialogBody className="flex flex-col gap-4 p-4">
        <div className="flex flex-col items-center gap-1 border border-foreground/10 bg-muted/40 py-5">
          <span className="text-xs text-muted-foreground">
            You will receive
          </span>
          <AnimatedNumber
            className="font-mono text-3xl tracking-tight tabular-nums"
            format={CRYPTO_AMOUNT_FORMAT}
            suffix={` ${asset.symbol}`}
            value={receive}
          />
          <AnimatedNumber
            className="text-xs text-muted-foreground"
            format={USD_FORMAT}
            prefix="≈ "
            value={receive * asset.price}
          />
        </div>

        <dl className="flex flex-col divide-y divide-foreground/8 text-xs">
          <ReviewRow label="Recipient">
            <span className="font-mono break-all">{address}</span>
          </ReviewRow>
          <ReviewRow label="Network">{networkLabel(network)}</ReviewRow>
          <ReviewRow label="Amount">
            <span className="font-mono tabular-nums">
              {CRYPTO_AMOUNT.format(amount)} {asset.symbol}
            </span>
          </ReviewRow>
          <ReviewRow label="Network fee">
            <span className="font-mono tabular-nums">
              {CRYPTO_AMOUNT.format(network.withdrawFee)} {asset.symbol}
            </span>
          </ReviewRow>
          <ReviewRow label="Expected arrival">
            ~{network.arrivalMinutes} min
          </ReviewRow>
        </dl>

        <p className="flex gap-2.5 border border-primary/25 bg-primary/5 p-3 text-xs leading-relaxed text-foreground/90">
          <HugeiconsIcon
            className="mt-px shrink-0 text-primary"
            icon={Alert02Icon}
            size={15}
          />
          Withdrawals cannot be reversed. Make sure the recipient address
          supports {asset.symbol} on {networkLabel(network)}.
        </p>

        {error && (
          <p aria-live="polite" className="text-xs text-destructive">
            {error}
          </p>
        )}
      </DialogBody>

      <DialogHints
        action={
          <Button
            className="h-8 px-4"
            loading={isSubmitting}
            onClick={onConfirm}
          >
            Confirm withdrawal
          </Button>
        }
        hints={[{ keys: ["Esc"], label: "Cancel" }]}
      />
    </>
  )
}

type WithdrawSuccessStepProps = {
  asset: WalletAsset
  address: string
  receipt: WithdrawalReceipt
}

export function WithdrawSuccessStep({
  asset,
  address,
  receipt,
}: WithdrawSuccessStepProps) {
  return (
    <>
      <StepHeader
        backLabel=""
        symbol={asset.symbol}
        title="Withdrawal submitted"
      />

      <DialogBody className="flex flex-col items-center gap-4 px-4 py-8 text-center">
        <IconBadge
          accent="var(--success)"
          className="size-12"
          icon={CheckmarkCircle02Icon}
        />
        <div className="flex flex-col gap-1">
          <p className="font-mono text-2xl tracking-tight tabular-nums">
            {CRYPTO_AMOUNT.format(receipt.receive)} {asset.symbol}
          </p>
          <p className="text-xs text-muted-foreground">
            On its way to{" "}
            <span className="font-mono text-foreground">
              {shortenAddress(address)}
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
            <dd className="text-primary">
              Processing · ~{receipt.arrivalMinutes} min
            </dd>
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
