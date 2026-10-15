"use client"

import { Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { DialogBody } from "@/components/ui/dialog"
import { BrandLogo } from "@/shared/components/atoms/logos/brand-logo"
import { DialogHints } from "@/shared/components/molecules/dialog-hints"
import { StepHeader } from "@/shared/components/molecules/step-header"
import { cn } from "@/shared/lib/utils"
import { describeCondition } from "../../helpers/automations"
import type {
  AutomationChannel,
  AutomationChannelId,
  AutomationCondition,
} from "../../types"

type AutomationChannelStepProps = {
  channels: AutomationChannel[]
  condition: AutomationCondition
  name: string
  isPending: boolean
  error: string | null
  onBack: () => void
  onCreate: (channelId: AutomationChannelId) => void
}

export function AutomationChannelStep({
  channels,
  condition,
  name,
  isPending,
  error,
  onBack,
  onCreate,
}: AutomationChannelStepProps) {
  const [selected, setSelected] = useState<AutomationChannelId | null>(
    channels.find((channel) => channel.isConnected)?.id ?? null
  )

  return (
    <>
      <StepHeader
        backLabel="Back to settings"
        detail="Deliver to"
        onBack={onBack}
        title={name}
      />

      <DialogBody className="flex flex-col gap-4 p-4">
        <p className="border-l-2 border-primary pl-3 text-xs text-muted-foreground">
          {describeCondition(condition)}
        </p>

        <div
          aria-label="Delivery channel"
          className="flex flex-col border border-border"
          role="radiogroup"
        >
          {channels.map((channel) => {
            const isSelected = selected === channel.id
            return (
              <div
                className="flex items-center gap-3 border-b border-border px-3 py-2.5 last:border-b-0"
                key={channel.id}
              >
                <BrandLogo className="size-8" logo={channel.logo} />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="text-sm font-medium">{channel.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {channel.isConnected ? "Connected" : "Not connected"}
                  </span>
                </span>
                {channel.isConnected ? (
                  <button
                    aria-checked={isSelected}
                    aria-label={channel.name}
                    className={cn(
                      "flex size-5 items-center justify-center border transition-colors",
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input hover:border-foreground/40"
                    )}
                    onClick={() => setSelected(channel.id)}
                    role="radio"
                    type="button"
                  >
                    {isSelected && (
                      <HugeiconsIcon icon={Tick02Icon} size={13} />
                    )}
                  </button>
                ) : (
                  <Link
                    className="text-xs font-medium text-primary hover:underline"
                    href="/ai/integrations"
                  >
                    Connect
                  </Link>
                )}
              </div>
            )
          })}
        </div>

        {error && (
          <p className="border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
            {error}
          </p>
        )}
      </DialogBody>

      <DialogHints
        action={
          <Button
            disabled={!selected}
            loading={isPending}
            onClick={() => selected && onCreate(selected)}
            size="sm"
          >
            Create automation
          </Button>
        }
        hints={[{ keys: ["Esc"], label: "Cancel" }]}
      />
    </>
  )
}
