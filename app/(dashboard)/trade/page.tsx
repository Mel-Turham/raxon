import type { Metadata } from "next"

import { parseTradePair, TradeView } from "@/features/trade"

export const metadata: Metadata = {
  title: "Trading",
  description: "View market charts, the order book, and your trading activity.",
}

export default async function Page({ searchParams }: PageProps<"/trade">) {
  return <TradeView pair={parseTradePair((await searchParams).pair)} />
}
