"use server"

import { createPostSchema } from "@/validation/post-schema"

import { validateRequest } from "@/lib/lucia"
import prisma from "@/lib/prisma"
import { getPostDataInclude } from "@/lib/prisma/types"

export async function submitPost(input: { content: string; mediaIds: string[] }) {
  const { user } = await validateRequest()
  if (!user) {
    throw Error("Unauthorized")
  }
  const { data, success, error } = createPostSchema.safeParse(input)
  if (!success) {
    return {
      error: "Invalid content",
    }
  }

  const newPost = await prisma.post.create({
    data: {
      content: data.content,
      userId: user.id,
      attachments: {
        connect: data.mediaIds.map((id) => ({
          id,
        })),
      },
    },
    include: getPostDataInclude(user.id),
  })
  return newPost
}
