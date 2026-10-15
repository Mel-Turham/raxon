import type { AiBlock } from "../types"

const blockUnits = (block: AiBlock) =>
  block.type === "text" ? block.text.length : 1

export const totalUnits = (blocks: AiBlock[]) =>
  blocks.reduce((sum, block) => sum + blockUnits(block), 0)

export const revealBlocks = (blocks: AiBlock[], revealed: number) => {
  let budget = revealed
  const visible: AiBlock[] = []
  for (const block of blocks) {
    if (budget <= 0) break
    if (block.type === "text") {
      visible.push({ ...block, text: block.text.slice(0, budget) })
    } else {
      visible.push(block)
    }
    budget -= blockUnits(block)
  }
  return visible
}
