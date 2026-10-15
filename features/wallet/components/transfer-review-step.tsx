"use client"

import { Alert02Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useEffect, useRef } from "react"

import { Button } from "@/components/ui/button"
import { DialogBody, DialogClose } from "@/components/ui/dialog"
import { AnimatedNumber } from "@/shared/components/atoms/animated-number"
import { IconBadge } from "@/shared/components/atoms/icon-badge"
import { celebrate } from "@/shared/lib/confetti"
import {
  CRYPTO_AMOUNT,
  CRYPTO_AMOUNT_FORMAT,
  USD_FORMAT,
} from "@/shared/lib/format"
import type { TransferReceipt, TransferRecipient, WalletAsset } from "../types"
import { SharedElement } from "@/shared/components/molecules/step-transition"
import { DialogHints } from "@/shared/components/molecules/dialog-hints"
import { RecipientAvatar } from "./recipient-avatar"
import { StepHeader } from "@/shared/components/molecules/step-header"
import { ReviewRow } from "@/shared/components/molecules/review-row"

type TransferReviewStepProps = {
  recipient: TransferRecipient
  asset: WalletAsset
  amount: number
  note: string
  error: string | null
  isSubmitting: boolean
  onBack: () => void
  onConfirm: () => void
}

export function TransferReviewStep({
  recipient,
  asset,
  amount,
  note,
  error,
  isSubmitting,
  onBack,
  onConfirm,
}: TransferReviewStepProps) {
  return (
    <>
      <StepHeader
        backLabel="Back to amount"
        detail={recipient.name}
        onBack={isSubmitting ? undefined : onBack}
        symbol={asset.symbol}
        title="Review transfer"
      />

      <DialogBody className="flex flex-col gap-4 p-4">
        <div className="flex flex-col items-center gap-1 border border-foreground/10 bg-muted/40 py-5">
          <span className="text-xs text-muted-foreground">You send</span>
          <AnimatedNumber
            className="font-mono text-3xl tracking-tight tabular-nums"
            format={CRYPTO_AMOUNT_FORMAT}
            suffix={` ${asset.symbol}`}
            value={amount}
          />
          <AnimatedNumber
            className="text-xs text-muted-foreground"
            format={USD_FORMAT}
            prefix="≈ "
            value={amount * asset.price}
          />
        </div>

        <dl className="flex flex-col divide-y divide-foreground/8 text-xs">
          <ReviewRow label="To">
            <span className="flex items-center justify-end gap-2">
              <SharedElement id={`recipient:${recipient.id}`}>
                <RecipientAvatar className="size-5" recipient={recipient} />
              </SharedElement>
              {recipient.name}
            </span>
          </ReviewRow>
          <ReviewRow label="Account">
            <span className="font-mono tabular-nums">
              {recipient.handle} · ID {recipient.id}
            </span>
          </ReviewRow>
          {note.trim() && (
            <ReviewRow label="Note">
              <span className="break-words">{note.trim()}</span>
            </ReviewRow>
          )}
          <ReviewRow label="Fee">
            <span className="text-success">Free</span>
          </ReviewRow>
          <ReviewRow label="Arrival">Instant</ReviewRow>
        </dl>

        <p className="flex gap-2.5 border border-primary/25 bg-primary/5 p-3 text-xs leading-relaxed text-foreground/90">
          <HugeiconsIcon
            className="mt-px shrink-0 text-primary"
            icon={Alert02Icon}
            size={15}
          />
          Transfers are instant and can&apos;t be reversed. Make sure you know{" "}
          {recipient.name}.
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
            Confirm transfer
          </Button>
        }
        hints={[{ keys: ["Esc"], label: "Cancel" }]}
      />
    </>
  )
}

type TransferSuccessStepProps = {
  recipient: TransferRecipient
  asset: WalletAsset
  amount: number
  receipt: TransferReceipt
}

export function TransferSuccessStep({
  recipient,
  asset,
  amount,
  receipt,
}: TransferSuccessStepProps) {
  const badgeRef = useRef<HTMLSpanElement>(null)
  const hasCelebrated = useRef(false)

  useEffect(() => {
    if (hasCelebrated.current || !badgeRef.current) return
    hasCelebrated.current = true
    const rect = badgeRef.current.getBoundingClientRect()
    void celebrate({
      x: (rect.left + rect.width / 2) / window.innerWidth,
      y: (rect.top + rect.height / 2) / window.innerHeight,
    })
  }, [])

  return (
    <>
      <StepHeader backLabel="" symbol={asset.symbol} title="Transfer sent" />

      <DialogBody className="flex flex-col items-center gap-4 px-4 py-8 text-center">
        <span ref={badgeRef}>
          <IconBadge
            accent="var(--success)"
            className="size-12"
            icon={CheckmarkCircle02Icon}
          />
        </span>
        <div className="flex flex-col gap-1">
          <p className="font-mono text-2xl tracking-tight tabular-nums">
            {CRYPTO_AMOUNT.format(amount)} {asset.symbol}
          </p>
          <p className="text-xs text-muted-foreground">
            Sent to <span className="text-foreground">{recipient.name}</span>
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
