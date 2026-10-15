export const Y_AXIS_DEFAULT_TICK_COUNT = 5

export const Y_AXIS_MIN_TICK_COUNT = 1

export const Y_AXIS_MAX_TICK_COUNT = 10

export function resolveYAxisTickCount(numTicks?: number): number {
  if (numTicks == null || !Number.isFinite(numTicks)) {
    return Y_AXIS_DEFAULT_TICK_COUNT
  }
  const rounded = Math.round(numTicks)
  if (rounded < Y_AXIS_MIN_TICK_COUNT) {
    return Y_AXIS_MIN_TICK_COUNT
  }
  if (rounded > Y_AXIS_MAX_TICK_COUNT) {
    return Y_AXIS_MAX_TICK_COUNT
  }
  return rounded
}
