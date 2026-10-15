"use client"

import {
  AiBrain01Icon,
  ArrowUp02Icon,
  MagicWand01Icon,
  Mic01Icon,
  PlusSignIcon,
  SlashIcon,
  SparklesIcon,
  StopIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { AnimatePresence, motion } from "motion/react"
import { useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import { Loader } from "@/components/ui/loader"
import { toast } from "@/components/ui/toast"
import type { AiSource } from "@/features/integrations"
import type { WalletAsset } from "@/features/wallet"
import { ShimmeringText } from "@/shared/components/atoms/shimmering-text"
import { TokenAvatar } from "@/shared/components/atoms/token-avatar"
import { HintTooltip } from "@/shared/components/molecules/hint-tooltip"
import { SOFT_TRANSITION } from "@/shared/lib/motion"
import { cn } from "@/shared/lib/utils"
import {
  COMPOSER_TOOLS,
  MAX_ATTACHMENTS,
  PROMPT_COMPLETIONS,
} from "../../constants"
import {
  assetAttachment,
  fileAttachment,
  isLink,
  linkAttachment,
} from "../../helpers/attachments"
import { enhancePrompt } from "../../helpers/replies"
import { useVoiceInput } from "../../hooks/use-voice-input"
import type { ChatAttachment, ChatTool } from "../../types"
import { type ComposerMenuItem, ComposerMenu } from "./composer-menu"
import { ComposerSources } from "./composer-sources"
import { ContextChip } from "./context-chip"
import { DropZone } from "./drop-zone"
import { RAISED_HOVER, RAISED_SURFACE } from "../surface"

const ENHANCE_MS = 700
const FOLLOW_UP_COLORS = [
  "var(--primary)",
  "var(--success)",
  "#a855f7",
  "#3b82f6",
]
const FIELD_SHELL =
  "relative flex flex-col gap-3 overflow-hidden rounded-[20px] border border-foreground/10 bg-background p-3 pb-2.5 transition-colors focus-within:border-foreground/25 dark:border-foreground/[0.07] dark:bg-linear-to-b dark:from-foreground/[0.07] dark:to-foreground/[0.03] dark:shadow-[inset_0_1px_0_color-mix(in_oklch,var(--foreground)_8%,transparent),0_1px_2px_rgb(0_0_0/0.3)] dark:focus-within:border-foreground/20"

const FIELD_TEXT =
  "col-start-1 row-start-1 min-h-18 w-full text-[15px] leading-6 break-words whitespace-pre-wrap"

type MenuState =
  | { kind: "prompts"; query: string; start: number }
  | { kind: "assets"; query: string; start: number }

const readMenu = (value: string, caret: number): MenuState | null => {
  const before = value.slice(0, caret)
  const slash = before.match(/^\/([^\n]*)$/)
  if (slash) return { kind: "prompts", query: slash[1], start: 0 }
  const mention = before.match(/(?:^|\s)@(\w*)$/)
  if (mention) {
    return {
      kind: "assets",
      query: mention[1],
      start: caret - mention[1].length - 1,
    }
  }
  return null
}

const ghostFor = (value: string) => {
  if (value.trim().length < 3 || value.includes("\n")) return ""
  const match = PROMPT_COMPLETIONS.find(
    (completion) =>
      completion.length > value.length &&
      completion.toLowerCase().startsWith(value.toLowerCase())
  )
  return match ? match.slice(value.length) : ""
}

type ChatComposerProps = {
  assets: WalletAsset[]
  draft: string
  sources: AiSource[]
  planName: string
  followUps: string[]
  isStreaming: boolean
  onSend: (prompt: string, attachments: ChatAttachment[]) => void
  onStop: () => void
  onTyping?: () => void
}

export function ChatComposer({
  assets,
  draft,
  sources,
  planName,
  followUps,
  isStreaming,
  onSend,
  onStop,
  onTyping,
}: ChatComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState(draft)
  const [caret, setCaret] = useState(0)
  const [pendingCaret, setPendingCaret] = useState<number | null>(null)
  const [attachments, setAttachments] = useState<ChatAttachment[]>([])
  const [tools, setTools] = useState<ChatTool[]>([])
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [menuIndex, setMenuIndex] = useState(0)
  const [dismissedAt, setDismissedAt] = useState<string | null>(null)
  const [dropZone, setDropZone] = useState<"open" | "drag" | null>(null)

  const voice = useVoiceInput((text) =>
    setValue((current) => (current ? `${current} ${text}` : text))
  )

  const menu = dismissedAt === value ? null : readMenu(value, caret)
  const menuItems: ComposerMenuItem[] =
    menu?.kind === "prompts"
      ? PROMPT_COMPLETIONS.filter((prompt) =>
          prompt.toLowerCase().includes(menu.query.toLowerCase())
        )
          .slice(0, 6)
          .map((prompt) => ({
            id: prompt,
            label: prompt,
            leading: (
              <HugeiconsIcon
                className="shrink-0 text-muted-foreground"
                icon={SlashIcon}
                size={14}
              />
            ),
          }))
      : menu?.kind === "assets"
        ? assets
            .filter((asset) =>
              `${asset.symbol} ${asset.name}`
                .toLowerCase()
                .includes(menu.query.toLowerCase())
            )
            .slice(0, 6)
            .map((asset) => ({
              id: asset.symbol,
              label: asset.symbol,
              hint: asset.name,
              leading: <TokenAvatar className="size-5" symbol={asset.symbol} />,
            }))
        : []
  const isMenuOpen = menuItems.length > 0
  const ghost = !isMenuOpen && caret === value.length ? ghostFor(value) : ""
  const canSend = Boolean(value.trim()) && !isStreaming && !isEnhancing
  const status =
    COMPOSER_TOOLS.find((tool) => tools.includes(tool.id))?.status ??
    "Thinking…"

  useEffect(() => {
    if (pendingCaret === null) return
    textareaRef.current?.setSelectionRange(pendingCaret, pendingCaret)
    textareaRef.current?.focus()
  }, [pendingCaret])

  useEffect(() => {
    let depth = 0
    const hasFiles = (event: DragEvent) =>
      Boolean(event.dataTransfer?.types.includes("Files"))
    const onEnter = (event: DragEvent) => {
      if (!hasFiles(event)) return
      depth += 1
      setDropZone("drag")
    }
    const onLeave = (event: DragEvent) => {
      if (!hasFiles(event)) return
      depth = Math.max(0, depth - 1)
      if (depth === 0) setDropZone(null)
    }
    const onOver = (event: DragEvent) => {
      if (hasFiles(event)) event.preventDefault()
    }
    const onDrop = (event: DragEvent) => {
      if (!hasFiles(event)) return
      event.preventDefault()
      depth = 0
      setDropZone(null)
      const files = Array.from(event.dataTransfer?.files ?? [])
      setAttachments((current) => [
        ...current,
        ...files.slice(0, MAX_ATTACHMENTS - current.length).map(fileAttachment),
      ])
    }
    window.addEventListener("dragenter", onEnter)
    window.addEventListener("dragleave", onLeave)
    window.addEventListener("dragover", onOver)
    window.addEventListener("drop", onDrop)
    return () => {
      window.removeEventListener("dragenter", onEnter)
      window.removeEventListener("dragleave", onLeave)
      window.removeEventListener("dragover", onOver)
      window.removeEventListener("drop", onDrop)
    }
  }, [])

  useEffect(() => {
    if (dropZone !== "open") return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDropZone(null)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [dropZone])

  const update = (next: string, nextCaret = next.length) => {
    setValue(next)
    setCaret(nextCaret)
    setPendingCaret(nextCaret)
    setMenuIndex(0)
  }

  const pickMenuItem = (index: number) => {
    if (!menu) return
    const item = menuItems[index]
    if (menu.kind === "prompts") {
      update(item.label)
      return
    }
    const asset = assets.find((entry) => entry.symbol === item.id)
    if (asset) addContext(assetAttachment(asset))
    update(value.slice(0, menu.start) + value.slice(caret), menu.start)
  }

  const submit = () => {
    if (!canSend) return
    onSend(value, attachments)
    update("")
    setAttachments([])
  }

  const enhance = () => {
    if (!value.trim() || isEnhancing) return
    setIsEnhancing(true)
    window.setTimeout(() => {
      setValue((current) => enhancePrompt(current))
      setIsEnhancing(false)
    }, ENHANCE_MS)
  }

  const addContext = (attachment: ChatAttachment) =>
    setAttachments((current) =>
      current.some((item) => item.id === attachment.id) ||
      current.length >= MAX_ATTACHMENTS
        ? current
        : [...current, attachment]
    )

  const addFiles = (files: FileList | null) => {
    if (!files) return
    setAttachments((current) => [
      ...current,
      ...Array.from(files)
        .slice(0, MAX_ATTACHMENTS - current.length)
        .map(fileAttachment),
    ])
    setDropZone(null)
  }

  const addLinkFromClipboard = async () => {
    const text = await navigator.clipboard.readText().catch(() => "")
    if (!isLink(text)) {
      toast.error("Copy a link first, then try again.")
      return
    }
    addContext(linkAttachment(text.trim()))
    setDropZone(null)
  }

  const startMention = () => {
    setDropZone(null)
    update(value && !value.endsWith(" ") ? `${value} @` : `${value}@`)
  }

  const removeAttachment = (attachment: ChatAttachment) => {
    if (attachment.url) URL.revokeObjectURL(attachment.url)
    setAttachments((current) =>
      current.filter((item) => item.id !== attachment.id)
    )
  }

  const toggleTool = (tool: ChatTool) =>
    setTools((current) =>
      current.includes(tool)
        ? current.filter((item) => item !== tool)
        : [...current, tool]
    )

  return (
    <div className="flex flex-col gap-3">
      <ComposerSources planName={planName} sources={sources} />
      <div className="relative">
        <AnimatePresence>
          {isMenuOpen && (
            <ComposerMenu
              activeIndex={Math.min(menuIndex, menuItems.length - 1)}
              items={menuItems}
              onHover={setMenuIndex}
              onSelect={pickMenuItem}
              title={menu?.kind === "prompts" ? "Prompts" : "Assets"}
            />
          )}
        </AnimatePresence>

        <div className="rounded-[26px] border border-foreground/8 bg-foreground/[0.025] p-1.5">
          <div className={FIELD_SHELL}>
            <AnimatePresence>
              {dropZone && (
                <DropZone
                  mode={dropZone}
                  onBrowse={() => fileRef.current?.click()}
                  onClose={() => setDropZone(null)}
                  onDictate={() => {
                    setDropZone(null)
                    voice.toggle()
                  }}
                  onLink={addLinkFromClipboard}
                  onMention={startMention}
                />
              )}
            </AnimatePresence>

            <div className="flex items-start gap-3">
              <div className="flex max-h-48 min-w-0 flex-1 flex-wrap items-start gap-1.5 overflow-y-auto pt-0.5">
                {attachments.map((attachment) => (
                  <ContextChip
                    attachment={attachment}
                    key={attachment.id}
                    onRemove={() => removeAttachment(attachment)}
                  />
                ))}
                <div className="grid min-w-32 flex-1">
                  <div
                    aria-hidden
                    className={cn(
                      FIELD_TEXT,
                      "pointer-events-none text-transparent"
                    )}
                  >
                    {value}
                    <span className="text-muted-foreground/55">{ghost}</span>
                    {"​"}
                  </div>
                  {isStreaming && !value && (
                    <div
                      aria-hidden
                      className={cn(FIELD_TEXT, "pointer-events-none")}
                    >
                      <ShimmeringText
                        className="text-primary/70"
                        text="Working on your request…"
                      />
                    </div>
                  )}
                  <textarea
                    aria-label="Ask Raxon AI"
                    className={cn(
                      FIELD_TEXT,
                      "h-full resize-none overflow-hidden bg-transparent text-foreground outline-none placeholder:text-muted-foreground",
                      isEnhancing && "animate-pulse"
                    )}
                    onChange={(event) => {
                      setValue(event.target.value)
                      onTyping?.()
                      setCaret(event.target.selectionStart)
                      setMenuIndex(0)
                    }}
                    onKeyDown={(event) => {
                      if (isMenuOpen) {
                        if (
                          event.key === "ArrowDown" ||
                          event.key === "ArrowUp"
                        ) {
                          event.preventDefault()
                          const step = event.key === "ArrowDown" ? 1 : -1
                          setMenuIndex(
                            (index) =>
                              (index + step + menuItems.length) %
                              menuItems.length
                          )
                          return
                        }
                        if (event.key === "Enter" || event.key === "Tab") {
                          event.preventDefault()
                          pickMenuItem(
                            Math.min(menuIndex, menuItems.length - 1)
                          )
                          return
                        }
                        if (event.key === "Escape") {
                          event.preventDefault()
                          setDismissedAt(value)
                          return
                        }
                      }
                      if (
                        ghost &&
                        (event.key === "Tab" || event.key === "ArrowRight")
                      ) {
                        event.preventDefault()
                        update(value + ghost)
                        return
                      }
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault()
                        submit()
                        return
                      }
                      const { selectionStart, selectionEnd } =
                        event.currentTarget
                      if (
                        event.key === "Backspace" &&
                        selectionStart === 0 &&
                        selectionEnd === 0 &&
                        attachments.length > 0
                      ) {
                        event.preventDefault()
                        removeAttachment(attachments[attachments.length - 1])
                      }
                    }}
                    onSelect={(event) =>
                      setCaret(event.currentTarget.selectionStart)
                    }
                    placeholder={
                      isStreaming || attachments.length > 0
                        ? ""
                        : "Ask anything, @assets, /prompts…"
                    }
                    readOnly={isEnhancing}
                    ref={textareaRef}
                    rows={1}
                    value={value}
                  />
                </div>
              </div>
              <HintTooltip label="Enhance prompt" side="top">
                <Button
                  aria-label="Enhance prompt"
                  className={cn(
                    "-mt-1 -mr-1 text-muted-foreground",
                    isEnhancing && "text-primary"
                  )}
                  disabled={!value.trim() || isStreaming}
                  onClick={enhance}
                  size="icon-sm"
                  variant="ghost"
                >
                  <HugeiconsIcon
                    className={cn(isEnhancing && "animate-pulse")}
                    icon={MagicWand01Icon}
                    size={17}
                  />
                </Button>
              </HintTooltip>
            </div>

            <div className="flex items-center gap-1">
              <HintTooltip label="Add files, links or assets" side="top">
                <Button
                  aria-label="Add context"
                  className="text-muted-foreground"
                  disabled={attachments.length >= MAX_ATTACHMENTS}
                  onClick={() =>
                    setDropZone((current) => (current ? null : "open"))
                  }
                  size="icon"
                  variant="ghost"
                >
                  <HugeiconsIcon icon={PlusSignIcon} size={18} />
                </Button>
              </HintTooltip>
              <input
                accept="image/*,.csv,.pdf"
                className="hidden"
                multiple
                onChange={(event) => {
                  addFiles(event.target.files)
                  event.target.value = ""
                }}
                ref={fileRef}
                type="file"
              />
              <span className="mx-1 h-5 w-px bg-foreground/10" />
              {COMPOSER_TOOLS.map((tool) => {
                const isOn = tools.includes(tool.id)
                return (
                  <HintTooltip key={tool.id} label={tool.label} side="top">
                    <Button
                      aria-label={tool.label}
                      aria-pressed={isOn}
                      className={cn(
                        "h-8 gap-1.5 rounded-full border border-foreground/10 bg-foreground/[0.03] px-2.5 text-xs font-normal text-muted-foreground hover:text-foreground",
                        isOn &&
                          "border-primary/30 bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary dark:hover:bg-primary/15"
                      )}
                      onClick={() => toggleTool(tool.id)}
                      variant="ghost"
                    >
                      <HugeiconsIcon icon={tool.icon} size={15} />
                      <span className="hidden sm:inline">{tool.short}</span>
                    </Button>
                  </HintTooltip>
                )
              })}

              <div className="ml-auto flex items-center">
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.div
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    key={isStreaming ? "stop" : canSend ? "send" : "voice"}
                    transition={SOFT_TRANSITION}
                  >
                    {isStreaming || canSend ? (
                      <Button
                        aria-label={
                          isStreaming ? "Stop generating" : "Send message"
                        }
                        className="size-10 rounded-full bg-foreground text-background hover:bg-foreground/85"
                        onClick={isStreaming ? onStop : submit}
                        size="icon"
                      >
                        <HugeiconsIcon
                          icon={isStreaming ? StopIcon : ArrowUp02Icon}
                          size={isStreaming ? 15 : 18}
                        />
                      </Button>
                    ) : (
                      <Button
                        aria-label="Voice input"
                        title={voice.isListening ? "Stop dictation" : "Dictate"}
                        aria-pressed={voice.isListening}
                        className={cn(
                          "relative size-10 rounded-full bg-primary text-primary-foreground shadow-[0_0_0_4px_color-mix(in_oklch,var(--primary)_18%,transparent),0_6px_20px_-6px_var(--primary)] hover:bg-primary/90",
                          voice.isListening &&
                            "bg-destructive hover:bg-destructive/90"
                        )}
                        onClick={voice.toggle}
                        size="icon"
                      >
                        {voice.isListening && (
                          <span className="absolute inset-0 animate-ping rounded-full bg-destructive/40" />
                        )}
                        <HugeiconsIcon icon={Mic01Icon} size={18} />
                      </Button>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          <AnimatePresence initial={false}>
            {isStreaming && (
              <motion.div
                animate={{ height: "auto", opacity: 1 }}
                className="overflow-hidden"
                exit={{ height: 0, opacity: 0 }}
                initial={{ height: 0, opacity: 0 }}
                transition={SOFT_TRANSITION}
              >
                <div className="flex items-center gap-2 px-2 pt-2.5 pb-1 text-xs text-muted-foreground">
                  <HugeiconsIcon icon={AiBrain01Icon} size={15} />
                  <ShimmeringText text={status} />
                  <Loader className="ml-auto size-3.5" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {!isStreaming && followUps.length > 0 && (
          <motion.div
            animate={{ opacity: 1, filter: "blur(0px)" }}
            className="flex flex-wrap gap-2"
            exit={{ opacity: 0, filter: "blur(2px)" }}
            initial={{ opacity: 0, filter: "blur(2px)" }}
            transition={SOFT_TRANSITION}
          >
            {followUps.map((followUp, index) => (
              <button
                className={cn(
                  "flex h-8 items-center gap-2 rounded-full px-3 text-xs",
                  RAISED_SURFACE,
                  RAISED_HOVER
                )}
                key={followUp}
                onClick={() => onSend(followUp, [])}
                type="button"
              >
                <HugeiconsIcon
                  icon={SparklesIcon}
                  size={14}
                  style={{
                    color: FOLLOW_UP_COLORS[index % FOLLOW_UP_COLORS.length],
                  }}
                />
                {followUp}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Kbd>/</Kbd> prompts
          </span>
          <span className="flex items-center gap-1">
            <Kbd>@</Kbd> assets
          </span>
          <span className="flex items-center gap-1">
            <Kbd>Tab</Kbd> complete
          </span>
        </span>
        <span>Raxon AI can make mistakes. Not financial advice.</span>
      </div>
    </div>
  )
}
