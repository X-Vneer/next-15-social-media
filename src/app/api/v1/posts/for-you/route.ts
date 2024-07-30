import { NextRequest, NextResponse } from "next/server"

import { validateRequest } from "@/lib/lucia"
import prisma from "@/lib/prisma"
import { postDataInclude } from "@/lib/prisma/types"

export async function GET(req: NextRequest) {
  try {
    const user = await validateRequest()

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const cursor = req.nextUrl.searchParams.get("cursor") || undefined
    const pageSize = 15
    const posts = await prisma.post.findMany({
      include: postDataInclude,
      orderBy: {
        createdAt: "desc",
      },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    })

    const nextCursor = posts.length > pageSize ? posts[posts.length - 1].id : undefined

    return NextResponse.json(
      {
        posts: posts.slice(0, pageSize),
        search: {
          nextCursor,
          pageSize: pageSize,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
