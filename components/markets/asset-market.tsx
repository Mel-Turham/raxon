"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  FilterHorizontalIcon,
  MoreHorizontalIcon,
  StarIcon,
} from "@hugeicons/core-free-icons"

import { SearchInput } from "@/components/search-input"
import { AnimatedNumber } from "@/components/shared/animated-number"
import { LazySparkline } from "@/components/shared/lazy-sparkline"
import { SegmentedTabs } from "@/components/shared/segmented-tabs"
import {
  ALIGN_CLASS,
  type Align,
  SortableHeader,
} from "@/components/shared/sortable-header"
import { TokenAvatar } from "@/components/shared/token-avatar"
import { TrendBadge } from "@/components/shared/trend-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  MARKET_CATEGORIES,
  MARKET_CATEGORY_ICONS,
  MARKET_FILTERS,
  MARKET_RANGES,
  type MarketCategory,
  type MarketFilter,
  type MarketRange,
} from "@/constants"
import type { FxRate, MarketAsset } from "@/lib/api/types"
import { cn } from "@/lib/utils"
import { useSortedRows } from "@/hooks/use-sorted-rows"

type SortKey = "price" | "fdv" | "volume" | "change"

const COLUMNS: {
  key: string
  label: string
  align: Align
  sortKey?: SortKey
}[] = [
  { key: "rank", label: "#", align: "left" },
  { key: "asset", label: "Assets", align: "left" },
  { key: "price", label: "Price", align: "right", sortKey: "price" },
  { key: "fdv", label: "FDV", align: "right", sortKey: "fdv" },
  { key: "volume", label: "Volume", align: "right", sortKey: "volume" },
  { key: "change", label: "Change", align: "right", sortKey: "change" },
  { key: "chart", label: "Last 7 Days", align: "center" },
  { key: "action", label: "Action", align: "center" },
]

const FILTER_MATCH: Record<MarketFilter, (change: number) => boolean> = {
  all: () => true,
  gainers: (change) => change >= 0,
  losers: (change) => change < 0,
}

const TOOL_BUTTON =
  "h-9 gap-2 px-3 text-[13px] font-normal lg:h-10 [&_svg:not([class*='size-'])]:size-4"

type AssetMarketProps = {
  assets: MarketAsset[]
  fxRates: FxRate[]
}

export const AssetMarket = ({ assets, fxRates }: AssetMarketProps) => {
  const router = useRouter()
  const [range, setRange] = useState<MarketRange>("1D")
  const [category, setCategory] = useState<MarketCategory>("Top")
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<MarketFilter>("all")
  const [currency, setCurrency] = useState(fxRates[0].code)
  const [watched, setWatched] = useState<ReadonlySet<string>>(new Set())

  const fx = fxRates.find((item) => item.code === currency) ?? fxRates[0]
  const money = useMemo(
    () => ({
      price: {
        style: "currency",
        currency: fx.code,
        maximumFractionDigits: 2,
      } as const,
      compact: {
        style: "currency",
        currency: fx.code,
        notation: "compact",
        maximumFractionDigits: 2,
      } as const,
    }),
    [fx.code]
  )

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return assets.filter(
      (asset) =>
        (category === "Top" || asset.categories.includes(category)) &&
        FILTER_MATCH[filter](asset.change[range]) &&
        (!needle ||
          asset.name.toLowerCase().includes(needle) ||
          asset.symbol.toLowerCase().includes(needle))
    )
  }, [assets, category, filter, query, range])

  const getters = useMemo(
    () =>
      ({
        price: (asset: MarketAsset) => asset.price,
        fdv: (asset: MarketAsset) => asset.fdv,
        volume: (asset: MarketAsset) => asset.volume,
        change: (asset: MarketAsset) => asset.change[range],
      }) satisfies Record<SortKey, (asset: MarketAsset) => number>,
    [range]
  )
  const { sortedRows, sort, toggleSort } = useSortedRows(visible, getters)

  const toggleWatch = (symbol: string) =>
    setWatched((current) => {
      const next = new Set(current)
      if (next.has(symbol)) next.delete(symbol)
      else next.add(symbol)
      return next
    })

  return (
    <Card id="asset-market" className="scroll-mt-4">
      <CardHeader className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <SegmentedTabs
            options={MARKET_RANGES}
            value={range}
            onValueChange={setRange}
          />
          <SegmentedTabs
            icons={MARKET_CATEGORY_ICONS}
            options={MARKET_CATEGORIES}
            value={category}
            variant="bare"
            onValueChange={setCategory}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SearchInput
            containerClassName="w-60"
            placeholder="Search asset..."
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
                  onValueChange={(value) => setFilter(value as MarketFilter)}
                >
                  {MARKET_FILTERS.map(({ value, label }) => (
                    <DropdownMenuRadioItem key={value} value={value}>
                      {label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Select
            value={currency}
            onValueChange={(value) => setCurrency(value as string)}
          >
            <SelectTrigger
              aria-label="Display currency"
              className="h-9 min-w-20 border-border bg-accent text-[13px] data-[size=default]:h-9 lg:data-[size=default]:h-10 dark:bg-accent"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              {fxRates.map(({ code }) => (
                <SelectItem key={code} value={code}>
                  {code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
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
                    No assets match these filters.
                  </TableCell>
                </TableRow>
              )}
              {sortedRows.map((asset) => {
                const change = asset.change[range]
                const isWatched = watched.has(asset.symbol)
                return (
                  <TableRow key={asset.symbol} className="hover:bg-accent">
                    <TableCell className="px-4 font-mono text-sm text-muted-foreground">
                      {asset.rank}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <TokenAvatar symbol={asset.symbol} />
                        <div className="flex flex-col">
                          <span className="flex items-center gap-1.5 text-sm font-medium">
                            {asset.name}
                            {isWatched && (
                              <HugeiconsIcon
                                aria-label="In your watchlist"
                                className="text-primary"
                                fill="currentColor"
                                icon={StarIcon}
                                size={12}
                              />
                            )}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            {asset.symbol}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 text-right font-mono text-sm tabular-nums">
                      <AnimatedNumber
                        format={money.price}
                        value={asset.price * fx.rate}
                      />
                    </TableCell>
                    <TableCell className="px-4 text-right font-mono text-sm tabular-nums">
                      <AnimatedNumber
                        format={money.compact}
                        value={asset.fdv * fx.rate}
                      />
                    </TableCell>
                    <TableCell className="px-4 text-right font-mono text-sm tabular-nums">
                      <AnimatedNumber
                        format={money.compact}
                        value={asset.volume * fx.rate}
                      />
                    </TableCell>
                    <TableCell className="px-4 text-right">
                      <TrendBadge
                        className="text-sm"
                        digits={2}
                        value={change}
                      />
                    </TableCell>
                    <TableCell className="px-4">
                      <LazySparkline
                        className="mx-auto w-36"
                        seed={`${asset.symbol}-${range}`}
                        trend={change}
                      />
                    </TableCell>
                    <TableCell className="px-4 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          aria-label={`${asset.name} actions`}
                          className="inline-flex size-8 items-center justify-center border border-border text-muted-foreground transition-colors outline-none hover:bg-foreground/[0.04] hover:text-foreground"
                        >
                          <HugeiconsIcon icon={MoreHorizontalIcon} size={16} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem
                            onClick={() => router.push("/trade")}
                          >
                            Trade {asset.symbol}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => toggleWatch(asset.symbol)}
                          >
                            {isWatched
                              ? "Remove from watchlist"
                              : "Add to watchlist"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => router.push("/portfolio")}
                          >
                            View in portfolio
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
