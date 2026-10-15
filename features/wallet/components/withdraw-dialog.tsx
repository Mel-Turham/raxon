"use client"

import { type ReactElement, useState, useTransition } from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { StepTransition } from "@/shared/components/molecules/step-transition"
import { Kbd } from "@/components/ui/kbd"
import { toast } from "@/components/ui/toast"
import { submitWithdrawal } from "../actions"
import type { AssetNetwork, WalletAsset, WithdrawalReceipt } from "../types"
import { AssetPicker } from "./asset-picker"
import { NetworkStep } from "./network-step"
import {
  type WithdrawDraft,
  WithdrawDetailsStep,
} from "./withdraw-details-step"
import { WithdrawReviewStep, WithdrawSuccessStep } from "./withdraw-review-step"
import { CRYPTO_AMOUNT } from "@/shared/lib/format"

type WithdrawState =
  | { step: "asset" }
  | { step: "network"; asset: WalletAsset }
  | {
      step: "details"
      asset: WalletAsset
      network: AssetNetwork
      draft?: WithdrawDraft
    }
  | {
      step: "review"
      asset: WalletAsset
      network: AssetNetwork
      draft: WithdrawDraft
    }
  | {
      step: "done"
      asset: WalletAsset
      address: string
      receipt: WithdrawalReceipt
    }

const INITIAL_STATE: WithdrawState = { step: "asset" }

type WithdrawDialogProps = {
  assets: WalletAsset[]
  trigger: ReactElement
}

export function WithdrawDialog({ assets, trigger }: WithdrawDialogProps) {
  const [state, setState] = useState<WithdrawState>(INITIAL_STATE)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, startSubmit] = useTransition()
  const fundedAssets = assets.filter((asset) => asset.balance > 0)

  const confirm = () => {
    if (state.step !== "review") return
    const { asset, network, draft } = state
    setError(null)
    startSubmit(async () => {
      const result = await submitWithdrawal({
        symbol: asset.symbol,
        network: network.id,
        address: draft.address,
        amount: Number.parseFloat(draft.amount),
      })
      if (!result.ok) {
        setError(result.error)
        return
      }
      setState({
        step: "done",
        asset,
        address: draft.address,
        receipt: result.receipt,
      })
      toast.success("Withdrawal submitted", {
        description: `${CRYPTO_AMOUNT.format(result.receipt.receive)} ${asset.symbol} · ${result.receipt.reference}`,
      })
    })
  }

  return (
    <Dialog
      onOpenChangeComplete={(open) => {
        if (open) return
        setState(INITIAL_STATE)
        setError(null)
      }}
    >
      <DialogTrigger render={trigger} />
      <DialogContent>
        <StepTransition step={state.step}>
          {(state.step === "asset" || state.step === "network") && (
            <>
              <DialogTitle className="sr-only">Withdraw crypto</DialogTitle>
              <DialogDescription className="sr-only">
                Choose an asset, a network and a recipient address.
              </DialogDescription>
            </>
          )}

          {state.step === "asset" && (
            <AssetPicker
              assets={fundedAssets}
              label="Search asset to withdraw"
              onSelect={(asset) => setState({ step: "network", asset })}
              trailing={<Kbd>Esc</Kbd>}
            />
          )}

          {state.step === "network" && (
            <NetworkStep
              asset={state.asset}
              note="The recipient must support this network, or funds will be lost."
              onBack={() => setState(INITIAL_STATE)}
              onSelect={(network) =>
                setState({ step: "details", asset: state.asset, network })
              }
              renderMeta={(network) => (
                <>
                  <span className="font-mono text-foreground tabular-nums">
                    Fee {CRYPTO_AMOUNT.format(network.withdrawFee)}{" "}
                    {state.asset.symbol}
                  </span>
                  <span className="text-muted-foreground">
                    ~{network.arrivalMinutes} min
                  </span>
                </>
              )}
            />
          )}

          {state.step === "details" && (
            <WithdrawDetailsStep
              asset={state.asset}
              draft={state.draft}
              network={state.network}
              onBack={() => setState({ step: "network", asset: state.asset })}
              onContinue={(draft) =>
                setState({ ...state, step: "review", draft })
              }
            />
          )}

          {state.step === "review" && (
            <WithdrawReviewStep
              address={state.draft.address}
              amount={Number.parseFloat(state.draft.amount)}
              asset={state.asset}
              error={error}
              isSubmitting={isSubmitting}
              network={state.network}
              onBack={() => {
                setError(null)
                setState({ ...state, step: "details" })
              }}
              onConfirm={confirm}
            />
          )}

          {state.step === "done" && (
            <WithdrawSuccessStep
              address={state.address}
              asset={state.asset}
              receipt={state.receipt}
            />
          )}
        </StepTransition>
      </DialogContent>
    </Dialog>
  )
}
