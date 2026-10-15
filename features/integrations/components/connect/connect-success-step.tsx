"use client"

import {
  AiMagicIcon,
  CheckmarkCircle02Icon,
  Copy01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import { DialogBody, DialogClose } from "@/components/ui/dialog"
import { IconBadge } from "@/shared/components/atoms/icon-badge"
import { DialogHints } from "@/shared/components/molecules/dialog-hints"
import { StepHeader } from "@/shared/components/molecules/step-header"
import { useCopyToClipboard } from "@/shared/hooks/use-copy-to-clipboard"
import { INTEGRATION_PERMISSION_LABELS } from "../../constants"
import type {
  ConnectIntegrationResult,
  Integration,
  IntegrationWebhook,
} from "../../types"
import { BrandLogo } from "@/shared/components/atoms/logos/brand-logo"

type ConnectSuccessStepProps = {
  integration: Integration
  result: Extract<ConnectIntegrationResult, { ok: true }>
}

function WebhookDetails({ webhook }: { webhook: IntegrationWebhook }) {
  const { copiedValue, copy } = useCopyToClipboard()
  const fields = [
    { label: "Endpoint URL", value: webhook.url },
    { label: "Signing secret", value: webhook.secret },
  ]

  return (
    <div className="flex w-full flex-col gap-3 text-left">
      {fields.map(({ label, value }) => (
        <div className="flex flex-col gap-1.5" key={label}>
          <span className="text-xs text-muted-foreground">{label}</span>
          <div className="flex items-center gap-2 border border-foreground/10 bg-muted py-1.5 pr-1.5 pl-3">
            <code className="min-w-0 flex-1 truncate font-mono text-xs">
              {value}
            </code>
            <Button
              aria-label={`Copy ${label.toLowerCase()}`}
              onClick={() => copy(value, { label })}
              size="icon-sm"
              variant="ghost"
            >
              <HugeiconsIcon
                icon={copiedValue === value ? Tick02Icon : Copy01Icon}
                size={14}
              />
            </Button>
          </div>
        </div>
      ))}
      <p className="text-[11px] text-muted-foreground">
        The secret is shown once. Store it before closing this window.
      </p>
    </div>
  )
}

export function ConnectSuccessStep({
  integration,
  result,
}: ConnectSuccessStepProps) {
  return (
    <>
      <StepHeader
        backLabel=""
        leading={<BrandLogo className="size-7" logo={integration.logo} />}
        title={`${integration.name} connected`}
      />

      <DialogBody className="flex flex-col items-center gap-4 px-4 py-8 text-center">
        <IconBadge
          accent="var(--success)"
          className="size-12"
          icon={CheckmarkCircle02Icon}
        />
        <div className="flex flex-col gap-1">
          <p className="text-lg font-semibold tracking-tight">
            You&apos;re all set
          </p>
          <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <HugeiconsIcon
              className="text-primary"
              icon={AiMagicIcon}
              size={13}
            />
            Raxon AI can now use {integration.name} in its answers.
          </p>
        </div>

        <dl className="grid w-full grid-cols-2 border border-foreground/10 text-left text-xs">
          <div className="flex min-w-0 flex-col gap-1 border-r border-foreground/10 p-3">
            <dt className="text-muted-foreground">Account</dt>
            <dd className="truncate font-mono">{result.connection.account}</dd>
          </div>
          <div className="flex flex-col gap-1 p-3">
            <dt className="text-muted-foreground">Permissions</dt>
            <dd>
              {result.permissions
                .map((permission) => INTEGRATION_PERMISSION_LABELS[permission])
                .join(" · ")}
            </dd>
          </div>
        </dl>

        {result.webhook && <WebhookDetails webhook={result.webhook} />}
      </DialogBody>

      <DialogHints
        action={<DialogClose render={<Button size="sm">Done</Button>} />}
        hints={[{ keys: ["Esc"], label: "Close" }]}
      />
    </>
  )
}
