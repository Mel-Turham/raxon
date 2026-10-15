import { cn } from "@/shared/lib/utils"
import { INTEGRATION_STATUS_LABELS } from "../constants"
import type { IntegrationStatus as IntegrationStatusValue } from "../types"

const STATUS_STYLE: Record<
  IntegrationStatusValue,
  { badge: string; dot: string }
> = {
  connected: { badge: "text-success", dot: "bg-success" },
  syncing: { badge: "text-primary", dot: "bg-primary animate-pulse" },
  expired: { badge: "text-destructive", dot: "bg-destructive" },
  available: { badge: "text-muted-foreground", dot: "bg-muted-foreground/60" },
  "coming-soon": {
    badge: "text-muted-foreground/70",
    dot: "bg-muted-foreground/30",
  },
}

export function IntegrationStatus({
  status,
}: {
  status: IntegrationStatusValue
}) {
  const style = STATUS_STYLE[status]

  return (
    <span
      className={cn(
        "inline-flex h-5 shrink-0 items-center gap-1.5 border border-border bg-background/60 px-1.5 text-[11px] font-medium",
        style.badge
      )}
    >
      <span className={cn("size-1.5", style.dot)} />
      {INTEGRATION_STATUS_LABELS[status]}
    </span>
  )
}
