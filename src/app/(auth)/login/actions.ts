"use server"

import { isRedirectError } from "next/dist/client/components/redirect-error"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { signInSchema, SignInValues } from "@/validation/auth"
import { verify } from "@node-rs/argon2"

import { lucia } from "@/lib/lucia"
import prisma from "@/lib/prisma"

export async function login(credentials: SignInValues): Promise<{ error: string }> {
  try {
    const { data, error, success } = signInSchema.safeParse(credentials)
    if (!success)
      return {
        error: error.message || "Invalid credentials",
      }

    const { username, password } = data
    const user = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    })

    if (!user || !user.passwordHash) {
      return {
        error: "Incorrect username or password",
      }
    }

    const validPassword = await verify(user.passwordHash, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    })

    if (!validPassword) {
      return {
        error: "Incorrect username or password",
      }
    }

    const session = await lucia.createSession(user.id, {})
    const sessionCookie = lucia.createSessionCookie(session.id)
    const cookiesStore = await cookies()
    cookiesStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)

    return redirect("/")
  } catch (error) {
    console.log("🚀 ~ login ~ error:", error)
    if (isRedirectError(error)) throw error
    return {
      error: "something went wrong!, please try again",
    }
  }
}
