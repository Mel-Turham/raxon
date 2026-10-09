import { HugeiconsIcon } from "@hugeicons/react"
import { TrendingDownIcon, TrendingUpIcon } from "@hugeicons/core-free-icons"

import { signedPercentFormat } from "@/lib/format"
import { cn } from "@/lib/utils"

import { AnimatedNumber } from "./animated-number"

type TrendBadgeProps = {
  value: number
  icon?: "triangle" | "trending"
  /** Decimals of the percentage. Default: 1 */
  digits?: number
  className?: string
}

export const TrendBadge = ({
  value,
  icon = "triangle",
  digits = 1,
  className,
}: TrendBadgeProps) => {
  const isPositive = value >= 0

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs font-medium tabular-nums",
        isPositive ? "text-success" : "text-destructive",
        className
      )}
    >
      {icon === "triangle" ? (
        <span aria-hidden className="text-[8px]">
          {isPositive ? "▲" : "▼"}
        </span>
      ) : (
        <HugeiconsIcon
          icon={isPositive ? TrendingUpIcon : TrendingDownIcon}
          size={14}
        />
      )}
      <AnimatedNumber
        format={signedPercentFormat(digits)}
        suffix="%"
        value={value}
      />
    </span>
  )
}
