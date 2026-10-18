import { FlashIcon, StarIcon } from "@hugeicons/core-free-icons"

type GainerGlyph = { icon: typeof StarIcon; color: string }

const STAR: GainerGlyph = { icon: StarIcon, color: "var(--primary)" }
const BOLT: GainerGlyph = { icon: FlashIcon, color: "var(--gainer-bolt)" }

export const GAINER_GLYPHS: Record<"up" | "down", GainerGlyph> = {
  up: BOLT,
  down: STAR,
}
