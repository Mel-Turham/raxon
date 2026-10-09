import { AnimatedNumber } from "@/components/shared/animated-number"
import { signedPercentFormat } from "@/lib/format"
import type { PortfolioPoint } from "@/lib/portfolio-series"

const monthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
})

const PERCENT_FORMAT = signedPercentFormat(2)

const changeBetween = (from: number, to: number) => ((to - from) / from) * 100

type PortfolioTooltipProps = {
  point: PortfolioPoint
  previous: PortfolioPoint
  first: PortfolioPoint
}

export const PortfolioTooltip = ({
  point,
  previous,
  first,
}: PortfolioTooltipProps) => {
  const rows = [
    { color: "var(--chart-1)", value: changeBetween(first.value, point.value) },
    {
      color: "var(--success)",
      value: changeBetween(previous.value, point.value),
    },
  ]

  return (
    <div className="flex flex-col gap-1 px-3.5 py-3">
      <span className="text-[11px] text-muted-foreground">
        {monthFormatter.format(point.date)}
      </span>
      {/* Decimals muted, as in the design (NumberFlow CSS parts). */}
      <AnimatedNumber
        className="text-lg font-semibold tabular-nums [&::part(decimal)]:text-muted-foreground [&::part(fraction)]:text-muted-foreground"
        value={point.value}
      />
      <div className="mt-1.5 flex items-center gap-4">
        {rows.map(({ color, value }) => (
          <span
            key={color}
            className="flex items-center gap-1.5 text-xs tabular-nums"
          >
            <span
              className="size-1.5 rounded-full"
              style={{ backgroundColor: color }}
            />
            <AnimatedNumber format={PERCENT_FORMAT} suffix="%" value={value} />
          </span>
        ))}
      </div>
    </div>
  )
}
