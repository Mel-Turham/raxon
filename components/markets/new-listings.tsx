import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons"

import { AnimatedNumber } from "@/components/shared/animated-number"
import { ChangePill } from "@/components/shared/change-pill"
import { TokenAvatar } from "@/components/shared/token-avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { NewListing } from "@/lib/api/types"
import { PRICE_FORMAT } from "@/lib/format"

const ListingCard = ({ listing }: { listing: NewListing }) => (
  <Card className="gap-3">
    <CardHeader>
      <CardTitle className="flex items-center gap-2.5 text-sm font-medium">
        <TokenAvatar symbol={listing.symbol} className="size-8" />
        {listing.name} ({listing.symbol})
      </CardTitle>
    </CardHeader>
    <CardContent className="flex flex-col gap-2">
      <AnimatedNumber
        className="font-mono text-2xl tracking-tight tabular-nums"
        format={{ ...PRICE_FORMAT, maximumFractionDigits: 5 }}
        value={listing.price}
      />
      <span className="flex items-center gap-2 text-xs text-muted-foreground">
        <ChangePill value={listing.change} />
        {listing.change >= 0 ? "gain" : "loss"} for {listing.symbol}
      </span>
    </CardContent>
  </Card>
)

/** "Newest & Most Traded Assets" strip. */
export const NewListings = ({ listings }: { listings: NewListing[] }) => (
  <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
    {listings.map((listing) => (
      <ListingCard key={listing.symbol} listing={listing} />
    ))}
  </div>
)

export const ViewAllLink = () => (
  <Link
    href="#asset-market"
    className="inline-flex items-center gap-1 text-sm text-foreground/90 transition-colors hover:text-foreground"
  >
    View All
    <HugeiconsIcon icon={ArrowUpRight01Icon} size={16} />
  </Link>
)
