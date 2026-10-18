export const memoizeFor = <T>(ttlMs: number, load: () => Promise<T>) => {
  let cached: { value: Promise<T>; expiresAt: number } | undefined
  return () => {
    if (!cached || cached.expiresAt < Date.now()) {
      const value = load().catch((error) => {
        cached = undefined
        throw error
      })
      cached = { value, expiresAt: Date.now() + ttlMs }
    }
    return cached.value
  }
}
