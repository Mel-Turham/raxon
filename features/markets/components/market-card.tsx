import type { ReactNode } from "react"

import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/shared/lib/utils"

export const MarketCard = ({
  title,
  action,
  children,
  className,
  contentClassName,
}: {
  title: string
  action?: ReactNode
  children: ReactNode
  className?: string
  contentClassName?: string
}) => (
  <Card className={cn("gap-3", className)}>
    <CardHeader className="min-h-9 items-center lg:min-h-10">
      <CardTitle className="text-base">{title}</CardTitle>
      {action && <CardAction>{action}</CardAction>}
    </CardHeader>
    <CardContent className={cn("flex flex-1 flex-col", contentClassName)}>
      {children}
    </CardContent>
  </Card>
)
