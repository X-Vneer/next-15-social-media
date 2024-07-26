import { z } from "zod"

export const singUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  username: z
    .string({ required_error: "username is required" })
    .trim()
    .regex(/^[a-zA-Z0-9_-]+$/, "username must only contain letters , numbers - and _")
    .min(3, "username must be at least 3 characters")
    .max(20, "username must be less than 20 characters"),
  password: z
    .string({ required_error: "password is required" })
    .min(8, "password must be at least 8 characters")
    .max(20, "password must be less than 20 characters"),
})

export type SingUpValues = z.infer<typeof singUpSchema>

export const signInSchema = z.object({
  username: z.string({ required_error: "username is required" }).trim().min(1, "username is required"),
  password: z
    .string({ required_error: "password is required" })
    .min(8, "password must be at least 8 characters")
    .max(20, "password must be less than 20 characters"),
})
