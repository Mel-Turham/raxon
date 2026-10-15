import {
  Analytics01Icon,
  Briefcase01Icon,
  ChartLineData01Icon,
  SecurityCheckIcon,
  UserGroupIcon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

export type AuthHighlight = {
  icon: typeof ChartLineData01Icon
  title: string
  description: string
}

export const registerHighlights: AuthHighlight[] = [
  {
    icon: ChartLineData01Icon,
    title: "Spot trading",
    description: "Trade digital assets with real-time execution",
  },
  {
    icon: Briefcase01Icon,
    title: "OTC Trading",
    description: "Access personalized over-the-counter markets",
  },
  {
    icon: Analytics01Icon,
    title: "OTC Advanced Analytics",
    description: "Make informed decisions with detailed market insights",
  },
  {
    icon: Wallet01Icon,
    title: "Multi-Asset Portfolio",
    description: "Manage all your digital assets in one place",
  },
]

export const loginHighlights: AuthHighlight[] = [
  {
    icon: UserGroupIcon,
    title: "100+ assets",
    description: "Explore and manage a growing range of digital assets",
  },
  {
    icon: ChartLineData01Icon,
    title: "Low fees",
    description:
      "Trade with transparent pricing designed to keep more value in your portfolio",
  },
  {
    icon: SecurityCheckIcon,
    title: "Secure by design",
    description:
      "Built to keep your account and digital assets protected at every step",
  },
]

export function AuthHighlights({
  highlights = loginHighlights,
  layout = "stack",
}: {
  highlights?: AuthHighlight[]
  layout?: "stack" | "grid"
}) {
  const layoutClassName = {
    stack: "space-y-5",
    grid: "grid grid-cols-2 gap-x-8 gap-y-3",
  }[layout]

  return (
    <div className={layoutClassName}>
      {highlights.map((highlight) => (
        <div key={highlight.title} className="flex gap-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-background/90 text-primary shadow-[0_8px_24px_color-mix(in_oklch,var(--background)_65%,transparent)] ring-1 ring-primary/20 backdrop-blur-sm">
            <HugeiconsIcon icon={highlight.icon} size={19} />
          </span>
          <div>
            <p className="text-sm font-semibold tracking-tight text-foreground">
              {highlight.title}
            </p>
            <p className="mt-0.5 text-xs leading-5 text-foreground/70">
              {highlight.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
