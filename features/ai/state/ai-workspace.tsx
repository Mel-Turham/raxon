"use client"

import { usePathname, useRouter } from "next/navigation"
import { createContext, type ReactNode, use, useState } from "react"

import { toast } from "@/components/ui/toast"
import type { AiSource } from "@/features/integrations"
import type { WalletAsset } from "@/features/wallet"
import type { ConversationPatch } from "../components/ai-sidebar"
import { AI_CHAT_PATH } from "../constants"
import { useMockChat } from "../hooks/use-mock-chat"
import type { AiConversation, AiInsights } from "../types"

type AiWorkspaceValue = {
  insights: AiInsights
  walletAssets: WalletAsset[]
  aiSources: AiSource[]
  chat: ReturnType<typeof useMockChat>
  conversations: AiConversation[]
  activeId: string | null
  newChat: () => void
  openConversation: (conversation: AiConversation) => void
  updateConversation: (id: string, patch: ConversationPatch) => void
  deleteConversation: (id: string) => void
  shareConversation: (id: string) => Promise<void>
}

const AiWorkspaceContext = createContext<AiWorkspaceValue | null>(null)

export function AiWorkspaceProvider({
  insights,
  walletAssets,
  aiSources,
  children,
}: {
  insights: AiInsights
  walletAssets: WalletAsset[]
  aiSources: AiSource[]
  children: ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const chat = useMockChat(walletAssets, aiSources)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [conversations, setConversations] = useState(insights.conversations)

  const showChat = () => {
    if (pathname !== AI_CHAT_PATH) router.push(AI_CHAT_PATH)
  }

  const newChat = () => {
    setActiveId(null)
    chat.reset()
    showChat()
  }

  const openConversation = (conversation: AiConversation) => {
    setActiveId(conversation.id)
    chat.load(conversation.prompts, conversation.minutesAgo)
    showChat()
  }

  const updateConversation = (id: string, patch: ConversationPatch) =>
    setConversations((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item))
    )

  const deleteConversation = (id: string) => {
    setConversations((current) => current.filter((item) => item.id !== id))
    if (id === activeId) {
      setActiveId(null)
      chat.reset()
    }
    toast.success("Chat deleted")
  }

  const shareConversation = async (id: string) => {
    await navigator.clipboard
      .writeText(`${window.location.origin}${AI_CHAT_PATH}?chat=${id}`)
      .catch(() => undefined)
    toast.success("Share link copied", {
      description: "Anyone with the link can read this chat.",
    })
  }

  return (
    <AiWorkspaceContext
      value={{
        insights,
        walletAssets,
        aiSources,
        chat,
        conversations,
        activeId,
        newChat,
        openConversation,
        updateConversation,
        deleteConversation,
        shareConversation,
      }}
    >
      {children}
    </AiWorkspaceContext>
  )
}

export function useAiWorkspace() {
  const value = use(AiWorkspaceContext)
  if (!value) {
    throw new Error("useAiWorkspace must be used inside AiWorkspaceProvider")
  }
  return value
}
