"use client"

import { MoreHorizontalIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useRouter } from "next/navigation"
import type { ReactNode } from "react"

import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/shared/lib/utils"

type ListCardProps = {
  title: string
  children: ReactNode

  action?: ReactNode

  stretch?: boolean
  className?: string
}

export const CardMenu = ({ title }: { title: string }) => {
  const router = useRouter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`${title} options`}
        className="flex size-7 items-center justify-center text-muted-foreground transition-colors outline-none hover:text-foreground"
      >
        <HugeiconsIcon icon={MoreHorizontalIcon} size={20} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuItem onClick={() => router.refresh()}>
          Refresh
        </DropdownMenuItem>
        <DropdownMenuItem>View all</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const ListCard = ({
  title,
  children,
  action,
  stretch = false,
  className,
}: ListCardProps) => {
  return (
    <Card className={cn("gap-2", className)}>
      <CardHeader className="items-center">
        <CardTitle className="text-base">{title}</CardTitle>
        <CardAction>{action ?? <CardMenu title={title} />}</CardAction>
      </CardHeader>
      <CardContent
        className={cn(
          stretch &&
            "flex-1 *:data-[slot=table-container]:h-full [&_table]:h-full [&_thead_tr]:h-8"
        )}
      >
        {children}
      </CardContent>
    </Card>
  )
}
