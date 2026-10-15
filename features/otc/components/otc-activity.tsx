"use client"

import { useState } from "react"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TokenAvatar } from "@/shared/components/atoms/token-avatar"
import { SegmentedTabs } from "@/shared/components/molecules/segmented-tabs"
import { cn } from "@/shared/lib/utils"
import { OTC_ACTIVITY_FILTERS } from "../constants"
import type { OtcActivity } from "../types"
import { AnimatedNumber } from "@/shared/components/atoms/animated-number"
import { AMOUNT_FORMAT, USD_FORMAT } from "../helpers/format"

type ActivityFilter = (typeof OTC_ACTIVITY_FILTERS)[number]

const DATE = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
})

const STATUS_CLASS: Record<OtcActivity["status"], string> = {
  Completed: "bg-success/15 text-success",
  "Quote expired": "bg-muted text-muted-foreground",
}

type OtcActivityTableProps = {
  activity: OtcActivity[]
}

export function OtcActivityTable({ activity }: OtcActivityTableProps) {
  const [filter, setFilter] = useState<ActivityFilter>("All")
  const rows = activity.filter(
    (item) =>
      filter === "All" ||
      (filter === "Completed" && item.status === "Completed") ||
      (filter === "Expired" && item.status === "Quote expired")
  )

  return (
    <Card className="min-w-0" id="otc-activity">
      <CardHeader className="items-center">
        <CardTitle className="text-base">Trade history</CardTitle>
        <CardDescription className="text-[11px]">
          Your recent OTC quotes and settlements
        </CardDescription>
        <CardAction className="self-center">
          <SegmentedTabs
            onValueChange={setFilter}
            options={OTC_ACTIVITY_FILTERS}
            value={filter}
          />
        </CardAction>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table className="min-w-[48rem]">
            <TableHeader>
              <TableRow className="bg-muted/20 hover:bg-muted/20">
                <TableHead className="pl-4">Pair</TableHead>
                <TableHead>Side</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="pr-4 text-right">Reference</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length ? (
                rows.map((item) => (
                  <TableRow className="h-14" key={item.id}>
                    <TableCell className="pl-4">
                      <div className="flex items-center gap-2.5">
                        <span className="flex -space-x-1.5">
                          <TokenAvatar
                            className="size-6 ring-2 ring-card"
                            symbol={item.baseAsset}
                          />
                          <TokenAvatar
                            className="size-6 ring-2 ring-card"
                            symbol={item.quoteAsset}
                          />
                        </span>
                        <span className="font-medium">
                          {item.baseAsset} / {item.quoteAsset}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell
                      className={cn(
                        "font-medium",
                        item.side === "Buy"
                          ? "text-success"
                          : "text-destructive"
                      )}
                    >
                      {item.side}
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums">
                      <AnimatedNumber
                        format={AMOUNT_FORMAT}
                        suffix={` ${item.baseAsset}`}
                        value={item.amount}
                      />
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums">
                      <AnimatedNumber format={USD_FORMAT} value={item.price} />
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums">
                      <AnimatedNumber
                        format={USD_FORMAT}
                        value={item.amount * item.price}
                      />
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-(--card-radius) px-2 py-0.5 text-[11px] font-medium",
                          STATUS_CLASS[item.status]
                        )}
                      >
                        {item.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <time dateTime={item.date} suppressHydrationWarning>
                        {DATE.format(new Date(item.date))}
                      </time>
                    </TableCell>
                    <TableCell className="pr-4 text-right font-mono text-muted-foreground">
                      {item.id}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    className="h-24 text-center text-muted-foreground"
                    colSpan={8}
                  >
                    No OTC activity for this filter.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
