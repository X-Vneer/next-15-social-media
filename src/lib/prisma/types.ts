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
    attachments: true,
    bookmarks: {
      where: {
        userId: userId,
      },
      select: {
        userId: true,
      },
    },
    likes: {
      where: {
        userId: userId,
      },
      select: {
        userId: true,
      },
    },
    _count: {
      select: {
        likes: true,
        comments: true,
      },
    },
  } satisfies Prisma.PostInclude
}

export function getCommentDataInclude(userId: string) {
  return {
    user: {
      select: getUserDateSelect(userId),
    },
  } satisfies Prisma.CommentInclude
}

export type CommentData = Prisma.CommentGetPayload<{ include: ReturnType<typeof getCommentDataInclude> }>

export type CommentPage = {
  comments: CommentData[]
  search: {
    curser?: string
    pageSize: number
  }
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

export type LikeInfo = {
  likes: number
  isLikedByMe: boolean
}

export type BookmarkInfo = {
  isBookmarkedByMe: boolean
}

export const notificationInclude = {
  issuer: {
    select: {
      username: true,
      displayName: true,
      avatarUrl: true,
    },
  },
  post: {
    select: {
      content: true,
    },
  },
} satisfies Prisma.NotificationInclude

export type NotificationData = Prisma.NotificationGetPayload<{ include: typeof notificationInclude }>

export type NotificationPage = {
  notifications: NotificationData[]
  search: {
    curser?: string
    pageSize: number
  }
}

export type NotificationCountInfo = {
  unreadCount: number
}
