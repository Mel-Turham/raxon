import {
  ArrowLeftRightIcon,
  ChartUpIcon,
  CheckmarkCircle02Icon,
  Csv01Icon,
  CustomerSupportIcon,
  SecurityLockIcon,
} from "@hugeicons/core-free-icons"

import type { NotificationType } from "@/features/notifications/types"

export const NOTIFICATION_TYPES: Record<
  NotificationType,
  { title: string; icon: typeof ChartUpIcon; accent: string }
> = {
  security_login: {
    title: "New sign-in",
    icon: SecurityLockIcon,
    accent: "var(--destructive)",
  },
  transfer_request: {
    title: "Transfer request",
    icon: ArrowLeftRightIcon,
    accent: "var(--primary)",
  },
  order_filled: {
    title: "Order filled",
    icon: CheckmarkCircle02Icon,
    accent: "var(--success)",
  },
  support_message: {
    title: "Support",
    icon: CustomerSupportIcon,
    accent: "var(--chart-ma-fast)",
  },
  price_alert: {
    title: "Price alert",
    icon: ChartUpIcon,
    accent: "var(--token-btc)",
  },
  statement_ready: {
    title: "Statement ready",
    icon: Csv01Icon,
    accent: "var(--muted-foreground)",
  },
}

export const NOTIFICATION_TABS = ["All", "Unread", "Archive"] as const

export type NotificationTab = (typeof NOTIFICATION_TABS)[number]

export const NOTIFICATION_PREVIEW_COUNT = 5
