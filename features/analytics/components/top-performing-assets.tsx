"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  COMPACT_CURRENCY,
  SIGNED_CURRENCY,
} from "@/features/analytics/helpers/format"
import type { AssetPerformance } from "@/features/analytics/types"
import { AnimatedNumber } from "@/shared/components/atoms/animated-number"
import { TokenAvatar } from "@/shared/components/atoms/token-avatar"
import { SearchInput } from "@/shared/components/molecules/search-input"
import { SegmentedTabs } from "@/shared/components/molecules/segmented-tabs"
import { decimalFormat } from "@/shared/lib/format"
import { cn } from "@/shared/lib/utils"

const INTEGER_FORMAT = decimalFormat(0)

type AssetFilter = "All" | "Winners" | "Losers"

const FILTERS: readonly AssetFilter[] = ["All", "Winners", "Losers"]

type TopPerformingAssetsProps = {
  assets: AssetPerformance[]
}

export function TopPerformingAssets({ assets }: TopPerformingAssetsProps) {
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<AssetFilter>("All")
  const filteredAssets = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return assets.filter((asset) => {
      const matchesQuery =
        !normalizedQuery ||
        asset.name.toLowerCase().includes(normalizedQuery) ||
        asset.symbol.toLowerCase().includes(normalizedQuery)
      const matchesFilter =
        filter === "All" ||
        (filter === "Winners" && asset.netPnl >= 0) ||
        (filter === "Losers" && asset.netPnl < 0)

      return matchesQuery && matchesFilter
    })
  }, [assets, filter, query])

  return (
    <Card className="min-w-0">
      <CardHeader className="gap-4 border-b border-border/70 pb-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <CardTitle className="text-base">Performance by asset</CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">
            Your results per asset over the selected period.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <SearchInput
            aria-label="Search assets"
            className="h-9 w-full sm:w-52"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search assets"
            value={query}
          />
          <SegmentedTabs
            className="w-fit"
            onValueChange={setFilter}
            options={FILTERS}
            value={filter}
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table className="min-w-[48rem] table-fixed">
            <TableHeader>
              <TableRow className="bg-muted/20 hover:bg-muted/20">
                <TableHead className="w-12 pl-4 text-muted-foreground">
                  #
                </TableHead>
                <TableHead className="w-[22%]">Asset</TableHead>
                <TableHead className="w-[10%] text-right">Trades</TableHead>
                <TableHead className="w-[14%] text-right">Volume</TableHead>
                <TableHead className="w-[16%] text-right">Net P&L</TableHead>
                <TableHead className="w-[12%] text-right">Win rate</TableHead>
                <TableHead className="w-[22%] pr-4">Share of P&L</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssets.length > 0 ? (
                filteredAssets.map((asset, index) => {
                  const isPositive = asset.netPnl >= 0
                  return (
                    <TableRow className="h-16" key={asset.symbol}>
                      <TableCell className="pl-4 font-mono text-muted-foreground">
                        {String(index + 1).padStart(2, "0")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <TokenAvatar
                            className="size-9"
                            symbol={asset.symbol}
                          />
                          <div className="min-w-0">
                            <p className="truncate font-medium">{asset.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {asset.symbol}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums">
                        <AnimatedNumber
                          format={INTEGER_FORMAT}
                          value={asset.trades}
                        />
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums">
                        <AnimatedNumber
                          format={COMPACT_CURRENCY}
                          value={asset.volume}
                        />
                      </TableCell>
                      <TableCell
                        className={cn(
                          "text-right font-mono font-medium tabular-nums",
                          isPositive ? "text-success" : "text-destructive"
                        )}
                      >
                        <AnimatedNumber
                          format={SIGNED_CURRENCY}
                          value={asset.netPnl}
                        />
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums">
                        <AnimatedNumber
                          format={INTEGER_FORMAT}
                          suffix="%"
                          value={asset.winRate}
                        />
                      </TableCell>
                      <TableCell className="pr-4">
                        <div className="flex items-center gap-3">
                          <div className="h-1.5 flex-1 overflow-hidden bg-muted">
                            <div
                              className={cn(
                                "h-full transition-[width] duration-500",
                                isPositive ? "bg-success" : "bg-destructive"
                              )}
                              style={{ width: `${asset.share}%` }}
                            />
                          </div>
                          <span className="w-10 text-right font-mono text-xs text-muted-foreground tabular-nums">
                            <AnimatedNumber
                              format={INTEGER_FORMAT}
                              suffix="%"
                              value={asset.share}
                            />
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell
                    className="h-24 text-center text-muted-foreground"
                    colSpan={7}
                  >
                    No assets found.
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
