"use server"

import { validateRequest } from "@/lib/lucia"
import prisma from "@/lib/prisma"
import { postDataInclude } from "@/lib/prisma/types"

export async function deletePost(id: string) {
  const { user } = await validateRequest()
  if (!user) {
    throw Error("Unauthorized")
  }
  const post = await prisma.post.delete({
    where: {
      id: id,
      userId: user.id,
    },
    include: postDataInclude,
  })
  if (!post) throw Error("Could not delete post")

  return post
}
