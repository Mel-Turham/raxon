"use client"

import { Alert02Icon, ArrowRight02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import { DialogBody } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { DialogHints } from "@/shared/components/molecules/dialog-hints"
import { SegmentedTabs } from "@/shared/components/molecules/segmented-tabs"
import { StepHeader } from "@/shared/components/molecules/step-header"
import { cn } from "@/shared/lib/utils"
import {
  ACCOUNT_COLORS,
  ACCOUNT_NAME_MAX,
  ACCOUNT_TYPES,
  MARGIN_MODES,
} from "../constants"
import { validateAccountName } from "../helpers/account"
import type { AccountColor, AccountType, MarginMode } from "../types"
import { AccountBadge } from "./account-badge"

const NAME_PLACEHOLDERS: Record<AccountType, string> = {
  spot: "e.g. Long-term",
  margin: "e.g. Swing trades",
  futures: "e.g. BTC perps",
}
const MODE_LABELS = ["Cross", "Isolated"] as const
const HIGH_LEVERAGE = 20

export type AccountDetails = {
  name: string
  color: AccountColor
  leverage: number
  marginMode: MarginMode
}

type AccountDetailsStepProps = {
  type: AccountType
  details: AccountDetails
  takenNames: string[]
  onBack: () => void
  onChange: (details: AccountDetails) => void
  onContinue: () => void
}

export function AccountDetailsStep({
  type,
  details,
  takenNames,
  onBack,
  onChange,
  onContinue,
}: AccountDetailsStepProps) {
  const config = ACCOUNT_TYPES[type]
  const { name, color, leverage, marginMode } = details
  const nameError = name ? validateAccountName(name, takenNames) : null
  const liquidationMove = 100 / leverage

  return (
    <>
      <StepHeader
        backLabel="Back to account types"
        detail="Step 2 of 4"
        leading={
          <AccountBadge
            className="size-6"
            color={color}
            iconSize={14}
            shared
            type={type}
          />
        }
        onBack={onBack}
        title={`New ${config.label} account`}
      />

      <DialogBody className="flex flex-col gap-5 p-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <label htmlFor="account-name">Account name</label>
            <span className="font-mono tabular-nums">
              {name.length}/{ACCOUNT_NAME_MAX}
            </span>
          </div>
          <Input
            aria-invalid={Boolean(nameError)}
            autoComplete="off"
            autoFocus
            className="h-11 border-foreground/10 bg-muted text-sm md:text-sm dark:bg-muted"
            id="account-name"
            maxLength={ACCOUNT_NAME_MAX}
            onChange={(event) =>
              onChange({ ...details, name: event.target.value })
            }
            placeholder={NAME_PLACEHOLDERS[type]}
            value={name}
          />
          {nameError && <p className="text-xs text-destructive">{nameError}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-muted-foreground" id="account-color">
            Label color
          </span>
          <div
            aria-labelledby="account-color"
            className="flex gap-2"
            role="radiogroup"
          >
            {ACCOUNT_COLORS.map((swatch) => (
              <button
                aria-checked={swatch === color}
                aria-label={swatch}
                className={cn(
                  "flex size-8 items-center justify-center border border-transparent p-0.5 transition-colors hover:border-foreground/30",
                  swatch === color &&
                    "border-foreground hover:border-foreground"
                )}
                key={swatch}
                onClick={() => onChange({ ...details, color: swatch })}
                role="radio"
                type="button"
              >
                <span
                  className="size-full"
                  style={{ backgroundColor: swatch }}
                />
              </button>
            ))}
          </div>
        </div>

        {config.leveraged && (
          <>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground" id="account-leverage">
                  Default leverage
                </span>
                <span className="font-mono text-sm tabular-nums">
                  {leverage}×
                </span>
              </div>
              <Slider
                aria-labelledby="account-leverage"
                max={config.maxLeverage}
                min={1}
                onValueChange={(value) =>
                  onChange({
                    ...details,
                    leverage: Array.isArray(value) ? value[0] : value,
                  })
                }
                step={1}
                value={[leverage]}
              />
              <div className="flex gap-1.5">
                {config.leverageMarks.map((mark) => (
                  <button
                    className={cn(
                      "h-5 bg-muted px-1.5 font-mono text-[10px] text-muted-foreground shadow-(--icon-surface-shadow) transition-colors hover:bg-muted/70 hover:text-foreground",
                      mark === leverage && "text-foreground"
                    )}
                    key={mark}
                    onClick={() => onChange({ ...details, leverage: mark })}
                    type="button"
                  >
                    {mark}×
                  </button>
                ))}
              </div>
              <p
                className={cn(
                  "flex gap-2 text-xs leading-relaxed",
                  leverage >= HIGH_LEVERAGE
                    ? "text-destructive"
                    : "text-muted-foreground"
                )}
              >
                <HugeiconsIcon
                  className="mt-px shrink-0"
                  icon={Alert02Icon}
                  size={14}
                />
                At {leverage}×, a ~{Number(liquidationMove.toFixed(1))}% move
                against you wipes out a position&apos;s margin.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground">
                  Margin mode
                </span>
                <SegmentedTabs
                  onValueChange={(label) =>
                    onChange({
                      ...details,
                      marginMode: label === "Cross" ? "cross" : "isolated",
                    })
                  }
                  options={MODE_LABELS}
                  value={
                    MARGIN_MODES[marginMode]
                      .label as (typeof MODE_LABELS)[number]
                  }
                />
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {MARGIN_MODES[marginMode].description}
              </p>
            </div>
          </>
        )}
      </DialogBody>

      <DialogHints
        action={
          <Button
            className="h-8 px-4"
            disabled={!name || Boolean(nameError)}
            onClick={onContinue}
          >
            Continue
            <HugeiconsIcon icon={ArrowRight02Icon} size={14} />
          </Button>
        }
        hints={[{ keys: ["Esc"], label: "Close" }]}
      />
    </>
  )
}
