"use client"

import { BankIcon, CreditCardAddIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { ReactNode } from "react"

import { CommandGroupLabel } from "@/components/ui/command"
import { toast } from "@/components/ui/toast"
import { AppleLogo } from "@/shared/components/atoms/logos/apple"
import {
  MastercardLogo,
  VisaLogo,
} from "@/shared/components/atoms/logos/card-brands"
import { GoogleLogo } from "@/shared/components/atoms/logos/google"
import { cn } from "@/shared/lib/utils"

type PaymentMethod = {
  id: string
  label: string
  detail: string
  meta: string
  logo: ReactNode
}

const LOGO_TILE =
  "flex h-8 w-12 shrink-0 items-center justify-center shadow-(--icon-surface-shadow)"

const SAVED_CARDS: PaymentMethod[] = [
  {
    id: "visa-4242",
    label: "Visa •••• 4242",
    detail: "Expires 08/28",
    meta: "Instant · 1.8% fee",
    logo: (
      <span className={cn(LOGO_TILE, "bg-white")}>
        <VisaLogo className="h-3" />
      </span>
    ),
  },
  {
    id: "mastercard-8812",
    label: "Mastercard •••• 8812",
    detail: "Expires 11/27",
    meta: "Instant · 1.8% fee",
    logo: (
      <span className={cn(LOGO_TILE, "bg-white")}>
        <MastercardLogo className="h-4" />
      </span>
    ),
  },
]

const OTHER_METHODS: PaymentMethod[] = [
  {
    id: "apple-pay",
    label: "Apple Pay",
    detail: "Pay with your Apple device",
    meta: "Instant · 1.5% fee",
    logo: (
      <span className={cn(LOGO_TILE, "bg-foreground text-background")}>
        <AppleLogo className="size-4" title="Apple Pay" variant="mono" />
      </span>
    ),
  },
  {
    id: "google-pay",
    label: "Google Pay",
    detail: "Pay with your Google account",
    meta: "Instant · 1.5% fee",
    logo: (
      <span className={cn(LOGO_TILE, "bg-white")}>
        <GoogleLogo className="size-4" title="Google Pay" />
      </span>
    ),
  },
  {
    id: "bank-transfer",
    label: "Bank transfer",
    detail: "SEPA · SWIFT",
    meta: "1–2 days · Free",
    logo: (
      <span className={cn(LOGO_TILE, "bg-muted text-muted-foreground")}>
        <HugeiconsIcon icon={BankIcon} size={16} />
      </span>
    ),
  },
]

const announce = (label: string) =>
  toast.success(`${label} selected`, {
    description: "Card and bank deposits will be available soon.",
  })

const MethodRow = ({ method }: { method: PaymentMethod }) => (
  <button
    className="flex min-h-16 w-full items-center gap-3 px-3 py-3 text-left transition-colors outline-none hover:bg-foreground/6 focus-visible:bg-foreground/6"
    onClick={() => announce(method.label)}
    type="button"
  >
    {method.logo}
    <span className="flex min-w-0 flex-1 flex-col">
      <span className="truncate text-sm font-medium">{method.label}</span>
      <span className="truncate text-xs text-muted-foreground">
        {method.detail}
      </span>
    </span>
    <span className="shrink-0 text-xs text-muted-foreground">
      {method.meta}
    </span>
  </button>
)

const MethodGroup = ({
  label,
  methods,
}: {
  label: string
  methods: PaymentMethod[]
}) => (
  <div className="flex flex-col">
    <CommandGroupLabel>{label}</CommandGroupLabel>
    <div className="flex flex-col divide-y divide-foreground/8">
      {methods.map((method) => (
        <MethodRow key={method.id} method={method} />
      ))}
    </div>
  </div>
)

export function DepositPaymentMethods() {
  return (
    <div className="flex flex-col gap-1 p-1.5">
      <MethodGroup label="Saved cards" methods={SAVED_CARDS} />
      <MethodGroup label="Other methods" methods={OTHER_METHODS} />
      <button
        className="mt-1 flex min-h-11 items-center gap-3 border border-dashed border-foreground/15 px-2.5 text-sm text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
        onClick={() => announce("New card")}
        type="button"
      >
        <HugeiconsIcon icon={CreditCardAddIcon} size={16} />
        Add a new card
      </button>
    </div>
  )
}
