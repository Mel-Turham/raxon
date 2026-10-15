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
import { findRecipient, submitTransfer } from "../actions"
import type { TransferReceipt, TransferRecipient, WalletAsset } from "../types"
import { AssetPicker } from "./asset-picker"
import { type TransferDraft, TransferAmountStep } from "./transfer-amount-step"
import { TransferRecipientStep } from "./transfer-recipient-step"
import { TransferReviewStep, TransferSuccessStep } from "./transfer-review-step"
import { CRYPTO_AMOUNT } from "@/shared/lib/format"

type TransferState =
  | { step: "recipient" }
  | { step: "amount" | "asset" | "review"; recipient: TransferRecipient }
  | {
      step: "done"
      recipient: TransferRecipient
      amount: number
      receipt: TransferReceipt
    }

const INITIAL_STATE: TransferState = { step: "recipient" }

const initialDraft = (assets: WalletAsset[]): TransferDraft => ({
  asset: assets[0],
  amount: "",
  note: "",
})

type TransferDialogProps = {
  assets: WalletAsset[]
  contacts: TransferRecipient[]
  trigger: ReactElement
}

export function TransferDialog({
  assets,
  contacts,
  trigger,
}: TransferDialogProps) {
  const fundedAssets = assets.filter((asset) => asset.balance > 0)
  const [state, setState] = useState<TransferState>(INITIAL_STATE)
  const [draft, setDraft] = useState(() => initialDraft(fundedAssets))
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const lookup = (query: string) => {
    setError(null)
    startTransition(async () => {
      const result = await findRecipient(query)
      if (!result.ok) {
        setError(result.error)
        return
      }
      setState({ step: "amount", recipient: result.recipient })
    })
  }

  const confirm = () => {
    if (state.step !== "review") return
    const { recipient } = state
    const amount = Number.parseFloat(draft.amount)
    setError(null)
    startTransition(async () => {
      const result = await submitTransfer({
        recipientId: recipient.id,
        symbol: draft.asset.symbol,
        amount,
        note: draft.note.trim() || undefined,
      })
      if (!result.ok) {
        setError(result.error)
        return
      }
      setState({ step: "done", recipient, amount, receipt: result.receipt })
      toast.success("Transfer sent", {
        description: `${CRYPTO_AMOUNT.format(amount)} ${draft.asset.symbol} to ${recipient.name} · ${result.receipt.reference}`,
      })
    })
  }

  return (
    <Dialog
      onOpenChangeComplete={(open) => {
        if (open) return
        setState(INITIAL_STATE)
        setDraft(initialDraft(fundedAssets))
        setError(null)
      }}
    >
      <DialogTrigger render={trigger} />
      <DialogContent>
        <StepTransition step={state.step}>
          <DialogDescription className="sr-only">
            Send crypto instantly to another Raxon user, free of charge.
          </DialogDescription>

          {state.step === "recipient" && (
            <>
              <DialogTitle className="sr-only">Transfer</DialogTitle>
              <TransferRecipientStep
                contacts={contacts}
                error={error}
                isSearching={isPending}
                onLookup={lookup}
                onQueryChange={() => setError(null)}
                onSelect={(recipient) =>
                  setState({ step: "amount", recipient })
                }
              />
            </>
          )}

          {state.step === "amount" && (
            <TransferAmountStep
              draft={draft}
              onBack={() => setState(INITIAL_STATE)}
              onChange={setDraft}
              onContinue={() => setState({ ...state, step: "review" })}
              onPickAsset={() => setState({ ...state, step: "asset" })}
              recipient={state.recipient}
            />
          )}

          {state.step === "asset" && (
            <>
              <DialogTitle className="sr-only">
                Choose asset to send
              </DialogTitle>
              <AssetPicker
                assets={fundedAssets}
                label="Search asset to send"
                onSelect={(asset) => {
                  setDraft({ ...draft, asset, amount: "" })
                  setState({ ...state, step: "amount" })
                }}
                trailing={
                  <Button
                    className="h-6 px-2 text-xs text-muted-foreground"
                    onClick={() => setState({ ...state, step: "amount" })}
                    variant="ghost"
                  >
                    Cancel
                  </Button>
                }
              />
            </>
          )}

          {state.step === "review" && (
            <TransferReviewStep
              amount={Number.parseFloat(draft.amount)}
              asset={draft.asset}
              error={error}
              isSubmitting={isPending}
              note={draft.note}
              onBack={() => {
                setError(null)
                setState({ ...state, step: "amount" })
              }}
              onConfirm={confirm}
              recipient={state.recipient}
            />
          )}

          {state.step === "done" && (
            <TransferSuccessStep
              amount={state.amount}
              asset={draft.asset}
              receipt={state.receipt}
              recipient={state.recipient}
            />
          )}
        </StepTransition>
      </DialogContent>
    </Dialog>
  )
}
