import type { Metadata } from "next"
import { SignupView } from "@/features/auth"

export const metadata: Metadata = {
  title: "Sign up",
  description:
    "Create your Raxon account and start tracking your digital assets.",
}

export default function Page() {
  return <SignupView />
}
