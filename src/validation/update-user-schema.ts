import { z } from "zod"

export const updateUserSchema = z.object({
  displayName: z
    .string({ required_error: "displayName is required" })
    .trim()
    .min(1, "displayName is required")
    .max(30, "Must be at most 30 characters"),
  bio: z.string().max(220, "Must be at most 220 characters"),
})

export type UpdateUserProfile = z.infer<typeof updateUserSchema>
