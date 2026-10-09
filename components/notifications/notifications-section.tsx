import { HEADER_ICON_BUTTON } from "@/components/layouts/header-styles"
import { getNotifications } from "@/lib/api/notifications"
import { cn } from "@/lib/utils"

import { BellButton, NotificationsPopover } from "./notifications-popover"

export const NotificationsSection = async () => (
  <NotificationsPopover
    initialNotifications={await getNotifications()}
    triggerClassName={HEADER_ICON_BUTTON}
  />
)

/** Bell shown while notifications load. */
export const NotificationsBellFallback = () => (
  <BellButton className={cn(HEADER_ICON_BUTTON, "opacity-60")} unread={0} />
)
