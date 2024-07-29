import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { lucia, validateRequest } from "@/lib/lucia"

export const POST = async () => {
  try {
    const { session } = await validateRequest()
    if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

    await lucia.invalidateSession(session.id)

    const sessionCookie = lucia.createBlankSessionCookie()
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)

    return new Response("ok")
  } catch (error: any) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
