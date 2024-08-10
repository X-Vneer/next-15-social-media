import { NextRequest, NextResponse } from "next/server"

import { validateRequest } from "@/lib/lucia"
import prisma from "@/lib/prisma"
import { getCommentDataInclude } from "@/lib/prisma/types"

export const GET = async (req: NextRequest, { params: { postId } }: { params: { postId: string } }) => {
  try {
    const { user } = await validateRequest()
    if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

    const courser = req.nextUrl.searchParams.get("cursor") ?? undefined
    const pageSize = 5

    const comments = await prisma.comment.findMany({
      where: {
        postId,
      },
      include: getCommentDataInclude(user.id),
      orderBy: {
        createdAt: "asc",
      },
      take: -pageSize - 1,
      cursor: courser ? { id: courser } : undefined,
    })

    const nextCursor = comments.length > pageSize ? comments[0].id : undefined

    return NextResponse.json(
      {
        comments: comments.length > pageSize ? comments.slice(1) : comments,
        search: {
          curser: nextCursor,
          pageSize: pageSize,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.log("🚀 /[postId]/comments ~ GET ~ error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
