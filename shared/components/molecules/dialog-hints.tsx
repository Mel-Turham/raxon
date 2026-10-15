import type { ReactNode } from "react"

import { DialogFooter } from "@/components/ui/dialog"
import { Kbd } from "@/components/ui/kbd"

type DialogHintsProps = {
  hints: { keys: string[]; label: string }[]
  action?: ReactNode
}

export function DialogHints({ hints, action }: DialogHintsProps) {
  return (
    <DialogFooter>
      {hints.map(({ keys, label }) => (
        <span className="flex items-center gap-1.5" key={label}>
          {keys.map((key) => (
            <Kbd key={key}>{key}</Kbd>
          ))}
          {label}
        </span>
      ))}
      {action && <div className="ml-auto">{action}</div>}
    </DialogFooter>
  )
}
