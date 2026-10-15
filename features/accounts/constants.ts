import {
  ChartLineData02Icon,
  Coins01Icon,
  Rocket01Icon,
} from "@hugeicons/core-free-icons"

import type { AccountType, MarginMode } from "./types"

export const ACCOUNT_TYPES: Record<
  AccountType,
  {
    label: string
    description: string
    icon: typeof Coins01Icon
    maxLeverage: number
    defaultLeverage: number
    leverageMarks: number[]
    leveraged: boolean
  }
> = {
  spot: {
    label: "Spot",
    description: "Buy and hold crypto with your own funds. No borrowing.",
    icon: Coins01Icon,
    maxLeverage: 1,
    defaultLeverage: 1,
    leverageMarks: [],
    leveraged: false,
  },
  margin: {
    label: "Margin",
    description: "Borrow against your balance to trade spot pairs.",
    icon: ChartLineData02Icon,
    maxLeverage: 10,
    defaultLeverage: 3,
    leverageMarks: [1, 3, 5, 10],
    leveraged: true,
  },
  futures: {
    label: "Futures",
    description: "Trade perpetual contracts, long or short.",
    icon: Rocket01Icon,
    maxLeverage: 50,
    defaultLeverage: 10,
    leverageMarks: [1, 10, 25, 50],
    leveraged: true,
  },
}

export const ACCOUNT_TYPE_IDS = Object.keys(ACCOUNT_TYPES) as AccountType[]

export const MARGIN_MODES: Record<
  MarginMode,
  { label: string; description: string }
> = {
  cross: {
    label: "Cross",
    description:
      "Your whole account balance backs every position. Fewer liquidations, but one bad trade can drain the account.",
  },
  isolated: {
    label: "Isolated",
    description:
      "Each position only risks the margin you assign to it. Losses stay contained to that position.",
  },
}

export const ACCOUNT_COLORS = [
  "#d85a32",
  "#22a55b",
  "#3b82f6",
  "#a855f7",
  "#f5c542",
  "#e5484d",
] as const

export const ACCOUNT_NAME_MIN = 3
export const ACCOUNT_NAME_MAX = 20

export const VERIFICATION_CODE_LENGTH = 6
export const VERIFICATION_RESEND_SECONDS = 30
export const DEMO_VERIFICATION_CODE = "123456"
