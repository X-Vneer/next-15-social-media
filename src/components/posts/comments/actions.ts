"use server"

import { createCommentSchema } from "@/validation/comment"

import { validateRequest } from "@/lib/lucia"
import prisma from "@/lib/prisma"
import { getCommentDataInclude, PostData } from "@/lib/prisma/types"

export async function createComment({ content, post }: { content: string; post: PostData }) {
  const { data, success, error } = createCommentSchema.safeParse({ content })
  if (!success) {
    return {
      error: "Invalid content",
    }
  }

  const { user } = await validateRequest()
  if (!user)
    return {
      error: "Unauthorized",
    }

  const newComment = await prisma.comment.create({
    data: {
      content: data.content,
      postId: post.id,
      userId: user.id,
    },
    include: getCommentDataInclude(user.id),
  })

  return newComment
}
