"use client"

import {
  LockPasswordIcon,
  Mail01Icon,
  Tag01Icon,
  UserIcon,
  ViewIcon,
  ViewOffIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { motion } from "motion/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import type { UseFormRegisterReturn } from "react-hook-form"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader } from "@/components/ui/loader"
import { toast } from "@/components/ui/toast"
import { SocialAuthButtons } from "@/features/auth/components/social-auth-buttons"
import {
  type SignupValues,
  signupSchema,
} from "@/features/auth/helpers/schemas"
import { useAuthSimulation } from "@/features/auth/state/use-auth-simulation"
import { DEMO_EMAIL, DEMO_PASSWORD } from "@/shared/config"

export function Signup() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const { isLoading, simulateRequest } = useAuthSimulation()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignupValues>({
    defaultValues: {
      name: "John Doe",
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
      referral: "",
    },
  })

  async function onSubmit(values: SignupValues) {
    const result = signupSchema.safeParse(values)
    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = issue.path[0]
        if (
          field === "name" ||
          field === "email" ||
          field === "password" ||
          field === "referral"
        ) {
          setError(field, { type: "validation", message: issue.message })
        }
      }
      return
    }

    await simulateRequest()
    toast.success("Account created successfully", {
      description:
        "Your Raxon account is ready. You can now access your dashboard.",
    })
    router.push("/dashboard")
  }

  return (
    <div className="mx-auto my-auto w-full max-w-120 py-5 sm:py-6 lg:my-0 lg:mt-8 2xl:mt-10">
      <p className="mb-2 text-base font-medium text-primary">Get started</p>
      <h1 className="text-3xl leading-tight font-bold tracking-tight sm:text-4xl">
        Create your account
      </h1>
      <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground sm:mt-4 sm:text-base">
        Join Raxon and take control of your financial future. It only takes a
        few seconds.
      </p>

      <form className="mt-7 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <SignupField
          id="name"
          label="Full name"
          icon={UserIcon}
          placeholder="John Doe"
          error={errors.name?.message}
          registration={register("name")}
          disabled={isLoading}
        />
        <SignupField
          id="email"
          label="Email address"
          icon={Mail01Icon}
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          registration={register("email")}
          disabled={isLoading}
        />
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
              placeholder="Create a strong password"
              aria-invalid={Boolean(errors.password)}
              className="h-10 border-border bg-muted/50 pr-11 pl-11 text-sm 2xl:h-12 2xl:text-base"
            />
            <button
              type="button"
              disabled={isLoading}
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground"
            >
              <HugeiconsIcon
                icon={showPassword ? ViewOffIcon : ViewIcon}
                size={19}
              />
            </button>
          </div>
          <FieldError message={errors.password?.message} />
        </div>
        <SignupField
          id="referral"
          label="Referral code (optional)"
          icon={Tag01Icon}
          placeholder="Enter code"
          error={errors.referral?.message}
          registration={register("referral")}
          disabled={isLoading}
        />

        <Button
          type="submit"
          size="lg"
          disabled={isLoading}
          className="h-10 w-full text-sm font-semibold 2xl:h-12 2xl:text-base"
        >
          {isLoading ? (
            <Loader className="size-4" aria-label="Creating account" />
          ) : (
            "Create account"
          )}
        </Button>
      </form>

      <p className="mt-3 text-center text-sm text-muted-foreground sm:text-xs">
        Already have an account?{" "}
        <Link
          href="/"
          className="ml-1 font-medium text-primary transition-colors hover:text-primary/80"
        >
          Sign in
        </Link>
      </p>

      <SocialAuthButtons />

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

function SignupField({
  id,
  label,
  icon,
  type = "text",
  placeholder,
  error,
  registration,
  disabled,
}: {
  id: string
  label: string
  icon: typeof UserIcon
  type?: string
  placeholder: string
  error?: string
  registration: UseFormRegisterReturn
  disabled?: boolean
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="2xl:text-base">
        {label}
      </Label>
      <div className="relative">
        <HugeiconsIcon
          icon={icon}
          size={19}
          className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          {...registration}
          id={id}
          disabled={disabled}
          type={type}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          className="h-10 border-border bg-muted/50 pr-3 pl-11 text-sm 2xl:h-12 2xl:text-base"
        />
      </div>
      <FieldError message={error} />
    </div>
  )
}

function FieldError({ message }: { message?: string }) {
  return message ? (
    <motion.p
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      className="text-xs text-destructive"
    >
      {message}
    </motion.p>
  ) : null
}
