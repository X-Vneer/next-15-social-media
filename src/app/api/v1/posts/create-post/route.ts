import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { createPostSchema } from "@/validation/post-schema"

import { validateRequest } from "@/lib/lucia"
import prisma from "@/lib/prisma"

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json()
    const { user } = await validateRequest()
    if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

    const { data, success, error } = createPostSchema.safeParse(body)
    if (!success) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    const post = await prisma.post.create({
      data: {
        content: data.content,
        userId: user.id,
      },
    })

    return NextResponse.json({ post }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
