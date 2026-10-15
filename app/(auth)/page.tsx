import type { Metadata } from "next"
import { LoginView } from "@/features/auth"

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Raxon account to track your digital assets.",
}

export default function Page() {
  return <LoginView />
}
