import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Trade } from "@/features/trade/types"
import { AnimatedNumber } from "@/shared/components/atoms/animated-number"
import { LocalTime } from "@/shared/components/atoms/local-time"
import { LIST_TABLE } from "@/shared/components/molecules/list-table"
import { decimalFormat } from "@/shared/lib/format"
import { cn } from "@/shared/lib/utils"

const PRICE_FORMAT = decimalFormat(2, 4)
const AMOUNT_FORMAT = decimalFormat(2, 5)

export const SIDE_TEXT_CLASS = {
  buy: "text-success",
  sell: "text-destructive",
} as const

type TradesTableProps = {
  trades: Trade[]
  className?: string
}

export const TradesTable = ({ trades, className }: TradesTableProps) => (
  <Table className={className}>
    <TableHeader className={LIST_TABLE.header}>
      <TableRow className={LIST_TABLE.row}>
        <TableHead className={LIST_TABLE.head}>Price</TableHead>
        <TableHead className={cn(LIST_TABLE.head, "text-center")}>
          Amount
        </TableHead>
        <TableHead className={cn(LIST_TABLE.head, "text-right")}>
          Time
        </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody className="font-mono text-[13px] tabular-nums">
      {trades.map((trade) => (
        <TableRow key={trade.id} className={LIST_TABLE.row}>
          <TableCell
            className={cn(LIST_TABLE.cell, SIDE_TEXT_CLASS[trade.side])}
          >
            <AnimatedNumber format={PRICE_FORMAT} value={trade.price} />
          </TableCell>
          <TableCell className={cn(LIST_TABLE.cell, "text-center")}>
            <AnimatedNumber format={AMOUNT_FORMAT} value={trade.amount} />
          </TableCell>
          <TableCell className={cn(LIST_TABLE.cell, "text-right")}>
            <LocalTime value={trade.executedAt} />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
)
