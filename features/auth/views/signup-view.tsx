import { AuthLogo } from "../components/login/auth-logo"
import { AuthVisual } from "../components/login/auth-visual"
import { Signup } from "../components/signup"

export function SignupView() {
  return (
    <main className="h-svh overflow-hidden">
      <div className="grid h-full w-full lg:grid-cols-[0.9fr_1.1fr]">
        <AuthVisual
          scene="register"
          heading={{
            firstLine: "Build your future.",
            secondLine: "Trade with confidence.",
          }}
        />
        <section className="flex min-h-0 flex-col px-7 py-5 sm:px-12 sm:py-8 lg:px-14">
          <div className="mx-auto flex min-h-0 w-full max-w-120 flex-1 flex-col">
            <AuthLogo />
            <Signup />
          </div>
        </section>
      </div>
    </main>
  )
}
