import type { AiSource } from "@/features/integrations"
export type SignalBias = "bullish" | "neutral" | "bearish"

export type MarketSentiment = {
  score: number
  history: number[]
}

export type HealthMetric = {
  label: string
  value: number
  hint: string
}

export type PortfolioHealth = {
  score: number
  metrics: HealthMetric[]
}

export type AiSignal = {
  symbol: string
  name: string
  bias: SignalBias
  confidence: number
  change: number
  horizon: string
}

export type AiConversation = {
  id: string
  title: string
  messages: ChatMessage[]
  updatedAt: number
  archived: boolean
  pinned: boolean
  strategy: string | null
}

export type AiPlan = {
  name: string
  used: number
  limit: number
  discount: number
}

export type AiInsights = {
  sentiment: MarketSentiment
  health: PortfolioHealth
  signals: AiSignal[]
}

export type ChatTool = "reason" | "scan" | "web"

export type ChatAttachment = {
  id: string
  kind: "image" | "file" | "asset" | "link"
  name: string
  meta: string
  url?: string
  symbol?: string
}

export type ChatMessage =
  | {
      id: string
      role: "user"
      text: string
      attachments: ChatAttachment[]
      createdAt: number
    }
  | {
      id: string
      role: "assistant"
      createdAt: number
      text: string
      reasoning: string[]
      stepsDone: number
      thoughtMs: number
      status: "thinking" | "streaming" | "done" | "stopped"
      sources: AiSource[]
      nudge?: "connect-exchange"
    }
