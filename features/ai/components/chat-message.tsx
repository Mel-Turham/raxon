"use client"

import {
  Copy01Icon,
  PencilEdit02Icon,
  Refresh01Icon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  Upload04Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { AnimatePresence, motion } from "motion/react"
import Image from "next/image"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { HintTooltip } from "@/shared/components/molecules/hint-tooltip"
import { SOFT_TRANSITION } from "@/shared/lib/motion"
import { cn } from "@/shared/lib/utils"
import type { ChatMessage } from "../types"
import { useSmoothText } from "../hooks/use-smooth-text"
import { AiMarkdown } from "./ai-markdown"
import { MessageSources } from "./ai-sources"
import { AiOrb } from "./ai-orb"
import { ContextChip } from "./composer/context-chip"
import { ReasoningPanel } from "./reasoning-panel"
import { RAISED_SURFACE } from "./surface"

const TIME = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
})

const RELATIVE = new Intl.RelativeTimeFormat("en", { numeric: "auto" })
const FULL_DATE = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
})
const UNITS = [
  { unit: "day", ms: 86_400_000 },
  { unit: "hour", ms: 3_600_000 },
  { unit: "minute", ms: 60_000 },
] as const

const timeAgo = (timestamp: number) => {
  const elapsed = Date.now() - timestamp
  const match = UNITS.find(({ ms }) => elapsed >= ms)
  if (!match) return "Just now"
  const value = RELATIVE.format(-Math.floor(elapsed / match.ms), match.unit)
  return value.charAt(0).toUpperCase() + value.slice(1)
}

const copyText = async (text: string) => {
  await navigator.clipboard.writeText(text)
  toast.success("Copied to clipboard")
}

type ActionProps = {
  label: string
  icon: typeof Copy01Icon
  onClick: () => void
  isActive?: boolean
}

const Action = ({ label, icon, onClick, isActive }: ActionProps) => (
  <HintTooltip label={label} side="bottom">
    <Button
      aria-label={label}
      aria-pressed={isActive}
      className={cn(
        "size-7 rounded-lg text-muted-foreground hover:text-foreground",
        isActive && "text-primary hover:text-primary"
      )}
      onClick={onClick}
      size="icon-sm"
      variant="ghost"
    >
      <HugeiconsIcon icon={icon} size={14} />
    </Button>
  </HintTooltip>
)

type ChatMessageViewProps = {
  message: ChatMessage
  onRegenerate?: () => void
  onEdit?: (id: string, text: string) => void
}

export function ChatMessageView({
  message,
  onRegenerate,
  onEdit,
}: ChatMessageViewProps) {
  return message.role === "user" ? (
    <UserMessage
      message={message}
      onEdit={onEdit && ((text) => onEdit(message.id, text))}
    />
  ) : (
    <AssistantMessage message={message} onRegenerate={onRegenerate} />
  )
}

const SWAP = {
  initial: { opacity: 0, scale: 0.97, filter: "blur(2px)" },
  animate: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { ...SOFT_TRANSITION, duration: 0.24 },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    filter: "blur(2px)",
    transition: { ...SOFT_TRANSITION, duration: 0.12 },
  },
}

const BUBBLE = `rounded-[20px] rounded-br-md ${RAISED_SURFACE}`

function UserMessage({
  message,
  onEdit,
}: {
  message: Extract<ChatMessage, { role: "user" }>
  onEdit?: (text: string) => void
}) {
  const [draft, setDraft] = useState<string | null>(null)

  const share = async () => {
    await navigator.clipboard
      .writeText(`${window.location.origin}/ai#${message.id}`)
      .catch(() => undefined)
    toast.success("Link to this message copied")
  }

  const submitEdit = () => {
    const text = draft?.trim()
    if (text && text !== message.text) onEdit?.(text)
    setDraft(null)
  }

  return (
    <motion.div
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="group flex origin-bottom-right flex-col items-end gap-1"
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      transition={SOFT_TRANSITION}
    >
      {message.attachments.length > 0 && (
        <div className="flex max-w-[78%] flex-wrap justify-end gap-1.5">
          {message.attachments.map((attachment) =>
            attachment.kind === "image" && attachment.url ? (
              <Image
                alt={attachment.name}
                className="size-20 rounded-2xl border border-foreground/10 object-cover"
                height={80}
                key={attachment.id}
                src={attachment.url}
                unoptimized
                width={80}
              />
            ) : (
              <ContextChip attachment={attachment} key={attachment.id} />
            )
          )}
        </div>
      )}

      <AnimatePresence initial={false} mode="wait">
        {draft === null ? (
          <motion.div
            animate={SWAP.animate}
            exit={SWAP.exit}
            initial={SWAP.initial}
            className={cn("max-w-[78%] origin-right px-4 py-2.5", BUBBLE)}
            key="bubble"
          >
            <p className="text-[15px] leading-6 break-words whitespace-pre-wrap text-foreground">
              {message.text}
            </p>
          </motion.div>
        ) : (
          <motion.div
            animate={SWAP.animate}
            exit={SWAP.exit}
            initial={SWAP.initial}
            className={cn(
              "flex w-full max-w-[78%] origin-right flex-col gap-2 p-3",
              BUBBLE
            )}
            key="editor"
          >
            <textarea
              aria-label="Edit message"
              autoFocus
              className="field-sizing-content min-h-12 w-full resize-none bg-transparent text-[15px] leading-6 text-foreground outline-none"
              onChange={(event) => setDraft(event.target.value)}
              onFocus={(event) =>
                event.currentTarget.setSelectionRange(
                  event.currentTarget.value.length,
                  event.currentTarget.value.length
                )
              }
              onKeyDown={(event) => {
                if (event.key === "Escape") setDraft(null)
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault()
                  submitEdit()
                }
              }}
              value={draft}
            />
            <div className="flex justify-end gap-2">
              <Button
                className="h-8 rounded-full px-3 text-muted-foreground"
                onClick={() => setDraft(null)}
                variant="ghost"
              >
                Cancel
              </Button>
              <Button
                className="h-8 rounded-full bg-foreground px-4 text-background hover:bg-foreground/85"
                disabled={!draft.trim()}
                onClick={submitEdit}
              >
                Send
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {draft === null && (
        <div className="flex items-center gap-0.5 opacity-0 transition-opacity duration-300 group-focus-within:opacity-100 group-hover:opacity-100">
          <time
            className="mr-1.5 text-xs text-muted-foreground"
            dateTime={new Date(message.createdAt).toISOString()}
            title={FULL_DATE.format(message.createdAt)}
          >
            {timeAgo(message.createdAt)}
          </time>
          <Action
            icon={Copy01Icon}
            label="Copy"
            onClick={() => copyText(message.text)}
          />
          <Action icon={Upload04Icon} label="Share" onClick={share} />
          {onEdit && (
            <Action
              icon={PencilEdit02Icon}
              label="Edit"
              onClick={() => setDraft(message.text)}
            />
          )}
        </div>
      )}
    </motion.div>
  )
}

function AssistantMessage({
  message,
  onRegenerate,
}: {
  message: Extract<ChatMessage, { role: "assistant" }>
  onRegenerate?: () => void
}) {
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null)
  const isWorking =
    message.status === "thinking" || message.status === "streaming"
  const text = useSmoothText(message.text, isWorking)
  const isTyping = isWorking || text.length < message.text.length

  const copy = () => copyText(message.text.replaceAll("**", ""))

  return (
    <motion.div
      animate={{ opacity: 1, filter: "blur(0px)" }}
      className="group flex gap-3.5"
      initial={{ opacity: 0, filter: "blur(2px)" }}
      transition={SOFT_TRANSITION}
    >
      <AiOrb active={isWorking} className="mt-0.5" size="sm" />

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex h-7 items-center gap-2">
          <span className="text-[13px] font-medium text-foreground">
            Raxon AI
          </span>
          <time
            className="text-[11px] text-muted-foreground"
            dateTime={new Date(message.createdAt).toISOString()}
          >
            {TIME.format(message.createdAt)}
          </time>
        </div>

        <div className="flex flex-col gap-3.5 text-[15px] leading-7 text-foreground/85">
          {message.reasoning.length > 0 && (
            <ReasoningPanel
              isStopped={message.status === "stopped"}
              isThinking={message.status === "thinking"}
              startedAt={message.createdAt}
              steps={message.reasoning}
              stepsDone={message.stepsDone}
              thoughtMs={message.thoughtMs}
            />
          )}
          {text && <AiMarkdown text={text} />}

          {message.status === "done" && !isTyping && (
            <MessageSources nudge={message.nudge} sources={message.sources} />
          )}

          {isTyping && message.status !== "thinking" && (
            <span className="-mt-2 size-2 animate-pulse rounded-full bg-primary" />
          )}

          {message.status === "stopped" && (
            <p className="text-xs text-muted-foreground italic">
              Response stopped.
            </p>
          )}
        </div>

        {message.status === "done" && !isTyping && (
          <div
            className={cn(
              "-ml-1.5 flex items-center gap-0.5 transition-opacity",
              !onRegenerate &&
                "opacity-0 group-focus-within:opacity-100 group-hover:opacity-100"
            )}
          >
            <Action icon={Copy01Icon} label="Copy" onClick={copy} />
            <Action
              icon={ThumbsUpIcon}
              isActive={feedback === "up"}
              label="Good answer"
              onClick={() => setFeedback(feedback === "up" ? null : "up")}
            />
            <Action
              icon={ThumbsDownIcon}
              isActive={feedback === "down"}
              label="Bad answer"
              onClick={() => setFeedback(feedback === "down" ? null : "down")}
            />
            {onRegenerate && (
              <Action
                icon={Refresh01Icon}
                label="Regenerate"
                onClick={onRegenerate}
              />
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}
