import { Prisma } from "@prisma/client"

export function getUerDateSelect(userId: string) {
  return {
    username: true,
    displayName: true,
    avatarUrl: true,
    id: true,
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
        followers: true,
      },
    },
  } satisfies Prisma.UserSelect
}

export function getPostDataInclude(userId: string) {
  return {
    user: {
      select: getUerDateSelect(userId),
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
