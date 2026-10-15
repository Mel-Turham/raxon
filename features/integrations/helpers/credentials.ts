const API_KEY_PATTERN = /^[A-Za-z0-9_-]{16,128}$/

const ADDRESS_PATTERNS = [
  { network: "EVM", pattern: /^0x[a-fA-F0-9]{40}$/ },
  {
    network: "Bitcoin",
    pattern: /^(bc1[a-z0-9]{25,62}|[13][a-km-zA-HJ-NP-Z1-9]{25,34})$/,
  },
  { network: "Solana", pattern: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/ },
] as const

export const validateApiCredential = (value: string, label: string) => {
  if (!value) return `${label} is required.`
  if (!API_KEY_PATTERN.test(value)) {
    return `${label} looks invalid. Copy it again from your exchange.`
  }
  return null
}

export const detectAddressNetwork = (address: string) =>
  ADDRESS_PATTERNS.find(({ pattern }) => pattern.test(address))?.network ?? null

export const validateWalletAddress = (address: string) => {
  if (!address) return "Address is required."
  if (!detectAddressNetwork(address)) {
    return "Enter a valid EVM, Bitcoin or Solana address."
  }
  return null
}

export const maskSecret = (value: string) => `••••${value.slice(-4)}`
