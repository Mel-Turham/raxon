import { ACCOUNT_NAME_MAX, ACCOUNT_NAME_MIN } from "../constants"

const NAME_PATTERN = /^[A-Za-z0-9][A-Za-z0-9 _-]*$/

export const normalizeAccountName = (name: string) =>
  name.trim().replace(/\s+/g, " ")

export const validateAccountName = (name: string, takenNames: string[]) => {
  const value = normalizeAccountName(name)
  if (value.length < ACCOUNT_NAME_MIN) {
    return `Use at least ${ACCOUNT_NAME_MIN} characters.`
  }
  if (value.length > ACCOUNT_NAME_MAX) {
    return `Use ${ACCOUNT_NAME_MAX} characters or fewer.`
  }
  if (!NAME_PATTERN.test(value)) {
    return "Letters, numbers, spaces, - and _ only."
  }
  if (takenNames.some((taken) => taken.toLowerCase() === value.toLowerCase())) {
    return "You already have an account with this name."
  }
  return null
}

export const validateFundingAmount = (amount: number, balance: number) => {
  if (!(amount > 0)) return "Enter an amount."
  if (amount > balance) return "Insufficient balance in your Main account."
  return null
}
