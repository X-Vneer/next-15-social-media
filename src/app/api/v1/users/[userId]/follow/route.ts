import { NextRequest, NextResponse } from "next/server"

import { validateRequest } from "@/lib/lucia"
import prisma from "@/lib/prisma"

export async function POST(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params
  try {
    const { user } = await validateRequest()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    // we use upsert instead of create to avoid throwing an error if the record already exists (possibly due to UI bugs)
    const upsert = prisma.follow.upsert({
      where: {
        followerId_followingId: {
          followerId: user.id,
          followingId: userId,
        },
      },
      create: {
        followerId: user.id,
        followingId: userId,
      },
      update: {},
    })

    const notification = prisma.notification.create({
      data: {
        issuerId: user.id,
        recipientId: userId,
        type: "FOLLOW",
      },
    })

    await prisma.$transaction([upsert, notification])

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
