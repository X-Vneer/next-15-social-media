import { NextRequest, NextResponse } from "next/server"

import { validateRequest } from "@/lib/lucia"
import prisma from "@/lib/prisma"

export const POST = async (req: NextRequest, { params }: { params: Promise<{ postId: string }> }) => {
  const { postId } = await params
  try {
    const { user } = await validateRequest()
    if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 })
    const post = await prisma.bookmark.upsert({
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
    return new Response()
  } catch (err) {
    console.log("🚀 ~ POST ~ err:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
export const DELETE = async (req: NextRequest, { params }: { params: Promise<{ postId: string }> }) => {
  const { postId } = await params
  try {
    const { user } = await validateRequest()
    if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 })
    const post = await prisma.bookmark.deleteMany({
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
