import "server-only"

import { buildMockNotifications } from "@/features/notifications/mocks/mock-notifications-data"
import { request } from "@/shared/api/request"

export const getNotifications = async () => {
  const now = Date.now()
  return request(buildMockNotifications(now))
}
