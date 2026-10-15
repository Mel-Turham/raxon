import type { Metadata } from "next"
import { Suspense } from "react"

import {
  AutomationsSection,
  AutomationsSkeleton,
} from "@/features/integrations"

export const metadata: Metadata = {
  title: "Automations · Raxon AI",
  description:
    "Send price alerts, AI signals and daily briefs to Telegram, Discord, Slack or webhooks.",
}

export default function AutomationsPage() {
  return (
    <Suspense fallback={<AutomationsSkeleton />}>
      <AutomationsSection />
    </Suspense>
  )
}
