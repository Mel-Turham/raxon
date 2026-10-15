"use client"

import { ArrowRight02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { type FormEvent, type ReactNode, useState } from "react"

import { Button } from "@/components/ui/button"
import { DialogBody } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BrandLogo } from "@/shared/components/atoms/logos/brand-logo"
import { DialogHints } from "@/shared/components/molecules/dialog-hints"
import { SegmentedTabs } from "@/shared/components/molecules/segmented-tabs"
import { StepHeader } from "@/shared/components/molecules/step-header"
import {
  AUTOMATION_ASSETS,
  AUTOMATION_BRIEF_TIMES,
  AUTOMATION_NAME_MAX,
} from "../../constants"
import {
  describeCondition,
  isConditionValid,
  suggestAutomationName,
  triggerMeta,
} from "../../helpers/automations"
import type {
  AutomationAsset,
  AutomationBriefTime,
  AutomationCondition,
} from "../../types"

const FIELD =
  "h-11 border-foreground/10 bg-muted font-mono text-sm md:text-sm dark:bg-muted"

const DIRECTIONS = ["Above", "Below"] as const
const BIASES = ["Bullish", "Bearish", "Any"] as const

const toNumber = (value: string) =>
  Number.parseFloat(value.replace(/[^\d.]/g, "")) || 0

function Field({
  id,
  label,
  children,
}: {
  id?: string
  label: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs text-muted-foreground" htmlFor={id}>
        {label}
      </label>
      {children}
    </div>
  )
}

type AutomationConfigureStepProps = {
  initialCondition: AutomationCondition
  initialName?: string
  onBack: () => void
  onContinue: (condition: AutomationCondition, name: string) => void
}

export function AutomationConfigureStep({
  initialCondition,
  initialName,
  onBack,
  onContinue,
}: AutomationConfigureStepProps) {
  const [condition, setCondition] = useState(initialCondition)
  const [customName, setCustomName] = useState(initialName ?? null)
  const name = customName ?? suggestAutomationName(condition)
  const trigger = triggerMeta(condition.type)
  const isValid = isConditionValid(condition) && name.trim().length >= 2

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (isValid) onContinue(condition, name.trim())
  }

  return (
    <form className="flex min-h-0 flex-col" noValidate onSubmit={submit}>
      <StepHeader
        backLabel="Back to triggers"
        leading={<BrandLogo className="size-7" logo={trigger.logo} />}
        onBack={onBack}
        title={trigger.label}
      />

      <DialogBody className="flex flex-col gap-5 p-4">
        {condition.type === "tradingview-alert" && (
          <p className="border border-border p-3 text-xs leading-5 text-muted-foreground">
            Every alert sent to your TradingView webhook will trigger this
            automation. Raxon AI adds a short explanation to each alert.
          </p>
        )}

        {condition.type === "price-cross" && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Asset">
                <Select
                  onValueChange={(value) =>
                    setCondition({
                      ...condition,
                      asset: value as AutomationAsset,
                    })
                  }
                  value={condition.asset}
                >
                  <SelectTrigger
                    aria-label="Asset"
                    className={`w-full data-[size=default]:h-11 ${FIELD}`}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AUTOMATION_ASSETS.map((asset) => (
                      <SelectItem key={asset} value={asset}>
                        {asset}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Direction">
                <SegmentedTabs
                  className="*:data-[slot=tabs-list]:h-11! *:data-[slot=tabs-list]:w-full"
                  onValueChange={(value) =>
                    setCondition({
                      ...condition,
                      direction: value === "Above" ? "above" : "below",
                    })
                  }
                  options={DIRECTIONS}
                  value={condition.direction === "above" ? "Above" : "Below"}
                />
              </Field>
            </div>
            <Field id="automation-price" label="Price (USD)">
              <Input
                className={FIELD}
                id="automation-price"
                inputMode="decimal"
                onChange={(event) =>
                  setCondition({
                    ...condition,
                    price: toNumber(event.target.value),
                  })
                }
                value={condition.price || ""}
              />
            </Field>
          </>
        )}

        {condition.type === "portfolio-drawdown" && (
          <Field id="automation-percent" label="Drop in 24 hours (%)">
            <Input
              className={FIELD}
              id="automation-percent"
              inputMode="numeric"
              max={50}
              min={1}
              onChange={(event) =>
                setCondition({
                  ...condition,
                  percent: Math.round(toNumber(event.target.value)),
                })
              }
              value={condition.percent || ""}
            />
          </Field>
        )}

        {condition.type === "ai-signal" && (
          <Field label="Signal type">
            <SegmentedTabs
              className="*:data-[slot=tabs-list]:w-full"
              onValueChange={(value) =>
                setCondition({
                  ...condition,
                  bias:
                    value === "Bullish"
                      ? "bullish"
                      : value === "Bearish"
                        ? "bearish"
                        : "any",
                })
              }
              options={BIASES}
              value={
                condition.bias === "bullish"
                  ? "Bullish"
                  : condition.bias === "bearish"
                    ? "Bearish"
                    : "Any"
              }
            />
          </Field>
        )}

        {condition.type === "whale-transfer" && (
          <Field id="automation-amount" label="Minimum transfer (USD)">
            <Input
              className={FIELD}
              id="automation-amount"
              inputMode="decimal"
              onChange={(event) =>
                setCondition({
                  ...condition,
                  amountUsd: toNumber(event.target.value),
                })
              }
              value={condition.amountUsd || ""}
            />
          </Field>
        )}

        {condition.type === "daily-brief" && (
          <Field label="Send at (UTC)">
            <Select
              onValueChange={(value) =>
                setCondition({
                  ...condition,
                  time: value as AutomationBriefTime,
                })
              }
              value={condition.time}
            >
              <SelectTrigger
                aria-label="Time"
                className={`w-full data-[size=default]:h-11 ${FIELD}`}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AUTOMATION_BRIEF_TIMES.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        )}

        <Field id="automation-name" label="Name">
          <Input
            className={FIELD}
            id="automation-name"
            maxLength={AUTOMATION_NAME_MAX}
            onChange={(event) => setCustomName(event.target.value)}
            value={name}
          />
        </Field>

        <p className="border-l-2 border-primary pl-3 text-xs text-muted-foreground">
          {isConditionValid(condition)
            ? describeCondition(condition)
            : "Complete the settings above."}
        </p>
      </DialogBody>

      <DialogHints
        action={
          <Button disabled={!isValid} size="sm" type="submit">
            Continue
            <HugeiconsIcon icon={ArrowRight02Icon} />
          </Button>
        }
        hints={[
          { keys: ["Enter"], label: "Continue" },
          { keys: ["Esc"], label: "Cancel" },
        ]}
      />
    </form>
  )
}
