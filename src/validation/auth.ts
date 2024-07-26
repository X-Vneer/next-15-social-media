import { z } from "zod"

export const signUpSchema = z.object({
  email: z.string().toLowerCase().email("Invalid email address"),
  username: z
    .string({ required_error: "username is required" })
    .trim()
    .toLowerCase()
    .regex(/^[a-zA-Z0-9_-]+$/, "username must only contain letters , numbers - and _")
    .min(3, "username must be at least 3 characters")
    .max(20, "username must be less than 20 characters"),
  password: z
    .string({ required_error: "password is required" })
    .min(8, "password must be at least 8 characters")
    .max(20, "password must be less than 20 characters"),
})

export type SignUpValues = z.infer<typeof signUpSchema>

export const signInSchema = z.object({
  username: z
    .string({ required_error: "username is required" })
    .trim()
    .toLowerCase()
    .min(1, "username is required"),
  password: z
    .string({ required_error: "password is required" })
    .min(8, "password must be at least 8 characters")
    .max(20, "password must be less than 20 characters"),
})

export type SignInValues = z.infer<typeof signInSchema>
