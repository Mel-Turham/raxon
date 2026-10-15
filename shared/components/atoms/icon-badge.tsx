import { HugeiconsIcon, type HugeiconsIconProps } from "@hugeicons/react"

import { cn } from "@/shared/lib/utils"

type IconBadgeProps = {
  icon: HugeiconsIconProps["icon"]
  accent: string
  className?: string
}

export const IconBadge = ({ icon, accent, className }: IconBadgeProps) => (
  <span
    className={cn(
      "flex size-9 shrink-0 items-center justify-center rounded-(--card-radius) shadow-(--icon-badge-shadow)",
      className
    )}
    style={{
      color: accent,
      backgroundImage: `linear-gradient(180deg, color-mix(in oklch, ${accent} 18%, var(--card)), color-mix(in oklch, ${accent} 10%, var(--card)))`,
    }}
  >
    <HugeiconsIcon icon={icon} size={18} />
  </span>
)
