import { NextRequest, NextResponse } from "next/server"

import { validateRequest } from "@/lib/lucia"
import prisma from "@/lib/prisma"
import { getUserDateSelect } from "@/lib/prisma/types"

export const GET = async (req: NextRequest, { params: { username } }: { params: { username: string } }) => {
  try {
    const session = await validateRequest()
    if (!session.user) return NextResponse.json("Unauthorized", { status: 401 })

    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
      select: getUserDateSelect(session.user.id),
    })

    if (!user) return NextResponse.json("User not found", { status: 404 })

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json("Internal Server Error", { status: 500 })
  }
}
