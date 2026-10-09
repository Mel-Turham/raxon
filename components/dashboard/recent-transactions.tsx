"use client"

import { ChartLineData01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"
import { SearchInput } from "@/components/search-input"
import { SegmentedTabs } from "@/components/shared/segmented-tabs"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  TRANSACTION_DEFAULT_INTERVAL,
  TRANSACTION_DEFAULT_RANGE,
  TRANSACTION_INTERVALS,
  TRANSACTION_RANGES,
  type TransactionInterval,
  type TransactionRange,
} from "@/constants"
import type { Transaction } from "@/lib/api/types"
import { TransactionsTable } from "./transactions-table"

export const RecentTransactions = ({
  transactions,
}: {
  transactions: Transaction[]
}) => {
  const [query, setQuery] = useState("")
  const [range, setRange] = useState<TransactionRange>(
    TRANSACTION_DEFAULT_RANGE
  )
  const [interval, setTimeInterval] = useState<TransactionInterval>(
    TRANSACTION_DEFAULT_INTERVAL
  )

  return (
    <Card>
      <CardHeader className="items-center gap-x-3 has-data-[slot=card-action]:grid-cols-[auto_1fr_auto]">
        <span className="row-span-2 flex size-9 items-center justify-center border border-border bg-muted text-muted-foreground">
          <HugeiconsIcon icon={ChartLineData01Icon} size={18} />
        </span>
        <CardTitle className="text-base">Recent transactions</CardTitle>
        <CardDescription className="text-[11px]">
          Keep track of all transactions here
        </CardDescription>
        <CardAction className="col-start-3 flex items-center gap-3 self-center">
          <SearchInput
            containerClassName="w-56"
            placeholder="Search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="bg-accent lg:h-10 dark:bg-accent"
          />
          <SegmentedTabs
            options={TRANSACTION_RANGES}
            value={range}
            onValueChange={setRange}
          />
          <Select
            value={interval}
            onValueChange={(value) =>
              setTimeInterval(value as TransactionInterval)
            }
          >
            <SelectTrigger className="h-9 min-w-20 border-border bg-accent text-sm data-[size=default]:h-9 lg:data-[size=default]:h-10 dark:bg-accent dark:hover:bg-accent">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TRANSACTION_INTERVALS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>

      <CardContent>
        <TransactionsTable
          interval={interval}
          query={query}
          range={range}
          transactions={transactions}
        />
      </CardContent>
    </Card>
  )
}
