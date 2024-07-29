"use server"

import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { signUpSchema } from "@/validation/auth"
import { hash } from "@node-rs/argon2"
import { generateIdFromEntropySize } from "lucia"

import { lucia } from "@/lib/lucia"
import prisma from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // checking for valid credentials
    const { error, success, data } = signUpSchema.safeParse(body)
    if (!success) return NextResponse.json({ error: error.errors }, { status: 422 })
    const { username, email, password } = data
    const passwordHash = await hash(password, {
      // recommended minimum parameters
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    })

    // checking for username and email
    const existingUsername = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    })

    if (existingUsername) return NextResponse.json({ error: "Username is already used!" }, { status: 409 })

    const existingEmail = await prisma.user.findFirst({
      where: {
        email: {
          endsWith: email,
          mode: "insensitive",
        },
      },
    })

    if (existingEmail)
      return NextResponse.json(
        {
          error: "email is already used!",
        },
        { status: 409 },
      )

    const userId = generateIdFromEntropySize(10)

    const newUser = await prisma.user.create({
      data: {
        id: userId,
        username,
        email,
        displayName: username,
        passwordHash,
      },
    })
    const session = await lucia.createSession(userId, {})
    const sessionCookie = lucia.createSessionCookie(session.id)
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)

    delete (newUser as any).passwordHash
    return NextResponse.json({ user: newUser }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
