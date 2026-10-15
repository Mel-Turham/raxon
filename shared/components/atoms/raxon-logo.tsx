import Link from "next/link"
import type { ComponentProps } from "react"

type RaxonLogoProps = Omit<ComponentProps<typeof Link>, "children" | "href"> & {
  href?: ComponentProps<typeof Link>["href"]
  label?: string
}

export function RaxonLogo({
  label = "Raxon",
  href = "/",
  className,
  ...props
}: RaxonLogoProps) {
  return (
    <Link
      {...props}
      href={href}
      className={className ?? "flex items-center gap-2.5"}
    >
      <span className="flex size-9 items-center justify-center bg-primary">
        <span className="flex w-3.5 flex-col items-end gap-[1.5px]">
          <span className="h-1 w-full bg-primary-foreground" />
          <span className="h-1 w-full bg-primary-foreground" />
          <span className="h-1 w-2/3 bg-primary-foreground" />
        </span>
      </span>
      <span className="text-xl font-normal tracking-tight">{label}</span>
    </Link>
  )
}
