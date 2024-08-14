import { NextRequest, NextResponse } from "next/server"

import { validateRequest } from "@/lib/lucia"
import prisma from "@/lib/prisma"
import { getPostDataInclude, PostsPage } from "@/lib/prisma/types"

export async function GET(req: NextRequest) {
  try {
    const { user } = await validateRequest()

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const q = req.nextUrl.searchParams.get("q") || ""

    // this is for prisma text search
    const searchQuery = q.split(" ").join("&")

    const cursor = req.nextUrl.searchParams.get("cursor") || undefined
    const pageSize = 15
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          {
            content: {
              search: searchQuery,
            },
          },
          {
            user: {
              displayName: {
                search: searchQuery,
              },
            },
          },
          {
            user: {
              username: {
                search: searchQuery,
              },
            },
          },
        ],
      },
      include: getPostDataInclude(user.id),
      orderBy: {
        createdAt: "desc",
      },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    })

    const nextCursor = posts.length > pageSize ? posts[pageSize].id : undefined

    const data: PostsPage = {
      posts: posts.slice(0, pageSize),
      search: {
        nextCursor,
        pageSize: pageSize,
      },
    }
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.log("🚀 ~ GET ~ error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
