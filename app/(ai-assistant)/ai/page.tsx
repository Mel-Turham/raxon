import type { Metadata } from "next"

import { AiView, parseAiDraft } from "@/features/ai"

export const metadata: Metadata = {
  title: "Raxon AI",
  description:
    "Ask questions about your portfolio and the crypto market, and get AI insights.",
}

export default async function AiPage({ searchParams }: PageProps<"/ai">) {
  return <AiView draft={parseAiDraft((await searchParams).prompt)} />
}
