"use client"

import {
  ArrowRight02Icon,
  Link01Icon,
  ShieldKeyIcon,
  WebhookIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { type FormEvent, type ReactNode, useState } from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DialogBody } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { DialogHints } from "@/shared/components/molecules/dialog-hints"
import { StepHeader } from "@/shared/components/molecules/step-header"
import { cn } from "@/shared/lib/utils"
import { INTEGRATION_SAFETY_NOTES } from "../../constants"
import {
  detectAddressNetwork,
  validateApiCredential,
  validateWalletAddress,
} from "../../helpers/credentials"
import type { Integration, IntegrationCredentials } from "../../types"
import { BrandLogo } from "@/shared/components/atoms/logos/brand-logo"

const FIELD =
  "h-11 border-foreground/10 bg-muted font-mono text-sm md:text-sm dark:bg-muted"

type ConnectCredentialsStepProps = {
  integration: Integration
  isReconnect: boolean
  isPending: boolean
  error: string | null
  onBack?: () => void
  onSubmit: (credentials: IntegrationCredentials) => void
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string
  label: string
  error: string | null
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs text-muted-foreground" htmlFor={id}>
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

export function ConnectCredentialsStep({
  integration,
  isReconnect,
  isPending,
  error,
  onBack,
  onSubmit,
}: ConnectCredentialsStepProps) {
  const [apiKey, setApiKey] = useState("")
  const [apiSecret, setApiSecret] = useState("")
  const [allowTrading, setAllowTrading] = useState(false)
  const [withdrawalsDisabled, setWithdrawalsDisabled] = useState(false)
  const [address, setAddress] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const method = integration.auth
  const canTrade = integration.permissions.includes("trade")
  const network = detectAddressNetwork(address)

  const fieldErrors = {
    apiKey: validateApiCredential(apiKey, "API key"),
    apiSecret: validateApiCredential(apiSecret, "API secret"),
    withdrawals: withdrawalsDisabled
      ? null
      : "Confirm that withdrawals are disabled on this key.",
    address: validateWalletAddress(address),
  }

  const show = (message: string | null) => (submitted ? message : null)

  const credentials = (): IntegrationCredentials | null => {
    if (method === "api-key") {
      if (
        fieldErrors.apiKey ||
        fieldErrors.apiSecret ||
        fieldErrors.withdrawals
      )
        return null
      return {
        method,
        apiKey,
        apiSecret,
        allowTrading: canTrade && allowTrading,
        withdrawalsDisabled,
      }
    }
    if (method === "address") {
      return fieldErrors.address ? null : { method, address }
    }
    return { method }
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    setSubmitted(true)
    const value = credentials()
    if (value) onSubmit(value)
  }

  const pasteAddress = async () => {
    try {
      setAddress((await navigator.clipboard.readText()).trim())
    } catch {
      setAddress("")
    }
  }

  const submitLabel = {
    "api-key": isReconnect ? "Reconnect" : "Connect",
    address: "Add wallet",
    oauth: `Continue with ${integration.name}`,
    webhook: "Generate webhook",
  }[method]

  return (
    <form className="flex min-h-0 flex-col" noValidate onSubmit={submit}>
      <StepHeader
        backLabel="Back to overview"
        detail={isReconnect ? "Reconnect" : undefined}
        leading={<BrandLogo className="size-7" logo={integration.logo} />}
        onBack={onBack}
        title={integration.name}
      />

      <DialogBody className="flex flex-col gap-5 p-4">
        {method === "api-key" && (
          <>
            <p className="text-xs leading-5 text-muted-foreground">
              Create an API key in your {integration.name} account under{" "}
              <span className="text-foreground">API management</span>, with read
              access enabled and withdrawals disabled.
            </p>
            <Field
              error={show(fieldErrors.apiKey)}
              id="integration-api-key"
              label="API key"
            >
              <Input
                aria-invalid={Boolean(show(fieldErrors.apiKey))}
                autoComplete="off"
                autoFocus
                className={FIELD}
                id="integration-api-key"
                onChange={(event) => setApiKey(event.target.value.trim())}
                placeholder="Paste your API key"
                spellCheck={false}
                value={apiKey}
              />
            </Field>
            <Field
              error={show(fieldErrors.apiSecret)}
              id="integration-api-secret"
              label="API secret"
            >
              <Input
                aria-invalid={Boolean(show(fieldErrors.apiSecret))}
                autoComplete="off"
                className={FIELD}
                id="integration-api-secret"
                onChange={(event) => setApiSecret(event.target.value.trim())}
                placeholder="Paste your API secret"
                spellCheck={false}
                type="password"
                value={apiSecret}
              />
            </Field>

            {canTrade && (
              <label
                className="flex cursor-pointer items-center justify-between gap-4 border border-border p-3"
                htmlFor="integration-allow-trading"
              >
                <span className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">Allow trading</span>
                  <span className="text-xs text-muted-foreground">
                    Let Raxon place orders you confirm. Leave off for read-only.
                  </span>
                </span>
                <Switch
                  checked={allowTrading}
                  id="integration-allow-trading"
                  onCheckedChange={setAllowTrading}
                />
              </label>
            )}

            <div className="flex flex-col gap-2">
              <label
                className="flex cursor-pointer items-start gap-2.5 text-xs leading-5"
                htmlFor="integration-withdrawals"
              >
                <Checkbox
                  aria-invalid={Boolean(show(fieldErrors.withdrawals))}
                  checked={withdrawalsDisabled}
                  className="mt-0.5"
                  id="integration-withdrawals"
                  onCheckedChange={setWithdrawalsDisabled}
                />
                I confirm withdrawals are disabled on this API key.
              </label>
              {show(fieldErrors.withdrawals) && (
                <p className="text-xs text-destructive">
                  {fieldErrors.withdrawals}
                </p>
              )}
            </div>
          </>
        )}

        {method === "address" && (
          <Field
            error={show(fieldErrors.address)}
            id="integration-address"
            label="Public wallet address"
          >
            <div className="relative">
              <Input
                aria-invalid={Boolean(show(fieldErrors.address))}
                autoComplete="off"
                autoFocus
                className={cn(FIELD, "pr-16")}
                id="integration-address"
                onChange={(event) => setAddress(event.target.value.trim())}
                placeholder="0x…, bc1… or Solana address"
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
            {network && (
              <p className="text-xs text-success">{network} address detected</p>
            )}
          </Field>
        )}

        {(method === "oauth" || method === "webhook") && (
          <div className="flex items-start gap-3 border border-border p-4">
            <span className="flex size-9 shrink-0 items-center justify-center bg-muted text-muted-foreground shadow-(--icon-surface-shadow)">
              <HugeiconsIcon
                icon={method === "oauth" ? Link01Icon : WebhookIcon}
                size={17}
              />
            </span>
            <p className="text-xs leading-5 text-muted-foreground">
              {method === "oauth"
                ? `You'll approve access on ${integration.name}, then come straight back to Raxon.`
                : `Raxon will create a signed endpoint. Paste it in ${integration.name} to start sending events.`}
            </p>
          </div>
        )}

        <p className="flex items-start gap-2.5 text-xs leading-5 text-muted-foreground">
          <HugeiconsIcon
            className="mt-0.5 shrink-0"
            icon={ShieldKeyIcon}
            size={15}
          />
          {INTEGRATION_SAFETY_NOTES[method]}
        </p>

        {error && (
          <p className="border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
            {error}
          </p>
        )}
      </DialogBody>

      <DialogHints
        action={
          <Button loading={isPending} size="sm" type="submit">
            {submitLabel}
            <HugeiconsIcon icon={ArrowRight02Icon} />
          </Button>
        }
        hints={[
          { keys: ["Enter"], label: "Submit" },
          { keys: ["Esc"], label: "Cancel" },
        ]}
      />
    </form>
  )
}
