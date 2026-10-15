"use client"

import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { DialogBody } from "@/components/ui/dialog"
import { BrandLogo } from "@/shared/components/atoms/logos/brand-logo"
import { DialogHints } from "@/shared/components/molecules/dialog-hints"
import { StepHeader } from "@/shared/components/molecules/step-header"
import { cn } from "@/shared/lib/utils"
import { AUTOMATION_TRIGGERS } from "../../constants"
import type { AutomationTriggerType } from "../../types"

export function AutomationTriggerStep({
  connectedSources,
  onSelect,
}: {
  connectedSources: string[]
  onSelect: (type: AutomationTriggerType) => void
}) {
  return (
    <>
      <StepHeader backLabel="" title="New automation" />

      <DialogBody className="flex flex-col gap-1 p-2">
        <p className="px-2 pt-2 pb-1 text-xs text-muted-foreground">
          Choose what starts the automation
        </p>
        {AUTOMATION_TRIGGERS.map((trigger) => {
          const missing =
            "requires" in trigger &&
            !connectedSources.includes(trigger.requires)
          return (
            <button
              className={cn(
                "group flex items-center gap-3 px-2 py-2.5 text-left transition-colors",
                missing ? "cursor-not-allowed opacity-50" : "hover:bg-muted"
              )}
              disabled={missing}
              key={trigger.value}
              onClick={() => onSelect(trigger.value)}
              type="button"
            >
              <BrandLogo className="size-9" logo={trigger.logo} />
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-sm font-medium">{trigger.label}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {missing
                    ? "Connect TradingView to use this trigger"
                    : trigger.description}
                </span>
              </span>
              {!missing && (
                <HugeiconsIcon
                  className="text-muted-foreground transition-transform group-hover:translate-x-0.5"
                  icon={ArrowRight01Icon}
                  size={15}
                />
              )}
            </button>
          )
        })}
      </DialogBody>

      <DialogHints hints={[{ keys: ["Esc"], label: "Cancel" }]} />
    </>
  )
}
