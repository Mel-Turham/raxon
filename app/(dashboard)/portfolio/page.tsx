import type { Metadata } from "next"
import { PortfolioView } from "@/features/portfolio"

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Track your portfolio value, assets, and performance over time.",
}

export default function Page() {
  return <PortfolioView />
}
