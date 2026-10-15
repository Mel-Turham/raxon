"use client"

import { UserAdd01Icon } from "@hugeicons/core-free-icons"
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
import { Kbd } from "@/components/ui/kbd"
import { Loader } from "@/components/ui/loader"
import { isRecipientQuery } from "../helpers/transfer"
import type { TransferRecipient } from "../types"
import { SharedElement } from "@/shared/components/molecules/step-transition"
import { DialogHints } from "@/shared/components/molecules/dialog-hints"
import { RecipientAvatar } from "./recipient-avatar"

type RecipientOption =
  | { kind: "contact"; recipient: TransferRecipient }
  | { kind: "lookup"; query: string }

type TransferRecipientStepProps = {
  contacts: TransferRecipient[]
  error: string | null
  isSearching: boolean
  onLookup: (query: string) => void
  onQueryChange: () => void
  onSelect: (recipient: TransferRecipient) => void
}

export function TransferRecipientStep({
  contacts,
  error,
  isSearching,
  onLookup,
  onQueryChange,
  onSelect,
}: TransferRecipientStepProps) {
  const [query, setQuery] = useState("")
  const trimmed = query.trim()
  const options: RecipientOption[] = [
    ...(isRecipientQuery(trimmed)
      ? [{ kind: "lookup", query: trimmed } as const]
      : []),
    ...contacts.map((recipient) => ({ kind: "contact", recipient }) as const),
  ]

  const choose = (option: RecipientOption) => {
    if (isSearching) return
    if (option.kind === "lookup") onLookup(option.query)
    else onSelect(option.recipient)
  }

  return (
    <Command
      items={options}
      itemToStringValue={(option) =>
        option.kind === "lookup"
          ? option.query
          : `${option.recipient.name} ${option.recipient.handle} ${option.recipient.id}`
      }
      onValueChange={(value) => {
        setQuery(value)
        onQueryChange()
      }}
      value={query}
    >
      <CommandInput
        aria-label="Search recipient by email or Raxon ID"
        autoFocus
        placeholder="Email or Raxon ID…"
        trailing={<Kbd>Esc</Kbd>}
      />
      {error && (
        <p
          aria-live="polite"
          className="border-b border-foreground/10 px-4 py-2.5 text-xs text-destructive"
        >
          {error}
        </p>
      )}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {!query && (
          <CommandGroupLabel className="px-4 pb-0">Recent</CommandGroupLabel>
        )}
        <CommandEmpty>
          No contact matches “{query}”. Enter a full email or 8-digit Raxon ID.
        </CommandEmpty>
        <CommandList className="divide-y divide-foreground/8">
          {(option: RecipientOption) =>
            option.kind === "lookup" ? (
              <CommandItem
                key="lookup"
                onClick={() => choose(option)}
                value={option}
              >
                <span className="flex size-9 shrink-0 items-center justify-center bg-muted text-muted-foreground shadow-(--icon-surface-shadow)">
                  {isSearching ? (
                    <Loader className="size-4" />
                  ) : (
                    <HugeiconsIcon icon={UserAdd01Icon} size={16} />
                  )}
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate font-medium text-foreground">
                    Send to {option.query}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Find a Raxon account
                  </span>
                </span>
              </CommandItem>
            ) : (
              <CommandItem
                key={option.recipient.id}
                onClick={() => choose(option)}
                value={option}
              >
                <SharedElement id={`recipient:${option.recipient.id}`}>
                  <RecipientAvatar recipient={option.recipient} />
                </SharedElement>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate font-medium text-foreground">
                    {option.recipient.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {option.recipient.handle}
                  </span>
                </span>
                <span className="font-mono text-xs text-muted-foreground tabular-nums">
                  ID {option.recipient.id}
                </span>
              </CommandItem>
            )
          }
        </CommandList>
      </div>
      <DialogHints
        hints={[
          { keys: ["↑", "↓"], label: "Navigate" },
          { keys: ["↵"], label: "Select" },
        ]}
      />
    </Command>
  )
}
