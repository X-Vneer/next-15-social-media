import { cache } from "react"
import { notFound } from "next/navigation"

import { validateRequest } from "@/lib/lucia"
import prisma from "@/lib/prisma"
import { getUserDateSelect } from "@/lib/prisma/types"

export const getUser = cache(async (username: string) => {
  console.log("🚀 ~ getUser ~ username:", username)
  const session = await validateRequest()
  const user = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
      },
    },
    select: getUserDateSelect(session.user!.id),
  })
  if (!user) notFound()

  return user
})
