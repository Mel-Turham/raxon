import type { ReactNode } from "react"
import { Suspense } from "react"

import { AiSection } from "@/features/ai"
import { AiLayoutFallback } from "./layout-fallback"

export default function AiLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<AiLayoutFallback />}>
      <AiSection>{children}</AiSection>
    </Suspense>
  )
}
