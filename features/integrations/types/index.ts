import type { BrandLogoId } from "@/shared/types"
import type {
  AUTOMATION_ASSETS,
  AUTOMATION_BRIEF_TIMES,
  AUTOMATION_CHANNEL_IDS,
  AUTOMATION_SIGNAL_BIASES,
  AUTOMATION_TABS,
  AUTOMATION_TRIGGERS,
  INTEGRATION_AUTH_METHODS,
  INTEGRATION_CATEGORIES,
  INTEGRATION_PERMISSION_LABELS,
  INTEGRATION_STATUSES,
  INTEGRATION_TABS,
} from "../constants"

export type IntegrationCategory =
  (typeof INTEGRATION_CATEGORIES)[number]["value"]
export type IntegrationStatus = (typeof INTEGRATION_STATUSES)[number]
export type IntegrationTab = (typeof INTEGRATION_TABS)[number]
export type IntegrationPermission = keyof typeof INTEGRATION_PERMISSION_LABELS
export type IntegrationAuthMethod = (typeof INTEGRATION_AUTH_METHODS)[number]

export type IntegrationLogo = BrandLogoId

export type IntegrationConnection = {
  account: string
  connectedAt: string
  lastSyncAt: string
}

export type Integration = {
  id: string
  name: string
  logo: IntegrationLogo
  category: IntegrationCategory
  description: string
  aiCapability: string
  auth: IntegrationAuthMethod
  permissions: IntegrationPermission[]
  status: IntegrationStatus
  aiAccess: boolean
  connection?: IntegrationConnection
  isPopular?: boolean
}

export type IntegrationsData = {
  integrations: Integration[]
}

export type IntegrationCredentials =
  | {
      method: "api-key"
      apiKey: string
      apiSecret: string
      allowTrading: boolean
      withdrawalsDisabled: boolean
    }
  | { method: "address"; address: string }
  | { method: "oauth" }
  | { method: "webhook" }

export type IntegrationWebhook = {
  url: string
  secret: string
}

export type ConnectIntegrationResult =
  | {
      ok: true
      connection: IntegrationConnection
      permissions: IntegrationPermission[]
      webhook?: IntegrationWebhook
    }
  | { ok: false; error: string }

export type IntegrationRequest = {
  name: string
  category: IntegrationCategory
  note: string
}

export type AiSource = Pick<Integration, "id" | "name" | "logo" | "category">

export type AutomationTriggerType =
  (typeof AUTOMATION_TRIGGERS)[number]["value"]
export type AutomationChannelId = (typeof AUTOMATION_CHANNEL_IDS)[number]
export type AutomationTab = (typeof AUTOMATION_TABS)[number]
export type AutomationAsset = (typeof AUTOMATION_ASSETS)[number]
export type AutomationSignalBias = (typeof AUTOMATION_SIGNAL_BIASES)[number]
export type AutomationBriefTime = (typeof AUTOMATION_BRIEF_TIMES)[number]

export type AutomationCondition =
  | { type: "tradingview-alert" }
  | {
      type: "price-cross"
      asset: AutomationAsset
      direction: "above" | "below"
      price: number
    }
  | { type: "portfolio-drawdown"; percent: number }
  | { type: "ai-signal"; bias: AutomationSignalBias }
  | { type: "whale-transfer"; amountUsd: number }
  | { type: "daily-brief"; time: AutomationBriefTime }

export type Automation = {
  id: string
  name: string
  condition: AutomationCondition
  channelId: AutomationChannelId
  enabled: boolean
  runs: number
  lastRunAt: string | null
  updatedAt: string
}

export type AutomationChannel = {
  id: AutomationChannelId
  name: string
  logo: IntegrationLogo
  isConnected: boolean
}

export type AutomationsData = {
  automations: Automation[]
  channels: AutomationChannel[]
  connectedSources: string[]
}

export type AutomationDraft = {
  name: string
  condition: AutomationCondition
  channelId: AutomationChannelId
}
