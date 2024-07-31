import { NextRequest, NextResponse } from "next/server"

import { validateRequest } from "@/lib/lucia"
import prisma from "@/lib/prisma"

export async function GET(req: NextRequest, { params: { userId } }: { params: { userId: string } }) {
  try {
    const { user } = await validateRequest()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    // a query to get the number of followers of a user and to check if it's followed by current user logged in
    const userToFollow = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        following: {
          where: {
            followingId: user.id,
          },
          select: {
            followingId: true,
          },
        },
        followers: {
          where: {
            followerId: user.id,
          },
          select: {
            followerId: true,
          },
        },
        _count: {
          select: {
            followers: true,
          },
        },
      },
    })

    if (!userToFollow) return NextResponse.json({ error: "User not found" }, { status: 404 })

    return NextResponse.json({
      followers: userToFollow?._count.followers,
      isFollowedByMe: !!userToFollow.followers.length,
      isFollowingMe: !!userToFollow.following.length,
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
