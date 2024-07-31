import { NextRequest, NextResponse } from "next/server"

import { validateRequest } from "@/lib/lucia"
import prisma from "@/lib/prisma"

export async function POST(req: NextRequest, { params: { userId } }: { params: { userId: string } }) {
  try {
    const { user } = await validateRequest()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    // we use deleteMany instead of delete to avoid throwing an error if the record already exists (possibly due to UI bugs)
    await prisma.follow.deleteMany({
      where: {
        followerId: user.id,
        followingId: userId,
      },
    })
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
