import { NextRequest, NextResponse } from "next/server"

import { validateRequest } from "@/lib/lucia"
import prisma from "@/lib/prisma"
import { NotificationCountInfo } from "@/lib/prisma/types"

export async function GET(req: NextRequest) {
  try {
    const { user } = await validateRequest()

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const unreadCount = await prisma.notification.count({
      where: {
        recipientId: user.id,
        read: false,
      },
    })
    const data: NotificationCountInfo = {
      unreadCount,
    }
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.log("🚀 ~ GET ~ error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
