import { HugeiconsIcon } from "@hugeicons/react"
import { UnfoldMoreIcon } from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"

export type Align = "left" | "center" | "right"

export const ALIGN_CLASS: Record<Align, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
}

const JUSTIFY_CLASS: Record<Align, string> = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
}

type SortableHeaderProps = {
  label: string
  active: boolean
  onSort: () => void
  align?: Align
}

/** Column label + up/down glyph, as in the design's sortable headers. */
export const SortableHeader = ({
  label,
  active,
  onSort,
  align = "left",
}: SortableHeaderProps) => (
  <button
    type="button"
    onClick={onSort}
    className={cn(
      "inline-flex w-full items-center gap-1 transition-colors hover:text-foreground",
      JUSTIFY_CLASS[align],
      active && "text-foreground"
    )}
  >
    {label}
    <HugeiconsIcon
      icon={UnfoldMoreIcon}
      size={12}
      className={active ? "text-foreground" : "text-muted-foreground"}
    />
  </button>
)
