import "server-only"

import Image from "next/image"
import { Avatar } from "@dicebear/core"
import avataaars from "@dicebear/styles/avataaars.json"

import { cn } from "@/lib/utils"

type UserAvatarProps = {
  /** Stable per user (e.g. email): same seed, same avatar. */
  seed: string
  /** Accessible name; empty when the user's name is shown next to it. */
  alt?: string
  className?: string
}

/**
 * DiceBear "Avataaars" avatar, generated on the server so the style
 * definition never ships to the browser.
 */
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
