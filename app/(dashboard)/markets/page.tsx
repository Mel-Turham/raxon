import type { Metadata } from "next"

import { MarketsView } from "@/features/markets"

export const metadata: Metadata = {
  title: "Markets",
  description:
    "Live crypto prices, top movers, sector performance, news and market sentiment.",
}

export default function MarketsPage() {
  return <MarketsView />
}
