"use client"

import { AiChat } from "../components/ai-chat"
import {
  HealthCard,
  SentimentCard,
  SignalsCard,
} from "../components/insights-cards"
import { useAiWorkspace } from "../state/ai-workspace"

export function AiView({ draft }: { draft: string }) {
  const { chat, insights, walletAssets, aiSources, newChat } = useAiWorkspace()

  return (
    <div className="flex min-h-0 flex-1">
      <AiChat
        assets={walletAssets}
        draft={draft}
        planName={insights.plan.name}
        sources={aiSources}
        isStreaming={chat.isStreaming}
        messages={chat.messages}
        onEdit={chat.edit}
        onRegenerate={chat.regenerate}
        onReset={newChat}
        onSend={chat.send}
        onStop={chat.stop}
      />
      <aside className="hidden w-[340px] shrink-0 flex-col gap-3 overflow-y-auto border-l border-border p-3 *:shrink-0 xl:flex">
        <SentimentCard sentiment={insights.sentiment} />
        <SignalsCard onAsk={chat.send} signals={insights.signals} />
        <HealthCard health={insights.health} />
      </aside>
    </div>
  )
}
