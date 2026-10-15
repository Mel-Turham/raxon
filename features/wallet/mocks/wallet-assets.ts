import { NETWORKS } from "../constants"
import type { WalletAsset, NetworkId } from "../types"

const network = (id: NetworkId, minDeposit: number, withdrawFee: number) => ({
  ...NETWORKS[id],
  minDeposit,
  withdrawFee,
  minWithdraw: withdrawFee * 2,
})

export const MOCK_WALLET_ASSETS: WalletAsset[] = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    balance: 0.4231,
    price: 66_980,
    networks: [
      network("bitcoin", 0.0001, 0.0002),
      network("bnb", 0.00001, 0.00001),
    ],
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    balance: 2.1,
    price: 3_420.5,
    networks: [
      network("ethereum", 0.005, 0.0012),
      network("bnb", 0.0005, 0.0001),
    ],
  },
  {
    symbol: "USDT",
    name: "Tether",
    balance: 1_204,
    price: 1,
    networks: [
      network("ethereum", 10, 4),
      network("tron", 1, 1),
      network("bnb", 1, 0.3),
      network("solana", 1, 1),
    ],
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    balance: 860.5,
    price: 1,
    networks: [
      network("ethereum", 10, 4),
      network("solana", 1, 1),
      network("polygon", 1, 0.5),
    ],
  },
  {
    symbol: "SOL",
    name: "Solana",
    balance: 14.2,
    price: 148.3,
    networks: [network("solana", 0.01, 0.008)],
  },
  {
    symbol: "BNB",
    name: "BNB",
    balance: 3.05,
    price: 585.4,
    networks: [network("bnb", 0.001, 0.0005)],
  },
  {
    symbol: "XRP",
    name: "Ripple",
    balance: 0,
    price: 0.62,
    networks: [network("bnb", 1, 0.25)],
  },
]
