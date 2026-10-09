"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  AnalyticsUpIcon,
  Calendar03Icon,
  Camera01Icon,
  ChartLineData02Icon,
  DashboardSquare02Icon,
  FullScreenIcon,
  Move01Icon,
  PencilEdit02Icon,
  RulerIcon,
  ZoomInAreaIcon,
  ZoomOutAreaIcon,
} from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"

export type ChartToolAction =
  "reset" | "indicators" | "zoomIn" | "zoomOut" | "fullscreen" | "grid"

type ToolbarItem = {
  label: string
  icon: typeof Move01Icon
  /** Undefined: drawing tools not wired yet (rendered disabled). */
  action?: ChartToolAction
}

const TOOLBAR_ITEMS: ToolbarItem[] = [
  { label: "Reset view", icon: Move01Icon, action: "reset" },
  { label: "Snapshot", icon: Camera01Icon },
  { label: "Date range", icon: Calendar03Icon },
  { label: "Indicators", icon: AnalyticsUpIcon, action: "indicators" },
  { label: "Zoom in", icon: ZoomInAreaIcon, action: "zoomIn" },
  { label: "Zoom out", icon: ZoomOutAreaIcon, action: "zoomOut" },
  { label: "Trend line", icon: ChartLineData02Icon },
  { label: "Draw", icon: PencilEdit02Icon },
  { label: "Measure", icon: RulerIcon },
  { label: "Fullscreen", icon: FullScreenIcon, action: "fullscreen" },
  { label: "Grid", icon: DashboardSquare02Icon, action: "grid" },
]

type ChartToolbarProps = {
  onAction: (action: ChartToolAction) => void
  /** Toggle tools currently on (highlighted). */
  active: Partial<Record<ChartToolAction, boolean>>
}

export const ChartToolbar = ({ onAction, active }: ChartToolbarProps) => (
  <div className="flex items-center gap-0.5">
    {TOOLBAR_ITEMS.map(({ label, icon, action }) => (
      <button
        key={label}
        type="button"
        aria-label={label}
        title={action ? label : `${label} (coming soon)`}
        disabled={!action}
        aria-pressed={action ? Boolean(active[action]) : undefined}
        onClick={() => action && onAction(action)}
        className={cn(
          "flex size-8 items-center justify-center text-muted-foreground transition-colors hover:bg-foreground/[0.04] hover:text-foreground disabled:pointer-events-none disabled:opacity-40",
          action && active[action] && "text-foreground"
        )}
      >
        <HugeiconsIcon icon={icon} size={18} />
      </button>
    ))}
  </div>
)
