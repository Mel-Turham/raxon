"use client"

import {
  AiMagicIcon,
  ArrowRight02Icon,
  CheckmarkCircle02Icon,
  ShieldKeyIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import { DialogBody } from "@/components/ui/dialog"
import { DialogHints } from "@/shared/components/molecules/dialog-hints"
import { StepHeader } from "@/shared/components/molecules/step-header"
import {
  INTEGRATION_ACCESS_SCOPES,
  INTEGRATION_PERMISSION_LABELS,
  INTEGRATION_SAFETY_NOTES,
} from "../../constants"
import type { Integration } from "../../types"
import { BrandLogo } from "@/shared/components/atoms/logos/brand-logo"

export function ConnectOverviewStep({
  integration,
  onContinue,
}: {
  integration: Integration
  onContinue: () => void
}) {
  return (
    <>
      <StepHeader
        backLabel=""
        leading={<BrandLogo className="size-7" logo={integration.logo} />}
        title={`Connect ${integration.name}`}
      />

      <DialogBody className="flex flex-col gap-5 p-4">
        <p className="flex items-start gap-2.5 border border-primary/20 bg-primary/5 p-3 text-xs leading-5">
          <HugeiconsIcon
            className="mt-0.5 shrink-0 text-primary"
            icon={AiMagicIcon}
            size={15}
          />
          {integration.aiCapability}
        </p>

        <section className="flex flex-col gap-2.5">
          <h3 className="text-xs text-muted-foreground">
            What Raxon will access
          </h3>
          <ul className="flex flex-col gap-2">
            {INTEGRATION_ACCESS_SCOPES[integration.category].map((scope) => (
              <li className="flex items-center gap-2.5 text-sm" key={scope}>
                <HugeiconsIcon
                  className="shrink-0 text-success"
                  icon={CheckmarkCircle02Icon}
                  size={15}
                />
                {scope}
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-2.5">
          <h3 className="text-xs text-muted-foreground">Permissions</h3>
          <div className="flex flex-wrap gap-1.5">
            {integration.permissions.map((permission) => (
              <span
                className="inline-flex h-6 items-center border border-border px-2 text-xs"
                key={permission}
              >
                {INTEGRATION_PERMISSION_LABELS[permission]}
              </span>
            ))}
            {integration.auth === "api-key" && (
              <span className="inline-flex h-6 items-center border border-dashed border-border px-2 text-xs text-muted-foreground line-through">
                Withdraw
              </span>
            )}
          </div>
        </section>

        <p className="flex items-start gap-2.5 text-xs leading-5 text-muted-foreground">
          <HugeiconsIcon
            className="mt-0.5 shrink-0"
            icon={ShieldKeyIcon}
            size={15}
          />
          {INTEGRATION_SAFETY_NOTES[integration.auth]}
        </p>
      </DialogBody>

      <DialogHints
        action={
          <Button onClick={onContinue} size="sm">
            Continue
            <HugeiconsIcon icon={ArrowRight02Icon} />
          </Button>
        }
        hints={[{ keys: ["Esc"], label: "Cancel" }]}
      />
    </>
  )
}
