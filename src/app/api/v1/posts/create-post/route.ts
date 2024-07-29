import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

import { validateRequest } from "@/lib/lucia"

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json()

    const session = await validateRequest()
    if (!session.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

    // const { content } = body
    return new Response("ok")
  } catch (error) {
    console.log("🚀 ~ POST ~ error:", error)
  }
}
