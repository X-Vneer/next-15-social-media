import { z } from "zod"

export const createCommentSchema = z.object({
  content: z.string().min(1, "comment is required"),
})

export type CreateCommentType = z.infer<typeof createCommentSchema>
