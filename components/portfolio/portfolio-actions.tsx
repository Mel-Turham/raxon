import { HugeiconsIcon } from "@hugeicons/react"
import {
  Download04Icon,
  PlusSignIcon,
  Upload04Icon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"

const ACTIONS = [
  { label: "Deposit", icon: Download04Icon, variant: "outline" },
  { label: "Withdraw", icon: Upload04Icon, variant: "outline" },
  { label: "Create new account", icon: PlusSignIcon, variant: "default" },
] as const

/** Account actions, aligned with the watchlist in the page toolbar. */
export const PortfolioActions = () => (
  <div className="flex flex-wrap items-center gap-2">
    {ACTIONS.map(({ label, icon, variant }) => (
      <Button
        key={label}
        variant={variant}
        className="h-9 gap-2 px-3.5 text-[13px] font-normal [&_svg:not([class*='size-'])]:size-4"
      >
        <HugeiconsIcon icon={icon} />
        {label}
      </Button>
    ))}
  </div>
)
