import {
  Coins01Icon,
  PercentSquareIcon,
  SafeIcon,
  ShoppingCart01Icon,
} from "@hugeicons/core-free-icons"

import type { PortfolioMetricKey } from "@/features/portfolio/types"

export const PORTFOLIO_METRICS: Record<
  PortfolioMetricKey,
  { label: string; icon: typeof Coins01Icon; accent: string }
> = {
  portfolioValue: {
    label: "Portfolio Value",
    icon: Coins01Icon,
    accent: "var(--primary)",
  },
  buyingPower: {
    label: "Buying Power",
    icon: ShoppingCart01Icon,
    accent: "var(--success)",
  },
  inOrders: {
    label: "In Orders",
    icon: SafeIcon,
    accent: "var(--token-btc)",
  },
  topHolding: {
    label: "Top Holding",
    icon: PercentSquareIcon,
    accent: "var(--destructive)",
  },
}
