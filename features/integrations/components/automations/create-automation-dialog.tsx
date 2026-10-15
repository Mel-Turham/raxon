"use client"

import { useState, useTransition } from "react"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { toast } from "@/components/ui/toast"
import { StepTransition } from "@/shared/components/molecules/step-transition"
import { createAutomation } from "../../actions"
import { defaultCondition } from "../../helpers/automations"
import type {
  Automation,
  AutomationChannel,
  AutomationChannelId,
  AutomationCondition,
} from "../../types"
import { AutomationChannelStep } from "./automation-channel-step"
import { AutomationConfigureStep } from "./automation-configure-step"
import { AutomationTriggerStep } from "./automation-trigger-step"

type CreateState =
  | { step: "trigger" }
  | { step: "configure"; condition: AutomationCondition; name?: string }
  | { step: "deliver"; condition: AutomationCondition; name: string }

type CreateAutomationDialogProps = {
  channels: AutomationChannel[]
  connectedSources: string[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onClosed?: () => void
  onCreated: (automation: Automation) => void
}

export function CreateAutomationDialog({
  channels,
  connectedSources,
  open,
  onOpenChange,
  onClosed,
  onCreated,
}: CreateAutomationDialogProps) {
  const [state, setState] = useState<CreateState>({ step: "trigger" })
  const [error, setError] = useState<string | null>(null)
  const [isPending, startCreate] = useTransition()

  const create = (channelId: AutomationChannelId) => {
    if (state.step !== "deliver") return
    setError(null)
    startCreate(async () => {
      const result = await createAutomation({
        name: state.name,
        condition: state.condition,
        channelId,
      })
      if (!result.ok) {
        setError(result.error)
        return
      }
      onCreated(result.automation)
      onOpenChange(false)
      toast.success("Automation created", { description: state.name })
    })
  }

  return (
    <Dialog
      onOpenChange={onOpenChange}
      onOpenChangeComplete={(isOpen) => {
        if (!isOpen) onClosed?.()
      }}
      open={open}
    >
      <DialogContent>
        <StepTransition step={state.step}>
          {state.step === "trigger" && (
            <AutomationTriggerStep
              connectedSources={connectedSources}
              onSelect={(type) =>
                setState({
                  step: "configure",
                  condition: defaultCondition(type),
                })
              }
            />
          )}

          {state.step === "configure" && (
            <AutomationConfigureStep
              initialCondition={state.condition}
              initialName={state.name}
              onBack={() => setState({ step: "trigger" })}
              onContinue={(condition, name) =>
                setState({ step: "deliver", condition, name })
              }
            />
          )}

          {state.step === "deliver" && (
            <AutomationChannelStep
              channels={channels}
              condition={state.condition}
              error={error}
              isPending={isPending}
              name={state.name}
              onBack={() => {
                setError(null)
                setState({
                  step: "configure",
                  condition: state.condition,
                  name: state.name,
                })
              }}
              onCreate={create}
            />
          )}
        </StepTransition>
      </DialogContent>
    </Dialog>
  )
}
