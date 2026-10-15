export const createRandom = (seed: string) => {
  let state = [...seed].reduce((acc, char) => acc * 31 + char.charCodeAt(0), 7)
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296
  }
}

type RandomWalkOptions = {
  seed: string
  length: number
  start: number
  volatility: number
  drift: number
}

export const randomWalk = ({
  seed,
  length,
  start,
  volatility,
  drift,
}: RandomWalkOptions) => {
  const random = createRandom(seed)
  let value = start
  return Array.from({ length }, () => {
    value += (random() - 0.5 + drift) * volatility
    return value
  })
}
