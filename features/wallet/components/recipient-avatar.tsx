import Image from "next/image"

import { cn } from "@/shared/lib/utils"
import type { TransferRecipient } from "../types"

type RecipientAvatarProps = {
  recipient: TransferRecipient
  className?: string
}

export const RecipientAvatar = ({
  recipient,
  className,
}: RecipientAvatarProps) => (
  <span
    className={cn(
      "flex size-9 shrink-0 items-end justify-center overflow-hidden bg-primary",
      className
    )}
  >
    <Image
      alt=""
      className="size-full"
      height={96}
      src={recipient.avatar}
      unoptimized
      width={96}
    />
  </span>
)
