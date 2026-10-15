import { TOKEN_BRANDS } from "@/shared/config"
import { cn } from "@/shared/lib/utils"

type TokenAvatarProps = {
  symbol: string
  className?: string
}

export const TokenAvatar = ({ symbol, className }: TokenAvatarProps) => {
  const brand = TOKEN_BRANDS[symbol]
  const Icon = brand?.icon

  return (
    <span
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-muted-foreground",
        className
      )}
      style={
        brand && { backgroundColor: brand.background, color: brand.foreground }
      }
    >
      {Icon ? <Icon variant="mono" size={20} /> : symbol.slice(0, 3)}
    </span>
  )
}
