"use client"

import { ChartLineData01Icon } from "@hugeicons/core-free-icons"
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
  TRANSACTIONS_ACTION_CLASS,
  type TransactionInterval,
  type TransactionRange,
} from "@/features/dashboard/constants"
import type { Transaction } from "@/features/dashboard/types"
import { IconTile } from "@/shared/components/atoms/icon-tile"
import { SearchInput } from "@/shared/components/molecules/search-input"
import { SegmentedTabs } from "@/shared/components/molecules/segmented-tabs"
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
        <IconTile className="row-span-2" icon={ChartLineData01Icon} size={18} />
        <CardTitle className="text-base">Recent transactions</CardTitle>
        <CardDescription className="text-[11px]">
          Keep track of all transactions here
        </CardDescription>
        <CardAction className={TRANSACTIONS_ACTION_CLASS}>
          <SearchInput
            containerClassName="w-full sm:w-auto sm:flex-1 lg:w-56 lg:flex-none"
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
            <SelectTrigger className="ml-auto h-9 min-w-20 border-border bg-accent text-sm data-[size=default]:h-9 lg:data-[size=default]:h-10 dark:bg-accent dark:hover:bg-accent">
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
