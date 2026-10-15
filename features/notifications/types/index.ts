export type NotificationType =
  | "security_login"
  | "transfer_request"
  | "order_filled"
  | "support_message"
  | "price_alert"
  | "statement_ready"

export type RequestDecision = "approved" | "declined"

type NotificationBase = {
  id: string

  createdAt: string
  read: boolean
  archived: boolean
}

export type AppNotification = NotificationBase &
  (
    | {
        type: "security_login"
        device: string
        location: string
        decision?: RequestDecision
      }
    | {
        type: "transfer_request"
        from: string
        amount: number
        asset: string
        decision?: RequestDecision
      }
    | {
        type: "order_filled"
        side: "buy" | "sell"
        amount: number
        asset: string
        price: number
      }
    | { type: "support_message"; agent: string; message: string }
    | {
        type: "price_alert"
        asset: string
        price: number
        direction: "above" | "below"
        tags: string[]
      }
    | {
        type: "statement_ready"
        period: string
        fileName: string
        sizeKb: number
      }
  )
