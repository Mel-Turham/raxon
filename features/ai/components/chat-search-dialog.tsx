"use client"

import { Message01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"

import {
  Command,
  CommandEmpty,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { Kbd } from "@/components/ui/kbd"
import { DialogHints } from "@/shared/components/molecules/dialog-hints"
import type { AiConversation } from "../types"

const timeAgo = (minutes: number) =>
  minutes < 60
    ? `${minutes}m`
    : minutes < 1_440
      ? `${Math.round(minutes / 60)}h`
      : `${Math.round(minutes / 1_440)}d`

type ChatSearchDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  conversations: AiConversation[]
  onOpen: (conversation: AiConversation) => void
}

export function ChatSearchDialog({
  open,
  onOpenChange,
  conversations,
  onOpen,
}: ChatSearchDialogProps) {
  const [query, setQuery] = useState("")
  const items = [...conversations].sort(
    (a, b) =>
      Number(a.archived) - Number(b.archived) || a.minutesAgo - b.minutesAgo
  )

  return (
    <Dialog
      onOpenChange={onOpenChange}
      onOpenChangeComplete={(isOpen) => {
        if (!isOpen) setQuery("")
      }}
      open={open}
    >
      <DialogContent>
        <DialogTitle className="sr-only">Search chats</DialogTitle>
        <DialogDescription className="sr-only">
          Find a past conversation by its title or its questions.
        </DialogDescription>
        <Command
          items={items}
          itemToStringValue={(conversation) =>
            `${conversation.title} ${conversation.prompts.join(" ")}`
          }
          onValueChange={setQuery}
          value={query}
        >
          <CommandInput
            aria-label="Search chats"
            autoFocus
            placeholder="Search chats…"
            trailing={<Kbd>Esc</Kbd>}
          />
          <div className="min-h-0 flex-1 overflow-y-auto">
            <CommandGroupLabel className="px-4 pb-0">
              {query ? "Results" : "Recent chats"}
            </CommandGroupLabel>
            <CommandEmpty>No chat matches “{query}”</CommandEmpty>
            <CommandList>
              {(conversation: AiConversation) => (
                <CommandItem
                  className="min-h-12 gap-3.5 py-2.5"
                  key={conversation.id}
                  onClick={() => {
                    onOpen(conversation)
                    onOpenChange(false)
                  }}
                  value={conversation}
                >
                  <HugeiconsIcon
                    className="shrink-0 text-muted-foreground"
                    icon={Message01Icon}
                    size={18}
                  />
                  <span className="min-w-0 flex-1 truncate text-foreground">
                    {conversation.title}
                  </span>
                  {conversation.archived ? (
                    <span className="bg-foreground/6 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                      Archived
                    </span>
                  ) : (
                    conversation.strategy && (
                      <span className="bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary">
                        {conversation.strategy}
                      </span>
                    )
                  )}
                  <span className="w-8 shrink-0 text-right text-xs text-muted-foreground tabular-nums">
                    {timeAgo(conversation.minutesAgo)}
                  </span>
                </CommandItem>
              )}
            </CommandList>
          </div>
          <DialogHints
            hints={[
              { keys: ["↑", "↓"], label: "Navigate" },
              { keys: ["↵"], label: "Open" },
              { keys: ["Esc"], label: "Close" },
            ]}
          />
        </Command>
      </DialogContent>
    </Dialog>
  )
}
