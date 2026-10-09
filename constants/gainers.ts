import { FlashIcon, StarIcon } from "@hugeicons/core-free-icons"

type GainerGlyph = { icon: typeof StarIcon; color: string }

const STAR: GainerGlyph = { icon: StarIcon, color: "var(--primary)" }
const BOLT: GainerGlyph = { icon: FlashIcon, color: "var(--gainer-bolt)" }

/** Small glyph shown before each gainer (from the design). */
export const GAINER_GLYPHS: Record<string, GainerGlyph> = {
  ROSE: STAR,
  JASPER: BOLT,
  AZURE: STAR,
  EMBER: BOLT,
}

export const DEFAULT_GAINER_GLYPH = STAR
