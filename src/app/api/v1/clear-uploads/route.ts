import { NextRequest, NextResponse } from "next/server"
import { UTApi } from "uploadthing/server"

import prisma from "@/lib/prisma"

export const GET = async (req: NextRequest) => {
  try {
    // vercel will set this header automatically for you using the .env file
    const authHeader = req.headers.get("Authorization")
    console.log("🚀 ~ GET ~ authHeader:", authHeader, process.env.CRON_SECRET)
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const unUsedMedia = await prisma.media.findMany({
      where: {
        postId: null,
        ...(process.env.NODE_ENV === "production"
          ? { createAt: { lte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }
          : {}),
      },
      select: {
        id: true,
        url: true,
      },
    })
    console.log("🚀 ~ GET ~ unUsedMedia:", unUsedMedia)

    new UTApi().deleteFiles(
      unUsedMedia.map((media) => media.url.split(`/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`)[1]),
    )

    await prisma.media.deleteMany({
      where: {
        id: {
          in: unUsedMedia.map((media) => media.id),
        },
      },
    })

    return new Response("ok")
  } catch (error) {
    console.log("🚀 ~ GET ~ error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
