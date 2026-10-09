"use client"

import { useMemo, useState } from "react"
import { AnimatedNumber } from "@/components/shared/animated-number"
import {
  ALIGN_CLASS,
  type Align,
  SortableHeader,
} from "@/components/shared/sortable-header"
import { LazySparkline } from "@/components/shared/lazy-sparkline"
import { TokenAvatar } from "@/components/shared/token-avatar"
import { TrendBadge } from "@/components/shared/trend-badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  intervalLabel,
  TRANSACTION_RANGE_DURATION,
  type TransactionInterval,
  type TransactionRange,
} from "@/constants"
import { useSortedRows } from "@/hooks/use-sorted-rows"
import type { Transaction, TransactionSortKey } from "@/lib/api/types"
import { compactCurrencyParts, ONE_DECIMAL_FORMAT } from "@/lib/format"
import { MARKET_NOW } from "@/lib/time"
import { cn } from "@/lib/utils"

type Column = {
  id: string
  label: (interval: TransactionInterval) => string
  align: Align
  sortKey?: TransactionSortKey
}

const COLUMNS: Column[] = [
  { id: "asset", label: () => "Assets", align: "left" },
  { id: "price", label: () => "Price", align: "left" },
  {
    id: "change",
    label: (interval) => `${intervalLabel(interval)} Change`,
    align: "center",
    sortKey: "change",
  },
  {
    id: "change7d",
    label: () => "7d Change",
    align: "center",
    sortKey: "change7d",
  },
  {
    id: "volume",
    label: (interval) => `Volume (${intervalLabel(interval)})`,
    align: "right",
    sortKey: "volume",
  },
  {
    id: "trend",
    label: (interval) => `${intervalLabel(interval)} Trend`,
    align: "center",
  },
  {
    id: "marketCap",
    label: () => "Market Cap",
    align: "right",
    sortKey: "marketCap",
  },
]

const sortGetters = (
  interval: TransactionInterval
): Record<TransactionSortKey, (row: Transaction) => number> => ({
  change: (row) => row.metrics[interval].change,
  change7d: (row) => row.metrics["7D"].change,
  volume: (row) => row.metrics[interval].volume,
  marketCap: (row) => row.marketCap,
})

const isInRange = (row: Transaction, range: TransactionRange) =>
  MARKET_NOW - Date.parse(row.lastTradeAt) <= TRANSACTION_RANGE_DURATION[range]

const CompactAmount = ({ value }: { value: number }) => (
  <AnimatedNumber
    format={ONE_DECIMAL_FORMAT}
    {...compactCurrencyParts(value)}
  />
)

const CHECKBOX_CLASS = "border-foreground/15 dark:bg-transparent"

const matchesQuery = (transaction: Transaction, query: string) => {
  const needle = query.trim().toLowerCase()
  return (
    !needle ||
    transaction.name.toLowerCase().includes(needle) ||
    transaction.symbol.toLowerCase().includes(needle)
  )
}

type TransactionsTableProps = {
  transactions: Transaction[]
  query: string
  range: TransactionRange
  interval: TransactionInterval
}

export const TransactionsTable = ({
  transactions,
  query,
  range,
  interval,
}: TransactionsTableProps) => {
  const [selected, setSelected] = useState<ReadonlySet<string>>(new Set())

  const filteredRows = useMemo(
    () =>
      transactions.filter(
        (row) => isInRange(row, range) && matchesQuery(row, query)
      ),
    [transactions, query, range]
  )
  const getters = useMemo(() => sortGetters(interval), [interval])
  const {
    sortedRows: rows,
    sort,
    toggleSort,
  } = useSortedRows(filteredRows, getters)

  const allSelected =
    rows.length > 0 && rows.every((row) => selected.has(row.symbol))
  const someSelected = rows.some((row) => selected.has(row.symbol))

  const toggleRow = (symbol: string, checked: boolean) =>
    setSelected((current) => {
      const next = new Set(current)
      if (checked) next.add(symbol)
      else next.delete(symbol)
      return next
    })

  const toggleAll = (checked: boolean) =>
    setSelected(checked ? new Set(rows.map((row) => row.symbol)) : new Set())

  return (
    <div className="border border-border">
      <Table>
        <TableHeader>
          <TableRow className="bg-accent hover:bg-accent">
            <TableHead className="w-12 pl-4">
              <Checkbox
                className={CHECKBOX_CLASS}
                aria-label="Select all"
                checked={allSelected}
                indeterminate={someSelected && !allSelected}
                onCheckedChange={toggleAll}
              />
            </TableHead>
            {COLUMNS.map(({ id, label, align, sortKey }) => (
              <TableHead
                key={id}
                className={cn(
                  "h-10 text-[13px] font-normal",
                  ALIGN_CLASS[align],
                  align === "right" && "pr-4"
                )}
              >
                {sortKey ? (
                  <SortableHeader
                    active={sort?.key === sortKey}
                    align={align}
                    label={label(interval)}
                    onSort={() => toggleSort(sortKey)}
                  />
                ) : (
                  label(interval)
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.length === 0 && (
            <TableRow className="hover:bg-transparent">
              <TableCell
                className="h-24 text-center text-sm text-muted-foreground"
                colSpan={COLUMNS.length + 1}
              >
                No transactions for this period.
              </TableCell>
            </TableRow>
          )}
          {rows.map((row) => {
            const isSelected = selected.has(row.symbol)
            const metrics = row.metrics[interval]

            return (
              <TableRow
                key={row.symbol}
                data-state={isSelected ? "selected" : undefined}
                className="hover:bg-accent data-[state=selected]:bg-accent"
              >
                <TableCell className="pl-4">
                  <Checkbox
                    className={CHECKBOX_CLASS}
                    aria-label={`Select ${row.name}`}
                    checked={isSelected}
                    onCheckedChange={(checked) =>
                      toggleRow(row.symbol, checked)
                    }
                  />
                </TableCell>
                <TableCell className="py-2.5">
                  <div className="flex items-center gap-3">
                    <TokenAvatar symbol={row.symbol} />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{row.name}</span>
                      <span className="text-[11px] text-muted-foreground">
                        {row.symbol}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm tabular-nums">
                  <AnimatedNumber value={row.price} />
                </TableCell>
                <TableCell className="text-center">
                  <TrendBadge value={metrics.change} icon="trending" />
                </TableCell>
                <TableCell className="text-center">
                  <TrendBadge
                    value={row.metrics["7D"].change}
                    icon="trending"
                  />
                </TableCell>
                <TableCell className="text-right font-mono text-sm tabular-nums">
                  <CompactAmount value={metrics.volume} />
                </TableCell>
                <TableCell>
                  <LazySparkline
                    seed={`${row.symbol}-${interval}`}
                    trend={metrics.change}
                    className="mx-auto"
                  />
                </TableCell>
                <TableCell className="pr-4 text-right font-mono text-sm tabular-nums">
                  <CompactAmount value={row.marketCap} />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
