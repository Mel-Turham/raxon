"use client"

import { type ReactElement, Suspense, useCallback, useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { StepTransition } from "@/shared/components/molecules/step-transition"
import { type DepositAddressResult, requestDepositAddress } from "../actions"
import type { WalletAsset, AssetNetwork } from "../types"
import {
  DepositAddressCard,
  DepositAddressSkeleton,
  DepositAddressStep,
} from "./deposit-address-step"
import { DepositAssetStep } from "./deposit-asset-step"
import { NetworkStep } from "./network-step"

type DepositState =
  | { step: "asset" }
  | { step: "network"; asset: WalletAsset }
  | {
      step: "address"
      asset: WalletAsset
      network: AssetNetwork
      addressPromise: Promise<DepositAddressResult>
    }

const AMOUNT = new Intl.NumberFormat("en-US", { maximumFractionDigits: 6 })

const INITIAL_STATE: DepositState = { step: "asset" }

type DepositDialogProps = {
  assets: WalletAsset[]
  trigger: ReactElement
}

export function DepositDialog({ assets, trigger }: DepositDialogProps) {
  const [state, setState] = useState<DepositState>(INITIAL_STATE)

  const selectAsset = (asset: WalletAsset) =>
    setState({ step: "network", asset })

  const selectNetwork = (asset: WalletAsset, network: AssetNetwork) =>
    setState({
      step: "address",
      asset,
      network,
      addressPromise: requestDepositAddress({
        symbol: asset.symbol,
        network: network.id,
      }),
    })

  const backToAssets = useCallback(() => setState(INITIAL_STATE), [])
  const backToNetworks = useCallback(
    () =>
      setState((current) =>
        current.step === "address"
          ? { step: "network", asset: current.asset }
          : current
      ),
    []
  )

  return (
    <Dialog
      onOpenChangeComplete={(open) => {
        if (!open) setState(INITIAL_STATE)
      }}
    >
      <DialogTrigger render={trigger} />
      <DialogContent>
        <StepTransition step={state.step}>
          {state.step !== "address" && (
            <>
              <DialogTitle className="sr-only">Deposit crypto</DialogTitle>
              <DialogDescription className="sr-only">
                Choose an asset and a network to get your deposit address.
              </DialogDescription>
            </>
          )}

          {state.step === "asset" && (
            <DepositAssetStep assets={assets} onSelect={selectAsset} />
          )}

          {state.step === "network" && (
            <NetworkStep
              asset={state.asset}
              note="Choose the same network as the platform you are sending from."
              onBack={backToAssets}
              onSelect={(network) => selectNetwork(state.asset, network)}
              renderMeta={(network) => (
                <>
                  <span className="text-foreground">
                    ~{network.arrivalMinutes} min
                  </span>
                  <span className="font-mono text-muted-foreground tabular-nums">
                    Min {AMOUNT.format(network.minDeposit)} {state.asset.symbol}
                  </span>
                </>
              )}
            />
          )}

          {state.step === "address" && (
            <DepositAddressStep
              asset={state.asset}
              network={state.network}
              onBack={backToNetworks}
            >
              <Suspense fallback={<DepositAddressSkeleton />}>
                <DepositAddressCard addressPromise={state.addressPromise} />
              </Suspense>
            </DepositAddressStep>
          )}
        </StepTransition>
      </DialogContent>
    </Dialog>
  )
}
