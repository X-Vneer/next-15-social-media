import { NextRequest, NextResponse } from "next/server"

import { validateRequest } from "@/lib/lucia"
import prisma from "@/lib/prisma"
import { getPostDataInclude, PostsPage } from "@/lib/prisma/types"

export async function GET(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined

    const pageSize = 10

    const { user } = await validateRequest()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const posts = await prisma.post.findMany({
      where: { userId },
      include: getPostDataInclude(user.id),
      orderBy: { createdAt: "desc" },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    })

    const nextCursor = posts.length > pageSize ? posts[pageSize].id : null

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
    console.error(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
