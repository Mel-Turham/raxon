import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"
import type { Trade } from "@/features/trade/types"
import { ListCard } from "@/shared/components/molecules/list-card"

import { TradesTable } from "./trades-table"

export const RunningTrades = ({ trades }: { trades: Trade[] }) => (
  <ListCard
    title="Running trade"
    action={
      <Link
        href="/portfolio"
        className="inline-flex items-center gap-1 text-sm text-foreground/90 transition-colors hover:text-foreground"
      >
        See All
        <HugeiconsIcon icon={ArrowUpRight01Icon} size={16} />
      </Link>
    }
  >
    <TradesTable trades={trades} />
  </ListCard>
)
