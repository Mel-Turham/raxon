export type MockTransferUser = {
  id: string
  name: string
  email: string
  recent: boolean
}

export const MOCK_TRANSFER_USERS: MockTransferUser[] = [
  {
    id: "48211093",
    name: "Alex Martin",
    email: "alex.martin@gmail.com",
    recent: true,
  },
  {
    id: "51730284",
    name: "Sofia Lopez",
    email: "sofia.lopez@outlook.com",
    recent: true,
  },
  {
    id: "39058172",
    name: "Kenji Watanabe",
    email: "kenji.w@proton.me",
    recent: true,
  },
  {
    id: "62904817",
    name: "Amara Okafor",
    email: "amara.okafor@gmail.com",
    recent: true,
  },
  {
    id: "70413566",
    name: "Lucas Bernard",
    email: "lucas.bernard@yahoo.fr",
    recent: false,
  },
]
