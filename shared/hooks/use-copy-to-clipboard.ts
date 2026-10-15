"use client"

import { useEffect, useState } from "react"

import { toast } from "@/components/ui/toast"

const COPY_RESET_MS = 2000

export function useCopyToClipboard() {
  const [copiedValue, setCopiedValue] = useState<string | null>(null)

  useEffect(() => {
    if (!copiedValue) return
    const timer = window.setTimeout(() => setCopiedValue(null), COPY_RESET_MS)
    return () => window.clearTimeout(timer)
  }, [copiedValue])

  const copy = async (
    value: string,
    { label, description }: { label: string; description?: string }
  ) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopiedValue(value)
      toast.success(`${label} copied`, { description })
    } catch {
      toast.error(`Could not copy the ${label.toLowerCase()}`)
    }
  }

  return { copiedValue, copy }
}
