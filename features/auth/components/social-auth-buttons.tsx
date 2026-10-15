import { Button } from "@/components/ui/button"
import { AppleLogo } from "@/shared/components/atoms/logos/apple"
import { GoogleLogo } from "@/shared/components/atoms/logos/google"

type SocialAuthButtonsProps = {
  muted?: boolean
}

export function SocialAuthButtons({ muted = false }: SocialAuthButtonsProps) {
  const buttonClassName = muted
    ? "border-border bg-muted/40 hover:bg-muted"
    : ""

  return (
    <>
      <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        <span>or</span>
        <span className="h-px flex-1 bg-border" />
      </div>
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className={`h-10 min-w-0 gap-1.5 px-2 text-xs sm:text-sm 2xl:h-12 2xl:text-base ${buttonClassName}`}
        >
          <GoogleLogo className="size-5" title="Google" />
          <span className="truncate">Continue with Google</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          className={`h-10 min-w-0 gap-1.5 px-2 text-xs sm:text-sm 2xl:h-12 2xl:text-base ${buttonClassName}`}
        >
          <AppleLogo className="size-5" variant="mono" title="Apple" />
          <span className="truncate">Continue with Apple</span>
        </Button>
      </div>
    </>
  )
}
