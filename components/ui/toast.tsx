"use client"

import {
  Alert02Icon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { toast as sonnerToast } from "sonner"

type ToastVariant = "success" | "error"

type ToastOptions = {
  description?: string
  duration?: number
}

type ToastProps = ToastOptions & {
  title: string
  variant: ToastVariant
}

const variantStyles: Record<
  ToastVariant,
  {
    accent: string
    icon: typeof CheckmarkCircle02Icon
  }
> = {
  success: {
    accent: "var(--success)",
    icon: CheckmarkCircle02Icon,
  },
  error: {
    accent: "var(--destructive)",
    icon: Alert02Icon,
  },
}

function Toast({ title, description, variant }: ToastProps) {
  const styles = variantStyles[variant]

  return (
    <div
      role="status"
      className="relative flex w-[calc(100vw-2rem)] max-w-[480px] items-center gap-3 overflow-hidden rounded-(--card-radius) border border-border/80 bg-card px-4 py-3 text-card-foreground shadow-(--chart-tooltip-shadow) sm:gap-4 sm:px-5 sm:py-3.5"
    >
      <span
        aria-hidden="true"
        className="grid size-6 shrink-0 place-items-center"
        style={{ color: styles.accent }}
      >
        <HugeiconsIcon icon={styles.icon} size={22} strokeWidth={2} />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold leading-5">{title}</p>
        {description ? (
          <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  )
}

function showToast(
  title: string,
  variant: ToastVariant,
  options: ToastOptions = {}
) {
  return sonnerToast.custom(
    () => (
      <Toast
        title={title}
        description={options.description}
        variant={variant}
      />
    ),
    { duration: options.duration }
  )
}

const toast = {
  success: (title: string, options?: ToastOptions) =>
    showToast(title, "success", options),
  error: (title: string, options?: ToastOptions) =>
    showToast(title, "error", options),
}

export { toast }
