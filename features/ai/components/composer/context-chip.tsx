"use client"

import {
  Cancel01Icon,
  File01Icon,
  Link01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Image from "next/image"

import { TokenAvatar } from "@/shared/components/atoms/token-avatar"
import type { ChatAttachment } from "../../types"

const Leading = ({ attachment }: { attachment: ChatAttachment }) => {
  if (attachment.kind === "asset" && attachment.symbol) {
    return <TokenAvatar className="size-4" symbol={attachment.symbol} />
  }
  if (attachment.kind === "image" && attachment.url) {
    return (
      <Image
        alt=""
        className="size-4 rounded-sm object-cover"
        height={16}
        src={attachment.url}
        unoptimized
        width={16}
      />
    )
  }
  return (
    <span className="flex size-4 items-center justify-center rounded-sm bg-primary text-primary-foreground">
      <HugeiconsIcon
        icon={attachment.kind === "link" ? Link01Icon : File01Icon}
        size={11}
      />
    </span>
  )
}

type ContextChipProps = {
  attachment: ChatAttachment
  onRemove?: () => void
}

export function ContextChip({ attachment, onRemove }: ContextChipProps) {
  return (
    <span className="group/chip inline-flex h-6 max-w-full shrink-0 items-center gap-1.5 rounded-full bg-foreground/12 px-2.5 text-sm leading-none">
      {attachment.kind === "asset" && (
        <span className="text-muted-foreground">@</span>
      )}
      <Leading attachment={attachment} />
      <span className="max-w-44 truncate text-foreground">
        {attachment.name}
      </span>
      <span className="shrink-0 text-muted-foreground">{attachment.meta}</span>
      {onRemove && (
        <button
          aria-label={`Remove ${attachment.name}`}
          className="-mr-0.5 hidden text-muted-foreground transition-colors group-hover/chip:inline-flex hover:text-foreground"
          onClick={onRemove}
          type="button"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={12} />
        </button>
      )}
    </span>
  )
}
