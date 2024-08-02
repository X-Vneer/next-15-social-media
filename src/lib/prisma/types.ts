import { Prisma } from "@prisma/client"

export function getUserDateSelect(userId: string) {
  return {
    username: true,
    displayName: true,
    avatarUrl: true,
    id: true,
    bio: true,
    createdAt: true,
    following: {
      where: {
        followingId: userId,
      },
      select: {
        followingId: true,
      },
    },
    followers: {
      where: {
        followerId: userId,
      },
      select: {
        followerId: true,
      },
    },
    _count: {
      select: {
        posts: true,
        followers: true,
      },
    },
  } satisfies Prisma.UserSelect
}

export type UserData = Prisma.UserGetPayload<{ select: ReturnType<typeof getUserDateSelect> }>

export function getPostDataInclude(userId: string) {
  return {
    user: {
      select: getUserDateSelect(userId),
    },
  } satisfies Prisma.PostInclude
}

export type PostData = Prisma.PostGetPayload<{ include: ReturnType<typeof getPostDataInclude> }>

export type PostsPage = {
  posts: PostData[]
  search: {
    nextCursor?: string
    pageSize: number
  }
}

export type FollowerInfo = {
  followers: number
  isFollowedByMe: boolean
  isFollowingMe: boolean
}
