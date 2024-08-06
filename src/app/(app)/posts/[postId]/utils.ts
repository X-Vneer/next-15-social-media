import { cache } from "react"
import { notFound } from "next/navigation"
import { User } from "lucia"

import { validateRequest } from "@/lib/lucia"
import prisma from "@/lib/prisma"
import { getPostDataInclude } from "@/lib/prisma/types"

export const getPost = cache(async (postId: string, user: User) => {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: getPostDataInclude(user.id),
  })

  if (!post) notFound()

  return post
})
