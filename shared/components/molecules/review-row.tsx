import type { ReactNode } from "react"

export const ReviewRow = ({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) => (
  <div className="flex items-start justify-between gap-6 py-2.5">
    <dt className="shrink-0 text-muted-foreground">{label}</dt>
    <dd className="min-w-0 text-right">{children}</dd>
  </div>
)
