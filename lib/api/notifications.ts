import "server-only"

import { buildMockNotifications } from "@/lib/api/mock-notifications-data"
import { request } from "@/lib/api/request"

export const getNotifications = async () => {
  const now = Date.now()
  return request(buildMockNotifications(now))
}
