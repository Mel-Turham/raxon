import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
})

export type LoginValues = z.infer<typeof loginSchema>

export const signupSchema = z.object({
  name: z.string().min(2, "Enter your full name."),
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Use at least 8 characters."),
  referral: z.string().optional(),
})

export type SignupValues = z.infer<typeof signupSchema>
