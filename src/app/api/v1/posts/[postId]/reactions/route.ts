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
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        userId: true,
      },
    })
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 })

    const operations = await prisma.$transaction([
      prisma.like.upsert({
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
      }),

      ...(user.id !== postId
        ? [
            prisma.notification.create({
              data: {
                issuerId: user.id,
                recipientId: post.userId,
                postId,
                type: "LIKE",
              },
            }),
          ]
        : []),
    ])
    console.log("🚀 ~ POST ~ operations:", operations)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.log("🚀 ~ POST ~ err:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
export const DELETE = async (req: NextRequest, { params: { postId } }: { params: { postId: string } }) => {
  try {
    const { user } = await validateRequest()
    if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 })
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        userId: true,
      },
    })
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 })

    await prisma.$transaction([
      prisma.like.deleteMany({
        where: {
          userId: user.id,
          postId,
        },
      }),

      prisma.notification.deleteMany({
        where: {
          issuerId: user.id,
          recipientId: post.userId,
          postId,
          type: "LIKE",
        },
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (err) {
    console.log("🚀 ~ POST ~ err:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
