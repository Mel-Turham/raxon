"use client"

import { type ReactNode, useState } from "react"

import { AnimatedNumber } from "@/components/shared/animated-number"
import { LIST_TABLE } from "@/components/shared/list-table"
import { LocalTime } from "@/components/shared/local-time"
import { SegmentedTabs } from "@/components/shared/segmented-tabs"
import {
  ALIGN_CLASS,
  type Align,
  SortableHeader,
} from "@/components/shared/sortable-header"
import { TokenAvatar } from "@/components/shared/token-avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ORDER_TABS, type OrderTab } from "@/constants"
import type { Order, OrderStatus } from "@/lib/api/types"
import { decimalFormat } from "@/lib/format"
import { cn } from "@/lib/utils"
import { useSortedRows } from "@/hooks/use-sorted-rows"

import { SIDE_TEXT_CLASS } from "./trades-table"

const PRICE_FORMAT = decimalFormat(2, 4)
const AMOUNT_FORMAT = decimalFormat(2, 4)

type Column = {
  key: string
  label: string
  align: Align
  sortValue?: (order: Order) => number | string
  render: (order: Order) => ReactNode
}

const quoteOf = (pair: string) => pair.split("/")[1]

const MarketCell = ({ pair }: { pair: string }) => (
  <span className="flex items-center gap-2.5 font-sans font-medium">
    <TokenAvatar symbol={pair.split("/")[0]} className="size-7" />
    {pair}
  </span>
)

const STATUS_CLASS: Record<OrderStatus, string> = {
  open: "text-foreground",
  filled: "text-success",
  cancelled: "text-muted-foreground",
}

const MARKET_COLUMN: Column = {
  key: "pair",
  label: "Market",
  align: "left",
  render: (order) => <MarketCell pair={order.pair} />,
}

const AMOUNT_COLUMN: Column = {
  key: "amount",
  label: "Amount",
  align: "center",
  sortValue: (order) => order.amount,
  render: (order) => (
    <AnimatedNumber format={AMOUNT_FORMAT} value={order.amount} />
  ),
}

const COLUMNS: Record<OrderTab, Column[]> = {
  "Active Order": [
    MARKET_COLUMN,
    {
      key: "entryPrice",
      label: "Entry Price",
      align: "center",
      sortValue: (order) => order.entryPrice,
      render: (order) => (
        <AnimatedNumber format={PRICE_FORMAT} value={order.entryPrice} />
      ),
    },
    {
      key: "margin",
      label: "Margin",
      align: "center",
      sortValue: (order) => order.margin,
      // Colored by the position's profit and loss.
      render: (order) => (
        <AnimatedNumber
          className={order.pnl >= 0 ? "text-success" : "text-destructive"}
          format={decimalFormat(2)}
          value={order.margin}
        />
      ),
    },
    AMOUNT_COLUMN,
    {
      key: "value",
      label: "Order Value",
      align: "right",
      sortValue: (order) => order.value,
      render: (order) => (
        <AnimatedNumber
          format={decimalFormat(2)}
          suffix={` ${quoteOf(order.pair)}`}
          value={order.value}
        />
      ),
    },
  ],
  "Order History": [
    MARKET_COLUMN,
    {
      key: "side",
      label: "Side",
      align: "center",
      sortValue: (order) => order.side,
      render: (order) => (
        <span
          className={cn("font-sans capitalize", SIDE_TEXT_CLASS[order.side])}
        >
          {order.side}
        </span>
      ),
    },
    {
      key: "entryPrice",
      label: "Price",
      align: "center",
      sortValue: (order) => order.entryPrice,
      render: (order) => (
        <AnimatedNumber format={PRICE_FORMAT} value={order.entryPrice} />
      ),
    },
    AMOUNT_COLUMN,
    {
      key: "status",
      label: "Status",
      align: "center",
      sortValue: (order) => order.status,
      render: (order) => (
        <span
          className={cn("font-sans capitalize", STATUS_CLASS[order.status])}
        >
          {order.status}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Time",
      align: "right",
      sortValue: (order) => order.createdAt,
      render: (order) => <LocalTime value={order.createdAt} />,
    },
  ],
}

/** Stable sort getters per tab, derived from the column definitions. */
const SORT_GETTERS = Object.fromEntries(
  ORDER_TABS.map((tab) => [
    tab,
    Object.fromEntries(
      COLUMNS[tab].flatMap(({ key, sortValue }) =>
        sortValue ? [[key, sortValue]] : []
      )
    ),
  ])
) as Record<OrderTab, Record<string, (order: Order) => number | string>>

const OrdersTable = ({ tab, orders }: { tab: OrderTab; orders: Order[] }) => {
  const { sortedRows, sort, toggleSort } = useSortedRows(
    orders,
    SORT_GETTERS[tab]
  )

  return (
    <Table>
      <TableHeader className={LIST_TABLE.header}>
        <TableRow className={LIST_TABLE.row}>
          {COLUMNS[tab].map(({ key, label, align, sortValue }) => (
            <TableHead
              key={key}
              className={cn(LIST_TABLE.head, ALIGN_CLASS[align])}
            >
              {sortValue ? (
                <SortableHeader
                  active={sort?.key === key}
                  align={align}
                  label={label}
                  onSort={() => toggleSort(key)}
                />
              ) : (
                label
              )}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody className="font-mono text-[13px] tabular-nums">
        {sortedRows.map((order) => (
          <TableRow key={order.id} className={LIST_TABLE.row}>
            {COLUMNS[tab].map(({ key, align, render }) => (
              <TableCell
                key={key}
                className={cn(LIST_TABLE.cell, "py-3", ALIGN_CLASS[align])}
              >
                {render(order)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

type OrdersCardProps = {
  active: Order[]
  history: Order[]
}

export const OrdersCard = ({ active, history }: OrdersCardProps) => {
  const [tab, setTab] = useState<OrderTab>("Active Order")

  return (
    <Card className="gap-3">
      <CardHeader>
        <SegmentedTabs
          options={ORDER_TABS}
          value={tab}
          onValueChange={setTab}
        />
      </CardHeader>
      <CardContent>
        {/* key: each tab keeps its own sort state. */}
        <OrdersTable
          key={tab}
          orders={tab === "Active Order" ? active : history}
          tab={tab}
        />
      </CardContent>
    </Card>
  )
}
