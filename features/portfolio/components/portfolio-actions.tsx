"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  CreditCardAddIcon,
  InboxDownloadIcon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { CreateAccountDialog } from "@/features/accounts"
import {
  DepositDialog,
  type WalletAsset,
  WithdrawDialog,
} from "@/features/wallet"

const ACTIONS = [
  { label: "Deposit", icon: CreditCardAddIcon, variant: "outline" },
  { label: "Withdraw", icon: InboxDownloadIcon, variant: "outline" },
  { label: "Create new account", icon: PlusSignIcon, variant: "default" },
] as const

type PortfolioActionsProps = {
  walletAssets?: WalletAsset[]
  accountNames?: string[]
}

export const PortfolioActions = ({
  walletAssets,
  accountNames,
}: PortfolioActionsProps) => (
  <div className="flex flex-wrap items-center gap-2">
    {ACTIONS.map(({ label, icon, variant }) => {
      const button = (
        <Button
          className="h-9 gap-2 px-3.5 text-[13px] font-normal [&_svg:not([class*='size-'])]:size-4"
          disabled={!walletAssets || !accountNames}
          key={label}
          variant={variant}
        >
          <HugeiconsIcon icon={icon} />
          {label}
        </Button>
      )

      if (walletAssets && label === "Deposit") {
        return (
          <DepositDialog assets={walletAssets} key={label} trigger={button} />
        )
      }
      if (walletAssets && label === "Withdraw") {
        return (
          <WithdrawDialog assets={walletAssets} key={label} trigger={button} />
        )
      }
      if (walletAssets && accountNames && label === "Create new account") {
        return (
          <CreateAccountDialog
            accountNames={accountNames}
            assets={walletAssets}
            key={label}
            trigger={button}
          />
        )
      }
      return button
    })}
  </div>
)
