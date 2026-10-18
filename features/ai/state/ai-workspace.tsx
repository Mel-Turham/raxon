"use client"

import { usePathname, useRouter } from "next/navigation"
import { createContext, type ReactNode, use, useEffect, useState } from "react"

import { toast } from "@/components/ui/toast"
import type { AiSource } from "@/features/integrations"
import type { WalletAsset } from "@/features/wallet"
import type { ConversationPatch } from "../components/ai-sidebar"
import { AI_CHAT_PATH, AI_CONVERSATIONS_KEY, AI_PLAN } from "../constants"
import { useChat } from "../hooks/use-chat"
import type { AiConversation, AiInsights, AiPlan, ChatMessage } from "../types"

const TITLE_LENGTH = 60

type AiWorkspaceValue = {
  insights: AiInsights
  plan: AiPlan
  walletAssets: WalletAsset[]
  aiSources: AiSource[]
  chat: ReturnType<typeof useChat>
  conversations: AiConversation[]
  activeId: string | null
  newChat: () => void
  openConversation: (conversation: AiConversation) => void
  updateConversation: (id: string, patch: ConversationPatch) => void
  deleteConversation: (id: string) => void
  shareConversation: (id: string) => Promise<void>
}

const AiWorkspaceContext = createContext<AiWorkspaceValue | null>(null)

const readConversations = (): AiConversation[] => {
  try {
    const stored: unknown = JSON.parse(
      localStorage.getItem(AI_CONVERSATIONS_KEY) ?? "[]"
    )
    return Array.isArray(stored) ? stored.filter(isConversation) : []
  } catch {
    return []
  }
}

const isMessage = (value: unknown): value is ChatMessage => {
  const message = value as Partial<ChatMessage> | null
  return (
    typeof message?.id === "string" &&
    typeof message.createdAt === "number" &&
    typeof message.text === "string" &&
    (message.role === "user" || message.role === "assistant")
  )
}

const isConversation = (value: unknown): value is AiConversation => {
  const conversation = value as Partial<AiConversation> | null
  return (
    typeof conversation?.id === "string" &&
    typeof conversation.title === "string" &&
    typeof conversation.updatedAt === "number" &&
    Array.isArray(conversation.messages) &&
    conversation.messages.every(isMessage)
  )
}

const writeConversations = (conversations: AiConversation[]) => {
  try {
    localStorage.setItem(AI_CONVERSATIONS_KEY, JSON.stringify(conversations))
  } catch {}
}

const isToday = (timestamp: number) =>
  new Date(timestamp).toDateString() === new Date().toDateString()

const questionsToday = (conversations: AiConversation[]) =>
  conversations
    .flatMap((conversation) => conversation.messages)
    .filter((message) => message.role === "user" && isToday(message.createdAt))
    .length

const titleOf = (messages: ChatMessage[]) => {
  const first = messages.find((message) => message.role === "user")
  return first?.role === "user" ? first.text.slice(0, TITLE_LENGTH) : "New chat"
}

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
  const chat = useChat(aiSources)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [conversations, setConversations] = useState<AiConversation[]>([])
  const [isRestored, setIsRestored] = useState(false)

  useEffect(() => {
    setConversations(readConversations())
    setIsRestored(true)
  }, [])

  useEffect(() => {
    if (isRestored) writeConversations(conversations)
  }, [conversations, isRestored])

  useEffect(() => {
    if (chat.isStreaming || chat.messages.length === 0) return
    const id = activeId ?? crypto.randomUUID()
    const saved = {
      title: titleOf(chat.messages),
      messages: chat.messages,
      updatedAt: Date.now(),
    }
    setConversations((current) =>
      current.some((item) => item.id === id)
        ? current.map((item) =>
            item.id === id && item.messages !== saved.messages
              ? { ...item, ...saved }
              : item
          )
        : [
            { id, archived: false, pinned: false, strategy: null, ...saved },
            ...current,
          ]
    )
    if (!activeId) setActiveId(id)
  }, [activeId, chat.isStreaming, chat.messages])

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
    chat.load(conversation.messages)
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
        plan: { ...AI_PLAN, used: questionsToday(conversations) },
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
