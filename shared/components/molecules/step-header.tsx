"use client"

import { ArrowLeft02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Kbd } from "@/components/ui/kbd"
import { TokenAvatar } from "@/shared/components/atoms/token-avatar"
import { SharedElement } from "@/shared/components/molecules/step-transition"

type StepHeaderProps = {
  symbol?: string
  leading?: ReactNode
  title: string
  detail?: string
  backLabel: string
  onBack?: () => void
}

export function StepHeader({
  symbol,
  leading,
  title,
  detail,
  backLabel,
  onBack,
}: StepHeaderProps) {
  return (
    <DialogHeader>
      {onBack && (
        <Button
          aria-label={backLabel}
          className="-ml-1.5 text-muted-foreground"
          onClick={onBack}
          size="icon-sm"
          variant="ghost"
        >
          <HugeiconsIcon icon={ArrowLeft02Icon} size={16} />
        </Button>
      )}
      {leading ??
        (symbol && (
          <SharedElement id={`token:${symbol}`}>
            <TokenAvatar className="size-6" symbol={symbol} />
          </SharedElement>
        ))}
      <DialogTitle className="flex-1 truncate">
        {title}
        {detail && <span className="text-muted-foreground"> · {detail}</span>}
      </DialogTitle>
      <Kbd>Esc</Kbd>
    </DialogHeader>
  )
}
