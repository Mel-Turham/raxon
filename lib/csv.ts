/** Builds a CSV (RFC 4180 quoting) and triggers a download in the browser. */
export const downloadCsv = (
  filename: string,
  header: string[],
  rows: (string | number)[][]
) => {
  const escape = (cell: string | number) => {
    const text = String(cell)
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
  }
  const csv = [header, ...rows]
    .map((row) => row.map(escape).join(","))
    .join("\n")
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }))
  const link = Object.assign(document.createElement("a"), {
    href: url,
    download: filename,
  })
  link.click()
  URL.revokeObjectURL(url)
}
