"use client"

import {
  ArrowDataTransferHorizontalIcon,
  ArrowDataTransferVerticalIcon,
  CreditCardAddIcon,
  InboxDownloadIcon,
  Refresh01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Balance } from "@/features/dashboard/types"
import {
  DepositDialog,
  SwapDialog,
  TransferDialog,
  type TransferRecipient,
  type WalletAsset,
  WithdrawDialog,
} from "@/features/wallet"
import { AnimatedNumber } from "@/shared/components/atoms/animated-number"
import { LocalTime } from "@/shared/components/atoms/local-time"
import { CURRENCY_FORMAT } from "@/shared/lib/format"
import { BALANCE_VIEWS, type BalanceView } from "../constants"
import { cn } from "@/shared/lib/utils"
import { BALANCE_LAYOUT } from "../views/skeletons"

const BALANCE_ACTIONS = [
  { label: "Deposit", icon: CreditCardAddIcon, variant: "default" },
  { label: "Withdraw", icon: InboxDownloadIcon, variant: "secondary" },
  { label: "Swap", icon: ArrowDataTransferVerticalIcon, variant: "secondary" },
  {
    label: "Transfer",
    icon: ArrowDataTransferHorizontalIcon,
    variant: "secondary",
  },
] as const

const viewLabel = (view: BalanceView) =>
  BALANCE_VIEWS.find(({ id }) => id === view)?.label

type MyBalanceProps = {
  balance: Balance
  transferContacts: TransferRecipient[]
  walletAssets: WalletAsset[]
}

export const MyBalance = ({
  balance,
  transferContacts,
  walletAssets,
}: MyBalanceProps) => {
  const router = useRouter()
  const [view, setView] = useState<BalanceView>("total")
  const [isRefreshing, startRefresh] = useTransition()

  return (
    <Card className={BALANCE_LAYOUT.card}>
      <CardHeader className="items-center">
        <CardTitle className="text-base">My Balance</CardTitle>
        <CardAction>
          <Select
            value={view}
            onValueChange={(value) => setView(value as BalanceView)}
          >
            <SelectTrigger className="h-7 gap-1.5 border-0 bg-muted py-0 pr-1.5 pl-2.5 text-xs data-[size=default]:h-7 dark:bg-muted dark:hover:bg-muted [&_svg:not([class*='size-'])]:size-3.5">
              <SelectValue>
                {(value: BalanceView) => viewLabel(value)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="end">
              {BALANCE_VIEWS.map(({ id, label }) => (
                <SelectItem key={id} value={id}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>

      <CardContent className={BALANCE_LAYOUT.content}>
        <div className={BALANCE_LAYOUT.summary}>
          <AnimatedNumber
            className="font-mono text-[28px] leading-tight tracking-tight"
            format={CURRENCY_FORMAT}
            value={balance[view]}
          />
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <LocalTime value={balance.updatedAt} />
            <button
              type="button"
              disabled={isRefreshing}
              onClick={() => startRefresh(() => router.refresh())}
              className="inline-flex items-center gap-1 transition-colors hover:text-foreground disabled:opacity-70"
            >
              <HugeiconsIcon
                icon={Refresh01Icon}
                size={14}
                className={cn(isRefreshing && "animate-spin")}
              />
              Refresh
            </button>
          </div>
        </div>

        <div className={BALANCE_LAYOUT.actions}>
          {BALANCE_ACTIONS.map(({ label, icon, variant }) => {
            const button = (
              <Button
                key={label}
                variant={variant}
                className={cn(
                  BALANCE_LAYOUT.action,
                  "gap-2 text-sm font-normal [&_svg:not([class*='size-'])]:size-[17px]"
                )}
              >
                <HugeiconsIcon icon={icon} />
                {label}
              </Button>
            )

            if (label === "Deposit") {
              return (
                <DepositDialog
                  assets={walletAssets}
                  key={label}
                  trigger={button}
                />
              )
            }
            if (label === "Withdraw") {
              return (
                <WithdrawDialog
                  assets={walletAssets}
                  key={label}
                  trigger={button}
                />
              )
            }
            if (label === "Swap") {
              return (
                <SwapDialog
                  assets={walletAssets}
                  key={label}
                  trigger={button}
                />
              )
            }
            if (label === "Transfer") {
              return (
                <TransferDialog
                  assets={walletAssets}
                  contacts={transferContacts}
                  key={label}
                  trigger={button}
                />
              )
            }
            return button
          })}
        </div>
      </CardContent>
    </Card>
  )
}
