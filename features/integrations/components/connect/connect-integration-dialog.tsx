"use client"

import { useState, useTransition } from "react"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { toast } from "@/components/ui/toast"
import { StepTransition } from "@/shared/components/molecules/step-transition"
import { connectIntegration } from "../../actions"
import { needsAttention } from "../../helpers/integrations"
import type {
  ConnectIntegrationResult,
  Integration,
  IntegrationCredentials,
} from "../../types"
import { ConnectCredentialsStep } from "./connect-credentials-step"
import { ConnectOverviewStep } from "./connect-overview-step"
import { ConnectSuccessStep } from "./connect-success-step"

type ConnectSuccess = Extract<ConnectIntegrationResult, { ok: true }>

type ConnectState =
  | { step: "overview" }
  | { step: "credentials" }
  | { step: "done"; result: ConnectSuccess }

type ConnectIntegrationDialogProps = {
  integration: Integration
  open: boolean
  onOpenChange: (open: boolean) => void
  onClosed: () => void
  onConnected: (integration: Integration, result: ConnectSuccess) => void
}

export function ConnectIntegrationDialog({
  integration,
  open,
  onOpenChange,
  onClosed,
  onConnected,
}: ConnectIntegrationDialogProps) {
  const isReconnect = needsAttention(integration)
  const [state, setState] = useState<ConnectState>({
    step: isReconnect ? "credentials" : "overview",
  })
  const [error, setError] = useState<string | null>(null)
  const [isPending, startSubmit] = useTransition()

  const submit = (credentials: IntegrationCredentials) => {
    setError(null)
    startSubmit(async () => {
      const result = await connectIntegration({
        id: integration.id,
        credentials,
      })
      if (!result.ok) {
        setError(result.error)
        return
      }
      setState({ step: "done", result })
      onConnected(integration, result)
      toast.success(
        isReconnect
          ? `${integration.name} reconnected`
          : `${integration.name} connected`,
        { description: result.connection.account }
      )
    })
  }

  return (
    <Dialog
      onOpenChange={onOpenChange}
      onOpenChangeComplete={(isOpen) => {
        if (!isOpen) onClosed()
      }}
      open={open}
    >
      <DialogContent>
        <StepTransition step={state.step}>
          {state.step === "overview" && (
            <ConnectOverviewStep
              integration={integration}
              onContinue={() => setState({ step: "credentials" })}
            />
          )}

          {state.step === "credentials" && (
            <ConnectCredentialsStep
              error={error}
              integration={integration}
              isPending={isPending}
              isReconnect={isReconnect}
              onBack={
                isReconnect
                  ? undefined
                  : () => {
                      setError(null)
                      setState({ step: "overview" })
                    }
              }
              onSubmit={submit}
            />
          )}

          {state.step === "done" && (
            <ConnectSuccessStep
              integration={integration}
              result={state.result}
            />
          )}
        </StepTransition>
      </DialogContent>
    </Dialog>
  )
}
