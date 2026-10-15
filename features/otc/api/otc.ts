import "server-only"

import { request } from "@/shared/api/request"
import { MOCK_OTC_DATA } from "../mocks/otc-data"

export const getOtcDashboardData = () => request(MOCK_OTC_DATA)
