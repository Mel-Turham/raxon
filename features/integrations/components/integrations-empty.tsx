import { PlugSocketIcon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { IconTile } from "@/shared/components/atoms/icon-tile"

export function IntegrationsEmpty({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 border border-dashed border-border px-6 py-16 text-center">
      <IconTile icon={PlugSocketIcon} />
      <div className="space-y-1">
        <p className="text-sm font-medium">No integrations match</p>
        <p className="text-xs text-muted-foreground">
          Try another search or category, or request the tool you need.
        </p>
      </div>
      <Button onClick={onReset} size="sm" variant="outline">
        Clear filters
      </Button>
    </div>
  )
}
