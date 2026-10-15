import Link from "next/link"

import { Button } from "@/components/ui/button"
import { RaxonLogo } from "@/shared/components/atoms/raxon-logo"

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col px-6 text-foreground">
      <header className="mx-auto flex w-full max-w-7xl py-6">
        <RaxonLogo href="/dashboard" />
      </header>
      <section className="mx-auto flex w-full max-w-7xl flex-1 items-center justify-center py-16">
        <div className="max-w-xl">
          <p className="font-mono text-sm text-primary">ERROR 404</p>
          <h1 className="mt-5 text-4xl font-medium tracking-tight sm:text-6xl">
            This page could not be found.
          </h1>
          <p className="mt-5 max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
            The link may be incorrect, or the page may have moved. Return to the
            dashboard to keep exploring.
          </p>
          <Button
            render={<Link href="/dashboard" />}
            size="lg"
            nativeButton={false}
            className="mt-8"
          >
            Back to dashboard
          </Button>
        </div>
      </section>
    </main>
  )
}
