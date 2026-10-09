import { ArrowRight02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Image from "next/image"
import Link from "next/link"
import { range } from "@/components/shared/skeleton-parts"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const STAR_COUNT = 22

const star = (index: number) => ({
  left: `${(index * 37) % 100}%`,
  top: `${(index * 53 + 11) % 100}%`,
  opacity: 0.15 + ((index * 7) % 10) / 25,
})

export const AiInsightCard = () => (
  <Card className="relative isolate gap-0 bg-[radial-gradient(85%_55%_at_50%_0%,var(--ai-card-glow),transparent_75%)]">
    <div aria-hidden className="absolute inset-0 -z-10">
      {range(STAR_COUNT).map((index) => (
        <span
          key={index}
          className="absolute size-0.5 rounded-full bg-foreground"
          style={star(index)}
        />
      ))}
    </div>

    <CardContent className="flex flex-1 flex-col items-center justify-between gap-6 text-center">
      {/* Glass orb: lit core, bright rim, soft brand glow. */}
      <div className="mt-2 flex size-32 items-center justify-center rounded-full border border-(--ai-orb-rim) bg-[radial-gradient(circle_at_50%_30%,var(--ai-orb-core),var(--ai-orb-edge)_72%)] shadow-(--ai-card-orb-shadow) backdrop-blur-sm">
        <Image
          alt="Raxon AI assistant"
          className="size-24 object-contain drop-shadow-lg"
          height={96}
          preload
          src="/ai-raxon.png"
          width={96}
        />
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="mx-auto max-w-60 text-2xl leading-tight font-semibold text-balance">
          Smart Trading Predictions with AI
        </h3>
        <p className="text-sm text-balance text-muted-foreground">
          Make faster, smarter decisions with precision-driven data.
        </p>
      </div>

      <Link
        href="/analytics"
        className={cn(
          buttonVariants(),
          "h-11 w-full gap-2 bg-linear-to-r from-(--ai-cta-from) to-primary text-sm font-semibold shadow-(--ai-cta-shadow) hover:brightness-110"
        )}
      >
        Get Started
        <HugeiconsIcon icon={ArrowRight02Icon} size={18} />
      </Link>
    </CardContent>
  </Card>
)
