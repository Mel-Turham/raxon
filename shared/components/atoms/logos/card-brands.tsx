import type { SVGProps } from "react"

type CardBrandLogoProps = SVGProps<SVGSVGElement>

export function VisaLogo(props: CardBrandLogoProps) {
  return (
    <svg viewBox="0 0 48 16" xmlns="http://www.w3.org/2000/svg" {...props}>
      <title>Visa</title>
      <text
        fill="#1A1F71"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="16"
        fontStyle="italic"
        fontWeight="900"
        letterSpacing="-0.5"
        x="1"
        y="14"
      >
        VISA
      </text>
    </svg>
  )
}

export function MastercardLogo(props: CardBrandLogoProps) {
  return (
    <svg viewBox="0 0 32 20" xmlns="http://www.w3.org/2000/svg" {...props}>
      <title>Mastercard</title>
      <circle cx="10" cy="10" fill="#EB001B" r="10" />
      <circle cx="22" cy="10" fill="#F79E1B" r="10" />
      <path d="M16 2a10 10 0 0 1 0 16 10 10 0 0 1 0-16Z" fill="#FF5F00" />
    </svg>
  )
}
