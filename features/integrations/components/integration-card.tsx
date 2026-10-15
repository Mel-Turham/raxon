"use client"

import {
  AiMagicIcon,
  ArrowRight01Icon,
  ArrowUpRight01Icon,
  RefreshIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { RelativeTime } from "@/shared/components/atoms/relative-time"
import { cn } from "@/shared/lib/utils"
import {
  INTEGRATION_AUTH_LABELS,
  INTEGRATION_CATEGORY_LABELS,
  INTEGRATION_PERMISSION_LABELS,
} from "../constants"
import { isLinked, needsAttention } from "../helpers/integrations"
import type { Integration } from "../types"
import { BrandLogo } from "@/shared/components/atoms/logos/brand-logo"
import { IntegrationStatus } from "./integration-status"

type IntegrationCardProps = {
  integration: Integration
  onConnect: (integration: Integration) => void
  onManage: (integration: Integration) => void
  onAiAccessChange: (integration: Integration, enabled: boolean) => void
}

export function IntegrationCard({
  integration,
  onConnect,
  onManage,
  onAiAccessChange,
}: IntegrationCardProps) {
  const linked = isLinked(integration)
  const expired = needsAttention(integration)
  const comingSoon = integration.status === "coming-soon"
  const aiSwitchId = `ai-access-${integration.id}`

  return (
    <Card
      className={cn(
        "gap-0 py-0 transition-colors hover:border-foreground/15",
        comingSoon && "opacity-60"
      )}
    >
      <div className="flex items-start gap-3 px-(--card-spacing) pt-4">
        <BrandLogo logo={integration.logo} />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <h3 className="truncate text-sm font-semibold tracking-tight">
            {integration.name}
          </h3>
          <span className="text-xs text-muted-foreground">
            {INTEGRATION_CATEGORY_LABELS[integration.category]}
          </span>
        </div>
        <IntegrationStatus status={integration.status} />
      </div>

      <div className="flex flex-1 flex-col gap-3 px-(--card-spacing) pt-3 pb-4">
        <p className="text-xs leading-5 text-muted-foreground">
          {integration.description}
        </p>
        <p className="flex items-start gap-2 text-xs leading-5 text-foreground/85">
          <HugeiconsIcon
            className="mt-0.5 shrink-0 text-primary"
            icon={AiMagicIcon}
            size={14}
          />
          {integration.aiCapability}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-1">
          {integration.permissions.map((permission) => (
            <span
              className="inline-flex h-5 items-center border border-border px-1.5 text-[11px] text-muted-foreground"
              key={permission}
            >
              {INTEGRATION_PERMISSION_LABELS[permission]}
            </span>
          ))}
          {integration.isPopular && !linked && (
            <span className="inline-flex h-5 items-center bg-primary/10 px-1.5 text-[11px] text-primary">
              Popular
            </span>
          )}
        </div>

        {integration.connection && (
          <div className="flex items-center justify-between gap-3 border-t border-dashed border-border pt-3 text-[11px] text-muted-foreground">
            <span className="truncate">{integration.connection.account}</span>
            <span className="shrink-0">
              {integration.status === "syncing" ? (
                "Syncing…"
              ) : (
                <>
                  Synced{" "}
                  <RelativeTime value={integration.connection.lastSyncAt} />
                </>
              )}
            </span>
          </div>
        )}
      </div>

      <div className="flex h-13 items-center justify-between gap-3 border-t border-border bg-muted/30 px-(--card-spacing)">
        {expired ? (
          <Button
            className="text-destructive"
            onClick={() => onConnect(integration)}
            size="sm"
            variant="outline"
          >
            <HugeiconsIcon icon={RefreshIcon} />
            Reconnect
          </Button>
        ) : linked ? (
          <Button
            className="-ml-2 text-primary hover:text-primary"
            onClick={() => onManage(integration)}
            size="sm"
            variant="ghost"
          >
            Manage
            <HugeiconsIcon icon={ArrowRight01Icon} />
          </Button>
        ) : (
          <Button
            disabled={comingSoon}
            onClick={() => onConnect(integration)}
            size="sm"
            variant="outline"
          >
            {comingSoon ? "Coming soon" : "Connect"}
            {!comingSoon && <HugeiconsIcon icon={ArrowUpRight01Icon} />}
          </Button>
        )}

        {linked && !expired ? (
          <label
            className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground"
            htmlFor={aiSwitchId}
          >
            Use in AI
            <Switch
              checked={integration.aiAccess}
              id={aiSwitchId}
              onCheckedChange={(checked) =>
                onAiAccessChange(integration, checked)
              }
              size="sm"
            />
          </label>
        ) : (
          <span className="text-[11px] text-muted-foreground">
            {expired
              ? "API key expired"
              : INTEGRATION_AUTH_LABELS[integration.auth]}
          </span>
        )}
      </div>
    </Card>
  )
}
