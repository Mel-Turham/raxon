export const downloadCsv = (
  filename: string,
  header: string[],
  rows: (string | number)[][]
) => {
  const escapeCsvCell = (cell: string | number) => {
    const text = String(cell)
    const guarded = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text
    return /[",\n]/.test(guarded) ? `"${guarded.replace(/"/g, '""')}"` : guarded
  }
  const csv = [header, ...rows]
    .map((row) => row.map(escapeCsvCell).join(","))
    .join("\n")
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }))
  const link = Object.assign(document.createElement("a"), {
    href: url,
    download: filename,
  })
  link.click()
  URL.revokeObjectURL(url)
}
