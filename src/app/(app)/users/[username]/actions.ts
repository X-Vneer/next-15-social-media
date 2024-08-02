"use server"

import { UpdateUserSchema, type UpdateUserProfile } from "@/validation/update-user-schema"

import { validateRequest } from "@/lib/lucia"
import prisma from "@/lib/prisma"
import { getUserDateSelect, UserData } from "@/lib/prisma/types"

export async function UpdateUserProfile(values: UpdateUserProfile) {
  const validatedValues = UpdateUserSchema.safeParse(values)
  if (!validatedValues.success) throw Error("Invalid values")
  const { user } = await validateRequest()
  if (!user) throw Error("Unauthorized")

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { ...validatedValues.data },
    include: getUserDateSelect(user.id),
  })
  return updatedUser
}
