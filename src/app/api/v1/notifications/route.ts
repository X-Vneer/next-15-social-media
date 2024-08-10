import { NextRequest, NextResponse } from "next/server"

import { validateRequest } from "@/lib/lucia"
import prisma from "@/lib/prisma"
import { getPostDataInclude, notificationInclude, NotificationPage } from "@/lib/prisma/types"

export async function GET(req: NextRequest) {
  try {
    const { user } = await validateRequest()

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const cursor = req.nextUrl.searchParams.get("cursor") || undefined
    const pageSize = 10
    const notifications = await prisma.notification.findMany({
      where: {
        recipientId: user.id,
      },
      include: notificationInclude,
      orderBy: {
        createdAt: "desc",
      },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    })

    const nextCursor = notifications.length > pageSize ? notifications[pageSize].id : undefined

    const response: NotificationPage = {
      notifications: notifications.slice(0, pageSize),
      search: {
        curser: nextCursor,
        pageSize: pageSize,
      },
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.log("🚀 ~ GET ~ error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
