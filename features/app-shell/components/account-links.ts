import {
  AlertCircleIcon,
  Settings01Icon,
  UserIcon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons"

export const ACCOUNT_LINKS = [
  { label: "Profile", icon: UserIcon },
  { label: "Wallet", icon: Wallet01Icon },
  { label: "Settings", icon: Settings01Icon },
] as const

export const HELP_LINK = {
  label: "Help & support",
  icon: AlertCircleIcon,
} as const
