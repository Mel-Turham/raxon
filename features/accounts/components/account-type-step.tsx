"use client"

import { ArrowRight01Icon, UserAdd01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { DialogBody, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Kbd } from "@/components/ui/kbd"
import { DialogHints } from "@/shared/components/molecules/dialog-hints"
import { ACCOUNT_TYPE_IDS, ACCOUNT_TYPES } from "../constants"
import type { AccountType } from "../types"
import { AccountBadge } from "./account-badge"

type AccountTypeStepProps = {
  color: string
  onSelect: (type: AccountType) => void
}

export function AccountTypeStep({ color, onSelect }: AccountTypeStepProps) {
  return (
    <>
      <DialogHeader>
        <HugeiconsIcon
          className="text-muted-foreground"
          icon={UserAdd01Icon}
          size={18}
        />
        <DialogTitle className="flex-1">
          New account
          <span className="text-muted-foreground"> · Step 1 of 4</span>
        </DialogTitle>
        <Kbd>Esc</Kbd>
      </DialogHeader>

      <DialogBody className="flex flex-col gap-3 p-4">
        <p className="text-xs leading-relaxed text-muted-foreground">
          A sub-account has its own balance, so the losses of one strategy never
          touch your other funds.
        </p>

        <div className="flex flex-col divide-y divide-foreground/8 border border-foreground/10">
          {ACCOUNT_TYPE_IDS.map((type) => {
            const { label, description, leveraged, maxLeverage } =
              ACCOUNT_TYPES[type]
            return (
              <button
                autoFocus={type === "spot"}
                className="group flex items-center gap-3 p-3 text-left transition-colors outline-none hover:bg-foreground/4 focus-visible:bg-foreground/6"
                key={type}
                onClick={() => onSelect(type)}
                type="button"
              >
                <AccountBadge color={color} shared type={type} />
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="flex items-center gap-2 text-sm font-medium">
                    {label}
                    {leveraged && (
                      <span className="bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] text-primary">
                        Up to {maxLeverage}×
                      </span>
                    )}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {description}
                  </span>
                </span>
                <HugeiconsIcon
                  className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
                  icon={ArrowRight01Icon}
                  size={16}
                />
              </button>
            )
          })}
        </div>
      </DialogBody>

      <DialogHints
        hints={[
          { keys: ["Tab"], label: "Navigate" },
          { keys: ["↵"], label: "Select" },
        ]}
      />
    </>
  )
}
