"use client"

import { useMemo, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Download01Icon,
  FilterHorizontalIcon,
} from "@hugeicons/core-free-icons"

import { AnimatedNumber } from "@/shared/components/atoms/animated-number"
import { ChangePill } from "@/shared/components/atoms/change-pill"
import { LazySparkline } from "@/shared/components/atoms/lazy-sparkline"
import { SearchInput } from "@/shared/components/molecules/search-input"
import {
  ALIGN_CLASS,
  type Align,
  SortableHeader,
} from "@/shared/components/molecules/sortable-header"
import { TokenAvatar } from "@/shared/components/atoms/token-avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ASSET_FILTERS, type AssetFilter } from "@/features/portfolio/constants"
import type { PortfolioAsset } from "@/features/portfolio/types"
import { downloadCsv } from "@/shared/lib/csv"
import {
  compactCurrencyParts,
  ONE_DECIMAL_FORMAT,
  PRICE_FORMAT,
} from "@/shared/lib/format"
import { cn } from "@/shared/lib/utils"
import { useSortedRows } from "@/shared/hooks/use-sorted-rows"
import { TOOL_BUTTON } from "@/shared/components/molecules/list-table"

type SortKey = "price" | "change" | "volume"

const SORT_GETTERS: Record<SortKey, (asset: PortfolioAsset) => number> = {
  price: (asset) => asset.price,
  change: (asset) => asset.change,
  volume: (asset) => asset.volume,
}

const COLUMNS: {
  key: string
  label: string
  align: Align
  sortKey?: SortKey
}[] = [
  { key: "coin", label: "Coin", align: "left" },
  { key: "price", label: "Last Price", align: "left", sortKey: "price" },
  { key: "change", label: "Trend", align: "left", sortKey: "change" },
  { key: "volume", label: "Volume", align: "right", sortKey: "volume" },
  { key: "chart", label: "Chart", align: "center" },
]

const FILTER_MATCH: Record<AssetFilter, (asset: PortfolioAsset) => boolean> = {
  all: () => true,
  gainers: (asset) => asset.change >= 0,
  losers: (asset) => asset.change < 0,
}

export const AssetsCard = ({ assets }: { assets: PortfolioAsset[] }) => {
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<AssetFilter>("all")

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return assets.filter(
      (asset) =>
        FILTER_MATCH[filter](asset) &&
        (!needle ||
          asset.name.toLowerCase().includes(needle) ||
          asset.symbol.toLowerCase().includes(needle))
    )
  }, [assets, query, filter])
  const { sortedRows, sort, toggleSort } = useSortedRows(visible, SORT_GETTERS)

  const exportCsv = () =>
    downloadCsv(
      "raxon-assets.csv",
      ["Symbol", "Name", "Last price (USD)", "24h change (%)", "Volume (USD)"],
      sortedRows.map((asset) => [
        asset.symbol,
        asset.name,
        asset.price,
        asset.change,
        asset.volume,
      ])
    )

  return (
    <Card>
      <CardHeader className="items-center">
        <CardTitle className="text-base">Your Assets</CardTitle>
        <CardAction className="flex items-center gap-2">
          <SearchInput
            containerClassName="w-52"
            placeholder="Search..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="bg-accent lg:h-10 dark:bg-accent"
          />
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  className={cn(
                    TOOL_BUTTON,
                    filter !== "all" && "text-primary"
                  )}
                />
              }
            >
              <HugeiconsIcon icon={FilterHorizontalIcon} />
              Filter
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Show</DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={filter}
                  onValueChange={(value) => setFilter(value as AssetFilter)}
                >
                  {ASSET_FILTERS.map(({ value, label }) => (
                    <DropdownMenuRadioItem key={value} value={value}>
                      {label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            className={TOOL_BUTTON}
            disabled={sortedRows.length === 0}
            onClick={exportCsv}
          >
            <HugeiconsIcon icon={Download01Icon} />
            Export
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="border border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-accent hover:bg-accent">
                {COLUMNS.map(({ key, label, align, sortKey }) => (
                  <TableHead
                    key={key}
                    className={cn(
                      "h-10 px-4 text-[13px] font-normal",
                      ALIGN_CLASS[align]
                    )}
                  >
                    {sortKey ? (
                      <SortableHeader
                        active={sort?.key === sortKey}
                        align={align}
                        label={label}
                        onSort={() => toggleSort(sortKey)}
                      />
                    ) : (
                      label
                    )}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRows.length === 0 && (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    className="h-24 text-center text-sm text-muted-foreground"
                    colSpan={COLUMNS.length}
                  >
                    No assets match your search.
                  </TableCell>
                </TableRow>
              )}
              {sortedRows.map((asset) => (
                <TableRow key={asset.symbol} className="hover:bg-accent">
                  <TableCell className="px-4 py-2.5">
                    <div className="flex items-center gap-3">
                      <TokenAvatar symbol={asset.symbol} />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {asset.name}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {asset.symbol}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 font-mono text-sm tabular-nums">
                    <AnimatedNumber format={PRICE_FORMAT} value={asset.price} />
                  </TableCell>
                  <TableCell className="px-4">
                    <ChangePill value={asset.change} />
                  </TableCell>
                  <TableCell className="px-4 text-right font-mono text-sm tabular-nums">
                    <AnimatedNumber
                      format={ONE_DECIMAL_FORMAT}
                      {...compactCurrencyParts(asset.volume)}
                    />
                  </TableCell>
                  <TableCell className="px-4">
                    <LazySparkline
                      className="mx-auto"
                      seed={`asset-${asset.symbol}`}
                      trend={asset.change}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
