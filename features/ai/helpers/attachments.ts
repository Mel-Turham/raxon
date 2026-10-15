import type { WalletAsset } from "@/features/wallet"
import { PRICE } from "@/shared/lib/format"
import type { ChatAttachment } from "../types"

export const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`
}

export const fileAttachment = (file: File): ChatAttachment => {
  const isImage = file.type.startsWith("image/")
  return {
    id: crypto.randomUUID(),
    kind: isImage ? "image" : "file",
    name: file.name,
    meta: formatBytes(file.size),
    url: isImage ? URL.createObjectURL(file) : undefined,
  }
}

export const assetAttachment = (asset: WalletAsset): ChatAttachment => ({
  id: `asset:${asset.symbol}`,
  kind: "asset",
  name: asset.name,
  meta: PRICE.format(asset.price),
  symbol: asset.symbol,
})

export const linkAttachment = (href: string): ChatAttachment => ({
  id: crypto.randomUUID(),
  kind: "link",
  name: new URL(href).hostname.replace(/^www\./, ""),
  meta: "Link",
  url: href,
})

export const isLink = (text: string) => {
  try {
    const url = new URL(text.trim())
    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
}
