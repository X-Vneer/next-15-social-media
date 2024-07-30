import { NextResponse } from "next/server"

import { validateRequest } from "@/lib/lucia"
import prisma from "@/lib/prisma"
import { postDataInclude } from "@/lib/prisma/types"

export async function GET() {
  try {
    const user = await validateRequest()

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const posts = await prisma.post.findMany({
      include: postDataInclude,
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(posts, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
