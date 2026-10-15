"use client"

import { Alert02Icon, Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { QRCodeSVG } from "qrcode.react"
import { type ReactNode, use, useEffect, useEffectEvent } from "react"

import { Button } from "@/components/ui/button"
import { DialogBody, DialogClose } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import type { DepositAddressResult } from "../actions"
import { networkLabel } from "../helpers/network"
import type { AssetNetwork, WalletAsset } from "../types"
import { DialogHints } from "@/shared/components/molecules/dialog-hints"
import { StepHeader } from "@/shared/components/molecules/step-header"
import { useCopyToClipboard } from "@/shared/hooks/use-copy-to-clipboard"

const AMOUNT = new Intl.NumberFormat("en-US", { maximumFractionDigits: 6 })

type DepositAddressStepProps = {
  asset: WalletAsset
  network: AssetNetwork
  onBack: () => void
  children: ReactNode
}

export function DepositAddressStep({
  asset,
  network,
  onBack,
  children,
}: DepositAddressStepProps) {
  const label = networkLabel(network)

  const onBackKey = useEffectEvent((event: KeyboardEvent) => {
    if (event.key === "Backspace") onBack()
  })

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => onBackKey(event)
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <>
      <StepHeader
        backLabel="Back to networks"
        detail={label}
        onBack={onBack}
        symbol={asset.symbol}
        title={`Deposit ${asset.symbol}`}
      />

      <DialogBody className="flex flex-col gap-4 p-4">
        {children}

        <dl className="grid grid-cols-3 gap-3 border border-foreground/10 p-3 text-xs">
          <div className="flex flex-col gap-1">
            <dt className="text-muted-foreground">Minimum deposit</dt>
            <dd className="font-mono tabular-nums">
              {AMOUNT.format(network.minDeposit)} {asset.symbol}
            </dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-muted-foreground">Expected arrival</dt>
            <dd>~{network.arrivalMinutes} min</dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-muted-foreground">Confirmations</dt>
            <dd className="font-mono tabular-nums">{network.confirmations}</dd>
          </div>
        </dl>

        <p className="flex gap-2.5 border border-primary/25 bg-primary/5 p-3 text-xs leading-relaxed text-foreground/90">
          <HugeiconsIcon
            className="mt-px shrink-0 text-primary"
            icon={Alert02Icon}
            size={15}
          />
          <span>
            Send only <strong>{asset.symbol}</strong> on{" "}
            <strong>{label}</strong> to this address. Other assets or networks
            will result in a permanent loss of funds.
          </span>
        </p>
      </DialogBody>

      <DialogHints
        action={
          <DialogClose render={<Button className="h-8 px-4" />}>
            Done
          </DialogClose>
        }
        hints={[{ keys: ["⌫"], label: "Back" }]}
      />
    </>
  )
}

export function DepositAddressCard({
  addressPromise,
}: {
  addressPromise: Promise<DepositAddressResult>
}) {
  const result = use(addressPromise)
  const { copiedValue, copy } = useCopyToClipboard()

  if (!result.ok) {
    return (
      <p className="border border-destructive/30 bg-destructive/5 p-4 text-xs text-destructive">
        {result.error}
      </p>
    )
  }

  const { address } = result.data
  const copied = copiedValue === address

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
      <div className="shrink-0 bg-white p-2.5 shadow-(--icon-surface-shadow)">
        <QRCodeSVG level="M" size={128} value={address} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <span className="text-xs text-muted-foreground">Deposit address</span>
        <p className="font-mono text-sm leading-relaxed break-all">{address}</p>
        <Button
          className="mt-1 w-fit"
          onClick={() =>
            copy(address, { label: "Address", description: address })
          }
          size="sm"
          variant="outline"
        >
          <HugeiconsIcon icon={copied ? Tick02Icon : Copy01Icon} size={14} />
          {copied ? "Copied" : "Copy address"}
        </Button>
      </div>
    </div>
  )
}

export function DepositAddressSkeleton() {
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
      <Skeleton className="size-37 shrink-0" />
      <div className="flex w-full flex-1 flex-col gap-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="mt-1 h-7 w-32" />
      </div>
    </div>
  )
}
