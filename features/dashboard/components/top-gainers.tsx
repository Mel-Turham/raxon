"use client"

import {
  ArrowDownDoubleIcon,
  ArrowUpDoubleIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { GAINER_GLYPHS } from "@/features/dashboard/constants"
import type { TopGainer } from "@/features/dashboard/types"
import { AnimatedNumber } from "@/shared/components/atoms/animated-number"
import { ListCard } from "@/shared/components/molecules/list-card"
import { LIST_TABLE } from "@/shared/components/molecules/list-table"
import {
  ALIGN_CLASS,
  type Align,
  SortableHeader,
} from "@/shared/components/molecules/sortable-header"
import { useSortedRows } from "@/shared/hooks/use-sorted-rows"
import {
  compactCurrencyParts,
  ONE_DECIMAL_FORMAT,
  PERCENT_FORMAT,
  PRICE_FORMAT,
} from "@/shared/lib/format"
import { cn } from "@/shared/lib/utils"

const SORT_GETTERS = {
  symbol: (row: TopGainer) => row.symbol,
  marketCap: (row: TopGainer) => row.marketCap,
  price: (row: TopGainer) => row.price,
  change: (row: TopGainer) => row.change,
}

const COLUMNS: {
  key: keyof typeof SORT_GETTERS
  label: string
  align: Align
}[] = [
  { key: "symbol", label: "Coin", align: "left" },
  { key: "marketCap", label: "Cap", align: "right" },
  { key: "price", label: "Price", align: "right" },
  { key: "change", label: "Dynamic", align: "right" },
]

export const TopGainers = ({
  gainers,
  className,
}: {
  gainers: TopGainer[]
  className?: string
}) => {
  const { sortedRows, sort, toggleSort } = useSortedRows(gainers, SORT_GETTERS)

  return (
    <ListCard title="Top Gainers" className={className} stretch>
      <Table>
        <TableHeader className={LIST_TABLE.header}>
          <TableRow className={LIST_TABLE.row}>
            {COLUMNS.map(({ key, label, align }) => (
              <TableHead
                key={key}
                className={cn(LIST_TABLE.head, ALIGN_CLASS[align])}
              >
                <SortableHeader
                  active={sort?.key === key}
                  align={align}
                  label={label}
                  onSort={() => toggleSort(key)}
                />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedRows.map((gainer) => {
            const glyph = GAINER_GLYPHS[gainer.momentum]
            const isUp = gainer.momentum === "up"

            return (
              <TableRow key={gainer.symbol} className={LIST_TABLE.row}>
                <TableCell className={LIST_TABLE.cell}>
                  <span className="flex items-center gap-2.5 text-sm">
                    <span
                      className="flex size-5 shrink-0 items-center justify-center rounded-full"
                      style={{
                        color: glyph.color,
                        backgroundColor: `color-mix(in oklch, ${glyph.color} 18%, transparent)`,
                      }}
                    >
                      <HugeiconsIcon
                        icon={glyph.icon}
                        size={11}
                        fill="currentColor"
                      />
                    </span>
                    {gainer.symbol}
                  </span>
                </TableCell>
                <TableCell
                  className={cn(LIST_TABLE.cell, "text-right text-sm")}
                >
                  <AnimatedNumber
                    format={ONE_DECIMAL_FORMAT}
                    {...compactCurrencyParts(gainer.marketCap)}
                  />
                </TableCell>
                <TableCell
                  className={cn(LIST_TABLE.cell, "text-right text-sm")}
                >
                  <AnimatedNumber format={PRICE_FORMAT} value={gainer.price} />
                </TableCell>
                <TableCell
                  className={cn(LIST_TABLE.cell, "text-right text-sm")}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <AnimatedNumber
                      format={PERCENT_FORMAT}
                      suffix="%"
                      value={gainer.change}
                    />
                    <HugeiconsIcon
                      icon={isUp ? ArrowUpDoubleIcon : ArrowDownDoubleIcon}
                      size={14}
                      className={
                        isUp ? "text-primary" : "text-muted-foreground"
                      }
                    />
                  </span>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </ListCard>
  )
}
