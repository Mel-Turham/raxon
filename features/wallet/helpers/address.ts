import type { NetworkId } from "../types"

const HEX = "0123456789abcdef"
const BASE58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
const BECH32 = "qpzry9x8gf2tvdw0s3jn54khce6mua7l"

const seeded = (seed: string) => {
  let state = [...seed].reduce(
    (hash, char) => Math.imul(hash ^ char.charCodeAt(0), 16_777_619),
    2_166_136_261
  )
  return () => {
    state = Math.imul(state ^ (state >>> 13), 1_274_126_177)
    return ((state ^ (state >>> 16)) >>> 0) / 4_294_967_296
  }
}

const randomString = (random: () => number, alphabet: string, length: number) =>
  Array.from(
    { length },
    () => alphabet[Math.floor(random() * alphabet.length)]
  ).join("")

export const mockDepositAddress = (seed: string, network: NetworkId) => {
  const random = seeded(`${seed}:${network}`)
  if (network === "bitcoin") return `bc1q${randomString(random, BECH32, 38)}`
  if (network === "solana") return randomString(random, BASE58, 44)
  if (network === "tron") return `T${randomString(random, BASE58, 33)}`
  return `0x${randomString(random, HEX, 40)}`
}
