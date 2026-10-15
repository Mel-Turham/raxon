"use client"

import { type ReactElement, useState, useTransition } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { StepTransition } from "@/shared/components/molecules/step-transition"
import { toast } from "@/components/ui/toast"
import { getSwapQuote, submitSwap } from "../actions"
import type { SwapQuote, SwapReceipt, WalletAsset } from "../types"
import { AssetPicker } from "./asset-picker"
import { type SwapDraft, SwapFormStep } from "./swap-form-step"
import { SwapReviewStep, SwapSuccessStep } from "./swap-review-step"
import { CRYPTO_AMOUNT } from "@/shared/lib/format"

type SwapState =
  | { step: "form" }
  | { step: "pick"; side: "from" | "to" }
  | { step: "review"; quote: SwapQuote }
  | { step: "done"; amount: number; receipt: SwapReceipt }

const INITIAL_STATE: SwapState = { step: "form" }

const initialDraft = (assets: WalletAsset[]): SwapDraft => {
  const from = assets.find((asset) => asset.balance > 0) ?? assets[0]
  const to =
    assets.find((asset) => asset !== from && asset.symbol === "USDT") ??
    assets.find((asset) => asset !== from) ??
    from
  return { from, to, amount: "" }
}

type SwapDialogProps = {
  assets: WalletAsset[]
  trigger: ReactElement
}

export function SwapDialog({ assets, trigger }: SwapDialogProps) {
  const [state, setState] = useState<SwapState>(INITIAL_STATE)
  const [draft, setDraft] = useState(() => initialDraft(assets))
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const updateDraft = (next: SwapDraft) => {
    setError(null)
    setDraft(next)
  }

  const pick = (side: "from" | "to", asset: WalletAsset) => {
    updateDraft(
      side === "from"
        ? {
            from: asset,
            to: asset === draft.to ? draft.from : draft.to,
            amount: "",
          }
        : { ...draft, to: asset }
    )
    setState(INITIAL_STATE)
  }

  const requestQuote = () => {
    setError(null)
    startTransition(async () => {
      const result = await getSwapQuote({
        from: draft.from.symbol,
        to: draft.to.symbol,
        amount: Number.parseFloat(draft.amount),
      })
      if (!result.ok) {
        setError(result.error)
        return
      }
      setState({ step: "review", quote: result.quote })
    })
  }

  const confirm = () => {
    if (state.step !== "review") return
    const { quote } = state
    setError(null)
    startTransition(async () => {
      const result = await submitSwap(quote.id)
      if (!result.ok) {
        setError(result.error)
        return
      }
      setState({ step: "done", amount: quote.amount, receipt: result.receipt })
      toast.success("Swap completed", {
        description: `${CRYPTO_AMOUNT.format(quote.amount)} ${draft.from.symbol} → ${CRYPTO_AMOUNT.format(result.receipt.receive)} ${draft.to.symbol}`,
      })
    })
  }

  return (
    <Dialog
      onOpenChangeComplete={(open) => {
        if (open) return
        setState(INITIAL_STATE)
        setDraft(initialDraft(assets))
        setError(null)
      }}
    >
      <DialogTrigger render={trigger} />
      <DialogContent>
        <StepTransition step={state.step}>
          <DialogDescription className="sr-only">
            Convert one asset into another at a locked rate.
          </DialogDescription>

          {state.step === "form" && (
            <SwapFormStep
              draft={draft}
              error={error}
              isQuoting={isPending}
              onChange={updateDraft}
              onPick={(side) => setState({ step: "pick", side })}
              onPreview={requestQuote}
            />
          )}

          {state.step === "pick" && (
            <>
              <DialogTitle className="sr-only">
                {state.side === "from" ? "Swap from" : "Swap to"}
              </DialogTitle>
              <AssetPicker
                assets={
                  state.side === "from"
                    ? assets.filter((asset) => asset.balance > 0)
                    : assets.filter((asset) => asset !== draft.from)
                }
                label={
                  state.side === "from"
                    ? "Search asset to swap from"
                    : "Search asset to receive"
                }
                onSelect={(asset) => pick(state.side, asset)}
                trailing={
                  <Button
                    className="h-6 px-2 text-xs text-muted-foreground"
                    onClick={() => setState(INITIAL_STATE)}
                    variant="ghost"
                  >
                    Cancel
                  </Button>
                }
              />
            </>
          )}

          {state.step === "review" && (
            <SwapReviewStep
              error={error}
              from={draft.from}
              isPending={isPending}
              onBack={() => {
                setError(null)
                setState(INITIAL_STATE)
              }}
              onConfirm={confirm}
              onRefresh={requestQuote}
              quote={state.quote}
              to={draft.to}
            />
          )}

          {state.step === "done" && (
            <SwapSuccessStep
              amount={state.amount}
              from={draft.from}
              receipt={state.receipt}
              to={draft.to}
            />
          )}
        </StepTransition>
      </DialogContent>
    </Dialog>
  )
}
