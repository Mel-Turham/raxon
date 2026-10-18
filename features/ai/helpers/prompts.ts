export const enhancePrompt = (prompt: string) => {
  const base = prompt.trim().replace(/[.?!]+$/, "")
  return `${base}. Explain the key drivers in plain words, point out the main risks, and suggest 2-3 concrete actions I can take on Raxon.`
}
