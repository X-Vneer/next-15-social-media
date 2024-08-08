import { NextRequest, NextResponse } from "next/server"

import { validateRequest } from "@/lib/lucia"
import prisma from "@/lib/prisma"
import { LikeInfo } from "@/lib/prisma/types"

export const GET = async (req: NextRequest, { params: { postId } }: { params: { postId: string } }) => {
  try {
    const { user } = await validateRequest()
    if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 })
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        likes: {
          where: {
            userId: user.id,
          },
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    })

    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 })

    const data: LikeInfo = {
      likes: post._count.likes,
      isLikedByMe: !!post.likes.length,
    }

    return NextResponse.json(data)
  } catch (error) {
    console.log("🚀 ~ POST ~ error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const POST = async (req: NextRequest, { params: { postId } }: { params: { postId: string } }) => {
  try {
    const { user } = await validateRequest()
    if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 })
    const post = await prisma.like.upsert({
      where: {
        userId_postId: {
          userId: user.id,
          postId,
        },
      },
      create: {
        userId: user.id,
        postId,
      },
      update: {},
    })
    console.log("🚀 ~ POST ~ post:", post)
    return new Response()
  } catch (err) {
    console.log("🚀 ~ POST ~ err:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
export const DELETE = async (req: NextRequest, { params: { postId } }: { params: { postId: string } }) => {
  try {
    const { user } = await validateRequest()
    if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 })
    const post = await prisma.like.deleteMany({
      where: {
        userId: user.id,
        postId,
      },
    })
    console.log("🚀 ~ DELETE ~ post:", post)
    return new Response()
  } catch (err) {
    console.log("🚀 ~ POST ~ err:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
