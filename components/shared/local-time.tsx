import { cn } from "@/lib/utils"

const timeFormatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
})

type LocalTimeProps = {
  /** ISO date string. */
  value: string
  className?: string
}

/** HH:mm:ss in the viewer's time zone (may differ from the server render). */
export const LocalTime = ({ value, className }: LocalTimeProps) => (
  <time
    className={cn("font-mono tabular-nums", className)}
    dateTime={value}
    suppressHydrationWarning
  >
    {timeFormatter.format(new Date(value))}
  </time>
)
