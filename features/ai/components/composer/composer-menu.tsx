"use client"

import { motion } from "motion/react"
import type { ReactNode } from "react"

import { Kbd } from "@/components/ui/kbd"
import { SOFT_TRANSITION } from "@/shared/lib/motion"
import { cn } from "@/shared/lib/utils"

export type ComposerMenuItem = {
  id: string
  label: string
  hint?: string
  leading: ReactNode
}

type ComposerMenuProps = {
  title: string
  items: ComposerMenuItem[]
  activeIndex: number
  onHover: (index: number) => void
  onSelect: (index: number) => void
}

export function ComposerMenu({
  title,
  items,
  activeIndex,
  onHover,
  onSelect,
}: ComposerMenuProps) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="absolute inset-x-1.5 bottom-full z-20 mb-2 border border-foreground/10 bg-popover shadow-(--chart-tooltip-shadow)"
      exit={{ opacity: 0, y: 4 }}
      initial={{ opacity: 0, y: 4 }}
      role="listbox"
      transition={SOFT_TRANSITION}
    >
      <div className="flex items-center justify-between border-b border-foreground/8 px-3 py-2 text-[11px] text-muted-foreground">
        <span className="font-medium tracking-[1px] uppercase">{title}</span>
        <span className="flex items-center gap-1">
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd>
          <Kbd>↵</Kbd>
        </span>
      </div>
      <div className="max-h-64 overflow-y-auto p-1">
        {items.map((item, index) => (
          <button
            aria-selected={index === activeIndex}
            className={cn(
              "flex w-full items-center gap-2.5 px-2.5 py-2 text-left text-sm text-foreground/80",
              index === activeIndex && "bg-foreground/6 text-foreground"
            )}
            key={item.id}
            onMouseDown={(event) => {
              event.preventDefault()
              onSelect(index)
            }}
            onMouseEnter={() => onHover(index)}
            role="option"
            type="button"
          >
            {item.leading}
            <span className="min-w-0 flex-1 truncate">{item.label}</span>
            {item.hint && (
              <span className="text-xs text-muted-foreground">{item.hint}</span>
            )}
          </button>
        ))}
      </div>
    </motion.div>
  )
}
