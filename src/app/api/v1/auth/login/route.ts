import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { signInSchema } from "@/validation/auth"
import { verify } from "@node-rs/argon2"

import { lucia } from "@/lib/lucia"
import prisma from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { data, error, success } = signInSchema.safeParse(body)
    if (!success) return NextResponse.json({ error: error.errors }, { status: 422 })

    const { username, password } = data
    const user = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    })

    if (!user || !user.passwordHash)
      return NextResponse.json({ error: "Incorrect username or password" }, { status: 401 })

    const validPassword = await verify(user.passwordHash, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    })

    if (!validPassword) return NextResponse.json({ error: "Incorrect username or password" }, { status: 403 })

    const session = await lucia.createSession(user.id, {})
    const sessionCookie = lucia.createSessionCookie(session.id)
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)

    delete (user as any).passwordHash
    return NextResponse.json(user, { status: 200 })
  } catch (error) {
    console.log("🚀 ~ POST ~ error:", error)
    return NextResponse.json({ error: "something went wrong!, please try again" }, { status: 500 })
  }
}
