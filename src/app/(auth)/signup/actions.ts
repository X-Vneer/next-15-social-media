"use server"

import { isRedirectError } from "next/dist/client/components/redirect-error"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { signUpSchema, SignUpValues } from "@/validation/auth"
import { hash } from "@node-rs/argon2"
import { generateIdFromEntropySize } from "lucia"

import { lucia } from "@/lib/lucia"
import prisma from "@/lib/prisma"

export async function signUp(credentials: SignUpValues): Promise<{ error: string }> {
  try {
    // checking for valid credentials
    const { error, success, data } = signUpSchema.safeParse(credentials)
    if (!success) {
      return {
        error: error.message,
      }
    }
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

    if (existingUsername)
      return {
        error: "Username is already used!",
      }

    const existingEmail = await prisma.user.findFirst({
      where: {
        email: {
          endsWith: email,
          mode: "insensitive",
        },
      },
    })

    if (existingEmail)
      return {
        error: "email is already used!",
      }

    const userId = generateIdFromEntropySize(10)

    await prisma.user.create({
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
    const cookiesStore = await cookies()
    cookiesStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)

    return redirect("/")
  } catch (error: any) {
    if (isRedirectError(error)) throw error
    console.error("🚀 ~ signUp ~ error:", error)
    return {
      error: "Something went wrong, Please try again.",
    }
  }
}
