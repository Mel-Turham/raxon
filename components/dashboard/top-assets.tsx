"use client"

import { cn } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { TopAsset } from "@/lib/api/types"
import { PRICE_FORMAT, signedPercentFormat } from "@/lib/format"
import { useSortedRows } from "@/hooks/use-sorted-rows"

import { AnimatedNumber } from "@/components/shared/animated-number"
import { ListCard } from "@/components/shared/list-card"
import { LIST_TABLE } from "@/components/shared/list-table"
import { SortableHeader } from "@/components/shared/sortable-header"
import { TokenAvatar } from "@/components/shared/token-avatar"

const CHANGE_FORMAT = signedPercentFormat(2)

const SORT_GETTERS = {
  name: (row: TopAsset) => row.name,
  price: (row: TopAsset) => row.price,
  change: (row: TopAsset) => row.change,
}

const COLUMNS = [
  { key: "name", label: "Assets", align: "left" },
  { key: "price", label: "Price", align: "right" },
  { key: "change", label: "Dynamic", align: "right" },
] as const

export const TopAssets = ({ assets }: { assets: TopAsset[] }) => {
  const { sortedRows, sort, toggleSort } = useSortedRows(assets, SORT_GETTERS)

  return (
    <ListCard title="Top Assets">
      <Table>
        <TableHeader className={LIST_TABLE.header}>
          <TableRow className={LIST_TABLE.row}>
            {COLUMNS.map(({ key, label, align }) => (
              <TableHead
                key={key}
                className={cn(LIST_TABLE.head, key === "price" && "pr-8")}
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
          {sortedRows.map((asset) => (
            <TableRow key={asset.symbol} className={LIST_TABLE.row}>
              <TableCell className={LIST_TABLE.cell}>
                <div className="flex items-center gap-3">
                  <TokenAvatar symbol={asset.symbol} className="size-8" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{asset.name}</span>
                    <span className="text-[11px] text-muted-foreground">
                      {asset.symbol}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell
                className={cn(
                  LIST_TABLE.cell,
                  "pr-8 text-right text-sm font-semibold"
                )}
              >
                <AnimatedNumber format={PRICE_FORMAT} value={asset.price} />
              </TableCell>
              <TableCell
                className={cn(
                  LIST_TABLE.cell,
                  "text-right text-xs",
                  asset.change >= 0 ? "text-success" : "text-destructive"
                )}
              >
                <AnimatedNumber
                  format={CHANGE_FORMAT}
                  suffix="%"
                  value={asset.change}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ListCard>
  )
}
