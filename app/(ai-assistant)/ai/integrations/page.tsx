import type { Metadata } from "next"
import { Suspense } from "react"

import {
  IntegrationsSection,
  IntegrationsSkeleton,
} from "@/features/integrations"

export const metadata: Metadata = {
  title: "Integrations · Raxon AI",
  description:
    "Connect exchanges, wallets, market data and alert channels to Raxon AI.",
}

export default function IntegrationsPage() {
  return (
    <Suspense fallback={<IntegrationsSkeleton />}>
      <IntegrationsSection />
    </Suspense>
  )
}
