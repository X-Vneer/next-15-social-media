"use server"

import { updateUserSchema, type UpdateUserProfile } from "@/validation/update-user-schema"

import { validateRequest } from "@/lib/lucia"
import prisma from "@/lib/prisma"
import { getUserDateSelect, UserData } from "@/lib/prisma/types"

export async function UpdateUserProfile(values: UpdateUserProfile) {
  const validatedValues = updateUserSchema.safeParse(values)
  if (!validatedValues.success) throw Error("Invalid values")
  const { user } = await validateRequest()
  if (!user) throw Error("Unauthorized")
  console.log(validatedValues.data)

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { ...validatedValues.data },
    select: getUserDateSelect(user.id),
  })
  return updatedUser
}
