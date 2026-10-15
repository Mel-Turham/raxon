import { Suspense } from "react"

import { HeaderNavBar } from "@/features/app-shell"
import {
  NotificationsBellFallback,
  NotificationsSection,
} from "@/features/notifications"
import { SearchSection, SearchTriggerFallback } from "@/features/search"
import { UserAvatar } from "@/shared/components/atoms/user-avatar"
import { CURRENT_USER } from "@/shared/config"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <HeaderNavBar
        search={
          <Suspense fallback={<SearchTriggerFallback />}>
            <SearchSection />
          </Suspense>
        }
        userAvatar={<UserAvatar seed={CURRENT_USER.email} />}
        notifications={
          <Suspense fallback={<NotificationsBellFallback />}>
            <NotificationsSection />
          </Suspense>
        }
      />
      {children}
    </>
  )
}
