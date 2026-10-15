"use client"

import { ArrowRight02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { DialogBody } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { AnimatedNumber } from "@/shared/components/atoms/animated-number"
import { CRYPTO_AMOUNT_FORMAT, USD_FORMAT } from "@/shared/lib/format"
import { cn } from "@/shared/lib/utils"
import { networkLabel } from "../helpers/network"
import {
  validateAddress,
  validateAmount,
  withdrawalReceive,
} from "../helpers/withdraw"
import type { AssetNetwork, WalletAsset } from "../types"
import { DialogHints } from "@/shared/components/molecules/dialog-hints"
import { StepHeader } from "@/shared/components/molecules/step-header"

const FIELD =
  "h-11 border-foreground/10 bg-muted font-mono text-sm md:text-sm dark:bg-muted"

export type WithdrawDraft = {
  address: string
  amount: string
}

type WithdrawDetailsStepProps = {
  asset: WalletAsset
  network: AssetNetwork
  draft?: WithdrawDraft
  onBack: () => void
  onContinue: (draft: WithdrawDraft) => void
}

export function WithdrawDetailsStep({
  asset,
  network,
  draft,
  onBack,
  onContinue,
}: WithdrawDetailsStepProps) {
  const [address, setAddress] = useState(draft?.address ?? "")
  const [amount, setAmount] = useState(draft?.amount ?? "")
  const numericAmount = Number.parseFloat(amount) || 0
  const addressError = address ? validateAddress(address, network) : null
  const amountError = amount
    ? validateAmount(numericAmount, asset, network)
    : null
  const canContinue =
    Boolean(address && amount) && !addressError && !amountError
  const receive = withdrawalReceive(numericAmount, network)

  const pasteAddress = async () => {
    try {
      setAddress((await navigator.clipboard.readText()).trim())
    } catch {
      setAddress("")
    }
  }

  return (
    <>
      <StepHeader
        backLabel="Back to networks"
        detail={networkLabel(network)}
        onBack={onBack}
        symbol={asset.symbol}
        title={`Withdraw ${asset.symbol}`}
      />

      <DialogBody className="flex flex-col gap-5 p-4">
        <div className="flex flex-col gap-2">
          <label
            className="text-xs text-muted-foreground"
            htmlFor="withdraw-address"
          >
            Recipient address
          </label>
          <div className="relative">
            <Input
              aria-invalid={Boolean(addressError)}
              autoComplete="off"
              autoFocus
              className={cn(FIELD, "pr-16")}
              id="withdraw-address"
              onChange={(event) => setAddress(event.target.value.trim())}
              placeholder={`${networkLabel(network)} address`}
              spellCheck={false}
              value={address}
            />
            <button
              className="absolute inset-y-0 right-3 text-xs font-medium text-primary transition-colors hover:text-primary/80"
              onClick={pasteAddress}
              type="button"
            >
              Paste
            </button>
          </div>
          {addressError && (
            <p className="text-xs text-destructive">{addressError}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <label className="text-muted-foreground" htmlFor="withdraw-amount">
              Amount
            </label>
            <span className="text-muted-foreground">
              Available{" "}
              <AnimatedNumber
                className="font-mono text-foreground"
                format={CRYPTO_AMOUNT_FORMAT}
                suffix={` ${asset.symbol}`}
                value={asset.balance}
              />
            </span>
          </div>
          <div className="relative">
            <Input
              aria-invalid={Boolean(amountError)}
              className={cn(FIELD, "pr-28")}
              id="withdraw-amount"
              inputMode="decimal"
              onChange={(event) =>
                setAmount(event.target.value.replace(/[^\d.]/g, ""))
              }
              placeholder={`Min ${network.minWithdraw}`}
              value={amount}
            />
            <div className="absolute inset-y-0 right-3 flex items-center gap-3 text-xs">
              <span className="text-muted-foreground">{asset.symbol}</span>
              <button
                className="font-medium text-primary transition-colors hover:text-primary/80"
                onClick={() => setAmount(String(asset.balance))}
                type="button"
              >
                Max
              </button>
            </div>
          </div>
          {amountError ? (
            <p className="text-xs text-destructive">{amountError}</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              ≈{" "}
              <AnimatedNumber
                format={USD_FORMAT}
                value={numericAmount * asset.price}
              />
            </p>
          )}
        </div>

        <dl className="flex flex-col gap-2.5 border border-foreground/10 p-3 text-xs">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Network fee</dt>
            <dd className="font-mono tabular-nums">
              {network.withdrawFee} {asset.symbol}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Expected arrival</dt>
            <dd>~{network.arrivalMinutes} min</dd>
          </div>
          <div className="flex items-baseline justify-between border-t border-foreground/10 pt-2.5">
            <dt className="text-muted-foreground">You will receive</dt>
            <dd className="font-mono text-sm font-medium tabular-nums">
              <AnimatedNumber
                format={CRYPTO_AMOUNT_FORMAT}
                suffix={` ${asset.symbol}`}
                value={receive}
              />
            </dd>
          </div>
        </dl>
      </DialogBody>

      <DialogHints
        action={
          <Button
            className="h-8 px-4"
            disabled={!canContinue}
            onClick={() => onContinue({ address, amount })}
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
