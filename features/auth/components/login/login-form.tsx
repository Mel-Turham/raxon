import {
  HelpCircleIcon,
  LockPasswordIcon,
  Mail01Icon,
  ViewIcon,
  ViewOffIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { AnimatePresence, motion } from "motion/react"
import Link from "next/link"
import { useEffect } from "react"
import { useForm, useWatch } from "react-hook-form"
import { useRouter } from "next/navigation"

import { loginSchema, type LoginValues } from "@/features/auth/helpers/schemas"
import { SocialAuthButtons } from "@/features/auth/components/social-auth-buttons"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader } from "@/components/ui/loader"
import { toast } from "@/components/ui/toast"
import { DEMO_EMAIL, DEMO_PASSWORD } from "@/shared/config"
import { useAuthSimulation } from "@/features/auth/state/use-auth-simulation"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type LoginFormProps = {
  showPassword: boolean
  onShowPasswordChange: (showPassword: boolean) => void
}

const testCredentials = {
  email: DEMO_EMAIL,
  password: DEMO_PASSWORD,
}

function LoginFieldError({ message }: { message?: string }) {
  return (
    <AnimatePresence initial={false}>
      {message ? (
        <motion.div
          initial={{ opacity: 0, height: 0, y: -4 }}
          animate={{ opacity: 1, height: "auto", y: 0 }}
          exit={{ opacity: 0, height: 0, y: -4 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="flex items-center gap-1.5 overflow-hidden text-xs text-destructive"
        >
          <Tooltip>
            <TooltipTrigger
              render={
                <button
                  type="button"
                  aria-label="Why is this field invalid?"
                  className="inline-flex shrink-0 cursor-help"
                >
                  <HugeiconsIcon icon={HelpCircleIcon} size={14} />
                </button>
              }
            />
            <TooltipContent side="right" sideOffset={8}>
              This demo accepts only the pre-filled test credentials.
            </TooltipContent>
          </Tooltip>
          <span>{message}</span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export function LoginForm({
  showPassword,
  onShowPasswordChange,
}: LoginFormProps) {
  const router = useRouter()
  const { isLoading, simulateRequest } = useAuthSimulation()
  const {
    register,
    control,
    handleSubmit,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm<LoginValues>({
    defaultValues: testCredentials,
  })
  const [email, password] = useWatch({
    control,
    name: ["email", "password"],
  })
  const credentialsMatch =
    email === testCredentials.email && password === testCredentials.password

  useEffect(() => {
    if (email && email !== testCredentials.email) {
      setError("email", {
        type: "credentials",
        message: "Use the pre-filled test email for this demo.",
      })
    } else if (email === testCredentials.email) {
      clearErrors("email")
    }

    if (password && password !== testCredentials.password) {
      setError("password", {
        type: "credentials",
        message: "Use the pre-filled test password for this demo.",
      })
    } else if (password === testCredentials.password) {
      clearErrors("password")
    }
  }, [clearErrors, email, password, setError])

  async function onSubmit(values: LoginValues) {
    clearErrors()
    const parsed = loginSchema.safeParse(values)

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field = issue.path[0]
        if (field === "email" || field === "password") {
          setError(field, { type: "validation", message: issue.message })
        }
      }
      return
    }

    if (values.email !== testCredentials.email) {
      setError("email", {
        type: "credentials",
        message: "Use the pre-filled test email for this demo.",
      })
    }

    if (values.password !== testCredentials.password) {
      setError("password", {
        type: "credentials",
        message: "Use the pre-filled test password for this demo.",
      })
    }

    if (
      values.email !== testCredentials.email ||
      values.password !== testCredentials.password
    ) {
      return
    }

    await simulateRequest()
    toast.success("Welcome back", {
      description:
        "You are signed in and can now access your dashboard and portfolio.",
    })
    router.push("/dashboard")
  }

  return (
    <div className="mx-auto my-auto w-full max-w-120 py-5 sm:py-6 lg:my-0 lg:mt-8 2xl:mt-10">
      <p className="mb-2 text-base font-medium text-primary">Welcome back</p>
      <h1 className="text-3xl leading-tight font-bold tracking-tight sm:text-4xl">
        Sign in to your account
      </h1>
      <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground sm:mt-4 sm:text-base">
        Access your portfolio, trade the markets
        <br className="hidden sm:block" /> and stay in control of your crypto
        journey.
      </p>

      <form className="mt-9 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <Label htmlFor="email" className="2xl:text-base">
            Email address
          </Label>
          <div className="relative">
            <HugeiconsIcon
              icon={Mail01Icon}
              size={19}
              className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              {...register("email")}
              id="email"
              disabled={isLoading}
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              className="h-10 border-border bg-muted/50 pr-3 pl-11 text-sm placeholder:text-muted-foreground/70 2xl:h-12 2xl:text-base"
            />
          </div>
          <div id="email-error">
            <LoginFieldError message={errors.email?.message} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="2xl:text-base">
            Password
          </Label>
          <div className="relative">
            <HugeiconsIcon
              icon={LockPasswordIcon}
              size={19}
              className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              {...register("password")}
              id="password"
              disabled={isLoading}
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              required
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "password-error" : undefined}
              className="h-10 border-border bg-muted/50 pr-11 pl-11 text-sm placeholder:text-muted-foreground/70 2xl:h-12 2xl:text-base"
            />
            <button
              type="button"
              disabled={isLoading}
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => onShowPasswordChange(!showPassword)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <HugeiconsIcon
                icon={showPassword ? ViewOffIcon : ViewIcon}
                size={19}
              />
            </button>
          </div>
          <div id="password-error">
            <LoginFieldError message={errors.password?.message} />
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 text-xs sm:text-sm 2xl:text-base">
          <Label className="text-muted-foreground">
            <Checkbox defaultChecked aria-label="Remember me" />
            Remember me
          </Label>
          <Link
            href="/forgot-password"
            className="font-medium text-primary transition-colors hover:text-primary/80"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={isLoading || !credentialsMatch}
          className="h-10 w-full text-sm font-semibold 2xl:h-12 2xl:text-base"
        >
          {isLoading ? (
            <Loader className="size-4" aria-label="Signing in" />
          ) : (
            "Sign in"
          )}
        </Button>
      </form>

      <p className="mt-3 text-center text-sm text-muted-foreground sm:text-xs">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="ml-1 font-medium text-primary transition-colors hover:text-primary/80"
        >
          Sign up
        </Link>
      </p>

      <SocialAuthButtons muted />

      <p className="mt-4 text-center text-xs leading-5 text-muted-foreground sm:mt-5">
        By clicking continue, you agree to our{" "}
        <Link
          href="/terms"
          className="text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          className="text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  )
}
