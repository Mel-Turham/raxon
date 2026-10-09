"use client"

import type { ReactElement, ReactNode } from "react"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type HintTooltipProps = {
  label: ReactNode
  /** The trigger element (e.g. an icon button); it keeps its own props. */
  children: ReactElement
  side?: "top" | "bottom" | "left" | "right"
}

/** Short label shown on hover / focus of an icon-only control. */
export const HintTooltip = ({
  label,
  children,
  side = "bottom",
}: HintTooltipProps) => (
  <Tooltip>
    <TooltipTrigger render={children} />
    <TooltipContent side={side} sideOffset={8}>
      {label}
    </TooltipContent>
  </Tooltip>
)
