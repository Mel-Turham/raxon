import { cn } from "@/shared/lib/utils"

const timeFormatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
})

type LocalTimeProps = {
  value: string
  className?: string
}

export const LocalTime = ({ value, className }: LocalTimeProps) => (
  <time
    className={cn("font-mono tabular-nums", className)}
    dateTime={value}
    suppressHydrationWarning
  >
    {timeFormatter.format(new Date(value))}
  </time>
)
