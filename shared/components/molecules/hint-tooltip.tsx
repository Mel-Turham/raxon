"use client"

import type { ReactElement, ReactNode } from "react"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type HintTooltipProps = {
  label: ReactNode

  children: ReactElement
  side?: "top" | "bottom" | "left" | "right"
}

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
