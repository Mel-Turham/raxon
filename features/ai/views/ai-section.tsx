import type { ReactNode } from "react"

import { getAiSources } from "@/features/integrations"
import { getWalletAssets } from "@/features/wallet/api/wallet"
import { UserAvatar } from "@/shared/components/atoms/user-avatar"
import { CURRENT_USER } from "@/shared/config"
import { getAiInsights } from "../api/ai"
import { AiShell } from "./ai-shell"

export async function AiSection({ children }: { children: ReactNode }) {
  const [insights, walletAssets, aiSources] = await Promise.all([
    getAiInsights(),
    getWalletAssets(),
    getAiSources(),
  ])

  return (
    <AiShell
      aiSources={aiSources}
      insights={insights}
      userAvatar={
        <UserAvatar className="size-8 rounded-full" seed={CURRENT_USER.email} />
      }
      walletAssets={walletAssets}
    >
      {children}
    </AiShell>
  )
}
