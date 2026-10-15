import { formatRelativeTime } from "@/shared/lib/time"

export const RelativeTime = ({
  value,
  className,
}: {
  value: string
  className?: string
}) => (
  <time className={className} dateTime={value} suppressHydrationWarning>
    {formatRelativeTime(value)}
  </time>
)
