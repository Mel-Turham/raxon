import { signedPercentFormat } from "@/shared/lib/format"
import { cn } from "@/shared/lib/utils"

import { AnimatedNumber } from "./animated-number"

const FORMAT = signedPercentFormat(2)

export const ChangePill = ({
  value,
  className,
}: {
  value: number
  className?: string
}) => {
  const isUp = value >= 0
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-(--card-radius) px-2 py-0.5 text-xs font-medium tabular-nums",
        isUp
          ? "bg-success/15 text-success"
          : "bg-destructive/15 text-destructive",
        className
      )}
    >
      <AnimatedNumber format={FORMAT} suffix="%" value={value} />
    </span>
  )
}
