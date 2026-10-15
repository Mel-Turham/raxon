import { AiChatSkeleton, AiShellSkeleton } from "@/features/ai"
import {
  AutomationsSkeleton,
  IntegrationsSkeleton,
} from "@/features/integrations"
import { PathSwitch } from "./path-switch"

export function AiLayoutFallback() {
  return (
    <AiShellSkeleton>
      <PathSwitch
        fallback={<AiChatSkeleton />}
        routes={{
          "/ai/integrations/automations": <AutomationsSkeleton />,
          "/ai/integrations": <IntegrationsSkeleton />,
        }}
      />
    </AiShellSkeleton>
  )
}
