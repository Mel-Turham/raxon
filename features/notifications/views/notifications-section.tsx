import { HEADER_ICON_BUTTON } from "@/features/app-shell"
import { getNotifications } from "@/features/notifications/api/notifications"
import { cn } from "@/shared/lib/utils"

import {
  BellButton,
  NotificationsPopover,
} from "../components/notifications-popover"

export const NotificationsSection = async () => (
  <NotificationsPopover
    initialNotifications={await getNotifications()}
    triggerClassName={HEADER_ICON_BUTTON}
  />
)

export const NotificationsBellFallback = () => (
  <BellButton className={cn(HEADER_ICON_BUTTON, "opacity-60")} unread={0} />
)
