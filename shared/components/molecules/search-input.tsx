import { Search01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { ComponentProps, ReactNode } from "react"

import { Input } from "@/components/ui/input"
import { cn } from "@/shared/lib/utils"

type SearchInputProps = Omit<ComponentProps<typeof Input>, "type"> & {
  trailing?: ReactNode
  containerClassName?: string
}

export const SearchInput = ({
  trailing,
  className,
  containerClassName,
  ...props
}: SearchInputProps) => {
  return (
    <div className={cn("relative", containerClassName)}>
      <HugeiconsIcon
        icon={Search01Icon}
        size={16}
        className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        type="search"
        className={cn(
          "h-9 border-border pl-9 text-sm md:text-sm",
          trailing && "pr-16",
          className
        )}
        {...props}
      />
      {trailing && (
        <div className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2">
          {trailing}
        </div>
      )}
    </div>
  )
}
