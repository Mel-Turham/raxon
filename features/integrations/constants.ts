export const INTEGRATION_CATEGORIES = [
  { value: "exchanges", label: "Exchanges" },
  { value: "wallets", label: "Wallets" },
  { value: "market-data", label: "Market data" },
  { value: "news", label: "News & sentiment" },
  { value: "alerts", label: "Alerts & bots" },
  { value: "tax", label: "Tax & accounting" },
] as const

export const INTEGRATION_STATUSES = [
  "connected",
  "syncing",
  "expired",
  "available",
  "coming-soon",
] as const

export const INTEGRATION_STATUS_LABELS = {
  connected: "Connected",
  syncing: "Syncing",
  expired: "Expired",
  available: "Available",
  "coming-soon": "Coming soon",
} as const

export const INTEGRATION_TABS = ["All", "Connected", "Available"] as const

export const INTEGRATION_PERMISSION_LABELS = {
  read: "Read-only",
  trade: "Trade",
} as const

export const INTEGRATION_AUTH_METHODS = [
  "api-key",
  "address",
  "oauth",
  "webhook",
] as const

export const INTEGRATION_AUTH_LABELS = {
  "api-key": "API key",
  address: "Watch-only address",
  oauth: "Secure sign-in",
  webhook: "Webhook",
} as const

export const INTEGRATION_CATEGORY_LABELS = Object.fromEntries(
  INTEGRATION_CATEGORIES.map(({ value, label }) => [value, label])
) as Record<(typeof INTEGRATION_CATEGORIES)[number]["value"], string>

export const INTEGRATION_ACCESS_SCOPES = {
  exchanges: [
    "Balances and open positions",
    "Order and trade history",
    "Deposit and withdrawal history",
  ],
  wallets: [
    "Token balances across networks",
    "DeFi positions and token approvals",
    "On-chain transaction history",
  ],
  "market-data": ["Market and on-chain metrics", "Alerts you create"],
  news: ["Headlines and social posts", "Sentiment scores per asset"],
  alerts: ["Send alerts, fills and AI signals", "Post daily market briefs"],
  tax: ["Transactions and cost basis", "Realised and unrealised gains"],
} as const

export const INTEGRATION_SAFETY_NOTES = {
  "api-key":
    "Raxon never asks for withdrawal permission. Keys are encrypted and can be revoked at any time.",
  address:
    "Watch-only: Raxon reads public on-chain data and never asks for a seed phrase or private key.",
  oauth:
    "You approve access on the provider's site. Revoke it there or here at any time.",
  webhook:
    "Payloads are signed with a secret only you and Raxon know. Rotate it whenever you want.",
} as const

export const REQUEST_NOTE_MAX = 280

export const AUTOMATION_TRIGGERS = [
  {
    value: "tradingview-alert",
    label: "TradingView alert",
    description: "When one of your TradingView alerts fires",
    logo: "tradingview",
    requires: "tradingview",
  },
  {
    value: "price-cross",
    label: "Price level",
    description: "When an asset crosses a price you set",
    logo: "raxon",
  },
  {
    value: "portfolio-drawdown",
    label: "Portfolio drawdown",
    description: "When your portfolio drops by a set percentage",
    logo: "raxon",
  },
  {
    value: "ai-signal",
    label: "Raxon AI signal",
    description: "When Raxon AI flags a new trading signal",
    logo: "raxon",
  },
  {
    value: "whale-transfer",
    label: "Large wallet transfer",
    description: "When a connected wallet moves a large amount",
    logo: "raxon",
  },
  {
    value: "daily-brief",
    label: "Daily market brief",
    description: "A daily AI summary at the time you choose",
    logo: "raxon",
  },
] as const

export const AUTOMATION_CHANNEL_IDS = [
  "telegram",
  "discord",
  "slack",
  "webhooks",
] as const

export const AUTOMATION_TABS = ["All", "Active", "Paused"] as const

export const AUTOMATION_ASSETS = ["BTC", "ETH", "SOL", "BNB", "XRP"] as const

export const AUTOMATION_SIGNAL_BIASES = ["bullish", "bearish", "any"] as const

export const AUTOMATION_BRIEF_TIMES = [
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "12:00",
  "18:00",
  "21:00",
] as const

export const AUTOMATION_NAME_MAX = 48
