import { Search01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { ComponentProps } from "react"

import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { cn } from "@/shared/lib/utils"

export const SearchTrigger = ({
  className,
  ...props
}: ComponentProps<"button">) => (
  <button
    aria-label="Search"
    className={cn(
      "flex size-9 shrink-0 items-center justify-center gap-2 border border-border text-sm text-muted-foreground transition-colors hover:bg-foreground/[0.04] hover:text-foreground disabled:pointer-events-none lg:w-64 lg:justify-start lg:px-3 xl:w-44 2xl:w-72",
      className
    )}
    type="button"
    {...props}
  >
    <HugeiconsIcon className="shrink-0" icon={Search01Icon} size={16} />
    <span className="hidden flex-1 truncate text-left lg:inline">
      Search here...
    </span>
    <KbdGroup className="hidden 2xl:inline-flex">
      <Kbd>⌘</Kbd>
      <Kbd>K</Kbd>
    </KbdGroup>
  </button>
)
