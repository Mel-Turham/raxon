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
  marginUsage: {
    label: "Margin Usage",
    icon: PercentSquareIcon,
    accent: "var(--token-btc)",
  },
  buyingPower: {
    label: "Buying Power",
    icon: ShoppingCart01Icon,
    accent: "var(--destructive)",
  },
  freeCollateral: {
    label: "Free Collateral",
    icon: SafeIcon,
    accent: "var(--success)",
  },
}
