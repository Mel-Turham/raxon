"use client"

import { useState } from "react"

import { createKeys } from "@/shared/lib/keys"
import { cn } from "@/shared/lib/utils"

type CodeInputProps = {
  value: string
  onChange: (value: string) => void
  length?: number
  invalid?: boolean
  id?: string
  autoFocus?: boolean
  "aria-label"?: string
}

export function CodeInput({
  value,
  onChange,
  length = 6,
  invalid = false,
  id,
  autoFocus,
  "aria-label": ariaLabel,
}: CodeInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const activeIndex = Math.min(value.length, length - 1)

  return (
    <div className="relative flex gap-2">
      {createKeys(length, "digit").map((key, index) => {
        const isActive = isFocused && index === activeIndex
        return (
          <span
            aria-hidden
            className={cn(
              "flex h-11 flex-1 items-center justify-center border border-foreground/10 bg-muted font-mono text-lg tabular-nums transition-colors",
              isActive && "border-primary",
              invalid && "border-destructive"
            )}
            key={key}
          >
            {value[index] ??
              (isActive && (
                <span className="h-5 w-px animate-pulse bg-foreground" />
              ))}
          </span>
        )
      })}
      <input
        aria-invalid={invalid}
        aria-label={ariaLabel}
        autoComplete="one-time-code"
        autoFocus={autoFocus}
        className="absolute inset-0 cursor-text opacity-0"
        id={id}
        inputMode="numeric"
        maxLength={length}
        onBlur={() => setIsFocused(false)}
        onChange={(event) =>
          onChange(event.target.value.replace(/\D/g, "").slice(0, length))
        }
        onFocus={() => setIsFocused(true)}
        value={value}
      />
    </div>
  )
}
