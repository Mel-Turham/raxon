import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { Kpi } from "@/features/dashboard/types"
import { AnimatedNumber } from "@/shared/components/atoms/animated-number"
import { TrendBadge } from "@/shared/components/atoms/trend-badge"

export const KpiCard = ({ name, pair, price, change }: Kpi) => {
  return (
    <Card className="gap-3">
      <CardHeader className="gap-0.5">
        <CardTitle>{name}</CardTitle>
        <CardDescription className="text-[11px] leading-none">
          {pair}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <AnimatedNumber
          className="font-mono text-2xl tracking-tight tabular-nums"
          value={price}
        />
        <div className="flex items-center justify-between">
          <span className="text-[13px] text-muted-foreground">
            vs Last Week
          </span>
          <TrendBadge value={change} />
        </div>
      </CardContent>
    </Card>
  )
}
