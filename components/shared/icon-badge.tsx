import { HugeiconsIcon, type HugeiconsIconProps } from "@hugeicons/react"

import { cn } from "@/lib/utils"

type IconBadgeProps = {
  icon: HugeiconsIconProps["icon"]
  /** Any color token, e.g. "var(--primary)". */
  accent: string
  className?: string
}

/**
 * Glossy badge (iOS style): tinted gradient, light rim on top, soft inner
 * shade at the bottom. Same corner radius as the cards.
 */
export const IconBadge = ({ icon, accent, className }: IconBadgeProps) => (
  <span
    className={cn(
      "flex size-9 shrink-0 items-center justify-center rounded-(--card-radius) shadow-(--icon-badge-shadow)",
      className
    )}
    style={{
      color: accent,
      backgroundImage: `linear-gradient(180deg, color-mix(in oklch, ${accent} 34%, transparent), color-mix(in oklch, ${accent} 14%, transparent))`,
    }}
  >
    <HugeiconsIcon icon={icon} size={18} />
  </span>
)
