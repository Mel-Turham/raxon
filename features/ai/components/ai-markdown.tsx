"use client"

import { memo } from "react"
import Markdown, { type Components } from "react-markdown"
import remarkGfm from "remark-gfm"

const COMPONENTS: Components = {
  p: ({ children }) => <p className="text-pretty">{children}</p>,
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  em: ({ children }) => <em className="text-foreground/90">{children}</em>,
  h1: ({ children }) => (
    <h3 className="mt-1 text-base font-semibold text-foreground">{children}</h3>
  ),
  h2: ({ children }) => (
    <h3 className="mt-1 text-base font-semibold text-foreground">{children}</h3>
  ),
  h3: ({ children }) => (
    <h4 className="mt-1 text-sm font-semibold text-foreground">{children}</h4>
  ),
  ul: ({ children }) => (
    <ul className="flex flex-col gap-1.5 pl-5 marker:text-primary">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="flex list-decimal flex-col gap-1.5 pl-5 marker:text-muted-foreground">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="list-disc pl-1">{children}</li>,
  a: ({ children, href }) => (
    <a
      className="text-primary underline underline-offset-4 hover:no-underline"
      href={href}
      rel="noreferrer"
      target="_blank"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-primary/50 pl-3 text-muted-foreground">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="border-foreground/10" />,
  code: ({ children }) => (
    <code className="bg-foreground/[0.06] px-1 py-0.5 font-mono text-[13px] text-foreground">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="overflow-x-auto border border-foreground/10 bg-foreground/[0.03] p-3 text-[13px] [&_code]:bg-transparent [&_code]:p-0">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto border border-foreground/10">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-foreground/[0.04] text-xs text-muted-foreground">
      {children}
    </thead>
  ),
  tr: ({ children }) => (
    <tr className="border-b border-foreground/8 last:border-b-0">{children}</tr>
  ),
  th: ({ children }) => (
    <th className="px-3 py-2 text-left font-medium whitespace-nowrap">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-3 py-2 font-mono text-[13px] whitespace-nowrap tabular-nums">
      {children}
    </td>
  ),
}

export const AiMarkdown = memo(function AiMarkdown({ text }: { text: string }) {
  return (
    <div className="flex flex-col gap-3">
      <Markdown components={COMPONENTS} remarkPlugins={[remarkGfm]}>
        {text}
      </Markdown>
    </div>
  )
})
