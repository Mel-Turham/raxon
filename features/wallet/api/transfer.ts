import "server-only"

import { Avatar } from "@dicebear/core"
import avataaars from "@dicebear/styles/avataaars.json"

import { request } from "@/shared/api/request"
import { maskEmail } from "../helpers/transfer"
import {
  MOCK_TRANSFER_USERS,
  type MockTransferUser,
} from "../mocks/transfer-users"
import type { TransferRecipient } from "../types"

const toRecipient = (user: MockTransferUser): TransferRecipient => ({
  id: user.id,
  name: user.name,
  handle: maskEmail(user.email),
  avatar: new Avatar(avataaars, { seed: user.email, size: 96 }).toDataUri(),
})

export const getTransferContacts = () =>
  request(MOCK_TRANSFER_USERS.filter((user) => user.recent).map(toRecipient))

export const findTransferUser = async (query: string) => {
  const needle = query.trim().toLowerCase()
  const user = MOCK_TRANSFER_USERS.find(
    (item) => item.id === needle || item.email === needle
  )
  return request(user ? toRecipient(user) : null)
}
