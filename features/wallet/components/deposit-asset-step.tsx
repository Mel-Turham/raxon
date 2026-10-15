"use client"

import { useState } from "react"

import { DialogBody } from "@/components/ui/dialog"
import { Kbd } from "@/components/ui/kbd"
import { SegmentedTabs } from "@/shared/components/molecules/segmented-tabs"
import { DEPOSIT_METHODS } from "../constants"
import type { WalletAsset } from "../types"
import { AssetPicker } from "./asset-picker"
import { DepositPaymentMethods } from "./deposit-payment-methods"
import { DialogHints } from "@/shared/components/molecules/dialog-hints"

type DepositAssetStepProps = {
  assets: WalletAsset[]
  onSelect: (asset: WalletAsset) => void
}

export function DepositAssetStep({ assets, onSelect }: DepositAssetStepProps) {
  const [method, setMethod] = useState<(typeof DEPOSIT_METHODS)[number]>(
    DEPOSIT_METHODS[0]
  )

  return (
    <>
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-foreground/10 px-4 py-2.5">
        <SegmentedTabs
          onValueChange={setMethod}
          options={DEPOSIT_METHODS}
          value={method}
        />
        <Kbd>Esc</Kbd>
      </div>

      {method === "Crypto" ? (
        <AssetPicker
          assets={assets}
          label="Search asset to deposit"
          onSelect={onSelect}
        />
      ) : (
        <>
          <DialogBody>
            <DepositPaymentMethods />
          </DialogBody>
          <DialogHints
            hints={[
              { keys: ["Tab"], label: "Navigate" },
              { keys: ["↵"], label: "Select" },
            ]}
          />
        </>
      )}
    </>
  )
}
