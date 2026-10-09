"use client"

import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"

import { AnimatedNumber } from "@/components/shared/animated-number"
import { SegmentedTabs } from "@/components/shared/segmented-tabs"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import type { OrderBook as OrderBookData, Trade } from "@/lib/api/types"
import { CURRENCY_FORMAT, decimalFormat } from "@/lib/format"
import { cn } from "@/lib/utils"

import { TradesTable } from "./trades-table"

const TABS = ["Order Book", "Trade history"] as const
type Tab = (typeof TABS)[number]

const VIEWS = [
  { value: "both", label: "Bids and asks" },
  { value: "asks", label: "Asks only" },
  { value: "bids", label: "Bids only" },
] as const
type View = (typeof VIEWS)[number]["value"]

const AMOUNT_FORMAT = decimalFormat(5)
const PRICE_FORMAT = decimalFormat(2)
const CHANGE_FORMAT = {
  ...decimalFormat(2),
  signDisplay: "exceptZero",
} as const

const SIDE_STYLE = {
  asks: { text: "text-destructive", bar: "bg-destructive/12" },
  bids: { text: "text-success", bar: "bg-success/12" },
} as const

/** Mini glyph of the view toggle: which halves of the book are shown. */
const ViewGlyph = ({ view }: { view: View }) => (
  <span aria-hidden className="grid size-3.5 grid-rows-2 gap-px">
    <span className={view === "bids" ? "bg-success" : "bg-destructive"} />
    <span className={view === "asks" ? "bg-destructive" : "bg-success"} />
  </span>
)

type BookSideProps = {
  side: keyof typeof SIDE_STYLE
  levels: OrderBookData["asks"]
  maxAmount: number
}

const BookSide = ({ side, levels, maxAmount }: BookSideProps) => {
  const style = SIDE_STYLE[side]

  return (
    <ul className="flex flex-col font-mono text-[13px] tabular-nums">
      {levels.map(({ price, amount }) => (
        <li
          key={price}
          className="relative flex h-7 items-center justify-between"
        >
          {/* Depth bar: share of the largest order on this side. */}
          <span
            aria-hidden
            className={cn(
              "absolute inset-y-0.5 right-0 transition-[width] duration-500",
              style.bar
            )}
            style={{ width: `${(amount / maxAmount) * 100}%` }}
          />
          <AnimatedNumber
            className="relative"
            format={AMOUNT_FORMAT}
            value={amount}
          />
          <AnimatedNumber
            className={cn("relative pr-1", style.text)}
            format={PRICE_FORMAT}
            value={price}
          />
        </li>
      ))}
    </ul>
  )
}

const LastPrice = ({ book }: { book: OrderBookData }) => {
  const isUp = book.lastChange >= 0

  return (
    <button
      type="button"
      className="flex items-center justify-between border-y border-border py-2.5 text-sm transition-colors hover:bg-foreground/[0.03]"
    >
      <span className="flex items-center gap-2 font-mono tabular-nums">
        <AnimatedNumber
          className="text-muted-foreground"
          format={CHANGE_FORMAT}
          value={book.lastChange}
        />
        <AnimatedNumber
          className={isUp ? "text-success" : "text-destructive"}
          format={CURRENCY_FORMAT}
          value={book.lastPrice}
        />
      </span>
      <HugeiconsIcon
        icon={ArrowRight01Icon}
        size={16}
        className="text-muted-foreground"
      />
    </button>
  )
}

type OrderBookProps = {
  book: OrderBookData
  trades: Trade[]
}

export const OrderBook = ({ book, trades }: OrderBookProps) => {
  const [tab, setTab] = useState<Tab>("Order Book")
  const [view, setView] = useState<View>("both")

  const maxAmount = Math.max(
    ...book.asks.map((level) => level.amount),
    ...book.bids.map((level) => level.amount)
  )
  // Asks are listed from the highest price down to the spread.
  const asks = [...book.asks].reverse()

  return (
    <Card className="gap-3">
      <CardHeader>
        <SegmentedTabs options={TABS} value={tab} onValueChange={setTab} />
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        {tab === "Trade history" ? (
          <TradesTable trades={trades} />
        ) : (
          <>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              View
              <ToggleGroup
                spacing={1}
                value={[view]}
                onValueChange={([next]) => next && setView(next as View)}
              >
                {VIEWS.map(({ value, label }) => (
                  <ToggleGroupItem
                    key={value}
                    aria-label={label}
                    value={value}
                    className="size-7 min-w-7 p-0 opacity-60 hover:bg-foreground/[0.04] data-pressed:bg-muted data-pressed:opacity-100"
                  >
                    <ViewGlyph view={value} />
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>

            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Amount ({book.base})</span>
              <span>Price ({book.quote})</span>
            </div>

            {view !== "bids" && (
              <BookSide side="asks" levels={asks} maxAmount={maxAmount} />
            )}
            <LastPrice book={book} />
            {view !== "asks" && (
              <BookSide side="bids" levels={book.bids} maxAmount={maxAmount} />
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
