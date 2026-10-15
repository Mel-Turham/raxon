import "server-only"

import { Avatar } from "@dicebear/core"
import avataaars from "@dicebear/styles/avataaars.json"
import Image from "next/image"

import { cn } from "@/shared/lib/utils"

type UserAvatarProps = {
  seed: string

  alt?: string
  className?: string
}

export const UserAvatar = ({ seed, alt = "", className }: UserAvatarProps) => {
  const src = new Avatar(avataaars, { seed, size: 96 }).toDataUri()

  return (
    <span
      className={cn(
        "flex size-9 shrink-0 items-end justify-center overflow-hidden bg-primary",
        className
      )}
    >
      <Image
        alt={alt}
        className="size-full"
        height={96}
        src={src}
        unoptimized
        width={96}
      />
    </span>
  )
}
