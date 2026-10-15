import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/shared/lib/utils"
import { OTC_STEPS } from "../constants"

type OtcStepsProps = {
  activeStep: number
}

export function OtcSteps({ activeStep }: OtcStepsProps) {
  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle className="text-base">How OTC works</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="flex flex-col">
          {OTC_STEPS.map((step, index) => {
            const isDone = index < activeStep
            const isActive = index === activeStep
            return (
              <li
                className="relative flex gap-3 pb-5 last:pb-0"
                key={step.title}
              >
                {index < OTC_STEPS.length - 1 && (
                  <span
                    aria-hidden
                    className={cn(
                      "absolute top-8 bottom-0 left-3.75 w-px",
                      isDone ? "bg-primary/60" : "bg-border"
                    )}
                  />
                )}
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full border font-mono text-xs transition-colors",
                    isDone &&
                      "border-primary bg-primary text-primary-foreground",
                    isActive && "border-primary bg-primary/10 text-primary",
                    !isDone &&
                      !isActive &&
                      "border-border text-muted-foreground"
                  )}
                >
                  {isDone ? (
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} />
                  ) : (
                    String(index + 1).padStart(2, "0")
                  )}
                </span>
                <div className="flex min-w-0 flex-col gap-0.5 pt-1">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      !isDone && !isActive && "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </li>
            )
          })}
        </ol>
      </CardContent>
    </Card>
  )
}
