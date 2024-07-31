import { NextRequest, NextResponse } from "next/server"

import { validateRequest } from "@/lib/lucia"
import prisma from "@/lib/prisma"

export async function POST(req: NextRequest, { params: { userId } }: { params: { userId: string } }) {
  try {
    const { user } = await validateRequest()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    // we use upsert instead of create to avoid throwing an error if the record already exists (possibly due to UI bugs)
    await prisma.follow.upsert({
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
    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
