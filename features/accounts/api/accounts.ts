import "server-only"

import { request } from "@/shared/api/request"
import { MOCK_ACCOUNT_NAMES } from "../mocks/accounts"

const accountNames = [...MOCK_ACCOUNT_NAMES]

export const getAccountNames = () => request([...accountNames])

export const saveAccountName = (name: string) => {
  accountNames.push(name)
}
