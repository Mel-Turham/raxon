"use client"

import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons"

import { useSecondsLeft } from "@/shared/hooks/use-seconds-left"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DialogBody, DialogClose } from "@/components/ui/dialog"
import { IconBadge } from "@/shared/components/atoms/icon-badge"
import { CodeInput } from "@/shared/components/molecules/code-input"
import { DialogHints } from "@/shared/components/molecules/dialog-hints"
import { StepHeader } from "@/shared/components/molecules/step-header"
import { CRYPTO_AMOUNT } from "@/shared/lib/format"
import {
  ACCOUNT_TYPES,
  DEMO_VERIFICATION_CODE,
  MARGIN_MODES,
  VERIFICATION_CODE_LENGTH,
} from "../constants"
import { normalizeAccountName } from "../helpers/account"
import type { AccountFunding, AccountType, CreatedAccount } from "../types"
import { AccountBadge } from "./account-badge"
import type { AccountDetails } from "./account-details-step"
import { ReviewRow } from "@/shared/components/molecules/review-row"

type AccountReviewStepProps = {
  type: AccountType
  details: AccountDetails
  funding?: AccountFunding
  code: string
  riskAccepted: boolean
  sentTo: string
  resendAt: number
  error: string | null
  isPending: boolean
  onBack: () => void
  onCodeChange: (code: string) => void
  onRiskChange: (accepted: boolean) => void
  onResend: () => void
  onConfirm: () => void
}

export function AccountReviewStep({
  type,
  details,
  funding,
  code,
  riskAccepted,
  sentTo,
  resendAt,
  error,
  isPending,
  onBack,
  onCodeChange,
  onRiskChange,
  onResend,
  onConfirm,
}: AccountReviewStepProps) {
  const config = ACCOUNT_TYPES[type]
  const resendIn = useSecondsLeft(resendAt)
  const canConfirm =
    code.length === VERIFICATION_CODE_LENGTH &&
    (!config.leveraged || riskAccepted)

  return (
    <>
      <StepHeader
        backLabel="Back to funding"
        detail="Step 4 of 4"
        leading={
          <AccountBadge
            className="size-6"
            color={details.color}
            iconSize={14}
            shared
            type={type}
          />
        }
        onBack={isPending ? undefined : onBack}
        title="Review account"
      />

      <DialogBody className="flex flex-col gap-5 p-4">
        <div className="flex items-center gap-3 border border-foreground/10 bg-muted/40 p-3">
          <AccountBadge className="size-10" color={details.color} type={type} />
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium">
              {normalizeAccountName(details.name)}
            </span>
            <span className="text-xs text-muted-foreground">
              {config.label} sub-account
            </span>
          </div>
        </div>

        <dl className="flex flex-col divide-y divide-foreground/8 text-xs">
          <ReviewRow label="Type">{config.label}</ReviewRow>
          {config.leveraged && (
            <>
              <ReviewRow label="Default leverage">
                <span className="font-mono tabular-nums">
                  {details.leverage}×
                </span>
              </ReviewRow>
              <ReviewRow label="Margin mode">
                {MARGIN_MODES[details.marginMode].label}
              </ReviewRow>
            </>
          )}
          <ReviewRow label="Initial funding">
            {funding ? (
              <span className="font-mono tabular-nums">
                {CRYPTO_AMOUNT.format(funding.amount)} {funding.symbol}
              </span>
            ) : (
              <span className="text-muted-foreground">None, fund later</span>
            )}
          </ReviewRow>
        </dl>

        {config.leveraged && (
          <label className="flex cursor-pointer gap-2.5 border border-primary/25 bg-primary/5 p-3 text-xs leading-relaxed text-foreground/90">
            <Checkbox
              checked={riskAccepted}
              className="mt-0.5"
              onCheckedChange={(checked) => onRiskChange(checked === true)}
            />
            I understand that trading with leverage can lose more than my
            initial margin and that positions may be liquidated.
          </label>
        )}

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <label htmlFor="verification-code">Verification code</label>
            <span>
              Sent to <span className="text-foreground">{sentTo}</span>
            </span>
          </div>
          <CodeInput
            autoFocus={!config.leveraged}
            id="verification-code"
            invalid={Boolean(error)}
            length={VERIFICATION_CODE_LENGTH}
            onChange={onCodeChange}
            value={code}
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Demo code:{" "}
              <span className="font-mono text-foreground">
                {DEMO_VERIFICATION_CODE}
              </span>
            </span>
            <button
              className="font-medium text-primary transition-colors hover:text-primary/80 disabled:text-muted-foreground"
              disabled={resendIn > 0 || isPending}
              onClick={onResend}
              type="button"
            >
              {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend code"}
            </button>
          </div>
        </div>

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
            disabled={!canConfirm}
            loading={isPending}
            onClick={onConfirm}
          >
            Create account
          </Button>
        }
        hints={[{ keys: ["Esc"], label: "Cancel" }]}
      />
    </>
  )
}

export function AccountSuccessStep({ account }: { account: CreatedAccount }) {
  const config = ACCOUNT_TYPES[account.type]

  return (
    <>
      <StepHeader
        backLabel=""
        leading={
          <AccountBadge
            className="size-6"
            color={account.color}
            iconSize={14}
            shared
            type={account.type}
          />
        }
        title="Account created"
      />

      <DialogBody className="flex flex-col items-center gap-4 px-4 py-8 text-center">
        <IconBadge
          accent="var(--success)"
          className="size-12"
          icon={CheckmarkCircle02Icon}
        />
        <div className="flex flex-col gap-1">
          <p className="text-2xl font-medium tracking-tight">{account.name}</p>
          <p className="text-xs text-muted-foreground">
            {config.label} sub-account
            {config.leveraged && ` · ${account.leverage}× default leverage`}
          </p>
        </div>
        <dl className="grid w-full grid-cols-3 border border-foreground/10 text-xs">
          <div className="flex flex-col gap-1 border-r border-foreground/10 p-3">
            <dt className="text-muted-foreground">UID</dt>
            <dd className="font-mono">{account.uid}</dd>
          </div>
          <div className="flex flex-col gap-1 border-r border-foreground/10 p-3">
            <dt className="text-muted-foreground">Funding</dt>
            <dd className="font-mono">
              {account.funding
                ? `${CRYPTO_AMOUNT.format(account.funding.amount)} ${account.funding.symbol}`
                : "—"}
            </dd>
          </div>
          <div className="flex flex-col gap-1 p-3">
            <dt className="text-muted-foreground">Status</dt>
            <dd className="text-success">Active</dd>
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
