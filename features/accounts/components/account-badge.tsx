import { HugeiconsIcon } from "@hugeicons/react"

import { SharedElement } from "@/shared/components/molecules/step-transition"
import { cn } from "@/shared/lib/utils"
import { ACCOUNT_TYPES } from "../constants"
import type { AccountType } from "../types"

type AccountBadgeProps = {
  type: AccountType
  color: string
  className?: string
  iconSize?: number
  shared?: boolean
}

export const AccountBadge = ({
  type,
  color,
  className,
  iconSize = 18,
  shared = false,
}: AccountBadgeProps) => {
  const badge = (
    <span
      className={cn(
        "flex size-9 shrink-0 items-center justify-center shadow-(--icon-badge-shadow) transition-colors",
        className
      )}
      style={{
        color,
        backgroundImage: `linear-gradient(180deg, color-mix(in oklch, ${color} 18%, var(--card)), color-mix(in oklch, ${color} 10%, var(--card)))`,
      }}
    >
      <HugeiconsIcon icon={ACCOUNT_TYPES[type].icon} size={iconSize} />
    </span>
  )

  return shared ? (
    <SharedElement id={`account-badge:${type}`}>{badge}</SharedElement>
  ) : (
    badge
  )
}
