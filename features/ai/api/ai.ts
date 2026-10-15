import "server-only"

import { request } from "@/shared/api/request"
import { MOCK_AI_INSIGHTS } from "../mocks/ai-data"

export const getAiInsights = () => request(MOCK_AI_INSIGHTS)
