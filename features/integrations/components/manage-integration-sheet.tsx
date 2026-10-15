"use client"

import {
  AiMagicIcon,
  CheckmarkCircle02Icon,
  RefreshIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { type ReactNode, useState, useTransition } from "react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/toast"
import { RelativeTime } from "@/shared/components/atoms/relative-time"
import { disconnectIntegration, syncIntegration } from "../actions"
import {
  INTEGRATION_ACCESS_SCOPES,
  INTEGRATION_CATEGORY_LABELS,
  INTEGRATION_PERMISSION_LABELS,
} from "../constants"
import { needsAttention } from "../helpers/integrations"
import type { Integration } from "../types"
import { BrandLogo } from "@/shared/components/atoms/logos/brand-logo"
import { IntegrationStatus } from "./integration-status"

const DATE = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" })

type ManageIntegrationSheetProps = {
  integration: Integration
  open: boolean
  onOpenChange: (open: boolean) => void
  onClosed: () => void
  onAiAccessChange: (integration: Integration, enabled: boolean) => void
  onSynced: (integration: Integration, lastSyncAt: string) => void
  onDisconnected: (integration: Integration) => void
  onReconnect: (integration: Integration) => void
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3 border-b border-border px-4 py-4">
      <h3 className="text-[11px] font-medium tracking-[1px] text-muted-foreground uppercase">
        {title}
      </h3>
      {children}
    </section>
  )
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 text-xs">
      <dt className="shrink-0 text-muted-foreground">{label}</dt>
      <dd className="min-w-0 truncate text-right">{children}</dd>
    </div>
  )
}

export function ManageIntegrationSheet({
  integration,
  open,
  onOpenChange,
  onClosed,
  onAiAccessChange,
  onSynced,
  onDisconnected,
  onReconnect,
}: ManageIntegrationSheetProps) {
  const [isSyncing, startSync] = useTransition()
  const [isDisconnecting, startDisconnect] = useTransition()
  const [confirming, setConfirming] = useState(false)
  const { connection } = integration
  const expired = needsAttention(integration)

  const sync = () =>
    startSync(async () => {
      const result = await syncIntegration({ id: integration.id })
      if (!result.ok) {
        toast.error(result.error)
        return
      }
      onSynced(integration, result.lastSyncAt)
      toast.success(`${integration.name} synced`)
    })

  const disconnect = () =>
    startDisconnect(async () => {
      const result = await disconnectIntegration({ id: integration.id })
      if (!result.ok) {
        toast.error(result.error)
        return
      }
      onDisconnected(integration)
      onOpenChange(false)
      toast.success(`${integration.name} disconnected`, {
        description: "Its data is no longer available to Raxon AI.",
      })
    })

  return (
    <Sheet
      onOpenChange={onOpenChange}
      onOpenChangeComplete={(isOpen) => {
        if (!isOpen) onClosed()
      }}
      open={open}
    >
      <SheetContent className="w-full gap-0 p-0 sm:max-w-md">
        <SheetHeader className="flex-row items-center gap-3 border-b border-border p-4 pr-12">
          <BrandLogo logo={integration.logo} />
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <SheetTitle className="truncate text-base">
              {integration.name}
            </SheetTitle>
            <SheetDescription>
              {INTEGRATION_CATEGORY_LABELS[integration.category]}
            </SheetDescription>
          </div>
          <IntegrationStatus status={integration.status} />
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          {connection && (
            <Section title="Connection">
              <dl className="flex flex-col gap-2.5">
                <Row label="Account">
                  <span className="font-mono">{connection.account}</span>
                </Row>
                <Row label="Connected">
                  {DATE.format(new Date(connection.connectedAt))}
                </Row>
                <Row label="Last sync">
                  {integration.status === "syncing" ? (
                    "Syncing…"
                  ) : (
                    <RelativeTime value={connection.lastSyncAt} />
                  )}
                </Row>
              </dl>
              {expired ? (
                <Button
                  className="w-full text-destructive"
                  onClick={() => onReconnect(integration)}
                  variant="outline"
                >
                  <HugeiconsIcon icon={RefreshIcon} />
                  Reconnect with a new API key
                </Button>
              ) : (
                <Button
                  className="w-full"
                  loading={isSyncing}
                  onClick={sync}
                  variant="outline"
                >
                  <HugeiconsIcon icon={RefreshIcon} />
                  Sync now
                </Button>
              )}
            </Section>
          )}

          <Section title="Raxon AI">
            <label
              className="flex cursor-pointer items-center justify-between gap-4"
              htmlFor="manage-ai-access"
            >
              <span className="flex items-start gap-2.5">
                <HugeiconsIcon
                  className="mt-0.5 shrink-0 text-primary"
                  icon={AiMagicIcon}
                  size={15}
                />
                <span className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">Use in AI</span>
                  <span className="text-xs text-muted-foreground">
                    {integration.aiCapability}
                  </span>
                </span>
              </span>
              <Switch
                checked={integration.aiAccess}
                disabled={expired}
                id="manage-ai-access"
                onCheckedChange={(checked) =>
                  onAiAccessChange(integration, checked)
                }
              />
            </label>
            <ul className="flex flex-col gap-2 pl-6.5">
              {INTEGRATION_ACCESS_SCOPES[integration.category].map((scope) => (
                <li
                  className="flex items-center gap-2 text-xs text-muted-foreground"
                  key={scope}
                >
                  <HugeiconsIcon
                    className="shrink-0 text-success"
                    icon={CheckmarkCircle02Icon}
                    size={13}
                  />
                  {scope}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Permissions">
            <div className="flex flex-wrap gap-1.5">
              {integration.permissions.map((permission) => (
                <span
                  className="inline-flex h-6 items-center border border-border px-2 text-xs"
                  key={permission}
                >
                  {INTEGRATION_PERMISSION_LABELS[permission]}
                </span>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Raxon never withdraws funds. To change permissions, reconnect with
              a new key.
            </p>
          </Section>
        </div>

        <SheetFooter className="border-t border-border p-4">
          {confirming ? (
            <div className="flex flex-col gap-3">
              <p className="text-xs text-muted-foreground">
                Disconnect {integration.name}? Synced data will be removed and
                Raxon AI will stop using it.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  disabled={isDisconnecting}
                  onClick={() => setConfirming(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  loading={isDisconnecting}
                  onClick={disconnect}
                  variant="destructive"
                >
                  Disconnect
                </Button>
              </div>
            </div>
          ) : (
            <Button
              className="w-full"
              onClick={() => setConfirming(true)}
              variant="destructive"
            >
              Disconnect {integration.name}
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
