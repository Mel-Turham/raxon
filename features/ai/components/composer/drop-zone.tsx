"use client"

import {
  AtIcon,
  Cancel01Icon,
  Link01Icon,
  Mic01Icon,
  Upload04Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { motion } from "motion/react"

import { Button } from "@/components/ui/button"
import { HintTooltip } from "@/shared/components/molecules/hint-tooltip"
import { stepVariants } from "@/shared/lib/motion"
import { cn } from "@/shared/lib/utils"

type DropZoneProps = {
  mode: "drag" | "open"
  onBrowse: () => void
  onDictate: () => void
  onLink: () => void
  onMention: () => void
  onClose: () => void
}

export function DropZone({
  mode,
  onBrowse,
  onDictate,
  onLink,
  onMention,
  onClose,
}: DropZoneProps) {
  const actions = [
    { label: "Browse files", icon: Upload04Icon, onClick: onBrowse },
    { label: "Dictate", icon: Mic01Icon, onClick: onDictate },
    { label: "Paste a link", icon: Link01Icon, onClick: onLink },
    { label: "Mention an asset", icon: AtIcon, onClick: onMention },
  ]

  return (
    <motion.div
      animate="animate"
      className="absolute inset-0 z-10 rounded-[20px] bg-background p-1.5"
      exit="exit"
      initial="initial"
      variants={stepVariants}
    >
      <div
        className={cn(
          "flex h-full flex-col items-center justify-center gap-3 rounded-[16px] border-2 border-dotted px-4 text-center transition-colors",
          mode === "drag"
            ? "border-primary/70 bg-primary/6"
            : "border-foreground/15 bg-foreground/[0.02]"
        )}
      >
        <div className="flex flex-col gap-1">
          <p className="text-base font-medium">
            Drop anything here or{" "}
            <button
              className="text-primary underline-offset-4 hover:underline"
              onClick={onBrowse}
              type="button"
            >
              browse
            </button>
          </p>
          <p className="text-xs text-muted-foreground">
            Images, PDFs, CSV statements, links &amp; assets
          </p>
        </div>
        <div className="flex gap-2.5">
          {actions.map(({ label, icon, onClick }) => (
            <HintTooltip key={label} label={label} side="bottom">
              <Button
                aria-label={label}
                className="size-10 bg-muted text-muted-foreground shadow-(--icon-surface-shadow) hover:bg-muted/70 hover:text-foreground"
                onClick={onClick}
                size="icon"
                variant="ghost"
              >
                <HugeiconsIcon icon={icon} size={18} />
              </Button>
            </HintTooltip>
          ))}
        </div>
      </div>
      {mode === "open" && (
        <Button
          aria-label="Close"
          className="absolute top-3 right-3 text-muted-foreground"
          onClick={onClose}
          size="icon-sm"
          variant="ghost"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={14} />
        </Button>
      )}
    </motion.div>
  )
}
