import { z } from "zod"

export const UpdateUserSchema = z.object({
  avatarUrl: z.string({ required_error: "avatarUrl is required" }).trim().min(1, "avatarUrl is required"),
  bio: z.string().max(220, "Must be at most 220 characters"),
})

export type UpdateUserProfile = z.infer<typeof UpdateUserSchema>
