"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { lucia, validateRequest } from "@/lib/lucia"

export async function logout() {
  const { session } = await validateRequest()
  if (!session) {
    throw new Error("Unauthorized")
  }

  await lucia.invalidateSession(session.id)

  const sessionCookie = lucia.createBlankSessionCookie()
  const cookiesStore = await cookies()
  cookiesStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
  return redirect("/login")
}
