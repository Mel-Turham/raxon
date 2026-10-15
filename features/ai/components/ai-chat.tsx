"use client"

import { PlusSignIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useAnimate } from "motion/react"
import {
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"

import { Button } from "@/components/ui/button"
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import type { AiSource } from "@/features/integrations"
import type { WalletAsset } from "@/features/wallet"
import { SOFT_TRANSITION } from "@/shared/lib/motion"
import type { ChatAttachment, ChatMessage } from "../types"
import { AiEmptyState } from "./ai-empty-state"
import { ChatComposer } from "./composer/chat-composer"
import { ChatMessageView } from "./chat-message"

type AiChatProps = {
  assets: WalletAsset[]
  draft: string
  sources: AiSource[]
  planName: string
  messages: ChatMessage[]
  isStreaming: boolean
  onSend: (prompt: string, attachments?: ChatAttachment[]) => void
  onStop: () => void
  onReset: () => void
  onRegenerate: () => void
  onEdit: (id: string, text: string) => void
}

export function AiChat({
  assets,
  draft,
  sources,
  planName,
  messages,
  isStreaming,
  onSend,
  onStop,
  onReset,
  onRegenerate,
  onEdit,
}: AiChatProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const typingTimer = useRef<number | undefined>(undefined)
  const [isTyping, setIsTyping] = useState(false)

  const markTyping = () => {
    setIsTyping(true)
    window.clearTimeout(typingTimer.current)
    typingTimer.current = window.setTimeout(() => setIsTyping(false), 900)
  }

  useEffect(() => () => window.clearTimeout(typingTimer.current), [])
  const { isMobile } = useSidebar()
  const last = messages.at(-1)
  const progress = last?.role === "assistant" ? last.revealed : 0
  const followUps =
    last?.role === "assistant" && last.status === "done" ? last.followUps : []

  useEffect(() => {
    const node = scrollRef.current
    if (node) node.scrollTo({ top: node.scrollHeight })
  }, [messages.length, progress])

  const welcomeSlot = useRef<HTMLDivElement>(null)
  const [glideFrom, setGlideFrom] = useState<number | null>(null)

  const send = (prompt: string, attachments?: ChatAttachment[]) => {
    if (messages.length === 0 && welcomeSlot.current) {
      setGlideFrom(welcomeSlot.current.getBoundingClientRect().top)
    }
    onSend(prompt, attachments)
  }

  const composer = (
    <ChatComposer
      assets={assets}
      draft={draft}
      planName={planName}
      sources={sources}
      followUps={followUps}
      isStreaming={isStreaming}
      onSend={send}
      onStop={onStop}
      onTyping={markTyping}
    />
  )

  return (
    <section className="flex h-full min-w-0 flex-1 flex-col">
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-4">
        {isMobile && (
          <>
            <SidebarTrigger className="-ml-1 text-muted-foreground" />
            <span className="h-5 w-px bg-border" />
          </>
        )}
        <span className="flex items-center gap-2 text-sm font-medium">
          Assistant
          <span className="bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] text-primary">
            Beta
          </span>
        </span>
        <Button
          className="ml-auto h-8 gap-1.5 px-3"
          disabled={!messages.length}
          onClick={onReset}
          variant="outline"
        >
          <HugeiconsIcon icon={PlusSignIcon} size={14} />
          New chat
        </Button>
      </header>

      <div
        className="flex min-h-0 flex-1 flex-col overflow-y-auto"
        ref={scrollRef}
      >
        {messages.length === 0 ? (
          <AiEmptyState
            composer={<div ref={welcomeSlot}>{composer}</div>}
            isTyping={isTyping}
            onPick={send}
            sources={sources}
          />
        ) : (
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-2 px-4 py-6">
            {messages.map((message) => (
              <ChatMessageView
                key={message.id}
                message={message}
                onEdit={isStreaming ? undefined : onEdit}
                onRegenerate={
                  message === last && !isStreaming ? onRegenerate : undefined
                }
              />
            ))}
          </div>
        )}
      </div>

      {messages.length > 0 && (
        <div className="mx-auto w-full max-w-3xl px-4 pt-2 pb-4">
          <Glide from={glideFrom} onDone={setGlideFrom}>
            {composer}
          </Glide>
        </div>
      )}
    </section>
  )
}

function Glide({
  from,
  onDone,
  children,
}: {
  from: number | null
  onDone: (value: null) => void
  children: ReactNode
}) {
  const [scope, animate] = useAnimate<HTMLDivElement>()

  useLayoutEffect(() => {
    if (from === null || !scope.current) return
    const delta = from - scope.current.getBoundingClientRect().top
    animate(
      scope.current,
      { y: [delta, 0] },
      { ...SOFT_TRANSITION, duration: 0.55 }
    ).then(() => onDone(null))
  }, [animate, from, onDone, scope])

  return <div ref={scope}>{children}</div>
}
