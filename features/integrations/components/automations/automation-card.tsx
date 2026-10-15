"use client"

import {
  Alert02Icon,
  ArrowDataTransferHorizontalIcon,
  Delete02Icon,
  MoreHorizontalIcon,
  SentIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { RelativeTime } from "@/shared/components/atoms/relative-time"
import { BrandLogo } from "@/shared/components/atoms/logos/brand-logo"
import { cn } from "@/shared/lib/utils"
import { describeCondition, triggerMeta } from "../../helpers/automations"
import type { Automation, AutomationChannel } from "../../types"

type AutomationCardProps = {
  automation: Automation
  channel: AutomationChannel | null
  onToggle: (automation: Automation, enabled: boolean) => void
  onTest: (automation: Automation) => void
  onDelete: (automation: Automation) => void
}

export function AutomationCard({
  automation,
  channel,
  onToggle,
  onTest,
  onDelete,
}: AutomationCardProps) {
  const trigger = triggerMeta(automation.condition.type)
  const blocked = !channel?.isConnected
  const switchId = `automation-${automation.id}`

  return (
    <Card className="gap-0 py-0 transition-colors hover:border-foreground/15">
      <div
        className={cn(
          "flex h-24 items-center justify-center gap-3 border-b border-border bg-muted/40",
          !automation.enabled && "opacity-60"
        )}
      >
        <BrandLogo logo={trigger.logo} />
        <HugeiconsIcon
          className="text-muted-foreground"
          icon={ArrowDataTransferHorizontalIcon}
          size={16}
        />
        {channel && <BrandLogo logo={channel.logo} />}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 px-(--card-spacing) py-4">
        <div className="flex items-start justify-between gap-3">
          <label
            className="min-w-0 cursor-pointer truncate text-sm font-semibold tracking-tight"
            htmlFor={switchId}
          >
            {automation.name}
          </label>
          <Switch
            aria-label={
              automation.enabled ? "Pause automation" : "Resume automation"
            }
            checked={automation.enabled}
            id={switchId}
            onCheckedChange={(checked) => onToggle(automation, checked)}
            size="sm"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {describeCondition(automation.condition)}
          {channel && <> · to {channel.name}</>}
        </p>
        <p className="text-[11px] text-muted-foreground/80">
          {trigger.label} · Updated{" "}
          <RelativeTime value={automation.updatedAt} />
        </p>
      </div>

      <div className="flex h-12 items-center justify-between gap-3 border-t border-border bg-muted/30 px-(--card-spacing)">
        {blocked ? (
          <Link
            className="flex items-center gap-1.5 text-xs text-destructive hover:underline"
            href="/ai/integrations"
          >
            <HugeiconsIcon icon={Alert02Icon} size={14} />
            {channel?.name ?? "Channel"} not connected
          </Link>
        ) : (
          <span className="text-xs text-muted-foreground">
            {automation.runs} run{automation.runs === 1 ? "" : "s"}
            {automation.lastRunAt && (
              <>
                {" "}
                · last <RelativeTime value={automation.lastRunAt} />
              </>
            )}
          </span>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                aria-label={`${automation.name} options`}
                className="-mr-1.5 text-muted-foreground"
                size="icon-sm"
                variant="ghost"
              />
            }
          >
            <HugeiconsIcon icon={MoreHorizontalIcon} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem
              disabled={blocked}
              onClick={() => onTest(automation)}
            >
              <HugeiconsIcon icon={SentIcon} />
              Send test
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(automation)}
              variant="destructive"
            >
              <HugeiconsIcon icon={Delete02Icon} />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  )
}
