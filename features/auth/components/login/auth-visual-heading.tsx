export function AuthVisualHeading({
  firstLine = "Trade Smarter.",
  secondLine = "Build Wealth.",
}: {
  firstLine?: string
  secondLine?: string
}) {
  return (
    <p className="absolute top-8 right-8 z-10 text-right text-sm leading-5 text-foreground/80 xl:top-10 xl:right-12">
      {firstLine}
      <br />
      {secondLine}
    </p>
  )
}
