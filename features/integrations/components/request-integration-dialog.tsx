"use client"

import { type FormEvent, useState, useTransition } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/toast"
import { DialogHints } from "@/shared/components/molecules/dialog-hints"
import { StepHeader } from "@/shared/components/molecules/step-header"
import { requestIntegration } from "../actions"
import {
  INTEGRATION_CATEGORIES,
  INTEGRATION_CATEGORY_LABELS,
  REQUEST_NOTE_MAX,
} from "../constants"
import type { IntegrationCategory } from "../types"

const FIELD = "border-foreground/10 bg-muted text-sm md:text-sm dark:bg-muted"

type RequestIntegrationDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onClosed: () => void
}

export function RequestIntegrationDialog({
  open,
  onOpenChange,
  onClosed,
}: RequestIntegrationDialogProps) {
  const [name, setName] = useState("")
  const [category, setCategory] = useState<IntegrationCategory>("exchanges")
  const [note, setNote] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isPending, startSubmit] = useTransition()

  const submit = (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    startSubmit(async () => {
      const result = await requestIntegration({ name, category, note })
      if (!result.ok) {
        setError(result.error)
        return
      }
      onOpenChange(false)
      toast.success("Request sent", {
        description: `We'll notify you when ${name.trim()} is available · ${result.reference}`,
      })
    })
  }

  return (
    <Dialog
      onOpenChange={onOpenChange}
      onOpenChangeComplete={(isOpen) => {
        if (!isOpen) onClosed()
      }}
      open={open}
    >
      <DialogContent>
        <form className="flex min-h-0 flex-col" noValidate onSubmit={submit}>
          <StepHeader backLabel="" title="Request an integration" />
          <DialogDescription className="sr-only">
            Tell us which tool you want to connect to Raxon.
          </DialogDescription>

          <DialogBody className="flex flex-col gap-5 p-4">
            <div className="flex flex-col gap-2">
              <label
                className="text-xs text-muted-foreground"
                htmlFor="request-name"
              >
                Tool name
              </label>
              <Input
                autoFocus
                className={`h-11 ${FIELD}`}
                id="request-name"
                maxLength={60}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Hyperliquid, Rabby, Nansen"
                value={name}
              />
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs text-muted-foreground">Category</span>
              <Select
                onValueChange={(value) =>
                  setCategory(value as IntegrationCategory)
                }
                value={category}
              >
                <SelectTrigger
                  aria-label="Category"
                  className={`h-11 w-full data-[size=default]:h-11 ${FIELD}`}
                >
                  <SelectValue>
                    {(value: IntegrationCategory) =>
                      INTEGRATION_CATEGORY_LABELS[value]
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {INTEGRATION_CATEGORIES.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <label htmlFor="request-note">How would you use it?</label>
                <span className="font-mono tabular-nums">
                  {note.length}/{REQUEST_NOTE_MAX}
                </span>
              </div>
              <textarea
                className={`min-h-24 resize-none border px-3 py-2.5 outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50 ${FIELD}`}
                id="request-note"
                maxLength={REQUEST_NOTE_MAX}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Optional"
                value={note}
              />
            </div>

            {error && (
              <p className="border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
                {error}
              </p>
            )}
          </DialogBody>

          <DialogHints
            action={
              <Button
                disabled={name.trim().length < 2}
                loading={isPending}
                size="sm"
                type="submit"
              >
                Send request
              </Button>
            }
            hints={[{ keys: ["Esc"], label: "Cancel" }]}
          />
        </form>
      </DialogContent>
    </Dialog>
  )
}
