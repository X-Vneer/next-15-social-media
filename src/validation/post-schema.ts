import { z } from "zod"

export const createPostSchema = z.object({
  content: z.string({ required_error: "content is required" }).trim().min(1, "content is required"),
})
