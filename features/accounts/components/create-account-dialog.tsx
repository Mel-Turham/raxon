"use client"

import { useRouter } from "next/navigation"
import { type ReactElement, useState, useTransition } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/toast"
import { AssetPicker, type WalletAsset } from "@/features/wallet"
import { StepTransition } from "@/shared/components/molecules/step-transition"
import { createAccount, sendVerificationCode } from "../actions"
import {
  ACCOUNT_COLORS,
  ACCOUNT_TYPES,
  VERIFICATION_RESEND_SECONDS,
} from "../constants"
import { normalizeAccountName } from "../helpers/account"
import type { AccountType, CreatedAccount } from "../types"
import { type AccountDetails, AccountDetailsStep } from "./account-details-step"
import { AccountFundingStep } from "./account-funding-step"
import { AccountReviewStep, AccountSuccessStep } from "./account-review-step"
import { AccountTypeStep } from "./account-type-step"

type CreateAccountState =
  | { step: "type" }
  | { step: "details" | "funding" | "asset" | "review"; type: AccountType }
  | { step: "done"; account: CreatedAccount }

const INITIAL_STATE: CreateAccountState = { step: "type" }

const initialDetails = (type: AccountType = "spot"): AccountDetails => ({
  name: "",
  color: ACCOUNT_COLORS[0],
  leverage: ACCOUNT_TYPES[type].defaultLeverage,
  marginMode: "cross",
})

type Verification = { sentTo: string; resendAt: number }

type CreateAccountDialogProps = {
  assets: WalletAsset[]
  accountNames: string[]
  trigger: ReactElement
}

export function CreateAccountDialog({
  assets,
  accountNames,
  trigger,
}: CreateAccountDialogProps) {
  const router = useRouter()
  const fundedAssets = assets.filter((asset) => asset.balance > 0)
  const [state, setState] = useState<CreateAccountState>(INITIAL_STATE)
  const [details, setDetails] = useState(() => initialDetails())
  const [fundingAsset, setFundingAsset] = useState(fundedAssets[0])
  const [fundingAmount, setFundingAmount] = useState("")
  const [withFunding, setWithFunding] = useState(false)
  const [riskAccepted, setRiskAccepted] = useState(false)
  const [code, setCode] = useState("")
  const [verification, setVerification] = useState<Verification | null>(null)
  const [pendingExit, setPendingExit] = useState<"skip" | "fund" | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const reset = () => {
    setState(INITIAL_STATE)
    setDetails(initialDetails())
    setFundingAsset(fundedAssets[0])
    setFundingAmount("")
    setWithFunding(false)
    setRiskAccepted(false)
    setCode("")
    setVerification(null)
    setError(null)
  }

  const requestCode = (onSent?: () => void) =>
    startTransition(async () => {
      const { sentTo } = await sendVerificationCode()
      setVerification({
        sentTo,
        resendAt: Date.now() + VERIFICATION_RESEND_SECONDS * 1000,
      })
      onSent?.()
    })

  const goToReview = (type: AccountType, fund: boolean) => {
    setWithFunding(fund)
    setPendingExit(fund ? "fund" : "skip")
    requestCode(() => {
      setPendingExit(null)
      setState({ step: "review", type })
    })
  }

  const confirm = () => {
    if (state.step !== "review") return
    const { type } = state
    setError(null)
    startTransition(async () => {
      const result = await createAccount({
        type,
        name: normalizeAccountName(details.name),
        color: details.color,
        leverage: details.leverage,
        marginMode: details.marginMode,
        funding: withFunding
          ? {
              symbol: fundingAsset.symbol,
              amount: Number.parseFloat(fundingAmount),
            }
          : undefined,
        riskAccepted,
        code,
      })
      if (!result.ok) {
        setError(result.error)
        return
      }
      setState({ step: "done", account: result.account })
      router.refresh()
      toast.success("Account created", {
        description: `${result.account.name} · UID ${result.account.uid}`,
      })
    })
  }

  return (
    <Dialog
      onOpenChangeComplete={(open) => {
        if (!open) reset()
      }}
    >
      <DialogTrigger render={trigger} />
      <DialogContent>
        <DialogDescription className="sr-only">
          Create a sub-account with its own balance and trading settings.
        </DialogDescription>
        <StepTransition step={state.step}>
          {state.step === "type" && (
            <AccountTypeStep
              color={details.color}
              onSelect={(type) => {
                setDetails({
                  ...details,
                  leverage: ACCOUNT_TYPES[type].defaultLeverage,
                })
                setRiskAccepted(false)
                setState({ step: "details", type })
              }}
            />
          )}

          {state.step === "details" && (
            <AccountDetailsStep
              details={details}
              onBack={() => setState(INITIAL_STATE)}
              onChange={setDetails}
              onContinue={() => setState({ ...state, step: "funding" })}
              takenNames={accountNames}
              type={state.type}
            />
          )}

          {state.step === "funding" && (
            <AccountFundingStep
              amount={fundingAmount}
              asset={fundingAsset}
              color={details.color}
              onAmountChange={setFundingAmount}
              onBack={() => setState({ ...state, step: "details" })}
              onContinue={() => goToReview(state.type, true)}
              onPickAsset={() => setState({ ...state, step: "asset" })}
              onSkip={() => goToReview(state.type, false)}
              pending={pendingExit}
              type={state.type}
            />
          )}

          {state.step === "asset" && (
            <>
              <DialogTitle className="sr-only">
                Choose funding asset
              </DialogTitle>
              <AssetPicker
                assets={fundedAssets}
                label="Search asset to fund with"
                onSelect={(asset) => {
                  setFundingAsset(asset)
                  setFundingAmount("")
                  setState({ ...state, step: "funding" })
                }}
                trailing={
                  <Button
                    className="h-6 px-2 text-xs text-muted-foreground"
                    onClick={() => setState({ ...state, step: "funding" })}
                    variant="ghost"
                  >
                    Cancel
                  </Button>
                }
              />
            </>
          )}

          {state.step === "review" && verification && (
            <AccountReviewStep
              code={code}
              details={details}
              error={error}
              funding={
                withFunding
                  ? {
                      symbol: fundingAsset.symbol,
                      amount: Number.parseFloat(fundingAmount),
                    }
                  : undefined
              }
              isPending={isPending}
              onBack={() => {
                setError(null)
                setState({ ...state, step: "funding" })
              }}
              onCodeChange={(next) => {
                setError(null)
                setCode(next)
              }}
              onConfirm={confirm}
              onResend={() => {
                setCode("")
                requestCode()
              }}
              onRiskChange={setRiskAccepted}
              resendAt={verification.resendAt}
              riskAccepted={riskAccepted}
              sentTo={verification.sentTo}
              type={state.type}
            />
          )}

          {state.step === "done" && (
            <AccountSuccessStep account={state.account} />
          )}
        </StepTransition>
      </DialogContent>
    </Dialog>
  )
}
