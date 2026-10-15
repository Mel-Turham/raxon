"use client"

import type { ReactNode } from "react"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import type { AiSource } from "@/features/integrations"
import type { WalletAsset } from "@/features/wallet"
import { AiSidebar } from "../components/ai-sidebar"
import { AiWorkspaceProvider, useAiWorkspace } from "../state/ai-workspace"
import type { AiInsights } from "../types"

type AiShellProps = {
  insights: AiInsights
  walletAssets: WalletAsset[]
  aiSources: AiSource[]
  userAvatar: ReactNode
  children: ReactNode
}

function WorkspaceSidebar({ userAvatar }: { userAvatar: ReactNode }) {
  const workspace = useAiWorkspace()

  return (
    <AiSidebar
      activeId={workspace.activeId}
      conversations={workspace.conversations}
      onDelete={workspace.deleteConversation}
      onNewChat={workspace.newChat}
      onOpen={workspace.openConversation}
      onShare={workspace.shareConversation}
      onUpdate={workspace.updateConversation}
      plan={workspace.insights.plan}
      userAvatar={userAvatar}
    />
  )
}

export function AiShell({
  insights,
  walletAssets,
  aiSources,
  userAvatar,
  children,
}: AiShellProps) {
  return (
    <AiWorkspaceProvider
      aiSources={aiSources}
      insights={insights}
      walletAssets={walletAssets}
    >
      <SidebarProvider className="h-dvh min-h-0">
        <WorkspaceSidebar userAvatar={userAvatar} />
        <SidebarInset className="min-h-0">{children}</SidebarInset>
      </SidebarProvider>
    </AiWorkspaceProvider>
  )
}
