import { HugeiconsIcon, type HugeiconsIconProps } from "@hugeicons/react"

import { cn } from "@/shared/lib/utils"

type IconTileProps = {
  icon: HugeiconsIconProps["icon"]
  size?: number
  className?: string
}

export const IconTile = ({ icon, size = 16, className }: IconTileProps) => (
  <span
    className={cn(
      "flex size-9 shrink-0 items-center justify-center rounded-(--card-radius) bg-muted text-muted-foreground shadow-(--icon-surface-shadow)",
      className
    )}
  >
    <HugeiconsIcon icon={icon} size={size} />
  </span>
)
